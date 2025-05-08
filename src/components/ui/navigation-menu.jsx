import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef(
  function NavigationMenu({ className, children, ...props }, ref) {
    return (
      <nav
        ref={ref}
        className={cn(
          "bg-white shadow-sm border-r border-gray-200 min-h-screen flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef(
  function NavigationMenuList({ className, ...props }, ref) {
    return (
      <ul ref={ref} className={className} {...props} />
    );
  }
);
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef(
  function NavigationMenuTrigger({ className, children, ...props }, ref) {
    return (
      <button ref={ref} className={className} {...props}>
        {children}
      </button>
    );
  }
);
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef(
  function NavigationMenuContent({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef(
  function NavigationMenuViewport({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef(
  function NavigationMenuIndicator({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
