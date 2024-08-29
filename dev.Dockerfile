# Use the argument to set an environment variable


FROM node:18.18.0-alpine as build

WORKDIR /app

ARG NPM_TOKEN  

COPY package*.json ./

COPY .npmrc ./ 

RUN npm install --legacy-peer-deps

RUN rm -f .npmrc

COPY . /app

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 8000

CMD ["npm", "start"]