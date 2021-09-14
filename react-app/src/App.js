import './App.css';
import TitleBar from './components/TitleBar';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <div className="App">
      <TitleBar/>
      <InputForm/>
      <LoadingSpinner/>
    </div>
  );
}

export default App;
