# Usar una imagen base oficial y estable de Fedora Linux.
FROM fedora:40

# Actualizar el sistema e instalar Node.js y npm.
RUN dnf -y update && \
    dnf -y install nodejs npm --setopt=install_weak_deps=False && \
    dnf clean all
    
# Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /home/script
