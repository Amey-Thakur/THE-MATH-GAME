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

// Global Variables
let playing = false;
let score = 0;
let wrongScore = 0;
let action;
let timeRemaining;
let correctAnswer;
let correctBoxId;

// Audio Context for Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Common Sound Effect Generator
 * Generates procedural beeps for game events (start, correct, wrong, gameover).
 */
function playBeep(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    } else if (type === 'gameover') {
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'count') {
        osc.frequency.setValueAtTime(660, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    }
}

/**
 * Tick Sound for the Urgency Timer
 */
function playTick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
}

/**
 * HUD Pulse Animation
 * Used during the countdown sequence (3, 2, 1, GO!)
 */
function hudAnimate(text, isGo = false) {
    const questionEl = document.querySelector("#question");
    questionEl.innerHTML = `<span class="hud-animate">${text}</span>`;

    const span = questionEl.querySelector("span");
    if (isGo) {
        span.style.color = "#38bdf8";
        span.style.textShadow = "0 0 30px #38bdf8";
    }
}

/**
 * Pre-Game Countdown Sequence (3-2-1-GO)
 * Blocks gameplay until the sequence completes.
 */
function startCountdownSequence() {
    playing = "countdown"; // Special state to prevent clicking during countdown
    score = 0;
    wrongScore = 0;
    document.querySelector("#scorevalue").textContent = score;
    document.querySelector("#wrong-score").textContent = wrongScore;

    // Hide UI elements
    hideElement("gameOver");
    hideElement("correct");
    hideElement("wrong");
    hideElement("secret-hint"); // Hide hint immediately
    hideElement("score");
    hideElement("missed");
    document.querySelector("#hud-metrics").style.display = "none";
    document.querySelector("#timeremaining").style.display = "none";

    document.querySelector("#startreset").innerHTML = "Reset Game";

    // Sequence
    setTimeout(() => { hudAnimate("3"); playBeep('count'); }, 0);
    setTimeout(() => { hudAnimate("2"); playBeep('count'); }, 1000);
    setTimeout(() => { hudAnimate("1"); playBeep('count'); }, 2000);
    setTimeout(() => {
        hudAnimate("GO!", true);
        playBeep('start');
        setTimeout(startGameLogic, 500); // Start game after GO!
    }, 3000);
}

/**
 * Main Game Initialization
 * Resets scores, starts the main timer, and generates the first question.
 */
function startGameLogic() {
    playing = true;
    timeRemaining = 60;
    document.querySelector("#timeremainingvalue").textContent = timeRemaining;
    showElement("timeremaining");
    showElement("score");
    showElement("missed");
    document.querySelector("#hud-metrics").style.display = "flex";

    const questionEl = document.querySelector("#question");
    questionEl.style.fontSize = "7rem"; // Reset from fact size

    generateQA();
    startCountdown();
}

// Click-to-Start or Reset
document.querySelector("#startreset").onclick = function () {
    if (playing === true || playing === "countdown") {
        location.reload(); // Hard reset
    } else {
        startCountdownSequence();
    }
};

/**
 * Answer Selection Multiplier Interaction
 */
for (let i = 1; i < 5; i++) {
    document.querySelector("#box" + i).onclick = (function (boxIndex) {
        return function () {
            if (playing === true) {
                handleAnswerSelection.call(this, boxIndex);
            } else if (playing === false) {
                // Lobby Mode Interaction
                try { playBeep('count'); } catch (e) { }

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

                questionEl.style.fontSize = "2.2rem";
                questionEl.innerHTML = randomFact;
            }
        };
    })(i);
}

function handleAnswerSelection(i) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const clickedValue = parseInt(this.textContent, 10);

    if (clickedValue === correctAnswer) {
        score++;
        document.querySelector("#scorevalue").textContent = score;
        playBeep('correct');

        this.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)';
        this.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.8)';

        const clickedBox = this;
        setTimeout(() => {
            clickedBox.style.background = '';
            clickedBox.style.boxShadow = '';
            generateQA();
        }, 300);

        hideElement("wrong");
    } else {
        wrongScore++;
        document.querySelector("#wrong-score").textContent = wrongScore;
        playBeep('wrong');

        this.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        this.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8)';

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
            generateQA();
        }, 500);

        hideElement("correct");
    }
}

function startCountdown() {
    action = setInterval(() => {
        const timerEl = document.querySelector("#timeremainingvalue");
        const wrapperEl = document.querySelector("#timeremaining");
        timeRemaining -= 1;
        timerEl.textContent = timeRemaining;

        if (timeRemaining <= 10 && timeRemaining >= 1) {
            try { playTick(); } catch (e) { }
            wrapperEl.classList.add("timer-warning");
        }

        if (timeRemaining === 0) {
            stopCountdown();
            playBeep('gameover');

            document.querySelector("#question").style.display = "none";
            document.querySelector("#hud-metrics").style.display = "none";
            wrapperEl.style.display = "none";
            showElement("secret-hint");

            // Reset boxes to A, B, C, D
            document.querySelector("#box1").innerHTML = "A";
            document.querySelector("#box2").innerHTML = "B";
            document.querySelector("#box3").innerHTML = "C";
            document.querySelector("#box4").innerHTML = "D";

            const gameOverEl = document.querySelector("#gameOver");
            let bestScore = parseInt(localStorage.getItem('mathGameBestScore')) || 0;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('mathGameBestScore', bestScore);
            }

            stopCountdown();
            showElement("gameOver");
            hideElement("question");
            hideElement("hud-metrics");
            hideElement("secret-hint");
            wrapperEl.style.display = "none"; // Hide timeremaining wrapper

            const scoreColor = score >= bestScore ? '#38bdf8' : 'white';
            gameOverEl.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;">
                    <p style="font-size: 3rem; font-weight: 800; color: #ef4444; margin: 0; text-shadow: 0 0 20px rgba(239, 68, 68, 0.5); text-transform: uppercase;">GAME OVER</p>
                    <p style="font-size: 2.2rem; font-weight: 700; color: ${scoreColor}; margin: 0;">SCORE: ${score}</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: #38bdf8; margin: 0; opacity: 0.9;">BEST: ${bestScore}</p>
                </div>
            `;

            // Populate hidden share card for image generation
            document.querySelector("#share-score-value").textContent = score;
            document.querySelector("#share-best-value").textContent = bestScore;

            // Show Bottom Share Button
            showElement("share-score-bottom");

            playing = false;
            document.querySelector("#startreset").innerHTML = "Play Again";
        }
    }, 1000);
}

function stopCountdown() { clearInterval(action); }
function hideElement(Id) { document.querySelector("#" + Id).style.display = "none"; }
function showElement(Id) {
    const el = document.querySelector("#" + Id);
    el.style.display = (Id === "gameOver" || Id === "hud-metrics" || Id === "share-score-bottom") ? "flex" : "block";
}

function generateQA() {
    const x = Math.floor(Math.random() * 10) + 1;
    const y = Math.floor(Math.random() * 10) + 1;
    correctAnswer = x * y;

    const questionEl = document.querySelector("#question");
    questionEl.textContent = x + " x " + y;
    questionEl.style.display = "flex";

    const correctPos = Math.floor(Math.random() * 4) + 1;
    correctBoxId = "#box" + correctPos;
    document.querySelector(correctBoxId).textContent = correctAnswer;

    const usedAnswers = [correctAnswer];
    for (let i = 1; i < 5; i++) {
        if (i === correctPos) continue;
        let wrongAnswer;
        do {
            wrongAnswer = (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 10) + 1);
        } while (usedAnswers.includes(wrongAnswer));
        document.querySelector("#box" + i).textContent = wrongAnswer;
        usedAnswers.push(wrongAnswer);
    }
}

// =========================================
//   COMMUTATIVE SINGULARITY & ATMOSPHERE 🌌
// =========================================
const mathSymbols = "0123456789×÷+-∑√π∮∇∆";

function initCommutativeSingularity() {
    const nodeA = document.querySelector(".node-a");
    const nodeB = document.querySelector(".node-b");
    const singularity = document.querySelector(".singularity");
    const atmosphere = document.querySelector("#math-atmosphere");

    if (!nodeA || !nodeB || !singularity) return;

    let isSwapped = false;

    // --- Math Atmosphere Logic ---
    const spawnParticle = () => {
        const symbol = document.createElement("div");
        symbol.className = "math-symbol";
        symbol.innerText = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        symbol.style.left = Math.random() * 100 + "vw";
        symbol.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
        if (atmosphere) atmosphere.appendChild(symbol);

        symbol.onanimationend = () => symbol.remove();
    };

    // Initial burst and periodic spawn
    for (let i = 0; i < 8; i++) setTimeout(spawnParticle, i * 300);
    setInterval(spawnParticle, 2000);

    // --- Singularity Swap Logic ---
    const triggerSingularity = () => {
        if (nodeA.classList.contains("tunneling")) return;

        // Activate Singularity Visuals
        singularity.classList.add("active");
        nodeA.classList.add("tunneling");
        nodeB.classList.add("tunneling");

        // Scramble during warp
        let warpInterval = setInterval(() => {
            nodeA.innerText = Array(nodeA.getAttribute("data-name").length)
                .fill(0).map(() => mathSymbols[Math.floor(Math.random() * mathSymbols.length)]).join("");
            nodeB.innerText = Array(nodeB.getAttribute("data-name").length)
                .fill(0).map(() => mathSymbols[Math.floor(Math.random() * mathSymbols.length)]).join("");
        }, 50);

        // Resolve half-way through or at end
        setTimeout(() => {
            clearInterval(warpInterval);
            const nameA = nodeA.getAttribute("data-name");
            const nameB = nodeB.getAttribute("data-name");

            // Physically swap text content to simulate commutative property
            if (!isSwapped) {
                nodeA.innerText = nameB;
                nodeB.innerText = nameA;
                nodeA.href = "https://github.com/msatmod";
                nodeB.href = "https://github.com/Amey-Thakur";
            } else {
                nodeA.innerText = nameA;
                nodeB.innerText = nameB;
                nodeA.href = "https://github.com/Amey-Thakur";
                nodeB.href = "https://github.com/msatmod";
            }

            isSwapped = !isSwapped;

            // Clean up animation classes
            setTimeout(() => {
                singularity.classList.remove("active");
                nodeA.classList.remove("tunneling");
                nodeB.classList.remove("tunneling");
            }, 550); // Snappier resolution
        }, 1200);
    };

    // Trigger on any footer link or multiplier hover
    [nodeA, nodeB, singularity].forEach(el => {
        el.addEventListener("mouseenter", triggerSingularity);
    });

    // Subtitle periodic flicker
    setInterval(() => {
        if (!nodeA.classList.contains("tunneling") && Math.random() > 0.8) {
            singularity.style.textShadow = "0 0 40px #ff00ff, 0 0 20px white";
            setTimeout(() => {
                singularity.style.textShadow = "0 0 20px #ff00ff, 0 0 5px white";
            }, 300);
        }
    }, 3000);
}

// Generate Image & Share (Download)
function shareScore() {
    const shareCard = document.querySelector("#share-card");
    const shareBtn = document.querySelector("#share-score-bottom");

    if (!shareCard) return;

    // Visual feedback on button
    if (shareBtn) {
        const originalHTML = shareBtn.innerHTML;
        shareBtn.innerHTML = "Generating...";
        shareBtn.style.opacity = "0.7";
        shareBtn.style.pointerEvents = "none";
    }

    // Check availability
    if (typeof html2canvas === 'undefined') {
        alert("Error: html2canvas library not loaded.");
        if (shareBtn) {
            shareBtn.innerHTML = "Share Error";
            shareBtn.style.pointerEvents = "auto";
        }
        return;
    }

    // Capture the hidden card
    html2canvas(shareCard, {
        scale: 2, // High resolution
        backgroundColor: null,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const scoreVal = document.querySelector("#share-score-value").textContent;
        link.download = `MathGame-Score-${scoreVal}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

        if (shareBtn) {
            shareBtn.innerHTML = "Shared!";
            setTimeout(() => {
                shareBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg> Share';
                shareBtn.style.opacity = "1";
                shareBtn.style.pointerEvents = "auto";
            }, 2000);
        }
    }).catch(err => {
        console.error("html2canvas error:", err);
        if (shareBtn) {
            shareBtn.innerHTML = "Error";
            shareBtn.style.pointerEvents = "auto";
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initCommutativeSingularity();
});
