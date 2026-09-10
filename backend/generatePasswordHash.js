const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n--- Test verification ---');
    
    // Test verification
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification test:', isValid ? '✅ PASS' : '❌ FAIL');
    
    // Test with old hash
    const oldHash = '$2a$10$rQnM1k8yVPZXKODvUKQXXeJXYM3zl1UQ0jFzPqF8W5iJX7vKxVbPa';
    const isValidOld = await bcrypt.compare(password, oldHash);
    console.log('Old hash verification:', isValidOld ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n--- SQL Commands ---');
    console.log('-- Update admin@nickykey.com');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@nickykey.com';`);
    console.log('\n-- Update adnicky@admin.com');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'adnicky@admin.com';`);
}

generateHash();


