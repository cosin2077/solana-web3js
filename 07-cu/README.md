# 添加优先费

优先费是在交易的基础费用（5000 Lamports）基础上额外支付的费用。通过为交易添加优先费，可以在区块空间有限的情况下，提高交易被处理的优先级。

Solana上计算交易费用的最小组成部分为 `计算单元（Compute Units, CU）`，其用于衡量交易的计算资源占用。

优先费用的计算方法为 `CU数量*每CU的价格`，此处价格单位为 `microLamports`。

> 1 Lamports = 10^6 microLamports

因此，交易的优先费应分为两部分，分别是 `CU数量` 和 `CU价格`。通过Compute Budget程序指令，可以自定义我们交易的优先费用。

## Compute Budget程序指令

本部分将讲解设置优先费用的两个方法，分别是 `setComputeUnitPrice` 和 `setComputeUnitLimit`。

同样，先创建RPC连接并导入我们的钱包：

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import fs from "fs";

// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

### setComputeUnitPrice

默认情况下，交易CU数量分配为 `200000*指令数量`。

> 注意若只设置setComputeUnitPrice，此setComputeUnitPrice指令不会被计算在此处的指令数量内。

通过setComputeUnitPrice设置每CU的价格为5 microLamports，可以看到[这条仅包含1个转账指令的交易](https://solscan.io/tx/34eohoyTp2oZ1jtFNtcEUp9oe2QfRf5HRarexCbKnUm93ga3sGjP8Aduwd8xcbRrZk9HNdRJ9rqWZ8peGhruPfuK)优先费用为0.000000001 SOL，即 `200000*1*5 = 1 Lamports`。

```ts
async function main() {

    // 创建交易
    const transaction = new Transaction();

    // CU价格
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5
    });
    transaction.add(computeUnitPriceInstruction);

    // 目标地址
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // 添加转账指令
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();
```

通过 `npx esrun 07-cu/index.ts `运行，输出应如下：

```
模拟交易结果:  {
  context: { apiVersion: '2.0.3', slot: 301579053 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 300
  }
}
交易已发送: https://solscan.io/tx/34eohoyTp2oZ1jtFNtcEUp9oe2QfRf5HRarexCbKnUm93ga3sGjP8Aduwd8xcbRrZk9HNdRJ9rqWZ8peGhruPfuK
```

以下为其他的几个交易例子：

- 每CU的价格为1 microLamports，1条转账指令。因不足1 Lamports，被按照1 Lamports处理：[优先费为1 Lamports](https://solscan.io/tx/5WxZ9uST4Raz3fyCJyodLcx3Ruyy2JYPvJa7kD28ehn9VquPkV6jm6pzAGFGt8c1fYF7yhFpptTTJCX6PYsJr8i9)
- 每CU的价格为25 microLamports，1条转账指令：[优先费为5 Lamports](https://solscan.io/tx/EWgoUVMGLNEzAoGiY79NWzhzFHFk8bw5ivGXBE82afsCL5E3o71jvVQKFPS3f1NvggdMQGc6naWHLphFS2oqaYX)
- 每CU的价格为5 microLamports，2条转账指令：[优先费为2 Lamports](https://solscan.io/tx/4SbD6b1aFG4fXErzFcGzx6xr3RXFVB66Xm2yXwe2PP4qsmzRQKfzeibeJuWPtrEccnsky2MW9wm3UtjrRfJL1YsE)

### setComputeUnitLimit

实际上，简单转账指令的计算资源消耗仅为150个CU，而默认的每条指令CU的数量为200000，这往往会导致优先费用的额外支出。

因此，可以通过 `setComputeUnitLimit` 来为我们的交易确定CU上限。

> 每条交易的计算预算CU数量最大上限为 `1400000`。

因优先费不足1 Lamports会被按照1 Lamports处理，此处为了推算，取CU上限为500（实际3条指令花费为450）。若取CU价格为4000 microLamports，优先费应为2 Lamports，[此处可查看这条交易](https://solscan.io/tx/41APCjw2ifHkqV3Ha7S7Q1LADb9S396acsCqErdk6Tp3xcCMLge1FueRnj4dfTSbhgeA9DBvfPNRJxoZuYEqCQUS)。

```ts
async function main() {

    // 创建交易
    const transaction = new Transaction();

    // CU价格
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 4000
    });
    transaction.add(computeUnitPriceInstruction);

    // CU数量
    const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 500,
    });
    transaction.add(computeUnitLimitInstruction);

    // 目标地址
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // 添加转账指令
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();
```

再次运行，输出应如下：

```
模拟交易结果:  {
  context: { apiVersion: '2.0.3', slot: 301580071 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 450
  }
}
交易已发送: https://solscan.io/tx/41APCjw2ifHkqV3Ha7S7Q1LADb9S396acsCqErdk6Tp3xcCMLge1FueRnj4dfTSbhgeA9DBvfPNRJxoZuYEqCQUS
```

---

## 总结

通过 `setComputeUnitPrice` 和 `setComputeUnitLimit` 指令，可以帮助我们在实际应用中灵活的定义自己的优先费。一般情况下，需要对自己的交易CU数量占用有所预估，固定此值，来灵活的调整CU价格参数，以保证自己的交易优先费随网络优先费水平动态的变化。