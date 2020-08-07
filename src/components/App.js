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
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = ProductTracker.networks[networkId]
  if(networkData) {
    const producttracker = web3.eth.Contract(ProductTracker.abi, networkData.address)
    this.setState({ producttracker })
    const productCount = await producttracker.methods.productCount().call()
    this.setState({ productCount })
     // Load products
     for (var i = 1; i <= productCount; i++) {
      const product = await producttracker.methods.product(i).call()
      if(product.dateOfPurchase==0x00){
      this.setState({
       products: [...this.state.products, product]
      })
    }
      console.log(product)
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
      products: [],
      loading: true
    }
    this.addProduct = this.addProduct.bind(this)
    this.buyProduct = this.buyProduct.bind(this)
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
                  products={this.state.products}
                  addProduct={this.addProduct}
                  buyProduct={this.buyProduct} />
              }
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
