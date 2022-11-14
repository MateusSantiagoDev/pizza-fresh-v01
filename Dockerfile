FROM node:16.13.2

ENV WORKDIR=/pizza-fresh-v01/prisma

WORKDIR ${WORKDIR}

COPY . .

RUN npm install

CMD [ "npm", "start" ]
