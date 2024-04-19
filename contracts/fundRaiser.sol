// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundRaised {
    struct fundInfo {
        address fundRaiserCreator;
        uint goal;
        uint timeDuration;
        bool isGoal;
        bool isTimeDuration;
        uint totalRaised;
        mapping(address => uint) fundRaised;
        address[] fundersList;
    }

    address public owner;
    mapping(string => fundInfo) public fundRaiseds;
    string[] public fundNames;

    event _isGoal(uint _totalraised, uint _isGoal);
    event _fund(
        string indexed _fundName,
        address _address,
        uint indexed _amount
    );
    event _withdraw(
        string indexed _fundName,
        address _address,
        uint indexed _amount
    );
    event _refund(address indexed _address, uint indexed _amount);

    constructor() {
        owner = msg.sender;
    }

    function createFundRaise(
        string memory _fundName,
        uint _goal,
        uint _timeDuration
    ) public {
        fundInfo storage fundraiser = fundRaiseds[_fundName];
        require(
            bytes(_fundName).length > 0,
            "there should be a name for the fundme"
        );
        require(
            fundraiser.goal == 0,
            "fundraiser already exist with the same name"
        );

        fundraiser.fundRaiserCreator = msg.sender;
        fundraiser.goal = _goal * 1 ether;
        fundraiser.timeDuration = block.timestamp + _timeDuration * 1 minutes;
        fundNames.push(_fundName);
    }
}
