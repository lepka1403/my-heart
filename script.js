const container = document.getElementById('heart-container');
const textToRepeat = "I love you";

// --- НАЛАШТУВАННЯ ЧАСУ ТА РОЗМІРУ ---
const scale = 25;        // Наш ідеальний масштаб контуру
const speed = 40;        // Довша анімація! Написи з'являтимуться плавно і неспішно

let points = [];

/* 1. НАДНАДІЙНИЙ КОНТУР (ЗАЛИШАЄТЬСЯ ІДЕАЛЬНИМ) */
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

/* 2. НОВЕ СУПЕР-ГУСТЕ ХАОТИЧНЕ ЗАПОВНЕННЯ СЕРЕДИНИ */
// Робимо дуже багато дрібних шарів (крок всього 0.04), щоб забити кожен міліметр всередині
for (let r = 0.08; r < 0.94; r += 0.04) {
    
    // Створюємо багато точок на кожному внутрішньому рівні
    const numSteps = Math.floor(65 * r); 
    
    for (let i = 0; i < numSteps; i++) {
        const t = (i / numSteps) * 2 * Math.PI;
        
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        
        // Зміщення для створення чистого, нелінійного хаосу
        const randomShiftX = (Math.random() * 26) - 13;
        const randomShiftY = (Math.random() * 12) - 6;
        
        points.push({ 
            x: (x * scale * r) + randomShiftX, 
            y: (-y * scale * r) + randomShiftY,
            isContour: false 
        });
    }
}

// Перемішуємо масив тричі для абсолютного хаосу появи
points.sort(() => Math.random() - 0.5);
points.sort(() => Math.random() - 0.5);

// Координати центру екрана
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

/* 3. ФУНКЦІЯ АНІМАЦІЇ */
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

    // Перехід до наступного слова з новою тривалою затримкою
    setTimeout(() => animateText(index + 1), speed);
}

// Запуск магії
animateText(0);