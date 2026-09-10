import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Case } from "./data";
import { Tip } from "./Tip";

export function AssigneeAvatar({ assignee }: { assignee: Case["assignee"] }) {
  return (
    <Tip label={assignee ? assignee.name : "Unassigned"}>
      <Avatar className="size-6">
        <AvatarFallback className="text-[10px]">
          {assignee ? assignee.initials : <UserIcon className="size-3 text-muted-foreground" />}
        </AvatarFallback>
      </Avatar>
    </Tip>
  );
}
