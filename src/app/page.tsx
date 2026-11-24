import { getNotes } from "@/lib/content";
import { NoteLibrary } from "@/components/note-library";
export default function Home() {
  const notes = getNotes().map(({ body, ...note }) => note);
  return <NoteLibrary notes={notes} />;
}
