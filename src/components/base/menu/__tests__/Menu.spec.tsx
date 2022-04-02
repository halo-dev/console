import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { VMenu, VMenuItem } from "../index";

describe("Menu", () => {
  it("should render", () => {
    expect(VMenu).toBeDefined();
    expect(VMenuItem).toBeDefined();
    expect(mount(VMenu).html()).toMatchSnapshot();

    const wrapper = mount({
      render() {
        return (
          <VMenu>
            <VMenuItem key="1">Menu Item 1</VMenuItem>
            <VMenuItem key="2">Menu Item 2</VMenuItem>
          </VMenu>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should work with openIds prop", function () {
    const wrapper = mount({
      setup() {
        return () => (
          <VMenu openIds={["3"]}>
            <VMenuItem id="1">Menu Item 1</VMenuItem>
            <VMenuItem id="2">Menu Item 2</VMenuItem>
            <VMenuItem
              id="3"
              v-slots={{
                submenus: () => <VMenuItem key="4">Menu Item 4</VMenuItem>,
              }}
            >
              Menu Item 3
            </VMenuItem>
          </VMenu>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();

    expect(wrapper.find(".sub-menu-items .menu-title").text()).contain(
      "Menu Item 4"
    );
  });
});
