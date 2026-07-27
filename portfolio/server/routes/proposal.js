const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')

function generateProposalHTML(data) {
  const { clientName, projectType, features, budget, timeline, notes } = data
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal - ${projectType}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1A1A2E; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #F0E6DE; }
    .header h1 { font-size: 28px; color: #E84393; margin-bottom: 8px; }
    .header p { color: #9CA3AF; font-size: 14px; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 18px; color: #1A1A2E; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #F0E6DE; }
    .field { margin-bottom: 16px; }
    .field-label { font-size: 13px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #4A4A68; }
    .features { list-style: none; padding: 0; }
    .features li { padding: 8px 0; border-bottom: 1px solid #F0E6DE; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .features li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #E84393; flex-shrink: 0; }
    .total { margin-top: 32px; padding: 20px; background: #FFF9F5; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-size: 16px; font-weight: 600; }
    .total-value { font-size: 24px; font-weight: 700; color: #E84393; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #F0E6DE; text-align: center; font-size: 13px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Project Proposal</h1>
    <p>Prepared for ${clientName || 'Client'} &mdash; ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  <div class="section">
    <h2>Project Overview</h2>
    <div class="field">
      <div class="field-label">Project Type</div>
      <div class="field-value">${projectType || 'Web Application'}</div>
    </div>
    ${notes ? `<div class="field"><div class="field-label">Notes</div><div class="field-value">${notes}</div></div>` : ''}
  </div>
  <div class="section">
    <h2>Deliverables</h2>
    <ul class="features">
      ${(features || ['Responsive design', 'Clean code', 'Documentation']).map(f => `<li>${f}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="section">
    <h2>Timeline & Budget</h2>
    <div class="field">
      <div class="field-label">Estimated Timeline</div>
      <div class="field-value">${timeline || 'TBD'}</div>
    </div>
  </div>
  <div class="total">
    <div class="total-label">Estimated Budget</div>
    <div class="total-value">${budget || 'TBD'}</div>
  </div>
  <div class="footer">
    <p>This proposal is valid for 30 days. For questions, contact me at your earliest convenience.</p>
  </div>
</body>
</html>`
}

router.post('/generate', auth, (req, res) => {
  try {
    const html = generateProposalHTML(req.body)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
