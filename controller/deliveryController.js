const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Delivery = require("../models/delivery");
const Hold = require("../models/hold");
const DP = require("../models/dp");



router.post("/place_checkout", (req,res) =>{
    const data = req.body
     DP.find({ wardNumber: data.wardNumber })
    .then((user) => {
      if (user.length < 1) {
        res.status(401).send({
          message: "No Delivery Person in the Ward"
        })
      } else {
        const delivery = Delivery({
          ...data,
          deliveryPerson:user[0]._id
        })
        delivery.save().then(resp => {
          Hold.findOneAndUpdate({accessionNo:data.accessionNo},{checkoutStatus:"T"})
          .then(resp =>{
            res.status(200).send(resp)
          }).catch(err =>{
            Delivery.findOneAndDelete({_id:delivery._id}).exec();
            res.status(400).send(err)
          })
        }).catch(err => {
          console.log(err)
          res.status(400).send(err)
        })
      }
    }).catch(err =>{
        res.status(400).send(err)
    })
})
router.get("/get_all",(req,res) =>{
    Delivery.find()
    .then((resp) => {
      res.status(200).send(resp);
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    })
})
router.get("/get_by_delivery_person/:deliveryPersonId",(req,res) =>{
    Delivery.find({deliveryPerson:req.params.deliveryPersonId})
    .then((resp) => {
      res.status(200).send(resp);
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    })
})






module.exports = router;
