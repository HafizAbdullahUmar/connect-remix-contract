import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { ethers, BigNumber } from "ethers";
import ConnectContract_abi from "../ConnectContract_abi.json";
import Web3 from "web3";

function ConnectContract() {
  const contractAddress = "0xA2Be3912A317e9163aF24405ED4bB46E55BCCB0e";
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connBtnText, setConnBtnText] = useState("Connect Wallet");
  const [currentContractVal, setCurrentContractVal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balanceOfToken, setBalanceOfToken] = useState();

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnBtnText("Wallet Connected");
        });
    } else {
      setErrorMessage("Install MetaMask");
    }
  };
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };
  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      ConnectContract_abi,
      tempSigner
    );
    setContract(tempContract);
  };
  const getTotalSupply = async () => {
    console.log("name::", contract.name());

    let supply = await contract.name();
    setCurrentContractVal(supply);
  };

  const getBalanceOfToken = async () => {
    const web3 = new Web3(window.ethereum);
    let balance = await contract.balanceOf(window.ethereum.selectedAddress);
    // console.log("balance::", BigNumber.prototype.toNumber(balance._hex));
    console.log(
      "balance::",
      web3.utils.fromWei(web3.utils.hexToNumberString(balance._hex), "ether")
    );
    setBalanceOfToken(
      web3.utils.fromWei(web3.utils.hexToNumberString(balance._hex), "ether")
    );
  };
  return (
    <>
      <Container className="text-center mt-5 py-5">
        <h3>{"Interacting with smart contract"}</h3>
        <Button className="my-4" onClick={connectWalletHandler}>
          {connBtnText}
        </Button>
        <h3>Address: {defaultAccount}</h3>

        <Button className="my-4" onClick={getTotalSupply}>
          {"Get Total Supply"}
        </Button>
        <h3>TotalSupply: {currentContractVal}</h3>

        <Button className="my-4" onClick={getBalanceOfToken}>
          {"Get Balance of Token"}
        </Button>
        <h3>Balance of token: {balanceOfToken}</h3>

        {errorMessage}
      </Container>
    </>
  );
}

export default ConnectContract;
