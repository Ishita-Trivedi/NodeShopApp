const Sequelize=require('sequelize');
const sequelize=require('../util/database');
//creating cart model

const Order=sequelize.define('order',{
id:{
    type:Sequelize.INTEGER,
    autoincrement:true,
    allowNull:false,
    primaryKey:true
}

});
module.exports=Order;