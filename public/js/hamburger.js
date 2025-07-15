document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const menuBox = document.querySelector('.menu-box');
  const overlay = document.querySelector('.overlay');
  
  menuBtn.addEventListener('click', () => {
    menuBox.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  overlay.addEventListener('click', () => {
    menuBox.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
});