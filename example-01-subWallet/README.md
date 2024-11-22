# 监听钱包

此例子结合 `onAccountChange` 和 `getSignaturesForAddress` 方法来订阅指定账户的改变并获取指定账户的最新交易。

获取到最新交易后，将通过telegram bot发送通知。

通过 `npx esrun example-01-subWallet/index.ts`运行。

![](../img/example-01-01.png)