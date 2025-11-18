class LeaderboardEntry {
    constructor(name, score, time, gameType, dataStructure) {
        this.name = name;
        this.score = score;
        this.time = time;
        this.gameType = gameType;
        this.dataStructure = dataStructure;
    }
}

class DatabaseManager {
    //name | score | time | strategy
    constructor() {
        this.leaderboard = [];
        this.serverUrl = 'http://localhost/game/v6_racecondition/server';
    }

    displayLeaderboard() {
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = '';
        let lbContent = `
        <br>GLOBAL LEADERBOARD<br>
        <div style="display:flex; justify-content:center; margin-top:10px;">
            <table border="1" cellpadding="4">
            <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Time</th>
                <th>Game Type</th>
                <th>Data Structure</th>
            </tr>
            `;

            for (let i = 0; i < this.leaderboard.length; i++) {
            const entry = this.leaderboard[i];

            const date = new Date(Number(entry.time));
            const displayTime = date.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true
              });

            lbContent += `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${displayTime}</td> 
                <td>${entry.gameType}</td>
                <td>${entry.dataStructure}</td>
            </tr>
            `;
            }

            lbContent += `</table></div>`;
        leaderboardDiv.innerHTML = lbContent;
    }

    async getLeaderboardFromServer() {
        try {
            const response = await fetch(`${this.serverUrl}/get_leaderboard.php`);
            if (response.ok) {
                const data = await response.json();
                this.leaderboard = data.map(entry => new LeaderboardEntry(entry.name, entry.score, entry.time, entry.gameType, entry.dataStructure)) 
                this.displayLeaderboard();
            }
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }

    async insertLeaderboardEntry(name, score, gameType, dataStructure, shouldUpdateDisplay = true) {
        let time = new Date().getTime();
        try {
            const response = await fetch(`${this.serverUrl}/insert_leaderboard_entry.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `name=${name}&score=${score}&time=${time}&gameType=${gameType}&dataStructure=${dataStructure}`,
            });
            if (response.ok && shouldUpdateDisplay) {
                this.getLeaderboardFromServer();
            }
        } catch (error) {
            console.error('Failed to insert leaderboard entry:', error);
        }
    }

}