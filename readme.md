# Week 7 Challenge 5 - Full-web

Crear una red social donde los usuarios logeados pueden ver un listado de todos los usuarios. Los usuarios pueden ser amigos o enemigos entre sí. Todos tendrán un perfil que podrán ver los demás y ellos editar.

En el listado debe usuarios se debe poder filtrar por todos, sólo amigos y sólo enemigos.

## Backend

Desarrollar con Express una API que consuma datos de una DB en MongoDB. La autenticación de usuarios se hará utilizando JWT.

### Extra

Creación de un log con todas las relaciones que se almacenará en un archivo de texto en el servidor. Este log registrará las creaciones o eliminaciones de relaciones entre usuarios
La red social consumirá los datos de una API desarrollada con Express, conectada a una base de datos en MongoDB. La validación de usuario se implementará mediante JWT.

## Tareas

- [x] Permitir registro de usuarios
- [x] Permitir login de usuarios
- [x] Permitir lectura de listado de usuarios
- [x] Permitir creación de relación de amistad entre usuarios
- [x] Permitir creación de relación de enemistad entre usuarios

- [x] Creación de log de relaciones

## Dudas

- Cómo utilizar jest.spyOn para comprobar que debug ha sido llamado.
