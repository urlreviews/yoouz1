const fs = require('fs');
const content = fs.readFileSync('src/components/CopoCreateModal.tsx', 'utf8');
const patched = content.replace(
  /useEffect\(\(\) => \{\n    if \(preselectedPlace\) \{\n      setSelectedPlace\(preselectedPlace\);\n    \}\n  \}, \[preselectedPlace\]\);/,
  `useEffect(() => {
    if (preselectedPlace) {
      setSelectedPlace(preselectedPlace);
      if (isOpen) setStep(2);
    }
  }, [preselectedPlace, isOpen]);`
);
fs.writeFileSync('src/components/CopoCreateModal.tsx', patched);
