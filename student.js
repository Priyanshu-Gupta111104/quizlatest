const startQuizBtn = document.getElementById('start-quiz');
const quizEntry = document.getElementById('quiz-entry');
const quizContent = document.getElementById('quiz-content');
const userNameInput = document.getElementById('user-name');
const quizCodeInput = document.getElementById('quiz-code');

let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];
let quizTimer;

// Start Quiz
startQuizBtn.addEventListener('click', async () => {
    const userName = userNameInput.value.trim();
    const quizCode = quizCodeInput.value.toUpperCase();

    if (!userName) {
        alert('Please enter your name before starting the quiz.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/quizzes/${quizCode}`);
        if (!response.ok) {
            throw new Error('Invalid quiz code');
        }

        currentQuiz = await response.json();
        localStorage.setItem('userName', userName);

        quizEntry.classList.add('hidden');
        quizContent.classList.remove('hidden');
        document.getElementById('quiz-title-display').textContent = currentQuiz.title;
        userAnswers = new Array(currentQuiz.questions.length).fill(null);
        displayQuestion();

        // Start Timer
        startTimer(currentQuiz.timer);
    } catch (error) {
        alert(error.message);
    }
});

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestion];
    const questionDisplay = document.getElementById('question-display');

    questionDisplay.innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${currentQuiz.questions.length}</h3>
        <p class="question-text">${question.text}</p>
        <div class="options">
            ${question.options.map((option, index) => `
                <label class="option">
                    <input type="radio" name="answer" value="${index}" 
                        ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                    ${option}
                </label>
            `).join('')}
        </div>
    `;

    document.getElementById('prev-question').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-question').style.display = currentQuestion < currentQuiz.questions.length - 1 ? 'block' : 'none';
    document.getElementById('submit-quiz').style.display = currentQuestion === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

document.getElementById('prev-question').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
});

document.getElementById('next-question').addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        if (currentQuestion < currentQuiz.questions.length - 1) {
            currentQuestion++;
            displayQuestion();
        }
    } else {
        alert('Please select an answer!');
    }
});

// Timer function
function startTimer(duration) {
    let timeRemaining = duration * 60;
    const timerDisplay = document.getElementById('quiz-timer-display');
    
    quizTimer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            alert("Time's up! Submitting your quiz.");
            autoSubmitQuiz();
        }

        timeRemaining--;
    }, 1000);
}

// Auto-submit quiz
function autoSubmitQuiz() {
    clearInterval(quizTimer);
    document.getElementById('submit-quiz').click();
}

// Submit Quiz
document.getElementById('submit-quiz').addEventListener('click', async () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
    }

    // ✅ Retrieve `userName` correctly from localStorage
    const userName = localStorage.getItem('userName');

    // ✅ Ensure `userName` is not null or undefined
    if (!userName) {
        alert("Error: User name not found. Please enter your name before starting the quiz.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/quizzes/${currentQuiz.quizCode}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, answers: userAnswers })
        });

        if (!response.ok) {
            throw new Error('Failed to submit quiz.');
        }

        const result = await response.json();
        alert(`Quiz submitted! Your score: ${result.score}`);

        // ✅ Redirect to leaderboard
        window.location.href = `Sleaderboad.html?code=${currentQuiz.quizCode}`;
    } catch (error) {
        alert(`Error submitting quiz: ${error.message}`);
    }
});
