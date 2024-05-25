const accordionItems = document.querySelectorAll('.accordion-item');
const subaccordionItems = document.querySelectorAll('.sub-accordion-item');

accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');

    icon.addEventListener('click', () => {
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            icon.textContent = '-';
        } else {
            icon.textContent = '+';
        }
    });
});

subaccordionItems.forEach((item) => {
    const header = item.querySelector('.sub-accordion-header');
    const content = item.querySelector('.sub-accordion-content');
    const icon = item.querySelector('.sub-accordion-icon');

    icon.addEventListener('click', () => {
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            icon.textContent = '-';
        } else {
            icon.textContent = '+';
        }
    });
});


