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
})(e) : e, { is: u, defineProperty: d, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: f, getPrototypeOf: ne } = Object, re = globalThis, ie = re.trustedTypes, ae = ie ? ie.emptyScript : "", oe = re.reactiveElementPolyfillSupport, p = (e, t) => e, se = {
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
}, ce = (e, t) => !u(e, t), le = {
	attribute: !0,
	type: String,
	converter: se,
	reflect: !1,
	useDefault: !1,
	hasChanged: ce
};
Symbol.metadata ??= Symbol("metadata"), re.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var m = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = le) {
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
		return this.elementProperties.get(e) ?? le;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? se : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? se : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[p("elementProperties")] = /* @__PURE__ */ new Map(), m[p("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: m }), (re.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var ue = globalThis, de = (e) => e, fe = ue.trustedTypes, pe = fe ? fe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, me = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + h, ge = `<${he}>`, g = document, _e = () => g.createComment(""), ve = (e) => e === null || typeof e != "object" && typeof e != "function", ye = Array.isArray, be = (e) => ye(e) || typeof e?.[Symbol.iterator] == "function", xe = "[ 	\n\f\r]", Se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ce = /-->/g, we = />/g, _ = RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Ee = /"/g, De = /^(?:script|style|textarea|title)$/i, Oe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), v = Oe(1), ke = Oe(2), y = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), Ae = /* @__PURE__ */ new WeakMap(), x = g.createTreeWalker(g, 129);
function je(e, t) {
	if (!ye(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return pe === void 0 ? t : pe.createHTML(t);
}
var Me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Se;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Se ? c[1] === "!--" ? o = Ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = _) : (De.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = _) : o = we : o === _ ? c[0] === ">" ? (o = i ?? Se, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? _ : c[3] === "\"" ? Ee : Te) : o === Ee || o === Te ? o = _ : o === Ce || o === we ? o = Se : (o = _, i = void 0);
		let d = o === _ && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Se ? n + ge : l >= 0 ? (r.push(s), n.slice(0, l) + me + n.slice(l) + h + d) : n + h + (l === -2 ? t : d);
	}
	return [je(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ne = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Me(t, n);
		if (this.el = e.createElement(l, r), x.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = x.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(me)) {
					let t = u[o++], n = i.getAttribute(e).split(h), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ie : r[1] === "?" ? Le : r[1] === "@" ? Re : C
					}), i.removeAttribute(e);
				} else e.startsWith(h) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (De.test(i.tagName)) {
					let e = i.textContent.split(h), t = e.length - 1;
					if (t > 0) {
						i.textContent = fe ? fe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], _e()), x.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], _e());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === he) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(h, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += h.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = g.createElement("template");
		return n.innerHTML = e, n;
	}
};
function S(e, t, n = e, r) {
	if (t === y) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ve(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = S(e, i._$AS(e, t.values), i, r)), t;
}
var Pe = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? g).importNode(t, !0);
		x.currentNode = r;
		let i = x.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Fe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ze(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = x.nextNode(), a++);
		}
		return x.currentNode = g, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Fe = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = S(this, e, t), ve(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== y && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? be(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== b && ve(this._$AH) ? this._$AA.nextSibling.data = e : this.T(g.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ne.createElement(je(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Pe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ae.get(e.strings);
		return t === void 0 && Ae.set(e.strings, t = new Ne(e)), t;
	}
	k(t) {
		ye(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(_e()), this.O(_e()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = de(e).nextSibling;
			de(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, C = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = b, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = b;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = S(this, e, t, 0), a = !ve(e) || e !== this._$AH && e !== y, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = S(this, r[n + o], t, o), s === y && (s = this._$AH[o]), a ||= !ve(s) || s !== this._$AH[o], s === b ? e = b : e !== b && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ie = class extends C {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === b ? void 0 : e;
	}
}, Le = class extends C {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== b);
	}
}, Re = class extends C {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = S(this, e, t, 0) ?? b) === y) return;
		let n = this._$AH, r = e === b && n !== b || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== b && (n === b || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ze = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		S(this, e);
	}
}, Be = {
	M: me,
	P: h,
	A: he,
	C: 1,
	L: Me,
	R: Pe,
	D: be,
	V: S,
	I: Fe,
	H: C,
	N: Le,
	U: Re,
	B: Ie,
	F: ze
}, Ve = ue.litHtmlPolyfillSupport;
Ve?.(Ne, Fe), (ue.litHtmlVersions ??= []).push("3.3.3");
var He = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Fe(t.insertBefore(_e(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ue = globalThis, w = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = He(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return y;
	}
};
w._$litElement$ = !0, w.finalized = !0, Ue.litElementHydrateSupport?.({ LitElement: w });
var We = Ue.litElementPolyfillSupport;
We?.({ LitElement: w }), (Ue.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Ge = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", Ke = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", qe = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Je = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z", Ye = "M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z", Xe = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Ze = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", Qe = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", $e = "M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z", et = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", tt = "M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z", nt = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", rt = "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z", it = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", at = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", ot = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", st = "M7,10L12,15L17,10H7Z", ct = "M19,13H5V11H19V13Z", lt = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", ut = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z", dt = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", ft = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", pt = "M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5M19 19H5V5H19V19M6 15H18V17H6M6 11H18V13H6M6 7H18V9H6V7Z", mt = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", ht = "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z", gt = "M8 17.85C8 19.04 7.11 20 6 20S4 19.04 4 17.85C4 16.42 6 14 6 14S8 16.42 8 17.85M16.46 12V10.56L18.46 9.43L20.79 10.05L21.31 8.12L19.54 7.65L20 5.88L18.07 5.36L17.45 7.69L15.45 8.82L13 7.38V5.12L14.71 3.41L13.29 2L12 3.29L10.71 2L9.29 3.41L11 5.12V7.38L8.5 8.82L6.5 7.69L5.92 5.36L4 5.88L4.47 7.65L2.7 8.12L3.22 10.05L5.55 9.43L7.55 10.56V12H2V13H22V12H16.46M9.5 12V10.56L12 9.11L14.5 10.56V12H9.5M20 17.85C20 19.04 19.11 20 18 20S16 19.04 16 17.85C16 16.42 18 14 18 14S20 16.42 20 17.85M14 20.85C14 22.04 13.11 23 12 23S10 22.04 10 20.85C10 19.42 12 17 12 17S14 19.42 14 20.85Z", _t = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", vt = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", yt = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", bt = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", xt = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z", St = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13", Ct = {
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
	"stock.approx_date": "ca. {date}",
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
	"stocktake.empty": "Laut Bestand liegt hier nichts. Gescannte Packungen erscheinen unter „Nicht im Bestand“."
}, wt = {
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
	"valid.ean": "An EAN has 8 to 14 digits.",
	"valid.ean_taken": "This EAN already belongs to “{name}”.",
	"valid.days": "Please enter a whole number from 0.",
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
	"recipes.printed": "Recipe printed.",
	"settings.section.meals": "Meals",
	"settings.meals.hint": "From when a meal applies. Sets the current meal, e.g. for the action “Print planned recipe” without a meal. Before the first start time the last meal of the day before still applies.",
	"settings.meals.from": "from {time}",
	"settings.meals.edit": "Edit meal start times",
	"valid.time": "Please give a time.",
	"common.print": "Print",
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
	"stocktake.empty": "According to the stock nothing is stored here. Scanned packages show under “Not in stock”."
}, Tt = {
	de: Ct,
	en: wt
}, Et = wt;
function Dt(e) {
	let t = e ?? "";
	Et = Tt[t] ?? Tt[t.split("-")[0]] ?? wt;
}
function T(e, t) {
	let n = Et[e] ?? wt[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var E = s`
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
`, Ot = s`
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
`, kt = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, At = class extends w {
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
		kt(e) && e.target.close();
	}
	render() {
		return v`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? v`<p>${this.o.message}</p>` : b} ${this.o.body ?? b}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${T("common.cancel")}
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
		this.styles = [E, s`
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
customElements.define("home-inventory-confirm", At);
function D(e) {
	return new Promise((t) => {
		let n = document.createElement("home-inventory-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var jt = (e, t) => D({
	title: T("common.delete_name", { name: e }) + "?",
	message: t,
	action: T("common.delete"),
	danger: !0
}), O = (e) => v`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${ke`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Mt = !1;
async function Nt(e, t) {
	if (!t?.()) return e.close();
	if (!Mt) {
		Mt = !0;
		try {
			await D({
				title: T("common.discard"),
				action: T("common.discard_ok")
			}) && e.close();
		} finally {
			Mt = !1;
		}
	}
}
var Pt = (e) => (t) => {
	kt(t) && Nt(t.target, e);
}, Ft = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), Nt(t.currentTarget, e));
};
async function It(e, t) {
	let n = e.currentTarget;
	if (n.hasAttribute("data-busy")) return e.preventDefault();
	n.setAttribute("data-busy", "");
	try {
		await t(e);
	} finally {
		n.removeAttribute("data-busy");
	}
}
var k = (e) => v`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${Pt(e.dirty)}
    @keydown=${Ft(e.dirty)}
    @cancel=${Ft(e.dirty)}
  >
    <form @submit=${(t) => It(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? v`<p class="error" role="alert">${e.error}</p>` : b}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${T("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
        >
          ${e.submit?.label ?? T("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, Lt = (e, t) => v`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${T(e ? "common.collapse" : "common.expand")}
    title=${T(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${O(e ? Xe : Qe)}
  </button>`;
function Rt(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var A = (e) => v`${e.onAdd ? v`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            title=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${O(ft)}
          </button>` : b}${e.onMove ? v`<button
            class="icon-btn"
            data-testid=${`${e.testid}-move`}
            aria-label=${e.moveLabel ?? ""}
            title=${e.moveLabel ?? ""}
            @click=${e.onMove}
          >
            ${O(_t)}
          </button>` : b}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${T("common.edit_name", { name: e.name })}
      title=${T("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${O(dt)}
    </button>
    ${e.onDelete ? v`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${T("common.delete_name", { name: e.name })}
            title=${T("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${O(nt)}
          </button>` : b}`, j = (e, t, n = !1) => e ? v`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : b, M = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, zt = (e) => e >= "2000-01-01" && e <= "2099-12-31", N = (e, t) => e || !!t && !zt(t), P = (e) => e === "" ? null : Number(e), Bt = /^https?:\/\//i, Vt = [
	"best_before",
	"use_by",
	"guide"
], Ht = (e) => !!e?.user?.is_admin;
async function F(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var Ut = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), I = (e) => e.callWS({ type: "home_inventory/master_data" }), Wt = (e, t, n) => e.callWS({
	type: "home_inventory/save",
	table: t,
	data: n
}), Gt = (e, t) => e.callWS({
	type: "home_inventory/defaults_save",
	data: t
}), Kt = (e, t, n, r = {}) => e.callWS({
	type: "home_inventory/delete",
	table: t,
	row_id: n,
	...r
}), qt = (e, t, n) => e.callWS({
	type: "home_inventory/move_location",
	location_id: t,
	move_to: n
}), Jt = (e, t, n) => e.callWS({
	type: "home_inventory/delete_impact",
	table: t,
	row_id: n
}), Yt = (e, t, n) => e.callWS({
	type: "home_inventory/product_type_add",
	name: t,
	parent_id: n
}), Xt = (e, t) => e.callWS({
	type: "home_inventory/lookup",
	code: t
}), Zt = (e, t, n = !1) => e.callWS({
	type: "home_inventory/search",
	query: t,
	online: n
}), Qt = (e, t) => e.callWS({
	type: "home_inventory/book_in",
	...t
}), $t = (e, t) => e.callWS({
	type: "home_inventory/book_out",
	...t
}), en = (e, t) => e.callWS({
	type: "home_inventory/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), tn = (e, t) => e.callWS({
	type: "home_inventory/stock_edit",
	...t
}), L = (e, t) => e.callWS({
	type: "home_inventory/stock",
	product_id: t
}), nn = (e) => e.callWS({ type: "home_inventory/products" }), rn = (e, t) => e.callWS({
	type: "home_inventory/product_save",
	data: t
}), an = (e) => e.callWS({ type: "home_inventory/label_config" }), on = (e, t) => e.callWS({
	type: "home_inventory/print_labels",
	...t
}), sn = (e) => e.callWS({ type: "home_inventory/print_shopping_list" }), cn = (e, t, n) => e.callWS({
	type: "home_inventory/print_recipe",
	recipe_id: t,
	servings: n
}), ln = (e, t, n) => e.callWS({
	type: "home_inventory/print_plan",
	start: t,
	days: n
}), un = (e, t) => e.callWS({
	type: "home_inventory/book_out_label",
	code: t
}), dn = (e) => e.callWS({ type: "home_inventory/recipes" }), fn = (e, t) => e.callWS({
	type: "home_inventory/expiring_recipes",
	...t == null ? {} : { days: t }
}), pn = (e, t, n) => e.callWS({
	type: "home_inventory/recipe_availability",
	recipe_id: t,
	servings: n
}), mn = (e, t) => e.callWS({
	type: "home_inventory/recipe_save",
	data: t
}), R = (e) => e.canning_product_id != null, hn = (e, t) => e.callWS({
	type: "home_inventory/recipe_import",
	...t
}), gn = (e, t) => e.callWS({
	type: "home_inventory/recipe_ai_check",
	draft: t,
	language: e.language
}), _n = (e, t) => e.callWS({
	type: "home_inventory/product_ai_check",
	draft: t,
	language: e.language
}), vn = (e, t, n) => e.callWS({
	type: "home_inventory/unit_add",
	name: t,
	symbol: n
}), yn, bn = (e) => yn = e, z = (e) => !yn || yn.includes(e), xn = {}, Sn = (e) => xn = e ?? {}, B = (e) => !!xn[e], Cn = (e) => e?.locale?.language ?? e?.language, V = (e, t) => new Intl.DateTimeFormat(Cn(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), H = (e, t) => new Intl.NumberFormat(Cn(e)).format(t), wn = (e, t, n, r, i = t) => T(new Intl.PluralRules(Cn(e)).select(t) === "one" ? n : r, { n: i }), Tn = (e, t) => wn(e, Number(t), "settings.day", "settings.days", t), U = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), W = (e, t, n = "") => `${H(e, t)} ${n ?? ""}`.trim(), En = (e, t) => wn(e, t, "recipes.portion", "recipes.portions");
//#endregion
//#region src/inherit.ts
function G(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function K(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n],
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: T("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: T("settings.inherit_from", { name: a ?? "" })
	};
}
var Dn = (e, t) => v`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${O(mt)}${T("common.reset")}
  </button>`;
function On(e) {
	let t = e.own ?? null;
	return v`<span class="inh">
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
        ${e.dflt ? T("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : T(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => v`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? b : Dn(e.testid, () => e.onChange(null))}
  </span>`;
}
function kn(e) {
	let t = e.own ?? null;
	return v`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? T("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(P(n));
	}}
    />
    ${e.suffix ? v`<span class="detail">${e.suffix}</span>` : b}
    ${t == null ? b : Dn(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var An = class extends w {
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
				let { id: t } = await Yt(this.hass, this.creating, e), n = await I(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await F(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = Rt(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => U(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: G(this.categories, e.id)
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
		return v`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? T("book.choose") : G(this.categories, this.value)}
        </span>
        ${O(st)}
      </button>
      <dialog @click=${Pt()}>
        <h2>
          ${this.creating ? T("book.choose_parent", { name: this.creating }) : T("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${T("book.filter")}
          placeholder=${T("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !n && !this.creating ? v`<li>
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
                </li>` : b}
          ${e.map(({ c: e, depth: t, label: r }) => {
			let i = !n && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return v`<li style="padding-left: ${t * 20}px">
              ${i ? Lt(a, () => this.toggle(e.id)) : n ? b : v`<span class="chev"></span>`}
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
        ${r ? v`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(t)}
              >
                ${T("book.create_category", { name: t })}
              </button>` : e.length ? b : v`<p class="empty">${T("book.no_hits")}</p>`}
        ${this.failure ? v`<p class="error" role="alert">${this.failure}</p>` : b}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${T("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${T("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-category-picker", An);
//#endregion
//#region src/settings-format.ts
function jn(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function Mn(e, t) {
	return t === "default" ? T("settings.inherit_default") : T("settings.inherit_from", { name: jn(e, t) });
}
function Nn(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: t === "food" || t === "frozen_goods" ? null : e.defaults[t],
		source: "default"
	};
}
function q(e, t, n, r) {
	if (n === "food") return T(r === 0 ? "settings.food.no" : "settings.food.yes");
	if (n === "frozen_goods") return T(r === 1 ? "settings.frozen_goods.yes" : "settings.frozen_goods.no");
	if (r == null) return T("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : T("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? T("common.none_dash") : n === "expiry_type" ? T(`settings.expiry.${r}`) : Tn(t, r);
}
//#endregion
//#region src/min-stock.ts
function Pn(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = T("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = T("valid.packages")), t;
}
function Fn(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return v`<label>
      <span class="lbl" title=${T("tip.min_stock")}>${T("settings.category.min_stock")}</span>
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
          aria-label=${T("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${Ut(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => v`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${j(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${T("tip.min_packages")}>${T("settings.category.min_packages")}</span>
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
        <span class="detail">${T("book.packages")}</span>
      </span>
      ${j(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${T("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-model.ts
var In = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null,
	meals: null
}, Ln = {
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
		"frozen_goods"
	]
}, Rn = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, zn = [
	"warn_days",
	"shelf_days",
	"opened_days",
	"frozen_days"
], Bn = class extends w {
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
		for (let i of Ln[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = T("valid.duplicate")) : n.name = T("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = T("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = T("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = T("valid.days")), t.shelf_days != null && !(Number.isInteger(t.shelf_days) && t.shelf_days >= 1) && (n.shelf_days = T("valid.shelf_days")), t.opened_days != null && !(Number.isInteger(t.opened_days) && t.opened_days >= 1) && (n.opened_days = T("valid.shelf_days")), t.frozen_days != null && !(Number.isInteger(t.frozen_days) && t.frozen_days >= 1) && (n.frozen_days = T("valid.shelf_days")), Object.assign(n, Pn(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Ln[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Wt(this.hass, t, r);
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t, n) {
		return v`<label><span class="lbl" title=${n ?? b}>${e}</span>${t}</label>`;
	}
	text(e) {
		return v`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${j(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return v`<span class="num"
        ><input
          type="number"
          step=${zn.includes(e) ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value;
			this.set(e, P(n));
		}}
        />${n ? v`<span class="detail">${n}</span>` : b}</span
      >${zn.includes(e) ? b : j(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return v`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" .selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => v`<option value=${e} .selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? b : v`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${O(mt)}${T("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = Nn(i, e, this.edit.d.parent_id), o = q(i, this.hass, e, a.value), s = Mn(i, a.source), c = zn.includes(e) ? this.numInput(e, T("common.default", {
			value: o,
			source: s
		}), T("common.days_unit")) : this.select(e, n, T("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, v`<span class="inh">${c}${this.reset(e)}</span
        >${j(this.errs[e], e)}`, T(`tip.${e}`));
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return v`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = v`${this.field(T("common.name"), this.text("name"))}
        <label class="check"
          ><input
            type="checkbox"
            data-testid="location-freezer"
            .checked=${!!n.freezer}
            @change=${(e) => this.set("freezer", +!!e.target.checked)}
          />${T("settings.location.freezer")}</label
        >
        ${j(T("settings.location.freezer_hint"), "location-freezer", !0)}`;
		else if (t === "unit") {
			let e = Ut(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = v`${this.field(T("common.name"), this.text("name"))}${this.field(T("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${T("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${T("settings.unit.recipe_only")}</label
        >
        ${j(T("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(T("settings.unit.base"), this.select("base_unit_id", e, T("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(T("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? Nn(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = v`${this.field(T("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${T("settings.category.parent")}</span>
          <home-inventory-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${T("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></home-inventory-category-picker>
        </div>
        ${this.inh("unit_id", T("settings.category.unit"), Ut(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", T("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", T("settings.category.expiry_type"), Vt.map((e) => [e, T(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", T("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", T("settings.category.shelf_days"), [])}
        ${z("opened") ? this.inh("opened_days", T("settings.category.opened_days"), []) : ""}
        ${this.inh("food", T("settings.food.label"), [[1, T("settings.food.yes")], [0, T("settings.food.no")]])}
        ${z("frozen") ? v`${this.inh("frozen_days", T("settings.category.frozen_days"), [])}
              ${this.inh("frozen_goods", T("settings.frozen_goods.label"), [[0, T("settings.frozen_goods.no")], [1, T("settings.frozen_goods.yes")]])}` : ""}
        ${Fn({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? v`<p class="detail">${T("settings.category.off_tags", { tags: t.join(", ") })}</p>` : b}`;
		}
		let c = () => Ln[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? jn(i, n.parent_id) : "";
		return k({
			title: n.id ? T("common.edit_name", { name: r.name }) : l ? T("settings.category.add_sub_to", { name: l }) : T(Rn[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [E];
	}
};
customElements.define("home-inventory-settings-dialog", Bn);
//#endregion
//#region src/defaults-view.ts
var Vn = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"],
	["shelf_days", "settings.category.shelf_days"],
	["opened_days", "settings.category.opened_days"],
	["frozen_days", "settings.category.frozen_days"]
], Hn = {
	opened_days: "opened",
	frozen_days: "frozen"
}, Un = (e) => !Hn[e] || z(Hn[e]), Wn = class extends w {
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
		return t === null || !Number.isInteger(t) || t < 0 ? T("valid.days") : void 0;
	}
	shelfError(e, t = "shelf_days") {
		let n = e[t];
		return n !== null && !(Number.isInteger(n) && n >= 1) ? T("valid.shelf_days") : void 0;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!(this.warnError(t) || this.shelfError(t) || this.shelfError(t, "opened_days") || this.shelfError(t, "frozen_days"))) try {
			await Gt(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? v`<p class="detail intro">${T("settings.defaults.hint")}</p>
      <ul>
        ${Vn.filter(([e]) => Un(e)).map(([t, n]) => v`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${T(n)}</span>
                <span class="detail">${q(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${A({
			testid: "default",
			name: T(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : v``;
	}
	select(e, t) {
		let n = this.d;
		return v`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => v`<option value=${t ?? ""} .selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return v`<dialog></dialog>`;
		let n = this.warnError(t), r = this.shelfError(t), i = this.shelfError(t, "opened_days"), a = this.shelfError(t, "frozen_days");
		return k({
			title: T("settings.defaults.edit"),
			body: v`<label>
          <span class="lbl" title=${T("tip.unit_id")}>${T("settings.category.unit")}</span>
          ${this.select("unit_id", Ut(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${T("tip.default_location_id")}
            >${T("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, T("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${T("tip.expiry_type")}
            >${T("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", Vt.map((e) => [e, T(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${T("tip.warn_days")}>${T("settings.category.warn_days")}</span>
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
				this.set("warn_days", P(t));
			}}
            />
            ${T("common.days_unit")}
          </span>
          ${j(n, "default-warn_days")}
        </label>
        ${this.optionalDays(t, "shelf_days", r)}
        ${z("opened") ? this.optionalDays(t, "opened_days", i) : ""}
        ${z("frozen") ? this.optionalDays(t, "frozen_days", a) : ""}`,
			error: this.error,
			invalid: !!n || !!r || !!i || !!a,
			dirty: () => Vn.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	optionalDays(e, t, n) {
		return v`<label>
      <span class="lbl" title=${T(`tip.${t}`)}>${T(`settings.category.${t}`)}</span>
      <span class="num">
        <input
          data-testid=${`default-${t}`}
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          aria-invalid=${!!n}
          .value=${String(e[t] ?? "")}
          @input=${(e) => this.set(t, P(e.target.value))}
        />
        ${T("common.days_unit")}
      </span>
      ${j(n, `default-${t}`)}
    </label>`;
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-defaults", Wn);
//#endregion
//#region src/meal-times-view.ts
var Gn = /^([01][0-9]|2[0-3]):[0-5][0-9]$/, Kn = class extends w {
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
			this.error = await F(this.hass, e);
		}
	}
	async open() {
		this.error = "", this.d = [...this.starts], await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), !this.d.some((e) => !Gn.test(e))) try {
			await this.hass.callWS({
				type: "home_inventory/meal_times_save",
				starts: this.d
			}), this.starts = [...this.d], this.renderRoot.querySelector("dialog")?.close();
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		if (!this.starts) return v`${this.error ? v`<p class="error">${this.error}</p>` : ""}`;
		let e = this.d;
		return v`<p class="detail intro">${T("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map((e, t) => v`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${T(`plan.slot.${t}`)}</span>
                <span class="detail">${T("settings.meals.from", { time: e })}</span>
              </button>
              ${A({
			testid: "meal-time",
			name: T(`plan.slot.${t}`),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${e ? k({
			title: T("settings.meals.edit"),
			body: v`${e.map((t, n) => v`<label>
                    <span class="lbl">${T(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!Gn.test(t)}
                      .value=${t}
                      @input=${(t) => this.d = e.map((e, r) => r === n ? t.target.value : e)}
                    />
                    ${j(Gn.test(t) ? void 0 : T("valid.time"), `meal-time-${n}`)}
                  </label>`)}`,
			error: this.error,
			invalid: e.some((e) => !Gn.test(e)),
			dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		}) : v`<dialog></dialog>`}`;
	}
	static {
		this.styles = [E];
	}
};
customElements.define("home-inventory-meal-times", Kn);
//#endregion
//#region src/move-location.ts
var qn = class extends w {
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
			let t = (await Jt(this.hass, "location", e.id)).groups.find((e) => e.kind === "delete.stock");
			this.batches = t?.count ?? 0, this.packages = t?.packages ?? 0;
		} catch (e) {
			this.error = await F(this.hass, e);
		}
		this.from = e, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("select")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.target && this.batches) try {
			await qt(this.hass, this.from.id, Number(this.target)), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("moved"));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.from;
		return e ? k({
			title: T("settings.location.move_name", { name: e.name }),
			body: v`<p class="detail" data-testid="move-summary">
          ${this.batches ? T("settings.location.move_summary", {
				batches: this.batches,
				packages: this.packages,
				name: e.name
			}) : T("settings.location.move_empty")}
        </p>
        <label>
          <span class="lbl">${T("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e) => this.target = e.target.value}
          >
            <option value="">${T("settings.location.move_choose")}</option>
            ${this.locations.filter((t) => t.id !== e.id).map((e) => v`<option value=${e.id}>${e.name}</option>`)}
          </select>
          ${j(this.target ? void 0 : T("valid.location"), "move-target")}
        </label>`,
			error: this.error,
			invalid: !this.target || !this.batches,
			submit: {
				label: T("settings.location.move_action"),
				testid: "move-save"
			},
			dirty: () => !!this.target,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.from = void 0
		}) : v`<dialog></dialog>`;
	}
	static {
		this.styles = [E, s`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("home-inventory-move-location", qn);
//#endregion
//#region src/delete-flow.ts
var Jn = 5, Yn = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = T(r, { n });
	return i === r ? T("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, Xn = (e) => {
	let t = e.names.length - Jn;
	return e.names.slice(0, Jn).join(", ") + (t > 0 ? T("delete.more", { n: t }) : "");
};
async function Zn(e, t, n, r) {
	let i = n === "location" || n === "unit" ? T(`settings.${n}.delete_hint`) : void 0, a = await Jt(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "home_inventory",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await jt(r.name, i) ? (await Kt(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = v`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => v`<li>
            <span class="kind">${Yn(n, e)}</span>
            <span class="names">${Xn(e)}</span>
            ${e.packages ? v`<span class="names">${T("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? v`<label>
            <span class="lbl">${T("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => v`<option value=${e.id}>${T("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${T("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await D({
		title: T("common.delete_name", { name: r.name }) + "?",
		message: i ?? T("delete.affected"),
		body: c,
		action: T(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await Kt(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var Qn = class extends w {
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
		return Object.keys(In).filter((e) => e !== "meals" || z("plan"));
	}
	get sec() {
		return this.sections.includes(this.section ?? "") ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await I(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await F(this.hass, e);
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
		this.expanded = Rt(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => q(t, this.hass, n, e[n]));
		if (e.shelf_days != null && n.push(T("settings.category.shelf_short", { days: q(t, this.hass, "shelf_days", e.shelf_days) })), e.opened_days != null && z("opened") && n.push(T("settings.category.opened_short", { days: q(t, this.hass, "opened_days", e.opened_days) })), e.food === 0 && n.push(T("settings.food.no")), z("frozen") && (e.frozen_days != null && n.push(T("settings.category.frozen_short", { days: q(t, this.hass, "frozen_days", e.frozen_days) })), e.frozen_goods === 1 && n.push(T("settings.frozen_goods.yes"))), e.min_stock != null) {
			let r = q(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(T("settings.category.min", { value: `${H(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(T("settings.category.min", { value: T("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = In[e];
		return v`
      <nav aria-label=${T("settings.nav")}>
        ${this.sections.map((t) => v`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${T(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? v`<p class="error" role="alert">${this.pageError}</p>` : b}
      ${this.data ? t ? v`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${T(Rn[t])}
                  </button>
                </div>
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : e === "meals" ? v`<home-inventory-meal-times .hass=${this.hass}></home-inventory-meal-times>` : v`<home-inventory-defaults
                  .hass=${this.hass}
                  .data=${this.data}
                  @home-inventory-saved=${this.load}
                ></home-inventory-defaults>` : b}
      <home-inventory-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @home-inventory-saved=${this.load}
      ></home-inventory-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? b : v`<p class="empty">${T("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = b, a = b) {
		return v`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" data-testid="settings-row" @click=${n}>
        <span>${e}</span>${t ? v`<span class="detail">${t}</span>` : b}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return A({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "location" ? {
				onMove: () => this.renderRoot.querySelector("home-inventory-move-location").open(t),
				moveLabel: T("settings.location.move_name", { name: t.name })
			} : {},
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: T("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await Zn(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await F(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return v`<ul>
        ${e.map((e) => this.row(e.name, e.freezer ? T("settings.location.freezer") : "", () => this.open("location", e), 0, b, this.actions("location", e)))}
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
				t.recipe_only ? T("settings.unit.recipe_only") : "",
				n ? `= ${H(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? T("settings.unit.no_conversion") : t.is_count ? T("settings.unit.count") : ""
			].filter(Boolean).join(" · ");
		};
		return v`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, b, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return v`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? Lt(r, () => this.toggle(e.id)) : v`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-settings", Qn);
//#endregion
//#region src/stock-data.ts
function $n(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => U(e.join(" "), a), s = /* @__PURE__ */ new Map();
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
		G(i?.categories, e.category_id)
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
var er = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${M()}T00:00`)) / 864e5);
function tr(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = er(e.expires_on);
	return i < 0 ? e.expiry_type === "use_by" ? "expired" : "past" : i <= (r ?? Number(t?.warn_days ?? K(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function nr(e, t, n, r) {
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
function J(e, t, n, r) {
	return e ? v`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? v`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${T("stock.undo")}
          </button>` : b}
    ${r ?? b}
  </p>` : b;
}
var rr = s`
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
async function ir(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await L(e.hass);
	} catch (t) {
		e.undo = n, e.error = await F(e.hass, t);
	}
}
var ar = (e, t, n) => ir(e, async () => {
	let { taken: r } = await $t(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), or = (e) => {
	let t = e.undo;
	if (t) return ir(e, async () => {
		await en(e.hass, t.taken);
	});
}, sr = (e, t, n, r) => {
	let i = T("stock.take_one", { name: t });
	return v`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => ar(e, t, n)}
  >
    ${O(lt)}
  </button>`;
}, cr = (e, t) => J(e.undo ? T("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => or(e)), t), lr = (e, t) => e.callWS({
	type: "home_inventory/open_package",
	...t
}), ur = (e, t) => e.callWS({
	type: "home_inventory/open_label",
	code: t
}), dr = (e, t) => e.callWS({
	type: "home_inventory/open_undo",
	booking_id: t
}), fr = (e, t) => e.callWS({
	type: "home_inventory/freeze",
	...t
}), pr = (e, t) => e.callWS({
	type: "home_inventory/frozen_undo",
	booking_id: t
}), mr = (e, t) => e.dispatchEvent(new CustomEvent("home-inventory-print-label", {
	detail: {
		id: t.batch_id,
		name: t.name,
		packages: 1
	},
	bubbles: !0,
	composed: !0
}));
function hr(e, t, n, r, i) {
	return t ? J(t.expires_on ? T("stock.opened_until", {
		name: t.name,
		date: V(e, t.expires_on)
	}) : T("stock.opened_one", { name: t.name }), n, i, v`<button type="button" class="undo" data-testid=${`${i}-label`} @click=${r}>
      ${T("stock.opened_label")}
    </button>`) : b;
}
async function gr(e, t) {
	let n = e.opened;
	e.error = "", e.opened = void 0;
	try {
		e.opened = await t(), e.stock = await L(e.hass);
	} catch (t) {
		e.opened = n, e.error = await F(e.hass, t);
	}
}
var _r = (e) => {
	let t = e.opened;
	if (t) return gr(e, () => dr(e.hass, t.booking_id).then(() => void 0));
}, vr = (e, t, n) => {
	if (n.opened_on) return b;
	let r = T("stock.open_one", { name: t });
	return v`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${r}
    title=${r}
    @click=${() => gr(e, () => lr(e.hass, {
		product_id: n.product_id,
		batch_id: n.batch_id,
		location_id: n.location_id
	}))}
  >
    ${O(ut)}
  </button>`;
}, yr = (e) => v`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${T("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${T("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => v`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
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
        ${O($e)}${T("stocktake.start")}
      </button>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${T("stock.with_empty")}
    </label>`, br = s`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, xr = s`
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
  .past {
    color: var(--warning-color);
    font-weight: 500;
  }
`;
//#endregion
//#region src/frozen-action.ts
function Sr(e, t) {
	if (!e || !t) return !1;
	let n = e.categories.find((e) => e.id === t.category_id)?.effective;
	return !n || n.food.value === 0 || n.frozen_goods.value === 1 ? !1 : (t.frozen_days ?? n.frozen_days.value) != null;
}
function Cr(e, t, n, r) {
	let i = !!e?.locations.find((e) => e.id === n.location_id)?.freezer, a = !!n.frozen_on;
	if (!a && (i || !Sr(e, t))) return b;
	let o = T(a ? "frozen.thaw_title" : "frozen.freeze_title", { name: n.name });
	return v`<button
    class="icon-btn"
    data-testid=${a ? "stock-batch-thaw" : "stock-batch-freeze"}
    aria-label=${o}
    title=${o}
    @click=${() => r(a)}
  >
    ${O(a ? gt : ht)}
  </button>`;
}
function wr(e, t, n, r) {
	if (!t) return b;
	let i = t.result;
	return J(T(t.thaw ? "frozen.thawed" : "frozen.frozen", {
		name: i.name,
		location: i.location,
		date: i.expires_on ? V(e, i.expires_on) : ""
	}), n, "frozen", t.thaw ? void 0 : v`<button type="button" class="undo" data-testid="frozen-label" @click=${r}>
          ${T("stock.opened_label")}
        </button>`);
}
async function Tr(e) {
	let t = e.frozen;
	if (t) {
		e.frozen = void 0, e.error = "";
		try {
			await pr(e.hass, t.result.booking_id), e.stock = await L(e.hass);
		} catch (n) {
			e.frozen = t, e.error = await F(e.hass, n);
		}
	}
}
//#endregion
//#region src/frozen-dialog.ts
var Er = class extends w {
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
		return /^\d+$/.test(e.packages.trim()) && t >= 1 && t <= this.row.packages ? void 0 : T("frozen.packages_range", { n: this.row.packages });
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (this.errors(t)) return;
		let n = this.row;
		try {
			let e = await fr(this.hass, {
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
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return v`<dialog></dialog>`;
		let t = this.errors(e), n = this.locations.filter((e) => !!e.freezer !== this.thaw), r = this.row.name;
		return k({
			title: T(this.thaw ? "frozen.thaw_title" : "frozen.freeze_title", { name: r }),
			body: v`<label>
          <span class="lbl">${T("book.packages")}</span>
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
          ${j(t, "frozen-packages")}
        </label>
        <label>
          <span class="lbl">${T("frozen.to")}</span>
          <select
            data-testid="frozen-to"
            @change=${(t) => this.d = {
				...e,
				to: t.target.value
			}}
          >
            <option value="" .selected=${e.to === ""}>
              ${T(this.thaw ? "frozen.to_default_thaw" : "frozen.to_default_freeze")}
            </option>
            ${n.map((t) => v`<option value=${t.id} .selected=${e.to === String(t.id)}>${t.name}</option>`)}
          </select>
        </label>`,
			error: this.error,
			invalid: !!t,
			submit: {
				label: T(this.thaw ? "frozen.thaw" : "frozen.freeze"),
				testid: "frozen-submit"
			},
			dirty: () => e.packages !== "1" || e.to !== "",
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-frozen-dialog", Er);
//#endregion
//#region src/product-fields.ts
var Dr = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
}), Or = (e) => Object.fromEntries([
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
function kr(e) {
	let t = {};
	return e.name.trim() || (t.name = T("valid.required")), e.category_id == null && !e.new_type && (t.category = T("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = T("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = T("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = T("valid.packages")), t;
}
function Ar(e, t, n, r = {}, i) {
	return v`<label>
      <span class="lbl">${T("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${j(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${T("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${T("book.category")}</span>
      <home-inventory-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></home-inventory-category-picker>
      ${j(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${T("tip.content")}>${T("book.content")}</span>
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
		n("content_amount", P(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${T("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${T("common.none_dash")}</option>
          ${Ut(e?.units ?? [], t.content_unit_id).map((e) => v`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${j(r.content, "content")}
    <label>
      <span class="lbl" title=${T("tip.product_min_packages")}>${T("products.min_packages")}</span>
      ${kn({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: T("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${j(r.min_packages, "min-packages")}
    </label>`;
}
function jr(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${H(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/product-dialog.ts
var Mr = [
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
	"min_packages"
], Nr = class extends w {
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
		let t = kr(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = T("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = T("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = T("valid.days")), e.shelf_days != null && !(Number.isInteger(e.shelf_days) && e.shelf_days >= 1) && (t.shelf_days = T("valid.shelf_days")), e.opened_days != null && !(Number.isInteger(e.opened_days) && e.opened_days >= 1) && (t.opened_days = T("valid.shelf_days")), e.frozen_days != null && !(Number.isInteger(e.frozen_days) && e.frozen_days >= 1) && (t.frozen_days = T("valid.shelf_days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of Mr) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await rn(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return v`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => K(this.md, e.category_id, t);
		return k({
			title: T("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: v`${Ar(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${T("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${j(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl" title=${T("tip.default_location_id")}
            >${T("settings.category.location")}</span
          >
          ${On({
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
          <span class="lbl" title=${T("tip.expiry_type")}
            >${T("settings.category.expiry_type")}</span
          >
          ${On({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: Vt.map((e) => [e, T(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${T("tip.warn_days")}>${T("settings.category.warn_days")}</span>
          ${kn({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => Tn(this.hass, e),
				suffix: T("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${j(t.warn_days, "warn-days")}
        </label>
        <label>
          <span class="lbl" title=${T("tip.shelf_days")}>${T("settings.category.shelf_days")}</span>
          ${kn({
				testid: "shelf-days",
				own: e.shelf_days,
				dflt: n("shelf_days"),
				format: (e) => Tn(this.hass, e),
				suffix: T("common.days_unit"),
				invalid: !!t.shelf_days,
				onChange: (e) => this.set("shelf_days", e)
			})}
          ${j(t.shelf_days, "shelf-days")}
        </label>
        ${z("opened") ? v`<label>
                <span class="lbl" title=${T("tip.opened_days")}
                  >${T("settings.category.opened_days")}</span
                >
                ${kn({
				testid: "opened-days",
				own: e.opened_days,
				dflt: n("opened_days"),
				format: (e) => Tn(this.hass, e),
				suffix: T("common.days_unit"),
				invalid: !!t.opened_days,
				onChange: (e) => this.set("opened_days", e)
			})}
                ${j(t.opened_days, "opened-days")}
              </label>` : ""}
        ${z("frozen") ? v`<label>
                <span class="lbl" title=${T("tip.frozen_days")}
                  >${T("settings.category.frozen_days")}</span
                >
                ${kn({
				testid: "frozen-days",
				own: e.frozen_days,
				dflt: n("frozen_days"),
				format: (e) => Tn(this.hass, e),
				suffix: T("common.days_unit"),
				invalid: !!t.frozen_days,
				onChange: (e) => this.set("frozen_days", e)
			})}
                ${j(t.frozen_days, "frozen-days")}
              </label>` : ""}`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => Mr.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-product-dialog", Nr);
//#endregion
//#region src/batch-dialog.ts
var Pr = class extends w {
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
		return N(e.dateBad, e.expires_on) && (t.expires = T("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = T("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await tn(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return v`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return k({
			title: T("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: v`<label>
          <span class="lbl">
            ${T("book.expires_on_type", { type: T(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? j(t.expires, "batch-expires") : v`<span class="detail">${T("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${T("book.packages")}</span>
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
          ${t.packages ? j(t.packages, "batch-packages") : v`<span class="detail">${T("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-batch-dialog", Pr);
//#endregion
//#region src/label-print.ts
function Fr(e, t, n, r) {
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
async function Ir(e, t, n) {
	if (n > 2 && !await D({
		title: T("label.confirm_many", { n }),
		action: T("label.submit")
	})) return null;
	let r = await on(e, {
		batch_id: t,
		count: n
	});
	return "printed" in r ? r.printed : (Fr(r.image, r.count, r.width_mm, r.height_mm), 0);
}
//#endregion
//#region src/label-dialog.ts
var Lr = class extends w {
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
			let e = await Ir(this.hass, this.batch.id, Number(this.count));
			if (e === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-printed", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return v`<dialog></dialog>`;
		let t = this.invalid();
		return k({
			title: T("label.title", { name: e.name }),
			body: v`<label>
        <span class="lbl">${T("label.count")}</span>
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
        ${t ? j(T("valid.label_count", { max: 20 }), "label-count") : v`<span class="detail">${T("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: T("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-label-dialog", Lr);
//#endregion
//#region src/api-purchase.ts
var Rr = (e, t) => e.callWS({
	type: "home_inventory/receipt_read",
	text: t
}), zr = (e, t, n) => e.callWS({
	type: "home_inventory/receipt_book",
	store: t,
	items: n
}), Br = [
	"day",
	"week",
	"month"
], Vr = [
	0,
	1,
	2,
	3,
	4
], Y = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, X = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Z = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), Hr = (e, t) => Y(Z(X(e), t)), Ur = (e) => Z(e, -((e.getDay() + 6) % 7));
function Wr(e, t) {
	return e === "day" ? [t, Z(t, 1)] : e === "week" ? [Ur(t), Z(Ur(t), 7)] : [Ur(new Date(t.getFullYear(), t.getMonth(), 1)), Z(Ur(new Date(t.getFullYear(), t.getMonth() + 1, 0)), 7)];
}
var Gr = (e, t, n) => e === "month" ? new Date(t.getFullYear(), t.getMonth() + n, 1) : Z(t, n * (e === "week" ? 7 : 1)), Kr = (e) => e?.locale?.language;
//#endregion
//#region src/receipt-row.ts
function qr(e) {
	let t = {};
	return e.choice === null && (t.choice = T("receipt.choose")), e.choice === "skip" || (e.choice === "new" && !e.name.trim() && (t.name = T("valid.required")), e.choice === "new" && e.category_id == null && (t.category = T("valid.required")), Number.isInteger(e.packages) && e.packages >= 1 && e.packages <= 9999 || (t.packages = T("valid.packages")), N(e.dateBad, e.expires_on) && (t.expires = T("valid.date"))), t;
}
function Jr(e, t) {
	let n = typeof e.choice == "number" ? e.item.candidates.find((t) => t.id === e.choice)?.shelf_days : e.choice === "new" ? K(t, e.category_id, "shelf_days")?.value : void 0;
	return n ? Hr(M(), Number(n)) : "";
}
function Yr(e) {
	let { r: t, i: n } = e, r = qr(t), i = `r${n}`, a = t.choice === null ? "" : String(t.choice), o = !t.expires_on && Jr(t, e.md) ? T("receipt.guess_hint") : "";
	return v`<li data-testid="receipt-row">
    <div class="text">${t.item.text}</div>
    <label>
      <span class="lbl">${T("receipt.product")}</span>
      <select
        data-testid="receipt-product"
        aria-invalid=${!!r.choice}
        .value=${a}
        @change=${(t) => {
		let n = t.target.value;
		e.set({ choice: n === "new" || n === "skip" ? n : Number(n) });
	}}
      >
        <option value="" disabled ?selected=${a === ""}>${T("receipt.choose_option")}</option>
        ${t.item.candidates.map((e) => v`<option value=${e.id} ?selected=${a === String(e.id)}>
              ${e.brand ? `${e.name} (${e.brand})` : e.name}
            </option>`)}
        <option value="new" ?selected=${a === "new"}>${T("receipt.new")}</option>
        <option value="skip" ?selected=${a === "skip"}>${T("receipt.skip")}</option>
      </select>
      ${j(r.choice, `${i}-product`)}
    </label>
    ${t.choice === "new" ? v`<label>
              <span class="lbl">${T("common.name")}</span>
              <input
                data-testid="receipt-name"
                aria-invalid=${!!r.name}
                .value=${t.name}
                @input=${(t) => e.set({ name: t.target.value })}
              />
              ${j(r.name, `${i}-name`)}
            </label>
            <div>
              <span class="lbl">${T("book.category")}</span>
              <home-inventory-category-picker
                .categories=${e.md?.categories ?? []}
                .value=${t.category_id}
                .hass=${e.hass}
                @change=${(t) => e.set({ category_id: t.detail })}
              ></home-inventory-category-picker>
              ${j(r.category, `${i}-category`)}
            </div>` : b}
    ${t.choice === "skip" ? b : v`<div class="pair">
            <label>
              <span class="lbl">${T("book.packages")}</span>
              <input
                type="number"
                min="1"
                max="9999"
                data-testid="receipt-packages"
                aria-invalid=${!!r.packages}
                .value=${String(t.packages)}
                @input=${(t) => e.set({ packages: Number(t.target.value) })}
              />
              ${j(r.packages, `${i}-packages`)}
            </label>
            <label>
              <span class="lbl">${T("book.expires_on")}</span>
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
              ${r.expires ? j(r.expires, `${i}-expires`) : v`<span class="detail">${o}</span>`}
            </label>
          </div>`}
  </li>`;
}
var Xr = s`
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
async function Zr(t, n) {
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
async function Qr(e, t) {
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = document.createElement("canvas");
	return i.width = Math.round(n.width * r), i.height = Math.round(n.height * r), i.getContext("2d").drawImage(n, 0, 0, i.width, i.height), n.close(), i;
}
var $r = async (e, t = 2e3) => (await Qr(e, t)).toDataURL("image/jpeg", .85), ei = new URL(
	/* @vite-ignore */
	"vendor/opencv.js",
	import.meta.url
).href, ti;
function ni() {
	return ti ??= new Promise((e, t) => {
		let n = document.createElement("script");
		n.src = ei, n.async = !0, n.onerror = () => {
			ti = void 0, t(/* @__PURE__ */ Error("opencv"));
		}, n.onload = () => {
			let n = Date.now(), r = () => {
				let i = window.cv;
				i?.Mat ? e({ cv: i }) : Date.now() - n > 6e4 ? t(/* @__PURE__ */ Error("opencv")) : setTimeout(r, 100);
			};
			r();
		}, document.head.append(n);
	}), ti;
}
var ri = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
function ii(e) {
	let t = (t) => [...e].sort((e, n) => t(e) - t(n)), n = t((e) => e.x + e.y), r = t((e) => e.y - e.x);
	return [
		n[0],
		r[0],
		n[3],
		r[3]
	];
}
var ai = (e, t) => [
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
function oi(e, t) {
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
				t.delete(), c = ii(i), l = r;
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
function si(e, t, n) {
	let [r, i, a, o] = n, s = Math.max(1, Math.round(Math.max(ri(r, i), ri(o, a)))), c = Math.max(1, Math.round(Math.max(ri(r, o), ri(i, a)))), l = e.imread(t), u = e.matFromArray(4, 1, e.CV_32FC2, n.flatMap((e) => [e.x, e.y])), d = e.matFromArray(4, 1, e.CV_32FC2, [
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
var ci = .01, li = class extends w {
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
		let n = ci * Math.max(this.image.width, this.image.height), r = {
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
		return v`<div class="frame">
      ${this.image}
      <svg
        viewBox="0 0 ${e} ${t}"
        preserveAspectRatio="none"
        @pointermove=${(e) => this.dragging >= 0 && this.move(this.dragging, this.at(e))}
        @pointerup=${() => this.dragging = -1}
        @pointercancel=${() => this.dragging = -1}
      >
        <polygon points=${this.quad.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
        ${this.quad.map((e, t) => ke`<circle
              cx=${e.x}
              cy=${e.y}
              r=${n}
              tabindex="0"
              role="slider"
              data-testid="scan-corner"
              aria-label=${T(`scan.corner_${t}`)}
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
customElements.define("home-inventory-scan-corners", li);
//#endregion
//#region src/camera-dialog.ts
var ui = 480, di = 1e3, fi = 200;
function pi(e, t, n, r) {
	let i = Math.max(1, Math.max(t, n) / r), a = document.createElement("canvas");
	return a.width = Math.round(t / i), a.height = Math.round(n / i), a.getContext("2d").drawImage(e, 0, 0, a.width, a.height), {
		canvas: a,
		f: i
	};
}
var mi = (e, t) => e?.map((e) => ({
	x: e.x * t,
	y: e.y * t
})) ?? null, hi = class extends w {
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
					let { canvas: t, f: n } = pi(e, e.videoWidth, e.videoHeight, ui);
					this.live = mi(oi(this.cv, t), n);
				}
				this.timer = window.setTimeout(this.tick, fi);
			}
		}, this.closed = () => {
			this.stop(), this.still = void 0, this.finish();
		}, this.scan = !1, this.quad = [], this.live = null, this.video = {
			w: 0,
			h: 0
		}, this.running = this.ready = !1, this.error = "", this.busy = !1;
	}
	async show(e, t) {
		this.done?.(void 0), this.scan = e, this.still = t, this.live = null, this.error = "", this.busy = !1, this.quad = t ? ai(t.width, t.height) : [];
		let n = new Promise((e) => this.done = e);
		return await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), e && ni().then(({ cv: e }) => {
			this.cv = e, this.ready = !0, this.still && this.findOutline();
		}, () => this.error = T("camera.no_scan")), n;
	}
	take(e) {
		let t = this.show(e);
		return this.updateComplete.then(() => this.start()), t;
	}
	edit(e) {
		return this.show(!0, e);
	}
	async start() {
		if (!navigator.mediaDevices?.getUserMedia) return void (this.error = T("scan.https"));
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
			this.stop(), this.error = T("scan.no_camera");
			return;
		}
		this.scan && (this.timer = window.setTimeout(this.tick, fi));
	}
	findOutline() {
		let e = this.still, { canvas: t, f: n } = pi(e, e.width, e.height, di);
		this.quad = mi(oi(this.cv, t), n) ?? ai(e.width, e.height);
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
		if (t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0), this.stop(), !this.scan) return this.finish(await $r(t));
		this.quad = this.live ?? ai(t.width, t.height), this.still = t;
	}
	async apply(e) {
		this.busy = !0;
		let t = this.still, n = e ? si(this.cv, t, this.quad).toDataURL("image/png") : await $r(t, 3e3);
		this.busy = !1, this.finish(n);
	}
	liveView() {
		let { w: e, h: t } = this.video;
		return v`<div class="frame">
        <video muted playsinline></video>
        ${this.live && e ? v`<svg viewBox="0 0 ${e} ${t}" preserveAspectRatio="none">
                <polygon points=${this.live.map((e) => `${e.x},${e.y}`).join(" ")}></polygon>
              </svg>` : b}
      </div>
      ${this.scan ? v`<p class="detail">${T("camera.live_hint")}</p>` : b}`;
	}
	cornerView() {
		return v`<home-inventory-scan-corners
        .image=${this.still}
        .quad=${this.quad}
        @change=${(e) => this.quad = e.detail}
      ></home-inventory-scan-corners>
      <p class="detail">${T("camera.corners_hint")}</p>`;
	}
	actions() {
		return this.still ? v`<button
          type="button"
          data-testid="camera-uncut"
          ?disabled=${this.busy}
          @click=${() => this.apply(!1)}
        >
          ${T("camera.uncut")}
        </button>
        <button
          type="button"
          class="primary"
          data-testid="camera-apply"
          ?disabled=${this.busy || !this.ready}
          @click=${() => this.apply(!0)}
        >
          ${T("camera.apply")}
        </button>` : v`<button
      type="button"
      class="primary"
      data-testid="camera-capture"
      ?disabled=${!this.running}
      @click=${() => this.capture()}
    >
      ${T("camera.capture")}
    </button>`;
	}
	render() {
		return v`<dialog data-testid="camera" @close=${this.closed} @click=${Pt()}>
      <h2>${T(this.scan ? "camera.title_scan" : "camera.title")}</h2>
      ${this.still ? this.cornerView() : this.liveView()}
      ${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${T("common.cancel")}</button>
        ${this.actions()}
      </div>
    </dialog>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-camera", hi);
//#endregion
//#region src/receipt-import.ts
var gi = 3e3, _i = class extends w {
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
		this.image = this.rows = void 0, this.store = this.status = this.error = "", this.active = !0, an(this.hass).then((e) => this.prefill = e.prefill_expiry, () => void 0), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	guess(e) {
		return Jr(e, this.md);
	}
	set(e, t) {
		let n = [...this.rows], r = n[e], i = {
			...r,
			...t
		};
		this.prefill && !("expires_on" in t) && r.expires_on === this.guess(r) && (i.expires_on = this.guess(i)), n[e] = i, this.rows = n;
	}
	invalid() {
		return this.rows ? !!this.status || this.rows.some((e) => Object.keys(qr(e)).length) : !this.image || !!this.status;
	}
	async read() {
		let e = this.hass;
		this.status = T("receipt.ocr", { percent: "0" });
		try {
			let t = await Zr(this.image, (e) => {
				this.status = T("receipt.ocr", { percent: String(Math.round(e * 100)) });
			});
			if (!t.trim()) throw Error(T("receipt.no_text"));
			this.status = T("receipt.ai");
			let n = await Rr(e, t.slice(0, 8e3));
			if (!n.items.length) throw Error(T("receipt.no_items"));
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
			this.error = t instanceof Error ? t.message : await F(e, t);
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
		this.status = T("receipt.booking");
		try {
			let t = await zr(this.hass, this.store.trim(), e);
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("booked", { detail: t.booked }));
		} catch (e) {
			this.error = await F(this.hass, e);
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
			r = await Qr(n, gi);
		} catch {
			this.error = T("receipt.photo_invalid");
			return;
		}
		let i = await this.camera().edit(r);
		i && (this.image = i);
	}
	pickStep() {
		return v`<button
        type="button"
        class="scan"
        data-testid="receipt-scan"
        ?disabled=${!!this.status}
        @click=${() => this.scanReceipt()}
      >
        ${O(Ye)} ${T("receipt.scan")}
      </button>
      <label>
        <span class="lbl">${T("receipt.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="receipt-photo"
          ?disabled=${!!this.status}
          @change=${(e) => this.pickFile(e)}
        />
      </label>
      ${this.image ? v`<img
              class="preview"
              data-testid="receipt-preview"
              src=${this.image}
              alt=${T("receipt.preview")}
            />` : b}
      <p class="detail">${T("receipt.photo_hint")}</p>`;
	}
	reviewStep(e) {
		return v`<label>
        <span class="lbl">${T("receipt.store")}</span>
        <input
          data-testid="receipt-store"
          maxlength="100"
          .value=${this.store}
          @input=${(e) => this.store = e.target.value}
        />
        <span class="detail">${T("receipt.store_hint")}</span>
      </label>
      <ul class="rows">
        ${e.map((e, t) => Yr({
			r: e,
			i: t,
			md: this.md,
			hass: this.hass,
			set: (e) => this.set(t, e)
		}))}
      </ul>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.status ? v`<div class="busy" role="status" data-testid="receipt-busy">
          <progress aria-label=${this.status}></progress><span>${this.status}</span>
        </div>` : b, t = this.rows?.filter((e) => e.choice !== "skip").length ?? 0;
		return v`${k({
			title: T("receipt.title"),
			body: v`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${e}`,
			error: this.error,
			invalid: this.invalid(),
			submit: this.rows ? {
				label: T("receipt.book", { count: String(t) }),
				testid: "receipt-book"
			} : {
				label: T("receipt.read"),
				testid: "receipt-read"
			},
			dirty: () => !!(this.image || this.rows),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [
			E,
			Xr,
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
customElements.define("home-inventory-receipt-import", _i);
//#endregion
//#region src/scanner.ts
var vi = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function yi() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: vi.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-Dml86taW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...vi] });
}
var bi = class extends w {
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
			this.error = T("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = T("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await yi();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = T("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = T("scan.no_camera");
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
		return v`<dialog data-testid="scanner" @close=${this.stop} @click=${Pt()}>
      <h2>${T("scan.title")}</h2>
      ${this.error ? v`<p class="error" role="alert">${this.error}</p>` : v`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${T("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [E, s`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("home-inventory-scanner", bi);
//#endregion
//#region src/booking-scan.ts
var xi = class extends w {
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
		return v`
      <form class="scan" @submit=${this.submit}>
        <slot name="before"></slot>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${T("book.input")}
          placeholder=${T("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${T("book.camera")}
          @click=${() => this.renderRoot.querySelector("home-inventory-scanner")?.open()}
        >
          ${O(qe)}<span>${T("book.camera")}</span>
        </button>
      </form>
      <home-inventory-scanner @scan=${this.scanned}></home-inventory-scanner>
    `;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-booking-scan", xi);
//#endregion
//#region src/booking-in-fields.ts
function Si(e, t, n, r, i) {
	let a = !n.expires && e.expires_on && e.expires_on < M();
	return v`<label>
    <span class="lbl"
      >${r ? T("book.expires_on_type", { type: T(`settings.expiry.${r}`) }) : T("book.expires_on")}</span
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
    ${n.expires || a ? v`${j(n.expires, "expires")}${a ? j(T("valid.past"), "expires", !0) : ""}` : v`<span class="detail" data-testid="shelf-hint"
            >${i ? T(e.expires_on ? "book.shelf_hint" : "book.guess_hint", {
		days: String(i.value),
		source: i.source
	}) : T("book.no_date_hint")}</span
          >`}
  </label>`;
}
function Ci(e, t, n, r, i, a) {
	return v`<label>
      <span class="lbl">${T("book.location")}</span>
      ${On({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${j(i.location, "location")}
    </label>
    ${t.id ? b : v`<label class="check" title=${T("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${T("book.make_default")}
          </label>`}`;
}
function wi(e, t, n) {
	return v`<label class="check" title=${T("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${T("label.print")}
  </label>`;
}
//#endregion
//#region src/booking-pick.ts
var Ti = "auto", Ei = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), Di = (e, t) => Ei(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Oi(e, t, n, r) {
	let i = (e, t) => v`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return v`<fieldset>
    <legend class="lbl">${T("book.which")}</legend>
    ${i(Ti, T("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, v`<span
          >${t.expires_on ? V(e, t.expires_on) : T("book.no_date")}${t.opened_on ? ` · ${T("stock.opened")}` : ""}
          · ${t.location} <span class="detail">${T("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var ki = s`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, Ai = [
	"name",
	"category_id",
	"content_amount",
	"content_unit_id"
], ji = async (e, t, n) => {
	try {
		let r = await _n(e, {
			...Object.fromEntries(Ai.map((e) => [e, t[e]])),
			brand: t.brand,
			ean: t.ean,
			off_json: t.off_json
		});
		if (r.status !== "changes") return { state: { kind: r.status === "ok" ? "ok" : "none" } };
		let i = n(), a = Ai.filter((e) => e in r && i[e] === t[e]);
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
			message: await F(e, t)
		} };
	}
}, Mi = async (e, t, n) => {
	let { id: r } = await Yt(e, t.new_type.name, t.new_type.parent_id);
	return I(e).then((e) => n.dispatchEvent(new CustomEvent("master", { detail: e })), () => void 0), {
		...t,
		category_id: r,
		new_type: void 0
	};
}, Ni = (e, t, n) => {
	let r = [];
	if ("name" in n && r.push(n.name || "–"), "category_id" in n && r.push(t?.categories.find((e) => e.id === n.category_id)?.name ?? "–"), "content_amount" in n || "content_unit_id" in n) {
		let i = t?.units.find((e) => e.id === n.content_unit_id)?.symbol ?? "";
		r.push(n.content_amount == null ? "–" : W(e, n.content_amount, i));
	}
	return r.join(", ");
}, Pi = (e, t, n, r) => {
	switch (e.kind) {
		case "running": return v`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${T("book.ai.running")}></progress>
        <span>${T("book.ai.running")}</span>
      </div>`;
		case "ok": return v`<p class="ai" role="status" data-testid="product-ai-status">
        ${T("book.ai.ok")}
      </p>`;
		case "failed": return v`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${e.message}
      </p>`;
		case "changed": return v`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${T("book.ai.changed", {
			reason: e.reason,
			before: Ni(t, n, e.before)
		})}</span
        >
        ${e.newType ? v`<span data-testid="product-ai-new-type"
                >${T("book.ai.new_type", {
			name: e.newType.name,
			parent: n?.categories.find((t) => t.id === e.newType.parent_id)?.name ?? "–"
		})}</span
              >` : b}
        <button type="button" data-testid="product-ai-undo" @click=${() => r(e.before)}>
          ${T("book.ai.undo")}
        </button>
      </div>`;
		default: return b;
	}
}, Fi = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: Ti,
	print: null
}), Ii = (e) => e?.category_id ?? e?.new_type?.parent_id ?? null, Li = null, Ri = class extends w {
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
		}), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Fi(), this.ai = { kind: "none" };
	}
	willUpdate(e) {
		if (e.has("product")) {
			this.draft = this.product, this.f = {
				...Fi(),
				expires_on: this.prefill() ? this.proposal() : ""
			}, this.initial = JSON.stringify(this.f), this.ai = { kind: "none" };
			let e = this.product;
			this.hass && this.mode === "in" && e && !e.id && e.off_json && B("ai_product_check") && this.check(e), this.hass && this.mode === "in" && an(this.hass).then((e) => {
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
		let t = await ji(this.hass, e, () => this.draft);
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
			source: T("book.from_product")
		};
		let n = K(this.md, Ii(this.draft), e);
		if (n) return n;
		if (e === "default_location_id" && Li != null) return {
			value: Li,
			source: T("book.last_used")
		};
	}
	prefill() {
		return !!this.labels?.prefill_expiry || this.dflt("expiry_type")?.value === "guide";
	}
	proposal() {
		let e = this.mode === "in" ? this.dflt("shelf_days") : void 0;
		return e ? Hr(M(), Number(e.value)) : "";
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (!t.id && t.new_type && t.category_id == null) {
			let e = await this.run(() => Mi(n, t, this));
			if (!e) return;
			t = this.draft = e;
		}
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : Or(t);
			o && this.f.makeDefault && e !== K(this.md, Ii(t), "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => Qt(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (Li = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => Ir(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = Ei(this.stock, this.f.pick), i = await this.run(() => $t(n, {
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
		let s = T(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${T("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return b;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? v`<h2>${T("book.title_out", { name: e.name })}</h2>
            <p class="empty" data-testid="no-stock">${T("book.no_stock")}</p>
            <div class="actions">${this.cancelButton()}</div>` : b;
		let n = this.mode === "out" ? Di(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return v`<form class="book" @submit=${this.submit}>
      ${t ? v`<h2>
              ${T("book.title_out", { name: e.name })}${e.brand ? v` <span class="detail">${e.brand}</span>` : b}
            </h2>` : v`<h2>${T("book.title_in")}</h2>
              ${Pi(this.ai, this.hass, this.md, (e) => (this.ai = { kind: "none" }, this.setFields(e)))}
              <p class="summary" data-testid="summary">
                ${jr(this.md, e, G(this.md?.categories, e.category_id), this.hass) || T("book.new_product")}
                ${e.id ? b : v`<span class="detail">${T("book.is_new")}</span>`}
              </p>`}
      ${t ? Oi(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : v`${e.id ? b : Ar(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${Si(this.f, this.set, r, this.dflt("expiry_type")?.value, !this.f.expires_on || this.f.expires_on === this.proposal() ? this.dflt("shelf_days") : void 0)}`}
      <label>
        <span class="lbl">${T("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? b}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${j(r.packages, "packages")}
      </label>
      ${t ? b : v`${Ci(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${wi(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        ${this.cancelButton()}
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${T(`book.submit_${this.mode}`)}
        </button>
      </div>
    </form>`;
	}
	cancelButton() {
		return v`<button
      type="button"
      data-testid="cancel"
      @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
    >
      ${T("common.cancel")}
    </button>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? kr(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (N(i, r) && (t.expires = T("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = T("valid.location")));
		let a = this.mode === "out" ? Di(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = T("valid.packages") : a != null && n > a && (t.packages = T("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			E,
			ki,
			Ot,
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
customElements.define("home-inventory-booking-form", Ri);
//#endregion
//#region src/booking-hits.ts
function zi(e, t) {
	return v`
    ${e.length ? b : v`<p class="empty">${T("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => v`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    <div class="actions after">
      <button type="button" data-testid="cancel" @click=${t.cancel}>${T("common.cancel")}</button>
      ${t.more ? v`${t.online || !B("off_lookup") ? b : v`<button
                      data-testid="search-online"
                      ?disabled=${t.busy}
                      @click=${t.searchOnline}
                    >
                      ${T("book.search_online")}
                    </button>`}
              <button data-testid="new-product" @click=${t.create}>
                ${T("book.new_product")}
              </button>` : b}
    </div>
  `;
}
//#endregion
//#region src/booking-modes.ts
var Bi = [
	["search", at],
	["in", ft],
	["out", ct],
	["open", ut]
], Vi = (e, t) => v`<div slot="before" class="modes" role="group" aria-label=${T("stock.mode")}>
    ${Bi.filter(([e]) => e !== "open" || z("opened")).map(([n, r]) => v`<button
          type="button"
          data-testid=${`mode-${n}`}
          aria-pressed=${n === e}
          aria-label=${T(`stock.mode_${n}`)}
          title=${T(`stock.mode_${n}`)}
          @click=${() => t(n)}
        >
          ${O(r)}
        </button>`)}
  </div>`, Hi = s`
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
`, Ui = (e, t) => {
	t !== void 0 && (e.message = t), e.dispatchEvent(new CustomEvent("booked")), e.focusInput();
};
async function Wi(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(() => un(e.hass, t));
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.undo = r.taken, Ui(e, T("book.done_label", {
			name: r.name,
			where: r.location
		}));
	}
}
async function Gi(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.opened = r, Ui(e);
	}
}
async function Ki(e) {
	let { undo: t, opened: n } = e;
	if (e.undo = e.opened = void 0, await e.run(() => n ? dr(e.hass, n.booking_id) : en(e.hass, t)) === void 0) return void (e.undo = t, e.opened = n);
	Ui(e, T(n ? "book.undone_open" : "book.undone"));
}
var qi = (e) => e.opened ? hr(e.hass, e.opened, () => Ki(e), () => mr(e, e.opened), "open") : J(e.message, e.undo && (() => Ki(e))), Ji = /^\d{8,14}$/, Yi = /^PTRY:/i, Xi = class extends w {
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
			this.reset(), this.message = T("receipt.done", { count: String(e.detail) }), this.undo = void 0, this.dispatchEvent(new CustomEvent("booked"));
		}, this.mode = "search", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = this.opened = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, I(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
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
		this.error = this.hass ? await F(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass || this.mode === "search") return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = this.opened = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, Yi.test(e)) {
			let n = e.replace(Yi, "");
			return this.mode === "open" ? Gi(this, () => ur(t, n)) : Wi(this, n);
		}
		if (Ji.test(e)) {
			let r = await this.run(() => Xt(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "in" ? this.choose(Dr({ ean: e })) : void (this.error = T("book.unknown"));
		}
		let r = await this.run(() => Zt(t, e));
		r && n === this.seq && (this.hits = r, this.mode !== "in" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => Zt(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => Xt(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode !== "in" && !e.id) return void (this.error = T("book.unknown"));
		if (this.mode === "open") return Gi(this, () => lr(this.hass, { product_id: e.id }));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => L(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("home-inventory-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		let e = !!(this.hits || this.product), t = this.error ? v`<p class="error" role="alert" data-testid="error">${this.error}</p>` : b;
		return v`
      <home-inventory-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      >
        ${Vi(this.mode, (e) => this.setMode(e))}
      </home-inventory-booking-scan>
      ${qi(this)} ${e ? b : t}
      ${this.mode === "in" && B("receipt_import") ? v`<button
              type="button"
              class="receipt"
              data-testid="receipt-import"
              @click=${() => this.renderRoot.querySelector("home-inventory-receipt-import").open()}
            >
              ${O(pt)} ${T("receipt.open")}
            </button>` : b}
      <home-inventory-receipt-import
        .hass=${this.hass}
        .md=${this.md}
        @booked=${this.receiptBooked}
      ></home-inventory-receipt-import>
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${Pt(this.dirty)}
        @keydown=${Ft(this.dirty)}
        @cancel=${Ft(this.dirty)}
      >
        ${this.hits ? v`<h2>${T(`book.pick_${this.mode}`)}</h2>
                ${zi(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(Dr({ name: this.query.trim() })),
			cancel: () => this.closed()
		})}` : b}
        ${this.renderForm()} ${e ? t : b}
      </dialog>
    `;
	}
	renderForm() {
		return this.product ? v`<home-inventory-booking-form
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
    ></home-inventory-booking-form>` : b;
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.dispatchEvent(new CustomEvent("booked")), this.focusInput();
	}
	static {
		this.styles = [
			E,
			rr,
			Hi,
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
customElements.define("home-inventory-booking", Xi);
//#endregion
//#region src/stock-view.ts
var Zi = class extends w {
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
			let [e, t] = await Promise.all([L(this.hass), nn(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await F(this.hass, e);
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
			this.md = await I(this.hass), await this.reload();
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	tree(e) {
		let t = $n(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return nr(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? this.renderCategory(e.id, e.name, e.packages, e.depth, e.open) : this.renderItem(e.item, e.depth, e.open));
	}
	renderCategory(e, t, n, r, i) {
		return v`<li style="padding-left:${r * 24}px">
      ${Lt(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${T("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return tr(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		let t = e.expires_on ? V(this.hass, e.expires_on) : T("stock.no_date");
		return e.expires_on && e.expiry_type === "guide" ? t = T("stock.approx_date", { date: t }) : e.expiry_guessed && (t = T("stock.guessed_date", { date: t })), e.opened_on && (t = T("stock.opened_on", {
			date: t,
			opened: V(this.hass, e.opened_on)
		})), e.frozen_on && (t = T("stock.frozen_on", {
			date: t,
			frozen: V(this.hass, e.frozen_on)
		})), e.charge ? T("stock.charge", {
			date: t,
			charge: e.charge
		}) : t;
	}
	toggle(e) {
		this.open = Rt(this.open, e);
	}
	render() {
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		return v`${v`<home-inventory-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e) => this.filter = e.detail}
      @booked=${this.saved}
      @home-inventory-print-label=${(e) => this.label(e.detail)}
    ></home-inventory-booking>`} ${e} ${this.stock ? this.list(this.stock) : b}`;
	}
	list(e) {
		let t = this.tree(this.filter.trim() !== "");
		return v`
      ${yr(this)} ${cr(this, "stock")}
      ${hr(this.hass, this.opened, () => _r(this), () => this.label({
			id: this.opened.batch_id,
			name: this.opened.name,
			packages: 1
		}), "opened")}
      ${wr(this.hass, this.frozen, () => Tr(this), () => this.label({
			id: this.frozen.result.batch_id,
			name: this.frozen.result.name,
			packages: 1
		}))}
      ${J(this.message, void 0, "label")}
      ${t.length ? v`<ul>
              ${t}
            </ul>` : v`<p class="empty">
              ${T(e.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
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
			this.frozen = e.detail, this.stock = await L(this.hass);
		}}
      ></home-inventory-frozen-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => this.message = e.detail ? T("label.printed", { n: e.detail }) : ""}
      ></home-inventory-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("home-inventory-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await Zn(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await F(this.hass, e);
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
		return v`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? Lt(n, i) : v`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : b}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, T("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? v` · <span class=${this.status(r)}>${this.date(r)}</span>` : b}
          </span>
        </button>
        ${A({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: Ht(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? v`<ul class="batches">
              ${e.batches.map((t) => v`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${T("book.count", { n: t.packages })}</span>
                    <span class="acts">
                      ${sr(this, e.name, t, "stock-batch-out")}
                      ${z("opened") && !t.frozen_on ? vr(this, e.name, t) : ""}
                      ${z("frozen") ? Cr(this.md, this.products.get(e.id), t, (e) => this.renderRoot.querySelector("home-inventory-frozen-dialog").open(t, e)) : ""}
                      <button
                        class="icon-btn"
                        data-testid="stock-batch-label"
                        aria-label=${T("label.print_name", { name: e.name })}
                        title=${T("label.print")}
                        @click=${() => this.printBatch(t, e.batches)}
                      >
                        ${O(vt)}
                      </button>
                      ${A({
			testid: "batch",
			name: `${e.name}, ${this.date(t)}`,
			onEdit: () => this.editBatch(t)
		})}
                    </span>
                  </li>`)}
            </ul>` : b}
    </li>`;
	}
	static {
		this.styles = [
			E,
			rr,
			br,
			xr
		];
	}
};
customElements.define("home-inventory-stock", Zi);
//#endregion
//#region src/expiry-recipes.ts
var Qi = class extends w {
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
			let t = await fn(this.hass, this.days);
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
		return this.list.length ? v`<h2>${T("expiry.recipes")}</h2>
      <ul>
        ${this.list.map((e) => v`<li>
              <button
                type="button"
                class="row"
                data-testid="expiry-recipe"
                @click=${() => this.open(e.recipe_id)}
              >
                <span>${e.name}</span>
                <span class="detail"
                  >${T("expiry.recipe_detail", {
			...e,
			products: e.products.join(", ")
		})}</span
                >
              </button>
            </li>`)}
      </ul>` : b;
	}
	static {
		this.styles = [E, s`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `];
	}
};
customElements.define("home-inventory-expiry-recipes", Qi);
//#endregion
//#region src/expiry-view.ts
var $i = class extends w {
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
				I(this.hass),
				L(this.hass),
				nn(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? T("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(Cn(this.hass), { numeric: "auto" }).format(er(e), "day");
	}
	render() {
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: tr(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return v`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${T("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${T("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${T("common.days_unit")}
        </span>
        ${j(t, "expiry-days")}
      </div>
      ${cr(this, "expiry")}
      ${r.length ? v`<ul>
              ${r.map(({ r: e, status: t }) => v`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}
                        >${e.expiry_type === "guide" ? T("stock.approx_date", { date: V(this.hass, e.expires_on) }) : V(this.hass, e.expires_on)}</span
                      >
                      <span class="detail"
                        >${this.relative(e.expires_on)}${e.expiry_guessed && e.expiry_type !== "guide" ? ` · ${T("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[
			e.brand,
			e.opened_on && T("stock.opened"),
			e.location
		].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${T("book.count", { n: e.packages })}</span>
                    ${sr(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : v`<p class="empty">${T("expiry.empty")}</p>`}
      ${z("recipes") ? v`<home-inventory-expiry-recipes
              .hass=${this.hass}
              .days=${n}
              .stock=${this.stock}
            ></home-inventory-expiry-recipes>` : b}
    `;
	}
	static {
		this.styles = [
			E,
			rr,
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
customElements.define("home-inventory-expiry", $i);
//#endregion
//#region node_modules/lit-html/directive.js
var Q = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ea = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ta = class {
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
}, { I: na } = Be, ra = (e) => e.strings === void 0, ia = {}, aa = (e, t = ia) => e._$AH = t, oa = ea(class extends ta {
	constructor(e) {
		if (super(e), e.type !== Q.PROPERTY && e.type !== Q.ATTRIBUTE && e.type !== Q.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!ra(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === y || t === b) return t;
		let n = e.element, r = e.name;
		if (e.type === Q.PROPERTY) {
			if (t === n[r]) return y;
		} else if (e.type === Q.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return y;
		} else if (e.type === Q.ATTRIBUTE && n.getAttribute(r) === t + "") return y;
		return aa(e), t;
	}
}), sa = (e) => e.callWS({ type: "home_inventory/shopping" }), ca = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), la = (e, t) => e.callWS({
	type: "home_inventory/shopping_add",
	...t
}), ua = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_item",
	item_id: t,
	...n
}), da = (e, t) => e.callWS({
	type: "home_inventory/shopping_item_delete",
	item_id: t
}), fa = (e) => e.callWS({ type: "home_inventory/shopping_recipes" }), pa = (e, t, n, r) => e.callWS({
	type: "home_inventory/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), ma = (e, t) => e.callWS({
	type: "home_inventory/shopping_recipe_remove",
	recipe_id: t
}), ha = (e, t, n) => e.callWS({
	type: "home_inventory/shopping_recipe_done",
	key: t,
	done: n
});
//#endregion
//#region src/shopping-text.ts
function ga(e, t) {
	let n = (t) => W(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : T("shopping.any"), T("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : T("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(T("book.count", { n: t.packages }));
	let i = T(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(T("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function _a(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : W(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: T(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? T("shopping.unknown", { n: r }) : ""
	};
}
//#endregion
//#region src/shopping-row-styles.ts
var va = s`
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
`, ya = 8, ba = class extends w {
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
			[this.md, this.products] = await Promise.all([I(this.hass), nn(this.hass)]);
		} catch (e) {
			this.error = await F(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return G(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = T("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, kr(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = T("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = T("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await ua(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await la(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await la(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await la(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await la(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return v`<li>
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
		if (!e) return b;
		let t = (t) => !!t && U(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, ya), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, ya), i = Dr({ name: e });
		return v`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, T("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", T("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${Ht(this.hass) ? this.hit("shopping-new-category", T("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : b}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return v`<label>
          <span class="lbl">${T("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? j(e.what, "shopping-what") : b}
        </label>
        ${this.hits()}`;
		let n = v`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${T("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? v`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : T("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? v`<p class="detail">${T("shopping.add.creates_product")} ${n}</p>
        ${Ar(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : v`<p class="detail">${T("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${T("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${j(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${T("settings.category.parent")}</span>
        <home-inventory-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${T("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></home-inventory-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors();
		return k({
			title: this.item ? T("common.edit_name", { name: this.item.name }) : T("shopping.add.title"),
			body: v`${this.item ? b : this.what(e)}
        <label>
          <span class="lbl">${T("shopping.add.packages")}</span>
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
				this.packages = P(t);
			}}
            />
            <span class="detail">${T("book.packages")}</span>
          </span>
          ${j(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-shopping-add", ba);
//#endregion
//#region src/shopping-recipe-dialog.ts
var xa = class extends w {
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
		let n = (await fa(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await pa(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: T("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await pa(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await F(this.hass, e);
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
		if (!this.active || !this.recipe) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return k({
			title: T("shopping.recipe.title", { name: this.recipe.name }),
			body: v`<label>
          <span class="lbl">${T("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!e.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e) => this.servings = P(e.target.value)}
          />
          ${j(e.servings, "shopping-recipe-servings")}
        </label>
        ${t.length ? v`<fieldset>
                <legend class="lbl">${T("shopping.recipe.optional")}</legend>
                ${t.map((e) => v`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(e.id)}
                        @change=${(t) => this.toggle(e, t.target.checked)}
                      />
                      ${e.text}
                    </label>`)}
              </fieldset>` : b}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: T("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-shopping-recipe-dialog", xa);
//#endregion
//#region src/shopping-recipes.ts
var Sa = class extends w {
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
			[this.list, this.recipes] = await Promise.all([fa(this.hass), dn(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await jt(e.name)) {
			try {
				await ma(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await F(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipe-dialog>
      ${this.list.length ? v`<h3>${T("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => v`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${T("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${En(this.hass, e.servings)}</span>
                      ${A({
			testid: "shopping-recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: () => this.removeEntry(e)
		})}
                    </li>`)}
              </ul>` : b}`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-shopping-recipes", Sa);
//#endregion
//#region src/shopping-view.ts
var Ca = class extends w {
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
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), an(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await sn(this.hass);
				this.note = T("shopping.printed", { n: e });
			} catch (e) {
				this.error = await F(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([sa(this.hass), I(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await ua(this.hass, e.id, { done: t }) : e.key ? await ha(this.hass, e.key, t) : await ca(this.hass, e, t);
		} catch (e) {
			return this.error = await F(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await jt(e.name)) {
			this.error = "";
			try {
				await da(this.hass, e.id);
			} catch (e) {
				return this.error = await F(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("home-inventory-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = ga(this.hass, e), i = _a(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return v`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${oa(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="line" title=${a}
            ><span class="name">${e.name}</span
            >${r ? v`<span class="amt"> – ${r}</span>` : b}</span
          >
          ${i.uses.length || i.unknown ? v`<span class="refs" data-testid="shopping-refs"
                  >${i.uses.map((e, t) => v`<span title=${e.title} aria-label=${e.title}
                        >${e.text}${t < i.uses.length - 1 ? ";" : ""}</span
                      >`)}${i.unknown ? v`<span class="unknown" title=${i.unknown}>${i.unknown}</span>` : b}</span
                >` : b}
        </span>
      </label>
      ${e.manual ? A({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : b}
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
				i.push(t ? this.row(t, o, !0) : v`<li
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
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		return !this.items || !this.cats ? e : v`${v`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${T("shopping.add.title")}
        </button>
        ${this.receipt ? v`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${T("shopping.print")}
              </button>` : b}
      </div>
      ${this.note ? v`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : b}
      <home-inventory-shopping-recipes
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipes>
      <home-inventory-shopping-add
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-add>`}
    ${this.items.length ? v`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : v`<p class="empty">${T("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			E,
			va,
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
customElements.define("home-inventory-shopping", Ca);
//#endregion
//#region src/form-fields.ts
var wa = (e) => v`<label>
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
        @input=${(t) => e.onChange(P(t.target.value))}
      />
      ${e.unit}
    </span>
    ${j(e.err, e.testid)}
  </label>`, Ta = (e) => v`<label>
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
    ${j(e.err, e.testid)}
  </label>`, $ = (e, t, n) => T(e === "drying" ? `drying.${t}` : `canning.${t}`, n), Ea = () => ["canning", "drying"].filter((e) => z(e)), Da = (e, t, n) => t === "drying" ? `${H(e, n / 60)} ${T("drying.hours_unit")}` : `${n} ${T("recipes.minutes_unit")}`, Oa = (e) => e.kind === "drying" ? wa({
	testid: e.testid,
	label: T("recipes.field.canning_minutes"),
	unit: T("drying.hours_unit"),
	step: "0.5",
	value: e.minutes == null ? null : e.minutes / 60,
	err: e.err && T("valid.drying_hours"),
	onChange: (t) => e.onChange(t == null ? null : Math.round(t * 60))
}) : wa({
	testid: e.testid,
	label: T("recipes.field.canning_minutes"),
	unit: T("recipes.minutes_unit"),
	value: e.minutes,
	err: e.err,
	onChange: e.onChange
}), ka = s`
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
`, Aa = 2e3, ja = (e) => e.flatMap((e) => [...e.section ? [{
	kind: "head",
	text: e.section
}] : [], {
	kind: "step",
	text: e.text
}]), Ma = (e) => (e ?? "").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean).map((e) => ({
	kind: "step",
	text: e
})), Na = (e) => {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		e && (r.kind === "head" ? n = e : (t.push({
			section: n,
			text: e
		}), n = null));
	}
	return t;
}, Pa = (e, t = (e) => e.text) => {
	let n = [];
	return e.forEach((e, t) => {
		(e.section || !n.length) && n.push({
			section: e.section,
			first: t,
			steps: []
		}), n[n.length - 1].steps.push(e);
	}), v`${n.map((e) => v`${e.section ? v`<h4 class="section">${e.section}</h4>` : b}
        <ol class="steps" start=${e.first + 1}>
          ${e.steps.map((n, r) => v`<li data-testid="recipe-step">${t(n, e.first + r)}</li>`)}
        </ol>`)}`;
}, Fa, Ia = class extends w {
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
		super.connectedCallback(), Fa ??= an(this.hass).then((e) => e.receipt, () => !1), Fa.then((e) => this.available = e);
	}
	async run() {
		this.busy = !0;
		try {
			await this.print(), this.note = this.done;
		} catch (e) {
			this.note = await F(this.hass, e);
		} finally {
			this.busy = !1;
		}
	}
	createRenderRoot() {
		return this;
	}
	render() {
		return this.available ? v`<button
        type="button"
        data-testid=${this.testid}
        ?disabled=${this.busy}
        @click=${() => this.run()}
      >
        ${T("common.print")}
      </button>
      ${this.note ? v`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >` : b}` : b;
	}
};
customElements.define("home-inventory-receipt-button", Ia);
//#endregion
//#region src/recipe-detail.ts
var La = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = W(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${T("recipes.approx", { what: W(e, i * a.factor / s.factor, s.symbol) })})`;
}, Ra = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? T("recipes.status.missing_plain") : T("recipes.status.missing", { what: W(e, t.missing ?? 0, n) });
		case "partial": return T("recipes.status.partial", {
			have: H(e, t.have ?? 0),
			need: H(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return T("recipes.status.unknown");
		case "skipped": return T("recipes.status.skipped");
		case "unmatched": return T("recipes.status.unmatched");
		default: return T("recipes.status.available");
	}
}, za = (e) => {
	let t = e.recipe;
	return v`<div class="detail-box">
    <label class="servings">
      <span class="lbl"
        >${R(t) ? $(t.canning_kind, "recipe_jars") : T("recipes.servings")}</span
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
      ${e.ingredients.map((n) => v`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[La(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? v`<span class="detail">${n.note}</span>` : b}
              ${n.optional ? v`<span class="detail">${T("recipes.optional")}</span>` : b}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${Ra(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      ${z("shopping") ? v`<button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
              ${T("recipes.to_shopping")}
            </button>` : b}
      ${R(t) ? v`<button type="button" data-testid="recipe-to-canning" @click=${e.onPlan}>
              ${$(t.canning_kind, "add_title")}
            </button>` : z("plan") ? v`<button type="button" data-testid="recipe-to-plan" @click=${e.onPlan}>
                ${T("recipes.to_plan")}
              </button>` : b}
      <home-inventory-receipt-button
        .hass=${e.hass}
        .print=${() => cn(e.hass, t.id, e.servings)}
        .done=${T("recipes.printed")}
        .testid=${"recipe-print"}
      ></home-inventory-receipt-button>
      ${t.shopping_servings != null && z("shopping") ? v`<span class="detail" data-testid="recipe-on-shopping"
              >${T("recipes.on_shopping", { what: En(e.hass, t.shopping_servings) })}</span
            >` : b}
    </p>
    ${R(t) ? v`<p data-testid="recipe-canning">
            ${T("canning.recipe_summary", {
		name: t.canning_product ?? "",
		jars: t.servings
	})}
            ${t.canning_temp == null ? "" : `· ${t.canning_temp} °C, ${Da(e.hass, t.canning_kind, t.canning_minutes ?? 0)}`}
          </p>` : b}
    ${t.steps.length ? v`<h3>${T("recipes.instructions")}</h3>
            ${Pa(t.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${e.onCook}>
                ${T("cook.open")}
              </button>
            </p>` : t.instructions ? v`<h3>${T("recipes.instructions")}</h3>
              <p class="text">${t.instructions}</p>` : b}
    ${t.source_url ? v`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${T("recipes.source")}</a
            >
          </p>` : b}
    ${t.image_url ? v`<img
            class="photo"
            src=${t.image_url}
            alt=${t.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />` : b}
  </div>`;
}, Ba = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), Va = (e) => e.map((e) => {
	let t = {};
	return Ba(e) || (!e.text.trim() && e.category_id == null && (t.text = T("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = T("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? T("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : T("valid.amount_pair"))), t;
}), Ha = (e, t, n, r) => ({
	name: e.trim() || "-",
	servings: t ?? 1,
	steps: Na(n),
	ingredients: r.map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.unit_id,
		text: e.text.slice(0, 200),
		note: e.note ?? null,
		line: e.line ?? null,
		learned: !!e.learned
	}))
}), Ua = (e, t, n, r, i) => {
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
	let s = JSON.stringify(r.steps) === JSON.stringify(n), c = e.steps && s ? ja(e.steps) : r.steps, l = {
		kind: "changed",
		ingredients: o,
		prevSteps: c === r.steps ? void 0 : r.steps
	};
	return {
		ingredients: a,
		steps: c,
		state: o || l.prevSteps ? l : { kind: "ok" }
	};
}, Wa = (e, t) => {
	switch (e.kind) {
		case "running": return v`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${T("recipes.ai.running")}></progress>
        <span>${T("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${t.onSkip}>
          ${T("recipes.ai.skip")}
        </button>
      </div>`;
		case "ok": return v`<p class="ai" role="status" data-testid="ai-status">${T("recipes.ai.ok")}</p>`;
		case "skipped": return v`<p class="ai" role="status" data-testid="ai-status">
        ${T("recipes.ai.skipped")}
      </p>`;
		case "failed": return v`<p class="ai error" role="alert" data-testid="ai-status">${e.message}</p>`;
		case "changed": return v`<div class="ai" role="status" data-testid="ai-status">
        ${e.ingredients ? v`<span
                >${e.ingredients === 1 ? T("recipes.ai.changed_one") : T("recipes.ai.changed_many", { n: e.ingredients })}</span
              >` : b}
        ${e.prevSteps ? v`<span>${T("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${t.onUndoSteps}>
                  ${T("recipes.ai.undo_steps")}
                </button>` : b}
      </div>`;
		default: return b;
	}
}, Ga = (e) => {
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
}, Ka = (e, t, n, r) => {
	let i = e.ai;
	if (!i) return b;
	let a = n.find((e) => e.id === i.beforeUnit)?.symbol ?? i.beforeHint, o = [i.cat ? i.beforeText : null, i.unit ? a : null].filter(Boolean);
	return v`<div class="orig" data-testid="ingredient-ai">
    ${e.new_type && i.cat ? T("recipes.ai.new_type", {
		name: e.new_type.name,
		parent: t.find((t) => t.id === e.new_type.parent_id)?.name ?? "–",
		reason: i.reason
	}) : T("recipes.ai.changed", {
		reason: i.reason,
		before: o.join(", ") || "–"
	})}
    <button type="button" data-testid="ingredient-ai-undo" @click=${() => r(Ga(e))}>
      ${T("recipes.ai.undo")}
    </button>
  </div>`;
}, qa = 8, Ja = class extends w {
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
			let t = await Zt(this.hass, e.trim());
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
			await Yt(this.hass, this.creating, e);
			let t = await I(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await F(this.hass, e);
		}
	}
	foods() {
		return this.categories.filter((e) => e.effective.food.value !== 0);
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.foods().filter((t) => U(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, qa);
	}
	hit(e) {
		let t = G(this.categories, e.cat.parent_id), n = [e.via ? T("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
		return v`<li>
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
		if (!e) return b;
		let t = this.categories.some((t) => t.name.toLocaleLowerCase() === e.toLocaleLowerCase());
		return v`<ul>
      ${this.hits(e).map((e) => this.hit(e))}
      ${t ? b : v`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => this.creating = e}
              >
                <span>${T("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? v`<div class="lbl">${T("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${T("shopping.add.change")}
          </button>
        </p>` : this.creating ? v`<div class="field">
        <span class="lbl">${T("recipes.ingredient.parent", { name: this.creating })}</span>
        <home-inventory-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></home-inventory-category-picker>
        ${this.failure ? v`<p class="error" role="alert">${this.failure}</p>` : b}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${T("common.cancel")}
        </button>
      </div>` : v`<label>
        <span class="lbl">${T("recipes.ingredient.text")}</span>
        ${this.text ? v`<span class="detail">${this.text} – ${T("recipes.ingredient.unmatched")}</span>` : b}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e) => this.input(e.target.value)}
        />
        ${j(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-ingredient-pick", Ja);
//#endregion
//#region src/unit-add-dialog.ts
var Ya = class extends w {
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
				let { id: e } = await vn(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await I(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await F(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : T("valid.required");
		return k({
			title: T("unit_add.title"),
			body: v`<label>
          <span class="lbl">${T("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${j(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${T("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: T("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [E];
	}
};
customElements.define("home-inventory-unit-add-dialog", Ya);
//#endregion
//#region src/recipe-ingredients.ts
var Xa = class extends w {
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
		return v`<li data-testid="ingredient-row" class="ing">
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
          <span class="lbl">${T("recipes.ingredient.amount")}</span>
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
			this.set(t, { amount: P(n) });
		}}
          />
        </label>
        <label>
          <span class="lbl">${T("recipes.ingredient.unit")}</span>
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
            <option value="" .selected=${e.unit_id == null}>${T("recipes.ingredient.none")}</option>
            ${this.units.map((t) => v`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${T("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${j(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? v`<div class="hintline">
              ${j(T("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${T("recipes.ingredient.unit_create")}
              </button>
            </div>` : b}
      ${e.line ? v`<div class="orig" data-testid="ingredient-line">
              ${T("recipes.ingredient.line", { line: e.line })}
            </div>` : b}
      ${Ka(e, this.categories, this.units, (e) => this.set(t, e))}
      <label>
        <span class="lbl">${T("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${T("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${T("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${T("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${T("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${T("recipes.ingredient.remove")}
          title=${T("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${O(et)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = Va(this.value);
		return v`<home-inventory-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></home-inventory-unit-add-dialog>
      <div class="lbl">${T("recipes.ingredients")}</div>
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
        ${T("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-recipe-ingredients", Xa);
//#endregion
//#region src/product-input.ts
function Za(e) {
	let t = `${e.testid}-product`, n = e.products.some((t) => t.name === e.name.trim()), r = !!e.name.trim() && !n;
	return v`<label>
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
        ${e.products.map((e) => v`<option value=${e.name}></option>`)}
      </datalist>
      ${j(e.err.name ?? (r ? T("canning.new_product") : void 0), t, !e.err.name)}
    </label>
    ${r ? v`<div class="field">
            <span class="lbl">${T("book.category")}</span>
            <home-inventory-category-picker
              .categories=${e.md?.categories ?? []}
              .value=${e.categoryId}
              .hass=${e.hass}
              @change=${(t) => e.onCategory(t.detail)}
            ></home-inventory-category-picker>
            ${j(e.err.category, `${t}-category`)}
          </div>` : b}`;
}
//#endregion
//#region src/recipe-steps-editor.ts
var Qa = (e) => e.text.length > (e.kind === "head" ? 100 : 2e3) ? T("valid.too_long", { n: e.kind === "head" ? 100 : Aa }) : void 0, $a = class extends w {
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
		return v`<button
      type="button"
      class="icon-btn"
      data-testid=${e}
      aria-label=${t}
      title=${t}
      ?disabled=${i}
      @click=${r}
    >
      ${O(n)}
    </button>`;
	}
	render() {
		let e = 0, t = this.value.length - 1;
		return v`<span class="lbl">${T("recipes.instructions")}</span>
      <ol>
        ${this.value.map((n, r) => {
			let i = n.kind === "head" ? T("recipes.steps.head") : T("recipes.steps.step", { n: ++e }), a = Qa(n), o = (e) => this.emit(this.value.map((t, n) => n === r ? {
				...t,
				text: e.target.value
			} : t));
			return v`<li class=${n.kind}>
            <div class="row">
              <span class="no" aria-hidden="true">${n.kind === "head" ? "" : `${e}.`}</span>
              ${n.kind === "head" ? v`<input
                      data-testid="step-head"
                      aria-label=${i}
                      placeholder=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    />` : v`<textarea
                      rows="2"
                      data-testid="step-text"
                      aria-label=${i}
                      aria-invalid=${!!a}
                      .value=${n.text}
                      @input=${o}
                    ></textarea>`}
              ${this.btn("step-up", T("recipes.steps.up"), Ke, () => this.move(r, -1), r === 0)}
              ${this.btn("step-down", T("recipes.steps.down"), Ge, () => this.move(r, 1), r === t)}
              ${this.btn("step-remove", T("recipes.steps.remove"), et, () => this.emit(this.value.filter((e, t) => t !== r)))}
            </div>
            ${j(a, `step-${r}`)}
          </li>`;
		})}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${T("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${T("recipes.steps.head_add")}
        </button>
      </p>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-recipe-steps", $a);
//#endregion
//#region src/recipe-draft.ts
var eo = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	steps: e?.steps?.length ? ja(e.steps) : Ma(e?.instructions ?? null),
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
}), to = (e, t) => {
	let n = t?.find((t) => t.name === e.product.trim());
	return {
		name: e.name.trim(),
		servings: e.servings,
		steps: Na(e.steps),
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
		ingredients: e.ingredients.filter((e) => !Ba(e)).map((e) => ({
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
}, no = class extends w {
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
		super(), this.aiRun = 0, this.initial = "", this.products = [], this.draft = eo(), this.active = !1, this.error = "", this.ai = { kind: "none" };
	}
	async open(e, t, n, r) {
		this.md = e, this.recipe = t, this.kind = t?.canning_product_id == null ? r : t.canning_kind, r && (this.products = await nn(this.hass).catch(() => [])), this.draft = eo(t ?? n), this.initial = JSON.stringify(n ? eo() : this.draft), this.error = "", this.ai = { kind: "none" }, this.aiRun++, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus(), n && B("ai_recipe_check") && this.check();
	}
	async check() {
		let e = ++this.aiRun, t = this.draft, n = t.ingredients;
		this.ai = { kind: "running" };
		try {
			let r = await gn(this.hass, Ha(t.name, t.servings, t.steps, n));
			if (e !== this.aiRun) return;
			if (r.status !== "changes") {
				this.ai = { kind: r.status === "ok" ? "ok" : "none" };
				return;
			}
			let i = Ua(r, n, t.steps, this.draft, this.md);
			this.draft = {
				...this.draft,
				ingredients: i.ingredients,
				steps: i.steps
			}, this.ai = i.state;
		} catch (t) {
			e === this.aiRun && (this.ai = {
				kind: "failed",
				message: await F(this.hass, t)
			});
		}
	}
	errors() {
		let e = this.draft, t = {};
		e.name.trim() || (t.name = T("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = T("valid.servings")), e.source_url.trim() && !Bt.test(e.source_url.trim()) && (t.source_url = T("valid.url")), e.image_url.trim() && !Bt.test(e.image_url.trim()) && (t.image_url = T("valid.url")), this.canningMode && !e.product.trim() ? t.product = T("valid.required") : this.canningMode && !this.products.some((t) => t.name === e.product.trim()) && e.product_category == null && (t.product_category = T("valid.category"));
		let n = e.canning_temp, r = e.canning_minutes;
		return n != null && !(Number.isInteger(n) && n >= 1 && n <= 200) ? t.canning_temp = T("valid.canning_temp") : n == null && r != null && (t.canning_temp = T("valid.required")), r != null && !(Number.isInteger(r) && r >= 1 && r <= 1440) ? t.canning_minutes = T("valid.canning_minutes") : r == null && n != null && (t.canning_minutes = T("valid.required")), {
			e: t,
			bad: Va(e.ingredients).some((e) => Object.keys(e).length) || e.steps.some((e) => Qa(e))
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await mn(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				...to(r, this.canningMode ? this.products : null),
				...this.kind ? { canning_kind: this.kind } : {}
			});
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	text(e, t, n, r = "text") {
		return v`<label>
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
      ${j(n, e === "name" ? "recipe-name" : `recipe-${e}`)}
    </label>`;
	}
	canning(e, t, n) {
		return e === "canning_minutes" ? Oa({
			kind: this.kind,
			testid: "recipe-canning_minutes",
			minutes: this.draft.canning_minutes,
			err: n,
			onChange: (e) => this.draft = {
				...this.draft,
				canning_minutes: e
			}
		}) : wa({
			testid: `recipe-${e}`,
			label: T(`recipes.field.${e}`),
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
		if (!this.active) return v`<dialog></dialog>`;
		let { e, bad: t } = this.errors(), n = this.draft;
		return k({
			title: this.recipe ? T("common.edit_name", { name: this.recipe.name }) : this.kind ? $(this.kind, "recipe_add") : T("recipes.add"),
			body: v`${Wa(this.ai, {
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
        ${this.text("name", T("common.name"), e.name)}
        ${this.canningMode ? Za({
				testid: "recipe",
				label: T("canning.recipe_makes"),
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
			}) : b}
        <label>
          <span class="lbl"
            >${this.kind ? $(this.kind, "recipe_jars") : T("recipes.servings")}</span
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
					servings: P(t)
				};
			}}
          />
          ${j(e.servings, "recipe-servings-input")}
        </label>
        ${this.canningMode ? v`<div class="pair">
                ${this.canning("canning_temp", "°C", e.canning_temp)}
                ${this.canning("canning_minutes", T("recipes.minutes_unit"), e.canning_minutes)}
              </div>` : b}
        ${this.text("source_url", T("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", T("recipes.field.image_url"), e.image_url, "url")}
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
				label: T("common.save"),
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
		this.styles = [E, Ot];
	}
};
customElements.define("home-inventory-recipe-dialog", no);
//#endregion
//#region src/recipe-import.ts
var ro = [
	"url",
	"text",
	"photo"
], io = () => ro.filter((e) => B(e === "url" ? "recipe_url" : "ai_import")), ao = 2e4, oo = class extends w {
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
		this.source = io()[0] ?? "url", this.url = this.text = this.photo = "", this.error = "", this.busy = !1, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.focusField();
	}
	async focusField() {
		await this.updateComplete, this.renderRoot.querySelector("dialog input, dialog textarea")?.focus();
	}
	errors() {
		if (this.source === "text") return this.text.trim() ? void 0 : T("valid.required");
		if (this.source === "photo") return this.photo ? void 0 : T("valid.required");
		let e = this.url.trim();
		return e ? Bt.test(e) ? void 0 : T("valid.url") : T("valid.required");
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
			this.photo = await $r(t);
		} catch {
			this.error = T("recipes.import.photo_invalid");
		}
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await hn(this.hass, this.request());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-imported", { detail: e }));
			} catch (e) {
				this.error = await F(this.hass, e);
			}
			this.busy = !1;
		}
	}
	switcher() {
		return v`<div class="sources" role="group" aria-label=${T("recipes.import.source")}>
      ${io().map((e) => v`<button
            type="button"
            data-testid=${`recipe-import-source-${e}`}
            aria-pressed=${e === this.source}
            ?disabled=${this.busy}
            @click=${() => {
			this.source = e, this.error = "", this.focusField();
		}}
          >
            ${T(`recipes.import.source_${e}`)}
          </button>`)}
    </div>`;
	}
	field(e) {
		return this.source === "text" ? v`<label>
        <span class="lbl">${T("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${ao}
          data-testid="recipe-import-text"
          aria-invalid=${!!e}
          .value=${this.text}
          @input=${(e) => this.text = e.target.value}
        ></textarea>
        ${j(e, "recipe-import-text")}
        <span class="note">${T("recipes.import.text_hint")}</span>
      </label>` : this.source === "photo" ? v`<button
          type="button"
          class="take"
          data-testid="recipe-import-camera"
          ?disabled=${this.busy}
          @click=${() => this.takePhoto()}
        >
          ${O(Ye)} ${T("recipes.import.take_photo")}
        </button>
        <label>
          <span class="lbl">${T("recipes.import.photo")}</span>
          <input
            type="file"
            accept="image/*"
            data-testid="recipe-import-photo"
            aria-invalid=${!!e}
            @change=${(e) => this.pickPhoto(e)}
          />
          ${j(e, "recipe-import-photo")}
          <span class="note">${T("recipes.import.photo_hint")}</span>
        </label>
        ${this.photo ? v`<img class="preview" src=${this.photo} alt=${T("recipes.import.photo")} />` : b}` : v`<label>
      <span class="lbl">${T("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!e}
        .value=${this.url}
        @input=${(e) => this.url = e.target.value}
      />
      ${j(e, "recipe-import-url")}
      <span class="note"
        >${T(B("ai_import") ? "recipes.import.hint_ai" : "recipes.import.hint")}</span
      >
    </label>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors();
		return v`${k({
			title: T("recipes.import.title"),
			body: v`${io().length > 1 ? this.switcher() : b} ${this.field(e)}
        ${this.busy ? v`<div class="busy" role="status" data-testid="recipe-import-busy">
                <progress aria-label=${T("recipes.import.busy")}></progress>
                <span
                  >${T(B("ai_import") ? "recipes.import.busy_ai" : "recipes.import.busy")}</span
                >
              </div>` : b}`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: T("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		})}<home-inventory-camera></home-inventory-camera>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-recipe-import", oo);
//#endregion
//#region src/api-plan.ts
var so = (e, t, n) => e.callWS({
	type: "home_inventory/meal_plan",
	start: t,
	end: n
}), co = (e, t) => e.callWS({
	type: "home_inventory/meal_save",
	data: t
}), lo = (e, t) => e.callWS({
	type: "home_inventory/meal_delete",
	meal_id: t
}), uo = (e, t, n, r) => e.callWS({
	type: "home_inventory/meal_shift",
	day: t,
	slot: n,
	apply: r
}), fo = (e, t, n) => e.callWS({
	type: "home_inventory/plan_to_shopping_list",
	start: t,
	end: n
}), po = class extends w {
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
		this.recipes = n.filter((e) => !R(e)), this.meal = i, this.draft = {
			day: i?.day ?? e,
			slot: i?.slot ?? t,
			text: i?.name ?? a,
			servings: i?.servings ?? r,
			dateBad: !1
		}, this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.text.trim() || (t.text = T("valid.required")), (!e.day || N(e.dateBad, e.day)) && (t.day = T("valid.date")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = T("valid.servings")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.text.trim();
		try {
			await co(this.hass, {
				...this.meal ? { id: this.meal.id } : {},
				day: t.day,
				slot: t.slot,
				recipe_id: this.recipes.find((e) => e.name === n)?.id ?? null,
				text: n,
				servings: t.servings
			});
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("home-inventory-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.draft;
		return k({
			title: this.meal ? T("common.edit_name", { name: this.meal.name }) : T("plan.add"),
			body: v`<label>
          <span class="lbl">${T("plan.date")}</span>
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
          ${j(e.day, "meal-day")}
        </label>
        <label>
          <span class="lbl">${T("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(t.slot)}
            @change=${(e) => this.draft = {
				...t,
				slot: Number(e.target.value)
			}}
          >
            ${Vr.map((e) => v`<option value=${e} ?selected=${e === t.slot}>${T(`plan.slot.${e}`)}</option>`)}
          </select>
        </label>
        <label>
          <span class="lbl">${T("plan.dish")}</span>
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
            ${this.recipes.map((e) => v`<option value=${e.name}></option>`)}
          </datalist>
          ${j(e.text, "meal-text")}
        </label>
        <label>
          <span class="lbl">${T("recipes.servings")}</span>
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
				servings: P(e.target.value)
			}}
          />
          ${j(e.servings, "meal-servings")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: T("common.save"),
				testid: "meal-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-meal-dialog", po);
//#endregion
//#region src/cook-mode.ts
var mo = (e) => {
	let t = Math.max(0, Math.ceil(e / 1e3)), n = Math.floor(t / 3600), r = String(Math.floor(t % 3600 / 60)).padStart(n ? 2 : 1, "0"), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${r}:${i}` : `${r}:${i}`;
}, ho = () => {
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
}, go = class extends w {
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
		(!this.timers.some((e) => e.end > Date.now()) || await D({
			title: T("cook.stop"),
			action: T("cook.stop_ok")
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
		this.now = Date.now(), this.timers.some((t) => t.end <= this.now && t.end > e) && ho();
	}
	toggle(e) {
		let t = new Set(this.done);
		t.delete(e) || t.add(e), this.done = t;
	}
	step(e, t) {
		return v`<button
        type="button"
        class="step ${this.done.has(t) ? "done" : ""}"
        data-testid="cook-step"
        aria-pressed=${this.done.has(t)}
        @click=${() => this.toggle(t)}
      >
        <span class="no">${t + 1}.</span>${e.text}
      </button>
      ${(e.timers ?? []).map((e) => v`<button
            type="button"
            class="timer-btn"
            data-testid="cook-timer-start"
            aria-label=${T("cook.timer_start", { what: e.label })}
            @click=${() => this.start(t, e.label, e.seconds)}
          >
            ${O(yt)} ${e.label}
          </button>`)}`;
	}
	render() {
		if (!this.active || !this.recipe) return v`<dialog></dialog>`;
		let e = this.recipe, t = this.servings / e.servings;
		return v`<dialog
      @close=${() => this.closed()}
      @cancel=${(e) => {
			e.preventDefault(), this.close();
		}}
    >
      <header>
        <h2>${T("cook.title", { name: e.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${T("cook.close")}
          title=${T("cook.close")}
          @click=${() => this.close()}
        >
          ${O(et)}
        </button>
      </header>
      <h3>${T("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map((e) => v`<li>
              ${[La(this.hass, this.md, e, t), this.md.categories.find((t) => t.id === e.category_id)?.name ?? e.text].filter(Boolean).join(" ")}
              ${e.note ? v`<span class="detail">${e.note}</span>` : b}
            </li>`)}
      </ul>
      <h3>${T("recipes.instructions")}</h3>
      <p class="detail">${T("cook.hint")}</p>
      ${Pa(e.steps, (e, t) => this.step(e, t))}
      ${this.timers.length ? v`<div class="timers" role="status">
              ${this.timers.map((e) => {
			let t = e.end - this.now;
			return v`<span class="timer ${t <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${T("cook.timer", {
				n: e.step + 1,
				what: e.label
			})}:
                  <strong>${t > 0 ? mo(t) : T("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${T("cook.timer_cancel")}
                    title=${T("cook.timer_cancel")}
                    @click=${() => this.timers = this.timers.filter((t) => t !== e)}
                  >
                    ${O(et)}
                  </button>
                </span>`;
		})}
            </div>` : b}
    </dialog>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-cook-mode", go);
//#endregion
//#region src/recipes-view.ts
var _o = class extends w {
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
				dn(this.hass),
				I(this.hass),
				fn(this.hass)
			]);
			[this.recipes, this.md] = [e, t], this.expiring = new Map(n.map((e) => [e.recipe_id, e.used])), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await F(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus(), await this.reveal();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await pn(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await Zn(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("home-inventory-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await dn(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
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
		return (this.recipes ?? []).filter((t) => R(t) === !!this.canning && (!this.canning || t.canning_kind === this.canning) && (!this.onlyExpiring || this.expiring.has(t.id)) && (!e || U(t.name, e) || t.ingredients.some((t) => U(t.text, e))));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = Rt(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return v`<li class="recipe" data-testid="recipe-row" data-recipe-id=${e.id}>
      <div class="head">
        ${Lt(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${T("recipes.summary", e.summary)} ·
            ${R(e) ? T("canning.recipe_summary", {
			name: e.canning_product ?? "",
			jars: e.servings
		}) : En(this.hass, e.servings)}${this.expiring.has(e.id) ? v` ·
                    <span class="soon" data-testid="recipe-expiring"
                      >${T("recipes.expiring", { n: this.expiring.get(e.id) })}</span
                    >` : b}</span
          >
        </button>
        ${A({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: Ht(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? za({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e),
			onPlan: () => R(e) ? this.dispatchEvent(new CustomEvent("home-inventory-canning-start", {
				detail: e.id,
				bubbles: !0,
				composed: !0
			})) : this.renderRoot.querySelector("home-inventory-meal-dialog").open(M(), 3, this.recipes, r, void 0, e.name),
			onCook: () => this.renderRoot.querySelector("home-inventory-cook-mode").open(this.hass, this.md, e, this.scaled.get(e.id) ?? e.ingredients, r)
		}) : b}
    </li>`;
	}
	render() {
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		if (!this.recipes || !this.md) return e;
		let t = this.shown();
		return v`${e}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${T("recipes.search")}
          placeholder=${T("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        ${io().length ? v`<button data-testid="recipe-import" @click=${() => this.importer().open()}>
                ${T("recipes.import.open")}
              </button>` : b}
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${this.canning ? $(this.canning, "recipe_add") : T("recipes.add")}
        </button>
      </div>
      ${this.expiring.size ? v`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e) => this.onlyExpiring = e.target.checked}
              />
              ${T("recipes.expiring_only")}
            </label>` : b}
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
      <home-inventory-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
        @master=${(e) => this.md = e.detail}
      >
      </home-inventory-recipe-dialog>
      ${t.length ? v`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : v`<p class="empty">
              ${this.query.trim() ? T("recipes.no_hits") : this.canning ? $(this.canning, "recipes_empty") : T("recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [E, ka];
	}
};
customElements.define("home-inventory-recipes", _o);
//#endregion
//#region src/plan-shift.ts
var vo = (e, t) => v`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${T("plan.shift")}
    title=${T("plan.shift")}
    @click=${() => e.shift(t)}
  >
    ${O(Je)}
  </button>`;
async function yo(e, t) {
	let { meals: n } = await uo(e, t.day, t.slot, !1), r = new Intl.DateTimeFormat(Kr(e), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	});
	return await D({
		title: T("plan.shift_title", { slot: T(`plan.slot.${t.slot}`) }),
		body: v`<ul class="impact" data-testid="shift-list">
      ${n.map((e) => {
			let t = X(e.day);
			return v`<li>${r.format(t)} ${e.name} → ${r.format(X(Y(Z(t, 1))))}</li>`;
		})}
    </ul>`,
		action: T("plan.shift_ok")
	}) ? (await uo(e, t.day, t.slot, !0), !0) : !1;
}
//#endregion
//#region src/plan-day.ts
function bo(e, t) {
	let n = Y(t);
	return v`<div data-testid="plan-day" data-day=${n}>
    ${Vr.map((t) => v`<section data-testid="plan-cell" data-slot=${t}>
          <div class="head">
            <h3>${T(`plan.slot.${t}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${T("plan.add")}
              title=${T("plan.add")}
              @click=${() => e.add(n, t)}
            >
              ${O(ft)}
            </button>
          </div>
          <ul>
            ${e.meals.filter((e) => e.day === n && e.slot === t).map((t) => v`<li data-testid="plan-meal">
                    <button
                      type="button"
                      class="row"
                      data-testid="plan-meal-open"
                      @click=${() => e.open(t)}
                    >
                      ${t.name} · ${En(e.hass, t.servings)}
                    </button>
                    ${vo(e, t)}
                    ${A({
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
var xo = s`
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
`, So = "(max-width: 600px)", Co = (e, t) => v`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => e.open(t)}>
      ${t.name}
    </button>
    <span class="sec">${En(e.hass, t.servings)}</span>
    ${vo(e, t)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${T("common.edit_name", { name: t.name })}
      title=${T("common.edit_name", { name: t.name })}
      @click=${() => e.edit(t)}
    >
      ${O(dt)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${T("common.delete_name", { name: t.name })}
      title=${T("common.delete_name", { name: t.name })}
      @click=${() => e.remove(t)}
    >
      ${O(nt)}
    </button>
  </div>`, wo = (e, t, n, r) => v`<button
    class="icon-btn quiet"
    data-testid=${r}
    aria-label=${T("plan.add")}
    title=${T("plan.add")}
    @click=${() => e.add(t, n)}
  >
    ${O(ft)}
  </button>`, To = (e, t, n) => v`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => e.openDay(t)}
  >
    ${n.format(t)}
  </button>`, Eo = (e) => [
	0,
	1,
	2,
	3,
	4,
	5,
	6
].map((t) => Z(e, t)), Do = (e, t, n) => e.meals.filter((e) => e.day === t && e.slot === n);
function Oo(e, t, n) {
	let r = new Intl.DateTimeFormat(Kr(e.hass), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	}), i = Y(/* @__PURE__ */ new Date());
	return n ? v`<div data-testid="plan-week">
      ${Eo(t).map((t) => {
		let n = Y(t);
		return v`<section class="daybox" data-testid="plan-day" data-day=${n}>
          <h3 class=${n === i ? "today" : ""}>
            ${To(e, t, r)} ${wo(e, n, 3, "plan-add-day")}
          </h3>
          ${Vr.filter((t) => Do(e, n, t).length).map((t) => v`<div class="slotline" data-testid="plan-cell" data-slot=${t}>
                <span class="slot">${T(`plan.slot.${t}`)}</span>
                <div>${Do(e, n, t).map((t) => Co(e, t))}</div>
              </div>`)}
        </section>`;
	})}
    </div>` : v`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${Eo(t).map((t) => v`<th scope="col" class=${Y(t) === i ? "today" : ""}>
              ${To(e, t, r)}
            </th>`)}
      </tr>
    </thead>
    <tbody>
      ${Vr.map((n) => v`<tr>
            <th scope="row">${T(`plan.slot.${n}`)}</th>
            ${Eo(t).map((t) => {
		let r = Y(t);
		return v`<td data-testid="plan-day" data-day=${r}>
                <div data-testid="plan-cell" data-slot=${n}>
                  ${Do(e, r, n).map((t) => Co(e, t))} ${wo(e, r, n, "plan-add")}
                </div>
              </td>`;
	})}
          </tr>`)}
    </tbody>
  </table>`;
}
var ko = s`
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
`, Ao = [
	xt,
	St,
	tt,
	bt,
	rt
];
function jo(e, t, n, r) {
	let i = Kr(e.hass), a = new Intl.DateTimeFormat(i, { weekday: "short" }), o = new Intl.DateTimeFormat(i, { dateStyle: "full" }), s = Y(/* @__PURE__ */ new Date());
	return v`<div class="month" data-testid="plan-month">
    ${[
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((e) => v`<div class="wd">${a.format(Z(t, e))}</div>`)}
    ${Array.from({ length: n * 7 }, (e, n) => Z(t, n)).map((t) => {
		let n = Y(t), i = e.meals.filter((e) => e.day === n);
		return v`<button
        type="button"
        class="cell ${t.getMonth() === r ? "" : "dim"} ${n === s ? "today" : ""}"
        data-testid="plan-month-day"
        data-day=${n}
        aria-label=${o.format(t)}
        @click=${() => e.openDay(t)}
      >
        <span class="num">${t.getDate()}</span>
        <span class="icons">
          ${Vr.filter((e) => i.some((t) => t.slot === e)).map((e) => {
			let t = T(`plan.slot.${e}`);
			return v`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${e}
              aria-label=${t}
              title=${[t, ...i.filter((t) => t.slot === e).map((e) => e.name)].join("\n")}
              >${O(Ao[e])}</span
            >`;
		})}
        </span>
      </button>`;
	})}
  </div>`;
}
var Mo = s`
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
`, No = 366, Po = (e, t) => Math.round((X(t).getTime() - X(e).getTime()) / 864e5), Fo = class extends w {
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
		this.from = M(), this.to = Y(Z(X(this.from), 6)), this.bad = {
			from: !1,
			to: !1
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = {};
		return (!this.from || N(this.bad.from, this.from)) && (e.from = T("valid.date")), !this.to || N(this.bad.to, this.to) ? e.to = T("valid.date") : !e.from && this.to < this.from ? e.to = T("plan.shop.order") : !e.from && Po(this.from, this.to) >= No && (e.to = T("plan.shop.long", { max: No })), e;
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) try {
			let e = await fo(this.hass, this.from, this.to);
			this.renderRoot.querySelector("dialog")?.close();
			let t = e.recipes.length ? T("plan.shop.done", { recipes: e.recipes.map((e) => `${e.name} (${e.servings})`).join(", ") }) : T("plan.shop.none");
			this.dispatchEvent(new CustomEvent("home-inventory-shopped", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	field(e, t, n) {
		return v`<label>
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
      ${j(n, `plan-shop-${e}`)}
    </label>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors();
		return k({
			title: T("plan.shop.title"),
			body: v`<p class="hint">${T("plan.shop.hint")}</p>
        ${this.field("from", T("plan.shop.from"), e.from)}
        ${this.field("to", T("plan.shop.to"), e.to)}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: T("plan.shop.submit"),
				testid: "plan-shop-save"
			},
			dirty: () => !1,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-plan-shopping-dialog", Fo);
//#endregion
//#region src/plan-view.ts
var Io = class extends w {
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
		super(), this.started = !1, this.narrow = window.matchMedia(So), this.onNarrow = () => this.requestUpdate(), this.date = /* @__PURE__ */ new Date(), this.meals = [], this.household = 1, this.recipes = [], this.error = "", this.note = "";
	}
	get view() {
		return Br.includes(this.section) ? this.section : "week";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load(), dn(this.hass).then((e) => this.recipes = e, () => void 0)) : e.has("section") && this.started && this.load();
	}
	async load() {
		let [e, t] = Wr(this.view, this.date);
		try {
			let n = await so(this.hass, Y(e), Y(t));
			this.meals = n.meals, this.household = n.household_servings, this.error = "";
		} catch (e) {
			this.error = await F(this.hass, e);
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
			this.error = await F(this.hass, e);
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
				await jt(e.name) && await this.act(() => lo(this.hass, e.id));
			},
			open: (e) => e.recipe_id == null ? this.dialog().open(e.day, e.slot, this.recipes, this.household, e) : this.dispatchEvent(new CustomEvent("home-inventory-navigate", {
				detail: `recipes/${e.recipe_id}`,
				bubbles: !0,
				composed: !0
			})),
			shift: (e) => this.act(() => yo(this.hass, e)),
			openDay: (e) => {
				this.date = e, this.nav("day");
			}
		};
	}
	label() {
		let e = Kr(this.hass), t = this.date;
		if (this.view === "day") return new Intl.DateTimeFormat(e, { dateStyle: "full" }).format(t);
		if (this.view === "month") return new Intl.DateTimeFormat(e, {
			month: "long",
			year: "numeric"
		}).format(t);
		let [n, r] = Wr("week", t);
		return new Intl.DateTimeFormat(e, { dateStyle: "medium" }).formatRange(n, new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1));
	}
	body() {
		let e = this.ctx(), [t, n] = Wr(this.view, this.date);
		return this.view === "day" ? bo(e, this.date) : this.view === "week" ? Oo(e, t, this.narrow.matches) : jo(e, t, Math.round((n.getTime() - t.getTime()) / 6048e5), this.date.getMonth());
	}
	render() {
		let e = this.view;
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      ${this.note ? v`<p class="note" role="status" data-testid="plan-shop-note">${this.note}</p>` : b}
      <nav aria-label=${T("plan.view.label")}>
        ${Br.map((t) => v`<button
              data-testid=${`plan-view-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => t === "day" ? this.ctx().openDay(/* @__PURE__ */ new Date()) : this.nav(t)}
            >
              ${T(`plan.view.${t}`)}
            </button>`)}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${T("plan.prev")}
          title=${T("plan.prev")}
          @click=${() => this.go(Gr(e, this.date, -1))}
        >
          ${O(Ze)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(/* @__PURE__ */ new Date())}>
          ${T("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${T("plan.next")}
          title=${T("plan.next")}
          @click=${() => this.go(Gr(e, this.date, 1))}
        >
          ${O(Qe)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        <button
          data-testid="plan-shop"
          @click=${() => this.renderRoot.querySelector("home-inventory-plan-shopping-dialog").open()}
        >
          ${T("plan.shop")}
        </button>
        ${e === "month" ? b : v`<home-inventory-receipt-button
                .hass=${this.hass}
                .print=${() => ln(this.hass, Y(Wr(e, this.date)[0]), e === "day" ? 1 : 7)}
                .done=${T("plan.printed")}
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
			E,
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
			xo,
			ko,
			Mo
		];
	}
};
customElements.define("home-inventory-plan", Io);
//#endregion
//#region src/api-canning.ts
var Lo = (e) => e.callWS({ type: "home_inventory/cannings" }), Ro = (e, t) => e.callWS({
	type: "home_inventory/canning_save",
	data: t
});
//#endregion
//#region src/canning-new-fields.ts
function zo(e) {
	let t = e.draft, n = e.e;
	if (e.canning) return v`<p class="detail" data-testid="canning-fixed">
      ${$(e.kind, "fixed", {
		charge: e.canning.charge,
		name: t.name,
		jars: t.jars ?? ""
	})}
    </p>`;
	let r = e.recipes.find((e) => e.id === t.recipe_id);
	return v`<label>
      <span class="lbl">${$(e.kind, "recipe")}</span>
      <select
        data-testid="canning-recipe"
        @change=${(t) => {
		let n = t.target.value;
		e.pickRecipe(n ? Number(n) : null);
	}}
      >
        <option value="" .selected=${t.recipe_id == null}>${T("common.none")}</option>
        ${e.recipes.map((e) => v`<option value=${e.id} .selected=${e.id === t.recipe_id}>${e.name}</option>`)}
      </select>
    </label>
    ${e.madeOn}
    ${r ? v`<p class="detail" data-testid="canning-recipe-product">
            ${$(e.kind, "recipe_product", { name: r.canning_product ?? "" })}
          </p>` : Za({
		testid: "canning",
		label: T("canning.product"),
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
      <span class="lbl">${T("book.location")}</span>
      ${On({
		testid: "canning-location",
		own: t.location_id,
		dflt: e.location,
		options: (e.md?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!n.location,
		onChange: (t) => e.set({ location_id: t })
	})}
      ${j(n.location, "canning-location")}
    </label>`;
}
//#endregion
//#region src/canning-dialog.ts
var Bo = class extends w {
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
			made_on: M(),
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
		this.md = e, this.products = t, this.kind = i?.kind ?? r, this.recipes = n.filter((e) => R(e) && e.canning_kind === this.kind), this.canning = i, this.draft = i ? {
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
		return n?.[e] == null ? K(this.md, n ? n.category_id : t.category_id, e) : {
			value: n[e],
			source: T("book.from_product")
		};
	}
	proposal(e) {
		let t = this.dflt("shelf_days", e);
		return t && e.made_on ? Hr(e.made_on, Number(t.value)) : "";
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
		return this.canning || ((!e.made_on || N(e.dateBad, e.made_on)) && (t.made_on = T("valid.date")), e.name.trim() ? !this.product() && e.category_id == null && (t.category = T("valid.category")) : t.name = T("valid.required"), (e.jars == null || !Number.isInteger(e.jars) || e.jars < 1 || e.jars > 9999) && (t.jars = T("valid.packages")), !this.dflt("default_location_id") && e.location_id == null && (t.location = T("valid.location"))), e.temp != null && !(Number.isInteger(e.temp) && e.temp >= 1 && e.temp <= 200) && (t.temp = T("valid.canning_temp")), e.minutes != null && !(Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440) && (t.minutes = T("valid.canning_minutes")), t;
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
			let e = await Ro(this.hass, this.canning ? {
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
			this.error = await F(this.hass, e);
		}
	}
	num(e, t, n, r) {
		return wa({
			testid: `canning-${e}`,
			label: t,
			unit: n,
			value: this.draft[e],
			err: r,
			onChange: (t) => this.set({ [e]: t })
		});
	}
	date(e, t, n) {
		return Ta({
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
		return zo({
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
			madeOn: this.date("made_on", T("canning.made_on"), e.made_on),
			jars: this.num("jars", $(this.kind, "jars"), "", e.jars)
		});
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.dflt("shelf_days") : void 0;
		return k({
			title: this.canning ? T("common.edit_name", { name: this.canning.charge }) : $(this.kind, "add_title"),
			body: v`${this.newFields(e)} ${this.date("expires_on", T("canning.expires_on"))}
        ${n ? v`<span class="detail">${T("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : b}
        <div class="pair">
          ${this.num("temp", T("recipes.field.canning_temp"), "°C", e.temp)}
          ${Oa({
				kind: this.kind,
				testid: "canning-minutes",
				minutes: t.minutes,
				err: e.minutes,
				onChange: (e) => this.set({ minutes: e })
			})}
        </div>
        <label>
          <span class="lbl">${T("canning.notes")}</span>
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
				label: T("common.save"),
				testid: "canning-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = E;
	}
};
customElements.define("home-inventory-canning-dialog", Bo);
//#endregion
//#region src/canning-view.ts
var Vo = class extends w {
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
		let e = Ea();
		return this.section?.startsWith("drying") || !e.includes("canning") ? "drying" : "canning";
	}
	get recipesShown() {
		return this.section === "recipes" || this.section === "drying-recipes";
	}
	route(e, t) {
		return e === "drying" ? t ? "canning/drying-recipes" : "canning/drying" : t ? "canning/recipes" : "canning";
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
				Lo(this.hass),
				I(this.hass),
				nn(this.hass),
				dn(this.hass)
			]), this.error = "";
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	edit(e, t) {
		this.message = "", this.renderRoot.querySelector("home-inventory-canning-dialog").open(this.md, this.products, this.recipes, this.kind, e, t);
	}
	async removeCanning(e) {
		this.error = "";
		try {
			if (!await Zn(this.hass, this.md, "canning", {
				id: e.id,
				name: e.charge
			})) return;
		} catch (e) {
			this.error = await F(this.hass, e);
			return;
		}
		await this.load();
	}
	async saved(e) {
		await this.load();
		let t = e.detail;
		t && (this.message = T("canning.saved", { charge: t.charge }), this.renderRoot.querySelector("home-inventory-label-dialog").open({
			id: t.batch_id,
			name: t.name,
			packages: t.jars
		}, t.jars));
	}
	detail(e) {
		return [
			$(e.kind, "jars_left", {
				jars: e.jars,
				left: e.in_stock
			}),
			e.expires_on ? T("canning.until", { date: V(this.hass, e.expires_on) }) : "",
			e.temp == null ? "" : `${e.temp} °C`,
			e.minutes == null ? "" : Da(this.hass, e.kind, e.minutes),
			e.recipe ?? ""
		].filter(Boolean).join(" · ");
	}
	protocols() {
		if (!this.rows) return b;
		let e = this.rows.filter((e) => e.kind === this.kind);
		return v`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${T("canning.add")}
        </button>
      </div>
      ${this.message ? v`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : b}
      ${e.length ? v`<ul>
              ${e.map((e) => v`<li data-testid="canning-row" data-charge=${e.charge}>
                    <button type="button" class="row" @click=${() => this.edit(e)}>
                      <span>${e.charge} · ${e.name}</span>
                      <span class="detail">${this.detail(e)}</span>
                      ${e.notes ? v`<span class="detail">${e.notes}</span>` : b}
                    </button>
                    ${A({
			testid: "canning",
			name: e.charge,
			onEdit: () => this.edit(e),
			onDelete: Ht(this.hass) ? () => this.removeCanning(e) : void 0
		})}
                  </li>`)}
            </ul>` : v`<p class="empty">${$(this.kind, "empty")}</p>`}`;
	}
	render() {
		let e = this.recipesShown, t = this.kind, n = Ea();
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      ${n.length > 1 ? v`<nav aria-label=${T("preserve.kind_label")}>
              ${n.map((n) => v`<button
                    data-testid=${`preserve-${n}`}
                    aria-current=${n === t ? "page" : "false"}
                    @click=${() => this.nav(this.route(n, e))}
                  >
                    ${T(`preserve.${n}`)}
                  </button>`)}
            </nav>` : b}
      <nav aria-label=${T("canning.view.label")}>
        ${["protocols", "recipes"].map((n) => v`<button
              data-testid=${`canning-view-${n}`}
              aria-current=${n === "recipes" === e ? "page" : "false"}
              @click=${() => this.nav(this.route(t, n === "recipes"))}
            >
              ${T(`canning.view.${n}`)}
            </button>`)}
      </nav>
      <div @home-inventory-canning-start=${this.start}>
        ${e ? v`<home-inventory-recipes .hass=${this.hass} .canning=${t}></home-inventory-recipes>` : this.protocols()}
      </div>
      <home-inventory-canning-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-canning-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e) => e.detail && (this.message = T("label.printed", { n: e.detail }))}
      ></home-inventory-label-dialog>`;
	}
	static {
		this.styles = [E, s`
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
customElements.define("home-inventory-canning", Vo);
//#endregion
//#region src/api-stocktake.ts
var Ho = (e, t, n) => e.callWS({
	type: "home_inventory/stocktake_scan",
	location_id: t,
	code: n
}), Uo = (e, t) => e.callWS({
	type: "home_inventory/stocktake_apply",
	...t
}), Wo = class extends w {
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
		this.hass && !this.started && (this.started = !0, I(this.hass).then((e) => this.md = e, async (e) => this.error = await F(this.hass, e)));
	}
	async choose(e) {
		this.location = e, this.counted = /* @__PURE__ */ new Map(), this.extra = [], this.pick = void 0, this.error = "", this.rows = e ? (await L(this.hass)).filter((t) => t.location_id === e) : [], await this.updateComplete, this.renderRoot.querySelector("home-inventory-booking-scan")?.focusInput();
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
				let t = await Ho(this.hass, this.location, e.trim()), n = t.batches.filter((e) => this.rows.some((t) => t.batch_id === e.batch_id));
				n.length === 1 ? this.count(n[0].batch_id, 1) : n.length > 1 ? this.pick = {
					...t,
					batches: n
				} : this.addExtra(t, 1), this.query = "";
			} catch (e) {
				this.error = await F(this.hass, e);
			}
		}
	}
	batchLabel(e) {
		let t = e.expires_on ? V(this.hass, e.expires_on) : T("stock.no_date");
		return e.charge ? T("stock.charge", {
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
		if (await D({
			title: T("stocktake.confirm_title"),
			message: T("stocktake.confirm_message", {
				missing: e,
				more: t
			}),
			action: T("stocktake.apply")
		})) try {
			let e = await Uo(this.hass, {
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
			await this.choose(this.location), this.message = T("stocktake.done", { n: e.corrections });
		} catch (e) {
			this.error = await F(this.hass, e);
		}
	}
	stepper(e, t, n, r) {
		return v`<span class="acts">
      <button
        class="icon-btn"
        data-testid=${`${e}-minus`}
        aria-label=${T("stocktake.less", { name: t })}
        title=${T("stocktake.less", { name: t })}
        ?disabled=${n === 0}
        @click=${() => r(-1)}
      >
        ${O(ct)}
      </button>
      <button
        class="icon-btn"
        data-testid=${`${e}-plus`}
        aria-label=${T("stocktake.one_more", { name: t })}
        title=${T("stocktake.one_more", { name: t })}
        @click=${() => r(1)}
      >
        ${O(ft)}
      </button>
    </span>`;
	}
	list() {
		return v`<ul>
      ${this.rows.map((e) => {
			let t = this.counted.get(e.batch_id) ?? 0, n = t - e.packages;
			return v`<li data-testid="stocktake-row">
          <span class="what">
            <span>${e.name}</span>
            <span class="detail">${this.batchLabel(e)}</span>
          </span>
          <span class="count">
            ${T("stocktake.counted", {
				n: t,
				packages: e.packages
			})}
            ${n ? v`<span class="detail"
                    >${T(n < 0 ? "stocktake.missing" : "stocktake.too_many", { n: Math.abs(n) })}</span
                  >` : b}
          </span>
          ${this.stepper("stocktake-row", e.name, t, (t) => this.count(e.batch_id, t))}
        </li>`;
		})}
    </ul>`;
	}
	extras() {
		return this.extra.length ? v`<h3>${T("stocktake.extra")}</h3>
      <ul>
        ${this.extra.map((e, t) => v`<li data-testid="stocktake-extra">
              <span class="what">
                <span>${e.name}</span>
                <input
                  type="date"
                  data-testid="stocktake-extra-date"
                  aria-label=${T("book.expires_on")}
                  min="2000-01-01"
                  max="2099-12-31"
                  .value=${e.expires_on}
                  @input=${(e) => this.extra = this.extra.map((n, r) => r === t ? {
			...n,
			expires_on: e.target.value
		} : n)}
                />
              </span>
              <span class="count">${T("book.count", { n: e.packages })}</span>
              ${this.stepper("stocktake-extra", e.name, e.packages, (t) => this.addExtra(e, t))}
            </li>`)}
      </ul>` : b;
	}
	pickLine(e) {
		let t = T("stocktake.pick", { name: e.name });
		return v`<div class="pick" role="group" aria-label=${t}>
      <span>${t}</span>
      ${e.batches.map((e) => v`<button
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
		return v`<label>
        <span class="lbl">${T("stocktake.location")}</span>
        <select
          data-testid="stocktake-location"
          @change=${(e) => this.choose(Number(e.target.value) || null)}
        >
          <option value="" .selected=${this.location == null}>${T("stocktake.choose")}</option>
          ${(this.md?.locations ?? []).map((e) => v`<option value=${e.id} .selected=${e.id === this.location}>${e.name}</option>`)}
        </select>
      </label>
      ${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      ${J(this.message, void 0, "stocktake")}
      ${this.location ? v`<p class="detail">${T("stocktake.hint")}</p>
              <home-inventory-booking-scan
                .value=${this.query}
                @query=${(e) => this.query = e.detail}
                @find=${(e) => this.find(e.detail)}
              ></home-inventory-booking-scan>
              ${this.pick ? this.pickLine(this.pick) : b}
              ${this.rows.length ? this.list() : v`<p class="empty">${T("stocktake.empty")}</p>`}
              ${this.extras()}
              <div class="actions">
                <button
                  class="primary"
                  data-testid="stocktake-apply"
                  ?disabled=${!e && !t}
                  @click=${() => this.apply()}
                >
                  ${T("stocktake.apply")}
                </button>
              </div>` : b}`;
	}
	static {
		this.styles = [
			E,
			rr,
			s`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--divider-color);
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
customElements.define("home-inventory-stocktake", Wo);
//#endregion
//#region src/home-inventory-panel.ts
var Go = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", Ko = [
	"stock",
	"expiry",
	"shopping",
	"recipes",
	"plan",
	"canning",
	"settings"
], qo = [
	"shopping",
	"recipes",
	"plan"
], Jo = class extends w {
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
		e.has("hass") && this.hass && Dt(this.hass.language), e.has("panel") && (bn(this.panel?.config?.modules), Sn(this.panel?.config?.external));
	}
	get tabs() {
		return Ko.filter((e) => (e !== "settings" || Ht(this.hass)) && (!qo.includes(e) || z(e)) && (e !== "canning" || Ea().length > 0));
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
		return v`
      <header>
        ${this.narrow ? v`<button
                class="menu"
                aria-label=${T("panel.menu")}
                title=${T("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${O(ot)}
              </button>` : b}
        <h1>${T("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${Go}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${T("panel.help")}
          title=${T("panel.help")}
          >${O(it)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map((t) => v`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${T(`tab.${t}`)}
            </button>`)}
      </div>
      <main
        role="tabpanel"
        @home-inventory-navigate=${(e) => this.select(e.detail)}
      >
        ${e === "settings" ? v`<home-inventory-settings
                .hass=${this.hass}
                .section=${this.sub}
              ></home-inventory-settings>` : e === "stock" && this.seg === "stocktake" ? v`<home-inventory-stocktake .hass=${this.hass}></home-inventory-stocktake>` : e === "stock" ? v`<home-inventory-stock
                    .hass=${this.hass}
                    .mode=${this.seg === "in" || this.seg === "out" || this.seg === "open" && z("opened") ? this.seg : "search"}
                  ></home-inventory-stock>` : e === "expiry" ? v`<home-inventory-expiry .hass=${this.hass}></home-inventory-expiry>` : e === "recipes" ? v`<home-inventory-recipes
                        .hass=${this.hass}
                        .section=${this.sub}
                      ></home-inventory-recipes>` : e === "plan" ? v`<home-inventory-plan
                          .hass=${this.hass}
                          .section=${this.sub}
                        ></home-inventory-plan>` : e === "canning" ? v`<home-inventory-canning
                            .hass=${this.hass}
                            .section=${this.sub}
                          ></home-inventory-canning>` : v`<home-inventory-shopping
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
customElements.define("home-inventory-panel", Jo);
//#endregion
export { Jo as HomeInventoryPanel };
