import {z} from "zod";

export const userSignupSchema= z.object({
    fullname: z.string().min(1,"Fullname is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    contact: z.string().min(10, "Contact must be atleast 10 digits"),
});

export type SignupInputState=z.infer<typeof userSignupSchema>;


export const userLoginSchema= z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Invalid Password"),
});

export type LoginInputState=z.infer<typeof userLoginSchema>;
