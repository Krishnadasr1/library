const WardMember = require("../models/member");
const Deliveryboy = require("../models/boy");
const bcrypt = require('bcryptjs');

const LoginWardmember = (data) => {
  return new Promise((resolve,reject) =>{
    WardMember.find({phone_number: data.phone_number}).exec()
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
  
  const ViewWardmember = (data) => {
    return new Promise(async (resolve, reject) => {
      await WardMember.find({ _id: data.id })
      .then((resp) => {
          resolve(resp)
      })
      .catch((err) =>{
          reject(err)
      })
    });
  };


  const AddDeliveryboy = (data) => {
    return new Promise(async (resolve,reject) => {
      WardMember.findOne({ _id: data.member_id })
      .then((user) => {
        console.log(user)
        bcrypt.hash(data.password, 10, (err, hash) => {
          if(err){
            reject(err)
          }
       else {
          const deliveryboy = new Deliveryboy({
           ...data,
           password:hash
          });
        deliveryboy
          .save()
          .then((resp) => {
            console.log(resp);
            resolve(resp);
          })
        
          .catch((err) => {
            console.log(err);
            reject(err);
          });
        }
        })
    
        })
    })
}

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
  const DeleteDeliveryboy = (data) => {
    return new Promise(async (resolve, reject) => {
      await Deliveryboy.deleteOne({ _id: data.id })
      .then((resp) => {
          resolve(resp)
      })
      .catch((err) =>{
          reject(err)
      })
    });
  };
  const  ListDeliveryboy = (data) =>{
    return new Promise((resolve,reject)=>{
     // WardMember.findOne({ _id: data.wardMemberId })
        Deliveryboy.find({wardMemberId:data.wardMemberId})
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) =>{
        reject(err);
      });
    });
  };
module.exports = {
    LoginWardmember,
    ViewWardmember,
    AddDeliveryboy,
    UpdateDeliveryboy,
    DeleteDeliveryboy,
    ListDeliveryboy
}