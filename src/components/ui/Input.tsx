import { forwardRef } from "react";

interface InputProps {
    type: string;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ type, placeholder, onChange }, ref) => {
        return (
            <div className="bg-slate-800 py-3 md:px-10 w-full max-w-md mx-auto text-center border-2 border-blue-500 rounded-xl">
                <input
                    ref={ref}
                    className="w-full px-3 text-center placeholder-text bg-slate-800 text-white outline-none"
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        );
    }
);

Input.displayName = "Input";