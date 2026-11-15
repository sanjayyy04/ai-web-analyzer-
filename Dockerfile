FROM node:20-bookworm-slim AS build

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    SERVE_CLIENT=false \
    PORT=10000 \
    CHROME_PATH=/usr/bin/google-chrome-stable

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg fonts-liberation \
    && install -d -m 0755 /etc/apt/keyrings \
    && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
      | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg \
    && chmod 0644 /etc/apt/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" \
      > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && google-chrome-stable --version \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

COPY --from=build /app/server/package.json ./package.json
COPY --from=build /app/server/node_modules ./node_modules
COPY --from=build /app/server/dist ./dist

USER node

EXPOSE 10000

CMD ["node", "dist/index.js"]
