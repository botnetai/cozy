import { Container } from '@cloudflare/containers';

export class CozySandboxContainer extends Container {
  defaultPort = 8080;
  sleepAfter = '10s'; // Sleep after 10 seconds for testing
  
  envVars = {
    NODE_ENV: 'production',
    PORT: '8080',
    MESSAGE: 'Cozy Container is running!'
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
}