import type { FormKitTypeDefinition } from "@formkit/core";
import {
  help,
  icon,
  inner,
  label,
  message,
  messages,
  outer,
  prefix,
  suffix,
  wrapper,
} from "@formkit/inputs";
import CategorySelect from "./CategorySelect.vue";
import { CategorySelectSection } from "./sections";

export const postCategorySelect: FormKitTypeDefinition = {
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix"),
        prefix(),
        CategorySelectSection(),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
  type: "input",
  library: {
    CategorySelect: CategorySelect,
  },
};
