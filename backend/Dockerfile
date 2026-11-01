FROM node:22-slim AS prod

RUN apt update && apt install -y curl

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@12.2.1

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]

FROM node:22-slim AS dev

RUN apt update && apt install -y curl

WORKDIR /src

ENV PORT=5000

COPY package*.json ./

RUN npm install -g npm@12.2.1

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
