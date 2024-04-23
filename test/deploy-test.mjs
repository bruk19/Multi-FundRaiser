import hardhat from "hardhat";
const { ethers } = hardhat;
import { expect } from 'chai';

describe("FundRaised", function () {
  let FundRaised, owner, funder1, funder2;
  let fundRaised;


  beforeEach(async function () {
    [owner, funder1, funder2] = await ethers.getSigners();
    FundRaised = await ethers.getContractFactory("FundRaised")
  });

  describe("createFundRaise", function () {
    it("should create a new fund", async function () {

      await fundRaised.createFundRaise("Test FundRaise", 1000, 60);
      const fund = await fundRaised.fundRaiseds("Test FundRaise");
      expect(fund.fundRaiserCreator).to.equal(owner.address);
      expect(fund.goal).to.equal(ethers.utils.parseEther("1000"));
      expect(fund.timeDuration).to.be.greaterThan(0);
    });

    it("should not create a fundraiser with an existing name", async function () {
      await fundRaised.createFundRaise("Test FundRaise", 1000, 60);
      await expect(
        fundRaised.createFundRaise("Test FundRaise", 2000, 120)
      ).to.be.rejected("fundraiser already exist with the same name");
    });
  })

  describe("fund", function () {
    it("should allow users to fund a campaign", async function () {
      await fundRaised.createFundRaise("Test Fund", 1000, 60);
      await fundRaised.connect(user1).fund("Test Fund", { value: 100 });
      const fund = await fundRaised.fundRaiseds("Test Fund");
      expect(fund.fundRaised[user1.address]).to.equal(100);
      expect(fund.totalRaised).to.equal(100);
    });

    it("should not allow funding after the time duration is over", async function () {
      await fundRaised.createFundRaise("Test Fund", 1000, 1);
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        fundRaised.connect(user1).fund("Test Fund", { value: 100 })
      ).to.be.revertedWith("the fund time duration is end");
    });

    it("should emit the _fund event", async function () {
      await fundRaised.createFundRaise("Test Fund", 1000, 60);
      await expect(fundRaised.connect(user1).fund("Test Fund", { value: 100 }))
        .to.emit(fundRaised, "_fund")
        .withArgs("Test Fund", user1.address, 100);
    });
  });

  it("should not create a fund with an empty name", async function () {
  await expect(fundRaised.createFundRaise("", 1000, 60)).to.be.revertedWith(
    "there should be a name for the fundme"
  );
});

})