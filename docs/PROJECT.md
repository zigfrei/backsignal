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

### 1. Авторизация

- Email + password, Yandex OAuth, выход, восстановление и подтверждение email
- Better Auth + Prisma; пользователь может состоять в нескольких организациях

### 2. Онбординг

- Регистрация → организация → первый объект → QR-канал → ссылка и QR

### 3. Публичная форма

- `/q/[publicId]`, RU/EN, защита от спама, сохранение сообщения, страница успеха
- Язык: cookie → язык объекта → язык браузера → `ru`

### 4. Кабинет

- Переключение организации/объекта; вкладки «Сообщения» и «Настройки»

### 5. QR-конструктор

- SVG/PNG, брендированные шаблоны, предпросмотр и скачивание

### 6. Уведомления

- Email-адаптер, очередь в PostgreSQL, повторы при ошибках

### 7. PWA

- Manifest, service worker, установка, Web Push, badge непрочитанных

### 8. Тарифы

- Подписка относится к организации
- Free: 1 организация/объект/QR; платные лимиты проверяются бизнес-логикой, не схемой БД

### 9. VPS-деплой — после успешного запуска MVP

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
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` локально, `https://backsignal.tech` в production.

## Деплой

### Vercel

- Production получает переменные из Vercel Environment Variables.
- Миграции: `pnpm db:migrate:deploy`; не использовать `db push` в production.
- Preview позднее подключить к отдельным Neon branches, не к production-данным.

### VPS

- Отложено до подтверждения жизнеспособности MVP; сейчас Docker не устанавливается.
- План: Docker + Next.js `output: 'standalone'` + image в GHCR + GitHub Actions + Caddy/Nginx.
- Сначала можно перенести приложение, оставив Neon; затем БД через `pg_dump`/`pg_restore`.
- Собственный домен сохраняет работоспособность напечатанных QR после смены хостинга.

## Журнал

- 2026-09-12: Docker и автоматический VPS-деплой вынесены из фундамента в отложенный этап после запуска MVP.
- 2026-09-12: создан DAL для организаций, объектов и сообщений с проверкой членства и ролей.
- 2026-09-12: создана и применена первая миграция `20260911213810_init` с мультитенантной доменной схемой.
- 2026-09-12: подключение к Neon подтверждено через Prisma (`SELECT 1`); VPN блокировал доступ к endpoint.
- 2026-09-12: зафиксированы Node 22.17, Prisma 7.10; добавлена конфигурация Neon/Prisma и env-шаблон.
