// handler.mjs
import { Poppler } from 'node-poppler'
import fs from 'fs/promises'

const poppler = new Poppler('/opt/bin')

export const handler = async (event) => {
  try {
    console.log('Lambda invoked with event:', JSON.stringify(event))

    // Parse the base64-encoded PDF from the request body
    const body = JSON.parse(event.body)
    const pdfData = body.data

    if (!pdfData) {
      console.error("Missing 'data' key in the request body")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'data' key in the request body" }),
      }
    }

    // Decode and save the PDF as a file in /tmp
    const inputFile = '/tmp/sample.pdf'
    const outputFileBase = '/tmp/output'

    console.log('Decoding base64 PDF data...')
    const pdfBuffer = Buffer.from(pdfData, 'base64')
    await fs.writeFile(inputFile, pdfBuffer)
    console.log(`PDF saved to ${inputFile}`)

    // Define options for the Poppler conversion
    const options = {
      firstPageToConvert: 1,
      lastPageToConvert: 1,
      pngFile: true,
    }

    // Execute the Poppler command
    console.log('Starting PDF to PNG conversion...')
    await poppler.pdfToCairo(inputFile, outputFileBase, options)
    const outputFile = `${outputFileBase}-1.png`

    // Check if the PNG output was created
    try {
      await fs.access(outputFile)
      console.log(`PNG file created successfully: ${outputFile}`)
    } catch (err) {
      console.error('PNG output file was not created:', err)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to convert PDF to PNG' }),
      }
    }

    // Read and encode the PNG file as base64
    console.log('Reading and encoding PNG file...')
    const pngBuffer = await fs.readFile(outputFile)
    const pngBase64 = pngBuffer.toString('base64')

    // Return the base64 PNG image as the response
    console.log('Returning base64-encoded PNG image.')
    return {
      statusCode: 200,
      body: JSON.stringify({ image: pngBase64 }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } catch (error) {
    console.error('Error processing PDF:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
