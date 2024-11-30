import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { loading, verifyEmail } = useUserStore();

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    //A hook to store refs of input fields, this will be populated with references to each input field as they are rendered.
    const inputRef = useRef<any>([]);

    const handleChange = (index: number, value: string) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
        //Moving to new field if current digit is filled
        //ref assigns the DOM references inside the input field to the inputRef array, 
        //now when page re-renders the focus is shifted with reference to the inputref current object reference
        //and since inputref is persistant the value is preserved across re-renders
        if (value !== "" && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }


    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const verificationCode = otp.join("");
        try {
            await verifyEmail(verificationCode);
            navigate("/");
        } catch (error) { 
            // console.log(error);
        }

    }

    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-300">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl dark:text-black">Verify Your Email</h1>
                    <p className="text-sm text-gray-600">Enter the 6 digit code sent to your email address</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="flex justify-between">
                        {
                            otp.map((letter: string, idx: number) => (
                                <Input type="text" key={idx} value={letter}
                                    ref={(element) => (inputRef.current[idx] = element)}
                                    maxLength={1}
                                    className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl dark:border-gray-300 dark:bg-white 
                            font-normal md:font-bold rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-indigo-500 border-gray-300"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)} />
                            ))
                        }
                    </div>
                    {
                        loading ? (<Button disabled className="bg-orange hover:bg-hoverOrange mt-6 w-full">
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Verify</Button>
                        ) : (<Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">Verify</Button>)
                    }

                </form>
            </div>
        </div>
    )
}
export default VerifyEmail;