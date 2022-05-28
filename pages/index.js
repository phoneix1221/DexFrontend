import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import { useStoreState, action, useStoreActions } from "easy-peasy";
import { useEffect, useState } from "react";
import TokenManager from "../Abi/TokenManager";
import DexMinimal from "../Abi/DexMinimal";

export default function Home() {
  const web3 = useStoreState((state) => state.web3);
  const provider = useStoreState((state) => state.provider);
  const web3Modal = useStoreState((state) => state.web3Modal);
  const coinlist = useStoreState((state) => state.coinlist);
  const selected_currency = useStoreState((state) => state.selected_currency);
  const DEXContract = useStoreState((state) => state.DEXContract);
  const BATContract = useStoreState((state) => state.BATContract);
  const DAIContract = useStoreState((state) => state.DAIContract);
  const XmrContract = useStoreState((state) => state.XmrContract);
  const RepContract = useStoreState((state) => state.RepContract);
  const TokenManagerContract = useStoreState(
    (state) => state.TokenManagerContract
  );
  const walletAddress = useStoreState((state) => state.walletAddress);
  const [buyOrderBook, setbuyOrderBook] = useState([]);
  const [sellOrderBook, setsellOrderBook] = useState([]);
  const [MybuyOrderBook, setMybuyOrderBook] = useState([]);
  const [MySellOrderBook, setMySellOrderBook] = useState([]);

  const [userCurrencyBalance, setuserCurrencyBalance] = useState(0);
  const [DaiLiquidity, setDaiLiquidity] = useState(0);

  const [price, setprice] = useState();
  const [amount, setAmount] = useState();
  const [orderType, setorderType] = useState("buy");

  useEffect(() => {
    getBalance();
    getLiquidity();
    getBuyOrders();
    getSellOrders();
  }, [selected_currency]);



useEffect(()=>{

  getBalance();
  getLiquidity();
  getBuyOrders();
  getSellOrders();

}, [walletAddress]);


  const getBalance = async () => {
    try {
      if (selected_currency == "BAT") {
        const res = await BATContract.methods.balanceOf(walletAddress).call();
        setuserCurrencyBalance(res / 1e18);
      }else if(selected_currency == "Rep"){
        const res = await RepContract.methods.balanceOf(walletAddress).call();
        setuserCurrencyBalance(res / 1e18);
      }else if(selected_currency == "Xmr")
      {
        const res = await XmrContract.methods.balanceOf(walletAddress).call();
        setuserCurrencyBalance(res / 1e18);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const convertDate = (unix) => {
    let a = new Date(unix * 1000);
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  };

  const getLiquidity = async () => {
    try {
      const res = await DAIContract.methods
        .balanceOf(DexMinimal.adddress)
        .call();
      console.log(res);
      setDaiLiquidity(res / 1e18);
    } catch (error) {
      console.log(error);
    }
  };

  const getBuyOrders = async () => {
    try {
      const res = await DEXContract.methods
        .getBuyOrderBook(selected_currency)
        .call();

      console.log(walletAddress)
      let re=await res.filter((item) => {
        return item.creator.toLowerCase() != walletAddress.toLowerCase() && item.filled!=100;
      })
      console.log("buy ones",re);
      setbuyOrderBook(re);
      let rek=res.filter((item) => {
        return item.creator.toLowerCase() == walletAddress.toLowerCase()  && item.filled!=100;
      })
      console.log("my buy ones",rek)
      setMybuyOrderBook(rek);
    } catch (error) {
      console.log(error);
    }
  };

  const getSellOrders = async () => {
    try {
      const res = await DEXContract.methods
        .getSellOrderBook(selected_currency)
        .call();

      console.log(res);

      setsellOrderBook(
        res.filter((item) => {
          return item.creator.toLowerCase() != walletAddress.toLowerCase()  && item.filled!=100;
        })
      );

      setMySellOrderBook(
        res.filter((item) => {
          return item.creator.toLowerCase() == walletAddress.toLowerCase()  && item.filled!=100;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handelOnChange = (e, type) => {
    let value = e.target.value;

    if (type == "amount") {
      setAmount(value);
    } else if (type == "price") {
      setprice(value);
    }
  };

  const handelOrder = async () => {
    if (orderType == "buy") {
      let res = await DAIContract.methods
        .allowance(walletAddress, DexMinimal.adddress)
        .call();
      res = res / 1e18;
      if (res < amount * price) {
        try {
          await DAIContract.methods
            .approve(DexMinimal.adddress, String(100 * 1e18))
            .send({ from: walletAddress });
        } catch (error) {
          console.log(error);
        }
      }
      let r = String(parseFloat(price));
      let r1 = String(parseFloat(amount) * 1e18);

      await DEXContract.methods
        .createOrder(selected_currency, r1, r, 0)
        .send({ from: walletAddress });
      getBalance();
      getLiquidity();
      getBuyOrders();
      getSellOrders();
    } else {
      let contract=null
      if (selected_currency == "BAT") {
        contract=BATContract
      }else if(selected_currency == "Rep"){
        contract=RepContract
      }else if(selected_currency == "Xmr")
      {
        contract=XmrContract
      }
      let res = await contract.methods
        .allowance(walletAddress, DexMinimal.adddress)
        .call();
      res = res / 1e18;
      if (res < amount * price) {
        try {
          await contract.methods
            .approve(DexMinimal.adddress, String(100 * 1e18))
            .send({ from: walletAddress });
        } catch (error) {
          console.log(error);
        }
      }
      let r = String(parseFloat(price));
      let r1 = String(parseFloat(amount) * 1e18);
      await DEXContract.methods
        .createOrder(selected_currency, r1, r, 1)
        .send({ from: walletAddress });

      getBalance();
      getLiquidity();
      getBuyOrders();
      getSellOrders();
    }
  };

  const sell = async (order_id) => {
    try {
      await BATContract.methods
        .approve(DexMinimal.adddress, String(parseFloat("100") * 1e18))
        .send({ from: walletAddress });
    } catch (error) {
      console.log(error);
    }

    try {
      await DEXContract.methods
      .sell(order_id, selected_currency)
      .send({ from: walletAddress });
      getBalance();
      getLiquidity();
      getBuyOrders();
      getSellOrders();
    } catch (error) {
      console.log(error);
    }
    
  };

  const buy = async (order_id) => {
    try {
      await DAIContract.methods
        .approve(DexMinimal.adddress, String(parseFloat("100") * 1e18))
        .send({ from: walletAddress });
    } catch (error) {
      console.log(error);
    }

    try {
      await DEXContract.methods
      .buy(order_id, selected_currency)
      .send({ from: walletAddress });

      getBalance();
      getLiquidity();
      getBuyOrders();
      getSellOrders();
      
    } catch (error) {
      console.log(error);
    }
   
  };

  const CancelOrder=async(id,type)=>{

    try {
      await DEXContract.methods
        .cancelOrder(id,type,selected_currency).send({ from: walletAddress });
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <>
      <div
        className="d-flex flex-column "
        style={{ height: "100%", background: "#14141f" }}
      >
        <div className="row ">
          <div className="col-md-4 ">
            <div
              className="d-flex flex-column m-4 rounded"
              style={{ background: "#343444", textAlign: "start" }}
            >
              <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "x-large",
                    color: "white",
                  }}
                >
                  Wallet
                </p>
                <hr size="12" style={{ color: "#9a6aff" }} />
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    color: "white",
                  }}
                >
                  Token Balance ({selected_currency})
                </p>
                <p
                  style={{
                    fontWeight: "normal",
                    fontSize: "medium",
                    color: "white",
                  }}
                >
                  {userCurrencyBalance} {selected_currency}
                </p>
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    color: "white",
                  }}
                >
                  DEX DAI Liquidity{" "}
                </p>
                <p
                  style={{
                    fontWeight: "normal",
                    fontSize: "medium",
                    color: "white",
                  }}
                >
                  {DaiLiquidity} DAI
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8   ">
            <div
              className="d-flex flex-column m-4 rounded"
              style={{ background: "#343444", textAlign: "start" }}
            >
              <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "x-large",
                    color: "white",
                  }}
                >
                  Order Book
                </p>
                <hr size="12" style={{ color: "#9a6aff" }} />
                <div className="div" style={{overflowX:"auto"}}>
                <table
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 1em",
                    background: "#14141f",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  <tr style={{ color: "white" }}>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Buy/Sell</th>
                    <th>Action</th>
                  </tr>
                  {buyOrderBook.map((data, key) => (
                    <>
                      <tr key={key} style={{ color: "white" }}>
                        <td>{data.ticker}</td>
                        <td>
                          {data.amount / 1e18} {selected_currency}
                        </td>
                        <td>{data.price } DAI</td>
                        <td>{convertDate(data.date)}</td>
                        <td style={{ color: "red", fontWeight: "bold" }}>
                          Sell
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              sell(data.id);
                            }}
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                  {sellOrderBook.map((data, key) => (
                    <>
                      <tr key={key} style={{ color: "white" }}>
                        <td>{data.ticker}</td>
                        <td>
                          {data.amount / 1e18} {selected_currency}
                        </td>
                        <td>{data.price} DAI</td>
                        <td>{convertDate(data.date)}</td>
                        <td style={{ color: "green", fontWeight: "bold" }}>
                          buy
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              buy(data.id);
                            }}
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </table>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-4 ">
            <div
              className="d-flex flex-column m-4 rounded"
              style={{ background: "#343444", textAlign: "start" }}
            >
              <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "x-large",
                    color: "white",
                  }}
                >
                  DEX
                </p>
                <hr size="12" style={{ color: "#9a6aff" }} />
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    color: "white",
                  }}
                >
                  Create Order ({selected_currency})
                </p>
                <div
                  className="btn-group "
                  style={{ width: "100%" }}
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    className="btn btn-secondary active"
                    style={{ backgroundColor: "green" }}
                    onClick={() => {
                      setorderType("buy");
                    }}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ backgroundColor: "red" }}
                    onClick={() => {
                      setorderType("sell");
                    }}
                  >
                    Sell
                  </button>
                </div>

                <div className="mt-2 mb-2">
                  <label for="exampleInputEmail1" style={{ fontSize: "17px" }}>
                    Amount
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter amount"
                    onChange={(e) => {
                      handelOnChange(e, "amount");
                    }}
                  />
                </div>
                <div className="mt-2 mb-2">
                  <label for="exampleInputPassword1">Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Price"
                    onChange={(e) => {
                      handelOnChange(e, "price");
                    }}
                  />
                </div>
                <button
                  className={styles.Connectbtn}
                  style={{
                    height: "40px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    handelOrder();
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-8   ">
            <div
              className="d-flex flex-column m-4 rounded"
              style={{ background: "#343444", textAlign: "start" }}
            >
              <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                <p
                  style={{
                    fontWeight: "bolder",
                    fontSize: "x-large",
                    color: "white",
                  }}
                >
                  My Orders
                </p>
                <hr size="12" style={{ color: "#9a6aff" }} />
                <div className="div" style={{overflowX:"auto"}}>
                <table
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 1em",
                    background: "#14141f",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  <tr className="mt-5" style={{ color: "white" }}>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Buy/Sell</th>
                    <th>Action</th>
                  </tr>
                  {MybuyOrderBook.map((data, key) => (
                    <>
                      <tr
                        className="mt-4"
                        key={key}
                        style={{ color: "white", marginTop: "20px" }}
                      >
                        <td>{data.ticker}</td>
                        <td>
                          {data.amount / 1e18} {selected_currency}
                        </td>
                        <td>{data.price} DAI</td>
                        <td>{convertDate(data.date)}</td>
                        <td style={{ color: "green", fontWeight: "bold" }}>
                          Buy
                        </td>
                        <td>
                          <button className="btn btn-danger" onClick={()=>{CancelOrder(data.id,0)}}>Cancel</button>
                        </td>
                      </tr>
                    </>
                  ))}

                  {MySellOrderBook.map((data, key) => (
                    <>
                      <tr
                        className="mt-4"
                        key={key}
                        style={{ color: "white", marginTop: "20px" }}
                      >
                        <td>{data.ticker}</td>
                        <td>
                          {data.amount / 1e18} {selected_currency}
                        </td>
                        <td>{data.price } DAI</td>
                        <td>{convertDate(data.date)}</td>
                        <td style={{ color: "red", fontWeight: "bold" }}>
                          Sell
                        </td>
                        <td>
                          <button className="btn btn-danger" onClick={()=>{CancelOrder(data.id,1)}} >Cancel</button>
                        </td>
                      </tr>
                    </>
                  ))}
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
