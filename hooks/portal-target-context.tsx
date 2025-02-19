// hooks/PortalTargetContext.ts
// https://wxt.dev/guide/resources/faq.html#my-component-library-doesn-t-work-in-content-scripts
import { createContext } from 'react';

export const PortalTargetContext = createContext<HTMLElement | null>(null);
