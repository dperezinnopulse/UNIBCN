#!/bin/bash
# Script para instalar dependencias de Python para leer Excel

echo "Instalando dependencias de Python..."

# Instalar pip si no está disponible
if ! command -v pip3 &> /dev/null; then
    echo "Instalando pip3..."
    sudo apt update
    sudo apt install -y python3-pip
fi

# Instalar pandas y openpyxl
echo "Instalando pandas y openpyxl..."
pip3 install pandas openpyxl

echo "Dependencias instaladas correctamente"



