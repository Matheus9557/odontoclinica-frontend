import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /*
         * 10% — COR DE DESTAQUE
         * Usado para ações principais.
         */
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

        /*
         * 30% — SUPERFÍCIES
         * Botão secundário, sem competir com o destaque.
         */
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        /*
         * 30% — SUPERFÍCIES
         * Botão discreto para ações menos importantes.
         */
        outline:
          "border border-border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",

        /*
         * 30% — SUPERFÍCIES
         * Ação de baixa ênfase.
         */
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",

        /*
         * 10% — DESTAQUE SEMÂNTICO
         * Mantém o verde para indicar sucesso.
         */
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700",

        /*
         * Estado de atenção.
         */
        warning:
          "bg-yellow-500 text-black shadow-sm hover:bg-yellow-600",

        /*
         * Estado destrutivo.
         */
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/50",

        /*
         * Link usa a cor principal do tema.
         */
        link:
          "text-primary underline-offset-4 hover:underline",
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
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }