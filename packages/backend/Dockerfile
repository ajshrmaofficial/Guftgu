FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN yarn install --frozen-lockfile
COPY . .
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
# CMD ["yarn", "dev:backend"]
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
