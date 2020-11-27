import React from 'react'

import useSticky from "./hooks/useSticky.js"

import Welcome from "../components/Welcome.jsx"
import NavBar from "../components/NavBar.jsx"

function App() {
  const { isSticky, element } = useSticky()
  return (
    <div>
      <NavBar sticky={isSticky} />
      <Welcome element={element} />
    </div>
  )
}

export default App

// const { isSticky, element } = useSticky()

// class App extends React.Component {

//   constructor(props) {
//     super(props)
//   }

//   render() {

    

//     return (
//       <>
//         <NavBar sticky={isSticky} />
//         <Welcome element={element} />
//       </>
//     )
//   }


// }

// export default App