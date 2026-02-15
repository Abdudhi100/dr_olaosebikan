from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_register_view(self):
        response = self.client.get(reverse('account:register'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/register.html')

    def test_login_view(self):
        response = self.client.get(reverse('account:login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/login.html')

    def test_logout_view(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('account:logout'))
        self.assertRedirects(response, reverse('account:login'))

    def test_dashboard_view_requires_login(self):
        response = self.client.get(reverse('account:dashboard'))
        self.assertRedirects(response, f"{reverse('account:login')}?next={reverse('account:dashboard')}")

        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('account:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/dashboard.html')