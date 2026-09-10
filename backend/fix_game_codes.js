const fs = require('fs');

// อ่าน seed.sql
const seedContent = fs.readFileSync('seed.sql', 'utf8');

// Mapping ของเกม (ชื่อเกม, platform) -> game_id เดิม
const gameMapping = {
  'Grand Theft Auto V': { platform: 'Steam', oldId: 1 },
  'Elden Ring': { platform: 'Steam', oldId: 2 },
  'Cyberpunk 2077': { platform: 'Steam', oldId: 3 },
  'Red Dead Redemption 2': { platform: 'Steam', oldId: 4 },
  'Counter-Strike 2': { platform: 'Steam', oldId: 5 },
  'Baldur\'s Gate 3': { platform: 'Steam', oldId: 6 },
  'Hogwarts Legacy': { platform: 'Steam', oldId: 7 },
  'Monster Hunter: World': { platform: 'Steam', oldId: 8 },
  'PUBG: BATTLEGROUNDS': { platform: 'Steam', oldId: 9 },
  'Civilization VI': { platform: 'Steam', oldId: 10 },
  'Devil May Cry 5': { platform: 'Steam', oldId: 11 },
  'The Witcher 3: Wild Hunt': { platform: 'Steam', oldId: 12 },
  'Stardew Valley': { platform: 'Steam', oldId: 13 },
  'Sekiro: Shadows Die Twice': { platform: 'Steam', oldId: 14 },
  'Resident Evil 4 Remake': { platform: 'Steam', oldId: 15 },
  'Tom Clancy\'s Rainbow Six Siege': { platform: 'Steam', oldId: 16 },
  'Dark Souls III': { platform: 'Steam', oldId: 17 },
  'Need for Speed Heat': { platform: 'Steam', oldId: 18 },
  'Cities: Skylines': { platform: 'Steam', oldId: 19 },
  'Hades': { platform: 'Steam', oldId: 20 },
  'God of War Ragnarök': { platform: 'PlayStation', oldId: 21 },
  'Marvel\'s Spider-Man 2': { platform: 'PlayStation', oldId: 22 },
  'The Last of Us Part II': { platform: 'PlayStation', oldId: 23 },
  'Ghost of Tsushima': { platform: 'PlayStation', oldId: 24 },
  'Horizon Forbidden West': { platform: 'PlayStation', oldId: 25 },
  'Final Fantasy XVI': { platform: 'PlayStation', oldId: 26 },
  'Demon\'s Souls': { platform: 'PlayStation', oldId: 27 },
  'Gran Turismo 7': { platform: 'PlayStation', oldId: 28 },
  'Uncharted 4: A Thief\'s End': { platform: 'PlayStation', oldId: 29 },
  'Ratchet & Clank: Rift Apart': { platform: 'PlayStation', oldId: 30 },
  'Returnal': { platform: 'PlayStation', oldId: 31 },
  'MLB The Show 24': { platform: 'PlayStation', oldId: 32 },
  'Persona 5 Royal': { platform: 'PlayStation', oldId: 33 },
  'Bloodborne': { platform: 'PlayStation', oldId: 34 },
  'EA Sports FC 24': { platform: 'PlayStation', oldId: 35 },
  'Halo Infinite': { platform: 'Xbox', oldId: 36 },
  'Forza Horizon 5': { platform: 'Xbox', oldId: 37 },
  'Starfield': { platform: 'Xbox', oldId: 38 },
  'Gears 5': { platform: 'Xbox', oldId: 39 },
  'Sea of Thieves': { platform: 'Xbox', oldId: 40 },
  'Microsoft Flight Simulator': { platform: 'Xbox', oldId: 41 },
  'Forza Motorsport': { platform: 'Xbox', oldId: 42 },
  'Ori and the Will of the Wisps': { platform: 'Xbox', oldId: 43 },
  'Fable': { platform: 'Xbox', oldId: 44 },
  'Age of Empires IV': { platform: 'Xbox', oldId: 45 },
  'The Legend of Zelda: Tears of the Kingdom': { platform: 'Nintendo', oldId: 46 },
  'Super Mario Bros. Wonder': { platform: 'Nintendo', oldId: 47 },
  'Pokemon Scarlet/Violet': { platform: 'Nintendo', oldId: 48 },
  'Nintendo Switch Sports': { platform: 'Nintendo', oldId: 49 },
  'Super Smash Bros. Ultimate': { platform: 'Nintendo', oldId: 50 },
  'Animal Crossing: New Horizons': { platform: 'Nintendo', oldId: 51 },
  'Mario Kart 8 Deluxe': { platform: 'Nintendo', oldId: 52 },
  'Metroid Dread': { platform: 'Nintendo', oldId: 53 },
  'Pikmin 4': { platform: 'Nintendo', oldId: 54 },
  'Fire Emblem Engage': { platform: 'Nintendo', oldId: 55 },
  'Fortnite V-Bucks 1000': { platform: 'Epic Games', oldId: 56 },
  'Fortnite V-Bucks 2800': { platform: 'Epic Games', oldId: 57 },
  'Fortnite V-Bucks 5000': { platform: 'Epic Games', oldId: 58 },
  'Alan Wake 2': { platform: 'Epic Games', oldId: 59 },
  'Rocket League Credits 1100': { platform: 'Epic Games', oldId: 60 },
};

// แทนที่ game_id hardcode ด้วย subquery
let fixedContent = seedContent;

// หา pattern (oldId, ...) และแทนที่ด้วย subquery
for (const [gameName, info] of Object.entries(gameMapping)) {
  const escapedName = gameName.replace(/'/g, "''");
  const subquery = `((SELECT game_id FROM games WHERE name = '${escapedName}' AND platform = '${info.platform}' LIMIT 1)`;
  
  // แทนที่ pattern (oldId, ...) ด้วย (subquery, ...)
  const regex = new RegExp(`\\(${info.oldId},`, 'g');
  fixedContent = fixedContent.replace(regex, `(${subquery},`);
}

// บันทึกไฟล์ใหม่
fs.writeFileSync('seed_fixed.sql', fixedContent);
console.log('✅ สร้าง seed_fixed.sql แล้ว! ใช้ไฟล์นี้แทน seed.sql');




