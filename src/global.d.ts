declare global {
  interface Window {
    MercadoPago: new (publicKey: string) => any;
  }
}

export {};
