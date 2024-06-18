# Foros de Discusión con Cassandra

Este proyecto es una implementación de un sistema de foros de discusión utilizando Node.js y Cassandra como base de datos. La aplicación incluye funcionalidades para crear usuarios, foros, temas y mensajes, así como para obtener mensajes recientes en un tema.

## Requisitos

- Docker
- Node.js

## Instalación

1. Clonar el repositorio: `https://github.com/FrancaBruzzone/ForosDeDiscusion.git`
2. Instalar dependencias: `npm install`
3. Asegúrate de tener Docker instalado en tu sistema.

## Ejecutar la aplicación

Ejecutar el siguiente comando:

```
docker-compose up --build
```

El servidor estará disponible en `http://localhost:3001`

## Uso

Se puede usar Postman o cualquier otra herramienta para interactuar con la API. A continuación se detallan los endpoints disponibles:

### Crear Usuario

```
POST /users
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

### Crear Foro

```
POST /forums
{
  "forumName": "General Discussion",
  "createdBy": "user_id"
}
```

### Crear Tema

```
POST /topics
{
  "forumId": "forum_id",
  "topicTitle": "Welcome to the forum!",
  "createdBy": "user_id"
}
```

### Publicar Mensaje

```
POST /messages
{
  "topicId": "topic_id",
  "userId": "user_id",
  "content": "Hola a todos! Bienvenidos al nuevo foro."
}
```

### Obtener mensajes recientes

```
GET /messages/:topicId

Parámetros de consulta:
limit: Número de mensajes a obtener (opcional, por defecto 10).
```
