/**
 * Core Physics Engine, AI Controller, and State Management for Melody Quest
 * Enhanced with responsive physics, jump buffering, coyote time, and robust collision handling.
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.currentLevelIndex = 0;
        this.level = null;
        this.state = 'START'; // START, PLAYING, PRESENTING, LEVEL_CLEAR, GAME_OVER, VICTORY

        // World & Viewport
        this.cameraX = 0;
        this.viewportWidth = 960;
        this.viewportHeight = 540;

        // Player (Modi)
        this.player = {
            x: 80,
            y: 400,
            w: 34,
            h: 60,
            vx: 0,
            vy: 0,
            speed: 5.2,
            jumpForce: 13.5,
            grounded: false,
            standingPlatform: null,
            facing: 1, // 1 right, -1 left
            invulnerable: false,
            invulnTimer: 0,
            presenting: false,
            presentingRose: false,
            timer: 0,
            coyoteTimer: 0,
            jumpBufferTimer: 0
        };

        // Meloni State
        this.meloni = {
            x: 1060,
            y: 346,
            w: 40,
            h: 64,
            receivingGift: false,
            timer: 0
        };

        // Antagonists
        this.rahul = null;
        this.ramya = null;

        // Projectiles & Items
        this.chocolates = [];
        this.hearts = [];
        this.confettiBlasts = [];

        // Progression & Inventory
        this.chocolatesHeld = 0;
        this.totalDelivered = 0;
        this.impressionMeter = 0;
        this.timeRemaining = null;

        // Status Effects
        this.isInverted = false;
        this.inversionTimer = 0;

        // Particles
        this.particles = new ParticleSystem();

        // Key states
        this.keys = {
            left: false,
            right: false,
            jump: false,
            present: false
        };

        this.lastTime = 0;
        this.gameTime = 0;

        this.initInput();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = document.getElementById('game-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        let w = rect.width;
        let h = w * (9 / 16);
        if (h > rect.height) {
            h = rect.height;
            w = h * (16 / 9);
        }

        this.canvas.width = 960 * dpr;
        this.canvas.height = 540 * dpr;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;

        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
    }

    initInput() {
        // Robust keyboard input handling using Key Code and Key
        const onKeyDown = (e) => {
            sound.init();

            // Prevent page scrolling on arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = true;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
                if (!this.keys.jump) {
                    this.player.jumpBufferTimer = 0.18; // 180ms buffer window
                }
                this.keys.jump = true;
            }
            if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                this.keys.present = true;
                this.tryPresentGift();
            }
        };

        const onKeyUp = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
                this.keys.jump = false;
                // Variable jump height: cut ascent speed if released early
                if (this.player.vy < -4) {
                    this.player.vy *= 0.5;
                }
            }
            if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                this.keys.present = false;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        // Keep canvas focused on click
        this.canvas.addEventListener('click', () => {
            window.focus();
            sound.init();
        });

        // Touch Controls
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        const btnPresent = document.getElementById('btn-present');

        const bindTouch = (elem, pressFn, releaseFn) => {
            if (!elem) return;
            elem.addEventListener('touchstart', (e) => {
                e.preventDefault();
                sound.init();
                pressFn();
            }, { passive: false });

            elem.addEventListener('touchend', (e) => {
                e.preventDefault();
                releaseFn();
            }, { passive: false });

            elem.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                releaseFn();
            }, { passive: false });

            elem.addEventListener('mousedown', (e) => {
                e.preventDefault();
                sound.init();
                pressFn();
            });
            elem.addEventListener('mouseup', (e) => {
                e.preventDefault();
                releaseFn();
            });
        };

        bindTouch(btnLeft, () => this.keys.left = true, () => this.keys.left = false);
        bindTouch(btnRight, () => this.keys.right = true, () => this.keys.right = false);
        bindTouch(btnJump, () => {
            this.player.jumpBufferTimer = 0.18;
            this.keys.jump = true;
        }, () => {
            this.keys.jump = false;
            if (this.player.vy < -4) this.player.vy *= 0.5;
        });
        bindTouch(btnPresent, () => {
            this.keys.present = true;
            this.tryPresentGift();
        }, () => this.keys.present = false);
    }

    loadLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        const config = LEVEL_DEFINITIONS[levelIndex];
        this.level = JSON.parse(JSON.stringify(config));

        // Player positioning
        this.player.x = this.level.playerStart.x;
        this.player.y = this.level.playerStart.y;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.grounded = true;
        this.player.standingPlatform = null;
        this.player.facing = 1;
        this.player.invulnerable = false;
        this.player.invulnTimer = 0;
        this.player.presenting = false;
        this.player.presentingRose = false;
        this.player.coyoteTimer = 0;
        this.player.jumpBufferTimer = 0;

        // Meloni positioning
        this.meloni.x = this.level.meloniPos.x;
        this.meloni.y = this.level.meloniPos.y;
        this.meloni.receivingGift = false;
        this.meloni.shyAndDance = false;
        this.meloni.danceTimer = 0;

        this.player.celebrating = false;
        this.celebrationTimer = 0;

        // Rahul setup
        this.rahul = {
            x: this.level.rahul.startX,
            y: this.level.rahul.startY,
            w: 34,
            h: 58,
            vx: this.level.rahul.speed,
            speed: this.level.rahul.speed,
            facing: 1,
            timer: 0,
            mode: this.level.rahul.mode,
            patrolMinX: this.level.rahul.patrolMinX,
            patrolMaxX: this.level.rahul.patrolMaxX,
            hasCannon: this.level.rahul.mode === 'tag_team_confetti',
            shootTimer: 0
        };

        // Ramya setup
        if (this.level.ramya) {
            this.ramya = {
                x: this.level.ramya.x,
                y: this.level.ramya.y,
                w: 32,
                h: 56,
                dropInterval: this.level.ramya.dropInterval,
                timer: 0,
                dropTimer: 0,
                mode: this.level.ramya.mode
            };
        } else {
            this.ramya = null;
        }

        // Chocolates
        this.chocolates = this.level.chocolates.map(c => ({
            x: c.x,
            y: c.y,
            w: 24,
            h: 30,
            collected: false
        }));

        this.chocolatesHeld = 0;
        this.totalDelivered = 0;
        this.impressionMeter = 0;
        this.hearts = [];
        this.confettiBlasts = [];
        this.isInverted = false;
        this.inversionTimer = 0;

        if (this.level.timeLimit) {
            this.timeRemaining = this.level.timeLimit;
        } else {
            this.timeRemaining = null;
        }

        this.cameraX = 0;
        sound.setTrackForLevel(this.level.id);
        this.updateHUD();
        this.state = 'PLAYING';
        this.hideModals();
    }

    start() {
        this.loadLevel(0);
        sound.setTrackForLevel(1);
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.gameTime += dt;
        this.player.timer += dt;
        this.meloni.timer += dt;

        this.particles.update();

        // Handle Meloni's Shy and Dance Celebration when 100% is reached
        if (this.state === 'DANCE_CELEBRATION') {
            this.meloni.danceTimer = (this.meloni.danceTimer || 0) + dt;
            this.celebrationTimer = (this.celebrationTimer || 0) + dt;

            const isRose = this.level && this.level.itemType === 'rose';

            if (this.meloni.danceTimer < 1.4) {
                // Shy blush phase: emit cute hearts and rose petals
                if (Math.random() < 0.18) {
                    this.particles.addHearts(this.meloni.x + 20, this.meloni.y - 45, 1);
                }
                if (isRose && Math.random() < 0.22) {
                    this.particles.addRosePetals(this.meloni.x + 20, this.meloni.y - 35, 1);
                }
            } else {
                // Celebration dance phase: musical notes, sparkles, confetti and rose petals!
                if (Math.random() < 0.25) {
                    this.particles.addMusicalNotes(this.meloni.x + 20, this.meloni.y - 30, 2);
                }
                if (isRose) {
                    if (Math.random() < 0.28) {
                        this.particles.addRosePetals(this.meloni.x + 20, this.meloni.y - 15, 2);
                    }
                } else {
                    if (Math.random() < 0.14) {
                        this.particles.addConfetti(this.meloni.x + 20, this.meloni.y - 10, 4);
                    }
                }
                if (Math.random() < 0.15) {
                    this.particles.addSparkles(this.player.x + 14, this.player.y - 25, 2, '#ffd700');
                }
            }
            return;
        }

        if (this.state !== 'PLAYING' && this.state !== 'PRESENTING') {
            return;
        }

        // 1. Level Timer countdown (Level 3)
        if (this.timeRemaining !== null && this.state === 'PLAYING') {
            this.timeRemaining -= dt;
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.triggerGameOver("Time ran out on the Cosmic Runway! Meloni awaits your prompt arrival.");
                return;
            }
        }

        // 2. Control Inversion status
        if (this.isInverted) {
            this.inversionTimer -= dt;
            if (this.inversionTimer <= 0) {
                this.isInverted = false;
                this.inversionTimer = 0;
            }
        }

        // 3. Invulnerability blink timer
        if (this.player.invulnerable) {
            this.player.invulnTimer -= dt;
            if (this.player.invulnTimer <= 0) {
                this.player.invulnerable = false;
            }
        }

        // 4. Update Shifting Platforms (Level 3)
        for (const p of this.level.platforms) {
            if (p.type === 'shifting_h') {
                const prevX = p.x;
                p.x = p.basePos + Math.sin(this.gameTime * p.moveSpeed) * p.moveRange;
                if (this.player.grounded && this.player.standingPlatform === p) {
                    this.player.x += (p.x - prevX);
                }
            } else if (p.type === 'shifting_v') {
                const prevY = p.y;
                p.y = p.basePos + Math.cos(this.gameTime * p.moveSpeed) * p.moveRange;
                if (this.player.grounded && this.player.standingPlatform === p) {
                    this.player.y += (p.y - prevY);
                }
            }
        }

        // 5. Player Physics & Input Handling
        if (this.state === 'PLAYING') {
            // Determine horizontal intent
            let moveLeft = this.keys.left;
            let moveRight = this.keys.right;

            if (this.isInverted) {
                const tmp = moveLeft;
                moveLeft = moveRight;
                moveRight = tmp;
            }

            let dir = 0;
            if (moveLeft) dir -= 1;
            if (moveRight) dir += 1;

            // Responsive horizontal movement
            const targetVx = dir * this.player.speed;
            if (dir !== 0) {
                this.player.vx = this.player.vx * 0.7 + targetVx * 0.3;
                this.player.facing = dir;
            } else {
                this.player.vx *= 0.68;
                if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
            }

            // Jump Buffering & Coyote Time
            if (this.player.grounded) {
                this.player.coyoteTimer = 0.12; // 120ms coyote window
            } else {
                this.player.coyoteTimer = Math.max(0, this.player.coyoteTimer - dt);
            }

            if (this.player.jumpBufferTimer > 0) {
                this.player.jumpBufferTimer -= dt;
                if (this.player.coyoteTimer > 0) {
                    // Trigger Jump!
                    this.player.vy = -this.player.jumpForce;
                    this.player.grounded = false;
                    this.player.standingPlatform = null;
                    this.player.coyoteTimer = 0;
                    this.player.jumpBufferTimer = 0;
                    sound.playJump();
                    this.particles.addSparkles(this.player.x + this.player.w / 2, this.player.y + this.player.h, 6, '#ffffff');
                }
            }

            // Gravity
            this.player.vy += 0.62;
            if (this.player.vy > 14) this.player.vy = 14;

            // Collision Resolution
            this.resolvePlayerCollisions();

            // Boundaries
            if (this.player.x < 10) {
                this.player.x = 10;
                this.player.vx = 0;
            }
            if (this.player.x + this.player.w > this.level.worldWidth - 10) {
                this.player.x = this.level.worldWidth - 10 - this.player.w;
                this.player.vx = 0;
            }
        }

        // 6. Camera Follow
        const targetCamX = this.player.x - this.viewportWidth * 0.45;
        this.cameraX += (targetCamX - this.cameraX) * 0.14;
        const maxCamX = Math.max(0, this.level.worldWidth - this.viewportWidth);
        this.cameraX = Math.max(0, Math.min(this.cameraX, maxCamX));

        // 7. Item Pickups (Melody Chocolates or Blooming Roses)
        const isRose = this.level && this.level.itemType === 'rose';
        for (let i = 0; i < this.chocolates.length; i++) {
            const ch = this.chocolates[i];
            if (!ch.collected) {
                if (this.checkOverlap(this.player, ch)) {
                    ch.collected = true;
                    this.chocolatesHeld++;
                    if (isRose) {
                        sound.playRoseChime();
                        this.particles.addRosePetals(ch.x + ch.w / 2, ch.y + ch.h / 2, 9);
                        this.particles.addFloatingText('+1 Red Rose 🌹!', ch.x, ch.y - 10, '#ff3366', 20);
                    } else {
                        sound.playCollectChime();
                        this.particles.addSparkles(ch.x + ch.w / 2, ch.y + ch.h / 2, 12, '#ffd700');
                        this.particles.addFloatingText('+1 Melody 🍫!', ch.x, ch.y - 10, '#ffd700', 19);
                    }
                    this.updateHUD();
                }
            }
        }

        // 8. Rahul AI Updates
        if (this.rahul) {
            this.rahul.timer += dt;
            if (this.rahul.mode === 'patrol') {
                this.rahul.x += this.rahul.vx;
                if (this.rahul.x <= this.rahul.patrolMinX) {
                    this.rahul.x = this.rahul.patrolMinX;
                    this.rahul.vx = Math.abs(this.rahul.speed);
                    this.rahul.facing = 1;
                } else if (this.rahul.x >= this.rahul.patrolMaxX) {
                    this.rahul.x = this.rahul.patrolMaxX;
                    this.rahul.vx = -Math.abs(this.rahul.speed);
                    this.rahul.facing = -1;
                }
            } else if (this.rahul.mode === 'track_x') {
                const dx = this.player.x - this.rahul.x;
                if (Math.abs(dx) > 15) {
                    const dir = Math.sign(dx);
                    this.rahul.vx = dir * this.rahul.speed;
                    this.rahul.facing = dir;
                    this.rahul.x += this.rahul.vx;
                } else {
                    this.rahul.vx = 0;
                }
            } else if (this.rahul.mode === 'tag_team_confetti') {
                const dx = this.player.x - this.rahul.x;
                const dir = Math.sign(dx) || 1;
                this.rahul.facing = dir;
                this.rahul.x += dir * this.rahul.speed * 0.85;

                this.rahul.shootTimer += dt;
                if (this.rahul.shootTimer >= 2.4) {
                    this.rahul.shootTimer = 0;
                    this.fireConfettiBlast(this.rahul.x + (dir > 0 ? 30 : -10), this.rahul.y - 30, dir);
                }
            }

            if (!this.player.invulnerable && this.checkOverlap(this.player, this.rahul)) {
                this.handleRahulDisruption();
            }
        }

        // 9. Ramya AI Updates
        if (this.ramya) {
            this.ramya.timer += dt;
            this.ramya.dropTimer += dt;

            if (this.ramya.mode === 'floating_partner' && this.rahul) {
                const targetX = this.rahul.x;
                this.ramya.x += (targetX - this.ramya.x) * 0.08;
                this.ramya.y = 200 + Math.sin(this.gameTime * 2) * 35;
            }

            if (this.ramya.dropTimer >= this.ramya.dropInterval) {
                this.ramya.dropTimer = 0;
                this.spawnDistractionHeart(this.ramya.x + 16, this.ramya.y + 10);
            }
        }

        // 10. Update Distraction Hearts
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const h = this.hearts[i];
            h.y += h.vy;
            h.x += Math.sin(this.gameTime * 5 + h.seed) * 1.2;
            h.timer += dt;

            if (!this.player.invulnerable && this.checkPointInPlayer(h.x, h.y)) {
                this.triggerDistraction();
                this.hearts.splice(i, 1);
                continue;
            }

            if (h.y > this.level.worldHeight + 20) {
                this.hearts.splice(i, 1);
            }
        }

        // 11. Update Confetti Blasts
        for (let i = this.confettiBlasts.length - 1; i >= 0; i--) {
            const b = this.confettiBlasts[i];
            b.x += b.vx;
            b.timer += dt;

            if (Math.random() < 0.35) {
                this.particles.addSparkles(b.x, b.y, 1, '#ff007f');
            }

            if (this.checkPointInPlayer(b.x, b.y)) {
                this.handleConfettiPushback(b.vx > 0 ? 1 : -1);
                this.confettiBlasts.splice(i, 1);
                continue;
            }

            if (b.x < 0 || b.x > this.level.worldWidth) {
                this.confettiBlasts.splice(i, 1);
            }
        }

        // 12. Check Proximity to Meloni
        const distToMeloni = Math.hypot(
            (this.player.x + this.player.w / 2) - (this.meloni.x + this.meloni.w / 2),
            (this.player.y + this.player.h) - (this.meloni.y + this.meloni.h)
        );
        const inRange = distToMeloni < 90;
        this.updatePresentPrompt(inRange);

        this.updateHUD();
    }

    resolvePlayerCollisions() {
        // Horizontal Movement
        this.player.x += this.player.vx;

        // Vertical Movement
        const prevBottom = this.player.y + this.player.h;
        this.player.y += this.player.vy;
        const currentBottom = this.player.y + this.player.h;

        let landed = false;
        let groundPlatform = null;

        for (const p of this.level.platforms) {
            const playerLeft = this.player.x;
            const playerRight = this.player.x + this.player.w;
            const platLeft = p.x;
            const platRight = p.x + p.w;

            // Horizontal overlap check
            if (playerRight > platLeft + 2 && playerLeft < platRight - 2) {
                // Falling onto the top of the platform
                if (this.player.vy >= 0) {
                    // Check if player crossed platform surface this frame
                    if (prevBottom <= p.y + 16 && currentBottom >= p.y) {
                        this.player.y = p.y - this.player.h;
                        this.player.vy = 0;
                        landed = true;
                        groundPlatform = p;
                    }
                }
            }
        }

        this.player.grounded = landed;
        this.player.standingPlatform = groundPlatform;
    }

    handleRahulDisruption() {
        sound.playDisruptBoing();
        this.player.invulnerable = true;
        this.player.invulnTimer = 1.2;

        const pushDir = this.player.x < this.rahul.x ? -1 : 1;
        this.player.vx = pushDir * 5.2;
        this.player.vy = -4.0;

        const isRose = this.level && this.level.itemType === 'rose';
        if (this.chocolatesHeld > 0) {
            this.chocolatesHeld--;
            if (isRose) {
                this.particles.addFloatingText('-1 Rose! 🥀', this.player.x, this.player.y - 15, '#ff4757', 20);
                this.particles.addRosePetals(this.player.x, this.player.y, 6);
            } else {
                this.particles.addFloatingText('-1 Melody! 💔', this.player.x, this.player.y - 15, '#ff4757', 20);
            }

            this.chocolates.push({
                x: Math.max(50, Math.min(this.level.worldWidth - 50, this.player.x - pushDir * 60)),
                y: this.player.y - 40,
                w: 24,
                h: 30,
                collected: false
            });
        } else {
            this.particles.addFloatingText('Blocked by Rahul!', this.player.x, this.player.y - 15, '#ff4757', 18);
        }

        this.particles.addConfetti(this.player.x + this.player.w / 2, this.player.y + 20, 8);
        this.updateHUD();
    }

    spawnDistractionHeart(x, y) {
        this.hearts.push({
            x,
            y,
            vy: 2.2,
            seed: Math.random() * 10,
            timer: 0
        });
    }

    triggerDistraction() {
        sound.playDistractHeart();
        this.isInverted = true;
        this.inversionTimer = 4.0;
        this.particles.addFloatingText('⚡ DISTRACTED! 💔', this.player.x, this.player.y - 25, '#ff007f', 22);
        this.particles.addHearts(this.player.x + this.player.w / 2, this.player.y + 20, 6);
    }

    fireConfettiBlast(x, y, dir) {
        sound.playConfettiBlast();
        this.confettiBlasts.push({
            x,
            y,
            vx: dir * 7.5,
            radius: 16,
            timer: 0
        });
    }

    handleConfettiPushback(dir) {
        sound.playConfettiBlast();
        this.player.vx = dir * 9.5;
        this.player.vy = -3.5;
        this.particles.addConfetti(this.player.x + this.player.w / 2, this.player.y + 20, 24, dir);
        this.particles.addFloatingText('Confetti Blast! Pushed!', this.player.x, this.player.y - 20, '#00e5ff', 19);
    }

    tryPresentGift() {
        if (this.state !== 'PLAYING') return;

        const distToMeloni = Math.hypot(
            (this.player.x + this.player.w / 2) - (this.meloni.x + this.meloni.w / 2),
            (this.player.y + this.player.h) - (this.meloni.y + this.meloni.h)
        );

        const isRose = this.level && this.level.itemType === 'rose';

        if (distToMeloni > 105) {
            this.particles.addFloatingText('Get closer to Meloni!', this.player.x, this.player.y - 15, '#ffffff', 16);
            return;
        }

        if (this.chocolatesHeld <= 0) {
            const needMsg = isRose ? 'Collect roses first! 🌹' : 'Collect chocolates first! 🍫';
            this.particles.addFloatingText(needMsg, this.player.x, this.player.y - 15, '#ffd700', 16);
            return;
        }

        this.state = 'PRESENTING';
        this.player.presenting = true;
        this.player.presentingRose = isRose;
        this.meloni.receivingGift = true;

        const giftInterval = 300;
        const deliverNext = () => {
            if (this.chocolatesHeld > 0) {
                this.chocolatesHeld--;
                this.totalDelivered++;

                const increment = (100 / this.level.requiredChocolates);
                this.impressionMeter = Math.min(100, this.impressionMeter + increment);

                if (isRose) {
                    sound.playRoseChime();
                    this.particles.addRosePetals(this.meloni.x + 20, this.meloni.y - 30, 8);
                    this.particles.addHearts(this.meloni.x + 20, this.meloni.y - 40, 4);
                    this.particles.addFloatingText(`+${Math.round(increment)}% Impression! 🌹💖`, this.meloni.x, this.meloni.y - 50, '#ff1493', 20);
                } else {
                    sound.playPresentGift();
                    this.particles.addHearts(this.meloni.x + 20, this.meloni.y - 30, 8);
                    this.particles.addSparkles(this.meloni.x + 20, this.meloni.y - 20, 10, '#ffd700');
                    this.particles.addFloatingText(`+${Math.round(increment)}% Impression! 💖`, this.meloni.x, this.meloni.y - 50, '#ff1493', 20);
                }

                this.updateHUD();

                if (this.chocolatesHeld > 0) {
                    setTimeout(deliverNext, giftInterval);
                } else {
                    this.finishGiftPresentation();
                }
            } else {
                this.finishGiftPresentation();
            }
        };

        deliverNext();
    }

    finishGiftPresentation() {
        this.player.presenting = false;
        this.player.presentingRose = false;
        this.meloni.receivingGift = false;

        const isRose = this.level && this.level.itemType === 'rose';

        if (this.impressionMeter >= 89.5) {
            this.state = 'DANCE_CELEBRATION';
            this.meloni.shyAndDance = true;
            this.meloni.danceTimer = 0;
            this.player.celebrating = true;
            this.celebrationTimer = 0;

            // Turn Modi towards Meloni to celebrate together
            this.player.facing = this.player.x < this.meloni.x ? 1 : -1;

            // Trigger Meloni's Celebratory Dance Fanfare & Joyful Music!
            sound.playDanceTune();

            // Initial celebration burst: hearts, sparkles, rose petals, and fanfare text
            const pct = Math.min(100, Math.round(this.impressionMeter));
            if (isRose) {
                this.particles.addRosePetals(this.meloni.x + 20, this.meloni.y - 30, 20);
                this.particles.addHearts(this.meloni.x + 20, this.meloni.y - 45, 12);
                this.particles.addSparkles(this.meloni.x + 20, this.meloni.y - 25, 16, '#ff3366');
                this.particles.addFloatingText(`${pct}% IMPRESSED! 🌹💖`, this.meloni.x, this.meloni.y - 65, '#ff007f', 24);
            } else {
                this.particles.addHearts(this.meloni.x + 20, this.meloni.y - 45, 12);
                this.particles.addSparkles(this.meloni.x + 20, this.meloni.y - 25, 16, '#ffd700');
                this.particles.addFloatingText(`${pct}% IMPRESSED! 💖`, this.meloni.x, this.meloni.y - 65, '#ff007f', 24);
            }

            // Let the cute shy phase (1.4s) and celebratory dance (1.5s - 4.6s) play before modal shows
            setTimeout(() => this.showLevelClearModal(), 4600);
        } else {
            this.state = 'PLAYING';
            const itemName = isRose ? 'Roses' : 'Melody';
            this.particles.addFloatingText(`More ${itemName} needed! (${Math.round(this.impressionMeter)}% / 90%)`, this.player.x, this.player.y - 15, '#ffd700', 18);
        }
    }

    showLevelClearModal() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const desc = document.getElementById('modal-desc');
        const btn = document.getElementById('modal-btn');

        const pct = Math.min(100, Math.round(this.impressionMeter));
        if (this.currentLevelIndex < LEVEL_DEFINITIONS.length - 1) {
            const nextLvl = LEVEL_DEFINITIONS[this.currentLevelIndex + 1];
            title.innerHTML = `🎉 Level ${this.level.id} Complete!`;
            desc.innerHTML = `Meloni was delighted (${pct}%) at <b>${this.level.name}</b>!<br><br>Prepare for Level ${nextLvl.id}: <b>${nextLvl.name}</b>.`;
            btn.textContent = `Proceed to Level ${nextLvl.id} 🚀`;
            btn.onclick = () => {
                this.loadLevel(this.currentLevelIndex + 1);
            };
        } else {
            this.state = 'VICTORY';
            title.innerHTML = `🏆 ROMAN ROSE FINALE COMPLETE! 🌹🇮🇹🤝🇮🇳`;
            desc.innerHTML = `Meloni’s Impression Meter reached ${pct}% at the Roman Rose Villa!<br><br>Presented with radiant blooming red roses, the melody of friendship and romance blossoms into an eternal bond of Indo-Italian unity. 🌹✨🇮🇹🇮🇳`;
            btn.textContent = `Play Again from Start 🔄`;
            btn.onclick = () => {
                this.loadLevel(0);
            };
        }

        modal.classList.remove('hidden');
    }

    triggerGameOver(reason) {
        this.state = 'GAME_OVER';
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const desc = document.getElementById('modal-desc');
        const btn = document.getElementById('modal-btn');

        title.innerHTML = `⏳ Time's Up!`;
        desc.innerHTML = `${reason}<br><br>The Cosmic Runway demands speed and finesse!`;
        btn.textContent = `Retry Level 🔄`;
        btn.onclick = () => {
            this.loadLevel(this.currentLevelIndex);
        };

        modal.classList.remove('hidden');
    }

    hideModals() {
        const modal = document.getElementById('modal-overlay');
        if (modal) modal.classList.add('hidden');
    }

    updatePresentPrompt(inRange) {
        const prompt = document.getElementById('present-prompt');
        const btnPresent = document.getElementById('btn-present');
        const isRose = this.level && this.level.itemType === 'rose';

        if (inRange && this.chocolatesHeld > 0 && this.state === 'PLAYING') {
            prompt.innerHTML = isRose
                ? `🌹 Press <b>E</b> or Tap <b>[Present Roses]</b>!`
                : `🎁 Press <b>E</b> or Tap <b>[Present Gift]</b>!`;
            prompt.classList.remove('hidden');
            if (btnPresent) {
                btnPresent.innerHTML = isRose ? '🌹 ROSES' : '🎁 GIFT';
                btnPresent.classList.add('pulse-active');
            }
        } else {
            prompt.classList.add('hidden');
            if (btnPresent) {
                btnPresent.innerHTML = isRose ? '🌹 ROSES' : '🎁 GIFT';
                btnPresent.classList.remove('pulse-active');
            }
        }
    }

    updateHUD() {
        const chocEl = document.getElementById('hud-chocolate-count');
        const isRose = this.level && this.level.itemType === 'rose';
        if (chocEl) {
            chocEl.textContent = isRose ? `🌹 x ${this.chocolatesHeld}` : `🍫 x ${this.chocolatesHeld}`;
        }

        const lvlEl = document.getElementById('hud-level-indicator');
        if (lvlEl && this.level) {
            lvlEl.textContent = `Level ${this.level.id}: ${this.level.name}`;
        }

        const bar = document.getElementById('hud-impression-fill');
        const text = document.getElementById('hud-impression-text');
        if (bar && text) {
            const pct = Math.min(100, Math.round(this.impressionMeter));
            bar.style.width = `${pct}%`;
            text.textContent = pct >= 90 ? `${pct}% Impressed (Pass! 🎉)` : `${pct}% (Goal: 90%)`;
        }

        const timerContainer = document.getElementById('hud-timer-card');
        const timerVal = document.getElementById('hud-timer-value');
        if (timerContainer && timerVal) {
            if (this.timeRemaining !== null) {
                timerContainer.classList.remove('hidden');
                const totalSec = Math.ceil(this.timeRemaining);
                const mins = Math.floor(totalSec / 60);
                const secs = totalSec % 60;
                timerVal.textContent = mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}s`;
                if (this.timeRemaining <= 15) {
                    timerContainer.classList.add('warning-blink');
                } else {
                    timerContainer.classList.remove('warning-blink');
                }
            } else {
                timerContainer.classList.add('hidden');
            }
        }

        const distractBanner = document.getElementById('distract-banner');
        if (distractBanner) {
            if (this.isInverted) {
                distractBanner.classList.remove('hidden');
                distractBanner.textContent = `⚡ DISTRACTED! CONTROLS INVERTED (${Math.ceil(this.inversionTimer)}s) 💔`;
            } else {
                distractBanner.classList.add('hidden');
            }
        }

        const muteBtn = document.getElementById('btn-mute-toggle');
        if (muteBtn) {
            if (sound.isMuted) {
                muteBtn.innerHTML = '🔇 Muted';
                muteBtn.classList.add('muted');
            } else {
                muteBtn.innerHTML = sound.trackNames[sound.currentTrackIndex % sound.trackNames.length];
                muteBtn.classList.remove('muted');
            }
        }
    }

    checkOverlap(r1, r2) {
        return (
            r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y
        );
    }

    checkPointInPlayer(px, py) {
        return (
            px >= this.player.x &&
            px <= this.player.x + this.player.w &&
            py >= this.player.y &&
            py <= this.player.y + this.player.h
        );
    }

    render() {
        this.ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

        // 1. Backdrop
        EnvironmentRenderer.drawBackdrop(
            this.ctx,
            this.level.id,
            this.cameraX,
            this.viewportWidth,
            this.viewportHeight,
            this.gameTime
        );

        // 2. World Space
        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

        // Platforms
        for (const p of this.level.platforms) {
            EnvironmentRenderer.drawPlatform(this.ctx, p, this.level.id, this.gameTime);
        }

        // Melody Chocolates or Blooming Roses
        const isRose = this.level && this.level.itemType === 'rose';
        for (const ch of this.chocolates) {
            if (!ch.collected) {
                if (isRose) {
                    CharacterRenderer.drawRose(this.ctx, ch.x, ch.y, ch.w, ch.h, this.gameTime + ch.x * 0.1);
                } else {
                    CharacterRenderer.drawChocolate(this.ctx, ch.x, ch.y, ch.w, ch.h, this.gameTime + ch.x * 0.1);
                }
            }
        }

        // Meloni
        CharacterRenderer.drawMeloni(
            this.ctx,
            this.meloni.x,
            this.meloni.y,
            this.meloni.w,
            this.meloni.h,
            this.meloni
        );

        // Rahul
        if (this.rahul) {
            CharacterRenderer.drawRahul(
                this.ctx,
                this.rahul.x,
                this.rahul.y,
                this.rahul.w,
                this.rahul.h,
                this.rahul
            );
        }

        // Ramya
        if (this.ramya) {
            CharacterRenderer.drawRamya(
                this.ctx,
                this.ramya.x,
                this.ramya.y,
                this.ramya.w,
                this.ramya.h,
                this.ramya
            );
        }

        // Distraction Hearts
        for (const h of this.hearts) {
            CharacterRenderer.drawDistractionHeart(this.ctx, h.x, h.y, 14, h.timer);
        }

        // Confetti Blasts
        for (const b of this.confettiBlasts) {
            CharacterRenderer.drawConfettiBlast(this.ctx, b.x, b.y, b.radius, b.vx > 0 ? 1 : -1, b.timer);
        }

        // Modi
        CharacterRenderer.drawModi(
            this.ctx,
            this.player.x,
            this.player.y,
            this.player.w,
            this.player.h,
            this.player
        );

        // Particles & Floating Text
        this.particles.draw(this.ctx);

        this.ctx.restore();
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min(0.04, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }
}

let game = null;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const startModal = document.getElementById('start-screen-overlay');
            if (startModal) startModal.classList.add('hidden');
            game.start();
        });
    }

    const muteBtn = document.getElementById('btn-mute-toggle');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            const trackLabel = sound.cycleMusicTrack();
            muteBtn.innerHTML = trackLabel;
            muteBtn.classList.toggle('muted', sound.isMuted);
        });
    }

    const touchToggleBtn = document.getElementById('btn-touch-toggle');
    const touchControls = document.getElementById('touch-controls');
    if (touchToggleBtn && touchControls) {
        touchToggleBtn.addEventListener('click', () => {
            const isForced = touchControls.classList.toggle('force-show');
            touchToggleBtn.innerHTML = isForced ? '🎮 Touch ON' : '🎮 Touch UI';
        });
    }

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (game && game.level) {
                game.loadLevel(game.currentLevelIndex);
            }
        });
    }
});
