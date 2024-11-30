import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    //define varibles with types --> but imported from Zod
    // type SignupInputState = {
    //     fullname: string,
    //     email: string;
    //     password: string;
    //     contact: string;
    // }
    const navigate= useNavigate();
    const [input, setInput]= useState<SignupInputState>({
        fullname:"",
        email:"",
        password:"", 
        contact:"",
    });
    const changeEventHandler = (e:ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setInput({...input, [name]:value});
    }
    //state variable for form validation
    const [errors, setErrors]= useState<Partial<SignupInputState>>({});
    const {signup, loading} = useUserStore();
    
    const loginSubmitHandler =async (e:FormEvent) =>{
        e.preventDefault(); //to prevent from refreshing
        //form validation
        const result=userSignupSchema.safeParse(input);
        if(!result.success){
            const fieldErrors=result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }
        //Login API
        try {
            await signup(input);
            navigate('/verify-email');
        } catch (error) {
            // console.log(error);
        }
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-300 mx-4">
                <div className="mb-9">
                    <h1 className="font-bold text-2xl dark:text-black">FoodY</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input name="fullname" type="text" placeholder="Full Name" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.fullname} onChange={changeEventHandler}/>
                        <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.fullname}</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input name="email" type="email" placeholder="Email" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.email} onChange={changeEventHandler}/>
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.email}</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input name="password" type="password" placeholder="Password" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.password} onChange={changeEventHandler}/>
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.password}</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input name="contact" type="text" placeholder="Contact" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.contact} onChange={changeEventHandler}/>
                        <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.contact}</span>}
                    </div>
                </div>

                <div className="mb-10">
                    {
                        loading ? (<Button disabled className="bg-orange hover:bg-hoverOrange w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait 
                            </Button>
                        ) : (
                            <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full"> 
                            Signup 
                            </Button>)
                    }
                </div>
                <Separator/>
                <p className="mt-2 dark:text-black">
                        Already have an account?{" "}
                    <Link to="/login" className="hover:text-blue-600 hover:underline text-sm text-blue-500 ">Login</Link>
                </p>
            </form>
        </div>
    );
};
export default Signup;