import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import nftroadabi from "./nftroad.json"
import './App.css';

import Create from './Create.js'

const provider = new ethers.providers.InfuraProvider(137, "3161b9b2a1d04bc4b1720629f18afd7d")

const address = "0x2c9286f482e635009ed6eaaf478b84869493b0fb"

let contract = new ethers.Contract(address, nftroadabi, provider);


function Footer() {

  return (
      <footer className="m-5 text-center">
        <p>
            <b>NFTs that will be your subscription to some creative content platform</b><br/><br/>
            ✅ you can resell your NFT , and your subscription.<br/>
            ✅ platform and creatives will get royalties from reselling subscription.<br/>
        </p>
        <br />
        <a
          href="https://discord.gg/39AMveCHKD"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Discord
        </a>
      </footer>
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
  
  return (
      <div className="background-main">
          <div className="grid grid-cols-5 gap-6">
              <div className="background-secondary ">
                  <div>
                      <div className="p-2 pt-10">
                          <button className="btn btn-warning bg-amber-500" onClick={() => console.log("TBD")}>Connect your wallet</button>
                          <br />
                      </div>
                      <ul className="menu py-3">
                          <li className="menu-title text-sm p-4 text-amber-500">
                              #CUSTOMER
                          </li>
                          <li>
                              <a>
                                  <img className="pr-5" src="/resources/icons/AllCourses.svg" />
                                  All courses
                              </a>
                          </li>
                          <li>
                              <a>
                                  <img className="pr-5" src="/resources/icons/MyNFTs.svg" />
                                  My NFTs
                              </a>
                          </li>
                      </ul>

                      <ul className="menu py-3">
                          <li className="menu-title p-4 text-amber-500">
                                #CREATOR
                          </li>
                          <li>
                              <a>
                                  <img className="pr-5" src="/resources/icons/MyCourses.svg" />
                                  My courses
                              </a>
                          </li>
                          <li>
                              <a href="/create">
                                  <img className="pr-5" src="/resources/icons/CreateCourse.svg" />
                                  Create course
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>

              <div className="grid grid-cols-3 col-span-4 gap-6">
                  <div className="card card-bordered background-secondary">
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
                  <div className="card card-bordered background-secondary">
                      <figure>
                          <img src="https://picsum.photos/id/1005/400/250" />
                      </figure>
                      <div className="card-body">
                          <h2 className="card-title">Image bottom</h2>
                          <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                          <div className="card-actions">
                              <button className="btn btn-primary">Login</button>
                              <button className="btn btn-ghost">Register</button>
                          </div>
                      </div>
                  </div>
                  <div className="card card-bordered background-secondary">
                      <figure>
                          <img src="https://picsum.photos/id/1005/60/40"/>
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
          <Footer />
      </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create contract={contract} />} />
      </Routes>
    </div>
  );
}


export default App;
