const db = require('./db');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // อ่าน seed.sql
    const sqlFile = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    // แยกคำสั่ง SQL แต่ละคำสั่ง (ระวัง semicolon ใน VALUES)
    const statements = [];
    let currentStatement = '';
    const lines = sqlFile.split('\n');
    let inValues = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // ข้าม comment lines
      if (trimmed.startsWith('--') || trimmed.length === 0) {
        continue;
      }
      
      currentStatement += line + '\n';
      
      // ตรวจสอบว่าเข้า VALUES block หรือไม่
      if (trimmed.match(/VALUES\s*$/i) || trimmed.match(/INSERT INTO/i)) {
        inValues = true;
      }
      
      // ถ้าเจอ semicolon และ statement ไม่ว่าง
      if (trimmed.endsWith(';') && currentStatement.trim().length > 10) {
        statements.push(currentStatement.trim());
        currentStatement = '';
        inValues = false;
      }
    }
    
    // เพิ่ม statement สุดท้ายถ้ามี
    if (currentStatement.trim().length > 10) {
      statements.push(currentStatement.trim());
    }

    console.log(`Found ${statements.length} SQL statements\n`);

    // รันแต่ละคำสั่ง
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // ข้าม comment lines
      if (statement.startsWith('--') || statement.length < 10) {
        continue;
      }

      try {
        await db.query(statement);
        if ((i + 1) % 50 === 0) {
          console.log(`✅ Processed ${i + 1} statements...`);
        }
      } catch (err) {
        // ถ้า duplicate key หรือ constraint violation ข้ามไป
        if (err.code === '23505' || err.code === '23503') {
          console.log(`⏭️  Statement ${i + 1} skipped (duplicate or constraint)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, err.message);
          // ไม่ throw error เพื่อให้รันต่อ
        }
      }
    }

    console.log('\n✅ Seeding completed!');
    
    // ตรวจสอบข้อมูล
    const gamesCount = await db.query('SELECT COUNT(*) FROM games');
    const codesCount = await db.query('SELECT COUNT(*) FROM game_codes');
    const categoriesCount = await db.query('SELECT COUNT(*) FROM categories');
    
    console.log('\n📊 Data summary:');
    console.log(`   - Games: ${gamesCount.rows[0].count}`);
    console.log(`   - Game Codes: ${codesCount.rows[0].count}`);
    console.log(`   - Categories: ${categoriesCount.rows[0].count}`);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

// รัน seeding
seed()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

