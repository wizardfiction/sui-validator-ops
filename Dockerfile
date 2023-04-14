FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:18-alpine 
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN npm install -g pnpm
RUN pnpm --version
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /usr/src/app/dist dist/
RUN chown -R node /usr/src/app
USER node