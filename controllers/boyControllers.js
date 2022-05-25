const Deliveryboy = require("../models/deliveryboy");
const WardMember = require("../models/wardmember");

const bcrypt = require('bcryptjs');
//const jwt = require("jsonwebtoken");
//const _ = require("lodash");
//const otpGenerator = require("otp-generator");


const LoginDeliveryboy = (data) => {
    return new Promise(async (resolve, reject) => {
      Deliveryboy.find({ phoneNumber:data.phoneNumber })
      .exec()
      .then(deliveryboy => {
        if (deliveryboy.length < 1) {
          reject({
            message: "No user Exist",
          });
        } 
             bcrypt.compare(data.password, deliveryboy[0].password, (err, resp) => {
            if (err) {
              reject({
                message: "Authentication failed... Incorrect password",
              });
            }
            if (resp) {
              Deliveryboy.findOneAndUpdate(
              { phoneNumber: data.phoneNumber },
                { status: "true" }
              ).exec();
              resolve({
                message: "Success",
  
                deliveryboy: JSON.stringify(deliveryboy),
              });
            }
          resolve({
            message:"Successfully logged in",
           })
             })
          })
          .catch((err) => {
            reject(err);
          });
      });
    
  }
 


  const Uploadphoto = (data, data1) => {
    return new Promise(async (resolve, reject) => {
      console.log(data);
      console.log(data1);
      Deliveryboy.findOneAndUpdate({ _id: data.id }, { image: data1.path })
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  const GetDeliveryboy = (data) => {
    return new Promise(async (resolve, reject) => {
        Deliveryboy.findOne({ _id: data.id })
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const UpdateDeliveryboy = (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        Deliveryboy.findOneAndUpdate({ _id: data.id }, data)
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  


module.exports = {
    LoginDeliveryboy, 
    Uploadphoto,
    GetDeliveryboy,
    UpdateDeliveryboy    
}
