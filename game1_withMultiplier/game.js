class DotGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.dotManager = new DotManager(this.canvas.width, this.canvas.height);
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
        this.renderer.clear();

        console.log(this.dotManager.getDots());
        this.renderer.drawDots(this.dotManager.getDots());
        this.multiplier.draw(this.renderer.getContext());
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotGame();
});