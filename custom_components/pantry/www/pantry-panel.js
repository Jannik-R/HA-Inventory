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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, re = globalThis, ie = re.trustedTypes, ae = ie ? ie.emptyScript : "", oe = re.reactiveElementPolyfillSupport, se = (e, t) => e, ce = {
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
}, le = (e, t) => !l(e, t), ue = {
	attribute: !0,
	type: String,
	converter: ce,
	reflect: !1,
	useDefault: !1,
	hasChanged: le
};
Symbol.metadata ??= Symbol("metadata"), re.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var f = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ue) {
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
f.elementStyles = [], f.shadowRootOptions = { mode: "open" }, f[se("elementProperties")] = /* @__PURE__ */ new Map(), f[se("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: f }), (re.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var de = globalThis, fe = (e) => e, pe = de.trustedTypes, me = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, he = "$lit$", p = `lit$${Math.random().toFixed(9).slice(2)}$`, ge = "?" + p, _e = `<${ge}>`, m = document, ve = () => m.createComment(""), h = (e) => e === null || typeof e != "object" && typeof e != "function", ye = Array.isArray, be = (e) => ye(e) || typeof e?.[Symbol.iterator] == "function", xe = "[ 	\n\f\r]", g = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Se = /-->/g, Ce = />/g, _ = RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), we = /'/g, Te = /"/g, Ee = /^(?:script|style|textarea|title)$/i, De = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), v = De(1), Oe = De(2), y = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), x = m.createTreeWalker(m, 129);
function Ae(e, t) {
	if (!ye(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return me === void 0 ? t : me.createHTML(t);
}
var je = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = g;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === g ? c[1] === "!--" ? o = Se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = _) : (Ee.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = _) : o = Ce : o === _ ? c[0] === ">" ? (o = i ?? g, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? _ : c[3] === "\"" ? Te : we) : o === Te || o === we ? o = _ : o === Se || o === Ce ? o = g : (o = _, i = void 0);
		let d = o === _ && e[t + 1].startsWith("/>") ? " " : "";
		a += o === g ? n + _e : l >= 0 ? (r.push(s), n.slice(0, l) + he + n.slice(l) + p + d) : n + p + (l === -2 ? t : d);
	}
	return [Ae(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Me = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = je(t, n);
		if (this.el = e.createElement(l, r), x.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = x.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(he)) {
					let t = u[o++], n = i.getAttribute(e).split(p), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ie : r[1] === "?" ? Le : r[1] === "@" ? Re : Fe
					}), i.removeAttribute(e);
				} else e.startsWith(p) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ee.test(i.tagName)) {
					let e = i.textContent.split(p), t = e.length - 1;
					if (t > 0) {
						i.textContent = pe ? pe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ve()), x.nextNode(), c.push({
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
function S(e, t, n = e, r) {
	if (t === y) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = h(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = S(e, i._$AS(e, t.values), i, r)), t;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? m).importNode(t, !0);
		x.currentNode = r;
		let i = x.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Pe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ze(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = x.nextNode(), a++);
		}
		return x.currentNode = m, r;
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
		e = S(this, e, t), h(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== y && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? be(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== b && h(this._$AH) ? this._$AA.nextSibling.data = e : this.T(m.createTextNode(e)), this._$AH = e;
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
}, Fe = class {
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
		if (i === void 0) e = S(this, e, t, 0), a = !h(e) || e !== this._$AH && e !== y, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = S(this, r[n + o], t, o), s === y && (s = this._$AH[o]), a ||= !h(s) || s !== this._$AH[o], s === b ? e = b : e !== b && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ie = class extends Fe {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === b ? void 0 : e;
	}
}, Le = class extends Fe {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== b);
	}
}, Re = class extends Fe {
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
	M: he,
	P: p,
	A: ge,
	C: 1,
	L: je,
	R: Ne,
	D: be,
	V: S,
	I: Pe,
	H: Fe,
	N: Le,
	U: Re,
	B: Ie,
	F: ze
}, Ve = de.litHtmlPolyfillSupport;
Ve?.(Me, Pe), (de.litHtmlVersions ??= []).push("3.3.3");
var He = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Pe(t.insertBefore(ve(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ue = globalThis, C = class extends f {
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
C._$litElement$ = !0, C.finalized = !0, Ue.litElementHydrateSupport?.({ LitElement: C });
var We = Ue.litElementPolyfillSupport;
We?.({ LitElement: C }), (Ue.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Ge = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", Ke = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", qe = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Je = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z", Ye = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Xe = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", Ze = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Qe = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", $e = "M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z", et = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", tt = "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z", nt = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z", rt = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", it = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", at = "M7,10L12,15L17,10H7Z", ot = "M19,13H5V11H19V13Z", st = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", ct = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z", lt = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", ut = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", dt = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", ft = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", pt = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", mt = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", ht = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", gt = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z", _t = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13", vt = {
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
}, yt = { de: vt }, bt = vt;
function xt(e) {
	let t = e ?? "";
	bt = yt[t] ?? yt[t.split("-")[0]] ?? vt;
}
function w(e, t) {
	let n = bt[e] ?? vt[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var T = o`
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
`, St = o`
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
`, Ct = (e) => {
	let t = e.target;
	if (t.tagName !== "DIALOG") return !1;
	let n = t.getBoundingClientRect();
	return e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom;
}, wt = class extends C {
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
		Ct(e) && e.target.close();
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
          ${w("common.cancel")}
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
		this.styles = [T, o`
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
customElements.define("pantry-confirm", wt);
function E(e) {
	return new Promise((t) => {
		let n = document.createElement("pantry-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var Tt = (e, t) => E({
	title: w("common.delete_name", { name: e }) + "?",
	message: t,
	action: w("common.delete"),
	danger: !0
}), D = (e) => v`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${Oe`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Et = !1;
async function Dt(e, t) {
	if (!t?.()) return e.close();
	if (!Et) {
		Et = !0;
		try {
			await E({
				title: w("common.discard"),
				action: w("common.discard_ok")
			}) && e.close();
		} finally {
			Et = !1;
		}
	}
}
var Ot = (e) => (t) => {
	Ct(t) && Dt(t.target, e);
}, kt = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || t.composedPath().find((e) => e instanceof HTMLDialogElement) === t.currentTarget && e() && t.cancelable && (t.preventDefault(), Dt(t.currentTarget, e));
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
var O = (e) => v`<dialog
    @close=${(t) => {
	for (let e of t.target.querySelectorAll("[data-touched]")) e.removeAttribute("data-touched");
	e.onClosed();
}}
    @click=${Ot(e.dirty)}
    @keydown=${kt(e.dirty)}
    @cancel=${kt(e.dirty)}
  >
    <form @submit=${(t) => At(t, e.onSubmit)}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? v`<p class="error" role="alert">${e.error}</p>` : b}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${w("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
        >
          ${e.submit?.label ?? w("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, k = (e, t) => v`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${w(e ? "common.collapse" : "common.expand")}
    title=${w(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${D(e ? Ye : Ze)}
  </button>`;
function jt(e, t) {
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
            ${D(ut)}
          </button>` : b}${e.onMove ? v`<button
            class="icon-btn"
            data-testid=${`${e.testid}-move`}
            aria-label=${e.moveLabel ?? ""}
            title=${e.moveLabel ?? ""}
            @click=${e.onMove}
          >
            ${D(ft)}
          </button>` : b}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${w("common.edit_name", { name: e.name })}
      title=${w("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${D(lt)}
    </button>
    ${e.onDelete ? v`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${w("common.delete_name", { name: e.name })}
            title=${w("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${D(et)}
          </button>` : b}`, j = (e, t, n = !1) => e ? v`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : b, M = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, Mt = (e) => e >= "2000-01-01" && e <= "2099-12-31", N = (e, t) => e || !!t && !Mt(t), P = (e) => e === "" ? null : Number(e), Nt = /^https?:\/\//i, F = (e) => !!e?.user?.is_admin;
async function I(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var L = (e, t) => e.filter((e) => !e.recipe_only || e.id === t), R = (e) => e.callWS({ type: "pantry/master_data" }), Pt = (e, t, n) => e.callWS({
	type: "pantry/save",
	table: t,
	data: n
}), Ft = (e, t) => e.callWS({
	type: "pantry/defaults_save",
	data: t
}), It = (e, t, n, r = {}) => e.callWS({
	type: "pantry/delete",
	table: t,
	row_id: n,
	...r
}), Lt = (e, t, n) => e.callWS({
	type: "pantry/move_location",
	location_id: t,
	move_to: n
}), Rt = (e, t, n) => e.callWS({
	type: "pantry/delete_impact",
	table: t,
	row_id: n
}), zt = (e, t, n) => e.callWS({
	type: "pantry/product_type_add",
	name: t,
	parent_id: n
}), Bt = (e, t) => e.callWS({
	type: "pantry/lookup",
	code: t
}), Vt = (e, t, n = !1) => e.callWS({
	type: "pantry/search",
	query: t,
	online: n
}), Ht = (e, t) => e.callWS({
	type: "pantry/book_in",
	...t
}), Ut = (e, t) => e.callWS({
	type: "pantry/book_out",
	...t
}), Wt = (e, t) => e.callWS({
	type: "pantry/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), Gt = (e, t) => e.callWS({
	type: "pantry/stock_edit",
	...t
}), z = (e, t) => e.callWS({
	type: "pantry/stock",
	product_id: t
}), B = (e) => e.callWS({ type: "pantry/products" }), Kt = (e, t) => e.callWS({
	type: "pantry/product_save",
	data: t
}), qt = (e) => e.callWS({ type: "pantry/label_config" }), Jt = (e, t) => e.callWS({
	type: "pantry/print_labels",
	...t
}), Yt = (e) => e.callWS({ type: "pantry/print_shopping_list" }), Xt = (e, t, n) => e.callWS({
	type: "pantry/print_recipe",
	recipe_id: t,
	servings: n
}), Zt = (e, t, n) => e.callWS({
	type: "pantry/print_plan",
	start: t,
	days: n
}), Qt = (e, t) => e.callWS({
	type: "pantry/book_out_label",
	code: t
}), V = (e) => e.callWS({ type: "pantry/recipes" }), $t = (e, t) => e.callWS({
	type: "pantry/expiring_recipes",
	...t == null ? {} : { days: t }
}), en = (e, t, n) => e.callWS({
	type: "pantry/recipe_availability",
	recipe_id: t,
	servings: n
}), tn = (e, t) => e.callWS({
	type: "pantry/recipe_save",
	data: t
}), H = (e) => e.canning_product_id != null, nn = (e, t) => e.callWS({
	type: "pantry/recipe_import",
	...t
}), rn = (e, t) => e.callWS({
	type: "pantry/recipe_ai_check",
	draft: t
}), an = (e, t) => e.callWS({
	type: "pantry/product_ai_check",
	draft: t
}), on = (e, t, n) => e.callWS({
	type: "pantry/unit_add",
	name: t,
	symbol: n
}), sn, cn = (e) => sn = e, U = (e) => !sn || sn.includes(e), ln = !1, un = (e) => ln = !!e, dn = () => ln, fn = (e) => e?.locale?.language ?? e?.language, W = (e, t) => new Intl.DateTimeFormat(fn(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), G = (e, t) => new Intl.NumberFormat(fn(e)).format(t), pn = (e, t, n, r, i = t) => w(new Intl.PluralRules(fn(e)).select(t) === "one" ? n : r, { n: i }), mn = (e, t) => pn(e, Number(t), "settings.day", "settings.days", t), K = (e, t) => e.toLocaleLowerCase().includes(t.toLocaleLowerCase()), q = (e, t, n = "") => `${G(e, t)} ${n ?? ""}`.trim(), hn = (e, t) => pn(e, t, "recipes.portion", "recipes.portions");
//#endregion
//#region src/inherit.ts
function J(e, t) {
	let n = [];
	for (let r = e?.find((e) => e.id === t); r; r = e.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function gn(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n],
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: w("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: w("settings.inherit_from", { name: a ?? "" })
	};
}
var _n = (e, t) => v`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${D(dt)}${w("common.reset")}
  </button>`;
function vn(e) {
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
        ${e.dflt ? w("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : w(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => v`<option value=${e} .selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? b : _n(e.testid, () => e.onChange(null))}
  </span>`;
}
function yn(e) {
	let t = e.own ?? null;
	return v`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? w("common.default", {
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
    ${t == null ? b : _n(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var bn = class extends C {
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
				let { id: t } = await zt(this.hass, this.creating, e), n = await R(this.hass);
				this.dispatchEvent(new CustomEvent("master", {
					detail: n,
					bubbles: !0,
					composed: !0
				})), this.renderRoot.querySelector("dialog").close(), this.dispatchEvent(new CustomEvent("change", { detail: t }));
			} catch (e) {
				this.failure = await I(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = jt(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim();
		if (e) return this.categories.filter((t) => K(t.name, e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: J(this.categories, e.id)
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
          ${this.value == null ? this.noneLabel ?? w("book.choose") : J(this.categories, this.value)}
        </span>
        ${D(at)}
      </button>
      <dialog @click=${Ot()}>
        <h2>
          ${this.creating ? w("book.choose_parent", { name: this.creating }) : w("book.choose_category")}
        </h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${w("book.filter")}
          placeholder=${w("book.filter")}
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
              ${i ? k(a, () => this.toggle(e.id)) : n ? b : v`<span class="chev"></span>`}
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
                ${w("book.create_category", { name: t })}
              </button>` : e.length ? b : v`<p class="empty">${w("book.no_hits")}</p>`}
        ${this.failure ? v`<p class="error" role="alert">${this.failure}</p>` : b}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${w("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0 || this.busy}
            @click=${this.confirm}
          >
            ${w("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-category-picker", bn);
//#endregion
//#region src/settings-format.ts
function xn(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function Sn(e, t) {
	return t === "default" ? w("settings.inherit_default") : w("settings.inherit_from", { name: xn(e, t) });
}
function Cn(e, t, n) {
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
	if (n === "food") return w(r === 0 ? "settings.food.no" : "settings.food.yes");
	if (r == null) return w("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : w("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? w("common.none_dash") : n === "expiry_type" ? w(`settings.expiry.${r}`) : mn(t, r);
}
//#endregion
//#region src/min-stock.ts
function wn(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = w("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = w("valid.packages")), t;
}
function Tn(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return v`<label>
      <span class="lbl" title=${w("tip.min_stock")}>${w("settings.category.min_stock")}</span>
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
          aria-label=${w("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${L(e.md.units, t.min_stock_unit_id ?? e.unitId).map((n) => v`<option value=${n.id} .selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${j(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${w("tip.min_packages")}>${w("settings.category.min_packages")}</span>
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
        <span class="detail">${w("book.packages")}</span>
      </span>
      ${j(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${w("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-model.ts
var En = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null,
	meals: null
}, Dn = {
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
}, On = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, kn = [
	"warn_days",
	"shelf_days",
	"opened_days"
], An = class extends C {
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
		for (let i of Dn[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = w("valid.duplicate")) : n.name = w("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = w("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = w("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = w("valid.days")), t.shelf_days != null && !(Number.isInteger(t.shelf_days) && t.shelf_days >= 1) && (n.shelf_days = w("valid.shelf_days")), t.opened_days != null && !(Number.isInteger(t.opened_days) && t.opened_days >= 1) && (n.opened_days = w("valid.shelf_days")), Object.assign(n, wn(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Dn[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Pt(this.hass, t, r);
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
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
          step=${kn.includes(e) ? "1" : "any"}
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
      >${kn.includes(e) ? b : j(this.errs[e], e)}`;
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
          ${D(dt)}${w("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = Cn(i, e, this.edit.d.parent_id), o = Y(i, this.hass, e, a.value), s = Sn(i, a.source), c = kn.includes(e) ? this.numInput(e, w("common.default", {
			value: o,
			source: s
		}), w("common.days_unit")) : this.select(e, n, w("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, v`<span class="inh">${c}${this.reset(e)}</span
        >${j(this.errs[e], e)}`, w(`tip.${e}`));
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return v`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(w("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = L(a, n.base_unit_id).filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = v`${this.field(w("common.name"), this.text("name"))}${this.field(w("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${w("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!n.recipe_only}
            @change=${(e) => this.set("recipe_only", +!!e.target.checked)}
          />${w("settings.unit.recipe_only")}</label
        >
        ${j(w("settings.unit.recipe_only_hint"), "unit-recipe-only", !0)}
        ${this.field(w("settings.unit.base"), this.select("base_unit_id", e, w("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(w("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? Cn(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = v`${this.field(w("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${w("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${w("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh("unit_id", w("settings.category.unit"), L(a, n.unit_id).map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", w("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", w("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, w(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", w("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", w("settings.category.shelf_days"), [])}
        ${this.inh("opened_days", w("settings.category.opened_days"), [])}
        ${this.inh("food", w("settings.food.label"), [[1, w("settings.food.yes")], [0, w("settings.food.no")]])}
        ${Tn({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? v`<p class="detail">${w("settings.category.off_tags", { tags: t.join(", ") })}</p>` : b}`;
		}
		let c = () => Dn[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? xn(i, n.parent_id) : "";
		return O({
			title: n.id ? w("common.edit_name", { name: r.name }) : l ? w("settings.category.add_sub_to", { name: l }) : w(On[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [T];
	}
};
customElements.define("pantry-settings-dialog", An);
//#endregion
//#region src/defaults-view.ts
var jn = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"],
	["shelf_days", "settings.category.shelf_days"],
	["opened_days", "settings.category.opened_days"]
], Mn = class extends C {
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
		return t === null || !Number.isInteger(t) || t < 0 ? w("valid.days") : void 0;
	}
	shelfError(e, t = "shelf_days") {
		let n = e[t];
		return n !== null && !(Number.isInteger(n) && n >= 1) ? w("valid.shelf_days") : void 0;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!(this.warnError(t) || this.shelfError(t) || this.shelfError(t, "opened_days"))) try {
			await Ft(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? v`<p class="detail intro">${w("settings.defaults.hint")}</p>
      <ul>
        ${jn.map(([t, n]) => v`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${w(n)}</span>
                <span class="detail">${Y(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${A({
			testid: "default",
			name: w(n),
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
		let n = this.warnError(t), r = this.shelfError(t), i = this.shelfError(t, "opened_days");
		return O({
			title: w("settings.defaults.edit"),
			body: v`<label>
          <span class="lbl" title=${w("tip.unit_id")}>${w("settings.category.unit")}</span>
          ${this.select("unit_id", L(e.units, t.unit_id).map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl" title=${w("tip.default_location_id")}
            >${w("settings.category.location")}</span
          >
          ${this.select("default_location_id", [[null, w("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl" title=${w("tip.expiry_type")}
            >${w("settings.category.expiry_type")}</span
          >
          ${this.select("expiry_type", ["best_before", "use_by"].map((e) => [e, w(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl" title=${w("tip.warn_days")}>${w("settings.category.warn_days")}</span>
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
            ${w("common.days_unit")}
          </span>
          ${j(n, "default-warn_days")}
        </label>
        ${this.optionalDays(t, "shelf_days", r)}
        ${this.optionalDays(t, "opened_days", i)}`,
			error: this.error,
			invalid: !!n || !!r || !!i,
			dirty: () => jn.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	optionalDays(e, t, n) {
		return v`<label>
      <span class="lbl" title=${w(`tip.${t}`)}>${w(`settings.category.${t}`)}</span>
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
        ${w("common.days_unit")}
      </span>
      ${j(n, `default-${t}`)}
    </label>`;
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-defaults", Mn);
//#endregion
//#region src/meal-times-view.ts
var Nn = /^([01][0-9]|2[0-3]):[0-5][0-9]$/, Pn = class extends C {
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
			let e = await this.hass.callWS({ type: "pantry/meal_times" });
			this.starts = e.map((e) => e.start);
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	async open() {
		this.error = "", this.d = [...this.starts], await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), !this.d.some((e) => !Nn.test(e))) try {
			await this.hass.callWS({
				type: "pantry/meal_times_save",
				starts: this.d
			}), this.starts = [...this.d], this.renderRoot.querySelector("dialog")?.close();
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		if (!this.starts) return v`${this.error ? v`<p class="error">${this.error}</p>` : ""}`;
		let e = this.d;
		return v`<p class="detail intro">${w("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map((e, t) => v`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${w(`plan.slot.${t}`)}</span>
                <span class="detail">${w("settings.meals.from", { time: e })}</span>
              </button>
              ${A({
			testid: "meal-time",
			name: w(`plan.slot.${t}`),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${e ? O({
			title: w("settings.meals.edit"),
			body: v`${e.map((t, n) => v`<label>
                    <span class="lbl">${w(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!Nn.test(t)}
                      .value=${t}
                      @input=${(t) => this.d = e.map((e, r) => r === n ? t.target.value : e)}
                    />
                    ${j(Nn.test(t) ? void 0 : w("valid.time"), `meal-time-${n}`)}
                  </label>`)}`,
			error: this.error,
			invalid: e.some((e) => !Nn.test(e)),
			dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		}) : v`<dialog></dialog>`}`;
	}
	static {
		this.styles = [T];
	}
};
customElements.define("pantry-meal-times", Pn);
//#endregion
//#region src/move-location.ts
var Fn = class extends C {
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
			let t = (await Rt(this.hass, "location", e.id)).groups.find((e) => e.kind === "delete.stock");
			this.batches = t?.count ?? 0, this.packages = t?.packages ?? 0;
		} catch (e) {
			this.error = await I(this.hass, e);
		}
		this.from = e, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("select")?.focus();
	}
	async save(e) {
		if (e.preventDefault(), this.target && this.batches) try {
			await Lt(this.hass, this.from.id, Number(this.target)), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("moved"));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		let e = this.from;
		return e ? O({
			title: w("settings.location.move_name", { name: e.name }),
			body: v`<p class="detail" data-testid="move-summary">
          ${this.batches ? w("settings.location.move_summary", {
				batches: this.batches,
				packages: this.packages,
				name: e.name
			}) : w("settings.location.move_empty")}
        </p>
        <label>
          <span class="lbl">${w("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e) => this.target = e.target.value}
          >
            <option value="">${w("settings.location.move_choose")}</option>
            ${this.locations.filter((t) => t.id !== e.id).map((e) => v`<option value=${e.id}>${e.name}</option>`)}
          </select>
          ${j(this.target ? void 0 : w("valid.location"), "move-target")}
        </label>`,
			error: this.error,
			invalid: !this.target || !this.batches,
			submit: {
				label: w("settings.location.move_action"),
				testid: "move-save"
			},
			dirty: () => !!this.target,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.from = void 0
		}) : v`<dialog></dialog>`;
	}
	static {
		this.styles = [T, o`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("pantry-move-location", Fn);
//#endregion
//#region src/delete-flow.ts
var In = 5, Ln = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = w(r, { n });
	return i === r ? w("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, Rn = (e) => {
	let t = e.names.length - In;
	return e.names.slice(0, In).join(", ") + (t > 0 ? w("delete.more", { n: t }) : "");
};
async function zn(e, t, n, r) {
	let i = n === "location" || n === "unit" ? w(`settings.${n}.delete_hint`) : void 0, a = await Rt(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "pantry",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await Tt(r.name, i) ? (await It(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = v`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => v`<li>
            <span class="kind">${Ln(n, e)}</span>
            <span class="names">${Rn(e)}</span>
            ${e.packages ? v`<span class="names">${w("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? v`<label>
            <span class="lbl">${w("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => v`<option value=${e.id}>${w("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${w("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await E({
		title: w("common.delete_name", { name: r.name }) + "?",
		message: i ?? w("delete.affected"),
		body: c,
		action: w(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await It(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var Bn = class extends C {
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
		return Object.keys(En).filter((e) => e !== "meals" || U("plan"));
	}
	get sec() {
		return this.sections.includes(this.section ?? "") ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await R(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await I(this.hass, e);
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
		this.expanded = jt(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => Y(t, this.hass, n, e[n]));
		if (e.shelf_days != null && n.push(w("settings.category.shelf_short", { days: Y(t, this.hass, "shelf_days", e.shelf_days) })), e.opened_days != null && n.push(w("settings.category.opened_short", { days: Y(t, this.hass, "opened_days", e.opened_days) })), e.food === 0 && n.push(w("settings.food.no")), e.min_stock != null) {
			let r = Y(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(w("settings.category.min", { value: `${G(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(w("settings.category.min", { value: w("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = En[e];
		return v`
      <nav aria-label=${w("settings.nav")}>
        ${this.sections.map((t) => v`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${w(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? v`<p class="error" role="alert">${this.pageError}</p>` : b}
      ${this.data ? t ? v`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${w(On[t])}
                  </button>
                </div>
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : e === "meals" ? v`<pantry-meal-times .hass=${this.hass}></pantry-meal-times>` : v`<pantry-defaults
                  .hass=${this.hass}
                  .data=${this.data}
                  @pantry-saved=${this.load}
                ></pantry-defaults>` : b}
      <pantry-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @pantry-saved=${this.load}
      ></pantry-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? b : v`<p class="empty">${w("common.empty")}</p>`;
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
				onMove: () => this.renderRoot.querySelector("pantry-move-location").open(t),
				moveLabel: w("settings.location.move_name", { name: t.name })
			} : {},
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: w("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await zn(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await I(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return v`<ul>
        ${e.map((e) => this.row(e.name, "", () => this.open("location", e), 0, b, this.actions("location", e)))}
      </ul>
      ${this.empty(e)}
      <pantry-move-location
        .hass=${this.hass}
        .locations=${e}
        @moved=${() => this.load()}
      ></pantry-move-location>`;
	}
	renderUnits() {
		let { units: e } = this.data, t = (t) => {
			let n = e.find((e) => e.id === t.base_unit_id);
			return [
				t.symbol,
				t.recipe_only ? w("settings.unit.recipe_only") : "",
				n ? `= ${G(this.hass, t.factor)} ${n.symbol}` : t.recipe_only ? w("settings.unit.no_conversion") : t.is_count ? w("settings.unit.count") : ""
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
			let r = this.expanded.has(e.id), i = n ? k(r, () => this.toggle(e.id)) : v`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-settings", Bn);
//#endregion
//#region src/stock-data.ts
function Vn(e, t, n, r = [], i) {
	let a = t.trim(), o = (e) => K(e.join(" "), a), s = /* @__PURE__ */ new Map();
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
		J(i?.categories, e.category_id)
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
var Hn = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${M()}T00:00`)) / 864e5);
function Un(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = Hn(e.expires_on);
	return i < 0 ? "expired" : i <= (r ?? Number(t?.warn_days ?? gn(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function Wn(e, t, n, r) {
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
function Gn(e, t, n, r) {
	return e ? v`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? v`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${w("stock.undo")}
          </button>` : b}
    ${r ?? b}
  </p>` : b;
}
var Kn = o`
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
async function qn(e, t) {
	let n = e.undo;
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await z(e.hass);
	} catch (t) {
		e.undo = n, e.error = await I(e.hass, t);
	}
}
var Jn = (e, t, n) => qn(e, async () => {
	let { taken: r } = await Ut(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), Yn = (e) => {
	let t = e.undo;
	if (t) return qn(e, async () => {
		await Wt(e.hass, t.taken);
	});
}, Xn = (e, t, n, r) => {
	let i = w("stock.take_one", { name: t });
	return v`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => Jn(e, t, n)}
  >
    ${D(st)}
  </button>`;
}, Zn = (e, t) => Gn(e.undo ? w("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => Yn(e)), t), Qn = (e, t) => e.callWS({
	type: "pantry/open_package",
	...t
}), $n = (e, t) => e.callWS({
	type: "pantry/open_label",
	code: t
}), er = (e, t) => e.callWS({
	type: "pantry/open_undo",
	booking_id: t
}), tr = (e, t) => e.dispatchEvent(new CustomEvent("pantry-print-label", {
	detail: {
		id: t.batch_id,
		name: t.name,
		packages: 1
	},
	bubbles: !0,
	composed: !0
}));
function nr(e, t, n, r, i) {
	return t ? Gn(t.expires_on ? w("stock.opened_until", {
		name: t.name,
		date: W(e, t.expires_on)
	}) : w("stock.opened_one", { name: t.name }), n, i, v`<button type="button" class="undo" data-testid=${`${i}-label`} @click=${r}>
      ${w("stock.opened_label")}
    </button>`) : b;
}
async function rr(e, t) {
	let n = e.opened;
	e.error = "", e.opened = void 0;
	try {
		e.opened = await t(), e.stock = await z(e.hass);
	} catch (t) {
		e.opened = n, e.error = await I(e.hass, t);
	}
}
var ir = (e) => {
	let t = e.opened;
	if (t) return rr(e, () => er(e.hass, t.booking_id).then(() => void 0));
}, ar = (e, t, n) => {
	if (n.opened_on) return b;
	let r = w("stock.open_one", { name: t });
	return v`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${r}
    title=${r}
    @click=${() => rr(e, () => Qn(e.hass, {
		product_id: n.product_id,
		batch_id: n.batch_id,
		location_id: n.location_id
	}))}
  >
    ${D(ct)}
  </button>`;
}, or = (e) => v`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${w("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" .selected=${e.location == null}>${w("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => v`<option value=${t.id} .selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${w("stock.with_empty")}
    </label>`, sr = o`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, cr = o`
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
`, lr = (e = {}) => ({
	ean: null,
	name: "",
	brand: null,
	category_id: null,
	content_amount: null,
	content_unit_id: null,
	...e
}), ur = (e) => Object.fromEntries([
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
function dr(e) {
	let t = {};
	return e.name.trim() || (t.name = w("valid.required")), e.category_id == null && !e.new_type && (t.category = w("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = w("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = w("valid.content_pair")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = w("valid.packages")), t;
}
function fr(e, t, n, r = {}, i) {
	return v`<label>
      <span class="lbl">${w("common.name")}</span>
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
      <span class="lbl">${w("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${w("book.category")}</span>
      <pantry-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        .hass=${i}
        @change=${(e) => n("category_id", e.detail)}
      ></pantry-category-picker>
      ${j(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl" title=${w("tip.content")}>${w("book.content")}</span>
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
        <span class="lbl">${w("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" .selected=${t.content_unit_id == null}>${w("common.none_dash")}</option>
          ${L(e?.units ?? [], t.content_unit_id).map((e) => v`<option value=${e.id} .selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${j(r.content, "content")}
    <label>
      <span class="lbl" title=${w("tip.product_min_packages")}>${w("products.min_packages")}</span>
      ${yn({
		testid: "min-packages",
		own: t.min_packages,
		dflt: void 0,
		format: String,
		suffix: w("book.packages"),
		invalid: !!r.min_packages,
		onChange: (e) => n("min_packages", e)
	})}
      ${j(r.min_packages, "min-packages")}
    </label>`;
}
function pr(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${G(r, t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/product-dialog.ts
var mr = [
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
], hr = class extends C {
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
		let t = dr(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = w("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = w("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = w("valid.days")), e.shelf_days != null && !(Number.isInteger(e.shelf_days) && e.shelf_days >= 1) && (t.shelf_days = w("valid.shelf_days")), e.opened_days != null && !(Number.isInteger(e.opened_days) && e.opened_days >= 1) && (t.opened_days = w("valid.shelf_days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of mr) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await Kt(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return v`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => gn(this.md, e.category_id, t);
		return O({
			title: w("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: v`${fr(this.md, e, (e, t) => this.set(e, t), t, this.hass)}
        <label>
          <span class="lbl">${w("products.ean")}</span>
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
          <span class="lbl" title=${w("tip.default_location_id")}
            >${w("settings.category.location")}</span
          >
          ${vn({
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
          <span class="lbl" title=${w("tip.expiry_type")}
            >${w("settings.category.expiry_type")}</span
          >
          ${vn({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, w(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl" title=${w("tip.warn_days")}>${w("settings.category.warn_days")}</span>
          ${yn({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => mn(this.hass, e),
				suffix: w("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${j(t.warn_days, "warn-days")}
        </label>
        <label>
          <span class="lbl" title=${w("tip.shelf_days")}>${w("settings.category.shelf_days")}</span>
          ${yn({
				testid: "shelf-days",
				own: e.shelf_days,
				dflt: n("shelf_days"),
				format: (e) => mn(this.hass, e),
				suffix: w("common.days_unit"),
				invalid: !!t.shelf_days,
				onChange: (e) => this.set("shelf_days", e)
			})}
          ${j(t.shelf_days, "shelf-days")}
        </label>
        <label>
          <span class="lbl" title=${w("tip.opened_days")}
            >${w("settings.category.opened_days")}</span
          >
          ${yn({
				testid: "opened-days",
				own: e.opened_days,
				dflt: n("opened_days"),
				format: (e) => mn(this.hass, e),
				suffix: w("common.days_unit"),
				invalid: !!t.opened_days,
				onChange: (e) => this.set("opened_days", e)
			})}
          ${j(t.opened_days, "opened-days")}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => mr.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-product-dialog", hr);
//#endregion
//#region src/batch-dialog.ts
var gr = class extends C {
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
		return N(e.dateBad, e.expires_on) && (t.expires = w("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = w("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await Gt(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return v`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return O({
			title: w("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: v`<label>
          <span class="lbl">
            ${w("book.expires_on_type", { type: w(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? j(t.expires, "batch-expires") : v`<span class="detail">${w("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${w("book.packages")}</span>
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
          ${t.packages ? j(t.packages, "batch-packages") : v`<span class="detail">${w("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-batch-dialog", gr);
//#endregion
//#region src/label-print.ts
function _r(e, t, n, r) {
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
async function vr(e, t, n) {
	if (n > 2 && !await E({
		title: w("label.confirm_many", { n }),
		action: w("label.submit")
	})) return null;
	let r = await Jt(e, {
		batch_id: t,
		count: n
	});
	return "printed" in r ? r.printed : (_r(r.image, r.count, r.width_mm, r.height_mm), 0);
}
//#endregion
//#region src/label-dialog.ts
var yr = class extends C {
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
			let e = await vr(this.hass, this.batch.id, Number(this.count));
			if (e === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-printed", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return v`<dialog></dialog>`;
		let t = this.invalid();
		return O({
			title: w("label.title", { name: e.name }),
			body: v`<label>
        <span class="lbl">${w("label.count")}</span>
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
        ${t ? j(w("valid.label_count", { max: 20 }), "label-count") : v`<span class="detail">${w("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: w("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-label-dialog", yr);
//#endregion
//#region src/scanner.ts
var br = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function xr() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: br.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-Dml86taW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...br] });
}
var Sr = class extends C {
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
			this.error = w("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = w("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await xr();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = w("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = w("scan.no_camera");
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
		return v`<dialog data-testid="scanner" @close=${this.stop} @click=${Ot()}>
      <h2>${w("scan.title")}</h2>
      ${this.error ? v`<p class="error" role="alert">${this.error}</p>` : v`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${w("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [T, o`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-scanner", Sr);
//#endregion
//#region src/booking-scan.ts
var Cr = class extends C {
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
          aria-label=${w("book.input")}
          placeholder=${w("book.input")}
          .value=${this.value}
          @input=${(e) => this.fire("query", e.target.value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${w("book.camera")}
          @click=${() => this.renderRoot.querySelector("pantry-scanner")?.open()}
        >
          ${D(qe)}<span>${w("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
    `;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-booking-scan", Cr);
//#endregion
//#region src/plan-dates.ts
var wr = [
	"day",
	"week",
	"month"
], Tr = [
	0,
	1,
	2,
	3,
	4
], X = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, Z = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Q = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), Er = (e, t) => X(Q(Z(e), t)), Dr = (e) => Q(e, -((e.getDay() + 6) % 7));
function Or(e, t) {
	return e === "day" ? [t, Q(t, 1)] : e === "week" ? [Dr(t), Q(Dr(t), 7)] : [Dr(new Date(t.getFullYear(), t.getMonth(), 1)), Q(Dr(new Date(t.getFullYear(), t.getMonth() + 1, 0)), 7)];
}
var kr = (e, t, n) => e === "month" ? new Date(t.getFullYear(), t.getMonth() + n, 1) : Q(t, n * (e === "week" ? 7 : 1)), Ar = (e) => e?.locale?.language;
//#endregion
//#region src/booking-in-fields.ts
function jr(e, t, n, r, i) {
	let a = !n.expires && e.expires_on && e.expires_on < M();
	return v`<label>
    <span class="lbl"
      >${r ? w("book.expires_on_type", { type: w(`settings.expiry.${r}`) }) : w("book.expires_on")}</span
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
    ${n.expires || a ? v`${j(n.expires, "expires")}${a ? j(w("valid.past"), "expires", !0) : ""}` : v`<span class="detail" data-testid="shelf-hint"
            >${i ? w(e.expires_on ? "book.shelf_hint" : "book.guess_hint", {
		days: String(i.value),
		source: i.source
	}) : w("book.no_date_hint")}</span
          >`}
  </label>`;
}
function Mr(e, t, n, r, i, a) {
	return v`<label>
      <span class="lbl">${w("book.location")}</span>
      ${vn({
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
    ${t.id ? b : v`<label class="check" title=${w("tip.make_default")}>
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${w("book.make_default")}
          </label>`}`;
}
function Nr(e, t, n) {
	return v`<label class="check" title=${w("tip.print")}>
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${w("label.print")}
  </label>`;
}
//#endregion
//#region src/booking-pick.ts
var Pr = "auto", Fr = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), Ir = (e, t) => Fr(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Lr(e, t, n, r) {
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
    <legend class="lbl">${w("book.which")}</legend>
    ${i(Pr, w("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, v`<span
          >${t.expires_on ? W(e, t.expires_on) : w("book.no_date")}${t.opened_on ? ` · ${w("stock.opened")}` : ""}
          · ${t.location} <span class="detail">${w("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var Rr = o`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, zr = [
	"name",
	"category_id",
	"content_amount",
	"content_unit_id"
], Br = async (e, t, n) => {
	try {
		let r = await an(e, {
			...Object.fromEntries(zr.map((e) => [e, t[e]])),
			brand: t.brand,
			ean: t.ean,
			off_json: t.off_json
		});
		if (r.status !== "changes") return { state: { kind: r.status === "ok" ? "ok" : "none" } };
		let i = n(), a = zr.filter((e) => e in r && i[e] === t[e]);
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
			message: await I(e, t)
		} };
	}
}, Vr = async (e, t, n) => {
	let { id: r } = await zt(e, t.new_type.name, t.new_type.parent_id);
	return R(e).then((e) => n.dispatchEvent(new CustomEvent("master", { detail: e })), () => void 0), {
		...t,
		category_id: r,
		new_type: void 0
	};
}, Hr = (e, t, n) => {
	let r = [];
	if ("name" in n && r.push(n.name || "–"), "category_id" in n && r.push(t?.categories.find((e) => e.id === n.category_id)?.name ?? "–"), "content_amount" in n || "content_unit_id" in n) {
		let i = t?.units.find((e) => e.id === n.content_unit_id)?.symbol ?? "";
		r.push(n.content_amount == null ? "–" : q(e, n.content_amount, i));
	}
	return r.join(", ");
}, Ur = (e, t, n, r) => {
	switch (e.kind) {
		case "running": return v`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${w("book.ai.running")}></progress>
        <span>${w("book.ai.running")}</span>
      </div>`;
		case "ok": return v`<p class="ai" role="status" data-testid="product-ai-status">
        ${w("book.ai.ok")}
      </p>`;
		case "failed": return v`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${e.message}
      </p>`;
		case "changed": return v`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${w("book.ai.changed", {
			reason: e.reason,
			before: Hr(t, n, e.before)
		})}</span
        >
        ${e.newType ? v`<span data-testid="product-ai-new-type"
                >${w("book.ai.new_type", {
			name: e.newType.name,
			parent: n?.categories.find((t) => t.id === e.newType.parent_id)?.name ?? "–"
		})}</span
              >` : b}
        <button type="button" data-testid="product-ai-undo" @click=${() => r(e.before)}>
          ${w("book.ai.undo")}
        </button>
      </div>`;
		default: return b;
	}
}, Wr = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: Pr,
	print: null
}), Gr = (e) => e?.category_id ?? e?.new_type?.parent_id ?? null, Kr = null, qr = class extends C {
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
		}), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Wr(), this.ai = { kind: "none" };
	}
	willUpdate(e) {
		if (e.has("product")) {
			this.draft = this.product, this.f = {
				...Wr(),
				expires_on: this.prefill() ? this.proposal() : ""
			}, this.initial = JSON.stringify(this.f), this.ai = { kind: "none" };
			let e = this.product;
			this.hass && this.mode === "in" && e && !e.id && e.off_json && this.check(e), this.hass && this.mode === "in" && qt(this.hass).then((e) => {
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
		let t = await Br(this.hass, e, () => this.draft);
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
			source: w("book.from_product")
		};
		let n = gn(this.md, Gr(this.draft), e);
		if (n) return n;
		if (e === "default_location_id" && Kr != null) return {
			value: Kr,
			source: w("book.last_used")
		};
	}
	prefill() {
		return !!this.labels?.prefill_expiry;
	}
	proposal() {
		let e = this.mode === "in" ? this.dflt("shelf_days") : void 0;
		return e ? Er(M(), Number(e.value)) : "";
	}
	async submit(e) {
		e.preventDefault();
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "", a = 0, o;
		if (Object.keys(this.errors(t)).length) return;
		if (!t.id && t.new_type && t.category_id == null) {
			let e = await this.run(() => Vr(n, t, this));
			if (!e) return;
			t = this.draft = e;
		}
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, o = t.id ? void 0 : ur(t);
			o && this.f.makeDefault && e !== gn(this.md, Gr(t), "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => Ht(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (Kr = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => vr(n, s.batch_id, Math.min(r, 20)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = Fr(this.stock, this.f.pick), i = await this.run(() => Ut(n, {
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
		let s = w(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${w("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return b;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? v`<h2>${w("book.title_out", { name: e.name })}</h2>
            <p class="empty" data-testid="no-stock">${w("book.no_stock")}</p>
            <div class="actions">${this.cancelButton()}</div>` : b;
		let n = this.mode === "out" ? Ir(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return v`<form class="book" @submit=${this.submit}>
      ${t ? v`<h2>
              ${w("book.title_out", { name: e.name })}${e.brand ? v` <span class="detail">${e.brand}</span>` : b}
            </h2>` : v`<h2>${w("book.title_in")}</h2>
              ${Ur(this.ai, this.hass, this.md, (e) => (this.ai = { kind: "none" }, this.setFields(e)))}
              <p class="summary" data-testid="summary">
                ${pr(this.md, e, J(this.md?.categories, e.category_id), this.hass) || w("book.new_product")}
                ${e.id ? b : v`<span class="detail">${w("book.is_new")}</span>`}
              </p>`}
      ${t ? Lr(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : v`${e.id ? b : fr(this.md, e, (e, t) => this.setProduct(e, t), r, this.hass)}${jr(this.f, this.set, r, this.dflt("expiry_type")?.value, !this.f.expires_on || this.f.expires_on === this.proposal() ? this.dflt("shelf_days") : void 0)}`}
      <label>
        <span class="lbl">${w("book.packages")}</span>
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
      ${t ? b : v`${Mr(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${Nr(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        ${this.cancelButton()}
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${w(`book.submit_${this.mode}`)}
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
      ${w("common.cancel")}
    </button>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? dr(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && (N(i, r) && (t.expires = w("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = w("valid.location")));
		let a = this.mode === "out" ? Ir(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = w("valid.packages") : a != null && n > a && (t.packages = w("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			T,
			Rr,
			St,
			o`
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
customElements.define("pantry-booking-form", qr);
//#endregion
//#region src/booking-hits.ts
function Jr(e, t) {
	return v`
    ${e.length ? b : v`<p class="empty">${w("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => v`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    <div class="actions after">
      <button type="button" data-testid="cancel" @click=${t.cancel}>${w("common.cancel")}</button>
      ${t.more ? v`${t.online ? b : v`<button
                      data-testid="search-online"
                      ?disabled=${t.busy}
                      @click=${t.searchOnline}
                    >
                      ${w("book.search_online")}
                    </button>`}
              <button data-testid="new-product" @click=${t.create}>
                ${w("book.new_product")}
              </button>` : b}
    </div>
  `;
}
//#endregion
//#region src/booking-modes.ts
var Yr = [
	["search", rt],
	["in", ut],
	["out", ot],
	["open", ct]
], Xr = (e, t) => v`<div slot="before" class="modes" role="group" aria-label=${w("stock.mode")}>
    ${Yr.map(([n, r]) => v`<button
          type="button"
          data-testid=${`mode-${n}`}
          aria-pressed=${n === e}
          aria-label=${w(`stock.mode_${n}`)}
          title=${w(`stock.mode_${n}`)}
          @click=${() => t(n)}
        >
          ${D(r)}
        </button>`)}
  </div>`, Zr = o`
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
`, Qr = (e, t) => {
	t !== void 0 && (e.message = t), e.dispatchEvent(new CustomEvent("booked")), e.focusInput();
};
async function $r(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(() => Qt(e.hass, t));
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.undo = r.taken, Qr(e, w("book.done_label", {
			name: r.name,
			where: r.location
		}));
	}
}
async function ei(e, t) {
	e.reset();
	let n = e.seq, r = await e.run(t);
	if (n === e.seq) {
		if (!r) return e.focusInput();
		e.opened = r, Qr(e);
	}
}
async function ti(e) {
	let { undo: t, opened: n } = e;
	if (e.undo = e.opened = void 0, await e.run(() => n ? er(e.hass, n.booking_id) : Wt(e.hass, t)) === void 0) return void (e.undo = t, e.opened = n);
	Qr(e, w(n ? "book.undone_open" : "book.undone"));
}
var ni = (e) => e.opened ? nr(e.hass, e.opened, () => ti(e), () => tr(e, e.opened), "open") : Gn(e.message, e.undo && (() => ti(e))), ri = /^\d{8,14}$/, ii = /^PTRY:/i, ai = class extends C {
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
		super(), this.seq = 0, this.started = !1, this.dirty = () => !!this.renderRoot.querySelector("pantry-booking-form")?.dirty(), this.run = async (e) => {
			this.busy = !0, this.error = "";
			try {
				return await e();
			} catch (e) {
				await this.fail(e);
				return;
			} finally {
				this.busy = !1;
			}
		}, this.mode = "search", this.message = "", this.online = !1, this.busy = !1, this.reset();
	}
	reset() {
		this.seq++, this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = this.opened = void 0), e.has("hass") && this.hass && !this.started && (this.started = !0, R(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e)));
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
		this.dispatchEvent(new CustomEvent("pantry-navigate", {
			detail: e === "search" ? "stock" : e,
			bubbles: !0,
			composed: !0
		})), this.focusInput();
	}
	closed() {
		(this.hits || this.product) && this.reset(), this.focusInput();
	}
	focusInput() {
		this.renderRoot.querySelector("pantry-booking-scan")?.focusInput();
	}
	async fail(e) {
		this.error = this.hass ? await I(this.hass, e) : String(e);
	}
	async find() {
		let e = this.query.trim();
		if (!e || !this.hass || this.mode === "search") return;
		let t = this.hass, n = ++this.seq;
		if (this.message = "", this.undo = this.opened = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, ii.test(e)) {
			let n = e.replace(ii, "");
			return this.mode === "open" ? ei(this, () => $n(t, n)) : $r(this, n);
		}
		if (ri.test(e)) {
			let r = await this.run(() => Bt(t, e));
			return !r || n !== this.seq ? void 0 : r.product ? this.choose(r.product) : this.mode === "in" ? this.choose(lr({ ean: e })) : void (this.error = w("book.unknown"));
		}
		let r = await this.run(() => Vt(t, e));
		r && n === this.seq && (this.hits = r, this.mode !== "in" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => Vt(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = ++this.seq, n = await this.run(() => Bt(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode !== "in" && !e.id) return void (this.error = w("book.unknown"));
		if (this.mode === "open") return ei(this, () => Qn(this.hass, { product_id: e.id }));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => z(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("pantry-booking-form");
		await n?.updateComplete, n?.focusFirst();
	}
	render() {
		let e = !!(this.hits || this.product), t = this.error ? v`<p class="error" role="alert" data-testid="error">${this.error}</p>` : b;
		return v`
      <pantry-booking-scan
        .value=${this.query}
        @query=${(e) => this.query = e.detail}
        @find=${() => this.find()}
      >
        ${Xr(this.mode, (e) => this.setMode(e))}
      </pantry-booking-scan>
      ${ni(this)} ${e ? b : t}
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${Ot(this.dirty)}
        @keydown=${kt(this.dirty)}
        @cancel=${kt(this.dirty)}
      >
        ${this.hits ? v`<h2>${w(`book.pick_${this.mode}`)}</h2>
                ${Jr(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(lr({ name: this.query.trim() })),
			cancel: () => this.closed()
		})}` : b}
        ${this.renderForm()} ${e ? t : b}
      </dialog>
    `;
	}
	renderForm() {
		return this.product ? v`<pantry-booking-form
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
    ></pantry-booking-form>` : b;
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.dispatchEvent(new CustomEvent("booked")), this.focusInput();
	}
	static {
		this.styles = [
			T,
			Kn,
			Zr,
			o`
      .after {
        margin-top: 12px;
      }
    `
		];
	}
};
customElements.define("pantry-booking", ai);
//#endregion
//#region src/stock-view.ts
var oi = class extends C {
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
			let [e, t] = await Promise.all([z(this.hass), B(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await I(this.hass, e);
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
			this.md = await R(this.hass), await this.reload();
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	tree(e) {
		let t = Vn(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return Wn(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? this.renderCategory(e.id, e.name, e.packages, e.depth, e.open) : this.renderItem(e.item, e.depth, e.open));
	}
	renderCategory(e, t, n, r, i) {
		return v`<li style="padding-left:${r * 24}px">
      ${k(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${w("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return Un(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		let t = e.expires_on ? W(this.hass, e.expires_on) : w("stock.no_date");
		return e.expiry_guessed && (t = w("stock.guessed_date", { date: t })), e.opened_on && (t = w("stock.opened_on", {
			date: t,
			opened: W(this.hass, e.opened_on)
		})), e.charge ? w("stock.charge", {
			date: t,
			charge: e.charge
		}) : t;
	}
	toggle(e) {
		this.open = jt(this.open, e);
	}
	render() {
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		return v`${v`<pantry-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e) => this.filter = e.detail}
      @booked=${this.saved}
      @pantry-print-label=${(e) => this.label(e.detail)}
    ></pantry-booking>`} ${e} ${this.stock ? this.list(this.stock) : b}`;
	}
	list(e) {
		let t = this.tree(this.filter.trim() !== "");
		return v`
      ${or(this)} ${Zn(this, "stock")}
      ${nr(this.hass, this.opened, () => ir(this), () => this.label({
			id: this.opened.batch_id,
			name: this.opened.name,
			packages: 1
		}), "opened")}
      ${Gn(this.message, void 0, "label")}
      ${t.length ? v`<ul>
              ${t}
            </ul>` : v`<p class="empty">
              ${w(e.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
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
        @pantry-printed=${(e) => this.message = e.detail ? w("label.printed", { n: e.detail }) : ""}
      ></pantry-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("pantry-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await zn(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await I(this.hass, e);
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
		this.renderRoot.querySelector("pantry-label-dialog")?.open(e);
	}
	editBatch(e) {
		this.renderRoot.querySelector("pantry-batch-dialog").open(e);
	}
	renderItem(e, t, n) {
		let r = e.batches[0], i = r ? () => this.toggle(`p${e.id}`) : () => this.editProduct(e.id);
		return v`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? k(n, i) : v`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : b}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, w("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? v` · <span class=${this.status(r)}>${this.date(r)}</span>` : b}
          </span>
        </button>
        ${A({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: F(this.hass) ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? v`<ul class="batches">
              ${e.batches.map((t) => v`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${w("book.count", { n: t.packages })}</span>
                    <span class="acts">
                      ${Xn(this, e.name, t, "stock-batch-out")}
                      ${ar(this, e.name, t)}
                      <button
                        class="icon-btn"
                        data-testid="stock-batch-label"
                        aria-label=${w("label.print_name", { name: e.name })}
                        title=${w("label.print")}
                        @click=${() => this.printBatch(t, e.batches)}
                      >
                        ${D(pt)}
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
			T,
			Kn,
			sr,
			cr
		];
	}
};
customElements.define("pantry-stock", oi);
//#endregion
//#region src/expiry-recipes.ts
var si = class extends C {
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
			let t = await $t(this.hass, this.days);
			e === this.latest && (this.list = t);
		} catch {
			this.list = [];
		}
	}
	open(e) {
		this.dispatchEvent(new CustomEvent("pantry-navigate", {
			detail: `recipes/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return this.list.length ? v`<h2>${w("expiry.recipes")}</h2>
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
                  >${w("expiry.recipe_detail", {
			...e,
			products: e.products.join(", ")
		})}</span
                >
              </button>
            </li>`)}
      </ul>` : b;
	}
	static {
		this.styles = [T, o`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `];
	}
};
customElements.define("pantry-expiry-recipes", si);
//#endregion
//#region src/expiry-view.ts
var ci = class extends C {
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
				R(this.hass),
				z(this.hass),
				B(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? w("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(fn(this.hass), { numeric: "auto" }).format(Hn(e), "day");
	}
	render() {
		let e = this.error ? v`<p class="error" role="alert">${this.error}</p>` : b;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: Un(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return v`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${w("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${w("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${w("common.days_unit")}
        </span>
        ${j(t, "expiry-days")}
      </div>
      ${Zn(this, "expiry")}
      ${r.length ? v`<ul>
              ${r.map(({ r: e, status: t }) => v`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}>${W(this.hass, e.expires_on)}</span>
                      <span class="detail"
                        >${this.relative(e.expires_on)}${e.expiry_guessed ? ` · ${w("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[
			e.brand,
			e.opened_on && w("stock.opened"),
			e.location
		].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${w("book.count", { n: e.packages })}</span>
                    ${Xn(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : v`<p class="empty">${w("expiry.empty")}</p>`}
      ${U("recipes") ? v`<pantry-expiry-recipes
              .hass=${this.hass}
              .days=${n}
              .stock=${this.stock}
            ></pantry-expiry-recipes>` : b}
    `;
	}
	static {
		this.styles = [
			T,
			Kn,
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
customElements.define("pantry-expiry", ci);
//#endregion
//#region node_modules/lit-html/directive.js
var $ = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, li = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ui = class {
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
}, { I: di } = Be, fi = (e) => e.strings === void 0, pi = {}, mi = (e, t = pi) => e._$AH = t, hi = li(class extends ui {
	constructor(e) {
		if (super(e), e.type !== $.PROPERTY && e.type !== $.ATTRIBUTE && e.type !== $.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!fi(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === y || t === b) return t;
		let n = e.element, r = e.name;
		if (e.type === $.PROPERTY) {
			if (t === n[r]) return y;
		} else if (e.type === $.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return y;
		} else if (e.type === $.ATTRIBUTE && n.getAttribute(r) === t + "") return y;
		return mi(e), t;
	}
}), gi = (e) => e.callWS({ type: "pantry/shopping" }), _i = (e, t, n) => e.callWS({
	type: "pantry/shopping_done",
	...t.product_id ? { product_id: t.product_id } : { category_id: t.category_id },
	done: n
}), vi = (e, t) => e.callWS({
	type: "pantry/shopping_add",
	...t
}), yi = (e, t, n) => e.callWS({
	type: "pantry/shopping_item",
	item_id: t,
	...n
}), bi = (e, t) => e.callWS({
	type: "pantry/shopping_item_delete",
	item_id: t
}), xi = (e) => e.callWS({ type: "pantry/shopping_recipes" }), Si = (e, t, n, r) => e.callWS({
	type: "pantry/shopping_recipe_set",
	recipe_id: t,
	servings: n,
	optional: r
}), Ci = (e, t) => e.callWS({
	type: "pantry/shopping_recipe_remove",
	recipe_id: t
}), wi = (e, t, n) => e.callWS({
	type: "pantry/shopping_recipe_done",
	key: t,
	done: n
});
//#endregion
//#region src/shopping-text.ts
function Ti(e, t) {
	let n = (t) => q(e, t.missing, t.unit_symbol);
	if (t.manual) return [t.product_id ? t.brand : w("shopping.any"), w("book.count", { n: t.packages })].filter(Boolean).join(" · ");
	if (t.key) return t.amount ? n(t.amount) : w("book.count", { n: t.packages ?? 1 });
	let r = [];
	t.amount && r.push(n(t.amount)), t.packages && r.push(w("book.count", { n: t.packages }));
	let i = w(t.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: r.join(w("shopping.and")) });
	return [t.brand, i].filter(Boolean).join(" · ");
}
function Ei(e, t) {
	let n = t.recipes.map((t) => {
		let n = t.amount == null ? null : q(e, t.amount, t.unit_symbol);
		return {
			text: n == null ? `${t.no}` : `${t.no}:${n}`,
			title: w(n == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
				no: t.no,
				name: t.name,
				amount: n ?? ""
			})
		};
	}), r = t.amount?.unknown_products;
	return {
		uses: n,
		unknown: r ? w("shopping.unknown", { n: r }) : ""
	};
}
//#endregion
//#region src/shopping-row-styles.ts
var Di = o`
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
`, Oi = 8, ki = class extends C {
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
			[this.md, this.products] = await Promise.all([R(this.hass), B(this.hass)]);
		} catch (e) {
			this.error = await I(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return J(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = w("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, dr(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = w("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = w("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await yi(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await vi(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await vi(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await vi(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await vi(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
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
		let t = (t) => !!t && K(t, e), n = this.products.filter((e) => t(e.name) || t(e.brand)).slice(0, Oi), r = (this.md?.categories ?? []).filter((e) => t(e.name)).slice(0, Oi), i = lr({ name: e });
		return v`<ul>
      ${n.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${r.map((e) => this.hit("shopping-hit", e.name, w("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", w("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: i
		})}
      ${F(this.hass) ? this.hit("shopping-new-category", w("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : b}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return v`<label>
          <span class="lbl">${w("shopping.add.what")}</span>
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
      ${w("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? v`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : w("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? v`<p class="detail">${w("shopping.add.creates_product")} ${n}</p>
        ${fr(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : v`<p class="detail">${w("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${w("common.name")}</span>
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
        <span class="lbl">${w("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${w("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></pantry-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors();
		return O({
			title: this.item ? w("common.edit_name", { name: this.item.name }) : w("shopping.add.title"),
			body: v`${this.item ? b : this.what(e)}
        <label>
          <span class="lbl">${w("shopping.add.packages")}</span>
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
            <span class="detail">${w("book.packages")}</span>
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
		this.styles = T;
	}
};
customElements.define("pantry-shopping-add", ki);
//#endregion
//#region src/shopping-recipe-dialog.ts
var Ai = class extends C {
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
		let n = (await xi(this.hass)).find((t) => t.recipe_id === e.id), r = t ?? n?.servings ?? e.servings;
		if (e.ingredients.some((e) => e.optional)) return this.open(e, r, n?.optional);
		await Si(this.hass, e.id, r, []), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	errors() {
		let e = this.servings;
		return e == null || !Number.isInteger(e) || e < 1 || e > 99 ? { servings: w("valid.servings") } : {};
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) {
			try {
				await Si(this.hass, this.recipe.id, this.servings, [...this.chosen]);
			} catch (e) {
				this.error = await I(this.hass, e);
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
		if (!this.active || !this.recipe) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.recipe.ingredients.filter((e) => e.optional && e.id != null);
		return O({
			title: w("shopping.recipe.title", { name: this.recipe.name }),
			body: v`<label>
          <span class="lbl">${w("recipes.servings")}</span>
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
                <legend class="lbl">${w("shopping.recipe.optional")}</legend>
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
				label: w("shopping.recipe.submit"),
				testid: "shopping-recipe-save"
			},
			dirty: () => this.servings !== this.start.servings || this.chosen.size !== this.start.chosen.size || [...this.chosen].some((e) => !this.start.chosen.has(e)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-shopping-recipe-dialog", Ai);
//#endregion
//#region src/shopping-recipes.ts
var ji = class extends C {
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
			[this.list, this.recipes] = await Promise.all([xi(this.hass), V(this.hass)]), this.error = "";
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	edit(e) {
		let t = this.recipes.find((t) => t.id === e.recipe_id);
		t && this.renderRoot.querySelector("pantry-shopping-recipe-dialog").open(t, e.servings, e.optional);
	}
	async removeEntry(e) {
		if (await Tt(e.name)) {
			try {
				await Ci(this.hass, e.recipe_id);
			} catch (e) {
				this.error = await I(this.hass, e);
				return;
			}
			await this.load(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      <pantry-shopping-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-recipe-dialog>
      ${this.list.length ? v`<h3>${w("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map((e) => v`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${w("shopping.recipe.no", { no: e.no })}
                        >${e.no}</span
                      >
                      <span class="grow">${e.name}</span>
                      <span class="detail">${hn(this.hass, e.servings)}</span>
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
		this.styles = [T, o`
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
customElements.define("pantry-shopping-recipes", ji);
//#endregion
//#region src/shopping-view.ts
var Mi = class extends C {
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
		e.has("hass") && this.hass && !this.started && (this.started = !0, this.load(), qt(this.hass).then((e) => this.receipt = e.receipt, () => void 0));
	}
	async print() {
		if (!this.printing) {
			this.printing = !0, this.error = this.note = "";
			try {
				let { printed: e } = await Yt(this.hass);
				this.note = w("shopping.printed", { n: e });
			} catch (e) {
				this.error = await I(this.hass, e);
			} finally {
				this.printing = !1;
			}
		}
	}
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([gi(this.hass), R(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await yi(this.hass, e.id, { done: t }) : e.key ? await wi(this.hass, e.key, t) : await _i(this.hass, e, t);
		} catch (e) {
			return this.error = await I(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await Tt(e.name)) {
			this.error = "";
			try {
				await bi(this.hass, e.id);
			} catch (e) {
				return this.error = await I(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("pantry-shopping-add").open(e);
	}
	row(e, t, n = !1) {
		let r = Ti(this.hass, e), i = Ei(this.hass, e), a = r ? `${e.name} – ${r}` : e.name;
		return v`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${hi(e.done)}
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
          ${w("shopping.add.title")}
        </button>
        ${this.receipt ? v`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((e) => !e.done)}
                @click=${() => this.print()}
              >
                ${w("shopping.print")}
              </button>` : b}
      </div>
      ${this.note ? v`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : b}
      <pantry-shopping-recipes
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-recipes>
      <pantry-shopping-add
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-add>`}
    ${this.items.length ? v`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : v`<p class="empty">${w("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [
			T,
			Di,
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
customElements.define("pantry-shopping", Mi);
//#endregion
//#region src/recipes-styles.ts
var Ni = o`
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
`, Pi = 2e3, Fi = (e) => e.flatMap((e) => [...e.section ? [{
	kind: "head",
	text: e.section
}] : [], {
	kind: "step",
	text: e.text
}]), Ii = (e) => (e ?? "").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean).map((e) => ({
	kind: "step",
	text: e
})), Li = (e) => {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		e && (r.kind === "head" ? n = e : (t.push({
			section: n,
			text: e
		}), n = null));
	}
	return t;
}, Ri = (e, t = (e) => e.text) => {
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
}, zi, Bi = class extends C {
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
		super.connectedCallback(), zi ??= qt(this.hass).then((e) => e.receipt, () => !1), zi.then((e) => this.available = e);
	}
	async run() {
		this.busy = !0;
		try {
			await this.print(), this.note = this.done;
		} catch (e) {
			this.note = await I(this.hass, e);
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
        ${w("common.print")}
      </button>
      ${this.note ? v`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >` : b}` : b;
	}
};
customElements.define("pantry-receipt-button", Bi);
//#endregion
//#region src/recipe-detail.ts
var Vi = (e, t, n, r) => {
	if (n.amount == null) return "";
	let i = n.amount * r, a = t.units.find((e) => e.id === n.unit_id), o = q(e, i, a?.symbol), s = a?.recipe_only ? t.units.find((e) => e.id === a.base_unit_id) : void 0;
	return !a || !s ? o : `${o} (${w("recipes.approx", { what: q(e, i * a.factor / s.factor, s.symbol) })})`;
}, Hi = (e, t) => {
	let n = t.unit_symbol ?? "";
	switch (t.status) {
		case "missing": return t.need == null ? w("recipes.status.missing_plain") : w("recipes.status.missing", { what: q(e, t.missing ?? 0, n) });
		case "partial": return w("recipes.status.partial", {
			have: G(e, t.have ?? 0),
			need: G(e, t.need ?? 0),
			unit: n
		});
		case "unknown": return w("recipes.status.unknown");
		case "skipped": return w("recipes.status.skipped");
		case "unmatched": return w("recipes.status.unmatched");
		default: return w("recipes.status.available");
	}
}, Ui = (e) => {
	let t = e.recipe;
	return v`<div class="detail-box">
    <label class="servings">
      <span class="lbl">${w(H(t) ? "canning.recipe_jars" : "recipes.servings")}</span>
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
              ${[Vi(e.hass, e.md, n, e.servings / t.servings), e.md.categories.find((e) => e.id === n.category_id)?.name ?? n.text].filter(Boolean).join(" ")}
              ${n.note ? v`<span class="detail">${n.note}</span>` : b}
              ${n.optional ? v`<span class="detail">${w("recipes.optional")}</span>` : b}
            </span>
            <span class="st ${n.status}" data-testid="ingredient-status">${Hi(e.hass, n)}</span>
          </li>`)}
    </ul>
    <p class="shopping">
      ${U("shopping") ? v`<button type="button" data-testid="recipe-to-shopping" @click=${e.onShopping}>
              ${w("recipes.to_shopping")}
            </button>` : b}
      ${H(t) ? v`<button type="button" data-testid="recipe-to-canning" @click=${e.onPlan}>
              ${w("canning.add")}
            </button>` : U("plan") ? v`<button type="button" data-testid="recipe-to-plan" @click=${e.onPlan}>
                ${w("recipes.to_plan")}
              </button>` : b}
      <pantry-receipt-button
        .hass=${e.hass}
        .print=${() => Xt(e.hass, t.id, e.servings)}
        .done=${w("recipes.printed")}
        .testid=${"recipe-print"}
      ></pantry-receipt-button>
      ${t.shopping_servings != null && U("shopping") ? v`<span class="detail" data-testid="recipe-on-shopping"
              >${w("recipes.on_shopping", { what: hn(e.hass, t.shopping_servings) })}</span
            >` : b}
    </p>
    ${H(t) ? v`<p data-testid="recipe-canning">
            ${w("canning.recipe_summary", {
		name: t.canning_product ?? "",
		jars: t.servings
	})}
            ${t.canning_temp == null ? "" : w("recipes.canning", {
		temp: t.canning_temp,
		minutes: t.canning_minutes ?? ""
	})}
          </p>` : b}
    ${t.steps.length ? v`<h3>${w("recipes.instructions")}</h3>
            ${Ri(t.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${e.onCook}>
                ${w("cook.open")}
              </button>
            </p>` : t.instructions ? v`<h3>${w("recipes.instructions")}</h3>
              <p class="text">${t.instructions}</p>` : b}
    ${t.source_url ? v`<p>
            <a href=${t.source_url} target="_blank" rel="noopener noreferrer"
              >${w("recipes.source")}</a
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
}, Wi = (e) => e.category_id == null && !e.text.trim() && e.amount == null && !e.note?.trim(), Gi = (e) => e.map((e) => {
	let t = {};
	return Wi(e) || (!e.text.trim() && e.category_id == null && (t.text = w("valid.ingredient_what")), e.amount != null && !(e.amount > 0) ? t.amount = w("valid.positive") : e.amount != null && e.unit_id == null && (t.pair = e.unit_hint ? w("recipes.ingredient.unit_unknown", { unit: e.unit_hint }) : w("valid.amount_pair"))), t;
}), Ki = (e, t, n, r) => ({
	name: e.trim() || "-",
	servings: t ?? 1,
	steps: Li(n),
	ingredients: r.map((e) => ({
		category_id: e.category_id,
		amount: e.amount,
		unit_id: e.unit_id,
		text: e.text.slice(0, 200),
		note: e.note ?? null,
		line: e.line ?? null,
		learned: !!e.learned
	}))
}), qi = (e, t, n, r, i) => {
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
	let s = JSON.stringify(r.steps) === JSON.stringify(n), c = e.steps && s ? Fi(e.steps) : r.steps, l = {
		kind: "changed",
		ingredients: o,
		prevSteps: c === r.steps ? void 0 : r.steps
	};
	return {
		ingredients: a,
		steps: c,
		state: o || l.prevSteps ? l : { kind: "ok" }
	};
}, Ji = (e, t) => {
	switch (e.kind) {
		case "running": return v`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${w("recipes.ai.running")}></progress>
        <span>${w("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${t.onSkip}>
          ${w("recipes.ai.skip")}
        </button>
      </div>`;
		case "ok": return v`<p class="ai" role="status" data-testid="ai-status">${w("recipes.ai.ok")}</p>`;
		case "skipped": return v`<p class="ai" role="status" data-testid="ai-status">
        ${w("recipes.ai.skipped")}
      </p>`;
		case "failed": return v`<p class="ai error" role="alert" data-testid="ai-status">${e.message}</p>`;
		case "changed": return v`<div class="ai" role="status" data-testid="ai-status">
        ${e.ingredients ? v`<span
                >${e.ingredients === 1 ? w("recipes.ai.changed_one") : w("recipes.ai.changed_many", { n: e.ingredients })}</span
              >` : b}
        ${e.prevSteps ? v`<span>${w("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${t.onUndoSteps}>
                  ${w("recipes.ai.undo_steps")}
                </button>` : b}
      </div>`;
		default: return b;
	}
}, Yi = (e) => {
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
}, Xi = (e, t, n, r) => {
	let i = e.ai;
	if (!i) return b;
	let a = n.find((e) => e.id === i.beforeUnit)?.symbol ?? i.beforeHint, o = [i.cat ? i.beforeText : null, i.unit ? a : null].filter(Boolean);
	return v`<div class="orig" data-testid="ingredient-ai">
    ${e.new_type && i.cat ? w("recipes.ai.new_type", {
		name: e.new_type.name,
		parent: t.find((t) => t.id === e.new_type.parent_id)?.name ?? "–",
		reason: i.reason
	}) : w("recipes.ai.changed", {
		reason: i.reason,
		before: o.join(", ") || "–"
	})}
    <button type="button" data-testid="ingredient-ai-undo" @click=${() => r(Yi(e))}>
      ${w("recipes.ai.undo")}
    </button>
  </div>`;
}, Zi = 8, Qi = class extends C {
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
			let t = await Vt(this.hass, e.trim());
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
			await zt(this.hass, this.creating, e);
			let t = await R(this.hass), n = t.categories.find((t) => t.parent_id === e && t.name === this.creating);
			this.dispatchEvent(new CustomEvent("master", { detail: t })), this.creating = void 0, n && this.pick(n.id);
		} catch (e) {
			this.failure = await I(this.hass, e);
		}
	}
	foods() {
		return this.categories.filter((e) => e.effective.food.value !== 0);
	}
	hits(e) {
		let t = (e) => this.categories.some((t) => t.parent_id === e.id), n = this.foods().filter((t) => K(t.name, e)).sort((e, n) => Number(t(e)) - Number(t(n))).map((e) => ({ cat: e })), r = this.products.filter((e) => !n.some((t) => t.cat.id === e.cat.id));
		return [...n, ...r].slice(0, Zi);
	}
	hit(e) {
		let t = J(this.categories, e.cat.parent_id), n = [e.via ? w("recipes.ingredient.via", { name: e.via }) : "", t].filter(Boolean).join(" · ");
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
                <span>${w("recipes.ingredient.new_type", { name: e })}</span>
              </button>
            </li>`}
    </ul>`;
	}
	render() {
		let e = this.categories.find((e) => e.id === this.value);
		return e ? v`<div class="lbl">${w("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${e.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${w("shopping.add.change")}
          </button>
        </p>` : this.creating ? v`<div class="field">
        <span class="lbl">${w("recipes.ingredient.parent", { name: this.creating })}</span>
        <pantry-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e) => this.create(e.detail)}
        ></pantry-category-picker>
        ${this.failure ? v`<p class="error" role="alert">${this.failure}</p>` : b}
        <button type="button" class="reset" @click=${() => this.creating = void 0}>
          ${w("common.cancel")}
        </button>
      </div>` : v`<label>
        <span class="lbl">${w("recipes.ingredient.text")}</span>
        ${this.text ? v`<span class="detail">${this.text} – ${w("recipes.ingredient.unmatched")}</span>` : b}
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
		this.styles = T;
	}
};
customElements.define("pantry-ingredient-pick", Qi);
//#endregion
//#region src/unit-add-dialog.ts
var $i = class extends C {
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
				let { id: e } = await on(this.hass, this.name.trim(), this.symbol.trim() || void 0), t = await R(this.hass);
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("unit-added", { detail: {
					id: e,
					md: t
				} }));
			} catch (e) {
				this.error = await I(this.hass, e);
			} finally {
				this.busy = !1;
			}
		}
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.name.trim() ? void 0 : w("valid.required");
		return O({
			title: w("unit_add.title"),
			body: v`<label>
          <span class="lbl">${w("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!e}
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
          ${j(e, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${w("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e) => this.symbol = e.target.value}
          />
        </label>`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: w("common.save"),
				testid: "unit-add-save"
			},
			dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [T];
	}
};
customElements.define("pantry-unit-add-dialog", $i);
//#endregion
//#region src/recipe-ingredients.ts
var ea = class extends C {
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
          <span class="lbl">${w("recipes.ingredient.amount")}</span>
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
          <span class="lbl">${w("recipes.ingredient.unit")}</span>
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
            <option value="" .selected=${e.unit_id == null}>${w("recipes.ingredient.none")}</option>
            ${this.units.map((t) => v`<option value=${t.id} .selected=${t.id === e.unit_id}>${t.symbol}</option>`)}
            <option value="new">${w("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${j(n.amount ?? (r ? void 0 : n.pair), "ingredient-amount")}
      ${r ? v`<div class="hintline">
              ${j(w("recipes.ingredient.unit_unknown", { unit: e.unit_hint ?? "" }), "ingredient-unit", !0)}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(t, e.unit_hint ?? "")}
              >
                ${w("recipes.ingredient.unit_create")}
              </button>
            </div>` : b}
      ${e.line ? v`<div class="orig" data-testid="ingredient-line">
              ${w("recipes.ingredient.line", { line: e.line })}
            </div>` : b}
      ${Xi(e, this.categories, this.units, (e) => this.set(t, e))}
      <label>
        <span class="lbl">${w("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${e.note ?? ""}
          @input=${(e) => this.set(t, { note: e.target.value })}
        />
      </label>
      <div class="foot">
        <label class="check" title=${w("tip.optional")}>
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${e.optional}
            @change=${(e) => this.set(t, { optional: e.target.checked })}
          />
          ${w("recipes.ingredient.optional")}
        </label>
        <label class="check" title=${w("tip.skip_stock")}>
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${e.skip_stock}
            @change=${(e) => this.set(t, { skip_stock: e.target.checked })}
          />
          ${w("recipes.ingredient.skip_stock")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${w("recipes.ingredient.remove")}
          title=${w("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((e, n) => n !== t))}
        >
          ${D(Qe)}
        </button>
      </div>
    </li>`;
	}
	render() {
		let e = Gi(this.value);
		return v`<pantry-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e) => this.unitAdded(e)}
      ></pantry-unit-add-dialog>
      <div class="lbl">${w("recipes.ingredients")}</div>
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
        ${w("recipes.ingredient.add")}
      </button>`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-recipe-ingredients", ea);
//#endregion
//#region src/form-fields.ts
var ta = (e) => v`<label>
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
        @input=${(t) => e.onChange(P(t.target.value))}
      />
      ${e.unit}
    </span>
    ${j(e.err, e.testid)}
  </label>`, na = (e) => v`<label>
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
  </label>`;
//#endregion
//#region src/product-input.ts
function ra(e) {
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
      ${j(e.err.name ?? (r ? w("canning.new_product") : void 0), t, !e.err.name)}
    </label>
    ${r ? v`<div class="field">
            <span class="lbl">${w("book.category")}</span>
            <pantry-category-picker
              .categories=${e.md?.categories ?? []}
              .value=${e.categoryId}
              .hass=${e.hass}
              @change=${(t) => e.onCategory(t.detail)}
            ></pantry-category-picker>
            ${j(e.err.category, `${t}-category`)}
          </div>` : b}`;
}
//#endregion
//#region src/recipe-steps-editor.ts
var ia = (e) => e.text.length > (e.kind === "head" ? 100 : 2e3) ? w("valid.too_long", { n: e.kind === "head" ? 100 : Pi }) : void 0, aa = class extends C {
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
      ${D(n)}
    </button>`;
	}
	render() {
		let e = 0, t = this.value.length - 1;
		return v`<span class="lbl">${w("recipes.instructions")}</span>
      <ol>
        ${this.value.map((n, r) => {
			let i = n.kind === "head" ? w("recipes.steps.head") : w("recipes.steps.step", { n: ++e }), a = ia(n), o = (e) => this.emit(this.value.map((t, n) => n === r ? {
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
              ${this.btn("step-up", w("recipes.steps.up"), Ke, () => this.move(r, -1), r === 0)}
              ${this.btn("step-down", w("recipes.steps.down"), Ge, () => this.move(r, 1), r === t)}
              ${this.btn("step-remove", w("recipes.steps.remove"), Qe, () => this.emit(this.value.filter((e, t) => t !== r)))}
            </div>
            ${j(a, `step-${r}`)}
          </li>`;
		})}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${w("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${w("recipes.steps.head_add")}
        </button>
      </p>`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-recipe-steps", aa);
//#endregion
//#region src/recipe-draft.ts
var oa = (e) => ({
	name: e?.name ?? "",
	servings: e?.servings ?? 4,
	steps: e?.steps?.length ? Fi(e.steps) : Ii(e?.instructions ?? null),
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
}), sa = (e, t) => {
	let n = t?.find((t) => t.name === e.product.trim());
	return {
		name: e.name.trim(),
		servings: e.servings,
		steps: Li(e.steps),
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
		ingredients: e.ingredients.filter((e) => !Wi(e)).map((e) => ({
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
}, ca = class extends C {
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
		super(), this.aiRun = 0, this.initial = "", this.canningMode = !1, this.products = [], this.draft = oa(), this.active = !1, this.error = "", this.ai = { kind: "none" };
	}
	async open(e, t, n, r = !1) {
		this.md = e, this.recipe = t, this.canningMode = r, r && (this.products = await B(this.hass).catch(() => [])), this.draft = oa(t ?? n), this.initial = JSON.stringify(n ? oa() : this.draft), this.error = "", this.ai = { kind: "none" }, this.aiRun++, this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus(), n && this.check();
	}
	async check() {
		let e = ++this.aiRun, t = this.draft, n = t.ingredients;
		this.ai = { kind: "running" };
		try {
			let r = await rn(this.hass, Ki(t.name, t.servings, t.steps, n));
			if (e !== this.aiRun) return;
			if (r.status !== "changes") {
				this.ai = { kind: r.status === "ok" ? "ok" : "none" };
				return;
			}
			let i = qi(r, n, t.steps, this.draft, this.md);
			this.draft = {
				...this.draft,
				ingredients: i.ingredients,
				steps: i.steps
			}, this.ai = i.state;
		} catch (t) {
			e === this.aiRun && (this.ai = {
				kind: "failed",
				message: await I(this.hass, t)
			});
		}
	}
	errors() {
		let e = this.draft, t = {};
		e.name.trim() || (t.name = w("valid.required")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = w("valid.servings")), e.source_url.trim() && !Nt.test(e.source_url.trim()) && (t.source_url = w("valid.url")), e.image_url.trim() && !Nt.test(e.image_url.trim()) && (t.image_url = w("valid.url")), this.canningMode && !e.product.trim() ? t.product = w("valid.required") : this.canningMode && !this.products.some((t) => t.name === e.product.trim()) && e.product_category == null && (t.product_category = w("valid.category"));
		let n = e.canning_temp, r = e.canning_minutes;
		return n != null && !(Number.isInteger(n) && n >= 1 && n <= 200) ? t.canning_temp = w("valid.canning_temp") : n == null && r != null && (t.canning_temp = w("valid.required")), r != null && !(Number.isInteger(r) && r >= 1 && r <= 1440) ? t.canning_minutes = w("valid.canning_minutes") : r == null && n != null && (t.canning_minutes = w("valid.required")), {
			e: t,
			bad: Gi(e.ingredients).some((e) => Object.keys(e).length) || e.steps.some((e) => ia(e))
		};
	}
	async save(e) {
		e.preventDefault();
		let { e: t, bad: n } = this.errors();
		if (Object.keys(t).length || n) return;
		let r = this.draft;
		try {
			await tn(this.hass, {
				...this.recipe ? { id: this.recipe.id } : {},
				...sa(r, this.canningMode ? this.products : null)
			});
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
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
		return ta({
			testid: `recipe-${e}`,
			label: w(`recipes.field.${e}`),
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
		return O({
			title: this.recipe ? w("common.edit_name", { name: this.recipe.name }) : w(this.canningMode ? "canning.recipe_add" : "recipes.add"),
			body: v`${Ji(this.ai, {
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
        ${this.text("name", w("common.name"), e.name)}
        ${this.canningMode ? ra({
				testid: "recipe",
				label: w("canning.recipe_makes"),
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
            >${w(this.canningMode ? "canning.recipe_jars" : "recipes.servings")}</span
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
                ${this.canning("canning_minutes", w("recipes.minutes_unit"), e.canning_minutes)}
              </div>` : b}
        ${this.text("source_url", w("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", w("recipes.field.image_url"), e.image_url, "url")}
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
        ></pantry-recipe-ingredients>
        <pantry-recipe-steps
          .value=${n.steps}
          @change=${(e) => this.draft = {
				...n,
				steps: e.detail
			}}
        ></pantry-recipe-steps>`,
			error: this.error,
			invalid: Object.keys(e).length > 0 || t || this.ai.kind === "running",
			submit: {
				label: w("common.save"),
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
		this.styles = [T, St];
	}
};
customElements.define("pantry-recipe-dialog", ca);
//#endregion
//#region src/recipe-import.ts
var la = [
	"url",
	"text",
	"photo"
], ua = 2e4, da = 2e3, fa = async (e) => {
	let t = await createImageBitmap(e), n = Math.min(1, da / Math.max(t.width, t.height)), r = document.createElement("canvas");
	return r.width = Math.round(t.width * n), r.height = Math.round(t.height * n), r.getContext("2d").drawImage(t, 0, 0, r.width, r.height), t.close(), r.toDataURL("image/jpeg", .85);
}, pa = class extends C {
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
		if (this.source === "text") return this.text.trim() ? void 0 : w("valid.required");
		if (this.source === "photo") return this.photo ? void 0 : w("valid.required");
		let e = this.url.trim();
		return e ? Nt.test(e) ? void 0 : w("valid.url") : w("valid.required");
	}
	request() {
		return this.source === "text" ? { text: this.text.trim() } : this.source === "photo" ? { image: this.photo } : { url: this.url.trim() };
	}
	async pickPhoto(e) {
		let t = e.target.files?.[0];
		if (this.photo = "", this.error = "", t) try {
			this.photo = await fa(t);
		} catch {
			this.error = w("recipes.import.photo_invalid");
		}
	}
	async submit(e) {
		if (e.preventDefault(), !(this.errors() || this.busy)) {
			this.busy = !0, this.error = "";
			try {
				let e = await nn(this.hass, this.request());
				this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-imported", { detail: e }));
			} catch (e) {
				this.error = await I(this.hass, e);
			}
			this.busy = !1;
		}
	}
	switcher() {
		return v`<div class="sources" role="group" aria-label=${w("recipes.import.source")}>
      ${la.map((e) => v`<button
            type="button"
            data-testid=${`recipe-import-source-${e}`}
            aria-pressed=${e === this.source}
            ?disabled=${this.busy}
            @click=${() => {
			this.source = e, this.error = "", this.focusField();
		}}
          >
            ${w(`recipes.import.source_${e}`)}
          </button>`)}
    </div>`;
	}
	field(e) {
		return this.source === "text" ? v`<label>
        <span class="lbl">${w("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${ua}
          data-testid="recipe-import-text"
          aria-invalid=${!!e}
          .value=${this.text}
          @input=${(e) => this.text = e.target.value}
        ></textarea>
        ${j(e, "recipe-import-text")}
        <span class="note">${w("recipes.import.text_hint")}</span>
      </label>` : this.source === "photo" ? v`<label>
        <span class="lbl">${w("recipes.import.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="recipe-import-photo"
          aria-invalid=${!!e}
          @change=${(e) => this.pickPhoto(e)}
        />
        ${j(e, "recipe-import-photo")}
        <span class="note">${w("recipes.import.photo_hint")}</span>
      </label>` : v`<label>
      <span class="lbl">${w("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!e}
        .value=${this.url}
        @input=${(e) => this.url = e.target.value}
      />
      ${j(e, "recipe-import-url")}
      <span class="note">${w(dn() ? "recipes.import.hint_ai" : "recipes.import.hint")}</span>
    </label>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors();
		return O({
			title: w("recipes.import.title"),
			body: v`${dn() ? this.switcher() : b} ${this.field(e)}
      ${this.busy ? v`<div class="busy" role="status" data-testid="recipe-import-busy">
              <progress aria-label=${w("recipes.import.busy")}></progress>
              <span>${w(dn() ? "recipes.import.busy_ai" : "recipes.import.busy")}</span>
            </div>` : b}`,
			error: this.error,
			invalid: !!e || this.busy,
			submit: {
				label: w("recipes.import.submit"),
				testid: "recipe-import-submit"
			},
			dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
			onSubmit: (e) => this.submit(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-recipe-import", pa);
//#endregion
//#region src/api-plan.ts
var ma = (e, t, n) => e.callWS({
	type: "pantry/meal_plan",
	start: t,
	end: n
}), ha = (e, t) => e.callWS({
	type: "pantry/meal_save",
	data: t
}), ga = (e, t) => e.callWS({
	type: "pantry/meal_delete",
	meal_id: t
}), _a = (e, t, n, r) => e.callWS({
	type: "pantry/meal_shift",
	day: t,
	slot: n,
	apply: r
}), va = (e, t, n) => e.callWS({
	type: "pantry/plan_to_shopping_list",
	start: t,
	end: n
}), ya = class extends C {
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
		this.recipes = n.filter((e) => !H(e)), this.meal = i, this.draft = {
			day: i?.day ?? e,
			slot: i?.slot ?? t,
			text: i?.name ?? a,
			servings: i?.servings ?? r,
			dateBad: !1
		}, this.initial = JSON.stringify(this.draft), this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = this.draft, t = {};
		return e.text.trim() || (t.text = w("valid.required")), (!e.day || N(e.dateBad, e.day)) && (t.day = w("valid.date")), (e.servings == null || !Number.isInteger(e.servings) || e.servings < 1 || e.servings > 99) && (t.servings = w("valid.servings")), t;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.draft, n = t.text.trim();
		try {
			await ha(this.hass, {
				...this.meal ? { id: this.meal.id } : {},
				day: t.day,
				slot: t.slot,
				recipe_id: this.recipes.find((e) => e.name === n)?.id ?? null,
				text: n,
				servings: t.servings
			});
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.draft;
		return O({
			title: this.meal ? w("common.edit_name", { name: this.meal.name }) : w("plan.add"),
			body: v`<label>
          <span class="lbl">${w("plan.date")}</span>
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
          <span class="lbl">${w("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(t.slot)}
            @change=${(e) => this.draft = {
				...t,
				slot: Number(e.target.value)
			}}
          >
            ${Tr.map((e) => v`<option value=${e} ?selected=${e === t.slot}>${w(`plan.slot.${e}`)}</option>`)}
          </select>
        </label>
        <label>
          <span class="lbl">${w("plan.dish")}</span>
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
          <span class="lbl">${w("recipes.servings")}</span>
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
				label: w("common.save"),
				testid: "meal-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-meal-dialog", ya);
//#endregion
//#region src/cook-mode.ts
var ba = (e) => {
	let t = Math.max(0, Math.ceil(e / 1e3)), n = Math.floor(t / 3600), r = String(Math.floor(t % 3600 / 60)).padStart(n ? 2 : 1, "0"), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${r}:${i}` : `${r}:${i}`;
}, xa = () => {
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
}, Sa = class extends C {
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
		(!this.timers.some((e) => e.end > Date.now()) || await E({
			title: w("cook.stop"),
			action: w("cook.stop_ok")
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
		this.now = Date.now(), this.timers.some((t) => t.end <= this.now && t.end > e) && xa();
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
            aria-label=${w("cook.timer_start", { what: e.label })}
            @click=${() => this.start(t, e.label, e.seconds)}
          >
            ${D(mt)} ${e.label}
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
        <h2>${w("cook.title", { name: e.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${w("cook.close")}
          title=${w("cook.close")}
          @click=${() => this.close()}
        >
          ${D(Qe)}
        </button>
      </header>
      <h3>${w("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map((e) => v`<li>
              ${[Vi(this.hass, this.md, e, t), this.md.categories.find((t) => t.id === e.category_id)?.name ?? e.text].filter(Boolean).join(" ")}
              ${e.note ? v`<span class="detail">${e.note}</span>` : b}
            </li>`)}
      </ul>
      <h3>${w("recipes.instructions")}</h3>
      <p class="detail">${w("cook.hint")}</p>
      ${Ri(e.steps, (e, t) => this.step(e, t))}
      ${this.timers.length ? v`<div class="timers" role="status">
              ${this.timers.map((e) => {
			let t = e.end - this.now;
			return v`<span class="timer ${t <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${w("cook.timer", {
				n: e.step + 1,
				what: e.label
			})}:
                  <strong>${t > 0 ? ba(t) : w("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${w("cook.timer_cancel")}
                    title=${w("cook.timer_cancel")}
                    @click=${() => this.timers = this.timers.filter((t) => t !== e)}
                  >
                    ${D(Qe)}
                  </button>
                </span>`;
		})}
            </div>` : b}
    </dialog>`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-cook-mode", Sa);
//#endregion
//#region src/recipes-view.ts
var Ca = class extends C {
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
				V(this.hass),
				R(this.hass),
				$t(this.hass)
			]);
			[this.recipes, this.md] = [e, t], this.expiring = new Map(n.map((e) => [e.recipe_id, e.used])), this.scaled = /* @__PURE__ */ new Map(), this.servings = /* @__PURE__ */ new Map(), this.error = "";
		} catch (e) {
			this.error = await I(this.hass, e);
		}
		await this.updateComplete, this.renderRoot.querySelector("[data-testid=recipe-search]")?.focus(), await this.reveal();
	}
	async setServings(e, t) {
		this.servings = new Map(this.servings).set(e.id, t);
		try {
			let n = await en(this.hass, e.id, t);
			if (this.servings.get(e.id) !== t) return;
			this.scaled = new Map(this.scaled).set(e.id, n);
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	async removeRecipe(e) {
		this.error = "";
		try {
			if (!await zn(this.hass, this.md, "recipe", e)) return;
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		await this.load();
	}
	async toShopping(e) {
		this.error = "";
		try {
			await this.renderRoot.querySelector("pantry-shopping-recipe-dialog").request(e, this.servings.get(e.id));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	async refreshShopping() {
		try {
			let e = new Map((await V(this.hass)).map((e) => [e.id, e.shopping_servings]));
			this.recipes = this.recipes?.map((t) => ({
				...t,
				shopping_servings: e.get(t.id) ?? null
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	edit(e) {
		this.renderRoot.querySelector("pantry-recipe-dialog").open(this.md, e, void 0, !!this.canning);
	}
	importer() {
		return this.renderRoot.querySelector("pantry-recipe-import");
	}
	shown() {
		let e = this.query.trim();
		return (this.recipes ?? []).filter((t) => H(t) === !!this.canning && (!this.onlyExpiring || this.expiring.has(t.id)) && (!e || K(t.name, e) || t.ingredients.some((t) => K(t.text, e))));
	}
	row(e) {
		let t = this.open.has(e.id), n = () => this.open = jt(this.open, e.id), r = this.servings.get(e.id) ?? e.servings;
		return v`<li class="recipe" data-testid="recipe-row" data-recipe-id=${e.id}>
      <div class="head">
        ${k(t, n)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${n}>
          <span>${e.name}</span>
          <span class="detail"
            >${w("recipes.summary", e.summary)} ·
            ${H(e) ? w("canning.recipe_summary", {
			name: e.canning_product ?? "",
			jars: e.servings
		}) : hn(this.hass, e.servings)}${this.expiring.has(e.id) ? v` ·
                    <span class="soon" data-testid="recipe-expiring"
                      >${w("recipes.expiring", { n: this.expiring.get(e.id) })}</span
                    >` : b}</span
          >
        </button>
        ${A({
			testid: "recipe",
			name: e.name,
			onEdit: () => this.edit(e),
			onDelete: F(this.hass) ? () => this.removeRecipe(e) : void 0
		})}
      </div>
      ${t ? Ui({
			hass: this.hass,
			md: this.md,
			recipe: e,
			ingredients: this.scaled.get(e.id) ?? e.ingredients,
			servings: r,
			onServings: (t) => this.setServings(e, t),
			onShopping: () => this.toShopping(e),
			onPlan: () => H(e) ? this.dispatchEvent(new CustomEvent("pantry-canning-start", {
				detail: e.id,
				bubbles: !0,
				composed: !0
			})) : this.renderRoot.querySelector("pantry-meal-dialog").open(M(), 3, this.recipes, r, void 0, e.name),
			onCook: () => this.renderRoot.querySelector("pantry-cook-mode").open(this.hass, this.md, e, this.scaled.get(e.id) ?? e.ingredients, r)
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
          aria-label=${w("recipes.search")}
          placeholder=${w("recipes.search")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button data-testid="recipe-import" @click=${() => this.importer().open()}>
          ${w("recipes.import.open")}
        </button>
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${w(this.canning ? "canning.recipe_add" : "recipes.add")}
        </button>
      </div>
      ${this.expiring.size ? v`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e) => this.onlyExpiring = e.target.checked}
              />
              ${w("recipes.expiring_only")}
            </label>` : b}
      <pantry-recipe-import
        .hass=${this.hass}
        @pantry-imported=${(e) => this.renderRoot.querySelector("pantry-recipe-dialog").open(this.md, void 0, e.detail, !!this.canning)}
      ></pantry-recipe-import>
      <pantry-shopping-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.refreshShopping()}
      ></pantry-shopping-recipe-dialog>
      <pantry-meal-dialog .hass=${this.hass}></pantry-meal-dialog>
      <pantry-cook-mode></pantry-cook-mode>
      <pantry-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
        @master=${(e) => this.md = e.detail}
      >
      </pantry-recipe-dialog>
      ${t.length ? v`<ul>
              ${t.map((e) => this.row(e))}
            </ul>` : v`<p class="empty">
              ${w(this.query.trim() ? "recipes.no_hits" : this.canning ? "canning.recipes_empty" : "recipes.empty")}
            </p>`}`;
	}
	static {
		this.styles = [T, Ni];
	}
};
customElements.define("pantry-recipes", Ca);
//#endregion
//#region src/plan-shift.ts
var wa = (e, t) => v`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${w("plan.shift")}
    title=${w("plan.shift")}
    @click=${() => e.shift(t)}
  >
    ${D(Je)}
  </button>`;
async function Ta(e, t) {
	let { meals: n } = await _a(e, t.day, t.slot, !1), r = new Intl.DateTimeFormat(Ar(e), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	});
	return await E({
		title: w("plan.shift_title", { slot: w(`plan.slot.${t.slot}`) }),
		body: v`<ul class="impact" data-testid="shift-list">
      ${n.map((e) => {
			let t = Z(e.day);
			return v`<li>${r.format(t)} ${e.name} → ${r.format(Z(X(Q(t, 1))))}</li>`;
		})}
    </ul>`,
		action: w("plan.shift_ok")
	}) ? (await _a(e, t.day, t.slot, !0), !0) : !1;
}
//#endregion
//#region src/plan-day.ts
function Ea(e, t) {
	let n = X(t);
	return v`<div data-testid="plan-day" data-day=${n}>
    ${Tr.map((t) => v`<section data-testid="plan-cell" data-slot=${t}>
          <div class="head">
            <h3>${w(`plan.slot.${t}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${w("plan.add")}
              title=${w("plan.add")}
              @click=${() => e.add(n, t)}
            >
              ${D(ut)}
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
                      ${t.name} · ${hn(e.hass, t.servings)}
                    </button>
                    ${wa(e, t)}
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
var Da = o`
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
`, Oa = "(max-width: 600px)", ka = (e, t) => v`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => e.open(t)}>
      ${t.name}
    </button>
    <span class="sec">${hn(e.hass, t.servings)}</span>
    ${wa(e, t)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${w("common.edit_name", { name: t.name })}
      title=${w("common.edit_name", { name: t.name })}
      @click=${() => e.edit(t)}
    >
      ${D(lt)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${w("common.delete_name", { name: t.name })}
      title=${w("common.delete_name", { name: t.name })}
      @click=${() => e.remove(t)}
    >
      ${D(et)}
    </button>
  </div>`, Aa = (e, t, n, r) => v`<button
    class="icon-btn quiet"
    data-testid=${r}
    aria-label=${w("plan.add")}
    title=${w("plan.add")}
    @click=${() => e.add(t, n)}
  >
    ${D(ut)}
  </button>`, ja = (e, t, n) => v`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => e.openDay(t)}
  >
    ${n.format(t)}
  </button>`, Ma = (e) => [
	0,
	1,
	2,
	3,
	4,
	5,
	6
].map((t) => Q(e, t)), Na = (e, t, n) => e.meals.filter((e) => e.day === t && e.slot === n);
function Pa(e, t, n) {
	let r = new Intl.DateTimeFormat(Ar(e.hass), {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	}), i = X(/* @__PURE__ */ new Date());
	return n ? v`<div data-testid="plan-week">
      ${Ma(t).map((t) => {
		let n = X(t);
		return v`<section class="daybox" data-testid="plan-day" data-day=${n}>
          <h3 class=${n === i ? "today" : ""}>
            ${ja(e, t, r)} ${Aa(e, n, 3, "plan-add-day")}
          </h3>
          ${Tr.filter((t) => Na(e, n, t).length).map((t) => v`<div class="slotline" data-testid="plan-cell" data-slot=${t}>
                <span class="slot">${w(`plan.slot.${t}`)}</span>
                <div>${Na(e, n, t).map((t) => ka(e, t))}</div>
              </div>`)}
        </section>`;
	})}
    </div>` : v`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${Ma(t).map((t) => v`<th scope="col" class=${X(t) === i ? "today" : ""}>
              ${ja(e, t, r)}
            </th>`)}
      </tr>
    </thead>
    <tbody>
      ${Tr.map((n) => v`<tr>
            <th scope="row">${w(`plan.slot.${n}`)}</th>
            ${Ma(t).map((t) => {
		let r = X(t);
		return v`<td data-testid="plan-day" data-day=${r}>
                <div data-testid="plan-cell" data-slot=${n}>
                  ${Na(e, r, n).map((t) => ka(e, t))} ${Aa(e, r, n, "plan-add")}
                </div>
              </td>`;
	})}
          </tr>`)}
    </tbody>
  </table>`;
}
var Fa = o`
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
`, Ia = [
	gt,
	_t,
	$e,
	ht,
	tt
];
function La(e, t, n, r) {
	let i = Ar(e.hass), a = new Intl.DateTimeFormat(i, { weekday: "short" }), o = new Intl.DateTimeFormat(i, { dateStyle: "full" }), s = X(/* @__PURE__ */ new Date());
	return v`<div class="month" data-testid="plan-month">
    ${[
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((e) => v`<div class="wd">${a.format(Q(t, e))}</div>`)}
    ${Array.from({ length: n * 7 }, (e, n) => Q(t, n)).map((t) => {
		let n = X(t), i = e.meals.filter((e) => e.day === n);
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
          ${Tr.filter((e) => i.some((t) => t.slot === e)).map((e) => {
			let t = w(`plan.slot.${e}`);
			return v`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${e}
              aria-label=${t}
              title=${[t, ...i.filter((t) => t.slot === e).map((e) => e.name)].join("\n")}
              >${D(Ia[e])}</span
            >`;
		})}
        </span>
      </button>`;
	})}
  </div>`;
}
var Ra = o`
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
`, za = 366, Ba = (e, t) => Math.round((Z(t).getTime() - Z(e).getTime()) / 864e5), Va = class extends C {
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
		this.from = M(), this.to = X(Q(Z(this.from), 6)), this.bad = {
			from: !1,
			to: !1
		}, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	errors() {
		let e = {};
		return (!this.from || N(this.bad.from, this.from)) && (e.from = w("valid.date")), !this.to || N(this.bad.to, this.to) ? e.to = w("valid.date") : !e.from && this.to < this.from ? e.to = w("plan.shop.order") : !e.from && Ba(this.from, this.to) >= za && (e.to = w("plan.shop.long", { max: za })), e;
	}
	async save(e) {
		if (e.preventDefault(), !Object.keys(this.errors()).length) try {
			let e = await va(this.hass, this.from, this.to);
			this.renderRoot.querySelector("dialog")?.close();
			let t = e.recipes.length ? w("plan.shop.done", { recipes: e.recipes.map((e) => `${e.name} (${e.servings})`).join(", ") }) : w("plan.shop.none");
			this.dispatchEvent(new CustomEvent("pantry-shopped", {
				detail: t,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
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
		return O({
			title: w("plan.shop.title"),
			body: v`<p class="hint">${w("plan.shop.hint")}</p>
        ${this.field("from", w("plan.shop.from"), e.from)}
        ${this.field("to", w("plan.shop.to"), e.to)}`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			submit: {
				label: w("plan.shop.submit"),
				testid: "plan-shop-save"
			},
			dirty: () => !1,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-plan-shopping-dialog", Va);
//#endregion
//#region src/plan-view.ts
var Ha = class extends C {
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
		super(), this.started = !1, this.narrow = window.matchMedia(Oa), this.onNarrow = () => this.requestUpdate(), this.date = /* @__PURE__ */ new Date(), this.meals = [], this.household = 1, this.recipes = [], this.error = "", this.note = "";
	}
	get view() {
		return wr.includes(this.section) ? this.section : "week";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.started ? (this.started = !0, this.load(), V(this.hass).then((e) => this.recipes = e, () => void 0)) : e.has("section") && this.started && this.load();
	}
	async load() {
		let [e, t] = Or(this.view, this.date);
		try {
			let n = await ma(this.hass, X(e), X(t));
			this.meals = n.meals, this.household = n.household_servings, this.error = "";
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	go(e) {
		this.date = e, this.load();
	}
	nav(e) {
		this.dispatchEvent(new CustomEvent("pantry-navigate", {
			detail: `plan/${e}`,
			bubbles: !0,
			composed: !0
		}));
	}
	dialog() {
		return this.renderRoot.querySelector("pantry-meal-dialog");
	}
	async act(e) {
		try {
			await e();
		} catch (e) {
			this.error = await I(this.hass, e);
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
				await Tt(e.name) && await this.act(() => ga(this.hass, e.id));
			},
			open: (e) => e.recipe_id == null ? this.dialog().open(e.day, e.slot, this.recipes, this.household, e) : this.dispatchEvent(new CustomEvent("pantry-navigate", {
				detail: `recipes/${e.recipe_id}`,
				bubbles: !0,
				composed: !0
			})),
			shift: (e) => this.act(() => Ta(this.hass, e)),
			openDay: (e) => {
				this.date = e, this.nav("day");
			}
		};
	}
	label() {
		let e = Ar(this.hass), t = this.date;
		if (this.view === "day") return new Intl.DateTimeFormat(e, { dateStyle: "full" }).format(t);
		if (this.view === "month") return new Intl.DateTimeFormat(e, {
			month: "long",
			year: "numeric"
		}).format(t);
		let [n, r] = Or("week", t);
		return new Intl.DateTimeFormat(e, { dateStyle: "medium" }).formatRange(n, new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1));
	}
	body() {
		let e = this.ctx(), [t, n] = Or(this.view, this.date);
		return this.view === "day" ? Ea(e, this.date) : this.view === "week" ? Pa(e, t, this.narrow.matches) : La(e, t, Math.round((n.getTime() - t.getTime()) / 6048e5), this.date.getMonth());
	}
	render() {
		let e = this.view;
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      ${this.note ? v`<p class="note" role="status" data-testid="plan-shop-note">${this.note}</p>` : b}
      <nav aria-label=${w("plan.view.label")}>
        ${wr.map((t) => v`<button
              data-testid=${`plan-view-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => t === "day" ? this.ctx().openDay(/* @__PURE__ */ new Date()) : this.nav(t)}
            >
              ${w(`plan.view.${t}`)}
            </button>`)}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${w("plan.prev")}
          title=${w("plan.prev")}
          @click=${() => this.go(kr(e, this.date, -1))}
        >
          ${D(Xe)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(/* @__PURE__ */ new Date())}>
          ${w("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${w("plan.next")}
          title=${w("plan.next")}
          @click=${() => this.go(kr(e, this.date, 1))}
        >
          ${D(Ze)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        <button
          data-testid="plan-shop"
          @click=${() => this.renderRoot.querySelector("pantry-plan-shopping-dialog").open()}
        >
          ${w("plan.shop")}
        </button>
        ${e === "month" ? b : v`<pantry-receipt-button
                .hass=${this.hass}
                .print=${() => Zt(this.hass, X(Or(e, this.date)[0]), e === "day" ? 1 : 7)}
                .done=${w("plan.printed")}
                .testid=${"plan-print"}
              ></pantry-receipt-button>`}
      </div>
      ${this.body()}
      <pantry-plan-shopping-dialog
        .hass=${this.hass}
        @pantry-shopped=${(e) => this.note = e.detail}
      ></pantry-plan-shopping-dialog>
      <pantry-meal-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-meal-dialog>`;
	}
	static {
		this.styles = [
			T,
			o`
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
			Da,
			Fa,
			Ra
		];
	}
};
customElements.define("pantry-plan", Ha);
//#endregion
//#region src/api-canning.ts
var Ua = (e) => e.callWS({ type: "pantry/cannings" }), Wa = (e, t) => e.callWS({
	type: "pantry/canning_save",
	data: t
}), Ga = class extends C {
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
	async open(e, t, n, r, i) {
		this.md = e, this.products = t, this.recipes = n.filter(H), this.canning = r, this.draft = r ? {
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
		return n?.[e] == null ? gn(this.md, n ? n.category_id : t.category_id, e) : {
			value: n[e],
			source: w("book.from_product")
		};
	}
	proposal(e) {
		let t = this.dflt("shelf_days", e);
		return t && e.made_on ? Er(e.made_on, Number(t.value)) : "";
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
		return this.canning || ((!e.made_on || N(e.dateBad, e.made_on)) && (t.made_on = w("valid.date")), e.name.trim() ? !this.product() && e.category_id == null && (t.category = w("valid.category")) : t.name = w("valid.required"), (e.jars == null || !Number.isInteger(e.jars) || e.jars < 1 || e.jars > 9999) && (t.jars = w("valid.packages")), !this.dflt("default_location_id") && e.location_id == null && (t.location = w("valid.location"))), e.temp != null && !(Number.isInteger(e.temp) && e.temp >= 1 && e.temp <= 200) && (t.temp = w("valid.canning_temp")), e.minutes != null && !(Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440) && (t.minutes = w("valid.canning_minutes")), t;
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
			let e = await Wa(this.hass, this.canning ? {
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
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				detail: this.canning ? void 0 : {
					...e,
					name: t.name.trim(),
					jars: t.jars
				},
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	num(e, t, n, r) {
		return ta({
			testid: `canning-${e}`,
			label: t,
			unit: n,
			value: this.draft[e],
			err: r,
			onChange: (t) => this.set({ [e]: t })
		});
	}
	date(e, t, n) {
		return na({
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
		if (this.canning) return v`<p class="detail" data-testid="canning-fixed">
        ${w("canning.fixed", {
			charge: this.canning.charge,
			name: t.name,
			jars: t.jars ?? ""
		})}
      </p>`;
		let n = this.recipes.find((e) => e.id === t.recipe_id);
		return v`<label>
        <span class="lbl">${w("canning.recipe")}</span>
        <select
          data-testid="canning-recipe"
          @change=${(e) => {
			let t = e.target.value;
			this.pickRecipe(t ? Number(t) : null);
		}}
        >
          <option value="" .selected=${t.recipe_id == null}>${w("common.none")}</option>
          ${this.recipes.map((e) => v`<option value=${e.id} .selected=${e.id === t.recipe_id}>${e.name}</option>`)}
        </select>
      </label>
      ${this.date("made_on", w("canning.made_on"), e.made_on)}
      ${n ? v`<p class="detail" data-testid="canning-recipe-product">
              ${w("canning.recipe_product", { name: n.canning_product ?? "" })}
            </p>` : ra({
			testid: "canning",
			label: w("canning.product"),
			hass: this.hass,
			md: this.md,
			products: this.products,
			name: t.name,
			categoryId: t.category_id,
			err: e,
			onName: (e) => this.set({ name: e }),
			onCategory: (e) => this.set({ category_id: e })
		})}
      ${this.num("jars", w("canning.jars"), "", e.jars)}
      <label>
        <span class="lbl">${w("book.location")}</span>
        ${vn({
			testid: "canning-location",
			own: t.location_id,
			dflt: this.dflt("default_location_id"),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			invalid: !!e.location,
			onChange: (e) => this.set({ location_id: e })
		})}
        ${j(e.location, "canning-location")}
      </label>`;
	}
	render() {
		if (!this.active) return v`<dialog></dialog>`;
		let e = this.errors(), t = this.draft, n = t.expires_on && t.expires_on === this.proposal(t) ? this.dflt("shelf_days") : void 0;
		return O({
			title: this.canning ? w("common.edit_name", { name: this.canning.charge }) : w("canning.add"),
			body: v`${this.newFields(e)} ${this.date("expires_on", w("canning.expires_on"))}
        ${n ? v`<span class="detail">${w("book.shelf_hint", {
				days: String(n.value),
				source: n.source
			})}</span>` : b}
        <div class="pair">
          ${this.num("temp", w("recipes.field.canning_temp"), "°C", e.temp)}
          ${this.num("minutes", w("recipes.field.canning_minutes"), w("recipes.minutes_unit"), e.minutes)}
        </div>
        <label>
          <span class="lbl">${w("canning.notes")}</span>
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
				label: w("common.save"),
				testid: "canning-save"
			},
			dirty: () => JSON.stringify(this.draft) !== this.initial,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = T;
	}
};
customElements.define("pantry-canning-dialog", Ga);
//#endregion
//#region src/canning-view.ts
var Ka = class extends C {
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
		this.dispatchEvent(new CustomEvent("pantry-navigate", {
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
				Ua(this.hass),
				R(this.hass),
				B(this.hass),
				V(this.hass)
			]), this.error = "";
		} catch (e) {
			this.error = await I(this.hass, e);
		}
	}
	edit(e, t) {
		this.message = "", this.renderRoot.querySelector("pantry-canning-dialog").open(this.md, this.products, this.recipes, e, t);
	}
	async removeCanning(e) {
		this.error = "";
		try {
			if (!await zn(this.hass, this.md, "canning", {
				id: e.id,
				name: e.charge
			})) return;
		} catch (e) {
			this.error = await I(this.hass, e);
			return;
		}
		await this.load();
	}
	async saved(e) {
		await this.load();
		let t = e.detail;
		t && (this.message = w("canning.saved", { charge: t.charge }), this.renderRoot.querySelector("pantry-label-dialog").open({
			id: t.batch_id,
			name: t.name,
			packages: t.jars
		}, t.jars));
	}
	detail(e) {
		return [
			w("canning.jars_left", {
				jars: e.jars,
				left: e.in_stock
			}),
			e.expires_on ? w("canning.until", { date: W(this.hass, e.expires_on) }) : "",
			e.temp == null ? "" : `${e.temp} °C`,
			e.minutes == null ? "" : `${e.minutes} ${w("recipes.minutes_unit")}`,
			e.recipe ?? ""
		].filter(Boolean).join(" · ");
	}
	protocols() {
		return this.rows ? v`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${w("canning.add")}
        </button>
      </div>
      ${this.message ? v`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : b}
      ${this.rows.length ? v`<ul>
              ${this.rows.map((e) => v`<li data-testid="canning-row" data-charge=${e.charge}>
                    <button type="button" class="row" @click=${() => this.edit(e)}>
                      <span>${e.charge} · ${e.name}</span>
                      <span class="detail">${this.detail(e)}</span>
                      ${e.notes ? v`<span class="detail">${e.notes}</span>` : b}
                    </button>
                    ${A({
			testid: "canning",
			name: e.charge,
			onEdit: () => this.edit(e),
			onDelete: F(this.hass) ? () => this.removeCanning(e) : void 0
		})}
                  </li>`)}
            </ul>` : v`<p class="empty">${w("canning.empty")}</p>`}` : b;
	}
	render() {
		let e = this.section === "recipes";
		return v`${this.error ? v`<p class="error" role="alert">${this.error}</p>` : b}
      <nav aria-label=${w("canning.view.label")}>
        ${["protocols", "recipes"].map((t) => v`<button
              data-testid=${`canning-view-${t}`}
              aria-current=${t === "recipes" === e ? "page" : "false"}
              @click=${() => this.nav(t === "recipes" ? "canning/recipes" : "canning")}
            >
              ${w(`canning.view.${t}`)}
            </button>`)}
      </nav>
      <div @pantry-canning-start=${this.start}>
        ${e ? v`<pantry-recipes .hass=${this.hass} .canning=${!0}></pantry-recipes>` : this.protocols()}
      </div>
      <pantry-canning-dialog .hass=${this.hass} @pantry-saved=${this.saved}></pantry-canning-dialog>
      <pantry-label-dialog
        .hass=${this.hass}
        @pantry-printed=${(e) => e.detail && (this.message = w("label.printed", { n: e.detail }))}
      ></pantry-label-dialog>`;
	}
	static {
		this.styles = [T, o`
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
customElements.define("pantry-canning", Ka);
//#endregion
//#region src/pantry-panel.ts
var qa = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide", Ja = [
	"stock",
	"expiry",
	"shopping",
	"recipes",
	"plan",
	"canning",
	"settings"
], Ya = [
	"shopping",
	"recipes",
	"plan",
	"canning"
], Xa = class extends C {
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
		e.has("hass") && this.hass && xt(this.hass.language), e.has("panel") && (cn(this.panel?.config?.modules), un(this.panel?.config?.ai));
	}
	get tabs() {
		return Ja.filter((e) => (e !== "settings" || F(this.hass)) && (!Ya.includes(e) || U(e)));
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
                aria-label=${w("panel.menu")}
                title=${w("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${D(it)}
              </button>` : b}
        <h1>${w("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${qa}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${w("panel.help")}
          title=${w("panel.help")}
          >${D(nt)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map((t) => v`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${w(`tab.${t}`)}
            </button>`)}
      </div>
      <main role="tabpanel" @pantry-navigate=${(e) => this.select(e.detail)}>
        ${e === "settings" ? v`<pantry-settings .hass=${this.hass} .section=${this.sub}></pantry-settings>` : e === "stock" ? v`<pantry-stock
                  .hass=${this.hass}
                  .mode=${this.seg === "in" || this.seg === "out" || this.seg === "open" ? this.seg : "search"}
                ></pantry-stock>` : e === "expiry" ? v`<pantry-expiry .hass=${this.hass}></pantry-expiry>` : e === "recipes" ? v`<pantry-recipes .hass=${this.hass} .section=${this.sub}></pantry-recipes>` : e === "plan" ? v`<pantry-plan .hass=${this.hass} .section=${this.sub}></pantry-plan>` : e === "canning" ? v`<pantry-canning
                          .hass=${this.hass}
                          .section=${this.sub}
                        ></pantry-canning>` : v`<pantry-shopping .hass=${this.hass}></pantry-shopping>`}
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
customElements.define("pantry-panel", Xa);
//#endregion
export { Xa as PantryPanel };
