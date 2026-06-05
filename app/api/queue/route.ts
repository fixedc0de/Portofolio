// app/api/queue/route.ts
import { NextResponse } from 'next/server';

interface QueueEntry {
  id: string;
  name: string;
  honorific: 'Bapak' | 'Ibu';
  joinedAt: number;
  status: 'waiting' | 'active';
  lastActivity: number;
}

// In-memory queue
const queue: Map<string, QueueEntry> = new Map();

// Timeout: 5 menit
const IDLE_TIMEOUT = 5 * 60 * 1000;

// Bersihkan user idle
function cleanupIdleUsers() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [id, entry] of queue.entries()) {
    if (now - entry.lastActivity > IDLE_TIMEOUT) {
      queue.delete(id);
      cleaned++;
      console.log(`🧹 User ${entry.name} (${id}) dihapus karena idle`);
    }
  }
  
  if (cleaned > 0) {
    promoteNextUser();
  }
}

// Promote user berikutnya ke active
function promoteNextUser() {
  const hasActive = Array.from(queue.values()).some(e => e.status === 'active');
  
  if (!hasActive) {
    const waitingUsers = Array.from(queue.values())
      .filter(e => e.status === 'waiting')
      .sort((a, b) => a.joinedAt - b.joinedAt);
    
    if (waitingUsers.length > 0) {
      waitingUsers[0].status = 'active';
      console.log(`✅ User ${waitingUsers[0].name} dipromosikan ke ACTIVE`);
    }
  }
}

// Helper: Posisi di antrian
function getPositionInQueue(id: string): number {
  const entries = Array.from(queue.values())
    .filter(e => e.status === 'waiting')
    .sort((a, b) => a.joinedAt - b.joinedAt);
  
  const index = entries.findIndex(e => e.id === id);
  return index === -1 ? 0 : index + 1;
}

// Helper: Hitung yang menunggu
function getWaitingCount(): number {
  return Array.from(queue.values()).filter(e => e.status === 'waiting').length;
}

export async function POST(req: Request) {
  cleanupIdleUsers();
  
  try {
    const { action, id, name, honorific } = await req.json();
    
    console.log(`\n📥 Queue API Request:`, { action, id, name });
    console.log(`📊 Current Queue Size: ${queue.size}`);
    
    // JOIN: User baru masuk
    if (action === 'join') {
      if (!id || !name || !honorific) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      
      // Cek apakah user sudah ada
      if (queue.has(id)) {
        const entry = queue.get(id)!;
        entry.lastActivity = Date.now();
        entry.status = 'active'; // Pastikan status active
        
        console.log(`✅ User ${name} sudah ada, status: ${entry.status}`);
        
        return NextResponse.json({
          status: entry.status,
          position: 0,
          totalWaiting: getWaitingCount()
        });
      }
      
      // Cek apakah ada yang sedang aktif
      const hasActive = Array.from(queue.values()).some(e => e.status === 'active');
      
      const newEntry: QueueEntry = {
        id,
        name,
        honorific,
        joinedAt: Date.now(),
        status: hasActive ? 'waiting' : 'active',
        lastActivity: Date.now()
      };
      
      queue.set(id, newEntry);
      
      console.log(`🆕 User ${name} bergabung. Status: ${newEntry.status}`);
      console.log(`📊 Total Active: ${Array.from(queue.values()).filter(e => e.status === 'active').length}`);
      console.log(`📊 Total Waiting: ${getWaitingCount()}`);
      
      return NextResponse.json({
        status: newEntry.status,
        position: hasActive ? getPositionInQueue(id) : 0,
        totalWaiting: getWaitingCount()
      });
    }
    
    // STATUS: Cek posisi
    if (action === 'status') {
      if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
      }
      
      const entry = queue.get(id);
      if (!entry) {
        console.log(`❌ User ${id} tidak ditemukan di queue`);
        return NextResponse.json({ error: 'User not found in queue' }, { status: 404 });
      }
      
      entry.lastActivity = Date.now();
      
      console.log(`📍 Status check: ${entry.name} - ${entry.status} (posisi: ${getPositionInQueue(id)})`);
      
      return NextResponse.json({
        status: entry.status,
        position: getPositionInQueue(id),
        totalWaiting: getWaitingCount(),
        name: entry.name,
        honorific: entry.honorific
      });
    }
    
    // LEAVE: User keluar
    if (action === 'leave') {
      if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
      }
      
      const entry = queue.get(id);
      if (entry) {
        console.log(`👋 User ${entry.name} keluar dari chat`);
        queue.delete(id);
        promoteNextUser();
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Queue API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}