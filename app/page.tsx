// app/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type QueueStatus = {
  status: 'waiting' | 'active';
  position: number;
  totalWaiting: number;
};

export default function Home() {
  // Chat states
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Queue & User states
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'waiting' | 'chat'>('form');
  const [userName, setUserName] = useState("");
  const [honorific, setHonorific] = useState<'Bapak' | 'Ibu'>('Bapak');
  const [userId, setUserId] = useState<string>("");
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate unique user ID on first load
  useEffect(() => {
    let storedId = localStorage.getItem('chatUserId');
    if (!storedId) {
      storedId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatUserId', storedId);
    }
    setUserId(storedId);
    
    // Check if user already has name saved
    const savedName = localStorage.getItem('chatUserName');
    const savedHonorific = localStorage.getItem('chatUserHonorific') as 'Bapak' | 'Ibu';
    if (savedName && savedHonorific) {
      setUserName(savedName);
      setHonorific(savedHonorific);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (step === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, step]);

  // Polling untuk cek status antrian// Polling untuk cek status antrian
  useEffect(() => {
    if (step !== 'waiting' || !userId) return;

    console.log(`🔄 Mulai polling untuk user ${userId}`);

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status', id: userId })
        });
        
        const data = await res.json();
        
        console.log(`📡 Polling result:`, data);
        
        if (data.status === 'active') {
          console.log(`✅ User ${userName} sekarang ACTIVE!`);
          setStep('chat');
          setMessages([{
            role: 'assistant',
            content: `Halo ${honorific} ${userName}! 👋 Saya asisten virtual Khansa. Ada yang bisa saya bantu seputar portofolio, skill, atau kuliah di UTB?`,
            timestamp: new Date()
          }]);
          clearInterval(pollInterval);
        } else {
          setQueueStatus(data);
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
    }, 2000);

    return () => {
      console.log(`🛑 Stop polling untuk user ${userId}`);
      clearInterval(pollInterval);
    };
  }, [step, userId, userName, honorific]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const toggleChat = () => setIsOpen(!isOpen);

  // Handle form submission
  const handleJoinQueue = async () => {
    if (!userName.trim()) return;

    // Save to localStorage
    localStorage.setItem('chatUserName', userName);
    localStorage.setItem('chatUserHonorific', honorific);

    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          id: userId,
          name: userName,
          honorific: honorific
        })
      });

      const data = await res.json();
      
      if (data.status === 'active') {
        // Langsung bisa chat
        setStep('chat');
        setMessages([{
          role: 'assistant',
          content: `Halo ${honorific} ${userName}! 👋 Saya asisten virtual Khansa. Ada yang bisa saya bantu?`,
          timestamp: new Date()
        }]);
      } else {
        // Masuk antrian
        setStep('waiting');
        setQueueStatus(data);
      }
    } catch (error) {
      console.error('Join queue error:', error);
    }
  };

  // Handle leave queue/chat
  const handleLeave = async () => {
    try {
      await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', id: userId })
      });
    } catch (error) {
      console.error('Leave error:', error);
    }
    
    // Reset states
    setStep('form');
    setMessages([]);
    setQueueStatus(null);
    setIsOpen(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          userName,
          userHonorific: honorific
        }),
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: new Date() }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, saya sedang sibuk. Coba lagi dalam beberapa saat.", timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Terjadi kesalahan koneksi.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* HERO SECTION */}
        <section className="mb-20 md:mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs tracking-widest uppercase text-amber-200/80 backdrop-blur-sm">
                Portfolio 2026
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-br from-white via-amber-100 to-amber-300/80 bg-clip-text text-transparent">Khansa</span>
                <span className="block bg-gradient-to-br from-amber-200/60 via-rose-200/40 to-transparent bg-clip-text text-transparent italic font-light">Gunawan</span>
              </h1>

              <div className="h-px w-24 bg-gradient-to-r from-amber-400/50 to-transparent"></div>

              <div className="space-y-2 text-lg text-white/70">
                <p className="font-light"><span className="text-amber-200/90 font-normal">S1 Teknik Informatika</span></p>
                <p className="text-sm text-white/50">Universitas Teknologi Bandung</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {["Web Development", "AI Enthusiast", "Problem Solver"].map((skill) => (
                  <span key={skill} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-transparent blur-3xl animate-pulse"></div>
              <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float">
                <div className="absolute inset-0 border-2 border-amber-400/20 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph-slow"></div>
                <div className="absolute inset-4 border border-rose-400/10 rounded-[70%_30%_30%_70%/70%_70%_30%_30%] animate-morph-reverse"></div>
                <img 
                  src="/profile.jpg" 
                  alt="Khansa Gunawan" 
                  className="relative w-full h-full object-cover rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-2xl shadow-amber-500/20 animate-morph"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn.phototourl.com/free/2026-06-05-fb76a240-7008-41b1-b62b-36efd5116e14.jpg"; }}
                />
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed italic">
              "Selamat datang di ruang digital saya. Saya antusias menjelajahi batas antara 
              <span className="text-amber-200/90 not-italic font-normal"> teknologi </span> 
              dan <span className="text-rose-200/90 not-italic font-normal"> kreativitas</span>, 
              terutama dalam pengembangan web dan kecerdasan buatan."
            </p>
          </div>
        </section>

        <footer className="mt-20 text-center text-white/30 text-sm pb-24">
          <p>© 2026 Khansa Gunawan • Fixedc0de</p>
        </footer>
      </div>

      {/* ========================================== */}
      {/* FLOATING CHAT WIDGET DENGAN QUEUE SYSTEM   */}
      {/* ========================================== */}

      {/* CHAT WINDOW */}
      <div 
        className={`fixed bottom-24 right-6 md:right-8 z-50 w-[calc(100%-3rem)] max-w-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-[550px] max-h-[75vh]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600/20 to-rose-600/20 border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  KG
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1a1a1a] rounded-full"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Khansa Gunawan</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>Online • Siap membantu</span>
                </div>
              </div>

              <button 
                onClick={toggleChat}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                title="Minimize chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Area - Conditional Rendering */}
          <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
            
            {/* STEP 1: FORM NAMA & SAPAAN */}
            {step === 'form' && (
              <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    KG
                  </div>
                  <h3 className="text-lg font-semibold text-white">Sebelum Mulai</h3>
                  <p className="text-sm text-white/60">Mohon isi data berikut untuk melanjutkan</p>
                </div>

                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Nama Panggilan</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Contoh: Budi"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Sapaan</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setHonorific('Bapak')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          honorific === 'Bapak'
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        Bapak
                      </button>
                      <button
                        onClick={() => setHonorific('Ibu')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          honorific === 'Ibu'
                            ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        Ibu
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinQueue}
                    disabled={!userName.trim()}
                    className="w-full bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none"
                  >
                    Mulai Chat
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: WAITING IN QUEUE */}
            {step === 'waiting' && queueStatus && (
              <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
                <div className="text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-amber-400">{queueStatus.position}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Anda dalam Antrian</h3>
                    <p className="text-white/60">
                      {honorific} {userName}, posisi Anda saat ini:
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Posisi Antrian</span>
                      <span className="text-lg font-bold text-amber-400">#{queueStatus.position}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Total Menunggu</span>
                      <span className="text-lg font-bold text-white">{queueStatus.totalWaiting}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/40 text-center">
                    Mohon tunggu, Anda akan otomatis masuk ketika giliran tiba...
                  </p>
                </div>

                <button
                  onClick={handleLeave}
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Batalkan & Keluar
                </button>
              </div>
            )}

            {/* STEP 3: CHAT INTERFACE */}
            {step === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
                      <div className="flex-shrink-0">
                        {msg.role === "assistant" ? (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white text-[10px] font-bold">KG</div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user" 
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm" 
                            : "bg-[#2a2a2a] border border-white/5 text-white/90 rounded-bl-sm"
                        }`}>
                          <div className="max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <span className="font-semibold text-amber-300" {...props} />,
                                code: ({node, ...props}) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                                em: ({node, ...props}) => <em className="italic text-white/70" {...props} />,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">KG</div>
                      <div className="bg-[#2a2a2a] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-white/10 p-3 bg-[#1a1a1a]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                      placeholder="Ketik pesan..."
                      className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 transition-all text-sm"
                      disabled={loading}
                    />
                    <button 
                      onClick={sendMessage} 
                      disabled={loading || !input.trim()}
                      className="bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-amber-500/20 disabled:shadow-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-white/30">
                      Ditenagai oleh AI • Respon otomatis
                    </p>
                    <button
                      onClick={handleLeave}
                      className="text-[10px] text-white/40 hover:text-white/60 transition-colors"
                    >
                      Akhiri Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 md:right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen 
            ? "bg-white/10 backdrop-blur-md border border-white/20 rotate-90 scale-90 hover:bg-white/20" 
            : "bg-gradient-to-br from-amber-500 to-rose-500 hover:scale-110 shadow-amber-500/30"
        }`}
        title={isOpen ? "Minimize chat" : "Buka chat"}
      >
        {!isOpen && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
        
        {isOpen && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        )}

        {!isOpen && step !== 'chat' && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-[#0a0a0a] rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes morph { 0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; } 50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; } }
        @keyframes morph-slow { 0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(0deg); } 50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; transform: rotate(180deg); } }
        @keyframes morph-reverse { 0%, 100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: rotate(0deg); } 50% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; transform: rotate(-180deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-morph { animation: morph 8s ease-in-out infinite; }
        .animate-morph-slow { animation: morph-slow 12s ease-in-out infinite; }
        .animate-morph-reverse { animation: morph-reverse 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </main>
  );
}