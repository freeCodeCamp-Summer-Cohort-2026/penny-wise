FROM node:22-slim AS prod

RUN apt update && apt --no-install-recommends install -y curl

RUN addgroup --system nonroot \
    && adduser --system --group nonroot

RUN npm install -g npm@12.2.2

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY ./scripts ./scripts
COPY ./src ./src

USER nonroot

EXPOSE 5000

CMD ["node", "src/server.js"]

FROM node:22-slim AS dev

RUN apt update && apt --no-install-recommends install -y curl

RUN addgroup --system nonroot \
    && adduser --system --group nonroot

RUN npm install -g npm@12.2.2

WORKDIR ./src

ENV PORT=5000

COPY package*.json ./

RUN npm install

COPY ./scripts ./scripts
COPY ./src ./src

USER nonroot

CMD [ "npm", "run", "dev" ]
