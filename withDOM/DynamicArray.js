//'Enum' in javascript:
const RESIZE_STRATEGY = Object.freeze({
  GROW_BY_1: 1,
  DOUBLE: 2,
});

class DynamicArray {
    constructor(capacity, resizeStrategy=RESIZE_STRATEGY.GROW_BY_1) {
        this.capacity = capacity;
        this.data = new Array(this.capacity);
        this.length = 0
        this.countResize = 0;
        this.averageAddTime = 0;
        this.addCount = 0;
        this.resizeStrategy = resizeStrategy
    }

    getStats() {
        return "Wasted space: "+(this.capacity - this.length)+"<br>Average add time: "+this.averageAddTime.toFixed(40)+"<br>Number of Times Resized: "+this.countResize;
    }

    add(element) {
        const startTime = performance.now();
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            this.countResize++;
            if (this.resizeStrategy == RESIZE_STRATEGY.GROW_BY_1) {
                this.capacity += 1; // Grow by 1
            } else if (this.resizeStrategy == RESIZE_STRATEGY.DOUBLE) {
                this.capacity = this.capacity * 2; // Grow by double
            }

            const newData = new Array(this.capacity);

            // Copy existing elements to new array
            for (let i = 0; i < this.length; i++) {
                newData[i] = this.data[i];
            }
            this.data = newData;
        }
        
        this.data[this.length] = element;
        this.length+=1;
        const timeItTook = performance.now() - startTime
        this.addCount++;
        this.averageAddTime = (this.averageAddTime + timeItTook) / this.addCount;
    }

    print() {
        var result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.data[i] + ', '
        }

        return result;
    }
}