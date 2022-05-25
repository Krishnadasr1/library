const express = require("express");
const router = express.Router();



const {
      CreatePatron,
      GetPatron
    
     } = require("../controllers/patronControllers");


router.post("/create_patron",(req, res) => {
  CreatePatron(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});
router.post("/get_patron",(req, res) => {
    GetPatron(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
      res.status(500).json(err)
  })
  });



module.exports = router;
