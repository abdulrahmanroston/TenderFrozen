class HeaderComponent {
  constructor() {
    this.authManager = window.authManager;
  }

  render() {
    const user = this.authManager.getCurrentUser();
    if (!user) return '';

    return `
      <header class="tf-header">
        <div class="tf-header-content">
          <div class="tf-header-left">
            <h1 class="tf-header-title">
              <i class="fas fa-snowflake"></i>
              TenderFrozen Dashboard
            </h1>
          </div>
          <div class="tf-header-right">
            <div class="tf-user-info">
              <div class="tf-user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="tf-user-details">
                <span class="tf-user-name">${user.name}</span>
                <span class="tf-user-role">${user.role}</span>
              </div>
              <button class="tf-logout-btn" onclick="authManager.logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  init() {
    const headerContainer = document.getElementById('tf-header-container');
    if (headerContainer) {
      headerContainer.innerHTML = this.render();
    }
  }
}

export default HeaderComponent;