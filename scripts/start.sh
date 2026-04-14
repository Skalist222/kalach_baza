#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

VENV_DIR=".o"
PID_FILE="service.pid"
PORT=5555
HOST="0.0.0.0"

echo "Проверяем, запущен ли сервис..."

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")

    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Сервис уже запущен! PID=$PID"
        exit 1
    else
        echo "Найден старый PID, удаляем..."
        rm -f "$PID_FILE"
    fi
fi

echo "Запускаем сервер в фоне..."
"$VENV_DIR/bin/uvicorn" server:app --host "$HOST" --port "$PORT" &

PID=$!
echo "$PID" > "$PID_FILE"

echo "Сервер запущен. PID=$PID"