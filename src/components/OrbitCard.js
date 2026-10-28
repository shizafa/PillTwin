"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp01((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}

function easeInOut(t) {
  return t * t * (3 - 2 * t);
}

const ENTER_END = 0.2;
const ORBIT_START = 0.2;
const ORBIT_END = 0.7;
// Cards should be visible almost as soon as the section pins, not fade in
// gradually over the whole enter phase, so there is no text-only dead zone.
const OPACITY_IN_END = 0.04;

function frameAt(progress, cfg) {
  const { enter, finalScatter, ringRadiusX, ringRadiusY, baseAngle, spinTurns } = cfg;

  const enterT = easeInOut(mapRange(progress, 0, ENTER_END, 0, 1));
  const centerX = enter.x * (1 - enterT);
  const centerY = enter.y * (1 - enterT);

  const toRingT = easeInOut(mapRange(progress, ORBIT_START, ORBIT_START + 0.15, 0, 1));
  const radiusT = easeInOut(mapRange(progress, ORBIT_START, ORBIT_START + 0.12, 0, 1));
  const ringT = mapRange(progress, ORBIT_START, ORBIT_END, 0, 1);
  const angle = baseAngle + ringT * spinTurns * Math.PI * 2;
  const ringX = Math.cos(angle) * ringRadiusX * radiusT;
  const ringY = Math.sin(angle) * ringRadiusY * radiusT;

  const blendedX = centerX * (1 - toRingT) + ringX * toRingT;
  const blendedY = centerY * (1 - toRingT) + ringY * toRingT;

  const endAngle = baseAngle + spinTurns * Math.PI * 2;
  const ringEndX = Math.cos(endAngle) * ringRadiusX;
  const ringEndY = Math.sin(endAngle) * ringRadiusY;

  const preScatterX = progress <= ORBIT_END ? blendedX : ringEndX;
  const preScatterY = progress <= ORBIT_END ? blendedY : ringEndY;

  const scatterT = easeInOut(mapRange(progress, ORBIT_END, 1, 0, 1));
  const x = preScatterX * (1 - scatterT) + finalScatter.x * scatterT;
  const y = preScatterY * (1 - scatterT) + finalScatter.y * scatterT;

  const enterScale = mapRange(progress, 0, ENTER_END, 0.7, 1);
  const scale = enterScale * (1 - scatterT) + finalScatter.scale * scatterT;
  // Cards stay upright through the ring; only the hand-defined scatter tilt applies.
  const rotate = finalScatter.rotate * scatterT;
  const enterOpacity = mapRange(progress, 0, OPACITY_IN_END, 0, 1);

  return { x, y, rotate, scale, opacity: clamp01(enterOpacity) };
}

export default function OrbitCard({ card, index, total, scrollYProgress }) {
  const baseAngle = (index / total) * Math.PI * 2;
  const cfg = {
    enter: card.enter,
    finalScatter: card.finalScatter,
    ringRadiusX: 480,
    ringRadiusY: 300,
    baseAngle,
    spinTurns: 1.4,
  };

  const frame = useTransform(scrollYProgress, (v) => frameAt(v, cfg));
  const x = useTransform(frame, (f) => f.x);
  const y = useTransform(frame, (f) => f.y);
  const rotate = useTransform(frame, (f) => f.rotate);
  const scale = useTransform(frame, (f) => f.scale);
  const opacity = useTransform(frame, (f) => f.opacity);

  return (
    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 sm:h-24 sm:w-24">
      <motion.div
        style={{ x, y, rotate, scale, opacity }}
        className="h-full w-full overflow-hidden rounded-xl shadow-md"
      >
        <Image
          src={card.image}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
