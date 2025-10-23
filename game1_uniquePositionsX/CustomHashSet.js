class CustomHashSet {
    constructor(initialSize = 50) {
        this.buckets = new DynamicArray(initialSize);
        // Initialize all buckets to null
        for (let i = 0; i < initialSize; i++) {
            this.buckets.add(null);
        }
        this.size = 0;
        this.bucketCount = initialSize;
        this.loadFactor = 0.75; // Resize when 75% full
    }

    // Simple hash function for strings and numbers
    hash(key) {
        let hash = 0;
        const str = String(key);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % this.bucketCount;
    }

    // Add an element to the set
    add(element) {
        if (this.has(element)) {
            return false; // Already exists
        }

        // Resize if load factor exceeded
        if (this.size >= this.bucketCount * this.loadFactor) {
            this._resize();
        }

        const index = this.hash(element);
        
        // Initialize bucket with LinkedList if empty
        if (!this.buckets.data[index]) {
            this.buckets.data[index] = new LinkedList();
        }
        
        this.buckets.data[index].add(element);
        this.size++;
        return true;
    }

    // Check if element exists - O(1) average case
    has(element) {
        const index = this.hash(element);
        const bucket = this.buckets.data[index];
        
        if (!bucket) {
            return false;
        }
        
        // Search through the linked list
        let current = bucket.head;
        while (current) {
            if (current.data === element) {
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    // Resize the hash table when load factor is exceeded
    _resize() {
        const oldBuckets = this.buckets;
        const oldBucketCount = this.bucketCount;
        
        this.bucketCount *= 2;
        this.buckets = new DynamicArray(this.bucketCount);
        
        // Initialize all new buckets to null
        for (let i = 0; i < this.bucketCount; i++) {
            this.buckets.add(null);
        }
        
        this.size = 0;

        // Rehash all elements from old buckets
        for (let i = 0; i < oldBucketCount; i++) {
            const bucket = oldBuckets.data[i];
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    this.add(current.data);
                    current = current.next;
                }
            }
        }
    }

    // Get current size
    getSize() {
        return this.size;
    }

    // Clear all elements
    clear() {
        this.buckets = new DynamicArray(this.bucketCount);
        for (let i = 0; i < this.bucketCount; i++) {
            this.buckets.add(null);
        }
        this.size = 0;
    }

    // Debug method to see bucket distribution
    getBucketStats() {
        let filledBuckets = 0;
        let maxChainLength = 0;
        
        for (let i = 0; i < this.bucketCount; i++) {
            const bucket = this.buckets.data[i];
            if (bucket && bucket.length > 0) {
                filledBuckets++;
                maxChainLength = Math.max(maxChainLength, bucket.length);
            }
        }
        
        return {
            filledBuckets,
            totalBuckets: this.bucketCount,
            loadFactor: this.size / this.bucketCount,
            maxChainLength
        };
    }
}
