const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
// const { getFileStream } = require('../../s3');



router.post("/register", async (req, res) => {
  const number = req.body.phoneNumber
  User.find({ phoneNumber: number }).exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(403).send("User Exist.Try another phone number")
      } else {

        const user = User({
          phoneNumber: number
        })
        user.save().then(resp => {
          const otpreq = {
            method: 'get',
            url: `${process.env.twoFactorUrl}/${process.env.twoFactorApiKey}/SMS/${user.phoneNumber}/AUTOGEN2/AMC_login`,
            headers: {
              Accept: 'application.json'
            }
          }
          axios(otpreq)
            .then(async (resp1) => {
              res.status(201).send("User created")
              console.log(resp1.data.OTP)
              //check if it works , if works flush it in 2 mints
              user.otp = resp1.data.OTP
              user.save();

            }).catch((err) => {
              res.status(500).send(err)
            })
        }).catch(err => {
          res.status(500).send(err)
        })
      }
    })

});

router.post("/login", (req, res) => {
  User.find({ cardNumber: req.body.cardNumber }).exec()
    .then(user => {
      //no user exist
      if (user.length < 1) {
        res.status(404).send("user not found")
      } else {
        if (user.phoneNumber) {
          //user found , send otp 
          const otpreq = {
            method: 'get',
            url: `${process.env.twoFactorUrl}/${process.env.twoFactorApiKey}/SMS/${user.phoneNumber}/AUTOGEN3/AMC_login`,
            headers: {
              Accept: 'application.json'
            }
          }
          axios(otpreq)
            .then((resp) => {
              //check if it works , if works flush it in 2 mints
              user.otp = resp.data.OTP
              user.save();
              console.log(resp.data.OTP)
              res.status(200).send("OTP sended")
            }).catch((err) => {
              res.status(500).send(err)
            })
        } else {
          res.status(403).send("Phone number not registerd")
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
      res.status(500).send(err)
    })
})
router.get("/get_by_cardNumber/:number", (req,res) =>{
  User.find({ cardNumber: req.params.number})
  .then((resp) => {
    res.status(200).send(resp)
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
  User.find({ cardNumber: null })
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.post("/update", (req,res) =>{
  const{data} =req.body
  User.findOneAndUpdate({ cardNumber: req.body.cardNumber},data)
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
router.post("/delete/:cardNumber", (req,res) =>{
  User.findOneAndDelete({ cardNumber: req.params.cardNumber},)
  .then((resp) => {
    res.status(200).send(resp)
  })
  .catch((err) => {
    res.status(400).send(err)
  });
})
module.exports = router;
