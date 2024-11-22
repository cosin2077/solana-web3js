# 创建钱包 & 导入钱包

> 私钥是账户的唯一凭证，请妥善保管。

本部分将介绍如何使用web3.js库创建自己的钱包。

## 创建钱包

Solana 钱包是指一对 `私钥`  和 `公钥`，它们是用于访问和管理 Solana 上账户的身份凭证。密钥对通过随机数生成，以确保每个密钥对是唯一的。

- 私钥：一个保密的、用于证明账户所有权的密钥。私钥可以用来生成数字签名和授权交易等。私钥一旦泄露，其他人可以使用它控制你的账户。
- 公钥：与私钥配对的公开部分。公钥是你的账户地址，其他人可以通过公钥向你发送资产或查询账户余额，但无法使用它来授权操作。


```ts
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { Buffer } from 'buffer';

// 创建钱包
const wallet = Keypair.generate();

// 获取公钥和私钥
const publicKey = wallet.publicKey.toBase58();
const secretKey = wallet.secretKey; // 一个 Uint8Array

// 打印
console.log("钱包公钥:", publicKey);
console.log("钱包私钥:", secretKey);
console.log("钱包私钥(base64):", Buffer.from(secretKey).toString("base64"));

// 保存 Uint8Array 私钥
fs.writeFileSync("wallet.json", JSON.stringify(Array.from(secretKey)));
```

通过 `npx esrun 01-wallet/index.ts` 运行，输出如下：

```bash
钱包公钥: EkfAVHeFtDUmGQJH5e67i784wKKNA7jyStKywQWysY73
钱包私钥: Uint8Array(64) [
  180, 206,  18, 236, 242, 179, 168, 142, 181,  66,
  158, 123, 232, 162, 205, 195, 192,  56, 117, 152,
  238,  67, 141, 162, 250,  60, 104, 153,  79,  96,
   49, 234, 204,  87,  14, 120, 218,  77, 112, 188,
  235, 139,   1, 134, 201, 208, 112,  25,   2, 151,
  227, 188,  25,  69, 178, 196, 146, 227, 179,  14,
  118, 115, 233, 234
]
钱包私钥(base64): tM4S7PKzqI61Qp576KLNw8A4dZjuQ42i+jxomU9gMerMVw542k1wvOuLAYbJ0HAZApfjvBlFssSS47MOdnPp6g==
```

私钥被保存到此项目根目录的 `wallet.json` 文件中。公钥长度为 32 字节, 通常以 Base58 编码；私钥长度为 64 字节, 通常以 Base64 编码。

## 导入钱包

从刚才新保存的 `wallet.json` 文件中导入私钥来恢复钱包。

```ts
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const wallet = Keypair.fromSecretKey(secretKey);

console.log("钱包公钥:", wallet.publicKey.toString());
console.log("钱包私钥:", wallet.secretKey);
console.log("钱包私钥(base64):", Buffer.from(secretKey).toString("base64"));
```

运行后输出应与之前的输出一致。


