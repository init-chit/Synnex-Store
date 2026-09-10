// Image placeholder utilities
// Use SVG data URI instead of external placeholder service

export const getPlaceholderImage = (width = 150, height = 150, text = 'No Image') => {
  // SVG placeholder as data URI
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const gamePlaceholder = getPlaceholderImage(400, 300, 'Game Image');
export const smallPlaceholder = getPlaceholderImage(150, 150, 'No Image');
export const largePlaceholder = getPlaceholderImage(800, 600, 'Game Image');

