FROM node:22-slim AS builder

RUN  npm install -g npm@12.0.2
WORKDIR /app

# ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_API_URL=http://localhost:5173
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# EXPOSE 3000

# CMD ["node", "server.js"]

EXPOSE 5173

CMD [ "npm", "run", "dev" ]

#dev mode for hot reload
FROM node:22-slim AS dev
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:5173
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
CMD [ "npm", "run", "dev" ]
