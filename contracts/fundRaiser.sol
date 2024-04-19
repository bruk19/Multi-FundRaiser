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

    function fund(string memory _fundName) public payable {
        fundInfo storage fundraiser = fundRaiseds[_fundName];
        require(fundraiser.goal > 0, "the fund is not created");
        require(
            block.timestamp <= fundraiser.timeDuration,
            "the fund time duration is end"
        );
        require(msg.value > 0, "you can sent 0 value");

        fundraiser.fundRaised[msg.sender] += msg.value;
        fundraiser.totalRaised += msg.value;
        fundraiser.fundersList.push(msg.sender);

        if (fundraiser.totalRaised >= fundraiser.goal) {
            fundraiser.isGoal = true;
            emit _isGoal(fundraiser.totalRaised, fundraiser.goal);
        }

        emit _fund(_fundName, msg.sender, msg.value);
    }

    function withdrawnOrRefund(string memory _fundName) public {
        fundInfo storage fundraiser = fundRaiseds[_fundName];
        require(
            block.timestamp >= fundraiser.timeDuration,
            "the fund time duration is end"
        );

        if (fundraiser.isGoal) {
            uint amt = fundraiser.totalRaised;
            fundraiser.totalRaised = 0;
            fundraiser.isTimeDuration = true;
            payable(fundraiser.fundRaiserCreator).transfer(amt);

            emit _withdraw(_fundName, msg.sender, amt);
        } else {
            address[] storage funders = fundraiser.fundersList;
            for (uint i = 0; i < funders.length; i++) {
                address funder = funders[i];

                uint amount = fundraiser.fundRaised[funder];
                fundraiser.fundRaised[funder] = 0;
                payable(funder).transfer(amount);

                emit _refund(msg.sender, amount);
            }
        }
    }

    function listofFunds() public view returns (string[] memory) {
        return fundNames;
    }

    function whoFund(
        string memory _funders
    ) public view returns (address[] memory _fundersList) {
        _fundersList = fundRaiseds[_funders].fundersList;
    }
}
