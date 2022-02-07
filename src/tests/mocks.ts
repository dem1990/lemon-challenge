export const generateOrderBook = (data = {}) => ({
  data: {
    code: '0',
    msg: '',
    data: [
      {
        asks: [
          ['10', '1', '0', '1'],
          ['11', '2', '0', '1']
        ],
        bids: [
          ['10', '3', '0', '16'],
          ['9', '0.01', '0', '16']
        ],
        ts: '1643776167798'
      }
    ],
    ...data
  }
})

export const generateTrade = (data = {}) => ({
  data: {
    code: '0',
    data: [
      {
        clOrdId: '',
        ordId: '1',
        sCode: '0',
        sMsg: '',
        tag: ''
      }
    ],
    msg: ''
  }
})

export const getTrade = (data = {}) => ({
  data: {
    code: '0',
    data: [
      {
        fillPx: '10'
      }
    ],
    msg: '',
    ...data
  }
})

export const generateQuote = (data = {}) => ({
  pair: 'BTC-USDT',
  buy: 10,
  sell: 11,
  volume: 1,
  expires: 1643695245419,
  ts: 1643695215419,
  ...data
})
