const express = require("express");
const router = express.Router();

const { 
        LoginBoy,
        getCheckoutList,

         } = require("../controllers/boyControllers");


router.post("/login",(req, res) => {
  LoginUser(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/get-boy",(req, res) => {
    LoginUser(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
router.get("/get_checkout_list",(req, res) => {
    GetUserById(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/order_placed",(req, res) => {
    GetUserByEmail(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.get("/get_return_list",(req, res) => {
    GetAll().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/return_done",(req, res) => {
    UpdateUser(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });


module.exports = router;
