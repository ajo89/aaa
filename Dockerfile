# stage 0
FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prod

# stage 1
FROM mhart/alpine-node:slim-10
RUN apk add --no-cache tini
ENTRYPOINT [ "/sbin/tini", "--" ]

WORKDIR /app
COPY --from=0 /app .
COPY . .

ENV APP_PORT=3000
ENV APP_SECRET=supersecret

ENV DB_HOST=localhost
ENV DB_PORT=27017
ENV DB_DATABASE=acme-bookshop

ENV DISABLE_DATABASE=false

EXPOSE ${APP_PORT}

CMD [ "node", "src/index.js" ]
