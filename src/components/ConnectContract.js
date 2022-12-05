import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ethers, BigNumber } from "ethers";
import ConnectContract_abi from "../ConnectContract_abi.json";
import Web3 from "web3";

function ConnectContract() {
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0xA2Be3912A317e9163aF24405ED4bB46E55BCCB0e";
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connBtnText, setConnBtnText] = useState("Connect Wallet");
  const [currentContractVal, setCurrentContractVal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balanceOfToken, setBalanceOfToken] = useState();
  const [transferAmount, setTransferAmount] = useState(55);
  const [transferAddress, setTransferAddress] = useState("");
  const [ishidden, setIsHidden] = useState(true);
  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnBtnText("Wallet Connected");
          setIsHidden(false);
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
    let supply = await contract.totalSupply();
    let supplyInEther = web3.utils.fromWei(
      web3.utils.hexToNumberString(supply._hex)
    );
    setCurrentContractVal(supplyInEther);
  };

  const getBalanceOfToken = async () => {
    let balance = await contract.balanceOf(window.ethereum.selectedAddress);
    setBalanceOfToken(
      web3.utils.fromWei(web3.utils.hexToNumberString(balance._hex), "ether")
    );
  };
  const transferToken = async () => {
    contract.transfer(transferAddress, transferAmount);
    console.log(contract);
  };
  return (
    <>
      <Container className={ishidden ? "" : "text-center mt-5 py-5"}>
        <div hidden={!ishidden} className="intro-page">
          <h1>{"Connect your wallet to start using the app"}</h1>
          <Button className="my-4" onClick={connectWalletHandler}>
            {connBtnText}
          </Button>
        </div>
        <Container hidden={ishidden}>
          <h3>Address: {defaultAccount}</h3>

          <h2 className="mt-5">Total Supply</h2>
          <Button className="my-2" onClick={getTotalSupply}>
            {"Click here"}
          </Button>
          <h4>{currentContractVal}</h4>

          <h2 className="mt-5">Token Balance</h2>
          <Button className="my-2" onClick={getBalanceOfToken}>
            {"Click here"}
          </Button>
          <h4>
            {balanceOfToken ? balanceOfToken.split(".")[0] : balanceOfToken}
          </h4>
          <Container className="mt-5">
            <h1>Transfer Tokken</h1>
            <Row lg={2}>
              <Col>
                <Form.Control
                  placeholder="Address to transfer"
                  onChange={(event) => {
                    setTransferAddress(event.target.value);
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Enter amount"
                  onChange={(event) => {
                    setTransferAmount(event.target.value);
                  }}
                />
              </Col>
            </Row>
            <Button className="my-4" onClick={transferToken}>
              {"Click to Transfer"}
            </Button>
          </Container>
          {errorMessage}
        </Container>
      </Container>
    </>
  );
}

export default ConnectContract;
