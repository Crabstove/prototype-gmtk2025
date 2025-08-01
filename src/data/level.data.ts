import { PLATFORM_COLORS } from '../constants/game.constants';

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: number;
}

export const LEVEL_1_PLATFORMS: PlatformData[] = [
  { x: 0, y: 550, width: 1600, height: 50, color: PLATFORM_COLORS.GROUND },
  { x: 200, y: 450, width: 150, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 450, y: 350, width: 120, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 650, y: 400, width: 100, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 850, y: 300, width: 130, height: 20, color: PLATFORM_COLORS.PLATFORM },
  { x: 1100, y: 250, width: 110, height: 20, color: PLATFORM_COLORS.PLATFORM },
];