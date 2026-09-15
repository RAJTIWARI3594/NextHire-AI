const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/**
 * Pure Node.js PNG file generator for PWA App Icons
 * Generates dark-themed gradient icons with NextHire AI branding.
 */
function createPngBuffer(width, height, colorRgb) {
  // PNG signature
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk("IHDR", ihdr);

  // Raw pixel data with filter byte 0 at start of each scanline
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);

  const [r, g, b] = colorRgb;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;

      // Subtle gradient effect
      const factor = 1 - (y / height) * 0.3;
      const isCenterSymbol =
        x > width * 0.35 &&
        x < width * 0.65 &&
        y > height * 0.35 &&
        y < height * 0.65;

      if (isCenterSymbol) {
        // Cyan/Blue highlight icon badge
        rawData[pxOffset] = Math.min(255, Math.floor(59 * factor + 100));
        rawData[pxOffset + 1] = Math.min(255, Math.floor(130 * factor + 120));
        rawData[pxOffset + 2] = Math.min(255, Math.floor(246 * factor));
      } else {
        rawData[pxOffset] = Math.floor(r * factor);
        rawData[pxOffset + 1] = Math.floor(g * factor);
        rawData[pxOffset + 2] = Math.floor(b * factor);
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk("IDAT", compressedData);

  // IEND chunk
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

// Generate PWA icons
const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const publicDir = path.join(__dirname, "..", "public");

const darkBg = [15, 23, 42]; // Slate-900 (#0f172a)

fs.writeFileSync(
  path.join(iconsDir, "icon-192.png"),
  createPngBuffer(192, 192, darkBg)
);
fs.writeFileSync(
  path.join(iconsDir, "icon-512.png"),
  createPngBuffer(512, 512, darkBg)
);
fs.writeFileSync(
  path.join(iconsDir, "icon-maskable-192.png"),
  createPngBuffer(192, 192, darkBg)
);
fs.writeFileSync(
  path.join(iconsDir, "icon-maskable-512.png"),
  createPngBuffer(512, 512, darkBg)
);
fs.writeFileSync(
  path.join(publicDir, "apple-touch-icon.png"),
  createPngBuffer(180, 180, darkBg)
);

console.log(
  "✅ Generated 192x192, 512x512, maskable PWA PNG icons and apple-touch-icon.png"
);
