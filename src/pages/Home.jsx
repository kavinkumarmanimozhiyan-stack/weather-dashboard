import { Input } from "@/components/ui/input"
import { getWeatherByCityName, searchCity } from "@/services/weather";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDispatch } from "react-redux";
import { Addcity } from "@/slices/cityslice";
import { useSelector } from 'react-redux';
import { Icon } from "lucide-react";
import { Deletecity } from "@/slices/cityslice";
import { changeTheme } from "@/slices/themeslice";
import { Heart } from 'lucide-react';
import { Cloudy } from 'lucide-react';

function Home() {
    const dispatch = useDispatch();
    const selectcity = useSelector(state => state?.cityname?.city)
    const thememode = useSelector(state => state?.theme?.theme?.mode)
    const [cityName, setcityName] = useState("");
    const [searchcityy, setsearchcityy] = useState([]);
    const [theme, settheme] = useState(thememode);
    

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    async function searchcity(e) {
        const value1 = e.target.value;
        //console.log("value1", value1)
        setcityName(value1)
        if (value1.length < 3) {
            setsearchcityy([]);
            return;
        }
        const data = await searchCity(value1);
        //console.log(data?.results)
        setsearchcityy(data?.results);
    }

    const searchcitybutton = async () => {
        const data = await getWeatherByCityName(cityName);
        console.log(data)
        dispatch(Addcity(data));
        setcityName('')
        setsearchcityy([])
    };

    function deleteCity(indextodelete) {
        dispatch(Deletecity(indextodelete));
    }

    function cityinput({ city }) {
        setcityName(city?.name);
        setsearchcityy([])
    }

    function toggletheme() {
        const newtheme = theme === "light" ? "dark" : "light"
        settheme(newtheme)
        dispatch(changeTheme(newtheme));
    }

    function weatherCondition(condition) {
        //console.log(condition)
        const conditions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            95: "Thunderstorm",
        }
        return conditions[condition] || "";
    }

    function weatherIcon(condition) {
        if (condition === 0) return "☀️";
        if ([1, 2].includes(condition)) return "🌤️";
        if (condition === 3) return "☁️";
        if ([45, 48].includes(condition)) return "🌫️";
        if ([51, 53, 55].includes(condition)) return "🌦️";
        if ([61, 63, 65].includes(condition)) return "🌧️";
        if ([71, 73, 75].includes(condition)) return "🌨️";
        if ([95, 96, 99].includes(condition)) return "⛈️";

        return "";
    }

    return (
        <div className="mt-0 min-h-screen bg-sky-100 dark:bg-black">
            <div className="text-right sticky top-0">
                <Button onClick={toggletheme}>{theme === "light" ? "Dark" : "Light"}Theme</Button>
            </div>
            <div>
                <h1 className="text-5xl font-bold text-blue-500 text-center pt-10">Weather Dashboard</h1>
                <p className="text-sm font-semibold text-center mt-5">Get real time weather updates for multiple cities worldwide</p>
            </div>
            <div className="flex justify-center ">
                <div>
                    <Input placeholder="Type atlest 3 characters to see the city suggestions" className=" w-60 font-semibold mt-10 md: w-100  mt-10 " value={cityName} onChange={(e) => searchcity(e)} />
                    <ul className=" w-100 bg-white border rounded shadow ">
                        {searchcityy?.map((city, index) => (
                            <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer dark:text-black" onClick={() => cityinput({ city })}>{city?.name}</li>
                        ))}
                    </ul>
                </div>
                <Button className=" ml-5  mt-10  " onClick={searchcitybutton}>Search</Button>
            </div >
            <div className=" flex flex-wrap gap-8 justify-center px-5  py-10 ">
                {selectcity && selectcity?.map((city, index) => (
                    <Card key={index} className="max-w-xs shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-bold">{city?.city}</CardTitle>
                            <CardDescription>
                                {city?.country}
                            </CardDescription>
                            <CardDescription>
                                Updated:{city?.lastUpdated}
                            </CardDescription>
                            <CardAction>
                                <p className="font-bold text-4xl">{weatherIcon(city?.condition)}</p>
                                {/* <Cloudy className="text-sky-600 " /> */}
                                {/* <img src="" alt="logo"></img> */}
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="flex direction-row gap-4 mb-5">
                                <h1 className="text-4xl font-bold text-violet-500">{city?.temperature}</h1>
                                <p className="inline border-1 px-1 text-center pt-2 bg-violet-100 text-sm font-semibold w-auto  rounded-sm dark:text-black" > {weatherCondition(city?.condition)}</p>
                                <Button onClick={() => deleteCity(index)}>delete</Button>
                            </div>
                            <hr></hr>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <div className="flex flex-direction-row gap-2">
                                <div className="border-1 rounded-lg py-2 px-2 w-35 bg-blue-100">
                                    <h1 className="font-bold text-sm text-blue-500">Humidity</h1>
                                    <h1 className="font-bold text-start text-xl dark:text-black ">{city?.humidity}</h1>
                                </div>
                                <div className="border-1 rounded-lg py-2 px-2 w-35 bg-violet-100">
                                    <h2 className="font-bold text-sm text-violet-500">Wind Speed</h2>
                                    <h1 className="font-bold text-start text-xl dark:text-black">{city?.windSpeed}<span className="text-sm">km/h</span></h1>
                                </div>
                            </div>
                            {/* <div className="flex  flex-col justify-end">
                                <Heart className="text-red-400 "/>
                               </div> */}
                        </CardFooter>
                    </Card>
                ))
                }
            </div>
        </div>
    )
}
export default Home;