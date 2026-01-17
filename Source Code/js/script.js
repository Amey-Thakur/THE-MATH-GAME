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
    questionBox.classList.remove('hud-animate');
    void questionBox.offsetHeight;
    questionBox.classList.add('hud-animate');
    questionBox.innerHTML = val;
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
            questionBox.style.color = "#4ade80"; // Green for GO
            questionBox.style.textShadow = "0 0 30px #4ade80";
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
    document.querySelector("#question").classList.remove('hud-animate');
    document.querySelector("#question").style.fontSize = "5rem";
    generateQA();
}

for (let i = 1; i < 5; i++) {
    //if we click on answer box
    document.querySelector("#box" + i).onclick = function () {
        //if we are playing
        if (playing) {
            // Explicitly unlock audio on interaction
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Robust number parsing
            const clickedText = this.innerText.trim();
            const selectedVal = parseFloat(clickedText);

            console.log("Clicked:", selectedVal, "Correct:", correctAnswer); // Debug

            //if correct answer
            if (selectedVal == correctAnswer) {
                //increase score by 1
                score++;
                document.querySelector("#scorevalue").innerHTML = score;

                //hide wrong box and show correct box
                hideElement("wrong");
                showElement("correct");
                setTimeout(() => {
                    hideElement("correct");
                }, 1000);

                //generate new Q&A
                generateQA();
            }
            //if wrong answer
            else {
                //increase wrong score
                wrongScore++;
                document.querySelector("#wrong-score").innerHTML = wrongScore;

                //show try again box for 1sec
                hideElement("correct");
                showElement("wrong");
                setTimeout(() => {
                    hideElement("wrong");
                }, 1000);

                // Advance to next question even on wrong answer
                generateQA();
            }
        }
    }
}

/**
 * Countdown Timer Implementation
 * Uses setInterval() to decrement the time every 1000ms (1 second).
 * When time reaches zero, the game ends: score is displayed, UI is reset,
 * and the game state is set to 'not playing'.
 */
function startCountdown() {
    action = setInterval(() => {
        // 1. Decrement timer
        timeRemaining = timeRemaining - 1;

        // 2. Update display FIRST
        const timerEl = document.querySelector("#timeremainingvalue");
        const wrapperEl = document.querySelector("#timeremaining");
        timerEl.textContent = timeRemaining;

        console.log("Timer:", timeRemaining); // Debug

        // 3. Check for last 10 seconds (10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
        if (timeRemaining <= 10 && timeRemaining >= 1) {
            console.log("Red + Sound at:", timeRemaining); // Debug
            wrapperEl.classList.add("timer-warning");
            try { playTick(); } catch (e) { console.error(e); }
        } else {
            wrapperEl.classList.remove("timer-warning");
        }

        // 4. Game Over at 0
        if (timeRemaining === 0) {
            stopCountdown();
            playBeep('gameover');

            document.querySelector("#question").style.display = "none";
            document.querySelector("#hud-metrics").style.display = "none";
            wrapperEl.style.display = "none";
            hideElement("correct");
            hideElement("wrong");

            const gameOverEl = document.querySelector("#gameOver");
            gameOverEl.innerHTML = "<p>GAME OVER</p><p>FINAL SCORE: " + score + "</p>";
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

    // Set Question Text
    document.querySelector("#question").textContent = x + " x " + y;

    // Pick random box for correct answer
    const correctPos = Math.floor(Math.random() * 4) + 1;
    document.querySelector("#box" + correctPos).textContent = correctAnswer;

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
