import type { ActorInput } from "@/lib/actors";

export const EMPTY_ACTOR: ActorInput = { name: "", photo: "", nationality: "", birthDate: "", biography: "" };

type Props = { value: ActorInput; onChange: (value: ActorInput) => void };

export default function ActorFields({ value, onChange }: Props) {
  const set = (field: keyof ActorInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [field]: e.target.value });

  return (
    <>
      <label>
        Nombre
        <input value={value.name} onChange={set("name")} required />
      </label>
      <label>
        Foto (URL)
        <input type="url" value={value.photo} onChange={set("photo")} required />
      </label>
      <label>
        Nacionalidad
        <input value={value.nationality} onChange={set("nationality")} required />
      </label>
      <label>
        Fecha de nacimiento
        <input type="date" value={value.birthDate} onChange={set("birthDate")} required />
      </label>
      <label>
        Biografía
        <textarea value={value.biography} onChange={set("biography")} rows={3} required />
      </label>
    </>
  );
}
