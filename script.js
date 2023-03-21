const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0; // Define mouseX variable
let mouseY = 0; // Define mouseY variable

// Add event listener to update mouseX and mouseY variables
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const dots = [];
const numDots = 100;

class Dot {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gradient = ctx.createLinearGradient(this.x, this.y, this.x + 20, this.y + 20);
    this.gradient.addColorStop(0, 'white');
    this.gradient.addColorStop(1, 'white');
    
    
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
  }

  draw() {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 50) {
      const t = 1 - dist / 50;
      this.gradient = ctx.createLinearGradient(this.x, this.y, this.x + 20, this.y + 20);
      this.gradient.addColorStop(0, `rgba(255,0,0,${t})`);
      this.gradient.addColorStop(0.5, `rgba(255,255,0,${t})`);
      this.gradient.addColorStop(1, `rgba(0,255,0,${t})`);
    } else {
      this.gradient = ctx.createLinearGradient(this.x, this.y, this.x + 20, this.y + 20);
      this.gradient.addColorStop(0, 'white');
      this.gradient.addColorStop(1, 'white');
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.gradient;
    ctx.fill();
  }
}

function createDots() {
  for (let i = 0; i < numDots; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const vx = Math.random() * 1 - 0.9;
    const vy = Math.random() * 1 - 0.9;
    dots.push(new Dot(x, y, vx, vy));
  }
}

const maxDistance = 75; // Adjust this value to control the distance threshold for connecting dots

function drawLines() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy); // Calculate the distance between the two dots

      if (dist < maxDistance) {
        const t = 1 - dist / maxDistance;
        const gradient = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${t})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 0, ${t})`);
        gradient.addColorStop(1, `rgba(0, 0, 255, ${t})`);

        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}



function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
    dots[i].draw();
  }

  drawLines();
  requestAnimationFrame(animate);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

canvas.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  for (let i = 0; i < dots.length; i++) {
    const dx = mouseX - dots[i].x;
    const dy = mouseY - dots[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 50) {
      const force = (50 - dist) / 50; // Calculate a smooth force based on distance
      const easing = 0.1; // Control the smoothness of the interpolation

      dots[i].x = lerp(dots[i].x, dots[i].x - dx * force, easing);
      dots[i].y = lerp(dots[i].y, dots[i].y - dy * force, easing);
    }
  }
});

createDots();
animate();
