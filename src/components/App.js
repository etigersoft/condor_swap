import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const ethBalance = await web3.eth.getBalance(accounts[0])
    
    this.setState({ 
      account: accounts[0], 
      ethBalance
    })
  }

  async loadWeb3() {
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

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      ethBalance: ''
    }
  }

  render() {
    console.log(this.state.ethBalance)
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                Hi
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
