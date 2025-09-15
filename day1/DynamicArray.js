class DynamicArray {
    constructor(capacity) {
        this.capacity = capacity;
        this.data = new Array(this.capacity);
        this.length = 0
    }

    add(element) { 
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            console.log("RESIZED")
            this.capacity += 1; // Grow by 1
            const newData = new Array(this.capacity);

            // Copy existing elements to new array
            for (let i = 0; i < this.length; i++) {
                newData[i] = this.data[i];
            }
            this.data = newData;
        }
        
        this.data[this.length] = element;
        this.length+=1;
    }

    print() {
        var result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.data[i] + ', '
        }

        return result;
    }
}