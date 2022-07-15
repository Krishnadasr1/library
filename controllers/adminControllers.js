
require("dotenv").config();
const Admin = require("../models/admin");
const WM = require("../models/member");
const Book = require("../models/book");
const Boy = require("../models/boy");
const Delivery = require("../models/delivery");
const User = require("../models/user");


const bcrypt = require("bcryptjs");
require("dotenv").config();
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const { uploadFile } = require('../s3')


const RegisterAdmin = (data) => {
  return new Promise((resolve, reject) => {
    Admin.find({ user_name: data.user_name }).exec()
      .then(user => {
        if (user.length >= 1) {
          reject({
            message: "user exist... Try another userName",
            user: JSON.stringify(user)
          })
        } else {
          bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) {
              reject(err)
            } else {
              const user = Admin({
                ...data,
                password: hash
              })
              user.save().then(resp => {
                resolve(resp)
              }).catch(err => {
                reject(err)
              })
            }
          })
        }
      })
  })
}
const LoginAdmin = (data) => {
  return new Promise((resolve, reject) => {
    Admin.find({ user_name: data.user_name }).exec()
      .then(user => {
        if (user.length < 1) {
          reject({
            message: "No User Exist"
          })
        }
        bcrypt.compare(data.password, user[0].password, (err, resp) => {
          if (err) {
            reject({
              message: "Authentication failed... Incorrect password"
            })
          }
          if (resp) {
            resolve({
              message: "success",
              user: user

            })
          }
          reject({
            message: "Authentication failed"
          })
        })
      }).catch(err => {
        reject(err)
      })
  })

}
const CreateWM = (data) => {
  return new Promise((resolve, reject) => {
    WM.find({ phone_number: data.phone_number }).exec()
      .then(user => {
        if (user.length >= 1) {
          reject({
            message: "Ward Memeber exist... Try another phone number",
            user: JSON.stringify(user)
          })
        } else {
          bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) {
              reject(err)
            } else {
              const user = WM({
                ...data,
                password: hash
              })
              user.save().then(resp => {
                resolve(resp)
              }).catch(err => {
                reject(err)
              })
            }
          })
        }
      })
  })
}
const CreateBoy = (data) => {
  return new Promise((resolve, reject) => {
    Boy.find({ phone_number: data.phone_number }).exec()
      .then(user => {
        if (user.length >= 1) {
          reject({
            message: "User exist... Try another phone number",
            user: JSON.stringify(user)
          })
        } else {
          bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) {
              reject(err)
            } else {
              const user = Boy({
                ...data,
                password: hash
              })
              user.save().then(resp => {
                resolve(resp)
              }).catch(err => {
                reject(err)
              })
            }
          })
        }
      })
  })
}
const ViewWM = (data) => {
  return new Promise(async (resolve, reject) => {
    await WM.findOne({ phone_number: data.phone_number })
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}
const ViewAllWM = (data) => {
  return new Promise(async (resolve, reject) => {
    await WM.find()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}
const ListBoys = () => {
  return new Promise(async (resolve, reject) => {
    await Boy.find()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}
const UpdateWM = (data) => {
  return new Promise(async (resolve, reject) => {
    await WM.findOneAndUpdate({ phone_number: data.phone_number }, data).exec()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}
const DeleteWM = (data) => {
  return new Promise(async (resolve, reject) => {
    await WM.findOneAndDelete({ phone_number: data.phone_number }).exec()
      .then((user) => {
        resolve({
          message: "Ward member deleted"
        });
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      });
  });
}
const UpdateBoy = (data) => {
  return new Promise(async (resolve, reject) => {
    await Boy.findOneAndUpdate({ phone_number: data.phone_number }, data).exec()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}
const DeleteBoy = (data) => {
  return new Promise(async (resolve, reject) => {
    await Boy.findOneAndDelete({ phone_number: data.phone_number }).exec()
      .then((user) => {
        resolve({
          message: "delivery person removed"
        });
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      });
  });
}
const AddBook = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data.products)
    const book = new Book({
      ...data
    });
    book.save()
      .then(async (resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
  })
}

const DeleteBook= (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data.products)
await Book.findOneAndRemove({biblioId:data.biblioId})
      .then( (resp) => {
        resolve("deleted "+resp.biblioId);
      }).catch((err) => {
        console.log(err);
        console.log("Book not found")
        reject(err);
      })
  })
}
const UpdateBook = (data) => {
  return new Promise(async (resolve, reject) => {
 Book.findOneAndUpdate({biblioId:data.biblioId},data)
      .then(async (resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
  })
}
const GetBook = (data) => {
  return new Promise(async (resolve, reject) => {
 Book.find({biblioId:data.biblioId})
      .then(async (resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
  })
}
const GetBookByCategory = (data) => {
  return new Promise(async (resolve, reject) => {
 Book.find({category:data.category})
      .then(async (resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
  })
}
const AddImage = (data, data1) => {
  return new Promise(async (resolve, reject) => {
    const file = data
    const id = data1.id
    console.log(file)
      const result = await uploadFile(file)
    await unlinkFile(file.path)
    console.log(result)
    const description = data.description

   await Book.findOneAndUpdate({ biblioId: id }, { image: result.Key})
   
    .then((resp) => {
      console.log(resp)
      resolve(resp)
    }).catch(err =>{
      reject(err)
    })
  })
}
const CorrectImage = () => {
  return new Promise(async (resolve, reject) => {
   
    await Book.updateMany({ image: { '$regex': 'https://'},image:"" }).then((resp) => { 
        resolve(resp)
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
  
    })
}
const ListUsersWithNoPatronId = (data) => {
  return new Promise((resolve, reject) => {
    User.find({ patron_id: null })
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });

}

const ListUsersWithPatronId = (data) => {
  return new Promise((resolve, reject) => {
    User.find({ patron_id: { $not: { $eq: null } } })
      .then((resp) => {
        console.log(resp)
        resolve(resp);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      });
  });

}
const PlaceCheckout = (data) => {
  return new Promise((resolve, reject) => {
    Boy.find({ ward_number: data.ward_number })
      .then((user) => {
        if (user.length < 1) {
          reject({
            message: "No Delivery Person in the Ward"
          })
        } else {
          const delivery = Delivery({
            ...data,
          })
          delivery.save().then(resp => {
            resolve(resp);
          }).catch(err => {
            reject(err)
          })
        }
      })
  });

}
const ListAllCheckIn = () => {
  return new Promise(async (resolve, reject) => {
    Delivery.find({ return_status: "Closed" })
      .then((resp) => {
        console.log(resp);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const ConformReturn = (data) => {
  return new Promise(async (resolve, reject) => {
    Delivery.findOneAndUpdate({ _id: data.order_id }, { return_status: "Conformed" })
      .then(async() => {
       let book= await Book.findOne({biblioId:data.biblioId}).exec()
      book.items.push(data.itemId);
       book.save();
        resolve(Delivery.findOne({ _id: data.order_id }));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const AddBookTrends = (data) => {
  return new Promise(async (resolve, reject) => {
    Book.findOneAndUpdate({biblioId:data.biblioId},{trends:"1"})
      .then((resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    
  })
}
const RemoveBookTrends = (data) => {
  return new Promise(async (resolve, reject) => {
    Book.findOneAndUpdate({biblioId:data.biblioId},{trends:"0"})
      .then((resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    
  })
}
const AddBookRelease = (data) => {
  return new Promise(async (resolve, reject) => {
    Book.findOneAndUpdate({biblioId:data.biblioId},{release:"1"})
      .then((resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    
  })
}
const RemoveBookRelease = (data) => {
  return new Promise(async (resolve, reject) => {
    Book.findOneAndUpdate({biblioId:data.biblioId},{release:"0"})
      .then((resp) => {
        resolve(resp);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    
  })
}


module.exports = {
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
}
