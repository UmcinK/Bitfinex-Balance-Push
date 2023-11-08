const fetch = require('node-fetch');
const crypto = require('crypto');

const API_KEY = '1';
const API_SECRET = '2';

const baseUrl = 'https://api.bitfinex.com';
const path = '/v2/auth/r/wallets';
const nonce = Date.now().toString();
const body = {};

const signature = `/api${path}${nonce}${JSON.stringify(body)}`;
const sigHash = crypto.createHmac('sha384', API_SECRET).update(signature).digest('hex');

const options = {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'bfx-nonce': nonce,
    'bfx-apikey': API_KEY,
    'bfx-signature': sigHash
  }
};

fetch(`${baseUrl}${path}`, options)
  .then(res => res.json())
  .then(wallets => {
    wallets.forEach(wallet => {
      const [walletType, currency, balance, unsettledInterest, balanceAvailable] = wallet;
      if (walletType === 'funding' && currency === 'USD') {
        console.log(`Funding Wallet Balance for USD: ${balance}`);
        console.log(`Unsettled Interest for USD: ${unsettledInterest}`);
        console.log(`Available Balance for USD: ${balanceAvailable !== null ? balanceAvailable : 'Not calculated or not applicable'}`);
      }
    });
  })
  .catch(err => console.error(err));
