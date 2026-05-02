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

export default function Header() {
  return (

    // z-10 absolute 
    <div className="text-mono flex flex-row w-full justify-between h-fit px-2 pb-2 py-auto items-end border-b-[0.5px]">
      <div className="w-10 h-10 ">
        <img src="logo.jpg" alt="" />
      </div>
      <div className="hidden md:block">
        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger>Markets</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>New Window</MenubarItem>
              </MenubarGroup>
              {/* <MenubarSeparator /> */}
              <MenubarGroup>
                <MenubarItem>Share</MenubarItem>
                <MenubarItem>Print</MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <Input className="hidden md:block"></Input>

      <div className="flex flex-row">
        <Button className="md:hidden bg-transparent">
          <CiSearch style={{ color: "black" }} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="outline">Open</Button> */}
            <Button className=" md:hidden bg-transparent">
              <RxHamburgerMenu style={{ color: "black" }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              <DropdownMenuItem>Market</DropdownMenuItem>
              {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button> Sign in</Button>
      </div>
    </div>
  );
}
