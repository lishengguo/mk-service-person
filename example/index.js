const { config, start } = require("mk-server")
const serverConfig = require("./config")

const person = require("./services/person/index.js")

const services = { 
    person,
}

config(serverConfig({ services }))

start()