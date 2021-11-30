import React, { Component } from 'react';
import BuyForm from './BuyForm'

class Main extends Component {
    render() {
        return (
            <div id="content">
                <div className="card mb-4" >

                    <div className="card-body">
                        <BuyForm 
                            ethBalance = {this.props.ethBalance}
                            tokenBalance = {this.props.tokenBalance}
                            buyTokens = {this.props.buyTokens} />
                    </div>

                </div>

            </div>
        );
    }
}

export default Main;