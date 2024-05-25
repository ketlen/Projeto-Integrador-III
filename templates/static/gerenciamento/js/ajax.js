// Helper function to get the value of a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to mark table rows on click
function markTableRows() {
    var tableRow = document.querySelectorAll('.t-row');
    tableRow.forEach(row => {
        row.addEventListener('click', () => {
            row.classList.toggle('selecionado');
        });
    });
}

// Execute markTableRows function when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    markTableRows();
});

const csrftoken = getCookie('csrftoken');
const forms = document.querySelectorAll('.ajax-form');
const dialog = document.querySelector('dialog');
const dialogBody = document.getElementById('dialog-body');
const dialogTitle = document.getElementById('dialog-title');
const table = document.getElementById('postos-tabela');
const dialogBtn = document.getElementById('dialog-btn');
const downloadBtn = document.getElementById('download-btn');
const tabelaResiduos = document.getElementById('residuos-tabela');
const atualizarBtn = document.getElementById('atualizar-btn');
const limparBtn = document.getElementById('limpar-btn');

forms.forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            dialogTitle.innerHTML = form.id;
            dialogBody.innerHTML = data;
            dialog.showModal();
            table.innerHTML = '<div style="width: 100%;height: fit-content;display: flex;justify-content: center;align-items: center;padding: 1.25rem;"><span class="loader" style="display: block;"></span><p style="font-weight: bold;padding-left:0.625rem;">Atualizando tabela...</p></div>'

            setTimeout(() => {

                fetch('/gerenciamento/atualizar/2/', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.text())
                .then(data => {
                    table.innerHTML = data;
                    markTableRows();
                })
            }, 1000)
            
            .catch(error => {
                console.error('Erro ao realizar a segunda requisição:', error);
            });
        })
        .catch(error => {
            console.error('Erro ao enviar o formulário via Ajax:', error);
        });
    });
});

dialogBtn.addEventListener('click', function () {
    dialog.close();
});

downloadBtn.addEventListener('click', function () {
    fetch('/gerenciamento/download', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        mode: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            const contentDisposition = response.headers.get('content-disposition');
            const match = /filename="(.+)"/.exec(contentDisposition);
            const filename = match ? match[1] : 'Residuos.xlsx';

            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            });
        } else {
            console.error('Erro na solicitação');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

atualizarBtn.addEventListener('click', function () {
    fetch('/gerenciamento/atualizar/1/', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        mode: 'same-origin'
    })
    .then(response => response.text())
    .then(data => {
        tabelaResiduos.innerHTML = data;
        markTableRows();
    });
});

limparBtn.addEventListener('click', function () {
    fetch('/gerenciamento/excluir/2/', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        data: 'same-origin'
    })
    .then(response => response.text())
    .then(data => {
        tabelaResiduos.innerHTML = '<div style="width: 100%;height: fit-content;display: flex;justify-content: center;align-items: center;padding: 20px;"><span class="loader" style="display: block;"></span><p style="font-weight: bold;padding-left:10px;">Atualizando tabela...</p></div>'
        dialogBody.innerHTML = data;
        dialogTitle.innerHTML = "Limpar dados";
        dialog.showModal();
    })
    setTimeout(() => {
        fetch('/gerenciamento/atualizar/1/', {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin',
        })
        .then(response => response.text())
        .then(data => {
            tabelaResiduos.innerHTML = data;
            markTableRows();
    })
    }, 1000);
});
