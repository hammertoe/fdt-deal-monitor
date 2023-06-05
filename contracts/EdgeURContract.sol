// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
contract EdgeURContract {
    event StoreURIEvent(string uri);

    mapping(string => uint256) public uriToJobId;
    mapping(uint256 => string) public jobIdtoCid;
    mapping(string => uint256) public cidToDealId;
    mapping(string => string) public cidToStatus;

    function storeURI(string memory uri) public {
        uriToJobId[uri] = 0;
        emit StoreURIEvent(uri);
    }

    // Update the data associated with a Job ID
    function updateJobId(string memory uri, uint256 jobId, string memory cid) public {
        uriToJobId[uri] = jobId;
        jobIdtoCid[jobId] = cid;
        cidToStatus[cid] = "pinned";
    }

    // Update deal id of a cid
    function updateDealId(string memory cid, uint256 dealId, string memory status) public {
        cidToDealId[cid] = dealId;
        cidToStatus[cid] = status;
    }
}
