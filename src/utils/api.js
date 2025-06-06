class APIManager {
  constructor() {
    this.baseURL = 'https://api.tenderfrozen.com'; // Replace with actual API
    this.timeout = 10000;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const authManager = window.authManager;
    const session = authManager.getSession();
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session.token}` : ''
      },
      timeout: this.timeout
    };

    const config = { ...defaultOptions, ...options };
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products API
  async getProducts() {
    // Mock data for demo
    return {
      success: true,
      data: [
        { id: 1, name: 'Frozen Chicken', price: 25.99, stock: 150, category: 'Meat' },
        { id: 2, name: 'Frozen Fish', price: 18.50, stock: 89, category: 'Seafood' },
        { id: 3, name: 'Frozen Vegetables', price: 12.99, stock: 200, category: 'Vegetables' },
        { id: 4, name: 'Ice Cream', price: 8.99, stock: 75, category: 'Dessert' }
      ]
    };
  }

  // Orders API
  async getOrders() {
    // Mock data for demo
    return {
      success: true,
      data: [
        { id: 1001, customer: 'Ahmed Ali', total: 125.50, status: 'completed', date: '2024-01-15' },
        { id: 1002, customer: 'Sara Mohamed', total: 89.99, status: 'pending', date: '2024-01-15' },
        { id: 1003, customer: 'Omar Hassan', total: 156.75, status: 'processing', date: '2024-01-14' }
      ]
    };
  }

  // Sales API
  async getSalesData() {
    // Mock data for demo
    return {
      success: true,
      data: {
        daily: [120, 150, 180, 200, 175, 220, 190],
        monthly: [3500, 4200, 3800, 4500, 5100, 4800, 5200],
        categories: {
          'Meat': 35,
          'Seafood': 25,
          'Vegetables': 20,
          'Dessert': 20
        }
      }
    };
  }
}

export default new APIManager();