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
    }
    resolve(token)
  })

}

module.exports ={getToken}