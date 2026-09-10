import { CloudIcon, Code2Icon, HashIcon, LockIcon, MailIcon, ShieldIcon } from "lucide-react";
import type { Source } from "./data";
import { Tip } from "./Tip";

const sourceIcon: Record<Source, React.ComponentType<{ className?: string }>> = {
  aws: CloudIcon,
  okta: LockIcon,
  crowdstrike: ShieldIcon,
  github: Code2Icon,
  email: MailIcon,
  slack: HashIcon,
};

export const sourceLabel: Record<Source, string> = {
  aws: "AWS",
  okta: "Okta",
  crowdstrike: "CrowdStrike",
  github: "GitHub",
  email: "Email",
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
