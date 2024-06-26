// const fs = require('fs');
// const path = require('path');
const db=require('../util/database');
const Cart = require('./cart');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // getProductsFromFile(products => {
    //   if (this.id) {
    //     const existingProductIndex = products.findIndex(
    //       prod => prod.id === this.id
    //     );
    //     const updatedProducts = [...products];
    //     updatedProducts[existingProductIndex] = this;
    //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //       console.log(err);
    //     });
    //   } else {
    //     this.id = Math.random().toString();
    //     products.push(this);
    //     fs.writeFile(p, JSON.stringify(products), err => {
    //       console.log(err);
    //     });
    //   }
    // });
    //id is auto incremented so we dont need to pass it
    db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    // getProductsFromFile(products => {
    //   const product = products.find(prod => prod.id === id);
    //   const updatedProducts = products.filter(prod => prod.id !== id);
    //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //     if (!err) {
    //       Cart.deleteProduct(id, product.price);
    //     }
    //   });
    // });
  }

  static fetchAll(cb) {
    // getProductsFromFile(cb);
    return db.execute('SELECT * FROM products');
  }

  static findById(id, cb) {
    // getProductsFromFile(products => {
    //   const product = products.find(p => p.id === id);
    //   cb(product);
    // });
     return db.execute('SELECT id FROM products WHERE products.id = ?', [id])
        .then(([rows, fields]) => {
            // Assuming rows contains the result of the query
            return rows[0]; // Assuming you expect only one row
        })
        .catch(error => {
            // Handle any errors here
            console.error('Error fetching product by id:', error);
            throw error; // Propagate the error further if needed
        });
  }
};
