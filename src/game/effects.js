/**
 * Particle System & Dynamic Lighting
 * Aggiunge effetti visivi avanzati: particelle, illuminazione, screen shake
 */

var ParticleSystem = {
  particles: [],
  maxParticles: 200,
  
  /**
   * Crea una particella
   */
  create: function(x, y, type, options) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    
    var particle = {
      x: x,
      y: y,
      type: type,
      life: options.life || 60,
      maxLife: options.life || 60,
      vx: options.vx || (Math.random() - 0.5) * 0.5,
      vy: options.vy || (Math.random() - 0.5) * 0.5,
      size: options.size || 2,
      color: options.color || '#FFFFFF',
      alpha: options.alpha || 1,
      gravity: options.gravity || 0,
      friction: options.friction || 0.98
    };
    
    this.particles.push(particle);
    return particle;
  },
  
  /**
   * Crea lucciole (fireflies) per il campo
   */
  createFireflies: function(x, y) {
    for (var i = 0; i < 15; i++) {
      this.create(
        x + Math.random() * 300,
        y + Math.random() * 200,
        'firefly',
        {
          life: 120 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1 + Math.random() * 2,
          color: '#FFFF88',
          alpha: 0.6 + Math.random() * 0.4,
          gravity: -0.01
        }
      );
    }
  },
  
  /**
   * Crea polvere per interni
   */
  createDust: function(x, y) {
    for (var i = 0; i < 10; i++) {
      this.create(
        x + Math.random() * 300,
        y + Math.random() * 200,
        'dust',
        {
          life: 180 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.1 - Math.random() * 0.1,
          size: 1,
          color: '#CCCCCC',
          alpha: 0.3 + Math.random() * 0.2,
          gravity: 0.005
        }
      );
    }
  },
  
  /**
   * Crea scintille quando si raccoglie un indizio
   */
  createSparkles: function(x, y) {
    for (var i = 0; i < 20; i++) {
      var angle = (Math.PI * 2 / 20) * i;
      var speed = 1 + Math.random() * 2;
      this.create(
        x, y,
        'sparkle',
        {
          life: 30 + Math.random() * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 2,
          color: '#FFD700',
          alpha: 1,
          gravity: 0.05,
          friction: 0.95
        }
      );
    }
  },
  
  /**
   * Aggiorna tutte le particelle
   */
  update: function() {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.life--;
      
      // Fade out
      p.alpha = (p.life / p.maxLife) * p.alpha;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  },
  
  /**
   * Disegna tutte le particelle
   */
  draw: function(ctx) {
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      
      ctx.save();
      ctx.globalAlpha = p.alpha;
      
      if (p.type === 'firefly') {
        // Lucciola: cerchio luminoso
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        
        // Alone
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.fillRect(Math.floor(p.x) - 1, Math.floor(p.y) - 1, p.size + 2, p.size + 2);
      } else if (p.type === 'dust') {
        // Polvere: piccolo punto
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
      } else if (p.type === 'sparkle') {
        // Scintilla: stella
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }
      
      ctx.restore();
    }
  },
  
  /**
   * Pulisce tutte le particelle
   */
  clear: function() {
    this.particles = [];
  }
};

/**
 * Dynamic Lighting System
 * Aggiunge aloni luminosi dinamici
 */
var LightingSystem = {
  lights: [],
  
  /**
   * Aggiunge una luce
   */
  addLight: function(x, y, radius, color, intensity) {
    this.lights.push({
      x: x,
      y: y,
      radius: radius || 30,
      color: color || '#FFAA44',
      intensity: intensity || 0.3,
      flicker: Math.random() * 0.05
    });
  },
  
  /**
   * Aggiunge luci ambiente per un'area
   */
  setupAreaLights: function(areaId) {
    this.lights = [];
    
    switch (areaId) {
      case 'piazze':
        // Lampioni
        this.addLight(50, 100, 40, '#FFAA44', 0.2);
        this.addLight(200, 100, 40, '#FFAA44', 0.2);
        this.addLight(350, 100, 40, '#FFAA44', 0.2);
        // Finestre
        this.addLight(46, 52, 20, '#FFCC66', 0.15);
        this.addLight(76, 52, 20, '#FFCC66', 0.15);
        break;
        
      case 'chiesa':
        // Vetrate colorate
        this.addLight(185, 50, 30, '#FF4444', 0.2);
        this.addLight(203, 50, 30, '#4444FF', 0.2);
        // Lampada confessionale
        this.addLight(196, 104, 30, '#FFAA44', 0.25);
        break;
        
      case 'cimitero':
        // Mausoleo
        this.addLight(310, 100, 25, '#FFCC66', 0.15);
        break;
        
      case 'giardini':
        // Fontana piccola
        this.addLight(200, 164, 20, '#AABBDD', 0.2);
        // Farfalla
        var t = Date.now() * 0.001;
        var bx = 250 + Math.sin(t*1.2)*20;
        var by = 120 + Math.cos(t*1.8)*10;
        this.addLight(bx, by, 15, '#AA66CC', 0.3);
        break;
        
      case 'bar_exterior':
        // Insegna luminosa
        var signPulse = Math.sin(Date.now()*0.003)*0.3+0.7;
        this.addLight(190, 30, 25, '#CC0000', signPulse*0.3);
        // Finestre illuminate
        this.addLight(132, 52, 20, '#FFAA44', 0.2);
        this.addLight(232, 52, 20, '#FFAA44', 0.2);
        break;
        
      case 'residenziale':
        // Finestre case
        this.addLight(37, 52, 18, '#FFCC66', 0.15);
        this.addLight(67, 52, 18, '#FFCC66', 0.15);
        this.addLight(177, 47, 20, '#FFCC66', 0.15);
        this.addLight(212, 47, 20, '#FFCC66', 0.15);
        this.addLight(317, 57, 16, '#FFCC66', 0.15);
        break;
        
      case 'industriale':
        // Capannoni
        var flicker = Math.sin(Date.now()*0.005)*0.3+0.5;
        this.addLight(47, 47, 20, '#FFAA44', flicker*0.2);
        this.addLight(82, 47, 20, '#FFAA44', flicker*0.2);
        this.addLight(217, 57, 18, '#FFAA44', 0.15);
        // Ciminiera fumo (luci riflesse)
        this.addLight(350, 15, 30, '#FFFFFF', 0.1);
        break;
        
      case 'polizia':
        // Insegna
        this.addLight(200, 18, 35, '#CC0000', 0.25);
        // Finestre con sbarre
        this.addLight(132, 52, 20, '#AABBDD', 0.15);
        this.addLight(172, 52, 20, '#AABBDD', 0.15);
        this.addLight(222, 52, 20, '#AABBDD', 0.15);
        this.addLight(262, 52, 20, '#AABBDD', 0.15);
        // Lampeggianti auto
        var flash = Math.sin(Date.now()*0.006) > 0;
        if(flash) {
          this.addLight(295, 143, 12, '#FF0000', 0.3);
          this.addLight(315, 143, 12, '#0000FF', 0.2);
        } else {
          this.addLight(295, 143, 12, '#0000FF', 0.2);
          this.addLight(315, 143, 12, '#FF0000', 0.3);
        }
        break;
    }
  },
  
  /**
   * Aggiorna le luci (flicker)
   */
  update: function() {
    for (var i = 0; i < this.lights.length; i++) {
      var light = this.lights[i];
      light.intensity += (Math.random() - 0.5) * light.flicker;
      light.intensity = Math.max(0.1, Math.min(0.4, light.intensity));
    }
  },
  
  /**
   * Disegna tutte le luci
   */
  draw: function(ctx, playerX, playerY) {
    // Luci ambiente (nessuna luce sul player)
    for (var i = 0; i < this.lights.length; i++) {
      var light = this.lights[i];
      this.drawLight(ctx, light.x, light.y, light.radius, light.color, light.intensity);
    }
  },
  
  /**
   * Disegna una singola luce con gradiente radiale
   */
  drawLight: function(ctx, x, y, radius, color, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color.replace(')', ',' + intensity + ')').replace('rgb', 'rgba'));
    gradient.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    
    ctx.restore();
  }
};

/**
 * Screen Shake Effect
 */
var ScreenShake = {
  active: false,
  intensity: 0,
  duration: 0,
  timer: 0,
  offsetX: 0,
  offsetY: 0,
  
  /**
   * Attiva lo screen shake
   */
  shake: function(intensity, duration) {
    this.active = true;
    this.intensity = intensity || 3;
    this.duration = duration || 10;
    this.timer = 0;
  },
  
  /**
   * Aggiorna lo screen shake
   */
  update: function() {
    if (!this.active) return;
    
    this.timer++;
    if (this.timer >= this.duration) {
      this.active = false;
      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }
    
    var progress = this.timer / this.duration;
    var currentIntensity = this.intensity * (1 - progress);
    
    this.offsetX = (Math.random() - 0.5) * currentIntensity;
    this.offsetY = (Math.random() - 0.5) * currentIntensity;
  },
  
  /**
   * Applica lo shake al context
   */
  apply: function(ctx) {
    if (this.active) {
      ctx.translate(this.offsetX, this.offsetY);
    }
  },
  
  /**
   * Reset dello shake
   */
  reset: function() {
    this.active = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }
};

/**
 * Vignette Effect
 * Aggiunge una vignettatura ai bordi del canvas
 */
var Vignette = {
  intensity: 0.4,
  color: '#000000',
  
  /**
   * Disegna la vignettatura
   */
  draw: function(ctx, width, height) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    
    var gradient = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.3,
      width / 2, height / 2, width * 0.7
    );
    
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, this.color);
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = this.intensity;
    ctx.fillRect(0, 0, width, height);
    
    ctx.restore();
  }
};
