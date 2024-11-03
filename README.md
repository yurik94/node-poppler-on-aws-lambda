# PDF to Image Converter on AWS Lambda with Poppler

This repository provides a serverless solution for converting PDFs to images using AWS Lambda and Poppler, an open-source PDF processing library.

## Overview

The project packages the Poppler utility (`pdftocairo`) into an AWS Lambda layer, allowing the Lambda function to convert PDF files into images. The conversion is done in a lightweight, reusable Lambda layer, optimized for serverless environments.

## Getting Started

### Prerequisites

- Docker (for building the Lambda layer)
- AWS CLI and AWS SAM CLI (for deployment)
- Node.js

### Building the Poppler Lambda Layer

To build the Poppler layer for ARM64 architecture:
```bash
docker build --platform=linux/arm64 --build-arg TARGET_PLATFORM=arm64 -f ./layers/poppler/Dockerfile -t poppler-lambda-layer-arm ./layers/poppler
docker run --rm --platform=linux/arm64 -v "$(pwd)/layers:/workspace" poppler-lambda-layer-arm
```

For x86_64 architecture, adjust the commands as follows:

1. Platform: `linux/amd64`
2. Target Platform: `amd64`
3. Image Name: `poppler-lambda-layer-x86-64`


### Deploying with AWS SAM

1. Set up a new SAM project.
2. Define the Lambda function and layer in `template.yaml`.
3. Deploy the application:

```bash
sam build
sam deploy --guided
```

### Testing the Lambda Function
To test, send a POST request to the API endpoint with a base64-encoded PDF. The function returns the first page of the PDF as a base64-encoded PNG image.


## Conclusion
This setup allows PDF-to-image conversion in a serverless environment, making it scalable and reusable for document processing tasks.