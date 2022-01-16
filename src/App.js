import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import nftroadabi from "./nftroad.json"
import './App.css';

import Create from './Create.js'

const provider = new ethers.providers.InfuraProvider(137, "3161b9b2a1d04bc4b1720629f18afd7d")

const address = "0x8B204E9349885bCd7cB1ef0208Ee736a78fc082D"

let contract = new ethers.Contract(address, nftroadabi, provider);


function Footer() {

    return (
        <footer className="m-5 text-center">
            <p>
                <b>NFTs that will be your subscription to some creative content platform</b><br /><br />
                ✅ you can resell your NFT , and your subscription.<br />
                ✅ platform and creatives will get royalties from reselling subscription.<br />
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
            // debugger
            setRecords(result.filter(x => x.maxSupply > 0))
        }
        init()
    }, [])

    const [filter, setFilter] = useState([]);

    const [walletConnected, setWalletConnected] = useState(0);

    async function connectWallet() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Prompt user for account connections
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletConnected(address);
        } catch (error) {
            setWalletConnected(0);
            console.error(error);
        }
    }

    function changeFilter() {

    }

    return (
        <div className="background-main">
            <div className="grid grid-cols-5 gap-6">
                <div className="background-secondary">
                    <div>
                        <div className="p-4 pt-10">
                            <select className="select select-bordered select-warning w-full max-w-xs" onChange={(event) => console.log(event.target.value)}>
                                <option>Polygon</option>
                                <option>Harmony</option>
                            </select>
                            <br />
                            <br />
                            <p className="break-all text-amber-500 text-sm">{walletConnected ? `Wallet: ${walletConnected}` : ""}</p>
                            <button className="btn btn-warning w-full bg-amber-500" onClick={connectWallet}>{walletConnected ? "Change wallet" : "Connect your wallet"}</button>
                            <br />
                        </div>
                        <ul className="menu py-3">
                            <li className="menu-title text-sm p-4 text-amber-500">
                                #CUSTOMER
                            </li>
                            <li style={{display: 'block'}}>
                                <img alt="" style={{display: 'inline'}} className="pl-5 pr-5" src="/resources/icons/AllCourses.svg" />
                                <button className="text-white">
                                    All courses
                                </button>
                            </li>
                            <br /> 
                            <li style={{display: 'block'}}>
                                <img alt="" style={{display: 'inline'}} className="pl-5 pr-5" src="/resources/icons/MyNFTs.svg" />
                                <button className="text-white">
                                    My NFTs
                                </button>
                            </li>
                        </ul>

                        <ul className="menu py-3">
                            <li className="menu-title p-4 text-amber-500">
                                #CREATOR
                            </li>
                            <li style={{display: 'block'}}>
                                <img alt="" style={{display: 'inline'}} className="pl-5 pr-5" src="/resources/icons/MyCourses.svg" />
                                <button className="text-white">
                                    My courses
                                </button>
                            </li>
                            <br />
                            <li style={{display: 'block'}}>
                                <img alt="" style={{display: 'inline'}} className="pl-5" src="/resources/icons/CreateCourse.svg" />
                                <Link to="/create" style={{display: 'inline'}} className="pt-0">
                                    <button className="text-white">
                                        Create course
                                    </button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-3 col-span-4 gap-6 pt-10">
                    {records.map(record => {
                        console.log(record);
                        record.forEach(x => console.log(x));
                        return (
                            <div className="card card-bordered background-secondary">
                                <figure>
                                    <img alt="" src={record.imageURL} />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{record.title}
                                        <div className="badge mx-2 badge-warning text-amber-500">NEW</div>
                                    </h2>
                                    <p>{record.description}</p>
                                    <div className="justify-end card-actions">
                                        <button className="btn btn-warning bg-amber-500">Buy</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
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
