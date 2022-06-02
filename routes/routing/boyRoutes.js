const express = require("express");
const router = express.Router();

const { 
        LoginUser,
        GetUser,
        GetCheckoutList,
        OrderPlaced,
        GetReturnList,
        ReturnDone

         } = require("../../controllers/boyControllers");


router.post("/login",(req, res) => {
  LoginUser(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/get-boy",(req, res) => {
    GetUser(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
router.post("/get_checkout_list",(req, res) => {
    GetCheckoutList(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/order_placed",(req, res) => {
    OrderPlaced(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/get_return_list",(req, res) => {
    GetReturnList(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/return_done",(req, res) => {
    ReturnDone(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });


module.exports = router;
