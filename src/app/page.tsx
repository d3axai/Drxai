'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav, type ToolId } from '@/components/app/sidebar-nav';
import { AvatarCreator } from '@/components/app/avatar-creator';
import { BackgroundReplacer } from '@/components/app/background-replacer';
import { StyleModifier } from '@/components/app/style-modifier';
import { BodyReshaper } from '@/components/app/body-reshaper';
import { VideoGenerator } from '@/components/app/video-generator';
import { Button } from '@/components/ui/button';
import { Github, Bot } from 'lucide-react';

const tools = {
  avatar: {
    component: AvatarCreator,
    title: 'AI Avatar Creator',
    description: 'Transform your photo into a professional avatar for any role.',
  },
  background: {
    component: BackgroundReplacer,
    title: 'AI Background Replacer',
    description: 'Replace the background of your photo with any scene you can imagine.',
  },
  style: {
    component: StyleModifier,
    title: 'AI Style Modifier',
    description: 'Change hairstyles and outfits in your photos with a simple text prompt.',
  },
  body: {
    component: BodyReshaper,
    title: 'AI Body Reshaping',
    description: 'Digitally reshape your body in photos, from slimming to adding muscle.',
  },
  video: {
    component: VideoGenerator,
    title: 'Image to Video',
    description: 'Animate your static images into dynamic videos with AI.',
  },
};

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>('avatar');

  const ActiveToolComponent = tools[activeTool].component;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Bot className="size-6" />
            </div>
            <h1 className="text-xl font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">AI Motion Muse</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav activeTool={activeTool} setActiveTool={setActiveTool} />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <a href="https://github.com/firebase/studio-examples" target="_blank" rel="noopener noreferrer">
              <Github />
              <span className="group-data-[collapsible=icon]:hidden">View on GitHub</span>
            </a>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col min-h-screen">
          <header className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold font-headline tracking-tight">{tools[activeTool].title}</h2>
              <p className="text-muted-foreground">{tools[activeTool].description}</p>
            </div>
            <SidebarTrigger className="md:hidden" />
          </header>
          <div className="flex-1 overflow-auto">
            <ActiveToolComponent />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
