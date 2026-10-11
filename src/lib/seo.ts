export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} · Apex Growth OS` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Apex Growth OS` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ],
});
