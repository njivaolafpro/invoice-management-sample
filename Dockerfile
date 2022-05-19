FROM node:16.14.2-buster-slim

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT 5000
EXPOSE $PORT
CMD [ "npm", "start" ]
