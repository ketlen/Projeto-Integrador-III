const btnExpNav = document.querySelector('#btn-exp-nav');
const sideMenu = document.querySelector('.side-menu');

btnExpNav.addEventListener('click', function(){
    sideMenu.classList.toggle('hidden')
});