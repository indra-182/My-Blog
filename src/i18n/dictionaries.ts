import id from "./messages/id.json";

export type Dictionary = typeof id;

export function getDictionary(): Dictionary {
  return id;
}
