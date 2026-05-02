"use client"

import Header from "@/component/header";
import Globe from "react-globe.gl"
export default function DashboardLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {

     const myData = [
    { lat: 40.7128, lng: -74.0060, name: "New York", size: 0.5, color: "red" },
    { lat: 51.5074, lng: -0.1278, name: "London", size: 0.5, color: "blue" },
    { lat: 35.6895, lng: 139.6917, name: "Tokyo", size: 0.5, color: "green" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney", size: 0.5, color: "yellow" },
  ];
    return <div >
        <Header />
        {/* <Globe pointsData={myData}  globeImageUrl="https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg">
          z-100 top-5 absolute"
        </Globe> */}
        <div className="px-5 py-5 font-mono">{children}</div>  
    </div>
}