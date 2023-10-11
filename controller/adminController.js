const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("../models/admin");
const Delivery = require("../models/delivery");
const Book = require("../models/book");
const User = require("../models/user");
const user = require("../models/user");
const Hold = require("../models/hold");



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
        Book.findOneAndUpdate({accessionNo:resp.accessionNo},{checkout:"F"}).exec()
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
      



// 28-09-2023


router.post("/add_book", (req, res) => {
    
  try {
    const { bookTitle, 
        ISBN, 
        language, 
        publicationPlace ,
        publisherName ,
        publicatonDate ,
        accessionNo,
        author,
        editorOrTranslator ,
        price ,
        pages,
        category ,
        classNumber ,
        callNo ,
        subjectHeading ,
        description,
        image } = req.body;

        Book.find({})
        .then(() => {

        })
        .catch(() => {

        });

    const book = new Book({
        bookTitle,
        ISBN,
        language ,
        publicationPlace ,
        publisherName ,
        publicatonDate ,
        accessionNo,
        author,
        editorOrTranslator ,
        price ,
        pages,
        category ,
        classNumber ,
        callNo ,
        subjectHeading ,
        description,
        image
    });
    book.save();
    res.status(200).send("Book added ");

} catch(error) {
    console.log("error")
}


});



router.get("/all_books", async(req, res) => {
  console.log("<---------fetching books---------->");

  await Book.find({})
    .then(resp => {
      res.status(200).send(resp);
    })
    .catch(err => {
      console.log(err)
      res.send.status(500).json({message:'error occured'})
    });
      
});
    
    
      // if(err){
    //   return res.status(500).json({message : 'error occured'})
    //   res.json({result})

//     }
//   })
// })
// Book.find({})
// .then((books) => {
//   if(books.length < 1){
//     res.send("no books available")
//   } else {
//     res.send(books)
//   }

// }) 
// .catch(err => console.log(err))
// })





// router.put("/update_book/:book_Id", (req, res) => {
//     try {
//         const { bookTitle,
//             ISBN,
//             language ,
//             publicationPlace ,
//             publisherName ,
//             publicatonDate ,
//             accessionNo,
//             author,
//             editorOrTranslator ,
//             price ,
//             pages,
//             category ,
//             classNumber ,
//             callNo ,
//             subjectHeading ,
//             description ,
//             image} = req.body;
    
//         const data = Book.findByIdAndUpdate({_id : req.params.book_Id}, {  
//             bookTitle,
//             ISBN,
//             language ,
//             publicationPlace ,
//             publisherName ,
//             publicatonDate ,
//             accessionNo,
//             author,
//             editorOrTranslator ,
//             price ,
//             pages,
//             category ,
//             classNumber ,
//             callNo ,
//             subjectHeading ,
//             description,
//             image })
//          .then(resp =>{
//              res.status(200).send("updated sucessfully")
//          })
//          .catch(err => {
//             console.log(err);
//          });

//          if(!data) {
//            console.log("Update failed");
//          }   
//     } catch (error) {
//         res.status(500).send("error")
//         console.log(error);
//     }    
// })



router.put("/update_book/:book_Id", (req, res) => {
  console.log("<-----------Update Book Details------------>");
  const data = req.body;
  Book.findByIdAndUpdate({ _id : req.params.book_Id }, data)
  .then(() => {
    res.send("Successfully updated book details.");
  })
  .catch((err) => {
    console.log(err);
    res.send("Error while updating book details.");
  });

});

// router.delete("/delete_book/:book_Id", (req, res) => {
//     Book.findByIdAndDelete({_id : req.params.book_Id })
//     .then(resp => {
//         res.status(200).send("Book deleted successfully")

//     })
//     .catch(error => {
//         console.log("error")
//     })
// });



router.delete("/delete_book/:book_Id", (req, res) => {
  console.log("<------------Delete a Book------------->");

  Book.find({ _id : req.params.book_Id})
  .then((books) => {
    if(books.length < 1) {
      res.send({ message : "Book not available." });
    } else {
      console.log(books[0]);
      if((books[0].hold === "T") || (books[0].checkout === "T")) {
        res.send({ message : "Book deletion not possible, a user holds the book you want to delete."});
      } else {
        Book.findByIdAndDelete({ _id : req.params.book_Id })
        .then(() => {
          res.send({ message : "Book deleted successfully." });
        })
        .catch((err) => {
          res.send({ message : "Error while deleting book." });
          console.log(err)
        })
      }
   
    }
  })
  .catch((err) => {
    res.send({ message :"Error while deleting book." });
    console.log(err);
  });

});



// router.get("/search_user",(req,res) => {
//     User.findById()
//     })

router.put("/update_user/:user_Id", async (req, res) => {
    try {
        const { cardNumber, 
            category, 
            password, 
            houseName, 
            wardName,
            wardNumber,
            postOffice,
            district,
            pincode } = req.body;
    
        const data = User.findByIdAndUpdate({_id : req.params.user_Id}, { cardNumber, 
            category, 
            password, 
            houseName, 
            wardName,
            wardNumber,
            postOffice,
            district,
            pincode })
         .then(resp =>{
             res.status(200).send("updated sucessfully")
         })
         .catch(err => {
            console.log(err);
         });

         if(!data) {
            console.log("no data updation failed")
            
         } 
         
         

    } catch (error) {
        res.status(500).send("error")
    }       

});

// router.delete("/delete_user/:user_Id", (req, res) => {
//     User.findByIdAndDelete({_id : req.params.user_Id })
//     .then(resp => {
//         res.status(200).send("user deleted successfully")

//     })
//     .catch(error => {
//         console.log("error")
//     })
// });



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


  router.get("/get_all_valid_users", (req, res) => {
    console.log("<........get all valid users........>")
    User.find({})
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

module.exports = router;
