import { Contract, JsonRpcProvider, Wallet } from "ethers"

const CONTRACT_ADDRESS = process.env.AVALANCHE_CONTRACT_ADDRESS as string
const PRIVATE_KEY = process.env.AVALANCHE_PRIVATE_KEY as string
const RPC_URL = process.env.AVALANCHE_RPC_URL as string

// Minimal ABI expected by this app. Your contract should expose these functions.
const ABI = [
  // register a user id on-chain
  "function registerUser(string uid) public returns (bool)",
  // check if a user id is registered
  "function isUserRegistered(string uid) public view returns (bool)",
]

function getContract(): Contract {
  if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    throw new Error(
      "Missing Avalanche env. Please set AVALANCHE_CONTRACT_ADDRESS, AVALANCHE_PRIVATE_KEY, AVALANCHE_RPC_URL"
    )
  }
  const provider = new JsonRpcProvider(RPC_URL)
  const wallet = new Wallet(PRIVATE_KEY, provider)
  return new Contract(CONTRACT_ADDRESS, ABI, wallet)
}

export async function verifyUserOnChain(uid: string): Promise<boolean> {
  const contract = getContract()
  return await contract.isUserRegistered(uid)
}

export async function registerUserOnChain(uid: string): Promise<{ txHash: string }> {
  const contract = getContract()
  const tx = await contract.registerUser(uid)
  const receipt = await tx.wait()
  return { txHash: receipt?.hash || tx.hash }
}
