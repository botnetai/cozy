import { Container } from '@cloudflare/containers';

export class CozySandboxContainer extends Container {
  // Port the container listens on
  defaultPort = 8080;
  
  // Time before container sleeps due to inactivity
  sleepAfter = '5m';
  
  // Environment variables passed to the container
  envVars = {
    NODE_ENV: 'production',
    PORT: '8080',
    MESSAGE: 'Cozy Container is running!'
  };

  // Optional lifecycle hooks
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