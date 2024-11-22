"use client";

import { MoralisProvider } from "react-moralis";
import ManualHeader from "@/components/ManualHeader";

export default function Home() {
    return (
        <div>
            <MoralisProvider initializeOnMount={false}>
                <ManualHeader />
            </MoralisProvider>
        </div>
    );
}