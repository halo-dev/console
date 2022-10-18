/// <reference types="vite/client" />

export {};

import "vue-router";

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
      group?: string;
      icon?: Component;
      priority: number;
      mobile?: true;
    };
  }
}
