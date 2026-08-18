// Load local .env for development (dev-only)
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import generateHandler from './api/generate.js'

const app = express()
app.use(bodyParser.json({ limit: '1mb' }))

// Wrap the serverless handler
app.post('/api/generate', (req, res) => {
  // generateHandler is default export: function handler(req,res)
  // Express req/res are compatible for basic usage
  return generateHandler(req, res)
})

const port = process.env.DEV_SERVER_PORT || 3001
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Dev API server listening on http://localhost:${port}`)
})
