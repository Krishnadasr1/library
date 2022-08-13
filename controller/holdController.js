const Book = require("../models/book");
const User = require("../models/user");
const Hold = require("../models/hold");

const express = require("express");
const user = require("../models/user");
const book = require("../models/book");
const router = express.Router();

router.post("/place_hold_from_user", (req, res) => {
    User.find({ cardNumber: req.body.cardNumber }).then(resp => {
        if (user.length < 1) {
            res.status(400).status("user not found")
        } else {
            Book.find({ accessionNo: req.body.accessionNo }).then(resp => {
                if (book.length < 1) {
                    res.status(400).status("book not found")
                } else {
                    const newHold = Hold({
                        accessionNo: req.body.accessionNo,
                        cardNumber: req.body.cardNumber,
                        userName: req.body.userName,
                        houseName: req.body.houseName,
                        wardName: req.body.wardName,
                        wardNumber: req.body.wardNumber,
                        postOffice: req.body.postOffice,
                        pinCode: req.body.pinCode,
                        phoneNumber: req.body.phoneNumber
                    })
                    newHold.save().then(resp => {
                        res.status(201).send("hold created")
                    }).catch(err => {
                        res.status(500).send("something went wrong")
                    })
                }
            })

        }
    })

})


module.exports = router;
