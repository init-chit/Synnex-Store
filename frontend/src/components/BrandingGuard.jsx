import { useEffect } from 'react';

const replacements = [
  ['NICKKEY', 'SYNNEX'],
  ['NICKYKEY', 'SYNNEX'],
  ['NickyKey', 'SYNNEX'],
  ['NICKKEY STORE', 'SYNNEX'],
  ['NICKYKEY STORE', 'SYNNEX'],
  ['NickyKey Store', 'SYNNEX'],
  ['GAME STORE CENTER', 'DIGITAL GAME STORE'],
  ['กรุณาเข้าสู่ระบบก่อน', 'Please log in first'],
  ['กรุณาล็อกอินก่อน', 'Please log in first'],
  ['เข้าสู่ระบบสำเร็จ! 🎉', 'Login successful! 🎉'],
  ['อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'Invalid email or password'],
  ['สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'Registration successful! Please log in'],
  ['เกิดข้อผิดพลาดในการสมัครสมาชิก', 'Registration failed'],
  ['เกิดข้อผิดพลาด', 'Something went wrong'],
  ['ไม่สามารถโหลดเกมได้', 'Unable to load games'],
  ['เพิ่มในรายการโปรดแล้ว', 'Added to wishlist'],
  ['ลบออกจากรายการโปรดแล้ว', 'Removed from wishlist'],
  ['ออกจากระบบสำเร็จ', 'Logged out successfully'],
  ['ยินดีต้อนรับ', 'Welcome'],
  ['ยินดีต้อนรับกลับมา!', 'Welcome back!'],
  ['สมัครสมาชิก', 'Register'],
  ['เข้าสู่ระบบ', 'Log in'],
  ['ลืมรหัสผ่าน?', 'Forgot password?'],
  ['จดจำฉันไว้', 'Remember me'],
  ['กำลังเข้าสู่ระบบ...', 'Logging in...'],
  ['สร้างบัญชีของคุณเพื่อเริ่มต้นใช้งาน', 'Create your account to get started'],
  ['ชื่อผู้ใช้', 'Username'],
  ['อีเมล', 'Email'],
  ['รหัสผ่าน', 'Password'],
  ['กำลังสมัครสมาชิก...', 'Creating account...'],
  ['หรือสมัครด้วย', 'Or continue with'],
  ['มีบัญชีอยู่แล้ว?', 'Already have an account?'],
  ['ยังไม่มีบัญชี?', 'Don’t have an account?'],
  ['ความแข็งแรงของรหัสผ่าน:', 'Password strength:'],
  ['อ่อนแอ', 'Weak'],
  ['ปานกลาง', 'Fair'],
  ['ดี', 'Good'],
  ['แข็งแรงมาก', 'Strong'],
  ['ค้นหาเกม...', 'Search games...'],
  ['ค้นหาเกม, แพลตฟอร์ม...', 'Search games, platforms...'],
  ['พบ ', 'Found '],
  [' รายการ', ' results'],
  ['ล้าง', 'Clear'],
  ['ล้างทั้งหมด', 'Clear all'],
  ['ตัวกรองและเรียงลำดับ', 'Filters & Sorting'],
  ['แพลตฟอร์ม', 'Platform'],
  ['ราคา', 'Price'],
  ['เรียงลำดับ', 'Sort by'],
  ['ทั้งหมด', 'All'],
  ['ต่ำกว่า 500฿', 'Under ฿500'],
  ['มากกว่า 2,000฿', 'Over ฿2,000'],
  ['ค่าเริ่มต้น', 'Default'],
  ['ราคาต่ำ → สูง', 'Price: Low → High'],
  ['ราคาสูง → ต่ำ', 'Price: High → Low'],
  ['ชื่อ A-Z', 'Name A-Z'],
  ['ใหม่ล่าสุด', 'Newest'],
  ['กลับหน้าหลัก', 'Back to home'],
  ['หมวดหมู่เกม', 'Game Categories'],
  ['เลือกหมวดหมู่ที่คุณสนใจ', 'Choose a category you are interested in'],
  ['เกม', 'games'],
  ['เกมในหมวดหมู่นี้', ' games in this category'],
  ['ยังไม่มีเกมในหมวดหมู่นี้', 'No games in this category yet'],
  ['ดูเพิ่ม', 'View details'],
  ['ไอดีเกมออนไลน์ทั้งหมด', 'All Game IDs'],
  ['เลือกซื้อเกมที่คุณชอบ มีให้เลือก ', 'Choose your favorite games. '],
  ['ทุกแพลตฟอร์ม', 'All platforms'],
  ['เรียงตามค่าเริ่มต้น', 'Sort by default'],
  ['ชื่อ: A → Z', 'Name: A → Z'],
  ['ไม่พบเกมที่ค้นหา', 'No games found'],
  ['ล้างการค้นหา', 'Clear search'],
  ['สุ่มของรางวัล', 'Random prizes'],
  ['เติมเงินเข้าระบบ', 'Top up wallet'],
  ['ไอดีเกมออนไลน์', 'Game IDs'],
  ['คลิกเพื่อสุ่ม', 'Click to draw'],
  ['ลุ้นไอดี', 'Win game IDs'],
  ['เทพมากมาย', 'Amazing game accounts'],
  ['แหล่งรวมรหัสเกมราคาถูก บริการเติมเกม 24 ชม. ปลอดภัย 100%', 'Affordable game keys and 24/7 top-up service. 100% secure.'],
  ['ประวัติการสั่งซื้อ', 'Order history'],
  ['ประวัติการสั่งซื้อ & คลังของฉัน', 'Order history & My inventory'],
  ['คลังของฉัน', 'My inventory'],
  ['โปรไฟล์', 'Profile'],
  ['การแจ้งเตือน', 'Notifications'],
  ['บริการ 24 ชั่วโมง', '24/hr Services'],
  ['ติดต่อเรา | Facebook Fanpage', 'Contact us | Facebook Fanpage'],
  ['กำลังโหลด...', 'Loading...'],
  ['กำลังโหลดข้อมูล...', 'Loading data...'],
  ['ยังไม่มีประวัติการซื้อ (ไปช้อปก่อนสิ!)', 'No purchase history yet. Start shopping!'],
  ['วันที่', 'Date'],
  ['รายการ / รายละเอียด', 'Item / Details'],
  ['คัดลอก', 'Copy'],
  ['ยอดซื้อรวม', 'Total spent'],
  ['จำนวนคำสั่งซื้อ', 'Orders'],
  ['คำสั่งซื้อที่สำเร็จ', 'Completed orders'],
  ['ดูประวัติการซื้อเกมทั้งหมดของคุณ', 'View all of your game purchase history'],
  ['สถานะทั้งหมด', 'All statuses'],
  ['สำเร็จ', 'Completed'],
  ['รอดำเนินการ', 'Pending'],
  ['ยกเลิก', 'Cancelled'],
  ['แพลตฟอร์มทั้งหมด', 'All platforms'],
  ['ไม่พบประวัติการสั่งซื้อ', 'No order history found'],
  ['ไม่ระบุชื่อเกม', 'Unnamed game'],
  ['รีวิว', 'Reviews'],
  ['เขียนรีวิว', 'Write a review'],
  ['คะแนน', 'Rating'],
  ['ความคิดเห็น', 'Comment'],
  ['เขียนรีวิวของคุณ...', 'Write your review...'],
  ['บันทึกการแก้ไข', 'Save changes'],
  ['ส่งรีวิว', 'Submit review'],
  ['เก่าที่สุด', 'Oldest'],
  ['คะแนนสูงสุด', 'Highest rated'],
  ['คะแนนต่ำสุด', 'Lowest rated'],
  ['มีประโยชน์มากที่สุด', 'Most helpful'],
  ['ยังไม่มีรีวิว', 'No reviews yet'],
  ['เป็นคนแรกที่รีวิวเกมนี้!', 'Be the first to review this game!'],
  ['ผู้ใช้ไม่ระบุชื่อ', 'Anonymous user'],
  ['ซื้อแล้ว', 'Verified purchase'],
  ['มีประโยชน์', 'Helpful'],
  ['ยืนยันการลบรีวิวนี้?', 'Delete this review?'],
  ['แก้ไขรีวิวสำเร็จ!', 'Review updated successfully!'],
  ['เพิ่มรีวิวสำเร็จ!', 'Review added successfully!'],
  ['กรุณากรอกคะแนนและความคิดเห็น', 'Please provide a rating and comment'],
  ['ยอดเงินคงเหลือ (Points)', 'Wallet balance'],
  ['กลับหน้าแรก', 'Back to home'],
  ['เลือกจำนวนเงินที่ต้องการเติม', 'Choose an amount to top up'],
  ['เติมเงินทันที', 'Top up now'],
  ['ยืนยันการเติมเงิน ', 'Confirm top-up of '],
  [' บาท?', ' baht?'],
  ['เติมเงิน ', 'Top-up '],
  [' บาทสำเร็จ! 🎉', 'Top-up successful! 🎉'],
  ['เติมเงินล้มเหลว', 'Top-up failed'],
];

const replaceAttributes = (element) => {
  ['placeholder', 'title', 'aria-label', 'alt'].forEach((attribute) => {
    const value = element.getAttribute?.(attribute);
    if (!value) return;
    let next = value;
    replacements.forEach(([from, to]) => { next = next.split(from).join(to); });
    if (next !== value) element.setAttribute(attribute, next);
  });
};

export default function BrandingGuard() {
  useEffect(() => {
    const replaceText = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        let value = node.nodeValue;
        replacements.forEach(([from, to]) => { value = value.split(from).join(to); });
        if (value !== node.nodeValue) node.nodeValue = value;
      });
      document.querySelectorAll('input, textarea, select, button, img, [aria-label], [title]').forEach(replaceAttributes);
    };

    replaceText();
    const observer = new MutationObserver(replaceText);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'] });
    return () => observer.disconnect();
  }, []);

  return null;
}
