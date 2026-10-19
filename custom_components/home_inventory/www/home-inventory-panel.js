import { o as e } from "./rolldown-runtime-BItFwnF5.js";
//#region node_modules/@lit/reactive-element/css-tag.js
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
var p = class extends HTMLElement {
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
p.elementStyles = [], p.shadowRootOptions = { mode: "open" }, p[se("elementProperties")] = /* @__PURE__ */ new Map(), p[se("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: p }), (re.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var de = globalThis, fe = (e) => e, pe = de.trustedTypes, me = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, he = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ge = "?" + m, _e = `<${ge}>`, h = document, ve = () => h.createComment(""), g = (e) => e === null || typeof e != "object" && typeof e != "function", ye = Array.isArray, be = (e) => ye(e) || typeof e?.[Symbol.iterator] == "function", xe = "[ 	\n\f\r]", _ = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Se = /-->/g, Ce = />/g, v = RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), we = /'/g, Te = /"/g, Ee = /^(?:script|style|textarea|title)$/i, De = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), y = De(1), Oe = De(2), b = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), S = h.createTreeWalker(h, 129);
function Ae(e, t) {
	if (!ye(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return me === void 0 ? t : me.createHTML(t);
}
var je = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = _;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === _ ? c[1] === "!--" ? o = Se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = v) : (Ee.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = v) : o = Ce : o === v ? c[0] === ">" ? (o = i ?? _, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? v : c[3] === "\"" ? Te : we) : o === Te || o === we ? o = v : o === Se || o === Ce ? o = _ : (o = v, i = void 0);
		let d = o === v && e[t + 1].startsWith("/>") ? " " : "";
		a += o === _ ? n + _e : l >= 0 ? (r.push(s), n.slice(0, l) + he + n.slice(l) + m + d) : n + m + (l === -2 ? t : d);
	}
	return [Ae(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Me = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = je(t, n);
		if (this.el = e.createElement(l, r), S.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = S.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(he)) {
					let t = u[o++], n = i.getAttribute(e).split(m), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Fe : r[1] === "?" ? Ie : r[1] === "@" ? Le : w
					}), i.removeAttribute(e);
				} else e.startsWith(m) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ee.test(i.tagName)) {
					let e = i.textContent.split(m), t = e.length - 1;
					if (t > 0) {
						i.textContent = pe ? pe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ve()), S.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ve());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ge) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(m, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += m.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = h.createElement("template");
		return n.innerHTML = e, n;
	}
};
function C(e, t, n = e, r) {
	if (t === b) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = g(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = C(e, i._$AS(e, t.values), i, r)), t;
}
var Ne = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? h).importNode(t, !0);
		S.currentNode = r;
		let i = S.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Pe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Re(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = S.nextNode(), a++);
		}
		return S.currentNode = h, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Pe = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = C(this, e, t), g(e) ? e === x || e == null || e === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : e !== this._$AH && e !== b && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? be(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== x && g(this._$AH) ? this._$AA.nextSibling.data = e : this.T(h.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Me.createElement(Ae(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ne(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ke.get(e.strings);
		return t === void 0 && ke.set(e.strings, t = new Me(e)), t;
	}
	k(t) {
		ye(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ve()), this.O(ve()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = fe(e).nextSibling;
			fe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, w = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = x, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = x;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = C(this, e, t, 0), a = !g(e) || e !== this._$AH && e !== b, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = C(this, r[n + o], t, o), s === b && (s = this._$AH[o]), a ||= !g(s) || s !== this._$AH[o], s === x ? e = x : e !== x && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Fe = class extends w {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === x ? void 0 : e;
	}
}, Ie = class extends w {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== x);
	}
}, Le = class extends w {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = C(this, e, t, 0) ?? x) === b) return;
		let n = this._$AH, r = e === x && n !== x || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== x && (n === x || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Re = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		C(this, e);
	}
}, ze = {
	M: he,
	P: m,
	A: ge,
	C: 1,
	L: je,
	R: Ne,
	D: be,
	V: C,
	I: Pe,
	H: w,
	N: Ie,
	U: Le,
	B: Fe,
	F: Re
}, Be = de.litHtmlPolyfillSupport;
Be?.(Me, Pe), (de.litHtmlVersions ??= []).push("3.3.3");
var Ve = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Pe(t.insertBefore(ve(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, He = globalThis, T = class extends p {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ve(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return b;
	}
};
T._$litElement$ = !0, T.finalized = !0, He.litElementHydrateSupport?.({ LitElement: T });
var Ue = He.litElementPolyfillSupport;
Ue?.({ LitElement: T }), (He.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var We = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", Ge = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", Ke = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", qe = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z", Je = "M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z", Ye = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Xe = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", Ze = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Qe = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", $e = "M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z", et = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", tt = "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z", nt = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", rt = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", it = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", at = "M7,10L12,15L17,10H7Z", ot = "M19,13H5V11H19V13Z", st = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", ct = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z", lt = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", ut = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", dt = "M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5M19 19H5V5H19V19M6 15H18V17H6M6 11H18V13H6M6 7H18V9H6V7Z", ft = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", pt = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", mt = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", ht = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", gt = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", _t = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z", vt = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13", yt = {
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
	"stock.take_one": "1 Pkg. „{name}“ auslagern",
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
	"tip.expiry_type": "Mindesthaltbarkeit: danach oft noch gut. Verbrauchsdatum: danach nicht mehr verwenden.",
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
	"tab.canning": "Einkochen",
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
	"recipes.canning": "· {temp} °C, {minutes} Min.",
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
	"recipes.printed": "Rezept gedruckt.",
	"settings.section.meals": "Mahlzeiten",
	"settings.meals.hint": "Ab wann eine Mahlzeit gilt. Bestimmt die aktuelle Mahlzeit, z. B. für die Aktion „Geplantes Rezept drucken“ ohne Angabe der Mahlzeit. Vor der ersten Startzeit gilt noch die letzte Mahlzeit des Vortags.",
	"settings.meals.from": "ab {time} Uhr",
	"settings.meals.edit": "Startzeiten der Mahlzeiten bearbeiten",
	"valid.time": "Bitte eine Uhrzeit angeben.",
	"common.print": "Drucken",
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
	"plan.shop.none": "Im Zeitraum sind keine Rezepte geplant."
}, bt = { de: yt }, xt = yt;
function St(e) {
	let t = e ?? "";
	xt = bt[t] ?? bt[t.split("-")[0]] ?? yt;
}
function E(e, t) {
	let n = xt[e] ?? yt[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var D = s`
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
`, Ct = s`
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
`, wt = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, Tt = class extends T {
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
		wt(e) && e.target.close();
	}
	render() {
		return y`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? y`<p>${this.o.message}</p>` : x} ${this.o.body ?? x}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${E("common.cancel")}
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
		this.styles = [D, s`
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
customElements.define("home-inventory-confirm", Tt);
function O(e) {
	return new Promise((t) => {
		let n = document.createElement("home-inventory-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var Et = (e, t) => O({
	title: E("common.delete_name", { name: e }) + "?",
	message: t,
	action: E("common.delete"),
	danger: !0
}), k = (e) => y`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${Oe`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Dt = !1;
async function Ot(e, t) {
	if (!t?.()) return e.close();
	if (!Dt) {
		Dt = !0;
		try {
			await O({
				title: E("common.discard"),
				action: E("common.discard_ok")
			}) && e.close();
		} finally {
			Dt = !1;
		}
	}
}
var A = (e) => (t) => {
	wt(t) && Ot(t.target, e);
}, kt = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), Ot(t.currentTarget, e));
};
async function At(e, t) {
	let n = e.currentTarget;
	if (n.hasAttribute("data-busy")) return e.preventDefault();
	n.setAttribute("data-busy", "");
	try {
		await t(e);
	} finally {
		n.removeAttribute("data-busy");
	}
}
var j = (e) => y`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${A(e.dirty)}
    @keydown=${kt(e.dirty)}
    @cancel=${kt(e.dirty)}
  >
    <form @submit=${(t) => At(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? y`<p class="error" role="alert">${e.error}</p>` : x}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${E("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
        >
          ${e.submit?.label ?? E("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, jt = (e, t) => y`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${E(e ? "common.collapse" : "common.expand")}
    title=${E(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${k(e ? Ye : Ze)}
  </button>`;
function Mt(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var M = (e) => y`${e.onAdd ? y`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            title=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${k(ut)}
          </button>` : x}${e.onMove ? y`<button
            class="icon-btn"
            data-testid=${`${e.testid}-move`}
            aria-label=${e.moveLabel ?? ""}
            title=${e.moveLabel ?? ""}
            @click=${e.onMove}
          >
            ${k(pt)}
          </button>` : x}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${E("common.edit_name", { name: e.name })}
      title=${E("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${k(lt)}
    </button>
    ${e.onDelete ? y`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${E("common.delete_name", { name: e.name })}
            title=${E("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${k(et)}
          </button>` : x}`, N = (e, t, n = !1) => e ? y`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : x, P = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, Nt = (e) => e >= "2000-01-01" && e <= "2099-12-31", F = (e, t) => e || !!t && !Nt(t), I = (e) => e === "" ? null : Number(e), Pt = /^https?:\/\//i, L = (e) => !!e?.user?.is_admin;
async function R(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var z = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), B = (e) => e.callWS({ type: "home_inventory/master_data" }), Ft = (e, t, n) => e.callWS({
	type: "home_inventory/save",
	table: t,
	data: n
}), It = (e, t) => e.callWS({
	type: "home_inventory/defaults_save",
	data: t
}), Lt = (e, t, n, r = {}) => e.callWS({
	type: "home_inventory/delete",
	table: t,
	row_id: n,
	...r
}), Rt = (e, t, n) => e.callWS({
	type: "home_inventory/move_location",
	location_id: t,
	move_to: n
}), zt = (e, t, n) => e.callWS({
	type: "home_inventory/delete_impact",
	table: t,
	row_id: n
}), Bt = (e, t, n) => e.callWS({
	type: "home_inventory/product_type_add",
	name: t,
	parent_id: n
}), Vt = (e, t) => e.callWS({
	type: "home_inventory/lookup",
	code: t
}), Ht = (e, t, n = !1) => e.callWS({
	type: "home_inventory/search",
	query: t,
	online: n
}), Ut = (e, t) => e.callWS({
	type: "home_inventory/book_in",
	...t
}), Wt = (e, t) => e.callWS({
	type: "home_inventory/book_out",
	...t
}), Gt = (e, t) => e.callWS({
	type: "home_inventory/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), Kt = (e, t) => e.callWS({
	type: "home_inventory/stock_edit",
	...t
}), qt = (e, t) => e.callWS({
	type: "home_inventory/stock",
	product_id: t
}), Jt = (e) => e.callWS({ type: "home_inventory/products" }), Yt = (e, t) => e.callWS({
	type: "home_inventory/product_save",
	data: t
}), Xt = (e) => e.callWS({ type: "home_inventory/label_config" }), Zt = (e, t) => e.callWS({
	type: "home_inventory/print_labels",
	...t
}), Qt = (e) => e.callWS({ type: "home_inventory/print_shopping_list" }), $t = (e, t, n) => e.callWS({
	type: "home_inventory/print_recipe",
	recipe_id: t,
	servings: n
}), en = (e, t, n) => e.callWS({
	type: "home_inventory/print_plan",
	start: t,
	days: n
}), tn = (e, t) => e.callWS({
	type: "home_inventory/book_out_label",
	code: t
}), nn = (e) => e.callWS({ type: "home_inventory/recipes" }), rn = (e, t) => e.callWS({
	type: "home_inventory/expiring_recipes",
	...t == null ? {} : { days: t }
}), an = (e, t, n) => e.callWS({
	type: "home_inventory/recipe_availability",
	recipe_id: t,
	servings: n
}), on = (e, t) => e.callWS({
	type: "home_inventory/recipe_save",
	data: t
}), V = (e) => e.canning_product_id != null, sn = (e, t) => e.callWS({
	type: "home_inventory/recipe_import",
	...t
}), cn = (e, t) => e.callWS({
	type: "home_inventory/recipe_ai_check",
	draft: t
}), ln = (e, t) => e.callWS({
	type: "home_inventory/product_ai_check",
	draft: t
}), un = (e, t, n) => e.callWS({
	type: "home_inventory/unit_add",
	name: t,
	symbol: n
}), dn, fn = (e) => dn = e, H = (e) => !dn || dn.includes(e), pn = !1, mn = (e) => pn = !!e, hn = () => pn, gn = !0, _n = (e) => gn = e ?? !0, vn = () => gn, yn = (e) => e?.locale?.language ?? e?.language, U = (e, t) => new Intl.DateTimeFormat(yn(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), W = (e, t) => new Intl.NumberFormat(yn(e)).format(t), bn = (e, t, n, r, i = t) => E(new Intl.PluralRules(yn(e)).select(t) === "one" ? n : r, { n: i }), xn = (e, t) => bn(e, Number(t), "settings.day", "settings.days", t), G = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), K = (e, t, n = "") => `${W(e, t)} ${n ?? ""}`.trim(), Sn = (e, t) => bn(e, t, "recipes.portion", "recipes.portions");
//#endregion
//#region src/inherit.ts
function q(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function J(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n],
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: E("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: E("settings.inherit_from", { name: a ?? "" })
	};
}
var Cn = (e, t) => y`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${k(ft)}${E("common.reset")}
  </button>`;
function wn(e) {
	let t = e.own ?? null;
	return y`<span class="inh">
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
        ${e.dflt ? E("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : E(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => y`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? x : Cn(e.testid, () => e.onChange(null))}
  </span>`;
}
function Tn(e) {
	let t = e.own ?? null;
	return y`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? E("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(I(n));
	}}
    />
    ${e.suffix ? y`<span class="detail">${e.suffix}</span>` : x}
    ${t == null ? x : Cn(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var En = class extends T {
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
				let { id: t } = await Bt(this.hass, this.creating, e), n = await B(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await R(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = Mt(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => G(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: q(this.categories, e.id)
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
		return y`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? E("book.choose") : q(this.categories, this.value)}
        </span>
        ${k(at)}
      </button>
      <dialog @click=${A()}>
        <h2>
          ${this.creating ? E("book.choose_parent", { name: this.creating }) : E("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${E("book.filter")}
          placeholder=${E("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !n && !this.creating ? y`<li>
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
                </li>` : x}
          ${e.map(({ c: e, depth: t, label: r }) => {
			let i = !n && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return y`<li style="padding-left: ${t * 20}px">
              ${i ? jt(a, () => this.toggle(e.id)) : n ? x : y`<span class="chev"></span>`}
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
        ${r ? y`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(t)}
              >
                ${E("book.create_category", { name: t })}
              </button>` : e.length ? x : y`<p class="empty">${E("book.no_hits")}</p>`}
        ${this.failure ? y`<p class="error" role="alert">${this.failure}</p>` : x}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${E("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${E("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-category-picker", En);
//#endregion
//#region src/settings-format.ts
function Dn(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function On(e, t) {
	return t === "default" ? E("settings.inherit_default") : E("settings.inherit_from", { name: Dn(e, t) });
}
function kn(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: t === "food" ? null : e.defaults[t],
		source: "default"
	};
}
function Y(e, t, n, r) {
	if (n === "food") return E(r === 0 ? "settings.food.no" : "settings.food.yes");
	if (r == null) return E("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : E("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? E("common.none_dash") : n === "expiry_type" ? E(`settings.expiry.${r}`) : xn(t, r);
}
//#endregion
//#region src/min-stock.ts
function An(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = E("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = E("valid.packages")), t;
}
function jn(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return y`<label>
      <span class="lbl" title=${E("tip.min_stock")}>${E("settings.category.min_stock")}</span>
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
          aria-label=${E("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${z(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => y`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${N(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${E("tip.min_packages")}>${E("settings.category.min_packages")}</span>
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
        <span class="detail">${E("book.packages")}</span>
      </span>
      ${N(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${E("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-model.ts
var Mn = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null,
	meals: null
}, Nn = {
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
		"min_packages",
		"shelf_days",
		"opened_days",
		"food"
	]
}, Pn = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, Fn = [
	"warn_days",
	"shelf_days",
	"opened_days"
], In = class extends T {
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
		for (let i of Nn[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = E("valid.duplicate")) : n.name = E("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = E("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = E("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = E("valid.days")), t.shelf_days != null && !(Number.isInteger(t.shelf_days) && t.shelf_days >= 1) && (n.shelf_days = E("valid.shelf_days")), t.opened_days != null && !(Number.isInteger(t.opened_days) && t.opened_days >= 1) && (n.opened_days = E("valid.shelf_days")), Object.assign(n, An(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Nn[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Ft(this.hass, t, r);
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t, n) {
		return y`<label><span class="lbl" title=${n ?? x}>${e}</span>${t}</label>`;
	}
	text(e) {
		return y`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${N(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return y`<span class="num"
        ><input
          type="number"
          step=${Fn.includes(e) ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value;
			this.set(e, I(n));
		}}
        />${n ? y`<span class="detail">${n}</span>` : x}</span
      >${Fn.includes(e) ? x : N(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return y`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" .selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => y`<option value=${e} .selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? x : y`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${k(ft)}${E("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = kn(i, e, this.edit.d.parent_id), o = Y(i, this.hass, e, a.value), s = On(i, a.source), c = Fn.includes(e) ? this.numInput(e, E("common.default", {
			value: o,
			source: s
		}), E("common.days_unit")) : this.select(e, n, E("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, y`<span class="inh">${c}${this.reset(e)}</span
        >${N(this.errs[e], e)}`, E(`tip.${e}`));
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return y`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(E("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = z(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = y`${this.field(E("common.name"), this.text("name"))}${this.field(E("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${E("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${E("settings.unit.recipe_only")}</label
        >
        ${N(E("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(E("settings.unit.base"), this.select("base_unit_id", e, E("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(E("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? kn(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = y`${this.field(E("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${E("settings.category.parent")}</span>
          <home-inventory-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${E("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></home-inventory-category-picker>
        </div>
        ${this.inh("unit_id", E("settings.category.unit"), z(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", E("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", E("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, E(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", E("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", E("settings.category.shelf_days"), [])}
        ${H("opened") ? this.inh("opened_days", E("settings.category.opened_days"), []) : ""}
        ${this.inh("food", E("settings.food.label"), [[1, E("settings.food.yes")], [0, E("settings.food.no")]])}
        ${jn({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? y`<p class="detail">${E("settings.category.off_tags", { tags: t.join(", ") })}</p>` : x}`;
		}
		let c = () => Nn[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? Dn(i, n.parent_id) : "";
		return j({
			title: n.id ? E("common.edit_name", { name: r.name }) : l ? E("settings.category.add_sub_to", { name: l }) : E(Pn[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [D];
	}
};
customElements.define("home-inventory-settings-dialog", In);
//#endregion
//#region src/defaults-view.ts
var Ln = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"],
	["shelf_days", "settings.category.shelf_days"],
	["opened_days", "settings.category.opened_days"]
], Rn = class extends T {
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
		return t === null || !Number.isInteger(t) || t < 0 ? E("valid.days") : void 0;
	}
	shelfError(e, t = "shelf_days") {
		let n = e[t];
		return n !== null && !(Number.isInteger(n) && n >= 1) ? E("valid.shelf_days") : void 0;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!(this.warnError(t) || this.shelfError(t) || this.shelfError(t, "opened_days"))) try {
			await It(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? y`<p class="detail intro">${E("settings.defaults.hint")}</p>
      <ul>
        ${Ln.filter(([e]) => e !== "opened_days" || H("opened")).map(([t, n]) => y`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${E(n)}</span>
                <span class="detail">${Y(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${M({
			testid: "default",
			name: E(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : y``;
	}
	select(e, t) {
		let n = this.d;
		return y`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => y`<option value=${t ?? ""} .selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return y`<dialog></dialog>`;
		let n = this.warnError(t), r = this.shelfError(t), i = this.shelfError(t, "opened_days");
		return j({
			title: E("settings.defaults.edit"),
			body: y`<label>
          <span class="lbl" title=${E("tip.unit_id")}>${E("settings.category.unit")}</span>
          ${this.select("unit_id", z(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${E("tip.default_location_id")}
            >${E("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, E("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${E("tip.expiry_type")}
            >${E("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", ["best_before", "use_by"].map((e) => [e, E(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${E("tip.warn_days")}>${E("settings.category.warn_days")}</span>
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
				this.set("warn_days", I(t));
			}}
            />
            ${E("common.days_unit")}
          </span>
          ${N(n, "default-warn_days")}
        </label>
        ${this.optionalDays(t, "shelf_days", r)}
        ${H("opened") ? this.optionalDays(t, "opened_days", i) : ""}`,
			error: this.error,
			invalid: !!n || !!r || !!i,
			dirty: () => Ln.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	optionalDays(e, t, n) {
		return y`<label>
      <span class="lbl" title=${E(`tip.${t}`)}>${E(`settings.category.${t}`)}</span>
      <span class="num">
        <input
          data-testid=${`default-${t}`}
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          aria-invalid=${!!n}
          .value=${String(e[t] ?? "")}
          @input=${(e) => this.set(t, I(e.target.value))}
        />
        ${E("common.days_unit")}
      </span>
      ${N(n, `default-${t}`)}
    </label>`;
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-defaults", Rn);
//#endregion
//#region src/meal-times-view.ts
var zn = /^([01][0-9]|2[0-3]):[0-5][0-9]$/, Bn = class extends T {
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
			this.error = await R(this.hass, e);
		}
	}
	async open() {
		this.error = "", this.d = [...this.starts], await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), !this.d.some((e) => !zn.test(e))) try {
			await this.hass.callWS({
				type: "home_inventory/meal_times_save",
				starts: this.d
			}), this.starts = [...this.d], this.renderRoot.querySelector("dialog")?.close();
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		if (!this.starts) return y`${this.error ? y`<p class="error">${this.error}</p>` : ""}`;
		let e = this.d;
		return y`<p class="detail intro">${E("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map((e, t) => y`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${E(`plan.slot.${t}`)}</span>
                <span class="detail">${E("settings.meals.from", { time: e })}</span>
              </button>
              ${M({
			testid: "meal-time",
			name: E(`plan.slot.${t}`),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${e ? j({
			title: E("settings.meals.edit"),
			body: y`${e.map((t, n) => y`<label>
                    <span class="lbl">${E(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!zn.test(t)}
                      .value=${t}
                      @input=${(t) => this.d = e.map((e, r) => r === n ? t.target.value : e)}
                    />
                    ${N(zn.test(t) ? void 0 : E("valid.time"), `meal-time-${n}`)}
                  </label>`)}`,
			error: this.error,
			invalid: e.some((e) => !zn.test(e)),
			dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		}) : y`<dialog></dialog>`}`;
	}
	static {
		this.styles = [D];
	}
};
customElements.define("home-inventory-meal-times", Bn);
//#endregion
//#region src/move-location.ts
var Vn = class extends T {
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
			let t = (await zt(this.hass, "location", e.id)).groups.find((e) => e.kind === "delete.stock");
			this.batches = t?.count ?? 0, this.packages = t?.packages ?? 0;
		} catch (e) {
			this.error = await R(this.hass, e);
		}
		this.from = e, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("select")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.target && this.batches) try {
			await Rt(this.hass, this.from.id, Number(this.target)), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("moved"));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		let e = this.from;
		return e ? j({
			title: E("settings.location.move_name", { name: e.name }),
			body: y`<p class="detail" data-testid="move-summary">
          ${this.batches ? E("settings.location.move_summary", {
				batches: this.batches,
				packages: this.packages,
				name: e.name
			}) : E("settings.location.move_empty")}
        </p>
        <label>
          <span class="lbl">${E("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e) => this.target = e.target.value}
          >
            <option value="">${E("settings.location.move_choose")}</option>
            ${this.locations.filter((t) => t.id !== e.id).map((e) => y`<option value=${e.id}>${e.name}</option>`)}
          </select>
          ${N(this.target ? void 0 : E("valid.location"), "move-target")}
        </label>`,
			error: this.error,
			invalid: !this.target || !this.batches,
			submit: {
				label: E("settings.location.move_action"),
				testid: "move-save"
			},
			dirty: () => !!this.target,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.from = void 0
		}) : y`<dialog></dialog>`;
	}
	static {
		this.styles = [D, s`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-move-location", Vn);
//#endregion
//#region src/delete-flow.ts
var Hn = 5, Un = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = E(r, { n });
	return i === r ? E("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, Wn = (e) => {
	let t = e.names.length - Hn;
	return e.names.slice(0, Hn).join(", ") + (t > 0 ? E("delete.more", { n: t }) : "");
};
async function Gn(e, t, n, r) {
	let i = n === "location" || n === "unit" ? E(`settings.${n}.delete_hint`) : void 0, a = await zt(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "home_inventory",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await Et(r.name, i) ? (await Lt(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = y`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => y`<li>
            <span class="kind">${Un(n, e)}</span>
            <span class="names">${Wn(e)}</span>
            ${e.packages ? y`<span class="names">${E("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? y`<label>
            <span class="lbl">${E("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => y`<option value=${e.id}>${E("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${E("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await O({
		title: E("common.delete_name", { name: r.name }) + "?",
		message: i ?? E("delete.affected"),
		body: c,
		action: E(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await Lt(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var Kn = class extends T {
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
		return Object.keys(Mn).filter((e) => e !== "meals" || H("plan"));
	}
	get sec() {
		return this.sections.includes(this.section ?? "") ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await B(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await R(this.hass, e);
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
		this.expanded = Mt(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => Y(t, this.hass, n, e[n]));
		if (e.shelf_days != null && n.push(E("settings.category.shelf_short", { days: Y(t, this.hass, "shelf_days", e.shelf_days) })), e.opened_days != null && H("opened") && n.push(E("settings.category.opened_short", { days: Y(t, this.hass, "opened_days", e.opened_days) })), e.food === 0 && n.push(E("settings.food.no")), e.min_stock != null) {
			let r = Y(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(E("settings.category.min", { value: `${W(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(E("settings.category.min", { value: E("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = Mn[e];
		return y`
      <nav aria-label=${E("settings.nav")}>
        ${this.sections.map((t) => y`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${E(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? y`<p class="error" role="alert">${this.pageError}</p>` : x}
      ${this.data ? t ? y`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${E(Pn[t])}
                  </button>
                </div>
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : e === "meals" ? y`<home-inventory-meal-times .hass=${this.hass}></home-inventory-meal-times>` : y`<home-inventory-defaults
                  .hass=${this.hass}
                  .data=${this.data}
                  @home-inventory-saved=${this.load}
                ></home-inventory-defaults>` : x}
      <home-inventory-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @home-inventory-saved=${this.load}
      ></home-inventory-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? x : y`<p class="empty">${E("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = x, a = x) {
		return y`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" data-testid="settings-row" @click=${n}>
        <span>${e}</span>${t ? y`<span class="detail">${t}</span>` : x}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return M({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "location" ? {
				onMove: () => this.renderRoot.querySelector("home-inventory-move-location").open(t),
				moveLabel: E("settings.location.move_name", { name: t.name })
			} : {},
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: E("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await Gn(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await R(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return y`<ul>
        ${e.map((e) => this.row(e.name, "", () => this.open("location", e), 0, x, this.actions("location", e)))}
      </ul>
      ${this.empty(e)}
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
				t.recipe_only ? E("settings.unit.recipe_only") : "",
				n ? `= ${W(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? E("settings.unit.no_conversion") : t.is_count ? E("settings.unit.count") : ""
			].filter(Boolean).join(" · ");
		};
		return y`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, x, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return y`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? jt(r, () => this.toggle(e.id)) : y`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-settings", Kn);
//#endregion
//#region src/stock-data.ts
function qn(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => G(e.join(" "), a), s = /* @__PURE__ */ new Map();
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
		q(i?.categories, e.category_id)
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
var Jn = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${P()}T00:00`)) / 864e5);
function Yn(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = Jn(e.expires_on);
	return i < 0 ? "expired" : i <= (r ?? Number(t?.warn_days ?? J(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function Xn(e, t, n, r) {
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
//#region src/booking-done.ts
function Zn(e, t, n, r) {
	return e ? y`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? y`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${E("stock.undo")}
          </button>` : x}
    ${r ?? x}
  </p>` : x;
}
var Qn = s`
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
//#region src/take-out.ts
async function $n(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await qt(e.hass);
	} catch (t) {
		e.undo = n, e.error = await R(e.hass, t);
	}
}
var er = (e, t, n) => $n(e, async () => {
	let { taken: r } = await Wt(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), tr = (e) => {
	let t = e.undo;
	if (t) return $n(e, async () => {
		await Gt(e.hass, t.taken);
	});
}, nr = (e, t, n, r) => {
	let i = E("stock.take_one", { name: t });
	return y`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => er(e, t, n)}
  >
    ${k(st)}
  </button>`;
}, rr = (e, t) => Zn(e.undo ? E("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => tr(e)), t), ir = (e, t) => e.callWS({
	type: "home_inventory/open_package",
	...t
}), ar = (e, t) => e.callWS({
	type: "home_inventory/open_label",
	code: t
}), or = (e, t) => e.callWS({
	type: "home_inventory/open_undo",
	booking_id: t
}), sr = (e, t) => e.dispatchEvent(new CustomEvent("home-inventory-print-label", {
	detail: {
		id: t.batch_id,
		name: t.name,
		packages: 1
	},
	bubbles: !0,
	composed: !0
}));
function cr(e, t, n, r, i) {
	return t ? Zn(t.expires_on ? E("stock.opened_until", {
		name: t.name,
		date: U(e, t.expires_on)
	}) : E("stock.opened_one", { name: t.name }), n, i, y`<button type="button" class="undo" data-testid=${`${i}-label`} @click=${r}>
      ${E("stock.opened_label")}
    </button>`) : x;
}
async function lr(e, t) {
	let n = e.opened;
	e.error = "", e.opened = void 0;
	try {
		e.opened = await t(), e.stock = await qt(e.hass);
	} catch (t) {
		e.opened = n, e.error = await R(e.hass, t);
	}
}
var ur = (e) => {
	let t = e.opened;
	if (t) return lr(e, () => or(e.hass, t.booking_id).then(() => void 0));
}, dr = (e, t, n) => {
	if (n.opened_on) return x;
	let r = E("stock.open_one", { name: t });
	return y`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${r}
    title=${r}
    @click=${() => lr(e, () => ir(e.hass, {
		product_id: n.product_id,
		batch_id: n.batch_id,
		location_id: n.location_id
	}))}
  >
    ${k(ct)}
  </button>`;
}, fr = (e) => y`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${E("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${E("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => y`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${E("stock.with_empty")}
    </label>`, pr = s`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, mr = s`
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
`, hr = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
}), gr = (e) => Object.fromEntries([
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
function _r(e) {
	let t = {};
	return e.name.trim() || (t.name = E("valid.required")), e.category_id == null && !e.new_type && (t.category = E("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = E("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = E("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = E("valid.packages")), t;
}
function vr(e, t, n, r = {}, i) {
	return y`<label>
      <span class="lbl">${E("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${N(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${E("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${E("book.category")}</span>
      <home-inventory-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></home-inventory-category-picker>
      ${N(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${E("tip.content")}>${E("book.content")}</span>
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
		n("content_amount", I(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${E("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${E("common.none_dash")}</option>
          ${z(e?.units ?? [], t.content_unit_id).map((e) => y`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${N(r.content, "content")}
    <label>
      <span class="lbl" title=${E("tip.product_min_packages")}>${E("products.min_packages")}</span>
      ${Tn({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: E("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${N(r.min_packages, "min-packages")}
    </label>`;
}
function yr(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${W(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/product-dialog.ts
var br = [
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
	"min_packages"
], xr = class extends T {
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
		let t = _r(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = E("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = E("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = E("valid.days")), e.shelf_days != null && !(Number.isInteger(e.shelf_days) && e.shelf_days >= 1) && (t.shelf_days = E("valid.shelf_days")), e.opened_days != null && !(Number.isInteger(e.opened_days) && e.opened_days >= 1) && (t.opened_days = E("valid.shelf_days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of br) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await Yt(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return y`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => J(this.md, e.category_id, t);
		return j({
			title: E("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: y`${vr(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${E("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${N(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl" title=${E("tip.default_location_id")}
            >${E("settings.category.location")}</span
          >
          ${wn({
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
          <span class="lbl" title=${E("tip.expiry_type")}
            >${E("settings.category.expiry_type")}</span
          >
          ${wn({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, E(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${E("tip.warn_days")}>${E("settings.category.warn_days")}</span>
          ${Tn({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => xn(this.hass, e),
				suffix: E("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${N(t.warn_days, "warn-days")}
        </label>
        <label>
          <span class="lbl" title=${E("tip.shelf_days")}>${E("settings.category.shelf_days")}</span>
          ${Tn({
				testid: "shelf-days",
				own: e.shelf_days,
				dflt: n("shelf_days"),
				format: (e) => xn(this.hass, e),
				suffix: E("common.days_unit"),
				invalid: !!t.shelf_days,
				onChange: (e) => this.set("shelf_days", e)
			})}
          ${N(t.shelf_days, "shelf-days")}
        </label>
        ${H("opened") ? y`<label>
                <span class="lbl" title=${E("tip.opened_days")}
                  >${E("settings.category.opened_days")}</span
                >
                ${Tn({
				testid: "opened-days",
				own: e.opened_days,
				dflt: n("opened_days"),
				format: (e) => xn(this.hass, e),
				suffix: E("common.days_unit"),
				invalid: !!t.opened_days,
				onChange: (e) => this.set("opened_days", e)
			})}
                ${N(t.opened_days, "opened-days")}
              </label>` : ""}`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => br.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-product-dialog", xr);
//#endregion
//#region src/batch-dialog.ts
var Sr = class extends T {
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
		return F(e.dateBad, e.expires_on) && (t.expires = E("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = E("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await Kt(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return y`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return j({
			title: E("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: y`<label>
          <span class="lbl">
            ${E("book.expires_on_type", { type: E(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? N(t.expires, "batch-expires") : y`<span class="detail">${E("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${E("book.packages")}</span>
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
          ${t.packages ? N(t.packages, "batch-packages") : y`<span class="detail">${E("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-batch-dialog", Sr);
//#endregion
//#region src/label-print.ts
function Cr(e, t, n, r) {
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
async function wr(e, t, n) {
	if (n > 2 && !await O({
		title: E("label.confirm_many", { n }),
		action: E("label.submit")
	})) return null;
	let r = await Zt(e, {
		batch_id: t,
		count: n
	});
	return "printed" in r ? r.printed : (Cr(r.image, r.count, r.width_mm, r.height_mm), 0);
}
//#endregion
//#region src/label-dialog.ts
var Tr = class extends T {
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
			let e = await wr(this.hass, this.batch.id, Number(this.count));
			if (e === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-printed", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return y`<dialog></dialog>`;
		let t = this.invalid();
		return j({
			title: E("label.title", { name: e.name }),
			body: y`<label>
        <span class="lbl">${E("label.count")}</span>
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
        ${t ? N(E("valid.label_count", { max: 20 }), "label-count") : y`<span class="detail">${E("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: E("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-label-dialog", Tr);
//#endregion
//#region src/api-purchase.ts
var Er = (e, t) => e.callWS({
	type: "home_inventory/receipt_read",
	text: t
}), Dr = (e, t, n) => e.callWS({
	type: "home_inventory/receipt_book",
	store: t,
	items: n
}), Or = [
	"day",
	"week",
	"month"
], kr = [
	0,
	1,
	2,
	3,
	4
], X = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, Z = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Q = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), Ar = (e, t) => X(Q(Z(e), t)), jr = (e) => Q(e, -((e.getDay() + 6) % 7));
function Mr(e, t) {
	return e === "day" ? [t, Q(t, 1)] : e === "week" ? [jr(t), Q(jr(t), 7)] : [jr(new Date(t.getFullYear(), t.getMonth(), 1)), Q(jr(new Date(t.getFullYear(), t.getMonth() + 1, 0)), 7)];
}
var Nr = (e, t, n) => e === "month" ? new Date(t.getFullYear(), t.getMonth() + n, 1) : Q(t, n * (e === "week" ? 7 : 1)), Pr = (e) => e?.locale?.language;
//#endregion
//#region src/receipt-row.ts
function Fr(e) {
	let t = {};
	return e.choice === null && (t.choice = E("receipt.choose")), e.choice === "skip" || (e.choice === "new" && !e.name.trim() && (t.name = E("valid.required")), e.choice === "new" && e.category_id == null && (t.category = E("valid.required")), Number.isInteger(e.packages) && e.packages >= 1 && e.packages <= 9999 || (t.packages = E("valid.packages")), F(e.dateBad, e.expires_on) && (t.expires = E("valid.date"))), t;
}
function Ir(e, t) {
	let n = typeof e.choice == "number" ? e.item.candidates.find((t) => t.id === e.choice)?.shelf_days : e.choice === "new" ? J(t, e.category_id, "shelf_days")?.value : void 0;
	return n ? Ar(P(), Number(n)) : "";
}
function Lr(e) {
	let { r: t, i: n } = e, r = Fr(t), i = `r${n}`, a = t.choice === null ? "" : String(t.choice), o = !t.expires_on && Ir(t, e.md) ? E("receipt.guess_hint") : "";
	return y`<li data-testid="receipt-row">
    <div class="text">${t.item.text}</div>
    <label>
      <span class="lbl">${E("receipt.product")}</span>
      <select
        data-testid="receipt-product"
        aria-invalid=${!!r.choice}
        .value=${a}
        @change=${(t) => {
		let n = t.target.value;
		e.set({ choice: n === "new" || n === "skip" ? n : Number(n) });
	}}
      >
        <option value="" disabled ?selected=${a === ""}>${E("receipt.choose_option")}</option>
        ${t.item.candidates.map((e) => y`<option value=${e.id} ?selected=${a === String(e.id)}>
              ${e.brand ? `${e.name} (${e.brand})` : e.name}
            </option>`)}
        <option value="new" ?selected=${a === "new"}>${E("receipt.new")}</option>
        <option value="skip" ?selected=${a === "skip"}>${E("receipt.skip")}</option>
      </select>
      ${N(r.choice, `${i}-product`)}
    </label>
    ${t.choice === "new" ? y`<label>
              <span class="lbl">${E("common.name")}</span>
              <input
                data-testid="receipt-name"
                aria-invalid=${!!r.name}
                .value=${t.name}
                @input=${(t) => e.set({ name: t.target.value })}
              />
              ${N(r.name, `${i}-name`)}
            </label>
            <div>
              <span class="lbl">${E("book.category")}</span>
              <home-inventory-category-picker
                .categories=${e.md?.categories ?? []}
                .value=${t.category_id}
                .hass=${e.hass}
                @change=${(t) => e.set({ category_id: t.detail })}
              ></home-inventory-category-picker>
              ${N(r.category, `${i}-category`)}
            </div>` : x}
    ${t.choice === "skip" ? x : y`<div class="pair">
            <label>
              <span class="lbl">${E("book.packages")}</span>
              <input
                type="number"
                min="1"
                max="9999"
                data-testid="receipt-packages"
                aria-invalid=${!!r.packages}
                .value=${String(t.packages)}
                @input=${(t) => e.set({ packages: Number(t.target.value) })}
              />
              ${N(r.packages, `${i}-packages`)}
            </label>
            <label>
              <span class="lbl">${E("book.expires_on")}</span>
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
              ${r.expires ? N(r.expires, `${i}-expires`) : y`<span class="detail">${o}</span>`}
            </label>
          </div>`}
  </li>`;
}
var Rr = s`
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
//#endregion
//#region src/ocr.ts
async function zr(t, n) {
	let { createWorker: r } = await import("./src-MUpJjT8c.js").then((t) => /* @__PURE__ */ e(t.default, 1)), i = await r("deu", 1, { logger: (e) => {
		e.status === "recognizing text" && n(e.progress);
	} });
	try {
		return (await i.recognize(t)).data.text;
	} finally {
		await i.terminate();
	}
}
//#endregion
//#region src/photo.ts
async function Br(e, t) {
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = document.createElement("canvas");
	return i.width = Math.round(n.width * r), i.height = Math.round(n.height * r), i.getContext("2d").drawImage(n, 0, 0, i.width, i.height), n.close(), i;
}
var Vr = async (e, t = 2e3) => (await Br(e, t)).toDataURL("image/jpeg", .85), Hr = "https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.12.0-release.1/dist/opencv.js", Ur;
function Wr() {
	return Ur ??= new Promise((e, t) => {
		let n = document.createElement("script");
		n.src = Hr, n.async = !0, n.onerror = () => {
			Ur = void 0, t(/* @__PURE__ */ Error("opencv"));
		}, n.onload = () => {
			let n = Date.now(), r = () => {
				let i = window.cv;
				i?.Mat ? e({ cv: i }) : Date.now() - n > 6e4 ? t(/* @__PURE__ */ Error("opencv")) : setTimeout(r, 100);
			};
			r();
		}, document.head.append(n);
	}), Ur;
}
var Gr = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
function Kr(e) {
	let t = (t) => [...e].sort((e, n) => t(e) - t(n)), n = t((e) => e.x + e.y), r = t((e) => e.y - e.x);
	return [
		n[0],
		r[0],
		n[3],
		r[3]
	];
}
var qr = (e, t) => [
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
function Jr(e, t) {
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
				t.delete(), c = Kr(i), l = r;
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
function Yr(e, t, n) {
	let [r, i, a, o] = n, s = Math.max(1, Math.round(Math.max(Gr(r, i), Gr(o, a)))), c = Math.max(1, Math.round(Math.max(Gr(r, o), Gr(i, a)))), l = e.imread(t), u = e.matFromArray(4, 1, e.CV_32FC2, n.flatMap((e) => [e.x, e.y])), d = e.matFromArray(4, 1, e.CV_32FC2, [
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
//#endregion
//#region src/scan-corners.ts
var Xr = .01, Zr = class extends T {
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
		let n = Xr * Math.max(this.image.width, this.image.height), r = {
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
		return y`<div class="frame">
      ${this.image}
      <svg
        viewBox="0 0 ${e} ${t}"
        preserveAspectRatio="none"
        @pointermove=${(e) => this.dragging >= 0 && this.move(this.dragging, this.at(e))}
        @pointerup=${() => this.dragging = -1}
        @pointercancel=${() => this.dragging = -1}
      >
        <polygon points=${this.quad.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
        ${this.quad.map((e, t) => Oe`<circle
              cx=${e.x}
              cy=${e.y}
              r=${n}
              tabindex="0"
              role="slider"
              data-testid="scan-corner"
              aria-label=${E(`scan.corner_${t}`)}
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
customElements.define("home-inventory-scan-corners", Zr);
//#endregion
//#region src/camera-dialog.ts
var Qr = 480, $r = 1e3, ei = 200;
function ti(e, t, n, r) {
	let i = Math.max(1, Math.max(t, n) / r), a = document.createElement("canvas");
	return a.width = Math.round(t / i), a.height = Math.round(n / i), a.getContext("2d").drawImage(e, 0, 0, a.width, a.height), {
		canvas: a,
		f: i
	};
}
var ni = (e, t) => e?.map((e) => ({
	x: e.x * t,
	y: e.y * t
})) ?? null, ri = class extends T {
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
					let { canvas: t, f: n } = ti(e, e.videoWidth, e.videoHeight, Qr);
					this.live = ni(Jr(this.cv, t), n);
				}
				this.timer = window.setTimeout(this.tick, ei);
			}
		}, this.closed = () => {
			this.stop(), this.still = void 0, this.finish();
		}, this.scan = !1, this.quad = [], this.live = null, this.video = {
			w: 0,
			h: 0
		}, this.running = this.ready = !1, this.error = "", this.busy = !1;
	}
	async show(e, t) {
		this.done?.(void 0), this.scan = e, this.still = t, this.live = null, this.error = "", this.busy = !1, this.quad = t ? qr(t.width, t.height) : [];
		let n = new Promise((e) => this.done = e);
		return await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), e && Wr().then(({ cv: e }) => {
			this.cv = e, this.ready = !0, this.still && this.findOutline();
		}, () => this.error = E("camera.no_scan")), n;
	}
	take(e) {
		let t = this.show(e);
		return this.updateComplete.then(() => this.start()), t;
	}
	edit(e) {
		return this.show(!0, e);
	}
	async start() {
		if (!navigator.mediaDevices?.getUserMedia) return void (this.error = E("scan.https"));
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
			this.stop(), this.error = E("scan.no_camera");
			return;
		}
		this.scan && (this.timer = window.setTimeout(this.tick, ei));
	}
	findOutline() {
		let e = this.still, { canvas: t, f: n } = ti(e, e.width, e.height, $r);
		this.quad = ni(Jr(this.cv, t), n) ?? qr(e.width, e.height);
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
		if (t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0), this.stop(), !this.scan) return this.finish(await Vr(t));
		this.quad = this.live ?? qr(t.width, t.height), this.still = t;
	}
	async apply(e) {
		this.busy = !0;
		let t = this.still, n = e ? Yr(this.cv, t, this.quad).toDataURL("image/png") : await Vr(t, 3e3);
		this.busy = !1, this.finish(n);
	}
	liveView() {
		let { w: e, h: t } = this.video;
		return y`<div class="frame">
        <video muted playsinline></video>
        ${this.live && e ? y`<svg viewBox="0 0 ${e} ${t}" preserveAspectRatio="none">
                <polygon points=${this.live.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
              </svg>` : x}
      </div>
      ${this.scan ? y`<p class="detail">${E("camera.live_hint")}</p>` : x}`;
	}
	cornerView() {
		return y`<home-inventory-scan-corners
        .image=${this.still}
        .quad=${this.quad}
        @change=${(e) => this.quad = e.detail}
      ></home-inventory-scan-corners>
      <p class="detail">${E("camera.corners_hint")}</p>`;
	}
	actions() {
		return this.still ? y`<button
          type="button"
          data-testid="camera-uncut"
          ?disabled=${this.busy}
          @click=${() => this.apply(!1)}
        >
          ${E("camera.uncut")}
        </button>
        <button
          type="button"
          class="primary"
          data-testid="camera-apply"
          ?disabled=${this.busy || !this.ready}
          @click=${() => this.apply(!0)}
        >
          ${E("camera.apply")}
        </button>` : y`<button
      type="button"
      class="primary"
      data-testid="camera-capture"
      ?disabled=${!this.running}
      @click=${() => this.capture()}
    >
      ${E("camera.capture")}
    </button>`;
	}
	render() {
		return y`<dialog data-testid="camera" @close=${this.closed} @click=${A()}>
      <h2>${E(this.scan ? "camera.title_scan" : "camera.title")}</h2>
      ${this.still ? this.cornerView() : this.liveView()}
      ${this.error ? y`<p class="error" role="alert">${this.error}</p>` : x}
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${E("common.cancel")}</button>
        ${this.actions()}
      </div>
    </dialog>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-camera", ri);
//#endregion
//#region src/receipt-import.ts
var ii = 3e3, ai = class extends T {
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
		this.image = this.rows = void 0, this.store = this.status = this.error = "", this.active = !0, Xt(this.hass).then((e) => this.prefill = e.prefill_expiry, () => void 0), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	guess(e) {
		return Ir(e, this.md);
	}
	set(e, t) {
		let n = [...this.rows], r = n[e], i = {
			...r,
			...t
		};
		this.prefill && !("expires_on" in t) && r.expires_on === this.guess(r) && (i.expires_on = this.guess(i)), n[e] = i, this.rows = n;
	}
	invalid() {
		return this.rows ? !!this.status || this.rows.some((e) => Object.keys(Fr(e)).length) : !this.image || !!this.status;
	}
	async read() {
		let e = this.hass;
		this.status = E("receipt.ocr", { percent: "0" });
		try {
			let t = await zr(this.image, (e) => {
				this.status = E("receipt.ocr", { percent: String(Math.round(e * 100)) });
			});
			if (!t.trim()) throw Error(E("receipt.no_text"));
			this.status = E("receipt.ai");
			let n = await Er(e, t.slice(0, 8e3));
			if (!n.items.length) throw Error(E("receipt.no_items"));
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
			this.error = t instanceof Error ? t.message : await R(e, t);
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
		this.status = E("receipt.booking");
		try {
			let t = await Dr(this.hass, this.store.trim(), e);
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("booked", { detail: t.booked }));
		} catch (e) {
			this.error = await R(this.hass, e);
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
			r = await Br(n, ii);
		} catch {
			this.error = E("receipt.photo_invalid");
			return;
		}
		let i = await this.camera().edit(r);
		i && (this.image = i);
	}
	pickStep() {
		return y`<button
        type="button"
        class="scan"
        data-testid="receipt-scan"
        ?disabled=${!!this.status}
        @click=${() => this.scanReceipt()}
      >
        ${k(Je)} ${E("receipt.scan")}
      </button>
      <label>
        <span class="lbl">${E("receipt.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="receipt-photo"
          ?disabled=${!!this.status}
          @change=${(e) => this.pickFile(e)}
        />
      </label>
      ${this.image ? y`<img
              class="preview"
              data-testid="receipt-preview"
              src=${this.image}
              alt=${E("receipt.preview")}
            />` : x}
      <p class="detail">${E("receipt.photo_hint")}</p>`;
	}
	reviewStep(e) {
		return y`<label>
        <span class="lbl">${E("receipt.store")}</span>
        <input
          data-testid="receipt-store"
          maxlength="100"
          .value=${this.store}
          @input=${(e) => this.store = e.target.value}
        />
        <span class="detail">${E("receipt.store_hint")}</span>
      </label>
      <ul class="rows">
        ${e.map((e, t) => Lr({
			r: e,
			i: t,
			md: this.md,
			hass: this.hass,
			set: (e) => this.set(t, e)
		}))}
      </ul>`;
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.status ? y`<div class="busy" role="status" data-testid="receipt-busy">
          <progress aria-label=${this.status}></progress><span>${this.status}</span>
        </div>` : x, t = this.rows?.filter((e) => e.choice !== "skip").length ?? 0;
		return y`${j({
			title: E("receipt.title"),
			body: y`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${e}`,
			error: this.error,
			invalid: this.invalid(),
			submit: this.rows ? {
				label: E("receipt.book", { count: String(t) }),
				testid: "receipt-book"
			} : {
				label: E("receipt.read"),
				testid: "receipt-read"
			},
			dirty: () => !!(this.image || this.rows),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [
			D,
			Rr,
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
customElements.define("home-inventory-receipt-import", ai);
//#endregion
//#region src/scanner.ts
var oi = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function si() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: oi.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-Dml86taW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...oi] });
}
var ci = class extends T {
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
			this.error = E("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = E("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await si();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = E("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = E("scan.no_camera");
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
		return y`<dialog data-testid="scanner" @close=${this.stop} @click=${A()}>
      <h2>${E("scan.title")}</h2>
      ${this.error ? y`<p class="error" role="alert">${this.error}</p>` : y`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${E("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [D, s`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("home-inventory-scanner", ci);
//#endregion
//#region src/booking-scan.ts
var li = class extends T {
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
		return y`
      <form class="scan" @submit=${this.submit}>
        <slot name="before"></slot>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${E("book.input")}
          placeholder=${E("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${E("book.camera")}
          @click=${() => this.renderRoot.querySelector("home-inventory-scanner")?.open()}
        >
          ${k(Ke)}<span>${E("book.camera")}</span>
        </button>
      </form>
      <home-inventory-scanner @scan=${this.scanned}></home-inventory-scanner>
    `;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-booking-scan", li);
//#endregion
//#region src/booking-in-fields.ts
function ui(e, t, n, r, i) {
	let a = !n.expires && e.expires_on && e.expires_on < P();
	return y`<label>
    <span class="lbl"
      >${r ? E("book.expires_on_type", { type: E(`settings.expiry.${r}`) }) : E("book.expires_on")}</span
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
    ${n.expires || a ? y`${N(n.expires, "expires")}${a ? N(E("valid.past"), "expires", !0) : ""}` : y`<span class="detail" data-testid="shelf-hint"
            >${i ? E(e.expires_on ? "book.shelf_hint" : "book.guess_hint", {
		days: String(i.value),
		source: i.source
	}) : E("book.no_date_hint")}</span
          >`}
  </label>`;
}
function di(e, t, n, r, i, a) {
	return y`<label>
      <span class="lbl">${E("book.location")}</span>
      ${wn({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${N(i.location, "location")}
    </label>
    ${t.id ? x : y`<label class="check" title=${E("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${E("book.make_default")}
          </label>`}`;
}
function fi(e, t, n) {
	return y`<label class="check" title=${E("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${E("label.print")}
  </label>`;
}
//#endregion
//#region src/booking-pick.ts
var pi = "auto", mi = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), hi = (e, t) => mi(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function gi(e, t, n, r) {
	let i = (e, t) => y`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return y`<fieldset>
    <legend class="lbl">${E("book.which")}</legend>
    ${i(pi, E("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, y`<span
          >${t.expires_on ? U(e, t.expires_on) : E("book.no_date")}${t.opened_on ? ` · ${E("stock.opened")}` : ""}
          · ${t.location} <span class="detail">${E("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var _i = s`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, vi = [
	"name",
	"category_id",
	"content_amount",
	"content_unit_id"
], yi = async (e, t, n) => {
	try {
		let r = await ln(e, {
			...Object.fromEntries(vi.map((e) => [e, t[e]])),
			brand: t.brand,
			ean: t.ean,
			off_json: t.off_json
		});
		if (r.status !== "changes") return { state: { kind: r.status === "ok" ? "ok" : "none" } };
		let i = n(), a = vi.filter((e) => e in r && i[e] === t[e]);
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
			message: await R(e, t)
		} };
	}
}, bi = async (e, t, n) => {
	let { id: r } = await Bt(e, t.new_type.name, t.new_type.parent_id);
	return B(e).then((e) => n.dispatchEvent(new CustomEvent("master", { detail: e })), () => void 0), {
		...t,
		category_id: r,
		new_type: void 0
	};
}, xi = (e, t, n) => {
	let r = [];
	if ("name" in n && r.push(n.name || "–"), "category_id" in n && r.push(t?.categories.find((e) => e.id === n.category_id)?.name ?? "–"), "content_amount" in n || "content_unit_id" in n) {
		let i = t?.units.find((e) => e.id === n.content_unit_id)?.symbol ?? "";
		r.push(n.content_amount == null ? "–" : K(e, n.content_amount, i));
	}
	return r.join(", ");
}, Si = (e, t, n, r) => {
	switch (e.kind) {
		case "running": return y`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${E("book.ai.running")}></progress>
        <span>${E("book.ai.running")}</span>
      </div>`;
		case "ok": return y`<p class="ai" role="status" data-testid="product-ai-status">
        ${E("book.ai.ok")}
      </p>`;
		case "failed": return y`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${e.message}
      </p>`;
		case "changed": return y`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${E("book.ai.changed", {
			reason: e.reason,
			before: xi(t, n, e.before)
		})}</span
        >
        ${e.newType ? y`<span data-testid="product-ai-new-type"
                >${E("book.ai.new_type", {
			name: e.newType.name,
			parent: n?.categories.find((t) => t.id === e.newType.parent_id)?.name ?? "–"
		})}</span
              >` : x}
        <button type="button" data-testid="product-ai-undo" @click=${() => r(e.before)}>
          ${E("book.ai.undo")}
        </button>
      </div>`;
		default: return x;
	}
}, Ci = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: pi,
	print: null
}), wi = (e) => e?.category_id ?? e?.new_type?.parent_id ?? null, Ti = null, Ei = class extends T {
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
		}), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Ci(), this.ai = { kind: "none" };
	}
	willUpdate(e) {
		if (e.has("product")) {
			this.draft = this.product, this.f = {
				...Ci(),
				expires_on: this.prefill() ? this.proposal() : ""
			}, this.initial = JSON.stringify(this.f), this.ai = { kind: "none" };
			let e = this.product;
			this.hass && this.mode === "in" && e && !e.id && e.off_json && this.check(e), this.hass && this.mode === "in" && Xt(this.hass).then((e) => {
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
		let t = await yi(this.hass, e, () => this.draft);
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
			source: E("book.from_product")
		};
		let n = J(this.md, wi(this.draft), e);
		if (n) return n;
		if (e === "default_location_id" && Ti != null) return {
			value: Ti,
			source: E("book.last_used")
		};
	}
	prefill() {
		return !!this.labels?.prefill_expiry;
	}
	proposal() {
		let e = this.mode === "in" ? this.dflt("shelf_days") : void 0;
		return e ? Ar(P(), Number(e.value)) : "";
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (!t.id && t.new_type && t.category_id == null) {
			let e = await this.run(() => bi(n, t, this));
			if (!e) return;
			t = this.draft = e;
		}
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : gr(t);
			o && this.f.makeDefault && e !== J(this.md, wi(t), "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => Ut(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (Ti = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => wr(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = mi(this.stock, this.f.pick), i = await this.run(() => Wt(n, {
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
		let s = E(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${E("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return x;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? y`<h2>${E("book.title_out", { name: e.name })}</h2>
            <p class="empty" data-testid="no-stock">${E("book.no_stock")}</p>
            <div class="actions">${this.cancelButton()}</div>` : x;
		let n = this.mode === "out" ? hi(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return y`<form class="book" @submit=${this.submit}>
      ${t ? y`<h2>
              ${E("book.title_out", { name: e.name })}${e.brand ? y` <span class="detail">${e.brand}</span>` : x}
            </h2>` : y`<h2>${E("book.title_in")}</h2>
              ${Si(this.ai, this.hass, this.md, (e) => (this.ai = { kind: "none" }, this.setFields(e)))}
              <p class="summary" data-testid="summary">
                ${yr(this.md, e, q(this.md?.categories, e.category_id), this.hass) || E("book.new_product")}
                ${e.id ? x : y`<span class="detail">${E("book.is_new")}</span>`}
              </p>`}
      ${t ? gi(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : y`${e.id ? x : vr(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${ui(this.f, this.set, r, this.dflt("expiry_type")?.value, !this.f.expires_on || this.f.expires_on === this.proposal() ? this.dflt("shelf_days") : void 0)}`}
      <label>
        <span class="lbl">${E("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? x}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${N(r.packages, "packages")}
      </label>
      ${t ? x : y`${di(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${fi(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        ${this.cancelButton()}
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${E(`book.submit_${this.mode}`)}
        </button>
      </div>
    </form>`;
	}
	cancelButton() {
		return y`<button
      type="button"
      data-testid="cancel"
      @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
    >
      ${E("common.cancel")}
    </button>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? _r(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (F(i, r) && (t.expires = E("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = E("valid.location")));
		let a = this.mode === "out" ? hi(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = E("valid.packages") : a != null && n > a && (t.packages = E("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			D,
			_i,
			Ct,
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
customElements.define("home-inventory-booking-form", Ei);
//#endregion
//#region src/booking-hits.ts
function Di(e, t) {
	return y`
    ${e.length ? x : y`<p class="empty">${E("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => y`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    <div class="actions after">
      <button type="button" data-testid="cancel" @click=${t.cancel}>${E("common.cancel")}</button>
      ${t.more ? y`${t.online || !vn() ? x : y`<button
                      data-testid="search-online"
                      ?disabled=${t.busy}
                      @click=${t.searchOnline}
                    >
                      ${E("book.search_online")}
                    </button>`}
              <button data-testid="new-product" @click=${t.create}>
                ${E("book.new_product")}
              </button>` : x}
    </div>
  `;
}
//#endregion
//#region src/booking-modes.ts
var Oi = [
	["search", rt],
	["in", ut],
	["out", ot],
	["open", ct]
], ki = (e, t) => y`<div slot="before" class="modes" role="group" aria-label=${E("stock.mode")}>
    ${Oi.filter(([e]) => e !== "open" || H("opened")).map(([n, r]) => y`<button
          type="button"
          data-testid=${`mode-${n}`}
          aria-pressed=${n === e}
          aria-label=${E(`stock.mode_${n}`)}
          title=${E(`stock.mode_${n}`)}
          @click=${() => t(n)}
        >
          ${k(r)}
        </button>`)}
  </div>`, Ai = s`
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
`, ji = (e, t) => {
	t !== void 0 && (e.message = t), e.dispatchEvent(new CustomEvent("booked")), e.focusInput();
};
async function Mi(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(() => tn(e.hass, t));
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.undo = r.taken, ji(e, E("book.done_label", {
			name: r.name,
			where: r.location
		}));
	}
}
async function Ni(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.opened = r, ji(e);
	}
}
async function Pi(e) {
	let { undo: t, opened: n } = e;
	if (e.undo = e.opened = void 0, await e.run(() => n ? or(e.hass, n.booking_id) : Gt(e.hass, t)) === void 0) return void (e.undo = t, e.opened = n);
	ji(e, E(n ? "book.undone_open" : "book.undone"));
}
var Fi = (e) => e.opened ? cr(e.hass, e.opened, () => Pi(e), () => sr(e, e.opened), "open") : Zn(e.message, e.undo && (() => Pi(e))), Ii = /^\d{8,14}$/, Li = /^PTRY:/i, Ri = class extends T {
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
			opened: { state: !0 },
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
			this.reset(), this.message = E("receipt.done", { count: String(e.detail) }), this.undo = void 0, this.dispatchEvent(new CustomEvent("booked"));
		}, this.mode = "search", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = this.opened = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, B(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
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
		this.error = this.hass ? await R(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass || this.mode === "search") return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = this.opened = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, Li.test(e)) {
			let n = e.replace(Li, "");
			return this.mode === "open" ? Ni(this, () => ar(t, n)) : Mi(this, n);
		}
		if (Ii.test(e)) {
			let r = await this.run(() => Vt(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "in" ? this.choose(hr({ ean: e })) : void (this.error = E("book.unknown"));
		}
		let r = await this.run(() => Ht(t, e));
		r && n === this.seq && (this.hits = r, this.mode !== "in" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => Ht(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => Vt(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode !== "in" && !e.id) return void (this.error = E("book.unknown"));
		if (this.mode === "open") return Ni(this, () => ir(this.hass, { product_id: e.id }));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => qt(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("home-inventory-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		let e = !!(this.hits || this.product), t = this.error ? y`<p class="error" role="alert" data-testid="error">${this.error}</p>` : x;
		return y`
      <home-inventory-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      >
        ${ki(this.mode, (e) => this.setMode(e))}
      </home-inventory-booking-scan>
      ${Fi(this)} ${e ? x : t}
      ${this.mode === "in" && hn() ? y`<button
              type="button"
              class="receipt"
              data-testid="receipt-import"
              @click=${() => this.renderRoot.querySelector("home-inventory-receipt-import").open()}
            >
              ${k(dt)} ${E("receipt.open")}
            </button>` : x}
      <home-inventory-receipt-import
        .hass=${this.hass}
        .md=${this.md}
        @booked=${this.receiptBooked}
      ></home-inventory-receipt-import>
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${A(this.dirty)}
        @keydown=${kt(this.dirty)}
        @cancel=${kt(this.dirty)}
      >
        ${this.hits ? y`<h2>${E(`book.pick_${this.mode}`)}</h2>
                ${Di(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(hr({ name: this.query.trim() })),
			cancel: () => this.closed()
		})}` : x}
        ${this.renderForm()} ${e ? t : x}
      </dialog>
    `;
	}
	renderForm() {
		return this.product ? y`<home-inventory-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @master=${(e) => (this.md = e.detail, this.requestUpdate())}
      @cancel=${() => this.closed()}
    ></home-inventory-booking-form>` : x;
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.dispatchEvent(new CustomEvent("booked")), this.focusInput();
	}
	static {
		this.styles = [
			D,
			Qn,
			Ai,
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
customElements.define("home-inventory-booking", Ri);
//#endregion
//#region src/stock-view.ts
var zi = class extends T {
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
			message: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.started = !1, this.reload = async () => {
			let [e, t] = await Promise.all([qt(this.hass), Jt(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await R(this.hass, e);
			}
		}, this.mode = "search", this.filter = "", this.location = null, this.withEmpty = !1, this.open = /* @__PURE__ */ new Set(), this.error = "", this.message = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load()), e.has("undo") && this.undo && (this.opened = void 0), e.has("opened") && this.opened && (this.undo = void 0), [
			"filter",
			"location",
			"withEmpty",
			"stock"
		].some((t) => e.has(t)) && (this.message = "");
	}
	async load() {
		try {
			this.md = await B(this.hass), await this.reload();
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	tree(e) {
		let t = qn(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return Xn(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? this.renderCategory(e.id, e.name, e.packages, e.depth, e.open) : this.renderItem(e.item, e.depth, e.open));
	}
	renderCategory(e, t, n, r, i) {
		return y`<li style="padding-left:${r * 24}px">
      ${jt(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${E("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return Yn(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		let t = e.expires_on ? U(this.hass, e.expires_on) : E("stock.no_date");
		return e.expiry_guessed && (t = E("stock.guessed_date", { date: t })), e.opened_on && (t = E("stock.opened_on", {
			date: t,
			opened: U(this.hass, e.opened_on)
		})), e.charge ? E("stock.charge", {
			date: t,
			charge: e.charge
		}) : t;
	}
	toggle(e) {
		this.open = Mt(this.open, e);
	}
	render() {
		let e = this.error ? y`<p class="error" role="alert">${this.error}</p>` : x;
		return y`${y`<home-inventory-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e) => this.filter = e.detail}
      @booked=${this.saved}
      @home-inventory-print-label=${(e) => this.label(e.detail)}
    ></home-inventory-booking>`} ${e} ${this.stock ? this.list(this.stock) : x}`;
	}
	list(e) {
		let t = this.tree(this.filter.trim() !== "");
		return y`
      ${fr(this)} ${rr(this, "stock")}
      ${cr(this.hass, this.opened, () => ur(this), () => this.label({
			id: this.opened.batch_id,
			name: this.opened.name,
			packages: 1
		}), "opened")}
      ${Zn(this.message, void 0, "label")}
      ${t.length ? y`<ul>
              ${t}
            </ul>` : y`<p class="empty">
              ${E(e.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
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
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => this.message = e.detail ? E("label.printed", { n: e.detail }) : ""}
      ></home-inventory-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("home-inventory-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await Gn(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await R(this.hass, e);
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
		let r = e.batches[0], i = r ? () => this.toggle(`p${e.id}`) : () => this.editProduct(e.id);
		return y`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? jt(n, i) : y`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : x}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, E("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? y` · <span class=${this.status(r)}>${this.date(r)}</span>` : x}
          </span>
        </button>
        ${M({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: L(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? y`<ul class="batches">
              ${e.batches.map((t) => y`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${E("book.count", { n: t.packages })}</span>
                    <span class="acts">
                      ${nr(this, e.name, t, "stock-batch-out")}
                      ${H("opened") ? dr(this, e.name, t) : ""}
                      <button
                        class="icon-btn"
                        data-testid="stock-batch-label"
                        aria-label=${E("label.print_name", { name: e.name })}
                        title=${E("label.print")}
                        @click=${() => this.printBatch(t, e.batches)}
                      >
                        ${k(mt)}
                      </button>
                      ${M({
			testid: "batch",
			name: `${e.name}, ${this.date(t)}`,
			onEdit: () => this.editBatch(t)
		})}
                    </span>
                  </li>`)}
            </ul>` : x}
    </li>`;
	}
	static {
		this.styles = [
			D,
			Qn,
			pr,
			mr
		];
	}
};
customElements.define("home-inventory-stock", zi);
//#endregion
//#region src/expiry-recipes.ts
var Bi = class extends T {
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
			let t = await rn(this.hass, this.days);
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
		return this.list.length ? y`<h2>${E("expiry.recipes")}</h2>
      <ul>
        ${this.list.map((e) => y`<li>
              <button
                type="button"
                class="row"
                data-testid="expiry-recipe"
                @click=${() => this.open(e.recipe_id)}
              >
                <span>${e.name}</span>
                <span class="detail"
                  >${E("expiry.recipe_detail", {
			...e,
			products: e.products.join(", ")
		})}</span
                >
              </button>
            </li>`)}
      </ul>` : x;
	}
	static {
		this.styles = [D, s`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `];
	}
};
customElements.define("home-inventory-expiry-recipes", Bi);
//#endregion
//#region src/expiry-view.ts
var Vi = class extends T {
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
				B(this.hass),
				qt(this.hass),
				Jt(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? E("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(yn(this.hass), { numeric: "auto" }).format(Jn(e), "day");
	}
	render() {
		let e = this.error ? y`<p class="error" role="alert">${this.error}</p>` : x;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: Yn(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return y`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${E("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${E("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${E("common.days_unit")}
        </span>
        ${N(t, "expiry-days")}
      </div>
      ${rr(this, "expiry")}
      ${r.length ? y`<ul>
              ${r.map(({ r: e, status: t }) => y`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}>${U(this.hass, e.expires_on)}</span>
                      <span class="detail"
                        >${this.relative(e.expires_on)}${e.expiry_guessed ? ` · ${E("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[
			e.brand,
			e.opened_on && E("stock.opened"),
			e.location
		].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${E("book.count", { n: e.packages })}</span>
                    ${nr(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : y`<p class="empty">${E("expiry.empty")}</p>`}
      ${H("recipes") ? y`<home-inventory-expiry-recipes
              .hass=${this.hass}
              .days=${n}
              .stock=${this.stock}
            ></home-inventory-expiry-recipes>` : x}
    `;
	}
	static {
		this.styles = [
			D,
			Qn,
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
    `
		];
	}
};
customElements.define("home-inventory-expiry", Vi);
//#endregion
//#region node_modules/lit-html/directive.js
var $ = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Hi = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ui = class {
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
}, { I: Wi } = ze, Gi = (e) => e.strings === void 0, Ki = {}, qi = (e, t = Ki) => e._$AH = t, Ji = Hi(class extends Ui {
	constructor(e) {
		if (super(e), e.type !== $.PROPERTY && e.type !== $.ATTRIBUTE && e.type !== $.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!Gi(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === b || t === x) return t;
		let n = e.element, r = e.name;
		if (e.type === $.PROPERTY) {
			if (t === n[r]) return b;
		} else if (e.type === $.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return b;
		} else if (e.type === $.ATTRIBUTE && n.getAttribute(r) === t + "") return b;
		return qi(e), t;
	}
}), Yi = (e) => e.callWS({ type: "home_inventory/shopping" }), Xi = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), Zi = (e, t) => e.callWS({
	type: "home_inventory/shopping_add",
	...t
}), Qi = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_item",
	item_id: t,
	...n
}), $i = (e, t) => e.callWS({
	type: "home_inventory/shopping_item_delete",
	item_id: t
}), ea = (e) => e.callWS({ type: "home_inventory/shopping_recipes" }), ta = (e, t, n, r) => e.callWS({
	type: "home_inventory/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), na = (e, t) => e.callWS({
	type: "home_inventory/shopping_recipe_remove",
	recipe_id: t
}), ra = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_recipe_done",
	key: t,
	done: n
});
//#endregion
//#region src/shopping-text.ts
function ia(e, t) {
	let n = (t) => K(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : E("shopping.any"), E("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : E("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(E("book.count", { n: t.packages }));
	let i = E(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(E("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function aa(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : K(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: E(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? E("shopping.unknown", { n: r }) : ""
	};
}
//#endregion
//#region src/shopping-row-styles.ts
var oa = s`
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
`, sa = 8, ca = class extends T {
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
			[this.md, this.products] = await Promise.all([B(this.hass), Jt(this.hass)]);
		} catch (e) {
			this.error = await R(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return q(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = E("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, _r(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = E("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = E("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await Qi(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await Zi(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await Zi(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await Zi(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await Zi(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return y`<li>
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
		if (!e) return x;
		let t = (t) => !!t && G(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, sa), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, sa), i = hr({ name: e });
		return y`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, E("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", E("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${L(this.hass) ? this.hit("shopping-new-category", E("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : x}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return y`<label>
          <span class="lbl">${E("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? N(e.what, "shopping-what") : x}
        </label>
        ${this.hits()}`;
		let n = y`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${E("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? y`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : E("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? y`<p class="detail">${E("shopping.add.creates_product")} ${n}</p>
        ${vr(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : y`<p class="detail">${E("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${E("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${N(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${E("settings.category.parent")}</span>
        <home-inventory-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${E("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></home-inventory-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.errors();
		return j({
			title: this.item ? E("common.edit_name", { name: this.item.name }) : E("shopping.add.title"),
			body: y`${this.item ? x : this.what(e)}
        <label>
          <span class="lbl">${E("shopping.add.packages")}</span>
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
				this.packages = I(t);
			}}
            />
            <span class="detail">${E("book.packages")}</span>
          </span>
          ${N(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-shopping-add", ca);
//#endregion
//#region src/shopping-recipe-dialog.ts
var la = class extends T {
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
		let n = (await ea(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await ta(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: E("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await ta(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await R(this.hass, e);
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
		if (!this.active || !this.recipe) return y`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return j({
			title: E("shopping.recipe.title", { name: this.recipe.name }),
			body: y`<label>
          <span class="lbl">${E("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!e.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e) => this.servings = I(e.target.value)}
          />
          ${N(e.servings, "shopping-recipe-servings")}
        </label>
        ${t.length ? y`<fieldset>
                <legend class="lbl">${E("shopping.recipe.optional")}</legend>
                ${t.map((e) => y`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(e.id)}
                        @change=${(t) => this.toggle(e, t.target.checked)}
                      />
                      ${e.text}
                    </label>`)}
              </fieldset>` : x}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: E("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-shopping-recipe-dialog", la);
//#endregion
//#region src/shopping-recipes.ts
var ua = class extends T {
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
			[this.list, this.recipes] = await Promise.all([ea(this.hass), nn(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await Et(e.name)) {
			try {
				await na(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await R(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return y`${this.error ? y`<p class="error" role="alert">${this.error}</p>` : x}
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipe-dialog>
      ${this.list.length ? y`<h3>${E("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => y`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${E("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${Sn(this.hass, e.servings)}</span>
                      ${M({
			testid: "shopping-recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: () => this.removeEntry(e)
		})}
                    </li>`)}
              </ul>` : x}`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-shopping-recipes", ua);
//#endregion
//#region src/shopping-view.ts
var da = class extends T {
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
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), Xt(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await Qt(this.hass);
				this.note = E("shopping.printed", { n: e });
			} catch (e) {
				this.error = await R(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([Yi(this.hass), B(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await Qi(this.hass, e.id, { done: t }) : e.key ? await ra(this.hass, e.key, t) : await Xi(this.hass, e, t);
		} catch (e) {
			return this.error = await R(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await Et(e.name)) {
			this.error = "";
			try {
				await $i(this.hass, e.id);
			} catch (e) {
				return this.error = await R(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("home-inventory-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = ia(this.hass, e), i = aa(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return y`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${Ji(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="line" title=${a}
            ><span class="name">${e.name}</span
            >${r ? y`<span class="amt"> – ${r}</span>` : x}</span
          >
          ${i.uses.length || i.unknown ? y`<span class="refs" data-testid="shopping-refs"
                  >${i.uses.map((e, t) => y`<span title=${e.title} aria-label=${e.title}
                        >${e.text}${t < i.uses.length - 1 ? ";" : ""}</span
                      >`)}${i.unknown ? y`<span class="unknown" title=${i.unknown}>${i.unknown}</span>` : x}</span
                >` : x}
        </span>
      </label>
      ${e.manual ? M({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : x}
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
				i.push(t ? this.row(t, o, !0) : y`<li
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
		let e = this.error ? y`<p class="error" role="alert">${this.error}</p>` : x;
		return !this.items || !this.cats ? e : y`${y`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${E("shopping.add.title")}
        </button>
        ${this.receipt ? y`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${E("shopping.print")}
              </button>` : x}
      </div>
      ${this.note ? y`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : x}
      <home-inventory-shopping-recipes
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipes>
      <home-inventory-shopping-add
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-add>`}
    ${this.items.length ? y`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : y`<p class="empty">${E("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			D,
			oa,
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
customElements.define("home-inventory-shopping", da);
//#endregion
//#region src/recipes-styles.ts
var fa = s`
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
    max-width: 100%;
    max-height: 240px;
    margin-top: 8px;
  }
  a {
    color: var(--primary-color);
  }
`, pa = 2e3, ma = (e) => e.flatMap((e) => [...e.section ? [{
	kind: "head",
	text: e.section
}] : [], {
	kind: "step",
	text: e.text
}]), ha = (e) => (e ?? "").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean).map((e) => ({
	kind: "step",
	text: e
})), ga = (e) => {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		e && (r.kind === "head" ? n = e : (t.push({
			section: n,
			text: e
		}), n = null));
	}
	return t;
}, _a = (e, t = (e) => e.text) => {
	let n = [];
	return e.forEach((e, t) => {
		(e.section || !n.length) && n.push({
			section: e.section,
			first: t,
			steps: []
		}), n[n.length - 1].steps.push(e);
	}), y`${n.map((e) => y`${e.section ? y`<h4 class="section">${e.section}</h4>` : x}
        <ol class="steps" start=${e.first + 1}>
          ${e.steps.map((n, r) => y`<li data-testid="recipe-step">${t(n, e.first + r)}</li>`)}
        </ol>`)}`;
}, va, ya = class extends T {
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
		super.connectedCallback(), va ??= Xt(this.hass).then((e) => e.receipt, () => !1), va.then((e) => this.available = e);
	}
	async run() {
		this.busy = !0;
		try {
			await this.print(), this.note = this.done;
		} catch (e) {
			this.note = await R(this.hass, e);
		} finally {
			this.busy = !1;
		}
	}
	createRenderRoot() {
		return this;
	}
	render() {
		return this.available ? y`<button
        type="button"
        data-testid=${this.testid}
        ?disabled=${this.busy}
        @click=${() => this.run()}
      >
        ${E("common.print")}
      </button>
      ${this.note ? y`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >` : x}` : x;
	}
};
customElements.define("home-inventory-receipt-button", ya);
//#endregion
//#region src/recipe-detail.ts
var ba = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = K(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${E("recipes.approx", { what: K(e, i * a.factor / s.factor, s.symbol) })})`;
}, xa = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? E("recipes.status.missing_plain") : E("recipes.status.missing", { what: K(e, t.missing ?? 0, n) });
		case "partial": return E("recipes.status.partial", {
			have: W(e, t.have ?? 0),
			need: W(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return E("recipes.status.unknown");
		case "skipped": return E("recipes.status.skipped");
		case "unmatched": return E("recipes.status.unmatched");
		default: return E("recipes.status.available");
	}
}, Sa = (e) => {
	let t = e.recipe;
	return y`<div class="detail-box">
    <label class="servings">
      <span class="lbl">${E(V(t) ? "canning.recipe_jars" : "recipes.servings")}</span>
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
      ${e.ingredients.map((n) => y`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[ba(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? y`<span class="detail">${n.note}</span>` : x}
              ${n.optional ? y`<span class="detail">${E("recipes.optional")}</span>` : x}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${xa(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      ${H("shopping") ? y`<button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
              ${E("recipes.to_shopping")}
            </button>` : x}
      ${V(t) ? y`<button type="button" data-testid="recipe-to-canning" @click=${e.onPlan}>
              ${E("canning.add")}
            </button>` : H("plan") ? y`<button type="button" data-testid="recipe-to-plan" @click=${e.onPlan}>
                ${E("recipes.to_plan")}
              </button>` : x}
      <home-inventory-receipt-button
        .hass=${e.hass}
        .print=${() => $t(e.hass, t.id, e.servings)}
        .done=${E("recipes.printed")}
        .testid=${"recipe-print"}
      ></home-inventory-receipt-button>
      ${t.shopping_servings != null && H("shopping") ? y`<span class="detail" data-testid="recipe-on-shopping"
              >${E("recipes.on_shopping", { what: Sn(e.hass, t.shopping_servings) })}</span
            >` : x}
    </p>
    ${V(t) ? y`<p data-testid="recipe-canning">
            ${E("canning.recipe_summary", {
		name: t.canning_product ?? "",
		jars: t.servings
	})}
            ${t.canning_temp == null ? "" : E("recipes.canning", {
		temp: t.canning_temp,
		minutes: t.canning_minutes ?? ""
	})}
          </p>` : x}
    ${t.steps.length ? y`<h3>${E("recipes.instructions")}</h3>
            ${_a(t.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${e.onCook}>
                ${E("cook.open")}
              </button>
            </p>` : t.instructions ? y`<h3>${E("recipes.instructions")}</h3>
              <p class="text">${t.instructions}</p>` : x}
    ${t.source_url ? y`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${E("recipes.source")}</a
            >
          </p>` : x}
    ${t.image_url ? y`<img
            class="photo"
            src=${t.image_url}
            alt=${t.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />` : x}
  </div>`;
}, Ca = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), wa = (e) => e.map((e) => {
	let t = {};
	return Ca(e) || (!e.text.trim() && e.category_id == null && (t.text = E("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = E("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? E("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : E("valid.amount_pair"))), t;
}), Ta = (e, t, n, r) => ({
	name: e.trim() || "-",
	servings: t ?? 1,
	steps: ga(n),
	ingredients: r.map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.unit_id,
		text: e.text.slice(0, 200),
		note: e.note ?? null,
		line: e.line ?? null,
		learned: !!e.learned
	}))
}), Ea = (e, t, n, r, i) => {
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
	let s = JSON.stringify(r.steps) === JSON.stringify(n), c = e.steps && s ? ma(e.steps) : r.steps, l = {
		kind: "changed",
		ingredients: o,
		prevSteps: c === r.steps ? void 0 : r.steps
	};
	return {
		ingredients: a,
		steps: c,
		state: o || l.prevSteps ? l : { kind: "ok" }
	};
}, Da = (e, t) => {
	switch (e.kind) {
		case "running": return y`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${E("recipes.ai.running")}></progress>
        <span>${E("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${t.onSkip}>
          ${E("recipes.ai.skip")}
        </button>
      </div>`;
		case "ok": return y`<p class="ai" role="status" data-testid="ai-status">${E("recipes.ai.ok")}</p>`;
		case "skipped": return y`<p class="ai" role="status" data-testid="ai-status">
        ${E("recipes.ai.skipped")}
      </p>`;
		case "failed": return y`<p class="ai error" role="alert" data-testid="ai-status">${e.message}</p>`;
		case "changed": return y`<div class="ai" role="status" data-testid="ai-status">
        ${e.ingredients ? y`<span
                >${e.ingredients === 1 ? E("recipes.ai.changed_one") : E("recipes.ai.changed_many", { n: e.ingredients })}</span
              >` : x}
        ${e.prevSteps ? y`<span>${E("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${t.onUndoSteps}>
                  ${E("recipes.ai.undo_steps")}
                </button>` : x}
      </div>`;
		default: return x;
	}
}, Oa = (e) => {
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
}, ka = (e, t, n, r) => {
	let i = e.ai;
	if (!i) return x;
	let a = n.find((e) => e.id === i.beforeUnit)?.symbol ?? i.beforeHint, o = [i.cat ? i.beforeText : null, i.unit ? a : null].filter(Boolean);
	return y`<div class="orig" data-testid="ingredient-ai">
    ${e.new_type && i.cat ? E("recipes.ai.new_type", {
		name: e.new_type.name,
		parent: t.find((t) => t.id === e.new_type.parent_id)?.name ?? "–",
		reason: i.reason
	}) : E("recipes.ai.changed", {
		reason: i.reason,
		before: o.join(", ") || "–"
	})}
    <button type="button" data-testid="ingredient-ai-undo" @click=${() => r(Oa(e))}>
      ${E("recipes.ai.undo")}
    </button>
  </div>`;
}, Aa = 8, ja = class extends T {
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
			let t = await Ht(this.hass, e.trim());
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
			await Bt(this.hass, this.creating, e);
			let t = await B(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await R(this.hass, e);
		}
	}
	foods() {
		return this.categories.filter((e) => e.effective.food.value !== 0);
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.foods().filter((t) => G(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, Aa);
	}
	hit(e) {
		let t = q(this.categories, e.cat.parent_id), n = [e.via ? E("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
		return y`<li>
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
		if (!e) return x;
		let t = this.categories.some((t) => t.name.toLocaleLowerCase() === e.toLocaleLowerCase());
		return y`<ul>
      ${this.hits(e).map((e) => this.hit(e))}
      ${t ? x : y`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => this.creating = e}
              >
                <span>${E("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? y`<div class="lbl">${E("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${E("shopping.add.change")}
          </button>
        </p>` : this.creating ? y`<div class="field">
        <span class="lbl">${E("recipes.ingredient.parent", { name: this.creating })}</span>
        <home-inventory-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></home-inventory-category-picker>
        ${this.failure ? y`<p class="error" role="alert">${this.failure}</p>` : x}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${E("common.cancel")}
        </button>
      </div>` : y`<label>
        <span class="lbl">${E("recipes.ingredient.text")}</span>
        ${this.text ? y`<span class="detail">${this.text} – ${E("recipes.ingredient.unmatched")}</span>` : x}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e) => this.input(e.target.value)}
        />
        ${N(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-ingredient-pick", ja);
//#endregion
//#region src/unit-add-dialog.ts
var Ma = class extends T {
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
				let { id: e } = await un(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await B(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await R(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : E("valid.required");
		return j({
			title: E("unit_add.title"),
			body: y`<label>
          <span class="lbl">${E("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${N(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${E("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: E("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [D];
	}
};
customElements.define("home-inventory-unit-add-dialog", Ma);
//#endregion
//#region src/recipe-ingredients.ts
var Na = class extends T {
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
		return y`<li data-testid="ingredient-row" class="ing">
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
          <span class="lbl">${E("recipes.ingredient.amount")}</span>
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
			this.set(t, { amount: I(n) });
		}}
          />
        </label>
        <label>
          <span class="lbl">${E("recipes.ingredient.unit")}</span>
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
            <option value="" .selected=${e.unit_id == null}>${E("recipes.ingredient.none")}</option>
            ${this.units.map((t) => y`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${E("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${N(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? y`<div class="hintline">
              ${N(E("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${E("recipes.ingredient.unit_create")}
              </button>
            </div>` : x}
      ${e.line ? y`<div class="orig" data-testid="ingredient-line">
              ${E("recipes.ingredient.line", { line: e.line })}
            </div>` : x}
      ${ka(e, this.categories, this.units, (e) => this.set(t, e))}
      <label>
        <span class="lbl">${E("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${E("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${E("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${E("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${E("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${E("recipes.ingredient.remove")}
          title=${E("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${k(Qe)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = wa(this.value);
		return y`<home-inventory-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></home-inventory-unit-add-dialog>
      <div class="lbl">${E("recipes.ingredients")}</div>
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
        ${E("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-recipe-ingredients", Na);
//#endregion
//#region src/form-fields.ts
var Pa = (e) => y`<label>
    <span class="lbl">${e.label}</span>
    <span class="num">
      <input
        type="number"
        min="1"
        step="1"
        inputmode="numeric"
        data-testid=${e.testid}
        aria-invalid=${!!e.err}
        .value=${String(e.value ?? "")}
        @input=${(t) => e.onChange(I(t.target.value))}
      />
      ${e.unit}
    </span>
    ${N(e.err, e.testid)}
  </label>`, Fa = (e) => y`<label>
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
    ${N(e.err, e.testid)}
  </label>`;
//#endregion
//#region src/product-input.ts
function Ia(e) {
	let t = `${e.testid}-product`, n = e.products.some((t) => t.name === e.name.trim()), r = !!e.name.trim() && !n;
	return y`<label>
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
        ${e.products.map((e) => y`<option value=${e.name}></option>`)}
      </datalist>
      ${N(e.err.name ?? (r ? E("canning.new_product") : void 0), t, !e.err.name)}
    </label>
    ${r ? y`<div class="field">
            <span class="lbl">${E("book.category")}</span>
            <home-inventory-category-picker
              .categories=${e.md?.categories ?? []}
              .value=${e.categoryId}
              .hass=${e.hass}
              @change=${(t) => e.onCategory(t.detail)}
            ></home-inventory-category-picker>
            ${N(e.err.category, `${t}-category`)}
          </div>` : x}`;
}
//#endregion
//#region src/recipe-steps-editor.ts
var La = (e) => e.text.length > (e.kind === "head" ? 100 : 2e3) ? E("valid.too_long", { n: e.kind === "head" ? 100 : pa }) : void 0, Ra = class extends T {
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
		return y`<button
      type="button"
      class="icon-btn"
      data-testid=${e}
      aria-label=${t}
      title=${t}
      ?disabled=${i}
      @click=${r}
    >
      ${k(n)}
    </button>`;
	}
	render() {
		let e = 0, t = this.value.length - 1;
		return y`<span class="lbl">${E("recipes.instructions")}</span>
      <ol>
        ${this.value.map((n, r) => {
			let i = n.kind === "head" ? E("recipes.steps.head") : E("recipes.steps.step", { n: ++e }), a = La(n), o = (e) => this.emit(this.value.map((t, n) => n === r ? {
				...t,
				text: e.target.value
			} : t));
			return y`<li class=${n.kind}>
            <div class="row">
              <span class="no" aria-hidden="true">${n.kind === "head" ? "" : `${e}.`}</span>
              ${n.kind === "head" ? y`<input
                      data-testid="step-head"
                      aria-label=${i}
                      placeholder=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    />` : y`<textarea
                      rows="2"
                      data-testid="step-text"
                      aria-label=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    ></textarea>`}
              ${this.btn("step-up", E("recipes.steps.up"), Ge, () => this.move(r, -1), r === 0)}
              ${this.btn("step-down", E("recipes.steps.down"), We, () => this.move(r, 1), r === t)}
              ${this.btn("step-remove", E("recipes.steps.remove"), Qe, () => this.emit(this.value.filter((e, t) => t !== r)))}
            </div>
            ${N(a, `step-${r}`)}
          </li>`;
		})}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${E("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${E("recipes.steps.head_add")}
        </button>
      </p>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-recipe-steps", Ra);
//#endregion
//#region src/recipe-draft.ts
var za = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	steps: e?.steps?.length ? ma(e.steps) : ha(e?.instructions ?? null),
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
}), Ba = (e, t) => {
	let n = t?.find((t) => t.name === e.product.trim());
	return {
		name: e.name.trim(),
		servings: e.servings,
		steps: ga(e.steps),
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
		ingredients: e.ingredients.filter((e) => !Ca(e)).map((e) => ({
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
}, Va = class extends T {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 },
			ai: { state: !0 }
		};
	}
	constructor() {
		super(), this.aiRun = 0, this.initial = "", this.canningMode = !1, this.products = [], this.draft = za(), this.active = !1, this.error = "", this.ai = { kind: "none" };
	}
	async open(e, t, n, r = !1) {
		this.md = e, this.recipe = t, this.canningMode = r, r && (this.products = await Jt(this.hass).catch(() => [])), this.draft = za(t ?? n), this.initial = JSON.stringify(n ? za() : this.draft), this.error = "", this.ai = { kind: "none" }, this.aiRun++, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus(), n && this.check();
	}
	async check() {
		let e = ++this.aiRun, t = this.draft, n = t.ingredients;
		this.ai = { kind: "running" };
		try {
			let r = await cn(this.hass, Ta(t.name, t.servings, t.steps, n));
			if (e !== this.aiRun) return;
			if (r.status !== "changes") {
				this.ai = { kind: r.status === "ok" ? "ok" : "none" };
				return;
			}
			let i = Ea(r, n, t.steps, this.draft, this.md);
			this.draft = {
				...this.draft,
				ingredients: i.ingredients,
				steps: i.steps
			}, this.ai = i.state;
		} catch (t) {
			e === this.aiRun && (this.ai = {
				kind: "failed",
				message: await R(this.hass, t)
			});
		}
	}
	errors() {
		let e = this.draft, t = {};
		e.name.trim() || (t.name = E("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = E("valid.servings")), e.source_url.trim() && !Pt.test(e.source_url.trim()) && (t.source_url = E("valid.url")), e.image_url.trim() && !Pt.test(e.image_url.trim()) && (t.image_url = E("valid.url")), this.canningMode && !e.product.trim() ? t.product = E("valid.required") : this.canningMode && !this.products.some((t) => t.name === e.product.trim()) && e.product_category == null && (t.product_category = E("valid.category"));
		let n = e.canning_temp, r = e.canning_minutes;
		return n != null && !(Number.isInteger(n) && n >= 1 && n <= 200) ? t.canning_temp = E("valid.canning_temp") : n == null && r != null && (t.canning_temp = E("valid.required")), r != null && !(Number.isInteger(r) && r >= 1 && r <= 1440) ? t.canning_minutes = E("valid.canning_minutes") : r == null && n != null && (t.canning_minutes = E("valid.required")), {
			e: t,
			bad: wa(e.ingredients).some((e) => Object.keys(e).length) || e.steps.some((e) => La(e))
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await on(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				...Ba(r, this.canningMode ? this.products : null)
			});
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	text(e, t, n, r = "text") {
		return y`<label>
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
      ${N(n, e === "name" ? "recipe-name" : `recipe-${e}`)}
    </label>`;
	}
	canning(e, t, n) {
		return Pa({
			testid: `recipe-${e}`,
			label: E(`recipes.field.${e}`),
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
		if (!this.active) return y`<dialog></dialog>`;
		let { e, bad: t } = this.errors(), n = this.draft;
		return j({
			title: this.recipe ? E("common.edit_name", { name: this.recipe.name }) : E(this.canningMode ? "canning.recipe_add" : "recipes.add"),
			body: y`${Da(this.ai, {
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
        ${this.text("name", E("common.name"), e.name)}
        ${this.canningMode ? Ia({
				testid: "recipe",
				label: E("canning.recipe_makes"),
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
			}) : x}
        <label>
          <span class="lbl"
            >${E(this.canningMode ? "canning.recipe_jars" : "recipes.servings")}</span
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
					servings: I(t)
				};
			}}
          />
          ${N(e.servings, "recipe-servings-input")}
        </label>
        ${this.canningMode ? y`<div class="pair">
                ${this.canning("canning_temp", "°C", e.canning_temp)}
                ${this.canning("canning_minutes", E("recipes.minutes_unit"), e.canning_minutes)}
              </div>` : x}
        ${this.text("source_url", E("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", E("recipes.field.image_url"), e.image_url, "url")}
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
				label: E("common.save"),
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
		this.styles = [D, Ct];
	}
};
customElements.define("home-inventory-recipe-dialog", Va);
//#endregion
//#region src/recipe-import.ts
var Ha = [
	"url",
	"text",
	"photo"
], Ua = 2e4, Wa = class extends T {
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
		this.source = "url", this.url = this.text = this.photo = "", this.error = "", this.busy = !1, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.focusField();
	}
	async focusField() {
		await this.updateComplete, this.renderRoot.querySelector("dialog input, dialog textarea")?.focus();
	}
	errors() {
		if (this.source === "text") return this.text.trim() ? void 0 : E("valid.required");
		if (this.source === "photo") return this.photo ? void 0 : E("valid.required");
		let e = this.url.trim();
		return e ? Pt.test(e) ? void 0 : E("valid.url") : E("valid.required");
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
			this.photo = await Vr(t);
		} catch {
			this.error = E("recipes.import.photo_invalid");
		}
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await sn(this.hass, this.request());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-imported", { detail: e }));
			} catch (e) {
				this.error = await R(this.hass, e);
			}
			this.busy = !1;
		}
	}
	switcher() {
		return y`<div class="sources" role="group" aria-label=${E("recipes.import.source")}>
      ${Ha.map((e) => y`<button
            type="button"
            data-testid=${`recipe-import-source-${e}`}
            aria-pressed=${e === this.source}
            ?disabled=${this.busy}
            @click=${() => {
			this.source = e, this.error = "", this.focusField();
		}}
          >
            ${E(`recipes.import.source_${e}`)}
          </button>`)}
    </div>`;
	}
	field(e) {
		return this.source === "text" ? y`<label>
        <span class="lbl">${E("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${Ua}
          data-testid="recipe-import-text"
          aria-invalid=${!!e}
          .value=${this.text}
          @input=${(e) => this.text = e.target.value}
        ></textarea>
        ${N(e, "recipe-import-text")}
        <span class="note">${E("recipes.import.text_hint")}</span>
      </label>` : this.source === "photo" ? y`<button
          type="button"
          class="take"
          data-testid="recipe-import-camera"
          ?disabled=${this.busy}
          @click=${() => this.takePhoto()}
        >
          ${k(Je)} ${E("recipes.import.take_photo")}
        </button>
        <label>
          <span class="lbl">${E("recipes.import.photo")}</span>
          <input
            type="file"
            accept="image/*"
            data-testid="recipe-import-photo"
            aria-invalid=${!!e}
            @change=${(e) => this.pickPhoto(e)}
          />
          ${N(e, "recipe-import-photo")}
          <span class="note">${E("recipes.import.photo_hint")}</span>
        </label>
        ${this.photo ? y`<img class="preview" src=${this.photo} alt=${E("recipes.import.photo")} />` : x}` : y`<label>
      <span class="lbl">${E("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!e}
        .value=${this.url}
        @input=${(e) => this.url = e.target.value}
      />
      ${N(e, "recipe-import-url")}
      <span class="note">${E(hn() ? "recipes.import.hint_ai" : "recipes.import.hint")}</span>
    </label>`;
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.errors();
		return y`${j({
			title: E("recipes.import.title"),
			body: y`${hn() ? this.switcher() : x} ${this.field(e)}
        ${this.busy ? y`<div class="busy" role="status" data-testid="recipe-import-busy">
                <progress aria-label=${E("recipes.import.busy")}></progress>
                <span>${E(hn() ? "recipes.import.busy_ai" : "recipes.import.busy")}</span>
              </div>` : x}`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: E("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-recipe-import", Wa);
//#endregion
//#region src/api-plan.ts
var Ga = (e, t, n) => e.callWS({
	type: "home_inventory/meal_plan",
	start: t,
	end: n
}), Ka = (e, t) => e.callWS({
	type: "home_inventory/meal_save",
	data: t
}), qa = (e, t) => e.callWS({
	type: "home_inventory/meal_delete",
	meal_id: t
}), Ja = (e, t, n, r) => e.callWS({
	type: "home_inventory/meal_shift",
	day: t,
	slot: n,
	apply: r
}), Ya = (e, t, n) => e.callWS({
	type: "home_inventory/plan_to_shopping_list",
	start: t,
	end: n
}), Xa = class extends T {
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
		this.recipes = n.filter((e) => !V(e)), this.meal = i, this.draft = {
			day: i?.day ?? e,
			slot: i?.slot ?? t,
			text: i?.name ?? a,
			servings: i?.servings ?? r,
			dateBad: !1
		}, this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.text.trim() || (t.text = E("valid.required")), (!e.day || F(e.dateBad, e.day)) && (t.day = E("valid.date")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = E("valid.servings")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.text.trim();
		try {
			await Ka(this.hass, {
				...this.meal ? { id: this.meal.id } : {},
				day: t.day,
				slot: t.slot,
				recipe_id: this.recipes.find((e) => e.name === n)?.id ?? null,
				text: n,
				servings: t.servings
			});
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.errors(), t = this.draft;
		return j({
			title: this.meal ? E("common.edit_name", { name: this.meal.name }) : E("plan.add"),
			body: y`<label>
          <span class="lbl">${E("plan.date")}</span>
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
          ${N(e.day, "meal-day")}
        </label>
        <label>
          <span class="lbl">${E("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(t.slot)}
            @change=${(e) => this.draft = {
				...t,
				slot: Number(e.target.value)
			}}
          >
            ${kr.map((e) => y`<option value=${e} ?selected=${e === t.slot}>${E(`plan.slot.${e}`)}</option>`)}
          </select>
        </label>
        <label>
          <span class="lbl">${E("plan.dish")}</span>
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
            ${this.recipes.map((e) => y`<option value=${e.name}></option>`)}
          </datalist>
          ${N(e.text, "meal-text")}
        </label>
        <label>
          <span class="lbl">${E("recipes.servings")}</span>
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
				servings: I(e.target.value)
			}}
          />
          ${N(e.servings, "meal-servings")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: E("common.save"),
				testid: "meal-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-meal-dialog", Xa);
//#endregion
//#region src/cook-mode.ts
var Za = (e) => {
	let t = Math.max(0, Math.ceil(e / 1e3)), n = Math.floor(t / 3600), r = String(Math.floor(t % 3600 / 60)).padStart(n ? 2 : 1, "0"), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${r}:${i}` : `${r}:${i}`;
}, Qa = () => {
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
}, $a = class extends T {
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
		(!this.timers.some((e) => e.end > Date.now()) || await O({
			title: E("cook.stop"),
			action: E("cook.stop_ok")
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
		this.now = Date.now(), this.timers.some((t) => t.end <= this.now && t.end > e) && Qa();
	}
	toggle(e) {
		let t = new Set(this.done);
		t.delete(e) || t.add(e), this.done = t;
	}
	step(e, t) {
		return y`<button
        type="button"
        class="step ${this.done.has(t) ? "done" : ""}"
        data-testid="cook-step"
        aria-pressed=${this.done.has(t)}
        @click=${() => this.toggle(t)}
      >
        <span class="no">${t + 1}.</span>${e.text}
      </button>
      ${(e.timers ?? []).map((e) => y`<button
            type="button"
            class="timer-btn"
            data-testid="cook-timer-start"
            aria-label=${E("cook.timer_start", { what: e.label })}
            @click=${() => this.start(t, e.label, e.seconds)}
          >
            ${k(ht)} ${e.label}
          </button>`)}`;
	}
	render() {
		if (!this.active || !this.recipe) return y`<dialog></dialog>`;
		let e = this.recipe, t = this.servings / e.servings;
		return y`<dialog
      @close=${() => this.closed()}
      @cancel=${(e) => {
			e.preventDefault(), this.close();
		}}
    >
      <header>
        <h2>${E("cook.title", { name: e.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${E("cook.close")}
          title=${E("cook.close")}
          @click=${() => this.close()}
        >
          ${k(Qe)}
        </button>
      </header>
      <h3>${E("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map((e) => y`<li>
              ${[ba(this.hass, this.md, e, t), this.md.categories.find((t) => t.id === e.category_id)?.name ?? e.text].filter(Boolean).join(" ")}
              ${e.note ? y`<span class="detail">${e.note}</span>` : x}
            </li>`)}
      </ul>
      <h3>${E("recipes.instructions")}</h3>
      <p class="detail">${E("cook.hint")}</p>
      ${_a(e.steps, (e, t) => this.step(e, t))}
      ${this.timers.length ? y`<div class="timers" role="status">
              ${this.timers.map((e) => {
			let t = e.end - this.now;
			return y`<span class="timer ${t <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${E("cook.timer", {
				n: e.step + 1,
				what: e.label
			})}:
                  <strong>${t > 0 ? Za(t) : E("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${E("cook.timer_cancel")}
                    title=${E("cook.timer_cancel")}
                    @click=${() => this.timers = this.timers.filter((t) => t !== e)}
                  >
                    ${k(Qe)}
                  </button>
                </span>`;
		})}
            </div>` : x}
    </dialog>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-cook-mode", $a);
//#endregion
//#region src/recipes-view.ts
var eo = class extends T {
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
			open: { state: !0 },
			servings: { state: !0 },
			scaled: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.started = !1, this.query = "", this.expiring = /* @__PURE__ */ new Map(), this.onlyExpiring = !1, this.open = /* @__PURE__ */ new Set(), this.servings = /* @__PURE__ */ new Map(), this.scaled = /* @__PURE__ */ new Map(), this.error = "";
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
				nn(this.hass),
				B(this.hass),
				rn(this.hass)
			]);
			[this.recipes, this.md] = [e, t], this.expiring = new Map(n.map((e) => [e.recipe_id, e.used])), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await R(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus(), await this.reveal();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await an(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await Gn(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await nn(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	edit(e) {
		this.renderRoot.querySelector("home-inventory-recipe-dialog").open(this.md, e, void 0, !!this.canning);
	}
	importer() {
		return this.renderRoot.querySelector("home-inventory-recipe-import");
	}
	shown() {
		let e = this.query.trim();
		return (this.recipes ?? []).filter((t) => V(t) === !!this.canning && (!this.onlyExpiring || this.expiring.has(t.id)) && (!e || G(t.name, e) || t.ingredients.some((t) => G(t.text, e))));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = Mt(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return y`<li class="recipe" data-testid="recipe-row" data-recipe-id=${e.id}>
      <div class="head">
        ${jt(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${E("recipes.summary", e.summary)} ·
            ${V(e) ? E("canning.recipe_summary", {
			name: e.canning_product ?? "",
			jars: e.servings
		}) : Sn(this.hass, e.servings)}${this.expiring.has(e.id) ? y` ·
                    <span class="soon" data-testid="recipe-expiring"
                      >${E("recipes.expiring", { n: this.expiring.get(e.id) })}</span
                    >` : x}</span
          >
        </button>
        ${M({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: L(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? Sa({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e),
			onPlan: () => V(e) ? this.dispatchEvent(new CustomEvent("home-inventory-canning-start", {
				detail: e.id,
				bubbles: !0,
				composed: !0
			})) : this.renderRoot.querySelector("home-inventory-meal-dialog").open(P(), 3, this.recipes, r, void 0, e.name),
			onCook: () => this.renderRoot.querySelector("home-inventory-cook-mode").open(this.hass, this.md, e, this.scaled.get(e.id) ?? e.ingredients, r)
		}) : x}
    </li>`;
	}
	render() {
		let e = this.error ? y`<p class="error" role="alert">${this.error}</p>` : x;
		if (!this.recipes || !this.md) return e;
		let t = this.shown();
		return y`${e}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${E("recipes.search")}
          placeholder=${E("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button data-testid="recipe-import" @click=${() => this.importer().open()}>
          ${E("recipes.import.open")}
        </button>
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${E(this.canning ? "canning.recipe_add" : "recipes.add")}
        </button>
      </div>
      ${this.expiring.size ? y`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e) => this.onlyExpiring = e.target.checked}
              />
              ${E("recipes.expiring_only")}
            </label>` : x}
      <home-inventory-recipe-import
        .hass=${this.hass}
        @home-inventory-imported=${(e) => this.renderRoot.querySelector("home-inventory-recipe-dialog").open(this.md, void 0, e.detail, !!this.canning)}
      ></home-inventory-recipe-import>
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.refreshShopping()}
      ></home-inventory-shopping-recipe-dialog>
      <home-inventory-meal-dialog .hass=${this.hass}></home-inventory-meal-dialog>
      <home-inventory-cook-mode></home-inventory-cook-mode>
      <home-inventory-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
        @master=${(e) => this.md = e.detail}
      >
      </home-inventory-recipe-dialog>
      ${t.length ? y`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : y`<p class="empty">
              ${E(this.query.trim() ? "recipes.no_hits" : this.canning ? "canning.recipes_empty" : "recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [D, fa];
	}
};
customElements.define("home-inventory-recipes", eo);
//#endregion
//#region src/plan-shift.ts
var to = (e, t) => y`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${E("plan.shift")}
    title=${E("plan.shift")}
    @click=${() => e.shift(t)}
  >
    ${k(qe)}
  </button>`;
async function no(e, t) {
	let { meals: n } = await Ja(e, t.day, t.slot, !1), r = new Intl.DateTimeFormat(Pr(e), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	});
	return await O({
		title: E("plan.shift_title", { slot: E(`plan.slot.${t.slot}`) }),
		body: y`<ul class="impact" data-testid="shift-list">
      ${n.map((e) => {
			let t = Z(e.day);
			return y`<li>${r.format(t)} ${e.name} → ${r.format(Z(X(Q(t, 1))))}</li>`;
		})}
    </ul>`,
		action: E("plan.shift_ok")
	}) ? (await Ja(e, t.day, t.slot, !0), !0) : !1;
}
//#endregion
//#region src/plan-day.ts
function ro(e, t) {
	let n = X(t);
	return y`<div data-testid="plan-day" data-day=${n}>
    ${kr.map((t) => y`<section data-testid="plan-cell" data-slot=${t}>
          <div class="head">
            <h3>${E(`plan.slot.${t}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${E("plan.add")}
              title=${E("plan.add")}
              @click=${() => e.add(n, t)}
            >
              ${k(ut)}
            </button>
          </div>
          <ul>
            ${e.meals.filter((e) => e.day === n && e.slot === t).map((t) => y`<li data-testid="plan-meal">
                    <button
                      type="button"
                      class="row"
                      data-testid="plan-meal-open"
                      @click=${() => e.open(t)}
                    >
                      ${t.name} · ${Sn(e.hass, t.servings)}
                    </button>
                    ${to(e, t)}
                    ${M({
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
var io = s`
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
`, ao = "(max-width: 600px)", oo = (e, t) => y`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => e.open(t)}>
      ${t.name}
    </button>
    <span class="sec">${Sn(e.hass, t.servings)}</span>
    ${to(e, t)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${E("common.edit_name", { name: t.name })}
      title=${E("common.edit_name", { name: t.name })}
      @click=${() => e.edit(t)}
    >
      ${k(lt)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${E("common.delete_name", { name: t.name })}
      title=${E("common.delete_name", { name: t.name })}
      @click=${() => e.remove(t)}
    >
      ${k(et)}
    </button>
  </div>`, so = (e, t, n, r) => y`<button
    class="icon-btn quiet"
    data-testid=${r}
    aria-label=${E("plan.add")}
    title=${E("plan.add")}
    @click=${() => e.add(t, n)}
  >
    ${k(ut)}
  </button>`, co = (e, t, n) => y`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => e.openDay(t)}
  >
    ${n.format(t)}
  </button>`, lo = (e) => [
	0,
	1,
	2,
	3,
	4,
	5,
	6
].map((t) => Q(e, t)), uo = (e, t, n) => e.meals.filter((e) => e.day === t && e.slot === n);
function fo(e, t, n) {
	let r = new Intl.DateTimeFormat(Pr(e.hass), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	}), i = X(/* @__PURE__ */ new Date());
	return n ? y`<div data-testid="plan-week">
      ${lo(t).map((t) => {
		let n = X(t);
		return y`<section class="daybox" data-testid="plan-day" data-day=${n}>
          <h3 class=${n === i ? "today" : ""}>
            ${co(e, t, r)} ${so(e, n, 3, "plan-add-day")}
          </h3>
          ${kr.filter((t) => uo(e, n, t).length).map((t) => y`<div class="slotline" data-testid="plan-cell" data-slot=${t}>
                <span class="slot">${E(`plan.slot.${t}`)}</span>
                <div>${uo(e, n, t).map((t) => oo(e, t))}</div>
              </div>`)}
        </section>`;
	})}
    </div>` : y`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${lo(t).map((t) => y`<th scope="col" class=${X(t) === i ? "today" : ""}>
              ${co(e, t, r)}
            </th>`)}
      </tr>
    </thead>
    <tbody>
      ${kr.map((n) => y`<tr>
            <th scope="row">${E(`plan.slot.${n}`)}</th>
            ${lo(t).map((t) => {
		let r = X(t);
		return y`<td data-testid="plan-day" data-day=${r}>
                <div data-testid="plan-cell" data-slot=${n}>
                  ${uo(e, r, n).map((t) => oo(e, t))} ${so(e, r, n, "plan-add")}
                </div>
              </td>`;
	})}
          </tr>`)}
    </tbody>
  </table>`;
}
var po = s`
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
`, mo = [
	_t,
	vt,
	$e,
	gt,
	tt
];
function ho(e, t, n, r) {
	let i = Pr(e.hass), a = new Intl.DateTimeFormat(i, { weekday: "short" }), o = new Intl.DateTimeFormat(i, { dateStyle: "full" }), s = X(/* @__PURE__ */ new Date());
	return y`<div class="month" data-testid="plan-month">
    ${[
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((e) => y`<div class="wd">${a.format(Q(t, e))}</div>`)}
    ${Array.from({ length: n * 7 }, (e, n) => Q(t, n)).map((t) => {
		let n = X(t), i = e.meals.filter((e) => e.day === n);
		return y`<button
        type="button"
        class="cell ${t.getMonth() === r ? "" : "dim"} ${n === s ? "today" : ""}"
        data-testid="plan-month-day"
        data-day=${n}
        aria-label=${o.format(t)}
        @click=${() => e.openDay(t)}
      >
        <span class="num">${t.getDate()}</span>
        <span class="icons">
          ${kr.filter((e) => i.some((t) => t.slot === e)).map((e) => {
			let t = E(`plan.slot.${e}`);
			return y`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${e}
              aria-label=${t}
              title=${[t, ...i.filter((t) => t.slot === e).map((e) => e.name)].join("\n")}
              >${k(mo[e])}</span
            >`;
		})}
        </span>
      </button>`;
	})}
  </div>`;
}
var go = s`
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
`, _o = 366, vo = (e, t) => Math.round((Z(t).getTime() - Z(e).getTime()) / 864e5), yo = class extends T {
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
		this.from = P(), this.to = X(Q(Z(this.from), 6)), this.bad = {
			from: !1,
			to: !1
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = {};
		return (!this.from || F(this.bad.from, this.from)) && (e.from = E("valid.date")), !this.to || F(this.bad.to, this.to) ? e.to = E("valid.date") : !e.from && this.to < this.from ? e.to = E("plan.shop.order") : !e.from && vo(this.from, this.to) >= _o && (e.to = E("plan.shop.long", { max: _o })), e;
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) try {
			let e = await Ya(this.hass, this.from, this.to);
			this.renderRoot.querySelector("dialog")?.close();
			let t = e.recipes.length ? E("plan.shop.done", { recipes: e.recipes.map((e) => `${e.name} (${e.servings})`).join(", ") }) : E("plan.shop.none");
			this.dispatchEvent(new CustomEvent("home-inventory-shopped", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	field(e, t, n) {
		return y`<label>
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
      ${N(n, `plan-shop-${e}`)}
    </label>`;
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.errors();
		return j({
			title: E("plan.shop.title"),
			body: y`<p class="hint">${E("plan.shop.hint")}</p>
        ${this.field("from", E("plan.shop.from"), e.from)}
        ${this.field("to", E("plan.shop.to"), e.to)}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: E("plan.shop.submit"),
				testid: "plan-shop-save"
			},
			dirty: () => !1,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-plan-shopping-dialog", yo);
//#endregion
//#region src/plan-view.ts
var bo = class extends T {
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
		super(), this.started = !1, this.narrow = window.matchMedia(ao), this.onNarrow = () => this.requestUpdate(), this.date = /* @__PURE__ */ new Date(), this.meals = [], this.household = 1, this.recipes = [], this.error = "", this.note = "";
	}
	get view() {
		return Or.includes(this.section) ? this.section : "week";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load(), nn(this.hass).then((e) => this.recipes = e, () => void 0)) : e.has("section") && this.started && this.load();
	}
	async load() {
		let [e, t] = Mr(this.view, this.date);
		try {
			let n = await Ga(this.hass, X(e), X(t));
			this.meals = n.meals, this.household = n.household_servings, this.error = "";
		} catch (e) {
			this.error = await R(this.hass, e);
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
			this.error = await R(this.hass, e);
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
				await Et(e.name) && await this.act(() => qa(this.hass, e.id));
			},
			open: (e) => e.recipe_id == null ? this.dialog().open(e.day, e.slot, this.recipes, this.household, e) : this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
				detail: `recipes/${e.recipe_id}`,
				bubbles: !0,
				composed: !0
			})),
			shift: (e) => this.act(() => no(this.hass, e)),
			openDay: (e) => {
				this.date = e, this.nav("day");
			}
		};
	}
	label() {
		let e = Pr(this.hass), t = this.date;
		if (this.view === "day") return new Intl.DateTimeFormat(e, { dateStyle: "full" }).format(t);
		if (this.view === "month") return new Intl.DateTimeFormat(e, {
			month: "long",
			year: "numeric"
		}).format(t);
		let [n, r] = Mr("week", t);
		return new Intl.DateTimeFormat(e, { dateStyle: "medium" }).formatRange(n, new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1));
	}
	body() {
		let e = this.ctx(), [t, n] = Mr(this.view, this.date);
		return this.view === "day" ? ro(e, this.date) : this.view === "week" ? fo(e, t, this.narrow.matches) : ho(e, t, Math.round((n.getTime() - t.getTime()) / 6048e5), this.date.getMonth());
	}
	render() {
		let e = this.view;
		return y`${this.error ? y`<p class="error" role="alert">${this.error}</p>` : x}
      ${this.note ? y`<p class="note" role="status" data-testid="plan-shop-note">${this.note}</p>` : x}
      <nav aria-label=${E("plan.view.label")}>
        ${Or.map((t) => y`<button
              data-testid=${`plan-view-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => t === "day" ? this.ctx().openDay(/* @__PURE__ */ new Date()) : this.nav(t)}
            >
              ${E(`plan.view.${t}`)}
            </button>`)}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${E("plan.prev")}
          title=${E("plan.prev")}
          @click=${() => this.go(Nr(e, this.date, -1))}
        >
          ${k(Xe)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(/* @__PURE__ */ new Date())}>
          ${E("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${E("plan.next")}
          title=${E("plan.next")}
          @click=${() => this.go(Nr(e, this.date, 1))}
        >
          ${k(Ze)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        <button
          data-testid="plan-shop"
          @click=${() => this.renderRoot.querySelector("home-inventory-plan-shopping-dialog").open()}
        >
          ${E("plan.shop")}
        </button>
        ${e === "month" ? x : y`<home-inventory-receipt-button
                .hass=${this.hass}
                .print=${() => en(this.hass, X(Mr(e, this.date)[0]), e === "day" ? 1 : 7)}
                .done=${E("plan.printed")}
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
			D,
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
			io,
			po,
			go
		];
	}
};
customElements.define("home-inventory-plan", bo);
//#endregion
//#region src/api-canning.ts
var xo = (e) => e.callWS({ type: "home_inventory/cannings" }), So = (e, t) => e.callWS({
	type: "home_inventory/canning_save",
	data: t
}), Co = class extends T {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = [], this.recipes = [], this.initial = "", this.draft = this.blank(), this.active = !1, this.error = "";
	}
	blank() {
		return {
			made_on: P(),
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
	async open(e, t, n, r, i) {
		this.md = e, this.products = t, this.recipes = n.filter(V), this.canning = r, this.draft = r ? {
			...this.blank(),
			made_on: r.made_on,
			name: r.name,
			recipe_id: r.recipe_id,
			jars: r.jars,
			expires_on: r.expires_on ?? "",
			temp: r.temp,
			minutes: r.minutes,
			notes: r.notes
		} : this.blank(), i != null && this.pickRecipe(i), this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input, dialog select")?.focus();
	}
	product(e = this.draft) {
		return this.products.find((t) => t.name === e.name.trim());
	}
	dflt(e, t = this.draft) {
		let n = this.product(t);
		return n?.[e] == null ? J(this.md, n ? n.category_id : t.category_id, e) : {
			value: n[e],
			source: E("book.from_product")
		};
	}
	proposal(e) {
		let t = this.dflt("shelf_days", e);
		return t && e.made_on ? Ar(e.made_on, Number(t.value)) : "";
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
		return this.canning || ((!e.made_on || F(e.dateBad, e.made_on)) && (t.made_on = E("valid.date")), e.name.trim() ? !this.product() && e.category_id == null && (t.category = E("valid.category")) : t.name = E("valid.required"), (e.jars == null || !Number.isInteger(e.jars) || e.jars < 1 || e.jars > 9999) && (t.jars = E("valid.packages")), !this.dflt("default_location_id") && e.location_id == null && (t.location = E("valid.location"))), e.temp != null && !(Number.isInteger(e.temp) && e.temp >= 1 && e.temp <= 200) && (t.temp = E("valid.canning_temp")), e.minutes != null && !(Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440) && (t.minutes = E("valid.canning_minutes")), t;
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
			let e = await So(this.hass, this.canning ? {
				id: this.canning.id,
				...n
			} : {
				...n,
				made_on: t.made_on,
				jars: t.jars,
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
			this.error = await R(this.hass, e);
		}
	}
	num(e, t, n, r) {
		return Pa({
			testid: `canning-${e}`,
			label: t,
			unit: n,
			value: this.draft[e],
			err: r,
			onChange: (t) => this.set({ [e]: t })
		});
	}
	date(e, t, n) {
		return Fa({
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
		let t = this.draft;
		if (this.canning) return y`<p class="detail" data-testid="canning-fixed">
        ${E("canning.fixed", {
			charge: this.canning.charge,
			name: t.name,
			jars: t.jars ?? ""
		})}
      </p>`;
		let n = this.recipes.find((e) => e.id === t.recipe_id);
		return y`<label>
        <span class="lbl">${E("canning.recipe")}</span>
        <select
          data-testid="canning-recipe"
          @change=${(e) => {
			let t = e.target.value;
			this.pickRecipe(t ? Number(t) : null);
		}}
        >
          <option value="" .selected=${t.recipe_id == null}>${E("common.none")}</option>
          ${this.recipes.map((e) => y`<option value=${e.id} .selected=${e.id === t.recipe_id}>${e.name}</option>`)}
        </select>
      </label>
      ${this.date("made_on", E("canning.made_on"), e.made_on)}
      ${n ? y`<p class="detail" data-testid="canning-recipe-product">
              ${E("canning.recipe_product", { name: n.canning_product ?? "" })}
            </p>` : Ia({
			testid: "canning",
			label: E("canning.product"),
			hass: this.hass,
			md: this.md,
			products: this.products,
			name: t.name,
			categoryId: t.category_id,
			err: e,
			onName: (e) => this.set({ name: e }),
			onCategory: (e) => this.set({ category_id: e })
		})}
      ${this.num("jars", E("canning.jars"), "", e.jars)}
      <label>
        <span class="lbl">${E("book.location")}</span>
        ${wn({
			testid: "canning-location",
			own: t.location_id,
			dflt: this.dflt("default_location_id"),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			invalid: !!e.location,
			onChange: (e) => this.set({ location_id: e })
		})}
        ${N(e.location, "canning-location")}
      </label>`;
	}
	render() {
		if (!this.active) return y`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.dflt("shelf_days") : void 0;
		return j({
			title: this.canning ? E("common.edit_name", { name: this.canning.charge }) : E("canning.add"),
			body: y`${this.newFields(e)} ${this.date("expires_on", E("canning.expires_on"))}
        ${n ? y`<span class="detail">${E("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : x}
        <div class="pair">
          ${this.num("temp", E("recipes.field.canning_temp"), "°C", e.temp)}
          ${this.num("minutes", E("recipes.field.canning_minutes"), E("recipes.minutes_unit"), e.minutes)}
        </div>
        <label>
          <span class="lbl">${E("canning.notes")}</span>
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
				label: E("common.save"),
				testid: "canning-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = D;
	}
};
customElements.define("home-inventory-canning-dialog", Co);
//#endregion
//#region src/canning-view.ts
var wo = class extends T {
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
	nav(e) {
		this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	async start(e) {
		this.nav("canning"), await this.load(), this.edit(void 0, e.detail);
	}
	async load() {
		try {
			[this.rows, this.md, this.products, this.recipes] = await Promise.all([
				xo(this.hass),
				B(this.hass),
				Jt(this.hass),
				nn(this.hass)
			]), this.error = "";
		} catch (e) {
			this.error = await R(this.hass, e);
		}
	}
	edit(e, t) {
		this.message = "", this.renderRoot.querySelector("home-inventory-canning-dialog").open(this.md, this.products, this.recipes, e, t);
	}
	async removeCanning(e) {
		this.error = "";
		try {
			if (!await Gn(this.hass, this.md, "canning", {
				id: e.id,
				name: e.charge
			})) return;
		} catch (e) {
			this.error = await R(this.hass, e);
			return;
		}
		await this.load();
	}
	async saved(e) {
		await this.load();
		let t = e.detail;
		t && (this.message = E("canning.saved", { charge: t.charge }), this.renderRoot.querySelector("home-inventory-label-dialog").open({
			id: t.batch_id,
			name: t.name,
			packages: t.jars
		}, t.jars));
	}
	detail(e) {
		return [
			E("canning.jars_left", {
				jars: e.jars,
				left: e.in_stock
			}),
			e.expires_on ? E("canning.until", { date: U(this.hass, e.expires_on) }) : "",
			e.temp == null ? "" : `${e.temp} °C`,
			e.minutes == null ? "" : `${e.minutes} ${E("recipes.minutes_unit")}`,
			e.recipe ?? ""
		].filter(Boolean).join(" · ");
	}
	protocols() {
		return this.rows ? y`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${E("canning.add")}
        </button>
      </div>
      ${this.message ? y`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : x}
      ${this.rows.length ? y`<ul>
              ${this.rows.map((e) => y`<li data-testid="canning-row" data-charge=${e.charge}>
                    <button type="button" class="row" @click=${() => this.edit(e)}>
                      <span>${e.charge} · ${e.name}</span>
                      <span class="detail">${this.detail(e)}</span>
                      ${e.notes ? y`<span class="detail">${e.notes}</span>` : x}
                    </button>
                    ${M({
			testid: "canning",
			name: e.charge,
			onEdit: () => this.edit(e),
			onDelete: L(this.hass) ? () => this.removeCanning(e) : void 0
		})}
                  </li>`)}
            </ul>` : y`<p class="empty">${E("canning.empty")}</p>`}` : x;
	}
	render() {
		let e = this.section === "recipes";
		return y`${this.error ? y`<p class="error" role="alert">${this.error}</p>` : x}
      <nav aria-label=${E("canning.view.label")}>
        ${["protocols", "recipes"].map((t) => y`<button
              data-testid=${`canning-view-${t}`}
              aria-current=${t === "recipes" === e ? "page" : "false"}
              @click=${() => this.nav(t === "recipes" ? "canning/recipes" : "canning")}
            >
              ${E(`canning.view.${t}`)}
            </button>`)}
      </nav>
      <div @home-inventory-canning-start=${this.start}>
        ${e ? y`<home-inventory-recipes .hass=${this.hass} .canning=${!0}></home-inventory-recipes>` : this.protocols()}
      </div>
      <home-inventory-canning-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-canning-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => e.detail && (this.message = E("label.printed", { n: e.detail }))}
      ></home-inventory-label-dialog>`;
	}
	static {
		this.styles = [D, s`
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
customElements.define("home-inventory-canning", wo);
//#endregion
//#region src/home-inventory-panel.ts
var To = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", Eo = [
	"stock",
	"expiry",
	"shopping",
	"recipes",
	"plan",
	"canning",
	"settings"
], Do = [
	"shopping",
	"recipes",
	"plan",
	"canning"
], Oo = class extends T {
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
		e.has("hass") && this.hass && St(this.hass.language), e.has("panel") && (fn(this.panel?.config?.modules), mn(this.panel?.config?.ai), _n(this.panel?.config?.off));
	}
	get tabs() {
		return Eo.filter((e) => (e !== "settings" || L(this.hass)) && (!Do.includes(e) || H(e)));
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
		return y`
      <header>
        ${this.narrow ? y`<button
                class="menu"
                aria-label=${E("panel.menu")}
                title=${E("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${k(it)}
              </button>` : x}
        <h1>${E("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${To}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${E("panel.help")}
          title=${E("panel.help")}
          >${k(nt)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map((t) => y`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${E(`tab.${t}`)}
            </button>`)}
      </div>
      <main
        role="tabpanel"
        @home-inventory-navigate=${(e) => this.select(e.detail)}
      >
        ${e === "settings" ? y`<home-inventory-settings
                .hass=${this.hass}
                .section=${this.sub}
              ></home-inventory-settings>` : e === "stock" ? y`<home-inventory-stock
                  .hass=${this.hass}
                  .mode=${this.seg === "in" || this.seg === "out" || this.seg === "open" && H("opened") ? this.seg : "search"}
                ></home-inventory-stock>` : e === "expiry" ? y`<home-inventory-expiry .hass=${this.hass}></home-inventory-expiry>` : e === "recipes" ? y`<home-inventory-recipes
                      .hass=${this.hass}
                      .section=${this.sub}
                    ></home-inventory-recipes>` : e === "plan" ? y`<home-inventory-plan
                        .hass=${this.hass}
                        .section=${this.sub}
                      ></home-inventory-plan>` : e === "canning" ? y`<home-inventory-canning
                          .hass=${this.hass}
                          .section=${this.sub}
                        ></home-inventory-canning>` : y`<home-inventory-shopping .hass=${this.hass}></home-inventory-shopping>`}
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
customElements.define("home-inventory-panel", Oo);
//#endregion
export { Oo as HomeInventoryPanel };
