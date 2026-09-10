import { ShieldIcon } from "lucide-react";
import type { Source } from "./data";
import { Tip } from "./Tip";
import { AwsMark, GithubMark, GoogleMark, OktaMark, SlackMark } from "./BrandIcons";

// CrowdStrike has no accurate public mark available to embed here, so
// it keeps a generic shield rather than a faked logo.
const sourceIcon: Record<Source, React.ComponentType<{ className?: string }>> = {
  aws: AwsMark,
  okta: OktaMark,
  crowdstrike: ShieldIcon,
  github: GithubMark,
  email: GoogleMark,
  slack: SlackMark,
};

export const sourceLabel: Record<Source, string> = {
  aws: "AWS",
  okta: "Okta",
  crowdstrike: "CrowdStrike",
  github: "GitHub",
  email: "Google Workspace",
  slack: "Slack",
};

export function SourceIcons({ sources }: { sources: Source[] }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {sources.map((source) => {
        const Icon = sourceIcon[source];
        return (
          <Tip key={source} label={sourceLabel[source]}>
            <Icon className="size-3.5" />
          </Tip>
        );
      })}
    </div>
  );
}

export function SourceIcon({ source }: { source: Source }) {
  const Icon = sourceIcon[source];
  return <Icon className="size-3.5" />;
}
