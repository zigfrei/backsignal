# Backsignal: план и эксплуатация

Короткий живой документ. Обновлять после завершения этапов и важных изменений инфраструктуры.

## Статус

### 0. Фундамент — в работе

- [x] Neon создан, URL добавлены локально и в Vercel
- [x] Prisma 7.10 + Neon adapter настроены
- [x] Соединение с Neon проверено запросом
- [x] Мультитенантная схема создана
- [x] Первая миграция применена
- [x] DAL и проверки доступа созданы
- [x] `.env.example` добавлен
- [x] Постоянный домен QR: `https://backsignal.tech/q/{publicId}`
- [x] Neon разделён на ветки `production` и `stage`
- [x] Создан отдельный Vercel-проект для ветки `stage`
- [x] Перекрёстные Preview-сборки отключены

### 1. Интернационализация — завершено

- [x] Подключён `next-intl`
- [x] Добавлены локали `ru` и `en`
- [x] Строки лендинга и metadata перенесены в JSON-словари
- [x] Настроен locale routing: `/` для `ru`, `/en` для `en`
- [x] Добавлены типизированные locale-aware Link, router и pathname
- [x] Добавлен переключатель языка: desktop Popover и mobile Drawer на Base UI
- [x] Языковые предпочтения сохраняются через cookie `next-intl`

### 2. Авторизация

- Better Auth + Prisma
- Email + password и Yandex OAuth
- Регистрация, вход и выход
- Восстановление пароля и подтверждение email
- Объединение способов входа
- Защита кабинета
- Пользователь может состоять в нескольких организациях

### 3. Онбординг

- Создание организации и первого объекта
- Настройка публичного названия
- Создание первого QR-канала
- Получение ссылки и QR
- Экран успешного завершения

### 4. Публичная форма

- `/q/[publicId]`
- Название объекта и локализованная форма
- Защита от спама и rate limit
- Сохранение сообщения и экран благодарности
- Язык: cookie → язык объекта → язык браузера → `ru`

### 5. Кабинет

- Общий layout
- Переключатели организации и объекта
- «Сообщения» и «Настройки»
- Состояния загрузки, ошибок и пустого списка

### 6. QR-конструктор

- Обычный QR в SVG и PNG
- Брендированные шаблоны с названием объекта
- Предпросмотр и скачивание

### 7. Уведомления

- Почтовый адаптер
- Подтверждение регистрации и восстановление пароля
- Уведомления о сообщениях
- Очередь, повторная отправка и пользовательские настройки

### 8. PWA

- Manifest, service worker и offline fallback
- Установка и инструкции для iPhone
- Web Push и badge непрочитанных сообщений

### 9. Тарифы

- Подписка относится к организации
- Ограничения Free и entitlement-проверки
- Несколько организаций, объектов и QR
- Приглашение сотрудников
- Подключение оплаты позднее
- Платные лимиты проверяются бизнес-логикой, не схемой БД

### 10. VPS-деплой — после успешного запуска MVP

- Dockerfile и Next.js `output: 'standalone'`
- Production image в GitHub Container Registry
- GitHub Actions: build, push image, deploy по SSH
- Caddy/Nginx, HTTPS, healthcheck, restart и rollback
- Миграции `prisma migrate deploy` отдельным шагом деплоя
- Сначала можно оставить Neon; перенос PostgreSQL сделать отдельно

## Модель

```text
User ↔ Membership ↔ Organization
Organization → FeedbackTarget → FeedbackChannel → Message
Organization → Subscription
User → PushSubscription
```

- Один пользователь может создать несколько организаций.
- В организации несколько `FeedbackTarget`: кафе, филиалов, товаров или услуг.
- У объекта несколько QR-каналов; каждый имеет стабильный случайный `publicId`.

## Основные решения

- Next.js App Router, PostgreSQL/Neon, Prisma, Better Auth, Zod, `next-intl`.
- Чтение: Server Components через DAL. Изменения: Server Actions.
- Route Handlers: auth, публичные API, webhooks и интеграции.
- Проверять сессию, роль и принадлежность организации внутри каждой серверной операции.
- Не привязывать ядро к Vercel Blob/KV/Cron; файлы — через S3-совместимый адаптер.
- Секреты только в `.env`/Vercel; `.env` не коммитить.

## Команды

```bash
nvm use
pnpm install
pnpm dev
pnpm lint
pnpm build

pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm db:migrate:deploy
pnpm db:studio
```

Node `22.17.0`, pnpm `10.24.0`, Prisma `7.10.0` зафиксированы в проекте.

## Окружение

- `DATABASE_URL` — pooled Neon URL для runtime.
- `DIRECT_URL` — direct Neon URL для Prisma migrations.
- `APP_ENV` — `stage` или `production`; нужен, поскольку оба Vercel-проекта считают свой основной деплой Production.
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` локально, публичный URL соответствующего Vercel-проекта после деплоя.
- Локальная разработка использует Neon-ветку `stage`, а не `production`.

## Деплой

### Vercel

- `master` → Vercel `backsignal` → Neon `production` → `https://backsignal.tech`.
- `stage` → Vercel `backsignal-stage` → Neon `stage`.
- В каждом Vercel-проекте его рабочая Git-ветка назначена Production Branch.
- Production-переменные каждого проекта указывают только на соответствующую Neon-ветку.
- Не добавлять доступ к production-базе в Preview основного проекта.
- Из-за общего репозитория push в `stage` также запускает ненужный Preview в `backsignal`; отключить перекрёстные сборки через Ignored Build Step.
- Миграции: `pnpm db:migrate:deploy`; не использовать `db push` в production.
- Новые миграции сначала проверять на `stage`, затем применять к `production`.

### VPS

- Отложено до подтверждения жизнеспособности MVP; сейчас Docker не устанавливается.
- План: Docker + Next.js `output: 'standalone'` + image в GHCR + GitHub Actions + Caddy/Nginx.
- Сначала можно перенести приложение, оставив Neon; затем БД через `pg_dump`/`pg_restore`.
- Собственный домен сохраняет работоспособность напечатанных QR после смены хостинга.

## Журнал

- 2026-09-13: завершена интернационализация лендинга: `next-intl`, словари `ru/en`, locale routing, локализованные metadata и навигация, desktop/mobile переключатель языка на Base UI.
- 2026-09-12: восстановлен отдельный этап интернационализации перед авторизацией; этапы перенумерованы.
- 2026-09-12: проверено разделение stage/production; перекрёстные Preview-сборки отключены.
- 2026-09-12: созданы отдельные Neon/Vercel-окружения `stage` и `production`; зафиксирована необходимость отключить перекрёстные Preview-сборки.
- 2026-09-12: Docker и автоматический VPS-деплой вынесены из фундамента в отложенный этап после запуска MVP.
- 2026-09-12: создан DAL для организаций, объектов и сообщений с проверкой членства и ролей.
- 2026-09-12: создана и применена первая миграция `20260911213810_init` с мультитенантной доменной схемой.
- 2026-09-12: подключение к Neon подтверждено через Prisma (`SELECT 1`); VPN блокировал доступ к endpoint.
- 2026-09-12: зафиксированы Node 22.17, Prisma 7.10; добавлена конфигурация Neon/Prisma и env-шаблон.
