import { useEffect, useState } from 'react';
import HouseList from './components/HouseList.jsx';
import VisitList from './components/VisitList.jsx';
import VisitForm from './components/VisitForm.jsx';
import pipe from './assets/pipe.svg';
import house1 from './assets/house-1.svg';
import house2 from './assets/house-2.svg';
import house3 from './assets/house-3.svg';
import house4 from './assets/house-4.svg';
import house5 from './assets/house-5.svg';
import house6 from './assets/house-6.svg';

const houseArt = [house1, house2, house3, house4, house5, house6];

export default function App() {
  const [houses, setHouses] = useState(null);
  const [selected, setSelected] = useState(null);
  const [visits, setVisits] = useState(null);
  const [clock, setClock] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function loadHouses() {
      try {
        const response = await fetch('/api/houses');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setHouses(data.houses);
        setClock({ today: data.today, currentHour: data.currentHour });
      } catch {
        setError('Could not load the houses. Check the server and database, then refresh the page.');
      }
    }
    loadHouses();
  }, []);

  useEffect(() => {
    if (!selected) return;
    async function loadVisits() {
      try {
        const response = await fetch(`/api/houses/${selected.id}/visits`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setVisits(data.visits);
        setClock({ today: data.today, currentHour: data.currentHour });
      } catch {
        setError('Could not load the visits. Check the server, then refresh the page.');
      }
    }
    loadVisits();
  }, [selected, refresh]);

  function chooseHouse(house) {
    setVisits(null);
    setSelected(house);
  }

  function saveDraft(visitId, draft) {
    setVisits((current) => {
      if (!current) return current;
      return current.map((visit) => (visit.id === visitId ? { ...visit, ...draft } : visit));
    });
  }

  return (
    <>
      <header className="brand">
        <a href="/">
          <img src={pipe} alt="" width="32" height="40" />
          <span>Super Sigma<br />Brothers</span>
        </a>
      </header>
      <main>
        {error && <p role="alert" className="connection-state">{error}</p>}
        {!houses && !error && <p className="connection-state">Loading the neighbourhood...</p>}
        {houses && houses.length === 0 && (
          <p className="connection-state">No houses yet. Run the seed SQL to set up the neighbourhood.</p>
        )}
        {houses && houses.length > 0 && (
          <HouseList houses={houses} selected={selected} onChoose={chooseHouse} houseArt={houseArt} />
        )}
        {selected && (
          <section className="workbench">
            <header className="active-house">
              <img src={houseArt[(selected.id - 1) % houseArt.length]} alt="" width="120" height="100" />
              <div>
                <h2>{selected.owner_name}</h2>
                <p>{selected.address}</p>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </div>
            </header>
            <div className="desk">
              <section className="visit-ledger">
                <h2>Service visits</h2>
                {visits ? (
                  <VisitList visits={visits} today={clock.today} house={selected} onDraftSaved={saveDraft} />
                ) : (
                  <p>Loading visits...</p>
                )}
              </section>
              <VisitForm
                key={selected.id}
                house={selected}
                today={clock.today}
                currentHour={clock.currentHour}
                onAdded={() => setRefresh(refresh + 1)}
              />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
