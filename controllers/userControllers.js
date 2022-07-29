
require("dotenv").config();
const User = require("../models/user");
const Book = require("../models/book");
const Delivery = require("../models/delivery");

const bcrypt = require("bcryptjs");
const axios = require("axios")
const qs = require("qs")
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const { uploadFile } = require('../s3')

let token = null
let tokenExpire = new Date()
const getToken = () => {
  return new Promise(async (resolve, reject) => {
    if (!token || tokenExpire < Date.now()) {
      const data = qs.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.kohaClient_id,
        client_secret: process.env.kohaClient_secret
      })
      const req = {
        method: 'post',
        url: `${process.env.kohaBaseUrl}/oauth/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        data: data
      }

      const resp = await axios(req)
      token = resp.data.access_token
      tokenExpire = new Date(Date.now() + resp.data.expires_in * 1000)
    }
    resolve(token)
  })

}


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
      const { email} = data;  
      if(email != null)  {
          await User.findOneAndUpdate({ email:email},data)
          .then((resp) => {
            resolve(resp);
            console.log("response "+resp)
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
        }else{
          reject("please provide an email")
        }
      });

  }
  const AddImage = (data, data1) => {
    return new Promise(async (resolve, reject) => {
      const file = data
      const id = data1.id
        const result = await uploadFile(file)
      await unlinkFile(file.path)
      const description = data.description
  
     await User.findOneAndUpdate({ _id: id }, { image: result.Key })
     
      .then((resp) => {
        console.log(resp)
        resolve(resp)
      }).catch(err =>{
        reject(err)
      })
    })
  }
  const DeleteUser = (data)=> {
    return new Promise(async (resolve, reject) => {
      let token = await getToken()
      const req = {
        method: 'delete',
        url: `${process.env.kohaBaseUrl}/patrons/${data.patron_id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      axios(req)
        .then((resp) => {
          resolve(resp.data)
        }).catch((err) => {
          if (err.response.status === 400) {
            reject({
              Error: "Bad parameters or Missing parameters"
            })
          }
          reject(err)
        })
        await User.findOneAndDelete({ _id: data.database_id }).exec()
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
      });

  }
  const PlaceReturn = (data)=> {
    return new Promise(async (resolve, reject) => {
        await Delivery.findOneAndUpdate({ _id: data.order_id }, {return_status:"Open"}).exec()
          .then((user) => {
            resolve(Delivery.findOne({_id:data.order_id}));
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
      });

  }
  const PastOrders = (data)=> {
    return new Promise(async (resolve, reject) => {
        await Delivery.find({ patron_id:data.patron_id}).exec()
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            console.log(err)
            reject(err);
          });
      });

  }
  const GetTrends=()=> {
    return new Promise((resolve, reject) => {
        Book.find({ trends:"1"})
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  const GetRelease=()=> {
    return new Promise((resolve, reject) => {
        Book.find({ release:"1"})
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  module.exports={
      RegisterUser,
      LoginUser,
      AddImage,
      GetUserById,
      GetUserByEmail,
      GetAll,
      DeleteUser,
      UpdateUser,
      PlaceReturn,
        PastOrders,
        GetTrends,
        GetRelease
  }
