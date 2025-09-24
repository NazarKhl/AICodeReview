const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_review_db'
};

let connection;

async function connectDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

async function createTables() {
  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code_snippet TEXT NOT NULL,
      language VARCHAR(50) NOT NULL,
      review_result TEXT NOT NULL,
      rating INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await connection.execute(createReviewsTable);
}

function getConnection() {
  return connection;
}

module.exports = { connectDB, getConnection };