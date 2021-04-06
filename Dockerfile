FROM node:14-alpine

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN yarn

COPY ./src ./src
COPY ./public ./public

EXPOSE 3000
ENV HOST=0.0.0.0

CMD yarn build && yarn start

