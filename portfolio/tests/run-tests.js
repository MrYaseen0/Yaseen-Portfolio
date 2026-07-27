#!/usr/bin/env node

const { execSync } = require('child_process')

const tests = {
  unit: { cmd: 'npx vitest run tests/unit', label: 'Unit Tests', needsServer: false },
  'api:original': { cmd: 'npx vitest run server/api.test.js', label: 'API Tests (original)', needsServer: true },
  integration: { cmd: 'npx vitest run tests/integration/api.test.js', label: 'Integration Tests', needsServer: true },
  regression: { cmd: 'npx vitest run tests/integration/regression.test.js', label: 'Regression Tests', needsServer: true },
  smoke: { cmd: 'npx vitest run tests/integration/smoke.test.js', label: 'Smoke Tests', needsServer: true },
}

const target = process.argv[2] || 'unit'

if (target === 'all') {
  console.log('Running all offline-safe tests...\n')
  try {
    execSync(tests.unit.cmd, { stdio: 'inherit', cwd: __dirname })
    console.log('\n✅ Unit tests passed')
  } catch {
    console.log('\n❌ Unit tests failed')
    process.exit(1)
  }
  console.log('\n⚠️  Server-dependent tests skipped (run with server running):')
  Object.entries(tests).forEach(([key, t]) => {
    if (t.needsServer) console.log(`   npm run test:${key}`)
  })
} else if (tests[target]) {
  if (tests[target].needsServer) {
    console.log(`⚠️  ${tests[target].label} requires server running on port 5000`)
    console.log('   Start server: npm run dev:server')
    console.log('   Then run: npm run test:' + target)
    process.exit(0)
  }
  try {
    execSync(tests[target].cmd, { stdio: 'inherit', cwd: __dirname })
    console.log(`\n✅ ${tests[target].label} passed`)
  } catch {
    console.log(`\n❌ ${tests[target].label} failed`)
    process.exit(1)
  }
} else {
  console.log('Usage: node tests/run-tests.js [unit|all|api:integration|regression|smoke]')
}
