# 📋 Gestor de Tareas

Aplicación web para gestionar tareas personales. Permite a los usuarios registrarse, iniciar sesión y administrar tareas con estado y prioridad. Construido con **Django REST Framework** y **Vue 3 + Vuetify**.

---

## 🔧 Requisitos previos

Asegúrate de tener instalado lo siguiente:

- [Python 3.12+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalación

### 🖥 Backend (Django)

1. Abre una terminal en la carpeta `backend/`
2. Crea y activa un entorno virtual:

    python -m venv venv
    venv\Scripts\activate  # En Windows

3. Instala las dependencias:

    pip install -r requirements.txt

4. Ejecuta las migraciones:

    python manage.py migrate

### 🌐 Frontend (Vue 3 + Vuetify)

1. Abre una terminal en la carpeta `frontend/`
2. Instala las dependencias:

    npm install

## 🚀 Ejecución

### 🔁 Ejecutar Backend (Django)

1. Abre una terminal en la carpeta `backend/`
2. Ejecuta el comando:

    python manage.py runserver

El backend se ejecutará en http://127.0.0.1:8000

### 💻 Ejecutar Frontend (Vue)

1. Abre un terminal en la carpeta `frontend/`
2. Ejecuta el comando:

    npm run dev

El frontend se ejecutará en http://localhost:5173

## 🧪 Ejecutar tests (opcional)

1. Desde la carpeta `backend/`:

    python manage.py test


## 📌 Notas adicionales
Accede a la documentación Swagger en:
http://127.0.0.1:8000/swagger/

No olvidar que db.sqlite3 y venv/ están excluidos del repositorio (.gitignore)