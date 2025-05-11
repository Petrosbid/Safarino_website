from django.contrib.auth import authenticate, login , get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render , redirect

from Safarino.forms import LoginForm, RegisterForm


def home_page(request):
    context = {
        'message': 'Hi, welcome to my project'
    }
    return render(request, 'home_page.html', context)

def user_dashboard(request):
    context = {}
    return render(request , "user_dashbord.html" , context)

def auth(request):
    global notfound
    notfound = ""
    login_form = LoginForm(request.POST or None)
    register_form = RegisterForm(request.POST or None)
    user_register = get_user_model()

    if request.method == "POST":
        if 'action' in request.POST:
            if request.POST['action'] == 'login_btn':
                if login_form.is_valid():
                    username = login_form.cleaned_data.get('userName')
                    password = login_form.cleaned_data.get('password')
                    user = authenticate(request, username=username, password=password)
                    if user is not None:
                        login(request, user)
                        return redirect('/dashboard')
                    else:
                        notfound = "کاربر یافت نشد.\n نام کاربری یا رمز عبور اشتباه"
            elif request.POST['action'] == 'register':
                if register_form.is_valid():
                    username = register_form.cleaned_data.get('userName')
                    email = register_form.cleaned_data.get('email')
                    password = register_form.cleaned_data.get('password')
                    user_register.objects.create_user(username=username, email=email, password=password)
                    user = authenticate(request, username=username, password=password)
                    if user is not None:
                        login(request, user)
                        return redirect('/dashboard')

    context = {
        'login_form': login_form,
        'register_form': register_form,
        'notfound' : notfound
    }
    return render(request, "login.html", context)
