import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from './user.js';

const Leave = sequelize.define('Leave', {
    leave_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    e_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'e_id',
        },
    },
    e_name: {
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
    rejectionReason: {
        type: DataTypes.STRING,
        defaultValue: 'in process',
    },
    status: {
        type: DataTypes.ENUM('pending', 'rejected', 'accepted'),
        defaultValue: 'pending',
    }},
    {
        timestamps:false
});

export default Leave;
