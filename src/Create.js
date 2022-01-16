import React, { useState } from 'react';
import { ethers } from "ethers";

import { create as ipfsHttpClient } from 'ipfs-http-client'
import ImageUploader from 'react-images-upload';

const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export default function Create({ contract }) {

  const [picture, setPicture] = useState(null);
  const [url, setURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(undefined);
  const [maxSupply, setMaxSupply] = useState(undefined);

  console.log(picture)
  const onDrop = async (pictures) => {
    if (!pictures.length) {return}

    const file = pictures[0];
    setPicture(file);

    try {
        const added = await ipfs.add(file)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setURL(url);
        console.log(url)
    } catch (err) {
        console.log('Error uploading the file : ', err)
    }

  };

  async function createRecord() {
    setLoading(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    contract = contract.connect(signer)

    debugger;
    const tx = await contract.createRecord(
      maxSupply,
      ethers.utils.parseEther('' + price),
      title,
      description,
      url,
    );
    await tx.wait();
    setLoading(false)
    alert(`Done. TX: ${JSON.stringify(tx)}`)
  }

  return (
    <div className="container mx-auto">
      <h4 className="text-lg text-center m-5">Sell Course</h4>

      <ImageUploader
          withIcon={true}
          buttonText='Select Image'
          onChange={onDrop}
          imgExtension={['.jpg', '.gif', '.png', '.gif']}
          maxFileSize={5242880}
          singleImage={true}
          withPreview={true}
      />

      <div>
      <div>
        <div className="form-control">
          <input onChange={(e) => {setTitle(e.target.value)}} type="text" placeholder="Title" className="input input-accent input-bordered" />
        </div>
      </div>

      <div className="form-control mt-5">
        <textarea onChange={(e) => {setDescription(e.target.value)}} className="textarea h-24 textarea-bordered textarea-accent" placeholder="Description"></textarea>
      </div>

      <div>
        <div className="form-control mt-10">
          <input onChange={(e) => {setMaxSupply(e.target.value)}} type="number" min="0" step="1" placeholder="Supply" className="w-1/5 input-sm input input-accent input-bordered" />
        </div>
      </div>

      <div>
        <div className="form-control mt-1">
          <input onChange={(e) => {setPrice(e.target.value)}} type="number" placeholder="Price" className="w-1/5 input-sm input input-accent input-bordered" />
        </div>
      </div>
      </div>

      <button onClick={createRecord} className={`mt-5 btn btn-block btn-primary ${loading ? 'loading disabled': ''}`}>Create Course</button> 

    </div>
  );
}
