export const wrapContentInTemplate = (bodyContent: string): string => {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Template</title>
  <style>
    html, body {
      height: auto;
      min-height: 100%;
    }
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }
    .email-container {
      display: block;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${bodyContent}
  </div>
</body>
</html>`
}
