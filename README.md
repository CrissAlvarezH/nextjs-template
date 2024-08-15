## Description

Nextjs project with the following services integrated:
- [shadcn/ui](https://ui.shadcn.com/) (UI components library)
- [Drizzle ORM](https://orm.drizzle.team/) 
- [Lucia Auth](https://lucia-auth.com/) (Email/Password and Google)
- [Resend emails](https://resend.com/)

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
