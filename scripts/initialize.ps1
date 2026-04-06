cd ..

Write-Host "Создаём виртуальное окружение..."
python -m venv .o

Write-Host "Активируем виртуальное окружение..."
.o\Scripts\Activate.ps1

Write-Host "Устанавливаем зависимости..."
python -m pip install --upgrade pip
pip install -r pip.txt

alembic init -t async alembic

Write-Host "Инициализация завершена"
