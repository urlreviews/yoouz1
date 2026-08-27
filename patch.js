const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const patched = content.replace(
  /\/\/ setIsSearchModalOpen\(false\); \/\/ Removed to prevent closing modal/g,
  "setIsSearchModalOpen(false);"
);
fs.writeFileSync('src/App.tsx', patched);
