import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from './user.js';

const Leave = sequelize.define('Leave', {
    leave_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leave_from: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    leave_to: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'rejected', 'accepted'),
        defaultValue: 'pending',
    },
    total_leaves: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    remaining_leaves: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

export default Leave;
