from django.urls import path
from . import dashboard

urlpatterns = [
    path('dashboard/stats/', dashboard.task_stats, name='task_stats'),
    path('dashboard/completion/', dashboard.task_completion_ratio, name='task_completion_ratio'),
    path('dashboard/upcoming/', dashboard.upcoming_tasks, name='upcoming_tasks'),
]
