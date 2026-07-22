# Usar una imagen base de Fedora con systemd dentro del contenedor
FROM jrei/systemd-fedora:44

# Actualizar el sistema e instalar Node.js, npm, Flatpak y snapd
RUN dnf -y update && \
    dnf -y install nodejs npm flatpak snapd --setopt=install_weak_deps=False && \
    dnf clean all

# Directorio de trabajo dentro del contenedor
RUN mkdir -p /home/script
WORKDIR /home/script
