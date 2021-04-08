FROM node:12.13.0

WORKDIR /app

COPY . .

RUN yarn install

ENV PORT=4200
ENV REDIS_HOST=192.***.***.***
ENV REDIS_PORT=6379

CMD ["sh","-c","node index.js"]