import { useEffect } from 'react';

const replacements = [
  ['SYNNEX', 'SYNNEX'],
  ['SYNNEX', 'SYNNEX'],
  ['SYNNEX', 'SYNNEX'],
  ['ลุ้นไอดี', 'Win Game IDs'],
  ['เทพมากมาย', 'Amazing Game Accounts'],
  ['คลิกเพื่อสุ่ม', 'Click to Draw'],
  ['ค้นหาเกม...', 'Search games...'],
  ['ล้าง', 'Clear'],
  ['ไอดีเกมออนไลน์', 'Online Game IDs'],
  ['ยินดีต้อนรับ,', 'Welcome,'],
  ['ออกจากระบบ', 'Log out'],
  ['ประวัติการสั่งซื้อ', 'Order History'],
  ['คลังของฉัน', 'My Inventory'],
  ['การแจ้งเตือน', 'Notifications'],
  ['แหล่งรวมรหัสgamesPriceถูก บริการเติมgames 24 ชม. ปลอดภัย 100%', 'Affordable game keys and 24/hr Services. 100% secure.'],
  ['แหล่งรวมรหัสเกมราคาถูก บริการเติมเกม 24 ชม. ปลอดภัย 100%', 'Affordable game keys and 24/hr Services. 100% secure.'],
  ['บริการ 24 ชั่วโมง', '24/hr Services'],
  ['บริการเติมเกม 24 ชม.', '24/hr Services'],
  ['ลุ้นไอGood Amazing game accounts', 'Win Amazing Game Accounts'],
  ['ลุ้นไอ', 'Win'],
  ['ไอGoodgamesออนไลน์', 'Online Game IDs'],
  ['ไอGood', 'Game'],
  ['เปรียบเทียบgames', 'Compare Games'],
  ['เปรียบเทียบเกม', 'Compare Games'],
  ['รับฟรี', 'Free Rewards'],
  ['หน้าหลัก', 'Home'],
  ['เติมเงิน', 'Top Up'],
  ['เติมเกม', 'Top Up Games'],
  ['สุ่มของรางวัล', 'Random Prizes'],
  ['Random prizes', 'Random Prizes'],
  ['เติมเงินเข้าระบบ', 'Top Up Wallet'],
  ['ข้อมูลส่วนตัว', 'Profile'],
  ['สินค้าแนะนำ', 'Featured Products'],
  ['สินค้า แนะนำ', 'Featured Products'],
  ['***สินค้า แนะนำ***', 'Featured Products'],
  ['***สินค้าแนะนำ***', 'Featured Products'],
  ['สินค้า  แนะนำ', 'Featured Products'],
  ['ยังไม่มีgamesในระบบ', 'No games available yet'],
  ['ยังไม่มีเกมในระบบ', 'No games available yet'],
  ['รอ Admin เพิ่มgamesเข้ามาในระบบ', 'Waiting for the admin to add games to the store'],
  ['รอ Admin เพิ่มเกมเข้ามาในระบบ', 'Waiting for the admin to add games to the store'],
  ['Game ID Shop', 'Game ID Shop'],
  ['Profile & Stock', 'Profile & Inventory'],
  ['กลับหน้าหลัก', 'Back to Home'],
  ['กลับ', 'Back'],
  ['กำลังโหลดตู้กาชา...', 'Loading gacha boxes...'],
  ['วัดดวงเสี่ยงโชค ลุ้นรับรหัสเทพในราคาหลักสิบ!', 'Test your luck and win premium game codes at low prices!'],
  ['กรุณาเข้าสู่ระบบก่อนสุ่ม', 'Please sign in before spinning'],
  ['ยืนยันการสุ่มในราคา', 'Confirm spin for'],
  ['บาท', 'MMK'],
  ['กำลังสุ่ม...', 'Spinning...'],
  ['สุ่มเลย!', 'Spin Now!'],
  ['ลุ้นรับรางวัลใหญ่!', 'Win a grand prize!'],
  ['เกิดข้อผิดพลาดในการสุ่ม', 'An error occurred while spinning'],
  ['เกลือจ้า! คุณได้:', 'Better luck next time! You won:'],
  ['ยินดีด้วย!! คุณได้:', 'Congratulations! You won:'],
  ['เพิ่มเกมเพื่อเปรียบเทียบ', 'Add games to compare'],
  ['เพิ่มgamesเพื่อเปรียบเทียบ', 'Add games to compare'],
  ['ยังไม่มีเกมที่เลือก', 'No games selected'],
  ['ยังไม่มีgamesที่เลือก', 'No games selected'],
  ['เพิ่มเกมเพื่อเริ่มเปรียบเทียบ', 'Add games to start comparing'],
  ['เพิ่มgamesเพื่อเริ่มเปรียบเทียบ', 'Add games to start comparing'],
  ['เกมสูงสุด 3 เกม', 'Up to 3 games'],
  ['เปรียบเทียบสูงสุด 3 เกม', 'Compare up to 3 games'],
  ['เปรียบเทียบgamesสูงสุด 3 games', 'Compare up to 3 games'],
  ['ไอดีเกมออนไลน์ทั้งหมด', 'All Online Game IDs'],
  ['เลือกซื้อเกมที่คุณชอบ มีให้เลือก', 'Choose the games you like. We have'],
  ['เกม', 'games'],
  ['แสดงแบบตาราง', 'Grid view'],
  ['แสดงแบบรายการ', 'List view'],
  ['ค้นหาเกม, แพลตฟอร์ม...', 'Search games, platform...'],
  ['ทุกแพลตฟอร์ม', 'All Platforms'],
  ['เรียงตามค่าเริ่มต้น', 'Sort by Default'],
  ['ราคา: ต่ำ → สูง', 'Price: Low → High'],
  ['ราคา: สูง → ต่ำ', 'Price: High → Low'],
  ['ชื่อ: A → Z', 'Name: A → Z'],
  ['พบ ', 'Found '],
  [' รายการ', ' items'],
  [' จาก "', ' from "'],
  ['" ในแพลตฟอร์ม ', '" on platform '],
  ['ล้างทั้งหมด', 'Clear All'],
  ['ไม่พบเกมที่ค้นหา', 'No games found'],
  ['ล้างการค้นหา', 'Clear Search'],
  ['กรุณาเข้าสู่ระบบก่อน', 'Please sign in first'],
  ['เพิ่มในรายการโปรดแล้ว', 'Added to wishlist'],
  ['ลบออกจากรายการโปรดแล้ว', 'Removed from wishlist'],
  ['เกิดข้อผิดพลาด', 'An error occurred'],
  ['ไม่สามารถโหลดเกมได้', 'Unable to load games'],
  ['เพิ่มในรายการโปรด', 'Add to wishlist'],
  ['ลบออกจากรายการโปรด', 'Remove from wishlist'],
  ['Copyright © 2025 GameKey Market. All rights reserved.', 'Copyright © 2025 SYNNEX. All rights reserved.'],
  ['GameKey Market', 'SYNNEX'],
  ['GAMEKEY MARKET', 'SYNNEX'],
  ['GameKey market', 'SYNNEX'],
  ['gamekey market', 'SYNNEX'],
];

const translate = (value) => replacements.reduce((text, [from, to]) => text.split(from).join(to), value);

export default function EnglishUiGuard() {
  useEffect(() => {
    const replaceText = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const next = translate(node.nodeValue);
        if (next !== node.nodeValue) node.nodeValue = next;
      });
      document.querySelectorAll('input, textarea, select, button, img, [aria-label], [title]').forEach((element) => {
        ['placeholder', 'title', 'aria-label', 'alt'].forEach((attribute) => {
          const value = element.getAttribute(attribute);
          if (!value) return;
          const next = translate(value);
          if (next !== value) element.setAttribute(attribute, next);
        });
      });
      if (document.title) document.title = translate(document.title);
      document.querySelectorAll('meta').forEach((element) => {
        const content = element.getAttribute('content');
        if (!content) return;
        const next = translate(content);
        if (next !== content) element.setAttribute('content', next);
      });
    };

    replaceText();
    const observer = new MutationObserver(replaceText);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
