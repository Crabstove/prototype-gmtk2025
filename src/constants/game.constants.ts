export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: 0x87CEEB,
  ANTIALIAS: true,
} as const;

export const PHYSICS = {
  // Core physics
  GRAVITY: { x: 0.0, y: 400 },  // Platformer gravity (pixels/s²)
  CUSTOM_GRAVITY: 750,  // Custom gravity for player physics (pixels/s²)
  FIXED_TIME_STEP: 1 / 60,
  MAX_FALL_SPEED: 600,  // Terminal velocity
  
  // Collision and detection
  PLAYER_MOUNT_OFFSET: 20,  // Y offset when player rides boomerang
  CATCH_DISTANCE: 30,  // Distance to catch boomerang
  CATCH_COOLDOWN: 0.2,  // Cooldown after catching before can aim again
  
  // Dismount mechanics
  DISMOUNT_SPEED: 700,  // Launch speed when dismounting from boomerang
} as const;

export const PLAYER_CONFIG = {
  WIDTH: 32,
  HEIGHT: 48,
  CROUCH_HEIGHT: 18,
  COLOR: 0xff6b6b,
  MOVE_SPEED: 170,
  CROUCH_MOVE_SPEED: 90, 
  SLIDE_SPEED: 300,  // 2x move speed - good boost with momentum
  MAX_SLIDE_SPEED: 500,  // 2.9x move speed for slopes
  FRICTION: 0.7,
  RESTITUTION: 0,
  VELOCITY_THRESHOLD: 10,
  GROUND_CHECK_DISTANCE: 2
} as const;

export const CAMERA_CONFIG = {
  LERP_FACTOR: 0.1,
} as const;

export const DISMOUNT_CONFIG = {
  MIN_BOOST_RATIO: 0.55,
  Y_SPEED_HANG_MULTIPLIER: 0.5,
  X_SPEED_STRAIGHT_MULTIPLIER: 1.43,
  HORIZONTAL_UPWARD_BOOST: -200,
  INERTIA_BLEND: 0.35,
  BOOMERANG_VELOCITY_FACTOR: 0.25,
} as const;

export const PLATFORM_COLORS = {
  GROUND: 0x4a4a4a,
  PLATFORM: 0x6a6a6a,
} as const;

export const BOOMERANG_CONFIG = {
  THROW_SPEED: 500,  // Units per second
  ACCELERATION_TIME: 0.1,  // Time to reach full speed
  HANG_TIME: 0.5,  // Time paused at trajectory peaks
  THROW_DISTANCE: 400,  // Max travel distance from origin
  MIN_ANGLE: 90,  // Minimum throw angle (degrees) - 90 is straight up
  MAX_ANGLE: 180,  // Maximum throw angle (degrees) - 180 is horizontal
  GRACE_PERIOD: 0.5,  // Half second where boomerang can't be caught
} as const;

export const TIME_SLOW_CONFIG = {
  TIME_SCALE: 0.1,  // 90% slow (less extreme for testing)
  OVERLAY_COLOR: 0x4444ff,  // Blue tint
  OVERLAY_ALPHA: 0.15,  // Subtle overlay
  VIGNETTE_ALPHA: 0.3,  // Edge darkening
} as const;

export const COLLISION_GROUPS = {
  PLAYER_STANDING: 0x0001,
  PLAYER_CROUCHING: 0x0002,
  ENVIRONMENT: 0x0004,
  BOOMERANG: 0x0008,
  ENEMY: 0x0010,
} as const;

export const PARRY_CONFIG = {
  WINDOW_DURATION: 1, 
} as const;

export const TRAJECTORY_CONFIG = {
  ANGLE_RANGE: 80,  // Degrees from 180 to 100 (min angle)
  HEIGHT_MULTIPLIER: 0.5,  // Peak height as ratio of throw distance
  STRAIGHT_LINE_THRESHOLD: 168,  // Angles >= this are straight lines
} as const;