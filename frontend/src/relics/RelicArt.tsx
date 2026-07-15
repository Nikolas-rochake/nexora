import React from 'react';
import Svg, {
  Circle, Defs, LinearGradient, RadialGradient, Stop, Path, Polygon,
  G, Ellipse, Line, Rect,
} from 'react-native-svg';
import { COLORS } from '../theme';
import { RelicKey } from './data';

type Props = {
  relicKey: RelicKey;
  size?: number;
  discovered?: boolean;
};

// Gradient IDs are suffixed with the relic key so they never collide.
const g = (k: string, id: string) => `${id}-${k}`;

function GoldDefs({ k, discovered }: { k: string; discovered: boolean }) {
  const c1 = discovered ? COLORS.gold : '#3A3A3A';
  const c2 = discovered ? '#8B6F32' : '#262626';
  const c3 = discovered ? '#F2D896' : '#4A4A4A';
  return (
    <Defs>
      <LinearGradient id={g(k, 'metal')} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={c3} />
        <Stop offset="0.5" stopColor={c1} />
        <Stop offset="1" stopColor={c2} />
      </LinearGradient>
      <RadialGradient id={g(k, 'sphere')} cx="0.35" cy="0.3" rx="0.9" ry="0.9">
        <Stop offset="0" stopColor={c3} />
        <Stop offset="0.5" stopColor={c1} />
        <Stop offset="1" stopColor={discovered ? '#5A4620' : '#161616'} />
      </RadialGradient>
    </Defs>
  );
}

export default function RelicArt({ relicKey, size = 220, discovered = true }: Props) {
  const s = size;
  const k = relicKey + (discovered ? '-on' : '-off');
  const stroke = discovered ? COLORS.gold : '#3A3A3A';
  const strokeDim = discovered ? COLORS.goldDim : '#262626';

  switch (relicKey) {
    case 'genesis':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Circle cx="100" cy="100" r="70" fill={`url(#${g(k,'sphere')})`} />
          <Circle cx="100" cy="100" r="70" stroke={stroke} strokeWidth="1.2" fill="none" />
          <Circle cx="100" cy="100" r="52" stroke={stroke} strokeOpacity="0.35" strokeWidth="0.6" fill="none" />
          <Circle cx="100" cy="100" r="34" stroke={stroke} strokeOpacity="0.25" strokeWidth="0.6" fill="none" />
        </Svg>
      );
    case 'aeternum':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <G>
            <Ellipse cx="72" cy="100" rx="42" ry="42" stroke={`url(#${g(k,'metal')})`} strokeWidth="4" fill="none" />
            <Ellipse cx="128" cy="100" rx="42" ry="42" stroke={`url(#${g(k,'metal')})`} strokeWidth="4" fill="none" />
            <Ellipse cx="100" cy="100" rx="70" ry="24" stroke={stroke} strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
          </G>
        </Svg>
      );
    case 'constellation':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          {/* connective lines */}
          <G stroke={strokeDim} strokeWidth="0.8" opacity="0.7">
            <Line x1="60" y1="70" x2="120" y2="50" />
            <Line x1="120" y1="50" x2="150" y2="110" />
            <Line x1="150" y1="110" x2="90" y2="150" />
            <Line x1="90" y1="150" x2="60" y2="70" />
            <Line x1="60" y1="70" x2="150" y2="110" />
            <Line x1="120" y1="50" x2="90" y2="150" />
          </G>
          {[
            [60, 70], [120, 50], [150, 110], [90, 150], [100, 100],
          ].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={i === 4 ? 5 : 3.5} fill={`url(#${g(k,'sphere')})`} />
          ))}
        </Svg>
      );
    case 'eclipse':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Defs>
            <RadialGradient id={g(k,'corona')} cx="0.5" cy="0.5" rx="0.5" ry="0.5">
              <Stop offset="0.55" stopColor={stroke} stopOpacity="0.9" />
              <Stop offset="0.75" stopColor={stroke} stopOpacity="0.15" />
              <Stop offset="1" stopColor={stroke} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="100" cy="100" r="90" fill={`url(#${g(k,'corona')})`} />
          <Circle cx="100" cy="100" r="55" fill={discovered ? '#0A0A0A' : '#141414'} />
          <Circle cx="100" cy="100" r="55" stroke={stroke} strokeWidth="1" fill="none" />
        </Svg>
      );
    case 'painita':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Polygon
            points="100,25 155,80 130,170 70,170 45,80"
            fill={`url(#${g(k,'metal')})`}
            stroke={stroke}
            strokeWidth="1"
          />
          <Polygon
            points="100,25 155,80 100,110 45,80"
            fill={discovered ? '#F2D896' : '#3A3A3A'}
            opacity="0.55"
          />
          <Polygon
            points="45,80 100,110 70,170"
            fill={discovered ? '#7A5E28' : '#1F1F1F'}
            opacity="0.55"
          />
        </Svg>
      );
    case 'apex':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Polygon
            points="100,30 170,160 30,160"
            fill={`url(#${g(k,'metal')})`}
            stroke={stroke}
            strokeWidth="1"
          />
          <Polygon
            points="100,30 170,160 100,160"
            fill={discovered ? '#7A5E28' : '#1F1F1F'}
            opacity="0.5"
          />
          <Line x1="100" y1="30" x2="100" y2="160" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.8" />
        </Svg>
      );
    case 'aureon':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <G>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + Math.cos(angle) * 45;
              const y1 = 100 + Math.sin(angle) * 45;
              const x2 = 100 + Math.cos(angle) * 85;
              const y2 = 100 + Math.sin(angle) * 85;
              return (
                <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.2" />
              );
            })}
          </G>
          <Circle cx="100" cy="100" r="34" fill={`url(#${g(k,'sphere')})`} />
        </Svg>
      );
    case 'obsidian':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Polygon
            points="80,30 130,45 140,170 65,165"
            fill={discovered ? '#1A1A1A' : '#0F0F0F'}
            stroke={stroke}
            strokeWidth="1"
          />
          <Polygon
            points="80,30 105,32 108,168 65,165"
            fill={discovered ? '#2A2A2A' : '#141414'}
          />
        </Svg>
      );
    case 'alfalium':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <G stroke={strokeDim} strokeWidth="0.8">
            <Line x1="100" y1="45" x2="145" y2="72" />
            <Line x1="145" y1="72" x2="145" y2="128" />
            <Line x1="145" y1="128" x2="100" y2="155" />
            <Line x1="100" y1="155" x2="55" y2="128" />
            <Line x1="55" y1="128" x2="55" y2="72" />
            <Line x1="55" y1="72" x2="100" y2="45" />
            <Line x1="100" y1="45" x2="100" y2="100" />
            <Line x1="145" y1="72" x2="100" y2="100" />
            <Line x1="145" y1="128" x2="100" y2="100" />
            <Line x1="100" y1="155" x2="100" y2="100" />
            <Line x1="55" y1="128" x2="100" y2="100" />
            <Line x1="55" y1="72" x2="100" y2="100" />
          </G>
          {[
            [100, 45], [145, 72], [145, 128], [100, 155], [55, 128], [55, 72], [100, 100],
          ].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={i === 6 ? 5 : 3.5} fill={`url(#${g(k,'sphere')})`} />
          ))}
        </Svg>
      );
    case 'omeguium':
    default:
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <GoldDefs k={k} discovered={discovered} />
          <Rect x="55" y="55" width="90" height="90" fill={`url(#${g(k,'metal')})`} stroke={stroke} strokeWidth="1" />
          <Polygon points="55,55 100,32 145,55" fill={discovered ? '#F2D896' : '#3A3A3A'} opacity="0.55" />
          <Polygon points="145,55 168,100 145,145" fill={discovered ? '#7A5E28' : '#1F1F1F'} opacity="0.55" />
        </Svg>
      );
  }
}
