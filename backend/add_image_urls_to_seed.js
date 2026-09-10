const fs = require('fs');
const path = require('path');

// Image URL mapping จาก fix_game_images.js
const imageMap = {
  // Steam Games
  'Grand Theft Auto V': 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
  'Elden Ring': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
  'Cyberpunk 2077': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
  'Red Dead Redemption 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
  'Counter-Strike 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
  'Baldur\'s Gate 3': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
  'Hogwarts Legacy': 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
  'Monster Hunter: World': 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg',
  'PUBG: BATTLEGROUNDS': 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
  'Civilization VI': 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
  'Devil May Cry 5': 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg',
  'The Witcher 3: Wild Hunt': 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
  'Stardew Valley': 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
  'Sekiro: Shadows Die Twice': 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
  'Resident Evil 4 Remake': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
  'Tom Clancy\'s Rainbow Six Siege': 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg',
  'Dark Souls III': 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg',
  'Need for Speed Heat': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg',
  'Cities: Skylines': 'https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg',
  'Hades': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
  
  // PlayStation Games
  'God of War Ragnarök': 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/EZb2pYwH94rgz9cL0V9F4r0j.png',
  'Marvel\'s Spider-Man 2': 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560ff4a32139368c5534.png',
  'The Last of Us Part II': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0112/a9sf5L3e3qOPK3bLHEnNJttv.png',
  'Ghost of Tsushima': 'https://image.api.playstation.com/vulcan/ap/rnd/202008/1020/T45iRN1bhiWcJUzST6UFGBdv.png',
  'Horizon Forbidden West': 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3014/cF8P1Y9p3b9v1K1FYxm6RY63.png',
  'Final Fantasy XVI': 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MujpK2ryLOHiw5fHplvHd.png',
  'Demon\'s Souls': 'https://image.api.playstation.com/vulcan/ap/rnd/202006/1618/ax0V5SBuw3qLn3b1oBsFdYMe.png',
  'Gran Turismo 7': 'https://image.api.playstation.com/vulcan/ap/rnd/202202/2217/pcVf8P6U29N2TtKGqJvni3Nn.png',
  'Uncharted 4: A Thief\'s End': 'https://image.api.playstation.com/vulcan/img/rnd/202106/1514/fkLlL1kd6v5X8k2w3fOPvxW3.png',
  'Ratchet & Clank: Rift Apart': 'https://image.api.playstation.com/vulcan/ap/rnd/202102/2322/gHiLqJXJXb0qJ8XJXb0qJ8XJ.png',
  'Returnal': 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/v4iablk3R8g9Y7k2fOPvxW3.png',
  'MLB The Show 24': 'https://image.api.playstation.com/vulcan/ap/rnd/202402/1215/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png',
  'Persona 5 Royal': 'https://image.api.playstation.com/vulcan/ap/rnd/202002/2413/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png',
  'Bloodborne': 'https://image.api.playstation.com/vulcan/ap/rnd/202503/1514/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png',
  'EA Sports FC 24': 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1414/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png',
  
  // Xbox Games
  'Halo Infinite': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Forza Horizon 5': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Starfield': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Gears 5': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Sea of Thieves': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Microsoft Flight Simulator': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Forza Motorsport': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Ori and the Will of the Wisps': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Fable': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  'Age of Empires IV': 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png',
  
  // Nintendo Games
  'The Legend of Zelda: Tears of the Kingdom': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_TheLegendOfZeldaTearsOfTheKingdom_image1600w.jpg',
  'Super Mario Bros. Wonder': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperMarioBrosWonder_image1600w.jpg',
  'Pokemon Scarlet/Violet': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_PokemonScarletViolet_image1600w.jpg',
  'Nintendo Switch Sports': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_NintendoSwitchSports_image1600w.jpg',
  'Super Smash Bros. Ultimate': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperSmashBrosUltimate_image1600w.jpg',
  'Animal Crossing: New Horizons': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_AnimalCrossingNewHorizons_image1600w.jpg',
  'Mario Kart 8 Deluxe': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MarioKart8Deluxe_image1600w.jpg',
  'Metroid Dread': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MetroidDread_image1600w.jpg',
  'Pikmin 4': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_Pikmin4_image1600w.jpg',
  'Fire Emblem Engage': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_FireEmblemEngage_image1600w.jpg',
  
  // Epic Games
  'Fortnite V-Bucks 1000': 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg',
  'Fortnite V-Bucks 2800': 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg',
  'Fortnite V-Bucks 5000': 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg',
  'Alan Wake 2': 'https://cdn2.unrealengine.com/alan-wake-2-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg',
  'Rocket League Credits 1100': 'https://cdn2.unrealengine.com/rocket-league-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg',
};

// อ่านไฟล์ seed.sql
const seedPath = path.join(__dirname, 'seed.sql');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// หา INSERT INTO games statements และเพิ่ม image_url
const insertPattern = /INSERT INTO games \(([^)]+)\) VALUES/g;
let match;
let updatedCount = 0;

// แทนที่ INSERT statements ทั้งหมด
seedContent = seedContent.replace(/INSERT INTO games \(([^)]+)\) VALUES/g, (match, columns) => {
  // ตรวจสอบว่ามี image_url อยู่แล้วหรือไม่
  if (columns.includes('image_url')) {
    return match; // มีอยู่แล้ว ไม่ต้องแก้ไข
  }
  
  // เพิ่ม image_url ใน columns
  const newColumns = columns + ', image_url';
  return match.replace(columns, newColumns);
});

// แก้ไข VALUES ให้มี image_url สำหรับแต่ละเกม
const gameNamePattern = /\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d.]+),\s*([\d.]+),\s*(TRUE|FALSE),\s*'([^']+)',\s*'([^']+)'\)/g;

seedContent = seedContent.replace(gameNamePattern, (match, categoryId, name, platform, description, price, originalPrice, isFeatured, developer, publisher) => {
  const imageUrl = imageMap[name] || `https://via.placeholder.com/460x215/EF4444/ffffff?text=${encodeURIComponent(name)}`;
  return `(${categoryId}, '${name}', '${platform}', '${description}', ${price}, ${originalPrice}, ${isFeatured}, '${developer}', '${publisher}', '${imageUrl}')`;
});

// บันทึกไฟล์
fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log('✅ เพิ่ม image_url ให้กับทุกเกมใน seed.sql แล้ว!');




