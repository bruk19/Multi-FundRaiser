const {ethers, run} = require("hardhat");

async function main() {
  const FundRaised = await ethers.getContractFactory("FundRaised");
  const fundRaised = await FundRaised.deploy();

  await fundRaised.deployed();

  console.log("FundRaised contract deployed to:", fundRaised.address);

  console.log(network.config)
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
