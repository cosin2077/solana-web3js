# 写入链上数据：`send` 发送交易

本部分将带你使用几种常用的发送交易方法，功能上都大同小异，分别是 `sendAndConfirmTransaction`, `sendRawTransaction` 和 `sendEncodedTransaction`。

## 1. sendAndConfirmTransaction

发送交易并等待其确认，带有自动确认机制。适用于希望简化交易确认的场景。

```ts
const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet], { 
        skipPreflight: false 
    });
console.log(`交易已发送: https://solscan.io/tx/${signature}`);
```

通过 `npx esrun 06-send/index.ts` 运行后，可查看模拟交易的结果和交易是否发送成功。

```
模拟交易结果:  {
  context: { apiVersion: '2.0.3', slot: 300771879 },
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
交易已发送: https://solscan.io/tx/4W4QvBfAzezyxatAbE53awibDytLkZmcagnBihz8QSaqhMTJFN5AoQjfxggm7PGQgYmTvTHWhmDSsi4JEn4wCFwX
```

## 2. sendRawTransaction

发送已签名和序列化的交易。

```ts

const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = fromWallet.publicKey;
transaction.sign(fromWallet);
const rawTransaction = transaction.serialize();

const signature = await connection.sendRawTransaction(rawTransaction, { 
    skipPreflight: false 
})
console.log("交易签名：", signature)
```

```
交易签名：3CuP3PpSMMknoB88kWEzAC6dxTAYx1x5oo9KjFSzaCydZRcSdpogBdLLJbKEVHp8nmPfyxB3UhUQtnM6YNFNsA6A
```

## 3. sendEncodedTransaction

发送经过 base64 编码的交易数据，具有更好的兼容性。

```ts
const base64Transaction = rawTransaction.toString('base64');
const signature = await connection.sendEncodedTransaction(base64Transaction, { 
    skipPreflight: false 
});
console.log("交易签名：", signature)
```

```
交易签名： 4NnavZedvvx5s7KTYnuVcvbZiV4dsUDUswJBe11E7FV2txcCYM8ypjbDmvHzWFvqKf9t3RZLkEo7Ek2HxoDyCcV8
```

> 注意：若将skipPreflight设置为true，代表你将跳过交易发送前的模拟过程，这会加快提交速度，但也可能导致交易失败，丢失交易费用。