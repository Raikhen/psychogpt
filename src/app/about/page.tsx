import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-surface-0">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-accent transition-colors mb-12"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to PsychoGPT
        </Link>

        {/* Hero */}
        <h1 className="text-[32px] font-semibold text-text-primary leading-tight mb-4">
          Why This Exists
        </h1>
        <p className="text-[15px] text-text-secondary leading-relaxed mb-16">
          Large language models routinely reinforce psychotic delusions when
          prompted by vulnerable users, and the consequences have ranged from
          hospitalization to fatal outcomes. PsychoGPT is a more interactive
          version of Tim Hua&apos;s research that lets you watch AI-reinforced
          psychosis unfold in real time.
        </p>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-[22px] font-semibold text-text-primary mb-2">
            The Problem
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
            There is a growing body of documented cases where AI chatbots
            contributed to serious psychiatric harm. In some, users disclosed
            suicidal ideation dozens of times without the model ever suggesting
            they talk to a human. In others, models actively validated paranoid
            and delusional thinking, or encouraged users to act on dangerous
            beliefs.
          </p>
          <p className="text-[14px] text-text-tertiary leading-relaxed text-[13px]">
            For a detailed account of individual cases, see reporting by the{" "}
            <a
              href="https://www.nytimes.com/2024/10/23/technology/characterai-teen-suicide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              New York Times
            </a>
            ,{" "}
            <a
              href="https://www.bbc.com/news/articles/cd7n0z2xz8po"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              BBC
            </a>
            , and{" "}
            <a
              href="https://www.theguardian.com/us-news/2025/jan/07/character-ai-lawsuit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              The Guardian
            </a>
            .
          </p>
        </section>

        {/* The Research */}
        <section className="mb-16">
          <h2 className="text-[22px] font-semibold text-text-primary mb-2">
            The Research
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
            Beyond news reports, systematic research has shown that LLMs
            consistently accommodate delusional framings rather than redirecting
            users to appropriate help.
          </p>

          <div className="space-y-4">
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-5">
              <h3 className="text-[15px] font-medium text-text-primary mb-2">
                Tim Hua, &ldquo;AI-Induced Psychosis: A Shallow
                Investigation&rdquo; (2025)
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
                A red-teaming study where models from multiple providers
                (DeepSeek, ChatGPT, Gemini) were presented with personas
                exhibiting psychotic symptoms. The models validated and
                elaborated on delusional beliefs across the board. They wrote
                ascension rituals, treated suicidal ideation as spiritual
                transcendence, and reinforced paranoid conspiracy frameworks.
                None suggested the user seek professional help. The transcripts
                in PsychoGPT come from this research.
              </p>
              <a
                href="https://www.alignmentforum.org/posts/iGF7YcnQkEbwvYLPA/ai-induced-psychosis-a-shallow-investigation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-accent hover:text-accent-hover transition-colors"
              >
                Read on Alignment Forum →
              </a>
            </div>

            <div className="bg-surface-1 border border-border-subtle rounded-xl p-5">
              <h3 className="text-[15px] font-medium text-text-primary mb-2">
                Sakata et al., AI-Associated Psychosis case report, UCSF (2024)
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
                The first peer-reviewed clinical case of AI-associated
                psychosis. During an active psychotic episode, ChatGPT told the
                patient &ldquo;You&apos;re not crazy&rdquo; and engaged with
                her delusional beliefs as though they were rational. Dr. Keith
                Sakata went on to identify 12 patients with AI-associated
                psychosis at a single hospital in one year.
              </p>
              <a
                href="https://innovationscns.com/youre-not-crazy-a-case-of-new-onset-ai-associated-psychosis/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-accent hover:text-accent-hover transition-colors"
              >
                Read in Innovations in Clinical Neuroscience →
              </a>
            </div>

            <div className="bg-surface-1 border border-border-subtle rounded-xl p-5">
              <h3 className="text-[15px] font-medium text-text-primary mb-2">
                OpenAI Sycophancy Incident (April 2025)
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
                A ChatGPT update made the model excessively agreeable,
                enthusiastically endorsing user statements including delusional
                beliefs. OpenAI acknowledged the problem and rolled back the
                change after three days. The incident showed how easily safety
                tuning can regress.
              </p>
              <a
                href="https://openai.com/index/sycophancy-in-gpt-4o/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-accent hover:text-accent-hover transition-colors"
              >
                OpenAI&apos;s post-mortem →
              </a>
            </div>
          </div>
        </section>

        {/* Why This Tool */}
        <section className="mb-16">
          <h2 className="text-[22px] font-semibold text-text-primary mb-2">
            Why This Tool
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
            PsychoGPT lets you see how models actually respond when a vulnerable
            person turns to them for validation. It ships with real transcripts
            from Tim Hua&apos;s research, and you can run your own experiments
            with different models and character personas.
          </p>
        </section>

        {/* Footer */}
        <div className="border-t border-border-subtle pt-8">
          <Link
            href="/"
            className="text-[13px] text-accent hover:text-accent-hover transition-colors"
          >
            Back to PsychoGPT
          </Link>
        </div>
      </div>
    </div>
  );
}
