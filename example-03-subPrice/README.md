# 监听raydium clmm代币的实时价格

此例子结合 `onSlotUpdate` 和 解析buffer的方法来实时订阅raydium clmm WSOL/USDC流动池中WSOL的价格。

通过 `npx esrun example-03-subPrice/index.ts` 运行

```
sqrtPriceX64Value at offset 253: 8617564287599812924
WSOL价格: 218.23762107593976
---

sqrtPriceX64Value at offset 253: 8618158284616202734
WSOL价格: 218.2677077591724
---

sqrtPriceX64Value at offset 253: 8617802344396074973
WSOL价格: 218.24967869796686
---

sqrtPriceX64Value at offset 253: 8616982572722284816
WSOL价格: 218.2081585081117
---

sqrtPriceX64Value at offset 253: 8617078429812061202
WSOL价格: 218.21301332015403
---

sqrtPriceX64Value at offset 253: 8616930983791568854
WSOL价格: 218.2055457392501
---
```