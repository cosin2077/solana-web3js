# 获取账户下的 SOL 余额

> RPC端口是与Solana链上交互的媒介。

本部分将介绍如何使用Connection类创建一个RPC连接，并使用getBalance方法获取账户下的SOL余额。

## 创建RPC连接

`Connection` 类是与Solana区块链交互的核心类，它提供了多种方法来与区块链进行交互。通过给定RPC端口和确认级别，可以创建一个Connection实例，如下：

```ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

`https://api.mainnet-beta.solana.com` 是solana官方提供的RPC端口，`confirmed` 是默认的确认级别。

> 注意：
> `processed` 是较低的确认级别，意味着查询的数据是经过验证但尚未完全确认的。`confirmed` 表示节点已经将交易写入区块链，但也不一定被最终确认。如果需要更高的确认级别，可以使用 `finalized`。

## 查询账户余额

`getBalance` 方法用于查询指定账户下的SOL余额，返回值是账户余额的lamports数量，需要除以 `LAMPORTS_PER_SOL` 转换为SOL单位。

> 注意：
> `LAMPORTS_PER_SOL` 是1个SOL的lamports数量，等于10^9。

此处我们将查询Jito1的SOL余额，其公钥为 `CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1`。

```ts
async function main() {

    // 查询Jito1的SOL余额
    const publicKey = new PublicKey('CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1');
    const balance = await connection.getBalance(publicKey);
    console.log(`Jito1余额: ${balance / LAMPORTS_PER_SOL} SOL`); // 转换为 SOL 单位
}

main();
```

通过 `npx esrun 02-balance/index.ts` 运行上述代码，可以看到Jito1当前的SOL余额为9.999906999 SOL。

```
Jito1余额: 9.999906999 SOL
```