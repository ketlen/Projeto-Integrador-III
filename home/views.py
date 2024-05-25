from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as dajngo_logout


def homepage(request):
    return render(request, 'home.html')



def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            django_login(request, user)
            return HttpResponseRedirect('/')
        else:
            context = {
                'erro': True
            }
            return render(request, 'login.html', context)
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect('/')
        return render(request, 'login.html')


def logout(request):
    dajngo_logout(request)
    return HttpResponseRedirect('/')
