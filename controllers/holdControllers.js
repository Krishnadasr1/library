require("dotenv").config();
const axios = require("axios")
const qs = require("qs");
const Book = require("../models/book");
const Token = require("./token");



const PlaceHold = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    let book = await Book.findOne({ biblioId: data.biblio_id }).exec();
    if (book != null) {
      let items = book.items
      if (items.length != 0) {
        let itempresent = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i] == data.item_id) {
            itempresent = items[i];
          }
        }
        if (itempresent != 0) {
          const req = {
            method: 'post',
            url: `${process.env.kohaBaseUrl}/holds`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            },
            data: data
          }
          axios(req)
            .then(async (resp) => {
              await Book.findOneAndUpdate({ biblioId: data.biblio_id },
                { $pull: { 'items': data.item_id } }).exec();
              resolve(resp.data)
            }).catch((err) => {
              if (err.status === 403) {
                reject({
                  message: "Item already on hold",
                  err,
                })
              }
              if (err.status === 400) {
                reject({
                  Error: 'Missing parameters',
                  err
                })
              }
              reject(err)
            })

        } else {
          reject({
            message: "requested item is not present !"
          })
        }

      } else {
        reject({
          message: "no items to hold"
        })
      }
    } else {
      reject({
        message: "book not found"
      })
    }
  })
}

const CancelHold = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    const req = {
      method: 'delete',
      url: `${process.env.kohaBaseUrl}/holds/${data.holdId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    axios(req)
      .then(async (resp) => {
        let book = await Book.findOne({ biblioId: data.biblioId }).exec();
        const item = parseInt(data.itemId)
        book.items.push(item);
        book.save();
        resolve(resp.data)
      }).catch((err) => {
        if (err.status === 403) {
          reject({
            Error: 'hold not exist',
            err,
          })
        }
        if (err.status === 400) {
          reject({
            Error: 'Missing parameters',
            err
          })
        }
      })
  })
}
const ListHolds = () => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/holds`,
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


module.exports = {

  PlaceHold,
  CancelHold,
  ListHolds

}
