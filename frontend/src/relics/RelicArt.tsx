import React from 'react';
import Svg, {
  Circle, Defs, LinearGradient, RadialGradient, Stop, Polygon,
  G, Ellipse, Line, Rect,
} from 'react-native-svg';
import { COLORS } from '../theme';
import { RelicKey } from './data';

type Props = {
  relicKey: RelicKey;
  size?: number;
  discovered?: boolean;
};

const g = (k: string, id: string) => `${id}-${k}`;

// Brushed-gold gradient set — bright highlight (top-left) → matte body → deep shadow
function MetalDefs({ k, discovered }: { k: string; discovered: boolean }) {
  const c1 = discovered ? COLORS.gold : '#2E2E2E';
  const c2 = discovered ? COLORS.goldDeep : '#181818';
  const c3 = discovered ? COLORS.goldLight : '#3A3A3A';
  const c4 = discovered ? '#4A3A18' : '#0F0F0F';
  return (
    <Defs>
      {/* linear brushed gold */}
      <LinearGradient id={g(k, 'brush')} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={c3} />
        <Stop offset="0.32" stopColor={c1} />
        <Stop offset="0.6" stopColor={c2} />
        <Stop offset="1" stopColor={c4} />
      </LinearGradient>
      {/* radial sphere-like */}
      <RadialGradient id={g(k, 'orb')} cx="0.32" cy="0.28" rx="0.9" ry="0.9">
        <Stop offset="0" stopColor={c3} />
        <Stop offset="0.35" stopColor={c1} />
        <Stop offset="0.75" stopColor={c2} />
        <Stop offset="1" stopColor={c4} />
      </RadialGradient>
      {/* facet — sharp edge for crystals */}
      <LinearGradient id={g(k, 'facet')} x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={c3} />
        <Stop offset="1" stopColor={c2} />
      </LinearGradient>
    </Defs>
  );
}

export default function RelicArt({ relicKey, size = 220, discovered = true }: Props) {
  const s = size;
  const k = relicKey + (discovered ? '-on' : '-off');
  const stroke = discovered ? COLORS.gold : '#2E2E2E';
  const strokeDim = discovered ? COLORS.goldDeep : '#1F1F1F';

  switch (relicKey) {
    case 'genesis':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Circle cx="100" cy="100" r="72" fill={`url(#${g(k,'orb')})`} />
          <Circle cx="100" cy="100" r="72" stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.6" />
        </Svg>
      );

    case 'aeternum':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Ellipse cx="72" cy="100" rx="42" ry="42" stroke={`url(#${g(k,'brush')})`} strokeWidth="5" fill="none" />
          <Ellipse cx="128" cy="100" rx="42" ry="42" stroke={`url(#${g(k,'brush')})`} strokeWidth="5" fill="none" />
        </Svg>
      );

    case 'constellation':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <G stroke={strokeDim} strokeWidth="0.6" opacity="0.5">
            <Line x1="60" y1="70" x2="120" y2="50" />
            <Line x1="120" y1="50" x2="150" y2="110" />
            <Line x1="150" y1="110" x2="90" y2="150" />
            <Line x1="90" y1="150" x2="60" y2="70" />
            <Line x1="60" y1="70" x2="150" y2="110" />
            <Line x1="120" y1="50" x2="90" y2="150" />
          </G>
          {[
            [60, 70, 4], [120, 50, 4], [150, 110, 4], [90, 150, 4], [100, 100, 6],
          ].map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} fill={`url(#${g(k,'orb')})`} />
          ))}
        </Svg>
      );

    case 'eclipse':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Defs>
            <RadialGradient id={g(k,'corona')} cx="0.5" cy="0.5" rx="0.5" ry="0.5">
              <Stop offset="0.55" stopColor={stroke} stopOpacity="1" />
              <Stop offset="0.72" stopColor={stroke} stopOpacity="0.35" />
              <Stop offset="1" stopColor={stroke} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="100" cy="100" r="96" fill={`url(#${g(k,'corona')})`} />
          <Circle cx="100" cy="100" r="56" fill={COLORS.bg} />
          <Circle cx="100" cy="100" r="56" stroke={stroke} strokeWidth="0.8" fill="none" />
        </Svg>
      );

    case 'painita':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Polygon
            points="100,25 155,80 130,170 70,170 45,80"
            fill={`url(#${g(k,'facet')})`}
            stroke={stroke}
            strokeWidth="0.8"
          />
          <Polygon points="100,25 155,80 100,110 45,80" fill={discovered ? COLORS.goldLight : '#2E2E2E'} opacity="0.65" />
          <Polygon points="45,80 100,110 70,170" fill={discovered ? COLORS.goldDeep : '#0F0F0F'} opacity="0.5" />
          <Polygon points="155,80 130,170 100,110" fill={discovered ? '#8A7038' : '#181818'} opacity="0.35" />
        </Svg>
      );

    case 'apex':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Polygon points="100,28 172,164 28,164" fill={`url(#${g(k,'facet')})`} stroke={stroke} strokeWidth="0.8" />
          <Polygon points="100,28 172,164 100,164" fill={discovered ? COLORS.goldDeep : '#181818'} opacity="0.6" />
        </Svg>
      );

    case 'aureon':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const x1 = 100 + Math.cos(angle) * 42;
            const y1 = 100 + Math.sin(angle) * 42;
            const x2 = 100 + Math.cos(angle) * 88;
            const y2 = 100 + Math.sin(angle) * 88;
            return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={i % 2 === 0 ? 1.2 : 0.6} opacity={i % 2 === 0 ? 1 : 0.5} />;
          })}
          <Circle cx="100" cy="100" r="34" fill={`url(#${g(k,'orb')})`} />
        </Svg>
      );

    case 'obsidian':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Polygon
            points="80,28 132,42 142,172 62,168"
            fill={discovered ? '#141414' : '#0B0B0B'}
            stroke={stroke}
            strokeWidth="0.8"
          />
          <Polygon points="80,28 106,32 108,170 62,168" fill={discovered ? '#1F1F1F' : '#0F0F0F'} />
        </Svg>
      );

    case 'alfalium':
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <G stroke={strokeDim} strokeWidth="0.6" opacity="0.55">
            <Line x1="100" y1="42" x2="148" y2="70" />
            <Line x1="148" y1="70" x2="148" y2="130" />
            <Line x1="148" y1="130" x2="100" y2="158" />
            <Line x1="100" y1="158" x2="52" y2="130" />
            <Line x1="52" y1="130" x2="52" y2="70" />
            <Line x1="52" y1="70" x2="100" y2="42" />
            <Line x1="100" y1="42" x2="100" y2="100" />
            <Line x1="148" y1="70" x2="100" y2="100" />
            <Line x1="148" y1="130" x2="100" y2="100" />
            <Line x1="100" y1="158" x2="100" y2="100" />
            <Line x1="52" y1="130" x2="100" y2="100" />
            <Line x1="52" y1="70" x2="100" y2="100" />
          </G>
          {[
            [100,42,4],[148,70,4],[148,130,4],[100,158,4],[52,130,4],[52,70,4],[100,100,6],
          ].map(([x,y,r],i)=>(
            <Circle key={i} cx={x} cy={y} r={r} fill={`url(#${g(k,'orb')})`} />
          ))}
        </Svg>
      );

    case 'omeguium':
    default:
      return (
        <Svg width={s} height={s} viewBox="0 0 200 200">
          <MetalDefs k={k} discovered={discovered} />
          <Rect x="55" y="55" width="90" height="90" fill={`url(#${g(k,'brush')})`} stroke={stroke} strokeWidth="0.8" />
          <Polygon points="55,55 100,32 145,55" fill={discovered ? COLORS.goldLight : '#2E2E2E'} opacity="0.6" />
          <Polygon points="145,55 168,100 145,145" fill={discovered ? COLORS.goldDeep : '#0F0F0F'} opacity="0.5" />
        </Svg>
      );
  }
}
