import type { Component, Ref } from "vue";
import type { RouteRecordRaw, RouteRecordName } from "vue-router";
import type { PagesPublicState } from "../states/pages";
import type { AttachmentSelectorPublicState } from "../states/attachment-selector";

export type ExtensionPointName = "PAGES" | "POSTS" | "ATTACHMENT_SELECTOR";

export type ExtensionPointState =
  | PagesPublicState
  | AttachmentSelectorPublicState;

export interface RouteRecordAppend {
  parentName: RouteRecordName;
  route: RouteRecordRaw;
}

export interface Plugin {
  name: string;

  /**
   * These components will be registered when plugin is activated.
   */
  components?: Component[];

  /**
   * Activate hook will be called when plugin is activated.
   */
  activated?: () => void;

  /**
   * Deactivate hook will be called when plugin is deactivated.
   */
  deactivated?: () => void;

  routes?: RouteRecordRaw[] | RouteRecordAppend[];

  extensionPoints?: {
    [key in ExtensionPointName]?: (state: Ref<ExtensionPointState>) => void;
  };
}
