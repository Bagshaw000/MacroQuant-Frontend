"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import type {} from '@redux-devtools/extension'

interface CotState {
  data: Object;
  loading: boolean;
  fetchCot: () => Promise<void>;
  error: string | null;
}

export const useCotState = create<CotState>((set) => ({
  data: {},
  error: null,
  loading:true,
  fetchCot: async () => {
    try {
      const response = await fetch("/util", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          // 'Authorization': 'Bearer YOUR_TOKEN',
        },
        mode: "cors",
        credentials: "include",
        redirect:"error"
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({ 
        data: data, 
        loading: false,
        error: null 
      });
      
      // set({ data:dat });
      // console.log("Response:", data);
    } catch (error) {
      console.error("Detailed error:", error);
      // console.error("Error name:", error.);
      // console.error("Error message:", error.message);
      // console.error("Error cause:", error.cause);
    }
  },
}));
