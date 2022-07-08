pragma solidity ^0.5.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(Tether _tether, RWD _rwd) public {
        owner = msg.sender;
        tether = _tether;
        rwd = _rwd;
    }

    function depositTokens(uint amount) public {
        require(amount > 0, 'amount cannot be 0');
        tether.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, 'caller must be the owner');
        for (uint i = 0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}