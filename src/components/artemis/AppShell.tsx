import { useState } from "react";
import {
  BinocularsIcon,
  BoxesIcon,
  CableIcon,
  ChevronDownIcon,
  FileSearchIcon,
  LayoutGridIcon,
  RadarIcon,
  SearchIcon,
  ShieldAlertIcon,
  TerminalIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tip } from "./Tip";
import { severityCounts, severityOrder, type Severity } from "./data";

const restNav = [
  { label: "Investigate", icon: FileSearchIcon },
  { label: "Threat hunting", icon: BinocularsIcon },
  { label: "Detections", icon: RadarIcon },
];

const severityFilterOptions: (Severity | "all")[] = ["all", ...severityOrder];
const severityFilterLabel: Record<Severity | "all", string> = {
  all: "All",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const platformNav = [
  { label: "Environment", icon: LayoutGridIcon },
  { label: "Query", icon: TerminalIcon },
  { label: "Connectors", icon: CableIcon },
  { label: "Sources", icon: BoxesIcon },
];

export function AppShell({
  children,
  severityFilter,
  onSelectSeverity,
}: {
  children: React.ReactNode;
  severityFilter: Severity | "all";
  onSelectSeverity: (s: Severity | "all") => void;
}) {
  const [casesExpanded, setCasesExpanded] = useState(true);

  return (
    <TooltipProvider delayDuration={200}>
    <SidebarProvider className="h-full min-h-0">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
              A
            </div>
            <div className="flex flex-1 flex-col leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">Artemis</span>
              <span className="text-xs text-sidebar-foreground/60">Cursor</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Detect &amp; respond</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={severityFilter === "all"}
                    tooltip="Cases"
                    className="pr-1.5"
                    onClick={() => onSelectSeverity("all")}
                  >
                    <ShieldAlertIcon />
                    <span className="flex-1">Cases</span>
                    <ChevronDownIcon
                      className={`size-3.5 shrink-0 text-sidebar-foreground/50 transition-transform ${casesExpanded ? "" : "-rotate-90"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCasesExpanded((v) => !v);
                      }}
                    />
                  </SidebarMenuButton>
                  {casesExpanded && (
                    <SidebarMenuSub>
                      {severityFilterOptions.map((s) => (
                        <SidebarMenuSubItem key={s}>
                          <SidebarMenuSubButton
                            isActive={severityFilter === s}
                            onClick={() => onSelectSeverity(s)}
                            className="cursor-pointer justify-between"
                          >
                            <span>{severityFilterLabel[s]}</span>
                            <span className="text-xs text-sidebar-foreground/50">
                              {(s === "all" ? severityCounts.all : severityCounts[s]).toLocaleString()}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
                {restNav.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {platformNav.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-7">
              <AvatarFallback className="text-[11px]">JP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">Jordan Park</span>
              <span className="text-xs text-sidebar-foreground/60">Security analyst</span>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <Tip label="Toggle sidebar">
            <SidebarTrigger className="shrink-0" />
          </Tip>
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cases, entities, IOCs..."
              className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  );
}
