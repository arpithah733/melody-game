/**
 * Level Configurations and Environment Renderers for Melody Quest
 * Level 1: The Parliament Gardens (Easy)
 * Level 2: The G7 Summit Corridor (Medium)
 * Level 3: The Cosmic Runway Finale (Hard)
 */

const LEVEL_DEFINITIONS = [
    {
        id: 1,
        name: "The Parliament Gardens",
        subtitle: "Lush Mughal Gardens & Sandstone Colonnades",
        difficulty: "Easy",
        requiredChocolates: 5,
        timeLimit: null, // No timer
        worldWidth: 1200,
        worldHeight: 540,
        playerStart: { x: 80, y: 400 },
        meloniPos: { x: 1060, y: 346 },
        rahul: {
            startX: 520,
            startY: 402,
            patrolMinX: 300,
            patrolMaxX: 860,
            speed: 2.0,
            mode: 'patrol'
        },
        ramya: null,
        platforms: [
            // Solid Main Ground (Elevated to y: 460 for clear visibility above HUD/controls)
            { x: 0, y: 460, w: 1200, h: 80, type: 'ground' },

            // Stepped Terrace 1
            { x: 190, y: 360, w: 170, h: 22, type: 'terrace' },
            // Stepped Terrace 2 (Center High Garden)
            { x: 420, y: 270, w: 220, h: 22, type: 'terrace' },
            // Stepped Terrace 3
            { x: 710, y: 340, w: 170, h: 22, type: 'terrace' },
            // Floating garden perches
            { x: 300, y: 190, w: 140, h: 20, type: 'perch' },
            { x: 570, y: 180, w: 140, h: 20, type: 'perch' },

            // Meloni's Raised Flower Dais (Pavilion)
            { x: 1000, y: 410, w: 170, h: 50, type: 'dais' }
        ],
        chocolates: [
            { x: 250, y: 310 },
            { x: 350, y: 140 },
            { x: 520, y: 220 },
            { x: 620, y: 130 },
            { x: 780, y: 290 }
        ]
    },
    {
        id: 2,
        name: "The G7 Summit Corridor",
        subtitle: "Diplomatic Grandeur & High-Tech Balconies",
        difficulty: "Medium",
        requiredChocolates: 8,
        timeLimit: null,
        worldWidth: 1300,
        worldHeight: 540,
        playerStart: { x: 80, y: 400 },
        meloniPos: { x: 1130, y: 186 },
        rahul: {
            startX: 450,
            startY: 402,
            patrolMinX: 150,
            patrolMaxX: 950,
            speed: 2.6,
            mode: 'track_x'
        },
        ramya: {
            x: 580,
            y: 54,
            dropInterval: 3.6,
            mode: 'balcony'
        },
        platforms: [
            // Ground level (Red Carpet at y: 460)
            { x: 0, y: 460, w: 1300, h: 80, type: 'carpet' },

            // Tier 1 Floating Glass/Gold Podiums
            { x: 150, y: 370, w: 160, h: 20, type: 'g7_platform' },
            { x: 370, y: 320, w: 170, h: 20, type: 'g7_platform' },
            { x: 660, y: 340, w: 180, h: 20, type: 'g7_platform' },
            { x: 920, y: 360, w: 160, h: 20, type: 'g7_platform' },

            // Tier 2 Mid-Height Platforms
            { x: 260, y: 240, w: 170, h: 20, type: 'g7_platform' },
            { x: 510, y: 210, w: 180, h: 20, type: 'g7_platform' },
            { x: 790, y: 230, w: 170, h: 20, type: 'g7_platform' },

            // High VIP Balcony (Ramya's station)
            { x: 520, y: 110, w: 160, h: 20, type: 'balcony' },

            // Meloni's Diplomatic Summit Dais
            { x: 1080, y: 250, w: 170, h: 30, type: 'dais' }
        ],
        chocolates: [
            { x: 200, y: 320 },
            { x: 430, y: 270 },
            { x: 720, y: 290 },
            { x: 310, y: 190 },
            { x: 570, y: 160 },
            { x: 850, y: 180 },
            { x: 980, y: 310 },
            { x: 420, y: 410 }
        ]
    },
    {
        id: 3,
        name: "The Cosmic Runway Finale",
        subtitle: "Starlit Nebula, Shifting Layouts & 2-Minute Countdown!",
        difficulty: "Hard",
        requiredChocolates: 10,
        timeLimit: 120,
        worldWidth: 1400,
        worldHeight: 540,
        playerStart: { x: 70, y: 400 },
        meloniPos: { x: 1220, y: 196 },
        rahul: {
            startX: 550,
            startY: 402,
            patrolMinX: 180,
            patrolMaxX: 1100,
            speed: 2.8,
            mode: 'tag_team_confetti'
        },
        ramya: {
            x: 550,
            y: 220,
            dropInterval: 3.2,
            mode: 'floating_partner'
        },
        platforms: [
            // Base Cosmic Runway (y: 460)
            { x: 0, y: 460, w: 1400, h: 80, type: 'cosmic_runway' },

            // Moving / Shifting Platforms
            { x: 180, y: 370, w: 150, h: 20, type: 'shifting_h', moveRange: 100, moveSpeed: 1.5, basePos: 180 },
            { x: 430, y: 300, w: 150, h: 20, type: 'shifting_v', moveRange: 60, moveSpeed: 1.8, basePos: 300 },
            { x: 650, y: 340, w: 160, h: 20, type: 'shifting_h', moveRange: 120, moveSpeed: 1.8, basePos: 650 },
            { x: 860, y: 270, w: 150, h: 20, type: 'shifting_v', moveRange: 70, moveSpeed: 2.0, basePos: 270 },
            { x: 300, y: 220, w: 140, h: 20, type: 'shifting_h', moveRange: 90, moveSpeed: 1.6, basePos: 300 },
            { x: 560, y: 170, w: 150, h: 20, type: 'shifting_h', moveRange: 80, moveSpeed: 1.4, basePos: 560 },

            // Meloni's Cosmic Dais
            { x: 1170, y: 260, w: 170, h: 30, type: 'cosmic_dais' }
        ],
        chocolates: [
            { x: 230, y: 320 },
            { x: 350, y: 170 },
            { x: 490, y: 250 },
            { x: 620, y: 120 },
            { x: 720, y: 290 },
            { x: 910, y: 220 },
            { x: 1040, y: 410 },
            { x: 380, y: 410 },
            { x: 740, y: 410 },
            { x: 1100, y: 210 }
        ]
    },
    {
        id: 4,
        name: "The Roman Rose Villa",
        subtitle: "Tuscan Sunset, Marble Trellises & 12 Red Roses!",
        difficulty: "Grand Finale",
        itemType: "rose",
        itemIcon: "🌹",
        itemName: "Rose",
        requiredChocolates: 12,
        timeLimit: null,
        worldWidth: 1500,
        worldHeight: 540,
        playerStart: { x: 80, y: 400 },
        meloniPos: { x: 1330, y: 246 },
        rahul: {
            startX: 620,
            startY: 402,
            patrolMinX: 200,
            patrolMaxX: 1200,
            speed: 2.7,
            mode: 'track_x'
        },
        ramya: {
            x: 760,
            y: 75,
            dropInterval: 3.4,
            mode: 'balcony'
        },
        platforms: [
            // Terracotta Garden Walkway Ground
            { x: 0, y: 460, w: 1500, h: 80, type: 'terracotta_ground' },

            // Italian Marble Rose Trellises
            { x: 180, y: 370, w: 170, h: 22, type: 'rose_trellis' },
            { x: 420, y: 310, w: 180, h: 22, type: 'rose_trellis' },
            { x: 680, y: 350, w: 180, h: 22, type: 'rose_trellis' },
            { x: 520, y: 190, w: 160, h: 20, type: 'rose_trellis' },
            { x: 920, y: 320, w: 190, h: 22, type: 'rose_trellis' },
            { x: 1120, y: 220, w: 160, h: 20, type: 'rose_trellis' },
            { x: 730, y: 130, w: 160, h: 20, type: 'balcony' },

            // Meloni's Roman Villa Balcony Dais
            { x: 1270, y: 310, w: 180, h: 40, type: 'villa_dais' }
        ],
        chocolates: [
            { x: 230, y: 320 },
            { x: 340, y: 410 },
            { x: 480, y: 260 },
            { x: 580, y: 140 },
            { x: 730, y: 300 },
            { x: 820, y: 410 },
            { x: 980, y: 270 },
            { x: 1040, y: 410 },
            { x: 1180, y: 170 },
            { x: 300, y: 200 },
            { x: 860, y: 180 },
            { x: 1210, y: 260 }
        ]
    }
];

class EnvironmentRenderer {
    static drawBackdrop(ctx, levelId, cameraX, width, height, timer) {
        if (levelId === 1) {
            this.drawParliamentGardens(ctx, cameraX, width, height, timer);
        } else if (levelId === 2) {
            this.drawG7Corridor(ctx, cameraX, width, height, timer);
        } else if (levelId === 3) {
            this.drawCosmicRunway(ctx, cameraX, width, height, timer);
        } else {
            this.drawRomanVilla(ctx, cameraX, width, height, timer);
        }
    }

    static drawRomanVilla(ctx, cameraX, width, height, timer) {
        // Romantic Tuscan Sunset Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#3a1c4a');    // Deep sunset purple
        skyGrad.addColorStop(0.35, '#9d3257'); // Romantic velvet rose
        skyGrad.addColorStop(0.7, '#e06d53');  // Warm coral terracotta
        skyGrad.addColorStop(1, '#ffc77d');    // Golden sunset amber
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Golden Tuscan Setting Sun
        ctx.save();
        const sunX = width * 0.7 - cameraX * 0.04;
        const sunGrad = ctx.createRadialGradient(sunX, 170, 10, sunX, 170, 85);
        sunGrad.addColorStop(0, 'rgba(255, 245, 190, 0.95)');
        sunGrad.addColorStop(0.4, 'rgba(255, 170, 70, 0.55)');
        sunGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, 170, 85, 0, Math.PI * 2);
        ctx.fill();

        // Distant Tuscan Rolling Hills (Parallax 0.12)
        const hillOffset = -cameraX * 0.12;
        ctx.fillStyle = '#612a43';
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = -100; x <= width + 200; x += 140) {
            const hx = x + (hillOffset % 140);
            ctx.quadraticCurveTo(hx + 70, 310 + Math.sin(x * 0.02) * 20, hx + 140, 340);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Tuscan Cypress Trees (Parallax 0.2)
        const treeOffset = -cameraX * 0.2;
        for (let x = -80; x < width + 300; x += 160) {
            const tx = x + (treeOffset % 160);
            ctx.fillStyle = '#1e3d2f';
            ctx.beginPath();
            ctx.ellipse(tx, 335, 9, 52, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(tx - 2, 385, 4, 30);
        }

        // Roman Classical Archways with Climbing Red Roses (Parallax 0.3)
        const archStep = 220;
        const archOffset = -cameraX * 0.3;
        for (let x = -100; x < width + 400; x += archStep) {
            const ax = x + (archOffset % archStep);

            // Travertine Columns
            ctx.fillStyle = '#ede0d4';
            ctx.fillRect(ax, 190, 26, 270);
            ctx.strokeStyle = '#c9b09a';
            ctx.lineWidth = 2;
            ctx.strokeRect(ax, 190, 26, 270);

            // Classical Arch
            ctx.strokeStyle = 'rgba(237, 224, 212, 0.85)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(ax + archStep / 2, 190, archStep / 2 - 13, Math.PI, 0);
            ctx.stroke();

            // Climbing Red Roses along columns
            for (let v = 0; v < 6; v++) {
                const vy = 210 + v * 38;
                ctx.fillStyle = '#2d6a4f';
                ctx.beginPath();
                ctx.arc(ax + (v % 2 === 0 ? -4 : 28), vy, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#e60039';
                ctx.beginPath();
                ctx.arc(ax + (v % 2 === 0 ? -3 : 27), vy, 4.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    static drawParliamentGardens(ctx, cameraX, width, height, timer) {
        // Sky: Pastel morning gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#a1c4fd');
        skyGrad.addColorStop(0.5, '#c2e9fb');
        skyGrad.addColorStop(0.85, '#e8f5e9');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Gentle Morning Sun
        ctx.fillStyle = '#fff8e1';
        ctx.beginPath();
        ctx.arc(width * 0.75 - cameraX * 0.05, 100, 44, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 236, 179, 0.3)';
        ctx.beginPath();
        ctx.arc(width * 0.75 - cameraX * 0.05, 100, 64, 0, Math.PI * 2);
        ctx.fill();

        // Distant Parliament Colonnade & Central Dome Silhouette
        ctx.save();
        const parlX = 350 - cameraX * 0.15;
        ctx.fillStyle = '#d7ccc8';
        ctx.strokeStyle = '#bcaaa4';
        ctx.lineWidth = 2;

        // Central Dome
        ctx.beginPath();
        ctx.arc(parlX + 240, 230, 65, Math.PI, 0);
        ctx.fill();
        ctx.stroke();

        // Dome Spire
        ctx.fillStyle = '#a1887f';
        ctx.fillRect(parlX + 237, 140, 6, 25);
        ctx.beginPath();
        ctx.arc(parlX + 240, 136, 6, 0, Math.PI * 2);
        ctx.fill();

        // Long Colonnade Hall
        ctx.fillStyle = '#efebe9';
        ctx.fillRect(parlX - 60, 230, 600, 150);
        ctx.strokeRect(parlX - 60, 230, 600, 150);

        // Columns
        ctx.fillStyle = '#d7ccc8';
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(parlX - 45 + i * 29, 245, 12, 130);
        }
        ctx.restore();

        // Midground Flowering Garden Hedges aligned nicely with the ground (Parallax 0.4)
        ctx.save();
        const hedgeOffset = -cameraX * 0.4;
        for (let i = -100; i < width + 400; i += 85) {
            const hx = i + (hedgeOffset % 85);
            ctx.fillStyle = (i % 170 === 0) ? '#66bb6a' : '#81c784';
            ctx.beginPath();
            ctx.arc(hx, 440, 44, 0, Math.PI * 2);
            ctx.fill();

            // Flower blossoms
            ctx.fillStyle = (i % 2 === 0) ? '#ff4081' : '#ffd54f';
            ctx.beginPath();
            ctx.arc(hx - 10, 420, 4, 0, Math.PI * 2);
            ctx.arc(hx + 12, 430, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    static drawG7Corridor(ctx, cameraX, width, height, timer) {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, height);
        wallGrad.addColorStop(0, '#1a1c29');
        wallGrad.addColorStop(0.4, '#242b3d');
        wallGrad.addColorStop(0.85, '#1e202f');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        const pillarStep = 180;
        const offset = -cameraX * 0.2;
        for (let x = -100; x < width + 300; x += pillarStep) {
            const px = x + (offset % pillarStep);

            // Marble Pillars
            const marbleGrad = ctx.createLinearGradient(px, 0, px + 40, 0);
            marbleGrad.addColorStop(0, '#ffffff');
            marbleGrad.addColorStop(0.5, '#e0e0e0');
            marbleGrad.addColorStop(1, '#bdbdbd');
            ctx.fillStyle = marbleGrad;
            ctx.fillRect(px, 60, 40, 400);

            // Gold Capital & Base
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(px - 5, 60, 50, 14);
            ctx.fillRect(px - 5, 446, 50, 14);

            // Arch
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(px + pillarStep / 2, 70, pillarStep / 2 - 20, Math.PI, 0);
            ctx.stroke();

            // Flags
            const flagColors = [
                ['#0055a5', '#ffffff', '#ef4135'], // France
                ['#009246', '#ffffff', '#ce2b37'], // Italy
                ['#00247d', '#ffffff', '#cf142b'], // UK
                ['#ff9933', '#ffffff', '#138808'], // India
                ['#000000', '#dd0000', '#ffce00']  // Germany
            ];
            const flag = flagColors[Math.abs(Math.floor(x / pillarStep)) % flagColors.length];
            const fx = px + 65;
            const fy = 105;
            ctx.fillStyle = flag[0]; ctx.fillRect(fx, fy, 10, 18);
            ctx.fillStyle = flag[1]; ctx.fillRect(fx + 10, fy, 10, 18);
            ctx.fillStyle = flag[2]; ctx.fillRect(fx + 20, fy, 10, 18);
        }

        // Chandeliers
        for (let cx = 50; cx < width + 200; cx += 260) {
            const chX = cx - cameraX * 0.25;
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(chX, 0);
            ctx.lineTo(chX, 40);
            ctx.stroke();

            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(chX, 46, 12, 0, Math.PI);
            ctx.fill();

            const lightGlow = ctx.createRadialGradient(chX, 48, 2, chX, 48, 30);
            lightGlow.addColorStop(0, 'rgba(255, 241, 118, 0.6)');
            lightGlow.addColorStop(1, 'rgba(255, 241, 118, 0)');
            ctx.fillStyle = lightGlow;
            ctx.beginPath();
            ctx.arc(chX, 48, 30, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    static drawCosmicRunway(ctx, cameraX, width, height, timer) {
        const spaceGrad = ctx.createLinearGradient(0, 0, width, height);
        spaceGrad.addColorStop(0, '#0a0a1a');
        spaceGrad.addColorStop(0.5, '#1b0933');
        spaceGrad.addColorStop(1, '#051829');
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        const nebX = (width * 0.4) - cameraX * 0.08;
        const nebGrad = ctx.createRadialGradient(nebX, 200, 20, nebX, 200, 260);
        nebGrad.addColorStop(0, 'rgba(255, 0, 128, 0.25)');
        nebGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.18)');
        nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(nebX, 200, 260, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        const starSeed = [
            { x: 80, y: 60, s: 2.2 }, { x: 190, y: 120, s: 1.5 }, { x: 320, y: 50, s: 2.5 },
            { x: 460, y: 160, s: 1.8 }, { x: 580, y: 70, s: 2.0 }, { x: 710, y: 110, s: 1.4 },
            { x: 840, y: 40, s: 2.6 }, { x: 990, y: 140, s: 2.0 }, { x: 1120, y: 80, s: 1.7 },
            { x: 1260, y: 130, s: 2.4 }
        ];

        starSeed.forEach((star, i) => {
            const twinkle = 0.5 + Math.sin(timer * 4 + i) * 0.5;
            ctx.globalAlpha = twinkle;
            const sx = (star.x - cameraX * 0.1) % (width + 200);
            const finalSx = sx < 0 ? sx + width + 200 : sx;
            ctx.beginPath();
            ctx.arc(finalSx, star.y, star.s, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        const planetX = width * 0.85 - cameraX * 0.05;
        const planetY = 100;
        ctx.fillStyle = '#ff6b81';
        ctx.beginPath();
        ctx.arc(planetX, planetY, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(planetX, planetY, 60, 11, -0.3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    static drawPlatform(ctx, p, levelId, timer) {
        ctx.save();

        if (p.type === 'ground' || p.type === 'terrace') {
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(p.x, p.y, p.w, 7);

            ctx.fillStyle = '#bcaaa4';
            ctx.fillRect(p.x, p.y + 7, p.w, p.h - 7);

            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#a1887f';
            for (let x = p.x + 10; x < p.x + p.w - 10; x += 22) {
                ctx.fillRect(x, p.y + 7, 4, p.h - 7);
            }
        } else if (p.type === 'carpet') {
            ctx.fillStyle = '#c62828';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.fillRect(p.x, p.y + p.h - 6, p.w, 6);

            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([12, 8]);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y + 12);
            ctx.lineTo(p.x + p.w, p.y + 12);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (p.type === 'g7_platform' || p.type === 'balcony') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);

            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = 'rgba(0, 229, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(p.x + 18, p.y + p.h, 5, 0, Math.PI);
            ctx.arc(p.x + p.w - 18, p.y + p.h, 5, 0, Math.PI);
            ctx.fill();
        } else if (p.type === 'cosmic_runway') {
            ctx.fillStyle = '#101226';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.fillRect(p.x, p.y, p.w, 5);
            ctx.shadowBlur = 0;

            ctx.strokeStyle = 'rgba(255, 0, 128, 0.4)';
            ctx.lineWidth = 2;
            for (let x = p.x; x < p.x + p.w; x += 36) {
                ctx.beginPath();
                ctx.moveTo(x, p.y);
                ctx.lineTo(x - 18, p.y + p.h);
                ctx.stroke();
            }
        } else if (p.type.startsWith('shifting')) {
            ctx.fillStyle = '#1e1035';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            const pulse = (Math.sin(timer * 6) + 1) * 0.5;
            ctx.strokeStyle = pulse > 0.5 ? '#ff007f' : '#00e5ff';
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 8;
            ctx.lineWidth = 3;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#00e5ff';
            ctx.beginPath();
            ctx.arc(p.x + p.w * 0.3, p.y + p.h + 2, 3, 0, Math.PI * 2);
            ctx.arc(p.x + p.w * 0.7, p.y + p.h + 2, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'terracotta_ground') {
            // Level 4 Terracotta Roman Garden Walkway
            ctx.fillStyle = '#b85d38';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            // Travertine stone coping on top
            ctx.fillStyle = '#ede0d4';
            ctx.fillRect(p.x, p.y, p.w, 8);
            ctx.strokeStyle = '#c9b09a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(p.x, p.y, p.w, 8);

            // Brick joint lines
            ctx.strokeStyle = '#8d3b1f';
            ctx.lineWidth = 1.2;
            for (let x = p.x + 16; x < p.x + p.w; x += 32) {
                ctx.beginPath();
                ctx.moveTo(x, p.y + 8);
                ctx.lineTo(x, p.y + p.h);
                ctx.stroke();
            }
        } else if (p.type === 'rose_trellis') {
            // Italian Cream Marble Trellis with Climbing Red Roses
            ctx.fillStyle = '#fbf7ee';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            // Golden ornamental borders
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(p.x, p.y, p.w, 3);
            ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);

            ctx.strokeStyle = '#b89230';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);

            // Green ivy vine along the bottom of the trellis
            ctx.fillStyle = '#2d6a4f';
            for (let x = p.x + 12; x < p.x + p.w - 10; x += 24) {
                ctx.beginPath();
                ctx.arc(x, p.y + p.h - 2, 4, 0, Math.PI * 2);
                ctx.fill();
                // Red rosebud
                ctx.fillStyle = '#e60039';
                ctx.beginPath();
                ctx.arc(x + 5, p.y + p.h - 2, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2d6a4f';
            }
        } else if (p.type === 'dais' || p.type === 'cosmic_dais' || p.type === 'villa_dais') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 4;
            ctx.strokeRect(p.x, p.y, p.w, p.h);

            // Royal red velvet carpet on dais
            ctx.fillStyle = p.type === 'villa_dais' ? '#b3002d' : '#ff1493';
            ctx.fillRect(p.x + 8, p.y + 6, p.w - 16, p.h - 12);

            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.strokeRect(p.x, p.y, p.w, 4);
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
        }

        ctx.restore();
    }
}
