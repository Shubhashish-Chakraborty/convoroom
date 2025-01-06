import { ReactElement } from "react";

const variantStyle = {
    primary : "bg-blue-600 text-white font-bold hover:bg-blue-900",
    secondary: "bg-custom-3 border-2 border-white text-white font-bold",
    other: "bg-red-700 border border-black text-white font-bold"
}


const defaultStyles = "flex items-center px-1 py-1 rounded-md transition-all duration-500 hover:-translate-y-1";

export const Button = ({variant , text , startIcon , endIcon , onClick}: {
    variant: "primary" | "secondary" | "other";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick?: () => void;
}) => {
    return (
        <>
            <button
                onClick={onClick}
                className={`${variantStyle[variant]} ${defaultStyles}`}
            >
                {startIcon && <div className="mr-2">
                    {startIcon}
                </div> }
                {text} 
                
                {endIcon && <div className="ml-1">
                    {endIcon}
                </div>}
            </button>
        </>
    )
}