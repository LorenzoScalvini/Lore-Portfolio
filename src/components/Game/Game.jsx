import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Game.module.css"

import ostAudio from "../../assets/game/ost.mp3"
import deathAudio from "../../assets/game/death.mp3"
import dangerAudio from "../../assets/game/danger.mp3"
import attackAudio from "../../assets/game/attack.mp3"
import flamecastAudio from "../../assets/game/flamecast.mp3"
import asrielPng from "../../assets/game/asriel.png"
import asrielAngryGif from "../../assets/game/asriel-angry.gif"
import heartImage from "../../assets/game/heart.png"
import flamesImage from "../../assets/game/flames.png"
import midImage from "../../assets/game/mid.png"

const GAME_CONFIG = {
  FLAME_SIZE: 32,
  HEART_SIZE: 24,
  BOX_SIZE: 280,
  MID_ATTACK_WIDTH: 80,
  MID_ATTACK_HEIGHT: 80,
  FLAME_ATTACK_DURATION: 9000,
  SPECIAL_ATTACK_DURATION: 6000,
  TRANSITION_DURATION: 1000,
  DANGER_ZONE_WARNING_DURATION: 3500,
  DANGER_ZONE_ACTIVE_DURATION: 5000,
}

const horizontalAttack = {
  name: "horizontal",
  getForward: () => [
    { id: 1, x: -80, y: 60, dx: 2.0, dy: 0 },
    { id: 2, x: GAME_CONFIG.BOX_SIZE + 80, y: 120, dx: -2.3, dy: 0 },
    { id: 3, x: -100, y: 180, dx: 1.8, dy: 0 },
    { id: 4, x: GAME_CONFIG.BOX_SIZE + 100, y: 240, dx: -2.1, dy: 0 },
    { id: 5, x: -60, y: 30, dx: 2.5, dy: 0 },
    { id: 6, x: GAME_CONFIG.BOX_SIZE + 60, y: 90, dx: -2.7, dy: 0 },
  ],
  getInverted: () => [
    { id: 1, x: GAME_CONFIG.BOX_SIZE + 80, y: 220, dx: -2.0, dy: 0 },
    { id: 2, x: -80, y: 160, dx: 2.3, dy: 0 },
    { id: 3, x: GAME_CONFIG.BOX_SIZE + 100, y: 100, dx: -1.8, dy: 0 },
    { id: 4, x: -100, y: 40, dx: 2.1, dy: 0 },
    { id: 5, x: GAME_CONFIG.BOX_SIZE + 60, y: 250, dx: -2.5, dy: 0 },
    { id: 6, x: -60, y: 190, dx: 2.7, dy: 0 },
  ]
}

const verticalAttack = {
  name: "vertical",
  getForward: () => [
    { id: 7, x: 60, y: -80, dx: 0, dy: 2.0 },
    { id: 8, x: 120, y: GAME_CONFIG.BOX_SIZE + 80, dx: 0, dy: -2.3 },
    { id: 9, x: 180, y: -100, dx: 0, dy: 1.8 },
    { id: 10, x: 240, y: GAME_CONFIG.BOX_SIZE + 100, dx: 0, dy: -2.1 },
    { id: 11, x: 30, y: -60, dx: 0, dy: 2.5 },
    { id: 12, x: 90, y: GAME_CONFIG.BOX_SIZE + 60, dx: 0, dy: -2.7 },
  ],
  getInverted: () => [
    { id: 7, x: 220, y: GAME_CONFIG.BOX_SIZE + 80, dx: 0, dy: -2.0 },
    { id: 8, x: 160, y: -80, dx: 0, dy: 2.3 },
    { id: 9, x: 100, y: GAME_CONFIG.BOX_SIZE + 100, dx: 0, dy: -1.8 },
    { id: 10, x: 40, y: -100, dx: 0, dy: 2.1 },
    { id: 11, x: 250, y: GAME_CONFIG.BOX_SIZE + 60, dx: 0, dy: -2.5 },
    { id: 12, x: 190, y: -60, dx: 0, dy: 2.7 },
  ]
}

const diagonalAttack = {
  name: "diagonal",
  getForward: () => [
    { id: 13, x: -80, y: -80, dx: 1.6, dy: 1.6 },
    { id: 14, x: GAME_CONFIG.BOX_SIZE + 80, y: GAME_CONFIG.BOX_SIZE + 80, dx: -1.8, dy: -1.8 },
    { id: 15, x: -100, y: GAME_CONFIG.BOX_SIZE + 100, dx: 2.0, dy: -2.0 },
    { id: 16, x: GAME_CONFIG.BOX_SIZE + 100, y: -100, dx: -2.2, dy: 2.2 },
    { id: 17, x: -60, y: -60, dx: 1.4, dy: 1.4 },
    { id: 18, x: GAME_CONFIG.BOX_SIZE + 60, y: GAME_CONFIG.BOX_SIZE + 60, dx: -1.6, dy: -1.6 },
  ],
  getInverted: () => [
    { id: 13, x: GAME_CONFIG.BOX_SIZE + 80, y: GAME_CONFIG.BOX_SIZE + 80, dx: -1.6, dy: -1.6 },
    { id: 14, x: -80, y: -80, dx: 1.8, dy: 1.8 },
    { id: 15, x: GAME_CONFIG.BOX_SIZE + 100, y: -100, dx: -2.0, dy: 2.0 },
    { id: 16, x: -100, y: GAME_CONFIG.BOX_SIZE + 100, dx: 2.2, dy: -2.2 },
    { id: 17, x: GAME_CONFIG.BOX_SIZE + 60, y: GAME_CONFIG.BOX_SIZE + 60, dx: -1.4, dy: -1.4 },
    { id: 18, x: -60, y: -60, dx: 1.6, dy: 1.6 },
  ]
}

const circleSpiralAttack = {
  name: "circle_spiral",
  getForward: () => {
    const centerX = GAME_CONFIG.BOX_SIZE / 2
    const centerY = GAME_CONFIG.BOX_SIZE / 2
    const spiralFlames = []
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      spiralFlames.push({
        id: 19 + i,
        x: centerX - GAME_CONFIG.FLAME_SIZE / 2,
        y: centerY - GAME_CONFIG.FLAME_SIZE / 2,
        dx: Math.cos(angle) * 0.8,
        dy: Math.sin(angle) * 0.8,
        isExpanding: true,
        currentRadius: 0,
        maxRadius: 140,
        angle: angle,
        speed: 1.2,
      })
    }
    return spiralFlames
  },
  getInverted: () => {
    const centerX = GAME_CONFIG.BOX_SIZE / 2
    const centerY = GAME_CONFIG.BOX_SIZE / 2
    const spiralFlames = []
    for (let i = 0; i < 6; i++) {
      const angle = -(i * Math.PI * 2) / 6
      spiralFlames.push({
        id: 19 + i,
        x: centerX - GAME_CONFIG.FLAME_SIZE / 2,
        y: centerY - GAME_CONFIG.FLAME_SIZE / 2,
        dx: Math.cos(angle) * -0.8,
        dy: Math.sin(angle) * -0.8,
        isExpanding: true,
        currentRadius: 0,
        maxRadius: 140,
        angle: angle,
        speed: 1.2,
      })
    }
    return spiralFlames
  }
}

const midAttackConfig = {
  width: GAME_CONFIG.MID_ATTACK_WIDTH,
  height: GAME_CONFIG.MID_ATTACK_HEIGHT,
  speed: 2.0,
  getRandomStart: () => {
    const fromRight = Math.random() > 0.5
    return {
      x: fromRight ? GAME_CONFIG.BOX_SIZE : -GAME_CONFIG.MID_ATTACK_WIDTH,
      y: Math.random() * (GAME_CONFIG.BOX_SIZE - GAME_CONFIG.MID_ATTACK_HEIGHT),
      direction: fromRight ? -1 : 1,
    }
  }
}

const allAttacks = [horizontalAttack, verticalAttack, diagonalAttack, circleSpiralAttack]
const flameWaveTypes = allAttacks.map(attack => attack.name)

const createAttack = (attackName, isInverted = false) => {
  const attack = allAttacks.find(a => a.name === attackName)
  if (!attack) return []
  
  return isInverted ? attack.getInverted() : attack.getForward()
}

const moveAttackProjectile = (projectile, attackName) => {
  let newX = projectile.x
  let newY = projectile.y
  const { BOX_SIZE, FLAME_SIZE } = GAME_CONFIG
  
  if (attackName === "circle_spiral" && projectile.isExpanding) {
    if (projectile.currentRadius < projectile.maxRadius) {
      projectile.currentRadius += projectile.speed
      const centerX = BOX_SIZE / 2
      const centerY = BOX_SIZE / 2
      newX = centerX + Math.cos(projectile.angle) * projectile.currentRadius - FLAME_SIZE / 2
      newY = centerY + Math.sin(projectile.angle) * projectile.currentRadius - FLAME_SIZE / 2
    } else {
      newX = projectile.x + projectile.dx
      newY = projectile.y + projectile.dy
    }
  } else {
    newX = projectile.x + projectile.dx
    newY = projectile.y + projectile.dy
  }
  
  if (newX > BOX_SIZE + 100) newX = -100 - FLAME_SIZE
  if (newX < -100 - FLAME_SIZE) newX = BOX_SIZE + 100
  if (newY > BOX_SIZE + 100) newY = -100 - FLAME_SIZE
  if (newY < -100 - FLAME_SIZE) newY = BOX_SIZE + 100
  
  return { ...projectile, x: newX, y: newY }
}

const moveMidAttack = (midAttack) => {
  let newDirection = midAttack.direction
  let newX = midAttack.x + midAttack.speed * midAttack.direction
  
  if (newX > GAME_CONFIG.BOX_SIZE) {
    newDirection = -1
    newX = GAME_CONFIG.BOX_SIZE
  } else if (newX < -GAME_CONFIG.MID_ATTACK_WIDTH) {
    newDirection = 1
    newX = -GAME_CONFIG.MID_ATTACK_WIDTH
  }
  
  return { ...midAttack, x: newX, direction: newDirection }
}

export default function Game() {
  const navigate = useNavigate()

  const [gameState, setGameState] = useState("loading")
  const [position, setPosition] = useState({ x: 128, y: 128 })
  const [countdown, setCountdown] = useState(3)

  const [zoneActive, setZoneActive] = useState(false)
  const [zoneCountdown, setZoneCountdown] = useState(3)
  const [zoneCountdownDisplay, setZoneCountdownDisplay] = useState(3)
  const [rainbowZoneOnRight, setRainbowZoneOnRight] = useState(true)
  const [rainbowZoneDeadly, setRainbowZoneDeadly] = useState(false)
  const [isZoneWarning, setIsZoneWarning] = useState(true)

  const [attackPhase, setAttackPhase] = useState("transition")
  const [flameCycleCount, setFlameCycleCount] = useState(0)
  const [isSecondCycle, setIsSecondCycle] = useState(false)

  const [visibleFlames, setVisibleFlames] = useState([])
  const [currentFlameWave, setCurrentFlameWave] = useState(0)

  const [midAttack, setMidAttack] = useState({
    active: false,
    x: -GAME_CONFIG.MID_ATTACK_WIDTH,
    y: GAME_CONFIG.BOX_SIZE / 2 - GAME_CONFIG.MID_ATTACK_HEIGHT / 2,
    speed: 1.5,
    direction: 1,
  })

  const keys = useRef({ w: false, a: false, s: false, d: false })
  const intervalRef = useRef(null)
  const attackCycleRef = useRef(null)
  const specialAttackCycleRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const waveChangeRef = useRef(null)
  const midAttackMoveIntervalRef = useRef(null)
  const rainbowZoneTimeoutRef = useRef(null)
  const rainbowZoneCountdownRef = useRef(null)
  const flameAttackTimeoutRef = useRef(null)
  const zoneCountdownIntervalRef = useRef(null)
  const ostEndedRef = useRef(false)
  const fightStartedRef = useRef(false)

  const ostRef = useRef(null)
  const deathRef = useRef(null)
  const dangerRef = useRef(null)
  const attackRef = useRef(null)
  const flamecastRef = useRef(null)

  const playFlamecast = () => {
    if (flamecastRef.current) {
      flamecastRef.current.currentTime = 0
      flamecastRef.current.play().catch(e => console.log("Flamecast audio play error:", e))
    }
  }

  const clearAllTimers = () => {
    if (attackCycleRef.current) clearTimeout(attackCycleRef.current)
    if (specialAttackCycleRef.current) clearTimeout(specialAttackCycleRef.current)
    if (waveChangeRef.current) clearTimeout(waveChangeRef.current)
    if (rainbowZoneTimeoutRef.current) clearTimeout(rainbowZoneTimeoutRef.current)
    if (flameAttackTimeoutRef.current) clearTimeout(flameAttackTimeoutRef.current)
    
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    if (midAttackMoveIntervalRef.current) clearInterval(midAttackMoveIntervalRef.current)
    if (rainbowZoneCountdownRef.current) clearInterval(rainbowZoneCountdownRef.current)
    if (zoneCountdownIntervalRef.current) clearInterval(zoneCountdownIntervalRef.current)
  }

  const returnToMenu = () => {
    if (ostEndedRef.current) return
    ostEndedRef.current = true
    
    clearAllTimers()
    
    if (ostRef.current) {
      ostRef.current.pause()
      ostRef.current.currentTime = 0
    }
    
    setGameState("menu")
    setPosition({ x: 128, y: 128 })
    setVisibleFlames([])
    setZoneActive(false)
    setMidAttack(prev => ({ ...prev, active: false }))
    setFlameCycleCount(0)
    setIsSecondCycle(false)
    setCurrentFlameWave(0)
    setAttackPhase("transition")
  }

  const updateFlames = (flames) => {
    const waveType = flameWaveTypes[currentFlameWave]
    return flames.map((flame) => moveAttackProjectile(flame, waveType))
  }

  const activateRainbowZoneForSpecial = () => {
    if (zoneCountdownIntervalRef.current) {
      clearInterval(zoneCountdownIntervalRef.current)
    }
    if (rainbowZoneTimeoutRef.current) {
      clearTimeout(rainbowZoneTimeoutRef.current)
    }
    
    setRainbowZoneOnRight(Math.random() > 0.5)
    setZoneActive(true)
    setRainbowZoneDeadly(false)
    setIsZoneWarning(true)
    setZoneCountdown(3)
    setZoneCountdownDisplay(3)
    
    if (dangerRef.current) {
      dangerRef.current.currentTime = 0
      dangerRef.current.play().catch((e) => console.log("Audio play error:", e))
    }
    
    let countdownValue = 3
    zoneCountdownIntervalRef.current = setInterval(() => {
      if (countdownValue > 1) {
        countdownValue--
        setZoneCountdown(countdownValue)
        setZoneCountdownDisplay(countdownValue)
      } else if (countdownValue === 1) {
        countdownValue = 0
        setZoneCountdown(0)
        setZoneCountdownDisplay("!")
      }
    }, 1000)
    
    rainbowZoneTimeoutRef.current = setTimeout(() => {
      if (zoneCountdownIntervalRef.current) {
        clearInterval(zoneCountdownIntervalRef.current)
      }
      setIsZoneWarning(false)
      setRainbowZoneDeadly(true)
      
      if (attackRef.current) {
        attackRef.current.currentTime = 0
        attackRef.current.play().catch((e) => console.log("Audio play error:", e))
      }
    }, GAME_CONFIG.DANGER_ZONE_WARNING_DURATION)
    
    const fullDuration = GAME_CONFIG.DANGER_ZONE_WARNING_DURATION + GAME_CONFIG.DANGER_ZONE_ACTIVE_DURATION
    setTimeout(() => {
      if (gameState === "fight") {
        setZoneActive(false)
        setRainbowZoneDeadly(false)
        setIsZoneWarning(true)
      }
      if (zoneCountdownIntervalRef.current) {
        clearInterval(zoneCountdownIntervalRef.current)
      }
      if (rainbowZoneTimeoutRef.current) {
        clearTimeout(rainbowZoneTimeoutRef.current)
      }
    }, fullDuration)
  }

  const activateMidAttackForSpecial = () => {
    if (midAttackMoveIntervalRef.current) {
      clearInterval(midAttackMoveIntervalRef.current)
    }
    
    const startPos = midAttackConfig.getRandomStart()
    setMidAttack({
      active: true,
      x: startPos.x,
      y: startPos.y,
      speed: midAttackConfig.speed,
      direction: startPos.direction,
    })
    
    midAttackMoveIntervalRef.current = setInterval(() => {
      setMidAttack(prev => {
        if (!prev.active) return prev
        return moveMidAttack(prev)
      })
    }, 16)
    
    const cleanupTimeout = setTimeout(() => {
      if (midAttackMoveIntervalRef.current) {
        clearInterval(midAttackMoveIntervalRef.current)
        midAttackMoveIntervalRef.current = null
      }
      setMidAttack(prev => ({ ...prev, active: false }))
    }, GAME_CONFIG.SPECIAL_ATTACK_DURATION)
    
    return cleanupTimeout
  }

  const startSpecialAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("special")
    setVisibleFlames([])
    
    activateRainbowZoneForSpecial()
    const midCleanup = activateMidAttackForSpecial()
    
    specialAttackCycleRef.current = setTimeout(() => {
      setZoneActive(false)
      setRainbowZoneDeadly(false)
      setIsZoneWarning(true)
      setMidAttack(prev => ({ ...prev, active: false }))
      
      if (midAttackMoveIntervalRef.current) {
        clearInterval(midAttackMoveIntervalRef.current)
        midAttackMoveIntervalRef.current = null
      }
      if (zoneCountdownIntervalRef.current) {
        clearInterval(zoneCountdownIntervalRef.current)
      }
      if (rainbowZoneTimeoutRef.current) {
        clearTimeout(rainbowZoneTimeoutRef.current)
      }
      
      startFlameAttackCycle()
    }, GAME_CONFIG.SPECIAL_ATTACK_DURATION)
  }

  const changeFlameWave = (waveIndex) => {
    if (waveIndex < flameWaveTypes.length) {
      setCurrentFlameWave(waveIndex)
      setVisibleFlames(createAttack(flameWaveTypes[waveIndex], isSecondCycle))
      playFlamecast()
      
      if (waveChangeRef.current) {
        clearTimeout(waveChangeRef.current)
      }
      
      waveChangeRef.current = setTimeout(() => {
        changeFlameWave(waveIndex + 1)
      }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)
    }
  }

  const startFlameAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("flame")
    setCurrentFlameWave(0)
    setVisibleFlames(createAttack(flameWaveTypes[0], isSecondCycle))
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRainbowZoneDeadly(false)
    setIsZoneWarning(true)
    
    playFlamecast()
    
    if (waveChangeRef.current) {
      clearTimeout(waveChangeRef.current)
    }
    
    waveChangeRef.current = setTimeout(() => {
      changeFlameWave(1)
    }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)
    
    if (flameAttackTimeoutRef.current) {
      clearTimeout(flameAttackTimeoutRef.current)
    }
    
    flameAttackTimeoutRef.current = setTimeout(() => {
      startTransitionToSpecial()
    }, GAME_CONFIG.FLAME_ATTACK_DURATION)
  }

  const startTransitionToFlame = () => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRainbowZoneDeadly(false)
    
    setTimeout(() => {
      startFlameAttackCycle()
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  const startTransitionToSpecial = () => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRainbowZoneDeadly(false)
    
    setTimeout(() => {
      startSpecialAttackCycle()
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  const getProjectileImage = () => {
    return flamesImage
  }

  const startFight = () => {
    clearAllTimers()

    ostEndedRef.current = false
    fightStartedRef.current = false
    if (deathRef.current) {
      deathRef.current.pause()
      deathRef.current.currentTime = 0
    }
    setPosition({ x: 128, y: 128 })
    keys.current = { w: false, a: false, s: false, d: false }
    setVisibleFlames([])
    setZoneActive(false)
    setRainbowZoneDeadly(false)
    setRainbowZoneOnRight(true)
    setMidAttack({
      active: false,
      x: -GAME_CONFIG.MID_ATTACK_WIDTH,
      y: GAME_CONFIG.BOX_SIZE / 2 - GAME_CONFIG.MID_ATTACK_HEIGHT / 2,
      speed: 1.5,
      direction: 1,
    })
    setAttackPhase("transition")
    setCurrentFlameWave(0)
    setFlameCycleCount(0)
    setIsSecondCycle(false)
    
    startCountdown()
  }

  const goHome = () => {
    clearAllTimers()
    navigate("/")
  }

  const startCountdown = () => {
    setCountdown(3)
    setGameState("countdown")
    
    // Avvia l'OST esattamente quando il countdown inizia
    if (ostRef.current) {
      ostRef.current.currentTime = 0
      ostRef.current.volume = 0.5
      ostRef.current.loop = false
      ostRef.current.play().catch(e => console.log("OST play error:", e))
    }
  }

  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState !== "countdown") return
    if (countdown === 0) {
      setGameState("fight")
      return
    }
    const timeout = setTimeout(() => {
      setCountdown((c) => c - 1)
    }, 500)
    return () => clearTimeout(timeout)
  }, [countdown, gameState])

  useEffect(() => {
    if (!ostRef.current || !deathRef.current || !dangerRef.current || !attackRef.current) return

    if (gameState === "fight" || gameState === "countdown") {
      const handleOstEnd = () => {
        if ((gameState === "fight" || gameState === "countdown") && !ostEndedRef.current) {
          returnToMenu()
        }
      }
      
      ostRef.current.addEventListener('ended', handleOstEnd)
      
      // Avvia gli attacchi SOLO quando il gioco entra in "fight"
      if (gameState === "fight" && !fightStartedRef.current) {
        fightStartedRef.current = true
        startFlameAttackCycle()
      }
      
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
      
      return () => {
        if (ostRef.current) {
          ostRef.current.removeEventListener('ended', handleOstEnd)
        }
      }
    }

    if (gameState === "gameover") {
      clearAllTimers()

      ostRef.current.pause()
      deathRef.current.currentTime = 0
      deathRef.current.play().catch(() => {})

      dangerRef.current.pause()
      dangerRef.current.currentTime = 0

      attackRef.current.pause()
      attackRef.current.currentTime = 0

      flamecastRef.current.pause()
      flamecastRef.current.currentTime = 0
    }

    if (gameState === "menu" || gameState === "loading") {
      ostRef.current.pause()
      ostRef.current.currentTime = 0
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
      fightStartedRef.current = false
    }
  }, [gameState])

  useEffect(() => {
    if (gameState !== "fight") return

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = true
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = false
    }

    const move = () => {
      setPosition((prev) => {
        const speed = 3
        let { x, y } = prev

        if (keys.current.w) y -= speed
        if (keys.current.s) y += speed
        if (keys.current.a) x -= speed
        if (keys.current.d) x += speed

        x = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, x))
        y = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, y))

        return { x, y }
      })

      if (attackPhase === "flame") {
        setVisibleFlames((prevFlames) => {
          const newFlames = updateFlames(prevFlames)
          for (const flame of newFlames) {
            if (
              flame.x < position.x + GAME_CONFIG.HEART_SIZE &&
              flame.x + GAME_CONFIG.FLAME_SIZE > position.x &&
              flame.y < position.y + GAME_CONFIG.HEART_SIZE &&
              flame.y + GAME_CONFIG.FLAME_SIZE > position.y
            ) {
              setGameState("gameover")
              break
            }
          }
          return newFlames
        })
      }

      if (rainbowZoneDeadly && gameState === "fight") {
        const inRainbowZone = rainbowZoneOnRight ? position.x > GAME_CONFIG.BOX_SIZE / 2 : position.x < GAME_CONFIG.BOX_SIZE / 2
        if (inRainbowZone) {
          setGameState("gameover")
        }
      }

      if (midAttack.active && gameState === "fight") {
        if (
          midAttack.x < position.x + GAME_CONFIG.HEART_SIZE &&
          midAttack.x + GAME_CONFIG.MID_ATTACK_WIDTH > position.x &&
          midAttack.y < position.y + GAME_CONFIG.HEART_SIZE &&
          midAttack.y + GAME_CONFIG.MID_ATTACK_HEIGHT > position.y
        ) {
          setGameState("gameover")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    intervalRef.current = setInterval(move, 16)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState, position, rainbowZoneDeadly, rainbowZoneOnRight, midAttack.active, attackPhase])

  return (
    <div className={styles.container}>
      <audio ref={ostRef} src={ostAudio} />
      <audio ref={deathRef} src={deathAudio} />
      <audio ref={dangerRef} src={dangerAudio} />
      <audio ref={attackRef} src={attackAudio} />
      <audio ref={flamecastRef} src={flamecastAudio} />

      {gameState === "loading" && <div className={styles.countdownText} style={{ userSelect: "none" }}></div>}

      {(gameState === "menu" || gameState === "gameover") && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
          <div className={styles.menuButtons}>
            <button onClick={startFight} className={styles.menuButton}>
              Determination
            </button>
            <button onClick={goHome} className={styles.homeButton}>
              Back to Home
            </button>
          </div>
        </div>
      )}

      {(gameState === "fight" || gameState === "countdown") && (
        <div className={styles.gameWrapper}>
          <div className={styles.verticalLayout}>
            <div className={styles.asrielContainer}>
              <img 
                src={rainbowZoneDeadly ? asrielAngryGif : asrielPng} 
                alt="Asriel" 
                className={styles.asriel} 
              />
            </div>

            <div className={styles.box}>
              {zoneActive && (
                <>
                  <div
                    className={styles.safeZone}
                    style={{
                      left: rainbowZoneOnRight ? 0 : "50%",
                      right: rainbowZoneOnRight ? "50%" : 0,
                    }}
                  ></div>
                  <div
                    className={`${isZoneWarning ? styles.warningZone : styles.rainbowZone} ${rainbowZoneDeadly ? styles.deadly : ""}`}
                    style={{
                      left: rainbowZoneOnRight ? "50%" : 0,
                      right: rainbowZoneOnRight ? 0 : "50%",
                    }}
                  >
                    {zoneCountdown > 0 && !rainbowZoneDeadly && (
                      <div className={styles.zoneCountdown}>{zoneCountdownDisplay}</div>
                    )}
                    {rainbowZoneDeadly && <div className={styles.zoneDeadlyExclamation}>!</div>}
                  </div>
                </>
              )}

              <img
                src={heartImage}
                alt="Heart"
                className={styles.heart}
                style={{ top: position.y, left: position.x }}
              />

              {attackPhase === "flame" &&
                visibleFlames.map((flame) => (
                  <img
                    key={flame.id}
                    src={getProjectileImage()}
                    alt="Projectile"
                    className={styles.flame}
                    style={{ top: flame.y, left: flame.x }}
                    draggable={false}
                  />
                ))}

              {attackPhase === "special" && midAttack.active && (
                <img
                  src={midImage}
                  alt="Mid Attack"
                  className={styles.midAttack}
                  style={{
                    top: midAttack.y,
                    left: midAttack.x,
                    width: `${GAME_CONFIG.MID_ATTACK_WIDTH}px`,
                    height: `${GAME_CONFIG.MID_ATTACK_HEIGHT}px`,
                  }}
                  draggable={false}
                />
              )}

              {gameState === "countdown" && (
                <div className={styles.countdownText}>{countdown === 0 ? "" : countdown}</div>
              )}
            </div>

            {/* STATS BAR - Come in Undertale */}
            <div className={styles.statsBar}>
              <div className={styles.statsLeft}>
                <span className={styles.statText}>YOU</span>
                <span className={styles.statValue}>LV 1</span>
              </div>
              <div className={styles.statsRight}>
                <span className={styles.statText}>PS</span>
                <div className={styles.hpBarContainer}>
                  <div className={styles.hpBarRed}>
                    <div className={styles.hpBarYellow}></div>
                  </div>
                  <span className={styles.hpText}>1/20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}