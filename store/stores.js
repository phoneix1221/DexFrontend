import { createStore,action,thunk } from 'easy-peasy';

const store = createStore({
  provider:null,
  setProvider: action((state, payload) => {
    state.provider=payload
  }),
  web3:null,
  setWeb3: action((state, payload) => {
    state.web3=payload
  }),
  web3Modal:null,
  setweb3Modal: action((state, payload) => {
    state.web3Modal=payload
  }),
  walletAddress:null,
  setwalletAddress: action((state, payload) => {
    console.log("wallet")
    state.walletAddress=payload
  }),
  TokenManagerContract:null,
  setTokenManager:action((state, payload) => {
    state.TokenManagerContract=payload
  }),
  XmrContract:null,
  setXmrContract:action((state, payload) => {
    state.XmrContract=payload
  }),
  RepContract:null,
  setRepContract:action((state, payload) => {
    state.RepContract=payload
  }),
  DAIContract:null,
  setDAIContract:action((state, payload) => {
    state.DAIContract=payload
  }),
  BATContract:null,
  setBATContract:action((state, payload) => {
    state.BATContract=payload
  }),
  DEXContract:null,
  setDEXContract:action((state, payload) => {
    state.DEXContract=payload
  }),
  coinlist:[],
  setCoinList :action((state, payload) => {
    state.coinlist=payload
  }),
  selected_currency:null,
  setCurrency :action((state, payload) => {
    state.selected_currency=payload
  }),

  //thunk
  getCoinList:thunk(async (actions,payload, { getState, getStoreState }) => {
    let contract=getStoreState().TokenManagerContract
    const list = await contract.methods
    .getTokenList()
    .call();
    console.log(list)
    list=list.filter(item => item !== 'DAI')
    actions.setCoinList(list);
    actions.setCurrency(list[0]);
  }),



});


export default store;
