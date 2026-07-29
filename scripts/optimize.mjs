import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public/images');
const srcDir = path.join(process.cwd(), 'src');

async function processDirectory(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const webpPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        
        console.log(`Optimizing: ${file.name} -> ${path.basename(webpPath)}`);
        
        try {
          // Convert to WebP
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(webpPath);
            
          // Delete old image
          await fs.unlink(fullPath);
          console.log(`Deleted old file: ${file.name}`);
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
        }
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  await processDirectory(imagesDir);
  console.log('Done!');
}

main();
