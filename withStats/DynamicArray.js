class DynamicArray {
    constructor(capacity) {
        this.capacity = capacity;
        this.data = new Array(this.capacity);
        this.length = 0
        this.countResize = 0;
        this.totalAddTime = 0;
        this.addCount = 0;
    }

    getStats() {
        return `
        Total time: ${(this.totalAddTime/1000).toFixed(2)} seconds
        Items added: ${this.addCount}
        Wasted space: ${this.capacity - this.length}
        Number of Times Resized: ${this.countResize}
        `
    }

    add(element) {
        const startTime = performance.now();
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            this.countResize++;
            this.capacity += 1; // Grow by 1
            //this.capacity = this.capacity * 2; // Grow by double
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
        this.totalAddTime += timeItTook;
    }

    print() {
        var result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.data[i] + ', '
        }

        return result;
    }
}