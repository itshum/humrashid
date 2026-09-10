import { CloudIcon, Code2Icon, LockIcon, MailIcon, ShieldIcon } from "lucide-react";
import type { Source } from "./data";

const sourceIcon: Record<Source, React.ComponentType<{ className?: string }>> = {
  aws: CloudIcon,
  okta: LockIcon,
  crowdstrike: ShieldIcon,
  github: Code2Icon,
  email: MailIcon,
};

export function SourceIcons({ sources }: { sources: Source[] }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {sources.map((source) => {
        const Icon = sourceIcon[source];
        return <Icon key={source} className="size-3.5" />;
      })}
    </div>
  );
}

export function SourceIcon({ source }: { source: Source }) {
  const Icon = sourceIcon[source];
  return <Icon className="size-3.5" />;
}
