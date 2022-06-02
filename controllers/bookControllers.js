require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Book = require("../models/book");
const Token = require("./token");


const GetBook = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken()
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/biblios/${data.id}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    axios(req)
      .then((resp) => {
        resolve(resp.data)
      }).catch((err) => {
        reject(err)
      })
  })
}
const GetItem = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken()
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/biblios/${data.id}/items`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    axios(req)
      .then((resp) => {
        resolve(resp.data)
      }).catch((err) => {
        reject(err)
      })
  })
}

  
   // $name: { $search: data.txt }

   const SearchBook = (data) => {
  return new Promise(async (resolve, reject) => {
    let token= await Token.getToken();
    await Book.find({name:{'$regex' : data.txt}}).then( (resp) => {
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

module.exports = {
  GetBook,
  GetItem,
  SearchBook
}
