const express = require("express");
const router = express.Router();
const { db } = require("../database");
const authorization = require("../authenticated/authenticated");
const authenticate = authorization.isAuthenticated;

// list of products
router.get("/", (req, res) => {
  db.all("SELECT * FROM product", (err, rows) => {
    if (err) throw err;
    res.status(200).json(rows);
  });
});

// add products
router.post(
  "/",
  authenticate,
  express.json(),
  async function (req, res) {
    console.log(req.body);
    try {
      let newProduct = `INSERT INTO product(name, price, owner_id, quantity, brand, color, material, weight, age_range, dimensions) VALUES (?,?,?,?,?,?,?,?,?,?)`;
      db.run(
        newProduct,
        [
          req.body.name,
          req.body.price,
          req.session.user.id,
          req.body.quantity,
          req.body.brand,
          req.body.color,
          req.body.material,
          req.body.weight,
          req.body.dimensions,
          req.body.age_range,
        ],
        (err) => {
          if (err) {
            throw err;
          }
          res.json({ message: "Success" });
        }
      );
    } catch (e) {
      console.log(e);
      res.json({ message: "Error" });
    }
  }
);

// single product
router.get("/:id", (req, res) => {
  const fetchId = req.params.id;
  db.get("SELECT * FROM product WHERE id = ?", fetchId, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
  console.log("Product id", fetchId);
});

// delete product
router.delete("/:id", (req,res) => {
  db.run(`DELETE FROM product WHERE id= ?`,
  req.params.id,
  function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.status(200).json({ deletedID: this.changes });
  });
});

module.exports = router;
