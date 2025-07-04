@echo off
start /min "Frontend" cmd /c "cd /d Z:\WebPrueba\sat-web-totem\frontend && npm run dev"
start /min "Backend" cmd /c "cd /d Z:\WebPrueba\sat-web-totem\backend && npm start"
exit
