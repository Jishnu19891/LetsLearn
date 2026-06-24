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
        updateScoreDisplay(score);
    } catch (err) {
        console.error('Could not load score:', err);
    }
}

function updateScoreDisplay(xp) {
    document.getElementById("score-value").textContent = xp;
    document.getElementById("header-xp").textContent = xp;
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

    if (currentCategory.length === 0) {
        alert("No questions available for this subject yet!");
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
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").style.color = "";
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
            updateScoreDisplay(score);
        } catch (err) {
            console.error('Could not save score:', err);
        }

        document.getElementById("feedback").textContent = "Correct! +10 XP";
        document.getElementById("feedback").style.color = "#2ecc71";
        document.getElementById("answer-input").disabled = true;
        document.getElementById("submit-btn").disabled = true;
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
        updateScoreDisplay(score);
    } catch (err) {
        console.error('Could not reset score:', err);
    }
}

// Load category buttons dynamically from DB
async function loadCategories() {
    try {
        const res = await fetch('/api/questions/categories');
        const categories = await res.json();
        const grid = document.getElementById('category-grid');
        grid.innerHTML = '';
        const colors = ['bg-tertiary-container/30 text-on-tertiary-container', 'bg-primary-container/30 text-on-primary-container', 'bg-secondary-container/30 text-on-secondary-container', 'bg-surface-container-highest text-on-surface'];
        const icons = ['📚', '💡', '🧪', '🎯', '🌐', '⚡', '🔥', '🚀'];
        categories.forEach((cat, i) => {
            const btn = document.createElement('button');
            btn.className = `cat-btn group relative overflow-hidden p-8 rounded-xl text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[180px] ${colors[i % colors.length]}`;
            btn.innerHTML = `
                <div class="bg-white/60 w-14 h-14 rounded-lg flex items-center justify-center text-3xl shadow-sm mb-4">${icons[i % icons.length]}</div>
                <div>
                    <h3 class="font-headline font-bold text-xl"></h3>
                    <div class="mt-3 flex items-center gap-2 text-primary font-bold text-sm">
                        <span>Start</span>
                        <span>→</span>
                    </div>
                </div>`;
            btn.querySelector('h3').textContent = cat.label;
            btn.onclick = () => startQuiz(cat.key);
            grid.appendChild(btn);
        });
    } catch (err) {
        console.error('Could not load categories:', err);
    }
}

// Init
initScore();
loadCategories();
