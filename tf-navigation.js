// Navigation configuration
const navConfig = {
  pages: [
    { id: 'orders', name: 'Orders', icon: 'fas fa-shopping-cart', url: 'https://abdulrahmanroston.github.io/TenderFrozen', relativePath: '' },
    { id: 'products', name: 'Products', icon: 'fas fa-box', url: 'https://abdulrahmanroston.github.io/TenderFrozen/products.html', relativePath: 'products.html' },
    { id: 'pos', name: 'POS', icon: 'fas fa-cash-register', url: 'https://abdulrahmanroston.github.io/TenderFrozen/pos.html', relativePath: 'pos.html' },
  ],
  menuTitle: ' Frozen Dashboard',
};

// Function to get the relative path segment after /TenderFrozen/
function getRelativePath() {
  let path = window.location.pathname;
  // Remove leading and trailing slashes
  path = path.replace(/^\/+|\/+$/g, '');
  // Remove the base path '/TenderFrozen'
  const basePath = 'TenderFrozen';
  if (path === basePath || path === '') {
    return ''; // Orders page
  }
  // Return the part after /TenderFrozen/
  if (path.startsWith(basePath + '/')) {
    return path.substring(basePath.length + 1);
  }
  // If path doesn't match expected structure, log warning and return empty
  console.warn(`Unexpected path structure: ${path}`);
  return '';
}

// Function to create the navigation
function createNavigation() {
  const container = document.getElementById('tf-navigation');
  if (!container) {
    console.warn('Navigation container (#tf-navigation) not found.');
    return;
  }
  
  // Create FAB (Floating Action Button)
  const fab = document.createElement('div');
  fab.className = 'tf-nav-fab';
  fab.id = 'tf-nav-fab';
  fab.innerHTML = '<i class="fas fa-bars"></i>';
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'tf-nav-modal';
  modal.id = 'tf-nav-modal';
  
  // Create menu
  const menu = document.createElement('div');
  menu.className = 'tf-nav-menu';
  
  // Add menu title
  const title = document.createElement('h2');
  title.textContent = navConfig.menuTitle;
  menu.appendChild(title);
  
  // Create menu items
  const ul = document.createElement('ul');
  ul.className = 'tf-nav-list';
  const currentRelativePath = getRelativePath();
  console.log('Current relative path:', currentRelativePath); // Debugging: Log the current relative path
  navConfig.pages.forEach(page => {
    const li = document.createElement('li');
    li.className = 'tf-nav-item';
    li.setAttribute('data-page', page.id);
    li.innerHTML = `<i class="${page.icon}"></i> ${page.name}`;
    
    // Check if current relative path matches the page's relativePath
    console.log(`Comparing: currentRelativePath=${currentRelativePath} with page.relativePath=${page.relativePath}`); // Debugging
    if (currentRelativePath === page.relativePath) {
      li.classList.add('active');
    }
    
    // Add click event for navigation
    li.addEventListener('click', () => navigateToPage(page.id, page.url, page.relativePath));
    ul.appendChild(li);
  });
  menu.appendChild(ul);
  
  modal.appendChild(menu);
  container.appendChild(fab);
  container.appendChild(modal);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'tf-nav-toast';
  toast.id = 'tf-nav-toast';
  document.body.appendChild(toast);
  
  // Toggle menu on FAB click
  fab.addEventListener('click', () => {
    modal.classList.toggle('active');
    fab.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      fab.classList.remove('active');
    }
  });
}

// Function to navigate to a page
function navigateToPage(pageId, url, relativePath) {
  const currentRelativePath = getRelativePath();
  console.log(`Navigating: currentRelativePath=${currentRelativePath}, targetRelativePath=${relativePath}`); // Debugging
  if (currentRelativePath === relativePath) {
    showToast('You are already on this page', 'error', 'fas fa-exclamation-circle');
    return;
  }
  
  showToast(`Navigating to ${navConfig.pages.find(p => p.id === pageId).name}`, 'success', 'fas fa-check-circle');
  setTimeout(() => {
    window.location.href = url;
  }, 1000);
  
  // Close menu
  document.getElementById('tf-nav-modal').classList.remove('active');
  document.getElementById('tf-nav-fab').classList.remove('active');
}

// Function to show toast notification
function showToast(message, type, iconClass) {
  const toast = document.getElementById('tf-nav-toast');
  toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
  toast.className = `tf-nav-toast ${type}`;
  toast.style.display = 'flex';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Run on page load
document.addEventListener('DOMContentLoaded', createNavigation);