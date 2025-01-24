import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import PatientCheckin from './components/PatientCheckin';
import PatientVisitList from './components/PatientVisitList';
import './styles/PatientForms.css';

function App() {
  return (
    <PatientProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PatientCheckin />} />
            <Route path="/visit-list" element={<PatientVisitList />} />
          </Routes>
        </div>
      </Router>
    </PatientProvider>
  );
}

export default App;
