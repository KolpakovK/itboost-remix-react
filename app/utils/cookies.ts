// app/utils/cookies.js

import { createCookie } from "@remix-run/node"; // или @remix-run/server-runtime

export const userCookie = createCookie("user", {
  maxAge: 60 * 60 * 24 * 7, // cookie будет жить 7 дней
  httpOnly: true,
  secure: true,
  secrets: ["s3cret1"],
});