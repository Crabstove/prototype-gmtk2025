export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: 0x87CEEB,
  ANTIALIAS: true,
} as const;

export const PHYSICS = {
  // Core physics
  GRAVITY: { x: 0.0, y: 9.81 },  // Standard platformer gravity
  FIXED_TIME_STEP: 1 / 60,
  FALL_GRAVITY_MULTIPLIER: 40,  // Applied when falling for snappy feel
  MAX_FALL_SPEED: 500,  // Terminal velocity
  
  // Collision and detection
  PLAYER_MOUNT_OFFSET: 20,  // Y offset when player rides boomerang
  CATCH_DISTANCE: 30,  // Distance to catch boomerang
  WALL_CHECK_DISTANCE: 3,  // Extra distance for wall detection
  WALL_EMBED_THRESHOLD: 2,  // Pixels before push force applied
  VELOCITY_EPSILON: 0.001,  // Minimum velocity change to update
  AIRBORNE_VELOCITY_THRESHOLD: 50,  // Y velocity threshold for wall slide
  WALL_SLIDE_VELOCITY_THRESHOLD: 5,  // X velocity threshold for wall slide
  CATCH_COOLDOWN: 0.2,  // Cooldown after catching before can aim again
  STRAIGHT_LINE_DISMOUNT_BOOST: -200,  // Upward boost when dismounting from straight trajectory
  STRAIGHT_LINE_Y_THRESHOLD: 10,  // Y velocity below this is considered straight line
} as const;

export const PLAYER_CONFIG = {
  WIDTH: 32,
  HEIGHT: 48,
  CROUCH_HEIGHT: 18,
  COLOR: 0xff6b6b,
  MOVE_SPEED: 180,
  CROUCH_MOVE_SPEED: 90,  // Half speed while crouched
  SLIDE_SPEED: 270,  // 1.5x move speed for noticeable boost
  MAX_SLIDE_SPEED: 360,  // 2x move speed for slopes
  ACCELERATION_TIME: 0.2,  // Time in seconds to reach max speed
  DECELERATION_TIME: 0.15,  // Time in seconds to stop from max speed
  SLIDE_DECELERATION: 150,  // Still using physics-based for slides
  SLIDE_TO_CROUCH_TIME: 0.5,  // Time at zero velocity before slide->crouch transition
  FRICTION: 0.7,
  RESTITUTION: 0,
  VELOCITY_THRESHOLD: 10,
  GROUND_CHECK_DISTANCE: 2,
  WALL_SEPARATION_FORCE: 5,  // Force applied to push away from walls
  WALL_SLIDE_DAMPING: 0.9,  // Velocity reduction when sliding against walls
} as const;

export const CAMERA_CONFIG = {
  LERP_FACTOR: 0.1,
  OFFSET_Y: 0,
} as const;

export const PLATFORM_COLORS = {
  GROUND: 0x4a4a4a,
  PLATFORM: 0x6a6a6a,
} as const;

export const BOOMERANG_CONFIG = {
  THROW_SPEED: 400,  // Units per second
  ACCELERATION_TIME: 0.1,  // Time to reach full speed
  HANG_TIME: 0.5,  // Time paused at trajectory peaks
  THROW_DISTANCE: 400,  // Max travel distance from origin
  MIN_ANGLE: 100,  // Minimum throw angle (degrees)
  MAX_ANGLE: 180,  // Maximum throw angle (degrees) - 180 is horizontal
  TRAJECTORY_PREVIEW_POINTS: 50,  // Number of points in preview line
  PREVIEW_COLOR: 0xffffff,  // White preview line
  PREVIEW_ALPHA: 0.5,  // Preview line transparency
  PREVIEW_WIDTH: 2,  // Preview line width
  GRACE_PERIOD: 0.5,  // Half second where boomerang can't be caught
} as const;

export const TIME_SLOW_CONFIG = {
  TIME_SCALE: 0.1,  // 90% slow (less extreme for testing)
  TRANSITION_SPEED: 0.15,  // How fast to transition in/out
  OVERLAY_COLOR: 0x4444ff,  // Blue tint
  OVERLAY_ALPHA: 0.15,  // Subtle overlay
  VIGNETTE_ALPHA: 0.3,  // Edge darkening
  PARTICLE_DENSITY: 20,  // Floating particles for atmosphere
} as const;

export const COLLISION_GROUPS = {
  PLAYER_STANDING: 0x0001,
  PLAYER_CROUCHING: 0x0002,
  ENVIRONMENT: 0x0004,
  BOOMERANG: 0x0008,
  ENEMY: 0x0010,
} as const;

export const PARRY_CONFIG = {
  WINDOW_DURATION: 0.4,  // 0.4 seconds after block input
  PEAK_INPUT_BUFFER: 0.2,  // 0.2 seconds grace period for peak catch
} as const;

export const TRAJECTORY_CONFIG = {
  ANGLE_RANGE: 80,  // Degrees from 180 to 100 (min angle)
  HEIGHT_MULTIPLIER: 0.5,  // Peak height as ratio of throw distance
  STRAIGHT_LINE_THRESHOLD: 168,  // Angles >= this are straight lines
} as const;