import { now } from "@/data/now";

export default function NowStrip() {
    return (
        <section className="w-full max-w-5xl px-4 md:px-6 py-16 border-t border-neutral-900">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-24">
                <h2 className="label text-neutral-500">now</h2>
                <dl className="space-y-3 lowercase">
                    {([["building", now.building], ["reading", now.reading], ["listening", now.listening]] as const).map(
                        ([k, v]) => (
                            <div key={k} className="flex flex-col gap-1 md:flex-row md:gap-4">
                                <dt className="label w-28 shrink-0 text-neutral-600">{k}</dt>
                                <dd className="text-neutral-300">{v}</dd>
                            </div>
                        ),
                    )}
                </dl>
            </div>
            <p className="label mt-8 text-neutral-700 md:ml-[calc(33%+6rem)]">
                updated {now.updated}
            </p>
        </section>
    );
}
