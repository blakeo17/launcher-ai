const CHANNEL_DOMAINS: [string, string][] = [
  ["twitter/x", "x.com"],
  ["x/twitter", "x.com"],
  ["twitter", "x.com"],
  ["tiktok", "tiktok.com"],
  ["reddit", "reddit.com"],
  ["linkedin", "linkedin.com"],
  ["instagram", "instagram.com"],
  ["youtube", "youtube.com"],
  ["product hunt", "producthunt.com"],
  ["facebook", "facebook.com"],
  ["hacker news", "news.ycombinator.com"],
  ["indie hackers", "indiehackers.com"],
  ["indiehackers", "indiehackers.com"],
  ["appsumo", "appsumo.com"],
  ["discord", "discord.com"],
  ["medium", "medium.com"],
  ["substack", "substack.com"],
  ["beehiiv", "beehiiv.com"],
  ["google", "google.com"],
  ["cold email", "gmail.com"],
  ["email", "gmail.com"],
  ["newsletter", "gmail.com"],
];

const CHANNEL_COLORS: [string, string][] = [
  ["twitter", "#000000"],
  ["tiktok", "#010101"],
  ["reddit", "#FF4500"],
  ["linkedin", "#0A66C2"],
  ["instagram", "#C13584"],
  ["youtube", "#FF0000"],
  ["product hunt", "#DA552F"],
  ["facebook", "#1877F2"],
  ["hacker news", "#FF6600"],
  ["indie hackers", "#0e2150"],
  ["discord", "#5865F2"],
  ["medium", "#000000"],
  ["substack", "#FF6719"],
  ["beehiiv", "#000000"],
  ["google", "#4285F4"],
  ["email", "#6366f1"],
  ["newsletter", "#6366f1"],
];

export default function ChannelIcon({ channel, size = 22 }: { channel: string; size?: number }) {
  const lower = channel.toLowerCase();
  const domain = CHANNEL_DOMAINS.find(([key]) => lower.includes(key))?.[1];
  const color = CHANNEL_COLORS.find(([key]) => lower.includes(key))?.[1] ?? "#6366f1";

  if (domain) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={channel}
        width={size}
        height={size}
        className="rounded-sm shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: color + "22", color }}
      className="rounded-md flex items-center justify-center shrink-0 font-bold text-[10px]"
    >
      {channel[0]?.toUpperCase()}
    </div>
  );
}
