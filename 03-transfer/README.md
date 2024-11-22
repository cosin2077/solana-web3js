# 发送第一笔转账交易

> 发送交易是改变链上状态的唯一方式。

本部分将介绍如何创建并发送自己的第一笔转账交易。

## 创建RPC连接和导入钱包

首先，结合我们之前学到的，需要先创建一个RPC连接和导入我们的钱包私钥。

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import fs from "fs";

// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// 本地导入钱包
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);
```

## 创建、模拟和发送转账交易

接下来，我们将创建一条交易，并在其中添加一条向 `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` 的转账指令。之后，可以先模拟交易是否会成功。若模拟成功，则会真正的发送此笔交易。

> 注意：
> `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` 为Buff社区公共资金账户，可以换成任何其他的账户。

```ts
async function main() {

    // 创建交易
    const transaction = new Transaction();

    // 目标地址
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // 添加转账指令
    const instruction = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction);
    
    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送, https://solscan.io/tx/${signature}`);
}

main();
```

通过 `npx esrun 03-transfer/index.ts` 运行脚本后，输出应如下：

```bash
模拟交易结果:  {
  context: { apiVersion: '2.0.3', slot: 300547622 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 150
  }
}
交易已发送: https://solscan.io/tx/3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC
```

通过以上这条交易，我们成功的给 `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` 转了1000个lamports，可以通过区块链浏览器[查看这笔交易](https://solscan.io/tx/3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC)。