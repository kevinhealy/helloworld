import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { PandaSigner, ScryptProvider, toByteString, sha256 } from 'scrypt-ts';

function App() {


  const [formData, setFormData] = useState({
    textFieldOne: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello World sCrypt App
        </p>
        <input
                type="text"
                name="textFieldOne"
                value={formData.textFieldOne}
                onChange={handleChange}
                placeholder="Message"
              />



<button>{"submit"}</button>


      </header>
    </div>
  );
}

export default App;
