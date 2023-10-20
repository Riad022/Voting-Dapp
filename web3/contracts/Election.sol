// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";


contract Election {
//dec  
    using Counters for Counters.Counter;
    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;
    address[] public candidateAddress;
    mapping(address => Candidate) candidates;

    
    address[] public approvedVoters;
    address[] public votersAddress;
    mapping(address => Voter ) voters;

    string public title;
    address public votingOrganizer;
    uint256 public votingStartTime;
    uint256 public votingEndTime;

//constructor
    constructor(){
        votingOrganizer = msg.sender;
    }

//Candidate----------------------------------------
    struct Candidate {
        uint256 candidateId;
        string name;
        string description;
        uint256 voteCount;
        address addr;
        string img;
        bool exist;
    }

    event CandidateCreated (
        uint256 indexed candidateId,
        string name,
        string description,
        uint256 voteCount,
        address addr,
        string img,
        bool exist
    );

//voter--------------------------------------------
    struct Voter {
        uint256 voterId;
        address addr;
        bool exist;
        bool voted;
        uint256 allowed;
        uint256 voteTo;
    }

    event voterCreated (
        uint256 indexed voterId,
        address addr,
        bool exist,
        bool voted,
        uint256 allowed,
        uint256 voteTo
    );

//modifier------------------------------------------   

    modifier onlyOrganizer() {
        require(msg.sender == votingOrganizer, "Only the organizer can perform this action");
        _;
    }

    modifier votingPeriod(){
        require (votingStartTime <= block.timestamp && block.timestamp <= votingEndTime,  "Error : voting Period");
        _;
    }

    modifier notExist(){
         require(voters[msg.sender].exist == false,"Voter Already Exist");
        _;
    }

    modifier notStarted(){
        require(votingStartTime >= block.timestamp,"voting is started");
        _;
    }

    modifier candidateNotExists(address addr) {
    require(!candidates[addr].exist, "Candidate already exists");
    _;
 }

//setter--------------------------------------------

    function setCandidate(
        string memory name_,
        string memory description_,
        address addr_,
        string memory img_
    ) public onlyOrganizer candidateNotExists(addr_) notStarted{
          _candidateId.increment();
          uint idNumber = _candidateId.current();
          Candidate storage candidate = candidates[addr_];
          candidate.candidateId = idNumber;
          candidate.name = name_;
          candidate.description = description_;
          candidate.addr = addr_;
          candidate.img = img_;
          candidate.voteCount = 0;
          candidate.exist = true;

          candidateAddress.push(addr_);

          emit CandidateCreated (
          idNumber,
          name_,
          description_,
          candidate.voteCount,
          addr_,
          img_,
          candidate.exist
          );
    }

    function setVoter() public notExist  {
        _voterId.increment();
        uint idNumber = _voterId.current();
        Voter storage voter = voters[msg.sender];
        voter.voterId = idNumber;
        voter.addr = msg.sender;
        voter.exist = true;
        voter.allowed = 0;
        voter.voted = false;
        voter.voteTo = 0;

        votersAddress.push(voter.addr);

        emit voterCreated (
        idNumber,
        voter.addr,
        voter.exist,
        voter.voted,
        voter.allowed,
        voter.voteTo
    );
    }

    function setImportedVoters(address[] memory arr) public onlyOrganizer {
        for(uint256 i = 0; i < arr.length; i++){
             if (voters[arr[i]].exist) continue; 
            _voterId.increment();
            uint idNumber = _voterId.current();
            Voter storage voter = voters[arr[i]];
            voter.voterId = idNumber;
            voter.addr = arr[i];
            voter.exist = true;
            voter.allowed = 1;
            voter.voted = false;
            voter.voteTo = 0;
            votersAddress.push(arr[i]);
            approvedVoters.push(arr[i]);
        }
    }

    function setVotingTime(uint256 _votingEndTime, uint256 _votingStartTime) public onlyOrganizer {
       votingEndTime = _votingEndTime;
       votingStartTime = _votingStartTime;
   }

   function setTitle(string memory _title) public onlyOrganizer notStarted{
     title = _title;
   }

   function resetVoting() public onlyOrganizer {
         // Clear candidate data
        for (uint256 i = 0; i < candidateAddress.length; i++) {
                delete candidates[candidateAddress[i]];
            }
            candidateAddress = new address[](0);

         // Clear voter data
        for (uint256 i = 0; i < votersAddress.length; i++) {
               delete voters[votersAddress[i]];
            }
         votersAddress = new address[](0);

        // Clear arrays
        approvedVoters = new address[](0);

        // CLear voting title
        title = "Title";

        //clear deadline
        votingStartTime = 0;
        votingEndTime = 0;
    
        // Reset counters
        _candidateId.reset();
        _voterId.reset();
   }

//Function-------------------------------------------

    function approve(address addr_) public onlyOrganizer{
        Voter storage voter = voters[addr_];
        require(voter.allowed == 0,"already aproved");
        voter.allowed = 1;        
    }

    function remove(address addr_) public onlyOrganizer {
        Voter storage voter = voters[addr_];
        require(voter.allowed != 0);
        voter.allowed = 0;
    }

    function vote(address candidateAddress_) external votingPeriod{

        Voter storage voter = voters[msg.sender];
        require(voter.voted != true,"you have already voted");
        require(voter.allowed != 0,"you have no right to vote");
        voter.voteTo = candidates[candidateAddress_].candidateId;
        voter.voted = true;
        candidates[candidateAddress_].voteCount += voter.allowed;
        voter.voteTo = 0;
    }

     function check() public view returns(bool){
        if(votingStartTime <=block.timestamp && votingStartTime != 0) return true;
        else return false;
    }

//getters-------------------------------------------------------------------------------
    
    function getAllVotersData() public view returns(Voter[] memory){
        Voter[] memory allVoters = new Voter[](votersAddress.length);

        for(uint i = 0; i < votersAddress.length; i++){
            Voter storage data = voters[votersAddress[i]];
            allVoters[i] = data;
        }
       return allVoters;
    }

    function getRemainingTime() public view returns (uint256) {
         if (block.timestamp >= votingEndTime) return 0;
         else return votingEndTime - block.timestamp;
    }

    function getAllCandidatesData() public view returns(Candidate[] memory){
        Candidate[] memory allCandidates = new Candidate[](candidateAddress.length);

        for(uint i = 0; i < candidateAddress.length; i++){
            Candidate storage data = candidates[candidateAddress[i]];
            allCandidates[i] = data;
        }
        return allCandidates;

    }

    function getVoterVotedTo(address candidateAddress_) public view returns (address[] memory) {
     uint256 count = 0;
    
     for (uint256 i = 0; i < approvedVoters.length; i++) {
        if (voters[approvedVoters[i]].voteTo == candidates[candidateAddress_].candidateId) count++;
     }
    
     address[] memory result = new address[](count);
     uint256 resultIndex = 0;
    
     for (uint256 i = 0; i < approvedVoters.length; i++) {
        if (voters[approvedVoters[i]].voteTo == candidates[candidateAddress_].candidateId) {
            result[resultIndex] = approvedVoters[i];
            resultIndex++;
        }
     }
     return result;
 }
}