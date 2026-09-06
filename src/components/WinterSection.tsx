import { useTranslations, useMessages } from 'next-intl';

/**
 * 冬季专题板块：Княжеска градина 季节性冰场（Ice Park Sofia）
 * 承接 "ледена пързалка софия / ледена пързалка / ice rink" 等搜索意图。
 * 文案保持中性客观：说明季节、时段、票价参考与自我准备建议，
 * 并在页脚注明“具体时刻表每年由主办方公布，请以当日官方信息为准”。
 */
export default function WinterSection() {
  const t = useTranslations('winter');
  const messages = useMessages() as any;
  const facts = (messages?.winter?.facts || []) as Array<{
    title: string;
    text: string;
  }>;
  const tips = (messages?.winter?.tips || []) as string[];

  return (
    <section id="winter" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {facts.map((fact, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col gap-3"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3
                className="font-display text-lg font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                {fact.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {fact.text}
              </p>
            </div>
          ))}
        </div>

        <h3
          className="font-display text-xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('tipsTitle')}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
                style={{ background: 'var(--accent)' }}
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {tip}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="rounded-xl p-5 flex items-start gap-4"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  );
}
