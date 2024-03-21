const Sequelize=require('sequelize');
const sequelize=require('../util/database');
//creating cart model

const CartItem=sequelize.define('cartItem',{
id:{
    type:Sequelize.INTEGER,
    autoincrement:true,
    allowNull:false,
    primaryKey:true
},
quantity:Sequelize.INTEGER,

});
module.exports=CartItem;