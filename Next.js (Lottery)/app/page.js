"use client";

import { MoralisProvider } from "react-moralis";
// import ManualHeader from "@/components/ManualHeader";
import Header from "@/components/Header";

export default function Home() {
    return (
        <div>
            <MoralisProvider initializeOnMount={false}>
                {/* <ManualHeader /> */}
                <Header />
            </MoralisProvider>
        </div>
    );
}