import React, { useState } from 'react';
import CustomButton from './CustomButton';

const VotingOptions =({ options })=> {
const [votes, setVotes] = useState({});
const [voted, setVoted] = useState(false);

const handleVote = (option) => {
    if (!voted) {
    setVotes(prevVotes => {
    return{
    ...prevVotes,
    [option]: (prevVotes[option] || 0) + 1
        }
    });
    setVoted(true);
    }
};

return (
    <div className="flex flex-col space-y-4">
        {options.map(option => (
            <div key={option} className="flex items-center">
            <CustomButton
            btnType="button"
            title={option}
            styles="w-full bg-[#8c6dfd] mt-[20px]"
            handleClick={() => handleVote(option)}
            />
            <span className="ml-4 mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">{votes[option] || 0}</span>
            </div>
        ))}
        {voted && <p className="text-gray-500 mt-[20px]">Thank you for voting!</p>}
    </div>
);
}

export default VotingOptions;
