/**
 * Texture Generator for EarthBound-style backgrounds
 * Creates detailed 16x16 or 32x32 tile textures for walls, floors, etc.
 */
const _TextureGenerator = {
  /**
   * Generate brick wall texture (EarthBound style)
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @returns {HTMLCanvasElement}
   */
  generateBrickWall(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Base wall color
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, 0, width, height);

    // Brick pattern (EarthBound style - irregular, warm colors)
    const brickColors = ['#A59375', '#7B6345', '#B5A385', '#6B5335'];
    const mortarColor = '#5B4325';

    // Horizontal rows
    for (let y = 0; y < height; y += 8) {
      const offset = (y / 8) % 2 === 0 ? 0 : 12;

      for (let x = offset; x < width; x += 24) {
        // Random brick color variation
        const brickColor = brickColors[Math.floor(Math.random() * brickColors.length)];
        ctx.fillStyle = brickColor;
        ctx.fillRect(x, y, 22, 6);

        // Mortar lines
        ctx.fillStyle = mortarColor;
        ctx.fillRect(x, y + 6, 24, 2);
        if (x > 0) ctx.fillRect(x - 2, y, 2, 6);
      }
    }

    return canvas;
  },

  /**
   * Generate wooden floor/paneling texture
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @returns {HTMLCanvasElement}
   */
  generateWoodFloor(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Base wood color
    const baseColors = ['#8B7D6B', '#7B6D5B', '#9B8D7B'];
    const grainColors = ['#5B4D3B', '#4B3D2B', '#6B5D4B'];

    // Wood planks with varied widths
    for (let y = 0; y < height; y += 16) {
      const plankH = 14 + Math.floor(Math.random() * 4);
      const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];
      const grainColor = grainColors[Math.floor(Math.random() * grainColors.length)];

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, y, width, plankH);

      // Wood grain lines — curved
      ctx.fillStyle = grainColor;
      for (let g = 0; g < 6; g++) {
        const gx = Math.random() * width;
        const gy = y + 2 + g * 2;
        const gw = 3 + Math.random() * 6;
        ctx.fillRect(gx, gy, gw, 1);
        // Curva venatura
        if (Math.random() > 0.5) {
          ctx.fillRect(gx + 1, gy + 1, gw - 2, 1);
        }
      }

      // Knots
      if (Math.random() > 0.7) {
        const kx = 20 + Math.random() * (width - 40);
        const ky = y + 4 + Math.random() * (plankH - 8);
        ctx.fillStyle = grainColor;
        ctx.beginPath();
        ctx.arc(kx, ky, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crepe
      if (Math.random() > 0.8) {
        ctx.fillStyle = '#3B2D1B';
        ctx.fillRect(Math.random() * width, y + 2, 1, plankH - 4);
      }
    }

    return canvas;
  },

  /**
   * Generate varied grass texture with different heights and colors
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @returns {HTMLCanvasElement}
   */
  generateGrassTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Base ground
    ctx.fillStyle = '#3D5A3C';
    ctx.fillRect(0, 0, width, height);

    // Grass blades — varied heights, colors, and inclinations
    const grassColors = ['#4D6A4C', '#5D7A5C', '#3D5A3C', '#2D4A2C', '#6D8A6C', '#4E7A4E'];

    for (let x = 0; x < width; x += 2) {
      const bladeCount = 2 + Math.floor(Math.random() * 4);
      const baseColor = grassColors[Math.floor(Math.random() * grassColors.length)];

      for (let b = 0; b < bladeCount; b++) {
        const bladeHeight = 6 + Math.floor(Math.random() * 18);
        const bladeWidth = 1 + Math.floor(Math.random() * 2);
        const offsetX = -2 + Math.floor(Math.random() * 5);

        ctx.fillStyle = baseColor;
        ctx.fillRect(x + offsetX, height - bladeHeight, bladeWidth, bladeHeight);

        // Fiori occasionali
        if (Math.random() > 0.97 && bladeHeight > 10) {
          ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#D4A843';
          ctx.fillRect(x + offsetX, height - bladeHeight - 2, 2, 2);
        }
      }
    }

    return canvas;
  },

  /**
   * Generate stone path texture
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @returns {HTMLCanvasElement}
   */
  generateStonePath(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Base path color
    ctx.fillStyle = '#7D6D5D';
    ctx.fillRect(0, 0, width, height);

    // Stone variations — irregular shapes, wet/dry variation
    const stoneColors = ['#8D7D6D', '#6D5D4D', '#9D8D7D', '#5D4D3D', '#A09080'];

    // Create irregular stone pattern with varied sizes
    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < width; x += 12) {
        const stoneColor = stoneColors[Math.floor(Math.random() * stoneColors.length)];
        const stoneWidth = 8 + Math.floor(Math.random() * 12);
        const stoneHeight = 6 + Math.floor(Math.random() * 8);
        const offsetX = Math.floor(Math.random() * 4);
        const offsetY = Math.floor(Math.random() * 3);

        ctx.fillStyle = stoneColor;
        ctx.fillRect(x + offsetX, y + offsetY, stoneWidth, stoneHeight);

        // Wet/dry variation
        if (Math.random() > 0.7) {
          ctx.fillStyle = 'rgba(100,110,120,0.3)';
          ctx.fillRect(x + offsetX, y + offsetY, stoneWidth, stoneHeight);
        }
      }
    }

    // Dirt/grass between stones
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? '#5D7A5C' : '#8B7D6B';
      ctx.fillRect(x, y, 2 + Math.random() * 4, 2 + Math.random() * 3);
    }

    return canvas;
  },

  // Cache for generated textures
  _cache: {},

  /**
   * Get or create cached texture
   * @param {string} type - Texture type ('brick', 'wood', 'grass', 'stone')
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {HTMLCanvasElement}
   */
  getOrCreateTexture(type, width, height) {
    const key = `${type}_${width}x${height}`;
    if (!this._cache[key]) {
      switch (type) {
        case 'brick':
          this._cache[key] = this.generateBrickWall(width, height);
          break;
        case 'wood':
          this._cache[key] = this.generateWoodFloor(width, height);
          break;
        case 'grass':
          this._cache[key] = this.generateGrassTexture(width, height);
          break;
        case 'stone':
          this._cache[key] = this.generateStonePath(width, height);
          break;
        default: {
          // Return simple colored rectangle as fallback
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#8B7355'; // Default color
          ctx.fillRect(0, 0, width, height);
          this._cache[key] = canvas;
        }
      }
    }
    return this._cache[key];
  },
};

// Global export for bundle compatibility
if (typeof window !== 'undefined') {
  window.TextureGenerator = _TextureGenerator;
}
