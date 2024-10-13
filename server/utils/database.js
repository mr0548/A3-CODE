const mysql = require('mysql');

const pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 50,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'crowdfunding_db'
})

pool.on('connection', function (connection) {
    connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        let sql = query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this))
        return sql
    };
})
const query = (sql, val) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, val, function (error, results, fields) {
            if (error) {
                reject(error)
                throw Error(error);
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = {
    pool, query
}
