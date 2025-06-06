class StorageManager {
  constructor() {
    this.prefix = 'tf_';
  }

  // Set item with expiration
  setItem(key, value, expirationHours = 24) {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiration: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  // Get item with expiration check
  getItem(key) {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiration) {
        this.removeItem(key);
        return null;
      }
      return item.value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  // Remove item
  removeItem(key) {
    localStorage.removeItem(this.prefix + key);
  }

  // Clear all app data
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get storage usage
  getStorageInfo() {
    let totalSize = 0;
    let itemCount = 0;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        totalSize += localStorage.getItem(key).length;
        itemCount++;
      }
    });

    return {
      itemCount,
      totalSize: (totalSize / 1024).toFixed(2) + ' KB'
    };
  }
}

export default new StorageManager();