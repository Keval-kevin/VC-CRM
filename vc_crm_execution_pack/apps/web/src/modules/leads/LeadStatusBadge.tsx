import { Badge } from "../../components/ui/badge";
import type { LeadStatus } from "./leadData";

export type LeadStatusBadgeProps = {
  status: LeadStatus;
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps): JSX.Element {
  const variant =
    status === "QUALIFIED" || status === "CONVERTED"
      ? "success"
      : status === "LOST" || status === "DISQUALIFIED"
        ? "danger"
        : status === "CONTACTED" || status === "NURTURING"
          ? "warning"
          : "default";

  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
