// 1. Data Structure
const allQuestions = {
    html: [
        { title: "HTML Headings", lesson: "<h1> is the main title tag.", question: "What tag is for the largest heading?", answer: "h1" },
        { title: "HTML Links", lesson: "<a> tags link to other pages.", question: "Which tag creates a hyperlink?", answer: "a" }
    ],
    css: [
        { title: "Text Color", lesson: "The 'color' property affects text.", question: "Property to change text color?", answer: "color" },
        { title: "Box Model", lesson: "'padding' is space inside a box.", question: "What property adds internal space?", answer: "padding" }
    ],
    js: [
        { title: "Variables", lesson: "'let' allows values to change.", question: "Keyword to declare a variable?", answer: "let" },
        { title: "Functions", lesson: "Functions perform tasks.", question: "Keyword to start a function?", answer: "function" }
    ]
};

// 2. Global State
let currentCategory = [];
let currentQuestionIndex = 0;
let score = localStorage.getItem("userScore") ? parseInt(localStorage.getItem("userScore")) : 0;
let timeLeft = 10;
let timerInterval;

// 3. Navigation Functions
function startQuiz(category) {
    currentCategory = allQuestions[category];
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

// 4. Core Logic
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

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const q = currentCategory[currentQuestionIndex];

    if (userAnswer === q.answer) {
        clearInterval(timerInterval);
        document.getElementById("feedback").textContent = "Correct! +10 XP";
        document.getElementById("feedback").style.color = "#2ecc71";
        
        score += 10;
        document.getElementById("score-value").textContent = score;
        localStorage.setItem("userScore", score);
        
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

function resetScore() {
    score = 0;
    localStorage.removeItem("userScore");
    document.getElementById("score-value").textContent = score;
}

// Init
document.getElementById("score-value").textContent = score;