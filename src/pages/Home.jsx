import React, { useState, useEffect } from 'react'
import { DisplayVotes } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  var [Candidates, setCandidates] = useState([]);
  const [title, settitle] = useState();
  const { address, contract, getAllCandidates ,searchQuery , getTitle} = useStateContext();

  const fetchCandidates = async () => {
    setIsLoading(true);
    const data = await getAllCandidates();
    const updatedData = data.map((item) => {
    return { ...item, numberOfVotes: parseInt(item.numberOfVotes._hex) 
    ,id: parseInt(item.id._hex)};
});
    setCandidates(updatedData);
    const titl = await getTitle();
    settitle(titl);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCandidates();
  }, [address, contract]);



  if (Candidates && Candidates.length > 0) {
    const totalVotes = Candidates.reduce((sum, candidate) => sum + candidate.numberOfVotes, 0);
  
    const rankedCandidates = Candidates.sort((a, b) => b.numberOfVotes - a.numberOfVotes);
  
    let currentRank = 1;
    let previousVotes = rankedCandidates[0].numberOfVotes;
  
    rankedCandidates.forEach((candidate) => {
      if (candidate.numberOfVotes < previousVotes) {
        currentRank++;
        previousVotes = candidate.numberOfVotes;
      }
  
      candidate.rank = currentRank;
      candidate.percentage = ((candidate.numberOfVotes / totalVotes) * 100).toFixed(2);
    });
  }
  
  

  Candidates = Candidates.filter((cnd)=> cnd.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <DisplayVotes 
      title={title}
      isLoading={isLoading}
      condidates={Candidates} 
    />
  )
  

}

export default Home