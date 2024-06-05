
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('iqac', 'sabareesh', 'sabareesh', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
    googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accessToken: {
    type: DataTypes.STRING
  },
  refreshToken: {
    type: DataTypes.STRING
  },
}, {
});

(async () => {
  try {
    await sequelize.sync();
    console.log("User model synced with database");
  } catch (error) {
    console.error("Error syncing User model:", error);
  }
})();

module.exports = User;
