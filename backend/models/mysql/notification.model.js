import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('order', 'message', 'system', 'promotion'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    data: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
    tableName: 'notifications',
    underscored: true,
    indexes: [
        {
            name: 'notification_user_id_is_read',
            fields: ['user_id', 'is_read']
        }
    ]
});

// Përcakto lidhjet me modelet e tjera
Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
};

export default Notification; 