import { useRef } from 'react';

export default function HouseList({ houses, selected, onChoose, houseArt }) {
  const street = useRef(null);

  // Smooth scrolling (and turning it off for reduced motion) lives in index.css.
  function browse(distance) {
    street.current.scrollBy({ left: distance });
  }

  return (
    <section className="neighbourhood">
      <div className="street-heading">
        <h1>Houses we service</h1>
        <div className="browse-controls">
          <button type="button" onClick={() => browse(-360)} aria-label="Previous houses">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 3 5 10l7 7" /></svg>
          </button>
          <button type="button" onClick={() => browse(360)} aria-label="Next houses">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 3 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <ul className="street" ref={street}>
        {houses.map((house) => (
          <li key={house.id}>
            <button
              type="button"
              className="house-choice"
              aria-pressed={selected?.id === house.id}
              onClick={() => onChoose(house)}
            >
              <img src={houseArt[(house.id - 1) % houseArt.length]} alt="" width="144" height="120" />
              <strong>{house.owner_name}</strong>
              <span className="house-address">{house.address}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
