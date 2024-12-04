# cocos-backend

Backend Developer Challenge

## Características

https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md

## Requisitos previos

1. **Herramientas necesarias**:
  - Node.js >= 18.20.1

## Instalación

Pasos para configurar el proyecto:

```bash
# Clonar el repositorio
git clone https://github.com/usuario/proyecto.git

# Entrar al directorio del proyecto
cd proyecto

# Instalar las dependencias
nvm i
npm install

# Agregar la URI de la DB en el archivo dentro de config (qa-cocos-arg.yaml) dependiendo del entorno de ejecucion:

db:
  uri: 'postgres://user:password@server:port/database'

# Para las Pruebas ejecutar:

npm run test

# Para la ejecucion en local:

npm run dev

# Para la ejecucion en prod:

npm run start
