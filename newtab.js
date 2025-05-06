// // newtab.js
// (() => {
//   // 1) canvas setup
//   const canvas = document.getElementById('particleCanvas');
//   const ctx    = canvas.getContext('2d');
//   let   width, height;
//   function resize() {
//     width  = canvas.width  = window.innerWidth;
//     height = canvas.height = window.innerHeight;
//   }
//   window.addEventListener('resize', resize);
//   resize();

//   // 2) mouse tracking
//   const mouse = { x: null, y: null, radius: 150 };
//   window.addEventListener('mousemove', e => {
//     mouse.x = e.clientX; mouse.y = e.clientY;
//   });
//   window.addEventListener('mouseout', () => {
//     mouse.x = mouse.y = null;
//   });

//   // 3) default settings (will be overwritten)
//   let settings = {
//     count: 300,
//     dist: 120,
//     lines: true
//   };

//   // 4) particles array + hue
//   let particles = [];
//   let hue = 0;

//   // 5) Particle class (exactly one constructor + update + draw)
//   class Particle {
//     constructor() { this.init(); }
//     init() {
//       this.x     = Math.random() * width;
//       this.y     = Math.random() * height;
//       this.angle = Math.random() * Math.PI * 2;
//       this.speed = Math.random() * 0.9 + 0.5;
//       this.size  = Math.random() * 2 + 1;
//     }
//     draw(color) {
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//       ctx.fillStyle = color;
//       ctx.fill();
//     }
//     update() {
//       this.angle += (Math.random() - 0.5) * 0.01;
//       let vx = Math.cos(this.angle) * this.speed;
//       let vy = Math.sin(this.angle) * this.speed;

//       if (mouse.x !== null) {
//         const dx = this.x - mouse.x;
//         const dy = this.y - mouse.y;
//         const dist = Math.hypot(dx, dy);
//         if (dist < mouse.radius) {
//           const repelAngle    = Math.atan2(dy, dx);
//           const force         = (mouse.radius - dist) / mouse.radius * 6;
//           vx += Math.cos(repelAngle) * force;
//           vy += Math.sin(repelAngle) * force;
//         }
//       }

//       this.x = (this.x + vx + width)  % width;
//       this.y = (this.y + vy + height) % height;
//     }
//   }

//   // 6) create `settings.count` particles
//   function initParticles() {
//     particles = [];
//     for (let i = 0; i < settings.count; i++) {
//       particles.push(new Particle());
//     }
//   }

//   // 7) draw lines only if `settings.lines`
//   function connect() {
//     if (!settings.lines) return;
//     for (let i = 0; i < particles.length; i++) {
//       for (let j = i + 1; j < particles.length; j++) {
//         const p1 = particles[i], p2 = particles[j];
//         const dx = p1.x - p2.x, dy = p1.y - p2.y;
//         const dist = Math.hypot(dx, dy);
//         if (dist < settings.dist) {
//           const alpha = 1 - dist / settings.dist;
//           ctx.strokeStyle = `hsla(${hue},80%,60%,${alpha})`;
//           ctx.lineWidth = 1;
//           ctx.beginPath();
//           ctx.moveTo(p1.x, p1.y);
//           ctx.lineTo(p2.x, p2.y);
//           ctx.stroke();
//         }
//       }
//     }
//   }

//   // 8) main loop
//   function animate() {
//     ctx.clearRect(0, 0, width, height);
//     hue = (hue + 0.5) % 360;
//     const color = `hsl(${hue},70%,65%)`;
  
//     particles.forEach(p => {
//       p.update();      // move the particle
//       p.draw(color);   // always draw its circle
//     });
  
//     // then draw your lines as before
//     connect();
  
//     requestAnimationFrame(animate);
//   }
  
//   // 9) apply new settings: re-spawn
//   function applySettings(newSettings) {
//     settings = newSettings;
//     initParticles();
//   }

//   // 10) on load: fetch prefs → init → start
//   chrome.storage.sync.get(settings, prefs => {
//     applySettings({
//       count: prefs.count,
//       dist:  prefs.dist,
//       lines: prefs.lines
//     });
//     animate();
//   });

//   // 11) watch for storage changes (popup “Apply”)
//   chrome.storage.onChanged.addListener((changes, area) => {
//     if (area !== 'sync') return;
//     const updated = {
//       count: changes.count ? changes.count.newValue : settings.count,
//       dist:  changes.dist  ? changes.dist.newValue  : settings.dist,
//       lines: changes.lines ? changes.lines.newValue : settings.lines
//     };
//     applySettings(updated);
//   });

//   // 12) debug helper: uncomment to inspect!
//   // window.particleDebug = () => console.log(particles);
// })();
(() => {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let width, height;
  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = mouse.y = null; });

  let settings = { count:300, dist:120, speed:1, lines:true };
  let particles = [];
  let hue = 0;

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x     = Math.random() * width;
      this.y     = Math.random() * height;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.5 + 0.2;
      this.size  = Math.random() * 2 + 1;
    }
    update() {
      this.angle += (Math.random() - 0.5) * 0.01;
      let vx = Math.cos(this.angle) * this.speed;
      let vy = Math.sin(this.angle) * this.speed;
      vx *= settings.speed;
      vy *= settings.speed;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const repelAngle = Math.atan2(dy, dx);
          const force      = (mouse.radius - dist) / mouse.radius * 6;
          vx += Math.cos(repelAngle) * force;
          vy += Math.sin(repelAngle) * force;
        }
      }
      this.x = (this.x + vx + width)  % width;
      this.y = (this.y + vy + height) % height;
    }
    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < settings.count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    if (!settings.lines) return;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < settings.dist) {
          const alpha = 1 - dist / settings.dist;
          ctx.strokeStyle = `hsla(${hue},80%,60%,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hue = (hue + 0.5) % 360;
    const color = `hsl(${hue},70%,65%)`;
    particles.forEach(p => { p.update(); p.draw(color); });
    connect();
    requestAnimationFrame(animate);
  }

  function applySettings(newSettings) {
    settings = newSettings;
    initParticles();
  }

  chrome.storage.sync.get(settings, prefs => {
    applySettings(prefs);
    animate();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const updated = {
      count: changes.count?.newValue  ?? settings.count,
      dist:  changes.dist?.newValue   ?? settings.dist,
      speed: changes.speed?.newValue  ?? settings.speed,
      lines: changes.lines?.newValue  ?? settings.lines
    };
    applySettings(updated);
  });
})();