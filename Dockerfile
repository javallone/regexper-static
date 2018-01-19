from node:alpine


add . /data
workdir /data

expose 8080

run npm install node-sass --sass-binary-site=https://npm.taobao.org/mirrors/node-sass/
run yarn install
cmd ["yarn", "start"]
