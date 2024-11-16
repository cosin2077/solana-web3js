import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    // 查询Jito1的SOL余额
    const publicKey = new PublicKey('CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1');
    const balance = await connection.getBalance(publicKey);
    console.log(`Jito1余额: ${balance / LAMPORTS_PER_SOL} SOL`); // 转换为 SOL 单位
}

main();