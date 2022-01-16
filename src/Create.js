import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

import { create as ipfsHttpClient } from 'ipfs-http-client'
import ImageUploader from 'react-images-upload';

const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export default function Create({ contract }) {

  const [picture, setPicture] = useState(null);
  const [url, setURL] = useState(null);
  const [loading, setLoading] = useState(false);

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
    await contract.createRecord(ethers.utils.parseEther('0.01'), 100);
    setLoading(false)
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
          <input type="text" placeholder="Title" className="input input-accent input-bordered" />
        </div>
      </div>

      <div className="form-control mt-5">
        <textarea className="textarea h-24 textarea-bordered textarea-accent" placeholder="Description"></textarea>
      </div>

      <div>
        <div className="form-control mt-10">
          <input type="number" placeholder="Supply" className="w-1/5 input-sm input input-accent input-bordered" />
        </div>
      </div>

      <div>
        <div className="form-control mt-1">
          <input type="number" placeholder="Price" className="w-1/5 input-sm input input-accent input-bordered" />
        </div>
      </div>
      </div>

      <button onClick={createRecord} className={`mt-5 btn btn-block btn-primary ${loading ? 'loading disabled': ''}`}>Create Course</button> 

    </div>
  );
}
