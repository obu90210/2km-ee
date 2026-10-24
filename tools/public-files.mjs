// The same explicit list drives local preview and Cloudflare asset packaging.
export const publicFiles = [
  'index.html', 'style.css', 'fonts.css', 'photo-credits.html', 'photo-credits.css', 'security.html',
  'script.js', 'theme.js', 'experience.js', 'experience-geometry.js', 'experience.css',
  'favicon.svg', 'og-image.png', 'robots.txt', 'sitemap.xml', 'llms.txt', '.well-known/security.txt',
  'assets/viru-bog.jpg', 'assets/kasmu-coast.jpg', 'assets/barlow-semi-condensed-license.txt',
  ...[400, 700, 900].flatMap(weight => ['latin', 'latin-ext', 'vietnamese'].map(subset => `assets/barlow-semi-condensed-${weight}-${subset}.woff2`)),
];
export function assetIgnore() {
  // Negated paths require their parent directories to be unignored as well.
  return '# Default deny: only reviewed public assets are uploaded.\n*\n!assets/\n!.well-known/\n' +
    [...publicFiles, '_headers'].map(path => '!' + path).join('\n') + '\n';
}
