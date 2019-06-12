FROM balenalib/raspberrypi3-alpine-node:10 as builder
#make sure to have qemu-arm-static installed
COPY qemu-arm-static /usr/bin/qemu-arm-static
ENV NPM_CONFIG_UNSAFE_PERM true


#install packages programs and dependencies
RUN apk add --update python libffi-dev openssl-dev gcc libc-dev make g++ 

WORKDIR /usr/src/app

#rest server
COPY package.json /usr/src/app
RUN npm install --production
COPY release /usr/src/app/release

FROM balenalib/raspberrypi3-alpine-node:10 

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

LABEL com.centurylinklabs.watchtower.enable="false"
LABEL app="pi2c rest api"
LABEL description="rest i2c, spi, gpio instruction api"

ENV DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket
ENV REST_PORT 80
ENV DB_PATH '/data/db'

#rest
EXPOSE 80

CMD ["/usr/local/bin/node", "release/index.js"]
