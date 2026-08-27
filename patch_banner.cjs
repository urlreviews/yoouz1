const fs = require('fs');
let content = fs.readFileSync('src/components/CopoPlaceDrawer.tsx', 'utf8');

const oldBanner = `{hasAuthenticPhoto && !bannerError ? (
          <div className="absolute inset-0 w-full h-full bg-zinc-900 md:bg-zinc-100 relative overflow-hidden flex items-center justify-center group">
            {/* Foreground Banner Image - High quality object-cover */}
            <img
              src={allPhotos[0]}
              alt={formatBusinessName(place.name)}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/5 z-10" />
          </div>
        ) : (`;

const newBanner = `{hasAuthenticPhoto && !bannerError ? (
          <div className="absolute inset-0 w-full h-full bg-zinc-900 md:bg-zinc-100 relative overflow-hidden flex items-center justify-center group">
            {/* Blurred Background to fill the space without zooming the main image heavily */}
            <img
              src={allPhotos[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-125"
              referrerPolicy="no-referrer"
            />
            {/* Foreground Banner Image - Contained properly */}
            <img
              src={allPhotos[0]}
              alt={formatBusinessName(place.name)}
              className="relative z-10 w-full h-full object-contain p-0"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none" />
          </div>
        ) : (`;

content = content.replace(oldBanner, newBanner);

// Also fix the logo background
// Old: bg-zinc-900 md:bg-white
// New: bg-white
content = content.replace(
  /className="absolute -bottom-10 sm:-bottom-12 left-6 w-24 h-24 sm:w-32 sm:h-32 rounded-\[24px\] sm:rounded-\[28px\] border-\[4px\] sm:border-\[5px\] border-zinc-950 md:border-white bg-zinc-900 md:bg-white shadow-2xl flex items-center justify-center z-20 p-1 ring-1 ring-black\/10"/g,
  'className="absolute -bottom-10 sm:-bottom-12 left-6 w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] sm:rounded-[28px] border-[4px] sm:border-[5px] border-zinc-950 md:border-white bg-white shadow-2xl flex items-center justify-center z-20 p-2 ring-1 ring-black/10"'
);

fs.writeFileSync('src/components/CopoPlaceDrawer.tsx', content);
