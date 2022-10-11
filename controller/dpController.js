const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const DP = require("../models/dp");
const Delivery = require("../models/delivery");
const Book = require("../models/book");
const Hold = require("../models/hold");





router.post("/register", async (req, res) => {
  console.log("<........register delivery person........>")
  const number = req.body.phoneNumber
  DP.find({ phoneNumber: number }).exec()
    .then(user => {
      if (user.length >= 1) {
        if (user[0].otpFirstTimeVerifed == "true") {
          res.status(405).send("User Exist.Try another phone number")
        } else {
         
            console.log("<.........resending otp for verification : register user.......>")
            const otpreq = {
              method: 'get',
              url: `${process.env.TWOFACTOR_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${user[0].phoneNumber}/AUTOGEN2`,
              headers: {
                Accept: 'application.json'
              }
            }
            axios(otpreq)
              .then(async (resp1) => {
                console.log(resp1.data.Status)
                if (resp1.data.Status == "Error") {
                  res.status(200).send({ "Success": "User Accepted", "Error": "OTP service stopped temporarily due to insufficient balance." })
                } else {
                  res.status(201).send({ "Success": "Resending OTP for verification" })
                  //check if it works , if works flush it in 2 mints
                  user[0].otp = resp1.data.OTP
                  user[0].save();
                }
              }).catch((err) => {
                console.log("...........1..........")
                console.log("<........error........>" + err)
                res.status(400).send(err)
              })
          
        }
    } else {

        const user = DP({
          phoneNumber: number
        })
        user.save().then(resp => {
          const otpreq = {
            method: 'get',
            url: `${process.env.TWOFACTOR_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${user.phoneNumber}/AUTOGEN2`,
            headers: {
              Accept: 'application.json'
            }
          }
          axios(otpreq)
            .then(async (resp1) => {
              res.status(201).send("User created.OTP sended")
              //check if it works , if works flush it in 2 mints
              user.otp = resp1.data.OTP
              user.save();

            }).catch((err) => {
              console.log("<........error........>"+err)
              res.status(500).send(err)
            })
        }).catch(err => {
          console.log("<........error........>"+err)
          res.status(500).send(err)
        })
      }
    })

});
router.post("/login", (req, res) => {
  console.log("<........login delivery person........>")
  DP.find({ phoneNumber: req.body.phoneNumber }).exec()
    .then(user => {
      //no user exist
      if (user.length < 1) {
        res.status(404).send("user not found")
      } else {
//console.log(user[0])
        //user found , send otp 
        const otpreq = {
          method: 'get',
          url: `${process.env.TWOFACTOR_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${user[0].phoneNumber}/AUTOGEN2`,          headers: {
            Accept: 'application.json'
          }
        }
        axios(otpreq)
        .then(async (resp1) => {
          console.log(resp1.data.Status)
          if (resp1.data.Status == "Error") {
            res.status(200).send({ "Success": "Login success.", "Error": "OTP service stopped temporarily due to insufficient balance." })
          } else {
            res.status(201).send({ Success: "Login success.OTP sended",user:user[0] })
            //check if it works , if works flush it in 2 mints
            user[0].otp = resp1.data.OTP
            user[0].save();
          }
        }).catch((err) => {
            console.log("<........error........>"+err)
            res.status(400).send(err)
          })

      }
    }).catch(err =>{
      console.log("<........error........>"+err)
      res.status(400).send(err)
    })
});
router.post("/verify_otp", (req, res) => {
  console.log("<........verify otp delivery partner........>")
  DP.find({ phoneNumber: req.body.phoneNumber })
    .then(user => {
      if (user.length < 1) {
        res.status(401).send("User not found")
      } else {
        if (user[0].otp == req.body.OTP) {
          user[0].otp = null;
          user[0].otpFirstTimeVerifed = "true";
          user[0].save();
          res.status(200).send("Success")
        } else {
          res.status(400).send("Invalid OTP")
        }
      }
    }).catch(err => {
      console.log("<........error........>"+err)
      res.status(500).send(err)
    })
})
router.post("/application_form_filling", async (req, res) => {
  console.log("<........application form filling delivery partner........>")
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
          res.status(200).send("application form submitted")
        }).catch((err) => {
          console.log("<........error........>"+err)
          res.status(400).send("something went wrong")
        })
      // }
    }
  }).catch((err) => {
    console.log("<........error........>"+err)
    res.status(400).send(err)
  })
})
router.get("/get_delivery_person_applications", (req, res) => {
  console.log("<........get delivery person application........>")
  DP.find({
    $and: [{ status:"F" },
    { name: { $not: { $eq: null } } }]
  })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    });
})
router.post("/approve_delivery_person", (req, res) => {
  console.log("<........approve delivery person........>")
  const { data } = req.body
  DP.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { wardNumber:req.body.wardNumber,status: "T" })
    .then((resp) => {
      res.status(200).send("Approved the delivery person")
    })
    .catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    });
})
router.post("/update", (req, res) => {
  console.log("<........update delivery person........>")
  const { data } = req.body
  DP.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, data)
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    });
})
router.get("/get_all_valid_delivery_persons", (req, res) => {
  console.log("<........get all valid delivery person........>")
  DP.find({ status: "T" })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    });
})
router.get("/delete/:phoneNumber", (req, res) => {
  console.log("<........delete delivery person........>")
  DP.find({ phoneNumber: req.params.phoneNumber },)
    .then((resp) => {
      let deliveries = [];
      Delivery.find({ deliveryPerson: resp[0]._id }).exec()
      .then(delivery => {
        let status = "T"
        deliveries = delivery
        //console.log(deliveries)
        if (delivery.length >= 1) {
          deliveries.forEach(deliveries => {
            if ((deliveries.checkoutStatus = "T") || (deliveries.checkinStatus = "T") || (deliveries.userInHand = "T") || (deliveries.dpInHand = "T")) {
              status = "F"
            } 
          })
          if(status =="F"){
              res.status(405).send("checkin pending. Return the books before deleting the Delivery partner")
          }else{
            //res.status(200).send("ready to delete")
            DP.findOneAndDelete({  phoneNumber: req.params.phoneNumber })
            .then(resp =>{
              res.status(200).send("delivery person deleted")
            }).catch(err =>{
              console.log(err)
              res.status(400).send(err)
            }) 
          }
        } else {
          DP.findOneAndDelete({  phoneNumber: req.params.phoneNumber })
          .then(resp =>{
            res.status(200).send("delivery person deleted")
          }).catch(err =>{
            console.log(err)
            res.status(400).send(err)
          })                   
        }
      }).catch(err => {
        console.log("<........error..1........>" + err)
        res.status(400).send(err)
      })    })
    .catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    });
})

router.get("/get_all_delivery_by_person/:deliverPerson_Id", (req, res) => {
  console.log("<........get delivery by person(dp controller)........>")
  Delivery.find({
    $and: [{ deliveryPerson: req.params.deliverPerson_Id },
    { checkoutStatus: "T" }]
  })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    })
})
router.get("/conform_delivery/:checkout_Id",(req,res) =>{
  console.log("<........conform delivery by delivery partner........>")
Delivery.findOneAndUpdate({_id:req.params.checkout_Id},{userInHand:"T"})
.then(resp =>{
  Book.findOneAndUpdate({accessionNo:resp.accessionNo},{hold:"F"}).exec()
  Hold.findOneAndDelete({_id:resp.holdId}).exec()
  res.status(200).send("delivery conformed")
}).catch(err =>{
  console.log("<........error........>"+err)
  res.status(400).send(err)
})
})
router.get("/get_all_return/:deliveryPerson_Id", (req, res) => {
  console.log("<........get all return by delivery person........>")
  Delivery.find({
    $and:[{deliveryPerson: req.params.deliveryPerson_Id},
    {checkinStatus:"T"}]
  })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    })
})
router.get("/conform_return_deliveryPerson/:checkout_Id",(req,res) =>{
  console.log("<........conform return by delivery person........>")
  Delivery.findOneAndUpdate({_id:req.params.checkout_Id},{userInHand:"F",checkoutStatus:"F",dpInHand:"T"})
  .then(resp =>{
   // Book.findOneAndUpdate({accessionNo:resp.accessionNo},{checkout:"F"}).exec()
   // console.log(resp)
    res.status(200).send("return confirmed")
  }).catch(err =>{
    console.log("<........error........>"+err)
    res.status(400).send(err)
  })
  })
  router.get("/past_orders/:deliveryPerson_Id", (req, res) => {
    console.log("<........past orders by delivery person........>")
    Delivery.find({
      $and:[{deliveryPerson: req.params.deliveryPerson_Id},
      {checkinStatus:"F"}]
    })
      .then(resp => {
        res.status(200).send(resp)
      }).catch(err => {
        console.log("<........error........>"+err)
        res.status(400).send(err)
      })
  })

module.exports = router;
