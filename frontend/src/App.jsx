import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleSearch = async (searchQuery) => {
    const currentQuery = searchQuery || query;
    if (!currentQuery) return; 
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery, top_k: 4 }) 
      });
      
      const data = await response.json();
      setResults(data); 

      if (!history.includes(currentQuery)) {
        const newHistory = [currentQuery, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      setResults({ error: "Failed to connect to the FastAPI backend." });
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#fff', padding: '3rem 2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 10px 0', background: 'linear-gradient(90deg, #E50914 0%, #FF6B6B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Content Discovery
          </h1>
          <p style={{ color: '#888', fontSize: '1.2rem', margin: 0 }}>Semantic Search & LLM Recommendations</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', backgroundColor: '#222', padding: '10px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Describe the movie you are in the mood for..."
            style={{ flex: 1, padding: '1rem 1.5rem', fontSize: '1.1rem', borderRadius: '8px', border: 'none', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none' }}
          />
          <button 
            onClick={() => handleSearch()} 
            disabled={isLoading} 
            style={{ padding: '0 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#E50914', color: 'white', border: 'none', borderRadius: '8px', cursor: isLoading ? 'wait' : 'pointer', transition: 'all 0.3s ease', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Searching Universe...' : 'Discover'}
          </button>
        </div>

        {/* Search History */}
        {history.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '3rem', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent:</span>
            {history.map((item, index) => (
              <button 
                key={index} 
                onClick={() => { setQuery(item); handleSearch(item); }}
                style={{ backgroundColor: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '20px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease' }}
                onMouseOver={(e) => { e.target.style.borderColor = '#E50914'; e.target.style.color = '#fff'; }}
                onMouseOut={(e) => { e.target.style.borderColor = '#444'; e.target.style.color = '#aaa'; }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#E50914' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(229,9,20,0.3)', borderTopColor: '#E50914', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results Area */}
        {results && !results.error && !isLoading && (
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            
            {/* AI Summary Banner */}
            <div style={{ backgroundColor: '#1a1a1a', borderLeft: '4px solid #E50914', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem', fontWeight: '600' }}>Why these movies?</h3>
              </div>
              <p style={{ margin: 0, color: '#bbb', lineHeight: '1.8', fontSize: '1.1rem' }}>{results.llm_summary}</p>
            </div>
            
            {/* Movie Grid */}
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Top Matches</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
              
              {results.recommendations.map((movie, index) => (
                <div key={index} style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease', border: '1px solid #2a2a2a' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.6)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  
                  {/* Card Header: Title and Match Score */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h4 style={{ margin: '0', fontSize: '1.3rem', color: '#fff', flex: 1, paddingRight: '10px', lineHeight: '1.3' }}>{movie.title}</h4>
                    <span style={{ color: '#46d369', fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: 'rgba(70, 211, 105, 0.1)', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                      {movie.relevance_score}% Match
                    </span>
                  </div>

                  {/* Movie Plot Snippet */}
                  <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {movie.overview ? (movie.overview.length > 130 ? movie.overview.substring(0, 130) + '...' : movie.overview) : 'No plot summary available.'}
                  </p>

                  {/* IMDb Button */}
                  <a 
                    href={`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'block', backgroundColor: '#F5C518', color: '#000', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#d4a810'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F5C518'}
                  >
                    View on IMDb
                  </a>
                </div>
              ))}
              
            </div>
          </div>
        )}

        {/* Error State */}
        {results && results.error && (
          <div style={{ backgroundColor: 'rgba(229,9,20,0.1)', border: '1px solid #E50914', padding: '1.5rem', color: '#ff4b4b', borderRadius: '12px', textAlign: 'center', marginTop: '2rem' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>Connection Error</strong>
            {results.error}
          </div>
        )}

      </div>
    </div>
  )
}

export default App