import React, { useEffect, useMemo, useRef, useState } from "react";
import { getActivitySuggestions } from "./ai/gemini";

// ORBIT: From booking to belonging — hackathon prototype in a single React file
// CHANGE REQUEST: Only add a Back button on each page to go to the previous page. Do not change any other functionality.

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
  <div className="w-full max-w-5xl">
    <OrbitApp />
    
  </div>
</div>
    </div>
  );
}

/*************************
 * Starfield Background  *
 *************************/
function Starfield() {
  // Render a fixed, non-moving background with slowly glowing dots
  const dots = useMemo(() => {
    const arr = [];
    const count = 180; // number of white dots
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
      });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" aria-hidden>
      {/* subtle radial gradient center */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient( circle at 50% 30%, rgba(40,40,60,.5), rgba(0,0,0,1) 60% )",
      }} />
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full opacity-60 animate-starGlow"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: "white",
            filter: "drop-shadow(0 0 2px rgba(255,255,255,.7))",
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes starGlow { 0%,100%{opacity:.15} 50%{opacity:.8} }
        .animate-starGlow{ animation-name: starGlow; animation-iteration-count: infinite; }
      `}</style>
    </div>
  );
}

/*****************
 * Core App Flow *
 *****************/
function OrbitApp() {
  const [page, setPage] = useState("welcome");

  // Profile
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lgbtq, setLgbtq] = useState("No");
  const [orientation, setOrientation] = useState("");
  const [otherOrientation, setOtherOrientation] = useState("");
  const [ageMin, setAgeMin] = useState(21);
  const [ageMax, setAgeMax] = useState(40);

  // Photos
  const [photos, setPhotos] = useState([]); // File[]

  // Interests
  const INTERESTS = useMemo(() => baseInterests, []);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Destinations + autosuggest
  const DESTINATIONS = useMemo(() => ensureTwoHundred(topDestinations200), []);
  const [destination, setDestination] = useState("");

  // Sample users (600 = 3 per destination)
  const SAMPLE_USERS = useMemo(
    () => generateSampleUsers(DESTINATIONS, INTERESTS),
    [DESTINATIONS, INTERESTS]
  );

  // Matching
  const eligibleUsers = useMemo(() => {
    return SAMPLE_USERS.filter(
      (u) => u.destination === destination && u.age >= ageMin && u.age <= ageMax
    );
  }, [SAMPLE_USERS, destination, ageMin, ageMax]);

  const [matchIndex, setMatchIndex] = useState(0);
  const [liked, setLiked] = useState([]); // user ids

  // Groups
  const [groups, setGroups] = useState([]); // {id, name, memberIds}
  const [activeGroupId, setActiveGroupId] = useState(null);

  // Chat
  const [messages, setMessages] = useState([]); // {groupId, sender, text, ts}

  // Reset match state when destination changes
  useEffect(() => {
    setMatchIndex(0);
    setLiked([]);
  }, [destination]);

  const canGoProfileNext = useMemo(() => {
    if (!fullName || !birthday || !email || !phone) return false;
    if (lgbtq === "Yes" && !orientation) return false;
    // naive email/phone checks
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;
    if (!/^[0-9\-\+\(\)\s]{7,}$/.test(phone)) return false;
    if (ageMin < 18 || ageMax > 65 || ageMin > ageMax) return false;
    return true;
  }, [fullName, birthday, email, phone, lgbtq, orientation, ageMin, ageMax]);

  const canGoPhotosNext = photos.length >= 3;
  const canGoInterestsNext = selectedInterests.length >= 5;
  const canGoDestinationNext = !!destination;

  // Group suggestions: cluster liked users into groups of ~4
  const suggestedGroups = useMemo(() => {
  const likedUsers = SAMPLE_USERS.filter((u) => liked.includes(u.id));
  const chunks = [];
  for (let i = 0; i < likedUsers.length; i += 4) {
    chunks.push(likedUsers.slice(i, i + 4));
  }

  function generateGroupName(members) {
  // Gather all interests across members
  const allInterests = members.flatMap((u) => u.interests.map((i) => i.name));
  const counts = {};

  for (const i of allInterests) counts[i] = (counts[i] || 0) + 1;

  // Sort by frequency and pick the top 1–2 shared interests
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const top = sorted.slice(0, 2);

  // ✨ Pool of possible endings to make names more dynamic
  const endings = ["Crew", "Circle", "Collective", "Squad", "Society"];

  // Randomly pick one ending
  const ending = endings[Math.floor(Math.random() * endings.length)];

  // Generate the base name
  if (top.length === 0) return `Orbit ${ending}`;
  if (top.length === 1) return `${top[0]} ${ending}`;
  return `${top[0]} & ${top[1]} ${ending}`;
}

  return chunks.map((chunk, idx) => ({
    id: `g${idx + 1}`,
    name: generateGroupName(chunk),
    memberIds: chunk.map((u) => u.id),
  }));
}, [liked, SAMPLE_USERS]);


  function createGroup(name, memberIds) {
    const id = `cg_${Date.now()}`;
    setGroups((g) => [...g, { id, name, memberIds }]);
    setActiveGroupId(id);
  }

  function handleSendMessage(groupId, text) {
    const msg = {
      groupId,
      sender: fullName || "You",
      text,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, msg]);
  }

  function handleInviteBooking(groupId, details) {
    const group = (groups.length ? groups : suggestedGroups).find(
      (g) => g.id === groupId
    );
    const invitedNames = group.memberIds
      .map((id) => SAMPLE_USERS.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    handleSendMessage(
      groupId,
      `📅 Booking request: ${details.type} at ${details.date} ${
        details.time
      } for ${details.partySize} — invited ${invitedNames || "group"}.`
    );
  }

  // ✅ Back navigation (added only; no other functionality changed)
  const navOrder = [
    "welcome",
    "profile",
    "photos",
    "interests",
    "destination",
    "match",
    "groups",
    "chat",
  ];
  function goBack() {
    const idx = navOrder.indexOf(page);
    if (idx > 0) setPage(navOrder[idx - 1]);
  }

  return (
    <div className="space-y-8">
      <Header onProfileClick={() => setPage("profile")}/>

      {page === "welcome" && (
        <Card>
          <div className="text-center py-16">
            <h1 className="text-9xl font-extrabold tracking-tight">ORBIT</h1>
            <p className="mt-3 text-lg opacity-90">From Booking To Belonging</p>
            <button
              className="mt-10 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition shadow"
              onClick={() => setPage("profile")}
            >
              Get Started
            </button>
          </div>
        </Card>
      )}

      {page === "profile" && (
        <Card title="Create your profile">
          <BackRow onBack={goBack} />
          <div className="grid md:grid-cols-2 gap-4">
            <LabeledInput label="Full name" value={fullName} onChange={setFullName} placeholder="John Doe" />
            <LabeledInput type="date" label="Birthday" value={birthday} onChange={setBirthday} />
            <LabeledInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <LabeledInput label="Phone" value={phone} onChange={setPhone} placeholder="(555) 123-4567" />
          </div>

          <div className="mt-6">
            <p className="mb-2 font-medium">Are you part of the LGBTQ+ community?</p>
            <div className="flex gap-2">
              {[
                { val: "Yes" },
                { val: "No" },
                { val: "Prefer not to say" },
              ].map((o) => (
                <Chip
                  key={o.val}
                  selected={lgbtq === o.val}
                  onClick={() => setLgbtq(o.val)}
                >
                  {o.val}
                </Chip>
              ))}
            </div>
            {lgbtq === "Yes" && (
  <div className="mt-4">
    <p className="mb-2 font-medium">Orientation (single-select)</p>
    <ChipCloud
      options={[
        "Gay",
        "Lesbian",
        "Bisexual",
        "Trans",
        "Queer",
        "Other",
        "Prefer not to say",
      ]}
      multi={false}
      value={orientation ? [orientation] : []}
      onChange={(vals) => {
        const selected = vals[0] || "";
        setOrientation(selected);
        if (selected !== "Other") setOtherOrientation("");
      }}
    />

    {/* If “Other” is selected, show a text input */}
    {orientation === "Other" && (
      <div className="mt-3">
        <LabeledInput
          label="Please specify"
          value={otherOrientation}
          onChange={setOtherOrientation}
          placeholder="Enter your orientation"
        />
      </div>
    )}
  </div>
)}

          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <LabeledInput
              label="Preferred minimum age"
              type="number"
              value={String(ageMin)}
              onChange={(v) => setAgeMin(Number(v))}
              min={18}
              max={65}
            />
            <LabeledInput
              label="Preferred maximum age"
              type="number"
              value={String(ageMax)}
              onChange={(v) => setAgeMax(Number(v))}
              min={18}
              max={65}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <Button disabled={!canGoProfileNext} onClick={() => setPage("photos")}>
              Continue
            </Button>
          </div>
        </Card>
      )}

      {page === "photos" && (
        <Card title="Add photos (min 3, max 9)">
          <BackRow onBack={goBack} />
          <PhotoGrid photos={photos} setPhotos={setPhotos} />
          <div className="mt-6 flex justify-between items-center relative">
          {/* Move x/9 label slightly up and away from Back button */}
          <span className="absolute bottom-16 left-4 text-sm opacity-80">
            {photos.length} / 9 selected
          </span>
          
          {/* Keep Continue button aligned right */}
          <div className="ml-auto">
            <Button
              disabled={!canGoPhotosNext}
              onClick={() => setPage("interests")}
            >
              Continue
            </Button>
          </div>
        </div>
        </Card>
      )}

      {page === "interests" && (
        <Card title="Pick at least 5 interests">
          <BackRow onBack={goBack} />
          <ChipCloud
            options={INTERESTS.map((i) => `${i.emoji} ${i.name}`)}
            multi={true}
            value={selectedInterests}
            onChange={setSelectedInterests}
          />
          <div className="mt-6 flex justify-end">
            <Button disabled={!canGoInterestsNext} onClick={() => setPage("destination")}>Continue</Button>
          </div>
        </Card>
      )}

      {page === "destination" && (
        <Card title="Where are you headed?">
          <BackRow onBack={goBack} />
          <TypingPrompt
            prompts={[
              "Where are you traveling to?",
              "Where is your next journey?",
              "What's next for you?",
            ]}
          />
          <DestinationAutosuggest
            destinations={DESTINATIONS}
            value={destination}
            setValue={setDestination}
          />
          <div className="mt-6 flex justify-end">
            <Button disabled={!canGoDestinationNext} onClick={() => setPage("match")}>Start Matching</Button>
          </div>
        </Card>
      )}

      {page === "match" && (
        <Card title={`Potential friends in ${destination || "…"}`}>
          <BackRow onBack={goBack} />
          {eligibleUsers.length === 0 ? (
            <div className="text-center py-10 opacity-80">No profiles match your age range here yet. Try broadening it or pick another destination.</div>
          ) : (
            <MatchCard
  user={eligibleUsers[matchIndex]}
  userInterests={selectedInterests}
  total={eligibleUsers.length}
  index={matchIndex}
  onMatch={() => {
    const id = eligibleUsers[matchIndex].id;
    if (!liked.includes(id)) setLiked([...liked, id]);

    // Move to next or auto-advance
    if (matchIndex + 1 >= eligibleUsers.length) {
      setPage("groups");
    } else {
      setMatchIndex((i) => i + 1);
    }
  }}
  onSkip={() => {
    if (matchIndex + 1 >= eligibleUsers.length) {
      setPage("groups");
    } else {
      setMatchIndex((i) => i + 1);
    }
  }}
  onEnd={() => setPage("groups")}
/>

          )}
          <div className="mt-4 text-sm opacity-70 text-right">
            {Math.min(matchIndex + 1, eligibleUsers.length)} / {eligibleUsers.length}
          </div>
        </Card>
      )}

      {page === "groups" && (
        <Card title="Your Circles">
          <BackRow onBack={goBack} />

          {/* 👥 View Members Button */}
    <div className="flex justify-end mb-3">
      <Button onClick={() => setPage("members")}>View Members</Button>
    </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-6 pb-20">
            <div>
              <h3 className="font-semibold mb-2">Suggested groups</h3>
              {suggestedGroups.length === 0 ? (
                <div className="text-sm opacity-80">No suggestions yet — create your own group below.</div>
              ) : (
                <div className="space-y-3">
                  {suggestedGroups.map((g) => (
                    <GroupRow
                      key={g.id}
                      group={g}
                      users={SAMPLE_USERS}
                      onJoin={() => {
                        setGroups((prev) => [...prev, g]);
                        setActiveGroupId(g.id);
                        setPage("chat");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Create your own group</h3>
              <CreateGroupForm
                likedUsers={SAMPLE_USERS.filter((u) => liked.includes(u.id))}
                onCreate={(name, members) => {
                  createGroup(name, members.map((m) => m.id));
                  setPage("chat");
                }}
              />
            </div>
          </div>
        </Card>
      )}
      

      {page === "chat" && (
        <Card title="Circle chat">
          <BackRow onBack={goBack} />
          <div className="grid md:grid-cols-[2fr,1fr] gap-6 pb-12">
            <ChatPanel
              group={(groups.length ? groups : suggestedGroups).find((g) => g.id === activeGroupId) || (groups.length ? groups[0] : suggestedGroups[0])}
              users={SAMPLE_USERS}
              messages={messages}
              destination={destination} 
              onSend={(text) => {
                const gid = activeGroupId || (groups[0]?.id || suggestedGroups[0]?.id);
                handleSendMessage(gid, text);
              }}
            />
            <BookingSidebar
              group={(groups.length ? groups : suggestedGroups).find((g) => g.id === activeGroupId) || (groups.length ? groups[0] : suggestedGroups[0])}
              users={SAMPLE_USERS}
              destination={destination} 
              onInvite={(details) => {
                const gid = activeGroupId || (groups[0]?.id || suggestedGroups[0]?.id);
                handleInviteBooking(gid, details);
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

/*****************
 * UI Components *
 *****************/
function Header({ onProfileClick }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">★</div>
        <span className="font-semibold tracking-wide">ORBIT</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs opacity-70">Prototype — Hackathon Demo</div>
        <button
          onClick={onProfileClick}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
}


function Card({ title, children }) {
  return (
    <div className="relative bg-white/5 backdrop-blur rounded-2xl shadow-xl border border-white/10 overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-xl transition shadow ${
        disabled
          ? "bg-white/10 cursor-not-allowed opacity-50"
          : "bg-white/15 hover:bg-white/25"
      }`}
    >
      {children}
    </button>
  );
}

function BackRow({ onBack }) {
  return (
    <div className="absolute bottom-4 left-4">
      <Button onClick={onBack}>Back</Button>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text", placeholder, min, max }) {
  return (
    <label className="block">
      <span className="text-sm opacity-80">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-white/30"
      />
    </label>
  );
}

function Chip({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition ${
        selected
          ? "bg-white/20 border-white/40"
          : "bg-white/10 border-white/10 hover;border-white/30".replace(';', '')
      }`}
    >
      {children}
    </button>
  );
}

function ChipCloud({ options, value, onChange, multi = true }) {
  function toggle(opt) {
    if (multi) {
      if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
      else onChange([...value, opt]);
    } else {
      onChange(value.includes(opt) ? [] : [opt]);
    }
  }
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
      {options.map((opt) => (
        <Chip key={opt} selected={value.includes(opt)} onClick={() => toggle(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  );
}

/***********************
 * Photo Upload & Grid *
 ***********************/
function PhotoGrid({ photos, setPhotos }) {
  const inputRef = useRef(null);

  function onFilesSelected(files) {
    const list = Array.from(files || []);
    const limited = [...photos, ...list].slice(0, 9);
    setPhotos(limited);
  }

  function removeAt(idx) {
    const cp = photos.slice();
    cp.splice(idx, 1);
    setPhotos(cp);
  }

  // Generate preview URLs
  const previews = useMemo(() => {
    return photos.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
  }, [photos]);

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-3 place-items-center">
        {Array.from({ length: 9 }).map((_, idx) => {
          const has = idx < previews.length;
          return (
            <div
              key={idx}
              onClick={() => inputRef.current?.click()}
              className="w-full aspect-square bg-white/5 rounded-xl border border-white/10 grid place-items-center relative cursor-pointer"
            >
              {has ? (
                <>
                  <img
                    src={previews[idx].url}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                    style={{ objectPosition: "center", aspectRatio: "1 / 1" }}
                  />

                  <button
                    className="absolute top-1 right-1 text-xs bg-black/60 px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(idx);
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="text-center text-sm opacity-70">
                  Click to upload
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-right">
        <button
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

/***********************
 * Destination Autosuggest
 ***********************/
function DestinationAutosuggest({ destinations, value, setValue }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const matches = useMemo(() => {
  if (!query) return [];
  const q = query.toLowerCase();
  return destinations.filter((d) => d.toLowerCase().includes(q));
}, [destinations, query]);

  return (
    <div className="relative">
      <LabeledInput
        label="Destination"
        value={query}
        onChange={(v) => {
          setQuery(v);
          setOpen(true);
          if (!v) setValue("");
        }}
        placeholder="Start typing (e.g., Paris, Tokyo)"
      />
      {open && matches.length > 0 && (
      <div
        className="absolute z-20 w-full bg-black/90 border border-white/10 rounded-xl mt-2 overflow-y-auto"
        style={{ maxHeight: "12rem" }} // ≈ 5 options visible
      >
        {matches.map((m) => (
          <button
            key={m}
            className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors"
            onClick={() => {
              setValue(m);
              setQuery(m);
              setOpen(false);
            }}
          >
            {m}
          </button>
        ))}
      </div>
    )}
    </div>
  );
}

/***********************
 * Typing + Backspace animation for prompts
 ***********************/
function TypingPrompt({ prompts }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const current = prompts[idx % prompts.length];
    if (phase === "typing") {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 1000);
        return () => clearTimeout(t);
      }
    }
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 30);
        return () => clearTimeout(t);
      } else {
        setIdx((i) => i + 1);
        setPhase("typing");
      }
    }
  }, [phase, text, idx, prompts]);

  return (
    <div className="text-xl md:text-2xl font-semibold mb-4 h-8">
      <span className="opacity-90">{text}</span>
      <span className="animate-pulse">▌</span>
    </div>
  );
}

/***********************
 * Matching Card
 ***********************/
/***********************
 * Matching Card (Vertical Layout)
 ***********************/
function MatchCard({ user, userInterests, onMatch, onSkip, onEnd, total, index }) {
  if (!user) return null;

  const overlap = user.interests.filter((i) =>
    userInterests.some((ui) => ui.endsWith(i.name))
  );

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Image */}
      <div className="w-full max-w-md aspect-video bg-white/5 rounded-xl overflow-hidden">
        <img
          src={user.photo}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + Age */}
      <div>
        <h3 className="text-2xl font-bold">{user.name}</h3>
        <p className="text-sm opacity-80">{user.age}</p>
        <p className="text-sm italic opacity-80 mt-1">"{user.bio}"</p>
      </div>

      {/* Shared Interests */}
      <div>
        <div className="text-sm font-medium mb-1">Shared interests</div>
        {overlap.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {overlap.map((i) => (
              <Chip key={i.name} selected>
                {i.emoji} {i.name}
              </Chip>
            ))}
          </div>
        ) : (
          <div className="text-sm opacity-70">
            No overlap yet — you might still vibe.
          </div>
        )}
      </div>

      {/* Destination */}
      <div className="text-sm opacity-80">
        Destination: {user.destination}
      </div>

      {/* Buttons */}
      <div className="pt-4 flex gap-3 justify-center">
        <button
          onClick={onSkip}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          ← Skip
        </button>
        <button
          onClick={onMatch}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          ♥ Match
        </button>
        <button
          onClick={onEnd}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          ✓ End Matching
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="text-xs opacity-60">
        {index + 1} / {total}
      </div>
    </div>
  );
}


/***********************
 * Groups & Chat
 ***********************/
function GroupRow({ group, users, onJoin }) {
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const groupMembers = group.memberIds
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{group.name}</div>
          <div className="text-sm opacity-80 mt-1">
            {groupMembers.map((u) => u.name).join(", ")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowMembers(!showMembers)}>
            {showMembers ? "Hide Members" : "View Members"}
          </Button>
          <Button onClick={onJoin}>Join Group</Button>
        </div>
      </div>

      {/* Expandable member list */}
      {showMembers && (
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          {groupMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="text-left bg-white/10 hover:bg-white/20 rounded-xl p-2 transition"
            >
              <div className="font-semibold">{member.name}</div>
              <div className="text-xs opacity-70">{member.age} — {member.destination}</div>
            </button>
          ))}
        </div>
      )}

      {/* Tinder-style modal for a selected member */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="w-[320px] bg-white/5 rounded-2xl p-4 border border-white/10 text-center relative shadow-xl">
            <button
              className="absolute top-2 right-3 text-sm opacity-80 hover:opacity-100"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>
            <img
              src={selectedMember.photo}
              alt={selectedMember.name}
              className="w-full h-64 object-cover rounded-xl mb-3"
            />
            <h3 className="text-xl font-bold">{selectedMember.name}</h3>
            <p className="text-sm opacity-80">{selectedMember.age}</p>
            <p className="italic text-sm opacity-70 mt-1 mb-3">
              "{selectedMember.bio}"
            </p>
            <div className="text-sm font-medium mb-1">Interests</div>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {selectedMember.interests.map((i) => (
                <Chip key={i.name} selected>
                  {i.emoji} {i.name}
                </Chip>
              ))}
            </div>
            <div className="text-sm opacity-70">
              Destination: {selectedMember.destination}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function CreateGroupForm({ likedUsers, onCreate }) {
  const [name, setName] = useState("My Circle");
  const [selected, setSelected] = useState([]);

  function toggle(u) {
    setSelected((s) => (s.includes(u) ? s.filter((x) => x !== u) : [...s, u]));
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <LabeledInput label="Group name" value={name} onChange={setName} />
      <div className="mt-3 text-sm opacity-80">Add members</div>
      <div className="mt-2 grid sm:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
        {likedUsers.map((u) => (
          <label key={u.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
            <input type="checkbox" checked={selected.includes(u)} onChange={() => toggle(u)} />
            <span className="truncate">{u.name} — {u.age}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 text-right">
        <Button onClick={() => onCreate(name, selected)} disabled={!name || selected.length === 0}>Create</Button>
      </div>
    </div>
  );
}

function ChatPanel({ group, users, messages, onSend, destination }) {
  const [text, setText] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  async function handleAISuggestions() {
  try {
    setLoadingAI(true);

    // Collect all interests from group members
const allInterests = users
  .filter((u) => group.memberIds.includes(u.id))
  .flatMap((u) => u.interests.map((i) => i.name));

// Find most common interests
const freq = {};
for (const interest of allInterests) {
  freq[interest] = (freq[interest] || 0) + 1;
}
const sortedInterests = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

// Only take top 3 shared interests to personalize recommendations
const commonInterests = sortedInterests.slice(0, 3);

// Use the group's theme as the AI focus
const groupTheme = group.name.replace(/Circle|Crew|Squad|Collective|Voyagers/gi, "").trim();

// Pass groupTheme + destination to Gemini
const text = await getActivitySuggestions([groupTheme], destination);



const lines = text.split("\n").filter((line) => line.trim());
const parsedSuggestions = [];

for (const line of lines) {
  // Match patterns like:
  // 1. **The Ritz-Carlton, Tokyo – Traditional Japanese Tea Ceremony Experience**: Description...
  const match = line.match(/^\d+\.\s*\*\*(.*?)\s*[–-]\s*(.*?)\*\*\s*[:\-]\s*(.*)$/);

  if (match) {
    const [, property, experience, desc] = match;
    parsedSuggestions.push({
      property: property.trim(),
      experience: experience.trim(),
      description: desc.trim(),
      expanded: false,
    });
  } else {
    // Fallback: if it doesn’t match perfectly, still show something
    const parts = line.split(":");
    parsedSuggestions.push({
      property: "Marriott Experience",
      experience: parts[0].replace(/^\d+\.\s*/, "").trim(),
      description: parts[1] ? parts[1].trim() : "",
      expanded: false,
    });
  }
}
setAiSuggestions(parsedSuggestions);



  } catch (err) {
    console.error("AI suggestions failed:", err);
    setAiSuggestions(["Could not fetch suggestions. Please check your connection or API key."]);
  } finally {
    setLoadingAI(false);
  }
}

  const ref = useRef(null);

  const groupMessages = messages.filter((m) => m.groupId === group?.id);

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [groupMessages.length]);

  if (!group) return <div className="opacity-70">No group selected.</div>;

  return (
    <div>
      <div className="font-semibold mb-2">{group.name}</div>
      <div ref={ref} className="h-72 overflow-auto bg-white/5 rounded-xl p-3 border border-white/10">
        {groupMessages.length === 0 && (
          <div className="text-sm opacity-70">Say hi and plan something!</div>
        )}
        {groupMessages.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="text-xs opacity-60">{new Date(m.ts).toLocaleString()}</div>
            <div><span className="font-medium">{m.sender}: </span>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { onSend(text.trim()); setText(''); } }}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-white/30"
        />
        <Button onClick={() => { if (text.trim()) { onSend(text.trim()); setText(''); } }}>Send</Button>
      </div>
      {/* ✨ AI Activity Suggestions Section */}
<hr className="my-4 border-white/10" />
<div className="mt-2">
  <Button onClick={handleAISuggestions} disabled={loadingAI}>
  {loadingAI
    ? "Generating ideas..."
    : aiSuggestions.length > 0
    ? "🔁 Generate New Ideas"
    : "✨ AI Activity Suggestions"}
</Button>


  {aiSuggestions.length > 0 && (
  <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/10">
    <p className="font-medium mb-3 opacity-90">Recommended for your group:</p>

    {aiSuggestions.map((item, i) => {
      // Skip if this is the intro text (like "Here are 5 Marriott Bonvoy experiences...")
      if (item.experience.toLowerCase().startsWith("here are")) {
        return (
          <p key={i} className="text-sm text-gray-300 mb-3 italic">
            {item.experience}
          </p>
        );
      }

      return (
        <div key={i} className="mb-3">
          {/* Main button with gradient */}
          <button
            onClick={() =>
              setAiSuggestions((prev) =>
                prev.map((s, j) =>
                  j === i ? { ...s, expanded: !s.expanded } : s
                )
              )
            }
            className="w-full text-left text-sm font-semibold bg-gradient-to-r from-[#1e3a8a]/40 to-[#6b7280]/40 hover:from-[#2563eb]/60 hover:to-[#9ca3af]/60 transition-all duration-300 rounded-lg px-3 py-2 text-white"
          >
            {item.experience}
          </button>

          {/* Animated expanded section */}
          {item.expanded && (
            <div
              className="mt-2 text-sm bg-white/10 p-3 rounded-lg animate-fadeIn border border-white/10"
              style={{
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <p className="font-bold">{item.property}</p>
              <p className="opacity-80 mt-1 mb-3">{item.description}</p>

              <Button
                size="sm"
                className="mt-2 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#991b1b] text-white transition-all"
                onClick={() =>
                  onSend(
                    `📍 *${item.experience}* at ${item.property}\n${item.description}`
                  )
                }
              >
                Share to Group Chat
              </Button>
            </div>
          )}
        </div>
      );
    })}
  </div>
)}




</div>

    </div>
  );
}


function BookingSidebar({ group, users, destination, onInvite }) {
  const [type, setType] = useState("Spa");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [ideasGenerated, setIdeasGenerated] = useState(false);


  async function handleAISuggestions() {
    setAiSuggestions([]);
    setLoadingAI(true);

    const allInterests = users
      .filter((u) => group.memberIds.includes(u.id))
      .flatMap((u) => u.interests.map((i) => i.name));

    const uniqueInterests = [...new Set(allInterests)];

    try {
      const text = await getActivitySuggestions(uniqueInterests, destination);
      setAiSuggestions(text.split("\n").filter(Boolean));
    } catch (err) {
      console.error("Gemini error:", err);
      setAiSuggestions(["Error fetching AI suggestions."]);
    } finally {
      setLoadingAI(false);
    }
  }

  if (!group) return null;

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="font-semibold mb-2">Book a Marriott experience</div>

      <div className="mt-4">
      </div>

      <label className="block text-sm mb-2 mt-4">
        <span className="opacity-80">Amenity</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full px-3 py-2 bg-white/10 rounded-xl"
        >
          <option>Spa</option>
          <option>Restaurant</option>
          <option>Wellness Class</option>
          <option>Pool Cabana</option>
          <option>Co-working Day Pass</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <LabeledInput label="Date" type="date" value={date} onChange={setDate} />
        <LabeledInput label="Time" type="time" value={time} onChange={setTime} />
      </div>

      <LabeledInput
        label="Party size"
        type="number"
        value={String(partySize)}
        onChange={(v) => setPartySize(Number(v))}
      />

      <div className="mt-3 text-right">
        <Button
          onClick={() => {
            if (!date || !time) return;
            onInvite({ type, date, time, partySize });
          }}
        >
          Invite group
        </Button>
      </div>

      <div className="mt-3 text-xs opacity-70">
        (Demo) This sends a message to the chat and simulates a booking invite.
      </div>
    </div>
  );
}


/***********************
 * Data & Generators
 ***********************/
const baseInterests = [
  { emoji: "🏖️", name: "Beach" },
  { emoji: "🏔️", name: "Mountains" },
  { emoji: "🏛️", name: "History" },
  { emoji: "🎨", name: "Art & Culture" },
  { emoji: "🍽️", name: "Food Tours" },
  { emoji: "🎭", name: "Nightlife" },
  { emoji: "🧘", name: "Wellness" },
  { emoji: "🏃", name: "Sports" },
  { emoji: "🎵", name: "Music Festivals" },
  { emoji: "🛍️", name: "Shopping" },
  { emoji: "🌴", name: "Nature" },
  { emoji: "📸", name: "Photography" },
  { emoji: "🏰", name: "Architecture" },
  { emoji: "🚴", name: "Cycling" },
  { emoji: "🎓", name: "Education" },
  { emoji: "🍻", name: "Bars & Lounges" },
  { emoji: "🧗", name: "Adventure" },
  { emoji: "💃", name: "Dancing" },
  { emoji: "🌍", name: "Backpacking" },
  { emoji: "🏕️", name: "Camping" },
  { emoji: "🧑‍🍳", name: "Cooking" },
  { emoji: "☕", name: "Coffee" },
  { emoji: "📚", name: "Books" },
  { emoji: "🎮", name: "Gaming" },
  { emoji: "🧠", name: "Startups" },
  { emoji: "🛶", name: "Kayaking" },
  { emoji: "🚶", name: "City Walks" },
  { emoji: "🧪", name: "Science Museums" },
  { emoji: "🍇", name: "Wine Tasting" },
  { emoji: "🧺", name: "Picnics" },
];

const topDestinations200 = [
  "Paris, France","London, UK","New York, USA","Tokyo, Japan","Rome, Italy","Barcelona, Spain","Dubai, UAE","Singapore","Bangkok, Thailand","Hong Kong","Istanbul, Turkey","Seoul, South Korea","Amsterdam, Netherlands","Vienna, Austria","Prague, Czech Republic","Lisbon, Portugal","Sydney, Australia","Los Angeles, USA","San Francisco, USA","Chicago, USA","Miami, USA","Orlando, USA","Las Vegas, USA","Athens, Greece","Berlin, Germany","Munich, Germany","Venice, Italy","Florence, Italy","Milan, Italy","Madrid, Spain","Dublin, Ireland","Edinburgh, UK","Reykjavik, Iceland","Copenhagen, Denmark","Stockholm, Sweden","Oslo, Norway","Zurich, Switzerland","Geneva, Switzerland","Brussels, Belgium","Budapest, Hungary","Krakow, Poland","Warsaw, Poland","Dubrovnik, Croatia","Split, Croatia","Vienna, Austria","Porto, Portugal","Seville, Spain","Valencia, Spain","Nice, France","Lyon, France","Marseille, France","Doha, Qatar","Abu Dhabi, UAE","Riyadh, Saudi Arabia","Tel Aviv, Israel","Jerusalem, Israel","Cairo, Egypt","Marrakesh, Morocco","Johannesburg, South Africa","Cape Town, South Africa","Nairobi, Kenya","Zanzibar, Tanzania","Phuket, Thailand","Chiang Mai, Thailand","Kuala Lumpur, Malaysia","Bali, Indonesia","Jakarta, Indonesia","Ho Chi Minh City, Vietnam","Hanoi, Vietnam","Manila, Philippines","Taipei, Taiwan","Shanghai, China","Beijing, China","Chengdu, China","Shenzhen, China","Melbourne, Australia","Auckland, New Zealand","Queenstown, New Zealand","Toronto, Canada","Vancouver, Canada","Montreal, Canada","Quebec City, Canada","Cancun, Mexico","Mexico City, Mexico","Tulum, Mexico","Lima, Peru","Cusco, Peru","Buenos Aires, Argentina","Santiago, Chile","Rio de Janeiro, Brazil","Sao Paulo, Brazil","Bogota, Colombia","Cartagena, Colombia","San Juan, Puerto Rico","San Jose, Costa Rica","Panama City, Panama","Havana, Cuba","Athens, Greece","Santorini, Greece","Mykonos, Greece","Crete, Greece","Amalfi Coast, Italy","Naples, Italy","Sicily, Italy","Mallorca, Spain","Ibiza, Spain","Tenerife, Spain","Madeira, Portugal","Azores, Portugal","Banff, Canada","Whistler, Canada","Aspen, USA","Park City, USA","Yosemite, USA","Grand Canyon, USA","New Orleans, USA","Austin, USA","Nashville, USA","Philadelphia, USA","Boston, USA","Washington DC, USA","Charleston, USA","Savannah, USA","Honolulu, USA","Maui, USA","Kauai, USA","Oahu, USA","Tahiti, French Polynesia","Bora Bora, French Polynesia","Fiji","Maldives","Seychelles","Mauritius","Phu Quoc, Vietnam","Langkawi, Malaysia","Boracay, Philippines","Siem Reap, Cambodia","Luang Prabang, Laos","Kathmandu, Nepal","Pokhara, Nepal","Jaipur, India","Udaipur, India","Delhi, India","Mumbai, India","Goa, India","Bengaluru, India","Hyderabad, India","Colombo, Sri Lanka","Kandy, Sri Lanka","Male, Maldives","Doha, Qatar","Muscat, Oman","Salalah, Oman","Petra, Jordan","Amman, Jordan","Wadi Rum, Jordan","Reunion Island","Ile Maurice","Gran Canaria, Spain","Lanzarote, Spain","Fuerteventura, Spain","Marrakesh, Morocco","Chefchaouen, Morocco","Fes, Morocco","Agadir, Morocco","Casablanca, Morocco","Zanzibar, Tanzania","Stone Town, Tanzania","Serengeti, Tanzania","Victoria Falls, Zimbabwe","Okavango Delta, Botswana","Addis Ababa, Ethiopia","Accra, Ghana","Lagos, Nigeria","Doha, Qatar","Abu Dhabi, UAE","Muscat, Oman","Aqaba, Jordan","Dead Sea, Jordan","Petra, Jordan","Jericoacoara, Brazil","Punta Cana, Dominican Republic","Aruba","Curacao","Barbados","St. Lucia","Antigua","Grenada","Dominica","Belize City, Belize","Ambergris Caye, Belize","Roatan, Honduras","San Pedro, Belize","Galapagos, Ecuador","Quito, Ecuador","La Paz, Bolivia","Uyuni, Bolivia","Medellin, Colombia","Cali, Colombia","Qingdao, China","Suzhou, China","Nara, Japan","Kyoto, Japan","Osaka, Japan","Sapporo, Japan","Hakone, Japan","Hokkaido, Japan","Nagoya, Japan","Kanazawa, Japan","Hiroshima, Japan","Kobe, Japan","Fukuoka, Japan","Busan, South Korea","Jeju, South Korea","Gyeongju, South Korea","Incheon, South Korea","Hallstatt, Austria","Interlaken, Switzerland","Zermatt, Switzerland","Grindelwald, Switzerland","Lucerne, Switzerland","Lake Como, Italy","Cinque Terre, Italy","Pisa, Italy","Turin, Italy","Bologna, Italy"
];

function ensureTwoHundred(arr) {
  if (arr.length >= 200) return arr.slice(0, 200);
  const extra = [];
  let i = 1;
  while (arr.length + extra.length < 200) {
    extra.push(`City ${i}, Country`);
    i++;
  }
  return [...arr, ...extra];
}

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomName() {
  const first = ["Alex","Taylor","Jordan","Riley","Casey","Avery","Jamie","Morgan","Quinn","Cameron","Drew","Skyler","Rowan","Parker","Elliot","Reese","Kai","Sage","Aria","Nina","Priya","Anya","Kiran","Omar","Levi","Mia","Liam","Noah","Emma","Aiden","Zara","Noelle","Sofia","Hana","Kei","Kenji","Yuki","Manu","Ishaan","Maya"]; 
  const last = ["Sharma","Patel","Kim","Nguyen","Garcia","Smith","Johnson","Lee","Brown","Davis","Martinez","Lopez","Anderson","Clark","Lewis","Walker","Young","King","Wright","Green"]; 
  return `${randomFrom(first)} ${randomFrom(last)}`;
}

function randomBio() {
  const bios = [
    "Always down for sunrise coffee walks.",
    "Remote worker looking for gym and good tacos.",
    "Love photography and local markets.",
    "Hike by day, jazz bars by night.",
    "Here for food tours and new friends.",
  ];
  return randomFrom(bios);
}

function generateSampleUsers(destinations, interests) {
  const users = [];
  let id = 1;

  for (const d of destinations) {
    // Create 30 users per destination
    for (let k = 0; k < 30; k++) {
      const age = 18 + Math.floor(Math.random() * 48); // 18–65
      const shuffled = [...interests].sort(() => Math.random() - 0.5);
      const picks = shuffled.slice(0, 5 + Math.floor(Math.random() * 4)); // 5–8 interests

      users.push({
        id: `u${id++}`,
        name: randomName(),
        age,
        destination: d,
        interests: picks,
        bio: randomBio(),
        photo: `https://picsum.photos/seed/${encodeURIComponent(d + "-" + id)}/640/360`,
      });
    }
  }

  return users;
}

