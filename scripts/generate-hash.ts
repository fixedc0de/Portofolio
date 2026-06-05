// scripts/generate-hash.ts
import { hashPassword } from '../lib/auth';

async function main() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('Usage: npx tsx scripts/generate-hash.ts <your-password>');
    process.exit(1);
  }

  const hash = await hashPassword(password);
  console.log('Generated hash:');
  console.log(hash);
  console.log('\nAdd this to your .env.local as ADMIN_PASSWORD_HASH');
}

main().catch(console.error);