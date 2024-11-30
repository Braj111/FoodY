
//Generates default 6 digit Code, which will be send to the user email for verification purposes

export const generateVerificationCode = (length = 6): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = ''; 
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return verificationCode;
}; 

