# Quick start

This app contains fullstack example on how to integrate with Boom SDK.

## Server

1. Enter server directory
   `cd ./server`
2. create .env file using `/server/.env.example` as template. You'll need to fill in boom access token and secret key. As well as, provide your plaid sandbox credentials there.
3. Install all dependencies `npm i`
4. Run the migration `npx prisma migrate dev`
5. Build and start server `npm run build & npm run dev`

This server integration uses [prisma](https://www.prisma.io/) as ORM and sqlite as db. You can find proposed set of fields which are mandatory for this integration in `schema.prisma`. (/server/prisma/schema.prisma)

## App

1. Enter app directory
   `cd ./app`
2. Install all dependencies `npm i`
3. Start server `npm run start`
