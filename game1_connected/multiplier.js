class MultiplierTarget {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.target = null;
        this.radius = 25;
        this.color = '#FF4444';
    }
    
    create() {
        this.target = {
            x: Math.random() * (this.canvasWidth - 60) + 30,
            y: Math.random() * (this.canvasHeight - 60) + 30,
            radius: this.radius,
            color: this.color
        };
        return this.target;
    }
    
    clear() {
        this.target = null;
    }
    
    isHit(event) {
        if (!this.target) return false;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const distance = Math.sqrt(
            Math.pow(clickX - this.target.x, 2) + 
            Math.pow(clickY - this.target.y, 2)
        );
        
        return distance <= this.target.radius;
    }
    
    getTarget() {
        return this.target;
    }
    
    handleHit(currentCircleCount) {
        // Determine how many circles to add
        const circlesToAdd = currentCircleCount === 0 ? 1 : currentCircleCount;
        
        // Create a new X2 target in a random location
        this.create();
        
        return circlesToAdd;
    }
    
    draw(ctx) {
        if (!this.target) return;
        
        // Draw the circle
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, this.target.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.target.color;
        ctx.fill();
        
        // Draw the "X2" text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X2', this.target.x, this.target.y);
    }
}

