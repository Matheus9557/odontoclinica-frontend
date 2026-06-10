import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-blue-600 text-white shadow hover:bg-blue-700",
            success: "bg-green-600 text-white shadow hover:bg-green-700",
            warning: "bg-yellow-500 text-black shadow hover:bg-yellow-600",
            destructive: "bg-destructive text-white shadow hover:bg-destructive/90 focus-visible:ring-destructive/50",
            outline: "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-blue-600 underline-offset-4 hover:underline",
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-6 text-base",
            icon: "h-9 w-9",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (_jsx(Comp, { "data-slot": "button", className: cn(buttonVariants({ variant, size, className })), ...props }));
}
export { Button, buttonVariants };
