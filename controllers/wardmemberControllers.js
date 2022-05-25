const WardMember = require("../models/wardmember");
const Deliveryboy = require("../models/deliveryboy");
const bcrypt = require('bcryptjs');

const LoginWardmember = (data) => {
  return new Promise((resolve,reject) =>{
    WardMember.find({phoneNumber: data.phoneNumber}).exec()
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
  const AddWardMember = (data) => {
    return new Promise(async (resolve,reject) => {
      bcrypt.hash(data.password, 10, (err, hash) => {
        if (err) {
          reject(err)
        } else {
          const user = WardMember({
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
     
     
})
}

const ListWardMember = () =>{
  return new Promise((resolve,reject)=>{
    WardMember.find()
    .then((resp) => {
      resolve(resp);
    })
    .catch((err) =>{
      reject(err);
    });
  });
};


const DeleteWardMember = (data) => {
  return new Promise(async (resolve, reject) => {
    const wardmember = await WardMember.deleteOne({ _id: data.id })
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


  const AddDeliveryboy = (data) => {
    return new Promise(async (resolve,reject) => {
      WardMember.findOne({ _id: data.wardMemberId })
      .then((user) => {
        console.log(user)
        bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) {
              reject(err)
            } else {
          const deliveryboy = new Deliveryboy({
            name: data.name,
             address : data.address,
             password: hash,
            wardNumber : data.wardNumber,
            phoneNumber: data.phoneNumber,
            wardMemberId: user._id
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
      const deliveryboy = await Deliveryboy.deleteOne({ _id: data.id })
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
   AddWardMember,
   ListWardMember,
   DeleteWardMember,
    AddDeliveryboy,
    UpdateDeliveryboy,
    DeleteDeliveryboy,
    ListDeliveryboy
}