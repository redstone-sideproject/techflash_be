FROM node:20.18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "npm", "--name", "'nest-app'", "--","run", "start:prod"]