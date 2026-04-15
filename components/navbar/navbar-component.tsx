"use client"

import { MenuIcon, SearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Logo from "@/components/navbar/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const pathname = usePathname()
  const leftItems = navigationData.slice(0, 2)
  const rightItems = navigationData.slice(2)

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground md:justify-center lg:gap-16">
          {leftItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "hover:text-primary max-md:hidden",
                isActiveLink(item.href) &&
                  "text-foreground underline underline-offset-6"
              )}
            >
              {item.title}
            </Link>
          ))}
          <Link href="#">
            <Logo className="gap-3 text-foreground" />
          </Link>
          {rightItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "hover:text-primary max-md:hidden",
                isActiveLink(item.href) &&
                  "text-foreground underline underline-offset-6"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full",
                        isActiveLink(item.href) &&
                          "text-foreground underline underline-offset-4"
                      )}
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar
