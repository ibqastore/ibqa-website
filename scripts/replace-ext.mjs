import fs from 'fs/promises';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

async function processDirectory(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (ext === '.ts' || ext === '.tsx' || ext === '.css') {
        let content = await fs.readFile(fullPath, 'utf8');
        
        const originalContent = content;
        
        // Regex to replace .PNG, .png, .jpeg, .jpg with .webp
        content = content.replace(/\.png/gi, '.webp');
        content = content.replace(/\.jpeg/gi, '.webp');
        content = content.replace(/\.jpg/gi, '.webp');
        
        if (content !== originalContent) {
          await fs.writeFile(fullPath, content, 'utf8');
          console.log(`Updated extensions in: ${fullPath}`);
        }
      }
    }
  }
}

async function main() {
  console.log('Replacing extensions in src files...');
  await processDirectory(srcDir);
  console.log('Done!');
}

main();
