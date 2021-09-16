import './App.css';
import TitleBar from './components/TitleBar';
import InputForm from './components/InputForm';
import ResultSection from './components/ResultSection';

function App() {
  return (
    <div className="App">
      <TitleBar/>
      <InputForm/>
      <ResultSection/>
    </div>
  );
}

export default App;
