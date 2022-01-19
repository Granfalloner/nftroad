import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import nftroadabi from "./nftroad.json"
import './App.css';

import Create from './Create.js'

const provider = new ethers.providers.InfuraProvider(137, "3161b9b2a1d04bc4b1720629f18afd7d")

const address = "0x8B204E9349885bCd7cB1ef0208Ee736a78fc082D"

let contract = new ethers.Contract(address, nftroadabi, provider);


function WalletInfo(props) {
    return (
        <div className="p-4 pt-10">
            <select className="select select-bordered select-warning w-full max-w-xs"
                onChange={(event) => console.log(event.target.value)}>
                <option>Polygon</option>
                <option>Harmony</option>
            </select>
            <br />
            <br />
            <p className="break-all text-amber-500 text-sm">{props.walletConnected ? `Wallet: ${props.walletConnected}` : ""}</p>
            <button className="btn btn-warning w-full bg-amber-500" onClick={props.connectWallet}>{props.walletConnected ? "Change wallet" : "Connect your wallet"}</button>
            <br />
        </div>
    )
}

function MenuItem(props) {
    return (
        <li>
            <img alt="" className="pl-5 pr-5" src={props.image} />
            <button className="text-white" onClick={() => props.setFilter(props.value)}>
                {props.title}
            </button>
        </li>
    )
}

function CustomerMenu(props) {
    return (
        <ul className="side-menu menu py-3">
            <li className="menu-title text-sm p-4 text-amber-500">
                #CUSTOMER
            </li>
            <MenuItem title="All courses" image="/resources/icons/AllCourses.svg" setFilter={() => props.setFilter(0)} />
            <br />
            <MenuItem title="My NFTs" image="/resources/icons/MyNFTs.svg" setFilter={() => props.setFilter(1)} />
        </ul>
    )
}

function CreatorMenu(props) {
    return (
        <ul className="side-menu menu py-3">
            <li className="menu-title p-4 text-amber-500">
                #CREATOR
            </li>
            <MenuItem title="My courses" image="/resources/icons/MyCourses.svg" setFilter={() => props.setFilter(2)} />
            <br />
            <Link to="/create">
                <MenuItem title="Create course" image="/resources/icons/CreateCourse.svg" setFilter={() => {}} />
            </Link>
        </ul>
    )
}

function CourseCard(props) {
    return (
        <div className="card card-bordered background-secondary">
            <figure>
                <img alt="" src={props.record.imageURL} />
            </figure>
            <div className="card-body">
                <h2 className="card-title text-white">{props.record.title}
                    <div className="badge mx-2 badge-warning text-amber-500">NEW</div>
                </h2>
                <p className="text-white">{props.record.description}</p>
                <div className="justify-end card-actions">
                    <button className="btn btn-warning bg-amber-500">Buy</button>
                </div>
            </div>
        </div>
    )
}

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
            setRecords(result.filter(x => x.maxSupply > 0))
        }
        init()
    }, [])

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

    const [filter, setFilter] = useState(0);

    return (
        <div className="background-main">
            <div className="grid grid-cols-5 gap-6">
                <div className="background-secondary">
                    <WalletInfo walletConnected={walletConnected} connectWallet={connectWallet} />
                    <CustomerMenu setFilter={setFilter} />
                    <CreatorMenu setFilter={setFilter} />
                </div>

                <div className="grid grid-cols-3 col-span-4 gap-6 pt-10">
                    {
                        records
                        .filter(record => record.active)
                        .filter(record => {
                            switch (filter) {
                                case 0: return true;
                                case 1: return false;
                                case 2: return record.owner == walletConnected;
                                default: return true;
                            }
                        })
                        .map(record => <CourseCard record={record} />)
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <div id="app" className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create contract={contract} />} />
            </Routes>
        </div>
    );
}


export default App;
