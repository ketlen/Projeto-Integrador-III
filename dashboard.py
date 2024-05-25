import streamlit as st ## construir os dashboards
import pandas as pd ## manipulação de dados no python, ler arquivos e tratar
import plotly.express as px ## construir os gráficos

st.set_page_config(layout="wide")

df = pd.read_excel("Dados.xlsx")
##df["Data"] = pd.to_datetime(["Data"])
##df = df.sort_values(["Data"])

df["Month"] = df["Data"].apply(lambda x: str(x.year) + "-" + str(x.month))
month = st.sidebar.selectbox("Mes", df["Month"].unique())

df_filtered = df[df["Month"] == month]

col1, col2 = st.columns(2)
col3, col4 = st.columns(2)

##fig_coleta = px.bar(df_filtered, x="Posto_coleta", y="Qtde_residuos", title="Quantidade resíduos por cliente", color="Bairro_coleta")
##col1.plotly_chart(fig_coleta, use_container_width=True)

fig_data = px.pie(df_filtered, values="Qtde_residuos", names="Posto_coleta", title="Quantidade de resíduos por cliente")
col1.plotly_chart(fig_data, use_container_width=True)

fig_bairro = px.bar(df_filtered, x="Tipo_estabelecimento", y="Qtde_residuos", title="Quantidade resíduos por tipo de estabelecimento", color="Bairro_coleta")
col2.plotly_chart(fig_bairro, use_container_width=True)

city_total = df_filtered.groupby("Responsavel")[["Qtde_residuos"]].sum().reset_index()
fig_operador = px.bar(city_total, x="Responsavel", y="Qtde_residuos", title="Quantidade resíduos coletados por responsável")
col3.plotly_chart(fig_operador, use_container_width=True)

fig_coleta = px.bar(df_filtered, x="Bairro_coleta", y="Qtde_residuos", title="Quantidade resíduos por bairro", color="Data")
col4.plotly_chart(fig_coleta, use_container_width=True)

##fig_data = px.pie(df_filtered, values="Qtde_residuos", names="Bairro_coleta", title="Percentual de resíduos por bairro")
##col4.plotly_chart(fig_data, use_container_width=True)



##fig_bairro = px.bar(df_filtered, x="Tipo_estabelecimento", y="Qtde_residuos", title="Quantidade resíduos por tipo de estabelecimento")
##col1.plotly_chart(fig_bairro)