// ─── Notification & Persistence Helpers ──────────────────────────────────────
//
// Fill in your .env file (copy from .env.example):
//   VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
//   VITE_TELEGRAM_CHAT_ID=your_chat_id_here
//   VITE_SHEET_URL=your_apps_script_web_app_url_here

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
const CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID   as string | undefined;
const SHEET_URL = import.meta.env.VITE_SHEET_URL           as string | undefined;

// ─── Telegram ─────────────────────────────────────────────────────────────────

export async function notifyTelegram(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN === 'your_bot_token_here') {
    console.info('[notify] Telegram not configured — skipping.');
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.warn('[notify] Telegram send failed:', err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs: number): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

interface NavigatorUAData {
  brands?: Array<{ brand: string; version: string }>;
  mobile?: boolean;
  platform?: string;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface BatteryManager {
  level: number;
  charging: boolean;
}

interface IpWhoResponse {
  success?: boolean;
  ip?: string;
  type?: string;
  city?: string;
  region?: string;
  country?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  connection?: {
    isp?: string;
    org?: string;
    asn?: number;
  };
}

function getWebGLInfo(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return 'Unavailable';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string | null;
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string | null;
      const combined = [vendor, renderer].filter(Boolean).join(' / ');
      if (combined) return combined;
    }
    return String(gl.getParameter(gl.RENDERER) ?? 'Available');
  } catch {
    return 'Unavailable';
  }
}

async function getBatteryInfo(): Promise<string> {
  const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
  if (typeof nav.getBattery !== 'function') return 'Unavailable';
  try {
    const battery = await Promise.race([
      nav.getBattery(),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 1000)),
    ]);
    if (!battery) return 'Unavailable';
    const pct = Math.round(battery.level * 100);
    return `${pct}% (${battery.charging ? 'charging' : 'on battery'})`;
  } catch {
    return 'Unavailable';
  }
}

// ─── Google Sheets via Apps Script ───────────────────────────────────────────

export interface LogPayload {
  answer: string;
  noCount: number;
  trekExpChoice?: string;
  userAgent: string;
  details?: string;
}

export async function logToSheet(payload: LogPayload): Promise<void> {
  if (!SHEET_URL || SHEET_URL === 'your_apps_script_web_app_url_here') {
    console.info('[log] Sheet URL not configured — skipping.');
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (err) {
    console.warn('[log] Sheet log failed:', err);
  }
}

// ─── Page-open visit telemetry (permissionless) ───────────────────────────────

export async function fireVisitEvent(): Promise<void> {
  const now = new Date();
  const istTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const localTime = now.toLocaleString();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  const utcOffsetMin = -now.getTimezoneOffset();
  const offsetSign = utcOffsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(utcOffsetMin);
  const utcOffset = `UTC${offsetSign}${String(Math.floor(absMin / 60)).padStart(2, '0')}:${String(absMin % 60).padStart(2, '0')}`;

  const nav = navigator as Navigator & {
    userAgentData?: NavigatorUAData;
    deviceMemory?: number;
    connection?: NetworkInformation;
  };

  const uaData = nav.userAgentData;
  const uaBrands = uaData?.brands
    ?.filter(b => !b.brand.includes('Not'))
    .map(b => `${b.brand} ${b.version}`)
    .join(', ');

  const platformParts = [
    uaData?.platform || nav.platform || 'Unknown platform',
    uaData?.mobile !== undefined ? (uaData.mobile ? 'Mobile' : 'Desktop') : null,
    nav.maxTouchPoints > 0 ? `Touch (${nav.maxTouchPoints} pts)` : 'No touch',
    uaBrands || null,
  ].filter(Boolean);

  const screenInfo = [
    `Screen ${window.screen.width}x${window.screen.height}`,
    `Avail ${window.screen.availWidth}x${window.screen.availHeight}`,
    `Viewport ${window.innerWidth}x${window.innerHeight}`,
    `DPR ${window.devicePixelRatio || 1}`,
    `${window.screen.colorDepth}-bit`,
    window.screen.orientation?.type ?? null,
  ]
    .filter(Boolean)
    .join(' | ');

  const gpu = getWebGLInfo();
  const hardwareParts = [
    nav.hardwareConcurrency ? `${nav.hardwareConcurrency} CPU cores` : null,
    nav.deviceMemory ? `${nav.deviceMemory} GB RAM` : null,
    `GPU: ${gpu}`,
  ].filter(Boolean);

  const conn = nav.connection;
  const connParts = conn
    ? [
        conn.effectiveType ? conn.effectiveType.toUpperCase() : null,
        conn.downlink !== undefined ? `${conn.downlink} Mbps` : null,
        conn.rtt !== undefined ? `${conn.rtt}ms RTT` : null,
        conn.saveData ? 'Save-Data ON' : null,
      ].filter(Boolean)
    : [];

  const langs = nav.languages?.length ? nav.languages.join(', ') : nav.language;
  const darkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'Yes' : 'No';

  const [batteryInfo, ipWho] = await Promise.all([
    getBatteryInfo(),
    fetchJsonWithTimeout<IpWhoResponse>('https://ipwho.is/', 2500),
  ]);

  let ipStr = 'Unavailable';
  let locStr = 'Unavailable';
  let ispStr = connParts.length ? connParts.join(', ') : 'Unavailable';

  if (ipWho?.success !== false && ipWho?.ip) {
    ipStr = ipWho.type ? `${ipWho.ip} (${ipWho.type})` : ipWho.ip;
    const locParts = [ipWho.city, ipWho.region, ipWho.country].filter(Boolean);
    const coords =
      ipWho.latitude !== undefined && ipWho.longitude !== undefined
        ? ` [${ipWho.latitude.toFixed(4)}, ${ipWho.longitude.toFixed(4)}]`
        : '';
    const postal = ipWho.postal ? ` (${ipWho.postal})` : '';
    if (locParts.length) {
      locStr = `${locParts.join(', ')}${postal}${coords}`;
    }
    const isp = ipWho.connection?.isp || ipWho.connection?.org;
    if (isp || connParts.length) {
      ispStr = [isp, connParts.length ? connParts.join(', ') : null].filter(Boolean).join(' | ');
    }
  } else {
    const ipify = await fetchJsonWithTimeout<{ ip?: string }>('https://api.ipify.org?format=json', 1500);
    if (ipify?.ip) ipStr = ipify.ip;
  }

  const referrer = document.referrer || 'Direct';

  const lines = [
    `👀 <b>Someone opened Diksha's website!</b>`,
    `🕐 <b>Time (IST):</b> ${escapeHtml(istTime)}`,
    `🌍 <b>Visitor TZ:</b> ${escapeHtml(`${tz} (${utcOffset}) | Local: ${localTime}`)}`,
    `🌐 <b>IP:</b> <code>${escapeHtml(ipStr)}</code>`,
    `📍 <b>Approx Location:</b> ${escapeHtml(locStr)}`,
    `📡 <b>Network / ISP:</b> ${escapeHtml(ispStr)}`,
    `📱 <b>Device / Platform:</b> ${escapeHtml(platformParts.join(' | '))}`,
    `🖥️ <b>Display:</b> ${escapeHtml(screenInfo)}`,
    `⚙️ <b>Hardware:</b> ${escapeHtml(hardwareParts.join(' | '))}`,
    `🔋 <b>Battery:</b> ${escapeHtml(batteryInfo)}`,
    `🎨 <b>Prefs:</b> ${escapeHtml(`Lang: ${langs} | Theme: ${darkMode} | Reduced motion: ${reducedMotion} | Cookies: ${nav.cookieEnabled ? 'Yes' : 'No'}`)}`,
    `🔗 <b>URL:</b> ${escapeHtml(window.location.href)}`,
    `↩️ <b>Referrer:</b> ${escapeHtml(referrer)}`,
    `🧾 <b>User-Agent:</b> <code>${escapeHtml(nav.userAgent)}</code>`,
  ];

  const tgText = lines.join('\n');
  notifyTelegram(tgText);
  logToSheet({
    answer: 'page-open',
    noCount: 0,
    userAgent: nav.userAgent,
    details: JSON.stringify({
      istTime,
      localTime,
      tz,
      utcOffset,
      ipStr,
      locStr,
      ispStr,
      platform: platformParts.join(' | '),
      screenInfo,
      hardware: hardwareParts.join(' | '),
      batteryInfo,
      langs,
      darkMode,
      referrer,
      url: window.location.href,
    }),
  });
}

// ─── Combined fire-and-forget helper ──────────────────────────────────────────

export function fireEvent(params: {
  answer: string;
  noCount: number;
  trekExpChoice?: string;
}): void {
  const ts = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const noStr = params.noCount === 0
    ? 'said Yes right away 🎉'
    : `after ${params.noCount} No${params.noCount > 1 ? 's' : ''}`;

  let tgText = '';
  if (params.answer === 'yes') {
    tgText = `🐾 <b>Diksha said YES!</b> (${noStr})\n📅 Sunday, Nov 29\n🕐 ${ts}`;
  } else if (params.answer === 'no-final') {
    tgText = `😔 Diksha said no to the trek (${noStr})\n📅 ${ts}`;
  } else if (params.answer === 'trek-exp' && params.trekExpChoice) {
    tgText = `🥾 <b>Diksha's trek experience:</b> ${escapeHtml(params.trekExpChoice)}\n🕐 ${ts}`;
  } else if (params.answer === 'all-done') {
    tgText = `✅ <b>All done!</b>\n📅 Date: Sunday, Nov 29\n🥾 Experience: ${escapeHtml(params.trekExpChoice ?? '—')}\n(${noStr})\n🕐 ${ts}`;
  }

  if (tgText) {
    notifyTelegram(tgText);
    logToSheet({
      answer: params.answer,
      noCount: params.noCount,
      trekExpChoice: params.trekExpChoice,
      userAgent: navigator.userAgent,
    });
  }
}
