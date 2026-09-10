import { useEffect } from 'react';

const replacements = [
  ['แหล่งรวมรหัสgamesPriceถูก บริการเติมgames 24 ชม. ปลอดภัย 100%', 'Affordable game keys, 24/7 top-up service, 100% secure'],
  ['แหล่งรวมรหัสเกมราคาถูก บริการเติมเกม 24 ชม. ปลอดภัย 100%', 'Affordable game keys, 24/7 top-up service, 100% secure'],
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
  ['ยังไม่มีgamesในระบบ', 'No games available yet'],
  ['ยังไม่มีเกมในระบบ', 'No games available yet'],
  ['รอ Admin เพิ่มgamesเข้ามาในระบบ', 'Waiting for the admin to add games to the store'],
  ['รอ Admin เพิ่มเกมเข้ามาในระบบ', 'Waiting for the admin to add games to the store'],
  ['Game ID Shop', 'Game ID Shop'],
  ['Profile & Stock', 'Profile & Inventory'],
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
