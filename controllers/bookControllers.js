require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Book = require("../models/book");



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
const GetBook = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await getToken()
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
    let token = await getToken()
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
const SearchBook = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await getToken();
    let books =[];
    let sortedbooks=[];
    //books = await Book.find({ name: data.txt  }).exec();
    books = await Book.find({ $name: { $search: data.txt } }).exec();
    console.log(books)
    for(let i=0; i<books.length; i++){
      console.log(books[i].name)
      //let id = resp[0].biblioId;
      const req = {
        method: 'get',
        url: `${process.env.kohaBaseUrl}/biblios/${books[i].biblioId}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      axios(req).then((resp) => {
        sortedbooks[i] = resp.data
        //console.log(sortedbooks)
       resolve(sortedbooks)
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    }
    //resolve(sortedbooks)
     
  })
}
module.exports = {
  GetBook,
  GetItem,
  SearchBook
}
