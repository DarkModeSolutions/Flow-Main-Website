import { Prisma } from "@prisma/client";

// Get Payloads from DB
// export type ProductRequestWithIncludes = Prisma.ProductsGetPayload<{
//   select: {
//     description: true;
//   };
// }>;

export type UserDetailsWithIncludes = Prisma.UserGetPayload<{
  omit: {
    createdAt: true;
    updatedAt: true;
    password: true;
  };
}>;

// Custom Types

export interface RequestType {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}

export type RegisterUserResponse = {
  message: string;
  user?: UserDetailsWithIncludes | null;
  tag?: string;
};

export type RegisterResult =
  | { success: true; user: UserDetailsWithIncludes }
  | { success: "tagged"; tag: "set-password" }
  | { success: false; error: string }
  | null;
