import React from "react"

const NetworkStatus = () => {
  return (
    <div className="absolute inset-x-0 h-full rounded-2xl bg-background">
      <div className="relative isolate flex h-12 flex-col justify-between gap-3 overflow-hidden rounded-lg border border-green-600/15 bg-gradient-to-r from-lime-100/80 to-emerald-100/80 py-3 pr-12 pl-4 sm:h-16 sm:flex-row sm:items-center sm:py-2">
        <svg
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,black,transparent)] text-black/30 mix-blend-overlay md:[mask-image:linear-gradient(to_right,black_60%,transparent)]"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="grid-_r_62_"
              x={-1}
              y={-2}
              width={13}
              height={13}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 13 0 L 0 0 0 13"
                fill="transparent"
                stroke="currentColor"
                strokeWidth={1}
              />
            </pattern>
          </defs>
          <rect fill="url(#grid-_r_62_)" width="100%" height="100%" />
        </svg>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-green-600/50 bg-white/50 p-1 shadow-[inset_0_0_1px_1px_#fff] sm:block">
            <svg
              height={18}
              width={18}
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              className="m-px size-4 text-green-800"
            >
              <g fill="currentColor">
                <path
                  d="M8.5,6.827c-.352,.168-.682,.398-.973,.69l-.01,.01c-1.381,1.381-1.381,3.619,0,5l2.175,2.175c1.381,1.381,3.619,1.381,5,0l.01-.01c1.381-1.381,1.381-3.619,0-5l-.931-.931"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.5,11.173c.352-.168,.682-.398,.973-.69l.01-.01c1.381-1.381,1.381-3.619,0-5l-2.175-2.175c-1.381-1.381-3.619-1.381-5,0l-.01,.01c-1.381,1.381-1.381,3.619,0,5l.931,.931"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="12.25"
                  x2={13}
                  y1="3.75"
                  y2="1.5"
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="14.25"
                  x2="16.5"
                  y1="5.75"
                  y2={5}
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="3.75"
                  x2="1.5"
                  y1="12.25"
                  y2={13}
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="5.75"
                  x2={5}
                  y1="14.25"
                  y2="16.5"
                />
              </g>
            </svg>
          </div>
          <p className="text-sm text-neutral-900">
            Claim a free <span className="font-semibold">.link</span> domain,
            free for 1 year.{" "}
            <a
              href="https://dub.co/help/article/free-dot-link-domain"
              target="_blank"
              className="text-neutral-700 underline transition-colors hover:text-black"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex items-center sm:-my-1">
          <button
            type="button"
            className="rounded-md border border-green-700/50 px-3 py-1 text-sm whitespace-nowrap text-neutral-800 transition-colors hover:bg-green-500/10"
          >
            Claim Domain
          </button>
        </div>
        <button
          type="button"
          className="absolute top-2.5 right-2.5 p-1 text-sm text-green-700 underline transition-colors hover:text-green-900 sm:top-1/2 sm:-translate-y-1/2"
        >
          <svg
            fill="none"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width={14}
            height={14}
            className="size-[18px]"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default NetworkStatus
