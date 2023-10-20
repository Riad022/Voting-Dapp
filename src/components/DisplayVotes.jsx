import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoteCard from './VoteCard';
import { loader } from '../assets';
import { useStateContext } from '../context';

const DisplayVotes = ({ title, isLoading, condidates }) => {
    const navigate = useNavigate();

    const handleNavigate = (condidates) => {
        navigate(`/vote-details/${condidates.name}`, { state: condidates })
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const { getRemainingTime, contract, check ,getStarttime ,getEndtime} = useStateContext();
    const [checkk, setcheckk] = useState();

    const [starttime, setstarttime] = useState(0);
    const [endtime, setendtime] = useState(0);
    if(contract){
        getStarttime().then((res)=>{
            setstarttime(res);
        })
        getEndtime().then((res)=>{
            setendtime(res);
        })
    }
    console.log("staaaaaaaart:" + starttime);
    console.log("ennnnnnnnd:" +endtime)

    const calculateRem = (data) => {
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    if (currentTime >= data) {
      return 0; // Return 0 since the start time has already passed
    } else {
        const remainingTime = data - currentTime;
        return remainingTime;
    }
    }

    const countdown = (remainingSeconds) => {
        const totalDays = Math.floor(remainingSeconds / 86400);
        const hoursRemaining = remainingSeconds % 86400;

        const totalHours = Math.floor(hoursRemaining / 3600);
        const minutesRemaining = hoursRemaining % 3600;

        const totalMinutes = Math.floor(minutesRemaining / 60);
        const totalSeconds = minutesRemaining % 60;

        setDays(totalDays);
        setHours(totalHours);
        setMinutes(totalMinutes);
        setSeconds(totalSeconds);

        if (remainingSeconds > 0) {
            setTimeout(() => countdown(remainingSeconds - 1), 1000); // Call the countdown function again after 1 second with updated remaining seconds
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const currentTime = Math.floor(Date.now() / 1000);
            if(starttime <= currentTime && starttime !== 0){
                const sec = calculateRem(endtime);
                countdown(sec);
            }else{
                const sec = calculateRem(starttime);
                countdown(sec);
            }
            
        };
        if (contract) fetchData();
    }, [starttime ]);
    return (
        <div>
            {(starttime <= currentTime && starttime !== 0 && currentTime <= endtime)? (
                <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                    {title} {"("}{days > 0 && `${days}d `} {hours} : {minutes} : {seconds} {")"}
                </h1>
            ) : (title === '')?(
                <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                    No Election has been set yet
                </h1>
            ): (currentTime>endtime && starttime!==0) ? (
                <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                    {title} has Ended 
                </h1>
            ) : (starttime > currentTime && currentTime!==0) ?(
                <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                    {title} will start in {"("}{days > 0 && `${days}d `} {hours} : {minutes} : {seconds} {")"}
                </h1>
            ):(console.log("nothing"))}


            <div className="flex flex-wrap mt-[35px] gap-[26px]">
                {isLoading && (
                    <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
                )}

                {!isLoading && condidates.length === 0 && (
                    <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                        there are no candidates
                    </p>
                )}

                {!isLoading && condidates.length > 0 && condidates.map((cnd) => <VoteCard
                    key={cnd.id}
                    {...cnd}
                    handleClick={() => handleNavigate(cnd)}
                />)}
            </div>
        </div>
    )
}

export default DisplayVotes