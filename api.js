/*
* api.js        //webapi接口定义（接口参数和返回值的格式转换）
*/
var config
const api = {

    _init: (current) => {
        config = current
        model.config(current)
    },

    query: ({ pagination, filter }, ctx) => {
        pagination = pagination || { current: 0, pageSize: 20 }
        filter = filter || { id: { $ne: null } }
        var param = {
            where: filter,
            offset: pagination.current * pagination.pageSize,
            limit: pagination.pageSize,
        }
        return service.findAll(param) 
    },

    create: (person, ctx) => {
        person.creator = ctx.token.userId
        return service.create(person)
    },

    update: (person, ctx) => service.update(person),

    delete: (person, ctx) => service.delete(person),
}

module.exports = api



/*
* service.js    //业务逻辑
*/
const service = {
    findAll: (param) => dao.findAll(param),
    create: (person) => {
        person.id = config.services.utils.api.objectId()
        return dao.create(person)
    },
    delete: (person) => {
        if (!person.id) {
            throw ({ code: 2001, message: "人员ID不能为空" })
        }
        return dao.delete({ where: { id: person.id } })
    },
    update: (person) => {
        if (!person.id) {
            throw ({ code: 2001, message: "人员ID不能为空" })
        }
        return dao.update(person)
    },
}



/*
* dao.js        //数据库处理
*/
const dao = {
    findAll: (param) => model.Person.findAll(param),
    create: (person) => model.Person.create(person),
    delete: (param) => model.Person.destroy(param),
    update: (person) => model.Person.update(person),
}



/*
* model.js      //数据模型定义
*/
const model = {
    config: (config) => {
        let db = config.services.db
        if (!db) {
            throw ({ code: 100, message: "数据库访问组件 config.services.db 未初始化" })
        }
        db = db.api.getDB("bizdata")
        if (!db) {
            throw ({ code: 100, message: "配置信息中缺少数据库 bizdata" })
        }
        config.db = db;

        let DataTypes = db.Sequelize;

        model.Person = db.define(
            "person", {
                id: { type: DataTypes.BIGINT, primaryKey: true },
                name: DataTypes.STRING,
                userId: DataTypes.BIGINT,
                departmentId: DataTypes.BIGINT,
                creator: DataTypes.BIGINT,
            }, {
                tableName: "set_person",
            }
        )

        model.Person.sync()
    },
}


