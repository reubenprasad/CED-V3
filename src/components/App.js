import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Navbar from './Navbar'
import ProductTracker from '../abis/ProductTracker.json'
import Main from './Main'

class App extends Component {

  async componentWillMount() {          //Function which will run every time the component is created
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {          //Fetch information from blockchain using web3
    const web3 = window.web3
    //Retrieve accounts and set current account to the state
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //Retrieve network id of current network
    const networkId = await web3.eth.net.getId()
    const networkData = ProductTracker.networks[networkId]
    //Check if contract is deployed to the current network, else display error
  if(networkData) {
    //Retrieve contract instance using its ABI and address and set it to the state
    const producttracker = web3.eth.Contract(ProductTracker.abi, networkData.address)
    this.setState({ producttracker })
    //Retrieve the product count and set it to the state
    const productCount = await producttracker.methods.productCount().call()
    this.setState({ productCount })
     // Load new products listed by manufacturer
     for (var i = 1; i <= productCount; i++) {
      const product = await producttracker.methods.product(i).call()
      if(product.dateOfPurchase==0x00){
      this.setState({
       newproducts: [...this.state.newproducts, product]
      })
    }
    }

    // Load used products listed by other buyers
    for (var i = 1; i <= productCount; i++) {
      const product = await producttracker.methods.product(i).call()
      if(product.used){
        var dop = new Date(parseInt(product.dateOfPurchase._hex.toString(16))*1000)
       product.dateOfPurchase = dop.toLocaleDateString('en-GB');
      this.setState({
       usedproducts: [...this.state.usedproducts, product]
      })
    }
    }

    // Load owned products of current account of metamask
    for (var i = 1; i <= productCount; i++) {
      const product = await producttracker.methods.product(i).call()
      if(!product.used && product.dateOfPurchase!=0x00 && product.ownerAddress == this.state.account){
       var dop = new Date(parseInt(product.dateOfPurchase._hex.toString(16))*1000)
       //console.log(dop.toLocaleDateString('en-GB'))
       product.dateOfPurchase = dop.toLocaleDateString('en-GB');
      this.setState({
       ownproducts: [...this.state.ownproducts, product]
      })
    }
    }

    this.setState({ loading: false})
  } else {
    window.alert('ProductTracker contract not deployed to detected network.')
  }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      newproducts: [],
      usedproducts: [],
      ownproducts: [],
      loading: true
    }
    this.addProduct = this.addProduct.bind(this)
    this.buyProduct = this.buyProduct.bind(this)
    this.buyUsedProduct = this.buyUsedProduct.bind(this)
    this.sellProduct = this.sellProduct.bind(this)
  }

  async loadWeb3() {               //Function to load web3
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  //Function definitions of the smart contract, which we call using web3 are written below
  addProduct(name, dop, warranty, price) {
    this.setState({ loading: true })
    this.state.producttracker.methods.addProduct(name, dop, warranty, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  buyProduct(id, price) {
    this.setState({ loading: true })
    this.state.producttracker.methods.buyProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  buyUsedProduct(id, price) {
    this.setState({ loading: true })
    this.state.producttracker.methods.buyUsedProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  sellProduct(id, price) {
    this.setState({ loading: true })
    this.state.producttracker.methods.sellProduct(id,price).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  //Render the components and also pass the state values to them (there are 2 components - Navbar and Main)
  render() {
    return (
      <div>
       <Navbar account={"Account : "+this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  newproducts={this.state.newproducts}
                  usedproducts={this.state.usedproducts}
                  ownproducts={this.state.ownproducts}
                  addProduct={this.addProduct}
                  sellProduct={this.sellProduct}
                  buyProduct={this.buyProduct} 
                  buyUsedProduct={this.buyUsedProduct} />
              }
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
