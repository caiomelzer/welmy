module.exports = (sequelize, Sequelize) => {
    const Measurement = sequelize.define("measurements", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      weight: {
        type: Sequelize.STRING
      },
      computedAt: {
        type: Sequelize.DATE
      }
    });
  
    return Measurement;
  };
  