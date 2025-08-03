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

];