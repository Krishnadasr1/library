const { default: axios } = require("axios");
const express = require("express");
const hold = require("../models/hold");
const router = express.Router();
const User = require("../models/user");
const Hold = require("../models/hold");
const Delivery = require("../models/delivery");

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
// const { getFileStream } = require('../../s3');



router.post("/register", async (req, res) => {
  const number = req.body.phoneNumber
  console.log("register api called")
 User.find({ phoneNumber: number }).exec()
   .then(user => {
      if (user.length >= 1) {
        res.status(405).send("User Exist.Try another phone number")
      } else {

        const user = User({
          phoneNumber: number
        })
        user.save().then(resp => {
          console.log(".........registering new user.....")
          const otpreq = {
            method: 'get',
            url: `${process.env.TWOFACTOR_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${user.phoneNumber}/AUTOGEN2`,
            headers: {
              Accept: 'application.json'
            }
          }
          axios(otpreq)
            .then(async (resp1) => {
              console.log(resp1.data.Status)
              if(resp1.data.Status=="Error"){
                res.status(200).send({"Success":"User created.","Error":"OTP service stopped temporarily due to insufficient balance."})
              }else{
              res.status(201).send({"Success":"User created.OTP sended"})
              //check if it works , if works flush it in 2 mints
              user.otp = resp1.data.OTP
              user.save();
            }
            }).catch((err) => {
              console.log("...........1..........")
              console.log(err)
              res.status(400).send(err)
            })
        }).catch(err => {
          console.log("...........2..........")
          console.log(err)
          res.status(400).send(err)
        })
      }
    }).catch(err => {
      console.log("...........3..........")
      console.log(err)
      res.status(400).send(err)
    })

});

router.post("/login", (req, res) => {
  User.find({ cardNumber: req.body.cardNumber }).exec()
    .then(user => {
      //no user exist
      if (user.length < 1) {
        res.status(404).send("user not found")
      } else {
        //console.log(user[0])
        if (user[0].phoneNumber!=null) {
          //user found , send otp 
          const otpreq = {
            method: 'get',
            url: `${process.env.TWOFACTOR_URL}/${process.TWOFACTOR_API_KEY}/SMS/${user[0].phoneNumber}/AUTOGEN2`,
            headers: {
              Accept: 'application.json'
            }
          }
          axios(otpreq)
            .then((resp) => {
              //check if it works , if works flush it in 2 mints
              user[0].otp = resp.data.OTP
              user[0].save();
              console.log(resp.data.OTP)
              res.status(200).send("OTP sended")
            }).catch((err) => {
              console.log(err)
              res.status(400).send(err)
            })
        } else {
          res.status(405).send("Phone number not registerd")
        }
      }
    })
});
router.post("/verify_otp", (req, res) => {
  User.find({ phoneNumber: req.body.phoneNumber })
    .then(user => {
      if (user.length < 1) {
        res.status(401).send("User not found")
      } else {
        if (user[0].otp == req.body.OTP) {
          user[0].otp = null;
          user[0].save();
          res.status(200).send("Success")
        } else {
          res.status(400).send("Invalid OTP")
        }
      }
    }).catch(err => {
      console.log(err)
      res.status(400).send(err)
    })
})
router.post("/application_form_filling",async(req,res) =>{
  const data = req.body
User.find({phoneNumber: data.phoneNumber}).then((user) =>{
  if(user.length<1){
    res.status(404).send("user not found")
  }else{
    //console.log(user)
    User.findOneAndUpdate({phoneNumber:data.phoneNumber},data)
    .then((resp) =>{
      res.status(200).send("Application form submitted")
    }).catch((err) =>{
      res.status(400).send("something went wrong")
    })
  }
}).catch((err) =>{
  res.status(404).send(err)
})
})
router.get("/get_by_cardNumber/:number", (req,res) =>{
  User.find({ cardNumber: req.params.number})
  .then((user) => {
    if(user.length<1){
      res.status(404).send("No user found")
    }else{
      res.status(200).send(user)
    }
    
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.get("/get_all_valid_users", (req,res) =>{
  User.find({ cardNumber: { $not: { $eq: null } } })
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.get("/get_membership_requests", (req,res) =>{
  User.find({
    $and: [ {cardNumber: null},{ wardNumber: { $not: { $eq: null }}} ]
    })
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    console.log(err)
    res.status(400).send(err)
  });
})
router.get("/reject_membership_request/:phoneNumber", (req,res) =>{
  User.findOneAndDelete({ phoneNumber: req.params.phoneNumber})
  .then((resp) => {
    res.status(200).send(req.params.phoneNumber+" memebership request rejected")
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.post("/accept_membership_request", (req,res) =>{
  const data =req.body
  console.log(data.phoneNumber)
  User.findOneAndUpdate({ phoneNumber: data.phoneNumber},data)
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.post("/update", (req,res) =>{
  const data =req.body
  User.findOneAndUpdate({ phoneNumber: data.phoneNumber},data)
  .then((resp) => {
    res.status(200).send("user updated")
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.get("/place_return/:id",(req,res) =>{
  Delivery.findOneAndUpdate({_id:req.params.id},{returnStatus:"Open"})
  .then(resp =>{
    res.status(200).send(resp)
  }).catch(err =>{
res.status(400).send(err)
  })
})

// router.post("/delete/:cardNumber", (req,res) =>{
//   User.find({ cardNumber: req.params.cardNumber},)
//   .then(async(user) => {
//     if(user.length<1){
//       res.status(404).send("No such user")
//     }else{
//       let holds =[];
//       let checkouts =[];
//      //holds =
//       await Hold.find({phoneNumber:user[0].phoneNumber}).then(resp =>{
//         res.status(200).send({
//           message:"success",
//           resp:resp,
//         })
//       }).catch(err=>{
//         console.log(err)
//         res.status(400).send(err)
//       })
//      checkouts = await Delivery.find({
//      $and:[{phoneNumber:user[0].phoneNumber},{userInHand:"T"}] 
//     })
//     console.log(user[0].phoneNumber)
//     console.log(holds)
//     console.log(checkouts)
//       //res.status(200).send(user)
//     }
//   })
//   .catch((err) => {
//     console.log(err)
//     res.status(500).send(err)
//   });
// })



module.exports = router;
