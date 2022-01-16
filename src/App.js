import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import nftroadabi from "./nftroad.json"
import './App.css';

const provider = new ethers.providers.InfuraProvider(137, "3161b9b2a1d04bc4b1720629f18afd7d")

const address = "0x2c9286f482e635009ed6eaaf478b84869493b0fb"

let contract = new ethers.Contract(address, nftroadabi, provider);


function Header() {

  return (
      <header className="m-5 text-center">
        <p>
            <b>NFTs that will be your subscription to some creative content platform</b><br/><br/>
            ✅ you can resell your NFT , and your subscription.<br/>
            ✅ platform and creatives will get royalties from reselling subscription.<br/>
        </p>
        <a
          href="https://discord.gg/39AMveCHKD"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Discord
        </a>
      </header>
  )
}

function Home() {

  const [records, setRecords] = useState([])

  useEffect(() => {
    async function init() {
      const result = await contract.viewRecords(20, 0)
      setRecords(result.filter(x=>x.maxSupply > 0))
    }
    init()
  }, [])
  
  async function createRecord() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    contract = contract.connect(signer)
    await contract.createRecord(ethers.utils.parseEther('0.01'), 100);
  }

  return (
      <div>
          <Header />
          <div className="grid grid-cols-5 gap-4">
              <div>
                  <div>
                      <div>
                          <button onClick={() => createRecord(0.01, 100)}>Add Course(0.01 matic, 100 items)</button>
                          <br />
                          Records: {JSON.stringify(records)}
                      </div>

                  </div>
              </div>

              <div className="grid grid-cols-3 col-span-4 gap-4">
                  <div className="card card-bordered">
                      <figure>
                          <img src="https://picsum.photos/id/1005/400/250" />
                      </figure>
                      <div className="card-body">
                          <h2 className="card-title">Top image
                              <div className="badge mx-2 badge-secondary">NEW</div>
                          </h2>
                          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                          <div className="justify-end card-actions">
                              <button className="btn btn-secondary">More info</button>
                          </div>
                      </div>
                  </div>
                  <div className="card card-bordered">
                      <div className="card-body">
                          <h2 className="card-title">Image bottom</h2>
                          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                          <div className="card-actions">
                              <button className="btn btn-primary">Login</button>
                              <button className="btn btn-ghost">Register</button>
                          </div>
                      </div>
                      <figure>
                          <img src="https://picsum.photos/id/1005/400/250" />
                      </figure>
                  </div>
                  <div className="card card-bordered">
                      <figure>
                          <img src="https://picsum.photos/id/1005/60/40" class="w-full" />
                      </figure>
                      <div className="card-body">
                          <h2 className="card-title">Small image file</h2>
                          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                          <div className="card-actions">
                              <div className="badge badge-ghost">Article</div>
                              <div className="badge badge-ghost">Photography</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

function Create() {
  return (
    <div>
      <h4 className="text-lg text-center m-5">Sell Course</h4>

      <div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
}


export default App;
