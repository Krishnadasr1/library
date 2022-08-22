const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const DP = require("../models/dp");
const Delivery = require("../models/delivery");



router.post("/register", async (req, res) => {
  const number = req.body.phoneNumber
  DP.find({ phoneNumber: number }).exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(403).send("User Exist.Try another phone number")
      } else {

        const user = DP({
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
              res.status(201).send("User created.OTP sended")
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
  DP.find({ phoneNumber: req.body.phoneNumber }).exec()
    .then(user => {
      //no user exist
      if (user.length < 1) {
        res.status(404).send("user not found")
      } else {

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

      }
    })
});
router.post("/verify_otp", (req, res) => {
  DP.find({ phoneNumber: req.body.phoneNumber })
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
router.post("/application_form_filling", async (req, res) => {
  const data = req.body
  DP.find({ phoneNumber: data.phoneNumber }).then((user) => {
    if (user.length < 1) {
      res.status(404).send("user not found")
    } else {
      // if(user.status == "F"){
      //     res.status(400).send("Admin's approval pending")
      // }else{
      //console.log(user)
      DP.findOneAndUpdate({ phoneNumber: data.phoneNumber }, data)
        .then((resp) => {
          res.status(200).send("user updated")
        }).catch((err) => {
          res.status(400).send("something went wrong")
        })
      // }
    }
  }).catch((err) => {
    res.status(400).send(err)
  })
})
router.get("/get_delivery_person_applications", (req, res) => {
  DP.find({ status: "F" })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      res.status(400).send(err)
    });
})
router.post("/approve_delivery_person", (req, res) => {
  const { data } = req.body
  DP.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { status: "T" })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      res.status(400).send(err)
    });
})
router.post("/update", (req, res) => {
  const { data } = req.body
  DP.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, data)
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      res.status(400).send(err)
    });
})
router.get("/get_all_valid_delivery_persons", (req, res) => {
  DP.find({ status: "T" })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      res.status(400).send(err)
    });
})
router.post("/delete/:phoneNumber", (req, res) => {
  DP.findOneAndDelete({ phoneNumber: req.params.phoneNumber },)
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      res.status(400).send(err)
    });
})

router.get("/get_all_delivery/:deliverPersonId", (req, res) => {
  Delivery.find({
    $and: [{ deliveryPerson: req.params.deliverPersonId },
    { checkoutStatus: "Open" }]
  })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      res.status(400).send(err)
    })
})
router.get("/conform_delivery/:id",(req,res) =>{
Delivery.findoneAndUpdate({_id:req.params.id},{checkoutStatus:"Closed",userInHand:"T"})
.then(resp =>{
  res.status(200).send("confirmed delivery")
}).catch(err =>{
  res.status(400).send(err)
})
})
router.get("/get_all_return/:deliveryPersonId", (req, res) => {
  Delivery.find({
    $and:[{deliveryPerson: req.params.deliveryPersonId},
    {returnStatus:"Open"}]
  })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      res.status(400).send(err)
    })
})
router.get("/conform_return/:id",(req,res) =>{
  Delivery.findoneAndUpdate({_id:req.params.id},{returnStatus:"Closed",userInHand:"F"})
  .then(resp =>{
    res.status(200).send("confirmed delivery")
  }).catch(err =>{
    res.status(400).send(err)
  })
  })

module.exports = router;
