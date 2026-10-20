export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
}

export const PAGE_SEO: Record<string, PageMetadata> = {
  '/': {
    title: 'OptiPixel – All-in-One Professional Image Toolkit',
    description: 'Compress, resize, convert, edit, remove backgrounds, and create passport photos and social media graphics in seconds directly in your browser.',
    canonicalPath: '/',
  },
  '/about': {
    title: 'About Us | OptiPixel – Fast, In-Browser Image Toolkit',
    description: 'Learn about OptiPixel’s mission: client-side image processing with zero cloud uploads, strong privacy, and versatile utility tools for creators.',
    canonicalPath: '/about',
  },
  '/contact': {
    title: 'Contact Us | OptiPixel Support & Inquiries',
    description: 'Get in touch with the OptiPixel team for technical support, bug reports, feature requests, or general inquiries.',
    canonicalPath: '/contact',
  },
  '/privacy': {
    title: 'Privacy Policy | OptiPixel In-Browser Image Suite',
    description: 'Detailed privacy policy explaining our 100% in-browser processing, zero server photo retention, Google AdSense cookies, and user rights.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms of Service | OptiPixel Image Toolkit',
    description: 'Terms of Service covering acceptable tool usage, complete user image ownership, technical limitations, and biometric guidelines.',
    canonicalPath: '/terms',
  },
  '/disclaimer': {
    title: 'Disclaimer | OptiPixel Image Toolkit & Passport Presets',
    description: 'Important legal disclaimer regarding image compression variance, biometric passport specifications, and third-party advertising.',
    canonicalPath: '/disclaimer',
  },
  '/faq': {
    title: 'Frequently Asked Questions (FAQ) | OptiPixel Help',
    description: 'Answers to frequently asked questions about file compression, format conversion, background removal, transparency, and data safety.',
    canonicalPath: '/faq',
  },
  '/how-to-use': {
    title: 'How to Use Our Tools – Complete Guide | OptiPixel',
    description: 'Step-by-step user tutorials for image compression, aspect-ratio resizing, format conversion, background editing, and passport photos.',
    canonicalPath: '/how-to-use',
  },
  '/report-issue': {
    title: 'Report a Problem & Help Center | OptiPixel',
    description: 'Troubleshoot browser issues, report bugs, or submit feedback to help improve the OptiPixel image processing suite.',
    canonicalPath: '/report-issue',
  },
};

export function updatePageSeo(path: string, customDomain = 'https://optipixel.app') {
  const meta = PAGE_SEO[path] || PAGE_SEO['/'];

  // Update title
  document.title = meta.title;

  // Update meta description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // Update canonical
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', `${customDomain}${meta.canonicalPath}`);

  // Update OpenGraph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.description);
}
