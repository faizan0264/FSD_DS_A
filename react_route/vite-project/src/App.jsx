import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>This Is My Home Page</h1>;
}

function About() {
  return <h1>This Is My About Us Page</h1>;
}

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About Us</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
