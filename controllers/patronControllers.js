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

const CreatePatron = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await getToken()
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
      let token = await getToken()
      //console.log(data)
      const req = {
        method: 'post',
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
