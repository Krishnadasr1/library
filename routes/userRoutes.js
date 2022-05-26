const express = require("express");
const router = express.Router();

const { RegisterUser,
        LoginUser,
        GetUserById,
        GetUserByEmail,
        GetAll,
        DeleteUser,
        PlaceReturn,
        PastOrders,
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
  router.post("/delete",(req, res) => {
    DeleteUser(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/place-return",(req, res) => {
    PlaceReturn(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/past-orders",(req, res) => {
    PastOrders(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });

module.exports = router;
