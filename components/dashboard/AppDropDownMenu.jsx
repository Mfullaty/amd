"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
  import { useRouter } from 'next/navigation';
  
  function AppDropDownMenu({ trigger, label = "Menu", menuItems = [] }) {
    const router = useRouter();
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
  
          {menuItems.map((item, index) => (
            <DropdownMenuItem
            className="cursor-pointer"
              key={index}
              onClick={() => {
                if (item.link) {
                  router.push(item.link); // Navigate if 'link' exists
                } else if (item.onClick) {
                  item.onClick(); // Execute onClick if 'link' doesn't exist
                }
              }}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  export default AppDropDownMenu;
  