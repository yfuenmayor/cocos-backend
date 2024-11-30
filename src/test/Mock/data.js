const userTest = { email: 'yfuenmayor@test.com', accountnumber: '10001' }

const instruments = [
    {
      "id": 1,
      "ticker": "DYCA",
      "name": "Dycasa S.A.",
      "type": "ACCIONES"
    },
    {
      "id": 2,
      "ticker": "CAPX",
      "name": "Capex S.A.",
      "type": "ACCIONES"
    },
    {
      "id": 3,
      "ticker": "PGR",
      "name": "Phoenix Global Resources",
      "type": "ACCIONES"
    },
    {
      "id": 66,
      "ticker": "ARS",
      "name": "PESOS",
      "type": "MONEDA"
    }
  ]

const marketData = [
  {
    "instrumentId": 1,
    "high": 268.00,
    "low": 255.00,
    "open": 268.00,
    "close": 260.00,
    "previousClose": 264.00,
    "date": "2023-07-13"
  },
  {
    "instrumentId": 2,
    "high": 1930.00,
    "low": 1850.00,
    "open": 1850.00,
    "close": 1918.00,
    "previousClose": 1885.50,
    "date": "2023-07-13"
  },
  {
    "instrumentId": 1,
    "high": 278.00,
    "low": 240.00,
    "open": 260.00,
    "close": 270.00,
    "previousClose": 260.00,
    "date": "2023-07-14"
  },
  {
    "instrumentId": 2,
    "high": 1920.00,
    "low": 1850.00,
    "open": 1850.00,
    "close": 1865.00,
    "previousClose": 1918.00,
    "date": "2023-07-14"
  }
]

const viMarketData = [
  {
    "instrumentId": 1,
    "high": 278.00,
    "low": 240.00,
    "open": 260.00,
    "close": 270.00,
    "previousClose": 260.00,
    "date": "2023-07-14"
  },
  {
    "instrumentId": 2,
    "high": 1920.00,
    "low": 1850.00,
    "open": 1850.00,
    "close": 1865.00,
    "previousClose": 1918.00,
    "date": "2023-07-14"
  }
]

const orders =  [
  {
    "instrumentId": 66,
    "userId": 1,
    "size": 1000000,
    "price": 1.00,
    "type": "MARKET",
    "side": "CASH_IN",
    "status": "FILLED",
    "datetime": "2024-11-28 02:57:38.632000"
  },
  {
    "instrumentId": 66,
    "userId": 1,
    "size": 100000,
    "price": 1.00,
    "type": "MARKET",
    "side": "CASH_OUT",
    "status": "FILLED",
    "datetime": "2023-07-13 12:31:20.000000"
  },
  {
      "instrumentId": 1,
      "userId": 1,
      "size": 20,
      "price": 260.00,
      "type": "MARKET",
      "side": "BUY",
      "status": "FILLED",
      "datetime": "2023-07-13 14:51:20.000000"
  },
  {
    "instrumentId": 2,
    "userId": 1,
    "size": 10,
    "price": 1918.00,
    "type": "MARKET",
    "side": "BUY",
    "status": "FILLED",
    "datetime": "2023-07-13 14:51:20.000000"
  },
  {
    "instrumentId": 1,
    "userId": 1,
    "size": 5,
    "price": 270.00,
    "type": "MARKET",
    "side": "SELL",
    "status": "FILLED",
    "datetime": "2023-07-14 14:51:20.000000"
  }
]

const test = {
  cashIn: { price: 1,  type: "MARKET",  status: "FILLED"},
  cashOut: { price: 1,  type: "MARKET",  status: "REJECTED" },
  sellOk: { price: 270.00, status: "FILLED" },
  sellSize: { price: 270.00, status: "REJECTED" },
  buyPrice: { price: 2500000.00, status: "REJECTED" },
}

module.exports = { userTest, marketData, instruments, orders, viMarketData, test }

