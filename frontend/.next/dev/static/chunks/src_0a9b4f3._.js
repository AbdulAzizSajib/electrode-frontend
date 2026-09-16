(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/product/CompareButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompareButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.mjs [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compare-storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CompareButton({ slug, className, size = 16, withLabel = false }) {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const slugs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCompareSlugs"]);
    const isHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCompareHydrated"]);
    const isFull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCompareFull"]);
    const isCompared = slugs.includes(slug);
    // Transient acknowledgement, so a click is never silent. There is no toast
    // system in this app; the compare bar is the durable feedback and this covers
    // the moment before the eye reaches it.
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CompareButton.useEffect": ()=>{
            return ({
                "CompareButton.useEffect": ()=>{
                    if (timer.current) clearTimeout(timer.current);
                }
            })["CompareButton.useEffect"];
        }
    }["CompareButton.useEffect"], []);
    function flash(next) {
        setNotice(next);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(()=>setNotice(null), 2200);
    }
    function handleToggle() {
        if (isCompared) {
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromCompare"])(slug));
            setNotice(null);
            return;
        }
        // The reducer refuses the add at capacity; checking here is what lets the
        // shopper be told why instead of watching nothing happen.
        if (isFull) {
            flash("full");
            return;
        }
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCompare"])(slug));
        flash("added");
    }
    const label = !isHydrated ? "Compare" : isCompared ? "Comparing" : notice === "full" ? `Compare list full (${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPARE_LIMIT"]})` : "Compare";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: handleToggle,
        "aria-pressed": isHydrated ? isCompared : undefined,
        "aria-label": isCompared ? "Remove from comparison" : "Add to comparison",
        title: label,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex items-center gap-1.5 transition-colors", isHydrated && isCompared && "text-brand", notice === "full" && "text-sale", className),
        children: [
            isHydrated && isCompared ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                size: size
            }, void 0, false, {
                fileName: "[project]/src/components/product/CompareButton.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                size: size
            }, void 0, false, {
                fileName: "[project]/src/components/product/CompareButton.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this),
            withLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "whitespace-nowrap",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/product/CompareButton.tsx",
                lineNumber: 111,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/CompareButton.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(CompareButton, "oXbCoDojkO5b3aO+Yl4PhfSM2II=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = CompareButton;
var _c;
__turbopack_context__.k.register(_c, "CompareButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/OptionSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OptionSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
"use client";
;
;
function OptionSelector({ options, onSelect, className }) {
    if (options.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("space-y-4", className),
        children: options.map((option)=>{
            const selected = option.values.find((value)=>value.isSelected);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-sm font-semibold text-gray-700",
                        children: [
                            option.name,
                            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 font-normal text-gray-500",
                                children: [
                                    "— ",
                                    selected.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/OptionSelector.tsx",
                                lineNumber: 38,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/OptionSelector.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: option.values.map((value)=>option.presentation === "SWATCH" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onSelect(option.id, value.id),
                                disabled: !value.isAvailable,
                                "aria-pressed": value.isSelected,
                                // The swatch is the only thing on screen naming this value,
                                // so the label has to travel for anyone who cannot see or
                                // distinguish the colour.
                                "aria-label": value.isAvailable ? value.label : `${value.label} (unavailable)`,
                                title: value.label,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative h-9 w-9 rounded-full border-2 transition-colors", value.isSelected ? "border-brand" : "border-gray-200 hover:border-gray-400", !value.isAvailable && "cursor-not-allowed opacity-40"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute inset-1 rounded-full border border-black/10",
                                        style: {
                                            backgroundColor: value.swatch ?? "#e5e7eb"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/OptionSelector.tsx",
                                        lineNumber: 70,
                                        columnNumber: 21
                                    }, this),
                                    !value.isAvailable && // A line through the swatch, so unavailability does not
                                    // rest on opacity alone.
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute inset-0 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-px w-7 rotate-45 bg-gray-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/OptionSelector.tsx",
                                            lineNumber: 78,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/OptionSelector.tsx",
                                        lineNumber: 77,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, value.id, true, {
                                fileName: "[project]/src/components/product/OptionSelector.tsx",
                                lineNumber: 47,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onSelect(option.id, value.id),
                                disabled: !value.isAvailable,
                                "aria-pressed": value.isSelected,
                                "aria-label": value.isAvailable ? value.label : `${value.label} (unavailable)`,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rounded border px-3 py-2 text-sm transition-colors", value.isSelected ? "border-brand bg-blue-50 font-semibold text-brand" : "border-gray-200 hover:border-gray-400", !value.isAvailable && "cursor-not-allowed text-gray-400 line-through opacity-60"),
                                children: value.label
                            }, value.id, false, {
                                fileName: "[project]/src/components/product/OptionSelector.tsx",
                                lineNumber: 83,
                                columnNumber: 19
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/OptionSelector.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, this)
                ]
            }, option.id, true, {
                fileName: "[project]/src/components/product/OptionSelector.tsx",
                lineNumber: 34,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/product/OptionSelector.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = OptionSelector;
var _c;
__turbopack_context__.k.register(_c, "OptionSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.mjs [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/focus-ring.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductQuickView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductQuickView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$WishlistButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/WishlistButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/CompareButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StarRating.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog-features.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const ACTION_BASE = "flex min-h-11 w-full items-center justify-center gap-2 rounded border py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors motion-reduce:transition-none";
const ACTION_IDLE = "border-brand bg-white text-brand hover:bg-brand hover:text-white";
const ACTION_BUSY = "cursor-wait border-brand bg-brand text-white";
const ACTION_DONE = "border-brand bg-brand text-white";
const ACTION_DISABLED = "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-600";
const ACTION_CLASS = `${ACTION_BASE} ${ACTION_IDLE} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]}`;
const ADDED_FEEDBACK_MS = 1600;
function ProductCard({ product }) {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const [addItem, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"])();
    const discount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["discountPercent"])(product.offerPrice, product.sellingPrice);
    const { showWishlist, showCompare, showQuickView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCatalogFeatures"])();
    const [quickViewOpen, setQuickViewOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [justAdded, setJustAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const addedTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductCard.useEffect": ()=>({
                "ProductCard.useEffect": ()=>{
                    if (addedTimer.current) clearTimeout(addedTimer.current);
                }
            })["ProductCard.useEffect"]
    }["ProductCard.useEffect"], []);
    const actionContent = isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                size: 14,
                className: "animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            "Adding..."
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductCard.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this) : justAdded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                size: 14,
                className: "animate-tick-in motion-reduce:animate-none"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            "Added"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductCard.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                size: 14
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            "Add to cart"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductCard.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
    async function handleAdd() {
        try {
            await addItem({
                productId: product.id,
                quantity: 1
            }).unwrap();
            setJustAdded(true);
            if (addedTimer.current) clearTimeout(addedTimer.current);
            addedTimer.current = setTimeout(()=>setJustAdded(false), ADDED_FEEDBACK_MS);
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])());
        } catch  {}
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-gray-300 hover:shadow-md motion-reduce:transition-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-7/6 overflow-hidden rounded-md bg-gray-100",
                children: [
                    discount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute left-0 top-0 z-10 rounded bg-brand px-2 py-1 text-xs font-semibold text-white",
                        children: [
                            "-",
                            discount,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    product.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute left-3 z-10 rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white", discount ? "top-12" : "top-3"),
                        children: product.badge
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-0  top-0 z-10 flex flex-col items-end gap-3",
                        children: [
                            !product.inStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold text-white",
                                children: "Sold out"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            showWishlist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$WishlistButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                productId: product.id,
                                size: 16,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-sale", "after:absolute after:-inset-1.5 after:content-['']", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"])
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            showCompare && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                slug: product.slug,
                                size: 16,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-brand", "after:absolute after:-inset-1.5 after:content-['']", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"])
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/products/${product.slug}`,
                        tabIndex: -1,
                        "aria-hidden": "true",
                        className: "block h-full w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: product.image,
                            alt: product.name,
                            width: 500,
                            height: 500,
                            sizes: "(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("h-full w-full object-cover  transition-transform duration-300", "group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100", !product.inStock && "opacity-60")
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductCard.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2.5 flex flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/products/${product.slug}`,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("line-clamp-2 rounded-sm text-sm font-medium leading-snug text-gray-900 hover:text-brand", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    product.rating !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                rating: product.rating,
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs tabular-nums text-gray-500",
                                children: [
                                    "(",
                                    product.reviewCount,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto pt-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("truncate text-base font-semibold tabular-nums", discount ? "text-sale" : "text-gray-900"),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(product.offerPrice)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            product.sellingPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-xs tabular-nums text-gray-500 line-through",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(product.sellingPrice)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: !product.inStock ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ACTION_BASE, ACTION_DISABLED),
                                    disabled: true,
                                    children: "Sold out"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductCard.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, this) : !product.isVariable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ACTION_BASE, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"], justAdded ? ACTION_DONE : isLoading ? ACTION_BUSY : ACTION_IDLE),
                                    onClick: handleAdd,
                                    disabled: isLoading,
                                    children: actionContent
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductCard.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this) : showQuickView ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: ACTION_CLASS,
                                    onClick: ()=>setQuickViewOpen(true),
                                    "aria-haspopup": "dialog",
                                    "aria-expanded": quickViewOpen,
                                    children: actionContent
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductCard.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products/${product.slug}`,
                                    className: ACTION_CLASS,
                                    children: actionContent
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductCard.tsx",
                                    lineNumber: 234,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductCard.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductCard.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            showQuickView && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductQuickView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                product: product,
                isOpen: quickViewOpen,
                onClose: ()=>setQuickViewOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductCard.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductCard.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "jzUwP++1eDJJAefSBVdmiRSGyew=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"]
    ];
});
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductDetail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.mjs [app-client] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.mjs [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/focus-ring.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/variant-gallery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-options.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$guest$2d$checkout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/guest-checkout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductGallery.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductVideo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductVideo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RichText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/RichText.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize-html.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$OptionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/OptionSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductReviews$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductReviews.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$WishlistButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/WishlistButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/CompareButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StarRating.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog-features.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const TABS = [
    {
        id: "description",
        label: "Description"
    },
    {
        id: "shipping",
        label: "Shipping & Returns"
    },
    {
        id: "reviews",
        label: "Reviews"
    }
];
/**
 * The most a shopper may put in the box in one go.
 *
 * Stock is the real ceiling and is applied first; this only covers the case
 * where stock is high enough that the stepper stops being a stepper. Nobody
 * reaches 99 by clicking, so the cap costs a genuine buyer nothing while
 * keeping a held-down key from sending a four-digit quantity to checkout.
 */ const MAX_QUANTITY = 99;
/**
 * Everything the two buy buttons share.
 *
 * They are a matched pair and must stay the same size, weight and rhythm — only
 * their fill differs. Previously each carried its own full class string in a
 * different idiom, which is how one of them ended up without a transition.
 *
 * `h-12` rather than `py-3`: the primary has no icon and the secondary does, so
 * padding alone left the two a few pixels apart in height whenever the spinner
 * appeared.
 */ const BUY_BUTTON_BASE = "flex h-12 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed";
function ProductDetail({ product, related, initialReviews, initialBreakdown, initialReviewMeta, reviewsUnavailable, isSignedIn }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const [addItem, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"])();
    const { showWishlist, showCompare } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCatalogFeatures"])();
    const images = product.images.length > 0 ? product.images : [
        {
            url: product.image,
            variantId: null
        }
    ];
    /*
   * Selection is a value per option, not a variant id: on a two-option product
   * "Black" is not a variant, so there is nothing to store until both options
   * are answered. The variant is derived from the choices instead.
   *
   * Seeded from the default variant so a single-option product opens resolved,
   * exactly as it did before options existed.
   */ const [choices, setChoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ProductDetail.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["choicesForVariant"])(product, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultVariant"])(product))
    }["ProductDetail.useState"]);
    const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOptions"])(product, choices);
    const selectedVariant = selection.variant;
    const selectedVariantId = selectedVariant?.id ?? null;
    // `images` goes to the gallery as-is. Nothing is filtered out — the selection
    // decides which image leads, not which images exist — and nothing is
    // reordered either: a strip that puts the selected photo first can never show
    // the highlight ring moving, because the selected thumbnail is always the
    // first one.
    // The displayed image, as a url. `undefined` means "follow the selection",
    // which is what makes picking an option move to that option's photo without
    // an effect and without a second piece of state to fall out of step.
    const [activeImageUrl, setActiveImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    /**
   * Picking a value on one option control.
   *
   * The gallery moves to the newly-resolved variant's first image by clearing
   * the explicit image choice, so the display falls through to whatever the
   * selection points at. When the resolution has no photo of its own —
   * including while the selection is still incomplete — there is nothing to
   * move to, and clearing would displace whatever the shopper was looking at
   * with an unrelated photo, so the current image is pinned instead.
   *
   * `activeImage` is declared below; this only reads it on click, long after
   * render has initialised it.
   */ function selectOptionValue(optionId, valueId) {
        const next = {
            ...choices,
            [optionId]: valueId
        };
        const nextVariantId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveVariant"])(product, next)?.id;
        const hasOwnImage = nextVariantId !== undefined && images.some((img)=>img.variantId === nextVariantId);
        setChoices(next);
        setActiveImageUrl(hasOwnImage ? undefined : activeImage?.url);
        setQuantity(1);
    }
    /**
   * Selecting a thumbnail. One transition, setting the image AND the selection
   * together.
   *
   * Doing it in two steps looks equivalent and is not: an explicit url is what
   * stops the "follow the selection" fallback from swapping the very photo just
   * clicked for the variant's primary one, on a variant with several photos.
   */ function selectImage(image) {
        setActiveImageUrl(image.url);
        const variantId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variantIdForImage"])(image);
        // A shared image depicts no particular option, so it leaves the choice be.
        if (!variantId) return;
        const variant = product.variants.find((v)=>v.id === variantId);
        if (variant) setChoices((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["choicesForVariant"])(product, variant));
    }
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("description");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    /**
   * The tab buttons, so the strip can move focus itself.
   *
   * A tablist is a single tab stop: arrow keys move between tabs, and Tab
   * leaves for the panel. That requires focusing a sibling programmatically,
   * which needs a handle on the elements.
   */ const tabRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    /**
   * Jumps from the rating row under the title down to the reviews panel.
   *
   * Focus follows the scroll rather than staying behind on the rating link. A
   * keyboard or screen-reader user who activates this would otherwise be
   * looking at reviews with their focus still twelve hundred pixels up the
   * page, and their next Tab would walk them back through the buy controls.
   */ function showReviews() {
        setTab("reviews");
        document.getElementById("product-tabs")?.scrollIntoView({
            behavior: "smooth"
        });
        tabRefs.current.reviews?.focus({
            preventScroll: true
        });
    }
    /**
   * Arrow-key movement across the tab strip, per the tabs pattern: Left/Right
   * wrap around the ends, Home/End jump to them. Selection follows focus, which
   * is the correct choice here because every panel is already rendered — moving
   * to one costs nothing, so there is no reason to make the shopper confirm.
   */ function handleTabKeyDown(event) {
        const index = TABS.findIndex((t)=>t.id === tab);
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = TABS.length - 1;
        else return;
        event.preventDefault();
        const nextTab = TABS[next].id;
        setTab(nextTab);
        tabRefs.current[nextTab]?.focus();
    }
    // The image actually on screen, resolved in the order the shopper's intent
    // runs: the photo they explicitly picked, else the selected variant's own
    // photo, else the product's primary. The middle rung is what the gallery's
    // reordering used to provide, moved here where it belongs — it is a fact
    // about the selection, not about how a strip is laid out.
    const activeImage = images.find((img)=>img.url === activeImageUrl) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstImageForVariant"])(images, selectedVariantId) ?? images[0];
    // What the shopper actually pays: the chosen variant's price when there is
    // one, the product's base price otherwise.
    const activePrice = selectedVariant?.offerPrice ?? product.offerPrice;
    const activeCompareAt = selectedVariant?.sellingPrice ?? product.sellingPrice;
    const discount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["discountPercent"])(activePrice, activeCompareAt);
    const availableStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
    /*
   * The quantity box used to climb without limit — `q + 1` on every click, with
   * nothing reading stock. A shopper could ask for forty of a three-in-stock
   * item and only find out at the server, after entering an address.
   *
   * The ceiling is the stock actually available for the current selection, so
   * it moves when the shopper picks a different variant. `selectOptionValue`
   * already resets the quantity to 1 on that change, so the displayed value can
   * never be left above a newly-lower ceiling.
   */ const maxQuantity = Math.max(1, Math.min(availableStock, MAX_QUANTITY));
    const atMaxQuantity = quantity >= maxQuantity;
    function changeQuantity(next) {
        setQuantity(Math.max(1, Math.min(next, maxQuantity)));
    }
    // Nothing may be added until every option is answered — an incomplete
    // selection does not name a product to buy. `selection.isComplete` covers a
    // legacy product too, whose single synthetic option opens already answered.
    const canAdd = availableStock > 0 && (product.variants.length === 0 ? !product.isVariable : selection.isComplete);
    async function handleAddToCart() {
        setError("");
        try {
            await addItem({
                productId: product.id,
                variantId: selectedVariantId ?? undefined,
                quantity
            }).unwrap();
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])());
        } catch  {
            setError("Could not add this to your cart. Please try again.");
        }
    }
    /**
   * Buys this one product on its own. Deliberately does NOT add to the cart
   * first: the backend takes checkout lines directly, so a shopper arriving
   * from a campaign link goes product → checkout in one step, and whatever they
   * already had in their cart is left exactly as it was.
   *
   * The display fields ride along only so checkout can render the item — the
   * server resolves name, SKU and price itself, so nothing here is trusted.
   */ function handleBuyItNow() {
        setError("");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$guest$2d$checkout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveDirectOrderIntent"])({
            item: {
                productId: product.id,
                variantId: selectedVariantId ?? undefined,
                quantity
            },
            display: {
                name: product.name,
                // The photo the shopper is looking at, not a fixed first image — which
                // would show the wrong colour after switching options.
                image: activeImage?.url ?? "",
                unitPrice: activePrice,
                variantName: selectedVariant?.name
            }
        });
        router.push("/checkout");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container-px site-container py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Breadcrumb",
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rounded-sm hover:text-brand", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            "aria-hidden": true,
                            className: "text-gray-300",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this),
                        product.category && product.categorySlug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products?category=${encodeURIComponent(product.categorySlug)}`,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rounded-sm hover:text-brand", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                                        children: product.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 338,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductDetail.tsx",
                                    lineNumber: 337,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    "aria-hidden": true,
                                    className: "text-gray-300",
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductDetail.tsx",
                                    lineNumber: 345,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                            lineNumber: 336,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "min-w-0 max-w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-current": "page",
                                className: "block truncate text-gray-700",
                                title: product.name,
                                children: product.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                            lineNumber: 353,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/product/ProductDetail.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductDetail.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-10 lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                images: images,
                                activeUrl: activeImage?.url,
                                onSelect: selectImage,
                                title: product.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            product.video && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductVideo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                url: product.video,
                                thumbnail: product.videoThumbnail,
                                title: product.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 376,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            product.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mb-2 inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand",
                                children: product.badge
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900 sm:text-3xl",
                                children: product.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            product.unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-gray-500",
                                children: product.unit
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 396,
                                columnNumber: 13
                            }, this),
                            product.rating !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        rating: product.rating,
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 403,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-500",
                                        children: [
                                            product.rating.toFixed(1),
                                            " out of 5"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 404,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: showReviews,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rounded-sm text-sm text-brand underline-offset-2 hover:underline", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                                        children: [
                                            product.reviewCount,
                                            " review",
                                            product.reviewCount === 1 ? "" : "s"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 407,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold tabular-nums text-sale",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(activePrice)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this),
                                    activeCompareAt && activeCompareAt > activePrice && // Read aloud as what it is. A bare struck-through number is
                                    // announced as a second price with no indication it is the old
                                    // one, which is the opposite of what the strike conveys visually.
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg tabular-nums text-gray-400 line-through",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Regular price: "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 435,
                                                columnNumber: 17
                                            }, this),
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(activeCompareAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 434,
                                        columnNumber: 15
                                    }, this),
                                    discount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded bg-brand px-2 py-1 text-xs font-semibold tabular-nums text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Save "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 441,
                                                columnNumber: 17
                                            }, this),
                                            discount,
                                            "%",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: " off"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 442,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, this),
                            !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBlankHtml"])(product.shortDescription) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RichText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                html: product.shortDescription,
                                className: "mt-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 450,
                                columnNumber: 13
                            }, this),
                            product.bundleDeal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 inline-flex items-center gap-2 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, this),
                                    "Buy ",
                                    product.bundleDeal.buyQuantity,
                                    ", get ",
                                    product.bundleDeal.freeQuantity,
                                    " free"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 454,
                                columnNumber: 13
                            }, this),
                            (product.isRefundable !== undefined || product.hasWarranty !== undefined) && // Given a surface of their own rather than sitting as loose text in
                            // the run of the page. These are the two reassurances a shopper
                            // looks for right before committing, and as bare gray body copy
                            // they read as another specification line.
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-gray-50 px-4 py-3 text-sm",
                                children: [
                                    product.isRefundable !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "inline-flex items-center gap-2 text-gray-700",
                                        children: [
                                            product.isRefundable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                size: 15,
                                                className: "shrink-0 text-green-700",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 474,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                size: 15,
                                                className: "shrink-0 text-gray-400",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 476,
                                                columnNumber: 21
                                            }, this),
                                            product.isRefundable ? "Refundable" : "Not refundable"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 472,
                                        columnNumber: 17
                                    }, this),
                                    product.hasWarranty !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "inline-flex items-center gap-2 text-gray-700",
                                        children: [
                                            product.hasWarranty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                size: 15,
                                                className: "shrink-0 text-green-700",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 484,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                size: 15,
                                                className: "shrink-0 text-gray-400",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 486,
                                                columnNumber: 21
                                            }, this),
                                            product.hasWarranty ? "Warranty included" : "No warranty"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 482,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this),
                            product.viewCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 flex items-center gap-2 text-xs text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 519,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(product.viewCount),
                                    " ",
                                    product.viewCount === 1 ? "person has" : "people have",
                                    " viewed this product"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 518,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-sm",
                                "aria-live": "polite",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-gray-700",
                                        children: "Availability: "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 535,
                                        columnNumber: 13
                                    }, this),
                                    availableStock > 0 ? // Low stock is stated plainly rather than dressed as urgency.
                                    // The count is real, so it can carry weight honestly; the page
                                    // deliberately removed a fabricated countdown for the same
                                    // reason, and this must not reintroduce that voice.
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: availableStock <= 5 ? "font-medium text-amber-700" : "text-green-700",
                                        children: availableStock <= 5 ? `Only ${availableStock} left` : `${availableStock} in stock`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-sale",
                                        children: "Sold out"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 547,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$OptionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                options: selection.options,
                                onSelect: selectOptionValue,
                                className: "mt-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 551,
                                columnNumber: 11
                            }, this),
                            selection.unansweredNames.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-sm text-gray-500",
                                children: [
                                    "Choose a ",
                                    selection.unansweredNames.join(" and a "),
                                    " to continue."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this),
                            availableStock > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        id: "quantity-label",
                                        className: "mb-2 text-sm font-semibold text-gray-700",
                                        children: "Quantity"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 572,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-x-4 gap-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
                                                role: "spinbutton",
                                                "aria-labelledby": "quantity-label",
                                                "aria-valuenow": quantity,
                                                "aria-valuemin": 1,
                                                "aria-valuemax": maxQuantity,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex h-11 w-11 items-center justify-center text-gray-600 transition-colors", "hover:bg-gray-50 hover:text-gray-900", "disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"], "focus-visible:ring-offset-0"),
                                                        onClick: ()=>changeQuantity(quantity - 1),
                                                        disabled: quantity <= 1,
                                                        "aria-label": "Decrease quantity",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                            lineNumber: 606,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        "aria-hidden": true,
                                                        className: "w-10 text-center text-sm font-medium tabular-nums text-gray-900",
                                                        children: quantity
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex h-11 w-11 items-center justify-center text-gray-600 transition-colors", "hover:bg-gray-50 hover:text-gray-900", "disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"], "focus-visible:ring-offset-0"),
                                                        onClick: ()=>changeQuantity(quantity + 1),
                                                        disabled: atMaxQuantity,
                                                        "aria-label": "Increase quantity",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                        lineNumber: 614,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 585,
                                                columnNumber: 17
                                            }, this),
                                            atMaxQuantity && availableStock <= MAX_QUANTITY && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: [
                                                    "All ",
                                                    availableStock,
                                                    " in stock"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 634,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 575,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 571,
                                columnNumber: 13
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                role: "alert",
                                className: "mt-4 text-sm font-medium text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 645,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex flex-col gap-3 sm:flex-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleAddToCart,
                                        disabled: !canAdd || isLoading,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(BUY_BUTTON_BASE, "border border-brand text-brand hover:bg-brand hover:text-white", "disabled:border-gray-300 disabled:bg-transparent disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                                        children: [
                                            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 16,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 674,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 676,
                                                columnNumber: 17
                                            }, this),
                                            isLoading ? "Adding..." : "Add to cart"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleBuyItNow,
                                        disabled: !canAdd || isLoading,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(BUY_BUTTON_BASE, "border border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark", "disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"]),
                                        children: "Buy it now"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 680,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 661,
                                columnNumber: 11
                            }, this),
                            availableStock === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-sm text-gray-500",
                                children: [
                                    "This item is out of stock.",
                                    " ",
                                    product.variants.length > 0 ? "Try another option above." : "Check back soon."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 699,
                                columnNumber: 13
                            }, this),
                            (showWishlist || showCompare) && // `gap-x-6` with a row gap, so the two wrap cleanly on a narrow
                            // viewport instead of being pushed off the edge. Both get the
                            // page's focus ring and a target tall enough to hit on touch —
                            // as bare text links they had neither.
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500",
                                children: [
                                    showWishlist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$WishlistButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        productId: product.id,
                                        size: 16,
                                        withLabel: true,
                                        standalone: true,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("min-h-11 rounded-sm hover:text-brand", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"])
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 716,
                                        columnNumber: 17
                                    }, this),
                                    showCompare && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        slug: product.slug,
                                        size: 16,
                                        withLabel: true,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("min-h-11 rounded-sm hover:text-brand", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$focus$2d$ring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUS_RING"])
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 725,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 714,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                className: "mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "w-40 shrink-0 text-gray-500",
                                                children: "SKU"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 742,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "wrap-break-word text-gray-800",
                                                children: selectedVariant?.sku ?? product.sku
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 745,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 741,
                                        columnNumber: 13
                                    }, this),
                                    product.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "w-40 shrink-0 text-gray-500",
                                                children: "Brand"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 751,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "text-gray-800",
                                                children: product.brand
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 752,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 750,
                                        columnNumber: 15
                                    }, this),
                                    product.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "w-40 shrink-0 text-gray-500",
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 757,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "text-gray-800",
                                                children: product.category
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 758,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 756,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 740,
                                columnNumber: 11
                            }, this),
                            product.attributes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 border-t border-gray-100 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mb-3 text-sm font-semibold text-gray-700",
                                        children: "Specifications"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 765,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "space-y-2 text-sm",
                                        children: product.attributes.map((attr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "w-40 shrink-0 text-gray-500",
                                                        children: attr.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                        lineNumber: 769,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "wrap-break-word text-gray-800",
                                                        children: attr.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, `${attr.name}-${attr.value}`, true, {
                                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                                lineNumber: 768,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 766,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 764,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductDetail.tsx",
                lineNumber: 365,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "product-tabs",
                className: "mt-12 border-t border-gray-100 pt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "tablist",
                        "aria-label": "Product information",
                        /*
           * Horizontally scrollable rather than wrapped or squeezed: three tabs
           * with a review count do not fit a 320px viewport, and a wrapped tab
           * strip loses the underline's meaning as a single row.
           *
           * `tabs-scroller` hides the bar itself. This storefront deliberately
           * PAINTS scrollbars inside nested scrollers (globals.css) so a panel
           * that runs past the fold says so — correct for the cart drawer and
           * the mobile menu, wrong here. A tab strip is three words wide; on
           * desktop it never overflows, yet the scroll container still reserved
           * an 8px gutter and drew a thumb in the empty space to the right of
           * "Reviews". The scrolling is kept for narrow viewports; only the
           * painted bar goes.
           */ className: "tabs-scroller mb-6 flex gap-8 overflow-x-auto border-b border-gray-100",
                        children: TABS.map(({ id, label })=>{
                            const isSelected = tab === id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: (node)=>{
                                    tabRefs.current[id] = node;
                                },
                                type: "button",
                                role: "tab",
                                id: `product-tab-${id}`,
                                "aria-selected": isSelected,
                                "aria-controls": `product-panel-${id}`,
                                tabIndex: isSelected ? 0 : -1,
                                onClick: ()=>setTab(id),
                                onKeyDown: handleTabKeyDown,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2", isSelected ? "border-brand text-brand" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"),
                                children: [
                                    label,
                                    id === "reviews" && product.reviewCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums",
                                        children: [
                                            " (",
                                            product.reviewCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                                        lineNumber: 834,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, id, true, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 811,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 789,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "tabpanel",
                        id: `product-panel-${tab}`,
                        "aria-labelledby": `product-tab-${tab}`,
                        children: [
                            tab === "description" && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBlankHtml"])(product.description) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "max-w-3xl text-sm leading-relaxed text-gray-600",
                                children: "No description available for this product yet."
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 865,
                                columnNumber: 15
                            }, this) : /* Merchant-authored markup. `RichText` sanitises it here, where it
                 meets the browser — never trusting what was stored. */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RichText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                html: product.description,
                                className: "max-w-3xl"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 871,
                                columnNumber: 15
                            }, this)),
                            tab === "shipping" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "max-w-3xl text-sm leading-relaxed text-gray-600",
                                children: "Items can be returned or exchanged within 30 days of delivery in original condition. Contact support to start a return."
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 874,
                                columnNumber: 13
                            }, this),
                            tab === "reviews" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductReviews$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                productId: product.id,
                                initialReviews: initialReviews,
                                initialBreakdown: initialBreakdown,
                                initialMeta: initialReviewMeta,
                                initialError: reviewsUnavailable,
                                isSignedIn: isSignedIn
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 880,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 858,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductDetail.tsx",
                lineNumber: 788,
                columnNumber: 7
            }, this),
            related.length > 0 && // A landmark with its own name, so this is reachable as a region and
            // not read as a continuation of the tab panel above it.
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-labelledby": "related-heading",
                className: "mt-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "related-heading",
                        className: "mb-6 text-xl font-bold text-gray-900",
                        children: "You may also like"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 900,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6",
                        children: related.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                product: p
                            }, p.id, false, {
                                fileName: "[project]/src/components/product/ProductDetail.tsx",
                                lineNumber: 905,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductDetail.tsx",
                        lineNumber: 903,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductDetail.tsx",
                lineNumber: 895,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductDetail.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
_s(ProductDetail, "yVxJPf6LRLu8CHhtmhvFUrkbiJI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"]
    ];
});
_c = ProductDetail;
var _c;
__turbopack_context__.k.register(_c, "ProductDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductGallery.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ProductGallery({ images, activeUrl, onSelect, title }) {
    _s();
    const active = images.find((img)=>img.url === activeUrl) ?? images[0];
    // With the strip no longer reordered, the selected thumbnail can sit outside
    // the scrolled region on a product with many photos. Bringing it into view is
    // what the reordering was really for. `nearest` on both axes so this nudges
    // the strip's own scroll and leaves the page where the shopper put it.
    const activeThumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            activeThumb.current?.scrollIntoView({
                block: "nearest",
                inline: "nearest"
            });
        }
    }["ProductGallery.useEffect"], [
        active
    ]);
    if (images.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col-reverse gap-4 sm:flex-row",
        children: [
            images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 overflow-x-auto overflow-y-hidden sm:max-h-112 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto",
                children: images.map((img, i)=>{
                    const isActive = active.url === img.url;
                    return(// Keyed by url *and* variant: the same file can be assigned to two
                    // variants, and the list is not filtered, so a url alone is not
                    // unique and React would silently reuse the wrong element.
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        ref: isActive ? activeThumb : undefined,
                        type: "button",
                        onClick: ()=>onSelect(img),
                        // The ring is the only thing saying which photo is showing, so
                        // it needs a non-visual equivalent too.
                        "aria-pressed": isActive,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 bg-gray-100 transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2", isActive ? "border-brand" : "border-transparent hover:border-gray-300"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: img.url,
                            alt: img.altText ?? `${title} thumbnail ${i + 1}`,
                            fill: true,
                            sizes: "64px",
                            className: "object-contain"
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductGallery.tsx",
                            lineNumber: 73,
                            columnNumber: 17
                        }, this)
                    }, `${img.variantId ?? "shared"}:${img.url}`, false, {
                        fileName: "[project]/src/components/product/ProductGallery.tsx",
                        lineNumber: 59,
                        columnNumber: 15
                    }, this));
                })
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductGallery.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-square flex-1 overflow-hidden rounded-xl bg-gray-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: active.url,
                    alt: active.altText ?? title,
                    fill: true,
                    sizes: "(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 100vw",
                    className: "object-contain",
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductGallery.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductGallery.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductGallery.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(ProductGallery, "wrRZIXT71DvJ9M1osfoiHhrW3wc=");
_c = ProductGallery;
var _c;
__turbopack_context__.k.register(_c, "ProductGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductQuickView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductQuickView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/variant-gallery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-options.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductGallery.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RichText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/RichText.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize-html.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$OptionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/OptionSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/CompareButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog-features.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function ProductQuickView({ product, isOpen, onClose }) {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const [addItem, { isLoading: isAdding }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"])();
    const { showCompare } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCatalogFeatures"])();
    // A closed quick view holds no subscription; the cache entry is keyed by slug
    // so a response arriving after the shopper moved on cannot be shown here.
    const { data: detailed, isFetching, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductBySlugQuery"])(product.slug, {
        skip: !isOpen
    });
    // Only the shopper's *explicit* choices are state. The effective selection is
    // derived below, so the preselected variant needs no effect to install it —
    // which also means it cannot briefly render as unselected, and does not have
    // to wait for `detailed` to arrive before seeding.
    const [chosenValues, setChosenValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /** Displayed image url; `undefined` means "follow the selection". */ const [activeImageUrl, setActiveImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [addError, setAddError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const variants = detailed?.variants ?? [];
    /*
   * Options resolve against the fetched detail, which is the only payload
   * carrying them. Until it arrives there are no options and no variants, so
   * the panel renders the card's own price and cannot be added — which is what
   * `canAdd`'s `Boolean(detailed)` already required.
   *
   * Choices default to those selecting the first in-stock variant, so a shopper
   * indifferent to the choice is not blocked. Deriving rather than storing that
   * default means it needs no effect and cannot briefly render as unselected.
   */ const selection = detailed ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOptions"])(detailed, chosenValues ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["choicesForVariant"])(detailed, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultVariant"])(detailed))) : null;
    const selectedVariant = selection?.variant ?? null;
    const selectedVariantId = selectedVariant?.id ?? null;
    /**
   * Picking a value on one option control. Moves to the newly-resolved
   * variant's first image, or leaves the displayed photo alone when it has none
   * of its own (see ProductDetail). `images` and `activeImage` are declared
   * below; this only reads them on click, long after render has initialised
   * them.
   */ function selectOptionValue(optionId, valueId) {
        if (!detailed) return;
        const current = chosenValues ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["choicesForVariant"])(detailed, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultVariant"])(detailed));
        const next = {
            ...current,
            [optionId]: valueId
        };
        const nextVariantId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveVariant"])(detailed, next)?.id;
        const hasOwnImage = nextVariantId !== undefined && images.some((img)=>img.variantId === nextVariantId);
        setChosenValues(next);
        setActiveImageUrl(hasOwnImage ? undefined : activeImage?.url);
        setQuantity(1);
    }
    /**
   * Selecting a thumbnail sets the image and the selection in one transition, so
   * the "follow the selection" fallback cannot displace the photo just clicked.
   * Same reasoning as ProductDetail.
   */ function selectImage(image) {
        setActiveImageUrl(image.url);
        const variantId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["variantIdForImage"])(image);
        if (!variantId || !detailed) return;
        const variant = variants.find((v)=>v.id === variantId);
        if (variant) setChosenValues((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["choicesForVariant"])(detailed, variant));
    }
    // Clear transient state as the dialog closes rather than reacting to it
    // having closed, so a reopened panel never flashes a previous error.
    function handleClose() {
        setAddError("");
        setChosenValues(null);
        setActiveImageUrl(undefined);
        setQuantity(1);
        onClose();
    }
    // Fall back to the card's own values while the details load, so the panel is
    // populated from the first frame rather than blank.
    const base = detailed ?? product;
    const activePrice = selectedVariant?.offerPrice ?? base.offerPrice;
    const activeCompareAt = selectedVariant?.sellingPrice ?? base.sellingPrice;
    const discount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["discountPercent"])(activePrice, activeCompareAt);
    const availableStock = selectedVariant ? selectedVariant.stockQuantity : base.stockQuantity;
    const images = base.images.length > 0 ? base.images : [
        {
            url: base.image,
            variantId: null
        }
    ];
    // The strip is every image in its authored order — never filtered and never
    // reordered by the selection, which would freeze the highlight ring on the
    // first thumbnail. The displayed photo resolves the same way as the detail
    // page: explicit pick, else the selected variant's own photo, else primary.
    const activeImage = images.find((img)=>img.url === activeImageUrl) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$variant$2d$gallery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstImageForVariant"])(images, selectedVariantId) ?? images[0];
    // Nothing may be added until the real choices are known — the card's props
    // cannot tell us whether an option is still unanswered.
    const canAdd = Boolean(detailed) && !isFetching && availableStock > 0 && (variants.length === 0 ? !detailed?.isVariable : Boolean(selection?.isComplete)) && !isAdding;
    async function handleAddToCart() {
        setAddError("");
        try {
            await addItem({
                productId: base.id,
                variantId: selectedVariantId ?? undefined,
                quantity
            }).unwrap();
            // Close before opening the drawer: both are fixed z-50 overlays, and
            // leaving this mounted underneath would stack two backdrops and two
            // focus traps. Closing first also hands focus back cleanly.
            handleClose();
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])());
        } catch  {
            setAddError("Could not add this to your cart. Please try again.");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: handleClose,
        labelledById: titleId,
        closeLabel: "Close quick view",
        children: isError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center gap-4 p-10 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    id: titleId,
                    className: "text-lg font-semibold text-gray-900",
                    children: base.name
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                    lineNumber: 193,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "We couldn't load this preview. You can still view the full product page."
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                    lineNumber: 196,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/products/${base.slug}`,
                    onClick: handleClose,
                    className: "flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark",
                    children: [
                        "View Full Product Details ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 204,
                            columnNumber: 39
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                    lineNumber: 199,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/product/ProductQuickView.tsx",
            lineNumber: 192,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    images: images,
                    activeUrl: activeImage?.url,
                    onSelect: selectImage,
                    title: base.name
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                    lineNumber: 209,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        base.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500",
                            children: base.brand
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 217,
                            columnNumber: 28
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: titleId,
                            className: "mt-1 text-xl font-bold text-gray-900 sm:text-2xl",
                            children: base.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex items-center gap-3",
                            children: [
                                activeCompareAt && activeCompareAt > activePrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-base text-gray-400 line-through",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(activeCompareAt)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 228,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl font-bold text-sale",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(activePrice)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this),
                                discount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded bg-brand px-2 py-1 text-xs font-semibold text-white",
                                    children: [
                                        "-",
                                        discount,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 236,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this),
                        !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBlankHtml"])(base.shortDescription) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RichText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            html: base.shortDescription,
                            className: "mt-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 246,
                            columnNumber: 15
                        }, this),
                        isFetching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-6 flex items-center gap-2 text-sm text-gray-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 16,
                                    className: "animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 251,
                                    columnNumber: 17
                                }, this),
                                "Loading options..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 250,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-700",
                                            children: "Availability: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 257,
                                            columnNumber: 19
                                        }, this),
                                        availableStock > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-green-600",
                                            children: [
                                                availableStock,
                                                " in stock"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 259,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sale",
                                            children: "Sold out"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 261,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this),
                                selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$OptionSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    options: selection.options,
                                    onSelect: selectOptionValue,
                                    className: "mt-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 266,
                                    columnNumber: 19
                                }, this),
                                selection && selection.unansweredNames.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 text-sm text-gray-500",
                                    children: [
                                        "Choose a ",
                                        selection.unansweredNames.join(" and a "),
                                        " to continue."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 274,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-2 text-sm font-semibold text-gray-700",
                                            children: "Quantity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 280,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center rounded border border-gray-300 w-fit",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "p-3 disabled:cursor-not-allowed disabled:text-gray-300",
                                                    onClick: ()=>setQuantity((q)=>Math.max(1, q - 1)),
                                                    disabled: quantity <= 1,
                                                    "aria-label": "Decrease quantity",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-8 text-center text-sm",
                                                    children: quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "p-3 disabled:cursor-not-allowed disabled:text-gray-300",
                                                    // Never let the shopper ask for more than the merchant has.
                                                    onClick: ()=>setQuantity((q)=>Math.min(availableStock, q + 1)),
                                                    disabled: quantity >= availableStock,
                                                    "aria-label": "Increase quantity",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 281,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 279,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 255,
                            columnNumber: 15
                        }, this),
                        addError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-sm text-red-600",
                            children: addError
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 307,
                            columnNumber: 26
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 flex flex-col gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddToCart,
                                    disabled: !canAdd,
                                    className: "flex w-full items-center justify-center gap-2 rounded bg-brand py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300",
                                    children: [
                                        isAdding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 16,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 315,
                                            columnNumber: 30
                                        }, this),
                                        isAdding ? "Adding..." : "Add to Cart"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 310,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products/${base.slug}`,
                                    onClick: handleClose,
                                    className: "flex items-center justify-center gap-2 rounded border border-brand py-3 text-sm font-semibold uppercase text-brand transition-colors hover:bg-gray-50",
                                    children: [
                                        "View Full Product Details ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                            lineNumber: 324,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 319,
                                    columnNumber: 15
                                }, this),
                                showCompare && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$CompareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    slug: base.slug,
                                    withLabel: true,
                                    className: "justify-center py-1 text-sm text-gray-500 hover:text-brand"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                                    lineNumber: 328,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/product/ProductQuickView.tsx",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/product/ProductQuickView.tsx",
                    lineNumber: 216,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/product/ProductQuickView.tsx",
            lineNumber: 208,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/product/ProductQuickView.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
_s(ProductQuickView, "HbTOWvKeeayGJ6tMTX3fF0f/p3I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddItemMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductBySlugQuery"]
    ];
});
_c = ProductQuickView;
var _c;
__turbopack_context__.k.register(_c, "ProductQuickView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductReviews.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StarRating.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RatingBreakdownBars$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/RatingBreakdownBars.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ReviewForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ReviewForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/reviewApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/review.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function ProductReviews({ productId, initialReviews, initialBreakdown, initialMeta, initialError, isSignedIn }) {
    _s();
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const { data, isFetching, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductReviewsQuery"])({
        productId,
        page,
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REVIEWS_PAGE_SIZE"]
    }, {
        skip: page === 1
    });
    // Only signed-in shoppers have reviews of their own to look up, and the
    // endpoint 401s for everyone else.
    const { data: mine } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMyReviewsQuery"])(undefined, {
        skip: !isSignedIn
    });
    const ownReview = mine?.reviews.find((r)=>r.productId === productId);
    const reviews = page === 1 ? initialReviews : data?.reviews ?? [];
    const breakdown = page === 1 ? initialBreakdown : data?.breakdown ?? null;
    const meta = page === 1 ? initialMeta : data?.meta ?? initialMeta;
    const failed = page === 1 ? initialError : isError;
    // "Could not load" and "there are none" are different answers to the shopper
    // and the spec keeps them apart — an outage must never read as "no reviews".
    if (failed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-gray-600",
            children: "Reviews could not be loaded right now. Please try again shortly."
        }, void 0, false, {
            fileName: "[project]/src/components/product/ProductReviews.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    const totalPages = meta.totalPages || 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-8 lg:grid-cols-[1fr_360px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    breakdown && breakdown.total > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$RatingBreakdownBars$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        breakdown: breakdown
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    reviews.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: "No reviews yet. Be the first to review this product."
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-5",
                        children: reviews.map((review)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "border-b border-gray-100 pb-5 last:border-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                rating: review.rating,
                                                size: 13
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                                lineNumber: 81,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-gray-900",
                                                children: review.authorName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                                lineNumber: 82,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                                dateTime: review.createdAt,
                                                className: "text-xs text-gray-400",
                                                children: new Date(review.createdAt).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this),
                                    review.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-gray-900",
                                        children: review.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                                        lineNumber: 93,
                                        columnNumber: 19
                                    }, this),
                                    review.comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm leading-relaxed text-gray-600",
                                        children: review.comment
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                                        lineNumber: 98,
                                        columnNumber: 19
                                    }, this),
                                    review.adminReply && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 rounded bg-gray-50 p-3 text-sm text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-gray-900",
                                                children: "Store reply: "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                                lineNumber: 104,
                                                columnNumber: 21
                                            }, this),
                                            review.adminReply
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, review.id, true, {
                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p)=>Math.max(1, p - 1)),
                                disabled: page === 1 || isFetching,
                                className: "rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50",
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: [
                                    "Page ",
                                    page,
                                    " of ",
                                    totalPages
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p)=>Math.min(totalPages, p + 1)),
                                disabled: page >= totalPages || isFetching,
                                className: "rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            isFetching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 14,
                                className: "animate-spin text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ProductReviews.tsx",
                                lineNumber: 132,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ProductReviews.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ProductReviews.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: !isSignedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-gray-200 p-5 text-sm text-gray-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3",
                            children: "Bought this product? Sign in to leave a review."
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductReviews.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/account/login",
                            className: "inline-block rounded bg-brand px-4 py-2 text-xs font-semibold text-white",
                            children: "Sign in"
                        }, void 0, false, {
                            fileName: "[project]/src/components/product/ProductReviews.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/product/ProductReviews.tsx",
                    lineNumber: 139,
                    columnNumber: 11
                }, this) : // An existing review switches the form to edit mode rather than
                // offering a second submission the backend would reject.
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ReviewForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    productId: productId,
                    existing: ownReview
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductReviews.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductReviews.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductReviews.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(ProductReviews, "yrTnKpMG27xot8QRx4ySUcbt5JA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductReviewsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMyReviewsQuery"]
    ];
});
_c = ProductReviews;
var _c;
__turbopack_context__.k.register(_c, "ProductReviews");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ProductVideo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductVideo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ProductVideo({ url, thumbnail, title }) {
    _s();
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (playing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            src: url,
            poster: thumbnail,
            controls: true,
            autoPlay: true,
            className: "mt-4 w-full rounded-lg border border-gray-100 bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("track", {
                kind: "captions"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductVideo.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/product/ProductVideo.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>setPlaying(true),
        "aria-label": `Play video for ${title}`,
        className: "group relative mt-4 block w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100",
        children: [
            thumbnail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: thumbnail,
                alt: "",
                width: 800,
                height: 450,
                className: "h-auto w-full object-cover"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductVideo.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-video w-full bg-gray-200"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductVideo.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex size-14 items-center justify-center rounded-full bg-white/90 text-brand shadow",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                        size: 22,
                        className: "ml-1 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ProductVideo.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/product/ProductVideo.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/product/ProductVideo.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ProductVideo.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(ProductVideo, "TknKTnbLvtkeUADVhXhEVXKXunU=");
_c = ProductVideo;
var _c;
__turbopack_context__.k.register(_c, "ProductVideo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/RatingBreakdownBars.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RatingBreakdownBars
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StarRating.tsx [app-client] (ecmascript)");
;
;
function RatingBreakdownBars({ breakdown }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6 rounded-lg bg-gray-50 p-5 sm:flex-row sm:items-center sm:gap-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-1 sm:min-w-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-4xl font-bold text-gray-900",
                        children: breakdown.average.toFixed(1)
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        rating: breakdown.average,
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500",
                        children: [
                            breakdown.total,
                            " review",
                            breakdown.total === 1 ? "" : "s"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-1.5",
                children: breakdown.counts.map(({ rating, count })=>{
                    // Guard the divisor rather than the caller: a breakdown is only shown
                    // when total > 0, but a 0 here would render NaN% widths.
                    const percent = breakdown.total > 0 ? count / breakdown.total * 100 : 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 text-xs text-gray-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-3 tabular-nums",
                                children: rating
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                                lineNumber: 30,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 flex-1 overflow-hidden rounded-full bg-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full bg-accent",
                                    style: {
                                        width: `${percent}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                                    lineNumber: 32,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                                lineNumber: 31,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-6 text-right tabular-nums",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                                lineNumber: 37,
                                columnNumber: 15
                            }, this)
                        ]
                    }, rating, true, {
                        fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                        lineNumber: 29,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/RatingBreakdownBars.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = RatingBreakdownBars;
var _c;
__turbopack_context__.k.register(_c, "RatingBreakdownBars");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/RecordProductView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecordProductView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function RecordProductView({ productId }) {
    _s();
    // React runs effects twice in development StrictMode. The backend dedupes
    // this anyway, but there is no reason to send the second request.
    const sent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecordProductView.useEffect": ()=>{
            if (sent.current === productId) return;
            sent.current = productId;
            void fetch(`/api/products/${productId}/views`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // The marker the backend requires: it distinguishes a shopper opening
                // this page from a listing, a preview, or a prefetch.
                body: JSON.stringify({
                    source: "product_detail"
                }),
                keepalive: true
            }).catch({
                "RecordProductView.useEffect": ()=>{
                // A view that was not recorded is not worth telling anyone about.
                }
            }["RecordProductView.useEffect"]);
        }
    }["RecordProductView.useEffect"], [
        productId
    ]);
    return null;
}
_s(RecordProductView, "ENnErxRoy5fZD5C2FaMG0lCAlls=");
_c = RecordProductView;
var _c;
__turbopack_context__.k.register(_c, "RecordProductView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/ReviewForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RatingInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/RatingInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/review.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/reviewApi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ReviewForm({ productId, existing, onDone }) {
    _s();
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.rating ?? 0);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.title ?? "");
    const [comment, setComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existing?.comment ?? "");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [createReview, { isLoading: isCreating }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateReviewMutation"])();
    const [updateReview, { isLoading: isUpdating }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateMyReviewMutation"])();
    const isSaving = isCreating || isUpdating;
    const isEditing = Boolean(existing);
    const wasPublished = existing?.status === "APPROVED";
    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        if (rating < 1) {
            setMessage("Please choose a rating.");
            return;
        }
        const payload = {
            rating,
            title: title.trim() || undefined,
            comment: comment.trim() || undefined
        };
        try {
            if (existing) {
                await updateReview({
                    id: existing.id,
                    body: payload
                }).unwrap();
            } else {
                await createReview({
                    productId,
                    ...payload
                }).unwrap();
            }
            // Deliberately does not clear the fields — on the edit path they are the
            // current content, and on the create path the confirmation replaces them.
            setSubmitted(true);
            onDone?.();
        } catch (error) {
            // What the customer typed stays in state either way, so a failure never
            // costs them their words.
            const status = error?.status;
            const detail = error?.data?.message;
            if (status === 403) {
                setMessage("You can only review a product you have bought. Once an order containing it is complete, you'll be able to leave a review here.");
            } else if (status === 409) {
                setMessage("You have already reviewed this product.");
            } else {
                setMessage(detail ?? "Your review was not submitted. Please try again.");
            }
        }
    }
    if (submitted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800",
            children: isEditing ? "Your review was updated. It goes back to the team for approval before it appears publicly." : "Thanks — your review was received. It will appear once the team has approved it."
        }, void 0, false, {
            fileName: "[project]/src/components/product/ReviewForm.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-4 rounded-lg border border-gray-200 p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-gray-900",
                children: isEditing ? "Edit your review" : "Write a review"
            }, void 0, false, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            wasPublished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded bg-amber-50 p-3 text-xs text-amber-800",
                children: "Your review is currently published. Editing it sends it back for approval, so it will be hidden until the team reviews it again."
            }, void 0, false, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mb-1.5 block text-xs font-medium text-gray-700",
                        children: [
                            "Rating ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sale",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product/ReviewForm.tsx",
                                lineNumber: 116,
                                columnNumber: 18
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RatingInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: rating,
                        onChange: setRating,
                        disabled: isSaving
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "review-title",
                        className: "mb-1.5 block text-xs font-medium text-gray-700",
                        children: "Title"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "review-title",
                        value: title,
                        onChange: (e)=>setTitle(e.target.value),
                        maxLength: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TITLE_MAX"],
                        disabled: isSaving,
                        className: "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand",
                        placeholder: "Sum up your experience"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "review-comment",
                        className: "mb-1.5 block text-xs font-medium text-gray-700",
                        children: "Review"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        id: "review-comment",
                        value: comment,
                        onChange: (e)=>setComment(e.target.value),
                        maxLength: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMMENT_MAX"],
                        rows: 4,
                        disabled: isSaving,
                        className: "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand",
                        placeholder: "What did you think of it?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-right text-xs text-gray-400",
                        children: [
                            comment.length,
                            "/",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMMENT_MAX"]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded bg-red-50 p-3 text-xs text-red-700",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isSaving,
                className: "flex items-center justify-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60",
                children: [
                    isSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        size: 14,
                        className: "animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product/ReviewForm.tsx",
                        lineNumber: 164,
                        columnNumber: 22
                    }, this),
                    isEditing ? "Save changes" : "Submit review"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product/ReviewForm.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/ReviewForm.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(ReviewForm, "K8QJzRpMHcxtSJeJKlYYlRVVXqo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateReviewMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateMyReviewMutation"]
    ];
});
_c = ReviewForm;
var _c;
__turbopack_context__.k.register(_c, "ReviewForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/RichText.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RichText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize-html.ts [app-client] (ecmascript)");
;
;
;
function RichText({ html, className }) {
    const clean = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2d$html$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeHtml"])(html);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("text-sm leading-relaxed text-gray-600", "[&_p]:my-2", "[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-gray-900", "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900", "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900", "[&_strong]:font-semibold [&_strong]:text-gray-900", "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5", "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5", "[&_li]:my-1", "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500", "[&_a]:text-brand [&_a]:underline", "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse", "[&_th]:border [&_th]:border-gray-200 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left", "[&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1", className),
        // Safe only because of `sanitizeHtml` above — never bypass it.
        dangerouslySetInnerHTML: {
            __html: clean
        }
    }, void 0, false, {
        fileName: "[project]/src/components/product/RichText.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = RichText;
var _c;
__turbopack_context__.k.register(_c, "RichText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product/WishlistButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WishlistButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wishlistApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function WishlistButton({ productId, className, size = 18, withLabel = false, standalone = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Seeded into the store by the layout — the session cookie is httpOnly, so a
    // client component cannot read it directly.
    const isSignedIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsSignedIn"]);
    // Exactly one of these runs; the other is skipped, so a card never pays for
    // a per-product request and the detail page never pulls a whole list.
    const { data: list, isLoading: isListLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistQuery"])({
        page: 1,
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WISHLIST_PAGE_SIZE"]
    }, {
        skip: !isSignedIn || standalone
    });
    const { data: contains, isLoading: isContainsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistContainsQuery"])(productId, {
        skip: !isSignedIn || !standalone
    });
    const [addItem, { isLoading: isAdding }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddWishlistItemMutation"])();
    const [removeByProduct, { isLoading: isRemoving }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveWishlistItemByProductMutation"])();
    const isSaved = standalone ? Boolean(contains?.inWishlist) : Boolean(list?.items.some((item)=>item.productId === productId));
    const isBusy = isAdding || isRemoving || (standalone ? isContainsLoading : isListLoading);
    async function handleToggle() {
        if (!isSignedIn) {
            router.push("/account/login?redirect=" + encodeURIComponent(window.location.pathname));
            return;
        }
        try {
            if (isSaved) {
                await removeByProduct(productId).unwrap();
            } else {
                await addItem(productId).unwrap();
            }
        } catch  {
        // The tag invalidation refetches regardless, so the heart falls back to
        // whatever the server actually holds rather than claiming a state that
        // was never reached.
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: handleToggle,
        disabled: isBusy,
        "aria-pressed": isSaved,
        "aria-label": isSaved ? "Remove from wishlist" : "Save to wishlist",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex items-center gap-2 transition-colors disabled:opacity-60", className),
        children: [
            isBusy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                size: size,
                className: "animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/components/product/WishlistButton.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                size: size,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-colors", isSaved ? "fill-sale text-sale" : "text-current")
            }, void 0, false, {
                fileName: "[project]/src/components/product/WishlistButton.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this),
            withLabel && (isSaved ? "Saved" : "Wishlist")
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product/WishlistButton.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(WishlistButton, "Sf92sG0JSCi9c+Ay/8p/MwRy20M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistContainsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddWishlistItemMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveWishlistItemByProductMutation"]
    ];
});
_c = WishlistButton;
var _c;
__turbopack_context__.k.register(_c, "WishlistButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/SmoothScrollProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
].join(",");
function Modal({ isOpen, onClose, labelledById, closeLabel = "Close dialog", children }) {
    _s();
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Captured on open so focus can be handed back to whatever opened us.
    const previouslyFocused = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Modal.useCallback[handleKeyDown]": (event)=>{
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }
            if (event.key !== "Tab" || !panelRef.current) return;
            const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)).filter({
                "Modal.useCallback[handleKeyDown].focusable": (el)=>el.offsetParent !== null || el === document.activeElement
            }["Modal.useCallback[handleKeyDown].focusable"]);
            if (focusable.length === 0) {
                // Nothing to land on — keep focus in the dialog rather than letting it
                // escape to the page behind.
                event.preventDefault();
                panelRef.current.focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && (active === first || active === panelRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }["Modal.useCallback[handleKeyDown]"], [
        onClose
    ]);
    // Routed through the shared lock rather than setting `body.overflow` here:
    // that alone stops nothing once Lenis drives the scroll loop.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(isOpen);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen) return;
            previouslyFocused.current = document.activeElement;
            document.addEventListener("keydown", handleKeyDown);
            // Focus the panel itself; the first Tab then moves to the first control.
            panelRef.current?.focus();
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener("keydown", handleKeyDown);
                    previouslyFocused.current?.focus();
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        handleKeyDown
    ]);
    // Only ever open in response to a client interaction, so `document` exists
    // by the time this renders — no mount guard needed.
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Modal.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: panelRef,
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": labelledById,
                    tabIndex: -1,
                    className: "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl outline-none",
                    "data-lenis-prevent": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            "aria-label": closeLabel,
                            className: "absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Modal.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Modal.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/Modal.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Modal.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Modal.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this), document.body);
}
_s(Modal, "wjXfz98bTfb1599hkLRdjGkGjh8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"]
    ];
});
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/RatingInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RatingInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/review.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function RatingInput({ value, onChange, disabled }) {
    const options = Array.from({
        length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RATING_MAX"] - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RATING_MIN"] + 1
    }, (_, i)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RATING_MIN"] + i);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
        disabled: disabled,
        className: "flex items-center gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                className: "sr-only",
                children: [
                    "Rating out of ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RATING_MAX"]
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/RatingInput.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            options.map((rating)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("cursor-pointer p-0.5", disabled && "cursor-not-allowed"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "radio",
                            name: "rating",
                            value: rating,
                            checked: value === rating,
                            onChange: ()=>onChange(rating),
                            className: "sr-only"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/RatingInput.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                            size: 26,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-colors", rating <= value ? "fill-accent text-accent" : "fill-gray-200 text-gray-200")
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/RatingInput.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "sr-only",
                            children: [
                                rating,
                                " star",
                                rating === 1 ? "" : "s"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/RatingInput.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, rating, true, {
                    fileName: "[project]/src/components/ui/RatingInput.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/RatingInput.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = RatingInput;
var _c;
__turbopack_context__.k.register(_c, "RatingInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/StarRating.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StarRating
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
;
;
function StarRating({ rating = 0, size = 14 }) {
    return(/*
     * `role="img"` is what makes the label reachable. `aria-label` on a plain
     * `div` has no role to attach to, and screen readers are free to ignore it —
     * most do, which left the rating announced as five unlabelled graphics or as
     * nothing at all. The role also makes this a leaf, so the five `Star`s inside
     * are skipped rather than read out one by one.
     */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-0.5",
        role: "img",
        "aria-label": `Rated ${rating} out of 5`,
        children: Array.from({
            length: 5
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                size: size,
                className: i < Math.round(rating) ? "fill-accent text-accent" : "fill-gray-200 text-gray-200"
            }, i, false, {
                fileName: "[project]/src/components/ui/StarRating.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/StarRating.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this));
}
_c = StarRating;
var _c;
__turbopack_context__.k.register(_c, "StarRating");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/focus-ring.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Focus ring for interactive controls across the storefront.
 *
 * Lived in `ProductDetail` as a private constant, which held for exactly as
 * long as the detail page was the only screen that had been given one. The
 * catalog card composes the same controls a shopper reaches by keyboard, so the
 * choice is now one exported string or two copies of it drifting apart — and a
 * ring that differs between the grid and the page it links to is the same defect
 * this replaced, one level up.
 *
 * Drawn from the brand token, offset so it reads as a ring around the control
 * rather than a border on it, and `focus-visible` so a mouse click never paints
 * one. Anything it is applied to needs a `rounded-*` of its own, or the ring is
 * drawn square around a rounded control.
 */ __turbopack_context__.s([
    "FOCUS_RING",
    ()=>FOCUS_RING
]);
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/guest-checkout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearDirectOrderIntent",
    ()=>clearDirectOrderIntent,
    "clearGuestOrderContact",
    ()=>clearGuestOrderContact,
    "readDirectOrderIntent",
    ()=>readDirectOrderIntent,
    "readGuestOrderPhone",
    ()=>readGuestOrderPhone,
    "saveDirectOrderIntent",
    ()=>saveDirectOrderIntent,
    "saveGuestOrderContact",
    ()=>saveGuestOrderContact
]);
"use client";
/**
 * Short-lived handoffs for guest checkout, kept in `sessionStorage`.
 *
 * Two things need carrying between pages, and neither belongs in the URL:
 *
 *  - the phone a guest just ordered with, so the confirmation can look the
 *    order back up. The backend deliberately made tracking a POST to keep phone
 *    numbers out of URLs, logs and referrer headers; putting one in a query
 *    string here would undo that.
 *  - a "buy this one product" intent from a product page, so checkout can order
 *    it directly without it ever entering the cart.
 *
 * `sessionStorage` over a cookie: the same information, but scoped to the tab
 * that needs it and gone when the tab closes, rather than riding along on every
 * subsequent request. It survives a reload, which is the property the
 * confirmation depends on.
 *
 * Every read is defensive — storage can be unavailable (private browsing,
 * blocked cookies) or hold something another version wrote. A bad value means
 * "no handoff", never a thrown error on a page that would otherwise render.
 */ const GUEST_ORDER_KEY = "guestOrderContact";
const DIRECT_ORDER_KEY = "directOrderIntent";
function readJson(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch  {
        return null;
    }
}
function writeJson(key, value) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch  {
    // Storage full or unavailable. The order still went through; the shopper
    // falls back to the tracking form, so this must never throw.
    }
}
function remove(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.sessionStorage.removeItem(key);
    } catch  {
    // Nothing to do — see writeJson.
    }
}
function saveGuestOrderContact(contact) {
    writeJson(GUEST_ORDER_KEY, contact);
}
function readGuestOrderPhone(orderNumber) {
    const stored = readJson(GUEST_ORDER_KEY);
    if (!stored || typeof stored.phone !== "string") return null;
    return stored.orderNumber === orderNumber ? stored.phone : null;
}
function clearGuestOrderContact() {
    remove(GUEST_ORDER_KEY);
}
function saveDirectOrderIntent(intent) {
    writeJson(DIRECT_ORDER_KEY, intent);
}
function readDirectOrderIntent() {
    const stored = readJson(DIRECT_ORDER_KEY);
    const item = stored?.item;
    // Guard the shape rather than trusting it: a malformed intent would otherwise
    // reach the API as an unorderable line and fail the whole checkout.
    if (!item || typeof item.productId !== "string" || typeof item.quantity !== "number" || item.quantity < 1) {
        return null;
    }
    return {
        item,
        display: {
            name: stored?.display?.name ?? "Selected item",
            image: stored?.display?.image ?? "",
            unitPrice: Number(stored?.display?.unitPrice) || 0,
            variantName: stored?.display?.variantName
        }
    };
}
function clearDirectOrderIntent() {
    remove(DIRECT_ORDER_KEY);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/product-options.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYNTHETIC_OPTION_ID",
    ()=>SYNTHETIC_OPTION_ID,
    "choicesForVariant",
    ()=>choicesForVariant,
    "defaultVariant",
    ()=>defaultVariant,
    "presentedOptions",
    ()=>presentedOptions,
    "resolveOptions",
    ()=>resolveOptions,
    "resolveVariant",
    ()=>resolveVariant
]);
function presentedOptions(product) {
    if (product.options.length > 0) return product.options;
    if (product.variants.length === 0) return [];
    return [
        {
            id: SYNTHETIC_OPTION_ID,
            name: "Option",
            presentation: "LABEL",
            values: product.variants.map((variant)=>({
                    id: variant.id,
                    label: variant.name
                }))
        }
    ];
}
const SYNTHETIC_OPTION_ID = "__synthetic__";
function resolveVariant(product, choices) {
    const options = presentedOptions(product);
    if (options.length === 0) return null;
    const chosen = options.map((option)=>choices[option.id]);
    if (chosen.some((valueId)=>!valueId)) return null;
    if (options[0]?.id === SYNTHETIC_OPTION_ID) {
        return product.variants.find((v)=>v.id === chosen[0]) ?? null;
    }
    return product.variants.find((variant)=>{
        if (variant.optionValueIds.length !== chosen.length) return false;
        return chosen.every((valueId)=>variant.optionValueIds.includes(valueId));
    }) ?? null;
}
function resolveOptions(product, choices) {
    const options = presentedOptions(product);
    const isSynthetic = options[0]?.id === SYNTHETIC_OPTION_ID;
    const resolved = options.map((option)=>{
        const chosenValueId = choices[option.id];
        return {
            id: option.id,
            name: option.name,
            presentation: option.presentation,
            isUnanswered: !chosenValueId,
            values: option.values.map((value)=>({
                    id: value.id,
                    label: value.label,
                    swatch: value.swatch,
                    isSelected: chosenValueId === value.id,
                    isAvailable: isSynthetic ? product.variants.find((v)=>v.id === value.id)?.inStock ?? false : isValueObtainable(product, options, choices, option.id, value.id)
                }))
        };
    });
    const unanswered = resolved.filter((option)=>option.isUnanswered);
    return {
        options: resolved,
        variant: resolveVariant(product, choices),
        unansweredNames: unanswered.map((option)=>option.name),
        isComplete: options.length > 0 && unanswered.length === 0
    };
}
/**
 * Whether an in-stock variant exists that provides `valueId` while honouring
 * the shopper's choices on the *other* options.
 *
 * The option being tested is excluded from the constraint on purpose: asking
 * "is Red available given that Red is selected" answers nothing. Options the
 * shopper has not answered yet are unconstrained, so before any choice a value
 * is available if any in-stock variant carries it at all.
 */ function isValueObtainable(product, options, choices, optionId, valueId) {
    const otherChoices = options.filter((option)=>option.id !== optionId).map((option)=>choices[option.id]).filter((chosen)=>Boolean(chosen));
    return product.variants.some((variant)=>variant.inStock && variant.optionValueIds.includes(valueId) && otherChoices.every((chosen)=>variant.optionValueIds.includes(chosen)));
}
function choicesForVariant(product, variant) {
    if (!variant) return {};
    const options = presentedOptions(product);
    if (options[0]?.id === SYNTHETIC_OPTION_ID) {
        return {
            [SYNTHETIC_OPTION_ID]: variant.id
        };
    }
    const choices = {};
    for (const option of options){
        const match = option.values.find((value)=>variant.optionValueIds.includes(value.id));
        if (match) choices[option.id] = match.id;
    }
    return choices;
}
function defaultVariant(product) {
    return product.variants.find((v)=>v.inStock) ?? product.variants[0] ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/sanitize-html.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isBlankHtml",
    ()=>isBlankHtml,
    "sanitizeHtml",
    ()=>sanitizeHtml
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sanitize$2d$html$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sanitize-html/index.js [app-client] (ecmascript)");
;
/**
 * The allowlist merchant-authored HTML is filtered through before it reaches a
 * shopper's browser.
 *
 * Sanitising here rather than on save is deliberate. Cleaning only on the way
 * in would leave everything already stored — and anything written by any other
 * path: a script, a database fix, a future endpoint — trusted forever. The
 * storefront is where the markup becomes a page, so this is where the guarantee
 * has to hold. See design.md, "Rich text is sanitised on the way out, not only
 * on the way in".
 *
 * Kept apart from the component that renders it so it can be tested directly.
 *
 * ## Why `sanitize-html` and not `isomorphic-dompurify`
 *
 * This used DOMPurify, which needs a DOM — on the server that meant jsdom, and
 * jsdom is what made the storefront undeployable. jsdom@30 requires
 * `html-encoding-sniffer@6`, a CommonJS package that `require()`s
 * `@exodus/bytes`, which is pure ESM. Node 22 tolerates `require(esm)`; Node 24
 * refuses it with ERR_REQUIRE_ESM. So every route 500'd on any host running
 * Node 24 while working perfectly on a Node 22 laptop — and because the throw
 * happens at MODULE EVALUATION, not at call time, the `try/catch` in
 * `services/store-settings.ts` could not degrade it. The whole site was down,
 * not one component.
 *
 * `sanitize-html` parses with htmlparser2 and never touches a DOM, so there is
 * no jsdom, no ESM/CJS conflict, and no Node-version constraint. Do not
 * reintroduce a DOM-based sanitiser to "modernise" this — the runtime
 * independence is the point.
 *
 * Both files that pin this module's behaviour (`sanitize-html.test.ts` and
 * `page-content.test.ts`) pass unchanged against this implementation; the
 * allowlists and URI rule below are carried over verbatim.
 */ /**
 * What merchant-authored content legitimately needs: structure, emphasis,
 * lists, tables, links — and, since content pages were added, images. An About
 * page reasonably contains one; a product description never did, which is why
 * `img` arrived only with the page editor that can insert it.
 *
 * The editor and this list are two halves of one switch: a tag the admin's
 * editor can emit but this strips disappears silently on the storefront.
 * `page-form-page.tsx` opts into images and nothing else, and a test pins the
 * pair together. The editor is Quill (`admin/src/components/forms/
 * rich-text-editor.tsx`) — its toolbar is deliberately narrower than Quill's
 * default set for exactly this reason, and `buildToolbar` there says which
 * controls were left out and why.
 */ const ALLOWED_TAGS = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "del",
    "mark",
    "code",
    "pre",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div"
];
/**
 * No `style`, no `class`, no `id`, and no `on*`.
 *
 * A class could pull in the storefront's own utility styles to cover the page
 * with an overlay, and an inline style can do it without help — neither is
 * something a product description needs.
 */ const ALLOWED_ATTR = [
    "href",
    "title",
    "colspan",
    "rowspan",
    // For `img`. `src` is constrained by SAFE_URI below exactly like `href` is,
    // which is what keeps a `data:` payload out of an image tag.
    "src",
    "alt",
    "width",
    "height"
];
/*
 * `target` and `rel` are deliberately absent, and their absence is asserted by
 * "drops target and rel from anchors, so links stay same-tab" in
 * page-content.test.ts.
 *
 * They were on this list under DOMPurify, which removed both anyway regardless
 * of the allow-list — the test documents that as the storefront's real
 * behaviour rather than a slip. `sanitize-html` honours the list literally, so
 * leaving them here would have CHANGED behaviour: links would start opening in
 * new tabs. Listing them would be the bug; omitting them preserves what shipped.
 *
 * A same-tab link cannot be a reverse-tabnabbing vector, so nothing is lost.
 */ /** The only URI shapes any attribute here may carry. */ const SAFE_URI = /^(?:https?:|mailto:|tel:|#|\/)/i;
function sanitizeHtml(html) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sanitize$2d$html$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(html, {
        allowedTags: ALLOWED_TAGS,
        // One list for every tag, matching DOMPurify's flat `ALLOWED_ATTR`. A
        // per-tag map would be tighter, but it would also be a second, divergent
        // statement of the same rule — and the tests pin the flat behaviour.
        allowedAttributes: {
            "*": ALLOWED_ATTR
        },
        /*
     * The scheme allow-list, and then SAFE_URI again in `transformTags` below.
     * Both are needed, and the duplication is deliberate:
     *
     * `allowedSchemes` rejects `javascript:` and `data:`, but it says nothing
     * about protocol-relative (`//evil.example`) or other shapes, and it is
     * expressed as a list of schemes rather than as the one regexp the rest of
     * this file is written against. SAFE_URI is the actual rule — it also
     * admits `#`, `/` and `tel:`, and admits nothing else.
     *
     * Keeping both means a future edit to either one cannot silently widen what
     * a link may point at.
     */ allowedSchemes: [
            "http",
            "https",
            "mailto",
            "tel"
        ],
        allowedSchemesAppliedToAttributes: [
            "href",
            "src"
        ],
        allowProtocolRelative: false,
        /*
     * A rejected tag's TEXT still reads — this is `KEEP_CONTENT: true` under
     * the old implementation. Dropping the element whole would silently lose
     * wording the merchant wrote.
     *
     * `nonTextTags` is the exception, and the reason it is listed explicitly:
     * for these, the "text" is a program, not prose. Without it `<script>` is
     * discarded but `alert("xss")` survives as a text node, which is inert but
     * renders as visible gibberish — and `isBlankHtml` would then report a
     * script-only document as non-blank. `script` and `style` alone would cover
     * the tests; `textarea`, `option` and `noscript` are included because they
     * are the same category of "contents are not prose" and `sanitize-html`
     * defaults to exactly this set.
     */ disallowedTagsMode: "discard",
        nonTextTags: [
            "script",
            "style",
            "textarea",
            "option",
            "noscript"
        ],
        /*
     * Re-checks every `href` and `src` against SAFE_URI, dropping the attribute
     * rather than the element.
     *
     * This is what the old `afterSanitizeAttributes` DOMPurify hook did, and it
     * exists for the same reason: `img` was added to the allow-list for content
     * pages, and an image source is the one place a `data:` payload can still
     * reach a browser. `data:image/svg+xml` is a documented content-injection
     * vector, and this storefront never needs an inline image.
     *
     * Dropping the ATTRIBUTE and keeping the element matches the old behaviour
     * exactly — `<a href="javascript:…">Click</a>` keeps the word "Click", which
     * is merchant-authored copy and should not vanish because the link was bad.
     */ transformTags: {
            "*": (tagName, attribs)=>{
                const safe = {};
                for (const [name, value] of Object.entries(attribs)){
                    if ((name === "href" || name === "src") && !SAFE_URI.test(value)) {
                        continue;
                    }
                    safe[name] = value;
                }
                return {
                    tagName,
                    attribs: safe
                };
            }
        }
    });
}
function isBlankHtml(html) {
    if (!html) return true;
    return sanitizeHtml(html).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/variant-gallery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firstImageForVariant",
    ()=>firstImageForVariant,
    "variantIdForImage",
    ()=>variantIdForImage
]);
function firstImageForVariant(images, variantId) {
    if (variantId === null) return undefined;
    return images.find((image)=>image.variantId === variantId);
}
function variantIdForImage(image) {
    return image?.variantId ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/review.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REVIEWS_CACHE_TAG",
    ()=>REVIEWS_CACHE_TAG,
    "REVIEWS_PAGE_SIZE",
    ()=>REVIEWS_PAGE_SIZE,
    "getProductReviews",
    ()=>getProductReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/review.ts [app-client] (ecmascript)");
;
;
/**
 * Public review reads.
 *
 * These go straight to the backend rather than through an `/api/*` proxy: the
 * published review list is public and cookie-free, so the proxy hop only the
 * authenticated routes need would buy nothing (same reasoning as productApi).
 *
 * Only *writes* and the customer's own review list are proxied — see
 * `src/app/api/reviews/`.
 */ /** Reviews move more often than the catalog but not per-request. */ const REVIEW_REVALIDATE_SECONDS = 30;
const REVIEWS_CACHE_TAG = "reviews";
const REVIEWS_PAGE_SIZE = 5;
const EMPTY_META = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 0
};
async function getProductReviews(productId, { page = 1, limit = REVIEWS_PAGE_SIZE } = {}) {
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${productId}/reviews?page=${page}&limit=${limit}`, {
            revalidate: REVIEW_REVALIDATE_SECONDS,
            tags: [
                REVIEWS_CACHE_TAG
            ]
        });
        const data = Array.isArray(response.data) ? response.data : [];
        const meta = response.meta;
        return {
            reviews: data.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toReview"]),
            breakdown: meta?.ratingBreakdown ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toRatingBreakdown"])(meta.ratingBreakdown) : null,
            meta: meta ?? {
                ...EMPTY_META,
                total: data.length
            },
            failed: false
        };
    } catch  {
        return {
            reviews: [],
            breakdown: null,
            meta: EMPTY_META,
            failed: true
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0a9b4f3._.js.map