'use strict';
require('dotenv').config();
module.exports = {
    app: {
        name: "authenticationsystem",
        superSecret: "power",
        baseUrl: `http://localhost:`,
        port: process.env.PORT,
        expiresIn: 86400

    },
    api: {
        prefix: '^/api'
    },
    database: {
        DB: process.env.DB,
        DB_HOST: process.env.DB_HOST,

    }
};
