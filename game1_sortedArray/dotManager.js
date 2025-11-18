class DotManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        this.resetDotsDataStructure();
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    createDot() {
        const dot = {
            x: Math.random() * (this.canvas.width - 10) + 5,
            y: Math.random() * (this.canvas.height - 10) + 5,
            radius: 1,
            color: this.getRandomColor()
        };
        
        this.dots.addSorted(dot);
        return dot;
    }

    getStats() {
        return "<p style='font-weight: bold;'>Gameplay Stats:</p><div style='padding-left: 20px;'>Total Dots: " + this.dots.length + "<br>" + this.dots.getStats() + "</div>";
    }

    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
    }

    drawDotsSorted() {
        const spacing = this.canvas.width / (this.dots.length + 1); // +1 for padding        
        // Draw all circles from our dynamic array
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots.data[i];
            const x = spacing * (i + 1);
            this.drawDot({x: x, y: dot.y, radius: dot.radius, color: dot.color});
        }
    }
    
    drawDots() {
        for (let i = 0; i < this.dots.length; i++) {
            this.drawDot(this.dots.data[i]);
        }
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
    
    resetDotsDataStructure() {
        const dataStructure = document.getElementById('dataStructure').value;
        if (dataStructure.includes('dynamic-array-grow')) {
            this.dots = new DynamicArray(10, RESIZE_STRATEGY.GROW_BY_1, this.colors, (dot) => dot.color);
        } else if (dataStructure.includes('dynamic-array-double')) {
            this.dots = new DynamicArray(10, RESIZE_STRATEGY.DOUBLE, this.colors, (dot) => dot.color);
        }
    }
}

