export const showNotification = (message) => {
  if (typeof document !== 'undefined') {
    const bar = document.getElementById('notification-bar');
    if (bar) {
      bar.innerText = message;
      bar.classList.add('show');
      setTimeout(() => { bar.classList.remove('show'); }, 3500);
    }
  }
};
