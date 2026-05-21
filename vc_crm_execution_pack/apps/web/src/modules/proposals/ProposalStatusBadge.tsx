import { Badge } from "../../components/ui/badge";
import type { ProposalStatus } from "./proposalData";

export function ProposalStatusBadge(props: { status: ProposalStatus }): JSX.Element {
  const variant =
    props.status === "APPROVED" || props.status === "WON"
      ? "success"
      : props.status === "REJECTED" || props.status === "LOST"
        ? "danger"
        : props.status === "SUBMITTED"
          ? "warning"
          : "muted";

  return <Badge variant={variant}>{props.status}</Badge>;
}
