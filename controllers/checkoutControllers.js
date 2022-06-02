require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
const Token = require("./token");



const GetBook = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
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
const PlaceHold = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
    //console.log(data)
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
      .then((resp) => {
        resolve(resp.data)
      }).catch((err) => {
        if (err.response.status === 403) {
          reject({
            Error:'Item already on hold',
            err,
          })
        }
        if (err.response.status === 400) {
          reject({
            Error:'Missing parameters',
            err
          })
        }
      })
  })
}
const CancelHold = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
    //console.log(data)
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
      .then((resp) => {
        resolve(resp.data)
      }).catch((err) => {
        if (err.response.status === 403) {
          reject({
            Error:'Item already on hold',
            err,
          })
        }
        if (err.response.status === 400) {
          reject({
            Error:'Missing parameters',
            err
          })
        }
      })
  })
}

const CreatePatron = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
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
        reject(err)
      })
  })
}
const ListCheckouts = () => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
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
const ListHolds = () => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
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
const GetLibrary = (data) => {
  return new Promise(async (resolve, reject) => {
   let token = await Token.getToken
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
   let token = await Token.getToken
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
        reject(err)
      })
  })
}

module.exports = {
  
  ListCheckouts,
  GetCheckout,
  ListHolds,
  GetLibrary,
  UpdateLibrary
}
