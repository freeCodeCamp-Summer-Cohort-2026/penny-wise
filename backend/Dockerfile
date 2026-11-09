FROM node:22-slim AS prod

RUN apt update && apt --no-install-recommends install -y curl && apt clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
  addgroup --system nonroot && adduser --system --group nonroot && \
  npm install --ignore-scripts -g npm@12.2.2

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts --omit=dev

COPY ./scripts ./scripts
COPY ./src ./src

ARG JWT_SECRET=SECRET-CODE-1234
ENV JWT_SECRET=$JWT_SECRET

USER nonroot

EXPOSE 5000

CMD ["node", "src/server.js"]

FROM node:22-slim AS dev

RUN apt update && apt --no-install-recommends install -y curl && apt clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
  addgroup --system nonroot && adduser --system --group nonroot && \
  npm install --ignore-scripts -g npm@12.2.2

WORKDIR /src

ENV PORT=5000

COPY package*.json ./

RUN npm install --ignore-scripts 

COPY ./scripts ./scripts
COPY ./src ./src

ARG JWT_SECRET=SECRET-CODE-1234
ENV JWT_SECRET=$JWT_SECRET

USER nonroot

CMD [ "npm", "run", "dev" ]
