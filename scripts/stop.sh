#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

PID_FILE="service.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "PID файл не найден. Сервис не запущен?"
    exit 1
fi

PID=$(cat "$PID_FILE")

# Проверка, что PID не пустой и процесс существует
if [ -z "$PID" ]; then
    echo "PID файл пуст."
    exit 1
fi

echo "Останавливаем процесс с PID=$PID..."

# Принудительное завершение (аналог taskkill /F)
kill -9 "$PID" 2>/dev/null

# Удаляем файл PID даже если процесса уже не было
rm -f "$PID_FILE"

echo "Сервис остановлен."