# Асинхронная обработка HTTP-запросов с использованием Node.js и RabbitMQ

Этот проект демонстрирует механизм асинхронной обработки HTTP-запросов с использованием Node.js и RabbitMQ. Он состоит из двух микросервисов: M1 и M2. M1 принимает входящие HTTP-запросы, преобразует их в задачи и отправляет задачи в RabbitMQ. M2 потребляет задачи из RabbitMQ, обрабатывает их и отправляет результаты обратно в другую очередь. Наконец, M1 потребляет результаты из очереди и возвращает их в качестве ответов на исходные HTTP-запросы.

## Требования

- Node.js: v16.x или выше
- RabbitMQ
- Docker

## Установка

1. Установите локальные зависимости для микросервисов:

```
cd client
npm install

cd ../server
npm install
```

2. Настройте Docker:

    - Установите docker для использования docker-compose
    - Запустите в консоли ``` docker-compose up```

## Использование

1. Запустите микросервис M2:

```
cd client
node .
```

2. Запустите микросервис M1:

```
cd ../server
node .
```

3. Микросервисы запущены. Вы можете отправлять HTTP-запросы к микросервису M1 для выполнения асинхронных задач.

## Эндпоинты

### POST /solvemath

Отправляет математическую задачу микросервису M1 для асинхронной обработки.

**Тело запроса:**

```
{
  "digit": 10
}
```

- digit (число): Число, для которого необходимо рассчитать числа Фибоначчи.

**Ответ:**

Ответ представляет собой JSON-объект с рассчитанным результатом.

```
{
  "result": 55
}
```

## Логирование

Оба микросервиса содержат инструкции логирования для упрощения процесса отладки и мониторинга. Логи можно просматривать в консоли при запуске микросервисов.