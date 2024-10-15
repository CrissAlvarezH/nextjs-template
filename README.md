Go to [app-template.alvarezcristian.com](https://app-template.alvarezcristian.com) to see the demo

## Description

Nextjs project with the following services integrated:
- [shadcn/ui](https://ui.shadcn.com/) (UI components library)
- [zsa](https://zsa.vercel.app/docs/introduction), [zod](https://zod.dev/) (Type safe and validated server actions)
- [Drizzle](https://orm.drizzle.team/) (ORM with Postgres driver)
- [Lucia Auth](https://lucia-auth.com/), [Arctic](https://arctic.js.org/) (Email/Password and Google)
- [Resend emails](https://resend.com/) (Send emails)
- [React email](https://react.email/) (Create beautiful emails)
- [AWS S3](https://www.npmjs.com/package/@aws-sdk/client-s3) (File management)
- [React hook form](https://react-hook-form.com/) (Create forms)
- [t3-env](https://github.com/t3-oss/t3-env) (Environment variables management)
- [thumbhash](https://github.com/evanw/thumbhash) (Create image thumbnails hashes blured)
- [Sentry](https://sentry.io/welcome/?utm_source=google&utm_medium=cpc&utm_id=%7B20403208976%7D&utm_campaign=Google_Search_Brand_SentryKW_ROW_Alpha&utm_content=g&utm_term=sentry&gad_source=1&gclid=CjwKCAjwpbi4BhByEiwAMC8JnScrS_BD5dTH7Z01RQvKfsQShaDWoDV8hawnKB49PgAzES-YNKJWcRoCu_cQAvD_BwE) (Error monitoring)

## Run locally

### 1. Setup environment variables

Create a `.env` file copying `.env.example` and set your own variables
```shell
cp .env.example .env
```


### 2. Run postgres container

You can use `docker-compose` to that, just run

```shell
docker-compose up
```

### 3. Run app
```shell
npm run dev
```
