const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getFileStream } = require('../../s3')

const { RegisterUser,
        LoginUser,
        AddImage,
        GetUserById,
        GetUserByEmail,
        GetAll,
        DeleteUser,
        PlaceReturn,
        PastOrders,
        UpdateUser,
        GetTrends,
        GetRelease
     } = require("../../controllers/userControllers");
    
     router.get("/get-user/image/:id", async (req, res) => {
        let user = await User.findOne({ _id:  req.params.id }).exec();
        if(user!=null){
        if(user.image != null ){
            const readStream = getFileStream(user.image)
            readStream.pipe(res) 
        }else{
            res.status(404).send('Image Not Found'); 
        }
        }else{
            res.status(404).send('User Not Found');
        }
    
    })
    
    router.post('/add-user/image/:id', upload.single('image'),  (req, res) => {
        AddImage(req.file, req.params).then(resp => {
            res.status(200).json(resp)
        }).catch(err => {
            res.status(500).json(err)
        })
    })
    
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
  router.get("/get-trends",(req, res) => {
    GetTrends().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
  router.get("/get-release",(req, res) => {
    GetRelease().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
  });
module.exports = router;
