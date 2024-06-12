@echo off
setlocal

IF EXIST "node_modules" (
    echo Iniciando o Sistema de postagem no facebook...
    npm run dev
) ELSE (
    echo A pasta node_modules nao existe.
    echo Instalando as dependencias...
    npm install

    echo Dependencias instaladas.
    echo Iniciando o Sistema de postagem no facebook...
    npm run dev
)

pause