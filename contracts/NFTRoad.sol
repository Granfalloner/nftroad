// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts@4.4.2/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@4.4.2/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFTRoad is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    constructor() ERC1155("https://nftroad.app/token/") {}

    uint256 payoutRate = 9000; // to be divided by 10000 later

    struct Record { 
        address owner;
        uint256 maxSupply;
        uint256 price;
        string title;
        string description;
        string imageURL;
        bool active;
    }
    mapping(uint256 => Record) public records;
    
    uint256 recordsCount;
    mapping(address => uint256[]) public userRecords;

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(uint256 id, uint256 amount) public payable {
        Record memory record = records[id];
        require(record.owner != address(0x0), "Does not exist");
        uint256 price = record.price * amount;
        require(price == msg.value, "Insufficient Funds");
        require(totalSupply(id) + amount < record.maxSupply, "No more mints allowed");

        _mint(msg.sender, id, amount, "");
        payable(record.owner).transfer(price * payoutRate / 10000);
    }

    function createRecord(uint256 maxSupply, uint256 price, string calldata title, string calldata description, string calldata imageURL) public returns (uint256 tokenId) {
        recordsCount += 1;
        records[recordsCount] = Record({
            owner: msg.sender,
            maxSupply: maxSupply,
            price: price,
            title: title,
            description: description,
            imageURL: imageURL,
            active: true
        });
        return recordsCount;
    }

    function disableRecord(uint256 id) public {
        Record memory record = records[id];
        require(record.owner == msg.sender, "not an owner");
        record.active = false;
        records[id] = record;
    } 

    function updateRecord(uint256 id, uint256 maxSupply, uint256 price, string calldata title, string calldata description, string calldata imageURL) public {
        Record memory record = records[id];
        require(record.owner == msg.sender, "not an owner");
        record.maxSupply = maxSupply;
        record.price = price;
        record.title = title;
        record.description = description;
        record.imageURL = imageURL;
        records[id] = record;
    }        

    function viewRecords(uint256 limit, uint256 offset) external view returns (Record[] memory result) {
        result = new Record[](limit);
        for (uint256 i; i < limit; i++) {
            result[i] = records[i + offset];
        }
        return result;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}

