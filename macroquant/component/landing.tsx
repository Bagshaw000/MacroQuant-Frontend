"use client"
import LightRays from "@/components/LightRays";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Landing() {
  return (
    <div className="w-screen h-full">
      <div style={{ width: "100%", height: "100%", position: "relative" }} className="z-0!  display: grid;
  place-items: center;"> 
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={5}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.6}
          distortion={0.5}
          className="custom-rays"
          pulsating={false}
          fadeDistance={2}
          saturation={2}
        />

        <div className="z-100 absolute md:top-50 md:left-50 md:bottom-50 md:right-50 text-center font-sans font-medium text-2xl md:text-4xl">
            <h1>The Macro Economy, Simplified</h1>
            <h1 className="font-normal text-sm md:text-2xl"> for</h1>
            <h1>Traders, Investors and Enthusiast</h1>
            <div className="mt-10 w-60 mx-auto">
                <h1 className=" text-sm md:text-xl font-mono font-medium">
                    Join the waitlist
                </h1>
                <Input placeholder="Enter your email"  className="border-[0.5px]! px-2 py-2 text-xs!"/>
                <Button className="bg-white! text-black! w-full!">Join</Button>
            </div>
        </div>
      </div>
      
    </div>
  );
}
