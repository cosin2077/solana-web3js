# 读取链上数据（一）：`get` 读取

本部分将带你认识一些常用的读取链上数据的方法以及使用场景。

这些方法属于 `Connecion` 类，为单次的链上数据读取，方法名以 `get` 开头。

在使用这些方法之前还是需要先创建RPC连接。

```ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

## 1. getSlot

获取当前的slot。

```ts
const slot = await connection.getSlot();
console.log(`当前slot: ${slot}\n`);
```

```
当前slot: 300579039
```

## 2. getBalance

获取指定账户的SOL余额。

```ts
// 查询Jito1的SOL余额
const balance = await connection.getBalance(new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1"));
console.log(`J1to1余额: ${balance / LAMPORTS_PER_SOL} SOL\n`);
```

```
J1to1余额: 12.172897148 SOL
```

## 3. getTokenAccountBalance

查询指定代币账户的余额。

> Solana 会为每个代币持有者分配一个代币账户，每个账户需要支付0.002SOL的租金。当你不再需要此代币账户时，可以选择关闭并取回租金。

```ts
// 获取web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2账户的USDC余额
// https://solscan.io/account/HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT
const tokenAccountBalance = await connection.getTokenAccountBalance(new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"));
console.log(`token账户余额: ${JSON.stringify(tokenAccountBalance)}\n`);
```

```
token账户余额: {"context":{"apiVersion":"2.0.3","slot":300580444},"value":{"amount":"2000000","decimals":6,"uiAmount":2,"uiAmountString":"2"}}
```

## 4. getFirstAvailableBlock 

获取当前RPC节点可以访问的最早区块号。

> 因Solana数据量庞大，一般的RPC节点无法完整存储区块数据，只能在本地保存一小部分快照。因此，如果你想分析区块的历史交易，购买大型RPC服务商的节点是个不错的选择。

```ts
const firstAvailableBlock = await connection.getFirstAvailableBlock();
console.log(`首个可用区块: ${firstAvailableBlock}\n`);
```

```
首个可用区块: 300439300
```

## 5. getLatestBlockhash

获取最新的区块hash。

> 在发送交易时经常调用。

```ts
const latestBlockhash = await connection.getLatestBlockhash();
console.log(`最新区块哈希: ${latestBlockhash.blockhash}\n`);
```

```
最新区块哈希: Hik7iYgKiALmPXp8HTAqok3kDQuSYWCaPLNa7rLNeu6v
```

## 6. getParsedAccountInfo

获取已解析的账户详细信息。

> 在获取链上流动池信息时会非常有用。

`getMultipleParsedAccounts` 可以一次性查询多个账户信息。

```ts
// 获取raydium clmm WSOL/USDC 流动池的账户信息
const accountInfo = await connection.getAccountInfo(new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'), "confirmed");
    console.log("账户信息：", accountInfo)
```

```
{
  data: <Buffer f7 ed e3 f5 d7 c3 de 46 fb 81 6e 66 63 0c 3b b7 24 dc 59 e4 9f 6c c4 30 6e 60 3a 6a ac ca 06 fa 3e 34 e2 b4 0a d5 97 9d 8d 58 3a 6b bb 1c 51 0e f4 3f ... 1494 more bytes>,
  executable: false,
  lamports: 865597210,
  owner: PublicKey [PublicKey(CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK)] {
    _bn: <BN: a5d5ca9e04cf5db590b714ba2fe32cb159133fc1c192b72257fd07d39cb0401e>
  },
  rentEpoch: 18446744073709552000,
  space: 1544
}
```


## 7. getParsedTransaction

获取已解析的交易详细信息。

`getParsedTransactions` 可一次性查询多条交易。

> 在需要解析交易的监听场景下会非常有用。

```ts
// 解析一笔转账SOL交易
const parsedTransaction = await connection.getParsedTransaction('3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC', {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
});
console.log(`已解析的交易: ${JSON.stringify(parsedTransaction)}\n`);
```

```
已解析的交易: {"blockTime":1731232782,"meta":{"computeUnitsConsumed":150,"err":null,"fee":5000,"innerInstructions":[],"logMessages":["Program 11111111111111111111111111111111 invoke [1]","Program 11111111111111111111111111111111 success"],"postBalances":[7826454,1993200,1],"postTokenBalances":[],"preBalances":[7832454,1992200,1],"preTokenBalances":[],"rewards":[],"status":{"Ok":null}},"slot":300547625,"transaction":{"message":{"accountKeys":[{"pubkey":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2","signer":true,"source":"transaction","writable":true},{"pubkey":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","signer":false,"source":"transaction","writable":true},{"pubkey":"11111111111111111111111111111111","signer":false,"source":"transaction","writable":false}],"instructions":[{"parsed":{"info":{"destination":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","lamports":1000,"source":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"},"type":"transfer"},"program":"system","programId":"11111111111111111111111111111111","stackHeight":null}],"recentBlockhash":"7F3ptA9dwyosGYK2RMZneutNEfc6PruonnZcqVH35wyG"},"signatures":["3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC"]},"version":"legacy"}
```

## 8. getSignaturesForAddress

获取与指定账户地址相关的交易签名列表。

> 这在监听账户时会非常有用。

```ts
// 获取web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2账户下最新的3笔交易
const signatures = await connection.getSignaturesForAddress(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
        limit: 3
    });
console.log(`最近的3笔交易签名: ${JSON.stringify(signatures)}\n`);
```

```
最近的3笔交易签名: [{"blockTime":1731241155,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"5sFePYo4zAX2uiGmt1LmDBfoYDxXGhiix1of8K3DPD3Kua4fGStbMtKWvyUc1u1fdtrVS8DM51pgA9Us9GsaDRjm","slot":300566648},{"blockTime":1731232782,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC","slot":300547625},{"blockTime":1731232657,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"4aZJwh2srekTB3w7VzF91rNv7oB1ZPMGwds1ohnivejHMUdSw7Eacp5kLkcChJuU2MmjewrusVNbHa2aCpjwTy6M","slot":300547340}]
```


## 9. getTokenAccountsByOwner

用于查询某个账户下所有的代币账户。

```ts
const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
}, "confirmed");
console.log(`token账户: ${JSON.stringify(tokenAccountsByOwner)}\n`);
```

```
token账户: {"context":{"apiVersion":"2.0.3","slot":300580814},"value":[{"account":{"data":{"type":"Buffer","data":[198,250,122,243,190,219,173,58,61,101,243,106,171,201,116,49,177,187,228,194,210,246,224,228,124,166,2,3,69,47,93,97,13,255,221,17,24,19,199,35,78,149,150,80,234,75,209,227,110,41,100,154,108,37,103,158,230,205,202,31,47,49,116,137,128,132,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"executable":false,"lamports":2039280,"owner":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","rentEpoch":18446744073709552000,"space":165},"pubkey":"HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"}]}
```

## 10. getTokenLargestAccounts

查询某个代币的20个最大持有者账户。

```ts
// 获取代币mint地址为Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump的前20持有者
const tokenLargestAccounts = await connection.getTokenLargestAccounts(new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump"));
console.log(`20个token最大持有者账户: ${JSON.stringify(tokenLargestAccounts)}\n`);
```

```
20个token最大持有者账户: {"context":{"apiVersion":"2.0.3","slot":300581319},"value":[{"address":"5hWv7FkSbyjyMNxKutWkA41azBFLkZNv3seLhZMeVR9f","amount":"152069454264255","decimals":6,"uiAmount":152069454.264255,"uiAmountString":"152069454.264255"},{"address":"EREWvGJSLVZ7cYqR9UBHags8Nu69UJWJTyUs5x1PxSVu","amount":"33554743151407","decimals":6,"uiAmount":33554743.151407,"uiAmountString":"33554743.151407"},{"address":"CsZcHJ9PgteaQfcNAsJhveM97THJ1erJYDCKxPv7zyoJ","amount":"23722304864271","decimals":6,"uiAmount":23722304.864271,"uiAmountString":"23722304.864271"},{"address":"BeJNuqkM7fLTQ9ayXxmRR2HcxwCtYdE5A83pDfkoK2ac","amount":"20153660767179","decimals":6,"uiAmount":20153660.767179,"uiAmountString":"20153660.767179"},{"address":"ECq3rtYeuGqjRYB5mnAQVkmnxEEhqZrCsj9iDXMLzMas","amount":"19542872794233","decimals":6,"uiAmount":19542872.794233,"uiAmountString":"19542872.794233"},{"address":"3eQwYYPvPRNT95ijnV7MhiuDf3UvFppgmbUfzGr3swGy","amount":"18960282274790","decimals":6,"uiAmount":18960282.27479,"uiAmountString":"18960282.27479"},{"address":"A9X8AbYgRUDgv76oJb3owJ9KZNQyMHYYoBUAcXYTQb4X","amount":"18385694793997","decimals":6,"uiAmount":18385694.793997,"uiAmountString":"18385694.793997"},{"address":"3tBpHjkbA2iPgLiynkh8aocx25cZw5giDsKgBMt18FQY","amount":"16192533170352","decimals":6,"uiAmount":16192533.170352,"uiAmountString":"16192533.170352"},{"address":"CKzAxaWfCvN2E2gsHZuh9ahkFURmWgrjcJmQJfS39JXw","amount":"15336629610352","decimals":6,"uiAmount":15336629.610352,"uiAmountString":"15336629.610352"},{"address":"AkRDFNqBny8QSWrm4hVHGz76AANHBYUySJ2FMMPJgFvc","amount":"14313037432834","decimals":6,"uiAmount":14313037.432834,"uiAmountString":"14313037.432834"},{"address":"7o9C3KFMinhVyCpAL18mjvWUAyNWECgfugoDEdEgVS3r","amount":"14278373348178","decimals":6,"uiAmount":14278373.348178,"uiAmountString":"14278373.348178"},{"address":"AgY1NbsCMaon6hjfcBMQjSaRyw8sUZNaoDht6H7Zw6GT","amount":"13601918495029","decimals":6,"uiAmount":13601918.495029,"uiAmountString":"13601918.495029"},{"address":"H1Qm7UNCdfhrbmjzzSKBN28xScZoBrU4CiTrQLfZwnTN","amount":"13212871578892","decimals":6,"uiAmount":13212871.578892,"uiAmountString":"13212871.578892"},{"address":"CLRVbDx6QkcSCGAkMSfmQuTFqpZun3tFRZHoCd7GV2MP","amount":"13045037329632","decimals":6,"uiAmount":13045037.329632,"uiAmountString":"13045037.329632"},{"address":"F6f91snaYJvioLtx5ESqKZTLxNuZn3erv78yBDvkP3kH","amount":"12234592572102","decimals":6,"uiAmount":12234592.572102,"uiAmountString":"12234592.572102"},{"address":"8D9v7JRy8uVLiqFcxQJjmPhdFttJcX6E5Kmn4WDFV3tM","amount":"11847710475369","decimals":6,"uiAmount":11847710.475369,"uiAmountString":"11847710.475369"},{"address":"Dvi82ZRJjey2eXV27U2Y8BGPbEkfq3B6t7pLsLCA4Ajh","amount":"11234459181997","decimals":6,"uiAmount":11234459.181997,"uiAmountString":"11234459.181997"},{"address":"HT1nud5TfKgnr2eG1bRB6eutRRNrHTS5uez4fFxL9txo","amount":"10980211007652","decimals":6,"uiAmount":10980211.007652,"uiAmountString":"10980211.007652"},{"address":"DrGFmy45YwcbUTZFn2XrKvVUTBbBY1jjGfMKGLFEkSmK","amount":"10536406834949","decimals":6,"uiAmount":10536406.834949,"uiAmountString":"10536406.834949"},{"address":"EkPJUGTRxEsDeLU7LbizUUgnA19GPzerUjLvEGAc9Zbi","amount":"10460309988199","decimals":6,"uiAmount":10460309.988199,"uiAmountString":"10460309.988199"}]}
```

## 11. getTokenSupply

获取代币的供应量。

```ts
// 获取USDC的供应量
const supplyInfo = await connection.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
console.log(`Total supply: ${supplyInfo.value.amount}\n`);
```

```
Total supply: 3277049395067962
```

## 12. getParsedProgramAccounts

批量获取某个程序账户下的所有账户信息。

> 在获取某个代币的所有持有者时会非常有用。

```ts
// 获取代币mint地址为Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump的所有持有者
const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
const accounts = await connection.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
    filters: [
        {
            dataSize: 165, // Token 账户的数据大小是 165 字节
        },
        {
            memcmp: {
                offset: 0, // 0 偏移表示 Token Mint 地址的位置
                bytes: mintAddress.toBase58(),
            },
        },
    ],
});

// 只打印3个持有者
console.log("前3个账户:",  accounts.slice(0, 3))

```

```
前3个账户: [
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(Avd9odZRLXLJTofuGSwPnUjTweniq7hae1fiyqeKMMiG)] {
      _bn: <BN: 9375d79921e9ebb0d16610d41bf7845523c58600ec36fc853e0a575e89453b89>
    }
  },
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(53P2PjAqKcVm7iE2ZKGF5BDWSxHY7EPvhQw7iTvMYjWn)] {
      _bn: <BN: 3c0acfdb1629d9cbf13eaa22e97b7056a818513e45f90296d40392832af217df>
    }
  },
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(7EyFQhPg4S61U1FHnbL7BK1pnhFFyGLGXc6C99RGJCei)] {
      _bn: <BN: 5cba45ba1eb61ed5aeefc526c55f3d08441980486deb5eab70b8724e1012dfaf>
    }
  }
]
```