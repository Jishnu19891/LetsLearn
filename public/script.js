// Global State
let currentCategory = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;

// On page load: fetch score from server
async function initScore() {
    try {
        const res = await fetch('/api/score');
        const data = await res.json();
        score = data.xp;
        document.getElementById("score-value").textContent = score;
    } catch (err) {
        console.error('Could not load score:', err);
    }
}

// Navigation
async function startQuiz(category) {
    try {
        const res = await fetch(`/api/questions/${category}`);
        currentCategory = await res.json();
    } catch (err) {
        console.error('Could not load questions:', err);
        return;
    }

    currentQuestionIndex = 0;
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    loadQuestion();
}

function showMenu() {
    clearInterval(timerInterval);
    document.getElementById("menu-container").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";
}

// Core Logic
function loadQuestion() {
    const q = currentCategory[currentQuestionIndex];

    document.getElementById("lesson-title").textContent = q.title;
    document.getElementById("lesson-text").textContent = q.lesson;
    document.getElementById("question-text").textContent = q.question;

    document.getElementById("answer-input").value = "";
    document.getElementById("answer-input").disabled = false;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("timer-container").classList.remove("timer-low");

    startTimer();
}

function startTimer() {
    timeLeft = 10;
    document.getElementById("time-left").textContent = timeLeft;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;

        if (timeLeft <= 3) document.getElementById("timer-container").classList.add("timer-low");

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    document.getElementById("feedback").textContent = "Time's up!";
    document.getElementById("feedback").style.color = "#e67e22";
    document.getElementById("answer-input").disabled = true;
    document.getElementById("next-btn").style.display = "block";
}

async function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const q = currentCategory[currentQuestionIndex];

    if (userAnswer === q.answer) {
        clearInterval(timerInterval);

        try {
            const res = await fetch('/api/score/add', { method: 'POST' });
            const data = await res.json();
            score = data.xp;
            document.getElementById("score-value").textContent = score;
        } catch (err) {
            console.error('Could not save score:', err);
        }

        document.getElementById("feedback").textContent = "Correct! +10 XP";
        document.getElementById("feedback").style.color = "#2ecc71";
        document.getElementById("answer-input").disabled = true;
        document.getElementById("next-btn").style.display = "block";
    } else {
        document.getElementById("feedback").textContent = "Try again!";
        document.getElementById("feedback").style.color = "#e74c3c";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentCategory.length) {
        loadQuestion();
    } else {
        clearInterval(timerInterval);
        alert("Category Complete!");
        showMenu();
    }
}

async function resetScore() {
    try {
        const res = await fetch('/api/score/reset', { method: 'DELETE' });
        const data = await res.json();
        score = data.xp;
        document.getElementById("score-value").textContent = score;
    } catch (err) {
        console.error('Could not reset score:', err);
    }
}

// Init
initScore();
