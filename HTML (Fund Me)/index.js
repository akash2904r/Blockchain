async function connect () {
    if (typeof window.ethereum !== undefined) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
        }
        document.getElementById("connectContainer").innerHTML = "<strong>Connected!</strong>";
        
        const accounts = await ethereum.request({ method: "eth_accounts "});
        console.log(accounts);
    } else {
        document.getElementById("connectContainer").innerHTML = "Please install metamask";
    }
}