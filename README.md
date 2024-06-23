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
GET /messages

Parámetros de consulta:
messageId: Identificador del mensaje
topicId: Identificador del tema
fromDate: Fecha de creación
userId: Identificador del usuario
limit: Número de mensajes a obtener (opcional, por defecto 10).

Ejemplo:
GET /messages?messageId=2bc1c34a-81af-4738-beaf-fa00b60d0a29&topicId=07eb4697-be73-46e0-9f8e-8c652c7dfa7c&fromDate=2024-06-23T00:00:00&userId=359355d8-c93f-497f-b4c6-7fb89c00d81a
```
