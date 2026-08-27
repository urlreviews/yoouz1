const fs = require('fs');
let content = fs.readFileSync('src/components/CopoCreateModal.tsx', 'utf8');

content = content.replace(
  /className="w-14 h-14 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex items-center justify-center p-0.5 shrink-0"/g,
  'className="w-14 h-14 rounded-xl border border-zinc-800 bg-white overflow-hidden flex items-center justify-center p-1 shrink-0"'
).replace(
  /fallbackTextClassName="font-bold text-xl text-white"/g,
  'fallbackTextClassName="font-bold text-xl text-zinc-900"'
);

content = content.replace(
  /className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-800 overflow-hidden flex items-center justify-center p-0.5 shrink-0"/g,
  'className="w-10 h-10 rounded-xl border border-zinc-800 bg-white overflow-hidden flex items-center justify-center p-1 shrink-0"'
).replace(
  /fallbackTextClassName="font-bold text-sm text-white"/g,
  'fallbackTextClassName="font-bold text-sm text-zinc-900"'
);

fs.writeFileSync('src/components/CopoCreateModal.tsx', content);
