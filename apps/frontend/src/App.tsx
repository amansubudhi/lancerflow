import { Routes } from 'react-router'
import './App.css'
import { Route } from 'react-router'
import Client from './pages/Client'
import { ModeToggle } from './components/mode-toggle'
import AddClient from './pages/AddClient'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

function App() {

  return (
    <div className='min-h-screen w-full light:bg-zinc-200 dark:bg-zinc-700'>
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="clients" element={<Client />} />
        <Route path="add-client" element={<AddClient />} />
      </Routes>
      <ModeToggle />
    </div>
  )
}

export default App
