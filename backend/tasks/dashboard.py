from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from datetime import timedelta
from .models import Task
from collections import Counter


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_stats(request):
    """Cantidad de tareas por estado"""
    status_counts = Counter(Task.objects.values_list('status', flat=True))
    return Response(status_counts)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_completion_ratio(request):
    """Cantidad de tareas completadas vs no completadas"""
    total = Task.objects.count()
    completed = Task.objects.filter(status='completed').count()
    pending = total - completed
    return Response({
        'completed': completed,
        'pending': pending
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_tasks(request):
    """Tareas próximas a vencer (dentro de 7 días)"""
    today = now().date()
    upcoming = Task.objects.filter(
        due_date__gte=today,
        due_date__lte=today + timedelta(days=7)
    ).order_by('due_date')

    return Response([
        {
            'id': task.id,
            'title': task.title,
            'due_date': task.due_date,
            'status': task.status,
        }
        for task in upcoming
    ])
