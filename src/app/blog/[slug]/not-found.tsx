import dictionary from "@/i18n/messages/id.json";
import { RouteState } from "@/components/route-state";

export default function ArticleNotFound() {
  return (
    <RouteState
      code="404"
      title={dictionary.errors.notFoundTitle}
      description={dictionary.errors.notFoundDescription}
      linkLabel={dictionary.article.backToBlog}
    />
  );
}
