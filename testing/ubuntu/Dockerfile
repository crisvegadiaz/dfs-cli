FROM jrei/systemd-ubuntu:26.04

# Evita que apt-get haga preguntas interactivas durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Actualizar, instalar dependencias y agregar el repositorio de Flatpak
RUN apt update && \
    apt install -y --no-install-recommends \
        nodejs \
        npm \
        flatpak \
        snapd && \
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Directorio de trabajo dentro del contenedor
RUN mkdir -p /home/script
WORKDIR /home/script