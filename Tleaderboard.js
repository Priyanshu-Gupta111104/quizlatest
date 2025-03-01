async function updateLeaderboard() {
    try {
        const resultsRes = await fetch('http://localhost:5500/api/leaderboard');
        const results = await resultsRes.json();

        const quizRes = await fetch('http://localhost:5500/api/quizzes');
        const quizzes = await quizRes.json();

        // Update quiz select dropdown
        const quizSelect = document.getElementById('quiz-select');
        quizSelect.innerHTML = `
            <option value="all">All Quizzes</option>
            ${quizzes.map(quiz => `<option value="${quiz._id}">${quiz.title}</option>`).join('')}
        `;

        // Function to display leaderboard
        function displayResults() {
            const selectedQuizId = quizSelect.value;
            const filteredResults = selectedQuizId === 'all'
                ? results
                : results.filter(r => r.quizId === selectedQuizId);

            const sortedResults = filteredResults.sort((a, b) => b.score - a.score);

            document.getElementById('leaderboard-body').innerHTML = sortedResults.map((result, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${result.name}</td>
                    <td>${result.quizTitle}</td>
                    <td>${result.score}%</td>
                    <td>${new Date(result.date).toLocaleString()}</td>
                </tr>
            `).join('');
        }

        // Update results when a quiz is selected
        quizSelect.addEventListener('change', displayResults);

        // Initial display
        displayResults();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateLeaderboard);
