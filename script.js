const questions = [
    {
        title: "HTML Tags",
        lesson: "HTML uses tags like <h1> for headings.",
        question: "What tag is used for the largest heading?",
        answer: "h1"
    },
    {
        title: "Links",
        lesson: "The <a> tag (anchor) is used to create hyperlinks.",
        question: "Which tag is used for links?",
        answer: "a"
    },
    {
        title: "Images",
        lesson: "The <img> tag is unique because it doesn't need a closing tag.",
        question: "Which tag displays an image?",
        answer: "img"
    }
];

let currentQuestionIndex = 0;
let score = localStorage.getItem("userScore") ? parseInt(localStorage.getItem("userScore")) : 0;

// Initialize the first question
function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById("lesson-title").textContent = q.title;
    document.getElementById("lesson-text").textContent = q.lesson;
    document.getElementById("question-text").textContent = q.question;
    document.getElementById("answer-input").value = ""; // Clear input
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-btn").style.display = "none"; 
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const q = questions[currentQuestionIndex];

    if (userAnswer === q.answer) {
        document.getElementById("feedback").textContent = "Correct! Well done.";
        document.getElementById("feedback").style.color = "#2ecc71";
        
        score += 10;
        document.getElementById("score-value").textContent = score;
        localStorage.setItem("userScore", score);
        
        // Show the "Next" button
        document.getElementById("next-btn").style.display = "inline-block";
    } else {
        document.getElementById("feedback").textContent = "Try again!";
        document.getElementById("feedback").style.color = "#e74c3c";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        document.getElementById("quiz-container").innerHTML = "<h2>🎉 Course Complete!</h2><p>You've mastered the basics.</p>";
    }
}

// Start the app
loadQuestion();
document.getElementById("score-value").textContent = score;