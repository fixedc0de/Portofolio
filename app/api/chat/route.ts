// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Gunakan hanya 3 model yang paling stabil
const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "moonshotai/kimi-k2.6:free",
  "google/gemma-4-26b-a4b-it:free",
  "poolside/laguna-m.1:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "liquid/lfm-2.5-1.2b-thinking:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "poolside/laguna-xs.2:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3.5-content-safety:free", // Akan di-skip otomatis oleh fallback jika tidak support chat
  "openrouter/owl-alpha" // Akan di-skip jika tidak free atau error
];

export async function POST(req: Request) {
  try {
    const { messages, userName, userHonorific } = await req.json();

    const systemPrompt = {
      role: "system",
      content: `Kamu adalah AI asisten portofolio Khansa Gunawan. Jawab dengan ramah, natural, singkat, dan jujur.

PENTING: User yang sedang chat sekarang bernama "${userName}" dan ingin disapa "${userHonorific} ${userName}". Gunakan sapaan ini di awal percakapan atau saat relevan, tapi jangan berlebihan (cukup 1-2 kali saja).

PROFIL KHANSA:
- Mahasiswa S1 Teknik Informatika UTB (Angkatan 2025, Semester 2)
- Domisili: Tangerang Selatan
- Tertarik pada AI dan Web Development

SKILL:
- JavaScript (aktif dipelajari)
- Python (dasar)
- Node.js (proyek nyata)

ORGANISASI:
- Himatif (Himpunan Mahasiswa Teknik Informatika UTB)
- Oxygen (Divisi Software)

PROYEK:
- Jadwalin: Web manajemen jadwal kuliah (Node.js)
  GitHub: github.com/fixedc0de/Jadwalin

TUJUAN: Sedang membuka peluang magang (Web/AI)

KONTAK:
- Email: knsgnwn.10@gmail.com
- GitHub: github.com/fixedc0de

ATURAN JAWABAN:
1. Gunakan fakta di atas saja, jangan mengarang
2. Jujur: masih semester 2, belum ada IPK final/skripsi/pengalaman kerja
3. Jawaban singkat dan padat (2-4 kalimat)
4. Jika pertanyaan melenceng, arahkan kembali dengan sopan
5. Jika tidak tahu, jawab: "Untuk info lebih lanjut, ${userHonorific} ${userName} bisa langsung hubungi Khansa di knsgnwn.10@gmail.com"`
    };

    const allMessages = [systemPrompt, ...messages];

    for (const model of FREE_MODELS) {
      try {
        const completion = await client.chat.completions.create({
          model: model,
          messages: allMessages,
          temperature: 0.7,
        });
        
        return NextResponse.json({ 
          reply: completion.choices[0].message.content,
          modelUsed: model 
        });

      } catch (error: any) {
        // PERBAIKAN: Tangani SEMUA jenis error agar tidak crash (500)
        const status = error.status || 500;
        console.log(`⚠️ Model ${model} gagal (Status ${status}), mencoba berikutnya...`);
        
        // Lanjut ke model berikutnya untuk SEMUA error, kecuali API Key salah (401)
        if (status !== 401) {
          continue; 
        }
        
        throw error;
      }
    }

    // Jika semua model gagal (kuota habis)
    return NextResponse.json({ 
      error: "Asisten AI sedang sangat sibuk atau batas penggunaan harian telah tercapai. Silakan coba lagi nanti, atau hubungi langsung Khansa di knsgnwn.10@gmail.com." 
    }, { status: 503 });

  } catch (error) {
    console.error("AI Backend Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server AI." }, { status: 500 });
  }
}