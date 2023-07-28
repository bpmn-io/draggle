var R = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ee(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ae = function(n, i) {
  return Array.prototype.slice.call(n, i);
}, He = typeof setImmediate == "function", J;
He ? J = function(e) {
  setImmediate(e);
} : J = function(e) {
  setTimeout(e, 0);
};
var Le = J, ze = Le, Ge = function(n, i, r) {
  n && ze(function() {
    n.apply(r || null, i || []);
  });
}, le = Ae, Ke = Ge, Ue = function(n, i) {
  var r = i || {}, c = {};
  return n === void 0 && (n = {}), n.on = function(o, s) {
    return c[o] ? c[o].push(s) : c[o] = [s], n;
  }, n.once = function(o, s) {
    return s._once = !0, n.on(o, s), n;
  }, n.off = function(o, s) {
    var w = arguments.length;
    if (w === 1)
      delete c[o];
    else if (w === 0)
      c = {};
    else {
      var S = c[o];
      if (!S)
        return n;
      S.splice(S.indexOf(s), 1);
    }
    return n;
  }, n.emit = function() {
    var o = le(arguments);
    return n.emitterSnapshot(o.shift()).apply(this, o);
  }, n.emitterSnapshot = function(o) {
    var s = (c[o] || []).slice(0);
    return function() {
      var w = le(arguments), S = this || n;
      if (o === "error" && r.throws !== !1 && !s.length)
        throw w.length === 1 ? w[0] : w;
      return s.forEach(function(y) {
        r.async ? Ke(y, w, S) : y.apply(S, w), y._once && n.off(o, y);
      }), n;
    };
  }, n;
};
const Ve = /* @__PURE__ */ Ee(Ue);
var we = R.CustomEvent;
function We() {
  try {
    var e = new we("cat", { detail: { foo: "bar" } });
    return e.type === "cat" && e.detail.foo === "bar";
  } catch {
  }
  return !1;
}
var qe = We() ? we : (
  // IE >= 9
  typeof document < "u" && typeof document.createEvent == "function" ? function(n, i) {
    var r = document.createEvent("CustomEvent");
    return i ? r.initCustomEvent(n, i.bubbles, i.cancelable, i.detail) : r.initCustomEvent(n, !1, !1, void 0), r;
  } : (
    // IE <= 8
    function(n, i) {
      var r = document.createEventObject();
      return r.type = n, i ? (r.bubbles = !!i.bubbles, r.cancelable = !!i.cancelable, r.detail = i.detail) : (r.bubbles = !1, r.cancelable = !1, r.detail = void 0), r;
    }
  )
), ye = [], q = "", Je = /^on/;
for (q in R)
  Je.test(q) && ye.push(q.slice(2));
var Qe = ye, Ze = qe, et = Qe, $ = R.document, Ce = nt, Se = it, k = [];
R.addEventListener || (Ce = rt, Se = ot);
var tt = {
  add: Ce,
  remove: Se,
  fabricate: at
};
function nt(e, n, i, r) {
  return e.addEventListener(n, i, r);
}
function rt(e, n, i) {
  return e.attachEvent("on" + n, ct(e, n, i));
}
function it(e, n, i, r) {
  return e.removeEventListener(n, i, r);
}
function ot(e, n, i) {
  var r = Oe(e, n, i);
  if (r)
    return e.detachEvent("on" + n, r);
}
function at(e, n, i) {
  var r = et.indexOf(n) === -1 ? o() : c();
  e.dispatchEvent ? e.dispatchEvent(r) : e.fireEvent("on" + n, r);
  function c() {
    var s;
    return $.createEvent ? (s = $.createEvent("Event"), s.initEvent(n, !0, !0)) : $.createEventObject && (s = $.createEventObject()), s;
  }
  function o() {
    return new Ze(n, { detail: i });
  }
}
function ut(e, n, i) {
  return function(c) {
    var o = c || R.event;
    o.target = o.target || o.srcElement, o.preventDefault = o.preventDefault || function() {
      o.returnValue = !1;
    }, o.stopPropagation = o.stopPropagation || function() {
      o.cancelBubble = !0;
    }, o.which = o.which || o.keyCode, i.call(e, o);
  };
}
function ct(e, n, i) {
  var r = Oe(e, n, i) || ut(e, n, i);
  return k.push({
    wrapper: r,
    element: e,
    type: n,
    fn: i
  }), r;
}
function Oe(e, n, i) {
  var r = ft(e, n, i);
  if (r) {
    var c = k[r].wrapper;
    return k.splice(r, 1), c;
  }
}
function ft(e, n, i) {
  var r, c;
  for (r = 0; r < k.length; r++)
    if (c = k[r], c.element === e && c.type === n && c.fn === i)
      return r;
}
const N = /* @__PURE__ */ Ee(tt);
var ve = {}, lt = "(?:^|\\s)", vt = "(?:\\s|$)";
function Te(e) {
  var n = ve[e];
  return n ? n.lastIndex = 0 : ve[e] = n = new RegExp(lt + e + vt, "g"), n;
}
function j(e, n) {
  var i = e.className;
  i.length ? Te(n).test(i) || (e.className += " " + n) : e.className = n;
}
function F(e, n) {
  e.className = e.className.replace(Te(n), " ").trim();
}
window.global || (window.global = window);
var I = document, C = I.documentElement;
function pt(e, n) {
  var i = arguments.length;
  i === 1 && Array.isArray(e) === !1 && (n = e, e = []);
  var r, c, o, s, w, S, A, y, Y, d, H, M = null, P, u = n || {};
  u.moves === void 0 && (u.moves = pe), u.accepts === void 0 && (u.accepts = pe), u.invalid === void 0 && (u.invalid = Ie), u.containers === void 0 && (u.containers = e || []), u.isContainer === void 0 && (u.isContainer = dt), u.copy === void 0 && (u.copy = !1), u.copySortSource === void 0 && (u.copySortSource = !1), u.revertOnSpill === void 0 && (u.revertOnSpill = !1), u.removeOnSpill === void 0 && (u.removeOnSpill = !1), u.direction === void 0 && (u.direction = "vertical"), u.ignoreInputTextSelection === void 0 && (u.ignoreInputTextSelection = !0), u.mirrorContainer === void 0 && (u.mirrorContainer = I.body);
  var v = Ve({
    containers: u.containers,
    start: Ne,
    end: ne,
    cancel: ae,
    remove: oe,
    destroy: Me,
    canMove: Be,
    dragging: !1
  });
  return u.removeOnSpill === !0 && v.on("over", Pe).on("out", xe), Q(), v;
  function L(t) {
    return v.containers.indexOf(t) !== -1 || u.isContainer(t);
  }
  function Q(t) {
    var a = t ? "remove" : "add";
    x(C, a, "mousedown", Xe), x(C, a, "mouseup", K);
  }
  function z(t) {
    var a = t ? "remove" : "add";
    x(C, a, "mousemove", Ye);
  }
  function Z(t) {
    var a = t ? "remove" : "add";
    N[a](C, "selectstart", ee), N[a](C, "click", ee);
  }
  function Me() {
    Q(!0), K({});
  }
  function ee(t) {
    P && t.preventDefault();
  }
  function Xe(t) {
    S = t.clientX, A = t.clientY;
    var a = se(t) !== 1 || t.metaKey || t.ctrlKey;
    if (!a) {
      var f = t.target, l = G(f);
      l && (P = l, z(), t.type === "mousedown" && (be(f) ? f.focus() : t.preventDefault()));
    }
  }
  function Ye(t) {
    if (P) {
      if (se(t) === 0) {
        K({});
        return;
      }
      if (!(t.clientX !== void 0 && Math.abs(t.clientX - S) <= (u.slideFactorX || 0) && t.clientY !== void 0 && Math.abs(t.clientY - A) <= (u.slideFactorY || 0))) {
        if (u.ignoreInputTextSelection) {
          var a = _("clientX", t) || 0, f = _("clientY", t) || 0, l = I.elementFromPoint(a, f);
          if (be(l))
            return;
        }
        var g = P;
        z(!0), Z(), ne(), te(g);
        var m = st(o);
        s = _("pageX", t) - m.left, w = _("pageY", t) - m.top, j(d || o, "gu-transit"), De(), W(t);
      }
    }
  }
  function G(t) {
    if (!(v.dragging && r) && !L(t)) {
      for (var a = t; h(t) && L(h(t)) === !1; )
        if (u.invalid(t, a) || (t = h(t), !t))
          return;
      var f = h(t);
      if (f && !u.invalid(t, a)) {
        var l = u.moves(t, f, a, D(t));
        if (l)
          return {
            item: t,
            source: f
          };
      }
    }
  }
  function Be(t) {
    return !!G(t);
  }
  function Ne(t) {
    var a = G(t);
    a && te(a);
  }
  function te(t) {
    Re(t.item, t.source) && (d = t.item.cloneNode(!0), v.emit("cloned", d, t.item, "copy")), c = t.source, o = t.item, y = Y = D(t.item), v.dragging = !0, v.emit("drag", o, c);
  }
  function Ie() {
    return !1;
  }
  function ne() {
    if (v.dragging) {
      var t = d || o;
      ie(t, h(t));
    }
  }
  function re() {
    P = !1, z(!0), Z(!0);
  }
  function K(t) {
    if (re(), !!v.dragging) {
      var a = d || o, f = _("clientX", t) || 0, l = _("clientY", t) || 0, g = me(r, f, l), m = ue(g, f, l);
      m && (d && u.copySortSource || !d || m !== c) ? ie(a, m) : u.removeOnSpill ? oe() : ae();
    }
  }
  function ie(t, a) {
    var f = h(t);
    d && u.copySortSource && a === c && f.removeChild(o), V(a) ? v.emit("cancel", t, c, c) : v.emit("drop", t, a, c, Y), U();
  }
  function oe() {
    if (v.dragging) {
      var t = d || o, a = h(t);
      a && a.removeChild(t), v.emit(d ? "cancel" : "remove", t, a, c), U();
    }
  }
  function ae(t) {
    if (v.dragging) {
      var a = arguments.length > 0 ? t : u.revertOnSpill, f = d || o, l = h(f), g = V(l);
      g === !1 && a && (d ? l && l.removeChild(d) : c.insertBefore(f, y)), g || a ? v.emit("cancel", f, c, c) : v.emit("drop", f, l, c, Y), U();
    }
  }
  function U() {
    var t = d || o;
    re(), ke(), t && F(t, "gu-transit"), H && clearTimeout(H), v.dragging = !1, M && v.emit("out", t, M, c), v.emit("dragend", t), c = o = d = y = Y = H = M = null;
  }
  function V(t, a) {
    var f;
    return a !== void 0 ? f = a : r ? f = Y : f = D(d || o), t === c && f === y;
  }
  function ue(t, a, f) {
    for (var l = t; l && !g(); )
      l = h(l);
    return l;
    function g() {
      var m = L(l);
      if (m === !1)
        return !1;
      var B = ce(l, t), p = fe(l, B, a, f), O = V(l, p);
      return O ? !0 : u.accepts(o, l, c, p);
    }
  }
  function W(t) {
    if (!r)
      return;
    t.preventDefault();
    var a = _("clientX", t) || 0, f = _("clientY", t) || 0, l = a - s, g = f - w;
    r.style.left = l + "px", r.style.top = g + "px";
    var m = d || o, B = me(r, a, f), p = ue(B, a, f), O = p !== null && p !== M;
    (O || p === null) && (je(), M = p, $e());
    var b = h(m);
    if (p === c && d && !u.copySortSource) {
      b && b.removeChild(m);
      return;
    }
    var E, X = ce(p, B);
    if (X !== null)
      E = fe(p, X, a, f);
    else if (u.revertOnSpill === !0 && !d)
      E = y, p = c;
    else {
      d && b && b.removeChild(m);
      return;
    }
    (E === null && O || E !== m && E !== D(m)) && (Y = E, p.insertBefore(m, E), v.emit("shadow", m, p, c));
    function T(Fe) {
      v.emit(Fe, m, M, c);
    }
    function $e() {
      O && T("over");
    }
    function je() {
      M && T("out");
    }
  }
  function Pe(t) {
    F(t, "gu-hide");
  }
  function xe(t) {
    v.dragging && j(t, "gu-hide");
  }
  function De() {
    if (!r) {
      var t = o.getBoundingClientRect();
      r = o.cloneNode(!0), r.style.width = ge(t) + "px", r.style.height = he(t) + "px", F(r, "gu-transit"), j(r, "gu-mirror"), u.mirrorContainer.appendChild(r), x(C, "add", "mousemove", W), j(u.mirrorContainer, "gu-unselectable"), v.emit("cloned", r, o, "mirror");
    }
  }
  function ke() {
    r && (F(u.mirrorContainer, "gu-unselectable"), x(C, "remove", "mousemove", W), h(r).removeChild(r), r = null);
  }
  function ce(t, a) {
    for (var f = a; f !== t && h(f) !== t; )
      f = h(f);
    return f === C ? null : f;
  }
  function fe(t, a, f, l) {
    var g = (typeof u.direction == "function" ? u.direction(o, t, c) : u.direction) === "horizontal", m = a !== t ? p() : B();
    return m;
    function B() {
      var b = t.children.length, E, X, T;
      for (E = 0; E < b; E++)
        if (X = t.children[E], T = X.getBoundingClientRect(), g && T.left + T.width / 2 > f || !g && T.top + T.height / 2 > l)
          return X;
      return null;
    }
    function p() {
      var b = a.getBoundingClientRect();
      return O(g ? f > b.left + ge(b) / 2 : l > b.top + he(b) / 2);
    }
    function O(b) {
      return b ? D(a) : a;
    }
  }
  function Re(t, a) {
    return typeof u.copy == "boolean" ? u.copy : u.copy(t, a);
  }
}
function x(e, n, i, r) {
  var c = {
    mouseup: "touchend",
    mousedown: "touchstart",
    mousemove: "touchmove"
  }, o = {
    mouseup: "pointerup",
    mousedown: "pointerdown",
    mousemove: "pointermove"
  }, s = {
    mouseup: "MSPointerUp",
    mousedown: "MSPointerDown",
    mousemove: "MSPointerMove"
  };
  global.navigator.pointerEnabled ? N[n](e, o[i], r) : global.navigator.msPointerEnabled ? N[n](e, s[i], r) : (N[n](e, c[i], r), N[n](e, i, r));
}
function se(e) {
  if (e.touches !== void 0)
    return e.touches.length;
  if (e.which !== void 0 && e.which !== 0)
    return e.which;
  if (e.buttons !== void 0)
    return e.buttons;
  var n = e.button;
  if (n !== void 0)
    return n & 1 ? 1 : n & 2 ? 3 : n & 4 ? 2 : 0;
}
function st(e) {
  var n = e.getBoundingClientRect();
  return {
    left: n.left + de("scrollLeft", "pageXOffset"),
    top: n.top + de("scrollTop", "pageYOffset")
  };
}
function de(e, n) {
  return typeof global[n] < "u" ? global[n] : C.clientHeight ? C[e] : I.body[e];
}
function me(e, n, i) {
  e = e || {};
  var r = e.className || "", c;
  return e.className += " gu-hide", c = I.elementFromPoint(n, i), e.className = r, c;
}
function dt() {
  return !1;
}
function pe() {
  return !0;
}
function ge(e) {
  return e.width || e.right - e.left;
}
function he(e) {
  return e.height || e.bottom - e.top;
}
function h(e) {
  return e.parentNode === I ? null : e.parentNode;
}
function be(e) {
  return e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.tagName === "SELECT" || _e(e);
}
function _e(e) {
  return !e || e.contentEditable === "false" ? !1 : e.contentEditable === "true" ? !0 : _e(h(e));
}
function D(e) {
  return e.nextElementSibling || n();
  function n() {
    var i = e;
    do
      i = i.nextSibling;
    while (i && i.nodeType !== 1);
    return i;
  }
}
function mt(e) {
  return e.targetTouches && e.targetTouches.length ? e.targetTouches[0] : e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e;
}
function _(e, n) {
  var i = mt(n), r = {
    pageX: "clientX",
    // IE8
    pageY: "clientY"
    // IE8
  };
  return e in r && !(e in i) && r[e] in i && (e = r[e]), i[e];
}
export {
  pt as default
};
