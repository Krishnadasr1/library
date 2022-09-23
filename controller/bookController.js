const Book = require("../models/book");
const Delivery = require("../models/delivery");
const express = require("express");
const router = express.Router();

router.post("/search", async (req, res) => {
    console.log("<........book search........>")
    const { text, page } = req.body
    if (text != "") {
        const resPerPage = 6;
        const page1 = page || 1;
        const numOfItems = await Book.count({ bookTitle: { '$regex': `^` + text, '$options': 'i' } });
        if (numOfItems < resPerPage) {
            // const txt = text
            await Book.find({ bookTitle: { '$regex': `^` + text, '$options': 'i' } })
                .then((resp) => {
                    res.status(200).send({
                        CurrentPage: 1,
                        TotalPages: 1,
                        Search: text,
                        TotalBooks: numOfItems,
                        data: resp
                    })
                }).catch((err) => {
                    console.log("<........error........>"+err)
                    res.status(500).send("Something went wrong")
                })
        } else {
            //{'$regex' : '^string', '$options' : 'i'}
            await Book.find({ bookTitle: { '$regex': `^` + text, '$options': 'i' } })
                .skip((resPerPage * page1) - resPerPage)
                .limit(resPerPage).then(async (resp) => {
                    res.status(200).send({
                        CurrentPage: page1,
                        TotalPages: Math.ceil(numOfItems / resPerPage),
                        Search: text,
                        TotalBooks: numOfItems,
                        data: resp
                    })
                }).catch((err) => {
                    console.log("<........error........>"+err)
                    res.status(500).send("Something went wrong")
                })
        }
    } else {
        res.status(404).send({
            message: "Please enter a text"
        })
    }
})
router.get("/get_by_accessionNo/:accessionNo", (req, res) => {
    console.log("<........get by accession no........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((resp) => {
            if (resp != null) {
                res.status(200).send(resp)
            }
            else {
                res.status(404).send("No book with such Accession Number")
            }
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.get("/get_trends", async (req, res) => {
    console.log("<........get trends........>")
    await Book.find({ trends: "1" })
        .then(async (resp) => {
            res.status(200).send(resp)
        }).catch((err) => {
            console.log("<........error........>"+err)
            res.status(500).send("Something went wrong")
        })

})
router.get("/get_release", async (req, res) => {
    console.log("<........get new release........>")
    await Book.find({ release: "1" })
        .then(async (resp) => {
            res.status(200).send(resp)
        }).catch((err) => {
            console.log("<........error........>"+err)
            res.status(500).send("Something went wrong")
        })

})


router.post("/add_to_trends/:accessionNo", (req, res) => {
    console.log("<........add to trends........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].trends = "1"
            book[0].save();
            res.status(200).send("Book added to top trends")
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.post("/remove_from_trends/:accessionNo", (req, res) => {
    console.log("<........remove from trends........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].trends = "0"
            book[0].save();
            res.status(200).send("Book removed from top trends")
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.post("/add_to_release/:accessionNo", (req, res) => {
    console.log("<........add to new releasae........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].release = "1"
            book[0].save();
            res.status(200).send("Book added to new relase")
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.post("/remove_from_release/:accessionNo", (req, res) => {
    console.log("<........remove from new releasae........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].release = "0"
            book[0].save();
            res.status(200).send("Book removed from new relase")
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.post("/check_availability/:accessionNo", (req, res) => {
    console.log("<........check availability........>")
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            if (book.length < 1) {
                res.status(404).send("Book Not found")
            } else {
                if ((book[0].hold == "T") || (book[0].checkout == "T")) {
                    res.status(405).send("Book Not available")
                } else {
                    res.status(200).send("Book available")
                }
            }
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.get("/books_in_users_hand", (req, res) => {
    console.log("<........books in users hand........>")
    Delivery.find({ userInHand: "T" })
        .then(resp => {
            res.status(200).send(resp)
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(400).send(err)
        })
})
router.get("/books_in_dp_hand", (req, res) => {
    console.log("<........books in users hand........>")
    Delivery.find({ dpInHand: "T" })
        .then(resp => {
            res.status(200).send(resp)
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(400).send(err)
        })
})
router.get("/get_all_category", (req, res) => {
    console.log("<........get all category........>")
    Book.distinct('subjectHeading')
        .then((resp) => {
            res.status(200).send(resp)
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
router.get("/list_by_category/:category", (req, res) => {
    console.log("<........list by category:{}........>"+req.params.category)
    Book.find({ subjectHeading: req.params.category })
        .then((resp) => {
            res.status(200).send(resp)
        }).catch(err => {
            console.log("<........error........>"+err)
            res.status(500).send(err)
        })
})
module.exports = router;



