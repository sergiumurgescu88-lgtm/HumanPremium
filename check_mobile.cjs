const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

const issues = [];

lines.forEach((line, index) => {
  if (line.includes('w-[') && !line.includes('md:w-') && !line.includes('sm:w-')) {
    issues.push(`Line ${index + 1}: Fixed width without responsive prefix: ${line.trim()}`);
  }
  if (line.includes('h-screen') && !line.includes('min-h-screen')) {
    issues.push(`Line ${index + 1}: h-screen might cause issues on mobile: ${line.trim()}`);
  }
});

console.log(issues.join('\n'));
