document.addEventListener("DOMContentLoaded", async () => {
    const quizSelect = document.getElementById("quiz-select");
    const leaderboardBody = document.getElementById("leaderboard-body");

    try {
        // ✅ Fetch quizzes from MongoDB Atlas
        const quizzesResponse = await fetch("http://localhost:5500/api/quizzes");
        if (!quizzesResponse.ok) throw new Error("Failed to fetch quizzes");

        const quizzes = await quizzesResponse.json();

        // ✅ Populate quiz dropdown
        quizzes.forEach(quiz => {
            const option = document.createElement("option");
            option.value = quiz.quizCode;
            option.textContent = quiz.title;
            quizSelect.appendChild(option);
        });

        // ✅ Fetch leaderboard data
        await fetchLeaderboard();

        // ✅ Update leaderboard on quiz selection
        quizSelect.addEventListener("change", fetchLeaderboard);
    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
    }
});

// ✅ Function to fetch leaderboard from MongoDB Atlas
async function fetchLeaderboard() {
    const quizCode = document.getElementById("quiz-select").value;
    const leaderboardBody = document.getElementById("leaderboard-body");

    try {
        let url = "http://localhost:5500/api/leaderboard";
        if (quizCode !== "all") url += `/${quizCode}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const leaderboard = await response.json();

        // ✅ Populate leaderboard table
        leaderboardBody.innerHTML = "";
        leaderboard.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.userName}</td>
                <td>${entry.quizTitle}</td>
                <td>${entry.score}</td>
                <td>${entry.timeTaken} mins</td>
            `;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
    }
}
