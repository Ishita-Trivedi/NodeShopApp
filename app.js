const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const db = require('./util/database');
const sequelize = require('./util/database');
//importing the models
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-items');
const Order=require('./models/order');
const OrderItem=require('./models/order-items');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')
//   .then(result => {
//     console.log(result[0], result[1]);
//   })
//   .catch(err => {
//     console.log(err);
//   });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//store the user
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      //next is used to 
      next();
    })
    .catch(err => console.log(err));
} );
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//relate the models wrt sequelize
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});



// Define the relationships
// Define the relationships
sequelize
  .sync()
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

// Handle process termination eventsA
// app.listen(5000);
// Handle process termination events
process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});