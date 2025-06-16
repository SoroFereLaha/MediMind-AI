
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { getNavigationItems, getFooterNavigationItems, type NavItem } from '@/components/navigation-items';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAppContext } from '@/contexts/app-context';
import { RoleSelector } from '@/components/auth/role-selector';

function Logo() {
  const logoText = "MediMind IA";
  const { userRole } = useAppContext();
  const homeHref = userRole === 'medecin' ? '/medecin' : '/';

  return (
    <Link href={homeHref} className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
        <path d="M12 2a10 10 0 0 0-9.95 9.095C2.01 13.998 2 14.498 2 15c0 4.418 4.03 8 9 8s9-3.582 9-8c0-.502-.01-1.002-.05-1.905A10 10 0 0 0 12 2Z"/>
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/>
        <path d="M12 6v2"/>
        <path d="M12 16v2"/>
        <path d="m16.5 8.5-.707-.707"/>
        <path d="m8.207 15.793-.707-.707"/>
        <path d="m16.5 15.5-.707.707"/>
        <path d="m8.207 8.207-.707.707"/>
      </svg>
      <span>{logoText}</span>
    </Link>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  let isActive;
  // For exact match on root, ensure it's truly the root or the role-specific root
  if (item.href === '/' || item.href === '/medecin') {
     isActive = pathname === item.href;
  } else {
    isActive = pathname.startsWith(item.href);
  }


  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ConditionalMobileHeader() {
  const sidebarContext = useSidebar();
  const isMobile = sidebarContext.isMobile; 

  const [clientIsReady, setClientIsReady] = React.useState(false);
  React.useEffect(() => {
    setClientIsReady(true);
  }, []);

  if (!clientIsReady || typeof isMobile === 'undefined') {
    return null;
  }

  if (!isMobile) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
      <Logo />
      <SidebarTrigger asChild>
         <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
      </SidebarTrigger>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { userRole, setUserRole } = useAppContext();
  
  const navigationItems = getNavigationItems(userRole);
  const footerNavigationItems = getFooterNavigationItems(userRole);

  const footerSlogan = "Votre santé, comprise.";
  const footerRights = `© ${new Date().getFullYear()} MediMind IA. Tous droits réservés. Confidentialité des données assurée.`;

  const handleLogout = () => {
    setUserRole(null);
    // Potentially redirect to home or login page
  };

  if (!userRole) {
    return <RoleSelector />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
           <div className="flex items-center justify-between">
            <Logo />
            <SidebarTrigger className="hidden group-data-[collapsible=icon]:flex" />
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-grow">
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-4 space-y-2">
          <SidebarMenu>
            {footerNavigationItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Changer de rôle / Déconnexion">
                  <LogOut />
                  <span>Changer de Rôle</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center justify-center gap-x-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-y-2 group-data-[collapsible=icon]:px-0 px-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden text-center pt-2">
            {footerSlogan}
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ConditionalMobileHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            {footerRights}
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
