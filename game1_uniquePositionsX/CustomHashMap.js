class CustomHashMap {
    constructor(initialSize = 50) {
        this.buckets = new DynamicArray(initialSize);
        // Initialize all buckets to null
        for (let i = 0; i < initialSize; i++) {
            this.buckets.add(null);
        }
        this.size = 0;
        this.bucketCount = initialSize;
        this.loadFactor = 0.75; // Resize when 75% full
        this.getChecks = 0;
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

    // Set a key-value pair in the map
    set(key, value) {
        // Resize if load factor exceeded
        if (this.size >= this.bucketCount * this.loadFactor) {
            this._resize();
        }

        const index = this.hash(key);
        
        // Initialize bucket with LinkedList if empty
        if (!this.buckets.data[index]) {
            this.buckets.data[index] = new LinkedList();
        }
        
        // Check if key already exists and update it
        let current = this.buckets.data[index].head;
        while (current) {
            if (current.data.key === key) {
                current.data.value = value;
                return; // Updated existing key
            }
            current = current.next;
        }
        
        // Key doesn't exist, add new key-value pair
        this.buckets.data[index].add({ key, value });
        this.size++;
    }

    // Get value by key - O(1) average case
    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets.data[index];
        this.getChecks++;
        
        if (!bucket) {
            return null;
        }
        
        // Search through the linked list
        let current = bucket.head;
        while (current) {
            if (current.data.key === key) {
                return current.data.value;
            }
            current = current.next;
        }
        return null;
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

        // Rehash all key-value pairs from old buckets
        for (let i = 0; i < oldBucketCount; i++) {
            const bucket = oldBuckets.data[i];
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    this.set(current.data.key, current.data.value);
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

    getBigOInfo() {
        return "'set' time: O(1), space: O(1)<br>'get' time: O(1), space: O(1)";
    }

    getStats() {
        let filledBuckets = 0;
        let maxChainLength = 0;
        
        for (let i = 0; i < this.bucketCount; i++) {
            const bucket = this.buckets.data[i];
            if (bucket && bucket.length > 0) {
                filledBuckets++;
                maxChainLength = Math.max(maxChainLength, bucket.length);
            }
        }
        const emptyBuckets = this.bucketCount - filledBuckets;

        return "Custom HashMap<br>Checks If Exists: "+this.getChecks+"<br>Bucket Count: "+this.bucketCount+"<br>Empty Buckets: "+emptyBuckets+"<br>MaxChainLength: "+maxChainLength+"<br>"+this.getBigOInfo();
    }

}
