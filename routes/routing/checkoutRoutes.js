const express = require("express");
const router = express.Router();

const {
      ListCheckouts,
      GetCheckout,
     } = require("../../controllers/checkoutControllers");


router.get("/list_checkouts",(req, res) => {
  ListCheckouts().then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});
router.post("/get_checkout",(req, res) => {
  GetCheckout(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});



module.exports = router;
