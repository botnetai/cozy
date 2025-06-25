const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const PORT = 8080;

// Helper function to execute code
async function executeCode(language, code) {
  return new Promise((resolve, reject) => {
    let command, args;
    const tempFile = `/tmp/code_${Date.now()}`;
    
    switch (language) {
      case 'javascript':
      case 'typescript':
        command = 'tsx';
        args = ['--eval', code];
        break;
      case 'python':
        command = 'python3';
        args = ['-c', code];
        break;
      default:
        reject(new Error(`Unsupported language: ${language}`));
        return;
    }
    
    const proc = spawn(command, args, {
      cwd: '/home/sandboxuser/workspace',
      env: { ...process.env, PATH: process.env.PATH }
    });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, exitCode: code });
      } else {
        resolve({ stdout, stderr, exitCode: code, error: stderr || 'Process exited with error' });
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Helper function to execute Claude Code
async function executeClaudeCode(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['code', prompt], {
      cwd: '/home/sandboxuser/workspace',
      env: { ...process.env, ANTHROPIC_API_KEY: apiKey }
    });
    
    let output = '';
    let error = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(error || 'Claude Code execution failed'));
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      
      switch (req.url) {
        case '/execute':
          const result = await executeCode(data.language, data.code);
          res.end(JSON.stringify(result));
          break;
          
        case '/claude':
          const apiKey = req.headers['x-anthropic-api-key'];
          if (!apiKey) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'API key required' }));
            return;
          }
          const output = await executeClaudeCode(data.prompt, apiKey);
          res.end(JSON.stringify({ output }));
          break;
          
        case '/file':
          let fileResult;
          switch (data.operation) {
            case 'read':
              const content = await fs.readFile(path.join('/home/sandboxuser/workspace', data.path), 'utf8');
              fileResult = { content };
              break;
            case 'write':
              await fs.writeFile(path.join('/home/sandboxuser/workspace', data.path), data.content);
              fileResult = { success: true };
              break;
            case 'list':
              const files = await fs.readdir(path.join('/home/sandboxuser/workspace', data.path || '.'));
              fileResult = { files };
              break;
            case 'mkdir':
              await fs.mkdir(path.join('/home/sandboxuser/workspace', data.path), { recursive: true });
              fileResult = { success: true };
              break;
          }
          res.end(JSON.stringify(fileResult));
          break;
          
        default:
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Container server listening on port ${PORT}`);
});