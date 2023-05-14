FROM node:16.19.0

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install -g @nestjs/cli ts-node && yarn install

COPY . .

RUN yarn build api-gateway

RUN yarn build crawler

RUN yarn build uploader