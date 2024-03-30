"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config();
const dataBase = new typeorm_1.DataSource({
    type: 'sqlite',
    database: process.env.DATABASE || './src/database/database.sqlite',
    entities: [
        (0, path_1.join)(__dirname, '..', 'models/*.{ts,js}')
    ],
    logging: true,
    synchronize: true
});
dataBase.initialize()
    .then(() => {
    console.log(`Banco de dados incializado`);
})
    .catch((err) => {
    console.error(`Erro ao inicializar o banco de dados!`, err);
});
exports.default = dataBase;
