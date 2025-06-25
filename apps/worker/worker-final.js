// Cloudflare Worker - Full TypeScript Version
let app;

(() => {
() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // src/index.ts
  var exports_src = {};
  __export(exports_src, {
    default: () => src_default
  });

  // ../../node_modules/hono/dist/compose.js
  var compose = (middleware, onError, onNotFound) => {
    return (context, next) => {
      let index = -1;
      return dispatch(0);
      async function dispatch(i) {
        if (i <= index) {
          throw new Error("next() called multiple times");
        }
        index = i;
        let res;
        let isError = false;
        let handler;
        if (middleware[i]) {
          handler = middleware[i][0][0];
          context.req.routeIndex = i;
        } else {
          handler = i === middleware.length && next || undefined;
        }
        if (handler) {
          try {
            res = await handler(context, () => dispatch(i + 1));
          } catch (err) {
            if (err instanceof Error && onError) {
              context.error = err;
              res = await onError(err, context);
              isError = true;
            } else {
              throw err;
            }
          }
        } else {
          if (context.finalized === false && onNotFound) {
            res = await onNotFound(context);
          }
        }
        if (res && (context.finalized === false || isError)) {
          context.res = res;
        }
        return context;
      }
    };
  };

  // ../../node_modules/hono/dist/request/constants.js
  var GET_MATCH_RESULT = Symbol();

  // ../../node_modules/hono/dist/utils/body.js
  var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
    const { all = false, dot = false } = options;
    const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
    const contentType = headers.get("Content-Type");
    if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
      return parseFormData(request, { all, dot });
    }
    return {};
  };
  async function parseFormData(request, options) {
    const formData = await request.formData();
    if (formData) {
      return convertFormDataToBodyData(formData, options);
    }
    return {};
  }
  function convertFormDataToBodyData(formData, options) {
    const form = /* @__PURE__ */ Object.create(null);
    formData.forEach((value, key) => {
      const shouldParseAllValues = options.all || key.endsWith("[]");
      if (!shouldParseAllValues) {
        form[key] = value;
      } else {
        handleParsingAllValues(form, key, value);
      }
    });
    if (options.dot) {
      Object.entries(form).forEach(([key, value]) => {
        const shouldParseDotValues = key.includes(".");
        if (shouldParseDotValues) {
          handleParsingNestedValues(form, key, value);
          delete form[key];
        }
      });
    }
    return form;
  }
  var handleParsingAllValues = (form, key, value) => {
    if (form[key] !== undefined) {
      if (Array.isArray(form[key])) {
        form[key].push(value);
      } else {
        form[key] = [form[key], value];
      }
    } else {
      if (!key.endsWith("[]")) {
        form[key] = value;
      } else {
        form[key] = [value];
      }
    }
  };
  var handleParsingNestedValues = (form, key, value) => {
    let nestedForm = form;
    const keys = key.split(".");
    keys.forEach((key2, index) => {
      if (index === keys.length - 1) {
        nestedForm[key2] = value;
      } else {
        if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
          nestedForm[key2] = /* @__PURE__ */ Object.create(null);
        }
        nestedForm = nestedForm[key2];
      }
    });
  };

  // ../../node_modules/hono/dist/utils/url.js
  var splitPath = (path) => {
    const paths = path.split("/");
    if (paths[0] === "") {
      paths.shift();
    }
    return paths;
  };
  var splitRoutingPath = (routePath) => {
    const { groups, path } = extractGroupsFromPath(routePath);
    const paths = splitPath(path);
    return replaceGroupMarks(paths, groups);
  };
  var extractGroupsFromPath = (path) => {
    const groups = [];
    path = path.replace(/\{[^}]+\}/g, (match, index) => {
      const mark = `@${index}`;
      groups.push([mark, match]);
      return mark;
    });
    return { groups, path };
  };
  var replaceGroupMarks = (paths, groups) => {
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = paths.length - 1;j >= 0; j--) {
        if (paths[j].includes(mark)) {
          paths[j] = paths[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    return paths;
  };
  var patternCache = {};
  var getPattern = (label, next) => {
    if (label === "*") {
      return "*";
    }
    const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    if (match) {
      const cacheKey = `${label}#${next}`;
      if (!patternCache[cacheKey]) {
        if (match[2]) {
          patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
        } else {
          patternCache[cacheKey] = [label, match[1], true];
        }
      }
      return patternCache[cacheKey];
    }
    return null;
  };
  var tryDecode = (str, decoder) => {
    try {
      return decoder(str);
    } catch {
      return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
        try {
          return decoder(match);
        } catch {
          return match;
        }
      });
    }
  };
  var tryDecodeURI = (str) => tryDecode(str, decodeURI);
  var getPath = (request) => {
    const url = request.url;
    const start = url.indexOf("/", url.charCodeAt(9) === 58 ? 13 : 8);
    let i = start;
    for (;i < url.length; i++) {
      const charCode = url.charCodeAt(i);
      if (charCode === 37) {
        const queryIndex = url.indexOf("?", i);
        const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
        return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
      } else if (charCode === 63) {
        break;
      }
    }
    return url.slice(start, i);
  };
  var getPathNoStrict = (request) => {
    const result = getPath(request);
    return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
  };
  var mergePath = (base, sub, ...rest) => {
    if (rest.length) {
      sub = mergePath(sub, ...rest);
    }
    return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
  };
  var checkOptionalParameter = (path) => {
    if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
      return null;
    }
    const segments = path.split("/");
    const results = [];
    let basePath = "";
    segments.forEach((segment) => {
      if (segment !== "" && !/\:/.test(segment)) {
        basePath += "/" + segment;
      } else if (/\:/.test(segment)) {
        if (/\?/.test(segment)) {
          if (results.length === 0 && basePath === "") {
            results.push("/");
          } else {
            results.push(basePath);
          }
          const optionalSegment = segment.replace("?", "");
          basePath += "/" + optionalSegment;
          results.push(basePath);
        } else {
          basePath += "/" + segment;
        }
      }
    });
    return results.filter((v, i, a) => a.indexOf(v) === i);
  };
  var _decodeURI = (value) => {
    if (!/[%+]/.test(value)) {
      return value;
    }
    if (value.indexOf("+") !== -1) {
      value = value.replace(/\+/g, " ");
    }
    return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
  };
  var _getQueryParam = (url, key, multiple) => {
    let encoded;
    if (!multiple && key && !/[%+]/.test(key)) {
      let keyIndex2 = url.indexOf(`?${key}`, 8);
      if (keyIndex2 === -1) {
        keyIndex2 = url.indexOf(`&${key}`, 8);
      }
      while (keyIndex2 !== -1) {
        const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
        if (trailingKeyCode === 61) {
          const valueIndex = keyIndex2 + key.length + 2;
          const endIndex = url.indexOf("&", valueIndex);
          return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
        } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
          return "";
        }
        keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
      }
      encoded = /[%+]/.test(url);
      if (!encoded) {
        return;
      }
    }
    const results = {};
    encoded ??= /[%+]/.test(url);
    let keyIndex = url.indexOf("?", 8);
    while (keyIndex !== -1) {
      const nextKeyIndex = url.indexOf("&", keyIndex + 1);
      let valueIndex = url.indexOf("=", keyIndex);
      if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
        valueIndex = -1;
      }
      let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
      if (encoded) {
        name = _decodeURI(name);
      }
      keyIndex = nextKeyIndex;
      if (name === "") {
        continue;
      }
      let value;
      if (valueIndex === -1) {
        value = "";
      } else {
        value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
        if (encoded) {
          value = _decodeURI(value);
        }
      }
      if (multiple) {
        if (!(results[name] && Array.isArray(results[name]))) {
          results[name] = [];
        }
        results[name].push(value);
      } else {
        results[name] ??= value;
      }
    }
    return key ? results[key] : results;
  };
  var getQueryParam = _getQueryParam;
  var getQueryParams = (url, key) => {
    return _getQueryParam(url, key, true);
  };
  var decodeURIComponent_ = decodeURIComponent;

  // ../../node_modules/hono/dist/request.js
  var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
  var HonoRequest = class {
    raw;
    #validatedData;
    #matchResult;
    routeIndex = 0;
    path;
    bodyCache = {};
    constructor(request, path = "/", matchResult = [[]]) {
      this.raw = request;
      this.path = path;
      this.#matchResult = matchResult;
      this.#validatedData = {};
    }
    param(key) {
      return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
    }
    #getDecodedParam(key) {
      const paramKey = this.#matchResult[0][this.routeIndex][1][key];
      const param = this.#getParamValue(paramKey);
      return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : undefined;
    }
    #getAllDecodedParams() {
      const decoded = {};
      const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
      for (const key of keys) {
        const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
        if (value && typeof value === "string") {
          decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
        }
      }
      return decoded;
    }
    #getParamValue(paramKey) {
      return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
    }
    query(key) {
      return getQueryParam(this.url, key);
    }
    queries(key) {
      return getQueryParams(this.url, key);
    }
    header(name) {
      if (name) {
        return this.raw.headers.get(name) ?? undefined;
      }
      const headerData = {};
      this.raw.headers.forEach((value, key) => {
        headerData[key] = value;
      });
      return headerData;
    }
    async parseBody(options) {
      return this.bodyCache.parsedBody ??= await parseBody(this, options);
    }
    #cachedBody = (key) => {
      const { bodyCache, raw } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      const anyCachedKey = Object.keys(bodyCache)[0];
      if (anyCachedKey) {
        return bodyCache[anyCachedKey].then((body) => {
          if (anyCachedKey === "json") {
            body = JSON.stringify(body);
          }
          return new Response(body)[key]();
        });
      }
      return bodyCache[key] = raw[key]();
    };
    json() {
      return this.#cachedBody("json");
    }
    text() {
      return this.#cachedBody("text");
    }
    arrayBuffer() {
      return this.#cachedBody("arrayBuffer");
    }
    blob() {
      return this.#cachedBody("blob");
    }
    formData() {
      return this.#cachedBody("formData");
    }
    addValidatedData(target, data) {
      this.#validatedData[target] = data;
    }
    valid(target) {
      return this.#validatedData[target];
    }
    get url() {
      return this.raw.url;
    }
    get method() {
      return this.raw.method;
    }
    get [GET_MATCH_RESULT]() {
      return this.#matchResult;
    }
    get matchedRoutes() {
      return this.#matchResult[0].map(([[, route]]) => route);
    }
    get routePath() {
      return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
    }
  };

  // ../../node_modules/hono/dist/utils/html.js
  var HtmlEscapedCallbackPhase = {
    Stringify: 1,
    BeforeStream: 2,
    Stream: 3
  };
  var raw = (value, callbacks) => {
    const escapedString = new String(value);
    escapedString.isEscaped = true;
    escapedString.callbacks = callbacks;
    return escapedString;
  };
  var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
    if (typeof str === "object" && !(str instanceof String)) {
      if (!(str instanceof Promise)) {
        str = str.toString();
      }
      if (str instanceof Promise) {
        str = await str;
      }
    }
    const callbacks = str.callbacks;
    if (!callbacks?.length) {
      return Promise.resolve(str);
    }
    if (buffer) {
      buffer[0] += str;
    } else {
      buffer = [str];
    }
    const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
    if (preserveCallbacks) {
      return raw(await resStr, callbacks);
    } else {
      return resStr;
    }
  };

  // ../../node_modules/hono/dist/context.js
  var TEXT_PLAIN = "text/plain; charset=UTF-8";
  var setDefaultContentType = (contentType, headers) => {
    return {
      "Content-Type": contentType,
      ...headers
    };
  };
  var Context = class {
    #rawRequest;
    #req;
    env = {};
    #var;
    finalized = false;
    error;
    #status;
    #executionCtx;
    #res;
    #layout;
    #renderer;
    #notFoundHandler;
    #preparedHeaders;
    #matchResult;
    #path;
    constructor(req, options) {
      this.#rawRequest = req;
      if (options) {
        this.#executionCtx = options.executionCtx;
        this.env = options.env;
        this.#notFoundHandler = options.notFoundHandler;
        this.#path = options.path;
        this.#matchResult = options.matchResult;
      }
    }
    get req() {
      this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
      return this.#req;
    }
    get event() {
      if (this.#executionCtx && "respondWith" in this.#executionCtx) {
        return this.#executionCtx;
      } else {
        throw Error("This context has no FetchEvent");
      }
    }
    get executionCtx() {
      if (this.#executionCtx) {
        return this.#executionCtx;
      } else {
        throw Error("This context has no ExecutionContext");
      }
    }
    get res() {
      return this.#res ||= new Response(null, {
        headers: this.#preparedHeaders ??= new Headers
      });
    }
    set res(_res) {
      if (this.#res && _res) {
        _res = new Response(_res.body, _res);
        for (const [k, v] of this.#res.headers.entries()) {
          if (k === "content-type") {
            continue;
          }
          if (k === "set-cookie") {
            const cookies = this.#res.headers.getSetCookie();
            _res.headers.delete("set-cookie");
            for (const cookie of cookies) {
              _res.headers.append("set-cookie", cookie);
            }
          } else {
            _res.headers.set(k, v);
          }
        }
      }
      this.#res = _res;
      this.finalized = true;
    }
    render = (...args) => {
      this.#renderer ??= (content) => this.html(content);
      return this.#renderer(...args);
    };
    setLayout = (layout) => this.#layout = layout;
    getLayout = () => this.#layout;
    setRenderer = (renderer) => {
      this.#renderer = renderer;
    };
    header = (name, value, options) => {
      if (this.finalized) {
        this.#res = new Response(this.#res.body, this.#res);
      }
      const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers;
      if (value === undefined) {
        headers.delete(name);
      } else if (options?.append) {
        headers.append(name, value);
      } else {
        headers.set(name, value);
      }
    };
    status = (status) => {
      this.#status = status;
    };
    set = (key, value) => {
      this.#var ??= /* @__PURE__ */ new Map;
      this.#var.set(key, value);
    };
    get = (key) => {
      return this.#var ? this.#var.get(key) : undefined;
    };
    get var() {
      if (!this.#var) {
        return {};
      }
      return Object.fromEntries(this.#var);
    }
    #newResponse(data, arg, headers) {
      const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers;
      if (typeof arg === "object" && "headers" in arg) {
        const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
        for (const [key, value] of argHeaders) {
          if (key.toLowerCase() === "set-cookie") {
            responseHeaders.append(key, value);
          } else {
            responseHeaders.set(key, value);
          }
        }
      }
      if (headers) {
        for (const [k, v] of Object.entries(headers)) {
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
      const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
      return new Response(data, { status, headers: responseHeaders });
    }
    newResponse = (...args) => this.#newResponse(...args);
    body = (data, arg, headers) => this.#newResponse(data, arg, headers);
    text = (text, arg, headers) => {
      return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
    };
    json = (object, arg, headers) => {
      return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
    };
    html = (html, arg, headers) => {
      const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
      return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
    };
    redirect = (location, status) => {
      this.header("Location", String(location));
      return this.newResponse(null, status ?? 302);
    };
    notFound = () => {
      this.#notFoundHandler ??= () => new Response;
      return this.#notFoundHandler(this);
    };
  };

  // ../../node_modules/hono/dist/router.js
  var METHOD_NAME_ALL = "ALL";
  var METHOD_NAME_ALL_LOWERCASE = "all";
  var METHODS = ["get", "post", "put", "delete", "options", "patch"];
  var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
  var UnsupportedPathError = class extends Error {
  };

  // ../../node_modules/hono/dist/utils/constants.js
  var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

  // ../../node_modules/hono/dist/hono-base.js
  var notFoundHandler = (c) => {
    return c.text("404 Not Found", 404);
  };
  var errorHandler = (err, c) => {
    if ("getResponse" in err) {
      const res = err.getResponse();
      return c.newResponse(res.body, res);
    }
    console.error(err);
    return c.text("Internal Server Error", 500);
  };
  var Hono = class {
    get;
    post;
    put;
    delete;
    options;
    patch;
    all;
    on;
    use;
    router;
    getPath;
    _basePath = "/";
    #path = "/";
    routes = [];
    constructor(options = {}) {
      const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
      allMethods.forEach((method) => {
        this[method] = (args1, ...args) => {
          if (typeof args1 === "string") {
            this.#path = args1;
          } else {
            this.#addRoute(method, this.#path, args1);
          }
          args.forEach((handler) => {
            this.#addRoute(method, this.#path, handler);
          });
          return this;
        };
      });
      this.on = (method, path, ...handlers) => {
        for (const p of [path].flat()) {
          this.#path = p;
          for (const m of [method].flat()) {
            handlers.map((handler) => {
              this.#addRoute(m.toUpperCase(), this.#path, handler);
            });
          }
        }
        return this;
      };
      this.use = (arg1, ...handlers) => {
        if (typeof arg1 === "string") {
          this.#path = arg1;
        } else {
          this.#path = "*";
          handlers.unshift(arg1);
        }
        handlers.forEach((handler) => {
          this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
        });
        return this;
      };
      const { strict, ...optionsWithoutStrict } = options;
      Object.assign(this, optionsWithoutStrict);
      this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
    }
    #clone() {
      const clone = new Hono({
        router: this.router,
        getPath: this.getPath
      });
      clone.errorHandler = this.errorHandler;
      clone.#notFoundHandler = this.#notFoundHandler;
      clone.routes = this.routes;
      return clone;
    }
    #notFoundHandler = notFoundHandler;
    errorHandler = errorHandler;
    route(path, app) {
      const subApp = this.basePath(path);
      app.routes.map((r) => {
        let handler;
        if (app.errorHandler === errorHandler) {
          handler = r.handler;
        } else {
          handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
          handler[COMPOSED_HANDLER] = r.handler;
        }
        subApp.#addRoute(r.method, r.path, handler);
      });
      return this;
    }
    basePath(path) {
      const subApp = this.#clone();
      subApp._basePath = mergePath(this._basePath, path);
      return subApp;
    }
    onError = (handler) => {
      this.errorHandler = handler;
      return this;
    };
    notFound = (handler) => {
      this.#notFoundHandler = handler;
      return this;
    };
    mount(path, applicationHandler, options) {
      let replaceRequest;
      let optionHandler;
      if (options) {
        if (typeof options === "function") {
          optionHandler = options;
        } else {
          optionHandler = options.optionHandler;
          if (options.replaceRequest === false) {
            replaceRequest = (request) => request;
          } else {
            replaceRequest = options.replaceRequest;
          }
        }
      }
      const getOptions = optionHandler ? (c) => {
        const options2 = optionHandler(c);
        return Array.isArray(options2) ? options2 : [options2];
      } : (c) => {
        let executionContext = undefined;
        try {
          executionContext = c.executionCtx;
        } catch {}
        return [c.env, executionContext];
      };
      replaceRequest ||= (() => {
        const mergedPath = mergePath(this._basePath, path);
        const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
        return (request) => {
          const url = new URL(request.url);
          url.pathname = url.pathname.slice(pathPrefixLength) || "/";
          return new Request(url, request);
        };
      })();
      const handler = async (c, next) => {
        const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
        if (res) {
          return res;
        }
        await next();
      };
      this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
      return this;
    }
    #addRoute(method, path, handler) {
      method = method.toUpperCase();
      path = mergePath(this._basePath, path);
      const r = { basePath: this._basePath, path, method, handler };
      this.router.add(method, path, [handler, r]);
      this.routes.push(r);
    }
    #handleError(err, c) {
      if (err instanceof Error) {
        return this.errorHandler(err, c);
      }
      throw err;
    }
    #dispatch(request, executionCtx, env, method) {
      if (method === "HEAD") {
        return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
      }
      const path = this.getPath(request, { env });
      const matchResult = this.router.match(method, path);
      const c = new Context(request, {
        path,
        matchResult,
        env,
        executionCtx,
        notFoundHandler: this.#notFoundHandler
      });
      if (matchResult[0].length === 1) {
        let res;
        try {
          res = matchResult[0][0][0][0](c, async () => {
            c.res = await this.#notFoundHandler(c);
          });
        } catch (err) {
          return this.#handleError(err, c);
        }
        return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
      }
      const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
      return (async () => {
        try {
          const context = await composed(c);
          if (!context.finalized) {
            throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
          }
          return context.res;
        } catch (err) {
          return this.#handleError(err, c);
        }
      })();
    }
    fetch = (request, ...rest) => {
      return this.#dispatch(request, rest[1], rest[0], request.method);
    };
    request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
      }
      input = input.toString();
      return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
    };
    fire = () => {
      addEventListener("fetch", (event) => {
        event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
      });
    };
  };

  // ../../node_modules/hono/dist/router/reg-exp-router/node.js
  var LABEL_REG_EXP_STR = "[^/]+";
  var ONLY_WILDCARD_REG_EXP_STR = ".*";
  var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
  var PATH_ERROR = Symbol();
  var regExpMetaChars = new Set(".\\+*[^]$()");
  function compareKey(a, b) {
    if (a.length === 1) {
      return b.length === 1 ? a < b ? -1 : 1 : -1;
    }
    if (b.length === 1) {
      return 1;
    }
    if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
      return 1;
    } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
      return -1;
    }
    if (a === LABEL_REG_EXP_STR) {
      return 1;
    } else if (b === LABEL_REG_EXP_STR) {
      return -1;
    }
    return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
  }
  var Node = class {
    #index;
    #varIndex;
    #children = /* @__PURE__ */ Object.create(null);
    insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
      if (tokens.length === 0) {
        if (this.#index !== undefined) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        this.#index = index;
        return;
      }
      const [token, ...restTokens] = tokens;
      const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let node;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        node = this.#children[regexpStr];
        if (!node) {
          if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          node = this.#children[regexpStr] = new Node;
          if (name !== "") {
            node.#varIndex = context.varIndex++;
          }
        }
        if (!pathErrorCheckOnly && name !== "") {
          paramMap.push([name, node.#varIndex]);
        }
      } else {
        node = this.#children[token];
        if (!node) {
          if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          node = this.#children[token] = new Node;
        }
      }
      node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
    }
    buildRegExpStr() {
      const childKeys = Object.keys(this.#children).sort(compareKey);
      const strList = childKeys.map((k) => {
        const c = this.#children[k];
        return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
      });
      if (typeof this.#index === "number") {
        strList.unshift(`#${this.#index}`);
      }
      if (strList.length === 0) {
        return "";
      }
      if (strList.length === 1) {
        return strList[0];
      }
      return "(?:" + strList.join("|") + ")";
    }
  };

  // ../../node_modules/hono/dist/router/reg-exp-router/trie.js
  var Trie = class {
    #context = { varIndex: 0 };
    #root = new Node;
    insert(path, index, pathErrorCheckOnly) {
      const paramAssoc = [];
      const groups = [];
      for (let i = 0;; ) {
        let replaced = false;
        path = path.replace(/\{[^}]+\}/g, (m) => {
          const mark = `@\\${i}`;
          groups[i] = [mark, m];
          i++;
          replaced = true;
          return mark;
        });
        if (!replaced) {
          break;
        }
      }
      const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
      for (let i = groups.length - 1;i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = tokens.length - 1;j >= 0; j--) {
          if (tokens[j].indexOf(mark) !== -1) {
            tokens[j] = tokens[j].replace(mark, groups[i][1]);
            break;
          }
        }
      }
      this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
      return paramAssoc;
    }
    buildRegExp() {
      let regexp = this.#root.buildRegExpStr();
      if (regexp === "") {
        return [/^$/, [], []];
      }
      let captureIndex = 0;
      const indexReplacementMap = [];
      const paramReplacementMap = [];
      regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
        if (handlerIndex !== undefined) {
          indexReplacementMap[++captureIndex] = Number(handlerIndex);
          return "$()";
        }
        if (paramIndex !== undefined) {
          paramReplacementMap[Number(paramIndex)] = ++captureIndex;
          return "";
        }
        return "";
      });
      return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
    }
  };

  // ../../node_modules/hono/dist/router/reg-exp-router/router.js
  var emptyParam = [];
  var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
  var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
  function buildWildcardRegExp(path) {
    return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
  }
  function clearWildcardRegExpCache() {
    wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
  }
  function buildMatcherFromPreprocessedRoutes(routes) {
    const trie = new Trie;
    const handlerData = [];
    if (routes.length === 0) {
      return nullMatcher;
    }
    const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
    const staticMap = /* @__PURE__ */ Object.create(null);
    for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
      const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
      if (pathErrorCheckOnly) {
        staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
      } else {
        j++;
      }
      let paramAssoc;
      try {
        paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
      } catch (e) {
        throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
      }
      if (pathErrorCheckOnly) {
        continue;
      }
      handlerData[j] = handlers.map(([h, paramCount]) => {
        const paramIndexMap = /* @__PURE__ */ Object.create(null);
        paramCount -= 1;
        for (;paramCount >= 0; paramCount--) {
          const [key, value] = paramAssoc[paramCount];
          paramIndexMap[key] = value;
        }
        return [h, paramIndexMap];
      });
    }
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (let i = 0, len = handlerData.length;i < len; i++) {
      for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
        const map = handlerData[i][j]?.[1];
        if (!map) {
          continue;
        }
        const keys = Object.keys(map);
        for (let k = 0, len3 = keys.length;k < len3; k++) {
          map[keys[k]] = paramReplacementMap[map[keys[k]]];
        }
      }
    }
    const handlerMap = [];
    for (const i in indexReplacementMap) {
      handlerMap[i] = handlerData[indexReplacementMap[i]];
    }
    return [regexp, handlerMap, staticMap];
  }
  function findMiddleware(middleware, path) {
    if (!middleware) {
      return;
    }
    for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
      if (buildWildcardRegExp(k).test(path)) {
        return [...middleware[k]];
      }
    }
    return;
  }
  var RegExpRouter = class {
    name = "RegExpRouter";
    #middleware;
    #routes;
    constructor() {
      this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
      this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    }
    add(method, path, handler) {
      const middleware = this.#middleware;
      const routes = this.#routes;
      if (!middleware || !routes) {
        throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
      }
      if (!middleware[method]) {
        [middleware, routes].forEach((handlerMap) => {
          handlerMap[method] = /* @__PURE__ */ Object.create(null);
          Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
            handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          });
        });
      }
      if (path === "/*") {
        path = "*";
      }
      const paramCount = (path.match(/\/:/g) || []).length;
      if (/\*$/.test(path)) {
        const re = buildWildcardRegExp(path);
        if (method === METHOD_NAME_ALL) {
          Object.keys(middleware).forEach((m) => {
            middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
          });
        } else {
          middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
        Object.keys(middleware).forEach((m) => {
          if (method === METHOD_NAME_ALL || method === m) {
            Object.keys(middleware[m]).forEach((p) => {
              re.test(p) && middleware[m][p].push([handler, paramCount]);
            });
          }
        });
        Object.keys(routes).forEach((m) => {
          if (method === METHOD_NAME_ALL || method === m) {
            Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
          }
        });
        return;
      }
      const paths = checkOptionalParameter(path) || [path];
      for (let i = 0, len = paths.length;i < len; i++) {
        const path2 = paths[i];
        Object.keys(routes).forEach((m) => {
          if (method === METHOD_NAME_ALL || method === m) {
            routes[m][path2] ||= [
              ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
            ];
            routes[m][path2].push([handler, paramCount - len + i + 1]);
          }
        });
      }
    }
    match(method, path) {
      clearWildcardRegExpCache();
      const matchers = this.#buildAllMatchers();
      this.match = (method2, path2) => {
        const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
        const staticMatch = matcher[2][path2];
        if (staticMatch) {
          return staticMatch;
        }
        const match = path2.match(matcher[0]);
        if (!match) {
          return [[], emptyParam];
        }
        const index = match.indexOf("", 1);
        return [matcher[1][index], match];
      };
      return this.match(method, path);
    }
    #buildAllMatchers() {
      const matchers = /* @__PURE__ */ Object.create(null);
      Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
        matchers[method] ||= this.#buildMatcher(method);
      });
      this.#middleware = this.#routes = undefined;
      return matchers;
    }
    #buildMatcher(method) {
      const routes = [];
      let hasOwnRoute = method === METHOD_NAME_ALL;
      [this.#middleware, this.#routes].forEach((r) => {
        const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
        if (ownRoute.length !== 0) {
          hasOwnRoute ||= true;
          routes.push(...ownRoute);
        } else if (method !== METHOD_NAME_ALL) {
          routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
        }
      });
      if (!hasOwnRoute) {
        return null;
      } else {
        return buildMatcherFromPreprocessedRoutes(routes);
      }
    }
  };

  // ../../node_modules/hono/dist/router/smart-router/router.js
  var SmartRouter = class {
    name = "SmartRouter";
    #routers = [];
    #routes = [];
    constructor(init) {
      this.#routers = init.routers;
    }
    add(method, path, handler) {
      if (!this.#routes) {
        throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
      }
      this.#routes.push([method, path, handler]);
    }
    match(method, path) {
      if (!this.#routes) {
        throw new Error("Fatal error");
      }
      const routers = this.#routers;
      const routes = this.#routes;
      const len = routers.length;
      let i = 0;
      let res;
      for (;i < len; i++) {
        const router = routers[i];
        try {
          for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
            router.add(...routes[i2]);
          }
          res = router.match(method, path);
        } catch (e) {
          if (e instanceof UnsupportedPathError) {
            continue;
          }
          throw e;
        }
        this.match = router.match.bind(router);
        this.#routers = [router];
        this.#routes = undefined;
        break;
      }
      if (i === len) {
        throw new Error("Fatal error");
      }
      this.name = `SmartRouter + ${this.activeRouter.name}`;
      return res;
    }
    get activeRouter() {
      if (this.#routes || this.#routers.length !== 1) {
        throw new Error("No active router has been determined yet.");
      }
      return this.#routers[0];
    }
  };

  // ../../node_modules/hono/dist/router/trie-router/node.js
  var emptyParams = /* @__PURE__ */ Object.create(null);
  var Node2 = class {
    #methods;
    #children;
    #patterns;
    #order = 0;
    #params = emptyParams;
    constructor(method, handler, children) {
      this.#children = children || /* @__PURE__ */ Object.create(null);
      this.#methods = [];
      if (method && handler) {
        const m = /* @__PURE__ */ Object.create(null);
        m[method] = { handler, possibleKeys: [], score: 0 };
        this.#methods = [m];
      }
      this.#patterns = [];
    }
    insert(method, path, handler) {
      this.#order = ++this.#order;
      let curNode = this;
      const parts = splitRoutingPath(path);
      const possibleKeys = [];
      for (let i = 0, len = parts.length;i < len; i++) {
        const p = parts[i];
        const nextP = parts[i + 1];
        const pattern = getPattern(p, nextP);
        const key = Array.isArray(pattern) ? pattern[0] : p;
        if (key in curNode.#children) {
          curNode = curNode.#children[key];
          if (pattern) {
            possibleKeys.push(pattern[1]);
          }
          continue;
        }
        curNode.#children[key] = new Node2;
        if (pattern) {
          curNode.#patterns.push(pattern);
          possibleKeys.push(pattern[1]);
        }
        curNode = curNode.#children[key];
      }
      curNode.#methods.push({
        [method]: {
          handler,
          possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
          score: this.#order
        }
      });
      return curNode;
    }
    #getHandlerSets(node, method, nodeParams, params) {
      const handlerSets = [];
      for (let i = 0, len = node.#methods.length;i < len; i++) {
        const m = node.#methods[i];
        const handlerSet = m[method] || m[METHOD_NAME_ALL];
        const processedSet = {};
        if (handlerSet !== undefined) {
          handlerSet.params = /* @__PURE__ */ Object.create(null);
          handlerSets.push(handlerSet);
          if (nodeParams !== emptyParams || params && params !== emptyParams) {
            for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
              const key = handlerSet.possibleKeys[i2];
              const processed = processedSet[handlerSet.score];
              handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
              processedSet[handlerSet.score] = true;
            }
          }
        }
      }
      return handlerSets;
    }
    search(method, path) {
      const handlerSets = [];
      this.#params = emptyParams;
      const curNode = this;
      let curNodes = [curNode];
      const parts = splitPath(path);
      const curNodesQueue = [];
      for (let i = 0, len = parts.length;i < len; i++) {
        const part = parts[i];
        const isLast = i === len - 1;
        const tempNodes = [];
        for (let j = 0, len2 = curNodes.length;j < len2; j++) {
          const node = curNodes[j];
          const nextNode = node.#children[part];
          if (nextNode) {
            nextNode.#params = node.#params;
            if (isLast) {
              if (nextNode.#children["*"]) {
                handlerSets.push(...this.#getHandlerSets(nextNode.#children["*"], method, node.#params));
              }
              handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
            } else {
              tempNodes.push(nextNode);
            }
          }
          for (let k = 0, len3 = node.#patterns.length;k < len3; k++) {
            const pattern = node.#patterns[k];
            const params = node.#params === emptyParams ? {} : { ...node.#params };
            if (pattern === "*") {
              const astNode = node.#children["*"];
              if (astNode) {
                handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
                astNode.#params = params;
                tempNodes.push(astNode);
              }
              continue;
            }
            if (!part) {
              continue;
            }
            const [key, name, matcher] = pattern;
            const child = node.#children[key];
            const restPathString = parts.slice(i).join("/");
            if (matcher instanceof RegExp) {
              const m = matcher.exec(restPathString);
              if (m) {
                params[name] = m[0];
                handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
                if (Object.keys(child.#children).length) {
                  child.#params = params;
                  const componentCount = m[0].match(/\//)?.length ?? 0;
                  const targetCurNodes = curNodesQueue[componentCount] ||= [];
                  targetCurNodes.push(child);
                }
                continue;
              }
            }
            if (matcher === true || matcher.test(part)) {
              params[name] = part;
              if (isLast) {
                handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
                if (child.#children["*"]) {
                  handlerSets.push(...this.#getHandlerSets(child.#children["*"], method, params, node.#params));
                }
              } else {
                child.#params = params;
                tempNodes.push(child);
              }
            }
          }
        }
        curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
      }
      if (handlerSets.length > 1) {
        handlerSets.sort((a, b) => {
          return a.score - b.score;
        });
      }
      return [handlerSets.map(({ handler, params }) => [handler, params])];
    }
  };

  // ../../node_modules/hono/dist/router/trie-router/router.js
  var TrieRouter = class {
    name = "TrieRouter";
    #node;
    constructor() {
      this.#node = new Node2;
    }
    add(method, path, handler) {
      const results = checkOptionalParameter(path);
      if (results) {
        for (let i = 0, len = results.length;i < len; i++) {
          this.#node.insert(method, results[i], handler);
        }
        return;
      }
      this.#node.insert(method, path, handler);
    }
    match(method, path) {
      return this.#node.search(method, path);
    }
  };

  // ../../node_modules/hono/dist/hono.js
  var Hono2 = class extends Hono {
    constructor(options = {}) {
      super(options);
      this.router = options.router ?? new SmartRouter({
        routers: [new RegExpRouter, new TrieRouter]
      });
    }
  };

  // ../../node_modules/hono/dist/middleware/cors/index.js
  var cors = (options) => {
    const defaults = {
      origin: "*",
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      allowHeaders: [],
      exposeHeaders: []
    };
    const opts = {
      ...defaults,
      ...options
    };
    const findAllowOrigin = ((optsOrigin) => {
      if (typeof optsOrigin === "string") {
        if (optsOrigin === "*") {
          return () => optsOrigin;
        } else {
          return (origin) => optsOrigin === origin ? origin : null;
        }
      } else if (typeof optsOrigin === "function") {
        return optsOrigin;
      } else {
        return (origin) => optsOrigin.includes(origin) ? origin : null;
      }
    })(opts.origin);
    const findAllowMethods = ((optsAllowMethods) => {
      if (typeof optsAllowMethods === "function") {
        return optsAllowMethods;
      } else if (Array.isArray(optsAllowMethods)) {
        return () => optsAllowMethods;
      } else {
        return () => [];
      }
    })(opts.allowMethods);
    return async function cors2(c, next) {
      function set(key, value) {
        c.res.headers.set(key, value);
      }
      const allowOrigin = findAllowOrigin(c.req.header("origin") || "", c);
      if (allowOrigin) {
        set("Access-Control-Allow-Origin", allowOrigin);
      }
      if (opts.origin !== "*") {
        const existingVary = c.req.header("Vary");
        if (existingVary) {
          set("Vary", existingVary);
        } else {
          set("Vary", "Origin");
        }
      }
      if (opts.credentials) {
        set("Access-Control-Allow-Credentials", "true");
      }
      if (opts.exposeHeaders?.length) {
        set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
      }
      if (c.req.method === "OPTIONS") {
        if (opts.maxAge != null) {
          set("Access-Control-Max-Age", opts.maxAge.toString());
        }
        const allowMethods = findAllowMethods(c.req.header("origin") || "", c);
        if (allowMethods.length) {
          set("Access-Control-Allow-Methods", allowMethods.join(","));
        }
        let headers = opts.allowHeaders;
        if (!headers?.length) {
          const requestHeaders = c.req.header("Access-Control-Request-Headers");
          if (requestHeaders) {
            headers = requestHeaders.split(/\s*,\s*/);
          }
        }
        if (headers?.length) {
          set("Access-Control-Allow-Headers", headers.join(","));
          c.res.headers.append("Vary", "Access-Control-Request-Headers");
        }
        c.res.headers.delete("Content-Length");
        c.res.headers.delete("Content-Type");
        return new Response(null, {
          headers: c.res.headers,
          status: 204,
          statusText: "No Content"
        });
      }
      await next();
    };
  };

  // ../../node_modules/@trpc/server/dist/utils-DdbbrDku.mjs
  var TRPC_ERROR_CODES_BY_KEY = {
    PARSE_ERROR: -32700,
    BAD_REQUEST: -32600,
    INTERNAL_SERVER_ERROR: -32603,
    NOT_IMPLEMENTED: -32603,
    BAD_GATEWAY: -32603,
    SERVICE_UNAVAILABLE: -32603,
    GATEWAY_TIMEOUT: -32603,
    UNAUTHORIZED: -32001,
    PAYMENT_REQUIRED: -32002,
    FORBIDDEN: -32003,
    NOT_FOUND: -32004,
    METHOD_NOT_SUPPORTED: -32005,
    TIMEOUT: -32008,
    CONFLICT: -32009,
    PRECONDITION_FAILED: -32012,
    PAYLOAD_TOO_LARGE: -32013,
    UNSUPPORTED_MEDIA_TYPE: -32015,
    UNPROCESSABLE_CONTENT: -32022,
    TOO_MANY_REQUESTS: -32029,
    CLIENT_CLOSED_REQUEST: -32099
  };
  var TRPC_ERROR_CODES_BY_NUMBER = {
    [-32700]: "PARSE_ERROR",
    [-32600]: "BAD_REQUEST",
    [-32603]: "INTERNAL_SERVER_ERROR",
    [-32001]: "UNAUTHORIZED",
    [-32002]: "PAYMENT_REQUIRED",
    [-32003]: "FORBIDDEN",
    [-32004]: "NOT_FOUND",
    [-32005]: "METHOD_NOT_SUPPORTED",
    [-32008]: "TIMEOUT",
    [-32009]: "CONFLICT",
    [-32012]: "PRECONDITION_FAILED",
    [-32013]: "PAYLOAD_TOO_LARGE",
    [-32015]: "UNSUPPORTED_MEDIA_TYPE",
    [-32022]: "UNPROCESSABLE_CONTENT",
    [-32029]: "TOO_MANY_REQUESTS",
    [-32099]: "CLIENT_CLOSED_REQUEST"
  };
  var retryableRpcCodes = [
    TRPC_ERROR_CODES_BY_KEY.BAD_GATEWAY,
    TRPC_ERROR_CODES_BY_KEY.SERVICE_UNAVAILABLE,
    TRPC_ERROR_CODES_BY_KEY.GATEWAY_TIMEOUT,
    TRPC_ERROR_CODES_BY_KEY.INTERNAL_SERVER_ERROR
  ];
  function mergeWithoutOverrides(obj1, ...objs) {
    const newObj = Object.assign(Object.create(null), obj1);
    for (const overrides of objs)
      for (const key in overrides) {
        if (key in newObj && newObj[key] !== overrides[key])
          throw new Error(`Duplicate key ${key}`);
        newObj[key] = overrides[key];
      }
    return newObj;
  }
  function isObject(value) {
    return !!value && !Array.isArray(value) && typeof value === "object";
  }
  function isFunction(fn) {
    return typeof fn === "function";
  }
  function omitPrototype(obj) {
    return Object.assign(Object.create(null), obj);
  }
  var asyncIteratorsSupported = typeof Symbol === "function" && !!Symbol.asyncIterator;
  function isAsyncIterable(value) {
    return asyncIteratorsSupported && isObject(value) && Symbol.asyncIterator in value;
  }
  var run = (fn) => fn();
  function identity(it) {
    return it;
  }

  // ../../node_modules/@trpc/server/dist/getErrorShape-Uhlrl4Bk.mjs
  var __create = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function")
      for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key;i < n; i++) {
        key = keys[i];
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, {
            get: ((k) => from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
      }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var noop = () => {};
  var freezeIfAvailable = (obj) => {
    if (Object.freeze)
      Object.freeze(obj);
  };
  function createInnerProxy(callback, path, memo) {
    var _memo$cacheKey;
    const cacheKey = path.join(".");
    (_memo$cacheKey = memo[cacheKey]) !== null && _memo$cacheKey !== undefined || (memo[cacheKey] = new Proxy(noop, {
      get(_obj, key) {
        if (typeof key !== "string" || key === "then")
          return;
        return createInnerProxy(callback, [...path, key], memo);
      },
      apply(_1, _2, args) {
        const lastOfPath = path[path.length - 1];
        let opts = {
          args,
          path
        };
        if (lastOfPath === "call")
          opts = {
            args: args.length >= 2 ? [args[1]] : [],
            path: path.slice(0, -1)
          };
        else if (lastOfPath === "apply")
          opts = {
            args: args.length >= 2 ? args[1] : [],
            path: path.slice(0, -1)
          };
        freezeIfAvailable(opts.args);
        freezeIfAvailable(opts.path);
        return callback(opts);
      }
    }));
    return memo[cacheKey];
  }
  var createRecursiveProxy = (callback) => createInnerProxy(callback, [], Object.create(null));
  var JSONRPC2_TO_HTTP_CODE = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  };
  function getStatusCodeFromKey(code) {
    var _JSONRPC2_TO_HTTP_COD;
    return (_JSONRPC2_TO_HTTP_COD = JSONRPC2_TO_HTTP_CODE[code]) !== null && _JSONRPC2_TO_HTTP_COD !== undefined ? _JSONRPC2_TO_HTTP_COD : 500;
  }
  function getHTTPStatusCode(json) {
    const arr = Array.isArray(json) ? json : [json];
    const httpStatuses = new Set(arr.map((res) => {
      if ("error" in res && isObject(res.error.data)) {
        var _res$error$data;
        if (typeof ((_res$error$data = res.error.data) === null || _res$error$data === undefined ? undefined : _res$error$data["httpStatus"]) === "number")
          return res.error.data["httpStatus"];
        const code = TRPC_ERROR_CODES_BY_NUMBER[res.error.code];
        return getStatusCodeFromKey(code);
      }
      return 200;
    }));
    if (httpStatuses.size !== 1)
      return 207;
    const httpStatus = httpStatuses.values().next().value;
    return httpStatus;
  }
  function getHTTPStatusCodeFromError(error) {
    return getStatusCodeFromKey(error.code);
  }
  var require_typeof = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js"(exports, module) {
    function _typeof$2(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof$2 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o$1) {
        return typeof o$1;
      } : function(o$1) {
        return o$1 && typeof Symbol == "function" && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
    }
    module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPrimitive = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js"(exports, module) {
    var _typeof$1 = require_typeof()["default"];
    function toPrimitive$1(t, r) {
      if (_typeof$1(t) != "object" || !t)
        return t;
      var e = t[Symbol.toPrimitive];
      if (e !== undefined) {
        var i = e.call(t, r || "default");
        if (_typeof$1(i) != "object")
          return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (r === "string" ? String : Number)(t);
    }
    module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_toPropertyKey = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js"(exports, module) {
    var _typeof = require_typeof()["default"];
    var toPrimitive = require_toPrimitive();
    function toPropertyKey$1(t) {
      var i = toPrimitive(t, "string");
      return _typeof(i) == "symbol" ? i : i + "";
    }
    module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_defineProperty = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js"(exports, module) {
    var toPropertyKey = require_toPropertyKey();
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_objectSpread2 = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js"(exports, module) {
    var defineProperty = require_defineProperty();
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r$1) {
          return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1;r < arguments.length; r++) {
        var t = arguments[r] != null ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
          defineProperty(e, r$1, t[r$1]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
          Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
        });
      }
      return e;
    }
    module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_objectSpread2 = __toESM(require_objectSpread2(), 1);
  function getErrorShape(opts) {
    const { path, error, config } = opts;
    const { code } = opts.error;
    const shape = {
      message: error.message,
      code: TRPC_ERROR_CODES_BY_KEY[code],
      data: {
        code,
        httpStatus: getHTTPStatusCodeFromError(error)
      }
    };
    if (config.isDev && typeof opts.error.stack === "string")
      shape.data.stack = opts.error.stack;
    if (typeof path === "string")
      shape.data.path = path;
    return config.errorFormatter((0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, opts), {}, { shape }));
  }

  // ../../node_modules/@trpc/server/dist/tracked-gU3ttYjg.mjs
  var defaultFormatter = ({ shape }) => {
    return shape;
  };
  var import_defineProperty = __toESM(require_defineProperty(), 1);
  var UnknownCauseError = class extends Error {
  };
  function getCauseFromUnknown(cause) {
    if (cause instanceof Error)
      return cause;
    const type = typeof cause;
    if (type === "undefined" || type === "function" || cause === null)
      return;
    if (type !== "object")
      return new Error(String(cause));
    if (isObject(cause))
      return Object.assign(new UnknownCauseError, cause);
    return;
  }
  function getTRPCErrorFromUnknown(cause) {
    if (cause instanceof TRPCError)
      return cause;
    if (cause instanceof Error && cause.name === "TRPCError")
      return cause;
    const trpcError = new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause
    });
    if (cause instanceof Error && cause.stack)
      trpcError.stack = cause.stack;
    return trpcError;
  }
  var TRPCError = class extends Error {
    constructor(opts) {
      var _ref, _opts$message, _this$cause;
      const cause = getCauseFromUnknown(opts.cause);
      const message = (_ref = (_opts$message = opts.message) !== null && _opts$message !== undefined ? _opts$message : cause === null || cause === undefined ? undefined : cause.message) !== null && _ref !== undefined ? _ref : opts.code;
      super(message, { cause });
      (0, import_defineProperty.default)(this, "cause", undefined);
      (0, import_defineProperty.default)(this, "code", undefined);
      this.code = opts.code;
      this.name = "TRPCError";
      (_this$cause = this.cause) !== null && _this$cause !== undefined || (this.cause = cause);
    }
  };
  var import_objectSpread2$1 = __toESM(require_objectSpread2(), 1);
  function getDataTransformer(transformer) {
    if ("input" in transformer)
      return transformer;
    return {
      input: transformer,
      output: transformer
    };
  }
  var defaultTransformer = {
    input: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    },
    output: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    }
  };
  function transformTRPCResponseItem(config, item) {
    if ("error" in item)
      return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item), {}, { error: config.transformer.output.serialize(item.error) });
    if ("data" in item.result)
      return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item), {}, { result: (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item.result), {}, { data: config.transformer.output.serialize(item.result.data) }) });
    return item;
  }
  function transformTRPCResponse(config, itemOrItems) {
    return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(config, item)) : transformTRPCResponseItem(config, itemOrItems);
  }
  var import_objectSpread22 = __toESM(require_objectSpread2(), 1);
  var lazySymbol = Symbol("lazy");
  function once(fn) {
    const uncalled = Symbol();
    let result = uncalled;
    return () => {
      if (result === uncalled)
        result = fn();
      return result;
    };
  }
  function isLazy(input) {
    return typeof input === "function" && lazySymbol in input;
  }
  function isRouter(value) {
    return isObject(value) && isObject(value["_def"]) && "router" in value["_def"];
  }
  var emptyRouter = {
    _ctx: null,
    _errorShape: null,
    _meta: null,
    queries: {},
    mutations: {},
    subscriptions: {},
    errorFormatter: defaultFormatter,
    transformer: defaultTransformer
  };
  var reservedWords = [
    "then",
    "call",
    "apply"
  ];
  function createRouterFactory(config) {
    function createRouterInner(input) {
      const reservedWordsUsed = new Set(Object.keys(input).filter((v) => reservedWords.includes(v)));
      if (reservedWordsUsed.size > 0)
        throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
      const procedures = omitPrototype({});
      const lazy$1 = omitPrototype({});
      function createLazyLoader(opts) {
        return {
          ref: opts.ref,
          load: once(async () => {
            const router$1 = await opts.ref();
            const lazyPath = [...opts.path, opts.key];
            const lazyKey = lazyPath.join(".");
            opts.aggregate[opts.key] = step(router$1._def.record, lazyPath);
            delete lazy$1[lazyKey];
            for (const [nestedKey, nestedItem] of Object.entries(router$1._def.lazy)) {
              const nestedRouterKey = [...lazyPath, nestedKey].join(".");
              lazy$1[nestedRouterKey] = createLazyLoader({
                ref: nestedItem.ref,
                path: lazyPath,
                key: nestedKey,
                aggregate: opts.aggregate[opts.key]
              });
            }
          })
        };
      }
      function step(from, path = []) {
        const aggregate = omitPrototype({});
        for (const [key, item] of Object.entries(from !== null && from !== undefined ? from : {})) {
          if (isLazy(item)) {
            lazy$1[[...path, key].join(".")] = createLazyLoader({
              path,
              ref: item,
              key,
              aggregate
            });
            continue;
          }
          if (isRouter(item)) {
            aggregate[key] = step(item._def.record, [...path, key]);
            continue;
          }
          if (!isProcedure(item)) {
            aggregate[key] = step(item, [...path, key]);
            continue;
          }
          const newPath = [...path, key].join(".");
          if (procedures[newPath])
            throw new Error(`Duplicate key: ${newPath}`);
          procedures[newPath] = item;
          aggregate[key] = item;
        }
        return aggregate;
      }
      const record = step(input);
      const _def = (0, import_objectSpread22.default)((0, import_objectSpread22.default)({
        _config: config,
        router: true,
        procedures,
        lazy: lazy$1
      }, emptyRouter), {}, { record });
      const router = (0, import_objectSpread22.default)((0, import_objectSpread22.default)({}, record), {}, {
        _def,
        createCaller: createCallerFactory()({ _def })
      });
      return router;
    }
    return createRouterInner;
  }
  function isProcedure(procedureOrRouter) {
    return typeof procedureOrRouter === "function";
  }
  async function getProcedureAtPath(router, path) {
    const { _def } = router;
    let procedure = _def.procedures[path];
    while (!procedure) {
      const key = Object.keys(_def.lazy).find((key$1) => path.startsWith(key$1));
      if (!key)
        return null;
      const lazyRouter = _def.lazy[key];
      await lazyRouter.load();
      procedure = _def.procedures[path];
    }
    return procedure;
  }
  function createCallerFactory() {
    return function createCallerInner(router) {
      const { _def } = router;
      return function createCaller(ctxOrCallback, opts) {
        return createRecursiveProxy(async ({ path, args }) => {
          const fullPath = path.join(".");
          if (path.length === 1 && path[0] === "_def")
            return _def;
          const procedure = await getProcedureAtPath(router, fullPath);
          let ctx = undefined;
          try {
            if (!procedure)
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `No procedure found on path "${path}"`
              });
            ctx = isFunction(ctxOrCallback) ? await Promise.resolve(ctxOrCallback()) : ctxOrCallback;
            return await procedure({
              path: fullPath,
              getRawInput: async () => args[0],
              ctx,
              type: procedure._def.type,
              signal: opts === null || opts === undefined ? undefined : opts.signal
            });
          } catch (cause) {
            var _opts$onError, _procedure$_def$type;
            opts === null || opts === undefined || (_opts$onError = opts.onError) === null || _opts$onError === undefined || _opts$onError.call(opts, {
              ctx,
              error: getTRPCErrorFromUnknown(cause),
              input: args[0],
              path: fullPath,
              type: (_procedure$_def$type = procedure === null || procedure === undefined ? undefined : procedure._def.type) !== null && _procedure$_def$type !== undefined ? _procedure$_def$type : "unknown"
            });
            throw cause;
          }
        });
      };
    };
  }
  function mergeRouters(...routerList) {
    var _routerList$;
    const record = mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
    const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
      if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== defaultFormatter) {
        if (currentErrorFormatter !== defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter)
          throw new Error("You seem to have several error formatters");
        return nextRouter._def._config.errorFormatter;
      }
      return currentErrorFormatter;
    }, defaultFormatter);
    const transformer = routerList.reduce((prev, current) => {
      if (current._def._config.transformer && current._def._config.transformer !== defaultTransformer) {
        if (prev !== defaultTransformer && prev !== current._def._config.transformer)
          throw new Error("You seem to have several transformers");
        return current._def._config.transformer;
      }
      return prev;
    }, defaultTransformer);
    const router = createRouterFactory({
      errorFormatter,
      transformer,
      isDev: routerList.every((r) => r._def._config.isDev),
      allowOutsideOfServer: routerList.every((r) => r._def._config.allowOutsideOfServer),
      isServer: routerList.every((r) => r._def._config.isServer),
      $types: (_routerList$ = routerList[0]) === null || _routerList$ === undefined ? undefined : _routerList$._def._config.$types
    })(record);
    return router;
  }
  var trackedSymbol = Symbol();
  function isTrackedEnvelope(value) {
    return Array.isArray(value) && value[2] === trackedSymbol;
  }

  // ../../node_modules/@trpc/server/dist/observable-UMO3vUa_.mjs
  function isObservable(x) {
    return typeof x === "object" && x !== null && "subscribe" in x;
  }
  function observableToReadableStream(observable$1, signal) {
    let unsub = null;
    const onAbort = () => {
      unsub === null || unsub === undefined || unsub.unsubscribe();
      unsub = null;
      signal.removeEventListener("abort", onAbort);
    };
    return new ReadableStream({
      start(controller) {
        unsub = observable$1.subscribe({
          next(data) {
            controller.enqueue({
              ok: true,
              value: data
            });
          },
          error(error) {
            controller.enqueue({
              ok: false,
              error
            });
            controller.close();
          },
          complete() {
            controller.close();
          }
        });
        if (signal.aborted)
          onAbort();
        else
          signal.addEventListener("abort", onAbort, { once: true });
      },
      cancel() {
        onAbort();
      }
    });
  }
  function observableToAsyncIterable(observable$1, signal) {
    const stream = observableToReadableStream(observable$1, signal);
    const reader = stream.getReader();
    const iterator = {
      async next() {
        const value = await reader.read();
        if (value.done)
          return {
            value: undefined,
            done: true
          };
        const { value: result } = value;
        if (!result.ok)
          throw result.error;
        return {
          value: result.value,
          done: false
        };
      },
      async return() {
        await reader.cancel();
        return {
          value: undefined,
          done: true
        };
      }
    };
    return { [Symbol.asyncIterator]() {
      return iterator;
    } };
  }

  // ../../node_modules/@trpc/server/dist/resolveResponse-CzlbRpCI.mjs
  function parseConnectionParamsFromUnknown(parsed) {
    try {
      if (parsed === null)
        return null;
      if (!isObject(parsed))
        throw new Error("Expected object");
      const nonStringValues = Object.entries(parsed).filter(([_key, value]) => typeof value !== "string");
      if (nonStringValues.length > 0)
        throw new Error(`Expected connectionParams to be string values. Got ${nonStringValues.map(([key, value]) => `${key}: ${typeof value}`).join(", ")}`);
      return parsed;
    } catch (cause) {
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: "Invalid connection params shape",
        cause
      });
    }
  }
  function parseConnectionParamsFromString(str) {
    let parsed;
    try {
      parsed = JSON.parse(str);
    } catch (cause) {
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: "Not JSON-parsable query params",
        cause
      });
    }
    return parseConnectionParamsFromUnknown(parsed);
  }
  var import_objectSpread2$12 = __toESM(require_objectSpread2(), 1);
  function memo(fn) {
    let promise = null;
    const sym = Symbol.for("@trpc/server/http/memo");
    let value = sym;
    return {
      read: async () => {
        var _promise;
        if (value !== sym)
          return value;
        (_promise = promise) !== null && _promise !== undefined || (promise = fn().catch((cause) => {
          if (cause instanceof TRPCError)
            throw cause;
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: cause instanceof Error ? cause.message : "Invalid input",
            cause
          });
        }));
        value = await promise;
        promise = null;
        return value;
      },
      result: () => {
        return value !== sym ? value : undefined;
      }
    };
  }
  var jsonContentTypeHandler = {
    isMatch(req) {
      var _req$headers$get;
      return !!((_req$headers$get = req.headers.get("content-type")) === null || _req$headers$get === undefined ? undefined : _req$headers$get.startsWith("application/json"));
    },
    async parse(opts) {
      var _types$values$next$va;
      const { req } = opts;
      const isBatchCall = opts.searchParams.get("batch") === "1";
      const paths = isBatchCall ? opts.path.split(",") : [opts.path];
      const getInputs = memo(async () => {
        let inputs = undefined;
        if (req.method === "GET") {
          const queryInput = opts.searchParams.get("input");
          if (queryInput)
            inputs = JSON.parse(queryInput);
        } else
          inputs = await req.json();
        if (inputs === undefined)
          return {};
        if (!isBatchCall)
          return { 0: opts.router._def._config.transformer.input.deserialize(inputs) };
        if (!isObject(inputs))
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: '"input" needs to be an object when doing a batch call'
          });
        const acc = {};
        for (const index of paths.keys()) {
          const input = inputs[index];
          if (input !== undefined)
            acc[index] = opts.router._def._config.transformer.input.deserialize(input);
        }
        return acc;
      });
      const calls = await Promise.all(paths.map(async (path, index) => {
        const procedure = await getProcedureAtPath(opts.router, path);
        return {
          path,
          procedure,
          getRawInput: async () => {
            const inputs = await getInputs.read();
            let input = inputs[index];
            if ((procedure === null || procedure === undefined ? undefined : procedure._def.type) === "subscription") {
              var _ref, _opts$headers$get;
              const lastEventId = (_ref = (_opts$headers$get = opts.headers.get("last-event-id")) !== null && _opts$headers$get !== undefined ? _opts$headers$get : opts.searchParams.get("lastEventId")) !== null && _ref !== undefined ? _ref : opts.searchParams.get("Last-Event-Id");
              if (lastEventId)
                if (isObject(input))
                  input = (0, import_objectSpread2$12.default)((0, import_objectSpread2$12.default)({}, input), {}, { lastEventId });
                else {
                  var _input;
                  (_input = input) !== null && _input !== undefined || (input = { lastEventId });
                }
            }
            return input;
          },
          result: () => {
            var _getInputs$result;
            return (_getInputs$result = getInputs.result()) === null || _getInputs$result === undefined ? undefined : _getInputs$result[index];
          }
        };
      }));
      const types = new Set(calls.map((call) => {
        var _call$procedure;
        return (_call$procedure = call.procedure) === null || _call$procedure === undefined ? undefined : _call$procedure._def.type;
      }).filter(Boolean));
      if (types.size > 1)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot mix procedure types in call: ${Array.from(types).join(", ")}`
        });
      const type = (_types$values$next$va = types.values().next().value) !== null && _types$values$next$va !== undefined ? _types$values$next$va : "unknown";
      const connectionParamsStr = opts.searchParams.get("connectionParams");
      const info = {
        isBatchCall,
        accept: req.headers.get("trpc-accept"),
        calls,
        type,
        connectionParams: connectionParamsStr === null ? null : parseConnectionParamsFromString(connectionParamsStr),
        signal: req.signal,
        url: opts.url
      };
      return info;
    }
  };
  var formDataContentTypeHandler = {
    isMatch(req) {
      var _req$headers$get2;
      return !!((_req$headers$get2 = req.headers.get("content-type")) === null || _req$headers$get2 === undefined ? undefined : _req$headers$get2.startsWith("multipart/form-data"));
    },
    async parse(opts) {
      const { req } = opts;
      if (req.method !== "POST")
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Only POST requests are supported for multipart/form-data requests"
        });
      const getInputs = memo(async () => {
        const fd = await req.formData();
        return fd;
      });
      const procedure = await getProcedureAtPath(opts.router, opts.path);
      return {
        accept: null,
        calls: [{
          path: opts.path,
          getRawInput: getInputs.read,
          result: getInputs.result,
          procedure
        }],
        isBatchCall: false,
        type: "mutation",
        connectionParams: null,
        signal: req.signal,
        url: opts.url
      };
    }
  };
  var octetStreamContentTypeHandler = {
    isMatch(req) {
      var _req$headers$get3;
      return !!((_req$headers$get3 = req.headers.get("content-type")) === null || _req$headers$get3 === undefined ? undefined : _req$headers$get3.startsWith("application/octet-stream"));
    },
    async parse(opts) {
      const { req } = opts;
      if (req.method !== "POST")
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Only POST requests are supported for application/octet-stream requests"
        });
      const getInputs = memo(async () => {
        return req.body;
      });
      return {
        calls: [{
          path: opts.path,
          getRawInput: getInputs.read,
          result: getInputs.result,
          procedure: await getProcedureAtPath(opts.router, opts.path)
        }],
        isBatchCall: false,
        accept: null,
        type: "mutation",
        connectionParams: null,
        signal: req.signal,
        url: opts.url
      };
    }
  };
  var handlers = [
    jsonContentTypeHandler,
    formDataContentTypeHandler,
    octetStreamContentTypeHandler
  ];
  function getContentTypeHandler(req) {
    const handler = handlers.find((handler$1) => handler$1.isMatch(req));
    if (handler)
      return handler;
    if (!handler && req.method === "GET")
      return jsonContentTypeHandler;
    throw new TRPCError({
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: req.headers.has("content-type") ? `Unsupported content-type "${req.headers.get("content-type")}` : "Missing content-type header"
    });
  }
  async function getRequestInfo(opts) {
    const handler = getContentTypeHandler(opts.req);
    return await handler.parse(opts);
  }
  function isAbortError(error) {
    return isObject(error) && error["name"] === "AbortError";
  }
  function throwAbortError(message = "AbortError") {
    throw new DOMException(message, "AbortError");
  }
  var import_defineProperty2 = __toESM(require_defineProperty(), 1);
  var _Symbol$toStringTag;
  var subscribableCache = /* @__PURE__ */ new WeakMap;
  var NOOP = () => {};
  _Symbol$toStringTag = Symbol.toStringTag;
  var Unpromise = class Unpromise2 {
    constructor(arg) {
      (0, import_defineProperty2.default)(this, "promise", undefined);
      (0, import_defineProperty2.default)(this, "subscribers", []);
      (0, import_defineProperty2.default)(this, "settlement", null);
      (0, import_defineProperty2.default)(this, _Symbol$toStringTag, "Unpromise");
      if (typeof arg === "function")
        this.promise = new Promise(arg);
      else
        this.promise = arg;
      const thenReturn = this.promise.then((value) => {
        const { subscribers } = this;
        this.subscribers = null;
        this.settlement = {
          status: "fulfilled",
          value
        };
        subscribers === null || subscribers === undefined || subscribers.forEach(({ resolve }) => {
          resolve(value);
        });
      });
      if ("catch" in thenReturn)
        thenReturn.catch((reason) => {
          const { subscribers } = this;
          this.subscribers = null;
          this.settlement = {
            status: "rejected",
            reason
          };
          subscribers === null || subscribers === undefined || subscribers.forEach(({ reject }) => {
            reject(reason);
          });
        });
    }
    subscribe() {
      let promise;
      let unsubscribe;
      const { settlement } = this;
      if (settlement === null) {
        if (this.subscribers === null)
          throw new Error("Unpromise settled but still has subscribers");
        const subscriber = withResolvers();
        this.subscribers = listWithMember(this.subscribers, subscriber);
        promise = subscriber.promise;
        unsubscribe = () => {
          if (this.subscribers !== null)
            this.subscribers = listWithoutMember(this.subscribers, subscriber);
        };
      } else {
        const { status } = settlement;
        if (status === "fulfilled")
          promise = Promise.resolve(settlement.value);
        else
          promise = Promise.reject(settlement.reason);
        unsubscribe = NOOP;
      }
      return Object.assign(promise, { unsubscribe });
    }
    then(onfulfilled, onrejected) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.then(onfulfilled, onrejected), { unsubscribe });
    }
    catch(onrejected) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.catch(onrejected), { unsubscribe });
    }
    finally(onfinally) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.finally(onfinally), { unsubscribe });
    }
    static proxy(promise) {
      const cached = Unpromise2.getSubscribablePromise(promise);
      return typeof cached !== "undefined" ? cached : Unpromise2.createSubscribablePromise(promise);
    }
    static createSubscribablePromise(promise) {
      const created = new Unpromise2(promise);
      subscribableCache.set(promise, created);
      subscribableCache.set(created, created);
      return created;
    }
    static getSubscribablePromise(promise) {
      return subscribableCache.get(promise);
    }
    static resolve(value) {
      const promise = typeof value === "object" && value !== null && "then" in value && typeof value.then === "function" ? value : Promise.resolve(value);
      return Unpromise2.proxy(promise).subscribe();
    }
    static async any(values) {
      const valuesArray = Array.isArray(values) ? values : [...values];
      const subscribedPromises = valuesArray.map(Unpromise2.resolve);
      try {
        return await Promise.any(subscribedPromises);
      } finally {
        subscribedPromises.forEach(({ unsubscribe }) => {
          unsubscribe();
        });
      }
    }
    static async race(values) {
      const valuesArray = Array.isArray(values) ? values : [...values];
      const subscribedPromises = valuesArray.map(Unpromise2.resolve);
      try {
        return await Promise.race(subscribedPromises);
      } finally {
        subscribedPromises.forEach(({ unsubscribe }) => {
          unsubscribe();
        });
      }
    }
    static async raceReferences(promises) {
      const selfPromises = promises.map(resolveSelfTuple);
      try {
        return await Promise.race(selfPromises);
      } finally {
        for (const promise of selfPromises)
          promise.unsubscribe();
      }
    }
  };
  function resolveSelfTuple(promise) {
    return Unpromise.proxy(promise).then(() => [promise]);
  }
  function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  function listWithMember(arr, member) {
    return [...arr, member];
  }
  function listWithoutIndex(arr, index) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  function listWithoutMember(arr, member) {
    const index = arr.indexOf(member);
    if (index !== -1)
      return listWithoutIndex(arr, index);
    return arr;
  }
  var _Symbol;
  var _Symbol$dispose;
  var _Symbol2;
  var _Symbol2$asyncDispose;
  (_Symbol$dispose = (_Symbol = Symbol).dispose) !== null && _Symbol$dispose !== undefined || (_Symbol.dispose = Symbol());
  (_Symbol2$asyncDispose = (_Symbol2 = Symbol).asyncDispose) !== null && _Symbol2$asyncDispose !== undefined || (_Symbol2.asyncDispose = Symbol());
  function makeResource(thing, dispose) {
    const it = thing;
    const existing = it[Symbol.dispose];
    it[Symbol.dispose] = () => {
      dispose();
      existing === null || existing === undefined || existing();
    };
    return it;
  }
  function makeAsyncResource(thing, dispose) {
    const it = thing;
    const existing = it[Symbol.asyncDispose];
    it[Symbol.asyncDispose] = async () => {
      await dispose();
      await (existing === null || existing === undefined ? undefined : existing());
    };
    return it;
  }
  var disposablePromiseTimerResult = Symbol();
  function timerResource(ms) {
    let timer = null;
    return makeResource({ start() {
      if (timer)
        throw new Error("Timer already started");
      const promise = new Promise((resolve) => {
        timer = setTimeout(() => resolve(disposablePromiseTimerResult), ms);
      });
      return promise;
    } }, () => {
      if (timer)
        clearTimeout(timer);
    });
  }
  var require_usingCtx = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js"(exports, module) {
    function _usingCtx() {
      var r = typeof SuppressedError == "function" ? SuppressedError : function(r$1, e$1) {
        var n$1 = Error();
        return n$1.name = "SuppressedError", n$1.error = r$1, n$1.suppressed = e$1, n$1;
      }, e = {}, n = [];
      function using(r$1, e$1) {
        if (e$1 != null) {
          if (Object(e$1) !== e$1)
            throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
          if (r$1)
            var o = e$1[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
          if (o === undefined && (o = e$1[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r$1))
            var t = o;
          if (typeof o != "function")
            throw new TypeError("Object is not disposable.");
          t && (o = function o$1() {
            try {
              t.call(e$1);
            } catch (r$2) {
              return Promise.reject(r$2);
            }
          }), n.push({
            v: e$1,
            d: o,
            a: r$1
          });
        } else
          r$1 && n.push({
            d: e$1,
            a: r$1
          });
        return e$1;
      }
      return {
        e,
        u: using.bind(null, false),
        a: using.bind(null, true),
        d: function d() {
          var o, t = this.e, s = 0;
          function next() {
            for (;o = n.pop(); )
              try {
                if (!o.a && s === 1)
                  return s = 0, n.push(o), Promise.resolve().then(next);
                if (o.d) {
                  var r$1 = o.d.call(o.v);
                  if (o.a)
                    return s |= 2, Promise.resolve(r$1).then(next, err);
                } else
                  s |= 1;
              } catch (r$2) {
                return err(r$2);
              }
            if (s === 1)
              return t !== e ? Promise.reject(t) : Promise.resolve();
            if (t !== e)
              throw t;
          }
          function err(n$1) {
            return t = t !== e ? new r(n$1, t) : n$1, next();
          }
          return next();
        }
      };
    }
    module.exports = _usingCtx, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_OverloadYield = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js"(exports, module) {
    function _OverloadYield(e, d) {
      this.v = e, this.k = d;
    }
    module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_awaitAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js"(exports, module) {
    var OverloadYield$2 = require_OverloadYield();
    function _awaitAsyncGenerator$5(e) {
      return new OverloadYield$2(e, 0);
    }
    module.exports = _awaitAsyncGenerator$5, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_wrapAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js"(exports, module) {
    var OverloadYield$1 = require_OverloadYield();
    function _wrapAsyncGenerator$6(e) {
      return function() {
        return new AsyncGenerator(e.apply(this, arguments));
      };
    }
    function AsyncGenerator(e) {
      var r, t;
      function resume(r$1, t$1) {
        try {
          var n = e[r$1](t$1), o = n.value, u = o instanceof OverloadYield$1;
          Promise.resolve(u ? o.v : o).then(function(t$2) {
            if (u) {
              var i = r$1 === "return" ? "return" : "next";
              if (!o.k || t$2.done)
                return resume(i, t$2);
              t$2 = e[i](t$2).value;
            }
            settle(n.done ? "return" : "normal", t$2);
          }, function(e$1) {
            resume("throw", e$1);
          });
        } catch (e$1) {
          settle("throw", e$1);
        }
      }
      function settle(e$1, n) {
        switch (e$1) {
          case "return":
            r.resolve({
              value: n,
              done: true
            });
            break;
          case "throw":
            r.reject(n);
            break;
          default:
            r.resolve({
              value: n,
              done: false
            });
        }
        (r = r.next) ? resume(r.key, r.arg) : t = null;
      }
      this._invoke = function(e$1, n) {
        return new Promise(function(o, u) {
          var i = {
            key: e$1,
            arg: n,
            resolve: o,
            reject: u,
            next: null
          };
          t ? t = t.next = i : (r = t = i, resume(e$1, n));
        });
      }, typeof e["return"] != "function" && (this["return"] = undefined);
    }
    AsyncGenerator.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
      return this;
    }, AsyncGenerator.prototype.next = function(e) {
      return this._invoke("next", e);
    }, AsyncGenerator.prototype["throw"] = function(e) {
      return this._invoke("throw", e);
    }, AsyncGenerator.prototype["return"] = function(e) {
      return this._invoke("return", e);
    };
    module.exports = _wrapAsyncGenerator$6, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_usingCtx$4 = __toESM(require_usingCtx(), 1);
  var import_awaitAsyncGenerator$4 = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator$5 = __toESM(require_wrapAsyncGenerator(), 1);
  function iteratorResource(iterable) {
    const iterator = iterable[Symbol.asyncIterator]();
    if (iterator[Symbol.asyncDispose])
      return iterator;
    return makeAsyncResource(iterator, async () => {
      var _iterator$return;
      await ((_iterator$return = iterator.return) === null || _iterator$return === undefined ? undefined : _iterator$return.call(iterator));
    });
  }
  function withMaxDuration(_x, _x2) {
    return _withMaxDuration.apply(this, arguments);
  }
  function _withMaxDuration() {
    _withMaxDuration = (0, import_wrapAsyncGenerator$5.default)(function* (iterable, opts) {
      try {
        var _usingCtx$1 = (0, import_usingCtx$4.default)();
        const iterator = _usingCtx$1.a(iteratorResource(iterable));
        const timer = _usingCtx$1.u(timerResource(opts.maxDurationMs));
        const timerPromise = timer.start();
        let result;
        while (true) {
          result = yield (0, import_awaitAsyncGenerator$4.default)(Unpromise.race([iterator.next(), timerPromise]));
          if (result === disposablePromiseTimerResult)
            throwAbortError();
          if (result.done)
            return result;
          yield result.value;
          result = null;
        }
      } catch (_) {
        _usingCtx$1.e = _;
      } finally {
        yield (0, import_awaitAsyncGenerator$4.default)(_usingCtx$1.d());
      }
    });
    return _withMaxDuration.apply(this, arguments);
  }
  function takeWithGrace(_x3, _x4) {
    return _takeWithGrace.apply(this, arguments);
  }
  function _takeWithGrace() {
    _takeWithGrace = (0, import_wrapAsyncGenerator$5.default)(function* (iterable, opts) {
      try {
        var _usingCtx3 = (0, import_usingCtx$4.default)();
        const iterator = _usingCtx3.a(iteratorResource(iterable));
        let result;
        const timer = _usingCtx3.u(timerResource(opts.gracePeriodMs));
        let count = opts.count;
        let timerPromise = new Promise(() => {});
        while (true) {
          result = yield (0, import_awaitAsyncGenerator$4.default)(Unpromise.race([iterator.next(), timerPromise]));
          if (result === disposablePromiseTimerResult)
            throwAbortError();
          if (result.done)
            return result.value;
          yield result.value;
          if (--count === 0)
            timerPromise = timer.start();
          result = null;
        }
      } catch (_) {
        _usingCtx3.e = _;
      } finally {
        yield (0, import_awaitAsyncGenerator$4.default)(_usingCtx3.d());
      }
    });
    return _takeWithGrace.apply(this, arguments);
  }
  function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  var import_usingCtx$3 = __toESM(require_usingCtx(), 1);
  var import_awaitAsyncGenerator$3 = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator$4 = __toESM(require_wrapAsyncGenerator(), 1);
  function createManagedIterator(iterable, onResult) {
    const iterator = iterable[Symbol.asyncIterator]();
    let state = "idle";
    function cleanup() {
      state = "done";
      onResult = () => {};
    }
    function pull() {
      if (state !== "idle")
        return;
      state = "pending";
      const next = iterator.next();
      next.then((result) => {
        if (result.done) {
          state = "done";
          onResult({
            status: "return",
            value: result.value
          });
          cleanup();
          return;
        }
        state = "idle";
        onResult({
          status: "yield",
          value: result.value
        });
      }).catch((cause) => {
        onResult({
          status: "error",
          error: cause
        });
        cleanup();
      });
    }
    return {
      pull,
      destroy: async () => {
        var _iterator$return;
        cleanup();
        await ((_iterator$return = iterator.return) === null || _iterator$return === undefined ? undefined : _iterator$return.call(iterator));
      }
    };
  }
  function mergeAsyncIterables() {
    let state = "idle";
    let flushSignal = createDeferred();
    const iterables = [];
    const iterators = /* @__PURE__ */ new Set;
    const buffer = [];
    function initIterable(iterable) {
      if (state !== "pending")
        return;
      const iterator = createManagedIterator(iterable, (result) => {
        if (state !== "pending")
          return;
        switch (result.status) {
          case "yield":
            buffer.push([iterator, result]);
            break;
          case "return":
            iterators.delete(iterator);
            break;
          case "error":
            buffer.push([iterator, result]);
            iterators.delete(iterator);
            break;
        }
        flushSignal.resolve();
      });
      iterators.add(iterator);
      iterator.pull();
    }
    return {
      add(iterable) {
        switch (state) {
          case "idle":
            iterables.push(iterable);
            break;
          case "pending":
            initIterable(iterable);
            break;
          case "done":
            break;
        }
      },
      [Symbol.asyncIterator]() {
        return (0, import_wrapAsyncGenerator$4.default)(function* () {
          try {
            var _usingCtx$1 = (0, import_usingCtx$3.default)();
            if (state !== "idle")
              throw new Error("Cannot iterate twice");
            state = "pending";
            const _finally = _usingCtx$1.a(makeAsyncResource({}, async () => {
              state = "done";
              const errors = [];
              await Promise.all(Array.from(iterators.values()).map(async (it) => {
                try {
                  await it.destroy();
                } catch (cause) {
                  errors.push(cause);
                }
              }));
              buffer.length = 0;
              iterators.clear();
              flushSignal.resolve();
              if (errors.length > 0)
                throw new AggregateError(errors);
            }));
            while (iterables.length > 0)
              initIterable(iterables.shift());
            while (iterators.size > 0) {
              yield (0, import_awaitAsyncGenerator$3.default)(flushSignal.promise);
              while (buffer.length > 0) {
                const [iterator, result] = buffer.shift();
                switch (result.status) {
                  case "yield":
                    yield result.value;
                    iterator.pull();
                    break;
                  case "error":
                    throw result.error;
                }
              }
              flushSignal = createDeferred();
            }
          } catch (_) {
            _usingCtx$1.e = _;
          } finally {
            yield (0, import_awaitAsyncGenerator$3.default)(_usingCtx$1.d());
          }
        })();
      }
    };
  }
  function readableStreamFrom(iterable) {
    const iterator = iterable[Symbol.asyncIterator]();
    return new ReadableStream({
      async cancel() {
        var _iterator$return;
        await ((_iterator$return = iterator.return) === null || _iterator$return === undefined ? undefined : _iterator$return.call(iterator));
      },
      async pull(controller) {
        const result = await iterator.next();
        if (result.done) {
          controller.close();
          return;
        }
        controller.enqueue(result.value);
      }
    });
  }
  var import_usingCtx$2 = __toESM(require_usingCtx(), 1);
  var import_awaitAsyncGenerator$2 = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator$3 = __toESM(require_wrapAsyncGenerator(), 1);
  var PING_SYM = Symbol("ping");
  function withPing(_x, _x2) {
    return _withPing.apply(this, arguments);
  }
  function _withPing() {
    _withPing = (0, import_wrapAsyncGenerator$3.default)(function* (iterable, pingIntervalMs) {
      try {
        var _usingCtx$1 = (0, import_usingCtx$2.default)();
        const iterator = _usingCtx$1.a(iteratorResource(iterable));
        let result;
        let nextPromise = iterator.next();
        while (true)
          try {
            var _usingCtx3 = (0, import_usingCtx$2.default)();
            const pingPromise = _usingCtx3.u(timerResource(pingIntervalMs));
            result = yield (0, import_awaitAsyncGenerator$2.default)(Unpromise.race([nextPromise, pingPromise.start()]));
            if (result === disposablePromiseTimerResult) {
              yield PING_SYM;
              continue;
            }
            if (result.done)
              return result.value;
            nextPromise = iterator.next();
            yield result.value;
            result = null;
          } catch (_) {
            _usingCtx3.e = _;
          } finally {
            _usingCtx3.d();
          }
      } catch (_) {
        _usingCtx$1.e = _;
      } finally {
        yield (0, import_awaitAsyncGenerator$2.default)(_usingCtx$1.d());
      }
    });
    return _withPing.apply(this, arguments);
  }
  var require_asyncIterator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js"(exports, module) {
    function _asyncIterator$2(r) {
      var n, t, o, e = 2;
      for (typeof Symbol != "undefined" && (t = Symbol.asyncIterator, o = Symbol.iterator);e--; ) {
        if (t && (n = r[t]) != null)
          return n.call(r);
        if (o && (n = r[o]) != null)
          return new AsyncFromSyncIterator(n.call(r));
        t = "@@asyncIterator", o = "@@iterator";
      }
      throw new TypeError("Object is not async iterable");
    }
    function AsyncFromSyncIterator(r) {
      function AsyncFromSyncIteratorContinuation(r$1) {
        if (Object(r$1) !== r$1)
          return Promise.reject(new TypeError(r$1 + " is not an object."));
        var n = r$1.done;
        return Promise.resolve(r$1.value).then(function(r$2) {
          return {
            value: r$2,
            done: n
          };
        });
      }
      return AsyncFromSyncIterator = function AsyncFromSyncIterator$1(r$1) {
        this.s = r$1, this.n = r$1.next;
      }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function next() {
          return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function _return(r$1) {
          var n = this.s["return"];
          return n === undefined ? Promise.resolve({
            value: r$1,
            done: true
          }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        },
        throw: function _throw(r$1) {
          var n = this.s["return"];
          return n === undefined ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        }
      }, new AsyncFromSyncIterator(r);
    }
    module.exports = _asyncIterator$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_awaitAsyncGenerator$1 = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator$2 = __toESM(require_wrapAsyncGenerator(), 1);
  var import_usingCtx$1 = __toESM(require_usingCtx(), 1);
  var import_asyncIterator$1 = __toESM(require_asyncIterator(), 1);
  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  var CHUNK_VALUE_TYPE_PROMISE = 0;
  var CHUNK_VALUE_TYPE_ASYNC_ITERABLE = 1;
  var PROMISE_STATUS_FULFILLED = 0;
  var PROMISE_STATUS_REJECTED = 1;
  var ASYNC_ITERABLE_STATUS_RETURN = 0;
  var ASYNC_ITERABLE_STATUS_YIELD = 1;
  var ASYNC_ITERABLE_STATUS_ERROR = 2;
  function isPromise(value) {
    return (isObject(value) || isFunction(value)) && typeof (value === null || value === undefined ? undefined : value["then"]) === "function" && typeof (value === null || value === undefined ? undefined : value["catch"]) === "function";
  }
  var MaxDepthError = class extends Error {
    constructor(path) {
      super("Max depth reached at path: " + path.join("."));
      this.path = path;
    }
  };
  function createBatchStreamProducer(_x3) {
    return _createBatchStreamProducer.apply(this, arguments);
  }
  function _createBatchStreamProducer() {
    _createBatchStreamProducer = (0, import_wrapAsyncGenerator$2.default)(function* (opts) {
      const { data } = opts;
      let counter = 0;
      const placeholder = 0;
      const mergedIterables = mergeAsyncIterables();
      function registerAsync(callback) {
        const idx = counter++;
        const iterable$1 = callback(idx);
        mergedIterables.add(iterable$1);
        return idx;
      }
      function encodePromise(promise, path) {
        return registerAsync(/* @__PURE__ */ function() {
          var _ref = (0, import_wrapAsyncGenerator$2.default)(function* (idx) {
            const error = checkMaxDepth(path);
            if (error) {
              promise.catch((cause) => {
                var _opts$onError;
                (_opts$onError = opts.onError) === null || _opts$onError === undefined || _opts$onError.call(opts, {
                  error: cause,
                  path
                });
              });
              promise = Promise.reject(error);
            }
            try {
              const next = yield (0, import_awaitAsyncGenerator$1.default)(promise);
              yield [
                idx,
                PROMISE_STATUS_FULFILLED,
                encode(next, path)
              ];
            } catch (cause) {
              var _opts$onError2, _opts$formatError;
              (_opts$onError2 = opts.onError) === null || _opts$onError2 === undefined || _opts$onError2.call(opts, {
                error: cause,
                path
              });
              yield [
                idx,
                PROMISE_STATUS_REJECTED,
                (_opts$formatError = opts.formatError) === null || _opts$formatError === undefined ? undefined : _opts$formatError.call(opts, {
                  error: cause,
                  path
                })
              ];
            }
          });
          return function(_x) {
            return _ref.apply(this, arguments);
          };
        }());
      }
      function encodeAsyncIterable(iterable$1, path) {
        return registerAsync(/* @__PURE__ */ function() {
          var _ref2 = (0, import_wrapAsyncGenerator$2.default)(function* (idx) {
            try {
              var _usingCtx$1 = (0, import_usingCtx$1.default)();
              const error = checkMaxDepth(path);
              if (error)
                throw error;
              const iterator = _usingCtx$1.a(iteratorResource(iterable$1));
              try {
                while (true) {
                  const next = yield (0, import_awaitAsyncGenerator$1.default)(iterator.next());
                  if (next.done) {
                    yield [
                      idx,
                      ASYNC_ITERABLE_STATUS_RETURN,
                      encode(next.value, path)
                    ];
                    break;
                  }
                  yield [
                    idx,
                    ASYNC_ITERABLE_STATUS_YIELD,
                    encode(next.value, path)
                  ];
                }
              } catch (cause) {
                var _opts$onError3, _opts$formatError2;
                (_opts$onError3 = opts.onError) === null || _opts$onError3 === undefined || _opts$onError3.call(opts, {
                  error: cause,
                  path
                });
                yield [
                  idx,
                  ASYNC_ITERABLE_STATUS_ERROR,
                  (_opts$formatError2 = opts.formatError) === null || _opts$formatError2 === undefined ? undefined : _opts$formatError2.call(opts, {
                    error: cause,
                    path
                  })
                ];
              }
            } catch (_) {
              _usingCtx$1.e = _;
            } finally {
              yield (0, import_awaitAsyncGenerator$1.default)(_usingCtx$1.d());
            }
          });
          return function(_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      }
      function checkMaxDepth(path) {
        if (opts.maxDepth && path.length > opts.maxDepth)
          return new MaxDepthError(path);
        return null;
      }
      function encodeAsync(value, path) {
        if (isPromise(value))
          return [CHUNK_VALUE_TYPE_PROMISE, encodePromise(value, path)];
        if (isAsyncIterable(value)) {
          if (opts.maxDepth && path.length >= opts.maxDepth)
            throw new Error("Max depth reached");
          return [CHUNK_VALUE_TYPE_ASYNC_ITERABLE, encodeAsyncIterable(value, path)];
        }
        return null;
      }
      function encode(value, path) {
        if (value === undefined)
          return [[]];
        const reg = encodeAsync(value, path);
        if (reg)
          return [[placeholder], [null, ...reg]];
        if (!isPlainObject(value))
          return [[value]];
        const newObj = {};
        const asyncValues = [];
        for (const [key, item] of Object.entries(value)) {
          const transformed = encodeAsync(item, [...path, key]);
          if (!transformed) {
            newObj[key] = item;
            continue;
          }
          newObj[key] = placeholder;
          asyncValues.push([key, ...transformed]);
        }
        return [[newObj], ...asyncValues];
      }
      const newHead = {};
      for (const [key, item] of Object.entries(data))
        newHead[key] = encode(item, [key]);
      yield newHead;
      let iterable = mergedIterables;
      if (opts.pingMs)
        iterable = withPing(mergedIterables, opts.pingMs);
      var _iteratorAbruptCompletion = false;
      var _didIteratorError = false;
      var _iteratorError;
      try {
        for (var _iterator = (0, import_asyncIterator$1.default)(iterable), _step;_iteratorAbruptCompletion = !(_step = yield (0, import_awaitAsyncGenerator$1.default)(_iterator.next())).done; _iteratorAbruptCompletion = false) {
          const value = _step.value;
          yield value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion && _iterator.return != null)
            yield (0, import_awaitAsyncGenerator$1.default)(_iterator.return());
        } finally {
          if (_didIteratorError)
            throw _iteratorError;
        }
      }
    });
    return _createBatchStreamProducer.apply(this, arguments);
  }
  function jsonlStreamProducer(opts) {
    let stream = readableStreamFrom(createBatchStreamProducer(opts));
    const { serialize } = opts;
    if (serialize)
      stream = stream.pipeThrough(new TransformStream({ transform(chunk, controller) {
        if (chunk === PING_SYM)
          controller.enqueue(PING_SYM);
        else
          controller.enqueue(serialize(chunk));
      } }));
    return stream.pipeThrough(new TransformStream({ transform(chunk, controller) {
      if (chunk === PING_SYM)
        controller.enqueue(" ");
      else
        controller.enqueue(JSON.stringify(chunk) + `
`);
    } })).pipeThrough(new TextEncoderStream);
  }
  var require_asyncGeneratorDelegate = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncGeneratorDelegate.js"(exports, module) {
    var OverloadYield = require_OverloadYield();
    function _asyncGeneratorDelegate$1(t) {
      var e = {}, n = false;
      function pump(e$1, r) {
        return n = true, r = new Promise(function(n$1) {
          n$1(t[e$1](r));
        }), {
          done: false,
          value: new OverloadYield(r, 1)
        };
      }
      return e[typeof Symbol != "undefined" && Symbol.iterator || "@@iterator"] = function() {
        return this;
      }, e.next = function(t$1) {
        return n ? (n = false, t$1) : pump("next", t$1);
      }, typeof t["throw"] == "function" && (e["throw"] = function(t$1) {
        if (n)
          throw n = false, t$1;
        return pump("throw", t$1);
      }), typeof t["return"] == "function" && (e["return"] = function(t$1) {
        return n ? (n = false, t$1) : pump("return", t$1);
      }), e;
    }
    module.exports = _asyncGeneratorDelegate$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_asyncIterator = __toESM(require_asyncIterator(), 1);
  var import_awaitAsyncGenerator = __toESM(require_awaitAsyncGenerator(), 1);
  var import_wrapAsyncGenerator$1 = __toESM(require_wrapAsyncGenerator(), 1);
  var import_asyncGeneratorDelegate = __toESM(require_asyncGeneratorDelegate(), 1);
  var import_usingCtx = __toESM(require_usingCtx(), 1);
  var PING_EVENT = "ping";
  var SERIALIZED_ERROR_EVENT = "serialized-error";
  var CONNECTED_EVENT = "connected";
  var RETURN_EVENT = "return";
  function sseStreamProducer(opts) {
    var _opts$ping$enabled, _opts$ping, _opts$ping$intervalMs, _opts$ping2, _opts$client;
    const { serialize = identity } = opts;
    const ping = {
      enabled: (_opts$ping$enabled = (_opts$ping = opts.ping) === null || _opts$ping === undefined ? undefined : _opts$ping.enabled) !== null && _opts$ping$enabled !== undefined ? _opts$ping$enabled : false,
      intervalMs: (_opts$ping$intervalMs = (_opts$ping2 = opts.ping) === null || _opts$ping2 === undefined ? undefined : _opts$ping2.intervalMs) !== null && _opts$ping$intervalMs !== undefined ? _opts$ping$intervalMs : 1000
    };
    const client = (_opts$client = opts.client) !== null && _opts$client !== undefined ? _opts$client : {};
    if (ping.enabled && client.reconnectAfterInactivityMs && ping.intervalMs > client.reconnectAfterInactivityMs)
      throw new Error(`Ping interval must be less than client reconnect interval to prevent unnecessary reconnection - ping.intervalMs: ${ping.intervalMs} client.reconnectAfterInactivityMs: ${client.reconnectAfterInactivityMs}`);
    function generator() {
      return _generator.apply(this, arguments);
    }
    function _generator() {
      _generator = (0, import_wrapAsyncGenerator$1.default)(function* () {
        yield {
          event: CONNECTED_EVENT,
          data: JSON.stringify(client)
        };
        let iterable = opts.data;
        if (opts.emitAndEndImmediately)
          iterable = takeWithGrace(iterable, {
            count: 1,
            gracePeriodMs: 1
          });
        if (opts.maxDurationMs && opts.maxDurationMs > 0 && opts.maxDurationMs !== Infinity)
          iterable = withMaxDuration(iterable, { maxDurationMs: opts.maxDurationMs });
        if (ping.enabled && ping.intervalMs !== Infinity && ping.intervalMs > 0)
          iterable = withPing(iterable, ping.intervalMs);
        let value;
        let chunk;
        var _iteratorAbruptCompletion = false;
        var _didIteratorError = false;
        var _iteratorError;
        try {
          for (var _iterator = (0, import_asyncIterator.default)(iterable), _step;_iteratorAbruptCompletion = !(_step = yield (0, import_awaitAsyncGenerator.default)(_iterator.next())).done; _iteratorAbruptCompletion = false) {
            value = _step.value;
            {
              if (value === PING_SYM) {
                yield {
                  event: PING_EVENT,
                  data: ""
                };
                continue;
              }
              chunk = isTrackedEnvelope(value) ? {
                id: value[0],
                data: value[1]
              } : { data: value };
              chunk.data = JSON.stringify(serialize(chunk.data));
              yield chunk;
              value = null;
              chunk = null;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion && _iterator.return != null)
              yield (0, import_awaitAsyncGenerator.default)(_iterator.return());
          } finally {
            if (_didIteratorError)
              throw _iteratorError;
          }
        }
      });
      return _generator.apply(this, arguments);
    }
    function generatorWithErrorHandling() {
      return _generatorWithErrorHandling.apply(this, arguments);
    }
    function _generatorWithErrorHandling() {
      _generatorWithErrorHandling = (0, import_wrapAsyncGenerator$1.default)(function* () {
        try {
          yield* (0, import_asyncGeneratorDelegate.default)((0, import_asyncIterator.default)(generator()));
          yield {
            event: RETURN_EVENT,
            data: ""
          };
        } catch (cause) {
          var _opts$formatError, _opts$formatError2;
          if (isAbortError(cause))
            return;
          const error = getTRPCErrorFromUnknown(cause);
          const data = (_opts$formatError = (_opts$formatError2 = opts.formatError) === null || _opts$formatError2 === undefined ? undefined : _opts$formatError2.call(opts, { error })) !== null && _opts$formatError !== undefined ? _opts$formatError : null;
          yield {
            event: SERIALIZED_ERROR_EVENT,
            data: JSON.stringify(serialize(data))
          };
        }
      });
      return _generatorWithErrorHandling.apply(this, arguments);
    }
    const stream = readableStreamFrom(generatorWithErrorHandling());
    return stream.pipeThrough(new TransformStream({ transform(chunk, controller) {
      if ("event" in chunk)
        controller.enqueue(`event: ${chunk.event}
`);
      if ("data" in chunk)
        controller.enqueue(`data: ${chunk.data}
`);
      if ("id" in chunk)
        controller.enqueue(`id: ${chunk.id}
`);
      if ("comment" in chunk)
        controller.enqueue(`: ${chunk.comment}
`);
      controller.enqueue(`

`);
    } })).pipeThrough(new TextEncoderStream);
  }
  var sseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "X-Accel-Buffering": "no",
    Connection: "keep-alive"
  };
  var import_wrapAsyncGenerator = __toESM(require_wrapAsyncGenerator(), 1);
  var import_objectSpread23 = __toESM(require_objectSpread2(), 1);
  function errorToAsyncIterable(err) {
    return run((0, import_wrapAsyncGenerator.default)(function* () {
      throw err;
    }));
  }
  var TYPE_ACCEPTED_METHOD_MAP = {
    mutation: ["POST"],
    query: ["GET"],
    subscription: ["GET"]
  };
  var TYPE_ACCEPTED_METHOD_MAP_WITH_METHOD_OVERRIDE = {
    mutation: ["POST"],
    query: ["GET", "POST"],
    subscription: ["GET", "POST"]
  };
  function initResponse(initOpts) {
    var _responseMeta, _info$calls$find$proc, _info$calls$find;
    const { ctx, info, responseMeta, untransformedJSON, errors = [], headers } = initOpts;
    let status = untransformedJSON ? getHTTPStatusCode(untransformedJSON) : 200;
    const eagerGeneration = !untransformedJSON;
    const data = eagerGeneration ? [] : Array.isArray(untransformedJSON) ? untransformedJSON : [untransformedJSON];
    const meta = (_responseMeta = responseMeta === null || responseMeta === undefined ? undefined : responseMeta({
      ctx,
      info,
      paths: info === null || info === undefined ? undefined : info.calls.map((call) => call.path),
      data,
      errors,
      eagerGeneration,
      type: (_info$calls$find$proc = info === null || info === undefined || (_info$calls$find = info.calls.find((call) => {
        var _call$procedure;
        return (_call$procedure = call.procedure) === null || _call$procedure === undefined ? undefined : _call$procedure._def.type;
      })) === null || _info$calls$find === undefined || (_info$calls$find = _info$calls$find.procedure) === null || _info$calls$find === undefined ? undefined : _info$calls$find._def.type) !== null && _info$calls$find$proc !== undefined ? _info$calls$find$proc : "unknown"
    })) !== null && _responseMeta !== undefined ? _responseMeta : {};
    if (meta.headers) {
      if (meta.headers instanceof Headers)
        for (const [key, value] of meta.headers.entries())
          headers.append(key, value);
      else
        for (const [key, value] of Object.entries(meta.headers))
          if (Array.isArray(value))
            for (const v of value)
              headers.append(key, v);
          else if (typeof value === "string")
            headers.set(key, value);
    }
    if (meta.status)
      status = meta.status;
    return { status };
  }
  function caughtErrorToData(cause, errorOpts) {
    const { router, req, onError } = errorOpts.opts;
    const error = getTRPCErrorFromUnknown(cause);
    onError === null || onError === undefined || onError({
      error,
      path: errorOpts.path,
      input: errorOpts.input,
      ctx: errorOpts.ctx,
      type: errorOpts.type,
      req
    });
    const untransformedJSON = { error: getErrorShape({
      config: router._def._config,
      error,
      type: errorOpts.type,
      path: errorOpts.path,
      input: errorOpts.input,
      ctx: errorOpts.ctx
    }) };
    const transformedJSON = transformTRPCResponse(router._def._config, untransformedJSON);
    const body = JSON.stringify(transformedJSON);
    return {
      error,
      untransformedJSON,
      body
    };
  }
  function isDataStream(v) {
    if (!isObject(v))
      return false;
    if (isAsyncIterable(v))
      return true;
    return Object.values(v).some(isPromise) || Object.values(v).some(isAsyncIterable);
  }
  async function resolveResponse(opts) {
    var _ref, _opts$allowBatching, _opts$batching, _opts$allowMethodOver, _config$sse$enabled, _config$sse;
    const { router, req } = opts;
    const headers = new Headers([["vary", "trpc-accept"]]);
    const config = router._def._config;
    const url = new URL(req.url);
    if (req.method === "HEAD")
      return new Response(null, { status: 204 });
    const allowBatching = (_ref = (_opts$allowBatching = opts.allowBatching) !== null && _opts$allowBatching !== undefined ? _opts$allowBatching : (_opts$batching = opts.batching) === null || _opts$batching === undefined ? undefined : _opts$batching.enabled) !== null && _ref !== undefined ? _ref : true;
    const allowMethodOverride = ((_opts$allowMethodOver = opts.allowMethodOverride) !== null && _opts$allowMethodOver !== undefined ? _opts$allowMethodOver : false) && req.method === "POST";
    const infoTuple = await run(async () => {
      try {
        return [undefined, await getRequestInfo({
          req,
          path: decodeURIComponent(opts.path),
          router,
          searchParams: url.searchParams,
          headers: opts.req.headers,
          url
        })];
      } catch (cause) {
        return [getTRPCErrorFromUnknown(cause), undefined];
      }
    });
    const ctxManager = run(() => {
      let result = undefined;
      return {
        valueOrUndefined: () => {
          if (!result)
            return;
          return result[1];
        },
        value: () => {
          const [err, ctx] = result;
          if (err)
            throw err;
          return ctx;
        },
        create: async (info) => {
          if (result)
            throw new Error("This should only be called once - report a bug in tRPC");
          try {
            const ctx = await opts.createContext({ info });
            result = [undefined, ctx];
          } catch (cause) {
            result = [getTRPCErrorFromUnknown(cause), undefined];
          }
        }
      };
    });
    const methodMapper = allowMethodOverride ? TYPE_ACCEPTED_METHOD_MAP_WITH_METHOD_OVERRIDE : TYPE_ACCEPTED_METHOD_MAP;
    const isStreamCall = req.headers.get("trpc-accept") === "application/jsonl";
    const experimentalSSE = (_config$sse$enabled = (_config$sse = config.sse) === null || _config$sse === undefined ? undefined : _config$sse.enabled) !== null && _config$sse$enabled !== undefined ? _config$sse$enabled : true;
    try {
      const [infoError, info] = infoTuple;
      if (infoError)
        throw infoError;
      if (info.isBatchCall && !allowBatching)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Batching is not enabled on the server`
        });
      if (isStreamCall && !info.isBatchCall)
        throw new TRPCError({
          message: `Streaming requests must be batched (you can do a batch of 1)`,
          code: "BAD_REQUEST"
        });
      await ctxManager.create(info);
      const rpcCalls = info.calls.map(async (call) => {
        const proc = call.procedure;
        try {
          if (opts.error)
            throw opts.error;
          if (!proc)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `No procedure found on path "${call.path}"`
            });
          if (!methodMapper[proc._def.type].includes(req.method))
            throw new TRPCError({
              code: "METHOD_NOT_SUPPORTED",
              message: `Unsupported ${req.method}-request to ${proc._def.type} procedure at path "${call.path}"`
            });
          if (proc._def.type === "subscription") {
            if (info.isBatchCall)
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Cannot batch subscription calls`
              });
          }
          const data = await proc({
            path: call.path,
            getRawInput: call.getRawInput,
            ctx: ctxManager.value(),
            type: proc._def.type,
            signal: opts.req.signal
          });
          return [undefined, { data }];
        } catch (cause) {
          var _opts$onError, _call$procedure$_def$, _call$procedure2;
          const error = getTRPCErrorFromUnknown(cause);
          const input = call.result();
          (_opts$onError = opts.onError) === null || _opts$onError === undefined || _opts$onError.call(opts, {
            error,
            path: call.path,
            input,
            ctx: ctxManager.valueOrUndefined(),
            type: (_call$procedure$_def$ = (_call$procedure2 = call.procedure) === null || _call$procedure2 === undefined ? undefined : _call$procedure2._def.type) !== null && _call$procedure$_def$ !== undefined ? _call$procedure$_def$ : "unknown",
            req: opts.req
          });
          return [error, undefined];
        }
      });
      if (!info.isBatchCall) {
        const [call] = info.calls;
        const [error, result] = await rpcCalls[0];
        switch (info.type) {
          case "unknown":
          case "mutation":
          case "query": {
            headers.set("content-type", "application/json");
            if (isDataStream(result === null || result === undefined ? undefined : result.data))
              throw new TRPCError({
                code: "UNSUPPORTED_MEDIA_TYPE",
                message: "Cannot use stream-like response in non-streaming request - use httpBatchStreamLink"
              });
            const res = error ? { error: getErrorShape({
              config,
              ctx: ctxManager.valueOrUndefined(),
              error,
              input: call.result(),
              path: call.path,
              type: info.type
            }) } : { result: { data: result.data } };
            const headResponse$1 = initResponse({
              ctx: ctxManager.valueOrUndefined(),
              info,
              responseMeta: opts.responseMeta,
              errors: error ? [error] : [],
              headers,
              untransformedJSON: [res]
            });
            return new Response(JSON.stringify(transformTRPCResponse(config, res)), {
              status: headResponse$1.status,
              headers
            });
          }
          case "subscription": {
            const iterable = run(() => {
              if (error)
                return errorToAsyncIterable(error);
              if (!experimentalSSE)
                return errorToAsyncIterable(new TRPCError({
                  code: "METHOD_NOT_SUPPORTED",
                  message: 'Missing experimental flag "sseSubscriptions"'
                }));
              if (!isObservable(result.data) && !isAsyncIterable(result.data))
                return errorToAsyncIterable(new TRPCError({
                  message: `Subscription ${call.path} did not return an observable or a AsyncGenerator`,
                  code: "INTERNAL_SERVER_ERROR"
                }));
              const dataAsIterable = isObservable(result.data) ? observableToAsyncIterable(result.data, opts.req.signal) : result.data;
              return dataAsIterable;
            });
            const stream = sseStreamProducer((0, import_objectSpread23.default)((0, import_objectSpread23.default)({}, config.sse), {}, {
              data: iterable,
              serialize: (v) => config.transformer.output.serialize(v),
              formatError(errorOpts) {
                var _call$procedure$_def$2, _call$procedure3, _opts$onError2;
                const error$1 = getTRPCErrorFromUnknown(errorOpts.error);
                const input = call === null || call === undefined ? undefined : call.result();
                const path = call === null || call === undefined ? undefined : call.path;
                const type = (_call$procedure$_def$2 = call === null || call === undefined || (_call$procedure3 = call.procedure) === null || _call$procedure3 === undefined ? undefined : _call$procedure3._def.type) !== null && _call$procedure$_def$2 !== undefined ? _call$procedure$_def$2 : "unknown";
                (_opts$onError2 = opts.onError) === null || _opts$onError2 === undefined || _opts$onError2.call(opts, {
                  error: error$1,
                  path,
                  input,
                  ctx: ctxManager.valueOrUndefined(),
                  req: opts.req,
                  type
                });
                const shape = getErrorShape({
                  config,
                  ctx: ctxManager.valueOrUndefined(),
                  error: error$1,
                  input,
                  path,
                  type
                });
                return shape;
              }
            }));
            for (const [key, value] of Object.entries(sseHeaders))
              headers.set(key, value);
            const headResponse$1 = initResponse({
              ctx: ctxManager.valueOrUndefined(),
              info,
              responseMeta: opts.responseMeta,
              errors: [],
              headers,
              untransformedJSON: null
            });
            return new Response(stream, {
              headers,
              status: headResponse$1.status
            });
          }
        }
      }
      if (info.accept === "application/jsonl") {
        headers.set("content-type", "application/json");
        headers.set("transfer-encoding", "chunked");
        const headResponse$1 = initResponse({
          ctx: ctxManager.valueOrUndefined(),
          info,
          responseMeta: opts.responseMeta,
          errors: [],
          headers,
          untransformedJSON: null
        });
        const stream = jsonlStreamProducer((0, import_objectSpread23.default)((0, import_objectSpread23.default)({}, config.jsonl), {}, {
          maxDepth: Infinity,
          data: rpcCalls.map(async (res) => {
            const [error, result] = await res;
            const call = info.calls[0];
            if (error) {
              var _procedure$_def$type, _procedure;
              return { error: getErrorShape({
                config,
                ctx: ctxManager.valueOrUndefined(),
                error,
                input: call.result(),
                path: call.path,
                type: (_procedure$_def$type = (_procedure = call.procedure) === null || _procedure === undefined ? undefined : _procedure._def.type) !== null && _procedure$_def$type !== undefined ? _procedure$_def$type : "unknown"
              }) };
            }
            const iterable = isObservable(result.data) ? observableToAsyncIterable(result.data, opts.req.signal) : Promise.resolve(result.data);
            return { result: Promise.resolve({ data: iterable }) };
          }),
          serialize: config.transformer.output.serialize,
          onError: (cause) => {
            var _opts$onError3, _info$type;
            (_opts$onError3 = opts.onError) === null || _opts$onError3 === undefined || _opts$onError3.call(opts, {
              error: getTRPCErrorFromUnknown(cause),
              path: undefined,
              input: undefined,
              ctx: ctxManager.valueOrUndefined(),
              req: opts.req,
              type: (_info$type = info === null || info === undefined ? undefined : info.type) !== null && _info$type !== undefined ? _info$type : "unknown"
            });
          },
          formatError(errorOpts) {
            var _call$procedure$_def$3, _call$procedure4;
            const call = info === null || info === undefined ? undefined : info.calls[errorOpts.path[0]];
            const error = getTRPCErrorFromUnknown(errorOpts.error);
            const input = call === null || call === undefined ? undefined : call.result();
            const path = call === null || call === undefined ? undefined : call.path;
            const type = (_call$procedure$_def$3 = call === null || call === undefined || (_call$procedure4 = call.procedure) === null || _call$procedure4 === undefined ? undefined : _call$procedure4._def.type) !== null && _call$procedure$_def$3 !== undefined ? _call$procedure$_def$3 : "unknown";
            const shape = getErrorShape({
              config,
              ctx: ctxManager.valueOrUndefined(),
              error,
              input,
              path,
              type
            });
            return shape;
          }
        }));
        return new Response(stream, {
          headers,
          status: headResponse$1.status
        });
      }
      headers.set("content-type", "application/json");
      const results = (await Promise.all(rpcCalls)).map((res) => {
        const [error, result] = res;
        if (error)
          return res;
        if (isDataStream(result.data))
          return [new TRPCError({
            code: "UNSUPPORTED_MEDIA_TYPE",
            message: "Cannot use stream-like response in non-streaming request - use httpBatchStreamLink"
          }), undefined];
        return res;
      });
      const resultAsRPCResponse = results.map(([error, result], index) => {
        const call = info.calls[index];
        if (error) {
          var _call$procedure$_def$4, _call$procedure5;
          return { error: getErrorShape({
            config,
            ctx: ctxManager.valueOrUndefined(),
            error,
            input: call.result(),
            path: call.path,
            type: (_call$procedure$_def$4 = (_call$procedure5 = call.procedure) === null || _call$procedure5 === undefined ? undefined : _call$procedure5._def.type) !== null && _call$procedure$_def$4 !== undefined ? _call$procedure$_def$4 : "unknown"
          }) };
        }
        return { result: { data: result.data } };
      });
      const errors = results.map(([error]) => error).filter(Boolean);
      const headResponse = initResponse({
        ctx: ctxManager.valueOrUndefined(),
        info,
        responseMeta: opts.responseMeta,
        untransformedJSON: resultAsRPCResponse,
        errors,
        headers
      });
      return new Response(JSON.stringify(transformTRPCResponse(config, resultAsRPCResponse)), {
        status: headResponse.status,
        headers
      });
    } catch (cause) {
      var _info$type2;
      const [_infoError, info] = infoTuple;
      const ctx = ctxManager.valueOrUndefined();
      const { error, untransformedJSON, body } = caughtErrorToData(cause, {
        opts,
        ctx: ctxManager.valueOrUndefined(),
        type: (_info$type2 = info === null || info === undefined ? undefined : info.type) !== null && _info$type2 !== undefined ? _info$type2 : "unknown"
      });
      const headResponse = initResponse({
        ctx,
        info,
        responseMeta: opts.responseMeta,
        untransformedJSON,
        errors: [error],
        headers
      });
      return new Response(body, {
        status: headResponse.status,
        headers
      });
    }
  }

  // ../../node_modules/@trpc/server/dist/adapters/fetch/index.mjs
  var import_objectSpread24 = __toESM(require_objectSpread2(), 1);
  var trimSlashes = (path) => {
    path = path.startsWith("/") ? path.slice(1) : path;
    path = path.endsWith("/") ? path.slice(0, -1) : path;
    return path;
  };
  async function fetchRequestHandler(opts) {
    const resHeaders = new Headers;
    const createContext = async (innerOpts) => {
      var _opts$createContext;
      return (_opts$createContext = opts.createContext) === null || _opts$createContext === undefined ? undefined : _opts$createContext.call(opts, (0, import_objectSpread24.default)({
        req: opts.req,
        resHeaders
      }, innerOpts));
    };
    const url = new URL(opts.req.url);
    const pathname = trimSlashes(url.pathname);
    const endpoint = trimSlashes(opts.endpoint);
    const path = trimSlashes(pathname.slice(endpoint.length));
    return await resolveResponse((0, import_objectSpread24.default)((0, import_objectSpread24.default)({}, opts), {}, {
      req: opts.req,
      createContext,
      path,
      error: null,
      onError(o) {
        var _opts$onError;
        opts === null || opts === undefined || (_opts$onError = opts.onError) === null || _opts$onError === undefined || _opts$onError.call(opts, (0, import_objectSpread24.default)((0, import_objectSpread24.default)({}, o), {}, { req: opts.req }));
      },
      responseMeta(data) {
        var _opts$responseMeta;
        const meta = (_opts$responseMeta = opts.responseMeta) === null || _opts$responseMeta === undefined ? undefined : _opts$responseMeta.call(opts, data);
        if (meta === null || meta === undefined ? undefined : meta.headers) {
          if (meta.headers instanceof Headers)
            for (const [key, value] of meta.headers.entries())
              resHeaders.append(key, value);
          else
            for (const [key, value] of Object.entries(meta.headers))
              if (Array.isArray(value))
                for (const v of value)
                  resHeaders.append(key, v);
              else if (typeof value === "string")
                resHeaders.set(key, value);
        }
        return {
          headers: resHeaders,
          status: meta === null || meta === undefined ? undefined : meta.status
        };
      }
    }));
  }

  // ../../node_modules/@trpc/server/dist/initTRPC-IT_6ZYJd.mjs
  var import_objectSpread2$2 = __toESM(require_objectSpread2(), 1);
  var middlewareMarker = "middlewareMarker";
  function createMiddlewareFactory() {
    function createMiddlewareInner(middlewares) {
      return {
        _middlewares: middlewares,
        unstable_pipe(middlewareBuilderOrFn) {
          const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [middlewareBuilderOrFn];
          return createMiddlewareInner([...middlewares, ...pipedMiddleware]);
        }
      };
    }
    function createMiddleware(fn) {
      return createMiddlewareInner([fn]);
    }
    return createMiddleware;
  }
  function createInputMiddleware(parse) {
    const inputMiddleware = async function inputValidatorMiddleware(opts) {
      let parsedInput;
      const rawInput = await opts.getRawInput();
      try {
        parsedInput = await parse(rawInput);
      } catch (cause) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause
        });
      }
      const combinedInput = isObject(opts.input) && isObject(parsedInput) ? (0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, opts.input), parsedInput) : parsedInput;
      return opts.next({ input: combinedInput });
    };
    inputMiddleware._type = "input";
    return inputMiddleware;
  }
  function createOutputMiddleware(parse) {
    const outputMiddleware = async function outputValidatorMiddleware({ next }) {
      const result = await next();
      if (!result.ok)
        return result;
      try {
        const data = await parse(result.data);
        return (0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, result), {}, { data });
      } catch (cause) {
        throw new TRPCError({
          message: "Output validation failed",
          code: "INTERNAL_SERVER_ERROR",
          cause
        });
      }
    };
    outputMiddleware._type = "output";
    return outputMiddleware;
  }
  var import_defineProperty3 = __toESM(require_defineProperty(), 1);
  var StandardSchemaV1Error = class extends Error {
    constructor(issues) {
      var _issues$;
      super((_issues$ = issues[0]) === null || _issues$ === undefined ? undefined : _issues$.message);
      (0, import_defineProperty3.default)(this, "issues", undefined);
      this.name = "SchemaError";
      this.issues = issues;
    }
  };
  function getParseFn(procedureParser) {
    const parser = procedureParser;
    const isStandardSchema = "~standard" in parser;
    if (typeof parser === "function" && typeof parser.assert === "function")
      return parser.assert.bind(parser);
    if (typeof parser === "function" && !isStandardSchema)
      return parser;
    if (typeof parser.parseAsync === "function")
      return parser.parseAsync.bind(parser);
    if (typeof parser.parse === "function")
      return parser.parse.bind(parser);
    if (typeof parser.validateSync === "function")
      return parser.validateSync.bind(parser);
    if (typeof parser.create === "function")
      return parser.create.bind(parser);
    if (typeof parser.assert === "function")
      return (value) => {
        parser.assert(value);
        return value;
      };
    if (isStandardSchema)
      return async (value) => {
        const result = await parser["~standard"].validate(value);
        if (result.issues)
          throw new StandardSchemaV1Error(result.issues);
        return result.value;
      };
    throw new Error("Could not find a validator fn");
  }
  var require_objectWithoutPropertiesLoose = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutPropertiesLoose.js"(exports, module) {
    function _objectWithoutPropertiesLoose(r, e) {
      if (r == null)
        return {};
      var t = {};
      for (var n in r)
        if ({}.hasOwnProperty.call(r, n)) {
          if (e.includes(n))
            continue;
          t[n] = r[n];
        }
      return t;
    }
    module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var require_objectWithoutProperties = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutProperties.js"(exports, module) {
    var objectWithoutPropertiesLoose = require_objectWithoutPropertiesLoose();
    function _objectWithoutProperties$1(e, t) {
      if (e == null)
        return {};
      var o, r, i = objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var s = Object.getOwnPropertySymbols(e);
        for (r = 0;r < s.length; r++)
          o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    module.exports = _objectWithoutProperties$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } });
  var import_objectWithoutProperties = __toESM(require_objectWithoutProperties(), 1);
  var import_objectSpread2$13 = __toESM(require_objectSpread2(), 1);
  var _excluded = [
    "middlewares",
    "inputs",
    "meta"
  ];
  function createNewBuilder(def1, def2) {
    const { middlewares = [], inputs, meta } = def2, rest = (0, import_objectWithoutProperties.default)(def2, _excluded);
    return createBuilder((0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, mergeWithoutOverrides(def1, rest)), {}, {
      inputs: [...def1.inputs, ...inputs !== null && inputs !== undefined ? inputs : []],
      middlewares: [...def1.middlewares, ...middlewares],
      meta: def1.meta && meta ? (0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, def1.meta), meta) : meta !== null && meta !== undefined ? meta : def1.meta
    }));
  }
  function createBuilder(initDef = {}) {
    const _def = (0, import_objectSpread2$13.default)({
      procedure: true,
      inputs: [],
      middlewares: []
    }, initDef);
    const builder = {
      _def,
      input(input) {
        const parser = getParseFn(input);
        return createNewBuilder(_def, {
          inputs: [input],
          middlewares: [createInputMiddleware(parser)]
        });
      },
      output(output) {
        const parser = getParseFn(output);
        return createNewBuilder(_def, {
          output,
          middlewares: [createOutputMiddleware(parser)]
        });
      },
      meta(meta) {
        return createNewBuilder(_def, { meta });
      },
      use(middlewareBuilderOrFn) {
        const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [middlewareBuilderOrFn];
        return createNewBuilder(_def, { middlewares });
      },
      unstable_concat(builder$1) {
        return createNewBuilder(_def, builder$1._def);
      },
      concat(builder$1) {
        return createNewBuilder(_def, builder$1._def);
      },
      query(resolver) {
        return createResolver((0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, _def), {}, { type: "query" }), resolver);
      },
      mutation(resolver) {
        return createResolver((0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, _def), {}, { type: "mutation" }), resolver);
      },
      subscription(resolver) {
        return createResolver((0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, _def), {}, { type: "subscription" }), resolver);
      },
      experimental_caller(caller) {
        return createNewBuilder(_def, { caller });
      }
    };
    return builder;
  }
  function createResolver(_defIn, resolver) {
    const finalBuilder = createNewBuilder(_defIn, {
      resolver,
      middlewares: [async function resolveMiddleware(opts) {
        const data = await resolver(opts);
        return {
          marker: middlewareMarker,
          ok: true,
          data,
          ctx: opts.ctx
        };
      }]
    });
    const _def = (0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, finalBuilder._def), {}, {
      type: _defIn.type,
      experimental_caller: Boolean(finalBuilder._def.caller),
      meta: finalBuilder._def.meta,
      $types: null
    });
    const invoke = createProcedureCaller(finalBuilder._def);
    const callerOverride = finalBuilder._def.caller;
    if (!callerOverride)
      return invoke;
    const callerWrapper = async (...args) => {
      return await callerOverride({
        args,
        invoke,
        _def
      });
    };
    callerWrapper._def = _def;
    return callerWrapper;
  }
  var codeblock = `
This is a client-only function.
If you want to call this function on the server, see https://trpc.io/docs/v11/server/server-side-calls
`.trim();
  async function callRecursive(index, _def, opts) {
    try {
      const middleware = _def.middlewares[index];
      const result = await middleware((0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, opts), {}, {
        meta: _def.meta,
        input: opts.input,
        next(_nextOpts) {
          var _nextOpts$getRawInput;
          const nextOpts = _nextOpts;
          return callRecursive(index + 1, _def, (0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, opts), {}, {
            ctx: (nextOpts === null || nextOpts === undefined ? undefined : nextOpts.ctx) ? (0, import_objectSpread2$13.default)((0, import_objectSpread2$13.default)({}, opts.ctx), nextOpts.ctx) : opts.ctx,
            input: nextOpts && "input" in nextOpts ? nextOpts.input : opts.input,
            getRawInput: (_nextOpts$getRawInput = nextOpts === null || nextOpts === undefined ? undefined : nextOpts.getRawInput) !== null && _nextOpts$getRawInput !== undefined ? _nextOpts$getRawInput : opts.getRawInput
          }));
        }
      }));
      return result;
    } catch (cause) {
      return {
        ok: false,
        error: getTRPCErrorFromUnknown(cause),
        marker: middlewareMarker
      };
    }
  }
  function createProcedureCaller(_def) {
    async function procedure(opts) {
      if (!opts || !("getRawInput" in opts))
        throw new Error(codeblock);
      const result = await callRecursive(0, _def, opts);
      if (!result)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No result from middlewares - did you forget to `return next()`?"
        });
      if (!result.ok)
        throw result.error;
      return result.data;
    }
    procedure._def = _def;
    procedure.procedure = true;
    procedure.meta = _def.meta;
    return procedure;
  }
  var _globalThis$process;
  var _globalThis$process2;
  var _globalThis$process3;
  var isServerDefault = typeof window === "undefined" || "Deno" in window || ((_globalThis$process = globalThis.process) === null || _globalThis$process === undefined || (_globalThis$process = _globalThis$process.env) === null || _globalThis$process === undefined ? undefined : _globalThis$process["NODE_ENV"]) === "test" || !!((_globalThis$process2 = globalThis.process) === null || _globalThis$process2 === undefined || (_globalThis$process2 = _globalThis$process2.env) === null || _globalThis$process2 === undefined ? undefined : _globalThis$process2["JEST_WORKER_ID"]) || !!((_globalThis$process3 = globalThis.process) === null || _globalThis$process3 === undefined || (_globalThis$process3 = _globalThis$process3.env) === null || _globalThis$process3 === undefined ? undefined : _globalThis$process3["VITEST_WORKER_ID"]);
  var import_objectSpread25 = __toESM(require_objectSpread2(), 1);
  var TRPCBuilder = class TRPCBuilder2 {
    context() {
      return new TRPCBuilder2;
    }
    meta() {
      return new TRPCBuilder2;
    }
    create(opts) {
      var _opts$transformer, _opts$isDev, _globalThis$process$1, _opts$allowOutsideOfS, _opts$errorFormatter, _opts$isServer;
      const config = (0, import_objectSpread25.default)((0, import_objectSpread25.default)({}, opts), {}, {
        transformer: getDataTransformer((_opts$transformer = opts === null || opts === undefined ? undefined : opts.transformer) !== null && _opts$transformer !== undefined ? _opts$transformer : defaultTransformer),
        isDev: (_opts$isDev = opts === null || opts === undefined ? undefined : opts.isDev) !== null && _opts$isDev !== undefined ? _opts$isDev : ((_globalThis$process$1 = globalThis.process) === null || _globalThis$process$1 === undefined ? undefined : _globalThis$process$1.env["NODE_ENV"]) !== "production",
        allowOutsideOfServer: (_opts$allowOutsideOfS = opts === null || opts === undefined ? undefined : opts.allowOutsideOfServer) !== null && _opts$allowOutsideOfS !== undefined ? _opts$allowOutsideOfS : false,
        errorFormatter: (_opts$errorFormatter = opts === null || opts === undefined ? undefined : opts.errorFormatter) !== null && _opts$errorFormatter !== undefined ? _opts$errorFormatter : defaultFormatter,
        isServer: (_opts$isServer = opts === null || opts === undefined ? undefined : opts.isServer) !== null && _opts$isServer !== undefined ? _opts$isServer : isServerDefault,
        $types: null
      });
      {
        var _opts$isServer2;
        const isServer = (_opts$isServer2 = opts === null || opts === undefined ? undefined : opts.isServer) !== null && _opts$isServer2 !== undefined ? _opts$isServer2 : isServerDefault;
        if (!isServer && (opts === null || opts === undefined ? undefined : opts.allowOutsideOfServer) !== true)
          throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
      }
      return {
        _config: config,
        procedure: createBuilder({ meta: opts === null || opts === undefined ? undefined : opts.defaultMeta }),
        middleware: createMiddlewareFactory(),
        router: createRouterFactory(config),
        mergeRouters,
        createCallerFactory: createCallerFactory()
      };
    }
  };
  var initTRPC = new TRPCBuilder;

  // ../../node_modules/zod/dist/esm/v3/external.js
  var exports_external = {};
  __export(exports_external, {
    void: () => voidType,
    util: () => util,
    unknown: () => unknownType,
    union: () => unionType,
    undefined: () => undefinedType,
    tuple: () => tupleType,
    transformer: () => effectsType,
    symbol: () => symbolType,
    string: () => stringType,
    strictObject: () => strictObjectType,
    setErrorMap: () => setErrorMap,
    set: () => setType,
    record: () => recordType,
    quotelessJson: () => quotelessJson,
    promise: () => promiseType,
    preprocess: () => preprocessType,
    pipeline: () => pipelineType,
    ostring: () => ostring,
    optional: () => optionalType,
    onumber: () => onumber,
    oboolean: () => oboolean,
    objectUtil: () => objectUtil,
    object: () => objectType,
    number: () => numberType,
    nullable: () => nullableType,
    null: () => nullType,
    never: () => neverType,
    nativeEnum: () => nativeEnumType,
    nan: () => nanType,
    map: () => mapType,
    makeIssue: () => makeIssue,
    literal: () => literalType,
    lazy: () => lazyType,
    late: () => late,
    isValid: () => isValid,
    isDirty: () => isDirty,
    isAsync: () => isAsync,
    isAborted: () => isAborted,
    intersection: () => intersectionType,
    instanceof: () => instanceOfType,
    getParsedType: () => getParsedType,
    getErrorMap: () => getErrorMap,
    function: () => functionType,
    enum: () => enumType,
    effect: () => effectsType,
    discriminatedUnion: () => discriminatedUnionType,
    defaultErrorMap: () => en_default,
    datetimeRegex: () => datetimeRegex,
    date: () => dateType,
    custom: () => custom,
    coerce: () => coerce,
    boolean: () => booleanType,
    bigint: () => bigIntType,
    array: () => arrayType,
    any: () => anyType,
    addIssueToContext: () => addIssueToContext,
    ZodVoid: () => ZodVoid,
    ZodUnknown: () => ZodUnknown,
    ZodUnion: () => ZodUnion,
    ZodUndefined: () => ZodUndefined,
    ZodType: () => ZodType,
    ZodTuple: () => ZodTuple,
    ZodTransformer: () => ZodEffects,
    ZodSymbol: () => ZodSymbol,
    ZodString: () => ZodString,
    ZodSet: () => ZodSet,
    ZodSchema: () => ZodType,
    ZodRecord: () => ZodRecord,
    ZodReadonly: () => ZodReadonly,
    ZodPromise: () => ZodPromise,
    ZodPipeline: () => ZodPipeline,
    ZodParsedType: () => ZodParsedType,
    ZodOptional: () => ZodOptional,
    ZodObject: () => ZodObject,
    ZodNumber: () => ZodNumber,
    ZodNullable: () => ZodNullable,
    ZodNull: () => ZodNull,
    ZodNever: () => ZodNever,
    ZodNativeEnum: () => ZodNativeEnum,
    ZodNaN: () => ZodNaN,
    ZodMap: () => ZodMap,
    ZodLiteral: () => ZodLiteral,
    ZodLazy: () => ZodLazy,
    ZodIssueCode: () => ZodIssueCode,
    ZodIntersection: () => ZodIntersection,
    ZodFunction: () => ZodFunction,
    ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
    ZodError: () => ZodError,
    ZodEnum: () => ZodEnum,
    ZodEffects: () => ZodEffects,
    ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
    ZodDefault: () => ZodDefault,
    ZodDate: () => ZodDate,
    ZodCatch: () => ZodCatch,
    ZodBranded: () => ZodBranded,
    ZodBoolean: () => ZodBoolean,
    ZodBigInt: () => ZodBigInt,
    ZodArray: () => ZodArray,
    ZodAny: () => ZodAny,
    Schema: () => ZodType,
    ParseStatus: () => ParseStatus,
    OK: () => OK,
    NEVER: () => NEVER,
    INVALID: () => INVALID,
    EMPTY_PATH: () => EMPTY_PATH,
    DIRTY: () => DIRTY,
    BRAND: () => BRAND
  });

  // ../../node_modules/zod/dist/esm/v3/helpers/util.js
  var util;
  (function(util2) {
    util2.assertEqual = (_) => {};
    function assertIs(_arg) {}
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error;
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = (items) => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = (obj) => {
      const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = (obj) => {
      return util2.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    };
    util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item))
          return item;
      }
      return;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));
  var objectUtil;
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
      };
    };
  })(objectUtil || (objectUtil = {}));
  var ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  var getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return ZodParsedType.undefined;
      case "string":
        return ZodParsedType.string;
      case "number":
        return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
      case "boolean":
        return ZodParsedType.boolean;
      case "function":
        return ZodParsedType.function;
      case "bigint":
        return ZodParsedType.bigint;
      case "symbol":
        return ZodParsedType.symbol;
      case "object":
        if (Array.isArray(data)) {
          return ZodParsedType.array;
        }
        if (data === null) {
          return ZodParsedType.null;
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return ZodParsedType.promise;
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return ZodParsedType.map;
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return ZodParsedType.set;
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return ZodParsedType.date;
        }
        return ZodParsedType.object;
      default:
        return ZodParsedType.unknown;
    }
  };

  // ../../node_modules/zod/dist/esm/v3/ZodError.js
  var ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  var quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
  };

  class ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      };
      this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || { _errors: [] };
              } else {
                curr[el] = curr[el] || { _errors: [] };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
          fieldErrors[sub.path[0]].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  }
  ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
  };

  // ../../node_modules/zod/dist/esm/v3/locales/en.js
  var errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = "Required";
        } else {
          message = `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
        break;
      case ZodIssueCode.invalid_union:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = `Invalid function arguments`;
        break;
      case ZodIssueCode.invalid_return_type:
        message = `Invalid function return type`;
        break;
      case ZodIssueCode.invalid_date:
        message = `Invalid date`;
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("includes" in issue.validation) {
            message = `Invalid input: must include "${issue.validation.includes}"`;
            if (typeof issue.validation.position === "number") {
              message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
            }
          } else if ("startsWith" in issue.validation) {
            message = `Invalid input: must start with "${issue.validation.startsWith}"`;
          } else if ("endsWith" in issue.validation) {
            message = `Invalid input: must end with "${issue.validation.endsWith}"`;
          } else {
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== "regex") {
          message = `Invalid ${issue.validation}`;
        } else {
          message = "Invalid";
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.too_big:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "bigint")
          message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = `Intersection results could not be merged`;
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        message = _ctx.defaultError;
        util.assertNever(issue);
    }
    return { message };
  };
  var en_default = errorMap;

  // ../../node_modules/zod/dist/esm/v3/errors.js
  var overrideErrorMap = en_default;
  function setErrorMap(map) {
    overrideErrorMap = map;
  }
  function getErrorMap() {
    return overrideErrorMap;
  }
  // ../../node_modules/zod/dist/esm/v3/helpers/parseUtil.js
  var makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...issueData.path || []];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== undefined) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter((m) => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };
  var EMPTY_PATH = [];
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        ctx.schemaErrorMap,
        overrideMap,
        overrideMap === en_default ? undefined : en_default
      ].filter((x) => !!x)
    });
    ctx.common.issues.push(issue);
  }

  class ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid")
        this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted")
        this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted")
          return INVALID;
        if (s.status === "dirty")
          status.dirty();
        arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if (key.status === "aborted")
          return INVALID;
        if (value.status === "aborted")
          return INVALID;
        if (key.status === "dirty")
          status.dirty();
        if (value.status === "dirty")
          status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return { status: status.value, value: finalObject };
    }
  }
  var INVALID = Object.freeze({
    status: "aborted"
  });
  var DIRTY = (value) => ({ status: "dirty", value });
  var OK = (value) => ({ status: "valid", value });
  var isAborted = (x) => x.status === "aborted";
  var isDirty = (x) => x.status === "dirty";
  var isValid = (x) => x.status === "valid";
  var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  // ../../node_modules/zod/dist/esm/v3/helpers/errorUtil.js
  var errorUtil;
  (function(errorUtil2) {
    errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
  })(errorUtil || (errorUtil = {}));

  // ../../node_modules/zod/dist/esm/v3/types.js
  class ParseInputLazyPath {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  }
  var handleResult = (ctx, result) => {
    if (isValid(result)) {
      return { success: true, data: result.value };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error)
            return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      const { message } = params;
      if (iss.code === "invalid_enum_value") {
        return { message: message ?? ctx.defaultError };
      }
      if (typeof ctx.data === "undefined") {
        return { message: message ?? required_error ?? ctx.defaultError };
      }
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }

  class ZodType {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus,
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result = this._parse(input);
      if (isAsync(result)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result;
    }
    _parseAsync(input) {
      const result = this._parse(input);
      return Promise.resolve(result);
    }
    parse(data, params) {
      const result = this.safeParse(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    safeParse(data, params) {
      const ctx = {
        common: {
          issues: [],
          async: params?.async ?? false,
          contextualErrorMap: params?.errorMap
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const result = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result);
    }
    "~validate"(data) {
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result = this._parseSync({ data, path: [], parent: ctx });
          return isValid(result) ? {
            value: result.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if (err?.message?.toLowerCase()?.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
        value: result.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result = await this.safeParseAsync(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params?.errorMap,
          async: true
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result);
    }
    refine(check, message) {
      const getIssueProperties = (val) => {
        if (typeof message === "string" || typeof message === "undefined") {
          return { message };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then((data) => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: (data) => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(undefined).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }
  var cuidRegex = /^c[^\s-]{8,}$/i;
  var cuid2Regex = /^[0-9a-z]+$/;
  var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  var nanoidRegex = /^[a-z0-9_-]{21}$/i;
  var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  var emojiRegex;
  var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  var dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
      opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
      return false;
    try {
      const [header] = jwt.split(".");
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null)
        return false;
      if ("typ" in decoded && decoded?.typ !== "JWT")
        return false;
      if (!decoded.alg)
        return false;
      if (alg && decoded.alg !== alg)
        return false;
      return true;
    } catch {
      return false;
    }
  }
  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }

  class ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus;
      let ctx = undefined;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        offset: options?.offset ?? false,
        local: options?.local ?? false,
        ...errorUtil.errToObj(options?.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        ...errorUtil.errToObj(options?.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options?.position,
        ...errorUtil.errToObj(options?.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodString.create = (params) => {
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }

  class ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = undefined;
      const status = new ParseStatus;
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }
  ZodNumber.create = (params) => {
    return new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };

  class ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = undefined;
      const status = new ParseStatus;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodBigInt.create = (params) => {
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };

  class ZodBoolean extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodBoolean.create = (params) => {
    return new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };

  class ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus;
      let ctx = undefined;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new ZodDate({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  }
  ZodDate.create = (params) => {
    return new ZodDate({
      checks: [],
      coerce: params?.coerce || false,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };

  class ZodSymbol extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodSymbol.create = (params) => {
    return new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };

  class ZodUndefined extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodUndefined.create = (params) => {
    return new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };

  class ZodNull extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodNull.create = (params) => {
    return new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };

  class ZodAny extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodAny.create = (params) => {
    return new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };

  class ZodUnknown extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodUnknown.create = (params) => {
    return new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };

  class ZodNever extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }
  ZodNever.create = (params) => {
    return new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };

  class ZodVoid extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodVoid.create = (params) => {
    return new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };

  class ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : undefined,
            maximum: tooBig ? def.exactLength.value : undefined,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result2) => {
          return ParseStatus.mergeArray(status, result2);
        });
      }
      const result = [...ctx.data].map((item, i) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodArray.create = (schema, params) => {
    return new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }

  class ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = { shape, keys };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const { status, ctx } = this._processInputParams(input);
      const { shape, keys: shapeKeys } = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") {} else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== undefined ? {
          errorMap: (issue, ctx) => {
            const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
            if (issue.code === "unrecognized_keys")
              return {
                message: errorUtil.errToObj(message).message ?? defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    extend(augmentation) {
      return new ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    merge(merging) {
      const merged = new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    catchall(index) {
      return new ZodObject({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }
  ZodObject.create = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };

  class ZodUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result of results) {
          if (result.result.status === "valid") {
            return result.result;
          }
        }
        for (const result of results) {
          if (result.result.status === "dirty") {
            ctx.common.issues.push(...result.ctx.common.issues);
            return result.result;
          }
        }
        const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = undefined;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result.status === "valid") {
            return result;
          } else if (result.status === "dirty" && !dirty) {
            dirty = { result, ctx: childCtx };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map((issues2) => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  }
  ZodUnion.create = (types, params) => {
    return new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  var getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
      return getDiscriminator(type.schema);
    } else if (type instanceof ZodEffects) {
      return getDiscriminator(type.innerType());
    } else if (type instanceof ZodLiteral) {
      return [type.value];
    } else if (type instanceof ZodEnum) {
      return type.options;
    } else if (type instanceof ZodNativeEnum) {
      return util.objectValues(type.enum);
    } else if (type instanceof ZodDefault) {
      return getDiscriminator(type._def.innerType);
    } else if (type instanceof ZodUndefined) {
      return [undefined];
    } else if (type instanceof ZodNull) {
      return [null];
    } else if (type instanceof ZodOptional) {
      return [undefined, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodNullable) {
      return [null, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodBranded) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodReadonly) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodCatch) {
      return getDiscriminator(type._def.innerType);
    } else {
      return [];
    }
  };

  class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const discriminator = this.discriminator;
      const discriminatorValue = ctx.data[discriminator];
      const option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(discriminator, options, params) {
      const optionsMap = new Map;
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length) {
          throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        }
        for (const value of discriminatorValues) {
          if (optionsMap.has(value)) {
            throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          }
          optionsMap.set(value, type);
        }
      }
      return new ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params)
      });
    }
  }
  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return { valid: true, data: a };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index = 0;index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return { valid: true, data: a };
    } else {
      return { valid: false };
    }
  }

  class ZodIntersection extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async) {
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  }
  ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };

  class ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [...ctx.data].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema)
          return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x) => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple({
        ...this._def,
        rest
      });
    }
  }
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };

  class ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const pairs = [];
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      for (const key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType) {
        return new ZodRecord({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      }
      return new ZodRecord({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  }

  class ZodMap extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [...ctx.data.entries()].map(([key, value], index) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        const finalMap = new Map;
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        const finalMap = new Map;
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  }
  ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };

  class ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = new Set;
        for (const element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodSet.create = (valueType, params) => {
    return new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };

  class ZodFunction extends ZodType {
    constructor() {
      super(...arguments);
      this.validate = this.implement;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.function) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.function,
          received: ctx.parsedType
        });
        return INVALID;
      }
      function makeArgsIssue(args, error) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_arguments,
            argumentsError: error
          }
        });
      }
      function makeReturnsIssue(returns, error) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: error
          }
        });
      }
      const params = { errorMap: ctx.common.contextualErrorMap };
      const fn = ctx.data;
      if (this._def.returns instanceof ZodPromise) {
        const me = this;
        return OK(async function(...args) {
          const error = new ZodError([]);
          const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
            error.addIssue(makeArgsIssue(args, e));
            throw error;
          });
          const result = await Reflect.apply(fn, this, parsedArgs);
          const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
            error.addIssue(makeReturnsIssue(result, e));
            throw error;
          });
          return parsedReturns;
        });
      } else {
        const me = this;
        return OK(function(...args) {
          const parsedArgs = me._def.args.safeParse(args, params);
          if (!parsedArgs.success) {
            throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
          }
          const result = Reflect.apply(fn, this, parsedArgs.data);
          const parsedReturns = me._def.returns.safeParse(result, params);
          if (!parsedReturns.success) {
            throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
          }
          return parsedReturns.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...items) {
      return new ZodFunction({
        ...this._def,
        args: ZodTuple.create(items).rest(ZodUnknown.create())
      });
    }
    returns(returnType) {
      return new ZodFunction({
        ...this._def,
        returns: returnType
      });
    }
    implement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    strictImplement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    static create(args, returns, params) {
      return new ZodFunction({
        args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
        returns: returns || ZodUnknown.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction,
        ...processCreateParams(params)
      });
    }
  }

  class ZodLazy extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  }
  ZodLazy.create = (getter, params) => {
    return new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };

  class ZodLiteral extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  }
  ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }

  class ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  }
  ZodEnum.create = createZodEnum;

  class ZodNativeEnum extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  }
  ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };

  class ZodPromise extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  }
  ZodPromise.create = (schema, params) => {
    return new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };

  class ZodEffects extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: (arg) => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            const result = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          });
        } else {
          if (status.value === "aborted")
            return INVALID;
          const result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = (acc) => {
          const result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result);
          }
          if (result instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          executeRefinement(inner.value);
          return { status: status.value, value: inner.value };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base))
            return INVALID;
          const result = effect.transform(base.value, checkCtx);
          if (result instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return { status: status.value, value: result };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
            if (!isValid(base))
              return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  }
  ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
      schema,
      effect: { type: "preprocess", transform: preprocess },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  class ZodOptional extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(undefined);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodOptional.create = (type, params) => {
    return new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };

  class ZodNullable extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodNullable.create = (type, params) => {
    return new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };

  class ZodDefault extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  }
  ZodDefault.create = (type, params) => {
    return new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };

  class ZodCatch extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result)) {
        return result.then((result2) => {
          return {
            status: "valid",
            value: result2.status === "valid" ? result2.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  }
  ZodCatch.create = (type, params) => {
    return new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };

  class ZodNaN extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
  }
  ZodNaN.create = (params) => {
    return new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  var BRAND = Symbol("zod_brand");

  class ZodBranded extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  }

  class ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  }

  class ZodReadonly extends ZodType {
    _parse(input) {
      const result = this._def.innerType._parse(input);
      const freeze = (data) => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  function cleanParams(params, data) {
    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
  }
  function custom(check, _params = {}, fatal) {
    if (check)
      return ZodAny.create().superRefine((data, ctx) => {
        const r = check(data);
        if (r instanceof Promise) {
          return r.then((r2) => {
            if (!r2) {
              const params = cleanParams(_params, data);
              const _fatal = params.fatal ?? fatal ?? true;
              ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
          });
        }
        if (!r) {
          const params = cleanParams(_params, data);
          const _fatal = params.fatal ?? fatal ?? true;
          ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
        }
        return;
      });
    return ZodAny.create();
  }
  var late = {
    object: ZodObject.lazycreate
  };
  var ZodFirstPartyTypeKind;
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  var instanceOfType = (cls, params = {
    message: `Input not instance of ${cls.name}`
  }) => custom((data) => data instanceof cls, params);
  var stringType = ZodString.create;
  var numberType = ZodNumber.create;
  var nanType = ZodNaN.create;
  var bigIntType = ZodBigInt.create;
  var booleanType = ZodBoolean.create;
  var dateType = ZodDate.create;
  var symbolType = ZodSymbol.create;
  var undefinedType = ZodUndefined.create;
  var nullType = ZodNull.create;
  var anyType = ZodAny.create;
  var unknownType = ZodUnknown.create;
  var neverType = ZodNever.create;
  var voidType = ZodVoid.create;
  var arrayType = ZodArray.create;
  var objectType = ZodObject.create;
  var strictObjectType = ZodObject.strictCreate;
  var unionType = ZodUnion.create;
  var discriminatedUnionType = ZodDiscriminatedUnion.create;
  var intersectionType = ZodIntersection.create;
  var tupleType = ZodTuple.create;
  var recordType = ZodRecord.create;
  var mapType = ZodMap.create;
  var setType = ZodSet.create;
  var functionType = ZodFunction.create;
  var lazyType = ZodLazy.create;
  var literalType = ZodLiteral.create;
  var enumType = ZodEnum.create;
  var nativeEnumType = ZodNativeEnum.create;
  var promiseType = ZodPromise.create;
  var effectsType = ZodEffects.create;
  var optionalType = ZodOptional.create;
  var nullableType = ZodNullable.create;
  var preprocessType = ZodEffects.createWithPreprocess;
  var pipelineType = ZodPipeline.create;
  var ostring = () => stringType().optional();
  var onumber = () => numberType().optional();
  var oboolean = () => booleanType().optional();
  var coerce = {
    string: (arg) => ZodString.create({ ...arg, coerce: true }),
    number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
    boolean: (arg) => ZodBoolean.create({
      ...arg,
      coerce: true
    }),
    bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
    date: (arg) => ZodDate.create({ ...arg, coerce: true })
  };
  var NEVER = INVALID;
  // ../../node_modules/superjson/dist/double-indexed-kv.js
  class DoubleIndexedKV {
    constructor() {
      this.keyToValue = new Map;
      this.valueToKey = new Map;
    }
    set(key, value) {
      this.keyToValue.set(key, value);
      this.valueToKey.set(value, key);
    }
    getByKey(key) {
      return this.keyToValue.get(key);
    }
    getByValue(value) {
      return this.valueToKey.get(value);
    }
    clear() {
      this.keyToValue.clear();
      this.valueToKey.clear();
    }
  }

  // ../../node_modules/superjson/dist/registry.js
  class Registry {
    constructor(generateIdentifier) {
      this.generateIdentifier = generateIdentifier;
      this.kv = new DoubleIndexedKV;
    }
    register(value, identifier) {
      if (this.kv.getByValue(value)) {
        return;
      }
      if (!identifier) {
        identifier = this.generateIdentifier(value);
      }
      this.kv.set(identifier, value);
    }
    clear() {
      this.kv.clear();
    }
    getIdentifier(value) {
      return this.kv.getByValue(value);
    }
    getValue(identifier) {
      return this.kv.getByKey(identifier);
    }
  }

  // ../../node_modules/superjson/dist/class-registry.js
  class ClassRegistry extends Registry {
    constructor() {
      super((c) => c.name);
      this.classToAllowedProps = new Map;
    }
    register(value, options) {
      if (typeof options === "object") {
        if (options.allowProps) {
          this.classToAllowedProps.set(value, options.allowProps);
        }
        super.register(value, options.identifier);
      } else {
        super.register(value, options);
      }
    }
    getAllowedProps(value) {
      return this.classToAllowedProps.get(value);
    }
  }

  // ../../node_modules/superjson/dist/util.js
  function valuesOfObj(record) {
    if ("values" in Object) {
      return Object.values(record);
    }
    const values = [];
    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        values.push(record[key]);
      }
    }
    return values;
  }
  function find(record, predicate) {
    const values = valuesOfObj(record);
    if ("find" in values) {
      return values.find(predicate);
    }
    const valuesNotNever = values;
    for (let i = 0;i < valuesNotNever.length; i++) {
      const value = valuesNotNever[i];
      if (predicate(value)) {
        return value;
      }
    }
    return;
  }
  function forEach(record, run2) {
    Object.entries(record).forEach(([key, value]) => run2(value, key));
  }
  function includes(arr, value) {
    return arr.indexOf(value) !== -1;
  }
  function findArr(record, predicate) {
    for (let i = 0;i < record.length; i++) {
      const value = record[i];
      if (predicate(value)) {
        return value;
      }
    }
    return;
  }

  // ../../node_modules/superjson/dist/custom-transformer-registry.js
  class CustomTransformerRegistry {
    constructor() {
      this.transfomers = {};
    }
    register(transformer) {
      this.transfomers[transformer.name] = transformer;
    }
    findApplicable(v) {
      return find(this.transfomers, (transformer) => transformer.isApplicable(v));
    }
    findByName(name) {
      return this.transfomers[name];
    }
  }

  // ../../node_modules/superjson/dist/is.js
  var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
  var isUndefined = (payload) => typeof payload === "undefined";
  var isNull = (payload) => payload === null;
  var isPlainObject2 = (payload) => {
    if (typeof payload !== "object" || payload === null)
      return false;
    if (payload === Object.prototype)
      return false;
    if (Object.getPrototypeOf(payload) === null)
      return true;
    return Object.getPrototypeOf(payload) === Object.prototype;
  };
  var isEmptyObject = (payload) => isPlainObject2(payload) && Object.keys(payload).length === 0;
  var isArray = (payload) => Array.isArray(payload);
  var isString = (payload) => typeof payload === "string";
  var isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
  var isBoolean = (payload) => typeof payload === "boolean";
  var isRegExp = (payload) => payload instanceof RegExp;
  var isMap = (payload) => payload instanceof Map;
  var isSet = (payload) => payload instanceof Set;
  var isSymbol = (payload) => getType(payload) === "Symbol";
  var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
  var isError = (payload) => payload instanceof Error;
  var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
  var isPrimitive = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
  var isBigint = (payload) => typeof payload === "bigint";
  var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
  var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
  var isURL = (payload) => payload instanceof URL;

  // ../../node_modules/superjson/dist/pathstringifier.js
  var escapeKey = (key) => key.replace(/\./g, "\\.");
  var stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
  var parsePath = (string) => {
    const result = [];
    let segment = "";
    for (let i = 0;i < string.length; i++) {
      let char = string.charAt(i);
      const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
      if (isEscapedDot) {
        segment += ".";
        i++;
        continue;
      }
      const isEndOfSegment = char === ".";
      if (isEndOfSegment) {
        result.push(segment);
        segment = "";
        continue;
      }
      segment += char;
    }
    const lastSegment = segment;
    result.push(lastSegment);
    return result;
  };

  // ../../node_modules/superjson/dist/transformer.js
  function simpleTransformation(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  }
  var simpleRules = [
    simpleTransformation(isUndefined, "undefined", () => null, () => {
      return;
    }),
    simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
      if (typeof BigInt !== "undefined") {
        return BigInt(v);
      }
      console.error("Please add a BigInt polyfill.");
      return v;
    }),
    simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
    simpleTransformation(isError, "Error", (v, superJson) => {
      const baseError = {
        name: v.name,
        message: v.message
      };
      superJson.allowedErrorProps.forEach((prop) => {
        baseError[prop] = v[prop];
      });
      return baseError;
    }, (v, superJson) => {
      const e = new Error(v.message);
      e.name = v.name;
      e.stack = v.stack;
      superJson.allowedErrorProps.forEach((prop) => {
        e[prop] = v[prop];
      });
      return e;
    }),
    simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
      const body = regex.slice(1, regex.lastIndexOf("/"));
      const flags = regex.slice(regex.lastIndexOf("/") + 1);
      return new RegExp(body, flags);
    }),
    simpleTransformation(isSet, "set", (v) => [...v.values()], (v) => new Set(v)),
    simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
    simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
      if (isNaNValue(v)) {
        return "NaN";
      }
      if (v > 0) {
        return "Infinity";
      } else {
        return "-Infinity";
      }
    }, Number),
    simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
      return "-0";
    }, Number),
    simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
  ];
  function compositeTransformation(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  }
  var symbolRule = compositeTransformation((s, superJson) => {
    if (isSymbol(s)) {
      const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
      return isRegistered;
    }
    return false;
  }, (s, superJson) => {
    const identifier = superJson.symbolRegistry.getIdentifier(s);
    return ["symbol", identifier];
  }, (v) => v.description, (_, a, superJson) => {
    const value = superJson.symbolRegistry.getValue(a[1]);
    if (!value) {
      throw new Error("Trying to deserialize unknown symbol");
    }
    return value;
  });
  var constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray
  ].reduce((obj, ctor) => {
    obj[ctor.name] = ctor;
    return obj;
  }, {});
  var typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
    const ctor = constructorToName[a[1]];
    if (!ctor) {
      throw new Error("Trying to deserialize unknown typed array");
    }
    return new ctor(v);
  });
  function isInstanceOfRegisteredClass(potentialClass, superJson) {
    if (potentialClass?.constructor) {
      const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
      return isRegistered;
    }
    return false;
  }
  var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
    const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
    return ["class", identifier];
  }, (clazz, superJson) => {
    const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
      return { ...clazz };
    }
    const result = {};
    allowedProps.forEach((prop) => {
      result[prop] = clazz[prop];
    });
    return result;
  }, (v, a, superJson) => {
    const clazz = superJson.classRegistry.getValue(a[1]);
    if (!clazz) {
      throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
    }
    return Object.assign(Object.create(clazz.prototype), v);
  });
  var customRule = compositeTransformation((value, superJson) => {
    return !!superJson.customTransformerRegistry.findApplicable(value);
  }, (value, superJson) => {
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return ["custom", transformer.name];
  }, (value, superJson) => {
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
  }, (v, a, superJson) => {
    const transformer = superJson.customTransformerRegistry.findByName(a[1]);
    if (!transformer) {
      throw new Error("Trying to deserialize unknown custom value");
    }
    return transformer.deserialize(v);
  });
  var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
  var transformValue = (value, superJson) => {
    const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
    if (applicableCompositeRule) {
      return {
        value: applicableCompositeRule.transform(value, superJson),
        type: applicableCompositeRule.annotation(value, superJson)
      };
    }
    const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
    if (applicableSimpleRule) {
      return {
        value: applicableSimpleRule.transform(value, superJson),
        type: applicableSimpleRule.annotation
      };
    }
    return;
  };
  var simpleRulesByAnnotation = {};
  simpleRules.forEach((rule) => {
    simpleRulesByAnnotation[rule.annotation] = rule;
  });
  var untransformValue = (json, type, superJson) => {
    if (isArray(type)) {
      switch (type[0]) {
        case "symbol":
          return symbolRule.untransform(json, type, superJson);
        case "class":
          return classRule.untransform(json, type, superJson);
        case "custom":
          return customRule.untransform(json, type, superJson);
        case "typed-array":
          return typedArrayRule.untransform(json, type, superJson);
        default:
          throw new Error("Unknown transformation: " + type);
      }
    } else {
      const transformation = simpleRulesByAnnotation[type];
      if (!transformation) {
        throw new Error("Unknown transformation: " + type);
      }
      return transformation.untransform(json, superJson);
    }
  };

  // ../../node_modules/superjson/dist/accessDeep.js
  var getNthKey = (value, n) => {
    if (n > value.size)
      throw new Error("index out of bounds");
    const keys = value.keys();
    while (n > 0) {
      keys.next();
      n--;
    }
    return keys.next().value;
  };
  function validatePath(path) {
    if (includes(path, "__proto__")) {
      throw new Error("__proto__ is not allowed as a property");
    }
    if (includes(path, "prototype")) {
      throw new Error("prototype is not allowed as a property");
    }
    if (includes(path, "constructor")) {
      throw new Error("constructor is not allowed as a property");
    }
  }
  var getDeep = (object, path) => {
    validatePath(path);
    for (let i = 0;i < path.length; i++) {
      const key = path[i];
      if (isSet(object)) {
        object = getNthKey(object, +key);
      } else if (isMap(object)) {
        const row = +key;
        const type = +path[++i] === 0 ? "key" : "value";
        const keyOfRow = getNthKey(object, row);
        switch (type) {
          case "key":
            object = keyOfRow;
            break;
          case "value":
            object = object.get(keyOfRow);
            break;
        }
      } else {
        object = object[key];
      }
    }
    return object;
  };
  var setDeep = (object, path, mapper) => {
    validatePath(path);
    if (path.length === 0) {
      return mapper(object);
    }
    let parent = object;
    for (let i = 0;i < path.length - 1; i++) {
      const key = path[i];
      if (isArray(parent)) {
        const index = +key;
        parent = parent[index];
      } else if (isPlainObject2(parent)) {
        parent = parent[key];
      } else if (isSet(parent)) {
        const row = +key;
        parent = getNthKey(parent, row);
      } else if (isMap(parent)) {
        const isEnd = i === path.length - 2;
        if (isEnd) {
          break;
        }
        const row = +key;
        const type = +path[++i] === 0 ? "key" : "value";
        const keyOfRow = getNthKey(parent, row);
        switch (type) {
          case "key":
            parent = keyOfRow;
            break;
          case "value":
            parent = parent.get(keyOfRow);
            break;
        }
      }
    }
    const lastKey = path[path.length - 1];
    if (isArray(parent)) {
      parent[+lastKey] = mapper(parent[+lastKey]);
    } else if (isPlainObject2(parent)) {
      parent[lastKey] = mapper(parent[lastKey]);
    }
    if (isSet(parent)) {
      const oldValue = getNthKey(parent, +lastKey);
      const newValue = mapper(oldValue);
      if (oldValue !== newValue) {
        parent.delete(oldValue);
        parent.add(newValue);
      }
    }
    if (isMap(parent)) {
      const row = +path[path.length - 2];
      const keyToRow = getNthKey(parent, row);
      const type = +lastKey === 0 ? "key" : "value";
      switch (type) {
        case "key": {
          const newKey = mapper(keyToRow);
          parent.set(newKey, parent.get(keyToRow));
          if (newKey !== keyToRow) {
            parent.delete(keyToRow);
          }
          break;
        }
        case "value": {
          parent.set(keyToRow, mapper(parent.get(keyToRow)));
          break;
        }
      }
    }
    return object;
  };

  // ../../node_modules/superjson/dist/plainer.js
  function traverse(tree, walker, origin = []) {
    if (!tree) {
      return;
    }
    if (!isArray(tree)) {
      forEach(tree, (subtree, key) => traverse(subtree, walker, [...origin, ...parsePath(key)]));
      return;
    }
    const [nodeValue, children] = tree;
    if (children) {
      forEach(children, (child, key) => {
        traverse(child, walker, [...origin, ...parsePath(key)]);
      });
    }
    walker(nodeValue, origin);
  }
  function applyValueAnnotations(plain, annotations, superJson) {
    traverse(annotations, (type, path) => {
      plain = setDeep(plain, path, (v) => untransformValue(v, type, superJson));
    });
    return plain;
  }
  function applyReferentialEqualityAnnotations(plain, annotations) {
    function apply(identicalPaths, path) {
      const object = getDeep(plain, parsePath(path));
      identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
        plain = setDeep(plain, identicalObjectPath, () => object);
      });
    }
    if (isArray(annotations)) {
      const [root, other] = annotations;
      root.forEach((identicalPath) => {
        plain = setDeep(plain, parsePath(identicalPath), () => plain);
      });
      if (other) {
        forEach(other, apply);
      }
    } else {
      forEach(annotations, apply);
    }
    return plain;
  }
  var isDeep = (object, superJson) => isPlainObject2(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
  function addIdentity(object, path, identities) {
    const existingSet = identities.get(object);
    if (existingSet) {
      existingSet.push(path);
    } else {
      identities.set(object, [path]);
    }
  }
  function generateReferentialEqualityAnnotations(identitites, dedupe) {
    const result = {};
    let rootEqualityPaths = undefined;
    identitites.forEach((paths) => {
      if (paths.length <= 1) {
        return;
      }
      if (!dedupe) {
        paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
      }
      const [representativePath, ...identicalPaths] = paths;
      if (representativePath.length === 0) {
        rootEqualityPaths = identicalPaths.map(stringifyPath);
      } else {
        result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
      }
    });
    if (rootEqualityPaths) {
      if (isEmptyObject(result)) {
        return [rootEqualityPaths];
      } else {
        return [rootEqualityPaths, result];
      }
    } else {
      return isEmptyObject(result) ? undefined : result;
    }
  }
  var walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = new Map) => {
    const primitive = isPrimitive(object);
    if (!primitive) {
      addIdentity(object, path, identities);
      const seen = seenObjects.get(object);
      if (seen) {
        return dedupe ? {
          transformedValue: null
        } : seen;
      }
    }
    if (!isDeep(object, superJson)) {
      const transformed2 = transformValue(object, superJson);
      const result2 = transformed2 ? {
        transformedValue: transformed2.value,
        annotations: [transformed2.type]
      } : {
        transformedValue: object
      };
      if (!primitive) {
        seenObjects.set(object, result2);
      }
      return result2;
    }
    if (includes(objectsInThisPath, object)) {
      return {
        transformedValue: null
      };
    }
    const transformationResult = transformValue(object, superJson);
    const transformed = transformationResult?.value ?? object;
    const transformedValue = isArray(transformed) ? [] : {};
    const innerAnnotations = {};
    forEach(transformed, (value, index) => {
      if (index === "__proto__" || index === "constructor" || index === "prototype") {
        throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
      }
      const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
      transformedValue[index] = recursiveResult.transformedValue;
      if (isArray(recursiveResult.annotations)) {
        innerAnnotations[index] = recursiveResult.annotations;
      } else if (isPlainObject2(recursiveResult.annotations)) {
        forEach(recursiveResult.annotations, (tree, key) => {
          innerAnnotations[escapeKey(index) + "." + key] = tree;
        });
      }
    });
    const result = isEmptyObject(innerAnnotations) ? {
      transformedValue,
      annotations: transformationResult ? [transformationResult.type] : undefined
    } : {
      transformedValue,
      annotations: transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
    };
    if (!primitive) {
      seenObjects.set(object, result);
    }
    return result;
  };

  // ../../node_modules/is-what/dist/index.js
  function getType2(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  }
  function isArray2(payload) {
    return getType2(payload) === "Array";
  }
  function isPlainObject3(payload) {
    if (getType2(payload) !== "Object")
      return false;
    const prototype = Object.getPrototypeOf(payload);
    return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
  }
  function isNull2(payload) {
    return getType2(payload) === "Null";
  }
  function isOneOf(a, b, c, d, e) {
    return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
  }
  function isUndefined2(payload) {
    return getType2(payload) === "Undefined";
  }
  var isNullOrUndefined = isOneOf(isNull2, isUndefined2);

  // ../../node_modules/copy-anything/dist/index.js
  function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
    if (propType === "enumerable")
      carry[key] = newVal;
    if (includeNonenumerable && propType === "nonenumerable") {
      Object.defineProperty(carry, key, {
        value: newVal,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  }
  function copy(target, options = {}) {
    if (isArray2(target)) {
      return target.map((item) => copy(item, options));
    }
    if (!isPlainObject3(target)) {
      return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [...props, ...symbols].reduce((carry, key) => {
      if (isArray2(options.props) && !options.props.includes(key)) {
        return carry;
      }
      const val = target[key];
      const newVal = copy(val, options);
      assignProp(carry, key, newVal, target, options.nonenumerable);
      return carry;
    }, {});
  }

  // ../../node_modules/superjson/dist/index.js
  class SuperJSON {
    constructor({ dedupe = false } = {}) {
      this.classRegistry = new ClassRegistry;
      this.symbolRegistry = new Registry((s) => s.description ?? "");
      this.customTransformerRegistry = new CustomTransformerRegistry;
      this.allowedErrorProps = [];
      this.dedupe = dedupe;
    }
    serialize(object) {
      const identities = new Map;
      const output = walker(object, identities, this, this.dedupe);
      const res = {
        json: output.transformedValue
      };
      if (output.annotations) {
        res.meta = {
          ...res.meta,
          values: output.annotations
        };
      }
      const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
      if (equalityAnnotations) {
        res.meta = {
          ...res.meta,
          referentialEqualities: equalityAnnotations
        };
      }
      return res;
    }
    deserialize(payload) {
      const { json, meta } = payload;
      let result = copy(json);
      if (meta?.values) {
        result = applyValueAnnotations(result, meta.values, this);
      }
      if (meta?.referentialEqualities) {
        result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
      }
      return result;
    }
    stringify(object) {
      return JSON.stringify(this.serialize(object));
    }
    parse(string) {
      return this.deserialize(JSON.parse(string));
    }
    registerClass(v, options) {
      this.classRegistry.register(v, options);
    }
    registerSymbol(v, identifier) {
      this.symbolRegistry.register(v, identifier);
    }
    registerCustom(transformer, name) {
      this.customTransformerRegistry.register({
        name,
        ...transformer
      });
    }
    allowErrorProps(...props) {
      this.allowedErrorProps.push(...props);
    }
  }
  SuperJSON.defaultInstance = new SuperJSON;
  SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
  SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
  SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
  SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
  SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
  SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
  SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
  SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
  var serialize = SuperJSON.serialize;
  var deserialize = SuperJSON.deserialize;
  var stringify = SuperJSON.stringify;
  var parse = SuperJSON.parse;
  var registerClass = SuperJSON.registerClass;
  var registerCustom = SuperJSON.registerCustom;
  var registerSymbol = SuperJSON.registerSymbol;
  var allowErrorProps = SuperJSON.allowErrorProps;

  // src/container.ts
  class CozyContainer {
    options;
    container;
    constructor(options, container) {
      this.options = options;
      this.container = container;
    }
    setContainer(container) {
      this.container = container;
    }
    async initialize() {}
    async exec(options) {
      if (!this.container) {
        throw new Error("Container not initialized");
      }
      const fullCommand = options.args ? [...options.command, ...options.args] : options.command;
      const result = await this.container.exec(fullCommand, {
        env: options.env || {}
      });
      return {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        exitCode: result.exitCode
      };
    }
    async executeClaudeCode(prompt) {
      try {
        const result = await this.exec({
          command: ["claude", "code"],
          args: ["--prompt", prompt],
          env: {
            ANTHROPIC_API_KEY: this.options.apiKey
          }
        });
        return result.stdout;
      } catch (error) {
        console.error("Claude Code execution error:", error);
        throw new Error(`Failed to execute Claude Code: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    async executeCode(language, code) {
      let command;
      switch (language) {
        case "javascript":
        case "typescript":
          command = ["node", "-e", code];
          break;
        case "python":
          command = ["python3", "-c", code];
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      try {
        const result = await this.exec({
          command,
          env: {
            ANTHROPIC_API_KEY: this.options.apiKey
          }
        });
        return {
          stdout: result.stdout,
          stderr: result.stderr
        };
      } catch (error) {
        console.error("Code execution error:", error);
        throw new Error(`Failed to execute code: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    async writeFile(path, content) {
      await this.exec({
        command: ["sh", "-c", `echo '${content.replace(/'/g, `'"'"'`)}' > ${path}`]
      });
    }
    async readFile(path) {
      const result = await this.exec({
        command: ["cat", path]
      });
      return result.stdout;
    }
    async listFiles(directory = ".") {
      const result = await this.exec({
        command: ["ls", "-la", directory]
      });
      return result.stdout.split(`
`).filter((line) => line.trim());
    }
    async createDirectory(path) {
      await this.exec({
        command: ["mkdir", "-p", path]
      });
    }
    async installPackage(packageName, language = "node") {
      const command = language === "node" ? ["npm", "install", packageName] : ["pip", "install", packageName];
      await this.exec({ command });
    }
  }

  // src/trpc/router.ts
  var t = initTRPC.context().create({
    transformer: SuperJSON
  });
  var router = t.router;
  var publicProcedure = t.procedure;
  var appRouter = router({
    hello: publicProcedure.input(exports_external.object({ name: exports_external.string() })).query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),
    executeCode: publicProcedure.input(exports_external.object({
      language: exports_external.enum(["javascript", "python", "typescript"]),
      code: exports_external.string(),
      apiKey: exports_external.string().optional(),
      workspaceId: exports_external.string().optional()
    })).mutation(async ({ input, ctx }) => {
      try {
        const apiKey = input.apiKey || "";
        const workspaceId = input.workspaceId || "default";
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER);
        await container.initialize();
        const result = await container.executeCode(input.language, input.code);
        return {
          success: true,
          output: result.stdout,
          error: result.stderr,
          executionTime: Date.now()
        };
      } catch (error) {
        return {
          success: false,
          output: "",
          error: error instanceof Error ? error.message : "Unknown error",
          executionTime: Date.now()
        };
      }
    }),
    claudeCode: publicProcedure.input(exports_external.object({
      prompt: exports_external.string(),
      context: exports_external.string().optional(),
      files: exports_external.array(exports_external.object({
        path: exports_external.string(),
        content: exports_external.string()
      })).optional(),
      apiKey: exports_external.string().optional(),
      workspaceId: exports_external.string().optional()
    })).mutation(async ({ input, ctx }) => {
      try {
        const apiKey = input.apiKey || "";
        const workspaceId = input.workspaceId || "default";
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER);
        await container.initialize();
        if (input.files) {
          for (const file of input.files) {
            await container.writeFile(file.path, file.content);
          }
        }
        const result = await container.executeClaudeCode(input.prompt);
        return {
          success: true,
          output: result,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          output: "",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString()
        };
      }
    }),
    fileOperation: publicProcedure.input(exports_external.object({
      operation: exports_external.enum(["read", "write", "list", "mkdir"]),
      path: exports_external.string(),
      content: exports_external.string().optional(),
      apiKey: exports_external.string().optional(),
      workspaceId: exports_external.string().optional()
    })).mutation(async ({ input, ctx }) => {
      try {
        const apiKey = input.apiKey || "";
        const workspaceId = input.workspaceId || "default";
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER);
        await container.initialize();
        let result;
        switch (input.operation) {
          case "read":
            result = await container.readFile(input.path);
            break;
          case "write":
            if (!input.content)
              throw new Error("Content required for write operation");
            await container.writeFile(input.path, input.content);
            result = "File written successfully";
            break;
          case "list":
            result = await container.listFiles(input.path);
            break;
          case "mkdir":
            await container.createDirectory(input.path);
            result = "Directory created successfully";
            break;
        }
        return {
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString()
        };
      }
    })
  });

  // src/index.ts
  var app = new Hono2;
  app.use("/*", cors());
  app.get("/health", (c) => {
    return c.json({ status: "ok", environment: c.env.ENVIRONMENT });
  });
  app.all("/trpc/*", async (c) => {
    return fetchRequestHandler({
      endpoint: "/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: async () => {
        return {
          env: c.env,
          request: c.req.raw
        };
      }
    });
  });
  app.post("/container/claude", async (c) => {
    const request = await c.req.json();
    try {
      const apiKey = c.req.header("X-Anthropic-Api-Key") || "";
      const workspaceId = c.req.header("X-Workspace-Id") || "default";
      if (!apiKey) {
        return c.json({
          success: false,
          error: "API key required",
          timestamp: new Date().toISOString()
        }, 401);
      }
      const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER);
      await container.initialize();
      const result = await container.executeClaudeCode(request.prompt);
      return c.json({
        success: true,
        data: { output: result },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }, 500);
    }
  });
  app.post("/container/execute", async (c) => {
    const request = await c.req.json();
    try {
      const apiKey = c.req.header("X-Anthropic-Api-Key") || "";
      const workspaceId = c.req.header("X-Workspace-Id") || "default";
      const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER);
      await container.initialize();
      const result = await container.executeCode(request.language, request.code);
      return c.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }, 500);
    }
  });
  app.post("/container/file", async (c) => {
    const request = await c.req.json();
    try {
      const apiKey = c.req.header("X-Anthropic-Api-Key") || "";
      const workspaceId = c.req.header("X-Workspace-Id") || "default";
      const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER);
      await container.initialize();
      let result;
      switch (request.operation) {
        case "read":
          result = await container.readFile(request.path);
          break;
        case "write":
          if (!request.content)
            throw new Error("Content required for write operation");
          await container.writeFile(request.path, request.content);
          result = { message: "File written successfully" };
          break;
        case "list":
          result = await container.listFiles(request.path);
          break;
        case "mkdir":
          await container.createDirectory(request.path);
          result = { message: "Directory created successfully" };
          break;
        default:
          throw new Error("Invalid file operation");
      }
      return c.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }, 500);
    }
  });
  var src_default = app;
}
  
  // Export the app
  app = src_default;
})();

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  }
};
