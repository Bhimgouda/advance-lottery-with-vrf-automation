import React, { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractData from '../constants';
import { useEffect } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";



const { abi, contractAddresses } = contractData;

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex);
    const contractAddress = contractAddresses[chainId]
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")


    const dispatch = useNotification()

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "getEntranceFee",
        params: {}
    })

    const { runContractFunction: enterLottery } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "getNumberOfPlayers"
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "getRecentWinner"
    })

    useEffect(() => {
        if (isWeb3Enabled && contractAddress) {
            updateContractInfo()
        }
        else if (isWeb3Enabled) {
            setEntranceFee("0")
        }
    }, [isWeb3Enabled, contractAddress])

    async function updateContractInfo() {
        const theEntranceFee = (await getEntranceFee()).toString()
        setEntranceFee(theEntranceFee)

        const theRecentWinner = (await getRecentWinner())
        setRecentWinner(theRecentWinner)

        const theNumberOfPlayers = (await getNumberOfPlayers()).toString()
        setNumberOfPlayers(theNumberOfPlayers)
    }

    const handleEnterLottery = async () => {
        const res = await enterLottery({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error)
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx)
        updateContractInfo()
    }

    const handleNewNotification = (tx) => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <>
            <button onClick={handleEnterLottery}>Enter Lottery</button>
            < p > {ethers.utils.formatEther(entranceFee)} ETH</p >
            < p > {numberOfPlayers}</p >
            < p > {recentWinner}</p >
        </>
    )
}

export default LotteryEntrance