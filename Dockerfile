#stage 1

FROM node:22-alpine3.20 as builder

WORKDIR /build

COPY package*.json .

RUN npm install


COPY tsconfig.json tsconfig.json
COPY src/ src/
RUN cd src && npx prisma generate

RUN npm run build




#stage 2

FROM node:22-alpine3.20 as runner

WORKDIR /app

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist dist/


EXPOSE 3000

CMD [ "npm", "start" ]