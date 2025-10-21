class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dotManager = new DotManager(this.canvas);
        this.multiplier = new MultiplierTarget(this.canvas);
        this.counter = document.getElementById('counter');
        this.setupEventListeners();
        this.multiplier.create();
        this.draw();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }
    
    handleClick(event) {
        if (this.multiplier.isHit(event)) {
            const dotsToAdd = this.multiplier.handleHit(this.dotManager.getCount());
            this.dotManager.addDots(dotsToAdd);
            this.draw();
            this.counter.textContent = `Dots: ${this.dotManager.getCount()}`;
        }
    }
    
    draw() {
        this.clear();
        this.dotManager.drawDots();
        this.multiplier.draw(this.ctx);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotGame();
});