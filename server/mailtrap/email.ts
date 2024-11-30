import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    try {
        const res = await client.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:htmlContent.replace("{verificationToken}", verificationToken),
            category:"Email verification"
        })
    } catch (error) {
        // console.log(error);
        throw new Error("Failed to send verification email")
    }
}

export const sendWelcomeEmail = async (email: string, name:string) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await client.send({
            from:sender,
            to:recipient,
            subject:"Welcome to FoodY ",
            html:htmlContent,
            template_variables:{
                company_info_name:"FoodY",
                name:name
            }
        })
    } catch (error) {
        // console.log(error);
        throw new Error("Failed to send Welcome email")
    }
}

export const sendPasswordResetEmail = async (email:string, resetURL:string)=>{
    const recipient = [{ email }];
    const htmlContent= generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password ",
            html:htmlContent,
            category:"Reset Password"
        })
    } catch (error) {
        // console.log(error);
        throw new Error("Failed to send Password Reset email")
    }
}

export const sendResetSuccessEmail = async (email:string)=>{
    const recipient = [{ email }];
    const htmlContent= generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Successfully ",
            html:htmlContent,
            category:"Password Reset"
        })
    } catch (error) {
        // console.log(error);
        throw new Error("Failed to send Password Reset success email")
    }
}