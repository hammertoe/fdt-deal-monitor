// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
contract EdgeURContract {
    event StoreURIEvent(string uri);

    function StoreURI(string memory uri) public {
        emit StoreURIEvent(uri);
    }
}
