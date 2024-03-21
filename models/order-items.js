const Sequelize=require('sequelize');
const sequelize=require('../util/database');
//creating cart model

const OrderItem=sequelize.define('orderItem',{
id:{
    type:Sequelize.INTEGER,
    autoincrement:true,
    allowNull:false,
    primaryKey:true
},
quantity:Sequelize.INTEGER,

});
module.exports=OrderItem;