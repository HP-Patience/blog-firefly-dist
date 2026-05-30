export {};

declare global {
  interface Window {
    AvatarCard?: {
      init: () => void;
      destroy: () => void;
    };
  }
}
