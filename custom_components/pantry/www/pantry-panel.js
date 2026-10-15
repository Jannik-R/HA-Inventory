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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, d = globalThis, ie = d.trustedTypes, ae = ie ? ie.emptyScript : "", oe = d.reactiveElementPolyfillSupport, f = (e, t) => e, se = {
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
}, ce = (e, t) => !l(e, t), le = {
	attribute: !0,
	type: String,
	converter: se,
	reflect: !1,
	useDefault: !1,
	hasChanged: ce
};
Symbol.metadata ??= Symbol("metadata"), d.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var p = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = le) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
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
		if (this.hasOwnProperty(f("elementProperties"))) return;
		let e = re(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(f("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(f("properties"))) {
			let e = this.properties, t = [...te(e), ...ne(e)];
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
p.elementStyles = [], p.shadowRootOptions = { mode: "open" }, p[f("elementProperties")] = /* @__PURE__ */ new Map(), p[f("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: p }), (d.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var m = globalThis, ue = (e) => e, h = m.trustedTypes, de = h ? h.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fe = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, _ = "?" + g, pe = `<${_}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", x = Array.isArray, me = (e) => x(e) || typeof e?.[Symbol.iterator] == "function", S = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${S}(?:([^\\s"'>=/]+)(${S}*=${S}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, be = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = be(1), xe = be(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), O = v.createTreeWalker(v, 129);
function Ce(e, t) {
	if (!x(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let ee = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + fe + n.slice(l) + g + ee) : n + g + (l === -2 ? t : ee);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, k = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fe)) {
					let t = u[o++], n = i.getAttribute(e).split(g), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : M
					}), i.removeAttribute(e);
				} else e.startsWith(g) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(g), t = e.length - 1;
					if (t > 0) {
						i.textContent = h ? h.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === _) c.push({
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
		let n = v.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Te = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, j = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = A(this, e, t), b(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = k.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Te(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new k(e)), t;
	}
	k(t) {
		x(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
}, M = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, De = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Oe = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ke = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, Ae = {
	M: fe,
	P: g,
	A: _,
	C: 1,
	L: we,
	R: Te,
	D: me,
	V: A,
	I: j,
	H: M,
	N: De,
	U: Oe,
	B: Ee,
	F: ke
}, je = m.litHtmlPolyfillSupport;
je?.(k, j), (m.litHtmlVersions ??= []).push("3.3.3");
var Me = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends p {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P });
var Ne = N.litElementPolyfillSupport;
Ne?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Pe = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Fe = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Ie = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Le = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", Re = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", ze = "M7,10L12,15L17,10H7Z", Be = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", Ve = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", He = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", Ue = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", F = {
	"panel.title": "Vorrat",
	"panel.menu": "Menü",
	"tab.stock": "Bestand",
	"tab.in": "Einbuchen",
	"tab.out": "Auslagern",
	"tab.expiry": "Ablauf",
	"tab.shopping": "Einkauf",
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
	"shopping.missing": "{what} fehlen",
	"shopping.missing_more": "weitere {what} fehlen (beliebig aus der Kategorie)",
	"shopping.and": " und ",
	"shopping.unknown": "Nicht mitgezählt: {n} ohne Inhaltsangabe",
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
	"delete.kind.change.defaults": "Standards verweisen darauf",
	"delete.kind.other": "Weitere Daten in „{table}“ ({n})"
}, We = { de: F }, Ge = F;
function Ke(e) {
	let t = e ?? "";
	Ge = We[t] ?? We[t.split("-")[0]] ?? F;
}
function I(e, t) {
	let n = Ge[e] ?? F[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var L = o`
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
  [aria-invalid="true"] {
    border-color: var(--error-color) !important;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
`, qe = class extends P {
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
		let t = e.target;
		if (t.tagName !== "DIALOG") return;
		let n = t.getBoundingClientRect();
		(e.clientX < n.left || e.clientX > n.right || e.clientY < n.top || e.clientY > n.bottom) && t.close();
	}
	render() {
		return T`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
			this.resolve(this.ok), this.remove();
		}}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? T`<p>${this.o.message}</p>` : D} ${this.o.body ?? D}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(!1)}>
          ${I("common.cancel")}
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
		this.styles = [L, o`
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
customElements.define("pantry-confirm", qe);
function R(e) {
	return new Promise((t) => {
		let n = document.createElement("pantry-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var Je = (e, t) => R({
	title: I("common.delete_name", { name: e }) + "?",
	message: t,
	action: I("common.delete"),
	danger: !0
}), z = (e) => T`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${xe`<path d=${e} fill="currentColor"></path>`}
  </svg>`, B = !1;
async function Ye(e, t) {
	if (!t?.()) return e.close();
	if (!B) {
		B = !0;
		try {
			await R({
				title: I("common.discard"),
				action: I("common.discard_ok")
			}) && e.close();
		} finally {
			B = !1;
		}
	}
}
var V = (e) => (t) => {
	let n = t.target;
	if (n.tagName !== "DIALOG") return;
	let r = n.getBoundingClientRect();
	(t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) && Ye(n, e);
}, Xe = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || e() && t.cancelable && (t.preventDefault(), Ye(t.currentTarget, e));
}, H = (e) => T`<dialog
    @close=${e.onClosed}
    @click=${V(e.dirty)}
    @keydown=${Xe(e.dirty)}
    @cancel=${Xe(e.dirty)}
  >
    <form @submit=${e.onSubmit}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? T`<p class="error" role="alert">${e.error}</p>` : D}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${I("common.cancel")}
        </button>
        <button class="primary" type="submit" data-testid="save" ?disabled=${e.invalid}>
          ${I("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, U = (e, t) => T`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${I(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${z(e ? Fe : Ie)}
  </button>`;
function Ze(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var W = (e) => T`${e.onAdd ? T`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${z(He)}
          </button>` : D}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${I("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${z(Ve)}
    </button>
    ${e.onDelete ? T`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${I("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${z(Le)}
          </button>` : D}`, G = (e, t, n = !1) => e ? T`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : D, Qe = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, $e = (e) => e >= "2000-01-01" && e <= "2099-12-31", et = class extends P {
	static {
		this.properties = {
			categories: { attribute: !1 },
			value: { attribute: !1 },
			noneLabel: { attribute: !1 },
			exclude: { attribute: !1 },
			expanded: { state: !0 },
			filter: { state: !0 },
			draft: { state: !0 }
		};
	}
	constructor() {
		super(), this.categories = [], this.value = null, this.expanded = /* @__PURE__ */ new Set(), this.filter = "", this.draft = void 0;
	}
	get byId() {
		return new Map(this.categories.map((e) => [e.id, e]));
	}
	chain(e) {
		let t = this.byId, n = [];
		for (let r = e; r != null; r = t.get(r)?.parent_id ?? null) n.unshift(r);
		return n;
	}
	path(e) {
		let t = this.byId;
		return this.chain(e).map((e) => t.get(e).name).join(" › ");
	}
	kids(e) {
		return this.categories.filter((t) => t.parent_id === e && t.id !== this.exclude).sort((e, t) => e.sort - t.sort);
	}
	async open() {
		this.filter = "", this.draft = this.value ?? (this.noneLabel ? null : void 0), this.expanded = new Set(this.chain(this.value)), await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("[aria-current=true], input")?.focus();
	}
	confirm() {
		this.renderRoot.querySelector("dialog").close(), this.draft !== void 0 && this.dispatchEvent(new CustomEvent("change", { detail: this.draft }));
	}
	mark(e) {
		this.draft = e, !this.expanded.has(e) && this.kids(e).length && this.toggle(e);
	}
	toggle(e) {
		this.expanded = Ze(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim().toLocaleLowerCase();
		if (e) return this.categories.filter((t) => t.name.toLocaleLowerCase().includes(e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
			c: e,
			depth: 0,
			label: this.path(e.id)
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
		let e = this.rows(), t = !!this.filter.trim();
		return T`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? I("book.choose") : this.path(this.value)}
        </span>
        ${z(ze)}
      </button>
      <dialog @click=${V()}>
        <h2>${I("book.choose_category")}</h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${I("book.filter")}
          placeholder=${I("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !t ? T`<li>
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
                </li>` : D}
          ${e.map(({ c: e, depth: n, label: r }) => {
			let i = !t && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return T`<li style="padding-left: ${n * 20}px">
              ${i ? U(a, () => this.toggle(e.id)) : t ? D : T`<span class="chev"></span>`}
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
        ${e.length ? D : T`<p class="empty">${I("book.no_hits")}</p>`}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${I("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0}
            @click=${this.confirm}
          >
            ${I("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [L, o`
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
customElements.define("pantry-category-picker", et);
//#endregion
//#region src/api.ts
async function K(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var q = (e) => e.callWS({ type: "pantry/master_data" }), tt = (e, t, n) => e.callWS({
	type: "pantry/save",
	table: t,
	data: n
}), nt = (e, t) => e.callWS({
	type: "pantry/defaults_save",
	data: t
}), rt = (e, t, n, r = {}) => e.callWS({
	type: "pantry/delete",
	table: t,
	row_id: n,
	...r
}), it = (e, t, n) => e.callWS({
	type: "pantry/delete_impact",
	table: t,
	row_id: n
}), at = (e, t) => e.callWS({
	type: "pantry/lookup",
	code: t
}), ot = (e, t, n = !1) => e.callWS({
	type: "pantry/search",
	query: t,
	online: n
}), st = (e, t) => e.callWS({
	type: "pantry/book_in",
	...t
}), ct = (e, t) => e.callWS({
	type: "pantry/book_out",
	...t
}), lt = (e, t) => e.callWS({
	type: "pantry/stock_edit",
	...t
}), J = (e, t) => e.callWS({
	type: "pantry/stock",
	product_id: t
}), ut = (e) => e.callWS({ type: "pantry/products" }), dt = (e, t) => e.callWS({
	type: "pantry/product_save",
	data: t
}), ft = (e) => e.callWS({ type: "pantry/shopping" }), pt = (e, t, n) => e.callWS({
	type: "pantry/shopping_done",
	category_id: t,
	done: n
}), Y = (e, t) => e.callWS({
	type: "pantry/shopping_add",
	...t
}), mt = (e, t, n) => e.callWS({
	type: "pantry/shopping_item",
	item_id: t,
	...n
}), ht = (e, t) => e.callWS({
	type: "pantry/shopping_item_delete",
	item_id: t
}), X = (e) => e?.locale?.language ?? e?.language, gt = (e, t) => new Intl.DateTimeFormat(X(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), _t = (e, t) => new Intl.NumberFormat(X(e)).format(t), vt = (e, t) => I(new Intl.PluralRules(X(e)).select(Number(t)) === "one" ? "settings.day" : "settings.days", { n: t });
//#endregion
//#region src/settings-format.ts
function yt(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function bt(e, t) {
	return t === "default" ? I("settings.inherit_default") : I("settings.inherit_from", { name: yt(e, t) });
}
function xt(e, t, n) {
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
	if (r == null) return "–";
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : "–";
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? "–" : n === "expiry_type" ? I(`settings.expiry.${r}`) : vt(t, r);
}
//#endregion
//#region src/min-stock.ts
function St(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = I("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = I("valid.packages")), t;
}
function Ct(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return T`<label>
      <span class="lbl">${I("settings.category.min_stock")}</span>
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
          aria-label=${I("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${e.md.units.map((n) => T`<option value=${n.id} ?selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${G(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl">${I("settings.category.min_packages")}</span>
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
        <span class="detail">${I("book.packages")}</span>
      </span>
      ${G(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${I("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-dialog.ts
var wt = {
	unit: [
		"name",
		"symbol",
		"base_unit_id",
		"factor",
		"is_count"
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
}, Tt = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, Et = class extends P {
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
		for (let i of wt[e]) r[i] = t?.[i] ?? n[i] ?? null;
		t && (r.id = t.id), e === "unit" && (r.is_count ??= 0, r.factor ??= 1, r.symbol ??= ""), r.name ??= "", this.edit = {
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = I("valid.duplicate")) : n.name = I("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = I("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = I("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = I("valid.days")), Object.assign(n, St(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of wt[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await tt(this.hass, t, r);
		} catch (e) {
			this.error = await K(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t) {
		return T`<label><span class="lbl">${e}</span>${t}</label>`;
	}
	text(e) {
		return T`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${G(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return T`<span class="num"
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
			this.set(e, n === "" ? null : Number(n));
		}}
        />${n ? T`<span class="detail">${n}</span>` : D}</span
      >${e === "warn_days" ? D : G(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return T`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" ?selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => T`<option value=${e} ?selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? D : T`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${z(Ue)}${I("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = xt(i, e, this.edit.d.parent_id), o = Z(i, this.hass, e, a.value), s = bt(i, a.source), c = e === "warn_days" ? this.numInput(e, I("common.default", {
			value: o,
			source: s
		}), I("common.days_unit")) : this.select(e, n, I("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, T`<span class="inh">${c}${this.reset(e)}</span
        >${G(this.errs[e], e)}`);
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return T`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(I("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = a.filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = T`${this.field(I("common.name"), this.text("name"))}${this.field(I("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${I("settings.unit.is_count")}</label
        >
        ${this.field(I("settings.unit.base"), this.select("base_unit_id", e, I("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(I("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? xt(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = T`${this.field(I("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${I("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${I("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh("unit_id", I("settings.category.unit"), a.map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", I("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", I("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, I(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", I("settings.category.warn_days"), [])}
        ${Ct({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? T`<p class="detail">${I("settings.category.off_tags", { tags: t.join(", ") })}</p>` : D}`;
		}
		let c = () => wt[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? yt(i, n.parent_id) : "";
		return H({
			title: n.id ? I("common.edit_name", { name: r.name }) : l ? I("settings.category.add_sub_to", { name: l }) : I(Tt[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [L];
	}
};
customElements.define("pantry-settings-dialog", Et);
//#endregion
//#region src/defaults-view.ts
var Dt = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"]
], Ot = class extends P {
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
		return t === null || !Number.isInteger(t) || t < 0 ? I("valid.days") : void 0;
	}
	async save(e) {
		if (e.preventDefault(), !this.warnError(this.d)) try {
			await nt(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? T`<p class="detail intro">${I("settings.defaults.hint")}</p>
      <ul>
        ${Dt.map(([t, n]) => T`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${I(n)}</span>
                <span class="detail">${Z(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${W({
			testid: "default",
			name: I(n),
			onEdit: () => this.open()
		})}
            </li>`)}
      </ul>
      ${this.renderDialog(e)}` : T``;
	}
	select(e, t) {
		let n = this.d;
		return T`<select
      data-testid=${`default-${e}`}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, e === "expiry_type" ? n : n ? Number(n) : null);
		}}
    >
      ${t.map(([t, r]) => T`<option value=${t ?? ""} ?selected=${t === n[e]}>${r}</option>`)}
    </select>`;
	}
	renderDialog(e) {
		let t = this.d;
		if (!t) return T`<dialog></dialog>`;
		let n = this.warnError(t);
		return H({
			title: I("settings.defaults.edit"),
			body: T`<label>
          <span class="lbl">${I("settings.category.unit")}</span>
          ${this.select("unit_id", e.units.map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl">${I("settings.category.location")}</span>
          ${this.select("default_location_id", [[null, I("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl">${I("settings.category.expiry_type")}</span>
          ${this.select("expiry_type", ["best_before", "use_by"].map((e) => [e, I(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl">${I("settings.category.warn_days")}</span>
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
				this.set("warn_days", t === "" ? null : Number(t));
			}}
            />
            ${I("common.days_unit")}
          </span>
          ${G(n, "default-warn_days")}
        </label>`,
			error: this.error,
			invalid: !!n,
			dirty: () => Dt.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = L;
	}
};
customElements.define("pantry-defaults", Ot);
//#endregion
//#region src/delete-flow.ts
var kt = 5, At = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = I(r, { n });
	return i === r ? I("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, jt = (e) => {
	let t = e.names.length - kt;
	return e.names.slice(0, kt).join(", ") + (t > 0 ? I("delete.more", { n: t }) : "");
};
async function Mt(e, t, n, r) {
	let i = n === "location" || n === "unit" ? I(`settings.${n}.delete_hint`) : void 0, a = await it(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "pantry",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await Je(r.name, i) ? (await rt(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = T`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => T`<li>
            <span class="kind">${At(n, e)}</span>
            <span class="names">${jt(e)}</span>
            ${e.packages ? T`<span class="names">${I("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? T`<label>
            <span class="lbl">${I("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => T`<option value=${e.id}>${I("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${I("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await R({
		title: I("common.delete_name", { name: r.name }) + "?",
		message: i ?? I("delete.affected"),
		body: c,
		action: I(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await rt(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var Nt = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null
}, Pt = class extends P {
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
		return this.section && this.section in Nt ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await q(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await K(this.hass, e);
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
		this.expanded = Ze(this.expanded, e);
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
			n.push(I("settings.category.min", { value: `${_t(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(I("settings.category.min", { value: I("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = Nt[e];
		return T`
      <nav aria-label=${I("settings.nav")}>
        ${Object.keys(Nt).map((t) => T`<button aria-current=${t === e ? "page" : "false"} @click=${() => this.nav(t)}>
              ${I(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? T`<p class="error" role="alert">${this.pageError}</p>` : D}
      ${this.data ? t ? T`<div class="bar">
                  <button class="primary" @click=${() => this.open(t)}>${I(Tt[t])}</button>
                </div>
                ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : T`<pantry-defaults
                .hass=${this.hass}
                .data=${this.data}
                @pantry-saved=${this.load}
              ></pantry-defaults>` : D}
      <pantry-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @pantry-saved=${this.load}
      ></pantry-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? D : T`<p class="empty">${I("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = D, a = D) {
		return T`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" @click=${n}>
        <span>${e}</span>${t ? T`<span class="detail">${t}</span>` : D}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return W({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: I("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await Mt(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await K(this.hass, e);
			return;
		}
		await this.load();
	}
	renderLocations() {
		let e = this.data.locations;
		return T`<ul>
        ${e.map((e) => this.row(e.name, "", () => this.open("location", e), 0, D, this.actions("location", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderUnits() {
		let { units: e } = this.data, t = (t) => {
			let n = e.find((e) => e.id === t.base_unit_id);
			return [t.symbol, n ? `= ${_t(this.hass, t.factor)} ${n.symbol}` : t.is_count ? I("settings.unit.count") : ""].filter(Boolean).join(" · ");
		};
		return T`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, D, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return T`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? U(r, () => this.toggle(e.id)) : T`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [L, o`
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
customElements.define("pantry-settings", Pt);
//#endregion
//#region src/scanner.ts
var Ft = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e"
];
async function It() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: Ft.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-DpUOKxRW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...Ft] });
}
var Lt = class extends P {
	static {
		this.properties = { error: { state: !0 } };
	}
	constructor() {
		super(), this.error = "";
	}
	async open() {
		this.error = "", await this.updateComplete;
		let e = this.renderRoot.querySelector("dialog");
		if (e.showModal(), !navigator.mediaDevices?.getUserMedia) this.error = I("scan.https");
		else try {
			let [t, n] = await Promise.all([It(), navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })]);
			if (!e.open) return n.getTracks().forEach((e) => e.stop());
			this.stream = n;
			let r = this.renderRoot.querySelector("video");
			r.srcObject = n, await r.play(), this.timer = window.setInterval(async () => {
				let [n] = await t.detect(r).catch(() => []);
				n && e.open && (e.close(), this.dispatchEvent(new CustomEvent("scan", { detail: n.rawValue })));
			}, 250);
		} catch {
			this.error = I("scan.no_camera");
		}
	}
	stop() {
		clearInterval(this.timer), this.stream?.getTracks().forEach((e) => e.stop()), this.stream = void 0;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stop();
	}
	render() {
		return T`<dialog data-testid="scanner" @close=${this.stop} @click=${V()}>
      <h2>${I("scan.title")}</h2>
      ${this.error ? T`<p class="error" role="alert">${this.error}</p>` : T`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${I("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [L, o`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-scanner", Lt);
//#endregion
//#region src/inherit.ts
function Rt(e, t) {
	let n = [];
	for (let r = e?.categories.find((e) => e.id === t); r; r = e.categories.find((e) => e.id === r.parent_id)) n.unshift(r.name);
	return n.join(" › ");
}
function Q(e, t, n) {
	if (!e) return;
	let r = e.categories.find((e) => e.id === t), i = r ? r.effective[n] : {
		value: e.defaults[n],
		source: "default"
	};
	if (i.value == null) return;
	if (i.source === "default") return {
		value: i.value,
		source: I("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: I("settings.inherit_from", { name: a ?? "" })
	};
}
var zt = (e, t) => T`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${z(Ue)}${I("common.reset")}
  </button>`;
function Bt(e) {
	let t = e.own ?? null;
	return T`<span class="inh">
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
      <option value="" ?selected=${t == null}>
        ${e.dflt ? I("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : I(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => T`<option value=${e} ?selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? D : zt(e.testid, () => e.onChange(null))}
  </span>`;
}
function Vt(e) {
	let t = e.own ?? null;
	return T`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? I("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(n === "" ? null : Number(n));
	}}
    />
    ${e.suffix ? T`<span class="detail">${e.suffix}</span>` : D}
    ${t == null ? D : zt(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/product-fields.ts
function Ht(e) {
	let t = {};
	return e.name.trim() || (t.name = I("valid.required")), e.category_id ?? (t.category = I("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = I("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = I("valid.content_pair")), t;
}
function Ut(e, t, n, r = {}) {
	return T`<label>
      <span class="lbl">${I("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${G(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${I("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${I("book.category")}</span>
      <pantry-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        @change=${(e) => n("category_id", e.detail)}
      ></pantry-category-picker>
      ${G(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl">${I("book.content")}</span>
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
		n("content_amount", t === "" ? null : Number(t));
	}}
        />
      </label>
      <label>
        <span class="lbl">${I("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" ?selected=${t.content_unit_id == null}>–</option>
          ${(e?.units ?? []).map((e) => T`<option value=${e.id} ?selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${G(r.content, "content")}`;
}
function Wt(e, t, n, r) {
	let i = e?.units.find((e) => e.id === t.content_unit_id), a = t.content_amount != null && i ? `${new Intl.NumberFormat(r).format(t.content_amount)} ${i.symbol || i.name}` : "";
	return [
		t.name,
		t.brand,
		a,
		n
	].filter(Boolean).join(" · ");
}
//#endregion
//#region src/booking-pick.ts
var Gt = "auto", Kt = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), qt = (e, t) => Kt(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Jt(e, t, n, r) {
	let i = (e, t) => T`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return T`<fieldset>
    <legend class="lbl">${I("book.which")}</legend>
    ${i(Gt, I("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, T`<span
          >${t.expires_on ? gt(e, t.expires_on) : I("book.no_date")} · ${t.location}
          <span class="detail">${I("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var Yt = o`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, Xt = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: Gt
}), Zt = null, Qt = class extends P {
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
			f: { state: !0 }
		};
	}
	constructor() {
		super(), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = Xt();
	}
	willUpdate(e) {
		e.has("product") && (this.draft = this.product, this.f = Xt());
	}
	focusFirst() {
		let e = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
		this.renderRoot.querySelector(e)?.focus();
	}
	dflt(e) {
		let t = this.draft?.[e];
		if (t != null) return {
			value: t,
			source: I("book.from_product")
		};
		let n = Q(this.md, this.draft?.category_id, e);
		if (n) return n;
		if (e === "default_location_id" && Zt != null) return {
			value: Zt,
			source: I("book.last_used")
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
		let t = this.draft, n = this.hass, { packages: r } = this.f, i = "";
		if (Object.keys(this.errors(t)).length) return;
		if (this.mode === "in") {
			let e = this.f.location_id ?? this.dflt("default_location_id")?.value ?? null, a = t.id ? void 0 : Object.fromEntries([
				"ean",
				"name",
				"brand",
				"category_id",
				"content_amount",
				"content_unit_id",
				"image_url",
				"off_json"
			].map((e) => [e, t[e] === "" ? null : t[e] ?? null]));
			if (a && this.f.makeDefault && e !== Q(this.md, t.category_id, "default_location_id")?.value && (a.default_location_id = e), !await this.run(() => st(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: a }
			}))) return;
			Zt = e, i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = Kt(this.stock, this.f.pick);
			if (!await this.run(() => ct(n, {
				product_id: t.id,
				packages: r,
				...e ? {
					batch_id: e.batch_id,
					location_id: e.location_id
				} : {}
			}))) return;
		}
		let a = I(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		});
		this.dispatchEvent(new CustomEvent("booked", { detail: a }));
	}
	render() {
		let e = this.draft;
		if (!e) return D;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? T`<h2>${e.name}</h2>
            <p class="empty" data-testid="no-stock">${I("book.no_stock")}</p>` : D;
		let n = this.mode === "out" ? qt(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return T`<form class="book" @submit=${this.submit}>
      ${t ? T`<h2>
              ${e.name}${e.brand ? T` <span class="detail">${e.brand}</span>` : D}
            </h2>` : T`<h2>${I("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${Wt(this.md, e, Rt(this.md, e.category_id), X(this.hass)) || I("book.new_product")}
                ${e.id ? D : T`<span class="detail">${I("book.is_new")}</span>`}
              </p>`}
      ${t ? Jt(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : T`${e.id ? D : Ut(this.md, e, (e, t) => this.setProduct(e, t), r)}${this.renderDate(r)}`}
      <label>
        <span class="lbl">${I("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? D}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${G(r.packages, "packages")}
      </label>
      ${t ? D : this.renderLocation(e, r)}
      <div class="actions">
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${I(`book.submit_${this.mode}`)}
        </button>
        <button
          type="button"
          data-testid="cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
        >
          ${I("common.cancel")}
        </button>
      </div>
    </form>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? Ht(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && ((i || r && !$e(r)) && (t.expires = I("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = I("valid.location")));
		let a = this.mode === "out" ? qt(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = I("valid.packages") : a != null && n > a && (t.packages = I("valid.max_packages", { n: a })), t;
	}
	renderDate(e) {
		let t = !e.expires && this.f.expires_on && this.f.expires_on < Qe();
		return T`<label>
      <span class="lbl">${this.dateLabel()}</span>
      <input
        id="expires"
        data-testid="expires"
        type="date"
        min="2000-01-01"
        max="2099-12-31"
        aria-invalid=${!!e.expires}
        .value=${this.f.expires_on}
        @input=${(e) => {
			let t = e.target;
			this.f = {
				...this.f,
				expires_on: t.value,
				dateBad: t.validity.badInput
			};
		}}
      />
      ${e.expires || t ? T`${G(e.expires, "expires")}${t ? G(I("valid.past"), "expires", !0) : ""}` : T`<span class="detail">${I("book.no_date_hint")}</span>`}
    </label>`;
	}
	dateLabel() {
		let e = this.dflt("expiry_type")?.value;
		return e ? I("book.expires_on_type", { type: I(`settings.expiry.${e}`) }) : I("book.expires_on");
	}
	renderLocation(e, t) {
		return T`<label>
        <span class="lbl">${I("book.location")}</span>
        ${Bt({
			testid: "location",
			own: this.f.location_id,
			dflt: this.dflt("default_location_id"),
			options: (this.md?.locations ?? []).map((e) => [e.id, e.name]),
			numeric: !0,
			invalid: !!t.location,
			onChange: (e) => this.f = {
				...this.f,
				location_id: e
			}
		})}
        ${G(t.location, "location")}
      </label>
      ${e.id ? D : T`<label class="check">
              <input
                type="checkbox"
                data-testid="make-default"
                .checked=${this.f.makeDefault}
                @change=${(e) => this.f = {
			...this.f,
			makeDefault: e.target.checked
		}}
              />${I("book.make_default")}
            </label>`}`;
	}
	static {
		this.styles = [
			L,
			Yt,
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
customElements.define("pantry-booking-form", Qt);
//#endregion
//#region src/booking-view.ts
var $t = /^\d{8,14}$/, en = class extends P {
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
			error: { state: !0 },
			busy: { state: !0 }
		};
	}
	constructor() {
		super(), this.run = async (e) => {
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
		this.query = "", this.hits = void 0, this.online = !1, this.product = void 0, this.stock = void 0, this.error = "";
	}
	willUpdate(e) {
		e.has("mode") && e.get("mode") && (this.reset(), this.message = ""), e.has("hass") && this.hass && !this.md && q(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e));
	}
	firstUpdated() {
		this.focusInput();
	}
	focusInput() {
		this.updateComplete.then(() => this.renderRoot.querySelector("#code")?.focus());
	}
	async fail(e) {
		this.error = this.hass ? await K(this.hass, e) : String(e);
	}
	async find(e) {
		e?.preventDefault();
		let t = this.query.trim();
		if (!t || !this.hass) return;
		let n = this.hass;
		if (this.message = "", this.product = this.stock = this.hits = void 0, this.online = !1, $t.test(t)) {
			let e = await this.run(() => at(n, t));
			return e ? e.product ? this.choose(e.product) : this.mode === "out" ? void (this.error = I("book.unknown")) : this.choose(this.blank({ ean: t })) : void 0;
		}
		let r = await this.run(() => ot(n, t));
		r && (this.hits = r, this.mode === "out" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = await this.run(() => ot(e, this.query.trim(), !0));
		t && (this.hits = t, this.online = !0);
	}
	blank(e) {
		return {
			ean: null,
			name: "",
			brand: null,
			category_id: null,
			content_amount: null,
			content_unit_id: null,
			...e
		};
	}
	async pick(e) {
		if (e.id || !e.ean) return this.choose(e);
		let t = await this.run(() => at(this.hass, e.ean));
		t?.product && this.choose(t.product);
	}
	async choose(e) {
		if (this.hits = void 0, this.mode === "out" && !e.id) return void (this.error = I("book.unknown"));
		this.product = e, this.mode === "out" && (this.stock = await this.run(() => J(this.hass, e.id))), await this.updateComplete;
		let t = this.renderRoot.querySelector("pantry-booking-form");
		await t?.updateComplete, t?.focusFirst();
	}
	openScanner() {
		this.renderRoot.querySelector("pantry-scanner")?.open();
	}
	scanned(e) {
		this.query = e.detail, this.find();
	}
	render() {
		return T`
      <form class="scan" @submit=${this.find}>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${I("book.input")}
          placeholder=${I("book.input")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button type="button" data-testid="camera" @click=${this.openScanner}>
          ${z(Pe)}<span>${I("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
      ${this.message ? T`<p class="done" role="status" data-testid="message">${this.message}</p>` : D}
      ${this.error ? T`<p class="error" role="alert" data-testid="error">${this.error}</p>` : D}
      ${this.hits ? this.renderHits() : D} ${this.renderForm()}
    `;
	}
	renderHits() {
		let e = this.hits;
		return T`
      ${e.length ? D : T`<p class="empty">${I("book.no_hits")}</p>`}
      <ul>
        ${e.map((e) => T`<li>
              <button class="row" data-testid="hit" @click=${() => this.pick(e)}>
                <span>${e.name}</span>
                <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
              </button>
            </li>`)}
      </ul>
      ${this.mode === "in" ? T`<div class="actions after">
              ${this.online ? D : T`<button
                      data-testid="search-online"
                      ?disabled=${this.busy}
                      @click=${this.searchOnline}
                    >
                      ${I("book.search_online")}
                    </button>`}
              <button
                data-testid="new-product"
                @click=${() => this.choose(this.blank({ name: this.query.trim() }))}
              >
                ${I("book.new_product")}
              </button>
            </div>` : D}
    `;
	}
	renderForm() {
		return this.product ? T`<pantry-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @cancel=${() => (this.reset(), this.focusInput())}
    ></pantry-booking-form>` : D;
	}
	booked(e) {
		this.reset(), this.message = e.detail, this.focusInput();
	}
	static {
		this.styles = [L, o`
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
      .done {
        margin: 0 0 12px;
      }
      .after {
        margin-top: 12px;
      }
    `];
	}
};
customElements.define("pantry-booking", en);
//#endregion
//#region src/stock-data.ts
function tn(e, t, n, r = [], i) {
	let a = t.trim().toLocaleLowerCase(), o = (e) => e.join(" ").toLocaleLowerCase().includes(a), s = /* @__PURE__ */ new Map();
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
		Rt(i, e.category_id)
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
var nn = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${Qe()}T00:00`)) / 864e5);
function rn(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = nn(e.expires_on);
	return i < 0 ? "expired" : i <= (r ?? Number(t?.warn_days ?? Q(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/take-out.ts
async function an(e, t, n) {
	try {
		await t(), e.undo = n, e.stock = await J(e.hass);
	} catch (t) {
		e.undo = void 0, e.error = await K(e.hass, t);
	}
}
var on = (e, t, n) => an(e, () => ct(e.hass, {
	product_id: n.product_id,
	packages: 1,
	batch_id: n.batch_id,
	location_id: n.location_id
}), {
	name: t,
	row: n
}), sn = (e) => {
	let { row: t } = e.undo;
	return an(e, () => st(e.hass, {
		product_id: t.product_id,
		packages: 1,
		expires_on: t.expires_on,
		location_id: t.location_id
	}));
}, cn = (e, t, n, r) => {
	let i = I("stock.take_one", { name: t });
	return T`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => on(e, t, n)}
  >
    ${z(Be)}
  </button>`;
}, ln = (e, t) => T`<p class="done" role="status" data-testid=${`${t}-done`}>
    ${e.undo ? T`${I("stock.taken_one", { name: e.undo.name })}
            <button class="undo" data-testid=${`${t}-undo`} @click=${() => sn(e)}>
              ${I("stock.undo")}
            </button>` : D}
  </p>`, un = o`
  .undo {
    padding: 4px 8px;
    color: var(--primary-color);
  }
  .done {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    margin: 0 0 4px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
`, dn = (e) => T`<div class="filters">
      <input
        class="filter"
        type="search"
        data-testid="stock-filter"
        aria-label=${I("stock.search_hint")}
        placeholder=${I("stock.search")}
        .value=${e.filter}
        @input=${(t) => e.filter = t.target.value}
      />
      <select
        data-testid="stock-location"
        aria-label=${I("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" ?selected=${e.location == null}>${I("stock.all_locations")}</option>
        ${(e.md?.locations ?? []).map((t) => T`<option value=${t.id} ?selected=${t.id === e.location}>${t.name}</option>`)}
      </select>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${e.withEmpty}
        @change=${(t) => e.withEmpty = t.target.checked}
      />
      ${I("stock.with_empty")}
    </label>`, fn = o`
  .filters {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, pn = [
	"name",
	"brand",
	"ean",
	"category_id",
	"content_amount",
	"content_unit_id",
	"default_location_id",
	"expiry_type",
	"warn_days"
], mn = class extends P {
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
		let t = Ht(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = I("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = I("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = I("valid.days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of pn) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await dt(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return T`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => Q(this.md, e.category_id, t);
		return H({
			title: I("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: T`${Ut(this.md, e, (e, t) => this.set(e, t), t)}
        <label>
          <span class="lbl">${I("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${G(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl">${I("settings.category.location")}</span>
          ${Bt({
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
          <span class="lbl">${I("settings.category.expiry_type")}</span>
          ${Bt({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, I(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl">${I("settings.category.warn_days")}</span>
          ${Vt({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => vt(this.hass, e),
				suffix: I("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${G(t.warn_days, "warn-days")}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => pn.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = L;
	}
};
customElements.define("pantry-product-dialog", mn);
//#endregion
//#region src/batch-dialog.ts
var hn = class extends P {
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
		return (e.dateBad || e.expires_on && !$e(e.expires_on)) && (t.expires = I("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = I("valid.days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await lt(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return T`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return H({
			title: I("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: T`<label>
          <span class="lbl">
            ${I("book.expires_on_type", { type: I(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? G(t.expires, "batch-expires") : T`<span class="detail">${I("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${I("book.packages")}</span>
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
          ${t.packages ? G(t.packages, "batch-packages") : T`<span class="detail">${I("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = L;
	}
};
customElements.define("pantry-batch-dialog", hn);
//#endregion
//#region src/stock-view.ts
var gn = class extends P {
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
			undo: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.reload = async () => {
			let [e, t] = await Promise.all([J(this.hass), ut(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.filter = "", this.location = null, this.withEmpty = !1, this.open = /* @__PURE__ */ new Set(), this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.md && this.load();
	}
	async load() {
		try {
			this.md = await q(this.hass), await this.reload(), await this.updateComplete, this.renderRoot.querySelector(".filter")?.focus();
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	tree(e) {
		let t = this.md?.categories ?? [], n = tn(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md), r = /* @__PURE__ */ new Map(), i = (e) => {
			let [a, o] = [0, 0];
			for (let t of n.get(e) ?? []) [a, o] = [a + t.packages, o + 1];
			for (let n of t.filter((t) => t.parent_id === e)) {
				let [e, t] = i(n.id);
				[a, o] = [a + e, o + t];
			}
			return r.set(e, [a, o]), [a, o];
		}, a = [], o = (s, c) => {
			for (let l of t.filter((e) => e.parent_id === s)) {
				let [t, s] = r.get(l.id) ?? i(l.id);
				if (!s) continue;
				let u = e || this.open.has(`c${l.id}`);
				if (a.push(this.renderCategory(l.id, l.name, t, c, u)), u) {
					o(l.id, c + 1);
					for (let t of n.get(l.id) ?? []) a.push(this.renderItem(t, c + 1, e || this.open.has(`p${t.id}`)));
				}
			}
		};
		return o(null, 0), a;
	}
	renderCategory(e, t, n, r, i) {
		return T`<li style="padding-left:${r * 24}px">
      ${U(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${I("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return rn(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		return e.expires_on ? gt(this.hass, e.expires_on) : I("stock.no_date");
	}
	toggle(e) {
		this.open = Ze(this.open, e);
	}
	render() {
		if (this.error) return T`<p class="error" role="alert">${this.error}</p>`;
		if (!this.stock) return D;
		let e = this.tree(this.filter.trim() !== "");
		return T`
      ${dn(this)} ${ln(this, "stock")}
      ${e.length ? T`<ul>
              ${e}
            </ul>` : T`<p class="empty">
              ${I(this.stock.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`}
      <pantry-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @pantry-saved=${this.reload}
      ></pantry-product-dialog>
      <pantry-batch-dialog .hass=${this.hass} @pantry-saved=${this.reload}></pantry-batch-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("pantry-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		try {
			if (!await Mt(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	editBatch(e) {
		this.renderRoot.querySelector("pantry-batch-dialog").open(e);
	}
	renderItem(e, t, n) {
		let r = e.batches[0], i = r ? () => this.toggle(`p${e.id}`) : () => this.editProduct(e.id);
		return T`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? U(n, i) : T`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : D}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, I("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? T` · <span class=${this.status(r)}>${this.date(r)}</span>` : D}
          </span>
        </button>
        ${W({
			testid: "product",
			name: e.name,
			onEdit: () => this.editProduct(e.id),
			onDelete: this.hass?.user?.is_admin ? () => this.deleteProduct(e) : void 0
		})}
      </div>
      ${n ? T`<ul class="batches">
              ${e.batches.map((t) => T`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${I("book.count", { n: t.packages })}</span>
                    ${cn(this, e.name, t, "stock-batch-out")}
                    ${W({
			testid: "batch",
			name: `${e.name}, ${this.date(t)}`,
			onEdit: () => this.editBatch(t)
		})}
                  </li>`)}
            </ul>` : D}
    </li>`;
	}
	static {
		this.styles = [
			L,
			un,
			fn,
			o`
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
    `
		];
	}
};
customElements.define("pantry-stock", gn);
//#endregion
//#region src/expiry-view.ts
var _n = class extends P {
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
		super(), this.products = /* @__PURE__ */ new Map(), this.days = "", this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.md && this.load();
	}
	async load() {
		try {
			let [e, t, n] = await Promise.all([
				q(this.hass),
				J(this.hass),
				ut(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? I("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(X(this.hass), { numeric: "auto" }).format(nn(e), "day");
	}
	render() {
		if (this.error) return T`<p class="error" role="alert">${this.error}</p>`;
		if (!this.stock) return D;
		let e = this.errors(), t = this.days.trim() && !e ? Number(this.days) : void 0, n = this.stock.map((e) => ({
			r: e,
			status: rn(e, this.products.get(e.product_id), this.md, t)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return T`
      <div class="field">
        <label class="lbl" for="days">${I("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${I("expiry.days_placeholder")}
            aria-invalid=${!!e}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${I("common.days_unit")}
        </span>
        ${G(e, "expiry-days")}
      </div>
      ${ln(this, "expiry")}
      ${n.length ? T`<ul>
              ${n.map(({ r: e, status: t }) => T`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}>${gt(this.hass, e.expires_on)}</span>
                      <span class="detail">${this.relative(e.expires_on)}</span>
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[e.brand, e.location].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${I("book.count", { n: e.packages })}</span>
                    ${cn(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : T`<p class="empty">${I("expiry.empty")}</p>`}
    `;
	}
	static {
		this.styles = [
			L,
			un,
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
customElements.define("pantry-expiry", _n);
//#endregion
//#region node_modules/lit-html/directive.js
var $ = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, vn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), yn = class {
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
}, { I: bn } = Ae, xn = (e) => e.strings === void 0, Sn = {}, Cn = (e, t = Sn) => e._$AH = t, wn = vn(class extends yn {
	constructor(e) {
		if (super(e), e.type !== $.PROPERTY && e.type !== $.ATTRIBUTE && e.type !== $.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!xn(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === E || t === D) return t;
		let n = e.element, r = e.name;
		if (e.type === $.PROPERTY) {
			if (t === n[r]) return E;
		} else if (e.type === $.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return E;
		} else if (e.type === $.ATTRIBUTE && n.getAttribute(r) === t + "") return E;
		return Cn(e), t;
	}
}), Tn = 8, En = class extends P {
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
		try {
			[this.md, this.products] = await Promise.all([q(this.hass), ut(this.hass)]);
		} catch (e) {
			this.error = await K(this.hass, e);
		}
		this.item = e, this.query = "", this.choice = void 0, this.packages = e?.packages ?? 1, this.error = "", this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		let t = [];
		for (let n = this.md?.categories.find((t) => t.id === e); n;) t.unshift(n.name), n = this.md.categories.find((e) => e.id === n.parent_id);
		return t.join(" › ");
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = I("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, Ht(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = I("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = I("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await mt(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await Y(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await Y(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await Y(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await Y(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await K(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	hit(e, t, n, r) {
		return T`<li>
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
		if (!e) return D;
		let t = e.toLocaleLowerCase(), n = (e) => !!e && e.toLocaleLowerCase().includes(t), r = this.products.filter((e) => n(e.name) || n(e.brand)).slice(0, Tn), i = (this.md?.categories ?? []).filter((e) => n(e.name)).slice(0, Tn), a = {
			name: e,
			brand: null,
			ean: null,
			category_id: null,
			content_amount: null,
			content_unit_id: null
		};
		return T`<ul>
      ${r.map((e) => this.hit("shopping-hit", e.name, [e.brand, this.path(e.category_id)].filter(Boolean).join(" · "), {
			kind: "product",
			id: e.id,
			name: e.name
		}))}
      ${i.map((e) => this.hit("shopping-hit", e.name, I("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", I("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: a
		})}
      ${this.hass?.user?.is_admin ? this.hit("shopping-new-category", I("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : D}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return T`<label>
          <span class="lbl">${I("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? G(e.what, "shopping-what") : D}
        </label>
        ${this.hits()}`;
		let n = T`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${I("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? T`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : I("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? T`<p class="detail">${I("shopping.add.creates_product")} ${n}</p>
        ${Ut(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : T`<p class="detail">${I("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${I("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${G(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${I("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${I("settings.category.no_parent")}
          @change=${(e) => this.choice = {
			...t,
			parent_id: e.detail
		}}
        ></pantry-category-picker>
      </div>`;
	}
	render() {
		if (!this.active) return T`<dialog></dialog>`;
		let e = this.errors();
		return H({
			title: this.item ? I("common.edit_name", { name: this.item.name }) : I("shopping.add.title"),
			body: T`${this.item ? D : this.what(e)}
        <label>
          <span class="lbl">${I("shopping.add.packages")}</span>
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
				this.packages = t === "" ? null : Number(t);
			}}
            />
            <span class="detail">${I("book.packages")}</span>
          </span>
          ${G(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = L;
	}
};
customElements.define("pantry-shopping-add", En);
//#endregion
//#region src/shopping-view.ts
var Dn = class extends P {
	static {
		this.properties = {
			hass: { attribute: !1 },
			items: { state: !0 },
			cats: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.items && this.load();
	}
	async load() {
		try {
			[this.items, this.cats] = await Promise.all([ft(this.hass), q(this.hass).then((e) => e.categories)]), this.error = "";
		} catch (e) {
			this.error = await K(this.hass, e);
		}
	}
	async check(e, t) {
		try {
			e.manual ? await mt(this.hass, e.id, { done: t }) : await pt(this.hass, e.category_id, t);
		} catch (e) {
			this.error = await K(this.hass, e);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await Je(e.name)) {
			try {
				await ht(this.hass, e.id);
			} catch (e) {
				this.error = await K(this.hass, e);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("pantry-shopping-add").open(e);
	}
	missing(e) {
		if (e.manual) return [e.product_id ? e.brand : I("shopping.any"), I("book.count", { n: e.packages })].filter(Boolean).join(" · ");
		let t = [];
		return e.amount && t.push(`${_t(this.hass, e.amount.missing)} ${e.amount.unit_symbol}`), e.packages && t.push(I("book.count", { n: e.packages })), I(e.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: t.join(I("shopping.and")) });
	}
	row(e, t, n = !1) {
		let r = e.amount?.unknown_products;
		return T`<li
      data-testid="shopping-row"
      class="${e.done ? "done" : ""} ${n ? "cat" : ""}"
      style="padding-left:${t * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${wn(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="name">${e.name}</span>
          <span class="detail">${this.missing(e)}</span>
          ${r ? T`<span class="detail">${I("shopping.unknown", { n: r })}</span>` : D}
        </span>
      </label>
      ${e.manual ? W({
			testid: "shopping",
			name: e.name,
			onEdit: () => this.openAdd(e),
			onDelete: () => this.removeItem(e)
		}) : D}
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
				i.push(t ? this.row(t, o, !0) : T`<li
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
		return this.error ? T`<p class="error" role="alert">${this.error}</p>` : !this.items || !this.cats ? D : T`${T`<div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${I("shopping.add.title")}
        </button>
      </div>
      <pantry-shopping-add .hass=${this.hass} @pantry-saved=${this.load}></pantry-shopping-add>`}
    ${this.items.length ? T`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : T`<p class="empty">${I("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [L, o`
      .bar {
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
        padding: 4px 0 4px 8px;
        cursor: pointer;
      }
      .what {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .done .name {
        text-decoration: line-through;
        color: var(--secondary-text-color);
      }
    `];
	}
};
customElements.define("pantry-shopping", Dn);
//#endregion
//#region src/pantry-panel.ts
var On = [
	"stock",
	"in",
	"out",
	"expiry",
	"shopping",
	"settings"
], kn = class extends P {
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
	}
	willUpdate(e) {
		e.has("hass") && this.hass && Ke(this.hass.language);
	}
	get tab() {
		let e = (this.route?.path ?? "").split("/").filter(Boolean)[0];
		return e === "settings" && !this.hass?.user?.is_admin ? "stock" : On.includes(e) ? e : "stock";
	}
	get sub() {
		return (this.route?.path ?? "").split("/").filter(Boolean)[1];
	}
	select(e) {
		history.pushState(null, "", `${this.route?.prefix ?? ""}/${e}`), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.tab;
		return T`
      <header>
        ${this.narrow ? T`<button
                class="menu"
                aria-label=${I("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  ${xe`<path d=${Re} fill="currentColor"></path>`}
                </svg>
              </button>` : D}
        <h1>${I("panel.title")}</h1>
      </header>
      <div role="tablist">
        ${On.filter((e) => e !== "settings" || this.hass?.user?.is_admin).map((t) => T`<button
              role="tab"
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${I(`tab.${t}`)}
            </button>`)}
      </div>
      <main role="tabpanel" @pantry-navigate=${(e) => this.select(e.detail)}>
        ${e === "settings" ? T`<pantry-settings .hass=${this.hass} .section=${this.sub}></pantry-settings>` : e === "in" || e === "out" ? T`<pantry-booking .hass=${this.hass} .mode=${e}></pantry-booking>` : e === "stock" ? T`<pantry-stock .hass=${this.hass}></pantry-stock>` : e === "expiry" ? T`<pantry-expiry .hass=${this.hass}></pantry-expiry>` : T`<pantry-shopping .hass=${this.hass}></pantry-shopping>`}
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
customElements.define("pantry-panel", kn);
//#endregion
export { kn as PantryPanel };
