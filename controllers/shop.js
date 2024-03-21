const Product = require('../models/product');
// const Cart = require('../models/OLdCart');
// const Order=require('../models/order');


exports.getProducts = (req, res, next) => {
 Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  //using sequelize we dont get an array of products but we get a single product
  const prodId = req.params.productId;
  Product.findAll({where:{id:prodId} }).then((products)=>{  
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  }).catch(err => console.log(err));
//   Product.findById(prodId).then((product)=>{
// res.render('shop/product-detail', {
//       product: product,
//       pageTitle: product.title,
//       path: '/products'
//     });
//   }).catch(err => console.log(err));
// Product.findAll()
//   .then(products => {
//     res.render('shop/index', {
//       prods: products,
//       pageTitle: 'Shop',
//       path: '/'
//     });
//   })
//   .catch(err => {
//     console.error(err);
//     // Handle the error appropriately, such as rendering an error page or sending an error response
//   });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.error(err);
    // Handle the error appropriately, such as rendering an error page or sending an error response
  });
  // Product.fetchAll().then(([rows,fieldData])=>{
  //   // console.log(fieldData); iy shows the schema of the table
  //   // console.log(rows); it shows the data of the table
  //   res.render('shop/index', {
  //     prods: rows,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // }).catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(
    cart=>{
      // console.log(cart);
      return cart.getProducts().then(cartProducts=>{
        //rendering the cartProducts
        res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
      }).catch(err=>console.log(err));
    }
  ).catch(err=>console.log(err));
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findById(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts({where:{id:prodId}});
  }).then(products=>{
    const product=products[0];
    return product.cartItem.destroy();
  }).then(result=>{
    res.redirect('/cart');
  }).catch(err=>console.log(err));
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};
exports.postOrder=(req,res,next)=>{
  let fetchedCart;
  req.user.getCart().then(cart=>{
    //store the cart in the fetchedCart variable to use it
    fetchedCart=cart;
    return cart.getProducts();
  }).then(products=>{
    //creates an order for the user
    return req.user.createOrder().then(order=>{
      //it adds the products to the order
      return order.addProducts(products.map(product=>{
        //it adds the quantity of the product to the order
        product.orderItem={quantity:product.cartItem.quantity};
        //it returns the product
        return product;
      }));
    }).catch(err=>console.log(err));
  }).then(result=>{
    //empty the cart
    return fetchedCart.setProducts(null);
  }).then(result=>{
    res.redirect('/orders');
  }).catch(err=>console.log(err));
};
exports.getOrders = (req, res, next) => {
  //we are using sequelize so we can use the getOrders method
  //we use many products so we use the include method to include the products
  req.user.getOrders({include:['products']}).then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders
    });
  }).catch(err=>console.log(err));
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
