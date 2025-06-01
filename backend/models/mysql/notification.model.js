const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.mysql');

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
            model: 'User',
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
    tableName: 'Notification',
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

module.exports = Notification; 