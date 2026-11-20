(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosplayRule34 = exports.CosplayRule34Info = void 0;
const types_1 = require("@paperback/types");
const BASE_URL = 'https://cosplayrule34.com';
const LOAD_MORE_PHOTOS_URL = `${BASE_URL}/cms/load-more-photos.php`;
const PHOTO_BATCH_LIMIT = 100;
const CATEGORY_TAGS = [
    { id: 'top', label: 'Top', path: '/top' },
    { id: 'category:cosplay', label: 'Cosplay', path: '/category/cosplay' },
    { id: 'category:asian', label: 'Asian', path: '/category/asian' },
    { id: 'category:thots', label: 'Onlyfans', path: '/category/thots' },
    { id: 'category:tiktok', label: 'TikTok', path: '/category/tiktok' },
    { id: 'category:art', label: 'Art', path: '/category/art' },
    { id: 'category:celebs', label: 'Celebs', path: '/category/celebs' },
    { id: 'category:erotic', label: 'Erotic', path: '/category/erotic' },
    { id: 'category:tattoo', label: 'Tattoo', path: '/category/tattoo' },
    { id: 'category:dark', label: 'Dark', path: '/category/dark' },
    { id: 'category:fitness', label: 'Fitness', path: '/category/fitness' },
    { id: 'category:porno', label: 'Porno', path: '/category/porno' },
    { id: 'category:amateur', label: 'Amateur', path: '/category/amateur' },
];
const HOME_SECTIONS = [
    { id: 'latest', title: 'Latest', path: '/' },
    { id: 'top', title: 'Top', path: '/top' },
    { id: 'cosplay', title: 'Cosplay', path: '/category/cosplay' },
    { id: 'art', title: 'Art', path: '/category/art' },
    { id: 'onlyfans', title: 'Onlyfans', path: '/category/thots' },
];
const normalizeUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed)
        return '';
    if (trimmed.startsWith('//'))
        return `https:${trimmed}`;
    if (trimmed.startsWith('/'))
        return `${BASE_URL}${trimmed}`;
    return trimmed;
};
const extractBackgroundImageUrl = (style) => {
    const match = /background-image\s*:\s*url\((?:['"])?([^'")]+)(?:['"])?\)/i.exec(style);
    return normalizeUrl(match?.[1] ?? '');
};
const parsePostId = (value) => {
    const match = /\/post\/(\d+)/i.exec(value);
    if (match?.[1])
        return match[1];
    if (/^\d+$/.test(value.trim()))
        return value.trim();
    throw new Error(`Invalid CosplayRule34 post ID: ${value}`);
};
const parseScriptNumber = (html, name, fallback) => {
    const match = new RegExp(`(?:let|const|var)\\s+${name}\\s*=\\s*(-?\\d+)`, 'i').exec(html);
    if (!match?.[1])
        return fallback;
    const parsed = Number.parseInt(match[1], 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};
const parseScriptString = (html, name) => {
    const match = new RegExp(`(?:let|const|var)\\s+${name}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'i').exec(html);
    if (!match?.[1])
        return '';
    return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
};
const parsePostScriptConfig = (html) => ({
    counter: parseScriptNumber(html, 'counter', 3),
    totalPhotos: parseScriptNumber(html, 'totalPhotos', 0),
    initialPhotos: parseScriptNumber(html, 'initialPhotos', 0),
    albumId: parseScriptString(html, 'albumId'),
    ownerId: parseScriptString(html, 'ownerId'),
    download: parseScriptNumber(html, 'download', 1),
    downloadId: parseScriptNumber(html, 'downloadId', 0),
    title: parseScriptString(html, 'title'),
});
class CosplayRule34Interceptor {
    async interceptRequest(request) {
        request.headers = {
            ...request.headers,
            Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
            Referer: `${BASE_URL}/`,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        };
        return request;
    }
    async interceptResponse(response) {
        return response;
    }
}
exports.CosplayRule34Info = {
    version: '1.0.0',
    name: 'CosplayRule34',
    icon: 'icon.png',
    author: 'chiraitori',
    authorWebsite: 'https://github.com/chiraitori/paperback-extensions',
    description: 'Browse and read cosplay and rule34 photo albums from cosplayrule34.com.',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: '18+', type: types_1.BadgeColor.RED },
        { text: 'Cosplay', type: types_1.BadgeColor.BLUE },
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS,
};
class CosplayRule34 extends types_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 10,
            requestTimeout: 30000,
            interceptor: new CosplayRule34Interceptor(),
        });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/post/${parsePostId(mangaId)}`;
    }
    async getSearchTags() {
        return [App.createTagSection({
                id: 'categories',
                label: 'Categories',
                tags: CATEGORY_TAGS.map(category => App.createTag({
                    id: category.id,
                    label: category.label,
                })),
            })];
    }
    async getHomePageSections(sectionCallback) {
        const sections = HOME_SECTIONS.map(definition => App.createHomeSection({
            id: definition.id,
            title: definition.title,
            type: types_1.HomeSectionType.singleRowNormal,
            containsMoreItems: true,
        }));
        sections.forEach(sectionCallback);
        await Promise.all(sections.map(async (section, index) => {
            const definition = HOME_SECTIONS[index];
            if (!definition)
                return;
            try {
                const page = await this.fetchGridPage(`${BASE_URL}${definition.path}`);
                section.items = page.results;
                sectionCallback(section);
            }
            catch (error) {
                console.log(`[CosplayRule34] Failed to load ${section.id}: ${error}`);
            }
        }));
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        if (metadata?.next) {
            return this.fetchGridPage(normalizeUrl(metadata.next));
        }
        const definition = HOME_SECTIONS.find(section => section.id === homepageSectionId);
        if (!definition)
            return App.createPagedResults({ results: [] });
        return this.fetchGridPage(`${BASE_URL}${definition.path}`);
    }
    async getSearchResults(query, metadata) {
        if (metadata?.next) {
            return this.fetchGridPage(normalizeUrl(metadata.next));
        }
        const searchTitle = query.title?.trim() ?? '';
        if (searchTitle) {
            const cleanedQuery = searchTitle.replace(/(?:…|\.\.\.)+$/g, '').trim();
            if (cleanedQuery) {
                const primaryResults = await this.fetchGridPage(`${BASE_URL}/search/${encodeURIComponent(cleanedQuery)}`);
                if (primaryResults.results.length > 0) {
                    return primaryResults;
                }
                const dashSegment = cleanedQuery.split(/\s+[–-]\s+/)[0]?.trim();
                if (dashSegment && dashSegment !== cleanedQuery) {
                    return this.fetchGridPage(`${BASE_URL}/search/${encodeURIComponent(dashSegment)}`);
                }
                return primaryResults;
            }
        }
        const firstTag = query.includedTags?.[0];
        if (firstTag) {
            const category = CATEGORY_TAGS.find(item => item.id === firstTag.id);
            if (category) {
                return this.fetchGridPage(`${BASE_URL}${category.path}`);
            }
            if (firstTag.id.startsWith('model:')) {
                return this.fetchGridPage(`${BASE_URL}/model/${encodeURIComponent(firstTag.id.slice('model:'.length))}`);
            }
            if (firstTag.id.startsWith('cosplay:')) {
                return this.fetchGridPage(`${BASE_URL}/cosplay/${encodeURIComponent(firstTag.id.slice('cosplay:'.length))}`);
            }
            if (firstTag.id.startsWith('fandom:')) {
                return this.fetchGridPage(`${BASE_URL}/fandom/${encodeURIComponent(firstTag.id.slice('fandom:'.length))}`);
            }
        }
        return this.fetchGridPage(`${BASE_URL}/`);
    }
    async getMangaDetails(mangaId) {
        const postId = parsePostId(mangaId);
        const html = await this.get(`${BASE_URL}/post/${postId}`);
        const $ = this.cheerio.load(html);
        const config = parsePostScriptConfig(html);
        const headingTitle = $('h1').first().text().trim();
        const title = config.title || headingTitle || `Post ${postId}`;
        const desc = $('div.container.mb-1').first().text().trim();
        const firstPhotoUrl = normalizeUrl($('#photo-container .photo-item a[data-fancybox="gallery"]').first().attr('href')
            ?? $('#photo-container .photo-item img').first().attr('src')
            ?? '');
        const cover = config.ownerId && config.albumId
            ? `${BASE_URL}/images/albums/${config.ownerId}/${config.albumId}.webp`
            : firstPhotoUrl;
        const models = [];
        const characters = [];
        const fandoms = [];
        const seenTagIds = new Set();
        $('a[href^="/model/"]').each((_, el) => {
            const label = $(el).text().trim();
            const href = $(el).attr('href') ?? '';
            const slug = href.replace(/^\/model\//, '').trim();
            if (label && slug && !seenTagIds.has(`model:${slug}`)) {
                seenTagIds.add(`model:${slug}`);
                models.push(App.createTag({ id: `model:${slug}`, label }));
            }
        });
        $('a[href^="/cosplay/"]').each((_, el) => {
            const label = $(el).text().trim();
            const href = $(el).attr('href') ?? '';
            const slug = href.replace(/^\/cosplay\//, '').trim();
            if (label && slug && !seenTagIds.has(`cosplay:${slug}`)) {
                seenTagIds.add(`cosplay:${slug}`);
                characters.push(App.createTag({ id: `cosplay:${slug}`, label }));
            }
        });
        $('a[href^="/fandom/"]').each((_, el) => {
            const label = $(el).text().trim();
            const href = $(el).attr('href') ?? '';
            const slug = href.replace(/^\/fandom\//, '').trim();
            if (label && slug && !seenTagIds.has(`fandom:${slug}`)) {
                seenTagIds.add(`fandom:${slug}`);
                fandoms.push(App.createTag({ id: `fandom:${slug}`, label }));
            }
        });
        const tagSections = [];
        if (models.length > 0) {
            tagSections.push(App.createTagSection({ id: 'models', label: 'Models', tags: models }));
        }
        if (characters.length > 0) {
            tagSections.push(App.createTagSection({ id: 'characters', label: 'Characters', tags: characters }));
        }
        if (fandoms.length > 0) {
            tagSections.push(App.createTagSection({ id: 'fandoms', label: 'Fandoms', tags: fandoms }));
        }
        const authorName = models.map(model => model.label).join(', ');
        return App.createSourceManga({
            id: postId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: cover,
                author: authorName || undefined,
                artist: authorName || undefined,
                desc: desc || `${title}${config.totalPhotos > 0 ? ` (${config.totalPhotos} photos)` : ''}`,
                status: 'Completed',
                hentai: true,
                tags: tagSections,
            }),
        });
    }
    async getChapters(mangaId) {
        const postId = parsePostId(mangaId);
        const html = await this.get(`${BASE_URL}/post/${postId}`);
        const $ = this.cheerio.load(html);
        const config = parsePostScriptConfig(html);
        const title = config.title || $('h1').first().text().trim() || `Post ${postId}`;
        const chapterTitle = config.totalPhotos > 0 ? `${title} (${config.totalPhotos} photos)` : title;
        return [App.createChapter({
                id: postId,
                name: chapterTitle,
                chapNum: 1,
                langCode: 'en',
            })];
    }
    async getChapterDetails(mangaId, chapterId) {
        const postId = parsePostId(mangaId);
        const html = await this.get(`${BASE_URL}/post/${postId}`);
        const $ = this.cheerio.load(html);
        const config = parsePostScriptConfig(html);
        const pages = [];
        const seenUrls = new Set();
        const addPage = (rawUrl) => {
            const url = normalizeUrl(rawUrl ?? '');
            if (url && !seenUrls.has(url)) {
                seenUrls.add(url);
                pages.push(url);
            }
        };
        $('#photo-container .photo-item').each((_, el) => {
            const item = $(el);
            const href = item.find('a[data-fancybox="gallery"]').first().attr('href');
            const src = item.find('img').first().attr('src');
            addPage(href || src);
        });
        let loadedPhotos = config.initialPhotos > 0 ? config.initialPhotos : pages.length;
        let counter = config.counter;
        while (config.albumId && config.ownerId && loadedPhotos < config.totalPhotos) {
            const remaining = config.totalPhotos - loadedPhotos;
            const limit = Math.min(PHOTO_BATCH_LIMIT, remaining);
            if (limit <= 0)
                break;
            const data = await this.postJson(LOAD_MORE_PHOTOS_URL, {
                album_id: config.albumId,
                owner_id: config.ownerId,
                download: config.download,
                download_id: config.downloadId,
                offset: loadedPhotos,
                limit,
                title: config.title,
                counter,
            });
            const batch = data.photos ?? [];
            if (batch.length === 0)
                break;
            for (const photo of batch) {
                if (typeof photo.counter === 'number') {
                    counter = photo.counter;
                }
                if (!photo.html)
                    continue;
                const fragment = this.cheerio.load(photo.html);
                const href = fragment('a[data-fancybox="gallery"]').first().attr('href');
                const src = fragment('img').first().attr('src');
                addPage(href || src);
            }
            loadedPhotos += batch.length;
            if (batch.length < limit)
                break;
        }
        if (pages.length === 0) {
            throw new Error(`No photos found for CosplayRule34 post ${postId}`);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId: postId,
            pages,
        });
    }
    async fetchGridPage(url) {
        const html = await this.get(url);
        const $ = this.cheerio.load(html);
        const results = [];
        const seenIds = new Set();
        $('.grid .grid-item').each((_, el) => {
            const item = $(el);
            const titleLink = item.find('a[href^="/post/"]').first();
            const href = titleLink.attr('href') ?? '';
            if (!href)
                return;
            const idMatch = /\/post\/(\d+)/i.exec(href);
            const mangaId = idMatch?.[1];
            if (!mangaId || seenIds.has(mangaId))
                return;
            const title = titleLink.text().trim();
            if (!title)
                return;
            const image = extractBackgroundImageUrl(item.attr('style') ?? '');
            const model = item.find('a[href^="/model/"] .badge').first().text().trim();
            const character = item.find('a[href^="/cosplay/"] .badge').first().text().trim();
            const count = item.find('.badge.bg-dark span.ms-1').first().text().trim();
            const subtitleParts = [
                model || character,
                count ? `${count} photos` : '',
            ].filter(Boolean);
            seenIds.add(mangaId);
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
                subtitle: subtitleParts.join(' • ') || undefined,
            }));
        });
        const nextHref = $('a.next').first().attr('href')?.trim() ?? '';
        const metadata = nextHref ? { next: nextHref } : undefined;
        return App.createPagedResults({
            results,
            metadata,
        });
    }
    async get(url) {
        const request = App.createRequest({
            url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        if (response.status >= 400) {
            throw new Error(`HTTP ${response.status} while fetching ${url}`);
        }
        return response.data ?? '';
    }
    async postJson(url, body) {
        const request = App.createRequest({
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(body),
        });
        const response = await this.requestManager.schedule(request, 1);
        if (response.status >= 400) {
            throw new Error(`HTTP ${response.status} while posting to ${url}`);
        }
        return JSON.parse(response.data ?? '{}');
    }
}
exports.CosplayRule34 = CosplayRule34;

},{"@paperback/types":61}]},{},[62])(62)
});
