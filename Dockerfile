from node:alpine


add . /data
workdir /data

expose 8080 35729


run yarn install
cmd ["yarn", "start"]
