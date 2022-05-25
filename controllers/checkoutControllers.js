require("dotenv").config();
const axios = require("axios")
const qs = require("qs")
// const {ForbiddenError,
//        BadRequestError} = require("../helpers/error");


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
const PlaceHold = (data) => {
  return new Promise(async (resolve, reject) => {
    let token = await getToken()
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
    let token = await getToken()
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
        reject(err)
      })
  })
}
const ListCheckouts = () => {
  return new Promise(async (resolve, reject) => {
    let token = await getToken()
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
    let token = await getToken()
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
    let token = await getToken()
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
    let token = await getToken()
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
