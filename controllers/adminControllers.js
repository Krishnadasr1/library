
require("dotenv").config();
const Admin = require("../models/admin");
const WM = require("../models/member");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const axios = require("axios")
const qs = require("qs")


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
      console.log('getToken koha', token, tokenExpire)
    }
    resolve(token)
  })

}

  const RegisterAdmin=(data)=> {
    return new Promise((resolve, reject) => {
      Admin.find({ user_id: data.user_id }).exec()
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
  const LoginAdmin=(data)=> {
    return new Promise((resolve,reject) =>{
      Admin.find({user_name: data.user_name}).exec()
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
            message:"Authentication failed"
          })
        })
      }).catch(err=>{
        reject(err)
      })
    })

  }
  // const CreateWM=(data)=> {
  //   return new Promise((resolve, reject) => {
  //       const user = WM({
  //           ...data,
  //           //password: hash
  //         })
  //         user.save().then(resp => {
  //           resolve(resp)
  //         }).catch(err => {
  //           reject(err)
  //         })
  //     });

  // }
  const ViewWM=(data)=> {
    return new Promise(async(resolve, reject) => {
       await WM.findOne({ email: data.email})
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  const UpdateWM=(data)=> {
    return new Promise(async(resolve, reject) => {
      await WM.findOneAndUpdate({ email: data.email }, data).exec()
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });

  }
  // const DeleteWM = (data)=> {
  //   return new Promise(async (resolve, reject) => {
  //       await WM.findOneAndDelete({ email: data.email }, data).exec()
  //         .then((user) => {
  //           resolve({
  //             message: "user deleted",
  //             user: user,
              
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err)
  //           reject(err);
  //         });
  //     });
  //   }
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
           
          const SearchBook = (data) => {
            return new Promise(async (resolve, reject) => {
              let token= await getToken();
              await Book.find({ name: data.txt }).then( (resp) => {
                let id=resp[0].biblioId;
                const req = {
                  method: 'get',
                  url: `${process.env.kohaBaseUrl}/biblios/${id}`,
                  headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
                axios(req).then((resp) =>{
                  resolve(resp.data)
                }) .catch((err) => {
                  console.log(err);
                  reject(err);
                })
              }).catch((error)=>{
                reject(error)
              })
              
               })
          }
               
  module.exports={
    RegisterAdmin,
    LoginAdmin,
    // CreateWM,
    ViewWM,
    UpdateWM,
    // DeleteWM,
    AddBook,
    SearchBook
  
  }
