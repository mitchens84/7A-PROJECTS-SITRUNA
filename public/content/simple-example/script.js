// content/simple-example/script.js
document.getElementById('btn').addEventListener('click', () => {
  const msgEl = document.getElementById('message');
  msgEl.textContent =
    msgEl.textContent === 'Hello, world!'
      ? 'You clicked the button!'
      : 'Hello, world!';
});
