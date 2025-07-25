"use strict";
//用户模型
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableSQL = void 0;
// 用户表 SQL 初始化（需在 MySQL 中执行）
exports.createTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;
