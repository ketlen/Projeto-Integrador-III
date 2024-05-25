from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.db.models import Sum, F, FloatField
from gerenciamento.models import PostosColeta, Residuos
from django.contrib.auth.decorators import login_required
import json


@login_required(login_url='/login')
def mapa(request):
    return render(request, 'mapa.html')


@login_required(login_url='/login')
def getgeojson(request):
    if request.method == 'POST':
        postos = PostosColeta.objects.all()

        geojson_data = {
            "type": "FeatureCollection",
            "features": []
        }

        for posto in postos:
            total_residuos_a_recolher = Residuos.objects.filter(posto_fk=posto, foi_recolhido=False).aggregate(total=Sum(F('quantidade_kg'), output_field=FloatField()))['total'] or 0.0  # noqa
            total_residuos_a_recolher = round(total_residuos_a_recolher, 3)
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [posto.longitude, posto.latitude]
                },
                "properties": {
                    "id_posto": posto.id_posto,
                    "endereco_completo": posto.endereco_completo,
                    "nome_posto": posto.nome_posto,
                    "total_a_recolher": total_residuos_a_recolher
                }
            }
            geojson_data["features"].append(feature)

        return JsonResponse(geojson_data)
    else:
        return HttpResponseRedirect('/mapa/')


@login_required(login_url='/login')
def posto(request, id):
    if request.method == 'POST':
        idPosto = id
        posto = PostosColeta.objects.filter(id_posto=idPosto)
        residuosNoPosto = Residuos.objects.filter(posto_fk=idPosto, foi_recolhido=False)  # noqa
        context = {
            'posto': posto,
            'residuos': residuosNoPosto
        }
        return TemplateResponse(request, 'dialog_body.html', context)
    else:
        return HttpResponseRedirect('/mapa/')


@login_required(login_url='/login')
def publicar(request):
    if request.method == 'POST':
        id_posto = request.POST.get('id_posto')
        publicado_por = request.POST.get('publicado_por')
        quantidade_kg = request.POST.get('quantidade_kg')
        if not publicado_por or not quantidade_kg:
            if not publicado_por and quantidade_kg:
                return HttpResponse('<br><p id="form-response"><em>ERRO:</em> Escreva o nome de quem está publicando.</p>')
            elif publicado_por and not quantidade_kg:
                return HttpResponse('<br><p id="form-response"><em>ERRO:</em> Informe a quantidade do resíduo.</p>')
            return HttpResponse('<br><p id="form-response"><em>ERRO:</em> Preencha as informações de quem está publicando e a quantidade do resíduo.</p>')
        novo_residuo = Residuos()
        novo_residuo.quantidade_kg = quantidade_kg
        novo_residuo.publicado_por = publicado_por
        novo_residuo.posto_fk_id = id_posto
        novo_residuo.save()
        return HttpResponse('<br><p id="form-response">Resíduo gravado no banco de dados com sucesso.</p>')
    else:
        return HttpResponseRedirect('/mapa/')


@login_required(login_url='/login')
def coletar(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        for value in data:
            residuoSelecionado = Residuos.objects.get(id_residuo=value)
            residuoSelecionado.foi_recolhido = True
            residuoSelecionado.save()
        return JsonResponse({'message': 'Dados processados com sucesso'})
    else:
        return HttpResponseRedirect('/mapa/')


@login_required(login_url='/login')
def gettable(request, id):
    if request.method == 'POST':
        idPosto = id
        residuosNoPosto = Residuos.objects.filter(posto_fk=idPosto, foi_recolhido=False)  # noqa
        context = {
            'residuos': residuosNoPosto
        }
        return TemplateResponse(request, 'tabela_residuos.html', context)
    else:
        return HttpResponseRedirect('/mapa/')
