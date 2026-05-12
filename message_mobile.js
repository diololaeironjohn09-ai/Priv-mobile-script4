// ==UserScript==
// @name         priv multi!
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  made by arras.io_hacer
// @match        *://arras.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const USER_DATABASE = {
        "AKTW-3321-M44": { name: "Currency", role: "Manager", license: "Lifetime" },
        "RAGE-8821-X99": { name: "ragsist", role: "Owner", license: "Lifetime" },
        "VEINY-4411-L22": { name: "root", role: "Friend", license: "Lifetime" },
        "DEV-0000-GOD": { name: "Developer", role: "Admin", license: "Lifetime" }
    };

    const LS_KEY_STORAGE = "arras_script_key_v1";
    let currentUser = null;

    function verifyKey() {
        let storedKey = localStorage.getItem(LS_KEY_STORAGE);

        if (storedKey && USER_DATABASE[storedKey]) {
            currentUser = USER_DATABASE[storedKey];
            return;
        }

        const inputKey = prompt("Authentication Required\nPlease enter your license key:");

        if (inputKey && USER_DATABASE[inputKey]) {
            localStorage.setItem(LS_KEY_STORAGE, inputKey);
            currentUser = USER_DATABASE[inputKey];
            alert(`Welcome back, ${currentUser.name}!`);
        } else {
            alert("Authentication FAILED. Invalid key.");
            localStorage.removeItem(LS_KEY_STORAGE);
            location.reload();
            throw new Error("Invalid Key - Execution Stopped");
        }
    }

    // Expose a helper to reset key from console
    window.resetArrasKey = function () {
        localStorage.removeItem(LS_KEY_STORAGE);
        alert("Key cleared! Reloading...");
        location.reload();
    };

    verifyKey();

    let isParent = false;
    let isFollower = true;
    let playerCoords = { x: 0, y: 0 };
    let menu = null;
    let menuOpen = false;
    let glider = null;

    let isMovement = true;
    let uiVisible = false;
    let followDistance = 0;
    let isAFK = false;
    let isAimReplication = false;
    let isMouseFollowMode = false;
    let isMouseAim = false;
    let isDead = false;
    let autoRespawnEnabled = true;

    let autoLPressed = false;
    let hasDetectedBodyDamage = false;

    let isSendingMessages = false;
    let gameJustStarted = false;

    // --- FORMATION & SWARM VARS ---
    const LS_SWARM_REGISTRY = "arras_swarm_registry";
    const LS_FORMATION_CONFIG = "arras_formation_config";

    let mySessionId = Math.random().toString(36).substr(2, 9);
    let swarmIndex = 0;
    let swarmSize = 1;
    let lastSwarmUpdate = 0;

    let formationConfig = {
        enabled: false,
        type: 'line_front', // line_front, line_behind, line_top, line_bottom, circle
        spacing: 60
    };

    let chatMessage1 = "--[|[♯ʙᴛ̷] ON TOP | BEST MB CLAN |]--";
    let chatMessage2 = "--[| JOIN [♯ʙᴛ̷ ] NOW! gg/AKTwwXXt |]--";

    let lastKillMessage = "";
    let killLog = [];

    let currentBotName = "Not Set";
    let autoUsernameEnabled = false;
    let usernameTheme = 'legit';
    const LS_USED_NAMES = "arras_used_names";
    const LS_AUTO_USERNAME = "arras_auto_username_enabled";
    const usernameThemes = {
        legit: [
            'TestTank2', 'camrateur', 'sup4', 'grosse pute',
            'maybe 1m', 'r u special?', 'Yamxto', 'fun', '4ever#1',
            'raw', 'Bot all? ☺', 'For Thē Worthy', 'kahba', 'palle',
            'TYPESHIT', 'DEATHMACHINE', 'k', 'Mr pato', '49th & Main',
            'For Thē Sigmas', 'Romania', 'Friends?Lol', 'REVENGE',
            'Vanity', 'v1sion', 'lyra', 'Sisterfister', 'Boempatat',
            'Andre', 'Huge', 'sunex', 'IM THE KING', 'Dattel',
            'he he', 'Gon', 'Qwerty', 'Kato', 'hide more noob',
            's1gow', 'Lipovuy', 'Synaro', 'RAMPAGE', 'Xamo',
            'Arena Closer', 'w', 'Daylight', 'bananona', 'king bob!!!!!!!',
            'as', 'Mr Kunt', 'Sela', 'комhier', 'porowolf',
            'FRENCH MONSTER', 'black swan', 'eee', 'WARSHIP', 'earthworm',
            'wat:)', 'SmiLE', 'huuh', 'balls', 'whokillmeisgay',
            'me', 'dark vadormir', 'David Buster', 'Revenge', 'Sexter Morgan',
            'Bloaty', 'GHOST', '1m', 'A Mine', 'jdghiadiu',
            '44443protmonkey', 'Lucas lol', 'God of WarΩ', 'Cathy',
            'Fuzz', 'JJD', '_mxs_', 'POLICE', 'nesty', 'aaaa',
            'Eurofighter', 'mmmmmmmmmmmmmmm', 'DefeatTheEvil', 'meme',
            'Muzan', 'JustBuyAHouse', 'Logan_Fr_', 'just a new ❂',
            'all eyes on me', 'EMMANUEL', 'mrk', 'Tigran', 'HHEALLER',
            'Behind U ( 0_0)', 'No Mercy', 'Drukez', 'abbas',
            'R3DBULLMAN1AC', '^oo^', 'The Smiths', 'rick', 'Ron',
            'Apk', 'dwpe', 'raid35428', 'iRlyH8ThisGame!', 'Kojot34',
            'milers', 'HANNABAL', 'Happy.', 'södra', 'slur',
            'supercazzola', 'VotreMaman', 'gerard', 'Jazda z kurwami',
            'Morthais', 'SejeM☠🔥', 'Genocider', 'iAmIsTom', 'StopFarmingIf45',
            'kurton', 'ARENA CLOSER 1', 'Booster', 'accident', 'kongkongkong',
            'equinox', 'melisa', 'hola', 'ipf', 'caspar',
            'ItsYeMonkey', 'monttu', 'bigdihrandy', 'torta pounder',
            'ivoker', 'savage', 'Noe', 'TicTac 42', 'dawsdwa',
            'ModRiax', 'trucker091', 'bilmem', 'KiOKiO', 'Regy :)'
        ]
    };

    function generateRandomName() {
        const length = Math.floor(Math.random() * 6) + 6; // 6-11 chars
        let name = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < length; i++) {
            let char = chars[Math.floor(Math.random() * chars.length)];
            // 10% chance to uppercase
            if (Math.random() < 0.1) {
                char = char.toUpperCase();
            }
            name += char;
        }

        return name;
    }

    function getRandomUsername() {
        const tag = '[♯ʙᴛ̷]';
        let name;

        // Get list of used names from localStorage
        let usedNames = [];
        try {
            const stored = localStorage.getItem(LS_USED_NAMES);
            if (stored) usedNames = JSON.parse(stored);
        } catch (e) { }

        if (usernameTheme === 'random') {
            // Random names are always unique
            name = generateRandomName();
        } else {
            const names = usernameThemes[usernameTheme] || usernameThemes.legit;

            // Filter out used names
            const availableNames = names.filter(n => !usedNames.includes(n));

            // If all names used, reset the list
            if (availableNames.length === 0) {
                usedNames = [];
                localStorage.setItem(LS_USED_NAMES, JSON.stringify([]));
                name = names[Math.floor(Math.random() * names.length)];
            } else {
                name = availableNames[Math.floor(Math.random() * availableNames.length)];
            }

            // Mark this name as used
            usedNames.push(name);
            localStorage.setItem(LS_USED_NAMES, JSON.stringify(usedNames));
        }

        return `${tag} ${name}`;
    }

    function setRandomUsername() {
        // Find all text inputs but exclude our GUI's chat inputs
        const inputs = document.querySelectorAll('input[type="text"]');
        let gameInput = null;

        for (let input of inputs) {
            // Skip if it's one of our GUI inputs
            if (input.classList.contains('chat-input')) continue;
            if (input.id === 'chat-msg-1' || input.id === 'chat-msg-2') continue;

            // This should be the game's name input
            gameInput = input;
            break;
        }

        if (gameInput) {
            const name = getRandomUsername();
            gameInput.value = name;
            gameInput.dispatchEvent(new Event('input', { bubbles: true }));
            gameInput.dispatchEvent(new Event('change', { bubbles: true }));
            currentBotName = name;
            console.log('Auto-set username:', name);

            // Update GUI if it exists
            const botNameEl = document.getElementById('stat-botname');
            if (botNameEl) botNameEl.textContent = name;
        } else {
            // Try again if input not loaded yet
            setTimeout(setRandomUsername, 100);
        }
    }

    let fpsLimit = 30;
    let leaderFpsLimit = 144;
    let followerFpsEnabled = true;
    let originalRAF = null;
    let originalCAF = null;
    let limiterActive = false;

    let autoLPressEnabled = true;
    let ingame = false;

    const LS_PARENT_COORDS = "arras_multibox_parent";
    const LS_PARENT_AIM = "arras_multibox_aim_parent";
    const LS_CHAT_TRIGGER = "arras_multibox_chat_trigger";
    const LS_KILL_MESSAGE = "arras_kill_message";
    const LS_FOLLOW_DISTANCE = "arras_follow_distance";
    const LS_AUTO_RESPAWN = "arras_auto_respawn_enabled";
    const LS_MOUSE_FOLLOW = "arras_mouse_follow_enabled";
    const LS_FOLLOWER_FPS = "arras_follower_fps_limit";
    const LS_FOLLOWER_FPS_ENABLED = "arras_follower_fps_enabled";
    const LS_AUTO_L_PRESS = "arras_auto_l_press_enabled";
    const LS_PRECISE_AIM = "arras_precise_aim_enabled";
    const LS_MOUSE_AIM = "arras_mouse_aim_enabled";
    const LS_FORCE_RESPAWN = "arras_force_respawn_trigger";

    // --- Key Replication Vars ---
    const LS_KEY_REPLICATION = "arras_keyreplication_leader";
    const LS_KEY_REPLICATION_ENABLED = "arras_key_replication_enabled";
    let keyReplicationEnabled = true;
    let isInChatMode = false;
    let lastKeyReplicationTime = 0;

    const replicatableKeys = [
        'KeyQ', 'KeyE', 'KeyR', 'KeyF', 'KeyC', 'KeyX', 'KeyZ',
        'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight',
        'Space', 'Enter', 'Escape', 'Tab',
        'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
        'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0',
        'KeyY', 'KeyU', 'KeyI', 'KeyH', 'KeyJ', 'KeyK',
        'KeyO', 'KeyL', 'Semicolon', 'KeyM',
        'Minus', 'Slash', 'NumpadMultiply', 'NumpadDivide', 'NumpadSubtract'
    ];
    let currentKeyStates = {};
    let lastSentKeyStates = {};
    let lastReceivedKeyStates = {};
    let lastReplicatedClickState = 0; // State tracking for mouse clicks

    replicatableKeys.forEach(key => {
        currentKeyStates[key] = false;
        lastSentKeyStates[key] = false;
        lastReceivedKeyStates[key] = false;
    });

    try {
        const savedKeyRep = localStorage.getItem(LS_KEY_REPLICATION_ENABLED);
        if (savedKeyRep !== null) keyReplicationEnabled = JSON.parse(savedKeyRep);
    } catch (e) { }
    // ----------------------------

    // aim
    let isPreciseAim = true;
    const myAimOffset = (Math.random() - 0.5) * 0.5;

    let selectedRespawnBuild = 'none';
    const tankBuilds = {
        'gale': {
            upgrades: ['KeyH', 'KeyY', 'KeyK', 'KeyI'],
            // Build: 0/4/2/9/9/9/9/0/0/0 (Map: Index+1 => Key Length)
            stats: [
                'Digit2', 'Digit2', 'Digit2', 'Digit2', // 4x Key 2
                'Digit3', 'Digit3', // 2x Key 3
                'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', // 9x Key 4
                'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', // 9x Key 5
                'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', // 9x Key 6
                'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7'  // 9x Key 7
            ]
        },
        'limpet': {
            upgrades: ['KeyX', 'Space'],
            stats: [
                'Digit2', 'Digit2', 'Digit2', 'Digit2',
                'Digit3', 'Digit3',
                'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4', 'Digit4',
                'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5', 'Digit5',
                'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6', 'Digit6',
                'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7', 'Digit7'
            ]
        }
    };

    try {
        const savedPrecise = localStorage.getItem(LS_PRECISE_AIM);
        if (savedPrecise !== null) isPreciseAim = JSON.parse(savedPrecise);
    } catch (e) { }

    // WebSocket interception for auto-L press
    class CustomWebSocket extends window.WebSocket {
        constructor(...args) {
            super(...args);
            this.addEventListener("message", (e) => {
                if (ingame || !autoLPressEnabled) return;

                // Press L when game starts
                const keyDownEvent = new KeyboardEvent('keydown', {
                    key: 'l',
                    code: 'KeyL',
                    bubbles: true,
                    cancelable: true
                });
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'l',
                    code: 'KeyL',
                    bubbles: true,
                    cancelable: true
                });

                document.dispatchEvent(keyDownEvent);
                setTimeout(() => document.dispatchEvent(keyUpEvent), 50);

                ingame = true;
            }, { once: true });
        }
    }

    window.WebSocket = CustomWebSocket;

    const RESPAWN_TEXT = "respawn";
    const COORDS_PREFIX = "Coordinates: (";
    const BODY_DAMAGE_TEXT = "body damage";
    const KILL_PREFIX = "You killed ";
    const ASSIST_PREFIX = "You assisted ";

    let _0x1ab898 = {
        KeyW: false, KeyA: false, KeyS: false, KeyD: false,
        _0xc9adf1: 0.5, _0xd89152: 0.5,
        mouseLeft: false, mouseMiddle: false, mouseRight: false
    };

    let extendedKeyStates = {
        _0xc9adf1: 0, _0xd89152: 0, _0xexactX: 0, _0xexactY: 0,
        _0xscreenWidth: 0, _0xscreenHeight: 0, _0xclickState: 0
    };

    let activeKeys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false };
    let lastParentData = null;
    let lastAimData = null;

    let lastNx = 0;
    let lastNy = 0;

    let cachedCanvas = null;
    let cachedChatInput = null;

    function getCanvas() {
        if (!cachedCanvas) {
            cachedCanvas = document.querySelector("#canvas canvas") || document.querySelector("#canvas");
        }
        return cachedCanvas;
    }

    function getChatInput() {
        if (!cachedChatInput || !document.contains(cachedChatInput)) {
            const inputs = document.querySelectorAll('input');
            for (let input of inputs) {
                if (input.type === 'text' && !input.classList.contains('chat-input')) {
                    cachedChatInput = input;
                    break;
                }
            }
        }
        return cachedChatInput;
    }

    const _0x492856 = window.addEventListener;
    const _0x46fbb1 = HTMLDivElement.prototype.addEventListener;

    let globalGameScale = 1;
    let globalFov = 46;

    const originalSetTransform = CanvasRenderingContext2D.prototype.setTransform;
    CanvasRenderingContext2D.prototype.setTransform = function (a, b, c, d, e, f) {
        // Attempt to capture game world scale (exclude UI 1:1 scale)
        // Typical game scale is > 10px per unit for normal view, and decreases as you zoom out (get bigger)
        // But usually it's significantly different from 1.0 (unless screen is tiny)
        if (Math.abs(a) > 1.5) /* Arbitrary threshold to ignore UI resetting */ {
            globalGameScale = Math.abs(a);
            const cvs = getCanvas();
            if (cvs) {
                // Calculate FOV: Width in Game Units
                const calculatedFov = cvs.width / globalGameScale;
                // Sanity check: Arras FOV usually 30-200 depending on mode/size
                if (calculatedFov > 10 && calculatedFov < 250) {
                    globalFov = calculatedFov;
                }
            }
        }
        return originalSetTransform.apply(this, arguments);
    };

    HTMLDivElement.prototype.addEventListener = function (..._) {
        const $ = _[0];
        if ($ === "mousedown" || $ === "mouseup" || $ === "mousemove") {
            const e = _[1];
            _[1] = function (..._) {
                const i = {
                    isTrusted: true,
                    clientX: _[0].clientX,
                    clientY: _[0].clientY,
                    button: _[0].button,
                    preventDefault: () => { },
                };

                if ($ === "mousedown") {
                    _0x1ab898["mouse" + [["Left", "Middle", "Right"][i.button]]] = true;
                    extendedKeyStates._0xclickState = 1;
                } else if ($ === "mouseup") {
                    _0x1ab898["mouse" + [["Left", "Middle", "Right"][i.button]]] = false;
                    extendedKeyStates._0xclickState = 0;
                }

                _0x1ab898._0xc9adf1 = i.clientX / window.innerWidth;
                _0x1ab898._0xd89152 = i.clientY / window.innerHeight;
                extendedKeyStates._0xc9adf1 = i.clientX / window.innerWidth;
                extendedKeyStates._0xd89152 = i.clientY / window.innerHeight;
                extendedKeyStates._0xexactX = i.clientX;
                extendedKeyStates._0xexactY = i.clientY;
                extendedKeyStates._0xscreenWidth = window.innerWidth;
                extendedKeyStates._0xscreenHeight = window.innerHeight;

                return e.apply(this, [i]);
            };
        }
        return _0x46fbb1.apply(this, _);
    };

    window.addEventListener = function (..._) {
        const $ = _[0];
        if ($ === "keydown" || $ === "keyup") {
            const t = _[1];
            _[1] = function (..._) {
                const i = {
                    isTrusted: true,
                    key: _[0].key,
                    code: _[0].code,
                    shiftKey: _[0].shiftKey,
                    preventDefault: () => { },
                };

                const key = i.code;

                if (document.activeElement.tagName === "INPUT") {
                    if (key === 'Enter') {
                        isInChatMode = !i.shiftKey;
                    }
                    if (key !== "Enter") return; // Allow typing in chat without moving
                }

                if (i.code === "KeyW") _0x1ab898.KeyW = ($ === "keydown");
                if (i.code === "KeyA") _0x1ab898.KeyA = ($ === "keydown");
                if (i.code === "KeyS") _0x1ab898.KeyS = ($ === "keydown");
                if (i.code === "KeyD") _0x1ab898.KeyD = ($ === "keydown");

                // --- Key Replication Logic ---
                if (keyReplicationEnabled && replicatableKeys.includes(key)) {
                    const isPressed = ($ === "keydown");
                    if (currentKeyStates[key] !== isPressed) {
                        currentKeyStates[key] = isPressed;

                        if (isParent) {
                            localStorage.setItem(LS_KEY_REPLICATION, JSON.stringify({
                                keyStates: currentKeyStates,
                                timestamp: Date.now(),
                                chatMode: isInChatMode
                            }));
                        }
                    }
                }
                // -----------------------------

                return t.apply(this, [i]);
            };
        }
        return _0x492856.apply(this, _);
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            toggleMenu();
            return false;
        }
        if (e.code === 'KeyM' && document.activeElement.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
            const el = document.getElementById('chk-aim');
            if (el) el.click();
            return false;
        }
        if (e.code === 'KeyF' && document.activeElement.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
            const el = document.getElementById('chk-movement');
            if (el) el.click();
            return false;
        }
        if (e.code === 'KeyP' && document.activeElement.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
            localStorage.setItem(LS_CHAT_TRIGGER, Date.now().toString());
            sendChatMessages();
            return false;
        }
        if (e.code === 'KeyN' && document.activeElement.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
            const el = document.getElementById('chk-mouse');
            if (el) el.click();
            return false;
        }
        if (e.code === 'F8' && document.activeElement.tagName !== "INPUT") {
            e.stopPropagation();
            e.preventDefault();
            const el = document.getElementById('chk-fpslimit');
            if (el) el.click();
            return false;
        }
    }, true);

    function simulateKeyEvent(code, pressed) {
        if (activeKeys[code] === pressed) return;

        if (code === 'KeyW') _0x1ab898.KeyW = pressed;
        if (code === 'KeyA') _0x1ab898.KeyA = pressed;
        if (code === 'KeyS') _0x1ab898.KeyS = pressed;
        if (code === 'KeyD') _0x1ab898.KeyD = pressed;

        let keyVal = code.replace('Key', '').toLowerCase();
        if (code === 'Space') keyVal = ' ';
        if (code === 'Enter') keyVal = 'Enter';

        const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
            key: keyVal,
            code: code,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
        activeKeys[code] = pressed;
    }

    function tapKey(code, delay = 0) {
        setTimeout(() => {
            simulateKeyEvent(code, true);
            setTimeout(() => simulateKeyEvent(code, false), 50);
        }, delay);
    }

    function executeBuild(buildName) {
        if (isParent) return;

        const buildData = tankBuilds[buildName];
        if (!buildData) return;

        const sequence = [...buildData.upgrades, ...buildData.stats];

        // fast exec
        let delay = 300;
        sequence.forEach(key => {
            tapKey(key, delay);
            delay += 100;
        });

        showNotification(`Build: ${buildName}`, 'success');
    }

    // --- New Replication Helpers ---
    function getKeyCode(key) {
        const keyCodes = {
            'KeyQ': 81, 'KeyE': 69, 'KeyR': 82, 'KeyF': 70,
            'KeyC': 67, 'KeyX': 88, 'KeyZ': 90,
            'ShiftLeft': 16, 'ShiftRight': 16,
            'ControlLeft': 17, 'ControlRight': 17,
            'AltLeft': 18, 'AltRight': 18,
            'Space': 32, 'Enter': 13, 'Escape': 27, 'Tab': 9,
            'Digit1': 49, 'Digit2': 50, 'Digit3': 51, 'Digit4': 52,
            'Digit5': 53, 'Digit6': 54, 'Digit7': 55, 'Digit8': 56,
            'Digit9': 57, 'Digit0': 48,
            'KeyY': 89, 'KeyU': 85, 'KeyI': 73, 'KeyH': 72, 'KeyJ': 74,
            'KeyK': 75, 'KeyO': 79, 'KeyL': 76, 'Semicolon': 186, 'KeyM': 77,
            'Minus': 189, 'Slash': 191, 'NumpadMultiply': 106,
            'NumpadDivide': 111, 'NumpadSubtract': 109
        };
        return keyCodes[key] || 0;
    }

    function getKeyName(key) {
        const keyNames = {
            'KeyQ': 'q', 'KeyE': 'e', 'KeyR': 'r', 'KeyF': 'f',
            'KeyC': 'c', 'KeyX': 'x', 'KeyZ': 'z',
            'ShiftLeft': 'Shift', 'ShiftRight': 'Shift',
            'ControlLeft': 'Control', 'ControlRight': 'Control',
            'AltLeft': 'Alt', 'AltRight': 'Alt',
            'Space': ' ', 'Enter': 'Enter', 'Escape': 'Escape', 'Tab': 'Tab',
            'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
            'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8',
            'Digit9': '9', 'Digit0': '0',
            'KeyY': 'y', 'KeyU': 'u', 'KeyI': 'i', 'KeyH': 'h', 'KeyJ': 'j',
            'KeyK': 'k', 'KeyO': 'o', 'KeyL': 'l', 'Semicolon': ';', 'KeyM': 'm',
            'Minus': '-', 'Slash': '/', 'NumpadMultiply': '*',
            'NumpadDivide': '/', 'NumpadSubtract': '-'
        };
        return keyNames[key] || '';
    }

    function focusChatInput() {
        const inputs = document.querySelectorAll('input');
        for (let input of inputs) {
            if (input.type === 'text' || input.placeholder?.toLowerCase().includes('chat')) {
                input.focus();
                input.select();
                return true;
            }
        }
        return false;
    }

    function blurChatInput() {
        if (document.activeElement && document.activeElement.tagName === 'INPUT')
            document.activeElement.blur();
    }

    function simulateGeneralKeyEvent(key, pressed) {
        if (pressed && lastReceivedKeyStates[key] === true) return;

        const eventType = pressed ? 'keydown' : 'keyup';
        const event = new KeyboardEvent(eventType, {
            key: getKeyName(key),
            code: key,
            keyCode: getKeyCode(key),
            which: getKeyCode(key),
            bubbles: true,
            cancelable: true,
            composed: true
        });
        document.dispatchEvent(event);
        lastReceivedKeyStates[key] = pressed;
    }

    function replicateKeys() {
        if (!isFollower || !keyReplicationEnabled) return;

        try {
            const leaderData = localStorage.getItem(LS_KEY_REPLICATION);
            if (!leaderData) return;

            const data = JSON.parse(leaderData);
            const leaderKeyStates = data.keyStates;
            const leaderChatMode = data.chatMode || false;

            if (leaderKeyStates['Enter'] && !lastReceivedKeyStates['Enter']) {
                if (leaderChatMode) setTimeout(() => focusChatInput(), 10);
                else setTimeout(() => blurChatInput(), 10);
            }

            replicatableKeys.forEach(key => {
                if (key === 'Enter') return;
                const target = leaderKeyStates[key] === true;
                if (lastReceivedKeyStates[key] !== target)
                    simulateGeneralKeyEvent(key, target);
            });
        } catch (e) { }
    }
    // -----------------------------

    function stopAllKeys() {
        simulateKeyEvent("KeyW", false);
        simulateKeyEvent("KeyA", false);
        simulateKeyEvent("KeyS", false);
        simulateKeyEvent("KeyD", false);
    }

    function pressEnter(delay = 0) {
        setTimeout(() => {
            const ev1 = new KeyboardEvent("keydown", {
                key: "Enter", code: "Enter", keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            });
            const ev2 = new KeyboardEvent("keyup", {
                key: "Enter", code: "Enter", keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            });
            document.dispatchEvent(ev1);
            setTimeout(() => document.dispatchEvent(ev2), 10);
        }, delay);
    }

    function typeMessage(message, delay = 0) {
        setTimeout(() => {
            const chatInput = getChatInput();

            if (chatInput) {
                chatInput.focus();
                chatInput.click();
                setTimeout(() => {
                    chatInput.value = message;
                    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                    chatInput.dispatchEvent(new Event('change', { bubbles: true }));
                }, 50);
            }
        }, delay);
    }

    function sendChatMessages() {
        if (isSendingMessages) return;
        isSendingMessages = true;
        stopAllKeys();
        pressEnter(1000);
        typeMessage(chatMessage1, 1500);
        pressEnter(1800);
        pressEnter(2000);
        typeMessage(chatMessage2, 2100);
        pressEnter(2600);
        setTimeout(() => { isSendingMessages = false; }, 3000);
    }

    const mouseEventCache = {
        lastX: -1,
        lastY: -1,
        lastButton: -1,
        lastType: ''
    };

    function simulateMouseEvent(x, y, button, eventType) {
        const canvas = getCanvas();
        if (!canvas) return;

        if (mouseEventCache.lastX === x &&
            mouseEventCache.lastY === y &&
            mouseEventCache.lastButton === button &&
            mouseEventCache.lastType === eventType) {
            return;
        }

        canvas.dispatchEvent(new MouseEvent(eventType, {
            clientX: x, clientY: y, button: button,
            bubbles: true, cancelable: true, view: window
        }));

        mouseEventCache.lastX = x;
        mouseEventCache.lastY = y;
        mouseEventCache.lastButton = button;
        mouseEventCache.lastType = eventType;
    }

    function replicateAim() {
        if (!isAimReplication || !lastAimData) return;

        // static check - prevent spin
        const pModX = (lastAimData._0xc9adf1 - 0.5);
        const pModY = (lastAimData._0xd89152 - 0.5);
        if (Math.hypot(pModX, pModY) < 0.01) return;

        const parentWidth = lastAimData._0xscreenWidth || window.innerWidth;
        const parentHeight = lastAimData._0xscreenHeight || window.innerHeight;
        const parentCenterX = parentWidth / 2;
        const parentCenterY = parentHeight / 2;

        const parentMouseX = lastAimData._0xexactX || (lastAimData._0xc9adf1 * parentWidth);
        const parentMouseY = lastAimData._0xexactY || (lastAimData._0xd89152 * parentHeight);

        let offsetX = parentMouseX - parentCenterX;
        let offsetY = parentMouseY - parentCenterY;

        // random offset for followers
        if (!isPreciseAim && isFollower) {
            const staticOffset = myAimOffset;

            const cos = Math.cos(staticOffset);
            const sin = Math.sin(staticOffset);
            const rx = offsetX * cos - offsetY * sin;
            const ry = offsetX * sin + offsetY * cos;
            offsetX = rx;
            offsetY = ry;
        }

        const thisCenterX = window.innerWidth / 2;
        const thisCenterY = window.innerHeight / 2;
        let targetX = Math.max(0, Math.min(window.innerWidth, thisCenterX + offsetX));
        let targetY = Math.max(0, Math.min(window.innerHeight, thisCenterY + offsetY));

        simulateMouseEvent(targetX, targetY, 0, "mousemove"); // Always move

        // Check for click state changes (Prevents stuck clicks / spam)
        const desiredState = lastAimData._0xclickState;

        if (desiredState !== lastReplicatedClickState) {
            // Release old
            if (lastReplicatedClickState === 1) simulateMouseEvent(targetX, targetY, 0, "mouseup");
            if (lastReplicatedClickState === 2) simulateMouseEvent(targetX, targetY, 2, "mouseup");

            // Press new
            if (desiredState === 1) simulateMouseEvent(targetX, targetY, 0, "mousedown");
            if (desiredState === 2) simulateMouseEvent(targetX, targetY, 2, "mousedown");

            lastReplicatedClickState = desiredState;
        }
    }

    function calculateTargetPosition() {
        if (!lastParentData || !Number.isFinite(lastParentData.x)) return null;

        let baseTarget = { x: lastParentData.x, y: lastParentData.y };

        // Handle Mouse Follow (overrides standard formation base)
        if (isMouseFollowMode && lastAimData) {
            const leaderX = lastParentData.x;
            const leaderY = lastParentData.y;
            const parentMouseX = lastAimData._0xc9adf1;
            const parentMouseY = lastAimData._0xd89152;

            if (Number.isFinite(parentMouseX) && Number.isFinite(parentMouseY)) {
                const canvas = getCanvas();
                const cvsW = canvas ? canvas.clientWidth : window.innerWidth;
                const cvsH = canvas ? canvas.clientHeight : window.innerHeight;
                const lW = lastAimData._0xscreenWidth || cvsW;
                const lH = lastAimData._0xscreenHeight || cvsH;
                const lFov = lastAimData.fov || 46;
                const hFov = lFov;
                const vFov = hFov * (lH / lW);

                baseTarget.x = leaderX + (parentMouseX - 0.5) * hFov;
                baseTarget.y = leaderY + (parentMouseY - 0.5) * vFov;
            }
        }

        // --- FORMATION OFFSETS ---
        // Only apply if enabled, we are a follower, and we have a valid index > 0 (Leader is 0)
        // Actually, if we are using the registry, Leader is index 0. Followers are 1..N.
        if (formationConfig.enabled && isFollower && swarmSize > 1) {
            let index = swarmIndex;
            // If for some reason index is 0 but we are follower (latency), force 1 temporarily or wait.
            if (index === 0) index = 1;

            const spacing = formationConfig.spacing || 60;

            // Calculate Leader Aim Direction (Normalized)
            let aimUx = 1, aimUy = 0;
            if (lastAimData) {
                const ax = (lastAimData._0xc9adf1 - 0.5);
                const ay = (lastAimData._0xd89152 - 0.5);
                const len = Math.hypot(ax, ay);
                if (len > 0.001) {
                    aimUx = ax / len;
                    aimUy = ay / len;
                }
            }

            let offsetX = 0;
            let offsetY = 0;

            switch (formationConfig.type) {
                case 'line_front':
                    // In front of leader
                    offsetX = aimUx * (spacing * index);
                    offsetY = aimUy * (spacing * index);
                    break;
                case 'line_behind':
                    // Behind leader
                    offsetX = -aimUx * (spacing * index);
                    offsetY = -aimUy * (spacing * index);
                    break;
                case 'line_top':
                    // "Top" relative to screen usually implies Up (-Y).
                    // But requested as formation. Let's interpret as "Left Flank" relative to aim?
                    // Or just Global Top?
                    // User example: "Line (front/top/bottom/behind)".
                    // Using Perpendicular Left for Top (visual top if moving right)
                    // Perpendicular Left of (x, y) is (y, -x) ? No (y, -x) is Right. (-y, x) is Left.
                    offsetX = aimUy * (spacing * index);
                    offsetY = -aimUx * (spacing * index);
                    break;
                case 'line_bottom':
                    // Perpendicular Right
                    offsetX = -aimUy * (spacing * index);
                    offsetY = aimUx * (spacing * index);
                    break;
                case 'circle':
                    // Circle around leader
                    // Angle = (2PI / (Size)) * Index.
                    // Actually maybe (2PI / (Size-1)) if center is leader?
                    // Let's distribute evenly.
                    const angle = (Math.PI * 2 / (swarmSize)) * index;
                    offsetX = Math.cos(angle) * spacing;
                    offsetY = Math.sin(angle) * spacing;
                    break;
            }

            return { x: baseTarget.x + offsetX, y: baseTarget.y + offsetY };
        }

        return baseTarget;
    }

    function updateSwarmRegistry() {
        try {
            const now = Date.now();
            let registry = {};
            const raw = localStorage.getItem(LS_SWARM_REGISTRY);
            if (raw) {
                try { registry = JSON.parse(raw); } catch (e) { }
            }

            // prune stats older than 3s
            for (let id in registry) {
                if (now - registry[id].ts > 3000) delete registry[id];
            }

            // add/update self
            registry[mySessionId] = {
                ts: now,
                role: isParent ? 'leader' : 'follower'
            };

            // save
            localStorage.setItem(LS_SWARM_REGISTRY, JSON.stringify(registry));

            // calc index
            // sort by ID (stable) or by role then ID?
            // Leader should be 0.
            const sortedIds = Object.keys(registry).sort((a, b) => {
                const roleA = registry[a].role;
                const roleB = registry[b].role;
                if (roleA === 'leader') return -1;
                if (roleB === 'leader') return 1;
                return a.localeCompare(b);
            });

            swarmSize = sortedIds.length;
            swarmIndex = sortedIds.indexOf(mySessionId);

            // If failed to find self (weird), default to 0
            if (swarmIndex === -1) swarmIndex = 0;

        } catch (e) {
            console.error("Registry error", e);
        }
    }

    function handleMouseFollowAim() {
        if ((!isMouseFollowMode && !isMouseAim) || !lastAimData || !lastParentData) return;

        const leaderX = lastParentData.x;
        const leaderY = lastParentData.y;

        const leaderW = lastAimData._0xscreenWidth || window.innerWidth;
        const leaderH = lastAimData._0xscreenHeight || window.innerHeight;
        const leaderFov = lastAimData.fov || 46;

        const horizontal_fov = leaderFov;
        const leader_vertical_fov = horizontal_fov * (leaderH / leaderW);

        const aimDx = leaderX - playerCoords.x + (lastAimData._0xc9adf1 - 0.5) * horizontal_fov;
        const aimDy = leaderY - playerCoords.y + (lastAimData._0xd89152 - 0.5) * leader_vertical_fov;

        const canvas = getCanvas();
        const canvasWidth = canvas ? canvas.clientWidth : window.innerWidth;
        const canvasHeight = canvas ? canvas.clientHeight : window.innerHeight;

        const follower_horizontal_fov = globalFov; // Use our own dynamic FOV
        const follower_vertical_fov = follower_horizontal_fov * (canvasHeight / canvasWidth);

        const targetMouseX = 0.5 + (aimDx / follower_horizontal_fov);
        const targetMouseY = 0.5 + (aimDy / follower_vertical_fov);

        const screenX = targetMouseX * window.innerWidth;
        const screenY = targetMouseY * window.innerHeight;

        const clampedX = Math.max(0, Math.min(window.innerWidth, screenX));
        const clampedY = Math.max(0, Math.min(window.innerHeight, screenY));

        simulateMouseEvent(clampedX, clampedY, 0, "mousemove");

        if (lastAimData._0xclickState === 1) {
            simulateMouseEvent(clampedX, clampedY, 0, "mousedown");
        } else if (lastAimData._0xclickState === 2) {
            simulateMouseEvent(clampedX, clampedY, 2, "mousedown");
        } else {
            simulateMouseEvent(clampedX, clampedY, 0, "mouseup");
            simulateMouseEvent(clampedX, clampedY, 2, "mouseup");
        }
    }

    function moveToTarget() {
        if (!isFollower || !isMovement || isAFK || isSendingMessages) {
            stopAllKeys();
            return;
        }

        if (!Number.isFinite(playerCoords.x) || !Number.isFinite(playerCoords.y)) return;

        const target = calculateTargetPosition();
        if (!target) return;

        let dx = target.x - playerCoords.x;
        let dy = target.y - playerCoords.y;
        const distance = Math.hypot(dx, dy);

        const stopThreshold = isMouseFollowMode ? 0.3 : 0.1;
        if (distance < stopThreshold) {
            stopAllKeys();
            return;
        }

        const safeDist = Math.max(distance, 0.001);
        let nx = dx / safeDist;
        let ny = dy / safeDist;

        const turn = nx * lastNy - ny * lastNx;
        if (Math.abs(turn) > 0.6) {
            nx = nx * 0.9 + lastNx * 0.1;
            ny = ny * 0.9 + lastNy * 0.1;
        }

        lastNx = nx;
        lastNy = ny;

        stopAllKeys();

        const ax = Math.abs(nx);
        const ay = Math.abs(ny);
        const bias = 0.25;

        if (ax >= ay * bias) {
            simulateKeyEvent(nx > 0 ? "KeyD" : "KeyA", true);
        }
        if (ay >= ax * bias) {
            simulateKeyEvent(ny > 0 ? "KeyS" : "KeyW", true);
        }
    }

    const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
    const origFillText = CanvasRenderingContext2D.prototype.fillText;

    function processText(text) {
        if (!text || typeof text !== "string" || text.length < 3) return;

        const lower = text.toLowerCase().trim();

        if (text.startsWith(COORDS_PREFIX)) {
            try {
                const coordText = text.match(/Coordinates: \(([^)]+)\)/)[1];
                const parts = coordText.split(", ");
                playerCoords.x = parseFloat(parts[0]);
                playerCoords.y = parseFloat(parts[1]);

                if (isParent) {
                    localStorage.setItem(LS_PARENT_COORDS, `${playerCoords.x},${playerCoords.y},${Date.now()}`);
                }
            } catch (e) { }
            return;
        }

        if (lower === RESPAWN_TEXT && !isDead) {
            isDead = true;
            gameJustStarted = false;
            hasDetectedBodyDamage = false;

            if (autoRespawnEnabled) {
                pressEnter(0);
            }

            setTimeout(() => { isDead = false; }, 8000);
            return;
        }

        if (text.startsWith(KILL_PREFIX)) {
            const killMsg = text.trim();
            if (killMsg !== lastKillMessage) {
                lastKillMessage = killMsg;
                const username = killMsg.replace(KILL_PREFIX, '');
                const killEntry = {
                    botName: currentBotName,
                    username: username,
                    time: new Date().toLocaleTimeString(),
                    timestamp: Date.now(),
                    type: 'kill'
                };
                killLog.push(killEntry);
                localStorage.setItem(LS_KILL_MESSAGE, JSON.stringify(killEntry));
            }
            return;
        }

        if (text.startsWith(ASSIST_PREFIX)) {
            const assistMsg = text.trim();
            if (assistMsg !== lastKillMessage) {
                lastKillMessage = assistMsg;
                const username = assistMsg.replace(ASSIST_PREFIX, '');
                const assistEntry = {
                    botName: currentBotName,
                    username: username,
                    time: new Date().toLocaleTimeString(),
                    timestamp: Date.now(),
                    type: 'assist'
                };
                killLog.push(assistEntry);
                localStorage.setItem(LS_KILL_MESSAGE, JSON.stringify(assistEntry));
            }
            return;
        }

    }

    CanvasRenderingContext2D.prototype.strokeText = function (...args) {
        processText(args[0]);
        return origStrokeText.apply(this, args);
    };

    CanvasRenderingContext2D.prototype.fillText = function (...args) {
        processText(args[0]);
        return origFillText.apply(this, args);
    };

    let pendingAimUpdate = null;

    function updateParentAimData() {
        if (!isParent || (!isAimReplication && !isMouseFollowMode)) return;

        const mouseData = {
            _0xc9adf1: _0x1ab898._0xc9adf1,
            _0xd89152: _0x1ab898._0xd89152,
            _0xexactX: extendedKeyStates._0xexactX,
            _0xexactY: extendedKeyStates._0xexactY,
            _0xscreenWidth: window.innerWidth,
            _0xscreenHeight: window.innerHeight,
            _0xclickState: _0x1ab898.mouseLeft ? 1 : (_0x1ab898.mouseRight ? 2 : 0), // Include right click support
            fov: globalFov, // Transmit dynamic FOV
            timestamp: Date.now()
        };

        if (pendingAimUpdate) return;
        pendingAimUpdate = setTimeout(() => {
            localStorage.setItem(LS_PARENT_AIM, JSON.stringify(mouseData));
            pendingAimUpdate = null;
        }, 16);
    }

    function enableFpsLimiter(targetFps) {
        if (limiterActive) disableFpsLimiter();

        originalRAF = window.requestAnimationFrame;
        originalCAF = window.cancelAnimationFrame;

        let lastExec = performance.now();
        const interval = 1000 / targetFps;

        window.requestAnimationFrame = function (cb) {
            return originalRAF(function rafWrapper(ts) {
                const elapsed = ts - lastExec;

                if (elapsed >= interval) {
                    lastExec = ts - (elapsed % interval);
                    cb(ts);
                } else {
                    originalRAF(rafWrapper);
                }
            });
        };

        window.cancelAnimationFrame = function (id) {
            return originalCAF(id);
        };

        limiterActive = true;
    }

    function disableFpsLimiter() {
        if (!limiterActive) return;

        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;

        limiterActive = false;
    }

    function updateFpsLimiter() {
        if (!followerFpsEnabled) {
            if (limiterActive) disableFpsLimiter();
            return;
        }

        const targetFps = isFollower ? fpsLimit : leaderFpsLimit;

        if (isFollower && !limiterActive) {
            enableFpsLimiter(targetFps);
        } else if (isParent && limiterActive) {
            disableFpsLimiter();
        }
    }

    function toggleFpsLimiter() {
        followerFpsEnabled = !followerFpsEnabled;
        localStorage.setItem(LS_FOLLOWER_FPS_ENABLED, JSON.stringify(followerFpsEnabled));
        updateFpsLimiter();
        const el = document.getElementById('chk-fpslimit');
        if (el) el.classList.toggle('active', followerFpsEnabled);
        showNotification(`FPS Limiter ${followerFpsEnabled ? 'Enabled' : 'Disabled'}`, 'success');
    }

    let lastUpdate50 = 0;
    let lastUpdate1000 = 0;

    // --- LOGIC HEARTBEAT (Independent of FPS) ---
    // Runs at ~30 ticks per second (33ms) to keep movement/aim smooth
    // even if the game is rendering at 1 FPS.
    setInterval(() => {
        pollLocalStorageFallback();

        const now = performance.now();
        const dateNow = Date.now();

        // registry update (1s check)
        if (dateNow - lastSwarmUpdate > 1000) {
            updateSwarmRegistry();
            lastSwarmUpdate = dateNow;
        }

        // Logic Update (Movement, Aim, Keys)
        updateParentAimData();

        if ((isMouseFollowMode || isMouseAim) && isFollower) {
            handleMouseFollowAim();
        }

        moveToTarget();

        if (isAimReplication && !isMouseFollowMode && !isMouseAim) {
            replicateAim();
        }

        // Key replication check
        replicateKeys();

        // Status updates (1s check)
        if (now - lastUpdate1000 >= 1000) {
            updateStatusDisplay();
            lastUpdate1000 = now;
        }

    }, 33);
    // --------------------------------------------

    function mainLoop() {
        // The main render loop is now effectively empty for the bot logic.
        // It stays here if we need to hook into the game's render cycle for visual overlays
        // or if the game requires RAF to keep running (which the FPS limiter allows, just slowly).
        requestAnimationFrame(mainLoop);
    }


    let cachedParentRaw = null;
    let cachedAimRaw = null;

    function pollLocalStorageFallback() {
        const parentRaw = localStorage.getItem(LS_PARENT_COORDS);
        if (parentRaw && parentRaw !== cachedParentRaw) {
            cachedParentRaw = parentRaw;
            try {
                const parts = parentRaw.split(',');
                if (parts.length >= 2) {
                    lastParentData = {
                        x: Number(parts[0]),
                        y: Number(parts[1]),
                        timestamp: parts[2] ? Number(parts[2]) : 0
                    };
                }
            } catch (e) { }
        }

        const aimRaw = localStorage.getItem(LS_PARENT_AIM);
        if (aimRaw && aimRaw !== cachedAimRaw) {
            cachedAimRaw = aimRaw;
            try { lastAimData = JSON.parse(aimRaw); } catch (e) { }
        }
    }

    let lastChatTrigger = null;

    window.addEventListener('storage', (e) => {
        if (e.key === 'arras_multibox_aim_enabled' && e.newValue !== null) {
            isAimReplication = JSON.parse(e.newValue);
            updateAimButton();
            showNotification(`Aim Replication ${isAimReplication ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === 'arras_multibox_movement_enabled' && e.newValue !== null) {
            isMovement = JSON.parse(e.newValue);
            updateMovementButton();
            if (!isMovement) stopAllKeys();
            showNotification(`Movement ${isMovement ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_AUTO_RESPAWN && e.newValue !== null) {
            autoRespawnEnabled = JSON.parse(e.newValue);
            const el = document.getElementById('chk-autorespawn');
            if (el) el.classList.toggle('active', autoRespawnEnabled);
            showNotification(`Auto Respawn ${autoRespawnEnabled ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_MOUSE_FOLLOW && e.newValue !== null) {
            isMouseFollowMode = JSON.parse(e.newValue);
            const el = document.getElementById('chk-mouse');
            if (el) el.classList.toggle('active', isMouseFollowMode);
            showNotification(`Mouse Follow ${isMouseFollowMode ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_MOUSE_AIM && e.newValue !== null) {
            isMouseAim = JSON.parse(e.newValue);
            const el = document.getElementById('chk-mouse-aim');
            if (el) el.classList.toggle('active', isMouseAim);
            showNotification(`Mouse Aim ${isMouseAim ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_CHAT_TRIGGER && e.newValue !== null && e.newValue !== lastChatTrigger) {
            lastChatTrigger = e.newValue;
            sendChatMessages();
        }
        if (e.key === LS_FORCE_RESPAWN && e.newValue !== null) {
            try {
                const data = JSON.parse(e.newValue);
                pressEnter(0);

                if (data.build && data.build !== 'none') {
                    executeBuild(data.build);
                }
                showNotification(`Respawn Signal (${data.build || 'Basic'})`, 'success');
            } catch (err) {
                // Legacy support or error
                pressEnter(0);
            }
        }
        if (e.key === LS_PRECISE_AIM && e.newValue !== null) {
            isPreciseAim = JSON.parse(e.newValue);
            const el = document.getElementById('chk-precise-aim');
            if (el) el.classList.toggle('active', isPreciseAim);
            showNotification(`Precise Aim ${isPreciseAim ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_AUTO_L_PRESS && e.newValue !== null) {
            autoLPressEnabled = JSON.parse(e.newValue);
            const el = document.getElementById('chk-autol');
            if (el) el.classList.toggle('active', autoLPressEnabled);
            showNotification(`Auto L Key Press ${autoLPressEnabled ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_KEY_REPLICATION_ENABLED && e.newValue !== null) {
            keyReplicationEnabled = JSON.parse(e.newValue);
            const el = document.getElementById('chk-keyrep');
            if (el) el.classList.toggle('active', keyReplicationEnabled);
            showNotification(`Key Replication ${keyReplicationEnabled ? 'Enabled' : 'Disabled'}`, 'success');
        }
        if (e.key === LS_FOLLOW_DISTANCE && e.newValue !== null) {
            followDistance = parseInt(e.newValue);
            const slider = document.getElementById('rng-distance');
            const display = document.getElementById('distance-display');
            if (slider) slider.value = followDistance;
            if (display) display.textContent = followDistance;
        }
        if (e.key === 'arras_chat_msg_1' && e.newValue !== null) {
            chatMessage1 = e.newValue;
            const el = document.getElementById('chat-msg-1');
            if (el && el.value !== chatMessage1) el.value = chatMessage1;
        }
        if (e.key === 'arras_chat_msg_2' && e.newValue !== null) {
            chatMessage2 = e.newValue;
            const el = document.getElementById('chat-msg-2');
            if (el && el.value !== chatMessage2) el.value = chatMessage2;
        }
        if (e.key === LS_KILL_MESSAGE && e.newValue !== null) {
            try {
                const killData = JSON.parse(e.newValue);
                if (Date.now() - killData.timestamp < 5000) {
                    // Add to kill log if not already present
                    const alreadyExists = killLog.some(entry =>
                        entry.timestamp === killData.timestamp &&
                        entry.username === killData.username
                    );
                    if (!alreadyExists) {
                        killLog.push(killData);
                        updateKillLog();
                    }
                    // Show notification
                    const notifText = killData.type === 'assist' ? `Assist: ${killData.username}` : `Kill: ${killData.username}`;
                    showNotification(notifText, 'success');
                }
            } catch (err) { }
        }
        if (e.key === LS_FOLLOWER_FPS && e.newValue !== null) {
            fpsLimit = parseInt(e.newValue);
            updateFpsLimiter();
            const slider = document.getElementById('rng-fps');
            const display = document.getElementById('fps-display');
            if (slider) slider.value = fpsLimit;
            if (display) display.textContent = fpsLimit;
        }
        if (e.key === LS_FOLLOWER_FPS_ENABLED && e.newValue !== null) {
            followerFpsEnabled = JSON.parse(e.newValue);
            updateFpsLimiter();
            const el = document.getElementById('chk-fpslimit');
            if (el) el.classList.toggle('active', followerFpsEnabled);
        }

        if (e.key === LS_FORMATION_CONFIG && e.newValue !== null) {
            try {
                formationConfig = JSON.parse(e.newValue);
                updateFormationUI();
                showNotification(`Formation Updated: ${formationConfig.type}`, 'success');
            } catch (e) { }
        }
    });

    const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
:root {
  --bg-main:#0a0000;
  --bg-secondary:#140404;
  --border-color:#3a0a0a;
  --text-primary:#ffecec;
  --text-secondary:#b56a6a;
  --accent-active:#ff3b3b;
  --accent-bg:#1a0707;
  --font-main:'Inter',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
}
#arras-gui *{box-sizing:border-box;font-family:var(--font-main);user-select:none}
#open-hint{position:fixed;top:40%;left:50%;transform:translateX(-50%);background:rgba(20,20,25,.8);backdrop-filter:blur(10px);border:1px solid var(--border-color);color:#fff;padding:12px 24px;border-radius:12px;font-size:16px;font-weight:500;z-index:9999999;pointer-events:none;transition:.5s}
#open-hint.fade-out{opacity:0;top:38%}
#open-hint span{font-family:var(--font-mono);background:rgba(255,255,255,.1);padding:3px 6px;border-radius:6px}
#arras-menu{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);width:min(96vw,500px);height:min(85vh,480px);background:rgba(18,18,18,0.92);border:1px solid var(--border-color);border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,.75);display:none;opacity:0;transition:.4s cubic-bezier(.19,1,.22,1);overflow:hidden;z-index:9999998;backdrop-filter:blur(50px) saturate(180%)}
#arras-menu.open{display:flex;opacity:1;transform:translate(-50%,-50%) scale(1)}
.sidebar{width:54px;border-right:1px solid var(--border-color);padding:8px 4px;position:relative;background:var(--bg-main);display:flex;flex-direction:column;align-items:center;overflow:hidden}
.nav-glider{position:absolute;left:4px;width:calc(100% - 8px);height:38px;background:linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));border-radius:8px;border:1px solid rgba(255,255,255,0.1);transition:.3s cubic-bezier(.19,1,.22,1);z-index:0;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
.nav-item{padding:8px 4px;cursor:pointer;color:var(--text-secondary);font-weight:600;font-size:9px;transition:all .2s;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:100%;text-align:center;min-height:38px}
.nav-item span.nav-label{display:none}
.nav-item:hover{color:var(--text-primary);background:rgba(255,255,255,0.03)}
.nav-item.active{color:var(--accent-active);font-weight:600}
.content{flex:1;padding:12px 14px;overflow:auto;background:var(--bg-main)}
.tab-page{display:none}
.tab-page.active{display:block}
.header{font-size:16px;font-weight:700;margin-bottom:12px;color:var(--text-primary)}
.card{background:var(--bg-secondary);border-radius:10px;border:1px solid var(--border-color);margin-bottom:10px}
.row{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-bottom:1px solid var(--border-color)}
.row:last-child{border-bottom:none}
.label{font-size:12px;font-weight:500;color:var(--text-primary)}
.ios-switch{width:38px;height:22px;border-radius:11px;border:1px solid var(--border-color);background:var(--bg-main);position:relative;cursor:pointer;transition:all .3s;flex-shrink:0}
.ios-switch:hover{border-color:#555}
.ios-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--text-secondary);transition:.3s cubic-bezier(.19,1,.22,1)}
.ios-switch.active{background:#34c759;border-color:#34c759}
.ios-switch.active::after{transform:translateX(16px);background:#fff}
input[type=range]{background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color);padding:4px 6px;border-radius:6px;outline:none;cursor:pointer;width:100px}
input[type=range]:hover{border-color:#555}
input[type=text].chat-input{background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color);padding:8px 12px;border-radius:8px;outline:none;width:100%;font-family:var(--font-mono);font-size:13px;transition:all .2s}
input[type=text].chat-input:hover{border-color:#555}
input[type=text].chat-input:focus{border-color:#34c759;background:var(--bg-main)}
.select-input{
    appearance:auto;
    -webkit-appearance:auto;
    -moz-appearance:auto;
    background:var(--bg-secondary);
    color:var(--text-primary);
    border:1px solid var(--border-color);
    padding:6px 10px;
    border-radius:8px;
    outline:none;
    width:100%;
    font-family:var(--font-main);
    font-size:12px;
    cursor:pointer;
    transition:all .2s;
}
.select-input:hover{border-color:#555}
.select-input:focus{border-color:#34c759;background-color:var(--bg-main)}
.select-input option{background:var(--bg-main);color:var(--text-primary)}
.stat-value{color:var(--text-secondary);font-family:var(--font-mono);font-size:11px}
#snowflake-container{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999997;overflow:hidden;display:none}
#snowflake-container.active{display:block}
.snowflake{position:absolute;top:-10px;color:#fff;font-size:1em;opacity:0.8;animation:fall linear infinite;text-shadow:0 0 5px rgba(255,255,255,0.5)}
@keyframes fall{to{transform:translateY(100vh) rotate(360deg)}}
#notification-container{position:fixed;top:20px;right:20px;z-index:99999999;display:flex;flex-direction:column;gap:10px;pointer-events:none}
.notification{background:rgba(30,30,30,0.95);border:1px solid var(--border-color);border-radius:10px;padding:8px 14px;color:#fff;font-family:var(--font-main);font-size:12px;font-weight:500;backdrop-filter:blur(10px);box-shadow:0 4px 12px rgba(0,0,0,0.4);animation:slideIn 0.3s ease-out;display:flex;align-items:center;gap:8px;pointer-events:auto}
.notification.success{border-left:3px solid #34c759}
.notification.error{border-left:3px solid #ff3b30}
@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}
.notification.hide{animation:slideOut 0.3s ease-out forwards}
.distance-value{display:inline-block;min-width:40px;text-align:center;background:var(--bg-main);padding:4px 8px;border-radius:6px;margin-left:10px;font-family:var(--font-mono);color:#34c759;font-weight:600}
.profile-card{position:absolute;bottom:4px;left:2px;right:2px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:8px;padding:5px 4px;font-size:8px;display:none}
.profile-row{display:flex;justify-content:space-between;margin-bottom:6px;color:var(--text-secondary)}
.profile-row:last-child{margin-bottom:0}
.profile-label{color:var(--text-secondary)}
.profile-value{color:var(--text-primary);font-weight:600;font-family:var(--font-mono)}
.content::-webkit-scrollbar{width:0;height:0}
.content{scrollbar-width:none;-ms-overflow-style:none}
.perf-badge{display:inline-block;background:rgba(52,199,89,0.1);border:1px solid rgba(52,199,89,0.3);color:#34c759;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-left:10px}
.fps-display{display:inline-block;min-width:40px;text-align:center;background:var(--bg-main);padding:4px 8px;border-radius:6px;margin-left:10px;font-family:var(--font-mono);color:#ff9500;font-weight:600}
.kill-log{max-height:300px;overflow-y:auto;background:var(--bg-main);border-radius:8px;padding:10px}
.kill-entry{padding:8px;border-bottom:1px solid var(--border-color);font-family:var(--font-mono);font-size:12px;display:flex;justify-content:space-between}
.kill-entry:last-child{border-bottom:none}
.kill-username{color:var(--accent-active);font-weight:600}
.kill-time{color:var(--text-secondary)}
.btn{background:var(--bg-secondary);border:1px solid var(--border-color);color:var(--text-primary);padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;text-align:center}
.btn:hover{background:var(--accent-bg);border-color:var(--accent-active)}
.btn:active{transform:scale(0.98)}
#start-menu-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999995;background:rgba(0,0,0,0.3);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity 0.3s ease}
#start-menu-backdrop.active{opacity:1;pointer-events:auto}
#welcome-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) translateY(-350px) scale(0.95);width:800px;background:var(--bg-main);border:1px solid var(--border-color);border-radius:16px;padding:15px 30px;display:none;flex-direction:row;justify-content:space-between;align-items:center;box-shadow:0 10px 40px rgba(0,0,0,0.4);z-index:9999996;opacity:0;transition:all .3s cubic-bezier(.19,1,.22,1)}
#welcome-panel.open{opacity:1;transform:translate(-50%,-50%) translateY(-350px) scale(1)}
.welcome-text{font-size:18px;font-weight:600;color:var(--text-primary);margin:0}
.welcome-text .accent{color:var(--accent-active)}
.panel-right{display:flex;flex-direction:column;align-items:flex-end}
.clock-display{font-size:24px;font-weight:700;font-family:var(--font-mono);color:#fff;text-shadow:0 0 10px rgba(229,19,45,0.3);line-height:1}
.date-display{font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-top:2px}
#mobile-menu-btn{position:fixed;bottom:60px;right:12px;width:42px;height:42px;border-radius:50%;background:var(--accent-active);border:none;cursor:pointer;z-index:99999999;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(255,59,59,0.5);touch-action:none;transition:transform .15s}
#mobile-menu-btn:active{transform:scale(0.9)}
#mobile-menu-btn svg{pointer-events:none}
.kb-grid{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.kb-row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.kb-key{min-width:36px;height:36px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-secondary);color:var(--text-primary);font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;font-family:var(--font-mono);padding:0 6px;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.kb-key:active,.kb-key.pressed{background:var(--accent-active);border-color:var(--accent-active);color:#fff;transform:scale(0.93)}
.kb-key.wide{min-width:60px}
.kb-key.xwide{min-width:80px}
.kb-section-label{font-size:10px;color:var(--text-secondary);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-top:10px;margin-bottom:3px;padding-left:4px}
`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'arras-gui';

    gui.innerHTML = `
<div id="arras-menu">
  <div class="sidebar">
    <div class="nav-glider"></div>
    <div class="nav-item active" data-tab="role">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Main
    </div>
    <div class="nav-item" data-tab="control">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="19 9 22 12 19 15"></polyline><polyline points="9 19 12 22 15 19"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
        Movement
    </div>
    <div class="nav-item" data-tab="performance">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
        Performance
    </div>
    <div class="nav-item" data-tab="kills">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        Kill Log
    </div>
    <div class="nav-item" data-tab="status">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        Status
    </div>
    <div class="nav-item" data-tab="binds">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Keybinds
    </div>
    <div class="nav-item" data-tab="keys">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2l-4 5-4-5"/><line x1="6" y1="11" x2="6.01" y2="11"/><line x1="10" y1="11" x2="10.01" y2="11"/><line x1="14" y1="11" x2="14.01" y2="11"/><line x1="18" y1="11" x2="18.01" y2="11"/><line x1="6" y1="15" x2="18" y2="15"/></svg>
        Keys
    </div>
    <div class="nav-item" data-tab="info">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Info
    </div>
    <div class="profile-card">
      <div class="profile-row"><span class="profile-label">User:</span><span class="profile-value">${currentUser ? currentUser.name : 'Unknown'}</span></div>
      <div class="profile-row"><span class="profile-label">Role:</span><span class="profile-value">${currentUser ? currentUser.role : 'Guest'}</span></div>
      <div class="profile-row"><span class="profile-label">License:</span><span class="profile-value">${currentUser ? currentUser.license : 'N/A'}</span></div>
      <div class="profile-row"><span class="profile-label">Version:</span><span class="profile-value">3.3.0</span></div>
    </div>
  </div>
  <div class="content">
    <div id="tab-role" class="tab-page active">
      <div class="header">Role Selection</div>
      <div class="card">
        <div class="row"><span class="label">Current Bot Name</span><span class="stat-value" id="stat-botname">Not Set</span></div>
      </div>
      <div class="card">
        <div class="row"><span class="label">Leader Mode</span><div class="ios-switch" id="chk-leader"></div></div>
        <div class="row"><span class="label">Follower Mode</span><div class="ios-switch active" id="chk-follower"></div></div>
      </div>
      <p style="color:var(--text-secondary);margin-top:15px;line-height:1.6">cool man</p>
    </div>

    <div id="tab-control" class="tab-page">
      <div class="header">Controls</div>
      <div class="card">
        <div class="row"><span class="label">Movement Enabled</span><div class="ios-switch active" id="chk-movement"></div></div>
        <div class="row"><span class="label">Aim Replication</span><div class="ios-switch" id="chk-aim"></div></div>
        <div class="row"><span class="label">Key Replication</span><div class="ios-switch active" id="chk-keyrep"></div></div>
        <div class="row"><span class="label">Precise Aim</span><div class="ios-switch active" id="chk-precise-aim"></div></div>
        <div class="row"><span class="label">Auto Respawn</span><div class="ios-switch active" id="chk-autorespawn"></div></div>
        <div class="row"><span class="label">Auto L Key Press</span><div class="ios-switch active" id="chk-autol"></div></div>
        <div class="row"><span class="label">AFK Mode</span><div class="ios-switch" id="chk-afk"></div></div>
        <div class="row"><span class="label">Mouse Follow</span><div class="ios-switch" id="chk-mouse"></div></div>
        <div class="row"><span class="label">Mouse Aim</span><div class="ios-switch" id="chk-mouse-aim"></div></div>
      </div>
      <div class="card">
        <div class="header" style="font-size:16px;margin:10px 0 10px 20px">Formation</div>
        <div class="row"><span class="label">Enable Formation</span><div class="ios-switch" id="chk-formation"></div></div>

        <div class="row">
           <span class="label">Type</span>
           <select id="sel-formation-type" class="select-input" style="width:120px">
               <option value="line_front">Line (Front)</option>
               <option value="line_behind">Line (Behind)</option>
               <option value="line_top">Line (Top)</option>
               <option value="line_bottom">Line (Bottom)</option>
               <option value="circle">Circle</option>
           </select>
        </div>

        <div class="row">
          <span class="label">Spacing / Radius</span>
          <div style="display:flex;align-items:center">
            <input type="range" min="0" max="300" value="60" id="rng-formation-spacing">
            <span class="distance-value" id="formation-spacing-display">60</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row">
          <span class="label">Follow Distance</span>
          <div style="display:flex;align-items:center">
            <input type="range" min="0" max="200" value="0" id="rng-distance">
            <span class="distance-value" id="distance-display">0</span>
          </div>
        </div>
      </div>
    </div>

    <div id="tab-performance" class="tab-page">
      <div class="header">Performance <span class="perf-badge">OPTIMIZATION</span></div>
      <div class="card">
        <div class="row"><span class="label">FPS Limiter (Followers Only)</span><div class="ios-switch active" id="chk-fpslimit"></div></div>
        <div class="row">
          <span class="label">Follower FPS Limit</span>
          <div style="display:flex;align-items:center">
            <input type="range" min="1" max="120" value="30" id="rng-fps">
            <span class="fps-display" id="fps-display">30</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row"><span class="label">Communication Method</span><span class="stat-value" id="stat-comm">LocalStorage</span></div>
        <div class="row"><span class="label">Current FPS Target</span><span class="stat-value" id="stat-fps">Unlimited</span></div>
        <div class="row"><span class="label">Limiter Status</span><span class="stat-value" id="stat-limiter">Inactive</span></div>
      </div>
      <p style="color:var(--text-secondary);margin-top:15px;line-height:1.6">
        FPS limiting reduces CPU usage for follower tabs. Leader tabs always run at maximum fps.
        Lower FPS = less CPU usage. Coordinate reading is independent of FPS, so you can safely use 1-5 FPS for minimal CPU usage (~1% per tab).
      </p>
    </div>

    <div id="tab-kills" class="tab-page">
      <div class="header">Kill Log</div>
      <div class="card">
        <div class="row">
          <span class="label">Total Kills</span>
          <span class="stat-value" id="stat-kills">0</span>
        </div>
      </div>
      <div style="margin-bottom:15px">
        <button class="btn" id="btn-clear-kills">Clear Kill Log</button>
      </div>
      <div class="kill-log" id="kill-log-container">
        <div style="color:var(--text-secondary);text-align:center;padding:20px">No kills recorded yet</div>
      </div>
    </div>

    <div id="tab-status" class="tab-page">
      <div class="header">Live Status</div>
      <div class="card">
        <div class="row"><span class="label">Current Role</span><span class="stat-value" id="stat-role">Follower</span></div>
        <div class="row"><span class="label">Position</span><span class="stat-value" id="stat-pos">(0, 0)</span></div>
        <div class="row"><span class="label">Distance</span><span class="stat-value" id="stat-dist">---</span></div>
        <div class="row"><span class="label">Status</span><span class="stat-value" id="stat-status">Ready</span></div>
      </div>
      <div style="margin-top:15px;text-align:center">
        <button class="btn" id="btn-force-respawn" style="width:100%;margin-bottom:10px;font-weight:bold">Force Respawn All</button>

        <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:5px">
             <span class="label" style="font-size:12px">Respawn as:</span>
             <select id="sel-respawn-build" class="select-input" style="width:auto;padding:4px 8px;font-size:12px">
                 <option value="none">None (Basic)</option>
                 <option value="gale">Gale (H-Y-K-I)</option>
                 <option value="limpet">Limpet (X-Space)</option>
             </select>
        </div>

        <div style="font-size:11px;color:var(--text-secondary)">yes</div>
      </div>
    </div>

    <div id="tab-binds" class="tab-page">
      <div class="header">Keybinds & Chat</div>
      <div class="card">
        <div class="row"><span class="label">Toggle Menu</span><span class="stat-value">ESC</span></div>
        <div class="row"><span class="label">Toggle Aim</span><span class="stat-value">M</span></div>
        <div class="row"><span class="label">Toggle Movement</span><span class="stat-value">F</span></div>
        <div class="row"><span class="label">Send Chat Messages</span><span class="stat-value">P</span></div>
        <div class="row"><span class="label">Toggle Mouse Follow</span><span class="stat-value">N</span></div>
        <div class="row"><span class="label">Toggle FPS Limiter</span><span class="stat-value">F8</span></div>
      </div>
      <div class="card">
        <div class="row" style="flex-direction:column;align-items:flex-start;gap:8px">
          <span class="label">Chat Message 1</span>
          <input type="text" class="chat-input" id="chat-msg-1" placeholder="First chat message...">
        </div>
        <div class="row" style="flex-direction:column;align-items:flex-start;gap:8px">
          <span class="label">Chat Message 2</span>
          <input type="text" class="chat-input" id="chat-msg-2" placeholder="Second chat message...">
        </div>
      </div>
      <div class="card">
        <div class="row">
          <span class="label">Auto Username Randomizer</span>
          <div class="ios-switch" id="chk-auto-username"></div>
        </div>
        <div class="row" style="flex-direction:column;align-items:flex-start;gap:8px;border-bottom:none">
          <span class="label" style="font-size:13px">Theme:</span>
          <select id="username-theme-select" class="select-input">
            <option value="legit">Legit Names</option>
            <option value="random">Random Letters</option>
          </select>
        </div>
      </div>
    </div>

    <div id="tab-keys" class="tab-page">
      <div class="header">Keys</div>
      <div class="card" style="padding:16px 20px">
        <div class="kb-section-label">Stats / Upgrades</div>
        <div class="kb-grid">
          <div class="kb-row">
            <div class="kb-key" data-code="Digit1">1</div>
            <div class="kb-key" data-code="Digit2">2</div>
            <div class="kb-key" data-code="Digit3">3</div>
            <div class="kb-key" data-code="Digit4">4</div>
            <div class="kb-key" data-code="Digit5">5</div>
            <div class="kb-key" data-code="Digit6">6</div>
            <div class="kb-key" data-code="Digit7">7</div>
            <div class="kb-key" data-code="Digit8">8</div>
            <div class="kb-key" data-code="Digit9">9</div>
          </div>
        </div>
        <div class="kb-section-label">Tank Upgrades</div>
        <div class="kb-grid">
          <div class="kb-row">
            <div class="kb-key" data-code="KeyH">H</div>
            <div class="kb-key" data-code="KeyY">Y</div>
            <div class="kb-key" data-code="KeyU">U</div>
            <div class="kb-key" data-code="KeyI">I</div>
            <div class="kb-key" data-code="KeyK">K</div>
            <div class="kb-key" data-code="KeyJ">J</div>
            <div class="kb-key" data-code="KeyO">O</div>
          </div>
        </div>
        <div class="kb-section-label">Actions</div>
        <div class="kb-grid">
          <div class="kb-row">
            <div class="kb-key" data-code="KeyQ">Q<br><span style="font-size:9px;opacity:.6">spin</span></div>
            <div class="kb-key" data-code="KeyE">E<br><span style="font-size:9px;opacity:.6">fire</span></div>
            <div class="kb-key" data-code="KeyR">R</div>
            <div class="kb-key" data-code="KeyC">C</div>
            <div class="kb-key" data-code="KeyX">X<br><span style="font-size:9px;opacity:.6">die</span></div>
            <div class="kb-key" data-code="KeyZ">Z</div>
            <div class="kb-key" data-code="KeyL">L<br><span style="font-size:9px;opacity:.6">map</span></div>
          </div>
          <div class="kb-row">
            <div class="kb-key wide" data-code="Tab">Tab<br><span style="font-size:9px;opacity:.6">lock</span></div>
            <div class="kb-key xwide" data-code="Space">Space</div>
            <div class="kb-key wide" data-code="Enter">Enter</div>
          </div>
        </div>
      </div>
    </div>
    <div id="tab-info" class="tab-page">
      <div class="header">Info & Optimizations</div>
      <div class="card">
        <div class="row"><span class="label">Version</span><span class="stat-value">3.4.0</span></div>
        <div class="row"><span class="label">Update Rate</span><span class="stat-value">30ms</span></div>
        <div class="row"><span class="label">Status</span><span style="color:#34c759">Active</span></div>
        <div class="row"><span class="label">Detected FOV</span><span class="stat-value" id="stat-fov">--</span></div>
      </div>
      <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:12px;padding:20px;margin-top:20px">
        <h3 style="color:var(--text-primary);margin:0 0 12px 0;font-size:16px">v3.4.0 Notes</h3>
        <ul style="color:var(--text-secondary);line-height:1.8;margin:0;padding-left:20px;font-size:13px">
          <li>Growth Mode Support (Dynamic FOV)</li>
          <li>Mouse Aim & Follow Improvements</li>
          <li>Key replication (upgrades/stats)</li>
          <li>Optimized sync rate</li>
        </ul>
      </div>
      <div class="card" style="margin-top:20px">
        <div class="row">
          <span class="label">License Management</span>
          <button class="btn" id="btn-logout" style="background:rgba(229,19,45,0.1);border-color:var(--accent-active);color:var(--accent-active)">Log Out / Reset Key</button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

    document.body.appendChild(gui);
    menu = document.getElementById('arras-menu');
    glider = menu.querySelector('.nav-glider');

    // ── Floating mobile open button ───────────────────────────────────────
    const mobileBtn = document.createElement('button');
    mobileBtn.id = 'mobile-menu-btn';
    mobileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    document.body.appendChild(mobileBtn);

    // Drag support for the button
    let _mbDragging = false, _mbDx = 0, _mbDy = 0, _mbMoved = false;
    mobileBtn.addEventListener('touchstart', e => {
        const t = e.touches[0];
        _mbDx = t.clientX - mobileBtn.getBoundingClientRect().left;
        _mbDy = t.clientY - mobileBtn.getBoundingClientRect().top;
        _mbDragging = true; _mbMoved = false;
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
        if (!_mbDragging) return;
        const t = e.touches[0];
        const nx = t.clientX - _mbDx, ny = t.clientY - _mbDy;
        mobileBtn.style.right = 'auto'; mobileBtn.style.bottom = 'auto';
        mobileBtn.style.left = nx + 'px'; mobileBtn.style.top = ny + 'px';
        _mbMoved = true;
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => { _mbDragging = false; });
    mobileBtn.addEventListener('touchend', e => {
        if (!_mbMoved) toggleMenu();
        e.preventDefault();
    }, { passive: false });
    mobileBtn.addEventListener('click', () => { if (!_mbMoved) toggleMenu(); });
    // ─────────────────────────────────────────────────────────────────────

    // ── On-screen keyboard key press logic ───────────────────────────────
    document.querySelectorAll('.kb-key').forEach(key => {
        const code = key.dataset.code;
        if (!code) return;

        function fireKey(pressed) {
            const keyNames = {
                'Digit1':'1','Digit2':'2','Digit3':'3','Digit4':'4','Digit5':'5',
                'Digit6':'6','Digit7':'7','Digit8':'8','Digit9':'9',
                'KeyH':'h','KeyY':'y','KeyU':'u','KeyI':'i','KeyK':'k',
                'KeyJ':'j','KeyO':'o','KeyQ':'q','KeyE':'e','KeyR':'r',
                'KeyC':'c','KeyX':'x','KeyZ':'z','KeyL':'l',
                'Tab':'Tab','Space':' ','Enter':'Enter'
            };
            const k = keyNames[code] || code;
            const ev = new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
                key: k, code: code, keyCode: 0, bubbles: true, cancelable: true
            });
            document.dispatchEvent(ev);
        }

        // Touch: hold = held, release = up
        key.addEventListener('touchstart', e => {
            key.classList.add('pressed');
            fireKey(true);
            e.preventDefault();
        }, { passive: false });
        key.addEventListener('touchend', e => {
            key.classList.remove('pressed');
            fireKey(false);
            e.preventDefault();
        }, { passive: false });

        // Mouse fallback
        key.addEventListener('mousedown', () => { key.classList.add('pressed'); fireKey(true); });
        key.addEventListener('mouseup',   () => { key.classList.remove('pressed'); fireKey(false); });
        key.addEventListener('mouseleave',() => { if (key.classList.contains('pressed')) { key.classList.remove('pressed'); fireKey(false); } });
    });
    // ─────────────────────────────────────────────────────────────────────

    const welcomePanel = document.createElement('div');
    welcomePanel.id = 'welcome-panel';
    welcomePanel.innerHTML = `
        <div class="welcome-text">Welcome, <span class="accent">${currentUser ? currentUser.name : 'Unknown'}</span></div>
        <div class="panel-right">
            <div class="clock-display" id="panel-clock">00:00:00</div>
            <div class="date-display" id="panel-date">---</div>
        </div>
    `;
    document.body.appendChild(welcomePanel);

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        const clockEl = document.getElementById('panel-clock');
        const dateEl = document.getElementById('panel-date');

        if (clockEl) clockEl.textContent = timeString;
        if (dateEl) dateEl.textContent = dateString;
    }

    // Update clock every second
    setInterval(updateClock, 1000);
    updateClock();

    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);

    const backdrop = document.createElement('div');
    backdrop.id = 'start-menu-backdrop';
    document.body.appendChild(backdrop);

    const snowflakeContainer = document.createElement('div');
    snowflakeContainer.id = 'snowflake-container';
    document.body.appendChild(snowflakeContainer);

    function createSnowflakes() {
        const snowflakes = ['❄', '❅', '❆'];
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowflake.style.opacity = Math.random() * 0.6 + 0.3;
            snowflakeContainer.appendChild(snowflake);
        }
    }
    createSnowflakes();

    const hint = document.createElement('div');
    hint.id = 'open-hint';
    hint.innerHTML = 'Press <span>ESC</span> or tap <span>☰</span> to open menu';
    document.body.appendChild(hint);
    setTimeout(() => hint.classList.add('fade-out'), 3000);

    function toggleMenu() {
        if (!menu) return;

        menuOpen = !menuOpen;

        if (menuOpen) {
            menu.style.display = 'flex';
            welcomePanel.style.display = 'flex';
            backdrop.classList.add('active');
            snowflakeContainer.classList.add('active');
            setTimeout(() => {
                menu.classList.add('open');
                welcomePanel.classList.add('open');
                const activeItem = menu.querySelector('.nav-item.active');
                if (activeItem && glider) {
                    glider.style.top = activeItem.offsetTop + 'px';
                }
            }, 10);
        } else {
            menu.classList.remove('open');
            welcomePanel.classList.remove('open');
            backdrop.classList.remove('active');
            snowflakeContainer.classList.remove('active');
            setTimeout(() => {
                menu.style.display = 'none';
                welcomePanel.style.display = 'none';
            }, 300);
        }
    }

    menu.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', () => {
            menu.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            menu.querySelectorAll('.tab-page').forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('tab-' + item.dataset.tab).classList.add('active');
            glider.style.top = item.offsetTop + 'px';
        });
    });

    function bindSwitch(id, getValue, setValue) {
        const el = document.getElementById(id);
        if (!el) return;
        const refresh = () => el.classList.toggle('active', getValue());
        refresh();
        el.addEventListener('click', () => {
            const newValue = !getValue();
            setValue(newValue);
            refresh();
            updateStatusDisplay();

            const labels = {
                'chk-movement': 'Movement',
                'chk-aim': 'Aim Replication',
                'chk-autorespawn': 'Auto Respawn',
                'chk-afk': 'AFK Mode',
                'chk-mouse': 'Mouse Follow',
                'chk-mouse-aim': 'Mouse Aim',
                'chk-fpslimit': 'FPS Limiter',
                'chk-precise-aim': 'Precise Aim',
                'chk-autol': 'Auto L Key Press',
                'chk-keyrep': 'Key Replication'
            };
            if (labels[id]) {
                showNotification(`${labels[id]} ${newValue ? 'Enabled' : 'Disabled'}`, 'success');
            }
        });
    }

    document.getElementById('chk-leader').addEventListener('click', function () {
        isParent = true;
        isFollower = false;
        this.classList.add('active');
        document.getElementById('chk-follower').classList.remove('active');
        stopAllKeys();
        updateFpsLimiter();
        updateStatusDisplay();
        showNotification('Leader Mode Enabled - Full FPS', 'success');
    });

    document.getElementById('chk-follower').addEventListener('click', function () {
        isFollower = true;
        isParent = false;
        this.classList.add('active');
        document.getElementById('chk-leader').classList.remove('active');
        stopAllKeys();
        updateFpsLimiter();
        updateStatusDisplay();
        showNotification(`Follower Mode Enabled - ${fpsLimit} FPS`, 'success');
    });

    bindSwitch('chk-movement', () => isMovement, (v) => {
        isMovement = v;
        localStorage.setItem("arras_multibox_movement_enabled", JSON.stringify(v));
        if (!v) stopAllKeys();
    });

    bindSwitch('chk-aim', () => isAimReplication, (v) => {
        isAimReplication = v;
        localStorage.setItem("arras_multibox_aim_enabled", JSON.stringify(v));
    });

    bindSwitch('chk-precise-aim', () => isPreciseAim, (v) => {
        isPreciseAim = v;
        localStorage.setItem(LS_PRECISE_AIM, JSON.stringify(v));
    });

    bindSwitch('chk-autorespawn', () => autoRespawnEnabled, (v) => {
        autoRespawnEnabled = v;
        localStorage.setItem(LS_AUTO_RESPAWN, JSON.stringify(v));
    });

    // Force Auto L Press to be enabled on start (per user request)
    autoLPressEnabled = true;

    bindSwitch('chk-autol', () => autoLPressEnabled, (v) => {
        autoLPressEnabled = v;
        localStorage.setItem(LS_AUTO_L_PRESS, JSON.stringify(v));
    });

    bindSwitch('chk-afk', () => isAFK, (v) => {
        isAFK = v;
        if (v) stopAllKeys();
    });

    bindSwitch('chk-mouse', () => isMouseFollowMode, (v) => {
        isMouseFollowMode = v;
        localStorage.setItem(LS_MOUSE_FOLLOW, JSON.stringify(v));
    });

    bindSwitch('chk-mouse-aim', () => isMouseAim, (v) => {
        isMouseAim = v;
        localStorage.setItem(LS_MOUSE_AIM, JSON.stringify(v));
    });

    bindSwitch('chk-fpslimit', () => followerFpsEnabled, (v) => {
        followerFpsEnabled = v;
        localStorage.setItem(LS_FOLLOWER_FPS_ENABLED, JSON.stringify(v));
        updateFpsLimiter();
    });

    // --- FORMATION UI BINDINGS ---
    const formationCheck = document.getElementById('chk-formation');
    const formationSelect = document.getElementById('sel-formation-type');
    const formationSpacing = document.getElementById('rng-formation-spacing');
    const formationSpacingDisplay = document.getElementById('formation-spacing-display');

    function updateFormationUI() {
        if (formationCheck) formationCheck.classList.toggle('active', formationConfig.enabled);
        if (formationSelect) formationSelect.value = formationConfig.type;
        if (formationSpacing) formationSpacing.value = formationConfig.spacing;
        if (formationSpacingDisplay) formationSpacingDisplay.textContent = formationConfig.spacing;
    }

    function saveFormationConfig() {
        localStorage.setItem(LS_FORMATION_CONFIG, JSON.stringify(formationConfig));
    }

    if (formationCheck) {
        formationCheck.addEventListener('click', () => {
            formationConfig.enabled = !formationConfig.enabled;
            updateFormationUI();
            saveFormationConfig();
            showNotification(`Formation ${formationConfig.enabled ? 'Enabled' : 'Disabled'}`, 'success');
        });
    }

    if (formationSelect) {
        formationSelect.addEventListener('change', () => {
            formationConfig.type = formationSelect.value;
            saveFormationConfig();
        });
    }

    if (formationSpacing) {
        formationSpacing.addEventListener('input', () => {
            formationConfig.spacing = parseInt(formationSpacing.value);
            updateFormationUI();
            saveFormationConfig();
        });
    }


    bindSwitch('chk-keyrep', () => keyReplicationEnabled, (v) => {
        keyReplicationEnabled = v;
        localStorage.setItem(LS_KEY_REPLICATION_ENABLED, JSON.stringify(v));
    });

    const distanceSlider = document.getElementById('rng-distance');
    const distanceDisplay = document.getElementById('distance-display');

    if (distanceSlider && distanceDisplay) {
        const savedDistance = localStorage.getItem(LS_FOLLOW_DISTANCE);
        if (savedDistance !== null) {
            followDistance = parseInt(savedDistance);
            distanceSlider.value = followDistance;
            distanceDisplay.textContent = followDistance;
        }

        distanceSlider.addEventListener('input', () => {
            followDistance = parseInt(distanceSlider.value);
            distanceDisplay.textContent = followDistance;
            localStorage.setItem(LS_FOLLOW_DISTANCE, followDistance.toString());
        });
    }

    const fpsSlider = document.getElementById('rng-fps');
    const fpsDisplay = document.getElementById('fps-display');

    if (fpsSlider && fpsDisplay) {
        const savedFps = localStorage.getItem(LS_FOLLOWER_FPS);
        if (savedFps !== null) {
            fpsLimit = parseInt(savedFps);
            fpsSlider.value = fpsLimit;
            fpsDisplay.textContent = fpsLimit;
        }

        fpsSlider.addEventListener('input', () => {
            fpsLimit = parseInt(fpsSlider.value);
            fpsDisplay.textContent = fpsLimit;
            localStorage.setItem(LS_FOLLOWER_FPS, fpsLimit.toString());
            updateFpsLimiter();
        });
    }

    const chatInput1 = document.getElementById('chat-msg-1');
    const chatInput2 = document.getElementById('chat-msg-2');

    if (chatInput1) {
        chatInput1.value = chatMessage1;
        chatInput1.addEventListener('input', () => {
            chatMessage1 = chatInput1.value;
            localStorage.setItem('arras_chat_msg_1', chatMessage1);
        });

        const savedMsg1 = localStorage.getItem('arras_chat_msg_1');
        if (savedMsg1) {
            chatMessage1 = savedMsg1;
            chatInput1.value = savedMsg1;
        }
    }

    if (chatInput2) {
        chatInput2.value = chatMessage2;
        chatInput2.addEventListener('input', () => {
            chatMessage2 = chatInput2.value;
            localStorage.setItem('arras_chat_msg_2', chatMessage2);
        });

        const savedMsg2 = localStorage.getItem('arras_chat_msg_2');
        if (savedMsg2) {
            chatMessage2 = savedMsg2;
            chatInput2.value = savedMsg2;
        }
    }

    document.getElementById('btn-clear-kills').addEventListener('click', () => {
        killLog = [];
        updateKillLog();
        showNotification('Kill log cleared', 'success');
    });

    const btnRespawn = document.getElementById('btn-force-respawn');
    const selBuild = document.getElementById('sel-respawn-build');

    if (selBuild) {
        selBuild.addEventListener('change', () => {
            selectedRespawnBuild = selBuild.value;
        });
    }

    if (btnRespawn) {
        btnRespawn.addEventListener('click', () => {
            pressEnter(0); // Respawn local

            // Execute local build if selected
            if (selectedRespawnBuild !== 'none') {
                executeBuild(selectedRespawnBuild);
            }

            // Signal others
            const payload = {
                timestamp: Date.now(),
                build: selectedRespawnBuild
            };
            localStorage.setItem(LS_FORCE_RESPAWN, JSON.stringify(payload));

            showNotification(`Respawn Signal Sent (${selectedRespawnBuild})`, 'success');
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out and reset your key?')) {
                localStorage.removeItem(LS_KEY_STORAGE);
                location.reload();
            }
        });
    }

    bindSwitch('chk-auto-username', () => autoUsernameEnabled, (v) => {
        autoUsernameEnabled = v;
        localStorage.setItem(LS_AUTO_USERNAME, JSON.stringify(v));
        if (v) {
            showNotification('Auto Username Enabled - Will randomize on new tabs', 'success');
        } else {
            showNotification('Auto Username Disabled', 'success');
        }
    });

    const themeSelect = document.getElementById('username-theme-select');
    if (themeSelect) {
        const savedTheme = localStorage.getItem('arras_username_theme');
        if (savedTheme) {
            usernameTheme = savedTheme;
            themeSelect.value = savedTheme;
        }

        themeSelect.addEventListener('change', () => {
            usernameTheme = themeSelect.value;
            localStorage.setItem('arras_username_theme', usernameTheme);
            showNotification(`Theme changed to: ${usernameTheme === 'legit' ? 'Legit Names' : 'Random Letters'}`, 'success');
        });
    }

    function updateKillLog() {
        const container = document.getElementById('kill-log-container');
        const killCount = document.getElementById('stat-kills');

        if (killLog.length === 0) {
            container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px">No kills/assists recorded yet</div>';
            killCount.textContent = '0';
        } else {
            container.innerHTML = killLog.map(entry => `
                <div class="kill-entry">
                    <span class="kill-username" style="color:${entry.type === 'assist' ? '#ff9500' : 'var(--accent-active)'}">
                        ${entry.type === 'assist' ? '🤝 ' : '💀 '}${entry.username}
                    </span>
                    <span class="kill-time">${entry.time}</span>
                </div>
            `).reverse().join('');
            killCount.textContent = killLog.length.toString();
        }
    }

    function updateStatusDisplay() {
        document.getElementById('stat-role').textContent = isParent ? 'Leader' : 'Follower';

        if (playerCoords.x) {
            document.getElementById('stat-pos').textContent = `(${playerCoords.x.toFixed(0)}, ${playerCoords.y.toFixed(0)})`;
        }

        if (lastParentData && playerCoords.x) {
            const dist = Math.hypot(lastParentData.x - playerCoords.x, lastParentData.y - playerCoords.y);
            document.getElementById('stat-dist').textContent = dist.toFixed(0);
        }

        const status = isSendingMessages ? 'Sending Messages'
            : isAFK ? 'AFK'
                : isDead ? 'Dead (Respawning)'
                    : isMouseFollowMode && isFollower ? 'Mouse Follow'
                        : isMouseAim && isFollower ? 'Mouse Aim'
                            : isMovement ? 'Moving'
                                : 'Ready';

        document.getElementById('stat-status').textContent = status;

        document.getElementById('stat-comm').textContent = 'LocalStorage';

        const currentFps = isParent ? 'Unlimited' : (followerFpsEnabled ? `${fpsLimit} FPS` : 'Unlimited');
        document.getElementById('stat-fps').textContent = currentFps;

        const limiterStatus = limiterActive ? `Active (${fpsLimit} FPS)` : 'Inactive';
        document.getElementById('stat-limiter').textContent = limiterStatus;

        // Show swarm count
        if (document.getElementById('stat-comm')) {
            document.getElementById('stat-comm').innerHTML = `LocalStorage <span style="color:var(--accent-active);margin-left:5px">(${swarmSize} Bots)</span>`;
        }

        const fovElem = document.getElementById('stat-fov');
        if (fovElem) fovElem.textContent = globalFov ? globalFov.toFixed(1) : '--';

        updateKillLog();
    }

    function updateAimButton() {
        const el = document.getElementById('chk-aim');
        if (el) el.classList.toggle('active', isAimReplication);
    }

    function updateMovementButton() {
        const el = document.getElementById('chk-movement');
        if (el) el.classList.toggle('active', isMovement);
    }

    function showNotification(message, type = 'success') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    function loadSavedSettings() {
        const savedAimState = localStorage.getItem("arras_multibox_aim_enabled");
        if (savedAimState !== null) {
            isAimReplication = JSON.parse(savedAimState);
            updateAimButton();
        }

        const savedMovementState = localStorage.getItem("arras_multibox_movement_enabled");
        if (savedMovementState !== null) {
            isMovement = JSON.parse(savedMovementState);
            updateMovementButton();
        }

        const savedAutoRespawn = localStorage.getItem(LS_AUTO_RESPAWN);
        if (savedAutoRespawn !== null) {
            autoRespawnEnabled = JSON.parse(savedAutoRespawn);
            const el = document.getElementById('chk-autorespawn');
            if (el) el.classList.toggle('active', autoRespawnEnabled);
        }

        const savedAutoL = localStorage.getItem(LS_AUTO_L_PRESS);
        if (savedAutoL !== null) {
            autoLPressEnabled = JSON.parse(savedAutoL);
            const el = document.getElementById('chk-autol');
            if (el) el.classList.toggle('active', autoLPressEnabled);
        }

        const savedMouseFollow = localStorage.getItem(LS_MOUSE_FOLLOW);
        if (savedMouseFollow !== null) {
            isMouseFollowMode = JSON.parse(savedMouseFollow);
            const el = document.getElementById('chk-mouse');
            if (el) el.classList.toggle('active', isMouseFollowMode);
        }

        const savedMouseAim = localStorage.getItem(LS_MOUSE_AIM);
        if (savedMouseAim !== null) {
            isMouseAim = JSON.parse(savedMouseAim);
            const el = document.getElementById('chk-mouse-aim');
            if (el) el.classList.toggle('active', isMouseAim);
        }

        const savedFpsEnabled = localStorage.getItem(LS_FOLLOWER_FPS_ENABLED);
        if (savedFpsEnabled !== null) {
            followerFpsEnabled = JSON.parse(savedFpsEnabled);
            const el = document.getElementById('chk-fpslimit');
            if (el) el.classList.toggle('active', followerFpsEnabled);
        }

        const savedAutoUsername = localStorage.getItem(LS_AUTO_USERNAME);
        if (savedAutoUsername !== null) {
            autoUsernameEnabled = JSON.parse(savedAutoUsername);
            const el = document.getElementById('chk-auto-username');
            if (el) el.classList.toggle('active', autoUsernameEnabled);
        }

        const savedFormation = localStorage.getItem(LS_FORMATION_CONFIG);
        if (savedFormation !== null) {
            try {
                formationConfig = JSON.parse(savedFormation);
                updateFormationUI();
            } catch (e) { }
        }
    }

    function initialize() {
        loadSavedSettings();
        setInterval(pollLocalStorageFallback, 16);
        updateFpsLimiter();
        requestAnimationFrame(mainLoop);
        showNotification('Multibox v3.3.0 Ready', 'success');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 2000);
        });
    } else {
        setTimeout(initialize, 2000);
    }

    // --- EARLY EXECUTION: Random Username ---
    // Runs ASAP to catch the input field the moment it exists
    try {
        const savedTheme = localStorage.getItem('arras_username_theme');
        if (savedTheme) usernameTheme = savedTheme;

        const earlyAutoUser = localStorage.getItem(LS_AUTO_USERNAME);
        if (earlyAutoUser !== null && JSON.parse(earlyAutoUser)) {
            // Start the polling loop immediately
            setRandomUsername();
        }
    } catch (e) { }

})();