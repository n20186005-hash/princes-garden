import { useTranslations, useMessages } from 'next-intl';

/**
 * 周边语义集群板块：围绕景点建立“Landmarks & Attractions Around …”
 * 的语义网络，将周边核心地标与景点（全称/城市）在正文中绑定。
 */
export default function LandmarksSection() {
  const t = useTranslations('landmarks');
  const messages = useMessages() as any;
  const items = (messages?.landmarks?.items || []) as Array<{
    name: string;
    desc: string;
  }>;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col gap-3 transition-shadow hover:shadow-md"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: 'var(--accent)' }}
              >
                {i + 1}
              </div>
              <h3
                className="font-display text-lg font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </h3>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
