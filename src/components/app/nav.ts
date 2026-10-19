import {
  LayoutDashboard, Building2, Users, Target, KanbanSquare, PhoneCall, CalendarDays, ListTodo,
  Grid3x3, Megaphone, Search, BadgeDollarSign, Share2, Radar, Handshake, Bot, BarChart3, Plug, Settings, FolderKanban,
  type LucideIcon,
} from "lucide-react";

export interface NavItem { to: string; label: string; icon: LucideIcon }
export interface NavGroup { label?: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { items: [{ to: "/", label: "Command Center", icon: LayoutDashboard }] },
  { label: "CRM", items: [
    { to: "/accounts", label: "Accounts", icon: Building2 },
    { to: "/contacts", label: "Contacts", icon: Users },
    { to: "/leads", label: "Leads", icon: Target },
    { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
    { to: "/projects", label: "Projects", icon: FolderKanban },
  ] },
  { label: "Activities", items: [
    { to: "/follow-ups", label: "Follow-ups", icon: PhoneCall },
    { to: "/meetings", label: "Meetings", icon: CalendarDays },
    { to: "/tasks", label: "Tasks", icon: ListTodo },
  ] },
  { label: "Growth", items: [
    { to: "/services", label: "Service Coverage", icon: Grid3x3 },
    { to: "/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/google-seo", label: "Google & SEO", icon: Search },
    { to: "/ads", label: "Ads", icon: BadgeDollarSign },
    { to: "/social", label: "Social Media", icon: Share2 },
  ] },
  { label: "Acquisition", items: [
    { to: "/lead-campaigns", label: "Lead Campaigns", icon: Radar },
    { to: "/referrals", label: "Referral Partners", icon: Handshake },
  ] },
  { label: "Workspace", items: [
    { to: "/copilot", label: "Apex Copilot", icon: Bot },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/connections", label: "Connections", icon: Plug },
    { to: "/settings", label: "Settings", icon: Settings },
  ] },
];
