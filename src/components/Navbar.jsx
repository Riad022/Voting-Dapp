import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

//web 3 context
import { Loader } from '../components';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';
import { ConnectWallet } from '@thirdweb-dev/react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const { connect, address, admin, updateSearchQuery, reset ,contract} = useStateContext();
    //const address = '0xc103940293748729479287492';
    //const connect =()=>{console.log("connecting...")};
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
        updateSearchQuery(event.target.value);
    };

    const handleSearch = (e) => {
        updateSearchQuery(searchText);
    };
    const resetHandler = async () => {
        try {
            setIsLoading(true)
            await reset();
            setIsLoading(false)
            setTimeout(() => {
                navigate('/');
            }, 3000)
        } catch (e) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!address) {
            const connectWalletButton = document.querySelector(".connect-wallet-button");
            if (connectWalletButton) {
                connectWalletButton.click(); // Programmatically trigger the click event
            }
        }
    },[contract]);

    return (
        <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
            {isLoading && <Loader />}
            <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
                <input
                    type="text"
                    placeholder="Search for candidates"
                    className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
                    onChange={handleInputChange}
                />
                <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer" onClick={handleSearch}>
                    <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
                </div>
            </div>

            <div className="sm:flex hidden flex-row justify-end gap-4">

                {address === admin && (
                    <CustomButton
                        btnType="button"
                        title="restart"
                        styles="bg-[#4acd8d] md:min-w-[125px] "
                        handleClick={resetHandler}
                    />
                )}
                <ConnectWallet
                    className="connect-wallet-button"
                    style={{
                        fontFamily: "Epilogue",
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "white",
                        minHeight: "52px",
                        maxHeight: "60px",
                        padding: "4px",
                        borderRadius: "10px",
                        backgroundColor: !address && "#8c6dfd"
                    }}
                />
                <Link to="/">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                        <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
                    </div>
                </Link>
            </div>

            {/* Small screen navigation */}
            <div className="sm:hidden flex justify-between items-center relative">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                    <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
                </div>

                <img
                    src={menu}
                    alt="menu"
                    className="w-[34px] h-[34px] object-contain cursor-pointer"
                    onClick={() => setToggleDrawer((prev) => !prev)}
                />

                <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
                    <ul className="mb-4">
                        {navlinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                                onClick={() => {
                                    setIsActive(link.name);
                                    setToggleDrawer(false);
                                    navigate(link.link);
                                }}
                            >
                                <img
                                    src={link.imgUrl}
                                    alt={link.name}
                                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                                />
                                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                                    {link.name}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex mx-4">
                        <CustomButton
                            btnType="button"
                            title={address ? 'Create a vote' : 'Connect'}
                            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                            handleClick={() => {
                                if (address) navigate('create-vote')
                                else connect();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar