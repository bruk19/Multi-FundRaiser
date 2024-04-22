import hardhat from "hardhat";
const { ethers } = hardhat;
import { expect } from 'chai';

describe("FundRaised", function () {
  let FundRaised, owner, funder1, funder2;
  let fundRaised;


  beforeEach(async function () {
    [owner, funder1, funder2] = await ethers.getSigners();
    FundRaised = await ethers.getContractFactory("FundRaised")
    fundRaised = await FundRaised.deploy()
    await fundRaised.deployed();
  });

  describe("createFundRaise", function () {
    it("should create a new fund", async function () {
 
     await fundRaised.createFundRaise("Test Fund", 1000, 60);
      const fund = await fundRaised.fundRaiseds("Test Fund");
      expect(fund.fundRaiserCreator).to.equal(owner.address);
      expect(fund.goal).to.equal(ethers.utils.parseEther("1000"));
      expect(fund.timeDuration).to.be.greaterThan(0);
    });
  })

})