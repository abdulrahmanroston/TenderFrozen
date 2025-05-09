// Navigation configuration
const navConfig = {
  pages: [
    { id: 'orders', name: 'Orders', icon: 'fas fa-shopping-cart', url: 'https://abdulrahmanroston.github.io/TenderFrozen', relativePath: '' },
    { id: 'products', name: 'Products', icon: 'fas fa-box', url: 'https://abdulrahmanroston.github.io/TenderFrozen/products.html', relativePath: 'products.html' },
    { id: 'pos', name: 'POS', icon: 'fas fa-cash-register', url: 'https://abdulrahmanroston.github.io/TenderFrozen/pos.html', relativePath: 'pos.html' },
  ],
  menuTitle: 'Frozen Dashboard',
};

// Function to get the relative path segment after /TenderFrozen/
function getRelativePath() {
  let path = window.location.pathname;
  path = path.replace(/^\/+|\/+$/g, '');
  const basePath = 'TenderFrozen';
  if (path === basePath || path === '') {
    return '';
  }
  if (path.startsWith(basePath + '/')) {
    return path.substring(basePath.length + 1);
  }
  console.warn(`Unexpected path structure: ${path}`);
  return '';
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// Function to create the navigation
function createNavigation() {
  // Check if the navigation container already exists
  let container = document.getElementById('tf-navigation');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tf-navigation';
    document.body.appendChild(container);
  }
  
  // Clear the container to avoid duplication
  container.innerHTML = '';
  
  const fab = document.createElement('div');
  fab.className = 'tf-nav-fab';
  fab.id = 'tf-nav-fab';
  fab.innerHTML = '<i class="fas fa-bars"></i>';
  
  const modal = document.createElement('div');
  modal.className = 'tf-nav-modal';
  modal.id = 'tf-nav-modal';
  
  const menu = document.createElement('div');
  menu.className = 'tf-nav-menu';
  
  const title = document.createElement('h2');
  title.textContent = navConfig.menuTitle;
  menu.appendChild(title);
  
  const ul = document.createElement('ul');
  ul.className = 'tf-nav-list';
  const currentRelativePath = getRelativePath();
  console.log('Current relative path:', currentRelativePath);
  navConfig.pages.forEach(page => {
    const li = document.createElement('li');
    li.className = 'tf-nav-item';
    li.setAttribute('data-page', page.id);
    li.innerHTML = `<i class="${page.icon}"></i> ${page.name}`;
    
    console.log(`Comparing: currentRelativePath=${currentRelativePath} with page.relativePath=${page.relativePath}`);
    if (currentRelativePath === page.relativePath) {
      li.classList.add('active');
    }
    
    li.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToPage(page.id, page.relativePath);
    });
    ul.appendChild(li);
  });
  menu.appendChild(ul);
  
  modal.appendChild(menu);
  container.appendChild(fab);
  container.appendChild(modal);
  
  // Check if toast container exists, if not create it
  let toast = document.getElementById('tf-nav-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'tf-nav-toast';
    toast.id = 'tf-nav-toast';
    document.body.appendChild(toast);
  }
  
  fab.addEventListener('click', () => {
    modal.classList.toggle('active');
    fab.classList.toggle('active');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      fab.classList.remove('active');
    }
  });
}

// Function to navigate to a page
function navigateToPage(pageId, relativePath) {
  const currentRelativePath = getRelativePath();
  const page = navConfig.pages.find(p => p.id === pageId);
  if (!page) return;
  
  console.log(`Navigating: currentRelativePath=${currentRelativePath}, targetRelativePath=${relativePath}`);
  if (currentRelativePath === relativePath) {
    showToast('You are already on this page', 'error', 'fas fa-exclamation-circle');
    return;
  }
  
  showToast(`Navigating to ${page.name}`, 'success', 'fas fa-check-circle');
  
  // Navigate to the page within the app
  window.location.href = page.url;
  
  // Close the navigation menu
  const modal = document.getElementById('tf-nav-modal');
  const fab = document.getElementById('tf-nav-fab');
  if (modal && fab) {
    modal.classList.remove('active');
    fab.classList.remove('active');
  }
}

// Function to show toast notification
function showToast(message, type, iconClass) {
  const toast = document.getElementById('tf-nav-toast');
  if (!toast) return; // If toast doesn't exist, skip
  
  toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
  toast.className = `tf-nav-toast ${type}`;
  toast.style.display = 'flex';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
  createNavigation();
});