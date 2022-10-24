FROM node:16.17.1-alpine AS BUILDER

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only-production

COPY . .

RUN npm prune --production && npm cache clean --force

FROM node:16.17.1-alpine

WORKDIR /app

RUN apk add tini

ENV NODE_ENV production

RUN adduser -D node-user -G node

USER node-user

COPY --chown=node-user:node --from=BUILDER /app .

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "/app"]
