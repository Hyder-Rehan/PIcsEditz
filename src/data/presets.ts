import { DimensionPreset, PassportPreset, TemplateItem } from '../types';

export const DIMENSION_PRESETS: DimensionPreset[] = [
  { name: 'Instagram Square', category: 'Social Media', width: 1080, height: 1080, description: '1:1 feed post' },
  { name: 'Instagram Portrait', category: 'Social Media', width: 1080, height: 1350, description: '4:5 vertical post' },
  { name: 'Instagram / TikTok Story', category: 'Social Media', width: 1080, height: 1920, description: '9:16 full vertical' },
  { name: 'YouTube Video Thumbnail', category: 'Video', width: 1280, height: 720, description: '16:9 standard thumbnail' },
  { name: 'YouTube Channel Banner', category: 'Video', width: 2560, height: 1440, description: '16:9 widescreen header' },
  { name: 'X / Twitter Post', category: 'Social Media', width: 1200, height: 675, description: '16:9 landscape image' },
  { name: 'X / Twitter Header', category: 'Social Media', width: 1500, height: 500, description: '3:1 panoramic header' },
  { name: 'Facebook Post', category: 'Social Media', width: 1200, height: 630, description: '1.91:1 feed share' },
  { name: 'Facebook Cover Photo', category: 'Social Media', width: 820, height: 312, description: 'Profile banner' },
  { name: 'LinkedIn Banner', category: 'Professional', width: 1584, height: 396, description: 'Company / Personal banner' },
  { name: 'LinkedIn Post', category: 'Professional', width: 1200, height: 627, description: 'Feed article share' },
  { name: 'Website Hero Banner', category: 'Web', width: 1920, height: 1080, description: 'Full HD desktop banner' },
  { name: 'Blog Featured Image', category: 'Web', width: 1200, height: 630, description: 'Standard editorial thumbnail' },
  { name: 'E-Commerce Square', category: 'E-Commerce', width: 1200, height: 1200, description: 'High-res product showcase' },
  { name: 'Email Newsletter Header', category: 'Marketing', width: 600, height: 300, description: 'Standard 2:1 header' },
  { name: 'App Icon / Favicon Large', category: 'Icons', width: 512, height: 512, description: 'PWA / Store standard' },
  { name: 'Favicon 32x32', category: 'Icons', width: 32, height: 32, description: 'Standard browser tab icon' },
];

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    country: 'United States',
    name: 'US Passport & Visa (2x2")',
    widthMm: 51,
    heightMm: 51,
    widthInches: 2,
    heightInches: 2,
    dpi: 300,
    bgColor: '#ffffff',
    notes: 'Official US Dept of State standard: 2x2 in (600x600 px @ 300 DPI). Head size must be 1 to 1 3/8 inches from chin to top of head.'
  },
  {
    country: 'United Kingdom',
    name: 'UK Passport (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthInches: 1.38,
    heightInches: 1.77,
    dpi: 300,
    bgColor: '#f1f5f9', // light grey / cream
    notes: 'HM Passport Office standard: 35mm wide by 45mm high. Plain light grey or cream background required.'
  },
  {
    country: 'Schengen / European Union',
    name: 'Schengen Visa & EU ID (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthInches: 1.38,
    heightInches: 1.77,
    dpi: 300,
    bgColor: '#e2e8f0', // light grey or light blue
    notes: 'Standard ICAO biometric standard 35x45mm. Face height between 32mm and 36mm. Light grey or light blue background.'
  },
  {
    country: 'India',
    name: 'India Passport (35x45mm / 2x2")',
    widthMm: 35,
    heightMm: 45,
    widthInches: 1.38,
    heightInches: 1.77,
    dpi: 300,
    bgColor: '#ffffff',
    notes: 'Standard Passport Seva 35x45mm (or 2x2" for OCI / Indian Visa). Clear white background.'
  },
  {
    country: 'Canada',
    name: 'Canada Passport (50x70mm)',
    widthMm: 50,
    heightMm: 70,
    widthInches: 1.97,
    heightInches: 2.76,
    dpi: 300,
    bgColor: '#ffffff',
    notes: 'Government of Canada: 50 mm wide by 70 mm high. Face between 31 mm and 36 mm. Plain white or light background.'
  },
  {
    country: 'Australia',
    name: 'Australia Passport (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthInches: 1.38,
    heightInches: 1.77,
    dpi: 300,
    bgColor: '#f8fafc',
    notes: 'Australian Passport Office: 35mm to 40mm wide and 45mm to 50mm high. Plain light grey or white.'
  },
  {
    country: 'China',
    name: 'China Passport & Visa (33x48mm)',
    widthMm: 33,
    heightMm: 48,
    widthInches: 1.3,
    heightInches: 1.89,
    dpi: 300,
    bgColor: '#ffffff',
    notes: 'Standard Chinese Visa/Passport: 33mm by 48mm. White background without borders.'
  },
];

export const SAMPLE_ASSETS = {
  portrait: '/src/assets/images/sample_portrait_photo_1792506663087.jpg',
  product: '/src/assets/images/sample_product_photo_1792506663638.jpg',
  landscape: '/src/assets/images/sample_landscape_photo_1792506666088.jpg',
  banner: '/src/assets/images/sample_banner_scene_1792506665208.jpg'
};

export const TEMPLATES_LIBRARY: TemplateItem[] = [
  {
    id: 'tpl-passport-us',
    title: 'US Passport & Visa (2x2")',
    category: 'passport',
    description: 'Biometric 300 DPI layout with face positioning guides and printable 4x6" multi-copy sheet.',
    recommendedTool: 'passport',
    aspectRatio: '1:1',
    presetDimensions: { width: 600, height: 600 },
    sampleImageUrl: SAMPLE_ASSETS.portrait
  },
  {
    id: 'tpl-passport-eu',
    title: 'UK / Schengen Visa (35x45mm)',
    category: 'passport',
    description: 'Standard European biometric portrait with optional light-blue or neutral gray backdrop.',
    recommendedTool: 'passport',
    aspectRatio: '35:45',
    presetDimensions: { width: 413, height: 531 },
    sampleImageUrl: SAMPLE_ASSETS.portrait
  },
  {
    id: 'tpl-ecommerce-hero',
    title: 'Clean E-Commerce White Background',
    category: 'ecommerce',
    description: 'Remove cluttered backgrounds and replace with crisp Amazon/Shopify commercial studio white.',
    recommendedTool: 'background',
    aspectRatio: '1:1',
    presetDimensions: { width: 1200, height: 1200 },
    sampleImageUrl: SAMPLE_ASSETS.product
  },
  {
    id: 'tpl-youtube-thumb',
    title: 'High-CTR YouTube Thumbnail',
    category: 'youtube',
    description: '1280x720 16:9 canvas with vibrant contrast, bold stroke typography, and high saturation.',
    recommendedTool: 'editor',
    aspectRatio: '16:9',
    presetDimensions: { width: 1280, height: 720 },
    sampleImageUrl: SAMPLE_ASSETS.banner
  },
  {
    id: 'tpl-social-landscape',
    title: 'Ultra-Fast WebP Compressor',
    category: 'social',
    description: 'Shrink scenic or high-resolution photography by up to 85% with zero visible artifacting.',
    recommendedTool: 'compress',
    aspectRatio: '16:9',
    sampleImageUrl: SAMPLE_ASSETS.landscape
  },
  {
    id: 'tpl-profile-pro',
    title: 'Executive Avatar & Profile Maker',
    category: 'profile',
    description: 'Circular crop preview, subtle studio gradient backdrop, and contrast polish.',
    recommendedTool: 'background',
    aspectRatio: '1:1',
    presetDimensions: { width: 800, height: 800 },
    sampleImageUrl: SAMPLE_ASSETS.portrait
  }
];

export const FAQS = [
  {
    q: 'Are my images uploaded to any remote server or stored online?',
    a: 'No. OptiPixel is built from the ground up on modern HTML5 Canvas and Web APIs. All processing (compression, resizing, background removal, filtering, and PDF generation) executes strictly inside your browser. Your images never leave your computer or phone, guaranteeing 100% privacy and security.'
  },
  {
    q: 'How does client-side image compression work without losing quality?',
    a: 'OptiPixel uses modern WebP and JPEG quantization algorithms directly in the browser runtime. By optimizing Huffman encoding and discarding imperceptible high-frequency color metadata, file size can be reduced by 50% to 85% while preserving sharp lines and vibrant tones.'
  },
  {
    q: 'Can I create printable passport photo sheets for home or pharmacy printing?',
    a: 'Yes! The Passport Photo Maker features a "Printable 4x6\\" Sheet" mode. It arranges 4, 6, or 8 compliant passport photos with precise dashed cutting guidelines onto a standard 4x6 inch (10x15cm) paper canvas at 300 DPI, ready to print at home, Walgreens, CVS, or any photo kiosk.'
  },
  {
    q: 'What image formats can I convert between?',
    a: 'You can convert between PNG, JPG/JPEG, WebP, AVIF (in supported browsers), BMP, and GIF. When converting transparent images (PNG or WebP) to JPG, you can choose a background fill color since JPG does not support alpha transparency.'
  },
  {
    q: 'Is there a limit on how many images I can process or file size?',
    a: 'Because processing happens on your local device CPU/GPU, there is no artificial cloud paywall or daily credit limit! You can process batch photos as long as your device has sufficient RAM to load them in memory.'
  }
];
