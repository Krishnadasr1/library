const express = require("express");
const router = express.Router();



const {
      PlaceHold,
      CancelHold,
      ListHolds,
      
     } = require("../controllers/holdControllers");


router.post("/place_hold",(req, res) => {
  PlaceHold(req.body).then(resp => {
      res.status(200).json(resp)
   }).catch(err => {
    res.status(500).json(err)
})
});
router.post("/cancel_hold",(req, res) => {
  CancelHold(req.body).then(resp => {
      res.status(200).json(resp)
   }).catch(err => {
    res.status(500).json(err)
})
});
router.get("/list_holds",(req, res) => {
  ListHolds().then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});


module.exports = router;
