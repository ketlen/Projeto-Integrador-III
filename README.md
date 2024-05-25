# Projeto Integrador III

<div align="center" style="display: flex; align-items: center; justify-content: center;">

<img src="https://univesp.br/sites/527174b7b24a527adc000002/assets/590b74fa9caf4d3c61001001/Univesp_logo_png_rgb.png" width="250"/>
<img src="./templates/static/base/img/logo.png" width="300"/>

</div>

<p>Este é um projeto para a disciplina de Projeto Integrador 3 da <a href="https://univesp.br/">UNIVESP</a>.</p>
<p>O projeto consiste em uma plataforma para a empresa <a href="https://www.instagram.com/organe_se_sjc/">Organe-se</a> de São José dos Campos-SP.</p>
<p>A plataforma permite o gerenciamento de pontos de coleta de resíduos orgânicos, bem como o registro da coleta dos mesmos.</p>

## Como executar o projeto:

<ul>
<li>Clone o repositório.</li>
<li>Crie um ambiente virtual Python e ative-o.</li>
   1. >> py -m venv nome_do_ambiente
   2. >> nome_do_ambiente\Scripts\activate
<li>Instale as dependências.</li>
<li>Altere as chaves da API do Google Geocode.</li>
   https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com
<li>Altere os dados de login do banco de dados ou altere para SQLite.</li>
Configurar os dados da conexao com o banco em nuvem.
<li>Execute os comandos "python '.\manage.py' makemigrations" e "python '.\manage.py' migrate" do Django.</li>
<li>Por fim, execute com o comando "python '.\manage.py' runserver".</li>
</ul>

## Dependências:

<ul>
<li>>> pip install django</li>
<li>>> pip install geopy</li>
<li>>> pip install openpyxl</li>
<li>>> pip install pandas</li>
<li>>> pip install numpy</li>
<li>>> pip install mysqlclient</li>
</ul>
