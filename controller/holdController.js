const Book = require("../models/book");
const User = require("../models/user");
const Hold = require("../models/hold");

const express = require("express");
const router = express.Router();

router.post("/place_hold", async (req, res) => {
    const data = req.body
    await User.find({ cardNumber: req.body.cardNumber }).exec()
        .then(user => {
            if (user.length <= 0) {
                res.status(400).send("user not found")
            } else {
                Book.find({ accessionNo: data.accessionNo }).then(book => {
                    if (book.length < 1) {
                        res.status(400).send("book not found")
                    }
                    else if ((book[0].hold == "T")) {
                        res.status(405).send("book already on hold")
                    }
                    else {
                        const newHold = Hold({
                            ...data
                        })
                        newHold.save().then(resp => {
                            book[0].hold = "T"
                            book[0].save();
                            res.status(201).send("hold created")
                        }).catch(err => {
                            console.log(err)
                            res.status(400).send("something went wrong")
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    res.status(400).send(err)
                })

            }
        }).catch(err => {
            res.status(400).send(err)
        })

})
router.get("/cancel_hold_user/:hold_Id", async (req, res) => {
    Hold.find({ _id: req.params.hold_Id }).then((hold) => {
        if (hold.checkoutStatus == "T") {
            res.status(405).send({
                message: "can't cancel hold now. you can return book once it is arrived"
            })
        } else {
            //console.log(hold.accessionNo)
            Book.findOneAndUpdate({ accessionNo: hold[0].accessionNo }, { hold: "F" }).exec()
            Hold.findOneAndDelete({ _id: req.params.hold_Id }).exec();
            res.status(200).send("hold cancelled")
        }

    }).catch(err => {
        res.status(400).send(err)
    })
})
router.get("/cancel_hold_admin/:hold_Id", async (req, res) => {
    Hold.find({ _id: req.params.hold_Id }).then((hold) => {
            Book.findOneAndUpdate({ accessionNo: hold[0].accessionNo }, { hold: "F" }).exec()
            Hold.findOneAndDelete({ _id: req.params.hold_Id }).exec();
            res.status(200).send("hold cancelled")

    }).catch(err => {
        res.status(400).send(err)
    })
})
router.get("/get_list", (req, res) => {
    Hold.find( { holdStatus: "T" }).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err)
    })
})
router.get("/get_active_hold_list_user/:cardNumber", (req, res) => {
    Hold.find({
        $and: [{ cardNumber: req.params.cardNumber },
        { holdStatus: "T" }]       
    }).then((resp) => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err)
    })
})

module.exports = router;
