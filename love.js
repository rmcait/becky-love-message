#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';

const pink = chalk.hex('#FF69B4');
const rose = chalk.hex('#FF1493');
const soft = chalk.hex('#FFB6C1');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function center(text, width = 60) {
  const visible = text.replace(/\x1B\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - visible.length) / 2));
  return ' '.repeat(pad) + text;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
async function typeLine(styleFn, text, charDelay = 40) {
  for (const char of text) {
    process.stdout.write(styleFn ? styleFn(char) : char);
    const jitter = (Math.random() - 0.5) * 20;
    await sleep(Math.max(10, charDelay + jitter));
  }
  process.stdout.write('\n');
  await sleep(100);
}

async function typeEmpty(delay = 220) {
  process.stdout.write('\n');
  await sleep(delay);
}

// ─── 3D Heart  (ray marching · implicit SDF) ─────────────────────────────────
//
//  Heart surface = revolution of the 2D heart curve around the Y-axis:
//    f(x,y,z) = (R²+y²−1)³ − R²·y³   R=√(x²+z²)   inside: f≤0
//
//  Z-flattening (FLATTEN > 1) makes the heart shallower in depth than width,
//  so a horizontal Y-axis spin clearly reveals the 3-D shape.
//
const CW      = 58;
const CH      = 28;
const LX = 0.26, LY = 0.43, LZ = 0.86;  // light direction
// Z-flattening: heart is 1/FLATTEN ≈ 56% as deep as it is wide.
// This makes the horizontal Y-axis spin clearly show 3D depth
// (front view = full width, side view = narrow).
const FLATTEN = 1.8;

// Evaluate heart SDF at world point (wx, wy, wz) when heart is rotated by
// `angle` around the world Y-axis (horizontal spin).
function evalHeart(wx, wy, wz, cA, sA) {
  // Inverse Y-rotation
  const rx = wx * cA + wz * sA;
  const rz = -wx * sA + wz * cA;
  // Apply Z-flattening so the heart has depth ≠ width
  const R2 = rx * rx + (rz * FLATTEN) * (rz * FLATTEN);
  const d  = R2 + wy * wy - 1;
  return d * d * d - R2 * wy * wy * wy;
}

function renderHeartFrame(angle) {
  const canvas = Array.from({ length: CH }, () => Array(CW).fill(' '));
  const clrBuf = Array.from({ length: CH }, () => Array(CW).fill(null));

  const cA      = Math.cos(angle);
  const sA      = Math.sin(angle);
  const WSCALE  = 1.4 / (CW / 2);  // world units per column
  const EPS     = 0.002;
  const Z_STEPS = 100;
  const dz      = -4.0 / Z_STEPS;  // step size from z=+2 to z=−2

  for (let sy = 0; sy < CH; sy++) {
    const wy = -(sy - CH / 2) * WSCALE * 2.0 + 0.05;

    for (let sx = 0; sx < CW; sx++) {
      const wx = (sx - CW / 2) * WSCALE;

      // ── Ray march from z=+2 (viewer side) toward z=−2 ──────────────────
      let prevF = evalHeart(wx, wy, 2.0, cA, sA);
      let prevZ = 2.0;
      let hit   = false;
      let hitZ  = 0;

      for (let zi = 1; zi <= Z_STEPS; zi++) {
        const wz = 2.0 + zi * dz;
        const f  = evalHeart(wx, wy, wz, cA, sA);
        if (prevF > 0 && f <= 0) {
          // Linear interpolation for sub-step accuracy
          hitZ = prevZ + (wz - prevZ) * prevF / (prevF - f);
          hit  = true;
          break;
        }
        prevF = f;
        prevZ = wz;
      }

      if (!hit) continue;

      // ── World-space surface normal via numerical gradient ────────────────
      const f0 = evalHeart(wx,       wy,       hitZ,       cA, sA);
      let nx   = evalHeart(wx + EPS, wy,       hitZ,       cA, sA) - f0;
      let ny   = evalHeart(wx,       wy + EPS, hitZ,       cA, sA) - f0;
      let nz   = evalHeart(wx,       wy,       hitZ + EPS, cA, sA) - f0;
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (nl < 1e-8) continue;
      nx /= nl; ny /= nl; nz /= nl;

      // ── Diffuse + ambient lighting ───────────────────────────────────────
      const diff       = Math.max(0, nx * LX + ny * LY + nz * LZ);
      const brightness = 0.15 + 0.85 * diff;

      // Pop-cute: all hearts, bright-face = ♥, dark-face = ♡, back-shadow = ˙
      canvas[sy][sx] = brightness < 0.25 ? '˙'
                     : brightness < 0.6  ? '♡'
                     : '♥';

      // Vibrant pink-to-magenta gradient
      const r = Math.round(148 + brightness * 107); // 148..255
      const g = Math.round(brightness * 108);         //   0..108
      const b = Math.round(90  + brightness * 130);  //  90..220
      clrBuf[sy][sx] = chalk.rgb(r, g, b);
    }
  }

  // ── Orbiting sparkles ✦ ✧ ★ around the heart ──────────────────────────────
  const SPARKS     = ['✦', '✧', '★', '✦', '✧', '★'];
  const SPARK_CLRS = [
    chalk.hex('#FFD700'), chalk.hex('#FFB6C1'), chalk.hex('#FF69B4'),
    chalk.hex('#FFF0A0'), chalk.hex('#FF1493'), chalk.hex('#FFFFFF'),
  ];
  for (let i = 0; i < 6; i++) {
    const sa  = angle * 0.9 + (i / 6) * Math.PI * 2;
    const sr  = 1.25 + 0.07 * Math.sin(angle * 4 + i);
    const spx = Math.round(sr * Math.cos(sa) / (1.4 / (CW / 2)) + CW / 2);
    const spy = Math.round(-sr * Math.sin(sa) / (2 * 1.4 / (CW / 2)) + CH / 2);
    if (spx >= 1 && spx < CW - 1 && spy >= 0 && spy < CH && canvas[spy][spx] === ' ') {
      canvas[spy][spx] = SPARKS[i];
      clrBuf[spy][spx] = SPARK_CLRS[i];
    }
  }

  return canvas.map((row, ry) =>
    row.map((ch, rx) => {
      const fn = clrBuf[ry][rx];
      return fn ? fn(ch) : ch;
    }).join('')
  ).join('\n');
}

async function playHeartAnimation(rotations = 3, fps = 25) {
  process.stdout.write('\x1b[?25l'); // hide cursor

  // ── Figlet title (generated once) ────────────────────────────────────────
  const rawTitle   = figlet.textSync('LOVE', { font: 'Standard' });
  const titleLines = rawTitle.split('\n').filter(l => l.length > 0);
  const sparkRow   = chalk.hex('#FFD700')('✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦');
  const titleColors = [rose, pink, soft, rose, pink, soft];

  // total lines printed per frame:  sparkRow + title + sparkRow + blank + heart
  const TOTAL_H = 1 + titleLines.length + 1 + 1 + CH;
  const totalFrames = rotations * fps;
  let first = true;

  for (let f = 0; f < totalFrames; f++) {
    const angle = (f / fps) * Math.PI * 2;
    const frame = renderHeartFrame(angle);

    if (!first) {
      process.stdout.write(`\x1b[${TOTAL_H}A\r`);
    }

    // sparkle line
    process.stdout.write(center(sparkRow, CW) + '\n');
    // figlet "LOVE" with cycling pink tones
    for (let i = 0; i < titleLines.length; i++) {
      const colorFn = titleColors[i % titleColors.length];
      process.stdout.write(center(colorFn(titleLines[i]), CW) + '\n');
    }
    // sparkle line + blank gap
    process.stdout.write(center(sparkRow, CW) + '\n');
    process.stdout.write('\n');
    // 3-D heart
    process.stdout.write(frame + '\n');

    first = false;
    await sleep(1000 / fps);
  }

  process.stdout.write('\x1b[?25h'); // show cursor
}

// ─── Graceful Ctrl+C ──────────────────────────────────────────────────────────
process.on('SIGINT', () => {
  process.stdout.write('\x1b[?25h\n');
  process.exit(0);
});

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const WIDTH  = 60;
  const border = soft('~'.repeat(WIDTH));

  // ハートアニメーション (3回転 = 3秒)
  console.log();
  await playHeartAnimation(3, 25);
  await sleep(400);

  // クリアして手紙へ
  process.stdout.write('\x1b[2J\x1b[H');
  console.log();
  console.log(border);
  console.log(center(rose('♡  To Becky  ♡'), WIDTH));
  console.log(border);
  console.log();

  const D = 40;

  await typeLine(pink,  'Beckyへ', D);
  await typeEmpty();
  await typeLine(soft,  '遠距離は簡単じゃないなあ。', D);
  await typeLine(null,  '正直、寂しさや不安を感じることもあると思う。', D);
  await typeLine(null,  'それでも、俺はこの時間も出来事も全て「訓練」だと思っている。', D);
  await typeEmpty();
  await typeLine(null,  '離れているからこそ、', D);
  await typeLine(null,  '自分の弱さや焦りと向き合えるし、', D);
  await typeLine(null,  'もっと強くなれると実感する。', D);
  await typeEmpty();
  await typeLine(null,  '今、君に苦しい思いをさせてしまっている部分があるなら、本当にごめん。', D);
  await typeLine(null,  'でも俺は逃げない。', D);
  await typeLine(null,  'ちゃんと力をつけて、結果で安心させられる男になる。', D);
  await typeEmpty();
  await typeLine(null,  '君の不安も理解している。', D);
  await typeLine(null,  'だからこそ言いたい。', D);
  await typeEmpty();
  await typeLine(rose,  '信じてほしい。', D);
  await typeLine(null,  '必ず豊かで自由な人生を一緒に作る。', D);
  await typeEmpty();
  await typeLine(soft,  '「幸せにしてあげる」じゃなくて、', D);
  await typeLine(soft,  '一緒に幸せになる未来を作りたい。', D);
  await typeEmpty();
  await typeLine(null,  '正直に言うと、', D);
  await typeLine(null,  '早く成功したい。', D);
  await typeLine(null,  '早くもっと稼ぎたい。', D);
  await typeLine(null,  '君を安心させたい。', D);
  await typeEmpty();
  await typeLine(null,  '焦りや無力感に押しつぶされそうになる日もある。', D);
  await typeLine(null,  'でもそれでも、俺は成し遂げる。', D);
  await typeEmpty();
  await typeLine(null,  'なぜなら、', D);
  await typeLine(pink,  '君と笑っている未来を本気で想像しているから。', D);
  await typeEmpty();
  await typeLine(null,  '俺は君と成功した人生を送りたい。', D);
  await typeLine(null,  '楽しくて、安心できて、誇れる人生を。', D);
  await typeEmpty();
  await typeLine(rose,  '信じて。', D);
  await typeLine(rose,  '俺はやる。', D);
  await typeEmpty();
  await typeLine(pink,  'Rio', D);

  console.log();
  console.log(center(pink('いつもありがとう。 愛してるやで。'), WIDTH));
  console.log();
  console.log(center(rose('♡'), WIDTH));
  console.log();
  console.log(border);
  console.log();
}

main().catch(console.error);
