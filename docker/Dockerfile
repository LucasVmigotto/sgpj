FROM node:14.8-alpine

RUN apk add --no-cache bash curl git shadow tar

ENV GOSU_VERSION 1.10
RUN curl -sS -Lo /usr/bin/gosu https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-amd64
RUN chmod +x /usr/bin/gosu

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

VOLUME /app
WORKDIR /app

ENTRYPOINT [ "/usr/bin/entrypoint.sh" ]
CMD [ node ]