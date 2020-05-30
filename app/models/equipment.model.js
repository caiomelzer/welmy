module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipments", {
      mac: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      qrcode: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      }
    });

    return Equipment;
  };
  