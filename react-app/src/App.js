import './App.css';
import TitleBar from './components/TitleBar';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultTable from './components/ResultTable';

function App() {
  return (
    <div className="App">
      <TitleBar/>
      <InputForm/>
      <LoadingSpinner/>
      <ResultTable/>
    </div>
  );
}

export default App;
