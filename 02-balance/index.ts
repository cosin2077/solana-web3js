import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function testRPCSpeed(connection, publicKey, testName, numTests = 100) {
    const results = [];
    
    for (let i = 0; i < numTests; i++) {
        const start = performance.now();
        try {
            await connection.getBalance(publicKey);
            const end = performance.now();
            results.push(end - start);
        } catch (error) {
            console.error(`Error in ${testName} test #${i + 1}:`, error);
            results.push(null); // 记录失败的测试
        }
        
        // 每10次测试打印一次进度
        if ((i + 1) % 10 === 0) {
            console.log(`${testName}: Completed ${i + 1}/${numTests} tests`);
        }
    }

    // 计算统计数据
    const validResults = results.filter(r => r !== null);
    const stats = {
        totalTests: numTests,
        successfulTests: validResults.length,
        failedTests: numTests - validResults.length,
        averageTime: validResults.length > 0 ? 
            (validResults.reduce((a, b) => a + b, 0) / validResults.length).toFixed(2) : 0,
        minTime: validResults.length > 0 ? 
            Math.min(...validResults).toFixed(2) : 0,
        maxTime: validResults.length > 0 ? 
            Math.max(...validResults).toFixed(2) : 0,
        medianTime: validResults.length > 0 ? 
            validResults.sort((a, b) => a - b)[Math.floor(validResults.length / 2)].toFixed(2) : 0
    };

    return stats;
}

async function runSpeedTest() {
    const connection1 = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const connection2 = new Connection("https://mainnet.chainbuff.com", "processed");
    const publicKey = new PublicKey('CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1');

    console.log('Starting RPC speed test...\n');

    // 测试第一个连接
    console.log('Testing Solana Mainnet RPC...');
    const stats1 = await testRPCSpeed(connection1, publicKey, 'Mainnet RPC');

    // 在两次测试之间添加短暂延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试第二个连接
    console.log('\nTesting Chainbuff RPC...');
    const stats2 = await testRPCSpeed(connection2, publicKey, 'Chainbuff RPC');

    // 打印结果报告
    console.log('\n=== Test Results ===');
    
    console.log('\nSolana Mainnet RPC (api.mainnet-beta.solana.com):');
    console.log(`Total Tests: ${stats1.totalTests}`);
    console.log(`Successful: ${stats1.successfulTests}`);
    console.log(`Failed: ${stats1.failedTests}`);
    console.log(`Average Time: ${stats1.averageTime}ms`);
    console.log(`Min Time: ${stats1.minTime}ms`);
    console.log(`Max Time: ${stats1.maxTime}ms`);
    console.log(`Median Time: ${stats1.medianTime}ms`);

    console.log('\nChainbuff RPC (mainnet.chainbuff.com):');
    console.log(`Total Tests: ${stats2.totalTests}`);
    console.log(`Successful: ${stats2.successfulTests}`);
    console.log(`Failed: ${stats2.failedTests}`);
    console.log(`Average Time: ${stats2.averageTime}ms`);
    console.log(`Min Time: ${stats2.minTime}ms`);
    console.log(`Max Time: ${stats2.maxTime}ms`);
    console.log(`Median Time: ${stats2.medianTime}ms`);
}

// 运行测试
runSpeedTest().catch(console.error);