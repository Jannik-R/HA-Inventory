//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, oe = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, se = (e, t) => !l(e, t), ce = {
	attribute: !0,
	type: String,
	converter: oe,
	reflect: !1,
	useDefault: !1,
	hasChanged: se
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var m = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ce) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ce;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? oe : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? oe : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? se)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[p("elementProperties")] = /* @__PURE__ */ new Map(), m[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: m }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var le = globalThis, ue = (e) => e, h = le.trustedTypes, de = h ? h.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fe = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + g, me = `<${pe}>`, _ = document, v = () => _.createComment(""), y = (e) => e === null || typeof e != "object" && typeof e != "function", he = Array.isArray, ge = (e) => he(e) || typeof e?.[Symbol.iterator] == "function", _e = "[ 	\n\f\r]", b = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, ye = />/g, x = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, xe = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ce = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), S = Ce(1), we = Ce(2), C = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), Te = /* @__PURE__ */ new WeakMap(), T = _.createTreeWalker(_, 129);
function Ee(e, t) {
	if (!he(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
var De = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = b;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === b ? c[1] === "!--" ? o = ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = x) : (Se.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = x) : o = ye : o === x ? c[0] === ">" ? (o = i ?? b, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? x : c[3] === "\"" ? xe : be) : o === xe || o === be ? o = x : o === ve || o === ye ? o = b : (o = x, i = void 0);
		let d = o === x && e[t + 1].startsWith("/>") ? " " : "";
		a += o === b ? n + me : l >= 0 ? (r.push(s), n.slice(0, l) + fe + n.slice(l) + g + d) : n + g + (l === -2 ? t : d);
	}
	return [Ee(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Oe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = De(t, n);
		if (this.el = e.createElement(l, r), T.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = T.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fe)) {
					let t = u[o++], n = i.getAttribute(e).split(g), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? je : r[1] === "?" ? Me : r[1] === "@" ? Ne : D
					}), i.removeAttribute(e);
				} else e.startsWith(g) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Se.test(i.tagName)) {
					let e = i.textContent.split(g), t = e.length - 1;
					if (t > 0) {
						i.textContent = h ? h.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], v()), T.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], v());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === pe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(g, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += g.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = _.createElement("template");
		return n.innerHTML = e, n;
	}
};
function E(e, t, n = e, r) {
	if (t === C) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = y(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = E(e, i._$AS(e, t.values), i, r)), t;
}
var ke = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? _).importNode(t, !0);
		T.currentNode = r;
		let i = T.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ae(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = T.nextNode(), a++);
		}
		return T.currentNode = _, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ae = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = E(this, e, t), y(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== C && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== w && y(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Oe.createElement(Ee(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ke(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Te.get(e.strings);
		return t === void 0 && Te.set(e.strings, t = new Oe(e)), t;
	}
	k(t) {
		he(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(v()), this.O(v()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ue(e).nextSibling;
			ue(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, D = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = w, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = w;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = E(this, e, t, 0), a = !y(e) || e !== this._$AH && e !== C, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = E(this, r[n + o], t, o), s === C && (s = this._$AH[o]), a ||= !y(s) || s !== this._$AH[o], s === w ? e = w : e !== w && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, je = class extends D {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === w ? void 0 : e;
	}
}, Me = class extends D {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== w);
	}
}, Ne = class extends D {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = E(this, e, t, 0) ?? w) === C) return;
		let n = this._$AH, r = e === w && n !== w || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== w && (n === w || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		E(this, e);
	}
}, Fe = {
	M: fe,
	P: g,
	A: pe,
	C: 1,
	L: De,
	R: ke,
	D: ge,
	V: E,
	I: Ae,
	H: D,
	N: Me,
	U: Ne,
	B: je,
	F: Pe
}, Ie = le.litHtmlPolyfillSupport;
Ie?.(Oe, Ae), (le.litHtmlVersions ??= []).push("3.3.3");
var Le = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ae(t.insertBefore(v(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Re = globalThis, O = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Le(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return C;
	}
};
O._$litElement$ = !0, O.finalized = !0, Re.litElementHydrateSupport?.({ LitElement: O });
var ze = Re.litElementPolyfillSupport;
ze?.({ LitElement: O }), (Re.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Be = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Ve = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", He = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Ue = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", We = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", Ge = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", Ke = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", qe = "M7,10L12,15L17,10H7Z", Je = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", Ye = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", Xe = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", Ze = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", Qe = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", k = {
	"panel.title": "Vorrat",
	"panel.help": "Anleitung",
	"panel.menu": "Menü",
	"tab.stock": "Bestand",
	"tab.in": "Einbuchen",
	"tab.out": "Auslagern",
	"tab.expiry": "Ablauf",
	"tab.shopping": "Einkauf",
	"tab.recipes": "Rezepte",
	"tab.settings": "Einstellungen",
	"common.save": "Speichern",
	"common.cancel": "Abbrechen",
	"common.delete": "Löschen",
	"common.reset": "Zurücksetzen",
	"common.name": "Name",
	"common.none": "keine",
	"common.empty": "Noch keine Einträge.",
	"common.expand": "Aufklappen",
	"common.collapse": "Zuklappen",
	"settings.nav": "Bereich",
	"settings.section.categories": "Kategorien",
	"settings.section.locations": "Lagerorte",
	"settings.section.units": "Einheiten",
	"settings.section.defaults": "Standards",
	"settings.defaults.hint": "Gelten für alle Kategorien und Produkte, die selbst keinen Wert haben und keinen erben.",
	"settings.defaults.edit": "Standards bearbeiten",
	"settings.defaults.no_location": "– keiner (beim Einbuchen wählen) –",
	"settings.location.add": "Lagerort hinzufügen",
	"settings.unit.add": "Einheit hinzufügen",
	"settings.category.add": "Hauptkategorie hinzufügen",
	"settings.unit.symbol": "Symbol",
	"settings.unit.is_count": "Zählt Packungen",
	"settings.unit.recipe_only": "Nur für Rezepte",
	"settings.unit.recipe_only_hint": "Nicht für Vorrat und Einkauf wählbar. Beim Einkaufen in die Basiseinheit umgerechnet (EL → ml), sonst gilt „beliebig“.",
	"settings.unit.no_conversion": "ohne Umrechnung (zählt als beliebige Menge)",
	"recipes.approx": "≈ {what}",
	"settings.unit.base": "Basiseinheit",
	"settings.unit.factor": "Faktor",
	"settings.unit.count": "Anzahl",
	"settings.category.parent": "Übergeordnete Kategorie",
	"settings.category.no_parent": "– keine (Hauptkategorie) –",
	"settings.category.unit": "Einheit",
	"settings.category.location": "Standard-Lagerort",
	"settings.category.expiry_type": "Datumsart",
	"settings.category.warn_days": "Warnung vor Ablauf",
	"settings.category.min_stock": "Mindestmenge",
	"settings.category.off_tags": "Open-Food-Facts-Tags: {tags}",
	"settings.category.min": "min. {value}",
	"settings.expiry.best_before": "Mindesthaltbarkeit",
	"settings.expiry.use_by": "Verbrauchsdatum",
	"settings.days": "{n} Tage",
	"settings.inherit_from": "von {name}",
	"settings.inherit_default": "Standard",
	"settings.day": "{n} Tag",
	"book.camera": "Kamera",
	"book.unknown": "Produkt nicht gefunden.",
	"book.label_out_only": "Etiketten zum Ausbuchen im Tab „Auslagern“ scannen.",
	"book.no_hits": "Keine Treffer.",
	"book.search_online": "Online suchen",
	"book.new_product": "Neues Produkt",
	"book.brand": "Marke",
	"book.category": "Kategorie",
	"book.choose": "– bitte wählen –",
	"book.content": "Inhalt",
	"book.content_unit": "Einheit",
	"book.expires_on": "Ablaufdatum",
	"book.no_date_hint": "Leer lassen, wenn es kein Ablaufdatum gibt.",
	"book.no_date": "ohne Datum",
	"book.location": "Lagerort",
	"book.packages": "Packungen",
	"book.which": "Welche Packung",
	"book.fefo": "Automatisch (frühestes Datum zuerst)",
	"book.count": "{n} Pkg.",
	"book.no_stock": "Nicht im Bestand.",
	"book.submit_in": "Einbuchen",
	"book.submit_out": "Auslagern",
	"book.done_in": "{n} × {name} eingebucht",
	"book.done_out": "{n} × {name} ausgelagert",
	"book.undone": "Rückgängig gemacht: wieder im Bestand.",
	"scan.title": "Barcode scannen",
	"scan.https": "Die Kamera braucht HTTPS (oder localhost).",
	"scan.no_camera": "Kein Kamerazugriff. Bitte Berechtigung prüfen.",
	"book.input": "EAN oder Name",
	"book.done_in_at": "{n} × {name} eingebucht – {where}",
	"book.filter": "Filtern",
	"book.category_required": "Bitte eine Kategorie wählen.",
	"book.apply": "Übernehmen",
	"book.from_product": "vom Produkt",
	"book.last_used": "zuletzt benutzt",
	"book.title_in": "Produkt zubuchen",
	"book.is_new": "(neu)",
	"products.ean": "EAN",
	"products.min_packages": "Mindestanzahl (optional)",
	"book.expires_on_type": "Ablaufdatum ({type})",
	"book.make_default": "Wird Standardlager",
	"valid.required": "Pflichtfeld.",
	"valid.positive": "Muss größer als 0 sein.",
	"valid.content_pair": "Inhalt und Einheit nur zusammen angeben.",
	"valid.date": "Bitte ein gültiges Datum zwischen 2000 und 2099 eingeben.",
	"valid.past": "Das Datum liegt in der Vergangenheit.",
	"valid.location": "Bitte einen Lagerort wählen.",
	"valid.packages": "Bitte eine ganze Zahl ab 1 eingeben.",
	"valid.max_packages": "Höchstens {n} Pkg. vorhanden.",
	"valid.ean": "Die EAN besteht aus 8 bis 14 Ziffern.",
	"valid.ean_taken": "Diese EAN gehört schon zu „{name}“.",
	"valid.days": "Bitte eine ganze Zahl ab 0 eingeben.",
	"valid.packages_zero": "Bitte eine ganze Zahl ab 0 eingeben.",
	"common.none_dash": "–",
	"scan.detector": "Der Barcode-Scanner konnte nicht geladen werden.",
	"common.edit_name": "„{name}“ bearbeiten",
	"common.delete_name": "„{name}“ löschen",
	"valid.duplicate": "Dieser Name ist schon vergeben.",
	"common.default": "Geerbt: {value} ({source})",
	"settings.category.add_sub_to": "Unterkategorie zu „{name}“ hinzufügen",
	"common.days_unit": "Tage",
	"common.discard": "Änderungen verwerfen?",
	"common.discard_ok": "Verwerfen",
	"settings.location.delete_hint": "Der Lagerort wird ausgeblendet; seine Buchungen bleiben erhalten. Wo er Standard-Lagerort ist, wird das entfernt.",
	"book.choose_category": "Kategorie wählen",
	"book.create_category": "„{name}“ neu anlegen",
	"book.choose_parent": "Übergeordnete Kategorie für „{name}“ wählen",
	"stock.search": "Suchen",
	"stock.location": "Lagerort",
	"stock.all_locations": "Alle Lagerorte",
	"stock.empty": "Noch nichts eingelagert.",
	"stock.no_date": "ohne Datum",
	"stock.search_hint": "Suchen (Name, Marke, EAN, Kategorie, Lagerort)",
	"stock.take_one": "1 Pkg. „{name}“ auslagern",
	"stock.taken_one": "1 Pkg. „{name}“ ausgelagert.",
	"stock.undo": "Rückgängig",
	"stock.edit_batch": "Charge „{name}“ ({location}) bearbeiten",
	"stock.with_empty": "Auch Produkte ohne Bestand",
	"stock.zero_hint": "0 entfernt die Charge an diesem Lagerort.",
	"expiry.days": "Warnschwelle",
	"expiry.days_placeholder": "je Produkt",
	"expiry.days_invalid": "Ganze Zahl ab 0",
	"expiry.empty": "Nichts läuft bald ab.",
	"settings.category.min_packages": "Mindestanzahl",
	"settings.category.min_hint": "Gilt für die Kategorie samt Unterkategorien; Mindestwerte darunter werden mitgezählt. Fehlt etwas, steht es auf der Einkaufsliste.",
	"shopping.empty": "Nichts unter dem Mindestbestand, nichts vorgemerkt.",
	"shopping.print": "Einkaufszettel drucken",
	"shopping.printed": "Einkaufszettel gedruckt (Einträge: {n}).",
	"shopping.missing": "{what} fehlen",
	"shopping.missing_more": "weitere {what} fehlen (beliebig aus der Kategorie)",
	"shopping.and": " und ",
	"shopping.unknown": "Nicht mitgezählt: {n} ohne Inhaltsangabe",
	"shopping.recipes.title": "Für Rezepte",
	"shopping.recipe.title": "„{name}“ auf die Einkaufsliste setzen",
	"shopping.recipe.no": "Rezept {no}",
	"shopping.ref.title": "Rezept {no} ({name}): {amount}",
	"shopping.ref.title_plain": "Rezept {no} ({name})",
	"shopping.recipe.optional": "Optionale Zutaten mitkaufen",
	"shopping.recipe.submit": "Übernehmen",
	"recipes.to_shopping": "Auf die Einkaufsliste",
	"recipes.on_shopping": "Auf der Einkaufsliste: {what}",
	"shopping.any": "beliebig aus der Kategorie",
	"shopping.add.title": "Zur Einkaufsliste hinzufügen",
	"shopping.add.what": "Produkt oder Kategorie",
	"shopping.add.pick": "Bitte einen Treffer wählen oder neu anlegen.",
	"shopping.add.category": "Kategorie {path}",
	"shopping.add.new_product": "Neues Produkt „{name}“ anlegen",
	"shopping.add.new_category": "Neue Kategorie „{name}“ anlegen",
	"shopping.add.creates_product": "Das Produkt wird beim Speichern angelegt.",
	"shopping.add.creates_category": "Die Kategorie wird beim Speichern angelegt.",
	"shopping.add.change": "Ändern",
	"shopping.add.packages": "Anzahl",
	"delete.affected": "Das betrifft auch:",
	"delete.all": "Alles löschen",
	"delete.more": " und {n} weitere",
	"delete.stock": "Bestand an diesem Lagerort",
	"delete.move_to": "Umlagern nach „{name}“",
	"delete.book_out": "Entfernen (wird ausgebucht)",
	"settings.unit.delete_hint": "Was die Einheit nur verwendet, bleibt erhalten und verliert den Bezug: die Einheit wird wieder geerbt, Mindestmenge bzw. Inhaltsangabe entfallen.",
	"delete.kind.delete.category": "Unterkategorien werden gelöscht ({n})",
	"delete.kind.delete.product": "Produkte werden gelöscht ({n})",
	"delete.kind.delete.stock": "Bestand geht verloren ({n} Produkte)",
	"delete.kind.location_stock": "Bestand an diesem Lagerort ({n} Produkte)",
	"delete.kind.delete.booking": "Buchungen werden gelöscht ({n})",
	"delete.kind.delete.shopping_item": "Einträge auf der Einkaufsliste werden gelöscht ({n})",
	"delete.kind.delete.unit": "Darauf aufbauende Einheiten werden gelöscht ({n})",
	"delete.kind.change.category": "Kategorien, die darauf verweisen ({n})",
	"delete.kind.change.product": "Produkte, die darauf verweisen ({n})",
	"delete.kind.change.recipe_ingredient": "Rezepte, deren Zutaten darauf verweisen ({n})",
	"delete.kind.change.defaults": "Standards verweisen darauf",
	"delete.kind.other": "Weitere Daten in „{table}“ ({n})",
	"label.print": "Etiketten drucken",
	"label.print_name": "Etiketten für {name} drucken",
	"label.title": "Etiketten für „{name}“ drucken",
	"label.count": "Anzahl",
	"label.in_stock": "{n} Packungen im Lager",
	"label.submit": "Drucken",
	"valid.label_count": "Bitte eine ganze Zahl von 1 bis {max} eingeben.",
	"label.confirm_many": "{n} Etiketten drucken?",
	"label.printed": "{n} Etiketten gedruckt",
	"book.done_label": "1 × {name} aus {where} ausgebucht",
	"recipes.add": "Rezept hinzufügen",
	"recipes.import.open": "Importieren",
	"recipes.import.title": "Rezept importieren",
	"recipes.import.url": "Adresse (URL)",
	"recipes.import.hint": "Seiten mit Rezeptdaten nach schema.org, z. B. Chefkoch",
	"recipes.import.submit": "Importieren",
	"recipes.ingredient.line": "Original: {line}",
	"recipes.ingredient.unit_new": "Neue Einheit …",
	"recipes.ingredient.unit_unknown": "Einheit „{unit}“ ist unbekannt",
	"recipes.ingredient.unit_create": "Anlegen",
	"unit_add.title": "Einheit hinzufügen",
	"unit_add.name": "Name",
	"unit_add.symbol": "Kürzel",
	"recipes.search": "Rezept oder Zutat suchen",
	"recipes.empty": "Noch keine Rezepte.",
	"recipes.no_hits": "Keine Treffer.",
	"recipes.summary": "{available} von {total} vorhanden",
	"recipes.portion": "{n} Portion",
	"recipes.portions": "{n} Portionen",
	"recipes.servings": "Portionen",
	"recipes.instructions": "Zubereitung",
	"recipes.source": "Quelle",
	"recipes.optional": "(optional)",
	"recipes.status.available": "vorhanden",
	"recipes.status.missing": "fehlt {what}",
	"recipes.status.missing_plain": "fehlt",
	"recipes.status.partial": "teilweise: {have} von {need} {unit}",
	"recipes.status.unknown": "Menge unbekannt",
	"recipes.status.skipped": "nicht geprüft",
	"recipes.status.unmatched": "keine Zutat zugeordnet",
	"recipes.field.instructions": "Zubereitung",
	"recipes.field.source_url": "Quelle (Link)",
	"recipes.field.image_url": "Bild (Link)",
	"recipes.ingredients": "Zutaten",
	"recipes.ingredient.text": "Zutat",
	"recipes.ingredient.amount": "Menge",
	"recipes.ingredient.unit": "Einheit",
	"recipes.ingredient.note": "Hinweis",
	"recipes.ingredient.via": "über {name}",
	"recipes.ingredient.new_type": "Neue Produktart „{name}“ anlegen",
	"recipes.ingredient.parent": "Übergeordnete Kategorie für die neue Produktart „{name}“",
	"recipes.ingredient.unmatched": "noch keiner Zutat zugeordnet",
	"recipes.ingredient.optional": "optional",
	"recipes.ingredient.skip_stock": "Nicht gegen den Vorrat prüfen",
	"recipes.ingredient.remove": "Zutat entfernen",
	"recipes.ingredient.add": "Zutat hinzufügen",
	"recipes.ingredient.none": "keine Menge",
	"valid.servings": "Bitte eine ganze Zahl von 1 bis 99 eingeben.",
	"valid.url": "Bitte einen Link mit http:// oder https:// angeben.",
	"valid.ingredient_what": "Bitte eine Produktart oder Kategorie wählen.",
	"valid.amount_pair": "Menge und Einheit nur zusammen angeben.",
	"tip.unit_id": "Einheit für Mengen in dieser Kategorie, z. B. für Mindestmenge und Rezepte.",
	"tip.default_location_id": "Hier landen neue Packungen beim Einbuchen, wenn du keinen anderen Lagerort wählst.",
	"tip.expiry_type": "Mindesthaltbarkeit: danach oft noch gut. Verbrauchsdatum: danach nicht mehr essen.",
	"tip.warn_days": "So viele Tage vor dem Datum gilt eine Packung als bald ablaufend (orange, Tab „Ablauf“).",
	"tip.min_stock": "Ist weniger da (diese Kategorie samt Unterkategorien), kommt der Rest auf die Einkaufsliste.",
	"tip.min_packages": "Sind weniger Packungen da (samt Unterkategorien), kommt der Rest auf die Einkaufsliste.",
	"tip.product_min_packages": "Sind weniger Packungen dieses Produkts da, kommt es auf die Einkaufsliste. Zählt auch für die Mindestmengen seiner Kategorien.",
	"tip.content": "Inhalt einer Packung, z. B. 500 g (bei Konserven das Abtropfgewicht). Damit rechnen Mindestmengen und Rezepte.",
	"tip.make_default": "Der gewählte Lagerort wird zum Standard-Lagerort dieses Produkts.",
	"tip.print": "Druckt pro Packung ein Etikett mit QR-Code (höchstens 20).",
	"tip.optional": "Optionale Zutaten zählen nicht zur Verfügbarkeit des Rezepts.",
	"tip.skip_stock": "Für Zutaten, die du nicht im Vorrat führst (z. B. Salz, Wasser): keine Prüfung, nie auf der Einkaufsliste."
}, $e = { de: k }, et = k;
function tt(e) {
	let t = e ?? "";
	et = $e[t] ?? $e[t.split("-")[0]] ?? k;
}
function A(e, t) {
	let n = et[e] ?? k[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var j = o`
  :host {
    display: block;
    color: var(--primary-text-color);
  }
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
  .primary {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--divider-color);
  }
  li .row {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    border: 0;
    padding: 10px 8px;
    text-align: left;
  }
  .detail,
  .empty {
    color: var(--secondary-text-color);
    font-size: 0.875em;
    margin: 0;
  }
  dialog {
    width: min(480px, calc(100vw - 32px));
    box-sizing: border-box;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  h2 {
    margin: 0 0 12px;
    font-size: 1.25em;
    font-weight: 500;
  }
  label {
    display: block;
    margin-bottom: 12px;
  }
  .lbl {
    display: block;
    margin-bottom: 4px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  input:not([type="checkbox"], [type="radio"]),
  select {
    font: inherit;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--primary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 4px;
  }
  /* Inherited values (no own value) in secondary color, see CLAUDE.md UI rules. */
  select.unset,
  input::placeholder {
    color: var(--secondary-text-color);
    opacity: 1;
  }
  option {
    color: var(--primary-text-color);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .error {
    color: var(--error-color);
    margin: 0 0 12px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .num,
  .inh {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .num {
    flex: 1;
  }
  .reset {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  .field {
    margin-bottom: 12px;
  }
  .pair {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
  }
  .field-error,
  .field-hint {
    display: block;
    margin-top: 4px;
    font-size: 0.875em;
    color: var(--error-color);
  }
  .field-hint {
    color: var(--warning-color);
  }
  /* Errors only after the field was edited or left (data-touched, set in pantry-panel.ts):
     an empty form does not open in red; the primary button is disabled anyway. */
  .field-error {
    display: none;
  }
  :has([data-touched]) > .field-error {
    display: block;
  }
  [aria-invalid="true"][data-touched] {
    border-color: var(--error-color) !important;
  }
  /* a field label with a tooltip (title) explaining it */
  .lbl[title],
  label.check[title] {
    text-decoration: underline dotted var(--secondary-text-color);
    text-underline-offset: 3px;
    cursor: help;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  /* a submit is running (editDialog ignores further submits meanwhile) */
  form[data-busy] .primary {
    opacity: 0.5;
    cursor: progress;
  }
  /* tree open/close arrow (chevron() in ui.ts); the empty span keeps rows without one aligned */
  .chev,
  .icon-btn {
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
  }
  dialog .actions {
    justify-content: flex-end;
  }
`, nt = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, rt = class extends O {
	constructor(...e) {
		super(...e), this.ok = !1;
	}
	firstUpdated() {
		let e = this.renderRoot.querySelector("dialog");
		e.showModal(), e.querySelector("[data-testid=confirm-cancel]").focus();
	}
	answer(e) {
		this.ok = e, this.renderRoot.querySelector("dialog").close();
	}
	backdrop(e) {
		nt(e) && e.target.close();
	}
	render() {
		return S`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? S`<p>${this.o.message}</p>` : w} ${this.o.body ?? w}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${A("common.cancel")}
        </button>
        <button
          class=${this.o.danger ? "danger" : "primary"}
          data-testid="confirm-ok"
          @click=${() => this.answer(!0)}
        >
          ${this.o.action}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [j, o`
      dialog {
        width: min(400px, calc(100vw - 32px));
      }
      p {
        margin: 0 0 16px;
        color: var(--secondary-text-color);
      }
      .actions {
        justify-content: flex-end;
      }
      ul.impact {
        margin: -8px 0 16px;
      }
      ul.impact li {
        display: block;
        padding: 6px 0;
      }
      .kind {
        display: block;
        font-weight: 500;
      }
      .names {
        display: block;
        font-size: 0.875em;
        color: var(--secondary-text-color);
      }
      .danger {
        background: var(--error-color);
        border-color: var(--error-color);
        color: var(--text-primary-color, #fff);
      }
    `];
	}
};
customElements.define("pantry-confirm", rt);
function M(e) {
	return new Promise((t) => {
		let n = document.createElement("pantry-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var it = (e, t) => M({
	title: A("common.delete_name", { name: e }) + "?",
	message: t,
	action: A("common.delete"),
	danger: !0
}), N = (e) => S`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${we`<path d=${e} fill="currentColor"></path>`}
  </svg>`, at = !1;
async function ot(e, t) {
	if (!t?.()) return e.close();
	if (!at) {
		at = !0;
		try {
			await M({
				title: A("common.discard"),
				action: A("common.discard_ok")
			}) && e.close();
		} finally {
			at = !1;
		}
	}
}
var st = (e) => (t) => {
	nt(t) && ot(t.target, e);
}, ct = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), ot(t.currentTarget, e));
};
async function lt(e, t) {
	let n = e.currentTarget;
	if (n.hasAttribute("data-busy")) return e.preventDefault();
	n.setAttribute("data-busy", "");
	try {
		await t(e);
	} finally {
		n.removeAttribute("data-busy");
	}
}
var P = (e) => S`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${st(e.dirty)}
    @keydown=${ct(e.dirty)}
    @cancel=${ct(e.dirty)}
  >
    <form @submit=${(t) => lt(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? S`<p class="error" role="alert">${e.error}</p>` : w}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${A("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
        >
          ${e.submit?.label ?? A("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, F = (e, t) => S`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${A(e ? "common.collapse" : "common.expand")}
    title=${A(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${N(e ? Ve : He)}
  </button>`;
function I(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var L = (e) => S`${e.onAdd ? S`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            title=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${N(Xe)}
          </button>` : w}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${A("common.edit_name", { name: e.name })}
      title=${A("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${N(Ye)}
    </button>
    ${e.onDelete ? S`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${A("common.delete_name", { name: e.name })}
            title=${A("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${N(We)}
          </button>` : w}`, R = (e, t, n = !1) => e ? S`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : w, ut = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, dt = (e) => e >= "2000-01-01" && e <= "2099-12-31", ft = (e, t) => e || !!t && !dt(t), z = (e) => e === "" ? null : Number(e), pt = /^https?:\/\//i, B = (e) => !!e?.user?.is_admin;
async function V(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var H = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), U = (e) => e.callWS({ type: "pantry/master_data" }), mt = (e, t, n) => e.callWS({
	type: "pantry/save",
	table: t,
	data: n
}), ht = (e, t) => e.callWS({
	type: "pantry/defaults_save",
	data: t
}), gt = (e, t, n, r = {}) => e.callWS({
	type: "pantry/delete",
	table: t,
	row_id: n,
	...r
}), _t = (e, t, n) => e.callWS({
	type: "pantry/delete_impact",
	table: t,
	row_id: n
}), vt = (e, t, n) => e.callWS({
	type: "pantry/product_type_add",
	name: t,
	parent_id: n
}), yt = (e, t) => e.callWS({
	type: "pantry/lookup",
	code: t
}), bt = (e, t, n = !1) => e.callWS({
	type: "pantry/search",
	query: t,
	online: n
}), xt = (e, t) => e.callWS({
	type: "pantry/book_in",
	...t
}), St = (e, t) => e.callWS({
	type: "pantry/book_out",
	...t
}), Ct = (e, t) => e.callWS({
	type: "pantry/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), wt = (e, t) => e.callWS({
	type: "pantry/stock_edit",
	...t
}), W = (e, t) => e.callWS({
	type: "pantry/stock",
	product_id: t
}), Tt = (e) => e.callWS({ type: "pantry/products" }), Et = (e, t) => e.callWS({
	type: "pantry/product_save",
	data: t
}), Dt = (e) => e.callWS({ type: "pantry/label_config" }), Ot = (e, t) => e.callWS({
	type: "pantry/print_labels",
	...t
}), kt = (e) => e.callWS({ type: "pantry/print_shopping_list" }), At = (e, t) => e.callWS({
	type: "pantry/book_out_label",
	code: t
}), jt = (e) => e.callWS({ type: "pantry/recipes" }), Mt = (e, t, n) => e.callWS({
	type: "pantry/recipe_availability",
	recipe_id: t,
	servings: n
}), Nt = (e, t) => e.callWS({
	type: "pantry/recipe_save",
	data: t
}), Pt = (e, t) => e.callWS({
	type: "pantry/recipe_import",
	url: t
}), Ft = (e, t, n) => e.callWS({
	type: "pantry/unit_add",
	name: t,
	symbol: n
}), G = (e) => e?.locale?.language ?? e?.language, It = (e, t) => new Intl.DateTimeFormat(G(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), K = (e, t) => new Intl.NumberFormat(G(e)).format(t), Lt = (e, t, n, r, i = t) => A(new Intl.PluralRules(G(e)).select(t) === "one" ? n : r, { n: i }), Rt = (e, t) => Lt(e, Number(t), "settings.day", "settings.days", t), q = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), J = (e, t, n = "") => `${K(e, t)} ${n ?? ""}`.trim(), zt = (e, t) => Lt(e, t, "recipes.portion", "recipes.portions");
//#endregion
//#region src/inherit.ts
function Y(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function X(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n],
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: A("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: A("settings.inherit_from", { name: a ?? "" })
	};
}
var Bt = (e, t) => S`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${N(Ze)}${A("common.reset")}
  </button>`;
function Vt(e) {
	let t = e.own ?? null;
	return S`<span class="inh">
    <select
      data-testid=${e.testid}
      class=${t == null ? "unset" : ""}
      aria-invalid=${!!e.invalid}
      ?required=${!e.dflt && !e.optional}
      @change=${(t) => {
		let n = t.target.value;
		e.onChange(n === "" ? null : e.numeric ? Number(n) : n);
	}}
    >
      <option value="" .selected=${t == null}>
        ${e.dflt ? A("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : A(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => S`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? w : Bt(e.testid, () => e.onChange(null))}
  </span>`;
}
function Ht(e) {
	let t = e.own ?? null;
	return S`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? A("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(z(n));
	}}
    />
    ${e.suffix ? S`<span class="detail">${e.suffix}</span>` : w}
    ${t == null ? w : Bt(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var Ut = class extends O {
	static {
		this.properties = {
			categories: { attribute: !1 },
			value: { attribute: !1 },
			noneLabel: { attribute: !1 },
			exclude: { attribute: !1 },
			expanded: { state: !0 },
			filter: { state: !0 },
			draft: { state: !0 },
			hass: { attribute: !1 },
			creating: { state: !0 },
			failure: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.categories = [], this.value = null, this.expanded = /* @__PURE__ */ new Set(), this.filter = "", this.draft = void 0, this.busy = !1;
	}
	chain(e) {
		let t = [];
		for (let n = e; n != null; n = this.categories.find((e) => e.id === n)?.parent_id ?? null) t.unshift(n);
		return t;
	}
	kids(e) {
		return this.categories.filter((t) => t.parent_id === e && t.id !== this.exclude).sort((e, t) => e.sort - t.sort);
	}
	async open() {
		this.filter = "", this.creating = this.failure = void 0, this.draft = this.value ?? (this.noneLabel ? null : void 0), this.expanded = new Set(this.chain(this.value)), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("[aria-current=true], input")?.focus();
	}
	async confirm() {
		if (this.creating) return this.create(this.draft);
		this.renderRoot.querySelector("dialog").close(), this.draft !== void 0 && this.dispatchEvent(new CustomEvent("change", { detail: this.draft }));
	}
	startCreate(e) {
		this.creating = e, this.filter = "", this.draft = void 0;
	}
	async create(e) {
		if (!(e == null || this.busy)) {
			this.busy = !0;
			try {
				let { id: t } = await vt(this.hass, this.creating, e), n = await U(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await V(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = I(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => q(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: Y(this.categories, e.id)
		}));
		let t = [], n = (e, r) => this.kids(e).forEach((e) => {
			t.push({
				c: e,
				depth: r,
				label: e.name
			}), this.expanded.has(e.id) && n(e.id, r + 1);
		});
		return n(null, 0), t;
	}
	filterKey(e) {
		if (e.key !== "Enter") return;
		e.preventDefault();
		let [t] = this.rows();
		t && (this.draft = t.c.id);
	}
	render() {
		let e = this.rows(), t = this.filter.trim(), n = !!t, r = this.hass && !this.creating && n && !this.categories.some((e) => e.name.toLocaleLowerCase() === t.toLocaleLowerCase());
		return S`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? A("book.choose") : Y(this.categories, this.value)}
        </span>
        ${N(qe)}
      </button>
      <dialog @click=${st()}>
        <h2>
          ${this.creating ? A("book.choose_parent", { name: this.creating }) : A("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${A("book.filter")}
          placeholder=${A("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !n && !this.creating ? S`<li>
                  <span class="chev"></span>
                  <button
                    type="button"
                    class="row"
                    data-testid="category-option"
                    aria-current=${this.draft === null}
                    @click=${() => this.draft = null}
                    @dblclick=${this.confirm}
                  >
                    ${this.noneLabel}
                  </button>
                </li>` : w}
          ${e.map(({ c: e, depth: t, label: r }) => {
			let i = !n && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return S`<li style="padding-left: ${t * 20}px">
              ${i ? F(a, () => this.toggle(e.id)) : n ? w : S`<span class="chev"></span>`}
              <button
                type="button"
                class="row"
                data-testid="category-option"
                aria-current=${e.id === this.draft}
                @click=${() => this.mark(e.id)}
                @dblclick=${this.confirm}
              >
                ${r}
              </button>
            </li>`;
		})}
        </ul>
        ${r ? S`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(t)}
              >
                ${A("book.create_category", { name: t })}
              </button>` : e.length ? w : S`<p class="empty">${A("book.no_hits")}</p>`}
        ${this.failure ? S`<p class="error" role="alert">${this.failure}</p>` : w}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${A("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${A("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [j, o`
      :host {
        display: block;
      }
      .field {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px;
        text-align: left;
        background: var(--card-background-color, var(--primary-background-color));
      }
      .unset {
        color: var(--secondary-text-color);
      }
      dialog input {
        margin-bottom: 8px;
      }
      ul {
        max-height: 55vh;
        overflow-y: auto;
        margin-bottom: 12px;
      }
      .row[aria-current="true"] {
        color: var(--primary-color);
        font-weight: 500;
      }
    `];
	}
};
customElements.define("pantry-category-picker", Ut);
//#endregion
//#region src/settings-format.ts
function Wt(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function Gt(e, t) {
	return t === "default" ? A("settings.inherit_default") : A("settings.inherit_from", { name: Wt(e, t) });
}
function Kt(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: e.defaults[t],
		source: "default"
	};
}
function Z(e, t, n, r) {
	if (r == null) return A("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : A("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? A("common.none_dash") : n === "expiry_type" ? A(`settings.expiry.${r}`) : Rt(t, r);
}
//#endregion
//#region src/min-stock.ts
function qt(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = A("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = A("valid.packages")), t;
}
function Jt(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return S`<label>
      <span class="lbl" title=${A("tip.min_stock")}>${A("settings.category.min_stock")}</span>
      <span class="num">
        <input
          type="number"
          step="any"
          min="0"
          data-testid="min_stock"
          aria-invalid=${!!n.min_stock}
          .value=${String(t.min_stock ?? "")}
          @input=${(n) => {
		let i = r(n);
		e.set("min_stock", i), e.set("min_stock_unit_id", i == null ? null : t.min_stock_unit_id ?? e.unitId);
	}}
        />
        <select
          data-testid="min_stock_unit"
          aria-label=${A("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${H(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => S`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${R(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${A("tip.min_packages")}>${A("settings.category.min_packages")}</span>
      <span class="num">
        <input
          type="number"
          step="1"
          min="0"
          inputmode="numeric"
          data-testid="min_packages"
          aria-invalid=${!!n.min_packages}
          .value=${String(t.min_packages ?? "")}
          @input=${(t) => e.set("min_packages", r(t))}
        />
        <span class="detail">${A("book.packages")}</span>
      </span>
      ${R(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${A("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-model.ts
var Yt = {
	unit: [
		"name",
		"symbol",
		"base_unit_id",
		"factor",
		"is_count",
		"recipe_only"
	],
	location: ["name"],
	category: [
		"parent_id",
		"name",
		"unit_id",
		"default_location_id",
		"expiry_type",
		"warn_days",
		"min_stock",
		"min_stock_unit_id",
		"min_packages"
	]
}, Xt = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, Zt = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			data: { attribute: !1 },
			edit: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.errs = {}, this.error = "";
	}
	open(e, t, n = {}) {
		this.error = "";
		let r = {};
		for (let i of Yt[e]) r[i] = t?.[i] ?? n[i] ?? null;
		t && (r.id = t.id), e === "unit" && (r.is_count ??= 0, r.recipe_only ??= 0, r.factor ??= 1, r.symbol ??= ""), r.name ??= "", this.edit = {
			table: e,
			d: r,
			orig: { ...r }
		};
	}
	updated(e) {
		if (!e.has("edit")) return;
		let t = this.renderRoot.querySelector("dialog");
		t && this.edit && (t.open || t.showModal(), t.querySelector("input:not([type=checkbox]), select")?.focus());
	}
	set(e, t) {
		let n = this.edit.d;
		n[e] = t, e === "base_unit_id" && t == null && (n.factor = 1), this.requestUpdate();
	}
	errors() {
		let { table: e, d: t } = this.edit, n = {}, r = String(t.name ?? "").trim(), i = this.data, a = e === "category" ? i.categories.filter((e) => e.parent_id === (t.parent_id ?? null)) : e === "unit" ? i.units : i.locations;
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = A("valid.duplicate")) : n.name = A("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = A("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = A("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = A("valid.days")), Object.assign(n, qt(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Yt[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await mt(this.hass, t, r);
		} catch (e) {
			this.error = await V(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t, n) {
		return S`<label><span class="lbl" title=${n ?? w}>${e}</span>${t}</label>`;
	}
	text(e) {
		return S`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${R(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return S`<span class="num"
        ><input
          type="number"
          step=${e === "warn_days" ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value;
			this.set(e, z(n));
		}}
        />${n ? S`<span class="detail">${n}</span>` : w}</span
      >${e === "warn_days" ? w : R(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return S`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" .selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => S`<option value=${e} .selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? w : S`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${N(Ze)}${A("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = Kt(i, e, this.edit.d.parent_id), o = Z(i, this.hass, e, a.value), s = Gt(i, a.source), c = e === "warn_days" ? this.numInput(e, A("common.default", {
			value: o,
			source: s
		}), A("common.days_unit")) : this.select(e, n, A("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, S`<span class="inh">${c}${this.reset(e)}</span
        >${R(this.errs[e], e)}`, A(`tip.${e}`));
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return S`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(A("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = H(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = S`${this.field(A("common.name"), this.text("name"))}${this.field(A("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${A("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${A("settings.unit.recipe_only")}</label
        >
        ${R(A("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(A("settings.unit.base"), this.select("base_unit_id", e, A("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(A("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? Kt(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = S`${this.field(A("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${A("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${A("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh("unit_id", A("settings.category.unit"), H(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", A("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", A("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, A(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", A("settings.category.warn_days"), [])}
        ${Jt({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? S`<p class="detail">${A("settings.category.off_tags", { tags: t.join(", ") })}</p>` : w}`;
		}
		let c = () => Yt[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? Wt(i, n.parent_id) : "";
		return P({
			title: n.id ? A("common.edit_name", { name: r.name }) : l ? A("settings.category.add_sub_to", { name: l }) : A(Xt[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [j];
	}
};
customElements.define("pantry-settings-dialog", Zt);
//#endregion
//#region src/defaults-view.ts
var Qt = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"]
], $t = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			data: { attribute: !1 },
			d: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.error = "";
	}
	async open() {
		this.error = "", this.d = { ...this.data.defaults }, this.orig = { ...this.d }, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog select")?.focus();
	}
	set(e, t) {
		this.d = {
			...this.d,
			[e]: t
		};
	}
	warnError(e) {
		let t = e.warn_days;
		return t === null || !Number.isInteger(t) || t < 0 ? A("valid.days") : void 0;
	}
	async save(e) {
		if (e.preventDefault(), !this.warnError(this.d)) try {
			await ht(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? S`<p class="detail intro">${A("settings.defaults.hint")}</p>
      <ul>
        ${Qt.map(([t, n]) => S`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${A(n)}</span>
                <span class="detail">${Z(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${L({
			testid: "default",
			name: A(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : S``;
	}
	select(e, t) {
		let n = this.d;
		return S`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => S`<option value=${t ?? ""} .selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return S`<dialog></dialog>`;
		let n = this.warnError(t);
		return P({
			title: A("settings.defaults.edit"),
			body: S`<label>
          <span class="lbl" title=${A("tip.unit_id")}>${A("settings.category.unit")}</span>
          ${this.select("unit_id", H(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${A("tip.default_location_id")}
            >${A("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, A("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${A("tip.expiry_type")}
            >${A("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", ["best_before", "use_by"].map((e) => [e, A(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${A("tip.warn_days")}>${A("settings.category.warn_days")}</span>
          <span class="num">
            <input
              data-testid="default-warn_days"
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              aria-invalid=${!!n}
              .value=${String(t.warn_days ?? "")}
              @input=${(e) => {
				let t = e.target.value;
				this.set("warn_days", z(t));
			}}
            />
            ${A("common.days_unit")}
          </span>
          ${R(n, "default-warn_days")}
        </label>`,
			error: this.error,
			invalid: !!n,
			dirty: () => Qt.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-defaults", $t);
//#endregion
//#region src/delete-flow.ts
var en = 5, tn = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = A(r, { n });
	return i === r ? A("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, nn = (e) => {
	let t = e.names.length - en;
	return e.names.slice(0, en).join(", ") + (t > 0 ? A("delete.more", { n: t }) : "");
};
async function rn(e, t, n, r) {
	let i = n === "location" || n === "unit" ? A(`settings.${n}.delete_hint`) : void 0, a = await _t(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "pantry",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await it(r.name, i) ? (await gt(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = S`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => S`<li>
            <span class="kind">${tn(n, e)}</span>
            <span class="names">${nn(e)}</span>
            ${e.packages ? S`<span class="names">${A("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? S`<label>
            <span class="lbl">${A("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => S`<option value=${e.id}>${A("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${A("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await M({
		title: A("common.delete_name", { name: r.name }) + "?",
		message: i ?? A("delete.affected"),
		body: c,
		action: A(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await gt(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var an = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null
}, on = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			section: { attribute: !1 },
			data: { state: !0 },
			pageError: { state: !0 },
			expanded: { state: !0 }
		};
	}
	constructor() {
		super(), this.loaded = !1, this.pageError = "", this.expanded = /* @__PURE__ */ new Set();
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.loaded && (this.loaded = !0, this.load());
	}
	get sec() {
		return this.section && this.section in an ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await U(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await V(this.hass, e);
		}
	}
	nav(e) {
		this.dispatchEvent(new CustomEvent("pantry-navigate", {
			detail: `settings/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	open(e, t, n = {}) {
		this.renderRoot.querySelector("pantry-settings-dialog")?.open(e, t, n);
	}
	tree() {
		let e = this.data.categories, t = [], n = (r, i) => {
			for (let a of e.filter((e) => e.parent_id === r)) {
				let r = e.some((e) => e.parent_id === a.id);
				t.push({
					c: a,
					depth: i,
					hasKids: r
				}), r && n(a.id, i + 1);
			}
		};
		return n(null, 0), t;
	}
	visible() {
		let e = new Map(this.data.categories.map((e) => [e.id, e]));
		return this.tree().filter(({ c: t }) => {
			for (let n = t.parent_id; n != null; n = e.get(n)?.parent_id ?? null) if (!this.expanded.has(n)) return !1;
			return !0;
		});
	}
	toggle(e) {
		this.expanded = I(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => Z(t, this.hass, n, e[n]));
		if (e.min_stock != null) {
			let r = Z(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(A("settings.category.min", { value: `${K(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(A("settings.category.min", { value: A("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = an[e];
		return S`
      <nav aria-label=${A("settings.nav")}>
        ${Object.keys(an).map((t) => S`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${A(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? S`<p class="error" role="alert">${this.pageError}</p>` : w}
      ${this.data ? t ? S`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${A(Xt[t])}
                  </button>
                </div>
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : S`<pantry-defaults
                .hass=${this.hass}
                .data=${this.data}
                @pantry-saved=${this.load}
              ></pantry-defaults>` : w}
      <pantry-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @pantry-saved=${this.load}
      ></pantry-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? w : S`<p class="empty">${A("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = w, a = w) {
		return S`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" data-testid="settings-row" @click=${n}>
        <span>${e}</span>${t ? S`<span class="detail">${t}</span>` : w}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return L({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: A("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await rn(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await V(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return S`<ul>
        ${e.map((e) => this.row(e.name, "", () => this.open("location", e), 0, w, this.actions("location", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderUnits() {
		let { units: e } = this.data, t = (t) => {
			let n = e.find((e) => e.id === t.base_unit_id);
			return [
				t.symbol,
				t.recipe_only ? A("settings.unit.recipe_only") : "",
				n ? `= ${K(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? A("settings.unit.no_conversion") : t.is_count ? A("settings.unit.count") : ""
			].filter(Boolean).join(" · ");
		};
		return S`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, w, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return S`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? F(r, () => this.toggle(e.id)) : S`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [j, o`
      nav {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
      }
      nav button[aria-current="page"] {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
      .bar {
        margin-bottom: 8px;
      }
    `];
	}
};
customElements.define("pantry-settings", on);
//#endregion
//#region src/scanner.ts
var sn = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function cn() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: sn.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-Dml86taW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...sn] });
}
var ln = class extends O {
	static {
		this.properties = { error: { state: !0 } };
	}
	constructor() {
		super(), this.error = "";
	}
	async open() {
		this.error = "", await this.updateComplete;
		let e = this.renderRoot.querySelector("dialog");
		if (e.showModal(), !navigator.mediaDevices?.getUserMedia) {
			this.error = A("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = A("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await cn();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = A("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = A("scan.no_camera");
			return;
		}
		let i = async () => {
			let [t] = await n.detect(r).catch(() => []);
			e.open && (t ? (e.close(), this.dispatchEvent(new CustomEvent("scan", { detail: t.rawValue }))) : this.timer = window.setTimeout(i, 250));
		};
		this.timer = window.setTimeout(i, 250);
	}
	stop() {
		clearTimeout(this.timer), this.stream?.getTracks().forEach((e) => e.stop()), this.stream = void 0;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stop();
	}
	render() {
		return S`<dialog data-testid="scanner" @close=${this.stop} @click=${st()}>
      <h2>${A("scan.title")}</h2>
      ${this.error ? S`<p class="error" role="alert">${this.error}</p>` : S`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${A("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [j, o`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-scanner", ln);
//#endregion
//#region src/booking-scan.ts
var un = class extends O {
	static {
		this.properties = { value: { attribute: !1 } };
	}
	focusInput() {
		this.updateComplete.then(() => this.renderRoot.querySelector("#code")?.focus());
	}
	fire(e, t) {
		this.dispatchEvent(new CustomEvent(e, { detail: t }));
	}
	submit(e) {
		e.preventDefault(), this.fire("find", this.value);
	}
	scanned(e) {
		this.fire("query", e.detail), this.fire("find", e.detail);
	}
	render() {
		return S`
      <form class="scan" @submit=${this.submit}>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${A("book.input")}
          placeholder=${A("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          @click=${() => this.renderRoot.querySelector("pantry-scanner")?.open()}
        >
          ${N(Be)}<span>${A("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
    `;
	}
	static {
		this.styles = [j, o`
      .scan {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .scan input {
        flex: 1;
      }
      .scan button {
        flex: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
    `];
	}
};
customElements.define("pantry-booking-scan", un);
//#endregion
//#region src/product-fields.ts
var dn = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
});
function fn(e) {
	let t = {};
	return e.name.trim() || (t.name = A("valid.required")), e.category_id ?? (t.category = A("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = A("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = A("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = A("valid.packages")), t;
}
function pn(e, t, n, r = {}, i) {
	return S`<label>
      <span class="lbl">${A("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${R(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${A("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${A("book.category")}</span>
      <pantry-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></pantry-category-picker>
      ${R(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${A("tip.content")}>${A("book.content")}</span>
        <input
          data-testid="content-amount"
          type="number"
          inputmode="decimal"
          min="0"
          step="any"
          aria-invalid=${!!r.content}
          .value=${t.content_amount == null ? "" : String(t.content_amount)}
          @input=${(e) => {
		let t = e.target.value;
		n("content_amount", z(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${A("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${A("common.none_dash")}</option>
          ${H(e?.units ?? [], t.content_unit_id).map((e) => S`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${R(r.content, "content")}
    <label>
      <span class="lbl" title=${A("tip.product_min_packages")}>${A("products.min_packages")}</span>
      ${Ht({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: A("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${R(r.min_packages, "min-packages")}
    </label>`;
}
function mn(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${K(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/label-print.ts
function hn(e, t, n, r) {
	let i = document.createElement("iframe");
	i.style.cssText = "position:fixed;width:0;height:0;border:0", i.addEventListener("load", async () => {
		let a = i.contentDocument, o = a.createElement("style");
		o.textContent = `@page{size:${n}mm ${r}mm;margin:0}body{margin:0}img{display:block;width:${n}mm;height:${r}mm}img:not(:last-child){break-after:page}`;
		let s = Array.from({ length: t }, () => {
			let t = a.createElement("img");
			return t.src = e, t;
		});
		a.head.append(o), a.body.append(...s), await Promise.all(s.map((e) => e.decode().catch(() => void 0)));
		let c = i.contentWindow;
		c.onafterprint = () => i.remove(), c.print();
	}, { once: !0 }), document.body.append(i);
}
async function gn(e, t, n) {
	if (n > 2 && !await M({
		title: A("label.confirm_many", { n }),
		action: A("label.submit")
	})) return null;
	let r = await Ot(e, {
		batch_id: t,
		count: n
	});
	return "printed" in r ? r.printed : (hn(r.image, r.count, r.width_mm, r.height_mm), 0);
}
//#endregion
//#region src/booking-in-fields.ts
function _n(e, t, n, r) {
	let i = !n.expires && e.expires_on && e.expires_on < ut();
	return S`<label>
    <span class="lbl"
      >${r ? A("book.expires_on_type", { type: A(`settings.expiry.${r}`) }) : A("book.expires_on")}</span
    >
    <input
      id="expires"
      data-testid="expires"
      type="date"
      min="2000-01-01"
      max="2099-12-31"
      aria-invalid=${!!n.expires}
      .value=${e.expires_on}
      @input=${(e) => {
		let n = e.target;
		t({
			expires_on: n.value,
			dateBad: n.validity.badInput
		});
	}}
    />
    ${n.expires || i ? S`${R(n.expires, "expires")}${i ? R(A("valid.past"), "expires", !0) : ""}` : S`<span class="detail">${A("book.no_date_hint")}</span>`}
  </label>`;
}
function vn(e, t, n, r, i, a) {
	return S`<label>
      <span class="lbl">${A("book.location")}</span>
      ${Vt({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${R(i.location, "location")}
    </label>
    ${t.id ? w : S`<label class="check" title=${A("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${A("book.make_default")}
          </label>`}`;
}
function yn(e, t, n) {
	return S`<label class="check" title=${A("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${A("label.print")}
  </label>`;
}
//#endregion
//#region src/booking-pick.ts
var bn = "auto", xn = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), Sn = (e, t) => xn(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Cn(e, t, n, r) {
	let i = (e, t) => S`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return S`<fieldset>
    <legend class="lbl">${A("book.which")}</legend>
    ${i(bn, A("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, S`<span
          >${t.expires_on ? It(e, t.expires_on) : A("book.no_date")} · ${t.location}
          <span class="detail">${A("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var wn = o`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, Tn = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: bn,
	print: null
}), En = null, Dn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			mode: { attribute: !1 },
			product: { attribute: !1 },
			md: { attribute: !1 },
			stock: { attribute: !1 },
			busy: { attribute: !1 },
			run: { attribute: !1 },
			draft: { state: !0 },
			labels: { state: !0 },
			f: { state: !0 }
		};
	}
	constructor() {
		super(), this.set = (e) => this.f = {
			...this.f,
			...e
		}, this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Tn();
	}
	willUpdate(e) {
		e.has("product") && (this.draft = this.product, this.f = Tn(), this.hass && this.mode === "in" && Dt(this.hass).then((e) => this.labels = e, () => void 0));
	}
	focusFirst() {
		let e = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
		this.renderRoot.querySelector(e)?.focus();
	}
	dflt(e) {
		let t = this.draft?.[e];
		if (t != null) return {
			value: t,
			source: A("book.from_product")
		};
		let n = X(this.md, this.draft?.category_id, e);
		if (n) return n;
		if (e === "default_location_id" && En != null) return {
			value: En,
			source: A("book.last_used")
		};
	}
	setProduct(e, t) {
		this.draft = {
			...this.draft,
			[e]: t
		};
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : Object.fromEntries([
				"ean",
				"name",
				"brand",
				"category_id",
				"content_amount",
				"content_unit_id",
				"image_url",
				"off_json",
				"min_packages"
			].map((e) => [e, t[e] === "" ? null : t[e] ?? null]));
			o && this.f.makeDefault && e !== X(this.md, t.category_id, "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => xt(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (En = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => gn(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = xn(this.stock, this.f.pick), i = await this.run(() => St(n, {
				product_id: t.id,
				packages: r,
				...e ? {
					batch_id: e.batch_id,
					location_id: e.location_id
				} : {}
			}));
			if (!i) return;
			o = i.taken;
		}
		let s = A(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${A("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return w;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? S`<h2>${e.name}</h2>
            <p class="empty" data-testid="no-stock">${A("book.no_stock")}</p>` : w;
		let n = this.mode === "out" ? Sn(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return S`<form class="book" @submit=${this.submit}>
      ${t ? S`<h2>
              ${e.name}${e.brand ? S` <span class="detail">${e.brand}</span>` : w}
            </h2>` : S`<h2>${A("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${mn(this.md, e, Y(this.md?.categories, e.category_id), this.hass) || A("book.new_product")}
                ${e.id ? w : S`<span class="detail">${A("book.is_new")}</span>`}
              </p>`}
      ${t ? Cn(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : S`${e.id ? w : pn(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${_n(this.f, this.set, r, this.dflt("expiry_type")?.value)}`}
      <label>
        <span class="lbl">${A("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? w}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${R(r.packages, "packages")}
      </label>
      ${t ? w : S`${vn(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${yn(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${A(`book.submit_${this.mode}`)}
        </button>
        <button
          type="button"
          data-testid="cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
        >
          ${A("common.cancel")}
        </button>
      </div>
    </form>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? fn(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (ft(i, r) && (t.expires = A("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = A("valid.location")));
		let a = this.mode === "out" ? Sn(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = A("valid.packages") : a != null && n > a && (t.packages = A("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			j,
			wn,
			o`
      .book {
        max-width: 480px;
      }
      .book .detail {
        display: block;
        margin-top: 4px;
      }
      h2 .detail {
        display: inline;
      }
      .summary {
        margin: 0 0 12px;
      }
      .summary .detail {
        display: inline;
        margin-left: 4px;
      }
    `
		];
	}
};
customElements.define("pantry-booking-form", Dn);
//#endregion
//#region src/booking-done.ts
function On(e, t, n) {
	return e ? S`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? S`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${A("stock.undo")}
          </button>` : w}
  </p>` : w;
}
var kn = o`
  .done {
    margin: 0 0 12px;
  }
  .undo {
    margin-left: 8px;
    padding: 4px 8px;
    color: var(--primary-color);
  }
`;
//#endregion
//#region src/booking-hits.ts
function An(e, t) {
	return S`
    ${e.length ? w : S`<p class="empty">${A("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => S`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    ${t.more ? S`<div class="actions after">
            ${t.online ? w : S`<button
                    data-testid="search-online"
                    ?disabled=${t.busy}
                    @click=${t.searchOnline}
                  >
                    ${A("book.search_online")}
                  </button>`}
            <button data-testid="new-product" @click=${t.create}>${A("book.new_product")}</button>
          </div>` : w}
  `;
}
//#endregion
//#region src/booking-view.ts
var jn = /^\d{8,14}$/, Mn = /^PTRY:/i, Nn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			mode: { attribute: !1 },
			query: { state: !0 },
			hits: { state: !0 },
			online: { state: !0 },
			product: { state: !0 },
			stock: { state: !0 },
			message: { state: !0 },
			undo: { state: !0 },
			error: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.seq = 0, this.started = !1, this.run = async (e) => {
			this.busy = !0, this.error = "";
			try {
				return await e();
			} catch (e) {
				await this.fail(e);
				return;
			} finally {
				this.busy = !1;
			}
		}, this.mode = "in", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, U(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
	}
	firstUpdated() {
		this.focusInput();
	}
	focusInput() {
		this.renderRoot.querySelector("pantry-booking-scan")?.focusInput();
	}
	async fail(e) {
		this.error = this.hass ? await V(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass) return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, Mn.test(e)) return this.mode === "out" ? this.scanLabel(e.replace(Mn, "")) : void (this.error = A("book.label_out_only"));
		if (jn.test(e)) {
			let r = await this.run(() => yt(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "out" ? void (this.error = A("book.unknown")) : this.choose(dn({ ean: e }));
		}
		let r = await this.run(() => bt(t, e));
		r && n === this.seq && (this.hits = r, this.mode === "out" && r.length === 1 && this.choose(r[0]));
	}
	async scanLabel(e) {
		this.reset();
		let t = this.seq, n = await this.run(() => At(this.hass, e));
		if (t === this.seq) {
			if (!n) return this.focusInput();
			this.message = A("book.done_label", {
				name: n.name,
				where: n.location
			}), this.undo = n.taken, this.focusInput();
		}
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => bt(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => yt(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode === "out" && !e.id) return void (this.error = A("book.unknown"));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => W(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("pantry-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		return S`
      <pantry-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      ></pantry-booking-scan>
      ${On(this.message, this.undo && (() => this.putBack()))}
      ${this.error ? S`<p class="error" role="alert" data-testid="error">${this.error}</p>` : w}
      ${this.hits ? An(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(dn({ name: this.query.trim() }))
		}) : w}
      ${this.renderForm()}
    `;
	}
	renderForm() {
		return this.product ? S`<pantry-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @master=${(e) => (this.md = e.detail, this.requestUpdate())}
      @cancel=${() => (this.reset(), this.focusInput())}
    ></pantry-booking-form>` : w;
	}
	async putBack() {
		let e = this.undo;
		this.undo = void 0, await this.run(() => Ct(this.hass, e)) === void 0 ? this.undo = e : (this.message = A("book.undone"), this.focusInput());
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.focusInput();
	}
	static {
		this.styles = [
			j,
			kn,
			o`
      .after {
        margin-top: 12px;
      }
    `
		];
	}
};
customElements.define("pantry-booking", Nn);
//#endregion
//#region src/stock-data.ts
function Pn(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => q(e.join(" "), a), s = /* @__PURE__ */ new Map();
	for (let t of e) {
		if (n != null && t.location_id !== n || a && !o([
			t.name,
			t.brand,
			t.ean,
			t.location,
			...t.category_path
		])) continue;
		let e = s.get(t.product_id);
		e || (e = {
			id: t.product_id,
			category_id: t.category_id,
			name: t.name,
			brand: t.brand,
			packages: 0,
			batches: []
		}, s.set(t.product_id, e)), e.packages += t.packages, e.batches.push(t);
	}
	if (n == null) for (let e of r) !s.has(e.id) && (!a || o([
		e.name,
		e.brand,
		e.ean,
		Y(i?.categories, e.category_id)
	])) && s.set(e.id, {
		id: e.id,
		category_id: e.category_id,
		name: e.name,
		brand: e.brand,
		packages: 0,
		batches: []
	});
	let c = /* @__PURE__ */ new Map();
	for (let e of s.values()) c.set(e.category_id, [...c.get(e.category_id) ?? [], e]);
	return c;
}
var Fn = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${ut()}T00:00`)) / 864e5);
function In(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = Fn(e.expires_on);
	return i < 0 ? "expired" : i <= (r ?? Number(t?.warn_days ?? X(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function Ln(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = (n) => {
		let [r, o] = [0, 0];
		for (let e of t.get(n) ?? []) [r, o] = [r + e.packages, o + 1];
		for (let t of e.filter((e) => e.parent_id === n)) {
			let [e, n] = a(t.id);
			[r, o] = [r + e, o + n];
		}
		return i.set(n, [r, o]), [r, o];
	}, o = [], s = (c, l) => {
		for (let u of e.filter((e) => e.parent_id === c)) {
			let [e, c] = i.get(u.id) ?? a(u.id);
			if (!c) continue;
			let d = r || n.has(`c${u.id}`);
			if (o.push({
				kind: "category",
				id: u.id,
				name: u.name,
				packages: e,
				depth: l,
				open: d
			}), d) {
				s(u.id, l + 1);
				for (let e of t.get(u.id) ?? []) o.push({
					kind: "item",
					item: e,
					depth: l + 1,
					open: r || n.has(`p${e.id}`)
				});
			}
		}
	};
	return s(null, 0), o;
}
//#endregion
//#region src/take-out.ts
async function Rn(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await W(e.hass);
	} catch (t) {
		e.undo = n, e.error = await V(e.hass, t);
	}
}
var zn = (e, t, n) => Rn(e, async () => {
	let { taken: r } = await St(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), Bn = (e) => {
	let t = e.undo;
	if (t) return Rn(e, async () => {
		await Ct(e.hass, t.taken);
	});
}, Vn = (e, t, n, r) => {
	let i = A("stock.take_one", { name: t });
	return S`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => zn(e, t, n)}
  >
    ${N(Je)}
  </button>`;
}, Hn = (e, t) => On(e.undo ? A("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => Bn(e)), t), Un = (e) => S`<div class="filters">
      <input
        class="filter"
        type="search"
        data-testid="stock-filter"
        aria-label=${A("stock.search_hint")}
        placeholder=${A("stock.search")}
        .value=${e.filter}
        @input=${(t) => e.filter = t.target.value}
      />
      <select
        data-testid="stock-location"
        aria-label=${A("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${A("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => S`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${A("stock.with_empty")}
    </label>`, Wn = o`
  .filters {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, Gn = o`
  li.item {
    flex-direction: column;
    align-items: stretch;
  }
  .head {
    display: flex;
    align-items: center;
  }
  .head .row {
    padding-left: 0;
  }
  .batches li {
    gap: 12px;
    padding: 0 0 0 36px;
    border-bottom: 0;
  }
  .batches .detail {
    flex: 1;
  }
  .expired {
    color: var(--error-color);
  }
  .soon {
    color: var(--warning-color);
  }
`, Kn = [
	"name",
	"brand",
	"ean",
	"category_id",
	"content_amount",
	"content_unit_id",
	"default_location_id",
	"expiry_type",
	"warn_days",
	"min_packages"
], qn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { attribute: !1 },
			edit: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = [], this.error = "";
	}
	async open(e, t) {
		this.error = "", this.products = t, this.edit = { ...e }, this.orig = { ...e }, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	set(e, t) {
		this.edit = {
			...this.edit,
			[e]: t
		};
	}
	errors(e) {
		let t = fn(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = A("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = A("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = A("valid.days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of Kn) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await Et(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return S`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => X(this.md, e.category_id, t);
		return P({
			title: A("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: S`${pn(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${A("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${R(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl" title=${A("tip.default_location_id")}
            >${A("settings.category.location")}</span
          >
          ${Vt({
				testid: "location",
				own: e.default_location_id,
				dflt: n("default_location_id"),
				optional: !0,
				options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
				numeric: !0,
				onChange: (e) => this.set("default_location_id", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${A("tip.expiry_type")}
            >${A("settings.category.expiry_type")}</span
          >
          ${Vt({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, A(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${A("tip.warn_days")}>${A("settings.category.warn_days")}</span>
          ${Ht({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => Rt(this.hass, e),
				suffix: A("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${R(t.warn_days, "warn-days")}
        </label> `,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => Kn.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-product-dialog", qn);
//#endregion
//#region src/batch-dialog.ts
var Jn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			d: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.error = "";
	}
	async open(e) {
		this.error = "", this.row = e, this.d = {
			expires_on: e.expires_on ?? "",
			packages: String(e.packages),
			dateBad: !1
		}, this.orig = { ...this.d }, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	set(e) {
		this.d = {
			...this.d,
			...e
		};
	}
	errors(e) {
		let t = {};
		return ft(e.dateBad, e.expires_on) && (t.expires = A("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = A("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await wt(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return S`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return P({
			title: A("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: S`<label>
          <span class="lbl">
            ${A("book.expires_on_type", { type: A(`settings.expiry.${this.row.expiry_type}`) })}
          </span>
          <input
            data-testid="batch-expires"
            type="date"
            min="2000-01-01"
            max="2099-12-31"
            aria-invalid=${!!t.expires}
            .value=${e.expires_on}
            @input=${(e) => {
				let t = e.target;
				this.set({
					expires_on: t.value,
					dateBad: t.validity.badInput
				});
			}}
          />
          ${t.expires ? R(t.expires, "batch-expires") : S`<span class="detail">${A("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${A("book.packages")}</span>
          <input
            data-testid="batch-packages"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            aria-invalid=${!!t.packages}
            .value=${e.packages}
            @input=${(e) => this.set({ packages: e.target.value })}
          />
          ${t.packages ? R(t.packages, "batch-packages") : S`<span class="detail">${A("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-batch-dialog", Jn);
//#endregion
//#region src/label-dialog.ts
var Yn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			batch: { state: !0 },
			count: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.invalid = () => !/^\d+$/.test(this.count) || +this.count < 1 || +this.count > 20, this.count = "1", this.error = "";
	}
	async open(e) {
		this.batch = e, this.count = "1", this.error = "", await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async print(e) {
		if (e.preventDefault(), !this.invalid()) try {
			let e = await gn(this.hass, this.batch.id, Number(this.count));
			if (e === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-printed", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return S`<dialog></dialog>`;
		let t = this.invalid();
		return P({
			title: A("label.title", { name: e.name }),
			body: S`<label>
        <span class="lbl">${A("label.count")}</span>
        <input
          data-testid="label-count"
          type="number"
          min="1"
          max=${20}
          step="1"
          inputmode="numeric"
          aria-invalid=${t}
          .value=${this.count}
          @input=${(e) => this.count = e.target.value}
        />
        ${t ? R(A("valid.label_count", { max: 20 }), "label-count") : S`<span class="detail">${A("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: A("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-label-dialog", Yn);
//#endregion
//#region src/stock-view.ts
var Xn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { state: !0 },
			stock: { state: !0 },
			filter: { state: !0 },
			location: { state: !0 },
			withEmpty: { state: !0 },
			open: { state: !0 },
			error: { state: !0 },
			undo: { state: !0 },
			message: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.started = !1, this.reload = async () => {
			let [e, t] = await Promise.all([W(this.hass), Tt(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await V(this.hass, e);
			}
		}, this.filter = "", this.location = null, this.withEmpty = !1, this.open = /* @__PURE__ */ new Set(), this.error = "", this.message = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load()), [
			"filter",
			"location",
			"withEmpty",
			"stock"
		].some((t) => e.has(t)) && (this.message = "");
	}
	async load() {
		try {
			this.md = await U(this.hass), await this.reload(), await this.updateComplete, this.renderRoot.querySelector(".filter")?.focus();
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	tree(e) {
		let t = Pn(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return Ln(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? this.renderCategory(e.id, e.name, e.packages, e.depth, e.open) : this.renderItem(e.item, e.depth, e.open));
	}
	renderCategory(e, t, n, r, i) {
		return S`<li style="padding-left:${r * 24}px">
      ${F(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${A("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return In(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		return e.expires_on ? It(this.hass, e.expires_on) : A("stock.no_date");
	}
	toggle(e) {
		this.open = I(this.open, e);
	}
	render() {
		let e = this.error ? S`<p class="error" role="alert">${this.error}</p>` : w;
		if (!this.stock) return e;
		let t = this.tree(this.filter.trim() !== "");
		return S`
      ${e} ${Un(this)} ${Hn(this, "stock")}
      ${On(this.message, void 0, "label")}
      ${t.length ? S`<ul>
              ${t}
            </ul>` : S`<p class="empty">
              ${A(this.stock.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`}
      <pantry-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @pantry-saved=${this.saved}
        @master=${(e) => this.md = e.detail}
      ></pantry-product-dialog>
      <pantry-batch-dialog .hass=${this.hass} @pantry-saved=${this.saved}></pantry-batch-dialog>
      <pantry-label-dialog
        .hass=${this.hass}
        @pantry-printed=${(e) => this.message = e.detail ? A("label.printed", { n: e.detail }) : ""}
      ></pantry-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("pantry-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await rn(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	printBatch(e, t) {
		let n = t.filter((t) => t.batch_id === e.batch_id).reduce((e, t) => e + t.packages, 0);
		this.renderRoot.querySelector("pantry-label-dialog").open({
			id: e.batch_id,
			name: e.name,
			packages: n
		});
	}
	editBatch(e) {
		this.renderRoot.querySelector("pantry-batch-dialog").open(e);
	}
	renderItem(e, t, n) {
		let r = e.batches[0], i = r ? () => this.toggle(`p${e.id}`) : () => this.editProduct(e.id);
		return S`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? F(n, i) : S`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : w}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, A("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? S` · <span class=${this.status(r)}>${this.date(r)}</span>` : w}
          </span>
        </button>
        ${L({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: B(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? S`<ul class="batches">
              ${e.batches.map((t) => S`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${A("book.count", { n: t.packages })}</span>
                    ${Vn(this, e.name, t, "stock-batch-out")}
                    <button
                      class="icon-btn"
                      data-testid="stock-batch-label"
                      aria-label=${A("label.print_name", { name: e.name })}
                      title=${A("label.print")}
                      @click=${() => this.printBatch(t, e.batches)}
                    >
                      ${N(Qe)}
                    </button>
                    ${L({
			testid: "batch",
			name: `${e.name}, ${this.date(t)}`,
			onEdit: () => this.editBatch(t)
		})}
                  </li>`)}
            </ul>` : w}
    </li>`;
	}
	static {
		this.styles = [
			j,
			kn,
			Wn,
			Gn
		];
	}
};
customElements.define("pantry-stock", Xn);
//#endregion
//#region src/expiry-view.ts
var Zn = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { state: !0 },
			stock: { state: !0 },
			days: { state: !0 },
			error: { state: !0 },
			undo: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.started = !1, this.days = "", this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load());
	}
	async load() {
		try {
			let [e, t, n] = await Promise.all([
				U(this.hass),
				W(this.hass),
				Tt(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? A("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(G(this.hass), { numeric: "auto" }).format(Fn(e), "day");
	}
	render() {
		let e = this.error ? S`<p class="error" role="alert">${this.error}</p>` : w;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: In(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return S`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${A("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${A("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${A("common.days_unit")}
        </span>
        ${R(t, "expiry-days")}
      </div>
      ${Hn(this, "expiry")}
      ${r.length ? S`<ul>
              ${r.map(({ r: e, status: t }) => S`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}>${It(this.hass, e.expires_on)}</span>
                      <span class="detail">${this.relative(e.expires_on)}</span>
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[e.brand, e.location].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${A("book.count", { n: e.packages })}</span>
                    ${Vn(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : S`<p class="empty">${A("expiry.empty")}</p>`}
    `;
	}
	static {
		this.styles = [
			j,
			kn,
			o`
      .num input {
        max-width: 160px;
      }
      li {
        gap: 12px;
        padding: 4px 0 4px 8px;
      }
      .when,
      .what {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .when {
        flex: none;
        width: 7.5em;
      }
      .what {
        flex: 1;
        min-width: 0;
      }
      .expired {
        color: var(--error-color);
      }
      .soon {
        color: var(--warning-color);
      }
    `
		];
	}
};
customElements.define("pantry-expiry", Zn);
//#endregion
//#region node_modules/lit-html/directive.js
var Q = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Qn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), $n = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, { I: er } = Fe, tr = (e) => e.strings === void 0, nr = {}, rr = (e, t = nr) => e._$AH = t, ir = Qn(class extends $n {
	constructor(e) {
		if (super(e), e.type !== Q.PROPERTY && e.type !== Q.ATTRIBUTE && e.type !== Q.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!tr(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === C || t === w) return t;
		let n = e.element, r = e.name;
		if (e.type === Q.PROPERTY) {
			if (t === n[r]) return C;
		} else if (e.type === Q.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return C;
		} else if (e.type === Q.ATTRIBUTE && n.getAttribute(r) === t + "") return C;
		return rr(e), t;
	}
}), ar = (e) => e.callWS({ type: "pantry/shopping" }), or = (e, t, n) => e.callWS({
	type: "pantry/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), $ = (e, t) => e.callWS({
	type: "pantry/shopping_add",
	...t
}), sr = (e, t, n) => e.callWS({
	type: "pantry/shopping_item",
	item_id: t,
	...n
}), cr = (e, t) => e.callWS({
	type: "pantry/shopping_item_delete",
	item_id: t
}), lr = (e) => e.callWS({ type: "pantry/shopping_recipes" }), ur = (e, t, n, r) => e.callWS({
	type: "pantry/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), dr = (e, t) => e.callWS({
	type: "pantry/shopping_recipe_remove",
	recipe_id: t
}), fr = (e, t, n) => e.callWS({
	type: "pantry/shopping_recipe_done",
	key: t,
	done: n
});
//#endregion
//#region src/shopping-text.ts
function pr(e, t) {
	let n = (t) => J(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : A("shopping.any"), A("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : A("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(A("book.count", { n: t.packages }));
	let i = A(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(A("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function mr(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : J(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: A(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? A("shopping.unknown", { n: r }) : ""
	};
}
//#endregion
//#region src/shopping-row-styles.ts
var hr = o`
  .what {
    display: flex;
    flex-wrap: wrap; /* refs go below the name when the line is narrow */
    align-items: baseline;
    column-gap: 8px;
    min-width: 0;
  }
  .line {
    display: flex;
    min-width: 0;
    max-width: 100%;
    white-space: nowrap;
  }
  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis; /* only the name is cut off, never the amount */
  }
  .amt {
    flex: none;
  }
  .refs {
    display: flex;
    flex-wrap: wrap;
    gap: 0 8px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .refs > span {
    white-space: nowrap;
  }
  .unknown {
    flex: none;
  }
  .done .line {
    text-decoration: line-through;
    color: var(--secondary-text-color);
  }
`, gr = 8, _r = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			query: { state: !0 },
			choice: { state: !0 },
			packages: { state: !0 },
			item: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = [], this.query = "", this.packages = 1, this.active = !1, this.error = "";
	}
	async open(e) {
		this.item = e, this.query = "", this.choice = void 0, this.packages = e?.packages ?? 1, this.error = "";
		try {
			[this.md, this.products] = await Promise.all([U(this.hass), Tt(this.hass)]);
		} catch (e) {
			this.error = await V(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return Y(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = A("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, fn(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = A("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = A("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await sr(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await $(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await $(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await $(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await $(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await V(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return S`<li>
      <button
        type="button"
        class="row"
        data-testid=${e}
        @click=${() => this.choice = r}
      >
        <span>${t}</span>
        <span class="detail">${n}</span>
      </button>
    </li>`;
	}
	hits() {
		let e = this.query.trim();
		if (!e) return w;
		let t = (t) => !!t && q(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, gr), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, gr), i = dn({ name: e });
		return S`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, A("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", A("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${B(this.hass) ? this.hit("shopping-new-category", A("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : w}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return S`<label>
          <span class="lbl">${A("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? R(e.what, "shopping-what") : w}
        </label>
        ${this.hits()}`;
		let n = S`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${A("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? S`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : A("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? S`<p class="detail">${A("shopping.add.creates_product")} ${n}</p>
        ${pn(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : S`<p class="detail">${A("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${A("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${R(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${A("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${A("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></pantry-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return S`<dialog></dialog>`;
		let e = this.errors();
		return P({
			title: this.item ? A("common.edit_name", { name: this.item.name }) : A("shopping.add.title"),
			body: S`${this.item ? w : this.what(e)}
        <label>
          <span class="lbl">${A("shopping.add.packages")}</span>
          <span class="num">
            <input
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              data-testid="shopping-packages"
              aria-invalid=${!!e.packages}
              .value=${String(this.packages ?? "")}
              @input=${(e) => {
				let t = e.target.value;
				this.packages = z(t);
			}}
            />
            <span class="detail">${A("book.packages")}</span>
          </span>
          ${R(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-shopping-add", _r);
//#endregion
//#region src/shopping-recipe-dialog.ts
var vr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipe: { state: !0 },
			servings: { state: !0 },
			chosen: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.start = {
			servings: 1,
			chosen: /* @__PURE__ */ new Set()
		}, this.servings = 1, this.chosen = /* @__PURE__ */ new Set(), this.active = !1, this.error = "";
	}
	async open(e, t, n = []) {
		this.recipe = e, this.servings = t, this.chosen = new Set(n), this.start = {
			servings: t,
			chosen: new Set(n)
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async request(e, t) {
		let n = (await lr(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await ur(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: A("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await ur(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await V(this.hass, e);
				return;
			}
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	toggle(e, t) {
		let n = new Set(this.chosen);
		t ? n.add(e.id) : n.delete(e.id), this.chosen = n;
	}
	render() {
		if (!this.active || !this.recipe) return S`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return P({
			title: A("shopping.recipe.title", { name: this.recipe.name }),
			body: S`<label>
          <span class="lbl">${A("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!e.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e) => this.servings = z(e.target.value)}
          />
          ${R(e.servings, "shopping-recipe-servings")}
        </label>
        ${t.length ? S`<fieldset>
                <legend class="lbl">${A("shopping.recipe.optional")}</legend>
                ${t.map((e) => S`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(e.id)}
                        @change=${(t) => this.toggle(e, t.target.checked)}
                      />
                      ${e.text}
                    </label>`)}
              </fieldset>` : w}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: A("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-shopping-recipe-dialog", vr);
//#endregion
//#region src/shopping-recipes.ts
var yr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			list: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.recipes = [], this.started = !1, this.list = [], this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load());
	}
	async load() {
		try {
			[this.list, this.recipes] = await Promise.all([lr(this.hass), jt(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("pantry-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await it(e.name)) {
			try {
				await dr(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await V(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return S`${this.error ? S`<p class="error" role="alert">${this.error}</p>` : w}
      <pantry-shopping-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-recipe-dialog>
      ${this.list.length ? S`<h3>${A("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => S`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${A("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${zt(this.hass, e.servings)}</span>
                      ${L({
			testid: "shopping-recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: () => this.removeEntry(e)
		})}
                    </li>`)}
              </ul>` : w}`;
	}
	static {
		this.styles = [j, o`
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .no {
        min-width: 1.5em;
        padding-left: 8px;
        color: var(--secondary-text-color);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      ul {
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-shopping-recipes", yr);
//#endregion
//#region src/shopping-view.ts
var br = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			items: { state: !0 },
			cats: { state: !0 },
			error: { state: !0 },
			receipt: { state: !0 },
			printing: { state: !0 },
			note: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.error = "", this.receipt = !1, this.printing = !1, this.note = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), Dt(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await kt(this.hass);
				this.note = A("shopping.printed", { n: e });
			} catch (e) {
				this.error = await V(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([ar(this.hass), U(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await sr(this.hass, e.id, { done: t }) : e.key ? await fr(this.hass, e.key, t) : await or(this.hass, e, t);
		} catch (e) {
			return this.error = await V(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await it(e.name)) {
			this.error = "";
			try {
				await cr(this.hass, e.id);
			} catch (e) {
				return this.error = await V(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("pantry-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = pr(this.hass, e), i = mr(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return S`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${ir(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="line" title=${a}
            ><span class="name">${e.name}</span
            >${r ? S`<span class="amt"> – ${r}</span>` : w}</span
          >
          ${i.uses.length || i.unknown ? S`<span class="refs" data-testid="shopping-refs"
                  >${i.uses.map((e, t) => S`<span title=${e.title} aria-label=${e.title}
                        >${e.text}${t < i.uses.length - 1 ? ";" : ""}</span
                      >`)}${i.unknown ? S`<span class="unknown" title=${i.unknown}>${i.unknown}</span>` : w}</span
                >` : w}
        </span>
      </label>
      ${e.manual ? L({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : w}
    </li>`;
	}
	tree(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let t of e) n.set(t.category_id, [...n.get(t.category_id) ?? [], t]);
		let r = /* @__PURE__ */ new Set();
		for (let e of n.keys()) for (let n = t.find((t) => t.id === e); n; n = t.find((e) => e.id === n.parent_id)) r.add(n.id);
		let i = [], a = (e, o) => {
			for (let s of t.filter((t) => t.parent_id === e && r.has(t.id))) {
				let e = n.get(s.id) ?? [], [t, ...r] = e.filter((e) => e.product_id == null);
				i.push(t ? this.row(t, o, !0) : S`<li
                class="cat"
                data-testid="shopping-category"
                style="padding-left:${o * 24}px"
              >
                <span class="name heading">${s.name}</span>
              </li>`);
				for (let e of r) i.push(this.row(e, o + 1));
				a(s.id, o + 1);
				for (let t of e.filter((e) => e.product_id != null)) i.push(this.row(t, o + 1));
			}
		};
		return a(null, 0), i;
	}
	render() {
		let e = this.error ? S`<p class="error" role="alert">${this.error}</p>` : w;
		return !this.items || !this.cats ? e : S`${S`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${A("shopping.add.title")}
        </button>
        ${this.receipt ? S`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${A("shopping.print")}
              </button>` : w}
      </div>
      ${this.note ? S`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : w}
      <pantry-shopping-recipes
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-recipes>
      <pantry-shopping-add
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-add>`}
    ${this.items.length ? S`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : S`<p class="empty">${A("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			j,
			hr,
			o`
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }
      li.cat .name {
        font-weight: 500;
      }
      .heading {
        display: block;
        padding: 8px 0 4px 8px;
      }
      label {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
        padding: 4px 0 4px 8px;
        cursor: pointer;
      }
    `
		];
	}
};
customElements.define("pantry-shopping", br);
//#endregion
//#region src/recipe-detail.ts
var xr = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = J(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${A("recipes.approx", { what: J(e, i * a.factor / s.factor, s.symbol) })})`;
}, Sr = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? A("recipes.status.missing_plain") : A("recipes.status.missing", { what: J(e, t.missing ?? 0, n) });
		case "partial": return A("recipes.status.partial", {
			have: K(e, t.have ?? 0),
			need: K(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return A("recipes.status.unknown");
		case "skipped": return A("recipes.status.skipped");
		case "unmatched": return A("recipes.status.unmatched");
		default: return A("recipes.status.available");
	}
}, Cr = (e) => {
	let t = e.recipe;
	return S`<div class="detail-box">
    <label class="servings">
      <span class="lbl">${A("recipes.servings")}</span>
      <input
        type="number"
        min="1"
        max="99"
        step="1"
        inputmode="numeric"
        data-testid="recipe-servings"
        .value=${String(e.servings)}
        @change=${(t) => {
		let n = t.target, r = Number(n.value);
		Number.isInteger(r) && r >= 1 && r <= 99 ? e.onServings(r) : n.value = String(e.servings);
	}}
      />
    </label>
    <ul class="ings">
      ${e.ingredients.map((n) => S`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[xr(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? S`<span class="detail">${n.note}</span>` : w}
              ${n.optional ? S`<span class="detail">${A("recipes.optional")}</span>` : w}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${Sr(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      <button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
        ${A("recipes.to_shopping")}
      </button>
      ${t.shopping_servings == null ? w : S`<span class="detail" data-testid="recipe-on-shopping"
              >${A("recipes.on_shopping", { what: zt(e.hass, t.shopping_servings) })}</span
            >`}
    </p>
    ${t.instructions ? S`<h3>${A("recipes.instructions")}</h3>
            <p class="text">${t.instructions}</p>` : w}
    ${t.source_url ? S`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${A("recipes.source")}</a
            >
          </p>` : w}
    ${t.image_url ? S`<img
            class="photo"
            src=${t.image_url}
            alt=${t.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />` : w}
  </div>`;
}, wr = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), Tr = (e) => e.map((e) => {
	let t = {};
	return wr(e) || (!e.text.trim() && e.category_id == null && (t.text = A("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = A("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? A("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : A("valid.amount_pair"))), t;
}), Er = 8, Dr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			categories: { attribute: !1 },
			value: { attribute: !1 },
			text: { attribute: !1 },
			error: { attribute: !1 },
			query: { state: !0 },
			products: { state: !0 },
			creating: { state: !0 },
			failure: { state: !0 }
		};
	}
	constructor() {
		super(), this.categories = [], this.value = null, this.text = "", this.query = "", this.products = [], this.failure = "";
	}
	async input(e) {
		if (this.query = e, this.failure = "", !e.trim()) this.products = [];
		else try {
			let t = await bt(this.hass, e.trim());
			if (this.query !== e) return;
			let n = [];
			for (let e of t) {
				let t = this.categories.find((t) => t.id === e.category_id);
				t && !n.some((e) => e.cat.id === t.id) && n.push({
					cat: t,
					via: e.name
				});
			}
			this.products = n;
		} catch {
			this.products = [];
		}
	}
	pick(e) {
		this.query = "", this.products = [], this.dispatchEvent(new CustomEvent("change", { detail: e }));
	}
	async create(e) {
		if (e != null) try {
			await vt(this.hass, this.creating, e);
			let t = await U(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await V(this.hass, e);
		}
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.categories.filter((t) => q(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, Er);
	}
	hit(e) {
		let t = Y(this.categories, e.cat.parent_id), n = [e.via ? A("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
		return S`<li>
      <button
        type="button"
        class="row"
        data-testid="ingredient-hit"
        @click=${() => this.pick(e.cat.id)}
      >
        <span>${e.cat.name}</span>
        <span class="detail">${n}</span>
      </button>
    </li>`;
	}
	list() {
		let e = this.query.trim();
		if (!e) return w;
		let t = this.categories.some((t) => t.name.toLocaleLowerCase() === e.toLocaleLowerCase());
		return S`<ul>
      ${this.hits(e).map((e) => this.hit(e))}
      ${t ? w : S`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => this.creating = e}
              >
                <span>${A("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? S`<div class="lbl">${A("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${A("shopping.add.change")}
          </button>
        </p>` : this.creating ? S`<div class="field">
        <span class="lbl">${A("recipes.ingredient.parent", { name: this.creating })}</span>
        <pantry-category-picker
          .categories=${this.categories}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></pantry-category-picker>
        ${this.failure ? S`<p class="error" role="alert">${this.failure}</p>` : w}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${A("common.cancel")}
        </button>
      </div>` : S`<label>
        <span class="lbl">${A("recipes.ingredient.text")}</span>
        ${this.text ? S`<span class="detail">${this.text} – ${A("recipes.ingredient.unmatched")}</span>` : w}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e) => this.input(e.target.value)}
        />
        ${R(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
	}
	static {
		this.styles = j;
	}
};
customElements.define("pantry-ingredient-pick", Dr);
//#endregion
//#region src/unit-add-dialog.ts
var Or = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			active: { state: !0 },
			name: { state: !0 },
			symbol: { state: !0 },
			error: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.initial = "", this.active = !1, this.name = "", this.symbol = "", this.error = "", this.busy = !1;
	}
	async open(e = "") {
		this.name = e, this.symbol = "", this.initial = JSON.stringify([e, ""]), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.name.trim() && !this.busy) {
			this.busy = !0;
			try {
				let { id: e } = await Ft(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await U(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await V(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return S`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : A("valid.required");
		return P({
			title: A("unit_add.title"),
			body: S`<label>
          <span class="lbl">${A("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${R(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${A("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: A("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [j];
	}
};
customElements.define("pantry-unit-add-dialog", Or);
//#endregion
//#region src/recipe-ingredients.ts
var kr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			value: { attribute: !1 },
			categories: { attribute: !1 },
			units: { attribute: !1 }
		};
	}
	constructor() {
		super(), this.unitFor = 0, this.value = [], this.categories = [], this.units = [];
	}
	newUnit(e, t = "") {
		this.unitFor = e, this.renderRoot.querySelector("pantry-unit-add-dialog").open(t);
	}
	unitAdded(e) {
		let { id: t, md: n } = e.detail;
		this.units = n.units, this.dispatchEvent(new CustomEvent("master", { detail: n }));
		let r = this.value[this.unitFor]?.unit_hint;
		this.emit(this.value.map((e, n) => n === this.unitFor || r && e.unit_hint === r && e.unit_id == null ? {
			...e,
			unit_id: t,
			unit_hint: null
		} : e));
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("change", { detail: e }));
	}
	set(e, t) {
		this.emit(this.value.map((n, r) => r === e ? {
			...n,
			...t
		} : n));
	}
	pick(e, t) {
		let n = this.categories.find((e) => e.id === t), r = this.value[e], i = { category_id: t };
		if (!n) i.text = "";
		else if (i.text = n.name, r.unit_id == null && r.amount == null) {
			let e = n.effective.unit_id.value ?? null;
			i.unit_id = this.units.find((t) => t.id === e)?.base_unit_id ?? e;
		}
		this.set(e, i);
	}
	row(e, t, n) {
		let r = !!e.unit_hint && e.unit_id == null;
		return S`<li data-testid="ingredient-row" class="ing">
      <pantry-ingredient-pick
        .hass=${this.hass}
        .categories=${this.categories}
        .value=${e.category_id}
        .text=${e.category_id == null ? e.text : ""}
        .error=${n.text}
        @change=${(e) => this.pick(t, e.detail)}
        @master=${(e) => {
			this.categories = e.detail.categories, this.dispatchEvent(new CustomEvent("master", { detail: e.detail }));
		}}
      ></pantry-ingredient-pick>
      <div class="line">
        <label>
          <span class="lbl">${A("recipes.ingredient.amount")}</span>
          <input
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            data-testid="ingredient-amount"
            aria-invalid=${!!n.amount || !!n.pair}
            .value=${e.amount == null ? "" : String(e.amount)}
            @input=${(e) => {
			let n = e.target.value;
			this.set(t, { amount: z(n) });
		}}
          />
        </label>
        <label>
          <span class="lbl">${A("recipes.ingredient.unit")}</span>
          <select
            data-testid="ingredient-unit"
            aria-invalid=${!!n.pair}
            @change=${(n) => {
			let r = n.target;
			if (r.value === "new") return r.value = e.unit_id == null ? "" : String(e.unit_id), this.newUnit(t);
			this.set(t, {
				unit_id: r.value ? Number(r.value) : null,
				unit_hint: null
			});
		}}
          >
            <option value="" .selected=${e.unit_id == null}>${A("recipes.ingredient.none")}</option>
            ${this.units.map((t) => S`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${A("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${R(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? S`<div class="hintline">
              ${R(A("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${A("recipes.ingredient.unit_create")}
              </button>
            </div>` : w}
      ${e.line ? S`<div class="orig" data-testid="ingredient-line">
              ${A("recipes.ingredient.line", { line: e.line })}
            </div>` : w}
      <label>
        <span class="lbl">${A("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${A("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${A("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${A("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${A("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${A("recipes.ingredient.remove")}
          title=${A("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${N(Ue)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = Tr(this.value);
		return S`<pantry-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></pantry-unit-add-dialog>
      <div class="lbl">${A("recipes.ingredients")}</div>
      <ul>
        ${this.value.map((t, n) => this.row(t, n, e[n]))}
      </ul>
      <button
        type="button"
        class="add"
        data-testid="ingredient-add"
        @click=${() => this.emit([...this.value, {
			category_id: null,
			amount: null,
			unit_id: null,
			text: "",
			note: null,
			optional: !1,
			skip_stock: !1
		}])}
      >
        ${A("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [j, o`
      li.ing {
        display: block;
        padding: 8px 0;
      }
      .line {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .hintline {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
      .hintline button {
        flex: none;
      }
      .orig {
        font-size: 0.875em;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .foot {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 16px;
      }
      .foot .icon-btn {
        margin-left: auto;
      }
      .foot .check {
        margin: 0;
      }
      .add {
        margin-top: 8px;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-recipe-ingredients", kr);
//#endregion
//#region src/recipe-dialog.ts
var Ar = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	instructions: e?.instructions ?? "",
	source_url: e?.source_url ?? "",
	image_url: e?.image_url ?? "",
	ingredients: (e?.ingredients ?? []).map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.amount == null ? null : e.unit_id,
		text: e.text,
		note: e.note ?? null,
		optional: e.optional,
		skip_stock: e.skip_stock ?? !1,
		line: e.line,
		unit_hint: e.unit_hint
	}))
}), jr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.initial = "", this.draft = Ar(), this.active = !1, this.error = "";
	}
	async open(e, t, n) {
		this.md = e, this.recipe = t, this.draft = Ar(t ?? n), this.initial = JSON.stringify(n ? Ar() : this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.name.trim() || (t.name = A("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = A("valid.servings")), e.source_url.trim() && !pt.test(e.source_url.trim()) && (t.source_url = A("valid.url")), e.image_url.trim() && !pt.test(e.image_url.trim()) && (t.image_url = A("valid.url")), {
			e: t,
			bad: Tr(e.ingredients).some((e) => Object.keys(e).length)
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await Nt(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				name: r.name.trim(),
				servings: r.servings,
				instructions: r.instructions.trim() || null,
				source_url: r.source_url.trim() || null,
				image_url: r.image_url.trim() || null,
				ingredients: r.ingredients.filter((e) => !wr(e)).map((e) => ({
					category_id: e.category_id,
					amount: e.amount,
					unit_id: e.amount == null ? null : e.unit_id,
					optional: e.optional,
					skip_stock: e.skip_stock,
					note: e.note?.trim() || null,
					...e.category_id == null ? { text: e.text.trim() } : {}
				}))
			});
		} catch (e) {
			this.error = await V(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	text(e, t, n, r = "text") {
		return S`<label>
      <span class="lbl">${t}</span>
      <input
        type=${r}
        data-testid=${e === "name" ? "recipe-name" : `recipe-${e}`}
        aria-invalid=${!!n}
        .value=${this.draft[e]}
        @input=${(t) => this.draft = {
			...this.draft,
			[e]: t.target.value
		}}
      />
      ${R(n, e === "name" ? "recipe-name" : `recipe-${e}`)}
    </label>`;
	}
	render() {
		if (!this.active) return S`<dialog></dialog>`;
		let { e, bad: t } = this.errors(), n = this.draft;
		return P({
			title: this.recipe ? A("common.edit_name", { name: this.recipe.name }) : A("recipes.add"),
			body: S`${this.text("name", A("common.name"), e.name)}
        <label>
          <span class="lbl">${A("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="recipe-servings-input"
            aria-invalid=${!!e.servings}
            .value=${String(n.servings ?? "")}
            @input=${(e) => {
				let t = e.target.value;
				this.draft = {
					...n,
					servings: z(t)
				};
			}}
          />
          ${R(e.servings, "recipe-servings-input")}
        </label>
        <label>
          <span class="lbl">${A("recipes.field.instructions")}</span>
          <textarea
            rows="5"
            data-testid="recipe-instructions"
            .value=${n.instructions}
            @input=${(e) => this.draft = {
				...n,
				instructions: e.target.value
			}}
          ></textarea>
        </label>
        ${this.text("source_url", A("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", A("recipes.field.image_url"), e.image_url, "url")}
        <pantry-recipe-ingredients
          .hass=${this.hass}
          .value=${n.ingredients}
          @master=${(e) => {
				this.md = e.detail, this.requestUpdate(), this.dispatchEvent(new CustomEvent("master", { detail: e.detail }));
			}}
          .categories=${this.md?.categories ?? []}
          .units=${this.md?.units ?? []}
          @change=${(e) => this.draft = {
				...n,
				ingredients: e.detail
			}}
        ></pantry-recipe-ingredients>`,
			error: this.error,
			invalid: Object.keys(e).length > 0 || t,
			submit: {
				label: A("common.save"),
				testid: "recipe-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [j, o`
      textarea {
        font: inherit;
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        color: var(--primary-text-color);
        background: var(--card-background-color, var(--primary-background-color));
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
    `];
	}
};
customElements.define("pantry-recipe-dialog", jr);
//#endregion
//#region src/recipe-import.ts
var Mr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			active: { state: !0 },
			url: { state: !0 },
			busy: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.active = !1, this.url = "", this.busy = !1, this.error = "";
	}
	async open() {
		this.url = "", this.error = "", this.busy = !1, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.url.trim();
		return e ? pt.test(e) ? void 0 : A("valid.url") : A("valid.required");
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await Pt(this.hass, this.url.trim());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-imported", { detail: e }));
			} catch (e) {
				this.error = await V(this.hass, e);
			}
			this.busy = !1;
		}
	}
	render() {
		if (!this.active) return S`<dialog></dialog>`;
		let e = this.errors();
		return P({
			title: A("recipes.import.title"),
			body: S`<label>
        <span class="lbl">${A("recipes.import.url")}</span>
        <input
          type="url"
          data-testid="recipe-import-url"
          aria-invalid=${!!e}
          .value=${this.url}
          @input=${(e) => this.url = e.target.value}
        />
        ${R(e, "recipe-import-url")}
        <span class="note">${A("recipes.import.hint")}</span>
      </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: A("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!this.url.trim(),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [j, o`
      .note {
        display: block;
        margin-top: 4px;
        font-size: 0.875em;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("pantry-recipe-import", Mr);
//#endregion
//#region src/recipes-view.ts
var Nr = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipes: { state: !0 },
			md: { state: !0 },
			query: { state: !0 },
			open: { state: !0 },
			servings: { state: !0 },
			scaled: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.query = "", this.open = /* @__PURE__ */ new Set(), this.servings = /* @__PURE__ */ new Map(), this.scaled = /* @__PURE__ */ new Map(), this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load());
	}
	async load() {
		try {
			[this.recipes, this.md] = await Promise.all([jt(this.hass), U(this.hass)]), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await V(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await Mt(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await rn(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await V(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("pantry-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await jt(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await V(this.hass, e);
		}
	}
	edit(e) {
		this.renderRoot.querySelector("pantry-recipe-dialog").open(this.md, e);
	}
	importer() {
		return this.renderRoot.querySelector("pantry-recipe-import");
	}
	shown() {
		let e = this.query.trim();
		return (this.recipes ?? []).filter((t) => !e || q(t.name, e) || t.ingredients.some((t) => q(t.text, e)));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = I(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return S`<li class="recipe" data-testid="recipe-row">
      <div class="head">
        ${F(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${A("recipes.summary", e.summary)} · ${zt(this.hass, e.servings)}</span
          >
        </button>
        ${L({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: B(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? Cr({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e)
		}) : w}
    </li>`;
	}
	render() {
		let e = this.error ? S`<p class="error" role="alert">${this.error}</p>` : w;
		if (!this.recipes || !this.md) return e;
		let t = this.shown();
		return S`${e}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${A("recipes.search")}
          placeholder=${A("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button data-testid="recipe-import" @click=${() => this.importer().open()}>
          ${A("recipes.import.open")}
        </button>
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${A("recipes.add")}
        </button>
      </div>
      <pantry-recipe-import
        .hass=${this.hass}
        @pantry-imported=${(e) => this.renderRoot.querySelector("pantry-recipe-dialog").open(this.md, void 0, e.detail)}
      ></pantry-recipe-import>
      <pantry-shopping-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.refreshShopping()}
      ></pantry-shopping-recipe-dialog>
      <pantry-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
        @master=${(e) => this.md = e.detail}
      >
      </pantry-recipe-dialog>
      ${t.length ? S`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : S`<p class="empty">
              ${A(this.recipes.length ? "recipes.no_hits" : "recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [j, o`
      .bar {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      .bar input {
        flex: 1;
        min-width: 0;
      }
      .bar button {
        flex: none;
      }
      li.recipe {
        display: block;
      }
      .head {
        display: flex;
        align-items: center;
      }
      .detail-box {
        padding: 0 8px 12px 44px;
      }
      .shopping {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0;
      }
      .servings {
        max-width: 140px;
      }
      li.ing {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
      }
      .st {
        flex: none;
        color: var(--secondary-text-color);
        text-align: right;
      }
      .st.missing {
        color: var(--error-color);
      }
      .st.partial {
        color: var(--warning-color);
      }
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .text {
        white-space: pre-line;
        margin: 0;
      }
      .photo {
        max-width: 100%;
        max-height: 240px;
        margin-top: 8px;
      }
      a {
        color: var(--primary-color);
      }
    `];
	}
};
customElements.define("pantry-recipes", Nr);
//#endregion
//#region src/pantry-panel.ts
var Pr = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", Fr = [
	"stock",
	"in",
	"out",
	"expiry",
	"shopping",
	"recipes",
	"settings"
], Ir = class extends O {
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			route: { attribute: !1 }
		};
	}
	constructor() {
		super(), this.narrow = !1;
		let e = (e) => e.composedPath()[0].setAttribute?.("data-touched", "");
		this.addEventListener("input", e), this.addEventListener("focusout", e);
	}
	willUpdate(e) {
		e.has("hass") && this.hass && tt(this.hass.language);
	}
	get tab() {
		let e = (this.route?.path ?? "").split("/").filter(Boolean)[0];
		return e === "settings" && !B(this.hass) ? "stock" : Fr.includes(e) ? e : "stock";
	}
	get sub() {
		return (this.route?.path ?? "").split("/").filter(Boolean)[1];
	}
	select(e) {
		history.pushState(null, "", `${this.route?.prefix ?? ""}/${e}`), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.tab;
		return S`
      <header>
        ${this.narrow ? S`<button
                class="menu"
                aria-label=${A("panel.menu")}
                title=${A("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${N(Ke)}
              </button>` : w}
        <h1>${A("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${Pr}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${A("panel.help")}
          title=${A("panel.help")}
          >${N(Ge)}</a
        >
      </header>
      <div role="tablist">
        ${Fr.filter((e) => e !== "settings" || B(this.hass)).map((t) => S`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${A(`tab.${t}`)}
            </button>`)}
      </div>
      <main role="tabpanel" @pantry-navigate=${(e) => this.select(e.detail)}>
        ${e === "settings" ? S`<pantry-settings .hass=${this.hass} .section=${this.sub}></pantry-settings>` : e === "in" || e === "out" ? S`<pantry-booking .hass=${this.hass} .mode=${e}></pantry-booking>` : e === "stock" ? S`<pantry-stock .hass=${this.hass}></pantry-stock>` : e === "expiry" ? S`<pantry-expiry .hass=${this.hass}></pantry-expiry>` : e === "recipes" ? S`<pantry-recipes .hass=${this.hass}></pantry-recipes>` : S`<pantry-shopping .hass=${this.hass}></pantry-shopping>`}
      </main>
    `;
	}
	static {
		this.styles = o`
    :host {
      display: block;
      min-height: 100%;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }
    header {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
    }
    h1 {
      margin: 0 0 0 8px;
      font-size: 20px;
      font-weight: 400;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: 0;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .menu {
      display: flex;
      padding: 8px;
      border-radius: 50%;
    }
    .help {
      margin-left: auto;
      color: inherit;
    }
    .help:focus-visible {
      outline: 2px solid currentColor;
    }
    header .menu:focus-visible {
      outline-color: currentColor;
    }
    [role="tablist"] {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
      border-bottom: 1px solid var(--divider-color);
    }
    [role="tab"] {
      flex: none;
      padding: 14px 16px 12px;
      color: var(--secondary-text-color);
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    [role="tab"][aria-selected="true"] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    main {
      padding: 16px;
    }
    p {
      margin: 0;
      color: var(--secondary-text-color);
    }
  `;
	}
};
customElements.define("pantry-panel", Ir);
//#endregion
export { Ir as PantryPanel };
