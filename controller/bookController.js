const Book = require("../models/book");
const express = require("express");
const router = express.Router();

router.post("/search", async (req, res) => {
    const { text, page } = req.body
    if (text != "") {
        const resPerPage = 6;
        const page1 = page || 1;
        const numOfItems = await Book.count({ bookTitle: { '$regex': text } });
        if (numOfItems < resPerPage) {
            // const txt = text
            await Book.find({ bookTitle: { '$regex': text } })
                .then((resp) => {
                    res.status(200).send({
                        CurrentPage: 1,
                        TotalPages: 1,
                        Search: data.txt,
                        TotalBooks: numOfItems,
                        data: resp
                    })
                }).catch((err) => {
                   res.status(500).send("Something went wrong")
                })
        } else {
            await Book.find({ bookTitle: { '$regex': text } })
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
                    console.log(err);
                    res.status(500).send("Something went wrong")
                })
        }
    } else {
        reject({
            message: "Please enter a text"
        })
    }
})
router.post("/get_by_accessionNo", (req, res) =>{
    Book.find({accessionNo: req.body.accessionNo})
    .then((resp) =>{
        res.status(200).send(resp)
    }).catch(err =>{
        res.status(500).send(err)
    })
})
router.get("/get_trends", async(req, res) =>{          
            await Book.find({ trends:"1"})
               .then(async (resp) => {
                    res.status(200).send(resp)
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send("Something went wrong")
                })
        
})
router.get("/get_release", async(req, res) =>{
    await Book.find({ release:"1"})
    .then(async (resp) => {
         res.status(200).send(resp)
     }).catch((err) => {
         console.log(err);
         res.status(500).send("Something went wrong")
     })

})
       
       
router.post("/add_to_trends", (req, res) =>{
    Book.find({accessionNo: req.body.accessionNo })
    .then((book) =>{
        book[0].trends = "1"
        book[0].save();
        res.status(200).send("Book added to top trends")
    }).catch(err =>{
        res.status(500).send(err)
    })
})
router.post("/add_to_release", (req, res) =>{
    Book.find({accessionNo: req.body.accessionNo })
    .then((book) =>{
        book[0].release = "1"
        book[0].save();
        res.status(200).send("Book added to top trends")
    }).catch(err =>{
        res.status(500).send(err)
    })
})
router.post("/check_availability/:number", (req, res) =>{
    Book.find({accessionNo: req.params.number })
    .then((book) =>{
        if(book.length<1){
            res.status(400).send("Book Not found")   
        }else{
            if((book[0].hold=="T")||(book[0].checkout=="T")){
                res.status(400).send("Book Not available")   
            }else{
                res.status(200).send("Book available")
            }
        }     
    }).catch(err =>{
        console.log(err)
        res.status(500).send(err)
    })
})
module.exports = router;



