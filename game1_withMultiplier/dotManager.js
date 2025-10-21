class DotManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        this.dots = new DynamicArray();
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    createDot() {
        const dot = {
            x: Math.random() * (this.canvasWidth - 10) + 5,
            y: Math.random() * (this.canvasHeight - 10) + 5,
            radius: 1,
            color: this.getRandomColor()
        };
        
        this.dots.add(dot);
        return dot;
    }

    
    addDots(count) {
        for (let i = 0; i < count; i++) {
            this.createDot();
        }
    }
    
    getDots() {
        return this.dots;
    }
    
    getCount() {
        return this.dots.length;
    }
    
    clear() {
        this.dots = new DynamicArray();
    }
}

