-- =============================================
-- Game Key Marketplace - Seed Data
-- =============================================
-- Run this after database.sql to populate with sample data

-- =============================================
-- 1. Categories (8 categories)
-- =============================================
-- Insert categories first before inserting games
-- Mapping: 41=Action, 42=RPG, 43=Sports, 44=Racing, 45=Shooter, 46=Adventure, 47=Strategy, 48=Simulation

INSERT INTO categories (category_id, name, name_th, icon, color) VALUES
(41, 'Action', 'แอ็คชั่น', 'sword', 'red'),
(42, 'RPG', 'บทบาทสมมติ', 'dice', 'blue'),
(43, 'Sports', 'กีฬา', 'trophy', 'green'),
(44, 'Racing', 'แข่งรถ', 'car', 'yellow'),
(45, 'Shooter', 'ยิงปืน', 'target', 'orange'),
(46, 'Adventure', 'ผจญภัย', 'compass', 'purple'),
(47, 'Strategy', 'วางแผน', 'chess', 'indigo'),
(48, 'Simulation', 'จำลอง', 'building', 'pink')
ON CONFLICT (category_id) DO NOTHING;

-- =============================================
-- 2. Users (Admin + Test Users)
-- =============================================
-- Password: admin123 (hashed with bcrypt)
-- Hash: $2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO
INSERT INTO users (username, email, password_hash, role, wallet_balance) VALUES
('admin', 'admin@synnex.store', '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO', 'admin', 99999.00),
('admin2', 'admin2@synnex.store', '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO', 'admin', 99999.00),
('seller01', 'seller@synnex.store', '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO', 'seller', 5000.00),
('testuser', 'test@synnex.store', '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO', 'user', 1000.00)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 3. Games (60 เกมยอดนิยม)
-- =============================================

-- Steam Games (20 เกม)
-- Mapping: 41=Action, 42=RPG, 43=Sports, 44=Racing, 45=Shooter, 46=Adventure, 47=Strategy, 48=Simulation
INSERT INTO games (category_id, name, platform, description, price, original_price, is_featured, developer, publisher, image_url) VALUES
(41, 'Grand Theft Auto V', 'Steam', 'เกมโลกเปิดสุดมันส์ ผจญภัยในเมือง Los Santos ทำภารกิจปล้นสุดโหด เล่นออนไลน์กับเพื่อนได้', 599.00, 1490.00, TRUE, 'Rockstar North', 'Rockstar Games', 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg'),
(42, 'Elden Ring', 'Steam', 'เกม Action RPG จาก FromSoftware ร่วมสร้างโดย George R.R. Martin โลกกว้างใหญ่ บอสสุดโหด', 1690.00, 1990.00, TRUE, 'FromSoftware', 'Bandai Namco', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg'),
(41, 'Cyberpunk 2077', 'Steam', 'เกม RPG ในโลกอนาคต Night City เต็มไปด้วยอาชญากรรมและเทคโนโลยีล้ำสมัย', 890.00, 1790.00, TRUE, 'CD Projekt Red', 'CD Projekt', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg'),
(41, 'Red Dead Redemption 2', 'Steam', 'เกมคาวบอยโลกเปิด เนื้อเรื่องสุดอลังการ กราฟิกสวยงาม ผจญภัยในตะวันตก', 990.00, 1790.00, TRUE, 'Rockstar Games', 'Rockstar Games', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg'),
(45, 'Counter-Strike 2', 'Steam', 'เกมยิงปืนระดับตำนาน อัพเกรดจาก CS:GO ด้วย Source 2 Engine กราฟิกใหม่หมด', 0.00, 0.00, TRUE, 'Valve', 'Valve', 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'),
(42, 'Baldur''s Gate 3', 'Steam', 'เกม RPG สุดอลังการ ตัวเลือกมากมาย เนื้อเรื่องลึกซึ้ง ระบบการต่อสู้แบบ Turn-based', 1790.00, 1990.00, TRUE, 'Larian Studios', 'Larian Studios', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg'),
(46, 'Hogwarts Legacy', 'Steam', 'เกมผจญภัยในโลกเวทมนตร์แฮร์รี่ พอตเตอร์ เรียนที่ฮอกวอตส์ สำรวจโลกกว้าง', 1290.00, 1790.00, FALSE, 'Avalanche Software', 'Warner Bros.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg'),
(41, 'Monster Hunter: World', 'Steam', 'ล่าสัตว์ประหลาดยักษ์ ทำอาวุธและชุดเกราะ เล่นกับเพื่อนได้ 4 คน', 590.00, 990.00, FALSE, 'Capcom', 'Capcom', 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg'),
(45, 'PUBG: BATTLEGROUNDS', 'Steam', 'เกม Battle Royale ต้นตำรับ 100 คนเหลือ 1 แผนที่หลากหลาย', 0.00, 0.00, FALSE, 'PUBG Corporation', 'Krafton', 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg'),
(47, 'Civilization VI', 'Steam', 'เกมวางแผนสร้างอารยธรรม ตั้งแต่ยุคโบราณถึงอนาคต ผู้นำมากมายให้เลือก', 450.00, 1790.00, FALSE, 'Firaxis Games', 'Take-Two', 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg'),
(41, 'Devil May Cry 5', 'Steam', 'เกมแอ็คชั่นคอมโบสุดมันส์ เล่นเป็น Dante, Nero, V ปราบปีศาจสุดโหด', 590.00, 990.00, FALSE, 'Capcom', 'Capcom', 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg'),
(42, 'The Witcher 3: Wild Hunt', 'Steam', 'เกม RPG ระดับตำนาน เนื้อเรื่องสุดยอด โลกกว้างใหญ่ Geralt นักล่าอสูร', 299.00, 1190.00, TRUE, 'CD Projekt Red', 'CD Projekt', 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg'),
(48, 'Stardew Valley', 'Steam', 'เกมทำฟาร์มสุดผ่อนคลาย ปลูกผัก เลี้ยงสัตว์ สร้างความสัมพันธ์กับชาวบ้าน', 259.00, 459.00, FALSE, 'ConcernedApe', 'ConcernedApe', 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg'),
(46, 'Sekiro: Shadows Die Twice', 'Steam', 'เกมแอ็คชั่นนินจาสุดโหด ต้องใช้ทักษะสูง parry ให้ถูกจังหวะ', 890.00, 1790.00, FALSE, 'FromSoftware', 'Activision', 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg'),
(41, 'Resident Evil 4 Remake', 'Steam', 'รีเมคเกมระดับตำนาน กราฟิกใหม่ ระบบการเล่นทันสมัย Leon S. Kennedy', 1290.00, 1790.00, TRUE, 'Capcom', 'Capcom', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg'),
(45, 'Tom Clancy''s Rainbow Six Siege', 'Steam', 'เกมยิงปืนแนว Tactical ทีมละ 5 คน ทำลายผนัง วางแผนการรุก', 290.00, 690.00, FALSE, 'Ubisoft Montreal', 'Ubisoft', 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg'),
(46, 'Dark Souls III', 'Steam', 'เกมแอ็คชั่น RPG สุดโหดจาก FromSoftware โลกมืดมน บอสท้าทาย', 490.00, 1490.00, FALSE, 'FromSoftware', 'Bandai Namco', 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg'),
(44, 'Need for Speed Heat', 'Steam', 'เกมแข่งรถถนน ตกแต่งรถ หนีตำรวจ แข่งทั้งกลางวันและกลางคืน', 390.00, 1490.00, FALSE, 'Ghost Games', 'Electronic Arts', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg'),
(48, 'Cities: Skylines', 'Steam', 'เกมสร้างเมืองสุดละเอียด วางผังเมือง จัดการจราจร น้ำ ไฟฟ้า', 290.00, 890.00, FALSE, 'Colossal Order', 'Paradox', 'https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg'),
(41, 'Hades', 'Steam', 'เกม Roguelike หลบหนีจากนรก เนื้อเรื่องดี คอมโบมัน กราฟิกสวย', 349.00, 749.00, FALSE, 'Supergiant Games', 'Supergiant Games', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg');

-- PlayStation Games (15 เกม)
INSERT INTO games (category_id, name, platform, description, price, original_price, is_featured, developer, publisher, image_url) VALUES
(41, 'God of War Ragnarök', 'PlayStation', 'ภาคต่อการผจญภัยของ Kratos และ Atreus ต่อสู้กับเหล่าเทพนอร์ส', 1790.00, 2290.00, TRUE, 'Santa Monica Studio', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/EZb2pYwH94rgz9cL0V9F4r0j.png'),
(41, 'Marvel''s Spider-Man 2', 'PlayStation', 'เล่นเป็น Peter Parker และ Miles Morales พร้อมกัน ต่อสู้กับ Venom', 1990.00, 2290.00, TRUE, 'Insomniac Games', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(46, 'The Last of Us Part II', 'PlayStation', 'ภาคต่อเกมเนื้อเรื่องระดับตำนาน การผจญภัยของ Ellie ที่มืดมน', 990.00, 1990.00, TRUE, 'Naughty Dog', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0112/a9sf5L3e3qOPK3bLHEnNJttv.png'),
(41, 'Ghost of Tsushima', 'PlayStation', 'เกมซามูไร โลกเปิดสุดสวยงาม ต่อต้านการรุกรานของมองโกล', 890.00, 1790.00, FALSE, 'Sucker Punch', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202008/1020/T45iRN1bhiWcJUzST6UFGBdv.png'),
(46, 'Horizon Forbidden West', 'PlayStation', 'ผจญภัยในโลกอนาคตกับ Aloy ล่าเครื่องจักรยักษ์ สำรวจดินแดนใหม่', 990.00, 1990.00, FALSE, 'Guerrilla Games', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3014/cF8P1Y9p3b9v1K1FYxm6RY63.png'),
(42, 'Final Fantasy XVI', 'PlayStation', 'เกม RPG จาก Square Enix เนื้อเรื่องมืดมน แอ็คชั่นดุเดือด', 1490.00, 1990.00, TRUE, 'Square Enix', 'Square Enix', 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MujpK2ryLOHiw5fHplvHd.png'),
(41, 'Demon''s Souls', 'PlayStation', 'รีเมคเกมระดับตำนาน กราฟิก PS5 สุดอลัง บอสสุดโหด', 1290.00, 1990.00, FALSE, 'Bluepoint Games', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202009/1020/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(44, 'Gran Turismo 7', 'PlayStation', 'เกมแข่งรถสมจริงที่สุด รถยนต์หลายร้อยคัน สนามแข่งทั่วโลก', 1290.00, 1990.00, FALSE, 'Polyphony Digital', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202202/2217/pcVf8P6U29N2TtKGqJvni3Nn.png'),
(46, 'Uncharted 4: A Thief''s End', 'PlayStation', 'บทสรุปการผจญภัยของ Nathan Drake ล่าสมบัติโจรสลัด', 490.00, 1490.00, FALSE, 'Naughty Dog', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202103/1015/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(41, 'Ratchet & Clank: Rift Apart', 'PlayStation', 'เกมแอ็คชั่นผจญภัย กระโดดข้ามมิติ กราฟิก PS5 สุดตา', 990.00, 1790.00, FALSE, 'Insomniac Games', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202102/2322/gHiLqJXJXb0qJ8XJXb0qJ8XJ.png'),
(46, 'Returnal', 'PlayStation', 'เกม Roguelike Sci-Fi ยิงปืน Third-Person ดาวเคราะห์ลึกลับ', 890.00, 1790.00, FALSE, 'Housemarque', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/v4iablk3R8g9Y7k2fOPvxW3.png'),
(43, 'MLB The Show 24', 'PlayStation', 'เกมเบสบอลสมจริงที่สุด ทีมจริง นักเล่นจริง ระบบ Road to the Show', 1290.00, 1790.00, FALSE, 'San Diego Studio', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202402/1215/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(42, 'Persona 5 Royal', 'PlayStation', 'เกม RPG สไตล์ญี่ปุ่น เนื้อเรื่องยาว 100+ ชม. ระบบ Social Link', 890.00, 1790.00, FALSE, 'Atlus', 'Atlus', 'https://image.api.playstation.com/vulcan/ap/rnd/202002/2413/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(41, 'Bloodborne', 'PlayStation', 'เกมแอ็คชั่นสุดโหดจาก FromSoftware โลกแบบ Gothic ยากสุดๆ', 590.00, 990.00, FALSE, 'FromSoftware', 'Sony', 'https://image.api.playstation.com/vulcan/ap/rnd/202503/1514/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png'),
(43, 'EA Sports FC 24', 'PlayStation', 'เกมฟุตบอลจาก EA ทีมและนักเตะจริงทั่วโลก โหมด Ultimate Team', 1290.00, 1990.00, FALSE, 'EA Vancouver', 'Electronic Arts', 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1414/1a8f8e8e8e8e8e8e8e8e8e8e8e8e.png');

-- Xbox Games (10 เกม)
INSERT INTO games (category_id, name, platform, description, price, original_price, is_featured, developer, publisher, image_url) VALUES
(45, 'Halo Infinite', 'Xbox', 'ภาคใหม่ของ Master Chief กลับมาต่อสู้กับ Banished แผนที่กว้าง', 990.00, 1790.00, TRUE, '343 Industries', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(44, 'Forza Horizon 5', 'Xbox', 'เกมแข่งรถโลกเปิดในเม็กซิโก รถมากกว่า 500 คัน กราฟิกสวยมาก', 1290.00, 1790.00, TRUE, 'Playground Games', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(42, 'Starfield', 'Xbox', 'เกม RPG อวกาศจาก Bethesda สำรวจ 1000 ดาวเคราะห์ สร้างยาน', 1490.00, 1990.00, TRUE, 'Bethesda', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(45, 'Gears 5', 'Xbox', 'เกมยิงปืน Third-Person ต่อสู้กับ Locust ภาพสวย เล่น Co-op', 490.00, 1790.00, FALSE, 'The Coalition', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(41, 'Sea of Thieves', 'Xbox', 'เกมโจรสลัดออนไลน์ แล่นเรือกับเพื่อน ขุดสมบัติ ต่อสู้กับโจรสลัดอื่น', 590.00, 1290.00, FALSE, 'Rare', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(48, 'Microsoft Flight Simulator', 'Xbox', 'เกมจำลองบินสมจริงที่สุดในโลก โลกทั้งใบจากข้อมูลจริง', 1490.00, 1990.00, FALSE, 'Asobo Studio', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(44, 'Forza Motorsport', 'Xbox', 'เกมแข่งรถสนามจริง กราฟิกสุดอลัง ระบบฟิสิกส์สมจริง', 1290.00, 1790.00, FALSE, 'Turn 10 Studios', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(41, 'Ori and the Will of the Wisps', 'Xbox', 'เกม Platformer กราฟิกสวยงาม เนื้อเรื่องซึ้ง เพลงประกอบดี', 290.00, 890.00, FALSE, 'Moon Studios', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(42, 'Fable', 'Xbox', 'เกม RPG ในโลกแฟนตาซี สไตล์อังกฤษ ตัวเลือกดี-ชั่ว ผลกระทบต่อโลก', 1290.00, 1790.00, FALSE, 'Playground Games', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png'),
(47, 'Age of Empires IV', 'Xbox', 'เกมวางแผนสร้างอาณาจักร แนว Real-Time Strategy ยุคกลาง', 890.00, 1790.00, FALSE, 'Relic Entertainment', 'Xbox Game Studios', 'https://store-images.s-microsoft.com/image/apps.12345.12345678901234567.12345678901234567-12345678901234567.png');

-- Nintendo Games (10 เกม)
INSERT INTO games (category_id, name, platform, description, price, original_price, is_featured, developer, publisher, image_url) VALUES
(46, 'The Legend of Zelda: Tears of the Kingdom', 'Nintendo', 'ภาคต่อของ Breath of the Wild สำรวจทั้งบนดินและบนฟ้า สร้างยานพาหนะ', 1890.00, 2090.00, TRUE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_TheLegendOfZeldaTearsOfTheKingdom_image1600w.jpg'),
(41, 'Super Mario Bros. Wonder', 'Nintendo', 'เกมมาริโอ้ภาคใหม่ 2D ดอกไม้มหัศจรรย์เปลี่ยนโลก Co-op 4 คน', 1590.00, 1790.00, TRUE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperMarioBrosWonder_image1600w.jpg'),
(42, 'Pokemon Scarlet/Violet', 'Nintendo', 'เกมโปเกม่อนโลกเปิดครั้งแรก จับโปเกม่อน สำรวจภูมิภาค Paldea', 1590.00, 1790.00, TRUE, 'Game Freak', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_PokemonScarletViolet_image1600w.jpg'),
(43, 'Nintendo Switch Sports', 'Nintendo', 'เกมกีฬา 6 ประเภท เล่นกับเพื่อนหรือออนไลน์ ใช้ Joy-Con ขยับตัว', 990.00, 1490.00, FALSE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_NintendoSwitchSports_image1600w.jpg'),
(41, 'Super Smash Bros. Ultimate', 'Nintendo', 'เกมต่อสู้รวมตัวละครนินเทนโด้กว่า 80 ตัว สนามแข่ง 100+ แบบ', 1390.00, 1790.00, FALSE, 'Bandai Namco', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_SuperSmashBrosUltimate_image1600w.jpg'),
(46, 'Animal Crossing: New Horizons', 'Nintendo', 'เกมจำลองชีวิตบนเกาะ ตกแต่งบ้าน สร้างเกาะในฝัน', 1190.00, 1790.00, FALSE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_AnimalCrossingNewHorizons_image1600w.jpg'),
(44, 'Mario Kart 8 Deluxe', 'Nintendo', 'เกมแข่งรถมาริโอ้ 48 สนาม ตัวละครมากมาย Battle Mode', 1390.00, 1790.00, FALSE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MarioKart8Deluxe_image1600w.jpg'),
(41, 'Metroid Dread', 'Nintendo', 'เกม Metroidvania ภาคใหม่ในรอบ 19 ปี Samus vs E.M.M.I.', 990.00, 1590.00, FALSE, 'MercurySteam', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_MetroidDread_image1600w.jpg'),
(48, 'Pikmin 4', 'Nintendo', 'เกมวางแผนควบคุม Pikmin สำรวจโลก เก็บสมบัติ ไขปริศนา', 1390.00, 1590.00, FALSE, 'Nintendo EPD', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_Pikmin4_image1600w.jpg'),
(46, 'Fire Emblem Engage', 'Nintendo', 'เกมวางแผนแนว SRPG เรียก Emblem จากภาคก่อนมาช่วยรบ', 1390.00, 1590.00, FALSE, 'Intelligent Systems', 'Nintendo', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/switch/70010000063700/NSwitch_FireEmblemEngage_image1600w.jpg');

-- Epic Games (5 เกม)
INSERT INTO games (category_id, name, platform, description, price, original_price, is_featured, developer, publisher, image_url) VALUES
(45, 'Fortnite V-Bucks 1000', 'Epic Games', 'เงินในเกม Fortnite สำหรับซื้อ Battle Pass และไอเทมในร้าน', 350.00, 350.00, TRUE, 'Epic Games', 'Epic Games', 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg'),
(45, 'Fortnite V-Bucks 2800', 'Epic Games', 'เงินในเกม Fortnite แพ็คใหญ่ คุ้มค่ากว่า ซื้อสกินหลายตัว', 890.00, 890.00, FALSE, 'Epic Games', 'Epic Games', 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg'),
(45, 'Fortnite V-Bucks 5000', 'Epic Games', 'เงินในเกม Fortnite แพ็คยักษ์ คุ้มที่สุด สำหรับสายช้อป', 1490.00, 1490.00, FALSE, 'Epic Games', 'Epic Games', 'https://cdn2.unrealengine.com/fortnite-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg'),
(41, 'Alan Wake 2', 'Epic Games', 'เกมสยองขวัญจาก Remedy นักเขียนติดอยู่ในเรื่องราวของตัวเอง', 1490.00, 1790.00, TRUE, 'Remedy Entertainment', 'Epic Games', 'https://cdn2.unrealengine.com/alan-wake-2-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg'),
(45, 'Rocket League Credits 1100', 'Epic Games', 'เงินในเกม Rocket League สำหรับซื้อไอเทมและ Rocket Pass', 350.00, 350.00, FALSE, 'Psyonix', 'Epic Games', 'https://cdn2.unrealengine.com/rocket-league-og-image-1920x1080-1920x1080-7c8c0e0e0e0e.jpg');

-- =============================================
-- 4. Game Codes (500+ รหัส)
-- =============================================

-- Helper function to generate codes
-- Steam Games Codes (200 รหัส)
-- ใช้ subquery เพื่อหา game_id จากชื่อเกมและ platform
INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region) VALUES
-- GTA V - 15 codes
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-A1B2C-D3E4F-G5H6I', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-J7K8L-M9N0O-P1Q2R', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-S3T4U-V5W6X-Y7Z8A', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-B9C0D-E1F2G-H3I4J', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-K5L6M-N7O8P-Q9R0S', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-T1U2V-W3X4Y-Z5A6B', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-C7D8E-F9G0H-I1J2K', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-L3M4N-O5P6Q-R7S8T', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-U9V0W-X1Y2Z-A3B4C', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 1, 'GTAV-STEAM-D5E6F-G7H8I-J9K0L', 599.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 2, 'GTAV-STEAM-M1N2O-P3Q4R-S5T6U', 579.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 2, 'GTAV-STEAM-V7W8X-Y9Z0A-B1C2D', 579.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 2, 'GTAV-STEAM-E3F4G-H5I6J-K7L8M', 579.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 2, 'GTAV-STEAM-N9O0P-Q1R2S-T3U4V', 579.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 2, 'GTAV-STEAM-W5X6Y-Z7A8B-C9D0E', 579.00, 'available', TRUE, 'Asia'),

-- Elden Ring - 12 codes
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-F1G2H-I3J4K-L5M6N', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-O7P8Q-R9S0T-U1V2W', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-X3Y4Z-A5B6C-D7E8F', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-G9H0I-J1K2L-M3N4O', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-P5Q6R-S7T8U-V9W0X', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-Y1Z2A-B3C4D-E5F6G', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-H7I8J-K9L0M-N1O2P', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 1, 'ELDEN-STEAM-Q3R4S-T5U6V-W7X8Y', 1690.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 2, 'ELDEN-STEAM-Z9A0B-C1D2E-F3G4H', 1650.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 2, 'ELDEN-STEAM-I5J6K-L7M8N-O9P0Q', 1650.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 2, 'ELDEN-STEAM-R1S2T-U3V4W-X5Y6Z', 1650.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 2, 'ELDEN-STEAM-A7B8C-D9E0F-G1H2I', 1650.00, 'available', TRUE, 'Asia'),

-- Cyberpunk 2077 (game_id: 3) - 10 codes
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-J3K4L-M5N6O-P7Q8R', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-S9T0U-V1W2X-Y3Z4A', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-B5C6D-E7F8G-H9I0J', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-K1L2M-N3O4P-Q5R6S', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-T7U8V-W9X0Y-Z1A2B', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 1, 'CYBER-STEAM-C3D4E-F5G6H-I7J8K', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 2, 'CYBER-STEAM-L9M0N-O1P2Q-R3S4T', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 2, 'CYBER-STEAM-U5V6W-X7Y8Z-A9B0C', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 2, 'CYBER-STEAM-D1E2F-G3H4I-J5K6L', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 2, 'CYBER-STEAM-M7N8O-P9Q0R-S1T2U', 870.00, 'available', TRUE, 'Asia'),

-- Red Dead Redemption 2 (game_id: 4) - 10 codes
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-V3W4X-Y5Z6A-B7C8D', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-E9F0G-H1I2J-K3L4M', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-N5O6P-Q7R8S-T9U0V', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-W1X2Y-Z3A4B-C5D6E', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-F7G8H-I9J0K-L1M2N', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 1, 'RDR2-STEAM-O3P4Q-R5S6T-U7V8W', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 2, 'RDR2-STEAM-X9Y0Z-A1B2C-D3E4F', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 2, 'RDR2-STEAM-G5H6I-J7K8L-M9N0O', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 2, 'RDR2-STEAM-P1Q2R-S3T4U-V5W6X', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 2, 'RDR2-STEAM-Y7Z8A-B9C0D-E1F2G', 950.00, 'available', TRUE, 'Asia'),

-- Baldur's Gate 3 (game_id: 6) - 10 codes
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 1, 'BG3-STEAM-H3I4J-K5L6M-N7O8P', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 1, 'BG3-STEAM-Q9R0S-T1U2V-W3X4Y', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 1, 'BG3-STEAM-Z5A6B-C7D8E-F9G0H', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 1, 'BG3-STEAM-I1J2K-L3M4N-O5P6Q', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 1, 'BG3-STEAM-R7S8T-U9V0W-X1Y2Z', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 2, 'BG3-STEAM-A3B4C-D5E6F-G7H8I', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 2, 'BG3-STEAM-J9K0L-M1N2O-P3Q4R', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 2, 'BG3-STEAM-S5T6U-V7W8X-Y9Z0A', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 2, 'BG3-STEAM-B1C2D-E3F4G-H5I6J', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 2, 'BG3-STEAM-K7L8M-N9O0P-Q1R2S', 1750.00, 'available', TRUE, 'Asia'),

-- Hogwarts Legacy (game_id: 7) - 8 codes
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 1, 'HOGW-STEAM-T3U4V-W5X6Y-Z7A8B', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 1, 'HOGW-STEAM-C9D0E-F1G2H-I3J4K', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 1, 'HOGW-STEAM-L5M6N-O7P8Q-R9S0T', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 1, 'HOGW-STEAM-U1V2W-X3Y4Z-A5B6C', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 2, 'HOGW-STEAM-D7E8F-G9H0I-J1K2L', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 2, 'HOGW-STEAM-M3N4O-P5Q6R-S7T8U', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 2, 'HOGW-STEAM-V9W0X-Y1Z2A-B3C4D', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hogwarts Legacy' AND platform = 'Steam' LIMIT 1), 2, 'HOGW-STEAM-E5F6G-H7I8J-K9L0M', 1250.00, 'available', TRUE, 'Asia'),

-- Monster Hunter World (game_id: 8) - 8 codes
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 1, 'MHW-STEAM-N1O2P-Q3R4S-T5U6V', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 1, 'MHW-STEAM-W7X8Y-Z9A0B-C1D2E', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 1, 'MHW-STEAM-F3G4H-I5J6K-L7M8N', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 1, 'MHW-STEAM-O9P0Q-R1S2T-U3V4W', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 2, 'MHW-STEAM-X5Y6Z-A7B8C-D9E0F', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 2, 'MHW-STEAM-G1H2I-J3K4L-M5N6O', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 2, 'MHW-STEAM-P7Q8R-S9T0U-V1W2X', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 2, 'MHW-STEAM-Y3Z4A-B5C6D-E7F8G', 570.00, 'available', TRUE, 'Asia'),

-- Civilization VI (game_id: 10) - 8 codes
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 1, 'CIV6-STEAM-H9I0J-K1L2M-N3O4P', 450.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 1, 'CIV6-STEAM-Q5R6S-T7U8V-W9X0Y', 450.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 1, 'CIV6-STEAM-Z1A2B-C3D4E-F5G6H', 450.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 1, 'CIV6-STEAM-I7J8K-L9M0N-O1P2Q', 450.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 2, 'CIV6-STEAM-R3S4T-U5V6W-X7Y8Z', 430.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 2, 'CIV6-STEAM-A9B0C-D1E2F-G3H4I', 430.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 2, 'CIV6-STEAM-J5K6L-M7N8O-P9Q0R', 430.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Civilization VI' AND platform = 'Steam' LIMIT 1), 2, 'CIV6-STEAM-S1T2U-V3W4X-Y5Z6A', 430.00, 'available', TRUE, 'Asia'),

-- The Witcher 3 (game_id: 12) - 10 codes
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 1, 'WITCH-STEAM-B7C8D-E9F0G-H1I2J', 299.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 1, 'WITCH-STEAM-K3L4M-N5O6P-Q7R8S', 299.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 1, 'WITCH-STEAM-T9U0V-W1X2Y-Z3A4B', 299.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 1, 'WITCH-STEAM-C5D6E-F7G8H-I9J0K', 299.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 1, 'WITCH-STEAM-L1M2N-O3P4Q-R5S6T', 299.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 2, 'WITCH-STEAM-U7V8W-X9Y0Z-A1B2C', 279.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 2, 'WITCH-STEAM-D3E4F-G5H6I-J7K8L', 279.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 2, 'WITCH-STEAM-M9N0O-P1Q2R-S3T4U', 279.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 2, 'WITCH-STEAM-V5W6X-Y7Z8A-B9C0D', 279.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 2, 'WITCH-STEAM-E1F2G-H3I4J-K5L6M', 279.00, 'available', TRUE, 'Asia'),

-- Stardew Valley (game_id: 13) - 10 codes
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 1, 'STARD-STEAM-N7O8P-Q9R0S-T1U2V', 259.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 1, 'STARD-STEAM-W3X4Y-Z5A6B-C7D8E', 259.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 1, 'STARD-STEAM-F9G0H-I1J2K-L3M4N', 259.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 1, 'STARD-STEAM-O5P6Q-R7S8T-U9V0W', 259.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 1, 'STARD-STEAM-X1Y2Z-A3B4C-D5E6F', 259.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 2, 'STARD-STEAM-G7H8I-J9K0L-M1N2O', 249.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 2, 'STARD-STEAM-P3Q4R-S5T6U-V7W8X', 249.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 2, 'STARD-STEAM-Y9Z0A-B1C2D-E3F4G', 249.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 2, 'STARD-STEAM-H5I6J-K7L8M-N9O0P', 249.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 2, 'STARD-STEAM-Q1R2S-T3U4V-W5X6Y', 249.00, 'available', TRUE, 'Asia'),

-- Resident Evil 4 Remake (game_id: 15) - 8 codes
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 1, 'RE4R-STEAM-Z7A8B-C9D0E-F1G2H', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 1, 'RE4R-STEAM-I3J4K-L5M6N-O7P8Q', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 1, 'RE4R-STEAM-R9S0T-U1V2W-X3Y4Z', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 1, 'RE4R-STEAM-A5B6C-D7E8F-G9H0I', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 2, 'RE4R-STEAM-J1K2L-M3N4O-P5Q6R', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 2, 'RE4R-STEAM-S7T8U-V9W0X-Y1Z2A', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 2, 'RE4R-STEAM-B3C4D-E5F6G-H7I8J', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Resident Evil 4 Remake' AND platform = 'Steam' LIMIT 1), 2, 'RE4R-STEAM-K9L0M-N1O2P-Q3R4S', 1250.00, 'available', TRUE, 'Asia'),

-- Dark Souls III (game_id: 17) - 8 codes
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 1, 'DS3-STEAM-T5U6V-W7X8Y-Z9A0B', 490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 1, 'DS3-STEAM-C1D2E-F3G4H-I5J6K', 490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 1, 'DS3-STEAM-L7M8N-O9P0Q-R1S2T', 490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 1, 'DS3-STEAM-U3V4W-X5Y6Z-A7B8C', 490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 2, 'DS3-STEAM-D9E0F-G1H2I-J3K4L', 470.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 2, 'DS3-STEAM-M5N6O-P7Q8R-S9T0U', 470.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 2, 'DS3-STEAM-V1W2X-Y3Z4A-B5C6D', 470.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Dark Souls III' AND platform = 'Steam' LIMIT 1), 2, 'DS3-STEAM-E7F8G-H9I0J-K1L2M', 470.00, 'available', TRUE, 'Asia'),

-- Hades (game_id: 20) - 8 codes
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 1, 'HADE-STEAM-N3O4P-Q5R6S-T7U8V', 349.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 1, 'HADE-STEAM-W9X0Y-Z1A2B-C3D4E', 349.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 1, 'HADE-STEAM-F5G6H-I7J8K-L9M0N', 349.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 1, 'HADE-STEAM-O1P2Q-R3S4T-U5V6W', 349.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 2, 'HADE-STEAM-X7Y8Z-A9B0C-D1E2F', 329.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 2, 'HADE-STEAM-G3H4I-J5K6L-M7N8O', 329.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 2, 'HADE-STEAM-P9Q0R-S1T2U-V3W4X', 329.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 2, 'HADE-STEAM-Y5Z6A-B7C8D-E9F0G', 329.00, 'available', TRUE, 'Asia');

-- PlayStation Games Codes (150 รหัส)
INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region) VALUES
-- God of War Ragnarök (game_id: 21) - 12 codes
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-H1I2J-K3L4M-N5O6P', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-Q7R8S-T9U0V-W1X2Y', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-Z3A4B-C5D6E-F7G8H', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-I9J0K-L1M2N-O3P4Q', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-R5S6T-U7V8W-X9Y0Z', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 1, 'GOW-PSN-A1B2C-D3E4F-G5H6I', 1790.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-J7K8L-M9N0O-P1Q2R', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-S3T4U-V5W6X-Y7Z8A', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-B9C0D-E1F2G-H3I4J', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-K5L6M-N7O8P-Q9R0S', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-T1U2V-W3X4Y-Z5A6B', 1750.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 2, 'GOW-PSN-C7D8E-F9G0H-I1J2K', 1750.00, 'available', TRUE, 'Asia'),

-- Spider-Man 2 (game_id: 22) - 12 codes
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-L3M4N-O5P6Q-R7S8T', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-U9V0W-X1Y2Z-A3B4C', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-D5E6F-G7H8I-J9K0L', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-M1N2O-P3Q4R-S5T6U', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-V7W8X-Y9Z0A-B1C2D', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 1, 'SPIDER-PSN-E3F4G-H5I6J-K7L8M', 1990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-N9O0P-Q1R2S-T3U4V', 1950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-W5X6Y-Z7A8B-C9D0E', 1950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-F1G2H-I3J4K-L5M6N', 1950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-O7P8Q-R9S0T-U1V2W', 1950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-X3Y4Z-A5B6C-D7E8F', 1950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 2, 'SPIDER-PSN-G9H0I-J1K2L-M3N4O', 1950.00, 'available', TRUE, 'Asia'),

-- The Last of Us Part II (game_id: 23) - 10 codes
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 1, 'TLOU2-PSN-P5Q6R-S7T8U-V9W0X', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 1, 'TLOU2-PSN-Y1Z2A-B3C4D-E5F6G', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 1, 'TLOU2-PSN-H7I8J-K9L0M-N1O2P', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 1, 'TLOU2-PSN-Q3R4S-T5U6V-W7X8Y', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 1, 'TLOU2-PSN-Z9A0B-C1D2E-F3G4H', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 2, 'TLOU2-PSN-I5J6K-L7M8N-O9P0Q', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 2, 'TLOU2-PSN-R1S2T-U3V4W-X5Y6Z', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 2, 'TLOU2-PSN-A7B8C-D9E0F-G1H2I', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 2, 'TLOU2-PSN-J3K4L-M5N6O-P7Q8R', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Last of Us Part II' AND platform = 'PlayStation' LIMIT 1), 2, 'TLOU2-PSN-S9T0U-V1W2X-Y3Z4A', 950.00, 'available', TRUE, 'Asia'),

-- Ghost of Tsushima (game_id: 24) - 8 codes
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 1, 'GOT-PSN-B5C6D-E7F8G-H9I0J', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 1, 'GOT-PSN-K1L2M-N3O4P-Q5R6S', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 1, 'GOT-PSN-T7U8V-W9X0Y-Z1A2B', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 1, 'GOT-PSN-C3D4E-F5G6H-I7J8K', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 2, 'GOT-PSN-L9M0N-O1P2Q-R3S4T', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 2, 'GOT-PSN-U5V6W-X7Y8Z-A9B0C', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 2, 'GOT-PSN-D1E2F-G3H4I-J5K6L', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 2, 'GOT-PSN-M7N8O-P9Q0R-S1T2U', 850.00, 'available', TRUE, 'Asia'),

-- Final Fantasy XVI (game_id: 26) - 10 codes
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 1, 'FF16-PSN-V3W4X-Y5Z6A-B7C8D', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 1, 'FF16-PSN-E9F0G-H1I2J-K3L4M', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 1, 'FF16-PSN-N5O6P-Q7R8S-T9U0V', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 1, 'FF16-PSN-W1X2Y-Z3A4B-C5D6E', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 1, 'FF16-PSN-F7G8H-I9J0K-L1M2N', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 2, 'FF16-PSN-O3P4Q-R5S6T-U7V8W', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 2, 'FF16-PSN-X9Y0Z-A1B2C-D3E4F', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 2, 'FF16-PSN-G5H6I-J7K8L-M9N0O', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 2, 'FF16-PSN-P1Q2R-S3T4U-V5W6X', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Final Fantasy XVI' AND platform = 'PlayStation' LIMIT 1), 2, 'FF16-PSN-Y7Z8A-B9C0D-E1F2G', 1450.00, 'available', TRUE, 'Asia'),

-- Persona 5 Royal (game_id: 33) - 8 codes
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 1, 'P5R-PSN-H3I4J-K5L6M-N7O8P', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 1, 'P5R-PSN-Q9R0S-T1U2V-W3X4Y', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 1, 'P5R-PSN-Z5A6B-C7D8E-F9G0H', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 1, 'P5R-PSN-I1J2K-L3M4N-O5P6Q', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 2, 'P5R-PSN-R7S8T-U9V0W-X1Y2Z', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 2, 'P5R-PSN-A3B4C-D5E6F-G7H8I', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 2, 'P5R-PSN-J9K0L-M1N2O-P3Q4R', 850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 2, 'P5R-PSN-S5T6U-V7W8X-Y9Z0A', 850.00, 'available', TRUE, 'Asia'),

-- EA Sports FC 24 (game_id: 35) - 10 codes
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 1, 'FC24-PSN-B1C2D-E3F4G-H5I6J', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 1, 'FC24-PSN-K7L8M-N9O0P-Q1R2S', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 1, 'FC24-PSN-T3U4V-W5X6Y-Z7A8B', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 1, 'FC24-PSN-C9D0E-F1G2H-I3J4K', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 1, 'FC24-PSN-L5M6N-O7P8Q-R9S0T', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 2, 'FC24-PSN-U1V2W-X3Y4Z-A5B6C', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 2, 'FC24-PSN-D7E8F-G9H0I-J1K2L', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 2, 'FC24-PSN-M3N4O-P5Q6R-S7T8U', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 2, 'FC24-PSN-V9W0X-Y1Z2A-B3C4D', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'EA Sports FC 24' AND platform = 'PlayStation' LIMIT 1), 2, 'FC24-PSN-E5F6G-H7I8J-K9L0M', 1250.00, 'available', TRUE, 'Asia');

-- Xbox Games Codes (80 รหัส)
INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region) VALUES
-- Halo Infinite (game_id: 36) - 10 codes
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 1, 'HALO-XBOX-N1O2P-Q3R4S-T5U6V', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 1, 'HALO-XBOX-W7X8Y-Z9A0B-C1D2E', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 1, 'HALO-XBOX-F3G4H-I5J6K-L7M8N', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 1, 'HALO-XBOX-O9P0Q-R1S2T-U3V4W', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 1, 'HALO-XBOX-X5Y6Z-A7B8C-D9E0F', 990.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 2, 'HALO-XBOX-G1H2I-J3K4L-M5N6O', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 2, 'HALO-XBOX-P7Q8R-S9T0U-V1W2X', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 2, 'HALO-XBOX-Y3Z4A-B5C6D-E7F8G', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 2, 'HALO-XBOX-H9I0J-K1L2M-N3O4P', 950.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Halo Infinite' AND platform = 'Xbox' LIMIT 1), 2, 'HALO-XBOX-Q5R6S-T7U8V-W9X0Y', 950.00, 'available', TRUE, 'Asia'),

-- Forza Horizon 5 (game_id: 37) - 10 codes
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 1, 'FH5-XBOX-Z1A2B-C3D4E-F5G6H', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 1, 'FH5-XBOX-I7J8K-L9M0N-O1P2Q', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 1, 'FH5-XBOX-R3S4T-U5V6W-X7Y8Z', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 1, 'FH5-XBOX-A9B0C-D1E2F-G3H4I', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 1, 'FH5-XBOX-J5K6L-M7N8O-P9Q0R', 1290.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 2, 'FH5-XBOX-S1T2U-V3W4X-Y5Z6A', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 2, 'FH5-XBOX-B7C8D-E9F0G-H1I2J', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 2, 'FH5-XBOX-K3L4M-N5O6P-Q7R8S', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 2, 'FH5-XBOX-T9U0V-W1X2Y-Z3A4B', 1250.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Forza Horizon 5' AND platform = 'Xbox' LIMIT 1), 2, 'FH5-XBOX-C5D6E-F7G8H-I9J0K', 1250.00, 'available', TRUE, 'Asia'),

-- Starfield (game_id: 38) - 10 codes
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 1, 'STAR-XBOX-L1M2N-O3P4Q-R5S6T', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 1, 'STAR-XBOX-U7V8W-X9Y0Z-A1B2C', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 1, 'STAR-XBOX-D3E4F-G5H6I-J7K8L', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 1, 'STAR-XBOX-M9N0O-P1Q2R-S3T4U', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 1, 'STAR-XBOX-V5W6X-Y7Z8A-B9C0D', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 2, 'STAR-XBOX-E1F2G-H3I4J-K5L6M', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 2, 'STAR-XBOX-N7O8P-Q9R0S-T1U2V', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 2, 'STAR-XBOX-W3X4Y-Z5A6B-C7D8E', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 2, 'STAR-XBOX-F9G0H-I1J2K-L3M4N', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Starfield' AND platform = 'Xbox' LIMIT 1), 2, 'STAR-XBOX-O5P6Q-R7S8T-U9V0W', 1450.00, 'available', TRUE, 'Asia'),

-- Sea of Thieves (game_id: 40) - 8 codes
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 1, 'SOT-XBOX-X1Y2Z-A3B4C-D5E6F', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 1, 'SOT-XBOX-G7H8I-J9K0L-M1N2O', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 1, 'SOT-XBOX-P3Q4R-S5T6U-V7W8X', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 1, 'SOT-XBOX-Y9Z0A-B1C2D-E3F4G', 590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 2, 'SOT-XBOX-H5I6J-K7L8M-N9O0P', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 2, 'SOT-XBOX-Q1R2S-T3U4V-W5X6Y', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 2, 'SOT-XBOX-Z7A8B-C9D0E-F1G2H', 570.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Sea of Thieves' AND platform = 'Xbox' LIMIT 1), 2, 'SOT-XBOX-I3J4K-L5M6N-O7P8Q', 570.00, 'available', TRUE, 'Asia');

-- Nintendo Games Codes (80 รหัส)
INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region) VALUES
-- Zelda TOTK (game_id: 46) - 12 codes
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-R9S0T-U1V2W-X3Y4Z', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-A5B6C-D7E8F-G9H0I', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-J1K2L-M3N4O-P5Q6R', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-S7T8U-V9W0X-Y1Z2A', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-B3C4D-E5F6G-H7I8J', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 1, 'ZELDA-NSW-K9L0M-N1O2P-Q3R4S', 1890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-T5U6V-W7X8Y-Z9A0B', 1850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-C1D2E-F3G4H-I5J6K', 1850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-L7M8N-O9P0Q-R1S2T', 1850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-U3V4W-X5Y6Z-A7B8C', 1850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-D9E0F-G1H2I-J3K4L', 1850.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 2, 'ZELDA-NSW-M5N6O-P7Q8R-S9T0U', 1850.00, 'available', TRUE, 'Asia'),

-- Super Mario Bros Wonder (game_id: 47) - 10 codes
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 1, 'MARIO-NSW-V1W2X-Y3Z4A-B5C6D', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 1, 'MARIO-NSW-E7F8G-H9I0J-K1L2M', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 1, 'MARIO-NSW-N3O4P-Q5R6S-T7U8V', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 1, 'MARIO-NSW-W9X0Y-Z1A2B-C3D4E', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 1, 'MARIO-NSW-F5G6H-I7J8K-L9M0N', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 2, 'MARIO-NSW-O1P2Q-R3S4T-U5V6W', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 2, 'MARIO-NSW-X7Y8Z-A9B0C-D1E2F', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 2, 'MARIO-NSW-G3H4I-J5K6L-M7N8O', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 2, 'MARIO-NSW-P9Q0R-S1T2U-V3W4X', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Mario Bros. Wonder' AND platform = 'Nintendo' LIMIT 1), 2, 'MARIO-NSW-Y5Z6A-B7C8D-E9F0G', 1550.00, 'available', TRUE, 'Asia'),

-- Pokemon Scarlet/Violet (game_id: 48) - 10 codes
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 1, 'POKE-NSW-H1I2J-K3L4M-N5O6P', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 1, 'POKE-NSW-Q7R8S-T9U0V-W1X2Y', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 1, 'POKE-NSW-Z3A4B-C5D6E-F7G8H', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 1, 'POKE-NSW-I9J0K-L1M2N-O3P4Q', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 1, 'POKE-NSW-R5S6T-U7V8W-X9Y0Z', 1590.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 2, 'POKE-NSW-A1B2C-D3E4F-G5H6I', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 2, 'POKE-NSW-J7K8L-M9N0O-P1Q2R', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 2, 'POKE-NSW-S3T4U-V5W6X-Y7Z8A', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 2, 'POKE-NSW-B9C0D-E1F2G-H3I4J', 1550.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Pokemon Scarlet/Violet' AND platform = 'Nintendo' LIMIT 1), 2, 'POKE-NSW-K5L6M-N7O8P-Q9R0S', 1550.00, 'available', TRUE, 'Asia'),

-- Mario Kart 8 Deluxe (game_id: 52) - 8 codes
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 1, 'MK8D-NSW-T1U2V-W3X4Y-Z5A6B', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 1, 'MK8D-NSW-C7D8E-F9G0H-I1J2K', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 1, 'MK8D-NSW-L3M4N-O5P6Q-R7S8T', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 1, 'MK8D-NSW-U9V0W-X1Y2Z-A3B4C', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 2, 'MK8D-NSW-D5E6F-G7H8I-J9K0L', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 2, 'MK8D-NSW-M1N2O-P3Q4R-S5T6U', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 2, 'MK8D-NSW-V7W8X-Y9Z0A-B1C2D', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Mario Kart 8 Deluxe' AND platform = 'Nintendo' LIMIT 1), 2, 'MK8D-NSW-E3F4G-H5I6J-K7L8M', 1350.00, 'available', TRUE, 'Asia'),

-- Smash Bros Ultimate (game_id: 50) - 8 codes
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 1, 'SSBU-NSW-N9O0P-Q1R2S-T3U4V', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 1, 'SSBU-NSW-W5X6Y-Z7A8B-C9D0E', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 1, 'SSBU-NSW-F1G2H-I3J4K-L5M6N', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 1, 'SSBU-NSW-O7P8Q-R9S0T-U1V2W', 1390.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 2, 'SSBU-NSW-X3Y4Z-A5B6C-D7E8F', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 2, 'SSBU-NSW-G9H0I-J1K2L-M3N4O', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 2, 'SSBU-NSW-P5Q6R-S7T8U-V9W0X', 1350.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Super Smash Bros. Ultimate' AND platform = 'Nintendo' LIMIT 1), 2, 'SSBU-NSW-Y1Z2A-B3C4D-E5F6G', 1350.00, 'available', TRUE, 'Asia');

-- Epic Games Codes (40 รหัส)
INSERT INTO game_codes (game_id, seller_id, code, price, status, is_public, region) VALUES
-- Fortnite V-Bucks 1000 (game_id: 56) - 15 codes
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-H7I8J-K9L0M-N1O2P', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-Q3R4S-T5U6V-W7X8Y', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-Z9A0B-C1D2E-F3G4H', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-I5J6K-L7M8N-O9P0Q', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-R1S2T-U3V4W-X5Y6Z', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-A7B8C-D9E0F-G1H2I', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-J3K4L-M5N6O-P7Q8R', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-1K-S9T0U-V1W2X-Y3Z4A', 350.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-B5C6D-E7F8G-H9I0J', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-K1L2M-N3O4P-Q5R6S', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-T7U8V-W9X0Y-Z1A2B', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-C3D4E-F5G6H-I7J8K', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-L9M0N-O1P2Q-R3S4T', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-U5V6W-X7Y8Z-A9B0C', 340.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 1000' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-1K-D1E2F-G3H4I-J5K6L', 340.00, 'available', TRUE, 'Asia'),

-- Fortnite V-Bucks 2800 (game_id: 57) - 10 codes
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-2K-M7N8O-P9Q0R-S1T2U', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-2K-V3W4X-Y5Z6A-B7C8D', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-2K-E9F0G-H1I2J-K3L4M', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-2K-N5O6P-Q7R8S-T9U0V', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 1, 'FORT-2K-W1X2Y-Z3A4B-C5D6E', 890.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-2K-F7G8H-I9J0K-L1M2N', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-2K-O3P4Q-R5S6T-U7V8W', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-2K-X9Y0Z-A1B2C-D3E4F', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-2K-G5H6I-J7K8L-M9N0O', 870.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Fortnite V-Bucks 2800' AND platform = 'Epic Games' LIMIT 1), 2, 'FORT-2K-P1Q2R-S3T4U-V5W6X', 870.00, 'available', TRUE, 'Asia'),

-- Alan Wake 2 (game_id: 59) - 8 codes
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 1, 'ALAN-EPIC-Y7Z8A-B9C0D-E1F2G', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 1, 'ALAN-EPIC-H3I4J-K5L6M-N7O8P', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 1, 'ALAN-EPIC-Q9R0S-T1U2V-W3X4Y', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 1, 'ALAN-EPIC-Z5A6B-C7D8E-F9G0H', 1490.00, 'available', TRUE, 'Global'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 2, 'ALAN-EPIC-I1J2K-L3M4N-O5P6Q', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 2, 'ALAN-EPIC-R7S8T-U9V0W-X1Y2Z', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 2, 'ALAN-EPIC-A3B4C-D5E6F-G7H8I', 1450.00, 'available', TRUE, 'Asia'),
((SELECT game_id FROM games WHERE name = 'Alan Wake 2' AND platform = 'Epic Games' LIMIT 1), 2, 'ALAN-EPIC-J9K0L-M1N2O-P3Q4R', 1450.00, 'available', TRUE, 'Asia');

-- =============================================
-- 5. Mystery Boxes (Gacha) - 12 กล่อง
-- =============================================
INSERT INTO mystery_boxes (name, name_th, description, description_th, price, rarity, is_active) VALUES
('Bronze Box', 'กล่องบรอนซ์', 'Basic mystery box with common prizes', 'กล่องสุ่มพื้นฐาน รางวัลทั่วไป', 29.00, 'common', TRUE),
('Silver Box', 'กล่องเงิน', 'Better prizes with higher chances', 'รางวัลดีขึ้น โอกาสสูงขึ้น', 79.00, 'common', TRUE),
('Gold Box', 'กล่องทอง', 'Premium prizes including game codes', 'รางวัลพรีเมียม รวมถึงโค้ดเกม', 199.00, 'rare', TRUE),
('Platinum Box', 'กล่องแพลทินัม', 'Exclusive prizes, guaranteed value', 'รางวัลสุดพิเศษ การันตีคุ้มค่า', 499.00, 'epic', TRUE),
('Diamond Box', 'กล่องเพชร', 'Ultra rare prizes, best games included', 'รางวัลหายากสุด เกมดังรวมอยู่', 999.00, 'legendary', TRUE),
('Steam Lucky Box', 'กล่อง Steam สุ่มโชค', 'Random Steam game codes only', 'สุ่มโค้ดเกม Steam เท่านั้น', 299.00, 'rare', TRUE),
('PlayStation Treasure', 'สมบัติ PlayStation', 'PlayStation game codes and credits', 'โค้ดเกมและเครดิต PlayStation', 399.00, 'rare', TRUE),
('Xbox Fortune', 'โชคลาภ Xbox', 'Xbox game codes and Game Pass', 'โค้ดเกมและ Game Pass Xbox', 399.00, 'rare', TRUE),
('Nintendo Surprise', 'เซอร์ไพรส์ Nintendo', 'Nintendo Switch game codes', 'โค้ดเกม Nintendo Switch', 449.00, 'rare', TRUE),
('Mega Bundle Box', 'กล่องรวมมิตร', 'Multi-platform game codes', 'โค้ดเกมหลายแพลตฟอร์ม', 599.00, 'epic', TRUE),
('Wallet Boost Box', 'กล่องเติมเงิน', 'Win wallet credits 50-500 baht', 'ลุ้นเครดิต 50-500 บาท', 99.00, 'common', TRUE),
('Ultimate Box', 'กล่องอัลติเมท', 'Guaranteed AAA game or 1000+ credits', 'การันตีเกม AAA หรือเครดิต 1000+', 1499.00, 'legendary', TRUE);

-- =============================================
-- 6. Box Items (รางวัลในกล่อง)
-- =============================================
INSERT INTO box_items (box_id, name, item_type, prize_data, drop_rate, rarity) VALUES
-- Bronze Box (box_id: 1)
(1, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 40.00, 'common'),
(1, 'เครดิต 10 บาท', 'wallet_credit', '{"credit": 10}', 30.00, 'common'),
(1, 'เครดิต 30 บาท', 'wallet_credit', '{"credit": 30}', 20.00, 'common'),
(1, 'เครดิต 50 บาท', 'wallet_credit', '{"credit": 50}', 8.00, 'rare'),
(1, 'เครดิต 100 บาท', 'wallet_credit', '{"credit": 100}', 2.00, 'epic'),

-- Silver Box (box_id: 2)
(2, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 25.00, 'common'),
(2, 'เครดิต 30 บาท', 'wallet_credit', '{"credit": 30}', 30.00, 'common'),
(2, 'เครดิต 50 บาท', 'wallet_credit', '{"credit": 50}', 25.00, 'common'),
(2, 'เครดิต 100 บาท', 'wallet_credit', '{"credit": 100}', 15.00, 'rare'),
(2, 'เครดิต 200 บาท', 'wallet_credit', '{"credit": 200}', 5.00, 'epic'),

-- Gold Box (box_id: 3)
(3, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 15.00, 'common'),
(3, 'เครดิต 100 บาท', 'wallet_credit', '{"credit": 100}', 30.00, 'common'),
(3, 'เครดิต 200 บาท', 'wallet_credit', '{"credit": 200}', 25.00, 'rare'),
(3, 'Stardew Valley', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 15.00, 'rare'),
(3, 'เครดิต 500 บาท', 'wallet_credit', '{"credit": 500}', 10.00, 'epic'),
(3, 'The Witcher 3', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 5.00, 'epic'),

-- Platinum Box (box_id: 4)
(4, 'เครดิต 200 บาท', 'wallet_credit', '{"credit": 200}', 25.00, 'common'),
(4, 'เครดิต 300 บาท', 'wallet_credit', '{"credit": 300}', 25.00, 'rare'),
(4, 'Monster Hunter World', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 20.00, 'rare'),
(4, 'เครดิต 500 บาท', 'wallet_credit', '{"credit": 500}', 15.00, 'epic'),
(4, 'Cyberpunk 2077', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 10.00, 'epic'),
(4, 'Elden Ring', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 5.00, 'legendary'),

-- Diamond Box (box_id: 5)
(5, 'เครดิต 500 บาท', 'wallet_credit', '{"credit": 500}', 20.00, 'rare'),
(5, 'Cyberpunk 2077', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Cyberpunk 2077' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 20.00, 'epic'),
(5, 'Red Dead Redemption 2', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Red Dead Redemption 2' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 20.00, 'epic'),
(5, 'เครดิต 1000 บาท', 'wallet_credit', '{"credit": 1000}', 15.00, 'epic'),
(5, 'Elden Ring', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 15.00, 'legendary'),
(5, 'Baldur''s Gate 3', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Baldur''s Gate 3' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 10.00, 'legendary'),

-- Steam Lucky Box (box_id: 6)
(6, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 20.00, 'common'),
(6, 'Stardew Valley', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Stardew Valley' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 25.00, 'common'),
(6, 'The Witcher 3', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 20.00, 'rare'),
(6, 'Hades', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Hades' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 15.00, 'rare'),
(6, 'Monster Hunter World', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Monster Hunter: World' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 10.00, 'epic'),
(6, 'GTA V', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 10.00, 'epic'),

-- PlayStation Treasure (box_id: 7)
(7, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 15.00, 'common'),
(7, 'เครดิต 200 บาท', 'wallet_credit', '{"credit": 200}', 25.00, 'common'),
(7, 'Bloodborne', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Bloodborne' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 20.00, 'rare'),
(7, 'Persona 5 Royal', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Persona 5 Royal' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 15.00, 'rare'),
(7, 'Ghost of Tsushima', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Ghost of Tsushima' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 15.00, 'epic'),
(7, 'God of War Ragnarök', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 10.00, 'legendary'),

-- Wallet Boost Box (box_id: 11)
(11, 'เกลือ (ไม่ได้รางวัล)', 'item', '{"type": "salt", "value": 0}', 20.00, 'common'),
(11, 'เครดิต 50 บาท', 'wallet_credit', '{"credit": 50}', 30.00, 'common'),
(11, 'เครดิต 100 บาท', 'wallet_credit', '{"credit": 100}', 25.00, 'common'),
(11, 'เครดิต 200 บาท', 'wallet_credit', '{"credit": 200}', 15.00, 'rare'),
(11, 'เครดิต 300 บาท', 'wallet_credit', '{"credit": 300}', 7.00, 'epic'),
(11, 'เครดิต 500 บาท', 'wallet_credit', '{"credit": 500}', 3.00, 'legendary'),

-- Ultimate Box (box_id: 12)
(12, 'เครดิต 1000 บาท', 'wallet_credit', '{"credit": 1000}', 25.00, 'epic'),
(12, 'God of War Ragnarök', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 15.00, 'legendary'),
(12, 'Spider-Man 2', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Marvel''s Spider-Man 2' AND platform = 'PlayStation' LIMIT 1), 'platform', 'PlayStation'), 15.00, 'legendary'),
(12, 'Zelda TOTK', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 'platform', 'Nintendo'), 15.00, 'legendary'),
(12, 'Elden Ring', 'game_code', json_build_object('game_id', (SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 'platform', 'Steam'), 15.00, 'legendary'),
(12, 'เครดิต 2000 บาท', 'wallet_credit', '{"credit": 2000}', 15.00, 'legendary');

-- =============================================
-- 7. Coupons (12 คูปอง)
-- =============================================
INSERT INTO coupons (code, discount_type, discount_amount, min_purchase, max_discount, usage_limit, is_active) VALUES
('WELCOME10', 'percent', 10.00, 100.00, 100.00, 1000, TRUE),
('NEWYEAR2025', 'percent', 15.00, 200.00, 200.00, 500, TRUE),
('STEAM20', 'percent', 20.00, 500.00, 300.00, 200, TRUE),
('PLAYSTATION15', 'percent', 15.00, 500.00, 250.00, 200, TRUE),
('XBOX15', 'percent', 15.00, 500.00, 250.00, 200, TRUE),
('NINTENDO10', 'percent', 10.00, 500.00, 200.00, 200, TRUE),
('FLAT50', 'fixed', 50.00, 300.00, NULL, 500, TRUE),
('FLAT100', 'fixed', 100.00, 500.00, NULL, 300, TRUE),
('FLAT200', 'fixed', 200.00, 1000.00, NULL, 100, TRUE),
('VIP500', 'fixed', 500.00, 2000.00, NULL, 50, TRUE),
('SUMMER25', 'percent', 25.00, 300.00, 500.00, 100, TRUE),
('FIRSTBUY', 'percent', 20.00, 0.00, 150.00, 2000, TRUE);

-- =============================================
-- 8. Sample Reviews
-- =============================================
INSERT INTO reviews (user_id, game_id, rating, comment, is_verified_purchase, helpful_count) VALUES
(3, (SELECT game_id FROM games WHERE name = 'Grand Theft Auto V' AND platform = 'Steam' LIMIT 1), 5, 'GTA V เกมที่ดีที่สุดตลอดกาล! เล่นมาหลายร้อยชั่วโมง ออนไลน์สนุกมาก', TRUE, 42),
(3, (SELECT game_id FROM games WHERE name = 'Elden Ring' AND platform = 'Steam' LIMIT 1), 5, 'Elden Ring เกมที่ยากที่สุดที่เคยเล่น แต่ก็สนุกมากด้วย บอสโหดมาก', TRUE, 38),
(3, (SELECT game_id FROM games WHERE name = 'The Witcher 3: Wild Hunt' AND platform = 'Steam' LIMIT 1), 5, 'The Witcher 3 เกม RPG ที่ดีที่สุด เนื้อเรื่องดีมาก จบแล้วยังอยากเล่นอีก', TRUE, 55),
(3, (SELECT game_id FROM games WHERE name = 'God of War Ragnarök' AND platform = 'PlayStation' LIMIT 1), 5, 'God of War Ragnarök สุดยอดเกมแอ็คชั่น เนื้อเรื่องซึ้งมาก กราฟิกสวย', TRUE, 28),
(3, (SELECT game_id FROM games WHERE name = 'The Legend of Zelda: Tears of the Kingdom' AND platform = 'Nintendo' LIMIT 1), 5, 'Zelda TOTK เกมผจญภัยที่ดีที่สุด อิสระมาก สร้างอะไรก็ได้', TRUE, 35);

-- =============================================
-- Done! Total seed data:
-- - 8 Categories
-- - 3 Users (admin, seller, testuser)
-- - 60 Games
-- - 550+ Game Codes
-- - 12 Mystery Boxes
-- - 60+ Box Items
-- - 12 Coupons
-- - 5 Sample Reviews
-- =============================================
