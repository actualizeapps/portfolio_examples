class Timer {
    constructor(durationMs) {
        this.timerInterval = null;
        this.startTime = null;
        this.duration = durationMs;
        this.onEndCallback = null;
        this.displayElement = document.getElementById('timer');
        this.startButton = document.getElementById('startButton');
        this.updateDisplay();
        this.startButton.addEventListener('click', () => {
            this.start();
        });
    }
    
    start() {
        this.startTime = Date.now();
        this.hideStartButton();
        
        this.updateDisplay();
        
        this.timerInterval = setInterval(() => {
            this.updateDisplay();
            
            if (this.getTimeLeft() <= 0) {
                this.stop();
            }
        }, 100);
    }
    
    stop() {
        if (this.timerInterval) {
            this.showStartButton();
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    getTimeLeft() {
        if (!this.startTime) return this.duration / 1000;
        
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.duration - elapsed);
        return Math.ceil(remaining / 1000);
    }
    
    updateDisplay() {
        if (this.displayElement) {
            const timeLeft = this.getTimeLeft();
            this.displayElement.textContent = `Time Left: ${timeLeft}s`;
        }
    }

    showStartButton() {
        this.startButton.style.display = 'inline-block';
    }

    hideStartButton() {
        this.startButton.style.display = 'none';
    }

}