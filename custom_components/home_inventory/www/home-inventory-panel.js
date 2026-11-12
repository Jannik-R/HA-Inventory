import { o as e } from "./rolldown-runtime-DsPmjQRF.js";
// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis, n = t.ShadowRoot && (t.ShadyCSS === void 0 || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, r = Symbol(), i = /* @__PURE__ */ new WeakMap(), a = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== r) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (n && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = i.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && i.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, o = (e) => new a(typeof e == "string" ? e : e + "", void 0, r), s = (e, ...t) => new a(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, r), c = (e, r) => {
	if (n) e.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of r) {
		let r = document.createElement("style"), i = t.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = n.cssText, e.appendChild(r);
	}
}, l = n ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return o(t);
})(e) : e, { is: u, defineProperty: d, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: f, getPrototypeOf: ne } = Object, re = globalThis, ie = re.trustedTypes, ae = ie ? ie.emptyScript : "", oe = re.reactiveElementPolyfillSupport, se = (e, t) => e, ce = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ae : null;
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
}, le = (e, t) => !u(e, t), ue = {
	attribute: !0,
	type: String,
	converter: ce,
	reflect: !1,
	useDefault: !1,
	hasChanged: le
};
Symbol.metadata ??= Symbol("metadata"), re.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var de = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ue) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && d(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = ee(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? ue;
	}
	static _$Ei() {
		if (this.hasOwnProperty(se("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(se("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(se("properties"))) {
			let e = this.properties, t = [...te(e), ...f(e)];
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
			for (let e of n) t.unshift(l(e));
		} else e !== void 0 && t.push(l(e));
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
		return c(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? ce : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ce : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? le)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
de.elementStyles = [], de.shadowRootOptions = { mode: "open" }, de[se("elementProperties")] = /* @__PURE__ */ new Map(), de[se("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: de }), (re.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var fe = globalThis, pe = (e) => e, me = fe.trustedTypes, he = me ? me.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ge = "$lit$", p = `lit$${Math.random().toFixed(9).slice(2)}$`, _e = "?" + p, ve = `<${_e}>`, m = document, ye = () => m.createComment(""), be = (e) => e === null || typeof e != "object" && typeof e != "function", xe = Array.isArray, Se = (e) => xe(e) || typeof e?.[Symbol.iterator] == "function", Ce = "[ 	\n\f\r]", we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Te = /-->/g, Ee = />/g, h = RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), De = /'/g, Oe = /"/g, ke = /^(?:script|style|textarea|title)$/i, Ae = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), g = Ae(1), je = Ae(2), _ = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Me = /* @__PURE__ */ new WeakMap(), y = m.createTreeWalker(m, 129);
function Ne(e, t) {
	if (!xe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return he === void 0 ? t : he.createHTML(t);
}
var Pe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = we;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === we ? c[1] === "!--" ? o = Te : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = h) : (ke.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = h) : o = Ee : o === h ? c[0] === ">" ? (o = i ?? we, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? h : c[3] === "\"" ? Oe : De) : o === Oe || o === De ? o = h : o === Te || o === Ee ? o = we : (o = h, i = void 0);
		let d = o === h && e[t + 1].startsWith("/>") ? " " : "";
		a += o === we ? n + ve : l >= 0 ? (r.push(s), n.slice(0, l) + ge + n.slice(l) + p + d) : n + p + (l === -2 ? t : d);
	}
	return [Ne(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Fe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Pe(t, n);
		if (this.el = e.createElement(l, r), y.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = y.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ge)) {
					let t = u[o++], n = i.getAttribute(e).split(p), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ze : r[1] === "?" ? Be : r[1] === "@" ? Ve : Re
					}), i.removeAttribute(e);
				} else e.startsWith(p) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ke.test(i.tagName)) {
					let e = i.textContent.split(p), t = e.length - 1;
					if (t > 0) {
						i.textContent = me ? me.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ye()), y.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ye());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === _e) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(p, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += p.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = m.createElement("template");
		return n.innerHTML = e, n;
	}
};
function b(e, t, n = e, r) {
	if (t === _) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = be(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = b(e, i._$AS(e, t.values), i, r)), t;
}
var Ie = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? m).importNode(t, !0);
		y.currentNode = r;
		let i = y.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Le(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new He(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = y.nextNode(), a++);
		}
		return y.currentNode = m, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Le = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = b(this, e, t), be(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== _ && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== v && be(this._$AH) ? this._$AA.nextSibling.data = e : this.T(m.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Fe.createElement(Ne(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ie(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Me.get(e.strings);
		return t === void 0 && Me.set(e.strings, t = new Fe(e)), t;
	}
	k(t) {
		xe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ye()), this.O(ye()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = pe(e).nextSibling;
			pe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Re = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = v;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = b(this, e, t, 0), a = !be(e) || e !== this._$AH && e !== _, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = b(this, r[n + o], t, o), s === _ && (s = this._$AH[o]), a ||= !be(s) || s !== this._$AH[o], s === v ? e = v : e !== v && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ze = class extends Re {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === v ? void 0 : e;
	}
}, Be = class extends Re {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== v);
	}
}, Ve = class extends Re {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = b(this, e, t, 0) ?? v) === _) return;
		let n = this._$AH, r = e === v && n !== v || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== v && (n === v || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, He = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		b(this, e);
	}
}, Ue = {
	M: ge,
	P: p,
	A: _e,
	C: 1,
	L: Pe,
	R: Ie,
	D: Se,
	V: b,
	I: Le,
	H: Re,
	N: Be,
	U: Ve,
	B: ze,
	F: He
}, We = fe.litHtmlPolyfillSupport;
We?.(Fe, Le), (fe.litHtmlVersions ??= []).push("3.3.3");
var Ge = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Le(t.insertBefore(ye(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ke = globalThis, x = class extends de {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ge(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return _;
	}
};
x._$litElement$ = !0, x.finalized = !0, Ke.litElementHydrateSupport?.({ LitElement: x });
var qe = Ke.litElementPolyfillSupport;
qe?.({ LitElement: x }), (Ke.litElementVersions ??= []).push("4.2.2");
// node_modules/@mdi/js/mdi.js
var Je = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", Ye = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", Xe = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Ze = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z", Qe = "M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z", $e = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", et = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", tt = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", nt = "M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z", rt = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", it = "M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z", at = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", ot = "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z", st = "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z", ct = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", lt = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", ut = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", dt = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", ft = "M7,10L12,15L17,10H7Z", pt = "M19,13H5V11H19V13Z", mt = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", ht = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z", gt = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", _t = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", vt = "M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z", yt = "M18 10H6A2 2 0 0 0 4 12V19H20V12A2 2 0 0 0 18 10M18 14H14V12H18M17 9H7V4H17Z", bt = "M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5M19 19H5V5H19V19M6 15H18V17H6M6 11H18V13H6M6 7H18V9H6V7Z", xt = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", St = "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z", Ct = "M8 17.85C8 19.04 7.11 20 6 20S4 19.04 4 17.85C4 16.42 6 14 6 14S8 16.42 8 17.85M16.46 12V10.56L18.46 9.43L20.79 10.05L21.31 8.12L19.54 7.65L20 5.88L18.07 5.36L17.45 7.69L15.45 8.82L13 7.38V5.12L14.71 3.41L13.29 2L12 3.29L10.71 2L9.29 3.41L11 5.12V7.38L8.5 8.82L6.5 7.69L5.92 5.36L4 5.88L4.47 7.65L2.7 8.12L3.22 10.05L5.55 9.43L7.55 10.56V12H2V13H22V12H16.46M9.5 12V10.56L12 9.11L14.5 10.56V12H9.5M20 17.85C20 19.04 19.11 20 18 20S16 19.04 16 17.85C16 16.42 18 14 18 14S20 16.42 20 17.85M14 20.85C14 22.04 13.11 23 12 23S10 22.04 10 20.85C10 19.42 12 17 12 17S14 19.42 14 20.85Z", wt = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", Tt = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", Et = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Dt = "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z", Ot = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", kt = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z", At = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13", jt = {
	"panel.title": "Vorrat",
	"panel.help": "Anleitung",
	"panel.menu": "Menü",
	"tab.stock": "Bestand",
	"tab.expiry": "Ablauf",
	"tab.shopping": "Einkauf",
	"tab.recipes": "Rezepte",
	"tab.plan": "Speiseplan",
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
	"settings.location.move_name": "„{name}“ umlagern",
	"settings.location.move_target": "Ziel-Lagerort",
	"settings.location.move_choose": "Bitte wählen",
	"settings.location.move_summary": "Zu verschieben: {batches} Charge(n), {packages} Pkg. Der Lagerort „{name}“ bleibt bestehen.",
	"settings.location.move_empty": "An diesem Lagerort liegt nichts.",
	"settings.location.move_action": "Umlagern",
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
	"settings.expiry.guide": "Richtwert",
	"settings.days": "{n} Tage",
	"settings.inherit_from": "von {name}",
	"settings.inherit_default": "Standard",
	"settings.day": "{n} Tag",
	"book.camera": "Kamera",
	"book.unknown": "Produkt nicht gefunden.",
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
	"book.title_out": "„{name}“ auslagern",
	"book.pick_in": "Produkt zum Einbuchen wählen",
	"book.pick_out": "Produkt zum Auslagern wählen",
	"stock.mode": "Was tun mit der Eingabe",
	"stock.mode_search": "Suchen",
	"stock.mode_in": "Einbuchen",
	"stock.mode_out": "Auslagern",
	"stock.mode_open": "Anbrechen",
	"book.pick_open": "Produkt zum Anbrechen wählen",
	"book.undone_open": "Rückgängig gemacht: wieder ungeöffnet.",
	"stock.open_one": "1 Pkg. „{name}“ anbrechen",
	"stock.opened": "angebrochen",
	"stock.opened_on": "{date} · angebrochen am {opened}",
	"stock.opened_one": "1 Pkg. „{name}“ angebrochen.",
	"stock.opened_until": "1 Pkg. „{name}“ angebrochen, haltbar bis {date}.",
	"stock.opened_label": "Etikett drucken",
	"settings.category.opened_days": "Haltbar nach Anbruch",
	"tip.opened_days": "Wie viele Tage eine angebrochene Packung noch hält (Milch 3, Marmelade 28). Das Ablaufdatum wird dann früher, nie später. Leer: Anbrechen ändert das Datum nicht (Nudeln).",
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
	"valid.level_below": "Der Rest muss unter dem aktuellen Stand liegen",
	"valid.ean": "Die EAN besteht aus 8 bis 14 Ziffern.",
	"valid.ean_taken": "Diese EAN gehört schon zu „{name}“.",
	"valid.days": "Bitte eine ganze Zahl ab 0 eingeben.",
	"valid.partial_one": "Eine angebrochene Packung mit Füllstand ist immer genau 1 Packung an einem Ort.",
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
	"stock.location": "Lagerort",
	"stock.all_locations": "Alle Lagerorte",
	"stock.empty": "Noch nichts eingelagert.",
	"stock.no_date": "ohne Datum",
	"receipt.open": "Kassenbon importieren",
	"receipt.title": "Kassenbon importieren",
	"receipt.scan": "Bon scannen",
	"receipt.photo": "Oder Foto wählen",
	"receipt.photo_invalid": "Das Bild konnte nicht gelesen werden.",
	"receipt.preview": "Gescannter Kassenbon",
	"receipt.photo_hint": "Der Text wird auf diesem Gerät erkannt; an die KI geht nur der Text, nicht das Foto. Beim ersten Mal lädt der Scan einige MB.",
	"camera.title": "Foto aufnehmen",
	"camera.title_scan": "Kassenbon scannen",
	"camera.capture": "Auslösen",
	"camera.live_hint": "Bon flach auf einen dunklen Untergrund legen; der erkannte Rand wird markiert.",
	"camera.corners_hint": "Ziehe die Ecken auf die Ecken des Bons.",
	"camera.uncut": "Ohne Zuschnitt",
	"camera.apply": "Übernehmen",
	"camera.no_scan": "Der Dokumentenscan konnte nicht geladen werden. „Ohne Zuschnitt“ geht trotzdem.",
	"scan.corner_0": "Ecke oben links",
	"scan.corner_1": "Ecke oben rechts",
	"scan.corner_2": "Ecke unten rechts",
	"scan.corner_3": "Ecke unten links",
	"receipt.read": "Bon lesen",
	"receipt.ocr": "Text wird erkannt … {percent} %",
	"receipt.ai": "KI liest den Bon …",
	"receipt.booking": "Wird eingebucht …",
	"receipt.no_text": "Auf dem Foto wurde kein Text erkannt. Bitte den Bon gerade und hell fotografieren.",
	"receipt.no_items": "Die KI hat auf dem Bon keine Produkte gefunden.",
	"receipt.store": "Händler",
	"receipt.store_hint": "Vorrat merkt sich je Händler, welches Produkt zu welcher Bonzeile gehört.",
	"receipt.product": "Produkt",
	"receipt.choose": "Bitte ein Produkt wählen.",
	"receipt.choose_option": "Bitte wählen …",
	"receipt.new": "Neues Produkt anlegen",
	"receipt.skip": "Nicht einbuchen",
	"receipt.guess_hint": "Leer lassen: wird aus der Haltbarkeit geschätzt.",
	"receipt.book": "{count} einbuchen",
	"receipt.done": "{count} Pkg. vom Kassenbon eingebucht.",
	"stock.guessed": "geschätzt",
	"stock.guessed_date": "{date} (geschätzt)",
	"stock.approx_date": "ca. {date}",
	"stock.take_one": "1 Pkg. „{name}“ auslagern",
	"stock.level": "Füllstand „{name}“",
	"stock.left": "ca. {level}",
	"stock.left_amount": "{left} (ca. {amount})",
	"stock.taken_one": "1 Pkg. „{name}“ ausgelagert.",
	"stock.undo": "Rückgängig",
	"stock.edit_batch": "Charge „{name}“ ({location}) bearbeiten",
	"stock.with_empty": "Auch Produkte ohne Bestand",
	"stock.zero_hint": "0 entfernt die Charge an diesem Lagerort.",
	"expiry.days": "Warnschwelle",
	"expiry.days_placeholder": "je Produkt",
	"expiry.days_invalid": "Ganze Zahl ab 0",
	"expiry.recipes": "Rezepte für Ablaufendes",
	"expiry.recipe_detail": "Verbraucht: {products} · {available} von {total} vorhanden",
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
	"recipes.to_plan": "Einplanen",
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
	"delete.kind.change.meal_plan": "Einträge im Speiseplan bleiben als Freitext ({n})",
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
	"recipes.import.hint_ai": "Seiten mit Rezeptdaten nach schema.org, z. B. Chefkoch. Sonst liest die KI den Beitrag aus: Instagram, TikTok, YouTube (Beschreibung, Video, Bild).",
	"recipes.import.source": "Quelle",
	"recipes.import.source_url": "Link",
	"recipes.import.source_text": "Text",
	"recipes.import.source_photo": "Foto",
	"recipes.import.text": "Rezepttext",
	"recipes.import.text_hint": "Beliebiger Text mit Zutaten und Zubereitung; die KI ordnet ihn.",
	"recipes.import.photo": "Foto",
	"recipes.import.take_photo": "Foto aufnehmen",
	"recipes.import.photo_hint": "Z. B. eine Kochbuchseite oder ein Screenshot; die KI liest es aus.",
	"recipes.import.photo_invalid": "Das Bild konnte nicht gelesen werden.",
	"recipes.import.busy": "Rezept wird geladen …",
	"recipes.import.busy_ai": "Rezept wird gelesen … Mit KI kann das eine Minute dauern.",
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
	"recipes.expiring": "Ablaufendes: {n}",
	"recipes.expiring_only": "Nur mit Ablaufendem",
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
	"tip.expiry_type": "Mindesthaltbarkeit: danach oft noch gut. Verbrauchsdatum: danach nicht mehr verwenden. Richtwert: kein aufgedrucktes Datum (frisches Obst, Gedörrtes), geschätzt aus der Haltbarkeit.",
	"tip.warn_days": "So viele Tage vor dem Datum gilt eine Packung als bald ablaufend (orange, Tab „Ablauf“).",
	"tip.min_stock": "Ist weniger da (diese Kategorie samt Unterkategorien), kommt der Rest auf die Einkaufsliste.",
	"tip.min_packages": "Sind weniger Packungen da (samt Unterkategorien), kommt der Rest auf die Einkaufsliste.",
	"tip.product_min_packages": "Sind weniger Packungen dieses Produkts da, kommt es auf die Einkaufsliste. Zählt auch für die Mindestmengen seiner Kategorien.",
	"tip.content": "Inhalt einer Packung, z. B. 500 g (bei Konserven das Abtropfgewicht). Damit rechnen Mindestmengen und Rezepte.",
	"tip.make_default": "Der gewählte Lagerort wird zum Standard-Lagerort dieses Produkts.",
	"tip.print": "Druckt pro Packung ein Etikett mit QR-Code (höchstens 20).",
	"tip.optional": "Optionale Zutaten zählen nicht zur Verfügbarkeit des Rezepts.",
	"tip.skip_stock": "Für Zutaten, die du nicht im Vorrat führst (z. B. Salz, Wasser): keine Prüfung, nie auf der Einkaufsliste.",
	"plan.prev": "Zurück",
	"plan.next": "Weiter",
	"plan.view.label": "Ansicht",
	"plan.view.day": "Tag",
	"plan.view.week": "Woche",
	"plan.view.month": "Monat",
	"plan.slot.0": "Frühstück",
	"plan.slot.1": "Mittag",
	"plan.slot.2": "Kaffee",
	"plan.slot.3": "Abendessen",
	"plan.slot.4": "Snack",
	"plan.slot_label": "Mahlzeit",
	"plan.shift": "Ab hier um einen Tag verschieben",
	"plan.shift_title": "{slot} verschieben",
	"plan.shift_ok": "Verschieben",
	"plan.today": "Heute",
	"plan.add": "Gericht hinzufügen",
	"plan.date": "Datum",
	"plan.dish": "Gericht",
	"tab.canning": "Haltbarmachen",
	"book.shelf_hint": "Vorschlag aus der Haltbarkeit: {days} Tage ({source}).",
	"book.guess_hint": "Leer lassen: wird auf heute + {days} Tage geschätzt ({source}).",
	"valid.category": "Bitte eine Kategorie wählen.",
	"valid.canning_temp": "Bitte eine ganze Zahl von 1 bis 200 eingeben.",
	"valid.canning_minutes": "Bitte eine ganze Zahl von 1 bis 1440 eingeben.",
	"valid.shelf_days": "Bitte eine ganze Zahl ab 1 eingeben oder leer lassen.",
	"tip.shelf_days": "Übliche Haltbarkeit ab Einkauf. Bleibt das Datum beim Einbuchen leer, wird heute plus diese Tage geschätzt (Einkoch-Protokoll: Herstellungsdatum plus diese Tage). Leer: keine Schätzung.",
	"tip.food": "Kein Lebensmittel (z. B. Batterien, Haushalt): diese Kategorie und alles darunter wird nie als Rezeptzutat angeboten.",
	"settings.category.shelf_days": "Haltbarkeit",
	"settings.category.shelf_short": "haltbar {days}",
	"settings.category.opened_short": "angebrochen {days}",
	"settings.food.label": "Lebensmittel",
	"settings.food.yes": "Lebensmittel",
	"settings.food.no": "Kein Lebensmittel",
	"recipes.field.canning_temp": "Temperatur",
	"recipes.field.canning_minutes": "Dauer",
	"recipes.minutes_unit": "Min.",
	"stock.charge": "{date} · Charge {charge}",
	"canning.add": "Protokoll anlegen",
	"canning.empty": "Noch keine Einkoch-Protokolle.",
	"canning.made_on": "Hergestellt am",
	"canning.product": "Produkt",
	"canning.new_product": "Neues Produkt: bitte eine Kategorie wählen.",
	"canning.jars": "Gläser",
	"canning.recipe": "Einkochrezept",
	"canning.expires_on": "Haltbar bis",
	"canning.notes": "Notizen",
	"canning.fixed": "Charge {charge}: {name}, {jars} Gläser. Herstellungsdatum, Produkt und Gläser stehen auf den Etiketten und bleiben fest; den Bestand änderst du unter „Bestand“.",
	"canning.saved": "Charge {charge} angelegt und eingebucht.",
	"canning.jars_left": "{left} von {jars} Gläsern da",
	"canning.until": "haltbar bis {date}",
	"delete.kind.delete.canning": "Einkoch-Protokolle werden gelöscht ({n})",
	"canning.view.label": "Ansicht",
	"canning.view.protocols": "Protokolle",
	"canning.view.recipes": "Rezepte",
	"canning.recipe_add": "Einkochrezept anlegen",
	"canning.recipes_empty": "Noch keine Einkochrezepte. Jedes Einkochrezept legt fest, welches Produkt dabei herauskommt.",
	"canning.recipe_makes": "Ergibt Produkt",
	"canning.recipe_jars": "Ergibt (Gläser)",
	"canning.recipe_summary": "ergibt {jars} × {name}",
	"canning.recipe_product": "Ergibt: {name} (aus dem Einkochrezept)",
	"delete.kind.delete.recipe": "Einkochrezepte werden gelöscht ({n})",
	"recipes.steps.step": "Schritt {n}",
	"recipes.steps.head": "Zwischenüberschrift",
	"recipes.steps.add": "Schritt hinzufügen",
	"recipes.steps.head_add": "Zwischenüberschrift hinzufügen",
	"recipes.steps.up": "Nach oben",
	"recipes.steps.down": "Nach unten",
	"recipes.steps.remove": "Entfernen",
	"valid.too_long": "Höchstens {n} Zeichen.",
	"cook.open": "Kochmodus",
	"cook.title": "„{name}“ kochen",
	"cook.close": "Kochmodus schließen",
	"cook.hint": "Schritt antippen zum Abhaken.",
	"cook.timer_start": "Timer {what} starten",
	"cook.timer": "Schritt {n}, {what}",
	"cook.timer_done": "abgelaufen",
	"cook.timer_cancel": "Timer entfernen",
	"cook.stop": "Kochmodus schließen? Laufende Timer gehen verloren.",
	"cook.stop_ok": "Schließen",
	"common.close": "Schließen",
	"cooked.open": "Gekocht",
	"cooked.title": "„{name}“ gekocht",
	"cooked.hint": "Vorschlag aus dem Vorrat: Produkt, Charge, Packungen oder Aktion je Zeile ändern.",
	"cooked.empty": "Keine Zutat dieses Rezepts ist vorrätig.",
	"level.full": "voll",
	"level.three_quarters": "¾",
	"level.half": "½",
	"level.quarter": "¼",
	"level.low": "fast leer",
	"level.empty": "leer",
	"cooked.submit": "Ausbuchen",
	"cooked.product": "Produkt",
	"cooked.batch": "Charge",
	"cooked.used_up": "Aufgebrauchte Packungen",
	"cooked.packages": "Packungen",
	"cooked.action": "Aktion",
	"cooked.action.out": "Ausbuchen",
	"cooked.action.open": "Anbrechen",
	"cooked.action.skip": "Überspringen",
	"cooked.fefo": "Frühestes zuerst",
	"cooked.no_date": "ohne Datum",
	"cooked.pkg": "{n} Pckg.",
	"cooked.frozen": "gefroren",
	"cooked.opened": "angebrochen",
	"cooked.also_open": "und für den Rest eine weitere Packung anbrechen",
	"cooked.done": "Gebucht: {what}",
	"cooked.done_out": "{n} × {name} ausgebucht",
	"cooked.done_open": "{n} × {name} angebrochen",
	"cooked.done_reduce": "{name}: Rest verringert",
	"cooked.action.reduce": "Rest verringern",
	"cooked.left_after": "Rest danach",
	"cooked.no_opened": "Keine angebrochene Packung",
	"book.ai.running": "KI prüft das neue Produkt …",
	"book.ai.ok": "KI-Prüfung: keine Änderungen.",
	"book.ai.changed": "Von der KI geändert: {reason} (vorher: {before})",
	"book.ai.undo": "Rückgängig",
	"book.ai.new_type": "Neue Produktart „{name}“ unter „{parent}“, wird beim Einbuchen angelegt.",
	"recipes.ai.running": "KI prüft das Rezept …",
	"recipes.ai.skip": "Nicht abwarten",
	"recipes.ai.ok": "KI-Prüfung: keine Änderungen.",
	"recipes.ai.skipped": "KI-Prüfung übersprungen.",
	"recipes.ai.undo_steps": "Schritte zurücksetzen",
	"recipes.ai.changed": "Von der KI geändert: {reason} (vorher: {before})",
	"recipes.ai.undo": "Rückgängig",
	"recipes.ai.new_type": "KI schlägt neue Produktart „{name}“ unter „{parent}“ vor, wird beim Speichern angelegt: {reason}",
	"recipes.ai.changed_one": "KI-Prüfung: 1 Zutat geändert (markiert).",
	"recipes.ai.changed_many": "KI-Prüfung: {n} Zutaten geändert (markiert).",
	"recipes.ai.steps": "KI-Prüfung: Schritte neu aufgeteilt.",
	"recipes.export": "JSON herunterladen",
	"recipes.export_all": "Alle Rezepte exportieren",
	"recipes.export_all_file": "rezepte.json",
	"recipes.print_pdf": "Drucken / PDF",
	"recipes.printed": "Rezept gedruckt.",
	"settings.section.meals": "Mahlzeiten",
	"settings.meals.hint": "Ab wann eine Mahlzeit gilt. Bestimmt die aktuelle Mahlzeit, z. B. für die Aktion „Geplantes Rezept drucken“ ohne Angabe der Mahlzeit. Vor der ersten Startzeit gilt noch die letzte Mahlzeit des Vortags.",
	"settings.meals.from": "ab {time} Uhr",
	"settings.meals.edit": "Startzeiten der Mahlzeiten bearbeiten",
	"valid.time": "Bitte eine Uhrzeit angeben.",
	"common.print": "Bon drucken",
	"plan.printed": "Speiseplan gedruckt.",
	"plan.shop": "Einkaufsliste",
	"plan.shop.title": "Einkaufsliste aus dem Speiseplan",
	"plan.shop.hint": "Die im Zeitraum geplanten Rezepte kommen mit den summierten Portionen auf die Einkaufsliste; Vorhandenes wird abgezogen. Gerichte mit freiem Text werden übersprungen.",
	"plan.shop.from": "Von",
	"plan.shop.to": "Bis",
	"plan.shop.submit": "Auf die Liste",
	"plan.shop.order": "Das Ende darf nicht vor dem Start liegen.",
	"plan.shop.long": "Höchstens {max} Tage.",
	"plan.shop.done": "Auf der Einkaufsliste: {recipes}.",
	"plan.shop.none": "Im Zeitraum sind keine Rezepte geplant.",
	"frozen.packages_range": "1 bis {n} Packungen.",
	"frozen.freeze_title": "„{name}“ einfrieren",
	"frozen.thaw_title": "„{name}“ auftauen",
	"frozen.to": "Ziel-Lagerort",
	"frozen.to_default_freeze": "Erster Gefrierort",
	"frozen.to_default_thaw": "Lagerort des Produkts",
	"frozen.freeze": "Einfrieren",
	"frozen.thaw": "Auftauen",
	"frozen.frozen": "„{name}“ eingefroren ({location}), haltbar ca. bis {date}.",
	"frozen.thawed": "„{name}“ aufgetaut ({location}), haltbar bis {date}.",
	"stock.frozen_on": "{date} · eingefroren am {frozen}",
	"settings.location.freezer": "Gefrierort",
	"settings.location.freezer_hint": "Frische Lebensmittel, die hier eingebucht oder hierher umgelagert werden, gelten als eingefroren (Tiefkühlware nicht).",
	"settings.category.frozen_days": "Haltbar eingefroren",
	"settings.category.frozen_short": "eingefroren {days}",
	"tip.frozen_days": "Wie viele Tage ein selbst eingefrorenes Produkt hält (Fleisch 180, Brot 90). Das Datum wird beim Einfrieren zu heute + diese Tage (Richtwert).",
	"settings.frozen_goods.label": "Tiefkühlware",
	"settings.frozen_goods.yes": "Tiefkühlware",
	"settings.frozen_goods.no": "Keine Tiefkühlware",
	"canning.add_title": "Einkochprotokoll anlegen",
	"drying.add_title": "Dörrprotokoll anlegen",
	"drying.empty": "Noch keine Dörr-Protokolle.",
	"drying.jars": "Packungen",
	"drying.recipe": "Dörrrezept",
	"drying.fixed": "Charge {charge}: {name}, {jars} Packungen. Herstellungsdatum, Produkt und Packungen stehen auf den Etiketten und bleiben fest; den Bestand änderst du unter „Bestand“.",
	"drying.jars_left": "{left} von {jars} Packungen da",
	"drying.recipe_add": "Dörrrezept anlegen",
	"drying.recipes_empty": "Noch keine Dörrrezepte. Jedes Dörrrezept legt fest, welches Produkt dabei herauskommt.",
	"drying.recipe_jars": "Ergibt (Packungen)",
	"drying.recipe_product": "Ergibt: {name} (aus dem Dörrrezept)",
	"drying.hours_unit": "Std.",
	"valid.drying_hours": "Bitte 0,5 bis 24 Stunden eingeben.",
	"preserve.kind_label": "Art",
	"preserve.canning": "Einkochen",
	"preserve.drying": "Dörren",
	"stocktake.start": "Inventur",
	"stocktake.location": "Lagerort",
	"stocktake.choose": "Bitte wählen",
	"stocktake.hint": "Scanne alles, was hier liegt (Barcode, Etikett oder Name). Was nicht gescannt wird, gilt als fehlend.",
	"stocktake.counted": "{n} von {packages} gezählt",
	"stocktake.missing": "fehlt {n}",
	"stocktake.too_many": "{n} zu viel",
	"stocktake.extra": "Nicht im Bestand",
	"history.start": "Verlauf",
	"history.name": "Produkt",
	"history.user": "Benutzer",
	"history.all_users": "Alle Benutzer",
	"history.from": "Von",
	"history.to": "Bis",
	"history.packages": "{n} Pkg.",
	"history.kind.in": "Eingelagert",
	"history.kind.out": "Ausgelagert",
	"history.kind.move": "Umgelagert",
	"history.kind.correct": "Korrigiert",
	"history.kind.open": "Angebrochen",
	"history.kind.freeze": "Eingefroren",
	"history.kind.thaw": "Aufgetaut",
	"history.kind.remaining": "Füllstand geändert",
	"history.undone": "Rückgängig gemacht am {date}",
	"history.undone_by": "Rückgängig gemacht am {date} von {user}",
	"history.partly": "Teilweise rückgängig gemacht",
	"history.undo_title": "Aktion vom {date} rückgängig machen?",
	"history.undo_message": "Alles, was dabei gebucht wurde, wird zurückgebucht. Die Einträge bleiben im Verlauf und werden durchgestrichen.",
	"history.newer": "Neuere",
	"history.older": "Ältere",
	"history.empty": "Keine Buchungen gefunden.",
	"history.more_rows": "+{n} weitere",
	"history.range_error": "„Von“ liegt nach „Bis“.",
	"stocktake.pick": "Welche Charge von „{name}“?",
	"stocktake.less": "Eine Packung „{name}“ weniger",
	"stocktake.one_more": "Eine Packung „{name}“ mehr",
	"stocktake.apply": "Differenzen buchen",
	"stocktake.confirm_title": "Differenzen buchen?",
	"stocktake.confirm_message": "{missing} Pkg. fehlen, {more} Pkg. sind zu viel. Beides wird als Korrektur gebucht.",
	"stocktake.done": "{n} Korrekturen gebucht.",
	"stocktake.empty": "Laut Bestand liegt hier nichts. Gescannte Packungen erscheinen unter „Nicht im Bestand“.",
	"location_label.print": "Etikett für „{name}“ drucken",
	"location_label.hint": "Gescannt im Buchungsfeld gilt dieser Lagerort für die folgenden Buchungen.",
	"location_label.active": "Lagerort: {name} (für die folgenden Buchungen)",
	"location_label.clear": "Aufheben",
	"location_label.unknown": "Unbekannter Lagerort.",
	"stock.mode_freeze": "Einfrieren",
	"book.undone_frozen": "Rückgängig gemacht.",
	"book.pick_freeze": "Produkt zum Einfrieren wählen",
	"tab.emergency": "Notvorrat",
	"emergency.supply": "Reicht für {days} Tage",
	"emergency.target": "{persons} Personen, Ziel {days} Tage",
	"emergency.group": "Gruppe",
	"emergency.need": "Soll",
	"emergency.have": "Ist",
	"emergency.lasts": "Reicht für",
	"emergency.days": "{days} Tage",
	"emergency.unknown": "{n} Packungen ohne Menge",
	"emergency.hint": "Zählt, was nicht abgelaufen ist und dessen Packungsinhalt in kg oder l angegeben ist (1 l zählt als 1 kg; Eier mit 60 g je Stück). Soll nach den Empfehlungen des BBK, Personenzahl wie bei der Wochenplanung.",
	"emergency.group.drinks": "Getränke",
	"emergency.group.grains": "Getreide, Brot, Nudeln, Reis, Kartoffeln",
	"emergency.group.vegetables": "Gemüse und Hülsenfrüchte",
	"emergency.group.fruit_nuts": "Obst und Nüsse",
	"emergency.group.dairy": "Milch und Milchprodukte",
	"emergency.group.meat_fish_eggs": "Fleisch, Fisch und Eier",
	"emergency.group.fats": "Fette und Öle",
	"settings.emergency_group.label": "Notvorrat",
	"settings.emergency_group.none": "Nicht im Notvorrat",
	"tip.emergency_group": "Zu welcher Lebensmittelgruppe des Notvorrats diese Kategorie und alles darunter zählt. „Nicht im Notvorrat“ nimmt sie heraus (z. B. Kaffee).",
	"preserve.leftover": "Reste",
	"leftovers.add_title": "Reste einlagern",
	"leftovers.dish": "Gericht",
	"leftovers.jars": "Portionen",
	"leftovers.jars_left": "{jars} Portionen, {left} vorrätig",
	"leftovers.empty": "Noch keine Reste eingelagert.",
	"leftovers.fixed": "Charge {charge}: {name}, {jars} Portionen. Herstellungsdatum, Gericht und Portionen stehen auf den Etiketten und bleiben fest; den Bestand änderst du unter „Bestand“.",
	"leftovers.store": "Reste einlagern",
	"leftovers.stored": "Reste eingelagert: Charge {charge}",
	"diet.label": "Ernährung",
	"diet.vegan": "Vegan",
	"diet.vegetarian": "Vegetarisch",
	"diet.none": "Nicht vegetarisch",
	"diet.unknown": "Unbekannt",
	"diet.not_vegetarian": "nicht vegetarisch",
	"diet.not_vegan": "nicht vegan",
	"diet.missing": "Angaben fehlen",
	"allergens.label": "Allergene",
	"allergens.none": "Keine Hauptallergene",
	"allergens.none_hint": "Nichts angehakt = keines der 14 Hauptallergene",
	"allergens.own": "Eigene Angabe",
	"allergens.contains": "Enthält: {list}",
	"allergen.gluten": "Gluten",
	"allergen.crustaceans": "Krebstiere",
	"allergen.eggs": "Eier",
	"allergen.fish": "Fisch",
	"allergen.peanuts": "Erdnüsse",
	"allergen.soybeans": "Soja",
	"allergen.milk": "Milch",
	"allergen.nuts": "Schalenfrüchte (Nüsse)",
	"allergen.celery": "Sellerie",
	"allergen.mustard": "Senf",
	"allergen.sesame-seeds": "Sesam",
	"allergen.sulphur-dioxide-and-sulphites": "Schwefeldioxid und Sulfite",
	"allergen.lupin": "Lupinen",
	"allergen.molluscs": "Weichtiere",
	"recipes.diet.filter": "Ernährung",
	"recipes.diet.all": "Alle",
	"recipes.diet.without": "Ohne",
	"recipes.diet.unknown": "Angaben fehlen bei: {list}",
	"recipes.diet.optional": "Optional: {list}",
	"diet.reload.button": "Allergene von Open Food Facts nachladen",
	"diet.reload.stop": "Anhalten",
	"diet.reload.progress": "{n} von {m} geprüft",
	"diet.reload.result": "{n} von {m} Produkten ergänzt",
	"diet.reload.hint": "Holt Allergene und Ernährung für Produkte mit EAN. Open Food Facts begrenzt die Anfragen, darum etwa ein Produkt pro Sekunde.",
	"tip.diet": "Vegan, vegetarisch oder nicht vegetarisch. Ein leeres Feld erbt von der Kategorie darüber; ganz oben heißt es unbekannt.",
	"tip.allergens": "Die enthaltenen der 14 Hauptallergene (Spuren zählen nicht). Ohne eigene Angabe erbt das Feld von der Kategorie darüber.",
	"diet.reload.error": "Open Food Facts antwortet gerade nicht oder bremst. Später mit dem Knopf weitermachen, schon geprüfte Produkte werden nicht noch einmal gefragt.",
	"settings.section.transfer": "Import / Export",
	"transfer.export.title": "Export",
	"transfer.export.products": "Produkte exportieren",
	"transfer.export.stock": "Bestand exportieren",
	"transfer.export.action": "Exportieren",
	"transfer.export.notice": "Die Datei ist für den privaten Gebrauch. Produktdaten können von Open Food Facts stammen (Lizenz ODbL): Gibst du die Datei weiter, nenne die Quelle und behalte die Lizenz bei.",
	"transfer.import.title": "Import",
	"transfer.source.products": "Produkte (CSV)",
	"transfer.source.stock": "Bestand (CSV)",
	"transfer.source.grocy": "Grocy (JSON, mehrere Dateien)",
	"transfer.hint.csv": "Spalten und Beispiele stehen in der Anleitung. Der Bestand wird nur auf die Zahl in der Datei erhöht, nie ausgebucht.",
	"transfer.hint.grocy": "Die Dateien aus /api/objects/ von Grocy: products ist Pflicht, dazu product_groups, locations, quantity_units, product_barcodes und stock. Mehrere Dateien auf einmal wählen.",
	"transfer.file": "Datei",
	"transfer.none": "Nichts zu ändern.",
	"transfer.review": "Import prüfen",
	"transfer.apply": "Übernehmen",
	"transfer.counts": "{create} neu, {update} geändert, {error} mit Fehler, {skip} unverändert oder übersprungen.",
	"transfer.done": "Import abgeschlossen: {create} neu, {update} geändert, {error} mit Fehler.",
	"transfer.group.create": "Neu ({n})",
	"transfer.group.update": "Geändert ({n})",
	"transfer.group.error": "Fehler ({n})",
	"transfer.group.skip": "Übersprungen ({n})",
	"transfer.row": "Zeile {line} · {name}",
	"transfer.more": "und {n} weitere",
	"transfer.new.category": "Neue Kategorie",
	"transfer.new.location": "Neuer Lagerort",
	"transfer.field.category": "Kategorie",
	"transfer.field.ean": "EAN",
	"transfer.field.content_amount": "Inhalt",
	"transfer.field.content_unit": "Inhalt-Einheit",
	"transfer.field.location": "Lagerort",
	"transfer.field.expiry_type": "Datumsart",
	"transfer.field.warn_days": "Warnung (Tage)",
	"transfer.field.shelf_days": "Haltbarkeit (Tage)",
	"transfer.field.opened_days": "Nach dem Öffnen (Tage)",
	"transfer.field.frozen_days": "Eingefroren (Tage)",
	"transfer.field.min_packages": "Mindestbestand",
	"transfer.field.diet": "Ernährung",
	"transfer.field.allergens": "Allergene",
	"transfer.field.packages": "Packungen",
	"transfer.field.expires_on": "Haltbar bis",
	"transfer.field.opened_on": "Geöffnet am",
	"transfer.field.frozen_on": "Eingefroren am",
	"transfer.reason.more_in_stock": "Es ist schon mehr da; es wird nie ausgebucht.",
	"transfer.reason.charge_skipped": "Eingekochte Charge: wird nicht importiert.",
	"transfer.reason.partial_skipped": "Angebrochene Packung: wird nicht importiert.",
	"transfer.reason.ambiguous": "Mehrere Treffer; Marke oder Namen eindeutig machen.",
	"transfer.reason.category_required": "Keine Kategorie gefunden; Spalte category ausfüllen.",
	"transfer.reason.unknown_unit": "Unbekannte Einheit.",
	"transfer.reason.location_required": "Kein Lagerort angegeben und keiner vorgegeben.",
	"transfer.reason.not_found": "Produkt nicht gefunden.",
	"transfer.reason.duplicate": "Gibt es schon (EAN).",
	"transfer.reason.invalid_ean": "Ungültige EAN.",
	"transfer.reason.invalid_value": "Ungültiger Wert.",
	"transfer.reason.invalid_date": "Ungültiges Datum.",
	"transfer.reason.other": "Nicht möglich ({key}).",
	"transfer.file_name.products": "vorrat-produkte",
	"transfer.file_name.stock": "vorrat-bestand"
}, Mt = {
	"panel.title": "Home Inventory",
	"panel.help": "User guide",
	"panel.menu": "Menu",
	"tab.stock": "Stock",
	"tab.expiry": "Expiry",
	"tab.shopping": "Shopping",
	"tab.recipes": "Recipes",
	"tab.plan": "Meal plan",
	"tab.settings": "Settings",
	"common.save": "Save",
	"common.cancel": "Cancel",
	"common.delete": "Delete",
	"common.reset": "Reset",
	"common.name": "Name",
	"common.none": "none",
	"common.empty": "No entries yet.",
	"common.expand": "Expand",
	"common.collapse": "Collapse",
	"settings.nav": "Section",
	"settings.section.categories": "Categories",
	"settings.section.locations": "Locations",
	"settings.section.units": "Units",
	"settings.section.defaults": "Defaults",
	"settings.defaults.hint": "Apply to all categories and products that have no value of their own and inherit none.",
	"settings.defaults.edit": "Edit defaults",
	"settings.defaults.no_location": "– none (choose when booking in) –",
	"settings.location.add": "Add location",
	"settings.location.move_name": "Move “{name}”",
	"settings.location.move_target": "Target location",
	"settings.location.move_choose": "Please choose",
	"settings.location.move_summary": "To move: {batches} batch(es), {packages} pkg. The location “{name}” stays.",
	"settings.location.move_empty": "Nothing is stored at this location.",
	"settings.location.move_action": "Move",
	"settings.unit.add": "Add unit",
	"settings.category.add": "Add main category",
	"settings.unit.symbol": "Symbol",
	"settings.unit.is_count": "Counts packages",
	"settings.unit.recipe_only": "Recipes only",
	"settings.unit.recipe_only_hint": "Not offered for stock and shopping. Converted to the base unit for shopping (tbsp → ml), otherwise “any” applies.",
	"settings.unit.no_conversion": "no conversion (counts as any amount)",
	"recipes.approx": "≈ {what}",
	"settings.unit.base": "Base unit",
	"settings.unit.factor": "Factor",
	"settings.unit.count": "Count",
	"settings.category.parent": "Parent category",
	"settings.category.no_parent": "– none (main category) –",
	"settings.category.unit": "Unit",
	"settings.category.location": "Default location",
	"settings.category.expiry_type": "Date type",
	"settings.category.warn_days": "Warning before expiry",
	"settings.category.min_stock": "Minimum amount",
	"settings.category.off_tags": "Open Food Facts tags: {tags}",
	"settings.category.min": "min. {value}",
	"settings.expiry.best_before": "Best before",
	"settings.expiry.use_by": "Use by",
	"settings.expiry.guide": "Guide value",
	"settings.days": "{n} days",
	"settings.inherit_from": "from {name}",
	"settings.inherit_default": "Default",
	"settings.day": "{n} day",
	"book.camera": "Camera",
	"book.unknown": "Product not found.",
	"book.no_hits": "No results.",
	"book.search_online": "Search online",
	"book.new_product": "New product",
	"book.brand": "Brand",
	"book.category": "Category",
	"book.choose": "– please choose –",
	"book.content": "Content",
	"book.content_unit": "Unit",
	"book.expires_on": "Expiry date",
	"book.no_date_hint": "Leave empty if there is no expiry date.",
	"book.no_date": "no date",
	"book.location": "Location",
	"book.packages": "Packages",
	"book.which": "Which package",
	"book.fefo": "Automatic (earliest date first)",
	"book.count": "{n} pkg.",
	"book.no_stock": "Not in stock.",
	"book.submit_in": "Book in",
	"book.submit_out": "Book out",
	"book.done_in": "{n} × {name} booked in",
	"book.done_out": "{n} × {name} booked out",
	"book.undone": "Undone: back in stock.",
	"scan.title": "Scan barcode",
	"scan.https": "The camera needs HTTPS (or localhost).",
	"scan.no_camera": "No camera access. Please check the permission.",
	"book.input": "EAN or name",
	"book.done_in_at": "{n} × {name} booked in – {where}",
	"book.filter": "Filter",
	"book.category_required": "Please choose a category.",
	"book.apply": "Apply",
	"book.from_product": "from the product",
	"book.last_used": "last used",
	"book.title_in": "Book in product",
	"book.title_out": "Book out “{name}”",
	"book.pick_in": "Choose a product to book in",
	"book.pick_out": "Choose a product to book out",
	"stock.mode": "What to do with the input",
	"stock.mode_search": "Search",
	"stock.mode_in": "Book in",
	"stock.mode_out": "Book out",
	"stock.mode_open": "Open",
	"book.pick_open": "Choose a product to open",
	"book.undone_open": "Undone: unopened again.",
	"stock.open_one": "Open 1 pkg. of “{name}”",
	"stock.opened": "opened",
	"stock.opened_on": "{date} · opened on {opened}",
	"stock.opened_one": "1 pkg. of “{name}” opened.",
	"stock.opened_until": "1 pkg. of “{name}” opened, keeps until {date}.",
	"stock.opened_label": "Print label",
	"settings.category.opened_days": "Keeps after opening",
	"tip.opened_days": "How many days an opened package still keeps (milk 3, jam 28). The expiry date then gets earlier, never later. Empty: opening does not change the date (pasta).",
	"book.is_new": "(new)",
	"products.ean": "EAN",
	"products.min_packages": "Minimum count (optional)",
	"book.expires_on_type": "Expiry date ({type})",
	"book.make_default": "Becomes default location",
	"valid.required": "Required.",
	"valid.positive": "Must be greater than 0.",
	"valid.content_pair": "Give content and unit together.",
	"valid.date": "Please enter a valid date between 2000 and 2099.",
	"valid.past": "The date is in the past.",
	"valid.location": "Please choose a location.",
	"valid.packages": "Please enter a whole number from 1.",
	"valid.max_packages": "At most {n} pkg. available.",
	"valid.level_below": "The remainder must be below the current level",
	"valid.ean": "An EAN has 8 to 14 digits.",
	"valid.ean_taken": "This EAN already belongs to “{name}”.",
	"valid.days": "Please enter a whole number from 0.",
	"valid.partial_one": "A partly used package is always exactly 1 package at one location.",
	"valid.packages_zero": "Please enter a whole number from 0.",
	"common.none_dash": "–",
	"scan.detector": "The barcode scanner could not be loaded.",
	"common.edit_name": "Edit “{name}”",
	"common.delete_name": "Delete “{name}”",
	"valid.duplicate": "This name is already taken.",
	"common.default": "Inherited: {value} ({source})",
	"settings.category.add_sub_to": "Add subcategory to “{name}”",
	"common.days_unit": "days",
	"common.discard": "Discard changes?",
	"common.discard_ok": "Discard",
	"settings.location.delete_hint": "The location is hidden; its bookings are kept. Where it is the default location, that is removed.",
	"book.choose_category": "Choose category",
	"book.create_category": "Create “{name}”",
	"book.choose_parent": "Choose the parent category for “{name}”",
	"stock.location": "Location",
	"stock.all_locations": "All locations",
	"stock.empty": "Nothing stored yet.",
	"stock.no_date": "no date",
	"receipt.open": "Import receipt",
	"receipt.title": "Import receipt",
	"receipt.scan": "Scan receipt",
	"receipt.photo": "Or choose a photo",
	"receipt.photo_invalid": "The image could not be read.",
	"receipt.preview": "Scanned receipt",
	"receipt.photo_hint": "The text is recognized on this device; only the text goes to the AI, not the photo. The first scan loads a few MB.",
	"camera.title": "Take photo",
	"camera.title_scan": "Scan receipt",
	"camera.capture": "Capture",
	"camera.live_hint": "Lay the receipt flat on a dark surface; the detected edge is marked.",
	"camera.corners_hint": "Drag the corners onto the corners of the receipt.",
	"camera.uncut": "Without cropping",
	"camera.apply": "Apply",
	"camera.no_scan": "The document scan could not be loaded. “Without cropping” still works.",
	"scan.corner_0": "Top left corner",
	"scan.corner_1": "Top right corner",
	"scan.corner_2": "Bottom right corner",
	"scan.corner_3": "Bottom left corner",
	"receipt.read": "Read receipt",
	"receipt.ocr": "Recognizing text … {percent} %",
	"receipt.ai": "The AI reads the receipt …",
	"receipt.booking": "Booking in …",
	"receipt.no_text": "No text was found on the photo. Please photograph the receipt straight and well lit.",
	"receipt.no_items": "The AI found no products on the receipt.",
	"receipt.store": "Store",
	"receipt.store_hint": "Home Inventory remembers per store which product belongs to which receipt line.",
	"receipt.product": "Product",
	"receipt.choose": "Please choose a product.",
	"receipt.choose_option": "Please choose …",
	"receipt.new": "Create new product",
	"receipt.skip": "Do not book in",
	"receipt.guess_hint": "Leave empty: guessed from the shelf life.",
	"receipt.book": "Book in {count}",
	"receipt.done": "{count} pkg. from the receipt booked in.",
	"stock.guessed": "guessed",
	"stock.guessed_date": "{date} (guessed)",
	"stock.approx_date": "approx. {date}",
	"stock.take_one": "Book out 1 pkg. of “{name}”",
	"stock.level": "Level of “{name}”",
	"stock.left": "about {level}",
	"stock.left_amount": "{left} (about {amount})",
	"stock.taken_one": "1 pkg. of “{name}” booked out.",
	"stock.undo": "Undo",
	"stock.edit_batch": "Edit batch “{name}” ({location})",
	"stock.with_empty": "Also products without stock",
	"stock.zero_hint": "0 removes the batch at this location.",
	"expiry.days": "Warning threshold",
	"expiry.days_placeholder": "per product",
	"expiry.days_invalid": "Whole number from 0",
	"expiry.recipes": "Recipes for what expires",
	"expiry.recipe_detail": "Uses: {products} · {available} of {total} available",
	"expiry.empty": "Nothing expires soon.",
	"settings.category.min_packages": "Minimum count",
	"settings.category.min_hint": "Applies to the category with its subcategories; minimums below it are counted in. What is missing goes on the shopping list.",
	"shopping.empty": "Nothing below minimum stock, nothing noted.",
	"shopping.print": "Print shopping list",
	"shopping.printed": "Shopping list printed (items: {n}).",
	"shopping.missing": "{what} missing",
	"shopping.missing_more": "{what} more missing (any from the category)",
	"shopping.and": " and ",
	"shopping.unknown": "Not counted: {n} without content",
	"shopping.recipes.title": "For recipes",
	"shopping.recipe.title": "Put “{name}” on the shopping list",
	"shopping.recipe.no": "Recipe {no}",
	"shopping.ref.title": "Recipe {no} ({name}): {amount}",
	"shopping.ref.title_plain": "Recipe {no} ({name})",
	"shopping.recipe.optional": "Also buy optional ingredients",
	"shopping.recipe.submit": "Apply",
	"recipes.to_shopping": "On the shopping list",
	"recipes.to_plan": "Plan",
	"recipes.on_shopping": "On the shopping list: {what}",
	"shopping.any": "any from the category",
	"shopping.add.title": "Add to shopping list",
	"shopping.add.what": "Product or category",
	"shopping.add.pick": "Please choose a result or create a new one.",
	"shopping.add.category": "Category {path}",
	"shopping.add.new_product": "Create new product “{name}”",
	"shopping.add.new_category": "Create new category “{name}”",
	"shopping.add.creates_product": "The product is created when you save.",
	"shopping.add.creates_category": "The category is created when you save.",
	"shopping.add.change": "Change",
	"shopping.add.packages": "Count",
	"delete.affected": "This also affects:",
	"delete.all": "Delete everything",
	"delete.more": " and {n} more",
	"delete.stock": "Stock at this location",
	"delete.move_to": "Move to “{name}”",
	"delete.book_out": "Remove (booked out)",
	"settings.unit.delete_hint": "What only uses the unit is kept and loses the link: the unit is inherited again, minimum amount or content are dropped.",
	"delete.kind.delete.category": "Subcategories are deleted ({n})",
	"delete.kind.delete.product": "Products are deleted ({n})",
	"delete.kind.delete.stock": "Stock is lost ({n} products)",
	"delete.kind.location_stock": "Stock at this location ({n} products)",
	"delete.kind.delete.booking": "Bookings are deleted ({n})",
	"delete.kind.delete.shopping_item": "Shopping list items are deleted ({n})",
	"delete.kind.delete.unit": "Units based on it are deleted ({n})",
	"delete.kind.change.category": "Categories that refer to it ({n})",
	"delete.kind.change.product": "Products that refer to it ({n})",
	"delete.kind.change.recipe_ingredient": "Recipes whose ingredients refer to it ({n})",
	"delete.kind.change.defaults": "Defaults refer to it",
	"delete.kind.change.meal_plan": "Meal plan entries stay as free text ({n})",
	"delete.kind.other": "More data in “{table}” ({n})",
	"label.print": "Print labels",
	"label.print_name": "Print labels for {name}",
	"label.title": "Print labels for “{name}”",
	"label.count": "Count",
	"label.in_stock": "{n} packages in stock",
	"label.submit": "Print",
	"valid.label_count": "Please enter a whole number from 1 to {max}.",
	"label.confirm_many": "Print {n} labels?",
	"label.printed": "{n} labels printed",
	"book.done_label": "1 × {name} booked out from {where}",
	"recipes.add": "Add recipe",
	"recipes.import.open": "Import",
	"recipes.import.title": "Import recipe",
	"recipes.import.url": "Address (URL)",
	"recipes.import.hint": "Pages with schema.org recipe data, e.g. Chefkoch",
	"recipes.import.submit": "Import",
	"recipes.import.hint_ai": "Pages with schema.org recipe data, e.g. Chefkoch. Otherwise the AI reads the post: Instagram, TikTok, YouTube (caption, video, image).",
	"recipes.import.source": "Source",
	"recipes.import.source_url": "Link",
	"recipes.import.source_text": "Text",
	"recipes.import.source_photo": "Photo",
	"recipes.import.text": "Recipe text",
	"recipes.import.text_hint": "Any text with ingredients and preparation; the AI sorts it.",
	"recipes.import.photo": "Photo",
	"recipes.import.take_photo": "Take photo",
	"recipes.import.photo_hint": "E.g. a cookbook page or a screenshot; the AI reads it.",
	"recipes.import.photo_invalid": "The image could not be read.",
	"recipes.import.busy": "Loading recipe …",
	"recipes.import.busy_ai": "Reading recipe … With the AI this can take a minute.",
	"recipes.ingredient.line": "Original: {line}",
	"recipes.ingredient.unit_new": "New unit …",
	"recipes.ingredient.unit_unknown": "Unit “{unit}” is unknown",
	"recipes.ingredient.unit_create": "Create",
	"unit_add.title": "Add unit",
	"unit_add.name": "Name",
	"unit_add.symbol": "Abbreviation",
	"recipes.search": "Search recipe or ingredient",
	"recipes.empty": "No recipes yet.",
	"recipes.no_hits": "No results.",
	"recipes.expiring": "Expiring: {n}",
	"recipes.expiring_only": "Only with expiring items",
	"recipes.summary": "{available} of {total} available",
	"recipes.portion": "{n} serving",
	"recipes.portions": "{n} servings",
	"recipes.servings": "Servings",
	"recipes.instructions": "Preparation",
	"recipes.source": "Source",
	"recipes.optional": "(optional)",
	"recipes.status.available": "available",
	"recipes.status.missing": "missing {what}",
	"recipes.status.missing_plain": "missing",
	"recipes.status.partial": "partly: {have} of {need} {unit}",
	"recipes.status.unknown": "amount unknown",
	"recipes.status.skipped": "not checked",
	"recipes.status.unmatched": "no ingredient assigned",
	"recipes.field.source_url": "Source (link)",
	"recipes.field.image_url": "Image (link)",
	"recipes.ingredients": "Ingredients",
	"recipes.ingredient.text": "Ingredient",
	"recipes.ingredient.amount": "Amount",
	"recipes.ingredient.unit": "Unit",
	"recipes.ingredient.note": "Note",
	"recipes.ingredient.via": "via {name}",
	"recipes.ingredient.new_type": "Create new product type “{name}”",
	"recipes.ingredient.parent": "Parent category for the new product type “{name}”",
	"recipes.ingredient.unmatched": "not assigned to an ingredient yet",
	"recipes.ingredient.optional": "optional",
	"recipes.ingredient.skip_stock": "Do not check against the stock",
	"recipes.ingredient.remove": "Remove ingredient",
	"recipes.ingredient.add": "Add ingredient",
	"recipes.ingredient.none": "no amount",
	"valid.servings": "Please enter a whole number from 1 to 99.",
	"valid.url": "Please give a link with http:// or https://.",
	"valid.ingredient_what": "Please choose a product type or category.",
	"valid.amount_pair": "Give amount and unit together.",
	"tip.unit_id": "Unit for amounts in this category, e.g. for the minimum amount and recipes.",
	"tip.default_location_id": "New packages land here when booking in, unless you choose another location.",
	"tip.expiry_type": "Best before: often still good after it. Use by: do not use after it. Guide value: no printed date (fresh fruit, dried food), estimated from the shelf life.",
	"tip.warn_days": "This many days before the date a package counts as expiring soon (orange, tab “Expiry”).",
	"tip.min_stock": "If less is there (this category with its subcategories), the rest goes on the shopping list.",
	"tip.min_packages": "If fewer packages are there (with subcategories), the rest goes on the shopping list.",
	"tip.product_min_packages": "If fewer packages of this product are there, it goes on the shopping list. Also counts for the minimums of its categories.",
	"tip.content": "Content of one package, e.g. 500 g (for tins the drained weight). Minimum amounts and recipes calculate with it.",
	"tip.make_default": "The chosen location becomes this product's default location.",
	"tip.print": "Prints one label with a QR code per package (at most 20).",
	"tip.optional": "Optional ingredients do not count toward the recipe's availability.",
	"tip.skip_stock": "For ingredients you do not keep in stock (e.g. salt, water): no check, never on the shopping list.",
	"plan.prev": "Back",
	"plan.next": "Next",
	"plan.view.label": "View",
	"plan.view.day": "Day",
	"plan.view.week": "Week",
	"plan.view.month": "Month",
	"plan.slot.0": "Breakfast",
	"plan.slot.1": "Lunch",
	"plan.slot.2": "Coffee",
	"plan.slot.3": "Dinner",
	"plan.slot.4": "Snack",
	"plan.slot_label": "Meal",
	"plan.shift": "Move by one day from here",
	"plan.shift_title": "Move {slot}",
	"plan.shift_ok": "Move",
	"plan.today": "Today",
	"plan.add": "Add dish",
	"plan.date": "Date",
	"plan.dish": "Dish",
	"tab.canning": "Preserving",
	"book.shelf_hint": "Suggested from the shelf life: {days} days ({source}).",
	"book.guess_hint": "Leave empty: guessed as today + {days} days ({source}).",
	"valid.category": "Please choose a category.",
	"valid.canning_temp": "Please enter a whole number from 1 to 200.",
	"valid.canning_minutes": "Please enter a whole number from 1 to 1440.",
	"valid.shelf_days": "Please enter a whole number from 1 or leave it empty.",
	"tip.shelf_days": "Usual shelf life from purchase. If the date stays empty when booking in, today plus these days is guessed (canning protocol: made-on date plus these days). Empty: no guess.",
	"tip.food": "Not food (e.g. batteries, household): this category and everything below it is never offered as a recipe ingredient.",
	"settings.category.shelf_days": "Shelf life",
	"settings.category.shelf_short": "keeps {days}",
	"settings.category.opened_short": "opened {days}",
	"settings.food.label": "Food",
	"settings.food.yes": "Food",
	"settings.food.no": "Not food",
	"recipes.field.canning_temp": "Temperature",
	"recipes.field.canning_minutes": "Duration",
	"recipes.minutes_unit": "min",
	"stock.charge": "{date} · charge {charge}",
	"canning.add": "Add protocol",
	"canning.empty": "No canning protocols yet.",
	"canning.made_on": "Made on",
	"canning.product": "Product",
	"canning.new_product": "New product: please choose a category.",
	"canning.jars": "Jars",
	"canning.recipe": "Canning recipe",
	"canning.expires_on": "Best before",
	"canning.notes": "Notes",
	"canning.fixed": "Charge {charge}: {name}, {jars} jars. Made-on date, product and jars are on the labels and stay fixed; change the stock under “Stock”.",
	"canning.saved": "Charge {charge} created and booked in.",
	"canning.jars_left": "{left} of {jars} jars left",
	"canning.until": "keeps until {date}",
	"delete.kind.delete.canning": "Canning protocols are deleted ({n})",
	"canning.view.label": "View",
	"canning.view.protocols": "Protocols",
	"canning.view.recipes": "Recipes",
	"canning.recipe_add": "Add canning recipe",
	"canning.recipes_empty": "No canning recipes yet. Each canning recipe sets which product it makes.",
	"canning.recipe_makes": "Makes product",
	"canning.recipe_jars": "Makes (jars)",
	"canning.recipe_summary": "makes {jars} × {name}",
	"canning.recipe_product": "Makes: {name} (from the canning recipe)",
	"delete.kind.delete.recipe": "Canning recipes are deleted ({n})",
	"recipes.steps.step": "Step {n}",
	"recipes.steps.head": "Heading",
	"recipes.steps.add": "Add step",
	"recipes.steps.head_add": "Add heading",
	"recipes.steps.up": "Move up",
	"recipes.steps.down": "Move down",
	"recipes.steps.remove": "Remove",
	"valid.too_long": "At most {n} characters.",
	"cook.open": "Cook mode",
	"cook.title": "Cook “{name}”",
	"cook.close": "Close cook mode",
	"cook.hint": "Tap a step to tick it off.",
	"cook.timer_start": "Start timer {what}",
	"cook.timer": "Step {n}, {what}",
	"cook.timer_done": "done",
	"cook.timer_cancel": "Remove timer",
	"cook.stop": "Close cook mode? Running timers are lost.",
	"cook.stop_ok": "Close",
	"common.close": "Close",
	"cooked.open": "Cooked",
	"cooked.title": "“{name}” cooked",
	"cooked.hint": "Proposal from your stock: change product, batch, packages or action per row.",
	"cooked.empty": "None of this recipe’s ingredients is in stock.",
	"level.full": "full",
	"level.three_quarters": "¾",
	"level.half": "½",
	"level.quarter": "¼",
	"level.low": "almost empty",
	"level.empty": "empty",
	"cooked.submit": "Book out",
	"cooked.product": "Product",
	"cooked.batch": "Batch",
	"cooked.used_up": "Used-up packages",
	"cooked.packages": "Packages",
	"cooked.action": "Action",
	"cooked.action.out": "Book out",
	"cooked.action.open": "Open",
	"cooked.action.skip": "Skip",
	"cooked.fefo": "Earliest first",
	"cooked.no_date": "no date",
	"cooked.pkg": "{n} pkg.",
	"cooked.frozen": "frozen",
	"cooked.opened": "opened",
	"cooked.also_open": "and open one more package for the rest",
	"cooked.done": "Booked: {what}",
	"cooked.done_out": "{n} × {name} out",
	"cooked.done_open": "{n} × {name} opened",
	"cooked.done_reduce": "{name}: remainder reduced",
	"cooked.action.reduce": "Reduce remainder",
	"cooked.left_after": "Left afterwards",
	"cooked.no_opened": "No opened package",
	"book.ai.running": "The AI checks the new product …",
	"book.ai.ok": "AI check: no changes.",
	"book.ai.changed": "Changed by the AI: {reason} (before: {before})",
	"book.ai.undo": "Undo",
	"book.ai.new_type": "New product type “{name}” below “{parent}”, created when booking in.",
	"recipes.ai.running": "The AI checks the recipe …",
	"recipes.ai.skip": "Don't wait",
	"recipes.ai.ok": "AI check: no changes.",
	"recipes.ai.skipped": "AI check skipped.",
	"recipes.ai.undo_steps": "Reset steps",
	"recipes.ai.changed": "Changed by the AI: {reason} (before: {before})",
	"recipes.ai.undo": "Undo",
	"recipes.ai.new_type": "The AI proposes the new product type “{name}” below “{parent}”, created when you save: {reason}",
	"recipes.ai.changed_one": "AI check: 1 ingredient changed (marked).",
	"recipes.ai.changed_many": "AI check: {n} ingredients changed (marked).",
	"recipes.ai.steps": "AI check: steps split anew.",
	"recipes.export": "Download JSON",
	"recipes.export_all": "Export all recipes",
	"recipes.export_all_file": "recipes.json",
	"recipes.print_pdf": "Print / PDF",
	"recipes.printed": "Recipe printed.",
	"settings.section.meals": "Meals",
	"settings.meals.hint": "From when a meal applies. Sets the current meal, e.g. for the action “Print planned recipe” without a meal. Before the first start time the last meal of the day before still applies.",
	"settings.meals.from": "from {time}",
	"settings.meals.edit": "Edit meal start times",
	"valid.time": "Please give a time.",
	"common.print": "Print receipt",
	"plan.printed": "Meal plan printed.",
	"plan.shop": "Shopping list",
	"plan.shop.title": "Shopping list from the meal plan",
	"plan.shop.hint": "The recipes planned in the range go on the shopping list with their summed servings; what is in stock is subtracted. Free-text dishes are skipped.",
	"plan.shop.from": "From",
	"plan.shop.to": "To",
	"plan.shop.submit": "Onto the list",
	"plan.shop.order": "The end must not be before the start.",
	"plan.shop.long": "At most {max} days.",
	"plan.shop.done": "On the shopping list: {recipes}.",
	"plan.shop.none": "No recipes are planned in the range.",
	"frozen.packages_range": "1 to {n} packages.",
	"frozen.freeze_title": "Freeze “{name}”",
	"frozen.thaw_title": "Thaw “{name}”",
	"frozen.to": "Target location",
	"frozen.to_default_freeze": "First freezer",
	"frozen.to_default_thaw": "The product's location",
	"frozen.freeze": "Freeze",
	"frozen.thaw": "Thaw",
	"frozen.frozen": "“{name}” frozen ({location}), keeps until approx. {date}.",
	"frozen.thawed": "“{name}” thawed ({location}), keeps until {date}.",
	"stock.frozen_on": "{date} · frozen on {frozen}",
	"settings.location.freezer": "Freezer",
	"settings.location.freezer_hint": "Fresh food booked in or moved here counts as frozen (frozen goods do not).",
	"settings.category.frozen_days": "Keeps frozen",
	"settings.category.frozen_short": "frozen {days}",
	"tip.frozen_days": "How many days a product you froze yourself keeps (meat 180, bread 90). Freezing sets its date to today + these days (guide value).",
	"settings.frozen_goods.label": "Frozen goods",
	"settings.frozen_goods.yes": "Frozen goods",
	"settings.frozen_goods.no": "Not frozen goods",
	"canning.add_title": "Add canning protocol",
	"drying.add_title": "Add drying protocol",
	"drying.empty": "No drying protocols yet.",
	"drying.jars": "Packages",
	"drying.recipe": "Drying recipe",
	"drying.fixed": "Charge {charge}: {name}, {jars} packages. Made-on date, product and packages are on the labels and stay fixed; change the stock under “Stock”.",
	"drying.jars_left": "{left} of {jars} packages left",
	"drying.recipe_add": "Add drying recipe",
	"drying.recipes_empty": "No drying recipes yet. Each drying recipe sets the product it makes.",
	"drying.recipe_jars": "Makes (packages)",
	"drying.recipe_product": "Makes: {name} (from the drying recipe)",
	"drying.hours_unit": "h",
	"valid.drying_hours": "Please enter 0.5 to 24 hours.",
	"preserve.kind_label": "Kind",
	"preserve.canning": "Canning",
	"preserve.drying": "Drying",
	"stocktake.start": "Stocktaking",
	"stocktake.location": "Location",
	"stocktake.choose": "Please choose",
	"stocktake.hint": "Scan everything stored here (barcode, label or name). Whatever is not scanned counts as missing.",
	"stocktake.counted": "{n} of {packages} counted",
	"stocktake.missing": "{n} missing",
	"stocktake.too_many": "{n} too many",
	"stocktake.extra": "Not in stock",
	"history.start": "History",
	"history.name": "Product",
	"history.user": "User",
	"history.all_users": "All users",
	"history.from": "From",
	"history.to": "To",
	"history.packages": "{n} pkg.",
	"history.kind.in": "Booked in",
	"history.kind.out": "Taken out",
	"history.kind.move": "Moved",
	"history.kind.correct": "Corrected",
	"history.kind.open": "Opened",
	"history.kind.freeze": "Frozen",
	"history.kind.thaw": "Thawed",
	"history.kind.remaining": "Level changed",
	"history.undone": "Undone on {date}",
	"history.undone_by": "Undone on {date} by {user}",
	"history.partly": "Partly undone",
	"history.undo_title": "Undo the action of {date}?",
	"history.undo_message": "Everything booked in it is booked back. The entries stay in the history, struck through.",
	"history.newer": "Newer",
	"history.older": "Older",
	"history.empty": "No bookings found.",
	"history.more_rows": "+{n} more",
	"history.range_error": "“From” is after “To”.",
	"stocktake.pick": "Which batch of “{name}”?",
	"stocktake.less": "One package of “{name}” less",
	"stocktake.one_more": "One more package of “{name}”",
	"stocktake.apply": "Book differences",
	"stocktake.confirm_title": "Book the differences?",
	"stocktake.confirm_message": "{missing} pkg. missing, {more} pkg. too many. Both are booked as corrections.",
	"stocktake.done": "{n} corrections booked.",
	"stocktake.empty": "According to the stock nothing is stored here. Scanned packages show under “Not in stock”.",
	"location_label.print": "Print a label for “{name}”",
	"location_label.hint": "Scanned in the booking field, this location applies to the following bookings.",
	"location_label.active": "Location: {name} (for the following bookings)",
	"location_label.clear": "Clear",
	"location_label.unknown": "Unknown location.",
	"stock.mode_freeze": "Freeze",
	"book.undone_frozen": "Undone.",
	"book.pick_freeze": "Choose the product to freeze",
	"tab.emergency": "Emergency stock",
	"emergency.supply": "Lasts {days} days",
	"emergency.target": "{persons} persons, target {days} days",
	"emergency.group": "Group",
	"emergency.need": "Target",
	"emergency.have": "In stock",
	"emergency.lasts": "Lasts",
	"emergency.days": "{days} days",
	"emergency.unknown": "{n} packages without an amount",
	"emergency.hint": "Counts what has not expired and whose package content is given in kg or l (1 l counts as 1 kg; eggs at 60 g each). Targets follow the BBK recommendation, number of persons as in the meal plan.",
	"emergency.group.drinks": "Drinks",
	"emergency.group.grains": "Grains, bread, pasta, rice, potatoes",
	"emergency.group.vegetables": "Vegetables and legumes",
	"emergency.group.fruit_nuts": "Fruit and nuts",
	"emergency.group.dairy": "Milk and dairy",
	"emergency.group.meat_fish_eggs": "Meat, fish and eggs",
	"emergency.group.fats": "Fats and oils",
	"settings.emergency_group.label": "Emergency stock",
	"settings.emergency_group.none": "Not in the emergency stock",
	"tip.emergency_group": "Which food group of the emergency stock this category and everything below it counts for. “Not in the emergency stock” excludes it (e.g. coffee).",
	"preserve.leftover": "Leftovers",
	"leftovers.add_title": "Store leftovers",
	"leftovers.dish": "Dish",
	"leftovers.jars": "Servings",
	"leftovers.jars_left": "{jars} servings, {left} in stock",
	"leftovers.empty": "No leftovers stored yet.",
	"leftovers.fixed": "Batch {charge}: {name}, {jars} servings. Made-on date, dish and servings are on the labels and stay fixed; change the stock under \"Stock\".",
	"leftovers.store": "Store leftovers",
	"leftovers.stored": "Leftovers stored: batch {charge}",
	"diet.label": "Diet",
	"diet.vegan": "Vegan",
	"diet.vegetarian": "Vegetarian",
	"diet.none": "Not vegetarian",
	"diet.unknown": "Unknown",
	"diet.not_vegetarian": "not vegetarian",
	"diet.not_vegan": "not vegan",
	"diet.missing": "information missing",
	"allergens.label": "Allergens",
	"allergens.none": "No major allergens",
	"allergens.none_hint": "Nothing ticked = none of the 14 major allergens",
	"allergens.own": "Set own value",
	"allergens.contains": "Contains: {list}",
	"allergen.gluten": "Gluten",
	"allergen.crustaceans": "Crustaceans",
	"allergen.eggs": "Eggs",
	"allergen.fish": "Fish",
	"allergen.peanuts": "Peanuts",
	"allergen.soybeans": "Soy",
	"allergen.milk": "Milk",
	"allergen.nuts": "Tree nuts",
	"allergen.celery": "Celery",
	"allergen.mustard": "Mustard",
	"allergen.sesame-seeds": "Sesame",
	"allergen.sulphur-dioxide-and-sulphites": "Sulphites",
	"allergen.lupin": "Lupin",
	"allergen.molluscs": "Molluscs",
	"recipes.diet.filter": "Diet",
	"recipes.diet.all": "All",
	"recipes.diet.without": "Without",
	"recipes.diet.unknown": "Information missing for: {list}",
	"recipes.diet.optional": "Optional: {list}",
	"diet.reload.button": "Reload allergens from Open Food Facts",
	"diet.reload.stop": "Stop",
	"diet.reload.progress": "{n} of {m} checked",
	"diet.reload.result": "{n} of {m} products filled",
	"diet.reload.hint": "Fetches allergens and diet for products with an EAN. Open Food Facts limits requests, so about one product per second.",
	"tip.diet": "Vegan, vegetarian or not vegetarian. Empty inherits from the category above; at the top it means unknown.",
	"tip.allergens": "Which of the 14 major allergens it contains (traces do not count). Without an own value it inherits from the category above.",
	"diet.reload.error": "Open Food Facts is not answering or is limiting requests. Continue later with the button; products already checked are not asked again.",
	"settings.section.transfer": "Import / Export",
	"transfer.export.title": "Export",
	"transfer.export.products": "Export products",
	"transfer.export.stock": "Export stock",
	"transfer.export.action": "Export",
	"transfer.export.notice": "The file is for private use. Product data can come from Open Food Facts (ODbL licence): if you pass the file on, name the source and keep the licence.",
	"transfer.import.title": "Import",
	"transfer.source.products": "Products (CSV)",
	"transfer.source.stock": "Stock (CSV)",
	"transfer.source.grocy": "Grocy (JSON, several files)",
	"transfer.hint.csv": "Columns and examples are in the guide. Stock is only raised to the number in the file, never booked out.",
	"transfer.hint.grocy": "The files from Grocy's /api/objects/: products is required, plus product_groups, locations, quantity_units, product_barcodes and stock. Pick several files at once.",
	"transfer.file": "File",
	"transfer.none": "Nothing to change.",
	"transfer.review": "Review import",
	"transfer.apply": "Apply",
	"transfer.counts": "{create} new, {update} changed, {error} with errors, {skip} unchanged or skipped.",
	"transfer.done": "Import done: {create} new, {update} changed, {error} with errors.",
	"transfer.group.create": "New ({n})",
	"transfer.group.update": "Changed ({n})",
	"transfer.group.error": "Errors ({n})",
	"transfer.group.skip": "Skipped ({n})",
	"transfer.row": "Line {line} · {name}",
	"transfer.more": "and {n} more",
	"transfer.new.category": "New category",
	"transfer.new.location": "New location",
	"transfer.field.category": "Category",
	"transfer.field.ean": "EAN",
	"transfer.field.content_amount": "Content",
	"transfer.field.content_unit": "Content unit",
	"transfer.field.location": "Location",
	"transfer.field.expiry_type": "Date kind",
	"transfer.field.warn_days": "Warning (days)",
	"transfer.field.shelf_days": "Shelf life (days)",
	"transfer.field.opened_days": "After opening (days)",
	"transfer.field.frozen_days": "Frozen (days)",
	"transfer.field.min_packages": "Minimum stock",
	"transfer.field.diet": "Diet",
	"transfer.field.allergens": "Allergens",
	"transfer.field.packages": "Packages",
	"transfer.field.expires_on": "Expires on",
	"transfer.field.opened_on": "Opened on",
	"transfer.field.frozen_on": "Frozen on",
	"transfer.reason.more_in_stock": "There is more in stock already; nothing is ever booked out.",
	"transfer.reason.charge_skipped": "Canned charge: not imported.",
	"transfer.reason.partial_skipped": "Partly used package: not imported.",
	"transfer.reason.ambiguous": "Several matches; make the brand or name unique.",
	"transfer.reason.category_required": "No category found; fill the category column.",
	"transfer.reason.unknown_unit": "Unknown unit.",
	"transfer.reason.location_required": "No location given and no default one.",
	"transfer.reason.not_found": "Product not found.",
	"transfer.reason.duplicate": "Exists already (EAN).",
	"transfer.reason.invalid_ean": "Invalid EAN.",
	"transfer.reason.invalid_value": "Invalid value.",
	"transfer.reason.invalid_date": "Invalid date.",
	"transfer.reason.other": "Not possible ({key}).",
	"transfer.file_name.products": "inventory-products",
	"transfer.file_name.stock": "inventory-stock"
}, Nt = {
	de: jt,
	en: Mt
}, Pt = Mt;
function Ft(e) {
	let t = e ?? "";
	Pt = Nt[t] ?? Nt[t.split("-")[0]] ?? Mt;
}
function S(e, t) {
	let n = Pt[e] ?? Mt[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
// src/styles.ts
var C = s`
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
  select:focus-visible,
  textarea:focus-visible {
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
  select,
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
  .allergen-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    margin-bottom: 4px;
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
  /* Errors only after the field was edited or left (data-touched, set in home-inventory-panel.ts):
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
`, It = s`
  .ai {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    color: var(--secondary-text-color);
  }
  .ai.error {
    color: var(--error-color);
  }
  progress {
    width: 64px;
  }
`, Lt = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, Rt = class extends x {
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
		Lt(e) && e.target.close();
	}
	render() {
		return g`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? g`<p>${this.o.message}</p>` : v} ${this.o.body ?? v}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${S("common.cancel")}
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
		this.styles = [C, s`
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
customElements.define("home-inventory-confirm", Rt);
function w(e) {
	return new Promise((t) => {
		let n = document.createElement("home-inventory-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var zt = (e, t) => w({
	title: S("common.delete_name", { name: e }) + "?",
	message: t,
	action: S("common.delete"),
	danger: !0
}), T = (e) => g`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${je`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Bt = !1;
async function Vt(e, t) {
	if (!t?.()) return e.close();
	if (!Bt) {
		Bt = !0;
		try {
			await w({
				title: S("common.discard"),
				action: S("common.discard_ok")
			}) && e.close();
		} finally {
			Bt = !1;
		}
	}
}
var Ht = (e) => (t) => {
	Lt(t) && Vt(t.target, e);
}, Ut = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), Vt(t.currentTarget, e));
};
async function Wt(e, t) {
	let n = e.currentTarget;
	if (n.hasAttribute("data-busy")) return e.preventDefault();
	n.setAttribute("data-busy", "");
	try {
		await t(e);
	} finally {
		n.removeAttribute("data-busy");
	}
}
var E = (e) => g`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${Ht(e.dirty)}
    @keydown=${Ut(e.dirty)}
    @cancel=${Ut(e.dirty)}
  >
    <form @submit=${(t) => Wt(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? g`<p class="error" role="alert">${e.error}</p>` : v}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${e.cancel ?? S("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
          ?hidden=${e.hideSubmit}
        >
          ${e.submit?.label ?? S("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, Gt = (e, t) => g`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${S(e ? "common.collapse" : "common.expand")}
    title=${S(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${T(e ? $e : tt)}
  </button>`;
function Kt(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var D = (e) => g`${e.onAdd ? g`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            title=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${T(_t)}
          </button>` : v}${e.onMove ? g`<button
            class="icon-btn"
            data-testid=${`${e.testid}-move`}
            aria-label=${e.moveLabel ?? ""}
            title=${e.moveLabel ?? ""}
            @click=${e.onMove}
          >
            ${T(wt)}
          </button>` : v}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${S("common.edit_name", { name: e.name })}
      title=${S("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${T(gt)}
    </button>
    ${e.onDelete ? g`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${S("common.delete_name", { name: e.name })}
            title=${S("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${T(at)}
          </button>` : v}`, O = (e, t, n = !1) => e ? g`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : v, k = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, qt = (e) => e >= "2000-01-01" && e <= "2099-12-31", A = (e, t) => e || !!t && !qt(t), j = (e) => e === "" ? null : Number(e), Jt = /^https?:\/\//i, Yt = [
	"vegan",
	"vegetarian",
	"none"
], Xt = [
	"best_before",
	"use_by",
	"guide"
], M = (e) => !!e?.user?.is_admin;
async function N(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var Zt = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), P = (e) => e.callWS({ type: "home_inventory/master_data" }), Qt = (e, t, n) => e.callWS({
	type: "home_inventory/save",
	table: t,
	data: n
}), $t = (e, t) => e.callWS({
	type: "home_inventory/defaults_save",
	data: t
}), en = (e, t, n, r = {}) => e.callWS({
	type: "home_inventory/delete",
	table: t,
	row_id: n,
	...r
}), tn = (e, t, n) => e.callWS({
	type: "home_inventory/move_location",
	location_id: t,
	move_to: n
}), nn = (e, t, n) => e.callWS({
	type: "home_inventory/delete_impact",
	table: t,
	row_id: n
}), rn = (e, t, n) => e.callWS({
	type: "home_inventory/product_type_add",
	name: t,
	parent_id: n
}), an = (e, t) => e.callWS({
	type: "home_inventory/lookup",
	code: t
}), on = (e, t, n = !1) => e.callWS({
	type: "home_inventory/search",
	query: t,
	online: n
}), sn = (e, t) => e.callWS({
	type: "home_inventory/book_in",
	...t
}), cn = (e, t) => e.callWS({
	type: "home_inventory/book_out",
	...t
}), ln = (e, t) => e.callWS({
	type: "home_inventory/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), un = (e, t) => e.callWS({
	type: "home_inventory/stock_edit",
	...t
}), F = (e, t) => e.callWS({
	type: "home_inventory/stock",
	product_id: t
}), dn = (e) => e.callWS({ type: "home_inventory/products" }), fn = (e, t) => e.callWS({
	type: "home_inventory/product_save",
	data: t
}), pn = (e) => e.callWS({ type: "home_inventory/label_config" }), mn = (e, t) => e.callWS({
	type: "home_inventory/print_labels",
	...t
}), hn = (e) => e.callWS({ type: "home_inventory/print_shopping_list" }), gn = (e, t, n) => e.callWS({
	type: "home_inventory/print_recipe",
	recipe_id: t,
	servings: n
}), _n = (e, t, n) => e.callWS({
	type: "home_inventory/print_plan",
	start: t,
	days: n
}), vn = (e, t) => e.callWS({
	type: "home_inventory/book_out_label",
	code: t
}), yn = (e) => e.callWS({ type: "home_inventory/recipes" }), bn = (e, t) => e.callWS({
	type: "home_inventory/expiring_recipes",
	...t == null ? {} : { days: t }
}), xn = (e, t, n) => e.callWS({
	type: "home_inventory/recipe_availability",
	recipe_id: t,
	servings: n
}), Sn = (e, t) => e.callWS({
	type: "home_inventory/recipe_save",
	data: t
}), I = (e) => e.canning_product_id != null, Cn = (e, t) => e.callWS({
	type: "home_inventory/recipe_import",
	...t
}), wn = (e, t) => e.callWS({
	type: "home_inventory/recipe_ai_check",
	draft: t,
	language: e.language
}), Tn = (e, t) => e.callWS({
	type: "home_inventory/product_ai_check",
	draft: t,
	language: e.language
}), En = (e, t, n) => e.callWS({
	type: "home_inventory/unit_add",
	name: t,
	symbol: n
}), Dn = (e, t) => e.callWS({
	type: "home_inventory/recipe_export",
	recipe_id: t
}), On, kn = (e) => On = e, L = (e) => !On || On.includes(e), An = {}, jn = (e) => An = e ?? {}, R = (e) => !!An[e], Mn = [
	"drinks",
	"grains",
	"vegetables",
	"fruit_nuts",
	"dairy",
	"meat_fish_eggs",
	"fats"
], Nn = (e) => e.callWS({ type: "home_inventory/emergency" }), Pn = (e) => e?.locale?.language ?? e?.language, z = (e, t) => new Intl.DateTimeFormat(Pn(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), B = (e, t) => new Intl.NumberFormat(Pn(e)).format(t), Fn = (e, t, n, r, i = t) => S(new Intl.PluralRules(Pn(e)).select(t) === "one" ? n : r, { n: i }), In = (e, t) => Fn(e, Number(t), "settings.day", "settings.days", t), V = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), H = (e, t, n = "") => `${B(e, t)} ${n ?? ""}`.trim(), Ln = (e, t) => Fn(e, t, "recipes.portion", "recipes.portions"), Rn = (e, t) => new Intl.DateTimeFormat(Pn(e), {
	dateStyle: "short",
	timeStyle: "short"
}).format(new Date(t));
// src/inherit.ts
function U(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function W(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n] ?? null,
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: S("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: S("settings.inherit_from", { name: a ?? "" })
	};
}
var zn = (e, t) => g`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${T(xt)}${S("common.reset")}
  </button>`;
function G(e) {
	let t = e.own ?? null;
	return g`<span class="inh">
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
        ${e.dflt ? S("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : e.empty ?? S(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => g`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? v : zn(e.testid, () => e.onChange(null))}
  </span>`;
}
function Bn(e) {
	let t = e.own ?? null;
	return g`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? S("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(j(n));
	}}
    />
    ${e.suffix ? g`<span class="detail">${e.suffix}</span>` : v}
    ${t == null ? v : zn(e.testid, () => e.onChange(null))}
  </span>`;
}
// src/category-picker.ts
var Vn = class extends x {
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
				let { id: t } = await rn(this.hass, this.creating, e), n = await P(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await N(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = Kt(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => V(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: U(this.categories, e.id)
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
		return g`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? S("book.choose") : U(this.categories, this.value)}
        </span>
        ${T(ft)}
      </button>
      <dialog @click=${Ht()}>
        <h2>
          ${this.creating ? S("book.choose_parent", { name: this.creating }) : S("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${S("book.filter")}
          placeholder=${S("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !n && !this.creating ? g`<li>
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
                </li>` : v}
          ${e.map(({ c: e, depth: t, label: r }) => {
			let i = !n && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return g`<li style="padding-left: ${t * 20}px">
              ${i ? Gt(a, () => this.toggle(e.id)) : n ? v : g`<span class="chev"></span>`}
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
        ${r ? g`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(t)}
              >
                ${S("book.create_category", { name: t })}
              </button>` : e.length ? v : g`<p class="empty">${S("book.no_hits")}</p>`}
        ${this.failure ? g`<p class="error" role="alert">${this.failure}</p>` : v}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${S("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${S("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [C, s`
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
customElements.define("home-inventory-category-picker", Vn);
// src/diet-fields.ts
var Hn = [
	"gluten",
	"crustaceans",
	"eggs",
	"fish",
	"peanuts",
	"soybeans",
	"milk",
	"nuts",
	"celery",
	"mustard",
	"sesame-seeds",
	"sulphur-dioxide-and-sulphites",
	"lupin",
	"molluscs"
], Un = (e) => e == null ? S("diet.unknown") : e === "" ? S("allergens.none") : String(e).split(",").map((e) => S(`allergen.${e}`)).join(", "), Wn = (e, t, n) => Hn.filter((r) => r === t ? n : e.split(",").includes(r)).join(",");
function Gn(e) {
	let t = e.allergens ?? null;
	return g`<label>
      <span class="lbl" title=${S("tip.diet")}>${S("diet.label")}</span>
      ${G({
		testid: "diet",
		own: e.diet,
		dflt: e.dietDflt,
		optional: !0,
		empty: S("diet.unknown"),
		options: Yt.map((e) => [e, S(`diet.${e}`)]),
		numeric: !1,
		onChange: (t) => e.onDiet(t)
	})}
    </label>
    <div class="field" data-testid="allergens">
      <span class="lbl" title=${S("tip.allergens")}>${S("allergens.label")}</span>
      ${t == null ? g`<span class="inh"
              ><span class="detail" data-testid="allergens-inherited"
                >${S("common.default", {
		value: Un(e.allergensDflt?.value),
		source: e.allergensDflt?.source ?? S("settings.inherit_default")
	})}</span
              >
              <button
                type="button"
                data-testid="allergens-own"
                @click=${() => e.onAllergens(e.allergensDflt?.value ?? "")}
              >
                ${S("allergens.own")}
              </button></span
            >` : g`<span class="allergen-grid">
                ${Hn.map((n) => g`<label class="check"
                      ><input
                        type="checkbox"
                        data-testid=${`allergen-${n}`}
                        .checked=${t.split(",").includes(n)}
                        @change=${(r) => e.onAllergens(Wn(t, n, r.target.checked))}
                      />${S(`allergen.${n}`)}</label
                    >`)}
              </span>
              <span class="detail">${S("allergens.none_hint")}</span>
              ${zn("allergens", () => e.onAllergens(null))}`}
    </div>`;
}
// src/settings-format.ts
function Kn(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function qn(e, t) {
	return t === "default" ? S("settings.inherit_default") : S("settings.inherit_from", { name: Kn(e, t) });
}
function Jn(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: t === "food" || t === "frozen_goods" || t === "emergency_group" || t === "diet" || t === "allergens" ? null : e.defaults[t],
		source: "default"
	};
}
function K(e, t, n, r) {
	if (n === "food") return S(r === 0 ? "settings.food.no" : "settings.food.yes");
	if (n === "frozen_goods") return S(r === 1 ? "settings.frozen_goods.yes" : "settings.frozen_goods.no");
	if (n === "emergency_group") return S(r == null || r === "none" ? "settings.emergency_group.none" : `emergency.group.${r}`);
	if (r == null) return S("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : S("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? S("common.none_dash") : n === "expiry_type" ? S(`settings.expiry.${r}`) : In(t, r);
}
// src/min-stock.ts
function Yn(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = S("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = S("valid.packages")), t;
}
function Xn(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return g`<label>
      <span class="lbl" title=${S("tip.min_stock")}>${S("settings.category.min_stock")}</span>
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
          aria-label=${S("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${Zt(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => g`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${O(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${S("tip.min_packages")}>${S("settings.category.min_packages")}</span>
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
        <span class="detail">${S("book.packages")}</span>
      </span>
      ${O(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${S("settings.category.min_hint")}</p>`;
}
// src/settings-model.ts
var Zn = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null,
	meals: null,
	transfer: null
}, Qn = {
	unit: [
		"name",
		"symbol",
		"base_unit_id",
		"factor",
		"is_count",
		"recipe_only"
	],
	location: ["name", "freezer"],
	category: [
		"parent_id",
		"name",
		"unit_id",
		"default_location_id",
		"expiry_type",
		"warn_days",
		"min_stock",
		"min_stock_unit_id",
		"min_packages",
		"shelf_days",
		"opened_days",
		"food",
		"frozen_days",
		"frozen_goods",
		"emergency_group",
		"diet",
		"allergens"
	]
}, $n = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, er = [
	"warn_days",
	"shelf_days",
	"opened_days",
	"frozen_days"
], tr = class extends x {
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
		for (let i of Qn[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = S("valid.duplicate")) : n.name = S("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = S("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = S("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = S("valid.days")), t.shelf_days != null && !(Number.isInteger(t.shelf_days) && t.shelf_days >= 1) && (n.shelf_days = S("valid.shelf_days")), t.opened_days != null && !(Number.isInteger(t.opened_days) && t.opened_days >= 1) && (n.opened_days = S("valid.shelf_days")), t.frozen_days != null && !(Number.isInteger(t.frozen_days) && t.frozen_days >= 1) && (n.frozen_days = S("valid.shelf_days")), Object.assign(n, Yn(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Qn[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Qt(this.hass, t, r);
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t, n) {
		return g`<label><span class="lbl" title=${n ?? v}>${e}</span>${t}</label>`;
	}
	text(e) {
		return g`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${O(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return g`<span class="num"
        ><input
          type="number"
          step=${er.includes(e) ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value;
			this.set(e, j(n));
		}}
        />${n ? g`<span class="detail">${n}</span>` : v}</span
      >${er.includes(e) ? v : O(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return g`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" .selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => g`<option value=${e} .selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? v : g`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${T(xt)}${S("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = Jn(i, e, this.edit.d.parent_id), o = K(i, this.hass, e, a.value), s = qn(i, a.source), c = er.includes(e) ? this.numInput(e, S("common.default", {
			value: o,
			source: s
		}), S("common.days_unit")) : this.select(e, n, S("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, g`<span class="inh">${c}${this.reset(e)}</span
        >${O(this.errs[e], e)}`, S(`tip.${e}`));
	}
	diet(e) {
		let t = (t) => {
			let n = Jn(this.data, t, e.parent_id);
			return n.value == null ? void 0 : {
				value: n.value,
				source: qn(this.data, n.source)
			};
		};
		return Gn({
			diet: e.diet,
			allergens: e.allergens,
			dietDflt: t("diet"),
			allergensDflt: t("allergens"),
			onDiet: (e) => this.set("diet", e),
			onAllergens: (e) => this.set("allergens", e)
		});
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return g`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = g`${this.field(S("common.name"), this.text("name"))}
        <label class="check"
          ><input
            type="checkbox"
            data-testid="location-freezer"
            .checked=${!!n.freezer}
            @change=${(e) => this.set("freezer", +!!e.target.checked)}
          />${S("settings.location.freezer")}</label
        >
        ${O(S("settings.location.freezer_hint"), "location-freezer", !0)}`;
		else if (t === "unit") {
			let e = Zt(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = g`${this.field(S("common.name"), this.text("name"))}${this.field(S("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${S("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${S("settings.unit.recipe_only")}</label
        >
        ${O(S("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(S("settings.unit.base"), this.select("base_unit_id", e, S("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(S("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? Jn(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = g`${this.field(S("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${S("settings.category.parent")}</span>
          <home-inventory-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${S("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></home-inventory-category-picker>
        </div>
        ${this.inh("unit_id", S("settings.category.unit"), Zt(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", S("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", S("settings.category.expiry_type"), Xt.map((e) => [e, S(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", S("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", S("settings.category.shelf_days"), [])}
        ${L("opened") ? this.inh("opened_days", S("settings.category.opened_days"), []) : ""}
        ${this.inh("food", S("settings.food.label"), [[1, S("settings.food.yes")], [0, S("settings.food.no")]])}
        ${L("frozen") ? g`${this.inh("frozen_days", S("settings.category.frozen_days"), [])}
              ${this.inh("frozen_goods", S("settings.frozen_goods.label"), [[0, S("settings.frozen_goods.no")], [1, S("settings.frozen_goods.yes")]])}` : ""}
        ${L("emergency") ? this.inh("emergency_group", S("settings.emergency_group.label"), [...Mn.map((e) => [e, S(`emergency.group.${e}`)]), ["none", S("settings.emergency_group.none")]], !1) : ""}
        ${L("diet") ? this.diet(n) : ""}
        ${Xn({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? g`<p class="detail">${S("settings.category.off_tags", { tags: t.join(", ") })}</p>` : v}`;
		}
		let c = () => Qn[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? Kn(i, n.parent_id) : "";
		return E({
			title: n.id ? S("common.edit_name", { name: r.name }) : l ? S("settings.category.add_sub_to", { name: l }) : S($n[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [C];
	}
};
customElements.define("home-inventory-settings-dialog", tr);
// src/defaults-view.ts
var nr = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"],
	["shelf_days", "settings.category.shelf_days"],
	["opened_days", "settings.category.opened_days"],
	["frozen_days", "settings.category.frozen_days"]
], rr = {
	opened_days: "opened",
	frozen_days: "frozen"
}, ir = (e) => !rr[e] || L(rr[e]), ar = class extends x {
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
		return t === null || !Number.isInteger(t) || t < 0 ? S("valid.days") : void 0;
	}
	shelfError(e, t = "shelf_days") {
		let n = e[t];
		return n !== null && !(Number.isInteger(n) && n >= 1) ? S("valid.shelf_days") : void 0;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!(this.warnError(t) || this.shelfError(t) || this.shelfError(t, "opened_days") || this.shelfError(t, "frozen_days"))) try {
			await $t(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? g`<p class="detail intro">${S("settings.defaults.hint")}</p>
      <ul>
        ${nr.filter(([e]) => ir(e)).map(([t, n]) => g`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${S(n)}</span>
                <span class="detail">${K(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${D({
			testid: "default",
			name: S(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : g``;
	}
	select(e, t) {
		let n = this.d;
		return g`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => g`<option value=${t ?? ""} .selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return g`<dialog></dialog>`;
		let n = this.warnError(t), r = this.shelfError(t), i = this.shelfError(t, "opened_days"), a = this.shelfError(t, "frozen_days");
		return E({
			title: S("settings.defaults.edit"),
			body: g`<label>
          <span class="lbl" title=${S("tip.unit_id")}>${S("settings.category.unit")}</span>
          ${this.select("unit_id", Zt(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${S("tip.default_location_id")}
            >${S("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, S("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${S("tip.expiry_type")}
            >${S("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", Xt.map((e) => [e, S(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${S("tip.warn_days")}>${S("settings.category.warn_days")}</span>
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
				this.set("warn_days", j(t));
			}}
            />
            ${S("common.days_unit")}
          </span>
          ${O(n, "default-warn_days")}
        </label>
        ${this.optionalDays(t, "shelf_days", r)}
        ${L("opened") ? this.optionalDays(t, "opened_days", i) : ""}
        ${L("frozen") ? this.optionalDays(t, "frozen_days", a) : ""}`,
			error: this.error,
			invalid: !!n || !!r || !!i || !!a,
			dirty: () => nr.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	optionalDays(e, t, n) {
		return g`<label>
      <span class="lbl" title=${S(`tip.${t}`)}>${S(`settings.category.${t}`)}</span>
      <span class="num">
        <input
          data-testid=${`default-${t}`}
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          aria-invalid=${!!n}
          .value=${String(e[t] ?? "")}
          @input=${(e) => this.set(t, j(e.target.value))}
        />
        ${S("common.days_unit")}
      </span>
      ${O(n, `default-${t}`)}
    </label>`;
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-defaults", ar);
// src/api-transfer.ts
var or = (e, t) => e.callWS({
	type: "home_inventory/export_csv",
	kind: t
}), sr = (e, t, n, r) => e.callWS({
	type: "home_inventory/import_csv",
	kind: t,
	text: n,
	apply: r
}), cr = (e, t, n) => e.callWS({
	type: "home_inventory/import_grocy",
	files: t,
	apply: n
}), lr = (e, t, n) => {
	let r = URL.createObjectURL(new Blob([e], { type: n })), i = Object.assign(document.createElement("a"), {
		href: r,
		download: t
	});
	document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}, ur = (e, t) => lr(JSON.stringify(e, null, 2), t, "application/json"), dr = (e, t) => lr("﻿" + e, t, "text/csv;charset=utf-8"), fr = 100, pr = [
	"create",
	"update",
	"error",
	"skip"
], mr = (e, t) => {
	let n = S(e);
	return n === e ? t : n;
}, hr = (e) => e === null || e === "" ? "–" : String(e), gr = (e) => e.reason ? [mr(`transfer.reason.${e.reason}`, S("transfer.reason.other", { key: e.reason }))] : e.kind === "category" || e.kind === "location" ? [S(`transfer.new.${e.kind}`)] : e.changes.map((e) => `${mr(`transfer.field.${e.field}`, e.field)}: ${hr(e.old)} → ${hr(e.new)}`), _r = (e) => g`<p data-testid="transfer-counts">${S("transfer.counts", { ...e.counts })}</p>
    ${pr.map((t) => {
	let n = e.rows.filter((e) => e.action === t);
	return n.length ? g`<ul class="impact" data-testid=${`transfer-${t}`}>
        <li><span class="kind">${S(`transfer.group.${t}`, { n: n.length })}</span></li>
        ${n.slice(0, fr).map((e) => g`<li>
              <span class="kind">${S("transfer.row", {
		line: e.line,
		name: e.name
	})}</span>
              ${gr(e).map((e) => g`<span class="names">${e}</span>`)}
            </li>`)}
        ${n.length > fr ? g`<li>
                <span class="names">${S("transfer.more", { n: n.length - fr })}</span>
              </li>` : ""}
      </ul>` : "";
})}`, vr = [
	"products",
	"stock",
	"grocy"
], yr = async (e) => {
	let t = await e.arrayBuffer();
	try {
		return new TextDecoder("utf-8", { fatal: !0 }).decode(t);
	} catch {
		return new TextDecoder("windows-1252").decode(t);
	}
}, br = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			source: { state: !0 },
			error: { state: !0 },
			info: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.source = "products", this.error = this.info = "", this.busy = !1;
	}
	async guard(e) {
		this.error = this.info = "", this.busy = !0;
		try {
			await e();
		} catch (e) {
			this.error = await N(this.hass, e);
		} finally {
			this.busy = !1;
		}
	}
	export(e) {
		return this.guard(async () => {
			if (!await w({
				title: S(`transfer.export.${e}`),
				message: S("transfer.export.notice"),
				action: S("transfer.export.action")
			})) return;
			let { csv: t } = await or(this.hass, e);
			dr(t, `${S(`transfer.file_name.${e}`)}-${this.today()}.csv`);
		});
	}
	today() {
		let e = new Intl.DateTimeFormat(this.hass.locale?.language ?? this.hass.language, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).formatToParts(/* @__PURE__ */ new Date()), t = (t) => e.find((e) => e.type === t).value;
		return `${t("year")}-${t("month")}-${t("day")}`;
	}
	run(e, t) {
		return this.source === "grocy" ? cr(this.hass, e, t) : sr(this.hass, this.source, e[0], t);
	}
	async pick(e) {
		let t = e.target, n = [...t.files ?? []];
		n.length && (await this.guard(async () => {
			let e = await Promise.all(n.map(yr)), t = await this.run(e, !1);
			if (!t.rows.length) {
				this.info = S("transfer.none");
				return;
			}
			if (!await w({
				title: S("transfer.review"),
				body: _r(t),
				action: S("transfer.apply")
			})) return;
			let r = await this.run(e, !0);
			this.info = S("transfer.done", { ...r.counts });
		}), t.value = "");
	}
	render() {
		return g`
      <h2>${S("transfer.export.title")}</h2>
      <div class="actions">
        ${["products", "stock"].map((e) => g`<button
              data-testid=${`transfer-export-${e}`}
              ?disabled=${this.busy}
              @click=${() => this.export(e)}
            >
              ${S(`transfer.export.${e}`)}
            </button>`)}
      </div>
      <h2>${S("transfer.import.title")}</h2>
      <fieldset>
        ${vr.map((e) => g`<label class="check">
              <input
                type="radio"
                name="source"
                data-testid=${`transfer-source-${e}`}
                .checked=${this.source === e}
                @change=${() => this.source = e}
              />${S(`transfer.source.${e}`)}
            </label>`)}
      </fieldset>
      <p class="hint">${S(`transfer.hint.${this.source === "grocy" ? "grocy" : "csv"}`)}</p>
      <label>
        <span class="lbl">${S("transfer.file")}</span>
        <input
          type="file"
          data-testid="transfer-file"
          accept=${this.source === "grocy" ? ".json" : ".csv,.txt"}
          ?multiple=${this.source === "grocy"}
          ?disabled=${this.busy}
          @change=${this.pick}
        />
      </label>
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      ${this.info ? g`<p data-testid="transfer-info" role="status">${this.info}</p>` : v}
    `;
	}
	static {
		this.styles = [C, s`
      h2 {
        font-size: 1rem;
        margin: 16px 0 8px;
      }
      .hint {
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-transfer", br);
// src/api-diet.ts
var xr = (e, t) => e.callWS({
	type: "home_inventory/diet_reload",
	after: t
}), Sr = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			running: { state: !0 },
			checked: { state: !0 },
			total: { state: !0 },
			filled: { state: !0 },
			finished: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.stopped = !1, [this.running, this.checked, this.total, this.filled, this.finished, this.error] = [
			!1,
			0,
			0,
			0,
			!1,
			""
		];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopped = !0;
	}
	async run() {
		[this.running, this.stopped, this.finished, this.error] = [
			!0,
			!1,
			!1,
			""
		], [this.checked, this.filled] = [0, 0];
		let e = 0;
		try {
			for (; !this.stopped;) {
				let t = await xr(this.hass, e);
				if (this.checked === 0 && (this.total = t.total), this.checked += t.checked, this.filled += t.filled, e = t.last, t.error) {
					this.error = S("diet.reload.error");
					break;
				}
				if (t.done) {
					this.finished = !0;
					break;
				}
			}
		} catch (e) {
			this.error = await N(this.hass, e);
		}
		this.running = !1;
	}
	render() {
		return !L("diet") || !R("off_lookup") || !M(this.hass) ? v : g`<div class="bar">
      ${this.running ? g`<button
                type="button"
                data-testid="diet-reload-stop"
                @click=${() => this.stopped = !0}
              >
                ${S("diet.reload.stop")}
              </button>
              <span class="detail" data-testid="diet-reload-progress" role="status"
                >${S("diet.reload.progress", {
			n: this.checked,
			m: this.total
		})}</span
              >` : g`<button type="button" data-testid="diet-reload" @click=${() => this.run()}>
                ${S("diet.reload.button")}
              </button>
              ${this.finished || this.checked ? g`<span class="detail" data-testid="diet-reload-result" role="status"
                      >${S("diet.reload.result", {
			n: this.filled,
			m: this.checked
		})}</span
                    >` : g`<span class="detail">${S("diet.reload.hint")}</span>`}`}
      ${this.error ? g`<span class="error" role="alert">${this.error}</span>` : v}
    </div>`;
	}
	static {
		this.styles = [C];
	}
};
customElements.define("home-inventory-diet-reload", Sr);
// src/meal-times-view.ts
var Cr = /^([01][0-9]|2[0-3]):[0-5][0-9]$/, wr = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			starts: { state: !0 },
			d: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.error = "";
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	async load() {
		try {
			let e = await this.hass.callWS({ type: "home_inventory/meal_times" });
			this.starts = e.map((e) => e.start);
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	async open() {
		this.error = "", this.d = [...this.starts], await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), !this.d.some((e) => !Cr.test(e))) try {
			await this.hass.callWS({
				type: "home_inventory/meal_times_save",
				starts: this.d
			}), this.starts = [...this.d], this.renderRoot.querySelector("dialog")?.close();
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		if (!this.starts) return g`${this.error ? g`<p class="error">${this.error}</p>` : ""}`;
		let e = this.d;
		return g`<p class="detail intro">${S("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map((e, t) => g`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${S(`plan.slot.${t}`)}</span>
                <span class="detail">${S("settings.meals.from", { time: e })}</span>
              </button>
              ${D({
			testid: "meal-time",
			name: S(`plan.slot.${t}`),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${e ? E({
			title: S("settings.meals.edit"),
			body: g`${e.map((t, n) => g`<label>
                    <span class="lbl">${S(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!Cr.test(t)}
                      .value=${t}
                      @input=${(t) => this.d = e.map((e, r) => r === n ? t.target.value : e)}
                    />
                    ${O(Cr.test(t) ? void 0 : S("valid.time"), `meal-time-${n}`)}
                  </label>`)}`,
			error: this.error,
			invalid: e.some((e) => !Cr.test(e)),
			dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		}) : g`<dialog></dialog>`}`;
	}
	static {
		this.styles = [C];
	}
};
customElements.define("home-inventory-meal-times", wr);
// src/move-location.ts
var Tr = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			locations: { attribute: !1 },
			from: { state: !0 },
			target: { state: !0 },
			batches: { state: !0 },
			packages: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.locations = [], this.target = "", this.batches = 0, this.packages = 0, this.error = "";
	}
	async open(e) {
		this.error = "", this.target = "";
		try {
			let t = (await nn(this.hass, "location", e.id)).groups.find((e) => e.kind === "delete.stock");
			this.batches = t?.count ?? 0, this.packages = t?.packages ?? 0;
		} catch (e) {
			this.error = await N(this.hass, e);
		}
		this.from = e, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("select")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.target && this.batches) try {
			await tn(this.hass, this.from.id, Number(this.target)), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("moved"));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.from;
		return e ? E({
			title: S("settings.location.move_name", { name: e.name }),
			body: g`<p class="detail" data-testid="move-summary">
          ${this.batches ? S("settings.location.move_summary", {
				batches: this.batches,
				packages: this.packages,
				name: e.name
			}) : S("settings.location.move_empty")}
        </p>
        <label>
          <span class="lbl">${S("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e) => this.target = e.target.value}
          >
            <option value="">${S("settings.location.move_choose")}</option>
            ${this.locations.filter((t) => t.id !== e.id).map((e) => g`<option value=${e.id}>${e.name}</option>`)}
          </select>
          ${O(this.target ? void 0 : S("valid.location"), "move-target")}
        </label>`,
			error: this.error,
			invalid: !this.target || !this.batches,
			submit: {
				label: S("settings.location.move_action"),
				testid: "move-save"
			},
			dirty: () => !!this.target,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.from = void 0
		}) : g`<dialog></dialog>`;
	}
	static {
		this.styles = [C, s`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-move-location", Tr);
// src/label-print.ts
function Er(e, t, n, r) {
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
async function Dr(e, t, n, r = !1) {
	if (n > 2 && !await w({
		title: S("label.confirm_many", { n }),
		action: S("label.submit")
	})) return null;
	let i = await mn(e, r ? {
		location_id: t,
		count: n
	} : {
		batch_id: t,
		count: n
	});
	return "printed" in i ? i.printed : (Er(i.image, i.count, i.width_mm, i.height_mm), 0);
}
// src/label-dialog.ts
var Or = class extends x {
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
	async open(e, t = 1) {
		this.batch = e, this.count = String(Math.min(t, 20)), this.error = "", await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async print(e) {
		if (e.preventDefault(), !this.invalid()) try {
			let e = this.batch, t = await Dr(this.hass, e.id, Number(this.count), e.location);
			if (t === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-printed", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return g`<dialog></dialog>`;
		let t = this.invalid();
		return E({
			title: S("label.title", { name: e.name }),
			body: g`<label>
        <span class="lbl">${S("label.count")}</span>
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
        ${t ? O(S("valid.label_count", { max: 20 }), "label-count") : e.location ? g`<span class="detail">${S("location_label.hint")}</span>` : g`<span class="detail">${S("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: S("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-label-dialog", Or);
// src/location-scan.ts
var kr = /^PTRY:L(\d+)$/i, Ar = (e) => kr.test(e.trim());
async function jr(e, t) {
	let n = Number(kr.exec(t.trim())[1]);
	return (await P(e)).locations.find((e) => e.id === n) ?? null;
}
var Mr = (e, t) => e ? g`<p class="done" role="status" data-testid="scanned-location">
        ${S("location_label.active", { name: e })}
        <button type="button" class="undo" data-testid="scanned-location-clear" @click=${t}>
          ${S("location_label.clear")}
        </button>
      </p>` : v, Nr = (e, t) => {
	let n = S("location_label.print", { name: e.name });
	return g`<button
    class="icon-btn"
    data-testid="location-label"
    aria-label=${n}
    title=${n}
    @click=${t}
  >
    ${T(Tt)}
  </button>`;
}, Pr = 5, Fr = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = S(r, { n });
	return i === r ? S("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, Ir = (e) => {
	let t = e.names.length - Pr;
	return e.names.slice(0, Pr).join(", ") + (t > 0 ? S("delete.more", { n: t }) : "");
};
async function Lr(e, t, n, r) {
	let i = n === "location" || n === "unit" ? S(`settings.${n}.delete_hint`) : void 0, a = await nn(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "home_inventory",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await zt(r.name, i) ? (await en(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = g`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => g`<li>
            <span class="kind">${Fr(n, e)}</span>
            <span class="names">${Ir(e)}</span>
            ${e.packages ? g`<span class="names">${S("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? g`<label>
            <span class="lbl">${S("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => g`<option value=${e.id}>${S("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${S("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await w({
		title: S("common.delete_name", { name: r.name }) + "?",
		message: i ?? S("delete.affected"),
		body: c,
		action: S(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await en(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
// src/settings-view.ts
var Rr = class extends x {
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
	get sections() {
		return Object.keys(Zn).filter((e) => (e !== "meals" || L("plan")) && (e !== "transfer" || !!this.hass?.user?.is_admin));
	}
	get sec() {
		return this.sections.includes(this.section ?? "") ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await P(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await N(this.hass, e);
		}
	}
	nav(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: `settings/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	open(e, t, n = {}) {
		this.renderRoot.querySelector("home-inventory-settings-dialog")?.open(e, t, n);
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
		this.expanded = Kt(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => K(t, this.hass, n, e[n]));
		if (e.shelf_days != null && n.push(S("settings.category.shelf_short", { days: K(t, this.hass, "shelf_days", e.shelf_days) })), e.opened_days != null && L("opened") && n.push(S("settings.category.opened_short", { days: K(t, this.hass, "opened_days", e.opened_days) })), e.food === 0 && n.push(S("settings.food.no")), L("frozen") && (e.frozen_days != null && n.push(S("settings.category.frozen_short", { days: K(t, this.hass, "frozen_days", e.frozen_days) })), e.frozen_goods === 1 && n.push(S("settings.frozen_goods.yes"))), e.min_stock != null) {
			let r = K(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(S("settings.category.min", { value: `${B(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(S("settings.category.min", { value: S("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = Zn[e];
		return g`
      <nav aria-label=${S("settings.nav")}>
        ${this.sections.map((t) => g`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${S(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? g`<p class="error" role="alert">${this.pageError}</p>` : v}
      ${this.data ? t ? g`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${S($n[t])}
                  </button>
                </div>
                ${e === "categories" ? g`<home-inventory-diet-reload .hass=${this.hass}></home-inventory-diet-reload>` : v}
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : e === "meals" ? g`<home-inventory-meal-times .hass=${this.hass}></home-inventory-meal-times>` : e === "transfer" ? g`<home-inventory-transfer .hass=${this.hass}></home-inventory-transfer>` : g`<home-inventory-defaults
                    .hass=${this.hass}
                    .data=${this.data}
                    @home-inventory-saved=${this.load}
                  ></home-inventory-defaults>` : v}
      <home-inventory-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @home-inventory-saved=${this.load}
      ></home-inventory-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? v : g`<p class="empty">${S("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = v, a = v) {
		return g`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" data-testid="settings-row" @click=${n}>
        <span>${e}</span>${t ? g`<span class="detail">${t}</span>` : v}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return D({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "location" ? {
				onMove: () => this.renderRoot.querySelector("home-inventory-move-location").open(t),
				moveLabel: S("settings.location.move_name", { name: t.name })
			} : {},
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: S("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await Lr(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await N(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return g`<ul>
        ${e.map((e) => this.row(e.name, e.freezer ? S("settings.location.freezer") : "", () => this.open("location", e), 0, v, g`${Nr(e, () => this.renderRoot.querySelector("home-inventory-label-dialog").open({
			id: e.id,
			name: e.name,
			packages: 0,
			location: !0
		}))}${this.actions("location", e)}`))}
      </ul>
      ${this.empty(e)}
      <home-inventory-label-dialog .hass=${this.hass}></home-inventory-label-dialog>
      <home-inventory-move-location
        .hass=${this.hass}
        .locations=${e}
        @moved=${() => this.load()}
      ></home-inventory-move-location>`;
	}
	renderUnits() {
		let { units: e } = this.data, t = (t) => {
			let n = e.find((e) => e.id === t.base_unit_id);
			return [
				t.symbol,
				t.recipe_only ? S("settings.unit.recipe_only") : "",
				n ? `= ${B(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? S("settings.unit.no_conversion") : t.is_count ? S("settings.unit.count") : ""
			].filter(Boolean).join(" · ");
		};
		return g`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, v, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return g`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? Gt(r, () => this.toggle(e.id)) : g`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [C, s`
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
customElements.define("home-inventory-settings", Rr);
// src/stock-data.ts
function zr(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => V(e.join(" "), a), s = /* @__PURE__ */ new Map();
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
	if (n == null) for (let e of r) s.has(e.id) || a && !o([
		e.name,
		e.brand,
		e.ean,
		U(i?.categories, e.category_id)
	]) || s.set(e.id, {
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
var Br = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${k()}T00:00`)) / 864e5);
function Vr(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = Br(e.expires_on);
	return i < 0 ? e.expiry_type === "use_by" ? "expired" : "past" : i <= (r ?? Number(t?.warn_days ?? W(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
// src/stock-tree.ts
function Hr(e, t, n, r) {
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
// src/booking-done.ts
function q(e, t, n, r) {
	return e ? g`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? g`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${S("stock.undo")}
          </button>` : v}
    ${r ?? v}
  </p>` : v;
}
var J = s`
  .done {
    margin: 0 0 12px;
  }
  .undo {
    margin-left: 8px;
    padding: 4px 8px;
    color: var(--primary-color);
  }
`, Ur = (e, t) => e.callWS({
	type: "home_inventory/open_package",
	...t
}), Wr = (e, t) => e.callWS({
	type: "home_inventory/open_label",
	code: t
}), Gr = (e, t) => e.callWS({
	type: "home_inventory/open_undo",
	booking_id: t
}), Kr = (e, t) => e.callWS({
	type: "home_inventory/freeze",
	...t
}), qr = (e, t) => e.callWS({
	type: "home_inventory/frozen_undo",
	booking_id: t
}), Jr = (e, t, n, r) => e.callWS({
	type: "home_inventory/freeze_scan",
	...t ? { code: t } : {},
	...r ? { product_id: r } : {},
	...n ? { location_id: n } : {}
}), Yr = (e, t) => e.callWS({
	type: "home_inventory/remaining",
	...t
}), Xr = [
	1,
	.75,
	.5,
	.25,
	.1
], Zr = {
	1: "level.full",
	.75: "level.three_quarters",
	.5: "level.half",
	.25: "level.quarter",
	.1: "level.low",
	0: "level.empty"
}, Qr = (e) => (e < 1 ? Xr.slice(1) : Xr).reduce((t, n) => Math.abs(n - e) < Math.abs(t - e) ? n : t), $r = (e) => Xr.find((t) => t < e - 1e-9) ?? e, ei = (e) => S(Zr[e === 0 ? 0 : Qr(e)]);
function ti(e, t, n, r = []) {
	let i = Qr(t), a = i === .1 ? ei(i) : S("stock.left", { level: ei(i) }), o = r.find((e) => e.id === n?.content_unit_id);
	return !o || !n?.content_amount ? a : S("stock.left_amount", {
		left: a,
		amount: H(e, Math.round(t * n.content_amount * 10) / 10, o.symbol)
	});
}
var ni = (e) => {
	let t = Qr(e.value), n = e.empty ? [...Xr, 0] : Xr;
	return g`<select
    data-testid=${e.testid}
    aria-label=${e.label}
    title=${e.label}
    @change=${(t) => e.on(Number(t.target.value))}
  >
    ${n.map((e) => g`<option value=${e} ?selected=${e === t}>${ei(e)}</option>`)}
  </select>`;
};
// src/take-out.ts
async function ri(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await F(e.hass);
	} catch (t) {
		e.undo = n, e.error = await N(e.hass, t);
	}
}
var ii = (e, t, n) => ri(e, async () => {
	let { taken: r } = await cn(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), ai = (e) => {
	let t = e.undo;
	if (t) return ri(e, async () => {
		await ln(e.hass, t.taken);
	});
}, oi = (e, t, n, r) => {
	let i = S("stock.take_one", { name: t });
	return g`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => ii(e, t, n)}
  >
    ${T(mt)}
  </button>`;
}, si = (e, t, n) => {
	let r = e.undo;
	return ni({
		value: n.remaining,
		empty: !0,
		label: S("stock.level", { name: t }),
		testid: "stock-batch-level",
		on: (i) => ri(e, async () => {
			let a = await Yr(e.hass, {
				batch_id: n.batch_id,
				location_id: n.location_id,
				remaining: i
			});
			return a.kind === "out" ? {
				name: t,
				taken: a.taken
			} : r;
		})
	});
}, ci = (e, t) => q(e.undo ? S("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => ai(e)), t), li = (e, t) => e.dispatchEvent(new CustomEvent("home-inventory-print-label", {
	detail: {
		id: t.batch_id,
		name: t.name,
		packages: 1
	},
	bubbles: !0,
	composed: !0
}));
function ui(e, t, n, r, i) {
	return t ? q(t.expires_on ? S("stock.opened_until", {
		name: t.name,
		date: z(e, t.expires_on)
	}) : S("stock.opened_one", { name: t.name }), n, i, g`<button type="button" class="undo" data-testid=${`${i}-label`} @click=${r}>
      ${S("stock.opened_label")}
    </button>`) : v;
}
async function di(e, t) {
	let n = e.opened;
	e.error = "", e.opened = void 0;
	try {
		e.opened = await t(), e.stock = await F(e.hass);
	} catch (t) {
		e.opened = n, e.error = await N(e.hass, t);
	}
}
var fi = (e) => {
	let t = e.opened;
	if (t) return di(e, () => Gr(e.hass, t.booking_id).then(() => void 0));
}, pi = (e, t, n) => {
	if (n.opened_on) return v;
	let r = S("stock.open_one", { name: t });
	return g`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${r}
    title=${r}
    @click=${() => di(e, () => Ur(e.hass, {
		product_id: n.product_id,
		batch_id: n.batch_id,
		location_id: n.location_id
	}))}
  >
    ${T(ht)}
  </button>`;
};
// src/frozen-action.ts
function mi(e, t) {
	if (!e || !t) return !1;
	let n = e.categories.find((e) => e.id === t.category_id)?.effective;
	return !n || n.food.value === 0 || n.frozen_goods.value === 1 ? !1 : (t.frozen_days ?? n.frozen_days.value) != null;
}
function hi(e, t, n, r) {
	let i = !!e?.locations.find((e) => e.id === n.location_id)?.freezer, a = !!n.frozen_on;
	if (!a && (i || !mi(e, t))) return v;
	let o = S(a ? "frozen.thaw_title" : "frozen.freeze_title", { name: n.name });
	return g`<button
    class="icon-btn"
    data-testid=${a ? "stock-batch-thaw" : "stock-batch-freeze"}
    aria-label=${o}
    title=${o}
    @click=${() => r(a)}
  >
    ${T(a ? Ct : St)}
  </button>`;
}
function gi(e, t, n, r) {
	if (!t) return v;
	let i = t.result;
	return q(S(t.thaw ? "frozen.thawed" : "frozen.frozen", {
		name: i.name,
		location: i.location,
		date: i.expires_on ? z(e, i.expires_on) : ""
	}), n, "frozen", t.thaw ? void 0 : g`<button type="button" class="undo" data-testid="frozen-label" @click=${r}>
          ${S("stock.opened_label")}
        </button>`);
}
async function _i(e) {
	let t = e.frozen;
	if (t) {
		e.frozen = void 0, e.error = "";
		try {
			await qr(e.hass, t.result.booking_id), e.stock = await F(e.hass);
		} catch (n) {
			e.frozen = t, e.error = await N(e.hass, n);
		}
	}
}
// src/stock-batch-row.ts
function vi(e, t, n, r) {
	let i = t.expires_on ? z(e, t.expires_on) : S("stock.no_date");
	return t.expires_on && t.expiry_type === "guide" ? i = S("stock.approx_date", { date: i }) : t.expiry_guessed && (i = S("stock.guessed_date", { date: i })), t.opened_on && (i = S("stock.opened_on", {
		date: i,
		opened: z(e, t.opened_on)
	})), t.frozen_on && (i = S("stock.frozen_on", {
		date: i,
		frozen: z(e, t.frozen_on)
	})), t.remaining < 1 && (i += `, ${ti(e, t.remaining, n, r?.units)}`), t.charge ? S("stock.charge", {
		date: i,
		charge: t.charge
	}) : i;
}
var yi = (e, t, n) => g`<li data-testid="stock-batch">
    <span class=${e.status(n)}>${e.date(n)}</span>
    <span class="detail">${n.location}</span>
    <span class="count">${S("book.count", { n: n.packages })}</span>
    <span class="acts">
      ${oi(e.host, t, n, "stock-batch-out")}
      ${L("opened") && (n.opened_on || n.frozen_on) ? si(e.host, t, n) : ""}
      ${L("opened") && !n.frozen_on ? pi(e.host, t, n) : ""}
      ${L("frozen") ? hi(e.md, e.product, n, (t) => e.freeze(n, t)) : ""}
      <button
        class="icon-btn"
        data-testid="stock-batch-label"
        aria-label=${S("label.print_name", { name: t })}
        title=${S("label.print")}
        @click=${() => e.label(n)}
      >
        ${T(Tt)}
      </button>
      ${D({
	testid: "batch",
	name: `${t}, ${e.date(n)}`,
	onEdit: () => e.edit(n)
})}
    </span>
  </li>`, bi = (e, t, n, r, i, a) => g`<li style="padding-left:${r * 24}px">
    ${Gt(i, () => a(`c${e}`))}
    <button
      class="row"
      data-testid="stock-category"
      aria-expanded=${i}
      @click=${() => a(`c${e}`)}
    >
      <span>${t}</span>
      <span class="detail">${S("book.count", { n })}</span>
    </button>
  </li>`, xi = (e, t) => e.target.dispatchEvent(new CustomEvent("home-inventory-navigate", {
	detail: t,
	bubbles: !0,
	composed: !0
})), Si = (e) => g`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${S("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${S("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => g`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
      <button
        type="button"
        data-testid="stocktake-start"
        @click=${(e) => xi(e, "stocktake")}
      >
        ${T(nt)}${S("stocktake.start")}
      </button>
      <button type="button" data-testid="history-start" @click=${(e) => xi(e, "history")}>
        ${T(lt)}${S("history.start")}
      </button>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${S("stock.with_empty")}
    </label>`, Ci = s`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, wi = s`
  li.item {
    flex-direction: column;
    align-items: stretch;
  }
  .head {
    display: flex;
    align-items: center;
  }
  .head .row {
    min-width: 0; /* long names wrap next to the picture */
    padding-left: 0;
  }
  /* On a phone the row actions wrap to their own line, right-aligned. */
  .batches li {
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 0 0 0 36px;
    border-bottom: 0;
  }
  .batches .detail {
    flex: 1;
  }
  .batches .acts {
    display: flex;
    margin-left: auto;
  }
  .expired {
    color: var(--error-color);
  }
  .soon {
    color: var(--warning-color);
  }
  .past {
    color: var(--warning-color);
    font-weight: 500;
  }
`, Ti = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			locations: { attribute: !1 },
			d: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.thaw = !1, this.locations = [], this.error = "";
	}
	async open(e, t) {
		this.error = "", this.row = e, this.thaw = t, this.d = {
			packages: "1",
			to: ""
		}, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.select();
	}
	errors(e) {
		let t = Number(e.packages);
		return /^\d+$/.test(e.packages.trim()) && t >= 1 && t <= this.row.packages ? void 0 : S("frozen.packages_range", { n: this.row.packages });
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (this.errors(t)) return;
		let n = this.row;
		try {
			let e = await Kr(this.hass, {
				thaw: this.thaw,
				product_id: n.product_id,
				packages: Number(t.packages),
				batch_id: n.batch_id,
				location_id: n.location_id,
				...t.to ? { to_location_id: Number(t.to) } : {}
			});
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-frozen", {
				detail: {
					result: e,
					thaw: this.thaw
				},
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return g`<dialog></dialog>`;
		let t = this.errors(e), n = this.locations.filter((e) => !!e.freezer !== this.thaw), r = this.row.name;
		return E({
			title: S(this.thaw ? "frozen.thaw_title" : "frozen.freeze_title", { name: r }),
			body: g`<label>
          <span class="lbl">${S("book.packages")}</span>
          <input
            data-testid="frozen-packages"
            type="number"
            min="1"
            max=${this.row.packages}
            step="1"
            inputmode="numeric"
            aria-invalid=${!!t}
            .value=${e.packages}
            @input=${(t) => this.d = {
				...e,
				packages: t.target.value
			}}
          />
          ${O(t, "frozen-packages")}
        </label>
        <label>
          <span class="lbl">${S("frozen.to")}</span>
          <select
            data-testid="frozen-to"
            @change=${(t) => this.d = {
				...e,
				to: t.target.value
			}}
          >
            <option value="" .selected=${e.to === ""}>
              ${S(this.thaw ? "frozen.to_default_thaw" : "frozen.to_default_freeze")}
            </option>
            ${n.map((t) => g`<option value=${t.id} .selected=${e.to === String(t.id)}>${t.name}</option>`)}
          </select>
        </label>`,
			error: this.error,
			invalid: !!t,
			submit: {
				label: S(this.thaw ? "frozen.thaw" : "frozen.freeze"),
				testid: "frozen-submit"
			},
			dirty: () => e.packages !== "1" || e.to !== "",
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-frozen-dialog", Ti);
// src/product-fields.ts
var Ei = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
}), Di = (e) => Object.fromEntries([
	"ean",
	"name",
	"brand",
	"category_id",
	"content_amount",
	"content_unit_id",
	"image_url",
	"off_json",
	"min_packages"
].map((t) => [t, e[t] === "" ? null : e[t] ?? null]));
function Oi(e) {
	let t = {};
	return e.name.trim() || (t.name = S("valid.required")), e.category_id == null && !e.new_type && (t.category = S("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = S("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = S("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = S("valid.packages")), t;
}
function ki(e, t, n, r = {}, i) {
	return g`<label>
      <span class="lbl">${S("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${O(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${S("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${S("book.category")}</span>
      <home-inventory-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></home-inventory-category-picker>
      ${O(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${S("tip.content")}>${S("book.content")}</span>
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
		n("content_amount", j(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${S("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${S("common.none_dash")}</option>
          ${Zt(e?.units ?? [], t.content_unit_id).map((e) => g`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${O(r.content, "content")}
    <label>
      <span class="lbl" title=${S("tip.product_min_packages")}>${S("products.min_packages")}</span>
      ${Bn({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: S("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${O(r.min_packages, "min-packages")}
    </label>`;
}
function Ai(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${B(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
// src/product-dialog.ts
var ji = [
	"name",
	"brand",
	"ean",
	"category_id",
	"content_amount",
	"content_unit_id",
	"default_location_id",
	"expiry_type",
	"warn_days",
	"shelf_days",
	"opened_days",
	"frozen_days",
	"diet",
	"allergens",
	"min_packages"
], Mi = class extends x {
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
		let t = Oi(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = S("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = S("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = S("valid.days")), e.shelf_days != null && !(Number.isInteger(e.shelf_days) && e.shelf_days >= 1) && (t.shelf_days = S("valid.shelf_days")), e.opened_days != null && !(Number.isInteger(e.opened_days) && e.opened_days >= 1) && (t.opened_days = S("valid.shelf_days")), e.frozen_days != null && !(Number.isInteger(e.frozen_days) && e.frozen_days >= 1) && (t.frozen_days = S("valid.shelf_days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of ji) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await fn(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return g`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => W(this.md, e.category_id, t);
		return E({
			title: S("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: g`${ki(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${S("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${O(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl" title=${S("tip.default_location_id")}
            >${S("settings.category.location")}</span
          >
          ${G({
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
          <span class="lbl" title=${S("tip.expiry_type")}
            >${S("settings.category.expiry_type")}</span
          >
          ${G({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: Xt.map((e) => [e, S(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${S("tip.warn_days")}>${S("settings.category.warn_days")}</span>
          ${Bn({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => In(this.hass, e),
				suffix: S("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${O(t.warn_days, "warn-days")}
        </label>
        <label>
          <span class="lbl" title=${S("tip.shelf_days")}>${S("settings.category.shelf_days")}</span>
          ${Bn({
				testid: "shelf-days",
				own: e.shelf_days,
				dflt: n("shelf_days"),
				format: (e) => In(this.hass, e),
				suffix: S("common.days_unit"),
				invalid: !!t.shelf_days,
				onChange: (e) => this.set("shelf_days", e)
			})}
          ${O(t.shelf_days, "shelf-days")}
        </label>
        ${L("opened") ? g`<label>
                <span class="lbl" title=${S("tip.opened_days")}
                  >${S("settings.category.opened_days")}</span
                >
                ${Bn({
				testid: "opened-days",
				own: e.opened_days,
				dflt: n("opened_days"),
				format: (e) => In(this.hass, e),
				suffix: S("common.days_unit"),
				invalid: !!t.opened_days,
				onChange: (e) => this.set("opened_days", e)
			})}
                ${O(t.opened_days, "opened-days")}
              </label>` : ""}
        ${L("frozen") ? g`<label>
                <span class="lbl" title=${S("tip.frozen_days")}
                  >${S("settings.category.frozen_days")}</span
                >
                ${Bn({
				testid: "frozen-days",
				own: e.frozen_days,
				dflt: n("frozen_days"),
				format: (e) => In(this.hass, e),
				suffix: S("common.days_unit"),
				invalid: !!t.frozen_days,
				onChange: (e) => this.set("frozen_days", e)
			})}
                ${O(t.frozen_days, "frozen-days")}
              </label>` : ""}
        ${L("diet") ? Gn({
				diet: e.diet,
				allergens: e.allergens,
				dietDflt: n("diet"),
				allergensDflt: n("allergens"),
				onDiet: (e) => this.set("diet", e),
				onAllergens: (e) => this.set("allergens", e)
			}) : ""}`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => ji.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-product-dialog", Mi);
// src/batch-dialog.ts
var Ni = class extends x {
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
			expires_on: e.batch_expires_on ?? "",
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
		return A(e.dateBad, e.expires_on) && (t.expires = S("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = S("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await un(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return g`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return E({
			title: S("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: g`<label>
          <span class="lbl">
            ${S("book.expires_on_type", { type: S(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? O(t.expires, "batch-expires") : g`<span class="detail">${S("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${S("book.packages")}</span>
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
          ${t.packages ? O(t.packages, "batch-packages") : g`<span class="detail">${S("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-batch-dialog", Ni);
// src/api-purchase.ts
var Pi = (e, t) => e.callWS({
	type: "home_inventory/receipt_read",
	text: t
}), Fi = (e, t, n) => e.callWS({
	type: "home_inventory/receipt_book",
	store: t,
	items: n
}), Ii = [
	"day",
	"week",
	"month"
], Li = [
	0,
	1,
	2,
	3,
	4
], Y = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, X = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Z = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), Ri = (e, t) => Y(Z(X(e), t)), zi = (e) => Z(e, -((e.getDay() + 6) % 7));
function Bi(e, t) {
	return e === "day" ? [t, Z(t, 1)] : e === "week" ? [zi(t), Z(zi(t), 7)] : [zi(new Date(t.getFullYear(), t.getMonth(), 1)), Z(zi(new Date(t.getFullYear(), t.getMonth() + 1, 0)), 7)];
}
var Vi = (e, t, n) => e === "month" ? new Date(t.getFullYear(), t.getMonth() + n, 1) : Z(t, n * (e === "week" ? 7 : 1)), Hi = (e) => e?.locale?.language;
// src/receipt-row.ts
function Ui(e) {
	let t = {};
	return e.choice === null && (t.choice = S("receipt.choose")), e.choice === "skip" || (e.choice === "new" && !e.name.trim() && (t.name = S("valid.required")), e.choice === "new" && e.category_id == null && (t.category = S("valid.required")), Number.isInteger(e.packages) && e.packages >= 1 && e.packages <= 9999 || (t.packages = S("valid.packages")), A(e.dateBad, e.expires_on) && (t.expires = S("valid.date"))), t;
}
function Wi(e, t) {
	let n = typeof e.choice == "number" ? e.item.candidates.find((t) => t.id === e.choice)?.shelf_days : e.choice === "new" ? W(t, e.category_id, "shelf_days")?.value : void 0;
	return n ? Ri(k(), Number(n)) : "";
}
function Gi(e) {
	let { r: t, i: n } = e, r = Ui(t), i = `r${n}`, a = t.choice === null ? "" : String(t.choice), o = !t.expires_on && Wi(t, e.md) ? S("receipt.guess_hint") : "";
	return g`<li data-testid="receipt-row">
    <div class="text">${t.item.text}</div>
    <label>
      <span class="lbl">${S("receipt.product")}</span>
      <select
        data-testid="receipt-product"
        aria-invalid=${!!r.choice}
        .value=${a}
        @change=${(t) => {
		let n = t.target.value;
		e.set({ choice: n === "new" || n === "skip" ? n : Number(n) });
	}}
      >
        <option value="" disabled ?selected=${a === ""}>${S("receipt.choose_option")}</option>
        ${t.item.candidates.map((e) => g`<option value=${e.id} ?selected=${a === String(e.id)}>
              ${e.brand ? `${e.name} (${e.brand})` : e.name}
            </option>`)}
        <option value="new" ?selected=${a === "new"}>${S("receipt.new")}</option>
        <option value="skip" ?selected=${a === "skip"}>${S("receipt.skip")}</option>
      </select>
      ${O(r.choice, `${i}-product`)}
    </label>
    ${t.choice === "new" ? g`<label>
              <span class="lbl">${S("common.name")}</span>
              <input
                data-testid="receipt-name"
                aria-invalid=${!!r.name}
                .value=${t.name}
                @input=${(t) => e.set({ name: t.target.value })}
              />
              ${O(r.name, `${i}-name`)}
            </label>
            <div>
              <span class="lbl">${S("book.category")}</span>
              <home-inventory-category-picker
                .categories=${e.md?.categories ?? []}
                .value=${t.category_id}
                .hass=${e.hass}
                @change=${(t) => e.set({ category_id: t.detail })}
              ></home-inventory-category-picker>
              ${O(r.category, `${i}-category`)}
            </div>` : v}
    ${t.choice === "skip" ? v : g`<div class="pair">
            <label>
              <span class="lbl">${S("book.packages")}</span>
              <input
                type="number"
                min="1"
                max="9999"
                data-testid="receipt-packages"
                aria-invalid=${!!r.packages}
                .value=${String(t.packages)}
                @input=${(t) => e.set({ packages: Number(t.target.value) })}
              />
              ${O(r.packages, `${i}-packages`)}
            </label>
            <label>
              <span class="lbl">${S("book.expires_on")}</span>
              <input
                type="date"
                min="2000-01-01"
                max="2099-12-31"
                data-testid="receipt-expires"
                aria-invalid=${!!r.expires}
                .value=${t.expires_on}
                @input=${(t) => {
		let n = t.target;
		e.set({
			expires_on: n.value,
			dateBad: n.validity.badInput
		});
	}}
              />
              ${r.expires ? O(r.expires, `${i}-expires`) : g`<span class="detail">${o}</span>`}
            </label>
          </div>`}
  </li>`;
}
var Ki = s`
  .rows {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }
  .rows li {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 12px 0;
    border-top: 1px solid var(--divider-color);
  }
  .text {
    font-family: monospace;
    color: var(--secondary-text-color);
    overflow-wrap: anywhere;
  }
`;
// src/ocr.ts
async function qi(t, n) {
	let { createWorker: r } = await import("./src-BdEU0Ij4.js").then((t) => /* @__PURE__ */ e(t.default, 1)), i = new URL(
		/* @vite-ignore */
		"vendor/",
		import.meta.url
	).href, a = await r("deu", 1, {
		workerPath: `${i}tesseract-worker.min.js`,
		corePath: `${i}tesseract-core-simd-lstm.wasm.js`,
		langPath: i,
		logger: (e) => {
			e.status === "recognizing text" && n(e.progress);
		}
	});
	try {
		return (await a.recognize(t)).data.text;
	} finally {
		await a.terminate();
	}
}
// src/photo.ts
async function Ji(e, t) {
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = document.createElement("canvas");
	return i.width = Math.round(n.width * r), i.height = Math.round(n.height * r), i.getContext("2d").drawImage(n, 0, 0, i.width, i.height), n.close(), i;
}
var Yi = async (e, t = 2e3) => (await Ji(e, t)).toDataURL("image/jpeg", .85), Xi = new URL(
	/* @vite-ignore */
	"vendor/opencv.js",
	import.meta.url
).href, Zi;
function Qi() {
	return Zi ??= new Promise((e, t) => {
		let n = document.createElement("script");
		n.src = Xi, n.async = !0, n.onerror = () => {
			Zi = void 0, t(/* @__PURE__ */ Error("opencv"));
		}, n.onload = () => {
			Promise.resolve(window.cv).then((t) => t?.Mat ? e({ cv: t }) : n.onerror?.(new Event("error")), () => n.onerror?.(new Event("error")));
		}, document.head.append(n);
	}), Zi;
}
var $i = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
function ea(e) {
	let t = (t) => [...e].sort((e, n) => t(e) - t(n)), n = t((e) => e.x + e.y), r = t((e) => e.y - e.x);
	return [
		n[0],
		r[0],
		n[3],
		r[3]
	];
}
var ta = (e, t) => [
	{
		x: 0,
		y: 0
	},
	{
		x: e,
		y: 0
	},
	{
		x: e,
		y: t
	},
	{
		x: 0,
		y: t
	}
];
function na(e, t) {
	let n = e.imread(t), r = new e.Mat(), i = new e.Mat(), a = new e.MatVector(), o = new e.Mat(), s = e.Mat.ones(3, 3, e.CV_8U);
	try {
		e.cvtColor(n, r, e.COLOR_RGBA2GRAY), e.GaussianBlur(r, r, new e.Size(5, 5), 0), e.Canny(r, i, 50, 150), e.dilate(i, i, s), e.findContours(i, a, o, e.RETR_EXTERNAL, e.CHAIN_APPROX_SIMPLE);
		let c = null, l = t.width * t.height * .1;
		for (let t = 0; t < a.size(); t++) {
			let n = a.get(t), r = e.contourArea(n);
			if (r > l) {
				let t = new e.Mat();
				e.approxPolyDP(n, t, .02 * e.arcLength(n, !0), !0);
				let i;
				if (t.rows === 4 && e.isContourConvex(t)) {
					let e = t.data32S;
					i = [
						0,
						1,
						2,
						3
					].map((t) => ({
						x: e[2 * t],
						y: e[2 * t + 1]
					}));
				} else i = e.RotatedRect.points(e.minAreaRect(n));
				t.delete(), c = ea(i), l = r;
			}
			n.delete();
		}
		return c;
	} finally {
		for (let e of [
			n,
			r,
			i,
			a,
			o,
			s
		]) e.delete();
	}
}
function ra(e, t, n) {
	let [r, i, a, o] = n, s = Math.max(1, Math.round(Math.max($i(r, i), $i(o, a)))), c = Math.max(1, Math.round(Math.max($i(r, o), $i(i, a)))), l = e.imread(t), u = e.matFromArray(4, 1, e.CV_32FC2, n.flatMap((e) => [e.x, e.y])), d = e.matFromArray(4, 1, e.CV_32FC2, [
		0,
		0,
		s,
		0,
		s,
		c,
		0,
		c
	]), ee = e.getPerspectiveTransform(u, d), te = new e.Mat(), f = new e.Mat();
	try {
		e.warpPerspective(l, te, ee, new e.Size(s, c)), e.cvtColor(te, f, e.COLOR_RGBA2GRAY);
		let t = Math.max(15, Math.round(s / 50) | 1);
		e.adaptiveThreshold(f, f, 255, e.ADAPTIVE_THRESH_GAUSSIAN_C, e.THRESH_BINARY, t, 15);
		let n = document.createElement("canvas");
		return e.imshow(n, f), n;
	} finally {
		for (let e of [
			l,
			u,
			d,
			ee,
			te,
			f
		]) e.delete();
	}
}
// src/scan-corners.ts
var ia = .01, aa = class extends x {
	constructor(...e) {
		super(...e), this.dragging = -1;
	}
	static {
		this.properties = {
			image: { attribute: !1 },
			quad: { attribute: !1 }
		};
	}
	move(e, t) {
		let { width: n, height: r } = this.image, i = [...this.quad];
		i[e] = {
			x: Math.min(n, Math.max(0, t.x)),
			y: Math.min(r, Math.max(0, t.y))
		}, this.dispatchEvent(new CustomEvent("change", { detail: i }));
	}
	at(e) {
		let t = e.currentTarget.getBoundingClientRect();
		return {
			x: (e.clientX - t.left) / t.width * this.image.width,
			y: (e.clientY - t.top) / t.height * this.image.height
		};
	}
	key(e, t) {
		let n = ia * Math.max(this.image.width, this.image.height), r = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1]
		}[t.key];
		r && (t.preventDefault(), this.move(e, {
			x: this.quad[e].x + r[0] * n,
			y: this.quad[e].y + r[1] * n
		}));
	}
	render() {
		let { width: e, height: t } = this.image, n = Math.max(e, t) * .025;
		return g`<div class="frame">
      ${this.image}
      <svg
        viewBox="0 0 ${e} ${t}"
        preserveAspectRatio="none"
        @pointermove=${(e) => this.dragging >= 0 && this.move(this.dragging, this.at(e))}
        @pointerup=${() => this.dragging = -1}
        @pointercancel=${() => this.dragging = -1}
      >
        <polygon points=${this.quad.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
        ${this.quad.map((e, t) => je`<circle
              cx=${e.x}
              cy=${e.y}
              r=${n}
              tabindex="0"
              role="slider"
              data-testid="scan-corner"
              aria-label=${S(`scan.corner_${t}`)}
              @pointerdown=${(e) => {
			this.dragging = t, e.currentTarget.closest("svg").setPointerCapture(e.pointerId);
		}}
              @keydown=${(e) => this.key(t, e)}
            ></circle>`)}
      </svg>
    </div>`;
	}
	static {
		this.styles = s`
    .frame {
      position: relative;
      width: fit-content;
      margin: 0 auto 12px;
    }
    canvas {
      display: block;
      max-width: 100%;
      max-height: 55vh;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    polygon {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
    }
    circle {
      fill: var(--primary-color);
      fill-opacity: 0.4;
      stroke: var(--primary-color);
      cursor: move;
    }
    circle:focus {
      outline: none;
    }
    circle:focus-visible {
      fill-opacity: 0.9;
    }
  `;
	}
};
customElements.define("home-inventory-scan-corners", aa);
// src/camera-dialog.ts
var oa = 480, sa = 1e3, ca = 200;
function la(e, t, n, r) {
	let i = Math.max(1, Math.max(t, n) / r), a = document.createElement("canvas");
	return a.width = Math.round(t / i), a.height = Math.round(n / i), a.getContext("2d").drawImage(e, 0, 0, a.width, a.height), {
		canvas: a,
		f: i
	};
}
var ua = (e, t) => e?.map((e) => ({
	x: e.x * t,
	y: e.y * t
})) ?? null, da = class extends x {
	static {
		this.properties = {
			scan: { state: !0 },
			still: { state: !0 },
			quad: { state: !0 },
			live: { state: !0 },
			video: { state: !0 },
			running: { state: !0 },
			ready: { state: !0 },
			error: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.tick = () => {
			let e = this.renderRoot.querySelector("video");
			if (e && this.stream) {
				if (this.cv && e.videoWidth) {
					let { canvas: t, f: n } = la(e, e.videoWidth, e.videoHeight, oa);
					this.live = ua(na(this.cv, t), n);
				}
				this.timer = window.setTimeout(this.tick, ca);
			}
		}, this.closed = () => {
			this.stop(), this.still = void 0, this.finish();
		}, this.scan = !1, this.quad = [], this.live = null, this.video = {
			w: 0,
			h: 0
		}, this.running = this.ready = !1, this.error = "", this.busy = !1;
	}
	async show(e, t) {
		this.done?.(void 0), this.scan = e, this.still = t, this.live = null, this.error = "", this.busy = !1, this.quad = t ? ta(t.width, t.height) : [];
		let n = new Promise((e) => this.done = e);
		return await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), e && Qi().then(({ cv: e }) => {
			this.cv = e, this.ready = !0, this.still && this.findOutline();
		}, () => this.error = S("camera.no_scan")), n;
	}
	take(e) {
		let t = this.show(e);
		return this.updateComplete.then(() => this.start()), t;
	}
	edit(e) {
		return this.show(!0, e);
	}
	async start() {
		if (!navigator.mediaDevices?.getUserMedia) return void (this.error = S("scan.https"));
		try {
			this.stream = await navigator.mediaDevices.getUserMedia({ video: {
				facingMode: "environment",
				width: { ideal: 1920 },
				height: { ideal: 1080 }
			} });
			let e = this.renderRoot.querySelector("video");
			e.srcObject = this.stream, await e.play(), this.video = {
				w: e.videoWidth,
				h: e.videoHeight
			}, this.running = !0;
		} catch {
			this.stop(), this.error = S("scan.no_camera");
			return;
		}
		this.scan && (this.timer = window.setTimeout(this.tick, ca));
	}
	findOutline() {
		let e = this.still, { canvas: t, f: n } = la(e, e.width, e.height, sa);
		this.quad = ua(na(this.cv, t), n) ?? ta(e.width, e.height);
	}
	stop() {
		clearTimeout(this.timer), this.stream?.getTracks().forEach((e) => e.stop()), this.stream = void 0, this.running = !1;
	}
	finish(e) {
		this.done?.(e), this.done = void 0, this.renderRoot.querySelector("dialog")?.close();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stop();
	}
	async capture() {
		let e = this.renderRoot.querySelector("video"), t = document.createElement("canvas");
		if (t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0), this.stop(), !this.scan) return this.finish(await Yi(t));
		this.quad = this.live ?? ta(t.width, t.height), this.still = t;
	}
	async apply(e) {
		this.busy = !0;
		let t = this.still, n = e ? ra(this.cv, t, this.quad).toDataURL("image/png") : await Yi(t, 3e3);
		this.busy = !1, this.finish(n);
	}
	liveView() {
		let { w: e, h: t } = this.video;
		return g`<div class="frame">
        <video muted playsinline></video>
        ${this.live && e ? g`<svg viewBox="0 0 ${e} ${t}" preserveAspectRatio="none">
                <polygon points=${this.live.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
              </svg>` : v}
      </div>
      ${this.scan ? g`<p class="detail">${S("camera.live_hint")}</p>` : v}`;
	}
	cornerView() {
		return g`<home-inventory-scan-corners
        .image=${this.still}
        .quad=${this.quad}
        @change=${(e) => this.quad = e.detail}
      ></home-inventory-scan-corners>
      <p class="detail">${S("camera.corners_hint")}</p>`;
	}
	actions() {
		return this.still ? g`<button
          type="button"
          data-testid="camera-uncut"
          ?disabled=${this.busy}
          @click=${() => this.apply(!1)}
        >
          ${S("camera.uncut")}
        </button>
        <button
          type="button"
          class="primary"
          data-testid="camera-apply"
          ?disabled=${this.busy || !this.ready}
          @click=${() => this.apply(!0)}
        >
          ${S("camera.apply")}
        </button>` : g`<button
      type="button"
      class="primary"
      data-testid="camera-capture"
      ?disabled=${!this.running}
      @click=${() => this.capture()}
    >
      ${S("camera.capture")}
    </button>`;
	}
	render() {
		return g`<dialog data-testid="camera" @close=${this.closed} @click=${Ht()}>
      <h2>${S(this.scan ? "camera.title_scan" : "camera.title")}</h2>
      ${this.still ? this.cornerView() : this.liveView()}
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${S("common.cancel")}</button>
        ${this.actions()}
      </div>
    </dialog>`;
	}
	static {
		this.styles = [C, s`
      .frame {
        position: relative;
        width: fit-content;
        margin: 0 auto;
      }
      video {
        display: block;
        max-width: 100%;
        max-height: 55vh;
      }
      svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      polygon {
        fill: var(--primary-color);
        fill-opacity: 0.15;
        stroke: var(--primary-color);
        stroke-width: 3px;
        vector-effect: non-scaling-stroke;
      }
      .detail {
        margin: 8px 0 12px;
        color: var(--secondary-text-color);
        font-size: 0.875em;
      }
    `];
	}
};
customElements.define("home-inventory-camera", da);
// src/receipt-import.ts
var fa = 3e3, pa = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { attribute: !1 },
			active: { state: !0 },
			image: { state: !0 },
			rows: { state: !0 },
			store: { state: !0 },
			status: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.prefill = !1, this.active = !1, this.store = "", this.status = "", this.error = "";
	}
	async open() {
		this.image = this.rows = void 0, this.store = this.status = this.error = "", this.active = !0, pn(this.hass).then((e) => this.prefill = e.prefill_expiry, () => void 0), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	guess(e) {
		return Wi(e, this.md);
	}
	set(e, t) {
		let n = [...this.rows], r = n[e], i = {
			...r,
			...t
		};
		this.prefill && !("expires_on" in t) && r.expires_on === this.guess(r) && (i.expires_on = this.guess(i)), n[e] = i, this.rows = n;
	}
	invalid() {
		return this.rows ? !!this.status || this.rows.some((e) => Object.keys(Ui(e)).length) : !this.image || !!this.status;
	}
	async read() {
		let e = this.hass;
		this.status = S("receipt.ocr", { percent: "0" });
		try {
			let t = await qi(this.image, (e) => {
				this.status = S("receipt.ocr", { percent: String(Math.round(e * 100)) });
			});
			if (!t.trim()) throw Error(S("receipt.no_text"));
			this.status = S("receipt.ai");
			let n = await Pi(e, t.slice(0, 8e3));
			if (!n.items.length) throw Error(S("receipt.no_items"));
			this.store = n.store, this.rows = n.items.map((e) => {
				let t = {
					item: e,
					choice: e.product_id ?? (e.candidates.length ? null : "new"),
					name: e.name,
					category_id: e.category_id,
					packages: e.packages,
					expires_on: "",
					dateBad: !1
				};
				return {
					...t,
					expires_on: this.prefill ? this.guess(t) : ""
				};
			});
		} catch (t) {
			this.error = t instanceof Error ? t.message : await N(e, t);
		}
		this.status = "";
	}
	async book() {
		let e = this.rows.filter((e) => e.choice !== "skip").map((e) => ({
			text: e.item.text,
			packages: e.packages,
			expires_on: e.expires_on || null,
			...e.choice === "new" ? { product: {
				name: e.name.trim(),
				category_id: e.category_id
			} } : { product_id: e.choice }
		}));
		if (!e.length) return this.renderRoot.querySelector("dialog")?.close();
		this.status = S("receipt.booking");
		try {
			let t = await Fi(this.hass, this.store.trim(), e);
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("booked", { detail: t.booked }));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
		this.status = "";
	}
	submit(e) {
		if (e.preventDefault(), this.error = "", !this.invalid()) return this.rows ? this.book() : this.read();
	}
	camera() {
		return this.renderRoot.querySelector("home-inventory-camera");
	}
	async scanReceipt() {
		let e = await this.camera().take(!0);
		e && (this.image = e);
	}
	async pickFile(e) {
		let t = e.target, n = t.files?.[0];
		if (t.value = "", !n) return;
		this.error = "";
		let r;
		try {
			r = await Ji(n, fa);
		} catch {
			this.error = S("receipt.photo_invalid");
			return;
		}
		let i = await this.camera().edit(r);
		i && (this.image = i);
	}
	pickStep() {
		return g`<button
        type="button"
        class="scan"
        data-testid="receipt-scan"
        ?disabled=${!!this.status}
        @click=${() => this.scanReceipt()}
      >
        ${T(Qe)} ${S("receipt.scan")}
      </button>
      <label>
        <span class="lbl">${S("receipt.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="receipt-photo"
          ?disabled=${!!this.status}
          @change=${(e) => this.pickFile(e)}
        />
      </label>
      ${this.image ? g`<img
              class="preview"
              data-testid="receipt-preview"
              src=${this.image}
              alt=${S("receipt.preview")}
            />` : v}
      <p class="detail">${S("receipt.photo_hint")}</p>`;
	}
	reviewStep(e) {
		return g`<label>
        <span class="lbl">${S("receipt.store")}</span>
        <input
          data-testid="receipt-store"
          maxlength="100"
          .value=${this.store}
          @input=${(e) => this.store = e.target.value}
        />
        <span class="detail">${S("receipt.store_hint")}</span>
      </label>
      <ul class="rows">
        ${e.map((e, t) => Gi({
			r: e,
			i: t,
			md: this.md,
			hass: this.hass,
			set: (e) => this.set(t, e)
		}))}
      </ul>`;
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.status ? g`<div class="busy" role="status" data-testid="receipt-busy">
          <progress aria-label=${this.status}></progress><span>${this.status}</span>
        </div>` : v, t = this.rows?.filter((e) => e.choice !== "skip").length ?? 0;
		return g`${E({
			title: S("receipt.title"),
			body: g`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${e}`,
			error: this.error,
			invalid: this.invalid(),
			submit: this.rows ? {
				label: S("receipt.book", { count: String(t) }),
				testid: "receipt-book"
			} : {
				label: S("receipt.read"),
				testid: "receipt-read"
			},
			dirty: () => !!(this.image || this.rows),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [
			C,
			Ki,
			s`
      .scan {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 12px;
      }
      .preview {
        display: block;
        max-width: 100%;
        max-height: 30vh;
        margin: 12px 0 0;
        border: 1px solid var(--divider-color);
      }
      .busy {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        color: var(--secondary-text-color);
      }
    `
		];
	}
};
customElements.define("home-inventory-receipt-import", pa);
// src/booking-receipt.ts
var ma = (e, t, n, r) => g`${n && R("receipt_import") ? g`<button
            type="button"
            class="receipt"
            data-testid="receipt-import"
            @click=${(e) => e.target.closest("button").parentNode.querySelector("home-inventory-receipt-import").open()}
          >
            ${T(bt)} ${S("receipt.open")}
          </button>` : v}
    <home-inventory-receipt-import
      .hass=${e}
      .md=${t}
      @booked=${r}
    ></home-inventory-receipt-import>`, ha = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function ga() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: ha.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-CP08CNLB.js"), import("./zxing_reader--v3emN_l.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...ha] });
}
var _a = class extends x {
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
			this.error = S("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = S("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await ga();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = S("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = S("scan.no_camera");
			return;
		}
		let i = async () => {
			let t;
			try {
				[t] = await n.detect(r);
			} catch {
				this.stop(), this.error = S("scan.detector");
				return;
			}
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
		return g`<dialog data-testid="scanner" @close=${this.stop} @click=${Ht()}>
      <h2>${S("scan.title")}</h2>
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : g`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${S("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [C, s`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("home-inventory-scanner", _a);
// src/booking-scan.ts
var va = class extends x {
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
		return g`
      <form class="scan" @submit=${this.submit}>
        <slot name="before"></slot>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${S("book.input")}
          placeholder=${S("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${S("book.camera")}
          @click=${() => this.renderRoot.querySelector("home-inventory-scanner")?.open()}
        >
          ${T(Xe)}<span>${S("book.camera")}</span>
        </button>
      </form>
      <home-inventory-scanner @scan=${this.scanned}></home-inventory-scanner>
    `;
	}
	static {
		this.styles = [C, s`
      .scan {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .scan input {
        flex: 1;
        min-width: 0;
      }
      .scan button {
        flex: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      /* Phone: the input needs the room; the camera button is named by its aria-label. */
      @media (max-width: 480px) {
        .scan button span {
          display: none;
        }
      }
    `];
	}
};
customElements.define("home-inventory-booking-scan", va);
// src/booking-in-fields.ts
function ya(e, t, n, r, i) {
	let a = !n.expires && e.expires_on && e.expires_on < k();
	return g`<label>
    <span class="lbl"
      >${r ? S("book.expires_on_type", { type: S(`settings.expiry.${r}`) }) : S("book.expires_on")}</span
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
    ${n.expires || a ? g`${O(n.expires, "expires")}${a ? O(S("valid.past"), "expires", !0) : ""}` : g`<span class="detail" data-testid="shelf-hint"
            >${i ? S(e.expires_on ? "book.shelf_hint" : "book.guess_hint", {
		days: String(i.value),
		source: i.source
	}) : S("book.no_date_hint")}</span
          >`}
  </label>`;
}
function ba(e, t, n, r, i, a) {
	return g`<label>
      <span class="lbl">${S("book.location")}</span>
      ${G({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${O(i.location, "location")}
    </label>
    ${t.id ? v : g`<label class="check" title=${S("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${S("book.make_default")}
          </label>`}`;
}
function xa(e, t, n) {
	return g`<label class="check" title=${S("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${S("label.print")}
  </label>`;
}
// src/booking-pick.ts
var Sa = "auto", Ca = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), wa = (e, t) => Ca(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Ta(e, t, n, r) {
	let i = (e, t) => g`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return g`<fieldset>
    <legend class="lbl">${S("book.which")}</legend>
    ${i(Sa, S("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, g`<span
          >${t.expires_on ? z(e, t.expires_on) : S("book.no_date")}${t.opened_on ? ` · ${S("stock.opened")}` : ""}
          · ${t.location} <span class="detail">${S("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var Ea = s`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, Da = [
	"name",
	"category_id",
	"content_amount",
	"content_unit_id"
], Oa = async (e, t, n) => {
	try {
		let r = await Tn(e, {
			...Object.fromEntries(Da.map((e) => [e, t[e]])),
			brand: t.brand,
			ean: t.ean,
			off_json: t.off_json
		});
		if (r.status !== "changes") return { state: { kind: r.status === "ok" ? "ok" : "none" } };
		let i = n(), a = Da.filter((e) => e in r && i[e] === t[e]);
		if (!a.length) return { state: { kind: "ok" } };
		let o = Object.fromEntries(a.map((e) => [e, t[e]])), s = a.includes("category_id") ? r.new_type : void 0, c = {
			...Object.fromEntries(a.map((e) => [e, r[e]])),
			new_type: s
		};
		return {
			state: {
				kind: "changed",
				before: {
					...o,
					new_type: void 0
				},
				reason: r.reason,
				newType: s
			},
			draft: {
				...i,
				...c
			}
		};
	} catch (t) {
		return { state: {
			kind: "failed",
			message: await N(e, t)
		} };
	}
}, ka = async (e, t, n) => {
	let { id: r } = await rn(e, t.new_type.name, t.new_type.parent_id);
	return P(e).then((e) => n.dispatchEvent(new CustomEvent("master", { detail: e })), () => void 0), {
		...t,
		category_id: r,
		new_type: void 0
	};
}, Aa = (e, t, n) => {
	let r = [];
	if ("name" in n && r.push(n.name || "–"), "category_id" in n && r.push(t?.categories.find((e) => e.id === n.category_id)?.name ?? "–"), "content_amount" in n || "content_unit_id" in n) {
		let i = t?.units.find((e) => e.id === n.content_unit_id)?.symbol ?? "";
		r.push(n.content_amount == null ? "–" : H(e, n.content_amount, i));
	}
	return r.join(", ");
}, ja = (e, t, n, r) => {
	switch (e.kind) {
		case "running": return g`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${S("book.ai.running")}></progress>
        <span>${S("book.ai.running")}</span>
      </div>`;
		case "ok": return g`<p class="ai" role="status" data-testid="product-ai-status">
        ${S("book.ai.ok")}
      </p>`;
		case "failed": return g`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${e.message}
      </p>`;
		case "changed": return g`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${S("book.ai.changed", {
			reason: e.reason,
			before: Aa(t, n, e.before)
		})}</span
        >
        ${e.newType ? g`<span data-testid="product-ai-new-type"
                >${S("book.ai.new_type", {
			name: e.newType.name,
			parent: n?.categories.find((t) => t.id === e.newType.parent_id)?.name ?? "–"
		})}</span
              >` : v}
        <button type="button" data-testid="product-ai-undo" @click=${() => r(e.before)}>
          ${S("book.ai.undo")}
        </button>
      </div>`;
		default: return v;
	}
}, Ma = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: Sa,
	print: null
}), Na = (e) => e?.category_id ?? e?.new_type?.parent_id ?? null, Pa = null, Fa = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			mode: { attribute: !1 },
			product: { attribute: !1 },
			md: { attribute: !1 },
			stock: { attribute: !1 },
			at: { attribute: !1 },
			busy: { attribute: !1 },
			run: { attribute: !1 },
			draft: { state: !0 },
			labels: { state: !0 },
			f: { state: !0 },
			ai: { state: !0 }
		};
	}
	constructor() {
		super(), this.set = (e) => this.f = {
			...this.f,
			...e
		}, this.initial = "", this.setProduct = (e, t) => this.setFields({
			[e]: t,
			...e === "category_id" ? { new_type: void 0 } : {}
		}), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Ma(), this.ai = { kind: "none" };
	}
	willUpdate(e) {
		if (e.has("product")) {
			this.draft = this.product, this.f = {
				...Ma(),
				location_id: this.at ?? null,
				expires_on: this.prefill() ? this.proposal() : ""
			}, this.initial = JSON.stringify(this.f), this.ai = { kind: "none" };
			let e = this.product;
			this.hass && this.mode === "in" && e && !e.id && e.off_json && R("ai_product_check") && this.check(e), this.hass && this.mode === "in" && pn(this.hass).then((e) => {
				let t = !this.dirty();
				this.labels = e, t && e.prefill_expiry && (this.f = {
					...this.f,
					expires_on: this.proposal()
				}, this.initial = JSON.stringify(this.f));
			}, () => void 0);
		}
	}
	async check(e) {
		this.ai = { kind: "running" };
		let t = await Oa(this.hass, e, () => this.draft);
		this.product === e && (this.ai = t.state, t.draft && this.setFields(t.draft));
	}
	setFields(e) {
		let t = this.proposal();
		this.draft = {
			...this.draft,
			...e
		}, this.prefill() && this.f.expires_on === t && (this.f = {
			...this.f,
			expires_on: this.proposal()
		});
	}
	dirty() {
		return this.draft !== this.product || JSON.stringify(this.f) !== this.initial;
	}
	focusFirst() {
		let e = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
		this.renderRoot.querySelector(e)?.focus();
	}
	dflt(e) {
		let t = this.draft?.[e];
		if (t != null) return {
			value: t,
			source: S("book.from_product")
		};
		let n = W(this.md, Na(this.draft), e);
		if (n) return n;
		if (e === "default_location_id" && Pa != null) return {
			value: Pa,
			source: S("book.last_used")
		};
	}
	prefill() {
		return !!this.labels?.prefill_expiry || this.dflt("expiry_type")?.value === "guide";
	}
	proposal() {
		let e = this.mode === "in" ? this.dflt("shelf_days") : void 0;
		return e ? Ri(k(), Number(e.value)) : "";
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (!t.id && t.new_type && t.category_id == null) {
			let e = await this.run(() => ka(n, t, this));
			if (!e) return;
			t = this.draft = e;
		}
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : Di(t);
			o && this.f.makeDefault && e !== W(this.md, Na(t), "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => sn(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (Pa = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => Dr(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = Ca(this.stock, this.f.pick), i = await this.run(() => cn(n, {
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
		let s = S(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${S("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return v;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? g`<h2>${S("book.title_out", { name: e.name })}</h2>
            <p class="empty" data-testid="no-stock">${S("book.no_stock")}</p>
            <div class="actions">${this.cancelButton()}</div>` : v;
		let n = this.mode === "out" ? wa(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return g`<form class="book" @submit=${this.submit}>
      ${t ? g`<h2>
              ${S("book.title_out", { name: e.name })}${e.brand ? g` <span class="detail">${e.brand}</span>` : v}
            </h2>` : g`<h2>${S("book.title_in")}</h2>
              ${ja(this.ai, this.hass, this.md, (e) => (this.ai = { kind: "none" }, this.setFields(e)))}
              <p class="summary" data-testid="summary">
                ${Ai(this.md, e, U(this.md?.categories, e.category_id), this.hass) || S("book.new_product")}
                ${e.id ? v : g`<span class="detail">${S("book.is_new")}</span>`}
              </p>`}
      ${t ? Ta(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : g`${e.id ? v : ki(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${ya(this.f, this.set, r, this.dflt("expiry_type")?.value, !this.f.expires_on || this.f.expires_on === this.proposal() ? this.dflt("shelf_days") : void 0)}`}
      <label>
        <span class="lbl">${S("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? v}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${O(r.packages, "packages")}
      </label>
      ${t ? v : g`${ba(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${xa(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        ${this.cancelButton()}
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${S(`book.submit_${this.mode}`)}
        </button>
      </div>
    </form>`;
	}
	cancelButton() {
		return g`<button
      type="button"
      data-testid="cancel"
      @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
    >
      ${S("common.cancel")}
    </button>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? Oi(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (A(i, r) && (t.expires = S("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = S("valid.location")));
		let a = this.mode === "out" ? wa(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = S("valid.packages") : a != null && n > a && (t.packages = S("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			C,
			Ea,
			It,
			s`
      .actions {
        justify-content: flex-end;
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
customElements.define("home-inventory-booking-form", Fa);
// src/booking-hits.ts
function Ia(e, t) {
	return g`
    ${e.length ? v : g`<p class="empty">${S("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => g`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    <div class="actions after">
      <button type="button" data-testid="cancel" @click=${t.cancel}>${S("common.cancel")}</button>
      ${t.more ? g`${t.online || !R("off_lookup") ? v : g`<button
                      data-testid="search-online"
                      ?disabled=${t.busy}
                      @click=${t.searchOnline}
                    >
                      ${S("book.search_online")}
                    </button>`}
              <button data-testid="new-product" @click=${t.create}>
                ${S("book.new_product")}
              </button>` : v}
    </div>
  `;
}
// src/booking-modes.ts
var La = [
	["search", ut],
	["in", _t],
	["out", pt],
	["open", ht],
	["freeze", St]
], Ra = {
	open: "opened",
	freeze: "frozen"
}, za = (e, t) => g`<div slot="before" class="modes" role="group" aria-label=${S("stock.mode")}>
    ${La.filter(([e]) => !Ra[e] || L(Ra[e])).map(([n, r]) => g`<button
          type="button"
          data-testid=${`mode-${n}`}
          aria-pressed=${n === e}
          aria-label=${S(`stock.mode_${n}`)}
          title=${S(`stock.mode_${n}`)}
          @click=${() => t(n)}
        >
          ${T(r)}
        </button>`)}
  </div>`, Ba = s`
  .modes {
    flex: none;
    display: flex;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    overflow: hidden;
  }
  .modes button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: var(--secondary-text-color);
  }
  .modes button + button {
    border-left: 1px solid var(--divider-color);
  }
  .modes button[aria-pressed="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .modes button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -4px;
  }
`, Va = (e, t) => {
	t !== void 0 && (e.message = t), e.dispatchEvent(new CustomEvent("booked")), e.focusInput();
};
async function Ha(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(() => vn(e.hass, t));
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.undo = r.taken, Va(e, S("book.done_label", {
			name: r.name,
			where: r.location
		}));
	}
}
async function Ua(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.opened = r, Va(e);
	}
}
async function Wa(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.frozen = {
			result: r,
			thaw: r.thaw
		}, Va(e);
	}
}
async function Ga(e) {
	let { undo: t, opened: n, frozen: r } = e;
	if (e.undo = e.opened = e.frozen = void 0, await e.run(() => r ? qr(e.hass, r.result.booking_id) : n ? Gr(e.hass, n.booking_id) : ln(e.hass, t)) === void 0) return void (e.undo = t, e.opened = n, e.frozen = r);
	Va(e, S(r ? "book.undone_frozen" : n ? "book.undone_open" : "book.undone"));
}
var Ka = (e) => e.frozen ? gi(e.hass, e.frozen, () => Ga(e), () => li(e, e.frozen.result)) : e.opened ? ui(e.hass, e.opened, () => Ga(e), () => li(e, e.opened), "open") : q(e.message, e.undo && (() => Ga(e))), qa = /^PTRY:/i, Ja = /^\d{8,14}$/;
async function Ya(e, t, n) {
	if (Ar(n)) {
		let r = await e.run(() => jr(t, n));
		return r === void 0 || (e.query = "", r ? e.at = r : e.error = S("location_label.unknown")), !0;
	}
	if (e.mode === "freeze" && (qa.test(n) || Ja.test(n))) return await Wa(e, () => Jr(t, n, e.at?.id)), !0;
	if (!qa.test(n)) return !1;
	let r = n.replace(qa, "");
	return await (e.mode === "open" ? Ua(e, () => Wr(t, r)) : Ha(e, r)), !0;
}
// src/booking-view.ts
var Xa = /^\d{8,14}$/, Za = class extends x {
	static {
		this.properties = {
			at: { state: !0 },
			hass: { attribute: !1 },
			mode: { attribute: !1 },
			query: { state: !0 },
			hits: { state: !0 },
			online: { state: !0 },
			product: { state: !0 },
			stock: { state: !0 },
			message: { state: !0 },
			undo: { state: !0 },
			opened: { state: !0 },
			frozen: { state: !0 },
			error: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.seq = 0, this.started = !1, this.dirty = () => !!this.renderRoot.querySelector("home-inventory-booking-form")?.dirty(), this.run = async (e) => {
			this.busy = !0, this.error = "";
			try {
				return await e();
			} catch (e) {
				await this.fail(e);
				return;
			} finally {
				this.busy = !1;
			}
		}, this.receiptBooked = (e) => {
			this.reset(), this.message = S("receipt.done", { count: String(e.detail) }), this.undo = void 0, this.dispatchEvent(new CustomEvent("booked"));
		}, this.mode = "search", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = this.opened = this.frozen = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, P(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
	}
	firstUpdated() {
		this.focusInput();
	}
	updated(e) {
		e.has("query") && this.dispatchEvent(new CustomEvent("query", { detail: this.query }));
		let t = this.renderRoot.querySelector("dialog"), n = !!(this.hits || this.product);
		n && !t?.open ? t?.showModal() : !n && t?.open && t.close();
	}
	setMode(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: e === "search" ? "stock" : e,
			bubbles: !0,
			composed: !0
		})), this.focusInput();
	}
	closed() {
		(this.hits || this.product) && this.reset(), this.focusInput();
	}
	focusInput() {
		this.renderRoot.querySelector("home-inventory-booking-scan")?.focusInput();
	}
	async fail(e) {
		this.error = this.hass ? await N(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass || this.mode === "search") return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = this.opened = this.frozen = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, await Ya(this, t, e)) return;
		if (Xa.test(e)) {
			let r = await this.run(() => an(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "in" ? this.choose(Ei({ ean: e })) : void (this.error = S("book.unknown"));
		}
		let r = await this.run(() => on(t, e));
		r && n === this.seq && (this.hits = r, this.mode !== "in" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => on(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => an(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode !== "in" && !e.id) return void (this.error = S("book.unknown"));
		if (this.mode === "freeze") return Wa(this, () => Jr(this.hass, void 0, this.at?.id, e.id));
		if (this.mode === "open") return Ua(this, () => Ur(this.hass, {
			product_id: e.id,
			location_id: this.at?.id
		}));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => F(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = this.at ? n?.filter((e) => e.location_id === this.at.id) : n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("home-inventory-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		let e = !!(this.hits || this.product), t = this.error ? g`<p class="error" role="alert" data-testid="error">${this.error}</p>` : v;
		return g`
      <home-inventory-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      >
        ${za(this.mode, (e) => this.setMode(e))}
      </home-inventory-booking-scan>
      ${Mr(this.at?.name, () => this.at = void 0)} ${Ka(this)}
      ${e ? v : t}
      ${ma(this.hass, this.md, this.mode === "in", this.receiptBooked)}
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${Ht(this.dirty)}
        @keydown=${Ut(this.dirty)}
        @cancel=${Ut(this.dirty)}
      >
        ${this.hits ? g`<h2>${S(`book.pick_${this.mode}`)}</h2>
                ${Ia(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(Ei({ name: this.query.trim() })),
			cancel: () => this.closed()
		})}` : v}
        ${this.renderForm()} ${e ? t : v}
      </dialog>
    `;
	}
	renderForm() {
		return this.product ? g`<home-inventory-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .at=${this.at?.id}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @master=${(e) => (this.md = e.detail, this.requestUpdate())}
      @cancel=${() => this.closed()}
    ></home-inventory-booking-form>` : v;
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.dispatchEvent(new CustomEvent("booked")), this.focusInput();
	}
	static {
		this.styles = [
			C,
			J,
			Ba,
			s`
      .after {
        margin-top: 12px;
      }
      .receipt {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
      }
    `
		];
	}
};
customElements.define("home-inventory-booking", Za);
// src/stock-view.ts
var Qa = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			mode: { attribute: !1 },
			md: { state: !0 },
			stock: { state: !0 },
			filter: { state: !0 },
			location: { state: !0 },
			withEmpty: { state: !0 },
			open: { state: !0 },
			error: { state: !0 },
			undo: { state: !0 },
			opened: { state: !0 },
			frozen: { state: !0 },
			message: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.started = !1, this.reload = async () => {
			let [e, t] = await Promise.all([F(this.hass), dn(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.date = (e) => vi(this.hass, e, this.products.get(e.product_id), this.md), this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await N(this.hass, e);
			}
		}, this.mode = "search", this.filter = "", this.location = null, this.withEmpty = !1, this.open = /* @__PURE__ */ new Set(), this.error = "", this.message = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load()), e.has("undo") && this.undo && (this.opened = this.frozen = void 0), e.has("opened") && this.opened && (this.undo = this.frozen = void 0), e.has("frozen") && this.frozen && (this.undo = this.opened = void 0), [
			"filter",
			"location",
			"withEmpty",
			"stock"
		].some((t) => e.has(t)) && (this.message = "");
	}
	async load() {
		try {
			this.md = await P(this.hass), await this.reload();
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	tree(e) {
		let t = zr(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return Hr(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? bi(e.id, e.name, e.packages, e.depth, e.open, (e) => this.toggle(e)) : this.renderItem(e.item, e.depth, e.open));
	}
	status(e) {
		return Vr(e, this.products.get(e.product_id), this.md);
	}
	toggle(e) {
		this.open = Kt(this.open, e);
	}
	render() {
		let e = this.error ? g`<p class="error" role="alert">${this.error}</p>` : v;
		return g`${g`<home-inventory-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e) => this.filter = e.detail}
      @booked=${this.saved}
      @home-inventory-print-label=${(e) => this.label(e.detail)}
    ></home-inventory-booking>`} ${e} ${this.stock ? this.list(this.stock) : v}`;
	}
	list(e) {
		let t = this.tree(this.filter.trim() !== "");
		return g`
      ${Si(this)} ${ci(this, "stock")}
      ${ui(this.hass, this.opened, () => fi(this), () => this.label({
			id: this.opened.batch_id,
			name: this.opened.name,
			packages: 1
		}), "opened")}
      ${gi(this.hass, this.frozen, () => _i(this), () => this.label({
			id: this.frozen.result.batch_id,
			name: this.frozen.result.name,
			packages: 1
		}))}
      ${q(this.message, void 0, "label")}
      ${t.length ? g`<ul>
              ${t}
            </ul>` : g`<p class="empty">
              ${S(e.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`}
      <home-inventory-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @home-inventory-saved=${this.saved}
        @master=${(e) => this.md = e.detail}
      ></home-inventory-product-dialog>
      <home-inventory-batch-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-batch-dialog>
      <home-inventory-frozen-dialog
        .hass=${this.hass}
        .locations=${this.md?.locations ?? []}
        @home-inventory-frozen=${async (e) => {
			this.frozen = e.detail, this.stock = await F(this.hass);
		}}
      ></home-inventory-frozen-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => this.message = e.detail ? S("label.printed", { n: e.detail }) : ""}
      ></home-inventory-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("home-inventory-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await Lr(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	printBatch(e, t) {
		let n = t.filter((t) => t.batch_id === e.batch_id).reduce((e, t) => e + t.packages, 0);
		this.label({
			id: e.batch_id,
			name: e.name,
			packages: n
		});
	}
	label(e) {
		this.renderRoot.querySelector("home-inventory-label-dialog")?.open(e);
	}
	editBatch(e) {
		this.renderRoot.querySelector("home-inventory-batch-dialog").open(e);
	}
	renderItem(e, t, n) {
		let r = e.batches[0], i = r ? () => this.toggle(`p${e.id}`) : () => this.editProduct(e.id), a = {
			host: this,
			md: this.md,
			product: this.products.get(e.id),
			status: (e) => this.status(e),
			date: this.date,
			freeze: (e, t) => this.renderRoot.querySelector("home-inventory-frozen-dialog").open(e, t),
			label: (t) => this.printBatch(t, e.batches),
			edit: (e) => this.editBatch(e)
		};
		return g`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? Gt(n, i) : g`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : v}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, S("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? g` · <span class=${this.status(r)}>${this.date(r)}</span>` : v}
          </span>
        </button>
        ${D({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: M(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? g`<ul class="batches">
              ${e.batches.map((t) => yi(a, e.name, t))}
            </ul>` : v}
    </li>`;
	}
	static {
		this.styles = [
			C,
			J,
			Ci,
			wi
		];
	}
};
customElements.define("home-inventory-stock", Qa);
// src/expiry-recipes.ts
var $a = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			days: { attribute: !1 },
			stock: { attribute: !1 },
			list: { state: !0 }
		};
	}
	constructor() {
		super(), this.latest = 0, this.started = !1, this.list = [];
	}
	willUpdate(e) {
		this.hass && (e.has("days") || e.has("stock") || e.has("hass") && !this.started) && (this.started = !0, this.load());
	}
	async load() {
		let e = ++this.latest;
		try {
			let t = await bn(this.hass, this.days);
			e === this.latest && (this.list = t);
		} catch {
			this.list = [];
		}
	}
	open(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: `recipes/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return this.list.length ? g`<h2>${S("expiry.recipes")}</h2>
      <ul>
        ${this.list.map((e) => g`<li>
              <button
                type="button"
                class="row"
                data-testid="expiry-recipe"
                @click=${() => this.open(e.recipe_id)}
              >
                <span>${e.name}</span>
                <span class="detail"
                  >${S("expiry.recipe_detail", {
			...e,
			products: e.products.join(", ")
		})}</span
                >
              </button>
            </li>`)}
      </ul>` : v;
	}
	static {
		this.styles = [C, s`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `];
	}
};
customElements.define("home-inventory-expiry-recipes", $a);
// src/expiry-view.ts
var eo = class extends x {
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
				P(this.hass),
				F(this.hass),
				dn(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? S("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(Pn(this.hass), { numeric: "auto" }).format(Br(e), "day");
	}
	render() {
		let e = this.error ? g`<p class="error" role="alert">${this.error}</p>` : v;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: Vr(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return g`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${S("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${S("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${S("common.days_unit")}
        </span>
        ${O(t, "expiry-days")}
      </div>
      ${ci(this, "expiry")}
      ${r.length ? g`<ul>
              ${r.map(({ r: e, status: t }) => g`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}
                        >${e.expiry_type === "guide" ? S("stock.approx_date", { date: z(this.hass, e.expires_on) }) : z(this.hass, e.expires_on)}</span
                      >
                      <span class="detail"
                        >${this.relative(e.expires_on)}${e.expiry_guessed && e.expiry_type !== "guide" ? ` · ${S("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[
			e.brand,
			e.opened_on && S("stock.opened"),
			e.location
		].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${S("book.count", { n: e.packages })}</span>
                    ${oi(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : g`<p class="empty">${S("expiry.empty")}</p>`}
      ${L("recipes") ? g`<home-inventory-expiry-recipes
              .hass=${this.hass}
              .days=${n}
              .stock=${this.stock}
            ></home-inventory-expiry-recipes>` : v}
    `;
	}
	static {
		this.styles = [
			C,
			J,
			s`
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
      .past {
        color: var(--warning-color);
        font-weight: 500;
      }
    `
		];
	}
};
customElements.define("home-inventory-expiry", eo);
// src/emergency-view.ts
var to = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			data: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load());
	}
	async load() {
		try {
			this.data = await Nn(this.hass);
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		if (this.error) return g`<p class="error">${this.error}</p>`;
		if (!e) return v;
		let t = (e) => B(this.hass, e);
		return g`
      <p class="supply" data-testid="emergency-supply">
        ${S("emergency.supply", { days: t(e.supply_days) })}
      </p>
      <p class="detail">${S("emergency.target", {
			persons: t(e.persons),
			days: t(e.days)
		})}</p>
      <table>
        <thead>
          <tr>
            <th>${S("emergency.group")}</th>
            <th>${S("emergency.need")}</th>
            <th>${S("emergency.have")}</th>
            <th>${S("emergency.lasts")}</th>
          </tr>
        </thead>
        <tbody>
          ${e.groups.map((e) => g`<tr data-testid=${`emergency-row-${e.key}`}>
                <td>
                  ${S(`emergency.group.${e.key}`)}
                  ${e.unknown ? g`<div class="detail">
                          ${S("emergency.unknown", { n: t(e.unknown) })}
                        </div>` : v}
                </td>
                <td>${t(e.need)} ${e.unit}</td>
                <td>${t(e.have)} ${e.unit}</td>
                <td>${S("emergency.days", { days: t(e.days) })}</td>
              </tr>`)}
        </tbody>
      </table>
      <p class="detail">${S("emergency.hint")}</p>
    `;
	}
	static {
		this.styles = s`
    :host {
      display: block;
      padding: 16px;
      max-width: 720px;
      margin: 0 auto;
    }
    .supply {
      margin: 0;
      font-size: 22px;
    }
    .detail {
      margin: 4px 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    table {
      width: 100%;
      margin: 16px 0;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 8px 4px;
      text-align: left;
      border-bottom: 1px solid var(--divider-color);
    }
    th {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
  `;
	}
};
customElements.define("home-inventory-emergency", to);
// node_modules/lit-html/directive.js
var no = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ro = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), io = class {
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
}, { I: ao } = Ue, oo = (e) => e.strings === void 0, so = {}, co = (e, t = so) => e._$AH = t, lo = ro(class extends io {
	constructor(e) {
		if (super(e), e.type !== no.PROPERTY && e.type !== no.ATTRIBUTE && e.type !== no.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!oo(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === _ || t === v) return t;
		let n = e.element, r = e.name;
		if (e.type === no.PROPERTY) {
			if (t === n[r]) return _;
		} else if (e.type === no.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return _;
		} else if (e.type === no.ATTRIBUTE && n.getAttribute(r) === t + "") return _;
		return co(e), t;
	}
}), uo = (e) => e.callWS({ type: "home_inventory/shopping" }), fo = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), po = (e, t) => e.callWS({
	type: "home_inventory/shopping_add",
	...t
}), mo = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_item",
	item_id: t,
	...n
}), ho = (e, t) => e.callWS({
	type: "home_inventory/shopping_item_delete",
	item_id: t
}), go = (e) => e.callWS({ type: "home_inventory/shopping_recipes" }), _o = (e, t, n, r) => e.callWS({
	type: "home_inventory/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), vo = (e, t) => e.callWS({
	type: "home_inventory/shopping_recipe_remove",
	recipe_id: t
}), yo = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_recipe_done",
	key: t,
	done: n
});
// src/shopping-text.ts
function bo(e, t) {
	let n = (t) => H(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : S("shopping.any"), S("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : S("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(S("book.count", { n: t.packages }));
	let i = S(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(S("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function xo(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : H(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: S(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? S("shopping.unknown", { n: r }) : ""
	};
}
// src/shopping-row-styles.ts
var So = s`
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
    white-space: pre; /* keep the leading space: a flex item drops it otherwise */
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
`, Co = 8, wo = class extends x {
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
			[this.md, this.products] = await Promise.all([P(this.hass), dn(this.hass)]);
		} catch (e) {
			this.error = await N(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return U(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = S("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, Oi(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = S("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = S("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await mo(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await po(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await po(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await po(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await po(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return g`<li>
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
		if (!e) return v;
		let t = (t) => !!t && V(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, Co), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, Co), i = Ei({ name: e });
		return g`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, S("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", S("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${M(this.hass) ? this.hit("shopping-new-category", S("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : v}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return g`<label>
          <span class="lbl">${S("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? O(e.what, "shopping-what") : v}
        </label>
        ${this.hits()}`;
		let n = g`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${S("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? g`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : S("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? g`<p class="detail">${S("shopping.add.creates_product")} ${n}</p>
        ${ki(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : g`<p class="detail">${S("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${S("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${O(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${S("settings.category.parent")}</span>
        <home-inventory-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${S("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></home-inventory-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors();
		return E({
			title: this.item ? S("common.edit_name", { name: this.item.name }) : S("shopping.add.title"),
			body: g`${this.item ? v : this.what(e)}
        <label>
          <span class="lbl">${S("shopping.add.packages")}</span>
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
				this.packages = j(t);
			}}
            />
            <span class="detail">${S("book.packages")}</span>
          </span>
          ${O(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-shopping-add", wo);
// src/shopping-recipe-dialog.ts
var To = class extends x {
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
		let n = (await go(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await _o(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: S("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await _o(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await N(this.hass, e);
				return;
			}
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
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
		if (!this.active || !this.recipe) return g`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return E({
			title: S("shopping.recipe.title", { name: this.recipe.name }),
			body: g`<label>
          <span class="lbl">${S("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!e.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e) => this.servings = j(e.target.value)}
          />
          ${O(e.servings, "shopping-recipe-servings")}
        </label>
        ${t.length ? g`<fieldset>
                <legend class="lbl">${S("shopping.recipe.optional")}</legend>
                ${t.map((e) => g`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(e.id)}
                        @change=${(t) => this.toggle(e, t.target.checked)}
                      />
                      ${e.text}
                    </label>`)}
              </fieldset>` : v}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: S("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-shopping-recipe-dialog", To);
// src/shopping-recipes.ts
var Eo = class extends x {
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
			[this.list, this.recipes] = await Promise.all([go(this.hass), yn(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await zt(e.name)) {
			try {
				await vo(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await N(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return g`${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipe-dialog>
      ${this.list.length ? g`<h3>${S("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => g`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${S("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${Ln(this.hass, e.servings)}</span>
                      ${D({
			testid: "shopping-recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: () => this.removeEntry(e)
		})}
                    </li>`)}
              </ul>` : v}`;
	}
	static {
		this.styles = [C, s`
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
customElements.define("home-inventory-shopping-recipes", Eo);
// src/shopping-view.ts
var Do = class extends x {
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
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), pn(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await hn(this.hass);
				this.note = S("shopping.printed", { n: e });
			} catch (e) {
				this.error = await N(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([uo(this.hass), P(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await mo(this.hass, e.id, { done: t }) : e.key ? await yo(this.hass, e.key, t) : await fo(this.hass, e, t);
		} catch (e) {
			return this.error = await N(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await zt(e.name)) {
			this.error = "";
			try {
				await ho(this.hass, e.id);
			} catch (e) {
				return this.error = await N(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("home-inventory-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = bo(this.hass, e), i = xo(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return g`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${lo(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="line" title=${a}
            ><span class="name">${e.name}</span
            >${r ? g`<span class="amt"> – ${r}</span>` : v}</span
          >
          ${i.uses.length || i.unknown ? g`<span class="refs" data-testid="shopping-refs"
                  >${i.uses.map((e, t) => g`<span title=${e.title} aria-label=${e.title}
                        >${e.text}${t < i.uses.length - 1 ? ";" : ""}</span
                      >`)}${i.unknown ? g`<span class="unknown" title=${i.unknown}>${i.unknown}</span>` : v}</span
                >` : v}
        </span>
      </label>
      ${e.manual ? D({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : v}
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
				i.push(t ? this.row(t, o, !0) : g`<li
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
		let e = this.error ? g`<p class="error" role="alert">${this.error}</p>` : v;
		return !this.items || !this.cats ? e : g`${g`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${S("shopping.add.title")}
        </button>
        ${this.receipt ? g`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${S("shopping.print")}
              </button>` : v}
      </div>
      ${this.note ? g`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : v}
      <home-inventory-shopping-recipes
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipes>
      <home-inventory-shopping-add
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-add>`}
    ${this.items.length ? g`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : g`<p class="empty">${S("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			C,
			So,
			s`
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
customElements.define("home-inventory-shopping", Do);
// src/form-fields.ts
var Oo = (e) => g`<label>
    <span class="lbl">${e.label}</span>
    <span class="num">
      <input
        type="number"
        min=${e.step ?? "1"}
        step=${e.step ?? "1"}
        inputmode="numeric"
        data-testid=${e.testid}
        aria-invalid=${!!e.err}
        .value=${String(e.value ?? "")}
        @input=${(t) => e.onChange(j(t.target.value))}
      />
      ${e.unit}
    </span>
    ${O(e.err, e.testid)}
  </label>`, ko = (e) => g`<label>
    <span class="lbl">${e.label}</span>
    <input
      type="date"
      min="2000-01-01"
      max="2099-12-31"
      data-testid=${e.testid}
      aria-invalid=${!!e.err}
      .value=${e.value}
      @input=${(t) => {
	let n = t.target;
	e.onChange(n.value, n.validity.badInput);
}}
    />
    ${O(e.err, e.testid)}
  </label>`, Q = (e, t, n) => S(e === "drying" ? `drying.${t}` : e === "leftover" ? `leftovers.${t}` : `canning.${t}`, n), Ao = () => [
	"canning",
	"drying",
	"leftover"
].filter((e) => L(e === "leftover" ? "leftovers" : e)), jo = (e, t, n) => t === "drying" ? `${B(e, n / 60)} ${S("drying.hours_unit")}` : `${n} ${S("recipes.minutes_unit")}`, Mo = (e) => e.kind === "drying" ? Oo({
	testid: e.testid,
	label: S("recipes.field.canning_minutes"),
	unit: S("drying.hours_unit"),
	step: "0.5",
	value: e.minutes == null ? null : e.minutes / 60,
	err: e.err && S("valid.drying_hours"),
	onChange: (t) => e.onChange(t == null ? null : Math.round(t * 60))
}) : Oo({
	testid: e.testid,
	label: S("recipes.field.canning_minutes"),
	unit: S("recipes.minutes_unit"),
	value: e.minutes,
	err: e.err,
	onChange: e.onChange
}), No = s`
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
  .soon {
    color: var(--warning-color);
  }
  .check {
    margin-bottom: 8px;
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
    flex-wrap: wrap;
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
  h4.section {
    margin: 8px 0 0;
    font-size: 1em;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  ol.steps {
    margin: 4px 0;
    padding-left: 24px;
  }
  ol.steps li {
    display: list-item; /* formStyles' flex rows hide the number */
    border-bottom: none;
    margin: 4px 0;
  }
  .text {
    white-space: pre-line;
    margin: 0;
  }
  .photo {
    display: block;
    width: 100%;
    max-height: 30vh;
    object-fit: contain;
    margin-bottom: 8px;
  }
  a {
    color: var(--primary-color);
  }
`, Po = 2e3, Fo = (e) => e.flatMap((e) => [...e.section ? [{
	kind: "head",
	text: e.section
}] : [], {
	kind: "step",
	text: e.text
}]), Io = (e) => (e ?? "").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean).map((e) => ({
	kind: "step",
	text: e
})), Lo = (e) => {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		e && (r.kind === "head" ? n = e : (t.push({
			section: n,
			text: e
		}), n = null));
	}
	return t;
}, Ro = (e, t = (e) => e.text) => {
	let n = [];
	return e.forEach((e, t) => {
		(e.section || !n.length) && n.push({
			section: e.section,
			first: t,
			steps: []
		}), n[n.length - 1].steps.push(e);
	}), g`${n.map((e) => g`${e.section ? g`<h4 class="section">${e.section}</h4>` : v}
        <ol class="steps" start=${e.first + 1}>
          ${e.steps.map((n, r) => g`<li data-testid="recipe-step">${t(n, e.first + r)}</li>`)}
        </ol>`)}`;
}, zo = () => ({
	diet: "",
	without: []
}), Bo = (e) => +!!e.diet + e.without.length, Vo = (e, t) => {
	let n = e.diet;
	return n ? t.diet && !(n.diet === "vegan" || t.diet === "vegetarian" && n.diet === "vegetarian") ? !1 : t.without.every((e) => n.allergens_known && !n.contains.includes(e)) : !0;
}, Ho = (e, t) => t != null && (e == null || Yt.indexOf(e) > Yt.indexOf(t)), Uo = (e, t) => {
	let n = e.optional.find((e) => e.text === t);
	return n ? [Ho(n.diet, e.diet) ? n.diet == null ? S("diet.missing") : S(n.diet === "none" ? "diet.not_vegetarian" : "diet.not_vegan") : "", n.contains.length ? S("allergens.contains", { list: Un(n.contains.join(",")) }) : ""].filter(Boolean).join(", ") : "";
}, Wo = (e) => {
	let t = e.diet, n = [
		t.diet ? S(`diet.${t.diet}`) : "",
		t.contains.length ? S("allergens.contains", { list: Un(t.contains.join(",")) }) : t.allergens_known ? S("allergens.none") : "",
		t.optional.length ? S("recipes.diet.optional", { list: t.optional.map((e) => `${e.text} (${Uo(t, e.text)})`).join(", ") }) : ""
	].filter(Boolean);
	return g`<span class="detail" data-testid="recipe-diet"
      >${n.length ? n.join(" · ") : S("diet.unknown")}</span
    >${t.unknown.length ? g`<span class="detail" data-testid="recipe-diet-unknown"
            >${S("recipes.diet.unknown", { list: t.unknown.join(", ") })}</span
          >` : v}`;
}, Go = (e, t) => g`<details class="diet-filter" data-testid="recipe-diet-filter">
    <summary>
      ${S("recipes.diet.filter")}${Bo(e) ? ` (${Bo(e)})` : ""}
    </summary>
    <label>
      <span class="lbl">${S("diet.label")}</span>
      <select
        data-testid="recipe-diet-select"
        @change=${(n) => t({
	...e,
	diet: n.target.value
})}
      >
        <option value="" .selected=${e.diet === ""}>${S("recipes.diet.all")}</option>
        ${["vegan", "vegetarian"].map((t) => g`<option value=${t} .selected=${e.diet === t}>${S(`diet.${t}`)}</option>`)}
      </select>
    </label>
    <div class="field">
      <span class="lbl">${S("recipes.diet.without")}</span>
      <span class="allergen-grid">
        ${Hn.map((n) => g`<label class="check"
              ><input
                type="checkbox"
                data-testid=${`recipe-without-${n}`}
                .checked=${e.without.includes(n)}
                @change=${(r) => t({
	...e,
	without: r.target.checked ? [...e.without, n] : e.without.filter((e) => e !== n)
})}
              />${S(`allergen.${n}`)}</label
            >`)}
      </span>
    </div>
  </details>`, Ko, qo = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			print: { attribute: !1 },
			done: { attribute: !1 },
			testid: { attribute: !1 },
			available: { state: !0 },
			note: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.available = !1, this.note = "", this.busy = !1;
	}
	connectedCallback() {
		super.connectedCallback(), Ko ??= pn(this.hass).then((e) => e.receipt, () => !1), Ko.then((e) => this.available = e);
	}
	async run() {
		this.busy = !0;
		try {
			await this.print(), this.note = this.done;
		} catch (e) {
			this.note = await N(this.hass, e);
		} finally {
			this.busy = !1;
		}
	}
	createRenderRoot() {
		return this;
	}
	render() {
		return this.available ? g`<button
        type="button"
        data-testid=${this.testid}
        ?disabled=${this.busy}
        @click=${() => this.run()}
      >
        ${T(yt)} ${S("common.print")}
      </button>
      ${this.note ? g`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >` : v}` : v;
	}
};
customElements.define("home-inventory-receipt-button", qo);
// src/recipe-output.ts
var Jo = (e) => `${e.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "recipe"}.json`, Yo = async (e, t, n) => {
	try {
		ur(await Dn(e, n?.id), n ? Jo(n.name) : S("recipes.export_all_file"));
	} catch (n) {
		t(await N(e, n));
	}
}, Xo = "\n@media screen { #hi-print { display: none; } }\n@media print {\n  body > * { display: none !important; }\n  body > #hi-print { display: block !important; color: #000; background: #fff; font: 12pt/1.4 sans-serif; }\n  #hi-print h1 { font-size: 20pt; margin: 0 0 4pt; }\n  #hi-print h2 { font-size: 14pt; margin: 14pt 0 4pt; }\n  #hi-print h3 { font-size: 12pt; margin: 8pt 0 2pt; }\n  #hi-print li { break-inside: avoid; margin-bottom: 3pt; }\n}", Zo = (e, t, n) => {
	let r = (e, t, n) => {
		let r = document.createElement(e);
		return t && (r.textContent = t), n?.appendChild(r), r;
	};
	document.getElementById("hi-print")?.remove();
	let i = r("div");
	i.id = "hi-print", r("style", Xo, i), r("h1", e.name, i), r("p", `${S("recipes.servings")}: ${t}`, i), r("h2", S("recipes.ingredients"), i);
	let a = r("ul", void 0, i);
	if (n.forEach((e) => r("li", e, a)), e.steps.length) {
		r("h2", S("recipes.instructions"), i);
		let t = r("ol", void 0, i), n = 0;
		e.steps.forEach((e) => {
			e.section && (r("h3", e.section, i), t = r("ol", void 0, i), t.setAttribute("start", String(n + 1))), r("li", e.text, t), n++;
		});
	} else e.instructions && (r("h2", S("recipes.instructions"), i), e.instructions.split("\n").filter((e) => e.trim()).forEach((e) => r("p", e, i)));
	e.source_url && r("p", `${S("recipes.source")}: ${e.source_url}`, i), document.body.appendChild(i), window.addEventListener("afterprint", () => i.remove(), { once: !0 });
	try {
		window.print();
	} finally {
		i.remove();
	}
}, Qo = (e, t) => g`<button data-testid="recipe-export-all" @click=${() => Yo(e, t)}>
    ${S("recipes.export_all")}
  </button>`, $o = (e) => g`<button
      type="button"
      data-testid="recipe-export"
      @click=${() => Yo(e.hass, e.onError, e.recipe)}
    >
      ${T(ot)} ${S("recipes.export")}
    </button>
    <button
      type="button"
      data-testid="recipe-print-browser"
      @click=${() => Zo(e.recipe, e.servings, e.ingredients)}
    >
      ${T(vt)} ${S("recipes.print_pdf")}
    </button>`, es = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = H(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${S("recipes.approx", { what: H(e, i * a.factor / s.factor, s.symbol) })})`;
}, ts = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? S("recipes.status.missing_plain") : S("recipes.status.missing", { what: H(e, t.missing ?? 0, n) });
		case "partial": return S("recipes.status.partial", {
			have: B(e, t.have ?? 0),
			need: B(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return S("recipes.status.unknown");
		case "skipped": return S("recipes.status.skipped");
		case "unmatched": return S("recipes.status.unmatched");
		default: return S("recipes.status.available");
	}
}, ns = (e) => {
	let t = e.recipe, n = e.ingredients.map((n) => [
		es(e.hass, e.md, n, e.servings / t.servings),
		e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text,
		n.note ? `(${n.note})` : "",
		n.optional ? `(${S("recipes.optional")})` : ""
	].filter(Boolean).join(" "));
	return g`<div class="detail-box">
    ${t.image_path || t.image_url && R("recipe_images") ? g`<img
            class="photo"
            src=${t.image_path ?? t.image_url}
            alt=${t.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />` : v}
    <label class="servings">
      <span class="lbl"
        >${I(t) ? Q(t.canning_kind, "recipe_jars") : S("recipes.servings")}</span
      >
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
      ${e.ingredients.map((n) => g`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[es(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? g`<span class="detail">${n.note}</span>` : v}
              ${n.optional ? g`<span class="detail">${S("recipes.optional")}</span>` : v}
              ${n.optional && L("diet") && Uo(t.diet, n.text) ? g`<span class="detail" data-testid="ingredient-diet"
                      >${Uo(t.diet, n.text)}</span
                    >` : v}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${ts(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      ${L("shopping") ? g`<button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
              ${S("recipes.to_shopping")}
            </button>` : v}
      ${I(t) ? g`<button type="button" data-testid="recipe-to-canning" @click=${e.onPlan}>
              ${Q(t.canning_kind, "add_title")}
            </button>` : L("plan") ? g`<button type="button" data-testid="recipe-to-plan" @click=${e.onPlan}>
                ${S("recipes.to_plan")}
              </button>` : v}
      ${I(t) ? v : g`<button type="button" data-testid="recipe-cooked" @click=${e.onCooked}>
              ${S("cooked.open")}
            </button>`}
      ${$o({
		hass: e.hass,
		recipe: t,
		servings: e.servings,
		ingredients: n,
		onError: e.onError
	})}
      <home-inventory-receipt-button
        .hass=${e.hass}
        .print=${() => gn(e.hass, t.id, e.servings)}
        .done=${S("recipes.printed")}
        .testid=${"recipe-print"}
      ></home-inventory-receipt-button>
      ${t.shopping_servings != null && L("shopping") ? g`<span class="detail" data-testid="recipe-on-shopping"
              >${S("recipes.on_shopping", { what: Ln(e.hass, t.shopping_servings) })}</span
            >` : v}
    </p>
    ${I(t) ? g`<p data-testid="recipe-canning">
            ${S("canning.recipe_summary", {
		name: t.canning_product ?? "",
		jars: t.servings
	})}
            ${t.canning_temp == null ? "" : `· ${t.canning_temp} °C, ${jo(e.hass, t.canning_kind, t.canning_minutes ?? 0)}`}
          </p>` : v}
    ${t.steps.length ? g`<h3>${S("recipes.instructions")}</h3>
            ${Ro(t.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${e.onCook}>
                ${S("cook.open")}
              </button>
            </p>` : t.instructions ? g`<h3>${S("recipes.instructions")}</h3>
              <p class="text">${t.instructions}</p>` : v}
    ${t.source_url ? g`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${S("recipes.source")}</a
            >
          </p>` : v}
  </div>`;
}, rs = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), is = (e) => e.map((e) => {
	let t = {};
	return rs(e) || (!e.text.trim() && e.category_id == null && (t.text = S("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = S("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? S("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : S("valid.amount_pair"))), t;
}), as = (e, t, n, r) => ({
	name: e.trim() || "-",
	servings: t ?? 1,
	steps: Lo(n),
	ingredients: r.map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.unit_id,
		text: e.text.slice(0, 200),
		note: e.note ?? null,
		line: e.line ?? null,
		learned: !!e.learned
	}))
}), os = (e, t, n, r, i) => {
	let a = [...r.ingredients], o = 0;
	for (let n of e.ingredients) {
		let e = t[n.index], r = a.findIndex((t) => e && t.line === e.line && t.source_text === e.source_text), s = a[r];
		if (!s || s.category_id !== e.category_id || s.unit_id !== e.unit_id) continue;
		let c = "category_id" in n, l = n.unit_id != null || !!n.new_unit, u = i.categories.find((e) => e.id === n.category_id);
		a[r] = {
			...s,
			...c ? {
				category_id: n.category_id ?? null,
				new_type: n.new_type,
				text: n.new_type?.name ?? u?.name ?? s.source_text ?? s.text
			} : {},
			...l ? {
				unit_id: n.unit_id ?? null,
				unit_hint: n.new_unit?.name ?? null
			} : {},
			ai: {
				cat: c,
				unit: l,
				before: e.category_id,
				beforeText: e.text,
				beforeUnit: e.unit_id,
				beforeHint: e.unit_hint ?? null,
				reason: n.reason
			}
		}, o++;
	}
	let s = JSON.stringify(r.steps) === JSON.stringify(n), c = e.steps && s ? Fo(e.steps) : r.steps, l = {
		kind: "changed",
		ingredients: o,
		prevSteps: c === r.steps ? void 0 : r.steps
	};
	return {
		ingredients: a,
		steps: c,
		state: o || l.prevSteps ? l : { kind: "ok" }
	};
}, ss = (e, t) => {
	switch (e.kind) {
		case "running": return g`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${S("recipes.ai.running")}></progress>
        <span>${S("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${t.onSkip}>
          ${S("recipes.ai.skip")}
        </button>
      </div>`;
		case "ok": return g`<p class="ai" role="status" data-testid="ai-status">${S("recipes.ai.ok")}</p>`;
		case "skipped": return g`<p class="ai" role="status" data-testid="ai-status">
        ${S("recipes.ai.skipped")}
      </p>`;
		case "failed": return g`<p class="ai error" role="alert" data-testid="ai-status">${e.message}</p>`;
		case "changed": return g`<div class="ai" role="status" data-testid="ai-status">
        ${e.ingredients ? g`<span
                >${e.ingredients === 1 ? S("recipes.ai.changed_one") : S("recipes.ai.changed_many", { n: e.ingredients })}</span
              >` : v}
        ${e.prevSteps ? g`<span>${S("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${t.onUndoSteps}>
                  ${S("recipes.ai.undo_steps")}
                </button>` : v}
      </div>`;
		default: return v;
	}
}, cs = (e) => {
	let t = e.ai;
	return {
		ai: void 0,
		...t.cat ? {
			category_id: t.before,
			text: t.beforeText,
			new_type: void 0
		} : {},
		...t.unit ? {
			unit_id: t.beforeUnit,
			unit_hint: t.beforeHint
		} : {}
	};
}, ls = (e, t, n, r) => {
	let i = e.ai;
	if (!i) return v;
	let a = n.find((e) => e.id === i.beforeUnit)?.symbol ?? i.beforeHint, o = [i.cat ? i.beforeText : null, i.unit ? a : null].filter(Boolean);
	return g`<div class="orig" data-testid="ingredient-ai">
    ${e.new_type && i.cat ? S("recipes.ai.new_type", {
		name: e.new_type.name,
		parent: t.find((t) => t.id === e.new_type.parent_id)?.name ?? "–",
		reason: i.reason
	}) : S("recipes.ai.changed", {
		reason: i.reason,
		before: o.join(", ") || "–"
	})}
    <button type="button" data-testid="ingredient-ai-undo" @click=${() => r(cs(e))}>
      ${S("recipes.ai.undo")}
    </button>
  </div>`;
}, us = 8, ds = class extends x {
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
			let t = await on(this.hass, e.trim());
			if (this.query !== e) return;
			let n = [];
			for (let e of t) {
				let t = this.foods().find((t) => t.id === e.category_id);
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
			await rn(this.hass, this.creating, e);
			let t = await P(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await N(this.hass, e);
		}
	}
	foods() {
		return this.categories.filter((e) => e.effective.food.value !== 0);
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.foods().filter((t) => V(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, us);
	}
	hit(e) {
		let t = U(this.categories, e.cat.parent_id), n = [e.via ? S("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
		return g`<li>
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
		if (!e) return v;
		let t = this.categories.some((t) => t.name.toLocaleLowerCase() === e.toLocaleLowerCase());
		return g`<ul>
      ${this.hits(e).map((e) => this.hit(e))}
      ${t ? v : g`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => this.creating = e}
              >
                <span>${S("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? g`<div class="lbl">${S("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${S("shopping.add.change")}
          </button>
        </p>` : this.creating ? g`<div class="field">
        <span class="lbl">${S("recipes.ingredient.parent", { name: this.creating })}</span>
        <home-inventory-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></home-inventory-category-picker>
        ${this.failure ? g`<p class="error" role="alert">${this.failure}</p>` : v}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${S("common.cancel")}
        </button>
      </div>` : g`<label>
        <span class="lbl">${S("recipes.ingredient.text")}</span>
        ${this.text ? g`<span class="detail">${this.text} – ${S("recipes.ingredient.unmatched")}</span>` : v}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e) => this.input(e.target.value)}
        />
        ${O(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-ingredient-pick", ds);
// src/unit-add-dialog.ts
var fs = class extends x {
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
				let { id: e } = await En(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await P(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await N(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : S("valid.required");
		return E({
			title: S("unit_add.title"),
			body: g`<label>
          <span class="lbl">${S("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${O(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${S("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: S("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [C];
	}
};
customElements.define("home-inventory-unit-add-dialog", fs);
// src/recipe-ingredients.ts
var ps = class extends x {
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
		this.unitFor = e, this.renderRoot.querySelector("home-inventory-unit-add-dialog").open(t);
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
		let n = this.categories.find((e) => e.id === t), r = this.value[e], i = {
			category_id: t,
			ai: void 0,
			new_type: void 0
		};
		if (!n) i.text = "";
		else if (i.text = n.name, r.unit_id == null && r.amount == null) {
			let e = n.effective.unit_id.value ?? null;
			i.unit_id = this.units.find((t) => t.id === e)?.base_unit_id ?? e;
		}
		this.set(e, i);
	}
	row(e, t, n) {
		let r = !!e.unit_hint && e.unit_id == null;
		return g`<li data-testid="ingredient-row" class="ing">
      <home-inventory-ingredient-pick
        .hass=${this.hass}
        .categories=${this.categories}
        .value=${e.category_id}
        .text=${e.category_id == null ? e.text : ""}
        .error=${n.text}
        @change=${(e) => this.pick(t, e.detail)}
        @master=${(e) => {
			this.categories = e.detail.categories, this.dispatchEvent(new CustomEvent("master", { detail: e.detail }));
		}}
      ></home-inventory-ingredient-pick>
      <div class="line">
        <label>
          <span class="lbl">${S("recipes.ingredient.amount")}</span>
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
			this.set(t, { amount: j(n) });
		}}
          />
        </label>
        <label>
          <span class="lbl">${S("recipes.ingredient.unit")}</span>
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
            <option value="" .selected=${e.unit_id == null}>${S("recipes.ingredient.none")}</option>
            ${this.units.map((t) => g`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${S("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${O(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? g`<div class="hintline">
              ${O(S("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${S("recipes.ingredient.unit_create")}
              </button>
            </div>` : v}
      ${e.line ? g`<div class="orig" data-testid="ingredient-line">
              ${S("recipes.ingredient.line", { line: e.line })}
            </div>` : v}
      ${ls(e, this.categories, this.units, (e) => this.set(t, e))}
      <label>
        <span class="lbl">${S("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${S("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${S("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${S("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${S("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${S("recipes.ingredient.remove")}
          title=${S("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${T(rt)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = is(this.value);
		return g`<home-inventory-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></home-inventory-unit-add-dialog>
      <div class="lbl">${S("recipes.ingredients")}</div>
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
        ${S("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [C, s`
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
customElements.define("home-inventory-recipe-ingredients", ps);
// src/product-input.ts
function ms(e) {
	let t = `${e.testid}-product`, n = e.products.some((t) => t.name === e.name.trim()), r = !!e.name.trim() && !n;
	return g`<label>
      <span class="lbl">${e.label}</span>
      <input
        type="text"
        list=${`${t}s`}
        data-testid=${t}
        aria-invalid=${!!e.err.name}
        .value=${e.name}
        @input=${(t) => e.onName(t.target.value)}
      />
      <datalist id=${`${t}s`}>
        ${e.products.map((e) => g`<option value=${e.name}></option>`)}
      </datalist>
      ${O(e.err.name ?? (r ? S("canning.new_product") : void 0), t, !e.err.name)}
    </label>
    ${r ? g`<div class="field">
            <span class="lbl">${S("book.category")}</span>
            <home-inventory-category-picker
              .categories=${e.md?.categories ?? []}
              .value=${e.categoryId}
              .hass=${e.hass}
              @change=${(t) => e.onCategory(t.detail)}
            ></home-inventory-category-picker>
            ${O(e.err.category, `${t}-category`)}
          </div>` : v}`;
}
// src/recipe-steps-editor.ts
var hs = (e) => e.text.length > (e.kind === "head" ? 100 : 2e3) ? S("valid.too_long", { n: e.kind === "head" ? 100 : Po }) : void 0, gs = class extends x {
	static {
		this.properties = { value: { attribute: !1 } };
	}
	constructor() {
		super(), this.value = [];
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("change", { detail: e }));
	}
	async add(e) {
		this.emit([...this.value, {
			kind: e,
			text: ""
		}]), await this.updateComplete, this.renderRoot.querySelector("li:last-child textarea, li:last-child input")?.focus();
	}
	move(e, t) {
		let n = [...this.value];
		[n[e], n[e + t]] = [n[e + t], n[e]], this.emit(n);
	}
	btn(e, t, n, r, i = !1) {
		return g`<button
      type="button"
      class="icon-btn"
      data-testid=${e}
      aria-label=${t}
      title=${t}
      ?disabled=${i}
      @click=${r}
    >
      ${T(n)}
    </button>`;
	}
	render() {
		let e = 0, t = this.value.length - 1;
		return g`<span class="lbl">${S("recipes.instructions")}</span>
      <ol>
        ${this.value.map((n, r) => {
			let i = n.kind === "head" ? S("recipes.steps.head") : S("recipes.steps.step", { n: ++e }), a = hs(n), o = (e) => this.emit(this.value.map((t, n) => n === r ? {
				...t,
				text: e.target.value
			} : t));
			return g`<li class=${n.kind}>
            <div class="row">
              <span class="no" aria-hidden="true">${n.kind === "head" ? "" : `${e}.`}</span>
              ${n.kind === "head" ? g`<input
                      data-testid="step-head"
                      aria-label=${i}
                      placeholder=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    />` : g`<textarea
                      rows="2"
                      data-testid="step-text"
                      aria-label=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    ></textarea>`}
              ${this.btn("step-up", S("recipes.steps.up"), Ye, () => this.move(r, -1), r === 0)}
              ${this.btn("step-down", S("recipes.steps.down"), Je, () => this.move(r, 1), r === t)}
              ${this.btn("step-remove", S("recipes.steps.remove"), rt, () => this.emit(this.value.filter((e, t) => t !== r)))}
            </div>
            ${O(a, `step-${r}`)}
          </li>`;
		})}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${S("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${S("recipes.steps.head_add")}
        </button>
      </p>`;
	}
	static {
		this.styles = [C, s`
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .row {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        margin: 4px 0;
      }
      .no {
        flex: none;
        width: 2em;
        padding-top: 8px;
        text-align: right;
        color: var(--secondary-text-color);
      }
      textarea,
      input {
        flex: 1;
        min-width: 0;
        font: inherit;
        box-sizing: border-box;
        padding: 8px;
        color: var(--primary-text-color);
        background: var(--card-background-color, var(--primary-background-color));
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      li.head input {
        font-weight: 500;
      }
      .adds {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    `];
	}
};
customElements.define("home-inventory-recipe-steps", gs);
// src/recipe-draft.ts
var _s = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	steps: e?.steps?.length ? Fo(e.steps) : Io(e?.instructions ?? null),
	source_url: e?.source_url ?? "",
	image_url: e?.image_url ?? "",
	product: e && "canning_product" in e && e.canning_product || "",
	product_category: null,
	canning_temp: e?.canning_temp ?? null,
	canning_minutes: e?.canning_minutes ?? null,
	ingredients: (e?.ingredients ?? []).map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.amount == null ? null : e.unit_id,
		text: e.text,
		note: e.note ?? null,
		optional: e.optional,
		skip_stock: e.skip_stock ?? !1,
		line: e.line,
		unit_hint: e.unit_hint,
		source_text: e.source_text ?? null,
		learned: e.learned
	}))
}), vs = (e, t) => {
	let n = t?.find((t) => t.name === e.product.trim());
	return {
		name: e.name.trim(),
		servings: e.servings,
		steps: Lo(e.steps),
		source_url: e.source_url.trim() || null,
		image_url: e.image_url.trim() || null,
		...t ? {
			...n ? { canning_product_id: n.id } : { canning_product: {
				name: e.product.trim(),
				category_id: e.product_category
			} },
			canning_temp: e.canning_temp,
			canning_minutes: e.canning_minutes
		} : {},
		ingredients: e.ingredients.filter((e) => !rs(e)).map((e) => ({
			category_id: e.category_id,
			amount: e.amount,
			unit_id: e.amount == null ? null : e.unit_id,
			optional: e.optional,
			skip_stock: e.skip_stock,
			source_text: e.source_text ?? null,
			note: e.note?.trim() || null,
			...e.category_id == null ? { text: e.text.trim() } : {},
			...e.category_id == null && e.new_type ? { new_type: e.new_type } : {}
		}))
	};
}, ys = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 },
			ai: { state: !0 }
		};
	}
	get canningMode() {
		return !!this.kind;
	}
	constructor() {
		super(), this.aiRun = 0, this.initial = "", this.products = [], this.draft = _s(), this.active = !1, this.error = "", this.ai = { kind: "none" };
	}
	async open(e, t, n, r) {
		this.md = e, this.recipe = t, this.kind = t?.canning_product_id == null ? r : t.canning_kind, r && (this.products = await dn(this.hass).catch(() => [])), this.draft = _s(t ?? n), this.initial = JSON.stringify(n ? _s() : this.draft), this.error = "", this.ai = { kind: "none" }, this.aiRun++, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus(), n && R("ai_recipe_check") && this.check();
	}
	async check() {
		let e = ++this.aiRun, t = this.draft, n = t.ingredients;
		this.ai = { kind: "running" };
		try {
			let r = await wn(this.hass, as(t.name, t.servings, t.steps, n));
			if (e !== this.aiRun) return;
			if (r.status !== "changes") {
				this.ai = { kind: r.status === "ok" ? "ok" : "none" };
				return;
			}
			let i = os(r, n, t.steps, this.draft, this.md);
			this.draft = {
				...this.draft,
				ingredients: i.ingredients,
				steps: i.steps
			}, this.ai = i.state;
		} catch (t) {
			e === this.aiRun && (this.ai = {
				kind: "failed",
				message: await N(this.hass, t)
			});
		}
	}
	errors() {
		let e = this.draft, t = {};
		e.name.trim() || (t.name = S("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = S("valid.servings")), e.source_url.trim() && !Jt.test(e.source_url.trim()) && (t.source_url = S("valid.url")), e.image_url.trim() && !Jt.test(e.image_url.trim()) && (t.image_url = S("valid.url")), this.canningMode && !e.product.trim() ? t.product = S("valid.required") : this.canningMode && !this.products.some((t) => t.name === e.product.trim()) && e.product_category == null && (t.product_category = S("valid.category"));
		let n = e.canning_temp, r = e.canning_minutes;
		return n != null && !(Number.isInteger(n) && n >= 1 && n <= 200) ? t.canning_temp = S("valid.canning_temp") : n == null && r != null && (t.canning_temp = S("valid.required")), r != null && !(Number.isInteger(r) && r >= 1 && r <= 1440) ? t.canning_minutes = S("valid.canning_minutes") : r == null && n != null && (t.canning_minutes = S("valid.required")), {
			e: t,
			bad: is(e.ingredients).some((e) => Object.keys(e).length) || e.steps.some((e) => hs(e))
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await Sn(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				...vs(r, this.canningMode ? this.products : null),
				...this.kind ? { canning_kind: this.kind } : {}
			});
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	text(e, t, n, r = "text") {
		return g`<label>
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
      ${O(n, e === "name" ? "recipe-name" : `recipe-${e}`)}
    </label>`;
	}
	canning(e, t, n) {
		return e === "canning_minutes" ? Mo({
			kind: this.kind,
			testid: "recipe-canning_minutes",
			minutes: this.draft.canning_minutes,
			err: n,
			onChange: (e) => this.draft = {
				...this.draft,
				canning_minutes: e
			}
		}) : Oo({
			testid: `recipe-${e}`,
			label: S(`recipes.field.${e}`),
			unit: t,
			value: this.draft[e],
			err: n,
			onChange: (t) => this.draft = {
				...this.draft,
				[e]: t
			}
		});
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let { e, bad: t } = this.errors(), n = this.draft;
		return E({
			title: this.recipe ? S("common.edit_name", { name: this.recipe.name }) : this.kind ? Q(this.kind, "recipe_add") : S("recipes.add"),
			body: g`${ss(this.ai, {
				onSkip: () => {
					this.aiRun++, this.ai = { kind: "skipped" };
				},
				onUndoSteps: () => {
					this.ai.kind === "changed" && this.ai.prevSteps && (this.draft = {
						...this.draft,
						steps: this.ai.prevSteps
					}, this.ai = {
						...this.ai,
						prevSteps: void 0
					});
				}
			})}
        ${this.text("name", S("common.name"), e.name)}
        ${this.canningMode ? ms({
				testid: "recipe",
				label: S("canning.recipe_makes"),
				hass: this.hass,
				md: this.md,
				products: this.products,
				name: n.product,
				categoryId: n.product_category,
				err: {
					name: e.product,
					category: e.product_category
				},
				onName: (e) => this.draft = {
					...this.draft,
					product: e
				},
				onCategory: (e) => this.draft = {
					...this.draft,
					product_category: e
				}
			}) : v}
        <label>
          <span class="lbl"
            >${this.kind ? Q(this.kind, "recipe_jars") : S("recipes.servings")}</span
          >
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
					servings: j(t)
				};
			}}
          />
          ${O(e.servings, "recipe-servings-input")}
        </label>
        ${this.canningMode ? g`<div class="pair">
                ${this.canning("canning_temp", "°C", e.canning_temp)}
                ${this.canning("canning_minutes", S("recipes.minutes_unit"), e.canning_minutes)}
              </div>` : v}
        ${this.text("source_url", S("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", S("recipes.field.image_url"), e.image_url, "url")}
        <home-inventory-recipe-ingredients
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
        ></home-inventory-recipe-ingredients>
        <home-inventory-recipe-steps
          .value=${n.steps}
          @change=${(e) => this.draft = {
				...n,
				steps: e.detail
			}}
        ></home-inventory-recipe-steps>`,
			error: this.error,
			invalid: Object.keys(e).length > 0 || t || this.ai.kind === "running",
			submit: {
				label: S("common.save"),
				testid: "recipe-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => {
				this.active = !1, this.aiRun++;
			}
		});
	}
	static {
		this.styles = [C, It];
	}
};
customElements.define("home-inventory-recipe-dialog", ys);
// src/recipe-import.ts
var bs = [
	"url",
	"text",
	"photo"
], xs = () => bs.filter((e) => R(e === "url" ? "recipe_url" : "ai_import")), Ss = 2e4, Cs = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			active: { state: !0 },
			source: { state: !0 },
			url: { state: !0 },
			text: { state: !0 },
			photo: { state: !0 },
			busy: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.active = !1, this.source = "url", this.url = "", this.text = "", this.photo = "", this.busy = !1, this.error = "";
	}
	async open() {
		this.source = xs()[0] ?? "url", this.url = this.text = this.photo = "", this.error = "", this.busy = !1, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.focusField();
	}
	async focusField() {
		await this.updateComplete, this.renderRoot.querySelector("dialog input, dialog textarea")?.focus();
	}
	errors() {
		if (this.source === "text") return this.text.trim() ? void 0 : S("valid.required");
		if (this.source === "photo") return this.photo ? void 0 : S("valid.required");
		let e = this.url.trim();
		return e ? Jt.test(e) ? void 0 : S("valid.url") : S("valid.required");
	}
	request() {
		return this.source === "text" ? { text: this.text.trim() } : this.source === "photo" ? { image: this.photo } : { url: this.url.trim() };
	}
	async takePhoto() {
		let e = await this.renderRoot.querySelector("home-inventory-camera").take(!1);
		e && (this.photo = e);
	}
	async pickPhoto(e) {
		let t = e.target.files?.[0];
		if (this.photo = "", this.error = "", t) try {
			this.photo = await Yi(t);
		} catch {
			this.error = S("recipes.import.photo_invalid");
		}
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await Cn(this.hass, this.request());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-imported", { detail: e }));
			} catch (e) {
				this.error = await N(this.hass, e);
			}
			this.busy = !1;
		}
	}
	switcher() {
		return g`<div class="sources" role="group" aria-label=${S("recipes.import.source")}>
      ${xs().map((e) => g`<button
            type="button"
            data-testid=${`recipe-import-source-${e}`}
            aria-pressed=${e === this.source}
            ?disabled=${this.busy}
            @click=${() => {
			this.source = e, this.error = "", this.focusField();
		}}
          >
            ${S(`recipes.import.source_${e}`)}
          </button>`)}
    </div>`;
	}
	field(e) {
		return this.source === "text" ? g`<label>
        <span class="lbl">${S("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${Ss}
          data-testid="recipe-import-text"
          aria-invalid=${!!e}
          .value=${this.text}
          @input=${(e) => this.text = e.target.value}
        ></textarea>
        ${O(e, "recipe-import-text")}
        <span class="note">${S("recipes.import.text_hint")}</span>
      </label>` : this.source === "photo" ? g`<button
          type="button"
          class="take"
          data-testid="recipe-import-camera"
          ?disabled=${this.busy}
          @click=${() => this.takePhoto()}
        >
          ${T(Qe)} ${S("recipes.import.take_photo")}
        </button>
        <label>
          <span class="lbl">${S("recipes.import.photo")}</span>
          <input
            type="file"
            accept="image/*"
            data-testid="recipe-import-photo"
            aria-invalid=${!!e}
            @change=${(e) => this.pickPhoto(e)}
          />
          ${O(e, "recipe-import-photo")}
          <span class="note">${S("recipes.import.photo_hint")}</span>
        </label>
        ${this.photo ? g`<img class="preview" src=${this.photo} alt=${S("recipes.import.photo")} />` : v}` : g`<label>
      <span class="lbl">${S("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!e}
        .value=${this.url}
        @input=${(e) => this.url = e.target.value}
      />
      ${O(e, "recipe-import-url")}
      <span class="note"
        >${S(R("ai_import") ? "recipes.import.hint_ai" : "recipes.import.hint")}</span
      >
    </label>`;
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors();
		return g`${E({
			title: S("recipes.import.title"),
			body: g`${xs().length > 1 ? this.switcher() : v} ${this.field(e)}
        ${this.busy ? g`<div class="busy" role="status" data-testid="recipe-import-busy">
                <progress aria-label=${S("recipes.import.busy")}></progress>
                <span
                  >${S(R("ai_import") ? "recipes.import.busy_ai" : "recipes.import.busy")}</span
                >
              </div>` : v}`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: S("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [C, s`
      .take {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 12px;
      }
      .preview {
        display: block;
        max-width: 100%;
        max-height: 30vh;
        margin-top: 12px;
      }
      .note {
        display: block;
        margin-top: 4px;
        font-size: 0.875em;
        color: var(--secondary-text-color);
      }
      .sources {
        display: flex;
        margin-bottom: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: hidden;
      }
      .sources button {
        flex: 1;
        padding: 6px 8px;
        border: 0;
        border-radius: 0;
        background: none;
        color: var(--primary-text-color);
        font: inherit;
      }
      .sources button + button {
        border-left: 1px solid var(--divider-color);
      }
      .sources button[aria-pressed="true"] {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .sources button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -4px;
      }
      textarea {
        resize: vertical;
      }
      .busy {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
        color: var(--secondary-text-color);
      }
      .busy progress {
        flex: none;
        width: 64px;
      }
    `];
	}
};
customElements.define("home-inventory-recipe-import", Cs);
// src/api-plan.ts
var ws = (e, t, n) => e.callWS({
	type: "home_inventory/meal_plan",
	start: t,
	end: n
}), Ts = (e, t) => e.callWS({
	type: "home_inventory/meal_save",
	data: t
}), Es = (e, t) => e.callWS({
	type: "home_inventory/meal_delete",
	meal_id: t
}), Ds = (e, t, n, r) => e.callWS({
	type: "home_inventory/meal_shift",
	day: t,
	slot: n,
	apply: r
}), Os = (e, t, n) => e.callWS({
	type: "home_inventory/plan_to_shopping_list",
	start: t,
	end: n
}), ks = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.recipes = [], this.initial = "", this.draft = {
			day: "",
			slot: 3,
			text: "",
			servings: 1,
			dateBad: !1
		}, this.active = !1, this.error = "";
	}
	async open(e, t, n, r, i, a = "") {
		this.recipes = n.filter((e) => !I(e)), this.meal = i, this.draft = {
			day: i?.day ?? e,
			slot: i?.slot ?? t,
			text: i?.name ?? a,
			servings: i?.servings ?? r,
			dateBad: !1
		}, this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.text.trim() || (t.text = S("valid.required")), (!e.day || A(e.dateBad, e.day)) && (t.day = S("valid.date")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = S("valid.servings")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.text.trim();
		try {
			await Ts(this.hass, {
				...this.meal ? { id: this.meal.id } : {},
				day: t.day,
				slot: t.slot,
				recipe_id: this.recipes.find((e) => e.name === n)?.id ?? null,
				text: n,
				servings: t.servings
			});
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors(), t = this.draft;
		return E({
			title: this.meal ? S("common.edit_name", { name: this.meal.name }) : S("plan.add"),
			body: g`<label>
          <span class="lbl">${S("plan.date")}</span>
          <input
            type="date"
            min="2000-01-01"
            max="2099-12-31"
            data-testid="meal-day"
            aria-invalid=${!!e.day}
            .value=${t.day}
            @input=${(e) => {
				let n = e.target;
				this.draft = {
					...t,
					day: n.value,
					dateBad: n.validity.badInput
				};
			}}
          />
          ${O(e.day, "meal-day")}
        </label>
        <label>
          <span class="lbl">${S("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(t.slot)}
            @change=${(e) => this.draft = {
				...t,
				slot: Number(e.target.value)
			}}
          >
            ${Li.map((e) => g`<option value=${e} ?selected=${e === t.slot}>${S(`plan.slot.${e}`)}</option>`)}
          </select>
        </label>
        <label>
          <span class="lbl">${S("plan.dish")}</span>
          <input
            type="text"
            list="meal-recipes"
            data-testid="meal-text"
            aria-invalid=${!!e.text}
            .value=${t.text}
            @input=${(e) => this.draft = {
				...t,
				text: e.target.value
			}}
          />
          <datalist id="meal-recipes">
            ${this.recipes.map((e) => g`<option value=${e.name}></option>`)}
          </datalist>
          ${O(e.text, "meal-text")}
        </label>
        <label>
          <span class="lbl">${S("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="meal-servings"
            aria-invalid=${!!e.servings}
            .value=${String(t.servings ?? "")}
            @input=${(e) => this.draft = {
				...t,
				servings: j(e.target.value)
			}}
          />
          ${O(e.servings, "meal-servings")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: S("common.save"),
				testid: "meal-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-meal-dialog", ks);
// src/cooked-row.ts
var $ = (e) => e.src.candidates.find((t) => t.product_id === e.product_id), As = (e) => ({
	product_id: e.product_id,
	batch_id: e.batch_id,
	packages: e.packages,
	open: e.open,
	used_up: e.used_up,
	remaining: e.remaining ?? null,
	action: e.action
}), js = (e) => !e.opened && !e.frozen, Ms = (e) => e.reduce((e, t) => e + t.packages, 0), Ns = (e) => e.action === "open" ? $(e).batches.filter(js) : e.action === "reduce" ? $(e).batches.filter((e) => e.opened) : $(e).batches, Ps = (e) => {
	let t = $(e).batches.filter((e) => e.opened), n = t.filter((e) => e.remaining < 1).sort((e, t) => Number(e.expires_on == null) - Number(t.expires_on == null) || (e.expires_on ?? "").localeCompare(t.expires_on ?? "") || e.remaining - t.remaining);
	return n.length ? n : t.slice(0, 1);
}, Fs = (e) => $(e).batches.find((t) => t.opened && t.batch_id === e.batch_id) ?? Ps(e)[e.packages ?? 0], Is = (e) => {
	let t = Ps(e);
	return Math.max(0, e.batch_id == null ? t.length - 1 : t.length - +t.some((t) => t.batch_id === e.batch_id));
}, Ls = (e) => {
	if (!e.checked || e.action === "skip") return;
	if (e.action === "reduce") {
		let t = Fs(e);
		if (!t) return S("cooked.no_opened");
		if (e.packages == null || !Number.isInteger(e.packages) || e.packages < 0) return S("valid.packages_zero");
		let n = Is(e);
		return e.packages > n ? S("valid.max_packages", { n }) : e.remaining == null || e.remaining >= t.remaining - 1e-9 ? S("valid.level_below") : void 0;
	}
	let t = e.packages, n = t === 0 && !(e.action === "out" && e.open > 0);
	if (t == null || !Number.isInteger(t) || t < 0 || n) return S("valid.packages");
	let r = Ms(Ns(e).filter((t) => e.batch_id == null || t.batch_id === e.batch_id));
	if (t > r) return S("valid.max_packages", { n: r });
	let i = Ms($(e).batches.filter(js));
	if (e.action === "out" && t + e.open > i) return S("valid.max_packages", { n: i });
}, Rs = (e, t, n, r, i) => g`<label>
    <span class="lbl">${e}</span>
    <select
      data-testid=${t}
      .value=${n}
      @change=${(e) => i(e.target.value)}
    >
      ${r.map(([e, t]) => g`<option value=${e} ?selected=${e === n}>${t}</option>`)}
    </select>
  </label>`, zs = (e, t) => {
	let n = [
		t.expires_on ? z(e, t.expires_on) : S("cooked.no_date"),
		t.location,
		S("cooked.pkg", { n: t.packages })
	];
	return t.opened && n.push(S("cooked.opened")), t.frozen && n.push(S("cooked.frozen")), n.join(", ");
}, Bs = (e) => {
	let { r: t, err: n, change: r } = e, i = t.src, a = [i.amount == null ? "" : H(e.hass, i.amount, i.unit_symbol), i.text].filter(Boolean).join(" "), o = Ns(t).map((t) => [String(t.batch_id), zs(e.hass, t)]);
	return g`<li class="crow" data-testid="cooked-row">
    <label class="check">
      <input
        type="checkbox"
        data-testid="cooked-check"
        .checked=${t.checked}
        @change=${(e) => r({ checked: e.target.checked })}
      />
      <span
        >${a}${i.optional ? g` <span class="detail">${S("recipes.optional")}</span>` : v}</span
      >
    </label>
    <div class="ctl">
      ${Rs(S("cooked.product"), "cooked-product", String(t.product_id), i.candidates.map((e) => [String(e.product_id), e.brand ? `${e.name} (${e.brand})` : e.name]), (e) => r(As(i.candidates.find((t) => String(t.product_id) === e))))}
      ${Rs(S("cooked.batch"), "cooked-batch", t.batch_id == null ? "" : String(t.batch_id), [["", S("cooked.fefo")], ...o], (e) => r({ batch_id: e === "" ? null : Number(e) }))}
      ${t.action === "reduce" && Is(t) < 1 ? v : g`<label class="pk">
              <span class="lbl"
                >${t.action === "reduce" ? S("cooked.used_up") : S("cooked.packages")}</span
              >
              <input
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                data-testid="cooked-packages"
                aria-invalid=${!!n}
                .value=${String(t.packages ?? "")}
                @input=${(e) => {
		let t = e.target.value;
		r({ packages: t === "" ? null : Number(t) });
	}}
              />
            </label>`}
      ${Rs(S("cooked.action"), "cooked-action", t.action, [
		"out",
		"open",
		"reduce",
		"skip"
	].map((e) => [e, S(`cooked.action.${e}`)]), (e) => {
		let n = e, i = n !== "open" && n !== "reduce" || $(t).batches.some((e) => e.batch_id === t.batch_id && (n === "open" ? js(e) : e.opened)), a = {
			...t,
			action: n,
			batch_id: i ? t.batch_id : null,
			packages: n === "reduce" ? 0 : t.packages
		}, o = n === "reduce" ? Fs(a) : void 0;
		r({
			...t.action === "reduce" && n !== "reduce" ? As($(t)) : {},
			action: n,
			...n === "reduce" ? { packages: 0 } : {},
			...i ? {} : { batch_id: null },
			...o ? { remaining: $r(o.remaining) } : {}
		});
	})}
    </div>
    ${t.action === "out" ? g`<label class="check also">
            <input
              type="checkbox"
              data-testid="cooked-also-open"
              .checked=${t.open > 0}
              @change=${(e) => r({ open: +!!e.target.checked })}
            />
            ${S("cooked.also_open")}
          </label>` : v}
    ${t.action === "reduce" || t.action === "open" || t.action === "out" && t.open > 0 ? g`<label class="lvl">
            <span class="lbl">${S("cooked.left_after")}</span>
            ${ni({
		value: t.remaining ?? 1,
		empty: t.action === "reduce",
		label: S("cooked.left_after"),
		testid: "cooked-level",
		on: (e) => r({ remaining: e })
	})}
          </label>` : v}
    ${O(n, "cooked-packages")}
  </li>`;
}, Vs = s`
  .crow {
    display: block;
    padding: 8px 0;
  }
  .ctl {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 6px 0 0 24px;
  }
  .ctl label {
    display: flex;
    flex-direction: column;
    flex: 1 1 160px;
    min-width: 0;
  }
  .ctl .pk {
    flex: 0 0 90px;
  }
  .also,
  .lvl {
    margin: 6px 0 0 24px;
  }
  .lvl {
    display: flex;
    flex-direction: column;
    max-width: 160px;
  }
  select,
  input[type="number"] {
    font: inherit;
    min-width: 0;
    box-sizing: border-box;
    width: 100%;
  }
`, Hs = (e) => e.callWS({ type: "home_inventory/cannings" }), Us = (e, t) => e.callWS({
	type: "home_inventory/canning_save",
	data: t
}), Ws = (e, t) => e.callWS({
	type: "home_inventory/leftover_store",
	...t
}), Gs = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipe: { attribute: !1 },
			servings: { state: !0 },
			locationId: { state: !0 },
			stored: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.dflt = () => W(this.md, this.md?.leftover_category_id, "default_location_id"), this.servings = 1, this.locationId = null, this.error = "";
	}
	async connectedCallback() {
		super.connectedCallback();
		try {
			this.md = await P(this.hass), this.requestUpdate();
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	err() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? S("valid.packages") : "";
	}
	async store() {
		if (!this.err() && this.recipe) try {
			let e = await Ws(this.hass, {
				recipe_id: this.recipe.id,
				servings: this.servings,
				location_id: this.locationId
			});
			this.stored = {
				...e,
				jars: this.servings
			}, this.error = "", this.dispatchEvent(new CustomEvent("home-inventory-leftovers-stored", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	labels() {
		let e = this.stored;
		this.renderRoot.querySelector("home-inventory-label-dialog").open({
			id: e.batch_id,
			name: e.name,
			packages: e.jars
		}, e.jars);
	}
	render() {
		let e = g`<home-inventory-label-dialog
      .hass=${this.hass}
    ></home-inventory-label-dialog>`;
		if (this.stored) return g`${q(S("leftovers.stored", { charge: this.stored.charge }), void 0, "leftover", g`<button
          type="button"
          class="undo"
          data-testid="leftover-label"
          @click=${() => this.labels()}
        >
          ${S("label.print")}
        </button>`)}
      ${e}`;
		let t = this.err();
		return g`<div class="store">
        <label>
          <span class="lbl">${S("leftovers.jars")}</span>
          <input
            type="number"
            min="1"
            max="99"
            data-testid="leftover-servings"
            aria-invalid=${!!t}
            .value=${String(this.servings ?? "")}
            @keydown=${(e) => e.key === "Enter" && this.store()}
            @input=${(e) => {
			let t = e.target.value;
			this.servings = t === "" ? null : Number(t);
		}}
          />
          ${O(t, "leftover-servings")}
        </label>
        <label>
          <span class="lbl">${S("book.location")}</span>
          ${G({
			testid: "leftover-location",
			own: this.locationId,
			dflt: this.dflt(),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			onChange: (e) => this.locationId = e
		})}
        </label>
        <button
          type="button"
          data-testid="leftover-store"
          ?disabled=${!!t}
          @click=${() => this.store()}
        >
          ${S("leftovers.store")}
        </button>
      </div>
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}`;
	}
	static {
		this.styles = [
			C,
			J,
			s`
      .store {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 8px;
      }
    `
		];
	}
};
customElements.define("home-inventory-leftover-store", Gs);
// src/api-cooked.ts
var Ks = (e, t, n) => e.callWS({
	type: "home_inventory/cooked_proposal",
	recipe_id: t,
	servings: n
}), qs = (e, t) => e.callWS({
	type: "home_inventory/cooked_book",
	items: t
}), Js = (e, t) => e.callWS({
	type: "home_inventory/cooked_undo",
	out_ids: t.out_ids,
	open_ids: t.open_ids,
	remaining_ids: t.remaining_ids
}), Ys = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipe: { state: !0 },
			rows: { state: !0 },
			result: { state: !0 },
			stored: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.dirty = !1, this.rows = [], this.stored = !1, this.active = !1, this.error = "";
	}
	async open(e, t) {
		this.error = "", this.result = void 0, this.stored = !1, this.dirty = !1;
		try {
			let n = await Ks(this.hass, e.id, t);
			this.rows = n.map((e) => ({
				src: e,
				checked: e.checked,
				...As(e.candidates.find((t) => t.product_id === e.product_id))
			}));
		} catch (e) {
			this.rows = [], this.error = await N(this.hass, e);
		}
		this.recipe = e, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal();
	}
	change(e, t) {
		this.dirty = !0, this.rows = this.rows.map((n, r) => r === e ? {
			...n,
			...t
		} : n);
	}
	errors() {
		let e = {};
		return this.rows.forEach((t, n) => {
			let r = Ls(t);
			r && (e[n] = r);
		}), e;
	}
	items() {
		return this.rows.filter((e) => e.checked && e.action !== "skip").map((e) => ({
			product_id: e.product_id,
			batch_id: e.batch_id,
			packages: e.packages ?? 0,
			action: e.action,
			open: e.action === "out" ? e.open : 0,
			used_up: e.action === "out" && e.batch_id == null ? Math.min(e.used_up, e.packages ?? 0) : 0,
			remaining: e.action === "reduce" ? e.remaining : e.action === "open" || e.open ? e.remaining ?? 1 : null
		}));
	}
	saved() {
		this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	async save(e) {
		e.preventDefault();
		let t = this.items();
		if (t.length && !Object.keys(this.errors()).length) {
			try {
				this.result = await qs(this.hass, t);
			} catch (e) {
				this.error = await N(this.hass, e);
				return;
			}
			this.error = "", this.dirty = !1, this.saved();
		}
	}
	async undo() {
		try {
			await Js(this.hass, this.result);
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		this.result = void 0, this.saved(), this.renderRoot.querySelector("dialog")?.close();
	}
	summary() {
		return this.result.bookings.map((e) => S(`cooked.done_${e.action}`, {
			n: e.packages,
			name: e.name
		})).join(", ");
	}
	render() {
		if (!this.active || !this.recipe) return g`<dialog></dialog>`;
		let e = this.errors(), t = !!this.result;
		return E({
			title: S("cooked.title", { name: this.recipe.name }),
			body: t ? g`${q(S("cooked.done", { what: this.summary() }), this.stored ? void 0 : () => this.undo(), "cooked")}
          ${L("leftovers") ? g`<home-inventory-leftover-store
                  .hass=${this.hass}
                  .recipe=${this.recipe}
                  @home-inventory-leftovers-stored=${() => this.stored = !0}
                ></home-inventory-leftover-store>` : v}` : this.rows.length ? g`<p class="detail">${S("cooked.hint")}</p>
              <ul>
                ${this.rows.map((t, n) => Bs({
				hass: this.hass,
				r: t,
				err: e[n],
				change: (e) => this.change(n, e)
			}))}
              </ul>` : g`<p class="empty" data-testid="cooked-empty">${S("cooked.empty")}</p>`,
			error: this.error,
			invalid: t || !this.items().length || Object.keys(e).length > 0,
			submit: {
				label: S("cooked.submit"),
				testid: "cooked-save"
			},
			hideSubmit: t,
			cancel: t ? S("common.close") : void 0,
			dirty: () => this.dirty,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [
			C,
			J,
			Vs,
			s`
      dialog {
        width: min(720px, calc(100vw - 32px));
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
      }
    `
		];
	}
};
customElements.define("home-inventory-cooked-dialog", Ys);
// src/cook-mode.ts
var Xs = (e) => {
	let t = Math.max(0, Math.ceil(e / 1e3)), n = Math.floor(t / 3600), r = String(Math.floor(t % 3600 / 60)).padStart(n ? 2 : 1, "0"), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${r}:${i}` : `${r}:${i}`;
}, Zs = () => {
	navigator.vibrate?.([
		300,
		200,
		300,
		200,
		300
	]);
	try {
		let e = new AudioContext();
		for (let t = 0; t < 3; t++) {
			let n = e.createOscillator();
			n.frequency.value = 880, n.connect(e.destination), n.start(e.currentTime + t * .4), n.stop(e.currentTime + t * .4 + .25);
		}
	} catch {}
}, Qs = class extends x {
	static {
		this.properties = {
			active: { state: !0 },
			done: { state: !0 },
			timers: { state: !0 },
			now: { state: !0 }
		};
	}
	constructor() {
		super(), this.ingredients = [], this.servings = 1, this.relock = () => {
			document.visibilityState === "visible" && this.active && this.keepOn();
		}, this.active = !1, this.done = /* @__PURE__ */ new Set(), this.timers = [], this.now = Date.now();
	}
	async open(e, t, n, r, i) {
		Object.assign(this, {
			hass: e,
			md: t,
			recipe: n,
			ingredients: r,
			servings: i
		}), this.done = /* @__PURE__ */ new Set(), this.timers = [], this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.keepOn(), document.addEventListener("visibilitychange", this.relock);
	}
	async keepOn() {
		try {
			this.lock = await navigator.wakeLock?.request("screen");
		} catch {}
	}
	closed() {
		this.active = !1, window.clearInterval(this.tick), this.tick = void 0, this.lock?.release(), this.lock = void 0, document.removeEventListener("visibilitychange", this.relock);
	}
	async close() {
		(!this.timers.some((e) => e.end > Date.now()) || await w({
			title: S("cook.stop"),
			action: S("cook.stop_ok")
		})) && this.renderRoot.querySelector("dialog")?.close();
	}
	start(e, t, n) {
		let r = `${e}:${t}`;
		this.timers = [...this.timers.filter((e) => e.key !== r), {
			key: r,
			label: t,
			step: e,
			end: Date.now() + n * 1e3
		}], this.tick ??= window.setInterval(() => this.onTick(), 500), this.now = Date.now();
	}
	onTick() {
		let e = this.now;
		this.now = Date.now(), this.timers.some((t) => t.end <= this.now && t.end > e) && Zs();
	}
	toggle(e) {
		let t = new Set(this.done);
		t.delete(e) || t.add(e), this.done = t;
	}
	step(e, t) {
		return g`<button
        type="button"
        class="step ${this.done.has(t) ? "done" : ""}"
        data-testid="cook-step"
        aria-pressed=${this.done.has(t)}
        @click=${() => this.toggle(t)}
      >
        <span class="no">${t + 1}.</span>${e.text}
      </button>
      ${(e.timers ?? []).map((e) => g`<button
            type="button"
            class="timer-btn"
            data-testid="cook-timer-start"
            aria-label=${S("cook.timer_start", { what: e.label })}
            @click=${() => this.start(t, e.label, e.seconds)}
          >
            ${T(Et)} ${e.label}
          </button>`)}`;
	}
	render() {
		if (!this.active || !this.recipe) return g`<dialog></dialog>`;
		let e = this.recipe, t = this.servings / e.servings;
		return g`<dialog
      @close=${() => this.closed()}
      @cancel=${(e) => {
			e.preventDefault(), this.close();
		}}
    >
      <header>
        <h2>${S("cook.title", { name: e.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${S("cook.close")}
          title=${S("cook.close")}
          @click=${() => this.close()}
        >
          ${T(rt)}
        </button>
      </header>
      <h3>${S("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map((e) => g`<li>
              ${[es(this.hass, this.md, e, t), this.md.categories.find((t) => t.id === e.category_id)?.name ?? e.text].filter(Boolean).join(" ")}
              ${e.note ? g`<span class="detail">${e.note}</span>` : v}
            </li>`)}
      </ul>
      <h3>${S("recipes.instructions")}</h3>
      <p class="detail">${S("cook.hint")}</p>
      ${Ro(e.steps, (e, t) => this.step(e, t))}
      ${this.timers.length ? g`<div class="timers" role="status">
              ${this.timers.map((e) => {
			let t = e.end - this.now;
			return g`<span class="timer ${t <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${S("cook.timer", {
				n: e.step + 1,
				what: e.label
			})}:
                  <strong>${t > 0 ? Xs(t) : S("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${S("cook.timer_cancel")}
                    title=${S("cook.timer_cancel")}
                    @click=${() => this.timers = this.timers.filter((t) => t !== e)}
                  >
                    ${T(rt)}
                  </button>
                </span>`;
		})}
            </div>` : v}
      <p>
        <button type="button" data-testid="cook-cooked" @click=${() => this.cooked()}>
          ${S("cooked.open")}
        </button>
      </p>
      <home-inventory-cooked-dialog></home-inventory-cooked-dialog>
    </dialog>`;
	}
	cooked() {
		let e = this.renderRoot.querySelector("home-inventory-cooked-dialog");
		e.hass = this.hass, e.open(this.recipe, this.servings);
	}
	static {
		this.styles = [C, s`
      dialog {
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        margin: 0;
        box-sizing: border-box;
        padding: 16px 16px 96px;
        border: none;
        overflow-y: auto;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      h2 {
        margin: 0;
      }
      h3,
      h4 {
        margin: 16px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .ings,
      ol {
        max-width: 720px;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .no {
        display: inline-block;
        min-width: 1.6em;
        font-weight: 500;
      }
      .ings li {
        padding: 2px 0;
      }
      ol li {
        margin: 8px 0;
      }
      .step {
        display: block;
        width: 100%;
        text-align: left;
        font: inherit;
        font-size: 1.1em;
        line-height: 1.5;
        padding: 6px 8px;
        color: var(--primary-text-color);
        background: none;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
      }
      .step.done {
        color: var(--secondary-text-color);
        text-decoration: line-through;
      }
      .timer-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: 2px 8px 0 8px;
      }
      .timers {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        padding: 8px 16px;
        background: var(--card-background-color, var(--primary-background-color));
        border-top: 1px solid var(--divider-color);
      }
      .timer {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .timer.over strong {
        color: var(--error-color);
      }
      .detail {
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-cook-mode", Qs);
// src/recipes-view.ts
var $s = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			section: { attribute: !1 },
			canning: { attribute: !1 },
			recipes: { state: !0 },
			md: { state: !0 },
			query: { state: !0 },
			expiring: { state: !0 },
			onlyExpiring: { state: !0 },
			diet: { state: !0 },
			open: { state: !0 },
			servings: { state: !0 },
			scaled: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.query = "", this.expiring = /* @__PURE__ */ new Map(), this.onlyExpiring = !1, this.diet = zo(), this.open = /* @__PURE__ */ new Set(), this.servings = /* @__PURE__ */ new Map(), this.scaled = /* @__PURE__ */ new Map(), this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load()) : e.has("section") && this.recipes && this.reveal();
	}
	async reveal() {
		let e = Number(this.section);
		this.recipes?.some((t) => t.id === e) && (this.query = "", this.open = new Set(this.open).add(e), await this.updateComplete, this.renderRoot.querySelector(`[data-recipe-id="${e}"]`)?.scrollIntoView({ block: "start" }));
	}
	async load() {
		try {
			let [e, t, n] = await Promise.all([
				yn(this.hass),
				P(this.hass),
				bn(this.hass)
			]);
			[this.recipes, this.md] = [e, t], this.expiring = new Map(n.map((e) => [e.recipe_id, e.used])), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await N(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus(), await this.reveal();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await xn(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await Lr(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await yn(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	edit(e) {
		this.renderRoot.querySelector("home-inventory-recipe-dialog").open(this.md, e, void 0, this.canning);
	}
	importer() {
		return this.renderRoot.querySelector("home-inventory-recipe-import");
	}
	shown() {
		let e = this.query.trim();
		return (this.recipes ?? []).filter((t) => I(t) === !!this.canning && (!this.canning || t.canning_kind === this.canning) && (!this.onlyExpiring || this.expiring.has(t.id)) && Vo(t, this.diet) && (!e || V(t.name, e) || t.ingredients.some((t) => V(t.text, e))));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = Kt(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return g`<li class="recipe" data-testid="recipe-row" data-recipe-id=${e.id}>
      <div class="head">
        ${Gt(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${S("recipes.summary", e.summary)} ·
            ${I(e) ? S("canning.recipe_summary", {
			name: e.canning_product ?? "",
			jars: e.servings
		}) : Ln(this.hass, e.servings)}${this.expiring.has(e.id) ? g` ·
                    <span class="soon" data-testid="recipe-expiring"
                      >${S("recipes.expiring", { n: this.expiring.get(e.id) })}</span
                    >` : v}</span
          >
          ${L("diet") && !I(e) ? g`<span>${Wo(e)}</span>` : v}
        </button>
        ${D({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: M(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? ns({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onError: (e) => this.error = e,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e),
			onPlan: () => I(e) ? this.dispatchEvent(new CustomEvent("home-inventory-canning-start", {
				detail: e.id,
				bubbles: !0,
				composed: !0
			})) : this.renderRoot.querySelector("home-inventory-meal-dialog").open(k(), 3, this.recipes, r, void 0, e.name),
			onCooked: () => {
				let t = this.renderRoot.querySelector("home-inventory-cooked-dialog");
				t.hass = this.hass, t.open(e, r);
			},
			onCook: () => this.renderRoot.querySelector("home-inventory-cook-mode").open(this.hass, this.md, e, this.scaled.get(e.id) ?? e.ingredients, r)
		}) : v}
    </li>`;
	}
	render() {
		let e = this.error ? g`<p class="error" role="alert">${this.error}</p>` : v;
		if (!this.recipes || !this.md) return e;
		let t = this.shown();
		return g`${e}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${S("recipes.search")}
          placeholder=${S("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        ${xs().length ? g`<button data-testid="recipe-import" @click=${() => this.importer().open()}>
                ${S("recipes.import.open")}
              </button>` : v}
        ${Qo(this.hass, (e) => this.error = e)}
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${this.canning ? Q(this.canning, "recipe_add") : S("recipes.add")}
        </button>
      </div>
      ${this.expiring.size ? g`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e) => this.onlyExpiring = e.target.checked}
              />
              ${S("recipes.expiring_only")}
            </label>` : v}
      ${L("diet") && !this.canning ? Go(this.diet, (e) => this.diet = e) : v}
      <home-inventory-recipe-import
        .hass=${this.hass}
        @home-inventory-imported=${(e) => this.renderRoot.querySelector("home-inventory-recipe-dialog").open(this.md, void 0, e.detail, this.canning)}
      ></home-inventory-recipe-import>
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.refreshShopping()}
      ></home-inventory-shopping-recipe-dialog>
      <home-inventory-meal-dialog .hass=${this.hass}></home-inventory-meal-dialog>
      <home-inventory-cook-mode></home-inventory-cook-mode>
      <home-inventory-cooked-dialog></home-inventory-cooked-dialog>
      <home-inventory-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
        @master=${(e) => this.md = e.detail}
      >
      </home-inventory-recipe-dialog>
      ${t.length ? g`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : g`<p class="empty">
              ${this.query.trim() ? S("recipes.no_hits") : this.canning ? Q(this.canning, "recipes_empty") : S("recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [C, No];
	}
};
customElements.define("home-inventory-recipes", $s);
// src/plan-shift.ts
var ec = (e, t) => g`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${S("plan.shift")}
    title=${S("plan.shift")}
    @click=${() => e.shift(t)}
  >
    ${T(Ze)}
  </button>`;
async function tc(e, t) {
	let { meals: n } = await Ds(e, t.day, t.slot, !1), r = new Intl.DateTimeFormat(Hi(e), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	});
	return await w({
		title: S("plan.shift_title", { slot: S(`plan.slot.${t.slot}`) }),
		body: g`<ul class="impact" data-testid="shift-list">
      ${n.map((e) => {
			let t = X(e.day);
			return g`<li>${r.format(t)} ${e.name} → ${r.format(X(Y(Z(t, 1))))}</li>`;
		})}
    </ul>`,
		action: S("plan.shift_ok")
	}) ? (await Ds(e, t.day, t.slot, !0), !0) : !1;
}
// src/plan-day.ts
function nc(e, t) {
	let n = Y(t);
	return g`<div data-testid="plan-day" data-day=${n}>
    ${Li.map((t) => g`<section data-testid="plan-cell" data-slot=${t}>
          <div class="head">
            <h3>${S(`plan.slot.${t}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${S("plan.add")}
              title=${S("plan.add")}
              @click=${() => e.add(n, t)}
            >
              ${T(_t)}
            </button>
          </div>
          <ul>
            ${e.meals.filter((e) => e.day === n && e.slot === t).map((t) => g`<li data-testid="plan-meal">
                    <button
                      type="button"
                      class="row"
                      data-testid="plan-meal-open"
                      @click=${() => e.open(t)}
                    >
                      ${t.name} · ${Ln(e.hass, t.servings)}
                    </button>
                    ${ec(e, t)}
                    ${D({
		testid: "plan-meal",
		name: t.name,
		onEdit: () => e.edit(t),
		onDelete: () => e.remove(t)
	})}
                  </li>`)}
          </ul>
        </section>`)}
  </div>`;
}
var rc = s`
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }
  h3 {
    margin: 0;
    font-size: 1em;
    font-weight: 500;
  }
`, ic = "(max-width: 600px)", ac = (e, t) => g`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => e.open(t)}>
      ${t.name}
    </button>
    <span class="sec">${Ln(e.hass, t.servings)}</span>
    ${ec(e, t)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${S("common.edit_name", { name: t.name })}
      title=${S("common.edit_name", { name: t.name })}
      @click=${() => e.edit(t)}
    >
      ${T(gt)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${S("common.delete_name", { name: t.name })}
      title=${S("common.delete_name", { name: t.name })}
      @click=${() => e.remove(t)}
    >
      ${T(at)}
    </button>
  </div>`, oc = (e, t, n, r) => g`<button
    class="icon-btn quiet"
    data-testid=${r}
    aria-label=${S("plan.add")}
    title=${S("plan.add")}
    @click=${() => e.add(t, n)}
  >
    ${T(_t)}
  </button>`, sc = (e, t, n) => g`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => e.openDay(t)}
  >
    ${n.format(t)}
  </button>`, cc = (e) => [
	0,
	1,
	2,
	3,
	4,
	5,
	6
].map((t) => Z(e, t)), lc = (e, t, n) => e.meals.filter((e) => e.day === t && e.slot === n);
function uc(e, t, n) {
	let r = new Intl.DateTimeFormat(Hi(e.hass), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	}), i = Y(/* @__PURE__ */ new Date());
	return n ? g`<div data-testid="plan-week">
      ${cc(t).map((t) => {
		let n = Y(t);
		return g`<section class="daybox" data-testid="plan-day" data-day=${n}>
          <h3 class=${n === i ? "today" : ""}>
            ${sc(e, t, r)} ${oc(e, n, 3, "plan-add-day")}
          </h3>
          ${Li.filter((t) => lc(e, n, t).length).map((t) => g`<div class="slotline" data-testid="plan-cell" data-slot=${t}>
                <span class="slot">${S(`plan.slot.${t}`)}</span>
                <div>${lc(e, n, t).map((t) => ac(e, t))}</div>
              </div>`)}
        </section>`;
	})}
    </div>` : g`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${cc(t).map((t) => g`<th scope="col" class=${Y(t) === i ? "today" : ""}>
              ${sc(e, t, r)}
            </th>`)}
      </tr>
    </thead>
    <tbody>
      ${Li.map((n) => g`<tr>
            <th scope="row">${S(`plan.slot.${n}`)}</th>
            ${cc(t).map((t) => {
		let r = Y(t);
		return g`<td data-testid="plan-day" data-day=${r}>
                <div data-testid="plan-cell" data-slot=${n}>
                  ${lc(e, r, n).map((t) => ac(e, t))} ${oc(e, r, n, "plan-add")}
                </div>
              </td>`;
	})}
          </tr>`)}
    </tbody>
  </table>`;
}
var dc = s`
  /* fixed layout: every day column gets the same width, whatever the dish names */
  table.week {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
  }
  table.week th,
  table.week td {
    border: 1px solid var(--divider-color);
    padding: 4px 6px;
    vertical-align: top;
    text-align: left;
    overflow-wrap: anywhere;
  }
  table.week .slotcol {
    width: 7em;
  }
  table.week th {
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  table.week th.today,
  .daybox h3.today {
    font-weight: 700;
    color: var(--primary-text-color);
  }
  /* name on its own line, servings and the icons below it: the name gets the cell's width */
  .dish {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 2px;
    padding: 2px 0;
  }
  .dish .open {
    flex: 1 0 100%;
    min-width: 0;
    text-align: left;
    border: none;
    background: none;
    padding: 4px 2px;
    color: var(--primary-text-color);
    font: inherit;
    cursor: pointer;
  }
  .sec {
    flex: 1;
    padding-left: 2px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  .daylink {
    border: none;
    background: none;
    padding: 2px 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
  }
  .daylink:hover {
    text-decoration: underline;
  }
  .quiet {
    color: var(--secondary-text-color);
  }
  .daybox {
    border-bottom: 1px solid var(--divider-color);
    padding: 4px 0;
  }
  .daybox h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    font-size: 1em;
    font-weight: 400;
  }
  .slotline {
    display: grid;
    grid-template-columns: 6.5em 1fr;
    padding-left: 6px;
  }
  .slot {
    padding-top: 6px;
    color: var(--secondary-text-color);
    font-size: 0.875em;
  }
`, fc = [
	kt,
	At,
	it,
	Ot,
	st
];
function pc(e, t, n, r) {
	let i = Hi(e.hass), a = new Intl.DateTimeFormat(i, { weekday: "short" }), o = new Intl.DateTimeFormat(i, { dateStyle: "full" }), s = Y(/* @__PURE__ */ new Date());
	return g`<div class="month" data-testid="plan-month">
    ${[
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((e) => g`<div class="wd">${a.format(Z(t, e))}</div>`)}
    ${Array.from({ length: n * 7 }, (e, n) => Z(t, n)).map((t) => {
		let n = Y(t), i = e.meals.filter((e) => e.day === n);
		return g`<button
        type="button"
        class="cell ${t.getMonth() === r ? "" : "dim"} ${n === s ? "today" : ""}"
        data-testid="plan-month-day"
        data-day=${n}
        aria-label=${o.format(t)}
        @click=${() => e.openDay(t)}
      >
        <span class="num">${t.getDate()}</span>
        <span class="icons">
          ${Li.filter((e) => i.some((t) => t.slot === e)).map((e) => {
			let t = S(`plan.slot.${e}`);
			return g`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${e}
              aria-label=${t}
              title=${[t, ...i.filter((t) => t.slot === e).map((e) => e.name)].join("\n")}
              >${T(fc[e])}</span
            >`;
		})}
        </span>
      </button>`;
	})}
  </div>`;
}
var mc = s`
  .month {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-top: 1px solid var(--divider-color);
    border-left: 1px solid var(--divider-color);
  }
  .wd {
    padding: 4px;
    text-align: center;
    font-size: 0.875em;
    color: var(--secondary-text-color);
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .cell {
    min-height: 56px;
    padding: 4px;
    border: none;
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    border-radius: 0;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .cell.dim {
    color: var(--secondary-text-color);
    opacity: 0.55;
  }
  .cell.today .num {
    font-weight: 700;
  }
  .num {
    display: block;
  }
  .icons {
    display: flex;
    flex-wrap: wrap;
  }
  .icons svg {
    width: 14px;
    height: 14px;
    fill: var(--secondary-text-color);
  }
`, hc = 366, gc = (e, t) => Math.round((X(t).getTime() - X(e).getTime()) / 864e5), _c = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			from: { state: !0 },
			to: { state: !0 },
			bad: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.from = this.to = "", this.bad = {
			from: !1,
			to: !1
		}, this.active = !1, this.error = "";
	}
	async open() {
		this.from = k(), this.to = Y(Z(X(this.from), 6)), this.bad = {
			from: !1,
			to: !1
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = {};
		return (!this.from || A(this.bad.from, this.from)) && (e.from = S("valid.date")), !this.to || A(this.bad.to, this.to) ? e.to = S("valid.date") : !e.from && this.to < this.from ? e.to = S("plan.shop.order") : !e.from && gc(this.from, this.to) >= hc && (e.to = S("plan.shop.long", { max: hc })), e;
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) try {
			let e = await Os(this.hass, this.from, this.to);
			this.renderRoot.querySelector("dialog")?.close();
			let t = e.recipes.length ? S("plan.shop.done", { recipes: e.recipes.map((e) => `${e.name} (${e.servings})`).join(", ") }) : S("plan.shop.none");
			this.dispatchEvent(new CustomEvent("home-inventory-shopped", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	field(e, t, n) {
		return g`<label>
      <span class="lbl">${t}</span>
      <input
        type="date"
        min="2000-01-01"
        max="2099-12-31"
        data-testid=${`plan-shop-${e}`}
        aria-invalid=${!!n}
        .value=${this[e]}
        @input=${(t) => {
			let n = t.target;
			this[e] = n.value, this.bad = {
				...this.bad,
				[e]: n.validity.badInput
			};
		}}
      />
      ${O(n, `plan-shop-${e}`)}
    </label>`;
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors();
		return E({
			title: S("plan.shop.title"),
			body: g`<p class="hint">${S("plan.shop.hint")}</p>
        ${this.field("from", S("plan.shop.from"), e.from)}
        ${this.field("to", S("plan.shop.to"), e.to)}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: S("plan.shop.submit"),
				testid: "plan-shop-save"
			},
			dirty: () => !1,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-plan-shopping-dialog", _c);
// src/plan-view.ts
var vc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			section: { attribute: !1 },
			date: { state: !0 },
			meals: { state: !0 },
			household: { state: !0 },
			recipes: { state: !0 },
			error: { state: !0 },
			note: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.narrow.addEventListener("change", this.onNarrow);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.narrow.removeEventListener("change", this.onNarrow);
	}
	constructor() {
		super(), this.started = !1, this.narrow = window.matchMedia(ic), this.onNarrow = () => this.requestUpdate(), this.date = /* @__PURE__ */ new Date(), this.meals = [], this.household = 1, this.recipes = [], this.error = "", this.note = "";
	}
	get view() {
		return Ii.includes(this.section) ? this.section : "week";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load(), yn(this.hass).then((e) => this.recipes = e, () => void 0)) : e.has("section") && this.started && this.load();
	}
	async load() {
		let [e, t] = Bi(this.view, this.date);
		try {
			let n = await ws(this.hass, Y(e), Y(t));
			this.meals = n.meals, this.household = n.household_servings, this.error = "";
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	go(e) {
		this.date = e, this.load();
	}
	nav(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: `plan/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	dialog() {
		return this.renderRoot.querySelector("home-inventory-meal-dialog");
	}
	async act(e) {
		try {
			await e();
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		await this.load();
	}
	ctx() {
		return {
			hass: this.hass,
			meals: this.meals,
			add: (e, t) => this.dialog().open(e, t, this.recipes, this.household),
			edit: (e) => this.dialog().open(e.day, e.slot, this.recipes, this.household, e),
			remove: async (e) => {
				await zt(e.name) && await this.act(() => Es(this.hass, e.id));
			},
			open: (e) => e.recipe_id == null ? this.dialog().open(e.day, e.slot, this.recipes, this.household, e) : this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
				detail: `recipes/${e.recipe_id}`,
				bubbles: !0,
				composed: !0
			})),
			shift: (e) => this.act(() => tc(this.hass, e)),
			openDay: (e) => {
				this.date = e, this.nav("day");
			}
		};
	}
	label() {
		let e = Hi(this.hass), t = this.date;
		if (this.view === "day") return new Intl.DateTimeFormat(e, { dateStyle: "full" }).format(t);
		if (this.view === "month") return new Intl.DateTimeFormat(e, {
			month: "long",
			year: "numeric"
		}).format(t);
		let [n, r] = Bi("week", t);
		return new Intl.DateTimeFormat(e, { dateStyle: "medium" }).formatRange(n, new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1));
	}
	body() {
		let e = this.ctx(), [t, n] = Bi(this.view, this.date);
		return this.view === "day" ? nc(e, this.date) : this.view === "week" ? uc(e, t, this.narrow.matches) : pc(e, t, Math.round((n.getTime() - t.getTime()) / 6048e5), this.date.getMonth());
	}
	render() {
		let e = this.view;
		return g`${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      ${this.note ? g`<p class="note" role="status" data-testid="plan-shop-note">${this.note}</p>` : v}
      <nav aria-label=${S("plan.view.label")}>
        ${Ii.map((t) => g`<button
              data-testid=${`plan-view-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => t === "day" ? this.ctx().openDay(/* @__PURE__ */ new Date()) : this.nav(t)}
            >
              ${S(`plan.view.${t}`)}
            </button>`)}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${S("plan.prev")}
          title=${S("plan.prev")}
          @click=${() => this.go(Vi(e, this.date, -1))}
        >
          ${T(et)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(/* @__PURE__ */ new Date())}>
          ${S("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${S("plan.next")}
          title=${S("plan.next")}
          @click=${() => this.go(Vi(e, this.date, 1))}
        >
          ${T(tt)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        <button
          data-testid="plan-shop"
          @click=${() => this.renderRoot.querySelector("home-inventory-plan-shopping-dialog").open()}
        >
          ${S("plan.shop")}
        </button>
        ${e === "month" ? v : g`<home-inventory-receipt-button
                .hass=${this.hass}
                .print=${() => _n(this.hass, Y(Bi(e, this.date)[0]), e === "day" ? 1 : 7)}
                .done=${S("plan.printed")}
                .testid=${"plan-print"}
              ></home-inventory-receipt-button>`}
      </div>
      ${this.body()}
      <home-inventory-plan-shopping-dialog
        .hass=${this.hass}
        @home-inventory-shopped=${(e) => this.note = e.detail}
      ></home-inventory-plan-shopping-dialog>
      <home-inventory-meal-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-meal-dialog>`;
	}
	static {
		this.styles = [
			C,
			s`
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
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .note {
        color: var(--secondary-text-color);
        margin: 0 0 8px;
      }
      .range {
        color: var(--secondary-text-color);
      }
    `,
			rc,
			dc,
			mc
		];
	}
};
customElements.define("home-inventory-plan", vc);
// src/canning-new-fields.ts
function yc(e) {
	let t = e.draft, n = e.e;
	if (e.canning) return g`<p class="detail" data-testid="canning-fixed">
      ${Q(e.kind, "fixed", {
		charge: e.canning.charge,
		name: t.name,
		jars: t.jars ?? ""
	})}
    </p>`;
	let r = e.recipes.find((e) => e.id === t.recipe_id);
	return g`<label>
      <span class="lbl">${Q(e.kind, "recipe")}</span>
      <select
        data-testid="canning-recipe"
        @change=${(t) => {
		let n = t.target.value;
		e.pickRecipe(n ? Number(n) : null);
	}}
      >
        <option value="" .selected=${t.recipe_id == null}>${S("common.none")}</option>
        ${e.recipes.map((e) => g`<option value=${e.id} .selected=${e.id === t.recipe_id}>${e.name}</option>`)}
      </select>
    </label>
    ${e.madeOn}
    ${r ? g`<p class="detail" data-testid="canning-recipe-product">
            ${Q(e.kind, "recipe_product", { name: r.canning_product ?? "" })}
          </p>` : ms({
		testid: "canning",
		label: S("canning.product"),
		hass: e.hass,
		md: e.md,
		products: e.products,
		name: t.name,
		categoryId: t.category_id,
		err: n,
		onName: (t) => e.set({ name: t }),
		onCategory: (t) => e.set({ category_id: t })
	})}
    ${e.jars}
    <label>
      <span class="lbl">${S("book.location")}</span>
      ${G({
		testid: "canning-location",
		own: t.location_id,
		dflt: e.location,
		options: (e.md?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!n.location,
		onChange: (t) => e.set({ location_id: t })
	})}
      ${O(n.location, "canning-location")}
    </label>`;
}
// src/canning-dialog.ts
var bc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = [], this.recipes = [], this.kind = "canning", this.initial = "", this.draft = this.blank(), this.active = !1, this.error = "";
	}
	blank() {
		return {
			made_on: k(),
			name: "",
			category_id: null,
			recipe_id: null,
			jars: 1,
			location_id: null,
			expires_on: "",
			temp: null,
			minutes: null,
			notes: "",
			dateBad: !1
		};
	}
	async open(e, t, n, r, i, a) {
		this.md = e, this.products = t, this.kind = i?.kind ?? r, this.recipes = n.filter((e) => I(e) && e.canning_kind === this.kind), this.canning = i, this.draft = i ? {
			...this.blank(),
			made_on: i.made_on,
			name: i.name,
			recipe_id: i.recipe_id,
			jars: i.jars,
			expires_on: i.expires_on ?? "",
			temp: i.temp,
			minutes: i.minutes,
			notes: i.notes
		} : this.blank(), a != null && this.pickRecipe(a), this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input, dialog select")?.focus();
	}
	product(e = this.draft) {
		return this.products.find((t) => t.name === e.name.trim());
	}
	dflt(e, t = this.draft) {
		let n = this.product(t);
		return n?.[e] == null ? W(this.md, n ? n.category_id : t.category_id, e) : {
			value: n[e],
			source: S("book.from_product")
		};
	}
	proposal(e) {
		let t = this.dflt("shelf_days", e);
		return t && e.made_on ? Ri(e.made_on, Number(t.value)) : "";
	}
	set(e) {
		let t = {
			...this.draft,
			...e
		};
		!this.canning && this.draft.expires_on === this.proposal(this.draft) && (t.expires_on = this.proposal(t)), this.draft = t;
	}
	pickRecipe(e) {
		let t = this.recipes.find((t) => t.id === e);
		this.set(t ? {
			recipe_id: e,
			name: t.canning_product ?? "",
			jars: t.servings,
			temp: t.canning_temp,
			minutes: t.canning_minutes
		} : { recipe_id: null });
	}
	errors() {
		let e = this.draft, t = {};
		return this.canning || ((!e.made_on || A(e.dateBad, e.made_on)) && (t.made_on = S("valid.date")), e.name.trim() ? !this.product() && e.category_id == null && (t.category = S("valid.category")) : t.name = S("valid.required"), (e.jars == null || !Number.isInteger(e.jars) || e.jars < 1 || e.jars > 9999) && (t.jars = S("valid.packages")), !this.dflt("default_location_id") && e.location_id == null && (t.location = S("valid.location"))), e.temp != null && !(Number.isInteger(e.temp) && e.temp >= 1 && e.temp <= 200) && (t.temp = S("valid.canning_temp")), e.minutes != null && !(Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440) && (t.minutes = S("valid.canning_minutes")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = {
			recipe_id: t.recipe_id,
			temp: t.temp,
			minutes: t.minutes,
			notes: t.notes.trim() || null,
			expires_on: t.expires_on || null
		}, r = this.product();
		try {
			let e = await Us(this.hass, this.canning ? {
				id: this.canning.id,
				...n
			} : {
				...n,
				made_on: t.made_on,
				jars: t.jars,
				kind: this.kind,
				location_id: t.location_id,
				...r ? { product_id: r.id } : { product: {
					name: t.name.trim(),
					category_id: t.category_id
				} }
			});
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				detail: this.canning ? void 0 : {
					...e,
					name: t.name.trim(),
					jars: t.jars
				},
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	num(e, t, n, r) {
		return Oo({
			testid: `canning-${e}`,
			label: t,
			unit: n,
			value: this.draft[e],
			err: r,
			onChange: (t) => this.set({ [e]: t })
		});
	}
	date(e, t, n) {
		return ko({
			testid: `canning-${e}`,
			label: t,
			value: this.draft[e],
			err: n,
			onChange: (t, n) => this.set({
				[e]: t,
				dateBad: n
			})
		});
	}
	newFields(e) {
		return yc({
			kind: this.kind,
			canning: this.canning,
			draft: this.draft,
			recipes: this.recipes,
			hass: this.hass,
			md: this.md,
			products: this.products,
			e,
			location: this.dflt("default_location_id"),
			set: (e) => this.set(e),
			pickRecipe: (e) => this.pickRecipe(e),
			madeOn: this.date("made_on", S("canning.made_on"), e.made_on),
			jars: this.num("jars", Q(this.kind, "jars"), "", e.jars)
		});
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.dflt("shelf_days") : void 0;
		return E({
			title: this.canning ? S("common.edit_name", { name: this.canning.charge }) : Q(this.kind, "add_title"),
			body: g`${this.newFields(e)} ${this.date("expires_on", S("canning.expires_on"))}
        ${n ? g`<span class="detail">${S("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : v}
        <div class="pair">
          ${this.num("temp", S("recipes.field.canning_temp"), "°C", e.temp)}
          ${Mo({
				kind: this.kind,
				testid: "canning-minutes",
				minutes: t.minutes,
				err: e.minutes,
				onChange: (e) => this.set({ minutes: e })
			})}
        </div>
        <label>
          <span class="lbl">${S("canning.notes")}</span>
          <textarea
            rows="3"
            data-testid="canning-notes"
            .value=${t.notes}
            @input=${(e) => this.set({ notes: e.target.value })}
          ></textarea>
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: S("common.save"),
				testid: "canning-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-canning-dialog", bc);
// src/leftover-dialog.ts
var xc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.recipes = [], this.initial = "", this.cat = (e) => W(this.md, this.md?.leftover_category_id, e), this.draft = this.blank(), this.active = !1, this.error = "";
	}
	blank() {
		return {
			made_on: k(),
			dish: "",
			servings: 1,
			location_id: null,
			expires_on: "",
			notes: "",
			madeBad: !1,
			expiresBad: !1
		};
	}
	async open(e, t, n) {
		this.md = e, this.recipes = t.filter((e) => !I(e)), this.canning = n, this.draft = n ? {
			...this.blank(),
			made_on: n.made_on,
			dish: n.name,
			servings: n.jars,
			expires_on: n.expires_on ?? "",
			notes: n.notes
		} : this.blank(), n || (this.draft.expires_on = this.proposal(this.draft)), this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input, dialog select")?.focus();
	}
	days(e) {
		let t = e.location_id ?? Number(this.cat("default_location_id")?.value), n = L("frozen") && this.md?.locations.find((e) => e.id === t)?.freezer;
		return this.cat(n ? "frozen_days" : "shelf_days");
	}
	proposal(e) {
		let t = this.days(e);
		return t && e.made_on ? Ri(e.made_on, Number(t.value)) : "";
	}
	set(e) {
		let t = {
			...this.draft,
			...e
		};
		!this.canning && !("expires_on" in e) && this.draft.expires_on === this.proposal(this.draft) && (t.expires_on = this.proposal(t)), this.draft = t;
	}
	errors() {
		let e = this.draft, t = {};
		return A(e.expiresBad, e.expires_on) && (t.expires_on = S("valid.date")), this.canning || ((!e.made_on || A(e.madeBad, e.made_on)) && (t.made_on = S("valid.date")), e.dish.trim() || (t.dish = S("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = S("valid.packages")), !this.cat("default_location_id") && e.location_id == null && (t.location = S("valid.location"))), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.notes.trim() || null, r = t.expires_on || null, i = t.dish.trim(), a = this.recipes.find((e) => e.name === i);
		try {
			let e = this.canning ? await Us(this.hass, {
				id: this.canning.id,
				recipe_id: this.canning.recipe_id,
				expires_on: r,
				notes: n
			}) : await Ws(this.hass, {
				...a ? { recipe_id: a.id } : { dish: i },
				servings: t.servings,
				made_on: t.made_on,
				location_id: t.location_id,
				expires_on: r,
				notes: n
			});
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				detail: this.canning ? void 0 : {
					...e,
					jars: t.servings
				},
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	newFields(e) {
		let t = this.draft;
		return this.canning ? g`<p class="detail" data-testid="leftover-fixed">
        ${S("leftovers.fixed", {
			charge: this.canning.charge,
			name: t.dish,
			jars: t.servings ?? ""
		})}
      </p>` : g`<label>
        <span class="lbl">${S("leftovers.dish")}</span>
        <input
          list="leftover-dishes"
          data-testid="leftover-dish"
          aria-invalid=${!!e.dish}
          .value=${t.dish}
          @input=${(e) => this.set({ dish: e.target.value })}
        />
        <datalist id="leftover-dishes">
          ${this.recipes.map((e) => g`<option value=${e.name}></option>`)}
        </datalist>
        ${O(e.dish, "leftover-dish")}
      </label>
      ${ko({
			testid: "leftover-made_on",
			label: S("canning.made_on"),
			value: t.made_on,
			err: e.made_on,
			onChange: (e, t) => this.set({
				made_on: e,
				madeBad: t
			})
		})}
      ${Oo({
			testid: "leftover-servings",
			label: S("leftovers.jars"),
			unit: "",
			value: t.servings,
			err: e.servings,
			onChange: (e) => this.set({ servings: e })
		})}
      <label>
        <span class="lbl">${S("book.location")}</span>
        ${G({
			testid: "leftover-location",
			own: t.location_id,
			dflt: this.cat("default_location_id"),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			invalid: !!e.location,
			onChange: (e) => this.set({ location_id: e })
		})}
        ${O(e.location, "leftover-location")}
      </label>`;
	}
	render() {
		if (!this.active) return g`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.days(t) : void 0;
		return E({
			title: this.canning ? S("common.edit_name", { name: this.canning.charge }) : S("leftovers.add_title"),
			body: g`${this.newFields(e)}
        ${ko({
				testid: "leftover-expires_on",
				label: S("canning.expires_on"),
				value: t.expires_on,
				err: e.expires_on,
				onChange: (e, t) => this.set({
					expires_on: e,
					expiresBad: t
				})
			})}
        ${n ? g`<span class="detail">${S("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : v}
        <label>
          <span class="lbl">${S("canning.notes")}</span>
          <textarea
            rows="3"
            data-testid="leftover-notes"
            .value=${t.notes}
            @input=${(e) => this.set({ notes: e.target.value })}
          ></textarea>
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: S("common.save"),
				testid: "leftover-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = C;
	}
};
customElements.define("home-inventory-leftover-dialog", xc);
// src/canning-view.ts
var Sc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			section: { attribute: !1 },
			rows: { state: !0 },
			message: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = [], this.recipes = [], this.started = !1, this.message = "", this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load()) : e.has("section") && this.started && this.load();
	}
	get kind() {
		let e = Ao();
		return this.section === "leftovers" ? "leftover" : this.section?.startsWith("drying") ? "drying" : e.includes("canning") ? "canning" : e[0] ?? "canning";
	}
	get recipesShown() {
		return this.section === "recipes" || this.section === "drying-recipes";
	}
	route(e, t) {
		return e === "leftover" ? "canning/leftovers" : e === "drying" ? t ? "canning/drying-recipes" : "canning/drying" : t ? "canning/recipes" : "canning";
	}
	nav(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	async start(e) {
		this.nav(this.route(this.kind, !1)), await this.load(), this.edit(void 0, e.detail);
	}
	async load() {
		try {
			[this.rows, this.md, this.products, this.recipes] = await Promise.all([
				Hs(this.hass),
				P(this.hass),
				dn(this.hass),
				yn(this.hass)
			]), this.error = "";
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	edit(e, t) {
		if (this.message = "", (e?.kind ?? this.kind) === "leftover") return this.renderRoot.querySelector("home-inventory-leftover-dialog").open(this.md, this.recipes, e);
		this.renderRoot.querySelector("home-inventory-canning-dialog").open(this.md, this.products, this.recipes, this.kind, e, t);
	}
	async removeCanning(e) {
		this.error = "";
		try {
			if (!await Lr(this.hass, this.md, "canning", {
				id: e.id,
				name: e.charge
			})) return;
		} catch (e) {
			this.error = await N(this.hass, e);
			return;
		}
		await this.load();
	}
	async saved(e) {
		await this.load();
		let t = e.detail;
		t && (this.message = S("canning.saved", { charge: t.charge }), this.renderRoot.querySelector("home-inventory-label-dialog").open({
			id: t.batch_id,
			name: t.name,
			packages: t.jars
		}, t.jars));
	}
	detail(e) {
		return [
			Q(e.kind, "jars_left", {
				jars: e.jars,
				left: e.in_stock
			}),
			e.expires_on ? S("canning.until", { date: z(this.hass, e.expires_on) }) : "",
			e.temp == null ? "" : `${e.temp} °C`,
			e.minutes == null ? "" : jo(this.hass, e.kind, e.minutes),
			e.recipe ?? ""
		].filter(Boolean).join(" · ");
	}
	protocols() {
		if (!this.rows) return v;
		let e = this.rows.filter((e) => e.kind === this.kind);
		return g`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${this.kind === "leftover" ? S("leftovers.add_title") : S("canning.add")}
        </button>
      </div>
      ${this.message ? g`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : v}
      ${e.length ? g`<ul>
              ${e.map((e) => g`<li data-testid="canning-row" data-charge=${e.charge}>
                    <button type="button" class="row" @click=${() => this.edit(e)}>
                      <span>${e.charge} · ${e.name}</span>
                      <span class="detail">${this.detail(e)}</span>
                      ${e.notes ? g`<span class="detail">${e.notes}</span>` : v}
                    </button>
                    ${D({
			testid: "canning",
			name: e.charge,
			onEdit: () => this.edit(e),
			onDelete: M(this.hass) ? () => this.removeCanning(e) : void 0
		})}
                  </li>`)}
            </ul>` : g`<p class="empty">${Q(this.kind, "empty")}</p>`}`;
	}
	render() {
		let e = this.kind, t = this.recipesShown && e !== "leftover", n = Ao();
		return g`${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      ${n.length > 1 ? g`<nav aria-label=${S("preserve.kind_label")}>
              ${n.map((n) => g`<button
                    data-testid=${`preserve-${n}`}
                    aria-current=${n === e ? "page" : "false"}
                    @click=${() => this.nav(this.route(n, t))}
                  >
                    ${S(`preserve.${n}`)}
                  </button>`)}
            </nav>` : v}
      ${e === "leftover" ? v : g`<nav aria-label=${S("canning.view.label")}>
              ${["protocols", "recipes"].map((n) => g`<button
                    data-testid=${`canning-view-${n}`}
                    aria-current=${n === "recipes" === t ? "page" : "false"}
                    @click=${() => this.nav(this.route(e, n === "recipes"))}
                  >
                    ${S(`canning.view.${n}`)}
                  </button>`)}
            </nav>`}
      <div @home-inventory-canning-start=${this.start}>
        ${t ? g`<home-inventory-recipes .hass=${this.hass} .canning=${e}></home-inventory-recipes>` : this.protocols()}
      </div>
      <home-inventory-canning-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-canning-dialog>
      <home-inventory-leftover-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-leftover-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => e.detail && (this.message = S("label.printed", { n: e.detail }))}
      ></home-inventory-label-dialog>`;
	}
	static {
		this.styles = [C, s`
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
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
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
      .row {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
    `];
	}
};
customElements.define("home-inventory-canning", Sc);
// src/api-stocktake.ts
var Cc = (e, t, n) => e.callWS({
	type: "home_inventory/stocktake_scan",
	location_id: t,
	code: n
}), wc = (e, t) => e.callWS({
	type: "home_inventory/stocktake_apply",
	...t
}), Tc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { state: !0 },
			location: { state: !0 },
			rows: { state: !0 },
			counted: { state: !0 },
			extra: { state: !0 },
			pick: { state: !0 },
			query: { state: !0 },
			message: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.location = null, this.rows = [], this.counted = /* @__PURE__ */ new Map(), this.extra = [], this.query = "", this.message = "", this.error = "";
	}
	willUpdate() {
		this.hass && !this.started && (this.started = !0, P(this.hass).then((e) => this.md = e, async (e) => this.error = await N(this.hass, e)));
	}
	async choose(e) {
		this.location = e, this.counted = /* @__PURE__ */ new Map(), this.extra = [], this.pick = void 0, this.error = "", this.rows = e ? (await F(this.hass)).filter((t) => t.location_id === e) : [], await this.updateComplete, this.renderRoot.querySelector("home-inventory-booking-scan")?.focusInput();
	}
	count(e, t) {
		let n = Math.max(0, (this.counted.get(e) ?? 0) + t);
		this.counted = new Map(this.counted).set(e, n);
	}
	addExtra(e, t) {
		let n = this.extra.findIndex((t) => t.product_id === e.product_id);
		if (n < 0) {
			t > 0 && (this.extra = [...this.extra, {
				product_id: e.product_id,
				name: e.name,
				packages: 1,
				expires_on: e.shelf_date ?? ""
			}]);
			return;
		}
		let r = this.extra[n].packages + t;
		this.extra = r ? this.extra.map((e, t) => t === n ? {
			...e,
			packages: r
		} : e) : this.extra.filter((e, t) => t !== n);
	}
	async find(e) {
		if (e.trim() && this.location) {
			this.error = this.message = "";
			try {
				if (Ar(e)) {
					let t = await jr(this.hass, e);
					if (this.query = "", t) return void this.choose(t.id);
					this.error = S("location_label.unknown");
					return;
				}
				let t = await Cc(this.hass, this.location, e.trim()), n = t.batches.filter((e) => this.rows.some((t) => t.batch_id === e.batch_id));
				n.length === 1 ? this.count(n[0].batch_id, 1) : n.length > 1 ? this.pick = {
					...t,
					batches: n
				} : this.addExtra(t, 1), this.query = "";
			} catch (e) {
				this.error = await N(this.hass, e);
			}
		}
	}
	batchLabel(e) {
		let t = e.expires_on ? z(this.hass, e.expires_on) : S("stock.no_date");
		return e.charge ? S("stock.charge", {
			date: t,
			charge: e.charge
		}) : t;
	}
	diffs() {
		let e = 0, t = 0;
		for (let n of this.rows) {
			let r = (this.counted.get(n.batch_id) ?? 0) - n.packages;
			r < 0 ? e -= r : t += r;
		}
		for (let e of this.extra) t += e.packages;
		return {
			missing: e,
			more: t
		};
	}
	async apply() {
		let { missing: e, more: t } = this.diffs();
		if (await w({
			title: S("stocktake.confirm_title"),
			message: S("stocktake.confirm_message", {
				missing: e,
				more: t
			}),
			action: S("stocktake.apply")
		})) try {
			let e = await wc(this.hass, {
				location_id: this.location,
				counts: this.rows.filter((e) => (this.counted.get(e.batch_id) ?? 0) !== e.packages).map((e) => ({
					batch_id: e.batch_id,
					packages: this.counted.get(e.batch_id) ?? 0
				})),
				extra: this.extra.map((e) => ({
					product_id: e.product_id,
					packages: e.packages,
					expires_on: e.expires_on || null
				}))
			});
			await this.choose(this.location), this.message = S("stocktake.done", { n: e.corrections });
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	stepper(e, t, n, r) {
		return g`<span class="acts">
      <button
        class="icon-btn"
        data-testid=${`${e}-minus`}
        aria-label=${S("stocktake.less", { name: t })}
        title=${S("stocktake.less", { name: t })}
        ?disabled=${n === 0}
        @click=${() => r(-1)}
      >
        ${T(pt)}
      </button>
      <button
        class="icon-btn"
        data-testid=${`${e}-plus`}
        aria-label=${S("stocktake.one_more", { name: t })}
        title=${S("stocktake.one_more", { name: t })}
        @click=${() => r(1)}
      >
        ${T(_t)}
      </button>
    </span>`;
	}
	rowError(e) {
		return e.remaining < 1 && (this.counted.get(e.batch_id) ?? 0) > 1 ? S("valid.partial_one") : void 0;
	}
	list() {
		return g`<ul>
      ${this.rows.map((e) => {
			let t = this.counted.get(e.batch_id) ?? 0, n = t - e.packages;
			return g`<li data-testid="stocktake-row">
          <span class="what">
            <span>${e.name}</span>
            <span class="detail">${this.batchLabel(e)}</span>
          </span>
          <span class="count">
            ${S("stocktake.counted", {
				n: t,
				packages: e.packages
			})}
            ${n ? g`<span class="detail"
                    >${S(n < 0 ? "stocktake.missing" : "stocktake.too_many", { n: Math.abs(n) })}</span
                  >` : v}
          </span>
          ${this.stepper("stocktake-row", e.name, t, (t) => this.count(e.batch_id, t))}
          ${O(this.rowError(e), "stocktake-row")}
        </li>`;
		})}
    </ul>`;
	}
	extras() {
		return this.extra.length ? g`<h3>${S("stocktake.extra")}</h3>
      <ul>
        ${this.extra.map((e, t) => g`<li data-testid="stocktake-extra">
              <span class="what">
                <span>${e.name}</span>
                <input
                  type="date"
                  data-testid="stocktake-extra-date"
                  aria-label=${S("book.expires_on")}
                  min="2000-01-01"
                  max="2099-12-31"
                  .value=${e.expires_on}
                  @input=${(e) => this.extra = this.extra.map((n, r) => r === t ? {
			...n,
			expires_on: e.target.value
		} : n)}
                />
              </span>
              <span class="count">${S("book.count", { n: e.packages })}</span>
              ${this.stepper("stocktake-extra", e.name, e.packages, (t) => this.addExtra(e, t))}
            </li>`)}
      </ul>` : v;
	}
	pickLine(e) {
		let t = S("stocktake.pick", { name: e.name });
		return g`<div class="pick" role="group" aria-label=${t}>
      <span>${t}</span>
      ${e.batches.map((e) => g`<button
            type="button"
            data-testid="stocktake-pick"
            @click=${() => {
			this.count(e.batch_id, 1), this.pick = void 0;
		}}
          >
            ${this.batchLabel(e)}
          </button>`)}
    </div>`;
	}
	render() {
		let { missing: e, more: t } = this.diffs();
		return g`<label>
        <span class="lbl">${S("stocktake.location")}</span>
        <select
          data-testid="stocktake-location"
          @change=${(e) => this.choose(Number(e.target.value) || null)}
        >
          <option value="" .selected=${this.location == null}>${S("stocktake.choose")}</option>
          ${(this.md?.locations ?? []).map((e) => g`<option value=${e.id} .selected=${e.id === this.location}>${e.name}</option>`)}
        </select>
      </label>
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      ${q(this.message, void 0, "stocktake")}
      ${this.location ? g`<p class="detail">${S("stocktake.hint")}</p>
              <home-inventory-booking-scan
                .value=${this.query}
                @query=${(e) => this.query = e.detail}
                @find=${(e) => this.find(e.detail)}
              ></home-inventory-booking-scan>
              ${this.pick ? this.pickLine(this.pick) : v}
              ${this.rows.length ? this.list() : g`<p class="empty">${S("stocktake.empty")}</p>`}
              ${this.extras()}
              <div class="actions">
                <button
                  class="primary"
                  data-testid="stocktake-apply"
                  ?disabled=${!e && !t || this.rows.some((e) => this.rowError(e))}
                  @click=${() => this.apply()}
                >
                  ${S("stocktake.apply")}
                </button>
              </div>` : v}`;
	}
	static {
		this.styles = [
			C,
			J,
			s`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      li .field-error {
        flex-basis: 100%;
      }
      .what {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .count {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        white-space: nowrap;
      }
      .acts {
        display: flex;
      }
      .pick {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
      }
      h3 {
        font-size: 1em;
        margin: 16px 0 4px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }
    `
		];
	}
};
customElements.define("home-inventory-stocktake", Tc);
// src/api-history.ts
var Ec = (e, t) => e.callWS({
	type: "home_inventory/history",
	...Object.fromEntries(Object.entries(t).filter(([, e]) => e !== "" && e !== void 0))
}), Dc = (e, t) => e.callWS({
	type: "home_inventory/history_undo",
	action_id: t
}), Oc = 100, kc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			data: { state: !0 },
			name: { state: !0 },
			user: { state: !0 },
			from: { state: !0 },
			to: { state: !0 },
			offset: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.name = this.user = this.from = this.to = this.error = "", this.offset = 0;
	}
	willUpdate() {
		this.hass && !this.started && (this.started = !0, this.load().then(() => this.renderRoot.querySelector("[data-testid=history-name]")?.focus()));
	}
	get rangeError() {
		return this.from && this.to && this.from > this.to ? S("history.range_error") : void 0;
	}
	async load() {
		if (!this.rangeError) try {
			this.data = await Ec(this.hass, {
				name: this.name,
				user_id: this.user,
				date_from: this.from,
				date_to: this.to,
				offset: this.offset
			}), this.error = "";
		} catch (e) {
			this.error = await N(this.hass, e);
		}
	}
	filter(e) {
		e(), this.offset = 0, this.load();
	}
	page(e) {
		this.offset = Math.max(0, this.offset + e * Oc), this.load();
	}
	userName(e) {
		return this.data?.users.find((t) => t.id === e)?.name ?? "";
	}
	line(e) {
		let t = B(this.hass, e.packages), n = e.kind === "correct" && e.packages > 0 ? `+${t}` : t, r = e.to_location ? `${e.location} → ${e.to_location}` : e.location ?? "";
		return g`<span class="name">${e.name}</span> · ${S(`history.kind.${e.kind}`)} ·
      ${S("history.packages", { n })}${r ? g` · ${r}` : v}`;
	}
	async undo(e) {
		if (await w({
			title: S("history.undo_title", { date: Rn(this.hass, e.ts) }),
			message: S("history.undo_message"),
			body: g`<ul class="impact">
        ${e.rows.filter((e) => !e.undone_at).map((e) => g`<li>${this.line(e)}</li>`)}
        ${e.more_rows ? g`<li>${S("history.more_rows", { n: e.more_rows })}</li>` : v}
      </ul>`,
			action: S("stock.undo")
		})) {
			try {
				await Dc(this.hass, e.action_id), this.error = "";
			} catch (e) {
				this.error = await N(this.hass, e);
			}
			await this.load();
		}
	}
	undoneLine(e) {
		if (!e.undone_at) return e.partly ? S("history.partly") : "";
		let t = Rn(this.hass, e.undone_at), n = this.userName(e.undone_by);
		return n ? S("history.undone_by", {
			date: t,
			user: n
		}) : S("history.undone", { date: t });
	}
	action(e) {
		let t = this.userName(e.user_id), n = this.undoneLine(e);
		return g`<li data-testid="history-action">
      <div class="head">
        <span class="when ${e.undone_at ? "struck" : ""}"
          >${Rn(this.hass, e.ts)}${t ? ` · ${t}` : ""}</span
        >
        ${e.undone_at ? v : g`<button
                class="icon-btn"
                data-testid="history-undo"
                aria-label=${S("stock.undo")}
                title=${S("stock.undo")}
                @click=${() => this.undo(e)}
              >
                ${T(Dt)}
              </button>`}
      </div>
      ${e.rows.map((t) => g`<div data-testid="history-row" class=${e.undone_at || t.undone_at ? "struck" : ""}>
            ${this.line(t)}
          </div>`)}
      ${e.more_rows ? g`<div class="when" data-testid="history-more-rows">
              ${S("history.more_rows", { n: e.more_rows })}
            </div>` : v}
      ${n ? g`<div class="when" data-testid="history-undone">${n}</div>` : v}
    </li>`;
	}
	field(e, t, n, r, i = "text") {
		return g`<label
      >${e}
      <input
        type=${i}
        data-testid=${t}
        .value=${n}
        @change=${(e) => this.filter(() => r(e.target.value.trim()))}
      />
    </label>`;
	}
	render() {
		let e = this.data;
		return g`<div class="filters">
        ${this.field(S("history.name"), "history-name", this.name, (e) => this.name = e)}
        <label
          >${S("history.user")}
          <select
            data-testid="history-user"
            @change=${(e) => this.filter(() => this.user = e.target.value)}
          >
            <option value="" .selected=${!this.user}>${S("history.all_users")}</option>
            ${(e?.users ?? []).map((e) => g`<option value=${e.id} .selected=${e.id === this.user}>${e.name}</option>`)}
          </select>
        </label>
        ${this.field(S("history.from"), "history-from", this.from, (e) => this.from = e, "date")}
        ${this.field(S("history.to"), "history-to", this.to, (e) => this.to = e, "date")}
        ${O(this.rangeError, "history-range")}
      </div>
      ${this.error ? g`<p class="error" role="alert">${this.error}</p>` : v}
      ${e && !e.actions.length ? g`<p class="empty">${S("history.empty")}</p>` : v}
      <ul>
        ${(e?.actions ?? []).map((e) => this.action(e))}
      </ul>
      <div class="pager">
        <button
          data-testid="history-newer"
          ?disabled=${this.offset === 0}
          @click=${() => this.page(-1)}
        >
          ${S("history.newer")}
        </button>
        <button data-testid="history-older" ?disabled=${!e?.more} @click=${() => this.page(1)}>
          ${S("history.older")}
        </button>
      </div>`;
	}
	static {
		this.styles = [C, s`
      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 8px;
        margin-bottom: 8px;
      }
      .filters .field-error {
        grid-column: 1 / -1;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .when {
        color: var(--secondary-text-color);
      }
      .name {
        font-weight: 500;
      }
      .struck {
        text-decoration: line-through;
      }
      .pager {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
      }
    `];
	}
};
customElements.define("home-inventory-history", kc);
// src/home-inventory-panel.ts
var Ac = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", jc = [
	"stock",
	"expiry",
	"emergency",
	"shopping",
	"recipes",
	"plan",
	"canning",
	"settings"
], Mc = [
	"shopping",
	"recipes",
	"plan",
	"emergency"
], Nc = class extends x {
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			route: { attribute: !1 },
			panel: { attribute: !1 }
		};
	}
	constructor() {
		super(), this.narrow = !1;
		let e = (e) => e.composedPath()[0].setAttribute?.("data-touched", "");
		this.addEventListener("input", e), this.addEventListener("focusout", e);
	}
	willUpdate(e) {
		e.has("hass") && this.hass && Ft(this.hass.language), e.has("panel") && (kn(this.panel?.config?.modules), jn(this.panel?.config?.external));
	}
	get tabs() {
		return jc.filter((e) => (e !== "settings" || M(this.hass)) && (!Mc.includes(e) || L(e)) && (e !== "canning" || Ao().length > 0));
	}
	get seg() {
		return (this.route?.path ?? "").split("/").filter(Boolean)[0];
	}
	get tab() {
		let e = this.seg ?? "";
		return this.tabs.includes(e) ? e : "stock";
	}
	get sub() {
		return (this.route?.path ?? "").split("/").filter(Boolean)[1];
	}
	select(e) {
		history.pushState(null, "", `${this.route?.prefix ?? ""}/${e}`), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.tab;
		return g`
      <header>
        ${this.narrow ? g`<button
                class="menu"
                aria-label=${S("panel.menu")}
                title=${S("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${T(dt)}
              </button>` : v}
        <h1>${S("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${Ac}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${S("panel.help")}
          title=${S("panel.help")}
          >${T(ct)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map((t) => g`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${S(`tab.${t}`)}
            </button>`)}
      </div>
      <main
        role="tabpanel"
        @home-inventory-navigate=${(e) => this.select(e.detail)}
      >
        ${e === "settings" ? g`<home-inventory-settings
                .hass=${this.hass}
                .section=${this.sub}
              ></home-inventory-settings>` : e === "stock" && this.seg === "stocktake" ? g`<home-inventory-stocktake .hass=${this.hass}></home-inventory-stocktake>` : e === "stock" && this.seg === "history" ? g`<home-inventory-history .hass=${this.hass}></home-inventory-history>` : e === "stock" ? g`<home-inventory-stock
                      .hass=${this.hass}
                      .mode=${this.seg === "in" || this.seg === "out" || this.seg === "open" && L("opened") || this.seg === "freeze" && L("frozen") ? this.seg : "search"}
                    ></home-inventory-stock>` : e === "expiry" ? g`<home-inventory-expiry .hass=${this.hass}></home-inventory-expiry>` : e === "emergency" ? g`<home-inventory-emergency
                          .hass=${this.hass}
                        ></home-inventory-emergency>` : e === "recipes" ? g`<home-inventory-recipes
                            .hass=${this.hass}
                            .section=${this.sub}
                          ></home-inventory-recipes>` : e === "plan" ? g`<home-inventory-plan
                              .hass=${this.hass}
                              .section=${this.sub}
                            ></home-inventory-plan>` : e === "canning" ? g`<home-inventory-canning
                                .hass=${this.hass}
                                .section=${this.sub}
                              ></home-inventory-canning>` : g`<home-inventory-shopping
                                .hass=${this.hass}
                              ></home-inventory-shopping>`}
      </main>
    `;
	}
	static {
		this.styles = s`
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
customElements.define("home-inventory-panel", Nc);
export { Nc as HomeInventoryPanel };
