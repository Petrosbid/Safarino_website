from django.contrib.auth import get_user_model
from django import forms



# class ContactUsForm(forms.Form):
#     fullName = forms.CharField(
#         widget=forms.TextInput(attrs={'class': 'form-control', 'maxlength': '20'})
#     )
#     email = forms.EmailField(
#         widget=forms.EmailInput(attrs={'class': 'form-control'})
#     )
#     message = forms.CharField(
#         widget=forms.Textarea(attrs={'class': 'form-control'})
#     )


class LoginForm(forms.Form):
    userName = forms.CharField(
        label='',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام کاربری'})
    )

    password = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'رمز عبور'})
    )

User = get_user_model()

class RegisterForm(forms.Form):
    userName = forms.CharField(
        label='',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام کاربری'})
    )

    email = forms.EmailField(
        label='',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ایمیل'})
    )

    password = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'رمز عبور'})
    )

    password2 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'تایید رمز عبور'})
    )

    def clean_userName(self):
        userName = self.cleaned_data.get('userName')
        query = User.objects.filter(username=userName)

        if query.exists():
            raise forms.ValidationError('نام کاربری قبلا ثبت شده است')
        return userName

    def clean_email(self):
        email = self.cleaned_data.get('email')
        query = User.objects.filter(email=email)

        if query.exists():
            raise forms.ValidationError('ایمیل قبلا ثبت شده است')
        return email

    def clean(self):
        data = self.cleaned_data
        password = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('password2')

        if password != password2:
            raise forms.ValidationError('پسوورد نادرست است')

        return data
