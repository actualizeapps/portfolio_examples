class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.dotManager = new DotManager(this.canvas.width, this.canvas.height);
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
        this.renderer.clear();

        console.log(this.dotManager.getDots());
        this.renderer.drawDots(this.dotManager.getDots());
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotGame();
});