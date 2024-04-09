import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { PandaSigner, DefaultProvider, ScryptProvider, toByteString, sha256, bsv } from 'scrypt-ts';

function App() {

  const [formData, setFormData] = useState({
    textFieldDeployContract: '',
    textFieldCallContract: '',
  });

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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

  const deployContract = () => {

    // construct a new instance of `MyContract`
    //let instance = new MyContract(...initArgs);

    // connect the signer to the instance
    //await instance.connect(signer);

    // the contract UTXO’s satoshis
    //const initBalance = 1234;

    // build and send tx for deployment
    //const deployTx = await instance.deploy(initBalance);

    //alert(`Smart contract successfully deployed with txid ${deployTx.id}`);
    alert('deploy contract')

  };

  const callContract = () => {

    // 1) fetch a transaction from txid
    //const tx = await signer.connectedProvider.getTransaction(txId)
    // 2) create instance from transaction
    //const instance = Counter.fromTx(tx, atOutputIndex)

    //console.log('contract called: ', callTx.id);
    alert('Call Contract');
    
  };

  return (
    <div className="App">
      <header className="App-header">

        <button onClick={loadWallet}>Load Wallet</button>
        
        <br />
        
        <p> Deploy Contract With Text Locking Script  <br />
          <input
            type="text"
            name="textFieldDeployContract"
            value={formData.textFieldDeployContract}
            onChange={handleTextFieldChange}
            placeholder="Message"
          />
        
          <button onClick={deployContract}>Deploy Contract</button>
        </p>

        
        <p> Call Contract With Text Unlocking Script <br />
          <input
            type="text"
            name="textFieldCallContract"
            value={formData.textFieldCallContract}
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
