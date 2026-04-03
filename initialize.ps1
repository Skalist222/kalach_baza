Write-Host "Создаём виртуальное окружение..."
python -m venv .o

Write-Host "Активируем виртуальное окружение..."
.o\Scripts\Activate.ps1

Write-Host "Устанавливаем зависимости..."
python -m pip install --upgrade pip
pip install -r pip.txt

Write-Host "Запускаем сервер..."
uvicorn server:app --host 0.0.0.0 --port 5555 --reload