import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { PandaSigner, DefaultProvider, ScryptProvider, toByteString, sha256, bsv, MethodCallOptions } from 'scrypt-ts';
import { Helloworld } from './contracts/helloworld';

function App() {

  //FOR MANAGING STATE VARIABLES

  const [formData, setFormData] = useState({
    textFieldDeployMessage: '',
    textFieldCallTransactionID: '',
    textFieldCallMessage: '',
  });

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const updateStateVariable = (name:string, value:string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  //FOR MANAGING TRANSACTIONS

  const loadWallet = async () => {

    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    });
  
    const signer = new PandaSigner(provider);
    
    // request authentication
    const { isAuthenticated, error } = await signer.requestAuth();
    
    if (!isAuthenticated) {
        alert(error);
    } else {
      // authenticated
      // you can show user's default address
      const userAddress = await signer.getDefaultAddress();
      alert('user is authenticated ' + userAddress);
    }

  };

  const deployContract = async () => {

    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    });
  
    const signer = new PandaSigner(provider);

    const message = formData.textFieldDeployMessage
    const messageByteString = toByteString(message, true)
    let instance = new Helloworld(sha256(messageByteString));

    // connect the signer to the instance
    await instance.connect(signer);

    // the contract UTXO’s satoshis
    const initBalance = 1234;

    try {
      // build and send tx for deployment
      const deployTx = await instance.deploy(initBalance);
      
      alert(`Successfully Deployed "${message}" at txid ${deployTx.id}`);

      updateStateVariable("textFieldCallTransactionID", deployTx.id)
    
    } catch (error) {
      alert(error)
    }

  };

  const callContract = async () => {

    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    });
  
    const signer = new PandaSigner(provider);

    const txId = formData.textFieldCallTransactionID

    const atOutputIndex = 0

    const tx = await signer.connectedProvider.getTransaction(txId)
    const instance = Helloworld.fromTx(tx, atOutputIndex)

    await instance.connect(signer)

    const nextInstance = instance.next()

    const message = formData.textFieldCallMessage
    const messageByteString = toByteString(message, true)
    
    try {
      const { tx: callTx } = await instance.methods.unlock(messageByteString)
      alert(`Successfully Called "${message}" at txid ${callTx.id}`);
    
    } catch (error) {
      alert(error)
    }

  };

  return (
    <div className="App">
      <header className="App-header">

        <button onClick={loadWallet}>Load Wallet</button>
        
        <br />
        
        <p> Deploy Contract With Text Locking Script  <br />
          <input
            type="text"
            name="textFieldDeployMessage"
            value={formData.textFieldDeployMessage}
            onChange={handleTextFieldChange}
            placeholder="Message"
          />
        
          <button onClick={deployContract}>Deploy Contract</button>
        </p>

        
        <p> Call Contract With Text Unlocking Script <br />
          <input
            type="text"
            name="textFieldCallTransactionID"
            value={formData.textFieldCallTransactionID}
            onChange={handleTextFieldChange}
            placeholder="txID"
          />

          <input
            type="text"
            name="textFieldCallMessage"
            value={formData.textFieldCallMessage}
            onChange={handleTextFieldChange}
            placeholder="Message"
          />
        
          <button onClick={callContract}>Call Contract</button>
        </p>


      </header>
    </div>
  );
}

export default App;
