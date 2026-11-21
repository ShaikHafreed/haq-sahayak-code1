import { getSchemes } from "../../lib/data";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function SchemesBand() {
  const schemes = getSchemes();

  return (
    <section aria-labelledby="schemes-band-title" className="bg-sage-2">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-16 md:py-20">
        <h2 id="schemes-band-title" className="landing-display text-[32px] leading-10 text-navy">
          Schemes we track
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-navy text-xs uppercase tracking-[0.12em] text-ink-2">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Scheme
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme.id} className="border-b border-rule hover:bg-marigold-tint">
                  <th scope="row" className="py-4 pr-4 font-medium text-navy">
                    {scheme.name.en}
                  </th>
                  <td className="py-4 pr-4 text-base text-ink-2">{scheme.status}</td>
                  <td className="landing-mono py-4 text-sm text-ink-2">{hostOf(scheme.sourceUrl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
