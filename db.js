const { Pool } = require('pg');

// 1. Ստուգել, թե արդյոք մենք արտադրական միջավայրում ենք
const isProduction = process.env.NODE_ENV === 'production'; 

// 2. Կազմակերպել կապի օբյեկտը
// Եթե isProduction-ը true է, օգտագործել DATABASE_URL (որը դուք դրել եք Render-ում)
// Հակառակ դեպքում, օգտագործել .env-ի առանձին փոփոխականները (ինչպես նախկինում)
const connectionConfig = isProduction ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const pool = new Pool(connectionConfig);

module.exports = pool;