# DFS - Frontend Agnóstico para Gestión de Paquetes

`dfs` (Distro-agnostic Frontend Script) es una herramienta de línea de comandos escrita en Node.js que proporciona una interfaz unificada y simplificada para gestionar paquetes del sistema, Flatpaks y Snaps a través de diferentes distribuciones de Linux.

Actúa como un envoltorio (wrapper) para gestores de paquetes nativos como DNF (Fedora), APT (Debian/Ubuntu) y Pacman (Arch Linux), permitiéndote usar los mismos comandos independientemente del sistema subyacente.

## ✨ Características

- **Comandos Unificados**: Usa `install`, `remove`, `update`, `search` y `list` para todos los gestores de paquetes.
- **Soporte Múltiple**: Gestiona paquetes de DNF, APT, Pacman, Flatpak y Snap.
- **Detección Automática**: Identifica automáticamente el gestor de paquetes nativo del sistema.
- **Salida Clara**: Muestra la información en tablas limpias y con colores para una fácil lectura.
- **Manejo de Permisos**: Verifica si se requieren permisos de superusuario (`sudo`) y lo solicita.

## 📋 Requisitos

- Node.js (v16.0.0 o superior)
- Permisos de `sudo` para operaciones a nivel de sistema.
- Uno o más de los siguientes gestores de paquetes instalados:
  - `dnf`
  - `apt`
  - `pacman`
  - `flatpak`
  - `snap`

## 🚀 Instalación

Para hacer que el comando `dfs` esté disponible globalmente en tu sistema, sigue estos pasos:

1.  **Clona el repositorio (si aún no lo has hecho):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd dfs
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Registra `dfs` como comando del sistema:**

    Opción A: enlazar el paquete localmente con npm
    ```bash
    sudo npm link
    ```

    Opción B: instalar el paquete globalmente desde la carpeta del proyecto
    ```bash
    sudo npm install -g .
    ```

    Cualquiera de estas opciones creará el comando `dfs` y permitirá ejecutarlo desde cualquier directorio.

## �️ Desinstalación

Si deseas quitar el comando `dfs` de tu sistema, usa uno de estos métodos según cómo lo instalaste:

- **Si lo instalaste con `npm link`:**
  ```bash
  cd dfs
  sudo npm unlink
  ```

- **Si lo instalaste con `npm install -g .`:**
  ```bash
  sudo npm uninstall -g script
  ```
  
- **Luego, para limpiar el enlace global que quedó registrado:`:**
  ```bash
  sudo npm unlink -g script
  ```

Esto eliminará el comando global `dfs` y dejará de estar disponible desde cualquier directorio.

## �💻 Uso

La sintaxis general del comando es:

```
dfs <comando> [paquetes...] [opciones]
```

### Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `update` | Actualiza los paquetes. |
| `install` | Instala uno o más paquetes. |
| `remove` | Elimina uno o más paquetes. |
| `search` | Busca paquetes disponibles. |
| `list` | Lista los paquetes instalados. |

### Opciones

Puedes combinar múltiples opciones para realizar acciones en diferentes sistemas de paquetería a la vez.

| Opción | Descripción |
| :--- | :--- |
| `-d` | Apunta al gestor de paquetes nativo del sistema (DNF, APT, Pacman). |
| `-f` | Apunta a Flatpak. |
| `-s` | Apunta a Snap. |

> **Nota Importante**: Los comandos `update`, `install` y `remove` que operan sobre el sistema (`-d`) requieren permisos de superusuario. El script te notificará si olvidas usar `sudo`.

## 💡 Ejemplos

- **Actualizar los paquetes del sistema y las aplicaciones Flatpak:**
  ```bash
  sudo dfs update -d 
  ```

- **Instalar `neovim` usando el gestor de paquetes del sistema:**
  ```bash
  sudo dfs install neovim -d
  ```

- **Buscar la aplicación `gimp` en Flathub:**
  ```bash
  dfs search gimp -f
  ```

- **Eliminar el paquete `spotify` instalado como Snap:**
  ```bash
  sudo dfs remove spotify -s
  ```

- **Listar todas las aplicaciones Flatpak instaladas:**
  ```bash
  dfs list -f
  ```

## 🧪 Desarrollo y Pruebas

El proyecto incluye configuraciones de `podman-compose` para facilitar las pruebas en contenedores que simulan diferentes distribuciones de Linux (Debian, Fedora, Arch Linux).

1.  Navega al directorio de la distribución que deseas probar (ej. `testing/fedora`).
2.  Inicia el contenedor en segundo plano: `podman-compose up -d`.
3.  Accede a la terminal del contenedor: `podman exec -it <nombre_del_contenedor> /bin/bash`. (ej. `fedora-prueba`).
4.  El código fuente del script está montado en `/home/script`. Puedes ejecutar y probar tus cambios desde allí.

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo `package.json` para más detalles.