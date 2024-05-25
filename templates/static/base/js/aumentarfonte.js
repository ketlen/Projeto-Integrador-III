const aumentarBotao = document.getElementById('aumentar');
const diminuirBotao = document.getElementById('diminuir');

aumentarBotao.addEventListener('click', function() {
    const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (currentFontSize < 24) {
    document.documentElement.style.fontSize = (currentFontSize + 4) + 'px';
    }
});

diminuirBotao.addEventListener('click', function() {
    const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (currentFontSize > 16) {
    document.documentElement.style.fontSize = (currentFontSize - 4) + 'px';
    }
});