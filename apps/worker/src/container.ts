import { Container } from '@cloudflare/containers';

export class CozySandboxContainer extends Container {
  defaultPort = 8080;
  sleepAfter = '5m'; // Sleep after 5 minutes of inactivity
  
  envVars = {
    NODE_ENV: 'production',
    PORT: '8080'
  };

  override onStart() {
    console.log('Cozy container successfully started');
  }

  override onStop() {
    console.log('Cozy container successfully shut down');
  }

  override onError(error: unknown) {
    console.log('Container error:', error);
  }

  // Custom method to execute Claude prompts
  async executeClaude(prompt: string, apiKey: string) {
    const response = await this.containerFetch('/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': apiKey
      },
      body: JSON.stringify({ prompt })
    });
    
    return response;
  }

  // Custom method to execute code
  async executeCode(language: string, code: string) {
    const response = await this.containerFetch('/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language, code })
    });
    
    return response;
  }
}