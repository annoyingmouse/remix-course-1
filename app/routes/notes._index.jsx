import { redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import NewNote, {
  links as newNoteLinks,
} from "~/components/NewNote/NewNote.jsx";
import NoteList, {
  links as noteListLinks,
} from "~/components/NoteList/NoteList.jsx";
import { getStoredNotes, storeNotes } from "~/data/notes.js";

export const meta = () => [
  {
    title: "All Notes",
    description: "Manage your notes with ease.",
  },
];

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw new Response(JSON.stringify({ message: "No notes found." }), {
      status: 404,
      statusText: "No notes were found.",
    });
  }
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length <= 3) {
    return { message: "Title must be at least 3 characters long." };
  }
  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect(`/notes`);
}

export const links = () => [...newNoteLinks(), ...noteListLinks()];

// eslint-disable-next-line react/prop-types
function CatchBoundary({ error }) {
  // eslint-disable-next-line react/prop-types
  const message = error.statusText || "Data not found.";

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const response = isRouteErrorResponse(error);
  if (response) {
    return <CatchBoundary error={error} />;
  }
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>!
      </p>
    </main>
  );
}
