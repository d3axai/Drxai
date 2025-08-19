'use client';
import type { Dispatch, SetStateAction } from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { User, ImagePlay, Wand2, Dumbbell, Clapperboard } from 'lucide-react';

const menuItems = [
  { id: 'avatar', label: 'Avatar Creator', icon: User },
  { id: 'background', label: 'Background Replacer', icon: ImagePlay },
  { id: 'style', label: 'Style Modifier', icon: Wand2 },
  { id: 'body', label: 'Body Reshaping', icon: Dumbbell },
  { id: 'video', label: 'Image to Video', icon: Clapperboard },
];

export type ToolId = 'avatar' | 'background' | 'style' | 'body' | 'video';

interface SidebarNavProps {
  activeTool: ToolId;
  setActiveTool: Dispatch<SetStateAction<ToolId>>;
}

export function SidebarNav({ activeTool, setActiveTool }: SidebarNavProps) {
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => setActiveTool(item.id as ToolId)}
            isActive={activeTool === item.id}
            tooltip={item.label}
          >
            <item.icon className="shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
