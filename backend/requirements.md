## 1. Creación del entorno virtual

Se debe crear un entorno virtual en Python para el funcionamiento correcto de la aplicación; para ello, se debe ejecutar el siguiente comando en una terminal desde el directorio:
```
    python -m venv venv
```

---

## 2. Descarga de dependencias

Se requieren las siguientes dependencias para ejecutar el entorno virtual de Python:

1. Instalación del framework FastAPI:

```
    pip install fastapi[standard]
```

2. Instalación de la librería de conexión al servicio Cloudinary:

```
    pip install cloudinary
```

3. Instalación de la librería de conexión a MongoDB: 

```
    pip install motor
```

4. Instalación de la librería de creación de Web Tokens JSON:

```
    pip install pyjwt
```
 
5. Instalación de la librería de encriptación para contraseñas:

```
    pip install bcrypt
```
 
 
6. Instalación de la librería de envío de correos:

```
    pip install fastapi-mail
```

7. Instalación certificados SSL
```
    pip install certifi
```

8. Autentificación de Google
```
    pip install google-auth
    pip install google-auth[requirements]
```