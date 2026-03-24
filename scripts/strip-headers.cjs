const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/pages/**/*.astro');

let modifiedCount = 0;

files.forEach(file => {
  if (file === 'src/pages/index.astro') return;

  let content = fs.readFileSync(file, 'utf-8');
  
  // This regex carefully grabs ONLY the <div ...> ... <h1> ... </h1> ... <p ...>...</p> ... </div>
  // that typically appears immediately before the internal App component.
  // We make it robust enough by explicitly requiring <h1> and <p> inside a top-level child of ToolPageShell.
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
