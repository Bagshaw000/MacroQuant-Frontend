"use client";
import Landing from "@/component/landing";
import Image from "next/image";
import { useCotState } from "./util/state";
import { useEffect } from "react";

export default function Home() {
  // const { fetchCot} = useCotState();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await fetchCot().then(() => {
  //         console.log(data);
  //       });
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await fetchCot(); // ← Get the returned data
       
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };

  //   fetchData(); 
  // }, [fetchCot]);


  return (
    <div className="">
      <Landing />
    </div>
  );
}
