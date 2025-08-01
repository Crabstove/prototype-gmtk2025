let B, Hr, J, dt, Rt, G, io, Be, es, re, Eo, Fo, z, k, j, ia, K, ss, gi, Sa, we, di, rs, no, Xe, rt, nr, Nr, mt, W, aa, Ga, Ta, Qa, th, nh, ah, hh, $t, Qt, Vs, ue, la, Ks, ke, Bt, tn, bs, xs, at, Tn, rn, le, Ie, Pi, nt, _s, ba, Or, mr, lt, Ir, Za, Ja, Ui, sh, oh, Ei, Hn, D, Mr, vn, ch, tt, ht, pt, ir;
let __tla = (async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);
        new MutationObserver((r)=>{
            for (const n of r)if (n.type === "childList") for (const o of n.addedNodes)o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(r) {
            const n = {};
            return r.integrity && (n.integrity = r.integrity), r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? n.credentials = "include" : r.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
        }
        function s(r) {
            if (r.ep) return;
            r.ep = !0;
            const n = e(r);
            fetch(r.href, n);
        }
    })();
    const dn = "modulepreload", fn = function(i) {
        return "/" + i;
    }, Ni = {}, se = function(t, e, s) {
        if (!e || e.length === 0) return t();
        const r = document.getElementsByTagName("link");
        return Promise.all(e.map((n)=>{
            if (n = fn(n), n in Ni) return;
            Ni[n] = !0;
            const o = n.endsWith(".css"), a = o ? '[rel="stylesheet"]' : "";
            if (!!s) for(let c = r.length - 1; c >= 0; c--){
                const u = r[c];
                if (u.href === n && (!o || u.rel === "stylesheet")) return;
            }
            else if (document.querySelector(`link[href="${n}"]${a}`)) return;
            const l = document.createElement("link");
            if (l.rel = o ? "stylesheet" : dn, o || (l.as = "script", l.crossOrigin = ""), l.href = n, document.head.appendChild(l), o) return new Promise((c, u)=>{
                l.addEventListener("load", c), l.addEventListener("error", ()=>u(new Error(`Unable to preload CSS for ${n}`)));
            });
        })).then(()=>t()).catch((n)=>{
            const o = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (o.payload = n, window.dispatchEvent(o), !o.defaultPrevented) throw n;
        });
    };
    G = ((i)=>(i.Application = "application", i.WebGLPipes = "webgl-pipes", i.WebGLPipesAdaptor = "webgl-pipes-adaptor", i.WebGLSystem = "webgl-system", i.WebGPUPipes = "webgpu-pipes", i.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", i.WebGPUSystem = "webgpu-system", i.CanvasSystem = "canvas-system", i.CanvasPipesAdaptor = "canvas-pipes-adaptor", i.CanvasPipes = "canvas-pipes", i.Asset = "asset", i.LoadParser = "load-parser", i.ResolveParser = "resolve-parser", i.CacheParser = "cache-parser", i.DetectionParser = "detection-parser", i.MaskEffect = "mask-effect", i.BlendMode = "blend-mode", i.TextureSource = "texture-source", i.Environment = "environment", i.ShapeBuilder = "shape-builder", i.Batcher = "batcher", i))(G || {});
    let ai, ge, pn, gn;
    ai = (i)=>{
        if (typeof i == "function" || typeof i == "object" && i.extension) {
            if (!i.extension) throw new Error("Extension class must have an extension object");
            i = {
                ...typeof i.extension != "object" ? {
                    type: i.extension
                } : i.extension,
                ref: i
            };
        }
        if (typeof i == "object") i = {
            ...i
        };
        else throw new Error("Invalid extension type");
        return typeof i.type == "string" && (i.type = [
            i.type
        ]), i;
    };
    ge = (i, t)=>ai(i).priority ?? t;
    nt = {
        _addHandlers: {},
        _removeHandlers: {},
        _queue: {},
        remove (...i) {
            return i.map(ai).forEach((t)=>{
                t.type.forEach((e)=>this._removeHandlers[e]?.(t));
            }), this;
        },
        add (...i) {
            return i.map(ai).forEach((t)=>{
                t.type.forEach((e)=>{
                    const s = this._addHandlers, r = this._queue;
                    s[e] ? s[e]?.(t) : (r[e] = r[e] || [], r[e]?.push(t));
                });
            }), this;
        },
        handle (i, t, e) {
            const s = this._addHandlers, r = this._removeHandlers;
            if (s[i] || r[i]) throw new Error(`Extension type ${i} already has a handler`);
            s[i] = t, r[i] = e;
            const n = this._queue;
            return n[i] && (n[i]?.forEach((o)=>t(o)), delete n[i]), this;
        },
        handleByMap (i, t) {
            return this.handle(i, (e)=>{
                e.name && (t[e.name] = e.ref);
            }, (e)=>{
                e.name && delete t[e.name];
            });
        },
        handleByNamedList (i, t, e = -1) {
            return this.handle(i, (s)=>{
                t.findIndex((n)=>n.name === s.name) >= 0 || (t.push({
                    name: s.name,
                    value: s.ref
                }), t.sort((n, o)=>ge(o.value, e) - ge(n.value, e)));
            }, (s)=>{
                const r = t.findIndex((n)=>n.name === s.name);
                r !== -1 && t.splice(r, 1);
            });
        },
        handleByList (i, t, e = -1) {
            return this.handle(i, (s)=>{
                t.includes(s.ref) || (t.push(s.ref), t.sort((r, n)=>ge(n, e) - ge(r, e)));
            }, (s)=>{
                const r = t.indexOf(s.ref);
                r !== -1 && t.splice(r, 1);
            });
        },
        mixin (i, ...t) {
            for (const e of t)Object.defineProperties(i.prototype, Object.getOwnPropertyDescriptors(e));
        }
    };
    pn = {
        extension: {
            type: G.Environment,
            name: "browser",
            priority: -1
        },
        test: ()=>!0,
        load: async ()=>{
            await se(()=>import("./browserAll-9765a7fd.js"), ["assets/browserAll-9765a7fd.js","assets/init-c9a9698e.js","assets/colorToUniform-21d3a5e1.js","assets/CanvasPool-118b044d.js"]);
        }
    };
    gn = {
        extension: {
            type: G.Environment,
            name: "webworker",
            priority: 0
        },
        test: ()=>typeof self < "u" && self.WorkerGlobalScope !== void 0,
        load: async ()=>{
            await se(()=>import("./webworkerAll-f6be00c8.js"), ["assets/webworkerAll-f6be00c8.js","assets/init-c9a9698e.js","assets/colorToUniform-21d3a5e1.js","assets/CanvasPool-118b044d.js"]);
        }
    };
    class q {
        constructor(t, e, s){
            this._x = e || 0, this._y = s || 0, this._observer = t;
        }
        clone(t) {
            return new q(t ?? this._observer, this._x, this._y);
        }
        set(t = 0, e = t) {
            return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
        }
        copyFrom(t) {
            return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
        }
        copyTo(t) {
            return t.set(this._x, this._y), t;
        }
        equals(t) {
            return t.x === this._x && t.y === this._y;
        }
        toString() {
            return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
        }
        get x() {
            return this._x;
        }
        set x(t) {
            this._x !== t && (this._x = t, this._observer._onUpdate(this));
        }
        get y() {
            return this._y;
        }
        set y(t) {
            this._y !== t && (this._y = t, this._observer._onUpdate(this));
        }
    }
    function Ys(i) {
        return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
    }
    var zs = {
        exports: {}
    };
    (function(i) {
        var t = Object.prototype.hasOwnProperty, e = "~";
        function s() {}
        Object.create && (s.prototype = Object.create(null), new s().__proto__ || (e = !1));
        function r(h, l, c) {
            this.fn = h, this.context = l, this.once = c || !1;
        }
        function n(h, l, c, u, f) {
            if (typeof c != "function") throw new TypeError("The listener must be a function");
            var d = new r(c, u || h, f), g = e ? e + l : l;
            return h._events[g] ? h._events[g].fn ? h._events[g] = [
                h._events[g],
                d
            ] : h._events[g].push(d) : (h._events[g] = d, h._eventsCount++), h;
        }
        function o(h, l) {
            --h._eventsCount === 0 ? h._events = new s : delete h._events[l];
        }
        function a() {
            this._events = new s, this._eventsCount = 0;
        }
        a.prototype.eventNames = function() {
            var l = [], c, u;
            if (this._eventsCount === 0) return l;
            for(u in c = this._events)t.call(c, u) && l.push(e ? u.slice(1) : u);
            return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
        }, a.prototype.listeners = function(l) {
            var c = e ? e + l : l, u = this._events[c];
            if (!u) return [];
            if (u.fn) return [
                u.fn
            ];
            for(var f = 0, d = u.length, g = new Array(d); f < d; f++)g[f] = u[f].fn;
            return g;
        }, a.prototype.listenerCount = function(l) {
            var c = e ? e + l : l, u = this._events[c];
            return u ? u.fn ? 1 : u.length : 0;
        }, a.prototype.emit = function(l, c, u, f, d, g) {
            var m = e ? e + l : l;
            if (!this._events[m]) return !1;
            var p = this._events[m], x = arguments.length, y, _;
            if (p.fn) {
                switch(p.once && this.removeListener(l, p.fn, void 0, !0), x){
                    case 1:
                        return p.fn.call(p.context), !0;
                    case 2:
                        return p.fn.call(p.context, c), !0;
                    case 3:
                        return p.fn.call(p.context, c, u), !0;
                    case 4:
                        return p.fn.call(p.context, c, u, f), !0;
                    case 5:
                        return p.fn.call(p.context, c, u, f, d), !0;
                    case 6:
                        return p.fn.call(p.context, c, u, f, d, g), !0;
                }
                for(_ = 1, y = new Array(x - 1); _ < x; _++)y[_ - 1] = arguments[_];
                p.fn.apply(p.context, y);
            } else {
                var b = p.length, v;
                for(_ = 0; _ < b; _++)switch(p[_].once && this.removeListener(l, p[_].fn, void 0, !0), x){
                    case 1:
                        p[_].fn.call(p[_].context);
                        break;
                    case 2:
                        p[_].fn.call(p[_].context, c);
                        break;
                    case 3:
                        p[_].fn.call(p[_].context, c, u);
                        break;
                    case 4:
                        p[_].fn.call(p[_].context, c, u, f);
                        break;
                    default:
                        if (!y) for(v = 1, y = new Array(x - 1); v < x; v++)y[v - 1] = arguments[v];
                        p[_].fn.apply(p[_].context, y);
                }
            }
            return !0;
        }, a.prototype.on = function(l, c, u) {
            return n(this, l, c, u, !1);
        }, a.prototype.once = function(l, c, u) {
            return n(this, l, c, u, !0);
        }, a.prototype.removeListener = function(l, c, u, f) {
            var d = e ? e + l : l;
            if (!this._events[d]) return this;
            if (!c) return o(this, d), this;
            var g = this._events[d];
            if (g.fn) g.fn === c && (!f || g.once) && (!u || g.context === u) && o(this, d);
            else {
                for(var m = 0, p = [], x = g.length; m < x; m++)(g[m].fn !== c || f && !g[m].once || u && g[m].context !== u) && p.push(g[m]);
                p.length ? this._events[d] = p.length === 1 ? p[0] : p : o(this, d);
            }
            return this;
        }, a.prototype.removeAllListeners = function(l) {
            var c;
            return l ? (c = e ? e + l : l, this._events[c] && o(this, c)) : (this._events = new s, this._eventsCount = 0), this;
        }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, i.exports = a;
    })(zs);
    var mn = zs.exports;
    let yn, xn, _n;
    mt = Ys(mn);
    yn = Math.PI * 2;
    xn = 180 / Math.PI;
    _n = Math.PI / 180;
    K = class {
        constructor(t = 0, e = 0){
            this.x = 0, this.y = 0, this.x = t, this.y = e;
        }
        clone() {
            return new K(this.x, this.y);
        }
        copyFrom(t) {
            return this.set(t.x, t.y), this;
        }
        copyTo(t) {
            return t.set(this.x, this.y), t;
        }
        equals(t) {
            return t.x === this.x && t.y === this.y;
        }
        set(t = 0, e = t) {
            return this.x = t, this.y = e, this;
        }
        toString() {
            return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
        }
        static get shared() {
            return Le.x = 0, Le.y = 0, Le;
        }
    };
    const Le = new K;
    k = class {
        constructor(t = 1, e = 0, s = 0, r = 1, n = 0, o = 0){
            this.array = null, this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o;
        }
        fromArray(t) {
            this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
        }
        set(t, e, s, r, n, o) {
            return this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o, this;
        }
        toArray(t, e) {
            this.array || (this.array = new Float32Array(9));
            const s = e || this.array;
            return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s;
        }
        apply(t, e) {
            e = e || new K;
            const s = t.x, r = t.y;
            return e.x = this.a * s + this.c * r + this.tx, e.y = this.b * s + this.d * r + this.ty, e;
        }
        applyInverse(t, e) {
            e = e || new K;
            const s = this.a, r = this.b, n = this.c, o = this.d, a = this.tx, h = this.ty, l = 1 / (s * o + n * -r), c = t.x, u = t.y;
            return e.x = o * l * c + -n * l * u + (h * n - a * o) * l, e.y = s * l * u + -r * l * c + (-h * s + a * r) * l, e;
        }
        translate(t, e) {
            return this.tx += t, this.ty += e, this;
        }
        scale(t, e) {
            return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
        }
        rotate(t) {
            const e = Math.cos(t), s = Math.sin(t), r = this.a, n = this.c, o = this.tx;
            return this.a = r * e - this.b * s, this.b = r * s + this.b * e, this.c = n * e - this.d * s, this.d = n * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this;
        }
        append(t) {
            const e = this.a, s = this.b, r = this.c, n = this.d;
            return this.a = t.a * e + t.b * r, this.b = t.a * s + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * s + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * s + t.ty * n + this.ty, this;
        }
        appendFrom(t, e) {
            const s = t.a, r = t.b, n = t.c, o = t.d, a = t.tx, h = t.ty, l = e.a, c = e.b, u = e.c, f = e.d;
            return this.a = s * l + r * u, this.b = s * c + r * f, this.c = n * l + o * u, this.d = n * c + o * f, this.tx = a * l + h * u + e.tx, this.ty = a * c + h * f + e.ty, this;
        }
        setTransform(t, e, s, r, n, o, a, h, l) {
            return this.a = Math.cos(a + l) * n, this.b = Math.sin(a + l) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (s * this.a + r * this.c), this.ty = e - (s * this.b + r * this.d), this;
        }
        prepend(t) {
            const e = this.tx;
            if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
                const s = this.a, r = this.c;
                this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d;
            }
            return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
        }
        decompose(t) {
            const e = this.a, s = this.b, r = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-r, n), h = Math.atan2(s, e), l = Math.abs(a + h);
            return l < 1e-5 || Math.abs(yn - l) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (o.x * e + o.y * r), t.position.y = this.ty + (o.x * s + o.y * n), t;
        }
        invert() {
            const t = this.a, e = this.b, s = this.c, r = this.d, n = this.tx, o = t * r - e * s;
            return this.a = r / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - r * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
        }
        isIdentity() {
            return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
        }
        identity() {
            return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
        }
        clone() {
            const t = new k;
            return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
        }
        copyTo(t) {
            return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
        }
        copyFrom(t) {
            return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
        }
        equals(t) {
            return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
        }
        toString() {
            return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
        }
        static get IDENTITY() {
            return wn.identity();
        }
        static get shared() {
            return bn.identity();
        }
    };
    const bn = new k, wn = new k, At = [
        1,
        1,
        0,
        -1,
        -1,
        -1,
        0,
        1,
        1,
        1,
        0,
        -1,
        -1,
        -1,
        0,
        1
    ], vt = [
        0,
        1,
        1,
        1,
        0,
        -1,
        -1,
        -1,
        0,
        1,
        1,
        1,
        0,
        -1,
        -1,
        -1
    ], Tt = [
        0,
        -1,
        -1,
        -1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        -1,
        -1,
        -1
    ], Mt = [
        1,
        1,
        0,
        -1,
        -1,
        -1,
        0,
        1,
        -1,
        -1,
        0,
        1,
        1,
        1,
        0,
        -1
    ], hi = [], Xs = [], me = Math.sign;
    function Cn() {
        for(let i = 0; i < 16; i++){
            const t = [];
            hi.push(t);
            for(let e = 0; e < 16; e++){
                const s = me(At[i] * At[e] + Tt[i] * vt[e]), r = me(vt[i] * At[e] + Mt[i] * vt[e]), n = me(At[i] * Tt[e] + Tt[i] * Mt[e]), o = me(vt[i] * Tt[e] + Mt[i] * Mt[e]);
                for(let a = 0; a < 16; a++)if (At[a] === s && vt[a] === r && Tt[a] === n && Mt[a] === o) {
                    t.push(a);
                    break;
                }
            }
        }
        for(let i = 0; i < 16; i++){
            const t = new k;
            t.set(At[i], vt[i], Tt[i], Mt[i], 0, 0), Xs.push(t);
        }
    }
    Cn();
    const F = {
        E: 0,
        SE: 1,
        S: 2,
        SW: 3,
        W: 4,
        NW: 5,
        N: 6,
        NE: 7,
        MIRROR_VERTICAL: 8,
        MAIN_DIAGONAL: 10,
        MIRROR_HORIZONTAL: 12,
        REVERSE_DIAGONAL: 14,
        uX: (i)=>At[i],
        uY: (i)=>vt[i],
        vX: (i)=>Tt[i],
        vY: (i)=>Mt[i],
        inv: (i)=>i & 8 ? i & 15 : -i & 7,
        add: (i, t)=>hi[i][t],
        sub: (i, t)=>hi[i][F.inv(t)],
        rotate180: (i)=>i ^ 4,
        isVertical: (i)=>(i & 3) === 2,
        byDirection: (i, t)=>Math.abs(i) * 2 <= Math.abs(t) ? t >= 0 ? F.S : F.N : Math.abs(t) * 2 <= Math.abs(i) ? i > 0 ? F.E : F.W : t > 0 ? i > 0 ? F.SE : F.SW : i > 0 ? F.NE : F.NW,
        matrixAppendRotationInv: (i, t, e = 0, s = 0)=>{
            const r = Xs[F.inv(t)];
            r.tx = e, r.ty = s, i.append(r);
        }
    }, ye = [
        new K,
        new K,
        new K,
        new K
    ];
    j = class {
        constructor(t = 0, e = 0, s = 0, r = 0){
            this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(r);
        }
        get left() {
            return this.x;
        }
        get right() {
            return this.x + this.width;
        }
        get top() {
            return this.y;
        }
        get bottom() {
            return this.y + this.height;
        }
        isEmpty() {
            return this.left === this.right || this.top === this.bottom;
        }
        static get EMPTY() {
            return new j(0, 0, 0, 0);
        }
        clone() {
            return new j(this.x, this.y, this.width, this.height);
        }
        copyFromBounds(t) {
            return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
        }
        copyFrom(t) {
            return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
        }
        copyTo(t) {
            return t.copyFrom(this), t;
        }
        contains(t, e) {
            return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
        }
        strokeContains(t, e, s, r = .5) {
            const { width: n, height: o } = this;
            if (n <= 0 || o <= 0) return !1;
            const a = this.x, h = this.y, l = s * (1 - r), c = s - l, u = a - l, f = a + n + l, d = h - l, g = h + o + l, m = a + c, p = a + n - c, x = h + c, y = h + o - c;
            return t >= u && t <= f && e >= d && e <= g && !(t > m && t < p && e > x && e < y);
        }
        intersects(t, e) {
            if (!e) {
                const R = this.x < t.x ? t.x : this.x;
                if ((this.right > t.right ? t.right : this.right) <= R) return !1;
                const T = this.y < t.y ? t.y : this.y;
                return (this.bottom > t.bottom ? t.bottom : this.bottom) > T;
            }
            const s = this.left, r = this.right, n = this.top, o = this.bottom;
            if (r <= s || o <= n) return !1;
            const a = ye[0].set(t.left, t.top), h = ye[1].set(t.left, t.bottom), l = ye[2].set(t.right, t.top), c = ye[3].set(t.right, t.bottom);
            if (l.x <= a.x || h.y <= a.y) return !1;
            const u = Math.sign(e.a * e.d - e.b * e.c);
            if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(l, l), e.apply(c, c), Math.max(a.x, h.x, l.x, c.x) <= s || Math.min(a.x, h.x, l.x, c.x) >= r || Math.max(a.y, h.y, l.y, c.y) <= n || Math.min(a.y, h.y, l.y, c.y) >= o)) return !1;
            const f = u * (h.y - a.y), d = u * (a.x - h.x), g = f * s + d * n, m = f * r + d * n, p = f * s + d * o, x = f * r + d * o;
            if (Math.max(g, m, p, x) <= f * a.x + d * a.y || Math.min(g, m, p, x) >= f * c.x + d * c.y) return !1;
            const y = u * (a.y - l.y), _ = u * (l.x - a.x), b = y * s + _ * n, v = y * r + _ * n, w = y * s + _ * o, C = y * r + _ * o;
            return !(Math.max(b, v, w, C) <= y * a.x + _ * a.y || Math.min(b, v, w, C) >= y * c.x + _ * c.y);
        }
        pad(t = 0, e = t) {
            return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
        }
        fit(t) {
            const e = Math.max(this.x, t.x), s = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
            return this.x = e, this.width = Math.max(s - e, 0), this.y = r, this.height = Math.max(n - r, 0), this;
        }
        ceil(t = 1, e = .001) {
            const s = Math.ceil((this.x + this.width - e) * t) / t, r = Math.ceil((this.y + this.height - e) * t) / t;
            return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = r - this.y, this;
        }
        enlarge(t) {
            const e = Math.min(this.x, t.x), s = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
            return this.x = e, this.width = s - e, this.y = r, this.height = n - r, this;
        }
        getBounds(t) {
            return t || (t = new j), t.copyFrom(this), t;
        }
        containsRect(t) {
            if (this.width <= 0 || this.height <= 0) return !1;
            const e = t.x, s = t.y, r = t.x + t.width, n = t.y + t.height;
            return e >= this.x && e < this.x + this.width && s >= this.y && s < this.y + this.height && r >= this.x && r < this.x + this.width && n >= this.y && n < this.y + this.height;
        }
        set(t, e, s, r) {
            return this.x = t, this.y = e, this.width = s, this.height = r, this;
        }
        toString() {
            return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
        }
    };
    const Fe = {
        default: -1
    };
    z = function(i = "default") {
        return Fe[i] === void 0 && (Fe[i] = -1), ++Fe[i];
    };
    let Vi, Sn;
    Vi = {};
    W = "8.0.0";
    Sn = "8.3.4";
    B = function(i, t, e = 3) {
        if (Vi[t]) return;
        let s = new Error().stack;
        typeof s > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`) : (s = s.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", `${t}
Deprecated since v${i}`), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`), console.warn(s))), Vi[t] = !0;
    };
    const Ws = ()=>{};
    Ui = function(i) {
        return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1;
    };
    function Yi(i) {
        return !(i & i - 1) && !!i;
    }
    function $s(i) {
        const t = {};
        for(const e in i)i[e] !== void 0 && (t[e] = i[e]);
        return t;
    }
    const zi = Object.create(null);
    function An(i) {
        const t = zi[i];
        return t === void 0 && (zi[i] = z("resource")), t;
    }
    const js = class qs extends mt {
        constructor(t = {}){
            super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = {
                ...qs.defaultOptions,
                ...t
            }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
        }
        set addressMode(t) {
            this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
        }
        get addressMode() {
            return this.addressModeU;
        }
        set wrapMode(t) {
            B(W, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
        }
        get wrapMode() {
            return this.addressMode;
        }
        set scaleMode(t) {
            this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
        }
        get scaleMode() {
            return this.magFilter;
        }
        set maxAnisotropy(t) {
            this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
        }
        get maxAnisotropy() {
            return this._maxAnisotropy;
        }
        get _resourceId() {
            return this._sharedResourceId || this._generateResourceId();
        }
        update() {
            this.emit("change", this), this._sharedResourceId = null;
        }
        _generateResourceId() {
            const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
            return this._sharedResourceId = An(t), this._resourceId;
        }
        destroy() {
            this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
        }
    };
    js.defaultOptions = {
        addressMode: "clamp-to-edge",
        scaleMode: "linear"
    };
    Ks = js;
    const Zs = class Qs extends mt {
        constructor(t = {}){
            super(), this.options = t, this.uid = z("textureSource"), this._resourceType = "textureSource", this._resourceId = z("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = {
                ...Qs.defaultOptions,
                ...t
            }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Ks($s(t)), this.destroyed = !1, this._refreshPOT();
        }
        get source() {
            return this;
        }
        get style() {
            return this._style;
        }
        set style(t) {
            this.style !== t && (this._style?.off("change", this._onStyleChange, this), this._style = t, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
        }
        get addressMode() {
            return this._style.addressMode;
        }
        set addressMode(t) {
            this._style.addressMode = t;
        }
        get repeatMode() {
            return this._style.addressMode;
        }
        set repeatMode(t) {
            this._style.addressMode = t;
        }
        get magFilter() {
            return this._style.magFilter;
        }
        set magFilter(t) {
            this._style.magFilter = t;
        }
        get minFilter() {
            return this._style.minFilter;
        }
        set minFilter(t) {
            this._style.minFilter = t;
        }
        get mipmapFilter() {
            return this._style.mipmapFilter;
        }
        set mipmapFilter(t) {
            this._style.mipmapFilter = t;
        }
        get lodMinClamp() {
            return this._style.lodMinClamp;
        }
        set lodMinClamp(t) {
            this._style.lodMinClamp = t;
        }
        get lodMaxClamp() {
            return this._style.lodMaxClamp;
        }
        set lodMaxClamp(t) {
            this._style.lodMaxClamp = t;
        }
        _onStyleChange() {
            this.emit("styleChange", this);
        }
        update() {
            if (this.resource) {
                const t = this._resolution;
                if (this.resize(this.resourceWidth / t, this.resourceHeight / t)) return;
            }
            this.emit("update", this);
        }
        destroy() {
            this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
        }
        unload() {
            this._resourceId = z("resource"), this.emit("change", this), this.emit("unload", this);
        }
        get resourceWidth() {
            const { resource: t } = this;
            return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
        }
        get resourceHeight() {
            const { resource: t } = this;
            return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
        }
        get resolution() {
            return this._resolution;
        }
        set resolution(t) {
            this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
        }
        resize(t, e, s) {
            s || (s = this._resolution), t || (t = this.width), e || (e = this.height);
            const r = Math.round(t * s), n = Math.round(e * s);
            return this.width = r / s, this.height = n / s, this._resolution = s, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = z("resource"), this.emit("change", this), !0);
        }
        updateMipmaps() {
            this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
        }
        set wrapMode(t) {
            this._style.wrapMode = t;
        }
        get wrapMode() {
            return this._style.wrapMode;
        }
        set scaleMode(t) {
            this._style.scaleMode = t;
        }
        get scaleMode() {
            return this._style.scaleMode;
        }
        _refreshPOT() {
            this.isPowerOfTwo = Yi(this.pixelWidth) && Yi(this.pixelHeight);
        }
        static test(t) {
            throw new Error("Unimplemented");
        }
    };
    Zs.defaultOptions = {
        resolution: 1,
        format: "bgra8unorm",
        alphaMode: "premultiply-alpha-on-upload",
        dimensions: "2d",
        mipLevelCount: 1,
        autoGenerateMipmaps: !1,
        sampleCount: 1,
        antialias: !1,
        autoGarbageCollect: !1
    };
    lt = Zs;
    class vi extends lt {
        constructor(t){
            const e = t.resource || new Float32Array(t.width * t.height * 4);
            let s = t.format;
            s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : (e instanceof Int8Array, s = "bgra8unorm")), super({
                ...t,
                resource: e,
                format: s
            }), this.uploadMethodId = "buffer";
        }
        static test(t) {
            return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
        }
    }
    vi.extension = G.TextureSource;
    const Xi = new k;
    vn = class {
        constructor(t, e){
            this.mapCoord = new k, this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : .5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
        }
        get texture() {
            return this._texture;
        }
        set texture(t) {
            this.texture !== t && (this._texture?.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
        }
        multiplyUvs(t, e) {
            e === void 0 && (e = t);
            const s = this.mapCoord;
            for(let r = 0; r < t.length; r += 2){
                const n = t[r], o = t[r + 1];
                e[r] = n * s.a + o * s.c + s.tx, e[r + 1] = n * s.b + o * s.d + s.ty;
            }
            return e;
        }
        update() {
            const t = this._texture;
            this._updateID++;
            const e = t.uvs;
            this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
            const s = t.orig, r = t.trim;
            r && (Xi.set(s.width / r.width, 0, 0, s.height / r.height, -r.x / r.width, -r.y / r.height), this.mapCoord.append(Xi));
            const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, h = this.clampOffset / n._resolution;
            return o[0] = (t.frame.x + a + h) / n.width, o[1] = (t.frame.y + a + h) / n.height, o[2] = (t.frame.x + t.frame.width - a + h) / n.width, o[3] = (t.frame.y + t.frame.height - a + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
        }
    };
    D = class extends mt {
        constructor({ source: t, label: e, frame: s, orig: r, trim: n, defaultAnchor: o, defaultBorders: a, rotate: h, dynamic: l } = {}){
            if (super(), this.uid = z("texture"), this.uvs = {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                x3: 0,
                y3: 0
            }, this.frame = new j, this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = t?.source ?? new lt, this.noFrame = !s, s) this.frame.copyFrom(s);
            else {
                const { width: c, height: u } = this._source;
                this.frame.width = c, this.frame.height = u;
            }
            this.orig = r || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = l || !1, this.updateUvs();
        }
        set source(t) {
            this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
        }
        get source() {
            return this._source;
        }
        get textureMatrix() {
            return this._textureMatrix || (this._textureMatrix = new vn(this)), this._textureMatrix;
        }
        get width() {
            return this.orig.width;
        }
        get height() {
            return this.orig.height;
        }
        updateUvs() {
            const { uvs: t, frame: e } = this, { width: s, height: r } = this._source, n = e.x / s, o = e.y / r, a = e.width / s, h = e.height / r;
            let l = this.rotate;
            if (l) {
                const c = a / 2, u = h / 2, f = n + c, d = o + u;
                l = F.add(l, F.NW), t.x0 = f + c * F.uX(l), t.y0 = d + u * F.uY(l), l = F.add(l, 2), t.x1 = f + c * F.uX(l), t.y1 = d + u * F.uY(l), l = F.add(l, 2), t.x2 = f + c * F.uX(l), t.y2 = d + u * F.uY(l), l = F.add(l, 2), t.x3 = f + c * F.uX(l), t.y3 = d + u * F.uY(l);
            } else t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + h, t.x3 = n, t.y3 = o + h;
        }
        destroy(t = !1) {
            this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
        }
        update() {
            this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
        }
        get baseTexture() {
            return B(W, "Texture.baseTexture is now Texture.source"), this._source;
        }
    };
    D.EMPTY = new D({
        label: "EMPTY",
        source: new lt({
            label: "EMPTY"
        })
    });
    D.EMPTY.destroy = Ws;
    D.WHITE = new D({
        source: new vi({
            resource: new Uint8Array([
                255,
                255,
                255,
                255
            ]),
            width: 1,
            height: 1,
            alphaMode: "premultiply-alpha-on-upload",
            label: "WHITE"
        }),
        label: "WHITE"
    });
    D.WHITE.destroy = Ws;
    Tn = function(i, t, e) {
        const { width: s, height: r } = e.orig, n = e.trim;
        if (n) {
            const o = n.width, a = n.height;
            i.minX = n.x - t._x * s, i.maxX = i.minX + o, i.minY = n.y - t._y * r, i.maxY = i.minY + a;
        } else i.minX = -t._x * s, i.maxX = i.minX + s, i.minY = -t._y * r, i.maxY = i.minY + r;
    };
    const Wi = new k;
    ht = class {
        constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, r = -1 / 0){
            this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Wi, this.minX = t, this.minY = e, this.maxX = s, this.maxY = r;
        }
        isEmpty() {
            return this.minX > this.maxX || this.minY > this.maxY;
        }
        get rectangle() {
            this._rectangle || (this._rectangle = new j);
            const t = this._rectangle;
            return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
        }
        clear() {
            return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Wi, this;
        }
        set(t, e, s, r) {
            this.minX = t, this.minY = e, this.maxX = s, this.maxY = r;
        }
        addFrame(t, e, s, r, n) {
            n || (n = this.matrix);
            const o = n.a, a = n.b, h = n.c, l = n.d, c = n.tx, u = n.ty;
            let f = this.minX, d = this.minY, g = this.maxX, m = this.maxY, p = o * t + h * e + c, x = a * t + l * e + u;
            p < f && (f = p), x < d && (d = x), p > g && (g = p), x > m && (m = x), p = o * s + h * e + c, x = a * s + l * e + u, p < f && (f = p), x < d && (d = x), p > g && (g = p), x > m && (m = x), p = o * t + h * r + c, x = a * t + l * r + u, p < f && (f = p), x < d && (d = x), p > g && (g = p), x > m && (m = x), p = o * s + h * r + c, x = a * s + l * r + u, p < f && (f = p), x < d && (d = x), p > g && (g = p), x > m && (m = x), this.minX = f, this.minY = d, this.maxX = g, this.maxY = m;
        }
        addRect(t, e) {
            this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
        }
        addBounds(t, e) {
            this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
        }
        addBoundsMask(t) {
            this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
        }
        applyMatrix(t) {
            const e = this.minX, s = this.minY, r = this.maxX, n = this.maxY, { a: o, b: a, c: h, d: l, tx: c, ty: u } = t;
            let f = o * e + h * s + c, d = a * e + l * s + u;
            this.minX = f, this.minY = d, this.maxX = f, this.maxY = d, f = o * r + h * s + c, d = a * r + l * s + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * e + h * n + c, d = a * e + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * r + h * n + c, d = a * r + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY;
        }
        fit(t) {
            return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
        }
        fitBounds(t, e, s, r) {
            return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > r && (this.maxY = r), this;
        }
        pad(t, e = t) {
            return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
        }
        ceil() {
            return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
        }
        clone() {
            return new ht(this.minX, this.minY, this.maxX, this.maxY);
        }
        scale(t, e = t) {
            return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
        }
        get x() {
            return this.minX;
        }
        set x(t) {
            const e = this.maxX - this.minX;
            this.minX = t, this.maxX = t + e;
        }
        get y() {
            return this.minY;
        }
        set y(t) {
            const e = this.maxY - this.minY;
            this.minY = t, this.maxY = t + e;
        }
        get width() {
            return this.maxX - this.minX;
        }
        set width(t) {
            this.maxX = this.minX + t;
        }
        get height() {
            return this.maxY - this.minY;
        }
        set height(t) {
            this.maxY = this.minY + t;
        }
        get left() {
            return this.minX;
        }
        get right() {
            return this.maxX;
        }
        get top() {
            return this.minY;
        }
        get bottom() {
            return this.maxY;
        }
        get isPositive() {
            return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
        }
        get isValid() {
            return this.minX + this.minY !== 1 / 0;
        }
        addVertexData(t, e, s, r) {
            let n = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
            r || (r = this.matrix);
            const l = r.a, c = r.b, u = r.c, f = r.d, d = r.tx, g = r.ty;
            for(let m = e; m < s; m += 2){
                const p = t[m], x = t[m + 1], y = l * p + u * x + d, _ = c * p + f * x + g;
                n = y < n ? y : n, o = _ < o ? _ : o, a = y > a ? y : a, h = _ > h ? _ : h;
            }
            this.minX = n, this.minY = o, this.maxX = a, this.maxY = h;
        }
        containsPoint(t, e) {
            return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
        }
        toString() {
            return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
        }
        copyFrom(t) {
            return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
        }
    };
    var Mn = {
        grad: .9,
        turn: 360,
        rad: 360 / (2 * Math.PI)
    }, ft = function(i) {
        return typeof i == "string" ? i.length > 0 : typeof i == "number";
    }, $ = function(i, t, e) {
        return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * i) / e + 0;
    }, st = function(i, t, e) {
        return t === void 0 && (t = 0), e === void 0 && (e = 1), i > e ? e : i > t ? i : t;
    }, Js = function(i) {
        return (i = isFinite(i) ? i % 360 : 0) > 0 ? i : i + 360;
    }, $i = function(i) {
        return {
            r: st(i.r, 0, 255),
            g: st(i.g, 0, 255),
            b: st(i.b, 0, 255),
            a: st(i.a)
        };
    }, He = function(i) {
        return {
            r: $(i.r),
            g: $(i.g),
            b: $(i.b),
            a: $(i.a, 3)
        };
    }, Pn = /^#([0-9a-f]{3,8})$/i, xe = function(i) {
        var t = i.toString(16);
        return t.length < 2 ? "0" + t : t;
    }, tr = function(i) {
        var t = i.r, e = i.g, s = i.b, r = i.a, n = Math.max(t, e, s), o = n - Math.min(t, e, s), a = o ? n === t ? (e - s) / o : n === e ? 2 + (s - t) / o : 4 + (t - e) / o : 0;
        return {
            h: 60 * (a < 0 ? a + 6 : a),
            s: n ? o / n * 100 : 0,
            v: n / 255 * 100,
            a: r
        };
    }, er = function(i) {
        var t = i.h, e = i.s, s = i.v, r = i.a;
        t = t / 360 * 6, e /= 100, s /= 100;
        var n = Math.floor(t), o = s * (1 - e), a = s * (1 - (t - n) * e), h = s * (1 - (1 - t + n) * e), l = n % 6;
        return {
            r: 255 * [
                s,
                a,
                o,
                o,
                h,
                s
            ][l],
            g: 255 * [
                h,
                s,
                s,
                a,
                o,
                o
            ][l],
            b: 255 * [
                o,
                o,
                h,
                s,
                s,
                a
            ][l],
            a: r
        };
    }, ji = function(i) {
        return {
            h: Js(i.h),
            s: st(i.s, 0, 100),
            l: st(i.l, 0, 100),
            a: st(i.a)
        };
    }, qi = function(i) {
        return {
            h: $(i.h),
            s: $(i.s),
            l: $(i.l),
            a: $(i.a, 3)
        };
    }, Ki = function(i) {
        return er((e = (t = i).s, {
            h: t.h,
            s: (e *= ((s = t.l) < 50 ? s : 100 - s) / 100) > 0 ? 2 * e / (s + e) * 100 : 0,
            v: s + e,
            a: t.a
        }));
        var t, e, s;
    }, te = function(i) {
        return {
            h: (t = tr(i)).h,
            s: (r = (200 - (e = t.s)) * (s = t.v) / 100) > 0 && r < 200 ? e * s / 100 / (r <= 100 ? r : 200 - r) * 100 : 0,
            l: r / 2,
            a: t.a
        };
        var t, e, s, r;
    }, En = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Rn = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, In = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, kn = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, li = {
        string: [
            [
                function(i) {
                    var t = Pn.exec(i);
                    return t ? (i = t[1]).length <= 4 ? {
                        r: parseInt(i[0] + i[0], 16),
                        g: parseInt(i[1] + i[1], 16),
                        b: parseInt(i[2] + i[2], 16),
                        a: i.length === 4 ? $(parseInt(i[3] + i[3], 16) / 255, 2) : 1
                    } : i.length === 6 || i.length === 8 ? {
                        r: parseInt(i.substr(0, 2), 16),
                        g: parseInt(i.substr(2, 2), 16),
                        b: parseInt(i.substr(4, 2), 16),
                        a: i.length === 8 ? $(parseInt(i.substr(6, 2), 16) / 255, 2) : 1
                    } : null : null;
                },
                "hex"
            ],
            [
                function(i) {
                    var t = In.exec(i) || kn.exec(i);
                    return t ? t[2] !== t[4] || t[4] !== t[6] ? null : $i({
                        r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
                        g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
                        b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
                        a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
                    }) : null;
                },
                "rgb"
            ],
            [
                function(i) {
                    var t = En.exec(i) || Rn.exec(i);
                    if (!t) return null;
                    var e, s, r = ji({
                        h: (e = t[1], s = t[2], s === void 0 && (s = "deg"), Number(e) * (Mn[s] || 1)),
                        s: Number(t[3]),
                        l: Number(t[4]),
                        a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
                    });
                    return Ki(r);
                },
                "hsl"
            ]
        ],
        object: [
            [
                function(i) {
                    var t = i.r, e = i.g, s = i.b, r = i.a, n = r === void 0 ? 1 : r;
                    return ft(t) && ft(e) && ft(s) ? $i({
                        r: Number(t),
                        g: Number(e),
                        b: Number(s),
                        a: Number(n)
                    }) : null;
                },
                "rgb"
            ],
            [
                function(i) {
                    var t = i.h, e = i.s, s = i.l, r = i.a, n = r === void 0 ? 1 : r;
                    if (!ft(t) || !ft(e) || !ft(s)) return null;
                    var o = ji({
                        h: Number(t),
                        s: Number(e),
                        l: Number(s),
                        a: Number(n)
                    });
                    return Ki(o);
                },
                "hsl"
            ],
            [
                function(i) {
                    var t = i.h, e = i.s, s = i.v, r = i.a, n = r === void 0 ? 1 : r;
                    if (!ft(t) || !ft(e) || !ft(s)) return null;
                    var o = function(a) {
                        return {
                            h: Js(a.h),
                            s: st(a.s, 0, 100),
                            v: st(a.v, 0, 100),
                            a: st(a.a)
                        };
                    }({
                        h: Number(t),
                        s: Number(e),
                        v: Number(s),
                        a: Number(n)
                    });
                    return er(o);
                },
                "hsv"
            ]
        ]
    }, Zi = function(i, t) {
        for(var e = 0; e < t.length; e++){
            var s = t[e][0](i);
            if (s) return [
                s,
                t[e][1]
            ];
        }
        return [
            null,
            void 0
        ];
    }, Gn = function(i) {
        return typeof i == "string" ? Zi(i.trim(), li.string) : typeof i == "object" && i !== null ? Zi(i, li.object) : [
            null,
            void 0
        ];
    }, Ne = function(i, t) {
        var e = te(i);
        return {
            h: e.h,
            s: st(e.s + 100 * t, 0, 100),
            l: e.l,
            a: e.a
        };
    }, Ve = function(i) {
        return (299 * i.r + 587 * i.g + 114 * i.b) / 1e3 / 255;
    }, Qi = function(i, t) {
        var e = te(i);
        return {
            h: e.h,
            s: e.s,
            l: st(e.l + 100 * t, 0, 100),
            a: e.a
        };
    }, ci = function() {
        function i(t) {
            this.parsed = Gn(t)[0], this.rgba = this.parsed || {
                r: 0,
                g: 0,
                b: 0,
                a: 1
            };
        }
        return i.prototype.isValid = function() {
            return this.parsed !== null;
        }, i.prototype.brightness = function() {
            return $(Ve(this.rgba), 2);
        }, i.prototype.isDark = function() {
            return Ve(this.rgba) < .5;
        }, i.prototype.isLight = function() {
            return Ve(this.rgba) >= .5;
        }, i.prototype.toHex = function() {
            return t = He(this.rgba), e = t.r, s = t.g, r = t.b, o = (n = t.a) < 1 ? xe($(255 * n)) : "", "#" + xe(e) + xe(s) + xe(r) + o;
            var t, e, s, r, n, o;
        }, i.prototype.toRgb = function() {
            return He(this.rgba);
        }, i.prototype.toRgbString = function() {
            return t = He(this.rgba), e = t.r, s = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + s + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + s + ", " + r + ")";
            var t, e, s, r, n;
        }, i.prototype.toHsl = function() {
            return qi(te(this.rgba));
        }, i.prototype.toHslString = function() {
            return t = qi(te(this.rgba)), e = t.h, s = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + s + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + s + "%, " + r + "%)";
            var t, e, s, r, n;
        }, i.prototype.toHsv = function() {
            return t = tr(this.rgba), {
                h: $(t.h),
                s: $(t.s),
                v: $(t.v),
                a: $(t.a, 3)
            };
            var t;
        }, i.prototype.invert = function() {
            return ct({
                r: 255 - (t = this.rgba).r,
                g: 255 - t.g,
                b: 255 - t.b,
                a: t.a
            });
            var t;
        }, i.prototype.saturate = function(t) {
            return t === void 0 && (t = .1), ct(Ne(this.rgba, t));
        }, i.prototype.desaturate = function(t) {
            return t === void 0 && (t = .1), ct(Ne(this.rgba, -t));
        }, i.prototype.grayscale = function() {
            return ct(Ne(this.rgba, -1));
        }, i.prototype.lighten = function(t) {
            return t === void 0 && (t = .1), ct(Qi(this.rgba, t));
        }, i.prototype.darken = function(t) {
            return t === void 0 && (t = .1), ct(Qi(this.rgba, -t));
        }, i.prototype.rotate = function(t) {
            return t === void 0 && (t = 15), this.hue(this.hue() + t);
        }, i.prototype.alpha = function(t) {
            return typeof t == "number" ? ct({
                r: (e = this.rgba).r,
                g: e.g,
                b: e.b,
                a: t
            }) : $(this.rgba.a, 3);
            var e;
        }, i.prototype.hue = function(t) {
            var e = te(this.rgba);
            return typeof t == "number" ? ct({
                h: t,
                s: e.s,
                l: e.l,
                a: e.a
            }) : $(e.h);
        }, i.prototype.isEqual = function(t) {
            return this.toHex() === ct(t).toHex();
        }, i;
    }(), ct = function(i) {
        return i instanceof ci ? i : new ci(i);
    }, Ji = [], Bn = function(i) {
        i.forEach(function(t) {
            Ji.indexOf(t) < 0 && (t(ci, li), Ji.push(t));
        });
    };
    function Dn(i, t) {
        var e = {
            white: "#ffffff",
            bisque: "#ffe4c4",
            blue: "#0000ff",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            azure: "#f0ffff",
            whitesmoke: "#f5f5f5",
            papayawhip: "#ffefd5",
            plum: "#dda0dd",
            blanchedalmond: "#ffebcd",
            black: "#000000",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gainsboro: "#dcdcdc",
            cornsilk: "#fff8dc",
            cornflowerblue: "#6495ed",
            burlywood: "#deb887",
            aquamarine: "#7fffd4",
            beige: "#f5f5dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkkhaki: "#bdb76b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkgrey: "#a9a9a9",
            peachpuff: "#ffdab9",
            darkmagenta: "#8b008b",
            darkred: "#8b0000",
            darkorchid: "#9932cc",
            darkorange: "#ff8c00",
            darkslateblue: "#483d8b",
            gray: "#808080",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            wheat: "#f5deb3",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            ghostwhite: "#f8f8ff",
            darkviolet: "#9400d3",
            magenta: "#ff00ff",
            green: "#008000",
            dodgerblue: "#1e90ff",
            grey: "#808080",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            blueviolet: "#8a2be2",
            forestgreen: "#228b22",
            lawngreen: "#7cfc00",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            fuchsia: "#ff00ff",
            brown: "#a52a2a",
            maroon: "#800000",
            mediumblue: "#0000cd",
            lightcoral: "#f08080",
            darkturquoise: "#00ced1",
            lightcyan: "#e0ffff",
            ivory: "#fffff0",
            lightyellow: "#ffffe0",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            linen: "#faf0e6",
            mediumaquamarine: "#66cdaa",
            lemonchiffon: "#fffacd",
            lime: "#00ff00",
            khaki: "#f0e68c",
            mediumseagreen: "#3cb371",
            limegreen: "#32cd32",
            mediumspringgreen: "#00fa9a",
            lightskyblue: "#87cefa",
            lightblue: "#add8e6",
            midnightblue: "#191970",
            lightpink: "#ffb6c1",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            mintcream: "#f5fffa",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            navajowhite: "#ffdead",
            navy: "#000080",
            mediumvioletred: "#c71585",
            powderblue: "#b0e0e6",
            palegoldenrod: "#eee8aa",
            oldlace: "#fdf5e6",
            paleturquoise: "#afeeee",
            mediumturquoise: "#48d1cc",
            mediumorchid: "#ba55d3",
            rebeccapurple: "#663399",
            lightsteelblue: "#b0c4de",
            mediumslateblue: "#7b68ee",
            thistle: "#d8bfd8",
            tan: "#d2b48c",
            orchid: "#da70d6",
            mediumpurple: "#9370db",
            purple: "#800080",
            pink: "#ffc0cb",
            skyblue: "#87ceeb",
            springgreen: "#00ff7f",
            palegreen: "#98fb98",
            red: "#ff0000",
            yellow: "#ffff00",
            slateblue: "#6a5acd",
            lavenderblush: "#fff0f5",
            peru: "#cd853f",
            palevioletred: "#db7093",
            violet: "#ee82ee",
            teal: "#008080",
            slategray: "#708090",
            slategrey: "#708090",
            aliceblue: "#f0f8ff",
            darkseagreen: "#8fbc8f",
            darkolivegreen: "#556b2f",
            greenyellow: "#adff2f",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            tomato: "#ff6347",
            silver: "#c0c0c0",
            sienna: "#a0522d",
            lavender: "#e6e6fa",
            lightgreen: "#90ee90",
            orange: "#ffa500",
            orangered: "#ff4500",
            steelblue: "#4682b4",
            royalblue: "#4169e1",
            turquoise: "#40e0d0",
            yellowgreen: "#9acd32",
            salmon: "#fa8072",
            saddlebrown: "#8b4513",
            sandybrown: "#f4a460",
            rosybrown: "#bc8f8f",
            darksalmon: "#e9967a",
            lightgoldenrodyellow: "#fafad2",
            snow: "#fffafa",
            lightgrey: "#d3d3d3",
            lightgray: "#d3d3d3",
            dimgray: "#696969",
            dimgrey: "#696969",
            olivedrab: "#6b8e23",
            olive: "#808000"
        }, s = {};
        for(var r in e)s[e[r]] = r;
        var n = {};
        i.prototype.toName = function(o) {
            if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
            var a, h, l = s[this.toHex()];
            if (l) return l;
            if (o?.closest) {
                var c = this.toRgb(), u = 1 / 0, f = "black";
                if (!n.length) for(var d in e)n[d] = new i(e[d]).toRgb();
                for(var g in e){
                    var m = (a = c, h = n[g], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
                    m < u && (u = m, f = g);
                }
                return f;
            }
        }, t.string.push([
            function(o) {
                var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
                return h ? new i(h).toRgb() : null;
            },
            "name"
        ]);
    }
    Bn([
        Dn
    ]);
    const Dt = class jt {
        constructor(t = 16777215){
            this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
        }
        get red() {
            return this._components[0];
        }
        get green() {
            return this._components[1];
        }
        get blue() {
            return this._components[2];
        }
        get alpha() {
            return this._components[3];
        }
        setValue(t) {
            return this.value = t, this;
        }
        set value(t) {
            if (t instanceof jt) this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
            else {
                if (t === null) throw new Error("Cannot set Color#value to null");
                (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
            }
        }
        get value() {
            return this._value;
        }
        _cloneSource(t) {
            return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? {
                ...t
            } : t;
        }
        _isSourceEqual(t, e) {
            const s = typeof t;
            if (s !== typeof e) return !1;
            if (s === "number" || s === "string" || t instanceof Number) return t === e;
            if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e)) return t.length !== e.length ? !1 : t.every((n, o)=>n === e[o]);
            if (t !== null && e !== null) {
                const n = Object.keys(t), o = Object.keys(e);
                return n.length !== o.length ? !1 : n.every((a)=>t[a] === e[a]);
            }
            return t === e;
        }
        toRgba() {
            const [t, e, s, r] = this._components;
            return {
                r: t,
                g: e,
                b: s,
                a: r
            };
        }
        toRgb() {
            const [t, e, s] = this._components;
            return {
                r: t,
                g: e,
                b: s
            };
        }
        toRgbaString() {
            const [t, e, s] = this.toUint8RgbArray();
            return `rgba(${t},${e},${s},${this.alpha})`;
        }
        toUint8RgbArray(t) {
            const [e, s, r] = this._components;
            return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(r * 255), t;
        }
        toArray(t) {
            this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
            const [e, s, r, n] = this._components;
            return t[0] = e, t[1] = s, t[2] = r, t[3] = n, t;
        }
        toRgbArray(t) {
            this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
            const [e, s, r] = this._components;
            return t[0] = e, t[1] = s, t[2] = r, t;
        }
        toNumber() {
            return this._int;
        }
        toBgrNumber() {
            const [t, e, s] = this.toUint8RgbArray();
            return (s << 16) + (e << 8) + t;
        }
        toLittleEndianNumber() {
            const t = this._int;
            return (t >> 16) + (t & 65280) + ((t & 255) << 16);
        }
        multiply(t) {
            const [e, s, r, n] = jt._temp.setValue(t)._components;
            return this._components[0] *= e, this._components[1] *= s, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this;
        }
        premultiply(t, e = !0) {
            return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
        }
        toPremultiplied(t, e = !0) {
            if (t === 1) return (255 << 24) + this._int;
            if (t === 0) return e ? 0 : this._int;
            let s = this._int >> 16 & 255, r = this._int >> 8 & 255, n = this._int & 255;
            return e && (s = s * t + .5 | 0, r = r * t + .5 | 0, n = n * t + .5 | 0), (t * 255 << 24) + (s << 16) + (r << 8) + n;
        }
        toHex() {
            const t = this._int.toString(16);
            return `#${"000000".substring(0, 6 - t.length) + t}`;
        }
        toHexa() {
            const e = Math.round(this._components[3] * 255).toString(16);
            return this.toHex() + "00".substring(0, 2 - e.length) + e;
        }
        setAlpha(t) {
            return this._components[3] = this._clamp(t), this;
        }
        _normalize(t) {
            let e, s, r, n;
            if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
                const o = t;
                e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, r = (o & 255) / 255, n = 1;
            } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4) t = this._clamp(t), [e, s, r, n = 1] = t;
            else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4) t = this._clamp(t, 0, 255), [e, s, r, n = 255] = t, e /= 255, s /= 255, r /= 255, n /= 255;
            else if (typeof t == "string" || typeof t == "object") {
                if (typeof t == "string") {
                    const a = jt.HEX_PATTERN.exec(t);
                    a && (t = `#${a[2]}`);
                }
                const o = ct(t);
                o.isValid() && ({ r: e, g: s, b: r, a: n } = o.rgba, e /= 255, s /= 255, r /= 255);
            }
            if (e !== void 0) this._components[0] = e, this._components[1] = s, this._components[2] = r, this._components[3] = n, this._refreshInt();
            else throw new Error(`Unable to convert color ${t}`);
        }
        _refreshInt() {
            this._clamp(this._components);
            const [t, e, s] = this._components;
            this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0);
        }
        _clamp(t, e = 0, s = 1) {
            return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((r, n)=>{
                t[n] = Math.min(Math.max(r, e), s);
            }), t);
        }
        static isColorLike(t) {
            return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof jt || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
        }
    };
    Dt.shared = new Dt;
    Dt._temp = new Dt;
    Dt.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
    rt = Dt;
    const On = {
        cullArea: null,
        cullable: !1,
        cullableChildren: !0
    };
    let Ue = 0;
    const ts = 500;
    tt = function(...i) {
        Ue !== ts && (Ue++, Ue === ts ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i));
    };
    class Ti {
        constructor(t, e){
            this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
        }
        prepopulate(t) {
            for(let e = 0; e < t; e++)this._pool[this._index++] = new this._classType;
            this._count += t;
        }
        get(t) {
            let e;
            return this._index > 0 ? e = this._pool[--this._index] : e = new this._classType, e.init?.(t), e;
        }
        return(t) {
            t.reset?.(), this._pool[this._index++] = t;
        }
        get totalSize() {
            return this._count;
        }
        get totalFree() {
            return this._index;
        }
        get totalUsed() {
            return this._count - this._index;
        }
        clear() {
            this._pool.length = 0, this._index = 0;
        }
    }
    class Ln {
        constructor(){
            this._poolsByClass = new Map;
        }
        prepopulate(t, e) {
            this.getPool(t).prepopulate(e);
        }
        get(t, e) {
            return this.getPool(t).get(e);
        }
        return(t) {
            this.getPool(t.constructor).return(t);
        }
        getPool(t) {
            return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Ti(t)), this._poolsByClass.get(t);
        }
        stats() {
            const t = {};
            return this._poolsByClass.forEach((e)=>{
                const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
                t[s] = {
                    free: e.totalFree,
                    used: e.totalUsed,
                    size: e.totalSize
                };
            }), t;
        }
    }
    let Fn;
    pt = new Ln;
    Fn = {
        get isCachedAsTexture () {
            return !!this.renderGroup?.isCachedAsTexture;
        },
        cacheAsTexture (i) {
            typeof i == "boolean" && i === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(i === !0 ? {} : i));
        },
        updateCacheTexture () {
            this.renderGroup?.updateCacheTexture();
        },
        get cacheAsBitmap () {
            return this.isCachedAsTexture;
        },
        set cacheAsBitmap (i){
            B("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(i);
        }
    };
    Hn = function(i, t, e) {
        const s = i.length;
        let r;
        if (t >= s || e === 0) return;
        e = t + e > s ? s - t : e;
        const n = s - e;
        for(r = t; r < n; ++r)i[r] = i[r + e];
        i.length = n;
    };
    const Nn = {
        allowChildren: !0,
        removeChildren (i = 0, t) {
            const e = t ?? this.children.length, s = e - i, r = [];
            if (s > 0 && s <= e) {
                for(let o = e - 1; o >= i; o--){
                    const a = this.children[o];
                    a && (r.push(a), a.parent = null);
                }
                Hn(this.children, i, e);
                const n = this.renderGroup || this.parentRenderGroup;
                n && n.removeChildren(r);
                for(let o = 0; o < r.length; ++o){
                    const a = r[o];
                    a.parentRenderLayer?.detach(a), this.emit("childRemoved", a, this, o), r[o].emit("removed", this);
                }
                return r.length > 0 && this._didViewChangeTick++, r;
            } else if (s === 0 && this.children.length === 0) return r;
            throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
        },
        removeChildAt (i) {
            const t = this.getChildAt(i);
            return this.removeChild(t);
        },
        getChildAt (i) {
            if (i < 0 || i >= this.children.length) throw new Error(`getChildAt: Index (${i}) does not exist.`);
            return this.children[i];
        },
        setChildIndex (i, t) {
            if (t < 0 || t >= this.children.length) throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
            this.getChildIndex(i), this.addChildAt(i, t);
        },
        getChildIndex (i) {
            const t = this.children.indexOf(i);
            if (t === -1) throw new Error("The supplied Container must be a child of the caller");
            return t;
        },
        addChildAt (i, t) {
            this.allowChildren || B(W, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
            const { children: e } = this;
            if (t < 0 || t > e.length) throw new Error(`${i}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
            if (i.parent) {
                const r = i.parent.children.indexOf(i);
                if (i.parent === this && r === t) return i;
                r !== -1 && i.parent.children.splice(r, 1);
            }
            t === e.length ? e.push(i) : e.splice(t, 0, i), i.parent = this, i.didChange = !0, i._updateFlags = 15;
            const s = this.renderGroup || this.parentRenderGroup;
            return s && s.addChild(i), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", i, this, t), i.emit("added", this), i;
        },
        swapChildren (i, t) {
            if (i === t) return;
            const e = this.getChildIndex(i), s = this.getChildIndex(t);
            this.children[e] = t, this.children[s] = i;
            const r = this.renderGroup || this.parentRenderGroup;
            r && (r.structureDidChange = !0), this._didContainerChangeTick++;
        },
        removeFromParent () {
            this.parent?.removeChild(this);
        },
        reparentChild (...i) {
            return i.length === 1 ? this.reparentChildAt(i[0], this.children.length) : (i.forEach((t)=>this.reparentChildAt(t, this.children.length)), i[0]);
        },
        reparentChildAt (i, t) {
            if (i.parent === this) return this.setChildIndex(i, t), i;
            const e = i.worldTransform.clone();
            i.removeFromParent(), this.addChildAt(i, t);
            const s = this.worldTransform.clone();
            return s.invert(), e.prepend(s), i.setFromMatrix(e), i;
        },
        replaceChild (i, t) {
            i.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(i)), t.setFromMatrix(i.localTransform), t.updateLocalTransform(), this.removeChild(i);
        }
    }, Vn = {
        collectRenderables (i, t, e) {
            this.parentRenderLayer && this.parentRenderLayer !== e || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(i, t, e) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, i) : this.collectRenderablesWithEffects(i, t, e));
        },
        collectRenderablesSimple (i, t, e) {
            const s = this.children, r = s.length;
            for(let n = 0; n < r; n++)s[n].collectRenderables(i, t, e);
        },
        collectRenderablesWithEffects (i, t, e) {
            const { renderPipes: s } = t;
            for(let r = 0; r < this.effects.length; r++){
                const n = this.effects[r];
                s[n.pipe].push(n, this, i);
            }
            this.collectRenderablesSimple(i, t, e);
            for(let r = this.effects.length - 1; r >= 0; r--){
                const n = this.effects[r];
                s[n.pipe].pop(n, this, i);
            }
        }
    };
    es = class {
        constructor(){
            this.pipe = "filter", this.priority = 1;
        }
        destroy() {
            for(let t = 0; t < this.filters.length; t++)this.filters[t].destroy();
            this.filters = null, this.filterArea = null;
        }
    };
    class Un {
        constructor(){
            this._effectClasses = [], this._tests = [], this._initialized = !1;
        }
        init() {
            this._initialized || (this._initialized = !0, this._effectClasses.forEach((t)=>{
                this.add({
                    test: t.test,
                    maskClass: t
                });
            }));
        }
        add(t) {
            this._tests.push(t);
        }
        getMaskEffect(t) {
            this._initialized || this.init();
            for(let e = 0; e < this._tests.length; e++){
                const s = this._tests[e];
                if (s.test(t)) return pt.get(s.maskClass, t);
            }
            return t;
        }
        returnMaskEffect(t) {
            pt.return(t);
        }
    }
    const ui = new Un;
    nt.handleByList(G.MaskEffect, ui._effectClasses);
    const Yn = {
        _maskEffect: null,
        _maskOptions: {
            inverse: !1
        },
        _filterEffect: null,
        effects: [],
        _markStructureAsChanged () {
            const i = this.renderGroup || this.parentRenderGroup;
            i && (i.structureDidChange = !0);
        },
        addEffect (i) {
            this.effects.indexOf(i) === -1 && (this.effects.push(i), this.effects.sort((e, s)=>e.priority - s.priority), this._markStructureAsChanged(), this._updateIsSimple());
        },
        removeEffect (i) {
            const t = this.effects.indexOf(i);
            t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
        },
        set mask (i){
            const t = this._maskEffect;
            t?.mask !== i && (t && (this.removeEffect(t), ui.returnMaskEffect(t), this._maskEffect = null), i != null && (this._maskEffect = ui.getMaskEffect(i), this.addEffect(this._maskEffect)));
        },
        get mask () {
            return this._maskEffect?.mask;
        },
        setMask (i) {
            this._maskOptions = {
                ...this._maskOptions,
                ...i
            }, i.mask && (this.mask = i.mask), this._markStructureAsChanged();
        },
        set filters (i){
            !Array.isArray(i) && i && (i = [
                i
            ]);
            const t = this._filterEffect || (this._filterEffect = new es);
            i = i;
            const e = i?.length > 0, s = t.filters?.length > 0, r = e !== s;
            i = Array.isArray(i) ? i.slice(0) : i, t.filters = Object.freeze(i), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = i ?? null));
        },
        get filters () {
            return this._filterEffect?.filters;
        },
        set filterArea (i){
            this._filterEffect || (this._filterEffect = new es), this._filterEffect.filterArea = i;
        },
        get filterArea () {
            return this._filterEffect?.filterArea;
        }
    }, zn = {
        label: null,
        get name () {
            return B(W, "Container.name property has been removed, use Container.label instead"), this.label;
        },
        set name (i){
            B(W, "Container.name property has been removed, use Container.label instead"), this.label = i;
        },
        getChildByName (i, t = !1) {
            return this.getChildByLabel(i, t);
        },
        getChildByLabel (i, t = !1) {
            const e = this.children;
            for(let s = 0; s < e.length; s++){
                const r = e[s];
                if (r.label === i || i instanceof RegExp && i.test(r.label)) return r;
            }
            if (t) for(let s = 0; s < e.length; s++){
                const n = e[s].getChildByLabel(i, !0);
                if (n) return n;
            }
            return null;
        },
        getChildrenByLabel (i, t = !1, e = []) {
            const s = this.children;
            for(let r = 0; r < s.length; r++){
                const n = s[r];
                (n.label === i || i instanceof RegExp && i.test(n.label)) && e.push(n);
            }
            if (t) for(let r = 0; r < s.length; r++)s[r].getChildrenByLabel(i, !0, e);
            return e;
        }
    }, Z = new Ti(k), gt = new Ti(ht), Xn = new k, Wn = {
        getFastGlobalBounds (i, t) {
            t || (t = new ht), t.clear(), this._getGlobalBoundsRecursive(!!i, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
            const e = this.renderGroup || this.parentRenderGroup;
            return t.applyMatrix(e.worldTransform), t;
        },
        _getGlobalBoundsRecursive (i, t, e) {
            let s = t;
            if (i && this.parentRenderLayer && this.parentRenderLayer !== e || this.localDisplayStatus !== 7 || !this.measurable) return;
            const r = !!this.effects.length;
            if ((this.renderGroup || r) && (s = gt.get().clear()), this.boundsArea) t.addRect(this.boundsArea, this.worldTransform);
            else {
                if (this.renderPipeId) {
                    const o = this.bounds;
                    s.addFrame(o.minX, o.minY, o.maxX, o.maxY, this.groupTransform);
                }
                const n = this.children;
                for(let o = 0; o < n.length; o++)n[o]._getGlobalBoundsRecursive(i, s, e);
            }
            if (r) {
                let n = !1;
                const o = this.renderGroup || this.parentRenderGroup;
                for(let a = 0; a < this.effects.length; a++)this.effects[a].addBounds && (n || (n = !0, s.applyMatrix(o.worldTransform)), this.effects[a].addBounds(s, !0));
                n && (s.applyMatrix(o.worldTransform.copyTo(Xn).invert()), t.addBounds(s, this.relativeGroupTransform)), t.addBounds(s), gt.return(s);
            } else this.renderGroup && (t.addBounds(s, this.relativeGroupTransform), gt.return(s));
        }
    };
    ir = function(i, t, e) {
        e.clear();
        let s, r;
        return i.parent ? t ? s = i.parent.worldTransform : (r = Z.get().identity(), s = Mi(i, r)) : s = k.IDENTITY, sr(i, e, s, t), r && Z.return(r), e.isValid || e.set(0, 0, 0, 0), e;
    };
    function sr(i, t, e, s) {
        if (!i.visible || !i.measurable) return;
        let r;
        s ? r = i.worldTransform : (i.updateLocalTransform(), r = Z.get(), r.appendFrom(i.localTransform, e));
        const n = t, o = !!i.effects.length;
        if (o && (t = gt.get().clear()), i.boundsArea) t.addRect(i.boundsArea, r);
        else {
            i.bounds && (t.matrix = r, t.addBounds(i.bounds));
            for(let a = 0; a < i.children.length; a++)sr(i.children[a], t, r, s);
        }
        if (o) {
            for(let a = 0; a < i.effects.length; a++)i.effects[a].addBounds?.(t);
            n.addBounds(t, k.IDENTITY), gt.return(t);
        }
        s || Z.return(r);
    }
    function Mi(i, t) {
        const e = i.parent;
        return e && (Mi(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
    }
    function rr(i, t) {
        if (i === 16777215 || !t) return t;
        if (t === 16777215 || !i) return i;
        const e = i >> 16 & 255, s = i >> 8 & 255, r = i & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, h = e * n / 255 | 0, l = s * o / 255 | 0, c = r * a / 255 | 0;
        return (h << 16) + (l << 8) + c;
    }
    const is = 16777215;
    ss = function(i, t) {
        return i === is ? t : t === is ? i : rr(i, t);
    };
    function Re(i) {
        return ((i & 255) << 16) + (i & 65280) + (i >> 16 & 255);
    }
    const $n = {
        getGlobalAlpha (i) {
            if (i) return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
            let t = this.alpha, e = this.parent;
            for(; e;)t *= e.alpha, e = e.parent;
            return t;
        },
        getGlobalTransform (i, t) {
            if (t) return i.copyFrom(this.worldTransform);
            this.updateLocalTransform();
            const e = Mi(this, Z.get().identity());
            return i.appendFrom(this.localTransform, e), Z.return(e), i;
        },
        getGlobalTint (i) {
            if (i) return this.renderGroup ? Re(this.renderGroup.worldColor) : this.parentRenderGroup ? Re(ss(this.localColor, this.parentRenderGroup.worldColor)) : this.tint;
            let t = this.localColor, e = this.parent;
            for(; e;)t = ss(t, e.localColor), e = e.parent;
            return Re(t);
        }
    };
    nr = function(i, t, e) {
        return t.clear(), e || (e = k.IDENTITY), or(i, t, e, i, !0), t.isValid || t.set(0, 0, 0, 0), t;
    };
    function or(i, t, e, s, r) {
        let n;
        if (r) n = Z.get(), n = e.copyTo(n);
        else {
            if (!i.visible || !i.measurable) return;
            i.updateLocalTransform();
            const h = i.localTransform;
            n = Z.get(), n.appendFrom(h, e);
        }
        const o = t, a = !!i.effects.length;
        if (a && (t = gt.get().clear()), i.boundsArea) t.addRect(i.boundsArea, n);
        else {
            i.renderPipeId && (t.matrix = n, t.addBounds(i.bounds));
            const h = i.children;
            for(let l = 0; l < h.length; l++)or(h[l], t, n, s, !1);
        }
        if (a) {
            for(let h = 0; h < i.effects.length; h++)i.effects[h].addLocalBounds?.(t, s);
            o.addBounds(t, k.IDENTITY), gt.return(t);
        }
        Z.return(n);
    }
    function ar(i, t) {
        const e = i.children;
        for(let s = 0; s < e.length; s++){
            const r = e[s], n = r.uid, o = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, a = t.index;
            (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, r.children.length && ar(r, t);
        }
        return t.didChange;
    }
    const jn = new k, qn = {
        _localBoundsCacheId: -1,
        _localBoundsCacheData: null,
        _setWidth (i, t) {
            const e = Math.sign(this.scale.x) || 1;
            t !== 0 ? this.scale.x = i / t * e : this.scale.x = e;
        },
        _setHeight (i, t) {
            const e = Math.sign(this.scale.y) || 1;
            t !== 0 ? this.scale.y = i / t * e : this.scale.y = e;
        },
        getLocalBounds () {
            this._localBoundsCacheData || (this._localBoundsCacheData = {
                data: [],
                index: 1,
                didChange: !1,
                localBounds: new ht
            });
            const i = this._localBoundsCacheData;
            return i.index = 1, i.didChange = !1, i.data[0] !== this._didViewChangeTick && (i.didChange = !0, i.data[0] = this._didViewChangeTick), ar(this, i), i.didChange && nr(this, i.localBounds, jn), i.localBounds;
        },
        getBounds (i, t) {
            return ir(this, i, t || new ht);
        }
    }, Kn = {
        _onRender: null,
        set onRender (i){
            const t = this.renderGroup || this.parentRenderGroup;
            if (!i) {
                this._onRender && t?.removeOnRender(this), this._onRender = null;
                return;
            }
            this._onRender || t?.addOnRender(this), this._onRender = i;
        },
        get onRender () {
            return this._onRender;
        }
    }, Zn = {
        _zIndex: 0,
        sortDirty: !1,
        sortableChildren: !1,
        get zIndex () {
            return this._zIndex;
        },
        set zIndex (i){
            this._zIndex !== i && (this._zIndex = i, this.depthOfChildModified());
        },
        depthOfChildModified () {
            this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
        },
        sortChildren () {
            this.sortDirty && (this.sortDirty = !1, this.children.sort(Qn));
        }
    };
    function Qn(i, t) {
        return i._zIndex - t._zIndex;
    }
    const Jn = {
        getGlobalPosition (i = new K, t = !1) {
            return this.parent ? this.parent.toGlobal(this._position, i, t) : (i.x = this._position.x, i.y = this._position.y), i;
        },
        toGlobal (i, t, e = !1) {
            const s = this.getGlobalTransform(Z.get(), e);
            return t = s.apply(i, t), Z.return(s), t;
        },
        toLocal (i, t, e, s) {
            t && (i = t.toGlobal(i, e, s));
            const r = this.getGlobalTransform(Z.get(), s);
            return e = r.applyInverse(i, e), Z.return(r), e;
        }
    };
    class hr {
        constructor(){
            this.uid = z("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
        }
        reset() {
            this.instructionSize = 0;
        }
        add(t) {
            this.instructions[this.instructionSize++] = t;
        }
        log() {
            this.instructions.length = this.instructionSize, console.table(this.instructions, [
                "type",
                "action"
            ]);
        }
    }
    let to = 0;
    class eo {
        constructor(t){
            this._poolKeyHash = Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this.textureStyle = new Ks(this.textureOptions);
        }
        createTexture(t, e, s) {
            const r = new lt({
                ...this.textureOptions,
                width: t,
                height: e,
                resolution: 1,
                antialias: s,
                autoGarbageCollect: !1
            });
            return new D({
                source: r,
                label: `texturePool_${to++}`
            });
        }
        getOptimalTexture(t, e, s = 1, r) {
            let n = Math.ceil(t * s - 1e-6), o = Math.ceil(e * s - 1e-6);
            n = Ui(n), o = Ui(o);
            const a = (n << 17) + (o << 1) + (r ? 1 : 0);
            this._texturePool[a] || (this._texturePool[a] = []);
            let h = this._texturePool[a].pop();
            return h || (h = this.createTexture(n, o, r)), h.source._resolution = s, h.source.width = n / s, h.source.height = o / s, h.source.pixelWidth = n, h.source.pixelHeight = o, h.frame.x = 0, h.frame.y = 0, h.frame.width = t, h.frame.height = e, h.updateUvs(), this._poolKeyHash[h.uid] = a, h;
        }
        getSameSizeTexture(t, e = !1) {
            const s = t.source;
            return this.getOptimalTexture(t.width, t.height, s._resolution, e);
        }
        returnTexture(t, e = !1) {
            const s = this._poolKeyHash[t.uid];
            e && (t.source.style = this.textureStyle), this._texturePool[s].push(t);
        }
        clear(t) {
            if (t = t !== !1, t) for(const e in this._texturePool){
                const s = this._texturePool[e];
                if (s) for(let r = 0; r < s.length; r++)s[r].destroy(!0);
            }
            this._texturePool = {};
        }
    }
    io = new eo;
    class so {
        constructor(){
            this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new k, this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = {
                list: [],
                index: 0
            }, this.structureDidChange = !0, this.instructionSet = new hr, this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
        }
        init(t) {
            this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
            const e = t.children;
            for(let s = 0; s < e.length; s++){
                const r = e[s];
                r._updateFlags = 15, this.addChild(r);
            }
        }
        enableCacheAsTexture(t = {}) {
            this.textureOptions = t, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
        }
        disableCacheAsTexture() {
            this.isCachedAsTexture = !1, this.texture && (io.returnTexture(this.texture), this.texture = null);
        }
        updateCacheTexture() {
            this.textureNeedsUpdate = !0;
        }
        reset() {
            this.renderGroupChildren.length = 0;
            for(const t in this.childrenToUpdate){
                const e = this.childrenToUpdate[t];
                e.list.fill(null), e.index = 0;
            }
            this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
        }
        get localTransform() {
            return this.root.localTransform;
        }
        addRenderGroupChild(t) {
            t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
        }
        _removeRenderGroupChild(t) {
            const e = this.renderGroupChildren.indexOf(t);
            e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
        }
        addChild(t) {
            if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
                this.addRenderGroupChild(t.renderGroup);
                return;
            }
            t._onRender && this.addOnRender(t);
            const e = t.children;
            for(let s = 0; s < e.length; s++)this.addChild(e[s]);
        }
        removeChild(t) {
            if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
                this._removeRenderGroupChild(t.renderGroup);
                return;
            }
            const e = t.children;
            for(let s = 0; s < e.length; s++)this.removeChild(e[s]);
        }
        removeChildren(t) {
            for(let e = 0; e < t.length; e++)this.removeChild(t[e]);
        }
        onChildUpdate(t) {
            let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
            e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
                index: 0,
                list: []
            }), e.list[e.index++] = t;
        }
        updateRenderable(t) {
            t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
        }
        onChildViewUpdate(t) {
            this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
        }
        get isRenderable() {
            return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
        }
        addOnRender(t) {
            this._onRenderContainers.push(t);
        }
        removeOnRender(t) {
            this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
        }
        runOnRender(t) {
            for(let e = 0; e < this._onRenderContainers.length; e++)this._onRenderContainers[e]._onRender(t);
        }
        destroy() {
            this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
        }
        getChildren(t = []) {
            const e = this.root.children;
            for(let s = 0; s < e.length; s++)this._getChildren(e[s], t);
            return t;
        }
        _getChildren(t, e = []) {
            if (e.push(t), t.renderGroup) return e;
            const s = t.children;
            for(let r = 0; r < s.length; r++)this._getChildren(s[r], e);
            return e;
        }
        invalidateMatrices() {
            this._matrixDirty = 7;
        }
        get inverseWorldTransform() {
            return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new k), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
        }
        get textureOffsetInverseTransform() {
            return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new k), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(-this._textureBounds.x, -this._textureBounds.y)) : this._textureOffsetInverseTransform;
        }
        get inverseParentTextureTransform() {
            if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
            this._matrixDirty &= -5;
            const t = this._parentCacheAsTextureRenderGroup;
            return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new k), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(-t._textureBounds.x, -t._textureBounds.y)) : this.worldTransform;
        }
        get cacheToLocalTransform() {
            return this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
        }
    }
    function ro(i, t, e = {}) {
        for(const s in t)!e[s] && t[s] !== void 0 && (i[s] = t[s]);
    }
    let Ye, _e, ze, be;
    Ye = new q(null);
    _e = new q(null);
    ze = new q(null, 1, 1);
    be = new q(null);
    rs = 1;
    no = 2;
    Xe = 4;
    dt = class extends mt {
        constructor(t = {}){
            super(), this.uid = z("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new k, this.relativeGroupTransform = new k, this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new q(this, 0, 0), this._scale = ze, this._pivot = _e, this._origin = be, this._skew = Ye, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], ro(this, t, {
                children: !0,
                parent: !0,
                effects: !0
            }), t.children?.forEach((e)=>this.addChild(e)), t.parent?.addChild(this);
        }
        static mixin(t) {
            B("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), nt.mixin(dt, t);
        }
        set _didChangeId(t) {
            this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
        }
        get _didChangeId() {
            return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
        }
        addChild(...t) {
            if (this.allowChildren || B(W, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
                for(let r = 0; r < t.length; r++)this.addChild(t[r]);
                return t[0];
            }
            const e = t[0], s = this.renderGroup || this.parentRenderGroup;
            return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), s && (s.structureDidChange = !0), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15, s && s.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e);
        }
        removeChild(...t) {
            if (t.length > 1) {
                for(let r = 0; r < t.length; r++)this.removeChild(t[r]);
                return t[0];
            }
            const e = t[0], s = this.children.indexOf(e);
            return s > -1 && (this._didViewChangeTick++, this.children.splice(s, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parentRenderLayer && e.parentRenderLayer.detach(e), e.parent = null, this.emit("childRemoved", e, this, s), e.emit("removed", this)), e;
        }
        _onUpdate(t) {
            t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
        }
        set isRenderGroup(t) {
            !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
        }
        get isRenderGroup() {
            return !!this.renderGroup;
        }
        enableRenderGroup() {
            if (this.renderGroup) return;
            const t = this.parentRenderGroup;
            t?.removeChild(this), this.renderGroup = pt.get(so, this), this.groupTransform = k.IDENTITY, t?.addChild(this), this._updateIsSimple();
        }
        disableRenderGroup() {
            if (!this.renderGroup) return;
            const t = this.parentRenderGroup;
            t?.removeChild(this), pt.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t?.addChild(this), this._updateIsSimple();
        }
        _updateIsSimple() {
            this.isSimple = !this.renderGroup && this.effects.length === 0;
        }
        get worldTransform() {
            return this._worldTransform || (this._worldTransform = new k), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
        }
        get x() {
            return this._position.x;
        }
        set x(t) {
            this._position.x = t;
        }
        get y() {
            return this._position.y;
        }
        set y(t) {
            this._position.y = t;
        }
        get position() {
            return this._position;
        }
        set position(t) {
            this._position.copyFrom(t);
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(t) {
            this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
        }
        get angle() {
            return this.rotation * xn;
        }
        set angle(t) {
            this.rotation = t * _n;
        }
        get pivot() {
            return this._pivot === _e && (this._pivot = new q(this, 0, 0)), this._pivot;
        }
        set pivot(t) {
            this._pivot === _e && (this._pivot = new q(this, 0, 0), this._origin !== be && tt("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
        }
        get skew() {
            return this._skew === Ye && (this._skew = new q(this, 0, 0)), this._skew;
        }
        set skew(t) {
            this._skew === Ye && (this._skew = new q(this, 0, 0)), this._skew.copyFrom(t);
        }
        get scale() {
            return this._scale === ze && (this._scale = new q(this, 1, 1)), this._scale;
        }
        set scale(t) {
            this._scale === ze && (this._scale = new q(this, 0, 0)), typeof t == "string" && (t = parseFloat(t)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
        }
        get origin() {
            return this._origin === be && (this._origin = new q(this, 0, 0)), this._origin;
        }
        set origin(t) {
            this._origin === be && (this._origin = new q(this, 0, 0), this._pivot !== _e && tt("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._origin.set(t) : this._origin.copyFrom(t);
        }
        get width() {
            return Math.abs(this.scale.x * this.getLocalBounds().width);
        }
        set width(t) {
            const e = this.getLocalBounds().width;
            this._setWidth(t, e);
        }
        get height() {
            return Math.abs(this.scale.y * this.getLocalBounds().height);
        }
        set height(t) {
            const e = this.getLocalBounds().height;
            this._setHeight(t, e);
        }
        getSize(t) {
            t || (t = {});
            const e = this.getLocalBounds();
            return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
        }
        setSize(t, e) {
            const s = this.getLocalBounds();
            typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, s.width), e !== void 0 && this._setHeight(e, s.height);
        }
        _updateSkew() {
            const t = this._rotation, e = this._skew;
            this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
        }
        updateTransform(t) {
            return this.position.set(typeof t.x == "number" ? t.x : this.position.x, typeof t.y == "number" ? t.y : this.position.y), this.scale.set(typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x, typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(typeof t.skewX == "number" ? t.skewX : this.skew.x, typeof t.skewY == "number" ? t.skewY : this.skew.y), this.pivot.set(typeof t.pivotX == "number" ? t.pivotX : this.pivot.x, typeof t.pivotY == "number" ? t.pivotY : this.pivot.y), this.origin.set(typeof t.originX == "number" ? t.originX : this.origin.x, typeof t.originY == "number" ? t.originY : this.origin.y), this;
        }
        setFromMatrix(t) {
            t.decompose(this);
        }
        updateLocalTransform() {
            const t = this._didContainerChangeTick;
            if (this._didLocalTransformChangeId === t) return;
            this._didLocalTransformChangeId = t;
            const e = this.localTransform, s = this._scale, r = this._pivot, n = this._origin, o = this._position, a = s._x, h = s._y, l = r._x, c = r._y, u = -n._x, f = -n._y;
            e.a = this._cx * a, e.b = this._sx * a, e.c = this._cy * h, e.d = this._sy * h, e.tx = o._x - (l * e.a + c * e.c) + (u * e.a + f * e.c) - u * a, e.ty = o._y - (l * e.b + c * e.d) + (u * e.b + f * e.d) - f * h;
        }
        set alpha(t) {
            t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= rs, this._onUpdate());
        }
        get alpha() {
            return this.localAlpha;
        }
        set tint(t) {
            const s = rt.shared.setValue(t ?? 16777215).toBgrNumber();
            s !== this.localColor && (this.localColor = s, this._updateFlags |= rs, this._onUpdate());
        }
        get tint() {
            return Re(this.localColor);
        }
        set blendMode(t) {
            this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= no, this.localBlendMode = t, this._onUpdate());
        }
        get blendMode() {
            return this.localBlendMode;
        }
        get visible() {
            return !!(this.localDisplayStatus & 2);
        }
        set visible(t) {
            const e = t ? 2 : 0;
            (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Xe, this.localDisplayStatus ^= 2, this._onUpdate());
        }
        get culled() {
            return !(this.localDisplayStatus & 4);
        }
        set culled(t) {
            const e = t ? 0 : 4;
            (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Xe, this.localDisplayStatus ^= 4, this._onUpdate());
        }
        get renderable() {
            return !!(this.localDisplayStatus & 1);
        }
        set renderable(t) {
            const e = t ? 1 : 0;
            (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Xe, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
        }
        get isRenderable() {
            return this.localDisplayStatus === 7 && this.groupAlpha > 0;
        }
        destroy(t = !1) {
            if (this.destroyed) return;
            this.destroyed = !0;
            let e;
            if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t?.children) && e) for(let r = 0; r < e.length; ++r)e[r].destroy(t);
            this.renderGroup?.destroy(), this.renderGroup = null;
        }
    };
    nt.mixin(dt, Nn, Wn, Jn, Kn, qn, Yn, zn, Zn, On, Fn, $n, Vn);
    class lr extends dt {
        constructor(t){
            super(t), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = Object.create(null), this._bounds = new ht(0, 1, 0, 0), this._boundsDirty = !0;
        }
        get bounds() {
            return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds;
        }
        get roundPixels() {
            return !!this._roundPixels;
        }
        set roundPixels(t) {
            this._roundPixels = t ? 1 : 0;
        }
        containsPoint(t) {
            const e = this.bounds, { x: s, y: r } = t;
            return s >= e.minX && s <= e.maxX && r >= e.minY && r <= e.maxY;
        }
        onViewUpdate() {
            if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate) return;
            this.didViewUpdate = !0;
            const t = this.renderGroup || this.parentRenderGroup;
            t && t.onChildViewUpdate(this);
        }
        destroy(t) {
            super.destroy(t), this._bounds = null;
            for(const e in this._gpuData)this._gpuData[e].destroy?.();
            this._gpuData = null;
        }
        collectRenderablesSimple(t, e, s) {
            const { renderPipes: r } = e;
            r.blendMode.setBlendMode(this, this.groupBlendMode, t), r[this.renderPipeId].addRenderable(this, t), this.didViewUpdate = !1;
            const o = this.children, a = o.length;
            for(let h = 0; h < a; h++)o[h].collectRenderables(t, e, s);
        }
    }
    re = class extends lr {
        constructor(t = D.EMPTY){
            t instanceof D && (t = {
                texture: t
            });
            const { texture: e = D.EMPTY, anchor: s, roundPixels: r, width: n, height: o, ...a } = t;
            super({
                label: "Sprite",
                ...a
            }), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = {
                minX: 0,
                maxX: 1,
                minY: 0,
                maxY: 0
            }, this._anchor = new q({
                _onUpdate: ()=>{
                    this.onViewUpdate();
                }
            }), s ? this.anchor = s : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o);
        }
        static from(t, e = !1) {
            return t instanceof D ? new re(t) : new re(D.from(t, e));
        }
        set texture(t) {
            t || (t = D.EMPTY);
            const e = this._texture;
            e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
        }
        get texture() {
            return this._texture;
        }
        get visualBounds() {
            return Tn(this._visualBounds, this._anchor, this._texture), this._visualBounds;
        }
        get sourceBounds() {
            return B("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
        }
        updateBounds() {
            const t = this._anchor, e = this._texture, s = this._bounds, { width: r, height: n } = e.orig;
            s.minX = -t._x * r, s.maxX = s.minX + r, s.minY = -t._y * n, s.maxY = s.minY + n;
        }
        destroy(t = !1) {
            if (super.destroy(t), typeof t == "boolean" ? t : t?.texture) {
                const s = typeof t == "boolean" ? t : t?.textureSource;
                this._texture.destroy(s);
            }
            this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null, this._gpuData = null;
        }
        get anchor() {
            return this._anchor;
        }
        set anchor(t) {
            typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
        }
        get width() {
            return Math.abs(this.scale.x) * this._texture.orig.width;
        }
        set width(t) {
            this._setWidth(t, this._texture.orig.width), this._width = t;
        }
        get height() {
            return Math.abs(this.scale.y) * this._texture.orig.height;
        }
        set height(t) {
            this._setHeight(t, this._texture.orig.height), this._height = t;
        }
        getSize(t) {
            return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
        }
        setSize(t, e) {
            typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
        }
    };
    const oo = new ht;
    function cr(i, t, e) {
        const s = oo;
        i.measurable = !0, ir(i, e, s), t.addBoundsMask(s), i.measurable = !1;
    }
    function ur(i, t, e) {
        const s = gt.get();
        i.measurable = !0;
        const r = Z.get().identity(), n = dr(i, e, r);
        nr(i, s, n), i.measurable = !1, t.addBoundsMask(s), Z.return(r), gt.return(s);
    }
    function dr(i, t, e) {
        return i ? (i !== t && (dr(i.parent, t, e), i.updateLocalTransform(), e.append(i.localTransform)), e) : (tt("Mask bounds, renderable is not inside the root container"), e);
    }
    class fr {
        constructor(t){
            this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t?.mask && this.init(t.mask);
        }
        init(t) {
            this.mask = t, this.renderMaskToTexture = !(t instanceof re), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
        }
        reset() {
            this.mask.measurable = !0, this.mask = null;
        }
        addBounds(t, e) {
            this.inverse || cr(this.mask, t, e);
        }
        addLocalBounds(t, e) {
            ur(this.mask, t, e);
        }
        containsPoint(t, e) {
            const s = this.mask;
            return e(s, t);
        }
        destroy() {
            this.reset();
        }
        static test(t) {
            return t instanceof re;
        }
    }
    fr.extension = G.MaskEffect;
    class pr {
        constructor(t){
            this.priority = 0, this.pipe = "colorMask", t?.mask && this.init(t.mask);
        }
        init(t) {
            this.mask = t;
        }
        destroy() {}
        static test(t) {
            return typeof t == "number";
        }
    }
    pr.extension = G.MaskEffect;
    class gr {
        constructor(t){
            this.priority = 0, this.pipe = "stencilMask", t?.mask && this.init(t.mask);
        }
        init(t) {
            this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
        }
        reset() {
            this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null;
        }
        addBounds(t, e) {
            cr(this.mask, t, e);
        }
        addLocalBounds(t, e) {
            ur(this.mask, t, e);
        }
        containsPoint(t, e) {
            const s = this.mask;
            return e(s, t);
        }
        destroy() {
            this.reset();
        }
        static test(t) {
            return t instanceof dt;
        }
    }
    gr.extension = G.MaskEffect;
    const ao = {
        createCanvas: (i, t)=>{
            const e = document.createElement("canvas");
            return e.width = i, e.height = t, e;
        },
        getCanvasRenderingContext2D: ()=>CanvasRenderingContext2D,
        getWebGLRenderingContext: ()=>WebGLRenderingContext,
        getNavigator: ()=>navigator,
        getBaseUrl: ()=>document.baseURI ?? window.location.href,
        getFontFaceSet: ()=>document.fonts,
        fetch: (i, t)=>fetch(i, t),
        parseXML: (i)=>new DOMParser().parseFromString(i, "text/xml")
    };
    let ns = ao;
    Rt = {
        get () {
            return ns;
        },
        set (i) {
            ns = i;
        }
    };
    mr = class extends lt {
        constructor(t){
            t.resource || (t.resource = Rt.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
        }
        resizeCanvas() {
            this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
        }
        resize(t = this.width, e = this.height, s = this._resolution) {
            const r = super.resize(t, e, s);
            return r && this.resizeCanvas(), r;
        }
        static test(t) {
            return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
        }
        get context2D() {
            return this._context2D || (this._context2D = this.resource.getContext("2d"));
        }
    };
    mr.extension = G.TextureSource;
    ke = class extends lt {
        constructor(t){
            super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
        }
        static test(t) {
            return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
        }
    };
    ke.extension = G.TextureSource;
    di = ((i)=>(i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(di || {});
    class We {
        constructor(t, e = null, s = 0, r = !1){
            this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = s, this._once = r;
        }
        match(t, e = null) {
            return this._fn === t && this._context === e;
        }
        emit(t) {
            this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
            const e = this.next;
            return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
        }
        connect(t) {
            this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
        }
        destroy(t = !1) {
            this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
            const e = this.next;
            return this.next = t ? null : e, this.previous = null, e;
        }
    }
    const yr = class et {
        constructor(){
            this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new We(null, null, 1 / 0), this.deltaMS = 1 / et.targetFPMS, this.elapsedMS = 1 / et.targetFPMS, this._tick = (t)=>{
                this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
            };
        }
        _requestIfNeeded() {
            this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
        }
        _cancelIfNeeded() {
            this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
        }
        _startIfPossible() {
            this.started ? this._requestIfNeeded() : this.autoStart && this.start();
        }
        add(t, e, s = di.NORMAL) {
            return this._addListener(new We(t, e, s));
        }
        addOnce(t, e, s = di.NORMAL) {
            return this._addListener(new We(t, e, s, !0));
        }
        _addListener(t) {
            let e = this._head.next, s = this._head;
            if (!e) t.connect(s);
            else {
                for(; e;){
                    if (t.priority > e.priority) {
                        t.connect(s);
                        break;
                    }
                    s = e, e = e.next;
                }
                t.previous || t.connect(s);
            }
            return this._startIfPossible(), this;
        }
        remove(t, e) {
            let s = this._head.next;
            for(; s;)s.match(t, e) ? s = s.destroy() : s = s.next;
            return this._head.next || this._cancelIfNeeded(), this;
        }
        get count() {
            if (!this._head) return 0;
            let t = 0, e = this._head;
            for(; e = e.next;)t++;
            return t;
        }
        start() {
            this.started || (this.started = !0, this._requestIfNeeded());
        }
        stop() {
            this.started && (this.started = !1, this._cancelIfNeeded());
        }
        destroy() {
            if (!this._protected) {
                this.stop();
                let t = this._head.next;
                for(; t;)t = t.destroy(!0);
                this._head.destroy(), this._head = null;
            }
        }
        update(t = performance.now()) {
            let e;
            if (t > this.lastTime) {
                if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
                    const n = t - this._lastFrame | 0;
                    if (n < this._minElapsedMS) return;
                    this._lastFrame = t - n % this._minElapsedMS;
                }
                this.deltaMS = e, this.deltaTime = this.deltaMS * et.targetFPMS;
                const s = this._head;
                let r = s.next;
                for(; r;)r = r.emit(this);
                s.next || this._cancelIfNeeded();
            } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
            this.lastTime = t;
        }
        get FPS() {
            return 1e3 / this.elapsedMS;
        }
        get minFPS() {
            return 1e3 / this._maxElapsedMS;
        }
        set minFPS(t) {
            const e = Math.min(this.maxFPS, t), s = Math.min(Math.max(0, e) / 1e3, et.targetFPMS);
            this._maxElapsedMS = 1 / s;
        }
        get maxFPS() {
            return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
        }
        set maxFPS(t) {
            if (t === 0) this._minElapsedMS = 0;
            else {
                const e = Math.max(this.minFPS, t);
                this._minElapsedMS = 1 / (e / 1e3);
            }
        }
        static get shared() {
            if (!et._shared) {
                const t = et._shared = new et;
                t.autoStart = !0, t._protected = !0;
            }
            return et._shared;
        }
        static get system() {
            if (!et._system) {
                const t = et._system = new et;
                t.autoStart = !0, t._protected = !0;
            }
            return et._system;
        }
    };
    yr.targetFPMS = .06;
    let $e;
    we = yr;
    async function ho() {
        return $e ?? ($e = (async ()=>{
            const t = document.createElement("canvas").getContext("webgl");
            if (!t) return "premultiply-alpha-on-upload";
            const e = await new Promise((o)=>{
                const a = document.createElement("video");
                a.onloadeddata = ()=>o(a), a.onerror = ()=>o(null), a.autoplay = !1, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
            });
            if (!e) return "premultiply-alpha-on-upload";
            const s = t.createTexture();
            t.bindTexture(t.TEXTURE_2D, s);
            const r = t.createFramebuffer();
            t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, s, 0), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
            const n = new Uint8Array(4);
            return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(s), t.getExtension("WEBGL_lose_context")?.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
        })()), $e;
    }
    const Ge = class xr extends lt {
        constructor(t){
            super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
                ...xr.defaultOptions,
                ...t
            }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
        }
        updateFrame() {
            if (!this.destroyed) {
                if (this._updateFPS) {
                    const t = we.shared.elapsedMS * this.resource.playbackRate;
                    this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
                }
                (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
            }
        }
        _videoFrameRequestCallback() {
            this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback);
        }
        get isValid() {
            return !!this.resource.videoWidth && !!this.resource.videoHeight;
        }
        async load() {
            if (this._load) return this._load;
            const t = this.resource, e = this.options;
            return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await ho(), this._load = new Promise((s, r)=>{
                this.isValid ? s(this) : (this._resolve = s, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(()=>{
                    this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
                })), t.load());
            }), this._load;
        }
        _onError(t) {
            this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
        }
        _isSourcePlaying() {
            const t = this.resource;
            return !t.paused && !t.ended;
        }
        _isSourceReady() {
            return this.resource.readyState > 2;
        }
        _onPlayStart() {
            this.isValid || this._mediaReady(), this._configureAutoUpdate();
        }
        _onPlayStop() {
            this._configureAutoUpdate();
        }
        _onSeeked() {
            this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
        }
        _onCanPlay() {
            this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
        }
        _onCanPlayThrough() {
            this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
        }
        _mediaReady() {
            const t = this.resource;
            this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
        }
        destroy() {
            this._configureAutoUpdate();
            const t = this.resource;
            t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
        }
        get autoUpdate() {
            return this._autoUpdate;
        }
        set autoUpdate(t) {
            t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
        }
        get updateFPS() {
            return this._updateFPS;
        }
        set updateFPS(t) {
            t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
        }
        _configureAutoUpdate() {
            this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (we.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (we.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (we.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
        }
        static test(t) {
            return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
        }
    };
    Ge.extension = G.TextureSource;
    Ge.defaultOptions = {
        ...lt.defaultOptions,
        autoLoad: !0,
        autoPlay: !0,
        updateFPS: 0,
        crossorigin: !0,
        loop: !1,
        muted: !0,
        playsinline: !0,
        preload: !1
    };
    Ge.MIME_TYPES = {
        ogv: "video/ogg",
        mov: "video/quicktime",
        m4v: "video/mp4"
    };
    let lo = Ge;
    const Gt = (i, t, e = !1)=>(Array.isArray(i) || (i = [
            i
        ]), t ? i.map((s)=>typeof s == "string" || e ? t(s) : s) : i);
    class co {
        constructor(){
            this._parsers = [], this._cache = new Map, this._cacheMap = new Map;
        }
        reset() {
            this._cacheMap.clear(), this._cache.clear();
        }
        has(t) {
            return this._cache.has(t);
        }
        get(t) {
            const e = this._cache.get(t);
            return e || tt(`[Assets] Asset id ${t} was not found in the Cache`), e;
        }
        set(t, e) {
            const s = Gt(t);
            let r;
            for(let h = 0; h < this.parsers.length; h++){
                const l = this.parsers[h];
                if (l.test(e)) {
                    r = l.getCacheableAssets(s, e);
                    break;
                }
            }
            const n = new Map(Object.entries(r || {}));
            r || s.forEach((h)=>{
                n.set(h, e);
            });
            const o = [
                ...n.keys()
            ], a = {
                cacheKeys: o,
                keys: s
            };
            s.forEach((h)=>{
                this._cacheMap.set(h, a);
            }), o.forEach((h)=>{
                const l = r ? r[h] : e;
                this._cache.has(h) && this._cache.get(h) !== l && tt("[Cache] already has key:", h), this._cache.set(h, n.get(h));
            });
        }
        remove(t) {
            if (!this._cacheMap.has(t)) {
                tt(`[Assets] Asset id ${t} was not found in the Cache`);
                return;
            }
            const e = this._cacheMap.get(t);
            e.cacheKeys.forEach((r)=>{
                this._cache.delete(r);
            }), e.keys.forEach((r)=>{
                this._cacheMap.delete(r);
            });
        }
        get parsers() {
            return this._parsers;
        }
    }
    let fi;
    Bt = new co;
    fi = [];
    nt.handleByList(G.TextureSource, fi);
    function _r(i = {}) {
        const t = i && i.resource, e = t ? i.resource : i, s = t ? i : {
            resource: i
        };
        for(let r = 0; r < fi.length; r++){
            const n = fi[r];
            if (n.test(e)) return new n(s);
        }
        throw new Error(`Could not find a source type for resource: ${s.resource}`);
    }
    function uo(i = {}, t = !1) {
        const e = i && i.resource, s = e ? i.resource : i, r = e ? i : {
            resource: i
        };
        if (!t && Bt.has(s)) return Bt.get(s);
        const n = new D({
            source: _r(r)
        });
        return n.on("destroy", ()=>{
            Bt.has(s) && Bt.remove(s);
        }), t || Bt.set(s, n), n;
    }
    function fo(i, t = !1) {
        return typeof i == "string" ? Bt.get(i) : i instanceof lt ? new D({
            source: i
        }) : uo(i, t);
    }
    D.from = fo;
    lt.from = _r;
    nt.add(fr, pr, gr, lo, ke, mr, vi);
    var br = ((i)=>(i[i.Low = 0] = "Low", i[i.Normal = 1] = "Normal", i[i.High = 2] = "High", i))(br || {});
    function ot(i) {
        if (typeof i != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`);
    }
    function Yt(i) {
        return i.split("?")[0].split("#")[0];
    }
    function po(i) {
        return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function go(i, t, e) {
        return i.replace(new RegExp(po(t), "g"), e);
    }
    function mo(i, t) {
        let e = "", s = 0, r = -1, n = 0, o = -1;
        for(let a = 0; a <= i.length; ++a){
            if (a < i.length) o = i.charCodeAt(a);
            else {
                if (o === 47) break;
                o = 47;
            }
            if (o === 47) {
                if (!(r === a - 1 || n === 1)) if (r !== a - 1 && n === 2) {
                    if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
                        if (e.length > 2) {
                            const h = e.lastIndexOf("/");
                            if (h !== e.length - 1) {
                                h === -1 ? (e = "", s = 0) : (e = e.slice(0, h), s = e.length - 1 - e.lastIndexOf("/")), r = a, n = 0;
                                continue;
                            }
                        } else if (e.length === 2 || e.length === 1) {
                            e = "", s = 0, r = a, n = 0;
                            continue;
                        }
                    }
                    t && (e.length > 0 ? e += "/.." : e = "..", s = 2);
                } else e.length > 0 ? e += `/${i.slice(r + 1, a)}` : e = i.slice(r + 1, a), s = a - r - 1;
                r = a, n = 0;
            } else o === 46 && n !== -1 ? ++n : n = -1;
        }
        return e;
    }
    const ne = {
        toPosix (i) {
            return go(i, "\\", "/");
        },
        isUrl (i) {
            return /^https?:/.test(this.toPosix(i));
        },
        isDataUrl (i) {
            return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(i);
        },
        isBlobUrl (i) {
            return i.startsWith("blob:");
        },
        hasProtocol (i) {
            return /^[^/:]+:/.test(this.toPosix(i));
        },
        getProtocol (i) {
            ot(i), i = this.toPosix(i);
            const t = /^file:\/\/\//.exec(i);
            if (t) return t[0];
            const e = /^[^/:]+:\/{0,2}/.exec(i);
            return e ? e[0] : "";
        },
        toAbsolute (i, t, e) {
            if (ot(i), this.isDataUrl(i) || this.isBlobUrl(i)) return i;
            const s = Yt(this.toPosix(t ?? Rt.get().getBaseUrl())), r = Yt(this.toPosix(e ?? this.rootname(s)));
            return i = this.toPosix(i), i.startsWith("/") ? ne.join(r, i.slice(1)) : this.isAbsolute(i) ? i : this.join(s, i);
        },
        normalize (i) {
            if (ot(i), i.length === 0) return ".";
            if (this.isDataUrl(i) || this.isBlobUrl(i)) return i;
            i = this.toPosix(i);
            let t = "";
            const e = i.startsWith("/");
            this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
            const s = i.endsWith("/");
            return i = mo(i, !1), i.length > 0 && s && (i += "/"), e ? `/${i}` : t + i;
        },
        isAbsolute (i) {
            return ot(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/");
        },
        join (...i) {
            if (i.length === 0) return ".";
            let t;
            for(let e = 0; e < i.length; ++e){
                const s = i[e];
                if (ot(s), s.length > 0) if (t === void 0) t = s;
                else {
                    const r = i[e - 1] ?? "";
                    this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${s}` : t += `/${s}`;
                }
            }
            return t === void 0 ? "." : this.normalize(t);
        },
        dirname (i) {
            if (ot(i), i.length === 0) return ".";
            i = this.toPosix(i);
            let t = i.charCodeAt(0);
            const e = t === 47;
            let s = -1, r = !0;
            const n = this.getProtocol(i), o = i;
            i = i.slice(n.length);
            for(let a = i.length - 1; a >= 1; --a)if (t = i.charCodeAt(a), t === 47) {
                if (!r) {
                    s = a;
                    break;
                }
            } else r = !1;
            return s === -1 ? e ? "/" : this.isUrl(o) ? n + i : n : e && s === 1 ? "//" : n + i.slice(0, s);
        },
        rootname (i) {
            ot(i), i = this.toPosix(i);
            let t = "";
            if (i.startsWith("/") ? t = "/" : t = this.getProtocol(i), this.isUrl(i)) {
                const e = i.indexOf("/", t.length);
                e !== -1 ? t = i.slice(0, e) : t = i, t.endsWith("/") || (t += "/");
            }
            return t;
        },
        basename (i, t) {
            ot(i), t && ot(t), i = Yt(this.toPosix(i));
            let e = 0, s = -1, r = !0, n;
            if (t !== void 0 && t.length > 0 && t.length <= i.length) {
                if (t.length === i.length && t === i) return "";
                let o = t.length - 1, a = -1;
                for(n = i.length - 1; n >= 0; --n){
                    const h = i.charCodeAt(n);
                    if (h === 47) {
                        if (!r) {
                            e = n + 1;
                            break;
                        }
                    } else a === -1 && (r = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (s = n) : (o = -1, s = a));
                }
                return e === s ? s = a : s === -1 && (s = i.length), i.slice(e, s);
            }
            for(n = i.length - 1; n >= 0; --n)if (i.charCodeAt(n) === 47) {
                if (!r) {
                    e = n + 1;
                    break;
                }
            } else s === -1 && (r = !1, s = n + 1);
            return s === -1 ? "" : i.slice(e, s);
        },
        extname (i) {
            ot(i), i = Yt(this.toPosix(i));
            let t = -1, e = 0, s = -1, r = !0, n = 0;
            for(let o = i.length - 1; o >= 0; --o){
                const a = i.charCodeAt(o);
                if (a === 47) {
                    if (!r) {
                        e = o + 1;
                        break;
                    }
                    continue;
                }
                s === -1 && (r = !1, s = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
            }
            return t === -1 || s === -1 || n === 0 || n === 1 && t === s - 1 && t === e + 1 ? "" : i.slice(t, s);
        },
        parse (i) {
            ot(i);
            const t = {
                root: "",
                dir: "",
                base: "",
                ext: "",
                name: ""
            };
            if (i.length === 0) return t;
            i = Yt(this.toPosix(i));
            let e = i.charCodeAt(0);
            const s = this.isAbsolute(i);
            let r;
            t.root = this.rootname(i), s || this.hasProtocol(i) ? r = 1 : r = 0;
            let n = -1, o = 0, a = -1, h = !0, l = i.length - 1, c = 0;
            for(; l >= r; --l){
                if (e = i.charCodeAt(l), e === 47) {
                    if (!h) {
                        o = l + 1;
                        break;
                    }
                    continue;
                }
                a === -1 && (h = !1, a = l + 1), e === 46 ? n === -1 ? n = l : c !== 1 && (c = 1) : n !== -1 && (c = -1);
            }
            return n === -1 || a === -1 || c === 0 || c === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && s ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && s ? (t.name = i.slice(1, n), t.base = i.slice(1, a)) : (t.name = i.slice(o, n), t.base = i.slice(o, a)), t.ext = i.slice(n, a)), t.dir = this.dirname(i), t;
        },
        sep: "/",
        delimiter: ":",
        joinExtensions: [
            ".html"
        ]
    };
    function wr(i, t, e, s, r) {
        const n = t[e];
        for(let o = 0; o < n.length; o++){
            const a = n[o];
            e < t.length - 1 ? wr(i.replace(s[e], a), t, e + 1, s, r) : r.push(i.replace(s[e], a));
        }
    }
    function yo(i) {
        const t = /\{(.*?)\}/g, e = i.match(t), s = [];
        if (e) {
            const r = [];
            e.forEach((n)=>{
                const o = n.substring(1, n.length - 1).split(",");
                r.push(o);
            }), wr(i, r, 0, e, s);
        } else s.push(i);
        return s;
    }
    const os = (i)=>!Array.isArray(i);
    class Cr {
        constructor(){
            this._defaultBundleIdentifierOptions = {
                connector: "-",
                createBundleAssetId: (t, e)=>`${t}${this._bundleIdConnector}${e}`,
                extractAssetIdFromBundle: (t, e)=>e.replace(`${t}${this._bundleIdConnector}`, "")
            }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
        }
        setBundleIdentifier(t) {
            if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
        }
        prefer(...t) {
            t.forEach((e)=>{
                this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
            }), this._resolverHash = {};
        }
        set basePath(t) {
            this._basePath = t;
        }
        get basePath() {
            return this._basePath;
        }
        set rootPath(t) {
            this._rootPath = t;
        }
        get rootPath() {
            return this._rootPath;
        }
        get parsers() {
            return this._parsers;
        }
        reset() {
            this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
        }
        setDefaultSearchParams(t) {
            if (typeof t == "string") this._defaultSearchParams = t;
            else {
                const e = t;
                this._defaultSearchParams = Object.keys(e).map((s)=>`${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&");
            }
        }
        getAlias(t) {
            const { alias: e, src: s } = t;
            return Gt(e || s, (n)=>typeof n == "string" ? n : Array.isArray(n) ? n.map((o)=>o?.src ?? o) : n?.src ? n.src : n, !0);
        }
        addManifest(t) {
            this._manifest && tt("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e)=>{
                this.addBundle(e.name, e.assets);
            });
        }
        addBundle(t, e) {
            const s = [];
            let r = e;
            Array.isArray(e) || (r = Object.entries(e).map(([n, o])=>typeof o == "string" || Array.isArray(o) ? {
                    alias: n,
                    src: o
                } : {
                    alias: n,
                    ...o
                })), r.forEach((n)=>{
                const o = n.src, a = n.alias;
                let h;
                if (typeof a == "string") {
                    const l = this._createBundleAssetId(t, a);
                    s.push(l), h = [
                        a,
                        l
                    ];
                } else {
                    const l = a.map((c)=>this._createBundleAssetId(t, c));
                    s.push(...l), h = [
                        ...a,
                        ...l
                    ];
                }
                this.add({
                    ...n,
                    alias: h,
                    src: o
                });
            }), this._bundles[t] = s;
        }
        add(t) {
            const e = [];
            Array.isArray(t) ? e.push(...t) : e.push(t);
            let s;
            s = (n)=>{
                this.hasKey(n) && tt(`[Resolver] already has key: ${n} overwriting`);
            }, Gt(e).forEach((n)=>{
                const { src: o } = n;
                let { data: a, format: h, loadParser: l } = n;
                const c = Gt(o).map((d)=>typeof d == "string" ? yo(d) : Array.isArray(d) ? d : [
                        d
                    ]), u = this.getAlias(n);
                Array.isArray(u) ? u.forEach(s) : s(u);
                const f = [];
                c.forEach((d)=>{
                    d.forEach((g)=>{
                        let m = {};
                        if (typeof g != "object") {
                            m.src = g;
                            for(let p = 0; p < this._parsers.length; p++){
                                const x = this._parsers[p];
                                if (x.test(g)) {
                                    m = x.parse(g);
                                    break;
                                }
                            }
                        } else a = g.data ?? a, h = g.format ?? h, l = g.loadParser ?? l, m = {
                            ...m,
                            ...g
                        };
                        if (!u) throw new Error(`[Resolver] alias is undefined for this asset: ${m.src}`);
                        m = this._buildResolvedAsset(m, {
                            aliases: u,
                            data: a,
                            format: h,
                            loadParser: l
                        }), f.push(m);
                    });
                }), u.forEach((d)=>{
                    this._assetMap[d] = f;
                });
            });
        }
        resolveBundle(t) {
            const e = os(t);
            t = Gt(t);
            const s = {};
            return t.forEach((r)=>{
                const n = this._bundles[r];
                if (n) {
                    const o = this.resolve(n), a = {};
                    for(const h in o){
                        const l = o[h];
                        a[this._extractAssetIdFromBundle(r, h)] = l;
                    }
                    s[r] = a;
                }
            }), e ? s[t[0]] : s;
        }
        resolveUrl(t) {
            const e = this.resolve(t);
            if (typeof t != "string") {
                const s = {};
                for(const r in e)s[r] = e[r].src;
                return s;
            }
            return e.src;
        }
        resolve(t) {
            const e = os(t);
            t = Gt(t);
            const s = {};
            return t.forEach((r)=>{
                if (!this._resolverHash[r]) if (this._assetMap[r]) {
                    let n = this._assetMap[r];
                    const o = this._getPreferredOrder(n);
                    o?.priority.forEach((a)=>{
                        o.params[a].forEach((h)=>{
                            const l = n.filter((c)=>c[a] ? c[a] === h : !1);
                            l.length && (n = l);
                        });
                    }), this._resolverHash[r] = n[0];
                } else this._resolverHash[r] = this._buildResolvedAsset({
                    alias: [
                        r
                    ],
                    src: r
                }, {});
                s[r] = this._resolverHash[r];
            }), e ? s[t[0]] : s;
        }
        hasKey(t) {
            return !!this._assetMap[t];
        }
        hasBundle(t) {
            return !!this._bundles[t];
        }
        _getPreferredOrder(t) {
            for(let e = 0; e < t.length; e++){
                const s = t[e], r = this._preferredOrder.find((n)=>n.params.format.includes(s.format));
                if (r) return r;
            }
            return this._preferredOrder[0];
        }
        _appendDefaultSearchParams(t) {
            if (!this._defaultSearchParams) return t;
            const e = /\?/.test(t) ? "&" : "?";
            return `${t}${e}${this._defaultSearchParams}`;
        }
        _buildResolvedAsset(t, e) {
            const { aliases: s, data: r, loadParser: n, format: o } = e;
            return (this._basePath || this._rootPath) && (t.src = ne.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = s ?? t.alias ?? [
                t.src
            ], t.src = this._appendDefaultSearchParams(t.src), t.data = {
                ...r || {},
                ...t.data
            }, t.loadParser = n ?? t.loadParser, t.format = o ?? t.format ?? xo(t.src), t;
        }
    }
    Cr.RETINA_PREFIX = /@([0-9\.]+)x/;
    function xo(i) {
        return i.split(".").pop().split("?").shift().split("#").shift();
    }
    const as = (i, t)=>{
        const e = t.split("?")[1];
        return e && (i += `?${e}`), i;
    }, Sr = class qt {
        constructor(t, e){
            this.linkedSheets = [];
            let s = t;
            t?.source instanceof lt && (s = {
                texture: t,
                data: e
            });
            const { texture: r, data: n, cachePrefix: o = "" } = s;
            this.cachePrefix = o, this._texture = r instanceof D ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = n;
            const a = parseFloat(n.meta.scale);
            a ? (this.resolution = a, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
        }
        parse() {
            return new Promise((t)=>{
                this._callback = t, this._batchIndex = 0, this._frameKeys.length <= qt.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
            });
        }
        _processFrames(t) {
            let e = t;
            const s = qt.BATCH_SIZE;
            for(; e - t < s && e < this._frameKeys.length;){
                const r = this._frameKeys[e], n = this._frames[r], o = n.frame;
                if (o) {
                    let a = null, h = null;
                    const l = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, c = new j(0, 0, Math.floor(l.w) / this.resolution, Math.floor(l.h) / this.resolution);
                    n.rotated ? a = new j(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.h) / this.resolution, Math.floor(o.w) / this.resolution) : a = new j(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution), n.trimmed !== !1 && n.spriteSourceSize && (h = new j(Math.floor(n.spriteSourceSize.x) / this.resolution, Math.floor(n.spriteSourceSize.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution)), this.textures[r] = new D({
                        source: this.textureSource,
                        frame: a,
                        orig: c,
                        trim: h,
                        rotate: n.rotated ? 2 : 0,
                        defaultAnchor: n.anchor,
                        defaultBorders: n.borders,
                        label: r.toString()
                    });
                }
                e++;
            }
        }
        _processAnimations() {
            const t = this.data.animations || {};
            for(const e in t){
                this.animations[e] = [];
                for(let s = 0; s < t[e].length; s++){
                    const r = t[e][s];
                    this.animations[e].push(this.textures[r]);
                }
            }
        }
        _parseComplete() {
            const t = this._callback;
            this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
        }
        _nextBatch() {
            this._processFrames(this._batchIndex * qt.BATCH_SIZE), this._batchIndex++, setTimeout(()=>{
                this._batchIndex * qt.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
            }, 0);
        }
        destroy(t = !1) {
            for(const e in this.textures)this.textures[e].destroy();
            this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && (this._texture?.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
        }
    };
    Sr.BATCH_SIZE = 1e3;
    let hs = Sr;
    const _o = [
        "jpg",
        "png",
        "jpeg",
        "avif",
        "webp",
        "basis",
        "etc2",
        "bc7",
        "bc6h",
        "bc5",
        "bc4",
        "bc3",
        "bc2",
        "bc1",
        "eac",
        "astc"
    ];
    function Ar(i, t, e) {
        const s = {};
        if (i.forEach((r)=>{
            s[r] = t;
        }), Object.keys(t.textures).forEach((r)=>{
            s[`${t.cachePrefix}${r}`] = t.textures[r];
        }), !e) {
            const r = ne.dirname(i[0]);
            t.linkedSheets.forEach((n, o)=>{
                const a = Ar([
                    `${r}/${t.data.meta.related_multi_packs[o]}`
                ], n, !0);
                Object.assign(s, a);
            });
        }
        return s;
    }
    const bo = {
        extension: G.Asset,
        cache: {
            test: (i)=>i instanceof hs,
            getCacheableAssets: (i, t)=>Ar(i, t, !1)
        },
        resolver: {
            extension: {
                type: G.ResolveParser,
                name: "resolveSpritesheet"
            },
            test: (i)=>{
                const e = i.split("?")[0].split("."), s = e.pop(), r = e.pop();
                return s === "json" && _o.includes(r);
            },
            parse: (i)=>{
                const t = i.split(".");
                return {
                    resolution: parseFloat(Cr.RETINA_PREFIX.exec(i)?.[1] ?? "1"),
                    format: t[t.length - 2],
                    src: i
                };
            }
        },
        loader: {
            name: "spritesheetLoader",
            extension: {
                type: G.LoadParser,
                priority: br.Normal,
                name: "spritesheetLoader"
            },
            async testParse (i, t) {
                return ne.extname(t.src).toLowerCase() === ".json" && !!i.frames;
            },
            async parse (i, t, e) {
                const { texture: s, imageFilename: r, textureOptions: n, cachePrefix: o } = t?.data ?? {};
                let a = ne.dirname(t.src);
                a && a.lastIndexOf("/") !== a.length - 1 && (a += "/");
                let h;
                if (s instanceof D) h = s;
                else {
                    const u = as(a + (r ?? i.meta.image), t.src);
                    h = (await e.load([
                        {
                            src: u,
                            data: n
                        }
                    ]))[u];
                }
                const l = new hs({
                    texture: h.source,
                    data: i,
                    cachePrefix: o
                });
                await l.parse();
                const c = i?.meta?.related_multi_packs;
                if (Array.isArray(c)) {
                    const u = [];
                    for (const d of c){
                        if (typeof d != "string") continue;
                        let g = a + d;
                        t.data?.ignoreMultiPack || (g = as(g, t.src), u.push(e.load({
                            src: g,
                            data: {
                                textureOptions: n,
                                ignoreMultiPack: !0
                            }
                        })));
                    }
                    const f = await Promise.all(u);
                    l.linkedSheets = f, f.forEach((d)=>{
                        d.linkedSheets = [
                            l
                        ].concat(l.linkedSheets.filter((g)=>g !== d));
                    });
                }
                return l;
            },
            async unload (i, t, e) {
                await e.unload(i.textureSource._sourceOrigin), i.destroy(!1);
            }
        }
    };
    nt.add(bo);
    const je = Object.create(null), ls = Object.create(null);
    Pi = function(i, t) {
        let e = ls[i];
        return e === void 0 && (je[t] === void 0 && (je[t] = 1), ls[i] = e = je[t]++), e;
    };
    let Ce;
    function vr() {
        return (!Ce || Ce?.isContextLost()) && (Ce = Rt.get().createCanvas().getContext("webgl", {})), Ce;
    }
    let Se;
    function wo() {
        if (!Se) {
            Se = "mediump";
            const i = vr();
            i && i.getShaderPrecisionFormat && (Se = i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision ? "highp" : "mediump");
        }
        return Se;
    }
    function Co(i, t, e) {
        return t ? i : e ? (i = i.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${i}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${i}
        `;
    }
    function So(i, t, e) {
        const s = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
        if (i.substring(0, 9) !== "precision") {
            let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
            return r === "highp" && s !== "highp" && (r = "mediump"), `precision ${r} float;
${i}`;
        } else if (s !== "highp" && i.substring(0, 15) === "precision highp") return i.replace("precision highp", "precision mediump");
        return i;
    }
    function Ao(i, t) {
        return t ? `#version 300 es
${i}` : i;
    }
    const vo = {}, To = {};
    function Mo(i, { name: t = "pixi-program" }, e = !0) {
        t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
        const s = e ? vo : To;
        return s[t] ? (s[t]++, t += `-${s[t]}`) : s[t] = 1, i.indexOf("#define SHADER_NAME") !== -1 ? i : `${`#define SHADER_NAME ${t}`}
${i}`;
    }
    function Po(i, t) {
        return t ? i.replace("#version 300 es", "") : i;
    }
    const qe = {
        stripVersion: Po,
        ensurePrecision: So,
        addProgramDefines: Co,
        setProgramName: Mo,
        insertVersion: Ao
    }, Ke = Object.create(null), Tr = class pi {
        constructor(t){
            t = {
                ...pi.defaultOptions,
                ...t
            };
            const e = t.fragment.indexOf("#version 300 es") !== -1, s = {
                stripVersion: e,
                ensurePrecision: {
                    requestedFragmentPrecision: t.preferredFragmentPrecision,
                    requestedVertexPrecision: t.preferredVertexPrecision,
                    maxSupportedVertexPrecision: "highp",
                    maxSupportedFragmentPrecision: wo()
                },
                setProgramName: {
                    name: t.name
                },
                addProgramDefines: e,
                insertVersion: e
            };
            let r = t.fragment, n = t.vertex;
            Object.keys(qe).forEach((o)=>{
                const a = s[o];
                r = qe[o](r, a, !0), n = qe[o](n, a, !1);
            }), this.fragment = r, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = Pi(`${this.vertex}:${this.fragment}`, "gl-program");
        }
        destroy() {
            this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null;
        }
        static from(t) {
            const e = `${t.vertex}:${t.fragment}`;
            return Ke[e] || (Ke[e] = new pi(t)), Ke[e];
        }
    };
    Tr.defaultOptions = {
        preferredVertexPrecision: "highp",
        preferredFragmentPrecision: "mediump"
    };
    Mr = Tr;
    const cs = {
        uint8x2: {
            size: 2,
            stride: 2,
            normalised: !1
        },
        uint8x4: {
            size: 4,
            stride: 4,
            normalised: !1
        },
        sint8x2: {
            size: 2,
            stride: 2,
            normalised: !1
        },
        sint8x4: {
            size: 4,
            stride: 4,
            normalised: !1
        },
        unorm8x2: {
            size: 2,
            stride: 2,
            normalised: !0
        },
        unorm8x4: {
            size: 4,
            stride: 4,
            normalised: !0
        },
        snorm8x2: {
            size: 2,
            stride: 2,
            normalised: !0
        },
        snorm8x4: {
            size: 4,
            stride: 4,
            normalised: !0
        },
        uint16x2: {
            size: 2,
            stride: 4,
            normalised: !1
        },
        uint16x4: {
            size: 4,
            stride: 8,
            normalised: !1
        },
        sint16x2: {
            size: 2,
            stride: 4,
            normalised: !1
        },
        sint16x4: {
            size: 4,
            stride: 8,
            normalised: !1
        },
        unorm16x2: {
            size: 2,
            stride: 4,
            normalised: !0
        },
        unorm16x4: {
            size: 4,
            stride: 8,
            normalised: !0
        },
        snorm16x2: {
            size: 2,
            stride: 4,
            normalised: !0
        },
        snorm16x4: {
            size: 4,
            stride: 8,
            normalised: !0
        },
        float16x2: {
            size: 2,
            stride: 4,
            normalised: !1
        },
        float16x4: {
            size: 4,
            stride: 8,
            normalised: !1
        },
        float32: {
            size: 1,
            stride: 4,
            normalised: !1
        },
        float32x2: {
            size: 2,
            stride: 8,
            normalised: !1
        },
        float32x3: {
            size: 3,
            stride: 12,
            normalised: !1
        },
        float32x4: {
            size: 4,
            stride: 16,
            normalised: !1
        },
        uint32: {
            size: 1,
            stride: 4,
            normalised: !1
        },
        uint32x2: {
            size: 2,
            stride: 8,
            normalised: !1
        },
        uint32x3: {
            size: 3,
            stride: 12,
            normalised: !1
        },
        uint32x4: {
            size: 4,
            stride: 16,
            normalised: !1
        },
        sint32: {
            size: 1,
            stride: 4,
            normalised: !1
        },
        sint32x2: {
            size: 2,
            stride: 8,
            normalised: !1
        },
        sint32x3: {
            size: 3,
            stride: 12,
            normalised: !1
        },
        sint32x4: {
            size: 4,
            stride: 16,
            normalised: !1
        }
    };
    Eo = function(i) {
        return cs[i] ?? cs.float32;
    };
    const Ro = {
        f32: "float32",
        "vec2<f32>": "float32x2",
        "vec3<f32>": "float32x3",
        "vec4<f32>": "float32x4",
        vec2f: "float32x2",
        vec3f: "float32x3",
        vec4f: "float32x4",
        i32: "sint32",
        "vec2<i32>": "sint32x2",
        "vec3<i32>": "sint32x3",
        "vec4<i32>": "sint32x4",
        u32: "uint32",
        "vec2<u32>": "uint32x2",
        "vec3<u32>": "uint32x3",
        "vec4<u32>": "uint32x4",
        bool: "uint32",
        "vec2<bool>": "uint32x2",
        "vec3<bool>": "uint32x3",
        "vec4<bool>": "uint32x4"
    };
    function Io({ source: i, entryPoint: t }) {
        const e = {}, s = i.indexOf(`fn ${t}`);
        if (s !== -1) {
            const r = i.indexOf("->", s);
            if (r !== -1) {
                const n = i.substring(s, r), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
                let a;
                for(; (a = o.exec(n)) !== null;){
                    const h = Ro[a[3]] ?? "float32";
                    e[a[2]] = {
                        location: parseInt(a[1], 10),
                        format: h,
                        stride: Eo(h).stride,
                        offset: 0,
                        instance: !1,
                        start: 0
                    };
                }
            }
        }
        return e;
    }
    function Ze(i) {
        const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, s = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, n = /:\s*(\w+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, a = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, l = i.match(t)?.map((u)=>({
                group: parseInt(u.match(e)[1], 10),
                binding: parseInt(u.match(s)[1], 10),
                name: u.match(r)[2],
                isUniform: u.match(r)[1] === "<uniform>",
                type: u.match(n)[1]
            }));
        if (!l) return {
            groups: [],
            structs: []
        };
        const c = i.match(o)?.map((u)=>{
            const f = u.match(h)[1], d = u.match(a).reduce((g, m)=>{
                const [p, x] = m.split(":");
                return g[p.trim()] = x.trim(), g;
            }, {});
            return d ? {
                name: f,
                members: d
            } : null;
        }).filter(({ name: u })=>l.some((f)=>f.type === u)) ?? [];
        return {
            groups: l,
            structs: c
        };
    }
    var Kt = ((i)=>(i[i.VERTEX = 1] = "VERTEX", i[i.FRAGMENT = 2] = "FRAGMENT", i[i.COMPUTE = 4] = "COMPUTE", i))(Kt || {});
    function ko({ groups: i }) {
        const t = [];
        for(let e = 0; e < i.length; e++){
            const s = i[e];
            t[s.group] || (t[s.group] = []), s.isUniform ? t[s.group].push({
                binding: s.binding,
                visibility: Kt.VERTEX | Kt.FRAGMENT,
                buffer: {
                    type: "uniform"
                }
            }) : s.type === "sampler" ? t[s.group].push({
                binding: s.binding,
                visibility: Kt.FRAGMENT,
                sampler: {
                    type: "filtering"
                }
            }) : s.type === "texture_2d" && t[s.group].push({
                binding: s.binding,
                visibility: Kt.FRAGMENT,
                texture: {
                    sampleType: "float",
                    viewDimension: "2d",
                    multisampled: !1
                }
            });
        }
        return t;
    }
    function Go({ groups: i }) {
        const t = [];
        for(let e = 0; e < i.length; e++){
            const s = i[e];
            t[s.group] || (t[s.group] = {}), t[s.group][s.name] = s.binding;
        }
        return t;
    }
    function Bo(i, t) {
        const e = new Set, s = new Set, r = [
            ...i.structs,
            ...t.structs
        ].filter((o)=>e.has(o.name) ? !1 : (e.add(o.name), !0)), n = [
            ...i.groups,
            ...t.groups
        ].filter((o)=>{
            const a = `${o.name}-${o.binding}`;
            return s.has(a) ? !1 : (s.add(a), !0);
        });
        return {
            structs: r,
            groups: n
        };
    }
    const Qe = Object.create(null);
    Be = class {
        constructor(t){
            this._layoutKey = 0, this._attributeLocationsKey = 0;
            const { fragment: e, vertex: s, layout: r, gpuLayout: n, name: o } = t;
            if (this.name = o, this.fragment = e, this.vertex = s, e.source === s.source) {
                const a = Ze(e.source);
                this.structsAndGroups = a;
            } else {
                const a = Ze(s.source), h = Ze(e.source);
                this.structsAndGroups = Bo(a, h);
            }
            this.layout = r ?? Go(this.structsAndGroups), this.gpuLayout = n ?? ko(this.structsAndGroups), this.autoAssignGlobalUniforms = this.layout[0]?.globalUniforms !== void 0, this.autoAssignLocalUniforms = this.layout[1]?.localUniforms !== void 0, this._generateProgramKey();
        }
        _generateProgramKey() {
            const { vertex: t, fragment: e } = this, s = t.source + e.source + t.entryPoint + e.entryPoint;
            this._layoutKey = Pi(s, "program");
        }
        get attributeData() {
            return this._attributeData ?? (this._attributeData = Io(this.vertex)), this._attributeData;
        }
        destroy() {
            this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null;
        }
        static from(t) {
            const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
            return Qe[e] || (Qe[e] = new Be(t)), Qe[e];
        }
    };
    const Pr = [
        "f32",
        "i32",
        "vec2<f32>",
        "vec3<f32>",
        "vec4<f32>",
        "mat2x2<f32>",
        "mat3x3<f32>",
        "mat4x4<f32>",
        "mat3x2<f32>",
        "mat4x2<f32>",
        "mat2x3<f32>",
        "mat4x3<f32>",
        "mat2x4<f32>",
        "mat3x4<f32>",
        "vec2<i32>",
        "vec3<i32>",
        "vec4<i32>"
    ], Do = Pr.reduce((i, t)=>(i[t] = !0, i), {});
    function Oo(i, t) {
        switch(i){
            case "f32":
                return 0;
            case "vec2<f32>":
                return new Float32Array(2 * t);
            case "vec3<f32>":
                return new Float32Array(3 * t);
            case "vec4<f32>":
                return new Float32Array(4 * t);
            case "mat2x2<f32>":
                return new Float32Array([
                    1,
                    0,
                    0,
                    1
                ]);
            case "mat3x3<f32>":
                return new Float32Array([
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1
                ]);
            case "mat4x4<f32>":
                return new Float32Array([
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]);
        }
        return null;
    }
    const Er = class Rr {
        constructor(t, e){
            this._touched = 0, this.uid = z("uniform"), this._resourceType = "uniformGroup", this._resourceId = z("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = {
                ...Rr.defaultOptions,
                ...e
            }, this.uniformStructures = t;
            const s = {};
            for(const r in t){
                const n = t[r];
                if (n.name = r, n.size = n.size ?? 1, !Do[n.type]) throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${Pr.join(", ")}`);
                n.value ?? (n.value = Oo(n.type, n.size)), s[r] = n.value;
            }
            this.uniforms = s, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = Pi(Object.keys(s).map((r)=>`${r}-${t[r].type}`).join("-"), "uniform-group");
        }
        update() {
            this._dirtyId++;
        }
    };
    Er.defaultOptions = {
        ubo: !1,
        isStatic: !1
    };
    Ir = Er;
    Ie = class {
        constructor(t){
            this.resources = Object.create(null), this._dirty = !0;
            let e = 0;
            for(const s in t){
                const r = t[s];
                this.setResource(r, e++);
            }
            this._updateKey();
        }
        _updateKey() {
            if (!this._dirty) return;
            this._dirty = !1;
            const t = [];
            let e = 0;
            for(const s in this.resources)t[e++] = this.resources[s]._resourceId;
            this._key = t.join("|");
        }
        setResource(t, e) {
            const s = this.resources[e];
            t !== s && (s && t.off?.("change", this.onResourceChange, this), t.on?.("change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
        }
        getResource(t) {
            return this.resources[t];
        }
        _touch(t) {
            const e = this.resources;
            for(const s in e)e[s]._touched = t;
        }
        destroy() {
            const t = this.resources;
            for(const e in t)t[e].off?.("change", this.onResourceChange, this);
            this.resources = null;
        }
        onResourceChange(t) {
            if (this._dirty = !0, t.destroyed) {
                const e = this.resources;
                for(const s in e)e[s] === t && (e[s] = null);
            } else this._updateKey();
        }
    };
    gi = ((i)=>(i[i.WEBGL = 1] = "WEBGL", i[i.WEBGPU = 2] = "WEBGPU", i[i.BOTH = 3] = "BOTH", i))(gi || {});
    Ei = class extends mt {
        constructor(t){
            super(), this.uid = z("shader"), this._uniformBindMap = Object.create(null), this._ownedBindGroups = [];
            let { gpuProgram: e, glProgram: s, groups: r, resources: n, compatibleRenderers: o, groupMap: a } = t;
            this.gpuProgram = e, this.glProgram = s, o === void 0 && (o = 0, e && (o |= gi.WEBGPU), s && (o |= gi.WEBGL)), this.compatibleRenderers = o;
            const h = {};
            if (!n && !r && (n = {}), n && r) throw new Error("[Shader] Cannot have both resources and groups");
            if (!e && r && !a) throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
            if (!e && r && a) for(const l in a)for(const c in a[l]){
                const u = a[l][c];
                h[u] = {
                    group: l,
                    binding: c,
                    name: u
                };
            }
            else if (e && r && !a) {
                const l = e.structsAndGroups.groups;
                a = {}, l.forEach((c)=>{
                    a[c.group] = a[c.group] || {}, a[c.group][c.binding] = c.name, h[c.name] = c;
                });
            } else if (n) {
                r = {}, a = {}, e && e.structsAndGroups.groups.forEach((u)=>{
                    a[u.group] = a[u.group] || {}, a[u.group][u.binding] = u.name, h[u.name] = u;
                });
                let l = 0;
                for(const c in n)h[c] || (r[99] || (r[99] = new Ie, this._ownedBindGroups.push(r[99])), h[c] = {
                    group: 99,
                    binding: l,
                    name: c
                }, a[99] = a[99] || {}, a[99][l] = c, l++);
                for(const c in n){
                    const u = c;
                    let f = n[c];
                    !f.source && !f._resourceType && (f = new Ir(f));
                    const d = h[u];
                    d && (r[d.group] || (r[d.group] = new Ie, this._ownedBindGroups.push(r[d.group])), r[d.group].setResource(f, d.binding));
                }
            }
            this.groups = r, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(r, h);
        }
        addResource(t, e, s) {
            var r, n;
            (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[s] || (n[s] = t), this.groups[e] || (this.groups[e] = new Ie, this._ownedBindGroups.push(this.groups[e]));
        }
        _buildResourceAccessor(t, e) {
            const s = {};
            for(const r in e){
                const n = e[r];
                Object.defineProperty(s, n.name, {
                    get () {
                        return t[n.group].getResource(n.binding);
                    },
                    set (o) {
                        t[n.group].setResource(o, n.binding);
                    }
                });
            }
            return s;
        }
        destroy(t = !1) {
            this.emit("destroy", this), t && (this.gpuProgram?.destroy(), this.glProgram?.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((e)=>{
                e.destroy();
            }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
        }
        static from(t) {
            const { gpu: e, gl: s, ...r } = t;
            let n, o;
            return e && (n = Be.from(e)), s && (o = Mr.from(s)), new Ei({
                gpuProgram: n,
                glProgram: o,
                ...r
            });
        }
    };
    const mi = [];
    nt.handleByNamedList(G.Environment, mi);
    async function Lo(i) {
        if (!i) for(let t = 0; t < mi.length; t++){
            const e = mi[t];
            if (e.value.test()) {
                await e.value.load();
                return;
            }
        }
    }
    let zt;
    Fo = function() {
        if (typeof zt == "boolean") return zt;
        try {
            zt = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({
                a: "b"
            }, "a", "b") === !0;
        } catch  {
            zt = !1;
        }
        return zt;
    };
    function us(i, t, e = 2) {
        const s = t && t.length, r = s ? t[0] * e : i.length;
        let n = kr(i, 0, r, e, !0);
        const o = [];
        if (!n || n.next === n.prev) return o;
        let a, h, l;
        if (s && (n = Yo(i, t, n, e)), i.length > 80 * e) {
            a = i[0], h = i[1];
            let c = a, u = h;
            for(let f = e; f < r; f += e){
                const d = i[f], g = i[f + 1];
                d < a && (a = d), g < h && (h = g), d > c && (c = d), g > u && (u = g);
            }
            l = Math.max(c - a, u - h), l = l !== 0 ? 32767 / l : 0;
        }
        return oe(n, o, e, a, h, l, 0), o;
    }
    function kr(i, t, e, s, r) {
        let n;
        if (r === ta(i, t, e, s) > 0) for(let o = t; o < e; o += s)n = ds(o / s | 0, i[o], i[o + 1], n);
        else for(let o = e - s; o >= t; o -= s)n = ds(o / s | 0, i[o], i[o + 1], n);
        return n && Ot(n, n.next) && (he(n), n = n.next), n;
    }
    function It(i, t) {
        if (!i) return i;
        t || (t = i);
        let e = i, s;
        do if (s = !1, !e.steiner && (Ot(e, e.next) || H(e.prev, e, e.next) === 0)) {
            if (he(e), e = t = e.prev, e === e.next) break;
            s = !0;
        } else e = e.next;
        while (s || e !== t);
        return t;
    }
    function oe(i, t, e, s, r, n, o) {
        if (!i) return;
        !o && n && jo(i, s, r, n);
        let a = i;
        for(; i.prev !== i.next;){
            const h = i.prev, l = i.next;
            if (n ? No(i, s, r, n) : Ho(i)) {
                t.push(h.i, i.i, l.i), he(i), i = l.next, a = l.next;
                continue;
            }
            if (i = l, i === a) {
                o ? o === 1 ? (i = Vo(It(i), t), oe(i, t, e, s, r, n, 2)) : o === 2 && Uo(i, t, e, s, r, n) : oe(It(i), t, e, s, r, n, 1);
                break;
            }
        }
    }
    function Ho(i) {
        const t = i.prev, e = i, s = i.next;
        if (H(t, e, s) >= 0) return !1;
        const r = t.x, n = e.x, o = s.x, a = t.y, h = e.y, l = s.y, c = Math.min(r, n, o), u = Math.min(a, h, l), f = Math.max(r, n, o), d = Math.max(a, h, l);
        let g = s.next;
        for(; g !== t;){
            if (g.x >= c && g.x <= f && g.y >= u && g.y <= d && Zt(r, a, n, h, o, l, g.x, g.y) && H(g.prev, g, g.next) >= 0) return !1;
            g = g.next;
        }
        return !0;
    }
    function No(i, t, e, s) {
        const r = i.prev, n = i, o = i.next;
        if (H(r, n, o) >= 0) return !1;
        const a = r.x, h = n.x, l = o.x, c = r.y, u = n.y, f = o.y, d = Math.min(a, h, l), g = Math.min(c, u, f), m = Math.max(a, h, l), p = Math.max(c, u, f), x = yi(d, g, t, e, s), y = yi(m, p, t, e, s);
        let _ = i.prevZ, b = i.nextZ;
        for(; _ && _.z >= x && b && b.z <= y;){
            if (_.x >= d && _.x <= m && _.y >= g && _.y <= p && _ !== r && _ !== o && Zt(a, c, h, u, l, f, _.x, _.y) && H(_.prev, _, _.next) >= 0 || (_ = _.prevZ, b.x >= d && b.x <= m && b.y >= g && b.y <= p && b !== r && b !== o && Zt(a, c, h, u, l, f, b.x, b.y) && H(b.prev, b, b.next) >= 0)) return !1;
            b = b.nextZ;
        }
        for(; _ && _.z >= x;){
            if (_.x >= d && _.x <= m && _.y >= g && _.y <= p && _ !== r && _ !== o && Zt(a, c, h, u, l, f, _.x, _.y) && H(_.prev, _, _.next) >= 0) return !1;
            _ = _.prevZ;
        }
        for(; b && b.z <= y;){
            if (b.x >= d && b.x <= m && b.y >= g && b.y <= p && b !== r && b !== o && Zt(a, c, h, u, l, f, b.x, b.y) && H(b.prev, b, b.next) >= 0) return !1;
            b = b.nextZ;
        }
        return !0;
    }
    function Vo(i, t) {
        let e = i;
        do {
            const s = e.prev, r = e.next.next;
            !Ot(s, r) && Br(s, e, e.next, r) && ae(s, r) && ae(r, s) && (t.push(s.i, e.i, r.i), he(e), he(e.next), e = i = r), e = e.next;
        }while (e !== i);
        return It(e);
    }
    function Uo(i, t, e, s, r, n) {
        let o = i;
        do {
            let a = o.next.next;
            for(; a !== o.prev;){
                if (o.i !== a.i && Zo(o, a)) {
                    let h = Dr(o, a);
                    o = It(o, o.next), h = It(h, h.next), oe(o, t, e, s, r, n, 0), oe(h, t, e, s, r, n, 0);
                    return;
                }
                a = a.next;
            }
            o = o.next;
        }while (o !== i);
    }
    function Yo(i, t, e, s) {
        const r = [];
        for(let n = 0, o = t.length; n < o; n++){
            const a = t[n] * s, h = n < o - 1 ? t[n + 1] * s : i.length, l = kr(i, a, h, s, !1);
            l === l.next && (l.steiner = !0), r.push(Ko(l));
        }
        r.sort(zo);
        for(let n = 0; n < r.length; n++)e = Xo(r[n], e);
        return e;
    }
    function zo(i, t) {
        let e = i.x - t.x;
        if (e === 0 && (e = i.y - t.y, e === 0)) {
            const s = (i.next.y - i.y) / (i.next.x - i.x), r = (t.next.y - t.y) / (t.next.x - t.x);
            e = s - r;
        }
        return e;
    }
    function Xo(i, t) {
        const e = Wo(i, t);
        if (!e) return t;
        const s = Dr(e, i);
        return It(s, s.next), It(e, e.next);
    }
    function Wo(i, t) {
        let e = t;
        const s = i.x, r = i.y;
        let n = -1 / 0, o;
        if (Ot(i, e)) return e;
        do {
            if (Ot(i, e.next)) return e.next;
            if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
                const u = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
                if (u <= s && u > n && (n = u, o = e.x < e.next.x ? e : e.next, u === s)) return o;
            }
            e = e.next;
        }while (e !== t);
        if (!o) return null;
        const a = o, h = o.x, l = o.y;
        let c = 1 / 0;
        e = o;
        do {
            if (s >= e.x && e.x >= h && s !== e.x && Gr(r < l ? s : n, r, h, l, r < l ? n : s, r, e.x, e.y)) {
                const u = Math.abs(r - e.y) / (s - e.x);
                ae(e, i) && (u < c || u === c && (e.x > o.x || e.x === o.x && $o(o, e))) && (o = e, c = u);
            }
            e = e.next;
        }while (e !== a);
        return o;
    }
    function $o(i, t) {
        return H(i.prev, i, t.prev) < 0 && H(t.next, i, i.next) < 0;
    }
    function jo(i, t, e, s) {
        let r = i;
        do r.z === 0 && (r.z = yi(r.x, r.y, t, e, s)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
        while (r !== i);
        r.prevZ.nextZ = null, r.prevZ = null, qo(r);
    }
    function qo(i) {
        let t, e = 1;
        do {
            let s = i, r;
            i = null;
            let n = null;
            for(t = 0; s;){
                t++;
                let o = s, a = 0;
                for(let l = 0; l < e && (a++, o = o.nextZ, !!o); l++);
                let h = e;
                for(; a > 0 || h > 0 && o;)a !== 0 && (h === 0 || !o || s.z <= o.z) ? (r = s, s = s.nextZ, a--) : (r = o, o = o.nextZ, h--), n ? n.nextZ = r : i = r, r.prevZ = n, n = r;
                s = o;
            }
            n.nextZ = null, e *= 2;
        }while (t > 1);
        return i;
    }
    function yi(i, t, e, s, r) {
        return i = (i - e) * r | 0, t = (t - s) * r | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
    }
    function Ko(i) {
        let t = i, e = i;
        do (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
        while (t !== i);
        return e;
    }
    function Gr(i, t, e, s, r, n, o, a) {
        return (r - o) * (t - a) >= (i - o) * (n - a) && (i - o) * (s - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (r - o) * (s - a);
    }
    function Zt(i, t, e, s, r, n, o, a) {
        return !(i === o && t === a) && Gr(i, t, e, s, r, n, o, a);
    }
    function Zo(i, t) {
        return i.next.i !== t.i && i.prev.i !== t.i && !Qo(i, t) && (ae(i, t) && ae(t, i) && Jo(i, t) && (H(i.prev, i, t.prev) || H(i, t.prev, t)) || Ot(i, t) && H(i.prev, i, i.next) > 0 && H(t.prev, t, t.next) > 0);
    }
    function H(i, t, e) {
        return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
    }
    function Ot(i, t) {
        return i.x === t.x && i.y === t.y;
    }
    function Br(i, t, e, s) {
        const r = ve(H(i, t, e)), n = ve(H(i, t, s)), o = ve(H(e, s, i)), a = ve(H(e, s, t));
        return !!(r !== n && o !== a || r === 0 && Ae(i, e, t) || n === 0 && Ae(i, s, t) || o === 0 && Ae(e, i, s) || a === 0 && Ae(e, t, s));
    }
    function Ae(i, t, e) {
        return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
    }
    function ve(i) {
        return i > 0 ? 1 : i < 0 ? -1 : 0;
    }
    function Qo(i, t) {
        let e = i;
        do {
            if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && Br(e, e.next, i, t)) return !0;
            e = e.next;
        }while (e !== i);
        return !1;
    }
    function ae(i, t) {
        return H(i.prev, i, i.next) < 0 ? H(i, t, i.next) >= 0 && H(i, i.prev, t) >= 0 : H(i, t, i.prev) < 0 || H(i, i.next, t) < 0;
    }
    function Jo(i, t) {
        let e = i, s = !1;
        const r = (i.x + t.x) / 2, n = (i.y + t.y) / 2;
        do e.y > n != e.next.y > n && e.next.y !== e.y && r < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next;
        while (e !== i);
        return s;
    }
    function Dr(i, t) {
        const e = xi(i.i, i.x, i.y), s = xi(t.i, t.x, t.y), r = i.next, n = t.prev;
        return i.next = t, t.prev = i, e.next = r, r.prev = e, s.next = e, e.prev = s, n.next = s, s.prev = n, s;
    }
    function ds(i, t, e, s) {
        const r = xi(i, t, e);
        return s ? (r.next = s.next, r.prev = s, s.next.prev = r, s.next = r) : (r.prev = r, r.next = r), r;
    }
    function he(i) {
        i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
    }
    function xi(i, t, e) {
        return {
            i,
            x: t,
            y: e,
            prev: null,
            next: null,
            z: 0,
            prevZ: null,
            nextZ: null,
            steiner: !1
        };
    }
    function ta(i, t, e, s) {
        let r = 0;
        for(let n = t, o = e - s; n < e; n += s)r += (i[o] - i[n]) * (i[n + 1] + i[o + 1]), o = n;
        return r;
    }
    const ea = us.default || us;
    Or = ((i)=>(i[i.NONE = 0] = "NONE", i[i.COLOR = 16384] = "COLOR", i[i.STENCIL = 1024] = "STENCIL", i[i.DEPTH = 256] = "DEPTH", i[i.COLOR_DEPTH = 16640] = "COLOR_DEPTH", i[i.COLOR_STENCIL = 17408] = "COLOR_STENCIL", i[i.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", i[i.ALL = 17664] = "ALL", i))(Or || {});
    ia = class {
        constructor(t){
            this.items = [], this._name = t;
        }
        emit(t, e, s, r, n, o, a, h) {
            const { name: l, items: c } = this;
            for(let u = 0, f = c.length; u < f; u++)c[u][l](t, e, s, r, n, o, a, h);
            return this;
        }
        add(t) {
            return t[this._name] && (this.remove(t), this.items.push(t)), this;
        }
        remove(t) {
            const e = this.items.indexOf(t);
            return e !== -1 && this.items.splice(e, 1), this;
        }
        contains(t) {
            return this.items.indexOf(t) !== -1;
        }
        removeAll() {
            return this.items.length = 0, this;
        }
        destroy() {
            this.removeAll(), this.items = null, this._name = null;
        }
        get empty() {
            return this.items.length === 0;
        }
        get name() {
            return this._name;
        }
    };
    const sa = [
        "init",
        "destroy",
        "contextChange",
        "resolutionChange",
        "resetState",
        "renderEnd",
        "renderStart",
        "render",
        "update",
        "postrender",
        "prerender"
    ], Lr = class Fr extends mt {
        constructor(t){
            super(), this.uid = z("renderer"), this.runners = Object.create(null), this.renderPipes = Object.create(null), this._initOptions = {}, this._systemsHash = Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
            const e = [
                ...sa,
                ...this.config.runners ?? []
            ];
            this._addRunners(...e), this._unsafeEvalCheck();
        }
        async init(t = {}) {
            const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
            await Lo(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
            for(const s in this._systemsHash)t = {
                ...this._systemsHash[s].constructor.defaultOptions,
                ...t
            };
            t = {
                ...Fr.defaultOptions,
                ...t
            }, this._roundPixels = t.roundPixels ? 1 : 0;
            for(let s = 0; s < this.runners.init.items.length; s++)await this.runners.init.items[s].init(t);
            this._initOptions = t;
        }
        render(t, e) {
            let s = t;
            if (s instanceof dt && (s = {
                container: s
            }, e && (B(W, "passing a second argument is deprecated, please use render options instead"), s.target = e.renderTexture)), s.target || (s.target = this.view.renderTarget), s.target === this.view.renderTarget && (this._lastObjectRendered = s.container, s.clearColor ?? (s.clearColor = this.background.colorRgba), s.clear ?? (s.clear = this.background.clearBeforeRender)), s.clearColor) {
                const r = Array.isArray(s.clearColor) && s.clearColor.length === 4;
                s.clearColor = r ? s.clearColor : rt.shared.setValue(s.clearColor).toArray();
            }
            s.transform || (s.container.updateLocalTransform(), s.transform = s.container.localTransform), s.container.enableRenderGroup(), this.runners.prerender.emit(s), this.runners.renderStart.emit(s), this.runners.render.emit(s), this.runners.renderEnd.emit(s), this.runners.postrender.emit(s);
        }
        resize(t, e, s) {
            const r = this.view.resolution;
            this.view.resize(t, e, s), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), s !== void 0 && s !== r && this.runners.resolutionChange.emit(s);
        }
        clear(t = {}) {
            const e = this;
            t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = Or.ALL);
            const { clear: s, clearColor: r, target: n } = t;
            rt.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, s, rt.shared.toArray());
        }
        get resolution() {
            return this.view.resolution;
        }
        set resolution(t) {
            this.view.resolution = t, this.runners.resolutionChange.emit(t);
        }
        get width() {
            return this.view.texture.frame.width;
        }
        get height() {
            return this.view.texture.frame.height;
        }
        get canvas() {
            return this.view.canvas;
        }
        get lastObjectRendered() {
            return this._lastObjectRendered;
        }
        get renderingToScreen() {
            return this.renderTarget.renderingToScreen;
        }
        get screen() {
            return this.view.screen;
        }
        _addRunners(...t) {
            t.forEach((e)=>{
                this.runners[e] = new ia(e);
            });
        }
        _addSystems(t) {
            let e;
            for(e in t){
                const s = t[e];
                this._addSystem(s.value, s.name);
            }
        }
        _addSystem(t, e) {
            const s = new t(this);
            if (this[e]) throw new Error(`Whoops! The name "${e}" is already in use`);
            this[e] = s, this._systemsHash[e] = s;
            for(const r in this.runners)this.runners[r].add(s);
            return this;
        }
        _addPipes(t, e) {
            const s = e.reduce((r, n)=>(r[n.name] = n.value, r), {});
            t.forEach((r)=>{
                const n = r.value, o = r.name, a = s[o];
                this.renderPipes[o] = new n(this, a ? new a : null);
            });
        }
        destroy(t = !1) {
            this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), Object.values(this.runners).forEach((e)=>{
                e.destroy();
            }), this._systemsHash = null, this.renderPipes = null;
        }
        generateTexture(t) {
            return this.textureGenerator.generateTexture(t);
        }
        get roundPixels() {
            return !!this._roundPixels;
        }
        _unsafeEvalCheck() {
            if (!Fo()) throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
        }
        resetState() {
            this.runners.resetState.emit();
        }
    };
    Lr.defaultOptions = {
        resolution: 1,
        failIfMajorPerformanceCaveat: !1,
        roundPixels: !1
    };
    let Te;
    Hr = Lr;
    function ra(i) {
        return Te !== void 0 || (Te = (()=>{
            const t = {
                stencil: !0,
                failIfMajorPerformanceCaveat: i ?? Hr.defaultOptions.failIfMajorPerformanceCaveat
            };
            try {
                if (!Rt.get().getWebGLRenderingContext()) return !1;
                let s = Rt.get().createCanvas().getContext("webgl", t);
                const r = !!s?.getContextAttributes()?.stencil;
                if (s) {
                    const n = s.getExtension("WEBGL_lose_context");
                    n && n.loseContext();
                }
                return s = null, r;
            } catch  {
                return !1;
            }
        })()), Te;
    }
    let Me;
    async function na(i = {}) {
        return Me !== void 0 || (Me = await (async ()=>{
            const t = Rt.get().getNavigator().gpu;
            if (!t) return !1;
            try {
                return await (await t.requestAdapter(i)).requestDevice(), !0;
            } catch  {
                return !1;
            }
        })()), Me;
    }
    const fs = [
        "webgl",
        "webgpu",
        "canvas"
    ];
    async function oa(i) {
        let t = [];
        i.preference ? (t.push(i.preference), fs.forEach((n)=>{
            n !== i.preference && t.push(n);
        })) : t = fs.slice();
        let e, s = {};
        for(let n = 0; n < t.length; n++){
            const o = t[n];
            if (o === "webgpu" && await na()) {
                const { WebGPURenderer: a } = await se(()=>import("./WebGPURenderer-0a084ef2.js"), ["assets/WebGPURenderer-0a084ef2.js","assets/colorToUniform-21d3a5e1.js","assets/SharedSystems-673adfaa.js","assets/CanvasPool-118b044d.js"]);
                e = a, s = {
                    ...i,
                    ...i.webgpu
                };
                break;
            } else if (o === "webgl" && ra(i.failIfMajorPerformanceCaveat ?? Hr.defaultOptions.failIfMajorPerformanceCaveat)) {
                const { WebGLRenderer: a } = await se(()=>import("./WebGLRenderer-af18817e.js"), ["assets/WebGLRenderer-af18817e.js","assets/colorToUniform-21d3a5e1.js","assets/SharedSystems-673adfaa.js"]);
                e = a, s = {
                    ...i,
                    ...i.webgl
                };
                break;
            } else if (o === "canvas") throw s = {
                ...i
            }, new Error("CanvasRenderer is not yet implemented");
        }
        if (delete s.webgpu, delete s.webgl, !e) throw new Error("No available renderer for the current environment");
        const r = new e;
        return await r.init(s), r;
    }
    Nr = "8.11.0";
    class Vr {
        static init() {
            globalThis.__PIXI_APP_INIT__?.(this, Nr);
        }
        static destroy() {}
    }
    Vr.extension = G.Application;
    aa = class {
        constructor(t){
            this._renderer = t;
        }
        init() {
            globalThis.__PIXI_RENDERER_INIT__?.(this._renderer, Nr);
        }
        destroy() {
            this._renderer = null;
        }
    };
    aa.extension = {
        type: [
            G.WebGLSystem,
            G.WebGPUSystem
        ],
        name: "initHook",
        priority: -10
    };
    const Ur = class _i {
        constructor(...t){
            this.stage = new dt, t[0] !== void 0 && B(W, "Application constructor options are deprecated, please use Application.init() instead.");
        }
        async init(t) {
            t = {
                ...t
            }, this.renderer = await oa(t), _i._plugins.forEach((e)=>{
                e.init.call(this, t);
            });
        }
        render() {
            this.renderer.render({
                container: this.stage
            });
        }
        get canvas() {
            return this.renderer.canvas;
        }
        get view() {
            return B(W, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
        }
        get screen() {
            return this.renderer.screen;
        }
        destroy(t = !1, e = !1) {
            const s = _i._plugins.slice(0);
            s.reverse(), s.forEach((r)=>{
                r.destroy.call(this);
            }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
        }
    };
    Ur._plugins = [];
    let Yr = Ur;
    nt.handleByList(G.Application, Yr._plugins);
    nt.add(Vr);
    const ps = [
        {
            offset: 0,
            color: "white"
        },
        {
            offset: 1,
            color: "black"
        }
    ], Ri = class bi {
        constructor(...t){
            this.uid = z("fillGradient"), this.type = "linear", this.colorStops = [];
            let e = ha(t);
            e = {
                ...e.type === "radial" ? bi.defaultRadialOptions : bi.defaultLinearOptions,
                ...$s(e)
            }, this._textureSize = e.textureSize, this._wrapMode = e.wrapMode, e.type === "radial" ? (this.center = e.center, this.outerCenter = e.outerCenter ?? this.center, this.innerRadius = e.innerRadius, this.outerRadius = e.outerRadius, this.scale = e.scale, this.rotation = e.rotation) : (this.start = e.start, this.end = e.end), this.textureSpace = e.textureSpace, this.type = e.type, e.colorStops.forEach((r)=>{
                this.addColorStop(r.offset, r.color);
            });
        }
        addColorStop(t, e) {
            return this.colorStops.push({
                offset: t,
                color: rt.shared.setValue(e).toHexa()
            }), this;
        }
        buildLinearGradient() {
            if (this.texture) return;
            let { x: t, y: e } = this.start, { x: s, y: r } = this.end, n = s - t, o = r - e;
            const a = n < 0 || o < 0;
            if (this._wrapMode === "clamp-to-edge") {
                if (n < 0) {
                    const p = t;
                    t = s, s = p, n *= -1;
                }
                if (o < 0) {
                    const p = e;
                    e = r, r = p, o *= -1;
                }
            }
            const h = this.colorStops.length ? this.colorStops : ps, l = this._textureSize, { canvas: c, context: u } = ms(l, 1), f = a ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
            gs(f, h), u.fillStyle = f, u.fillRect(0, 0, l, 1), this.texture = new D({
                source: new ke({
                    resource: c,
                    addressMode: this._wrapMode
                })
            });
            const d = Math.sqrt(n * n + o * o), g = Math.atan2(o, n), m = new k;
            m.scale(d / l, 1), m.rotate(g), m.translate(t, e), this.textureSpace === "local" && m.scale(l, l), this.transform = m;
        }
        buildGradient() {
            this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
        }
        buildRadialGradient() {
            if (this.texture) return;
            const t = this.colorStops.length ? this.colorStops : ps, e = this._textureSize, { canvas: s, context: r } = ms(e, e), { x: n, y: o } = this.center, { x: a, y: h } = this.outerCenter, l = this.innerRadius, c = this.outerRadius, u = a - c, f = h - c, d = e / (c * 2), g = (n - u) * d, m = (o - f) * d, p = r.createRadialGradient(g, m, l * d, (a - u) * d, (h - f) * d, c * d);
            gs(p, t), r.fillStyle = t[t.length - 1].color, r.fillRect(0, 0, e, e), r.fillStyle = p, r.translate(g, m), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-g, -m), r.fillRect(0, 0, e, e), this.texture = new D({
                source: new ke({
                    resource: s,
                    addressMode: this._wrapMode
                })
            });
            const x = new k;
            x.scale(1 / d, 1 / d), x.translate(u, f), this.textureSpace === "local" && x.scale(e, e), this.transform = x;
        }
        get styleKey() {
            return this.uid;
        }
        destroy() {
            this.texture?.destroy(!0), this.texture = null;
        }
    };
    Ri.defaultLinearOptions = {
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 1
        },
        colorStops: [],
        textureSpace: "local",
        type: "linear",
        textureSize: 256,
        wrapMode: "clamp-to-edge"
    };
    Ri.defaultRadialOptions = {
        center: {
            x: .5,
            y: .5
        },
        innerRadius: 0,
        outerRadius: .5,
        colorStops: [],
        scale: 1,
        textureSpace: "local",
        type: "radial",
        textureSize: 256,
        wrapMode: "clamp-to-edge"
    };
    ue = Ri;
    function gs(i, t) {
        for(let e = 0; e < t.length; e++){
            const s = t[e];
            i.addColorStop(s.offset, s.color);
        }
    }
    function ms(i, t) {
        const e = Rt.get().createCanvas(i, t), s = e.getContext("2d");
        return {
            canvas: e,
            context: s
        };
    }
    function ha(i) {
        let t = i[0] ?? {};
        return (typeof t == "number" || i[1]) && (B("8.5.2", "use options object instead"), t = {
            type: "linear",
            start: {
                x: i[0],
                y: i[1]
            },
            end: {
                x: i[2],
                y: i[3]
            },
            textureSpace: i[4],
            textureSize: i[5] ?? ue.defaultLinearOptions.textureSize
        }), t;
    }
    const ys = {
        repeat: {
            addressModeU: "repeat",
            addressModeV: "repeat"
        },
        "repeat-x": {
            addressModeU: "repeat",
            addressModeV: "clamp-to-edge"
        },
        "repeat-y": {
            addressModeU: "clamp-to-edge",
            addressModeV: "repeat"
        },
        "no-repeat": {
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge"
        }
    };
    la = class {
        constructor(t, e){
            this.uid = z("fillPattern"), this.transform = new k, this._styleKey = null, this.texture = t, this.transform.scale(1 / t.frame.width, 1 / t.frame.height), e && (t.source.style.addressModeU = ys[e].addressModeU, t.source.style.addressModeV = ys[e].addressModeV);
        }
        setTransform(t) {
            const e = this.texture;
            this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(1 / e.frame.width, 1 / e.frame.height), this._styleKey = null;
        }
        get styleKey() {
            return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
        }
    };
    var ca = da, Je = {
        a: 7,
        c: 6,
        h: 1,
        l: 2,
        m: 2,
        q: 4,
        s: 4,
        t: 2,
        v: 1,
        z: 0
    }, ua = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
    function da(i) {
        var t = [];
        return i.replace(ua, function(e, s, r) {
            var n = s.toLowerCase();
            for(r = pa(r), n == "m" && r.length > 2 && (t.push([
                s
            ].concat(r.splice(0, 2))), n = "l", s = s == "m" ? "l" : "L");;){
                if (r.length == Je[n]) return r.unshift(s), t.push(r);
                if (r.length < Je[n]) throw new Error("malformed path data");
                t.push([
                    s
                ].concat(r.splice(0, Je[n])));
            }
        }), t;
    }
    var fa = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
    function pa(i) {
        var t = i.match(fa);
        return t ? t.map(Number) : [];
    }
    const ga = Ys(ca);
    function ma(i, t) {
        const e = ga(i), s = [];
        let r = null, n = 0, o = 0;
        for(let a = 0; a < e.length; a++){
            const h = e[a], l = h[0], c = h;
            switch(l){
                case "M":
                    n = c[1], o = c[2], t.moveTo(n, o);
                    break;
                case "m":
                    n += c[1], o += c[2], t.moveTo(n, o);
                    break;
                case "H":
                    n = c[1], t.lineTo(n, o);
                    break;
                case "h":
                    n += c[1], t.lineTo(n, o);
                    break;
                case "V":
                    o = c[1], t.lineTo(n, o);
                    break;
                case "v":
                    o += c[1], t.lineTo(n, o);
                    break;
                case "L":
                    n = c[1], o = c[2], t.lineTo(n, o);
                    break;
                case "l":
                    n += c[1], o += c[2], t.lineTo(n, o);
                    break;
                case "C":
                    n = c[5], o = c[6], t.bezierCurveTo(c[1], c[2], c[3], c[4], n, o);
                    break;
                case "c":
                    t.bezierCurveTo(n + c[1], o + c[2], n + c[3], o + c[4], n + c[5], o + c[6]), n += c[5], o += c[6];
                    break;
                case "S":
                    n = c[3], o = c[4], t.bezierCurveToShort(c[1], c[2], n, o);
                    break;
                case "s":
                    t.bezierCurveToShort(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
                    break;
                case "Q":
                    n = c[3], o = c[4], t.quadraticCurveTo(c[1], c[2], n, o);
                    break;
                case "q":
                    t.quadraticCurveTo(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
                    break;
                case "T":
                    n = c[1], o = c[2], t.quadraticCurveToShort(n, o);
                    break;
                case "t":
                    n += c[1], o += c[2], t.quadraticCurveToShort(n, o);
                    break;
                case "A":
                    n = c[6], o = c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
                    break;
                case "a":
                    n += c[6], o += c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
                    break;
                case "Z":
                case "z":
                    t.closePath(), s.length > 0 && (r = s.pop(), r ? (n = r.startX, o = r.startY) : (n = 0, o = 0)), r = null;
                    break;
                default:
                    tt(`Unknown SVG path command: ${l}`);
            }
            l !== "Z" && l !== "z" && r === null && (r = {
                startX: n,
                startY: o
            }, s.push(r));
        }
        return t;
    }
    class Ii {
        constructor(t = 0, e = 0, s = 0){
            this.type = "circle", this.x = t, this.y = e, this.radius = s;
        }
        clone() {
            return new Ii(this.x, this.y, this.radius);
        }
        contains(t, e) {
            if (this.radius <= 0) return !1;
            const s = this.radius * this.radius;
            let r = this.x - t, n = this.y - e;
            return r *= r, n *= n, r + n <= s;
        }
        strokeContains(t, e, s, r = .5) {
            if (this.radius === 0) return !1;
            const n = this.x - t, o = this.y - e, a = this.radius, h = (1 - r) * s, l = Math.sqrt(n * n + o * o);
            return l <= a + h && l > a - (s - h);
        }
        getBounds(t) {
            return t || (t = new j), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
        }
        copyFrom(t) {
            return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
        }
        copyTo(t) {
            return t.copyFrom(this), t;
        }
        toString() {
            return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
        }
    }
    class ki {
        constructor(t = 0, e = 0, s = 0, r = 0){
            this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = r;
        }
        clone() {
            return new ki(this.x, this.y, this.halfWidth, this.halfHeight);
        }
        contains(t, e) {
            if (this.halfWidth <= 0 || this.halfHeight <= 0) return !1;
            let s = (t - this.x) / this.halfWidth, r = (e - this.y) / this.halfHeight;
            return s *= s, r *= r, s + r <= 1;
        }
        strokeContains(t, e, s, r = .5) {
            const { halfWidth: n, halfHeight: o } = this;
            if (n <= 0 || o <= 0) return !1;
            const a = s * (1 - r), h = s - a, l = n - h, c = o - h, u = n + a, f = o + a, d = t - this.x, g = e - this.y, m = d * d / (l * l) + g * g / (c * c), p = d * d / (u * u) + g * g / (f * f);
            return m > 1 && p <= 1;
        }
        getBounds(t) {
            return t || (t = new j), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
        }
        copyFrom(t) {
            return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
        }
        copyTo(t) {
            return t.copyFrom(this), t;
        }
        toString() {
            return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
        }
    }
    function ya(i, t, e, s, r, n) {
        const o = i - e, a = t - s, h = r - e, l = n - s, c = o * h + a * l, u = h * h + l * l;
        let f = -1;
        u !== 0 && (f = c / u);
        let d, g;
        f < 0 ? (d = e, g = s) : f > 1 ? (d = r, g = n) : (d = e + f * h, g = s + f * l);
        const m = i - d, p = t - g;
        return m * m + p * p;
    }
    let xa, _a;
    class ee {
        constructor(...t){
            this.type = "polygon";
            let e = Array.isArray(t[0]) ? t[0] : t;
            if (typeof e[0] != "number") {
                const s = [];
                for(let r = 0, n = e.length; r < n; r++)s.push(e[r].x, e[r].y);
                e = s;
            }
            this.points = e, this.closePath = !0;
        }
        isClockwise() {
            let t = 0;
            const e = this.points, s = e.length;
            for(let r = 0; r < s; r += 2){
                const n = e[r], o = e[r + 1], a = e[(r + 2) % s], h = e[(r + 3) % s];
                t += (a - n) * (h + o);
            }
            return t < 0;
        }
        containsPolygon(t) {
            const e = this.getBounds(xa), s = t.getBounds(_a);
            if (!e.containsRect(s)) return !1;
            const r = t.points;
            for(let n = 0; n < r.length; n += 2){
                const o = r[n], a = r[n + 1];
                if (!this.contains(o, a)) return !1;
            }
            return !0;
        }
        clone() {
            const t = this.points.slice(), e = new ee(t);
            return e.closePath = this.closePath, e;
        }
        contains(t, e) {
            let s = !1;
            const r = this.points.length / 2;
            for(let n = 0, o = r - 1; n < r; o = n++){
                const a = this.points[n * 2], h = this.points[n * 2 + 1], l = this.points[o * 2], c = this.points[o * 2 + 1];
                h > e != c > e && t < (l - a) * ((e - h) / (c - h)) + a && (s = !s);
            }
            return s;
        }
        strokeContains(t, e, s, r = .5) {
            const n = s * s, o = n * (1 - r), a = n - o, { points: h } = this, l = h.length - (this.closePath ? 0 : 2);
            for(let c = 0; c < l; c += 2){
                const u = h[c], f = h[c + 1], d = h[(c + 2) % h.length], g = h[(c + 3) % h.length], m = ya(t, e, u, f, d, g), p = Math.sign((d - u) * (e - f) - (g - f) * (t - u));
                if (m <= (p < 0 ? a : o)) return !0;
            }
            return !1;
        }
        getBounds(t) {
            t || (t = new j);
            const e = this.points;
            let s = 1 / 0, r = -1 / 0, n = 1 / 0, o = -1 / 0;
            for(let a = 0, h = e.length; a < h; a += 2){
                const l = e[a], c = e[a + 1];
                s = l < s ? l : s, r = l > r ? l : r, n = c < n ? c : n, o = c > o ? c : o;
            }
            return t.x = s, t.width = r - s, t.y = n, t.height = o - n, t;
        }
        copyFrom(t) {
            return this.points = t.points.slice(), this.closePath = t.closePath, this;
        }
        copyTo(t) {
            return t.copyFrom(this), t;
        }
        toString() {
            return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e)=>`${t}, ${e}`, "")}]`;
        }
        get lastX() {
            return this.points[this.points.length - 2];
        }
        get lastY() {
            return this.points[this.points.length - 1];
        }
        get x() {
            return B("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2];
        }
        get y() {
            return B("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1];
        }
        get startX() {
            return this.points[0];
        }
        get startY() {
            return this.points[1];
        }
    }
    const Pe = (i, t, e, s, r, n, o)=>{
        const a = i - e, h = t - s, l = Math.sqrt(a * a + h * h);
        return l >= r - n && l <= r + o;
    };
    class Gi {
        constructor(t = 0, e = 0, s = 0, r = 0, n = 20){
            this.type = "roundedRectangle", this.x = t, this.y = e, this.width = s, this.height = r, this.radius = n;
        }
        getBounds(t) {
            return t || (t = new j), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
        }
        clone() {
            return new Gi(this.x, this.y, this.width, this.height, this.radius);
        }
        copyFrom(t) {
            return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
        }
        copyTo(t) {
            return t.copyFrom(this), t;
        }
        contains(t, e) {
            if (this.width <= 0 || this.height <= 0) return !1;
            if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
                const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
                if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s) return !0;
                let r = t - (this.x + s), n = e - (this.y + s);
                const o = s * s;
                if (r * r + n * n <= o || (r = t - (this.x + this.width - s), r * r + n * n <= o) || (n = e - (this.y + this.height - s), r * r + n * n <= o) || (r = t - (this.x + s), r * r + n * n <= o)) return !0;
            }
            return !1;
        }
        strokeContains(t, e, s, r = .5) {
            const { x: n, y: o, width: a, height: h, radius: l } = this, c = s * (1 - r), u = s - c, f = n + l, d = o + l, g = a - l * 2, m = h - l * 2, p = n + a, x = o + h;
            return (t >= n - c && t <= n + u || t >= p - u && t <= p + c) && e >= d && e <= d + m || (e >= o - c && e <= o + u || e >= x - u && e <= x + c) && t >= f && t <= f + g ? !0 : t < f && e < d && Pe(t, e, f, d, l, u, c) || t > p - l && e < d && Pe(t, e, p - l, d, l, u, c) || t > p - l && e > x - l && Pe(t, e, p - l, x - l, l, u, c) || t < f && e > x - l && Pe(t, e, f, x - l, l, u, c);
        }
        toString() {
            return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
        }
    }
    const zr = {};
    ba = function(i, t, e) {
        let s = 2166136261;
        for(let r = 0; r < t; r++)s ^= i[r].uid, s = Math.imul(s, 16777619), s >>>= 0;
        return zr[s] || wa(i, t, s, e);
    };
    function wa(i, t, e, s) {
        const r = {};
        let n = 0;
        for(let a = 0; a < s; a++){
            const h = a < t ? i[a] : D.EMPTY.source;
            r[n++] = h.source, r[n++] = h.style;
        }
        const o = new Ie(r);
        return zr[e] = o, o;
    }
    xs = class {
        constructor(t){
            typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
        }
        get int8View() {
            return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
        }
        get uint8View() {
            return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
        }
        get int16View() {
            return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
        }
        get int32View() {
            return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
        }
        get float64View() {
            return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
        }
        get bigUint64View() {
            return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
        }
        view(t) {
            return this[`${t}View`];
        }
        destroy() {
            this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
        }
        static sizeOf(t) {
            switch(t){
                case "int8":
                case "uint8":
                    return 1;
                case "int16":
                case "uint16":
                    return 2;
                case "int32":
                case "uint32":
                case "float32":
                    return 4;
                default:
                    throw new Error(`${t} isn't a valid view type`);
            }
        }
    };
    _s = function(i, t) {
        const e = i.byteLength / 8 | 0, s = new Float64Array(i, 0, e);
        new Float64Array(t, 0, e).set(s);
        const n = i.byteLength - e * 8;
        if (n > 0) {
            const o = new Uint8Array(i, e * 8, n);
            new Uint8Array(t, e * 8, n).set(o);
        }
    };
    const Ca = {
        normal: "normal-npm",
        add: "add-npm",
        screen: "screen-npm"
    };
    Sa = ((i)=>(i[i.DISABLED = 0] = "DISABLED", i[i.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", i[i.MASK_ACTIVE = 2] = "MASK_ACTIVE", i[i.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", i[i.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", i[i.NONE = 5] = "NONE", i))(Sa || {});
    bs = function(i, t) {
        return t.alphaMode === "no-premultiply-alpha" && Ca[i] || i;
    };
    const Aa = [
        "precision mediump float;",
        "void main(void){",
        "float test = 0.1;",
        "%forloop%",
        "gl_FragColor = vec4(0.0);",
        "}"
    ].join(`
`);
    function va(i) {
        let t = "";
        for(let e = 0; e < i; ++e)e > 0 && (t += `
else `), e < i - 1 && (t += `if(test == ${e}.0){}`);
        return t;
    }
    Ta = function(i, t) {
        if (i === 0) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
        const e = t.createShader(t.FRAGMENT_SHADER);
        try {
            for(;;){
                const s = Aa.replace(/%forloop%/gi, va(i));
                if (t.shaderSource(e, s), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS)) i = i / 2 | 0;
                else break;
            }
        } finally{
            t.deleteShader(e);
        }
        return i;
    };
    let kt = null;
    function Ma() {
        if (kt) return kt;
        const i = vr();
        return kt = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), kt = Ta(kt, i), i.getExtension("WEBGL_lose_context")?.loseContext(), kt;
    }
    class Pa {
        constructor(){
            this.ids = Object.create(null), this.textures = [], this.count = 0;
        }
        clear() {
            for(let t = 0; t < this.count; t++){
                const e = this.textures[t];
                this.textures[t] = null, this.ids[e.uid] = null;
            }
            this.count = 0;
        }
    }
    class Ea {
        constructor(){
            this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Pa, this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
        }
        destroy() {
            this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
        }
    }
    const Xr = [];
    let wi = 0;
    function ws() {
        return wi > 0 ? Xr[--wi] : new Ea;
    }
    function Cs(i) {
        Xr[wi++] = i;
    }
    let Xt = 0;
    const Wr = class $r {
        constructor(t){
            this.uid = z("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], t = {
                ...$r.defaultOptions,
                ...t
            }, t.maxTextures || (B("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = Ma());
            const { maxTextures: e, attributesInitialSize: s, indicesInitialSize: r } = t;
            this.attributeBuffer = new xs(s * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
        }
        begin() {
            this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
            for(let t = 0; t < this.batchIndex; t++)Cs(this.batches[t]);
            this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
        }
        add(t) {
            this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
        }
        checkAndUpdateTexture(t, e) {
            const s = t._batch.textures.ids[e._source.uid];
            return !s && s !== 0 ? !1 : (t._textureId = s, t.texture = e, !0);
        }
        updateElement(t) {
            this.dirty = !0;
            const e = this.attributeBuffer;
            t.packAsQuad ? this.packQuadAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId) : this.packAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId);
        }
        break(t) {
            const e = this._elements;
            if (!e[this.elementStart]) return;
            let s = ws(), r = s.textures;
            r.clear();
            const n = e[this.elementStart];
            let o = bs(n.blendMode, n.texture._source), a = n.topology;
            this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
            const h = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
            let u = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch";
            const g = this.maxTextures;
            for(let m = this.elementStart; m < this.elementSize; ++m){
                const p = e[m];
                e[m] = null;
                const y = p.texture._source, _ = bs(p.blendMode, y), b = o !== _ || a !== p.topology;
                if (y._batchTick === Xt && !b) {
                    p._textureId = y._textureBindLocation, u += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(p, h, l, p._attributeStart, p._textureId), this.packQuadIndex(c, p._indexStart, p._attributeStart / this.vertexSize)) : (this.packAttributes(p, h, l, p._attributeStart, p._textureId), this.packIndex(p, c, p._indexStart, p._attributeStart / this.vertexSize)), p._batch = s;
                    continue;
                }
                y._batchTick = Xt, (r.count >= g || b) && (this._finishBatch(s, f, u - f, r, o, a, t, d), d = "renderBatch", f = u, o = _, a = p.topology, s = ws(), r = s.textures, r.clear(), ++Xt), p._textureId = y._textureBindLocation = r.count, r.ids[y.uid] = r.count, r.textures[r.count++] = y, p._batch = s, u += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(p, h, l, p._attributeStart, p._textureId), this.packQuadIndex(c, p._indexStart, p._attributeStart / this.vertexSize)) : (this.packAttributes(p, h, l, p._attributeStart, p._textureId), this.packIndex(p, c, p._indexStart, p._attributeStart / this.vertexSize));
            }
            r.count > 0 && (this._finishBatch(s, f, u - f, r, o, a, t, d), f = u, ++Xt), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = u;
        }
        _finishBatch(t, e, s, r, n, o, a, h) {
            t.gpuBindGroup = null, t.bindGroup = null, t.action = h, t.batcher = this, t.textures = r, t.blendMode = n, t.topology = o, t.start = e, t.size = s, ++Xt, this.batches[this.batchIndex++] = t, a.add(t);
        }
        finish(t) {
            this.break(t);
        }
        ensureAttributeBuffer(t) {
            t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
        }
        ensureIndexBuffer(t) {
            t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
        }
        _resizeAttributeBuffer(t) {
            const e = Math.max(t, this.attributeBuffer.size * 2), s = new xs(e);
            _s(this.attributeBuffer.rawBinaryData, s.rawBinaryData), this.attributeBuffer = s;
        }
        _resizeIndexBuffer(t) {
            const e = this.indexBuffer;
            let s = Math.max(t, e.length * 1.5);
            s += s % 2;
            const r = s > 65535 ? new Uint32Array(s) : new Uint16Array(s);
            if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT) for(let n = 0; n < e.length; n++)r[n] = e[n];
            else _s(e.buffer, r.buffer);
            this.indexBuffer = r;
        }
        packQuadIndex(t, e, s) {
            t[e] = s + 0, t[e + 1] = s + 1, t[e + 2] = s + 2, t[e + 3] = s + 0, t[e + 4] = s + 2, t[e + 5] = s + 3;
        }
        packIndex(t, e, s, r) {
            const n = t.indices, o = t.indexSize, a = t.indexOffset, h = t.attributeOffset;
            for(let l = 0; l < o; l++)e[s++] = r + n[l + a] - h;
        }
        destroy() {
            for(let t = 0; t < this.batches.length; t++)Cs(this.batches[t]);
            this.batches = null;
            for(let t = 0; t < this._elements.length; t++)this._elements[t]._batch = null;
            this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
        }
    };
    Wr.defaultOptions = {
        maxTextures: null,
        attributesInitialSize: 4,
        indicesInitialSize: 6
    };
    let Ra = Wr;
    J = ((i)=>(i[i.MAP_READ = 1] = "MAP_READ", i[i.MAP_WRITE = 2] = "MAP_WRITE", i[i.COPY_SRC = 4] = "COPY_SRC", i[i.COPY_DST = 8] = "COPY_DST", i[i.INDEX = 16] = "INDEX", i[i.VERTEX = 32] = "VERTEX", i[i.UNIFORM = 64] = "UNIFORM", i[i.STORAGE = 128] = "STORAGE", i[i.INDIRECT = 256] = "INDIRECT", i[i.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", i[i.STATIC = 1024] = "STATIC", i))(J || {});
    le = class extends mt {
        constructor(t){
            let { data: e, size: s } = t;
            const { usage: r, label: n, shrinkToFit: o } = t;
            super(), this.uid = z("buffer"), this._resourceType = "buffer", this._resourceId = z("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, s ?? (s = e?.byteLength);
            const a = !!e;
            this.descriptor = {
                size: s,
                usage: r,
                mappedAtCreation: a,
                label: n
            }, this.shrinkToFit = o ?? !0;
        }
        get data() {
            return this._data;
        }
        set data(t) {
            this.setDataWithSize(t, t.length, !0);
        }
        get dataInt32() {
            return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32;
        }
        get static() {
            return !!(this.descriptor.usage & J.STATIC);
        }
        set static(t) {
            t ? this.descriptor.usage |= J.STATIC : this.descriptor.usage &= ~J.STATIC;
        }
        setDataWithSize(t, e, s) {
            if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
                s && this.emit("update", this);
                return;
            }
            const r = this._data;
            if (this._data = t, this._dataInt32 = null, !r || r.length !== t.length) {
                !this.shrinkToFit && r && t.byteLength < r.byteLength ? s && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = z("resource"), this.emit("change", this));
                return;
            }
            s && this.emit("update", this);
        }
        update(t) {
            this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
        }
        destroy() {
            this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
        }
    };
    function jr(i, t) {
        if (!(i instanceof le)) {
            let e = t ? J.INDEX : J.VERTEX;
            i instanceof Array && (t ? (i = new Uint32Array(i), e = J.INDEX | J.COPY_DST) : (i = new Float32Array(i), e = J.VERTEX | J.COPY_DST)), i = new le({
                data: i,
                label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
                usage: e
            });
        }
        return i;
    }
    function Ia(i, t, e) {
        const s = i.getAttribute(t);
        if (!s) return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
        const r = s.buffer.data;
        let n = 1 / 0, o = 1 / 0, a = -1 / 0, h = -1 / 0;
        const l = r.BYTES_PER_ELEMENT, c = (s.offset || 0) / l, u = (s.stride || 2 * 4) / l;
        for(let f = c; f < r.length; f += u){
            const d = r[f], g = r[f + 1];
            d > a && (a = d), g > h && (h = g), d < n && (n = d), g < o && (o = g);
        }
        return e.minX = n, e.minY = o, e.maxX = a, e.maxY = h, e;
    }
    function ka(i) {
        return (i instanceof le || Array.isArray(i) || i.BYTES_PER_ELEMENT) && (i = {
            buffer: i
        }), i.buffer = jr(i.buffer, !1), i;
    }
    Ga = class extends mt {
        constructor(t = {}){
            super(), this.uid = z("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new ht, this._boundsDirty = !0;
            const { attributes: e, indexBuffer: s, topology: r } = t;
            if (this.buffers = [], this.attributes = {}, e) for(const n in e)this.addAttribute(n, e[n]);
            this.instanceCount = t.instanceCount ?? 1, s && this.addIndex(s), this.topology = r || "triangle-list";
        }
        onBufferUpdate() {
            this._boundsDirty = !0, this.emit("update", this);
        }
        getAttribute(t) {
            return this.attributes[t];
        }
        getIndex() {
            return this.indexBuffer;
        }
        getBuffer(t) {
            return this.getAttribute(t).buffer;
        }
        getSize() {
            for(const t in this.attributes){
                const e = this.attributes[t];
                return e.buffer.data.length / (e.stride / 4 || e.size);
            }
            return 0;
        }
        addAttribute(t, e) {
            const s = ka(e);
            this.buffers.indexOf(s.buffer) === -1 && (this.buffers.push(s.buffer), s.buffer.on("update", this.onBufferUpdate, this), s.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = s;
        }
        addIndex(t) {
            this.indexBuffer = jr(t, !0), this.buffers.push(this.indexBuffer);
        }
        get bounds() {
            return this._boundsDirty ? (this._boundsDirty = !1, Ia(this, "aPosition", this._bounds)) : this._bounds;
        }
        destroy(t = !1) {
            this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e)=>e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
        }
    };
    const Ba = new Float32Array(1), Da = new Uint32Array(1);
    class Oa extends Ga {
        constructor(){
            const e = new le({
                data: Ba,
                label: "attribute-batch-buffer",
                usage: J.VERTEX | J.COPY_DST,
                shrinkToFit: !1
            }), s = new le({
                data: Da,
                label: "index-batch-buffer",
                usage: J.INDEX | J.COPY_DST,
                shrinkToFit: !1
            }), r = 6 * 4;
            super({
                attributes: {
                    aPosition: {
                        buffer: e,
                        format: "float32x2",
                        stride: r,
                        offset: 0
                    },
                    aUV: {
                        buffer: e,
                        format: "float32x2",
                        stride: r,
                        offset: 2 * 4
                    },
                    aColor: {
                        buffer: e,
                        format: "unorm8x4",
                        stride: r,
                        offset: 4 * 4
                    },
                    aTextureIdAndRound: {
                        buffer: e,
                        format: "uint16x2",
                        stride: r,
                        offset: 5 * 4
                    }
                },
                indexBuffer: s
            });
        }
    }
    function Ss(i, t, e) {
        if (i) for(const s in i){
            const r = s.toLocaleLowerCase(), n = t[r];
            if (n) {
                let o = i[s];
                s === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
            } else tt(`${s} placement hook does not exist in shader`);
        }
    }
    const La = /\{\{(.*?)\}\}/g;
    function As(i) {
        const t = {};
        return (i.match(La)?.map((s)=>s.replace(/[{()}]/g, "")) ?? []).forEach((s)=>{
            t[s] = [];
        }), t;
    }
    function vs(i, t) {
        let e;
        const s = /@in\s+([^;]+);/g;
        for(; (e = s.exec(i)) !== null;)t.push(e[1]);
    }
    function Ts(i, t, e = !1) {
        const s = [];
        vs(t, s), i.forEach((a)=>{
            a.header && vs(a.header, s);
        });
        const r = s;
        e && r.sort();
        const n = r.map((a, h)=>`       @location(${h}) ${a},`).join(`
`);
        let o = t.replace(/@in\s+[^;]+;\s*/g, "");
        return o = o.replace("{{in}}", `
${n}
`), o;
    }
    function Ms(i, t) {
        let e;
        const s = /@out\s+([^;]+);/g;
        for(; (e = s.exec(i)) !== null;)t.push(e[1]);
    }
    function Fa(i) {
        const e = /\b(\w+)\s*:/g.exec(i);
        return e ? e[1] : "";
    }
    function Ha(i) {
        const t = /@.*?\s+/g;
        return i.replace(t, "");
    }
    function Na(i, t) {
        const e = [];
        Ms(t, e), i.forEach((h)=>{
            h.header && Ms(h.header, e);
        });
        let s = 0;
        const r = e.sort().map((h)=>h.indexOf("builtin") > -1 ? h : `@location(${s++}) ${h}`).join(`,
`), n = e.sort().map((h)=>`       var ${Ha(h)};`).join(`
`), o = `return VSOutput(
            ${e.sort().map((h)=>` ${Fa(h)}`).join(`,
`)});`;
        let a = t.replace(/@out\s+[^;]+;\s*/g, "");
        return a = a.replace("{{struct}}", `
${r}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
    }
    function Ps(i, t) {
        let e = i;
        for(const s in t){
            const r = t[s];
            r.join(`
`).length ? e = e.replace(`{{${s}}}`, `//-----${s} START-----//
${r.join(`
`)}
//----${s} FINISH----//`) : e = e.replace(`{{${s}}}`, "");
        }
        return e;
    }
    const xt = Object.create(null), ti = new Map;
    let Va = 0;
    function Ua({ template: i, bits: t }) {
        const e = qr(i, t);
        if (xt[e]) return xt[e];
        const { vertex: s, fragment: r } = za(i, t);
        return xt[e] = Kr(s, r, t), xt[e];
    }
    function Ya({ template: i, bits: t }) {
        const e = qr(i, t);
        return xt[e] || (xt[e] = Kr(i.vertex, i.fragment, t)), xt[e];
    }
    function za(i, t) {
        const e = t.map((o)=>o.vertex).filter((o)=>!!o), s = t.map((o)=>o.fragment).filter((o)=>!!o);
        let r = Ts(e, i.vertex, !0);
        r = Na(e, r);
        const n = Ts(s, i.fragment, !0);
        return {
            vertex: r,
            fragment: n
        };
    }
    function qr(i, t) {
        return t.map((e)=>(ti.has(e) || ti.set(e, Va++), ti.get(e))).sort((e, s)=>e - s).join("-") + i.vertex + i.fragment;
    }
    function Kr(i, t, e) {
        const s = As(i), r = As(t);
        return e.forEach((n)=>{
            Ss(n.vertex, s, n.name), Ss(n.fragment, r, n.name);
        }), {
            vertex: Ps(i, s),
            fragment: Ps(t, r)
        };
    }
    const Xa = `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`, Wa = `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`, $a = `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`, ja = `

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`, qa = {
        name: "global-uniforms-bit",
        vertex: {
            header: `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
        }
    }, Ka = {
        name: "global-uniforms-bit",
        vertex: {
            header: `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
        }
    };
    Za = function({ bits: i, name: t }) {
        const e = Ua({
            template: {
                fragment: Wa,
                vertex: Xa
            },
            bits: [
                qa,
                ...i
            ]
        });
        return Be.from({
            name: t,
            vertex: {
                source: e.vertex,
                entryPoint: "main"
            },
            fragment: {
                source: e.fragment,
                entryPoint: "main"
            }
        });
    };
    Qa = function({ bits: i, name: t }) {
        return new Mr({
            name: t,
            ...Ya({
                template: {
                    vertex: $a,
                    fragment: ja
                },
                bits: [
                    Ka,
                    ...i
                ]
            })
        });
    };
    let ei;
    Ja = {
        name: "color-bit",
        vertex: {
            header: `
            @in aColor: vec4<f32>;
        `,
            main: `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
        }
    };
    th = {
        name: "color-bit",
        vertex: {
            header: `
            in vec4 aColor;
        `,
            main: `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
        }
    };
    ei = {};
    function eh(i) {
        const t = [];
        if (i === 1) t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
        else {
            let e = 0;
            for(let s = 0; s < i; s++)t.push(`@group(1) @binding(${e++}) var textureSource${s + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${s + 1}: sampler;`);
        }
        return t.join(`
`);
    }
    function ih(i) {
        const t = [];
        if (i === 1) t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
        else {
            t.push("switch vTextureId {");
            for(let e = 0; e < i; e++)e === i - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
            t.push("}");
        }
        return t.join(`
`);
    }
    sh = function(i) {
        return ei[i] || (ei[i] = {
            name: "texture-batch-bit",
            vertex: {
                header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
                main: `
                vTextureId = aTextureIdAndRound.y;
            `,
                end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
            },
            fragment: {
                header: `
                @in @interpolate(flat) vTextureId: u32;

                ${eh(i)}
            `,
                main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${ih(i)}
            `
            }
        }), ei[i];
    };
    const ii = {};
    function rh(i) {
        const t = [];
        for(let e = 0; e < i; e++)e > 0 && t.push("else"), e < i - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
        return t.join(`
`);
    }
    nh = function(i) {
        return ii[i] || (ii[i] = {
            name: "texture-batch-bit",
            vertex: {
                header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
                main: `
                vTextureId = aTextureIdAndRound.y;
            `,
                end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
            },
            fragment: {
                header: `
                in float vTextureId;

                uniform sampler2D uTextures[${i}];

            `,
                main: `

                ${rh(i)}
            `
            }
        }), ii[i];
    };
    let Es;
    oh = {
        name: "round-pixels-bit",
        vertex: {
            header: `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
        }
    };
    ah = {
        name: "round-pixels-bit",
        vertex: {
            header: `
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
        }
    };
    Es = {};
    hh = function(i) {
        let t = Es[i];
        if (t) return t;
        const e = new Int32Array(i);
        for(let s = 0; s < i; s++)e[s] = s;
        return t = Es[i] = new Ir({
            uTextures: {
                value: e,
                type: "i32",
                size: i
            }
        }, {
            isStatic: !0
        }), t;
    };
    class lh extends Ei {
        constructor(t){
            const e = Qa({
                name: "batch",
                bits: [
                    th,
                    nh(t),
                    ah
                ]
            }), s = Za({
                name: "batch",
                bits: [
                    Ja,
                    sh(t),
                    oh
                ]
            });
            super({
                glProgram: e,
                gpuProgram: s,
                resources: {
                    batchSamplers: hh(t)
                }
            });
        }
    }
    let si = null;
    const Zr = class Qr extends Ra {
        constructor(t){
            super(t), this.geometry = new Oa, this.name = Qr.extension.name, this.vertexSize = 6, si ?? (si = new lh(t.maxTextures)), this.shader = si;
        }
        packAttributes(t, e, s, r, n) {
            const o = n << 16 | t.roundPixels & 65535, a = t.transform, h = a.a, l = a.b, c = a.c, u = a.d, f = a.tx, d = a.ty, { positions: g, uvs: m } = t, p = t.color, x = t.attributeOffset, y = x + t.attributeSize;
            for(let _ = x; _ < y; _++){
                const b = _ * 2, v = g[b], w = g[b + 1];
                e[r++] = h * v + c * w + f, e[r++] = u * w + l * v + d, e[r++] = m[b], e[r++] = m[b + 1], s[r++] = p, s[r++] = o;
            }
        }
        packQuadAttributes(t, e, s, r, n) {
            const o = t.texture, a = t.transform, h = a.a, l = a.b, c = a.c, u = a.d, f = a.tx, d = a.ty, g = t.bounds, m = g.maxX, p = g.minX, x = g.maxY, y = g.minY, _ = o.uvs, b = t.color, v = n << 16 | t.roundPixels & 65535;
            e[r + 0] = h * p + c * y + f, e[r + 1] = u * y + l * p + d, e[r + 2] = _.x0, e[r + 3] = _.y0, s[r + 4] = b, s[r + 5] = v, e[r + 6] = h * m + c * y + f, e[r + 7] = u * y + l * m + d, e[r + 8] = _.x1, e[r + 9] = _.y1, s[r + 10] = b, s[r + 11] = v, e[r + 12] = h * m + c * x + f, e[r + 13] = u * x + l * m + d, e[r + 14] = _.x2, e[r + 15] = _.y2, s[r + 16] = b, s[r + 17] = v, e[r + 18] = h * p + c * x + f, e[r + 19] = u * x + l * p + d, e[r + 20] = _.x3, e[r + 21] = _.y3, s[r + 22] = b, s[r + 23] = v;
        }
    };
    Zr.extension = {
        type: [
            G.Batcher
        ],
        name: "default"
    };
    ch = Zr;
    function uh(i, t, e, s, r, n, o, a = null) {
        let h = 0;
        e *= t, r *= n;
        const l = a.a, c = a.b, u = a.c, f = a.d, d = a.tx, g = a.ty;
        for(; h < o;){
            const m = i[e], p = i[e + 1];
            s[r] = l * m + u * p + d, s[r + 1] = c * m + f * p + g, r += n, e += t, h++;
        }
    }
    function dh(i, t, e, s) {
        let r = 0;
        for(t *= e; r < s;)i[t] = 0, i[t + 1] = 0, t += e, r++;
    }
    function Jr(i, t, e, s, r) {
        const n = t.a, o = t.b, a = t.c, h = t.d, l = t.tx, c = t.ty;
        e || (e = 0), s || (s = 2), r || (r = i.length / s - e);
        let u = e * s;
        for(let f = 0; f < r; f++){
            const d = i[u], g = i[u + 1];
            i[u] = n * d + a * g + l, i[u + 1] = o * d + h * g + c, u += s;
        }
    }
    const fh = new k;
    tn = class {
        constructor(){
            this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
        }
        get uvs() {
            return this.geometryData.uvs;
        }
        get positions() {
            return this.geometryData.vertices;
        }
        get indices() {
            return this.geometryData.indices;
        }
        get blendMode() {
            return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
        }
        get color() {
            const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, s = this.renderable;
            return s ? rr(e, s.groupColor) + (this.alpha * s.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
        }
        get transform() {
            return this.renderable?.groupTransform || fh;
        }
        copyTo(t) {
            t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology;
        }
        reset() {
            this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
        }
    };
    const ce = {
        extension: {
            type: G.ShapeBuilder,
            name: "circle"
        },
        build (i, t) {
            let e, s, r, n, o, a;
            if (i.type === "circle") {
                const b = i;
                if (o = a = b.radius, o <= 0) return !1;
                e = b.x, s = b.y, r = n = 0;
            } else if (i.type === "ellipse") {
                const b = i;
                if (o = b.halfWidth, a = b.halfHeight, o <= 0 || a <= 0) return !1;
                e = b.x, s = b.y, r = n = 0;
            } else {
                const b = i, v = b.width / 2, w = b.height / 2;
                e = b.x + v, s = b.y + w, o = a = Math.max(0, Math.min(b.radius, Math.min(v, w))), r = v - o, n = w - a;
            }
            if (r < 0 || n < 0) return !1;
            const h = Math.ceil(2.3 * Math.sqrt(o + a)), l = h * 8 + (r ? 4 : 0) + (n ? 4 : 0);
            if (l === 0) return !1;
            if (h === 0) return t[0] = t[6] = e + r, t[1] = t[3] = s + n, t[2] = t[4] = e - r, t[5] = t[7] = s - n, !0;
            let c = 0, u = h * 4 + (r ? 2 : 0) + 2, f = u, d = l, g = r + o, m = n, p = e + g, x = e - g, y = s + m;
            if (t[c++] = p, t[c++] = y, t[--u] = y, t[--u] = x, n) {
                const b = s - m;
                t[f++] = x, t[f++] = b, t[--d] = b, t[--d] = p;
            }
            for(let b = 1; b < h; b++){
                const v = Math.PI / 2 * (b / h), w = r + Math.cos(v) * o, C = n + Math.sin(v) * a, R = e + w, I = e - w, T = s + C, M = s - C;
                t[c++] = R, t[c++] = T, t[--u] = T, t[--u] = I, t[f++] = I, t[f++] = M, t[--d] = M, t[--d] = R;
            }
            g = r, m = n + a, p = e + g, x = e - g, y = s + m;
            const _ = s - m;
            return t[c++] = p, t[c++] = y, t[--d] = _, t[--d] = p, r && (t[c++] = x, t[c++] = y, t[--d] = _, t[--d] = x), !0;
        },
        triangulate (i, t, e, s, r, n) {
            if (i.length === 0) return;
            let o = 0, a = 0;
            for(let c = 0; c < i.length; c += 2)o += i[c], a += i[c + 1];
            o /= i.length / 2, a /= i.length / 2;
            let h = s;
            t[h * e] = o, t[h * e + 1] = a;
            const l = h++;
            for(let c = 0; c < i.length; c += 2)t[h * e] = i[c], t[h * e + 1] = i[c + 1], c > 0 && (r[n++] = h, r[n++] = l, r[n++] = h - 1), h++;
            r[n++] = l + 1, r[n++] = l, r[n++] = h - 1;
        }
    }, ph = {
        ...ce,
        extension: {
            ...ce.extension,
            name: "ellipse"
        }
    }, gh = {
        ...ce,
        extension: {
            ...ce.extension,
            name: "roundedRectangle"
        }
    }, en = 1e-4, Rs = 1e-4;
    function mh(i) {
        const t = i.length;
        if (t < 6) return 1;
        let e = 0;
        for(let s = 0, r = i[t - 2], n = i[t - 1]; s < t; s += 2){
            const o = i[s], a = i[s + 1];
            e += (o - r) * (a + n), r = o, n = a;
        }
        return e < 0 ? -1 : 1;
    }
    function Is(i, t, e, s, r, n, o, a) {
        const h = i - e * r, l = t - s * r, c = i + e * n, u = t + s * n;
        let f, d;
        o ? (f = s, d = -e) : (f = -s, d = e);
        const g = h + f, m = l + d, p = c + f, x = u + d;
        return a.push(g, m), a.push(p, x), 2;
    }
    function St(i, t, e, s, r, n, o, a) {
        const h = e - i, l = s - t;
        let c = Math.atan2(h, l), u = Math.atan2(r - i, n - t);
        a && c < u ? c += Math.PI * 2 : !a && c > u && (u += Math.PI * 2);
        let f = c;
        const d = u - c, g = Math.abs(d), m = Math.sqrt(h * h + l * l), p = (15 * g * Math.sqrt(m) / Math.PI >> 0) + 1, x = d / p;
        if (f += x, a) {
            o.push(i, t), o.push(e, s);
            for(let y = 1, _ = f; y < p; y++, _ += x)o.push(i, t), o.push(i + Math.sin(_) * m, t + Math.cos(_) * m);
            o.push(i, t), o.push(r, n);
        } else {
            o.push(e, s), o.push(i, t);
            for(let y = 1, _ = f; y < p; y++, _ += x)o.push(i + Math.sin(_) * m, t + Math.cos(_) * m), o.push(i, t);
            o.push(r, n), o.push(i, t);
        }
        return p * 2;
    }
    function yh(i, t, e, s, r, n) {
        const o = en;
        if (i.length === 0) return;
        const a = t;
        let h = a.alignment;
        if (t.alignment !== .5) {
            let O = mh(i);
            e && (O *= -1), h = (h - .5) * O + .5;
        }
        const l = new K(i[0], i[1]), c = new K(i[i.length - 2], i[i.length - 1]), u = s, f = Math.abs(l.x - c.x) < o && Math.abs(l.y - c.y) < o;
        if (u) {
            i = i.slice(), f && (i.pop(), i.pop(), c.set(i[i.length - 2], i[i.length - 1]));
            const O = (l.x + c.x) * .5, yt = (c.y + l.y) * .5;
            i.unshift(O, yt), i.push(O, yt);
        }
        const d = r, g = i.length / 2;
        let m = i.length;
        const p = d.length / 2, x = a.width / 2, y = x * x, _ = a.miterLimit * a.miterLimit;
        let b = i[0], v = i[1], w = i[2], C = i[3], R = 0, I = 0, T = -(v - C), M = b - w, N = 0, V = 0, Q = Math.sqrt(T * T + M * M);
        T /= Q, M /= Q, T *= x, M *= x;
        const Ft = h, P = (1 - Ft) * 2, E = Ft * 2;
        u || (a.cap === "round" ? m += St(b - T * (P - E) * .5, v - M * (P - E) * .5, b - T * P, v - M * P, b + T * E, v + M * E, d, !0) + 2 : a.cap === "square" && (m += Is(b, v, T, M, P, E, !0, d))), d.push(b - T * P, v - M * P), d.push(b + T * E, v + M * E);
        for(let O = 1; O < g - 1; ++O){
            b = i[(O - 1) * 2], v = i[(O - 1) * 2 + 1], w = i[O * 2], C = i[O * 2 + 1], R = i[(O + 1) * 2], I = i[(O + 1) * 2 + 1], T = -(v - C), M = b - w, Q = Math.sqrt(T * T + M * M), T /= Q, M /= Q, T *= x, M *= x, N = -(C - I), V = w - R, Q = Math.sqrt(N * N + V * V), N /= Q, V /= Q, N *= x, V *= x;
            const yt = w - b, Ht = v - C, Nt = w - R, Vt = I - C, Oi = yt * Nt + Ht * Vt, de = Ht * Nt - Vt * yt, Ut = de < 0;
            if (Math.abs(de) < .001 * Math.abs(Oi)) {
                d.push(w - T * P, C - M * P), d.push(w + T * E, C + M * E), Oi >= 0 && (a.join === "round" ? m += St(w, C, w - T * P, C - M * P, w - N * P, C - V * P, d, !1) + 4 : m += 2, d.push(w - N * E, C - V * E), d.push(w + N * P, C + V * P));
                continue;
            }
            const Li = (-T + b) * (-M + C) - (-T + w) * (-M + v), Fi = (-N + R) * (-V + C) - (-N + w) * (-V + I), fe = (yt * Fi - Nt * Li) / de, pe = (Vt * Li - Ht * Fi) / de, Oe = (fe - w) * (fe - w) + (pe - C) * (pe - C), _t = w + (fe - w) * P, bt = C + (pe - C) * P, wt = w - (fe - w) * E, Ct = C - (pe - C) * E, cn = Math.min(yt * yt + Ht * Ht, Nt * Nt + Vt * Vt), Hi = Ut ? P : E, un = cn + Hi * Hi * y;
            Oe <= un ? a.join === "bevel" || Oe / y > _ ? (Ut ? (d.push(_t, bt), d.push(w + T * E, C + M * E), d.push(_t, bt), d.push(w + N * E, C + V * E)) : (d.push(w - T * P, C - M * P), d.push(wt, Ct), d.push(w - N * P, C - V * P), d.push(wt, Ct)), m += 2) : a.join === "round" ? Ut ? (d.push(_t, bt), d.push(w + T * E, C + M * E), m += St(w, C, w + T * E, C + M * E, w + N * E, C + V * E, d, !0) + 4, d.push(_t, bt), d.push(w + N * E, C + V * E)) : (d.push(w - T * P, C - M * P), d.push(wt, Ct), m += St(w, C, w - T * P, C - M * P, w - N * P, C - V * P, d, !1) + 4, d.push(w - N * P, C - V * P), d.push(wt, Ct)) : (d.push(_t, bt), d.push(wt, Ct)) : (d.push(w - T * P, C - M * P), d.push(w + T * E, C + M * E), a.join === "round" ? Ut ? m += St(w, C, w + T * E, C + M * E, w + N * E, C + V * E, d, !0) + 2 : m += St(w, C, w - T * P, C - M * P, w - N * P, C - V * P, d, !1) + 2 : a.join === "miter" && Oe / y <= _ && (Ut ? (d.push(wt, Ct), d.push(wt, Ct)) : (d.push(_t, bt), d.push(_t, bt)), m += 2), d.push(w - N * P, C - V * P), d.push(w + N * E, C + V * E), m += 2);
        }
        b = i[(g - 2) * 2], v = i[(g - 2) * 2 + 1], w = i[(g - 1) * 2], C = i[(g - 1) * 2 + 1], T = -(v - C), M = b - w, Q = Math.sqrt(T * T + M * M), T /= Q, M /= Q, T *= x, M *= x, d.push(w - T * P, C - M * P), d.push(w + T * E, C + M * E), u || (a.cap === "round" ? m += St(w - T * (P - E) * .5, C - M * (P - E) * .5, w - T * P, C - M * P, w + T * E, C + M * E, d, !1) + 2 : a.cap === "square" && (m += Is(w, C, T, M, P, E, !1, d)));
        const ln = Rs * Rs;
        for(let O = p; O < m + p - 2; ++O)b = d[O * 2], v = d[O * 2 + 1], w = d[(O + 1) * 2], C = d[(O + 1) * 2 + 1], R = d[(O + 2) * 2], I = d[(O + 2) * 2 + 1], !(Math.abs(b * (C - I) + w * (I - v) + R * (v - C)) < ln) && n.push(O, O + 1, O + 2);
    }
    function xh(i, t, e, s) {
        const r = en;
        if (i.length === 0) return;
        const n = i[0], o = i[1], a = i[i.length - 2], h = i[i.length - 1], l = t || Math.abs(n - a) < r && Math.abs(o - h) < r, c = e, u = i.length / 2, f = c.length / 2;
        for(let d = 0; d < u; d++)c.push(i[d * 2]), c.push(i[d * 2 + 1]);
        for(let d = 0; d < u - 1; d++)s.push(f + d, f + d + 1);
        l && s.push(f + u - 1, f);
    }
    function sn(i, t, e, s, r, n, o) {
        const a = ea(i, t, 2);
        if (!a) return;
        for(let l = 0; l < a.length; l += 3)n[o++] = a[l] + r, n[o++] = a[l + 1] + r, n[o++] = a[l + 2] + r;
        let h = r * s;
        for(let l = 0; l < i.length; l += 2)e[h] = i[l], e[h + 1] = i[l + 1], h += s;
    }
    const _h = [], bh = {
        extension: {
            type: G.ShapeBuilder,
            name: "polygon"
        },
        build (i, t) {
            for(let e = 0; e < i.points.length; e++)t[e] = i.points[e];
            return !0;
        },
        triangulate (i, t, e, s, r, n) {
            sn(i, _h, t, e, s, r, n);
        }
    }, wh = {
        extension: {
            type: G.ShapeBuilder,
            name: "rectangle"
        },
        build (i, t) {
            const e = i, s = e.x, r = e.y, n = e.width, o = e.height;
            return n > 0 && o > 0 ? (t[0] = s, t[1] = r, t[2] = s + n, t[3] = r, t[4] = s + n, t[5] = r + o, t[6] = s, t[7] = r + o, !0) : !1;
        },
        triangulate (i, t, e, s, r, n) {
            let o = 0;
            s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[6], t[s + o + 1] = i[7], o += e, t[s + o] = i[4], t[s + o + 1] = i[5], o += e;
            const a = s / e;
            r[n++] = a, r[n++] = a + 1, r[n++] = a + 2, r[n++] = a + 1, r[n++] = a + 3, r[n++] = a + 2;
        }
    }, Ch = {
        extension: {
            type: G.ShapeBuilder,
            name: "triangle"
        },
        build (i, t) {
            return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, !0;
        },
        triangulate (i, t, e, s, r, n) {
            let o = 0;
            s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[4], t[s + o + 1] = i[5];
            const a = s / e;
            r[n++] = a, r[n++] = a + 1, r[n++] = a + 2;
        }
    }, Sh = new k, Ah = new j;
    function vh(i, t, e, s) {
        const r = t.matrix ? i.copyFrom(t.matrix).invert() : i.identity();
        if (t.textureSpace === "local") {
            const o = e.getBounds(Ah);
            t.width && o.pad(t.width);
            const { x: a, y: h } = o, l = 1 / o.width, c = 1 / o.height, u = -a * l, f = -h * c, d = r.a, g = r.b, m = r.c, p = r.d;
            r.a *= l, r.b *= l, r.c *= c, r.d *= c, r.tx = u * d + f * m + r.tx, r.ty = u * g + f * p + r.ty;
        } else r.translate(t.texture.frame.x, t.texture.frame.y), r.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
        const n = t.texture.source.style;
        return !(t.fill instanceof ue) && n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update()), s && r.append(Sh.copyFrom(s).invert()), r;
    }
    const De = {};
    nt.handleByMap(G.ShapeBuilder, De);
    nt.add(wh, bh, Ch, ce, ph, gh);
    const Th = new j, Mh = new k;
    function Ph(i, t) {
        const { geometryData: e, batches: s } = t;
        s.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
        for(let r = 0; r < i.instructions.length; r++){
            const n = i.instructions[r];
            if (n.action === "texture") Eh(n.data, s, e);
            else if (n.action === "fill" || n.action === "stroke") {
                const o = n.action === "stroke", a = n.data.path.shapePath, h = n.data.style, l = n.data.hole;
                o && l && ks(l.shapePath, h, !0, s, e), l && (a.shapePrimitives[a.shapePrimitives.length - 1].holes = l.shapePath.shapePrimitives), ks(a, h, o, s, e);
            }
        }
    }
    function Eh(i, t, e) {
        const s = [], r = De.rectangle, n = Th;
        n.x = i.dx, n.y = i.dy, n.width = i.dw, n.height = i.dh;
        const o = i.transform;
        if (!r.build(n, s)) return;
        const { vertices: a, uvs: h, indices: l } = e, c = l.length, u = a.length / 2;
        o && Jr(s, o), r.triangulate(s, a, 2, u, l, c);
        const f = i.image, d = f.uvs;
        h.push(d.x0, d.y0, d.x1, d.y1, d.x3, d.y3, d.x2, d.y2);
        const g = pt.get(tn);
        g.indexOffset = c, g.indexSize = l.length - c, g.attributeOffset = u, g.attributeSize = a.length / 2 - u, g.baseColor = i.style, g.alpha = i.alpha, g.texture = f, g.geometryData = e, t.push(g);
    }
    function ks(i, t, e, s, r) {
        const { vertices: n, uvs: o, indices: a } = r;
        i.shapePrimitives.forEach(({ shape: h, transform: l, holes: c })=>{
            const u = [], f = De[h.type];
            if (!f.build(h, u)) return;
            const d = a.length, g = n.length / 2;
            let m = "triangle-list";
            if (l && Jr(u, l), e) {
                const _ = h.closePath ?? !0, b = t;
                b.pixelLine ? (xh(u, _, n, a), m = "line-list") : yh(u, b, !1, _, n, a);
            } else if (c) {
                const _ = [], b = u.slice();
                Rh(c).forEach((w)=>{
                    _.push(b.length / 2), b.push(...w);
                }), sn(b, _, n, 2, g, a, d);
            } else f.triangulate(u, n, 2, g, a, d);
            const p = o.length / 2, x = t.texture;
            if (x !== D.WHITE) {
                const _ = vh(Mh, t, h, l);
                uh(n, 2, g, o, p, 2, n.length / 2 - g, _);
            } else dh(o, p, 2, n.length / 2 - g);
            const y = pt.get(tn);
            y.indexOffset = d, y.indexSize = a.length - d, y.attributeOffset = g, y.attributeSize = n.length / 2 - g, y.baseColor = t.color, y.alpha = t.alpha, y.texture = x, y.geometryData = r, y.topology = m, s.push(y);
        });
    }
    function Rh(i) {
        const t = [];
        for(let e = 0; e < i.length; e++){
            const s = i[e].shape, r = [];
            De[s.type].build(s, r) && t.push(r);
        }
        return t;
    }
    class Ih {
        constructor(){
            this.batches = [], this.geometryData = {
                vertices: [],
                uvs: [],
                indices: []
            };
        }
    }
    class kh {
        constructor(){
            this.instructions = new hr;
        }
        init(t) {
            this.batcher = new ch({
                maxTextures: t
            }), this.instructions.reset();
        }
        get geometry() {
            return B(Sn, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
        }
    }
    const Bi = class Ci {
        constructor(t){
            this._gpuContextHash = {}, this._graphicsDataContextHash = Object.create(null), this._renderer = t, t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
        }
        init(t) {
            Ci.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? Ci.defaultOptions.bezierSmoothness;
        }
        getContextRenderData(t) {
            return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
        }
        updateGpuContext(t) {
            let e = this._gpuContextHash[t.uid] || this._initContext(t);
            if (t.dirty) {
                e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), Ph(t, e);
                const s = t.batchMode;
                t.customShader || s === "no-batch" ? e.isBatchable = !1 : s === "auto" ? e.isBatchable = e.geometryData.vertices.length < 400 : e.isBatchable = !0, t.dirty = !1;
            }
            return e;
        }
        getGpuContext(t) {
            return this._gpuContextHash[t.uid] || this._initContext(t);
        }
        _initContextRenderData(t) {
            const e = pt.get(kh, {
                maxTextures: this._renderer.limits.maxBatchableTextures
            }), { batches: s, geometryData: r } = this._gpuContextHash[t.uid], n = r.vertices.length, o = r.indices.length;
            for(let c = 0; c < s.length; c++)s[c].applyTransform = !1;
            const a = e.batcher;
            a.ensureAttributeBuffer(n), a.ensureIndexBuffer(o), a.begin();
            for(let c = 0; c < s.length; c++){
                const u = s[c];
                a.add(u);
            }
            a.finish(e.instructions);
            const h = a.geometry;
            h.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), h.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
            const l = a.batches;
            for(let c = 0; c < l.length; c++){
                const u = l[c];
                u.bindGroup = ba(u.textures.textures, u.textures.count, this._renderer.limits.maxBatchableTextures);
            }
            return this._graphicsDataContextHash[t.uid] = e, e;
        }
        _initContext(t) {
            const e = new Ih;
            return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
        }
        onGraphicsContextDestroy(t) {
            this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
        }
        _cleanGraphicsContextData(t) {
            const e = this._gpuContextHash[t.uid];
            e.isBatchable || this._graphicsDataContextHash[t.uid] && (pt.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((s)=>{
                pt.return(s);
            });
        }
        destroy() {
            for(const t in this._gpuContextHash)this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
        }
    };
    Bi.extension = {
        type: [
            G.WebGLSystem,
            G.WebGPUSystem,
            G.CanvasSystem
        ],
        name: "graphicsContext"
    };
    Bi.defaultOptions = {
        bezierSmoothness: .5
    };
    rn = Bi;
    const Gh = 8, Ee = 11920929e-14, Bh = 1;
    function nn(i, t, e, s, r, n, o, a, h, l) {
        const u = Math.min(.99, Math.max(0, l ?? rn.defaultOptions.bezierSmoothness));
        let f = (Bh - u) / 1;
        return f *= f, Dh(t, e, s, r, n, o, a, h, i, f), i;
    }
    function Dh(i, t, e, s, r, n, o, a, h, l) {
        Si(i, t, e, s, r, n, o, a, h, l, 0), h.push(o, a);
    }
    function Si(i, t, e, s, r, n, o, a, h, l, c) {
        if (c > Gh) return;
        const u = (i + e) / 2, f = (t + s) / 2, d = (e + r) / 2, g = (s + n) / 2, m = (r + o) / 2, p = (n + a) / 2, x = (u + d) / 2, y = (f + g) / 2, _ = (d + m) / 2, b = (g + p) / 2, v = (x + _) / 2, w = (y + b) / 2;
        if (c > 0) {
            let C = o - i, R = a - t;
            const I = Math.abs((e - o) * R - (s - a) * C), T = Math.abs((r - o) * R - (n - a) * C);
            if (I > Ee && T > Ee) {
                if ((I + T) * (I + T) <= l * (C * C + R * R)) {
                    h.push(v, w);
                    return;
                }
            } else if (I > Ee) {
                if (I * I <= l * (C * C + R * R)) {
                    h.push(v, w);
                    return;
                }
            } else if (T > Ee) {
                if (T * T <= l * (C * C + R * R)) {
                    h.push(v, w);
                    return;
                }
            } else if (C = v - (i + o) / 2, R = w - (t + a) / 2, C * C + R * R <= l) {
                h.push(v, w);
                return;
            }
        }
        Si(i, t, u, f, x, y, v, w, h, l, c + 1), Si(v, w, _, b, m, p, o, a, h, l, c + 1);
    }
    const Oh = 8, Lh = 11920929e-14, Fh = 1;
    function Hh(i, t, e, s, r, n, o, a) {
        const l = Math.min(.99, Math.max(0, a ?? rn.defaultOptions.bezierSmoothness));
        let c = (Fh - l) / 1;
        return c *= c, Nh(t, e, s, r, n, o, i, c), i;
    }
    function Nh(i, t, e, s, r, n, o, a) {
        Ai(o, i, t, e, s, r, n, a, 0), o.push(r, n);
    }
    function Ai(i, t, e, s, r, n, o, a, h) {
        if (h > Oh) return;
        const l = (t + s) / 2, c = (e + r) / 2, u = (s + n) / 2, f = (r + o) / 2, d = (l + u) / 2, g = (c + f) / 2;
        let m = n - t, p = o - e;
        const x = Math.abs((s - n) * p - (r - o) * m);
        if (x > Lh) {
            if (x * x <= a * (m * m + p * p)) {
                i.push(d, g);
                return;
            }
        } else if (m = d - (t + n) / 2, p = g - (e + o) / 2, m * m + p * p <= a) {
            i.push(d, g);
            return;
        }
        Ai(i, t, e, l, c, d, g, a, h + 1), Ai(i, d, g, u, f, n, o, a, h + 1);
    }
    function on(i, t, e, s, r, n, o, a) {
        let h = Math.abs(r - n);
        (!o && r > n || o && n > r) && (h = 2 * Math.PI - h), a || (a = Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (h / Math.PI)))), a = Math.max(a, 3);
        let l = h / a, c = r;
        l *= o ? -1 : 1;
        for(let u = 0; u < a + 1; u++){
            const f = Math.cos(c), d = Math.sin(c), g = t + f * s, m = e + d * s;
            i.push(g, m), c += l;
        }
    }
    function Vh(i, t, e, s, r, n) {
        const o = i[i.length - 2], h = i[i.length - 1] - e, l = o - t, c = r - e, u = s - t, f = Math.abs(h * u - l * c);
        if (f < 1e-8 || n === 0) {
            (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
            return;
        }
        const d = h * h + l * l, g = c * c + u * u, m = h * c + l * u, p = n * Math.sqrt(d) / f, x = n * Math.sqrt(g) / f, y = p * m / d, _ = x * m / g, b = p * u + x * l, v = p * c + x * h, w = l * (x + y), C = h * (x + y), R = u * (p + _), I = c * (p + _), T = Math.atan2(C - v, w - b), M = Math.atan2(I - v, R - b);
        on(i, b + t, v + e, n, T, M, l * c > u * h);
    }
    const ie = Math.PI * 2, ri = {
        centerX: 0,
        centerY: 0,
        ang1: 0,
        ang2: 0
    }, ni = ({ x: i, y: t }, e, s, r, n, o, a, h)=>{
        i *= e, t *= s;
        const l = r * i - n * t, c = n * i + r * t;
        return h.x = l + o, h.y = c + a, h;
    };
    function Uh(i, t) {
        const e = t === -1.5707963267948966 ? -.551915024494 : 1.3333333333333333 * Math.tan(t / 4), s = t === 1.5707963267948966 ? .551915024494 : e, r = Math.cos(i), n = Math.sin(i), o = Math.cos(i + t), a = Math.sin(i + t);
        return [
            {
                x: r - n * s,
                y: n + r * s
            },
            {
                x: o + a * s,
                y: a - o * s
            },
            {
                x: o,
                y: a
            }
        ];
    }
    const Gs = (i, t, e, s)=>{
        const r = i * s - t * e < 0 ? -1 : 1;
        let n = i * e + t * s;
        return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n);
    }, Yh = (i, t, e, s, r, n, o, a, h, l, c, u, f)=>{
        const d = Math.pow(r, 2), g = Math.pow(n, 2), m = Math.pow(c, 2), p = Math.pow(u, 2);
        let x = d * g - d * p - g * m;
        x < 0 && (x = 0), x /= d * p + g * m, x = Math.sqrt(x) * (o === a ? -1 : 1);
        const y = x * r / n * u, _ = x * -n / r * c, b = l * y - h * _ + (i + e) / 2, v = h * y + l * _ + (t + s) / 2, w = (c - y) / r, C = (u - _) / n, R = (-c - y) / r, I = (-u - _) / n, T = Gs(1, 0, w, C);
        let M = Gs(w, C, R, I);
        a === 0 && M > 0 && (M -= ie), a === 1 && M < 0 && (M += ie), f.centerX = b, f.centerY = v, f.ang1 = T, f.ang2 = M;
    };
    function zh(i, t, e, s, r, n, o, a = 0, h = 0, l = 0) {
        if (n === 0 || o === 0) return;
        const c = Math.sin(a * ie / 360), u = Math.cos(a * ie / 360), f = u * (t - s) / 2 + c * (e - r) / 2, d = -c * (t - s) / 2 + u * (e - r) / 2;
        if (f === 0 && d === 0) return;
        n = Math.abs(n), o = Math.abs(o);
        const g = Math.pow(f, 2) / Math.pow(n, 2) + Math.pow(d, 2) / Math.pow(o, 2);
        g > 1 && (n *= Math.sqrt(g), o *= Math.sqrt(g)), Yh(t, e, s, r, n, o, h, l, c, u, f, d, ri);
        let { ang1: m, ang2: p } = ri;
        const { centerX: x, centerY: y } = ri;
        let _ = Math.abs(p) / (ie / 4);
        Math.abs(1 - _) < 1e-7 && (_ = 1);
        const b = Math.max(Math.ceil(_), 1);
        p /= b;
        let v = i[i.length - 2], w = i[i.length - 1];
        const C = {
            x: 0,
            y: 0
        };
        for(let R = 0; R < b; R++){
            const I = Uh(m, p), { x: T, y: M } = ni(I[0], n, o, u, c, x, y, C), { x: N, y: V } = ni(I[1], n, o, u, c, x, y, C), { x: Q, y: Ft } = ni(I[2], n, o, u, c, x, y, C);
            nn(i, v, w, T, M, N, V, Q, Ft), v = Q, w = Ft, m += p;
        }
    }
    function Xh(i, t, e) {
        const s = (o, a)=>{
            const h = a.x - o.x, l = a.y - o.y, c = Math.sqrt(h * h + l * l), u = h / c, f = l / c;
            return {
                len: c,
                nx: u,
                ny: f
            };
        }, r = (o, a)=>{
            o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y);
        };
        let n = t[t.length - 1];
        for(let o = 0; o < t.length; o++){
            const a = t[o % t.length], h = a.radius ?? e;
            if (h <= 0) {
                r(o, a), n = a;
                continue;
            }
            const l = t[(o + 1) % t.length], c = s(a, n), u = s(a, l);
            if (c.len < 1e-4 || u.len < 1e-4) {
                r(o, a), n = a;
                continue;
            }
            let f = Math.asin(c.nx * u.ny - c.ny * u.nx), d = 1, g = !1;
            c.nx * u.nx - c.ny * -u.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, d = -1, g = !0) : f > 0 && (d = -1, g = !0);
            const m = f / 2;
            let p, x = Math.abs(Math.cos(m) * h / Math.sin(m));
            x > Math.min(c.len / 2, u.len / 2) ? (x = Math.min(c.len / 2, u.len / 2), p = Math.abs(x * Math.sin(m) / Math.cos(m))) : p = h;
            const y = a.x + u.nx * x + -u.ny * p * d, _ = a.y + u.ny * x + u.nx * p * d, b = Math.atan2(c.ny, c.nx) + Math.PI / 2 * d, v = Math.atan2(u.ny, u.nx) - Math.PI / 2 * d;
            o === 0 && i.moveTo(y + Math.cos(b) * p, _ + Math.sin(b) * p), i.arc(y, _, p, b, v, g), n = a;
        }
    }
    function Wh(i, t, e, s) {
        const r = (a, h)=>Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), n = (a, h, l)=>({
                x: a.x + (h.x - a.x) * l,
                y: a.y + (h.y - a.y) * l
            }), o = t.length;
        for(let a = 0; a < o; a++){
            const h = t[(a + 1) % o], l = h.radius ?? e;
            if (l <= 0) {
                a === 0 ? i.moveTo(h.x, h.y) : i.lineTo(h.x, h.y);
                continue;
            }
            const c = t[a], u = t[(a + 2) % o], f = r(c, h);
            let d;
            if (f < 1e-4) d = h;
            else {
                const p = Math.min(f / 2, l);
                d = n(h, c, p / f);
            }
            const g = r(u, h);
            let m;
            if (g < 1e-4) m = h;
            else {
                const p = Math.min(g / 2, l);
                m = n(h, u, p / g);
            }
            a === 0 ? i.moveTo(d.x, d.y) : i.lineTo(d.x, d.y), i.quadraticCurveTo(h.x, h.y, m.x, m.y, s);
        }
    }
    const $h = new j;
    class jh {
        constructor(t){
            this.shapePrimitives = [], this._currentPoly = null, this._bounds = new ht, this._graphicsPath2D = t, this.signed = t.checkForHoles;
        }
        moveTo(t, e) {
            return this.startPoly(t, e), this;
        }
        lineTo(t, e) {
            this._ensurePoly();
            const s = this._currentPoly.points, r = s[s.length - 2], n = s[s.length - 1];
            return (r !== t || n !== e) && s.push(t, e), this;
        }
        arc(t, e, s, r, n, o) {
            this._ensurePoly(!1);
            const a = this._currentPoly.points;
            return on(a, t, e, s, r, n, o), this;
        }
        arcTo(t, e, s, r, n) {
            this._ensurePoly();
            const o = this._currentPoly.points;
            return Vh(o, t, e, s, r, n), this;
        }
        arcToSvg(t, e, s, r, n, o, a) {
            const h = this._currentPoly.points;
            return zh(h, this._currentPoly.lastX, this._currentPoly.lastY, o, a, t, e, s, r, n), this;
        }
        bezierCurveTo(t, e, s, r, n, o, a) {
            this._ensurePoly();
            const h = this._currentPoly;
            return nn(this._currentPoly.points, h.lastX, h.lastY, t, e, s, r, n, o, a), this;
        }
        quadraticCurveTo(t, e, s, r, n) {
            this._ensurePoly();
            const o = this._currentPoly;
            return Hh(this._currentPoly.points, o.lastX, o.lastY, t, e, s, r, n), this;
        }
        closePath() {
            return this.endPoly(!0), this;
        }
        addPath(t, e) {
            this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
            const s = this.shapePrimitives, r = s.length;
            for(let n = 0; n < t.instructions.length; n++){
                const o = t.instructions[n];
                this[o.action](...o.data);
            }
            if (t.checkForHoles && s.length - r > 1) {
                let n = null;
                for(let o = r; o < s.length; o++){
                    const a = s[o];
                    if (a.shape.type === "polygon") {
                        const h = a.shape, l = n?.shape;
                        l && l.containsPolygon(h) ? (n.holes || (n.holes = []), n.holes.push(a), s.copyWithin(o, o + 1), s.length--, o--) : n = a;
                    }
                }
            }
            return this;
        }
        finish(t = !1) {
            this.endPoly(t);
        }
        rect(t, e, s, r, n) {
            return this.drawShape(new j(t, e, s, r), n), this;
        }
        circle(t, e, s, r) {
            return this.drawShape(new Ii(t, e, s), r), this;
        }
        poly(t, e, s) {
            const r = new ee(t);
            return r.closePath = e, this.drawShape(r, s), this;
        }
        regularPoly(t, e, s, r, n = 0, o) {
            r = Math.max(r | 0, 3);
            const a = -1 * Math.PI / 2 + n, h = Math.PI * 2 / r, l = [];
            for(let c = 0; c < r; c++){
                const u = a - c * h;
                l.push(t + s * Math.cos(u), e + s * Math.sin(u));
            }
            return this.poly(l, !0, o), this;
        }
        roundPoly(t, e, s, r, n, o = 0, a) {
            if (r = Math.max(r | 0, 3), n <= 0) return this.regularPoly(t, e, s, r, o);
            const h = s * Math.sin(Math.PI / r) - .001;
            n = Math.min(n, h);
            const l = -1 * Math.PI / 2 + o, c = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
            for(let f = 0; f < r; f++){
                const d = f * c + l, g = t + s * Math.cos(d), m = e + s * Math.sin(d), p = d + Math.PI + u, x = d - Math.PI - u, y = g + n * Math.cos(p), _ = m + n * Math.sin(p), b = g + n * Math.cos(x), v = m + n * Math.sin(x);
                f === 0 ? this.moveTo(y, _) : this.lineTo(y, _), this.quadraticCurveTo(g, m, b, v, a);
            }
            return this.closePath();
        }
        roundShape(t, e, s = !1, r) {
            return t.length < 3 ? this : (s ? Wh(this, t, e, r) : Xh(this, t, e), this.closePath());
        }
        filletRect(t, e, s, r, n) {
            if (n === 0) return this.rect(t, e, s, r);
            const o = Math.min(s, r) / 2, a = Math.min(o, Math.max(-o, n)), h = t + s, l = e + r, c = a < 0 ? -a : 0, u = Math.abs(a);
            return this.moveTo(t, e + u).arcTo(t + c, e + c, t + u, e, u).lineTo(h - u, e).arcTo(h - c, e + c, h, e + u, u).lineTo(h, l - u).arcTo(h - c, l - c, t + s - u, l, u).lineTo(t + u, l).arcTo(t + c, l - c, t, l - u, u).closePath();
        }
        chamferRect(t, e, s, r, n, o) {
            if (n <= 0) return this.rect(t, e, s, r);
            const a = Math.min(n, Math.min(s, r) / 2), h = t + s, l = e + r, c = [
                t + a,
                e,
                h - a,
                e,
                h,
                e + a,
                h,
                l - a,
                h - a,
                l,
                t + a,
                l,
                t,
                l - a,
                t,
                e + a
            ];
            for(let u = c.length - 1; u >= 2; u -= 2)c[u] === c[u - 2] && c[u - 1] === c[u - 3] && c.splice(u - 1, 2);
            return this.poly(c, !0, o);
        }
        ellipse(t, e, s, r, n) {
            return this.drawShape(new ki(t, e, s, r), n), this;
        }
        roundRect(t, e, s, r, n, o) {
            return this.drawShape(new Gi(t, e, s, r, n), o), this;
        }
        drawShape(t, e) {
            return this.endPoly(), this.shapePrimitives.push({
                shape: t,
                transform: e
            }), this;
        }
        startPoly(t, e) {
            let s = this._currentPoly;
            return s && this.endPoly(), s = new ee, s.points.push(t, e), this._currentPoly = s, this;
        }
        endPoly(t = !1) {
            const e = this._currentPoly;
            return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({
                shape: e
            })), this._currentPoly = null, this;
        }
        _ensurePoly(t = !0) {
            if (!this._currentPoly && (this._currentPoly = new ee, t)) {
                const e = this.shapePrimitives[this.shapePrimitives.length - 1];
                if (e) {
                    let s = e.shape.x, r = e.shape.y;
                    if (e.transform && !e.transform.isIdentity()) {
                        const n = e.transform, o = s;
                        s = n.a * s + n.c * r + n.tx, r = n.b * o + n.d * r + n.ty;
                    }
                    this._currentPoly.points.push(s, r);
                } else this._currentPoly.points.push(0, 0);
            }
        }
        buildPath() {
            const t = this._graphicsPath2D;
            this.shapePrimitives.length = 0, this._currentPoly = null;
            for(let e = 0; e < t.instructions.length; e++){
                const s = t.instructions[e];
                this[s.action](...s.data);
            }
            this.finish();
        }
        get bounds() {
            const t = this._bounds;
            t.clear();
            const e = this.shapePrimitives;
            for(let s = 0; s < e.length; s++){
                const r = e[s], n = r.shape.getBounds($h);
                r.transform ? t.addRect(n, r.transform) : t.addRect(n);
            }
            return t;
        }
    }
    class Lt {
        constructor(t, e = !1){
            this.instructions = [], this.uid = z("graphicsPath"), this._dirty = !0, this.checkForHoles = e, typeof t == "string" ? ma(t, this) : this.instructions = t?.slice() ?? [];
        }
        get shapePath() {
            return this._shapePath || (this._shapePath = new jh(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
        }
        addPath(t, e) {
            return t = t.clone(), this.instructions.push({
                action: "addPath",
                data: [
                    t,
                    e
                ]
            }), this._dirty = !0, this;
        }
        arc(...t) {
            return this.instructions.push({
                action: "arc",
                data: t
            }), this._dirty = !0, this;
        }
        arcTo(...t) {
            return this.instructions.push({
                action: "arcTo",
                data: t
            }), this._dirty = !0, this;
        }
        arcToSvg(...t) {
            return this.instructions.push({
                action: "arcToSvg",
                data: t
            }), this._dirty = !0, this;
        }
        bezierCurveTo(...t) {
            return this.instructions.push({
                action: "bezierCurveTo",
                data: t
            }), this._dirty = !0, this;
        }
        bezierCurveToShort(t, e, s, r, n) {
            const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(K.shared);
            let h = 0, l = 0;
            if (!o || o.action !== "bezierCurveTo") h = a.x, l = a.y;
            else {
                h = o.data[2], l = o.data[3];
                const c = a.x, u = a.y;
                h = c + (c - h), l = u + (u - l);
            }
            return this.instructions.push({
                action: "bezierCurveTo",
                data: [
                    h,
                    l,
                    t,
                    e,
                    s,
                    r,
                    n
                ]
            }), this._dirty = !0, this;
        }
        closePath() {
            return this.instructions.push({
                action: "closePath",
                data: []
            }), this._dirty = !0, this;
        }
        ellipse(...t) {
            return this.instructions.push({
                action: "ellipse",
                data: t
            }), this._dirty = !0, this;
        }
        lineTo(...t) {
            return this.instructions.push({
                action: "lineTo",
                data: t
            }), this._dirty = !0, this;
        }
        moveTo(...t) {
            return this.instructions.push({
                action: "moveTo",
                data: t
            }), this;
        }
        quadraticCurveTo(...t) {
            return this.instructions.push({
                action: "quadraticCurveTo",
                data: t
            }), this._dirty = !0, this;
        }
        quadraticCurveToShort(t, e, s) {
            const r = this.instructions[this.instructions.length - 1], n = this.getLastPoint(K.shared);
            let o = 0, a = 0;
            if (!r || r.action !== "quadraticCurveTo") o = n.x, a = n.y;
            else {
                o = r.data[0], a = r.data[1];
                const h = n.x, l = n.y;
                o = h + (h - o), a = l + (l - a);
            }
            return this.instructions.push({
                action: "quadraticCurveTo",
                data: [
                    o,
                    a,
                    t,
                    e,
                    s
                ]
            }), this._dirty = !0, this;
        }
        rect(t, e, s, r, n) {
            return this.instructions.push({
                action: "rect",
                data: [
                    t,
                    e,
                    s,
                    r,
                    n
                ]
            }), this._dirty = !0, this;
        }
        circle(t, e, s, r) {
            return this.instructions.push({
                action: "circle",
                data: [
                    t,
                    e,
                    s,
                    r
                ]
            }), this._dirty = !0, this;
        }
        roundRect(...t) {
            return this.instructions.push({
                action: "roundRect",
                data: t
            }), this._dirty = !0, this;
        }
        poly(...t) {
            return this.instructions.push({
                action: "poly",
                data: t
            }), this._dirty = !0, this;
        }
        regularPoly(...t) {
            return this.instructions.push({
                action: "regularPoly",
                data: t
            }), this._dirty = !0, this;
        }
        roundPoly(...t) {
            return this.instructions.push({
                action: "roundPoly",
                data: t
            }), this._dirty = !0, this;
        }
        roundShape(...t) {
            return this.instructions.push({
                action: "roundShape",
                data: t
            }), this._dirty = !0, this;
        }
        filletRect(...t) {
            return this.instructions.push({
                action: "filletRect",
                data: t
            }), this._dirty = !0, this;
        }
        chamferRect(...t) {
            return this.instructions.push({
                action: "chamferRect",
                data: t
            }), this._dirty = !0, this;
        }
        star(t, e, s, r, n, o, a) {
            n || (n = r / 2);
            const h = -1 * Math.PI / 2 + o, l = s * 2, c = Math.PI * 2 / l, u = [];
            for(let f = 0; f < l; f++){
                const d = f % 2 ? n : r, g = f * c + h;
                u.push(t + d * Math.cos(g), e + d * Math.sin(g));
            }
            return this.poly(u, !0, a), this;
        }
        clone(t = !1) {
            const e = new Lt;
            if (e.checkForHoles = this.checkForHoles, !t) e.instructions = this.instructions.slice();
            else for(let s = 0; s < this.instructions.length; s++){
                const r = this.instructions[s];
                e.instructions.push({
                    action: r.action,
                    data: r.data.slice()
                });
            }
            return e;
        }
        clear() {
            return this.instructions.length = 0, this._dirty = !0, this;
        }
        transform(t) {
            if (t.isIdentity()) return this;
            const e = t.a, s = t.b, r = t.c, n = t.d, o = t.tx, a = t.ty;
            let h = 0, l = 0, c = 0, u = 0, f = 0, d = 0, g = 0, m = 0;
            for(let p = 0; p < this.instructions.length; p++){
                const x = this.instructions[p], y = x.data;
                switch(x.action){
                    case "moveTo":
                    case "lineTo":
                        h = y[0], l = y[1], y[0] = e * h + r * l + o, y[1] = s * h + n * l + a;
                        break;
                    case "bezierCurveTo":
                        c = y[0], u = y[1], f = y[2], d = y[3], h = y[4], l = y[5], y[0] = e * c + r * u + o, y[1] = s * c + n * u + a, y[2] = e * f + r * d + o, y[3] = s * f + n * d + a, y[4] = e * h + r * l + o, y[5] = s * h + n * l + a;
                        break;
                    case "quadraticCurveTo":
                        c = y[0], u = y[1], h = y[2], l = y[3], y[0] = e * c + r * u + o, y[1] = s * c + n * u + a, y[2] = e * h + r * l + o, y[3] = s * h + n * l + a;
                        break;
                    case "arcToSvg":
                        h = y[5], l = y[6], g = y[0], m = y[1], y[0] = e * g + r * m, y[1] = s * g + n * m, y[5] = e * h + r * l + o, y[6] = s * h + n * l + a;
                        break;
                    case "circle":
                        y[4] = Wt(y[3], t);
                        break;
                    case "rect":
                        y[4] = Wt(y[4], t);
                        break;
                    case "ellipse":
                        y[8] = Wt(y[8], t);
                        break;
                    case "roundRect":
                        y[5] = Wt(y[5], t);
                        break;
                    case "addPath":
                        y[0].transform(t);
                        break;
                    case "poly":
                        y[2] = Wt(y[2], t);
                        break;
                    default:
                        tt("unknown transform action", x.action);
                        break;
                }
            }
            return this._dirty = !0, this;
        }
        get bounds() {
            return this.shapePath.bounds;
        }
        getLastPoint(t) {
            let e = this.instructions.length - 1, s = this.instructions[e];
            if (!s) return t.x = 0, t.y = 0, t;
            for(; s.action === "closePath";){
                if (e--, e < 0) return t.x = 0, t.y = 0, t;
                s = this.instructions[e];
            }
            switch(s.action){
                case "moveTo":
                case "lineTo":
                    t.x = s.data[0], t.y = s.data[1];
                    break;
                case "quadraticCurveTo":
                    t.x = s.data[2], t.y = s.data[3];
                    break;
                case "bezierCurveTo":
                    t.x = s.data[4], t.y = s.data[5];
                    break;
                case "arc":
                case "arcToSvg":
                    t.x = s.data[5], t.y = s.data[6];
                    break;
                case "addPath":
                    s.data[0].getLastPoint(t);
                    break;
            }
            return t;
        }
    }
    function Wt(i, t) {
        return i ? i.prepend(t) : t.clone();
    }
    function U(i, t, e) {
        const s = i.getAttribute(t);
        return s ? Number(s) : e;
    }
    function qh(i, t) {
        const e = i.querySelectorAll("defs");
        for(let s = 0; s < e.length; s++){
            const r = e[s];
            for(let n = 0; n < r.children.length; n++){
                const o = r.children[n];
                switch(o.nodeName.toLowerCase()){
                    case "lineargradient":
                        t.defs[o.id] = Kh(o);
                        break;
                    case "radialgradient":
                        t.defs[o.id] = Zh();
                        break;
                }
            }
        }
    }
    function Kh(i) {
        const t = U(i, "x1", 0), e = U(i, "y1", 0), s = U(i, "x2", 1), r = U(i, "y2", 0), n = i.getAttribute("gradientUnits") || "objectBoundingBox", o = new ue(t, e, s, r, n === "objectBoundingBox" ? "local" : "global");
        for(let a = 0; a < i.children.length; a++){
            const h = i.children[a], l = U(h, "offset", 0), c = rt.shared.setValue(h.getAttribute("stop-color")).toNumber();
            o.addColorStop(l, c);
        }
        return o;
    }
    function Zh(i) {
        return tt("[SVG Parser] Radial gradients are not yet supported"), new ue(0, 0, 1, 0);
    }
    function Bs(i) {
        const t = i.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
        return t ? t[1] : "";
    }
    const Ds = {
        fill: {
            type: "paint",
            default: 0
        },
        "fill-opacity": {
            type: "number",
            default: 1
        },
        stroke: {
            type: "paint",
            default: 0
        },
        "stroke-width": {
            type: "number",
            default: 1
        },
        "stroke-opacity": {
            type: "number",
            default: 1
        },
        "stroke-linecap": {
            type: "string",
            default: "butt"
        },
        "stroke-linejoin": {
            type: "string",
            default: "miter"
        },
        "stroke-miterlimit": {
            type: "number",
            default: 10
        },
        "stroke-dasharray": {
            type: "string",
            default: "none"
        },
        "stroke-dashoffset": {
            type: "number",
            default: 0
        },
        opacity: {
            type: "number",
            default: 1
        }
    };
    function an(i, t) {
        const e = i.getAttribute("style"), s = {}, r = {}, n = {
            strokeStyle: s,
            fillStyle: r,
            useFill: !1,
            useStroke: !1
        };
        for(const o in Ds){
            const a = i.getAttribute(o);
            a && Os(t, n, o, a.trim());
        }
        if (e) {
            const o = e.split(";");
            for(let a = 0; a < o.length; a++){
                const h = o[a].trim(), [l, c] = h.split(":");
                Ds[l] && Os(t, n, l, c.trim());
            }
        }
        return {
            strokeStyle: n.useStroke ? s : null,
            fillStyle: n.useFill ? r : null,
            useFill: n.useFill,
            useStroke: n.useStroke
        };
    }
    function Os(i, t, e, s) {
        switch(e){
            case "stroke":
                if (s !== "none") {
                    if (s.startsWith("url(")) {
                        const r = Bs(s);
                        t.strokeStyle.fill = i.defs[r];
                    } else t.strokeStyle.color = rt.shared.setValue(s).toNumber();
                    t.useStroke = !0;
                }
                break;
            case "stroke-width":
                t.strokeStyle.width = Number(s);
                break;
            case "fill":
                if (s !== "none") {
                    if (s.startsWith("url(")) {
                        const r = Bs(s);
                        t.fillStyle.fill = i.defs[r];
                    } else t.fillStyle.color = rt.shared.setValue(s).toNumber();
                    t.useFill = !0;
                }
                break;
            case "fill-opacity":
                t.fillStyle.alpha = Number(s);
                break;
            case "stroke-opacity":
                t.strokeStyle.alpha = Number(s);
                break;
            case "opacity":
                t.fillStyle.alpha = Number(s), t.strokeStyle.alpha = Number(s);
                break;
        }
    }
    function Qh(i, t) {
        if (typeof i == "string") {
            const o = document.createElement("div");
            o.innerHTML = i.trim(), i = o.querySelector("svg");
        }
        const e = {
            context: t,
            defs: {},
            path: new Lt
        };
        qh(i, e);
        const s = i.children, { fillStyle: r, strokeStyle: n } = an(i, e);
        for(let o = 0; o < s.length; o++){
            const a = s[o];
            a.nodeName.toLowerCase() !== "defs" && hn(a, e, r, n);
        }
        return t;
    }
    function hn(i, t, e, s) {
        const r = i.children, { fillStyle: n, strokeStyle: o } = an(i, t);
        n && e ? e = {
            ...e,
            ...n
        } : n && (e = n), o && s ? s = {
            ...s,
            ...o
        } : o && (s = o);
        const a = !e && !s;
        a && (e = {
            color: 0
        });
        let h, l, c, u, f, d, g, m, p, x, y, _, b, v, w, C, R;
        switch(i.nodeName.toLowerCase()){
            case "path":
                v = i.getAttribute("d"), i.getAttribute("fill-rule") === "evenodd" && tt("SVG Evenodd fill rule not supported, your svg may render incorrectly"), w = new Lt(v, !0), t.context.path(w), e && t.context.fill(e), s && t.context.stroke(s);
                break;
            case "circle":
                g = U(i, "cx", 0), m = U(i, "cy", 0), p = U(i, "r", 0), t.context.ellipse(g, m, p, p), e && t.context.fill(e), s && t.context.stroke(s);
                break;
            case "rect":
                h = U(i, "x", 0), l = U(i, "y", 0), C = U(i, "width", 0), R = U(i, "height", 0), x = U(i, "rx", 0), y = U(i, "ry", 0), x || y ? t.context.roundRect(h, l, C, R, x || y) : t.context.rect(h, l, C, R), e && t.context.fill(e), s && t.context.stroke(s);
                break;
            case "ellipse":
                g = U(i, "cx", 0), m = U(i, "cy", 0), x = U(i, "rx", 0), y = U(i, "ry", 0), t.context.beginPath(), t.context.ellipse(g, m, x, y), e && t.context.fill(e), s && t.context.stroke(s);
                break;
            case "line":
                c = U(i, "x1", 0), u = U(i, "y1", 0), f = U(i, "x2", 0), d = U(i, "y2", 0), t.context.beginPath(), t.context.moveTo(c, u), t.context.lineTo(f, d), s && t.context.stroke(s);
                break;
            case "polygon":
                b = i.getAttribute("points"), _ = b.match(/\d+/g).map((I)=>parseInt(I, 10)), t.context.poly(_, !0), e && t.context.fill(e), s && t.context.stroke(s);
                break;
            case "polyline":
                b = i.getAttribute("points"), _ = b.match(/\d+/g).map((I)=>parseInt(I, 10)), t.context.poly(_, !1), s && t.context.stroke(s);
                break;
            case "g":
            case "svg":
                break;
            default:
                {
                    tt(`[SVG parser] <${i.nodeName}> elements unsupported`);
                    break;
                }
        }
        a && (e = null);
        for(let I = 0; I < r.length; I++)hn(r[I], t, e, s);
    }
    function Jh(i) {
        return rt.isColorLike(i);
    }
    function Ls(i) {
        return i instanceof la;
    }
    function Fs(i) {
        return i instanceof ue;
    }
    function tl(i) {
        return i instanceof D;
    }
    function el(i, t, e) {
        const s = rt.shared.setValue(t ?? 0);
        return i.color = s.toNumber(), i.alpha = s.alpha === 1 ? e.alpha : s.alpha, i.texture = D.WHITE, {
            ...e,
            ...i
        };
    }
    function il(i, t, e) {
        return i.texture = t, {
            ...e,
            ...i
        };
    }
    function Hs(i, t, e) {
        return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, {
            ...e,
            ...i
        };
    }
    function Ns(i, t, e) {
        return t.buildGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, i.textureSpace = t.textureSpace, {
            ...e,
            ...i
        };
    }
    function sl(i, t) {
        const e = {
            ...t,
            ...i
        }, s = rt.shared.setValue(e.color);
        return e.alpha *= s.alpha, e.color = s.toNumber(), e;
    }
    Qt = function(i, t) {
        if (i == null) return null;
        const e = {}, s = i;
        return Jh(i) ? el(e, i, t) : tl(i) ? il(e, i, t) : Ls(i) ? Hs(e, i, t) : Fs(i) ? Ns(e, i, t) : s.fill && Ls(s.fill) ? Hs(s, s.fill, t) : s.fill && Fs(s.fill) ? Ns(s, s.fill, t) : sl(s, t);
    };
    Vs = function(i, t) {
        const { width: e, alignment: s, miterLimit: r, cap: n, join: o, pixelLine: a, ...h } = t, l = Qt(i, h);
        return l ? {
            width: e,
            alignment: s,
            miterLimit: r,
            cap: n,
            join: o,
            pixelLine: a,
            ...l
        } : null;
    };
    const rl = new K, Us = new k, Di = class ut extends mt {
        constructor(){
            super(...arguments), this.uid = z("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Lt, this._transform = new k, this._fillStyle = {
                ...ut.defaultFillStyle
            }, this._strokeStyle = {
                ...ut.defaultStrokeStyle
            }, this._stateStack = [], this._tick = 0, this._bounds = new ht, this._boundsDirty = !0;
        }
        clone() {
            const t = new ut;
            return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = {
                ...this._fillStyle
            }, t._strokeStyle = {
                ...this._strokeStyle
            }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
        }
        get fillStyle() {
            return this._fillStyle;
        }
        set fillStyle(t) {
            this._fillStyle = Qt(t, ut.defaultFillStyle);
        }
        get strokeStyle() {
            return this._strokeStyle;
        }
        set strokeStyle(t) {
            this._strokeStyle = Vs(t, ut.defaultStrokeStyle);
        }
        setFillStyle(t) {
            return this._fillStyle = Qt(t, ut.defaultFillStyle), this;
        }
        setStrokeStyle(t) {
            return this._strokeStyle = Qt(t, ut.defaultStrokeStyle), this;
        }
        texture(t, e, s, r, n, o) {
            return this.instructions.push({
                action: "texture",
                data: {
                    image: t,
                    dx: s || 0,
                    dy: r || 0,
                    dw: n || t.frame.width,
                    dh: o || t.frame.height,
                    transform: this._transform.clone(),
                    alpha: this._fillStyle.alpha,
                    style: e ? rt.shared.setValue(e).toNumber() : 16777215
                }
            }), this.onUpdate(), this;
        }
        beginPath() {
            return this._activePath = new Lt, this;
        }
        fill(t, e) {
            let s;
            const r = this.instructions[this.instructions.length - 1];
            return this._tick === 0 && r && r.action === "stroke" ? s = r.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (B(W, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = {
                color: t,
                alpha: e
            }), this._fillStyle = Qt(t, ut.defaultFillStyle)), this.instructions.push({
                action: "fill",
                data: {
                    style: this.fillStyle,
                    path: s
                }
            }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
        }
        _initNextPathLocation() {
            const { x: t, y: e } = this._activePath.getLastPoint(K.shared);
            this._activePath.clear(), this._activePath.moveTo(t, e);
        }
        stroke(t) {
            let e;
            const s = this.instructions[this.instructions.length - 1];
            return this._tick === 0 && s && s.action === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = Vs(t, ut.defaultStrokeStyle)), this.instructions.push({
                action: "stroke",
                data: {
                    style: this.strokeStyle,
                    path: e
                }
            }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
        }
        cut() {
            for(let t = 0; t < 2; t++){
                const e = this.instructions[this.instructions.length - 1 - t], s = this._activePath.clone();
                if (e && (e.action === "stroke" || e.action === "fill")) if (e.data.hole) e.data.hole.addPath(s);
                else {
                    e.data.hole = s;
                    break;
                }
            }
            return this._initNextPathLocation(), this;
        }
        arc(t, e, s, r, n, o) {
            this._tick++;
            const a = this._transform;
            return this._activePath.arc(a.a * t + a.c * e + a.tx, a.b * t + a.d * e + a.ty, s, r, n, o), this;
        }
        arcTo(t, e, s, r, n) {
            this._tick++;
            const o = this._transform;
            return this._activePath.arcTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * r + o.tx, o.b * s + o.d * r + o.ty, n), this;
        }
        arcToSvg(t, e, s, r, n, o, a) {
            this._tick++;
            const h = this._transform;
            return this._activePath.arcToSvg(t, e, s, r, n, h.a * o + h.c * a + h.tx, h.b * o + h.d * a + h.ty), this;
        }
        bezierCurveTo(t, e, s, r, n, o, a) {
            this._tick++;
            const h = this._transform;
            return this._activePath.bezierCurveTo(h.a * t + h.c * e + h.tx, h.b * t + h.d * e + h.ty, h.a * s + h.c * r + h.tx, h.b * s + h.d * r + h.ty, h.a * n + h.c * o + h.tx, h.b * n + h.d * o + h.ty, a), this;
        }
        closePath() {
            return this._tick++, this._activePath?.closePath(), this;
        }
        ellipse(t, e, s, r) {
            return this._tick++, this._activePath.ellipse(t, e, s, r, this._transform.clone()), this;
        }
        circle(t, e, s) {
            return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this;
        }
        path(t) {
            return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
        }
        lineTo(t, e) {
            this._tick++;
            const s = this._transform;
            return this._activePath.lineTo(s.a * t + s.c * e + s.tx, s.b * t + s.d * e + s.ty), this;
        }
        moveTo(t, e) {
            this._tick++;
            const s = this._transform, r = this._activePath.instructions, n = s.a * t + s.c * e + s.tx, o = s.b * t + s.d * e + s.ty;
            return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = o, this) : (this._activePath.moveTo(n, o), this);
        }
        quadraticCurveTo(t, e, s, r, n) {
            this._tick++;
            const o = this._transform;
            return this._activePath.quadraticCurveTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * r + o.tx, o.b * s + o.d * r + o.ty, n), this;
        }
        rect(t, e, s, r) {
            return this._tick++, this._activePath.rect(t, e, s, r, this._transform.clone()), this;
        }
        roundRect(t, e, s, r, n) {
            return this._tick++, this._activePath.roundRect(t, e, s, r, n, this._transform.clone()), this;
        }
        poly(t, e) {
            return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
        }
        regularPoly(t, e, s, r, n = 0, o) {
            return this._tick++, this._activePath.regularPoly(t, e, s, r, n, o), this;
        }
        roundPoly(t, e, s, r, n, o) {
            return this._tick++, this._activePath.roundPoly(t, e, s, r, n, o), this;
        }
        roundShape(t, e, s, r) {
            return this._tick++, this._activePath.roundShape(t, e, s, r), this;
        }
        filletRect(t, e, s, r, n) {
            return this._tick++, this._activePath.filletRect(t, e, s, r, n), this;
        }
        chamferRect(t, e, s, r, n, o) {
            return this._tick++, this._activePath.chamferRect(t, e, s, r, n, o), this;
        }
        star(t, e, s, r, n = 0, o = 0) {
            return this._tick++, this._activePath.star(t, e, s, r, n, o, this._transform.clone()), this;
        }
        svg(t) {
            return this._tick++, Qh(t, this), this;
        }
        restore() {
            const t = this._stateStack.pop();
            return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
        }
        save() {
            return this._stateStack.push({
                transform: this._transform.clone(),
                fillStyle: {
                    ...this._fillStyle
                },
                strokeStyle: {
                    ...this._strokeStyle
                }
            }), this;
        }
        getTransform() {
            return this._transform;
        }
        resetTransform() {
            return this._transform.identity(), this;
        }
        rotate(t) {
            return this._transform.rotate(t), this;
        }
        scale(t, e = t) {
            return this._transform.scale(t, e), this;
        }
        setTransform(t, e, s, r, n, o) {
            return t instanceof k ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, r, n, o), this);
        }
        transform(t, e, s, r, n, o) {
            return t instanceof k ? (this._transform.append(t), this) : (Us.set(t, e, s, r, n, o), this._transform.append(Us), this);
        }
        translate(t, e = t) {
            return this._transform.translate(t, e), this;
        }
        clear() {
            return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
        }
        onUpdate() {
            this.dirty || (this.emit("update", this, 16), this.dirty = !0, this._boundsDirty = !0);
        }
        get bounds() {
            if (!this._boundsDirty) return this._bounds;
            const t = this._bounds;
            t.clear();
            for(let e = 0; e < this.instructions.length; e++){
                const s = this.instructions[e], r = s.action;
                if (r === "fill") {
                    const n = s.data;
                    t.addBounds(n.path.bounds);
                } else if (r === "texture") {
                    const n = s.data;
                    t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
                }
                if (r === "stroke") {
                    const n = s.data, o = n.style.alignment, a = n.style.width * (1 - o), h = n.path.bounds;
                    t.addFrame(h.minX - a, h.minY - a, h.maxX + a, h.maxY + a);
                }
            }
            return t;
        }
        containsPoint(t) {
            if (!this.bounds.containsPoint(t.x, t.y)) return !1;
            const e = this.instructions;
            let s = !1;
            for(let r = 0; r < e.length; r++){
                const n = e[r], o = n.data, a = o.path;
                if (!n.action || !a) continue;
                const h = o.style, l = a.shapePath.shapePrimitives;
                for(let c = 0; c < l.length; c++){
                    const u = l[c].shape;
                    if (!h || !u) continue;
                    const f = l[c].transform, d = f ? f.applyInverse(t, rl) : t;
                    if (n.action === "fill") s = u.contains(d.x, d.y);
                    else {
                        const m = h;
                        s = u.strokeContains(d.x, d.y, m.width, m.alignment);
                    }
                    const g = o.hole;
                    if (g) {
                        const m = g.shapePath?.shapePrimitives;
                        if (m) for(let p = 0; p < m.length; p++)m[p].shape.contains(d.x, d.y) && (s = !1);
                    }
                    if (s) return !0;
                }
            }
            return s;
        }
        destroy(t = !1) {
            if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
                const s = typeof t == "boolean" ? t : t?.textureSource;
                this._fillStyle.texture && this._fillStyle.texture.destroy(s), this._strokeStyle.texture && this._strokeStyle.texture.destroy(s);
            }
            this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
        }
    };
    Di.defaultFillStyle = {
        color: 16777215,
        alpha: 1,
        texture: D.WHITE,
        matrix: null,
        fill: null,
        textureSpace: "local"
    };
    Di.defaultStrokeStyle = {
        width: 1,
        color: 16777215,
        alpha: 1,
        alignment: .5,
        miterLimit: 10,
        cap: "butt",
        join: "miter",
        texture: D.WHITE,
        matrix: null,
        fill: null,
        textureSpace: "local",
        pixelLine: !1
    };
    $t = Di;
    at = class extends lr {
        constructor(t){
            t instanceof $t && (t = {
                context: t
            });
            const { context: e, roundPixels: s, ...r } = t || {};
            super({
                label: "Graphics",
                ...r
            }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new $t, this._context.on("update", this.onViewUpdate, this), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = s ?? !1;
        }
        set context(t) {
            t !== this._context && (this._context.off("update", this.onViewUpdate, this), this._context = t, this._context.on("update", this.onViewUpdate, this), this.onViewUpdate());
        }
        get context() {
            return this._context;
        }
        get bounds() {
            return this._context.bounds;
        }
        updateBounds() {}
        containsPoint(t) {
            return this._context.containsPoint(t);
        }
        destroy(t) {
            this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || t?.context === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
        }
        _callContextMethod(t, e) {
            return this.context[t](...e), this;
        }
        setFillStyle(...t) {
            return this._callContextMethod("setFillStyle", t);
        }
        setStrokeStyle(...t) {
            return this._callContextMethod("setStrokeStyle", t);
        }
        fill(...t) {
            return this._callContextMethod("fill", t);
        }
        stroke(...t) {
            return this._callContextMethod("stroke", t);
        }
        texture(...t) {
            return this._callContextMethod("texture", t);
        }
        beginPath() {
            return this._callContextMethod("beginPath", []);
        }
        cut() {
            return this._callContextMethod("cut", []);
        }
        arc(...t) {
            return this._callContextMethod("arc", t);
        }
        arcTo(...t) {
            return this._callContextMethod("arcTo", t);
        }
        arcToSvg(...t) {
            return this._callContextMethod("arcToSvg", t);
        }
        bezierCurveTo(...t) {
            return this._callContextMethod("bezierCurveTo", t);
        }
        closePath() {
            return this._callContextMethod("closePath", []);
        }
        ellipse(...t) {
            return this._callContextMethod("ellipse", t);
        }
        circle(...t) {
            return this._callContextMethod("circle", t);
        }
        path(...t) {
            return this._callContextMethod("path", t);
        }
        lineTo(...t) {
            return this._callContextMethod("lineTo", t);
        }
        moveTo(...t) {
            return this._callContextMethod("moveTo", t);
        }
        quadraticCurveTo(...t) {
            return this._callContextMethod("quadraticCurveTo", t);
        }
        rect(...t) {
            return this._callContextMethod("rect", t);
        }
        roundRect(...t) {
            return this._callContextMethod("roundRect", t);
        }
        poly(...t) {
            return this._callContextMethod("poly", t);
        }
        regularPoly(...t) {
            return this._callContextMethod("regularPoly", t);
        }
        roundPoly(...t) {
            return this._callContextMethod("roundPoly", t);
        }
        roundShape(...t) {
            return this._callContextMethod("roundShape", t);
        }
        filletRect(...t) {
            return this._callContextMethod("filletRect", t);
        }
        chamferRect(...t) {
            return this._callContextMethod("chamferRect", t);
        }
        star(...t) {
            return this._callContextMethod("star", t);
        }
        svg(...t) {
            return this._callContextMethod("svg", t);
        }
        restore(...t) {
            return this._callContextMethod("restore", t);
        }
        save() {
            return this._callContextMethod("save", []);
        }
        getTransform() {
            return this.context.getTransform();
        }
        resetTransform() {
            return this._callContextMethod("resetTransform", []);
        }
        rotateTransform(...t) {
            return this._callContextMethod("rotate", t);
        }
        scaleTransform(...t) {
            return this._callContextMethod("scale", t);
        }
        setTransform(...t) {
            return this._callContextMethod("setTransform", t);
        }
        transform(...t) {
            return this._callContextMethod("transform", t);
        }
        translateTransform(...t) {
            return this._callContextMethod("translate", t);
        }
        clear() {
            return this._callContextMethod("clear", []);
        }
        get fillStyle() {
            return this._context.fillStyle;
        }
        set fillStyle(t) {
            this._context.fillStyle = t;
        }
        get strokeStyle() {
            return this._context.strokeStyle;
        }
        set strokeStyle(t) {
            this._context.strokeStyle = t;
        }
        clone(t = !1) {
            return t ? new at(this._context.clone()) : (this._ownedContext = null, new at(this._context));
        }
        lineStyle(t, e, s) {
            B(W, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
            const r = {};
            return t && (r.width = t), e && (r.color = e), s && (r.alpha = s), this.context.strokeStyle = r, this;
        }
        beginFill(t, e) {
            B(W, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
            const s = {};
            return t !== void 0 && (s.color = t), e !== void 0 && (s.alpha = e), this.context.fillStyle = s, this;
        }
        endFill() {
            B(W, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
            const t = this.context.strokeStyle;
            return (t.width !== $t.defaultStrokeStyle.width || t.color !== $t.defaultStrokeStyle.color || t.alpha !== $t.defaultStrokeStyle.alpha) && this.context.stroke(), this;
        }
        drawCircle(...t) {
            return B(W, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
        }
        drawEllipse(...t) {
            return B(W, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
        }
        drawPolygon(...t) {
            return B(W, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
        }
        drawRect(...t) {
            return B(W, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
        }
        drawRoundedRect(...t) {
            return B(W, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
        }
        drawStar(...t) {
            return B(W, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
        }
    };
    nt.add(pn, gn);
    var S = ((i)=>(i.Idle = "idle", i.Moving = "moving", i.Crouching = "crouching", i.Sliding = "sliding", i.Blocking = "blocking", i.Airborne = "airborne", i.Aiming = "aiming", i))(S || {}), X = ((i)=>(i[i.Throwing = 0] = "Throwing", i[i.Hanging = 1] = "Hanging", i[i.Returning = 2] = "Returning", i[i.Caught = 3] = "Caught", i))(X || {});
    const it = {
        WIDTH: 800,
        HEIGHT: 600,
        BACKGROUND_COLOR: 8900331,
        ANTIALIAS: !0
    }, Jt = {
        GRAVITY: {
            x: 0,
            y: 30
        },
        FIXED_TIME_STEP: 1 / 60,
        FALL_GRAVITY_MULTIPLIER: 3,
        MAX_FALL_SPEED: 450
    }, A = {
        WIDTH: 32,
        HEIGHT: 48,
        CROUCH_HEIGHT: 24,
        COLOR: 16739179,
        MOVE_SPEED: 180,
        CROUCH_MOVE_SPEED: 90,
        SLIDE_SPEED: 270,
        MAX_SLIDE_SPEED: 360,
        ACCELERATION_TIME: .2,
        DECELERATION_TIME: .15,
        SLIDE_DECELERATION: 150,
        SLIDE_TO_CROUCH_TIME: .5,
        FRICTION: .7,
        RESTITUTION: 0,
        VELOCITY_THRESHOLD: 10,
        GROUND_CHECK_DISTANCE: 2,
        WALL_SEPARATION_FORCE: 5,
        WALL_SLIDE_DAMPING: .9
    }, oi = {
        LERP_FACTOR: .1,
        OFFSET_Y: 0
    }, Pt = {
        GROUND: 4868682,
        PLATFORM: 6974058
    }, Y = {
        THROW_SPEED: 400,
        ACCELERATION_TIME: .1,
        HANG_TIME: .5,
        THROW_DISTANCE: 400,
        MIN_ANGLE: 110,
        MAX_ANGLE: 180,
        TRAJECTORY_PREVIEW_POINTS: 50,
        PREVIEW_COLOR: 16777215,
        PREVIEW_ALPHA: .5,
        PREVIEW_WIDTH: 2,
        GRACE_PERIOD: .5
    }, Et = {
        TIME_SCALE: .1,
        TRANSITION_SPEED: .15,
        OVERLAY_COLOR: 4474111,
        OVERLAY_ALPHA: .15,
        VIGNETTE_ALPHA: .3,
        PARTICLE_DENSITY: 20
    }, L = {
        PLAYER_STANDING: 1,
        PLAYER_CROUCHING: 2,
        ENVIRONMENT: 4,
        BOOMERANG: 8,
        ENEMY: 16
    };
    class nl {
        currentState;
        previousState;
        stateStartTime;
        constructor(t){
            this.currentState = t, this.previousState = t, this.stateStartTime = performance.now();
        }
        getCurrentState() {
            return this.currentState;
        }
        getPreviousState() {
            return this.previousState;
        }
        getTimeInCurrentState() {
            return (performance.now() - this.stateStartTime) / 1e3;
        }
        transition(t) {
            t !== this.currentState && (this.onExit(this.currentState), this.previousState = this.currentState, this.currentState = t, this.stateStartTime = performance.now(), this.onEnter(t));
        }
        update(t, e) {
            const s = this.getNextState(this.currentState, e);
            s !== this.currentState && this.transition(s), this.onUpdate(this.currentState, t, e);
        }
    }
    class ol extends nl {
        timeAtZeroVelocity = 0;
        wasMovingInSlide = !1;
        constructor(){
            super(S.Idle);
        }
        getNextState(t, e) {
            const { isGrounded: s, velocity: r } = e;
            if (!s) return S.Airborne;
            switch(t){
                case S.Idle:
                    if (Math.abs(r.x) > A.VELOCITY_THRESHOLD) return S.Moving;
                    break;
                case S.Moving:
                    if (Math.abs(r.x) <= A.VELOCITY_THRESHOLD) return S.Idle;
                    break;
                case S.Crouching:
                    break;
                case S.Sliding:
                    if (Math.abs(r.x) <= A.VELOCITY_THRESHOLD && this.timeAtZeroVelocity >= 1) return S.Crouching;
                    break;
                case S.Blocking:
                    break;
                case S.Airborne:
                    if (s) return Math.abs(r.x) > A.VELOCITY_THRESHOLD ? S.Moving : S.Idle;
                    break;
                case S.Aiming:
                    break;
            }
            return t;
        }
        onEnter(t) {
            t === S.Sliding && (this.timeAtZeroVelocity = 0, this.wasMovingInSlide = !0);
        }
        onExit(t) {}
        onUpdate(t, e, s) {
            if (t === S.Sliding) {
                const { velocity: r } = s;
                Math.abs(r.x) <= A.VELOCITY_THRESHOLD ? (this.wasMovingInSlide && (this.timeAtZeroVelocity = 0, this.wasMovingInSlide = !1), this.timeAtZeroVelocity += e) : this.wasMovingInSlide = !0;
            }
        }
        requestCrouch() {
            const t = this.getCurrentState();
            (t === S.Idle || t === S.Moving) && this.transition(S.Crouching);
        }
        requestStand() {
            this.getCurrentState() === S.Crouching && this.transition(S.Idle);
        }
        requestSlide(t) {
            this.getCurrentState() === S.Moving && Math.abs(t.x) >= A.MOVE_SPEED * .9 && this.transition(S.Sliding);
        }
        requestBlock(t) {
            const e = this.getCurrentState();
            !t && (e === S.Idle || e === S.Moving || e === S.Crouching) && this.transition(S.Blocking);
        }
        requestStopBlocking() {
            this.getCurrentState() === S.Blocking && this.transition(S.Idle);
        }
        requestStopSliding() {
            if (this.getCurrentState() === S.Sliding) {
                const t = Math.abs(this.previousContext?.velocity.x || 0) > A.VELOCITY_THRESHOLD;
                this.transition(t ? S.Moving : S.Idle);
            }
        }
        requestAiming() {
            const t = this.getCurrentState();
            (t === S.Idle || t === S.Moving) && this.transition(S.Aiming);
        }
        requestStopAiming() {
            this.getCurrentState() === S.Aiming && this.transition(S.Idle);
        }
        previousContext;
        update(t, e) {
            this.previousContext = e, super.update(t, e);
        }
    }
    function al(i, t, e) {
        return Math.abs(t - i) <= e ? t : i + Math.sign(t - i) * e;
    }
    class hl {
        keys = {};
        mouseY = 0;
        initialAimMouseY = 0;
        canvasRect = null;
        canvas = null;
        keydownHandler;
        keyupHandler;
        mousemoveHandler;
        resizeHandler;
        constructor(){
            this.keydownHandler = (t)=>{
                this.keys[t.code] = !0;
            }, this.keyupHandler = (t)=>{
                this.keys[t.code] = !1;
            }, this.mousemoveHandler = (t)=>{
                this.canvasRect && (this.mouseY = t.clientY - this.canvasRect.top);
            }, this.resizeHandler = ()=>{
                this.canvas && (this.canvasRect = this.canvas.getBoundingClientRect());
            }, this.setupListeners();
        }
        setupListeners() {
            window.addEventListener("keydown", this.keydownHandler), window.addEventListener("keyup", this.keyupHandler), window.addEventListener("mousemove", this.mousemoveHandler);
        }
        getActions() {
            return {
                moveLeft: !!(this.keys.KeyA || this.keys.ArrowLeft),
                moveRight: !!(this.keys.KeyD || this.keys.ArrowRight),
                crouch: !!(this.keys.KeyS || this.keys.ControlLeft || this.keys.ControlRight || this.keys.KeyC || this.keys.ArrowDown),
                action: !!this.keys.KeyF
            };
        }
        setCanvas(t) {
            this.canvas = t, this.canvasRect = t.getBoundingClientRect(), window.addEventListener("resize", this.resizeHandler);
        }
        getMouseY() {
            return this.mouseY;
        }
        setInitialAimMouseY() {
            this.initialAimMouseY = this.mouseY;
        }
        getMouseYDeltaFromAimStart() {
            return this.initialAimMouseY - this.mouseY;
        }
        destroy() {
            window.removeEventListener("keydown", this.keydownHandler), window.removeEventListener("keyup", this.keyupHandler), window.removeEventListener("mousemove", this.mousemoveHandler), window.removeEventListener("resize", this.resizeHandler);
        }
    }
    class ll {
        container;
        targetPosition = {
            x: 0,
            y: 0
        };
        constructor(t){
            this.container = t;
        }
        setTarget(t) {
            this.targetPosition = t;
        }
        update(t) {
            const e = -this.targetPosition.x + it.WIDTH / 2, s = -this.targetPosition.y + it.HEIGHT / 2 + oi.OFFSET_Y;
            this.container.x += (e - this.container.x) * oi.LERP_FACTOR, this.container.y += (s - this.container.y) * oi.LERP_FACTOR;
        }
        getPosition() {
            return {
                x: -this.container.x,
                y: -this.container.y
            };
        }
    }
    class cl {
        graphics;
        container;
        isVisible = !1;
        constructor(t){
            this.container = t, this.graphics = new at, this.graphics.alpha = Y.PREVIEW_ALPHA, this.container.addChild(this.graphics);
        }
        show() {
            this.isVisible = !0, this.graphics.visible = !0;
        }
        hide() {
            this.isVisible = !1, this.graphics.visible = !1, this.graphics.clear();
        }
        updateTrajectory(t, e, s) {
            if (!this.isVisible) return;
            this.graphics.clear();
            const r = e * Math.PI / 180, n = s ? 1 : -1, o = this.calculateTrajectoryPoints(t, r, n);
            this.drawTrajectoryLine(o);
        }
        calculateTrajectoryPoints(t, e, s) {
            const r = [], n = Y.TRAJECTORY_PREVIEW_POINTS;
            if (e >= 168 * Math.PI / 180) for(let a = 0; a <= n; a++){
                const h = a / n, l = t.x + Y.THROW_DISTANCE * h * s, c = t.y;
                r.push({
                    x: l,
                    y: c
                });
            }
            else {
                const h = (180 - e * 180 / Math.PI) / 60, l = Y.THROW_DISTANCE * .5 * h;
                for(let c = 0; c <= n; c++){
                    const u = c / n, f = t.x + Y.THROW_DISTANCE * u * s, d = l * u * u, g = t.y - d;
                    r.push({
                        x: f,
                        y: g
                    });
                }
            }
            return r;
        }
        drawTrajectoryLine(t) {
            if (!(t.length < 2)) {
                this.graphics.moveTo(t[0].x, t[0].y);
                for(let e = 1; e < t.length; e++)e % 2 === 0 ? this.graphics.moveTo(t[e].x, t[e].y) : this.graphics.lineTo(t[e].x, t[e].y);
                this.graphics.stroke({
                    width: Y.PREVIEW_WIDTH,
                    color: Y.PREVIEW_COLOR
                });
            }
        }
        destroy() {
            this.graphics.destroy();
        }
    }
    class ul {
        container;
        effectContainer;
        overlay;
        vignette;
        particles = [];
        currentScale = 1;
        targetScale = 1;
        transitionSpeed = Et.TRANSITION_SPEED;
        isActive = !1;
        constructor(t){
            this.container = t, this.effectContainer = new dt, this.effectContainer.zIndex = 1e3, this.overlay = new at, this.vignette = new at, this.effectContainer.addChild(this.overlay), this.effectContainer.addChild(this.vignette), this.container.addChild(this.effectContainer);
        }
        startTimeSlow() {
            this.isActive || (this.targetScale = Et.TIME_SCALE, this.isActive = !0, this.drawEffects(!0), this.createParticles());
        }
        stopTimeSlow() {
            this.isActive && (this.targetScale = 1, this.isActive = !1, this.clearParticles());
        }
        getIsActive() {
            return this.isActive;
        }
        update(t) {
            const e = this.targetScale - this.currentScale;
            this.currentScale += e * this.transitionSpeed;
            const s = 1 - this.currentScale;
            this.overlay.alpha = s * Et.OVERLAY_ALPHA, this.vignette.alpha = s * Et.VIGNETTE_ALPHA, this.isActive && this.updateParticles(t * .3), !this.isActive && this.currentScale > .99 && this.drawEffects(!1);
        }
        drawEffects(t) {
            const e = it.WIDTH, s = it.HEIGHT;
            if (this.overlay.clear(), this.vignette.clear(), t) {
                this.overlay.rect(0, 0, e, s), this.overlay.fill({
                    color: Et.OVERLAY_COLOR,
                    alpha: 1
                });
                const r = 100;
                this.vignette.rect(0, 0, e, r), this.vignette.fill({
                    color: 0,
                    alpha: .3
                }), this.vignette.rect(0, s - r, e, r), this.vignette.fill({
                    color: 0,
                    alpha: .3
                }), this.vignette.rect(0, 0, r, s), this.vignette.fill({
                    color: 0,
                    alpha: .3
                }), this.vignette.rect(e - r, 0, r, s), this.vignette.fill({
                    color: 0,
                    alpha: .3
                });
            }
        }
        createParticles() {
            for(let t = 0; t < Et.PARTICLE_DENSITY; t++){
                const e = new at;
                e.circle(0, 0, 2), e.fill({
                    color: 16777215,
                    alpha: .3
                });
                const s = Math.random() * it.WIDTH, r = Math.random() * it.HEIGHT;
                e.x = s, e.y = r, this.particles.push({
                    sprite: e,
                    x: s,
                    y: r,
                    vx: (Math.random() - .5) * 20,
                    vy: -Math.random() * 30 - 10,
                    alpha: Math.random() * .5 + .2
                }), this.effectContainer.addChild(e);
            }
        }
        updateParticles(t) {
            this.particles.forEach((e)=>{
                e.x += e.vx * t, e.y += e.vy * t, e.y < -10 && (e.y = it.HEIGHT + 10, e.x = Math.random() * it.WIDTH), e.sprite.x = e.x, e.sprite.y = e.y, e.sprite.alpha = e.alpha * (1 - this.currentScale);
            });
        }
        clearParticles() {
            this.particles.forEach((t)=>{
                t.sprite.destroy();
            }), this.particles = [];
        }
        destroy() {
            this.clearParticles(), this.overlay.destroy(), this.vignette.destroy(), this.effectContainer.destroy();
        }
    }
    class dl {
        world;
        rigidBody;
        collider;
        sprite;
        container;
        RAPIER;
        currentVelocityX = 0;
        targetVelocityX = 0;
        stateMachine;
        hasBoomerang = !0;
        isGrounded = !0;
        isFacingRight = !0;
        groundRaycast;
        leftWallRaycast;
        rightWallRaycast;
        previousState = S.Idle;
        trajectoryPreview;
        aimAngle = 180;
        isAiming = !1;
        isTouchingWall = !1;
        currentColliderHeight = A.HEIGHT;
        projectileManager = null;
        constructor(t, e, s, r, n){
            this.world = t, this.container = e, this.RAPIER = n, this.createRigidBody(s, r), this.createSprite(), this.stateMachine = new ol, this.groundRaycast = new n.Ray({
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 1
            }), this.leftWallRaycast = new n.Ray({
                x: 0,
                y: 0
            }, {
                x: -1,
                y: 0
            }), this.rightWallRaycast = new n.Ray({
                x: 0,
                y: 0
            }, {
                x: 1,
                y: 0
            }), this.trajectoryPreview = new cl(e);
        }
        createRigidBody(t, e) {
            const s = this.RAPIER.RigidBodyDesc.dynamic().setTranslation(t, e).lockRotations();
            this.rigidBody = this.world.createRigidBody(s);
            const r = this.RAPIER.ColliderDesc.cuboid(A.WIDTH / 2, A.HEIGHT / 2).setRestitution(A.RESTITUTION).setFriction(A.FRICTION).setCollisionGroups(L.PLAYER_STANDING, L.ENVIRONMENT | L.BOOMERANG | L.ENEMY);
            this.collider = this.world.createCollider(r, this.rigidBody), this.collider.setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
        }
        createSprite() {
            this.sprite = new at, this.sprite.rect(-A.WIDTH / 2, -A.HEIGHT / 2, A.WIDTH, A.HEIGHT), this.sprite.fill(A.COLOR), this.container.addChild(this.sprite);
        }
        update(t) {
            this.updateGroundedState(), this.updateWallDetection(), this.updateFriction(), this.updatePhysics(t), this.updateSprite(), this.updateStateMachine(t);
        }
        updatePhysics(t) {
            let s = this.rigidBody.linvel().y;
            if (!this.isGrounded && s > 0) {
                const n = Jt.GRAVITY.y * (Jt.FALL_GRAVITY_MULTIPLIER - 1) * t;
                s += n;
            }
            if (s > Jt.MAX_FALL_SPEED && (s = Jt.MAX_FALL_SPEED), this.stateMachine.getCurrentState() !== S.Sliding) {
                const n = this.targetVelocityX === 0 ? A.DECELERATION_TIME : A.ACCELERATION_TIME, o = Math.abs(this.targetVelocityX - this.currentVelocityX) * (t / n);
                this.currentVelocityX = al(this.currentVelocityX, this.targetVelocityX, o);
            }
            if (this.isTouchingWall && this.isGrounded) {
                const n = this.rigidBody.translation(), o = this.world.castRay(new this.RAPIER.Ray({
                    x: n.x,
                    y: n.y
                }, {
                    x: -1,
                    y: 0
                }), A.WIDTH / 2, !0, void 0, void 0, this.collider), a = this.world.castRay(new this.RAPIER.Ray({
                    x: n.x,
                    y: n.y
                }, {
                    x: 1,
                    y: 0
                }), A.WIDTH / 2, !0, void 0, void 0, this.collider);
                o && o.toi < A.WIDTH / 2 - 2 ? this.currentVelocityX = Math.max(this.currentVelocityX, A.WALL_SEPARATION_FORCE) : a && a.toi < A.WIDTH / 2 - 2 && (this.currentVelocityX = Math.min(this.currentVelocityX, -A.WALL_SEPARATION_FORCE));
            }
            this.rigidBody.setLinvel({
                x: this.currentVelocityX,
                y: s
            }, !0);
        }
        updateSprite() {
            const t = this.rigidBody.translation();
            this.sprite.x = t.x, this.sprite.y = t.y;
        }
        updateGroundedState() {
            const t = this.rigidBody.translation(), e = this.stateMachine.getCurrentState(), r = e === S.Crouching || e === S.Sliding ? A.CROUCH_HEIGHT : A.HEIGHT;
            this.groundRaycast.origin = {
                x: t.x,
                y: t.y + r / 2 - 1
            }, this.groundRaycast.dir = {
                x: 0,
                y: 1
            };
            const n = A.GROUND_CHECK_DISTANCE + 1, o = !0, a = this.world.castRay(this.groundRaycast, n, o, void 0, void 0, this.collider);
            this.isGrounded = a !== null && a.toi <= A.GROUND_CHECK_DISTANCE;
        }
        updateWallDetection() {
            const t = this.rigidBody.translation(), e = this.rigidBody.linvel(), s = this.stateMachine.getCurrentState(), r = s === S.Crouching || s === S.Sliding ? A.CROUCH_HEIGHT : A.HEIGHT, n = [
                -r / 2 + 2,
                0,
                r / 2 - 2
            ];
            let o = !1, a = !1;
            const h = A.WIDTH / 2 + 3, l = A.WIDTH / 2 + .5;
            for (const c of n){
                this.leftWallRaycast.origin = {
                    x: t.x,
                    y: t.y + c
                };
                const u = this.world.castRay(this.leftWallRaycast, h, !0, void 0, void 0, this.collider);
                u && u.toi <= l && (o = !0), this.rightWallRaycast.origin = {
                    x: t.x,
                    y: t.y + c
                };
                const f = this.world.castRay(this.rightWallRaycast, h, !0, void 0, void 0, this.collider);
                f && f.toi <= l && (a = !0);
            }
            if (this.isTouchingWall = o || a, this.isTouchingWall) {
                const c = A.WALL_SEPARATION_FORCE, u = A.WALL_SLIDE_DAMPING, f = this.isGrounded || Math.abs(e.y) < 50;
                o ? e.x < 0 && (f ? (this.rigidBody.setLinvel({
                    x: c,
                    y: e.y
                }, !0), this.currentVelocityX = 0, this.targetVelocityX = 0) : (this.rigidBody.setLinvel({
                    x: 0,
                    y: e.y
                }, !0), this.currentVelocityX = 0)) : a && e.x > 0 && (f ? (this.rigidBody.setLinvel({
                    x: -c,
                    y: e.y
                }, !0), this.currentVelocityX = 0, this.targetVelocityX = 0) : (this.rigidBody.setLinvel({
                    x: 0,
                    y: e.y
                }, !0), this.currentVelocityX = 0)), !this.isGrounded && e.y > 100 && Math.abs(e.x) < 5 && this.rigidBody.setLinvel({
                    x: e.x,
                    y: e.y * u
                }, !0);
            }
        }
        updateFriction() {
            const t = this.isGrounded && !this.isTouchingWall ? A.FRICTION : 0;
            this.collider.setFriction(t);
        }
        updateStateMachine(t) {
            const e = this.rigidBody.linvel(), s = {
                hasBoomerang: this.hasBoomerang,
                isGrounded: this.isGrounded,
                velocity: {
                    x: this.currentVelocityX,
                    y: e.y
                },
                isFacingRight: this.isFacingRight,
                timeSinceStateChange: this.stateMachine.getTimeInCurrentState()
            };
            this.stateMachine.update(t, s), this.handleStateSpecificBehavior(t);
        }
        handleStateSpecificBehavior(t) {
            const e = this.stateMachine.getCurrentState(), s = this.previousState;
            e !== s && (e === S.Airborne && (s === S.Sliding || s === S.Crouching) && this.updateColliderSize(A.WIDTH, A.HEIGHT), e === S.Crouching || e === S.Sliding ? this.collider.setCollisionGroups(L.PLAYER_CROUCHING, L.ENVIRONMENT | L.ENEMY) : this.collider.setCollisionGroups(L.PLAYER_STANDING, L.ENVIRONMENT | L.BOOMERANG | L.ENEMY), this.previousState = e);
            let r = A.COLOR;
            switch(e){
                case S.Idle:
                    r = 16739179;
                    break;
                case S.Moving:
                    r = 65280;
                    break;
                case S.Crouching:
                    r = 7039999;
                    break;
                case S.Sliding:
                    r = 7077887, this.currentVelocityX > 0 ? this.currentVelocityX = Math.max(0, this.currentVelocityX - A.SLIDE_DECELERATION * t) : this.currentVelocityX < 0 && (this.currentVelocityX = Math.min(0, this.currentVelocityX + A.SLIDE_DECELERATION * t));
                    break;
                case S.Blocking:
                    r = 16777067;
                    break;
                case S.Airborne:
                    r = 16739327;
                    break;
                case S.Aiming:
                    r = 16755200;
                    break;
            }
            this.sprite.tint !== r && (this.sprite.tint = r);
        }
        moveLeft(t) {
            const e = this.stateMachine.getCurrentState();
            e === S.Idle || e === S.Moving ? (this.isFacingRight = !1, this.targetVelocityX = -A.MOVE_SPEED) : e === S.Crouching ? (this.isFacingRight = !1, this.targetVelocityX = -A.CROUCH_MOVE_SPEED) : e === S.Blocking ? this.isFacingRight = !1 : e === S.Airborne && (this.isFacingRight = !1, this.targetVelocityX = -A.CROUCH_MOVE_SPEED);
        }
        moveRight(t) {
            const e = this.stateMachine.getCurrentState();
            e === S.Idle || e === S.Moving ? (this.isFacingRight = !0, this.targetVelocityX = A.MOVE_SPEED) : e === S.Crouching ? (this.isFacingRight = !0, this.targetVelocityX = A.CROUCH_MOVE_SPEED) : e === S.Blocking ? this.isFacingRight = !0 : e === S.Airborne && (this.isFacingRight = !0, this.targetVelocityX = A.CROUCH_MOVE_SPEED);
        }
        stopMoving(t) {
            const e = this.stateMachine.getCurrentState();
            (e === S.Idle || e === S.Moving || e === S.Crouching || e === S.Airborne) && (this.targetVelocityX = 0);
        }
        crouch() {
            if (!this.isGrounded) return;
            const t = this.stateMachine.getCurrentState();
            t === S.Moving && Math.abs(this.currentVelocityX) >= A.MOVE_SPEED * .9 ? (this.stateMachine.requestSlide({
                x: this.currentVelocityX
            }), this.currentVelocityX = this.isFacingRight ? A.SLIDE_SPEED : -A.SLIDE_SPEED, this.updateColliderSize(A.WIDTH, A.CROUCH_HEIGHT)) : (t === S.Idle || t === S.Moving) && (this.stateMachine.requestCrouch(), Math.abs(this.targetVelocityX) > A.CROUCH_MOVE_SPEED && (this.targetVelocityX = this.targetVelocityX > 0 ? A.CROUCH_MOVE_SPEED : -A.CROUCH_MOVE_SPEED), Math.abs(this.currentVelocityX) > A.CROUCH_MOVE_SPEED && (this.currentVelocityX = this.currentVelocityX > 0 ? A.CROUCH_MOVE_SPEED : -A.CROUCH_MOVE_SPEED), this.updateColliderSize(A.WIDTH, A.CROUCH_HEIGHT));
        }
        stand() {
            const t = this.stateMachine.getCurrentState();
            t === S.Crouching ? (this.stateMachine.requestStand(), this.updateColliderSize(A.WIDTH, A.HEIGHT)) : t === S.Sliding && (this.stateMachine.requestStopSliding(), this.updateColliderSize(A.WIDTH, A.HEIGHT));
        }
        startBlocking() {
            this.stateMachine.requestBlock(this.hasBoomerang);
        }
        stopBlocking() {
            this.stateMachine.requestStopBlocking();
        }
        updateColliderSize(t, e) {
            if (e === this.currentColliderHeight) return;
            const s = this.rigidBody.translation(), r = this.rigidBody.linvel(), n = e <= A.CROUCH_HEIGHT;
            this.world.removeCollider(this.collider, !1);
            const o = this.RAPIER.ColliderDesc.cuboid(t / 2, e / 2).setRestitution(A.RESTITUTION).setFriction(A.FRICTION).setCollisionGroups(n ? L.PLAYER_CROUCHING : L.PLAYER_STANDING, n ? L.ENVIRONMENT | L.ENEMY : L.ENVIRONMENT | L.BOOMERANG | L.ENEMY);
            this.collider = this.world.createCollider(o, this.rigidBody), this.collider.setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
            const a = this.currentColliderHeight - e;
            a !== 0 && this.rigidBody.setTranslation({
                x: s.x,
                y: s.y + a / 2
            }, !0), this.currentColliderHeight = e, this.rigidBody.setLinvel(r, !0), this.sprite.clear(), this.sprite.rect(-t / 2, -e / 2, t, e), this.sprite.fill(A.COLOR);
        }
        getPosition() {
            const t = this.rigidBody.translation();
            return {
                x: t.x,
                y: t.y
            };
        }
        getState() {
            return this.stateMachine.getCurrentState();
        }
        setHasBoomerang(t) {
            this.hasBoomerang = t;
        }
        getHasBoomerang() {
            return this.hasBoomerang;
        }
        getIsGrounded() {
            return this.isGrounded;
        }
        getCollider() {
            return this.collider;
        }
        setFacingDirection(t) {
            this.isFacingRight = t, this.isAiming && this.updateTrajectoryPreview();
        }
        startAiming() {
            if (this.hasBoomerang && this.stateMachine.getCurrentState() !== S.Aiming) {
                const t = this.stateMachine.getCurrentState();
                (t === S.Crouching || t === S.Sliding) && this.stand(), this.isAiming = !0, this.aimAngle = 180, this.targetVelocityX = 0, this.currentVelocityX = 0;
                const e = this.rigidBody.linvel();
                this.rigidBody.setLinvel({
                    x: 0,
                    y: e.y
                }, !0), this.stateMachine.requestAiming(), this.trajectoryPreview.show(), this.updateTrajectoryPreview();
            }
        }
        stopAiming() {
            if (this.isAiming) {
                this.isAiming = !1, this.trajectoryPreview.hide();
                const t = this.getPosition(), e = {
                    origin: {
                        x: t.x,
                        y: t.y - A.HEIGHT * .2
                    },
                    angle: this.aimAngle,
                    facingRight: this.isFacingRight
                };
                this.projectileManager && this.hasBoomerang && (this.projectileManager.spawnBoomerang(this, e), this.hasBoomerang = !1), this.stateMachine.requestStopAiming();
            }
        }
        updateAimAngle(t) {
            this.aimAngle = Math.max(Y.MIN_ANGLE, Math.min(Y.MAX_ANGLE, t)), this.isAiming && this.updateTrajectoryPreview();
        }
        updateAimAngleFromMouseDelta(t) {
            const s = Math.max(-1, Math.min(1, t / 140));
            let r;
            s <= 0 ? r = 180 : r = 180 - s * 70, this.updateAimAngle(r);
        }
        updateTrajectoryPreview() {
            const t = this.getPosition(), e = {
                x: t.x,
                y: t.y - A.HEIGHT * .2
            };
            this.trajectoryPreview.updateTrajectory(e, this.aimAngle, this.isFacingRight);
        }
        setProjectileManager(t) {
            this.projectileManager = t;
        }
    }
    const fl = [
        {
            x: 0,
            y: 550,
            width: 1600,
            height: 50,
            color: Pt.GROUND
        },
        {
            x: 200,
            y: 450,
            width: 150,
            height: 20,
            color: Pt.PLATFORM
        },
        {
            x: 450,
            y: 350,
            width: 120,
            height: 20,
            color: Pt.PLATFORM
        },
        {
            x: 650,
            y: 400,
            width: 100,
            height: 20,
            color: Pt.PLATFORM
        },
        {
            x: 850,
            y: 300,
            width: 130,
            height: 20,
            color: Pt.PLATFORM
        },
        {
            x: 1100,
            y: 250,
            width: 110,
            height: 20,
            color: Pt.PLATFORM
        }
    ];
    class pl {
        world;
        container;
        RAPIER;
        platformSprites = [];
        constructor(t, e, s){
            this.world = t, this.container = e, this.RAPIER = s, this.createPlatforms(fl);
        }
        createPlatforms(t) {
            t.forEach((e)=>{
                this.createPlatform(e);
            });
        }
        createPlatform(t) {
            const e = t.x + t.width / 2, s = t.y + t.height / 2, r = this.RAPIER.RigidBodyDesc.fixed().setTranslation(e, s), n = this.world.createRigidBody(r), o = this.RAPIER.ColliderDesc.cuboid(t.width / 2, t.height / 2).setCollisionGroups(L.ENVIRONMENT, L.PLAYER_STANDING | L.PLAYER_CROUCHING | L.BOOMERANG | L.ENEMY);
            this.world.createCollider(o, n);
            const a = new at;
            a.rect(0, 0, t.width, t.height), a.fill(t.color || Pt.PLATFORM), a.x = t.x, a.y = t.y, this.container.addChild(a), this.platformSprites.push(a);
        }
        destroy() {
            this.platformSprites.forEach((t)=>{
                t.destroy();
            }), this.platformSprites = [];
        }
    }
    class gl {
        world;
        rigidBody;
        collider;
        sprite = null;
        container;
        RAPIER;
        owner = null;
        state = X.Caught;
        distanceTraveled = 0;
        hangTimeRemaining = 0;
        currentVelocity = {
            x: 0,
            y: 0
        };
        targetVelocity = {
            x: 0,
            y: 0
        };
        accelerationTime = 0;
        frameCount = 0;
        gracePeriodTime = 0;
        isStraightLine = !1;
        throwOrigin = null;
        throwAngle = 180;
        throwDirection = 1;
        isReturningToOrigin = !1;
        onPlayerCollision;
        constructor(t, e, s){
            this.world = t, this.container = e, this.RAPIER = s;
        }
        createRigidBody(t, e) {
            this.cleanupPhysics();
            const s = this.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(t, e);
            this.rigidBody = this.world.createRigidBody(s), this.rigidBody.setTranslation({
                x: t,
                y: e
            }, !0);
            const r = this.RAPIER.ColliderDesc.ball(5.5).setSensor(!0).setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS).setCollisionGroups(L.BOOMERANG, L.PLAYER_STANDING | L.ENVIRONMENT);
            this.collider = this.world.createCollider(r, this.rigidBody);
        }
        createSprite() {
            this.sprite = new at;
            const t = 11, e = 3;
            this.sprite.moveTo(-t / 2, -t / 2), this.sprite.lineTo(-t / 2 + e, -t / 2), this.sprite.lineTo(-t / 2 + e, t / 2 - e), this.sprite.lineTo(t / 2, t / 2 - e), this.sprite.lineTo(t / 2, t / 2), this.sprite.lineTo(-t / 2, t / 2), this.sprite.closePath(), this.sprite.fill(16711935), this.sprite.visible = !1, this.container.addChild(this.sprite);
        }
        throw(t) {
            if (this.state !== X.Caught) return;
            this.createRigidBody(t.origin.x, t.origin.y), this.throwOrigin = {
                ...t.origin
            }, this.throwAngle = t.angle, this.throwDirection = t.facingRight ? 1 : -1, this.isStraightLine = t.angle >= 168, this.targetVelocity = {
                x: Y.THROW_SPEED * this.throwDirection,
                y: 0
            }, this.currentVelocity = {
                x: 0,
                y: 0
            }, this.accelerationTime = 0, this.distanceTraveled = 0, this.hangTimeRemaining = 0, this.frameCount = 0, this.gracePeriodTime = Y.GRACE_PERIOD, this.isReturningToOrigin = !1, this.state = X.Throwing, this.sprite && (this.container.removeChild(this.sprite), this.sprite.destroy());
            const e = new at, s = 11, r = 3;
            e.moveTo(-s / 2, -s / 2), e.lineTo(-s / 2 + r, -s / 2), e.lineTo(-s / 2 + r, s / 2 - r), e.lineTo(s / 2, s / 2 - r), e.lineTo(s / 2, s / 2), e.lineTo(-s / 2, s / 2), e.closePath(), e.fill(16711935), e.x = t.origin.x, e.y = t.origin.y, this.container.addChild(e), this.sprite = e;
        }
        update(t) {
            if (this.state === X.Caught || (this.frameCount++, !this.rigidBody)) return;
            const e = this.rigidBody.translation();
            switch(this.gracePeriodTime > 0 && (this.gracePeriodTime -= t), this.state){
                case X.Throwing:
                    this.updateThrowing(t, e);
                    break;
                case X.Hanging:
                    this.updateHanging(t);
                    break;
                case X.Returning:
                    this.updateReturning(t, e);
                    break;
            }
            if (this.rigidBody && this.sprite && this.sprite.visible) {
                const s = this.rigidBody.translation();
                this.sprite.x = s.x, this.sprite.y = s.y, (Math.abs(this.currentVelocity.x) > .1 || Math.abs(this.currentVelocity.y) > .1) && (this.sprite.rotation += t * 10);
            }
        }
        updateThrowing(t, e) {
            const s = Math.abs(this.targetVelocity.x * t);
            this.distanceTraveled += s;
            const r = Math.min(1, this.distanceTraveled / Y.THROW_DISTANCE), n = this.throwOrigin;
            if (!n) {
                this.currentVelocity = {
                    ...this.targetVelocity
                };
                const a = {
                    x: e.x + this.currentVelocity.x * t,
                    y: e.y + this.currentVelocity.y * t
                };
                this.rigidBody.setTranslation(a, !0), this.distanceTraveled >= Y.THROW_DISTANCE && this.enterHangState();
                return;
            }
            let o;
            if (this.isStraightLine) o = {
                x: n.x + this.distanceTraveled * this.throwDirection,
                y: n.y
            };
            else {
                const h = (180 - (this.throwAngle || 180)) / 60, l = Y.THROW_DISTANCE * .5 * h;
                o = {
                    x: n.x + this.distanceTraveled * this.throwDirection,
                    y: n.y - l * r * r
                };
            }
            this.rigidBody.setTranslation(o, !0), (e.x !== o.x || e.y !== o.y) && (this.currentVelocity = {
                x: (o.x - e.x) / t,
                y: (o.y - e.y) / t
            }), this.distanceTraveled >= Y.THROW_DISTANCE && this.enterHangState();
        }
        updateHanging(t) {
            this.hangTimeRemaining -= t, this.hangTimeRemaining <= 0 && (this.distanceTraveled = 0, this.accelerationTime = 0, this.isReturningToOrigin ? (this.state = X.Throwing, this.isReturningToOrigin = !1, this.throwDirection = -this.throwDirection, this.targetVelocity.x = -this.targetVelocity.x) : (this.state = X.Returning, this.isReturningToOrigin = !0));
        }
        updateReturning(t, e) {
            const s = Math.abs(this.targetVelocity.x * t);
            this.distanceTraveled += s;
            const r = Math.min(1, this.distanceTraveled / Y.THROW_DISTANCE), n = this.throwOrigin;
            if (!n) {
                const a = {
                    x: e.x + this.currentVelocity.x * t,
                    y: e.y + this.currentVelocity.y * t
                };
                this.rigidBody.setTranslation(a, !0);
                return;
            }
            let o;
            if (this.isStraightLine) o = {
                x: n.x + Y.THROW_DISTANCE * this.throwDirection - this.distanceTraveled * this.throwDirection,
                y: n.y
            };
            else {
                const h = (180 - (this.throwAngle || 180)) / 60, l = Y.THROW_DISTANCE * .5 * h, u = n.x + Y.THROW_DISTANCE * this.throwDirection - this.distanceTraveled * this.throwDirection, f = 1 - r;
                o = {
                    x: u,
                    y: n.y - l * f * f
                };
            }
            if (this.rigidBody.setTranslation(o, !0), (e.x !== o.x || e.y !== o.y) && (this.currentVelocity = {
                x: (o.x - e.x) / t,
                y: (o.y - e.y) / t
            }), this.owner) {
                const a = this.owner.getPosition(), h = a.x - o.x, l = a.y - o.y;
                if (Math.sqrt(h * h + l * l) < 30) {
                    this.handlePlayerCollision();
                    return;
                }
            }
            this.distanceTraveled >= Y.THROW_DISTANCE && (this.throwOrigin = {
                ...o
            }, this.state = X.Throwing, this.isReturningToOrigin = !1, this.distanceTraveled = 0, this.throwDirection = -this.throwDirection, this.targetVelocity.x = -this.targetVelocity.x);
        }
        enterHangState() {
            this.state = X.Hanging, this.hangTimeRemaining = Y.HANG_TIME, this.currentVelocity = {
                x: 0,
                y: 0
            };
        }
        checkWallCollision() {
            (this.state === X.Throwing || this.state === X.Returning) && this.enterHangState();
        }
        catch() {
            this.state !== X.Caught && (this.state = X.Caught, this.sprite && (this.sprite.visible = !1), this.cleanupPhysics());
        }
        cleanupPhysics() {
            try {
                this.collider && this.world.getCollider(this.collider.handle) && this.world.removeCollider(this.collider, !1);
            } catch  {}
            this.collider = null;
            try {
                this.rigidBody && this.world.getRigidBody(this.rigidBody.handle) && this.world.removeRigidBody(this.rigidBody);
            } catch  {}
            this.rigidBody = null;
        }
        getState() {
            return this.state;
        }
        getPosition() {
            if (this.state === X.Caught || !this.rigidBody) return null;
            const t = this.rigidBody.translation();
            return {
                x: t.x,
                y: t.y
            };
        }
        getCollider() {
            return this.state !== X.Caught ? this.collider : null;
        }
        getCurrentVelocity() {
            return {
                ...this.currentVelocity
            };
        }
        getTargetVelocity() {
            return {
                ...this.targetVelocity
            };
        }
        getDistanceTraveled() {
            return this.distanceTraveled;
        }
        getIsStraightLine() {
            return this.isStraightLine;
        }
        setOnPlayerCollision(t) {
            this.onPlayerCollision = t;
        }
        handlePlayerCollision() {
            this.gracePeriodTime > 0 || this.onPlayerCollision && this.onPlayerCollision();
        }
        setOwner(t) {
            this.owner = t;
        }
        getOwner() {
            return this.owner;
        }
        destroy() {
            this.cleanupPhysics(), this.sprite && this.sprite.destroy();
        }
    }
    class ml {
        world;
        container;
        RAPIER;
        projectiles = [];
        constructor(t, e, s){
            this.world = t, this.container = e, this.RAPIER = s;
        }
        spawnBoomerang(t, e) {
            const s = new gl(this.world, this.container, this.RAPIER);
            return s.setOwner(t), s.throw(e), s.setOnPlayerCollision(()=>{
                s.getOwner() === t && (s.catch(), t.setHasBoomerang(!0));
            }), this.projectiles.push(s), s;
        }
        update(t) {
            for(let e = this.projectiles.length - 1; e >= 0; e--){
                const s = this.projectiles[e];
                s.update(t), s.getState() === X.Caught && this.projectiles.splice(e, 1);
            }
        }
        checkCollisions(t) {
            for (const e of this.projectiles){
                const s = e.getCollider();
                if (!s) continue;
                this.world.intersectionPair(s, t) && e.handlePlayerCollision(), this.world.intersectionsWith(s, (n)=>n === t ? !0 : (e.checkWallCollision(), !1));
            }
        }
        getActiveProjectiles() {
            return [
                ...this.projectiles
            ];
        }
        destroy() {
            for (const t of this.projectiles)t.destroy();
            this.projectiles = [];
        }
    }
    class yl {
        app;
        world;
        player;
        level;
        projectileManager;
        cameraContainer;
        uiContainer;
        inputSystem;
        cameraSystem;
        timeSlowEffect;
        RAPIER;
        async init(t) {
            this.RAPIER = t, await this.initializePixi(), this.initializePhysics(), this.initializeSystems(), this.initializeEntities(), this.startGameLoop();
        }
        async initializePixi() {
            this.app = new Yr, await this.app.init({
                width: it.WIDTH,
                height: it.HEIGHT,
                backgroundColor: it.BACKGROUND_COLOR,
                antialias: it.ANTIALIAS
            }), this.cameraContainer = new dt, this.cameraContainer.sortableChildren = !0, this.uiContainer = new dt, this.uiContainer.zIndex = 1e3, this.app.stage.addChild(this.cameraContainer), this.app.stage.addChild(this.uiContainer);
        }
        initializePhysics() {
            this.world = new this.RAPIER.World(Jt.GRAVITY);
        }
        initializeSystems() {
            this.inputSystem = new hl, this.cameraSystem = new ll(this.cameraContainer), this.timeSlowEffect = new ul(this.uiContainer), setTimeout(()=>{
                this.inputSystem.setCanvas(this.app.canvas);
            }, 0);
        }
        initializeEntities() {
            this.level = new pl(this.world, this.cameraContainer, this.RAPIER), this.player = new dl(this.world, this.cameraContainer, 100, 400, this.RAPIER), this.projectileManager = new ml(this.world, this.cameraContainer, this.RAPIER), this.player.setProjectileManager(this.projectileManager);
        }
        startGameLoop() {
            this.app.ticker.add(()=>{
                const t = this.app.ticker.deltaMS / 1e3;
                this.update(t);
            });
        }
        update(t) {
            const e = this.inputSystem.getActions(), s = this.player.getState() === S.Aiming, r = s ? Et.TIME_SCALE : 1, n = t * r;
            if (this.timeSlowEffect.update(t), s ? e.moveLeft ? this.player.setFacingDirection(!1) : e.moveRight && this.player.setFacingDirection(!0) : (e.moveLeft ? this.player.moveLeft(n) : e.moveRight ? this.player.moveRight(n) : this.player.stopMoving(n), e.crouch ? this.player.crouch() : this.player.stand()), e.action) if (this.player.getHasBoomerang()) {
                if (this.player.getState() !== S.Aiming && (this.player.startAiming(), this.inputSystem.setInitialAimMouseY()), this.player.getState() === S.Aiming) {
                    this.timeSlowEffect.startTimeSlow();
                    const o = this.inputSystem.getMouseYDeltaFromAimStart();
                    this.player.updateAimAngleFromMouseDelta(o);
                }
            } else this.player.startBlocking();
            else this.player.getState() === S.Aiming && this.player.stopAiming(), this.player.stopBlocking(), this.timeSlowEffect.getIsActive() && this.timeSlowEffect.stopTimeSlow();
            this.world.step(), this.player.update(n), this.projectileManager.update(t), this.projectileManager.checkCollisions(this.player.getCollider()), this.cameraSystem.setTarget(this.player.getPosition()), this.cameraSystem.update(n);
        }
        getCanvas() {
            return this.app.canvas;
        }
        getLevel() {
            return this.level;
        }
    }
    async function xl() {
        try {
            const i = await se(()=>import("./rapier-6c6c76e7.js").then(async (m)=>{
                    await m.__tla;
                    return m;
                }), []), t = new yl;
            await t.init(i), document.body.appendChild(t.getCanvas());
        } catch (i) {
            throw console.error("Failed to initialize game:", i), i;
        }
    }
    xl();
})();
export { B as $, Hr as A, J as B, dt as C, Rt as D, G as E, io as F, Be as G, es as H, re as I, Eo as J, Fo as K, z as L, k as M, j as N, ia as O, K as P, ss as Q, gi as R, Sa as S, we as T, di as U, rs as V, no as W, Xe as X, rt as Y, nr as Z, Nr as _, mt as a, W as a0, aa as a1, Ga as a2, Ta as a3, Qa as a4, th as a5, nh as a6, ah as a7, hh as a8, $t as a9, Qt as aa, Vs as ab, ue as ac, la as ad, Ks as ae, ke as af, Bt as ag, tn as ah, bs as ai, xs as aj, at as ak, Tn as al, rn as am, le as b, Ie as c, Pi as d, nt as e, _s as f, ba as g, Or as h, mr as i, lt as j, Ir as k, Za as l, Ja as m, Ui as n, sh as o, oh as p, Ei as q, Hn as r, D as s, Mr as t, vn as u, ch as v, tt as w, ht as x, pt as y, ir as z, __tla };
