@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: ===== 基础配置 =====
set "APP_NAME=MySportApp"
set "VERSION=1.0"
set "ROOT_DIR=%~dp0.."  :: 假设脚本在build目录，项目根目录是上级

:: ===== 目录设置 =====
set "OUTPUT_DIR=%ROOT_DIR%\dist"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "LOG_FILE=%OUTPUT_DIR%\build.log"

:: ===== 初始化日志 =====
mkdir "%OUTPUT_DIR%" 2>nul
echo %DATE% %TIME% - 开始构建 > "%LOG_FILE%"

:: ===== 环境检查 =====
echo [1/5] 检查环境... >> "%LOG_FILE%"
where npm >nul 2>&1 || (
    echo [错误] 需要先安装Node.js >> "%LOG_FILE%"
    timeout /t 5
    exit /b
)

:: ===== 前端构建 =====
echo [2/5] 构建前端... >> "%LOG_FILE%"
pushd "%FRONTEND_DIR%"
call npm install >> "%LOG_FILE%" 2>&1 && (
    call npm run build >> "%LOG_FILE%" 2>&1 || (
        echo [错误] 前端构建失败 >> "%LOG_FILE%"
        popd
        timeout /t 5
        exit /b
    )
)
popd

:: ===== 后端构建 =====
echo [3/5] 构建后端... >> "%LOG_FILE%"
pushd "%BACKEND_DIR%"
call npm install >> "%LOG_FILE%" 2>&1 && (
    call npm run build >> "%LOG_FILE%" 2>&1 || (
        echo [错误] 后端构建失败 >> "%LOG_FILE%"
        popd
        timeout /t 5
        exit /b
    )
)

:: ===== 执行打包 =====
echo [4/5] 打包应用... >> "%LOG_FILE%"
pushd "%BACKEND_DIR%"

:: 双重验证文件存在
if not exist "dist\server.js" (
    echo [错误] 后端入口文件不存在 >> "%LOG_FILE%"
    echo 当前目录: %CD% >> "%LOG_FILE%"
    dir "dist" >> "%LOG_FILE%"
    popd
    pause
    exit /b
)

:: 使用绝对路径确保无误
set "INPUT_FILE=%BACKEND_DIR%\dist\server.js"
echo 正在打包: %INPUT_FILE% >> "%LOG_FILE%"

:: 三级回退策略
set "PKG_SUCCESS=0"
for %%t in ("host", "node18-win-x64", "node14-win-x64") do (
    if %PKG_SUCCESS% equ 0 (
        echo 尝试目标: %%~t >> "%LOG_FILE%"
        pkg "%INPUT_FILE%" -b --targets %%~t --output "%OUTPUT_DIR%\%APP_NAME%.exe" >> "%LOG_FILE%" 2>&1
        if exist "%OUTPUT_DIR%\%APP_NAME%.exe" set "PKG_SUCCESS=1"
    )
)

popd

:: ===== 生成启动脚本 =====
echo [5/5] 生成启动器... >> "%LOG_FILE%"
(
    echo @echo off
    echo start "" "%~dp0\%APP_NAME%.exe"
) > "%OUTPUT_DIR%\start.bat"

:: ===== 完成 =====
echo.
echo 构建成功！输出目录: %OUTPUT_DIR%
echo 按任意键打开目录...
pause >nul
start "" "%OUTPUT_DIR%"