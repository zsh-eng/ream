/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REAM_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
