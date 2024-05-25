// Função para obter um cookie pelo nome
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

// Função para atualizar o diálogo
function atualizarDialog() {
    const btnShowForm = document.getElementById('btn-show-form');
    const residuoFormContainer = document.querySelector('.form-residuo-container');

    btnShowForm.addEventListener('click', function () {
        residuoFormContainer.classList.add('active');
    });
}

// Função para atualizar a tabela
function atualizarTabela(id) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '<div style="width: 100%;height: fit-content;display: flex;justify-content: center;align-items: center;padding: 1.25rem;"><span class="loader" style="display: block;"></span><p style="font-weight: bold;padding-left:0.625rem;">Atualizando tabela...</p></div>';

    const url = `/mapa/getTable/${id}`;

    setTimeout(() => {
        fetch(url, {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin'
        })
            .then(response => response.text())
            .then(data => {
                tableContainer.innerHTML = data;
                markTableRows();
            })
            .catch(error => {
                tableContainer.innerHTML = 'Erro na solicitação.';
            });
    }, 1000);
}

// Função para atualizar o formulário
function atualizarFormulario() {
    const form = document.querySelector('.form-residuo');
    const responseContainer = document.querySelector('.form-response');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const id = formData.get('id_posto');
        const publicadoPor = formData.get('publicado_por');
        const quantidadeKg = formData.get('quantidade_kg');

        if (publicadoPor !== '' && quantidadeKg !== '') {
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    responseContainer.innerHTML = data;
                })
                .catch(error => {
                    responseContainer.innerHTML = 'Erro na solicitação.';
                });

            atualizarTabela(id);
        } else {
            responseContainer.innerHTML = '<br><p>Por favor, preencha os campos "Publicado por" e "Quantidade (Kg)".</p>';
        }
    });
}

// Função para exibir informações de um posto de resíduos
function postoResiduos(id) {
    const url = `/mapa/posto/${id}`;
    fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        data: 'same-origin'
    })
        .then(response => response.text())
        .then(data => {
            dialogBody.innerHTML = data;
        });
    dialog.showModal();
}

// Função para marcar/desmarcar linhas da tabela
function markTableRows() {
    const tableRow = document.querySelectorAll('.t-row');
    tableRow.forEach(row => {
        row.addEventListener('click', () => {
            row.classList.toggle('selected');
        });
    });
}

// Função para atualizar a coleta de resíduos
function atualizarRecolher() {
    document.querySelector('.btn-recoher').addEventListener('click', function () {
        const selectedRows = document.querySelectorAll('.t-row.selected');
        const valuesToSend = [];
        const meuBotaoId = document.querySelector('.btn-recoher').id;

        selectedRows.forEach(row => {
            const firstCell = row.querySelector('td:first-child');
            const cellValue = firstCell.textContent;
            valuesToSend.push(cellValue);
        });

        if (valuesToSend.length > 0) {
            fetch('/mapa/coletar', {
                method: 'POST',
                body: JSON.stringify(valuesToSend),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Dados enviados com sucesso.');
                    } else {
                        console.error('Erro ao enviar dados ao backend.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao enviar dados ao backend:', error);
                });
            atualizarTabela(meuBotaoId);
        } else {
            console.log('Nenhum dado selecionado para enviar.');
        }
    });
}

// Função para atualizar marcadores no mapa
function atualizarMarcadores() {
    fetch('getGeoJSON', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro na solicitação');
            }
        })
        .then(function (novoData) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            L.geoJSON(novoData, {
                pointToLayer: function (feature, latlng) {
                    var popupContent = `
                        <b>${feature.properties.nome_posto}</b><br>
                        ${feature.properties.endereco_completo}<br>
                        <b>Quantidade de resíduos a recolher:</b> ${feature.properties.total_a_recolher} Kg<br><br>
                        <b>Clique para mais detalhes!</b>
                    `;

                    var marker = L.marker(latlng, { icon: recycleIcon }).bindPopup(popupContent, {
                        maxWidth: 600,
                        offset: [-5, 40],
                        closeButton: false
                    });

                    marker.on('mouseover', function () {
                        this.openPopup();
                    });

                    marker.on('mouseout', function () {
                        this.closePopup();
                    });

                    marker.on('click', function () {
                        postoResiduos(feature.properties.id_posto);
                        setTimeout(() => {
                            atualizarDialog();
                            markTableRows();
                            atualizarFormulario();
                            atualizarRecolher();
                        }, 500);
                    });

                    return marker;
                }
            }).addTo(map);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// Constante para o token CSRF
const csrftoken = getCookie('csrftoken');

// Elementos do diálogo
const dialog = document.querySelector('dialog');
const dialogBtn = document.getElementById('dialog-btn');
const dialogBody = document.getElementById('dialog-body');
const residuoForm = document.querySelector('.form-residuo');

// Ícone para reciclagem
const recycleIcon = L.icon({
    iconUrl: '/static/mapa/img/recycle.svg',
    iconSize: [25, 43],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -76],
    shadowUrl: '/static/mapa/img/marker-shadow.png'
});

// Mapa Leaflet
const map = L.map('map', {
    maxZoom: 18,
    minZoom: 12,
    maxBounds: [
        //south west
        [-23.38267173019097, -45.567130688617944],
        //north east
        [-23.050520884822685, -46.22160582925989]
    ],
}).setView([-45.89630216400873, -23.19709799312104], 12);

map.panTo(new L.LatLng(-23.219836188746697, -45.8915696764562));

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
}).addTo(map);

// Evento para fechar o diálogo
dialogBtn.addEventListener('click', function () {
    dialog.close();
});

// Evento para atualizar marcadores ao fechar o diálogo
dialog.addEventListener('close', function () {
    atualizarMarcadores();
});

// Evento que é acionado quando o DOM é carregado
document.addEventListener('DOMContentLoaded', () => {
    atualizarMarcadores();
});