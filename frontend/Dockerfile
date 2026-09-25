FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@12.1.0

RUN npm install

COPY . .

ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.31.5-alpine-slim AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

FROM node:22-slim AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@12.1.0

RUN npm install

COPY . .

EXPOSE 5173

ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

CMD ["npm", "run", "dev"]
