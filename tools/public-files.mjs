// The same explicit list drives local preview and Cloudflare asset packaging.
export const publicFiles = [
  'index.html', 'style.css', 'fonts.css', 'photo-credits.html', 'photo-credits.css', 'security.html',
  'migration-replay.html', 'migration-replay.css', 'migration-replay.js',
  'script.js', 'theme.js', 'experience.js', 'experience-geometry.js', 'experience.css',
  'favicon.svg', 'og-image.png', 'robots.txt', 'sitemap.xml', 'llms.txt', '.well-known/security.txt',
  'assets/atkinson-hyperlegible-next-license.txt',
  ...[400, 600].flatMap(weight => ['latin', 'latin-ext'].map(subset => `assets/atkinsonhyperlegiblenext-${weight}-${subset}.woff2`)),
  'assets/viru-bog.jpg', 'assets/kasmu-coast.jpg', 'assets/barlow-semi-condensed-license.txt',
  ...[700, 900].flatMap(weight => ['latin', 'latin-ext', 'vietnamese'].map(subset => `assets/barlow-semi-condensed-${weight}-${subset}.woff2`)),
];
const allowedFiles = new Set(publicFiles);

export function publicFileForPath(pathname) {
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (allowedFiles.has(file)) return file;
  const htmlFile = `${file}.html`;
  return allowedFiles.has(htmlFile) ? htmlFile : undefined;
}

export function assetIgnore() {
  // Negated paths require their parent directories to be unignored as well.
  return '# Default deny: only reviewed public assets are uploaded.\n*\n!assets/\n!.well-known/\n' +
    [...publicFiles, '_headers'].map(path => '!' + path).join('\n') + '\n';
}
