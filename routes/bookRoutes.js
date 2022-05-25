const express = require("express");
const router = express.Router();



const {
    GetBook,
    GetItem
} = require("../controllers/bookControllers");

router.post("/get_book",(req, res) => {
  GetBook(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/get-item-biblio",(req, res) => {
    GetItem(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });

module.exports = router;
