// main.js - application logic for authentication, TOC, and content loading
document.addEventListener('DOMContentLoaded', () => {
  const correctPassword = 'password123';

  const passwordPrompt = document.getElementById('password-prompt');
  const passwordInput = document.getElementById('password-input');
  const passwordSubmit = document.getElementById('password-submit');
  const passwordError = document.getElementById('password-error');
  const appContainer = document.getElementById('app-container');
  const tocToggle = document.getElementById('toc-toggle-button');
  const tocSidebar = document.getElementById('toc-sidebar');
  const tocList = document.getElementById('toc-list');
  const contentArea = document.getElementById('content-area');
  const contentFrame = document.getElementById('content-frame');

  // Authentication check
  function showApp() {
    passwordPrompt.style.display = 'none';
    appContainer.style.display = 'block';
    initTOC();
  }

  function authenticate() {
    if (sessionStorage.getItem('authenticated') === 'true') {
      showApp();
      return;
    }
    passwordSubmit.addEventListener('click', () => {
      const val = passwordInput.value;
      if (val === correctPassword) {
        sessionStorage.setItem('authenticated', 'true');
        showApp();
      } else {
        passwordError.style.display = 'block';
      }
    });
  }

  // Initialize TOC from manifest
  function initTOC() {
    fetch('content-manifest.json')
      .then(res => res.json())
      .then(items => {
        items.forEach(item => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.textContent = item.title;
          a.href = '#';
          a.dataset.path = item.path;
          a.addEventListener('click', e => {
            e.preventDefault();
            loadContent(item.path);
          });
          li.appendChild(a);
          tocList.appendChild(li);
        });
      })
      .catch(err => console.error('Failed to load content manifest', err));
  }

  // Load content into iframe
  function loadContent(path) {
    contentFrame.src = path;
  }

  // TOC toggle logic
  function toggleTOC() {
    if (tocSidebar.classList.contains('expanded')) {
      tocSidebar.classList.remove('expanded');
      tocSidebar.classList.toggle('collapsed', !tocSidebar.classList.contains('collapsed'));
      contentArea.classList.remove('shifted');
    } else {
      tocSidebar.classList.remove('collapsed');
      tocSidebar.classList.add('expanded');
      contentArea.classList.add('shifted');
    }
  }
  tocToggle.addEventListener('click', toggleTOC);

  // Start authentication flow
  authenticate();
});
