import React, { useState , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {useStateContext } from '../context';
import { CustomButton, FormField, Loader ,Snackbar} from '../components';

const SnackbarType = {
  success: "success",
  fail: "fail",
};

const RegisterVoters = () => {
  const snackbarRef = useRef(null);
  const [message, setmessage] = useState();
  const [cond, setcond] = useState();
  const {setVoters , address} = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    address: '',
  });

  // Form 
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
        try{
        setIsLoading(true)
        await setVoters();
        setmessage("Voter Added Successfully!");
        setcond(SnackbarType.success);
        }catch(e){
          setmessage("Something went wrong!");
          setcond(SnackbarType.fail);
        };
        setIsLoading(false);
        snackbarRef.current.show();
  }
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
    <Snackbar
        ref={snackbarRef}
        message={message}
        type={cond}
      />
    {isLoading && <Loader />}
    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
      <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Be a Voter</h1>
    </div>
    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
      <div className="flex flex-wrap gap-[40px]">
      <FormField 
          labelName="addresse *"
          value={address}
          placeholder="Enter voter address"
          inputType="text"
          handleChange={()=>{}}
        />
      </div>
        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="submit new voter"
            styles="bg-[#1dc071]"
          />
        </div>
    </form>
  </div>
  )
}

export default RegisterVoters
