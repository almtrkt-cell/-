import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-colors duration-200 ease-wabel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [touch-action:manipulation] [-webkit-tap-highlight-color:transparent] [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-splash text-white hover:bg-splash-hover active:bg-splash-active shadow-soft",
        secondary:
          "bg-carbon text-cream hover:bg-carbon-50",
        outline:
          "border border-carbon/20 bg-transparent text-carbon hover:bg-carbon hover:text-cream",
        ghost: "bg-transparent text-carbon hover:bg-sand",
        link: "bg-transparent text-splash underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-12 px-7 py-3",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-9 text-lg",
        icon: "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
