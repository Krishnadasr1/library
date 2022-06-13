require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Token = require("./token");


const CreatePatron = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    //console.log(data)
    const req = {
      method: 'post',
      url: `${process.env.kohaBaseUrl}/patrons`,
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
        if (err.response.status === 400) {
          reject({
            Error: "Bad parameters or Missing parameters"
          })
        }
        if (err.response.status === 409) {
            reject({
              Error: "Card Number Taken"
            })
          }
        reject(err)
      })
  })
}
const GetPatron = (data) => {
    return new Promise(async (resolve, reject) => {
      let token = await Token.getToken();
      //console.log(data)
      const req = {
        method: 'get',
        url: `${process.env.kohaBaseUrl}/patrons/${data.id}`,
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
    })
  }
module.exports = {
  
  CreatePatron,
  GetPatron
  
}
