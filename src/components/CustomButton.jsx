import React from 'react'

const CustomButton = ({id , btnType, title, handleClick, styles ,disabled  }) => {
return (
    <button
        id = {id}
        type={btnType}
        className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
        onClick={handleClick}
        disabled={disabled}
    >
        {title}
    </button>
)
}

export default CustomButton