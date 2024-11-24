import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";

import { abi, contractAddress } from "@/constants";

export default function LotteryEntrance() {
    // Gives the hex value of the chain id
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

    const dispatch = useNotification();
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    // The runContractFunction can both send transactions and read state
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {}
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUIValues () {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled])

    const handleNewNotification = async function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell"
        });
    }
    
    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1);
            updateUIValues();
            handleNewNotification();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {raffleAddress ? (
                <>
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                // Checks if the tx was sent to metamask successfully
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            });
                        }}
                    >Enter Raffle</button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </>
            ) : (
                <div>No Raffle address detected</div>
            )}
        </div>
    );
}