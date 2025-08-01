let Ft, ie, se, me, rr, tr, Se, hr, pt, ee, F, sr, Tt, ye, cr, lr, xl, it, Je, Ye, be, Ee, tt, Ke, Ve, er, ct, H, dr, Q, te, et, Qe, nr, or, ut, gt, Ae, Ue, $e, re, ar, Tl, _t, qt, St, Xe, Ze, Qt, z, Oe, N, A, xt, ge, Ce, Re, ne, k, Rt, nt, ot, C, oe, wr, ir, je, ve, _e, fe, qe, h, Ot, Hl, Fl;
let __tla = (async ()=>{
    const fr = "/assets/rapier_wasm2d_bg-b5dc53dc.wasm", mr = async (o = {}, t)=>{
        let e;
        if (t.startsWith("data:")) {
            const r = t.replace(/^data:.*?base64,/, "");
            let i;
            if (typeof Buffer == "function" && typeof Buffer.from == "function") i = Buffer.from(r, "base64");
            else if (typeof atob == "function") {
                const s = atob(r);
                i = new Uint8Array(s.length);
                for(let a = 0; a < s.length; a++)i[a] = s.charCodeAt(a);
            } else throw new Error("Cannot decode base64-encoded data URL");
            e = await WebAssembly.instantiate(i, o);
        } else {
            const r = await fetch(t), i = r.headers.get("Content-Type") || "";
            if ("instantiateStreaming" in WebAssembly && i.startsWith("application/wasm")) e = await WebAssembly.instantiateStreaming(r, o);
            else {
                const s = await r.arrayBuffer();
                e = await WebAssembly.instantiate(s, o);
            }
        }
        return e.instance.exports;
    }, g = new Array(32).fill(void 0);
    g.push(void 0, null, !0, !1);
    function v(o) {
        return g[o];
    }
    let at = g.length;
    function br(o) {
        o < 36 || (g[o] = at, at = o);
    }
    function Ct(o) {
        const t = v(o);
        return br(o), t;
    }
    function x(o) {
        at === g.length && g.push(g.length + 1);
        const t = at;
        return at = g[t], g[t] = o, t;
    }
    function f(o) {
        return o == null;
    }
    let Xt = new Float64Array;
    function At() {
        return Xt.byteLength === 0 && (Xt = new Float64Array(st.buffer)), Xt;
    }
    let Kt = new Int32Array;
    function E() {
        return Kt.byteLength === 0 && (Kt = new Int32Array(st.buffer)), Kt;
    }
    const yr = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
    let Fe = new yr("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    Fe.decode();
    let Yt = new Uint8Array;
    function gr() {
        return Yt.byteLength === 0 && (Yt = new Uint8Array(st.buffer)), Yt;
    }
    function He(o, t) {
        return Fe.decode(gr().subarray(o, o + t));
    }
    function Sr() {
        try {
            const e = R(-16);
            Vr(e);
            var o = E()[e / 4 + 0], t = E()[e / 4 + 1];
            return He(o, t);
        } finally{
            R(16), vt(o, t);
        }
    }
    function c(o, t) {
        if (!(o instanceof t)) throw new Error(`expected instance of ${t.name}`);
        return o.ptr;
    }
    let $t = new Float32Array;
    function X() {
        return $t.byteLength === 0 && ($t = new Float32Array(st.buffer)), $t;
    }
    let j = 32;
    function P(o) {
        if (j == 1) throw new Error("out of js stack");
        return g[--j] = o, j;
    }
    function Me(o, t) {
        return X().subarray(o / 4, o / 4 + t);
    }
    let Zt = new Uint32Array;
    function ke() {
        return Zt.byteLength === 0 && (Zt = new Uint32Array(st.buffer)), Zt;
    }
    function Rr(o, t) {
        return ke().subarray(o / 4, o / 4 + t);
    }
    let L = 0;
    function Z(o, t) {
        const e = t(o.length * 4);
        return X().set(o, e / 4), L = o.length, e;
    }
    function Te(o, t) {
        const e = t(o.length * 4);
        return ke().set(o, e / 4), L = o.length, e;
    }
    function ae(o, t) {
        try {
            return o.apply(this, t);
        } catch (e) {
            Ml(x(e));
        }
    }
    const Ht = Object.freeze({
        X: 0,
        0: "X",
        Y: 1,
        1: "Y",
        AngX: 2,
        2: "AngX"
    });
    class K {
        static __wrap(t) {
            const e = Object.create(K.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Zs(t);
        }
        constructor(){
            const t = Qs();
            return K.__wrap(t);
        }
    }
    class rt {
        static __wrap(t) {
            const e = Object.create(rt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            An(t);
        }
        constructor(){
            const t = jn();
            return rt.__wrap(t);
        }
    }
    class lt {
        static __wrap(t) {
            const e = Object.create(lt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            mn(t);
        }
        constructor(){
            const t = bn();
            return lt.__wrap(t);
        }
        handle() {
            return yn(this.ptr);
        }
        translationApplied() {
            const t = mt(this.ptr);
            return d.__wrap(t);
        }
        translationRemaining() {
            const t = De(this.ptr);
            return d.__wrap(t);
        }
        toi() {
            return gn(this.ptr);
        }
        worldWitness1() {
            const t = Sn(this.ptr);
            return d.__wrap(t);
        }
        worldWitness2() {
            const t = Rn(this.ptr);
            return d.__wrap(t);
        }
        worldNormal1() {
            const t = vn(this.ptr);
            return d.__wrap(t);
        }
        worldNormal2() {
            const t = Cn(this.ptr);
            return d.__wrap(t);
        }
    }
    class M {
        static __wrap(t) {
            const e = Object.create(M.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            la(t);
        }
        coTranslation(t) {
            const e = to(this.ptr, t);
            return d.__wrap(e);
        }
        coRotation(t) {
            const e = eo(this.ptr, t);
            return S.__wrap(e);
        }
        coSetTranslation(t, e, r) {
            ro(this.ptr, t, e, r);
        }
        coSetTranslationWrtParent(t, e, r) {
            no(this.ptr, t, e, r);
        }
        coSetRotation(t, e) {
            io(this.ptr, t, e);
        }
        coSetRotationWrtParent(t, e) {
            so(this.ptr, t, e);
        }
        coIsSensor(t) {
            return oo(this.ptr, t) !== 0;
        }
        coShapeType(t) {
            return ao(this.ptr, t) >>> 0;
        }
        coHalfspaceNormal(t) {
            const e = co(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        coHalfExtents(t) {
            const e = lo(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        coSetHalfExtents(t, e) {
            c(e, d), ho(this.ptr, t, e.ptr);
        }
        coRadius(t) {
            try {
                const i = R(-16);
                wo(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = X()[i / 4 + 1];
                return e === 0 ? void 0 : r;
            } finally{
                R(16);
            }
        }
        coSetRadius(t, e) {
            po(this.ptr, t, e);
        }
        coHalfHeight(t) {
            try {
                const i = R(-16);
                uo(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = X()[i / 4 + 1];
                return e === 0 ? void 0 : r;
            } finally{
                R(16);
            }
        }
        coSetHalfHeight(t, e) {
            _o(this.ptr, t, e);
        }
        coRoundRadius(t) {
            try {
                const i = R(-16);
                fo(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = X()[i / 4 + 1];
                return e === 0 ? void 0 : r;
            } finally{
                R(16);
            }
        }
        coSetRoundRadius(t, e) {
            mo(this.ptr, t, e);
        }
        coVertices(t) {
            try {
                const i = R(-16);
                bo(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = E()[i / 4 + 1];
                let s;
                return e !== 0 && (s = Me(e, r).slice(), vt(e, r * 4)), s;
            } finally{
                R(16);
            }
        }
        coIndices(t) {
            try {
                const i = R(-16);
                yo(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = E()[i / 4 + 1];
                let s;
                return e !== 0 && (s = Rr(e, r).slice(), vt(e, r * 4)), s;
            } finally{
                R(16);
            }
        }
        coHeightfieldHeights(t) {
            try {
                const i = R(-16);
                go(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = E()[i / 4 + 1];
                let s;
                return e !== 0 && (s = Me(e, r).slice(), vt(e, r * 4)), s;
            } finally{
                R(16);
            }
        }
        coHeightfieldScale(t) {
            const e = So(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        coParent(t) {
            try {
                const i = R(-16);
                Ro(i, this.ptr, t);
                var e = E()[i / 4 + 0], r = At()[i / 8 + 1];
                return e === 0 ? void 0 : r;
            } finally{
                R(16);
            }
        }
        coSetEnabled(t, e) {
            vo(this.ptr, t, e);
        }
        coIsEnabled(t) {
            return Co(this.ptr, t) !== 0;
        }
        coFriction(t) {
            return Ao(this.ptr, t);
        }
        coRestitution(t) {
            return jo(this.ptr, t);
        }
        coDensity(t) {
            return Eo(this.ptr, t);
        }
        coMass(t) {
            return Io(this.ptr, t);
        }
        coVolume(t) {
            return Po(this.ptr, t);
        }
        coCollisionGroups(t) {
            return Mo(this.ptr, t) >>> 0;
        }
        coSolverGroups(t) {
            return To(this.ptr, t) >>> 0;
        }
        coActiveHooks(t) {
            return xo(this.ptr, t) >>> 0;
        }
        coActiveCollisionTypes(t) {
            return Fo(this.ptr, t);
        }
        coActiveEvents(t) {
            return Ho(this.ptr, t) >>> 0;
        }
        coContactForceEventThreshold(t) {
            return ko(this.ptr, t);
        }
        coContainsPoint(t, e) {
            return c(e, d), Do(this.ptr, t, e.ptr) !== 0;
        }
        coCastShape(t, e, r, i, s, a, l, w) {
            c(e, d), c(r, b), c(i, d), c(s, S), c(a, d);
            const p = Lo(this.ptr, t, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l, w);
            return p === 0 ? void 0 : zt.__wrap(p);
        }
        coCastCollider(t, e, r, i, s, a) {
            c(e, d), c(i, d);
            const l = No(this.ptr, t, e.ptr, r, i.ptr, s, a);
            return l === 0 ? void 0 : Nt.__wrap(l);
        }
        coIntersectsShape(t, e, r, i) {
            return c(e, b), c(r, d), c(i, S), zo(this.ptr, t, e.ptr, r.ptr, i.ptr) !== 0;
        }
        coContactShape(t, e, r, i, s) {
            c(e, b), c(r, d), c(i, S);
            const a = Go(this.ptr, t, e.ptr, r.ptr, i.ptr, s);
            return a === 0 ? void 0 : wt.__wrap(a);
        }
        coContactCollider(t, e, r) {
            const i = Wo(this.ptr, t, e, r);
            return i === 0 ? void 0 : wt.__wrap(i);
        }
        coProjectPoint(t, e, r) {
            c(e, d);
            const i = Bo(this.ptr, t, e.ptr, r);
            return kt.__wrap(i);
        }
        coIntersectsRay(t, e, r, i) {
            return c(e, d), c(r, d), qo(this.ptr, t, e.ptr, r.ptr, i) !== 0;
        }
        coCastRay(t, e, r, i, s) {
            return c(e, d), c(r, d), Oo(this.ptr, t, e.ptr, r.ptr, i, s);
        }
        coCastRayAndGetNormal(t, e, r, i, s) {
            c(e, d), c(r, d);
            const a = Vo(this.ptr, t, e.ptr, r.ptr, i, s);
            return a === 0 ? void 0 : Lt.__wrap(a);
        }
        coSetSensor(t, e) {
            Jo(this.ptr, t, e);
        }
        coSetRestitution(t, e) {
            Uo(this.ptr, t, e);
        }
        coSetFriction(t, e) {
            Xo(this.ptr, t, e);
        }
        coFrictionCombineRule(t) {
            return Ko(this.ptr, t) >>> 0;
        }
        coSetFrictionCombineRule(t, e) {
            Yo(this.ptr, t, e);
        }
        coRestitutionCombineRule(t) {
            return $o(this.ptr, t) >>> 0;
        }
        coSetRestitutionCombineRule(t, e) {
            Zo(this.ptr, t, e);
        }
        coSetCollisionGroups(t, e) {
            Qo(this.ptr, t, e);
        }
        coSetSolverGroups(t, e) {
            ta(this.ptr, t, e);
        }
        coSetActiveHooks(t, e) {
            ea(this.ptr, t, e);
        }
        coSetActiveEvents(t, e) {
            ra(this.ptr, t, e);
        }
        coSetActiveCollisionTypes(t, e) {
            na(this.ptr, t, e);
        }
        coSetShape(t, e) {
            c(e, b), ia(this.ptr, t, e.ptr);
        }
        coSetContactForceEventThreshold(t, e) {
            sa(this.ptr, t, e);
        }
        coSetDensity(t, e) {
            oa(this.ptr, t, e);
        }
        coSetMass(t, e) {
            aa(this.ptr, t, e);
        }
        coSetMassProperties(t, e, r, i) {
            c(r, d), ca(this.ptr, t, e, r.ptr, i);
        }
        constructor(){
            const t = ha();
            return M.__wrap(t);
        }
        len() {
            return da(this.ptr) >>> 0;
        }
        contains(t) {
            return xe(this.ptr, t) !== 0;
        }
        createCollider(t, e, r, i, s, a, l, w, p, u, _, m, y, I, D, O, V, $, Vt, Jt, Ie, pr, Pe) {
            try {
                const Ut = R(-16);
                c(e, b), c(r, d), c(i, S), c(l, d), c(Pe, T), wa(Ut, this.ptr, t, e.ptr, r.ptr, i.ptr, s, a, l.ptr, w, p, u, _, m, y, I, D, O, V, $, Vt, Jt, Ie, pr, Pe.ptr);
                var ur = E()[Ut / 4 + 0], _r = At()[Ut / 8 + 1];
                return ur === 0 ? void 0 : _r;
            } finally{
                R(16);
            }
        }
        remove(t, e, r, i) {
            c(e, B), c(r, T), pa(this.ptr, t, e.ptr, r.ptr, i);
        }
        isHandleValid(t) {
            return xe(this.ptr, t) !== 0;
        }
        forEachColliderHandle(t) {
            try {
                ua(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
    }
    class ce {
        static __wrap(t) {
            const e = Object.create(ce.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Wc(t);
        }
        collider1() {
            return bt(this.ptr);
        }
        collider2() {
            return Bc(this.ptr);
        }
        total_force() {
            const t = yt(this.ptr);
            return d.__wrap(t);
        }
        total_force_magnitude() {
            return Wt(this.ptr);
        }
        max_force_direction() {
            const t = mt(this.ptr);
            return d.__wrap(t);
        }
        max_force_magnitude() {
            return qc(this.ptr);
        }
    }
    class le {
        static __wrap(t) {
            const e = Object.create(le.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Ra(t);
        }
        normal() {
            const t = Ea(this.ptr);
            return d.__wrap(t);
        }
        local_n1() {
            const t = Ia(this.ptr);
            return d.__wrap(t);
        }
        local_n2() {
            const t = Pa(this.ptr);
            return d.__wrap(t);
        }
        subshape1() {
            return Ma(this.ptr) >>> 0;
        }
        subshape2() {
            return Ta(this.ptr) >>> 0;
        }
        num_contacts() {
            return xa(this.ptr) >>> 0;
        }
        contact_local_p1(t) {
            const e = Fa(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        contact_local_p2(t) {
            const e = Ha(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        contact_dist(t) {
            return ka(this.ptr, t);
        }
        contact_fid1(t) {
            return Da(this.ptr, t) >>> 0;
        }
        contact_fid2(t) {
            return La(this.ptr, t) >>> 0;
        }
        contact_impulse(t) {
            return Na(this.ptr, t);
        }
        contact_tangent_impulse(t) {
            return za(this.ptr, t);
        }
        num_solver_contacts() {
            return Ga(this.ptr) >>> 0;
        }
        solver_contact_point(t) {
            const e = Wa(this.ptr, t);
            return e === 0 ? void 0 : d.__wrap(e);
        }
        solver_contact_dist(t) {
            return Ba(this.ptr, t);
        }
        solver_contact_friction(t) {
            return qa(this.ptr, t);
        }
        solver_contact_restitution(t) {
            return Oa(this.ptr, t);
        }
        solver_contact_tangent_velocity(t) {
            const e = Va(this.ptr, t);
            return d.__wrap(e);
        }
    }
    class he {
        static __wrap(t) {
            const e = Object.create(he.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            vl(t);
        }
        collider1() {
            return va(this.ptr);
        }
        collider2() {
            return Ca(this.ptr);
        }
        numContactManifolds() {
            return Aa(this.ptr) >>> 0;
        }
        contactManifold(t) {
            const e = ja(this.ptr, t);
            return e === 0 ? void 0 : le.__wrap(e);
        }
    }
    class jt {
        static __wrap(t) {
            const e = Object.create(jt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            kc(t);
        }
        constructor(){
            const t = Dc();
            return jt.__wrap(t);
        }
        vertices() {
            const t = Lc(this.ptr);
            return Ct(t);
        }
        colors() {
            const t = Nc(this.ptr);
            return Ct(t);
        }
        render(t, e, r, i, s) {
            c(t, T), c(e, M), c(r, W), c(i, q), c(s, U), zc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr);
        }
    }
    class de {
        static __wrap(t) {
            const e = Object.create(de.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            dl(t);
        }
        takeGravity() {
            const t = wl(this.ptr);
            return t === 0 ? void 0 : d.__wrap(t);
        }
        takeIntegrationParameters() {
            const t = pl(this.ptr);
            return t === 0 ? void 0 : Y.__wrap(t);
        }
        takeIslandManager() {
            const t = ul(this.ptr);
            return t === 0 ? void 0 : B.__wrap(t);
        }
        takeBroadPhase() {
            const t = _l(this.ptr);
            return t === 0 ? void 0 : K.__wrap(t);
        }
        takeNarrowPhase() {
            const t = fl(this.ptr);
            return t === 0 ? void 0 : U.__wrap(t);
        }
        takeBodies() {
            const t = ml(this.ptr);
            return t === 0 ? void 0 : T.__wrap(t);
        }
        takeColliders() {
            const t = bl(this.ptr);
            return t === 0 ? void 0 : M.__wrap(t);
        }
        takeImpulseJoints() {
            const t = yl(this.ptr);
            return t === 0 ? void 0 : W.__wrap(t);
        }
        takeMultibodyJoints() {
            const t = gl(this.ptr);
            return t === 0 ? void 0 : q.__wrap(t);
        }
    }
    class ht {
        static __wrap(t) {
            const e = Object.create(ht.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Gc(t);
        }
        constructor(t){
            const e = Oc(t);
            return ht.__wrap(e);
        }
        drainCollisionEvents(t) {
            try {
                Vc(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
        drainContactForceEvents(t) {
            try {
                Jc(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
        clear() {
            Uc(this.ptr);
        }
    }
    class G {
        static __wrap(t) {
            const e = Object.create(G.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            mi(t);
        }
        static prismatic(t, e, r, i, s, a) {
            c(t, d), c(e, d), c(r, d);
            const l = bi(t.ptr, e.ptr, r.ptr, i, s, a);
            return l === 0 ? void 0 : G.__wrap(l);
        }
        static fixed(t, e, r, i) {
            c(t, d), c(e, S), c(r, d), c(i, S);
            const s = yi(t.ptr, e.ptr, r.ptr, i.ptr);
            return G.__wrap(s);
        }
        static revolute(t, e) {
            c(t, d), c(e, d);
            const r = gi(t.ptr, e.ptr);
            return r === 0 ? void 0 : G.__wrap(r);
        }
    }
    class W {
        static __wrap(t) {
            const e = Object.create(W.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Jn(t);
        }
        jointType(t) {
            return En(this.ptr, t) >>> 0;
        }
        jointBodyHandle1(t) {
            return In(this.ptr, t);
        }
        jointBodyHandle2(t) {
            return Pn(this.ptr, t);
        }
        jointFrameX1(t) {
            const e = Mn(this.ptr, t);
            return S.__wrap(e);
        }
        jointFrameX2(t) {
            const e = Tn(this.ptr, t);
            return S.__wrap(e);
        }
        jointAnchor1(t) {
            const e = xn(this.ptr, t);
            return d.__wrap(e);
        }
        jointAnchor2(t) {
            const e = Fn(this.ptr, t);
            return d.__wrap(e);
        }
        jointSetAnchor1(t, e) {
            c(e, d), Hn(this.ptr, t, e.ptr);
        }
        jointSetAnchor2(t, e) {
            c(e, d), kn(this.ptr, t, e.ptr);
        }
        jointContactsEnabled(t) {
            return Dn(this.ptr, t) !== 0;
        }
        jointSetContactsEnabled(t, e) {
            Ln(this.ptr, t, e);
        }
        jointLimitsEnabled(t, e) {
            return Nn(this.ptr, t, e) !== 0;
        }
        jointLimitsMin(t, e) {
            return zn(this.ptr, t, e);
        }
        jointLimitsMax(t, e) {
            return Gn(this.ptr, t, e);
        }
        jointSetLimits(t, e, r, i) {
            Wn(this.ptr, t, e, r, i);
        }
        jointConfigureMotorModel(t, e, r) {
            Bn(this.ptr, t, e, r);
        }
        jointConfigureMotorVelocity(t, e, r, i) {
            qn(this.ptr, t, e, r, i);
        }
        jointConfigureMotorPosition(t, e, r, i, s) {
            On(this.ptr, t, e, r, i, s);
        }
        jointConfigureMotor(t, e, r, i, s, a) {
            Vn(this.ptr, t, e, r, i, s, a);
        }
        constructor(){
            const t = Un();
            return W.__wrap(t);
        }
        createJoint(t, e, r, i) {
            return c(t, G), Xn(this.ptr, t.ptr, e, r, i);
        }
        remove(t, e) {
            Kn(this.ptr, t, e);
        }
        len() {
            return Yn(this.ptr) >>> 0;
        }
        contains(t) {
            return $n(this.ptr, t) !== 0;
        }
        forEachJointHandle(t) {
            try {
                Zn(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
        forEachJointAttachedToRigidBody(t, e) {
            try {
                Qn(this.ptr, t, P(e));
            } finally{
                g[j++] = void 0;
            }
        }
    }
    class Y {
        static __wrap(t) {
            const e = Object.create(Y.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            ti(t);
        }
        constructor(){
            const t = ei();
            return Y.__wrap(t);
        }
        get dt() {
            return pe(this.ptr);
        }
        get erp() {
            return Le(this.ptr);
        }
        get allowedLinearError() {
            return ue(this.ptr);
        }
        get predictionDistance() {
            return Wt(this.ptr);
        }
        get maxVelocityIterations() {
            return ri(this.ptr) >>> 0;
        }
        get maxVelocityFrictionIterations() {
            return ni(this.ptr) >>> 0;
        }
        get maxStabilizationIterations() {
            return ii(this.ptr) >>> 0;
        }
        get minIslandSize() {
            return si(this.ptr) >>> 0;
        }
        get maxCcdSubsteps() {
            return oi(this.ptr) >>> 0;
        }
        set dt(t) {
            Ne(this.ptr, t);
        }
        set erp(t) {
            ai(this.ptr, t);
        }
        set allowedLinearError(t) {
            ze(this.ptr, t);
        }
        set predictionDistance(t) {
            ci(this.ptr, t);
        }
        set maxVelocityIterations(t) {
            li(this.ptr, t);
        }
        set maxVelocityFrictionIterations(t) {
            hi(this.ptr, t);
        }
        set maxStabilizationIterations(t) {
            di(this.ptr, t);
        }
        set minIslandSize(t) {
            wi(this.ptr, t);
        }
        set maxCcdSubsteps(t) {
            pi(this.ptr, t);
        }
    }
    class B {
        static __wrap(t) {
            const e = Object.create(B.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            ui(t);
        }
        constructor(){
            const t = _i();
            return B.__wrap(t);
        }
        forEachActiveRigidBodyHandle(t) {
            try {
                fi(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
    }
    class Et {
        static __wrap(t) {
            const e = Object.create(Et.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Jr(t);
        }
        constructor(t){
            const e = Ur(t);
            return Et.__wrap(e);
        }
        up() {
            const t = ft(this.ptr);
            return d.__wrap(t);
        }
        setUp(t) {
            c(t, d), Xr(this.ptr, t.ptr);
        }
        offset() {
            return Kr(this.ptr);
        }
        setOffset(t) {
            Yr(this.ptr, t);
        }
        slideEnabled() {
            return $r(this.ptr) !== 0;
        }
        setSlideEnabled(t) {
            Zr(this.ptr, t);
        }
        autostepMaxHeight() {
            try {
                const r = R(-16);
                Qr(r, this.ptr);
                var t = E()[r / 4 + 0], e = X()[r / 4 + 1];
                return t === 0 ? void 0 : e;
            } finally{
                R(16);
            }
        }
        autostepMinWidth() {
            try {
                const r = R(-16);
                tn(r, this.ptr);
                var t = E()[r / 4 + 0], e = X()[r / 4 + 1];
                return t === 0 ? void 0 : e;
            } finally{
                R(16);
            }
        }
        autostepIncludesDynamicBodies() {
            const t = en(this.ptr);
            return t === 16777215 ? void 0 : t !== 0;
        }
        autostepEnabled() {
            return rn(this.ptr) !== 0;
        }
        enableAutostep(t, e, r) {
            nn(this.ptr, t, e, r);
        }
        disableAutostep() {
            sn(this.ptr);
        }
        maxSlopeClimbAngle() {
            return ue(this.ptr);
        }
        setMaxSlopeClimbAngle(t) {
            ze(this.ptr, t);
        }
        minSlopeSlideAngle() {
            return on(this.ptr);
        }
        setMinSlopeSlideAngle(t) {
            an(this.ptr, t);
        }
        snapToGroundDistance() {
            try {
                const r = R(-16);
                cn(r, this.ptr);
                var t = E()[r / 4 + 0], e = X()[r / 4 + 1];
                return t === 0 ? void 0 : e;
            } finally{
                R(16);
            }
        }
        enableSnapToGround(t) {
            ln(this.ptr, t);
        }
        disableSnapToGround() {
            hn(this.ptr);
        }
        snapToGroundEnabled() {
            return dn(this.ptr) !== 0;
        }
        computeColliderMovement(t, e, r, i, s, a, l, w, p, u, _) {
            try {
                c(e, T), c(r, M), c(i, dt), c(a, d), wn(this.ptr, t, e.ptr, r.ptr, i.ptr, s, a.ptr, l, !f(w), f(w) ? 0 : w, p, !f(u), f(u) ? 0 : u, P(_));
            } finally{
                g[j++] = void 0;
            }
        }
        computedMovement() {
            const t = pn(this.ptr);
            return d.__wrap(t);
        }
        computedGrounded() {
            return un(this.ptr) !== 0;
        }
        numComputedCollisions() {
            return _n(this.ptr) >>> 0;
        }
        computedCollision(t, e) {
            return c(e, lt), fn(this.ptr, t, e.ptr) !== 0;
        }
    }
    class q {
        static __wrap(t) {
            const e = Object.create(q.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Ti(t);
        }
        jointType(t) {
            return Si(this.ptr, t) >>> 0;
        }
        jointFrameX1(t) {
            const e = Ri(this.ptr, t);
            return S.__wrap(e);
        }
        jointFrameX2(t) {
            const e = vi(this.ptr, t);
            return S.__wrap(e);
        }
        jointAnchor1(t) {
            const e = Ci(this.ptr, t);
            return d.__wrap(e);
        }
        jointAnchor2(t) {
            const e = Ai(this.ptr, t);
            return d.__wrap(e);
        }
        jointContactsEnabled(t) {
            return ji(this.ptr, t) !== 0;
        }
        jointSetContactsEnabled(t, e) {
            Ei(this.ptr, t, e);
        }
        jointLimitsEnabled(t, e) {
            return Ii(this.ptr, t, e) !== 0;
        }
        jointLimitsMin(t, e) {
            return Pi(this.ptr, t, e);
        }
        jointLimitsMax(t, e) {
            return Mi(this.ptr, t, e);
        }
        constructor(){
            const t = xi();
            return q.__wrap(t);
        }
        createJoint(t, e, r, i) {
            return c(t, G), Fi(this.ptr, t.ptr, e, r, i);
        }
        remove(t, e) {
            Hi(this.ptr, t, e);
        }
        contains(t) {
            return ki(this.ptr, t) !== 0;
        }
        forEachJointHandle(t) {
            try {
                Di(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
        forEachJointAttachedToRigidBody(t, e) {
            try {
                Li(this.ptr, t, P(e));
            } finally{
                g[j++] = void 0;
            }
        }
    }
    class U {
        static __wrap(t) {
            const e = Object.create(U.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            fa(t);
        }
        constructor(){
            const t = ma();
            return U.__wrap(t);
        }
        contacts_with(t, e) {
            ba(this.ptr, t, x(e));
        }
        contact_pair(t, e) {
            const r = ya(this.ptr, t, e);
            return r === 0 ? void 0 : he.__wrap(r);
        }
        intersections_with(t, e) {
            ga(this.ptr, t, x(e));
        }
        intersection_pair(t, e) {
            return Sa(this.ptr, t, e) !== 0;
        }
    }
    class It {
        static __wrap(t) {
            const e = Object.create(It.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Xc(t);
        }
        constructor(){
            const t = Kc();
            return It.__wrap(t);
        }
        step(t, e, r, i, s, a, l, w, p, u) {
            c(t, d), c(e, Y), c(r, B), c(i, K), c(s, U), c(a, T), c(l, M), c(w, W), c(p, q), c(u, rt), Yc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l.ptr, w.ptr, p.ptr, u.ptr);
        }
        stepWithEvents(t, e, r, i, s, a, l, w, p, u, _, m, y, I) {
            c(t, d), c(e, Y), c(r, B), c(i, K), c(s, U), c(a, T), c(l, M), c(w, W), c(p, q), c(u, rt), c(_, ht), $c(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l.ptr, w.ptr, p.ptr, u.ptr, _.ptr, x(m), x(y), x(I));
        }
    }
    class Pt {
        static __wrap(t) {
            const e = Object.create(Pt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Xa(t);
        }
        colliderHandle() {
            return bt(this.ptr);
        }
        point() {
            const t = yt(this.ptr);
            return d.__wrap(t);
        }
        isInside() {
            return Ka(this.ptr) !== 0;
        }
        featureType() {
            return Ge(this.ptr) >>> 0;
        }
        featureId() {
            try {
                const r = R(-16);
                We(r, this.ptr);
                var t = E()[r / 4 + 0], e = E()[r / 4 + 1];
                return t === 0 ? void 0 : e >>> 0;
            } finally{
                R(16);
            }
        }
    }
    class kt {
        static __wrap(t) {
            const e = Object.create(kt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Ja(t);
        }
        point() {
            const t = ft(this.ptr);
            return d.__wrap(t);
        }
        isInside() {
            return Ua(this.ptr) !== 0;
        }
    }
    class dt {
        static __wrap(t) {
            const e = Object.create(dt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Zc(t);
        }
        constructor(){
            const t = Qc();
            return dt.__wrap(t);
        }
        update(t, e) {
            c(t, T), c(e, M), tl(this.ptr, t.ptr, e.ptr);
        }
        castRay(t, e, r, i, s, a, l, w, p, u, _) {
            try {
                c(t, T), c(e, M), c(r, d), c(i, d);
                const m = el(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s, a, l, !f(w), f(w) ? 0 : w, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, P(_));
                return m === 0 ? void 0 : we.__wrap(m);
            } finally{
                g[j++] = void 0;
            }
        }
        castRayAndGetNormal(t, e, r, i, s, a, l, w, p, u, _) {
            try {
                c(t, T), c(e, M), c(r, d), c(i, d);
                const m = rl(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s, a, l, !f(w), f(w) ? 0 : w, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, P(_));
                return m === 0 ? void 0 : Dt.__wrap(m);
            } finally{
                g[j++] = void 0;
            }
        }
        intersectionsWithRay(t, e, r, i, s, a, l, w, p, u, _, m) {
            try {
                c(t, T), c(e, M), c(r, d), c(i, d), nl(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s, a, P(l), w, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, !f(_), f(_) ? 0 : _, P(m));
            } finally{
                g[j++] = void 0, g[j++] = void 0;
            }
        }
        intersectionWithShape(t, e, r, i, s, a, l, w, p, u) {
            try {
                const y = R(-16);
                c(t, T), c(e, M), c(r, d), c(i, S), c(s, b), il(y, this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a, !f(l), f(l) ? 0 : l, !f(w), f(w) ? 0 : w, !f(p), f(p) ? 0 : p, P(u));
                var _ = E()[y / 4 + 0], m = At()[y / 8 + 1];
                return _ === 0 ? void 0 : m;
            } finally{
                R(16), g[j++] = void 0;
            }
        }
        projectPoint(t, e, r, i, s, a, l, w, p) {
            try {
                c(t, T), c(e, M), c(r, d);
                const u = sl(this.ptr, t.ptr, e.ptr, r.ptr, i, s, !f(a), f(a) ? 0 : a, !f(l), f(l) ? 0 : l, !f(w), f(w) ? 0 : w, P(p));
                return u === 0 ? void 0 : Pt.__wrap(u);
            } finally{
                g[j++] = void 0;
            }
        }
        projectPointAndGetFeature(t, e, r, i, s, a, l, w) {
            try {
                c(t, T), c(e, M), c(r, d);
                const p = ol(this.ptr, t.ptr, e.ptr, r.ptr, i, !f(s), f(s) ? 0 : s, !f(a), f(a) ? 0 : a, !f(l), f(l) ? 0 : l, P(w));
                return p === 0 ? void 0 : Pt.__wrap(p);
            } finally{
                g[j++] = void 0;
            }
        }
        intersectionsWithPoint(t, e, r, i, s, a, l, w, p) {
            try {
                c(t, T), c(e, M), c(r, d), al(this.ptr, t.ptr, e.ptr, r.ptr, P(i), s, !f(a), f(a) ? 0 : a, !f(l), f(l) ? 0 : l, !f(w), f(w) ? 0 : w, P(p));
            } finally{
                g[j++] = void 0, g[j++] = void 0;
            }
        }
        castShape(t, e, r, i, s, a, l, w, p, u, _, m, y) {
            try {
                c(t, T), c(e, M), c(r, d), c(i, S), c(s, d), c(a, b);
                const I = cl(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l, w, p, !f(u), f(u) ? 0 : u, !f(_), f(_) ? 0 : _, !f(m), f(m) ? 0 : m, P(y));
                return I === 0 ? void 0 : Nt.__wrap(I);
            } finally{
                g[j++] = void 0;
            }
        }
        intersectionsWithShape(t, e, r, i, s, a, l, w, p, u, _) {
            try {
                c(t, T), c(e, M), c(r, d), c(i, S), c(s, b), ll(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, P(a), l, !f(w), f(w) ? 0 : w, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, P(_));
            } finally{
                g[j++] = void 0, g[j++] = void 0;
            }
        }
        collidersWithAabbIntersectingAabb(t, e, r) {
            try {
                c(t, d), c(e, d), hl(this.ptr, t.ptr, e.ptr, P(r));
            } finally{
                g[j++] = void 0;
            }
        }
    }
    class Dt {
        static __wrap(t) {
            const e = Object.create(Dt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Cl(t);
        }
        colliderHandle() {
            return bt(this.ptr);
        }
        normal() {
            const t = Gt(this.ptr);
            return d.__wrap(t);
        }
        toi() {
            return ue(this.ptr);
        }
        featureType() {
            return Za(this.ptr) >>> 0;
        }
        featureId() {
            try {
                const r = R(-16);
                Qa(r, this.ptr);
                var t = E()[r / 4 + 0], e = E()[r / 4 + 1];
                return t === 0 ? void 0 : e >>> 0;
            } finally{
                R(16);
            }
        }
    }
    class we {
        static __wrap(t) {
            const e = Object.create(we.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Al(t);
        }
        colliderHandle() {
            return bt(this.ptr);
        }
        toi() {
            return Le(this.ptr);
        }
    }
    class Lt {
        static __wrap(t) {
            const e = Object.create(Lt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Ya(t);
        }
        normal() {
            const t = ft(this.ptr);
            return d.__wrap(t);
        }
        toi() {
            return $a(this.ptr);
        }
        featureType() {
            return Ge(this.ptr) >>> 0;
        }
        featureId() {
            try {
                const r = R(-16);
                We(r, this.ptr);
                var t = E()[r / 4 + 0], e = E()[r / 4 + 1];
                return t === 0 ? void 0 : e >>> 0;
            } finally{
                R(16);
            }
        }
    }
    class T {
        static __wrap(t) {
            const e = Object.create(T.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Os(t);
        }
        rbTranslation(t) {
            const e = Ni(this.ptr, t);
            return d.__wrap(e);
        }
        rbRotation(t) {
            const e = zi(this.ptr, t);
            return S.__wrap(e);
        }
        rbSleep(t) {
            Gi(this.ptr, t);
        }
        rbIsSleeping(t) {
            return Wi(this.ptr, t) !== 0;
        }
        rbIsMoving(t) {
            return Bi(this.ptr, t) !== 0;
        }
        rbNextTranslation(t) {
            const e = qi(this.ptr, t);
            return d.__wrap(e);
        }
        rbNextRotation(t) {
            const e = Oi(this.ptr, t);
            return S.__wrap(e);
        }
        rbSetTranslation(t, e, r, i) {
            Vi(this.ptr, t, e, r, i);
        }
        rbSetRotation(t, e, r) {
            Ji(this.ptr, t, e, r);
        }
        rbSetLinvel(t, e, r) {
            c(e, d), Ui(this.ptr, t, e.ptr, r);
        }
        rbSetAngvel(t, e, r) {
            Xi(this.ptr, t, e, r);
        }
        rbSetNextKinematicTranslation(t, e, r) {
            Ki(this.ptr, t, e, r);
        }
        rbSetNextKinematicRotation(t, e) {
            Yi(this.ptr, t, e);
        }
        rbRecomputeMassPropertiesFromColliders(t, e) {
            c(e, M), $i(this.ptr, t, e.ptr);
        }
        rbSetAdditionalMass(t, e, r) {
            Zi(this.ptr, t, e, r);
        }
        rbSetAdditionalMassProperties(t, e, r, i, s) {
            c(r, d), Qi(this.ptr, t, e, r.ptr, i, s);
        }
        rbLinvel(t) {
            const e = ts(this.ptr, t);
            return d.__wrap(e);
        }
        rbAngvel(t) {
            return es(this.ptr, t);
        }
        rbLockTranslations(t, e, r) {
            rs(this.ptr, t, e, r);
        }
        rbSetEnabledTranslations(t, e, r, i) {
            ns(this.ptr, t, e, r, i);
        }
        rbLockRotations(t, e, r) {
            is(this.ptr, t, e, r);
        }
        rbDominanceGroup(t) {
            return ss(this.ptr, t);
        }
        rbSetDominanceGroup(t, e) {
            os(this.ptr, t, e);
        }
        rbEnableCcd(t, e) {
            as(this.ptr, t, e);
        }
        rbMass(t) {
            return cs(this.ptr, t);
        }
        rbInvMass(t) {
            return ls(this.ptr, t);
        }
        rbEffectiveInvMass(t) {
            const e = hs(this.ptr, t);
            return d.__wrap(e);
        }
        rbLocalCom(t) {
            const e = ds(this.ptr, t);
            return d.__wrap(e);
        }
        rbWorldCom(t) {
            const e = ws(this.ptr, t);
            return d.__wrap(e);
        }
        rbInvPrincipalInertiaSqrt(t) {
            return ps(this.ptr, t);
        }
        rbPrincipalInertia(t) {
            return us(this.ptr, t);
        }
        rbEffectiveWorldInvInertiaSqrt(t) {
            return _s(this.ptr, t);
        }
        rbEffectiveAngularInertia(t) {
            return fs(this.ptr, t);
        }
        rbWakeUp(t) {
            ms(this.ptr, t);
        }
        rbIsCcdEnabled(t) {
            return bs(this.ptr, t) !== 0;
        }
        rbNumColliders(t) {
            return ys(this.ptr, t) >>> 0;
        }
        rbCollider(t, e) {
            return gs(this.ptr, t, e);
        }
        rbBodyType(t) {
            return Ss(this.ptr, t) >>> 0;
        }
        rbSetBodyType(t, e, r) {
            Rs(this.ptr, t, e, r);
        }
        rbIsFixed(t) {
            return vs(this.ptr, t) !== 0;
        }
        rbIsKinematic(t) {
            return Cs(this.ptr, t) !== 0;
        }
        rbIsDynamic(t) {
            return As(this.ptr, t) !== 0;
        }
        rbLinearDamping(t) {
            return js(this.ptr, t);
        }
        rbAngularDamping(t) {
            return Es(this.ptr, t);
        }
        rbSetLinearDamping(t, e) {
            Is(this.ptr, t, e);
        }
        rbSetAngularDamping(t, e) {
            Ps(this.ptr, t, e);
        }
        rbSetEnabled(t, e) {
            Ms(this.ptr, t, e);
        }
        rbIsEnabled(t) {
            return Ts(this.ptr, t) !== 0;
        }
        rbGravityScale(t) {
            return xs(this.ptr, t);
        }
        rbSetGravityScale(t, e, r) {
            Fs(this.ptr, t, e, r);
        }
        rbResetForces(t, e) {
            Hs(this.ptr, t, e);
        }
        rbResetTorques(t, e) {
            ks(this.ptr, t, e);
        }
        rbAddForce(t, e, r) {
            c(e, d), Ds(this.ptr, t, e.ptr, r);
        }
        rbApplyImpulse(t, e, r) {
            c(e, d), Ls(this.ptr, t, e.ptr, r);
        }
        rbAddTorque(t, e, r) {
            Ns(this.ptr, t, e, r);
        }
        rbApplyTorqueImpulse(t, e, r) {
            zs(this.ptr, t, e, r);
        }
        rbAddForceAtPoint(t, e, r, i) {
            c(e, d), c(r, d), Gs(this.ptr, t, e.ptr, r.ptr, i);
        }
        rbApplyImpulseAtPoint(t, e, r, i) {
            c(e, d), c(r, d), Ws(this.ptr, t, e.ptr, r.ptr, i);
        }
        rbUserData(t) {
            return Bs(this.ptr, t) >>> 0;
        }
        rbSetUserData(t, e) {
            qs(this.ptr, t, e);
        }
        constructor(){
            const t = Vs();
            return T.__wrap(t);
        }
        createRigidBody(t, e, r, i, s, a, l, w, p, u, _, m, y, I, D, O, V, $, Vt, Jt) {
            return c(e, d), c(r, S), c(l, d), c(w, d), Js(this.ptr, t, e.ptr, r.ptr, i, s, a, l.ptr, w.ptr, p, u, _, m, y, I, D, O, V, $, Vt, Jt);
        }
        remove(t, e, r, i, s) {
            c(e, B), c(r, M), c(i, W), c(s, q), Us(this.ptr, t, e.ptr, r.ptr, i.ptr, s.ptr);
        }
        len() {
            return Xs(this.ptr) >>> 0;
        }
        contains(t) {
            return Ks(this.ptr, t) !== 0;
        }
        forEachRigidBodyHandle(t) {
            try {
                Ys(this.ptr, P(t));
            } finally{
                g[j++] = void 0;
            }
        }
        propagateModifiedBodyPositionsToColliders(t) {
            c(t, M), $s(this.ptr, t.ptr);
        }
    }
    class S {
        static __wrap(t) {
            const e = Object.create(S.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            jc(t);
        }
        static identity() {
            const t = Ec();
            return S.__wrap(t);
        }
        static fromAngle(t) {
            const e = Ic(t);
            return S.__wrap(e);
        }
        get im() {
            return Be(this.ptr);
        }
        get re() {
            return pe(this.ptr);
        }
        get angle() {
            return Pc(this.ptr);
        }
    }
    class Mt {
        static __wrap(t) {
            const e = Object.create(Mt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Pl(t);
        }
        constructor(){
            const t = Il();
            return Mt.__wrap(t);
        }
        serializeAll(t, e, r, i, s, a, l, w, p) {
            c(t, d), c(e, Y), c(r, B), c(i, K), c(s, U), c(a, T), c(l, M), c(w, W), c(p, q);
            const u = Sl(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l.ptr, w.ptr, p.ptr);
            return Ct(u);
        }
        deserializeAll(t) {
            const e = Rl(this.ptr, x(t));
            return e === 0 ? void 0 : de.__wrap(e);
        }
    }
    class b {
        static __wrap(t) {
            const e = Object.create(b.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            tc(t);
        }
        static cuboid(t, e) {
            const r = ec(t, e);
            return b.__wrap(r);
        }
        static roundCuboid(t, e, r) {
            const i = rc(t, e, r);
            return b.__wrap(i);
        }
        static ball(t) {
            const e = nc(t);
            return b.__wrap(e);
        }
        static halfspace(t) {
            c(t, d);
            const e = ic(t.ptr);
            return b.__wrap(e);
        }
        static capsule(t, e) {
            const r = sc(t, e);
            return b.__wrap(r);
        }
        static polyline(t, e) {
            const r = Z(t, J), i = L, s = Te(e, J), l = oc(r, i, s, L);
            return b.__wrap(l);
        }
        static trimesh(t, e) {
            const r = Z(t, J), i = L, s = Te(e, J), l = ac(r, i, s, L);
            return b.__wrap(l);
        }
        static heightfield(t, e) {
            const r = Z(t, J), i = L;
            c(e, d);
            const s = cc(r, i, e.ptr);
            return b.__wrap(s);
        }
        static segment(t, e) {
            c(t, d), c(e, d);
            const r = lc(t.ptr, e.ptr);
            return b.__wrap(r);
        }
        static triangle(t, e, r) {
            c(t, d), c(e, d), c(r, d);
            const i = hc(t.ptr, e.ptr, r.ptr);
            return b.__wrap(i);
        }
        static roundTriangle(t, e, r, i) {
            c(t, d), c(e, d), c(r, d);
            const s = dc(t.ptr, e.ptr, r.ptr, i);
            return b.__wrap(s);
        }
        static convexHull(t) {
            const e = Z(t, J), i = wc(e, L);
            return i === 0 ? void 0 : b.__wrap(i);
        }
        static roundConvexHull(t, e) {
            const r = Z(t, J), s = pc(r, L, e);
            return s === 0 ? void 0 : b.__wrap(s);
        }
        static convexPolyline(t) {
            const e = Z(t, J), i = uc(e, L);
            return i === 0 ? void 0 : b.__wrap(i);
        }
        static roundConvexPolyline(t, e) {
            const r = Z(t, J), s = _c(r, L, e);
            return s === 0 ? void 0 : b.__wrap(s);
        }
        castShape(t, e, r, i, s, a, l, w, p) {
            c(t, d), c(e, S), c(r, d), c(i, b), c(s, d), c(a, S), c(l, d);
            const u = fc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a.ptr, l.ptr, w, p);
            return u === 0 ? void 0 : zt.__wrap(u);
        }
        intersectsShape(t, e, r, i, s) {
            return c(t, d), c(e, S), c(r, b), c(i, d), c(s, S), mc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr) !== 0;
        }
        contactShape(t, e, r, i, s, a) {
            c(t, d), c(e, S), c(r, b), c(i, d), c(s, S);
            const l = bc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s.ptr, a);
            return l === 0 ? void 0 : wt.__wrap(l);
        }
        containsPoint(t, e, r) {
            return c(t, d), c(e, S), c(r, d), yc(this.ptr, t.ptr, e.ptr, r.ptr) !== 0;
        }
        projectPoint(t, e, r, i) {
            c(t, d), c(e, S), c(r, d);
            const s = gc(this.ptr, t.ptr, e.ptr, r.ptr, i);
            return kt.__wrap(s);
        }
        intersectsRay(t, e, r, i, s) {
            return c(t, d), c(e, S), c(r, d), c(i, d), Sc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s) !== 0;
        }
        castRay(t, e, r, i, s, a) {
            return c(t, d), c(e, S), c(r, d), c(i, d), Rc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s, a);
        }
        castRayAndGetNormal(t, e, r, i, s, a) {
            c(t, d), c(e, S), c(r, d), c(i, d);
            const l = vc(this.ptr, t.ptr, e.ptr, r.ptr, i.ptr, s, a);
            return l === 0 ? void 0 : Lt.__wrap(l);
        }
    }
    class Nt {
        static __wrap(t) {
            const e = Object.create(Nt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            Cc(t);
        }
        colliderHandle() {
            return bt(this.ptr);
        }
        toi() {
            return Ac(this.ptr);
        }
        witness1() {
            const t = Gt(this.ptr);
            return d.__wrap(t);
        }
        witness2() {
            const t = yt(this.ptr);
            return d.__wrap(t);
        }
        normal1() {
            const t = mt(this.ptr);
            return d.__wrap(t);
        }
        normal2() {
            const t = De(this.ptr);
            return d.__wrap(t);
        }
    }
    class wt {
        static __wrap(t) {
            const e = Object.create(wt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            _a(t);
        }
        distance() {
            return Wt(this.ptr);
        }
        point1() {
            const t = ft(this.ptr);
            return d.__wrap(t);
        }
        point2() {
            const t = Gt(this.ptr);
            return d.__wrap(t);
        }
        normal1() {
            const t = yt(this.ptr);
            return d.__wrap(t);
        }
        normal2() {
            const t = mt(this.ptr);
            return d.__wrap(t);
        }
    }
    class zt {
        static __wrap(t) {
            const e = Object.create(zt.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            El(t);
        }
        toi() {
            return Wt(this.ptr);
        }
        witness1() {
            const t = ft(this.ptr);
            return d.__wrap(t);
        }
        witness2() {
            const t = Gt(this.ptr);
            return d.__wrap(t);
        }
        normal1() {
            const t = yt(this.ptr);
            return d.__wrap(t);
        }
        normal2() {
            const t = mt(this.ptr);
            return d.__wrap(t);
        }
    }
    class d {
        static __wrap(t) {
            const e = Object.create(d.prototype);
            return e.ptr = t, e;
        }
        __destroy_into_raw() {
            const t = this.ptr;
            return this.ptr = 0, t;
        }
        free() {
            const t = this.__destroy_into_raw();
            jl(t);
        }
        static zero() {
            const t = Mc();
            return d.__wrap(t);
        }
        constructor(t, e){
            const r = Tc(t, e);
            return d.__wrap(r);
        }
        get x() {
            return pe(this.ptr);
        }
        set x(t) {
            Ne(this.ptr, t);
        }
        get y() {
            return Be(this.ptr);
        }
        set y(t) {
            xc(this.ptr, t);
        }
        xy() {
            const t = Fc(this.ptr);
            return d.__wrap(t);
        }
        yx() {
            const t = Hc(this.ptr);
            return d.__wrap(t);
        }
    }
    function vr(o) {
        Ct(o);
    }
    function Cr(o) {
        return x(o);
    }
    function Ar(o, t) {
        const e = v(t), r = typeof e == "number" ? e : void 0;
        At()[o / 8 + 1] = f(r) ? 0 : r, E()[o / 4 + 0] = !f(r);
    }
    function jr(o) {
        const t = v(o);
        return typeof t == "boolean" ? t ? 1 : 0 : 2;
    }
    function Er(o) {
        return typeof v(o) == "function";
    }
    function Ir(o) {
        const t = Dt.__wrap(o);
        return x(t);
    }
    function Pr(o) {
        const t = ce.__wrap(o);
        return x(t);
    }
    function Mr() {
        return ae(function(o, t, e) {
            const r = v(o).call(v(t), v(e));
            return x(r);
        }, arguments);
    }
    function Tr() {
        return ae(function(o, t, e, r) {
            const i = v(o).call(v(t), v(e), v(r));
            return x(i);
        }, arguments);
    }
    function xr() {
        return ae(function(o, t, e, r, i) {
            const s = v(o).call(v(t), v(e), v(r), v(i));
            return x(s);
        }, arguments);
    }
    function Fr(o, t, e, r) {
        const i = v(o).bind(v(t), v(e), v(r));
        return x(i);
    }
    function Hr(o) {
        const t = v(o).buffer;
        return x(t);
    }
    function kr(o, t, e) {
        const r = new Uint8Array(v(o), t >>> 0, e >>> 0);
        return x(r);
    }
    function Dr(o) {
        const t = new Uint8Array(v(o));
        return x(t);
    }
    function Lr(o, t, e) {
        v(o).set(v(t), e >>> 0);
    }
    function Nr(o) {
        return v(o).length;
    }
    function zr(o, t, e) {
        const r = new Float32Array(v(o), t >>> 0, e >>> 0);
        return x(r);
    }
    function Gr(o, t, e) {
        v(o).set(v(t), e >>> 0);
    }
    function Wr(o) {
        return v(o).length;
    }
    function Br(o) {
        const t = new Float32Array(o >>> 0);
        return x(t);
    }
    function qr(o, t) {
        throw new Error(He(o, t));
    }
    function Or() {
        return x(st);
    }
    URL = globalThis.URL;
    const n = await mr({
        "./rapier_wasm2d_bg.js": {
            __wbindgen_object_drop_ref: vr,
            __wbindgen_number_new: Cr,
            __wbindgen_number_get: Ar,
            __wbindgen_boolean_get: jr,
            __wbindgen_is_function: Er,
            __wbg_rawraycolliderintersection_new: Ir,
            __wbg_rawcontactforceevent_new: Pr,
            __wbg_call_168da88779e35f61: Mr,
            __wbg_call_3999bee59e9f7719: Tr,
            __wbg_call_e1f72c051cdab859: xr,
            __wbg_bind_10dfe70e95d2a480: Fr,
            __wbg_buffer_3f3d764d4747d564: Hr,
            __wbg_newwithbyteoffsetandlength_d9aa266703cb98be: kr,
            __wbg_new_8c3f0052272a457a: Dr,
            __wbg_set_83db9690f9353e79: Lr,
            __wbg_length_9e1ae1900cb0fbd5: Nr,
            __wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4: zr,
            __wbg_set_0e0314cf6675c1b9: Gr,
            __wbg_length_9a2deed95d22668d: Wr,
            __wbg_newwithlength_a7168e4a1e8f5e12: Br,
            __wbindgen_throw: qr,
            __wbindgen_memory: Or
        }
    }, fr), st = n.memory, Vr = n.version, Jr = n.__wbg_rawkinematiccharactercontroller_free, Ur = n.rawkinematiccharactercontroller_new, ft = n.rawkinematiccharactercontroller_up, Xr = n.rawkinematiccharactercontroller_setUp, Kr = n.rawkinematiccharactercontroller_offset, Yr = n.rawkinematiccharactercontroller_setOffset, $r = n.rawkinematiccharactercontroller_slideEnabled, Zr = n.rawkinematiccharactercontroller_setSlideEnabled, Qr = n.rawkinematiccharactercontroller_autostepMaxHeight, tn = n.rawkinematiccharactercontroller_autostepMinWidth, en = n.rawkinematiccharactercontroller_autostepIncludesDynamicBodies, rn = n.rawkinematiccharactercontroller_autostepEnabled, nn = n.rawkinematiccharactercontroller_enableAutostep, sn = n.rawkinematiccharactercontroller_disableAutostep, on = n.rawkinematiccharactercontroller_minSlopeSlideAngle, an = n.rawkinematiccharactercontroller_setMinSlopeSlideAngle, cn = n.rawkinematiccharactercontroller_snapToGroundDistance, ln = n.rawkinematiccharactercontroller_enableSnapToGround, hn = n.rawkinematiccharactercontroller_disableSnapToGround, dn = n.rawkinematiccharactercontroller_snapToGroundEnabled, wn = n.rawkinematiccharactercontroller_computeColliderMovement, pn = n.rawkinematiccharactercontroller_computedMovement, un = n.rawkinematiccharactercontroller_computedGrounded, _n = n.rawkinematiccharactercontroller_numComputedCollisions, fn = n.rawkinematiccharactercontroller_computedCollision, mn = n.__wbg_rawcharactercollision_free, bn = n.rawcharactercollision_new, yn = n.rawcharactercollision_handle, mt = n.rawcharactercollision_translationApplied, De = n.rawcharactercollision_translationRemaining, gn = n.rawcharactercollision_toi, Sn = n.rawcharactercollision_worldWitness1, Rn = n.rawcharactercollision_worldWitness2, vn = n.rawcharactercollision_worldNormal1, Cn = n.rawcharactercollision_worldNormal2, An = n.__wbg_rawccdsolver_free, jn = n.rawccdsolver_new, En = n.rawimpulsejointset_jointType, In = n.rawimpulsejointset_jointBodyHandle1, Pn = n.rawimpulsejointset_jointBodyHandle2, Mn = n.rawimpulsejointset_jointFrameX1, Tn = n.rawimpulsejointset_jointFrameX2, xn = n.rawimpulsejointset_jointAnchor1, Fn = n.rawimpulsejointset_jointAnchor2, Hn = n.rawimpulsejointset_jointSetAnchor1, kn = n.rawimpulsejointset_jointSetAnchor2, Dn = n.rawimpulsejointset_jointContactsEnabled, Ln = n.rawimpulsejointset_jointSetContactsEnabled, Nn = n.rawimpulsejointset_jointLimitsEnabled, zn = n.rawimpulsejointset_jointLimitsMin, Gn = n.rawimpulsejointset_jointLimitsMax, Wn = n.rawimpulsejointset_jointSetLimits, Bn = n.rawimpulsejointset_jointConfigureMotorModel, qn = n.rawimpulsejointset_jointConfigureMotorVelocity, On = n.rawimpulsejointset_jointConfigureMotorPosition, Vn = n.rawimpulsejointset_jointConfigureMotor, Jn = n.__wbg_rawimpulsejointset_free, Un = n.rawimpulsejointset_new, Xn = n.rawimpulsejointset_createJoint, Kn = n.rawimpulsejointset_remove, Yn = n.rawimpulsejointset_len, $n = n.rawimpulsejointset_contains, Zn = n.rawimpulsejointset_forEachJointHandle, Qn = n.rawimpulsejointset_forEachJointAttachedToRigidBody, ti = n.__wbg_rawintegrationparameters_free, ei = n.rawintegrationparameters_new, pe = n.rawintegrationparameters_dt, Le = n.rawintegrationparameters_erp, ue = n.rawintegrationparameters_allowedLinearError, ri = n.rawintegrationparameters_maxVelocityIterations, ni = n.rawintegrationparameters_maxVelocityFrictionIterations, ii = n.rawintegrationparameters_maxStabilizationIterations, si = n.rawintegrationparameters_minIslandSize, oi = n.rawintegrationparameters_maxCcdSubsteps, Ne = n.rawintegrationparameters_set_dt, ai = n.rawintegrationparameters_set_erp, ze = n.rawintegrationparameters_set_allowedLinearError, ci = n.rawintegrationparameters_set_predictionDistance, li = n.rawintegrationparameters_set_maxVelocityIterations, hi = n.rawintegrationparameters_set_maxVelocityFrictionIterations, di = n.rawintegrationparameters_set_maxStabilizationIterations, wi = n.rawintegrationparameters_set_minIslandSize, pi = n.rawintegrationparameters_set_maxCcdSubsteps, ui = n.__wbg_rawislandmanager_free, _i = n.rawislandmanager_new, fi = n.rawislandmanager_forEachActiveRigidBodyHandle, mi = n.__wbg_rawgenericjoint_free, bi = n.rawgenericjoint_prismatic, yi = n.rawgenericjoint_fixed, gi = n.rawgenericjoint_revolute, Si = n.rawmultibodyjointset_jointType, Ri = n.rawmultibodyjointset_jointFrameX1, vi = n.rawmultibodyjointset_jointFrameX2, Ci = n.rawmultibodyjointset_jointAnchor1, Ai = n.rawmultibodyjointset_jointAnchor2, ji = n.rawmultibodyjointset_jointContactsEnabled, Ei = n.rawmultibodyjointset_jointSetContactsEnabled, Ii = n.rawmultibodyjointset_jointLimitsEnabled, Pi = n.rawmultibodyjointset_jointLimitsMin, Mi = n.rawmultibodyjointset_jointLimitsMax, Ti = n.__wbg_rawmultibodyjointset_free, xi = n.rawmultibodyjointset_new, Fi = n.rawmultibodyjointset_createJoint, Hi = n.rawmultibodyjointset_remove, ki = n.rawmultibodyjointset_contains, Di = n.rawmultibodyjointset_forEachJointHandle, Li = n.rawmultibodyjointset_forEachJointAttachedToRigidBody, Ni = n.rawrigidbodyset_rbTranslation, zi = n.rawrigidbodyset_rbRotation, Gi = n.rawrigidbodyset_rbSleep, Wi = n.rawrigidbodyset_rbIsSleeping, Bi = n.rawrigidbodyset_rbIsMoving, qi = n.rawrigidbodyset_rbNextTranslation, Oi = n.rawrigidbodyset_rbNextRotation, Vi = n.rawrigidbodyset_rbSetTranslation, Ji = n.rawrigidbodyset_rbSetRotation, Ui = n.rawrigidbodyset_rbSetLinvel, Xi = n.rawrigidbodyset_rbSetAngvel, Ki = n.rawrigidbodyset_rbSetNextKinematicTranslation, Yi = n.rawrigidbodyset_rbSetNextKinematicRotation, $i = n.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders, Zi = n.rawrigidbodyset_rbSetAdditionalMass, Qi = n.rawrigidbodyset_rbSetAdditionalMassProperties, ts = n.rawrigidbodyset_rbLinvel, es = n.rawrigidbodyset_rbAngvel, rs = n.rawrigidbodyset_rbLockTranslations, ns = n.rawrigidbodyset_rbSetEnabledTranslations, is = n.rawrigidbodyset_rbLockRotations, ss = n.rawrigidbodyset_rbDominanceGroup, os = n.rawrigidbodyset_rbSetDominanceGroup, as = n.rawrigidbodyset_rbEnableCcd, cs = n.rawrigidbodyset_rbMass, ls = n.rawrigidbodyset_rbInvMass, hs = n.rawrigidbodyset_rbEffectiveInvMass, ds = n.rawrigidbodyset_rbLocalCom, ws = n.rawrigidbodyset_rbWorldCom, ps = n.rawrigidbodyset_rbInvPrincipalInertiaSqrt, us = n.rawrigidbodyset_rbPrincipalInertia, _s = n.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt, fs = n.rawrigidbodyset_rbEffectiveAngularInertia, ms = n.rawrigidbodyset_rbWakeUp, bs = n.rawrigidbodyset_rbIsCcdEnabled, ys = n.rawrigidbodyset_rbNumColliders, gs = n.rawrigidbodyset_rbCollider, Ss = n.rawrigidbodyset_rbBodyType, Rs = n.rawrigidbodyset_rbSetBodyType, vs = n.rawrigidbodyset_rbIsFixed, Cs = n.rawrigidbodyset_rbIsKinematic, As = n.rawrigidbodyset_rbIsDynamic, js = n.rawrigidbodyset_rbLinearDamping, Es = n.rawrigidbodyset_rbAngularDamping, Is = n.rawrigidbodyset_rbSetLinearDamping, Ps = n.rawrigidbodyset_rbSetAngularDamping, Ms = n.rawrigidbodyset_rbSetEnabled, Ts = n.rawrigidbodyset_rbIsEnabled, xs = n.rawrigidbodyset_rbGravityScale, Fs = n.rawrigidbodyset_rbSetGravityScale, Hs = n.rawrigidbodyset_rbResetForces, ks = n.rawrigidbodyset_rbResetTorques, Ds = n.rawrigidbodyset_rbAddForce, Ls = n.rawrigidbodyset_rbApplyImpulse, Ns = n.rawrigidbodyset_rbAddTorque, zs = n.rawrigidbodyset_rbApplyTorqueImpulse, Gs = n.rawrigidbodyset_rbAddForceAtPoint, Ws = n.rawrigidbodyset_rbApplyImpulseAtPoint, Bs = n.rawrigidbodyset_rbUserData, qs = n.rawrigidbodyset_rbSetUserData, Os = n.__wbg_rawrigidbodyset_free, Vs = n.rawrigidbodyset_new, Js = n.rawrigidbodyset_createRigidBody, Us = n.rawrigidbodyset_remove, Xs = n.rawrigidbodyset_len, Ks = n.rawrigidbodyset_contains, Ys = n.rawrigidbodyset_forEachRigidBodyHandle, $s = n.rawrigidbodyset_propagateModifiedBodyPositionsToColliders, Zs = n.__wbg_rawbroadphase_free, Qs = n.rawbroadphase_new, to = n.rawcolliderset_coTranslation, eo = n.rawcolliderset_coRotation, ro = n.rawcolliderset_coSetTranslation, no = n.rawcolliderset_coSetTranslationWrtParent, io = n.rawcolliderset_coSetRotation, so = n.rawcolliderset_coSetRotationWrtParent, oo = n.rawcolliderset_coIsSensor, ao = n.rawcolliderset_coShapeType, co = n.rawcolliderset_coHalfspaceNormal, lo = n.rawcolliderset_coHalfExtents, ho = n.rawcolliderset_coSetHalfExtents, wo = n.rawcolliderset_coRadius, po = n.rawcolliderset_coSetRadius, uo = n.rawcolliderset_coHalfHeight, _o = n.rawcolliderset_coSetHalfHeight, fo = n.rawcolliderset_coRoundRadius, mo = n.rawcolliderset_coSetRoundRadius, bo = n.rawcolliderset_coVertices, yo = n.rawcolliderset_coIndices, go = n.rawcolliderset_coHeightfieldHeights, So = n.rawcolliderset_coHeightfieldScale, Ro = n.rawcolliderset_coParent, vo = n.rawcolliderset_coSetEnabled, Co = n.rawcolliderset_coIsEnabled, Ao = n.rawcolliderset_coFriction, jo = n.rawcolliderset_coRestitution, Eo = n.rawcolliderset_coDensity, Io = n.rawcolliderset_coMass, Po = n.rawcolliderset_coVolume, Mo = n.rawcolliderset_coCollisionGroups, To = n.rawcolliderset_coSolverGroups, xo = n.rawcolliderset_coActiveHooks, Fo = n.rawcolliderset_coActiveCollisionTypes, Ho = n.rawcolliderset_coActiveEvents, ko = n.rawcolliderset_coContactForceEventThreshold, Do = n.rawcolliderset_coContainsPoint, Lo = n.rawcolliderset_coCastShape, No = n.rawcolliderset_coCastCollider, zo = n.rawcolliderset_coIntersectsShape, Go = n.rawcolliderset_coContactShape, Wo = n.rawcolliderset_coContactCollider, Bo = n.rawcolliderset_coProjectPoint, qo = n.rawcolliderset_coIntersectsRay, Oo = n.rawcolliderset_coCastRay, Vo = n.rawcolliderset_coCastRayAndGetNormal, Jo = n.rawcolliderset_coSetSensor, Uo = n.rawcolliderset_coSetRestitution, Xo = n.rawcolliderset_coSetFriction, Ko = n.rawcolliderset_coFrictionCombineRule, Yo = n.rawcolliderset_coSetFrictionCombineRule, $o = n.rawcolliderset_coRestitutionCombineRule, Zo = n.rawcolliderset_coSetRestitutionCombineRule, Qo = n.rawcolliderset_coSetCollisionGroups, ta = n.rawcolliderset_coSetSolverGroups, ea = n.rawcolliderset_coSetActiveHooks, ra = n.rawcolliderset_coSetActiveEvents, na = n.rawcolliderset_coSetActiveCollisionTypes, ia = n.rawcolliderset_coSetShape, sa = n.rawcolliderset_coSetContactForceEventThreshold, oa = n.rawcolliderset_coSetDensity, aa = n.rawcolliderset_coSetMass, ca = n.rawcolliderset_coSetMassProperties, la = n.__wbg_rawcolliderset_free, ha = n.rawcolliderset_new, da = n.rawcolliderset_len, xe = n.rawcolliderset_contains, wa = n.rawcolliderset_createCollider, pa = n.rawcolliderset_remove, ua = n.rawcolliderset_forEachColliderHandle, _a = n.__wbg_rawshapecontact_free, fa = n.__wbg_rawnarrowphase_free, ma = n.rawnarrowphase_new, ba = n.rawnarrowphase_contacts_with, ya = n.rawnarrowphase_contact_pair, ga = n.rawnarrowphase_intersections_with, Sa = n.rawnarrowphase_intersection_pair, Ra = n.__wbg_rawcontactmanifold_free, va = n.rawcontactpair_collider1, Ca = n.rawcontactpair_collider2, Aa = n.rawcontactpair_numContactManifolds, ja = n.rawcontactpair_contactManifold, Ea = n.rawcontactmanifold_normal, Ia = n.rawcontactmanifold_local_n1, Pa = n.rawcontactmanifold_local_n2, Ma = n.rawcontactmanifold_subshape1, Ta = n.rawcontactmanifold_subshape2, xa = n.rawcontactmanifold_num_contacts, Fa = n.rawcontactmanifold_contact_local_p1, Ha = n.rawcontactmanifold_contact_local_p2, ka = n.rawcontactmanifold_contact_dist, Da = n.rawcontactmanifold_contact_fid1, La = n.rawcontactmanifold_contact_fid2, Na = n.rawcontactmanifold_contact_impulse, za = n.rawcontactmanifold_contact_tangent_impulse, Ga = n.rawcontactmanifold_num_solver_contacts, Wa = n.rawcontactmanifold_solver_contact_point, Ba = n.rawcontactmanifold_solver_contact_dist, qa = n.rawcontactmanifold_solver_contact_friction, Oa = n.rawcontactmanifold_solver_contact_restitution, Va = n.rawcontactmanifold_solver_contact_tangent_velocity, Ja = n.__wbg_rawpointprojection_free, Ua = n.rawpointprojection_isInside, Xa = n.__wbg_rawpointcolliderprojection_free, Ka = n.rawpointcolliderprojection_isInside, Ge = n.rawpointcolliderprojection_featureType, We = n.rawpointcolliderprojection_featureId, Ya = n.__wbg_rawrayintersection_free, $a = n.rawrayintersection_toi, Gt = n.rawraycolliderintersection_normal, Za = n.rawraycolliderintersection_featureType, Qa = n.rawraycolliderintersection_featureId, tc = n.__wbg_rawshape_free, ec = n.rawshape_cuboid, rc = n.rawshape_roundCuboid, nc = n.rawshape_ball, ic = n.rawshape_halfspace, sc = n.rawshape_capsule, oc = n.rawshape_polyline, ac = n.rawshape_trimesh, cc = n.rawshape_heightfield, lc = n.rawshape_segment, hc = n.rawshape_triangle, dc = n.rawshape_roundTriangle, wc = n.rawshape_convexHull, pc = n.rawshape_roundConvexHull, uc = n.rawshape_convexPolyline, _c = n.rawshape_roundConvexPolyline, fc = n.rawshape_castShape, mc = n.rawshape_intersectsShape, bc = n.rawshape_contactShape, yc = n.rawshape_containsPoint, gc = n.rawshape_projectPoint, Sc = n.rawshape_intersectsRay, Rc = n.rawshape_castRay, vc = n.rawshape_castRayAndGetNormal, Cc = n.__wbg_rawshapecollidertoi_free, Ac = n.rawshapecollidertoi_toi, jc = n.__wbg_rawrotation_free, Ec = n.rawrotation_identity, Ic = n.rawrotation_fromAngle, Be = n.rawrotation_im, Pc = n.rawrotation_angle, Mc = n.rawvector_zero, Tc = n.rawvector_new, xc = n.rawvector_set_y, Fc = n.rawvector_xy, Hc = n.rawvector_yx, kc = n.__wbg_rawdebugrenderpipeline_free, Dc = n.rawdebugrenderpipeline_new, Lc = n.rawdebugrenderpipeline_vertices, Nc = n.rawdebugrenderpipeline_colors, zc = n.rawdebugrenderpipeline_render, Gc = n.__wbg_raweventqueue_free, Wc = n.__wbg_rawcontactforceevent_free, bt = n.rawcontactforceevent_collider1, Bc = n.rawcontactforceevent_collider2, yt = n.rawcontactforceevent_total_force, Wt = n.rawcontactforceevent_total_force_magnitude, qc = n.rawcontactforceevent_max_force_magnitude, Oc = n.raweventqueue_new, Vc = n.raweventqueue_drainCollisionEvents, Jc = n.raweventqueue_drainContactForceEvents, Uc = n.raweventqueue_clear, Xc = n.__wbg_rawphysicspipeline_free, Kc = n.rawphysicspipeline_new, Yc = n.rawphysicspipeline_step, $c = n.rawphysicspipeline_stepWithEvents, Zc = n.__wbg_rawquerypipeline_free, Qc = n.rawquerypipeline_new, tl = n.rawquerypipeline_update, el = n.rawquerypipeline_castRay, rl = n.rawquerypipeline_castRayAndGetNormal, nl = n.rawquerypipeline_intersectionsWithRay, il = n.rawquerypipeline_intersectionWithShape, sl = n.rawquerypipeline_projectPoint, ol = n.rawquerypipeline_projectPointAndGetFeature, al = n.rawquerypipeline_intersectionsWithPoint, cl = n.rawquerypipeline_castShape, ll = n.rawquerypipeline_intersectionsWithShape, hl = n.rawquerypipeline_collidersWithAabbIntersectingAabb, dl = n.__wbg_rawdeserializedworld_free, wl = n.rawdeserializedworld_takeGravity, pl = n.rawdeserializedworld_takeIntegrationParameters, ul = n.rawdeserializedworld_takeIslandManager, _l = n.rawdeserializedworld_takeBroadPhase, fl = n.rawdeserializedworld_takeNarrowPhase, ml = n.rawdeserializedworld_takeBodies, bl = n.rawdeserializedworld_takeColliders, yl = n.rawdeserializedworld_takeImpulseJoints, gl = n.rawdeserializedworld_takeMultibodyJoints, Sl = n.rawserializationpipeline_serializeAll, Rl = n.rawserializationpipeline_deserializeAll, vl = n.__wbg_rawcontactpair_free, Cl = n.__wbg_rawraycolliderintersection_free, Al = n.__wbg_rawraycollidertoi_free, jl = n.__wbg_rawvector_free, El = n.__wbg_rawshapetoi_free;
    n.rawkinematiccharactercontroller_setMaxSlopeClimbAngle;
    n.rawvector_set_x;
    n.rawcolliderset_isHandleValid;
    n.rawrayintersection_featureType;
    n.rawrayintersection_featureId;
    n.rawshapecontact_point1;
    n.rawshapecontact_normal2;
    n.rawpointprojection_point;
    n.rawshapecontact_normal1;
    n.rawrayintersection_normal;
    n.rawshapecontact_point2;
    n.rawshapetoi_witness1;
    n.rawshapetoi_witness2;
    n.rawshapetoi_normal1;
    n.rawshapetoi_normal2;
    n.rawshapecollidertoi_witness1;
    n.rawshapecollidertoi_witness2;
    n.rawshapecollidertoi_normal1;
    n.rawshapecollidertoi_normal2;
    n.rawpointcolliderprojection_point;
    n.rawcontactforceevent_max_force_direction;
    const Il = n.rawserializationpipeline_new;
    n.rawkinematiccharactercontroller_maxSlopeClimbAngle;
    n.rawshapecontact_distance;
    n.rawraycolliderintersection_toi;
    n.rawraycollidertoi_toi;
    n.rawshapetoi_toi;
    n.rawrotation_re;
    n.rawvector_x;
    n.rawvector_y;
    n.rawintegrationparameters_predictionDistance;
    n.rawraycolliderintersection_colliderHandle;
    n.rawraycollidertoi_colliderHandle;
    n.rawshapecollidertoi_colliderHandle;
    n.rawpointcolliderprojection_colliderHandle;
    const Pl = n.__wbg_rawserializationpipeline_free, R = n.__wbindgen_add_to_stack_pointer, vt = n.__wbindgen_free, J = n.__wbindgen_malloc, Ml = n.__wbindgen_exn_store;
    qe = class {
        constructor(t, e){
            this.x = t, this.y = e;
        }
    };
    h = class {
        static new(t, e) {
            return new qe(t, e);
        }
        static zeros() {
            return h.new(0, 0);
        }
        static fromRaw(t) {
            if (!t) return null;
            let e = h.new(t.x, t.y);
            return t.free(), e;
        }
        static intoRaw(t) {
            return new d(t.x, t.y);
        }
        static copy(t, e) {
            t.x = e.x, t.y = e.y;
        }
    };
    A = class {
        static identity() {
            return 0;
        }
        static fromRaw(t) {
            if (!t) return null;
            let e = t.angle;
            return t.free(), e;
        }
        static intoRaw(t) {
            return S.fromAngle(t);
        }
    };
    (function(o) {
        o[o.Dynamic = 0] = "Dynamic", o[o.Fixed = 1] = "Fixed", o[o.KinematicPositionBased = 2] = "KinematicPositionBased", o[o.KinematicVelocityBased = 3] = "KinematicVelocityBased";
    })(N || (N = {}));
    Qt = class {
        constructor(t, e, r){
            this.rawSet = t, this.colliderSet = e, this.handle = r;
        }
        finalizeDeserialization(t) {
            this.colliderSet = t;
        }
        isValid() {
            return this.rawSet.contains(this.handle);
        }
        lockTranslations(t, e) {
            return this.rawSet.rbLockTranslations(this.handle, t, e);
        }
        lockRotations(t, e) {
            return this.rawSet.rbLockRotations(this.handle, t, e);
        }
        setEnabledTranslations(t, e, r) {
            return this.rawSet.rbSetEnabledTranslations(this.handle, t, e, r);
        }
        restrictTranslations(t, e, r) {
            this.setEnabledTranslations(t, t, r);
        }
        dominanceGroup() {
            return this.rawSet.rbDominanceGroup(this.handle);
        }
        setDominanceGroup(t) {
            this.rawSet.rbSetDominanceGroup(this.handle, t);
        }
        enableCcd(t) {
            this.rawSet.rbEnableCcd(this.handle, t);
        }
        translation() {
            let t = this.rawSet.rbTranslation(this.handle);
            return h.fromRaw(t);
        }
        rotation() {
            let t = this.rawSet.rbRotation(this.handle);
            return A.fromRaw(t);
        }
        nextTranslation() {
            let t = this.rawSet.rbNextTranslation(this.handle);
            return h.fromRaw(t);
        }
        nextRotation() {
            let t = this.rawSet.rbNextRotation(this.handle);
            return A.fromRaw(t);
        }
        setTranslation(t, e) {
            this.rawSet.rbSetTranslation(this.handle, t.x, t.y, e);
        }
        setLinvel(t, e) {
            let r = h.intoRaw(t);
            this.rawSet.rbSetLinvel(this.handle, r, e), r.free();
        }
        gravityScale() {
            return this.rawSet.rbGravityScale(this.handle);
        }
        setGravityScale(t, e) {
            this.rawSet.rbSetGravityScale(this.handle, t, e);
        }
        setRotation(t, e) {
            this.rawSet.rbSetRotation(this.handle, t, e);
        }
        setAngvel(t, e) {
            this.rawSet.rbSetAngvel(this.handle, t, e);
        }
        setNextKinematicTranslation(t) {
            this.rawSet.rbSetNextKinematicTranslation(this.handle, t.x, t.y);
        }
        setNextKinematicRotation(t) {
            this.rawSet.rbSetNextKinematicRotation(this.handle, t);
        }
        linvel() {
            return h.fromRaw(this.rawSet.rbLinvel(this.handle));
        }
        angvel() {
            return this.rawSet.rbAngvel(this.handle);
        }
        mass() {
            return this.rawSet.rbMass(this.handle);
        }
        effectiveInvMass() {
            return h.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
        }
        invMass() {
            return this.rawSet.rbInvMass(this.handle);
        }
        localCom() {
            return h.fromRaw(this.rawSet.rbLocalCom(this.handle));
        }
        worldCom() {
            return h.fromRaw(this.rawSet.rbWorldCom(this.handle));
        }
        invPrincipalInertiaSqrt() {
            return this.rawSet.rbInvPrincipalInertiaSqrt(this.handle);
        }
        principalInertia() {
            return this.rawSet.rbPrincipalInertia(this.handle);
        }
        effectiveWorldInvInertiaSqrt() {
            return this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle);
        }
        effectiveAngularInertia() {
            return this.rawSet.rbEffectiveAngularInertia(this.handle);
        }
        sleep() {
            this.rawSet.rbSleep(this.handle);
        }
        wakeUp() {
            this.rawSet.rbWakeUp(this.handle);
        }
        isCcdEnabled() {
            return this.rawSet.rbIsCcdEnabled(this.handle);
        }
        numColliders() {
            return this.rawSet.rbNumColliders(this.handle);
        }
        collider(t) {
            return this.colliderSet.get(this.rawSet.rbCollider(this.handle, t));
        }
        setEnabled(t) {
            this.rawSet.rbSetEnabled(this.handle, t);
        }
        isEnabled() {
            return this.rawSet.rbIsEnabled(this.handle);
        }
        bodyType() {
            return this.rawSet.rbBodyType(this.handle);
        }
        setBodyType(t, e) {
            return this.rawSet.rbSetBodyType(this.handle, t, e);
        }
        isSleeping() {
            return this.rawSet.rbIsSleeping(this.handle);
        }
        isMoving() {
            return this.rawSet.rbIsMoving(this.handle);
        }
        isFixed() {
            return this.rawSet.rbIsFixed(this.handle);
        }
        isKinematic() {
            return this.rawSet.rbIsKinematic(this.handle);
        }
        isDynamic() {
            return this.rawSet.rbIsDynamic(this.handle);
        }
        linearDamping() {
            return this.rawSet.rbLinearDamping(this.handle);
        }
        angularDamping() {
            return this.rawSet.rbAngularDamping(this.handle);
        }
        setLinearDamping(t) {
            this.rawSet.rbSetLinearDamping(this.handle, t);
        }
        recomputeMassPropertiesFromColliders() {
            this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
        }
        setAdditionalMass(t, e) {
            this.rawSet.rbSetAdditionalMass(this.handle, t, e);
        }
        setAdditionalMassProperties(t, e, r, i) {
            let s = h.intoRaw(e);
            this.rawSet.rbSetAdditionalMassProperties(this.handle, t, s, r, i), s.free();
        }
        setAngularDamping(t) {
            this.rawSet.rbSetAngularDamping(this.handle, t);
        }
        resetForces(t) {
            this.rawSet.rbResetForces(this.handle, t);
        }
        resetTorques(t) {
            this.rawSet.rbResetTorques(this.handle, t);
        }
        addForce(t, e) {
            const r = h.intoRaw(t);
            this.rawSet.rbAddForce(this.handle, r, e), r.free();
        }
        applyImpulse(t, e) {
            const r = h.intoRaw(t);
            this.rawSet.rbApplyImpulse(this.handle, r, e), r.free();
        }
        addTorque(t, e) {
            this.rawSet.rbAddTorque(this.handle, t, e);
        }
        applyTorqueImpulse(t, e) {
            this.rawSet.rbApplyTorqueImpulse(this.handle, t, e);
        }
        addForceAtPoint(t, e, r) {
            const i = h.intoRaw(t), s = h.intoRaw(e);
            this.rawSet.rbAddForceAtPoint(this.handle, i, s, r), i.free(), s.free();
        }
        applyImpulseAtPoint(t, e, r) {
            const i = h.intoRaw(t), s = h.intoRaw(e);
            this.rawSet.rbApplyImpulseAtPoint(this.handle, i, s, r), i.free(), s.free();
        }
    };
    z = class {
        constructor(t){
            this.enabled = !0, this.status = t, this.translation = h.zeros(), this.rotation = A.identity(), this.gravityScale = 1, this.linvel = h.zeros(), this.mass = 0, this.massOnly = !1, this.centerOfMass = h.zeros(), this.translationsEnabledX = !0, this.translationsEnabledY = !0, this.angvel = 0, this.principalAngularInertia = 0, this.rotationsEnabled = !0, this.linearDamping = 0, this.angularDamping = 0, this.canSleep = !0, this.sleeping = !1, this.ccdEnabled = !1, this.dominanceGroup = 0;
        }
        static dynamic() {
            return new z(N.Dynamic);
        }
        static kinematicPositionBased() {
            return new z(N.KinematicPositionBased);
        }
        static kinematicVelocityBased() {
            return new z(N.KinematicVelocityBased);
        }
        static fixed() {
            return new z(N.Fixed);
        }
        static newDynamic() {
            return new z(N.Dynamic);
        }
        static newKinematicPositionBased() {
            return new z(N.KinematicPositionBased);
        }
        static newKinematicVelocityBased() {
            return new z(N.KinematicVelocityBased);
        }
        static newStatic() {
            return new z(N.Fixed);
        }
        setDominanceGroup(t) {
            return this.dominanceGroup = t, this;
        }
        setEnabled(t) {
            return this.enabled = t, this;
        }
        setTranslation(t, e) {
            if (typeof t != "number" || typeof e != "number") throw TypeError("The translation components must be numbers.");
            return this.translation = {
                x: t,
                y: e
            }, this;
        }
        setRotation(t) {
            return this.rotation = t, this;
        }
        setGravityScale(t) {
            return this.gravityScale = t, this;
        }
        setAdditionalMass(t) {
            return this.mass = t, this.massOnly = !0, this;
        }
        setLinvel(t, e) {
            if (typeof t != "number" || typeof e != "number") throw TypeError("The linvel components must be numbers.");
            return this.linvel = {
                x: t,
                y: e
            }, this;
        }
        setAngvel(t) {
            return this.angvel = t, this;
        }
        setAdditionalMassProperties(t, e, r) {
            return this.mass = t, h.copy(this.centerOfMass, e), this.principalAngularInertia = r, this.massOnly = !1, this;
        }
        enabledTranslations(t, e) {
            return this.translationsEnabledX = t, this.translationsEnabledY = e, this;
        }
        restrictTranslations(t, e) {
            return this.enabledTranslations(t, e);
        }
        lockTranslations() {
            return this.restrictTranslations(!1, !1);
        }
        lockRotations() {
            return this.rotationsEnabled = !1, this;
        }
        setLinearDamping(t) {
            return this.linearDamping = t, this;
        }
        setAngularDamping(t) {
            return this.angularDamping = t, this;
        }
        setCanSleep(t) {
            return this.canSleep = t, this;
        }
        setSleeping(t) {
            return this.sleeping = t, this;
        }
        setCcdEnabled(t) {
            return this.ccdEnabled = t, this;
        }
        setUserData(t) {
            return this.userData = t, this;
        }
    };
    class Bt {
        constructor(){
            this.fconv = new Float64Array(1), this.uconv = new Uint32Array(this.fconv.buffer), this.data = new Array, this.size = 0;
        }
        set(t, e) {
            let r = this.index(t);
            for(; this.data.length <= r;)this.data.push(null);
            this.data[r] == null && (this.size += 1), this.data[r] = e;
        }
        len() {
            return this.size;
        }
        delete(t) {
            let e = this.index(t);
            e < this.data.length && (this.data[e] != null && (this.size -= 1), this.data[e] = null);
        }
        clear() {
            this.data = new Array;
        }
        get(t) {
            let e = this.index(t);
            return e < this.data.length ? this.data[e] : null;
        }
        forEach(t) {
            for (const e of this.data)e != null && t(e);
        }
        getAll() {
            return this.data.filter((t)=>t != null);
        }
        index(t) {
            return this.fconv[0] = t, this.uconv[0];
        }
    }
    Oe = class {
        constructor(t){
            this.raw = t || new T, this.map = new Bt, t && t.forEachRigidBodyHandle((e)=>{
                this.map.set(e, new Qt(t, null, e));
            });
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
        }
        finalizeDeserialization(t) {
            this.map.forEach((e)=>e.finalizeDeserialization(t));
        }
        createRigidBody(t, e) {
            let r = h.intoRaw(e.translation), i = A.intoRaw(e.rotation), s = h.intoRaw(e.linvel), a = h.intoRaw(e.centerOfMass), l = this.raw.createRigidBody(e.enabled, r, i, e.gravityScale, e.mass, e.massOnly, a, s, e.angvel, e.principalAngularInertia, e.translationsEnabledX, e.translationsEnabledY, e.rotationsEnabled, e.linearDamping, e.angularDamping, e.status, e.canSleep, e.sleeping, e.ccdEnabled, e.dominanceGroup);
            r.free(), i.free(), s.free(), a.free();
            const w = new Qt(this.raw, t, l);
            return w.userData = e.userData, this.map.set(l, w), w;
        }
        remove(t, e, r, i, s) {
            for(let a = 0; a < this.raw.rbNumColliders(t); a += 1)r.unmap(this.raw.rbCollider(t, a));
            i.forEachJointHandleAttachedToRigidBody(t, (a)=>i.unmap(a)), s.forEachJointHandleAttachedToRigidBody(t, (a)=>s.unmap(a)), this.raw.remove(t, e.raw, r.raw, i.raw, s.raw), this.map.delete(t);
        }
        len() {
            return this.map.len();
        }
        contains(t) {
            return this.get(t) != null;
        }
        get(t) {
            return this.map.get(t);
        }
        forEach(t) {
            this.map.forEach(t);
        }
        forEachActiveRigidBody(t, e) {
            t.forEachActiveRigidBodyHandle((r)=>{
                e(this.get(r));
            });
        }
        getAll() {
            return this.map.getAll();
        }
    };
    Ve = class {
        constructor(t){
            this.raw = t || new Y;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        get dt() {
            return this.raw.dt;
        }
        get erp() {
            return this.raw.erp;
        }
        get allowedLinearError() {
            return this.raw.allowedLinearError;
        }
        get predictionDistance() {
            return this.raw.predictionDistance;
        }
        get maxVelocityIterations() {
            return this.raw.maxVelocityIterations;
        }
        get maxVelocityFrictionIterations() {
            return this.raw.maxVelocityFrictionIterations;
        }
        get maxStabilizationIterations() {
            return this.raw.maxStabilizationIterations;
        }
        get minIslandSize() {
            return this.raw.minIslandSize;
        }
        get maxCcdSubsteps() {
            return this.raw.maxCcdSubsteps;
        }
        set dt(t) {
            this.raw.dt = t;
        }
        set erp(t) {
            this.raw.erp = t;
        }
        set allowedLinearError(t) {
            this.raw.allowedLinearError = t;
        }
        set predictionDistance(t) {
            this.raw.predictionDistance = t;
        }
        set maxVelocityIterations(t) {
            this.raw.maxVelocityIterations = t;
        }
        set maxVelocityFrictionIterations(t) {
            this.raw.maxVelocityFrictionIterations = t;
        }
        set maxStabilizationIterations(t) {
            this.raw.maxStabilizationIterations = t;
        }
        set minIslandSize(t) {
            this.raw.minIslandSize = t;
        }
        set maxCcdSubsteps(t) {
            this.raw.maxCcdSubsteps = t;
        }
    };
    (function(o) {
        o[o.Revolute = 0] = "Revolute", o[o.Fixed = 1] = "Fixed", o[o.Prismatic = 2] = "Prismatic";
    })(H || (H = {}));
    (function(o) {
        o[o.AccelerationBased = 0] = "AccelerationBased", o[o.ForceBased = 1] = "ForceBased";
    })(te || (te = {}));
    tt = class {
        constructor(t, e, r){
            this.rawSet = t, this.bodySet = e, this.handle = r;
        }
        static newTyped(t, e, r) {
            switch(t.jointType(r)){
                case H.Revolute:
                    return new Xe(t, e, r);
                case H.Prismatic:
                    return new Ue(t, e, r);
                case H.Fixed:
                    return new Je(t, e, r);
                default:
                    return new tt(t, e, r);
            }
        }
        finalizeDeserialization(t) {
            this.bodySet = t;
        }
        isValid() {
            return this.rawSet.contains(this.handle);
        }
        body1() {
            return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
        }
        body2() {
            return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
        }
        type() {
            return this.rawSet.jointType(this.handle);
        }
        anchor1() {
            return h.fromRaw(this.rawSet.jointAnchor1(this.handle));
        }
        anchor2() {
            return h.fromRaw(this.rawSet.jointAnchor2(this.handle));
        }
        setAnchor1(t) {
            const e = h.intoRaw(t);
            this.rawSet.jointSetAnchor1(this.handle, e), e.free();
        }
        setAnchor2(t) {
            const e = h.intoRaw(t);
            this.rawSet.jointSetAnchor2(this.handle, e), e.free();
        }
        setContactsEnabled(t) {
            this.rawSet.jointSetContactsEnabled(this.handle, t);
        }
        contactsEnabled() {
            return this.rawSet.jointContactsEnabled(this.handle);
        }
    };
    _e = class extends tt {
        limitsEnabled() {
            return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
        }
        limitsMin() {
            return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
        }
        limitsMax() {
            return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
        }
        setLimits(t, e) {
            this.rawSet.jointSetLimits(this.handle, this.rawAxis(), t, e);
        }
        configureMotorModel(t) {
            this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), t);
        }
        configureMotorVelocity(t, e) {
            this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), t, e);
        }
        configureMotorPosition(t, e, r) {
            this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), t, e, r);
        }
        configureMotor(t, e, r, i) {
            this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), t, e, r, i);
        }
    };
    Je = class extends tt {
    };
    Ue = class extends _e {
        rawAxis() {
            return Ht.X;
        }
    };
    Xe = class extends _e {
        rawAxis() {
            return Ht.AngX;
        }
    };
    ct = class {
        constructor(){}
        static fixed(t, e, r, i) {
            let s = new ct;
            return s.anchor1 = t, s.anchor2 = r, s.frame1 = e, s.frame2 = i, s.jointType = H.Fixed, s;
        }
        static revolute(t, e) {
            let r = new ct;
            return r.anchor1 = t, r.anchor2 = e, r.jointType = H.Revolute, r;
        }
        static prismatic(t, e, r) {
            let i = new ct;
            return i.anchor1 = t, i.anchor2 = e, i.axis = r, i.jointType = H.Prismatic, i;
        }
        intoRaw() {
            let t = h.intoRaw(this.anchor1), e = h.intoRaw(this.anchor2), r, i, s = !1, a = 0, l = 0;
            switch(this.jointType){
                case H.Fixed:
                    let w = A.intoRaw(this.frame1), p = A.intoRaw(this.frame2);
                    i = G.fixed(t, w, e, p), w.free(), p.free();
                    break;
                case H.Prismatic:
                    r = h.intoRaw(this.axis), this.limitsEnabled && (s = !0, a = this.limits[0], l = this.limits[1]), i = G.prismatic(t, e, r, s, a, l), r.free();
                    break;
                case H.Revolute:
                    i = G.revolute(t, e);
                    break;
            }
            return t.free(), e.free(), i;
        }
    };
    Ke = class {
        constructor(t){
            this.raw = t || new W, this.map = new Bt, t && t.forEachJointHandle((e)=>{
                this.map.set(e, tt.newTyped(t, null, e));
            });
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
        }
        finalizeDeserialization(t) {
            this.map.forEach((e)=>e.finalizeDeserialization(t));
        }
        createJoint(t, e, r, i, s) {
            const a = e.intoRaw(), l = this.raw.createJoint(a, r, i, s);
            a.free();
            let w = tt.newTyped(this.raw, t, l);
            return this.map.set(l, w), w;
        }
        remove(t, e) {
            this.raw.remove(t, e), this.unmap(t);
        }
        forEachJointHandleAttachedToRigidBody(t, e) {
            this.raw.forEachJointAttachedToRigidBody(t, e);
        }
        unmap(t) {
            this.map.delete(t);
        }
        len() {
            return this.map.len();
        }
        contains(t) {
            return this.get(t) != null;
        }
        get(t) {
            return this.map.get(t);
        }
        forEach(t) {
            this.map.forEach(t);
        }
        getAll() {
            return this.map.getAll();
        }
    };
    et = class {
        constructor(t, e){
            this.rawSet = t, this.handle = e;
        }
        static newTyped(t, e) {
            switch(t.jointType(e)){
                case H.Revolute:
                    return new Ze(t, e);
                case H.Prismatic:
                    return new $e(t, e);
                case H.Fixed:
                    return new Ye(t, e);
                default:
                    return new et(t, e);
            }
        }
        isValid() {
            return this.rawSet.contains(this.handle);
        }
        setContactsEnabled(t) {
            this.rawSet.jointSetContactsEnabled(this.handle, t);
        }
        contactsEnabled() {
            return this.rawSet.jointContactsEnabled(this.handle);
        }
    };
    fe = class extends et {
    };
    Ye = class extends et {
    };
    $e = class extends fe {
        rawAxis() {
            return Ht.X;
        }
    };
    Ze = class extends fe {
        rawAxis() {
            return Ht.AngX;
        }
    };
    Qe = class {
        constructor(t){
            this.raw = t || new q, this.map = new Bt, t && t.forEachJointHandle((e)=>{
                this.map.set(e, et.newTyped(this.raw, e));
            });
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
        }
        createJoint(t, e, r, i) {
            const s = t.intoRaw(), a = this.raw.createJoint(s, e, r, i);
            s.free();
            let l = et.newTyped(this.raw, a);
            return this.map.set(a, l), l;
        }
        remove(t, e) {
            this.raw.remove(t, e), this.map.delete(t);
        }
        unmap(t) {
            this.map.delete(t);
        }
        len() {
            return this.map.len();
        }
        contains(t) {
            return this.get(t) != null;
        }
        get(t) {
            return this.map.get(t);
        }
        forEach(t) {
            this.map.forEach(t);
        }
        forEachJointHandleAttachedToRigidBody(t, e) {
            this.raw.forEachJointAttachedToRigidBody(t, e);
        }
        getAll() {
            return this.map.getAll();
        }
    };
    (function(o) {
        o[o.Average = 0] = "Average", o[o.Min = 1] = "Min", o[o.Multiply = 2] = "Multiply", o[o.Max = 3] = "Max";
    })(pt || (pt = {}));
    tr = class {
        constructor(t){
            this.raw = t || new rt;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
    };
    er = class {
        constructor(t){
            this.raw = t || new B;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        forEachActiveRigidBodyHandle(t) {
            this.raw.forEachActiveRigidBodyHandle(t);
        }
    };
    rr = class {
        constructor(t){
            this.raw = t || new K;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
    };
    nr = class {
        constructor(t){
            this.raw = t || new U, this.tempManifold = new ir(null);
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        contactsWith(t, e) {
            this.raw.contacts_with(t, e);
        }
        intersectionsWith(t, e) {
            this.raw.intersections_with(t, e);
        }
        contactPair(t, e, r) {
            const i = this.raw.contact_pair(t, e);
            if (i) {
                const s = i.collider1() != t;
                let a;
                for(a = 0; a < i.numContactManifolds(); ++a)this.tempManifold.raw = i.contactManifold(a), this.tempManifold.raw && r(this.tempManifold, s), this.tempManifold.free();
                i.free();
            }
        }
        intersectionPair(t, e) {
            return this.raw.intersection_pair(t, e);
        }
    };
    ir = class {
        constructor(t){
            this.raw = t;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        normal() {
            return h.fromRaw(this.raw.normal());
        }
        localNormal1() {
            return h.fromRaw(this.raw.local_n1());
        }
        localNormal2() {
            return h.fromRaw(this.raw.local_n2());
        }
        subshape1() {
            return this.raw.subshape1();
        }
        subshape2() {
            return this.raw.subshape2();
        }
        numContacts() {
            return this.raw.num_contacts();
        }
        localContactPoint1(t) {
            return h.fromRaw(this.raw.contact_local_p1(t));
        }
        localContactPoint2(t) {
            return h.fromRaw(this.raw.contact_local_p2(t));
        }
        contactDist(t) {
            return this.raw.contact_dist(t);
        }
        contactFid1(t) {
            return this.raw.contact_fid1(t);
        }
        contactFid2(t) {
            return this.raw.contact_fid2(t);
        }
        contactImpulse(t) {
            return this.raw.contact_impulse(t);
        }
        contactTangentImpulse(t) {
            return this.raw.contact_tangent_impulse(t);
        }
        numSolverContacts() {
            return this.raw.num_solver_contacts();
        }
        solverContactPoint(t) {
            return h.fromRaw(this.raw.solver_contact_point(t));
        }
        solverContactDist(t) {
            return this.raw.solver_contact_dist(t);
        }
        solverContactFriction(t) {
            return this.raw.solver_contact_friction(t);
        }
        solverContactRestitution(t) {
            return this.raw.solver_contact_restitution(t);
        }
        solverContactTangentVelocity(t) {
            return h.fromRaw(this.raw.solver_contact_tangent_velocity(t));
        }
    };
    nt = class {
        constructor(t, e, r, i, s){
            this.distance = t, this.point1 = e, this.point2 = r, this.normal1 = i, this.normal2 = s;
        }
        static fromRaw(t) {
            if (!t) return null;
            const e = new nt(t.distance(), h.fromRaw(t.point1()), h.fromRaw(t.point2()), h.fromRaw(t.normal1()), h.fromRaw(t.normal2()));
            return t.free(), e;
        }
    };
    (function(o) {
        o[o.Vertex = 0] = "Vertex", o[o.Face = 1] = "Face", o[o.Unknown = 2] = "Unknown";
    })(it || (it = {}));
    gt = class {
        constructor(t, e){
            this.point = t, this.isInside = e;
        }
        static fromRaw(t) {
            if (!t) return null;
            const e = new gt(h.fromRaw(t.point()), t.isInside());
            return t.free(), e;
        }
    };
    ut = class {
        constructor(t, e, r, i, s){
            this.featureType = it.Unknown, this.featureId = void 0, this.collider = t, this.point = e, this.isInside = r, s !== void 0 && (this.featureId = s), i !== void 0 && (this.featureType = i);
        }
        static fromRaw(t, e) {
            if (!e) return null;
            const r = new ut(t.get(e.colliderHandle()), h.fromRaw(e.point()), e.isInside(), e.featureType(), e.featureId());
            return e.free(), r;
        }
    };
    Tl = class {
        constructor(t, e){
            this.origin = t, this.dir = e;
        }
        pointAt(t) {
            return {
                x: this.origin.x + this.dir.x * t,
                y: this.origin.y + this.dir.y * t
            };
        }
    };
    St = class {
        constructor(t, e, r, i){
            this.featureType = it.Unknown, this.featureId = void 0, this.toi = t, this.normal = e, i !== void 0 && (this.featureId = i), r !== void 0 && (this.featureType = r);
        }
        static fromRaw(t) {
            if (!t) return null;
            const e = new St(t.toi(), h.fromRaw(t.normal()), t.featureType(), t.featureId());
            return t.free(), e;
        }
    };
    _t = class {
        constructor(t, e, r, i, s){
            this.featureType = it.Unknown, this.featureId = void 0, this.collider = t, this.toi = e, this.normal = r, s !== void 0 && (this.featureId = s), i !== void 0 && (this.featureType = i);
        }
        static fromRaw(t, e) {
            if (!e) return null;
            const r = new _t(t.get(e.colliderHandle()), e.toi(), h.fromRaw(e.normal()), e.featureType(), e.featureId());
            return e.free(), r;
        }
    };
    qt = class {
        constructor(t, e){
            this.collider = t, this.toi = e;
        }
        static fromRaw(t, e) {
            if (!e) return null;
            const r = new qt(t.get(e.colliderHandle()), e.toi());
            return e.free(), r;
        }
    };
    ot = class {
        constructor(t, e, r, i, s){
            this.toi = t, this.witness1 = e, this.witness2 = r, this.normal1 = i, this.normal2 = s;
        }
        static fromRaw(t, e) {
            if (!e) return null;
            const r = new ot(e.toi(), h.fromRaw(e.witness1()), h.fromRaw(e.witness2()), h.fromRaw(e.normal1()), h.fromRaw(e.normal2()));
            return e.free(), r;
        }
    };
    Rt = class extends ot {
        constructor(t, e, r, i, s, a){
            super(e, r, i, s, a), this.collider = t;
        }
        static fromRaw(t, e) {
            if (!e) return null;
            const r = new Rt(t.get(e.colliderHandle()), e.toi(), h.fromRaw(e.witness1()), h.fromRaw(e.witness2()), h.fromRaw(e.normal1()), h.fromRaw(e.normal2()));
            return e.free(), r;
        }
    };
    k = class {
        static fromRaw(t, e) {
            const r = t.coShapeType(e);
            let i, s, a, l, w, p, u;
            switch(r){
                case C.Ball:
                    return new me(t.coRadius(e));
                case C.Cuboid:
                    return i = t.coHalfExtents(e), new ye(i.x, i.y);
                case C.RoundCuboid:
                    return i = t.coHalfExtents(e), s = t.coRoundRadius(e), new ge(i.x, i.y, s);
                case C.Capsule:
                    return w = t.coHalfHeight(e), p = t.coRadius(e), new Se(w, p);
                case C.Segment:
                    return a = t.coVertices(e), new Re(h.new(a[0], a[1]), h.new(a[2], a[3]));
                case C.Polyline:
                    return a = t.coVertices(e), l = t.coIndices(e), new Ae(a, l);
                case C.Triangle:
                    return a = t.coVertices(e), new ve(h.new(a[0], a[1]), h.new(a[2], a[3]), h.new(a[4], a[5]));
                case C.RoundTriangle:
                    return a = t.coVertices(e), s = t.coRoundRadius(e), new Ce(h.new(a[0], a[1]), h.new(a[2], a[3]), h.new(a[4], a[5]), s);
                case C.HalfSpace:
                    return u = h.fromRaw(t.coHalfspaceNormal(e)), new be(u);
                case C.TriMesh:
                    return a = t.coVertices(e), l = t.coIndices(e), new je(a, l);
                case C.HeightField:
                    const _ = t.coHeightfieldScale(e), m = t.coHeightfieldHeights(e);
                    return new Ee(m, _);
                case C.ConvexPolygon:
                    return a = t.coVertices(e), new Tt(a, !1);
                case C.RoundConvexPolygon:
                    return a = t.coVertices(e), s = t.coRoundRadius(e), new xt(a, s, !1);
                default:
                    throw new Error("unknown shape type: " + r);
            }
        }
        castShape(t, e, r, i, s, a, l, w, p) {
            let u = h.intoRaw(t), _ = A.intoRaw(e), m = h.intoRaw(r), y = h.intoRaw(s), I = A.intoRaw(a), D = h.intoRaw(l), O = this.intoRaw(), V = i.intoRaw(), $ = ot.fromRaw(null, O.castShape(u, _, m, V, y, I, D, w, p));
            return u.free(), _.free(), m.free(), y.free(), I.free(), D.free(), O.free(), V.free(), $;
        }
        intersectsShape(t, e, r, i, s) {
            let a = h.intoRaw(t), l = A.intoRaw(e), w = h.intoRaw(i), p = A.intoRaw(s), u = this.intoRaw(), _ = r.intoRaw(), m = u.intersectsShape(a, l, _, w, p);
            return a.free(), l.free(), w.free(), p.free(), u.free(), _.free(), m;
        }
        contactShape(t, e, r, i, s, a) {
            let l = h.intoRaw(t), w = A.intoRaw(e), p = h.intoRaw(i), u = A.intoRaw(s), _ = this.intoRaw(), m = r.intoRaw(), y = nt.fromRaw(_.contactShape(l, w, m, p, u, a));
            return l.free(), w.free(), p.free(), u.free(), _.free(), m.free(), y;
        }
        containsPoint(t, e, r) {
            let i = h.intoRaw(t), s = A.intoRaw(e), a = h.intoRaw(r), l = this.intoRaw(), w = l.containsPoint(i, s, a);
            return i.free(), s.free(), a.free(), l.free(), w;
        }
        projectPoint(t, e, r, i) {
            let s = h.intoRaw(t), a = A.intoRaw(e), l = h.intoRaw(r), w = this.intoRaw(), p = gt.fromRaw(w.projectPoint(s, a, l, i));
            return s.free(), a.free(), l.free(), w.free(), p;
        }
        intersectsRay(t, e, r, i) {
            let s = h.intoRaw(e), a = A.intoRaw(r), l = h.intoRaw(t.origin), w = h.intoRaw(t.dir), p = this.intoRaw(), u = p.intersectsRay(s, a, l, w, i);
            return s.free(), a.free(), l.free(), w.free(), p.free(), u;
        }
        castRay(t, e, r, i, s) {
            let a = h.intoRaw(e), l = A.intoRaw(r), w = h.intoRaw(t.origin), p = h.intoRaw(t.dir), u = this.intoRaw(), _ = u.castRay(a, l, w, p, i, s);
            return a.free(), l.free(), w.free(), p.free(), u.free(), _;
        }
        castRayAndGetNormal(t, e, r, i, s) {
            let a = h.intoRaw(e), l = A.intoRaw(r), w = h.intoRaw(t.origin), p = h.intoRaw(t.dir), u = this.intoRaw(), _ = St.fromRaw(u.castRayAndGetNormal(a, l, w, p, i, s));
            return a.free(), l.free(), w.free(), p.free(), u.free(), _;
        }
    };
    (function(o) {
        o[o.Ball = 0] = "Ball", o[o.Cuboid = 1] = "Cuboid", o[o.Capsule = 2] = "Capsule", o[o.Segment = 3] = "Segment", o[o.Polyline = 4] = "Polyline", o[o.Triangle = 5] = "Triangle", o[o.TriMesh = 6] = "TriMesh", o[o.HeightField = 7] = "HeightField", o[o.ConvexPolygon = 9] = "ConvexPolygon", o[o.RoundCuboid = 10] = "RoundCuboid", o[o.RoundTriangle = 11] = "RoundTriangle", o[o.RoundConvexPolygon = 12] = "RoundConvexPolygon", o[o.HalfSpace = 13] = "HalfSpace";
    })(C || (C = {}));
    me = class extends k {
        constructor(t){
            super(), this.type = C.Ball, this.radius = t;
        }
        intoRaw() {
            return b.ball(this.radius);
        }
    };
    be = class extends k {
        constructor(t){
            super(), this.type = C.HalfSpace, this.normal = t;
        }
        intoRaw() {
            let t = h.intoRaw(this.normal), e = b.halfspace(t);
            return t.free(), e;
        }
    };
    ye = class extends k {
        constructor(t, e){
            super(), this.type = C.Cuboid, this.halfExtents = h.new(t, e);
        }
        intoRaw() {
            return b.cuboid(this.halfExtents.x, this.halfExtents.y);
        }
    };
    ge = class extends k {
        constructor(t, e, r){
            super(), this.type = C.RoundCuboid, this.halfExtents = h.new(t, e), this.borderRadius = r;
        }
        intoRaw() {
            return b.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.borderRadius);
        }
    };
    Se = class extends k {
        constructor(t, e){
            super(), this.type = C.Capsule, this.halfHeight = t, this.radius = e;
        }
        intoRaw() {
            return b.capsule(this.halfHeight, this.radius);
        }
    };
    Re = class extends k {
        constructor(t, e){
            super(), this.type = C.Segment, this.a = t, this.b = e;
        }
        intoRaw() {
            let t = h.intoRaw(this.a), e = h.intoRaw(this.b), r = b.segment(t, e);
            return t.free(), e.free(), r;
        }
    };
    ve = class extends k {
        constructor(t, e, r){
            super(), this.type = C.Triangle, this.a = t, this.b = e, this.c = r;
        }
        intoRaw() {
            let t = h.intoRaw(this.a), e = h.intoRaw(this.b), r = h.intoRaw(this.c), i = b.triangle(t, e, r);
            return t.free(), e.free(), r.free(), i;
        }
    };
    Ce = class extends k {
        constructor(t, e, r, i){
            super(), this.type = C.RoundTriangle, this.a = t, this.b = e, this.c = r, this.borderRadius = i;
        }
        intoRaw() {
            let t = h.intoRaw(this.a), e = h.intoRaw(this.b), r = h.intoRaw(this.c), i = b.roundTriangle(t, e, r, this.borderRadius);
            return t.free(), e.free(), r.free(), i;
        }
    };
    Ae = class extends k {
        constructor(t, e){
            super(), this.type = C.Polyline, this.vertices = t, this.indices = e ?? new Uint32Array(0);
        }
        intoRaw() {
            return b.polyline(this.vertices, this.indices);
        }
    };
    je = class extends k {
        constructor(t, e){
            super(), this.type = C.TriMesh, this.vertices = t, this.indices = e;
        }
        intoRaw() {
            return b.trimesh(this.vertices, this.indices);
        }
    };
    Tt = class extends k {
        constructor(t, e){
            super(), this.type = C.ConvexPolygon, this.vertices = t, this.skipConvexHullComputation = !!e;
        }
        intoRaw() {
            return this.skipConvexHullComputation ? b.convexPolyline(this.vertices) : b.convexHull(this.vertices);
        }
    };
    xt = class extends k {
        constructor(t, e, r){
            super(), this.type = C.RoundConvexPolygon, this.vertices = t, this.borderRadius = e, this.skipConvexHullComputation = !!r;
        }
        intoRaw() {
            return this.skipConvexHullComputation ? b.roundConvexPolyline(this.vertices, this.borderRadius) : b.roundConvexHull(this.vertices, this.borderRadius);
        }
    };
    Ee = class extends k {
        constructor(t, e){
            super(), this.type = C.HeightField, this.heights = t, this.scale = e;
        }
        intoRaw() {
            let t = h.intoRaw(this.scale), e = b.heightfield(this.heights, t);
            return t.free(), e;
        }
    };
    (function(o) {
        o[o.DYNAMIC_DYNAMIC = 1] = "DYNAMIC_DYNAMIC", o[o.DYNAMIC_KINEMATIC = 12] = "DYNAMIC_KINEMATIC", o[o.DYNAMIC_FIXED = 2] = "DYNAMIC_FIXED", o[o.KINEMATIC_KINEMATIC = 52224] = "KINEMATIC_KINEMATIC", o[o.KINEMATIC_FIXED = 8704] = "KINEMATIC_FIXED", o[o.FIXED_FIXED = 32] = "FIXED_FIXED", o[o.DEFAULT = 15] = "DEFAULT", o[o.ALL = 60943] = "ALL";
    })(Ft || (Ft = {}));
    ee = class {
        constructor(t, e, r, i){
            this.colliderSet = t, this.handle = e, this._parent = r, this._shape = i;
        }
        finalizeDeserialization(t) {
            this.handle != null && (this._parent = t.get(this.colliderSet.raw.coParent(this.handle)));
        }
        ensureShapeIsCached() {
            this._shape || (this._shape = k.fromRaw(this.colliderSet.raw, this.handle));
        }
        get shape() {
            return this.ensureShapeIsCached(), this._shape;
        }
        isValid() {
            return this.colliderSet.raw.contains(this.handle);
        }
        translation() {
            return h.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
        }
        rotation() {
            return A.fromRaw(this.colliderSet.raw.coRotation(this.handle));
        }
        isSensor() {
            return this.colliderSet.raw.coIsSensor(this.handle);
        }
        setSensor(t) {
            this.colliderSet.raw.coSetSensor(this.handle, t);
        }
        setShape(t) {
            let e = t.intoRaw();
            this.colliderSet.raw.coSetShape(this.handle, e), e.free(), this._shape = t;
        }
        setEnabled(t) {
            this.colliderSet.raw.coSetEnabled(this.handle, t);
        }
        isEnabled() {
            return this.colliderSet.raw.coIsEnabled(this.handle);
        }
        setRestitution(t) {
            this.colliderSet.raw.coSetRestitution(this.handle, t);
        }
        setFriction(t) {
            this.colliderSet.raw.coSetFriction(this.handle, t);
        }
        frictionCombineRule() {
            return this.colliderSet.raw.coFrictionCombineRule(this.handle);
        }
        setFrictionCombineRule(t) {
            this.colliderSet.raw.coSetFrictionCombineRule(this.handle, t);
        }
        restitutionCombineRule() {
            return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
        }
        setRestitutionCombineRule(t) {
            this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, t);
        }
        setCollisionGroups(t) {
            this.colliderSet.raw.coSetCollisionGroups(this.handle, t);
        }
        setSolverGroups(t) {
            this.colliderSet.raw.coSetSolverGroups(this.handle, t);
        }
        activeHooks() {
            return this.colliderSet.raw.coActiveHooks(this.handle);
        }
        setActiveHooks(t) {
            this.colliderSet.raw.coSetActiveHooks(this.handle, t);
        }
        activeEvents() {
            return this.colliderSet.raw.coActiveEvents(this.handle);
        }
        setActiveEvents(t) {
            this.colliderSet.raw.coSetActiveEvents(this.handle, t);
        }
        activeCollisionTypes() {
            return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
        }
        setContactForceEventThreshold(t) {
            return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, t);
        }
        contactForceEventThreshold() {
            return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
        }
        setActiveCollisionTypes(t) {
            this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, t);
        }
        setDensity(t) {
            this.colliderSet.raw.coSetDensity(this.handle, t);
        }
        setMass(t) {
            this.colliderSet.raw.coSetMass(this.handle, t);
        }
        setMassProperties(t, e, r) {
            let i = h.intoRaw(e);
            this.colliderSet.raw.coSetMassProperties(this.handle, t, i, r), i.free();
        }
        setTranslation(t) {
            this.colliderSet.raw.coSetTranslation(this.handle, t.x, t.y);
        }
        setTranslationWrtParent(t) {
            this.colliderSet.raw.coSetTranslationWrtParent(this.handle, t.x, t.y);
        }
        setRotation(t) {
            this.colliderSet.raw.coSetRotation(this.handle, t);
        }
        setRotationWrtParent(t) {
            this.colliderSet.raw.coSetRotationWrtParent(this.handle, t);
        }
        shapeType() {
            return this.colliderSet.raw.coShapeType(this.handle);
        }
        halfExtents() {
            return h.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
        }
        setHalfExtents(t) {
            const e = h.intoRaw(t);
            this.colliderSet.raw.coSetHalfExtents(this.handle, e);
        }
        radius() {
            return this.colliderSet.raw.coRadius(this.handle);
        }
        setRadius(t) {
            this.colliderSet.raw.coSetRadius(this.handle, t);
        }
        roundRadius() {
            return this.colliderSet.raw.coRoundRadius(this.handle);
        }
        setRoundRadius(t) {
            this.colliderSet.raw.coSetRoundRadius(this.handle, t);
        }
        halfHeight() {
            return this.colliderSet.raw.coHalfHeight(this.handle);
        }
        setHalfHeight(t) {
            this.colliderSet.raw.coSetHalfHeight(this.handle, t);
        }
        vertices() {
            return this.colliderSet.raw.coVertices(this.handle);
        }
        indices() {
            return this.colliderSet.raw.coIndices(this.handle);
        }
        heightfieldHeights() {
            return this.colliderSet.raw.coHeightfieldHeights(this.handle);
        }
        heightfieldScale() {
            let t = this.colliderSet.raw.coHeightfieldScale(this.handle);
            return h.fromRaw(t);
        }
        parent() {
            return this._parent;
        }
        friction() {
            return this.colliderSet.raw.coFriction(this.handle);
        }
        restitution() {
            return this.colliderSet.raw.coRestitution(this.handle);
        }
        density() {
            return this.colliderSet.raw.coDensity(this.handle);
        }
        mass() {
            return this.colliderSet.raw.coMass(this.handle);
        }
        volume() {
            return this.colliderSet.raw.coVolume(this.handle);
        }
        collisionGroups() {
            return this.colliderSet.raw.coCollisionGroups(this.handle);
        }
        solverGroups() {
            return this.colliderSet.raw.coSolverGroups(this.handle);
        }
        containsPoint(t) {
            let e = h.intoRaw(t), r = this.colliderSet.raw.coContainsPoint(this.handle, e);
            return e.free(), r;
        }
        projectPoint(t, e) {
            let r = h.intoRaw(t), i = gt.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, r, e));
            return r.free(), i;
        }
        intersectsRay(t, e) {
            let r = h.intoRaw(t.origin), i = h.intoRaw(t.dir), s = this.colliderSet.raw.coIntersectsRay(this.handle, r, i, e);
            return r.free(), i.free(), s;
        }
        castShape(t, e, r, i, s, a, l) {
            let w = h.intoRaw(t), p = h.intoRaw(r), u = A.intoRaw(i), _ = h.intoRaw(s), m = e.intoRaw(), y = ot.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, w, m, p, u, _, a, l));
            return w.free(), p.free(), u.free(), _.free(), m.free(), y;
        }
        castCollider(t, e, r, i, s) {
            let a = h.intoRaw(t), l = h.intoRaw(r), w = Rt.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, a, e.handle, l, i, s));
            return a.free(), l.free(), w;
        }
        intersectsShape(t, e, r) {
            let i = h.intoRaw(e), s = A.intoRaw(r), a = t.intoRaw(), l = this.colliderSet.raw.coIntersectsShape(this.handle, a, i, s);
            return i.free(), s.free(), a.free(), l;
        }
        contactShape(t, e, r, i) {
            let s = h.intoRaw(e), a = A.intoRaw(r), l = t.intoRaw(), w = nt.fromRaw(this.colliderSet.raw.coContactShape(this.handle, l, s, a, i));
            return s.free(), a.free(), l.free(), w;
        }
        contactCollider(t, e) {
            return nt.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, t.handle, e));
        }
        castRay(t, e, r) {
            let i = h.intoRaw(t.origin), s = h.intoRaw(t.dir), a = this.colliderSet.raw.coCastRay(this.handle, i, s, e, r);
            return i.free(), s.free(), a;
        }
        castRayAndGetNormal(t, e, r) {
            let i = h.intoRaw(t.origin), s = h.intoRaw(t.dir), a = St.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, i, s, e, r));
            return i.free(), s.free(), a;
        }
    };
    (function(o) {
        o[o.Density = 0] = "Density", o[o.Mass = 1] = "Mass", o[o.MassProps = 2] = "MassProps";
    })(Q || (Q = {}));
    F = class {
        constructor(t){
            this.enabled = !0, this.shape = t, this.massPropsMode = Q.Density, this.density = 1, this.friction = .5, this.restitution = 0, this.rotation = A.identity(), this.translation = h.zeros(), this.isSensor = !1, this.collisionGroups = 4294967295, this.solverGroups = 4294967295, this.frictionCombineRule = pt.Average, this.restitutionCombineRule = pt.Average, this.activeCollisionTypes = Ft.DEFAULT, this.activeEvents = 0, this.activeHooks = 0, this.mass = 0, this.centerOfMass = h.zeros(), this.contactForceEventThreshold = 0, this.principalAngularInertia = 0, this.rotationsEnabled = !0;
        }
        static ball(t) {
            const e = new me(t);
            return new F(e);
        }
        static capsule(t, e) {
            const r = new Se(t, e);
            return new F(r);
        }
        static segment(t, e) {
            const r = new Re(t, e);
            return new F(r);
        }
        static triangle(t, e, r) {
            const i = new ve(t, e, r);
            return new F(i);
        }
        static roundTriangle(t, e, r, i) {
            const s = new Ce(t, e, r, i);
            return new F(s);
        }
        static polyline(t, e) {
            const r = new Ae(t, e);
            return new F(r);
        }
        static trimesh(t, e) {
            const r = new je(t, e);
            return new F(r);
        }
        static cuboid(t, e) {
            const r = new ye(t, e);
            return new F(r);
        }
        static roundCuboid(t, e, r) {
            const i = new ge(t, e, r);
            return new F(i);
        }
        static halfspace(t) {
            const e = new be(t);
            return new F(e);
        }
        static heightfield(t, e) {
            const r = new Ee(t, e);
            return new F(r);
        }
        static convexHull(t) {
            const e = new Tt(t, !1);
            return new F(e);
        }
        static convexPolyline(t) {
            const e = new Tt(t, !0);
            return new F(e);
        }
        static roundConvexHull(t, e) {
            const r = new xt(t, e, !1);
            return new F(r);
        }
        static roundConvexPolyline(t, e) {
            const r = new xt(t, e, !0);
            return new F(r);
        }
        setTranslation(t, e) {
            if (typeof t != "number" || typeof e != "number") throw TypeError("The translation components must be numbers.");
            return this.translation = {
                x: t,
                y: e
            }, this;
        }
        setRotation(t) {
            return this.rotation = t, this;
        }
        setSensor(t) {
            return this.isSensor = t, this;
        }
        setEnabled(t) {
            return this.enabled = t, this;
        }
        setDensity(t) {
            return this.massPropsMode = Q.Density, this.density = t, this;
        }
        setMass(t) {
            return this.massPropsMode = Q.Mass, this.mass = t, this;
        }
        setMassProperties(t, e, r) {
            return this.massPropsMode = Q.MassProps, this.mass = t, h.copy(this.centerOfMass, e), this.principalAngularInertia = r, this;
        }
        setRestitution(t) {
            return this.restitution = t, this;
        }
        setFriction(t) {
            return this.friction = t, this;
        }
        setFrictionCombineRule(t) {
            return this.frictionCombineRule = t, this;
        }
        setRestitutionCombineRule(t) {
            return this.restitutionCombineRule = t, this;
        }
        setCollisionGroups(t) {
            return this.collisionGroups = t, this;
        }
        setSolverGroups(t) {
            return this.solverGroups = t, this;
        }
        setActiveHooks(t) {
            return this.activeHooks = t, this;
        }
        setActiveEvents(t) {
            return this.activeEvents = t, this;
        }
        setActiveCollisionTypes(t) {
            return this.activeCollisionTypes = t, this;
        }
        setContactForceEventThreshold(t) {
            return this.contactForceEventThreshold = t, this;
        }
    };
    sr = class {
        constructor(t){
            this.raw = t || new M, this.map = new Bt, t && t.forEachColliderHandle((e)=>{
                this.map.set(e, new ee(this, e, null));
            });
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
        }
        castClosure(t) {
            return (e)=>{
                if (t) return t(this.get(e));
            };
        }
        finalizeDeserialization(t) {
            this.map.forEach((e)=>e.finalizeDeserialization(t));
        }
        createCollider(t, e, r) {
            let i = r != null && r != null;
            if (i && isNaN(r)) throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
            let s = e.shape.intoRaw(), a = h.intoRaw(e.translation), l = A.intoRaw(e.rotation), w = h.intoRaw(e.centerOfMass), p = this.raw.createCollider(e.enabled, s, a, l, e.massPropsMode, e.mass, w, e.principalAngularInertia, e.density, e.friction, e.restitution, e.frictionCombineRule, e.restitutionCombineRule, e.isSensor, e.collisionGroups, e.solverGroups, e.activeCollisionTypes, e.activeHooks, e.activeEvents, e.contactForceEventThreshold, i, i ? r : 0, t.raw);
            s.free(), a.free(), l.free(), w.free();
            let u = i ? t.get(r) : null, _ = new ee(this, p, u, e.shape);
            return this.map.set(p, _), _;
        }
        remove(t, e, r, i) {
            this.raw.remove(t, e.raw, r.raw, i), this.unmap(t);
        }
        unmap(t) {
            this.map.delete(t);
        }
        get(t) {
            return this.map.get(t);
        }
        len() {
            return this.map.len();
        }
        contains(t) {
            return this.get(t) != null;
        }
        forEach(t) {
            this.map.forEach(t);
        }
        getAll() {
            return this.map.getAll();
        }
    };
    or = class {
        constructor(t){
            this.raw = t || new It;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        step(t, e, r, i, s, a, l, w, p, u, _, m) {
            let y = h.intoRaw(t);
            _ ? this.raw.stepWithEvents(y, e.raw, r.raw, i.raw, s.raw, a.raw, l.raw, w.raw, p.raw, u.raw, _.raw, m, m ? m.filterContactPair : null, m ? m.filterIntersectionPair : null) : this.raw.step(y, e.raw, r.raw, i.raw, s.raw, a.raw, l.raw, w.raw, p.raw, u.raw), y.free();
        }
    };
    (function(o) {
        o[o.EXCLUDE_FIXED = 1] = "EXCLUDE_FIXED", o[o.EXCLUDE_KINEMATIC = 2] = "EXCLUDE_KINEMATIC", o[o.EXCLUDE_DYNAMIC = 4] = "EXCLUDE_DYNAMIC", o[o.EXCLUDE_SENSORS = 8] = "EXCLUDE_SENSORS", o[o.EXCLUDE_SOLIDS = 16] = "EXCLUDE_SOLIDS", o[o.ONLY_DYNAMIC = 3] = "ONLY_DYNAMIC", o[o.ONLY_KINEMATIC = 5] = "ONLY_KINEMATIC", o[o.ONLY_FIXED = 6] = "ONLY_FIXED";
    })(re || (re = {}));
    ar = class {
        constructor(t){
            this.raw = t || new dt;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        update(t, e) {
            this.raw.update(t.raw, e.raw);
        }
        castRay(t, e, r, i, s, a, l, w, p, u) {
            let _ = h.intoRaw(r.origin), m = h.intoRaw(r.dir), y = qt.fromRaw(e, this.raw.castRay(t.raw, e.raw, _, m, i, s, a, l, w, p, u));
            return _.free(), m.free(), y;
        }
        castRayAndGetNormal(t, e, r, i, s, a, l, w, p, u) {
            let _ = h.intoRaw(r.origin), m = h.intoRaw(r.dir), y = _t.fromRaw(e, this.raw.castRayAndGetNormal(t.raw, e.raw, _, m, i, s, a, l, w, p, u));
            return _.free(), m.free(), y;
        }
        intersectionsWithRay(t, e, r, i, s, a, l, w, p, u, _) {
            let m = h.intoRaw(r.origin), y = h.intoRaw(r.dir), I = (D)=>a(_t.fromRaw(e, D));
            this.raw.intersectionsWithRay(t.raw, e.raw, m, y, i, s, I, l, w, p, u, _), m.free(), y.free();
        }
        intersectionWithShape(t, e, r, i, s, a, l, w, p, u) {
            let _ = h.intoRaw(r), m = A.intoRaw(i), y = s.intoRaw(), I = this.raw.intersectionWithShape(t.raw, e.raw, _, m, y, a, l, w, p, u);
            return _.free(), m.free(), y.free(), I;
        }
        projectPoint(t, e, r, i, s, a, l, w, p) {
            let u = h.intoRaw(r), _ = ut.fromRaw(e, this.raw.projectPoint(t.raw, e.raw, u, i, s, a, l, w, p));
            return u.free(), _;
        }
        projectPointAndGetFeature(t, e, r, i, s, a, l, w) {
            let p = h.intoRaw(r), u = ut.fromRaw(e, this.raw.projectPointAndGetFeature(t.raw, e.raw, p, i, s, a, l, w));
            return p.free(), u;
        }
        intersectionsWithPoint(t, e, r, i, s, a, l, w, p) {
            let u = h.intoRaw(r);
            this.raw.intersectionsWithPoint(t.raw, e.raw, u, i, s, a, l, w, p), u.free();
        }
        castShape(t, e, r, i, s, a, l, w, p, u, _, m, y) {
            let I = h.intoRaw(r), D = A.intoRaw(i), O = h.intoRaw(s), V = a.intoRaw(), $ = Rt.fromRaw(e, this.raw.castShape(t.raw, e.raw, I, D, O, V, l, w, p, u, _, m, y));
            return I.free(), D.free(), O.free(), V.free(), $;
        }
        intersectionsWithShape(t, e, r, i, s, a, l, w, p, u, _) {
            let m = h.intoRaw(r), y = A.intoRaw(i), I = s.intoRaw();
            this.raw.intersectionsWithShape(t.raw, e.raw, m, y, I, a, l, w, p, u, _), m.free(), y.free(), I.free();
        }
        collidersWithAabbIntersectingAabb(t, e, r) {
            let i = h.intoRaw(t), s = h.intoRaw(e);
            this.raw.collidersWithAabbIntersectingAabb(i, s, r), i.free(), s.free();
        }
    };
    ne = class {
        constructor(t){
            this.raw = t || new Mt;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        serializeAll(t, e, r, i, s, a, l, w, p) {
            let u = h.intoRaw(t);
            const _ = this.raw.serializeAll(u, e.raw, r.raw, i.raw, s.raw, a.raw, l.raw, w.raw, p.raw);
            return u.free(), _;
        }
        deserializeAll(t) {
            return Ot.fromRaw(this.raw.deserializeAll(t));
        }
    };
    cr = class {
        constructor(t, e){
            this.vertices = t, this.colors = e;
        }
    };
    lr = class {
        constructor(t){
            this.raw = t || new jt;
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0, this.vertices = void 0, this.colors = void 0;
        }
        render(t, e, r, i, s) {
            this.raw.render(t.raw, e.raw, r.raw, i.raw, s.raw), this.vertices = this.raw.vertices(), this.colors = this.raw.colors();
        }
    };
    hr = class {
    };
    dr = class {
        constructor(t, e, r, i, s){
            this.params = e, this.bodies = r, this.colliders = i, this.queries = s, this.raw = new Et(t), this.rawCharacterCollision = new lt, this._applyImpulsesToDynamicBodies = !1, this._characterMass = null;
        }
        free() {
            this.raw && (this.raw.free(), this.rawCharacterCollision.free()), this.raw = void 0, this.rawCharacterCollision = void 0;
        }
        up() {
            return this.raw.up();
        }
        setUp(t) {
            let e = h.intoRaw(t);
            return this.raw.setUp(e);
        }
        applyImpulsesToDynamicBodies() {
            return this._applyImpulsesToDynamicBodies;
        }
        setApplyImpulsesToDynamicBodies(t) {
            this._applyImpulsesToDynamicBodies = t;
        }
        characterMass() {
            return this._characterMass;
        }
        setCharacterMass(t) {
            this._characterMass = t;
        }
        offset() {
            return this.raw.offset();
        }
        setOffset(t) {
            this.raw.setOffset(t);
        }
        slideEnabled() {
            return this.raw.slideEnabled();
        }
        setSlideEnabled(t) {
            this.raw.setSlideEnabled(t);
        }
        autostepMaxHeight() {
            return this.raw.autostepMaxHeight();
        }
        autostepMinWidth() {
            return this.raw.autostepMinWidth();
        }
        autostepIncludesDynamicBodies() {
            return this.raw.autostepIncludesDynamicBodies();
        }
        autostepEnabled() {
            return this.raw.autostepEnabled();
        }
        enableAutostep(t, e, r) {
            this.raw.enableAutostep(t, e, r);
        }
        disableAutostep() {
            return this.raw.disableAutostep();
        }
        maxSlopeClimbAngle() {
            return this.raw.maxSlopeClimbAngle();
        }
        setMaxSlopeClimbAngle(t) {
            this.raw.setMaxSlopeClimbAngle(t);
        }
        minSlopeSlideAngle() {
            return this.raw.minSlopeSlideAngle();
        }
        setMinSlopeSlideAngle(t) {
            this.raw.setMinSlopeSlideAngle(t);
        }
        snapToGroundDistance() {
            return this.raw.snapToGroundDistance();
        }
        enableSnapToGround(t) {
            this.raw.enableSnapToGround(t);
        }
        disableSnapToGround() {
            this.raw.disableSnapToGround();
        }
        snapToGroundEnabled() {
            return this.raw.snapToGroundEnabled();
        }
        computeColliderMovement(t, e, r, i, s) {
            let a = h.intoRaw(e);
            this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, t.handle, a, this._applyImpulsesToDynamicBodies, this._characterMass, r, i, this.colliders.castClosure(s)), a.free();
        }
        computedMovement() {
            return h.fromRaw(this.raw.computedMovement());
        }
        computedGrounded() {
            return this.raw.computedGrounded();
        }
        numComputedCollisions() {
            return this.raw.numComputedCollisions();
        }
        computedCollision(t, e) {
            if (this.raw.computedCollision(t, this.rawCharacterCollision)) {
                let r = this.rawCharacterCollision;
                return e = e ?? new hr, e.translationApplied = h.fromRaw(r.translationApplied()), e.translationRemaining = h.fromRaw(r.translationRemaining()), e.toi = r.toi(), e.witness1 = h.fromRaw(r.worldWitness1()), e.witness2 = h.fromRaw(r.worldWitness2()), e.normal1 = h.fromRaw(r.worldNormal1()), e.normal2 = h.fromRaw(r.worldNormal2()), e.collider = this.colliders.get(r.handle()), e;
            } else return null;
        }
    };
    Ot = class {
        constructor(t, e, r, i, s, a, l, w, p, u, _, m, y, I){
            this.gravity = t, this.integrationParameters = new Ve(e), this.islands = new er(r), this.broadPhase = new rr(i), this.narrowPhase = new nr(s), this.bodies = new Oe(a), this.colliders = new sr(l), this.impulseJoints = new Ke(w), this.multibodyJoints = new Qe(p), this.ccdSolver = new tr(u), this.queryPipeline = new ar(_), this.physicsPipeline = new or(m), this.serializationPipeline = new ne(y), this.debugRenderPipeline = new lr(I), this.characterControllers = new Set, this.impulseJoints.finalizeDeserialization(this.bodies), this.bodies.finalizeDeserialization(this.colliders), this.colliders.finalizeDeserialization(this.bodies);
        }
        free() {
            this.integrationParameters.free(), this.islands.free(), this.broadPhase.free(), this.narrowPhase.free(), this.bodies.free(), this.colliders.free(), this.impulseJoints.free(), this.multibodyJoints.free(), this.ccdSolver.free(), this.queryPipeline.free(), this.physicsPipeline.free(), this.serializationPipeline.free(), this.debugRenderPipeline.free(), this.characterControllers.forEach((t)=>t.free()), this.integrationParameters = void 0, this.islands = void 0, this.broadPhase = void 0, this.narrowPhase = void 0, this.bodies = void 0, this.colliders = void 0, this.ccdSolver = void 0, this.impulseJoints = void 0, this.multibodyJoints = void 0, this.queryPipeline = void 0, this.physicsPipeline = void 0, this.serializationPipeline = void 0, this.debugRenderPipeline = void 0, this.characterControllers = void 0;
        }
        static fromRaw(t) {
            return t ? new Ot(h.fromRaw(t.takeGravity()), t.takeIntegrationParameters(), t.takeIslandManager(), t.takeBroadPhase(), t.takeNarrowPhase(), t.takeBodies(), t.takeColliders(), t.takeImpulseJoints(), t.takeMultibodyJoints()) : null;
        }
        takeSnapshot() {
            return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
        }
        static restoreSnapshot(t) {
            return new ne().deserializeAll(t);
        }
        debugRender() {
            return this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase), new cr(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
        }
        step(t, e) {
            this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, t, e), this.queryPipeline.update(this.bodies, this.colliders);
        }
        propagateModifiedBodyPositionsToColliders() {
            this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
        }
        updateSceneQueries() {
            this.propagateModifiedBodyPositionsToColliders(), this.queryPipeline.update(this.bodies, this.colliders);
        }
        get timestep() {
            return this.integrationParameters.dt;
        }
        set timestep(t) {
            this.integrationParameters.dt = t;
        }
        get maxVelocityIterations() {
            return this.integrationParameters.maxVelocityIterations;
        }
        set maxVelocityIterations(t) {
            this.integrationParameters.maxVelocityIterations = t;
        }
        get maxVelocityFrictionIterations() {
            return this.integrationParameters.maxVelocityFrictionIterations;
        }
        set maxVelocityFrictionIterations(t) {
            this.integrationParameters.maxVelocityFrictionIterations = t;
        }
        get maxStabilizationIterations() {
            return this.integrationParameters.maxStabilizationIterations;
        }
        set maxStabilizationIterations(t) {
            this.integrationParameters.maxStabilizationIterations = t;
        }
        createRigidBody(t) {
            return this.bodies.createRigidBody(this.colliders, t);
        }
        createCharacterController(t) {
            let e = new dr(t, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
            return this.characterControllers.add(e), e;
        }
        removeCharacterController(t) {
            this.characterControllers.delete(t), t.free();
        }
        createCollider(t, e) {
            let r = e ? e.handle : void 0;
            return this.colliders.createCollider(this.bodies, t, r);
        }
        createImpulseJoint(t, e, r, i) {
            return this.impulseJoints.createJoint(this.bodies, t, e.handle, r.handle, i);
        }
        createMultibodyJoint(t, e, r, i) {
            return this.multibodyJoints.createJoint(t, e.handle, r.handle, i);
        }
        getRigidBody(t) {
            return this.bodies.get(t);
        }
        getCollider(t) {
            return this.colliders.get(t);
        }
        getImpulseJoint(t) {
            return this.impulseJoints.get(t);
        }
        getMultibodyJoint(t) {
            return this.multibodyJoints.get(t);
        }
        removeRigidBody(t) {
            this.bodies && this.bodies.remove(t.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
        }
        removeCollider(t, e) {
            this.colliders && this.colliders.remove(t.handle, this.islands, this.bodies, e);
        }
        removeImpulseJoint(t, e) {
            this.impulseJoints && this.impulseJoints.remove(t.handle, e);
        }
        removeMultibodyJoint(t, e) {
            this.impulseJoints && this.multibodyJoints.remove(t.handle, e);
        }
        forEachCollider(t) {
            this.colliders.forEach(t);
        }
        forEachRigidBody(t) {
            this.bodies.forEach(t);
        }
        forEachActiveRigidBody(t) {
            this.bodies.forEachActiveRigidBody(this.islands, t);
        }
        castRay(t, e, r, i, s, a, l, w) {
            return this.queryPipeline.castRay(this.bodies, this.colliders, t, e, r, i, s, a ? a.handle : null, l ? l.handle : null, this.colliders.castClosure(w));
        }
        castRayAndGetNormal(t, e, r, i, s, a, l, w) {
            return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, t, e, r, i, s, a ? a.handle : null, l ? l.handle : null, this.colliders.castClosure(w));
        }
        intersectionsWithRay(t, e, r, i, s, a, l, w, p) {
            this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, t, e, r, i, s, a, l ? l.handle : null, w ? w.handle : null, this.colliders.castClosure(p));
        }
        intersectionWithShape(t, e, r, i, s, a, l, w) {
            let p = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, t, e, r, i, s, a ? a.handle : null, l ? l.handle : null, this.colliders.castClosure(w));
            return p != null ? this.colliders.get(p) : null;
        }
        projectPoint(t, e, r, i, s, a, l) {
            return this.queryPipeline.projectPoint(this.bodies, this.colliders, t, e, r, i, s ? s.handle : null, a ? a.handle : null, this.colliders.castClosure(l));
        }
        projectPointAndGetFeature(t, e, r, i, s, a) {
            return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, t, e, r, i ? i.handle : null, s ? s.handle : null, this.colliders.castClosure(a));
        }
        intersectionsWithPoint(t, e, r, i, s, a, l) {
            this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, t, this.colliders.castClosure(e), r, i, s ? s.handle : null, a ? a.handle : null, this.colliders.castClosure(l));
        }
        castShape(t, e, r, i, s, a, l, w, p, u, _) {
            return this.queryPipeline.castShape(this.bodies, this.colliders, t, e, r, i, s, a, l, w, p ? p.handle : null, u ? u.handle : null, this.colliders.castClosure(_));
        }
        intersectionsWithShape(t, e, r, i, s, a, l, w, p) {
            this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, t, e, r, this.colliders.castClosure(i), s, a, l ? l.handle : null, w ? w.handle : null, this.colliders.castClosure(p));
        }
        collidersWithAabbIntersectingAabb(t, e, r) {
            this.queryPipeline.collidersWithAabbIntersectingAabb(t, e, this.colliders.castClosure(r));
        }
        contactsWith(t, e) {
            this.narrowPhase.contactsWith(t.handle, this.colliders.castClosure(e));
        }
        intersectionsWith(t, e) {
            this.narrowPhase.intersectionsWith(t.handle, this.colliders.castClosure(e));
        }
        contactPair(t, e, r) {
            this.narrowPhase.contactPair(t.handle, e.handle, r);
        }
        intersectionPair(t, e) {
            return this.narrowPhase.intersectionPair(t.handle, e.handle);
        }
    };
    (function(o) {
        o[o.COLLISION_EVENTS = 1] = "COLLISION_EVENTS", o[o.CONTACT_FORCE_EVENTS = 2] = "CONTACT_FORCE_EVENTS";
    })(ie || (ie = {}));
    wr = class {
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        collider1() {
            return this.raw.collider1();
        }
        collider2() {
            return this.raw.collider2();
        }
        totalForce() {
            return h.fromRaw(this.raw.total_force());
        }
        totalForceMagnitude() {
            return this.raw.total_force_magnitude();
        }
        maxForceDirection() {
            return h.fromRaw(this.raw.max_force_direction());
        }
        maxForceMagnitude() {
            return this.raw.max_force_magnitude();
        }
    };
    xl = class {
        constructor(t, e){
            this.raw = e || new ht(t);
        }
        free() {
            this.raw && this.raw.free(), this.raw = void 0;
        }
        drainCollisionEvents(t) {
            this.raw.drainCollisionEvents(t);
        }
        drainContactForceEvents(t) {
            let e = new wr;
            this.raw.drainContactForceEvents((r)=>{
                e.raw = r, t(e), e.free();
            });
        }
        clear() {
            this.raw.clear();
        }
    };
    (function(o) {
        o[o.FILTER_CONTACT_PAIRS = 1] = "FILTER_CONTACT_PAIRS", o[o.FILTER_INTERSECTION_PAIRS = 2] = "FILTER_INTERSECTION_PAIRS";
    })(se || (se = {}));
    (function(o) {
        o[o.EMPTY = 0] = "EMPTY", o[o.COMPUTE_IMPULSE = 1] = "COMPUTE_IMPULSE";
    })(oe || (oe = {}));
    Fl = function() {
        return Sr();
    };
    Hl = Object.freeze(Object.defineProperty({
        __proto__: null,
        get ActiveCollisionTypes () {
            return Ft;
        },
        get ActiveEvents () {
            return ie;
        },
        get ActiveHooks () {
            return se;
        },
        Ball: me,
        BroadPhase: rr,
        CCDSolver: tr,
        Capsule: Se,
        CharacterCollision: hr,
        get CoefficientCombineRule () {
            return pt;
        },
        Collider: ee,
        ColliderDesc: F,
        ColliderSet: sr,
        ConvexPolygon: Tt,
        Cuboid: ye,
        DebugRenderBuffers: cr,
        DebugRenderPipeline: lr,
        EventQueue: xl,
        get FeatureType () {
            return it;
        },
        FixedImpulseJoint: Je,
        FixedMultibodyJoint: Ye,
        HalfSpace: be,
        Heightfield: Ee,
        ImpulseJoint: tt,
        ImpulseJointSet: Ke,
        IntegrationParameters: Ve,
        IslandManager: er,
        JointData: ct,
        get JointType () {
            return H;
        },
        KinematicCharacterController: dr,
        get MassPropsMode () {
            return Q;
        },
        get MotorModel () {
            return te;
        },
        MultibodyJoint: et,
        MultibodyJointSet: Qe,
        NarrowPhase: nr,
        PhysicsPipeline: or,
        PointColliderProjection: ut,
        PointProjection: gt,
        Polyline: Ae,
        PrismaticImpulseJoint: Ue,
        PrismaticMultibodyJoint: $e,
        get QueryFilterFlags () {
            return re;
        },
        QueryPipeline: ar,
        Ray: Tl,
        RayColliderIntersection: _t,
        RayColliderToi: qt,
        RayIntersection: St,
        RevoluteImpulseJoint: Xe,
        RevoluteMultibodyJoint: Ze,
        RigidBody: Qt,
        RigidBodyDesc: z,
        RigidBodySet: Oe,
        get RigidBodyType () {
            return N;
        },
        RotationOps: A,
        RoundConvexPolygon: xt,
        RoundCuboid: ge,
        RoundTriangle: Ce,
        Segment: Re,
        SerializationPipeline: ne,
        Shape: k,
        ShapeColliderTOI: Rt,
        ShapeContact: nt,
        ShapeTOI: ot,
        get ShapeType () {
            return C;
        },
        get SolverFlags () {
            return oe;
        },
        TempContactForceEvent: wr,
        TempContactManifold: ir,
        TriMesh: je,
        Triangle: ve,
        UnitImpulseJoint: _e,
        UnitMultibodyJoint: fe,
        Vector2: qe,
        VectorOps: h,
        World: Ot,
        version: Fl
    }, Symbol.toStringTag, {
        value: "Module"
    }));
})();
export { Ft as ActiveCollisionTypes, ie as ActiveEvents, se as ActiveHooks, me as Ball, rr as BroadPhase, tr as CCDSolver, Se as Capsule, hr as CharacterCollision, pt as CoefficientCombineRule, ee as Collider, F as ColliderDesc, sr as ColliderSet, Tt as ConvexPolygon, ye as Cuboid, cr as DebugRenderBuffers, lr as DebugRenderPipeline, xl as EventQueue, it as FeatureType, Je as FixedImpulseJoint, Ye as FixedMultibodyJoint, be as HalfSpace, Ee as Heightfield, tt as ImpulseJoint, Ke as ImpulseJointSet, Ve as IntegrationParameters, er as IslandManager, ct as JointData, H as JointType, dr as KinematicCharacterController, Q as MassPropsMode, te as MotorModel, et as MultibodyJoint, Qe as MultibodyJointSet, nr as NarrowPhase, or as PhysicsPipeline, ut as PointColliderProjection, gt as PointProjection, Ae as Polyline, Ue as PrismaticImpulseJoint, $e as PrismaticMultibodyJoint, re as QueryFilterFlags, ar as QueryPipeline, Tl as Ray, _t as RayColliderIntersection, qt as RayColliderToi, St as RayIntersection, Xe as RevoluteImpulseJoint, Ze as RevoluteMultibodyJoint, Qt as RigidBody, z as RigidBodyDesc, Oe as RigidBodySet, N as RigidBodyType, A as RotationOps, xt as RoundConvexPolygon, ge as RoundCuboid, Ce as RoundTriangle, Re as Segment, ne as SerializationPipeline, k as Shape, Rt as ShapeColliderTOI, nt as ShapeContact, ot as ShapeTOI, C as ShapeType, oe as SolverFlags, wr as TempContactForceEvent, ir as TempContactManifold, je as TriMesh, ve as Triangle, _e as UnitImpulseJoint, fe as UnitMultibodyJoint, qe as Vector2, h as VectorOps, Ot as World, Hl as default, Fl as version, __tla };
