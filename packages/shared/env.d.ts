/// <reference types="vite/client" />

export {};


declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    searchable?: boolean;
    permissions?: string[];
    menu?: {
      name: string;
      icon?: Component;
      priority: number;
      mobile?: true;
    };
  }
}
