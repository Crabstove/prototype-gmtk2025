export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: 0x18181b,
  ANTIALIAS: true,
} as const;

export const PHYSICS = {
  // Core physics
  GRAVITY: { x: 0.0, y: 400 },  // Platformer gravity (pixels/s²)
  CUSTOM_GRAVITY: 800,  // Custom gravity for player physics (pixels/s²)
  FIXED_TIME_STEP: 1 / 60,
  MAX_FALL_SPEED: 600,  // Terminal velocity
  
  // Collision and detection
  PLAYER_MOUNT_OFFSET: 35,  // Y offset when player rides boomerang
  CATCH_DISTANCE: 20,  // Distance to catch boomerang
  CATCH_COOLDOWN: 0.2,  // Cooldown after catching before can aim again
  
  // Dismount mechanics
  DISMOUNT_SPEED: 800,  // Launch speed when dismounting from boomerang
} as const;

export const PLAYER_CONFIG = {
  WIDTH: 32,
  HEIGHT: 64,
  CROUCH_HEIGHT: 32,
  COLOR: 0xec4899,
  MOVE_SPEED: 340,
  CROUCH_MOVE_SPEED: 180, 
  SLIDE_SPEED: 650,  // 2x move speed - good boost with momentum
  MAX_SLIDE_SPEED: 1000,  // 2.9x move speed for slopes
  FRICTION: 0.7,
  RESTITUTION: 0,
  VELOCITY_THRESHOLD: 10,
  GROUND_CHECK_DISTANCE: 2
} as const;

export const CAMERA_CONFIG = {
  LERP_FACTOR: 0.1,
  SMOOTHING: 6, // Higher = smoother camera
} as const;

export const DISMOUNT_CONFIG = {
  MIN_BOOST_RATIO: 0.55,
  Y_SPEED_HANG_MULTIPLIER: 0.5,
  X_SPEED_STRAIGHT_MULTIPLIER: 2,
  HORIZONTAL_UPWARD_BOOST: -400,
  INERTIA_BLEND: 0.35,
  BOOMERANG_VELOCITY_FACTOR: 0.25,
} as const;

export const PLATFORM_COLORS = {
  GROUND: 0xf4f4f5,
  PLATFORM: 0xf4f4f5,
} as const;

export const BOOMERANG_CONFIG = {
  THROW_SPEED: 500,  // Units per second
  HANG_TIME: 0.5,  // Time paused at trajectory peaks
  THROW_DISTANCE: 400,  // Max travel distance from origin
  MIN_ANGLE: 90,  // Minimum throw angle (degrees) - 90 is straight up
  MAX_ANGLE: 180,  // Maximum throw angle (degrees) - 180 is horizontal
  TRAJECTORY_PREVIEW_POINTS: 50,  // Number of points in preview line
  PREVIEW_COLOR: 0xef4444,  // White preview line
  PREVIEW_ALPHA: 0.5,  // Preview line transparency
  PREVIEW_WIDTH: 2,  // Preview line width
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