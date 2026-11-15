import type { BirthdayWish } from '../types/wish';
import { MONTHS } from '../data/fixedWish';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  let linesDrawn = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      linesDrawn += 1;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
  }
}

export async function downloadBirthdayShareCard(wish: BirthdayWish) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Deep plum celebration backdrop
  const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
  grad.addColorStop(0, '#1B1124');
  grad.addColorStop(0.55, '#2E183A');
  grad.addColorStop(1, '#1A0F22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Subtle decorative border
  ctx.strokeStyle = 'rgba(246, 193, 119, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, 984, 1254);

  // Confetti dots
  const confettiColors = ['#F6C177', '#EB6F92', '#9CCFD8', '#FFFBF4', '#EA9A97'];
  for (let i = 0; i < 65; i++) {
    const x = 90 + ((i * 197) % 900);
    const y = 90 + ((i * 283) % 1170);
    const r = 4 + (i % 6);
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Kicker
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F6C177';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  const monthName = MONTHS[(wish.birthMonth - 1 + 12) % 12] || 'November';
  ctx.fillText(`${monthName} ${wish.birthDay}  ·  Birthday Celebration`, 540, 180);

  // Main headline
  ctx.fillStyle = '#FFFBF4';
  ctx.font = '700 84px Georgia, serif';
  ctx.fillText('Happy Birthday,', 540, 310);

  ctx.fillStyle = '#F6C177';
  ctx.font = 'italic 700 98px Georgia, serif';
  ctx.fillText(wish.recipientName || 'Friend', 540, 420);

  if (wish.turningAge.trim()) {
    ctx.fillStyle = 'rgba(255, 251, 244, 0.8)';
    ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Celebrating ${wish.turningAge} unforgettable years`, 540, 490);
  }

  // Warm stationery card in the middle
  ctx.fillStyle = '#FFFBF4';
  ctx.beginPath();
  ctx.roundRect(120, 560, 840, 470, 28);
  ctx.fill();

  ctx.fillStyle = '#573B4E';
  ctx.textAlign = 'left';
  ctx.font = '600 30px Georgia, serif';
  ctx.fillText(`Dear ${wish.recipientName || 'Friend'},`, 180, 645);

  ctx.fillStyle = '#2B1F29';
  ctx.font = '400 30px "Plus Jakarta Sans", sans-serif';
  wrapText(
    ctx,
    wish.letter || 'Wishing you a day filled with love, laughter, and sweet surprises.',
    180,
    720,
    720,
    46,
    5
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#B84A62';
  ctx.font = 'italic 600 30px Georgia, serif';
  ctx.fillText(`With love, ${wish.senderName || 'Your Friends'}`, 900, 975);

  // Footer prompt
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 251, 244, 0.78)';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Open the interactive card for photos, voice notes & cake magic', 540, 1140);

  ctx.fillStyle = '#F6C177';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Keepsake Birthday Studio', 540, 1210);

  const link = document.createElement('a');
  const safeName = (wish.recipientName || 'birthday').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `happy-birthday-${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
