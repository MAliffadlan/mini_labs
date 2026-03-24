import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.astro')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/pages');
let modifiedCount = 0;

files.forEach(file => {
  if (file.endsWith('index.astro')) return;

  let content = fs.readFileSync(file, 'utf-8');
  
  const regex = /<div[^>]*>\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>[\s\S]*?<\/p>\s*<\/div>/;

  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log(`✅ Stripped header from ${file}`);
    modifiedCount++;
  } else {
    // maybe it has a different structure?
    const fallbackRegex = /<div[^>]*>\s*<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<\/div>/;
    if (fallbackRegex.test(content) && content.includes('ToolPageShell')) {
        content = content.replace(fallbackRegex, '');
        fs.writeFileSync(file, content);
        console.log(`✅ Stripped fallback header from ${file}`);
        modifiedCount++;
    } else {
        console.log(`⚠️ No header matched in ${file}`);
    }
  }
});

console.log(`\nDone! Cleaned headers from ${modifiedCount} files.`);
