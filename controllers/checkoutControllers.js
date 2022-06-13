require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Token = require("./token");




const ListCheckouts = () => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken();
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/checkouts`,
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

const GetCheckout = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/biblios/${data.id}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: data
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
  
  ListCheckouts,
  GetCheckout
}
