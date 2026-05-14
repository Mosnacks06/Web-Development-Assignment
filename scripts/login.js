document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const remember = document.getElementById('rememberMe');
  const message = document.getElementById('formMessage');
  const togglePassword = document.getElementById('togglePassword');

  const showMessage = (text, isSuccess = false) => {
    message.textContent = text;
    message.classList.toggle('success', isSuccess);
  };

  togglePassword.addEventListener('click', () => {
    const isHidden = password.type === 'password';
    password.type = isHidden ? 'text' : 'password';
    togglePassword.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    togglePassword.innerHTML = `<i class="fa-solid ${isHidden ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue) return showMessage('Enter your email address');
    if (!emailValue.includes('@')) return showMessage('Enter a valid email address');
    if (!passwordValue) return showMessage('Enter your password');

    if (remember.checked) {
      localStorage.setItem('nova-login-email', emailValue);
    } else {
      localStorage.removeItem('nova-login-email');
    }

    showMessage('Login successful. Opening your account...', true);
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 700);
  });

  const savedEmail = localStorage.getItem('nova-login-email');
  if (savedEmail) {
    email.value = savedEmail;
    remember.checked = true;
  }
});
