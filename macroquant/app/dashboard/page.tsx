"use client"
import COT from "@/component/cot";
import Instrument from "@/component/instrument";
import Globe from "react-globe.gl";
import { useCotState } from "../util/state";
import { useEffect } from "react";
export default function Dashboard() {
  // const myGlobe = new ThreeGlobe()
  // .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
  // .pointsData(myData)

  return (
    <div className="">
      {/* <Instrument /> */}
      <COT />
    </div>
  );
}
