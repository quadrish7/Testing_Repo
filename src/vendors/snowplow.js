/*!
 * Web analytics for Snowplow v3.4.0 (http://bit.ly/sp-js)
 * Copyright 2022 Snowplow Analytics Ltd, 2010 Anthon Pang
 * Licensed under BSD-3-Clause
 */

(function () {
    'use strict';

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var rngBrowser = {exports: {}};

    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
    if (getRandomValues) {
      var rnds8 = new Uint8Array(16);
      rngBrowser.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      var rnds = new Array(16);
      rngBrowser.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
        return rnds;
      };
    }

    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    function bytesToUuid$2(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      return ([
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]
      ]).join('');
    }
    var bytesToUuid_1 = bytesToUuid$2;

    var rng$1 = rngBrowser.exports;
    var bytesToUuid$1 = bytesToUuid_1;
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1$1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        var seedBytes = rng$1();
        if (node == null) {
          node = _nodeId = [
            seedBytes[0] | 0x01,
            seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
          ];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      }
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 12219292800000;
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;
      b[i++] = tmh >>> 24 & 0xf | 0x10;
      b[i++] = tmh >>> 16 & 0xff;
      b[i++] = clockseq >>> 8 | 0x80;
      b[i++] = clockseq & 0xff;
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf ? buf : bytesToUuid$1(b);
    }
    var v1_1 = v1$1;

    var rng = rngBrowser.exports;
    var bytesToUuid = bytesToUuid_1;
    function v4$1(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || rng)();
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || bytesToUuid(rnds);
    }
    var v4_1 = v4$1;

    var v1 = v1_1;
    var v4 = v4_1;
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    var uuid_1 = uuid;

    var version$1 = "3.4.0";
    function base64urlencode(data) {
        if (!data) {
            return data;
        }
        var enc = base64encode(data);
        return enc.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function base64encode(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0;
        var tmp_arr = [];
        if (!data) {
            return data;
        }
        data = unescape(encodeURIComponent(data));
        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
            bits = (o1 << 16) | (o2 << 8) | o3;
            h1 = (bits >> 18) & 0x3f;
            h2 = (bits >> 12) & 0x3f;
            h3 = (bits >> 6) & 0x3f;
            h4 = bits & 0x3f;
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        var enc = tmp_arr.join('');
        var r = data.length % 3;
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    }
    function payloadBuilder() {
        var dict = {}, allJson = [], jsonForProcessing = [];
        var processor;
        var add = function (key, value) {
            if (value != null && value !== '') {
                dict[key] = value;
            }
        };
        var addDict = function (dict) {
            for (var key in dict) {
                if (Object.prototype.hasOwnProperty.call(dict, key)) {
                    add(key, dict[key]);
                }
            }
        };
        var addJson = function (keyIfEncoded, keyIfNotEncoded, json) {
            if (json && isNonEmptyJson(json)) {
                var jsonWithKeys = { keyIfEncoded: keyIfEncoded, keyIfNotEncoded: keyIfNotEncoded, json: json };
                jsonForProcessing.push(jsonWithKeys);
                allJson.push(jsonWithKeys);
            }
        };
        return {
            add: add,
            addDict: addDict,
            addJson: addJson,
            getPayload: function () { return dict; },
            getJson: function () { return allJson; },
            withJsonProcessor: function (jsonProcessor) {
                processor = jsonProcessor;
            },
            build: function () {
                processor === null || processor === void 0 ? void 0 : processor(this, jsonForProcessing);
                return dict;
            }
        };
    }
    function payloadJsonProcessor(encodeBase64) {
        return function (payloadBuilder, jsonForProcessing) {
            for (var _i = 0, jsonForProcessing_1 = jsonForProcessing; _i < jsonForProcessing_1.length; _i++) {
                var json = jsonForProcessing_1[_i];
                var str = JSON.stringify(json.json);
                if (encodeBase64) {
                    payloadBuilder.add(json.keyIfEncoded, base64urlencode(str));
                }
                else {
                    payloadBuilder.add(json.keyIfNotEncoded, str);
                }
            }
            jsonForProcessing.length = 0;
        };
    }
    function isNonEmptyJson(property) {
        if (!isJson(property)) {
            return false;
        }
        for (var key in property) {
            if (Object.prototype.hasOwnProperty.call(property, key)) {
                return true;
            }
        }
        return false;
    }
    function isJson(property) {
        return (typeof property !== 'undefined' &&
            property !== null &&
            (property.constructor === {}.constructor || property.constructor === [].constructor));
    }
    var label = 'Snowplow: ';
    var LOG_LEVEL;
    (function (LOG_LEVEL) {
        LOG_LEVEL[LOG_LEVEL["none"] = 0] = "none";
        LOG_LEVEL[LOG_LEVEL["error"] = 1] = "error";
        LOG_LEVEL[LOG_LEVEL["warn"] = 2] = "warn";
        LOG_LEVEL[LOG_LEVEL["debug"] = 3] = "debug";
        LOG_LEVEL[LOG_LEVEL["info"] = 4] = "info";
    })(LOG_LEVEL || (LOG_LEVEL = {}));
    var LOG$1 = logger();
    function logger(logLevel) {
        if (logLevel === void 0) { logLevel = LOG_LEVEL.warn; }
        function setLogLevel(level) {
            if (LOG_LEVEL[level]) {
                logLevel = level;
            }
            else {
                logLevel = LOG_LEVEL.warn;
            }
        }
        function error(message, error) {
            var extraParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                extraParams[_i - 2] = arguments[_i];
            }
            if (logLevel >= LOG_LEVEL.error && typeof console !== 'undefined') {
                var logMsg = label + message + '\n';
                if (error) {
                    console.error.apply(console, __spreadArray([logMsg + '\n', error], extraParams, false));
                }
                else {
                    console.error.apply(console, __spreadArray([logMsg], extraParams, false));
                }
            }
        }
        function warn(message, error) {
            var extraParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                extraParams[_i - 2] = arguments[_i];
            }
            if (logLevel >= LOG_LEVEL.warn && typeof console !== 'undefined') {
                var logMsg = label + message;
                if (error) {
                    console.warn.apply(console, __spreadArray([logMsg + '\n', error], extraParams, false));
                }
                else {
                    console.warn.apply(console, __spreadArray([logMsg], extraParams, false));
                }
            }
        }
        function debug(message) {
            var extraParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                extraParams[_i - 1] = arguments[_i];
            }
            if (logLevel >= LOG_LEVEL.debug && typeof console !== 'undefined') {
                console.debug.apply(console, __spreadArray([label + message], extraParams, false));
            }
        }
        function info(message) {
            var extraParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                extraParams[_i - 1] = arguments[_i];
            }
            if (logLevel >= LOG_LEVEL.info && typeof console !== 'undefined') {
                console.info.apply(console, __spreadArray([label + message], extraParams, false));
            }
        }
        return { setLogLevel: setLogLevel, warn: warn, error: error, debug: debug, info: info };
    }
    function globalContexts() {
        var globalPrimitives = [];
        var conditionalProviders = [];
        var assembleAllContexts = function (event) {
            var eventSchema = getUsefulSchema(event);
            var eventType = getEventType(event);
            var contexts = [];
            var generatedPrimitives = generatePrimitives(globalPrimitives, event, eventType, eventSchema);
            contexts.push.apply(contexts, generatedPrimitives);
            var generatedConditionals = generateConditionals(conditionalProviders, event, eventType, eventSchema);
            contexts.push.apply(contexts, generatedConditionals);
            return contexts;
        };
        return {
            getGlobalPrimitives: function () {
                return globalPrimitives;
            },
            getConditionalProviders: function () {
                return conditionalProviders;
            },
            addGlobalContexts: function (contexts) {
                var acceptedConditionalContexts = [];
                var acceptedContextPrimitives = [];
                for (var _i = 0, contexts_1 = contexts; _i < contexts_1.length; _i++) {
                    var context = contexts_1[_i];
                    if (isConditionalContextProvider(context)) {
                        acceptedConditionalContexts.push(context);
                    }
                    else if (isContextPrimitive(context)) {
                        acceptedContextPrimitives.push(context);
                    }
                }
                globalPrimitives = globalPrimitives.concat(acceptedContextPrimitives);
                conditionalProviders = conditionalProviders.concat(acceptedConditionalContexts);
            },
            clearGlobalContexts: function () {
                conditionalProviders = [];
                globalPrimitives = [];
            },
            removeGlobalContexts: function (contexts) {
                var _loop_1 = function (context) {
                    if (isConditionalContextProvider(context)) {
                        conditionalProviders = conditionalProviders.filter(function (item) { return JSON.stringify(item) !== JSON.stringify(context); });
                    }
                    else if (isContextPrimitive(context)) {
                        globalPrimitives = globalPrimitives.filter(function (item) { return JSON.stringify(item) !== JSON.stringify(context); });
                    }
                };
                for (var _i = 0, contexts_2 = contexts; _i < contexts_2.length; _i++) {
                    var context = contexts_2[_i];
                    _loop_1(context);
                }
            },
            getApplicableContexts: function (event) {
                return assembleAllContexts(event);
            }
        };
    }
    function pluginContexts(plugins) {
        return {
            addPluginContexts: function (additionalContexts) {
                var combinedContexts = additionalContexts ? __spreadArray([], additionalContexts, true) : [];
                plugins.forEach(function (plugin) {
                    try {
                        if (plugin.contexts) {
                            combinedContexts.push.apply(combinedContexts, plugin.contexts());
                        }
                    }
                    catch (ex) {
                        LOG$1.error('Error adding plugin contexts', ex);
                    }
                });
                return combinedContexts;
            }
        };
    }
    function resolveDynamicContext(dynamicOrStaticContexts) {
        var _a;
        var extraParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extraParams[_i - 1] = arguments[_i];
        }
        return ((_a = dynamicOrStaticContexts === null || dynamicOrStaticContexts === void 0 ? void 0 : dynamicOrStaticContexts.map(function (context) {
            if (typeof context === 'function') {
                try {
                    return context.apply(void 0, extraParams);
                }
                catch (e) {
                    return undefined;
                }
            }
            else {
                return context;
            }
        }).filter(Boolean)) !== null && _a !== void 0 ? _a : []);
    }
    function getSchemaParts(input) {
        var re = new RegExp('^iglu:([a-zA-Z0-9-_.]+)/([a-zA-Z0-9-_]+)/jsonschema/([1-9][0-9]*)-(0|[1-9][0-9]*)-(0|[1-9][0-9]*)$');
        var matches = re.exec(input);
        if (matches !== null)
            return matches.slice(1, 6);
        return undefined;
    }
    function validateVendorParts(parts) {
        if (parts[0] === '*' || parts[1] === '*') {
            return false;
        }
        if (parts.slice(2).length > 0) {
            var asterisk = false;
            for (var _i = 0, _a = parts.slice(2); _i < _a.length; _i++) {
                var part = _a[_i];
                if (part === '*')
                    asterisk = true;
                else if (asterisk)
                    return false;
            }
            return true;
        }
        else if (parts.length == 2)
            return true;
        return false;
    }
    function validateVendor(input) {
        var parts = input.split('.');
        if (parts && parts.length > 1)
            return validateVendorParts(parts);
        return false;
    }
    function getRuleParts(input) {
        var re = new RegExp('^iglu:((?:(?:[a-zA-Z0-9-_]+|\\*).)+(?:[a-zA-Z0-9-_]+|\\*))/([a-zA-Z0-9-_.]+|\\*)/jsonschema/([1-9][0-9]*|\\*)-(0|[1-9][0-9]*|\\*)-(0|[1-9][0-9]*|\\*)$');
        var matches = re.exec(input);
        if (matches !== null && validateVendor(matches[1]))
            return matches.slice(1, 6);
        return undefined;
    }
    function isValidRule(input) {
        var ruleParts = getRuleParts(input);
        if (ruleParts) {
            var vendor = ruleParts[0];
            return ruleParts.length === 5 && validateVendor(vendor);
        }
        return false;
    }
    function isStringArray(input) {
        return (Array.isArray(input) &&
            input.every(function (x) {
                return typeof x === 'string';
            }));
    }
    function isValidRuleSetArg(input) {
        if (isStringArray(input))
            return input.every(function (x) {
                return isValidRule(x);
            });
        else if (typeof input === 'string')
            return isValidRule(input);
        return false;
    }
    function isSelfDescribingJson(input) {
        var sdj = input;
        if (isNonEmptyJson(sdj))
            if ('schema' in sdj && 'data' in sdj)
                return typeof sdj.schema === 'string' && typeof sdj.data === 'object';
        return false;
    }
    function isRuleSet(input) {
        var ruleSet = input;
        var ruleCount = 0;
        if (input != null && typeof input === 'object' && !Array.isArray(input)) {
            if (Object.prototype.hasOwnProperty.call(ruleSet, 'accept')) {
                if (isValidRuleSetArg(ruleSet['accept'])) {
                    ruleCount += 1;
                }
                else {
                    return false;
                }
            }
            if (Object.prototype.hasOwnProperty.call(ruleSet, 'reject')) {
                if (isValidRuleSetArg(ruleSet['reject'])) {
                    ruleCount += 1;
                }
                else {
                    return false;
                }
            }
            return ruleCount > 0 && ruleCount <= 2;
        }
        return false;
    }
    function isContextCallbackFunction(input) {
        return typeof input === 'function' && input.length <= 1;
    }
    function isContextPrimitive(input) {
        return isContextCallbackFunction(input) || isSelfDescribingJson(input);
    }
    function isFilterProvider(input) {
        if (Array.isArray(input)) {
            if (input.length === 2) {
                if (Array.isArray(input[1])) {
                    return isContextCallbackFunction(input[0]) && input[1].every(isContextPrimitive);
                }
                return isContextCallbackFunction(input[0]) && isContextPrimitive(input[1]);
            }
        }
        return false;
    }
    function isRuleSetProvider(input) {
        if (Array.isArray(input) && input.length === 2) {
            if (!isRuleSet(input[0]))
                return false;
            if (Array.isArray(input[1]))
                return input[1].every(isContextPrimitive);
            return isContextPrimitive(input[1]);
        }
        return false;
    }
    function isConditionalContextProvider(input) {
        return isFilterProvider(input) || isRuleSetProvider(input);
    }
    function matchSchemaAgainstRuleSet(ruleSet, schema) {
        var rejectCount = 0;
        var acceptCount = 0;
        var acceptRules = ruleSet['accept'];
        if (Array.isArray(acceptRules)) {
            if (ruleSet.accept.some(function (rule) { return matchSchemaAgainstRule(rule, schema); })) {
                acceptCount++;
            }
        }
        else if (typeof acceptRules === 'string') {
            if (matchSchemaAgainstRule(acceptRules, schema)) {
                acceptCount++;
            }
        }
        var rejectRules = ruleSet['reject'];
        if (Array.isArray(rejectRules)) {
            if (ruleSet.reject.some(function (rule) { return matchSchemaAgainstRule(rule, schema); })) {
                rejectCount++;
            }
        }
        else if (typeof rejectRules === 'string') {
            if (matchSchemaAgainstRule(rejectRules, schema)) {
                rejectCount++;
            }
        }
        if (acceptCount > 0 && rejectCount === 0) {
            return true;
        }
        else if (acceptCount === 0 && rejectCount > 0) {
            return false;
        }
        return false;
    }
    function matchSchemaAgainstRule(rule, schema) {
        if (!isValidRule(rule))
            return false;
        var ruleParts = getRuleParts(rule);
        var schemaParts = getSchemaParts(schema);
        if (ruleParts && schemaParts) {
            if (!matchVendor(ruleParts[0], schemaParts[0]))
                return false;
            for (var i = 1; i < 5; i++) {
                if (!matchPart(ruleParts[i], schemaParts[i]))
                    return false;
            }
            return true;
        }
        return false;
    }
    function matchVendor(rule, vendor) {
        var vendorParts = vendor.split('.');
        var ruleParts = rule.split('.');
        if (vendorParts && ruleParts) {
            if (vendorParts.length !== ruleParts.length)
                return false;
            for (var i = 0; i < ruleParts.length; i++) {
                if (!matchPart(vendorParts[i], ruleParts[i]))
                    return false;
            }
            return true;
        }
        return false;
    }
    function matchPart(rule, schema) {
        return (rule && schema && rule === '*') || rule === schema;
    }
    function getUsefulSchema(sb) {
        var eventJson = sb.getJson();
        for (var _i = 0, eventJson_1 = eventJson; _i < eventJson_1.length; _i++) {
            var json = eventJson_1[_i];
            if (json.keyIfEncoded === 'ue_px' && typeof json.json['data'] === 'object') {
                var schema = json.json['data']['schema'];
                if (typeof schema == 'string') {
                    return schema;
                }
            }
        }
        return '';
    }
    function getEventType(payloadBuilder) {
        var eventType = payloadBuilder.getPayload()['e'];
        return typeof eventType === 'string' ? eventType : '';
    }
    function buildGenerator(generator, event, eventType, eventSchema) {
        var contextGeneratorResult = undefined;
        try {
            var args = {
                event: event.getPayload(),
                eventType: eventType,
                eventSchema: eventSchema
            };
            contextGeneratorResult = generator(args);
            if (Array.isArray(contextGeneratorResult) && contextGeneratorResult.every(isSelfDescribingJson)) {
                return contextGeneratorResult;
            }
            else if (isSelfDescribingJson(contextGeneratorResult)) {
                return contextGeneratorResult;
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            contextGeneratorResult = undefined;
        }
        return contextGeneratorResult;
    }
    function normalizeToArray(input) {
        if (Array.isArray(input)) {
            return input;
        }
        return Array.of(input);
    }
    function generatePrimitives(contextPrimitives, event, eventType, eventSchema) {
        var _a;
        var normalizedInputs = normalizeToArray(contextPrimitives);
        var partialEvaluate = function (primitive) {
            var result = evaluatePrimitive(primitive, event, eventType, eventSchema);
            if (result && result.length !== 0) {
                return result;
            }
            return undefined;
        };
        var generatedContexts = normalizedInputs.map(partialEvaluate);
        return (_a = []).concat.apply(_a, generatedContexts.filter(function (c) { return c != null && c.filter(Boolean); }));
    }
    function evaluatePrimitive(contextPrimitive, event, eventType, eventSchema) {
        if (isSelfDescribingJson(contextPrimitive)) {
            return [contextPrimitive];
        }
        else if (isContextCallbackFunction(contextPrimitive)) {
            var generatorOutput = buildGenerator(contextPrimitive, event, eventType, eventSchema);
            if (isSelfDescribingJson(generatorOutput)) {
                return [generatorOutput];
            }
            else if (Array.isArray(generatorOutput)) {
                return generatorOutput;
            }
        }
        return undefined;
    }
    function evaluateProvider(provider, event, eventType, eventSchema) {
        if (isFilterProvider(provider)) {
            var filter = provider[0];
            var filterResult = false;
            try {
                var args = {
                    event: event.getPayload(),
                    eventType: eventType,
                    eventSchema: eventSchema
                };
                filterResult = filter(args);
            }
            catch (error) {
                filterResult = false;
            }
            if (filterResult === true) {
                return generatePrimitives(provider[1], event, eventType, eventSchema);
            }
        }
        else if (isRuleSetProvider(provider)) {
            if (matchSchemaAgainstRuleSet(provider[0], eventSchema)) {
                return generatePrimitives(provider[1], event, eventType, eventSchema);
            }
        }
        return [];
    }
    function generateConditionals(providers, event, eventType, eventSchema) {
        var _a;
        var normalizedInput = normalizeToArray(providers);
        var partialEvaluate = function (provider) {
            var result = evaluateProvider(provider, event, eventType, eventSchema);
            if (result && result.length !== 0) {
                return result;
            }
            return undefined;
        };
        var generatedContexts = normalizedInput.map(partialEvaluate);
        return (_a = []).concat.apply(_a, generatedContexts.filter(function (c) { return c != null && c.filter(Boolean); }));
    }
    function getTimestamp(timestamp) {
        if (timestamp == null) {
            return { type: 'dtm', value: new Date().getTime() };
        }
        else if (typeof timestamp === 'number') {
            return { type: 'dtm', value: timestamp };
        }
        else if (timestamp.type === 'ttm') {
            return { type: 'ttm', value: timestamp.value };
        }
        else {
            return { type: 'dtm', value: timestamp.value || new Date().getTime() };
        }
    }
    function trackerCore(configuration) {
        if (configuration === void 0) { configuration = {}; }
        function newCore(base64, corePlugins, callback) {
            var pluginContextsHelper = pluginContexts(corePlugins), globalContextsHelper = globalContexts();
            var encodeBase64 = base64, payloadPairs = {};
            function completeContexts(contexts) {
                if (contexts && contexts.length) {
                    return {
                        schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',
                        data: contexts
                    };
                }
                return undefined;
            }
            function attachGlobalContexts(pb, contexts) {
                var applicableContexts = globalContextsHelper.getApplicableContexts(pb);
                var returnedContexts = [];
                if (contexts && contexts.length) {
                    returnedContexts.push.apply(returnedContexts, contexts);
                }
                if (applicableContexts && applicableContexts.length) {
                    returnedContexts.push.apply(returnedContexts, applicableContexts);
                }
                return returnedContexts;
            }
            function track(pb, context, timestamp) {
                pb.withJsonProcessor(payloadJsonProcessor(encodeBase64));
                pb.add('eid', uuid_1.v4());
                pb.addDict(payloadPairs);
                var tstamp = getTimestamp(timestamp);
                pb.add(tstamp.type, tstamp.value.toString());
                var allContexts = attachGlobalContexts(pb, pluginContextsHelper.addPluginContexts(context));
                var wrappedContexts = completeContexts(allContexts);
                if (wrappedContexts !== undefined) {
                    pb.addJson('cx', 'co', wrappedContexts);
                }
                corePlugins.forEach(function (plugin) {
                    try {
                        if (plugin.beforeTrack) {
                            plugin.beforeTrack(pb);
                        }
                    }
                    catch (ex) {
                        LOG$1.error('Plugin beforeTrack', ex);
                    }
                });
                if (typeof callback === 'function') {
                    callback(pb);
                }
                var finalPayload = pb.build();
                corePlugins.forEach(function (plugin) {
                    try {
                        if (plugin.afterTrack) {
                            plugin.afterTrack(finalPayload);
                        }
                    }
                    catch (ex) {
                        LOG$1.error('Plugin afterTrack', ex);
                    }
                });
                return finalPayload;
            }
            function addPayloadPair(key, value) {
                payloadPairs[key] = value;
            }
            var core = {
                track: track,
                addPayloadPair: addPayloadPair,
                getBase64Encoding: function () {
                    return encodeBase64;
                },
                setBase64Encoding: function (encode) {
                    encodeBase64 = encode;
                },
                addPayloadDict: function (dict) {
                    for (var key in dict) {
                        if (Object.prototype.hasOwnProperty.call(dict, key)) {
                            payloadPairs[key] = dict[key];
                        }
                    }
                },
                resetPayloadPairs: function (dict) {
                    payloadPairs = isJson(dict) ? dict : {};
                },
                setTrackerVersion: function (version) {
                    addPayloadPair('tv', version);
                },
                setTrackerNamespace: function (name) {
                    addPayloadPair('tna', name);
                },
                setAppId: function (appId) {
                    addPayloadPair('aid', appId);
                },
                setPlatform: function (value) {
                    addPayloadPair('p', value);
                },
                /**
                 * set nuid parameter - which gets passed in every subsequent request to the collector
                 * @param UUID nuid 
                 */
                setNUID: function( nuid ) {
                    core.addPayloadPair('nuid', nuid);
                },
                setUserId: function (userId) {
                    addPayloadPair('uid', userId);
                },
                setScreenResolution: function (width, height) {
                    addPayloadPair('res', width + 'x' + height);
                },
                setViewport: function (width, height) {
                    addPayloadPair('vp', width + 'x' + height);
                },
                setColorDepth: function (depth) {
                    addPayloadPair('cd', depth);
                },
                setTimezone: function (timezone) {
                    addPayloadPair('tz', timezone);
                },
                setLang: function (lang) {
                    addPayloadPair('lang', lang);
                },
                setIpAddress: function (ip) {
                    addPayloadPair('ip', ip);
                },
                setUseragent: function (useragent) {
                    addPayloadPair('ua', useragent);
                },
                addGlobalContexts: function (contexts) {
                    globalContextsHelper.addGlobalContexts(contexts);
                },
                clearGlobalContexts: function () {
                    globalContextsHelper.clearGlobalContexts();
                },
                removeGlobalContexts: function (contexts) {
                    globalContextsHelper.removeGlobalContexts(contexts);
                }
            };
            return core;
        }
        var base64 = configuration.base64, corePlugins = configuration.corePlugins, callback = configuration.callback, plugins = corePlugins !== null && corePlugins !== void 0 ? corePlugins : [], partialCore = newCore(base64 !== null && base64 !== void 0 ? base64 : true, plugins, callback), core = __assign(__assign({}, partialCore), { addPlugin: function (configuration) {
                var _a, _b;
                var plugin = configuration.plugin;
                plugins.push(plugin);
                (_a = plugin.logger) === null || _a === void 0 ? void 0 : _a.call(plugin, LOG$1);
                (_b = plugin.activateCorePlugin) === null || _b === void 0 ? void 0 : _b.call(plugin, core);
            } });
        plugins === null || plugins === void 0 ? void 0 : plugins.forEach(function (plugin) {
            var _a, _b;
            (_a = plugin.logger) === null || _a === void 0 ? void 0 : _a.call(plugin, LOG$1);
            (_b = plugin.activateCorePlugin) === null || _b === void 0 ? void 0 : _b.call(plugin, core);
        });
        return core;
    }
    function buildSelfDescribingEvent(event) {
        var _a = event.event, schema = _a.schema, data = _a.data, pb = payloadBuilder();
        var ueJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0',
            data: { schema: schema, data: data }
        };
        pb.add('e', 'ue');
        pb.addJson('ue_px', 'ue_pr', ueJson);
        return pb;
    }
    function buildPageView(event) {
        var pageUrl = event.pageUrl, pageTitle = event.pageTitle, referrer = event.referrer, pb = payloadBuilder();
        pb.add('e', 'pv');
        pb.add('url', pageUrl);
        pb.add('page', pageTitle);
        pb.add('refr', referrer);
        return pb;
    }
    function buildPagePing(event) {
        var pageUrl = event.pageUrl, pageTitle = event.pageTitle, referrer = event.referrer, minXOffset = event.minXOffset, maxXOffset = event.maxXOffset, minYOffset = event.minYOffset, maxYOffset = event.maxYOffset, pb = payloadBuilder();
        pb.add('e', 'pp');
        pb.add('url', pageUrl);
        pb.add('page', pageTitle);
        pb.add('refr', referrer);
        if (minXOffset && !isNaN(Number(minXOffset)))
            pb.add('pp_mix', minXOffset.toString());
        if (maxXOffset && !isNaN(Number(maxXOffset)))
            pb.add('pp_max', maxXOffset.toString());
        if (minYOffset && !isNaN(Number(minYOffset)))
            pb.add('pp_miy', minYOffset.toString());
        if (maxYOffset && !isNaN(Number(maxYOffset)))
            pb.add('pp_may', maxYOffset.toString());
        return pb;
    }
    function buildStructEvent(event) {
        var category = event.category, action = event.action, label = event.label, property = event.property, value = event.value, pb = payloadBuilder();
        pb.add('e', 'se');
        pb.add('se_ca', category);
        pb.add('se_ac', action);
        pb.add('se_la', label);
        pb.add('se_pr', property);
        pb.add('se_va', value == null ? undefined : value.toString());
        return pb;
    }
    function buildEcommerceTransaction(event) {
        var orderId = event.orderId, total = event.total, affiliation = event.affiliation, tax = event.tax, shipping = event.shipping, city = event.city, state = event.state, country = event.country, currency = event.currency, pb = payloadBuilder();
        pb.add('e', 'tr');
        pb.add('tr_id', orderId);
        pb.add('tr_af', affiliation);
        pb.add('tr_tt', total);
        pb.add('tr_tx', tax);
        pb.add('tr_sh', shipping);
        pb.add('tr_ci', city);
        pb.add('tr_st', state);
        pb.add('tr_co', country);
        pb.add('tr_cu', currency);
        return pb;
    }
    function buildEcommerceTransactionItem(event) {
        var orderId = event.orderId, sku = event.sku, price = event.price, name = event.name, category = event.category, quantity = event.quantity, currency = event.currency, pb = payloadBuilder();
        pb.add('e', 'ti');
        pb.add('ti_id', orderId);
        pb.add('ti_sk', sku);
        pb.add('ti_nm', name);
        pb.add('ti_ca', category);
        pb.add('ti_pr', price);
        pb.add('ti_qu', quantity);
        pb.add('ti_cu', currency);
        return pb;
    }
    function buildLinkClick(event) {
        var targetUrl = event.targetUrl, elementId = event.elementId, elementClasses = event.elementClasses, elementTarget = event.elementTarget, elementContent = event.elementContent;
        var eventJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
            data: removeEmptyProperties({ targetUrl: targetUrl, elementId: elementId, elementClasses: elementClasses, elementTarget: elementTarget, elementContent: elementContent })
        };
        return buildSelfDescribingEvent({ event: eventJson });
    }
    function buildAdImpression(event) {
        var impressionId = event.impressionId, costModel = event.costModel, cost = event.cost, targetUrl = event.targetUrl, bannerId = event.bannerId, zoneId = event.zoneId, advertiserId = event.advertiserId, campaignId = event.campaignId;
        var eventJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0',
            data: removeEmptyProperties({
                impressionId: impressionId,
                costModel: costModel,
                cost: cost,
                targetUrl: targetUrl,
                bannerId: bannerId,
                zoneId: zoneId,
                advertiserId: advertiserId,
                campaignId: campaignId
            })
        };
        return buildSelfDescribingEvent({ event: eventJson });
    }
    function buildAdClick(event) {
        var targetUrl = event.targetUrl, clickId = event.clickId, costModel = event.costModel, cost = event.cost, bannerId = event.bannerId, zoneId = event.zoneId, impressionId = event.impressionId, advertiserId = event.advertiserId, campaignId = event.campaignId;
        var eventJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/ad_click/jsonschema/1-0-0',
            data: removeEmptyProperties({
                targetUrl: targetUrl,
                clickId: clickId,
                costModel: costModel,
                cost: cost,
                bannerId: bannerId,
                zoneId: zoneId,
                impressionId: impressionId,
                advertiserId: advertiserId,
                campaignId: campaignId
            })
        };
        return buildSelfDescribingEvent({ event: eventJson });
    }
    function buildAdConversion(event) {
        var conversionId = event.conversionId, costModel = event.costModel, cost = event.cost, category = event.category, action = event.action, property = event.property, initialValue = event.initialValue, advertiserId = event.advertiserId, campaignId = event.campaignId;
        var eventJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/ad_conversion/jsonschema/1-0-0',
            data: removeEmptyProperties({
                conversionId: conversionId,
                costModel: costModel,
                cost: cost,
                category: category,
                action: action,
                property: property,
                initialValue: initialValue,
                advertiserId: advertiserId,
                campaignId: campaignId
            })
        };
        return buildSelfDescribingEvent({ event: eventJson });
    }
    function buildSocialInteraction(event) {
        var action = event.action, network = event.network, target = event.target;
        var eventJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/social_interaction/jsonschema/1-0-0',
            data: removeEmptyProperties({ action: action, network: network, target: target })
        };
        return buildSelfDescribingEvent({ event: eventJson });
    }
    function buildAddToCart(event) {
        var sku = event.sku, quantity = event.quantity, name = event.name, category = event.category, unitPrice = event.unitPrice, currency = event.currency;
        return buildSelfDescribingEvent({
            event: {
                schema: 'iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0',
                data: removeEmptyProperties({
                    sku: sku,
                    quantity: quantity,
                    name: name,
                    category: category,
                    unitPrice: unitPrice,
                    currency: currency
                })
            }
        });
    }
    function buildRemoveFromCart(event) {
        var sku = event.sku, quantity = event.quantity, name = event.name, category = event.category, unitPrice = event.unitPrice, currency = event.currency;
        return buildSelfDescribingEvent({
            event: {
                schema: 'iglu:com.snowplowanalytics.snowplow/remove_from_cart/jsonschema/1-0-0',
                data: removeEmptyProperties({
                    sku: sku,
                    quantity: quantity,
                    name: name,
                    category: category,
                    unitPrice: unitPrice,
                    currency: currency
                })
            }
        });
    }
    function buildFormFocusOrChange(event) {
        var event_schema = '';
        var schema = event.schema, formId = event.formId, elementId = event.elementId, nodeName = event.nodeName, elementClasses = event.elementClasses, value = event.value, type = event.type;
        var event_data = { formId: formId, elementId: elementId, nodeName: nodeName, elementClasses: elementClasses, value: value };
        if (schema === 'change_form') {
            event_schema = 'iglu:com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0';
            event_data.type = type;
        }
        else if (schema === 'focus_form') {
            event_schema = 'iglu:com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0';
            event_data.elementType = type;
        }
        return buildSelfDescribingEvent({
            event: {
                schema: event_schema,
                data: removeEmptyProperties(event_data, { value: true })
            }
        });
    }
    function buildFormSubmission(event) {
        var formId = event.formId, formClasses = event.formClasses, elements = event.elements;
        return buildSelfDescribingEvent({
            event: {
                schema: 'iglu:com.snowplowanalytics.snowplow/submit_form/jsonschema/1-0-0',
                data: removeEmptyProperties({ formId: formId, formClasses: formClasses, elements: elements })
            }
        });
    }
    function buildSiteSearch(event) {
        var terms = event.terms, filters = event.filters, totalResults = event.totalResults, pageResults = event.pageResults;
        return buildSelfDescribingEvent({
            event: {
                schema: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0',
                data: removeEmptyProperties({ terms: terms, filters: filters, totalResults: totalResults, pageResults: pageResults })
            }
        });
    }
    function buildConsentWithdrawn(event) {
        var all = event.all, id = event.id, version = event.version, name = event.name, description = event.description;
        var documentJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0',
            data: removeEmptyProperties({ id: id, version: version, name: name, description: description })
        };
        return {
            event: buildSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.snowplowanalytics.snowplow/consent_withdrawn/jsonschema/1-0-0',
                    data: removeEmptyProperties({
                        all: all
                    })
                }
            }),
            context: [documentJson]
        };
    }
    function buildConsentGranted(event) {
        var expiry = event.expiry, id = event.id, version = event.version, name = event.name, description = event.description;
        var documentJson = {
            schema: 'iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0',
            data: removeEmptyProperties({ id: id, version: version, name: name, description: description })
        };
        return {
            event: buildSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0',
                    data: removeEmptyProperties({
                        expiry: expiry
                    })
                }
            }),
            context: [documentJson]
        };
    }
    function removeEmptyProperties(event, exemptFields) {
        if (exemptFields === void 0) { exemptFields = {}; }
        var ret = {};
        for (var k in event) {
            if (exemptFields[k] || (event[k] !== null && typeof event[k] !== 'undefined')) {
                ret[k] = event[k];
            }
        }
        return ret;
    }
    var version = version$1;

    var sha1 = {exports: {}};

    var crypt = {exports: {}};

    (function() {
      var base64map
          = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      crypt$1 = {
        rotl: function(n, b) {
          return (n << b) | (n >>> (32 - b));
        },
        rotr: function(n, b) {
          return (n << (32 - b)) | (n >>> b);
        },
        endian: function(n) {
          if (n.constructor == Number) {
            return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
          }
          for (var i = 0; i < n.length; i++)
            n[i] = crypt$1.endian(n[i]);
          return n;
        },
        randomBytes: function(n) {
          for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
          return bytes;
        },
        bytesToWords: function(bytes) {
          for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << (24 - b % 32);
          return words;
        },
        wordsToBytes: function(words) {
          for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
          return bytes;
        },
        bytesToHex: function(bytes) {
          for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
          }
          return hex.join('');
        },
        hexToBytes: function(hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
          return bytes;
        },
        bytesToBase64: function(bytes) {
          for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            for (var j = 0; j < 4; j++)
              if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
              else
                base64.push('=');
          }
          return base64.join('');
        },
        base64ToBytes: function(base64) {
          base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');
          for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
              imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push(((base64map.indexOf(base64.charAt(i - 1))
                & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
                | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
          }
          return bytes;
        }
      };
      crypt.exports = crypt$1;
    })();

    var charenc = {
      utf8: {
        stringToBytes: function(str) {
          return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
        },
        bytesToString: function(bytes) {
          return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
        }
      },
      bin: {
        stringToBytes: function(str) {
          for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 0xFF);
          return bytes;
        },
        bytesToString: function(bytes) {
          for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
          return str.join('');
        }
      }
    };
    var charenc_1 = charenc;

    (function() {
      var crypt$1 = crypt.exports,
          utf8 = charenc_1.utf8,
          bin = charenc_1.bin,
      sha1$1 = function (message) {
        if (message.constructor == String)
          message = utf8.stringToBytes(message);
        else if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
          message = Array.prototype.slice.call(message, 0);
        else if (!Array.isArray(message))
          message = message.toString();
        var m  = crypt$1.bytesToWords(message),
            l  = message.length * 8,
            w  = [],
            H0 =  1732584193,
            H1 = -271733879,
            H2 = -1732584194,
            H3 =  271733878,
            H4 = -1009589776;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >>> 9) << 4) + 15] = l;
        for (var i = 0; i < m.length; i += 16) {
          var a = H0,
              b = H1,
              c = H2,
              d = H3,
              e = H4;
          for (var j = 0; j < 80; j++) {
            if (j < 16)
              w[j] = m[i + j];
            else {
              var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
              w[j] = (n << 1) | (n >>> 31);
            }
            var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                    j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                    j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                    j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                             (H1 ^ H2 ^ H3) - 899497514);
            H4 = H3;
            H3 = H2;
            H2 = (H1 << 30) | (H1 >>> 2);
            H1 = H0;
            H0 = t;
          }
          H0 += a;
          H1 += b;
          H2 += c;
          H3 += d;
          H4 += e;
        }
        return [H0, H1, H2, H3, H4];
      },
      api = function (message, options) {
        var digestbytes = crypt$1.wordsToBytes(sha1$1(message));
        return options && options.asBytes ? digestbytes :
            options && options.asString ? bin.bytesToString(digestbytes) :
            crypt$1.bytesToHex(digestbytes);
      };
      api._blocksize = 16;
      api._digestsize = 20;
      sha1.exports = api;
    })();
    var hash = sha1.exports;

    function hasLocalStorage() {
        try {
            return !!window.localStorage;
        }
        catch (e) {
            return true;
        }
    }
    function localStorageAccessible() {
        var mod = 'modernizr';
        if (!hasLocalStorage()) {
            return false;
        }
        try {
            var ls = window.localStorage;
            ls.setItem(mod, mod);
            ls.removeItem(mod);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function detectViewport() {
        var width, height;
        if ('innerWidth' in window) {
            width = window['innerWidth'];
            height = window['innerHeight'];
        }
        else {
            var e = document.documentElement || document.body;
            width = e['clientWidth'];
            height = e['clientHeight'];
        }
        if (width >= 0 && height >= 0) {
            return width + 'x' + height;
        }
        else {
            return null;
        }
    }
    function detectDocumentSize() {
        var de = document.documentElement,
        be = document.body,
        bodyHeight = be ? Math.max(be.offsetHeight, be.scrollHeight) : 0;
        var w = Math.max(de.clientWidth, de.offsetWidth, de.scrollWidth);
        var h = Math.max(de.clientHeight, de.offsetHeight, de.scrollHeight, bodyHeight);
        return isNaN(w) || isNaN(h) ? '' : w + 'x' + h;
    }
    function isString(str) {
        if (str && typeof str.valueOf() === 'string') {
            return true;
        }
        return false;
    }
    function isInteger(int) {
        return ((Number.isInteger && Number.isInteger(int)) || (typeof int === 'number' && isFinite(int) && Math.floor(int) === int));
    }
    function isFunction(func) {
        if (func && typeof func === 'function') {
            return true;
        }
        return false;
    }
    function fixupTitle(title) {
        if (!isString(title)) {
            title = title.text || '';
            var tmp = document.getElementsByTagName('title');
            if (tmp && tmp[0] != null) {
                title = tmp[0].text;
            }
        }
        return title;
    }
    function getHostName(url) {
        var e = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)'), matches = e.exec(url);
        return matches ? matches[1] : url;
    }
    function fixupDomain(domain) {
        var dl = domain.length;
        if (domain.charAt(--dl) === '.') {
            domain = domain.slice(0, dl);
        }
        if (domain.slice(0, 2) === '*.') {
            domain = domain.slice(1);
        }
        return domain;
    }
    function getReferrer(oldLocation) {
        var windowAlias = window, fromQs = fromQuerystring('referrer', windowAlias.location.href) || fromQuerystring('referer', windowAlias.location.href);
        if (fromQs) {
            return fromQs;
        }
        if (oldLocation) {
            return oldLocation;
        }
        try {
            if (windowAlias.top) {
                return windowAlias.top.document.referrer;
            }
            else if (windowAlias.parent) {
                return windowAlias.parent.document.referrer;
            }
        }
        catch (_a) { }
        return document.referrer;
    }
    function addEventListener(element, eventType, eventHandler, options) {
        if (element.addEventListener) {
            element.addEventListener(eventType, eventHandler, options);
            return true;
        }
        if (element.attachEvent) {
            return element.attachEvent('on' + eventType, eventHandler);
        }
        element['on' + eventType] = eventHandler;
    }
    function fromQuerystring(field, url) {
        var match = new RegExp('^[^#]*[?&]' + field + '=([^&#]*)').exec(url);
        if (!match) {
            return null;
        }
        return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    function decorateQuerystring(url, name, value) {
        var initialQsParams = name + '=' + value;
        var hashSplit = url.split('#');
        var qsSplit = hashSplit[0].split('?');
        var beforeQuerystring = qsSplit.shift();
        var querystring = qsSplit.join('?');
        if (!querystring) {
            querystring = initialQsParams;
        }
        else {
            var initialDecoration = true;
            var qsFields = querystring.split('&');
            for (var i = 0; i < qsFields.length; i++) {
                if (qsFields[i].substr(0, name.length + 1) === name + '=') {
                    initialDecoration = false;
                    qsFields[i] = initialQsParams;
                    querystring = qsFields.join('&');
                    break;
                }
            }
            if (initialDecoration) {
                querystring = initialQsParams + '&' + querystring;
            }
        }
        hashSplit[0] = beforeQuerystring + '?' + querystring;
        return hashSplit.join('#');
    }
    function attemptGetLocalStorage(key) {
        try {
            var localStorageAlias = window.localStorage, exp = localStorageAlias.getItem(key + '.expires');
            if (exp === null || +exp > Date.now()) {
                return localStorageAlias.getItem(key);
            }
            else {
                localStorageAlias.removeItem(key);
                localStorageAlias.removeItem(key + '.expires');
            }
            return undefined;
        }
        catch (e) {
            return undefined;
        }
    }
    function attemptWriteLocalStorage(key, value, ttl) {
        if (ttl === void 0) { ttl = 63072000; }
        try {
            var localStorageAlias = window.localStorage, t = Date.now() + ttl * 1000;
            localStorageAlias.setItem("".concat(key, ".expires"), t.toString());
            localStorageAlias.setItem(key, value);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function attemptDeleteLocalStorage(key) {
        try {
            var localStorageAlias = window.localStorage;
            localStorageAlias.removeItem(key);
            localStorageAlias.removeItem(key + '.expires');
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function findRootDomain(sameSite, secure) {
        var windowLocationHostnameAlias = window.location.hostname, cookiePrefix = '_sp_root_domain_test_', cookieName = cookiePrefix + new Date().getTime(), cookieValue = '_test_value_' + new Date().getTime();
        var split = windowLocationHostnameAlias.split('.');
        var position = split.length - 1;
        while (position >= 0) {
            var currentDomain = split.slice(position, split.length).join('.');
            cookie(cookieName, cookieValue, 0, '/', currentDomain, sameSite, secure);
            if (cookie(cookieName) === cookieValue) {
                deleteCookie(cookieName, currentDomain, sameSite, secure);
                var cookieNames = getCookiesWithPrefix(cookiePrefix);
                for (var i = 0; i < cookieNames.length; i++) {
                    deleteCookie(cookieNames[i], currentDomain, sameSite, secure);
                }
                return currentDomain;
            }
            position -= 1;
        }
        return windowLocationHostnameAlias;
    }
    function deleteCookie(cookieName, domainName, sameSite, secure) {
        cookie(cookieName, '', -1, '/', domainName, sameSite, secure);
    }
    function getCookiesWithPrefix(cookiePrefix) {
        var cookies = document.cookie.split('; ');
        var cookieNames = [];
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].substring(0, cookiePrefix.length) === cookiePrefix) {
                cookieNames.push(cookies[i]);
            }
        }
        return cookieNames;
    }
    function cookie(name, value, ttl, path, domain, samesite, secure) {
        if (arguments.length > 1) {
            return (document.cookie =
                name +
                    '=' +
                    encodeURIComponent(value !== null && value !== void 0 ? value : '') +
                    (ttl ? '; Expires=' + new Date(+new Date() + ttl * 1000).toUTCString() : '') +
                    (path ? '; Path=' + path : '') +
                    (domain ? '; Domain=' + domain : '') +
                    (samesite ? '; SameSite=' + samesite : '') +
                    (secure ? '; Secure' : ''));
        }
        return decodeURIComponent((('; ' + document.cookie).split('; ' + name + '=')[1] || '').split(';')[0]);
    }
    function parseAndValidateInt(obj) {
        var result = parseInt(obj);
        return isNaN(result) ? undefined : result;
    }
    function parseAndValidateFloat(obj) {
        var result = parseFloat(obj);
        return isNaN(result) ? undefined : result;
    }
    function getFilterByClass(criterion) {
        if (criterion == null || typeof criterion !== 'object' || Array.isArray(criterion)) {
            return function () {
                return true;
            };
        }
        var inclusive = Object.prototype.hasOwnProperty.call(criterion, 'allowlist');
        var specifiedClassesSet = getSpecifiedClassesSet(criterion);
        return getFilter(criterion, function (elt) {
            return checkClass(elt, specifiedClassesSet) === inclusive;
        });
    }
    function getFilterByName(criterion) {
        if (criterion == null || typeof criterion !== 'object' || Array.isArray(criterion)) {
            return function () {
                return true;
            };
        }
        var inclusive = criterion.hasOwnProperty('allowlist');
        var specifiedClassesSet = getSpecifiedClassesSet(criterion);
        return getFilter(criterion, function (elt) {
            return elt.name in specifiedClassesSet === inclusive;
        });
    }
    function getCssClasses(elt) {
        return elt.className.match(/\S+/g) || [];
    }
    function checkClass(elt, classList) {
        var classes = getCssClasses(elt);
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var className = classes_1[_i];
            if (classList[className]) {
                return true;
            }
        }
        return false;
    }
    function getFilter(criterion, fallbackFilter) {
        if (criterion.hasOwnProperty('filter') && criterion.filter) {
            return criterion.filter;
        }
        return fallbackFilter;
    }
    function getSpecifiedClassesSet(criterion) {
        var specifiedClassesSet = {};
        var specifiedClasses = criterion.allowlist || criterion.denylist;
        if (specifiedClasses) {
            if (!Array.isArray(specifiedClasses)) {
                specifiedClasses = [specifiedClasses];
            }
            for (var i = 0; i < specifiedClasses.length; i++) {
                specifiedClassesSet[specifiedClasses[i]] = true;
            }
        }
        return specifiedClassesSet;
    }
    function OutQueueManager(id, sharedSate, useLocalStorage, eventMethod, postPath, bufferSize, maxPostBytes, maxGetBytes, useStm, maxLocalStorageQueueSize, connectionTimeout, anonymousTracking, customHeaders, withCredentials) {
        var executingQueue = false, configCollectorUrl, outQueue = [];
        eventMethod = typeof eventMethod === 'string' ? eventMethod.toLowerCase() : eventMethod;
        var isBeaconRequested = eventMethod === true || eventMethod === 'beacon' || eventMethod === 'true',
        isBeaconAvailable = Boolean(isBeaconRequested &&
            window.navigator &&
            window.navigator.sendBeacon &&
            !hasWebKitBeaconBug(window.navigator.userAgent)), useBeacon = isBeaconAvailable && isBeaconRequested,
        isGetRequested = eventMethod === 'get',
        useXhr = Boolean(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()),
        usePost = !isGetRequested && useXhr && (eventMethod === 'post' || isBeaconRequested),
        path = usePost ? postPath : '/i',
        queueName = "snowplowOutQueue_".concat(id, "_").concat(usePost ? 'post2' : 'get');
        if (isBeaconRequested)
            customHeaders = {};
        bufferSize = (useLocalStorage && localStorageAccessible() && usePost && bufferSize) || 1;
        if (useLocalStorage) {
            try {
                var localStorageQueue = window.localStorage.getItem(queueName);
                outQueue = localStorageQueue ? JSON.parse(localStorageQueue) : [];
            }
            catch (e) { }
        }
        if (!Array.isArray(outQueue)) {
            outQueue = [];
        }
        sharedSate.outQueues.push(outQueue);
        if (useXhr && bufferSize > 1) {
            sharedSate.bufferFlushers.push(function (sync) {
                if (!executingQueue) {
                    executeQueue(sync);
                }
            });
        }
        function getQuerystring(request) {
            var querystring = '?', lowPriorityKeys = { co: true, cx: true }, firstPair = true;
            for (var key in request) {
                if (request.hasOwnProperty(key) && !lowPriorityKeys.hasOwnProperty(key)) {
                    if (!firstPair) {
                        querystring += '&';
                    }
                    else {
                        firstPair = false;
                    }
                    querystring += encodeURIComponent(key) + '=' + encodeURIComponent(request[key]);
                }
            }
            for (var contextKey in lowPriorityKeys) {
                if (request.hasOwnProperty(contextKey) && lowPriorityKeys.hasOwnProperty(contextKey)) {
                    querystring += '&' + contextKey + '=' + encodeURIComponent(request[contextKey]);
                }
            }
            return querystring;
        }
        function getBody(request) {
            var cleanedRequest = Object.keys(request)
                .map(function (k) { return [k, request[k]]; })
                .reduce(function (acc, _a) {
                var key = _a[0], value = _a[1];
                acc[key] = value.toString();
                return acc;
            }, {});
            return {
                evt: cleanedRequest,
                bytes: getUTF8Length(JSON.stringify(cleanedRequest))
            };
        }
        function getUTF8Length(s) {
            var len = 0;
            for (var i = 0; i < s.length; i++) {
                var code = s.charCodeAt(i);
                if (code <= 0x7f) {
                    len += 1;
                }
                else if (code <= 0x7ff) {
                    len += 2;
                }
                else if (code >= 0xd800 && code <= 0xdfff) {
                    len += 4;
                    i++;
                }
                else if (code < 0xffff) {
                    len += 3;
                }
                else {
                    len += 4;
                }
            }
            return len;
        }
        var postable = function (queue) {
            return typeof queue[0] === 'object';
        };
        function sendPostRequestWithoutQueueing(body, configCollectorUrl) {
            var xhr = initializeXMLHttpRequest(configCollectorUrl, true, false);
            xhr.send(encloseInPayloadDataEnvelope(attachStmToEvent([body.evt])));
        }
        function enqueueRequest(request, url) {
            configCollectorUrl = url + path;
            var eventTooBigWarning = function (bytes, maxBytes) {
                return LOG$1.warn('Event (' + bytes + 'B) too big, max is ' + maxBytes);
            };
            if (usePost) {
                var body = getBody(request);
                if (body.bytes >= maxPostBytes) {
                    eventTooBigWarning(body.bytes, maxPostBytes);
                    sendPostRequestWithoutQueueing(body, configCollectorUrl);
                    return;
                }
                else {
                    outQueue.push(body);
                }
            }
            else {
                var querystring = getQuerystring(request);
                if (maxGetBytes > 0) {
                    var requestUrl = createGetUrl(querystring);
                    var bytes = getUTF8Length(requestUrl);
                    if (bytes >= maxGetBytes) {
                        eventTooBigWarning(bytes, maxGetBytes);
                        if (useXhr) {
                            var body = getBody(request);
                            var postUrl = url + postPath;
                            sendPostRequestWithoutQueueing(body, postUrl);
                        }
                        return;
                    }
                }
                outQueue.push(querystring);
            }
            var savedToLocalStorage = false;
            if (useLocalStorage) {
                savedToLocalStorage = attemptWriteLocalStorage(queueName, JSON.stringify(outQueue.slice(0, maxLocalStorageQueueSize)));
            }
            if (!executingQueue && (!savedToLocalStorage || outQueue.length >= bufferSize)) {
                executeQueue();
            }
        }
        function executeQueue(sync) {
            if (sync === void 0) { sync = false; }
            while (outQueue.length && typeof outQueue[0] !== 'string' && typeof outQueue[0] !== 'object') {
                outQueue.shift();
            }
            if (outQueue.length < 1) {
                executingQueue = false;
                return;
            }
            if (!isString(configCollectorUrl)) {
                throw 'No collector configured';
            }
            executingQueue = true;
            if (useXhr) {
                var chooseHowManyToSend = function (queue) {
                    var numberToSend = 0, byteCount = 0;
                    while (numberToSend < queue.length) {
                        byteCount += queue[numberToSend].bytes;
                        if (byteCount >= maxPostBytes) {
                            break;
                        }
                        else {
                            numberToSend += 1;
                        }
                    }
                    return numberToSend;
                };
                var url = void 0, xhr_1, numberToSend_1;
                if (postable(outQueue)) {
                    url = configCollectorUrl;
                    xhr_1 = initializeXMLHttpRequest(url, true, sync);
                    numberToSend_1 = chooseHowManyToSend(outQueue);
                }
                else {
                    url = createGetUrl(outQueue[0]);
                    xhr_1 = initializeXMLHttpRequest(url, false, sync);
                    numberToSend_1 = 1;
                }
                var xhrTimeout_1 = setTimeout(function () {
                    xhr_1.abort();
                    executingQueue = false;
                }, connectionTimeout);
                var onPostSuccess_1 = function (numberToSend) {
                    for (var deleteCount = 0; deleteCount < numberToSend; deleteCount++) {
                        outQueue.shift();
                    }
                    if (useLocalStorage) {
                        attemptWriteLocalStorage(queueName, JSON.stringify(outQueue.slice(0, maxLocalStorageQueueSize)));
                    }
                    executeQueue();
                };
                xhr_1.onreadystatechange = function () {
                    if (xhr_1.readyState === 4 && xhr_1.status >= 200 && xhr_1.status < 400) {
                        clearTimeout(xhrTimeout_1);
                        onPostSuccess_1(numberToSend_1);
                    }
                    else if (xhr_1.readyState === 4 && xhr_1.status >= 400) {
                        clearTimeout(xhrTimeout_1);
                        executingQueue = false;
                    }
                };
                if (!postable(outQueue)) {
                    xhr_1.send();
                }
                else {
                    var batch = outQueue.slice(0, numberToSend_1);
                    if (batch.length > 0) {
                        var beaconStatus = false;
                        var eventBatch = batch.map(function (x) {
                            return x.evt;
                        });
                        if (useBeacon) {
                            var blob = new Blob([encloseInPayloadDataEnvelope(attachStmToEvent(eventBatch))], {
                                type: 'application/json'
                            });
                            try {
                                beaconStatus = navigator.sendBeacon(url, blob);
                            }
                            catch (error) {
                                beaconStatus = false;
                            }
                        }
                        if (beaconStatus === true) {
                            onPostSuccess_1(numberToSend_1);
                        }
                        else {
                            xhr_1.send(encloseInPayloadDataEnvelope(attachStmToEvent(eventBatch)));
                        }
                    }
                }
            }
            else if (!anonymousTracking && !postable(outQueue)) {
                var image = new Image(1, 1), loading_1 = true;
                image.onload = function () {
                    if (!loading_1)
                        return;
                    loading_1 = false;
                    outQueue.shift();
                    if (useLocalStorage) {
                        attemptWriteLocalStorage(queueName, JSON.stringify(outQueue.slice(0, maxLocalStorageQueueSize)));
                    }
                    executeQueue();
                };
                image.onerror = function () {
                    if (!loading_1)
                        return;
                    loading_1 = false;
                    executingQueue = false;
                };
                image.src = createGetUrl(outQueue[0]);
                setTimeout(function () {
                    if (loading_1 && executingQueue) {
                        loading_1 = false;
                        executeQueue();
                    }
                }, connectionTimeout);
            }
            else {
                executingQueue = false;
            }
        }
        function initializeXMLHttpRequest(url, post, sync) {
            var xhr = new XMLHttpRequest();
            if (post) {
                xhr.open('POST', url, !sync);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            }
            else {
                xhr.open('GET', url, !sync);
            }
            xhr.withCredentials = withCredentials;
            if (anonymousTracking) {
                xhr.setRequestHeader('SP-Anonymous', '*');
            }
            for (var header in customHeaders) {
                if (Object.prototype.hasOwnProperty.call(customHeaders, header)) {
                    xhr.setRequestHeader(header, customHeaders[header]);
                }
            }
            return xhr;
        }
        function encloseInPayloadDataEnvelope(events) {
            return JSON.stringify({
                schema: 'iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4',
                data: events
            });
        }
        function attachStmToEvent(events) {
            var stm = new Date().getTime().toString();
            for (var i = 0; i < events.length; i++) {
                events[i]['stm'] = stm;
            }
            return events;
        }
        function createGetUrl(nextRequest) {
            if (useStm) {
                return configCollectorUrl + nextRequest.replace('?', '?stm=' + new Date().getTime() + '&');
            }
            return configCollectorUrl + nextRequest;
        }
        return {
            enqueueRequest: enqueueRequest,
            executeQueue: function () {
                if (!executingQueue) {
                    executeQueue();
                }
            },
            setUseLocalStorage: function (localStorage) {
                useLocalStorage = localStorage;
            },
            setAnonymousTracking: function (anonymous) {
                anonymousTracking = anonymous;
            },
            setCollectorUrl: function (url) {
                configCollectorUrl = url + path;
            },
            setBufferSize: function (newBufferSize) {
                bufferSize = newBufferSize;
            }
        };
        function hasWebKitBeaconBug(useragent) {
            return (isIosVersionLessThanOrEqualTo(13, useragent) ||
                (isMacosxVersionLessThanOrEqualTo(10, 15, useragent) && isSafari(useragent)));
            function isIosVersionLessThanOrEqualTo(major, useragent) {
                var match = useragent.match('(iP.+; CPU .*OS (d+)[_d]*.*) AppleWebKit/');
                if (match && match.length) {
                    return parseInt(match[0]) <= major;
                }
                return false;
            }
            function isMacosxVersionLessThanOrEqualTo(major, minor, useragent) {
                var match = useragent.match('(Macintosh;.*Mac OS X (d+)_(d+)[_d]*.*) AppleWebKit/');
                if (match && match.length) {
                    return parseInt(match[0]) <= major || (parseInt(match[0]) === major && parseInt(match[1]) <= minor);
                }
                return false;
            }
            function isSafari(useragent) {
                return useragent.match('Version/.* Safari/') && !isChromiumBased(useragent);
            }
            function isChromiumBased(useragent) {
                return useragent.match('Chrom(e|ium)');
            }
        }
    }
    function getParameter(url, name) {
        var e = new RegExp('^(?:https?|ftp)(?::/*(?:[^?]+))([?][^#]+)'), matches = e.exec(url);
        if (matches && (matches === null || matches === void 0 ? void 0 : matches.length) > 1) {
            return fromQuerystring(name, matches[1]);
        }
        return null;
    }
    function fixupUrl(hostName, href, referrer) {
        var _a;
        if (hostName === 'translate.googleusercontent.com') {
            if (referrer === '') {
                referrer = href;
            }
            href = (_a = getParameter(href, 'u')) !== null && _a !== void 0 ? _a : '';
            hostName = getHostName(href);
        }
        else if (hostName === 'cc.bingj.com' ||
            hostName === 'webcache.googleusercontent.com'
        ) {
            href = document.links[0].href;
            hostName = getHostName(href);
        }
        return [hostName, href, referrer];
    }
    function Tracker(trackerId, namespace, version, endpoint, sharedState, trackerConfiguration) {
        if (trackerConfiguration === void 0) { trackerConfiguration = {}; }
        var browserPlugins = [];
        var newTracker = function (trackerId, namespace, version, endpoint, state, trackerConfiguration) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            trackerConfiguration.eventMethod = (_a = trackerConfiguration.eventMethod) !== null && _a !== void 0 ? _a : 'post';
            var getStateStorageStrategy = function (config) { var _a; return (_a = config.stateStorageStrategy) !== null && _a !== void 0 ? _a : 'cookieAndLocalStorage'; }, getAnonymousSessionTracking = function (config) {
                var _a, _b;
                if (typeof config.anonymousTracking === 'boolean') {
                    return false;
                }
                return (_b = ((_a = config.anonymousTracking) === null || _a === void 0 ? void 0 : _a.withSessionTracking) === true) !== null && _b !== void 0 ? _b : false;
            }, getAnonymousServerTracking = function (config) {
                var _a, _b;
                if (typeof config.anonymousTracking === 'boolean') {
                    return false;
                }
                return (_b = ((_a = config.anonymousTracking) === null || _a === void 0 ? void 0 : _a.withServerAnonymisation) === true) !== null && _b !== void 0 ? _b : false;
            }, getAnonymousTracking = function (config) { return !!config.anonymousTracking; };
            browserPlugins.push(getBrowserDataPlugin());
            if ((_c = (_b = trackerConfiguration === null || trackerConfiguration === void 0 ? void 0 : trackerConfiguration.contexts) === null || _b === void 0 ? void 0 : _b.webPage) !== null && _c !== void 0 ? _c : true) {
                browserPlugins.push(getWebPagePlugin());
            }
            browserPlugins.push.apply(browserPlugins, ((_d = trackerConfiguration.plugins) !== null && _d !== void 0 ? _d : []));
            // change to pass extra contexts along with every Snowplow event
            if (trackerConfiguration.hasOwnProperty("extraInfo") 
					&& trackerConfiguration.extraInfo.hasOwnProperty("extraContexts")) {
                browserPlugins.push(getExtraContext(trackerConfiguration.extraInfo.extraContexts));
			}
            
            var
            core = trackerCore({
                base64: trackerConfiguration.encodeBase64,
                corePlugins: browserPlugins,
                callback: sendRequest
            }),
            browserLanguage = navigator.userLanguage || navigator.language, documentCharset = document.characterSet || document.charset,
            locationArray = fixupUrl(window.location.hostname, window.location.href, getReferrer()), domainAlias = fixupDomain(locationArray[0]), locationHrefAlias = locationArray[1], configReferrerUrl = locationArray[2], customReferrer,
            configPlatform = (_e = trackerConfiguration.platform) !== null && _e !== void 0 ? _e : 'web',
            configCollectorUrl = asCollectorUrl(endpoint),
            configPostPath = (_f = trackerConfiguration.postPath) !== null && _f !== void 0 ? _f : '/com.snowplowanalytics.snowplow/tp2',
            configTrackerSiteId = (_g = trackerConfiguration.appId) !== null && _g !== void 0 ? _g : '',
            configCustomUrl,
            lastDocumentTitle = document.title,
            lastConfigTitle,
            resetActivityTrackingOnPageView = (_h = trackerConfiguration.resetActivityTrackingOnPageView) !== null && _h !== void 0 ? _h : true,
            configDiscardHashTag,
            configDiscardBrace,
            configCookieNamePrefix = (_j = trackerConfiguration.cookieName) !== null && _j !== void 0 ? _j : '_sp_',
            configCookieDomain = (_k = trackerConfiguration.cookieDomain) !== null && _k !== void 0 ? _k : undefined,
            configCookiePath = '/',
            configCookieSameSite = (_l = trackerConfiguration.cookieSameSite) !== null && _l !== void 0 ? _l : 'None',
            configCookieSecure = (_m = trackerConfiguration.cookieSecure) !== null && _m !== void 0 ? _m : true,
            dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack,
            configDoNotTrack = typeof trackerConfiguration.respectDoNotTrack !== 'undefined'
                ? trackerConfiguration.respectDoNotTrack && (dnt === 'yes' || dnt === '1')
                : false,
            configOptOutCookie,
            configVisitorCookieTimeout = (_o = trackerConfiguration.cookieLifetime) !== null && _o !== void 0 ? _o : 63072000,
            configSessionCookieTimeout = (_p = trackerConfiguration.sessionCookieTimeout) !== null && _p !== void 0 ? _p : 1800,
            configAnonymousSessionTracking = getAnonymousSessionTracking(trackerConfiguration),
            configAnonymousServerTracking = getAnonymousServerTracking(trackerConfiguration),
            configAnonymousTracking = getAnonymousTracking(trackerConfiguration),
            configStateStorageStrategy = getStateStorageStrategy(trackerConfiguration),
            lastActivityTime,
            lastEventTime = new Date().getTime(),
            minXOffset, maxXOffset, minYOffset, maxYOffset,
            domainHash,
            // Domain unique user ID
            // ncg domain user id, 
            ncgDomainUserId  = (
            	trackerConfiguration.hasOwnProperty('extraInfo') 
            		&& trackerConfiguration.extraInfo.hasOwnProperty('domainId') 
            		&& trackerConfiguration.extraInfo.domainId) 
            	? trackerConfiguration.extraInfo.domainId: null,
            domainUserId,
            memorizedSessionId,
            memorizedVisitCount = 1,
            businessUserId,
            outQueue = OutQueueManager(trackerId, state, configStateStorageStrategy == 'localStorage' || configStateStorageStrategy == 'cookieAndLocalStorage', trackerConfiguration.eventMethod, configPostPath, (_q = trackerConfiguration.bufferSize) !== null && _q !== void 0 ? _q : 1, (_r = trackerConfiguration.maxPostBytes) !== null && _r !== void 0 ? _r : 40000, (_s = trackerConfiguration.maxGetBytes) !== null && _s !== void 0 ? _s : 0, (_t = trackerConfiguration.useStm) !== null && _t !== void 0 ? _t : true, (_u = trackerConfiguration.maxLocalStorageQueueSize) !== null && _u !== void 0 ? _u : 1000, (_v = trackerConfiguration.connectionTimeout) !== null && _v !== void 0 ? _v : 5000, configAnonymousServerTracking, (_w = trackerConfiguration.customHeaders) !== null && _w !== void 0 ? _w : {}, (_x = trackerConfiguration.withCredentials) !== null && _x !== void 0 ? _x : true),
            preservePageViewId = false,
            pageViewSent = false,
            activityTrackingConfig = {
                enabled: false,
                installed: false,
                configurations: {}
            };
            if (trackerConfiguration.hasOwnProperty('discoverRootDomain') && trackerConfiguration.discoverRootDomain) {
                configCookieDomain = findRootDomain(configCookieSameSite, configCookieSecure);
            }
            core.setTrackerVersion(version);
            core.setTrackerNamespace(namespace);
            core.setAppId(configTrackerSiteId);
            core.setPlatform(configPlatform);
            core.addPayloadPair('cookie', navigator.cookieEnabled ? '1' : '0');
            core.addPayloadPair('cs', documentCharset);
            core.addPayloadPair('lang', browserLanguage);
            core.addPayloadPair('res', screen.width + 'x' + screen.height);
            core.addPayloadPair('cd', screen.colorDepth);
			// set network User ID
            if (trackerConfiguration.hasOwnProperty('extraInfo') 
					&& trackerConfiguration.extraInfo.hasOwnProperty("nuId")
					&& trackerConfiguration.extraInfo.nuId) {
						core.addPayloadPair('nuid', trackerConfiguration.extraInfo.nuId);		
			}
            updateDomainHash();
            initializeIdsAndCookies();
            if (trackerConfiguration.crossDomainLinker) {
                decorateLinks(trackerConfiguration.crossDomainLinker);
            }
            function refreshUrl() {
                locationArray = fixupUrl(window.location.hostname, window.location.href, getReferrer());
                if (locationArray[1] !== locationHrefAlias) {
                    configReferrerUrl = getReferrer(locationHrefAlias);
                }
                domainAlias = fixupDomain(locationArray[0]);
                locationHrefAlias = locationArray[1];
            }
            function linkDecorationHandler(evt) {
                var timestamp = new Date().getTime();
                var elt = evt.currentTarget;
                if (elt === null || elt === void 0 ? void 0 : elt.href) {
                    elt.href = decorateQuerystring(elt.href, '_sp', domainUserId + '.' + timestamp);
                }
            }
            function decorateLinks(crossDomainLinker) {
                for (var i = 0; i < document.links.length; i++) {
                    var elt = document.links[i];
                    if (!elt.spDecorationEnabled && crossDomainLinker(elt)) {
                        addEventListener(elt, 'click', linkDecorationHandler, true);
                        addEventListener(elt, 'mousedown', linkDecorationHandler, true);
                        elt.spDecorationEnabled = true;
                    }
                }
            }
            function purify(url) {
                var targetPattern;
                if (configDiscardHashTag) {
                    targetPattern = new RegExp('#.*');
                    url = url.replace(targetPattern, '');
                }
                if (configDiscardBrace) {
                    targetPattern = new RegExp('[{}]', 'g');
                    url = url.replace(targetPattern, '');
                }
                return url;
            }
            function getProtocolScheme(url) {
                var e = new RegExp('^([a-z]+):'), matches = e.exec(url);
                return matches ? matches[1] : null;
            }
            function resolveRelativeReference(baseUrl, url) {
                var protocol = getProtocolScheme(url), i;
                if (protocol) {
                    return url;
                }
                if (url.slice(0, 1) === '/') {
                    return getProtocolScheme(baseUrl) + '://' + getHostName(baseUrl) + url;
                }
                baseUrl = purify(baseUrl);
                if ((i = baseUrl.indexOf('?')) >= 0) {
                    baseUrl = baseUrl.slice(0, i);
                }
                if ((i = baseUrl.lastIndexOf('/')) !== baseUrl.length - 1) {
                    baseUrl = baseUrl.slice(0, i + 1);
                }
                return baseUrl + url;
            }
            function sendRequest(request) {
                var toOptoutByCookie;
                if (configOptOutCookie) {
                    toOptoutByCookie = !!cookie(configOptOutCookie);
                }
                else {
                    toOptoutByCookie = false;
                }
                if (!(configDoNotTrack || toOptoutByCookie)) {
                    outQueue.enqueueRequest(request.build(), configCollectorUrl);
                }
            }
            function getSnowplowCookieName(baseName) {
                return configCookieNamePrefix + baseName + '.' + domainHash;
            }
            function getSnowplowCookieValue(cookieName) {
                var fullName = getSnowplowCookieName(cookieName);
                if (configStateStorageStrategy == 'localStorage') {
                    return attemptGetLocalStorage(fullName);
                }
                else if (configStateStorageStrategy == 'cookie' || configStateStorageStrategy == 'cookieAndLocalStorage') {
                    return cookie(fullName);
                }
                return undefined;
            }
            function updateDomainHash() {
                refreshUrl();
                domainHash = hash((configCookieDomain || domainAlias) + (configCookiePath || '/')).slice(0, 4);
            }
            function activityHandler() {
                var now = new Date();
                lastActivityTime = now.getTime();
            }
            function scrollHandler() {
                updateMaxScrolls();
                activityHandler();
            }
            function getPageOffsets() {
                var documentElement = document.documentElement;
                if (documentElement) {
                    return [documentElement.scrollLeft || window.pageXOffset, documentElement.scrollTop || window.pageYOffset];
                }
                return [0, 0];
            }
            function resetMaxScrolls() {
                var offsets = getPageOffsets();
                var x = offsets[0];
                minXOffset = x;
                maxXOffset = x;
                var y = offsets[1];
                minYOffset = y;
                maxYOffset = y;
            }
            function updateMaxScrolls() {
                var offsets = getPageOffsets();
                var x = offsets[0];
                if (x < minXOffset) {
                    minXOffset = x;
                }
                else if (x > maxXOffset) {
                    maxXOffset = x;
                }
                var y = offsets[1];
                if (y < minYOffset) {
                    minYOffset = y;
                }
                else if (y > maxYOffset) {
                    maxYOffset = y;
                }
            }
            function cleanOffset(offset) {
                return Math.round(offset);
            }
            function setSessionCookie() {
                var cookieName = getSnowplowCookieName('ses');
                var cookieValue = '*';
                setCookie(cookieName, cookieValue, configSessionCookieTimeout);
            }
            function setDomainUserIdCookie(domainUserId, createTs, visitCount, nowTs, lastVisitTs, sessionId) {
                var cookieName = getSnowplowCookieName('id');
                var cookieValue = domainUserId + '.' + createTs + '.' + visitCount + '.' + nowTs + '.' + lastVisitTs + '.' + sessionId;
                setCookie(cookieName, cookieValue, configVisitorCookieTimeout);
            }
            function setCookie(name, value, timeout) {
                if (configAnonymousTracking && !configAnonymousSessionTracking) {
                    return;
                }
                if (configStateStorageStrategy == 'localStorage') {
                    attemptWriteLocalStorage(name, value, timeout);
                }
                else if (configStateStorageStrategy == 'cookie' || configStateStorageStrategy == 'cookieAndLocalStorage') {
                    cookie(name, value, timeout, configCookiePath, configCookieDomain, configCookieSameSite, configCookieSecure);
                }
            }
            function clearUserDataAndCookies(configuration) {
                var idname = getSnowplowCookieName('id');
                var sesname = getSnowplowCookieName('ses');
                attemptDeleteLocalStorage(idname);
                attemptDeleteLocalStorage(sesname);
                deleteCookie(idname, configCookieDomain, configCookieSameSite, configCookieSecure);
                deleteCookie(sesname, configCookieDomain, configCookieSameSite, configCookieSecure);
                if (!(configuration === null || configuration === void 0 ? void 0 : configuration.preserveSession)) {
                    memorizedSessionId = uuid_1.v4();
                    memorizedVisitCount = 0;
                }
                if (!(configuration === null || configuration === void 0 ? void 0 : configuration.preserveUser)) {
                    domainUserId = uuid_1.v4();
                    businessUserId = null;
                }
            }
            function toggleAnonymousTracking(configuration) {
                if (configuration && configuration.stateStorageStrategy) {
                    trackerConfiguration.stateStorageStrategy = configuration.stateStorageStrategy;
                    configStateStorageStrategy = getStateStorageStrategy(trackerConfiguration);
                }
                configAnonymousTracking = getAnonymousTracking(trackerConfiguration);
                configAnonymousSessionTracking = getAnonymousSessionTracking(trackerConfiguration);
                configAnonymousServerTracking = getAnonymousServerTracking(trackerConfiguration);
                outQueue.setUseLocalStorage(configStateStorageStrategy == 'localStorage' || configStateStorageStrategy == 'cookieAndLocalStorage');
                outQueue.setAnonymousTracking(configAnonymousServerTracking);
            }
            function initializeIdsAndCookies() {
                if (configAnonymousTracking && !configAnonymousSessionTracking) {
                    return;
                }
                var sesCookieSet = configStateStorageStrategy != 'none' && !!getSnowplowCookieValue('ses');
                var idCookieComponents = loadDomainUserIdCookie();
                if (idCookieComponents[1]) {
                    domainUserId = idCookieComponents[1];
                    // externally supplied domain id overrides
					if (ncgDomainUserId && ncgDomainUserId !== domainUserId) {
						domainUserId = ncgDomainUserId;
						idCookieComponents[1] = ncgDomainUserId;
					}
                }
                else if (!configAnonymousTracking) {
                    domainUserId = (ncgDomainUserId) ? ncgDomainUserId: uuid_1.v4();
                    idCookieComponents[1] = domainUserId;
                }
                else {
                    domainUserId = '';
                    idCookieComponents[1] = domainUserId;
                }
                memorizedSessionId = idCookieComponents[6];
                if (!sesCookieSet) {
                    idCookieComponents[3]++;
                    memorizedSessionId = uuid_1.v4();
                    idCookieComponents[6] = memorizedSessionId;
                    idCookieComponents[5] = idCookieComponents[4];
                }
                if (configStateStorageStrategy != 'none') {
                    setSessionCookie();
                    idCookieComponents[4] = Math.round(new Date().getTime() / 1000);
                    idCookieComponents.shift();
                    setDomainUserIdCookie.apply(null, idCookieComponents);
                }
            }
            function loadDomainUserIdCookie() {
                if (configStateStorageStrategy == 'none') {
                    return [];
                }
                var now = new Date(), nowTs = Math.round(now.getTime() / 1000), id = getSnowplowCookieValue('id'), tmpContainer;
                if (id) {
                    tmpContainer = id.split('.');
                    tmpContainer.unshift('0');
                }
                else {
                    tmpContainer = [
                        '1',
                        domainUserId,
                        nowTs,
                        0,
                        nowTs,
                        '',
                    ];
                }
                if (!tmpContainer[6] || tmpContainer[6] === 'undefined') {
                    tmpContainer[6] = uuid_1.v4();
                }
                return tmpContainer;
            }
            function asCollectorUrl(collectorUrl) {
                if (collectorUrl.indexOf('http') === 0) {
                    return collectorUrl;
                }
                return ('https:' === document.location.protocol ? 'https' : 'http') + '://' + collectorUrl;
            }
            function resetPageView() {
                if (!preservePageViewId || state.pageViewId == null) {
                    state.pageViewId = uuid_1.v4();
                }
            }
            function getPageViewId() {
                if (state.pageViewId == null) {
                    state.pageViewId = uuid_1.v4();
                }
                return state.pageViewId;
            }
            function getWebPagePlugin() {
                return {
                    contexts: function () {
                        return [
                            {
                                schema: 'iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0',
                                data: {
                                    id: getPageViewId()
                                }
                            },
                        ];
                    }
                };
            }
			// change to pass extra contexts along with every Snowplow event
            function getExtraContext(extraContexts) {
                return {
                    contexts: function () {
                        return extraContexts;
                    }
                };
            }
            function getBrowserDataPlugin() {
                return {
                    beforeTrack: function (payloadBuilder) {
                        var anonymizeOr = function (value) { return (configAnonymousTracking ? null : value); };
                        var anonymizeSessionOr = function (value) {
                            return configAnonymousSessionTracking ? value : anonymizeOr(value);
                        };
                        var nowTs = Math.round(new Date().getTime() / 1000), ses = getSnowplowCookieValue('ses'), id = loadDomainUserIdCookie(), cookiesDisabled = id[0], _domainUserId = id[1],
                        createTs = id[2], visitCount = id[3], currentVisitTs = id[4], lastVisitTs = id[5], sessionIdFromCookie = id[6];
                        var toOptoutByCookie;
                        if (configOptOutCookie) {
                            toOptoutByCookie = !!cookie(configOptOutCookie);
                        }
                        else {
                            toOptoutByCookie = false;
                        }
                        if (configDoNotTrack || toOptoutByCookie) {
                            clearUserDataAndCookies();
                            return;
                        }
                        if (cookiesDisabled === '0') {
                            memorizedSessionId = sessionIdFromCookie;
                            if (!ses && configStateStorageStrategy != 'none') {
                                visitCount++;
                                lastVisitTs = currentVisitTs;
                                memorizedSessionId = uuid_1.v4();
                            }
                            memorizedVisitCount = visitCount;
                        }
                        else if (new Date().getTime() - lastEventTime > configSessionCookieTimeout * 1000) {
                            memorizedSessionId = uuid_1.v4();
                            memorizedVisitCount++;
                        }
                        payloadBuilder.add('vp', detectViewport());
                        payloadBuilder.add('ds', detectDocumentSize());
                        // payloadBuilder.add('vid', anonymizeSessionOr(memorizedVisitCount));
                        // payloadBuilder.add('sid', anonymizeSessionOr(memorizedSessionId));
                        // payloadBuilder.add('duid', anonymizeOr(_domainUserId));
                        // payloadBuilder.add('uid', anonymizeOr(businessUserId));
                        // Supress anonymizing of vid,sid,duid,uid when anonymousTracking Enabled
                        payloadBuilder.add('vid', memorizedVisitCount);
                        payloadBuilder.add('sid', memorizedSessionId);
                        payloadBuilder.add('duid', _domainUserId);
                        payloadBuilder.add('uid', businessUserId);
                        refreshUrl();
                        payloadBuilder.add('refr', purify(customReferrer || configReferrerUrl));
                        payloadBuilder.add('url', purify(configCustomUrl || locationHrefAlias));
                        if (configStateStorageStrategy != 'none') {
                            setDomainUserIdCookie(_domainUserId, createTs, memorizedVisitCount, nowTs, lastVisitTs, memorizedSessionId);
                            setSessionCookie();
                        }
                        lastEventTime = new Date().getTime();
                    }
                };
            }
            function newSession() {
                var nowTs = Math.round(new Date().getTime() / 1000), id = loadDomainUserIdCookie(), cookiesDisabled = id[0], _domainUserId = id[1],
                createTs = id[2], visitCount = id[3], currentVisitTs = id[4], lastVisitTs = id[5], sessionIdFromCookie = id[6];
                if (cookiesDisabled === '0') {
                    memorizedSessionId = sessionIdFromCookie;
                    if (configStateStorageStrategy != 'none') {
                        visitCount++;
                        lastVisitTs = currentVisitTs;
                        memorizedSessionId = uuid_1.v4();
                    }
                    memorizedVisitCount = visitCount;
                    setSessionCookie();
                }
                else {
                    memorizedSessionId = uuid_1.v4();
                    memorizedVisitCount++;
                }
                if (configStateStorageStrategy != 'none') {
                    setDomainUserIdCookie(_domainUserId, createTs, memorizedVisitCount, nowTs, lastVisitTs, memorizedSessionId);
                    setSessionCookie();
                }
                lastEventTime = new Date().getTime();
            }
            function finalizeContexts(staticContexts, contextCallback) {
                return (staticContexts || []).concat(contextCallback ? contextCallback() : []);
            }
            function logPageView(_a) {
                var title = _a.title, context = _a.context, timestamp = _a.timestamp, contextCallback = _a.contextCallback;
                refreshUrl();
                if (pageViewSent) {
                    resetPageView();
                }
                pageViewSent = true;
                lastDocumentTitle = document.title;
                lastConfigTitle = title;
                var pageTitle = fixupTitle(lastConfigTitle || lastDocumentTitle);
                core.track(buildPageView({
                    pageUrl: purify(configCustomUrl || locationHrefAlias),
                    pageTitle: pageTitle,
                    referrer: purify(customReferrer || configReferrerUrl)
                }), finalizeContexts(context, contextCallback), timestamp);
                var now = new Date();
                var installingActivityTracking = false;
                if (activityTrackingConfig.enabled && !activityTrackingConfig.installed) {
                    activityTrackingConfig.installed = true;
                    installingActivityTracking = true;
                    var detectPassiveEvents_1 = {
                        update: function update() {
                            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                                var passive_1 = false;
                                var options = Object.defineProperty({}, 'passive', {
                                    get: function get() {
                                        passive_1 = true;
                                    },
                                    set: function set() { }
                                });
                                var noop = function noop() { };
                                window.addEventListener('testPassiveEventSupport', noop, options);
                                window.removeEventListener('testPassiveEventSupport', noop, options);
                                detectPassiveEvents_1.hasSupport = passive_1;
                            }
                        }
                    };
                    detectPassiveEvents_1.update();
                    var wheelEvent = 'onwheel' in document.createElement('div')
                        ? 'wheel'
                        : document.onmousewheel !== undefined
                            ? 'mousewheel'
                            : 'DOMMouseScroll';
                    if (Object.prototype.hasOwnProperty.call(detectPassiveEvents_1, 'hasSupport')) {
                        addEventListener(document, wheelEvent, activityHandler, { passive: true });
                    }
                    else {
                        addEventListener(document, wheelEvent, activityHandler);
                    }
                    resetMaxScrolls();
                    var documentHandlers = ['click', 'mouseup', 'mousedown', 'mousemove', 'keypress', 'keydown', 'keyup'];
                    var windowHandlers = ['resize', 'focus', 'blur'];
                    var listener = function (_, handler) {
                        if (handler === void 0) { handler = activityHandler; }
                        return function (ev) {
                            return addEventListener(document, ev, handler);
                        };
                    };
                    documentHandlers.forEach(listener(document));
                    windowHandlers.forEach(listener(window));
                    listener(window, scrollHandler)('scroll');
                }
                if (activityTrackingConfig.enabled && (resetActivityTrackingOnPageView || installingActivityTracking)) {
                    lastActivityTime = now.getTime();
                    var key = void 0;
                    for (key in activityTrackingConfig.configurations) {
                        var config = activityTrackingConfig.configurations[key];
                        if (config) {
                            window.clearInterval(config.activityInterval);
                            activityInterval(config, context, contextCallback);
                        }
                    }
                }
            }
            function activityInterval(config, context, contextCallback) {
                var executePagePing = function (cb, c) {
                    refreshUrl();
                    cb({ context: c, pageViewId: getPageViewId(), minXOffset: minXOffset, minYOffset: minYOffset, maxXOffset: maxXOffset, maxYOffset: maxYOffset });
                    resetMaxScrolls();
                };
                var timeout = function () {
                    var now = new Date();
                    if (lastActivityTime + config.configMinimumVisitLength > now.getTime()) {
                        executePagePing(config.callback, finalizeContexts(context, contextCallback));
                    }
                    config.activityInterval = window.setInterval(heartbeat, config.configHeartBeatTimer);
                };
                var heartbeat = function () {
                    var now = new Date();
                    if (lastActivityTime + config.configHeartBeatTimer > now.getTime()) {
                        executePagePing(config.callback, finalizeContexts(context, contextCallback));
                    }
                };
                if (config.configMinimumVisitLength != 0) {
                    config.activityInterval = window.setTimeout(timeout, config.configMinimumVisitLength);
                }
                else {
                    config.activityInterval = window.setInterval(heartbeat, config.configHeartBeatTimer);
                }
            }
            function configureActivityTracking(configuration) {
                var minimumVisitLength = configuration.minimumVisitLength, heartbeatDelay = configuration.heartbeatDelay, callback = configuration.callback;
                if (isInteger(minimumVisitLength) && isInteger(heartbeatDelay)) {
                    return {
                        configMinimumVisitLength: minimumVisitLength * 1000,
                        configHeartBeatTimer: heartbeatDelay * 1000,
                        callback: callback
                    };
                }
                LOG$1.error('Activity tracking minimumVisitLength & heartbeatDelay must be integers');
                return undefined;
            }
            function logPagePing(_a) {
                var context = _a.context, minXOffset = _a.minXOffset, minYOffset = _a.minYOffset, maxXOffset = _a.maxXOffset, maxYOffset = _a.maxYOffset;
                var newDocumentTitle = document.title;
                if (newDocumentTitle !== lastDocumentTitle) {
                    lastDocumentTitle = newDocumentTitle;
                    lastConfigTitle = undefined;
                }
                core.track(buildPagePing({
                    pageUrl: purify(configCustomUrl || locationHrefAlias),
                    pageTitle: fixupTitle(lastConfigTitle || lastDocumentTitle),
                    referrer: purify(customReferrer || configReferrerUrl),
                    minXOffset: cleanOffset(minXOffset),
                    maxXOffset: cleanOffset(maxXOffset),
                    minYOffset: cleanOffset(minYOffset),
                    maxYOffset: cleanOffset(maxYOffset)
                }), context);
            }
            var apiMethods = {
                getDomainSessionIndex: function () {
                    return memorizedVisitCount;
                },
                getPageViewId: function () {
                    return getPageViewId();
                },
                newSession: newSession,
                getCookieName: function (basename) {
                    return getSnowplowCookieName(basename);
                },
                getUserId: function () {
                    return businessUserId;
                },
                getDomainUserId: function () {
                    return loadDomainUserIdCookie()[1];
                },
                getDomainUserInfo: function () {
                    return loadDomainUserIdCookie();
                },
                setReferrerUrl: function (url) {
                    customReferrer = url;
                },
                setCustomUrl: function (url) {
                    refreshUrl();
                    configCustomUrl = resolveRelativeReference(locationHrefAlias, url);
                },
                setDocumentTitle: function (title) {
                    lastDocumentTitle = document.title;
                    lastConfigTitle = title;
                },
                discardHashTag: function (enableFilter) {
                    configDiscardHashTag = enableFilter;
                },
                discardBrace: function (enableFilter) {
                    configDiscardBrace = enableFilter;
                },
                setCookiePath: function (path) {
                    configCookiePath = path;
                    updateDomainHash();
                },
                setVisitorCookieTimeout: function (timeout) {
                    configVisitorCookieTimeout = timeout;
                },
                crossDomainLinker: function (crossDomainLinkerCriterion) {
                    decorateLinks(crossDomainLinkerCriterion);
                },
                enableActivityTracking: function (configuration) {
                    if (!activityTrackingConfig.configurations.pagePing) {
                        activityTrackingConfig.enabled = true;
                        activityTrackingConfig.configurations.pagePing = configureActivityTracking(__assign(__assign({}, configuration), { callback: logPagePing }));
                    }
                },
                enableActivityTrackingCallback: function (configuration) {
                    if (!activityTrackingConfig.configurations.callback) {
                        activityTrackingConfig.enabled = true;
                        activityTrackingConfig.configurations.callback = configureActivityTracking(configuration);
                    }
                },
                updatePageActivity: function () {
                    activityHandler();
                },
                setOptOutCookie: function (name) {
                    configOptOutCookie = name;
                },
                setUserId: function (userId) {
                    businessUserId = userId;
                },
                setUserIdFromLocation: function (querystringField) {
                    refreshUrl();
                    businessUserId = fromQuerystring(querystringField, locationHrefAlias);
                },
                setUserIdFromReferrer: function (querystringField) {
                    refreshUrl();
                    businessUserId = fromQuerystring(querystringField, configReferrerUrl);
                },
                setUserIdFromCookie: function (cookieName) {
                    businessUserId = cookie(cookieName);
                },
                setCollectorUrl: function (collectorUrl) {
                    configCollectorUrl = asCollectorUrl(collectorUrl);
                    outQueue.setCollectorUrl(configCollectorUrl);
                },
                setBufferSize: function (newBufferSize) {
                    outQueue.setBufferSize(newBufferSize);
                },
                flushBuffer: function (configuration) {
                    if (configuration === void 0) { configuration = {}; }
                    outQueue.executeQueue();
                    if (configuration.newBufferSize) {
                        outQueue.setBufferSize(configuration.newBufferSize);
                    }
                },
                trackPageView: function (event) {
                    if (event === void 0) { event = {}; }
                    logPageView(event);
                },
                preservePageViewId: function () {
                    preservePageViewId = true;
                },
                disableAnonymousTracking: function (configuration) {
                    trackerConfiguration.anonymousTracking = false;
                    toggleAnonymousTracking(configuration);
                    initializeIdsAndCookies();
                    outQueue.executeQueue();
                },
                enableAnonymousTracking: function (configuration) {
                    var _a;
                    trackerConfiguration.anonymousTracking = (_a = (configuration && (configuration === null || configuration === void 0 ? void 0 : configuration.options))) !== null && _a !== void 0 ? _a : true;
                    toggleAnonymousTracking(configuration);
                    if (!configAnonymousSessionTracking) {
                        resetPageView();
                    }
                },
                clearUserData: clearUserDataAndCookies
            };
            return __assign(__assign({}, apiMethods), { id: trackerId, namespace: namespace, core: core, sharedState: state });
        };
        var partialTracker = newTracker(trackerId, namespace, version, endpoint, sharedState, trackerConfiguration), tracker = __assign(__assign({}, partialTracker), { addPlugin: function (configuration) {
                var _a, _b;
                tracker.core.addPlugin(configuration);
                (_b = (_a = configuration.plugin).activateBrowserPlugin) === null || _b === void 0 ? void 0 : _b.call(_a, tracker);
            } });
        browserPlugins.forEach(function (p) {
            var _a;
            (_a = p.activateBrowserPlugin) === null || _a === void 0 ? void 0 : _a.call(p, tracker);
        });
        return tracker;
    }
    var namedTrackers = {};
    function dispatchToTrackers(trackers, fn) {
        try {
            getTrackers(trackers !== null && trackers !== void 0 ? trackers : allTrackerNames()).forEach(fn);
        }
        catch (ex) {
            LOG$1.error('Function failed', ex);
        }
    }
    function dispatchToTrackersInCollection(trackers, trackerCollection, fn) {
        try {
            getTrackersFromCollection(trackers !== null && trackers !== void 0 ? trackers : Object.keys(trackerCollection), trackerCollection).forEach(fn);
        }
        catch (ex) {
            LOG$1.error('Function failed', ex);
        }
    }
    function addTracker(trackerId, namespace, version, endpoint, sharedState, configuration) {
        if (!namedTrackers.hasOwnProperty(trackerId)) {
            namedTrackers[trackerId] = Tracker(trackerId, namespace, version, endpoint, sharedState, configuration);
            return namedTrackers[trackerId];
        }
        return null;
    }
    function getTrackers(trackerIds) {
        return getTrackersFromCollection(trackerIds, namedTrackers);
    }
    function allTrackerNames() {
        return Object.keys(namedTrackers);
    }
    function getTrackersFromCollection(trackerIds, trackerCollection) {
        var trackers = [];
        for (var _i = 0, trackerIds_1 = trackerIds; _i < trackerIds_1.length; _i++) {
            var id = trackerIds_1[_i];
            if (trackerCollection.hasOwnProperty(id)) {
                trackers.push(trackerCollection[id]);
            }
            else {
                LOG$1.warn(id + ' not configured');
            }
        }
        return trackers;
    }
    var SharedState =  (function () {
        function SharedState() {
            this.outQueues = [];
            this.bufferFlushers = [];
            this.hasLoaded = false;
            this.registeredOnLoadHandlers = [];
        }
        return SharedState;
    }());
    function createSharedState() {
        var sharedState = new SharedState(), documentAlias = document, windowAlias = window;
        function visibilityChangeHandler() {
            if (documentAlias.visibilityState == 'hidden') {
                sharedState.bufferFlushers.forEach(function (flusher) {
                    flusher(false);
                });
            }
        }
        function flushBuffers() {
            sharedState.bufferFlushers.forEach(function (flusher) {
                flusher(false);
            });
        }
        function loadHandler() {
            var i;
            if (!sharedState.hasLoaded) {
                sharedState.hasLoaded = true;
                for (i = 0; i < sharedState.registeredOnLoadHandlers.length; i++) {
                    sharedState.registeredOnLoadHandlers[i]();
                }
            }
            return true;
        }
        function addReadyListener() {
            if (documentAlias.addEventListener) {
                documentAlias.addEventListener('DOMContentLoaded', function ready() {
                    documentAlias.removeEventListener('DOMContentLoaded', ready, false);
                    loadHandler();
                });
            }
            else if (documentAlias.attachEvent) {
                documentAlias.attachEvent('onreadystatechange', function ready() {
                    if (documentAlias.readyState === 'complete') {
                        documentAlias.detachEvent('onreadystatechange', ready);
                        loadHandler();
                    }
                });
            }
            addEventListener(windowAlias, 'load', loadHandler, false);
        }
        if (documentAlias.visibilityState) {
            addEventListener(documentAlias, 'visibilitychange', visibilityChangeHandler, false);
        }
        addEventListener(windowAlias, 'beforeunload', flushBuffers, false);
        if (document.readyState === 'loading') {
            addReadyListener();
        }
        else {
            loadHandler();
        }
        return sharedState;
    }

    function newSession(trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.newSession();
        });
    }
    function setReferrerUrl(url, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setReferrerUrl(url);
        });
    }
    function setCustomUrl(url, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setCustomUrl(url);
        });
    }
    function setDocumentTitle(title, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setDocumentTitle(title);
        });
    }
    function discardHashTag(enable, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.discardHashTag(enable);
        });
    }
    function discardBrace(enable, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.discardBrace(enable);
        });
    }
    function setCookiePath(path, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setCookiePath(path);
        });
    }
    function setVisitorCookieTimeout(timeout, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setVisitorCookieTimeout(timeout);
        });
    }
    function crossDomainLinker(crossDomainLinkerCriterion, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.crossDomainLinker(crossDomainLinkerCriterion);
        });
    }
    function enableActivityTracking(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.enableActivityTracking(configuration);
        });
    }
    function enableActivityTrackingCallback(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.enableActivityTrackingCallback(configuration);
        });
    }
    function updatePageActivity(trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.updatePageActivity();
        });
    }
    function setOptOutCookie(name, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setOptOutCookie(name);
        });
    }
    function setUserId(userId, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setUserId(userId);
        });
    }
    function setUserIdFromLocation(querystringField, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setUserIdFromLocation(querystringField);
        });
    }
    function setUserIdFromReferrer(querystringField, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setUserIdFromReferrer(querystringField);
        });
    }
    function setUserIdFromCookie(cookieName, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setUserIdFromCookie(cookieName);
        });
    }
    function setCollectorUrl(collectorUrl, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setCollectorUrl(collectorUrl);
        });
    }
    function setBufferSize(newBufferSize, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.setBufferSize(newBufferSize);
        });
    }
    function flushBuffer(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.flushBuffer(configuration);
        });
    }
    function trackPageView(event, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.trackPageView(event);
        });
    }
    function trackStructEvent(event, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.core.track(buildStructEvent(event), event.context, event.timestamp);
        });
    }
    function trackSelfDescribingEvent(event, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.core.track(buildSelfDescribingEvent({ event: event.event }), event.context, event.timestamp);
        });
    }
    function addGlobalContexts(contexts, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.core.addGlobalContexts(contexts);
        });
    }
    function removeGlobalContexts(contexts, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.core.removeGlobalContexts(contexts);
        });
    }
    function clearGlobalContexts(trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.core.clearGlobalContexts();
        });
    }
    function preservePageViewId(trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.preservePageViewId();
        });
    }
    function disableAnonymousTracking(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.disableAnonymousTracking(configuration);
        });
    }
    function enableAnonymousTracking(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.enableAnonymousTracking(configuration);
        });
    }
    function clearUserData(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.clearUserData(configuration);
        });
    }
    function addPlugin(configuration, trackers) {
        dispatchToTrackers(trackers, function (t) {
            t.addPlugin(configuration);
        });
    }
    var state = typeof window !== 'undefined' ? createSharedState() : undefined;
    function newTracker(trackerId, endpoint, configuration) {
        if (configuration === void 0) { configuration = {}; }
        if (state) {
            return addTracker(trackerId, trackerId, "js-".concat(version), endpoint, state, configuration);
        }
        else {
            return undefined;
        }
    }

    var Snowplow = /*#__PURE__*/Object.freeze({
        __proto__: null,
        addGlobalContexts: addGlobalContexts,
        addPlugin: addPlugin,
        clearGlobalContexts: clearGlobalContexts,
        clearUserData: clearUserData,
        crossDomainLinker: crossDomainLinker,
        disableAnonymousTracking: disableAnonymousTracking,
        discardBrace: discardBrace,
        discardHashTag: discardHashTag,
        enableActivityTracking: enableActivityTracking,
        enableActivityTrackingCallback: enableActivityTrackingCallback,
        enableAnonymousTracking: enableAnonymousTracking,
        flushBuffer: flushBuffer,
        newSession: newSession,
        newTracker: newTracker,
        preservePageViewId: preservePageViewId,
        removeGlobalContexts: removeGlobalContexts,
        setBufferSize: setBufferSize,
        setCollectorUrl: setCollectorUrl,
        setCookiePath: setCookiePath,
        setCustomUrl: setCustomUrl,
        setDocumentTitle: setDocumentTitle,
        setOptOutCookie: setOptOutCookie,
        setReferrerUrl: setReferrerUrl,
        setUserId: setUserId,
        setUserIdFromCookie: setUserIdFromCookie,
        setUserIdFromLocation: setUserIdFromLocation,
        setUserIdFromReferrer: setUserIdFromReferrer,
        setVisitorCookieTimeout: setVisitorCookieTimeout,
        trackPageView: trackPageView,
        trackSelfDescribingEvent: trackSelfDescribingEvent,
        trackStructEvent: trackStructEvent,
        updatePageActivity: updatePageActivity,
        version: version
    });

    var uaClientHints;
    function ClientHintsPlugin(includeHighEntropy) {
        var populateClientHints = function () {
            var navigatorAlias = navigator;
            if (navigatorAlias.userAgentData) {
                uaClientHints = {
                    isMobile: navigatorAlias.userAgentData.mobile,
                    brands: navigatorAlias.userAgentData.brands
                };
                if (includeHighEntropy && navigatorAlias.userAgentData.getHighEntropyValues) {
                    navigatorAlias.userAgentData
                        .getHighEntropyValues(['platform', 'platformVersion', 'architecture', 'model', 'uaFullVersion'])
                        .then(function (res) {
                        uaClientHints.architecture = res.architecture;
                        uaClientHints.model = res.model;
                        uaClientHints.platform = res.platform;
                        uaClientHints.uaFullVersion = res.uaFullVersion;
                        uaClientHints.platformVersion = res.platformVersion;
                    });
                }
            }
        };
        return {
            activateBrowserPlugin: function () {
                if (!uaClientHints) {
                    populateClientHints();
                }
            },
            contexts: function () {
                if (uaClientHints) {
                    return [
                        {
                            schema: 'iglu:org.ietf/http_client_hints/jsonschema/1-0-0',
                            data: uaClientHints
                        },
                    ];
                }
                return [];
            }
        };
    }

    var ClientHints = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ClientHintsPlugin: ClientHintsPlugin
    });

    function OptimizelyXPlugin() {
        function getOptimizelyXData(property, snd) {
            var windowOptimizelyAlias = window.optimizely;
            var data;
            if (windowOptimizelyAlias && typeof windowOptimizelyAlias.get === 'function') {
                data = windowOptimizelyAlias.get(property);
                if (typeof snd !== 'undefined' && data !== undefined) {
                    data = data[snd];
                }
            }
            return data;
        }
        function getOptimizelyXSummary() {
            var state = getOptimizelyXData('state');
            var experiment_ids = state && state.getActiveExperimentIds();
            var variationMap = state && state.getVariationMap();
            var visitor = getOptimizelyXData('visitor');
            return experiment_ids.map(function (activeExperiment) {
                var variation = variationMap[activeExperiment];
                var variationName = (variation && variation.name && variation.name.toString()) || null;
                var variationId = variation && variation.id;
                var visitorId = (visitor && visitor.visitorId && visitor.visitorId.toString()) || null;
                return {
                    experimentId: parseAndValidateInt(activeExperiment) || null,
                    variationName: variationName,
                    variation: parseAndValidateInt(variationId) || null,
                    visitorId: visitorId
                };
            });
        }
        function getOptimizelyXSummaryContexts() {
            return getOptimizelyXSummary().map(function (experiment) {
                return {
                    schema: 'iglu:com.optimizely.optimizelyx/summary/jsonschema/1-0-0',
                    data: experiment
                };
            });
        }
        return {
            contexts: function () {
                if (window.optimizely) {
                    return getOptimizelyXSummaryContexts();
                }
                return [];
            }
        };
    }

    var OptimizelyX = /*#__PURE__*/Object.freeze({
        __proto__: null,
        OptimizelyXPlugin: OptimizelyXPlugin
    });

    function PerformanceTimingPlugin() {
        function getPerformanceTimingContext() {
            var windowAlias = window, performanceAlias = windowAlias.performance ||
                windowAlias.mozPerformance ||
                windowAlias.msPerformance ||
                windowAlias.webkitPerformance, performanceTimingAlias = performanceAlias.timing;
            if (performanceAlias) {
                var performanceTiming = {
                    navigationStart: performanceTimingAlias.navigationStart,
                    redirectStart: performanceTimingAlias.redirectStart,
                    redirectEnd: performanceTimingAlias.redirectEnd,
                    fetchStart: performanceTimingAlias.fetchStart,
                    domainLookupStart: performanceTimingAlias.domainLookupStart,
                    domainLookupEnd: performanceTimingAlias.domainLookupEnd,
                    connectStart: performanceTimingAlias.connectStart,
                    secureConnectionStart: performanceTimingAlias.secureConnectionStart,
                    connectEnd: performanceTimingAlias.connectEnd,
                    requestStart: performanceTimingAlias.requestStart,
                    responseStart: performanceTimingAlias.responseStart,
                    responseEnd: performanceTimingAlias.responseEnd,
                    unloadEventStart: performanceTimingAlias.unloadEventStart,
                    unloadEventEnd: performanceTimingAlias.unloadEventEnd,
                    domLoading: performanceTimingAlias.domLoading,
                    domInteractive: performanceTimingAlias.domInteractive,
                    domContentLoadedEventStart: performanceTimingAlias.domContentLoadedEventStart,
                    domContentLoadedEventEnd: performanceTimingAlias.domContentLoadedEventEnd,
                    domComplete: performanceTimingAlias.domComplete,
                    loadEventStart: performanceTimingAlias.loadEventStart,
                    loadEventEnd: performanceTimingAlias.loadEventEnd,
                    msFirstPaint: performanceTimingAlias.msFirstPaint,
                    chromeFirstPaint: performanceTimingAlias.chromeFirstPaint,
                    requestEnd: performanceTimingAlias.requestEnd,
                    proxyStart: performanceTimingAlias.proxyStart,
                    proxyEnd: performanceTimingAlias.proxyEnd
                };
                return [
                    {
                        schema: 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0',
                        data: performanceTiming
                    },
                ];
            }
            return [];
        }
        return {
            contexts: function () { return getPerformanceTimingContext(); }
        };
    }

    var PerformanceTiming = /*#__PURE__*/Object.freeze({
        __proto__: null,
        PerformanceTimingPlugin: PerformanceTimingPlugin
    });

    var gdprBasis;
    (function (gdprBasis) {
        gdprBasis["consent"] = "consent";
        gdprBasis["contract"] = "contract";
        gdprBasis["legalObligation"] = "legal_obligation";
        gdprBasis["vitalInterests"] = "vital_interests";
        gdprBasis["publicTask"] = "public_task";
        gdprBasis["legitimateInterests"] = "legitimate_interests";
    })(gdprBasis || (gdprBasis = {}));
    var _trackers$8 = {};
    var _context$1 = {};
    var LOG;
    function ConsentPlugin() {
        var trackerId;
        return {
            activateBrowserPlugin: function (tracker) {
                trackerId = tracker.id;
                _trackers$8[tracker.id] = tracker;
            },
            contexts: function () {
                if (_context$1[trackerId]) {
                    return [
                        {
                            schema: 'iglu:com.snowplowanalytics.snowplow/gdpr/jsonschema/1-0-0',
                            data: _context$1[trackerId]
                        },
                    ];
                }
                return [];
            },
            logger: function (logger) {
                LOG = logger;
            }
        };
    }
    function enableGdprContext(configuration, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$8); }
        var basisForProcessing = configuration.basisForProcessing, documentId = configuration.documentId, documentVersion = configuration.documentVersion, documentDescription = configuration.documentDescription;
        var basis = gdprBasis[basisForProcessing];
        if (!basis) {
            LOG.warn('enableGdprContext: basisForProcessing must be one of: consent, contract, legalObligation, vitalInterests, publicTask, legitimateInterests');
            return;
        }
        else {
            trackers.forEach(function (t) {
                if (_trackers$8[t]) {
                    _context$1[t] = {
                        basisForProcessing: basis,
                        documentId: documentId !== null && documentId !== void 0 ? documentId : null,
                        documentVersion: documentVersion !== null && documentVersion !== void 0 ? documentVersion : null,
                        documentDescription: documentDescription !== null && documentDescription !== void 0 ? documentDescription : null
                    };
                }
            });
        }
    }
    function trackConsentGranted(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$8); }
        dispatchToTrackersInCollection(trackers, _trackers$8, function (t) {
            var builtEvent = buildConsentGranted(event);
            t.core.track(builtEvent.event, event.context ? event.context.concat(builtEvent.context) : builtEvent.context, event.timestamp);
        });
    }
    function trackConsentWithdrawn(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$8); }
        dispatchToTrackersInCollection(trackers, _trackers$8, function (t) {
            var builtEvent = buildConsentWithdrawn(event);
            t.core.track(builtEvent.event, event.context ? event.context.concat(builtEvent.context) : builtEvent.context, event.timestamp);
        });
    }

    var Consent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ConsentPlugin: ConsentPlugin,
        enableGdprContext: enableGdprContext,
        get gdprBasis () { return gdprBasis; },
        trackConsentGranted: trackConsentGranted,
        trackConsentWithdrawn: trackConsentWithdrawn
    });

    var _trackers$7 = {};
    var geolocation, geolocationContextAdded = false;
    function GeolocationPlugin(enableAtLoad) {
        if (enableAtLoad === void 0) { enableAtLoad = false; }
        var trackerId;
        return {
            activateBrowserPlugin: function (tracker) {
                trackerId = tracker.id;
                _trackers$7[tracker.id] = [false, undefined];
                if (enableAtLoad) {
                    enableGeolocationContext([trackerId]);
                }
            },
            contexts: function () {
                var _a;
                var context = (_a = _trackers$7[trackerId]) === null || _a === void 0 ? void 0 : _a[1];
                if (context) {
                    return [context];
                }
                return [];
            }
        };
    }
    function enableGeolocationContext(trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$7); }
        var navigatorAlias = navigator;
        trackers.forEach(function (t) {
            _trackers$7[t] = [true, geolocation];
        });
        if (!geolocationContextAdded && navigatorAlias.geolocation && navigatorAlias.geolocation.getCurrentPosition) {
            geolocationContextAdded = true;
            navigatorAlias.geolocation.getCurrentPosition(function (position) {
                var coords = position.coords;
                geolocation = {
                    schema: 'iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0',
                    data: {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeLongitudeAccuracy: coords.accuracy,
                        altitude: coords.altitude,
                        altitudeAccuracy: coords.altitudeAccuracy,
                        bearing: coords.heading,
                        speed: coords.speed,
                        timestamp: Math.round(position.timestamp)
                    }
                };
                for (var key in _trackers$7) {
                    if (Object.prototype.hasOwnProperty.call(_trackers$7, key) && _trackers$7[key][0]) {
                        _trackers$7[key] = [true, geolocation];
                    }
                }
            });
        }
    }

    var Geolocation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GeolocationPlugin: GeolocationPlugin,
        enableGeolocationContext: enableGeolocationContext
    });

    function GaCookiesPlugin() {
        return {
            contexts: function () {
                var gaCookieData = {
                    schema: 'iglu:com.google.analytics/cookies/jsonschema/1-0-0',
                    data: {}
                };
                ['__utma', '__utmb', '__utmc', '__utmv', '__utmz', '_ga'].forEach(function (cookieType) {
                    var value = cookie(cookieType);
                    if (value) {
                        gaCookieData.data[cookieType] = value;
                    }
                });
                return [gaCookieData];
            }
        };
    }

    var GaCookies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GaCookiesPlugin: GaCookiesPlugin
    });

    var _trackers$6 = {};
    var _configuration = {};
    function LinkClickTrackingPlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$6[tracker.id] = tracker;
            }
        };
    }
    function enableLinkClickTracking(configuration, trackers) {
        if (configuration === void 0) { configuration = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$6); }
        trackers.forEach(function (id) {
            if (_trackers$6[id]) {
                if (_trackers$6[id].sharedState.hasLoaded) {
                    configureLinkClickTracking(configuration, id);
                    addClickListeners(id);
                }
                else {
                    _trackers$6[id].sharedState.registeredOnLoadHandlers.push(function () {
                        configureLinkClickTracking(configuration, id);
                        addClickListeners(id);
                    });
                }
            }
        });
    }
    function refreshLinkClickTracking(trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$6); }
        trackers.forEach(function (id) {
            if (_trackers$6[id]) {
                if (_trackers$6[id].sharedState.hasLoaded) {
                    addClickListeners(id);
                }
                else {
                    _trackers$6[id].sharedState.registeredOnLoadHandlers.push(function () {
                        addClickListeners(id);
                    });
                }
            }
        });
    }
    function trackLinkClick(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$6); }
        dispatchToTrackersInCollection(trackers, _trackers$6, function (t) {
            t.core.track(buildLinkClick(event), event.context, event.timestamp);
        });
    }
    function processClick(tracker, sourceElement, context) {
        var parentElement, tag, elementId, elementClasses, elementTarget, elementContent;
        while ((parentElement = sourceElement.parentElement) !== null &&
            parentElement != null &&
            (tag = sourceElement.tagName.toUpperCase()) !== 'A' &&
            tag !== 'AREA') {
            sourceElement = parentElement;
        }
        var anchorElement = sourceElement;
        if (anchorElement.href != null) {
            var originalSourceHostName = anchorElement.hostname || getHostName(anchorElement.href), sourceHostName = originalSourceHostName.toLowerCase(), sourceHref = anchorElement.href.replace(originalSourceHostName, sourceHostName), scriptProtocol = new RegExp('^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):', 'i');
            if (!scriptProtocol.test(sourceHref)) {
                elementId = anchorElement.id;
                elementClasses = getCssClasses(anchorElement);
                elementTarget = anchorElement.target;
                elementContent = _configuration[tracker.id].linkTrackingContent ? anchorElement.innerHTML : undefined;
                sourceHref = unescape(sourceHref);
                tracker.core.track(buildLinkClick({
                    targetUrl: sourceHref,
                    elementId: elementId,
                    elementClasses: elementClasses,
                    elementTarget: elementTarget,
                    elementContent: elementContent
                }), resolveDynamicContext(context, sourceElement));
            }
        }
    }
    function getClickHandler(tracker, context) {
        return function (evt) {
            var button, target;
            evt = evt || window.event;
            button = evt.which || evt.button;
            target = evt.target || evt.srcElement;
            if (evt.type === 'click') {
                if (target) {
                    processClick(_trackers$6[tracker], target, context);
                }
            }
            else if (evt.type === 'mousedown') {
                if ((button === 1 || button === 2) && target) {
                    _configuration[tracker].lastButton = button;
                    _configuration[tracker].lastTarget = target;
                }
                else {
                    _configuration[tracker].lastButton = _configuration[tracker].lastTarget = null;
                }
            }
            else if (evt.type === 'mouseup') {
                if (button === _configuration[tracker].lastButton && target === _configuration[tracker].lastTarget) {
                    processClick(_trackers$6[tracker], target, context);
                }
                _configuration[tracker].lastButton = _configuration[tracker].lastTarget = null;
            }
        };
    }
    function addClickListener(tracker, element) {
        if (_configuration[tracker].linkTrackingPseudoClicks) {
            addEventListener(element, 'mouseup', getClickHandler(tracker, _configuration[tracker].linkTrackingContext), false);
            addEventListener(element, 'mousedown', getClickHandler(tracker, _configuration[tracker].linkTrackingContext), false);
        }
        else {
            addEventListener(element, 'click', getClickHandler(tracker, _configuration[tracker].linkTrackingContext), false);
        }
    }
    function configureLinkClickTracking(_a, tracker) {
        var _b = _a === void 0 ? {} : _a, options = _b.options, pseudoClicks = _b.pseudoClicks, trackContent = _b.trackContent, context = _b.context;
        _configuration[tracker] = {
            linkTrackingContent: trackContent,
            linkTrackingContext: context,
            linkTrackingPseudoClicks: pseudoClicks,
            linkTrackingFilter: getFilterByClass(options)
        };
    }
    function addClickListeners(trackerId) {
        var _a, _b;
        var linkElements = document.links, i;
        for (i = 0; i < linkElements.length; i++) {
            if (((_b = (_a = _configuration[trackerId]).linkTrackingFilter) === null || _b === void 0 ? void 0 : _b.call(_a, linkElements[i])) && !linkElements[i][trackerId]) {
                addClickListener(trackerId, linkElements[i]);
                linkElements[i][trackerId] = true;
            }
        }
    }

    var LinkClickTracking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        LinkClickTrackingPlugin: LinkClickTrackingPlugin,
        enableLinkClickTracking: enableLinkClickTracking,
        refreshLinkClickTracking: refreshLinkClickTracking,
        trackLinkClick: trackLinkClick
    });

    var FormTrackingEvent;
    (function (FormTrackingEvent) {
        FormTrackingEvent["CHANGE_FORM"] = "change_form";
        FormTrackingEvent["FOCUS_FORM"] = "focus_form";
        FormTrackingEvent["SUBMIT_FORM"] = "submit_form";
    })(FormTrackingEvent || (FormTrackingEvent = {}));
    var defaultFormTrackingEvents = [
        FormTrackingEvent.CHANGE_FORM,
        FormTrackingEvent.FOCUS_FORM,
        FormTrackingEvent.SUBMIT_FORM,
    ];
    var innerElementTags = ['textarea', 'input', 'select'];
    var defaultTransformFn = function (x) { return x; };
    function addFormListeners(tracker, configuration) {
        var _a;
        var options = configuration.options, context = configuration.context, trackingMarker = tracker.id + 'form', config = getConfigurationForOptions(options);
        var forms = (_a = config.forms) !== null && _a !== void 0 ? _a : document.getElementsByTagName('form');
        Array.prototype.slice.call(forms).forEach(function (form) {
            if (config.formFilter(form)) {
                Array.prototype.slice.call(innerElementTags).forEach(function (tagname) {
                    Array.prototype.slice
                        .call(form.getElementsByTagName(tagname))
                        .forEach(function (innerElement) {
                        if (config.fieldFilter(innerElement) &&
                            !innerElement[trackingMarker] &&
                            innerElement.type.toLowerCase() !== 'password') {
                            if (config.eventFilter(FormTrackingEvent.FOCUS_FORM)) {
                                addEventListener(innerElement, 'focus', getFormChangeListener(tracker, config, 'focus_form', context), false);
                            }
                            if (config.eventFilter(FormTrackingEvent.CHANGE_FORM)) {
                                addEventListener(innerElement, 'change', getFormChangeListener(tracker, config, 'change_form', context), false);
                            }
                            innerElement[trackingMarker] = true;
                        }
                    });
                });
                if (!form[trackingMarker]) {
                    if (config.eventFilter(FormTrackingEvent.SUBMIT_FORM)) {
                        addEventListener(form, 'submit', getFormSubmissionListener(tracker, config, trackingMarker, context));
                    }
                    form[trackingMarker] = true;
                }
            }
        });
    }
    function isCollectionOfHTMLFormElements(forms) {
        return forms != null && Array.prototype.slice.call(forms).length > 0;
    }
    function getConfigurationForOptions(options) {
        if (options) {
            var formFilter = function (_) { return true; };
            var forms = null;
            if (isCollectionOfHTMLFormElements(options.forms)) {
                forms = options.forms;
            }
            else {
                formFilter = getFilterByClass(options.forms);
            }
            return {
                forms: forms,
                formFilter: formFilter,
                fieldFilter: getFilterByName(options.fields),
                fieldTransform: getTransform(options.fields),
                eventFilter: function (event) { var _a; return ((_a = options.events) !== null && _a !== void 0 ? _a : defaultFormTrackingEvents).indexOf(event) > -1; }
            };
        }
        else {
            return {
                forms: null,
                formFilter: function () { return true; },
                fieldFilter: function () { return true; },
                fieldTransform: defaultTransformFn,
                eventFilter: function () { return true; }
            };
        }
    }
    function getTransform(criterion) {
        if (criterion && Object.prototype.hasOwnProperty.call(criterion, 'transform')) {
            return criterion.transform;
        }
        return defaultTransformFn;
    }
    function getElementIdentifier(elt) {
        var properties = ['name', 'id', 'type', 'nodeName'];
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var propName = properties_1[_i];
            if (elt[propName] != false && typeof elt[propName] === 'string') {
                return elt[propName];
            }
        }
        return null;
    }
    function getParentFormIdentifier(elt) {
        while (elt && elt.nodeName && elt.nodeName.toUpperCase() !== 'HTML' && elt.nodeName.toUpperCase() !== 'FORM') {
            elt = elt.parentNode;
        }
        if (elt && elt.nodeName && elt.nodeName.toUpperCase() === 'FORM') {
            return getElementIdentifier(elt);
        }
        return null;
    }
    function getInnerFormElements(trackingMarker, elt) {
        var innerElements = [];
        Array.prototype.slice.call(innerElementTags).forEach(function (tagname) {
            var trackedChildren = Array.prototype.slice.call(elt.getElementsByTagName(tagname)).filter(function (child) {
                return child.hasOwnProperty(trackingMarker);
            });
            Array.prototype.slice.call(trackedChildren).forEach(function (child) {
                if (child.type === 'submit') {
                    return;
                }
                var elementJson = {
                    name: getElementIdentifier(child),
                    value: child.value,
                    nodeName: child.nodeName
                };
                if (child.type && child.nodeName.toUpperCase() === 'INPUT') {
                    elementJson.type = child.type;
                }
                if ((child.type === 'checkbox' || child.type === 'radio') && !child.checked) {
                    elementJson.value = null;
                }
                innerElements.push(elementJson);
            });
        });
        return innerElements;
    }
    function getFormChangeListener(tracker, config, event_type, context) {
        return function (e) {
            var _a, _b;
            var elt = e.target;
            if (elt) {
                var type = elt.nodeName && elt.nodeName.toUpperCase() === 'INPUT' ? elt.type : null;
                var value = elt.type === 'checkbox' && !elt.checked ? null : config.fieldTransform(elt.value, elt);
                if (event_type === 'change_form' || (type !== 'checkbox' && type !== 'radio')) {
                    tracker.core.track(buildFormFocusOrChange({
                        schema: event_type,
                        formId: (_a = getParentFormIdentifier(elt)) !== null && _a !== void 0 ? _a : '',
                        elementId: (_b = getElementIdentifier(elt)) !== null && _b !== void 0 ? _b : '',
                        nodeName: elt.nodeName,
                        type: type,
                        elementClasses: getCssClasses(elt),
                        value: value !== null && value !== void 0 ? value : null
                    }), resolveDynamicContext(context, elt, type, value));
                }
            }
        };
    }
    function getFormSubmissionListener(tracker, config, trackingMarker, context) {
        return function (e) {
            var _a;
            var elt = e.target;
            var innerElements = getInnerFormElements(trackingMarker, elt);
            innerElements.forEach(function (innerElement) {
                var _a;
                innerElement.value = (_a = config.fieldTransform(innerElement.value, innerElement)) !== null && _a !== void 0 ? _a : innerElement.value;
            });
            tracker.core.track(buildFormSubmission({
                formId: (_a = getElementIdentifier(elt)) !== null && _a !== void 0 ? _a : '',
                formClasses: getCssClasses(elt),
                elements: innerElements
            }), resolveDynamicContext(context, elt, innerElements));
        };
    }
    var _trackers$5 = {};
    function FormTrackingPlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$5[tracker.id] = tracker;
            }
        };
    }
    function enableFormTracking(configuration, trackers) {
        if (configuration === void 0) { configuration = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$5); }
        trackers.forEach(function (t) {
            if (_trackers$5[t]) {
                if (_trackers$5[t].sharedState.hasLoaded) {
                    addFormListeners(_trackers$5[t], configuration);
                }
                else {
                    _trackers$5[t].sharedState.registeredOnLoadHandlers.push(function () {
                        addFormListeners(_trackers$5[t], configuration);
                    });
                }
            }
        });
    }

    var FormTracking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FormTrackingPlugin: FormTrackingPlugin,
        enableFormTracking: enableFormTracking
    });

    var _trackers$4 = {};
    function ErrorTrackingPlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$4[tracker.id] = tracker;
            }
        };
    }
    function trackError(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$4); }
        var message = event.message, filename = event.filename, lineno = event.lineno, colno = event.colno, error = event.error, context = event.context, timestamp = event.timestamp, stack = error && error.stack ? error.stack : null;
        dispatchToTrackersInCollection(trackers, _trackers$4, function (t) {
            t.core.track(buildSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-1',
                    data: {
                        programmingLanguage: 'JAVASCRIPT',
                        message: message !== null && message !== void 0 ? message : "JS Exception. Browser doesn't support ErrorEvent API",
                        stackTrace: stack,
                        lineNumber: lineno,
                        lineColumn: colno,
                        fileName: filename
                    }
                }
            }), context, timestamp);
        });
    }
    function enableErrorTracking(configuration, trackers) {
        if (configuration === void 0) { configuration = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$4); }
        var filter = configuration.filter, contextAdder = configuration.contextAdder, context = configuration.context, captureError = function (errorEvent) {
            if ((filter && isFunction(filter) && filter(errorEvent)) || filter == null) {
                sendError({ errorEvent: errorEvent, commonContext: context, contextAdder: contextAdder }, trackers);
            }
        };
        addEventListener(window, 'error', captureError, true);
    }
    function sendError(_a, trackers) {
        var errorEvent = _a.errorEvent, commonContext = _a.commonContext, contextAdder = _a.contextAdder;
        var context = commonContext || [];
        if (contextAdder && isFunction(contextAdder)) {
            context = context.concat(contextAdder(errorEvent));
        }
        trackError({
            message: errorEvent.message,
            filename: errorEvent.filename,
            lineno: errorEvent.lineno,
            colno: errorEvent.colno,
            error: errorEvent.error,
            context: context
        }, trackers);
    }

    var ErrorTracking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ErrorTrackingPlugin: ErrorTrackingPlugin,
        enableErrorTracking: enableErrorTracking,
        trackError: trackError
    });

    var jstz_min = {exports: {}};

    (function (module) {
    !function(e){var a=function(){var e="s",s={DAY:864e5,HOUR:36e5,MINUTE:6e4,SECOND:1e3,BASELINE_YEAR:2014,MAX_SCORE:864e6,AMBIGUITIES:{"America/Denver":["America/Mazatlan"],"America/Chicago":["America/Mexico_City"],"America/Asuncion":["America/Campo_Grande","America/Santiago"],"America/Montevideo":["America/Sao_Paulo","America/Santiago"],"Asia/Beirut":["Asia/Amman","Asia/Jerusalem","Europe/Helsinki","Asia/Damascus","Africa/Cairo","Asia/Gaza","Europe/Minsk","Africa/Windhoek"],"Pacific/Auckland":["Pacific/Fiji"],"America/Los_Angeles":["America/Santa_Isabel"],"America/New_York":["America/Havana"],"America/Halifax":["America/Goose_Bay"],"America/Godthab":["America/Miquelon"],"Asia/Dubai":["Asia/Yerevan"],"Asia/Jakarta":["Asia/Krasnoyarsk"],"Asia/Shanghai":["Asia/Irkutsk","Australia/Perth"],"Australia/Sydney":["Australia/Lord_Howe"],"Asia/Tokyo":["Asia/Yakutsk"],"Asia/Dhaka":["Asia/Omsk"],"Asia/Baku":["Asia/Yerevan"],"Australia/Brisbane":["Asia/Vladivostok"],"Pacific/Noumea":["Asia/Vladivostok"],"Pacific/Majuro":["Asia/Kamchatka","Pacific/Fiji"],"Pacific/Tongatapu":["Pacific/Apia"],"Asia/Baghdad":["Europe/Minsk","Europe/Moscow"],"Asia/Karachi":["Asia/Yekaterinburg"],"Africa/Johannesburg":["Asia/Gaza","Africa/Cairo"]}},i=function(e){var a=-e.getTimezoneOffset();return null!==a?a:0},r=function(){for(var e=[],a=0;a<=11;a++)for(var r=1;r<=28;r++){var n=i(new Date(s.BASELINE_YEAR,a,r));e?e&&e[e.length-1]!==n&&e.push(n):e.push();}return e},n=function(){var a=0,s=r();return s.length>1&&(a=s[0]-s[1]),s.length>3?s[0]+",1,weird":a<0?s[0]+",1":a>0?s[1]+",1,"+e:s[0]+",0"},o=function(){var e,a;if(Intl&&"undefined"!=typeof Intl&&"undefined"!=typeof Intl.DateTimeFormat&&(e=Intl.DateTimeFormat(),"undefined"!=typeof e&&"undefined"!=typeof e.resolvedOptions))return a=e.resolvedOptions().timeZone,a&&(a.indexOf("/")>-1||"UTC"===a)?a:void 0},t=function(e){for(var a=new Date(e,0,1,0,0,1,0).getTime(),s=new Date(e,12,31,23,59,59).getTime(),i=a,r=new Date(i).getTimezoneOffset(),n=null,o=null;i<s-864e5;){var t=new Date(i),A=t.getTimezoneOffset();A!==r&&(A<r&&(n=t),A>r&&(o=t),r=A),i+=864e5;}return !(!n||!o)&&{s:u(n).getTime(),e:u(o).getTime()}},u=function f(e,a,i){"undefined"==typeof a&&(a=s.DAY,i=s.HOUR);for(var r=new Date(e.getTime()-a).getTime(),n=e.getTime()+a,o=new Date(r).getTimezoneOffset(),t=r,u=null;t<n-i;){var A=new Date(t),c=A.getTimezoneOffset();if(c!==o){u=A;break}t+=i;}return a===s.DAY?f(u,s.HOUR,s.MINUTE):a===s.HOUR?f(u,s.MINUTE,s.SECOND):u},A=function(e,a,s,i){if("N/A"!==s)return s;if("Asia/Beirut"===a){if("Africa/Cairo"===i.name&&13983768e5===e[6].s&&14116788e5===e[6].e)return 0;if("Asia/Jerusalem"===i.name&&13959648e5===e[6].s&&14118588e5===e[6].e)return 0}else if("America/Santiago"===a){if("America/Asuncion"===i.name&&14124816e5===e[6].s&&1397358e6===e[6].e)return 0;if("America/Campo_Grande"===i.name&&14136912e5===e[6].s&&13925196e5===e[6].e)return 0}else if("America/Montevideo"===a){if("America/Sao_Paulo"===i.name&&14136876e5===e[6].s&&1392516e6===e[6].e)return 0}else if("Pacific/Auckland"===a&&"Pacific/Fiji"===i.name&&14142456e5===e[6].s&&13961016e5===e[6].e)return 0;return s},c=function(e,i){for(var r=function(a){for(var r=0,n=0;n<e.length;n++)if(a.rules[n]&&e[n]){if(!(e[n].s>=a.rules[n].s&&e[n].e<=a.rules[n].e)){r="N/A";break}if(r=0,r+=Math.abs(e[n].s-a.rules[n].s),r+=Math.abs(a.rules[n].e-e[n].e),r>s.MAX_SCORE){r="N/A";break}}return r=A(e,i,r,a)},n={},o=a.olson.dst_rules.zones,t=o.length,u=s.AMBIGUITIES[i],c=0;c<t;c++){var m=o[c],l=r(o[c]);"N/A"!==l&&(n[m.name]=l);}for(var f in n)if(n.hasOwnProperty(f))for(var d=0;d<u.length;d++)if(u[d]===f)return f;return i},m=function(e){var s=function(){for(var e=[],s=0;s<a.olson.dst_rules.years.length;s++){var i=t(a.olson.dst_rules.years[s]);e.push(i);}return e},i=function(e){for(var a=0;a<e.length;a++)if(e[a]!==!1)return !0;return !1},r=s(),n=i(r);return n?c(r,e):e},l=function(e){var i=!1,t=n();return (e||"undefined"==typeof e)&&(i=o()),i||(i=a.olson.timezones[t],"undefined"!=typeof s.AMBIGUITIES[i]&&(i=m(i))),{name:function(){return i},using_intl:e||"undefined"==typeof e,needle:t,offsets:r()}};return {determine:l}}();a.olson=a.olson||{},a.olson.timezones={"-720,0":"Etc/GMT+12","-660,0":"Pacific/Pago_Pago","-660,1,s":"Pacific/Apia","-600,1":"America/Adak","-600,0":"Pacific/Honolulu","-570,0":"Pacific/Marquesas","-540,0":"Pacific/Gambier","-540,1":"America/Anchorage","-480,1":"America/Los_Angeles","-480,0":"Pacific/Pitcairn","-420,0":"America/Phoenix","-420,1":"America/Denver","-360,0":"America/Guatemala","-360,1":"America/Chicago","-360,1,s":"Pacific/Easter","-300,0":"America/Bogota","-300,1":"America/New_York","-270,0":"America/Caracas","-240,1":"America/Halifax","-240,0":"America/Santo_Domingo","-240,1,s":"America/Asuncion","-210,1":"America/St_Johns","-180,1":"America/Godthab","-180,0":"America/Buenos_Aires","-180,1,s":"America/Montevideo","-120,0":"America/Noronha","-120,1":"America/Noronha","-60,1":"Atlantic/Azores","-60,0":"Atlantic/Cape_Verde","0,0":"UTC","0,1":"Europe/London","0,1,weird":"Africa/Casablanca","60,1":"Europe/Berlin","60,0":"Africa/Lagos","60,1,weird":"Africa/Casablanca","120,1":"Asia/Beirut","120,1,weird":"Africa/Cairo","120,0":"Africa/Johannesburg","180,0":"Asia/Baghdad","180,1":"Europe/Moscow","210,1":"Asia/Tehran","240,0":"Asia/Dubai","240,1":"Asia/Baku","270,0":"Asia/Kabul","300,1":"Asia/Yekaterinburg","300,0":"Asia/Karachi","330,0":"Asia/Calcutta","345,0":"Asia/Katmandu","360,0":"Asia/Dhaka","360,1":"Asia/Omsk","390,0":"Asia/Rangoon","420,1":"Asia/Krasnoyarsk","420,0":"Asia/Jakarta","480,0":"Asia/Shanghai","480,1":"Asia/Irkutsk","525,0":"Australia/Eucla","525,1,s":"Australia/Eucla","540,1":"Asia/Yakutsk","540,0":"Asia/Tokyo","570,0":"Australia/Darwin","570,1,s":"Australia/Adelaide","600,0":"Australia/Brisbane","600,1":"Asia/Vladivostok","600,1,s":"Australia/Sydney","630,1,s":"Australia/Lord_Howe","660,1":"Asia/Kamchatka","660,0":"Pacific/Noumea","690,0":"Pacific/Norfolk","720,1,s":"Pacific/Auckland","720,0":"Pacific/Majuro","765,1,s":"Pacific/Chatham","780,0":"Pacific/Tongatapu","780,1,s":"Pacific/Apia","840,0":"Pacific/Kiritimati"},a.olson.dst_rules={years:[2008,2009,2010,2011,2012,2013,2014],zones:[{name:"Africa/Cairo",rules:[{e:12199572e5,s:12090744e5},{e:1250802e6,s:1240524e6},{e:12858804e5,s:12840696e5},!1,!1,!1,{e:14116788e5,s:1406844e6}]},{name:"America/Asuncion",rules:[{e:12050316e5,s:12243888e5},{e:12364812e5,s:12558384e5},{e:12709548e5,s:12860784e5},{e:13024044e5,s:1317528e6},{e:1333854e6,s:13495824e5},{e:1364094e6,s:1381032e6},{e:13955436e5,s:14124816e5}]},{name:"America/Campo_Grande",rules:[{e:12032172e5,s:12243888e5},{e:12346668e5,s:12558384e5},{e:12667212e5,s:1287288e6},{e:12981708e5,s:13187376e5},{e:13302252e5,s:1350792e6},{e:136107e7,s:13822416e5},{e:13925196e5,s:14136912e5}]},{name:"America/Goose_Bay",rules:[{e:122559486e4,s:120503526e4},{e:125704446e4,s:123648486e4},{e:128909886e4,s:126853926e4},{e:13205556e5,s:129998886e4},{e:13520052e5,s:13314456e5},{e:13834548e5,s:13628952e5},{e:14149044e5,s:13943448e5}]},{name:"America/Havana",rules:[{e:12249972e5,s:12056436e5},{e:12564468e5,s:12364884e5},{e:12885012e5,s:12685428e5},{e:13211604e5,s:13005972e5},{e:13520052e5,s:13332564e5},{e:13834548e5,s:13628916e5},{e:14149044e5,s:13943412e5}]},{name:"America/Mazatlan",rules:[{e:1225008e6,s:12074724e5},{e:12564576e5,s:1238922e6},{e:1288512e6,s:12703716e5},{e:13199616e5,s:13018212e5},{e:13514112e5,s:13332708e5},{e:13828608e5,s:13653252e5},{e:14143104e5,s:13967748e5}]},{name:"America/Mexico_City",rules:[{e:12250044e5,s:12074688e5},{e:1256454e6,s:12389184e5},{e:12885084e5,s:1270368e6},{e:1319958e6,s:13018176e5},{e:13514076e5,s:13332672e5},{e:13828572e5,s:13653216e5},{e:14143068e5,s:13967712e5}]},{name:"America/Miquelon",rules:[{e:12255984e5,s:12050388e5},{e:1257048e6,s:12364884e5},{e:12891024e5,s:12685428e5},{e:1320552e6,s:12999924e5},{e:13520016e5,s:1331442e6},{e:13834512e5,s:13628916e5},{e:14149008e5,s:13943412e5}]},{name:"America/Santa_Isabel",rules:[{e:12250116e5,s:1207476e6},{e:12564612e5,s:12389256e5},{e:12891204e5,s:12685608e5},{e:132057e7,s:13000104e5},{e:13520196e5,s:133146e7},{e:13834692e5,s:13629096e5},{e:14149188e5,s:13943592e5}]},{name:"America/Santiago",rules:[{e:1206846e6,s:1223784e6},{e:1237086e6,s:12552336e5},{e:127035e7,s:12866832e5},{e:13048236e5,s:13138992e5},{e:13356684e5,s:13465584e5},{e:1367118e6,s:13786128e5},{e:13985676e5,s:14100624e5}]},{name:"America/Sao_Paulo",rules:[{e:12032136e5,s:12243852e5},{e:12346632e5,s:12558348e5},{e:12667176e5,s:12872844e5},{e:12981672e5,s:1318734e6},{e:13302216e5,s:13507884e5},{e:13610664e5,s:1382238e6},{e:1392516e6,s:14136876e5}]},{name:"Asia/Amman",rules:[{e:1225404e6,s:12066552e5},{e:12568536e5,s:12381048e5},{e:12883032e5,s:12695544e5},{e:13197528e5,s:13016088e5},!1,!1,{e:14147064e5,s:13959576e5}]},{name:"Asia/Damascus",rules:[{e:12254868e5,s:120726e7},{e:125685e7,s:12381048e5},{e:12882996e5,s:12701592e5},{e:13197492e5,s:13016088e5},{e:13511988e5,s:13330584e5},{e:13826484e5,s:1364508e6},{e:14147028e5,s:13959576e5}]},{name:"Asia/Dubai",rules:[!1,!1,!1,!1,!1,!1,!1]},{name:"Asia/Gaza",rules:[{e:12199572e5,s:12066552e5},{e:12520152e5,s:12381048e5},{e:1281474e6,s:126964086e4},{e:1312146e6,s:130160886e4},{e:13481784e5,s:13330584e5},{e:13802292e5,s:1364508e6},{e:1414098e6,s:13959576e5}]},{name:"Asia/Irkutsk",rules:[{e:12249576e5,s:12068136e5},{e:12564072e5,s:12382632e5},{e:12884616e5,s:12697128e5},!1,!1,!1,!1]},{name:"Asia/Jerusalem",rules:[{e:12231612e5,s:12066624e5},{e:1254006e6,s:1238112e6},{e:1284246e6,s:12695616e5},{e:131751e7,s:1301616e6},{e:13483548e5,s:13330656e5},{e:13828284e5,s:13645152e5},{e:1414278e6,s:13959648e5}]},{name:"Asia/Kamchatka",rules:[{e:12249432e5,s:12067992e5},{e:12563928e5,s:12382488e5},{e:12884508e5,s:12696984e5},!1,!1,!1,!1]},{name:"Asia/Krasnoyarsk",rules:[{e:12249612e5,s:12068172e5},{e:12564108e5,s:12382668e5},{e:12884652e5,s:12697164e5},!1,!1,!1,!1]},{name:"Asia/Omsk",rules:[{e:12249648e5,s:12068208e5},{e:12564144e5,s:12382704e5},{e:12884688e5,s:126972e7},!1,!1,!1,!1]},{name:"Asia/Vladivostok",rules:[{e:12249504e5,s:12068064e5},{e:12564e8,s:1238256e6},{e:12884544e5,s:12697056e5},!1,!1,!1,!1]},{name:"Asia/Yakutsk",rules:[{e:1224954e6,s:120681e7},{e:12564036e5,s:12382596e5},{e:1288458e6,s:12697092e5},!1,!1,!1,!1]},{name:"Asia/Yekaterinburg",rules:[{e:12249684e5,s:12068244e5},{e:1256418e6,s:1238274e6},{e:12884724e5,s:12697236e5},!1,!1,!1,!1]},{name:"Asia/Yerevan",rules:[{e:1224972e6,s:1206828e6},{e:12564216e5,s:12382776e5},{e:1288476e6,s:12697272e5},{e:13199256e5,s:13011768e5},!1,!1,!1]},{name:"Australia/Lord_Howe",rules:[{e:12074076e5,s:12231342e5},{e:12388572e5,s:12545838e5},{e:12703068e5,s:12860334e5},{e:13017564e5,s:1317483e6},{e:1333206e6,s:13495374e5},{e:13652604e5,s:1380987e6},{e:139671e7,s:14124366e5}]},{name:"Australia/Perth",rules:[{e:12068136e5,s:12249576e5},!1,!1,!1,!1,!1,!1]},{name:"Europe/Helsinki",rules:[{e:12249828e5,s:12068388e5},{e:12564324e5,s:12382884e5},{e:12884868e5,s:1269738e6},{e:13199364e5,s:13011876e5},{e:1351386e6,s:13326372e5},{e:13828356e5,s:13646916e5},{e:14142852e5,s:13961412e5}]},{name:"Europe/Minsk",rules:[{e:12249792e5,s:12068352e5},{e:12564288e5,s:12382848e5},{e:12884832e5,s:12697344e5},!1,!1,!1,!1]},{name:"Europe/Moscow",rules:[{e:12249756e5,s:12068316e5},{e:12564252e5,s:12382812e5},{e:12884796e5,s:12697308e5},!1,!1,!1,!1]},{name:"Pacific/Apia",rules:[!1,!1,!1,{e:13017528e5,s:13168728e5},{e:13332024e5,s:13489272e5},{e:13652568e5,s:13803768e5},{e:13967064e5,s:14118264e5}]},{name:"Pacific/Fiji",rules:[!1,!1,{e:12696984e5,s:12878424e5},{e:13271544e5,s:1319292e6},{e:1358604e6,s:13507416e5},{e:139005e7,s:1382796e6},{e:14215032e5,s:14148504e5}]},{name:"Europe/London",rules:[{e:12249828e5,s:12068388e5},{e:12564324e5,s:12382884e5},{e:12884868e5,s:1269738e6},{e:13199364e5,s:13011876e5},{e:1351386e6,s:13326372e5},{e:13828356e5,s:13646916e5},{e:14142852e5,s:13961412e5}]},{name:"Africa/Windhoek",rules:[{e:12207492e5,s:120744e7},{e:12521988e5,s:12388896e5},{e:12836484e5,s:12703392e5},{e:1315098e6,s:13017888e5},{e:13465476e5,s:13332384e5},{e:13779972e5,s:13652928e5},{e:14100516e5,s:13967424e5}]}]},module.exports=a;}();
    }(jstz_min));

    function TimezonePlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                tracker.core.setTimezone(jstz_min.exports.determine(typeof Intl !== 'undefined').name());
            }
        };
    }

    var Timezone = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TimezonePlugin: TimezonePlugin
    });

    function ecommerceTransactionTemplate() {
        return {
            items: []
        };
    }
    var _trackers$3 = {};
    var _transactions = {};
    function EcommercePlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$3[tracker.id] = tracker;
                _transactions[tracker.id] = ecommerceTransactionTemplate();
            }
        };
    }
    function addTrans(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$3); }
        trackers.forEach(function (t) {
            if (_transactions[t]) {
                _transactions[t].transaction = event;
            }
        });
    }
    function addItem(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$3); }
        trackers.forEach(function (t) {
            if (_transactions[t]) {
                _transactions[t].items.push(event);
            }
        });
    }
    function trackTrans(trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$3); }
        dispatchToTrackersInCollection(trackers, _trackers$3, function (t) {
            var transaction = _transactions[t.id].transaction;
            if (transaction) {
                t.core.track(buildEcommerceTransaction(transaction), transaction.context, transaction.timestamp);
            }
            for (var i = 0; i < _transactions[t.id].items.length; i++) {
                var item = _transactions[t.id].items[i];
                t.core.track(buildEcommerceTransactionItem(item), item.context, item.timestamp);
            }
            _transactions[t.id] = ecommerceTransactionTemplate();
        });
    }
    function trackAddToCart(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$3); }
        dispatchToTrackersInCollection(trackers, _trackers$3, function (t) {
            t.core.track(buildAddToCart(event), event.context, event.timestamp);
        });
    }
    function trackRemoveFromCart(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$3); }
        dispatchToTrackersInCollection(trackers, _trackers$3, function (t) {
            t.core.track(buildRemoveFromCart(event), event.context, event.timestamp);
        });
    }

    var Ecommerce = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EcommercePlugin: EcommercePlugin,
        addItem: addItem,
        addTrans: addTrans,
        trackAddToCart: trackAddToCart,
        trackRemoveFromCart: trackRemoveFromCart,
        trackTrans: trackTrans
    });

    var _trackers$2 = {};
    var _context = {};
    function EnhancedEcommercePlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$2[tracker.id] = tracker;
                _context[tracker.id] = [];
            }
        };
    }
    function trackEnhancedEcommerceAction(event, trackers) {
        if (event === void 0) { event = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$2); }
        dispatchToTrackersInCollection(trackers, _trackers$2, function (t) {
            var combinedContexts = _context[t.id].concat(event.context || []);
            _context[t.id].length = 0;
            t.core.track(buildSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.google.analytics.enhanced-ecommerce/action/jsonschema/1-0-0',
                    data: {
                        action: event.action
                    }
                }
            }), combinedContexts, event.timestamp);
        });
    }
    function addEnhancedEcommerceActionContext(context, trackers) {
        if (context === void 0) { context = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$2); }
        var id = context.id, affiliation = context.affiliation, revenue = context.revenue, tax = context.tax, shipping = context.shipping, coupon = context.coupon, list = context.list, step = context.step, option = context.option, currency = context.currency;
        trackers.forEach(function (trackerId) {
            if (_context[trackerId]) {
                _context[trackerId].push({
                    schema: 'iglu:com.google.analytics.enhanced-ecommerce/actionFieldObject/jsonschema/1-0-0',
                    data: {
                        id: id,
                        affiliation: affiliation,
                        revenue: parseAndValidateFloat(revenue),
                        tax: parseAndValidateFloat(tax),
                        shipping: parseAndValidateFloat(shipping),
                        coupon: coupon,
                        list: list,
                        step: parseAndValidateInt(step),
                        option: option,
                        currency: currency
                    }
                });
            }
        });
    }
    function addEnhancedEcommerceImpressionContext(context, trackers) {
        if (context === void 0) { context = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$2); }
        var id = context.id, name = context.name, list = context.list, brand = context.brand, category = context.category, variant = context.variant, position = context.position, price = context.price, currency = context.currency;
        trackers.forEach(function (trackerId) {
            if (_context[trackerId]) {
                _context[trackerId].push({
                    schema: 'iglu:com.google.analytics.enhanced-ecommerce/impressionFieldObject/jsonschema/1-0-0',
                    data: {
                        id: id,
                        name: name,
                        list: list,
                        brand: brand,
                        category: category,
                        variant: variant,
                        position: parseAndValidateInt(position),
                        price: parseAndValidateFloat(price),
                        currency: currency
                    }
                });
            }
        });
    }
    function addEnhancedEcommerceProductContext(context, trackers) {
        if (context === void 0) { context = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$2); }
        var id = context.id, name = context.name, list = context.list, brand = context.brand, category = context.category, variant = context.variant, price = context.price, quantity = context.quantity, coupon = context.coupon, position = context.position, currency = context.currency;
        trackers.forEach(function (trackerId) {
            if (_context[trackerId]) {
                _context[trackerId].push({
                    schema: 'iglu:com.google.analytics.enhanced-ecommerce/productFieldObject/jsonschema/1-0-0',
                    data: {
                        id: id,
                        name: name,
                        list: list,
                        brand: brand,
                        category: category,
                        variant: variant,
                        price: parseAndValidateFloat(price),
                        quantity: parseAndValidateInt(quantity),
                        coupon: coupon,
                        position: parseAndValidateInt(position),
                        currency: currency
                    }
                });
            }
        });
    }
    function addEnhancedEcommercePromoContext(context, trackers) {
        if (context === void 0) { context = {}; }
        if (trackers === void 0) { trackers = Object.keys(_trackers$2); }
        var id = context.id, name = context.name, creative = context.creative, position = context.position, currency = context.currency;
        trackers.forEach(function (trackerId) {
            if (_context[trackerId]) {
                _context[trackerId].push({
                    schema: 'iglu:com.google.analytics.enhanced-ecommerce/promoFieldObject/jsonschema/1-0-0',
                    data: {
                        id: id,
                        name: name,
                        creative: creative,
                        position: position,
                        currency: currency
                    }
                });
            }
        });
    }

    var EnhancedEcommerce = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EnhancedEcommercePlugin: EnhancedEcommercePlugin,
        addEnhancedEcommerceActionContext: addEnhancedEcommerceActionContext,
        addEnhancedEcommerceImpressionContext: addEnhancedEcommerceImpressionContext,
        addEnhancedEcommerceProductContext: addEnhancedEcommerceProductContext,
        addEnhancedEcommercePromoContext: addEnhancedEcommercePromoContext,
        trackEnhancedEcommerceAction: trackEnhancedEcommerceAction
    });

    var _trackers$1 = {};
    function AdTrackingPlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers$1[tracker.id] = tracker;
            }
        };
    }
    function trackAdImpression(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$1); }
        dispatchToTrackersInCollection(trackers, _trackers$1, function (t) {
            t.core.track(buildAdImpression(event), event.context, event.timestamp);
        });
    }
    function trackAdClick(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$1); }
        dispatchToTrackersInCollection(trackers, _trackers$1, function (t) {
            t.core.track(buildAdClick(event), event.context, event.timestamp);
        });
    }
    function trackAdConversion(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers$1); }
        dispatchToTrackersInCollection(trackers, _trackers$1, function (t) {
            t.core.track(buildAdConversion(event), event.context, event.timestamp);
        });
    }

    var AdTracking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AdTrackingPlugin: AdTrackingPlugin,
        trackAdClick: trackAdClick,
        trackAdConversion: trackAdConversion,
        trackAdImpression: trackAdImpression
    });

    var _trackers = {};
    function SiteTrackingPlugin() {
        return {
            activateBrowserPlugin: function (tracker) {
                _trackers[tracker.id] = tracker;
            }
        };
    }
    function trackSocialInteraction(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers); }
        dispatchToTrackersInCollection(trackers, _trackers, function (t) {
            t.core.track(buildSocialInteraction(event), event.context, event.timestamp);
        });
    }
    function trackSiteSearch(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers); }
        dispatchToTrackersInCollection(trackers, _trackers, function (t) {
            t.core.track(buildSiteSearch(event), event.context, event.timestamp);
        });
    }
    function trackTiming(event, trackers) {
        if (trackers === void 0) { trackers = Object.keys(_trackers); }
        var category = event.category, variable = event.variable, timing = event.timing, label = event.label, context = event.context, timestamp = event.timestamp;
        dispatchToTrackersInCollection(trackers, _trackers, function (t) {
            t.core.track(buildSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0',
                    data: {
                        category: category,
                        variable: variable,
                        timing: timing,
                        label: label
                    }
                }
            }), context, timestamp);
        });
    }

    var SiteTracking = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SiteTrackingPlugin: SiteTrackingPlugin,
        trackSiteSearch: trackSiteSearch,
        trackSocialInteraction: trackSocialInteraction,
        trackTiming: trackTiming
    });

    /*
     * Copyright (c) 2022 Snowplow Analytics Ltd, 2010 Anthon Pang
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     *    list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
     * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
     * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
     * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
     * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
     * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
     * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */
    /**
     * Calculates the required plugins to intialise per tracker
     * @param configuration - The tracker configuration object
     */
    function Plugins(configuration) {
        var _a;
        var _b = (_a = configuration === null || configuration === void 0 ? void 0 : configuration.contexts) !== null && _a !== void 0 ? _a : {}, performanceTiming = _b.performanceTiming, gaCookies = _b.gaCookies, geolocation = _b.geolocation; _b.optimizelyExperiments; _b.optimizelyStates; _b.optimizelyVariations; _b.optimizelyVisitor; _b.optimizelyAudiences; _b.optimizelyDimensions; _b.optimizelySummary; var optimizelyXSummary = _b.optimizelyXSummary, clientHints = _b.clientHints;
        var activatedPlugins = [];
        var apiMethods; 
        if (performanceTiming) {
            var PerformanceTimingPlugin$1 = PerformanceTimingPlugin, apiMethods = __rest(PerformanceTiming, ["PerformanceTimingPlugin"]);
            activatedPlugins.push([PerformanceTimingPlugin$1(), apiMethods]);
        }
        if (optimizelyXSummary) {
            var OptimizelyXPlugin$1 = OptimizelyXPlugin, apiMethods = __rest(OptimizelyX, ["OptimizelyXPlugin"]);
            activatedPlugins.push([OptimizelyXPlugin$1(), apiMethods]);
        }
        if (clientHints) {
            var ClientHintsPlugin$1 = ClientHintsPlugin, apiMethods = __rest(ClientHints, ["ClientHintsPlugin"]);
            activatedPlugins.push([
                ClientHintsPlugin$1(typeof clientHints === 'object' && clientHints.includeHighEntropy),
                apiMethods,
            ]);
        }
        if (gaCookies) {
            var GaCookiesPlugin$1 = GaCookiesPlugin, apiMethods = __rest(GaCookies, ["GaCookiesPlugin"]);
            activatedPlugins.push([GaCookiesPlugin$1(), apiMethods]);
        }
        {
            var ConsentPlugin$1 = ConsentPlugin, apiMethods = __rest(Consent, ["ConsentPlugin"]);
            activatedPlugins.push([ConsentPlugin$1(), apiMethods]);
        }
        {
            var GeolocationPlugin$1 = GeolocationPlugin, apiMethods = __rest(Geolocation, ["GeolocationPlugin"]);
            activatedPlugins.push([GeolocationPlugin$1(geolocation), apiMethods]);
        }
        {
            var LinkClickTrackingPlugin$1 = LinkClickTrackingPlugin, apiMethods = __rest(LinkClickTracking, ["LinkClickTrackingPlugin"]);
            activatedPlugins.push([LinkClickTrackingPlugin$1(), apiMethods]);
        }
        {
            var FormTrackingPlugin$1 = FormTrackingPlugin, apiMethods = __rest(FormTracking, ["FormTrackingPlugin"]);
            activatedPlugins.push([FormTrackingPlugin$1(), apiMethods]);
        }
        {
            var ErrorTrackingPlugin$1 = ErrorTrackingPlugin, apiMethods = __rest(ErrorTracking, ["ErrorTrackingPlugin"]);
            activatedPlugins.push([ErrorTrackingPlugin$1(), apiMethods]);
        }
        {
            var EcommercePlugin$1 = EcommercePlugin, apiMethods = __rest(Ecommerce, ["EcommercePlugin"]);
            activatedPlugins.push([EcommercePlugin$1(), apiMethods]);
        }
        {
            var EnhancedEcommercePlugin$1 = EnhancedEcommercePlugin, apiMethods = __rest(EnhancedEcommerce, ["EnhancedEcommercePlugin"]);
            activatedPlugins.push([EnhancedEcommercePlugin$1(), apiMethods]);
        }
        {
            var AdTrackingPlugin$1 = AdTrackingPlugin, apiMethods = __rest(AdTracking, ["AdTrackingPlugin"]);
            activatedPlugins.push([AdTrackingPlugin$1(), apiMethods]);
        }
        {
            var SiteTrackingPlugin$1 = SiteTrackingPlugin, apiMethods = __rest(SiteTracking, ["SiteTrackingPlugin"]);
            activatedPlugins.push([SiteTrackingPlugin$1(), apiMethods]);
        }
        var apiMethods; 
        {
            var TimezonePlugin$1 = TimezonePlugin, apiMethods = __rest(Timezone, ["TimezonePlugin"]);
            activatedPlugins.push([TimezonePlugin$1(), apiMethods]);
        }
        var apiMethods; 
        var apiMethods; 
        return activatedPlugins;
    }

    /*
     * Copyright (c) 2022 Snowplow Analytics Ltd, 2010 Anthon Pang
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     *    list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
     * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
     * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
     * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
     * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
     * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
     * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */
    /**
     * This allows the caller to continue push()'ing after the Tracker has been initialized and loaded
     *
     * @param functionName - The global function name this script has been created on
     * @param asyncQueue - The existing queue of items to be processed
     */
    function InQueueManager(functionName, asyncQueue) {
        var windowAlias = window, documentAlias = document, sharedState = createSharedState(), availableTrackerIds = [], pendingPlugins = {}, pendingQueue = [];
        var version$1, availableFunctions;
        (version$1 = version, availableFunctions = __rest(Snowplow, ["version"]));
        function parseInputString(inputString) {
            var separatedString = inputString.split(':'), extractedFunction = separatedString[0], extractedNames = separatedString.length > 1 ? separatedString[1].split(';') : undefined;
            return [extractedFunction, extractedNames];
        }
        function dispatch(f, parameters) {
            if (availableFunctions[f]) {
                try {
                    availableFunctions[f].apply(null, parameters);
                }
                catch (ex) {
                    LOG$1.error(f + ' failed', ex);
                }
            }
            else {
                LOG$1.warn(f + ' is not an available function');
            }
        }
        function tryProcessQueue() {
            if (Object.keys(pendingPlugins).length === 0) {
                pendingQueue.forEach(function (q) {
                    var fnParameters = q[1];
                    if (typeof availableFunctions[q[0]] !== 'undefined' &&
                        availableFunctions[q[0]].length > fnParameters.length &&
                        Array.isArray(fnParameters[0])) {
                        fnParameters = [{}, fnParameters[0]];
                    }
                    dispatch(q[0], fnParameters);
                });
            }
        }
        function updateAvailableFunctions(newFunctions) {
            // Spread in any new methods
            availableFunctions = __assign(__assign({}, availableFunctions), newFunctions);
        }
        function newTracker(parameterArray) {
            if (typeof parameterArray[0] === 'string' &&
                typeof parameterArray[1] === 'string' &&
                (typeof parameterArray[2] === 'undefined' || typeof parameterArray[2] === 'object')) {
                var trackerId = "".concat(functionName, "_").concat(parameterArray[0]), trackerConfiguration = parameterArray[2], plugins = Plugins(trackerConfiguration), tracker = addTracker(trackerId, parameterArray[0], "js-".concat(version$1), parameterArray[1], sharedState, __assign(__assign({}, trackerConfiguration), { plugins: plugins.map(function (p) { return p[0]; }) }));
                if (tracker) {
                    availableTrackerIds.push(tracker.id);
                }
                else {
                    LOG$1.warn(parameterArray[0] + ' already exists');
                    return;
                }
                plugins.forEach(function (p) {
                    updateAvailableFunctions(p[1]);
                });
            }
            else {
                LOG$1.error('newTracker failed', new Error('Invalid parameters'));
            }
        }
        function addPlugin(parameterArray, trackerIdentifiers) {
            var _a;
            function postScriptHandler(scriptSrc) {
                if (Object.prototype.hasOwnProperty.call(pendingPlugins, scriptSrc)) {
                    windowAlias.clearTimeout(pendingPlugins[scriptSrc].timeout);
                    delete pendingPlugins[scriptSrc];
                    tryProcessQueue();
                }
            }
            if (typeof parameterArray[0] === 'string' &&
                isStringArray(parameterArray[1]) &&
                (typeof parameterArray[2] === 'undefined' || Array.isArray(parameterArray[2]))) {
                var scriptSrc_1 = parameterArray[0], constructorPath_1 = parameterArray[1], constructorParams_1 = parameterArray[2], pauseTracking = (_a = parameterArray[3]) !== null && _a !== void 0 ? _a : true;
                if (pauseTracking) {
                    var timeout = windowAlias.setTimeout(function () {
                        postScriptHandler(scriptSrc_1);
                    }, 5000);
                    pendingPlugins[scriptSrc_1] = {
                        timeout: timeout
                    };
                }
                var pluginScript = documentAlias.createElement('script');
                pluginScript.setAttribute('src', scriptSrc_1);
                pluginScript.setAttribute('async', '1');
                addEventListener(pluginScript, 'error', function () {
                    postScriptHandler(scriptSrc_1);
                    LOG$1.warn("Failed to load plugin ".concat(constructorPath_1[0], " from ").concat(scriptSrc_1));
                }, true);
                addEventListener(pluginScript, 'load', function () {
                    var windowFn = constructorPath_1[0], innerFn = constructorPath_1[1], plugin = windowAlias[windowFn];
                    if (plugin && typeof plugin === 'object') {
                        var _a = plugin, _b = innerFn, pluginConstructor = _a[_b], api = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                        availableFunctions['addPlugin'].apply(null, [
                            { plugin: pluginConstructor.apply(null, constructorParams_1) },
                            trackerIdentifiers,
                        ]);
                        updateAvailableFunctions(api);
                    }
                    postScriptHandler(scriptSrc_1);
                }, true);
                documentAlias.head.appendChild(pluginScript);
                return;
            }
            if (typeof parameterArray[0] === 'object' &&
                typeof parameterArray[1] === 'string' &&
                (typeof parameterArray[2] === 'undefined' || Array.isArray(parameterArray[2]))) {
                var plugin = parameterArray[0], constructorPath = parameterArray[1], constructorParams = parameterArray[2];
                if (plugin) {
                    var _b = plugin, _c = constructorPath, pluginConstructor = _b[_c], api = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
                    availableFunctions['addPlugin'].apply(null, [
                        { plugin: pluginConstructor.apply(null, constructorParams) },
                        trackerIdentifiers,
                    ]);
                    updateAvailableFunctions(api);
                    return;
                }
            }
            LOG$1.warn("Failed to add Plugin: ".concat(parameterArray[1]));
        }
        /**
         * apply wrapper
         *
         * @param array - parameterArray An array comprising either:
         *      [ 'functionName', optional_parameters ]
         * or:
         *      [ functionObject, optional_parameters ]
         */
        function applyAsyncFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Outer loop in case someone push'es in zarg of arrays
            for (var i = 0; i < args.length; i += 1) {
                var parameterArray = args[i], input = Array.prototype.shift.call(parameterArray);
                // Custom callback rather than tracker method, called with trackerDictionary as the context
                if (isFunction(input)) {
                    try {
                        var fnTrackers = {};
                        for (var _a = 0, _b = getTrackers(availableTrackerIds); _a < _b.length; _a++) {
                            var tracker = _b[_a];
                            // Strip GlobalSnowplowNamespace from ID
                            fnTrackers[tracker.id.replace("".concat(functionName, "_"), '')] = tracker;
                        }
                        input.apply(fnTrackers, parameterArray);
                    }
                    catch (ex) {
                        LOG$1.error('Tracker callback failed', ex);
                    }
                    finally {
                        continue;
                    }
                }
                var parsedString = parseInputString(input), f = parsedString[0], names = parsedString[1];
                if (f === 'newTracker') {
                    newTracker(parameterArray);
                    continue;
                }
                var trackerIdentifiers = names ? names.map(function (n) { return "".concat(functionName, "_").concat(n); }) : availableTrackerIds;
                if (f === 'addPlugin') {
                    addPlugin(parameterArray, trackerIdentifiers);
                    continue;
                }
                var fnParameters = void 0;
                if (parameterArray.length > 0) {
                    fnParameters = [parameterArray[0], trackerIdentifiers];
                }
                else if (typeof availableFunctions[f] !== 'undefined') {
                    fnParameters = availableFunctions[f].length === 2 ? [{}, trackerIdentifiers] : [trackerIdentifiers];
                }
                else {
                    fnParameters = [trackerIdentifiers];
                }
                if (Object.keys(pendingPlugins).length > 0) {
                    pendingQueue.push([f, fnParameters]);
                    continue;
                }
                dispatch(f, fnParameters);
            }
        }
        // We need to manually apply any events collected before this initialization
        for (var i = 0; i < asyncQueue.length; i++) {
            applyAsyncFunction(asyncQueue[i]);
        }
        return {
            push: applyAsyncFunction
        };
    }

    /*
     * Copyright (c) 2022 Snowplow Analytics Ltd, 2010 Anthon Pang
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     *    list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
     * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
     * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
     * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
     * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
     * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
     * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */
    var functionName = window.GlobalSnowplowNamespace.shift(), queue = window[functionName];
    // Now replace initialization array with queue manager object
    queue.q = InQueueManager(functionName, queue.q);

})();
//# sourceMappingURL=sp.js.map
