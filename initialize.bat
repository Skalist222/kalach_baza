@echo off

echo Создаём виртуальное окружение...
python -m venv .o

echo Активируем виртуальное окружение...
call .o\Scripts\activate

echo Устанавливаем зависимости...
python -m pip install --upgrade pip
pip install -r pip.txt

echo Запускаем сервер...
uvicorn server:app --host 0.0.0.0 --port 5555 --reload