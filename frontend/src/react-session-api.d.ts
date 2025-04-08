declare module 'react-session-api' {
    export function setDefaultSession(options: {
      duration?: number;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      persistent?: boolean;
    }): void;
  
    export function setSession(key: string, value: any): void;
    export function getSession<T = any>(key: string): T | null;
    export function removeSession(key: string): void;
  }
  