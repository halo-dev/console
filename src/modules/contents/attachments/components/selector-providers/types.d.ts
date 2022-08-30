import type { Attachment } from "@halo-dev/api-client";
export type AttachmentLike =
  | Attachment
  | string
  | {
      url: string;
      type: string;
    };
