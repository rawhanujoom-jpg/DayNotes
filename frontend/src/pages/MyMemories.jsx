
import { useEffect, useState } from "react";

function MyMemories() {
    const [journals, setJournals] = useState([]);
    const [search, setSearch] = useState("");
    const [moodFilter, setMoodFilter] = useState("All");
    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [mood, setMood] = useState("Happy");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);

    const loadJournals = async () => {
        try {
            const response = await fetch("http://localhost:5000/journals");

            if (!response.ok) {
                throw new Error("Unable to load journals");
            }

            const data = await response.json();
            setJournals(data);
        } catch (error) {
            console.log("Unable to load journals");
        }
    };

    useEffect(() => {
        loadJournals();
    }, []);

    const startEditing = (journal) => {
        setEditingId(journal._id);
        setTitle(journal.title);
        setDate(journal.date);
        setMood(journal.mood || "Happy");
        setContent(journal.content);
        setPhoto(null);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setTitle("");
        setDate("");
        setMood("Happy");
        setContent("");
        setPhoto(null);
    };

    const updateJournal = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);
        formData.append("mood", mood);
        formData.append("content", content);

        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const response = await fetch(
                `http://localhost:5000/journals/${editingId}`,
                {
                    method: "PUT",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update journal");
            }

            alert("Journal updated successfully!");

            cancelEditing();
            await loadJournals();
        } catch (error) {
            alert("Unable to update journal. Check your backend.");
        }
    };

    const deleteJournal = async (id) => {
        if (!window.confirm("Are you sure you want to delete this memory?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/journals/${id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Unable to delete journal");
            }

            await loadJournals();
        } catch (error) {
            alert("Unable to delete journal.");
        }
    };
const filteredJournals = journals.filter((journal) => {
    const matchesSearch = journal.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesMood =
        moodFilter === "All" || (journal.mood || "Happy") === moodFilter;

    return matchesSearch && matchesMood;
});
   

    return (
        <div className="page-container memories-page">

            <div className="page-heading">
                <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
                <h1>My memories<span>.</span></h1>
                <p>Little moments, kept close.</p>
            </div>

            {editingId && (
                <form className="journal-form" onSubmit={updateJournal}>
                    <h2>Edit Your Journal</h2>

                    <label htmlFor="edit-title">Journal title</label>
                    <input
                        id="edit-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <div className="form-row">
                        <div>
                            <label htmlFor="edit-date">Date</label>
                            <input
                                id="edit-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-mood">Today's mood</label>
                            <select
                                id="edit-mood"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                            >
                                <option>Happy</option>
                                <option>Calm</option>
                                <option>Grateful</option>
                                <option>Excited</option>
                                <option>Sad</option>
                                <option>Thoughtful</option>
                            </select>
                        </div>
                    </div>

                    <label htmlFor="edit-photo">Change photograph (optional)</label>
                    <input
                        id="edit-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0] || null)}
                    />

                    <label htmlFor="edit-content">Your thoughts</label>
                    <textarea
                        id="edit-content"
                        rows="7"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    <button type="submit" className="primary-btn">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        className="delete-btn"
                        onClick={cancelEditing}
                    >
                        Cancel
                    </button>
                </form>
            )}
<p className="memory-count">
    You have saved {journals.length} memories ♡
</p>

<input
    className="search-input"
    type="text"
    placeholder="Search journal titles..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

<select
    className="search-input"
    value={moodFilter}
    onChange={(e) => setMoodFilter(e.target.value)}
>
    <option value="All">All Moods</option>
    <option value="Happy">Happy</option>
    <option value="Calm">Calm</option>
    <option value="Grateful">Grateful</option>
    <option value="Excited">Excited</option>
    <option value="Sad">Sad</option>
    <option value="Thoughtful">Thoughtful</option>
</select>
            
            {filteredJournals.length === 0 ? (
                <div className="empty-state">
                    <span>♡</span>
                    <h2>No memories found</h2>
                    <p>Your journal entries will appear here.</p>
                </div>
            ) : (
                <div className="memory-grid">
                    {filteredJournals.map((journal) => (
                        <article className="memory-card" key={journal._id}>
                            {journal.photo && (
                                <img
                                    className="memory-photo"
                                    src={`http://localhost:5000${journal.photo}`}
                                    alt={journal.title}
                                />
                            )}

                            <div className="memory-details">
                                <p className="memory-date">{journal.date}</p>
                                <h2>{journal.title}</h2>

                                {journal.mood && (
                                    <span className="mood-tag">
                                        {journal.mood}
                                    </span>
                                )}

                                <p className="memory-content">
                                    {journal.content}
                                </p>

                                <button
                                    className="primary-btn"
                                    onClick={() => startEditing(journal)}
                                >
                                    Edit Memory
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteJournal(journal._id)}
                                >
                                    Delete Memory
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyMemories;

