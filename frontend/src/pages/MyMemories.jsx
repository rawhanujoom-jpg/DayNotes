import { useEffect, useState } from "react";

const API_URL = "https://daynotes-backend.onrender.com";

function MyMemories() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editMood, setEditMood] = useState("Happy");
    const [editDate, setEditDate] = useState("");

    // Load all journals from the backend
    const loadJournals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/journals`);

            if (!response.ok) {
                throw new Error("Failed to load journals.");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected response from the server.");
            }

            setJournals(data);
        } catch (err) {
            console.error("Error loading journals:", err);
            setError("Unable to load memories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Load journals when the page opens
    useEffect(() => {
        loadJournals();
    }, []);

    // Start editing a journal
    const startEditing = (journal) => {
        setEditingId(journal._id);
        setEditTitle(journal.title || "");
        setEditContent(journal.content || "");
        setEditMood(journal.mood || "Happy");
        setEditDate(journal.date || "");
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        setEditMood("Happy");
        setEditDate("");
    };

    // Update a journal
    const updateJournal = async (id) => {
        try {
            const response = await fetch(`${API_URL}/journals/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                    mood: editMood,
                    date: editDate,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update journal.");
            }

            alert("Memory updated successfully!");
            cancelEditing();
            await loadJournals();
        } catch (err) {
            console.error("Error updating journal:", err);
            alert("Unable to update memory. Please try again.");
        }
    };

    // Delete a journal
    const deleteJournal = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this memory?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/journals/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete journal.");
            }

            setJournals((previousJournals) =>
                previousJournals.filter((journal) => journal._id !== id)
            );

            alert("Memory deleted successfully!");
        } catch (err) {
            console.error("Error deleting journal:", err);
            alert("Unable to delete memory. Please try again.");
        }
    };

    return (
        <main className="memories-page">
            <h1>My Memories</h1>
            <p>Your journal entries and special moments.</p>

            <button onClick={loadJournals}>Refresh Memories</button>

            {loading && <p>Loading your memories...</p>}

            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={loadJournals}>Try Again</button>
                </div>
            )}

            {!loading && !error && journals.length === 0 && (
                <p>No memories yet. Write your first journal!</p>
            )}

            <section className="memories-list">
                {journals.map((journal) => (
                    <article className="memory-card" key={journal._id}>
                        {editingId === journal._id ? (
                            <div>
                                <h2>Edit Memory</h2>

                                <label>
                                    Title:
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <br />

                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={editDate}
                                        onChange={(e) =>
                                            setEditDate(e.target.value)
                                        }
                                    />
                                </label>

                                <br />

                                <label>
                                    Mood:
                                    <select
                                        value={editMood}
                                        onChange={(e) =>
                                            setEditMood(e.target.value)
                                        }
                                    >
                                        <option value="Happy">Happy</option>
                                        <option value="Sad">Sad</option>
                                        <option value="Calm">Calm</option>
                                        <option value="Excited">Excited</option>
                                        <option value="Grateful">Grateful</option>
                                        <option value="Angry">Angry</option>
                                        <option value="Anxious">Anxious</option>
                                    </select>
                                </label>

                                <br />

                                <label>
                                    Journal:
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        rows="5"
                                        required
                                    />
                                </label>

                                <br />

                                <button
                                    onClick={() =>
                                        updateJournal(journal._id)
                                    }
                                >
                                    Save Changes
                                </button>

                                <button onClick={cancelEditing}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h2>{journal.title}</h2>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {journal.date}
                                </p>

                                <p>
                                    <strong>Mood:</strong>{" "}
                                    {journal.mood}
                                </p>

                                <p>{journal.content}</p>

                                {journal.photo && (
                                    <img
                                        src={`${API_URL}${journal.photo}`}
                                        alt={journal.title || "Journal memory"}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                )}

                                <div>
                                    <button
                                        onClick={() =>
                                            startEditing(journal)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteJournal(journal._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}

export default MyMemories;