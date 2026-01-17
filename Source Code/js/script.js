/**
 * Project: The Math Game
 * File: script.js
 * Date: February 17, 2022
 * Description: Game logic for multiplication questions, score tracking, and countdown timer.
 * 
 * Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
 * Repository: https://github.com/Amey-Thakur/THE-MATH-GAME
 * License: MIT
 */


// =========================================
//   THE MULTIPLICATION PARADOX ENGINE 🌀
// =========================================
function initParadoxEngine() {
    const rainContainer = document.querySelector("#math-matrix-rain");
    const singularity = document.querySelector(".singularity-container");
    const viewport = document.querySelector(".paradox-viewport");
    const symbols = "0123456789×+÷∑∞√π";

    // 1. Gravitational Matrix Rain
    function createRainDrop() {
        const drop = document.createElement("span");
        drop.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        drop.style.position = "absolute";
        drop.style.color = "#38bdf8";
        drop.style.fontSize = (Math.random() * 0.5 + 0.5) + "rem";
        drop.style.left = Math.random() * 100 + "%";
        drop.style.top = "-20px";
        drop.style.transition = "all 4s linear";
        drop.style.opacity = "0.5";
        
        rainContainer.appendChild(drop);

        // Core position for gravity
        const coreRect = singularity.getBoundingClientRect();
        const dropRect = drop.getBoundingClientRect();
        
        // Final position - pulled toward center
        const destY = 200;
        const centerX = 50; // percentage
        const currentX = parseFloat(drop.style.left);
        const drift = (centerX - currentX) * 0.4; // Pull factor

        setTimeout(() => {
            drop.style.top = destY + "px";
            drop.style.left = (currentX + drift) + "%";
            drop.style.opacity = "0";
            drop.style.transform = "scale(0.2) rotate(360deg)";
        }, 50);

        setTimeout(() => drop.remove(), 4000);
    }

    setInterval(createRainDrop, 100);

    // 2. Cinematic Screen Shake on Core Hover
    singularity.addEventListener("mouseenter", () => {
        viewport.animate([
            { transform: 'translate(1px, 1px) rotate(0deg)' },
            { transform: 'translate(-1px, -2px) rotate(-1deg)' },
            { transform: 'translate(-3px, 0px) rotate(1deg)' },
            { transform: 'translate(3px, 2px) rotate(0deg)' },
            { transform: 'translate(1px, -1px) rotate(1deg)' },
            { transform: 'translate(-1px, 2px) rotate(-1deg)' },
            { transform: 'translate(-3px, 1px) rotate(0deg)' },
            { transform: 'translate(3px, 1px) rotate(-1deg)' },
            { transform: 'translate(-1px, -1px) rotate(1deg)' },
            { transform: 'translate(1px, 2px) rotate(0deg)' },
            { transform: 'translate(1px, -2px) rotate(-1deg)' }
        ], {
            duration: 500,
            iterations: Infinity
        });
    });

    singularity.addEventListener("mouseleave", () => {
        viewport.getAnimations().forEach(anim => {
            if (anim.effect.getKeyframes().length > 5) anim.cancel();
        });
    });
}

// Cleanup and Start
window.addEventListener('DOMContentLoaded', () => {
    // Remove previous footer scripts if any
    const scripts = document.querySelectorAll('script');
    initParadoxEngine();
});
