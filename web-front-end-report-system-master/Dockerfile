FROM node:15.14.0-alpine3.10 AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:15.14.0-alpine3.10
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "3000", "-s", "."]doc
