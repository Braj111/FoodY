import { useState } from "react"
import { Input } from "./ui/input"
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HeroImage from "@/assets/hero_pizza.avif";
import Hero_Image from "@/assets/hero_pizza.webp";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/store/useThemeStore";


const HeroSection = () => {
    const [searchText, setSearchText] = useState<string>("");
    const navigate = useNavigate();
    const theme= useThemeStore();
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w-[40%]">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">Fresh, fast, and flavorful—order your meal now! </h1>
                    <p className="text-gray-500">From comfort food to gourmet meals, ordering your favorite dishes has never been so easier 😍 !!</p>
                </div>
                <div className="relative flex items-center gap-2">
                    <Input type="text" value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="pl-10 shadow-lg"
                        placeholder="Search Restaurant by Name, City or Country" />
                    <Search className="text-gray-500 absolute inset-y-2 left-2" />
                    <Button onClick={() => navigate(`/search/${searchText}`)} className="bg-orange hover:bg-hoverOrange">Search</Button>
                </div>
            </div>
            <div>
                {
                    theme.theme==='dark' ? (<img src={HeroImage} alt=""
                    className="object-cover w-full max-h-[500px] "/>) : 
                    (<img src={Hero_Image} alt=""
                        className="object-cover w-full max-h-[500px] "/>)
                }
                
            </div>
        </div>
    )
}

export default HeroSection