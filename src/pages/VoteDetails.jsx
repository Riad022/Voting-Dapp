import React, { useState, useEffect , useRef }  from 'react'
import { useLocation ,useNavigate} from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, Loader , CustomButton ,Snackbar} from '../components';
import { thirdweb } from '../assets';


const SnackbarType = {
  success: "success",
  fail: "fail",
};



const VoteDetails = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef(null);
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setmessage] = useState();
  const [cond, setcond] = useState();
  const {vote ,getVotersTo, contract,address} = useStateContext(); 
  
  const [voters, setvoters] = useState([]);

  const fetchVoters =async (addressC) =>{
    try{
    const data = await getVotersTo(addressC);
    setvoters(data);
    console.log(data);
    console.log(voters);
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    if(contract) fetchVoters(state.address);
  }, [contract, address])


  const handleVote = async() =>{
    try{
    setIsLoading(true);
    await vote(state.address);
    setmessage("Vote Completed Successfully!");
    setcond(SnackbarType.success);
  }catch(e){
    console.log(e);
    setmessage("Something went wrong!");
    setcond(SnackbarType.fail);
  }
    setIsLoading(false);
    snackbarRef.current.show();
    fetchVoters();

    setTimeout(() => {
      navigate('/');
    }, 3000);
  }
  return (
    <div>
      <Snackbar
        ref={snackbarRef}
        message={message}
        type={cond}
      />
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
        <div className="flex flex-col w-full  md:flex-row justify-between gap-[30px]">
        <img src={state.image} alt={state.name} className="w-[400px] h-[410px] object-cover rounded-xl"/>
          <CountBox title={`Votes`} value={state.numberOfVotes} />
          <CountBox title={`Rank`} value={state.rank} />
          <CountBox title={`percentage`} value={isNaN(state.percentage) ? 0 : state.percentage} />
        </div>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
          </div>
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">{state.name}</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">{state.address}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Description</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Voters</h4>
    {voters.length > 0 ? (
      voters.map((voter, i) => (
        <div className="mt-[20px] flex flex-col gap-4" key={i}>
          <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">{voter}</p>
        </div>
      ))
    ) : (
      <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">There are no voters yet</p>
    )}
  </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Vote</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Feel free to Vote
            </p>
            <CustomButton
            btnType = 'submit'
            title = 'Vote'
            handleClick={()=>handleVote()}
            styles="bg-[#1dc071] mt-[15px]"
            />
            
          </div>
        </div>
      </div>
    </div>
  )
  }

export default VoteDetails