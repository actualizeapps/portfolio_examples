class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dotManager = new DotManager(this.canvas);
        this.counter = document.getElementById('counter');
        this.setupEventListeners();
        this.draw();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', () => {
            this.handleClick();
        });
    }
    
    handleClick() {
        this.dotManager.addDots(Math.max(1, this.dotManager.getCount()));
        this.draw();
        this.counter.textContent = `Dots: ${this.dotManager.getCount()}`;
    }
    
    draw() {
        this.clear();
        this.dotManager.drawDots();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotGame();
});