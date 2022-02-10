
FROM node:16-buster


WORKDIR /app
COPY . .
ENTRYPOINT /bin/sh

#RUN apt-get update
#RUN apt-get install python3.6 -y

RUN npm --version && npm install && npm install node-gyp -g && ./build_rf24libs.sh && node-gyp rebuild
#
#
#
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#
#RUN echo "deb http://deb.debian.org/debian buster main" > /etc/apt/sources.list \
#  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list \
#  && apt-get update \
#  && apt-get install clamdscan libappindicator1 libappindicator3-1 libgtk-3-0 fonts-liberation gnupg google-chrome-stable mediainfo python3-pip git -qq
#
#
#WORKDIR /app
#
#RUN groupadd -r flipflop && useradd -r -g flipflop -G audio,video flipflop \
#        && mkdir -p /home/flipflop/Downloads \
#        && chown -R flipflop:flipflop /home/flipflop \
#        && chown -R flipflop:flipflop /app
#
#USER flipflop
#
#COPY --chown=flipflop:flipflop package*.json ./
#COPY --chown=flipflop:flipflop ./dist ./dist
#COPY --chown=flipflop:flipflop ./deps ./deps
#
#RUN npm i --quiet ./deps/*
#RUN npm i --quiet --only=production
#
#COPY --chown=flipflop:flipflop ./dist ./app/dist
#
#ENV NODE_ENV "production"
#ENV CHROME_PATH "/usr/bin/google-chrome-stable"
#
#EXPOSE 3000/tcp
#CMD [ "node","app/dist/start.js"]
