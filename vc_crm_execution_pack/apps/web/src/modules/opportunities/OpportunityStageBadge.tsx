import { Badge } from "../../components/ui/badge";
import type { OpportunityStage } from "./opportunityData";

const terminalStages: OpportunityStage[] = ["WON", "LOST"];

export function OpportunityStageBadge(props: { stage: OpportunityStage }): JSX.Element {
  const variant = props.stage === "WON" ? "success" : props.stage === "LOST" ? "danger" : "muted";

  return (
    <Badge variant={variant}>
      {terminalStages.includes(props.stage) ? props.stage : props.stage.replaceAll("_", " ")}
    </Badge>
  );
}
