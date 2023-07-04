# grupo-Grupo-108-backend

![Alt text](./Conquista_UML.jpg?raw=true "Title")

# ¡Precauciones antes de correr Localmente!

Para correr localmente primero hay que instalar y hacer el setup postgresql. 
Despues crear un .env con la siguiente info:

PORT = puerto
DB_USERNAME = nombre_de_usuario_base_de_datos_postgres
DB_PASSWORD = contraseña_base_de_datos_postgres
DB_NAME = conquista
DB_HOST = 'localhost'

despues hay que crear las bases de datos:

conquista_dev
conquista_test
conquista_production

por ultimo instalar dependencias y correr migraciones:

npm install
yarn sequelize-cli db:migrate

# Llamadas a la API

A continuacion aqui hay llamadas a la api
cabe destacar que u_id es id de usuario al que pertenece
g_id es id del juego al que pertenece
p_id id del jugador al que pertenece

POST http://localhost:8000/usuarios/signin

Body ejemplo:

{
    "nombre":"World",
    "mail": "World@test.com",
    "contrasena": "123456"
}

respuesta ejemplo:

{
    "id": 5,
    "nombre": "World",
    "mail": "World@test.com",
    "contrasena": "123456",
    "updatedAt": "2023-06-03T23:18:31.561Z",
    "createdAt": "2023-06-03T23:18:31.561Z"
}

POST http://localhost:8000/usuarios/login

Body ejemplo:

{
    "mail": "hello@test.com",
    "contrasena": "123456"
}

Respuesta ejemplo:

{
    "id": 3,
    "nombre": "Hello",
    "mail": "hello@test.com",
    "contrasena": "123456",
    "createdAt": "2023-06-03T23:12:50.231Z",
    "updatedAt": "2023-06-03T23:12:50.231Z"
}

POST http://localhost:3000/juegos/create

Body ejemplo:

{
    "codigo":"5555",
    "privado": true,
    "numero_de_jugadores": 4,
    "nombre": "testGame"
}

Respuesta ejemplo:

{
    "id": 9,
    "codigo": "5555",
    "turno": 0,
    "privado": true,
    "numero_de_jugadores": 4,
    "nombre": "testGame",
    "fase": "espera",
    "updatedAt": "2023-06-03T19:31:18.471Z",
    "createdAt": "2023-06-03T19:31:18.471Z"
}

POST http://localhost:8000/jugadors/joinGame

Body ejemplo:

{
    "codigo":"5555",
    "u_id": 5,
    "nombre": "test3"
}

Respuesta ejemplo:

{
    "id": 5,
    "u_id": 5,
    "g_id": 9,
    "nombre": "test3",
    "dinero": 500,
    "soldados": 0,
    "updatedAt": "2023-06-03T23:21:26.673Z",
    "createdAt": "2023-06-03T23:21:26.673Z"
}

POST http://localhost:8000/casillas/castillo

Body ejemplo:

{
    "p_id": 2,
    "g_id": 9,
    "posicion_eje_x":0,
    "posicion_eje_y":0
}

Respuesta ejemplo:

{
    "id": 3,
    "p_id": 2,
    "g_id": 9,
    "tipo": "castillo",
    "posicion_eje_x": 0,
    "posicion_eje_y": 0,
    "updatedAt": "2023-06-03T23:27:58.458Z",
    "createdAt": "2023-06-03T23:27:58.458Z"
}

Post http://localhost:8000/casillas/buy

Body ejemplo:

{
    "p_id": 2,
    "g_id": 9,
    "tipo": "pradera",
    "posicion_eje_x":1,
    "posicion_eje_y":0
}

Respuesta ejemplo:

{
    "id": 4,
    "p_id": 2,
    "g_id": 9,
    "tipo": "pradera",
    "posicion_eje_x": 1,
    "posicion_eje_y": 0,
    "updatedAt": "2023-06-03T23:34:53.719Z",
    "createdAt": "2023-06-03T23:34:53.719Z"
}

PUT http://localhost:8000/jugadors/buySoldiers

Body ejemplo:

{
    "id": 2,
    "cantidad": 1
}

Respuesta ejemplo:

{
    "id": 2,
    "u_id": 3,
    "g_id": 9,
    "nombre": "test1",
    "dinero": 250,
    "soldados": 1,
    "createdAt": "2023-06-03T23:20:34.475Z",
    "updatedAt": "2023-06-03T23:37:38.526Z"
}

PUT http://localhost:8000/jugadors/endTurn

Body ejemplo:

{
    "id": 2
}

Respuesta ejemplo:

{
    "id": 9,
    "codigo": "5555",
    "turno": 3,
    "privado": true,
    "numero_de_jugadores": 4,
    "nombre": "testGame",
    "fase": "inicio",
    "createdAt": "2023-06-03T19:31:18.471Z",
    "updatedAt": "2023-06-03T23:46:33.965Z"
}

PUT http://localhost:8000/casillas/conquistar

Body ejemplo:

{
    "id": 4,
    "idAtacante": 3
}

Respuesta de ejemplo:

{
    "id": 4,
    "p_id": 3,
    "g_id": 9,
    "tipo": "pradera",
    "posicion_eje_x": 1,
    "posicion_eje_y": 0,
    "createdAt": "2023-06-03T23:34:53.719Z",
    "updatedAt": "2023-06-03T23:53:08.825Z"
}

GET http://localhost:8000/juegos/status/:id

Id ejemplo: 9

Respuesta ejemplo:

{
    "id": 9,
    "codigo": "5555",
    "turno": 3,
    "privado": true,
    "numero_de_jugadores": 4,
    "nombre": "testGame",
    "fase": "inicio",
    "createdAt": "2023-06-03T19:31:18.471Z",
    "updatedAt": "2023-06-03T23:46:33.965Z"
}