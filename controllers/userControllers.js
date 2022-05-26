
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


  const RegisterUser=(data)=> {
    return new Promise((resolve, reject) => {
      User.find({ email: data.email }).exec()
        .then(user => {
          if (user.length >= 1) {
            reject({
              message: "user exist... Try another email",
              user: JSON.stringify(user)
            })
          } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
              if (err) {
                reject(err)
              } else {
                const user = User({
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
  const LoginUser = (data) => {
    return new Promise((resolve, reject) => {
      User.find({ email: data.email }).exec()
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
  const GetUserById=(data)=> {
    return new Promise((resolve, reject) => {
        User.findOne({ patron_id: data.patron_id})
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  const GetUserByEmail=(data)=> {
    return new Promise((resolve, reject) => {
        User.findOne({ email: data.email})
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  const GetAll=()=> {
    return new Promise((resolve, reject) => {
        User.find()
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  const UpdateUser = (data)=> {
    return new Promise(async (resolve, reject) => {
        await User.findOneAndUpdate({ email: data.email }, data).exec()
          .then((user) => {
            resolve({
              message: "user updated",
              user: user,
              
            });
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
      });

  }


  module.exports={
      RegisterUser,
      LoginUser,
      GetUserById,
      GetUserByEmail,
      GetAll,
      UpdateUser
  }
