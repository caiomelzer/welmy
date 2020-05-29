module.exports = (sequelize, Sequelize) => {
    const Patient = sequelize.define("patients", {
      fullname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      }
    });
  
    return Patient;
  };
  