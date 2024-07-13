"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { grey } from "@mui/material/colors";
import { FC } from "react";

export const ParticlesBox: FC = () => {
  initParticlesEngine(async (engine) => {
    await loadSlim(engine);
  });

  return (
    <Particles
      options={{
        fpsLimit: 120,
        particles: {
          color: {
            value: grey[100],
          },
          move: {
            direction: MoveDirection.topLeft,
            enable: true,
            outModes: {
              default: OutMode.out,
            },
            random: true,
            speed: { min: 0.2, max: 1 },
            gravity: {
              enable: true,
              inverse: true,
              maxSpeed: { min: 0.3, max: 0.5 },
              acceleration: { min: 0.1, max: 0.3 },
            },
          },
          number: {
            value: 100,
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
          },
          shape: {
            type: "circle",
          },
          shadow: {
            enable: true,
            color: grey[100],
            blur: 3,
          },
          size: {
            animation: {
              enable: true,
              mode: "random",
              speed: { min: 0.1, max: 1 },
            },
            value: { min: 1, max: 7 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};
