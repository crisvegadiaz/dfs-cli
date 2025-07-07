# Usar la imagen base oficial de Arch Linux.
FROM archlinux:latest

# Actualizar el sistema e instalar Node.js, npm.
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm nodejs npm && \
    pacman -Scc --noconfirm # Limpiar la caché de pacman para reducir el tamaño de la imagen

# Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /home/script