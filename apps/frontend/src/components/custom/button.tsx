import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
    {
        variants: {
            variant: {
                primary:
                    "bg-[#3b82f6] text-[#f2feff] shadow-xs hover:bg-[#2563eb] dark:bg-[#3b82f6] dark:text-[#17162a] dark:hover:bg-[#2563eb]"
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded0md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },

    }
)

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    icon?: React.ReactElement;
    text: string;
}

function Button({
    className,
    variant,
    size,
    onClick,
    icon,
    text,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            onClick={onClick}
            {...props}
        >
            {icon && <span>{icon}</span>}
            <span>{text}</span>
        </button>
    )
}

export { Button, buttonVariants }