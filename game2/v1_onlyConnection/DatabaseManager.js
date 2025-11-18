class DatabaseManager {
    //name | score | time | strategy
    constructor() {
        this.leaderboard = [];
        this.serverUrl = 'http://localhost/game/v1_onlyConnection/server'; 
    }

    async getLeaderboardFromServer() {
        try {
            const response = await fetch(`${this.serverUrl}/get_leaderboard.php`);
            if (response.ok) {
                const data = await response.text();
                console.log(data);
            }
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }

}