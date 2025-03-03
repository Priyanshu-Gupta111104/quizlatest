document.addEventListener("DOMContentLoaded", async () => {
    const quizSelect = document.getElementById("quiz-select");
    const leaderboardBody = document.getElementById("leaderboard-body");

    const token = sessionStorage.getItem("token"); // ✅ Get JWT token

    if (!token) {
        alert("Unauthorized: Please log in first.");
        window.location.href = "login.html"; // ✅ Redirect to login page
        return;
    }

    try {
        // ✅ Fetch quizzes from MongoDB Atlas
        const quizzesResponse = await fetch("http://localhost:5500/api/quizzes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!quizzesResponse.ok) throw new Error("Failed to fetch quizzes");

        const quizzes = await quizzesResponse.json();

        // ✅ Populate quiz dropdown
        quizSelect.innerHTML = `<option value="all">All Quizzes</option>`;
        quizzes.forEach(quiz => {
            const option = document.createElement("option");
            option.value = quiz.quizCode;
            option.textContent = quiz.title;
            quizSelect.appendChild(option);
        });

        // ✅ Fetch leaderboard data for selected quiz
        await fetchLeaderboard();

        // ✅ Update leaderboard when a different quiz is selected
        quizSelect.addEventListener("change", fetchLeaderboard);
    } catch (error) {
        console.error("❌ Error loading quizzes:", error);
        alert("Error loading quizzes! Please try again.");
    }
});

// ✅ Function to fetch leaderboard from MongoDB Atlas
async function fetchLeaderboard() {
    const quizCode = document.getElementById("quiz-select").value;
    const leaderboardBody = document.getElementById("leaderboard-body");

    const token = sessionStorage.getItem("token"); // ✅ Get JWT token

    if (!token) {
        alert("Unauthorized: Please log in first.");
        window.location.href = "login.html";
        return;
    }

    try {
        let url = quizCode === "all"
            ? "http://localhost:5500/api/leaderboard"
            : `http://localhost:5500/api/leaderboard/${quizCode}`;

        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        console.log("🔹 Fetching leaderboard from:", url);
        console.log("🔹 Response Status:", response.status);

        if (!response.ok) {
            leaderboardBody.innerHTML = `<tr><td colspan="5">Leaderboard not found.</td></tr>`;
            return;
        }

        const leaderboard = await response.json();

        // ✅ Ensure leaderboard is sorted by score (descending)
        const sortedResults = leaderboard.sort((a, b) => b.score - a.score);

        leaderboardBody.innerHTML = sortedResults.length > 0
            ? sortedResults.map((entry, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.userName}</td>
                    <td>${entry.quizTitle}</td>
                    <td>${entry.score}%</td>
                    <td>${entry.timeTaken} mins</td>
                </tr>
            `).join('')
            : `<tr><td colspan="5">No leaderboard data available</td></tr>`;

    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        alert("Failed to load leaderboard!");
    }
}
