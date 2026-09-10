const db = require('./db');

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...\n');

    // 1. ลบหมวดหมู่ซ้ำ (เก็บแค่ตัวแรก)
    console.log('1. Removing duplicate categories...');
    await db.query(`
      DELETE FROM categories 
      WHERE category_id NOT IN (
        SELECT MIN(category_id) 
        FROM categories 
        GROUP BY LOWER(name)
      )
    `);
    console.log('✅ Duplicate categories removed');

    // 2. ลบเกมซ้ำ (เก็บแค่ตัวแรกของแต่ละ name + platform)
    console.log('2. Removing duplicate games...');
    await db.query(`
      DELETE FROM games 
      WHERE game_id NOT IN (
        SELECT MIN(game_id) 
        FROM games 
        GROUP BY LOWER(name), LOWER(platform)
      )
    `);
    console.log('✅ Duplicate games removed');

    // 3. อัพเดทรูปเกมให้ครบทุกเกม
    console.log('3. Updating game images...');
    
    const imageUpdates = [
      // Steam Games
      { name: 'Grand Theft Auto V', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg' },
      { name: 'Elden Ring', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' },
      { name: 'Cyberpunk 2077', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' },
      { name: 'Red Dead Redemption 2', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg' },
      { name: 'Counter-Strike 2', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' },
      { name: 'Baldur\'s Gate 3', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg' },
      { name: 'Hogwarts Legacy', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg' },
      { name: 'Monster Hunter: World', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg' },
      { name: 'PUBG: BATTLEGROUNDS', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg' },
      { name: 'Civilization VI', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg' },
      { name: 'Devil May Cry 5', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg' },
      { name: 'The Witcher 3: Wild Hunt', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg' },
      { name: 'Stardew Valley', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg' },
      { name: 'Sekiro: Shadows Die Twice', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg' },
      { name: 'Resident Evil 4 Remake', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg' },
      { name: 'Tom Clancy\'s Rainbow Six Siege', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg' },
      { name: 'Dark Souls III', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg' },
      { name: 'Need for Speed Heat', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg' },
      { name: 'Cities: Skylines', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg' },
      { name: 'Hades', platform: 'Steam', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg' },
      
      // PlayStation Games
      { name: 'God of War Ragnarök', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/EZb2pYwH94rgz9cL0V9F4r0j.png' },
      { name: 'Marvel\'s Spider-Man 2', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560ff4a32139368c5534.png' },
      { name: 'The Last of Us Part II', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0112/a9sf5L3e3qOPK3bLHEnNJttv.png' },
      { name: 'Ghost of Tsushima', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202008/1020/T45iRN1bhiWcJUzST6UFGBdv.png' },
      { name: 'Horizon Forbidden West', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3014/cF8P1Y9p3b9v1K1FYxm6RY63.png' },
      { name: 'Final Fantasy XVI', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MujpK2ryLOHiw5fHplvHd.png' },
      { name: 'Demon\'s Souls', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202006/1618/ax0V5SBuw3qLn3b1oBsFdYMe.png' },
      { name: 'Gran Turismo 7', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202202/2217/pcVf8P6U29N2TtKGqJvni3Nn.png' },
      { name: 'Uncharted 4: A Thief\'s End', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/img/rnd/202106/1514/fkLlL1kd6v5X8k2w3fOPvxW3.png' },
      { name: 'Ratchet & Clank: Rift Apart', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202102/2322/gHiLqJXJXb0qJ8XJXb0qJ8XJ.png' },
      { name: 'Returnal', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/v4iablk3R8g9Y7k2fOPvxW3.png' },
      { name: 'MLB The Show 24', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202402/1215/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png' },
      { name: 'Persona 5 Royal', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202002/2413/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png' },
      { name: 'Bloodborne', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202503/1514/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png' },
      { name: 'EA Sports FC 24', platform: 'PlayStation', url: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1414/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png' },
      
      // Xbox Games
      { name: 'Halo Infinite', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Forza Horizon 5', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Starfield', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Gears 5', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Sea of Thieves', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Microsoft Flight Simulator', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Forza Motorsport', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Ori and the Will of the Wisps', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Fable', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      { name: 'Age of Empires IV', platform: 'Xbox', url: 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567.12345678-1234-1234-1234-123456789012' },
      
      // Nintendo Games
      { name: 'The Legend of Zelda: Tears of the Kingdom', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_TheLegendOfZeldaTearsOfTheKingdom_image1600w.jpg' },
      { name: 'Super Mario Bros. Wonder', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperMarioBrosWonder_image1600w.jpg' },
      { name: 'Pokemon Scarlet/Violet', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_PokemonScarletViolet_image1600w.jpg' },
      { name: 'Nintendo Switch Sports', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_NintendoSwitchSports_image1600w.jpg' },
      { name: 'Super Smash Bros. Ultimate', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperSmashBrosUltimate_image1600w.jpg' },
      { name: 'Animal Crossing: New Horizons', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_AnimalCrossingNewHorizons_image1600w.jpg' },
      { name: 'Mario Kart 8 Deluxe', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MarioKart8Deluxe_image1600w.jpg' },
      { name: 'Metroid Dread', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MetroidDread_image1600w.jpg' },
      { name: 'Pikmin 4', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_Pikmin4_image1600w.jpg' },
      { name: 'Fire Emblem Engage', platform: 'Nintendo', url: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_FireEmblemEngage_image1600w.jpg' },
      
      // Epic Games
      { name: 'Fortnite V-Bucks 1000', platform: 'Epic Games', url: 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg' },
      { name: 'Fortnite V-Bucks 2800', platform: 'Epic Games', url: 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg' },
      { name: 'Fortnite V-Bucks 5000', platform: 'Epic Games', url: 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg' },
      { name: 'Alan Wake 2', platform: 'Epic Games', url: 'https://cdn2.unrealengine.com/alan-wake-2-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg' },
      { name: 'Rocket League Credits 1100', platform: 'Epic Games', url: 'https://cdn2.unrealengine.com/rocket-league-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg' },
    ];

    for (const update of imageUpdates) {
      await db.query(
        `UPDATE games 
         SET image_url = $1 
         WHERE LOWER(name) = LOWER($2) AND LOWER(platform) = LOWER($3)`,
        [update.url, update.name, update.platform]
      );
    }
    console.log(`✅ Updated ${imageUpdates.length} game images`);

    // 4. อัพเดทเกมที่ยังไม่มีรูปให้ใช้ placeholder
    console.log('4. Adding placeholder images for games without images...');
    await db.query(`
      UPDATE games 
      SET image_url = 'https://via.placeholder.com/460x215/1a1a1a/ffffff?text=' || REPLACE(name, ' ', '+')
      WHERE image_url IS NULL OR image_url = ''
    `);
    console.log('✅ Placeholder images added');

    // 5. ตรวจสอบข้อมูลสุดท้าย
    const categoryCount = await db.query('SELECT COUNT(*) FROM categories');
    const gameCount = await db.query('SELECT COUNT(*) FROM games');
    const gameWithImage = await db.query('SELECT COUNT(*) FROM games WHERE image_url IS NOT NULL AND image_url != \'\'');
    
    console.log('\n📊 Final Statistics:');
    console.log(`   - Categories: ${categoryCount.rows[0].count}`);
    console.log(`   - Games: ${gameCount.rows[0].count}`);
    console.log(`   - Games with images: ${gameWithImage.rows[0].count}`);

    console.log('\n✅ Database cleanup completed!');

  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
}

cleanupDatabase()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

