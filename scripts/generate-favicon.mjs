import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean, high-impact vector icon for Pics Editz:
// Features a rounded squircle badge, bold modern 'P' with integrated photo aperture/frame,
// and a vibrant magic-edit sparkle at top right.
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <defs>
    <!-- Background Gradient: Indigo to Violet -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4338CA" />
      <stop offset="50%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>

    <!-- Sparkle & Accent Gradient: Cyan to Soft White -->
    <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>

    <!-- Subtle Drop Shadow -->
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Squircle Base with smooth rounded corners -->
  <rect x="4" y="4" width="88" height="88" rx="22" ry="22" fill="url(#bgGrad)" />

  <!-- Subtle inner border highlight -->
  <rect x="4" y="4" width="88" height="88" rx="22" ry="22" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />

  <!-- Geometric Modern 'P' monogram representing 'Pics Editz' -->
  <!-- Stem of the P -->
  <rect x="22" y="24" width="11" height="48" rx="5.5" fill="#FFFFFF" filter="url(#subtleGlow)" />

  <!-- Upper Loop of the P with integrated Camera Aperture / Photo Frame -->
  <path d="M 27 24 L 46 24 C 57 24 64 30.5 64 40.5 C 64 50.5 57 57 46 57 L 27 57 Z" 
        fill="none" 
        stroke="#FFFFFF" 
        stroke-width="10.5" 
        stroke-linecap="round" 
        stroke-linejoin="round" />

  <!-- Inner Cyan Aperture / Lens dot inside loop -->
  <circle cx="45" cy="40.5" r="5" fill="#38BDF8" />

  <!-- Photo Crop / Frame Accent in bottom corner (Subtle subtle horizontal accent) -->
  <path d="M 40 72 L 58 72 C 61 72 63 70 63 67 L 63 61" 
        fill="none" 
        stroke="#A5B4FC" 
        stroke-width="3" 
        stroke-linecap="round" />

  <!-- Magic Sparkle (Editz symbol) at top-right -->
  <!-- 4-pointed star -->
  <path d="M 72 16 Q 72 24 80 24 Q 72 24 72 32 Q 72 24 64 24 Q 72 24 72 16 Z" 
        fill="url(#sparkleGrad)" 
        filter="url(#subtleGlow)" />
  <circle cx="72" cy="24" r="1.5" fill="#FFFFFF" />
</svg>`;

async function generateFavicons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save favicon.svg for modern vector support
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Saved public/favicon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Save 96x96 favicon.png (Google recommended size & user requirement)
  await sharp(svgBuffer)
    .resize(96, 96)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Saved public/favicon.png (96x96)');

  // 3. Save 48x48 favicon-48x48.png
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon-48x48.png'));
  console.log('Saved public/favicon-48x48.png (48x48)');

  // 4. Save 32x32 favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Saved public/favicon-32x32.png (32x32)');

  // 5. Save 180x180 apple-touch-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved public/apple-touch-icon.png (180x180)');
}

generateFavicons().catch(console.error);
