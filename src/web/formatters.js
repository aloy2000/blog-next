export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  })
    .format(date)
    // Because https://github.com/nodejs/node/issues/24674
    .replace(/\s/g, " ")
