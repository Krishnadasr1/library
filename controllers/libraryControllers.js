require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Token = require("./token");


const GetLibrary = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    //console.log(data)
    const req = {
      method: 'get',
      url: `${process.env.kohaBaseUrl}/libraries/${data.id}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
    }
    axios(req)
      .then((resp) => {
        resolve(resp.data)
      }).catch((err) => {
        if (err.response.status === 400) {
          reject({
            Error: "Missing Library Id"
          })
        }
        reject(err)
      })
  })
}
const UpdateLibrary = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await Token.getToken();
    //console.log(data)
    const req = {
      method: 'post',
      url: `${process.env.kohaBaseUrl}/libraries/${data.id}`,
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
        reject(err)
      })
  })
}

module.exports = {
  
  GetLibrary,
  UpdateLibrary
}
