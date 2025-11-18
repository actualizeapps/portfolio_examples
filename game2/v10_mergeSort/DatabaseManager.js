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
        this.serverUrl = 'http://localhost/game/v10_mergeSort/server'; 
    }

    isLeaderboardAggregated() {
        return this.leaderboard.length > 0 
        && this.leaderboard[0].time === undefined 
        && this.leaderboard[0].strategy === undefined;
    }

    showLoadingForLeaderboardContent() {
        const leaderboardDiv = document.getElementById('leaderboard-content');
        leaderboardDiv.innerHTML = '<br><b>LOADING...</b>';
    }


    displayLeaderboard() {
        const leaderboardDiv = document.getElementById('leaderboard-content');
        let nonAggregatedColumns = "<th>Time</th><th>Game Type</th><th>Data Structure</th>";
        if (this.isLeaderboardAggregated()) {
            nonAggregatedColumns = "";
        }

        leaderboardDiv.innerHTML = '';
        let lbContent = `
        <div style="display:flex; justify-content:center; margin-top:10px;">
            <table border="1" cellpadding="4">
            <tr>
                <th>Name</th>
                <th>Score</th>
                ${nonAggregatedColumns}
            </tr>
            `;

            for (let i = 0; i < this.leaderboard.length; i++) {
            const entry = this.leaderboard[i];

            let nonAggregatedColumnsContent = "";
            if (this.isLeaderboardAggregated() === false) {
                const date = new Date(Number(entry.time));
                const displayTime = date.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                });
                nonAggregatedColumnsContent = `<td>${displayTime}</td> <td>${entry.gameType}</td> <td>${entry.dataStructure}</td>`;
            }

            lbContent += `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                ${nonAggregatedColumnsContent}
            </tr>
            `;

            }

        lbContent += `</table></div>`;
        leaderboardDiv.innerHTML = lbContent;
    }

    getEndDateStringFromTimeFilter() {
        let timeFilter = document.getElementById('time-filter')
        
        if (!timeFilter) return "";

        timeFilter = timeFilter.value.toLowerCase();
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        if (timeFilter.includes('today')) {
            return "endDate=" + d.getTime();
        } else if (timeFilter.includes('week')) {
            d.setDate(d.getDate() - 7);
            return "endDate=" + d.getTime();
        } else if (timeFilter.includes('month')) {
            d.setDate(d.getDate() - 30);
            return "endDate=" + d.getTime();
        }
        return "";
    }


    async getTopScoreFromLeaderboardServer() {
        try {
            const response = await fetch(`${this.serverUrl}/get_leaderboard.php`);
            if (response.ok) {
                const data = await response.json();
                const topScore = data[0]['score'];
                return topScore;
            }
        } catch (error) {
            console.error('Failed to load top score:', error);
        }
    }

    async getLeaderboardFromServer(shouldUpdateDisplay = true) {

        let endDateString = this.getEndDateStringFromTimeFilter();
        if (shouldUpdateDisplay) {
            this.showLoadingForLeaderboardContent();
        }

        try {
            let perf = performance.now();
            const response = await fetch(`${this.serverUrl}/get_leaderboard.php?${endDateString}`);
            if (response.ok) {
                console.log("Performance getLeaderboardFromServer time seconds:", ((performance.now() - perf) / 1000).toFixed(2) );
                const data = await response.json();
                this.leaderboard = data.map(entry => new LeaderboardEntry(entry.name, entry.score, entry.time, entry.gameType, entry.dataStructure)) 
                this.leaderboard = this.leaderboard.slice(0, 100);
                if (shouldUpdateDisplay) {
                    this.displayLeaderboard();
                }
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