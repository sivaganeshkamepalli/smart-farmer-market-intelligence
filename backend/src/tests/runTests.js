const { initDB, query } = require('../config/db');
const { correctTyposAndExtractEntities } = require('../services/queryUnderstandingService');
const { calculateLandAllocation } = require('../services/landAllocationService');
const { calculateCropEconomics } = require('../services/costProfitService');
const { calculateRiskProfile } = require('../services/riskAnalysisService');
const { processFarmerQuery } = require('../services/aiService');

async function runTests() {
  console.log('--- Starting Backend Multi-User & Refinement Tests ---');
  await initDB();

  // Test 1: Verify Zero Dummy Users in DB
  console.log('\n[Test 1] Verifying Zero Dummy Users in Seeded Database:');
  const userCount = await query('SELECT COUNT(*) as cnt FROM users');
  console.log(`-> Users count in DB: ${userCount[0].cnt} (Must be 0)`);
  if (userCount[0].cnt !== 0) {
    throw new Error('Database contains dummy users! Expected 0.');
  }

  // Test 2: "HI" Greeting Intent Detection (Requirement #24)
  console.log('\n[Test 2] Testing "HI" Greeting Intent Parser:');
  const hiRes = await processFarmerQuery('hi');
  console.log('-> User Query: "hi"');
  console.log('-> Intent Detected:', hiRes.intent);
  console.log('-> AI Greeting Message:', hiRes.message);
  console.log('-> Recommendations Count:', hiRes.recommendations.length, '(Must be 0)');
  console.log('-> Follow-up Options:', hiRes.followUpOptions.slice(0, 3));
  if (hiRes.intent !== 'GREETING' || hiRes.recommendations.length !== 0) {
    throw new Error('Greeting intent failed! "hi" must return GREETING with 0 crop recommendations.');
  }

  // Test 3: Typo Correction & Crop Intent
  console.log('\n[Test 3] Testing Typo Correction & Crop Intent:');
  const cropRes = await correctTyposAndExtractEntities('I have 2 acres. Should I grow tomoto?');
  console.log('-> Original:', cropRes.originalQuery);
  console.log('-> Corrected:', cropRes.correctedQuery);
  console.log('-> Intent:', cropRes.intent);

  // Test 4: Dynamic Land Allocation
  console.log('\n[Test 4] Testing Dynamic Land Allocation Engine:');
  const alloc = calculateLandAllocation(2.0, 'MEDIUM', 100000, 'BALANCED');
  console.log('-> Rationale:', alloc.rationale);
  alloc.allocation.forEach(a => console.log(`   - ${a.categoryLabel}: ${a.acres} acres (${a.percentage}%)`));

  // Test 5: Missing Farm Info Handling (Requirement #27 & #28)
  console.log('\n[Test 5] Testing AI Memory & Missing Info Flow:');
  const missingRes = await processFarmerQuery('What should I cultivate?', null);
  console.log('-> AI Message with Missing Info:', missingRes.message.slice(0, 150) + '...');
  console.log('-> Missing Parameters Detected:', missingRes.missingInformation.map(m => m.field));

  console.log('\n--- All Backend Multi-User & Refinement Tests Completed Successfully! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
