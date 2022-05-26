const Boy = require("../models/boy");
const Delivery = require("../models/delivery");

const bcrypt = require('bcryptjs');
const user = require("../models/user");
//const jwt = require("jsonwebtoken");
//const _ = require("lodash");
//const otpGenerator = require("otp-generator");


const LoginUser = (data) => {
  return new Promise((resolve,reject) =>{
    Boy.find({phone_number: data.phone_number}).exec()
    .then(user =>{
      if(user.length < 1){
        reject({
          message:"No User Exist"
        })
      }

      bcrypt.compare(data.password,user[0].password, (err,resp) =>{
        if(err) {
          reject({
            message:"Authentication failed... Incorrect password"
          })
        }
        if(resp){
          resolve({
            message:"success",
            user:user
           
          })
        }
        reject({
          err,
          message:"Authentication failed"
        })
      })
    }).catch(err=>{
      reject(err)
    })
  })
  };
 
  const GetUser = (data) => {
    return new Promise(async (resolve, reject) => {
        Boy.findOne({ _id: data.id })
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
 
  const GetCheckoutList = (data) => {
    return new Promise(async (resolve, reject) => {
        Delivery.find({ ward_number: data.ward_number ,checkout_status:"Open"})
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const GetReturnList = (data) => {
    return new Promise(async (resolve, reject) => {
        Delivery.find({ ward_number: data.ward_number,return_status:"Open" })
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const OrderPlaced = (data) => {
    return new Promise(async (resolve, reject) => {
      await  Delivery.findOneAndUpdate({ _id: data.order_id },{checkout_status:"Closed"})
        .then((resp) => {
         // console.log(resp);
          resolve(Delivery.findOne({_id:data.order_id}));
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const ReturnDone = (data) => {
    return new Promise(async (resolve, reject) => {
        Delivery.findOneAndUpdate({ _id: data.order_id },{return_status:"Closed"})
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
  LoginUser,
  GetUser,
  GetCheckoutList,
   OrderPlaced,
   GetReturnList,
   ReturnDone
     
}
