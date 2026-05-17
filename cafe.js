const { useState, useEffect, useRef } = React;

const cafes = [
  {
    name: 'Al reef',
    tags: ['cozy', 'quiet', 'study'],
    description: 'Warm lighting, comfy seats, and space to focus with a calm atmosphere.'
  },
  {
    name: 'Qahwat Shams',
    tags: ['modern', 'normal', 'work'],
    description: 'A sleek spot with plenty of outlets and soft background music.'
  },
  {
    name: 'Kewnara',
    tags: ['artsy', 'lively', 'meet'],
    description: 'Creative decor and a social vibe perfect for conversations and people watching.'
  },
  {
    name: 'Brewed Coffee House',
    tags: ['cozy', 'quiet', 'study'],
    description: 'Low noise, minimal distractions, and long tables for laptop sessions.'
  },
  {
    name: 'Mela Cafe',
    tags: ['modern', 'lively', 'chill'],
    description: 'A bright, upbeat space for coffee, snacks, and relaxed hangouts.'
  },
  {
    name: 'Kolani 21',
    tags: ['artsy', 'normal', 'chill'],
    description: 'Laid-back creativity with art-covered walls and comfortable seating.'
  }
];

function CafeFinder() {
  const [vibe, setVibe] = useState('');
  const [noise, setNoise] = useState('');
  const [purpose, setPurpose] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentCafe, setCurrentCafe] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [isFromQuiz, setIsFromQuiz] = useState(false);
  const [matched, setMatched] = useState('');
  const [recommend, setRecommend] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState({});
  const resultRef = useRef(null);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('cafeReviews') || '{}');
    setReviews(storedReviews);
  }, []);

  useEffect(() => {
    if (showResults && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  const getRecommendations = (vibe, noise, purpose) => {
    return cafes.filter(cafe => {
      const matchVibe = cafe.tags.includes(vibe);
      const matchNoise = cafe.tags.includes(noise);
      const matchPurpose = cafe.tags.includes(purpose);
      return matchVibe + matchNoise + matchPurpose >= 2;
    });
  };

  const searchCafes = (query) => {
    if (!query.trim()) return [];
    return cafes.filter(cafe =>
      cafe.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleFind = () => {
    if (!vibe || !noise || !purpose) {
      alert('Please choose one answer for each question.');
      return;
    }
    const recs = getRecommendations(vibe, noise, purpose);
    setRecommendations(recs);
    setSummary(`You chose ${vibe}, ${noise} noise, and ${purpose}. Here are cafes that fit your mood.`);
    setShowResults(true);
    setShowReview(false);
    setIsFromQuiz(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a cafe name to search.');
      return;
    }
    const results = searchCafes(searchQuery);
    setRecommendations(results);
    setSummary(`Search results for "${searchQuery}":`);
    setShowResults(true);
    setShowReview(false);
    setIsFromQuiz(false);
  };

  const handleReset = () => {
    setVibe('');
    setNoise('');
    setPurpose('');
    setSearchQuery('');
    setShowResults(false);
    setShowReview(false);
  };

  const handleReviewClick = (cafeName) => {
    setCurrentCafe(cafeName);
    setShowReview(true);
    setMatched('');
    setRecommend('');
    setComment('');
  };

  const handleSubmitReview = () => {
    if (isFromQuiz && (!matched || !recommend)) {
      alert('Please answer both questions before submitting your review.');
      return;
    }
    if (!isFromQuiz && !comment) {
      alert('Please share your thoughts about this cafe.');
      return;
    }
    const review = {
      matched: matched || null,
      recommend: recommend || null,
      comment
    };
    const newReviews = { ...reviews };
    if (!newReviews[currentCafe]) {
      newReviews[currentCafe] = [];
    }
    newReviews[currentCafe].push(review);
    setReviews(newReviews);
    localStorage.setItem('cafeReviews', JSON.stringify(newReviews));
    setMatched('');
    setRecommend('');
    setComment('');
    alert('Thank you for your review!');
  };

  const displayReviews = (cafeName) => {
    return reviews[cafeName] || [];
  };

  return (
    <main className="page">
      <section className="hero">
        <p>Find the best cafe for your next visit.</p>
        <h1>Cafe Finder Quiz</h1>
        <p>Answer a few quick questions about vibe, noise, and what you want to do. We’ll recommend cafes that match your mood.</p>
      </section>

      <section className="search-section">
        <h2>Or search for a specific cafe</h2>
        <input
          type="text"
          placeholder="Type cafe name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="button" onClick={handleSearch}>Search</button>
      </section>

      <section className="quiz-card">
        <div className="question">
          <h2>1. What kind of vibe are you looking for?</h2>
          <div className="options">
            {['cozy', 'modern', 'artsy'].map(v => (
              <label key={v} className="option">
                <input type="radio" name="vibe" value={v} checked={vibe === v} onChange={(e) => setVibe(e.target.value)} />
                <span className="option-label">{v === 'cozy' ? 'Cozy & warm' : v === 'modern' ? 'Modern & bright' : 'Artsy & relaxed'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="question">
          <h2>2. What noise level do you prefer?</h2>
          <div className="options">
            {['quiet', 'normal', 'lively'].map(n => (
              <label key={n} className="option">
                <input type="radio" name="noise" value={n} checked={noise === n} onChange={(e) => setNoise(e.target.value)} />
                <span className="option-label">{n === 'quiet' ? 'Quiet' : n === 'normal' ? 'Average cafe buzz' : 'Lively & social'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="question">
          <h2>3. What do you plan to do there?</h2>
          <div className="options">
            {['study', 'chill', 'meet'].map(p => (
              <label key={p} className="option">
                <input type="radio" name="purpose" value={p} checked={purpose === p} onChange={(e) => setPurpose(e.target.value)} />
                <span className="option-label">{p === 'study' ? 'Study / work' : p === 'chill' ? 'Chill & relax' : 'Meet friends'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="action-row">
          <button className="button" onClick={handleFind}>Find my cafe</button>
          <button className="secondary" onClick={handleReset}>Reset quiz</button>
        </div>

        {showResults && (
          <div className="result-card" ref={resultRef}>
            <h3>Your Cafe Match</h3>
            <p className="result-summary">{summary}</p>
            <div className="recommendation">
              {recommendations.length === 0 ? (
                <p>No exact match found — try switching your answers.</p>
              ) : (
                recommendations.map(cafe => (
                  <div key={cafe.name} className="cafe">
                    <h4>{cafe.name}</h4>
                    <p>{cafe.description}</p>
                    <button className="review-button" onClick={() => handleReviewClick(cafe.name)}>Leave a Review</button>
                  </div>
                ))
              )}
            </div>
            <p className="hint">Tip: change your answers and try again to see new cafe suggestions.</p>

            {showReview && (
              <div className="review-section">
                <h4>{isFromQuiz ? 'Share Your Experience' : 'Leave a Public Comment'}</h4>
                {!isFromQuiz && (
                  <p style={{ marginBottom: '12px' }}>
                    You searched for this cafe, so feel free to leave a comment for others to see.
                  </p>
                )}
                <div className="review-form">
                  {isFromQuiz && (
                    <>
                      <div className="vibe-question-section">
                        <label>Did the cafe match the vibe you were looking for?</label>
                        <div className="review-options">
                          <label className="review-option">
                            <input type="radio" name="matched-vibe" value="yes" checked={matched === 'yes'} onChange={(e) => setMatched(e.target.value)} />
                            <span>Yes</span>
                          </label>
                          <label className="review-option">
                            <input type="radio" name="matched-vibe" value="no" checked={matched === 'no'} onChange={(e) => setMatched(e.target.value)} />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      <div className="recommend-question-section">
                        <label>Would you recommend this cafe to others?</label>
                        <div className="review-options">
                          <label className="review-option">
                            <input type="radio" name="would-recommend" value="yes" checked={recommend === 'yes'} onChange={(e) => setRecommend(e.target.value)} />
                            <span>Yes</span>
                          </label>
                          <label className="review-option">
                            <input type="radio" name="would-recommend" value="no" checked={recommend === 'no'} onChange={(e) => setRecommend(e.target.value)} />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <label>{isFromQuiz ? 'Additional thoughts (optional)' : 'Share your review for others'}</label>
                  <textarea
                    placeholder="Share your experience..."
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button className="button" onClick={handleSubmitReview}>Submit Review</button>
                </div>

                <div className="reviews-display">
                  <h5>Reviews ({displayReviews(currentCafe).length})</h5>
                  {displayReviews(currentCafe).length === 0 ? (
                    <p style={{color: 'var(--muted)', fontSize: '0.9rem', marginTop: '16px'}}>No reviews yet. Be the first to review this cafe!</p>
                  ) : (
                    displayReviews(currentCafe).map((review, index) => (
                      <div key={index} className="review-item">
                        {review.matched !== null && review.recommend !== null && (
                          <p className="review-meta">
                            Vibe Match: <strong>{review.matched === 'yes' ? '✓ Yes' : '✗ No'}</strong> | Recommend: <strong>{review.recommend === 'yes' ? '✓ Yes' : '✗ No'}</strong>
                          </p>
                        )}
                        {review.comment && <p className="review-comment">"{review.comment}"</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

ReactDOM.render(<CafeFinder />, document.getElementById('root'));