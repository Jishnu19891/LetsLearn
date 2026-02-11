// 1. Initialize score from LocalStorage (or 0 if it doesn't exist)
let score = localStorage.getItem("userScore") ? parseInt(localStorage.getItem("userScore")) : 0;

// Update the display immediately on load
document.getElementById("score-value").textContent = score;

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const feedback = document.getElementById("feedback");
    const scoreDisplay = document.getElementById("score-value");

    if (userAnswer === "h1") {
        feedback.textContent = "Correct! +10 points!";
        feedback.style.color = "#2ecc71";
        
        // 2. Increase and Save Score
        score += 10;
        scoreDisplay.textContent = score;
        localStorage.setItem("userScore", score); // Saves to browser memory
        
    } else {
        feedback.textContent = "Try again!";
        feedback.style.color = "#e74c3c";
    }
}

// 3. Clear the score
function resetScore() {
    score = 0;
    localStorage.removeItem("userScore");
    document.getElementById("score-value").textContent = score;
    alert("Progress wiped!");
}