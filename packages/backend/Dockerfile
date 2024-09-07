FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN yarn install --frozen-lockfile
COPY . .
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
CMD ["yarn", "backendDev"]