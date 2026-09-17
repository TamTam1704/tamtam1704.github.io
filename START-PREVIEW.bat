@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 preview_server.py
  goto end
)
where python >nul 2>nul
if not errorlevel 1 (
  python preview_server.py
  goto end
)
echo Python 3 was not found. You can still double-click index.html to view the site.
echo To run the optional local server, install Python 3 and try this file again.
:end
pause
