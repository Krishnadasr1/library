const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("../models/admin");
const Delivery = require("../models/delivery");
const Book = require("../models/book");
const User = require("../models/user");
const pdf = require("pdfkit");


router.post("/register", async (req, res) => {
  console.log("<........register admin........>");
  Admin.find({ userName: req.body.userName })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(400).send({
          message: "user exist... Try another userName",
          user: JSON.stringify(user),
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log("<........error........>" + err);
            res.status(400).send(err);
          } else {
            const user = Admin({
              userName: req.body.userName,
              password: hash,
            });
            user.save()
              .then((resp) => {
                res.status(201).send("Admin created");
              })
              .catch((err) => {
                console.log("<........error........>" + err);
                res.status(500).send("Something went wronng");
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log("<........error........>" + err);
      res.status(400).send("something went wrong");
    });
});

router.post("/login", async (req, res) => {
  console.log("<........login admin........>");
  Admin.find({ userName: req.body.userName })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(400).send({
          message: "No User Exist",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, resp) => {
          if (err) {
            console.log("<........error........>" + err);
            res.status(401).send({
              message: "Authentication failed... Incorrect password",
            });
          }
          if (resp) {
            res.status(200).send({
              message: "success",
              user: user,
            });
          } else {
            res.status(401).send({
              message: "Authentication failed",
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log("<........error........>" + err);
      res.status(500).send(err);
    });
});

router.get("/conform_return_by_admin/:checkout_Id", (req, res) => {
  console.log("<........Conform delivery by admin........>");
  Delivery.findOneAndUpdate(
    { _id: req.params.checkout_Id },
    { checkinStatus: "F", dpInHand: "F" }
  )
    .then((resp) => {
      Book.findOneAndUpdate(
        { accessionNo: resp.accessionNo },
        { checkout: "F" }
      ).exec();
      res.status(200).send("return confirmed");
    })
    .catch((err) => {
      console.log("<........error........>" + err);
      res.status(400).send(err);
    });
});
router.get("/get_all_return", (req, res) => {
  console.log("<........get all return by admin........>");
  Delivery.find({ checkinStatus: "T" })
    .then((resp) => {
      res.status(200).send(resp);
    })
    .catch((err) => {
      console.log("<........error........>" + err);
      res.status(400).send(err);
    });
});

router.get("/all_books", async (req, res) => {
  console.log("Fetching all books");
  

    const  page  = req.body;
  
      const resPerPage = 50;
      const page1 = page || 1;
      const numOfItems = await Book.count({});

      if (numOfItems < resPerPage) {
          // const txt = text
        await Book.find({})
        .then((resp) => {
          res.status(200).send({
            CurrentPage: 1,
            TotalPages: 1,
            TotalBooks: numOfItems,
            data: resp
          });
        })
        .catch((err) => {
          console.log("<........error.>"+err);
          res.status(500).send("Something went wrong")
        });

      } else {
          //{'$regex' : '^string', '$options' : 'i'}
        await Book.find({})
        .skip((resPerPage * page1) - resPerPage)
        .limit(resPerPage)
        .then(async (resp) => {
          res.status(200).send({
            CurrentPage: page1,
            TotalPages: Math.ceil(numOfItems / resPerPage),
            TotalBooks: numOfItems,
            data: resp
          });
        })
        .catch((err) => {
          console.log("<...error........>"+err)
          res.status(500).send("Something went wrong")
        });
      }
});



//Add, edit, delete books.

router.post("/add_new_book", (req, res) => {
  console.log("<-----------Add New Book------------>");

  Book.find({ accessionNo : req.body.accessionNo})
  .then((books) => {
    if(books.length >= 1) {
      res.send("Book already exist.");
    } else {
      const book = new Book(req.body);
      book.save();
      res.send("Book added to the library.");
    }
  })
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

});

router.put("/update_book/:book_Id", (req, res) => {
  console.log("Update Book Details");
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

router.delete("/delete_book/:book_Id", (req, res) => {
  console.log("delete a book");

  Book.find({ _id : req.params.book_Id})
  .then((books) => {
    if(books.length < 1) {
      res.send({ message : "Book not available." });
    } else {
      if((books[0].hold === "T") || (books[0].checkout === "T")) {
        res.send({ message : "Book deletion not possible, a user holds the book you want to delete."});
      } else {
        Book.findOneAndDelete({ _id : req.params.book_Id })
        .then(() => {
          res.send({ message : "Book deleted successfully." });
        })
        .catch((err) => {
          res.send({ message : "Error while deleting book." });
          console.log(err);
        })
      }
    }
  })
  .catch((err) => {
    res.send({ message :"Error while deleting book." });
    console.log(err);
  });

});


//Search book by titleName, authorName, accessionNo, subject.

router.post("/search_books", async (req, res) => {
  console.log("Search book by bookTitle, author Name, accessionNo, subjectHeading")
  
  const { text, page } = req.body;
  
  if (text != "") {
      const resPerPage = 6;
      const page1 = page || 1;
      const numOfItems = await Book.count({ $or : [
        { bookTitle : { '$regex': `^` + text, '$options': 'i' } },
        { author : { '$regex': `^` + text, '$options': 'i' } },
        { accessionNo : { '$regex': `^` + text, '$options': 'i' } },
        { subjectHeading : { '$regex': `^` + text, '$options': 'i' } }
      ] });

      if (numOfItems < resPerPage) {
          console.log(".......................")
        await Book.find({ $or : [
          { bookTitle : { '$regex': `^` + text, '$options': 'i' } },
          { author : { '$regex': `^` + text, '$options': 'i' } },
          { accessionNo : { '$regex': `^` + text, '$options': 'i' } },
          { subjectHeading : { '$regex': `^` + text, '$options': 'i' } }
        ] })
        .then((resp) => {
          res.status(200).send({
            CurrentPage: 1,
            TotalPages: 1,
            Category : text,
            TotalBooks: numOfItems,
            data: resp,
            
          });
        })
        .catch((err) => {
          console.log("<........error........>"+err);
          res.status(500).send("Something went wrong")
        });

      } else {
          //{'$regex' : '^string', '$options' : 'i'}
          
        await Book.find({ $or : [
            { bookTitle : { '$regex': `^` + text, '$options': 'i' } },
            { author : { '$regex': `^` + text, '$options': 'i' } },
            { accessionNo : { '$regex': `^` + text, '$options': 'i' } },
            { subjectHeading : { '$regex': `^` + text, '$options': 'i' } }
        ] })
        .skip((resPerPage * page1) - resPerPage)
        .limit(resPerPage)
        .then(async (resp) => {
          res.status(200).send({
            CurrentPage: page1,
            TotalPages: Math.ceil(numOfItems / resPerPage),
            Category: text,
            TotalBooks: numOfItems,
            data: resp
          });
        })
        .catch((err) => {
          console.log("<........error........>"+err)
          res.status(500).send("Something went wrong")
        });
      }

  } else {
    res.status(404).send({ message: "Please enter a category" });
  }

});


//Details of book the user requested.


//Make reference books issue restricted.

//Membership details edit , delete.

router.put("update_user/:cardNumber", (req, res) => {
  console.log("<-----------Update User Details------------>");
  
  const data = req.body;

  User.findOneAndUpdate({ cardNumber : req.params.cardNumber}, data)
  .then(user => {
    res.send({ message : "Member details updated successfully.", user});
  })
  .catch((err) => {
    res.send({ message : "Error while updating member." });
    console.log(err);
  });

});




router.put("update/:_id",async(req,res) =>{
  console.log("update");
  const data = req.body;

  User.findByIdAndUpdate({_id : req.params._id} ,data)
  .then(user =>{
    res.send({ message : "updated successfully",user});
  })
  .catch(err =>{
    res.send({message: "error"});
    console.log(err);
  });
});


//Search member using membershipNo(cardNumber) and Name.

router.post("/search_users", async (req, res) => {
  console.log("Search User")
  
  const { text, page } = req.body;
  
  if (text != "") {
      const resPerPage = 6;
      const page1 = page || 1;
      const numOfItems = await User.count({ $or : [
        { cardNumber : { '$regex': `^` + text, '$options': 'i' } },
        { firstName : { '$regex': `^` + text, '$options': 'i' } },
        { lastName : { '$regex': `^` + text, '$options': 'i' } }
      ] });

      if (numOfItems < resPerPage) {
          // const txt = text
        await User.find({ $or : [
          { cardNumber : { '$regex': `^` + text, '$options': 'i' } },
          { firstName : { '$regex': `^` + text, '$options': 'i' } },
          { lastName : { '$regex': `^` + text, '$options': 'i' } }
        ] })
        .then((resp) => {
          res.status(200).send({
            CurrentPage: 1,
            TotalPages: 1,
            Category: text,
            noOfUsers: numOfItems,
            data: resp
          });
        })
        .catch((err) => {
          console.log("<........error........>"+err);
          res.status(500).send("Something went wrong")
        });

      } else {
          //{'$regex' : '^string', '$options' : 'i'}
        await User.find({ $or : [
            { cardNumber : { '$regex': `^` + text, '$options': 'i' } },
            { firstName : { '$regex': `^` + text, '$options': 'i' } },
            { lastName : { '$regex': `^` + text, '$options': 'i' } }
        ] })
        .skip((resPerPage * page1) - resPerPage)
        .limit(resPerPage)
        .then(async (resp) => {
          res.status(200).send({
            CurrentPage: page1,
            TotalPages: Math.ceil(numOfItems / resPerPage),
            Category: text,
            noOfUsers: numOfItems,
            data: resp
          });
        })
        .catch((err) => {
          console.log("<........error........>"+err)
          res.status(500).send("Something went wrong")
        });
      }

  } else {
    res.status(404).send({ message: "Please enter a category" });
  }

});

//Members detailed list by 1)name, 2)date, 3)membership type, 4)membershipNo.

router.get("/list_users_by_name", (req, res) => {
});

router.get("/list_users_by_date", (req, res) => {
});

router.get("/list_users_by_type_of_membership", (req, res) => {
});

router.get("/membershipNo", (req, res) => {
});



//Member details and Book details download and print.


//Delivery person details edit and delete.

router.put("/update_delivery_person/:deliverPerson_Id", (req, res) => {
  console.log("<-----------Update Delivery Person Details------------>");
  
  const data = req.body;

  DP.findByIdAndUpdate({ _id : req.params.deliverPerson_Id}, data)
  .then(user => {
    res.send({ message : "Delivery person details updated successfully.", user});
  })
  .catch((err) => {
    res.send({ message : "Error while updating delivery person details." });
    console.log(err);
  });
});

router.delete("/delete_deliveryPerson/:deliveryPerson_Id", (req, res) => {
  console.log("<-----------Delete Delivery Person------------>");

  // Delivery createed will contain delivery person id, so it's better to update an old delivery details person with new one.
});



//StockNo , edit stockNo.

//Set return date for books.

//List books by StockNo, author, title, subject.

//Download and print book list by StockNo, author, title, subject.

//Book history and members history search.

// router.post("/search_all_books", async( req,res ) => {
// console.log("searching books")

// const {text,page} = req.body;
// if (text!=""){
//   const resPerPage = 6;
//   const page1 = page || 1;
//   const numOfItems = await Book.count({
//     $or : [{bookTitle :bookTitle},{author:author},{accessionNo:accessionNo}]
//   });

//   if (numOfItems<resPerPage){
//     await Book.find({ $or: [{bookTitle:bookTitle},{author:author},{accessionNo:accessionNo}]
//     })
//     .then((resp) =>{
//       res.status(200).send({
//         CurrentPage: 1,
//         TotalPages : 1,
//         Category:text,
//         data:resp,
//       });
//     })
//   }
// }
// })





router.get('/questions-pdf',async (req, res)=>{
  const data = await User.find()
  const pdfDoc = new pdf();
  const fieldstoinclude = ['email','firstName','lastName','cardNumber'];
  // fieldstoinclude.forEach(fields =>{
  //   pdfDoc.text(fields)
  //    });
      data.forEach(User =>{
      fieldstoinclude.forEach(fields => {
        pdfDoc.text(`${fields} : ${User[fields].toString()}`);
      });
      pdfDoc.text('\n');
     });
// Add content to the PDF document
// pdfDoc.text("Qus");
// pdfDoc.text(data)
// End the PDF document
pdfDoc.end();
// Send the PDF document to the user as a download
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
pdfDoc.pipe(res);
});





module.exports = router;
