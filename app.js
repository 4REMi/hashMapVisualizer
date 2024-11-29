class HashMap {
    constructor(loadFactor = 0.75, initialCapacity = 8) {
      this.loadFactor = loadFactor;
      this.capacity = initialCapacity;
      this.size = 0;
      this.buckets = Array.from({ length: initialCapacity }, () => []);
    }
  
    // Hash function
    _hash(key) {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash + key.charCodeAt(i) * i) % this.capacity;
      }
      return hash;
    }
  
    // Insert a key-value pair
    insert(name, age) {
      const index = this._hash(name);
      const bucket = this.buckets[index];
      const existing = bucket.find(([k]) => k === name);
  
      if (existing) {
        existing[1] = age; // Update value if key exists
      } else {
        bucket.push([name, age]);
        this.size++;
      }
  
      if (this.size / this.capacity > this.loadFactor) {
        this._resize();
      }
    }
  
    // Search for a value by key
    search(name) {
      const index = this._hash(name);
      const bucket = this.buckets[index];
      const entry = bucket.find(([k]) => k === name);
      return entry ? { index, entry } : null;
    }
  
    // Delete a key-value pair
    delete(name) {
      const index = this._hash(name);
      const bucket = this.buckets[index];
      const entryIndex = bucket.findIndex(([k]) => k === name);
  
      if (entryIndex !== -1) {
        bucket.splice(entryIndex, 1);
        this.size--;
        return true;
      }
      return false;
    }
  
    // Reset the hashmap
    reset() {
      this.size = 0;
      this.buckets = Array.from({ length: this.capacity }, () => []);
    }
  
    // Resize and rehash the hashmap
    _resize() {
      this.capacity *= 2;
      const oldBuckets = this.buckets;
      this.buckets = Array.from({ length: this.capacity }, () => []);
      this.size = 0;
  
      oldBuckets.forEach(bucket => {
        bucket.forEach(([key, value]) => {
          this.insert(key, value);
        });
      });
    }
  }
  
  // DOM Interaction
  const hashMap = new HashMap();
  const bucketsContainer = document.getElementById('buckets');
  const formSection = document.getElementById('form-section');
  
  // Helper function to clear and update buckets
  function updateVisualizer() {
    bucketsContainer.innerHTML = ''; // Clear buckets
    hashMap.buckets.forEach((bucket, index) => {
      const bucketDiv = document.createElement('div');
      bucketDiv.className = 'bucket';
      bucketDiv.id = `bucket-${index}`;
  
      bucket.forEach(([name]) => {
        const bucketItem = document.createElement('div');
        bucketItem.className = 'bucket-item';
        
        // Extract initials (first and last name initials)
        const [firstName, lastName] = name.split(' ');
        const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
        bucketItem.textContent = initials; // Display initials
  
        bucketDiv.appendChild(bucketItem);
      });
  
      bucketsContainer.appendChild(bucketDiv);
    });
  }
  
  
  document.getElementById('insert-btn').addEventListener('click', () => {
    formSection.innerHTML = `
      <div class="form-group">
        <label for="name">Type a name and surname</label>
        <input type="text" id="name" placeholder="John Smith">
        <label for="age">Type out their age</label>
        <input type="number" id="age" placeholder="Age">
        <button id="insert-submit" class="submit-btn insert-btn">Throw into the MAP.</button>
      </div>
    `;
    document.getElementById('insert-submit').addEventListener('click', () => {
      const name = document.getElementById('name').value;
      const age = parseInt(document.getElementById('age').value, 10);
  
      if (name && age) {
        hashMap.insert(name, age);
        updateVisualizer();
      }
    });
  });
  
  document.getElementById('delete-btn').addEventListener('click', () => {
    formSection.innerHTML = `
      <div class="form-group">
        <label for="delete-name">Type out the name to delete</label>
        <input type="text" id="delete-name" placeholder="Name">
        <button id="delete-submit" class="submit-btn delete-btn">Delete</button>
      </div>
    `;
    document.getElementById('delete-submit').addEventListener('click', () => {
      const name = document.getElementById('delete-name').value;
  
      if (name) {
        hashMap.delete(name);
        updateVisualizer();
      }
    });
  });
  
  document.getElementById('search-btn').addEventListener('click', () => {
    formSection.innerHTML = `
      <div class="form-group">
        <label for="search-name">Type out the name to search</label>
        <input type="text" id="search-name" placeholder="Name">
        <button id="search-submit" class="submit-btn search-btn">Search</button>
      </div>
    `;
    document.getElementById('search-submit').addEventListener('click', () => {
      const name = document.getElementById('search-name').value;
      const result = hashMap.search(name);
  
      if (result) {
        const bucketDiv = document.getElementById(`bucket-${result.index}`);
        bucketDiv.style.border = '2px solid yellow'; // Highlight bucket
      }
    });
  });
  
  document.getElementById('reset-btn').addEventListener('click', () => {
    formSection.innerHTML = `
      <div class="form-group">
        <button id="reset-confirm" class="submit-btn reset-btn">Confirm Reset</button>
      </div>
    `;
    document.getElementById('reset-confirm').addEventListener('click', () => {
      hashMap.reset();
      updateVisualizer();
    });
  });
  
  
  // Initialize the visualizer
  updateVisualizer();
  