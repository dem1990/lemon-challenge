# Lemon-challenge
### [Consigna](https://thorn-paperback-665.notion.site/L2-Coding-Challenge-f55f26875e1c4871b528f07e109c0e52)

## Solución
La solución dispone de un solo endpoint.
* GET /api/v1/message

Es requerido enviar el id del usuario en el header `userId`

### Instalación del proyecto
* Correr el comando `npm i` para instalar las dependencias
* Setear las variables de entorno el el archivo `.env`
* Iniciar el proyecto en docker con el comando `npm run docker`
* Para correr los tests de integración se debe correr el comando `npm run docker-test`

### Ejemplo de archivo .env
```
NODE_ENV=release
PORT=3001
SERVICE_URL=http://foaas.com
DB_NAME=lemon
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=public
POSTGRES_PORT=5432
TTL_MS=10000
LIMIT_MSG=5
```
Todas las variables de entorno son requeridas para el correcto funcionamiento de la solución.

## Ejemplo de requests
Request
```
curl --location --request GET 'localhost:3001/api/v1/message' \
--header 'userId: 6fa3e641-a330-4ba5-a97f-966538737060'
```
Response
```
{
    "userId": "6fa3e641-a330-4ba5-a97f-966538737060",
    "text": "Fuck off, Tom.",
    "ts": 1644213887855,
    "id": "0eb7bb95-99a2-48da-95be-06270a3a892e"
}
```