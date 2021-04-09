FROM node:12.13.0

WORKDIR /app

COPY . .

RUN yarn install

ENV PORT=4300
ENV CHECK_SERVER_URL=192.***.***.***

CMD ["sh","-c","node index.js"]