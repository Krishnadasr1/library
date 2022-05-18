const express = require("express");
const router = express.Router();

const { RegisterUser,
        LoginUser,
        GetUserById,
        GetUserByEmail,
        GetAll,
        UpdateUser } = require("../controllers/userControllers");

router.post("/register",(req, res) => {
  RegisterUser(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/login",(req, res) => {
  LoginUser(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/get_by_patron_id",(req, res) => {
    GetUserById(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/get_by_email",(req, res) => {
    GetUserByEmail(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.get("/get_all",(req, res) => {
    GetAll().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/update",(req, res) => {
    UpdateUser(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });


module.exports = router;
