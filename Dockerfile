FROM node:18

WORKDIR /app

ENV DATABASE_URL=file:/tooling-data/data.db

RUN apt-get update && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx vite build

RUN npx prisma migrate deploy

ENV PORT=5173

EXPOSE 5173
