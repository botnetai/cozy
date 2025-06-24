// test-performance.ts
async function runPerformanceTest() {
  const baseUrl = 'http://localhost:8787'
  const iterations = 10
  const results = []

  console.log(`Running ${iterations} iterations...`)

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    
    await fetch(`${baseUrl}/container/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': `perf-test-${i}`
      },
      body: JSON.stringify({
        language: 'javascript',
        code: 'console.log("Performance test " + ' + i + ')'
      })
    })
    
    const end = performance.now()
    const duration = end - start
    results.push(duration)
    console.log(`Iteration ${i + 1}: ${duration.toFixed(2)}ms`)
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length
  const min = Math.min(...results)
  const max = Math.max(...results)

  console.log('\nPerformance Summary:')
  console.log(`Average: ${avg.toFixed(2)}ms`)
  console.log(`Min: ${min.toFixed(2)}ms`)
  console.log(`Max: ${max.toFixed(2)}ms`)
}

runPerformanceTest().catch(console.error)