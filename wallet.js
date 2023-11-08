const BFX = require('bitfinex-api-node');

const API_KEY = '1';
const API_SECRET = '1';

const bfx = new BFX({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  ws: {
    autoReconnect: false,
  }
});

const ws = bfx.ws(2);

ws.on('error', (err) => console.log(err));
ws.on('open', ws.auth.bind(ws));

ws.on('auth', () => {
  console.log('authenticated');
});

ws.on('message', (msg) => {
  if (Array.isArray(msg) && (msg[1] === 'ws' || msg[1] === 'wu')) {
    msg[2].forEach((wallet) => {
      const [walletType, currency, balance, unsettledInterest, balanceAvailable] = wallet;
      if (walletType === 'funding' && currency === 'USD') {
        console.log(`Funding Wallet Balance for USD: ${balance}`);
        console.log(`Unsettled Interest for USD: ${unsettledInterest}`);
        console.log(`Available Balance for USD: ${balanceAvailable !== null ? balanceAvailable : 'Not calculated or not applicable'}`);
        ws.close(); // 获取到数据后关闭连接
      }
    });
  }
});

ws.open();
