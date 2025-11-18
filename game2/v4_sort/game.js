class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.stats = document.getElementById('stats');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cursor = "crosshair";
        this.databaseManager = new DatabaseManager();
        this.databaseManager.getLeaderboardFromServer();
        this.dotManager = new DotManager(this.canvas);
        this.multiplier = new MultiplierTarget(this.canvas);
        this.counter = document.getElementById('counter');
        this.gameDuration = 16000; 
        this.gameRunning = false;
        this.timer = new Timer(this.gameDuration, () => this.startGame(), () => this.endGame());

        this.canvas.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }

    startGame() {
        this.dotManager.resetDotsDataStructure();
        this.gameRunning = true;
        this.multiplier.create();
        this.updateCounter();
        this.draw();
    }
    
    endGame() {
        this.stats.innerHTML = this.dotManager.getStats() + this.stats.innerHTML;
        this.gameRunning = false;
        this.multiplier.clear();
        this.draw();

        setTimeout(() => {
            const name = prompt("Enter your name for the leaderboard:");
            if (name) {
              this.databaseManager.insertLeaderboardEntry(name, this.dotManager.getCount(), this.dotManager.getGamePlayType(), this.dotManager.getCollisionDetectionStrategy());
            }
          }, 500); // half a second

    }
    
    handleClick(event) {
        if (this.multiplier.isHit(event)) {
            const dotsToAdd = this.multiplier.handleHit(this.dotManager.getCount());
            this.dotManager.addDots(dotsToAdd);
            this.draw();
            this.updateCounter();
        }
    }
    updateCounter() {
        this.counter.textContent = `Dots: ${this.dotManager.getCount()}`;
    }
    
    draw() {
        this.clear();

        this.dotManager.drawDots();
        if (this.gameRunning) {
            this.multiplier.draw(this.ctx);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotGame();
});