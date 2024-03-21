// const mysql=require('mysql2');
// //to create a pool of connections to the database
// const pool = mysql.createPool({
//     host: 'localhost',
//     //sql database name
//     user: 'root',
//     //sql database name
//     database: 'nodepractice',
//     password: 'ishita',
//      port: 3306
// });
// module.exports = pool.promise();
const Sequelize = require('sequelize');
const sequelize=new Sequelize ('nodepractice','root','ishita',{ 
    //we are using mysql2 so we have to specify the dialect
    dialect: 'mysql',
    host: 'localhost'
});
module.exports=sequelize;