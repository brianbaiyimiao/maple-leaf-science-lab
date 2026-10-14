/* =========================================
   MAPLE LEAF SCIENCE LAB - MASTER SCRIPT
   Engine: Dynamic Canvas & Routing Logic
========================================= */

// =========================================
// 1. 全局智能路由引擎 (Omni-Search & Redirection)
// 替代并升级了您原本的 selectSubject 功能
// =========================================

// 通过点击卡片按钮触发的跳转
function selectSubject(subjectName) {
    console.log("System Initializing: " + subjectName);
    
    switch(subjectName) {
        case 'science10':
            window.location.href = "science10/index.html";
            break;
        case 'physics11':
            window.location.href = "physics11/index.html";
            break;
        case 'chemistry11':
            window.location.href = "chemistry11/index.html";
            break;
        case 'biology11':
            window.location.href = "biology11/index.html";
            break;
        case 'physics12':
            window.location.href = "physics12/index.html";
            break;
        case 'chemistry12':
            window.location.href = "chemistry12/chem12.html";
            break;
        case 'biology12':
            window.location.href = "biology12/bio12.html";
            break;
        default:
            alert("⚠️ SYSTEM ERROR: Module [" + subjectName + "] is currently offline or under construction.");
    }
}

// 通过顶部搜索框触发的智能跳转
function handleEnter(e) {
    if(e.key === 'Enter') executeSearch();
}

function executeSearch() {
    let inputEl = document.getElementById('omniInput');
    if(!inputEl) return;
    
    let query = inputEl.value.toLowerCase().trim();
    if(query === "") return;

    let gradeMatch = query.match(/(10|11|12)/);
    let grade = gradeMatch ? gradeMatch[1] : null;

    let subjectStr = "";
    if(query.includes("sci") || query.includes("科学")) { subjectStr = "science"; grade = "10"; } 
    else if(query.includes("bio") || query.includes("生物")) { subjectStr = "biology"; if(!grade) grade = "12"; } 
    else if(query.includes("chem") || query.includes("化学")) { subjectStr = "chemistry"; if(!grade) grade = "12"; } 
    else if(query.includes("phy") || query.includes("物理")) { subjectStr = "physics"; if(!grade) grade = "12"; }

    if(subjectStr === "") {
        alert("⚠️ Search Failed: Unknown subject. Try 'bio 12' or 'chem u3'.");
        return;
    }

    let folder = `${subjectStr}${grade}`;
    let homePage = "index.html";
    if(folder === "chemistry12") homePage = "chem12.html";
    if(folder === "biology12") homePage = "bio12.html";

    let unitMatch = query.match(/u(?:nit)?\s*(\d+)/);
    if(unitMatch && unitMatch[1]) {
        window.location.href = `${folder}/unit${unitMatch[1]}.html`;
    } else {
        window.location.href = `${folder}/${homePage}`;
    }
}


// =========================================
// 2. 动态粒子背景引擎 (Interactive Neural Network)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // 动态在 body 中插入 canvas（如果您没在 HTML 写的话，JS 会自动帮您建好）
    let canvas = document.getElementById('science-network');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'science-network';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height, particles;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        let particleCount = (width * height) / 12000; // 调整粒子密度
        
        for(let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        for(let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx; p.y += p.vy;
            
            // 边缘反弹
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            // 鼠标交互推开粒子
            if(mouse.x != null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    p.x -= (dx/dist) * force * 3;
                    p.y -= (dy/dist) * force * 3;
                }
            }

            // 画粒子
            ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // 粒子连线
            for(let j = i; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if(dist < 120) {
                    ctx.strokeStyle = `rgba(148, 163, 184, ${1 - dist/120})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();
});