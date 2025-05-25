import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Lazy load of components
const HomePage = lazy(()=>import('./pages/homePage'))
function App() {
  return (
    <Router>
      <Suspense fallback={<div> Loading ..........</div>}>
         <Routes>
          <Route path="/" element={<HomePage/>}></Route>
         </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
