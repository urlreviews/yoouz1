const fs = require('fs');
let content = fs.readFileSync('src/components/CopoCreateModal.tsx', 'utf8');
content = content.replace(
  "const [step, setStep] = useState<1 | 2>(1);",
  "const [step, setStep] = useState<1 | 2>(preselectedPlace ? 2 : 1);"
);
fs.writeFileSync('src/components/CopoCreateModal.tsx', content);
