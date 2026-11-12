// Генерация PNG-иконок из того же рисунка, что и icon.svg
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

function draw(size, maskable) {
  const c = createCanvas(size, size);
  const g = c.getContext('2d');
  const r = maskable ? 0 : size * 0.22;
  g.fillStyle = '#0f7a5c';
  g.beginPath();
  g.roundRect(0, 0, size, size, r);
  g.fill();
  const s = maskable ? 0.8 : 1;
  g.fillStyle = '#ffffff';
  g.font = `bold ${size * 0.58 * s}px Arial`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('ع', size / 2, size * 0.46);
  g.fillStyle = '#e0b24c';
  g.fillRect(size * (0.5 - 0.22 * s), size * (0.5 + 0.28 * s), size * 0.44 * s, size * 0.05 * s);
  return c.toBuffer('image/png');
}
writeFileSync('public/icon-192.png', draw(192));
writeFileSync('public/icon-512.png', draw(512));
writeFileSync('public/icon-maskable-512.png', draw(512, true));
writeFileSync('public/apple-touch-icon.png', draw(180, true));
console.log('ok');

// Android: mipmap-иконки (обычная, круглая, передний план адаптивной иконки)
import { mkdirSync } from 'node:fs';
const RES = 'android/app/src/main/res';
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
function fg(size) {
  // адаптивная иконка: 108dp, видимая зона ~66dp в центре
  const c = createCanvas(size, size);
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.font = `bold ${size * 0.36}px Arial`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('ع', size / 2, size * 0.47);
  g.fillStyle = '#e0b24c';
  g.fillRect(size * 0.37, size * 0.67, size * 0.26, size * 0.03);
  return c.toBuffer('image/png');
}
function round(size) {
  const c = createCanvas(size, size);
  const g = c.getContext('2d');
  g.beginPath();
  g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  g.clip();
  g.drawImage(sq(size), 0, 0);
  return c.toBuffer('image/png');
}
function sq(size) {
  const c = createCanvas(size, size);
  const g = c.getContext('2d');
  g.fillStyle = '#0f7a5c';
  g.fillRect(0, 0, size, size);
  g.fillStyle = '#ffffff';
  g.font = `bold ${size * 0.5}px Arial`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('ع', size / 2, size * 0.46);
  g.fillStyle = '#e0b24c';
  g.fillRect(size * 0.32, size * 0.74, size * 0.36, size * 0.04);
  return c;
}
for (const [d, k] of Object.entries(DENS)) {
  const dir = `${RES}/mipmap-${d}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/ic_launcher.png`, sq(48 * k).toBuffer('image/png'));
  writeFileSync(`${dir}/ic_launcher_round.png`, round(48 * k));
  writeFileSync(`${dir}/ic_launcher_foreground.png`, fg(108 * k));
}
writeFileSync(`${RES}/values/ic_launcher_background.xml`, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0F7A5C</color>\n</resources>\n');
console.log('android ok');
