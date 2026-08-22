const formatters = {
  long: new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }),
  medium: new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }),
};

export type DateFormatStyle = keyof typeof formatters;

export function formatDate(date: string, style: DateFormatStyle = "medium") {
  return formatters[style].format(new Date(date));
}
