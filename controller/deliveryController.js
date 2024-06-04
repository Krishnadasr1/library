const express = require("express");
const router = express.Router();
require("dotenv").config();
const Delivery = require("../models/delivery");
const Hold = require("../models/hold");
const DP = require("../models/dp");
const Book = require("../models/book");



router.post("/place_checkout", (req, res) => {
  console.log("<........place checkout........>")
  const data = req.body
  DP.find({ wardNumber: data.wardNumber })
    .then((user) => {
      if (user.length < 1) {
        res.status(401).send({
          message: "No Delivery Person in the Ward"
        })
      } else {

        Delivery.find({ holdId: data.holdId }).exec()
          .then(delivery => {
            if (delivery.length >= 1) {
              res.status(400).send({
                message: "checkout already exist",
                data: JSON.stringify(delivery)
              })
            } else {
              const delivery = Delivery({
                ...data,
                deliveryPerson: user[0]._id
              })
              delivery.save().then(resp => {
                Hold.findOneAndUpdate({ _id:data.holdId }, { checkoutStatus : "T" })
                  .then(resp1 => {
                    Book.findOneAndUpdate({ accessionNo: data.accessionNo }, { checkout: "T" }).exec()
                    res.status(200).send({message:"order placed successfully",resp})
                  }).catch(err => {
                    console.log("<........error........>"+err)
                    Delivery.findOneAndDelete({ _id: delivery._id }).exec();
                    res.status(400).send(err)
                  })
              }).catch(err => {
                console.log("<........error........>"+err)
                res.status(400).send(err)
              })
            }
          }).catch(err => {
            console.log("<........error........>"+err)
            res.status(400).send("something went wrong")
          })
      }
    }).catch(err => {
      console.log("<........error........>"+err)
      res.status(400).send(err)
    })
})
router.get("/get_all", (req, res) => {
  console.log("<........get all checkouts........>")
  Delivery.find({ checkoutStatus: "T" })
    .then((resp) => {
      res.status(200).send(resp);
    }).catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err);
    })
})
router.get("/get_by_delivery_person/:deliveryPerson_Id", (req, res) => {
  console.log("<........get checkouts by delivery person(delivery controller)........>")
  Delivery.find({
    $and: [{ deliveryPerson: req.params.deliveryPerson_Id },
    { checkoutStatus: "T" }]
  })
    .then((resp) => {
      res.status(200).send(resp);
    }).catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err);
    })
})


router.get("/book_history/:bookName", (req, res) => {
  console.log("-----book details----")
  Delivery.find({bookName: req.params.bookName})
  .then((resp) => {
      res.status(200).send(resp)
  }).catch(err => {
      console.log("<........error........>" + err)
      res.status(400).send(err)
  })
})

router.get("/get_all_return", (req, res) => {
  console.log("<........all return.......>")
  Delivery.find({
    $and: [{ checkoutStatus: "F" },{userInHand: "F"},{dpInHand: "F"},{checkinStatus: "F"}]
  })
    .then((resp) => {
      res.status(200).send(resp);
    }).catch((err) => {
      console.log("<........error........>"+err)
      res.status(400).send(err);
    })
})





module.exports = router;
