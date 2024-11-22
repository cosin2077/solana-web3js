# 读取链上数据（二）：`on` 订阅

本部分将带你认识一些常用的订阅链上数据的方法以及使用场景。

与单次的链上数据读取不同，订阅是RPC节点以数据流的方式向客户端推送数据。这些方法同样属于 `Connecion` 类，方法名以 `on` 开头。

还是先创建RPC连接：

```ts
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

## 1. onAccountChange 和 onProgramAccountChange

用于实时监听特定账户的状态变化。当账户的余额或存储的数据发生变化时，会触发回调函数，并提供更新后的账户信息。

> 这在钱包监控上会很有用。

```ts
// 监听orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8账户是否发生变化
connection.onAccountChange(new PublicKey("orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8"), (accountInfo) => {
    console.log(`账户变化: ${JSON.stringify(accountInfo)}\n`);
});
```

```
账户变化: {"lamports":54656348509,"data":{"type":"Buffer","data":[]},"owner":"11111111111111111111111111111111","executable":false,"rentEpoch":18446744073709552000,"space":0}
```

`onProgramAccountChange` 类似，只不过是对程序账户的状态订阅。

## 2. onLogs

用于实时监听网络上的日志，也可以指定监听某账户下的日志。

> 这在监听新流动池创建和监控钱包买卖时很有用。

```ts
// 监听raydium v4的日志
connection.onLogs(new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"), (logs) => {
    console.log(`日志: ${JSON.stringify(logs)}\n`);
});
```

```
日志: {"signature":"5FziCd9SRzEJyXcxRotJqamGdcTfdMKiWB4GPvg2HiWFpzzyvnBGTaV6Vd8KANS85yHjszE61BxFc1gQQgSdATSg","err":null,"logs":["Program ComputeBudget111111111111111111111111111111 invoke [1]","Program ComputeBudget111111111111111111111111111111 success","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm invoke [1]","Program log: Instruction: Finish","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 invoke [2]","Program log: ray_log: A0cBmjWFAAAAbK8wbAAAAAACAAAAAAAAAEcBmjWFAAAA/2uOg3AUAADPqGwiEQAAAOq+oWwAAAAA","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: Transfer","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 101749 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: Transfer","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4736 of 94123 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 consumed 32059 of 120402 compute units","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]","Program log: Instruction: CloseAccount","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2916 of 85643 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]","Program log: Instruction: CloseAccount","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3014 of 78745 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 11111111111111111111111111111111 invoke [2]","Program 11111111111111111111111111111111 success","Program 11111111111111111111111111111111 invoke [2]","Program 11111111111111111111111111111111 success","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]","Program log: Create","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: GetAccountDataSize","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1569 of 58189 compute units","Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 11111111111111111111111111111111 invoke [3]","Program 11111111111111111111111111111111 success","Program 11111111111111111111111111111111 invoke [3]","Program 11111111111111111111111111111111 success","Program log: Initialize the associated token account","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: InitializeImmutableOwner","Program log: Please upgrade to SPL Token 2022 for immutable owner support","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 50213 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: InitializeAccount3","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3158 of 46329 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 22297 of 65164 compute units","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm consumed 108080 of 149850 compute units","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm success"]}
```