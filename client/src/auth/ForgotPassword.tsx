import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail]=useState<string>("");
    const loading=false;
  
    return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <form className="flex flex-col gap-5 md:p-8 w-full max-w-md md:border border-gray-300 rounded-lg mx-4">
            <div className="text-center">
                <h1 className="font-extrabold text-2xl mb-2 dark:text-black">Forgot Password</h1>
                <p className="text-sm text-gray-600 ">Enter your Email to receive Verification Code</p>
            </div>
            <div className="relative w-full">
                <Input type="text" value={email} onChange={(e)=> setEmail(e.target.value)}
                placeholder="Enter Your email" className="pl-10 dark:border-gray-300 dark:bg-white"/>
                <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none"/>
            </div>
            {
                loading ? (
                    <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</Button>
                ):(
                    <Button className="bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
                )
            }
            <span className="text-center dark:text-black">
                Back to {" "}
                <Link to={"/login"} className="hover:text-blue-600 hover:underline text-xm text-blue-500 ">Login</Link>
            </span>
        </form>
        
    </div>
  )
}
export default ForgotPassword;