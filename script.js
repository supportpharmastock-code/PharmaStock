const header = document.querySelector('.header');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');

document.getElementById('year').textContent = new Date().getFullYear();

function updateHeader(){
  header.classList.toggle('scrolled', window.scrollY > 15);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.querySelectorAll('.download-link').forEach(link => {
  link.addEventListener('click', () => {
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Show a designed placeholder if the dashboard image is missing.
const dashboard = document.querySelector('.app-window > img');
if(dashboard){
  dashboard.addEventListener('error', () => {
    dashboard.style.display = 'none';
    const placeholder = dashboard.nextElementSibling;
    if(placeholder) placeholder.style.display = 'grid';
  });
}
