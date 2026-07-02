@echo off
setlocal

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\distspache-maven-%MAVEN_VERSION%-bin
set MAVEN_BIN=%MAVEN_HOME%pache-maven-%MAVEN_VERSION%in\mvn.cmd

if not exist "%MAVEN_BIN%" (
    echo Downloading Maven %MAVEN_VERSION%...
    if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"
    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%MAVEN_HOME%\maven.zip'"
    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_HOME%\maven.zip' -DestinationPath '%MAVEN_HOME%' -Force"
    del "%MAVEN_HOME%\maven.zip"
)

echo Running Maven...
"%MAVEN_BIN%" %*
