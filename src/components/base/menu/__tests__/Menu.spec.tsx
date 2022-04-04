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
            <VMenuItem key="1" title="Menu Item 1" />
            <VMenuItem key="2" title="Menu Item 2" />
          </VMenu>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should work with sub menus", function () {
    const wrapper = mount({
      setup() {
        return () => (
          <VMenu>
            <VMenuItem id="1" title="Menu Item 1" />
            <VMenuItem id="2" title="Menu Item 2" />
            <VMenuItem id="3" title="Menu Item 3" />
            <VMenuItem id="4" title="Menu Item 4" />
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
            <VMenuItem id="1" title="Menu Item 1" />
            <VMenuItem id="2" title="Menu Item 2" />
            <VMenuItem id="3" title="Menu Item 3">
              <VMenuItem key="4" title="Menu Item 4" />
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
