const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let sqliteDb = null;
let dbType = 'mysql';

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smart_farmer_db';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  try {
    // Try connecting to MySQL
    const tempConnection = await mysql.createConnection({ host, port, user, password });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await tempConnection.end();

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      multipleStatements: true
    });

    dbType = 'mysql';
    console.log(`Connected to MySQL database [${database}] on ${host}:${port}`);
    await runSchemaMigrations();
    return;
  } catch (mysqlErr) {
    console.warn(`MySQL connection failed (${mysqlErr.message}). Falling back to embedded SQLite database for seamless operation.`);
    
    // SQLite Fallback setup
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'smart_farmer.sqlite');
    
    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable WAL & Foreign Keys for performance
    await sqliteDb.exec('PRAGMA foreign_keys = ON;');
    await sqliteDb.exec('PRAGMA journal_mode = WAL;');

    dbType = 'sqlite';
    console.log(`Connected to SQLite database at [${dbPath}]`);
    await runSchemaMigrations();
  }
}

async function runSchemaMigrations() {
  const schemaPath = path.join(__dirname, '../database/schema.sql');
  if (!fs.existsSync(schemaPath)) return;

  let schemaSql = fs.readFileSync(schemaPath, 'utf8');

  if (dbType === 'sqlite') {
    // Adapt MySQL DDL syntax to SQLite
    schemaSql = schemaSql
      .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/ENGINE=InnoDB/gi, '')
      .replace(/DECIMAL\(\d+,\s*\d+\)/gi, 'REAL')
      .replace(/VARCHAR\(\d+\)/gi, 'TEXT')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/BOOLEAN DEFAULT TRUE/gi, 'INTEGER DEFAULT 1')
      .replace(/BOOLEAN DEFAULT FALSE/gi, 'INTEGER DEFAULT 0')
      .replace(/BOOLEAN/gi, 'INTEGER');
  }

  try {
    if (dbType === 'mysql') {
      const connection = await pool.getConnection();
      try {
        await connection.query(schemaSql);
      } finally {
        connection.release();
      }
    } else if (dbType === 'sqlite') {
      await sqliteDb.exec(schemaSql);

      // Safe column additions if users table already existed
      try { await sqliteDb.exec('ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT "LOCAL";'); } catch (e) {}
      try { await sqliteDb.exec('ALTER TABLE users ADD COLUMN last_login_at DATETIME NULL;'); } catch (e) {}
      try { await sqliteDb.exec('ALTER TABLE users ADD COLUMN full_name TEXT NULL;'); } catch (e) {}
    }
    console.log('Database schema migrations applied successfully.');
  } catch (err) {
    console.error('Error applying schema migrations:', err.message);
  }
}

// Unified Query Execution Helper
async function query(sql, params = []) {
  if (!pool && !sqliteDb) {
    await initDB();
  }

  if (dbType === 'mysql') {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else {
    // Convert ? parameters for SQLite if needed (SQLite supports standard ? positional params)
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('WITH')) {
      const rows = await sqliteDb.all(sql, params);
      return rows;
    } else {
      const result = await sqliteDb.run(sql, params);
      return { insertId: result.lastID, affectedRows: result.changes };
    }
  }
}

// Helper for raw script execution
async function execRaw(sql) {
  if (!pool && !sqliteDb) {
    await initDB();
  }

  if (dbType === 'mysql') {
    const connection = await pool.getConnection();
    try {
      await connection.query(sql);
    } finally {
      connection.release();
    }
  } else {
    await sqliteDb.exec(sql);
  }
}

function getDbType() {
  return dbType;
}

module.exports = {
  initDB,
  query,
  execRaw,
  getDbType
};
