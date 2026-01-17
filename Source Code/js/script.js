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
        //change the mode of playing
        playing = true;
        //set scores to 0
        score = 0;
        wrongScore = 0;
        document.querySelector("#scorevalue").innerHTML = score;
        document.querySelector("#wrong-score").innerHTML = wrongScore; // Sync wrong count

        //show countdown box
        showElement("timeremaining");
        //countdown time
        timeRemaining = 60;
        //show countdown in sec
        document.querySelector("#timeremainingvalue").innerHTML = timeRemaining;
        //Reset Style
        document.querySelector("#timeremaining").classList.remove("timer-warning");
        //hide the game over box
        hideElement("gameOver");
        //change button to reset
        document.querySelector("#startreset").innerHTML = "Reset Game";
        //start countdown
        startCountdown();

        //Switch to Math Mode Styles
        document.querySelector("#question").style.fontSize = "5rem";

        //generate new Q&A
        generateQA();
    }
}

for (let i = 1; i < 5; i++) {
    //if we click on answer box
    document.querySelector("#box" + i).onclick = () => {
        //if we are playing
        if (playing) {
            //if correct answer
            if (document.querySelector("#box" + i).innerHTML == correctAnswer) {
                //increase score by 1
                score++;
                //set score value
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
                document.querySelector("#wrong-score").innerHTML = wrongScore; // Update UI

                //show try again box for 1sec
                hideElement("correct");
                showElement("wrong");
                setTimeout(() => {
                    hideElement("wrong");
                }, 1000);
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
        //reduce time by 1sec in loops
        timeRemaining -= 1;
        //show countdown in sec
        document.querySelector("#timeremainingvalue").innerHTML = timeRemaining;

        // Pulse Animation for last 10 seconds
        if (timeRemaining < 11) {
            document.querySelector("#timeremaining").classList.add("timer-warning");
        } else {
            document.querySelector("#timeremaining").classList.remove("timer-warning");
        }

        //no time left
        if (timeRemaining == 0) {
            //game over
            stopCountdown();
            //show game over box
            showElement("gameOver");
            //show game over message and score
            document.querySelector("#gameOver").innerHTML = "<p>Game Over!</p><p>Your score is : " + score + ".</p>";
            //hide countdown
            hideElement("timeremaining");
            //hide correct box
            hideElement("correct");
            //hide wrong box
            hideElement("wrong");
            //change the mode of playing
            playing = false;
            //change button to start 
            document.querySelector("#startreset").innerHTML = "Start Game";
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
    //generating random number between 1-9
    var x = 1 + Math.round(9 * Math.random());
    var y = 1 + Math.round(9 * Math.random());
    //correct answer
    correctAnswer = x * y;
    //setting question
    document.querySelector("#question").innerHTML = x + " x " + y;
    //setting random position for correct answer
    var correctPosition = 1 + Math.round(3 * Math.random());
    document.querySelector("#box" + correctPosition).innerHTML = correctAnswer;

    var answers = [correctAnswer];

    //checking and replacing duplicate values
    for (let i = 1; i < 5; i++) {
        if (i != correctPosition) {
            var wrongAnswer;
            do {
                wrongAnswer = (1 + Math.round(9 * Math.random())) * (1 + Math.round(9 * Math.random()));
            } while ((answers.indexOf(wrongAnswer)) > -1)
            document.querySelector("#box" + i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer)
        }
    }
}
