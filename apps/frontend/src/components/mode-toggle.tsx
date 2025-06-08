import { Moon, Sun } from "lucide-react"

import { useTheme } from "./theme-provider"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (

        <div className="flex gap-4">

            <button className="border border-neutral-600 px-4 py-2 bg-zinc-200 rounded-lg" onClick={() => setTheme("light")}>
                Light
            </button>
            <button className="border border-neutral-600 px-4 py-2 bg-zinc-200 rounded-lg" onClick={() => setTheme("dark")}>
                Dark
            </button>
            <button className="border border-neutral-600 px-4 py-2 bg-zinc-200 rounded-lg" onClick={() => setTheme("system")}>
                System
            </button>
        </div>



    )
}