const quizForm = document.getElementById('quiz-form');
const addQuestionBtn = document.getElementById('add-question');
const questionsContainer = document.getElementById('questions-container');

function createQuestionElement(index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <div class="form-group">
            <label>Question ${index + 1}</label>
            <input type="text" name="question${index}" required>
        </div>
        <div class="options-container">
            <div class="form-group">
                <input type="text" name="option${index}_1" placeholder="Option 1" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_2" placeholder="Option 2" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_3" placeholder="Option 3" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_4" placeholder="Option 4" required>
            </div>
        </div>
        <div class="form-group">
            <label>Correct Answer (1-4)</label>
            <input type="number" name="correct${index}" min="1" max="4" required>
        </div>
    `;
    return questionDiv;
}

addQuestionBtn.addEventListener('click', () => {
    const questionCount = questionsContainer.children.length;
    questionsContainer.appendChild(createQuestionElement(questionCount));
});

quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const quiz = {
        title: document.getElementById('quiz-title').value,
        description: document.getElementById('quiz-description').value,
        questions: [],
        timer: parseInt(document.getElementById('quiz-timer').value) || 5
    };

    const questionElements = questionsContainer.children;
    for (let i = 0; i < questionElements.length; i++) {
        const question = {
            text: quizForm[`question${i}`].value,
            options: [
                quizForm[`option${i}_1`].value,
                quizForm[`option${i}_2`].value,
                quizForm[`option${i}_3`].value,
                quizForm[`option${i}_4`].value
            ],
            correct: parseInt(quizForm[`correct${i}`].value) - 1
        };
        quiz.questions.push(question);
    }

    try {
        const response = await fetch('http://localhost:5500/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quiz)
        });
        const data = await response.json();
        alert('Quiz created! Share code: ' + data.code);
    } catch (error) {
        console.error('Error creating quiz:', error);
    }

    quizForm.reset();
    questionsContainer.innerHTML = '';
    questionsContainer.appendChild(createQuestionElement(0));
});

document.addEventListener('DOMContentLoaded', () => {
    questionsContainer.appendChild(createQuestionElement(0));
});
