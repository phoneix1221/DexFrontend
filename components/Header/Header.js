import React from 'react'
import style from "../../styles/header.module.css"
import { useStoreState, action,useStoreActions } from 'easy-peasy';
import { useEffect,useState } from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { BN } from "web3-utils";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import TokenManager from '../../Abi/TokenManager';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import DAI from '../../Abi/DAI';
import BAT from '../../Abi/BAT';
import Rep from '../../Abi/Rep';
import Xmr from '../../Abi/Xmr';
import DexMinimal from '../../Abi/DexMinimal';
import logodark from '../../assets/images/logo/logo_dark.png'
import logodark2x from '../../assets/images/logo/logo_dark@2x.png'
import Image from 'next/image'

import Web3 from "web3";
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed1.binance.org",
      },
      chainId: 56,
    },
  },
};

const Header = () => {

  const web3 = useStoreState((state) => state.web3);
  const provider = useStoreState((state) => state.provider);
  const web3Modal = useStoreState((state) => state.web3Modal);
  const coinlist = useStoreState((state) => state.coinlist);
  const selected_currency = useStoreState((state) => state.selected_currency);
  const TokenManagerContract = useStoreState((state) => state.TokenManagerContract);
  const setTokenManager = useStoreActions((actions) => actions.setTokenManager);
  const setXmrContract = useStoreActions((actions) => actions.setXmrContract);
  const setRepContract = useStoreActions((actions) => actions.setRepContract);
  const setDAIContract = useStoreActions((actions) => actions.setDAIContract);
  const setBATContract = useStoreActions((actions) => actions.setBATContract);
  const setDEXContract = useStoreActions((actions) => actions.setDEXContract);
  const setWeb3 = useStoreActions((actions) => actions.setWeb3);
  const setweb3Modal = useStoreActions((actions) => actions.setweb3Modal);
  const setProvider = useStoreActions((actions) => actions.setProvider);
  const walletAddress = useStoreState((state) => state.walletAddress);
  const setwalletAddress = useStoreActions((actions) => actions.setwalletAddress);
  const getCoinList = useStoreActions((actions) => actions.getCoinList);
  const setCurrency = useStoreActions((actions) => actions.setCurrency);


  useEffect(() => {
    let val = localStorage.getItem("loggedIn");
   
    if (val == "true") {
      (async () =>{

        await connect()
      }
      )();
    }
   
  },[])


 


  //connect to provider

 const connect = async () => {
    try {
       web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
      });

      //initiate connection
       provider = await web3Modal.connect();
      //create web3 with given provider
       web3 = new Web3(provider);
      //setting state
      setWeb3(web3)
      setweb3Modal(web3Modal)
      setProvider(provider)

      if (provider != null) {
        //setting logged in status in storage
        localStorage.setItem("provider", provider);
        localStorage.setItem("loggedIn", true);

        //provider event listners
        provider.on("accountsChanged", async (accounts) => {
          if (accounts.length > 0) {
            setwalletAddress(accounts[0])
            
          } else {
            if (provider.close || provider.disconnect) {
              await provider.close();
              await provider.disconnect();
              await web3Modal.clearCachedProvider();
              setProvider(null)
            }
            await web3Modal.clearCachedProvider();
            localStorage.setItem("provider", null);
            localStorage.setItem("loggedIn", false);
            setProvider(null)
            window.location.reload();
          }
        });

        // Subscribe to chainId change
        provider.on("chainChanged", async (chainId) => {
          const res = await checkNetwork();
          if (res == false) {
           
            confirmAlert({
              title: "wrong network",
              message: "",
              buttons: [
                {
                  label: "Close",
                },
              ],
            });
            return;
          }
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {});

        // Subscribe to provider disconnection
        provider.on("disconnect", async (error) => {
          if (provider.close || provider.disconnect) {
            await provider.close();
            await provider.disconnect();
            await web3Modal.clearCachedProvider();
            setProvider(null)
          }
          await web3Modal.clearCachedProvider();
          localStorage.setItem("provider", null);
          localStorage.setItem("loggedIn", false);
          setProvider(null)
          window.location.reload();
        });

        //check for network

        const res = await checkNetwork();

        if (res == false) return;

        //get all address from web3
        const address = await web3.eth.getAccounts();

        setwalletAddress(address[0])
        
      initContract()  
       
      }
    } catch (error) {
      alert(error)
    }
  };



   const initContract=()=>{

    let tokenMContract = new web3.eth.Contract(
      TokenManager.Abi,
      TokenManager.adddress
    );
    let DAIContract=new web3.eth.Contract(
      DAI.Abi,
      DAI.adddress
    );

    let XmrContract=new web3.eth.Contract(
      Xmr.Abi,
      Xmr.adddress
    );

    let RepContract=new web3.eth.Contract(
      Rep.Abi,
      Rep.adddress
    );

    let BATContract=new web3.eth.Contract(
      BAT.Abi,
      BAT.adddress
    );
    let DEXContract=new web3.eth.Contract(
      DexMinimal.Abi,
      DexMinimal.adddress
    );
    setTokenManager(tokenMContract)
    setDAIContract(DAIContract)
    setBATContract(BATContract)
    setDEXContract(DEXContract)
    setXmrContract(XmrContract)
    setRepContract(RepContract)
    getTokenList()
  }


  const getTokenList=()=>{
    getCoinList()
  }






  //updateUi

 const OnCurrencySelect =(e) => {
console.log(e)
  setCurrency(e.value)
   
  };

  //check network id

 const  checkNetwork = async () => {
    const networkId = await web3.eth.net.getId();

    if (networkId != 97) {
      confirmAlert({
        title: "wrong network",
        message: "",
        buttons: [
          {
            label: "Close",
          },
        ],
      });

      try {
        await provider
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }],
          })
          .then((success) => {
            window.location.reload();
            return;
          });
      } catch (error) {
        console.log(error)
        return false;
      }
    }
  };

  //disconnect
 const disconnect = async () => {
    if (provider.close || provider.disconnect) {
      await provider.close();
      await provider.disconnect();
      await web3Modal.clearCachedProvider();
      setProvider(null)
      
    }
    await web3Modal.clearCachedProvider();
    localStorage.setItem("provider", null);
    localStorage.setItem("loggedIn", false);
    setProvider(null)
    window.location.reload();
  };
  
  
  const defaultOption = coinlist[0];
    
  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      
    <Image  className='logo-dark' id="logo_header" src="/logo.png" srcSet="/logo.png" alt="nft-gaming" width="80" height="56"  /><h4>Exchange</h4>
       </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">How to use</a>
        </li>
      </ul>
      <div className='d-flex '>
      
        <Dropdown  controlClassName={style.control} options={coinlist} value={defaultOption} onChange={(e)=>{OnCurrencySelect(e)}}  placeholder="Select Currency"  />;
       
      </div>
      <div className='d-flex' >
        {walletAddress?<div className={style.Connectbtn}>
     {walletAddress.substring(0,4)+"..."+walletAddress.substring(walletAddress.length-4,walletAddress.length)}
        </div>: <div className={style.Connectbtn} onClick={()=>{connect()}}>
      Connect Wallet
        </div>}
       
        
      </div>
    </div>
  </div>
</nav>


   
  )
}

export default Header