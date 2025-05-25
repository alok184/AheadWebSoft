import './homePage.css';
import { useState, useEffect, useRef } from 'react';
import { FaHome, FaMicrophone, FaSearch } from 'react-icons/fa';
import TrueEsimate from '../assets/TrueEsimate_image.png';
// Define approximate boundaries for UAE emirates
const emiratesBoundaries = {
  'Dubai': { minLat: 24.8, maxLat: 25.5, minLng: 55.0, maxLng: 56.0 },
  'Abu Dhabi': { minLat: 23.5, maxLat: 24.8, minLng: 53.0, maxLng: 55.0 },
  'Sharjah': { minLat: 25.0, maxLat: 25.5, minLng: 55.3, maxLng: 56.0 },
  'Ajman': { minLat: 25.3, maxLat: 25.5, minLng: 55.4, maxLng: 55.6 },
  'Umm Al Quwain': { minLat: 25.4, maxLat: 25.7, minLng: 55.5, maxLng: 55.8 },
  'Ras Al Khaimah': { minLat: 25.5, maxLat: 26.0, minLng: 55.8, maxLng: 56.2 },
  'Fujairah': { minLat: 25.0, maxLat: 25.5, minLng: 56.0, maxLng: 56.5 }
};
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('All');
  const cardRef = useRef(null);

  // Check if location is within an emirate's boundaries
  const getEmirateFromLocation = (lat, lng) => {
    for (const [emirate, bounds] of Object.entries(emiratesBoundaries)) {
      if (lat >= bounds.minLat && lat <= bounds.maxLat && 
          lng >= bounds.minLng && lng <= bounds.maxLng) {
        return emirate;
      }
    }
    return 'Other';
  };

  const scroll = (direction) => {
    const { current } = cardRef;
    const scrollAmount = 300;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  // aysnc function for get the data and using fecth method
  const GetData = async (search = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/properties?search=${search}`);
      const result = await res.json();
      
      // Add emirate information to each project
      const projectsWithEmirates = result.map((item) => ({
        ...item,
        currentImageIndex: 0,
        emirate: item.location ? getEmirateFromLocation(item.location.lat, item.location.lng) : 'Unknown'
      }));
      
      setProjects(projectsWithEmirates);
      setFilteredProjects(projectsWithEmirates); // Initially show all projects
    } catch (err) {
      console.log('Error fetching data:', err);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by selected emirate
  useEffect(() => {
    if (region === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.emirate === region));
    }
  }, [region, projects]);
   // handle search
  const handleSearch = () => {
    const searchValue = `${searchTerm}`.trim();
    GetData(searchValue);
  };
    // formate of price 
  const formatPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${Math.round(price / 1000)}K`;
    return price;
  };
  // find out the week according to date
  const getWeeksAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - postedDate;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    return `${diffInWeeks}w ago`;
  };
  //  handle image inside card 
  const handleImageSwap = (index, direction) => {
    setFilteredProjects((prevProjects) =>
      prevProjects.map((project, i) => {
        if (i === index) {
          const total = project.images.length;
          let newIndex =
            direction === 'left'
              ? (project.currentImageIndex - 1 + total) % total
              : (project.currentImageIndex + 1) % total;
          return { ...project, currentImageIndex: newIndex };
        }
        return project;
      })
    );
  };
  // life cycle of react app
  useEffect(() => {
    GetData();
  }, []);
  // using delayDebounce for optimze the search 
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) GetData(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="main_conatiner">
      {/* Hero Section (unchanged) */}
      <div className="hero-section">
        <div className="overlay">
          <div className="hero-content">
            <h1>Find Real Estate and Get Your Dream Space</h1>
            <p>
              We are a real estate agency that will help you find the best
              residence you dream of. Let’s discuss for your dream house!
            </p>
            <div className="search-container">
              <div className="tab-toggle">
                <button
                  className={activeTab === 'buy' ? 'active' : ''}
                  onClick={() => setActiveTab('buy')}
                >
                  Buy
                </button>
                <button
                  className={activeTab === 'rent' ? 'active' : ''}
                  onClick={() => setActiveTab('rent')}
                >
                  Rent
                </button>
              </div>
              <div className="search-bar">
                <div className="property-type">
                  <FaHome className="icon" />
                  <select>
                    <option>Property type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Search by location or Property ID..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaMicrophone className="icon mic" />
                <button className="search-btn" onClick={handleSearch}>
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... */}
        <div className="poster_container">
        <img src={TrueEsimate} alt="Poster" className="poster" />
        <img src={TrueEsimate} alt="Poster" className="poster" />
        <img src={TrueEsimate} alt="Poster" className="poster" />
      </div>
      {/* Projects Carousel */}
      <div className="projects-container">
        <h2 className="section-title">Browse New Projects in the UAE</h2>
        <div className="region-tabs">
          {['All', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'].map((emirate) => (
            <button
              key={emirate}
              className={region === emirate ? 'active' : ''}
              onClick={() => setRegion(emirate)}
            >
              {emirate}
            </button>
          ))}
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-btn left" onClick={() => scroll('left')}>
            &#10094;
          </button>

          <div className="card-wrapper" ref={cardRef}>
            {loading ? (
              <p className="loading-msg">Loading Projects ......</p>
            ) : filteredProjects.length === 0 ? (
              <p className="no-data-msg">No Projects Found in {region}</p>
            ) : (
              filteredProjects.map((item, index) => (
                <div key={index} className="card">
                  <div className="image-wrapper">
                    <span className="verified">Verified</span>
                    <img
                      src={
                        item.images[item.currentImageIndex] ||
                        'https://via.placeholder.com/300x180'
                      }
                      alt="Property"
                      className="image"
                    />
                    <div className="image-controls">
                      <button onClick={() => handleImageSwap(index, 'left')}>
                        &#10094;
                      </button>
                      <button onClick={() => handleImageSwap(index, 'right')}>
                        &#10095;
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{item.address}</h3>
                    <p className="price">AED {formatPrice(item.price)}</p>
                    <div className="features">
                      <span>{item.condition}</span>
                      <span>• {item.type}</span>
                      <span>• {item.emirate}</span> {/* Show emirate */}
                    </div>
                    <p className="dealer">
                      Dealer: {getWeeksAgo(item.posted)} <br />{' '}
                      {item.seller?.name || 'EMAAR Realtors'}
                    </p>
                    <p className="location">{item.address}</p>
                    <div className="actions">
                      <span>♡</span>
                      <span>🔄</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="carousel-btn right" onClick={() => scroll('right')}>
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;