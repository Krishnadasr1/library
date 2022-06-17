const express = require("express");
const router = express.Router();


const {
    LoginWardmember,
    ViewWardmember,
    AddDeliveryboy,
    UpdateDeliveryboy,
    DeleteDeliveryboy,
    ListDeliveryboy
} = require("../../controllers/memberControllers");


router.post('/login',(req,res) => {
    LoginWardmember(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(400).json(err)
  })
})
router.post('/view-member',(req,res) => {
  ViewWardmember(req.body).then(resp => {
    res.status(200).json(resp)
}).catch(err => {
    res.status(400).json(err)
})
})
router.post("/add-delivery-person", (req, res) => {
    AddDeliveryboy(req.body).then(resp => {
       res.status(200).json(resp)
   }).catch(err => {
       res.status(500).json(err)
   })
});


router.post('/list-all-deliveryboys',(req,res) => {
    ListDeliveryboy(req.body).then((resp) => {
   res.status(200).json(resp);
 })
 .catch((err) => {
   res.status(400).json(err);
 });
})
router.post('/update-deliveryboy',(req,res) => {
    UpdateDeliveryboy(req.body).then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  })
  router.post('/delete-deliveryboy',(req,res) => {
    DeleteDeliveryboy(req.body).then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  })



module.exports = router;