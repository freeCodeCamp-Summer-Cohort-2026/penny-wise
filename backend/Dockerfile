FROM node:22-slim AS prod

RUN npm install -g npm@12.0.2

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 27017

CMD ["node", "src/server.js"]

# Hot reloading
FROM node:22-slim AS dev
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
