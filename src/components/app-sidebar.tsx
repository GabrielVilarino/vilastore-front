import { ChartColumnIncreasing, Home, Package, PackageSearch, PackageCheck, ChevronDown, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

import Image from "next/image"

// Menu items.
const items = [
  {
    title: "DashBoard",
    url: "/dashboard",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Estoque",
    url: "#",
    icon: PackageCheck,
    subItems: [
      { title: "Itens Em Estoque", url: "/estoque", icon: Package },
      { title: "Entrada e Saída", url: "/controle", icon: PackageSearch },
    ],
  },
]

export function AppSidebar() {

  function handleLogout() {
    // Apaga cookie 'usuario'
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Apaga cookie 'senha'
    document.cookie = "senha=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center p-4">
          {/* <h1 className="text-lg font-bold">Gerenciamento de Estoque</h1> */}
          <Image 
            src="/logo.png"
            width={100}
            height={100}
            alt="Logo"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) =>
              item.subItems ? (
                <SidebarMenuItem key={item.title}>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 mt-1 flex flex-col gap-1">
                      {item.subItems.map((sub) => (
                        <SidebarMenuButton
                          key={sub.title}
                          asChild
                          className="text-sm pl-6 hover:text-primary"
                        >
                          <a href={sub.url} className="flex items-center gap-2">
                            <sub.icon className="w-4 h-4" />
                            <span>{sub.title}</span>
                          </a>
                        </SidebarMenuButton>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuButton asChild>
              <a href="/" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </a>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}