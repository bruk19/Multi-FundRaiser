import hardhat from "hardhat";
const { ethers, run, network } = hardhat;

async function main() {
  const FundRaised = await ethers.getContractFactory("FundRaised");
  const fundRaised = await FundRaised.deploy();


  console.log("FundRaised contract deployed to:", fundRaised.target);
  if (network.config.chainId === 31337 && process.env.ETHERSCAN_API_KEY) {
    await fundRaised.deploymentTransaction().wait(6)
    await verify(fundRaised.target, [])
  }

}

async function verify(contractAddress, args) {
  console.log("verify contract.....")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")
    }
    else {
      console.log(e)
    }
  }
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
