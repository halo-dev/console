import { describe, expect, it } from "vitest";
import { buildMenuItemsTree, convertTreeToMenuItems } from "../index";

describe("buildMenuItemsTree", () => {
  it("will match snapshot", () => {
    const rawMenuItems = [
      {
        spec: {
          displayName: "文章分类",
          href: "https://ryanc.cc/categories",
          children: [
            "caeef383-3828-4039-9114-6f9ad3b4a37e",
            "ded1943d-9fdb-4563-83ee-2f04364872e0",
          ],
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
    // @ts-ignore
    expect(buildMenuItemsTree(rawMenuItems)).toMatchInlineSnapshot(`
      [
        {
          "apiVersion": "v1alpha1",
          "kind": "MenuItem",
          "metadata": {
            "creationTimestamp": "2022-08-05T04:19:37.252228Z",
            "name": "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
            "version": 12,
          },
          "spec": {
            "categoryRef": {
              "name": "",
            },
            "children": [
              {
                "apiVersion": "v1alpha1",
                "kind": "MenuItem",
                "metadata": {
                  "creationTimestamp": "2022-07-28T06:50:32.777556Z",
                  "name": "caeef383-3828-4039-9114-6f9ad3b4a37e",
                  "version": 4,
                },
                "spec": {
                  "categoryRef": {
                    "name": "",
                  },
                  "children": [],
                  "displayName": "Halo",
                  "href": "https://ryanc.cc/categories/halo",
                  "pageRef": {
                    "name": "",
                  },
                  "postRef": {
                    "name": "",
                  },
                  "tagRef": {
                    "name": "",
                  },
                },
              },
              {
                "apiVersion": "v1alpha1",
                "kind": "MenuItem",
                "metadata": {
                  "creationTimestamp": "2022-08-05T04:22:03.377364Z",
                  "name": "ded1943d-9fdb-4563-83ee-2f04364872e0",
                  "version": 1,
                },
                "spec": {
                  "categoryRef": {
                    "name": "",
                  },
                  "children": [],
                  "displayName": "Java",
                  "href": "https://ryanc.cc/categories/java",
                  "pageRef": {
                    "name": "",
                  },
                  "postRef": {
                    "name": "",
                  },
                  "tagRef": {
                    "name": "",
                  },
                },
              },
            ],
            "displayName": "文章分类",
            "href": "https://ryanc.cc/categories",
            "pageRef": {
              "name": "",
            },
            "postRef": {
              "name": "",
            },
            "tagRef": {
              "name": "",
            },
          },
        },
      ]
    `);
  });
});

describe("convertTreeToMenuItems", () => {
  it("will match snapshot", function () {
    const tree = [
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

    expect(convertTreeToMenuItems(tree)).toMatchInlineSnapshot(`
      [
        {
          "apiVersion": "v1alpha1",
          "kind": "MenuItem",
          "metadata": {
            "creationTimestamp": "2022-08-05T04:19:37.252228Z",
            "name": "40e4ba86-5c7e-43c2-b4c0-cee376d26564",
            "version": 12,
          },
          "spec": {
            "categoryRef": {
              "name": "",
            },
            "children": [
              "caeef383-3828-4039-9114-6f9ad3b4a37e",
              "ded1943d-9fdb-4563-83ee-2f04364872e0",
            ],
            "displayName": "文章分类",
            "href": "https://ryanc.cc/categories",
            "pageRef": {
              "name": "",
            },
            "postRef": {
              "name": "",
            },
            "tagRef": {
              "name": "",
            },
          },
        },
        {
          "apiVersion": "v1alpha1",
          "kind": "MenuItem",
          "metadata": {
            "creationTimestamp": "2022-07-28T06:50:32.777556Z",
            "name": "caeef383-3828-4039-9114-6f9ad3b4a37e",
            "version": 4,
          },
          "spec": {
            "categoryRef": {
              "name": "",
            },
            "children": [],
            "displayName": "Halo",
            "href": "https://ryanc.cc/categories/halo",
            "pageRef": {
              "name": "",
            },
            "postRef": {
              "name": "",
            },
            "tagRef": {
              "name": "",
            },
          },
        },
        {
          "apiVersion": "v1alpha1",
          "kind": "MenuItem",
          "metadata": {
            "creationTimestamp": "2022-08-05T04:22:03.377364Z",
            "name": "ded1943d-9fdb-4563-83ee-2f04364872e0",
            "version": 1,
          },
          "spec": {
            "categoryRef": {
              "name": "",
            },
            "children": [],
            "displayName": "Java",
            "href": "https://ryanc.cc/categories/java",
            "pageRef": {
              "name": "",
            },
            "postRef": {
              "name": "",
            },
            "tagRef": {
              "name": "",
            },
          },
        },
      ]
    `);
  });
});
