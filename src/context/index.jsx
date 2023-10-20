import React, { useContext, createContext ,useState } from 'react';
import { useAddress, useContract, useMetamask ,useStorageUpload} from '@thirdweb-dev/react';
import { ThirdwebStorage } from "@thirdweb-dev/storage";
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const contract_address = '0x2f4aCF8EaAF78b60c5f1Da3D31Be532b627380d1';
  const { contract} = useContract(contract_address);
  const { mutateAsync: upload } = useStorageUpload();

  const address = useAddress();
  const connect = useMetamask();
  //Storage
  const storage = new ThirdwebStorage();
  const Upload = async(image)=>{
  const uri = await upload(
    {
      data: [image],
      options:{
        uploadWithGatewayUrl:true,
        uploadWithoutDirectory:true
      }
    }
    );
  return uri 
  }
  //SET CANDIDATES
  const setCandidates = async (candidates) => {
    try {
      await Promise.all(
        candidates.map(async (cnd) => {
          const img = await Upload(cnd.image);
          const args = [cnd.name, cnd.desc, cnd.address, img[0]];
          await contract.call('setCandidate', args, {
            gasLimit: 3000000, // override default gas limit
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  

  

  // GET ALL CANDIDATES INFOS
  const getAllCandidates = async () => {
    const candidates = await contract.call('getAllCandidatesData');

    const parsedCnd = candidates.map((cnd, i) => ({
      id : cnd.candidateId,
      name: cnd.name,
      address: cnd.addr,
      description: cnd.description,
      image: cnd.img,
      numberOfVotes: cnd.voteCount,
    }));

    return parsedCnd;
  }
  // Set Deadline
  const setVotingTime = async (end , start) =>{
    await contract.call('setVotingTime',[end , start])
  }

  //Set Title

  const setTitle = async (title) =>{
    await contract.call('setTitle',[title])
  }
  // getTitle

  const getTitle = async() =>{
    const data = await contract.call('title');
    return data
  }


  // resetVoting 
  const reset = async()=>{
    await contract.call('resetVoting');
  }

  // Set Voters
  const setVoters = async () =>{
    await contract.call('setVoter');
  }

  // Set voters by file
  const setVotersByFile = async (addr)=>{
    await contract.call('setImportedVoters',[addr]);
  }

  // getAllVoters
  const getAllVoters = async () => {
    const voters = await contract.call('getAllVotersData');

    const parsedvtr = voters.map((vtr, i) => ({
      name: vtr.name,
      address: vtr.addr,
      allowed: vtr.allowed
    }));

    return parsedvtr;
  }
  //getVoterVotedTo
  const getVotersTo = async(address)=>{
    const voters =await contract.call('getVoterVotedTo',[address])
    return voters
  }

  // RIGHT TO VOTE
  const rightToVote = async (Addr)=>{
    const data  = await contract.call('approve',[Addr]);
    return data ;
  }

  // remove
  const remove = async(addr)=>{
    const data = await contract.call('remove',[addr])
    return data ;
  }

  // VOTE
  const vote = async (cndAdd) => {
    const data = await contract.call('vote', [cndAdd]);
    return data;
  }

  // get remainging time
  const getRemainingTime = async ()=>{
    const data = await contract.call('getRemainingTime');
    return data ;
  }

  const getStarttime = async () => {
    let data = await contract.call('votingStartTime');
    const startTime = parseInt(data._hex, 16);
    console.log("starttime:" +startTime);
/*    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  
    if (currentTime >= startTime) {
      return 0; // Return 0 since the start time has already passed
    } else {
      const remainingTime = startTime - currentTime;
      return remainingTime;
    }
    */
  return startTime;
  };

  const getEndtime = async () => {
    let data = await contract.call('votingEndTime');
    const endTime = parseInt(data._hex, 16);
    console.log("endTime: " +endTime);
/*    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  
    if (currentTime >= endTime) {
      return 0; // Return 0 since the start time has already passed
    } else {
      const remainingTime = endTime - currentTime;
      return remainingTime;
    }
    */
  return endTime;
  };
  // getCheck
  const check = async ()=>{
    const data = await contract.call('check');
    return data;
  }
  //get votingOrganizer
  //const { admin} = useContractRead(contract, "votingOrganizer")
  const admin ='0xE00694Be93a1d1Ed3701C9547493db597Dfc908E';

// searchBar 
const [searchQuery, setSearchQuery] = useState('');

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };



  return (
    <StateContext.Provider
      value={{ 
        admin,
        address,
        contract,
        connect,
        setCandidates,
        getAllCandidates,
        setVotingTime,
        setVoters,
        getAllVoters,
        rightToVote,
        vote,
        getRemainingTime,
        searchQuery ,
        updateSearchQuery ,
        getTitle,
        setTitle,
        getVotersTo,
        reset,
        storage,
        Upload,
        remove,
        setVotersByFile,
        check,
        getStarttime,
        getEndtime
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext); 