(() => {
	function Z(i) {
		let t = i({ css: (s, ...n) => s.raw[0] + n.join("") });
		if (document.adoptedStyleSheets === void 0) {
			let s = document.createElement("style");
			s.textContent = t, document.head.appendChild(s);
			return;
		}
		let e = new CSSStyleSheet;
		e.replaceSync(t), document.adoptedStyleSheets = [...document.adoptedStyleSheets, e];
	}
	
	function ye(i, t) {
		let e = i;
		for (; e;) {
			if (t(e)) {
				return e;
			}
			e = e.parentElement;
		}
	}
	
	function V(i, t) {
		let e = document.createTreeWalker(i, NodeFilter.SHOW_ELEMENT, t ? {
			acceptNode: s => {
				let n, o;
				return t(s, { skip: () => n = ! 0, reject: () => o = ! 0 }), n ? NodeFilter.FILTER_SKIP : o ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
			}
		} : {});
		return new qt(e);
	}
	
	var qt = class {
		constructor(t) {
			this.walker = t;
		}
		
		from(t) {
			return this.walker.currentNode = t, this;
		}
		
		first() {
			return this.walker.firstChild();
		}
		
		last() {
			return this.walker.lastChild();
		}
		
		next(t) {
			return this.walker.currentNode = t, this.walker.nextSibling();
		}
		
		nextOrFirst(t) {
			let e = this.next(t);
			return e || (this.walker.currentNode = this.walker.root, this.first());
		}
		
		prev(t) {
			return this.walker.currentNode = t, this.walker.previousSibling();
		}
		
		prevOrLast(t) {
			let e = this.prev(t);
			return e || (this.walker.currentNode = this.walker.root, this.last());
		}
		
		closest(t, e) {
			let s = this.from(t).walker;
			for (; s.currentNode;) {
				if (e(s.currentNode)) {
					return s.currentNode;
				}
				s.parentNode();
			}
		}
		
		contains(t) {
			return this.find(e => e === t);
		}
		
		find(t) {
			return this.walk((e, s) => {
				t(e) && s(e);
			});
		}
		
		findOrFirst(t) {
			return this.find(t) || (this.walker.currentNode = this.walker.root), this.first();
		}
		
		each(t) {
			this.walk(e => t(e));
		}
		
		some(t) {
			return !! this.find(t);
		}
		
		every(t) {
			let e = ! 0;
			return this.walk(s => {
				t(s) || (e = ! 1);
			}), e;
		}
		
		map(t) {
			let e = [];
			return this.walk(s => e.push(t(s))), e;
		}
		
		filter(t) {
			let e = [];
			return this.walk(s => t(s) && e.push(s)), e;
		}
		
		walk(t) {
			let e, s = this.walker, n;
			for (; s.nextNode() && (e = s.currentNode, t(e, o => n = o), n === void 0);) {
				
			}
			return n;
		}
	};
	
	function C(i, t) {
		customElements.define(`ui-${ i }`, t);
	}
	
	function w(i, t, e, s = {}) {
		return i.addEventListener(t, e, s), {
			off: () => i.removeEventListener(t, e), pause: n => {
				i.removeEventListener(t, e), n(), i.addEventListener(t, e);
			}
		};
	}
	
	function _e(i) {
		return [
			"a[href]",
			"area[href]",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"button:not([disabled])",
			"iframe",
			"object",
			"embed",
			"[tabindex]",
			"[contenteditable]"
		].some(e => i.matches(e)) && i.tabIndex >= 0;
	}
	
	function oi(i, t) {
		let e;
		return function() {
			let s = this, n = arguments;
			e || (i.apply(s, n), e = ! 0, setTimeout(() => e = ! 1, t));
		};
	}
	
	var Lt = "pointer";
	document.addEventListener("keydown", () => Lt = "keyboard", { capture: ! 0 });
	document.addEventListener("pointerdown", i => {
		Lt = i.pointerType === "mouse" ? "mouse" : "touch";
	}, { capture: ! 0 });
	
	function It() {
		return Lt === "keyboard";
	}
	
	function ri() {
		return Lt === "touch";
	}
	
	function Se(i, t) {
		i.addEventListener("keydown", e => {
			e.key.length === 1 && /[a-zA-Z]/.test(e.key) && (t(e.key), e.stopPropagation());
		});
	}
	
	function li(i, t) {
		return "lofi-" + (t ? t + "-" : "") + Math.random().toString(16).slice(2);
	}
	
	function q(i, t) {
		let e = i.hasAttribute("id") ? i.getAttribute("id") : li(i, t);
		return u(i, "id", e), i._x_bindings || (i._x_bindings = {}), i._x_bindings.id || (i._x_bindings.id = e), e;
	}
	
	function J() {
		let i = ! 1;
		return t => (...e) => {
			i || (i = ! 0, t(...e), i = ! 1);
		};
	}
	
	function ht(i, t, { gain: e, lose: s, focusable: n, safeArea: o }) {
		let r = ! 1;
		n && document.addEventListener("focusin", d => {
			It() && (i.contains(d.target) || t.contains(d.target) ? (r = ! 0, e()) : (r = ! 1, s()));
		});
		let a = () => {
		}, c = () => {
		}, h = () => {
			r = ! 1, s(), a(), c();
		}, p = () => {
			r = ! 1, a(), c();
		};
		return i.addEventListener("pointerenter", d => {
			ri() || r || (r = ! 0, e(), setTimeout(() => {
				let { safeArea: l, redraw: f, remove: b } = ai(i, t, d.clientX, d.clientY);
				a = b;
				let g, v = oi(m => {
					let x = t.getBoundingClientRect(), A = i.getBoundingClientRect(), _;
					switch (l.contains(m.target) && ci(A, x, m.clientX, m.clientY) ? _ = "safeArea" : t.contains(m.target) ? _ = "panel" : i.contains(m.target) ? _ = "trigger"
						: _ = "outside", g && clearTimeout(g), _) {
						case"outside":
							h();
							break;
						case"trigger":
							f(m.clientX, m.clientY);
							break;
						case"panel":
							a();
							break;
						case"safeArea":
							f(m.clientX, m.clientY), g = setTimeout(() => {
								h();
							}, 300);
							break;
						default:
							break;
					}
				}, 100);
				document.addEventListener("pointermove", v), c = () => document.removeEventListener("pointermove", v);
			}));
		}), { clear: p };
	}
	
	function ai(i, t, e, s) {
		let n = document.createElement("div"), o = t.getBoundingClientRect(), r = i.getBoundingClientRect();
		n.style.position = "fixed", u(n, "data-safe-area", "");
		let a = (c, h) => {
			if (o.top === 0 && o.bottom === 0) {
				return;
			}
			let p;
			o.left < r.left && (p = "left"), o.right > r.right && (p = "right"), o.top < r.top && o.bottom < h && (p = "up"), o.bottom > r.bottom && o.top > h && (p = "down"), p === void 0 && (p = "right");
			let d, l, f, b, g, v, m, x, A = 10;
			switch (p) {
				case"left":
					d = o.right, l = Math.max(o.right, c) + 5, f = l - d, b = Math.min(r.top, o.top) - A, g = Math.max(r.bottom, o.bottom) + A, v = g - b, m = h - b, x = `polygon(0% 0%, 100% ${ m }px, 0% 100%)`;
					break;
				case"right":
					d = Math.min(o.left, c) - 5, l = o.left, f = l - d, b = Math.min(r.top, o.top) - A, g = Math.max(r.bottom, o.bottom) + A, v = g - b, m = h - b, x = `polygon(0% ${ m }px, 100% 0%, 100% 100%)`;
					break;
				case"up":
					d = Math.min(c, o.left) - A, l = Math.max(c, o.right) + A, f = l - d, b = o.bottom, g = Math.max(o.bottom, h) + 5, v = g - b, m = c - d, x = `polygon(0% 0%, 100% 0%, ${ m }px 100%)`;
					break;
				case"down":
					d = Math.min(c, o.left) - A, l = Math.max(c, o.right) + A, f = l - d, b = Math.min(o.top, h) - 5, g = o.top, v = g - b, m = c - d, x = `polygon(${ m }px 0%, 100% 100%, 0% 100%)`;
					break;
			}
			n.style.left = `${ d }px`, n.style.top = `${ b }px`, n.style.width = `${ f }px`, n.style.height = `${ v }px`, n.style.clipPath = x;
		};
		return {
			safeArea: n, redraw: (c, h) => {
				n.isConnected || i.appendChild(n), a(c, h);
			}, remove: () => {
				n.remove();
			}
		};
	}
	
	function ci(i, t, e, s) {
		return ! ui(i, e, s) && ! hi(t, e, s);
	}
	
	function ui(i, t, e) {
		return i.left <= t && t <= i.right && i.top <= e && e <= i.bottom;
	}
	
	function hi(i, t, e) {
		return i.left <= t && t <= i.right && i.top <= e && e <= i.bottom;
	}
	
	function u(i, t, e) {
		i._durableAttributeObserver === void 0 && (i._durableAttributeObserver = ke(i, [t])), i._durableAttributeObserver.hasAttribute(t) || i._durableAttributeObserver.addAttribute(t), i._durableAttributeObserver.pause(() => {
			i.setAttribute(t, e);
		});
	}
	
	function y(i, t) {
		i._durableAttributeObserver === void 0 && (i._durableAttributeObserver = ke(i, [t])), i._durableAttributeObserver.hasAttribute(t) || i._durableAttributeObserver.addAttribute(t), i._durableAttributeObserver.pause(() => {
			i.removeAttribute(t);
		});
	}
	
	function ke(i, t) {
		let e = n => {
			n.forEach(o => {
				o.oldValue === null ? i._durableAttributeObserver.pause(() => y(i, o.attributeName)) : i._durableAttributeObserver.pause(() => u(i, o.attributeName, o.oldValue));
			});
		}, s = new MutationObserver(n => e(n));
		return s.observe(i, { attributeFilter: t, attributeOldValue: ! 0 }), {
			attributes: t, hasAttribute(n) {
				return this.attributes.includes(n);
			}, addAttribute(n) {
				this.attributes.includes(n) || this.attributes.push(n), s.observe(i, { attributeFilter: this.attributes, attributeOldValue: ! 0 });
			}, pause(n) {
				e(s.takeRecords()), s.disconnect(), n(), s.observe(i, { attributeFilter: this.attributes, attributeOldValue: ! 0 });
			}
		};
	}
	
	var S = class extends HTMLElement {
		constructor() {
			super(), this.boot?.();
		}
		
		connectedCallback() {
			queueMicrotask(() => {
				this.mount?.();
			});
		}
		
		mixin(t, e = {}) {
			return new t(this, e);
		}
		
		appendMixin(t, e = {}) {
			return new t(this, e);
		}
		
		use(t) {
			let e;
			return this.mixins.forEach(s => {
				s instanceof t && (e = s);
			}), e;
		}
		
		uses(t) {
			let e;
			return this.mixins.forEach(s => {
				s instanceof t && (e = ! 0);
			}), !! e;
		}
		
		on(t, e) {
			return w(this, t, e);
		}
		
		root(t, e = {}) {
			if (t === void 0) {
				return this.__root;
			}
			let s = document.createElement(t);
			for (let o in e) {
				setAttribute(s, o, e[o]);
			}
			let n = this.attachShadow({ mode: "open" });
			return s.appendChild(document.createElement("slot")), n.appendChild(s), this.__root = s, this.__root;
		}
	}, Mt = class extends S {
	};
	var O = class {
		constructor(t, e = {}) {
			this.el = t, this.grouped = e.grouped === void 0, this.el.mixins = this.el.mixins ? this.el.mixins
				: new Map, this.el.mixins.set(this.constructor.name, this), this.el[this.constructor.name] = ! 0, this.el.use || (this.el.use = S.prototype.use.bind(this.el)), this.opts = e, this.boot?.({
				options: s => {
					let n = s;
					Object.entries(this.opts).forEach(([o, r]) => {
						r !== void 0 && (n[o] = r);
					}), this.opts = n;
				}
			}), queueMicrotask(() => {
				this.mount?.();
			});
		}
		
		options() {
			return this.opts;
		}
		
		hasGroup() {
			return !! this.group();
		}
		
		group() {
			if (this.grouped !== ! 1) {
				return ye(this.el, t => t[this.groupedByType.name])?.use(this.groupedByType);
			}
		}
		
		on(t, e) {
			return w(this.el, t, e);
		}
	}, I = class extends O {
		constructor(t, e = {}) {
			super(t, e);
		}
		
		walker() {
			return V(this.el, (t, { skip: e, reject: s }) => {
				if (t[this.constructor.name] && t !== this.el) {
					return s();
				}
				if (! t[this.groupOfType.name] || ! t.mixins.get(this.groupOfType.name).grouped) {
					return e();
				}
			});
		}
	};
	var H = class extends O {
		boot({ options: t }) {
			this.initialState = this.el.value, this.getterFunc = () => {
			}, this.setterFunc = e => this.initialState = e, Object.defineProperty(this.el, "value", {
				get: () => this.getterFunc(), set: e => {
					this.setterFunc(e);
				}
			});
		}
		
		initial(t) {
			t(this.initialState);
		}
		
		getter(t) {
			this.getterFunc = t;
		}
		
		setter(t) {
			this.setterFunc = t;
		}
		
		dispatch() {
			this.el.dispatchEvent(new Event("input", { bubbles: ! 1, cancelable: ! 0 })), this.el.dispatchEvent(new Event("change", { bubbles: ! 1, cancelable: ! 0 }));
		}
	};
	var Ht = new Set, R = class extends O {
		boot({ options: t }) {
			t({ trigger: null }), u(this.el, "popover", "manual"), this.trigger = this.options().trigger, this.onChanges = [], this.state = ! 1, w(this.el, "beforetoggle", e => {
				let s = this.state;
				if (this.state = e.newState === "open", this.state) {
					fi(this.el, Ht);
					let n = new AbortController, o = document.activeElement;
					setTimeout(() => {
						di(this.el, o, n), pi(this.el, o, n), bi(this.el, o, n);
					}), this.el.addEventListener("beforetoggle", r => {
						r.newState === "closed" && (n.abort(), o.focus());
					}, { signal: n.signal });
				}
				s !== this.state && this.onChanges.forEach(n => n(this.state, s));
			}), w(this.el, "toggle", e => {
				e.newState === "open" && Ht.add(this.el), e.newState === "closed" && Ht.delete(this.el);
			});
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		setState(t) {
			t ? this.show() : this.hide();
		}
		
		getState() {
			return this.state;
		}
		
		toggle() {
			this.el.togglePopover();
		}
		
		show() {
			this.el.showPopover();
		}
		
		hide() {
			this.el.hidePopover();
		}
	};
	
	function fi(i, t) {
		t.forEach(e => {
			i.contains(e) || e.contains(i) || e.hidePopover();
		});
	}
	
	function di(i, t, e) {
		document.addEventListener("click", s => {
			i.contains(s.target) || t === s.target || i.hidePopover();
		}, { signal: e.signal });
	}
	
	function pi(i, t, e) {
		document.addEventListener("focusin", s => {
			i.contains(s.target) || t === s.target || (e.abort(), i.hidePopover());
		}, { capture: ! 0, signal: e.signal });
	}
	
	function bi(i, t, e) {
		document.addEventListener("keydown", s => {
			s.key === "Escape" && i.hidePopover();
		}, { signal: e.signal });
	}
	
	var $ = Math.min, P = Math.max, xt = Math.round, At = Math.floor, j = i => ({ x: i, y: i }), mi = { left: "right", right: "left", bottom: "top", top: "bottom" },
		gi = { start: "end", end: "start" };
	
	function $t(i, t, e) {
		return P(i, $(t, e));
	}
	
	function ft(i, t) {
		return typeof i == "function" ? i(t) : i;
	}
	
	function G(i) {
		return i.split("-")[0];
	}
	
	function dt(i) {
		return i.split("-")[1];
	}
	
	function zt(i) {
		return i === "x" ? "y" : "x";
	}
	
	function jt(i) {
		return i === "y" ? "height" : "width";
	}
	
	function Q(i) {
		return ["top", "bottom"].includes(G(i)) ? "y" : "x";
	}
	
	function Gt(i) {
		return zt(Q(i));
	}
	
	function Ce(i, t, e) {
		e === void 0 && (e = ! 1);
		let s = dt(i), n = Gt(i), o = jt(n), r = n === "x" ? s === (e ? "end" : "start") ? "right" : "left" : s === "start" ? "bottom" : "top";
		return t.reference[o] > t.floating[o] && (r = wt(r)), [r, wt(r)];
	}
	
	function Ee(i) {
		let t = wt(i);
		return [Rt(i), t, Rt(t)];
	}
	
	function Rt(i) {
		return i.replace(/start|end/g, t => gi[t]);
	}
	
	function vi(i, t, e) {
		let s = ["left", "right"], n = ["right", "left"], o = ["top", "bottom"], r = ["bottom", "top"];
		switch (i) {
			case"top":
			case"bottom":
				return e ? t ? n : s : t ? s : n;
			case"left":
			case"right":
				return t ? o : r;
			default:
				return [];
		}
	}
	
	function Oe(i, t, e, s) {
		let n = dt(i), o = vi(G(i), e === "start", s);
		return n && (o = o.map(r => r + "-" + n), t && (o = o.concat(o.map(Rt)))), o;
	}
	
	function wt(i) {
		return i.replace(/left|right|bottom|top/g, t => mi[t]);
	}
	
	function wi(i) {
		return { top: 0, right: 0, bottom: 0, left: 0, ...i };
	}
	
	function Te(i) {
		return typeof i != "number" ? wi(i) : { top: i, right: i, bottom: i, left: i };
	}
	
	function nt(i) {
		let { x: t, y: e, width: s, height: n } = i;
		return { width: s, height: n, top: e, left: t, right: t + s, bottom: e + n, x: t, y: e };
	}
	
	function Pe(i, t, e) {
		let { reference: s, floating: n } = i, o = Q(t), r = Gt(t), a = jt(r), c = G(t), h = o === "y", p = s.x + s.width / 2 - n.width / 2, d = s.y + s.height / 2 - n.height / 2,
			l = s[a] / 2 - n[a] / 2, f;
		switch (c) {
			case"top":
				f = { x: p, y: s.y - n.height };
				break;
			case"bottom":
				f = { x: p, y: s.y + s.height };
				break;
			case"right":
				f = { x: s.x + s.width, y: d };
				break;
			case"left":
				f = { x: s.x - n.width, y: d };
				break;
			default:
				f = { x: s.x, y: s.y };
		}
		switch (dt(t)) {
			case"start":
				f[r] -= l * (e && h ? -1 : 1);
				break;
			case"end":
				f[r] += l * (e && h ? -1 : 1);
				break;
		}
		return f;
	}
	
	var Le = async (i, t, e) => {
		let { placement: s = "bottom", strategy: n = "absolute", middleware: o = [], platform: r } = e, a = o.filter(Boolean), c = await (r.isRTL == null ? void 0 : r.isRTL(t)),
			h = await r.getElementRects({ reference: i, floating: t, strategy: n }), { x: p, y: d } = Pe(h, s, c), l = s, f = {}, b = 0;
		for (let g = 0; g < a.length; g++) {
			let { name: v, fn: m } = a[g], { x, y: A, data: _, reset: k } = await m({
				x: p,
				y: d,
				initialPlacement: s,
				placement: l,
				strategy: n,
				middlewareData: f,
				rects: h,
				platform: r,
				elements: { reference: i, floating: t }
			});
			p = x ?? p, d = A ?? d, f = { ...f, [v]: { ...f[v], ..._ } }, k && b <= 50 && (b++, typeof k == "object" && (k.placement && (l = k.placement), k.rects && (h = k.rects === ! 0
				? await r.getElementRects({ reference: i, floating: t, strategy: n }) : k.rects), { x: p, y: d } = Pe(h, l, c)), g = -1);
		}
		return { x: p, y: d, placement: l, strategy: n, middlewareData: f };
	};
	
	async function Ft(i, t) {
		var e;
		t === void 0 && (t = {});
		let { x: s, y: n, platform: o, rects: r, elements: a, strategy: c } = i, {
				boundary: h = "clippingAncestors",
				rootBoundary: p = "viewport",
				elementContext: d = "floating",
				altBoundary: l = ! 1,
				padding: f = 0
			} = ft(t, i), b = Te(f), v = a[l ? d === "floating" ? "reference" : "floating" : d], m = nt(await o.getClippingRect({
				element: (e = await (o.isElement == null ? void 0 : o.isElement(v))) == null || e ? v : v.contextElement || await (o.getDocumentElement == null ? void 0
					: o.getDocumentElement(a.floating)), boundary: h, rootBoundary: p, strategy: c
			})), x = d === "floating" ? { x: s, y: n, width: r.floating.width, height: r.floating.height } : r.reference, A = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)),
			_ = await (o.isElement == null ? void 0 : o.isElement(A)) ? await (o.getScale == null ? void 0 : o.getScale(A)) || { x: 1, y: 1 } : { x: 1, y: 1 },
			k = nt(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({ elements: a, rect: x, offsetParent: A, strategy: c }) : x);
		return { top: (m.top - k.top + b.top) / _.y, bottom: (k.bottom - m.bottom + b.bottom) / _.y, left: (m.left - k.left + b.left) / _.x, right: (k.right - m.right + b.right) / _.x };
	}
	
	var Me = function(i) {
		return i === void 0 && (i = {}), {
			name: "flip", options: i, async fn(t) {
				var e, s;
				let { placement: n, middlewareData: o, rects: r, initialPlacement: a, platform: c, elements: h } = t, {
					mainAxis: p = ! 0,
					crossAxis: d = ! 0,
					fallbackPlacements: l,
					fallbackStrategy: f = "bestFit",
					fallbackAxisSideDirection: b = "none",
					flipAlignment: g = ! 0,
					...v
				} = ft(i, t);
				if ((e = o.arrow) != null && e.alignmentOffset) {
					return {};
				}
				let m = G(n), x = Q(a), A = G(a) === a, _ = await (c.isRTL == null ? void 0 : c.isRTL(h.floating)), k = l || (A || ! g ? [wt(a)] : Ee(a)), B = b !== "none";
				! l && B && k.push(...Oe(a, g, b, _));
				let Pt = [a, ...k], ct = await Ft(t, v), it = [], X = ((s = o.flip) == null ? void 0 : s.overflows) || [];
				if (p && it.push(ct[m]), d) {
					let st = Ce(n, r, _);
					it.push(ct[st[0]], ct[st[1]]);
				}
				if (X = [...X, { placement: n, overflows: it }], ! it.every(st => st <= 0)) {
					var gt, we;
					let st = (((gt = o.flip) == null ? void 0 : gt.index) || 0) + 1, Ae = Pt[st];
					if (Ae) {
						return { data: { index: st, overflows: X }, reset: { placement: Ae } };
					}
					let vt = (we = X.filter(ut => ut.overflows[0] <= 0).sort((ut, K) => ut.overflows[1] - K.overflows[1])[0]) == null ? void 0 : we.placement;
					if (! vt) {
						switch (f) {
							case"bestFit": {
								var xe;
								let ut = (xe = X.filter(K => {
									if (B) {
										let U = Q(K.placement);
										return U === x || U === "y";
									}
									return ! 0;
								}).map(K => [K.placement, K.overflows.filter(U => U > 0).reduce((U, ni) => U + ni, 0)]).sort((K, U) => K[1] - U[1])[0]) == null ? void 0 : xe[0];
								ut && (vt = ut);
								break;
							}
							case"initialPlacement":
								vt = a;
								break;
						}
					}
					if (n !== vt) {
						return { reset: { placement: vt } };
					}
				}
				return {};
			}
		};
	};
	
	async function xi(i, t) {
		let { placement: e, platform: s, elements: n } = i, o = await (s.isRTL == null ? void 0 : s.isRTL(n.floating)), r = G(e), a = dt(e), c = Q(e) === "y", h = ["left", "top"].includes(r) ? -1 : 1,
			p = o && c ? -1 : 1, d = ft(t, i), { mainAxis: l, crossAxis: f, alignmentAxis: b } = typeof d == "number" ? { mainAxis: d, crossAxis: 0, alignmentAxis: null } : {
				mainAxis: 0,
				crossAxis: 0,
				alignmentAxis: null, ...d
			};
		return a && typeof b == "number" && (f = a === "end" ? b * -1 : b), c ? { x: f * p, y: l * h } : { x: l * h, y: f * p };
	}
	
	var Re = function(i) {
		return i === void 0 && (i = 0), {
			name: "offset", options: i, async fn(t) {
				var e, s;
				let { x: n, y: o, placement: r, middlewareData: a } = t, c = await xi(t, i);
				return r === ((e = a.offset) == null ? void 0 : e.placement) && (s = a.arrow) != null && s.alignmentOffset ? {} : { x: n + c.x, y: o + c.y, data: { ...c, placement: r } };
			}
		};
	}, Fe = function(i) {
		return i === void 0 && (i = {}), {
			name: "shift", options: i, async fn(t) {
				let { x: e, y: s, placement: n } = t, {
					mainAxis: o = ! 0, crossAxis: r = ! 1, limiter: a = {
						fn: v => {
							let { x: m, y: x } = v;
							return { x: m, y: x };
						}
					}, ...c
				} = ft(i, t), h = { x: e, y: s }, p = await Ft(t, c), d = Q(G(n)), l = zt(d), f = h[l], b = h[d];
				if (o) {
					let v = l === "y" ? "top" : "left", m = l === "y" ? "bottom" : "right", x = f + p[v], A = f - p[m];
					f = $t(x, f, A);
				}
				if (r) {
					let v = d === "y" ? "top" : "left", m = d === "y" ? "bottom" : "right", x = b + p[v], A = b - p[m];
					b = $t(x, b, A);
				}
				let g = a.fn({ ...t, [l]: f, [d]: b });
				return { ...g, data: { x: g.x - e, y: g.y - s } };
			}
		};
	};
	var De = function(i) {
		return i === void 0 && (i = {}), {
			name: "size", options: i, async fn(t) {
				let { placement: e, rects: s, platform: n, elements: o } = t, {
					apply: r = () => {
					}, ...a
				} = ft(i, t), c = await Ft(t, a), h = G(e), p = dt(e), d = Q(e) === "y", { width: l, height: f } = s.floating, b, g;
				h === "top" || h === "bottom" ? (b = h, g = p === (await (n.isRTL == null ? void 0 : n.isRTL(o.floating)) ? "start" : "end") ? "left" : "right") : (g = h, b = p === "end" ? "top"
					: "bottom");
				let v = f - c.top - c.bottom, m = l - c.left - c.right, x = $(f - c[b], v), A = $(l - c[g], m), _ = ! t.middlewareData.shift, k = x, B = A;
				if (d ? B = p || _ ? $(A, m) : m : k = p || _ ? $(x, v) : v, _ && ! p) {
					let ct = P(c.left, 0), it = P(c.right, 0), X = P(c.top, 0), gt = P(c.bottom, 0);
					d ? B = l - 2 * (ct !== 0 || it !== 0 ? ct + it : P(c.left, c.right)) : k = f - 2 * (X !== 0 || gt !== 0 ? X + gt : P(c.top, c.bottom));
				}
				await r({ ...t, availableWidth: B, availableHeight: k });
				let Pt = await n.getDimensions(o.floating);
				return l !== Pt.width || f !== Pt.height ? { reset: { rects: ! 0 } } : {};
			}
		};
	};
	
	function ot(i) {
		return We(i) ? (i.nodeName || "").toLowerCase() : "#document";
	}
	
	function M(i) {
		var t;
		return (i == null || (t = i.ownerDocument) == null ? void 0 : t.defaultView) || window;
	}
	
	function z(i) {
		var t;
		return (t = (We(i) ? i.ownerDocument : i.document) || window.document) == null ? void 0 : t.documentElement;
	}
	
	function We(i) {
		return i instanceof Node || i instanceof M(i).Node;
	}
	
	function F(i) {
		return i instanceof Element || i instanceof M(i).Element;
	}
	
	function W(i) {
		return i instanceof HTMLElement || i instanceof M(i).HTMLElement;
	}
	
	function Ne(i) {
		return typeof ShadowRoot > "u" ? ! 1 : i instanceof ShadowRoot || i instanceof M(i).ShadowRoot;
	}
	
	function bt(i) {
		let { overflow: t, overflowX: e, overflowY: s, display: n } = D(i);
		return /auto|scroll|overlay|hidden|clip/.test(t + s + e) && ! ["inline", "contents"].includes(n);
	}
	
	function Be(i) {
		return ["table", "td", "th"].includes(ot(i));
	}
	
	function yt(i) {
		return [":popover-open", ":modal"].some(t => {
			try {
				return i.matches(t);
			} catch {
				return ! 1;
			}
		});
	}
	
	function Dt(i) {
		let t = Nt(), e = F(i) ? D(i) : i;
		return e.transform !== "none" || e.perspective !== "none" || (e.containerType ? e.containerType !== "normal" : ! 1) || ! t && (e.backdropFilter ? e.backdropFilter !== "none"
			: ! 1) || ! t && (e.filter ? e.filter !== "none" : ! 1) || ["transform", "perspective", "filter"].some(s => (e.willChange || "").includes(s)) || [
			"paint",
			"layout",
			"strict",
			"content"
		].some(s => (e.contain || "").includes(s));
	}
	
	function Ve(i) {
		let t = Y(i);
		for (; W(t) && ! rt(t);) {
			if (Dt(t)) {
				return t;
			}
			if (yt(t)) {
				return null;
			}
			t = Y(t);
		}
		return null;
	}
	
	function Nt() {
		return typeof CSS > "u" || ! CSS.supports ? ! 1 : CSS.supports("-webkit-backdrop-filter", "none");
	}
	
	function rt(i) {
		return ["html", "body", "#document"].includes(ot(i));
	}
	
	function D(i) {
		return M(i).getComputedStyle(i);
	}
	
	function _t(i) {
		return F(i) ? { scrollLeft: i.scrollLeft, scrollTop: i.scrollTop } : { scrollLeft: i.scrollX, scrollTop: i.scrollY };
	}
	
	function Y(i) {
		if (ot(i) === "html") {
			return i;
		}
		let t = i.assignedSlot || i.parentNode || Ne(i) && i.host || z(i);
		return Ne(t) ? t.host : t;
	}
	
	function qe(i) {
		let t = Y(i);
		return rt(t) ? i.ownerDocument ? i.ownerDocument.body : i.body : W(t) && bt(t) ? t : qe(t);
	}
	
	function pt(i, t, e) {
		var s;
		t === void 0 && (t = []), e === void 0 && (e = ! 0);
		let n = qe(i), o = n === ((s = i.ownerDocument) == null ? void 0 : s.body), r = M(n);
		if (o) {
			let a = Wt(r);
			return t.concat(r, r.visualViewport || [], bt(n) ? n : [], a && e ? pt(a) : []);
		}
		return t.concat(n, pt(n, [], e));
	}
	
	function Wt(i) {
		return i.parent && Object.getPrototypeOf(i.parent) ? i.frameElement : null;
	}
	
	function $e(i) {
		let t = D(i), e = parseFloat(t.width) || 0, s = parseFloat(t.height) || 0, n = W(i), o = n ? i.offsetWidth : e, r = n ? i.offsetHeight : s, a = xt(e) !== o || xt(s) !== r;
		return a && (e = o, s = r), { width: e, height: s, $: a };
	}
	
	function Xt(i) {
		return F(i) ? i : i.contextElement;
	}
	
	function mt(i) {
		let t = Xt(i);
		if (! W(t)) {
			return j(1);
		}
		let e = t.getBoundingClientRect(), { width: s, height: n, $: o } = $e(t), r = (o ? xt(e.width) : e.width) / s, a = (o ? xt(e.height) : e.height) / n;
		return (! r || ! Number.isFinite(r)) && (r = 1), (! a || ! Number.isFinite(a)) && (a = 1), { x: r, y: a };
	}
	
	var Ai = j(0);
	
	function ze(i) {
		let t = M(i);
		return ! Nt() || ! t.visualViewport ? Ai : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
	}
	
	function yi(i, t, e) {
		return t === void 0 && (t = ! 1), ! e || t && e !== M(i) ? ! 1 : t;
	}
	
	function lt(i, t, e, s) {
		t === void 0 && (t = ! 1), e === void 0 && (e = ! 1);
		let n = i.getBoundingClientRect(), o = Xt(i), r = j(1);
		t && (s ? F(s) && (r = mt(s)) : r = mt(i));
		let a = yi(o, e, s) ? ze(o) : j(0), c = (n.left + a.x) / r.x, h = (n.top + a.y) / r.y, p = n.width / r.x, d = n.height / r.y;
		if (o) {
			let l = M(o), f = s && F(s) ? M(s) : s, b = l, g = Wt(b);
			for (; g && s && f !== b;) {
				let v = mt(g), m = g.getBoundingClientRect(), x = D(g), A = m.left + (g.clientLeft + parseFloat(x.paddingLeft)) * v.x, _ = m.top + (g.clientTop + parseFloat(x.paddingTop)) * v.y;
				c *= v.x, h *= v.y, p *= v.x, d *= v.y, c += A, h += _, b = M(g), g = Wt(b);
			}
		}
		return nt({ width: p, height: d, x: c, y: h });
	}
	
	function _i(i) {
		let { elements: t, rect: e, offsetParent: s, strategy: n } = i, o = n === "fixed", r = z(s), a = t ? yt(t.floating) : ! 1;
		if (s === r || a && o) {
			return e;
		}
		let c = { scrollLeft: 0, scrollTop: 0 }, h = j(1), p = j(0), d = W(s);
		if ((d || ! d && ! o) && ((ot(s) !== "body" || bt(r)) && (c = _t(s)), W(s))) {
			let l = lt(s);
			h = mt(s), p.x = l.x + s.clientLeft, p.y = l.y + s.clientTop;
		}
		return { width: e.width * h.x, height: e.height * h.y, x: e.x * h.x - c.scrollLeft * h.x + p.x, y: e.y * h.y - c.scrollTop * h.y + p.y };
	}
	
	function Si(i) {
		return Array.from(i.getClientRects());
	}
	
	function je(i) {
		return lt(z(i)).left + _t(i).scrollLeft;
	}
	
	function ki(i) {
		let t = z(i), e = _t(i), s = i.ownerDocument.body, n = P(t.scrollWidth, t.clientWidth, s.scrollWidth, s.clientWidth), o = P(t.scrollHeight, t.clientHeight, s.scrollHeight, s.clientHeight),
			r = -e.scrollLeft + je(i), a = -e.scrollTop;
		return D(s).direction === "rtl" && (r += P(t.clientWidth, s.clientWidth) - n), { width: n, height: o, x: r, y: a };
	}
	
	function Ci(i, t) {
		let e = M(i), s = z(i), n = e.visualViewport, o = s.clientWidth, r = s.clientHeight, a = 0, c = 0;
		if (n) {
			o = n.width, r = n.height;
			let h = Nt();
			(! h || h && t === "fixed") && (a = n.offsetLeft, c = n.offsetTop);
		}
		return { width: o, height: r, x: a, y: c };
	}
	
	function Ei(i, t) {
		let e = lt(i, ! 0, t === "fixed"), s = e.top + i.clientTop, n = e.left + i.clientLeft, o = W(i) ? mt(i) : j(1), r = i.clientWidth * o.x, a = i.clientHeight * o.y, c = n * o.x, h = s * o.y;
		return { width: r, height: a, x: c, y: h };
	}
	
	function Ie(i, t, e) {
		let s;
		if (t === "viewport") {
			s = Ci(i, e);
		} else if (t === "document") {
			s = ki(z(i));
		} else if (F(t)) {
			s = Ei(t, e);
		} else {
			let n = ze(i);
			s = { ...t, x: t.x - n.x, y: t.y - n.y };
		}
		return nt(s);
	}
	
	function Ge(i, t) {
		let e = Y(i);
		return e === t || ! F(e) || rt(e) ? ! 1 : D(e).position === "fixed" || Ge(e, t);
	}
	
	function Oi(i, t) {
		let e = t.get(i);
		if (e) {
			return e;
		}
		let s = pt(i, [], ! 1).filter(a => F(a) && ot(a) !== "body"), n = null, o = D(i).position === "fixed", r = o ? Y(i) : i;
		for (; F(r) && ! rt(r);) {
			let a = D(r), c = Dt(r);
			! c && a.position === "fixed" && (n = null), (o ? ! c && ! n : ! c && a.position === "static" && !! n && ["absolute", "fixed"].includes(n.position) || bt(r) && ! c && Ge(i, r))
				? s = s.filter(p => p !== r) : n = a, r = Y(r);
		}
		return t.set(i, s), s;
	}
	
	function Ti(i) {
		let { element: t, boundary: e, rootBoundary: s, strategy: n } = i, r = [...e === "clippingAncestors" ? yt(t) ? [] : Oi(t, this._c) : [].concat(e), s], a = r[0], c = r.reduce((h, p) => {
			let d = Ie(t, p, n);
			return h.top = P(d.top, h.top), h.right = $(d.right, h.right), h.bottom = $(d.bottom, h.bottom), h.left = P(d.left, h.left), h;
		}, Ie(t, a, n));
		return { width: c.right - c.left, height: c.bottom - c.top, x: c.left, y: c.top };
	}
	
	function Pi(i) {
		let { width: t, height: e } = $e(i);
		return { width: t, height: e };
	}
	
	function Li(i, t, e) {
		let s = W(t), n = z(t), o = e === "fixed", r = lt(i, ! 0, o, t), a = { scrollLeft: 0, scrollTop: 0 }, c = j(0);
		if (s || ! s && ! o) {
			if ((ot(t) !== "body" || bt(n)) && (a = _t(t)), s) {
				let d = lt(t, ! 0, o, t);
				c.x = d.x + t.clientLeft, c.y = d.y + t.clientTop;
			} else {
				n && (c.x = je(n));
			}
		}
		let h = r.left + a.scrollLeft - c.x, p = r.top + a.scrollTop - c.y;
		return { x: h, y: p, width: r.width, height: r.height };
	}
	
	function Yt(i) {
		return D(i).position === "static";
	}
	
	function He(i, t) {
		return ! W(i) || D(i).position === "fixed" ? null : t ? t(i) : i.offsetParent;
	}
	
	function Ye(i, t) {
		let e = M(i);
		if (yt(i)) {
			return e;
		}
		if (! W(i)) {
			let n = Y(i);
			for (; n && ! rt(n);) {
				if (F(n) && ! Yt(n)) {
					return n;
				}
				n = Y(n);
			}
			return e;
		}
		let s = He(i, t);
		for (; s && Be(s) && Yt(s);) {
			s = He(s, t);
		}
		return s && rt(s) && Yt(s) && ! Dt(s) ? e : s || Ve(i) || e;
	}
	
	var Mi = async function(i) {
		let t = this.getOffsetParent || Ye, e = this.getDimensions, s = await e(i.floating);
		return { reference: Li(i.reference, await t(i.floating), i.strategy), floating: { x: 0, y: 0, width: s.width, height: s.height } };
	};
	
	function Ri(i) {
		return D(i).direction === "rtl";
	}
	
	var Fi = {
		convertOffsetParentRelativeRectToViewportRelativeRect: _i,
		getDocumentElement: z,
		getClippingRect: Ti,
		getOffsetParent: Ye,
		getElementRects: Mi,
		getClientRects: Si,
		getDimensions: Pi,
		getScale: mt,
		isElement: F,
		isRTL: Ri
	};
	
	function Di(i, t) {
		let e = null, s, n = z(i);
		
		function o() {
			var a;
			clearTimeout(s), (a = e) == null || a.disconnect(), e = null;
		}
		
		function r(a, c) {
			a === void 0 && (a = ! 1), c === void 0 && (c = 1), o();
			let { left: h, top: p, width: d, height: l } = i.getBoundingClientRect();
			if (a || t(), ! d || ! l) {
				return;
			}
			let f = At(p), b = At(n.clientWidth - (h + d)), g = At(n.clientHeight - (p + l)), v = At(h),
				x = { rootMargin: -f + "px " + -b + "px " + -g + "px " + -v + "px", threshold: P(0, $(1, c)) || 1 }, A = ! 0;
			
			function _(k) {
				let B = k[0].intersectionRatio;
				if (B !== c) {
					if (! A) {
						return r();
					}
					B ? r(! 1, B) : s = setTimeout(() => {
						r(! 1, 1e-7);
					}, 1e3);
				}
				A = ! 1;
			}
			
			try {
				e = new IntersectionObserver(_, { ...x, root: n.ownerDocument });
			} catch {
				e = new IntersectionObserver(_, x);
			}
			e.observe(i);
		}
		
		return r(! 0), o;
	}
	
	function Xe(i, t, e, s) {
		s === void 0 && (s = {});
		let {
			ancestorScroll: n = ! 0,
			ancestorResize: o = ! 0,
			elementResize: r = typeof ResizeObserver == "function",
			layoutShift: a = typeof IntersectionObserver == "function",
			animationFrame: c = ! 1
		} = s, h = Xt(i), p = n || o ? [...h ? pt(h) : [], ...pt(t)] : [];
		p.forEach(m => {
			n && m.addEventListener("scroll", e, { passive: ! 0 }), o && m.addEventListener("resize", e);
		});
		let d = h && a ? Di(h, e) : null, l = -1, f = null;
		r && (f = new ResizeObserver(m => {
			let [x] = m;
			x && x.target === h && f && (f.unobserve(t), cancelAnimationFrame(l), l = requestAnimationFrame(() => {
				var A;
				(A = f) == null || A.observe(t);
			})), e();
		}), h && ! c && f.observe(h), f.observe(t));
		let b, g = c ? lt(i) : null;
		c && v();
		
		function v() {
			let m = lt(i);
			g && (m.x !== g.x || m.y !== g.y || m.width !== g.width || m.height !== g.height) && e(), g = m, b = requestAnimationFrame(v);
		}
		
		return e(), () => {
			var m;
			p.forEach(x => {
				n && x.removeEventListener("scroll", e), o && x.removeEventListener("resize", e);
			}), d?.(), (m = f) == null || m.disconnect(), f = null, c && cancelAnimationFrame(b);
		};
	}
	
	var Ke = Re;
	var Ue = Fe, Ze = Me, Je = De;
	var Qe = (i, t, e) => {
		let s = new Map, n = { platform: Fi, ...e }, o = { ...n.platform, _c: s };
		return Le(i, t, { ...n, platform: o });
	};
	var N = class extends O {
		boot({ options: t }) {
			if (t({ reference: null, auto: ! 0, position: "bottom start", gap: "5", offset: "0", matchWidth: ! 1 }), this.options().reference === null || this.options().position === null) {
				return;
			}
			let [e, s] = Bi(this.el),
				n = Ni(this.el, this.options().reference, e, { position: this.options().position, gap: this.options().gap, offset: this.options().offset, matchWidth: this.options().matchWidth }),
				o = () => {
				};
			this.reposition = (...r) => {
				this.options().auto ? o = Xe(this.options().reference, this.el, n, { ancestorScroll: ! 0, ancestorResize: ! 0, elementResize: ! 0, layoutShift: ! 0, animationFrame: ! 0 }) : n(...r);
			}, this.cleanup = () => {
				o(), s();
			};
		}
	};
	
	function Ni(i, t, e, { position: s, offset: n, gap: o, matchWidth: r }) {
		return (a = null, c = null) => {
			Qe(t, i, {
				placement: Wi(s), middleware: [
					Ze(), Ue({ padding: 5, crossAxis: ! 0 }), Ke({ mainAxis: Number(o), alignmentAxis: Number(n) }), r ? Je({
						apply({ rects: h, elements: p }) {
							Object.assign(p.floating.style, { width: `${ h.reference.width }px` });
						}
					}) : void 0
				]
			}).then(({ x: h, y: p }) => {
				e(a || h, c || p);
			});
		};
	}
	
	function Wi(i) {
		return i.split(" ").join("-");
	}
	
	function Bi(i) {
		let t = (o, r) => {
			Object.assign(i.style, { position: "absolute", inset: `${ r }px auto auto ${ o }px` });
		}, e, s, n = new MutationObserver(() => t(e, s));
		return [
			(o, r) => {
				e = o, s = r, n.disconnect(), t(e, s), n.observe(i, { attributeFilter: ["style"] });
			}, () => {
				n.disconnect();
			}
		];
	}
	
	var Kt = class extends S {
		boot() {
			let t = this.trigger(), e = this.overlay();
			if (t) {
				if (! e) {
					return console.warn("ui-dropdown: no [popover] overlay found", this);
				}
			} else {
				return console.warn("ui-dropdown: no trigger element found", this);
			}
			this._disabled = this.hasAttribute("disabled"), this._controllable = new H(this), e._popoverable = new R(e), e._anchorable = new N(e, {
				reference: t,
				position: this.hasAttribute("position") ? this.getAttribute("position") : void 0,
				gap: this.hasAttribute("gap") ? this.getAttribute("gap") : void 0,
				offset: this.hasAttribute("offset") ? this.getAttribute("offset") : void 0
			}), e._popoverable.onChange(() => {
				e._popoverable.getState() ? e._anchorable.reposition() : e._anchorable.cleanup();
			}), this._controllable.initial(o => e._popoverable.setState(o)), this._controllable.getter(() => e._popoverable.getState());
			let s = J();
			this._controllable.setter(o => e._popoverable.setState(o)), e._popoverable.onChange(s(() => this._controllable.dispatch())), this.hasAttribute("hover") && ht(t, e, {
				gain() {
					e._popoverable.setState(! 0);
				}, lose() {
					e._popoverable.setState(! 1);
				}, focusable: ! 0
			}), w(t, "click", () => e._popoverable.toggle()), e._popoverable.getState() ? (u(this, "data-open", ""), u(t, "data-open", ""), u(e, "data-open", ""))
				: (y(this, "data-open"), y(t, "data-open"), y(e, "data-open")), e._popoverable.onChange(() => {
				e._popoverable.getState() ? (u(this, "data-open", ""), u(t, "data-open", ""), u(e, "data-open", "")) : (y(this, "data-open"), y(t, "data-open"), y(e, "data-open"));
			});
			let n = q(e, "dropdown");
			u(t, "aria-haspopup", "true"), u(t, "aria-controls", n), u(t, "aria-expanded", e._popoverable.getState() ? "true" : "false"), e._popoverable.onChange(() => {
				u(t, "aria-expanded", e._popoverable.getState() ? "true" : "false");
			}), e._popoverable.onChange(() => {
				e._popoverable.getState() ? e.onPopoverShow?.() : e.onPopoverHide?.();
			});
		}
		
		trigger() {
			return this.querySelector("button");
		}
		
		overlay() {
			return this.lastElementChild?.matches("[popover]") && this.lastElementChild;
		}
	};
	C("dropdown", Kt);
	var Ut = class extends S {
		boot() {
			let t = this.hasAttribute("label") ? "label" : "description", e = this.button(), s = this.overlay();
			if (e) {
				if (! s) {
					return;
				}
			} else {
				return console.warn("ui-tooltip: no trigger element found", this);
			}
			this._disabled = this.hasAttribute("disabled"), s._popoverable = new R(s), s._anchorable = new N(s, {
				reference: e,
				position: this.hasAttribute("position") ? this.getAttribute("position") : void 0,
				gap: this.hasAttribute("gap") ? this.getAttribute("gap") : void 0,
				offset: this.hasAttribute("offset") ? this.getAttribute("offset") : void 0
			}), s._popoverable.onChange(() => s._anchorable.reposition()), this._disabled || ht(e, s, {
				gain() {
					s._popoverable.setState(! 0);
				}, lose() {
					s._popoverable.setState(! 1);
				}, focusable: ! 0
			});
			let n = q(s, "tooltip");
			u(e, "aria-controls", n), u(e, "aria-expanded", "false"), s._popoverable.onChange(() => {
				s._popoverable.getState() ? u(e, "aria-expanded", "true") : u(e, "aria-expanded", "false");
			}), t === "label" ? u(e, "aria-labelledby", n) : u(e, "aria-describedby", n), u(s, "role", "tooltip");
		}
		
		button() {
			return this.firstElementChild;
		}
		
		overlay() {
			return this.lastElementChild !== this.button() && this.lastElementChild;
		}
	};
	C("tooltip", Ut);
	var tt = class extends I {
		groupOfType = E;
		
		boot({ options: t }) {
			t({ multiple: ! 1 }), this.state = this.options().multiple ? new Set : null, this.onChanges = [];
		}
		
		onInitAndChange(t) {
			t(), this.onChanges.push(t);
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		changed(t, e = ! 1) {
			if (t.ungrouped) {
				return;
			}
			let s = t.value, n = t.isSelected(), o = this.options().multiple;
			n ? o ? this.state.add(s) : this.state = s : o ? this.state.delete(s) : this.state = null, e || this.onChanges.forEach(r => r());
		}
		
		getState() {
			return this.options().multiple ? Array.from(this.state) : this.state;
		}
		
		hasValue(t) {
			return this.options().multiple ? this.state.has(t) : this.state === t;
		}
		
		setState(t) {
			t = this.options().multiple ? (t || []).map(s => s + "") : t + "", this.state = this.options().multiple ? new Set(t) : t;
			let e = this.options().multiple ? t : [t];
			this.walker().each(s => {
				let n = s.use(E);
				if (n.ungrouped) {
					return;
				}
				let o = e.includes(n.value);
				o && ! n.isSelected() ? n.surgicallySelect() : ! o && n.isSelected() && n.surgicallyDeselect();
			}), this.onChanges.forEach(s => s());
		}
		
		selected() {
			return this.walker().find(t => t.use(E).isSelected()).use(E);
		}
		
		selecteds() {
			return this.walker().filter(t => t.use(E).isSelected()).map(t => t.use(E));
		}
		
		selectFirst() {
			this.walker().first()?.use(E).select();
		}
		
		selectAll() {
			this.walker().filter(t => ! t.use(E).isSelected()).map(t => t.use(E).select());
		}
		
		deselectAll() {
			this.walker().filter(t => t.use(E).isSelected()).map(t => t.use(E).deselect());
		}
		
		allAreSelected() {
			return this.walker().filter(t => t.use(E).isSelected()).length === this.walker().filter(t => ! 0).length;
		}
		
		noneAreSelected() {
			return this.state === null || this.state?.size === 0;
		}
		
		selectableByValue(t) {
			return this.walker().find(e => e.use(E).value === t)?.use(E);
		}
		
		deselectOthers(t) {
			this.walker().each(e => {
				e !== t && e.use(E).surgicallyDeselect();
			});
		}
		
		selectedTextValue() {
			return this.options().multiple ? Array.from(this.state).map(t => this.convertValueStringToElementText(t)).join(", ") : this.convertValueStringToElementText(this.state);
		}
		
		convertValueStringToElementText(t) {
			let e = this.findByValue(t);
			return e ? e.label || e.value : t;
		}
		
		findByValue(t) {
			return this.selecteds().find(e => e.value === t);
		}
		
		walker() {
			return V(this.el, (t, { skip: e, reject: s }) => {
				if (t[this.constructor.name] && t !== this.el) {
					return s();
				}
				if (! t[this.groupOfType.name] || t.mixins.get(this.groupOfType.name).ungrouped) {
					return e();
				}
			});
		}
	}, E = class extends O {
		boot({ options: t }) {
			this.groupedByType = tt, t({
				ungrouped: ! 1,
				togglable: ! 1,
				value: void 0,
				label: void 0,
				selectedInitially: ! 1,
				dataAttr: "data-selected",
				ariaAttr: "aria-selected"
			}), this.ungrouped = this.options().ungrouped, this.value = this.options().value === void 0 ? this.el.value
				: this.options().value, this.value = this.value + "", this.label = this.options().label;
			let e = this.options().selectedInitially;
			this.group() && this.group().hasValue(this.value) && (e = ! 0), this.multiple = this.hasGroup() ? this.group().options().multiple
				: ! 1, this.toggleable = this.options().toggleable || this.multiple, this.onSelects = [], this.onUnselects = [], this.onChanges = [], e ? this.select(! 0)
				: (this.state = e, this.surgicallyDeselect(! 0));
		}
		
		mount() {
			this.el.hasAttribute(this.options().ariaAttr) || u(this.el, this.options().ariaAttr, "false");
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		onSelect(t) {
			this.onSelects.push(t);
		}
		
		onUnselect(t) {
			this.onUnselects.push(t);
		}
		
		setState(t) {
			t ? this.select() : this.deselect();
		}
		
		getState() {
			return this.state;
		}
		
		press() {
			this.toggleable ? this.toggle() : this.select();
		}
		
		trigger() {
			this.toggleable ? this.toggle() : this.select();
		}
		
		toggle() {
			this.isSelected() ? this.deselect() : this.select();
		}
		
		isSelected() {
			return this.state;
		}
		
		select(t = ! 1) {
			let e = ! this.isSelected();
			this.toggleable || this.group()?.deselectOthers(this.el), this.state = ! 0, u(this.el, this.options().ariaAttr, "true"), u(this.el, this.options().dataAttr, ""), e && (t || (this.onSelects.forEach(s => s()), this.onChanges.forEach(s => s())), this.group()?.changed(this, t));
		}
		
		surgicallySelect() {
			let t = ! this.isSelected();
			this.state = ! 0, u(this.el, this.options().ariaAttr, "true"), u(this.el, this.options().dataAttr, ""), t && (this.onSelects.forEach(e => e()), this.onChanges.forEach(e => e()));
		}
		
		deselect(t = ! 0) {
			let e = this.isSelected();
			this.state = ! 1, u(this.el, this.options().ariaAttr, "false"), y(this.el, this.options().dataAttr), e && (this.onUnselects.forEach(s => s()), this.onChanges.forEach(s => s()), t && this.group()?.changed(this));
		}
		
		surgicallyDeselect(t = ! 1) {
			let e = this.isSelected();
			this.state = ! 1, u(this.el, this.options().ariaAttr, "false"), y(this.el, this.options().dataAttr), e && ! t && (this.onUnselects.forEach(s => s()), this.onChanges.forEach(s => s()));
		}
		
		getValue() {
			return this.value;
		}
		
		getLabel() {
			return this.label;
		}
	};
	var St = class extends I {
		groupOfType = L;
		
		boot({ options: t }) {
			t({ wrap: ! 1, ensureTabbable: ! 0 });
		}
		
		mount() {
			this.options().ensureTabbable && this.ensureTabbable();
		}
		
		focusFirst() {
			let t;
			t = t || this.walker().find(e => e.hasAttribute("autofocus")), t = t || this.walker().find(e => e.getAttribute("tabindex") === "0"), t = t || this.walker().find(e => e.getAttribute("tabindex") === "-1"), t = t || this.walker().find(e => _e(e)), t?.focus();
		}
		
		focusPrev() {
			this.moveFocus(t => this.options().wrap ? this.walker().prevOrLast(t) : this.walker().prev(t));
		}
		
		focusNext() {
			this.moveFocus(t => this.options().wrap ? this.walker().nextOrFirst(t) : this.walker().next(t));
		}
		
		focusBySearch(t) {
			let e = this.walker().find(s => s.textContent.toLowerCase().trim().startsWith(t.toLowerCase()));
			e?.use(L).tabbable(), e?.use(L).focus();
		}
		
		moveFocus(t) {
			let e = this.walker().find(n => n.use(L).isTabbable());
			t(e)?.use(L).focus();
		}
		
		ensureTabbable() {
			this.walker().findOrFirst(t => {
				t.use(L).isTabbable();
			})?.use(L).tabbable();
		}
		
		wipeTabbables() {
			this.walker().each(t => {
				t.use(L).untabbable();
			});
		}
		
		untabbleOthers(t) {
			this.walker().each(e => {
				e !== t && e.use(L).untabbable();
			});
		}
		
		walker() {
			return V(this.el, (t, { skip: e, reject: s }) => {
				if (t[this.constructor.name] && t !== this.el) {
					return s();
				}
				if (! t[this.groupOfType.name]) {
					return e();
				}
				if (t.hasAttribute("disabled")) {
					return s();
				}
			});
		}
	}, L = class extends O {
		groupedByType = St;
		
		boot({ options: t }) {
			t({ hover: ! 1, disableable: null, tabbable: ! 1, tabbableAttr: null });
		}
		
		mount() {
			let t = this.options().disableable;
			if (! t) {
				throw "Focusable requires a Disableable instance...";
			}
			this.el.hasAttribute("tabindex") || (this.options().tabbable ? this.tabbable() : this.untabbable()), this.pauseFocusListener = this.on("focus", t.enabled(() => {
				this.focus(! 1);
			})).pause, this.on("focus", t.enabled(() => {
				It() && u(this.el, "data-focus", "");
			})), this.on("blur", t.enabled(() => {
				y(this.el, "data-focus");
			})), this.options().hover && this.on("pointerenter", t.enabled(() => {
				this.group()?.untabbleOthers(this.el), this.tabbable();
			})), this.options().hover && this.on("pointerleave", t.enabled(e => {
				this.untabbable();
			}));
		}
		
		focus(t = ! 0) {
			this.group()?.untabbleOthers(this.el), this.tabbable(), t && this.pauseFocusListener(() => {
				this.el.focus({ focusVisible: ! 1 });
			});
		}
		
		tabbable() {
			u(this.el, "tabindex", "0"), this.options().tabbableAttr && u(this.el, this.options().tabbableAttr, "");
		}
		
		untabbable() {
			u(this.el, "tabindex", "-1"), this.options().tabbableAttr && y(this.el, this.options().tabbableAttr);
		}
		
		isTabbable() {
			return this.el.getAttribute("tabindex") === "0";
		}
	};
	var et = class extends O {
		boot({ options: t }) {
			this.onChanges = [], Object.defineProperty(this.el, "disabled", {
				get: () => this.el.hasAttribute("disabled"), set: s => {
					s ? this.el.setAttribute("disabled", "") : this.el.removeAttribute("disabled");
				}
			}), this.el.hasAttribute("disabled") ? this.el.disabled = ! 0 : this.el.closest("[disabled]") && (this.el.disabled = ! 0), new MutationObserver(s => {
				this.onChanges.forEach(n => n(this.el.disabled));
			}).observe(this.el, { attributeFilter: ["disabled"] });
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		onInitAndChange(t) {
			t(this.el.disabled), this.onChanges.push(t);
		}
		
		enabled(t) {
			return (...e) => {
				if (! this.el.disabled) {
					return t(...e);
				}
			};
		}
		
		disabled(t) {
			return (...e) => {
				if (this.el.disabled) {
					return t(...e);
				}
			};
		}
	};
	var kt = class extends I {
		groupOfType = T;
		
		boot({ options: t }) {
			t({ wrap: ! 1, filter: ! 1 }), this.onChanges = [];
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		activated(t) {
			this.onChanges.forEach(e => e());
		}
		
		activateFirst() {
			this.filterAwareWalker().first()?.use(T).activate();
		}
		
		activateSelectedOrFirst(t) {
			if (! t || (s => s.matches("ui-option") ? getComputedStyle(s).display === "none" : ! 1)(t)) {
				this.filterAwareWalker().first()?.use(T).activate();
				return;
			}
			t?.use(T).activate();
		}
		
		activateActiveOrFirst() {
			let t = this.getActive();
			if (! t) {
				this.filterAwareWalker().first()?.use(T).activate();
				return;
			}
			t?.use(T).activate();
		}
		
		activateActiveOrLast() {
			let t = this.getActive();
			if (! t) {
				this.filterAwareWalker().last()?.use(T).activate();
				return;
			}
			t?.use(T).activate();
		}
		
		activatePrev() {
			let t = this.getActive();
			if (! t) {
				this.filterAwareWalker().last()?.use(T).activate();
				return;
			}
			let e;
			this.options.wrap ? e = this.filterAwareWalker().prevOrLast(t) : e = this.filterAwareWalker().prev(t), e?.use(T).activate();
		}
		
		activateNext() {
			let t = this.getActive();
			if (! t) {
				this.filterAwareWalker().first()?.use(T).activate();
				return;
			}
			let e;
			this.options.wrap ? e = this.filterAwareWalker().nextOrFirst(t) : e = this.filterAwareWalker().next(t), e?.use(T).activate();
		}
		
		getActive() {
			return this.walker().find(t => t.use(T).isActive());
		}
		
		clearActive() {
			this.getActive()?.use(T).deactivate();
		}
		
		filterAwareWalker() {
			let t = e => e.matches("ui-option") ? getComputedStyle(e).display === "none" : ! 1;
			return V(this.el, (e, { skip: s, reject: n }) => {
				if (e[this.constructor.name] && e !== this.el) {
					return n();
				}
				if (! e[this.groupOfType.name]) {
					return s();
				}
				if (e.hasAttribute("disabled") || t(e)) {
					return n();
				}
			});
		}
	}, T = class i extends O {
		groupedByType = kt;
		
		mount() {
			this.el.addEventListener("mouseenter", () => {
				this.activate();
			}), this.el.addEventListener("mouseleave", () => {
				this.deactivate();
			});
		}
		
		activate() {
			this.group() && this.group().walker().each(t => t.use(i).deactivate(! 1)), u(this.el, "data-active", ""), this.el.scrollIntoView({ block: "nearest" }), this.group() && this.group().activated(this.el);
		}
		
		deactivate(t = ! 0) {
			y(this.el, "data-active"), t && this.group() && this.group().activated(this.el);
		}
		
		isActive() {
			return this.el.hasAttribute("data-active");
		}
	};
	var Ct = class extends I {
		groupOfType = at;
		
		boot({ options: t }) {
			t({}), this.onChanges = [], this.lastSearch = "";
		}
		
		onChange(t) {
			this.onChanges.push(t);
		}
		
		filter(t) {
			t === "" ? this.walker().each(e => {
				e.use(at).unfilter();
			}) : this.walker().each(e => {
				this.matches(e, t) ? e.use(at).unfilter() : e.use(at).filter();
			}), this.lastSearch !== t && this.onChanges.forEach(e => e()), this.lastSearch = t;
		}
		
		matches(t, e) {
			return t.textContent.toLowerCase().trim().includes(e.toLowerCase().trim());
		}
		
		hasResults() {
			return this.walker().some(t => ! t.use(at).isFiltered());
		}
	}, at = class extends O {
		groupedByType = Ct;
		
		boot({ options: t }) {
			t({ mirror: null }), this.onChanges = [];
		}
		
		filter() {
			u(this.el, "data-hidden", ""), this.options().mirror && u(this.options().mirror, "data-hidden", "");
		}
		
		unfilter() {
			y(this.el, "data-hidden"), this.options().mirror && y(this.options().mirror, "data-hidden", "");
		}
		
		isFiltered() {
			return this.el.hasAttribute("data-hidden");
		}
	};
	var Tt = class extends Mt {
		boot() {
			let t = this.list();
			this._controllable = new H(this), this._selectable = new tt(t, { multiple: this.hasAttribute("multiple") }), this._controllable.initial(s => s && this._selectable.setState(s)), this._controllable.getter(() => this._selectable.getState());
			let e = J();
			this._controllable.setter(e(s => {
				this._selectable.setState(s);
			})), this._selectable.onChange(e(() => {
				this._controllable.dispatch(), this.dispatchEvent(new CustomEvent("select", { bubbles: ! 1 }));
			}));
		}
		
		mount() {
			this._disableable = new et(this);
			let t = this.input(), e = this.button(), s = this.trigger(), n = this.list(), o = this.overlay(), r = this.hasAttribute("multiple"), a = this.hasAttribute("autocomplete"),
				c = this.hasAttribute("autocomplete") && this.getAttribute("autocomplete").trim().split(" ").includes("strict"), h = this.querySelector("ui-options") || this, p = Vi(h, "options");
			if (this._activatable = new kt(h, { filter: "data-hidden" }), ! t && ! e && this._disableable.onInitAndChange(l => {
				l ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", "0");
			}), this.hasAttribute("filter") && this.getAttribute("filter") !== "manual" && (this._filterable = new Ct(n), this._filterable.onChange(() => {
				this._activatable.clearActive(), this._filterable.hasResults() && this._activatable.activateFirst();
			}), this.addEventListener("close", () => {
				this._filterable && this._filterable.filter("");
			})), ! this.querySelector("[popover], input")) {
				Et(this, this._activatable), Ot(this, this, this._activatable), ti(this, this._activatable, this._selectable);
			} else if (! this.querySelector("[popover]") && this.querySelector("input")) {
				let l = this.querySelector("input");
				this._disableable.onInitAndChange(f => {
					f ? l && u(l, "disabled", "") : l && y(l, "disabled");
				}), ne(this, l, this._selectable, this._popoverable), ti(l, this._activatable, this._selectable), si(a, c, this, l, this._selectable, this._popoverable), se(l), ie(l), this._filterable && ee(l, this._filterable), ii(l, this._activatable), Et(l, this._activatable), Ot(this, l, this._activatable), Bt(this, this._activatable);
			} else if (this.querySelector("[popover]") && this.querySelector("input:not([popover] input)")) {
				let l = this.querySelector("input:not([popover] input)");
				u(l, "role", "combobox"), u(l, "aria-controls", p);
				let f = this.querySelector("[popover]");
				this._popoverable = new R(f), this._anchorable = new N(f, {
					reference: l,
					matchWidth: ! 0,
					position: this.hasAttribute("position") ? this.getAttribute("position") : void 0,
					gap: this.hasAttribute("gap") ? this.getAttribute("gap") : void 0,
					offset: this.hasAttribute("offset") ? this.getAttribute("offset") : void 0
				}), si(a, c, this, l, this._selectable, this._popoverable), this._disableable.onInitAndChange(b => {
					b ? l && u(l, "disabled", "") : l && y(l, "disabled");
				}), this.querySelectorAll("button:not([popover] button)").forEach(b => {
					u(b, "tabindex", "-1"), u(b, "aria-controls", p), u(b, "aria-haspopup", "listbox"), Vt(b, this._popoverable), w(b, "click", () => {
						this._popoverable.toggle(), l.focus();
					});
				}), ne(this, l, this._selectable, this._popoverable), Zt(this, l, f, this._popoverable, this._anchorable), Vt(l, this._popoverable), se(l), ie(l), this._filterable && ee(l, this._filterable), ii(l, this._activatable), Hi(l, this._popoverable), Qt(l, this._popoverable, this._activatable, this._selectable), qi(l, this._popoverable), Et(l, this._activatable), Ot(this, l, this._activatable), Bt(this, this._activatable), Jt(this._popoverable, this._activatable, this._selectable), r || te(this, this._popoverable);
			} else if (this.querySelector("[popover]") && this.querySelector("[popover] input")) {
				let l;
				CSS.supports("selector(&)") ? l = this.querySelector("button:not(& [popover] button)") : l = this.querySelector("button:not([popover] button)");
				let f = this.querySelector("[popover] input"), b = this.querySelector("[popover]");
				u(l, "role", "combobox"), u(f, "role", "combobox"), u(l, "aria-controls", p), this._disableable.onInitAndChange(g => {
					g ? (l && u(l, "disabled", ""), f && u(f, "disabled", "")) : (l && y(l, "disabled"), f && y(f, "disabled"));
				}), this._popoverable = new R(b), this._anchorable = new N(b, {
					reference: l,
					matchWidth: ! 0,
					position: this.hasAttribute("position") ? this.getAttribute("position") : void 0,
					gap: this.hasAttribute("gap") ? this.getAttribute("gap") : void 0,
					offset: this.hasAttribute("offset") ? this.getAttribute("offset") : void 0
				}), se(f), ie(f), this._filterable && ee(f, this._filterable), Ii(l, f, this._popoverable), Zt(this, l, b, this._popoverable, this._anchorable), Vt(l, this._popoverable), ne(this, f, this._selectable, this._popoverable), Qt(l, this._popoverable, this._activatable, this._selectable), ei(l, this._popoverable), Et(f, this._activatable), Ot(this, f, this._activatable), Bt(this, this._activatable), Jt(this._popoverable, this._activatable, this._selectable), r || te(this, this._popoverable);
			} else if (this.querySelector("[popover]")) {
				let l = this.querySelector("button:not([popover] button)"), f = this.querySelector("[popover]");
				u(l, "role", "combobox"), u(l, "aria-controls", p), this._disableable.onInitAndChange(b => {
					b ? (l && u(l, "disabled", ""), t && u(t, "disabled", "")) : (l && y(l, "disabled"), t && y(t, "disabled"));
				}), this._popoverable = new R(f), this._anchorable = new N(f, {
					reference: l,
					matchWidth: ! 0,
					position: this.hasAttribute("position") ? this.getAttribute("position") : void 0,
					gap: this.hasAttribute("gap") ? this.getAttribute("gap") : void 0,
					offset: this.hasAttribute("offset") ? this.getAttribute("offset") : void 0
				}), Zt(this, l, f, this._popoverable, this._anchorable), Vt(l, this._popoverable), Qt(l, this._popoverable, this._activatable, this._selectable), ei(l, this._popoverable), Et(l, this._activatable), Ot(this, l, this._activatable), Bt(this, this._activatable), Jt(this._popoverable, this._activatable, this._selectable), r || te(this, this._popoverable);
			}
			new MutationObserver(l => {
				setTimeout(() => {
					if (! this._popoverable || this._popoverable.getState()) {
						let f = this._selectable.selecteds()[0]?.el;
						queueMicrotask(() => {
							this._activatable.activateSelectedOrFirst(f);
						});
					} else {
						this._activatable.clearActive();
					}
				});
			}).observe(n, { childList: ! 0 });
		}
		
		button() {
			return this.querySelector("button:has(+ [popover])");
		}
		
		trigger() {
			return this.querySelector("input, button");
		}
		
		input() {
			return this.querySelector("input");
		}
		
		list() {
			return this.querySelector("ui-options") || this;
		}
		
		overlay() {
			return this.querySelector("[popover]");
		}
		
		clear() {
			this.input() && (this.input().value = "", this.input().dispatchEvent(new Event("input", { bubbles: ! 1 })));
		}
		
		open() {
			this._popoverable.setState(! 0);
		}
		
		close() {
			this._popoverable.setState(! 1);
		}
	}, oe = class extends S {
		boot() {
			u(this, "data-hidden", "");
		}
		
		mount() {
			queueMicrotask(() => {
				let t = this.closest("ui-autocomplete, ui-combobox, ui-select"), e = this.closest("ui-options");
				if (! e) {
					return;
				}
				let s = a => getComputedStyle(a).display === "none", n = () => {
					let a;
					CSS.supports("selector(&)") ? a = Array.from(e.querySelectorAll("& > ui-option")).filter(c => ! s(c)).length === 0
						: a = Array.from(e.querySelectorAll(":scope > ui-option")).filter(c => ! s(c)).length === 0, a ? y(this, "data-hidden") : u(this, "data-hidden", "");
				};
				n();
				let o = t._filterable;
				o && o.onChange(n), new MutationObserver(a => {
					setTimeout(() => n());
				}).observe(e, { childList: ! 0 });
			});
		}
	}, re = class extends S {
		boot() {
			this.placeholderHTML = this.innerHTML, this.valuesAppended = new Map, this.selectedElementGraveyard = new Map;
		}
		
		picker() {
			return this.closest("ui-select");
		}
		
		mount() {
			queueMicrotask(() => {
				this.picker()._selectable.onInitAndChange(() => {
					this.displaySelectedValue();
				});
				let t = this.picker()?.list();
				t && new MutationObserver(e => {
					queueMicrotask(() => {
						this.displaySelectedValue();
					});
				}).observe(t, { childList: ! 0 });
			});
		}
		
		displaySelectedValue() {
			let t = this.picker().value;
			if (Array.isArray(t)) {
				let e = t;
				this.valuesAppended.size === 0 && this.clearPlaceholder();
				let s = this.picker()._selectable.selecteds();
				e.forEach(r => {
					if (this.valuesAppended.has(r)) {
						return;
					}
					let a = s.find(c => c.value === r) || this.selectedElementGraveyard.get(r);
					if (a) {
						let c = document.createElement("ui-selected-option");
						c.innerHTML = a.el.innerHTML, c.style.display = "block", this.valuesAppended.set(r, c), this.appendChild(c), this.selectedElementGraveyard.set(r, a);
					}
				}), this.valuesAppended.keys().filter(r => ! e.includes(r)).forEach(r => {
					this.valuesAppended.get(r).remove(), this.valuesAppended.delete(r), this.selectedElementGraveyard.delete(r);
				}), this.valuesAppended.size === 0 && (this.putBackPlaceholder(), this.selectedElementGraveyard.clear());
			} else {
				let e = this.picker()._selectable.findByValue(t) || this.selectedElementGraveyard.get(t);
				if (this.selectedElementGraveyard.clear(), e) {
					let s = document.createElement("ui-selected-option");
					s.innerHTML = e.el.innerHTML, this.innerHTML = s.outerHTML, this.selectedElementGraveyard.set(t, e);
				} else {
					this.putBackPlaceholder();
				}
			}
		}
		
		clearPlaceholder() {
			this.innerHTML = "";
		}
		
		putBackPlaceholder() {
			this.innerHTML = this.placeholderHTML;
		}
		
		showOverflow() {
			this.querySelector("ui-selected-overflow").style.display = "block";
		}
		
		hideOverflow() {
			this.querySelector("ui-selected-overflow").style.display = "block";
		}
	}, le = class extends S {
	}, ae = class extends S {
		mount() {
			let t = this.closest("ui-select");
			t.hasAttribute("multiple") && (this.textContent = t.value.length, t._selectable.onChange(() => {
				this.textContent = t.value.length;
			}));
		}
	}, ce = class extends S {
		mount() {
			let t = this.closest("ui-select");
			if (! t.hasAttribute("multiple")) {
				return;
			}
			t.value.length === 1 ? this.removeAttribute("data-hidden") : this.setAttribute("data-hidden", ""), t._selectable.onChange(() => {
				t.value.length === 1 ? this.removeAttribute("data-hidden") : this.setAttribute("data-hidden", "");
			});
		}
	}, ue = class extends S {
		mount() {
			let t = this.closest("ui-select");
			if (! t.hasAttribute("multiple")) {
				return;
			}
			t.value.length > 1 ? this.removeAttribute("data-hidden") : this.setAttribute("data-hidden", ""), t._selectable.onChange(() => {
				t.value.length > 1 ? this.removeAttribute("data-hidden") : this.setAttribute("data-hidden", "");
			});
		}
	}, he = class extends S {
		mount() {
			let t = this.closest("ui-select"), e = () => this.removeAttribute("data-hidden"), s = () => this.setAttribute("data-hidden", "");
			t.hasAttribute("multiple") ? (t.value.length === 0 ? e() : s(), t._selectable.onChange(() => {
				t.value.length === 0 ? e() : s();
			})) : (t.value === null ? e() : s(), t._selectable.onChange(() => {
				t.value === null ? e() : s();
			}));
		}
	};
	C("select", Tt);
	C("empty", oe);
	C("selected", re);
	C("selected-count", ae);
	C("selected-singular", ce);
	C("selected-plural", ue);
	C("selected-option", le);
	C("selected-empty", he);
	Z(({ css: i }) => i`ui-select { display: block; }`);
	Z(({ css: i }) => i`ui-selected-option { display: contents; }`);
	Z(({ css: i }) => i`ui-empty { display: block; cursor: default; }`);
	
	function Et(i, t) {
		w(i, "keydown", e => {
			["ArrowDown", "ArrowUp", "Escape"].includes(e.key) && (e.key === "ArrowDown" ? (t.activateNext(), e.preventDefault(), e.stopPropagation())
				: e.key === "ArrowUp" && (t.activatePrev(), e.preventDefault(), e.stopPropagation()));
		});
	}
	
	function Ot(i, t, e) {
		w(t, "keydown", s => {
			if (s.key === "Enter") {
				let n = e.getActive();
				if (s.preventDefault(), s.stopPropagation(), ! n) {
					return;
				}
				n._selectable?.trigger(), n.click(), i.dispatchEvent(new CustomEvent("action", { bubbles: ! 1, cancelable: ! 1 }));
			}
		});
	}
	
	function Bt(i, t, e = ! 1) {
		w(i, e ? "pointerdown" : "click", s => {
			if (s.target.closest("ui-option")) {
				let n = s.target.closest("ui-option");
				if (n._disabled) {
					return;
				}
				n._selectable?.trigger(), i.dispatchEvent(new CustomEvent("action", { bubbles: ! 1, cancelable: ! 1 })), s.preventDefault(), s.stopPropagation();
			}
		});
	}
	
	function ti(i, t, e) {
		w(i, "focus", () => {
			let s = e.selecteds()[0]?.el;
			t.activateSelectedOrFirst(s);
		}), w(i, "blur", () => {
			t.clearActive();
		});
	}
	
	function Vi(i) {
		let t = q(i, "options");
		return u(i, "role", "listbox"), t;
	}
	
	function Vt(i, t) {
		u(i, "aria-haspopup", "listbox");
		let e = () => {
			u(i, "aria-expanded", t.getState() ? "true" : "false"), t.getState() ? u(i, "data-open", "") : y(i, "data-open", "");
		};
		t.onChange(() => {
			e();
		}), e();
	}
	
	function Zt(i, t, e, s, n) {
		let o = () => {
			Array.from([i, e]).forEach(r => {
				s.getState() ? u(r, "data-open", "") : y(r, "data-open", "");
			}), s.getState() && n.reposition();
		};
		s.onChange(() => o()), o(), s.onChange(() => {
			s.getState() ? i.dispatchEvent(new Event("open", { bubbles: ! 1, cancelable: ! 1 })) : i.dispatchEvent(new Event("close", { bubbles: ! 1, cancelable: ! 1 }));
		});
	}
	
	function Jt(i, t, e) {
		i.onChange(() => {
			if (i.getState()) {
				let s = e.selecteds()[0]?.el;
				queueMicrotask(() => {
					t.activateSelectedOrFirst(s);
				});
			} else {
				t.clearActive();
			}
		});
	}
	
	function Qt(i, t, e, s) {
		w(i, "keydown", n => {
			["ArrowDown", "ArrowUp", "Escape"].includes(n.key) && (n.key === "ArrowDown" || n.key === "ArrowUp" ? t.getState() || (t.setState(! 0), n.preventDefault(), n.stopImmediatePropagation())
				: n.key === "Escape" && t.getState() && t.setState(! 1));
		});
	}
	
	function te(i, t) {
		w(i, "action", () => {
			t.setState(! 1);
		});
	}
	
	function qi(i, t) {
		w(i, "click", () => {
			t.getState() || (t.setState(! 0), i.focus());
		});
	}
	
	function ei(i, t) {
		w(i, "click", () => {
			t.setState(! t.getState()), i.focus();
		});
	}
	
	function Ii(i, t, e) {
		e.onChange(() => {
			e.getState() && setTimeout(() => t.focus());
		});
	}
	
	function ee(i, t) {
		t && w(i, "input", e => {
			t.filter(e.target.value);
		});
	}
	
	function ie(i) {
		w(i, "focus", () => i.select());
	}
	
	function se(i) {
		w(i, "change", t => t.stopPropagation()), w(i, "input", t => t.stopPropagation());
	}
	
	function Hi(i, t) {
		w(i, "keydown", e => {
			(/^[a-zA-Z0-9]$/.test(e.key) || e.key === "Backspace") && (t.getState() || t.setState(! 0));
		});
	}
	
	function ne(i, t, e, s) {
		if (! i.hasAttribute("clear")) {
			return;
		}
		let o = d => {
				t.value = d, t.dispatchEvent(new Event("input", { bubbles: ! 1 }));
			}, r = i.getAttribute("clear"), a = r === "" || r.split(" ").includes("action"), c = r === "" || r.split(" ").includes("select"), h = r === "" || r.split(" ").includes("close"),
			p = r === "" || r.split(" ").includes("esc");
		a ? i.addEventListener("action", d => {
			o("");
		}) : c && e.onChange(() => {
			o("");
		}), h && s.onChange(() => {
			s.getState() || o("");
		}), p && w(t, "keydown", d => {
			d.key === "Escape" && o("");
		});
	}
	
	function ii(i, t) {
		t.onChange(() => {
			let e = t.getActive();
			e ? u(i, "aria-activedescendant", e.id) : y(i, "aria-activedescendant");
		});
	}
	
	function si(i, t, e, s, n, o) {
		if (! i) {
			u(s, "autocomplete", "off"), u(s, "aria-autocomplete", "none");
			return;
		}
		let r = a => {
			s.value = a, s.dispatchEvent(new Event("input", { bubbles: ! 1 }));
		};
		u(s, "autocomplete", "off"), u(s, "aria-autocomplete", "list"), queueMicrotask(() => {
			n.onInitAndChange(() => {
				s.value = n.selectedTextValue();
			});
		}), e.addEventListener("action", a => {
			r(n.selectedTextValue());
		}), t && o.onChange(() => {
			o.getState() || r(n.selectedTextValue());
		});
	}
	
	var fe = class i extends S {
		boot() {
			if (this._focusable = new St(this, { wrap: ! 1, ensureTabbable: ! 1 }), w(this, "keydown", t => {
				["ArrowDown"].includes(t.key) ? (t.target === this ? this._focusable.focusFirst() : this._focusable.focusNext(), t.preventDefault(), t.stopPropagation())
					: ["ArrowUp"].includes(t.key) && (t.target === this ? this._focusable.focusFirst() : this._focusable.focusPrev(), t.preventDefault(), t.stopPropagation());
			}), Se(this, t => this._focusable.focusBySearch(t)), this.hasAttribute("popover") && this.addEventListener("lofi-close-popovers", () => {
				setTimeout(() => this.hidePopover(), 50);
			}), this.parentElement.localName === "ui-dropdown") {
				let t = this.parentElement;
				w(t.trigger(), "keydown", e => {
					e.key === "ArrowDown" && (this.fromArrowDown = ! 0, this.showPopover(), e.preventDefault(), e.stopPropagation());
				});
			}
			u(this, "role", "menu"), u(this, "tabindex", "-1");
		}
		
		mount() {
			this.initializeMenuItems(), new MutationObserver(e => {
				this.initializeMenuItems();
			}).observe(this, { childList: ! 0, subtree: ! 0 });
		}
		
		onPopoverShow() {
			queueMicrotask(() => {
				this.fromArrowDown ? (this._focusable.focusFirst(), this.fromArrowDown = ! 1) : this.focus();
			});
		}
		
		onPopoverHide() {
			this._focusable.wipeTabbables();
		}
		
		initializeMenuItems() {
			this.walker().each(t => {
				t._disableable || $i(t);
			});
		}
		
		walker() {
			return V(this, (t, { skip: e, reject: s }) => {
				if (t instanceof i || t instanceof Tt) {
					return s();
				}
				if (! ["a", "button"].includes(t.localName)) {
					return e();
				}
			});
		}
	}, de = class extends S {
		boot() {
		}
	}, pe = class extends S {
		boot() {
			this._disabled = this.hasAttribute("disabled"), this._disableable = new et(this);
			let t = this;
			this._disabled && (u(t, "disabled", ""), u(t, "aria-disabled", "true"));
			let e = q(t, "menu-checkbox");
			if (u(t, "role", "menuitemcheckbox"), this._disabled) {
				return;
			}
			t._focusable = new L(t, { disableable: this._disableable, hover: ! 0, tabbableAttr: "data-active" }), t._selectable = new E(t, {
				toggleable: ! 0,
				value: this.hasAttribute("value") ? this.getAttribute("value") : t.textContent.trim(),
				label: this.hasAttribute("label") ? this.getAttribute("label") : t.textContent.trim(),
				dataAttr: "data-checked",
				ariaAttr: "aria-checked",
				selectedInitially: this.hasAttribute("checked")
			}), this._controllable = new H(this), this._controllable.initial(n => n && t._selectable.setState(n)), this._controllable.getter(() => t._selectable.getState());
			let s = J();
			this._controllable.setter(s(n => {
				this._selectable.setState(n);
			})), this._selectable.onChange(s(() => {
				this._controllable.dispatch();
			})), w(t, "click", () => {
				this.dispatchEvent(new CustomEvent("lofi-close-popovers", { bubbles: ! 0 })), t._selectable.press();
			}), ve(t);
		}
	}, be = class extends S {
		boot() {
			this._disabled = this.hasAttribute("disabled"), this._disableable = new et(this);
			let t = this;
			this._disabled && (u(t, "disabled", ""), u(t, "aria-disabled", "true"));
			let e = q(t, "menu-radio");
			u(t, "role", "menuitemradio"), ! this._disabled && (t._focusable = new L(t, {
				disableable: this._disableable,
				hover: ! 0,
				tabbableAttr: "data-active"
			}), t._selectable = new E(t, {
				toggleable: ! 1,
				value: this.hasAttribute("value") ? this.getAttribute("value") : t.textContent.trim(),
				label: this.hasAttribute("label") ? this.getAttribute("label") : t.textContent.trim(),
				dataAttr: "data-checked",
				ariaAttr: "aria-checked",
				selectedInitially: this.hasAttribute("checked")
			}), w(t, "click", () => {
				this.dispatchEvent(new CustomEvent("lofi-close-popovers", { bubbles: ! 0 })), t._selectable.press();
			}), ve(t));
		}
	}, me = class extends S {
		boot() {
			this._selectable = new tt(this), this._controllable = new H(this), u(this, "role", "group"), this._controllable.initial(e => e && this._selectable.setState(e)), this._controllable.getter(() => this._selectable.getState());
			let t = J();
			this._controllable.setter(t(e => {
				this._selectable.setState(e);
			})), this._selectable.onChange(t(() => {
				this._controllable.dispatch();
			}));
		}
	}, ge = class extends S {
		boot() {
			this._selectable = new tt(this, { multiple: ! 0 }), this._controllable = new H(this), u(this, "role", "group"), this._controllable.initial(e => e && this._selectable.setState(e)), this._controllable.getter(() => this._selectable.getState());
			let t = J();
			this._controllable.setter(t(e => {
				this._selectable.setState(e);
			})), this._selectable.onChange(t(() => {
				this._controllable.dispatch();
			}));
		}
	};
	Z(({ css: i }) => i`ui-menu[popover]:popover-open { display: block; }`);
	Z(({ css: i }) => i`ui-menu[popover].\:popover-open { display: block; }`);
	Z(({ css: i }) => i`ui-menu-checkbox, ui-menu-radio { cursor: default; display: contents; }`);
	C("menu", fe);
	C("submenu", de);
	C("menu-checkbox", pe);
	C("menu-radio", be);
	C("menu-radio-group", me);
	C("menu-checkbox-group", ge);
	
	function ve(i) {
		w(i, "keydown", t => {
			t.key === "Enter" && (i.click(), t.preventDefault(), t.stopPropagation());
		}), w(i, "keydown", t => {
			t.key === " " && (t.preventDefault(), t.stopPropagation());
		}), w(i, "keyup", t => {
			t.key === " " && (i.click(), t.preventDefault(), t.stopPropagation());
		});
	}
	
	function $i(i) {
		i._disableable = new et(i), i._disabled = i.hasAttribute("disabled");
		let t = i.querySelector("a"), e = i, s = i.parentElement.matches("ui-submenu") && i.parentElement.querySelector("ui-menu[popover]"), n = t || e;
		i._disabled && (u(n, "disabled", ""), u(n, "aria-disabled", "true"));
		let o = q(n, "menu-item");
		if (u(n, "role", "menuitem"), ! i._disabled) {
			if (n._focusable = new L(n, {
				disableable: i._disableable,
				hover: ! 0,
				tabbableAttr: "data-active"
			}), ! s) {
				i.hasAttribute("disabled") || w(i, "click", () => {
					i.dispatchEvent(new CustomEvent("lofi-close-popovers", { bubbles: ! 0 }));
				}), ve(e);
			} else {
				s._popoverable = new R(s, { trigger: e }), s._anchorable = new N(s, {
					reference: e,
					position: s.hasAttribute("position") ? s.getAttribute("position") : "right start",
					gap: s.hasAttribute("gap") ? s.getAttribute("gap") : "-5"
				}), e.addEventListener("click", a => {
					s._popoverable.setState(! 0);
				});
				let { clear: r } = ht(e, s, {
					gain() {
						s._popoverable.setState(! 0)
					}, lose() {
						s._popoverable.setState(! 1)
					}, focusable: ! 1
				});
				s._popoverable.onChange(() => {
					s._popoverable.getState() || (r(), s._focusable.wipeTabbables()), s._anchorable.reposition()
				}), w(e, "keydown", a => {
					a.key === "Enter" && (s._popoverable.setState(! 0), setTimeout(() => s._focusable.focusFirst()))
				}), w(e, "keydown", a => {
					a.key === "ArrowRight" && (s._popoverable.setState(! 0), setTimeout(() => s._focusable.focusFirst()))
				}), w(s, "keydown", a => {
					a.key === "ArrowLeft" && (s._popoverable.setState(! 1), e.focus(), a.stopPropagation())
				})
			}
		}
	}
})();
