from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from tasks.models import Task

class TaskCreationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')

    def test_create_task(self):
        self.client.force_authenticate(user=self.user)

        data = {
            'title': 'Tarea de prueba',
            'description': 'Probando creacion de tarea',
            'due_date': '2025-06-30',
            'status': 'pending',
            'priority': 'low'
        }

        response = self.client.post('/api/tasks/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().title, 'Tarea de prueba')
