import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
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

// 保存Uint8Array私钥
fs.writeFileSync(path.resolve(__dirname, "wallet.json"), JSON.stringify(Array.from(secretKey)));

// 导入钱包
const secretKey2 = Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve(__dirname, "wallet.json"), 'utf-8')));
const wallet2 = Keypair.fromSecretKey(secretKey2);

console.log("钱包公钥:", wallet2.publicKey.toString());
console.log("钱包私钥:", wallet2.secretKey);
console.log("钱包私钥(base64):", Buffer.from(secretKey).toString("base64"));