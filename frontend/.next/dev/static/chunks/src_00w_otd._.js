(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/home/DealOfWeek.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DealOfWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$CountdownTimer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/CountdownTimer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DealOfWeek({ campaign }) {
    _s();
    const [expired, setExpired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DealOfWeek.useEffect": ()=>{
            if (campaign.endsAt === null) return;
            const check = {
                "DealOfWeek.useEffect.check": ()=>setExpired(Date.now() >= campaign.endsAt)
            }["DealOfWeek.useEffect.check"];
            check();
            const id = setInterval(check, 1000);
            return ({
                "DealOfWeek.useEffect": ()=>clearInterval(id)
            })["DealOfWeek.useEffect"];
        }
    }["DealOfWeek.useEffect"], [
        campaign.endsAt
    ]);
    if (expired || campaign.products.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "container-px sm:container-px site-container py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-6 lg:grid-cols-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col justify-center rounded-xl bg-[#eef1fb] p-6 lg:col-span-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 inline-block w-fit rounded bg-sale px-3 py-1 text-xs font-bold text-white",
                            children: campaign.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/home/DealOfWeek.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        campaign.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-4 text-sm text-gray-600",
                            children: campaign.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/home/DealOfWeek.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this) : null,
                        campaign.endsAt !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$CountdownTimer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    endsAt: campaign.endsAt
                                }, void 0, false, {
                                    fileName: "[project]/src/components/home/DealOfWeek.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 mt-2 text-xs text-gray-500",
                                    children: "Remains until the end of the offer"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/home/DealOfWeek.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/home/DealOfWeek.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/products",
                            className: "rounded bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark",
                            children: "Shop Now"
                        }, void 0, false, {
                            fileName: "[project]/src/components/home/DealOfWeek.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/home/DealOfWeek.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-5 lg:col-span-5",
                    children: campaign.products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            product: product
                        }, product.id, false, {
                            fileName: "[project]/src/components/home/DealOfWeek.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/home/DealOfWeek.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/home/DealOfWeek.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/home/DealOfWeek.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(DealOfWeek, "d+k/OjNiq07rozc66df7FQRrDxQ=");
_c = DealOfWeek;
var _c;
__turbopack_context__.k.register(_c, "DealOfWeek");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/home/HeroSlider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [app-client] (ecmascript)");
// import required modules
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/pagination.mjs [app-client] (ecmascript) <export default as Pagination>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/navigation.mjs [app-client] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/autoplay.mjs [app-client] (ecmascript) <export default as Autoplay>");
"use client";
;
;
;
;
;
;
;
;
function HeroSlider({ slides }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Swiper"], {
        pagination: {
            dynamicBullets: true
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        // Looping a single slide clones it for no benefit, and Swiper warns.
        loop: slides.length > 1,
        modules: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__["Pagination"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__["Autoplay"]
        ],
        className: "h-full w-full",
        children: slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: slide.href,
                    className: "relative block h-full w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: slide.image,
                        alt: slide.title,
                        fill: true,
                        /*
               * Cover, not contain. The slot's ratio is fixed and the admin
               * tells a merchant what it is before they upload, so a correctly
               * cut banner is not cropped at all — and artwork that is slightly
               * off loses a sliver of its edge instead of sitting inside the
               * empty bands `contain` would leave.
               */ className: "object-cover",
                        // Stacked, the slider is the viewport's width; beside the 43%
                        // side column it is a little over half of it.
                        sizes: "(min-width: 1024px) 57vw, 100vw",
                        // Only the first slide is above the fold; preloading the rest
                        // would compete with it for bandwidth.
                        priority: index === 0
                    }, void 0, false, {
                        fileName: "[project]/src/components/home/HeroSlider.tsx",
                        lineNumber: 41,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/home/HeroSlider.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, this)
            }, slide.id, false, {
                fileName: "[project]/src/components/home/HeroSlider.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/home/HeroSlider.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = HeroSlider;
var _c;
__turbopack_context__.k.register(_c, "HeroSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/NewsletterForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsletterForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function NewsletterForm({ placeholder, buttonLabel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: (e)=>e.preventDefault(),
        className: "flex w-full max-w-md gap-0 md:w-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "email",
                placeholder: placeholder || "Email",
                "aria-label": "Email address",
                className: "w-full rounded-l border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/NewsletterForm.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "whitespace-nowrap rounded-r bg-accent px-5 py-3 text-sm font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark",
                children: buttonLabel || "Subscribe"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/NewsletterForm.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/NewsletterForm.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = NewsletterForm;
var _c;
__turbopack_context__.k.register(_c, "NewsletterForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/components/ui/CountdownTimer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountdownTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function getRemaining(target) {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(diff / (1000 * 60) % 60);
    const seconds = Math.floor(diff / 1000 % 60);
    return {
        days,
        hours,
        minutes,
        seconds,
        expired: diff === 0
    };
}
const UNIT_LABELS = [
    "Days",
    "Hour",
    "Min",
    "Sec"
];
function CountdownTimer({ endsAt }) {
    _s();
    // Null until the first tick. The server cannot know the client's clock, so
    // rendering a real remaining time during render would differ from the first
    // client render and trip a hydration mismatch — which the old version did. A
    // placeholder renders identically on both passes.
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountdownTimer.useEffect": ()=>{
            // Scheduled rather than called synchronously here: a setState in the effect
            // body runs a second render pass before paint on every mount.
            const tick = {
                "CountdownTimer.useEffect.tick": ()=>setTime(getRemaining(endsAt))
            }["CountdownTimer.useEffect.tick"];
            const id = setInterval(tick, 1000);
            const first = requestAnimationFrame(tick);
            return ({
                "CountdownTimer.useEffect": ()=>{
                    clearInterval(id);
                    cancelAnimationFrame(first);
                }
            })["CountdownTimer.useEffect"];
        }
    }["CountdownTimer.useEffect"], [
        endsAt
    ]);
    if (time?.expired) return null;
    const values = time ? [
        time.days,
        time.hours,
        time.minutes,
        time.seconds
    ] : [
        null,
        null,
        null,
        null
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2",
        children: UNIT_LABELS.map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm font-semibold",
                        children: values[i] === null ? "--" : String(values[i]).padStart(2, "0")
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/CountdownTimer.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-1 text-[10px] text-gray-500",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/CountdownTimer.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, label, true, {
                fileName: "[project]/src/components/ui/CountdownTimer.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/CountdownTimer.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(CountdownTimer, "t5SmOhh13g3g0U8h9STA+7f4x44=");
_c = CountdownTimer;
var _c;
__turbopack_context__.k.register(_c, "CountdownTimer");
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
]);

//# sourceMappingURL=src_00w_otd._.js.map