const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const outDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Gradient glow
  const glow = ctx.createRadialGradient(size * 0.3, size * 0.3, 0, size * 0.5, size * 0.5, size * 0.6);
  glow.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
  glow.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Moon crescent
  const cx = size * 0.5;
  const cy = size * 0.45;
  const r = size * 0.28;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();

  // Cut out crescent
  ctx.beginPath();
  ctx.arc(cx + r * 0.5, cy - r * 0.3, r * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // Stars
  const starPositions = [
    [0.2, 0.25, 0.04],
    [0.75, 0.2, 0.03],
    [0.15, 0.7, 0.025],
    [0.8, 0.65, 0.035],
  ];

  starPositions.forEach(([sx, sy, sr]) => {
    ctx.beginPath();
    ctx.arc(size * sx, size * sy, size * sr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
    ctx.fill();
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, `icon${size}.png`), buffer);
  console.log(`Generated icon${size}.png`);
});

console.log('All icons generated!');
