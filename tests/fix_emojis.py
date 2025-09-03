#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def fix_emojis():
    """Reemplazar todos los emojis en scripts.js por texto simple"""
    
    # Leer el archivo
    with open('c:/DEV/UNI BCN/Frontend/scripts.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Reemplazar TODOS los emojis por texto simple usando regex más amplio
    # Buscar cualquier carácter Unicode que no sea ASCII básico
    content = re.sub(r'[^\x00-\x7F]+', 'DEBUG:', content)
    
    # Escribir el archivo corregido
    with open('c:/DEV/UNI BCN/Frontend/scripts.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("SUCCESS: Emojis reemplazados correctamente")

if __name__ == "__main__":
    fix_emojis()
