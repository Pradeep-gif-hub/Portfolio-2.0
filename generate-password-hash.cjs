const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Admin Password Hash Generator\n');
console.log('This will generate a bcrypt hash for your new admin password.');
console.log('You\'ll need to update both VITE_ADMIN_PASSWORD and ADMIN_PASSWORD_HASH\n');

rl.question('Enter your new admin password: ', async (password) => {
  if (!password || password.trim().length < 4) {
    console.log('\n❌ Password must be at least 4 characters long\n');
    rl.close();
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    
    console.log('\n✅ Password hash generated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Update these in your .env.local file:\n');
    console.log(`VITE_ADMIN_PASSWORD=${password}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Update these in Vercel Environment Variables:\n');
    console.log(`VITE_ADMIN_PASSWORD=${password}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Remember to redeploy on Vercel after updating environment variables!\n');
    
  } catch (error) {
    console.log('\n❌ Error generating hash:', error.message, '\n');
  }
  
  rl.close();
});
