(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/cart/CartLineControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartQuantityControl",
    ()=>CartQuantityControl,
    "CartRemoveButton",
    ()=>CartRemoveButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
/** How long to wait for more clicks before sending the settled quantity. */ const DEBOUNCE_MS = 400;
function CartQuantityControl({ line, size = "sm" }) {
    _s();
    const [updateQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateItemQuantityMutation"])();
    const [removeItem, { isLoading: isRemoving }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveItemMutation"])();
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(line.quantity);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // The last quantity the server confirmed — what a rejected change reverts to.
    const confirmed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(line.quantity);
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Track the server's value when it changes underneath us (another tab, a
    // reseed after some other mutation), but never stomp on a pending edit.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartQuantityControl.useEffect": ()=>{
            confirmed.current = line.quantity;
            if (timer.current === null) {
                setQuantity(line.quantity);
            }
        }
    }["CartQuantityControl.useEffect"], [
        line.quantity
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartQuantityControl.useEffect": ()=>({
                "CartQuantityControl.useEffect": ()=>{
                    if (timer.current) clearTimeout(timer.current);
                }
            })["CartQuantityControl.useEffect"]
    }["CartQuantityControl.useEffect"], []);
    const iconSize = size === "md" ? 14 : 14;
    const padding = size === "md" ? "p-2" : "p-1.5";
    /** Restarts the debounce so a burst of clicks results in one request. */ function scheduleUpdate(next) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(()=>{
            timer.current = null;
            updateQuantity({
                itemId: line.id,
                quantity: next
            }).unwrap().then(()=>{
                confirmed.current = next;
            }).catch((err)=>{
                setQuantity(confirmed.current);
                const data = err?.data;
                setError(typeof data?.message === "string" ? data.message : "Couldn't update the quantity.");
            });
        }, DEBOUNCE_MS);
    }
    function step(delta) {
        setError("");
        const next = quantity + delta;
        // The API rejects a quantity below 1, so stepping down from 1 removes the
        // line instead — matching what the shopper expects the minus button to do.
        if (next < 1) {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            void removeItem(line.id);
            return;
        }
        setQuantity(next);
        scheduleUpdate(next);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-fit items-center gap-2 rounded border border-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${padding} disabled:opacity-40`,
                        onClick: ()=>step(-1),
                        disabled: isRemoving,
                        "aria-label": "Decrease quantity",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            size: iconSize
                        }, void 0, false, {
                            fileName: "[project]/src/components/cart/CartLineControls.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartLineControls.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-6 text-center text-sm",
                        children: quantity
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartLineControls.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${padding} disabled:opacity-40`,
                        onClick: ()=>step(1),
                        disabled: isRemoving,
                        "aria-label": "Increase quantity",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: iconSize
                        }, void 0, false, {
                            fileName: "[project]/src/components/cart/CartLineControls.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartLineControls.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/cart/CartLineControls.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "mt-1 text-xs text-sale",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/cart/CartLineControls.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/cart/CartLineControls.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(CartQuantityControl, "PwkmYPZKGtgO0TqOhxMDYCG5azk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateItemQuantityMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveItemMutation"]
    ];
});
_c = CartQuantityControl;
function CartRemoveButton({ line, className, withLabel = false }) {
    _s1();
    const [removeItem, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveItemMutation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>void removeItem(line.id),
        disabled: isLoading,
        className: `text-gray-400 hover:text-sale disabled:opacity-40 ${className ?? ""}`,
        "aria-label": "Remove item",
        children: withLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 text-xs",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/components/cart/CartLineControls.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this),
                " Remove"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/cart/CartLineControls.tsx",
            lineNumber: 147,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/src/components/cart/CartLineControls.tsx",
            lineNumber: 151,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/cart/CartLineControls.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s1(CartRemoveButton, "CDEaX+ArAKs6z5e/Nxz3U2bq3Ww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveItemMutation"]
    ];
});
_c1 = CartRemoveButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "CartQuantityControl");
__turbopack_context__.k.register(_c1, "CartRemoveButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/FacebookPixel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FacebookPixel,
    "trackLandingPagePurchase",
    ()=>trackLandingPagePurchase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
"use client";
;
;
function FacebookPixel({ pixelId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "fb-pixel",
                strategy: "afterInteractive",
                children: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');`
            }, void 0, false, {
                fileName: "[project]/src/components/landing/FacebookPixel.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    height: "1",
                    width: "1",
                    style: {
                        display: "none"
                    },
                    alt: "",
                    src: `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/FacebookPixel.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/FacebookPixel.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/FacebookPixel.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = FacebookPixel;
function trackLandingPagePurchase(pixelId, value, currency, eventId) {
    if (!pixelId) return;
    const fbq = window.fbq;
    if (typeof fbq !== "function") return;
    try {
        fbq("track", "Purchase", {
            value,
            currency
        }, // fbq reads the dedup key from a fourth argument, not from the event data.
        eventId ? {
            eventID: eventId
        } : undefined);
    } catch  {
    // Measurement is never worth breaking the confirmation over.
    }
}
var _c;
__turbopack_context__.k.register(_c, "FacebookPixel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/CartDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CartDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2f$CartLineControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cart/CartLineControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/SmoothScrollProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
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
;
;
;
;
;
/**
 * Longest the exit animation is allowed to take before the drawer is torn down
 * regardless. `transitionend` normally ends the exit, but it never fires if the
 * panel is hidden mid-transition (a route change unmounting an ancestor, a
 * background tab throttling frames) — without this the drawer would be stranded
 * on screen, covering the page with no way to dismiss it.
 */ const EXIT_FALLBACK_MS = 500;
/** Focusable descendants, in DOM order, for the tab cycle. */ const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function CartDrawer() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const isOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCartOpen"]);
    /*
   * Visibility is a three-phase machine rather than a mirror of `isOpen`,
   * because the drawer has to outlive its own close: rendering `null` the frame
   * `isOpen` goes false (as this component used to) leaves no element to
   * animate out.
   *
   * closed  -> nothing rendered, nothing focusable, nothing to click
   * open    -> rendered at rest
   * closing -> rendered in the exit position, torn down when the motion ends
   */ const [exiting, setExiting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Drives the enter transition. Kept separate from `phase` because the panel
    // must first paint off-screen and only then move to its resting position —
    // mounting it already at rest gives React nothing to transition between.
    const [entered, setEntered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // The element focus returns to on close — captured at open time, since the
    // cart is opened from several places (header button, mobile bottom nav).
    const openerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /*
   * Derived, not stored: `isOpen` alone decides "open", so the only thing that
   * needs remembering is whether a drawer that has left `isOpen` is still
   * animating out (`exiting`). Reopening mid-close therefore needs no special
   * case — `isOpen` flips back to true and this reads "open" again, with
   * `entered` still true so the panel travels back from wherever it had reached.
   */ const phase = isOpen ? "open" : exiting ? "closing" : "closed";
    // `skip` keeps a fully closed drawer from holding a subscription; the header's
    // own query still keeps the cart cached, so opening is instant. Kept alive
    // through `closing` so the contents don't blank out mid-animation.
    const { data: cart = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_CART"], isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"])(undefined, {
        skip: phase === "closed"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (!isOpen) return;
            openerRef.current ??= document.activeElement;
        }
    }["CartDrawer.useEffect"], [
        isOpen
    ]);
    // Flip to the resting position one frame after mount, so the browser has a
    // painted starting position to transition from.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (phase !== "open") return;
            const frame = requestAnimationFrame({
                "CartDrawer.useEffect.frame": ()=>setEntered(true)
            }["CartDrawer.useEffect.frame"]);
            return ({
                "CartDrawer.useEffect": ()=>cancelAnimationFrame(frame)
            })["CartDrawer.useEffect"];
        }
    }["CartDrawer.useEffect"], [
        phase
    ]);
    // Leaving "open" starts the exit: mark it pending, and send the panel back
    // off-screen so there is a transition for `transitionend` to report.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (isOpen) {
                // Opening cancels any exit still pending from a previous close.
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setExiting(false);
                return;
            }
            // Only a drawer already on screen has anything to animate out; `entered`
            // is false on a drawer that was never opened.
            setExiting(entered);
            setEntered(false);
        // `entered` is read as the current on-screen state, not tracked — adding it
        // to the deps would re-run this on the enter transition and cancel the exit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CartDrawer.useEffect"], [
        isOpen
    ]);
    // Backstop for a `transitionend` that never arrives — see EXIT_FALLBACK_MS.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (phase !== "closing") return;
            const timer = window.setTimeout({
                "CartDrawer.useEffect.timer": ()=>setExiting(false)
            }["CartDrawer.useEffect.timer"], EXIT_FALLBACK_MS);
            return ({
                "CartDrawer.useEffect": ()=>window.clearTimeout(timer)
            })["CartDrawer.useEffect"];
        }
    }["CartDrawer.useEffect"], [
        phase
    ]);
    // Restore focus once the drawer is fully gone. Deferred to "closed" so focus
    // doesn't jump away while the panel is still visibly on screen.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (phase !== "closed") return;
            openerRef.current?.focus?.();
            openerRef.current = null;
        }
    }["CartDrawer.useEffect"], [
        phase
    ]);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartDrawer.useCallback[close]": ()=>{
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeCart"])());
        }
    }["CartDrawer.useCallback[close]"], [
        dispatch
    ]);
    const isVisible = phase !== "closed";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(isVisible);
    // Move focus into the panel on open, and keep Tab cycling inside it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            if (phase !== "open") return;
            const panel = panelRef.current;
            if (!panel) return;
            panel.querySelector(FOCUSABLE)?.focus();
            function onKeyDown(event) {
                if (event.key === "Escape") {
                    close();
                    return;
                }
                if (event.key !== "Tab" || !panel) return;
                const targets = Array.from(panel.querySelectorAll(FOCUSABLE));
                if (targets.length === 0) return;
                const first = targets[0];
                const last = targets[targets.length - 1];
                const active = document.activeElement;
                // Wrap at both ends, and pull focus back in if it has escaped the panel
                // entirely (which is what would otherwise let Tab reach the page behind).
                if (event.shiftKey && (active === first || !panel.contains(active))) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
                    event.preventDefault();
                    first.focus();
                }
            }
            document.addEventListener("keydown", onKeyDown);
            return ({
                "CartDrawer.useEffect": ()=>document.removeEventListener("keydown", onKeyDown)
            })["CartDrawer.useEffect"];
        }
    }["CartDrawer.useEffect"], [
        phase,
        close
    ]);
    // Nothing rendered while closed: no pointer target, no tab stop, nothing
    // exposed to assistive technology — the inert-when-closed requirement, for free.
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Your cart",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none", entered ? "opacity-100" : "opacity-0"),
                onClick: close
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: panelRef,
                // The exit ends when the panel's own transform finishes. Guarded on
                // `propertyName` so a child's transition (a hover on a button inside)
                // can't bubble up and tear the drawer down early.
                onTransitionEnd: (event)=>{
                    if (event.target === event.currentTarget && event.propertyName === "transform") {
                        setExiting(false);
                    }
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl", "transition-transform duration-300 ease-out motion-reduce:transition-none", entered ? "translate-x-0" : "translate-x-full"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between border-b px-5 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold uppercase",
                                children: "Your Cart"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: close,
                                "aria-label": "Close cart",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    isError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500",
                            children: "We couldn't load your cart. Please try again."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/CartDrawer.tsx",
                            lineNumber: 203,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this) : cart.lines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500",
                                children: "Your cart is empty."
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: close,
                                className: "rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white",
                                children: "Continue shopping"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto overscroll-contain px-5",
                                "data-lenis-prevent": true,
                                children: cart.lines.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3 border-b py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: line.image,
                                                    alt: line.name,
                                                    fill: true,
                                                    className: "object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 227,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-1 flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/products/${line.slug}`,
                                                        onClick: close,
                                                        className: "text-sm font-medium hover:text-brand",
                                                        children: line.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 21
                                                    }, this),
                                                    line.variantName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-0.5 text-xs text-gray-500",
                                                        children: line.variantName
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-0.5 text-xs text-gray-500",
                                                        children: [
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(line.unitPrice),
                                                            line.compareAtPrice !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-1 text-gray-400 line-through",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(line.compareAtPrice)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 25
                                                            }, this),
                                                            " ",
                                                            "each"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2f$CartLineControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartQuantityControl"], {
                                                                line: line
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2f$CartLineControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartRemoveButton"], {
                                                                line: line
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "whitespace-nowrap text-sm font-semibold text-sale",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(line.lineTotal)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, line.id, true, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t px-5 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-1 flex items-center justify-between text-sm text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Subtotal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 265,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(cart.subtotal)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    cart.discountAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-1 flex items-center justify-between text-sm text-green-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Discount",
                                                    cart.discountCode ? ` (${cart.discountCode})` : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "-",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(cart.discountAmount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center justify-between text-base font-semibold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sale",
                                                children: [
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(cart.total),
                                                    " BDT"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-4 text-xs text-gray-500",
                                        children: "Taxes and shipping calculated at checkout"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/cart",
                                                onClick: close,
                                                className: "rounded border border-brand py-3 text-center text-sm font-semibold text-brand hover:bg-gray-50",
                                                children: "View Cart"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/checkout",
                                                onClick: close,
                                                className: "rounded bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark",
                                                children: "Check Out"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                                lineNumber: 289,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/CartDrawer.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/CartDrawer.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/CartDrawer.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_s(CartDrawer, "33kmtaubq5JswrIe9h0yYwOV7dU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"]
    ];
});
_c = CartDrawer;
var _c;
__turbopack_context__.k.register(_c, "CartDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/CartRail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CartRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/SmoothScrollProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
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
;
;
/**
 * How far down the page the back-to-top button appears. Roughly one viewport,
 * so it shows up only once "back to top" is a journey worth shortcutting.
 */ const SHOW_TOP_BUTTON_AFTER_PX = 600;
/**
 * Geometry for the progress ring drawn around the back-to-top button.
 *
 * The ring is stroked on a circle inset by half the stroke width, so the stroke
 * sits fully inside the 40px (`size-10`) button box rather than being clipped in
 * half at the edge.
 */ const RING_SIZE = 40;
const RING_STROKE = 2;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
function CartRail() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const isCartOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCartOpen"]);
    const { lenis } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmoothScroll"])();
    // Shares the cache the header's query already fills, so this adds a
    // subscription rather than a request.
    const { data: cart = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_CART"] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"])();
    const [showTopButton, setShowTopButton] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /**
   * How far through the page we are, 0–1. The storefront hides its scrollbar, so
   * this ring is the only cue for depth — without it there is nothing on screen
   * saying how much page is left.
   */ const [scrollProgress, setScrollProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartRail.useEffect": ()=>{
            const update = {
                "CartRail.useEffect.update": ()=>{
                    setShowTopButton(window.scrollY > SHOW_TOP_BUTTON_AFTER_PX);
                    // Total scrollable distance, not document height — the last viewport of
                    // content is visible without scrolling, so it is not part of the journey.
                    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                    // A page shorter than the viewport has nothing to divide by. Guarding here
                    // keeps the ring at 0 instead of NaN, which would drop the dash offset
                    // attribute entirely and paint a full ring.
                    setScrollProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
                }
            }["CartRail.useEffect.update"];
            update();
            // Listens on `scroll` rather than Lenis's own event so the button still
            // works on the reduced-motion path, where there is no Lenis instance.
            // Lenis drives the real window scroll, so this fires either way.
            window.addEventListener("scroll", update, {
                passive: true
            });
            return ({
                "CartRail.useEffect": ()=>window.removeEventListener("scroll", update)
            })["CartRail.useEffect"];
        }
    }["CartRail.useEffect"], []);
    const scrollToTop = ()=>{
        // Prefer Lenis so the ride up matches the page's own easing; fall back to
        // the native smooth scroll when Lenis is off for reduced motion.
        if (lenis) {
            lenis.scrollTo(0);
            return;
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    // Both float on the right edge but anchor to different places, so they are
    // separate fixed elements rather than one stacked rail.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 md:block", "transition-opacity duration-200", // Yielding to the drawer keeps the rail from sitting on top of the very
                // panel it opens.
                isCartOpen && "pointer-events-none opacity-0"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])()),
                    className: "flex w-20 flex-col overflow-hidden rounded-l-md shadow-lg",
                    "aria-label": `Open cart, ${cart.itemCount} items`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex flex-col items-center gap-1 bg-brand px-2 py-2.5 text-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/CartRail.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px] font-semibold leading-none",
                                    children: [
                                        cart.itemCount,
                                        " Items"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/CartRail.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/CartRail.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-white px-2 py-1.5 text-[11px] font-semibold text-gray-800",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(cart.subtotal)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/CartRail.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/CartRail.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CartRail.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: scrollToTop,
                "aria-label": "Back to top",
                tabIndex: showTopButton ? 0 : -1,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("fixed bottom-6 right-4 z-30 hidden size-10 items-center justify-center rounded-full md:flex", "bg-brand text-white shadow-lg", "transition-all duration-200 hover:bg-brand-dark motion-reduce:transition-none", showTopButton ? "visible opacity-100" : "invisible opacity-0"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        "aria-hidden": "true",
                        viewBox: `0 0 ${RING_SIZE} ${RING_SIZE}`,
                        className: "pointer-events-none absolute inset-0 size-full -rotate-90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: RING_SIZE / 2,
                                cy: RING_SIZE / 2,
                                r: RING_RADIUS,
                                fill: "none",
                                stroke: "currentColor",
                                strokeOpacity: 0.25,
                                strokeWidth: RING_STROKE
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartRail.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: RING_SIZE / 2,
                                cy: RING_SIZE / 2,
                                r: RING_RADIUS,
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: RING_STROKE,
                                strokeLinecap: "round",
                                strokeDasharray: RING_CIRCUMFERENCE,
                                strokeDashoffset: RING_CIRCUMFERENCE * (1 - scrollProgress)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/CartRail.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/CartRail.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        size: 20,
                        className: "relative"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/CartRail.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/CartRail.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/CartRail.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(CartRail, "V29mXYxlgmcQGpIyF4aSEk6cS0g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmoothScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"]
    ];
});
_c = CartRail;
var _c;
__turbopack_context__.k.register(_c, "CartRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/CompareBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompareBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.mjs [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compare-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog-features.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function CompareBar() {
    _s();
    const slugs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCompareSlugs"]);
    const isHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCompareHydrated"]);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const { showCompare } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCatalogFeatures"])();
    /*
   * The stored list is left alone when the feature is withdrawn — it is the
   * shopper's, it costs nothing sitting in `localStorage`, and clearing it would
   * make a presentation toggle quietly destructive. It simply goes unread until
   * the merchant offers comparison again.
   */ if (!showCompare || !isHydrated || slugs.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur md:bottom-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 pb-20 md:pb-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center gap-2 text-sm font-semibold text-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/CompareBar.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        "Compare",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: [
                                slugs.length,
                                "/",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPARE_LIMIT"]
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/CompareBar.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/CompareBar.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "flex flex-1 flex-wrap items-center gap-2",
                    children: slugs.map((slug)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompareChip, {
                            slug: slug
                        }, slug, false, {
                            fileName: "[project]/src/components/layout/CompareBar.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/CompareBar.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearCompare"])()),
                            className: "text-sm text-gray-500 transition-colors hover:text-sale",
                            children: "Clear all"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/CompareBar.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/compare",
                            className: "rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark",
                            children: "Compare"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/CompareBar.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/CompareBar.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/CompareBar.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/CompareBar.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(CompareBar, "McjGcO9OawHo75NZs9CGg0pEHf0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"]
    ];
});
_c = CompareBar;
/**
 * One chip per compared product.
 *
 * Names the product rather than showing a bare slug, which means a lookup per
 * chip. The query is the same one the comparison page uses, so RTK Query serves
 * both from one cache entry per product. While it loads — or if the product has
 * since been deleted or renamed — the chip stays removable, so a dead entry can
 * never strand the shopper.
 */ function CompareChip({ slug }) {
    _s1();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const { data: product, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductBySlugQuery"])(slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1 text-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "max-w-48 truncate text-gray-700",
                children: product?.name ?? (isError ? "Unavailable" : "Loading…")
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CompareBar.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromCompare"])(slug)),
                "aria-label": `Remove ${product?.name ?? "product"} from comparison`,
                className: "rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-sale",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 12
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/CompareBar.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CompareBar.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/CompareBar.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s1(CompareChip, "F/Nr349pl5ntOQLgfXLUAYKhAeo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProductBySlugQuery"]
    ];
});
_c1 = CompareChip;
var _c, _c1;
__turbopack_context__.k.register(_c, "CompareBar");
__turbopack_context__.k.register(_c1, "CompareChip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@iconify/react/dist/iconify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.mjs [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MobileMenuDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/MobileMenuDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/SearchBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$store$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/store-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wishlistApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog-features.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brand$2d$slot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brand-slot.ts [app-client] (ecmascript)");
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
/**
 * Focus treatment for controls sitting on the brand bar.
 *
 * The browser's own focus ring is blue, which is the one colour that vanishes
 * against `bg-brand` — so the accent carries it, offset against the bar behind
 * it. Every interactive element in the header uses one of these two, because a
 * keyboard shopper who loses the ring on a single control has lost the header.
 */ const FOCUS_ON_BRAND = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
/** The same idea inside the white dropdown panels, drawn inward so a row at the
 *  panel's edge keeps its whole ring instead of clipping it. */ const FOCUS_IN_PANEL = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand";
/**
 * The count bubble. Same geometry as the mobile bottom nav's — `min-w` plus
 * horizontal padding rather than a fixed square, so a two- or three-digit count
 * grows the pill instead of spilling out of it.
 *
 * Always `aria-hidden`: every badge in this header sits beside a label that
 * already states the number, so announcing it twice is noise.
 */ const BADGE = "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white";
/**
 * Query params that distinguish one nav entry from a sibling on the same path.
 *
 * `mainNav` ships three entries pointing at `/products`, separated only by
 * `?sort=` — see `FALLBACK_SETTINGS` in `src/services/store-settings.ts`. When
 * one of these is set, the bare `/products` link must go dark so a single entry
 * reads as active; every other param (`page`, category filters) is incidental
 * and leaves the active entry alone. Add a param here only when a nav entry is
 * actually built on it.
 */ const SORTED_NAV_PARAMS = [
    "sort"
];
/** The desktop icon-plus-label actions, so the four cannot drift apart. */ const HEADER_ACTION = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("items-center gap-2 transition-colors hover:text-accent motion-reduce:transition-none", FOCUS_ON_BRAND);
function Header({ user, categories, settings }) {
    _s();
    const { announcementBar, contact, catalogConfig } = settings;
    const { showWishlist, showCompare } = catalogConfig;
    /*
   * Whether this slot shows the wordmark or the merchant's artwork. Resolved
   * through the shared helper rather than read off `settings` directly, so the
   * header and the footer cannot come to disagree about the fallback order —
   * and so "logo mode with no image" degrades to the wordmark in both.
   */ const brand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brand$2d$slot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveBrandSlot"])(settings, "header");
    /*
   * Merchant-authored navigation, minus any entry leading to a feature this
   * shop no longer offers — that entry would be a menu item pointing at a page
   * that 404s. Read from the settings prop rather than `getCatalogFeatures()`:
   * the header is handed the whole settings object already, so there is no
   * reason to reach for the module-scope copy the components without a props
   * path use.
   *
   * Filtered once, here, because the same list is handed to the mobile drawer
   * below — computing it twice is how the two menus would come to disagree.
   */ const mainNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Header.useMemo[mainNav]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterNavForFeatures"])(settings.mainNav, catalogConfig)
    }["Header.useMemo[mainNav]"], [
        settings.mainNav,
        catalogConfig
    ]);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    // The cart query lives here because the header is on every page — it keeps
    // the cart cached so the drawer opens instantly, and the count updates
    // straight from the cache after any mutation invalidates it.
    const { data: cart = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_CART"] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"])();
    const itemCount = cart.itemCount;
    // Skipped entirely for a signed-out visitor: the endpoint 401s without a
    // session, and the header is on every page, so this would 401 site-wide.
    // Skipped again when the shop does not offer a wishlist — there is nowhere
    // left to show the count, so subscribing would be a request per page view
    // whose result nothing reads.
    const { data: wishlistCount = 0 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistCountQuery"])(undefined, {
        skip: !user || !showWishlist
    });
    // Local state, not a query: the compare list lives in `localStorage` and works
    // signed out, so there is nothing to fetch and nothing to skip.
    const compareCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCompareCount"]);
    const isCompareHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCompareHydrated"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openMenu, setOpenMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openCategory, setOpenCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // The whole nav row, not just the categories block: an outside click has to
    // close whichever menu is open, and they do not share a container otherwise.
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const categoriesButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const closeMenus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Header.useCallback[closeMenus]": ()=>{
            setOpenMenu(null);
            setOpenCategory(null);
        }
    }["Header.useCallback[closeMenus]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            if (!openMenu) return;
            function handleClickOutside(e) {
                if (navRef.current && !navRef.current.contains(e.target)) {
                    closeMenus();
                }
            }
            // Escape is the only way out for a keyboard shopper — an outside click is
            // not a gesture they have. Focus goes back to the trigger rather than to
            // <body>, so the next Tab resumes from where they were.
            function handleKeyDown(e) {
                if (e.key !== "Escape") return;
                const wasCategories = openMenu === "categories";
                closeMenus();
                if (wasCategories) categoriesButtonRef.current?.focus();
            }
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "Header.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                    document.removeEventListener("keydown", handleKeyDown);
                }
            })["Header.useEffect"];
        }
    }["Header.useEffect"], [
        openMenu,
        closeMenus
    ]);
    /**
   * Whether a nav destination is the page being read.
   *
   * The query is part of the identity, not noise to strip. Three default nav
   * entries share one path and differ only by sort — `/products`,
   * `/products?sort=best`, `/products?sort=new` — so matching on the path
   * alone lit all three at once, on the listing and on every product detail
   * page under it. A link's query params must therefore all match the current
   * URL, and a link that omits a param only matches when the URL omits it too;
   * otherwise plain Shop would stay lit while Best Selling is the active view.
   *
   * Extra params the link never mentions are ignored, so paging and filtering
   * (`?sort=new&page=2`) keeps New Arrivals lit rather than clearing the nav.
   *
   * A child route still counts as its parent, so `/products/anker-321` keeps
   * Shop — and only Shop — lit.
   */ const isCurrent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Header.useCallback[isCurrent]": (href)=>{
            const [rawPath, rawQuery = ""] = href.split("#")[0].split("?");
            const path = rawPath.replace(/\/+$/, "") || "/";
            const pathMatches = path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
            if (!pathMatches) return false;
            // A detail page carries none of the listing's sort params, so only the
            // bare link (no query) should match it.
            const isChildRoute = pathname !== path;
            const linkParams = new URLSearchParams(rawQuery);
            if (isChildRoute) return rawQuery === "";
            for (const [key, value] of linkParams){
                if (searchParams.get(key) !== value) return false;
            }
            // The bare link loses to whichever sibling declares the active param.
            if (rawQuery === "") {
                return SORTED_NAV_PARAMS.every({
                    "Header.useCallback[isCurrent]": (key)=>!searchParams.has(key)
                }["Header.useCallback[isCurrent]"]);
            }
            return true;
        }
    }["Header.useCallback[isCurrent]"], [
        pathname,
        searchParams
    ]);
    /*
   * Hover opens the mega menus, but only under a real mouse. On a touch tablet
   * — still `md` and up, so still this nav — a tap fires `pointerenter` and
   * then `click`, which would open the menu and immediately toggle it shut. The
   * pointer type is the thing that actually distinguishes the two, so it is
   * what the handlers test.
   */ const hoverOpen = (label)=>(e)=>{
            if (e.pointerType !== "mouse") return;
            setOpenMenu(label);
            setOpenCategory(null);
        };
    const hoverClose = (label)=>(e)=>{
            if (e.pointerType !== "mouse") return;
            setOpenMenu((m)=>m === label ? null : m);
        };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-brand shadow-sm",
                children: [
                    announcementBar.enabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden border-b border-white/30 bg-brand text-white md:block",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container-px flex site-container items-center justify-between gap-6 py-2.25 text-[15px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "min-w-0 truncate",
                                    children: announcementBar.text
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex shrink-0 items-center gap-4",
                                    children: (announcementBar.links ?? []).map((link, index)=>{
                                        // A link bound to the store's phone or email resolves against
                                        // the contact block here, so changing the number in the admin
                                        // updates the bar and the footer together.
                                        const { label, href } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$store$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveAnnouncementLink"])(link, contact);
                                        const isExternal = /^https?:\/\//.test(href);
                                        const className = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex items-center gap-2 whitespace-nowrap font-light hover:underline hover:underline-offset-4", FOCUS_ON_BRAND);
                                        const body = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                link.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                    icon: link.icon,
                                                    className: "shrink-0",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 37
                                                }, this),
                                                label
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 265,
                                            columnNumber: 21
                                        }, this);
                                        // `mailto:`/`tel:`/external targets are not routes, so they use
                                        // a plain anchor; internal ones keep client-side navigation.
                                        return isExternal || href.includes(":") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: href,
                                            ...isExternal ? {
                                                target: "_blank",
                                                rel: "noopener noreferrer"
                                            } : {},
                                            className: className,
                                            children: body
                                        }, index, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 274,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: href,
                                            className: className,
                                            children: body
                                        }, index, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 285,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-white/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "container-px flex site-container items-center gap-4 py-4.75 text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative flex basis-8 justify-start before:absolute before:-inset-x-2.5 before:-inset-y-3 before:content-[''] md:hidden", FOCUS_ON_BRAND),
                                        onClick: ()=>setMobileOpen(true),
                                        "aria-label": "Open menu",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            size: 26
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("whitespace-nowrap text-center text-3xl font-bold tracking-tight max-md:flex-1 sm:text-4xl md:shrink-0 md:text-left", FOCUS_ON_BRAND),
                                        children: brand.kind === "logo" ? /*
                  A plain <img>, not next/image: the height is the merchant's
                  and the width follows the artwork, so there are no intrinsic
                  dimensions to hand it — see design.md Decision 3.

                  `height` is set as a style rather than a class because it is a
                  runtime value; `w-auto` keeps the aspect ratio, and `max-w-full`
                  is what stops a very wide logo pushing the mobile menu and
                  account buttons out of the row at 320px. The box is sized
                  before the image loads, so nothing shifts when it arrives.
                */ // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: brand.src,
                                            alt: brand.alt,
                                            style: {
                                                height: brand.height
                                            },
                                            className: "max-w-full w-auto object-contain max-md:mx-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 350,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                settings.storeName,
                                                settings.siteNameAccent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-accent ml-2",
                                                    children: settings.siteNameAccent
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 357,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: user ? "/account" : "/account/login",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative flex basis-8 justify-end before:absolute before:-inset-x-2.5 before:-inset-y-3 before:content-[''] md:hidden", FOCUS_ON_BRAND),
                                        "aria-label": user ? "My account" : "Sign in or register",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            size: 26
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 378,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "ml-auto hidden max-w-2xl flex-1 md:block"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto hidden items-center gap-5 text-sm md:flex",
                                        children: [
                                            showWishlist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/wishlist",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("hidden lg:flex", HEADER_ACTION),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                                size: 22
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 395,
                                                                columnNumber: 21
                                                            }, this),
                                                            wishlistCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: BADGE,
                                                                "aria-hidden": true,
                                                                children: wishlistCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 397,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "leading-tight",
                                                        children: [
                                                            "Wishlist",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block font-semibold",
                                                                children: [
                                                                    wishlistCount,
                                                                    " Saved"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 404,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 393,
                                                columnNumber: 17
                                            }, this),
                                            showCompare && isCompareHydrated && compareCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/compare",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("hidden lg:flex", HEADER_ACTION),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                                                                size: 22
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: BADGE,
                                                                "aria-hidden": true,
                                                                children: compareCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "leading-tight",
                                                        children: [
                                                            "Compare",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block font-semibold",
                                                                children: [
                                                                    compareCount,
                                                                    " Added"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 413,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])()),
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("hidden md:flex", HEADER_ACTION),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                                size: 22
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 435,
                                                                columnNumber: 19
                                                            }, this),
                                                            itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: BADGE,
                                                                "aria-hidden": true,
                                                                children: itemCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 437,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-left leading-tight",
                                                        children: [
                                                            "My Cart",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block font-semibold",
                                                                children: [
                                                                    itemCount,
                                                                    " Items"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 444,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 429,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: user ? "/account" : "/account/login",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("hidden md:flex", HEADER_ACTION),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        size: 22
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 452,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "leading-tight",
                                                        children: [
                                                            user ? "Hello" : "Account",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block max-w-36 truncate font-semibold",
                                                                children: user ? user.name?.trim().split(" ")[0] || "My account" : "Register or Login"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 448,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "container-px site-container pb-3 md:hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 470,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Main",
                className: "sticky top-0 z-40 hidden bg-brand text-white shadow-sm md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: navRef,
                    className: "container-px relative flex site-container items-center gap-8 py-4 text-base font-medium",
                    children: [
                        categories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative border-r border-white/30 pr-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    ref: categoriesButtonRef,
                                    type: "button",
                                    "aria-expanded": openMenu === "categories",
                                    "aria-controls": "header-categories-menu",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex min-w-64 items-center justify-between gap-2 transition-colors hover:text-accent motion-reduce:transition-none", FOCUS_ON_BRAND),
                                    onClick: ()=>setOpenMenu((m)=>{
                                            if (m === "categories") {
                                                setOpenCategory(null);
                                                return null;
                                            }
                                            return "categories";
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 19
                                                }, this),
                                                "Shop By Categories"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 528,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            size: 14,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shrink-0 transition-transform motion-reduce:transition-none", openMenu === "categories" && "rotate-180")
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 532,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 509,
                                    columnNumber: 15
                                }, this),
                                openMenu === "categories" && // `top-full` plus the row's own bottom padding, so the panel
                                // meets the nav's lower edge instead of the magic offset that
                                // left it floating inside the bar. The padding doubles as the
                                // bridge the pointer crosses without leaving the group.
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "header-categories-menu",
                                    className: "absolute left-0 top-full z-50 pt-4 text-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex animate-menu-in overflow-hidden rounded-b-lg bg-white shadow-xl motion-reduce:animate-none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-64",
                                                children: categories.map((cat)=>{
                                                    const href = `/products?category=${encodeURIComponent(cat.slug)}`;
                                                    const isOpen = openCategory === cat.id;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center border-b border-gray-100 last:border-b-0",
                                                        onPointerEnter: (e)=>{
                                                            if (e.pointerType !== "mouse") return;
                                                            setOpenCategory(cat.children.length > 0 ? cat.id : null);
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: href,
                                                                onClick: closeMenus,
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex-1 px-5 py-2.5 text-base transition-colors hover:bg-gray-100 hover:text-brand motion-reduce:transition-none", isOpen && "bg-gray-50 text-brand", FOCUS_IN_PANEL),
                                                                children: cat.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 571,
                                                                columnNumber: 29
                                                            }, this),
                                                            cat.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                "aria-expanded": isOpen,
                                                                "aria-label": `${isOpen ? "Hide" : "Show"} ${cat.name} subcategories`,
                                                                onClick: ()=>setOpenCategory((c)=>c === cat.id ? null : cat.id),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex h-10 w-10 shrink-0 items-center justify-center transition-colors hover:text-brand motion-reduce:transition-none", isOpen ? "text-brand" : "text-gray-400", FOCUS_IN_PANEL),
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                                lineNumber: 583,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, cat.id, true, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 551,
                                                columnNumber: 21
                                            }, this),
                                            openCategory && (()=>{
                                                const active = categories.find((c)=>c.id === openCategory);
                                                if (!active?.children.length) return null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-56 border-l border-gray-100 py-2.5",
                                                    children: active.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/products?category=${encodeURIComponent(child.slug)}`,
                                                            onClick: closeMenus,
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("block px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-brand motion-reduce:transition-none", FOCUS_IN_PANEL),
                                                            children: child.name
                                                        }, child.id, false, {
                                                            fileName: "[project]/src/components/layout/Header.tsx",
                                                            lineNumber: 611,
                                                            columnNumber: 31
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 27
                                                }, this);
                                            })()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 550,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 546,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 502,
                            columnNumber: 13
                        }, this),
                        mainNav.map((link, index)=>link.children?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                onPointerEnter: hoverOpen(link.label),
                                onPointerLeave: hoverClose(link.label),
                                // Tabbing into the group opens it and tabbing past it closes it,
                                // which is the whole reason these children were reachable by
                                // mouse and by nothing else.
                                onFocus: ()=>setOpenMenu(link.label),
                                onBlur: (e)=>{
                                    if (e.currentTarget.contains(e.relatedTarget)) return;
                                    setOpenMenu((m)=>m === link.label ? null : m);
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                onClick: closeMenus,
                                                "aria-current": isCurrent(link.href) ? "page" : undefined,
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-colors hover:text-accent motion-reduce:transition-none", isCurrent(link.href) && "text-accent", FOCUS_ON_BRAND),
                                                children: link.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 649,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-expanded": openMenu === link.label,
                                                "aria-controls": `header-menu-${index}`,
                                                "aria-label": `${openMenu === link.label ? "Hide" : "Show"} ${link.label} submenu`,
                                                onClick: ()=>setOpenMenu((m)=>m === link.label ? null : link.label),
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-colors hover:text-accent motion-reduce:transition-none", FOCUS_ON_BRAND),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-transform motion-reduce:transition-none", openMenu === link.label && "rotate-180")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 677,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 664,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 648,
                                        columnNumber: 17
                                    }, this),
                                    openMenu === link.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: `header-menu-${index}`,
                                        className: "absolute left-0 top-full z-50 pt-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-52 animate-menu-in rounded-b-lg bg-white py-2 text-gray-700 shadow-xl motion-reduce:animate-none",
                                            children: (link.children ?? []).map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: child.href,
                                                    onClick: closeMenus,
                                                    "aria-current": isCurrent(child.href) ? "page" : undefined,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("block px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-brand motion-reduce:transition-none", isCurrent(child.href) && "text-brand", FOCUS_IN_PANEL),
                                                    children: child.label
                                                }, child.label, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 694,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 692,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 688,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, link.label, true, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 634,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: link.href,
                                "aria-current": isCurrent(link.href) ? "page" : undefined,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("transition-colors hover:text-accent motion-reduce:transition-none", isCurrent(link.href) && "text-accent", FOCUS_ON_BRAND),
                                children: link.label
                            }, link.label, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 713,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/deals",
                            "aria-current": isCurrent("/deals") ? "page" : undefined,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ml-auto flex items-center gap-2 transition-colors hover:text-accent motion-reduce:transition-none", isCurrent("/deals") && "text-accent", FOCUS_ON_BRAND),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 739,
                                    columnNumber: 13
                                }, this),
                                "Today's Offers"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 728,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 495,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MobileMenuDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: mobileOpen,
                onClose: ()=>setMobileOpen(false),
                user: user,
                categories: categories,
                mainNav: mainNav
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 745,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
_s(Header, "n9YdJIpXA1Dv3ztooeD8FZKbAzE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWishlistCountQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/MobileBottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileBottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@iconify/react/dist/iconify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.mjs [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
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
function MobileBottomNav({ contact }) {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Already cached by the header's query, so this subscribes to the same data
    // rather than costing a second request.
    const { data: cart = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_CART"] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"])();
    const itemCount = cart.itemCount;
    const compareCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCompareCount"]);
    const isCompareHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectIsCompareHydrated"]);
    // Only `showCompare` is read here: this bar carries no wishlist entry to gate.
    const { showCompare } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2d$features$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCatalogFeatures"])();
    const itemClass = (active)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors", active ? "text-brand" : "text-gray-500");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Quick navigation",
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden",
        // Keeps the row clear of the iOS home indicator / Android gesture bar.
        style: {
            paddingBottom: "env(safe-area-inset-bottom)"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-lg items-stretch",
            children: [
                contact.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `tel:${contact.phone}`,
                            className: itemClass(false),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                    size: 20,
                                    strokeWidth: 1.75
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this),
                                "Phone"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `https://wa.me/${contact.phone.replace(/\D/g, "")}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: itemClass(false),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    icon: "akar-icons:whatsapp-fill",
                                    width: 20,
                                    height: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                "WhatsApp"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: itemClass(pathname === "/"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                            size: 20,
                            strokeWidth: 1.75
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        "Home"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/products",
                    className: itemClass(pathname.startsWith("/products")),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                            size: 20,
                            strokeWidth: 1.75
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        "Shop"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openCart"])()),
                    className: itemClass(false),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    size: 20,
                                    strokeWidth: 1.75
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white",
                                    children: itemCount
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        "Cart"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                showCompare && isCompareHydrated && compareCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/compare",
                    className: itemClass(pathname === "/compare"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                                    size: 20,
                                    strokeWidth: 1.75
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white",
                                    children: compareCount
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this),
                        "Compare"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
                    lineNumber: 112,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/MobileBottomNav.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(MobileBottomNav, "fs7qglRf7L9M5+66ULjZeZHrjMo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetCartQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = MobileBottomNav;
var _c;
__turbopack_context__.k.register(_c, "MobileBottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/MobileMenuDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileMenuDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/SearchBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/SmoothScrollProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function MobileMenuDrawer({ open, onClose, user, categories, mainNav }) {
    _s();
    // Categories is the more useful default when there is a catalog to show, but
    // the tab only exists if there is one — otherwise the drawer opens on an
    // empty panel with no way to tell why.
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("menu");
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openLink, setOpenLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // The drawer covers the viewport; letting the page behind it scroll under the
    // shopper's finger is the classic scroll-chaining bug on iOS. Routed through
    // the shared lock rather than setting `body.overflow` directly — that alone
    // stops nothing once Lenis is driving the scroll loop.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(open);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileMenuDrawer.useEffect": ()=>{
            if (!open) return;
            function onKeyDown(event) {
                if (event.key === "Escape") onClose();
            }
            document.addEventListener("keydown", onKeyDown);
            return ({
                "MobileMenuDrawer.useEffect": ()=>document.removeEventListener("keydown", onKeyDown)
            })["MobileMenuDrawer.useEffect"];
        }
    }["MobileMenuDrawer.useEffect"], [
        open,
        onClose
    ]);
    // Reopening should not resume a half-expanded tree from a previous visit.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileMenuDrawer.useEffect": ()=>{
            if (open) return;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExpanded(null);
            setOpenLink(null);
        }
    }["MobileMenuDrawer.useEffect"], [
        open
    ]);
    if (!open) return null;
    const hasCategories = categories.length > 0;
    // Guards against the tab being stuck on an empty catalog if categories fail
    // to load between renders.
    const activeTab = hasCategories ? tab : "menu";
    const tabClass = (isActive)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex-1 border-b-2 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors", isActive ? "border-brand bg-white text-gray-900" : "border-transparent bg-gray-50 text-gray-400");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 md:hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-stretch border-b border-gray-200",
                        role: "tablist",
                        children: [
                            hasCategories ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": activeTab === "menu",
                                        onClick: ()=>setTab("menu"),
                                        className: tabClass(activeTab === "menu"),
                                        children: "Menu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": activeTab === "categories",
                                        onClick: ()=>setTab("categories"),
                                        className: tabClass(activeTab === "categories"),
                                        children: "Categories"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: tabClass(true),
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                "aria-label": "Close menu",
                                className: "flex w-12 shrink-0 items-center justify-center border-b-2 border-transparent bg-gray-50 text-gray-500",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-100 px-4 py-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onNavigate: onClose
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto overscroll-contain",
                        "data-lenis-prevent": true,
                        children: activeTab === "menu" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "text-sm",
                            children: [
                                mainNav.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "border-b border-gray-100",
                                        children: link.children?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setOpenLink((l)=>l === link.label ? null : link.label),
                                                    className: "flex w-full items-center justify-between px-5 py-3.5 font-medium text-gray-800",
                                                    children: [
                                                        link.label,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            size: 16,
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shrink-0 text-gray-400 transition-transform", openLink === link.label && "rotate-180")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 23
                                                }, this),
                                                openLink === link.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "bg-gray-50",
                                                    children: (link.children ?? []).map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: child.href,
                                                                onClick: onClose,
                                                                className: "block py-2.5 pl-8 pr-5 text-gray-600",
                                                                children: child.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, child.label, false, {
                                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                            lineNumber: 139,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: link.href,
                                            onClick: onClose,
                                            className: "block px-5 py-3.5 font-medium text-gray-800",
                                            children: link.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                            lineNumber: 172,
                                            columnNumber: 21
                                        }, this)
                                    }, link.label, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "border-b border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/wishlist",
                                        onClick: onClose,
                                        className: "block px-5 py-3.5 font-medium text-gray-800",
                                        children: "Wishlist"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "border-b border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: user ? "/account" : "/account/login",
                                        onClick: onClose,
                                        className: "block px-5 py-3.5 font-medium text-gray-800",
                                        children: user ? "My Account" : "Sign In / Register"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 193,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                    lineNumber: 192,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "text-sm",
                            children: categories.map((cat)=>{
                                const isOpen = expanded === cat.id;
                                const href = `/products?category=${encodeURIComponent(cat.slug)}`;
                                // A leaf category has nothing to expand, so the whole row is
                                // the link rather than a link plus a dead chevron.
                                if (cat.children.length === 0) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "border-b border-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: href,
                                            onClick: onClose,
                                            className: "block px-5 py-3.5 font-medium text-gray-800",
                                            children: cat.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                            lineNumber: 213,
                                            columnNumber: 23
                                        }, this)
                                    }, cat.id, false, {
                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                        lineNumber: 212,
                                        columnNumber: 21
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "border-b border-gray-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: href,
                                                    onClick: onClose,
                                                    className: "flex-1 px-5 py-3.5 font-medium text-gray-800",
                                                    children: cat.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setExpanded((c)=>c === cat.id ? null : cat.id),
                                                    "aria-expanded": isOpen,
                                                    "aria-label": `${isOpen ? "Collapse" : "Expand"} ${cat.name}`,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex h-12 w-12 shrink-0 items-center justify-center transition-colors", isOpen ? "bg-gray-900 text-white" : "text-gray-400"),
                                                    children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                            lineNumber: 230,
                                            columnNumber: 21
                                        }, this),
                                        isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "bg-gray-50",
                                            children: cat.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/products?category=${encodeURIComponent(child.slug)}`,
                                                        onClick: onClose,
                                                        className: "block py-2.5 pl-8 pr-5 text-gray-600",
                                                        children: child.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 29
                                                    }, this)
                                                }, child.id, false, {
                                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 27
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                            lineNumber: 259,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, cat.id, true, {
                                    fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                                    lineNumber: 225,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                            lineNumber: 203,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/MobileMenuDrawer.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_s(MobileMenuDrawer, "EjV/vfeNfG4HA19xgQ1pqYSk/vE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$SmoothScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"]
    ];
});
_c = MobileMenuDrawer;
var _c;
__turbopack_context__.k.register(_c, "MobileMenuDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/SearchBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productApi.ts [app-client] (ecmascript)");
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
/** Below this a query matches most of the catalog, so it isn't worth a request. */ const MIN_QUERY_LENGTH = 2;
/**
 * Long enough that ordinary typing doesn't fire a request per keystroke, short
 * enough that the dropdown still feels immediate once the shopper pauses.
 */ const DEBOUNCE_MS = 300;
function SearchBox({ onNavigate, autoFocus = false, className }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [debounced, setDebounced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Which suggestion the arrow keys have moved to; -1 means "none, submit the
    // raw query instead".
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const term = debounced.trim();
    const shouldSearch = term.length >= MIN_QUERY_LENGTH;
    const { data: results = [], isFetching } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchProductsQuery"])(term, {
        skip: !shouldSearch
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            const id = setTimeout({
                "SearchBox.useEffect.id": ()=>setDebounced(query)
            }["SearchBox.useEffect.id"], DEBOUNCE_MS);
            return ({
                "SearchBox.useEffect": ()=>clearTimeout(id)
            })["SearchBox.useEffect"];
        }
    }["SearchBox.useEffect"], [
        query
    ]);
    // A new set of results invalidates whatever the arrow keys had selected —
    // otherwise Enter could open a product the shopper can no longer see.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveIndex(-1);
        }
    }["SearchBox.useEffect"], [
        results
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            if (!open) return;
            function handleClickOutside(event) {
                if (!containerRef.current?.contains(event.target)) setOpen(false);
            }
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "SearchBox.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["SearchBox.useEffect"];
        }
    }["SearchBox.useEffect"], [
        open
    ]);
    function close() {
        setOpen(false);
        setActiveIndex(-1);
    }
    function goTo(href) {
        close();
        onNavigate?.();
        router.push(href);
    }
    function handleSubmit(event) {
        event.preventDefault();
        // An arrowed-to suggestion wins over the raw text — the shopper picked it.
        const picked = results[activeIndex];
        if (picked) {
            goTo(`/products/${picked.slug}`);
            return;
        }
        const trimmed = query.trim();
        goTo(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    }
    function handleKeyDown(event) {
        if (event.key === "Escape") {
            close();
            return;
        }
        if (!results.length) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((i)=>(i + 1) % results.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((i)=>i <= 0 ? results.length - 1 : i - 1);
        }
    }
    // Only meaningful once the debounce has caught up with what was typed;
    // otherwise "no products found" flashes while the request is still pending.
    const settled = debounced === query && !isFetching;
    const showDropdown = open && shouldSearch;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("relative", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: query,
                        onChange: (e)=>{
                            setQuery(e.target.value);
                            setOpen(true);
                        },
                        onFocus: ()=>setOpen(true),
                        onKeyDown: handleKeyDown,
                        type: "search",
                        placeholder: "Search for products",
                        "aria-label": "Search products",
                        autoFocus: autoFocus,
                        className: "w-full rounded-l border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/SearchBox.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "flex h-10.5 w-12 shrink-0 items-center justify-center rounded-r bg-accent text-black",
                        "aria-label": "Search",
                        children: isFetching && shouldSearch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 18,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBox.tsx",
                            lineNumber: 147,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBox.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/SearchBox.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/SearchBox.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            showDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-x-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded border border-gray-200 bg-white shadow-xl",
                "data-lenis-prevent": true,
                children: results.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        results.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                // `mousedown` fires before the input's blur, so the click is
                                // not lost to the dropdown unmounting first.
                                onMouseDown: (e)=>e.preventDefault(),
                                onClick: ()=>goTo(`/products/${item.slug}`),
                                onMouseEnter: ()=>setActiveIndex(index),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors", index === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative h-11 w-11 shrink-0 overflow-hidden rounded bg-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: item.image,
                                            alt: item.name,
                                            fill: true,
                                            sizes: "44px",
                                            className: "object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/SearchBox.tsx",
                                            lineNumber: 176,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/SearchBox.tsx",
                                        lineNumber: 175,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "line-clamp-1 block text-sm text-gray-800",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/SearchBox.tsx",
                                                lineNumber: 185,
                                                columnNumber: 21
                                            }, this),
                                            item.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-xs text-gray-400",
                                                children: item.brand
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/SearchBox.tsx",
                                                lineNumber: 189,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/SearchBox.tsx",
                                        lineNumber: 184,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-sm font-semibold text-sale",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(item.offerPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/SearchBox.tsx",
                                        lineNumber: 194,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/components/layout/SearchBox.tsx",
                                lineNumber: 162,
                                columnNumber: 17
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onMouseDown: (e)=>e.preventDefault(),
                            onClick: ()=>goTo(`/products?q=${encodeURIComponent(query.trim())}`),
                            className: "block w-full border-t border-gray-100 px-3 py-2.5 text-center text-sm font-semibold text-brand hover:bg-gray-50",
                            children: [
                                "See all results for “",
                                query.trim(),
                                "”"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/SearchBox.tsx",
                            lineNumber: 199,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/SearchBox.tsx",
                    lineNumber: 160,
                    columnNumber: 13
                }, this) : settled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-3 py-4 text-center text-sm text-gray-500",
                    children: [
                        "No products found for “",
                        term,
                        "”."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/SearchBox.tsx",
                    lineNumber: 211,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex items-center justify-center gap-2 px-3 py-4 text-sm text-gray-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 15,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBox.tsx",
                            lineNumber: 216,
                            columnNumber: 15
                        }, this),
                        " Searching..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/SearchBox.tsx",
                    lineNumber: 215,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/SearchBox.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/SearchBox.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(SearchBox, "3R5CdhXWGK5HAeQoMm4xgp2NDp4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchProductsQuery"]
    ];
});
_c = SearchBox;
var _c;
__turbopack_context__.k.register(_c, "SearchBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/providers/SmoothScrollProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SmoothScrollProvider,
    "useScrollLock",
    ()=>useScrollLock,
    "useSmoothScroll",
    ()=>useSmoothScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** Module-level so its identity is stable across renders, as useSyncExternalStore requires. */ function subscribeToReducedMotion(onChange) {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    media.addEventListener("change", onChange);
    return ()=>media.removeEventListener("change", onChange);
}
const SmoothScrollContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    lenis: null
});
function useSmoothScroll() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SmoothScrollContext);
}
_s(useSmoothScroll, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function SmoothScrollProvider({ children }) {
    _s1();
    const [lenis, setLenis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /*
   * The provider lives in `layout.tsx`, so it stays mounted across App Router
   * navigations. Lenis owns the window scroll, which means the router's own
   * `window.scrollTo(0, 0)` on route change is just a native jump that Lenis
   * discards — so the new page can open mid-scroll, and when Lenis's cached
   * page height (its internal `limit`) is stale it "stacks" on re-entry.
   *
   * Listening to the pathname and snapping Lenis back to the top (plus a
   * `resize()` to refresh its cached dimensions) restores the browser's
   * default top-of-page navigation on every route change.
   */ const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SmoothScrollProvider.useEffect": ()=>{
            if (!lenis) return;
            // Reset rather than a smooth `scrollTo` so the jump is instant, silent and
            // cannot be interrupted by (or interrupt) the next route transition.
            lenis.scrollTo(0, {
                immediate: true,
                force: true
            });
            lenis.resize();
        }
    }["SmoothScrollProvider.useEffect"], [
        pathname,
        lenis
    ]);
    /*
   * The user's motion preference, read with `useSyncExternalStore` rather than
   * an effect: it is external browser state, and this gives a server/first-client
   * value of `true` so a reduced-motion user never gets a frame of smooth
   * scrolling before the preference is known. Changes re-render, which tears
   * Lenis down or builds it back up mid-session.
   */ const prefersReducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeToReducedMotion, {
        "SmoothScrollProvider.useSyncExternalStore[prefersReducedMotion]": ()=>window.matchMedia(REDUCED_MOTION_QUERY).matches
    }["SmoothScrollProvider.useSyncExternalStore[prefersReducedMotion]"], {
        "SmoothScrollProvider.useSyncExternalStore[prefersReducedMotion]": ()=>true
    }["SmoothScrollProvider.useSyncExternalStore[prefersReducedMotion]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SmoothScrollProvider.useEffect": ()=>{
            if (prefersReducedMotion) return;
            const instance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                // Window-scroll mode — see the note on this component.
                autoRaf: true,
                // Lenis owns in-page anchor jumps, so they ease to the target and respect
                // `scroll-padding-top` rather than fighting the smooth scroll loop.
                anchors: true,
                /*
       * `allowNestedScroll` is deliberately left off.
       *
       * It makes Lenis inspect the composed path on every wheel event and hand
       * the event to any ancestor that merely *looks* scrollable in that
       * direction — which strands the page near the document end, where the
       * cursor sits over such an element and the first scrolls back up get
       * swallowed instead of moving the page.
       *
       * The genuinely nested scrollers (the cart drawer's item list, the mobile
       * menu's list) opt out explicitly with `data-lenis-prevent`, which is
       * exact rather than inferred.
       */ duration: 1.05,
                // Standard exponential ease-out: quick to respond, long tail to settle.
                easing: {
                    "SmoothScrollProvider.useEffect": (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t))
                }["SmoothScrollProvider.useEffect"]
            });
            // Publishing an imperatively-created instance is the point of this effect;
            // the instance cannot exist during render.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLenis(instance);
            // Back/forward navigation (bfcache) can restore the DOM but leave Lenis's
            // cached scroll state stale; a resize recalculates the page dimensions.
            const onPageshow = {
                "SmoothScrollProvider.useEffect.onPageshow": (e)=>{
                    if (e.persisted) instance.resize();
                }
            }["SmoothScrollProvider.useEffect.onPageshow"];
            window.addEventListener("pageshow", onPageshow);
            /*
     * Lenis caches the scrollable height and clamps scrolling to it. Any content
     * that arrives AFTER the route's first paint — a client effect reading
     * sessionStorage, a query resolving, an image settling — grows the page
     * without Lenis noticing, and the page then refuses to scroll past the stale
     * limit. The `pathname` effect below cannot cover this: it runs at
     * navigation, before that content exists.
     *
     * Observing the body's real box is what makes the limit follow the DOM
     * instead of a snapshot of it.
     */ const observer = new ResizeObserver({
                "SmoothScrollProvider.useEffect": ()=>instance.resize()
            }["SmoothScrollProvider.useEffect"]);
            observer.observe(document.body);
            return ({
                "SmoothScrollProvider.useEffect": ()=>{
                    observer.disconnect();
                    window.removeEventListener("pageshow", onPageshow);
                    instance.destroy();
                    setLenis(null);
                }
            })["SmoothScrollProvider.useEffect"];
        }
    }["SmoothScrollProvider.useEffect"], [
        prefersReducedMotion
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SmoothScrollProvider.useMemo[value]": ()=>({
                lenis
            })
    }["SmoothScrollProvider.useMemo[value]"], [
        lenis
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SmoothScrollContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/providers/SmoothScrollProvider.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_s1(SmoothScrollProvider, "l0Ls8TxAXKGjqnQhC+bRmc17Tlk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = SmoothScrollProvider;
function useScrollLock(locked) {
    _s2();
    const { lenis } = useSmoothScroll();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollLock.useEffect": ()=>{
            if (!locked) return;
            lenis?.stop();
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "useScrollLock.useEffect": ()=>{
                    // Same instance the lock was taken on: if `lenis` is replaced while the
                    // lock is held, the effect re-runs and this cleanup releases the old one
                    // before the new one is stopped.
                    lenis?.start();
                    document.body.style.overflow = previousOverflow;
                }
            })["useScrollLock.useEffect"];
        }
    }["useScrollLock.useEffect"], [
        locked,
        lenis
    ]);
}
_s2(useScrollLock, "4dfOhblEPEXYDBD7WuORyoAO/2w=", false, function() {
    return [
        useSmoothScroll
    ];
});
var _c;
__turbopack_context__.k.register(_c, "SmoothScrollProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "ApiError",
    ()=>ApiError,
    "apiFetch",
    ()=>apiFetch,
    "readSetCookie",
    ()=>readSetCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api/v1") ?? "http://localhost:5000/api/v1";
class ApiError extends Error {
    status;
    /** Stable machine-readable code, when the backend supplies one
   * (e.g. `EMAIL_NOT_VERIFIED`, `INVALID_EMAIL_OR_PASSWORD`). */ code;
    constructor(message, status, code){
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}
/** Reads better-auth's `error.body.code` off the error envelope, if present. */ function extractErrorCode(body) {
    if (!body || typeof body !== "object") return undefined;
    const code = body.error?.body?.code;
    return typeof code === "string" ? code : undefined;
}
/**
 * Pulls the human-readable message out of the backend's error envelope
 * (`{ success: false, message, errorSources? }` — see globalErrorHandler.ts).
 * Validation failures put the useful detail in `errorSources`, so prefer the
 * first of those over the generic top-level message.
 */ function extractErrorMessage(body, fallback) {
    if (!body || typeof body !== "object") return fallback;
    const payload = body;
    const source = payload.errorSources?.[0]?.message;
    if (typeof source === "string" && source.length > 0) return source;
    if (typeof payload.message === "string" && payload.message.length > 0) {
        return payload.message;
    }
    return fallback;
}
/** Default request timeout. Prevents a hung backend from stalling a render. */ const DEFAULT_TIMEOUT_MS = 10_000;
async function apiFetch(path, { method = "GET", body, cookie, cache = "no-store", revalidate, tags, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    const headers = {
        Accept: "application/json"
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (cookie) headers.Cookie = cookie;
    const url = `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    // `cache` and `next.revalidate` cannot both be set, so a caller asking for
    // revalidation opts out of the `no-store` default entirely.
    const cacheOptions = revalidate === undefined ? {
        cache
    } : {
        next: {
            revalidate,
            ...tags ? {
                tags
            } : {}
        }
    };
    let response;
    try {
        response = await fetch(url, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(timeoutMs),
            ...cacheOptions
        });
    } catch  {
        // Network-level failure or timeout — the API is unreachable, not a 4xx/5xx.
        throw new ApiError("Unable to reach the server. Please check your connection and try again.", 0);
    }
    const json = await response.json().catch(()=>null);
    if (!response.ok) {
        throw new ApiError(extractErrorMessage(json, `Request failed (${response.status})`), response.status, extractErrorCode(json));
    }
    return json;
}
function readSetCookie(response, name) {
    const raw = response.headers.getSetCookie?.() ?? [];
    const match = raw.find((cookie)=>cookie.startsWith(`${name}=`));
    if (!match) return null;
    const value = match.split(";")[0]?.split("=")[1];
    return value ? decodeURIComponent(value) : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/brand-slot.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brandName",
    ()=>brandName,
    "resolveBrandSlot",
    ()=>resolveBrandSlot
]);
function brandName(settings) {
    return [
        settings.storeName,
        settings.siteNameAccent
    ].filter(Boolean).join(" ");
}
function resolveBrandSlot(settings, slot) {
    const mode = slot === "header" ? settings.headerBrandMode : settings.footerBrandMode;
    // Rule 1: the mode decides, and it is checked before any artwork is looked at.
    if (mode !== "LOGO") return {
        kind: "text"
    };
    /*
   * Rule 2: the header uses its own image; the footer prefers its own and
   * borrows the header's.
   *
   * `||` and NOT `??`. A cleared field can arrive as `""` as easily as `null` —
   * the admin's draft holds `''` for an unset logo — and for the footer's
   * fallback the two mean the same thing: no artwork of its own. Under `??` an
   * empty string is a value, so the footer would fall past the header's logo
   * and land on the wordmark, which is the bug the "cleared footer logo"
   * test pins down.
   */ const src = slot === "header" ? settings.logoUrl : settings.footerLogoUrl || settings.logoUrl;
    // Rule 3: no image resolved, so the slot shows the wordmark rather than an
    // empty box or a broken image.
    if (!src) return {
        kind: "text"
    };
    return {
        kind: "logo",
        src,
        height: slot === "header" ? settings.headerLogoHeight : settings.footerLogoHeight,
        /*
     * Always the wordmark, so the shop is announced identically whether a slot
     * is in logo or text mode — and so a logo that fails to load still says who
     * the shop is instead of leaving an unlabelled link.
     */ alt: brandName(settings)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/compare-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPARE_LIMIT",
    ()=>COMPARE_LIMIT,
    "readCompareSlugs",
    ()=>readCompareSlugs,
    "writeCompareSlugs",
    ()=>writeCompareSlugs
]);
"use client";
/**
 * The compare list, kept in `localStorage`.
 *
 * This is the app's first client-persisted state. Cart and wishlist are both
 * server-owned behind httpOnly cookies; compare is deliberately not, because it
 * is a browsing aid a signed-out shopper must be able to use without being asked
 * to create an account. `localStorage` over `sessionStorage` — a comparison is
 * assembled across visits, not within one tab.
 *
 * Only product slugs are stored. Storing names or prices would render whatever
 * was true when the product was added, and the comparison is required to show
 * current prices.
 *
 * Slugs rather than ids because the public product endpoint resolves by slug
 * only — `GET /products/:id` is a 404 — so a list of ids could not be fetched
 * back. The cost is that renaming a product orphans its stored entry, which
 * fails exactly as a deleted product does and is pruned the same way.
 *
 * Every access is defensive. Storage can be unavailable (private browsing,
 * blocked cookies, quota exhausted) or hold something another version wrote. A
 * failure means "no stored list" and compare degrades to session-only — it must
 * never throw into a render.
 */ const COMPARE_KEY = "compareProductSlugs";
const COMPARE_LIMIT = 4;
function readCompareSlugs() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(COMPARE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const slugs = parsed.filter((slug)=>typeof slug === "string" && slug.length > 0);
        return [
            ...new Set(slugs)
        ].slice(0, COMPARE_LIMIT);
    } catch  {
        return [];
    }
}
function writeCompareSlugs(slugs) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(COMPARE_KEY, JSON.stringify(slugs));
    } catch  {
    // Storage full, unavailable, or blocked. The list still works for this
    // session; it simply will not survive a reload.
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/placeholder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "placeholderImage",
    ()=>placeholderImage
]);
function placeholderImage(seed, opts = {}) {
    const { w = 800, h = 800, label } = opts;
    const params = new URLSearchParams({
        seed,
        w: String(w),
        h: String(h)
    });
    if (label) params.set("label", label);
    return `/api/placeholder?${params.toString()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/product.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRODUCTS_CACHE_TAG",
    ()=>PRODUCTS_CACHE_TAG,
    "getPriceBounds",
    ()=>getPriceBounds,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProducts",
    ()=>getProducts,
    "getRelatedProducts",
    ()=>getRelatedProducts,
    "toProduct",
    ()=>toProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/placeholder.ts [app-client] (ecmascript)");
;
;
/**
 * Catalog data changes more often than categories but is still far from
 * per-request volatile, so a short window collapses repeat traffic without
 * showing visibly stale prices.
 */ const PRODUCT_REVALIDATE_SECONDS = 60;
const PRODUCTS_CACHE_TAG = "products";
const EMPTY_META = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 0
};
/**
 * Money arrives as a decimal string ("79.99"). Parse once here so no component
 * ever does arithmetic on a string. Returns undefined for null/empty/unparseable
 * so optional prices stay genuinely optional.
 */ function toPrice(value) {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
/**
 * Primary image first, then the lowest-sorted one, then a placeholder.
 *
 * Keeps each image's `variantId` rather than flattening to urls — that is what
 * lets the gallery filter to the selected variant. The sort is unchanged, so a
 * product whose images carry no variant yields the same order as before.
 */ function pickImages(product) {
    const sorted = [
        ...product.images ?? []
    ].sort((a, b)=>Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
    return {
        image: sorted[0]?.url ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placeholderImage"])(product.slug, {
            label: product.name
        }),
        images: sorted.map((img)=>({
                url: img.url,
                // Older payloads (and the list projection) omit the field entirely;
                // treat a missing value as shared rather than as undefined.
                variantId: img.variantId ?? null,
                altText: img.altText ?? undefined
            }))
    };
}
function toVariant(variant) {
    return {
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        offerPrice: toPrice(variant.offerPrice) ?? 0,
        sellingPrice: toPrice(variant.sellingPrice),
        stockQuantity: variant.stockQuantity,
        attributes: variant.attributes ?? {},
        image: variant.image ?? undefined,
        inStock: variant.stockQuantity > 0,
        // Defaults to empty rather than undefined, so a storefront deployed ahead
        // of the backend renders every product through the no-options path instead
        // of crashing on a missing field.
        optionValueIds: (variant.optionValues ?? []).map((ov)=>ov.valueId)
    };
}
/**
 * Maps an option and sorts its values by the merchant's authored `position`.
 *
 * Sorted here rather than trusted from the payload: the order is the whole
 * point (S -> M -> XL is not derivable from the labels), and a single mapper is
 * a cheaper guarantee than every consumer remembering.
 *
 * An unrecognised presentation becomes `LABEL`, so a presentation added to the
 * backend later cannot break a deployed storefront.
 */ function toOption(option) {
    return {
        id: option.id,
        name: option.name,
        presentation: option.presentation === "SWATCH" ? "SWATCH" : "LABEL",
        values: [
            ...option.values
        ].sort((a, b)=>a.position - b.position).map((value)=>({
                id: value.id,
                label: value.label,
                swatch: value.swatch ?? undefined
            }))
    };
}
function toProduct(product) {
    const { image, images } = pickImages(product);
    const basePrice = toPrice(product.offerPrice) ?? 0;
    // An active campaign discounts the product; when present it *is* the price
    // the shopper pays, and the offer price becomes the struck-through comparison.
    const campaignPrice = toPrice(product.campaignPrice);
    const sellingPrice = toPrice(product.sellingPrice);
    const effectivePrice = campaignPrice ?? basePrice;
    const effectiveCompareAt = campaignPrice ? basePrice : sellingPrice;
    // A rating only exists once something has been rated. Gating on reviewCount
    // rather than on the parsed number keeps "unrated" distinct from "rated 0",
    // which is what stops an unrated product rendering an empty five-star row.
    const reviewCount = product.reviewCount ?? 0;
    const rating = reviewCount > 0 ? toPrice(product.averageRating) : undefined;
    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        description: product.description ?? undefined,
        shortDescription: product.shortDescription ?? undefined,
        seoTitle: product.seoTitle ?? undefined,
        seoDescription: product.seoDescription ?? undefined,
        type: product.type,
        isVariable: product.type === "VARIABLE",
        offerPrice: effectivePrice,
        // Only a comparison price *above* the current one represents a saving.
        sellingPrice: effectiveCompareAt !== undefined && effectiveCompareAt > effectivePrice ? effectiveCompareAt : undefined,
        image,
        images,
        brand: product.brand?.name,
        category: product.category?.name,
        categorySlug: product.category?.slug,
        stockQuantity: product.stockQuantity,
        inStock: product.stockQuantity > 0,
        isFeatured: product.isFeatured,
        variants: (product.variants ?? []).filter((v)=>v.status).map(toVariant),
        options: [
            ...product.options ?? []
        ].sort((a, b)=>a.position - b.position).map(toOption),
        attributes: (product.attributes ?? []).map((a)=>({
                name: a.name,
                value: a.value
            })),
        // `?? undefined` and not `?? ""`: an absent fact must be absent, so the UI
        // can render nothing at all rather than an empty label. The two booleans
        // stay tri-state for the same reason — `null` becomes `undefined` ("not
        // stated"), never `false`.
        unit: product.unit || undefined,
        badge: product.badge || undefined,
        isRefundable: product.isRefundable ?? undefined,
        hasWarranty: product.hasWarranty ?? undefined,
        video: product.video ?? undefined,
        videoThumbnail: product.videoThumbnail ?? undefined,
        bundleDeal: product.bundleDeal ? {
            name: product.bundleDeal.name,
            buyQuantity: product.bundleDeal.buyQuantity,
            freeQuantity: product.bundleDeal.freeQuantity
        } : undefined,
        tags: (product.tags ?? []).map((row)=>row.tag.name),
        rating,
        reviewCount,
        // Defaults to 0 so a storefront deployed ahead of the backend renders — and
        // 0 is what makes the page show no view line at all.
        viewCount: product.viewCount ?? 0
    };
}
function buildQueryString(query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (value === undefined || value === null || value === "") continue;
        params.set(key, String(value));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}
async function getProducts(query = {}) {
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products${buildQueryString(query)}`, {
            revalidate: PRODUCT_REVALIDATE_SECONDS,
            tags: [
                PRODUCTS_CACHE_TAG
            ]
        });
        const data = Array.isArray(response.data) ? response.data : [];
        return {
            products: data.map(toProduct),
            meta: response.meta ?? {
                ...EMPTY_META,
                total: data.length
            }
        };
    } catch  {
        return {
            products: [],
            meta: EMPTY_META
        };
    }
}
async function getPriceBounds() {
    const query = {
        page: 1,
        limit: 1,
        sortBy: "offerPrice"
    };
    const [cheapest, dearest] = await Promise.all([
        getProducts({
            ...query,
            sortOrder: "asc"
        }),
        getProducts({
            ...query,
            sortOrder: "desc"
        })
    ]);
    const min = cheapest.products[0]?.offerPrice;
    const max = dearest.products[0]?.offerPrice;
    // An empty catalog, or a failed fetch, yields a degenerate range. Report a
    // zero-width one rather than a made-up ceiling so the panel can hide the
    // slider instead of offering a filter over prices that do not exist.
    if (min === undefined || max === undefined) return {
        min: 0,
        max: 0
    };
    // Floor/ceil to whole units: the handles step in whole currency units, so a
    // fractional bound would leave the extreme product unreachable by dragging.
    return {
        min: Math.floor(min),
        max: Math.ceil(max)
    };
}
async function getProductBySlug(slug) {
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${slug}`, {
            revalidate: PRODUCT_REVALIDATE_SECONDS,
            tags: [
                PRODUCTS_CACHE_TAG
            ]
        });
        return data ? toProduct(data) : null;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] && error.status === 404) return null;
        throw error;
    }
}
async function getRelatedProducts(slug, limit = 6) {
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${slug}/related?limit=${limit}`, {
            revalidate: PRODUCT_REVALIDATE_SECONDS,
            tags: [
                PRODUCTS_CACHE_TAG
            ]
        });
        return Array.isArray(data) ? data.map(toProduct) : [];
    } catch  {
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/store-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STORE_SETTINGS_CACHE_TAG",
    ()=>STORE_SETTINGS_CACHE_TAG,
    "getStoreSettings",
    ()=>getStoreSettings,
    "resolveAnnouncementLink",
    ()=>resolveAnnouncementLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
;
/**
 * How stale this payload may get in the WORST case — when the backend's
 * revalidation ping below never arrives.
 *
 * Deliberately much shorter than the category tree's and the banners' five
 * minutes, despite this changing just as rarely. The difference is who notices:
 * a merchant edits their own theme and immediately reloads to check it. Five
 * minutes of "did my save work?" is indistinguishable from a broken feature,
 * and that is a worse failure than a small amount of extra traffic.
 *
 * This is the floor of correctness, not the expected behaviour: a correctly
 * configured deployment invalidates the tag on save and updates instantly. This
 * bound is what keeps the feature usable when that is misconfigured, pointed at
 * the wrong origin, or blocked between the two services.
 *
 * The cost is one small request per 30s ACROSS ALL TRAFFIC, not per visitor —
 * it is a single shared cache entry over a singleton row read by primary key.
 */ const SETTINGS_REVALIDATE_SECONDS = 30;
const STORE_SETTINGS_CACHE_TAG = "store-settings";
/**
 * What the storefront renders when the API cannot be reached.
 *
 * Not a blank object: the header and footer are on EVERY page, so a failed read
 * has to leave a usable site rather than a stripped one. These mirror the
 * backend's own `DEFAULT_PUBLIC_SETTINGS`, which is what a healthy response
 * would have merged in anyway.
 */ const FALLBACK_SETTINGS = {
    storeName: "Gadgets",
    siteNameAccent: "Mart",
    logoUrl: null,
    footerLogoUrl: null,
    /*
   * Null, like the two logos: "the merchant chose no icon", which resolves to
   * the icon this app ships with. A settings outage therefore shows the stock
   * favicon rather than a broken one, and never somebody else's artwork.
   */ faviconUrl: null,
    /*
   * Mirrors the backend's `DEFAULT_PUBLIC_SETTINGS`. TEXT for both is what the
   * storefront rendered before these existed, so a settings outage degrades the
   * brand slots to the wordmark — which is always truthful, and is exactly what
   * a store that has never configured branding shows anyway.
   */ headerBrandMode: "TEXT",
    footerBrandMode: "TEXT",
    /* Mirrors the backend's column defaults; bounded 24-96 there. */ headerLogoHeight: 40,
    footerLogoHeight: 36,
    aboutText: "Welcome to our store, where we pride ourselves on providing exceptional products and unparalleled customer service, style and innovation.",
    copyrightText: "Gadgets Mart - Electronics Store. Built with Next.js.",
    siteUrl: null,
    metaTitle: null,
    metaDescription: null,
    currency: "BDT",
    currencySymbol: "৳",
    /*
   * Reproduce the storefront's pre-configuration rendering — `formatPrice` was
   * the literal `` `৳${value.toFixed(2)}` `` — so a failed settings read leaves
   * prices looking as they always have rather than symbol-less. Mirrors the
   * backend's DEFAULT_PUBLIC_SETTINGS.
   */ currencyPosition: "BEFORE",
    currencyDecimals: 2,
    contact: {
        email: "contact@sheisite.com",
        phone: "+8801782521705",
        address: "Electrode - Electronics Store, 507 Union Trade, Ipsum Dolor Centre"
    },
    mainNav: [
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Shop",
            href: "/products"
        },
        {
            label: "Best Selling",
            href: "/products?sort=best"
        },
        {
            label: "New Arrivals",
            href: "/products?sort=new"
        },
        {
            label: "Blogs",
            href: "/blogs"
        },
        {
            label: "Contact",
            href: "/contact"
        }
    ],
    footerColumns: [],
    socialLinks: [],
    announcementBar: {
        enabled: true,
        text: "Free delivery & 40% discount for next 3 orders! Place your 1st order in.",
        links: [
            {
                icon: "akar-icons:whatsapp-fill",
                label: "+8801782521705",
                href: "https://wa.me/8801782521705",
                source: "contactPhone"
            },
            {
                icon: "garden:email-stroke-16",
                label: "contact@sheisite.com",
                href: "mailto:contact@sheisite.com",
                source: "contactEmail"
            },
            {
                icon: "fa-solid:truck",
                label: "Track Order",
                href: "/track-order"
            }
        ]
    },
    newsletter: {
        heading: "Join Our Newsletter For ৳10 Off",
        subtext: "Subscribe to our latest newsletter to get news about special discounts and upcoming sales.",
        placeholder: "Email",
        buttonLabel: "Subscribe"
    },
    /*
   * Mirrors the backend's DEFAULT_CHECKOUT_CONFIG, which in turn reproduces the
   * checkout this storefront had before it was configurable. A settings outage
   * therefore degrades checkout to its old behaviour, never to an unusable one.
   */ checkoutConfig: {
        fields: {
            fullName: {
                show: true,
                required: true
            },
            phone: {
                show: true,
                required: true
            },
            addressLine1: {
                show: true,
                required: true
            },
            addressLine2: {
                show: true,
                required: false
            },
            city: {
                show: true,
                required: true
            },
            postalCode: {
                show: true,
                required: false
            }
        },
        showCouponBox: true,
        showOrderNote: true,
        allowGuestCheckout: true,
        notice: "",
        /*
     * No options, which is the honest fallback rather than a safe-looking one.
     * Delivery prices are merchant money; inventing an area and a charge to
     * degrade gracefully would mean charging a shopper an amount nobody chose.
     * Checkout refuses to price an order against an empty list and says the
     * store has not set delivery up.
     */ delivery: {
            offersPickup: false,
            options: []
        }
    },
    /*
   * Everything offered, which is the only safe direction to fail in. A settings
   * outage that withdrew the wishlist and comparison would silently strip
   * working features from a shop that pays for them — and unlike a missing
   * announcement bar, nobody would read it as an outage. Mirrors the backend's
   * DEFAULT_CATALOG_CONFIG, which reproduces the storefront as it was before
   * these were configurable.
   */ catalogConfig: {
        showWishlist: true,
        showCompare: true,
        showQuickView: true
    },
    /*
   * Every section enabled, in the order the homepage renders them — mirrors the
   * backend's DEFAULT_HOME_CONFIG and HOME_SECTION_KEYS, and must be kept in
   * step with server/ by hand.
   *
   * The same safe direction as `catalogConfig` above, and for a sharper reason:
   * this list decides whether the homepage has any content at all. Falling back
   * to an empty list would serve a blank page during a settings outage, and a
   * shopper cannot tell a blank homepage caused by an outage from one the
   * merchant chose — so the failure would look exactly like a deliberate design
   * and go unreported. Falling back to everything-on degrades to the homepage
   * the storefront had before any of this was configurable.
   *
   * Only ever reached when the settings read FAILS. A reachable backend always
   * sends a complete, reconciled list, so this is not the path a normal
   * unconfigured store takes — that one is handled server-side.
   */ homeConfig: [
        {
            key: "HERO",
            enabled: true
        },
        {
            key: "BRAND_BAR",
            enabled: true
        },
        {
            key: "FEATURED_CATEGORIES",
            enabled: true
        },
        {
            key: "BEST_SELLING",
            enabled: true
        },
        {
            key: "MID_BANNERS",
            enabled: true
        },
        {
            key: "FEATURED_PRODUCTS",
            enabled: true
        },
        {
            key: "PERKS_BAR",
            enabled: true
        },
        {
            key: "DEAL_OF_WEEK",
            enabled: true
        },
        {
            key: "NEW_ARRIVALS",
            enabled: true
        },
        {
            key: "TESTIMONIALS",
            enabled: true
        },
        {
            key: "BLOG",
            enabled: true
        },
        /*
     * Last, matching the backend registry. Easy to forget and invisible when
     * you do: this list is only reached when the settings read FAILS, so an
     * omission here would drop the newsletter from the home page during exactly
     * the incident where the page is already degraded — and nowhere else, so it
     * would never show up in normal testing.
     */ {
            key: "NEWSLETTER",
            enabled: true
        }
    ],
    /*
   * Mirrors the backend's DEFAULT_THEME, which mirrors globals.css. These are
   * the same values the stylesheet already carries, so a failed settings read
   * paints the site exactly as the stylesheet alone would.
   */ /*
   * WEBSITE and null, so a storefront that cannot reach the settings API
   * renders the normal shop. This is the only safe direction to fail in:
   * falling back to LANDING_PAGE would replace the home page with a redirect to
   * a page whose slug we do not know. Mirrors the backend's own default.
   */ siteMode: "WEBSITE",
    activeLandingPage: null,
    /*
   * Mirrors the backend's DEFAULT_SEO_CONFIG, which reproduces the storefront's
   * metadata as it was before any of this was configurable: no title template,
   * no defaults of its own, and indexing left as the crawlers already found it.
   *
   * The private groups are the one exception, and the only opinion here: a cart,
   * a checkout and a customer's own account carry per-visitor state and thin,
   * duplicated content, and were never pages a search engine should hold.
   *
   * Failing towards `globalNoindex: false` is the only safe direction — a
   * settings read that fell back to `true` would deindex a live shop, and nobody
   * would notice until the traffic went.
   */ /*
   * No pixel, disabled.
   *
   * Failing towards OFF is the only safe direction here, for the same shape of
   * reason `globalNoindex: false` above is: a settings read that fell back to an
   * enabled pixel would fire tracking on a shop that never opted into it, and a
   * fallback ID would attribute one shop's conversions to another. The cost of
   * failing off is measurement missing for one render, which is invisible and
   * harmless.
   */ facebookPixel: {
        enabled: false,
        pixelId: ""
    },
    seoConfig: {
        titleTemplate: "",
        defaultMetaTitle: "",
        defaultMetaDescription: "",
        defaultOgImageUrl: "",
        twitterCardType: "summary_large_image",
        twitterSite: "",
        robots: {
            globalNoindex: false,
            groups: {
                home: {
                    index: true,
                    follow: true
                },
                product: {
                    index: true,
                    follow: true
                },
                category: {
                    index: true,
                    follow: true
                },
                blog: {
                    index: true,
                    follow: true
                },
                page: {
                    index: true,
                    follow: true
                },
                landingPage: {
                    index: true,
                    follow: true
                },
                account: {
                    index: false,
                    follow: false
                },
                cart: {
                    index: false,
                    follow: false
                },
                checkout: {
                    index: false,
                    follow: false
                },
                wishlist: {
                    index: false,
                    follow: false
                },
                compare: {
                    index: false,
                    follow: false
                },
                search: {
                    index: false,
                    follow: false
                }
            },
            customRules: ""
        },
        sitemap: {
            product: true,
            category: true,
            page: true,
            blogPost: true,
            landingPage: true
        },
        structuredData: {
            enableOrganization: true,
            enableProduct: true,
            enableArticle: true,
            enableBreadcrumb: true,
            organization: {
                legalName: "",
                logoUrl: "",
                email: "",
                phone: "",
                sameAs: []
            }
        },
        verification: {
            google: "",
            bing: "",
            other: ""
        }
    },
    theme: {
        background: "#ffffff",
        foreground: "#1a1a1a",
        brand: "#0f63b3",
        brandDark: "#133f9e",
        accent: "#f5b301",
        sale: "#e02020",
        maxWidth: 1440,
        font: {
            family: "Outfit",
            url: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
        },
        /*
     * The admin panel's typeface. Present so the mapper can repair the key like
     * any other, never read by this app — see `adminFont` in
     * src/types/store-settings.ts. Roboto rather than Outfit because that is
     * what the admin panel defaults to, and this constant must mirror the
     * backend's DEFAULT_THEME rather than invent a value of its own.
     */ adminFont: {
            family: "Roboto",
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap"
        }
    }
};
async function getStoreSettings() {
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/settings/public", {
            revalidate: SETTINGS_REVALIDATE_SECONDS,
            tags: [
                STORE_SETTINGS_CACHE_TAG
            ]
        });
        if (!data || typeof data !== "object") return FALLBACK_SETTINGS;
        return {
            ...FALLBACK_SETTINGS,
            ...data,
            /*
       * Backfilled individually because a spread would carry through an
       * explicit `null` or a missing key from an older API, and `formatPrice`
       * would then interpolate `undefined` into every price on the site.
       */ currencyPosition: data.currencyPosition ?? FALLBACK_SETTINGS.currencyPosition,
            currencyDecimals: typeof data.currencyDecimals === "number" ? data.currencyDecimals : FALLBACK_SETTINGS.currencyDecimals,
            /*
       * Repaired per key for the same reason, and it matters more here than it
       * looks: an API predating these fields sends nothing, and the spread
       * above would leave both modes `undefined`. `undefined` is not `"LOGO"`,
       * so the slot would render text either way — but an explicit `null` from
       * a cleared column would flow straight through into the height, and a
       * `null` height is interpolated into a style attribute. Backfilling both
       * keeps a partial payload renderable rather than merely lucky.
       */ headerBrandMode: data.headerBrandMode ?? FALLBACK_SETTINGS.headerBrandMode,
            footerBrandMode: data.footerBrandMode ?? FALLBACK_SETTINGS.footerBrandMode,
            /*
       * Backfilled so an API predating this field reads as `null` — "no icon
       * chosen" — rather than `undefined`. Both resolve to the shipped icon, but
       * the type says `string | null` and `undefined` would be a lie the rest of
       * the app is entitled to disbelieve.
       */ faviconUrl: data.faviconUrl ?? FALLBACK_SETTINGS.faviconUrl,
            headerLogoHeight: typeof data.headerLogoHeight === "number" ? data.headerLogoHeight : FALLBACK_SETTINGS.headerLogoHeight,
            footerLogoHeight: typeof data.footerLogoHeight === "number" ? data.footerLogoHeight : FALLBACK_SETTINGS.footerLogoHeight,
            contact: {
                ...FALLBACK_SETTINGS.contact,
                ...data.contact ?? {}
            },
            announcementBar: data.announcementBar ?? FALLBACK_SETTINGS.announcementBar,
            newsletter: data.newsletter ?? FALLBACK_SETTINGS.newsletter,
            /*
       * Backfilled per-field, not just per-block: an older API that predates one
       * of these keys, or a row missing a colour, must not leave checkout
       * without a field map or the layout interpolating `undefined` into a
       * style attribute.
       */ checkoutConfig: {
                ...FALLBACK_SETTINGS.checkoutConfig,
                ...data.checkoutConfig ?? {},
                fields: {
                    ...FALLBACK_SETTINGS.checkoutConfig.fields,
                    ...data.checkoutConfig?.fields ?? {}
                },
                delivery: {
                    ...FALLBACK_SETTINGS.checkoutConfig.delivery,
                    ...data.checkoutConfig?.delivery ?? {}
                }
            },
            /*
       * Per-key, like `checkoutConfig` above and for the same reason — an API
       * that predates one flag must report that flag as offered rather than as
       * `undefined`, which is falsy and would withdraw the feature by accident.
       * A whole-block `??` would do exactly that the day a fourth flag is added.
       */ catalogConfig: {
                ...FALLBACK_SETTINGS.catalogConfig,
                ...data.catalogConfig ?? {}
            },
            /*
       * Taken WHOLE, unlike every block around it — and only when it really is a
       * non-empty array.
       *
       * The per-key repair those use exists to fill in a key an older API never
       * sent. That has no analogue here: this value is an ordered array whose
       * order is the data, so there is no key to fill and merging two lists
       * positionally would invent an order neither side asked for. The backend
       * already reconciles the stored list against its own registry before
       * serving it, which is where a missing section is restored — doing it
       * again here would be a second, divergent implementation of the rule.
       *
       * The array check is what makes an API that predates this field degrade to
       * the full homepage instead of `undefined`, which would render nothing. It
       * is deliberately NOT `data.homeConfig ?? fallback`: an empty array is a
       * legitimate saved state ("every section off"), but it is indistinguishable
       * from an API that sent nothing meaningful — and since only a REACHABLE
       * backend can send the empty list, and a reachable backend always sends a
       * complete reconciled list, an empty array arriving here means the payload
       * is malformed rather than that the merchant chose a blank page. The
       * all-off homepage is served by a list of eleven disabled sections, which
       * passes this check untouched.
       */ homeConfig: Array.isArray(data.homeConfig) && data.homeConfig.length > 0 ? data.homeConfig : FALLBACK_SETTINGS.homeConfig,
            /*
       * Both fonts repaired per key, not just merged in whole.
       *
       * A theme stored before `adminFont` existed arrives without it, and a
       * `font` written by a hand-edited row can carry a family with no url. In
       * either case the nested spread fills the missing half from the fallback,
       * so a reader never has to defend against a half-written font. `adminFont`
       * is repaired despite this app never rendering it — it is carried through
       * to whoever does, and dropping it here would be an outage the admin could
       * not explain.
       */ theme: {
                ...FALLBACK_SETTINGS.theme,
                ...data.theme ?? {},
                font: {
                    ...FALLBACK_SETTINGS.theme.font,
                    ...data.theme?.font ?? {}
                },
                adminFont: {
                    ...FALLBACK_SETTINGS.theme.adminFont,
                    ...data.theme?.adminFont ?? {}
                }
            },
            /*
       * Repaired level by level, like `checkoutConfig` above — but three levels
       * deep rather than two. A single spread would swap a whole `robots` or
       * `structuredData` subtree for whatever the API sent, losing any key added
       * since that row was written. For an `index` flag that reads as
       * `undefined`, which is falsy, and drops a page from search by omission.
       *
       * `sameAs` is taken only when it really is an array, and NOT merged with
       * the fallback: an empty list is a merchant saying "no social profiles",
       * and unioning it with defaults would make that unexpressible.
       */ seoConfig: {
                ...FALLBACK_SETTINGS.seoConfig,
                ...data.seoConfig ?? {},
                robots: {
                    ...FALLBACK_SETTINGS.seoConfig.robots,
                    ...data.seoConfig?.robots ?? {},
                    groups: {
                        ...FALLBACK_SETTINGS.seoConfig.robots.groups,
                        ...data.seoConfig?.robots?.groups ?? {}
                    }
                },
                sitemap: {
                    ...FALLBACK_SETTINGS.seoConfig.sitemap,
                    ...data.seoConfig?.sitemap ?? {}
                },
                structuredData: {
                    ...FALLBACK_SETTINGS.seoConfig.structuredData,
                    ...data.seoConfig?.structuredData ?? {},
                    organization: {
                        ...FALLBACK_SETTINGS.seoConfig.structuredData.organization,
                        ...data.seoConfig?.structuredData?.organization ?? {},
                        sameAs: Array.isArray(data.seoConfig?.structuredData?.organization?.sameAs) ? data.seoConfig.structuredData.organization.sameAs : FALLBACK_SETTINGS.seoConfig.structuredData.organization.sameAs
                    }
                },
                verification: {
                    ...FALLBACK_SETTINGS.seoConfig.verification,
                    ...data.seoConfig?.verification ?? {}
                }
            },
            /*
       * Repaired per key, like every blob above. An API predating this field
       * reports nothing, and a missing `enabled` would read as `undefined` —
       * falsy, so nothing fires, which is the right outcome but reached by
       * accident. Saying `false` explicitly makes it the decision it is.
       */ facebookPixel: {
                ...FALLBACK_SETTINGS.facebookPixel,
                ...data.facebookPixel ?? {}
            },
            /*
       * Backfilled together and defensively. An older API that predates these
       * keys reports neither, and a spread would leave `siteMode` undefined —
       * which is falsy, so the root would render the homepage, but only by
       * accident. Saying WEBSITE explicitly makes that the decision it is.
       *
       * The pair is also cross-checked: LANDING_PAGE mode with no page to serve
       * is not a state the root can act on, so it degrades to WEBSITE rather
       * than redirecting to `/lp/undefined`.
       */ siteMode: data.siteMode === "LANDING_PAGE" && data.activeLandingPage?.slug ? "LANDING_PAGE" : "WEBSITE",
            activeLandingPage: data.activeLandingPage?.slug ? data.activeLandingPage : null,
            // Arrays are taken only when they really are arrays. An empty list is a
            // legitimate merchant choice ("no footer columns") and is preserved; a
            // malformed value falls back rather than reaching `.map()`.
            mainNav: Array.isArray(data.mainNav) ? data.mainNav : FALLBACK_SETTINGS.mainNav,
            footerColumns: Array.isArray(data.footerColumns) ? data.footerColumns : FALLBACK_SETTINGS.footerColumns,
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : FALLBACK_SETTINGS.socialLinks
        };
    } catch  {
        return FALLBACK_SETTINGS;
    }
}
function resolveAnnouncementLink(link, contact) {
    if (link.source === "contactPhone" && contact.phone) {
        return {
            label: contact.phone,
            href: `https://wa.me/${contact.phone.replace(/\D/g, "")}`
        };
    }
    if (link.source === "contactEmail" && contact.email) {
        return {
            label: contact.email,
            href: `mailto:${contact.email}`
        };
    }
    return {
        label: link.label,
        href: link.href
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/CompareHydrator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompareHydrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compare-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/hooks.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function CompareHydrator() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CompareHydrator.useEffect": ()=>{
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hydrateCompare"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readCompareSlugs"])()));
        }
    }["CompareHydrator.useEffect"], [
        dispatch
    ]);
    return null;
}
_s(CompareHydrator, "DKdeqxp2QYw2p6z8/ErYMRK/Ubo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"]
    ];
});
_c = CompareHydrator;
var _c;
__turbopack_context__.k.register(_c, "CompareHydrator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/StoreProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$CompareHydrator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/CompareHydrator.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function StoreProvider({ children, isSignedIn = false }) {
    _s();
    // Lazy initializer: runs exactly once per client, so the store survives
    // re-renders without being a module singleton (which the server would share
    // across requests, leaking one visitor's cart into another's render).
    //
    // The session flag is seeded at creation rather than dispatched on mount, so
    // no component ever observes a first render claiming "signed out" and fires
    // an authenticated request it should have skipped (or skips one it shouldn't).
    const [store] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StoreProvider.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeStore"])({
                isSignedIn
            })
    }["StoreProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: store,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$CompareHydrator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/store/StoreProvider.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/store/StoreProvider.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(StoreProvider, "yiCekgSnzdW1hGuctyyNYvc66kQ=");
_c = StoreProvider;
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/addressApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addressApi",
    ()=>addressApi,
    "useCreateAddressMutation",
    ()=>useCreateAddressMutation,
    "useDeleteAddressMutation",
    ()=>useDeleteAddressMutation,
    "useGetAddressesQuery",
    ()=>useGetAddressesQuery,
    "useSetDefaultAddressMutation",
    ()=>useSetDefaultAddressMutation,
    "useUpdateAddressMutation",
    ()=>useUpdateAddressMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$address$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/address.ts [app-client] (ecmascript)");
;
;
const addressApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "addressApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: "/api/addresses"
    }),
    tagTypes: [
        "Address"
    ],
    endpoints: (builder)=>({
            getAddresses: builder.query({
                query: ()=>"",
                transformResponse: (response)=>(Array.isArray(response?.data) ? response.data : []).map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$address$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toAddress"])// Default first, so a selector can take the head of the list.
                    .sort((a, b)=>Number(b.isDefault) - Number(a.isDefault)),
                providesTags: [
                    "Address"
                ]
            }),
            createAddress: builder.mutation({
                query: (body)=>({
                        url: "",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Address"
                ]
            }),
            updateAddress: builder.mutation({
                query: ({ addressId, body })=>({
                        url: `/${addressId}`,
                        method: "PATCH",
                        body
                    }),
                invalidatesTags: [
                    "Address"
                ]
            }),
            deleteAddress: builder.mutation({
                query: (addressId)=>({
                        url: `/${addressId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Address"
                ]
            }),
            setDefaultAddress: builder.mutation({
                query: (addressId)=>({
                        url: `/${addressId}/set-default`,
                        method: "PATCH"
                    }),
                invalidatesTags: [
                    "Address"
                ]
            })
        })
});
const { useGetAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation, useSetDefaultAddressMutation } = addressApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/cartApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_CART",
    ()=>EMPTY_CART,
    "cartApi",
    ()=>cartApi,
    "toCartSummary",
    ()=>toCartSummary,
    "useAddItemMutation",
    ()=>useAddItemMutation,
    "useApplyCouponMutation",
    ()=>useApplyCouponMutation,
    "useGetCartQuery",
    ()=>useGetCartQuery,
    "useRemoveCouponMutation",
    ()=>useRemoveCouponMutation,
    "useRemoveItemMutation",
    ()=>useRemoveItemMutation,
    "useUpdateItemQuantityMutation",
    ()=>useUpdateItemQuantityMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/placeholder.ts [app-client] (ecmascript)");
;
;
;
const EMPTY_CART = {
    id: null,
    lines: [],
    itemCount: 0,
    subtotal: 0,
    discountAmount: 0,
    total: 0
};
/**
 * Prices a line from `effectiveUnitPrice` — the server's figure, campaign
 * discount already applied.
 *
 * This used to price the line here, from the chosen variant's `offerPrice`
 * falling back to the product's. That is exactly the catalogue price a
 * campaign overrides, so the cart showed a subtotal higher than the order
 * charged. The fallback chain survives only for carts served by a backend that
 * predates the field; it is not the intended path.
 */ function toCartLine(item) {
    const unitPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(Number(item.effectiveUnitPrice ?? item.variant?.offerPrice ?? item.product?.offerPrice ?? 0));
    // Only when a campaign is actually cutting this line — otherwise there is
    // nothing to strike through and showing one would invent a saving.
    const listPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(Number(item.variant?.offerPrice ?? item.product?.offerPrice ?? 0));
    const compareAtPrice = item.campaignUnitPrice != null && listPrice > unitPrice ? listPrice : undefined;
    const primaryImage = item.variant?.image ?? [
        ...item.product?.images ?? []
    ].sort((a, b)=>Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)[0]?.url ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placeholderImage"])(item.product?.slug ?? item.productId);
    return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        name: item.product?.name ?? "Unavailable product",
        slug: item.product?.slug ?? "",
        variantName: item.variant?.name,
        image: primaryImage,
        unitPrice,
        compareAtPrice,
        lineTotal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(unitPrice * item.quantity),
        stockQuantity: item.variant?.stockQuantity ?? item.product?.stockQuantity ?? 0
    };
}
function toCartSummary(cart) {
    if (!cart) return EMPTY_CART;
    const lines = (cart.items ?? []).map(toCartLine);
    const subtotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(lines.reduce((sum, l)=>sum + l.lineTotal, 0));
    const discountAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(Number(cart.discount?.amount ?? 0));
    return {
        id: cart.id,
        lines,
        itemCount: lines.reduce((sum, l)=>sum + l.quantity, 0),
        subtotal,
        discountCode: cart.discount?.code,
        discountAmount,
        // Never let a discount drive the total below zero.
        total: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(Math.max(0, subtotal - discountAmount))
    };
}
/**
 * Writes a mutation's own response into the `getCart` cache.
 *
 * Every cart mutation already returns the complete post-mutation cart —
 * items *and* the re-validated discount — so invalidating the `Cart` tag
 * would throw that away and pay for a second `GET /cart` to learn what we
 * were just told. Seeding instead makes a cart change cost one roundtrip.
 *
 * Rethrows on failure so each caller can run its own revert.
 */ async function seedCartFromResponse(queryFulfilled, dispatch) {
    const { data } = await queryFulfilled;
    const summary = toCartSummary(data?.data);
    // Upsert rather than update: `updateQueryData` only writes into an entry that
    // already holds data, so when `GET /cart` had failed it wrote nothing at all
    // and a successful add never reached the badge. Upsert fills the entry
    // whatever state it is in, and clears the read's error along with it.
    await dispatch(cartApi.util.upsertQueryData("getCart", undefined, summary));
}
/**
 * Wraps an optimistic recipe so it only runs against a cart.
 *
 * `updateQueryData` does not always hand a recipe a draft: when the cached
 * value is not draftable it passes `data` itself and takes the return as the
 * new value. The recipes below all read the cart they are patching, so anything
 * other than an object reaches them as `draft.itemCount` on nothing — and
 * because `dispatch` runs the recipe *synchronously*, that throws before the
 * caller's `try`, skipping the revert and leaving the rejection unhandled.
 *
 * Skipping the patch is the right fallback anyway: a mutation that succeeds
 * reseeds the whole cart from its own response, so the UI lands on the server's
 * figures either way — a guess is only worth making when there is something on
 * screen to correct.
 */ function onCachedCart(recipe) {
    return (draft)=>{
        if (!draft) return;
        recipe(draft);
    };
}
const cartApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "cartApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: "/api/cart"
    }),
    tagTypes: [
        "Cart"
    ],
    endpoints: (builder)=>({
            getCart: builder.query({
                query: ()=>"",
                transformResponse: (response)=>toCartSummary(response?.data),
                providesTags: [
                    "Cart"
                ]
            }),
            addItem: builder.mutation({
                query: (body)=>({
                        url: "/items",
                        method: "POST",
                        body
                    }),
                // The item count is what a shopper watches for feedback after clicking
                // Add, so bump it immediately; money stays server-derived (design D6).
                async onQueryStarted ({ quantity = 1 }, { dispatch, queryFulfilled }) {
                    const patch = dispatch(cartApi.util.updateQueryData("getCart", undefined, onCachedCart((draft)=>{
                        draft.itemCount += quantity;
                    })));
                    try {
                        await seedCartFromResponse(queryFulfilled, dispatch);
                    } catch  {
                        patch.undo();
                    }
                }
            }),
            updateItemQuantity: builder.mutation({
                query: ({ itemId, quantity })=>({
                        url: `/items/${itemId}`,
                        method: "PATCH",
                        body: {
                            quantity
                        }
                    }),
                async onQueryStarted (_arg, { dispatch, queryFulfilled }) {
                    await seedCartFromResponse(queryFulfilled, dispatch).catch(()=>{
                    // The stepper owns the revert — it holds the last confirmed quantity.
                    });
                }
            }),
            removeItem: builder.mutation({
                query: (itemId)=>({
                        url: `/items/${itemId}`,
                        method: "DELETE"
                    }),
                // Optimistically drop the line so the row disappears on click, then let
                // the response reseed. Reverts if the server refuses.
                async onQueryStarted (itemId, { dispatch, queryFulfilled }) {
                    const patch = dispatch(cartApi.util.updateQueryData("getCart", undefined, onCachedCart((draft)=>{
                        const line = draft.lines.find((l)=>l.id === itemId);
                        if (!line) return;
                        draft.lines = draft.lines.filter((l)=>l.id !== itemId);
                        draft.itemCount -= line.quantity;
                        draft.subtotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(draft.subtotal - line.lineTotal);
                        draft.total = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(Math.max(0, draft.subtotal - draft.discountAmount));
                    })));
                    try {
                        await seedCartFromResponse(queryFulfilled, dispatch);
                    } catch  {
                        patch.undo();
                    }
                }
            }),
            applyCoupon: builder.mutation({
                query: (code)=>({
                        url: "/coupon",
                        method: "POST",
                        body: {
                            code
                        }
                    }),
                invalidatesTags: [
                    "Cart"
                ]
            }),
            removeCoupon: builder.mutation({
                query: ()=>({
                        url: "/coupon",
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Cart"
                ]
            })
        })
});
const { useGetCartQuery, useAddItemMutation, useUpdateItemQuantityMutation, useRemoveItemMutation, useApplyCouponMutation, useRemoveCouponMutation } = cartApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/compareMiddleware.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareListenerMiddleware",
    ()=>compareListenerMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compare-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
;
;
;
const compareListenerMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createListenerMiddleware"])();
compareListenerMiddleware.startListening({
    matcher: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isAnyOf"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToCompare"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromCompare"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearCompare"]),
    effect: (_action, listenerApi)=>{
        const { slugs } = listenerApi.getState().compare;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeCompareSlugs"])(slugs);
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/compareSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToCompare",
    ()=>addToCompare,
    "clearCompare",
    ()=>clearCompare,
    "default",
    ()=>__TURBOPACK__default__export__,
    "hydrateCompare",
    ()=>hydrateCompare,
    "removeFromCompare",
    ()=>removeFromCompare,
    "selectCompareCount",
    ()=>selectCompareCount,
    "selectCompareSlugs",
    ()=>selectCompareSlugs,
    "selectIsCompareFull",
    ()=>selectIsCompareFull,
    "selectIsCompareHydrated",
    ()=>selectIsCompareHydrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compare-storage.ts [app-client] (ecmascript)");
;
;
const initialState = {
    slugs: [],
    isHydrated: false
};
const compareSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "compare",
    initialState,
    reducers: {
        /**
     * Adding past the limit is a no-op rather than a silent eviction. Enforcing
     * it here rather than at the call sites means no control can bypass it, and
     * "the list is unchanged, with no product silently dropped" holds by
     * construction. Callers detect the refusal by the count not moving.
     */ addToCompare: (state, action)=>{
            const slug = action.payload;
            if (state.slugs.includes(slug)) return;
            if (state.slugs.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPARE_LIMIT"]) return;
            state.slugs.push(slug);
        },
        removeFromCompare: (state, action)=>{
            state.slugs = state.slugs.filter((slug)=>slug !== action.payload);
        },
        clearCompare: (state)=>{
            state.slugs = [];
        },
        /**
     * Seeds the list from storage after mount and marks the state trustworthy.
     * Dispatched even when nothing was stored — the flag, not the slugs, is what
     * releases the controls from their neutral state.
     */ hydrateCompare: (state, action)=>{
            state.slugs = action.payload.slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPARE_LIMIT"]);
            state.isHydrated = true;
        }
    }
});
const { addToCompare, removeFromCompare, clearCompare, hydrateCompare } = compareSlice.actions;
const selectCompareSlugs = (state)=>state.compare.slugs;
const selectCompareCount = (state)=>state.compare.slugs.length;
const selectIsCompareHydrated = (state)=>state.compare.isHydrated;
const selectIsCompareFull = (state)=>state.compare.slugs.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compare$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPARE_LIMIT"];
const __TURBOPACK__default__export__ = compareSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
;
const useAppDispatch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"].withTypes();
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"].withTypes();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$addressApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/addressApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$orderApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/orderApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/reviewApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wishlistApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareMiddleware$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/compareMiddleware.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/uiSlice.ts [app-client] (ecmascript)");
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
function makeStore({ isSignedIn = false } = {}) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        preloadedState: {
            ui: {
                isCartOpen: false,
                isSignedIn
            }
        },
        reducer: {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$addressApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addressApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$addressApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addressApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$orderApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$orderApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reviewApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reviewApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wishlistApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wishlistApi"].reducer,
            compare: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            ui: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        },
        // The compare list starts empty and is never preloaded: `preloadedState` is
        // computed on the server, where `localStorage` does not exist. It is seeded
        // after mount instead — see `CompareHydrator`.
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware().prepend(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$compareMiddleware$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareListenerMiddleware"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].middleware, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$addressApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addressApi"].middleware, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$orderApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderApi"].middleware, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].middleware, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$reviewApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reviewApi"].middleware, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wishlistApi"].middleware)
    });
    // Enables refetchOnFocus / refetchOnReconnect behaviour.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupListeners"])(store.dispatch);
    return store;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/orderApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orderApi",
    ()=>orderApi,
    "usePlaceOrderMutation",
    ()=>usePlaceOrderMutation,
    "useQuoteCheckoutQuery",
    ()=>useQuoteCheckoutQuery,
    "useTrackOrderMutation",
    ()=>useTrackOrderMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
;
;
const orderApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "orderApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: "/api/orders"
    }),
    tagTypes: [
        "CheckoutQuote"
    ],
    endpoints: (builder)=>({
            placeOrder: builder.mutation({
                query: (payload)=>{
                    // `mode` is the client-side discriminant keeping the two payload shapes
                    // apart. The backend infers the flow from the session, so it is dropped
                    // here rather than sent as a field the API does not expect.
                    const { idempotencyKey, ...rest } = payload;
                    const body = {
                        ...rest
                    };
                    delete body.mode;
                    return {
                        url: "",
                        method: "POST",
                        body,
                        // Lets the server absorb a retry instead of placing a second order.
                        headers: {
                            "Idempotency-Key": idempotencyKey
                        }
                    };
                },
                async onQueryStarted (arg, { dispatch, queryFulfilled }) {
                    // A direct product order carries its own lines and never touches the
                    // cart — the backend skips clearing it, so emptying the cache here
                    // would wrongly wipe a cart the shopper is still filling.
                    const consumedCart = !(arg.mode === "guest" && arg.items?.length);
                    try {
                        await queryFulfilled;
                        // The order committed, so the cart is empty — no need to ask.
                        if (consumedCart) {
                            dispatch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].util.updateQueryData("getCart", undefined, ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_CART"]));
                        }
                    } catch (error) {
                        // Outcome unknown: the order may have committed and emptied the cart,
                        // so refetch rather than keep rendering a cart that no longer exists.
                        const err = error;
                        if (err?.error?.status === 504 && consumedCart) {
                            dispatch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].util.invalidateTags([
                                "Cart"
                            ]));
                        }
                    // Any other failure — the cart still holds everything it did before.
                    }
                }
            }),
            /**
     * Guest order tracking. A mutation rather than a query because it is a POST
     * carrying a phone number (see the proxy route), and because it is driven
     * by a form submission rather than by rendering.
     */ trackOrder: builder.mutation({
                query: (body)=>({
                        url: "/track",
                        method: "POST",
                        body
                    })
            }),
            /**
     * What this basket costs to a given destination, without placing anything.
     *
     * A query rather than a mutation despite being a POST: it commits nothing,
     * and it is driven by rendering — the destination changes as the shopper
     * types their address, and the cost has to follow. POST only because the
     * request carries a body.
     *
     * Necessary because shipping is no longer a flat price the storefront can
     * add up itself: it depends on each product's rule and on where the order
     * is going, and so does tax. Without asking the server, checkout would show
     * one number and charge another — or let the shopper reach Place Order
     * before learning nobody delivers to their address.
     */ quoteCheckout: builder.query({
                query: (body)=>({
                        url: "/quote",
                        method: "POST",
                        body
                    }),
                // The quote is a function of the cart as much as of the address, so a
                // cart change has to invalidate it.
                providesTags: [
                    "CheckoutQuote"
                ]
            })
        })
});
const { usePlaceOrderMutation, useTrackOrderMutation, useQuoteCheckoutQuery } = orderApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/productApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productApi",
    ()=>productApi,
    "useGetProductBySlugQuery",
    ()=>useGetProductBySlugQuery,
    "useSearchProductsQuery",
    ()=>useSearchProductsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/placeholder.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/product.ts [app-client] (ecmascript)");
;
;
;
;
/**
 * Client-side product reads.
 *
 * Unlike the cart, this talks to the backend directly rather than through a
 * same-origin proxy: `GET /products/:slug` is public and cookie-free, so the
 * proxy hop the cart needs (for its httpOnly cookies) would buy nothing here.
 *
 * Listing endpoints omit variants entirely, so anything that needs a product's
 * real choices — the quick view — has to fetch the product by slug.
 */ /**
 * A browsing session's worth. Reopening the same quick view should not refetch,
 * and a product's price and variants do not move on a timescale that would make
 * a cached entry misleading within one visit.
 */ const PRODUCT_CACHE_SECONDS = 300;
const productApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "productApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]
    }),
    keepUnusedDataFor: PRODUCT_CACHE_SECONDS,
    endpoints: (builder)=>({
            /**
     * Cache entries are keyed by slug, so a response that arrives after the
     * shopper has moved on lands in its own entry — a later quick view can
     * never be shown a previous product's details.
     */ getProductBySlug: builder.query({
                query: (slug)=>`/products/${slug}`,
                transformResponse: (response)=>{
                    if (!response.data) throw new Error("Product not found");
                    // The same mapper the server uses, so a client-fetched product is
                    // identical to a server-fetched one — same price parsing, same image
                    // fallback, same campaign-price handling.
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toProduct"])(response.data);
                }
            }),
            /**
     * Typeahead suggestions for the search box.
     *
     * Kept separate from `getProducts` because the endpoint returns a slim
     * projection, not full products — see `ApiSearchSuggestion`. The full
     * results page still goes through `/products?q=`, so this is only ever the
     * dropdown, and a shopper who submits gets the complete, filterable listing.
     */ searchProducts: builder.query({
                query: (term)=>`/products/search?q=${encodeURIComponent(term)}`,
                transformResponse: (response)=>(Array.isArray(response.data) ? response.data : []).map((item)=>({
                            id: item.id,
                            name: item.name,
                            slug: item.slug,
                            // Same decimal-string-to-number parse the product mapper does, so the
                            // dropdown never formats a string as though it were a number.
                            offerPrice: Number(item.offerPrice) || 0,
                            image: item.image ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placeholderImage"])(item.slug, {
                                label: item.name
                            }),
                            brand: item.brandName ?? undefined
                        }))
            })
        })
});
const { useGetProductBySlugQuery, useSearchProductsQuery } = productApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/reviewApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reviewApi",
    ()=>reviewApi,
    "useCreateReviewMutation",
    ()=>useCreateReviewMutation,
    "useDeleteMyReviewMutation",
    ()=>useDeleteMyReviewMutation,
    "useGetMyReviewsQuery",
    ()=>useGetMyReviewsQuery,
    "useGetProductReviewsQuery",
    ()=>useGetProductReviewsQuery,
    "useUpdateMyReviewMutation",
    ()=>useUpdateMyReviewMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/review.ts [app-client] (ecmascript)");
;
;
;
/**
 * Reviews, split by audience rather than by convenience.
 *
 * The public product-review list is cookie-free, so it is fetched straight from
 * the backend (`API_BASE_URL`) exactly like `productApi`. Everything
 * authenticated — submitting, editing, withdrawing, and the customer's own list
 * — goes through `/api/reviews/*`, because those carry the session cookie the
 * browser cannot send cross-site.
 *
 * `fetchBaseQuery` takes one baseUrl, so the authenticated endpoints give an
 * absolute same-origin path and the public one an absolute backend URL.
 */ const EMPTY_META = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 0
};
const reviewApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "reviewApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: ""
    }),
    tagTypes: [
        "Review",
        "MyReviews"
    ],
    endpoints: (builder)=>({
            /** Public: pages beyond the first, which the server rendered. */ getProductReviews: builder.query({
                query: ({ productId, page = 1, limit = 5 })=>`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/products/${productId}/reviews?page=${page}&limit=${limit}`,
                transformResponse: (response)=>{
                    const data = Array.isArray(response?.data) ? response.data : [];
                    const meta = response.meta;
                    return {
                        reviews: data.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toReview"]),
                        breakdown: meta?.ratingBreakdown ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toRatingBreakdown"])(meta.ratingBreakdown) : null,
                        meta: meta ?? {
                            ...EMPTY_META,
                            total: data.length
                        }
                    };
                },
                providesTags: [
                    "Review"
                ]
            }),
            /** The caller's own reviews, across every status. */ getMyReviews: builder.query({
                query: ()=>"/api/reviews/me?limit=50",
                transformResponse: (response)=>{
                    const data = Array.isArray(response?.data) ? response.data : [];
                    return {
                        reviews: data.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$review$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toReview"]),
                        meta: response.meta ?? EMPTY_META
                    };
                },
                providesTags: [
                    "MyReviews"
                ]
            }),
            createReview: builder.mutation({
                query: (body)=>({
                        url: "/api/reviews",
                        method: "POST",
                        body
                    }),
                // A new review is PENDING, so the public list does not change yet — but
                // the author's own list does, and so does their eligibility to submit.
                invalidatesTags: [
                    "MyReviews"
                ]
            }),
            updateMyReview: builder.mutation({
                query: ({ id, body })=>({
                        url: `/api/reviews/me/${id}`,
                        method: "PATCH",
                        body
                    }),
                // Editing an approved review returns it to PENDING, so it leaves the
                // public list too — both caches are stale.
                invalidatesTags: [
                    "MyReviews",
                    "Review"
                ]
            }),
            deleteMyReview: builder.mutation({
                query: (id)=>({
                        url: `/api/reviews/me/${id}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "MyReviews",
                    "Review"
                ]
            })
        })
});
const { useGetProductReviewsQuery, useGetMyReviewsQuery, useCreateReviewMutation, useUpdateMyReviewMutation, useDeleteMyReviewMutation } = reviewApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/uiSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeCart",
    ()=>closeCart,
    "default",
    ()=>__TURBOPACK__default__export__,
    "openCart",
    ()=>openCart,
    "selectIsCartOpen",
    ()=>selectIsCartOpen,
    "selectIsSignedIn",
    ()=>selectIsSignedIn,
    "setSignedIn",
    ()=>setSignedIn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    isCartOpen: false,
    isSignedIn: false
};
const uiSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "ui",
    initialState,
    reducers: {
        openCart: (state)=>{
            state.isCartOpen = true;
        },
        closeCart: (state)=>{
            state.isCartOpen = false;
        },
        setSignedIn: (state, action)=>{
            state.isSignedIn = action.payload;
        }
    }
});
const { openCart, closeCart, setSignedIn } = uiSlice.actions;
const selectIsCartOpen = (state)=>state.ui.isCartOpen;
const selectIsSignedIn = (state)=>state.ui.isSignedIn;
const __TURBOPACK__default__export__ = uiSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/wishlistApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WISHLIST_PAGE_SIZE",
    ()=>WISHLIST_PAGE_SIZE,
    "useAddWishlistItemMutation",
    ()=>useAddWishlistItemMutation,
    "useGetWishlistContainsQuery",
    ()=>useGetWishlistContainsQuery,
    "useGetWishlistCountQuery",
    ()=>useGetWishlistCountQuery,
    "useGetWishlistQuery",
    ()=>useGetWishlistQuery,
    "useMoveWishlistItemToCartMutation",
    ()=>useMoveWishlistItemToCartMutation,
    "useRemoveWishlistItemByProductMutation",
    ()=>useRemoveWishlistItemByProductMutation,
    "useRemoveWishlistItemMutation",
    ()=>useRemoveWishlistItemMutation,
    "wishlistApi",
    ()=>wishlistApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/wishlist.ts [app-client] (ecmascript)");
;
;
;
const WISHLIST_PAGE_SIZE = 12;
const EMPTY_META = {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 0
};
const wishlistApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "wishlistApi",
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: "/api/wishlist"
    }),
    tagTypes: [
        "Wishlist"
    ],
    endpoints: (builder)=>({
            getWishlist: builder.query({
                query: (args)=>{
                    const { page = 1, limit = WISHLIST_PAGE_SIZE } = args ?? {};
                    return `?page=${page}&limit=${limit}`;
                },
                // `data` is the wishlist itself (`{ id, customerId, items }`), not a bare
                // array of items — unlike most list endpoints on this API.
                transformResponse: (response)=>{
                    const items = Array.isArray(response?.data?.items) ? response.data.items : [];
                    return {
                        items: items.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toWishlistItem"]),
                        meta: response.meta ?? {
                            ...EMPTY_META,
                            total: items.length
                        }
                    };
                },
                providesTags: [
                    "Wishlist"
                ]
            }),
            getWishlistCount: builder.query({
                query: ()=>"/count",
                transformResponse: (response)=>response?.data?.count ?? 0,
                providesTags: [
                    "Wishlist"
                ]
            }),
            /**
     * Single-product check for the detail page, where the full list may not be
     * loaded. Listings deliberately do not use this — see `useWishlistProductIds`.
     */ getWishlistContains: builder.query({
                query: (productId)=>`/contains/${productId}`,
                transformResponse: (response)=>response?.data ?? {
                        inWishlist: false,
                        itemId: null
                    },
                providesTags: [
                    "Wishlist"
                ]
            }),
            addWishlistItem: builder.mutation({
                query: (productId)=>({
                        url: "/items",
                        method: "POST",
                        body: {
                            productId
                        }
                    }),
                invalidatesTags: [
                    "Wishlist"
                ]
            }),
            removeWishlistItem: builder.mutation({
                query: (itemId)=>({
                        url: `/items/${itemId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Wishlist"
                ]
            }),
            /** What a heart toggle uses — it knows the product, not the wishlist row. */ removeWishlistItemByProduct: builder.mutation({
                query: (productId)=>({
                        url: `/items/product/${productId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Wishlist"
                ]
            }),
            moveWishlistItemToCart: builder.mutation({
                query: (itemId)=>({
                        url: `/items/${itemId}/move-to-cart`,
                        method: "POST"
                    }),
                invalidatesTags: [
                    "Wishlist"
                ],
                async onQueryStarted (_itemId, { dispatch, queryFulfilled }) {
                    try {
                        await queryFulfilled;
                        // The endpoint mutates the cart as well as the wishlist, and a tag in
                        // another API slice cannot be invalidated declaratively — without this
                        // the header cart badge lags behind the move.
                        dispatch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartApi"].util.invalidateTags([
                            "Cart"
                        ]));
                    } catch  {
                    // Nothing moved, so the cart is unchanged and needs no refetch.
                    }
                }
            })
        })
});
const { useGetWishlistQuery, useGetWishlistCountQuery, useGetWishlistContainsQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation, useRemoveWishlistItemByProductMutation, useMoveWishlistItemToCartMutation } = wishlistApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/address.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Delivery address types mirroring the backend's `/customers/me/addresses`
 * endpoints (electrode-server: src/app/module/customer).
 */ __turbopack_context__.s([
    "formatAddress",
    ()=>formatAddress,
    "toAddress",
    ()=>toAddress
]);
function toAddress(address) {
    return {
        id: address.id,
        type: address.type,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? undefined,
        city: address.city,
        state: address.state ?? undefined,
        postalCode: address.postalCode ?? undefined,
        country: address.country ?? undefined,
        isDefault: address.isDefault
    };
}
function formatAddress(address) {
    return [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.postalCode,
        address.country
    ].filter(Boolean).join(", ");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/review.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Product reviews, in the same two-layer shape as `types/product.ts`:
 * `Api*` is the wire format, the unprefixed type is what components render.
 */ __turbopack_context__.s([
    "COMMENT_MAX",
    ()=>COMMENT_MAX,
    "RATING_MAX",
    ()=>RATING_MAX,
    "RATING_MIN",
    ()=>RATING_MIN,
    "TITLE_MAX",
    ()=>TITLE_MAX,
    "toRatingBreakdown",
    ()=>toRatingBreakdown,
    "toReview",
    ()=>toReview
]);
const RATING_MIN = 1;
const RATING_MAX = 5;
const TITLE_MAX = 150;
const COMMENT_MAX = 2000;
function displayName(customer) {
    const full = [
        customer?.firstName,
        customer?.lastName
    ].filter(Boolean).join(" ").trim();
    // A review must never render without attribution, so fall back rather than
    // showing an empty byline.
    return full.length > 0 ? full : "Verified buyer";
}
function toReview(review) {
    return {
        id: review.id,
        productId: review.productId,
        rating: review.rating,
        title: review.title ?? undefined,
        comment: review.comment ?? undefined,
        status: review.status,
        adminReply: review.adminReply ?? undefined,
        createdAt: review.createdAt,
        authorName: displayName(review.customer),
        authorAvatar: review.customer?.avatar ?? undefined,
        product: review.product
    };
}
function toRatingBreakdown(breakdown) {
    return {
        average: breakdown.average,
        total: breakdown.total,
        counts: [
            5,
            4,
            3,
            2,
            1
        ].map((rating)=>({
                rating,
                count: breakdown.counts?.[String(rating)] ?? 0
            }))
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/wishlist.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toWishlistItem",
    ()=>toWishlistItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/placeholder.ts [app-client] (ecmascript)");
;
function toWishlistItem(item) {
    const product = item.product;
    const price = Number(product?.price);
    const reviewCount = product?.reviewCount ?? 0;
    const average = Number(product?.averageRating);
    const primaryImage = [
        ...product?.images ?? []
    ].sort((a, b)=>Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)[0]?.url;
    return {
        id: item.id,
        productId: item.productId,
        name: product?.name ?? "Unavailable product",
        slug: product?.slug ?? "",
        price: Number.isFinite(price) ? price : 0,
        image: primaryImage ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placeholder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placeholderImage"])(product?.slug ?? item.productId),
        rating: reviewCount > 0 && Number.isFinite(average) ? average : undefined,
        reviewCount,
        isPurchasable: product?.status === "ACTIVE"
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0x9sbq4._.js.map