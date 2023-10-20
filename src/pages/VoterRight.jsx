import React, { useState , useEffect,useRef } from 'react'
import { CustomButton, Loader ,Snackbar} from '../components';
import {useStateContext } from '../context';

const SnackbarType = {
  success: "success",
  fail: "fail",
};

const VoterRight = () => {
  const snackbarRef = useRef(null);
  const [message, setmessage] = useState();
  const [cond, setcond] = useState();

  const [isLoading, setisLoading] = useState(false);
  const [voters, setvoters] = useState([]);
  const {rightToVote , getAllVoters , contract , address ,remove ,setVotersByFile} = useStateContext();
  
   // Handle file selection
  const handleFileSelect = async (event) => {
    try {
      setisLoading(true);
      const file = event.target.files[0];
      const fileContent = await readFileContent(file);
      const addresses = extractAddresses(fileContent);
      // Process the addresses as needed
      console.log(addresses);
      await setVotersByFile(addresses) ;
      setisLoading(false);

    } catch (error) {
      setisLoading(false);
      console.error('Error reading file:', error);
    }
    fetchVoters();
  };

  // Read file content as text
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  // Extract addresses from file content
  const extractAddresses = (fileContent) => {
    const lines = fileContent.split('\n');
    const addresses = lines.map((line) => line.replace('\r', '')).filter((line) => line.trim() !== '');
    return addresses;
  };
  
  
  //fetch voters from BlockChain
  const fetchVoters = async () => {
    setisLoading(true);
    const data = await getAllVoters();
    var updatedData = data.map((item) => {
      return { ...item, allowed: parseInt(item.allowed._hex) };
    });


    // Sort the updatedData array based on the 'allowed' property
    updatedData.sort((a, b) => {
      if (a.allowed === 0 && b.allowed !== 0) {
        return -1; // 'a' comes before 'b'
      } else if (a.allowed !== 0 && b.allowed === 0) {
        return 1; // 'b' comes before 'a'
      } else {
        return 0; // Maintain the same order
      }
    });
  
    setvoters(updatedData);
    setisLoading(false);
  };
  

  useEffect(() => {
    if(contract) fetchVoters();
  }, [contract, address ])


    const handleApprouve = async (index) => {
      try {
        setisLoading(true);
        await rightToVote(voters[index].address);
        setmessage("You Can Vote Now!");
        setcond(SnackbarType.success);
      } catch (e) {
        setmessage("Something went wrong!");
        setcond(SnackbarType.fail);
      }
      setisLoading(false);
      snackbarRef.current.show();
      fetchVoters();
    };

const handleRemove = async (index)=>{
  try{
    setisLoading(true);
    await remove(voters[index].address);
    setmessage("Permission removed");
    setcond(SnackbarType.success);
  }catch(e){
    setisLoading(false);
    setcond(SnackbarType.fail);
  }
  setisLoading(false)
  snackbarRef.current.show();
  fetchVoters();
}


return (
  <div className=' flex flex-col gap-[40px]'>
  <div className="flex flex-col ">
      <h1 className='font-epilogue font-semibold text-[18px] text-[#9d9c9c] mb-5 '>Add Voters By File </h1>
            <input 
            type="file"
            step="0.1"
            placeholder="Place image"
            className="relative m-0 block md:w-[500px] min-w-0 flex-auto  rounded-[10px] outline-none border-[1px] border-[#3a3a43] bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-[#adadad] file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
      
            onChange={handleFileSelect}
            />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">TXT (ADDRESSES ONLY).</p>

      </div>
  <h1 className='font-epilogue font-semibold text-[18px] text-[#9d9c9c]'>Voter Requests</h1>
  <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 max-h-[500px] overflow-y-auto">
    <Snackbar
        ref={snackbarRef}
        message={message}
        type={cond}
      />
  {isLoading && <Loader />}
  {!isLoading && voters.length === 0 && (
                    <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                        there are no requests
                    </p>
                )}
  {voters.map((voter,i)=>(
    <div
    key={i}
    className={`flex flex-no-wrap justify-between p-[16px] pl-5 mb-4 w-4/5 bg-[#3a3a43] rounded-[10px] `}
  >
    <p key={i} className='text-[#9d9c9c] text-[18px]'>{voter.address} {voter.allowed===1 && '(Approuved)'}</p>
    <div className='flex gap-[10px]'>
    <CustomButton 
      id={i}
      btnType='submit'
      title='Approuve'
      styles={`${voter.allowed===0 ?`bg-[#8c6dfd]`:'bg-[#d5d1e3]'} min-h-[40px]`} 
      handleClick={() => handleApprouve(i)}
      disabled={voter.allowed}
    />
    <CustomButton 
      id={i}
      btnType='submit'
      title='Reject'
      styles={`${voter.allowed===1 ?`bg-[#F96746]`:'bg-[#d5d1e3]'} min-h-[40px] md:min-w-[110px]`} 
      handleClick={() => handleRemove(i)}
      disabled={!voter.allowed}
    />
    </div>
    </div>
  ))}
  </div>

  </div>
)
}

export default VoterRight