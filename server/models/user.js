import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define('User', {
    e_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    e_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    e_dept: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    e_role: {
        type: DataTypes.ENUM('admin', 'employee'),
        allowNull: false,
    },
    e_email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    e_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_leaves: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
    },
    remaining_leaves: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
    }},
    {
        timestamps:false
});

export default User;
