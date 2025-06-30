import { publicRuntimeConfig } from "./next.config";

export const API = process.env.NEXT_PUBLIC_API;
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME
