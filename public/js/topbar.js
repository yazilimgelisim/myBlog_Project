const topbar = document.getElementById('topbar')
const searchEngine = document.getElementById('searchEngine')


topbar.addEventListener('click', ()=>{
   searchEngine.classList.toggle('active')
})