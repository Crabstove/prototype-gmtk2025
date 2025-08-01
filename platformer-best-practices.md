# Platformer Best Practices - Boomerang Platformer

## Core Movement Principles

### 1. Responsive Controls
- **Direct velocity control** over force-based physics for precise movement
- **Instant direction changes** - no momentum preservation for tight controls

### 2. Gravity and Falling
- **Variable gravity multipliers:**
  - Normal: 1x gravity
  - Falling: 2.5x gravity (feels snappier)
- **Terminal velocity:** Cap max fall speed at ~400-500 units/s
- **Fast fall option:** Hold down for 1.5x fall speed

### 3. Wall Collision Prevention
- **Zero friction when airborne** - prevents sticking
- **Separate X/Y velocity handling** - don't let walls affect vertical movement
- **Contact offset:** Add small gap (0.1-0.5 units) between player and walls

### 4. Ground Detection
- **Multi-point detection:** 3 rays (left, center, right) or overlap circles
- **Ground buffer:** Consider grounded within 2-3 units of surface
- **Velocity-based backup:** isGrounded = true if |velocity.y| < threshold
- **State persistence:** Maintain grounded state for 1-2 frames after leaving ground

## Boomerang-Specific Considerations

### 1. Movement Without Jumping
- **Tighter ground controls** since horizontal movement is primary
- **Smooth acceleration curves** (0.2s to reach max speed)
- **Distinct crouch/slide speeds** for movement variety
- **Momentum preservation** during slides for flow

### 2. State Management
```
Core States:
- Idle: No input, grounded
- Moving: Horizontal input, grounded
- Crouching: Down input, reduced speed
- Sliding: Crouch at max speed, momentum-based
- Airborne: Not grounded (two sub-states)
  - Falling: Limited L/R control at crouch speed
  - Riding: No L/R control, only catch/dismount
- Blocking: Defensive stance (no boomerang)
```

### 3. Physics Constants (Recommended)
```typescript
GRAVITY: 1200-1600 units/s²
MAX_FALL_SPEED: 400-500 units/s
MOVE_SPEED: 200 units/s
ACCELERATION_TIME: 0.15-0.2s
DECELERATION_TIME: 0.1-0.15s
GROUND_FRICTION: 0.7
AIR_FRICTION: 0.0
SLIDE_INITIAL_BOOST: 1.5x move speed
SLIDE_DECELERATION: 150 units/s²
```

## Game Feel Enhancements

### 1. Forgiveness Mechanics
- **Edge Correction:** Snap to platform edges within 2-3 units

### 2. Visual Feedback
- **State-based colors/animations** for clear player feedback
- **Particle effects** for slides, landings, state changes
- **Smooth camera following** with lookahead based on velocity
- **Screen shake** for impactful moments (landing from height)

### 3. Polish Details
- **Variable slide speed on slopes** - accelerate downhill
- **Momentum redirection** when catching boomerang while riding
- **Grace periods** for state transitions (slide->crouch delay: 0.5s)

## Implementation Priority

1. **Fix sticky walls:** Implement contact offset + zero air friction
2. **Improve fall feel:** Add gravity multipliers for different states
3. **Polish ground detection:** Multi-point system with velocity backup
4. **Enhance visual feedback:** State colors, particles, camera work

## Debug Features
- Visual state indicator (color/text)
- Velocity vectors visualization
- Collision point indicators
- Frame-by-frame advance option
- State transition logging