import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import type { Plugin } from "@halo-dev/admin-shared";
// setup
import "./setup/setupStyles";
import { setupComponents } from "./setup/setupComponents";
import { registerMenu } from "@/router/menus.config";

// core modules
import { coreModules } from "./modules";
import { useScriptTag } from "@vueuse/core";
import { usePluginStore } from "@/stores/plugin";
import axios from "axios";

const app = createApp(App);

setupComponents(app);

app.use(createPinia());

function registerModule(pluginModule: Plugin) {
  if (pluginModule.components) {
    if (!Array.isArray(pluginModule.components)) {
      console.error(`${pluginModule.name}: Plugin components must be an array`);
      return;
    }

    for (const component of pluginModule.components) {
      component.name && app.component(component.name, component);
    }
  }

  if (pluginModule.routes) {
    if (!Array.isArray(pluginModule.routes)) {
      console.error(`${pluginModule.name}: Plugin routes must be an array`);
      return;
    }

    for (const route of pluginModule.routes) {
      router.addRoute(route);
    }
  }

  if (pluginModule.menus) {
    if (!Array.isArray(pluginModule.menus)) {
      console.error(`${pluginModule.name}: Plugin menus must be an array`);
      return;
    }

    for (const group of pluginModule.menus) {
      for (const menu of group.items) {
        registerMenu(group.name, menu);
      }
    }
  }
}

function loadCoreModules() {
  coreModules.forEach(registerModule);
}

const pluginStore = usePluginStore();

async function loadPluginModules() {
  const response = await axios.get(
    "http://localhost:8090/apis/plugin.halo.run/v1alpha1/plugins",
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJIYWxvIE93bmVyIiwic3ViIjoiYWRtaW4iLCJleHAiOjE2NTU4NzAzMzIsImlhdCI6MTY1NTc4MzkzMiwic2NvcGUiOlsiUk9MRV9zdXBlci1yb2xlIl19.wsHVzIu3OKhZIep5aoxLUW8o93MjmrlE9fydC-Z7gGlils6MTiSKYxl7eQSc91JIiJTuhmI2qreZQ88kV_ec85jmkQAefZXE3scGXm-G3Gtg7rTBnIS_jbk3IImIkOJIu8twa5tZN6wyX4UoUbU2DiNZBZWqraM1vfsjnLBf7VYpQjBYEIyRu7f4cJ1k9XLFcZ2Fi-hAgVYQguGx3OOdoOpHLPIJOWxgaoSZ45WROvVjPxSrpnoHVxR8CGaAHgrwMwuklRRGjYW9Fd_Q3v_InfGi1TSomkkzTzsfN4igwIAGLEBYHzlcfrvFYL6meINQb_-D8KHePN3IiJDf84MRgw",
      },
      withCredentials: false,
    }
  );

  for (const plugin of response.data) {
    // TODO supported by backend

    plugin.spec.assets = {
      entry: `http://localhost:8090/assets/${plugin.metadata.name}/admin/main.js`,
    };

    const { assets } = plugin.spec;

    if (assets) {
      const { load } = useScriptTag(assets.entry);
      await load();
      const pluginModule = window[plugin.metadata.name];

      if (pluginModule) {
        // @ts-ignore
        plugin.spec.module = pluginModule;
        registerModule(pluginModule);
      }
    }

    pluginStore.registerPlugin(plugin);
  }
}

(async function () {
  await initApp();
})();

async function initApp() {
  try {
    loadCoreModules();
    await loadPluginModules();
  } catch (e) {
    console.error(e);
  } finally {
    app.use(router);
    app.mount("#app");
  }
}
