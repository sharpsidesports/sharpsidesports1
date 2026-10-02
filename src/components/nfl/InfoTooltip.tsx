interface InfoTooltipProps {
  text: string;
}

// Small ⓘ hover/focus tooltip for column-header explanations. No icon/color
// alone — the ⓘ glyph itself is the affordance, text is plain-language.
export default function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className="group relative inline-flex cursor-help items-center" tabIndex={0}>
      <span className="ml-1 text-gray-400" aria-hidden="true">
        ⓘ
      </span>
      <span className="sr-only">{text}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-48 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-left text-[11px] font-normal normal-case leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
