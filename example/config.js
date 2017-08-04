/**
 * server配置
 * 
 */
const utils = require("mk-service-utils")
const auth = require("mk-service-auth")
const db = require("mk-service-db")
const user = require("mk-service-user")

const config = ({ services }) => {
    Object.assign(server.services, services)
    configServices(server)
    return server
}

const server = {
    host: "0.0.0.0",
    port: 8000,
    apiRootUrl: "/v1",
    interceptors: [],
    services: {
        // referrenced service
        utils,
        auth,
        db,
        user,
    },
    configs: {
        // serviceName: {}
        utils: {
            md5: {
                key: "mymd5privatekey"
            },
        },
        auth: {
            key: "oken/Key",
            tokenKeys: ['userId', 'orgId'],
            exclude: ['/user/login', '/user/ping', '/user/create'],
        },
        db: {
            name: "bizdata",
            type: "mysql",
            user: "root",
            pwd: "mydbpassword",
            host: "localhost",
            port: 3306,
            transactionType: "auto",
            database: "bizdata_dev",
        }
    },
}

function configServices(server) {
    var { services, configs } = server;
    Object.keys(services).filter(k => !!services[k].config).forEach(k => {
        let curCfg = Object.assign({ server, services }, configs["*"], configs[k]);
        services[k].config(curCfg);
    })
}

module.exports = config
