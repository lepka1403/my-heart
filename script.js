const container = document.getElementById('heart-container');
const textToRepeat = "I love you";

// --- АДАПТАЦІЯ ПІД ЕКРАН ТЕЛЕФОНУ ---
const screenWidth = window.innerWidth;
const isMobile = screenWidth < 600;

// Масштаб: 13 для телефону, щоб усе влізло, 25 для комп'ютера
const scale = isMobile ? 13 : 25; 

// Швидкість появи (твоя улюблена — супердинамічна)
const speed = 7; 

let points = [];

/* 1. ГЕНЕРУЄМО НЕОНОВИЙ КОНТУР (ЗАЛИШАЄТЬСЯ ІДЕАЛЬНИМ) */
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

/* 2. НОВИЙ АЛГОРИТМ: ГУСТИЙ ХАОС ВСЕРЕДИНІ БЕЗ ЛІНІЙ ПО ЦЕНТРУ */
// Задаємо точну кількість слів для внутрішнього заповнення
const targetInsidePoints = isMobile ? 280 : 450; 
let attempts = 0;

// Генеруємо точки абсолютно випадково в межах квадрата, але залишаємо тільки ті, що всередині серця
while (points.length < (targetInsidePoints + contourSteps) && attempts < 20000) {
    attempts++;
    
    // Випадкові координати від -1.5 до 1.5
    const tx = (Math.random() * 3) - 1.5;
    const ty = (Math.random() * 3) - 1.5;
    
    // Перевірка за класичною формулою серця (без прив'язки до кутів, що прибирає лінію по центру)
    if (Math.pow(tx * tx + ty * ty - 1, 3) - tx * tx * ty * ty * ty < 0) {
        
        const posX = tx * scale * 0.92; // 0.92 робить легкий відступ, щоб не перекривати контур
        const posY = -ty * scale * 0.92;
        
        // Перевіряємо відстань між словами, щоб вони не злипалися в одну точку
        let tooClose = false;
        for (let p of points) {
            if (!p.isContour) {
                const dx = posX - p.x;
                const dy = posY - p.y;
                // Задаємо комфортні проміжки для читабельності
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

// Ретельно перемішуємо, щоб контур і середина з'являлися одночасно
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

/* ЛОГІКА КЛІКУ СЮРПРИЗУ */
document.getElementById('start-btn').addEventListener('click', () => {
    const music = document.getElementById('bg-music');
    music.play().catch(e => console.log("Музика активована"));

    const startScreen = document.getElementById('start-screen');
    startScreen.style.opacity = '0';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        container.style.display = 'block';
        animateText(0);
    }, 1000);
});