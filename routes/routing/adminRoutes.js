const express = require("express");
const router = express.Router();
const Book = require("../../models/book");


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getFileStream } = require('../../s3')


const {
    RegisterAdmin,
    LoginAdmin,
    CreateWM,
    ViewWM,
    ViewAllWM,
    UpdateWM,
    DeleteWM,
    CreateBoy,
    UpdateBoy,
    DeleteBoy,
    AddBook,
    DeleteBook,
    UpdateBook,
    GetBook,
    GetBookByCategory,
    AddImage,
    CorrectImage,
    ListUsersWithNoPatronId,
    ListUsersWithPatronId,
    PlaceCheckout,
    ListBoys,
    ListAllCheckIn,
    ConformReturn,
    AddBookTrends,
    RemoveBookTrends,
    AddBookRelease,
    RemoveBookRelease
} = require("../../controllers/adminControllers");

router.post("/register", (req, res) => {
    RegisterAdmin(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/login", (req, res) => {
    LoginAdmin(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/add-member", (req, res) => {
    CreateWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/add-boy", (req, res) => {
    CreateBoy(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/view-member", (req, res) => {
    ViewWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.get("/view-member-all", (req, res) => {
    ViewAllWM().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/update-member", (req, res) => {
    UpdateWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/delete-member", (req, res) => {
    DeleteWM(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/update-boy", (req, res) => {
    UpdateBoy(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/delete-boy", (req, res) => {
    DeleteBoy(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/add-book", (req, res) => {
    console.log(req.body)
    AddBook(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/delete-book", (req, res) => {
    console.log(req.body)
    DeleteBook(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(400).json(err)
    })
});
router.post("/update-book", (req, res) => {
    console.log(req.body)
    UpdateBook(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/get-book", (req, res) => {
    console.log(req.body)
    GetBook(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/get-book-by-category", (req, res) => {
    console.log(req.body)
    GetBookByCategory(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
})
router.post("/add-book-top-trends", (req, res) => {
    console.log(req.body)
    AddBookTrends(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/remove-book-top-trends", (req, res) => {
    console.log(req.body)
    RemoveBookTrends(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/add-book-new-release", (req, res) => {
    console.log(req.body)
    AddBookRelease(req.body).then(resp => {

        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/remove-book-new-release", (req, res) => {
    console.log(req.body)
    RemoveBookRelease(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});

router.get("/get-book/image/:id", async (req, res, err) => {
    
    let book = await Book.findOne({ biblioId: req.params.id }).exec();
    if (book != null) {
        console.log(book.image)
        if (book.image != null && book.image != "") {
            let readStream;
            readStream = getFileStream(book.image)
            readStream.pipe(res)
            readStream.on('error', function () {
                res.status(404).send("Error on S3 bucket key:No such key");
            });
        
        } else {
            res.status(404).send('Image Not Found');
        }
    } else {
        res.status(404).send('Book Not Found');
    }

})
router.get("/correct-image-id", async (req, res) => {
    CorrectImage().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.post('/add-book/image/:id', upload.single('image'), (req, res) => {
    // console.log(req.file)
    AddImage(req.file, req.params).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
})


router.get("/list-membership-requests", (req, res) => {
    ListUsersWithNoPatronId().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.get("/list-all-users", (req, res) => {
    ListUsersWithPatronId().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

router.get("/list-all-boys", (req, res) => {
    ListBoys().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/place-checkout", (req, res) => {
    PlaceCheckout(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.get("/list-all-checkin", (req, res) => {
    ListAllCheckIn().then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});
router.post("/conform-return", (req, res) => {
    ConformReturn(req.body).then(resp => {
        res.status(200).json(resp)
    }).catch(err => {
        res.status(500).json(err)
    })
});


module.exports = router;
