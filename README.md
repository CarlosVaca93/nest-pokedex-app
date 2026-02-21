<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar archivo .env.template y renombrar la copia a .env

6. Llenar las variables

7. Ejecutar el proyecto
```
yarn start:dev
```

8. Ejecutar Seed
```
localhost:3000/api/v2/seed
```

# Production Build
1. Crear el archivo .env.prod
2. LLenar variables
3. Crear imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```