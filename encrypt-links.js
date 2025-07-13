const CryptoJS = require('crypto-js');
  const fs = require('fs');

  const password = 'adgjmptw'; // Match this with your password
const linksData = {
    links: [
        { title: 'My Website', url: 'https://nazmul-haque-nihal.github.io/', description: 'My portfolio' },
        { title: 'Favorite Blog', url: 'https://example.com/blog', description: 'A great read' },
        { title: 'Secure Note Without Vercel', url: 'https://noteapp-723bc.web.app', description: 'This is a private note: Keep it secret!' },
        { title: 'Secure Note', url: 'https://sample-project-2vloudeoh-nazs-projects-2ad5d7f7.vercel.app/', description: 'A secure project note' },
        { title: 'SPD_bot', url: 'https://nazmul-ai-chatbot.onrender.com', description: 'AI chatbot interface' },
        { title: 'SPD_saveFile', url: 'https://anonymous-file-saver-451jevpdh-nazs-projects-2ad5d7f7.vercel.app/', description: 'Send file securely' },
        { title: 'Example Site', url: 'https://www.protectedtext.com/19501630331399581512673496', description: 'Secure Notes for Password' } // New link
    ]
};

  function encryptLinks(password, data) {
      try {
          const jsonString = JSON.stringify(data);
          console.log('✓ JSON string created');

          // Generate random salt and IV
          const salt = CryptoJS.lib.WordArray.random(16); // 128 bits
          const iv = CryptoJS.lib.WordArray.random(16);   // 128 bits
          console.log('✓ Salt and IV generated');

          // Derive key using PBKDF2
          const key = CryptoJS.PBKDF2(password, salt, {
              keySize: 256/32,
              iterations: 100000,
              hasher: CryptoJS.algo.SHA256
          });
          console.log('✓ Key derived');

          // Encrypt the data
          const encrypted = CryptoJS.AES.encrypt(
              jsonString,
              key,
              { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
          );
          const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
          console.log('✓ Data encrypted');

          // Generate HMAC for integrity
          const hmac = CryptoJS.HmacSHA256(jsonString, key).toString(CryptoJS.enc.Hex);
          console.log('✓ HMAC generated');

          // Combine salt, IV, ciphertext, and HMAC
          const encryptedData = `${salt.toString(CryptoJS.enc.Hex)}:${iv.toString(CryptoJS.enc.Hex)}:${ciphertext}:${hmac}`;
          console.log('✓ Data combined');

          fs.writeFileSync('links.json.encrypted', encryptedData);
          console.log('✓ Encrypted file saved as links.json.encrypted');
      } catch (error) {
          console.error('✖ Error:', error.message);
      }
  }

  encryptLinks(password, linksData);