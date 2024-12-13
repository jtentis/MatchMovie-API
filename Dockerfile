FROM node:20

WORKDIR /usr/src

COPY package*.json ./

RUN npm install && \
    npm install -g @nestjs/cli

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
