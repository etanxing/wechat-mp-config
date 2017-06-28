const qs = require('qs')
const express = require('express')
const axios = require('axios')
const app = express()

let accessToken, expiresIn, ticket

const getAccessToken = () => {
  let queryParams = {
    'grant_type': 'client_credential',
    'appid': 'wx23427b4112bc5836',
    'secret': 'ccfadcd8cb3bae9da2bdd49ccd29244e'
  };

  let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);

  return axios.get(wxGetAccessTokenBaseUrl)
};

const getTicket = () => {
  let queryParams = {
    'access_token': accessToken,
    'type': 'jsapi'
  };

  let wxGetTicketBaseUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?'+qs.stringify(queryParams);

  return axios.get(wxGetTicketBaseUrl)
};


getAccessToken()
.then(({data}) => {
  accessToken = data['access_token'];
  expiresIn = data['expires_in'];
  return getTicket()
})
.then(({data}) => {
  ticket = data['ticket']
  return ticket
})
.then((tk) => {
  console.log(accessToken, ticket, expiresIn);

  setInterval(() => {
    getAccessToken()
    .then(({data}) => {
      accessToken = data['access_token'];
      return getTicket()
    })
    .then(({data}) => {
      ticket = data['ticket']
    })
    .catch((error) => {
      console.log(error);
    })
  }, (expiresIn - 200)*1000);

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  })
})
.catch((error) => {
  console.log(error);
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getconfig', (req, res) => {
  if (accessToken) {

  } else {

  }
})
