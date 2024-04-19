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
        mapping(address=>uint) fundRaised;
        address[] fundersList;
    }

  address public owner;
  mapping(string=>fundInfo) public fundRaiseds;
  string[] public fundNames; 
}
