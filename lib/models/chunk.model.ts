import { DataTypes } from "sequelize";
import sequelize from "../sequelize";

const Chunk = sequelize.define("Chunk", {
    chunk_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    length: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    file_id: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

Chunk.sync();

export default Chunk;