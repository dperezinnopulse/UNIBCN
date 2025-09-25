#!/bin/bash
echo "🔍 Leyendo Chromium..."
curl -s http://localhost:9226/json | head -10
echo ""
echo "📊 Estado de servicios:"
curl -s http://localhost:5001/api/auth/hash?pwd=test | head -3
echo ""
curl -s http://localhost:8080 | head -3
