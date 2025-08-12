// Polyfill global pour les paquets Node.js dans Angular
(window as any).global = window;

// Optionnel mais souvent utile aussi :
(window as any).process = {
  env: { DEBUG: undefined },
};
