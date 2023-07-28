import B from "crossvent";
function Ie(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ne = function(t, l) {
  return Array.prototype.slice.call(t, l);
}, Be = typeof setImmediate == "function", U;
Be ? U = function(r) {
  setImmediate(r);
} : U = function(r) {
  setTimeout(r, 0);
};
var xe = U, Pe = xe, Re = function(t, l, u) {
  t && Pe(function() {
    t.apply(u || null, l || []);
  });
}, oe = Ne, De = Re, ke = function(t, l) {
  var u = l || {}, c = {};
  return t === void 0 && (t = {}), t.on = function(a, m) {
    return c[a] ? c[a].push(m) : c[a] = [m], t;
  }, t.once = function(a, m) {
    return m._once = !0, t.on(a, m), t;
  }, t.off = function(a, m) {
    var S = arguments.length;
    if (S === 1)
      delete c[a];
    else if (S === 0)
      c = {};
    else {
      var T = c[a];
      if (!T)
        return t;
      T.splice(T.indexOf(m), 1);
    }
    return t;
  }, t.emit = function() {
    var a = oe(arguments);
    return t.emitterSnapshot(a.shift()).apply(this, a);
  }, t.emitterSnapshot = function(a) {
    var m = (c[a] || []).slice(0);
    return function() {
      var S = oe(arguments), T = this || t;
      if (a === "error" && u.throws !== !1 && !m.length)
        throw S.length === 1 ? S[0] : S;
      return m.forEach(function(w) {
        u.async ? De(w, S, T) : w.apply(T, S), w._once && t.off(a, w);
      }), t;
    };
  }, t;
};
const Ae = /* @__PURE__ */ Ie(ke);
var ae = {}, Fe = "(?:^|\\s)", $e = "(?:\\s|$)";
function me(r) {
  var t = ae[r];
  return t ? t.lastIndex = 0 : ae[r] = t = new RegExp(Fe + r + $e, "g"), t;
}
function He(r, t) {
  var l = r.className;
  l.length ? me(t).test(l) || (r.className += " " + t) : r.className = t;
}
function je(r, t) {
  r.className = r.className.replace(me(t), " ").trim();
}
const _ = {
  add: He,
  rm: je
};
window.global || (window.global = window);
var x = document, C = x.documentElement;
function Ge(r, t) {
  var l = arguments.length;
  l === 1 && Array.isArray(r) === !1 && (t = r, r = []);
  var u, c, a, m, S, T, k, w, I, v, A, X = null, P, i = t || {};
  i.moves === void 0 && (i.moves = le), i.accepts === void 0 && (i.accepts = le), i.invalid === void 0 && (i.invalid = we), i.containers === void 0 && (i.containers = r || []), i.isContainer === void 0 && (i.isContainer = Ke), i.copy === void 0 && (i.copy = !1), i.copySortSource === void 0 && (i.copySortSource = !1), i.revertOnSpill === void 0 && (i.revertOnSpill = !1), i.removeOnSpill === void 0 && (i.removeOnSpill = !1), i.direction === void 0 && (i.direction = "vertical"), i.ignoreInputTextSelection === void 0 && (i.ignoreInputTextSelection = !0), i.mirrorContainer === void 0 && (i.mirrorContainer = x.body);
  var s = Ae({
    containers: i.containers,
    start: Se,
    end: Q,
    cancel: re,
    remove: ee,
    destroy: pe,
    canMove: ye,
    dragging: !1
  });
  return i.removeOnSpill === !0 && s.on("over", Ce).on("out", Te), G(), s;
  function F(e) {
    return s.containers.indexOf(e) !== -1 || i.isContainer(e);
  }
  function G(e) {
    var n = e ? "remove" : "add";
    R(C, n, "mousedown", he), R(C, n, "mouseup", j);
  }
  function $(e) {
    var n = e ? "remove" : "add";
    R(C, n, "mousemove", be);
  }
  function W(e) {
    var n = e ? "remove" : "add";
    B[n](C, "selectstart", q), B[n](C, "click", q);
  }
  function pe() {
    G(!0), j({});
  }
  function q(e) {
    P && e.preventDefault();
  }
  function he(e) {
    T = e.clientX, k = e.clientY;
    var n = ue(e) !== 1 || e.metaKey || e.ctrlKey;
    if (!n) {
      var o = e.target, f = H(o);
      f && (P = f, $(), e.type === "mousedown" && (de(o) ? o.focus() : e.preventDefault()));
    }
  }
  function be(e) {
    if (P) {
      if (ue(e) === 0) {
        j({});
        return;
      }
      if (!(e.clientX !== void 0 && Math.abs(e.clientX - T) <= (i.slideFactorX || 0) && e.clientY !== void 0 && Math.abs(e.clientY - k) <= (i.slideFactorY || 0))) {
        if (i.ignoreInputTextSelection) {
          var n = M("clientX", e) || 0, o = M("clientY", e) || 0, f = x.elementFromPoint(n, o);
          if (de(f))
            return;
        }
        var p = P;
        $(!0), W(), Q(), J(p);
        var d = ze(a);
        m = M("pageX", e) - d.left, S = M("pageY", e) - d.top, _.add(v || a, "gu-transit"), Ee(), L(e);
      }
    }
  }
  function H(e) {
    if (!(s.dragging && u) && !F(e)) {
      for (var n = e; h(e) && F(h(e)) === !1; )
        if (i.invalid(e, n) || (e = h(e), !e))
          return;
      var o = h(e);
      if (o && !i.invalid(e, n)) {
        var f = i.moves(e, o, n, D(e));
        if (f)
          return {
            item: e,
            source: o
          };
      }
    }
  }
  function ye(e) {
    return !!H(e);
  }
  function Se(e) {
    var n = H(e);
    n && J(n);
  }
  function J(e) {
    _e(e.item, e.source) && (v = e.item.cloneNode(!0), s.emit("cloned", v, e.item, "copy")), c = e.source, a = e.item, w = I = D(e.item), s.dragging = !0, s.emit("drag", a, c);
  }
  function we() {
    return !1;
  }
  function Q() {
    if (s.dragging) {
      var e = v || a;
      Z(e, h(e));
    }
  }
  function V() {
    P = !1, $(!0), W(!0);
  }
  function j(e) {
    if (V(), !!s.dragging) {
      var n = v || a, o = M("clientX", e) || 0, f = M("clientY", e) || 0, p = fe(u, o, f), d = te(p, o, f);
      d && (v && i.copySortSource || !v || d !== c) ? Z(n, d) : i.removeOnSpill ? ee() : re();
    }
  }
  function Z(e, n) {
    var o = h(e);
    v && i.copySortSource && n === c && o.removeChild(a), K(n) ? s.emit("cancel", e, c, c) : s.emit("drop", e, n, c, I), z();
  }
  function ee() {
    if (s.dragging) {
      var e = v || a, n = h(e);
      n && n.removeChild(e), s.emit(v ? "cancel" : "remove", e, n, c), z();
    }
  }
  function re(e) {
    if (s.dragging) {
      var n = arguments.length > 0 ? e : i.revertOnSpill, o = v || a, f = h(o), p = K(f);
      p === !1 && n && (v ? f && f.removeChild(v) : c.insertBefore(o, w)), p || n ? s.emit("cancel", o, c, c) : s.emit("drop", o, f, c, I), z();
    }
  }
  function z() {
    var e = v || a;
    V(), Oe(), e && _.rm(e, "gu-transit"), A && clearTimeout(A), s.dragging = !1, X && s.emit("out", e, X, c), s.emit("dragend", e), c = a = v = w = I = A = X = null;
  }
  function K(e, n) {
    var o;
    return n !== void 0 ? o = n : u ? o = I : o = D(v || a), e === c && o === w;
  }
  function te(e, n, o) {
    for (var f = e; f && !p(); )
      f = h(f);
    return f;
    function p() {
      var d = F(f);
      if (d === !1)
        return !1;
      var N = ne(f, e), g = ie(f, N, n, o), E = K(f, g);
      return E ? !0 : i.accepts(a, f, c, g);
    }
  }
  function L(e) {
    if (!u)
      return;
    e.preventDefault();
    var n = M("clientX", e) || 0, o = M("clientY", e) || 0, f = n - m, p = o - S;
    u.style.left = f + "px", u.style.top = p + "px";
    var d = v || a, N = fe(u, n, o), g = te(N, n, o), E = g !== null && g !== X;
    (E || g === null) && (Xe(), X = g, Me());
    var b = h(d);
    if (g === c && v && !i.copySortSource) {
      b && b.removeChild(d);
      return;
    }
    var y, Y = ne(g, N);
    if (Y !== null)
      y = ie(g, Y, n, o);
    else if (i.revertOnSpill === !0 && !v)
      y = w, g = c;
    else {
      v && b && b.removeChild(d);
      return;
    }
    (y === null && E || y !== d && y !== D(d)) && (I = y, g.insertBefore(d, y), s.emit("shadow", d, g, c));
    function O(Ye) {
      s.emit(Ye, d, X, c);
    }
    function Me() {
      E && O("over");
    }
    function Xe() {
      X && O("out");
    }
  }
  function Ce(e) {
    _.rm(e, "gu-hide");
  }
  function Te(e) {
    s.dragging && _.add(e, "gu-hide");
  }
  function Ee() {
    if (!u) {
      var e = a.getBoundingClientRect();
      u = a.cloneNode(!0), u.style.width = se(e) + "px", u.style.height = ve(e) + "px", _.rm(u, "gu-transit"), _.add(u, "gu-mirror"), i.mirrorContainer.appendChild(u), R(C, "add", "mousemove", L), _.add(i.mirrorContainer, "gu-unselectable"), s.emit("cloned", u, a, "mirror");
    }
  }
  function Oe() {
    u && (_.rm(i.mirrorContainer, "gu-unselectable"), R(C, "remove", "mousemove", L), h(u).removeChild(u), u = null);
  }
  function ne(e, n) {
    for (var o = n; o !== e && h(o) !== e; )
      o = h(o);
    return o === C ? null : o;
  }
  function ie(e, n, o, f) {
    var p = (typeof i.direction == "function" ? i.direction(a, e, c) : i.direction) === "horizontal", d = n !== e ? g() : N();
    return d;
    function N() {
      var b = e.children.length, y, Y, O;
      for (y = 0; y < b; y++)
        if (Y = e.children[y], O = Y.getBoundingClientRect(), p && O.left + O.width / 2 > o || !p && O.top + O.height / 2 > f)
          return Y;
      return null;
    }
    function g() {
      var b = n.getBoundingClientRect();
      return E(p ? o > b.left + se(b) / 2 : f > b.top + ve(b) / 2);
    }
    function E(b) {
      return b ? D(n) : n;
    }
  }
  function _e(e, n) {
    return typeof i.copy == "boolean" ? i.copy : i.copy(e, n);
  }
}
function R(r, t, l, u) {
  var c = {
    mouseup: "touchend",
    mousedown: "touchstart",
    mousemove: "touchmove"
  }, a = {
    mouseup: "pointerup",
    mousedown: "pointerdown",
    mousemove: "pointermove"
  }, m = {
    mouseup: "MSPointerUp",
    mousedown: "MSPointerDown",
    mousemove: "MSPointerMove"
  };
  global.navigator.pointerEnabled ? B[t](r, a[l], u) : global.navigator.msPointerEnabled ? B[t](r, m[l], u) : (B[t](r, c[l], u), B[t](r, l, u));
}
function ue(r) {
  if (r.touches !== void 0)
    return r.touches.length;
  if (r.which !== void 0 && r.which !== 0)
    return r.which;
  if (r.buttons !== void 0)
    return r.buttons;
  var t = r.button;
  if (t !== void 0)
    return t & 1 ? 1 : t & 2 ? 3 : t & 4 ? 2 : 0;
}
function ze(r) {
  var t = r.getBoundingClientRect();
  return {
    left: t.left + ce("scrollLeft", "pageXOffset"),
    top: t.top + ce("scrollTop", "pageYOffset")
  };
}
function ce(r, t) {
  return typeof global[t] < "u" ? global[t] : C.clientHeight ? C[r] : x.body[r];
}
function fe(r, t, l) {
  r = r || {};
  var u = r.className || "", c;
  return r.className += " gu-hide", c = x.elementFromPoint(t, l), r.className = u, c;
}
function Ke() {
  return !1;
}
function le() {
  return !0;
}
function se(r) {
  return r.width || r.right - r.left;
}
function ve(r) {
  return r.height || r.bottom - r.top;
}
function h(r) {
  return r.parentNode === x ? null : r.parentNode;
}
function de(r) {
  return r.tagName === "INPUT" || r.tagName === "TEXTAREA" || r.tagName === "SELECT" || ge(r);
}
function ge(r) {
  return !r || r.contentEditable === "false" ? !1 : r.contentEditable === "true" ? !0 : ge(h(r));
}
function D(r) {
  return r.nextElementSibling || t();
  function t() {
    var l = r;
    do
      l = l.nextSibling;
    while (l && l.nodeType !== 1);
    return l;
  }
}
function Le(r) {
  return r.targetTouches && r.targetTouches.length ? r.targetTouches[0] : r.changedTouches && r.changedTouches.length ? r.changedTouches[0] : r;
}
function M(r, t) {
  var l = Le(t), u = {
    pageX: "clientX",
    // IE8
    pageY: "clientY"
    // IE8
  };
  return r in u && !(r in l) && u[r] in l && (r = u[r]), l[r];
}
export {
  Ge as default
};
