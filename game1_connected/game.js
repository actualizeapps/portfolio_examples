class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dotManager = new DotManager(this.canvas);
        this.multiplier = new MultiplierTarget(this.canvas);
        this.counter = document.getElementById('counter');
        this.gameDuration = 12000; 
        this.gameRunning = false;
        this.timer = new Timer(this.gameDuration, () => this.startGame(), () => this.endGame());

        this.canvas.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }

    startGame() {
        this.dotManager.clear();
        this.gameRunning = true;
        this.multiplier.create();
        this.updateCounter();
        this.draw();
    }
    
    endGame() {
        this.gameRunning = false;
        this.multiplier.clear();
        this.draw();
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