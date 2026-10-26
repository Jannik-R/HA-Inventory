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
var de = globalThis, fe = (e) => e, pe = de.trustedTypes, me = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, he = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ge = "?" + m, _e = `<${ge}>`, h = document, ve = () => h.createComment(""), ye = (e) => e === null || typeof e != "object" && typeof e != "function", be = Array.isArray, xe = (e) => be(e) || typeof e?.[Symbol.iterator] == "function", Se = "[ 	\n\f\r]", Ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, we = /-->/g, Te = />/g, g = RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Ee = /'/g, De = /"/g, Oe = /^(?:script|style|textarea|title)$/i, ke = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), _ = ke(1), Ae = ke(2), v = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), je = /* @__PURE__ */ new WeakMap(), b = h.createTreeWalker(h, 129);
function Me(e, t) {
	if (!be(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return me === void 0 ? t : me.createHTML(t);
}
var Ne = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Ce;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Ce ? c[1] === "!--" ? o = we : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = g) : (Oe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = g) : o = Te : o === g ? c[0] === ">" ? (o = i ?? Ce, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? g : c[3] === "\"" ? De : Ee) : o === De || o === Ee ? o = g : o === we || o === Te ? o = Ce : (o = g, i = void 0);
		let d = o === g && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Ce ? n + _e : l >= 0 ? (r.push(s), n.slice(0, l) + he + n.slice(l) + m + d) : n + m + (l === -2 ? t : d);
	}
	return [Me(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Pe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ne(t, n);
		if (this.el = e.createElement(l, r), b.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = b.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(he)) {
					let t = u[o++], n = i.getAttribute(e).split(m), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Re : r[1] === "?" ? ze : r[1] === "@" ? Be : Le
					}), i.removeAttribute(e);
				} else e.startsWith(m) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Oe.test(i.tagName)) {
					let e = i.textContent.split(m), t = e.length - 1;
					if (t > 0) {
						i.textContent = pe ? pe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ve()), b.nextNode(), c.push({
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
function x(e, t, n = e, r) {
	if (t === v) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ye(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = x(e, i._$AS(e, t.values), i, r)), t;
}
var Fe = class {
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
		b.currentNode = r;
		let i = b.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ie(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ve(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = b.nextNode(), a++);
		}
		return b.currentNode = h, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ie = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = x(this, e, t), ye(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== v && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? xe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== y && ye(this._$AH) ? this._$AA.nextSibling.data = e : this.T(h.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Pe.createElement(Me(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Fe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = je.get(e.strings);
		return t === void 0 && je.set(e.strings, t = new Pe(e)), t;
	}
	k(t) {
		be(this._$AH) || (this._$AH = [], this._$AR());
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
}, Le = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = y;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = x(this, e, t, 0), a = !ye(e) || e !== this._$AH && e !== v, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = x(this, r[n + o], t, o), s === v && (s = this._$AH[o]), a ||= !ye(s) || s !== this._$AH[o], s === y ? e = y : e !== y && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Re = class extends Le {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === y ? void 0 : e;
	}
}, ze = class extends Le {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== y);
	}
}, Be = class extends Le {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = x(this, e, t, 0) ?? y) === v) return;
		let n = this._$AH, r = e === y && n !== y || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== y && (n === y || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ve = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		x(this, e);
	}
}, He = {
	M: he,
	P: m,
	A: ge,
	C: 1,
	L: Ne,
	R: Fe,
	D: xe,
	V: x,
	I: Ie,
	H: Le,
	N: ze,
	U: Be,
	B: Re,
	F: Ve
}, Ue = de.litHtmlPolyfillSupport;
Ue?.(Pe, Ie), (de.litHtmlVersions ??= []).push("3.3.3");
var We = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ie(t.insertBefore(ve(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ge = globalThis, S = class extends p {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = We(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return v;
	}
};
S._$litElement$ = !0, S.finalized = !0, Ge.litElementHydrateSupport?.({ LitElement: S });
var Ke = Ge.litElementPolyfillSupport;
Ke?.({ LitElement: S }), (Ge.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var qe = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", Je = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", Ye = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Xe = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z", Ze = "M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z", Qe = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", $e = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", et = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", tt = "M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z", nt = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", rt = "M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z", it = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", at = "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z", ot = "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z", st = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", ct = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", lt = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", ut = "M7,10L12,15L17,10H7Z", dt = "M19,13H5V11H19V13Z", ft = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", pt = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z", mt = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", ht = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", gt = "M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z", _t = "M18 10H6A2 2 0 0 0 4 12V19H20V12A2 2 0 0 0 18 10M18 14H14V12H18M17 9H7V4H17Z", vt = "M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5M19 19H5V5H19V19M6 15H18V17H6M6 11H18V13H6M6 7H18V9H6V7Z", yt = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", bt = "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z", xt = "M8 17.85C8 19.04 7.11 20 6 20S4 19.04 4 17.85C4 16.42 6 14 6 14S8 16.42 8 17.85M16.46 12V10.56L18.46 9.43L20.79 10.05L21.31 8.12L19.54 7.65L20 5.88L18.07 5.36L17.45 7.69L15.45 8.82L13 7.38V5.12L14.71 3.41L13.29 2L12 3.29L10.71 2L9.29 3.41L11 5.12V7.38L8.5 8.82L6.5 7.69L5.92 5.36L4 5.88L4.47 7.65L2.7 8.12L3.22 10.05L5.55 9.43L7.55 10.56V12H2V13H22V12H16.46M9.5 12V10.56L12 9.11L14.5 10.56V12H9.5M20 17.85C20 19.04 19.11 20 18 20S16 19.04 16 17.85C16 16.42 18 14 18 14S20 16.42 20 17.85M14 20.85C14 22.04 13.11 23 12 23S10 22.04 10 20.85C10 19.42 12 17 12 17S14 19.42 14 20.85Z", St = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", Ct = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", wt = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Tt = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Et = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z", Dt = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13", Ot = {
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
	"tip.allergens": "Die enthaltenen der 14 Hauptallergene (Spuren zählen nicht). Ohne eigene Angabe erbt das Feld von der Kategorie darüber."
}, kt = {
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
	"tip.allergens": "Which of the 14 major allergens it contains (traces do not count). Without an own value it inherits from the category above."
}, At = {
	de: Ot,
	en: kt
}, jt = kt;
function Mt(e) {
	let t = e ?? "";
	jt = At[t] ?? At[t.split("-")[0]] ?? kt;
}
function C(e, t) {
	let n = jt[e] ?? kt[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var w = s`
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
`, Nt = s`
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
`, Pt = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, Ft = class extends S {
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
		Pt(e) && e.target.close();
	}
	render() {
		return _`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? _`<p>${this.o.message}</p>` : y} ${this.o.body ?? y}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${C("common.cancel")}
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
		this.styles = [w, s`
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
customElements.define("home-inventory-confirm", Ft);
function T(e) {
	return new Promise((t) => {
		let n = document.createElement("home-inventory-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var It = (e, t) => T({
	title: C("common.delete_name", { name: e }) + "?",
	message: t,
	action: C("common.delete"),
	danger: !0
}), E = (e) => _`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${Ae`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Lt = !1;
async function Rt(e, t) {
	if (!t?.()) return e.close();
	if (!Lt) {
		Lt = !0;
		try {
			await T({
				title: C("common.discard"),
				action: C("common.discard_ok")
			}) && e.close();
		} finally {
			Lt = !1;
		}
	}
}
var zt = (e) => (t) => {
	Pt(t) && Rt(t.target, e);
}, Bt = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), Rt(t.currentTarget, e));
};
async function Vt(e, t) {
	let n = e.currentTarget;
	if (n.hasAttribute("data-busy")) return e.preventDefault();
	n.setAttribute("data-busy", "");
	try {
		await t(e);
	} finally {
		n.removeAttribute("data-busy");
	}
}
var D = (e) => _`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${zt(e.dirty)}
    @keydown=${Bt(e.dirty)}
    @cancel=${Bt(e.dirty)}
  >
    <form @submit=${(t) => Vt(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? _`<p class="error" role="alert">${e.error}</p>` : y}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${e.cancel ?? C("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
          ?hidden=${e.hideSubmit}
        >
          ${e.submit?.label ?? C("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, Ht = (e, t) => _`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${C(e ? "common.collapse" : "common.expand")}
    title=${C(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${E(e ? Qe : et)}
  </button>`;
function Ut(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var O = (e) => _`${e.onAdd ? _`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            title=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${E(ht)}
          </button>` : y}${e.onMove ? _`<button
            class="icon-btn"
            data-testid=${`${e.testid}-move`}
            aria-label=${e.moveLabel ?? ""}
            title=${e.moveLabel ?? ""}
            @click=${e.onMove}
          >
            ${E(St)}
          </button>` : y}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${C("common.edit_name", { name: e.name })}
      title=${C("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${E(mt)}
    </button>
    ${e.onDelete ? _`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${C("common.delete_name", { name: e.name })}
            title=${C("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${E(it)}
          </button>` : y}`, k = (e, t, n = !1) => e ? _`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : y, A = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, Wt = (e) => e >= "2000-01-01" && e <= "2099-12-31", j = (e, t) => e || !!t && !Wt(t), M = (e) => e === "" ? null : Number(e), Gt = /^https?:\/\//i, Kt = [
	"vegan",
	"vegetarian",
	"none"
], qt = [
	"best_before",
	"use_by",
	"guide"
], N = (e) => !!e?.user?.is_admin;
async function P(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var Jt = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), F = (e) => e.callWS({ type: "home_inventory/master_data" }), Yt = (e, t, n) => e.callWS({
	type: "home_inventory/save",
	table: t,
	data: n
}), Xt = (e, t) => e.callWS({
	type: "home_inventory/defaults_save",
	data: t
}), Zt = (e, t, n, r = {}) => e.callWS({
	type: "home_inventory/delete",
	table: t,
	row_id: n,
	...r
}), Qt = (e, t, n) => e.callWS({
	type: "home_inventory/move_location",
	location_id: t,
	move_to: n
}), $t = (e, t, n) => e.callWS({
	type: "home_inventory/delete_impact",
	table: t,
	row_id: n
}), en = (e, t, n) => e.callWS({
	type: "home_inventory/product_type_add",
	name: t,
	parent_id: n
}), tn = (e, t) => e.callWS({
	type: "home_inventory/lookup",
	code: t
}), nn = (e, t, n = !1) => e.callWS({
	type: "home_inventory/search",
	query: t,
	online: n
}), rn = (e, t) => e.callWS({
	type: "home_inventory/book_in",
	...t
}), an = (e, t) => e.callWS({
	type: "home_inventory/book_out",
	...t
}), on = (e, t) => e.callWS({
	type: "home_inventory/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), sn = (e, t) => e.callWS({
	type: "home_inventory/stock_edit",
	...t
}), I = (e, t) => e.callWS({
	type: "home_inventory/stock",
	product_id: t
}), cn = (e) => e.callWS({ type: "home_inventory/products" }), ln = (e, t) => e.callWS({
	type: "home_inventory/product_save",
	data: t
}), un = (e) => e.callWS({ type: "home_inventory/label_config" }), dn = (e, t) => e.callWS({
	type: "home_inventory/print_labels",
	...t
}), fn = (e) => e.callWS({ type: "home_inventory/print_shopping_list" }), pn = (e, t, n) => e.callWS({
	type: "home_inventory/print_recipe",
	recipe_id: t,
	servings: n
}), mn = (e, t, n) => e.callWS({
	type: "home_inventory/print_plan",
	start: t,
	days: n
}), hn = (e, t) => e.callWS({
	type: "home_inventory/book_out_label",
	code: t
}), gn = (e) => e.callWS({ type: "home_inventory/recipes" }), _n = (e, t) => e.callWS({
	type: "home_inventory/expiring_recipes",
	...t == null ? {} : { days: t }
}), vn = (e, t, n) => e.callWS({
	type: "home_inventory/recipe_availability",
	recipe_id: t,
	servings: n
}), yn = (e, t) => e.callWS({
	type: "home_inventory/recipe_save",
	data: t
}), L = (e) => e.canning_product_id != null, bn = (e, t) => e.callWS({
	type: "home_inventory/recipe_import",
	...t
}), xn = (e, t) => e.callWS({
	type: "home_inventory/recipe_ai_check",
	draft: t,
	language: e.language
}), Sn = (e, t) => e.callWS({
	type: "home_inventory/product_ai_check",
	draft: t,
	language: e.language
}), Cn = (e, t, n) => e.callWS({
	type: "home_inventory/unit_add",
	name: t,
	symbol: n
}), wn = (e, t) => e.callWS({
	type: "home_inventory/recipe_export",
	recipe_id: t
}), Tn, En = (e) => Tn = e, R = (e) => !Tn || Tn.includes(e), Dn = {}, On = (e) => Dn = e ?? {}, z = (e) => !!Dn[e], kn = [
	"drinks",
	"grains",
	"vegetables",
	"fruit_nuts",
	"dairy",
	"meat_fish_eggs",
	"fats"
], An = (e) => e.callWS({ type: "home_inventory/emergency" }), jn = (e) => e?.locale?.language ?? e?.language, B = (e, t) => new Intl.DateTimeFormat(jn(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), V = (e, t) => new Intl.NumberFormat(jn(e)).format(t), Mn = (e, t, n, r, i = t) => C(new Intl.PluralRules(jn(e)).select(t) === "one" ? n : r, { n: i }), Nn = (e, t) => Mn(e, Number(t), "settings.day", "settings.days", t), H = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), U = (e, t, n = "") => `${V(e, t)} ${n ?? ""}`.trim(), Pn = (e, t) => Mn(e, t, "recipes.portion", "recipes.portions");
//#endregion
//#region src/inherit.ts
function W(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function G(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n] ?? null,
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: C("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: C("settings.inherit_from", { name: a ?? "" })
	};
}
var Fn = (e, t) => _`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${E(yt)}${C("common.reset")}
  </button>`;
function K(e) {
	let t = e.own ?? null;
	return _`<span class="inh">
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
        ${e.dflt ? C("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : e.empty ?? C(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => _`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? y : Fn(e.testid, () => e.onChange(null))}
  </span>`;
}
function In(e) {
	let t = e.own ?? null;
	return _`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? C("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(M(n));
	}}
    />
    ${e.suffix ? _`<span class="detail">${e.suffix}</span>` : y}
    ${t == null ? y : Fn(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var Ln = class extends S {
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
				let { id: t } = await en(this.hass, this.creating, e), n = await F(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await P(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = Ut(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => H(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: W(this.categories, e.id)
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
		return _`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? C("book.choose") : W(this.categories, this.value)}
        </span>
        ${E(ut)}
      </button>
      <dialog @click=${zt()}>
        <h2>
          ${this.creating ? C("book.choose_parent", { name: this.creating }) : C("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${C("book.filter")}
          placeholder=${C("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !n && !this.creating ? _`<li>
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
                </li>` : y}
          ${e.map(({ c: e, depth: t, label: r }) => {
			let i = !n && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return _`<li style="padding-left: ${t * 20}px">
              ${i ? Ht(a, () => this.toggle(e.id)) : n ? y : _`<span class="chev"></span>`}
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
        ${r ? _`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(t)}
              >
                ${C("book.create_category", { name: t })}
              </button>` : e.length ? y : _`<p class="empty">${C("book.no_hits")}</p>`}
        ${this.failure ? _`<p class="error" role="alert">${this.failure}</p>` : y}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${C("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${C("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-category-picker", Ln);
//#endregion
//#region src/diet-fields.ts
var Rn = [
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
], zn = (e) => e == null ? C("diet.unknown") : e === "" ? C("allergens.none") : String(e).split(",").map((e) => C(`allergen.${e}`)).join(", "), Bn = (e, t, n) => Rn.filter((r) => r === t ? n : e.split(",").includes(r)).join(",");
function Vn(e) {
	let t = e.allergens ?? null;
	return _`<label>
      <span class="lbl" title=${C("tip.diet")}>${C("diet.label")}</span>
      ${K({
		testid: "diet",
		own: e.diet,
		dflt: e.dietDflt,
		optional: !0,
		empty: C("diet.unknown"),
		options: Kt.map((e) => [e, C(`diet.${e}`)]),
		numeric: !1,
		onChange: (t) => e.onDiet(t)
	})}
    </label>
    <div class="field" data-testid="allergens">
      <span class="lbl" title=${C("tip.allergens")}>${C("allergens.label")}</span>
      ${t == null ? _`<span class="inh"
              ><span class="detail" data-testid="allergens-inherited"
                >${C("common.default", {
		value: zn(e.allergensDflt?.value),
		source: e.allergensDflt?.source ?? C("settings.inherit_default")
	})}</span
              >
              <button
                type="button"
                data-testid="allergens-own"
                @click=${() => e.onAllergens(e.allergensDflt?.value ?? "")}
              >
                ${C("allergens.own")}
              </button></span
            >` : _`<span class="allergen-grid">
                ${Rn.map((n) => _`<label class="check"
                      ><input
                        type="checkbox"
                        data-testid=${`allergen-${n}`}
                        .checked=${t.split(",").includes(n)}
                        @change=${(r) => e.onAllergens(Bn(t, n, r.target.checked))}
                      />${C(`allergen.${n}`)}</label
                    >`)}
              </span>
              <span class="detail">${C("allergens.none_hint")}</span>
              ${Fn("allergens", () => e.onAllergens(null))}`}
    </div>`;
}
//#endregion
//#region src/settings-format.ts
function Hn(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function Un(e, t) {
	return t === "default" ? C("settings.inherit_default") : C("settings.inherit_from", { name: Hn(e, t) });
}
function Wn(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: t === "food" || t === "frozen_goods" || t === "emergency_group" || t === "diet" || t === "allergens" ? null : e.defaults[t],
		source: "default"
	};
}
function q(e, t, n, r) {
	if (n === "food") return C(r === 0 ? "settings.food.no" : "settings.food.yes");
	if (n === "frozen_goods") return C(r === 1 ? "settings.frozen_goods.yes" : "settings.frozen_goods.no");
	if (n === "emergency_group") return C(r == null || r === "none" ? "settings.emergency_group.none" : `emergency.group.${r}`);
	if (r == null) return C("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : C("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? C("common.none_dash") : n === "expiry_type" ? C(`settings.expiry.${r}`) : Nn(t, r);
}
//#endregion
//#region src/min-stock.ts
function Gn(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = C("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = C("valid.packages")), t;
}
function Kn(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return _`<label>
      <span class="lbl" title=${C("tip.min_stock")}>${C("settings.category.min_stock")}</span>
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
          aria-label=${C("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${Jt(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => _`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${k(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${C("tip.min_packages")}>${C("settings.category.min_packages")}</span>
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
        <span class="detail">${C("book.packages")}</span>
      </span>
      ${k(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${C("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-model.ts
var qn = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null,
	meals: null
}, Jn = {
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
}, Yn = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, Xn = [
	"warn_days",
	"shelf_days",
	"opened_days",
	"frozen_days"
], Zn = class extends S {
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
		for (let i of Jn[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = C("valid.duplicate")) : n.name = C("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = C("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = C("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = C("valid.days")), t.shelf_days != null && !(Number.isInteger(t.shelf_days) && t.shelf_days >= 1) && (n.shelf_days = C("valid.shelf_days")), t.opened_days != null && !(Number.isInteger(t.opened_days) && t.opened_days >= 1) && (n.opened_days = C("valid.shelf_days")), t.frozen_days != null && !(Number.isInteger(t.frozen_days) && t.frozen_days >= 1) && (n.frozen_days = C("valid.shelf_days")), Object.assign(n, Gn(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Jn[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Yt(this.hass, t, r);
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t, n) {
		return _`<label><span class="lbl" title=${n ?? y}>${e}</span>${t}</label>`;
	}
	text(e) {
		return _`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${k(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return _`<span class="num"
        ><input
          type="number"
          step=${Xn.includes(e) ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value;
			this.set(e, M(n));
		}}
        />${n ? _`<span class="detail">${n}</span>` : y}</span
      >${Xn.includes(e) ? y : k(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return _`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" .selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => _`<option value=${e} .selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? y : _`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${E(yt)}${C("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = Wn(i, e, this.edit.d.parent_id), o = q(i, this.hass, e, a.value), s = Un(i, a.source), c = Xn.includes(e) ? this.numInput(e, C("common.default", {
			value: o,
			source: s
		}), C("common.days_unit")) : this.select(e, n, C("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, _`<span class="inh">${c}${this.reset(e)}</span
        >${k(this.errs[e], e)}`, C(`tip.${e}`));
	}
	diet(e) {
		let t = (t) => {
			let n = Wn(this.data, t, e.parent_id);
			return n.value == null ? void 0 : {
				value: n.value,
				source: Un(this.data, n.source)
			};
		};
		return Vn({
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
		if (!e || !this.data) return _`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = _`${this.field(C("common.name"), this.text("name"))}
        <label class="check"
          ><input
            type="checkbox"
            data-testid="location-freezer"
            .checked=${!!n.freezer}
            @change=${(e) => this.set("freezer", +!!e.target.checked)}
          />${C("settings.location.freezer")}</label
        >
        ${k(C("settings.location.freezer_hint"), "location-freezer", !0)}`;
		else if (t === "unit") {
			let e = Jt(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = _`${this.field(C("common.name"), this.text("name"))}${this.field(C("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${C("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${C("settings.unit.recipe_only")}</label
        >
        ${k(C("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(C("settings.unit.base"), this.select("base_unit_id", e, C("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(C("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? Wn(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = _`${this.field(C("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${C("settings.category.parent")}</span>
          <home-inventory-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${C("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></home-inventory-category-picker>
        </div>
        ${this.inh("unit_id", C("settings.category.unit"), Jt(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", C("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", C("settings.category.expiry_type"), qt.map((e) => [e, C(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", C("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", C("settings.category.shelf_days"), [])}
        ${R("opened") ? this.inh("opened_days", C("settings.category.opened_days"), []) : ""}
        ${this.inh("food", C("settings.food.label"), [[1, C("settings.food.yes")], [0, C("settings.food.no")]])}
        ${R("frozen") ? _`${this.inh("frozen_days", C("settings.category.frozen_days"), [])}
              ${this.inh("frozen_goods", C("settings.frozen_goods.label"), [[0, C("settings.frozen_goods.no")], [1, C("settings.frozen_goods.yes")]])}` : ""}
        ${R("emergency") ? this.inh("emergency_group", C("settings.emergency_group.label"), [...kn.map((e) => [e, C(`emergency.group.${e}`)]), ["none", C("settings.emergency_group.none")]], !1) : ""}
        ${R("diet") ? this.diet(n) : ""}
        ${Kn({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? _`<p class="detail">${C("settings.category.off_tags", { tags: t.join(", ") })}</p>` : y}`;
		}
		let c = () => Jn[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? Hn(i, n.parent_id) : "";
		return D({
			title: n.id ? C("common.edit_name", { name: r.name }) : l ? C("settings.category.add_sub_to", { name: l }) : C(Yn[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [w];
	}
};
customElements.define("home-inventory-settings-dialog", Zn);
//#endregion
//#region src/defaults-view.ts
var Qn = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"],
	["shelf_days", "settings.category.shelf_days"],
	["opened_days", "settings.category.opened_days"],
	["frozen_days", "settings.category.frozen_days"]
], $n = {
	opened_days: "opened",
	frozen_days: "frozen"
}, er = (e) => !$n[e] || R($n[e]), tr = class extends S {
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
		return t === null || !Number.isInteger(t) || t < 0 ? C("valid.days") : void 0;
	}
	shelfError(e, t = "shelf_days") {
		let n = e[t];
		return n !== null && !(Number.isInteger(n) && n >= 1) ? C("valid.shelf_days") : void 0;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!(this.warnError(t) || this.shelfError(t) || this.shelfError(t, "opened_days") || this.shelfError(t, "frozen_days"))) try {
			await Xt(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? _`<p class="detail intro">${C("settings.defaults.hint")}</p>
      <ul>
        ${Qn.filter(([e]) => er(e)).map(([t, n]) => _`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${C(n)}</span>
                <span class="detail">${q(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${O({
			testid: "default",
			name: C(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : _``;
	}
	select(e, t) {
		let n = this.d;
		return _`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => _`<option value=${t ?? ""} .selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return _`<dialog></dialog>`;
		let n = this.warnError(t), r = this.shelfError(t), i = this.shelfError(t, "opened_days"), a = this.shelfError(t, "frozen_days");
		return D({
			title: C("settings.defaults.edit"),
			body: _`<label>
          <span class="lbl" title=${C("tip.unit_id")}>${C("settings.category.unit")}</span>
          ${this.select("unit_id", Jt(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${C("tip.default_location_id")}
            >${C("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, C("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${C("tip.expiry_type")}
            >${C("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", qt.map((e) => [e, C(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${C("tip.warn_days")}>${C("settings.category.warn_days")}</span>
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
				this.set("warn_days", M(t));
			}}
            />
            ${C("common.days_unit")}
          </span>
          ${k(n, "default-warn_days")}
        </label>
        ${this.optionalDays(t, "shelf_days", r)}
        ${R("opened") ? this.optionalDays(t, "opened_days", i) : ""}
        ${R("frozen") ? this.optionalDays(t, "frozen_days", a) : ""}`,
			error: this.error,
			invalid: !!n || !!r || !!i || !!a,
			dirty: () => Qn.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	optionalDays(e, t, n) {
		return _`<label>
      <span class="lbl" title=${C(`tip.${t}`)}>${C(`settings.category.${t}`)}</span>
      <span class="num">
        <input
          data-testid=${`default-${t}`}
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          aria-invalid=${!!n}
          .value=${String(e[t] ?? "")}
          @input=${(e) => this.set(t, M(e.target.value))}
        />
        ${C("common.days_unit")}
      </span>
      ${k(n, `default-${t}`)}
    </label>`;
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-defaults", tr);
//#endregion
//#region src/api-diet.ts
var nr = (e, t) => e.callWS({
	type: "home_inventory/diet_reload",
	after: t
}), rr = class extends S {
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
				let t = await nr(this.hass, e);
				if (this.checked === 0 && (this.total = t.total), this.checked += t.checked, this.filled += t.filled, e = t.last, t.done) {
					this.finished = !0;
					break;
				}
			}
		} catch (e) {
			this.error = await P(this.hass, e);
		}
		this.running = !1;
	}
	render() {
		return !R("diet") || !z("off_lookup") || !N(this.hass) ? y : _`<div class="bar">
      ${this.running ? _`<button
                type="button"
                data-testid="diet-reload-stop"
                @click=${() => this.stopped = !0}
              >
                ${C("diet.reload.stop")}
              </button>
              <span class="detail" data-testid="diet-reload-progress" role="status"
                >${C("diet.reload.progress", {
			n: this.checked,
			m: this.total
		})}</span
              >` : _`<button type="button" data-testid="diet-reload" @click=${() => this.run()}>
                ${C("diet.reload.button")}
              </button>
              ${this.finished || this.checked ? _`<span class="detail" data-testid="diet-reload-result" role="status"
                      >${C("diet.reload.result", {
			n: this.filled,
			m: this.checked
		})}</span
                    >` : _`<span class="detail">${C("diet.reload.hint")}</span>`}`}
      ${this.error ? _`<span class="error" role="alert">${this.error}</span>` : y}
    </div>`;
	}
	static {
		this.styles = [w];
	}
};
customElements.define("home-inventory-diet-reload", rr);
//#endregion
//#region src/meal-times-view.ts
var ir = /^([01][0-9]|2[0-3]):[0-5][0-9]$/, ar = class extends S {
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
			this.error = await P(this.hass, e);
		}
	}
	async open() {
		this.error = "", this.d = [...this.starts], await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), !this.d.some((e) => !ir.test(e))) try {
			await this.hass.callWS({
				type: "home_inventory/meal_times_save",
				starts: this.d
			}), this.starts = [...this.d], this.renderRoot.querySelector("dialog")?.close();
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		if (!this.starts) return _`${this.error ? _`<p class="error">${this.error}</p>` : ""}`;
		let e = this.d;
		return _`<p class="detail intro">${C("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map((e, t) => _`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${C(`plan.slot.${t}`)}</span>
                <span class="detail">${C("settings.meals.from", { time: e })}</span>
              </button>
              ${O({
			testid: "meal-time",
			name: C(`plan.slot.${t}`),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${e ? D({
			title: C("settings.meals.edit"),
			body: _`${e.map((t, n) => _`<label>
                    <span class="lbl">${C(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!ir.test(t)}
                      .value=${t}
                      @input=${(t) => this.d = e.map((e, r) => r === n ? t.target.value : e)}
                    />
                    ${k(ir.test(t) ? void 0 : C("valid.time"), `meal-time-${n}`)}
                  </label>`)}`,
			error: this.error,
			invalid: e.some((e) => !ir.test(e)),
			dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		}) : _`<dialog></dialog>`}`;
	}
	static {
		this.styles = [w];
	}
};
customElements.define("home-inventory-meal-times", ar);
//#endregion
//#region src/move-location.ts
var or = class extends S {
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
			let t = (await $t(this.hass, "location", e.id)).groups.find((e) => e.kind === "delete.stock");
			this.batches = t?.count ?? 0, this.packages = t?.packages ?? 0;
		} catch (e) {
			this.error = await P(this.hass, e);
		}
		this.from = e, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("select")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.target && this.batches) try {
			await Qt(this.hass, this.from.id, Number(this.target)), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("moved"));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.from;
		return e ? D({
			title: C("settings.location.move_name", { name: e.name }),
			body: _`<p class="detail" data-testid="move-summary">
          ${this.batches ? C("settings.location.move_summary", {
				batches: this.batches,
				packages: this.packages,
				name: e.name
			}) : C("settings.location.move_empty")}
        </p>
        <label>
          <span class="lbl">${C("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e) => this.target = e.target.value}
          >
            <option value="">${C("settings.location.move_choose")}</option>
            ${this.locations.filter((t) => t.id !== e.id).map((e) => _`<option value=${e.id}>${e.name}</option>`)}
          </select>
          ${k(this.target ? void 0 : C("valid.location"), "move-target")}
        </label>`,
			error: this.error,
			invalid: !this.target || !this.batches,
			submit: {
				label: C("settings.location.move_action"),
				testid: "move-save"
			},
			dirty: () => !!this.target,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.from = void 0
		}) : _`<dialog></dialog>`;
	}
	static {
		this.styles = [w, s`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-move-location", or);
//#endregion
//#region src/label-print.ts
function sr(e, t, n, r) {
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
async function cr(e, t, n, r = !1) {
	if (n > 2 && !await T({
		title: C("label.confirm_many", { n }),
		action: C("label.submit")
	})) return null;
	let i = await dn(e, r ? {
		location_id: t,
		count: n
	} : {
		batch_id: t,
		count: n
	});
	return "printed" in i ? i.printed : (sr(i.image, i.count, i.width_mm, i.height_mm), 0);
}
//#endregion
//#region src/label-dialog.ts
var lr = class extends S {
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
			let e = this.batch, t = await cr(this.hass, e.id, Number(this.count), e.location);
			if (t === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-printed", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return _`<dialog></dialog>`;
		let t = this.invalid();
		return D({
			title: C("label.title", { name: e.name }),
			body: _`<label>
        <span class="lbl">${C("label.count")}</span>
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
        ${t ? k(C("valid.label_count", { max: 20 }), "label-count") : e.location ? _`<span class="detail">${C("location_label.hint")}</span>` : _`<span class="detail">${C("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: C("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-label-dialog", lr);
//#endregion
//#region src/location-scan.ts
var ur = /^PTRY:L(\d+)$/i, dr = (e) => ur.test(e.trim());
async function fr(e, t) {
	let n = Number(ur.exec(t.trim())[1]);
	return (await F(e)).locations.find((e) => e.id === n) ?? null;
}
var pr = (e, t) => e ? _`<p class="done" role="status" data-testid="scanned-location">
        ${C("location_label.active", { name: e })}
        <button type="button" class="undo" data-testid="scanned-location-clear" @click=${t}>
          ${C("location_label.clear")}
        </button>
      </p>` : y, mr = (e, t) => {
	let n = C("location_label.print", { name: e.name });
	return _`<button
    class="icon-btn"
    data-testid="location-label"
    aria-label=${n}
    title=${n}
    @click=${t}
  >
    ${E(Ct)}
  </button>`;
}, hr = 5, gr = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = C(r, { n });
	return i === r ? C("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, _r = (e) => {
	let t = e.names.length - hr;
	return e.names.slice(0, hr).join(", ") + (t > 0 ? C("delete.more", { n: t }) : "");
};
async function vr(e, t, n, r) {
	let i = n === "location" || n === "unit" ? C(`settings.${n}.delete_hint`) : void 0, a = await $t(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "home_inventory",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await It(r.name, i) ? (await Zt(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = _`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => _`<li>
            <span class="kind">${gr(n, e)}</span>
            <span class="names">${_r(e)}</span>
            ${e.packages ? _`<span class="names">${C("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? _`<label>
            <span class="lbl">${C("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => _`<option value=${e.id}>${C("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${C("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await T({
		title: C("common.delete_name", { name: r.name }) + "?",
		message: i ?? C("delete.affected"),
		body: c,
		action: C(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await Zt(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var yr = class extends S {
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
		return Object.keys(qn).filter((e) => e !== "meals" || R("plan"));
	}
	get sec() {
		return this.sections.includes(this.section ?? "") ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await F(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await P(this.hass, e);
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
		this.expanded = Ut(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => q(t, this.hass, n, e[n]));
		if (e.shelf_days != null && n.push(C("settings.category.shelf_short", { days: q(t, this.hass, "shelf_days", e.shelf_days) })), e.opened_days != null && R("opened") && n.push(C("settings.category.opened_short", { days: q(t, this.hass, "opened_days", e.opened_days) })), e.food === 0 && n.push(C("settings.food.no")), R("frozen") && (e.frozen_days != null && n.push(C("settings.category.frozen_short", { days: q(t, this.hass, "frozen_days", e.frozen_days) })), e.frozen_goods === 1 && n.push(C("settings.frozen_goods.yes"))), e.min_stock != null) {
			let r = q(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(C("settings.category.min", { value: `${V(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(C("settings.category.min", { value: C("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = qn[e];
		return _`
      <nav aria-label=${C("settings.nav")}>
        ${this.sections.map((t) => _`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${C(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? _`<p class="error" role="alert">${this.pageError}</p>` : y}
      ${this.data ? t ? _`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${C(Yn[t])}
                  </button>
                </div>
                ${e === "categories" ? _`<home-inventory-diet-reload .hass=${this.hass}></home-inventory-diet-reload>` : y}
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : e === "meals" ? _`<home-inventory-meal-times .hass=${this.hass}></home-inventory-meal-times>` : _`<home-inventory-defaults
                  .hass=${this.hass}
                  .data=${this.data}
                  @home-inventory-saved=${this.load}
                ></home-inventory-defaults>` : y}
      <home-inventory-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @home-inventory-saved=${this.load}
      ></home-inventory-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? y : _`<p class="empty">${C("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = y, a = y) {
		return _`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" data-testid="settings-row" @click=${n}>
        <span>${e}</span>${t ? _`<span class="detail">${t}</span>` : y}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return O({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "location" ? {
				onMove: () => this.renderRoot.querySelector("home-inventory-move-location").open(t),
				moveLabel: C("settings.location.move_name", { name: t.name })
			} : {},
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: C("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await vr(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await P(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return _`<ul>
        ${e.map((e) => this.row(e.name, e.freezer ? C("settings.location.freezer") : "", () => this.open("location", e), 0, y, _`${mr(e, () => this.renderRoot.querySelector("home-inventory-label-dialog").open({
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
				t.recipe_only ? C("settings.unit.recipe_only") : "",
				n ? `= ${V(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? C("settings.unit.no_conversion") : t.is_count ? C("settings.unit.count") : ""
			].filter(Boolean).join(" · ");
		};
		return _`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, y, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return _`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? Ht(r, () => this.toggle(e.id)) : _`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-settings", yr);
//#endregion
//#region src/stock-data.ts
function br(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => H(e.join(" "), a), s = /* @__PURE__ */ new Map();
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
		W(i?.categories, e.category_id)
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
var xr = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${A()}T00:00`)) / 864e5);
function Sr(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = xr(e.expires_on);
	return i < 0 ? e.expiry_type === "use_by" ? "expired" : "past" : i <= (r ?? Number(t?.warn_days ?? G(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function Cr(e, t, n, r) {
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
//#region src/product-image.ts
var wr = [
	"openfoodfacts.org",
	"openbeautyfacts.org",
	"openpetfoodfacts.org",
	"openproductsfacts.org"
];
function Tr(e) {
	try {
		let t = new URL(e);
		return t.protocol === "https:" && wr.some((e) => t.hostname === e || t.hostname.endsWith(`.${e}`));
	} catch {
		return !1;
	}
}
var Er = (e) => e && z("off_images") && Tr(e) ? _`<img
        class="pimg"
        src=${e}
        alt=""
        width="40"
        height="40"
        @error=${(e) => e.target.hidden = !0}
        loading="lazy"
        referrerpolicy="no-referrer"
        data-testid="product-image"
      />` : y, Dr = s`
  .pimg[hidden] {
    display: none;
  }
  .pimg {
    flex: none;
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin: 0 8px;
  }
`;
//#endregion
//#region src/booking-done.ts
function J(e, t, n, r, i) {
	return e ? _`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${Er(i)} ${e}
    ${t ? _`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${C("stock.undo")}
          </button>` : y}
    ${r ?? y}
  </p>` : y;
}
var Y = s`
  ${Dr}
  .done {
    margin: 0 0 12px;
  }
  .done .pimg {
    margin: 0 8px 0 0;
    vertical-align: middle;
  }
  .undo {
    margin-left: 8px;
    padding: 4px 8px;
    color: var(--primary-color);
  }
`, Or = (e, t) => e.callWS({
	type: "home_inventory/open_package",
	...t
}), kr = (e, t) => e.callWS({
	type: "home_inventory/open_label",
	code: t
}), Ar = (e, t) => e.callWS({
	type: "home_inventory/open_undo",
	booking_id: t
}), jr = (e, t) => e.callWS({
	type: "home_inventory/freeze",
	...t
}), Mr = (e, t) => e.callWS({
	type: "home_inventory/frozen_undo",
	booking_id: t
}), Nr = (e, t, n) => e.callWS({
	type: "home_inventory/freeze_scan",
	code: t,
	...n ? { location_id: n } : {}
}), Pr = (e, t) => e.callWS({
	type: "home_inventory/remaining",
	...t
}), Fr = [
	1,
	.75,
	.5,
	.25,
	.1
], Ir = {
	1: "level.full",
	.75: "level.three_quarters",
	.5: "level.half",
	.25: "level.quarter",
	.1: "level.low",
	0: "level.empty"
}, Lr = (e) => (e < 1 ? Fr.slice(1) : Fr).reduce((t, n) => Math.abs(n - e) < Math.abs(t - e) ? n : t), Rr = (e) => Fr.find((t) => t < e - 1e-9) ?? e, zr = (e) => C(Ir[e === 0 ? 0 : Lr(e)]);
function Br(e, t, n, r = []) {
	let i = Lr(t), a = i === .1 ? zr(i) : C("stock.left", { level: zr(i) }), o = r.find((e) => e.id === n?.content_unit_id);
	return !o || !n?.content_amount ? a : C("stock.left_amount", {
		left: a,
		amount: U(e, Math.round(t * n.content_amount * 10) / 10, o.symbol)
	});
}
var Vr = (e) => {
	let t = Lr(e.value), n = e.empty ? [...Fr, 0] : Fr;
	return _`<select
    data-testid=${e.testid}
    aria-label=${e.label}
    title=${e.label}
    @change=${(t) => e.on(Number(t.target.value))}
  >
    ${n.map((e) => _`<option value=${e} ?selected=${e === t}>${zr(e)}</option>`)}
  </select>`;
};
//#endregion
//#region src/take-out.ts
async function Hr(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await I(e.hass);
	} catch (t) {
		e.undo = n, e.error = await P(e.hass, t);
	}
}
var Ur = (e, t, n) => Hr(e, async () => {
	let { taken: r } = await an(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), Wr = (e) => {
	let t = e.undo;
	if (t) return Hr(e, async () => {
		await on(e.hass, t.taken);
	});
}, Gr = (e, t, n, r) => {
	let i = C("stock.take_one", { name: t });
	return _`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => Ur(e, t, n)}
  >
    ${E(ft)}
  </button>`;
}, Kr = (e, t, n) => {
	let r = e.undo;
	return Vr({
		value: n.remaining,
		empty: !0,
		label: C("stock.level", { name: t }),
		testid: "stock-batch-level",
		on: (i) => Hr(e, async () => {
			let a = await Pr(e.hass, {
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
}, qr = (e, t) => J(e.undo ? C("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => Wr(e)), t), Jr = (e, t) => e.dispatchEvent(new CustomEvent("home-inventory-print-label", {
	detail: {
		id: t.batch_id,
		name: t.name,
		packages: 1
	},
	bubbles: !0,
	composed: !0
}));
function Yr(e, t, n, r, i) {
	return t ? J(t.expires_on ? C("stock.opened_until", {
		name: t.name,
		date: B(e, t.expires_on)
	}) : C("stock.opened_one", { name: t.name }), n, i, _`<button type="button" class="undo" data-testid=${`${i}-label`} @click=${r}>
      ${C("stock.opened_label")}
    </button>`) : y;
}
async function Xr(e, t) {
	let n = e.opened;
	e.error = "", e.opened = void 0;
	try {
		e.opened = await t(), e.stock = await I(e.hass);
	} catch (t) {
		e.opened = n, e.error = await P(e.hass, t);
	}
}
var Zr = (e) => {
	let t = e.opened;
	if (t) return Xr(e, () => Ar(e.hass, t.booking_id).then(() => void 0));
}, Qr = (e, t, n) => {
	if (n.opened_on) return y;
	let r = C("stock.open_one", { name: t });
	return _`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${r}
    title=${r}
    @click=${() => Xr(e, () => Or(e.hass, {
		product_id: n.product_id,
		batch_id: n.batch_id,
		location_id: n.location_id
	}))}
  >
    ${E(pt)}
  </button>`;
};
//#endregion
//#region src/frozen-action.ts
function $r(e, t) {
	if (!e || !t) return !1;
	let n = e.categories.find((e) => e.id === t.category_id)?.effective;
	return !n || n.food.value === 0 || n.frozen_goods.value === 1 ? !1 : (t.frozen_days ?? n.frozen_days.value) != null;
}
function ei(e, t, n, r) {
	let i = !!e?.locations.find((e) => e.id === n.location_id)?.freezer, a = !!n.frozen_on;
	if (!a && (i || !$r(e, t))) return y;
	let o = C(a ? "frozen.thaw_title" : "frozen.freeze_title", { name: n.name });
	return _`<button
    class="icon-btn"
    data-testid=${a ? "stock-batch-thaw" : "stock-batch-freeze"}
    aria-label=${o}
    title=${o}
    @click=${() => r(a)}
  >
    ${E(a ? xt : bt)}
  </button>`;
}
function ti(e, t, n, r) {
	if (!t) return y;
	let i = t.result;
	return J(C(t.thaw ? "frozen.thawed" : "frozen.frozen", {
		name: i.name,
		location: i.location,
		date: i.expires_on ? B(e, i.expires_on) : ""
	}), n, "frozen", t.thaw ? void 0 : _`<button type="button" class="undo" data-testid="frozen-label" @click=${r}>
          ${C("stock.opened_label")}
        </button>`);
}
async function ni(e) {
	let t = e.frozen;
	if (t) {
		e.frozen = void 0, e.error = "";
		try {
			await Mr(e.hass, t.result.booking_id), e.stock = await I(e.hass);
		} catch (n) {
			e.frozen = t, e.error = await P(e.hass, n);
		}
	}
}
//#endregion
//#region src/stock-batch-row.ts
function ri(e, t, n, r) {
	let i = t.expires_on ? B(e, t.expires_on) : C("stock.no_date");
	return t.expires_on && t.expiry_type === "guide" ? i = C("stock.approx_date", { date: i }) : t.expiry_guessed && (i = C("stock.guessed_date", { date: i })), t.opened_on && (i = C("stock.opened_on", {
		date: i,
		opened: B(e, t.opened_on)
	})), t.frozen_on && (i = C("stock.frozen_on", {
		date: i,
		frozen: B(e, t.frozen_on)
	})), t.remaining < 1 && (i += `, ${Br(e, t.remaining, n, r?.units)}`), t.charge ? C("stock.charge", {
		date: i,
		charge: t.charge
	}) : i;
}
var ii = (e, t, n) => _`<li data-testid="stock-batch">
    <span class=${e.status(n)}>${e.date(n)}</span>
    <span class="detail">${n.location}</span>
    <span class="count">${C("book.count", { n: n.packages })}</span>
    <span class="acts">
      ${Gr(e.host, t, n, "stock-batch-out")}
      ${R("opened") && (n.opened_on || n.frozen_on) ? Kr(e.host, t, n) : ""}
      ${R("opened") && !n.frozen_on ? Qr(e.host, t, n) : ""}
      ${R("frozen") ? ei(e.md, e.product, n, (t) => e.freeze(n, t)) : ""}
      <button
        class="icon-btn"
        data-testid="stock-batch-label"
        aria-label=${C("label.print_name", { name: t })}
        title=${C("label.print")}
        @click=${() => e.label(n)}
      >
        ${E(Ct)}
      </button>
      ${O({
	testid: "batch",
	name: `${t}, ${e.date(n)}`,
	onEdit: () => e.edit(n)
})}
    </span>
  </li>`, ai = (e, t, n, r, i, a) => _`<li style="padding-left:${r * 24}px">
    ${Ht(i, () => a(`c${e}`))}
    <button
      class="row"
      data-testid="stock-category"
      aria-expanded=${i}
      @click=${() => a(`c${e}`)}
    >
      <span>${t}</span>
      <span class="detail">${C("book.count", { n })}</span>
    </button>
  </li>`, oi = (e) => _`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${C("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${C("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => _`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
      <button
        type="button"
        data-testid="stocktake-start"
        @click=${(e) => e.target.dispatchEvent(new CustomEvent("home-inventory-navigate", {
	detail: "stocktake",
	bubbles: !0,
	composed: !0
}))}
      >
        ${E(tt)}${C("stocktake.start")}
      </button>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${C("stock.with_empty")}
    </label>`, si = s`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, ci = s`
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
`, li = class extends S {
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
		return /^\d+$/.test(e.packages.trim()) && t >= 1 && t <= this.row.packages ? void 0 : C("frozen.packages_range", { n: this.row.packages });
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (this.errors(t)) return;
		let n = this.row;
		try {
			let e = await jr(this.hass, {
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
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return _`<dialog></dialog>`;
		let t = this.errors(e), n = this.locations.filter((e) => !!e.freezer !== this.thaw), r = this.row.name;
		return D({
			title: C(this.thaw ? "frozen.thaw_title" : "frozen.freeze_title", { name: r }),
			body: _`<label>
          <span class="lbl">${C("book.packages")}</span>
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
          ${k(t, "frozen-packages")}
        </label>
        <label>
          <span class="lbl">${C("frozen.to")}</span>
          <select
            data-testid="frozen-to"
            @change=${(t) => this.d = {
				...e,
				to: t.target.value
			}}
          >
            <option value="" .selected=${e.to === ""}>
              ${C(this.thaw ? "frozen.to_default_thaw" : "frozen.to_default_freeze")}
            </option>
            ${n.map((t) => _`<option value=${t.id} .selected=${e.to === String(t.id)}>${t.name}</option>`)}
          </select>
        </label>`,
			error: this.error,
			invalid: !!t,
			submit: {
				label: C(this.thaw ? "frozen.thaw" : "frozen.freeze"),
				testid: "frozen-submit"
			},
			dirty: () => e.packages !== "1" || e.to !== "",
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-frozen-dialog", li);
//#endregion
//#region src/product-fields.ts
var ui = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
}), di = (e) => Object.fromEntries([
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
function fi(e) {
	let t = {};
	return e.name.trim() || (t.name = C("valid.required")), e.category_id == null && !e.new_type && (t.category = C("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = C("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = C("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = C("valid.packages")), t;
}
function pi(e, t, n, r = {}, i) {
	return _`<label>
      <span class="lbl">${C("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${k(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${C("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${C("book.category")}</span>
      <home-inventory-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></home-inventory-category-picker>
      ${k(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${C("tip.content")}>${C("book.content")}</span>
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
		n("content_amount", M(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${C("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${C("common.none_dash")}</option>
          ${Jt(e?.units ?? [], t.content_unit_id).map((e) => _`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${k(r.content, "content")}
    <label>
      <span class="lbl" title=${C("tip.product_min_packages")}>${C("products.min_packages")}</span>
      ${In({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: C("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${k(r.min_packages, "min-packages")}
    </label>`;
}
function mi(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${V(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/product-dialog.ts
var hi = [
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
], gi = class extends S {
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
		let t = fi(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = C("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = C("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = C("valid.days")), e.shelf_days != null && !(Number.isInteger(e.shelf_days) && e.shelf_days >= 1) && (t.shelf_days = C("valid.shelf_days")), e.opened_days != null && !(Number.isInteger(e.opened_days) && e.opened_days >= 1) && (t.opened_days = C("valid.shelf_days")), e.frozen_days != null && !(Number.isInteger(e.frozen_days) && e.frozen_days >= 1) && (t.frozen_days = C("valid.shelf_days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of hi) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await ln(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return _`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => G(this.md, e.category_id, t);
		return D({
			title: C("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: _`${pi(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${C("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${k(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl" title=${C("tip.default_location_id")}
            >${C("settings.category.location")}</span
          >
          ${K({
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
          <span class="lbl" title=${C("tip.expiry_type")}
            >${C("settings.category.expiry_type")}</span
          >
          ${K({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: qt.map((e) => [e, C(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${C("tip.warn_days")}>${C("settings.category.warn_days")}</span>
          ${In({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => Nn(this.hass, e),
				suffix: C("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${k(t.warn_days, "warn-days")}
        </label>
        <label>
          <span class="lbl" title=${C("tip.shelf_days")}>${C("settings.category.shelf_days")}</span>
          ${In({
				testid: "shelf-days",
				own: e.shelf_days,
				dflt: n("shelf_days"),
				format: (e) => Nn(this.hass, e),
				suffix: C("common.days_unit"),
				invalid: !!t.shelf_days,
				onChange: (e) => this.set("shelf_days", e)
			})}
          ${k(t.shelf_days, "shelf-days")}
        </label>
        ${R("opened") ? _`<label>
                <span class="lbl" title=${C("tip.opened_days")}
                  >${C("settings.category.opened_days")}</span
                >
                ${In({
				testid: "opened-days",
				own: e.opened_days,
				dflt: n("opened_days"),
				format: (e) => Nn(this.hass, e),
				suffix: C("common.days_unit"),
				invalid: !!t.opened_days,
				onChange: (e) => this.set("opened_days", e)
			})}
                ${k(t.opened_days, "opened-days")}
              </label>` : ""}
        ${R("frozen") ? _`<label>
                <span class="lbl" title=${C("tip.frozen_days")}
                  >${C("settings.category.frozen_days")}</span
                >
                ${In({
				testid: "frozen-days",
				own: e.frozen_days,
				dflt: n("frozen_days"),
				format: (e) => Nn(this.hass, e),
				suffix: C("common.days_unit"),
				invalid: !!t.frozen_days,
				onChange: (e) => this.set("frozen_days", e)
			})}
                ${k(t.frozen_days, "frozen-days")}
              </label>` : ""}
        ${R("diet") ? Vn({
				diet: e.diet,
				allergens: e.allergens,
				dietDflt: n("diet"),
				allergensDflt: n("allergens"),
				onDiet: (e) => this.set("diet", e),
				onAllergens: (e) => this.set("allergens", e)
			}) : ""}`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => hi.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-product-dialog", gi);
//#endregion
//#region src/batch-dialog.ts
var _i = class extends S {
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
		return j(e.dateBad, e.expires_on) && (t.expires = C("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = C("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await sn(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return _`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return D({
			title: C("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: _`<label>
          <span class="lbl">
            ${C("book.expires_on_type", { type: C(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? k(t.expires, "batch-expires") : _`<span class="detail">${C("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${C("book.packages")}</span>
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
          ${t.packages ? k(t.packages, "batch-packages") : _`<span class="detail">${C("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-batch-dialog", _i);
//#endregion
//#region src/api-purchase.ts
var vi = (e, t) => e.callWS({
	type: "home_inventory/receipt_read",
	text: t
}), yi = (e, t, n) => e.callWS({
	type: "home_inventory/receipt_book",
	store: t,
	items: n
}), bi = [
	"day",
	"week",
	"month"
], xi = [
	0,
	1,
	2,
	3,
	4
], X = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, Si = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Z = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), Ci = (e, t) => X(Z(Si(e), t)), wi = (e) => Z(e, -((e.getDay() + 6) % 7));
function Ti(e, t) {
	return e === "day" ? [t, Z(t, 1)] : e === "week" ? [wi(t), Z(wi(t), 7)] : [wi(new Date(t.getFullYear(), t.getMonth(), 1)), Z(wi(new Date(t.getFullYear(), t.getMonth() + 1, 0)), 7)];
}
var Ei = (e, t, n) => e === "month" ? new Date(t.getFullYear(), t.getMonth() + n, 1) : Z(t, n * (e === "week" ? 7 : 1)), Di = (e) => e?.locale?.language;
//#endregion
//#region src/receipt-row.ts
function Oi(e) {
	let t = {};
	return e.choice === null && (t.choice = C("receipt.choose")), e.choice === "skip" || (e.choice === "new" && !e.name.trim() && (t.name = C("valid.required")), e.choice === "new" && e.category_id == null && (t.category = C("valid.required")), Number.isInteger(e.packages) && e.packages >= 1 && e.packages <= 9999 || (t.packages = C("valid.packages")), j(e.dateBad, e.expires_on) && (t.expires = C("valid.date"))), t;
}
function ki(e, t) {
	let n = typeof e.choice == "number" ? e.item.candidates.find((t) => t.id === e.choice)?.shelf_days : e.choice === "new" ? G(t, e.category_id, "shelf_days")?.value : void 0;
	return n ? Ci(A(), Number(n)) : "";
}
function Ai(e) {
	let { r: t, i: n } = e, r = Oi(t), i = `r${n}`, a = t.choice === null ? "" : String(t.choice), o = !t.expires_on && ki(t, e.md) ? C("receipt.guess_hint") : "";
	return _`<li data-testid="receipt-row">
    <div class="text">${t.item.text}</div>
    <label>
      <span class="lbl">${C("receipt.product")}</span>
      <select
        data-testid="receipt-product"
        aria-invalid=${!!r.choice}
        .value=${a}
        @change=${(t) => {
		let n = t.target.value;
		e.set({ choice: n === "new" || n === "skip" ? n : Number(n) });
	}}
      >
        <option value="" disabled ?selected=${a === ""}>${C("receipt.choose_option")}</option>
        ${t.item.candidates.map((e) => _`<option value=${e.id} ?selected=${a === String(e.id)}>
              ${e.brand ? `${e.name} (${e.brand})` : e.name}
            </option>`)}
        <option value="new" ?selected=${a === "new"}>${C("receipt.new")}</option>
        <option value="skip" ?selected=${a === "skip"}>${C("receipt.skip")}</option>
      </select>
      ${k(r.choice, `${i}-product`)}
    </label>
    ${t.choice === "new" ? _`<label>
              <span class="lbl">${C("common.name")}</span>
              <input
                data-testid="receipt-name"
                aria-invalid=${!!r.name}
                .value=${t.name}
                @input=${(t) => e.set({ name: t.target.value })}
              />
              ${k(r.name, `${i}-name`)}
            </label>
            <div>
              <span class="lbl">${C("book.category")}</span>
              <home-inventory-category-picker
                .categories=${e.md?.categories ?? []}
                .value=${t.category_id}
                .hass=${e.hass}
                @change=${(t) => e.set({ category_id: t.detail })}
              ></home-inventory-category-picker>
              ${k(r.category, `${i}-category`)}
            </div>` : y}
    ${t.choice === "skip" ? y : _`<div class="pair">
            <label>
              <span class="lbl">${C("book.packages")}</span>
              <input
                type="number"
                min="1"
                max="9999"
                data-testid="receipt-packages"
                aria-invalid=${!!r.packages}
                .value=${String(t.packages)}
                @input=${(t) => e.set({ packages: Number(t.target.value) })}
              />
              ${k(r.packages, `${i}-packages`)}
            </label>
            <label>
              <span class="lbl">${C("book.expires_on")}</span>
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
              ${r.expires ? k(r.expires, `${i}-expires`) : _`<span class="detail">${o}</span>`}
            </label>
          </div>`}
  </li>`;
}
var ji = s`
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
async function Mi(t, n) {
	let { createWorker: r } = await import("./src-MUpJjT8c.js").then((t) => /* @__PURE__ */ e(t.default, 1)), i = new URL(
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
//#endregion
//#region src/photo.ts
async function Ni(e, t) {
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = document.createElement("canvas");
	return i.width = Math.round(n.width * r), i.height = Math.round(n.height * r), i.getContext("2d").drawImage(n, 0, 0, i.width, i.height), n.close(), i;
}
var Pi = async (e, t = 2e3) => (await Ni(e, t)).toDataURL("image/jpeg", .85), Fi = new URL(
	/* @vite-ignore */
	"vendor/opencv.js",
	import.meta.url
).href, Ii;
function Li() {
	return Ii ??= new Promise((e, t) => {
		let n = document.createElement("script");
		n.src = Fi, n.async = !0, n.onerror = () => {
			Ii = void 0, t(/* @__PURE__ */ Error("opencv"));
		}, n.onload = () => {
			Promise.resolve(window.cv).then((t) => t?.Mat ? e({ cv: t }) : n.onerror?.(new Event("error")), () => n.onerror?.(new Event("error")));
		}, document.head.append(n);
	}), Ii;
}
var Ri = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
function zi(e) {
	let t = (t) => [...e].sort((e, n) => t(e) - t(n)), n = t((e) => e.x + e.y), r = t((e) => e.y - e.x);
	return [
		n[0],
		r[0],
		n[3],
		r[3]
	];
}
var Bi = (e, t) => [
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
function Vi(e, t) {
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
				t.delete(), c = zi(i), l = r;
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
function Hi(e, t, n) {
	let [r, i, a, o] = n, s = Math.max(1, Math.round(Math.max(Ri(r, i), Ri(o, a)))), c = Math.max(1, Math.round(Math.max(Ri(r, o), Ri(i, a)))), l = e.imread(t), u = e.matFromArray(4, 1, e.CV_32FC2, n.flatMap((e) => [e.x, e.y])), d = e.matFromArray(4, 1, e.CV_32FC2, [
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
var Ui = .01, Wi = class extends S {
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
		let n = Ui * Math.max(this.image.width, this.image.height), r = {
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
		return _`<div class="frame">
      ${this.image}
      <svg
        viewBox="0 0 ${e} ${t}"
        preserveAspectRatio="none"
        @pointermove=${(e) => this.dragging >= 0 && this.move(this.dragging, this.at(e))}
        @pointerup=${() => this.dragging = -1}
        @pointercancel=${() => this.dragging = -1}
      >
        <polygon points=${this.quad.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
        ${this.quad.map((e, t) => Ae`<circle
              cx=${e.x}
              cy=${e.y}
              r=${n}
              tabindex="0"
              role="slider"
              data-testid="scan-corner"
              aria-label=${C(`scan.corner_${t}`)}
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
customElements.define("home-inventory-scan-corners", Wi);
//#endregion
//#region src/camera-dialog.ts
var Gi = 480, Ki = 1e3, qi = 200;
function Ji(e, t, n, r) {
	let i = Math.max(1, Math.max(t, n) / r), a = document.createElement("canvas");
	return a.width = Math.round(t / i), a.height = Math.round(n / i), a.getContext("2d").drawImage(e, 0, 0, a.width, a.height), {
		canvas: a,
		f: i
	};
}
var Yi = (e, t) => e?.map((e) => ({
	x: e.x * t,
	y: e.y * t
})) ?? null, Xi = class extends S {
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
					let { canvas: t, f: n } = Ji(e, e.videoWidth, e.videoHeight, Gi);
					this.live = Yi(Vi(this.cv, t), n);
				}
				this.timer = window.setTimeout(this.tick, qi);
			}
		}, this.closed = () => {
			this.stop(), this.still = void 0, this.finish();
		}, this.scan = !1, this.quad = [], this.live = null, this.video = {
			w: 0,
			h: 0
		}, this.running = this.ready = !1, this.error = "", this.busy = !1;
	}
	async show(e, t) {
		this.done?.(void 0), this.scan = e, this.still = t, this.live = null, this.error = "", this.busy = !1, this.quad = t ? Bi(t.width, t.height) : [];
		let n = new Promise((e) => this.done = e);
		return await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), e && Li().then(({ cv: e }) => {
			this.cv = e, this.ready = !0, this.still && this.findOutline();
		}, () => this.error = C("camera.no_scan")), n;
	}
	take(e) {
		let t = this.show(e);
		return this.updateComplete.then(() => this.start()), t;
	}
	edit(e) {
		return this.show(!0, e);
	}
	async start() {
		if (!navigator.mediaDevices?.getUserMedia) return void (this.error = C("scan.https"));
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
			this.stop(), this.error = C("scan.no_camera");
			return;
		}
		this.scan && (this.timer = window.setTimeout(this.tick, qi));
	}
	findOutline() {
		let e = this.still, { canvas: t, f: n } = Ji(e, e.width, e.height, Ki);
		this.quad = Yi(Vi(this.cv, t), n) ?? Bi(e.width, e.height);
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
		if (t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0), this.stop(), !this.scan) return this.finish(await Pi(t));
		this.quad = this.live ?? Bi(t.width, t.height), this.still = t;
	}
	async apply(e) {
		this.busy = !0;
		let t = this.still, n = e ? Hi(this.cv, t, this.quad).toDataURL("image/png") : await Pi(t, 3e3);
		this.busy = !1, this.finish(n);
	}
	liveView() {
		let { w: e, h: t } = this.video;
		return _`<div class="frame">
        <video muted playsinline></video>
        ${this.live && e ? _`<svg viewBox="0 0 ${e} ${t}" preserveAspectRatio="none">
                <polygon points=${this.live.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
              </svg>` : y}
      </div>
      ${this.scan ? _`<p class="detail">${C("camera.live_hint")}</p>` : y}`;
	}
	cornerView() {
		return _`<home-inventory-scan-corners
        .image=${this.still}
        .quad=${this.quad}
        @change=${(e) => this.quad = e.detail}
      ></home-inventory-scan-corners>
      <p class="detail">${C("camera.corners_hint")}</p>`;
	}
	actions() {
		return this.still ? _`<button
          type="button"
          data-testid="camera-uncut"
          ?disabled=${this.busy}
          @click=${() => this.apply(!1)}
        >
          ${C("camera.uncut")}
        </button>
        <button
          type="button"
          class="primary"
          data-testid="camera-apply"
          ?disabled=${this.busy || !this.ready}
          @click=${() => this.apply(!0)}
        >
          ${C("camera.apply")}
        </button>` : _`<button
      type="button"
      class="primary"
      data-testid="camera-capture"
      ?disabled=${!this.running}
      @click=${() => this.capture()}
    >
      ${C("camera.capture")}
    </button>`;
	}
	render() {
		return _`<dialog data-testid="camera" @close=${this.closed} @click=${zt()}>
      <h2>${C(this.scan ? "camera.title_scan" : "camera.title")}</h2>
      ${this.still ? this.cornerView() : this.liveView()}
      ${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${C("common.cancel")}</button>
        ${this.actions()}
      </div>
    </dialog>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-camera", Xi);
//#endregion
//#region src/receipt-import.ts
var Zi = 3e3, Qi = class extends S {
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
		this.image = this.rows = void 0, this.store = this.status = this.error = "", this.active = !0, un(this.hass).then((e) => this.prefill = e.prefill_expiry, () => void 0), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	guess(e) {
		return ki(e, this.md);
	}
	set(e, t) {
		let n = [...this.rows], r = n[e], i = {
			...r,
			...t
		};
		this.prefill && !("expires_on" in t) && r.expires_on === this.guess(r) && (i.expires_on = this.guess(i)), n[e] = i, this.rows = n;
	}
	invalid() {
		return this.rows ? !!this.status || this.rows.some((e) => Object.keys(Oi(e)).length) : !this.image || !!this.status;
	}
	async read() {
		let e = this.hass;
		this.status = C("receipt.ocr", { percent: "0" });
		try {
			let t = await Mi(this.image, (e) => {
				this.status = C("receipt.ocr", { percent: String(Math.round(e * 100)) });
			});
			if (!t.trim()) throw Error(C("receipt.no_text"));
			this.status = C("receipt.ai");
			let n = await vi(e, t.slice(0, 8e3));
			if (!n.items.length) throw Error(C("receipt.no_items"));
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
			this.error = t instanceof Error ? t.message : await P(e, t);
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
		this.status = C("receipt.booking");
		try {
			let t = await yi(this.hass, this.store.trim(), e);
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("booked", { detail: t.booked }));
		} catch (e) {
			this.error = await P(this.hass, e);
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
			r = await Ni(n, Zi);
		} catch {
			this.error = C("receipt.photo_invalid");
			return;
		}
		let i = await this.camera().edit(r);
		i && (this.image = i);
	}
	pickStep() {
		return _`<button
        type="button"
        class="scan"
        data-testid="receipt-scan"
        ?disabled=${!!this.status}
        @click=${() => this.scanReceipt()}
      >
        ${E(Ze)} ${C("receipt.scan")}
      </button>
      <label>
        <span class="lbl">${C("receipt.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="receipt-photo"
          ?disabled=${!!this.status}
          @change=${(e) => this.pickFile(e)}
        />
      </label>
      ${this.image ? _`<img
              class="preview"
              data-testid="receipt-preview"
              src=${this.image}
              alt=${C("receipt.preview")}
            />` : y}
      <p class="detail">${C("receipt.photo_hint")}</p>`;
	}
	reviewStep(e) {
		return _`<label>
        <span class="lbl">${C("receipt.store")}</span>
        <input
          data-testid="receipt-store"
          maxlength="100"
          .value=${this.store}
          @input=${(e) => this.store = e.target.value}
        />
        <span class="detail">${C("receipt.store_hint")}</span>
      </label>
      <ul class="rows">
        ${e.map((e, t) => Ai({
			r: e,
			i: t,
			md: this.md,
			hass: this.hass,
			set: (e) => this.set(t, e)
		}))}
      </ul>`;
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.status ? _`<div class="busy" role="status" data-testid="receipt-busy">
          <progress aria-label=${this.status}></progress><span>${this.status}</span>
        </div>` : y, t = this.rows?.filter((e) => e.choice !== "skip").length ?? 0;
		return _`${D({
			title: C("receipt.title"),
			body: _`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${e}`,
			error: this.error,
			invalid: this.invalid(),
			submit: this.rows ? {
				label: C("receipt.book", { count: String(t) }),
				testid: "receipt-book"
			} : {
				label: C("receipt.read"),
				testid: "receipt-read"
			},
			dirty: () => !!(this.image || this.rows),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [
			w,
			ji,
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
customElements.define("home-inventory-receipt-import", Qi);
//#endregion
//#region src/booking-receipt.ts
var $i = (e, t, n, r) => _`${n && z("receipt_import") ? _`<button
            type="button"
            class="receipt"
            data-testid="receipt-import"
            @click=${(e) => e.target.closest("button").parentNode.querySelector("home-inventory-receipt-import").open()}
          >
            ${E(vt)} ${C("receipt.open")}
          </button>` : y}
    <home-inventory-receipt-import
      .hass=${e}
      .md=${t}
      @booked=${r}
    ></home-inventory-receipt-import>`, ea = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function ta() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: ea.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-uT9tp3Ca.js"), import("./zxing_reader-B_eQ7OPO.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...ea] });
}
var na = class extends S {
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
			this.error = C("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = C("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await ta();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = C("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = C("scan.no_camera");
			return;
		}
		let i = async () => {
			let t;
			try {
				[t] = await n.detect(r);
			} catch {
				this.stop(), this.error = C("scan.detector");
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
		return _`<dialog data-testid="scanner" @close=${this.stop} @click=${zt()}>
      <h2>${C("scan.title")}</h2>
      ${this.error ? _`<p class="error" role="alert">${this.error}</p>` : _`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${C("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [w, s`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("home-inventory-scanner", na);
//#endregion
//#region src/booking-scan.ts
var ra = class extends S {
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
		return _`
      <form class="scan" @submit=${this.submit}>
        <slot name="before"></slot>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${C("book.input")}
          placeholder=${C("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${C("book.camera")}
          @click=${() => this.renderRoot.querySelector("home-inventory-scanner")?.open()}
        >
          ${E(Ye)}<span>${C("book.camera")}</span>
        </button>
      </form>
      <home-inventory-scanner @scan=${this.scanned}></home-inventory-scanner>
    `;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-booking-scan", ra);
//#endregion
//#region src/booking-in-fields.ts
function ia(e, t, n, r, i) {
	let a = !n.expires && e.expires_on && e.expires_on < A();
	return _`<label>
    <span class="lbl"
      >${r ? C("book.expires_on_type", { type: C(`settings.expiry.${r}`) }) : C("book.expires_on")}</span
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
    ${n.expires || a ? _`${k(n.expires, "expires")}${a ? k(C("valid.past"), "expires", !0) : ""}` : _`<span class="detail" data-testid="shelf-hint"
            >${i ? C(e.expires_on ? "book.shelf_hint" : "book.guess_hint", {
		days: String(i.value),
		source: i.source
	}) : C("book.no_date_hint")}</span
          >`}
  </label>`;
}
function aa(e, t, n, r, i, a) {
	return _`<label>
      <span class="lbl">${C("book.location")}</span>
      ${K({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${k(i.location, "location")}
    </label>
    ${t.id ? y : _`<label class="check" title=${C("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${C("book.make_default")}
          </label>`}`;
}
function oa(e, t, n) {
	return _`<label class="check" title=${C("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${C("label.print")}
  </label>`;
}
//#endregion
//#region src/booking-pick.ts
var sa = "auto", ca = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), la = (e, t) => ca(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function ua(e, t, n, r) {
	let i = (e, t) => _`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return _`<fieldset>
    <legend class="lbl">${C("book.which")}</legend>
    ${i(sa, C("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, _`<span
          >${t.expires_on ? B(e, t.expires_on) : C("book.no_date")}${t.opened_on ? ` · ${C("stock.opened")}` : ""}
          · ${t.location} <span class="detail">${C("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var da = s`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, fa = [
	"name",
	"category_id",
	"content_amount",
	"content_unit_id"
], pa = async (e, t, n) => {
	try {
		let r = await Sn(e, {
			...Object.fromEntries(fa.map((e) => [e, t[e]])),
			brand: t.brand,
			ean: t.ean,
			off_json: t.off_json
		});
		if (r.status !== "changes") return { state: { kind: r.status === "ok" ? "ok" : "none" } };
		let i = n(), a = fa.filter((e) => e in r && i[e] === t[e]);
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
			message: await P(e, t)
		} };
	}
}, ma = async (e, t, n) => {
	let { id: r } = await en(e, t.new_type.name, t.new_type.parent_id);
	return F(e).then((e) => n.dispatchEvent(new CustomEvent("master", { detail: e })), () => void 0), {
		...t,
		category_id: r,
		new_type: void 0
	};
}, ha = (e, t, n) => {
	let r = [];
	if ("name" in n && r.push(n.name || "–"), "category_id" in n && r.push(t?.categories.find((e) => e.id === n.category_id)?.name ?? "–"), "content_amount" in n || "content_unit_id" in n) {
		let i = t?.units.find((e) => e.id === n.content_unit_id)?.symbol ?? "";
		r.push(n.content_amount == null ? "–" : U(e, n.content_amount, i));
	}
	return r.join(", ");
}, ga = (e, t, n, r) => {
	switch (e.kind) {
		case "running": return _`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${C("book.ai.running")}></progress>
        <span>${C("book.ai.running")}</span>
      </div>`;
		case "ok": return _`<p class="ai" role="status" data-testid="product-ai-status">
        ${C("book.ai.ok")}
      </p>`;
		case "failed": return _`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${e.message}
      </p>`;
		case "changed": return _`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${C("book.ai.changed", {
			reason: e.reason,
			before: ha(t, n, e.before)
		})}</span
        >
        ${e.newType ? _`<span data-testid="product-ai-new-type"
                >${C("book.ai.new_type", {
			name: e.newType.name,
			parent: n?.categories.find((t) => t.id === e.newType.parent_id)?.name ?? "–"
		})}</span
              >` : y}
        <button type="button" data-testid="product-ai-undo" @click=${() => r(e.before)}>
          ${C("book.ai.undo")}
        </button>
      </div>`;
		default: return y;
	}
}, _a = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: sa,
	print: null
}), va = (e) => e?.category_id ?? e?.new_type?.parent_id ?? null, ya = null, ba = class extends S {
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
		}), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = _a(), this.ai = { kind: "none" };
	}
	willUpdate(e) {
		if (e.has("product")) {
			this.draft = this.product, this.f = {
				..._a(),
				location_id: this.at ?? null,
				expires_on: this.prefill() ? this.proposal() : ""
			}, this.initial = JSON.stringify(this.f), this.ai = { kind: "none" };
			let e = this.product;
			this.hass && this.mode === "in" && e && !e.id && e.off_json && z("ai_product_check") && this.check(e), this.hass && this.mode === "in" && un(this.hass).then((e) => {
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
		let t = await pa(this.hass, e, () => this.draft);
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
			source: C("book.from_product")
		};
		let n = G(this.md, va(this.draft), e);
		if (n) return n;
		if (e === "default_location_id" && ya != null) return {
			value: ya,
			source: C("book.last_used")
		};
	}
	prefill() {
		return !!this.labels?.prefill_expiry || this.dflt("expiry_type")?.value === "guide";
	}
	proposal() {
		let e = this.mode === "in" ? this.dflt("shelf_days") : void 0;
		return e ? Ci(A(), Number(e.value)) : "";
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (!t.id && t.new_type && t.category_id == null) {
			let e = await this.run(() => ma(n, t, this));
			if (!e) return;
			t = this.draft = e;
		}
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : di(t);
			o && this.f.makeDefault && e !== G(this.md, va(t), "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => rn(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (ya = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => cr(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = ca(this.stock, this.f.pick), i = await this.run(() => an(n, {
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
		let s = C(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${C("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o,
			image: t.image_url
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return y;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? _`<h2>${C("book.title_out", { name: e.name })}</h2>
            <p class="empty" data-testid="no-stock">${C("book.no_stock")}</p>
            <div class="actions">${this.cancelButton()}</div>` : y;
		let n = this.mode === "out" ? la(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return _`<form class="book" @submit=${this.submit}>
      ${t ? _`<h2>
              ${C("book.title_out", { name: e.name })}${e.brand ? _` <span class="detail">${e.brand}</span>` : y}
            </h2>` : _`<h2>${C("book.title_in")}</h2>
              ${ga(this.ai, this.hass, this.md, (e) => (this.ai = { kind: "none" }, this.setFields(e)))}
              <p class="summary" data-testid="summary">
                ${mi(this.md, e, W(this.md?.categories, e.category_id), this.hass) || C("book.new_product")}
                ${e.id ? y : _`<span class="detail">${C("book.is_new")}</span>`}
              </p>`}
      ${t ? ua(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : _`${e.id ? y : pi(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${ia(this.f, this.set, r, this.dflt("expiry_type")?.value, !this.f.expires_on || this.f.expires_on === this.proposal() ? this.dflt("shelf_days") : void 0)}`}
      <label>
        <span class="lbl">${C("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? y}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${k(r.packages, "packages")}
      </label>
      ${t ? y : _`${aa(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${oa(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        ${this.cancelButton()}
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${C(`book.submit_${this.mode}`)}
        </button>
      </div>
    </form>`;
	}
	cancelButton() {
		return _`<button
      type="button"
      data-testid="cancel"
      @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
    >
      ${C("common.cancel")}
    </button>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? fi(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (j(i, r) && (t.expires = C("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = C("valid.location")));
		let a = this.mode === "out" ? la(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = C("valid.packages") : a != null && n > a && (t.packages = C("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			w,
			da,
			Nt,
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
customElements.define("home-inventory-booking-form", ba);
//#endregion
//#region src/booking-hits.ts
function xa(e, t) {
	return _`
    ${e.length ? y : _`<p class="empty">${C("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => _`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    <div class="actions after">
      <button type="button" data-testid="cancel" @click=${t.cancel}>${C("common.cancel")}</button>
      ${t.more ? _`${t.online || !z("off_lookup") ? y : _`<button
                      data-testid="search-online"
                      ?disabled=${t.busy}
                      @click=${t.searchOnline}
                    >
                      ${C("book.search_online")}
                    </button>`}
              <button data-testid="new-product" @click=${t.create}>
                ${C("book.new_product")}
              </button>` : y}
    </div>
  `;
}
//#endregion
//#region src/booking-modes.ts
var Sa = [
	["search", ct],
	["in", ht],
	["out", dt],
	["open", pt],
	["freeze", bt]
], Ca = {
	open: "opened",
	freeze: "frozen"
}, wa = (e, t) => _`<div slot="before" class="modes" role="group" aria-label=${C("stock.mode")}>
    ${Sa.filter(([e]) => !Ca[e] || R(Ca[e])).map(([n, r]) => _`<button
          type="button"
          data-testid=${`mode-${n}`}
          aria-pressed=${n === e}
          aria-label=${C(`stock.mode_${n}`)}
          title=${C(`stock.mode_${n}`)}
          @click=${() => t(n)}
        >
          ${E(r)}
        </button>`)}
  </div>`, Ta = s`
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
`, Ea = (e, t) => {
	t !== void 0 && (e.message = t), e.dispatchEvent(new CustomEvent("booked")), e.focusInput();
};
async function Da(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(() => hn(e.hass, t));
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.undo = r.taken, Ea(e, C("book.done_label", {
			name: r.name,
			where: r.location
		}));
	}
}
async function Oa(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.opened = r, Ea(e);
	}
}
async function ka(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.frozen = {
			result: r,
			thaw: r.thaw
		}, Ea(e);
	}
}
async function Aa(e) {
	let { undo: t, opened: n, frozen: r } = e;
	if (e.undo = e.opened = e.frozen = void 0, await e.run(() => r ? Mr(e.hass, r.result.booking_id) : n ? Ar(e.hass, n.booking_id) : on(e.hass, t)) === void 0) return void (e.undo = t, e.opened = n, e.frozen = r);
	Ea(e, C(r ? "book.undone_frozen" : n ? "book.undone_open" : "book.undone"));
}
var ja = (e) => e.frozen ? ti(e.hass, e.frozen, () => Aa(e), () => Jr(e, e.frozen.result)) : e.opened ? Yr(e.hass, e.opened, () => Aa(e), () => Jr(e, e.opened), "open") : J(e.message, e.undo && (() => Aa(e)), void 0, void 0, e.image), Ma = /^PTRY:/i, Na = /^\d{8,14}$/;
async function Pa(e, t, n) {
	if (dr(n)) {
		let r = await e.run(() => fr(t, n));
		return r === void 0 || (e.query = "", r ? e.at = r : e.error = C("location_label.unknown")), !0;
	}
	if (e.mode === "freeze" && (Ma.test(n) || Na.test(n))) return await ka(e, () => Nr(t, n, e.at?.id)), !0;
	if (!Ma.test(n)) return !1;
	let r = n.replace(Ma, "");
	return await (e.mode === "open" ? Oa(e, () => kr(t, r)) : Da(e, r)), !0;
}
//#endregion
//#region src/booking-view.ts
var Fa = /^\d{8,14}$/, Ia = class extends S {
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
			image: { state: !0 },
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
			this.reset(), this.message = C("receipt.done", { count: String(e.detail) }), this.undo = this.image = void 0, this.dispatchEvent(new CustomEvent("booked"));
		}, this.mode = "search", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "", this.image = void 0;
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = this.opened = this.frozen = this.image = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, F(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
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
		this.error = this.hass ? await P(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass || this.mode === "search") return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = this.opened = this.frozen = this.image = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, await Pa(this, t, e)) return;
		if (Fa.test(e)) {
			let r = await this.run(() => tn(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "in" ? this.choose(ui({ ean: e })) : void (this.error = C("book.unknown"));
		}
		let r = await this.run(() => nn(t, e));
		r && n === this.seq && (this.hits = r, this.mode !== "in" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => nn(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => tn(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode !== "in" && !e.id) return void (this.error = C("book.unknown"));
		if (this.mode === "freeze") return ka(this, () => Nr(this.hass, e.ean ?? e.name, this.at?.id));
		if (this.mode === "open") return Oa(this, () => Or(this.hass, {
			product_id: e.id,
			location_id: this.at?.id
		}));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => I(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = this.at ? n?.filter((e) => e.location_id === this.at.id) : n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("home-inventory-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		let e = !!(this.hits || this.product), t = this.error ? _`<p class="error" role="alert" data-testid="error">${this.error}</p>` : y;
		return _`
      <home-inventory-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      >
        ${wa(this.mode, (e) => this.setMode(e))}
      </home-inventory-booking-scan>
      ${pr(this.at?.name, () => this.at = void 0)} ${ja(this)}
      ${e ? y : t}
      ${$i(this.hass, this.md, this.mode === "in", this.receiptBooked)}
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${zt(this.dirty)}
        @keydown=${Bt(this.dirty)}
        @cancel=${Bt(this.dirty)}
      >
        ${this.hits ? _`<h2>${C(`book.pick_${this.mode}`)}</h2>
                ${xa(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(ui({ name: this.query.trim() })),
			cancel: () => this.closed()
		})}` : y}
        ${this.renderForm()} ${e ? t : y}
      </dialog>
    `;
	}
	renderForm() {
		return this.product ? _`<home-inventory-booking-form
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
    ></home-inventory-booking-form>` : y;
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.image = e.detail.image, this.dispatchEvent(new CustomEvent("booked")), this.focusInput();
	}
	static {
		this.styles = [
			w,
			Y,
			Ta,
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
customElements.define("home-inventory-booking", Ia);
//#endregion
//#region src/stock-view.ts
var La = class extends S {
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
			let [e, t] = await Promise.all([I(this.hass), cn(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.date = (e) => ri(this.hass, e, this.products.get(e.product_id), this.md), this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await P(this.hass, e);
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
			this.md = await F(this.hass), await this.reload();
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	tree(e) {
		let t = br(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return Cr(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? ai(e.id, e.name, e.packages, e.depth, e.open, (e) => this.toggle(e)) : this.renderItem(e.item, e.depth, e.open));
	}
	status(e) {
		return Sr(e, this.products.get(e.product_id), this.md);
	}
	toggle(e) {
		this.open = Ut(this.open, e);
	}
	render() {
		let e = this.error ? _`<p class="error" role="alert">${this.error}</p>` : y;
		return _`${_`<home-inventory-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e) => this.filter = e.detail}
      @booked=${this.saved}
      @home-inventory-print-label=${(e) => this.label(e.detail)}
    ></home-inventory-booking>`} ${e} ${this.stock ? this.list(this.stock) : y}`;
	}
	list(e) {
		let t = this.tree(this.filter.trim() !== "");
		return _`
      ${oi(this)} ${qr(this, "stock")}
      ${Yr(this.hass, this.opened, () => Zr(this), () => this.label({
			id: this.opened.batch_id,
			name: this.opened.name,
			packages: 1
		}), "opened")}
      ${ti(this.hass, this.frozen, () => ni(this), () => this.label({
			id: this.frozen.result.batch_id,
			name: this.frozen.result.name,
			packages: 1
		}))}
      ${J(this.message, void 0, "label")}
      ${t.length ? _`<ul>
              ${t}
            </ul>` : _`<p class="empty">
              ${C(e.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
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
			this.frozen = e.detail, this.stock = await I(this.hass);
		}}
      ></home-inventory-frozen-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => this.message = e.detail ? C("label.printed", { n: e.detail }) : ""}
      ></home-inventory-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("home-inventory-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await vr(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await P(this.hass, e);
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
		return _`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? Ht(n, i) : _`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : y}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, C("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? _` · <span class=${this.status(r)}>${this.date(r)}</span>` : y}
          </span>
        </button>
        ${Er(this.products.get(e.id)?.image_url)}
        ${O({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: N(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? _`<ul class="batches">
              ${e.batches.map((t) => ii(a, e.name, t))}
            </ul>` : y}
    </li>`;
	}
	static {
		this.styles = [
			w,
			Y,
			si,
			ci
		];
	}
};
customElements.define("home-inventory-stock", La);
//#endregion
//#region src/expiry-recipes.ts
var Ra = class extends S {
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
			let t = await _n(this.hass, this.days);
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
		return this.list.length ? _`<h2>${C("expiry.recipes")}</h2>
      <ul>
        ${this.list.map((e) => _`<li>
              <button
                type="button"
                class="row"
                data-testid="expiry-recipe"
                @click=${() => this.open(e.recipe_id)}
              >
                <span>${e.name}</span>
                <span class="detail"
                  >${C("expiry.recipe_detail", {
			...e,
			products: e.products.join(", ")
		})}</span
                >
              </button>
            </li>`)}
      </ul>` : y;
	}
	static {
		this.styles = [w, s`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `];
	}
};
customElements.define("home-inventory-expiry-recipes", Ra);
//#endregion
//#region src/expiry-view.ts
var za = class extends S {
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
				F(this.hass),
				I(this.hass),
				cn(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? C("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(jn(this.hass), { numeric: "auto" }).format(xr(e), "day");
	}
	render() {
		let e = this.error ? _`<p class="error" role="alert">${this.error}</p>` : y;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: Sr(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return _`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${C("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${C("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${C("common.days_unit")}
        </span>
        ${k(t, "expiry-days")}
      </div>
      ${qr(this, "expiry")}
      ${r.length ? _`<ul>
              ${r.map(({ r: e, status: t }) => _`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}
                        >${e.expiry_type === "guide" ? C("stock.approx_date", { date: B(this.hass, e.expires_on) }) : B(this.hass, e.expires_on)}</span
                      >
                      <span class="detail"
                        >${this.relative(e.expires_on)}${e.expiry_guessed && e.expiry_type !== "guide" ? ` · ${C("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[
			e.brand,
			e.opened_on && C("stock.opened"),
			e.location
		].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${C("book.count", { n: e.packages })}</span>
                    ${Gr(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : _`<p class="empty">${C("expiry.empty")}</p>`}
      ${R("recipes") ? _`<home-inventory-expiry-recipes
              .hass=${this.hass}
              .days=${n}
              .stock=${this.stock}
            ></home-inventory-expiry-recipes>` : y}
    `;
	}
	static {
		this.styles = [
			w,
			Y,
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
customElements.define("home-inventory-expiry", za);
//#endregion
//#region src/emergency-view.ts
var Ba = class extends S {
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
			this.data = await An(this.hass);
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		if (this.error) return _`<p class="error">${this.error}</p>`;
		if (!e) return y;
		let t = (e) => V(this.hass, e);
		return _`
      <p class="supply" data-testid="emergency-supply">
        ${C("emergency.supply", { days: t(e.supply_days) })}
      </p>
      <p class="detail">${C("emergency.target", {
			persons: t(e.persons),
			days: t(e.days)
		})}</p>
      <table>
        <thead>
          <tr>
            <th>${C("emergency.group")}</th>
            <th>${C("emergency.need")}</th>
            <th>${C("emergency.have")}</th>
            <th>${C("emergency.lasts")}</th>
          </tr>
        </thead>
        <tbody>
          ${e.groups.map((e) => _`<tr data-testid=${`emergency-row-${e.key}`}>
                <td>
                  ${C(`emergency.group.${e.key}`)}
                  ${e.unknown ? _`<div class="detail">
                          ${C("emergency.unknown", { n: t(e.unknown) })}
                        </div>` : y}
                </td>
                <td>${t(e.need)} ${e.unit}</td>
                <td>${t(e.have)} ${e.unit}</td>
                <td>${C("emergency.days", { days: t(e.days) })}</td>
              </tr>`)}
        </tbody>
      </table>
      <p class="detail">${C("emergency.hint")}</p>
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
customElements.define("home-inventory-emergency", Ba);
//#endregion
//#region node_modules/lit-html/directive.js
var Va = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ha = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ua = class {
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
}, { I: Wa } = He, Ga = (e) => e.strings === void 0, Ka = {}, qa = (e, t = Ka) => e._$AH = t, Ja = Ha(class extends Ua {
	constructor(e) {
		if (super(e), e.type !== Va.PROPERTY && e.type !== Va.ATTRIBUTE && e.type !== Va.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!Ga(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === v || t === y) return t;
		let n = e.element, r = e.name;
		if (e.type === Va.PROPERTY) {
			if (t === n[r]) return v;
		} else if (e.type === Va.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return v;
		} else if (e.type === Va.ATTRIBUTE && n.getAttribute(r) === t + "") return v;
		return qa(e), t;
	}
}), Ya = (e) => e.callWS({ type: "home_inventory/shopping" }), Xa = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), Za = (e, t) => e.callWS({
	type: "home_inventory/shopping_add",
	...t
}), Qa = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_item",
	item_id: t,
	...n
}), $a = (e, t) => e.callWS({
	type: "home_inventory/shopping_item_delete",
	item_id: t
}), eo = (e) => e.callWS({ type: "home_inventory/shopping_recipes" }), to = (e, t, n, r) => e.callWS({
	type: "home_inventory/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), no = (e, t) => e.callWS({
	type: "home_inventory/shopping_recipe_remove",
	recipe_id: t
}), ro = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_recipe_done",
	key: t,
	done: n
});
//#endregion
//#region src/shopping-text.ts
function io(e, t) {
	let n = (t) => U(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : C("shopping.any"), C("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : C("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(C("book.count", { n: t.packages }));
	let i = C(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(C("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function ao(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : U(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: C(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? C("shopping.unknown", { n: r }) : ""
	};
}
//#endregion
//#region src/shopping-row-styles.ts
var oo = s`
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
`, so = 8, co = class extends S {
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
			[this.md, this.products] = await Promise.all([F(this.hass), cn(this.hass)]);
		} catch (e) {
			this.error = await P(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return W(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = C("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, fi(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = C("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = C("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await Qa(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await Za(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await Za(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await Za(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await Za(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return _`<li>
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
		if (!e) return y;
		let t = (t) => !!t && H(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, so), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, so), i = ui({ name: e });
		return _`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, C("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", C("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${N(this.hass) ? this.hit("shopping-new-category", C("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : y}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return _`<label>
          <span class="lbl">${C("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? k(e.what, "shopping-what") : y}
        </label>
        ${this.hits()}`;
		let n = _`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${C("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? _`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : C("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? _`<p class="detail">${C("shopping.add.creates_product")} ${n}</p>
        ${pi(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : _`<p class="detail">${C("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${C("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${k(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${C("settings.category.parent")}</span>
        <home-inventory-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${C("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></home-inventory-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors();
		return D({
			title: this.item ? C("common.edit_name", { name: this.item.name }) : C("shopping.add.title"),
			body: _`${this.item ? y : this.what(e)}
        <label>
          <span class="lbl">${C("shopping.add.packages")}</span>
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
				this.packages = M(t);
			}}
            />
            <span class="detail">${C("book.packages")}</span>
          </span>
          ${k(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-shopping-add", co);
//#endregion
//#region src/shopping-recipe-dialog.ts
var lo = class extends S {
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
		let n = (await eo(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await to(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: C("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await to(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await P(this.hass, e);
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
		if (!this.active || !this.recipe) return _`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return D({
			title: C("shopping.recipe.title", { name: this.recipe.name }),
			body: _`<label>
          <span class="lbl">${C("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!e.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e) => this.servings = M(e.target.value)}
          />
          ${k(e.servings, "shopping-recipe-servings")}
        </label>
        ${t.length ? _`<fieldset>
                <legend class="lbl">${C("shopping.recipe.optional")}</legend>
                ${t.map((e) => _`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(e.id)}
                        @change=${(t) => this.toggle(e, t.target.checked)}
                      />
                      ${e.text}
                    </label>`)}
              </fieldset>` : y}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: C("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-shopping-recipe-dialog", lo);
//#endregion
//#region src/shopping-recipes.ts
var uo = class extends S {
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
			[this.list, this.recipes] = await Promise.all([eo(this.hass), gn(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await It(e.name)) {
			try {
				await no(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await P(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return _`${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipe-dialog>
      ${this.list.length ? _`<h3>${C("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => _`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${C("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${Pn(this.hass, e.servings)}</span>
                      ${O({
			testid: "shopping-recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: () => this.removeEntry(e)
		})}
                    </li>`)}
              </ul>` : y}`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-shopping-recipes", uo);
//#endregion
//#region src/shopping-view.ts
var fo = class extends S {
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
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), un(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await fn(this.hass);
				this.note = C("shopping.printed", { n: e });
			} catch (e) {
				this.error = await P(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([Ya(this.hass), F(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await Qa(this.hass, e.id, { done: t }) : e.key ? await ro(this.hass, e.key, t) : await Xa(this.hass, e, t);
		} catch (e) {
			return this.error = await P(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await It(e.name)) {
			this.error = "";
			try {
				await $a(this.hass, e.id);
			} catch (e) {
				return this.error = await P(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("home-inventory-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = io(this.hass, e), i = ao(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return _`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${Ja(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="line" title=${a}
            ><span class="name">${e.name}</span
            >${r ? _`<span class="amt"> – ${r}</span>` : y}</span
          >
          ${i.uses.length || i.unknown ? _`<span class="refs" data-testid="shopping-refs"
                  >${i.uses.map((e, t) => _`<span title=${e.title} aria-label=${e.title}
                        >${e.text}${t < i.uses.length - 1 ? ";" : ""}</span
                      >`)}${i.unknown ? _`<span class="unknown" title=${i.unknown}>${i.unknown}</span>` : y}</span
                >` : y}
        </span>
      </label>
      ${e.manual ? O({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : y}
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
				i.push(t ? this.row(t, o, !0) : _`<li
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
		let e = this.error ? _`<p class="error" role="alert">${this.error}</p>` : y;
		return !this.items || !this.cats ? e : _`${_`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${C("shopping.add.title")}
        </button>
        ${this.receipt ? _`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${C("shopping.print")}
              </button>` : y}
      </div>
      ${this.note ? _`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : y}
      <home-inventory-shopping-recipes
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipes>
      <home-inventory-shopping-add
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-add>`}
    ${this.items.length ? _`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : _`<p class="empty">${C("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			w,
			oo,
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
customElements.define("home-inventory-shopping", fo);
//#endregion
//#region src/form-fields.ts
var po = (e) => _`<label>
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
        @input=${(t) => e.onChange(M(t.target.value))}
      />
      ${e.unit}
    </span>
    ${k(e.err, e.testid)}
  </label>`, mo = (e) => _`<label>
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
    ${k(e.err, e.testid)}
  </label>`, Q = (e, t, n) => C(e === "drying" ? `drying.${t}` : e === "leftover" ? `leftovers.${t}` : `canning.${t}`, n), ho = () => [
	"canning",
	"drying",
	"leftover"
].filter((e) => R(e === "leftover" ? "leftovers" : e)), go = (e, t, n) => t === "drying" ? `${V(e, n / 60)} ${C("drying.hours_unit")}` : `${n} ${C("recipes.minutes_unit")}`, _o = (e) => e.kind === "drying" ? po({
	testid: e.testid,
	label: C("recipes.field.canning_minutes"),
	unit: C("drying.hours_unit"),
	step: "0.5",
	value: e.minutes == null ? null : e.minutes / 60,
	err: e.err && C("valid.drying_hours"),
	onChange: (t) => e.onChange(t == null ? null : Math.round(t * 60))
}) : po({
	testid: e.testid,
	label: C("recipes.field.canning_minutes"),
	unit: C("recipes.minutes_unit"),
	value: e.minutes,
	err: e.err,
	onChange: e.onChange
}), vo = s`
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
`, yo = 2e3, bo = (e) => e.flatMap((e) => [...e.section ? [{
	kind: "head",
	text: e.section
}] : [], {
	kind: "step",
	text: e.text
}]), xo = (e) => (e ?? "").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean).map((e) => ({
	kind: "step",
	text: e
})), So = (e) => {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		e && (r.kind === "head" ? n = e : (t.push({
			section: n,
			text: e
		}), n = null));
	}
	return t;
}, Co = (e, t = (e) => e.text) => {
	let n = [];
	return e.forEach((e, t) => {
		(e.section || !n.length) && n.push({
			section: e.section,
			first: t,
			steps: []
		}), n[n.length - 1].steps.push(e);
	}), _`${n.map((e) => _`${e.section ? _`<h4 class="section">${e.section}</h4>` : y}
        <ol class="steps" start=${e.first + 1}>
          ${e.steps.map((n, r) => _`<li data-testid="recipe-step">${t(n, e.first + r)}</li>`)}
        </ol>`)}`;
}, wo = () => ({
	diet: "",
	without: []
}), To = (e) => +!!e.diet + e.without.length, Eo = (e, t) => {
	let n = e.diet;
	return t.diet && !(n.diet === "vegan" || t.diet === "vegetarian" && n.diet === "vegetarian") ? !1 : t.without.every((e) => n.allergens_known && !n.contains.includes(e));
}, Do = (e, t) => t != null && (e == null || Kt.indexOf(e) > Kt.indexOf(t)), Oo = (e, t) => {
	let n = e.optional.find((e) => e.text === t);
	return n ? [Do(n.diet, e.diet) ? n.diet == null ? C("diet.missing") : C(n.diet === "none" ? "diet.not_vegetarian" : "diet.not_vegan") : "", n.contains.length ? C("allergens.contains", { list: zn(n.contains.join(",")) }) : ""].filter(Boolean).join(", ") : "";
}, ko = (e) => {
	let t = e.diet, n = [
		t.diet ? C(`diet.${t.diet}`) : "",
		t.contains.length ? C("allergens.contains", { list: zn(t.contains.join(",")) }) : t.allergens_known ? C("allergens.none") : "",
		t.optional.length ? C("recipes.diet.optional", { list: t.optional.map((e) => `${e.text} (${Oo(t, e.text)})`).join(", ") }) : ""
	].filter(Boolean);
	return _`<span class="detail" data-testid="recipe-diet"
      >${n.length ? n.join(" · ") : C("diet.unknown")}</span
    >${t.unknown.length ? _`<span class="detail" data-testid="recipe-diet-unknown"
            >${C("recipes.diet.unknown", { list: t.unknown.join(", ") })}</span
          >` : y}`;
}, Ao = (e, t) => _`<details class="diet-filter" data-testid="recipe-diet-filter">
    <summary>
      ${C("recipes.diet.filter")}${To(e) ? ` (${To(e)})` : ""}
    </summary>
    <label>
      <span class="lbl">${C("diet.label")}</span>
      <select
        data-testid="recipe-diet-select"
        @change=${(n) => t({
	...e,
	diet: n.target.value
})}
      >
        <option value="" .selected=${e.diet === ""}>${C("recipes.diet.all")}</option>
        ${["vegan", "vegetarian"].map((t) => _`<option value=${t} .selected=${e.diet === t}>${C(`diet.${t}`)}</option>`)}
      </select>
    </label>
    <div class="field">
      <span class="lbl">${C("recipes.diet.without")}</span>
      <span class="allergen-grid">
        ${Rn.map((n) => _`<label class="check"
              ><input
                type="checkbox"
                data-testid=${`recipe-without-${n}`}
                .checked=${e.without.includes(n)}
                @change=${(r) => t({
	...e,
	without: r.target.checked ? [...e.without, n] : e.without.filter((e) => e !== n)
})}
              />${C(`allergen.${n}`)}</label
            >`)}
      </span>
    </div>
  </details>`, jo, Mo = class extends S {
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
		super.connectedCallback(), jo ??= un(this.hass).then((e) => e.receipt, () => !1), jo.then((e) => this.available = e);
	}
	async run() {
		this.busy = !0;
		try {
			await this.print(), this.note = this.done;
		} catch (e) {
			this.note = await P(this.hass, e);
		} finally {
			this.busy = !1;
		}
	}
	createRenderRoot() {
		return this;
	}
	render() {
		return this.available ? _`<button
        type="button"
        data-testid=${this.testid}
        ?disabled=${this.busy}
        @click=${() => this.run()}
      >
        ${E(_t)} ${C("common.print")}
      </button>
      ${this.note ? _`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >` : y}` : y;
	}
};
customElements.define("home-inventory-receipt-button", Mo);
//#endregion
//#region src/recipe-output.ts
var No = (e, t) => {
	let n = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), r = Object.assign(document.createElement("a"), {
		href: n,
		download: t
	});
	document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}, Po = (e) => `${e.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "recipe"}.json`, Fo = async (e, t, n) => {
	try {
		No(await wn(e, n?.id), n ? Po(n.name) : C("recipes.export_all_file"));
	} catch (n) {
		t(await P(e, n));
	}
}, Io = "\n@media screen { #hi-print { display: none; } }\n@media print {\n  body > * { display: none !important; }\n  body > #hi-print { display: block !important; color: #000; background: #fff; font: 12pt/1.4 sans-serif; }\n  #hi-print h1 { font-size: 20pt; margin: 0 0 4pt; }\n  #hi-print h2 { font-size: 14pt; margin: 14pt 0 4pt; }\n  #hi-print h3 { font-size: 12pt; margin: 8pt 0 2pt; }\n  #hi-print li { break-inside: avoid; margin-bottom: 3pt; }\n}", Lo = (e, t, n) => {
	let r = (e, t, n) => {
		let r = document.createElement(e);
		return t && (r.textContent = t), n?.appendChild(r), r;
	};
	document.getElementById("hi-print")?.remove();
	let i = r("div");
	i.id = "hi-print", r("style", Io, i), r("h1", e.name, i), r("p", `${C("recipes.servings")}: ${t}`, i), r("h2", C("recipes.ingredients"), i);
	let a = r("ul", void 0, i);
	if (n.forEach((e) => r("li", e, a)), e.steps.length) {
		r("h2", C("recipes.instructions"), i);
		let t = r("ol", void 0, i), n = 0;
		e.steps.forEach((e) => {
			e.section && (r("h3", e.section, i), t = r("ol", void 0, i), t.setAttribute("start", String(n + 1))), r("li", e.text, t), n++;
		});
	} else e.instructions && (r("h2", C("recipes.instructions"), i), e.instructions.split("\n").filter((e) => e.trim()).forEach((e) => r("p", e, i)));
	e.source_url && r("p", `${C("recipes.source")}: ${e.source_url}`, i), document.body.appendChild(i), window.addEventListener("afterprint", () => i.remove(), { once: !0 });
	try {
		window.print();
	} finally {
		i.remove();
	}
}, Ro = (e, t) => _`<button data-testid="recipe-export-all" @click=${() => Fo(e, t)}>
    ${C("recipes.export_all")}
  </button>`, zo = (e) => _`<button
      type="button"
      data-testid="recipe-export"
      @click=${() => Fo(e.hass, e.onError, e.recipe)}
    >
      ${E(at)} ${C("recipes.export")}
    </button>
    <button
      type="button"
      data-testid="recipe-print-browser"
      @click=${() => Lo(e.recipe, e.servings, e.ingredients)}
    >
      ${E(gt)} ${C("recipes.print_pdf")}
    </button>`, Bo = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = U(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${C("recipes.approx", { what: U(e, i * a.factor / s.factor, s.symbol) })})`;
}, Vo = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? C("recipes.status.missing_plain") : C("recipes.status.missing", { what: U(e, t.missing ?? 0, n) });
		case "partial": return C("recipes.status.partial", {
			have: V(e, t.have ?? 0),
			need: V(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return C("recipes.status.unknown");
		case "skipped": return C("recipes.status.skipped");
		case "unmatched": return C("recipes.status.unmatched");
		default: return C("recipes.status.available");
	}
}, Ho = (e) => {
	let t = e.recipe, n = e.ingredients.map((n) => [
		Bo(e.hass, e.md, n, e.servings / t.servings),
		e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text,
		n.note ? `(${n.note})` : "",
		n.optional ? `(${C("recipes.optional")})` : ""
	].filter(Boolean).join(" "));
	return _`<div class="detail-box">
    <label class="servings">
      <span class="lbl"
        >${L(t) ? Q(t.canning_kind, "recipe_jars") : C("recipes.servings")}</span
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
      ${e.ingredients.map((n) => _`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[Bo(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? _`<span class="detail">${n.note}</span>` : y}
              ${n.optional ? _`<span class="detail">${C("recipes.optional")}</span>` : y}
              ${n.optional && R("diet") && Oo(t.diet, n.text) ? _`<span class="detail" data-testid="ingredient-diet"
                      >${Oo(t.diet, n.text)}</span
                    >` : y}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${Vo(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      ${R("shopping") ? _`<button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
              ${C("recipes.to_shopping")}
            </button>` : y}
      ${L(t) ? _`<button type="button" data-testid="recipe-to-canning" @click=${e.onPlan}>
              ${Q(t.canning_kind, "add_title")}
            </button>` : R("plan") ? _`<button type="button" data-testid="recipe-to-plan" @click=${e.onPlan}>
                ${C("recipes.to_plan")}
              </button>` : y}
      ${L(t) ? y : _`<button type="button" data-testid="recipe-cooked" @click=${e.onCooked}>
              ${C("cooked.open")}
            </button>`}
      ${zo({
		hass: e.hass,
		recipe: t,
		servings: e.servings,
		ingredients: n,
		onError: e.onError
	})}
      <home-inventory-receipt-button
        .hass=${e.hass}
        .print=${() => pn(e.hass, t.id, e.servings)}
        .done=${C("recipes.printed")}
        .testid=${"recipe-print"}
      ></home-inventory-receipt-button>
      ${t.shopping_servings != null && R("shopping") ? _`<span class="detail" data-testid="recipe-on-shopping"
              >${C("recipes.on_shopping", { what: Pn(e.hass, t.shopping_servings) })}</span
            >` : y}
    </p>
    ${L(t) ? _`<p data-testid="recipe-canning">
            ${C("canning.recipe_summary", {
		name: t.canning_product ?? "",
		jars: t.servings
	})}
            ${t.canning_temp == null ? "" : `· ${t.canning_temp} °C, ${go(e.hass, t.canning_kind, t.canning_minutes ?? 0)}`}
          </p>` : y}
    ${t.steps.length ? _`<h3>${C("recipes.instructions")}</h3>
            ${Co(t.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${e.onCook}>
                ${C("cook.open")}
              </button>
            </p>` : t.instructions ? _`<h3>${C("recipes.instructions")}</h3>
              <p class="text">${t.instructions}</p>` : y}
    ${t.source_url ? _`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${C("recipes.source")}</a
            >
          </p>` : y}
    ${t.image_url ? _`<img
            class="photo"
            src=${t.image_url}
            alt=${t.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />` : y}
  </div>`;
}, Uo = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), Wo = (e) => e.map((e) => {
	let t = {};
	return Uo(e) || (!e.text.trim() && e.category_id == null && (t.text = C("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = C("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? C("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : C("valid.amount_pair"))), t;
}), Go = (e, t, n, r) => ({
	name: e.trim() || "-",
	servings: t ?? 1,
	steps: So(n),
	ingredients: r.map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.unit_id,
		text: e.text.slice(0, 200),
		note: e.note ?? null,
		line: e.line ?? null,
		learned: !!e.learned
	}))
}), Ko = (e, t, n, r, i) => {
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
	let s = JSON.stringify(r.steps) === JSON.stringify(n), c = e.steps && s ? bo(e.steps) : r.steps, l = {
		kind: "changed",
		ingredients: o,
		prevSteps: c === r.steps ? void 0 : r.steps
	};
	return {
		ingredients: a,
		steps: c,
		state: o || l.prevSteps ? l : { kind: "ok" }
	};
}, qo = (e, t) => {
	switch (e.kind) {
		case "running": return _`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${C("recipes.ai.running")}></progress>
        <span>${C("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${t.onSkip}>
          ${C("recipes.ai.skip")}
        </button>
      </div>`;
		case "ok": return _`<p class="ai" role="status" data-testid="ai-status">${C("recipes.ai.ok")}</p>`;
		case "skipped": return _`<p class="ai" role="status" data-testid="ai-status">
        ${C("recipes.ai.skipped")}
      </p>`;
		case "failed": return _`<p class="ai error" role="alert" data-testid="ai-status">${e.message}</p>`;
		case "changed": return _`<div class="ai" role="status" data-testid="ai-status">
        ${e.ingredients ? _`<span
                >${e.ingredients === 1 ? C("recipes.ai.changed_one") : C("recipes.ai.changed_many", { n: e.ingredients })}</span
              >` : y}
        ${e.prevSteps ? _`<span>${C("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${t.onUndoSteps}>
                  ${C("recipes.ai.undo_steps")}
                </button>` : y}
      </div>`;
		default: return y;
	}
}, Jo = (e) => {
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
}, Yo = (e, t, n, r) => {
	let i = e.ai;
	if (!i) return y;
	let a = n.find((e) => e.id === i.beforeUnit)?.symbol ?? i.beforeHint, o = [i.cat ? i.beforeText : null, i.unit ? a : null].filter(Boolean);
	return _`<div class="orig" data-testid="ingredient-ai">
    ${e.new_type && i.cat ? C("recipes.ai.new_type", {
		name: e.new_type.name,
		parent: t.find((t) => t.id === e.new_type.parent_id)?.name ?? "–",
		reason: i.reason
	}) : C("recipes.ai.changed", {
		reason: i.reason,
		before: o.join(", ") || "–"
	})}
    <button type="button" data-testid="ingredient-ai-undo" @click=${() => r(Jo(e))}>
      ${C("recipes.ai.undo")}
    </button>
  </div>`;
}, Xo = 8, Zo = class extends S {
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
			let t = await nn(this.hass, e.trim());
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
			await en(this.hass, this.creating, e);
			let t = await F(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await P(this.hass, e);
		}
	}
	foods() {
		return this.categories.filter((e) => e.effective.food.value !== 0);
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.foods().filter((t) => H(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, Xo);
	}
	hit(e) {
		let t = W(this.categories, e.cat.parent_id), n = [e.via ? C("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
		return _`<li>
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
		if (!e) return y;
		let t = this.categories.some((t) => t.name.toLocaleLowerCase() === e.toLocaleLowerCase());
		return _`<ul>
      ${this.hits(e).map((e) => this.hit(e))}
      ${t ? y : _`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => this.creating = e}
              >
                <span>${C("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? _`<div class="lbl">${C("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${C("shopping.add.change")}
          </button>
        </p>` : this.creating ? _`<div class="field">
        <span class="lbl">${C("recipes.ingredient.parent", { name: this.creating })}</span>
        <home-inventory-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></home-inventory-category-picker>
        ${this.failure ? _`<p class="error" role="alert">${this.failure}</p>` : y}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${C("common.cancel")}
        </button>
      </div>` : _`<label>
        <span class="lbl">${C("recipes.ingredient.text")}</span>
        ${this.text ? _`<span class="detail">${this.text} – ${C("recipes.ingredient.unmatched")}</span>` : y}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e) => this.input(e.target.value)}
        />
        ${k(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-ingredient-pick", Zo);
//#endregion
//#region src/unit-add-dialog.ts
var Qo = class extends S {
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
				let { id: e } = await Cn(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await F(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await P(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : C("valid.required");
		return D({
			title: C("unit_add.title"),
			body: _`<label>
          <span class="lbl">${C("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${k(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${C("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: C("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [w];
	}
};
customElements.define("home-inventory-unit-add-dialog", Qo);
//#endregion
//#region src/recipe-ingredients.ts
var $o = class extends S {
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
		return _`<li data-testid="ingredient-row" class="ing">
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
          <span class="lbl">${C("recipes.ingredient.amount")}</span>
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
			this.set(t, { amount: M(n) });
		}}
          />
        </label>
        <label>
          <span class="lbl">${C("recipes.ingredient.unit")}</span>
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
            <option value="" .selected=${e.unit_id == null}>${C("recipes.ingredient.none")}</option>
            ${this.units.map((t) => _`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${C("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${k(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? _`<div class="hintline">
              ${k(C("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${C("recipes.ingredient.unit_create")}
              </button>
            </div>` : y}
      ${e.line ? _`<div class="orig" data-testid="ingredient-line">
              ${C("recipes.ingredient.line", { line: e.line })}
            </div>` : y}
      ${Yo(e, this.categories, this.units, (e) => this.set(t, e))}
      <label>
        <span class="lbl">${C("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${C("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${C("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${C("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${C("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${C("recipes.ingredient.remove")}
          title=${C("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${E(nt)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = Wo(this.value);
		return _`<home-inventory-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></home-inventory-unit-add-dialog>
      <div class="lbl">${C("recipes.ingredients")}</div>
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
        ${C("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-recipe-ingredients", $o);
//#endregion
//#region src/product-input.ts
function es(e) {
	let t = `${e.testid}-product`, n = e.products.some((t) => t.name === e.name.trim()), r = !!e.name.trim() && !n;
	return _`<label>
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
        ${e.products.map((e) => _`<option value=${e.name}></option>`)}
      </datalist>
      ${k(e.err.name ?? (r ? C("canning.new_product") : void 0), t, !e.err.name)}
    </label>
    ${r ? _`<div class="field">
            <span class="lbl">${C("book.category")}</span>
            <home-inventory-category-picker
              .categories=${e.md?.categories ?? []}
              .value=${e.categoryId}
              .hass=${e.hass}
              @change=${(t) => e.onCategory(t.detail)}
            ></home-inventory-category-picker>
            ${k(e.err.category, `${t}-category`)}
          </div>` : y}`;
}
//#endregion
//#region src/recipe-steps-editor.ts
var ts = (e) => e.text.length > (e.kind === "head" ? 100 : 2e3) ? C("valid.too_long", { n: e.kind === "head" ? 100 : yo }) : void 0, ns = class extends S {
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
		return _`<button
      type="button"
      class="icon-btn"
      data-testid=${e}
      aria-label=${t}
      title=${t}
      ?disabled=${i}
      @click=${r}
    >
      ${E(n)}
    </button>`;
	}
	render() {
		let e = 0, t = this.value.length - 1;
		return _`<span class="lbl">${C("recipes.instructions")}</span>
      <ol>
        ${this.value.map((n, r) => {
			let i = n.kind === "head" ? C("recipes.steps.head") : C("recipes.steps.step", { n: ++e }), a = ts(n), o = (e) => this.emit(this.value.map((t, n) => n === r ? {
				...t,
				text: e.target.value
			} : t));
			return _`<li class=${n.kind}>
            <div class="row">
              <span class="no" aria-hidden="true">${n.kind === "head" ? "" : `${e}.`}</span>
              ${n.kind === "head" ? _`<input
                      data-testid="step-head"
                      aria-label=${i}
                      placeholder=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    />` : _`<textarea
                      rows="2"
                      data-testid="step-text"
                      aria-label=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    ></textarea>`}
              ${this.btn("step-up", C("recipes.steps.up"), Je, () => this.move(r, -1), r === 0)}
              ${this.btn("step-down", C("recipes.steps.down"), qe, () => this.move(r, 1), r === t)}
              ${this.btn("step-remove", C("recipes.steps.remove"), nt, () => this.emit(this.value.filter((e, t) => t !== r)))}
            </div>
            ${k(a, `step-${r}`)}
          </li>`;
		})}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${C("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${C("recipes.steps.head_add")}
        </button>
      </p>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-recipe-steps", ns);
//#endregion
//#region src/recipe-draft.ts
var rs = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	steps: e?.steps?.length ? bo(e.steps) : xo(e?.instructions ?? null),
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
}), is = (e, t) => {
	let n = t?.find((t) => t.name === e.product.trim());
	return {
		name: e.name.trim(),
		servings: e.servings,
		steps: So(e.steps),
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
		ingredients: e.ingredients.filter((e) => !Uo(e)).map((e) => ({
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
}, as = class extends S {
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
		super(), this.aiRun = 0, this.initial = "", this.products = [], this.draft = rs(), this.active = !1, this.error = "", this.ai = { kind: "none" };
	}
	async open(e, t, n, r) {
		this.md = e, this.recipe = t, this.kind = t?.canning_product_id == null ? r : t.canning_kind, r && (this.products = await cn(this.hass).catch(() => [])), this.draft = rs(t ?? n), this.initial = JSON.stringify(n ? rs() : this.draft), this.error = "", this.ai = { kind: "none" }, this.aiRun++, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus(), n && z("ai_recipe_check") && this.check();
	}
	async check() {
		let e = ++this.aiRun, t = this.draft, n = t.ingredients;
		this.ai = { kind: "running" };
		try {
			let r = await xn(this.hass, Go(t.name, t.servings, t.steps, n));
			if (e !== this.aiRun) return;
			if (r.status !== "changes") {
				this.ai = { kind: r.status === "ok" ? "ok" : "none" };
				return;
			}
			let i = Ko(r, n, t.steps, this.draft, this.md);
			this.draft = {
				...this.draft,
				ingredients: i.ingredients,
				steps: i.steps
			}, this.ai = i.state;
		} catch (t) {
			e === this.aiRun && (this.ai = {
				kind: "failed",
				message: await P(this.hass, t)
			});
		}
	}
	errors() {
		let e = this.draft, t = {};
		e.name.trim() || (t.name = C("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = C("valid.servings")), e.source_url.trim() && !Gt.test(e.source_url.trim()) && (t.source_url = C("valid.url")), e.image_url.trim() && !Gt.test(e.image_url.trim()) && (t.image_url = C("valid.url")), this.canningMode && !e.product.trim() ? t.product = C("valid.required") : this.canningMode && !this.products.some((t) => t.name === e.product.trim()) && e.product_category == null && (t.product_category = C("valid.category"));
		let n = e.canning_temp, r = e.canning_minutes;
		return n != null && !(Number.isInteger(n) && n >= 1 && n <= 200) ? t.canning_temp = C("valid.canning_temp") : n == null && r != null && (t.canning_temp = C("valid.required")), r != null && !(Number.isInteger(r) && r >= 1 && r <= 1440) ? t.canning_minutes = C("valid.canning_minutes") : r == null && n != null && (t.canning_minutes = C("valid.required")), {
			e: t,
			bad: Wo(e.ingredients).some((e) => Object.keys(e).length) || e.steps.some((e) => ts(e))
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await yn(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				...is(r, this.canningMode ? this.products : null),
				...this.kind ? { canning_kind: this.kind } : {}
			});
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	text(e, t, n, r = "text") {
		return _`<label>
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
      ${k(n, e === "name" ? "recipe-name" : `recipe-${e}`)}
    </label>`;
	}
	canning(e, t, n) {
		return e === "canning_minutes" ? _o({
			kind: this.kind,
			testid: "recipe-canning_minutes",
			minutes: this.draft.canning_minutes,
			err: n,
			onChange: (e) => this.draft = {
				...this.draft,
				canning_minutes: e
			}
		}) : po({
			testid: `recipe-${e}`,
			label: C(`recipes.field.${e}`),
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
		if (!this.active) return _`<dialog></dialog>`;
		let { e, bad: t } = this.errors(), n = this.draft;
		return D({
			title: this.recipe ? C("common.edit_name", { name: this.recipe.name }) : this.kind ? Q(this.kind, "recipe_add") : C("recipes.add"),
			body: _`${qo(this.ai, {
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
        ${this.text("name", C("common.name"), e.name)}
        ${this.canningMode ? es({
				testid: "recipe",
				label: C("canning.recipe_makes"),
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
			}) : y}
        <label>
          <span class="lbl"
            >${this.kind ? Q(this.kind, "recipe_jars") : C("recipes.servings")}</span
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
					servings: M(t)
				};
			}}
          />
          ${k(e.servings, "recipe-servings-input")}
        </label>
        ${this.canningMode ? _`<div class="pair">
                ${this.canning("canning_temp", "°C", e.canning_temp)}
                ${this.canning("canning_minutes", C("recipes.minutes_unit"), e.canning_minutes)}
              </div>` : y}
        ${this.text("source_url", C("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", C("recipes.field.image_url"), e.image_url, "url")}
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
				label: C("common.save"),
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
		this.styles = [w, Nt];
	}
};
customElements.define("home-inventory-recipe-dialog", as);
//#endregion
//#region src/recipe-import.ts
var os = [
	"url",
	"text",
	"photo"
], ss = () => os.filter((e) => z(e === "url" ? "recipe_url" : "ai_import")), cs = 2e4, ls = class extends S {
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
		this.source = ss()[0] ?? "url", this.url = this.text = this.photo = "", this.error = "", this.busy = !1, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.focusField();
	}
	async focusField() {
		await this.updateComplete, this.renderRoot.querySelector("dialog input, dialog textarea")?.focus();
	}
	errors() {
		if (this.source === "text") return this.text.trim() ? void 0 : C("valid.required");
		if (this.source === "photo") return this.photo ? void 0 : C("valid.required");
		let e = this.url.trim();
		return e ? Gt.test(e) ? void 0 : C("valid.url") : C("valid.required");
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
			this.photo = await Pi(t);
		} catch {
			this.error = C("recipes.import.photo_invalid");
		}
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await bn(this.hass, this.request());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-imported", { detail: e }));
			} catch (e) {
				this.error = await P(this.hass, e);
			}
			this.busy = !1;
		}
	}
	switcher() {
		return _`<div class="sources" role="group" aria-label=${C("recipes.import.source")}>
      ${ss().map((e) => _`<button
            type="button"
            data-testid=${`recipe-import-source-${e}`}
            aria-pressed=${e === this.source}
            ?disabled=${this.busy}
            @click=${() => {
			this.source = e, this.error = "", this.focusField();
		}}
          >
            ${C(`recipes.import.source_${e}`)}
          </button>`)}
    </div>`;
	}
	field(e) {
		return this.source === "text" ? _`<label>
        <span class="lbl">${C("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${cs}
          data-testid="recipe-import-text"
          aria-invalid=${!!e}
          .value=${this.text}
          @input=${(e) => this.text = e.target.value}
        ></textarea>
        ${k(e, "recipe-import-text")}
        <span class="note">${C("recipes.import.text_hint")}</span>
      </label>` : this.source === "photo" ? _`<button
          type="button"
          class="take"
          data-testid="recipe-import-camera"
          ?disabled=${this.busy}
          @click=${() => this.takePhoto()}
        >
          ${E(Ze)} ${C("recipes.import.take_photo")}
        </button>
        <label>
          <span class="lbl">${C("recipes.import.photo")}</span>
          <input
            type="file"
            accept="image/*"
            data-testid="recipe-import-photo"
            aria-invalid=${!!e}
            @change=${(e) => this.pickPhoto(e)}
          />
          ${k(e, "recipe-import-photo")}
          <span class="note">${C("recipes.import.photo_hint")}</span>
        </label>
        ${this.photo ? _`<img class="preview" src=${this.photo} alt=${C("recipes.import.photo")} />` : y}` : _`<label>
      <span class="lbl">${C("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!e}
        .value=${this.url}
        @input=${(e) => this.url = e.target.value}
      />
      ${k(e, "recipe-import-url")}
      <span class="note"
        >${C(z("ai_import") ? "recipes.import.hint_ai" : "recipes.import.hint")}</span
      >
    </label>`;
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors();
		return _`${D({
			title: C("recipes.import.title"),
			body: _`${ss().length > 1 ? this.switcher() : y} ${this.field(e)}
        ${this.busy ? _`<div class="busy" role="status" data-testid="recipe-import-busy">
                <progress aria-label=${C("recipes.import.busy")}></progress>
                <span
                  >${C(z("ai_import") ? "recipes.import.busy_ai" : "recipes.import.busy")}</span
                >
              </div>` : y}`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: C("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-recipe-import", ls);
//#endregion
//#region src/api-plan.ts
var us = (e, t, n) => e.callWS({
	type: "home_inventory/meal_plan",
	start: t,
	end: n
}), ds = (e, t) => e.callWS({
	type: "home_inventory/meal_save",
	data: t
}), fs = (e, t) => e.callWS({
	type: "home_inventory/meal_delete",
	meal_id: t
}), ps = (e, t, n, r) => e.callWS({
	type: "home_inventory/meal_shift",
	day: t,
	slot: n,
	apply: r
}), ms = (e, t, n) => e.callWS({
	type: "home_inventory/plan_to_shopping_list",
	start: t,
	end: n
}), hs = class extends S {
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
		this.recipes = n.filter((e) => !L(e)), this.meal = i, this.draft = {
			day: i?.day ?? e,
			slot: i?.slot ?? t,
			text: i?.name ?? a,
			servings: i?.servings ?? r,
			dateBad: !1
		}, this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.text.trim() || (t.text = C("valid.required")), (!e.day || j(e.dateBad, e.day)) && (t.day = C("valid.date")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = C("valid.servings")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.text.trim();
		try {
			await ds(this.hass, {
				...this.meal ? { id: this.meal.id } : {},
				day: t.day,
				slot: t.slot,
				recipe_id: this.recipes.find((e) => e.name === n)?.id ?? null,
				text: n,
				servings: t.servings
			});
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors(), t = this.draft;
		return D({
			title: this.meal ? C("common.edit_name", { name: this.meal.name }) : C("plan.add"),
			body: _`<label>
          <span class="lbl">${C("plan.date")}</span>
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
          ${k(e.day, "meal-day")}
        </label>
        <label>
          <span class="lbl">${C("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(t.slot)}
            @change=${(e) => this.draft = {
				...t,
				slot: Number(e.target.value)
			}}
          >
            ${xi.map((e) => _`<option value=${e} ?selected=${e === t.slot}>${C(`plan.slot.${e}`)}</option>`)}
          </select>
        </label>
        <label>
          <span class="lbl">${C("plan.dish")}</span>
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
            ${this.recipes.map((e) => _`<option value=${e.name}></option>`)}
          </datalist>
          ${k(e.text, "meal-text")}
        </label>
        <label>
          <span class="lbl">${C("recipes.servings")}</span>
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
				servings: M(e.target.value)
			}}
          />
          ${k(e.servings, "meal-servings")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: C("common.save"),
				testid: "meal-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-meal-dialog", hs);
//#endregion
//#region src/cooked-row.ts
var $ = (e) => e.src.candidates.find((t) => t.product_id === e.product_id), gs = (e) => ({
	product_id: e.product_id,
	batch_id: e.batch_id,
	packages: e.packages,
	open: e.open,
	used_up: e.used_up,
	remaining: e.remaining ?? null,
	action: e.action
}), _s = (e) => !e.opened && !e.frozen, vs = (e) => e.reduce((e, t) => e + t.packages, 0), ys = (e) => e.action === "open" ? $(e).batches.filter(_s) : e.action === "reduce" ? $(e).batches.filter((e) => e.opened) : $(e).batches, bs = (e) => {
	let t = $(e).batches.filter((e) => e.opened), n = t.filter((e) => e.remaining < 1).sort((e, t) => Number(e.expires_on == null) - Number(t.expires_on == null) || (e.expires_on ?? "").localeCompare(t.expires_on ?? "") || e.remaining - t.remaining);
	return n.length ? n : t.slice(0, 1);
}, xs = (e) => $(e).batches.find((t) => t.opened && t.batch_id === e.batch_id) ?? bs(e)[e.packages ?? 0], Ss = (e) => {
	let t = bs(e);
	return Math.max(0, e.batch_id == null ? t.length - 1 : t.length - +t.some((t) => t.batch_id === e.batch_id));
}, Cs = (e) => {
	if (!e.checked || e.action === "skip") return;
	if (e.action === "reduce") {
		let t = xs(e);
		if (!t) return C("cooked.no_opened");
		if (e.packages == null || !Number.isInteger(e.packages) || e.packages < 0) return C("valid.packages_zero");
		let n = Ss(e);
		return e.packages > n ? C("valid.max_packages", { n }) : e.remaining == null || e.remaining >= t.remaining - 1e-9 ? C("valid.level_below") : void 0;
	}
	let t = e.packages, n = t === 0 && !(e.action === "out" && e.open > 0);
	if (t == null || !Number.isInteger(t) || t < 0 || n) return C("valid.packages");
	let r = vs(ys(e).filter((t) => e.batch_id == null || t.batch_id === e.batch_id));
	if (t > r) return C("valid.max_packages", { n: r });
	let i = vs($(e).batches.filter(_s));
	if (e.action === "out" && t + e.open > i) return C("valid.max_packages", { n: i });
}, ws = (e, t, n, r, i) => _`<label>
    <span class="lbl">${e}</span>
    <select
      data-testid=${t}
      .value=${n}
      @change=${(e) => i(e.target.value)}
    >
      ${r.map(([e, t]) => _`<option value=${e} ?selected=${e === n}>${t}</option>`)}
    </select>
  </label>`, Ts = (e, t) => {
	let n = [
		t.expires_on ? B(e, t.expires_on) : C("cooked.no_date"),
		t.location,
		C("cooked.pkg", { n: t.packages })
	];
	return t.opened && n.push(C("cooked.opened")), t.frozen && n.push(C("cooked.frozen")), n.join(", ");
}, Es = (e) => {
	let { r: t, err: n, change: r } = e, i = t.src, a = [i.amount == null ? "" : U(e.hass, i.amount, i.unit_symbol), i.text].filter(Boolean).join(" "), o = ys(t).map((t) => [String(t.batch_id), Ts(e.hass, t)]);
	return _`<li class="crow" data-testid="cooked-row">
    <label class="check">
      <input
        type="checkbox"
        data-testid="cooked-check"
        .checked=${t.checked}
        @change=${(e) => r({ checked: e.target.checked })}
      />
      <span
        >${a}${i.optional ? _` <span class="detail">${C("recipes.optional")}</span>` : y}</span
      >
    </label>
    <div class="ctl">
      ${ws(C("cooked.product"), "cooked-product", String(t.product_id), i.candidates.map((e) => [String(e.product_id), e.brand ? `${e.name} (${e.brand})` : e.name]), (e) => r(gs(i.candidates.find((t) => String(t.product_id) === e))))}
      ${ws(C("cooked.batch"), "cooked-batch", t.batch_id == null ? "" : String(t.batch_id), [["", C("cooked.fefo")], ...o], (e) => r({ batch_id: e === "" ? null : Number(e) }))}
      ${t.action === "reduce" && Ss(t) < 1 ? y : _`<label class="pk">
              <span class="lbl"
                >${t.action === "reduce" ? C("cooked.used_up") : C("cooked.packages")}</span
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
      ${ws(C("cooked.action"), "cooked-action", t.action, [
		"out",
		"open",
		"reduce",
		"skip"
	].map((e) => [e, C(`cooked.action.${e}`)]), (e) => {
		let n = e, i = n !== "open" && n !== "reduce" || $(t).batches.some((e) => e.batch_id === t.batch_id && (n === "open" ? _s(e) : e.opened)), a = {
			...t,
			action: n,
			batch_id: i ? t.batch_id : null,
			packages: n === "reduce" ? 0 : t.packages
		}, o = n === "reduce" ? xs(a) : void 0;
		r({
			...t.action === "reduce" && n !== "reduce" ? gs($(t)) : {},
			action: n,
			...n === "reduce" ? { packages: 0 } : {},
			...i ? {} : { batch_id: null },
			...o ? { remaining: Rr(o.remaining) } : {}
		});
	})}
    </div>
    ${t.action === "out" ? _`<label class="check also">
            <input
              type="checkbox"
              data-testid="cooked-also-open"
              .checked=${t.open > 0}
              @change=${(e) => r({ open: +!!e.target.checked })}
            />
            ${C("cooked.also_open")}
          </label>` : y}
    ${t.action === "reduce" || t.action === "open" || t.action === "out" && t.open > 0 ? _`<label class="lvl">
            <span class="lbl">${C("cooked.left_after")}</span>
            ${Vr({
		value: t.remaining ?? 1,
		empty: t.action === "reduce",
		label: C("cooked.left_after"),
		testid: "cooked-level",
		on: (e) => r({ remaining: e })
	})}
          </label>` : y}
    ${k(n, "cooked-packages")}
  </li>`;
}, Ds = s`
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
`, Os = (e) => e.callWS({ type: "home_inventory/cannings" }), ks = (e, t) => e.callWS({
	type: "home_inventory/canning_save",
	data: t
}), As = (e, t) => e.callWS({
	type: "home_inventory/leftover_store",
	...t
}), js = class extends S {
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
		super(), this.dflt = () => G(this.md, this.md?.leftover_category_id, "default_location_id"), this.servings = 1, this.locationId = null, this.error = "";
	}
	async connectedCallback() {
		super.connectedCallback();
		try {
			this.md = await F(this.hass), this.requestUpdate();
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	err() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? C("valid.packages") : "";
	}
	async store() {
		if (!this.err() && this.recipe) try {
			let e = await As(this.hass, {
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
			this.error = await P(this.hass, e);
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
		let e = _`<home-inventory-label-dialog
      .hass=${this.hass}
    ></home-inventory-label-dialog>`;
		if (this.stored) return _`${J(C("leftovers.stored", { charge: this.stored.charge }), void 0, "leftover", _`<button
          type="button"
          class="undo"
          data-testid="leftover-label"
          @click=${() => this.labels()}
        >
          ${C("label.print")}
        </button>`)}
      ${e}`;
		let t = this.err();
		return _`<div class="store">
        <label>
          <span class="lbl">${C("leftovers.jars")}</span>
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
          ${k(t, "leftover-servings")}
        </label>
        <label>
          <span class="lbl">${C("book.location")}</span>
          ${K({
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
          ${C("leftovers.store")}
        </button>
      </div>
      ${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}`;
	}
	static {
		this.styles = [
			w,
			Y,
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
customElements.define("home-inventory-leftover-store", js);
//#endregion
//#region src/api-cooked.ts
var Ms = (e, t, n) => e.callWS({
	type: "home_inventory/cooked_proposal",
	recipe_id: t,
	servings: n
}), Ns = (e, t) => e.callWS({
	type: "home_inventory/cooked_book",
	items: t
}), Ps = (e, t) => e.callWS({
	type: "home_inventory/cooked_undo",
	out_ids: t.out_ids,
	open_ids: t.open_ids,
	remaining_ids: t.remaining_ids
}), Fs = class extends S {
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
			let n = await Ms(this.hass, e.id, t);
			this.rows = n.map((e) => ({
				src: e,
				checked: e.checked,
				...gs(e.candidates.find((t) => t.product_id === e.product_id))
			}));
		} catch (e) {
			this.rows = [], this.error = await P(this.hass, e);
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
			let r = Cs(t);
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
				this.result = await Ns(this.hass, t);
			} catch (e) {
				this.error = await P(this.hass, e);
				return;
			}
			this.error = "", this.dirty = !1, this.saved();
		}
	}
	async undo() {
		try {
			await Ps(this.hass, this.result);
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		this.result = void 0, this.saved(), this.renderRoot.querySelector("dialog")?.close();
	}
	summary() {
		return this.result.bookings.map((e) => C(`cooked.done_${e.action}`, {
			n: e.packages,
			name: e.name
		})).join(", ");
	}
	render() {
		if (!this.active || !this.recipe) return _`<dialog></dialog>`;
		let e = this.errors(), t = !!this.result;
		return D({
			title: C("cooked.title", { name: this.recipe.name }),
			body: t ? _`${J(C("cooked.done", { what: this.summary() }), this.stored ? void 0 : () => this.undo(), "cooked")}
          ${R("leftovers") ? _`<home-inventory-leftover-store
                  .hass=${this.hass}
                  .recipe=${this.recipe}
                  @home-inventory-leftovers-stored=${() => this.stored = !0}
                ></home-inventory-leftover-store>` : y}` : this.rows.length ? _`<p class="detail">${C("cooked.hint")}</p>
              <ul>
                ${this.rows.map((t, n) => Es({
				hass: this.hass,
				r: t,
				err: e[n],
				change: (e) => this.change(n, e)
			}))}
              </ul>` : _`<p class="empty" data-testid="cooked-empty">${C("cooked.empty")}</p>`,
			error: this.error,
			invalid: t || !this.items().length || Object.keys(e).length > 0,
			submit: {
				label: C("cooked.submit"),
				testid: "cooked-save"
			},
			hideSubmit: t,
			cancel: t ? C("common.close") : void 0,
			dirty: () => this.dirty,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [
			w,
			Y,
			Ds,
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
customElements.define("home-inventory-cooked-dialog", Fs);
//#endregion
//#region src/cook-mode.ts
var Is = (e) => {
	let t = Math.max(0, Math.ceil(e / 1e3)), n = Math.floor(t / 3600), r = String(Math.floor(t % 3600 / 60)).padStart(n ? 2 : 1, "0"), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${r}:${i}` : `${r}:${i}`;
}, Ls = () => {
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
}, Rs = class extends S {
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
		(!this.timers.some((e) => e.end > Date.now()) || await T({
			title: C("cook.stop"),
			action: C("cook.stop_ok")
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
		this.now = Date.now(), this.timers.some((t) => t.end <= this.now && t.end > e) && Ls();
	}
	toggle(e) {
		let t = new Set(this.done);
		t.delete(e) || t.add(e), this.done = t;
	}
	step(e, t) {
		return _`<button
        type="button"
        class="step ${this.done.has(t) ? "done" : ""}"
        data-testid="cook-step"
        aria-pressed=${this.done.has(t)}
        @click=${() => this.toggle(t)}
      >
        <span class="no">${t + 1}.</span>${e.text}
      </button>
      ${(e.timers ?? []).map((e) => _`<button
            type="button"
            class="timer-btn"
            data-testid="cook-timer-start"
            aria-label=${C("cook.timer_start", { what: e.label })}
            @click=${() => this.start(t, e.label, e.seconds)}
          >
            ${E(wt)} ${e.label}
          </button>`)}`;
	}
	render() {
		if (!this.active || !this.recipe) return _`<dialog></dialog>`;
		let e = this.recipe, t = this.servings / e.servings;
		return _`<dialog
      @close=${() => this.closed()}
      @cancel=${(e) => {
			e.preventDefault(), this.close();
		}}
    >
      <header>
        <h2>${C("cook.title", { name: e.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${C("cook.close")}
          title=${C("cook.close")}
          @click=${() => this.close()}
        >
          ${E(nt)}
        </button>
      </header>
      <h3>${C("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map((e) => _`<li>
              ${[Bo(this.hass, this.md, e, t), this.md.categories.find((t) => t.id === e.category_id)?.name ?? e.text].filter(Boolean).join(" ")}
              ${e.note ? _`<span class="detail">${e.note}</span>` : y}
            </li>`)}
      </ul>
      <h3>${C("recipes.instructions")}</h3>
      <p class="detail">${C("cook.hint")}</p>
      ${Co(e.steps, (e, t) => this.step(e, t))}
      ${this.timers.length ? _`<div class="timers" role="status">
              ${this.timers.map((e) => {
			let t = e.end - this.now;
			return _`<span class="timer ${t <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${C("cook.timer", {
				n: e.step + 1,
				what: e.label
			})}:
                  <strong>${t > 0 ? Is(t) : C("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${C("cook.timer_cancel")}
                    title=${C("cook.timer_cancel")}
                    @click=${() => this.timers = this.timers.filter((t) => t !== e)}
                  >
                    ${E(nt)}
                  </button>
                </span>`;
		})}
            </div>` : y}
      <p>
        <button type="button" data-testid="cook-cooked" @click=${() => this.cooked()}>
          ${C("cooked.open")}
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
		this.styles = [w, s`
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
customElements.define("home-inventory-cook-mode", Rs);
//#endregion
//#region src/recipes-view.ts
var zs = class extends S {
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
		super(), this.started = !1, this.query = "", this.expiring = /* @__PURE__ */ new Map(), this.onlyExpiring = !1, this.diet = wo(), this.open = /* @__PURE__ */ new Set(), this.servings = /* @__PURE__ */ new Map(), this.scaled = /* @__PURE__ */ new Map(), this.error = "";
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
				gn(this.hass),
				F(this.hass),
				_n(this.hass)
			]);
			[this.recipes, this.md] = [e, t], this.expiring = new Map(n.map((e) => [e.recipe_id, e.used])), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await P(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus(), await this.reveal();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await vn(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await vr(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await gn(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
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
		return (this.recipes ?? []).filter((t) => L(t) === !!this.canning && (!this.canning || t.canning_kind === this.canning) && (!this.onlyExpiring || this.expiring.has(t.id)) && Eo(t, this.diet) && (!e || H(t.name, e) || t.ingredients.some((t) => H(t.text, e))));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = Ut(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return _`<li class="recipe" data-testid="recipe-row" data-recipe-id=${e.id}>
      <div class="head">
        ${Ht(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${C("recipes.summary", e.summary)} ·
            ${L(e) ? C("canning.recipe_summary", {
			name: e.canning_product ?? "",
			jars: e.servings
		}) : Pn(this.hass, e.servings)}${this.expiring.has(e.id) ? _` ·
                    <span class="soon" data-testid="recipe-expiring"
                      >${C("recipes.expiring", { n: this.expiring.get(e.id) })}</span
                    >` : y}</span
          >
          ${R("diet") && !L(e) ? _`<span>${ko(e)}</span>` : y}
        </button>
        ${O({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: N(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? Ho({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onError: (e) => this.error = e,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e),
			onPlan: () => L(e) ? this.dispatchEvent(new CustomEvent("home-inventory-canning-start", {
				detail: e.id,
				bubbles: !0,
				composed: !0
			})) : this.renderRoot.querySelector("home-inventory-meal-dialog").open(A(), 3, this.recipes, r, void 0, e.name),
			onCooked: () => {
				let t = this.renderRoot.querySelector("home-inventory-cooked-dialog");
				t.hass = this.hass, t.open(e, r);
			},
			onCook: () => this.renderRoot.querySelector("home-inventory-cook-mode").open(this.hass, this.md, e, this.scaled.get(e.id) ?? e.ingredients, r)
		}) : y}
    </li>`;
	}
	render() {
		let e = this.error ? _`<p class="error" role="alert">${this.error}</p>` : y;
		if (!this.recipes || !this.md) return e;
		let t = this.shown();
		return _`${e}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${C("recipes.search")}
          placeholder=${C("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        ${ss().length ? _`<button data-testid="recipe-import" @click=${() => this.importer().open()}>
                ${C("recipes.import.open")}
              </button>` : y}
        ${Ro(this.hass, (e) => this.error = e)}
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${this.canning ? Q(this.canning, "recipe_add") : C("recipes.add")}
        </button>
      </div>
      ${this.expiring.size ? _`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e) => this.onlyExpiring = e.target.checked}
              />
              ${C("recipes.expiring_only")}
            </label>` : y}
      ${R("diet") && !this.canning ? Ao(this.diet, (e) => this.diet = e) : y}
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
      ${t.length ? _`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : _`<p class="empty">
              ${this.query.trim() ? C("recipes.no_hits") : this.canning ? Q(this.canning, "recipes_empty") : C("recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [w, vo];
	}
};
customElements.define("home-inventory-recipes", zs);
//#endregion
//#region src/plan-shift.ts
var Bs = (e, t) => _`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${C("plan.shift")}
    title=${C("plan.shift")}
    @click=${() => e.shift(t)}
  >
    ${E(Xe)}
  </button>`;
async function Vs(e, t) {
	let { meals: n } = await ps(e, t.day, t.slot, !1), r = new Intl.DateTimeFormat(Di(e), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	});
	return await T({
		title: C("plan.shift_title", { slot: C(`plan.slot.${t.slot}`) }),
		body: _`<ul class="impact" data-testid="shift-list">
      ${n.map((e) => {
			let t = Si(e.day);
			return _`<li>${r.format(t)} ${e.name} → ${r.format(Si(X(Z(t, 1))))}</li>`;
		})}
    </ul>`,
		action: C("plan.shift_ok")
	}) ? (await ps(e, t.day, t.slot, !0), !0) : !1;
}
//#endregion
//#region src/plan-day.ts
function Hs(e, t) {
	let n = X(t);
	return _`<div data-testid="plan-day" data-day=${n}>
    ${xi.map((t) => _`<section data-testid="plan-cell" data-slot=${t}>
          <div class="head">
            <h3>${C(`plan.slot.${t}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${C("plan.add")}
              title=${C("plan.add")}
              @click=${() => e.add(n, t)}
            >
              ${E(ht)}
            </button>
          </div>
          <ul>
            ${e.meals.filter((e) => e.day === n && e.slot === t).map((t) => _`<li data-testid="plan-meal">
                    <button
                      type="button"
                      class="row"
                      data-testid="plan-meal-open"
                      @click=${() => e.open(t)}
                    >
                      ${t.name} · ${Pn(e.hass, t.servings)}
                    </button>
                    ${Bs(e, t)}
                    ${O({
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
var Us = s`
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
`, Ws = "(max-width: 600px)", Gs = (e, t) => _`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => e.open(t)}>
      ${t.name}
    </button>
    <span class="sec">${Pn(e.hass, t.servings)}</span>
    ${Bs(e, t)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${C("common.edit_name", { name: t.name })}
      title=${C("common.edit_name", { name: t.name })}
      @click=${() => e.edit(t)}
    >
      ${E(mt)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${C("common.delete_name", { name: t.name })}
      title=${C("common.delete_name", { name: t.name })}
      @click=${() => e.remove(t)}
    >
      ${E(it)}
    </button>
  </div>`, Ks = (e, t, n, r) => _`<button
    class="icon-btn quiet"
    data-testid=${r}
    aria-label=${C("plan.add")}
    title=${C("plan.add")}
    @click=${() => e.add(t, n)}
  >
    ${E(ht)}
  </button>`, qs = (e, t, n) => _`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => e.openDay(t)}
  >
    ${n.format(t)}
  </button>`, Js = (e) => [
	0,
	1,
	2,
	3,
	4,
	5,
	6
].map((t) => Z(e, t)), Ys = (e, t, n) => e.meals.filter((e) => e.day === t && e.slot === n);
function Xs(e, t, n) {
	let r = new Intl.DateTimeFormat(Di(e.hass), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	}), i = X(/* @__PURE__ */ new Date());
	return n ? _`<div data-testid="plan-week">
      ${Js(t).map((t) => {
		let n = X(t);
		return _`<section class="daybox" data-testid="plan-day" data-day=${n}>
          <h3 class=${n === i ? "today" : ""}>
            ${qs(e, t, r)} ${Ks(e, n, 3, "plan-add-day")}
          </h3>
          ${xi.filter((t) => Ys(e, n, t).length).map((t) => _`<div class="slotline" data-testid="plan-cell" data-slot=${t}>
                <span class="slot">${C(`plan.slot.${t}`)}</span>
                <div>${Ys(e, n, t).map((t) => Gs(e, t))}</div>
              </div>`)}
        </section>`;
	})}
    </div>` : _`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${Js(t).map((t) => _`<th scope="col" class=${X(t) === i ? "today" : ""}>
              ${qs(e, t, r)}
            </th>`)}
      </tr>
    </thead>
    <tbody>
      ${xi.map((n) => _`<tr>
            <th scope="row">${C(`plan.slot.${n}`)}</th>
            ${Js(t).map((t) => {
		let r = X(t);
		return _`<td data-testid="plan-day" data-day=${r}>
                <div data-testid="plan-cell" data-slot=${n}>
                  ${Ys(e, r, n).map((t) => Gs(e, t))} ${Ks(e, r, n, "plan-add")}
                </div>
              </td>`;
	})}
          </tr>`)}
    </tbody>
  </table>`;
}
var Zs = s`
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
`, Qs = [
	Et,
	Dt,
	rt,
	Tt,
	ot
];
function $s(e, t, n, r) {
	let i = Di(e.hass), a = new Intl.DateTimeFormat(i, { weekday: "short" }), o = new Intl.DateTimeFormat(i, { dateStyle: "full" }), s = X(/* @__PURE__ */ new Date());
	return _`<div class="month" data-testid="plan-month">
    ${[
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((e) => _`<div class="wd">${a.format(Z(t, e))}</div>`)}
    ${Array.from({ length: n * 7 }, (e, n) => Z(t, n)).map((t) => {
		let n = X(t), i = e.meals.filter((e) => e.day === n);
		return _`<button
        type="button"
        class="cell ${t.getMonth() === r ? "" : "dim"} ${n === s ? "today" : ""}"
        data-testid="plan-month-day"
        data-day=${n}
        aria-label=${o.format(t)}
        @click=${() => e.openDay(t)}
      >
        <span class="num">${t.getDate()}</span>
        <span class="icons">
          ${xi.filter((e) => i.some((t) => t.slot === e)).map((e) => {
			let t = C(`plan.slot.${e}`);
			return _`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${e}
              aria-label=${t}
              title=${[t, ...i.filter((t) => t.slot === e).map((e) => e.name)].join("\n")}
              >${E(Qs[e])}</span
            >`;
		})}
        </span>
      </button>`;
	})}
  </div>`;
}
var ec = s`
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
`, tc = 366, nc = (e, t) => Math.round((Si(t).getTime() - Si(e).getTime()) / 864e5), rc = class extends S {
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
		this.from = A(), this.to = X(Z(Si(this.from), 6)), this.bad = {
			from: !1,
			to: !1
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = {};
		return (!this.from || j(this.bad.from, this.from)) && (e.from = C("valid.date")), !this.to || j(this.bad.to, this.to) ? e.to = C("valid.date") : !e.from && this.to < this.from ? e.to = C("plan.shop.order") : !e.from && nc(this.from, this.to) >= tc && (e.to = C("plan.shop.long", { max: tc })), e;
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) try {
			let e = await ms(this.hass, this.from, this.to);
			this.renderRoot.querySelector("dialog")?.close();
			let t = e.recipes.length ? C("plan.shop.done", { recipes: e.recipes.map((e) => `${e.name} (${e.servings})`).join(", ") }) : C("plan.shop.none");
			this.dispatchEvent(new CustomEvent("home-inventory-shopped", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	field(e, t, n) {
		return _`<label>
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
      ${k(n, `plan-shop-${e}`)}
    </label>`;
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors();
		return D({
			title: C("plan.shop.title"),
			body: _`<p class="hint">${C("plan.shop.hint")}</p>
        ${this.field("from", C("plan.shop.from"), e.from)}
        ${this.field("to", C("plan.shop.to"), e.to)}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: C("plan.shop.submit"),
				testid: "plan-shop-save"
			},
			dirty: () => !1,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-plan-shopping-dialog", rc);
//#endregion
//#region src/plan-view.ts
var ic = class extends S {
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
		super(), this.started = !1, this.narrow = window.matchMedia(Ws), this.onNarrow = () => this.requestUpdate(), this.date = /* @__PURE__ */ new Date(), this.meals = [], this.household = 1, this.recipes = [], this.error = "", this.note = "";
	}
	get view() {
		return bi.includes(this.section) ? this.section : "week";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load(), gn(this.hass).then((e) => this.recipes = e, () => void 0)) : e.has("section") && this.started && this.load();
	}
	async load() {
		let [e, t] = Ti(this.view, this.date);
		try {
			let n = await us(this.hass, X(e), X(t));
			this.meals = n.meals, this.household = n.household_servings, this.error = "";
		} catch (e) {
			this.error = await P(this.hass, e);
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
			this.error = await P(this.hass, e);
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
				await It(e.name) && await this.act(() => fs(this.hass, e.id));
			},
			open: (e) => e.recipe_id == null ? this.dialog().open(e.day, e.slot, this.recipes, this.household, e) : this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
				detail: `recipes/${e.recipe_id}`,
				bubbles: !0,
				composed: !0
			})),
			shift: (e) => this.act(() => Vs(this.hass, e)),
			openDay: (e) => {
				this.date = e, this.nav("day");
			}
		};
	}
	label() {
		let e = Di(this.hass), t = this.date;
		if (this.view === "day") return new Intl.DateTimeFormat(e, { dateStyle: "full" }).format(t);
		if (this.view === "month") return new Intl.DateTimeFormat(e, {
			month: "long",
			year: "numeric"
		}).format(t);
		let [n, r] = Ti("week", t);
		return new Intl.DateTimeFormat(e, { dateStyle: "medium" }).formatRange(n, new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1));
	}
	body() {
		let e = this.ctx(), [t, n] = Ti(this.view, this.date);
		return this.view === "day" ? Hs(e, this.date) : this.view === "week" ? Xs(e, t, this.narrow.matches) : $s(e, t, Math.round((n.getTime() - t.getTime()) / 6048e5), this.date.getMonth());
	}
	render() {
		let e = this.view;
		return _`${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}
      ${this.note ? _`<p class="note" role="status" data-testid="plan-shop-note">${this.note}</p>` : y}
      <nav aria-label=${C("plan.view.label")}>
        ${bi.map((t) => _`<button
              data-testid=${`plan-view-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => t === "day" ? this.ctx().openDay(/* @__PURE__ */ new Date()) : this.nav(t)}
            >
              ${C(`plan.view.${t}`)}
            </button>`)}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${C("plan.prev")}
          title=${C("plan.prev")}
          @click=${() => this.go(Ei(e, this.date, -1))}
        >
          ${E($e)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(/* @__PURE__ */ new Date())}>
          ${C("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${C("plan.next")}
          title=${C("plan.next")}
          @click=${() => this.go(Ei(e, this.date, 1))}
        >
          ${E(et)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        <button
          data-testid="plan-shop"
          @click=${() => this.renderRoot.querySelector("home-inventory-plan-shopping-dialog").open()}
        >
          ${C("plan.shop")}
        </button>
        ${e === "month" ? y : _`<home-inventory-receipt-button
                .hass=${this.hass}
                .print=${() => mn(this.hass, X(Ti(e, this.date)[0]), e === "day" ? 1 : 7)}
                .done=${C("plan.printed")}
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
			w,
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
			Us,
			Zs,
			ec
		];
	}
};
customElements.define("home-inventory-plan", ic);
//#endregion
//#region src/canning-new-fields.ts
function ac(e) {
	let t = e.draft, n = e.e;
	if (e.canning) return _`<p class="detail" data-testid="canning-fixed">
      ${Q(e.kind, "fixed", {
		charge: e.canning.charge,
		name: t.name,
		jars: t.jars ?? ""
	})}
    </p>`;
	let r = e.recipes.find((e) => e.id === t.recipe_id);
	return _`<label>
      <span class="lbl">${Q(e.kind, "recipe")}</span>
      <select
        data-testid="canning-recipe"
        @change=${(t) => {
		let n = t.target.value;
		e.pickRecipe(n ? Number(n) : null);
	}}
      >
        <option value="" .selected=${t.recipe_id == null}>${C("common.none")}</option>
        ${e.recipes.map((e) => _`<option value=${e.id} .selected=${e.id === t.recipe_id}>${e.name}</option>`)}
      </select>
    </label>
    ${e.madeOn}
    ${r ? _`<p class="detail" data-testid="canning-recipe-product">
            ${Q(e.kind, "recipe_product", { name: r.canning_product ?? "" })}
          </p>` : es({
		testid: "canning",
		label: C("canning.product"),
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
      <span class="lbl">${C("book.location")}</span>
      ${K({
		testid: "canning-location",
		own: t.location_id,
		dflt: e.location,
		options: (e.md?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!n.location,
		onChange: (t) => e.set({ location_id: t })
	})}
      ${k(n.location, "canning-location")}
    </label>`;
}
//#endregion
//#region src/canning-dialog.ts
var oc = class extends S {
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
			made_on: A(),
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
		this.md = e, this.products = t, this.kind = i?.kind ?? r, this.recipes = n.filter((e) => L(e) && e.canning_kind === this.kind), this.canning = i, this.draft = i ? {
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
		return n?.[e] == null ? G(this.md, n ? n.category_id : t.category_id, e) : {
			value: n[e],
			source: C("book.from_product")
		};
	}
	proposal(e) {
		let t = this.dflt("shelf_days", e);
		return t && e.made_on ? Ci(e.made_on, Number(t.value)) : "";
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
		return this.canning || ((!e.made_on || j(e.dateBad, e.made_on)) && (t.made_on = C("valid.date")), e.name.trim() ? !this.product() && e.category_id == null && (t.category = C("valid.category")) : t.name = C("valid.required"), (e.jars == null || !Number.isInteger(e.jars) || e.jars < 1 || e.jars > 9999) && (t.jars = C("valid.packages")), !this.dflt("default_location_id") && e.location_id == null && (t.location = C("valid.location"))), e.temp != null && !(Number.isInteger(e.temp) && e.temp >= 1 && e.temp <= 200) && (t.temp = C("valid.canning_temp")), e.minutes != null && !(Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440) && (t.minutes = C("valid.canning_minutes")), t;
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
			let e = await ks(this.hass, this.canning ? {
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
			this.error = await P(this.hass, e);
		}
	}
	num(e, t, n, r) {
		return po({
			testid: `canning-${e}`,
			label: t,
			unit: n,
			value: this.draft[e],
			err: r,
			onChange: (t) => this.set({ [e]: t })
		});
	}
	date(e, t, n) {
		return mo({
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
		return ac({
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
			madeOn: this.date("made_on", C("canning.made_on"), e.made_on),
			jars: this.num("jars", Q(this.kind, "jars"), "", e.jars)
		});
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.dflt("shelf_days") : void 0;
		return D({
			title: this.canning ? C("common.edit_name", { name: this.canning.charge }) : Q(this.kind, "add_title"),
			body: _`${this.newFields(e)} ${this.date("expires_on", C("canning.expires_on"))}
        ${n ? _`<span class="detail">${C("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : y}
        <div class="pair">
          ${this.num("temp", C("recipes.field.canning_temp"), "°C", e.temp)}
          ${_o({
				kind: this.kind,
				testid: "canning-minutes",
				minutes: t.minutes,
				err: e.minutes,
				onChange: (e) => this.set({ minutes: e })
			})}
        </div>
        <label>
          <span class="lbl">${C("canning.notes")}</span>
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
				label: C("common.save"),
				testid: "canning-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-canning-dialog", oc);
//#endregion
//#region src/leftover-dialog.ts
var sc = class extends S {
	static {
		this.properties = {
			hass: { attribute: !1 },
			draft: { state: !0 },
			active: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.recipes = [], this.initial = "", this.cat = (e) => G(this.md, this.md?.leftover_category_id, e), this.draft = this.blank(), this.active = !1, this.error = "";
	}
	blank() {
		return {
			made_on: A(),
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
		this.md = e, this.recipes = t.filter((e) => !L(e)), this.canning = n, this.draft = n ? {
			...this.blank(),
			made_on: n.made_on,
			dish: n.name,
			servings: n.jars,
			expires_on: n.expires_on ?? "",
			notes: n.notes
		} : this.blank(), n || (this.draft.expires_on = this.proposal(this.draft)), this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input, dialog select")?.focus();
	}
	days(e) {
		let t = e.location_id ?? Number(this.cat("default_location_id")?.value), n = R("frozen") && this.md?.locations.find((e) => e.id === t)?.freezer;
		return this.cat(n ? "frozen_days" : "shelf_days");
	}
	proposal(e) {
		let t = this.days(e);
		return t && e.made_on ? Ci(e.made_on, Number(t.value)) : "";
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
		return j(e.expiresBad, e.expires_on) && (t.expires_on = C("valid.date")), this.canning || ((!e.made_on || j(e.madeBad, e.made_on)) && (t.made_on = C("valid.date")), e.dish.trim() || (t.dish = C("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = C("valid.packages")), !this.cat("default_location_id") && e.location_id == null && (t.location = C("valid.location"))), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.notes.trim() || null, r = t.expires_on || null, i = t.dish.trim(), a = this.recipes.find((e) => e.name === i);
		try {
			let e = this.canning ? await ks(this.hass, {
				id: this.canning.id,
				recipe_id: this.canning.recipe_id,
				expires_on: r,
				notes: n
			}) : await As(this.hass, {
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
			this.error = await P(this.hass, e);
		}
	}
	newFields(e) {
		let t = this.draft;
		return this.canning ? _`<p class="detail" data-testid="leftover-fixed">
        ${C("leftovers.fixed", {
			charge: this.canning.charge,
			name: t.dish,
			jars: t.servings ?? ""
		})}
      </p>` : _`<label>
        <span class="lbl">${C("leftovers.dish")}</span>
        <input
          list="leftover-dishes"
          data-testid="leftover-dish"
          aria-invalid=${!!e.dish}
          .value=${t.dish}
          @input=${(e) => this.set({ dish: e.target.value })}
        />
        <datalist id="leftover-dishes">
          ${this.recipes.map((e) => _`<option value=${e.name}></option>`)}
        </datalist>
        ${k(e.dish, "leftover-dish")}
      </label>
      ${mo({
			testid: "leftover-made_on",
			label: C("canning.made_on"),
			value: t.made_on,
			err: e.made_on,
			onChange: (e, t) => this.set({
				made_on: e,
				madeBad: t
			})
		})}
      ${po({
			testid: "leftover-servings",
			label: C("leftovers.jars"),
			unit: "",
			value: t.servings,
			err: e.servings,
			onChange: (e) => this.set({ servings: e })
		})}
      <label>
        <span class="lbl">${C("book.location")}</span>
        ${K({
			testid: "leftover-location",
			own: t.location_id,
			dflt: this.cat("default_location_id"),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			invalid: !!e.location,
			onChange: (e) => this.set({ location_id: e })
		})}
        ${k(e.location, "leftover-location")}
      </label>`;
	}
	render() {
		if (!this.active) return _`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.days(t) : void 0;
		return D({
			title: this.canning ? C("common.edit_name", { name: this.canning.charge }) : C("leftovers.add_title"),
			body: _`${this.newFields(e)}
        ${mo({
				testid: "leftover-expires_on",
				label: C("canning.expires_on"),
				value: t.expires_on,
				err: e.expires_on,
				onChange: (e, t) => this.set({
					expires_on: e,
					expiresBad: t
				})
			})}
        ${n ? _`<span class="detail">${C("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : y}
        <label>
          <span class="lbl">${C("canning.notes")}</span>
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
				label: C("common.save"),
				testid: "leftover-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = w;
	}
};
customElements.define("home-inventory-leftover-dialog", sc);
//#endregion
//#region src/canning-view.ts
var cc = class extends S {
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
		let e = ho();
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
				Os(this.hass),
				F(this.hass),
				cn(this.hass),
				gn(this.hass)
			]), this.error = "";
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	edit(e, t) {
		if (this.message = "", (e?.kind ?? this.kind) === "leftover") return this.renderRoot.querySelector("home-inventory-leftover-dialog").open(this.md, this.recipes, e);
		this.renderRoot.querySelector("home-inventory-canning-dialog").open(this.md, this.products, this.recipes, this.kind, e, t);
	}
	async removeCanning(e) {
		this.error = "";
		try {
			if (!await vr(this.hass, this.md, "canning", {
				id: e.id,
				name: e.charge
			})) return;
		} catch (e) {
			this.error = await P(this.hass, e);
			return;
		}
		await this.load();
	}
	async saved(e) {
		await this.load();
		let t = e.detail;
		t && (this.message = C("canning.saved", { charge: t.charge }), this.renderRoot.querySelector("home-inventory-label-dialog").open({
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
			e.expires_on ? C("canning.until", { date: B(this.hass, e.expires_on) }) : "",
			e.temp == null ? "" : `${e.temp} °C`,
			e.minutes == null ? "" : go(this.hass, e.kind, e.minutes),
			e.recipe ?? ""
		].filter(Boolean).join(" · ");
	}
	protocols() {
		if (!this.rows) return y;
		let e = this.rows.filter((e) => e.kind === this.kind);
		return _`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${this.kind === "leftover" ? C("leftovers.add_title") : C("canning.add")}
        </button>
      </div>
      ${this.message ? _`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : y}
      ${e.length ? _`<ul>
              ${e.map((e) => _`<li data-testid="canning-row" data-charge=${e.charge}>
                    <button type="button" class="row" @click=${() => this.edit(e)}>
                      <span>${e.charge} · ${e.name}</span>
                      <span class="detail">${this.detail(e)}</span>
                      ${e.notes ? _`<span class="detail">${e.notes}</span>` : y}
                    </button>
                    ${O({
			testid: "canning",
			name: e.charge,
			onEdit: () => this.edit(e),
			onDelete: N(this.hass) ? () => this.removeCanning(e) : void 0
		})}
                  </li>`)}
            </ul>` : _`<p class="empty">${Q(this.kind, "empty")}</p>`}`;
	}
	render() {
		let e = this.kind, t = this.recipesShown && e !== "leftover", n = ho();
		return _`${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}
      ${n.length > 1 ? _`<nav aria-label=${C("preserve.kind_label")}>
              ${n.map((n) => _`<button
                    data-testid=${`preserve-${n}`}
                    aria-current=${n === e ? "page" : "false"}
                    @click=${() => this.nav(this.route(n, t))}
                  >
                    ${C(`preserve.${n}`)}
                  </button>`)}
            </nav>` : y}
      ${e === "leftover" ? y : _`<nav aria-label=${C("canning.view.label")}>
              ${["protocols", "recipes"].map((n) => _`<button
                    data-testid=${`canning-view-${n}`}
                    aria-current=${n === "recipes" === t ? "page" : "false"}
                    @click=${() => this.nav(this.route(e, n === "recipes"))}
                  >
                    ${C(`canning.view.${n}`)}
                  </button>`)}
            </nav>`}
      <div @home-inventory-canning-start=${this.start}>
        ${t ? _`<home-inventory-recipes .hass=${this.hass} .canning=${e}></home-inventory-recipes>` : this.protocols()}
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
        @home-inventory-printed=${(e) => e.detail && (this.message = C("label.printed", { n: e.detail }))}
      ></home-inventory-label-dialog>`;
	}
	static {
		this.styles = [w, s`
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
customElements.define("home-inventory-canning", cc);
//#endregion
//#region src/api-stocktake.ts
var lc = (e, t, n) => e.callWS({
	type: "home_inventory/stocktake_scan",
	location_id: t,
	code: n
}), uc = (e, t) => e.callWS({
	type: "home_inventory/stocktake_apply",
	...t
}), dc = class extends S {
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
		this.hass && !this.started && (this.started = !0, F(this.hass).then((e) => this.md = e, async (e) => this.error = await P(this.hass, e)));
	}
	async choose(e) {
		this.location = e, this.counted = /* @__PURE__ */ new Map(), this.extra = [], this.pick = void 0, this.error = "", this.rows = e ? (await I(this.hass)).filter((t) => t.location_id === e) : [], await this.updateComplete, this.renderRoot.querySelector("home-inventory-booking-scan")?.focusInput();
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
				if (dr(e)) {
					let t = await fr(this.hass, e);
					if (this.query = "", t) return void this.choose(t.id);
					this.error = C("location_label.unknown");
					return;
				}
				let t = await lc(this.hass, this.location, e.trim()), n = t.batches.filter((e) => this.rows.some((t) => t.batch_id === e.batch_id));
				n.length === 1 ? this.count(n[0].batch_id, 1) : n.length > 1 ? this.pick = {
					...t,
					batches: n
				} : this.addExtra(t, 1), this.query = "";
			} catch (e) {
				this.error = await P(this.hass, e);
			}
		}
	}
	batchLabel(e) {
		let t = e.expires_on ? B(this.hass, e.expires_on) : C("stock.no_date");
		return e.charge ? C("stock.charge", {
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
		if (await T({
			title: C("stocktake.confirm_title"),
			message: C("stocktake.confirm_message", {
				missing: e,
				more: t
			}),
			action: C("stocktake.apply")
		})) try {
			let e = await uc(this.hass, {
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
			await this.choose(this.location), this.message = C("stocktake.done", { n: e.corrections });
		} catch (e) {
			this.error = await P(this.hass, e);
		}
	}
	stepper(e, t, n, r) {
		return _`<span class="acts">
      <button
        class="icon-btn"
        data-testid=${`${e}-minus`}
        aria-label=${C("stocktake.less", { name: t })}
        title=${C("stocktake.less", { name: t })}
        ?disabled=${n === 0}
        @click=${() => r(-1)}
      >
        ${E(dt)}
      </button>
      <button
        class="icon-btn"
        data-testid=${`${e}-plus`}
        aria-label=${C("stocktake.one_more", { name: t })}
        title=${C("stocktake.one_more", { name: t })}
        @click=${() => r(1)}
      >
        ${E(ht)}
      </button>
    </span>`;
	}
	rowError(e) {
		return e.remaining < 1 && (this.counted.get(e.batch_id) ?? 0) > 1 ? C("valid.partial_one") : void 0;
	}
	list() {
		return _`<ul>
      ${this.rows.map((e) => {
			let t = this.counted.get(e.batch_id) ?? 0, n = t - e.packages;
			return _`<li data-testid="stocktake-row">
          <span class="what">
            <span>${e.name}</span>
            <span class="detail">${this.batchLabel(e)}</span>
          </span>
          <span class="count">
            ${C("stocktake.counted", {
				n: t,
				packages: e.packages
			})}
            ${n ? _`<span class="detail"
                    >${C(n < 0 ? "stocktake.missing" : "stocktake.too_many", { n: Math.abs(n) })}</span
                  >` : y}
          </span>
          ${this.stepper("stocktake-row", e.name, t, (t) => this.count(e.batch_id, t))}
          ${k(this.rowError(e), "stocktake-row")}
        </li>`;
		})}
    </ul>`;
	}
	extras() {
		return this.extra.length ? _`<h3>${C("stocktake.extra")}</h3>
      <ul>
        ${this.extra.map((e, t) => _`<li data-testid="stocktake-extra">
              <span class="what">
                <span>${e.name}</span>
                <input
                  type="date"
                  data-testid="stocktake-extra-date"
                  aria-label=${C("book.expires_on")}
                  min="2000-01-01"
                  max="2099-12-31"
                  .value=${e.expires_on}
                  @input=${(e) => this.extra = this.extra.map((n, r) => r === t ? {
			...n,
			expires_on: e.target.value
		} : n)}
                />
              </span>
              <span class="count">${C("book.count", { n: e.packages })}</span>
              ${this.stepper("stocktake-extra", e.name, e.packages, (t) => this.addExtra(e, t))}
            </li>`)}
      </ul>` : y;
	}
	pickLine(e) {
		let t = C("stocktake.pick", { name: e.name });
		return _`<div class="pick" role="group" aria-label=${t}>
      <span>${t}</span>
      ${e.batches.map((e) => _`<button
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
		return _`<label>
        <span class="lbl">${C("stocktake.location")}</span>
        <select
          data-testid="stocktake-location"
          @change=${(e) => this.choose(Number(e.target.value) || null)}
        >
          <option value="" .selected=${this.location == null}>${C("stocktake.choose")}</option>
          ${(this.md?.locations ?? []).map((e) => _`<option value=${e.id} .selected=${e.id === this.location}>${e.name}</option>`)}
        </select>
      </label>
      ${this.error ? _`<p class="error" role="alert">${this.error}</p>` : y}
      ${J(this.message, void 0, "stocktake")}
      ${this.location ? _`<p class="detail">${C("stocktake.hint")}</p>
              <home-inventory-booking-scan
                .value=${this.query}
                @query=${(e) => this.query = e.detail}
                @find=${(e) => this.find(e.detail)}
              ></home-inventory-booking-scan>
              ${this.pick ? this.pickLine(this.pick) : y}
              ${this.rows.length ? this.list() : _`<p class="empty">${C("stocktake.empty")}</p>`}
              ${this.extras()}
              <div class="actions">
                <button
                  class="primary"
                  data-testid="stocktake-apply"
                  ?disabled=${!e && !t || this.rows.some((e) => this.rowError(e))}
                  @click=${() => this.apply()}
                >
                  ${C("stocktake.apply")}
                </button>
              </div>` : y}`;
	}
	static {
		this.styles = [
			w,
			Y,
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
customElements.define("home-inventory-stocktake", dc);
//#endregion
//#region src/home-inventory-panel.ts
var fc = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", pc = [
	"stock",
	"expiry",
	"emergency",
	"shopping",
	"recipes",
	"plan",
	"canning",
	"settings"
], mc = [
	"shopping",
	"recipes",
	"plan",
	"emergency"
], hc = class extends S {
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
		e.has("hass") && this.hass && Mt(this.hass.language), e.has("panel") && (En(this.panel?.config?.modules), On(this.panel?.config?.external));
	}
	get tabs() {
		return pc.filter((e) => (e !== "settings" || N(this.hass)) && (!mc.includes(e) || R(e)) && (e !== "canning" || ho().length > 0));
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
		return _`
      <header>
        ${this.narrow ? _`<button
                class="menu"
                aria-label=${C("panel.menu")}
                title=${C("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${E(lt)}
              </button>` : y}
        <h1>${C("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${fc}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${C("panel.help")}
          title=${C("panel.help")}
          >${E(st)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map((t) => _`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${C(`tab.${t}`)}
            </button>`)}
      </div>
      <main
        role="tabpanel"
        @home-inventory-navigate=${(e) => this.select(e.detail)}
      >
        ${e === "settings" ? _`<home-inventory-settings
                .hass=${this.hass}
                .section=${this.sub}
              ></home-inventory-settings>` : e === "stock" && this.seg === "stocktake" ? _`<home-inventory-stocktake .hass=${this.hass}></home-inventory-stocktake>` : e === "stock" ? _`<home-inventory-stock
                    .hass=${this.hass}
                    .mode=${this.seg === "in" || this.seg === "out" || this.seg === "open" && R("opened") || this.seg === "freeze" && R("frozen") ? this.seg : "search"}
                  ></home-inventory-stock>` : e === "expiry" ? _`<home-inventory-expiry .hass=${this.hass}></home-inventory-expiry>` : e === "emergency" ? _`<home-inventory-emergency .hass=${this.hass}></home-inventory-emergency>` : e === "recipes" ? _`<home-inventory-recipes
                          .hass=${this.hass}
                          .section=${this.sub}
                        ></home-inventory-recipes>` : e === "plan" ? _`<home-inventory-plan
                            .hass=${this.hass}
                            .section=${this.sub}
                          ></home-inventory-plan>` : e === "canning" ? _`<home-inventory-canning
                              .hass=${this.hass}
                              .section=${this.sub}
                            ></home-inventory-canning>` : _`<home-inventory-shopping
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
customElements.define("home-inventory-panel", hc);
//#endregion
export { hc as HomeInventoryPanel };
