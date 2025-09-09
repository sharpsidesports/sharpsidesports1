const fs = require('fs');

// Read the current file
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the problematic line by removing the extra characters
content = content.replace(
  /\/>                <Route path="\/cfb\/sp-plus"/,
  '/>\n                <Route path="/cfb/sp-plus"'
);

// Write the fixed content back
fs.writeFileSync('src/App.tsx', content);

console.log('Fixed App.tsx');
