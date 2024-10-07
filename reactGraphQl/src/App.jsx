import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(()=>{
    fetch('http://localhost:4000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          personCount 
        }
      `})
    })
    .then(res => res.json())
    .then(res => console.log({res: res.data}))
  },[])
  return (
    <div className="App">
      <h1> React + GraphQL</h1>
      <div className="card">
        <button onClick={()=>{}}>
          click me 
        </button>
       
      </div>
      
    </div>
  )
}

export default App
