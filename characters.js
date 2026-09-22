/**
 * Procedural Canvas Character & FX Renderer for Melody Quest
 * Renders Modi, Meloni, Rahul, Ramya, Melody Chocolates, Hearts, and Particles.
 */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    addSparkles(x, y, count = 8, color = '#ffd700') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 3 + Math.random() * 4,
                color,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type: 'star'
            });
        }
    }

    addHearts(x, y, count = 5) {
        const colors = ['#ff2a85', '#ff69b4', '#ff8da1', '#ff1493'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -1.8 - Math.random() * 2,
                size: 8 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.015 + Math.random() * 0.015,
                type: 'heart'
            });
        }
    }

    addMusicalNotes(x, y, count = 4) {
        const notes = ['♪', '♫', '♬', '♩'];
        const colors = ['#ff007f', '#00f0ff', '#ffd700', '#00ff88', '#ff69b4'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2.0,
                vy: -2.0 - Math.random() * 2.2,
                char: notes[Math.floor(Math.random() * notes.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                fontSize: 16 + Math.random() * 10,
                life: 1.0,
                decay: 0.012 + Math.random() * 0.01,
                type: 'note'
            });
        }
    }

    addRosePetals(x, y, count = 6) {
        const colors = ['#e60039', '#ff1a53', '#b3002d', '#ff4d79'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 25,
                y: y + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 2.2,
                vy: -1.2 + Math.random() * 1.6,
                width: 8 + Math.random() * 5,
                height: 11 + Math.random() * 6,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.12,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.014 + Math.random() * 0.01,
                type: 'petal'
            });
        }
    }

    addConfetti(x, y, count = 16, dir = 1) {
        const colors = ['#ff007f', '#00f0ff', '#ffe600', '#00ff66', '#ff8800', '#9d00ff'];
        for (let i = 0; i < count; i++) {
            const angle = (dir > 0 ? -0.3 : Math.PI + 0.3) + (Math.random() - 0.5) * 0.8;
            const speed = 4 + Math.random() * 6;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4 + Math.random() * 4,
                width: 6 + Math.random() * 6,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.018 + Math.random() * 0.015,
                type: 'confetti'
            });
        }
    }

    addFloatingText(text, x, y, color = '#ffffff', fontSize = 18) {
        this.floatingTexts.push({
            text,
            x,
            y,
            vy: -1.2,
            life: 1.0,
            decay: 0.02,
            color,
            fontSize
        });
    }

    update() {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.type === 'confetti') {
                p.vy += 0.15; // gravity
                p.rotation += p.rotSpeed;
            } else if (p.type === 'petal') {
                p.vy += 0.035;
                p.vx += Math.sin(p.rotation) * 0.1;
                p.rotation += p.rotSpeed;
            } else {
                p.vy += 0.04;
            }
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.life -= t.decay;
            if (t.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life);
            if (p.type === 'star') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                const spikes = 4;
                const outer = p.size;
                const inner = p.size * 0.4;
                for (let i = 0; i < spikes * 2; i++) {
                    const r = (i % 2 === 0) ? outer : inner;
                    const a = (i * Math.PI) / spikes;
                    const px = p.x + Math.cos(a) * r;
                    const py = p.y + Math.sin(a) * r;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
            } else if (p.type === 'heart') {
                ctx.fillStyle = p.color;
                this.drawHeartShape(ctx, p.x, p.y, p.size);
            } else if (p.type === 'confetti') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.width / 2, -p.size / 2, p.width, p.size);
                ctx.restore();
            } else if (p.type === 'note') {
                ctx.save();
                ctx.font = `bold ${p.fontSize}px sans-serif`;
                ctx.fillStyle = p.color;
                ctx.strokeStyle = '#1a1a2e';
                ctx.lineWidth = 2.5;
                ctx.strokeText(p.char, p.x, p.y);
                ctx.fillText(p.char, p.x, p.y);
                ctx.restore();
            } else if (p.type === 'petal') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.width * 0.5, p.height * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Draw Floating texts
        for (const t of this.floatingTexts) {
            ctx.globalAlpha = Math.max(0, t.life);
            ctx.font = `900 ${t.fontSize}px 'Outfit', 'Segoe UI', sans-serif`;
            ctx.textAlign = 'center';
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#1b1b2f';
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, t.x, t.y);
        }
        ctx.restore();
    }

    drawHeartShape(ctx, x, y, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        // bottom left curve
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
        // bottom right curve
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        // top right curve
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath();
        ctx.fill();
    }
}

class CharacterRenderer {
    /**
     * Renders Modi
     * - White/grey beard and hair
     * - Gold/saffron Nehru vest jacket
     * - Crisp white kurta
     * - Round glasses
     * - Animated walking/gifting gestures
     */
    static drawModi(ctx, x, y, width, height, state) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        // Invulnerability flicker
        if (state.invulnerable && Math.floor(state.timer * 15) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        const facing = state.facing || 1; // 1 = right, -1 = left
        ctx.scale(facing, 1);

        const isRunning = Math.abs(state.vx) > 0.4 && state.grounded;
        const walkCycle = isRunning ? Math.sin(state.timer * 14) : 0;
        const bob = isRunning ? Math.abs(Math.cos(state.timer * 14)) * 3 : Math.sin(state.timer * 3) * 1.5;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.45, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (Kurta trousers + shoes)
        const legSwing = walkCycle * 8;
        // Left Leg
        ctx.fillStyle = '#f8f9fa';
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-10 - legSwing * 0.5, -20 - bob, 8, 18, 4);
        ctx.fill();
        ctx.stroke();

        // Left Shoe
        ctx.fillStyle = '#634832'; // Brown mojari
        ctx.beginPath();
        ctx.roundRect(-12 - legSwing * 0.5, -5 - bob, 12, 6, [3, 6, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Right Leg
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.roundRect(2 + legSwing * 0.5, -20 - bob, 8, 18, 4);
        ctx.fill();
        ctx.stroke();

        // Right Shoe
        ctx.fillStyle = '#634832';
        ctx.beginPath();
        ctx.roundRect(0 + legSwing * 0.5, -5 - bob, 12, 6, [3, 6, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Torso - White Kurta
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-16, -46 - bob, 32, 28, [6, 6, 3, 3]);
        ctx.fill();
        ctx.stroke();

        // Saffron / Golden Nehru Vest Jacket
        ctx.fillStyle = '#ff9933'; // Indian Saffron
        ctx.beginPath();
        ctx.roundRect(-15, -46 - bob, 30, 24, [5, 5, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Jacket detail: buttons & pocket square
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(3, -40 - bob, 2, 0, Math.PI * 2);
        ctx.arc(3, -34 - bob, 2, 0, Math.PI * 2);
        ctx.arc(3, -28 - bob, 2, 0, Math.PI * 2);
        ctx.fill();

        // Golden pocket square
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-12, -39 - bob, 6, 3);

        // Arms
        if (state.celebrating) {
            // Clapping hands in rhythm with Meloni's dance
            const clap = Math.sin(state.timer * 14);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2.2;
            // Left clapping arm
            ctx.beginPath();
            ctx.roundRect(0 - clap * 2, -42 - bob, 14, 6, 3);
            ctx.fill();
            ctx.stroke();
            // Right clapping arm
            ctx.beginPath();
            ctx.roundRect(10 + clap * 2, -42 - bob, 14, 6, 3);
            ctx.fill();
            ctx.stroke();

            // Clapping hands meeting
            ctx.fillStyle = '#f5c6a5';
            ctx.beginPath();
            ctx.arc(12, -39 - bob, 4.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (state.presenting) {
            // Presenting arms outstretched holding gift
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(6, -42 - bob, 18, 7, 3);
            ctx.fill();
            ctx.stroke();

            // Hand
            ctx.fillStyle = '#f5c6a5';
            ctx.beginPath();
            ctx.arc(24, -38 - bob, 4, 0, Math.PI * 2);
            ctx.fill();

            if (state.presentingRose) {
                CharacterRenderer.drawRose(ctx, 15, -60 - bob, 18, 18, state.timer * 2);
            }
        } else {
            // Arm swinging
            const armAngle = -walkCycle * 0.5;
            ctx.save();
            ctx.translate(-4, -40 - bob);
            ctx.rotate(armAngle);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-4, 0, 7, 18, 3);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#f5c6a5';
            ctx.beginPath();
            ctx.arc(0, 18, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Head Base
        ctx.fillStyle = '#f5c6a5'; // Warm skin tone
        ctx.beginPath();
        ctx.arc(0, -56 - bob, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // White/Silver Hair (Back & Sides)
        ctx.fillStyle = '#e9ecef';
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -60 - bob, 13, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        ctx.stroke();

        // Styled White/Grey Beard
        ctx.fillStyle = '#f8f9fa';
        ctx.strokeStyle = '#adb5bd';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, -55 - bob);
        ctx.quadraticCurveTo(-12, -45 - bob, -2, -42 - bob);
        ctx.quadraticCurveTo(8, -42 - bob, 11, -47 - bob);
        ctx.quadraticCurveTo(12, -55 - bob, 6, -55 - bob);
        ctx.quadraticCurveTo(0, -48 - bob, -10, -55 - bob);
        ctx.fill();
        ctx.stroke();

        // White Mustache
        ctx.beginPath();
        ctx.arc(4, -53 - bob, 4.5, 0, Math.PI);
        ctx.fill();
        ctx.stroke();

        // Eyes & Eyebrows
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(5, -58 - bob, 2, 0, Math.PI * 2);
        ctx.fill();

        // Silver/White Eyebrow
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(1, -62 - bob);
        ctx.lineTo(8, -61 - bob);
        ctx.stroke();

        // Spectacle Frame (Signature round glasses)
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(5, -57 - bob, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -57 - bob);
        ctx.lineTo(-4, -58 - bob);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Renders Meloni
     * - Elegant Italian designer emerald/pastel gown
     * - Blonde wavy hair
     * - Golden jewelry / brooch
     * - Cheerful smile & expressive reactions
     */
    static drawMeloni(ctx, x, y, width, height, state) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        const isShyAndDance = state.shyAndDance;
        const danceTimer = state.danceTimer || 0;
        const isShy = isShyAndDance && (danceTimer < 1.4);
        const isDancing = isShyAndDance && (danceTimer >= 1.4);

        let bob = Math.sin(state.timer * 3) * 2;
        let danceHop = 0;
        let gownTwirl = 0;
        let hairSway = 0;

        if (isShy) {
            // Cute bashful tilt
            ctx.rotate(Math.sin(danceTimer * 5) * 0.07);
            bob = Math.sin(danceTimer * 6) * 1.5;
        } else if (isDancing) {
            // Bouncy joyful dance hop and side-to-side sway
            danceHop = Math.abs(Math.sin((danceTimer - 1.4) * 10)) * 14;
            const sway = Math.sin((danceTimer - 1.4) * 6) * 0.13;
            ctx.rotate(sway);
            gownTwirl = Math.sin((danceTimer - 1.4) * 11) * 9;
            hairSway = -sway * 16;
        }

        const receiving = state.receivingGift;

        // Platform glow / aura (Pulsing brighter when dancing!)
        const auraSize = isDancing ? 65 + Math.sin(danceTimer * 8) * 8 : 55;
        const gradient = ctx.createRadialGradient(0, -35 - danceHop, 10, 0, -35 - danceHop, auraSize);
        gradient.addColorStop(0, isDancing ? 'rgba(255, 0, 128, 0.45)' : 'rgba(255, 105, 180, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 105, 180, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, -35 - danceHop, auraSize, 0, Math.PI * 2);
        ctx.fill();

        // Shadow (shrinks when she hops)
        const shadowScale = isDancing ? Math.max(0.4, 1 - danceHop * 0.04) : 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 0, (width * 0.48) * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flowing Emerald Gown
        ctx.fillStyle = '#0f8a5f'; // Emerald green
        ctx.strokeStyle = '#075037';
        ctx.lineWidth = 2.5;

        const baseSway = Math.sin(state.timer * 4) * 3;
        const swayTotal = isDancing ? gownTwirl : baseSway;

        ctx.beginPath();
        ctx.moveTo(-12, -45 - bob - danceHop);
        ctx.lineTo(12, -45 - bob - danceHop);
        ctx.quadraticCurveTo(18 + swayTotal, -15 - bob - danceHop, (22 + (isDancing ? 6 : 0)) + swayTotal, -danceHop);
        ctx.lineTo((-22 - (isDancing ? 6 : 0)) + swayTotal, -danceHop);
        ctx.quadraticCurveTo(-18 + swayTotal, -15 - bob - danceHop, -12, -45 - bob - danceHop);
        ctx.fill();
        ctx.stroke();

        // Gown golden belt / brooch
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-10, -38 - bob - danceHop, 20, 4);
        ctx.beginPath();
        ctx.arc(0, -36 - bob - danceHop, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Torso / Neck
        ctx.fillStyle = '#fde2d0'; // Soft complexion
        ctx.beginPath();
        ctx.roundRect(-7, -54 - bob - danceHop, 14, 12, 3);
        ctx.fill();

        // Golden Necklace
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -48 - bob - danceHop, 5, 0, Math.PI);
        ctx.stroke();

        // Arms & Gestures
        if (isShy) {
            // Cute bashful hands brought up shyly to covering cheeks!
            ctx.fillStyle = '#0f8a5f';
            ctx.strokeStyle = '#075037';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-15, -46 - bob, 6, 12, 3);
            ctx.roundRect(9, -46 - bob, 6, 12, 3);
            ctx.fill();
            ctx.stroke();

            // Hands touching cheeks shyly
            ctx.fillStyle = '#fde2d0';
            ctx.beginPath();
            ctx.arc(-8, -48 - bob, 4, 0, Math.PI * 2);
            ctx.arc(8, -48 - bob, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (isDancing) {
            // Joyful celebration dance arms waving high in rhythm!
            const armWave = Math.sin((danceTimer - 1.4) * 10) * 10;
            ctx.fillStyle = '#0f8a5f';
            ctx.strokeStyle = '#075037';
            ctx.lineWidth = 2;
            // Left raised arm
            ctx.save();
            ctx.translate(-10, -48 - bob - danceHop);
            ctx.rotate(-0.8 + armWave * 0.04);
            ctx.beginPath();
            ctx.roundRect(-4, -18, 6, 18, 3);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fde2d0';
            ctx.beginPath();
            ctx.arc(-1, -19, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Right raised arm
            ctx.save();
            ctx.translate(10, -48 - bob - danceHop);
            ctx.rotate(0.8 - armWave * 0.04);
            ctx.fillStyle = '#0f8a5f';
            ctx.beginPath();
            ctx.roundRect(-2, -18, 6, 18, 3);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fde2d0';
            ctx.beginPath();
            ctx.arc(1, -19, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (receiving) {
            // Joyful clasp
            ctx.fillStyle = '#fde2d0';
            ctx.strokeStyle = '#075037';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(-8, -45 - bob, 4, 0, Math.PI * 2);
            ctx.arc(8, -45 - bob, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else {
            // Gentle welcoming pose
            ctx.fillStyle = '#0f8a5f';
            ctx.beginPath();
            ctx.roundRect(-16, -45 - bob, 6, 18, 3);
            ctx.roundRect(10, -45 - bob, 6, 18, 3);
            ctx.fill();
            ctx.stroke();

            // Hands
            ctx.fillStyle = '#fde2d0';
            ctx.beginPath();
            ctx.arc(-13, -26 - bob, 3.5, 0, Math.PI * 2);
            ctx.arc(13, -26 - bob, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Head
        ctx.fillStyle = '#fde2d0';
        ctx.strokeStyle = '#d49b78';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -60 - bob - danceHop, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sleek Straight Blonde Hair (with graceful swaying physics when dancing)
        ctx.fillStyle = '#f7d070';
        ctx.strokeStyle = '#dfaa38';
        ctx.lineWidth = 1.8;

        // Back Hair Volume
        ctx.beginPath();
        ctx.roundRect(-16 + hairSway * 0.4, -66 - bob - danceHop, 32, 42, [14, 14, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Left Straight Side Lock
        ctx.fillStyle = '#fce588';
        ctx.beginPath();
        ctx.moveTo(-10, -64 - bob - danceHop);
        ctx.lineTo(-17, -54 - bob - danceHop);
        ctx.lineTo(-15 + hairSway, -24 - bob - danceHop);
        ctx.lineTo(-9 + hairSway, -24 - bob - danceHop);
        ctx.lineTo(-10, -50 - bob - danceHop);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Straight Side Lock
        ctx.beginPath();
        ctx.moveTo(10, -64 - bob - danceHop);
        ctx.lineTo(17, -54 - bob - danceHop);
        ctx.lineTo(15 + hairSway, -24 - bob - danceHop);
        ctx.lineTo(9 + hairSway, -24 - bob - danceHop);
        ctx.lineTo(10, -50 - bob - danceHop);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Crown Hair with Center Part
        ctx.fillStyle = '#f7d070';
        ctx.beginPath();
        ctx.arc(0, -64 - bob - danceHop, 13.5, Math.PI * 0.85, Math.PI * 2.15);
        ctx.fill();
        ctx.stroke();

        // Sleek Straight Parting Line
        ctx.strokeStyle = '#dfaa38';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -76 - bob - danceHop);
        ctx.lineTo(0, -67 - bob - danceHop);
        ctx.stroke();

        // Silky Straight Hair Highlights
        ctx.strokeStyle = '#fff5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-13, -56 - bob - danceHop);
        ctx.lineTo(-13 + hairSway * 0.5, -28 - bob - danceHop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(13, -56 - bob - danceHop);
        ctx.lineTo(13 + hairSway * 0.5, -28 - bob - danceHop);
        ctx.stroke();

        // Face Features
        if (isShy) {
            // Cute bashful happy closed curved eyes (^ ^)
            ctx.strokeStyle = '#1b1b2f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(-4, -58 - bob, 3, Math.PI * 1.1, Math.PI * 1.9);
            ctx.arc(4, -58 - bob, 3, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();

            // Cute shy bashful smile
            ctx.strokeStyle = '#e63946';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -54 - bob, 3, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // Extra Glowing Rosy Pink Heart Blush!
            ctx.fillStyle = 'rgba(255, 0, 128, 0.65)';
            ParticleSystem.prototype.drawHeartShape(ctx, -7, -56 - bob, 6);
            ParticleSystem.prototype.drawHeartShape(ctx, 7, -56 - bob, 6);
        } else {
            // Azure Blue Eyes
            ctx.fillStyle = '#1e88e5';
            ctx.beginPath();
            ctx.arc(-4, -60 - bob - danceHop, 2.2, 0, Math.PI * 2);
            ctx.arc(4, -60 - bob - danceHop, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Highlights
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-5, -61 - bob - danceHop, 0.9, 0, Math.PI * 2);
            ctx.arc(3, -61 - bob - danceHop, 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Lashes
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-7, -62 - bob - danceHop);
            ctx.lineTo(-2, -62 - bob - danceHop);
            ctx.moveTo(2, -62 - bob - danceHop);
            ctx.lineTo(7, -62 - bob - danceHop);
            ctx.stroke();

            // Cheerful Radiant Smile
            ctx.strokeStyle = '#e63946';
            ctx.lineWidth = isDancing ? 2.5 : 2;
            ctx.beginPath();
            ctx.arc(0, -55 - bob - danceHop, isDancing ? 5 : 4, 0.1, Math.PI - 0.1);
            ctx.stroke();

            // Cheerful Pink Blush
            ctx.fillStyle = isDancing ? 'rgba(255, 0, 128, 0.55)' : 'rgba(255, 105, 180, 0.45)';
            ctx.beginPath();
            ctx.arc(-7, -56 - bob - danceHop, isDancing ? 3.5 : 2.8, 0, Math.PI * 2);
            ctx.arc(7, -56 - bob - danceHop, isDancing ? 3.5 : 2.8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * Renders Rahul
     * - White kurta profile with rolled-up sleeves
     * - Exaggerated animated running gait
     * - Confetti cannon in Level 3
     */
    static drawRahul(ctx, x, y, width, height, state) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        const facing = state.facing || 1;
        ctx.scale(facing, 1);

        const isRunning = Math.abs(state.vx) > 0.1;
        const runCycle = isRunning ? Math.sin(state.timer * 16) : 0;
        const bob = isRunning ? Math.abs(Math.cos(state.timer * 16)) * 4 : 0;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.45, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Exaggerated Running Legs
        const legStride = runCycle * 14;

        // Back Leg
        ctx.fillStyle = '#2b3a4a'; // Dark denim / trousers
        ctx.strokeStyle = '#1b1b2f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-8 - legStride, -22 - bob, 8, 20, 3);
        ctx.fill();
        ctx.stroke();

        // Back Shoe
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-10 - legStride, -4 - bob, 11, 5, 2);
        ctx.fill();
        ctx.stroke();

        // Front Leg
        ctx.fillStyle = '#2b3a4a';
        ctx.beginPath();
        ctx.roundRect(2 + legStride, -22 - bob, 8, 20, 3);
        ctx.fill();
        ctx.stroke();

        // Front Shoe
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(1 + legStride, -4 - bob, 12, 5, 2);
        ctx.fill();
        ctx.stroke();

        // Torso - White Kurta
        ctx.fillStyle = '#f8f9fa';
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-14, -46 - bob, 28, 28, [5, 5, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Kurta neck placket
        ctx.strokeStyle = '#adb5bd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -46 - bob);
        ctx.lineTo(0, -32 - bob);
        ctx.stroke();

        // Arms & Level 3 Confetti Cannon
        if (state.hasCannon) {
            // Holding party cannon
            ctx.fillStyle = '#ffd700'; // Gold cannon body
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(4, -36 - bob, 22, 10, 4);
            ctx.fill();
            ctx.stroke();

            // Cannon muzzle
            ctx.fillStyle = '#ff007f';
            ctx.beginPath();
            ctx.ellipse(26, -31 - bob, 3, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Arms holding it
            ctx.fillStyle = '#f8f9fa';
            ctx.beginPath();
            ctx.roundRect(-6, -42 - bob, 16, 7, 3);
            ctx.fill();
            ctx.stroke();
        } else {
            // Running arms
            const armSwing = -runCycle * 12;
            ctx.fillStyle = '#f8f9fa';
            ctx.beginPath();
            ctx.roundRect(armSwing - 4, -40 - bob, 7, 18, 3);
            ctx.fill();
            ctx.stroke();

            // Hand
            ctx.fillStyle = '#e8beac';
            ctx.beginPath();
            ctx.arc(armSwing, -22 - bob, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Head
        ctx.fillStyle = '#e8beac';
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -56 - bob, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Short dark hair / stylized puff
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.arc(0, -60 - bob, 12.5, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();

        // Light beard/stubble shadow
        ctx.fillStyle = 'rgba(40, 40, 40, 0.2)';
        ctx.beginPath();
        ctx.arc(3, -52 - bob, 7, 0, Math.PI * 0.8);
        ctx.fill();

        // Eye & Eyebrows (Determined / playful)
        ctx.fillStyle = '#1b1b2f';
        ctx.beginPath();
        ctx.arc(5, -57 - bob, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(1, -61 - bob);
        ctx.lineTo(8, -60 - bob);
        ctx.stroke();

        // Smirk
        ctx.beginPath();
        ctx.arc(3, -53 - bob, 3, 0.2, Math.PI * 0.8);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Renders Ramya
     * - Standing on VIP Balcony / Floating Podium
     * - Stylized coral/fuchsia ensemble
     * - Dropping animated Distraction Hearts
     */
    static drawRamya(ctx, x, y, width, height, state) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        const bob = Math.sin(state.timer * 4) * 2.5;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.45, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chic Outfit (Coral / Fuchsia)
        ctx.fillStyle = '#ff2a85';
        ctx.strokeStyle = '#b80053';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-11, -38 - bob, 22, 28, [4, 4, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // Stylish gold belt
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-10, -26 - bob, 20, 3);

        // Arms (gesturing or dropping heart)
        ctx.fillStyle = '#fce2d3';
        ctx.strokeStyle = '#b80053';
        ctx.lineWidth = 1.8;
        // Outstretched arm dropping heart
        ctx.beginPath();
        ctx.roundRect(-16, -36 - bob, 7, 16, 3);
        ctx.roundRect(8, -36 - bob, 14, 6, 3);
        ctx.fill();
        ctx.stroke();

        // Dropping heart preview near hand
        const heartPulse = 1 + Math.sin(state.timer * 8) * 0.2;
        ctx.fillStyle = '#ff1493';
        ParticleSystem.prototype.drawHeartShape(ctx, 22, -38 - bob, 8 * heartPulse);

        // Head & Hair
        ctx.fillStyle = '#fce2d3';
        ctx.beginPath();
        ctx.arc(0, -48 - bob, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Stylish Dark Bob / Waves
        ctx.fillStyle = '#1a1a24';
        ctx.beginPath();
        ctx.arc(0, -52 - bob, 11, Math.PI * 0.85, Math.PI * 2.15);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(-11, -50 - bob, 5, 14, 2);
        ctx.roundRect(7, -50 - bob, 5, 14, 2);
        ctx.fill();

        // Chic Sunglasses / Eyes
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.roundRect(-6, -50 - bob, 6, 4, 1);
        ctx.roundRect(1, -50 - bob, 6, 4, 1);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lipstick Smile
        ctx.fillStyle = '#ff007f';
        ctx.beginPath();
        ctx.arc(0, -43 - bob, 2.5, 0, Math.PI);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Renders Melody Chocolate Bar
     * - Gold foil packaging with rich dark chocolate grooved bar
     * - Floating hover effect + sparkle aura
     */
    static drawChocolate(ctx, x, y, width, height, timer) {
        ctx.save();
        const bob = Math.sin(timer * 4) * 4;
        const cx = x + width / 2;
        const cy = y + height / 2 + bob;

        // Glowing aura
        const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 22);
        glow.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
        glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(cx, cy);

        // Rotation tilt
        ctx.rotate(Math.sin(timer * 2.5) * 0.1);

        // Chocolate Bar Base (Rich Dark Chocolate)
        ctx.fillStyle = '#4a2511';
        ctx.strokeStyle = '#2b1206';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-12, -16, 24, 32, 4);
        ctx.fill();
        ctx.stroke();

        // Chocolate segments / grooves
        ctx.fillStyle = '#5c3118';
        ctx.fillRect(-9, -13, 8, 8);
        ctx.fillRect(1, -13, 8, 8);
        ctx.fillRect(-9, -3, 8, 8);
        ctx.fillRect(1, -3, 8, 8);

        // Gold Foil Wrapper (Torn open revealing the chocolate)
        ctx.fillStyle = '#ffd700'; // Pure gold foil
        ctx.strokeStyle = '#cda100';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-13, 2);
        ctx.lineTo(-6, -1);
        ctx.lineTo(0, 3);
        ctx.lineTo(8, -1);
        ctx.lineTo(13, 2);
        ctx.lineTo(13, 17);
        ctx.lineTo(-13, 17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Foil banner text "MELODY"
        ctx.fillStyle = '#681c00';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MELODY', 0, 11);

        // Sparkle star on wrapper
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(7, -6, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Renders Blooming Red Rose (Level 4 Item)
     * - Rich crimson and rose velvet layered petals
     * - Natural green stem with thorns and emerald leaves
     * - Floating floral aura and sparkling dewdrop
     */
    static drawRose(ctx, x, y, width, height, timer) {
        ctx.save();
        const bob = Math.sin(timer * 4) * 4;
        const cx = x + width / 2;
        const cy = y + height / 2 + bob;

        // Glowing rose aura
        const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 24);
        glow.addColorStop(0, 'rgba(255, 0, 77, 0.48)');
        glow.addColorStop(0.6, 'rgba(255, 105, 180, 0.2)');
        glow.addColorStop(1, 'rgba(255, 0, 77, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(timer * 2.5) * 0.12);

        // Green stem
        ctx.strokeStyle = '#2d6a2d';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.quadraticCurveTo(-2, 12, -1, 19);
        ctx.stroke();

        // Stem Thorns
        ctx.fillStyle = '#1b4d1b';
        ctx.beginPath();
        ctx.moveTo(-1, 10);
        ctx.lineTo(-4, 9);
        ctx.lineTo(-1, 12);
        ctx.fill();

        // Emerald Leaves
        // Left Leaf
        ctx.fillStyle = '#38b000';
        ctx.strokeStyle = '#1b4d1b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(-7, 12, 6, 3, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Right Leaf
        ctx.beginPath();
        ctx.ellipse(6, 14, 5.5, 2.8, 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Calyx / Sepals under the flower
        ctx.fillStyle = '#2d6a2d';
        ctx.beginPath();
        ctx.moveTo(-6, 2);
        ctx.lineTo(0, 7);
        ctx.lineTo(6, 2);
        ctx.closePath();
        ctx.fill();

        // Layered Rose Petals
        // Outer Petals (Deep Velvet Crimson)
        ctx.fillStyle = '#990026';
        ctx.beginPath();
        ctx.arc(0, -2, 12, 0, Math.PI * 2);
        ctx.fill();

        // Mid Petals (Rich Scarlet Red)
        ctx.fillStyle = '#cc0033';
        ctx.beginPath();
        ctx.arc(-3, -3, 8.5, 0, Math.PI * 2);
        ctx.arc(3, -3, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner Spiral Petals (Bright Ruby Rose)
        ctx.fillStyle = '#e60039';
        ctx.beginPath();
        ctx.arc(0, -4, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Petal highlights and core swirl
        ctx.strokeStyle = '#ff4d79';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, -4, 4, 0.4, Math.PI * 1.6);
        ctx.stroke();

        ctx.strokeStyle = '#ff809f';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -4, 2, 0, Math.PI * 1.4);
        ctx.stroke();

        // Sparkling Dewdrop
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, -7, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Renders Distraction Heart (dropped by Ramya)
     */
    static drawDistractionHeart(ctx, x, y, size, timer) {
        ctx.save();
        const pulse = 1 + Math.sin(timer * 8) * 0.15;
        const currentSize = size * pulse;

        // Aura
        const glow = ctx.createRadialGradient(x, y + 5, 2, x, y + 5, currentSize * 1.5);
        glow.addColorStop(0, 'rgba(255, 20, 147, 0.6)');
        glow.addColorStop(1, 'rgba(255, 20, 147, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y + 5, currentSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Heart shape
        ctx.fillStyle = '#ff1493';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ParticleSystem.prototype.drawHeartShape(ctx, x, y - currentSize * 0.5, currentSize);
        ctx.stroke();

        // Spiral / lightning crackle inside heart to indicate confusion effect
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 2);
        ctx.lineTo(x + 1, y + 2);
        ctx.lineTo(x - 2, y + 6);
        ctx.lineTo(x + 3, y + 10);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Renders Confetti Blast Projectile (fired by Rahul in Level 3)
     */
    static drawConfettiBlast(ctx, x, y, radius, dir, timer) {
        ctx.save();
        ctx.translate(x, y);

        // Core blast burst
        ctx.fillStyle = 'rgba(255, 230, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Confetti cluster
        const colors = ['#ff007f', '#00e5ff', '#ffe600', '#00ff77', '#ff6b00'];
        for (let i = 0; i < 7; i++) {
            const angle = (timer * 10 + i * 1.2);
            const dist = (i % 3) * (radius * 0.35);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(Math.cos(angle) * dist - 3, Math.sin(angle) * dist - 3, 6, 6);
        }

        // Forward blast wave
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, (dir > 0 ? -0.7 : Math.PI - 0.7), (dir > 0 ? 0.7 : Math.PI + 0.7));
        ctx.stroke();

        ctx.restore();
    }
}
