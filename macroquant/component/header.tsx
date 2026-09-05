import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarShortcut,
  MenubarSeparator,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Header() {
  return (
    <div className=" sticky top-0 z-50 flex flex-row w-full justify-between h-fit px-4 sm:px-8 lg:px-10 py-3 items-end border-b bg-white">
      <div className="w-fit h-10 flex flex-row items-center gap-2">
        <img src="logo.jpg" alt="logo.jpg" className="h-8 w-8 shrink-0 object-contain" />
        <p className="mt-auto">Orthongonal View</p>
      </div>
      {/* <div className="block">
        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger>Orthongonal View</MenubarTrigger>
            <MenubarContent>
              {/* <MenubarGroup>
                <MenubarItem>New Window</MenubarItem>
              </MenubarGroup>
              {/* <MenubarSeparator /> */}
              {/* <MenubarGroup>
                <MenubarItem>Share</MenubarItem>
                <MenubarItem>Print</MenubarItem>
              </MenubarGroup> */} 
            {/* </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div> */} 

      {/* <Input className="hidden md:block"></Input> */}

      <div className="font-ibm-mono flex flex-row md:hidden">
        {/* <Button className="md:hidden bg-transparent">
          <CiSearch style={{ color: "black" }} />
        </Button> */}

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <RxHamburgerMenu></RxHamburgerMenu>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/positioning">Positioning</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/methodology">Methodology</Link>
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* <Button> Sign in</Button> */}
      </div>

      <div className="hidden md:flex flex-row items-center gap-8 ml-auto font-ibm-sans">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/positioning">Positioning</Link>
        <Link href="/methodology">Methodology</Link>
      </div>
    </div>
  );
}
