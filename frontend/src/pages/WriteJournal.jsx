import { useState } from "react";

function WriteJournal() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [mood, setMood] = useState("Happy");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);

  const saveJournal = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("date", date);
    formData.append("content", content);
    formData.append("mood", mood);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch(
        "https://daynotes-backend.onrender.com/journals",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save journal");
      }

      alert("Your journal has been saved!");

      setTitle("");
      setDate(new Date().toLocaleDateString("en-CA"));
      setMood("Happy");
      setContent("");
      setPhoto(null);

      e.target.reset();
    } catch (error) {
      alert("Unable to save journal. Check your backend.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <p className="eyebrow">A MOMENT FOR YOURSELF</p>
        <h1>Write your journal<span>.</span></h1>
        <p>Take a breath. Your thoughts belong here.</p>
      </div>

      <form className="journal-form" onSubmit={saveJournal}>
        <label htmlFor="title">Journal title</label>
        <input
          id="title"
          type="text"
          placeholder="Give this day a name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="form-row">
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="mood">Today's mood</label>
            <select
              id="mood"
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

        <label htmlFor="photo">Add a photograph</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0] || null)}
        />

        {photo && (
          <p className="photo-name">
            Selected photo: {photo.name}
          </p>
        )}

        <label htmlFor="content">Your thoughts</label>
        <textarea
          id="content"
          rows="7"
          placeholder="Dear diary, today..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit" className="primary-btn">
          Save My Journal ♡
        </button>
      </form>
    </div>
  );
}

export default WriteJournal;