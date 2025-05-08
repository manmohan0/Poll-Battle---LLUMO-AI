import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { Addquestion } from './pages/Addquestion'
import { ShowPole } from './pages/ShowPole'

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/room/:roomId/Addquestion' element={<Addquestion/>}/>
        <Route path='/room/:roomId' element={<ShowPole/>}/>
      </Routes>
  </>
  )
}

export default App
