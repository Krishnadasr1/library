const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("../models/admin");
const Delivery = require("../models/delivery");
const Book = require("../models/book");




router.post("/register", async (req, res) => {
console.log("<........register admin........>")
    Admin.find({ userName: req.body.userName }).exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(400).send({
                    message: "user exist... Try another userName",
                    user: JSON.stringify(user)
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log("<........error........>"+err)
                        res.status(400).send(err)
                    } else {
                        const user = Admin({
                            userName: req.body.userName,
                            password: hash
                        })
                        user.save().then(resp => {
                            res.status(201).send("Admin created")
                        }).catch(err => {
                            console.log("<........error........>"+err)
                            res.status(500).send("Something went wronng")
                        })
                    }
                })
            }
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(400).send("something went wrong")
        })
})

router.post("/login", async (req, res) => {
    console.log("<........login admin........>")
    Admin.find({ userName: req.body.userName }).exec()
        .then(user => {
            if (user.length < 1) {
                res.status(400).send({
                    message: "No User Exist"
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, resp) => {

                    if (err) {
                        console.log("<........error........>"+err)
                        res.status(401).send({
                            message: "Authentication failed... Incorrect password"
                        })
                    }
                    if (resp) {
                        res.status(200).send({
                            message: "success",
                            user: user

                        })
                    } else {
                        res.status(401).send({
                            message: "Authentication failed"
                        })
                    }

                })
            }
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.get("/conform_return_by_admin/:checkout_Id",(req,res) =>{
    console.log("<........Conform delivery by admin........>")
    Delivery.findOneAndUpdate({_id:req.params.checkout_Id},{checkinStatus:"F",dpInHand:"F"})
    .then(resp =>{
        Book.findOneAndUpdate({accessionNo:resp.accessionNo},{hold:"F",checkout:"F"})
      res.status(200).send("return confirmed")
    }).catch(err =>{
        console.log("<........error........>"+err)
        res.status(400).send(err)
    })
    })
    router.get("/get_all_return", (req, res) => {
        console.log("<........get all return by admin........>")
        Delivery.find({checkinStatus:"T"})
          .then(resp => {
            res.status(200).send(resp)
          }).catch(err => {
            console.log("<........error........>"+err)
            res.status(400).send(err)
          })
      })
      
  


module.exports = router;
