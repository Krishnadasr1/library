const Book = require("../models/book");
const express = require("express");
const router = express.Router();

router.post("/search", async (req, res) => {
    const { text, page } = req.body
    if (text != "") {
        const resPerPage = 6;
        const page1 = page || 1;
        const numOfItems = await Book.count({ bookTitle: { '$regex': `^` + text, '$options': 'i' } });
        if (numOfItems < resPerPage) {
            // const txt = text
            await Book.find({ bookTitle: { '$regex': `^` + text, '$options': 'i' } })
                .then((resp) => {
                    console.log(resp)
                    res.status(200).send({
                        CurrentPage: 1,
                        TotalPages: 1,
                        Search: text,
                        TotalBooks: numOfItems,
                        data: resp
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).send("Something went wrong")
                })
        } else {
            //{'$regex' : '^string', '$options' : 'i'}
            await Book.find({ bookTitle: { '$regex': `^` + text, '$options': 'i' } })
                .skip((resPerPage * page1) - resPerPage)
                .limit(resPerPage).then(async (resp) => {
                    console.log(resp)
                    res.status(200).send({
                        CurrentPage: page1,
                        TotalPages: Math.ceil(numOfItems / resPerPage),
                        Search: text,
                        TotalBooks: numOfItems,
                        data: resp
                    })
                }).catch((err) => {
                    console.log(err);
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
    Book.find({ accessionNo: req.params.accessionNo })
        //console.log(book)
        .then((resp) => {
            console.log(resp)
            if (resp != null) {
                res.status(200).send(resp)
            }
            else {
                res.status(404).send("No book with such Accession Number")
            }
        }).catch(err => {
            res.status(500).send(err)
        })
})
router.get("/get_trends", async (req, res) => {
    await Book.find({ trends: "1" })
        .then(async (resp) => {
            res.status(200).send(resp)
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Something went wrong")
        })

})
router.get("/get_release", async (req, res) => {
    await Book.find({ release: "1" })
        .then(async (resp) => {
            res.status(200).send(resp)
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Something went wrong")
        })

})


router.post("/add_to_trends/:accessionNo", (req, res) => {
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].trends = "1"
            book[0].save();
            res.status(200).send("Book added to top trends")
        }).catch(err => {
            res.status(500).send(err)
        })
})
router.post("/add_to_release/:accessionNo", (req, res) => {
    Book.find({ accessionNo: req.params.accessionNo })
        .then((book) => {
            book[0].release = "1"
            book[0].save();
            res.status(200).send("Book added to new relase")
        }).catch(err => {
            res.status(500).send(err)
        })
})
router.post("/check_availability/:accessionNo", (req, res) => {
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
            console.log(err)
            res.status(500).send(err)
        })
})
router.get("/books_in_users_hand",(req,res) =>{
    Delivery.find({userInHand:"T"})
    .then(resp =>{
      res.status(200).send(resp)
    }).catch(err =>{
        console.log(err)
      res.status(400).send(err)
    })
    })
module.exports = router;



