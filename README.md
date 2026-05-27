# MAZE App
<p align=center>
    <img  src="./frontend/public/imgs/app_logo.ico">
</p>

<p align=center>
    <img src="https://img.shields.io/badge/Grado-Desarrollo_Aplicaciones_Web_(DAW)-blue">
    <br/>
    <img src="https://img.shields.io/badge/Backend-Python-yellow?logo=python">
    <img src="https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi">
    <img src="https://img.shields.io/badge/Backend-MongoDB-black?logo=mongodb">
    <img src="https://img.shields.io/badge/Backend-Cloudinary-lightblue?logo=cloudinary">
    <br/>
    <img src="https://img.shields.io/badge/Frontend-React-purple?logo=react">
    <img src="https://img.shields.io/badge/Frontend-TailwindCSS-white?logo=tailwindcss">
    <img src="https://img.shields.io/badge/Frontend-FontAwesome-red?logo=fontawesome">
    <img src="https://img.shields.io/badge/Frontend-JavaScript-darkred?logo=javascript">
</p>

MAZE App es una aplicación web desarrollada como proyecto intermodular de final de Grado Superior de Desarrollo de Aplicaciones web. 

---

## 1. Acerca del proyecto

La aplicación se ha desarrollado con las siguientes tecnologías:

1. _Backend_:
   - **Python**: Lenguaje principal de programación del entorno servidor, a través del framework **FastAPI**.
   - **MongoDB**: Base de datos de la aplicación, utilizando el servicio en la nube de MongoDB Atlas.
   - **Cloudinary**:  Base de datos de elementos multimedia, a través de su servicio en la nube.

2. _Frontend_:
    - **React**: Framework de desarrollo en **Javascript** para el UI.
    - **TailwindCSS**: Framework de hojas de estilo CSS.
    - **FontAwesome**: Librería de iconos.

---

## 2. Ejecución

La aplicación se puede ejecutar de forma local considerando las siguientes anotaciones:

- Se requieren cuentas en los respectivos servicios en la nube como MongoDB o Cloudinary; en el caso de MongoDB, se puede utilizar de forma local a través de MongoDB Community Server.

- La aplicación utiliza variables de entorno para el almacenamiento de credenciales; fuese a utilizarse, debiérase renombrarse el archivo ".env.example" existente en la carpeta [backend](./backend) a ".env", introduciendo en ella las credenciales propias.

- Todas las dependencias utilizadas en el backend quedan especificadas en el archivo [requirements.md](./backend/requirements.md) del directorio [backend](./backend); estas deben ejecutarse en consola desde el directorio indicado.

- Todas las dependendias utilizadas en el frontend se pueden descargar utilizando el siguiente comando desde una terminal en el directorio [frontend](./frontend):
```
    npm install
```

- Los siguientes comandos deben ser ejecutados desde sus respectivos directorios para levantar los servicios:

    - directorio [frontend](./frontend); el servicio actúa en el **puerto 5173**:

    ```
        npm run dev
    ```

    - directorio [backend](./backend); el servicio actúa en el **puerto 8000**:

    ```
        uvicorn app:app --reload
    ```
