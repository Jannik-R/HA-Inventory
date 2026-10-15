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
var h = globalThis, le = (e) => e, g = h.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", x = Array.isArray, me = (e) => x(e) || typeof e?.[Symbol.iterator] == "function", S = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${S}(?:([^\\s"'>=/]+)(${S}*=${S}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, be = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = be(1), xe = be(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), O = v.createTreeWalker(v, 129);
function Ce(e, t) {
	if (!x(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? De : r[1] === "?" ? Oe : r[1] === "@" ? ke : j
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === fe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += _.length - 1;
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
function k(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = k(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
				s.type === 2 ? t = new A(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ae(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, A = class e {
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
		e = k(this, e, t), b(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
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
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		x(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = le(e).nextSibling;
			le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, j = class {
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
		if (i === void 0) e = k(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = k(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, De = class extends j {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Oe = class extends j {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, ke = class extends j {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = k(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ae = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		k(this, e);
	}
}, je = {
	M: de,
	P: _,
	A: fe,
	C: 1,
	L: we,
	R: Ee,
	D: me,
	V: k,
	I: A,
	H: j,
	N: Oe,
	U: ke,
	B: De,
	F: Ae
}, Me = h.litHtmlPolyfillSupport;
Me?.(Te, A), (h.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new A(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, M = globalThis, N = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
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
N._$litElement$ = !0, N.finalized = !0, M.litElementHydrateSupport?.({ LitElement: N });
var Pe = M.litElementPolyfillSupport;
Pe?.({ LitElement: N }), (M.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Fe = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Ie = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Le = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Re = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", ze = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", Be = "M7,10L12,15L17,10H7Z", Ve = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", He = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", Ue = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", We = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", Ge = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z", P = {
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
	"delete.kind.other": "Weitere Daten in „{table}“ ({n})",
	"label.print": "Etiketten drucken",
	"label.print_name": "Etiketten für {name} drucken",
	"label.title": "Etiketten für „{name}“ drucken",
	"label.count": "Anzahl",
	"label.in_stock": "{n} Packungen im Lager",
	"label.submit": "Drucken",
	"valid.label_count": "Bitte eine ganze Zahl von 1 bis 99 eingeben.",
	"label.confirm_many": "{n} Etiketten drucken?",
	"label.printed": "{n} Etiketten gedruckt",
	"book.done_label": "1 × {name} aus {where} ausgebucht"
}, Ke = { de: P }, qe = P;
function Je(e) {
	let t = e ?? "";
	qe = Ke[t] ?? Ke[t.split("-")[0]] ?? P;
}
function F(e, t) {
	let n = qe[e] ?? P[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/styles.ts
var I = o`
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
`, Ye = class extends N {
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
          ${F("common.cancel")}
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
		this.styles = [I, o`
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
customElements.define("pantry-confirm", Ye);
function L(e) {
	return new Promise((t) => {
		let n = document.createElement("pantry-confirm");
		n.o = e, n.resolve = t, document.body.append(n);
	});
}
var Xe = (e, t) => L({
	title: F("common.delete_name", { name: e }) + "?",
	message: t,
	action: F("common.delete"),
	danger: !0
}), R = (e) => T`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${xe`<path d=${e} fill="currentColor"></path>`}
  </svg>`, z = !1;
async function Ze(e, t) {
	if (!t?.()) return e.close();
	if (!z) {
		z = !0;
		try {
			await L({
				title: F("common.discard"),
				action: F("common.discard_ok")
			}) && e.close();
		} finally {
			z = !1;
		}
	}
}
var Qe = (e) => (t) => {
	let n = t.target;
	if (n.tagName !== "DIALOG") return;
	let r = n.getBoundingClientRect();
	(t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) && Ze(n, e);
}, $e = (e) => (t) => {
	t instanceof KeyboardEvent && t.key !== "Escape" || e() && t.cancelable && (t.preventDefault(), Ze(t.currentTarget, e));
}, B = (e) => T`<dialog
    @close=${e.onClosed}
    @click=${Qe(e.dirty)}
    @keydown=${$e(e.dirty)}
    @cancel=${$e(e.dirty)}
  >
    <form @submit=${e.onSubmit}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? T`<p class="error" role="alert">${e.error}</p>` : D}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${F("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${e.submit?.testid ?? "save"}
          ?disabled=${e.invalid}
        >
          ${e.submit?.label ?? F("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, V = (e, t) => T`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${F(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${R(e ? Ie : Le)}
  </button>`;
function H(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var U = (e) => T`${e.onAdd ? T`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${R(Ue)}
          </button>` : D}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${F("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${R(He)}
    </button>
    ${e.onDelete ? T`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${F("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${R(Re)}
          </button>` : D}`, W = (e, t, n = !1) => e ? T`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : D, et = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, tt = (e) => e >= "2000-01-01" && e <= "2099-12-31";
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
		source: F("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: F("settings.inherit_from", { name: a ?? "" })
	};
}
var nt = (e, t) => T`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${R(We)}${F("common.reset")}
  </button>`;
function rt(e) {
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
        ${e.dflt ? F("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : F(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => T`<option value=${e} ?selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? D : nt(e.testid, () => e.onChange(null))}
  </span>`;
}
function it(e) {
	let t = e.own ?? null;
	return T`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? F("common.default", {
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
    ${t == null ? D : nt(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/category-picker.ts
var at = class extends N {
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
	chain(e) {
		let t = [];
		for (let n = e; n != null; n = this.categories.find((e) => e.id === n)?.parent_id ?? null) t.unshift(n);
		return t;
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
		this.expanded = H(this.expanded, e);
	}
	rows() {
		let e = this.filter.trim().toLocaleLowerCase();
		if (e) return this.categories.filter((t) => t.name.toLocaleLowerCase().includes(e)).filter((e) => this.exclude == null || !this.chain(e.id).includes(this.exclude)).map((e) => ({
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
		let e = this.rows(), t = !!this.filter.trim();
		return T`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? F("book.choose") : G(this.categories, this.value)}
        </span>
        ${R(Be)}
      </button>
      <dialog @click=${Qe()}>
        <h2>${F("book.choose_category")}</h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${F("book.filter")}
          placeholder=${F("book.filter")}
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
              ${i ? V(a, () => this.toggle(e.id)) : t ? D : T`<span class="chev"></span>`}
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
        ${e.length ? D : T`<p class="empty">${F("book.no_hits")}</p>`}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${F("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0}
            @click=${this.confirm}
          >
            ${F("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [I, o`
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
customElements.define("pantry-category-picker", at);
//#endregion
//#region src/api.ts
async function q(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var J = (e) => e.callWS({ type: "pantry/master_data" }), ot = (e, t, n) => e.callWS({
	type: "pantry/save",
	table: t,
	data: n
}), st = (e, t) => e.callWS({
	type: "pantry/defaults_save",
	data: t
}), ct = (e, t, n, r = {}) => e.callWS({
	type: "pantry/delete",
	table: t,
	row_id: n,
	...r
}), lt = (e, t, n) => e.callWS({
	type: "pantry/delete_impact",
	table: t,
	row_id: n
}), ut = (e, t) => e.callWS({
	type: "pantry/lookup",
	code: t
}), dt = (e, t, n = !1) => e.callWS({
	type: "pantry/search",
	query: t,
	online: n
}), ft = (e, t) => e.callWS({
	type: "pantry/book_in",
	...t
}), pt = (e, t) => e.callWS({
	type: "pantry/book_out",
	...t
}), mt = (e, t) => e.callWS({
	type: "pantry/put_back",
	booking_ids: t.map((e) => e.booking_id)
}), ht = (e, t) => e.callWS({
	type: "pantry/stock_edit",
	...t
}), Y = (e, t) => e.callWS({
	type: "pantry/stock",
	product_id: t
}), gt = (e) => e.callWS({ type: "pantry/products" }), _t = (e, t) => e.callWS({
	type: "pantry/product_save",
	data: t
}), vt = (e) => e.callWS({ type: "pantry/shopping" }), yt = (e, t, n) => e.callWS({
	type: "pantry/shopping_done",
	category_id: t,
	done: n
}), X = (e, t) => e.callWS({
	type: "pantry/shopping_add",
	...t
}), bt = (e, t, n) => e.callWS({
	type: "pantry/shopping_item",
	item_id: t,
	...n
}), xt = (e, t) => e.callWS({
	type: "pantry/shopping_item_delete",
	item_id: t
}), St = (e) => e.callWS({ type: "pantry/label_config" }), Ct = (e, t) => e.callWS({
	type: "pantry/print_labels",
	...t
}), wt = (e, t) => e.callWS({
	type: "pantry/book_out_label",
	code: t
}), Z = (e) => e?.locale?.language ?? e?.language, Tt = (e, t) => new Intl.DateTimeFormat(Z(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), Et = (e, t) => new Intl.NumberFormat(Z(e)).format(t), Dt = (e, t) => F(new Intl.PluralRules(Z(e)).select(Number(t)) === "one" ? "settings.day" : "settings.days", { n: t });
//#endregion
//#region src/settings-format.ts
function Ot(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function kt(e, t) {
	return t === "default" ? F("settings.inherit_default") : F("settings.inherit_from", { name: Ot(e, t) });
}
function At(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: e.defaults[t],
		source: "default"
	};
}
function Q(e, t, n, r) {
	if (r == null) return F("common.none_dash");
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : F("common.none_dash");
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? F("common.none_dash") : n === "expiry_type" ? F(`settings.expiry.${r}`) : Dt(t, r);
}
//#endregion
//#region src/min-stock.ts
function jt(e) {
	let t = {};
	return e.min_stock != null && !(e.min_stock > 0) && (t.min_stock = F("valid.positive")), e.min_packages != null && !(Number.isInteger(e.min_packages) && e.min_packages >= 1) && (t.min_packages = F("valid.packages")), t;
}
function Mt(e) {
	let { d: t, errs: n } = e, r = (e) => {
		let t = e.target.value;
		return t === "" || Number(t) === 0 ? null : Number(t);
	};
	return T`<label>
      <span class="lbl">${F("settings.category.min_stock")}</span>
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
          aria-label=${F("settings.category.unit")}
          ?disabled=${t.min_stock == null}
          @change=${(t) => e.set("min_stock_unit_id", Number(t.target.value))}
        >
          ${e.md.units.map((n) => T`<option value=${n.id} ?selected=${n.id === (t.min_stock_unit_id ?? e.unitId)}>
                ${n.symbol || n.name}
              </option>`)}
        </select>
      </span>
      ${W(n.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl">${F("settings.category.min_packages")}</span>
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
        <span class="detail">${F("book.packages")}</span>
      </span>
      ${W(n.min_packages, "min_packages")}
    </label>
    <p class="detail">${F("settings.category.min_hint")}</p>`;
}
//#endregion
//#region src/settings-dialog.ts
var Nt = {
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
}, Pt = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, Ft = class extends N {
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
		for (let i of Nt[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = F("valid.duplicate")) : n.name = F("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = F("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = F("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = F("valid.days")), Object.assign(n, jt(t))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of Nt[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await ot(this.hass, t, r);
		} catch (e) {
			this.error = await q(this.hass, e);
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
      />${W(this.errs[e], e)}`;
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
      >${e === "warn_days" ? D : W(this.errs[e], e)}`;
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
          ${R(We)}${F("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = At(i, e, this.edit.d.parent_id), o = Q(i, this.hass, e, a.value), s = kt(i, a.source), c = e === "warn_days" ? this.numInput(e, F("common.default", {
			value: o,
			source: s
		}), F("common.days_unit")) : this.select(e, n, F("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, T`<span class="inh">${c}${this.reset(e)}</span
        >${W(this.errs[e], e)}`);
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return T`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(F("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = a.filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = T`${this.field(F("common.name"), this.text("name"))}${this.field(F("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${F("settings.unit.is_count")}</label
        >
        ${this.field(F("settings.unit.base"), this.select("base_unit_id", e, F("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(F("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? At(i, "unit_id", n.parent_id).value, t = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = T`${this.field(F("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${F("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${F("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh("unit_id", F("settings.category.unit"), a.map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", F("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", F("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, F(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", F("settings.category.warn_days"), [])}
        ${Mt({
				md: i,
				d: n,
				errs: this.errs,
				unitId: e,
				set: (e, t) => this.set(e, t)
			})}
        ${t.length ? T`<p class="detail">${F("settings.category.off_tags", { tags: t.join(", ") })}</p>` : D}`;
		}
		let c = () => Nt[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? Ot(i, n.parent_id) : "";
		return B({
			title: n.id ? F("common.edit_name", { name: r.name }) : l ? F("settings.category.add_sub_to", { name: l }) : F(Pt[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [I];
	}
};
customElements.define("pantry-settings-dialog", Ft);
//#endregion
//#region src/defaults-view.ts
var It = [
	["unit_id", "settings.category.unit"],
	["default_location_id", "settings.category.location"],
	["expiry_type", "settings.category.expiry_type"],
	["warn_days", "settings.category.warn_days"]
], Lt = class extends N {
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
		return t === null || !Number.isInteger(t) || t < 0 ? F("valid.days") : void 0;
	}
	async save(e) {
		if (e.preventDefault(), !this.warnError(this.d)) try {
			await st(this.hass, this.d), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	render() {
		let e = this.data;
		return e ? T`<p class="detail intro">${F("settings.defaults.hint")}</p>
      <ul>
        ${It.map(([t, n]) => T`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${F(n)}</span>
                <span class="detail">${Q(e, this.hass, t, e.defaults[t])}</span>
              </button>
              ${U({
			testid: "default",
			name: F(n),
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
		return B({
			title: F("settings.defaults.edit"),
			body: T`<label>
          <span class="lbl">${F("settings.category.unit")}</span>
          ${this.select("unit_id", e.units.map((e) => [e.id, e.name]))}
        </label>
        <label>
          <span class="lbl">${F("settings.category.location")}</span>
          ${this.select("default_location_id", [[null, F("settings.defaults.no_location")], ...e.locations.map((e) => [e.id, e.name])])}
        </label>
        <label>
          <span class="lbl">${F("settings.category.expiry_type")}</span>
          ${this.select("expiry_type", ["best_before", "use_by"].map((e) => [e, F(`settings.expiry.${e}`)]))}
        </label>
        <label>
          <span class="lbl">${F("settings.category.warn_days")}</span>
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
            ${F("common.days_unit")}
          </span>
          ${W(n, "default-warn_days")}
        </label>`,
			error: this.error,
			invalid: !!n,
			dirty: () => It.some(([e]) => t[e] !== this.orig?.[e]),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = I;
	}
};
customElements.define("pantry-defaults", Lt);
//#endregion
//#region src/delete-flow.ts
var Rt = 5, zt = (e, t) => {
	let n = t.names.length || t.count, r = `delete.kind.${e === "location" && t.kind === "delete.stock" ? "location_stock" : t.kind}`, i = F(r, { n });
	return i === r ? F("delete.kind.other", {
		table: t.kind.split(".")[1],
		n
	}) : i;
}, Bt = (e) => {
	let t = e.names.length - Rt;
	return e.names.slice(0, Rt).join(", ") + (t > 0 ? F("delete.more", { n: t }) : "");
};
async function Vt(e, t, n, r) {
	let i = n === "location" || n === "unit" ? F(`settings.${n}.delete_hint`) : void 0, a = await lt(e, n, r.id);
	if (a.blocked) throw {
		translation_domain: "pantry",
		translation_key: a.blocked,
		message: a.blocked
	};
	if (!a.groups.length) return await Xe(r.name, i) ? (await ct(e, n, r.id), !0) : !1;
	let o = t.locations.filter((e) => e.id !== r.id), s = n === "location" ? o[0]?.id ?? null : null, c = T`<ul class="impact" data-testid="delete-impact">
      ${a.groups.map((e) => T`<li>
            <span class="kind">${zt(n, e)}</span>
            <span class="names">${Bt(e)}</span>
            ${e.packages ? T`<span class="names">${F("book.count", { n: e.packages })}</span>` : ""}
          </li>`)}
    </ul>
    ${n === "location" ? T`<label>
            <span class="lbl">${F("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e) => {
		let t = e.target.value;
		s = t ? Number(t) : null;
	}}
            >
              ${o.map((e) => T`<option value=${e.id}>${F("delete.move_to", { name: e.name })}</option>`)}
              <option value="">${F("delete.book_out")}</option>
            </select>
          </label>` : ""}`, l = a.groups.some((e) => e.kind.startsWith("delete.") && (n !== "location" || e.kind !== "delete.stock"));
	return await L({
		title: F("common.delete_name", { name: r.name }) + "?",
		message: i ?? F("delete.affected"),
		body: c,
		action: F(l ? "delete.all" : "common.delete"),
		danger: !0
	}) ? (await ct(e, n, r.id, {
		force: !0,
		move_to: s
	}), !0) : !1;
}
//#endregion
//#region src/settings-view.ts
var Ht = {
	categories: "category",
	locations: "location",
	units: "unit",
	defaults: null
}, Ut = class extends N {
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
		return this.section && this.section in Ht ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await J(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await q(this.hass, e);
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
		this.expanded = H(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => Q(t, this.hass, n, e[n]));
		if (e.min_stock != null) {
			let r = Q(t, this.hass, "unit_id", e.min_stock_unit_id);
			n.push(F("settings.category.min", { value: `${Et(this.hass, e.min_stock)} ${r}` }));
		}
		return e.min_packages != null && n.push(F("settings.category.min", { value: F("book.count", { n: e.min_packages }) })), n.join(" · ");
	}
	render() {
		let e = this.sec, t = Ht[e];
		return T`
      <nav aria-label=${F("settings.nav")}>
        ${Object.keys(Ht).map((t) => T`<button
              data-testid=${`settings-nav-${t}`}
              aria-current=${t === e ? "page" : "false"}
              @click=${() => this.nav(t)}
            >
              ${F(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? T`<p class="error" role="alert">${this.pageError}</p>` : D}
      ${this.data ? t ? T`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(t)}
                  >
                    ${F(Pt[t])}
                  </button>
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
		return e.length ? D : T`<p class="empty">${F("common.empty")}</p>`;
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
		return U({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: F("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		try {
			if (!await Vt(this.hass, this.data, e, t)) return;
			this.pageError = "";
		} catch (e) {
			this.pageError = await q(this.hass, e);
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
			return [t.symbol, n ? `= ${Et(this.hass, t.factor)} ${n.symbol}` : t.is_count ? F("settings.unit.count") : ""].filter(Boolean).join(" · ");
		};
		return T`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, D, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return T`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? V(r, () => this.toggle(e.id)) : T`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [I, o`
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
customElements.define("pantry-settings", Ut);
//#endregion
//#region src/scanner.ts
var Wt = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"qr_code"
];
async function Gt() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: Wt.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-DpUOKxRW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...Wt] });
}
var Kt = class extends N {
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
			this.error = F("scan.https");
			return;
		}
		let t;
		try {
			t = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
		} catch {
			this.error = F("scan.no_camera");
			return;
		}
		let n;
		try {
			n = await Gt();
		} catch {
			t.getTracks().forEach((e) => e.stop()), this.error = F("scan.detector");
			return;
		}
		if (!e.open) return t.getTracks().forEach((e) => e.stop());
		this.stream = t;
		let r = this.renderRoot.querySelector("video");
		r.srcObject = t;
		try {
			await r.play();
		} catch {
			this.error = F("scan.no_camera");
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
		return T`<dialog data-testid="scanner" @close=${this.stop} @click=${Qe()}>
      <h2>${F("scan.title")}</h2>
      ${this.error ? T`<p class="error" role="alert">${this.error}</p>` : T`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${F("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [I, o`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-scanner", Kt);
//#endregion
//#region src/label-print.ts
function qt(e, t, n, r) {
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
async function Jt(e, t, n) {
	if (n > 2 && !await L({
		title: F("label.confirm_many", { n }),
		action: F("label.submit")
	})) return null;
	let r = await Ct(e, {
		batch_id: t,
		count: n
	});
	return "printed" in r ? r.printed : (qt(r.image, r.count, r.width_mm, r.height_mm), 0);
}
//#endregion
//#region src/booking-in-fields.ts
function Yt(e, t, n, r) {
	let i = !n.expires && e.expires_on && e.expires_on < et();
	return T`<label>
    <span class="lbl"
      >${r ? F("book.expires_on_type", { type: F(`settings.expiry.${r}`) }) : F("book.expires_on")}</span
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
    ${n.expires || i ? T`${W(n.expires, "expires")}${i ? W(F("valid.past"), "expires", !0) : ""}` : T`<span class="detail">${F("book.no_date_hint")}</span>`}
  </label>`;
}
function Xt(e, t, n, r, i, a) {
	return T`<label>
      <span class="lbl">${F("book.location")}</span>
      ${rt({
		testid: "location",
		own: n.location_id,
		dflt: a,
		options: (e?.locations ?? []).map((e) => [e.id, e.name]),
		numeric: !0,
		invalid: !!i.location,
		onChange: (e) => r({ location_id: e })
	})}
      ${W(i.location, "location")}
    </label>
    ${t.id ? D : T`<label class="check">
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${n.makeDefault}
              @change=${(e) => r({ makeDefault: e.target.checked })}
            />${F("book.make_default")}
          </label>`}`;
}
function Zt(e, t, n) {
	return T`<label class="check">
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${e.print ?? n}
      @change=${(e) => t({ print: e.target.checked })}
    />${F("label.print")}
  </label>`;
}
//#endregion
//#region src/product-fields.ts
function Qt(e) {
	let t = {};
	return e.name.trim() || (t.name = F("valid.required")), e.category_id ?? (t.category = F("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = F("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = F("valid.content_pair")), t;
}
function $t(e, t, n, r = {}) {
	return T`<label>
      <span class="lbl">${F("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${W(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${F("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${F("book.category")}</span>
      <pantry-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        @change=${(e) => n("category_id", e.detail)}
      ></pantry-category-picker>
      ${W(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl">${F("book.content")}</span>
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
        <span class="lbl">${F("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" ?selected=${t.content_unit_id == null}>${F("common.none_dash")}</option>
          ${(e?.units ?? []).map((e) => T`<option value=${e.id} ?selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${W(r.content, "content")}`;
}
function en(e, t, n, r) {
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
var tn = "auto", nn = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), rn = (e, t) => nn(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function an(e, t, n, r) {
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
    <legend class="lbl">${F("book.which")}</legend>
    ${i(tn, F("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, T`<span
          >${t.expires_on ? Tt(e, t.expires_on) : F("book.no_date")} · ${t.location}
          <span class="detail">${F("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var on = o`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, sn = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: tn,
	print: null
}), cn = null, ln = class extends N {
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
		}, this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = sn();
	}
	willUpdate(e) {
		e.has("product") && (this.draft = this.product, this.f = sn(), this.hass && this.mode === "in" && St(this.hass).then((e) => this.labels = e, () => void 0));
	}
	focusFirst() {
		let e = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
		this.renderRoot.querySelector(e)?.focus();
	}
	dflt(e) {
		let t = this.draft?.[e];
		if (t != null) return {
			value: t,
			source: F("book.from_product")
		};
		let n = K(this.md, this.draft?.category_id, e);
		if (n) return n;
		if (e === "default_location_id" && cn != null) return {
			value: cn,
			source: F("book.last_used")
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
				"off_json"
			].map((e) => [e, t[e] === "" ? null : t[e] ?? null]));
			o && this.f.makeDefault && e !== K(this.md, t.category_id, "default_location_id")?.value && (o.default_location_id = e);
			let s = await this.run(() => ft(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: o }
			}));
			if (!s) return;
			if (cn = e, this.f.print ?? this.labels?.print_on_book_in) {
				let e = await this.run(() => Jt(n, s.batch_id, Math.min(r, 99)));
				e && (a = e);
			}
			i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = nn(this.stock, this.f.pick), i = await this.run(() => pt(n, {
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
		let s = F(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		}) + (a ? ` · ${F("label.printed", { n: a })}` : "");
		this.dispatchEvent(new CustomEvent("booked", { detail: {
			message: s,
			taken: o
		} }));
	}
	render() {
		let e = this.draft;
		if (!e) return D;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? T`<h2>${e.name}</h2>
            <p class="empty" data-testid="no-stock">${F("book.no_stock")}</p>` : D;
		let n = this.mode === "out" ? rn(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return T`<form class="book" @submit=${this.submit}>
      ${t ? T`<h2>
              ${e.name}${e.brand ? T` <span class="detail">${e.brand}</span>` : D}
            </h2>` : T`<h2>${F("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${en(this.md, e, G(this.md?.categories, e.category_id), Z(this.hass)) || F("book.new_product")}
                ${e.id ? D : T`<span class="detail">${F("book.is_new")}</span>`}
              </p>`}
      ${t ? an(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : T`${e.id ? D : $t(this.md, e, (e, t) => this.setProduct(e, t), r)}${Yt(this.f, this.set, r, this.dflt("expiry_type")?.value)}`}
      <label>
        <span class="lbl">${F("book.packages")}</span>
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
        ${W(r.packages, "packages")}
      </label>
      ${t ? D : T`${Xt(this.md, e, this.f, this.set, r, this.dflt("default_location_id"))}${Zt(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${F(`book.submit_${this.mode}`)}
        </button>
        <button
          type="button"
          data-testid="cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
        >
          ${F("common.cancel")}
        </button>
      </div>
    </form>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? Qt(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && ((i || r && !tt(r)) && (t.expires = F("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = F("valid.location")));
		let a = this.mode === "out" ? rn(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = F("valid.packages") : a != null && n > a && (t.packages = F("valid.max_packages", { n: a })), t;
	}
	static {
		this.styles = [
			I,
			on,
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
customElements.define("pantry-booking-form", ln);
//#endregion
//#region src/booking-done.ts
function un(e, t, n) {
	return e ? T`<p class="done" role="status" data-testid=${n ? `${n}-done` : "message"}>
    ${e}
    ${t ? T`<button
            type="button"
            class="undo"
            data-testid=${n ? `${n}-undo` : "undo"}
            @click=${t}
          >
            ${F("stock.undo")}
          </button>` : D}
  </p>` : D;
}
var dn = o`
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
function fn(e, t) {
	return T`
    ${e.length ? D : T`<p class="empty">${F("book.no_hits")}</p>`}
    <ul>
      ${e.map((e) => T`<li>
            <button class="row" data-testid="hit" @click=${() => t.pick(e)}>
              <span>${e.name}</span>
              <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`)}
    </ul>
    ${t.more ? T`<div class="actions after">
            ${t.online ? D : T`<button
                    data-testid="search-online"
                    ?disabled=${t.busy}
                    @click=${t.searchOnline}
                  >
                    ${F("book.search_online")}
                  </button>`}
            <button data-testid="new-product" @click=${t.create}>${F("book.new_product")}</button>
          </div>` : D}
  `;
}
//#endregion
//#region src/booking-view.ts
var pn = /^\d{8,14}$/, mn = /^PTRY:/i, hn = class extends N {
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
		super(), this.seq = 0, this.run = async (e) => {
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
		e.has("mode") && e.get("mode") && (this.reset(), this.message = "", this.undo = void 0), e.has("hass") && this.hass && !this.md && J(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e));
	}
	firstUpdated() {
		this.focusInput();
	}
	focusInput() {
		this.updateComplete.then(() => this.renderRoot.querySelector("#code")?.focus());
	}
	async fail(e) {
		this.error = this.hass ? await q(this.hass, e) : String(e);
	}
	async find(e) {
		e?.preventDefault();
		let t = this.query.trim();
		if (!t || !this.hass) return;
		let n = this.hass, r = ++this.seq;
		if (this.message = "", this.undo = void 0, this.product = this.stock = this.hits = void 0, this.online = !1, mn.test(t)) return this.mode === "out" ? this.scanLabel(t.replace(mn, "")) : void (this.error = F("book.label_out_only"));
		if (pn.test(t)) {
			let e = await this.run(() => ut(n, t));
			return !e || r !== this.seq ? void 0 : e.product ? this.choose(e.product) : this.mode === "out" ? void (this.error = F("book.unknown")) : this.choose(this.blank({ ean: t }));
		}
		let i = await this.run(() => dt(n, t));
		i && r === this.seq && (this.hits = i, this.mode === "out" && i.length === 1 && this.choose(i[0]));
	}
	async scanLabel(e) {
		this.reset();
		let t = this.seq, n = await this.run(() => wt(this.hass, e));
		if (t === this.seq) {
			if (!n) return this.focusInput();
			this.message = F("book.done_label", {
				name: n.name,
				where: n.location
			}), this.undo = n.taken, this.focusInput();
		}
	}
	async searchOnline() {
		let e = this.hass, t = ++this.seq, n = await this.run(() => dt(e, this.query.trim(), !0));
		n && t === this.seq && (this.hits = n, this.online = !0);
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
		let t = ++this.seq, n = await this.run(() => ut(this.hass, e.ean));
		n?.product && t === this.seq && this.choose(n.product);
	}
	async choose(e) {
		let t = ++this.seq;
		if (this.hits = void 0, this.mode === "out" && !e.id) return void (this.error = F("book.unknown"));
		if (this.product = e, this.mode === "out") {
			let n = await this.run(() => Y(this.hass, e.id));
			if (t !== this.seq) return;
			this.stock = n;
		}
		await this.updateComplete;
		let n = this.renderRoot.querySelector("pantry-booking-form");
		await n?.updateComplete, n?.focusFirst();
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
          aria-label=${F("book.input")}
          placeholder=${F("book.input")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button type="button" data-testid="camera" @click=${this.openScanner}>
          ${R(Fe)}<span>${F("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
      ${un(this.message, this.undo && (() => this.putBack()))}
      ${this.error ? T`<p class="error" role="alert" data-testid="error">${this.error}</p>` : D}
      ${this.hits ? fn(this.hits, {
			more: this.mode === "in",
			online: this.online,
			busy: this.busy,
			pick: (e) => this.pick(e),
			searchOnline: () => this.searchOnline(),
			create: () => this.choose(this.blank({ name: this.query.trim() }))
		}) : D}
      ${this.renderForm()}
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
	async putBack() {
		let e = this.undo;
		this.undo = void 0, await this.run(() => mt(this.hass, e)) !== void 0 && (this.message = F("book.undone"), this.focusInput());
	}
	booked(e) {
		let t = this.error;
		this.reset(), this.error = t, this.message = e.detail.message, this.undo = e.detail.taken, this.focusInput();
	}
	static {
		this.styles = [
			I,
			dn,
			o`
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
      .after {
        margin-top: 12px;
      }
    `
		];
	}
};
customElements.define("pantry-booking", hn);
//#endregion
//#region src/stock-data.ts
function gn(e, t, n, r = [], i) {
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
var _n = (e) => Math.round((Date.parse(`${e}T00:00`) - Date.parse(`${et()}T00:00`)) / 864e5);
function vn(e, t, n, r) {
	if (!e.expires_on) return "";
	let i = _n(e.expires_on);
	return i < 0 ? "expired" : i <= (r ?? Number(t?.warn_days ?? K(n, t?.category_id, "warn_days")?.value ?? 0)) ? "soon" : "";
}
//#endregion
//#region src/stock-tree.ts
function yn(e, t, n, r) {
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
async function bn(e, t) {
	e.error = "", e.undo = void 0;
	try {
		e.undo = await t(), e.stock = await Y(e.hass);
	} catch (t) {
		e.error = await q(e.hass, t);
	}
}
var xn = (e, t, n) => bn(e, async () => {
	let { taken: r } = await pt(e.hass, {
		product_id: n.product_id,
		packages: 1,
		batch_id: n.batch_id,
		location_id: n.location_id
	});
	return {
		name: t,
		taken: r
	};
}), Sn = (e) => {
	let t = e.undo;
	if (t) return bn(e, async () => {
		await mt(e.hass, t.taken);
	});
}, Cn = (e, t, n, r) => {
	let i = F("stock.take_one", { name: t });
	return T`<button
    class="icon-btn"
    data-testid=${r}
    aria-label=${i}
    title=${i}
    @click=${() => xn(e, t, n)}
  >
    ${R(Ve)}
  </button>`;
}, wn = (e, t) => un(e.undo ? F("stock.taken_one", { name: e.undo.name }) : "", e.undo && (() => Sn(e)), t), Tn = (e) => T`<div class="filters">
      <input
        class="filter"
        type="search"
        data-testid="stock-filter"
        aria-label=${F("stock.search_hint")}
        placeholder=${F("stock.search")}
        .value=${e.filter}
        @input=${(t) => e.filter = t.target.value}
      />
      <select
        data-testid="stock-location"
        aria-label=${F("stock.location")}
        @change=${(t) => e.location = Number(t.target.value) || null}
      >
        <option value="" ?selected=${e.location == null}>${F("stock.all_locations")}</option>
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
      ${F("stock.with_empty")}
    </label>`, En = o`
  .filters {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`, Dn = [
	"name",
	"brand",
	"ean",
	"category_id",
	"content_amount",
	"content_unit_id",
	"default_location_id",
	"expiry_type",
	"warn_days"
], On = class extends N {
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
		let t = Qt(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = F("valid.ean"));
		let n = e.ean && this.products.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = F("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = F("valid.days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of Dn) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await _t(this.hass, n), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	render() {
		let e = this.edit;
		if (!e) return T`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => K(this.md, e.category_id, t);
		return B({
			title: F("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: T`${$t(this.md, e, (e, t) => this.set(e, t), t)}
        <label>
          <span class="lbl">${F("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${W(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl">${F("settings.category.location")}</span>
          ${rt({
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
          <span class="lbl">${F("settings.category.expiry_type")}</span>
          ${rt({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, F(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl">${F("settings.category.warn_days")}</span>
          ${it({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => Dt(this.hass, e),
				suffix: F("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${W(t.warn_days, "warn-days")}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => Dn.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = I;
	}
};
customElements.define("pantry-product-dialog", On);
//#endregion
//#region src/batch-dialog.ts
var kn = class extends N {
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
		return (e.dateBad || e.expires_on && !tt(e.expires_on)) && (t.expires = F("valid.date")), /^\d+$/.test(e.packages.trim()) || (t.packages = F("valid.packages_zero")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.d;
		if (!Object.keys(this.errors(t)).length) try {
			await ht(this.hass, {
				batch_id: this.row.batch_id,
				location_id: this.row.location_id,
				expires_on: t.expires_on || null,
				packages: Number(t.packages)
			}), this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	render() {
		let e = this.d;
		if (!e) return T`<dialog></dialog>`;
		let t = this.errors(e), n = this.orig;
		return B({
			title: F("stock.edit_batch", {
				name: this.row.name,
				location: this.row.location
			}),
			body: T`<label>
          <span class="lbl">
            ${F("book.expires_on_type", { type: F(`settings.expiry.${this.row.expiry_type}`) })}
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
          ${t.expires ? W(t.expires, "batch-expires") : T`<span class="detail">${F("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${F("book.packages")}</span>
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
          ${t.packages ? W(t.packages, "batch-packages") : T`<span class="detail">${F("stock.zero_hint")}</span>`}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => e.expires_on !== n.expires_on || e.packages !== n.packages,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.d = void 0
		});
	}
	static {
		this.styles = I;
	}
};
customElements.define("pantry-batch-dialog", kn);
//#endregion
//#region src/label-dialog.ts
var An = class extends N {
	static {
		this.properties = {
			hass: { attribute: !1 },
			batch: { state: !0 },
			count: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.invalid = () => !/^\d+$/.test(this.count) || +this.count < 1 || +this.count > 99, this.count = "1", this.error = "";
	}
	async open(e) {
		this.batch = e, this.count = "1", this.error = "", await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	async print(e) {
		if (e.preventDefault(), !this.invalid()) try {
			let e = await Jt(this.hass, this.batch.id, Number(this.count));
			if (e === null) return;
			this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-printed", {
				detail: e,
				bubbles: !0,
				composed: !0
			}));
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	render() {
		let e = this.batch;
		if (!e) return T`<dialog></dialog>`;
		let t = this.invalid();
		return B({
			title: F("label.title", { name: e.name }),
			body: T`<label>
        <span class="lbl">${F("label.count")}</span>
        <input
          data-testid="label-count"
          type="number"
          min="1"
          max="99"
          step="1"
          inputmode="numeric"
          aria-invalid=${t}
          .value=${this.count}
          @input=${(e) => this.count = e.target.value}
        />
        ${t ? W(F("valid.label_count"), "label-count") : T`<span class="detail">${F("label.in_stock", { n: e.packages })}</span>`}
      </label>`,
			error: this.error,
			invalid: t,
			submit: {
				label: F("label.submit"),
				testid: "label-print"
			},
			dirty: () => this.count !== "1",
			onSubmit: (e) => this.print(e),
			onClosed: () => this.batch = void 0
		});
	}
	static {
		this.styles = I;
	}
};
customElements.define("pantry-label-dialog", An);
//#endregion
//#region src/stock-view.ts
var jn = class extends N {
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
		super(), this.products = /* @__PURE__ */ new Map(), this.reload = async () => {
			let [e, t] = await Promise.all([Y(this.hass), gt(this.hass)]);
			this.products = new Map(t.map((e) => [e.id, e])), this.stock = e;
		}, this.saved = async () => {
			this.error = "";
			try {
				await this.reload();
			} catch (e) {
				this.error = await q(this.hass, e);
			}
		}, this.filter = "", this.location = null, this.withEmpty = !1, this.open = /* @__PURE__ */ new Set(), this.error = "", this.message = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.md && this.load(), [
			"filter",
			"location",
			"withEmpty",
			"stock"
		].some((t) => e.has(t)) && (this.message = "");
	}
	async load() {
		try {
			this.md = await J(this.hass), await this.reload(), await this.updateComplete, this.renderRoot.querySelector(".filter")?.focus();
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	tree(e) {
		let t = gn(this.stock ?? [], this.filter, this.location, this.withEmpty ? this.products.values() : [], this.md);
		return yn(this.md?.categories ?? [], t, this.open, e).map((e) => e.kind === "category" ? this.renderCategory(e.id, e.name, e.packages, e.depth, e.open) : this.renderItem(e.item, e.depth, e.open));
	}
	renderCategory(e, t, n, r, i) {
		return T`<li style="padding-left:${r * 24}px">
      ${V(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${F("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return vn(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		return e.expires_on ? Tt(this.hass, e.expires_on) : F("stock.no_date");
	}
	toggle(e) {
		this.open = H(this.open, e);
	}
	render() {
		let e = this.error ? T`<p class="error" role="alert">${this.error}</p>` : D;
		if (!this.stock) return e;
		let t = this.tree(this.filter.trim() !== "");
		return T`
      ${e} ${Tn(this)} ${wn(this, "stock")}
      ${un(this.message, void 0, "label")}
      ${t.length ? T`<ul>
              ${t}
            </ul>` : T`<p class="empty">
              ${F(this.stock.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`}
      <pantry-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @pantry-saved=${this.saved}
      ></pantry-product-dialog>
      <pantry-batch-dialog .hass=${this.hass} @pantry-saved=${this.saved}></pantry-batch-dialog>
      <pantry-label-dialog
        .hass=${this.hass}
        @pantry-printed=${(e) => this.message = e.detail ? F("label.printed", { n: e.detail }) : ""}
      ></pantry-label-dialog>
    `;
	}
	editProduct(e) {
		this.renderRoot.querySelector("pantry-product-dialog").open(this.products.get(e), [...this.products.values()]);
	}
	async deleteProduct(e) {
		this.error = "";
		try {
			if (!await Vt(this.hass, this.md, "product", e)) return;
			this.undo = void 0, await this.reload();
		} catch (e) {
			this.error = await q(this.hass, e);
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
		return T`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${r ? V(n, i) : T`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${r ? n : D}
          @click=${i}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, F("book.count", { n: e.packages })].filter(Boolean).join(" · ")}
            ${r ? T` · <span class=${this.status(r)}>${this.date(r)}</span>` : D}
          </span>
        </button>
        ${U({
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
                    <span class="count">${F("book.count", { n: t.packages })}</span>
                    ${Cn(this, e.name, t, "stock-batch-out")}
                    <button
                      class="icon-btn"
                      data-testid="stock-batch-label"
                      aria-label=${F("label.print_name", { name: e.name })}
                      title=${F("label.print")}
                      @click=${() => this.printBatch(t, e.batches)}
                    >
                      ${R(Ge)}
                    </button>
                    ${U({
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
			I,
			dn,
			En,
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
customElements.define("pantry-stock", jn);
//#endregion
//#region src/expiry-view.ts
var Mn = class extends N {
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
				J(this.hass),
				Y(this.hass),
				gt(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t];
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	errors() {
		let e = this.days.trim();
		return e && !/^\d+$/.test(e) ? F("expiry.days_invalid") : void 0;
	}
	relative(e) {
		return new Intl.RelativeTimeFormat(Z(this.hass), { numeric: "auto" }).format(_n(e), "day");
	}
	render() {
		let e = this.error ? T`<p class="error" role="alert">${this.error}</p>` : D;
		if (!this.stock) return e;
		let t = this.errors(), n = this.days.trim() && !t ? Number(this.days) : void 0, r = this.stock.map((e) => ({
			r: e,
			status: vn(e, this.products.get(e.product_id), this.md, n)
		})).filter((e) => e.status).sort((e, t) => e.r.expires_on.localeCompare(t.r.expires_on));
		return T`
      ${e}
      <div class="field">
        <label class="lbl" for="days">${F("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${F("expiry.days_placeholder")}
            aria-invalid=${!!t}
            .value=${this.days}
            @input=${(e) => this.days = e.target.value}
          />
          ${F("common.days_unit")}
        </span>
        ${W(t, "expiry-days")}
      </div>
      ${wn(this, "expiry")}
      ${r.length ? T`<ul>
              ${r.map(({ r: e, status: t }) => T`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${t}>${Tt(this.hass, e.expires_on)}</span>
                      <span class="detail">${this.relative(e.expires_on)}</span>
                    </span>
                    <span class="what">
                      <span>${e.name}</span>
                      <span class="detail"
                        >${[e.brand, e.location].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${F("book.count", { n: e.packages })}</span>
                    ${Cn(this, e.name, e, "expiry-out")}
                  </li>`)}
            </ul>` : T`<p class="empty">${F("expiry.empty")}</p>`}
    `;
	}
	static {
		this.styles = [
			I,
			dn,
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
customElements.define("pantry-expiry", Mn);
//#endregion
//#region node_modules/lit-html/directive.js
var $ = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Nn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Pn = class {
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
}, { I: Fn } = je, In = (e) => e.strings === void 0, Ln = {}, Rn = (e, t = Ln) => e._$AH = t, zn = Nn(class extends Pn {
	constructor(e) {
		if (super(e), e.type !== $.PROPERTY && e.type !== $.ATTRIBUTE && e.type !== $.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!In(e)) throw Error("`live` bindings can only contain a single expression");
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
		return Rn(e), t;
	}
}), Bn = 8, Vn = class extends N {
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
			[this.md, this.products] = await Promise.all([J(this.hass), gt(this.hass)]);
		} catch (e) {
			this.error = await q(this.hass, e);
		}
		this.active = !0, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	path(e) {
		return G(this.md?.categories, e);
	}
	errors() {
		let e = {}, t = this.choice;
		!this.item && !t && (e.what = F("shopping.add.pick")), t?.kind === "new-product" && Object.assign(e, Qt(t.product)), t?.kind === "new-category" && !t.name.trim() && (e.name = F("valid.required"));
		let n = this.packages;
		return (n == null || !Number.isInteger(n) || n < 1) && (e.packages = F("valid.packages")), e;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let t = this.choice, n = this.packages;
		try {
			this.item ? await bt(this.hass, this.item.id, { packages: n }) : t?.kind === "product" ? await X(this.hass, {
				packages: n,
				product_id: t.id
			}) : t?.kind === "category" ? await X(this.hass, {
				packages: n,
				category_id: t.id
			}) : t?.kind === "new-product" ? await X(this.hass, {
				packages: n,
				product: { ...t.product }
			}) : t?.kind === "new-category" && await X(this.hass, {
				packages: n,
				category: {
					name: t.name.trim(),
					parent_id: t.parent_id
				}
			});
		} catch (e) {
			this.error = await q(this.hass, e);
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
		let t = e.toLocaleLowerCase(), n = (e) => !!e && e.toLocaleLowerCase().includes(t), r = this.products.filter((e) => n(e.name) || n(e.brand)).slice(0, Bn), i = (this.md?.categories ?? []).filter((e) => n(e.name)).slice(0, Bn), a = {
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
      ${i.map((e) => this.hit("shopping-hit", e.name, F("shopping.add.category", { path: this.path(e.id) }), {
			kind: "category",
			id: e.id,
			name: e.name
		}))}
      ${this.hit("shopping-new-product", F("shopping.add.new_product", { name: e }), "", {
			kind: "new-product",
			product: a
		})}
      ${this.hass?.user?.is_admin ? this.hit("shopping-new-category", F("shopping.add.new_category", { name: e }), "", {
			kind: "new-category",
			name: e,
			parent_id: null
		}) : D}
    </ul>`;
	}
	what(e) {
		let t = this.choice;
		if (!t) return T`<label>
          <span class="lbl">${F("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e) => this.query = e.target.value}
          />
          ${this.query.trim() ? W(e.what, "shopping-what") : D}
        </label>
        ${this.hits()}`;
		let n = T`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => this.choice = void 0}
    >
      ${F("shopping.add.change")}
    </button>`;
		return t.kind === "product" || t.kind === "category" ? T`<p data-testid="shopping-choice">
        ${t.kind === "product" ? t.name : F("shopping.add.category", { path: this.path(t.id) })}
        ${n}
      </p>` : t.kind === "new-product" ? T`<p class="detail">${F("shopping.add.creates_product")} ${n}</p>
        ${$t(this.md, t.product, (e, n) => this.choice = {
			...t,
			product: {
				...t.product,
				[e]: n
			}
		}, e)}` : T`<p class="detail">${F("shopping.add.creates_category")} ${n}</p>
      <label>
        <span class="lbl">${F("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!e.name}
          .value=${t.name}
          @input=${(e) => this.choice = {
			...t,
			name: e.target.value
		}}
        />
        ${W(e.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${F("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${t.parent_id}
          .noneLabel=${F("settings.category.no_parent")}
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
		return B({
			title: this.item ? F("common.edit_name", { name: this.item.name }) : F("shopping.add.title"),
			body: T`${this.item ? D : this.what(e)}
        <label>
          <span class="lbl">${F("shopping.add.packages")}</span>
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
            <span class="detail">${F("book.packages")}</span>
          </span>
          ${W(e.packages, "shopping-packages")}
        </label>`,
			error: this.error,
			invalid: Object.keys(e).length > 0,
			dirty: () => !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.active = !1
		});
	}
	static {
		this.styles = I;
	}
};
customElements.define("pantry-shopping-add", Vn);
//#endregion
//#region src/shopping-view.ts
var Hn = class extends N {
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
	async load(e = !1) {
		try {
			[this.items, this.cats] = await Promise.all([vt(this.hass), J(this.hass).then((e) => e.categories)]), e || (this.error = "");
		} catch (e) {
			this.error = await q(this.hass, e);
		}
	}
	async check(e, t) {
		this.error = "";
		try {
			e.manual ? await bt(this.hass, e.id, { done: t }) : await yt(this.hass, e.category_id, t);
		} catch (e) {
			return this.error = await q(this.hass, e), this.load(!0);
		}
		await this.load();
	}
	async removeItem(e) {
		if (await Xe(e.name)) {
			this.error = "";
			try {
				await xt(this.hass, e.id);
			} catch (e) {
				return this.error = await q(this.hass, e), this.load(!0);
			}
			await this.load();
		}
	}
	openAdd(e) {
		this.renderRoot.querySelector("pantry-shopping-add").open(e);
	}
	missing(e) {
		if (e.manual) return [e.product_id ? e.brand : F("shopping.any"), F("book.count", { n: e.packages })].filter(Boolean).join(" · ");
		let t = [];
		return e.amount && t.push(`${Et(this.hass, e.amount.missing)} ${e.amount.unit_symbol}`), e.packages && t.push(F("book.count", { n: e.packages })), F(e.any_of_subtree ? "shopping.missing_more" : "shopping.missing", { what: t.join(F("shopping.and")) });
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
          .checked=${zn(e.done)}
          @change=${(t) => this.check(e, t.target.checked)}
        />
        <span class="what">
          <span class="name">${e.name}</span>
          <span class="detail">${this.missing(e)}</span>
          ${r ? T`<span class="detail">${F("shopping.unknown", { n: r })}</span>` : D}
        </span>
      </label>
      ${e.manual ? U({
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
		let e = this.error ? T`<p class="error" role="alert">${this.error}</p>` : D;
		return !this.items || !this.cats ? e : T`${T`${e}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${F("shopping.add.title")}
        </button>
      </div>
      <pantry-shopping-add
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-add>`}
    ${this.items.length ? T`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>` : T`<p class="empty">${F("shopping.empty")}</p>`}`;
	}
	static {
		this.styles = [I, o`
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
customElements.define("pantry-shopping", Hn);
//#endregion
//#region src/pantry-panel.ts
var Un = [
	"stock",
	"in",
	"out",
	"expiry",
	"shopping",
	"settings"
], Wn = class extends N {
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			route: { attribute: !1 }
		};
	}
	constructor() {
		super(), this.narrow = !1;
	}
	willUpdate(e) {
		e.has("hass") && this.hass && Je(this.hass.language);
	}
	get tab() {
		let e = (this.route?.path ?? "").split("/").filter(Boolean)[0];
		return e === "settings" && !this.hass?.user?.is_admin ? "stock" : Un.includes(e) ? e : "stock";
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
                aria-label=${F("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                ${R(ze)}
              </button>` : D}
        <h1>${F("panel.title")}</h1>
      </header>
      <div role="tablist">
        ${Un.filter((e) => e !== "settings" || this.hass?.user?.is_admin).map((t) => T`<button
              role="tab"
              data-testid=${`tab-${t}`}
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${F(`tab.${t}`)}
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
customElements.define("pantry-panel", Wn);
//#endregion
export { Wn as PantryPanel };
