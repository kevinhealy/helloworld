import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { PandaSigner, DefaultProvider, ScryptProvider, toByteString, sha256, bsv } from 'scrypt-ts';

function App() {

  const [formData, setFormData] = useState({
    textFieldOne: '',
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

  const submitForm = () => {
    alert('Submit Form');
  };

  return (
    <div className="App">
      <header className="App-header">

      <button onClick={loadWallet}>Load Wallet</button>

        <p>
          Hello World sCrypt App
        </p>
        <input
                type="text"
                name="textFieldOne"
                value={formData.textFieldOne}
                onChange={handleTextFieldChange}
                placeholder="Message"
              />
      

      <button onClick={submitForm}>Submit Form</button>


      </header>
    </div>
  );
}

export default App;
