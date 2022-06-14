import type { PropType } from "vue";
import type { MenuGroupType } from "./interface";
declare const VRoutesMenu: import("vue").DefineComponent<{
    menus: {
        type: PropType<MenuGroupType[]>;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "select"[], "select", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    menus: {
        type: PropType<MenuGroupType[]>;
    };
}>> & {
    onSelect?: (...args: any[]) => any;
}, {}>;
export { VRoutesMenu };
