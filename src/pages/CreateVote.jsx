import React, { useState ,useRef} from 'react'
import {useStateContext } from '../context';
import { CustomButton, FormField, Loader ,Snackbar } from '../components';
//import { checkIfImage } from '../utils';


const SnackbarType = {
  success: "success",
  fail: "fail",
};

const CreateVote = () => {
  const snackbarRef = useRef(null);
  const fileInputRef = useRef(null);

  const [message, setmessage] = useState();
  const [cond, setcond] = useState();
  const {setCandidates , setVotingTime ,setTitle } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    starttime: '',
    deadline: '',
  });


  const [condidates, setcondidates] = useState([])

  const [name, setname] = useState('') ;
  const [address, setaddress] = useState('') ;
  const [image, setimage] = useState(null) ;
  const [desc, setdesc] = useState('') ;


const [req, setreq] = useState(true);


  // Condidates
  const handleAddCondidate = () => {
    const newCandidate = {
      name,
      address,
      image: image,
      desc
    };
    setcondidates([...condidates, newCandidate]);
    setname('');
    setaddress('');
    setimage(null);
    setdesc('');
    setreq(false);
 // Reset file input value
 if (fileInputRef.current) {
  fileInputRef.current.value = '';
}
  }
  
  const handleDeleteCondidat = (index) => {
    const newCondidates = [...condidates];
    newCondidates.splice(index, 1);
    setcondidates(newCondidates);
    if(index===1){
      setreq(true);
    }
  }
  


  // Form 
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await setVotingTime(Date.parse(form.deadline) / 1000 , Date.parse(form.starttime) / 1000);
      await setCandidates(condidates);
      await setTitle(form.title);
      setmessage("Ballot Created Successfully!")
      setcond(SnackbarType.success);
    } catch (error) {
      setmessage("Something went wrong!");
      setcond(SnackbarType.fail);
    }
  
    setIsLoading(false);
    snackbarRef.current.show();
  };
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
    <Snackbar
        ref={snackbarRef}
        message={message}
        type={cond}
      />
    {isLoading && <Loader />}
    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
      <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Ballot</h1>
    </div>
    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
      <div className="flex flex-wrap gap-[40px]">
        <FormField 
          labelName="Ballot Title *"
          placeholder=""
          inputType="text"
          value={form.title}
          handleChange={(e) => handleFormFieldChange('title', e)}
          isRequired={true}
        />
      </div>
      <div className="flex flex-wrap gap-[40px]">
      <FormField 
          labelName="Condidate name *"
          value={name}
          placeholder="Enter a condidate name"
          inputType="text"
          handleChange={(e) => setname(e.target.value)}
          isRequired={req}
      />
      <FormField 
          labelName="Condidate addresse *"
          value={address}
          placeholder="Enter a condidate address"
          inputType="text"
          handleChange={(e) => setaddress(e.target.value)}
          isRequired={req}
        />
      </div>
      <div className="flex flex-col w-full ">

      <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Candidate image *</span>
            <input 
            type="file"
            ref={fileInputRef}
            required ={req}
            onChange={(e) => setimage(e.target.files[0])}
            step="0.1"
            placeholder="Place image"
            className="relative m-0 block w-full min-w-0 flex-auto  rounded-[10px] outline-none border-[1px] border-[#3a3a43] bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-[#adadad] file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
            />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG (MAX. 400x300px).</p>

      </div>
      <div className="flex flex-wrap gap-[40px]">
      <FormField 
          isTextArea
          placeholder="Goals and Ambitions..."
          inputType="text"
          value={desc}
          handleChange={(e) => setdesc(e.target.value)}
          isRequired={req}
        />
      </div>
      <div className="flex justify-center items-end ">
      <CustomButton
              btnType="button"
              handleClick={handleAddCondidate}
              title="Add condidate"
      />
      </div>
      <div className="flex flex-wrap gap-[40px] z-2">
          {condidates.length > 0 &&
            condidates.map((cnd, index) => (
              <div className='flex font-epilogue font-normal text-[16px] text-[#808191] bg-[#28282e] px-3 py-2  rouned-b-[10px] text-center rounded-[10px]'>
              <p key={index} >
                {cnd.name}
              </p>
              <button 
              type="button"
              className="ml-[10px] text-[#eee] "
              onClick={()=>handleDeleteCondidat(index)}
              >x</button>
              </div>
            ))}
      </div>
      <div className="flex flex-wrap gap-[40px]">
        <FormField 
          labelName="Start Date *"
          placeholder="Start Date"
          inputType="date"
          value={form.starttime}
          handleChange={(e) => handleFormFieldChange('starttime', e)}
          isRequired={true}
        />
      </div>
      <div className="flex flex-wrap gap-[40px]">
        <FormField 
          labelName="End Date *"
          placeholder="End Date"
          inputType="date"
          value={form.deadline}
          handleChange={(e) => handleFormFieldChange('deadline', e)}
          isRequired={true}
        />
      </div>
        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Submit new Vote"
            styles="bg-[#1dc071]"
          />
        </div>
    </form>
  </div>
  )
}

export default CreateVote