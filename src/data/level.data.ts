import { PLATFORM_COLORS } from '../constants/game.constants';

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: number;
}

export const LEVEL_1_PLATFORMS: PlatformData[] = [
  { x: 0, y: 550, width: 800, height: 50, color: PLATFORM_COLORS.GROUND },
  { x: 900, y: 550, width: 300, height: 50, color: PLATFORM_COLORS.PLATFORM },


  { x: 1300, y: 350, width: 150, height: 50, color: PLATFORM_COLORS.PLATFORM },

  { x: 1450, y: 450, width: 800, height: 50, color: PLATFORM_COLORS.PLATFORM },

  { x: 200, y: 450, width: 150, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 450, y: 350, width: 120, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 650, y: 400, width: 100, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 850, y: 300, width: 130, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 1100, y: 250, width: 110, height: 20, color: PLATFORM_COLORS.PLATFORM },


  { x: 0, y: 250, width: 150, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 850, y: 100, width: 120, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 600, y: 300, width: 100, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 500, y: 200, width: 130, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 200, y: 150, width: 110, height: 20, color: PLATFORM_COLORS.PLATFORM },

  { x: 200, y: 0, width: 150, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 450, y: -100, width: 120, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 650, y: -50, width: 100, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 850, y: -150, width: 130, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 1100, y: -200, width: 110, height: 20, color: PLATFORM_COLORS.PLATFORM },
];