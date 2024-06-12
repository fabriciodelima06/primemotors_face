@echo off
setlocal

REM Verifica se o Node.js está instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js nao esta instalado.
    echo Instalando o Node.js...

    REM Define a URL do instalador do Node.js
    set "NODE_URL=https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi"
    
    REM Baixa o instalador do Node.js
    powershell -Command "Invoke-WebRequest -Uri %NODE_URL% -OutFile nodejs.msi"
    
    REM Instala o Node.js
    msiexec /i nodejs.msi /quiet /norestart

    REM Remove o instalador do Node.js após a instalação
    del nodejs.msi

    REM Verifica novamente se o Node.js foi instalado com sucesso
    node -v >nul 2>&1
    IF %ERRORLEVEL% NEQ 0 (
        echo A instalacao do Node.js falhou. Por favor, instale-o manualmente.
        pause
        exit /b 1
    )

    echo Node.js instalado com sucesso.
) ELSE (
    echo Node.js ja esta instalado.
)

REM Verifica se a pasta node_modules existe
IF EXIST "node_modules" (
    echo Iniciando o Sistema de Postagem no facebook...
    npm run dev
) ELSE (
    echo A pasta node_modules nao existe.
    echo Instalando as dependencias...
    npm install

    echo Dependencias instaladas.
    echo Iniciando o Sistema de Postagem no facebook...
    npm run dev
)

pause