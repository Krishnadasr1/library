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
  console.log("<........register user........>")
  const number = req.body.phoneNumber
  console.log("register api called")
  User.find({ phoneNumber: number }).exec()
    .then(user => {
      if (user.length >= 1) {
        if (user[0].otpFirstTimeVerifed == "true") {
          console.log("otp verified")
          res.status(405).send("User Exist.Try another phone number")
        } else {
          console.log("resending otp")
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

        const user = User({
          phoneNumber: number
        })
        user.save().then(resp => {
          console.log("<.........registering new user:resp.......>")
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
              if (resp1.data.Status == "Error") {
                res.status(200).send({ "Success": "User created.", "Error": "OTP service stopped temporarily due to insufficient balance." })
              } else {
                res.status(201).send({ "Success": "User created.OTP sended" })
                //check if it works , if works flush it in 2 mints
                user.otp = resp1.data.OTP
                user.save();
              }
            }).catch((err) => {
              console.log("...........1..........")
              console.log("<........error........>" + err)
              res.status(400).send(err)
            })
        }).catch(err => {
          console.log("...........2..........")
          console.log("<........error........>" + err)
          res.status(400).send(err)
        })
      }
    }).catch(err => {
      console.log("...........3..........")
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })

});

router.post("/login", (req, res) => {
  console.log("<........login user........>")
  User.find({ cardNumber: req.body.cardNumber }).exec()
    .then(user => {
      //no user exist
      if (user.length < 1) {
        res.status(404).send("user not found")
      } else {
        if (user[0].phoneNumber != null) {
          //user found , send otp 
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
                res.status(200).send({ "Success": "Login success", "Error": "OTP service stopped temporarily due to insufficient balance." })
              } else {
                res.status(201).send({ Success: "Login success.OTP sended", user: user[0] })
                //check if it works , if works flush it in 2 mints
                user[0].otp = resp1.data.OTP
                user[0].save();
              }
            }).catch((err) => {
              console.log("<........error........>" + err)
              res.status(400).send(err)
            })
        } else {
          res.status(405).send("Phone number not registerd")
        }
      }
    })
});
router.post("/verify_otp", (req, res) => {
  console.log("<........verify otp user........>")
  User.find({ phoneNumber: req.body.phoneNumber })
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
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })
})
router.post("/application_form_filling", async (req, res) => {
  console.log("<........application form filling user........>")
  const data = req.body
  User.find({ phoneNumber: data.phoneNumber }).then((user) => {
    if (user.length < 1) {
      res.status(404).send("user not found")
    } else {
      //console.log(user)
      User.findOneAndUpdate({ phoneNumber: data.phoneNumber }, data)
        .then((resp) => {
          res.status(200).send("Application form submitted")
        }).catch((err) => {
          console.log("<........error........>" + err)
          res.status(400).send("something went wrong")
        })
    }
  }).catch((err) => {
    console.log("<........error........>" + err)
    res.status(404).send(err)
  })
})
router.get("/get_by_cardNumber/:number", (req, res) => {
  console.log("<........user get by card number........>")
  User.find({ cardNumber: req.params.number })
    .then((user) => {
      if (user.length < 1) {
        res.status(404).send("No user found")
      } else {
        res.status(200).send(user)
      }

    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.get("/get_by_phoneNumber/:number", (req, res) => {
  console.log("<........user get by card number........>")
  User.find({ phoneNumber: req.params.number })
    .then((user) => {
      if (user.length < 1) {
        res.status(404).send("No user found")
      } else {
        res.status(200).send(user)
      }

    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.get("/get_all_valid_users", (req, res) => {
  console.log("<........get all valid users........>")
  User.find({ cardNumber: { $not: { $eq: null } } })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.get("/get_membership_requests", (req, res) => {
  console.log("<........get membership requests........>")
  User.find({
    $and: [{ cardNumber: null }, { wardNumber: { $not: { $eq: null } } }]
  })
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.get("/reject_membership_request/:phoneNumber", (req, res) => {
  console.log("<........reject membership request........>")
  User.findOneAndDelete({ phoneNumber: req.params.phoneNumber })
    .then((resp) => {
      res.status(200).send(req.params.phoneNumber + " memebership request rejected")
    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.post("/accept_membership_request", (req, res) => {
  console.log("<........accept membership request........>")
  const data = req.body
  console.log(data.phoneNumber)
  User.findOneAndUpdate({ phoneNumber: data.phoneNumber }, data)
    .then((resp) => {
      res.status(200).send(resp)
    })
    .catch((err) => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    });
})
router.post("/update", (req, res) => {
  console.log("<........update user........>")
  const data = req.body
  User.find({ phoneNumber: data.phoneNumber }).exec()
    .then(user => {
      if (user.length < 1) {
        res.status(404).send("User not found")
      } else {
        User.findOneAndUpdate({ phoneNumber: data.phoneNumber }, data)
          .then(resp => {
            res.status(200).send("user updated")
          }).catch(err => {
            console.log("<........error........>" + err)
            res.status(400).send("something went wrong")
          })
      }
    }).catch(err => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })

})
router.get("/place_return/:checkout_Id", (req, res) => {
  console.log("<........place return:{}........>" + req.params.checkout_Id)
  Delivery.findOneAndUpdate({ _id: req.params.checkout_Id }, { checkinStatus: "T" })
    .then(resp => {
      res.status(200).send("return placed")
    }).catch(err => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })
})
router.get("/past_read_books/:cardNumber", (req, res) => {
  console.log("<........past read books user........>")
  Delivery.find({
    $and: [{ cardNumber: req.params.cardNumber },
    { userInHand: "F" }]
  })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })
})
router.get("/checkout_by_user/:cardNumber", (req, res) => {
  console.log("<........checkout of user........>")
  Delivery.find({ cardNumber: req.params.cardNumber })
    .then(resp => {
      res.status(200).send(resp)
    }).catch(err => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
    })
})
router.get("/delete/:cardNumber", async (req, res) => {
  console.log("<........delete user........>")
  User.find({ cardNumber: req.params.cardNumber })
    .then((user) => {
      if (user.length < 1) {
        res.status(404).send("No user found")
      } else {
        // console.log(user[0])
        Hold.find({ cardNumber: req.params.cardNumber })
          .then(async hold => {
            //console.log(hold)
            if (hold.length >= 1) {
              res.status(405).send("active hold exists for the user. cancel hold before deleting user")
            } else {
              let deliveries = [];
              //deliveries = await 
              Delivery.find({ cardNumber: req.params.cardNumber }).exec()
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
                        res.status(405).send("checkin pending. Return the books before deleting the user")
                    }else{
                      //res.status(200).send("ready to delete")
                      User.findOneAndDelete({ cardNumber: req.params.cardNumber })
                      .then(resp =>{
                        res.status(200).send("user deleted")
                      }).catch(err =>{
                        console.log(err)
                        res.status(400).send(err)
                      }) 
                    }
                  } else {
                    User.findOneAndDelete({ cardNumber: req.params.cardNumber })
                    .then(resp =>{
                      res.status(200).send("user deleted")
                    }).catch(err =>{
                      console.log(err)
                      res.status(400).send(err)
                    })                   
                  }
                }).catch(err => {
                  console.log("<........error..1........>" + err)
                  res.status(400).send(err)
                })

            }
          }).catch(err => {
            console.log("<........error..2........>" + err)
            res.status(400).send(err)
          })

        // res.status(200).send(user[0])
      }

    }).catch((err) => {
      console.log("<........error..3........>" + err)
      res.status(400).send(err)
    });
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
