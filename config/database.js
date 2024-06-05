// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     dialectOptions: {
//       // These options are specific to MySQL
//       useUTC: false,
//       dateStrings: true,
//     },
//     // Other Sequelize options...
//   },
//   // You can add production, test, etc., configurations similarly
// };

// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    dialect: "mysql",
    dialectOptions: {
      // These options are specific to MySQL
      useUTC: false,
      dateStrings: true,
    },
    // Additional Sequelize options...
  }
);

// sequelize.sync(); // This will create the necessary tables based on the models

module.exports = sequelize; // Export the Sequelize instance
