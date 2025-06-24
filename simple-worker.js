export default {
  async fetch(request) {
    return new Response('Hello from Cozy Frontend!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};