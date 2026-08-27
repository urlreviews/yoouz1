const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const startMarker = 'if (map.size === 0) {';
const endMarker = 'const merged = Array.from(map.values());';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
      // Try to mirror from real Firestore directly if adminDb is available
      if (adminDb) {
        try {
          const snap = await adminDb.collection("videoReviews").get();
          snap.forEach((doc: any) => {
            map.set(doc.id, { id: doc.id, ...doc.data() });
          });
        } catch (adminErr) {
          console.warn("Failed to load from adminDb:", adminErr);
        }
      }

      `;
      
  const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
  fs.writeFileSync('server.ts', newCode, 'utf8');
  console.log('Successfully patched server.ts');
} else {
  console.log('Could not find markers', startIndex, endIndex);
}
