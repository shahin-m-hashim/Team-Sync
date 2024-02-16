import "./globals.css";

function App() {
  return (
    <>
      <h1 className="text-red-500">{import.meta.env.VITE_APP_URL}</h1>
    </>
  );
}

export default App;
