const db = require('./db');
const fs = require('fs');
const path = require('path');

async function fixSeed() {
  try {
    console.log('🔧 Starting seed fix...\n');

    const sqlFile = fs.readFileSync(path.join(__dirname, 'fix_seed.sql'), 'utf8');
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.length < 10) continue;

      try {
        await db.query(statement);
        console.log(`✅ Statement ${i + 1} executed`);
      } catch (err) {
        // ข้าม error ถ้าเป็น "does not exist" หรือ "duplicate"
        if (err.message.includes('does not exist') || err.message.includes('duplicate')) {
          console.log(`⏭️  Statement ${i + 1} skipped (${err.message.substring(0, 50)})`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, err.message);
        }
      }
    }

    console.log('\n✅ Seed fix completed!');

  } catch (err) {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  }
}

fixSeed()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

