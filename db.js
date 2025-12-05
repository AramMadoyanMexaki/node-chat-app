const { Pool } = require('pg');

const pool = new Pool({
    "user": "aramchat",
    "host": "localhost",
    "database": "chatdb",
    "password": "221100",
    "port": 5432
});

module.exports = pool;
