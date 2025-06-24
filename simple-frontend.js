export default {
  async fetch(request) {
    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Cozy Cloud</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui;
      margin: 0;
      padding: 20px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 600px;
    }
    h1 { color: #1f2937; }
    .status { color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Cozy Cloud</h1>
    <p>Browser-Hosted Claude Code Platform</p>
    <p class="status">✅ Frontend Working!</p>
  </div>
</body>
</html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};