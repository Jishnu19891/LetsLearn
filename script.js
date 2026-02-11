let timeLeft = 10; // Seconds per question
let timerInterval;

function startTimer() {
    timeLeft = 10; // Reset time for new question
    document.getElementById("time-left").textContent = timeLeft;
    
    // Clear any existing timer before starting a new one
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    document.getElementById("feedback").textContent = "Time's up! No points this round.";
    document.getElementById("feedback").style.color = "#e67e22";
    document.getElementById("next-btn").style.display = "inline-block";
    // Disable the input so they can't answer after time is up
    document.getElementById("answer-input").disabled = true;
}

// Update your loadQuestion function to include:
function loadQuestion() {
    // ... (previous logic)
    document.getElementById("answer-input").disabled = false;
    startTimer();
}

// Update your checkAnswer function to stop the timer:
function checkAnswer() {
    // ... (inside your 'if correct' logic)
    clearInterval(timerInterval); 
    // ...
}