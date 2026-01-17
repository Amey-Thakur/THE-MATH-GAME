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
//   CONSOLE EASTER EGG 🧮
// =========================================
console.log(
    "%c🧮 The Math Game",
    "font-size: 24px; font-weight: bold; color: #a855f7; text-shadow: 2px 2px 0 #1e1b4b;"
);
console.log(
    "%c🔢 Test your multiplication skills!",
    "font-size: 14px; color: #64748b;"
);
console.log(
    "%c🎓 Developed by Amey Thakur & Mega Satish",
    "font-size: 12px; color: #22c55e;"
);
console.log(
    "%c🔗 https://github.com/Amey-Thakur/THE-MATH-GAME",
    "font-size: 12px; color: #2563eb;"
);
console.log(
    "%c⚠️ This game is protected. Please respect the authors' work!",
    "font-size: 12px; color: #f59e0b; font-weight: bold;"
);

// =========================================
//   SECURITY MEASURES 🔒
// =========================================
(function initSecurity() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'u')) e.preventDefault();
    });
})();
// Game State Variables
// Tracks whether the game is active, the current score, the timer interval reference,
// the remaining time, and the correct answer for the current question.
// Game State Variables
var playing = false;
var score = 0;
var wrongScore = 0; // New variable for wrong answers
var action;
var timeRemaining;
var correctAnswer;
var correctBoxId = null; // Track which box has the correct answer

//if we click on the start/reset
document.querySelector("#startreset").onclick = () => {
    //if we are playing
    if (playing) {
        //reload page
        location.reload();
    }
    // if we are not playing
    else {
        // Unlock Audio Context immediately on user gesture
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Reset UI for countdown
        // Reset UI for countdown
        document.querySelector("#hud-metrics").style.display = "none";
        document.querySelector("#question").style.display = "flex"; // Ensure visible
        document.querySelector("#gameOver").style.display = "none";
        document.querySelector("#startreset").style.pointerEvents = "none"; // Disable button
        document.querySelector("#startreset").innerHTML = "Get Ready...";

        hideElement("secret-hint");
        // Start 3-2-1-GO Sequence
        startCountdownSequence();
    }
}

// =========================================
//   AUDIO & VISUAL UTILS 🎵
// =========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'count') {
        // Futuristic "Charger" Sound
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(200, now);
        oscillator1.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(400, now);
        oscillator2.frequency.exponentialRampToValueAtTime(800, now + 0.2);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        oscillator1.start(now);
        oscillator1.stop(now + 0.3);
        oscillator2.start(now);
        oscillator2.stop(now + 0.3);
    } else if (type === 'gameover') {
        // "Power Down" Descent
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(300, now);
        oscillator1.frequency.exponentialRampToValueAtTime(50, now + 1); // Drop to low bass

        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(150, now);
        oscillator2.frequency.exponentialRampToValueAtTime(30, now + 1);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 1);

        oscillator1.start(now);
        oscillator1.stop(now + 1);
        oscillator2.start(now);
        oscillator2.stop(now + 1);
    } else if (type === 'correct') {
        // Happy ascending chime
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(523, now); // C5
        oscillator1.frequency.setValueAtTime(659, now + 0.1); // E5

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(784, now + 0.1); // G5

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        oscillator1.start(now);
        oscillator1.stop(now + 0.2);
        oscillator2.start(now + 0.1);
        oscillator2.stop(now + 0.2);
    } else if (type === 'wrong') {
        // Low buzz error sound
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(150, now);
        oscillator1.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        oscillator2.type = 'square';
        oscillator2.frequency.setValueAtTime(120, now);

        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        oscillator1.start(now);
        oscillator1.stop(now + 0.2);
        oscillator2.start(now);
        oscillator2.stop(now + 0.2);
    } else {
        // Default: "Hyperdrive" GO Sound
        oscillator1.type = 'square';
        oscillator1.frequency.setValueAtTime(400, now);
        oscillator1.frequency.exponentialRampToValueAtTime(1500, now + 0.4);

        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(800, now);
        oscillator2.frequency.exponentialRampToValueAtTime(2000, now + 0.4);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.8);

        oscillator1.start(now);
        oscillator1.stop(now + 0.8);
        oscillator2.start(now);
        oscillator2.stop(now + 0.8);
    }
}

function playTick() {
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Rising Pitch "Panic" Tick
        // As time value gets smaller (10 -> 1), frequency gets higher
        // Base: 800Hz + ( (11 - timeRemaining) * 100 )
        const urgencyFreq = 800 + ((11 - timeRemaining) * 100);

        oscillator.type = 'square'; // Sharper, more alarming tone
        oscillator.frequency.setValueAtTime(urgencyFreq, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(urgencyFreq + 200, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        console.error("Error playing tick sound:", e);
    }
}

function hudAnimate(val) {
    const questionBox = document.querySelector("#question");
    const span = questionBox.querySelector("span");
    if (span) {
        span.classList.remove('hud-animate');
        void span.offsetHeight;
        span.classList.add('hud-animate');
        span.innerHTML = val;
    } else {
        questionBox.innerHTML = `<span>${val}</span>`;
    }
}

function startCountdownSequence() {
    let count = 3;
    const questionBox = document.querySelector("#question");

    // Initial Beep
    playBeep('count');
    hudAnimate(count);

    const countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            playBeep('count');
            hudAnimate(count);
        } else if (count === 0) {
            playBeep('go');
            hudAnimate("GO!");
            questionBox.style.color = "#38bdf8"; // Blue for GO
            questionBox.style.textShadow = "0 0 30px #38bdf8";
        } else {
            clearInterval(countdownInterval);
            // Restore UI and Start Game
            questionBox.style.color = "rgba(255, 255, 255, 0.9)";
            questionBox.style.textShadow = "0 0 10px rgba(168, 85, 247, 0.5)";
            document.querySelector("#startreset").style.pointerEvents = "auto";
            startGameLogic();
        }
    }, 1000);
}

function startGameLogic() {
    playing = true;
    score = 0;
    wrongScore = 0;
    document.querySelector("#scorevalue").innerHTML = score;
    document.querySelector("#wrong-score").innerHTML = wrongScore;

    document.querySelector("#hud-metrics").style.display = "flex";
    showElement("timeremaining");
    showElement("score");
    showElement("missed");

    // Ensure Audio Context is ready
    if (audioCtx.state === 'suspended') audioCtx.resume();

    timeRemaining = 60;
    document.querySelector("#timeremainingvalue").innerHTML = timeRemaining;
    document.querySelector("#timeremaining").classList.remove("timer-warning");
    hideElement("gameOver");
    document.querySelector("#startreset").innerHTML = "Reset Game";

    startCountdown(); // Game timer

    // ENSURE question is visible
    const questionEl = document.querySelector("#question");
    const span = questionEl.querySelector("span");
    if (span) span.classList.remove('hud-animate');
    questionEl.style.display = "flex";
    questionEl.style.fontSize = "5rem";

    hideElement("secret-hint");
    generateQA();
}

for (let i = 1; i < 5; i++) {
    const box = document.querySelector("#box" + i);
    box.addEventListener("click", function () {
        if (!playing) {
            // LOBBY INTERACTIVITY
            // 1. Play animation
            setTimeout(() => {
            }, 600);

            // 2. Play sound
            if (audioCtx.state === 'suspended') audioCtx.resume();
            try { playBeep('count'); } catch (e) { }

            // 3. Show Math Fact
            const facts = [
                "40 is the only number whose letters are in alphabetical order.",
                "Zero is the only number that can't be represented in Roman numerals.",
                "Multiplying any number by 9? The sum of digits of the answer is always 9!",
                "Have you heard of Fibonacci? 1, 1, 2, 3, 5, 8, 13...",
                "A 'jiffy' is an actual unit of time: 1/100th of a second.",
                "The symbol for division (÷) is called an obelus.",
                "Pi (3.14...) is irrational - it goes on forever without repeating!",
                "-40°C is exactly the same as -40°F.",
                "The spiral shapes of sunflowers follow the Fibonacci sequence.",
                "There are different sizes of infinity!"
            ];
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            const questionEl = document.querySelector("#question");

            questionEl.style.fontSize = "2rem"; // Smaller text for facts
            questionEl.innerHTML = randomFact;

            return;
        }

        // Resume audio if needed
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Get clicked value using textContent (consistent with how we set it)
        const clickedValue = parseInt(this.textContent, 10);

        console.log("=== CLICK EVENT ===");
        console.log("Clicked box:", i, "Value:", clickedValue);
        console.log("Correct answer:", correctAnswer);
        console.log("Match:", clickedValue === correctAnswer);

        if (clickedValue === correctAnswer) {
            // CORRECT - Blue flash + sound
            score++;
            document.querySelector("#scorevalue").textContent = score;
            playBeep('correct');

            // Blue flash on clicked box
            this.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)';
            this.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.8)';

            const clickedBox = this;
            setTimeout(() => {
                clickedBox.style.background = '';
                clickedBox.style.boxShadow = '';
                generateQA(); // Generate AFTER color resets
            }, 300);

            hideElement("wrong");
            hideElement("correct");
        } else {
            // WRONG - Red flash on clicked + Blue on correct + sound
            wrongScore++;
            document.querySelector("#wrong-score").textContent = wrongScore;
            playBeep('wrong');

            // Red flash on wrong clicked box
            this.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            this.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8)';

            // Blue flash on correct answer box
            const correctBox = document.querySelector(correctBoxId);
            if (correctBox) {
                correctBox.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)';
                correctBox.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.8)';
            }

            const clickedBox = this;
            setTimeout(() => {
                clickedBox.style.background = '';
                clickedBox.style.boxShadow = '';
                if (correctBox) {
                    correctBox.style.background = '';
                    correctBox.style.boxShadow = '';
                }
                generateQA(); // Generate AFTER colors reset
            }, 500); // Delay for wrong so player can see correct answer

            hideElement("correct");
            hideElement("wrong");
        }

        // Question is now generated inside timeouts above
        console.log("Feedback shown, waiting before next question...");
    });
}

/**
 * Countdown Timer Implementation
 * Uses setInterval() to decrement the time every 1000ms (1 second).
 * When time reaches zero, the game ends: score is displayed, UI is reset,
 * and the game state is set to 'not playing'.
 */
function startCountdown() {
    action = setInterval(() => {
        const timerEl = document.querySelector("#timeremainingvalue");
        const wrapperEl = document.querySelector("#timeremaining");

        // Calculate next value FIRST
        const nextValue = timeRemaining - 1;

        // Play sound BEFORE updating display (for better perceived sync)
        if (nextValue <= 10 && nextValue >= 1) {
            try { playTick(); } catch (e) { }
            wrapperEl.classList.add("timer-warning");
        } else {
            wrapperEl.classList.remove("timer-warning");
        }

        // NOW update timer and display
        timeRemaining = nextValue;
        timerEl.textContent = timeRemaining;

        // Game Over at 0
        if (timeRemaining === 0) {
            stopCountdown();
            playBeep('gameover');

            document.querySelector("#question").style.display = "none";
            document.querySelector("#hud-metrics").style.display = "none";
            wrapperEl.style.display = "none";
            hideElement("correct");
            hideElement("wrong");
            showElement("secret-hint");

            // Reset boxes to A, B, C, D
            document.querySelector("#box1").innerHTML = "A";
            document.querySelector("#box2").innerHTML = "B";
            document.querySelector("#box3").innerHTML = "C";
            document.querySelector("#box4").innerHTML = "D";

            const gameOverEl = document.querySelector("#gameOver");

            // Best Score Logic
            let bestScore = parseInt(localStorage.getItem('mathGameBestScore')) || 0;
            let isNewBest = score > bestScore;
            if (isNewBest) {
                bestScore = score;
                localStorage.setItem('mathGameBestScore', bestScore);
            }

            // Score color: blue if new best, white otherwise
            const scoreColor = isNewBest ? '#38bdf8' : 'white';

            // Clean/Pro Layout
            gameOverEl.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transform: translateY(-10px);">
                    <p style="font-size: 3rem; font-weight: 800; color: #ef4444; margin: 0; text-shadow: 0 0 20px rgba(239, 68, 68, 0.5); text-transform: uppercase; letter-spacing: 2px;">GAME OVER</p>
                    <p style="font-size: 2.2rem; font-weight: 700; color: ${scoreColor}; margin: 0;">YOUR SCORE: ${score}</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: #38bdf8; margin: 0; opacity: 0.9;">BEST SCORE: ${bestScore}</p>
                </div>
            `;
            gameOverEl.style.display = "flex";

            playing = false;
            document.querySelector("#startreset").innerHTML = "Play Again";
        }
    }, 1000);
}

function stopCountdown() {
    //stop countdown
    clearInterval(action);
}

function hideElement(Id) {
    document.querySelector("#" + Id).style.display = "none";
}

function showElement(Id) {
    const el = document.querySelector("#" + Id);
    if (Id === "gameOver") {
        el.style.display = "flex";
    } else {
        el.style.display = "block";
    }
}

/**
 * Question & Answer Generation Algorithm
 * Generates two random single-digit numbers (1-9) and calculates their product.
 * Places the correct answer in a randomly selected box (1-4).
 * Fills remaining boxes with unique wrong answers using a do-while loop
 * to avoid duplicates (preventing identical distractor values).
 */
function generateQA() {
    // Generate numbers 1-10
    const x = Math.floor(Math.random() * 10) + 1;
    const y = Math.floor(Math.random() * 10) + 1;
    correctAnswer = x * y;

    console.log("New Question:", x, "x", y, "=", correctAnswer);

    // Set Question Text - ENSURE visibility!
    const questionEl = document.querySelector("#question");
    questionEl.textContent = x + " x " + y;
    questionEl.style.display = "flex";

    // Pick random box for correct answer
    const correctPos = Math.floor(Math.random() * 4) + 1;
    correctBoxId = "#box" + correctPos; // Store for highlighting wrong answers
    document.querySelector(correctBoxId).textContent = correctAnswer;

    const usedAnswers = [correctAnswer];

    // Fill other boxes
    for (let i = 1; i < 5; i++) {
        if (i === correctPos) continue;

        let wrongAnswer;
        do {
            const wx = Math.floor(Math.random() * 10) + 1;
            const wy = Math.floor(Math.random() * 10) + 1;
            wrongAnswer = wx * wy;
        } while (usedAnswers.includes(wrongAnswer));

        document.querySelector("#box" + i).textContent = wrongAnswer;
        usedAnswers.push(wrongAnswer);
    }
}

// =========================================
//   MULTIPLICATION SINGULARITY (FOOTER) 🚀
// =========================================
const mathSymbols = "0123456789+-×÷=∑∞√ππ∫";

function setupFooterScramble() {
    const footerLinks = document.querySelectorAll(".footer a");

    footerLinks.forEach(link => {
        const originalText = link.getAttribute("data-value");
        const textSpan = link.querySelector(".text");
        let interval = null;

        link.onmouseover = () => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                textSpan.innerText = originalText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', setupFooterScramble);

// =========================================
//   QUANTUM CORE ENGINE (CONTINUOUS) 🌀
// =========================================
function initQuantumCore() {
    const operator = document.querySelector(".math-operator");
    const particleField = document.querySelector(".particle-field");
    const creators = document.querySelectorAll(".footer a");
    const operators = ["&", "×", "*", "÷", "∑", "√"];
    let opIndex = 0;

    // 1. Morph the Operator
    setInterval(() => {
        opIndex = (opIndex + 1) % operators.length;
        operator.style.opacity = 0;
        setTimeout(() => {
            operator.innerText = operators[opIndex];
            operator.style.opacity = 1;
        }, 300);
    }, 3000);

    // 2. Shoot Energy Pulses
    setInterval(() => {
        createPulse();
    }, 4000);

    function createPulse() {
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
            const p = document.createElement("span");
            p.className = "energy-particle";
            p.innerText = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            
            // Random direction: Left or Right
            const isLeft = Math.random() > 0.5;
            const target = isLeft ? creators[0] : creators[1];
            
            particleField.appendChild(p);

            const angle = isLeft ? (Math.PI + (Math.random() - 0.5)) : (Math.random() - 0.5);
            const distance = 150 + Math.random() * 50;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * 50;

            p.animate([
                { opacity: 0, transform: 'translate(0, 0) scale(0.5)', filter: 'blur(5px)' },
                { opacity: 1, transform: 'translate(' + (destX/2) + 'px, ' + (destY/2) + 'px) scale(1.2)', offset: 0.5 },
                { opacity: 0, transform: 'translate(' + destX + 'px, ' + destY + 'px) scale(0.5)', filter: 'blur(3px)' }
            ], {
                duration: 1500 + Math.random() * 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                p.remove();
                // "Hit" effect on name
                target.style.filter = 'brightness(2) contrast(1.2) drop-shadow(0 0 10px #38bdf8)';
                setTimeout(() => target.style.filter = '', 100);
            };
        }
    }
}

// Start core
window.addEventListener('DOMContentLoaded', initQuantumCore);
