const wraper = document.querySelector('.wraper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');

registerLink.addEventListener('click', () => {
    wraper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wraper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wraper.classList.add('active-popup');
});
