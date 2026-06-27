import { useBuilder } from "../../../state/BuilderContext";
import { LabeledInput } from "../fields/Fields";

export function ContactStep() {
  const { resume, setContact } = useBuilder();
  const c = resume.contact;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabeledInput
          label="Full name"
          value={c.name}
          onChange={(v) => setContact({ name: v })}
          placeholder="Jordan Rivera"
        />
        <LabeledInput
          label="Professional title"
          value={c.title}
          onChange={(v) => setContact({ title: v })}
          placeholder="Senior Product Designer"
        />
        <LabeledInput
          label="Email"
          type="email"
          value={c.email}
          onChange={(v) => setContact({ email: v })}
          placeholder="you@email.com"
        />
        <LabeledInput
          label="Phone"
          value={c.phone}
          onChange={(v) => setContact({ phone: v })}
          placeholder="+1 (555) 000-0000"
        />
        <LabeledInput
          label="Location"
          value={c.location}
          onChange={(v) => setContact({ location: v })}
          placeholder="San Francisco, CA"
        />
        <LabeledInput
          label="Website"
          value={c.website}
          onChange={(v) => setContact({ website: v })}
          placeholder="yoursite.com"
        />
      </div>
      <LabeledInput
        label="Avatar image URL (optional)"
        value={c.avatarUrl}
        onChange={(v) => setContact({ avatarUrl: v })}
        placeholder="https://…/photo.jpg"
      />
    </div>
  );
}
