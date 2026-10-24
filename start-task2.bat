@echo off
echo ===================================================
echo  Starting Task 2: ShopSphere E-Commerce Backend
echo  Port: 3001 | Database: shopsphere_db
echo ===================================================
cd /d "%~dp0Task-2-Ecommerce-Kotlin\backend"
npm run start:dev
pause
