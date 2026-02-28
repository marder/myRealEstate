const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function optimizeImages() {
  console.log('--- ROZPOCZYNAM OPTYMALIZACJĘ OBRAZÓW ---');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('Folder uploads nie istnieje!');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  let savedSpace = 0;

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const ext = path.extname(file).toLowerCase();

    // Optymalizujemy tylko obrazy
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      try {
        const stats = fs.statSync(filePath);
        const oldSize = stats.size;

        const buffer = fs.readFileSync(filePath);
        const tempPath = filePath + '_temp';

        // Optymalizacja przy zachowaniu formatu
        if (ext === '.png') {
          await sharp(buffer).png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
        } else {
          await sharp(buffer).jpeg({ quality: 75, progressive: true, mozjpeg: true }).toFile(tempPath);
        }

        const newStats = fs.statSync(tempPath);
        const newSize = newStats.size;

        if (newSize < oldSize) {
          fs.renameSync(tempPath, filePath);
          const saved = ((oldSize - newSize) / 1024 / 1024).toFixed(2);
          savedSpace += (oldSize - newSize);
          console.log(`✅ Zoptymalizowano: ${file} (Zaoszczędzono: ${saved} MB)`);
        } else {
          fs.unlinkSync(tempPath);
          console.log(`ℹ️ Pominięto: ${file} (Jest już zoptymalizowany)`);
        }
      } catch (err) {
        console.error(`❌ Błąd przy ${file}:`, err.message);
      }
    }
  }

  console.log(`--- KONIEC ---`);
  console.log(`Łącznie zaoszczędzono: ${(savedSpace / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
