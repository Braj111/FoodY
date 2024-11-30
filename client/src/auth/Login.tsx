import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema} from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    //defined two varibles with types --> imported from zod
    // type LoginInputState = {
    //     email: string;
    //     password: string;
    // }
    const navigate= useNavigate();
    const [input, setInput]= useState<LoginInputState>({
        email:"",
        password:"", 
    });
    //state variable for form validation errors
    const [errors, setErrors]= useState<Partial<LoginInputState>>({});
    const {loading, login}= useUserStore();

    const changeEventHandler = (e:ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setInput({...input, [name]:value});
    }
    const loginSubmitHandler = async (e:FormEvent) =>{
        e.preventDefault(); 
        //form validation
        const result= userLoginSchema.safeParse(input);
        if(!result.success){
            const fieldErrors= result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        try {
            await login(input);
            navigate("/");
        } catch (error) {
            // console.log(error);
        }
        
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-300 mx-4 dark:text-black">
                <div className="mb-9">
                    <h1 className="font-bold text-2xl dark:text-black">FoodY</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input name="email" type="email" placeholder="Email" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.email} onChange={changeEventHandler}/>
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.email}</span>}
                    </div>
                </div>
                <div className="mb-4 pb-10">
                    <div className="relative">
                        <Input name="password" type="password" placeholder="Password" className="pl-10 focus-visible:ring-1 dark:border-gray-300 dark:bg-white" 
                        value={input.password} onChange={changeEventHandler}/>
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.password}</span>}
                    </div>
                </div>

                <div className="mb-4 ">
                    {
                        loading ? (<Button disabled className="bg-orange hover:bg-hoverOrange w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait 
                            </Button>
                        ) : (
                            <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full"> 
                            Login 
                            </Button>
                        )
                    }
                    <div className="mt-4 ">
                        <Link to={"/forgot-password"} className="hover:text-blue-600 hover:underline text-sm text-blue-500">Forgot Password</Link>
                    </div>
                </div>
                <Separator/>
                <p className="mt-2 dark:text-black">
                    Don't have an account?{" "}
                    <Link to="/signup" className="hover:text-blue-600 hover:underline text-sm text-blue-500 ">Signup</Link>
                </p>
            </form>
        </div>
    );
};
export default Login;