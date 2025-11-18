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
        this.serverUrl = 'http://localhost/game/v2_inserts/server'; 
    }

    async getLeaderboardFromServer() {
        try {
            const response = await fetch(`${this.serverUrl}/get_leaderboard.php`);
            if (response.ok) {
                const data = await response.json();
                this.leaderboard = data.map(entry => new LeaderboardEntry(entry.name, entry.score, entry.time, entry.gameType, entry.dataStructure)) 
                console.log(this.leaderboard);
            }
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }

    async insertLeaderboardEntry(name, score, gameType, dataStructure) {
        let time = new Date().getTime();
        try {
            const response = await fetch(`${this.serverUrl}/insert_leaderboard_entry.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `name=${name}&score=${score}&time=${time}&gameType=${gameType}&dataStructure=${dataStructure}`,
            });
            if (response.ok) {
                const data = await response.text();
                console.log(data);
            }
        } catch (error) {
            console.error('Failed to insert leaderboard entry:', error);
        }
    }

}