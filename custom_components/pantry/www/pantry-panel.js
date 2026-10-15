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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
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
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
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
		return this.elementProperties.get(e) ?? se;
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
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var g = globalThis, ce = (e) => e, _ = g.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", C = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, ye = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), E = ye(1), be = ye(2), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), k = y.createTreeWalker(y, 129);
function Se(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var Ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [Se(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, A = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ce(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : N
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function j(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var we = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new M(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, M = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = j(this, e, t), x(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = A.createElement(Se(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new we(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = xe.get(e.strings);
		return t === void 0 && xe.set(e.strings, t = new A(e)), t;
	}
	k(t) {
		S(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, N = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = j(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends N {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, Ee = class extends N {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, De = class extends N {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
}, ke = g.litHtmlPolyfillSupport;
ke?.(A, M), (g.litHtmlVersions ??= []).push("3.3.3");
var Ae = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new M(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, P = globalThis, F = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ae(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return D;
	}
};
F._$litElement$ = !0, F.finalized = !0, P.litElementHydrateSupport?.({ LitElement: F });
var je = P.litElementPolyfillSupport;
je?.({ LitElement: F }), (P.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@mdi/js/mdi.js
var Me = "M4,6H6V18H4V6M7,6H8V18H7V6M9,6H12V18H9V6M13,6H14V18H13V6M16,6H18V18H16V6M19,6H20V18H19V6M2,4V8H0V4A2,2 0 0,1 2,2H6V4H2M22,2A2,2 0 0,1 24,4V8H22V4H18V2H22M2,16V20H6V22H2A2,2 0 0,1 0,20V16H2M22,20V16H24V20A2,2 0 0,1 22,22H18V20H22Z", Ne = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", Pe = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", Fe = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", Ie = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", Le = "M7,10L12,15L17,10H7Z", Re = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7", ze = "M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z", Be = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", Ve = "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z", I = {
	"panel.title": "Vorrat",
	"panel.menu": "Menü",
	"tab.stock": "Bestand",
	"tab.in": "Einbuchen",
	"tab.out": "Auslagern",
	"tab.expiry": "Ablauf",
	"tab.shopping": "Einkauf",
	"tab.settings": "Einstellungen",
	"common.not_ready": "Noch nicht verfügbar.",
	"common.save": "Speichern",
	"common.cancel": "Abbrechen",
	"common.delete": "Löschen",
	"common.confirm_delete": "„{name}“ wirklich löschen?",
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
	"settings.category.min_stock": "Mindestbestand",
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
	"tab.products": "Produkte",
	"products.filter": "Produkte filtern",
	"products.ean": "EAN",
	"book.expires_on_type": "Ablaufdatum ({type})",
	"book.make_default": "Wird Standardlager",
	"products.confirm_delete_stock": "„{name}“ mit {n} Pkg. Bestand und allen Buchungen wirklich löschen?",
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
	"book.choose_category": "Kategorie wählen",
	"stock.search": "Suchen",
	"stock.location": "Lagerort",
	"stock.all_locations": "Alle Lagerorte",
	"stock.empty": "Noch nichts eingelagert.",
	"stock.no_date": "ohne Datum",
	"stock.search_hint": "Suchen (Name, Marke, EAN, Kategorie, Lagerort)",
	"stock.take_one": "1 Pkg. „{name}“ auslagern",
	"stock.taken_one": "1 Pkg. „{name}“ ausgelagert.",
	"stock.undo": "Rückgängig"
}, He = { de: I }, Ue = I;
function We(e) {
	let t = e ?? "";
	Ue = He[t] ?? He[t.split("-")[0]] ?? I;
}
function L(e, t) {
	let n = Ue[e] ?? I[e] ?? e;
	return t ? n.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e) : n;
}
//#endregion
//#region src/ui.ts
var R = (e) => E`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${be`<path d=${e} fill="currentColor"></path>`}
  </svg>`, Ge = (e) => !!e?.() && !confirm(L("common.discard")), z = (e) => (t) => {
	let n = t.target;
	if (n.tagName !== "DIALOG") return;
	let r = n.getBoundingClientRect();
	(t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) && !Ge(e) && n.close();
}, Ke = (e) => (t) => {
	Ge(e) && t.preventDefault();
}, qe = (e) => E`<dialog @close=${e.onClosed} @click=${z(e.dirty)} @cancel=${Ke(e.dirty)}>
    <form @submit=${e.onSubmit}>
      <h2>${e.title}</h2>
      ${e.body} ${e.error ? E`<p class="error" role="alert">${e.error}</p>` : O}
      <div class="actions">
        <button
          type="button"
          @click=${(e) => e.target.closest("dialog").close()}
        >
          ${L("common.cancel")}
        </button>
        <button class="primary" type="submit" data-testid="save" ?disabled=${e.invalid}>
          ${L("common.save")}
        </button>
      </div>
    </form>
  </dialog>`, B = (e, t) => E`<button
    type="button"
    class="chev"
    aria-expanded=${e}
    aria-label=${L(e ? "common.collapse" : "common.expand")}
    @click=${t}
  >
    ${R(e ? Ne : Pe)}
  </button>`;
function V(e, t) {
	let n = new Set(e);
	return n.delete(t) || n.add(t), n;
}
var Je = (e) => E`${e.onAdd ? E`<button
            class="icon-btn"
            data-testid=${`${e.testid}-add`}
            aria-label=${e.addLabel ?? ""}
            @click=${e.onAdd}
          >
            ${R(Be)}
          </button>` : O}<button
      class="icon-btn"
      data-testid=${`${e.testid}-edit`}
      aria-label=${L("common.edit_name", { name: e.name })}
      @click=${e.onEdit}
    >
      ${R(ze)}
    </button>
    ${e.onDelete ? E`<button
            class="icon-btn"
            data-testid=${`${e.testid}-delete`}
            aria-label=${L("common.delete_name", { name: e.name })}
            @click=${e.onDelete}
          >
            ${R(Fe)}
          </button>` : O}`, H = (e, t, n = !1) => e ? E`<span
        class=${n ? "field-hint" : "field-error"}
        data-testid=${`${t}-${n ? "hint" : "error"}`}
        >${e}</span
      >` : O, Ye = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}, Xe = (e) => e >= "2000-01-01" && e <= "2099-12-31", U = o`
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
`, Ze = class extends F {
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
		this.expanded = V(this.expanded, e);
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
		return E`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? this.noneLabel ?? L("book.choose") : this.path(this.value)}
        </span>
        ${R(Le)}
      </button>
      <dialog @click=${z()}>
        <h2>${L("book.choose_category")}</h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${L("book.filter")}
          placeholder=${L("book.filter")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
          @keydown=${this.filterKey}
        />
        <ul>
          ${this.noneLabel && !t ? E`<li>
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
                </li>` : O}
          ${e.map(({ c: e, depth: n, label: r }) => {
			let i = !t && this.kids(e.id).length > 0, a = this.expanded.has(e.id);
			return E`<li style="padding-left: ${n * 20}px">
              ${i ? B(a, () => this.toggle(e.id)) : t ? O : E`<span class="chev"></span>`}
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
        ${e.length ? O : E`<p class="empty">${L("book.no_hits")}</p>`}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
            ${L("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === void 0}
            @click=${this.confirm}
          >
            ${L("book.apply")}
          </button>
        </div>
      </dialog>`;
	}
	static {
		this.styles = [U, o`
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
customElements.define("pantry-category-picker", Ze);
//#endregion
//#region src/api.ts
async function W(e, t) {
	let n = t;
	if (n.translation_key && n.translation_domain && e.loadBackendTranslation) {
		let t = (await e.loadBackendTranslation("exceptions", n.translation_domain))(`component.${n.translation_domain}.exceptions.${n.translation_key}.message`, n.translation_placeholders);
		if (t) return t;
	}
	return n.message ?? String(t);
}
var G = (e) => e.callWS({ type: "pantry/master_data" }), Qe = (e, t, n) => e.callWS({
	type: "pantry/save",
	table: t,
	data: n
}), $e = (e, t, n) => e.callWS({
	type: "pantry/delete",
	table: t,
	row_id: n
}), et = (e, t) => e.callWS({
	type: "pantry/lookup",
	code: t
}), tt = (e, t, n = !1) => e.callWS({
	type: "pantry/search",
	query: t,
	online: n
}), nt = (e, t) => e.callWS({
	type: "pantry/book_in",
	...t
}), rt = (e, t) => e.callWS({
	type: "pantry/book_out",
	...t
}), K = (e, t) => e.callWS({
	type: "pantry/stock",
	product_id: t
}), q = (e) => e.callWS({ type: "pantry/products" }), it = (e, t) => e.callWS({
	type: "pantry/product_save",
	data: t
}), J = (e) => e?.locale?.language ?? e?.language, at = (e, t) => new Intl.DateTimeFormat(J(e), { dateStyle: "medium" }).format(/* @__PURE__ */ new Date(`${t}T00:00`)), ot = (e, t) => new Intl.NumberFormat(J(e)).format(t), st = (e, t) => L(new Intl.PluralRules(J(e)).select(Number(t)) === "one" ? "settings.day" : "settings.days", { n: t });
//#endregion
//#region src/settings-format.ts
function ct(e, t) {
	return e.categories.find((e) => e.id === t)?.name ?? "";
}
function lt(e, t) {
	return t === "default" ? L("settings.inherit_default") : L("settings.inherit_from", { name: ct(e, t) });
}
function ut(e, t, n) {
	let r = e.categories.find((e) => e.id === n);
	return r ? r[t] == null ? r.effective[t] : {
		value: r[t],
		source: r.id
	} : {
		value: e.defaults[t],
		source: "default"
	};
}
function Y(e, t, n, r) {
	if (r == null) return "–";
	let { units: i, locations: a } = e;
	if (n === "unit_id") {
		let e = i.find((e) => e.id === r);
		return e ? e.symbol || e.name : "–";
	}
	return n === "default_location_id" ? a.find((e) => e.id === r)?.name ?? "–" : n === "expiry_type" ? L(`settings.expiry.${r}`) : st(t, r);
}
//#endregion
//#region src/settings-dialog.ts
var X = {
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
		"min_stock"
	]
}, dt = {
	unit: "settings.unit.add",
	location: "settings.location.add",
	category: "settings.category.add"
}, ft = class extends F {
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
		for (let i of X[e]) r[i] = t?.[i] ?? n[i] ?? null;
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
		return r ? a.some((e) => e.id !== t.id && e.name.trim().toLocaleLowerCase() === r.toLocaleLowerCase()) && (n.name = L("valid.duplicate")) : n.name = L("valid.required"), e === "unit" && (String(t.symbol ?? "").trim() || (n.symbol = L("valid.required")), t.base_unit_id != null && !(t.factor > 0) && (n.factor = L("valid.positive"))), e === "category" && (t.warn_days != null && !(Number.isInteger(t.warn_days) && t.warn_days >= 0) && (n.warn_days = L("valid.days")), t.min_stock != null && !(t.min_stock > 0) && (n.min_stock = L("valid.positive"))), n;
	}
	async save(e) {
		if (e.preventDefault(), Object.keys(this.errors()).length) return;
		let { table: t, d: n } = this.edit, r = {};
		for (let e of X[t]) r[e] = n[e];
		n.id && (r.id = n.id);
		try {
			await Qe(this.hass, t, r);
		} catch (e) {
			this.error = await W(this.hass, e);
			return;
		}
		this.renderRoot.querySelector("dialog")?.close(), this.dispatchEvent(new CustomEvent("pantry-saved", {
			bubbles: !0,
			composed: !0
		}));
	}
	field(e, t) {
		return E`<label><span class="lbl">${e}</span>${t}</label>`;
	}
	text(e) {
		return E`<input
        type="text"
        .value=${String(this.edit.d[e] ?? "")}
        ?required=${e === "name"}
        aria-invalid=${!!this.errs[e]}
        @input=${(t) => this.set(e, t.target.value)}
      />${H(this.errs[e], e)}`;
	}
	numInput(e, t = "", n = "") {
		let r = this.edit.d;
		return E`<span class="num"
        ><input
          type="number"
          step=${e === "warn_days" ? "1" : "any"}
          min=${e === "factor" ? "0.000001" : "0"}
          placeholder=${t}
          aria-invalid=${!!this.errs[e]}
          .value=${String(r[e] ?? "")}
          ?disabled=${e === "factor" && (r.base_unit_id == null || this.usedAsBase(r))}
          @input=${(t) => {
			let n = t.target.value, r = n === "" ? null : Number(n);
			e === "min_stock" && !r && (r = null), this.set(e, r);
		}}
        />${n ? E`<span class="detail">${n}</span>` : O}</span
      >${e === "warn_days" ? O : H(this.errs[e], e)}`;
	}
	usedAsBase(e) {
		return !!e.id && this.data.units.some((t) => t.base_unit_id === e.id);
	}
	select(e, t, n, r = !0, i = !1) {
		let a = this.edit.d[e];
		return E`<select
      class=${a == null ? "unset" : ""}
      ?disabled=${i}
      @change=${(t) => {
			let n = t.target.value;
			this.set(e, n === "" ? null : r ? Number(n) : n);
		}}
    >
      <option value="" ?selected=${a == null}>${n}</option>
      ${t.map(([e, t]) => E`<option value=${e} ?selected=${a === e}>${t}</option>`)}
    </select>`;
	}
	reset(e) {
		return this.edit.d[e] == null ? O : E`<button type="button" class="reset" @click=${() => this.set(e, null)}>
          ${R(Ve)}${L("common.reset")}
        </button>`;
	}
	inh(e, t, n, r = !0) {
		let i = this.data, a = ut(i, e, this.edit.d.parent_id), o = Y(i, this.hass, e, a.value), s = lt(i, a.source), c = e === "warn_days" ? this.numInput(e, L("common.default", {
			value: o,
			source: s
		}), L("common.days_unit")) : this.select(e, n, L("common.default", {
			value: o,
			source: s
		}), r);
		return this.field(t, E`<span class="inh">${c}${this.reset(e)}</span
        >${H(this.errs[e], e)}`);
	}
	render() {
		let e = this.edit;
		if (!e || !this.data) return E`<dialog></dialog>`;
		let { table: t, d: n, orig: r } = e;
		this.errs = this.errors();
		let i = this.data, { units: a, locations: o } = i, s;
		if (t === "location") s = this.field(L("common.name"), this.text("name"));
		else if (t === "unit") {
			let e = a.filter((e) => e.base_unit_id == null && e.id !== n.id).map((e) => [e.id, e.name]);
			s = E`${this.field(L("common.name"), this.text("name"))}${this.field(L("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!n.is_count}
            @change=${(e) => this.set("is_count", +!!e.target.checked)}
          />${L("settings.unit.is_count")}</label
        >
        ${this.field(L("settings.unit.base"), this.select("base_unit_id", e, L("common.none"), !0, this.usedAsBase(n)))}
        ${this.field(L("settings.unit.factor"), this.numInput("factor"))}`;
		} else {
			let e = n.unit_id ?? ut(i, "unit_id", n.parent_id).value, t = Y(i, this.hass, "unit_id", e), r = i.categories.find((e) => e.id === n.id)?.off_tags ?? [];
			s = E`${this.field(L("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${L("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${i.categories}
            .value=${n.parent_id ?? null}
            .noneLabel=${L("settings.category.no_parent")}
            .exclude=${n.id}
            @change=${(e) => this.set("parent_id", e.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh("unit_id", L("settings.category.unit"), a.map((e) => [e.id, e.symbol ? `${e.name} (${e.symbol})` : e.name]))}
        ${this.inh("default_location_id", L("settings.category.location"), o.map((e) => [e.id, e.name]))}
        ${this.inh("expiry_type", L("settings.category.expiry_type"), ["best_before", "use_by"].map((e) => [e, L(`settings.expiry.${e}`)]), !1)}
        ${this.inh("warn_days", L("settings.category.warn_days"), [])}
        ${this.field(L("settings.category.min_stock"), this.numInput("min_stock", "", t === "–" ? "" : t))}
        ${r.length ? E`<p class="detail">${L("settings.category.off_tags", { tags: r.join(", ") })}</p>` : O}`;
		}
		let c = () => X[t].some((e) => (n[e] ?? null) !== (r[e] ?? null)), l = t === "category" && !n.id && n.parent_id != null ? ct(i, n.parent_id) : "";
		return qe({
			title: n.id ? L("common.edit_name", { name: r.name }) : l ? L("settings.category.add_sub_to", { name: l }) : L(dt[t]),
			body: s,
			error: this.error,
			invalid: Object.keys(this.errs).length > 0,
			dirty: c,
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [U];
	}
};
customElements.define("pantry-settings-dialog", ft);
//#endregion
//#region src/settings-view.ts
var Z = {
	categories: "category",
	locations: "location",
	units: "unit"
}, pt = class extends F {
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
		return this.section && this.section in Z ? this.section : "categories";
	}
	async load() {
		if (this.hass) try {
			this.data = await G(this.hass), this.pageError = "";
		} catch (e) {
			this.pageError = await W(this.hass, e);
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
		this.expanded = V(this.expanded, e);
	}
	catDetail(e) {
		let t = this.data, n = [
			"unit_id",
			"default_location_id",
			"expiry_type",
			"warn_days"
		].filter((t) => e[t] != null).map((n) => Y(t, this.hass, n, e[n]));
		if (e.min_stock != null) {
			let r = Y(t, this.hass, "unit_id", e.effective.unit_id.value);
			n.push(L("settings.category.min", { value: `${ot(this.hass, e.min_stock)} ${r === "–" ? "" : r}`.trim() }));
		}
		return n.join(" · ");
	}
	render() {
		let e = this.sec, t = Z[e];
		return E`
      <nav aria-label=${L("settings.nav")}>
        ${Object.keys(Z).map((t) => E`<button aria-current=${t === e ? "page" : "false"} @click=${() => this.nav(t)}>
              ${L(`settings.section.${t}`)}
            </button>`)}
      </nav>
      ${this.pageError ? E`<p class="error" role="alert">${this.pageError}</p>` : O}
      ${this.data ? E`<div class="bar">
                <button class="primary" @click=${() => this.open(t)}>${L(dt[t])}</button>
              </div>
              ${e === "categories" ? this.renderCategories() : e === "locations" ? this.renderLocations() : this.renderUnits()}` : O}
      <pantry-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @pantry-saved=${this.load}
      ></pantry-settings-dialog>
    `;
	}
	empty(e) {
		return e.length ? O : E`<p class="empty">${L("common.empty")}</p>`;
	}
	row(e, t, n, r = 0, i = O, a = O) {
		return E`<li style="padding-left:${r * 24}px">
      ${i}
      <button class="row" @click=${n}>
        <span>${e}</span>${t ? E`<span class="detail">${t}</span>` : O}
      </button>
      ${a}
    </li>`;
	}
	actions(e, t) {
		return Je({
			testid: e,
			name: t.name,
			onEdit: () => this.open(e, t),
			onDelete: () => this.delRow(e, t),
			...e === "category" ? {
				onAdd: () => this.open("category", void 0, { parent_id: t.id }),
				addLabel: L("settings.category.add_sub_to", { name: t.name })
			} : {}
		});
	}
	async delRow(e, t) {
		if (confirm(L("common.confirm_delete", { name: t.name }))) {
			try {
				await $e(this.hass, e, t.id), this.pageError = "";
			} catch (e) {
				this.pageError = await W(this.hass, e);
				return;
			}
			await this.load();
		}
	}
	renderLocations() {
		let e = this.data.locations;
		return E`<ul>
        ${e.map((e) => this.row(e.name, "", () => this.open("location", e), 0, O, this.actions("location", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderUnits() {
		let { units: e } = this.data, t = (t) => {
			let n = e.find((e) => e.id === t.base_unit_id);
			return [t.symbol, n ? `= ${ot(this.hass, t.factor)} ${n.symbol}` : t.is_count ? L("settings.unit.count") : ""].filter(Boolean).join(" · ");
		};
		return E`<ul>
        ${e.map((e) => this.row(e.name, t(e), () => this.open("unit", e), 0, O, this.actions("unit", e)))}
      </ul>
      ${this.empty(e)}`;
	}
	renderCategories() {
		return E`<ul>
        ${this.visible().map(({ c: e, depth: t, hasKids: n }) => {
			let r = this.expanded.has(e.id), i = n ? B(r, () => this.toggle(e.id)) : E`<span class="chev"></span>`, a = this.actions("category", e), o = n ? () => this.toggle(e.id) : () => this.open("category", e);
			return this.row(e.name, this.catDetail(e), o, t, i, a);
		})}
      </ul>
      ${this.empty(this.data.categories)}`;
	}
	static {
		this.styles = [U, o`
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
customElements.define("pantry-settings", pt);
//#endregion
//#region src/scanner.ts
var mt = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e"
];
async function ht() {
	let e = window.BarcodeDetector, t = e ? await e.getSupportedFormats() : [];
	if (e && t.includes("ean_13")) return new e({ formats: mt.filter((e) => t.includes(e)) });
	let [{ BarcodeDetector: n, prepareZXingModule: r }, { default: i }] = await Promise.all([import("./ponyfill-B4FQvd9R.js"), import("./zxing_reader-DpUOKxRW.js")]);
	return r({ overrides: { locateFile: (e, t) => e.endsWith(".wasm") ? i : t + e } }), new n({ formats: [...mt] });
}
var gt = class extends F {
	static {
		this.properties = { error: { state: !0 } };
	}
	constructor() {
		super(), this.error = "";
	}
	async open() {
		this.error = "", await this.updateComplete;
		let e = this.renderRoot.querySelector("dialog");
		if (e.showModal(), !navigator.mediaDevices?.getUserMedia) this.error = L("scan.https");
		else try {
			let [t, n] = await Promise.all([ht(), navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })]);
			if (!e.open) return n.getTracks().forEach((e) => e.stop());
			this.stream = n;
			let r = this.renderRoot.querySelector("video");
			r.srcObject = n, await r.play(), this.timer = window.setInterval(async () => {
				let [n] = await t.detect(r).catch(() => []);
				n && e.open && (e.close(), this.dispatchEvent(new CustomEvent("scan", { detail: n.rawValue })));
			}, 250);
		} catch {
			this.error = L("scan.no_camera");
		}
	}
	stop() {
		clearInterval(this.timer), this.stream?.getTracks().forEach((e) => e.stop()), this.stream = void 0;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stop();
	}
	render() {
		return E`<dialog data-testid="scanner" @close=${this.stop} @click=${z()}>
      <h2>${L("scan.title")}</h2>
      ${this.error ? E`<p class="error" role="alert">${this.error}</p>` : E`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog").close()}>
          ${L("common.cancel")}
        </button>
      </div>
    </dialog>`;
	}
	static {
		this.styles = [U, o`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `];
	}
};
customElements.define("pantry-scanner", gt);
//#endregion
//#region src/inherit.ts
function _t(e, t) {
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
		source: L("settings.inherit_default")
	};
	let a = i.source === "own" ? r.name : e.categories.find((e) => e.id === i.source)?.name;
	return {
		value: i.value,
		source: L("settings.inherit_from", { name: a ?? "" })
	};
}
var vt = (e, t) => E`<button type="button" class="reset" data-testid=${`${e}-reset`} @click=${t}>
    ${R(Ve)}${L("common.reset")}
  </button>`;
function yt(e) {
	let t = e.own ?? null;
	return E`<span class="inh">
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
        ${e.dflt ? L("common.default", {
		value: ((t) => e.options.find(([e]) => e === t)?.[1] ?? "")(e.dflt.value),
		source: e.dflt.source
	}) : L(e.optional ? "common.none" : "book.choose")}
      </option>
      ${e.options.map(([e, n]) => E`<option value=${e} ?selected=${t === e}>${n}</option>`)}
    </select>
    ${t == null ? O : vt(e.testid, () => e.onChange(null))}
  </span>`;
}
function bt(e) {
	let t = e.own ?? null;
	return E`<span class="inh">
    <input
      data-testid=${e.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!e.invalid}
      placeholder=${e.dflt ? L("common.default", {
		value: e.format(e.dflt.value),
		source: e.dflt.source
	}) : ""}
      .value=${t == null ? "" : String(t)}
      @input=${(t) => {
		let n = t.target.value;
		e.onChange(n === "" ? null : Number(n));
	}}
    />
    ${e.suffix ? E`<span class="detail">${e.suffix}</span>` : O}
    ${t == null ? O : vt(e.testid, () => e.onChange(null))}
  </span>`;
}
//#endregion
//#region src/product-fields.ts
function xt(e) {
	let t = {};
	return e.name.trim() || (t.name = L("valid.required")), e.category_id ?? (t.category = L("book.category_required")), e.content_amount != null && !(e.content_amount > 0) ? t.content = L("valid.positive") : e.content_amount == null != (e.content_unit_id == null) && (t.content = L("valid.content_pair")), t;
}
function St(e, t, n, r = {}) {
	return E`<label>
      <span class="lbl">${L("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!r.name}
        .value=${t.name}
        @input=${(e) => n("name", e.target.value)}
      />
      ${H(r.name, "name")}
    </label>
    <label>
      <span class="lbl">${L("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${t.brand ?? ""}
        @input=${(e) => n("brand", e.target.value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${L("book.category")}</span>
      <pantry-category-picker
        .categories=${e?.categories ?? []}
        .value=${t.category_id}
        @change=${(e) => n("category_id", e.detail)}
      ></pantry-category-picker>
      ${H(r.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl">${L("book.content")}</span>
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
        <span class="lbl">${L("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!r.content}
          @change=${(e) => n("content_unit_id", Number(e.target.value) || null)}
        >
          <option value="" ?selected=${t.content_unit_id == null}>–</option>
          ${(e?.units ?? []).map((e) => E`<option value=${e.id} ?selected=${e.id === t.content_unit_id}>
                ${e.symbol || e.name}
              </option>`)}
        </select>
      </label>
    </div>
    ${H(r.content, "content")}`;
}
function Ct(e, t, n, r) {
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
var wt = "auto", Tt = (e, t) => e?.find((e) => `${e.batch_id}:${e.location_id}` === t), Et = (e, t) => Tt(e, t)?.packages ?? e?.reduce((e, t) => e + t.packages, 0);
function Dt(e, t, n, r) {
	let i = (e, t) => E`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${e}
        .checked=${n === e}
        @change=${() => r(e)}
      />${t}
    </label>`;
	return E`<fieldset>
    <legend class="lbl">${L("book.which")}</legend>
    ${i(wt, L("book.fefo"))}
    ${t.map((t) => i(`${t.batch_id}:${t.location_id}`, E`<span
          >${t.expires_on ? at(e, t.expires_on) : L("book.no_date")} · ${t.location}
          <span class="detail">${L("book.count", { n: t.packages })}</span></span
        >`))}
  </fieldset>`;
}
var Ot = o`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`, kt = () => ({
	packages: 1,
	expires_on: "",
	location_id: null,
	makeDefault: !0,
	dateBad: !1,
	pick: wt
}), $ = null, At = class extends F {
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
		super(), this.mode = "in", this.busy = !1, this.run = (e) => e().catch(() => void 0), this.f = kt();
	}
	willUpdate(e) {
		e.has("product") && (this.draft = this.product, this.f = kt());
	}
	focusFirst() {
		let e = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
		this.renderRoot.querySelector(e)?.focus();
	}
	dflt(e) {
		let t = this.draft?.[e];
		if (t != null) return {
			value: t,
			source: L("book.from_product")
		};
		let n = Q(this.md, this.draft?.category_id, e);
		if (n) return n;
		if (e === "default_location_id" && $ != null) return {
			value: $,
			source: L("book.last_used")
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
			if (a && this.f.makeDefault && e !== Q(this.md, t.category_id, "default_location_id")?.value && (a.default_location_id = e), !await this.run(() => nt(n, {
				packages: r,
				expires_on: this.f.expires_on || null,
				location_id: e,
				...t.id ? { product_id: t.id } : { product: a }
			}))) return;
			$ = e, i = this.md?.locations.find((t) => t.id === e)?.name ?? "";
		} else {
			let e = Tt(this.stock, this.f.pick);
			if (!await this.run(() => rt(n, {
				product_id: t.id,
				packages: r,
				...e ? {
					batch_id: e.batch_id,
					location_id: e.location_id
				} : {}
			}))) return;
		}
		let a = L(i ? "book.done_in_at" : `book.done_${this.mode}`, {
			n: r,
			name: t.name,
			where: i
		});
		this.dispatchEvent(new CustomEvent("booked", { detail: a }));
	}
	render() {
		let e = this.draft;
		if (!e) return O;
		let t = this.mode === "out";
		if (t && !this.stock?.length) return this.stock ? E`<h2>${e.name}</h2>
            <p class="empty" data-testid="no-stock">${L("book.no_stock")}</p>` : O;
		let n = this.mode === "out" ? Et(this.stock, this.f.pick) : void 0, r = this.errors(e);
		return E`<form class="book" @submit=${this.submit}>
      ${t ? E`<h2>
              ${e.name}${e.brand ? E` <span class="detail">${e.brand}</span>` : O}
            </h2>` : E`<h2>${L("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${Ct(this.md, e, _t(this.md, e.category_id), J(this.hass)) || L("book.new_product")}
                ${e.id ? O : E`<span class="detail">${L("book.is_new")}</span>`}
              </p>`}
      ${t ? Dt(this.hass, this.stock ?? [], this.f.pick, (e) => this.f = {
			...this.f,
			pick: e,
			packages: 1
		}) : E`${e.id ? O : St(this.md, e, (e, t) => this.setProduct(e, t), r)}${this.renderDate(r)}`}
      <label>
        <span class="lbl">${L("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${n ?? O}
          step="1"
          required
          aria-invalid=${!!r.packages}
          .value=${String(this.f.packages)}
          @input=${(e) => this.f = {
			...this.f,
			packages: Number(e.target.value)
		}}
        />
        ${H(r.packages, "packages")}
      </label>
      ${t ? O : this.renderLocation(e, r)}
      <div class="actions">
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(r).length > 0}
        >
          ${L(`book.submit_${this.mode}`)}
        </button>
        <button
          type="button"
          data-testid="cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
        >
          ${L("common.cancel")}
        </button>
      </div>
    </form>`;
	}
	errors(e) {
		let t = this.mode === "in" && !e.id ? xt(e) : {}, { packages: n, expires_on: r, dateBad: i } = this.f;
		this.mode === "in" && ((i || r && !Xe(r)) && (t.expires = L("valid.date")), this.f.location_id == null && !this.dflt("default_location_id") && (t.location = L("valid.location")));
		let a = this.mode === "out" ? Et(this.stock, this.f.pick) : void 0;
		return !Number.isInteger(n) || n < 1 ? t.packages = L("valid.packages") : a != null && n > a && (t.packages = L("valid.max_packages", { n: a })), t;
	}
	renderDate(e) {
		let t = !e.expires && this.f.expires_on && this.f.expires_on < Ye();
		return E`<label>
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
      ${e.expires || t ? E`${H(e.expires, "expires")}${t ? H(L("valid.past"), "expires", !0) : ""}` : E`<span class="detail">${L("book.no_date_hint")}</span>`}
    </label>`;
	}
	dateLabel() {
		let e = this.dflt("expiry_type")?.value;
		return e ? L("book.expires_on_type", { type: L(`settings.expiry.${e}`) }) : L("book.expires_on");
	}
	renderLocation(e, t) {
		return E`<label>
        <span class="lbl">${L("book.location")}</span>
        ${yt({
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
        ${H(t.location, "location")}
      </label>
      ${e.id ? O : E`<label class="check">
              <input
                type="checkbox"
                data-testid="make-default"
                .checked=${this.f.makeDefault}
                @change=${(e) => this.f = {
			...this.f,
			makeDefault: e.target.checked
		}}
              />${L("book.make_default")}
            </label>`}`;
	}
	static {
		this.styles = [
			U,
			Ot,
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
customElements.define("pantry-booking-form", At);
//#endregion
//#region src/booking-view.ts
var jt = /^\d{8,14}$/, Mt = class extends F {
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
		e.has("mode") && e.get("mode") && (this.reset(), this.message = ""), e.has("hass") && this.hass && !this.md && G(this.hass).then((e) => (this.md = e, this.requestUpdate()), (e) => this.fail(e));
	}
	firstUpdated() {
		this.focusInput();
	}
	focusInput() {
		this.updateComplete.then(() => this.renderRoot.querySelector("#code")?.focus());
	}
	async fail(e) {
		this.error = this.hass ? await W(this.hass, e) : String(e);
	}
	async find(e) {
		e?.preventDefault();
		let t = this.query.trim();
		if (!t || !this.hass) return;
		let n = this.hass;
		if (this.message = "", this.product = this.stock = this.hits = void 0, this.online = !1, jt.test(t)) {
			let e = await this.run(() => et(n, t));
			return e ? e.product ? this.choose(e.product) : this.mode === "out" ? void (this.error = L("book.unknown")) : this.choose(this.blank({ ean: t })) : void 0;
		}
		let r = await this.run(() => tt(n, t));
		r && (this.hits = r, this.mode === "out" && r.length === 1 && this.choose(r[0]));
	}
	async searchOnline() {
		let e = this.hass, t = await this.run(() => tt(e, this.query.trim(), !0));
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
		let t = await this.run(() => et(this.hass, e.ean));
		t?.product && this.choose(t.product);
	}
	async choose(e) {
		if (this.hits = void 0, this.mode === "out" && !e.id) return void (this.error = L("book.unknown"));
		this.product = e, this.mode === "out" && (this.stock = await this.run(() => K(this.hass, e.id))), await this.updateComplete;
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
		return E`
      <form class="scan" @submit=${this.find}>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${L("book.input")}
          placeholder=${L("book.input")}
          .value=${this.query}
          @input=${(e) => this.query = e.target.value}
        />
        <button type="button" data-testid="camera" @click=${this.openScanner}>
          ${R(Me)}<span>${L("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
      ${this.message ? E`<p class="done" role="status" data-testid="message">${this.message}</p>` : O}
      ${this.error ? E`<p class="error" role="alert" data-testid="error">${this.error}</p>` : O}
      ${this.hits ? this.renderHits() : O}
      ${this.renderForm()}
    `;
	}
	renderHits() {
		let e = this.hits;
		return E`
      ${e.length ? O : E`<p class="empty">${L("book.no_hits")}</p>`}
      <ul>
        ${e.map((e) => E`<li>
              <button class="row" data-testid="hit" @click=${() => this.pick(e)}>
                <span>${e.name}</span>
                <span class="detail">${[e.brand, e.ean].filter(Boolean).join(" · ")}</span>
              </button>
            </li>`)}
      </ul>
      ${this.mode === "in" ? E`<div class="actions after">
              ${this.online ? O : E`<button
                      data-testid="search-online"
                      ?disabled=${this.busy}
                      @click=${this.searchOnline}
                    >
                      ${L("book.search_online")}
                    </button>`}
              <button
                data-testid="new-product"
                @click=${() => this.choose(this.blank({ name: this.query.trim() }))}
              >
                ${L("book.new_product")}
              </button>
            </div>` : O}
    `;
	}
	renderForm() {
		return this.product ? E`<pantry-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @cancel=${() => (this.reset(), this.focusInput())}
    ></pantry-booking-form>` : O;
	}
	booked(e) {
		this.reset(), this.message = e.detail, this.focusInput();
	}
	static {
		this.styles = [U, o`
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
customElements.define("pantry-booking", Mt);
//#endregion
//#region src/products-view.ts
var Nt = [
	"name",
	"brand",
	"ean",
	"category_id",
	"content_amount",
	"content_unit_id",
	"default_location_id",
	"expiry_type",
	"warn_days"
], Pt = class extends F {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { state: !0 },
			products: { state: !0 },
			filter: { state: !0 },
			edit: { state: !0 },
			error: { state: !0 }
		};
	}
	constructor() {
		super(), this.filter = "", this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.md && this.load();
	}
	async load() {
		try {
			[this.md, this.products] = await Promise.all([G(this.hass), q(this.hass)]);
		} catch (e) {
			this.error = await W(this.hass, e);
		}
	}
	visible() {
		let e = this.filter.trim().toLocaleLowerCase(), t = this.products ?? [];
		return e ? t.filter((t) => [
			t.name,
			t.brand,
			t.ean,
			_t(this.md, t.category_id)
		].join(" ").toLocaleLowerCase().includes(e)) : t;
	}
	async open(e) {
		this.error = "", this.edit = { ...e }, this.orig = { ...e }, await this.updateComplete, this.renderRoot.querySelector("dialog").showModal(), this.renderRoot.querySelector("dialog input")?.focus();
	}
	set(e, t) {
		this.edit = {
			...this.edit,
			[e]: t
		};
	}
	close() {
		this.renderRoot.querySelector("dialog")?.close();
	}
	errors(e) {
		let t = xt(e);
		e.ean && !/^\d{8,14}$/.test(e.ean) && (t.ean = L("valid.ean"));
		let n = e.ean && this.products?.find((t) => t.ean === e.ean && t.id !== e.id);
		return n && (t.ean = L("valid.ean_taken", { name: n.name })), e.warn_days != null && !(Number.isInteger(e.warn_days) && e.warn_days >= 0) && (t.warn_days = L("valid.days")), t;
	}
	async save(e) {
		e.preventDefault();
		let t = this.edit;
		if (Object.keys(this.errors(t)).length) return;
		let n = { id: t.id };
		for (let e of Nt) n[e] = t[e] === "" ? null : t[e] ?? null;
		try {
			await it(this.hass, n), this.close(), this.products = await q(this.hass);
		} catch (e) {
			this.error = await W(this.hass, e);
		}
	}
	async del(e) {
		let t = e.packages ? L("products.confirm_delete_stock", {
			name: e.name,
			n: e.packages
		}) : L("common.confirm_delete", { name: e.name });
		if (confirm(t)) try {
			await this.hass.callWS({
				type: "pantry/delete",
				table: "product",
				row_id: e.id
			}), this.close(), this.products = await q(this.hass);
		} catch (e) {
			this.error = await W(this.hass, e);
		}
	}
	render() {
		let e = this.visible();
		return E`
      <input
        class="filter"
        type="search"
        data-testid="product-filter"
        aria-label=${L("products.filter")}
        placeholder=${L("products.filter")}
        .value=${this.filter}
        @input=${(e) => this.filter = e.target.value}
      />
      ${this.error && !this.edit ? E`<p class="error" role="alert">${this.error}</p>` : O}
      <ul>
        ${e.map((e) => E`<li>
              <button class="row" data-testid="product" @click=${() => this.open(e)}>
                <span>${e.name}</span>
                <span class="detail">
                  ${[
			e.brand,
			_t(this.md, e.category_id),
			L("book.count", { n: e.packages ?? 0 })
		].filter(Boolean).join(" · ")}
                </span>
              </button>
              ${Je({
			testid: "product",
			name: e.name,
			onEdit: () => this.open(e),
			onDelete: this.hass?.user?.is_admin ? () => this.del(e) : void 0
		})}
            </li>`)}
      </ul>
      ${this.products && !e.length ? E`<p class="empty">${L("book.no_hits")}</p>` : O}
      ${this.renderDialog()}
    `;
	}
	renderDialog() {
		let e = this.edit;
		if (!e) return E`<dialog></dialog>`;
		let t = this.errors(e), n = (t) => Q(this.md, e.category_id, t);
		return qe({
			title: L("common.edit_name", { name: this.orig?.name ?? e.name }),
			body: E`${St(this.md, e, (e, t) => this.set(e, t), t)}
        <label>
          <span class="lbl">${L("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!t.ean}
            .value=${e.ean ?? ""}
            @input=${(e) => this.set("ean", e.target.value.trim() || null)}
          />
          ${H(t.ean, "ean")}
        </label>
        <label>
          <span class="lbl">${L("settings.category.location")}</span>
          ${yt({
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
          <span class="lbl">${L("settings.category.expiry_type")}</span>
          ${yt({
				testid: "expiry-type",
				own: e.expiry_type,
				dflt: n("expiry_type"),
				options: ["best_before", "use_by"].map((e) => [e, L(`settings.expiry.${e}`)]),
				numeric: !1,
				onChange: (e) => this.set("expiry_type", e)
			})}
        </label>
        <label>
          <span class="lbl">${L("settings.category.warn_days")}</span>
          ${bt({
				testid: "warn-days",
				own: e.warn_days,
				dflt: n("warn_days"),
				format: (e) => st(this.hass, e),
				suffix: L("common.days_unit"),
				invalid: !!t.warn_days,
				onChange: (e) => this.set("warn_days", e)
			})}
          ${H(t.warn_days, "warn-days")}
        </label>`,
			error: this.error,
			invalid: Object.keys(t).length > 0,
			dirty: () => Nt.some((t) => (e[t] ?? null) !== (this.orig?.[t] ?? null)),
			onSubmit: (e) => this.save(e),
			onClosed: () => this.edit = void 0
		});
	}
	static {
		this.styles = [U, o`
      .filter {
        margin-bottom: 8px;
      }
    `];
	}
};
customElements.define("pantry-products", Pt);
//#endregion
//#region src/stock-data.ts
function Ft(e, t, n) {
	let r = t.trim().toLocaleLowerCase(), i = /* @__PURE__ */ new Map();
	for (let t of e) {
		if (n != null && t.location_id !== n) continue;
		let e = [
			t.name,
			t.brand,
			t.ean,
			t.location,
			...t.category_path
		].join(" ");
		if (r && !e.toLocaleLowerCase().includes(r)) continue;
		let a = i.get(t.product_id);
		a || (a = {
			id: t.product_id,
			category_id: t.category_id,
			name: t.name,
			brand: t.brand,
			packages: 0,
			batches: []
		}, i.set(t.product_id, a)), a.packages += t.packages, a.batches.push(t);
	}
	let a = /* @__PURE__ */ new Map();
	for (let e of i.values()) a.set(e.category_id, [...a.get(e.category_id) ?? [], e]);
	return a;
}
function It(e, t, n) {
	if (!e.expires_on) return "";
	let r = Ye();
	if (e.expires_on < r) return "expired";
	let i = Number(t?.warn_days ?? Q(n, t?.category_id, "warn_days")?.value ?? 0), a = /* @__PURE__ */ new Date(`${r}T00:00`);
	return a.setDate(a.getDate() + i), /* @__PURE__ */ new Date(`${e.expires_on}T00:00`) <= a ? "soon" : "";
}
//#endregion
//#region src/stock-view.ts
var Lt = class extends F {
	static {
		this.properties = {
			hass: { attribute: !1 },
			md: { state: !0 },
			stock: { state: !0 },
			filter: { state: !0 },
			location: { state: !0 },
			open: { state: !0 },
			error: { state: !0 },
			undo: { state: !0 }
		};
	}
	constructor() {
		super(), this.products = /* @__PURE__ */ new Map(), this.filter = "", this.location = null, this.open = /* @__PURE__ */ new Set(), this.error = "";
	}
	willUpdate(e) {
		e.has("hass") && this.hass && !this.md && this.load();
	}
	async load() {
		try {
			let [e, t, n] = await Promise.all([
				G(this.hass),
				K(this.hass),
				q(this.hass)
			]);
			this.products = new Map(n.map((e) => [e.id, e])), [this.md, this.stock] = [e, t], await this.updateComplete, this.renderRoot.querySelector(".filter")?.focus();
		} catch (e) {
			this.error = await W(this.hass, e);
		}
	}
	tree(e) {
		let t = this.md?.categories ?? [], n = Ft(this.stock ?? [], this.filter, this.location), r = /* @__PURE__ */ new Map(), i = (e) => {
			let a = (n.get(e) ?? []).reduce((e, t) => e + t.packages, 0) + t.filter((t) => t.parent_id === e).reduce((e, t) => e + i(t.id), 0);
			return r.set(e, a), a;
		}, a = [], o = (s, c) => {
			for (let l of t.filter((e) => e.parent_id === s)) {
				if (!(r.get(l.id) ?? i(l.id))) continue;
				let t = e || this.open.has(`c${l.id}`);
				if (a.push(this.renderCategory(l.id, l.name, r.get(l.id), c, t)), t) {
					o(l.id, c + 1);
					for (let t of n.get(l.id) ?? []) a.push(this.renderItem(t, c + 1, e || this.open.has(`p${t.id}`)));
				}
			}
		};
		return o(null, 0), a;
	}
	renderCategory(e, t, n, r, i) {
		return E`<li style="padding-left:${r * 24}px">
      ${B(i, () => this.toggle(`c${e}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${i}
        @click=${() => this.toggle(`c${e}`)}
      >
        <span>${t}</span>
        <span class="detail">${L("book.count", { n })}</span>
      </button>
    </li>`;
	}
	status(e) {
		return It(e, this.products.get(e.product_id), this.md);
	}
	date(e) {
		return e.expires_on ? at(this.hass, e.expires_on) : L("stock.no_date");
	}
	toggle(e) {
		this.open = V(this.open, e);
	}
	render() {
		if (this.error) return E`<p class="error" role="alert">${this.error}</p>`;
		if (!this.stock) return O;
		let e = this.tree(this.filter.trim() !== "");
		return E`
      <div class="filters">
        <input
          class="filter"
          type="search"
          data-testid="stock-filter"
          aria-label=${L("stock.search_hint")}
          placeholder=${L("stock.search")}
          .value=${this.filter}
          @input=${(e) => this.filter = e.target.value}
        />
        <select
          data-testid="stock-location"
          aria-label=${L("stock.location")}
          @change=${(e) => this.location = Number(e.target.value) || null}
        >
          <option value="" ?selected=${this.location == null}>${L("stock.all_locations")}</option>
          ${(this.md?.locations ?? []).map((e) => E`<option value=${e.id} ?selected=${e.id === this.location}>${e.name}</option>`)}
        </select>
      </div>
      <p class="done" role="status" data-testid="stock-done">
        ${this.undo ? E`${L("stock.taken_one", { name: this.undo.name })}
                <button class="undo" data-testid="stock-undo" @click=${this.undoTake}>
                  ${L("stock.undo")}
                </button>` : O}
      </p>
      ${this.stock.length ? e.length ? E`<ul>
                ${e}
              </ul>` : E`<p class="empty">${L("book.no_hits")}</p>` : E`<p class="empty">${L("stock.empty")}</p>`}
    `;
	}
	renderItem(e, t, n) {
		let r = e.batches[0];
		return E`<li class="item" style="padding-left:${t * 24}px">
      <div class="head">
        ${B(n, () => this.toggle(`p${e.id}`))}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${n}
          @click=${() => this.toggle(`p${e.id}`)}
        >
          <span>${e.name}</span>
          <span class="detail">
            ${[e.brand, L("book.count", { n: e.packages })].filter(Boolean).join(" · ")} ·
            <span class=${this.status(r)}>${this.date(r)}</span>
          </span>
        </button>
      </div>
      ${n ? E`<ul class="batches">
              ${e.batches.map((t) => E`<li data-testid="stock-batch">
                    <span class=${this.status(t)}>${this.date(t)}</span>
                    <span class="detail">${t.location}</span>
                    <span class="count">${L("book.count", { n: t.packages })}</span>
                    ${this.outButton(e.name, () => this.takeOut(e.name, t))}
                  </li>`)}
            </ul>` : O}
    </li>`;
	}
	outButton(e, t) {
		let n = L("stock.take_one", { name: e });
		return E`<button
      class="icon-btn"
      data-testid="stock-batch-out"
      aria-label=${n}
      title=${n}
      @click=${t}
    >
      ${R(Re)}
    </button>`;
	}
	async takeOut(e, t) {
		await this.change(() => rt(this.hass, {
			product_id: t.product_id,
			packages: 1,
			batch_id: t.batch_id,
			location_id: t.location_id
		}), {
			name: e,
			row: t
		});
	}
	async undoTake() {
		let { row: e } = this.undo;
		await this.change(() => nt(this.hass, {
			product_id: e.product_id,
			packages: 1,
			expires_on: e.expires_on,
			expiry_type: e.expiry_type,
			location_id: e.location_id
		}));
	}
	async change(e, t) {
		try {
			await e(), this.undo = t, this.stock = await K(this.hass);
		} catch (e) {
			this.undo = void 0, this.error = await W(this.hass, e);
		}
	}
	static {
		this.styles = [U, o`
      .filters {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 8px;
        margin-bottom: 8px;
      }
      li.item {
        flex-direction: column;
        align-items: stretch;
      }
      .head {
        display: flex;
        align-items: center;
      }
      .undo {
        padding: 4px 8px;
        color: var(--primary-color);
      }
      .head .row {
        padding-left: 0;
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
    `];
	}
};
customElements.define("pantry-stock", Lt);
//#endregion
//#region src/pantry-panel.ts
var Rt = [
	"stock",
	"in",
	"out",
	"products",
	"expiry",
	"shopping",
	"settings"
], zt = class extends F {
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
		e.has("hass") && this.hass && We(this.hass.language);
	}
	get tab() {
		let e = (this.route?.path ?? "").split("/").filter(Boolean)[0];
		return e === "settings" && !this.hass?.user?.is_admin ? "stock" : Rt.includes(e) ? e : "stock";
	}
	get sub() {
		return (this.route?.path ?? "").split("/").filter(Boolean)[1];
	}
	select(e) {
		history.pushState(null, "", `${this.route?.prefix ?? ""}/${e}`), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.tab;
		return E`
      <header>
        ${this.narrow ? E`<button
                class="menu"
                aria-label=${L("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}))}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  ${be`<path d=${Ie} fill="currentColor"></path>`}
                </svg>
              </button>` : O}
        <h1>${L("panel.title")}</h1>
      </header>
      <div role="tablist">
        ${Rt.filter((e) => e !== "settings" || this.hass?.user?.is_admin).map((t) => E`<button
              role="tab"
              aria-selected=${t === e}
              @click=${() => this.select(t)}
            >
              ${L(`tab.${t}`)}
            </button>`)}
      </div>
      <main role="tabpanel" @pantry-navigate=${(e) => this.select(e.detail)}>
        ${e === "settings" ? E`<pantry-settings .hass=${this.hass} .section=${this.sub}></pantry-settings>` : e === "products" ? E`<pantry-products .hass=${this.hass}></pantry-products>` : e === "in" || e === "out" ? E`<pantry-booking .hass=${this.hass} .mode=${e}></pantry-booking>` : e === "stock" ? E`<pantry-stock .hass=${this.hass}></pantry-stock>` : E`<p>${L("common.not_ready")}</p>`}
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
customElements.define("pantry-panel", zt);
//#endregion
export { zt as PantryPanel };
