export default function Loading() {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white">

      {/* LEFT PANEL SKELETON */}
      <div className="w-[28%] border-r border-neutral-800 flex flex-col">

        {/* Search skeleton */}
        <div className="p-4 border-b border-neutral-800">
          <div className="h-9 w-full rounded-md bg-neutral-800 animate-pulse" />
        </div>

        {/* Job cards skeleton */}
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-neutral-800 bg-neutral-900 animate-pulse"
            >
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-md bg-neutral-700" />

                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 w-40 bg-neutral-700 rounded" />
                  <div className="h-3 w-24 bg-neutral-700 rounded" />
                  <div className="h-3 w-20 bg-neutral-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESIZER */}
      <div className="w-px bg-neutral-800" />

      {/* RIGHT PANEL SKELETON */}
      <div className="flex-1 p-10 space-y-6">

        <div className="h-8 w-80 bg-neutral-800 rounded animate-pulse" />

        <div className="space-y-3">
          <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-[90%] bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-[80%] bg-neutral-800 rounded animate-pulse" />
        </div>

        <div className="flex gap-3">
          <div className="h-8 w-20 bg-neutral-800 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-neutral-800 rounded-full animate-pulse" />
          <div className="h-8 w-28 bg-neutral-800 rounded-full animate-pulse" />
        </div>

        <div className="h-10 w-40 bg-neutral-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}