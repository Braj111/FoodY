import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
    const {user, updateProfile}=useUserStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profileData, setProfileData] = useState({
        fullname:user?.fullname || "",
        email: user?.email || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    });
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || "");
    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result);
                setProfileData((prevData) => ({ ...prevData, profilePicture: result }));
            }
            reader.readAsDataURL(file);
        }
    }
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await updateProfile(profileData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
        
    }
    return (
        <form onSubmit={updateProfileHandler} className="max-w--7xl mx-auto my-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback>BK</AvatarFallback>
                        <input ref={imageRef} type="file" className="hidden" accept="image/*"
                            onChange={fileChangeHandler} />
                        <div className="absolute inset-0 flex items-center 
                            justify-center opacity-0 hover:opacity-100 
                            transition-opacity duration-300 bg-black bg-opacity-50 
                            rounded-full cursor-pointer"
                            onClick={() => imageRef.current?.click()}>
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input type="text" name="fullname" value={profileData.fullname}
                        className="font-bold md:text-2xl text-2xl outline-none border-none focus-visible:ring-transparent"
                        onChange={changeHandler} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-5 gap-3 my-10">
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-gray-800">
                    <Mail className="text-gray-500" />
                    <div className="w-full">
                        <Label className="dark:text-gray-50">Email</Label>
                        <input disabled className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            name="email" value={profileData.email}
                            onChange={changeHandler} />
                    </div>
                </div>



                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-gray-800">
                    <LocateIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label className="dark:text-gray-50">Address</Label>
                        <input className="w-full text-gray-600 dark:text-gray-400 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            name="address" value={profileData.address}
                            onChange={changeHandler} />
                    </div>
                </div>



                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-gray-800">
                    <MapPin className="text-gray-500" />
                    <div className="w-full">
                        <Label className="dark:text-gray-50">City</Label>
                        <input className="w-full text-gray-600 dark:text-gray-400 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            name="city" value={profileData.city}
                            onChange={changeHandler} />
                    </div>
                </div>



                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-gray-800">
                    <MapPinnedIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label className="dark:text-gray-50">Country</Label>
                        <input className="w-full text-gray-600 dark:text-gray-400 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            name="country" value={profileData.country}
                            onChange={changeHandler} />
                    </div>
                </div>

            </div>


            <div className="text-center">
                {isLoading ?
                    <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please Wait</Button> : <Button className="bg-orange hover:bg-hoverOrange">
                        Update</Button>}
            </div>
        </form>
    )
}

export default Profile