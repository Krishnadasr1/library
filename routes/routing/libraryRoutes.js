const express = require("express");
const router = express.Router();



const {
      GetLibrary,
      UpdateLibrary
      
     } = require("../../controllers/libraryControllers");


router.post("/get_library",(req, res) => {
  GetLibrary(req.body).then(resp => {
    //console.log(req.body)
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});
router.post("/update_library",(req, res) => {
  UpdateLibrary(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
    res.status(500).json(err)
})
});


module.exports = router;
