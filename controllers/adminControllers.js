
require("dotenv").config();
const Admin = require("../models/admin");
const WM = require("../models/member");
const Book = require("../models/book");
const Boy = require("../models/boy");
const Delivery = require("../models/delivery");
const User = require("../models/user");

const bcrypt = require("bcryptjs");
require("dotenv").config();
const axios = require("axios")
const qs = require("qs");
const { del } = require("express/lib/application");




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
          message: "Ward member deleted",
          user: user,

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
      name: data.name,
      biblioId: data.biblioId,
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
    User.find({patron_id: {$not: {$eq: null}}})
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
          delivery.save().then(resp =>{
            resolve(resp);
          }).catch(err =>{
            reject(err)
          })
        }
      })
  });

}
const ListAllCheckIn = () => {
  return new Promise(async (resolve, reject) => {
      Delivery.find({return_status:"Closed"})
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
      Delivery.findOneAndUpdate({ _id: data.order_id },{return_status:"Conformed"})
      .then((resp) => {
        console.log(resp);
        resolve(Delivery.findOne({_id:data.order_id}));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  RegisterAdmin,
  LoginAdmin,
  CreateWM,
  ViewWM,
  ViewAllWM,
  UpdateWM,
  DeleteWM,
  AddBook,
  ListUsersWithNoPatronId,
  ListUsersWithPatronId,
  PlaceCheckout,
  ListBoys,
  ListAllCheckIn,
  ConformReturn
}
