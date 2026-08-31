import dictionary from "@/i18n/messages/id.json";
import { RouteState } from "@/components/route-state";

export default function NotFound() {
  return (
    <RouteState
      code="404"
      title={dictionary.errors.pageNotFoundTitle}
      description={dictionary.errors.pageNotFoundDescription}
      linkLabel={dictionary.errors.home}
    />
  );
}
