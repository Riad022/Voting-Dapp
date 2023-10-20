import React ,{useState}from "react";
import { useStateContext } from '../context';

const VoteCard = ({
    name,
    description,
    numberOfVotes,
    image,
    rank,
    handleClick,
}) => {
    const [allowed, setallowed] = useState();
    const [time, settime] = useState();
    const { getRemainingTime ,storage} = useStateContext();
    // countdown
    const rem = getRemainingTime();
    rem.then((res)=>{
        settime(parseInt(res._hex, 16))
        console.log(time)
        
    }).catch((e)=>{console.log(e)});
    const cardClassName = (rank === 1 && time===0) ? "sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer border-2 border-[#1dc071] transform scale-110" : "sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer";
    //image from ipfs
    const url = storage.resolveScheme(image);
    return (
        <div
            className={cardClassName}
            onClick={handleClick}
        >
            <img
                src={url}
                alt="vote"
                className="w-full h-[250px] object-cover rounded-[15px]"
            />
            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                        {name}
                    </h3>
                </div>
                <div className="block">
                    <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
                </div>
                <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                    <div className="flex flex-col">
                        <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                            {numberOfVotes}
                        </h4>
                        <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                            Votes
                        </p>
                    </div>
                    <div className="flex flex-col">
                        {(rank === 1 && time===0) && (
                            <p className="mt-[10px] font-epilogue font-normal text-[18px] leading-[18px] text-[#1dc071] sm:max-w-[120px] truncate">
                                Winner
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoteCard;
