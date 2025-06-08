import './App.css'
import { ModeToggle } from './components/mode-toggle'

function App() {

  return (

    <div className='min-h-screen w-full light:bg-zinc-200 dark:bg-zinc-700'>
      <button className='bg-primary text-primary-foreground dark:bg-secondary px-4 py-2 rounded'>
        My Blue button
      </button>
      <ModeToggle />
    </div>
  )
}

export default App
