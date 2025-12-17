const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'public', 'logo.png');
const tempPath = path.join(__dirname, 'public', 'logo-optimized.png');

console.log('Optimizando logo.png...');

sharp(logoPath)
  .resize(800, null, { withoutEnlargement: true })
  .png({ quality: 80, compressionLevel: 9 })
  .toFile(tempPath)
  .then(() => {
    const originalSize = fs.statSync(logoPath).size;
    const optimizedSize = fs.statSync(tempPath).size;
    
    console.log(`Original: ${(originalSize/1024).toFixed(2)}KB`);
    console.log(`Optimizado: ${(optimizedSize/1024).toFixed(2)}KB`);
    console.log(`Ahorro: ${((1-optimizedSize/originalSize)*100).toFixed(1)}%`);
    
    // Reemplazar el original
    fs.unlinkSync(logoPath);
    fs.renameSync(tempPath, logoPath);
    
    console.log('✅ Logo optimizado exitosamente!');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
