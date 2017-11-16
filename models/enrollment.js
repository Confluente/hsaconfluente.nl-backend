var Sequelize = require("sequelize");
var sequelize = require("./db");

var tracks = require("./tracks");

var Enrollment = sequelize.define('enrollment', {
  year: Sequelize.INTEGER,
  partial: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  track: {
    type: Sequelize.ENUM,
    values: tracks.getKeys(),
    get: function () {
      var id = this.getDataValue("track");
      if (!id) return null;
      return {
        id: id,
        full: tracks.getFullName(id)
      };
    }
  },
  school: {
    type: Sequelize.ENUM,
    values: ['B', 'M']
  }
});
var User = require("./user");

//Enrollment.belongsTo(User);
User.hasMany(Enrollment);
User.sync();
Enrollment.sync();
sequelize.sync();

module.exports = Enrollment;
