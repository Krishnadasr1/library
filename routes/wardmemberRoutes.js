const express = require("express");
const router = express.Router();


const {
    LoginWardmember,
    AddWardMember,
    ListWardMember,
    DeleteWardMember,
    AddDeliveryboy,
    UpdateDeliveryboy,
    DeleteDeliveryboy,
    ListDeliveryboy
} = require("../controllers/wardmemberControllers");


router.post('/login',(req,res) => {
    LoginWardmember(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(400).json(err)
  })
})
router.post("/register", (req, res) => {
  AddWardMember(req.body).then(resp => {
     res.status(200).json(resp)
 }).catch(err => {
     res.status(500).json(err)
 })
});
router.get("/list-all",(req, res) => {
  ListWardMember().then((resp) => {
      res.status(200).json(resp);
    }).catch((err) => {
      console.log(err)
      res.status(400).json(err);
    });
  });

router.post("/delete",(req, res) => {
  DeleteWardMember(req.body).then((resp) => {
    res.status(200).json(resp);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.post("/add-deliveryboy", (req, res) => {
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