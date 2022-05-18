const express = require("express");
const router = express.Router();

const { 
    RegisterAdmin,
    LoginAdmin,
    //CreateWM,
    ViewWM,
    UpdateWM,
   // DeleteWM,
    AddBook,
    SearchBook
    
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
// router.post("/add_wardmember",(req, res) => {
//     CreateWM(req.body).then(resp => {
//         res.status(200).json(resp)
//     }).catch(err => {
//         res.status(500).json(err)
//     })
//   });
 
  router.post("/view_wardmember",(req, res) => {
    ViewWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.post("/update_wardmember",(req, res) => {
    UpdateWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  // router.post("/delete_wardmember",(req, res) => {
  //   DeleteWM(req.body).then(resp => {
  //       res.status(200).json(resp)
  //   }).catch(err => {
  //       res.status(500).json(err)
  //   })
  // });
  router.post("/add-book",(req, res) => {
    console.log(req.body)
      AddBook(req.body).then(resp => {
      
          res.status(200).json(resp)
      }).catch(err => {
          res.status(500).json(err)
      })
  });
  router.post('/search-book-byname',(req,res) => {
    SearchBook(req.body).then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  })
  
  


module.exports = router;
