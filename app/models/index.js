const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.equipment = require("../models/equipment.model.js")(sequelize, Sequelize);
db.measurement = require("../models/measurement.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.user.belongsToMany(db.equipment, {
  through: "user_equipments",
  foreignKey: "userId",
  otherKey: "equipmentId"
});
db.user.belongsToMany(db.measurement, {
  through: "user_measurements",
  foreignKey: "userId",
  otherKey: "measurementId"
});
db.measurement.belongsToMany(db.user, {
  through: "user_measurements",
  foreignKey: "measurementId",
  otherKey: "userId"
});
db.equipment.belongsToMany(db.measurement, {
  through: "equipment_measurements",
  foreignKey: "equipmentMac",
  otherKey: "measurementId"
});

db.ROLES = ["user", "admin", "moderator","doctor"];

module.exports = db;
