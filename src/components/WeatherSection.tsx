import { getTranslations, getLocale } from 'next-intl/server';
import {
  type WeatherData,
  categoryOf,
  iconOf,
  windForce,
} from '@/lib/weather';

type TipGroup = 'outfit' | 'plan' | 'gear' | 'risk';

function uvLevel(uv: number | null): 'low' | 'mid' | 'high' | 'veryHigh' {
  if (uv == null) return 'low';
  if (uv < 3) return 'low';
  if (uv < 6) return 'mid';
  if (uv < 8) return 'high';
  return 'veryHigh';
}

interface TipEntry {
  group: TipGroup;
  key: string;
}

/** 依据天气数据组合出“普通游客能直接执行”的建议（多选展示，不满足条件即隐藏） */
function buildTips(data: WeatherData): TipEntry[] {
  const c = data.current;
  const today = data.daily[0];
  if (!today) return [];

  const catToday = categoryOf(today.code);
  const catNow = categoryOf(c.code);
  const max = today.tMax;
  const min = today.tMin;
  const pop = today.precipProb ?? 0;
  const uv = today.uv;
  const rainyToday =
    catToday === 'rain' || catToday === 'rainheavy' || catToday === 'drizzle';
  const rainyNow =
    catNow === 'rain' || catNow === 'rainheavy' || catNow === 'drizzle';

  const tips: TipEntry[] = [];
  const add = (group: TipGroup, key: string) => tips.push({ group, key });

  // ---- 风险（优先级最高）----
  if (catToday === 'thunder' || catNow === 'thunder') add('risk', 'riskThunder');
  if (c.windKmh >= 50) add('risk', 'riskWind');
  if (catToday === 'fog' || catNow === 'fog') add('risk', 'riskFog');

  // ---- 出行穿搭 ----
  if (max >= 32) add('outfit', 'outfitHeat');
  else if (max <= 10) add('outfit', 'outfitCold');
  if (max - min > 8) add('outfit', 'outfitDiff');
  if (rainyToday || rainyNow || catToday === 'snow' || catNow === 'snow')
    add('outfit', 'outfitRain');
  if (c.windKmh >= 29) add('outfit', 'outfitWind');

  // ---- 游玩安排 ----
  if (catToday === 'thunder') add('plan', 'planThunder');
  else if (catToday === 'rainheavy') add('plan', 'planRainHeavy');
  else if (catToday === 'rain' || catToday === 'drizzle')
    add('plan', 'planRainLight');
  else if (catToday === 'clear' || catToday === 'partly')
    add('plan', 'planSunny');
  else if (catToday === 'cloudy') add('plan', 'planCloudy');
  else if (catToday === 'fog') add('plan', 'planFog');
  else if (catToday === 'snow') add('plan', 'planSnow');
  if (pop >= 60) add('plan', 'planPrecip');
  if (max >= 32) add('plan', 'planHeat');
  if (max <= 5) add('plan', 'planCold');

  // ---- 随身物品 ----
  if (pop >= 60 || rainyToday || rainyNow || catToday === 'snow')
    add('gear', 'gearUmbrella');
  if (catToday === 'rainheavy' || catToday === 'thunder' || pop >= 70)
    add('gear', 'gearRaincoat');
  if (uv != null && (uv >= 5 || (catToday === 'clear' && uv >= 3)))
    add('gear', 'gearSun');
  if (max >= 30) add('gear', 'gearWater');
  if (max - min > 8 && max < 30) add('gear', 'gearJacket');
  if (max <= 10) add('gear', 'gearWarm');

  return tips;
}

export default async function WeatherSection({
  data,
}: {
  data: WeatherData | null;
}) {
  const [t, locale] = await Promise.all([
    getTranslations('weather'),
    getLocale(),
  ]);
  const localeTag =
    locale === 'zh' ? 'zh-CN' : locale === 'bg' ? 'bg-BG' : 'en';

  const dayFmt = new Intl.DateTimeFormat(localeTag, {
    weekday: 'short',
    timeZone: 'Europe/Sofia',
  });
  const timeFmt = new Intl.DateTimeFormat(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Sofia',
  });

  if (!data) {
    return (
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeading title={t('title')} subtitle={t('subtitle')} />
          <p style={{ color: 'var(--text-muted)' }}>{t('unavailable')}</p>
        </div>
      </section>
    );
  }

  const { current, daily } = data;
  const catNow = categoryOf(current.code);
  const today = daily[0];
  const tips = buildTips(data);
  const risks = tips.filter((i) => i.group === 'risk');
  const groups: TipGroup[] = ['outfit', 'plan', 'gear'];
  const updatedLocal = timeFmt.format(new Date(data.updatedAt));

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 当前天气 */}
          <div
            className="md:col-span-1 rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {t('nowLabel')}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t('updated')} {updatedLocal}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-6xl leading-none" aria-hidden="true">
                {iconOf(catNow)}
              </span>
              <div>
                <div className="text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(current.temp)}°
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t(`conditions.${catNow}`)}
                </div>
              </div>
            </div>
          </div>

          {/* 今日关键数据 */}
          <div
            className="md:col-span-2 rounded-2xl p-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('todayTitle')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Metric label={t('feelsLike')} value={`${Math.round(current.feelsLike)}°`} />
              <Metric
                label={t('wind')}
                value={`${Math.round(current.windKmh)} km/h`}
                windText={t(`windLevels.${windForce(current.windKmh)}`)}
              />
              {today && (
                <Metric
                  label={t('precip')}
                  value={today.precipProb != null ? `${today.precipProb}%` : '—'}
                />
              )}
              {today && <Metric label={t('uv')} value={t(`uvLevels.${uvLevel(today.uv)}`)} />}
            </div>
          </div>
        </div>

        {/* 出行建议 */}
        <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h3 className="font-display text-xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            {t('adviceTitle')}
          </h3>

          {risks.length > 0 && (
            <div
              className="rounded-xl p-4 mb-5 border-l-4"
              style={{ background: 'rgba(185, 28, 28, 0.06)', borderColor: '#b91c1c' }}
              role="alert"
            >
              <p className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#b91c1c' }}>
                <span aria-hidden="true">⚠️</span>
                {t('riskTitle')}
              </p>
              <ul className="space-y-1.5">
                {risks.map((r) => (
                  <li key={r.key} className="text-sm leading-relaxed" style={{ color: '#7f1d1d' }}>
                    {t(`tips.${r.key}`)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {groups.map((group) => {
              const items = tips.filter((i) => i.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--accent)' }}>
                    {t(`groups.${group}`)}
                  </p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.key}
                        className="text-sm leading-relaxed rounded-lg px-3 py-2"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      >
                        {t(`tips.${item.key}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 未来多日预报 */}
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h3 className="font-display text-xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            {t('forecastTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {daily.slice(0, 7).map((d, i) => {
              const cat = categoryOf(d.code);
              const dayLabel =
                i === 0 ? t('dayToday') : i === 1 ? t('dayTomorrow') : dayFmt.format(new Date(`${d.date}T12:00:00Z`));
              return (
                <div
                  key={d.date}
                  className="rounded-xl px-3 py-4 text-center"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    outline: i === 0 ? '1px solid var(--accent)' : undefined,
                  }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    {dayLabel}
                  </p>
                  <div className="text-2xl mb-1" aria-hidden="true">{iconOf(cat)}</div>
                  <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>
                    {t(`conditions.${cat}`)}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {Math.round(d.tMax)}°{' '}
                    <span style={{ color: 'var(--text-muted)' }}>{Math.round(d.tMin)}°</span>
                  </p>
                  {d.precipProb != null && d.precipProb > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: 'var(--accent)' }}>
                      💧 {d.precipProb}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2
        className="font-display text-3xl sm:text-4xl font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {subtitle}
      </p>
      <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />
    </>
  );
}

function Metric({
  label,
  value,
  windText,
}: {
  label: string;
  value: string;
  windText?: string;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
    >
      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      {windText && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {windText}
        </p>
      )}
    </div>
  );
}
