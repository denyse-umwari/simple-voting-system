// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;

    event CandidateAdded(uint id, string name);

    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
        addCandidate("Doe");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name); // Emit event when candidate is added
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate ID."
        );

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(
        uint _candidateId
    ) public view returns (uint, string memory, uint) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }
}
