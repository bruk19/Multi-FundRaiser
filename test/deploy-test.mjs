import hardhat from "hardhat";
const { ethers } = hardhat;
import { expect } from "chai";
// import {ethers} from "hardhat";

describe("FundRaised", function () {
  let FundRaised, owner, funder1;
  let fundRaised;

  beforeEach(async function () {
    [owner, funder1] = await ethers.getSigners();
    FundRaised = await ethers.getContractFactory("FundRaised");
    fundRaised = await FundRaised.deploy();
  });

  describe("createFundRaise", function () {
    it("should not create a fund with an empty name", async function () {
      console.log(ethers)
      await expect(fundRaised.createFundRaise("", ethers.utils.parseEther("1000"), 60)).to.be.revertedWith(
        "there should be a name for the fundme"
      );
    });

    it("should create a new fund", async function () {
      await fundRaised.createFundRaise("Test FundRaise", ethers.utils.parseEther("1000"), 60);
      const fund = await fundRaised.fundRaiseds("Test FundRaise");
      expect(fund.fundRaiserCreator).to.equal(owner.address);
      expect(fund.goal).to.equal(ethers.utils.parseEther("1000"));
      expect(fund.timeDuration).to.be.greaterThan(0);
    });

    it("should not create a fundraiser with an existing name", async function () {
      await fundRaised.createFundRaise("Test FundRaise", ethers.utils.parseEther("1000"), 60);
      await expect(
        fundRaised.createFundRaise("Test FundRaise", ethers.utils.parseEther("2000"), 120)
      ).to.be.rejectedWith("fundraiser already exist with the same name");
    });
  });

  describe("fund", function () {
    it("should not allow funding after the time duration is over", async function () {
      await fundRaised.createFundRaise("Test Fund", ethers.utils.parseEther("1000"), 1);
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        fundRaised.connect(funder1).fund("Test Fund", { value: ethers.utils.parseEther("100") })
      ).to.be.rejectedWith("the fund time duration is end");
    });

    it("should emit the _fund event", async function () {
      await fundRaised.createFundRaise("Test Fund", ethers.utils.parseEther("1000"), 60);
      await expect(fundRaised.connect(funder1).fund("Test Fund", { value: ethers.utils.parseEther("100") }))
        .to.emit(fundRaised, "_fund")
        .withArgs("Test Fund", funder1.address, ethers.utils.parseEther("100"));
    });
  });
});