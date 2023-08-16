FROM node:16-alpine as base
WORKDIR /usr/src/app
RUN mkdir ./client && mkdir ./server
COPY ./client/package.json ./client
COPY ./server/package.json ./server

FROM base as production
ENV NODE_ENV=production
COPY ./client/*.js ./client
COPY ./server/*.js ./server
RUN cd ./client && npm install && npm ci
RUN cd ./server && npm install && npm ci
CMD ["node", "./client"]
CMD ["node", "./server"]

FROM base as dev
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

ENV NODE_ENV=development
COPY ./client/*.js ./client
COPY ./server/*.js ./server

RUN cd ./client && npm install
RUN cd ./server && npm install
CMD ["node", "./client"]
CMD ["node", "./server"]