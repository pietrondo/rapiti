/**
 * Generate a simple pixel-art icon for the game.
 * Creates a 256x256 32-bit BMP inside an ICO container.
 * Pure Node.js, no external dependencies.
 */

const fs = require('fs');
const path = require('path');

const SIZE = 256;

// Simple pixel-art lantern icon
// Colors
const BG = [0x1a, 0x1c, 0x20, 0xff];      // Dark background
const LANTERN_BODY = [0x5a, 0x40, 0x30, 0xff]; // Brown body
const LANTERN_GLOW = [0xd4, 0xa8, 0x43, 0xff]; // Yellow glow
const LANTERN_BRIGHT = [0xff, 0xe4, 0x80, 0xff]; // Bright center
const FRAME = [0x3a, 0x28, 0x20, 0xff];   // Dark frame

// Create pixel data (top-down order for simplicity, we'll flip later)
const pixels = new Uint8Array(SIZE * SIZE * 4);

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const idx = (y * SIZE + x) * 4;
    
    // Normalize coordinates to -1..1
    const nx = (x - SIZE / 2) / (SIZE / 2);
    const ny = (y - SIZE / 2) / (SIZE / 2);
    const dist = Math.sqrt(nx * nx + ny * ny);
    
    // Default background
    pixels[idx] = BG[0];
    pixels[idx + 1] = BG[1];
    pixels[idx + 2] = BG[2];
    pixels[idx + 3] = BG[3];
    
    // Rounded square background
    if (Math.abs(nx) < 0.85 && Math.abs(ny) < 0.85) {
      // Check rounded corners
      const cornerDist = Math.sqrt(
        Math.pow(Math.max(0, Math.abs(nx) - 0.7), 2) +
        Math.pow(Math.max(0, Math.abs(ny) - 0.7), 2)
      );
      
      if (cornerDist < 0.15) {
        pixels[idx] = BG[0];
        pixels[idx + 1] = BG[1];
        pixels[idx + 2] = BG[2];
        pixels[idx + 3] = 0xff;
      }
    }
    
    // Lantern body (ellipse)
    const lanternDist = Math.sqrt(nx * nx * 0.8 + ny * ny * 1.2);
    if (lanternDist < 0.5) {
      if (lanternDist < 0.15) {
        // Bright center
        pixels[idx] = LANTERN_BRIGHT[0];
        pixels[idx + 1] = LANTERN_BRIGHT[1];
        pixels[idx + 2] = LANTERN_BRIGHT[2];
      } else if (lanternDist < 0.3) {
        // Glow
        const t = (lanternDist - 0.15) / 0.15;
        pixels[idx] = Math.round(LANTERN_BRIGHT[0] * (1 - t) + LANTERN_GLOW[0] * t);
        pixels[idx + 1] = Math.round(LANTERN_BRIGHT[1] * (1 - t) + LANTERN_GLOW[1] * t);
        pixels[idx + 2] = Math.round(LANTERN_BRIGHT[2] * (1 - t) + LANTERN_GLOW[2] * t);
      } else {
        // Body
        pixels[idx] = LANTERN_BODY[0];
        pixels[idx + 1] = LANTERN_BODY[1];
        pixels[idx + 2] = LANTERN_BODY[2];
      }
      pixels[idx + 3] = 0xff;
    }
    
    // Lantern frame (cross bars)
    if (Math.abs(nx) < 0.52 && Math.abs(ny) < 0.52) {
      if ((Math.abs(nx) > 0.45 && Math.abs(nx) < 0.5) ||
          (Math.abs(ny) > 0.35 && Math.abs(ny) < 0.4)) {
        pixels[idx] = FRAME[0];
        pixels[idx + 1] = FRAME[1];
        pixels[idx + 2] = FRAME[2];
        pixels[idx + 3] = 0xff;
      }
    }
    
    // Top handle
    if (Math.abs(nx) < 0.08 && ny < -0.45 && ny > -0.65) {
      pixels[idx] = FRAME[0];
      pixels[idx + 1] = FRAME[1];
      pixels[idx + 2] = FRAME[2];
      pixels[idx + 3] = 0xff;
    }
    
    // Subtle vignette
    const vignette = 1 - Math.min(1, dist * 0.8);
    pixels[idx] = Math.round(pixels[idx] * vignette);
    pixels[idx + 1] = Math.round(pixels[idx + 1] * vignette);
    pixels[idx + 2] = Math.round(pixels[idx + 2] * vignette);
  }
}

// Build ICO file
function createICO(pixelData, width, height) {
  const bmpSize = 40 + width * height * 4; // BITMAPINFOHEADER + pixel data
  const icoSize = 6 + 16 + bmpSize; // Header + directory + BMP
  
  const ico = Buffer.alloc(icoSize);
  let offset = 0;
  
  // ICO Header
  ico.writeUInt16LE(0, offset); offset += 2; // Reserved
  ico.writeUInt16LE(1, offset); offset += 2; // Type: ICO
  ico.writeUInt16LE(1, offset); offset += 2; // Count
  
  // ICONDIRENTRY
  ico.writeUInt8(width === 256 ? 0 : width, offset); offset += 1; // Width
  ico.writeUInt8(height === 256 ? 0 : height, offset); offset += 1; // Height
  ico.writeUInt8(0, offset); offset += 1; // Colors (0 = >256)
  ico.writeUInt8(0, offset); offset += 1; // Reserved
  ico.writeUInt16LE(1, offset); offset += 2; // Color planes
  ico.writeUInt16LE(32, offset); offset += 2; // Bits per pixel
  ico.writeUInt32LE(bmpSize, offset); offset += 4; // Size of image data
  ico.writeUInt32LE(6 + 16, offset); offset += 4; // Offset to image data
  
  // BITMAPINFOHEADER
  ico.writeUInt32LE(40, offset); offset += 4; // Header size
  ico.writeInt32LE(width, offset); offset += 4; // Width
  ico.writeInt32LE(height * 2, offset); offset += 4; // Height (double for XOR + AND masks)
  ico.writeUInt16LE(1, offset); offset += 2; // Planes
  ico.writeUInt16LE(32, offset); offset += 2; // Bits per pixel
  ico.writeUInt32LE(0, offset); offset += 4; // Compression (0 = BI_RGB)
  ico.writeUInt32LE(0, offset); offset += 4; // Image size (0 for BI_RGB)
  ico.writeInt32LE(2835, offset); offset += 4; // X pixels per meter
  ico.writeInt32LE(2835, offset); offset += 4; // Y pixels per meter
  ico.writeUInt32LE(0, offset); offset += 4; // Colors used
  ico.writeUInt32LE(0, offset); offset += 4; // Important colors
  
  // Pixel data (bottom-up, BGRA order)
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      // BGRA order for BMP
      ico[offset++] = pixelData[srcIdx + 2]; // B
      ico[offset++] = pixelData[srcIdx + 1]; // G
      ico[offset++] = pixelData[srcIdx];     // R
      ico[offset++] = pixelData[srcIdx + 3]; // A
    }
  }
  
  return ico;
}

const icoData = createICO(pixels, SIZE, SIZE);
const outputPath = path.join(__dirname, '..', 'icon.ico');
fs.writeFileSync(outputPath, icoData);
console.log(`Icon generated: ${outputPath} (${icoData.length} bytes)`);
