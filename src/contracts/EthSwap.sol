pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    
    // Redemption rate = # of tokens they receive for 1 ether
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Calculate number of units of the token to buy
        uint tokenAmount = msg.value * rate;

        // Check is EthSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        // msg.sender is always the address where the current (external) function call came from
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}