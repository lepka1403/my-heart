const container = document.getElementById('heart-container');
const textToRepeat = "I love you";

// Адаптація розміру під екран мобільного
const screenWidth = window.innerWidth;
const isMobile = screenWidth < 600;

// 13 для телефону (щоб усе влізло), 25 для комп'ютера
const scale = isMobile ? 13 : 25; 
const speed = 7; 

let points = [];

/* 1. ГЕНЕРУЄМО НЕОНОВИЙ КОНТУР */
const contourSteps = 90; 
for (let i = 0; i < contourSteps; i++) {
    const t = (i / contourSteps) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    
    points.push({ 
        x: x * scale, 
        y: -y * scale, 
        isContour: true 
    });
}

/* 2. РІВНОМІРНИЙ ГУСТИЙ ХАОС ВСЕРЕДИНІ */
const targetInsidePoints = isMobile ? 280 : 450; 
let attempts = 0;

while (points.length < (targetInsidePoints + contourSteps) && attempts < 20000) {
    attempts++;
    
    const tx = (Math.random() * 3) - 1.5;
    const ty = (Math.random() * 3) - 1.5;
    
    if (Math.pow(tx * tx + ty * ty - 1, 3) - tx * tx * ty * ty * ty < 0) {
        const posX = tx * scale * 0.92; 
        const posY = -ty * scale * 0.92;
        
        let tooClose = false;
        for (let p of points) {
            if (!p.isContour) {
                const dx = posX - p.x;
                const dy = posY - p.y;
                if (Math.abs(dx) < 26 && Math.abs(dy) < 13) {
                    tooClose = true;
                    break;
                }
            }
        }
        
        if (!tooClose) {
            points.push({ x: posX, y: posY, isContour: false });
        }
    }
}

points.sort(() => Math.random() - 0.5);

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

function animateText(index) {
    if (index >= points.length) return;

    const point = points[index];
    const span = document.createElement('span');
    span.className = 'text-fragment';
    
    if (point.isContour) {
        span.classList.add('contour-glow');
    }
    
    span.textContent = textToRepeat;
    span.style.left = `${centerX + point.x}px`;
    span.style.top = `${centerY + point.y}px`;
    
    container.appendChild(span);

    setTimeout(() => animateText(index + 1), speed);
}

// Запускаємо магію автоматично при завантаженні сторінки!
animateText(0);