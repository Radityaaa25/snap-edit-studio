import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-primary-foreground font-display font-bold tracking-wide shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)] hover:shadow-[0_0_30px_hsl(var(--neon-pink)/0.7)] hover:scale-105 active:scale-95",
        capture: "bg-gradient-to-r from-neon-pink to-neon-purple text-primary-foreground font-display font-bold tracking-wider text-xl py-6 px-10 rounded-full shadow-[0_0_30px_hsl(var(--neon-pink)/0.6)] hover:shadow-[0_0_50px_hsl(var(--neon-pink)/0.8)] hover:scale-105 active:scale-95 glow-pulse",
        glass: "glass-panel text-foreground hover:bg-muted/50 border-border/50",
        cyan: "bg-secondary text-secondary-foreground font-display font-semibold shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)] hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.7)] hover:scale-105",
        accent: "bg-accent text-accent-foreground font-display font-semibold shadow-[0_0_15px_hsl(var(--neon-yellow)/0.5)] hover:shadow-[0_0_25px_hsl(var(--neon-yellow)/0.7)] hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
