const express = require("express");
const router = express.Router();

const { 
    RegisterAdmin,
    LoginAdmin,
    CreateWM,
    ViewWM,
    ViewAllWM,
    UpdateWM,
    DeleteWM,
    AddBook ,
    ListUsersWithNoPatronId,
    ListUsersWithPatronId,
    PlaceCheckout,
    ListBoys
 } = require("../controllers/adminControllers");

router.post("/register",(req, res) => {
  RegisterAdmin(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/login",(req, res) => {
  LoginAdmin(req.body).then(resp => {
      res.status(200).json(resp)
  }).catch(err => {
      res.status(500).json(err)
  })
});
router.post("/add-member",(req, res) => {
    CreateWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
 
  router.post("/view-member",(req, res) => {
    ViewWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.get("/view-member-all",(req, res) => {
    ViewAllWM().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/update-member",(req, res) => {
    UpdateWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/delete-member",(req, res) => {
    DeleteWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/add-book",(req, res) => {
    console.log(req.body)
      AddBook(req.body).then(resp => {
      
          res.status(200).json(resp)
      }).catch(err => {
          res.status(500).json(err)
      })
  });
  router.get("/list-membership-requests",(req, res) => {
     ListUsersWithNoPatronId().then(resp => {
          res.status(200).json(resp)
      }).catch(err => {
          res.status(500).json(err)
      })
  });
  router.get("/list-all-users",(req, res) => {
    ListUsersWithPatronId().then(resp => {
         res.status(200).json(resp)
     }).catch(err => {
         res.status(500).json(err)
     })
 });
 router.get("/list-all-boys",(req, res) => {
    ListBoys().then(resp => {
         res.status(200).json(resp)
     }).catch(err => {
         res.status(500).json(err)
     })
 });
 router.post("/place-checkout",(req, res) => {
    PlaceCheckout(req.body).then(resp => {
         res.status(200).json(resp)
     }).catch(err => {
         res.status(500).json(err)
     })
 });


module.exports = router;
