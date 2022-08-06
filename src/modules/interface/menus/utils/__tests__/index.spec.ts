import { describe, expect, it } from "vitest";
import type { MenuTreeItem } from "../index";
import {
  buildMenuItemsTree,
  convertTreeToMenuItems,
  resetMenuItemsTreePriority,
  sortMenuItemsTree,
} from "../index";
import type { MenuItem } from "@halo-dev/api-client";

describe("buildMenuItemsTree", () => {
  it("will match snapshot", () => {
    const rawMenuItems: MenuItem[] = [
      {
        spec: {
          displayName: "文章分类",
          href: "https://ryanc.cc/categories",
          children: [
            "caeef383-3828-4039-9114-6f9ad3b4a37e",
            "ded1943d-9fdb-4563-83ee-2f04364872e0",
          ],
          priority: 0,
          categoryRef: {
            name: "",
          },
          tagRef: {
            name: "",
          },
          postRef: {
            name: "",
          },
          pageRef: {
            name: "",
          },
        },
        apiVersion: "v1alpha1",
        kind: "MenuItem",
        metadata: {
          name: "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
          version: 12,
          creationTimestamp: "2022-08-05T04:19:37.252228Z",
        },
      },
      {
        spec: {
          displayName: "Halo",
          href: "https://ryanc.cc/categories/halo",
          children: [],
          priority: 0,
          categoryRef: {
            name: "",
          },
          tagRef: {
            name: "",
          },
          postRef: {
            name: "",
          },
          pageRef: {
            name: "",
          },
        },
        apiVersion: "v1alpha1",
        kind: "MenuItem",
        metadata: {
          name: "caeef383-3828-4039-9114-6f9ad3b4a37e",
          version: 4,
          creationTimestamp: "2022-07-28T06:50:32.777556Z",
        },
      },
      {
        spec: {
          displayName: "Java",
          href: "https://ryanc.cc/categories/java",
          children: [],
          priority: 1,
          categoryRef: {
            name: "",
          },
          tagRef: {
            name: "",
          },
          postRef: {
            name: "",
          },
          pageRef: {
            name: "",
          },
        },
        apiVersion: "v1alpha1",
        kind: "MenuItem",
        metadata: {
          name: "ded1943d-9fdb-4563-83ee-2f04364872e0",
          version: 1,
          creationTimestamp: "2022-08-05T04:22:03.377364Z",
        },
      },
    ];
    expect(buildMenuItemsTree(rawMenuItems)).toMatchSnapshot();
  });
});

describe("convertTreeToMenuItems", () => {
  it("will match snapshot", function () {
    const tree: MenuTreeItem[] = [
      {
        apiVersion: "v1alpha1",
        kind: "MenuItem",
        metadata: {
          creationTimestamp: "2022-08-05T04:19:37.252228Z",
          name: "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
          version: 12,
        },
        spec: {
          categoryRef: {
            name: "",
          },
          children: [
            {
              apiVersion: "v1alpha1",
              kind: "MenuItem",
              metadata: {
                creationTimestamp: "2022-07-28T06:50:32.777556Z",
                name: "caeef383-3828-4039-9114-6f9ad3b4a37e",
                version: 4,
              },
              spec: {
                categoryRef: {
                  name: "",
                },
                children: [],
                priority: 0,
                displayName: "Halo",
                href: "https://ryanc.cc/categories/halo",
                pageRef: {
                  name: "",
                },
                postRef: {
                  name: "",
                },
                tagRef: {
                  name: "",
                },
              },
            },
            {
              apiVersion: "v1alpha1",
              kind: "MenuItem",
              metadata: {
                creationTimestamp: "2022-08-05T04:22:03.377364Z",
                name: "ded1943d-9fdb-4563-83ee-2f04364872e0",
                version: 1,
              },
              spec: {
                categoryRef: {
                  name: "",
                },
                children: [],
                priority: 1,
                displayName: "Java",
                href: "https://ryanc.cc/categories/java",
                pageRef: {
                  name: "",
                },
                postRef: {
                  name: "",
                },
                tagRef: {
                  name: "",
                },
              },
            },
          ],
          priority: 0,
          displayName: "文章分类",
          href: "https://ryanc.cc/categories",
          pageRef: {
            name: "",
          },
          postRef: {
            name: "",
          },
          tagRef: {
            name: "",
          },
        },
      },
    ];
    expect(convertTreeToMenuItems(tree)).toMatchSnapshot();
  });

  describe("sortMenuItemsTree", () => {
    it("will match snapshot", () => {
      const tree: MenuTreeItem[] = [
        {
          apiVersion: "v1alpha1",
          kind: "MenuItem",
          metadata: {
            creationTimestamp: "2022-08-05T04:19:37.252228Z",
            name: "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
            version: 12,
          },
          spec: {
            categoryRef: {
              name: "",
            },
            children: [
              {
                apiVersion: "v1alpha1",
                kind: "MenuItem",
                metadata: {
                  creationTimestamp: "2022-07-28T06:50:32.777556Z",
                  name: "caeef383-3828-4039-9114-6f9ad3b4a37e",
                  version: 4,
                },
                spec: {
                  categoryRef: {
                    name: "",
                  },
                  children: [],
                  priority: 1,
                  displayName: "Halo",
                  href: "https://ryanc.cc/categories/halo",
                  pageRef: {
                    name: "",
                  },
                  postRef: {
                    name: "",
                  },
                  tagRef: {
                    name: "",
                  },
                },
              },
              {
                apiVersion: "v1alpha1",
                kind: "MenuItem",
                metadata: {
                  creationTimestamp: "2022-08-05T04:22:03.377364Z",
                  name: "ded1943d-9fdb-4563-83ee-2f04364872e0",
                  version: 0,
                },
                spec: {
                  categoryRef: {
                    name: "",
                  },
                  children: [],
                  priority: 0,
                  displayName: "Java",
                  href: "https://ryanc.cc/categories/java",
                  pageRef: {
                    name: "",
                  },
                  postRef: {
                    name: "",
                  },
                  tagRef: {
                    name: "",
                  },
                },
              },
            ],
            priority: 0,
            displayName: "文章分类",
            href: "https://ryanc.cc/categories",
            pageRef: {
              name: "",
            },
            postRef: {
              name: "",
            },
            tagRef: {
              name: "",
            },
          },
        },
      ];

      expect(sortMenuItemsTree(tree)).toMatchSnapshot();
    });
  });

  describe("resetMenuItemsTreePriority", () => {
    it("will match snapshot", function () {
      const tree: MenuTreeItem[] = [
        {
          apiVersion: "v1alpha1",
          kind: "MenuItem",
          metadata: {
            creationTimestamp: "2022-08-05T04:19:37.252228Z",
            name: "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
            version: 12,
          },
          spec: {
            categoryRef: {
              name: "",
            },
            children: [
              {
                apiVersion: "v1alpha1",
                kind: "MenuItem",
                metadata: {
                  creationTimestamp: "2022-07-28T06:50:32.777556Z",
                  name: "caeef383-3828-4039-9114-6f9ad3b4a37e",
                  version: 4,
                },
                spec: {
                  categoryRef: {
                    name: "",
                  },
                  children: [],
                  priority: 300,
                  displayName: "Halo",
                  href: "https://ryanc.cc/categories/halo",
                  pageRef: {
                    name: "",
                  },
                  postRef: {
                    name: "",
                  },
                  tagRef: {
                    name: "",
                  },
                },
              },
              {
                apiVersion: "v1alpha1",
                kind: "MenuItem",
                metadata: {
                  creationTimestamp: "2022-08-05T04:22:03.377364Z",
                  name: "ded1943d-9fdb-4563-83ee-2f04364872e0",
                  version: 0,
                },
                spec: {
                  categoryRef: {
                    name: "",
                  },
                  children: [],
                  priority: 10,
                  displayName: "Java",
                  href: "https://ryanc.cc/categories/java",
                  pageRef: {
                    name: "",
                  },
                  postRef: {
                    name: "",
                  },
                  tagRef: {
                    name: "",
                  },
                },
              },
            ],
            priority: 6,
            displayName: "文章分类",
            href: "https://ryanc.cc/categories",
            pageRef: {
              name: "",
            },
            postRef: {
              name: "",
            },
            tagRef: {
              name: "",
            },
          },
        },
      ];

      expect(resetMenuItemsTreePriority(tree)).toMatchSnapshot();
    });
  });
});
