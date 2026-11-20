import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    HomeSectionType,
    PagedResults,
    PartialSourceManga,
    Request,
    Response,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceInterceptor,
    SourceManga,
    Tag,
    TagSection,
} from '@paperback/types'

const BASE_URL = 'https://cosplayrule34.com'
const LOAD_MORE_PHOTOS_URL = `${BASE_URL}/cms/load-more-photos.php`
const PHOTO_BATCH_LIMIT = 100

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
]

const HOME_SECTIONS = [
    { id: 'latest', title: 'Latest', path: '/' },
    { id: 'top', title: 'Top', path: '/top' },
    { id: 'cosplay', title: 'Cosplay', path: '/category/cosplay' },
    { id: 'art', title: 'Art', path: '/category/art' },
    { id: 'onlyfans', title: 'Onlyfans', path: '/category/thots' },
]

interface SearchMetadata {
    next?: string
}

interface PostScriptConfig {
    counter: number
    totalPhotos: number
    initialPhotos: number
    albumId: string
    ownerId: string
    download: number
    downloadId: number
    title: string
}

interface LoadMorePhotoItem {
    html?: string
    counter?: number
}

interface LoadMorePhotosResponse {
    photos?: LoadMorePhotoItem[]
}

const normalizeUrl = (value: string): string => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('//')) return `https:${trimmed}`
    if (trimmed.startsWith('/')) return `${BASE_URL}${trimmed}`
    return trimmed
}

const extractBackgroundImageUrl = (style: string): string => {
    const match = /background-image\s*:\s*url\((?:['"])?([^'")]+)(?:['"])?\)/i.exec(style)
    return normalizeUrl(match?.[1] ?? '')
}

const parsePostId = (value: string): string => {
    const match = /\/post\/(\d+)/i.exec(value)
    if (match?.[1]) return match[1]
    if (/^\d+$/.test(value.trim())) return value.trim()
    throw new Error(`Invalid CosplayRule34 post ID: ${value}`)
}

const parseScriptNumber = (html: string, name: string, fallback: number): number => {
    const match = new RegExp(`(?:let|const|var)\\s+${name}\\s*=\\s*(-?\\d+)`, 'i').exec(html)
    if (!match?.[1]) return fallback
    const parsed = Number.parseInt(match[1], 10)
    return Number.isNaN(parsed) ? fallback : parsed
}

const parseScriptString = (html: string, name: string): string => {
    const match = new RegExp(`(?:let|const|var)\\s+${name}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'i').exec(html)
    if (!match?.[1]) return ''
    return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\')
}

const parsePostScriptConfig = (html: string): PostScriptConfig => ({
    counter: parseScriptNumber(html, 'counter', 3),
    totalPhotos: parseScriptNumber(html, 'totalPhotos', 0),
    initialPhotos: parseScriptNumber(html, 'initialPhotos', 0),
    albumId: parseScriptString(html, 'albumId'),
    ownerId: parseScriptString(html, 'ownerId'),
    download: parseScriptNumber(html, 'download', 1),
    downloadId: parseScriptNumber(html, 'downloadId', 0),
    title: parseScriptString(html, 'title'),
})

class CosplayRule34Interceptor implements SourceInterceptor {
    async interceptRequest(request: Request): Promise<Request> {
        request.headers = {
            ...request.headers,
            Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
            Referer: `${BASE_URL}/`,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        }
        return request
    }

    async interceptResponse(response: Response): Promise<Response> {
        return response
    }
}

export const CosplayRule34Info: SourceInfo = {
    version: '1.0.0',
    name: 'CosplayRule34',
    icon: 'icon.png',
    author: 'chiraitori',
    authorWebsite: 'https://github.com/chiraitori/paperback-extensions',
    description: 'Browse and read cosplay and rule34 photo albums from cosplayrule34.com.',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: '18+', type: BadgeColor.RED },
        { text: 'Cosplay', type: BadgeColor.BLUE },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
}

export class CosplayRule34 extends Source {
    override readonly requestManager = App.createRequestManager({
        requestsPerSecond: 10,
        requestTimeout: 30000,
        interceptor: new CosplayRule34Interceptor(),
    })

    override getMangaShareUrl(mangaId: string): string {
        return `${BASE_URL}/post/${parsePostId(mangaId)}`
    }

    override async getSearchTags(): Promise<TagSection[]> {
        return [App.createTagSection({
            id: 'categories',
            label: 'Categories',
            tags: CATEGORY_TAGS.map(category => App.createTag({
                id: category.id,
                label: category.label,
            })),
        })]
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = HOME_SECTIONS.map(definition => App.createHomeSection({
            id: definition.id,
            title: definition.title,
            type: HomeSectionType.singleRowNormal,
            containsMoreItems: true,
        }))

        sections.forEach(sectionCallback)

        await Promise.all(sections.map(async (section, index) => {
            const definition = HOME_SECTIONS[index]
            if (!definition) return

            try {
                const page = await this.fetchGridPage(`${BASE_URL}${definition.path}`)
                section.items = page.results
                sectionCallback(section)
            } catch (error) {
                console.log(`[CosplayRule34] Failed to load ${section.id}: ${error}`)
            }
        }))
    }

    override async getViewMoreItems(homepageSectionId: string, metadata: SearchMetadata): Promise<PagedResults> {
        if (metadata?.next) {
            return this.fetchGridPage(normalizeUrl(metadata.next))
        }

        const definition = HOME_SECTIONS.find(section => section.id === homepageSectionId)
        if (!definition) return App.createPagedResults({ results: [] })

        return this.fetchGridPage(`${BASE_URL}${definition.path}`)
    }

    override async getSearchResults(query: SearchRequest, metadata: SearchMetadata): Promise<PagedResults> {
        if (metadata?.next) {
            return this.fetchGridPage(normalizeUrl(metadata.next))
        }

        const searchTitle = query.title?.trim() ?? ''
        if (searchTitle) {
            const cleanedQuery = searchTitle.replace(/(?:…|\.\.\.)+$/g, '').trim()
            if (cleanedQuery) {
                const primaryResults = await this.fetchGridPage(`${BASE_URL}/search/${encodeURIComponent(cleanedQuery)}`)
                if (primaryResults.results.length > 0) {
                    return primaryResults
                }

                const dashSegment = cleanedQuery.split(/\s+[–-]\s+/)[0]?.trim()
                if (dashSegment && dashSegment !== cleanedQuery) {
                    return this.fetchGridPage(`${BASE_URL}/search/${encodeURIComponent(dashSegment)}`)
                }

                return primaryResults
            }
        }

        const firstTag = query.includedTags?.[0]
        if (firstTag) {
            const category = CATEGORY_TAGS.find(item => item.id === firstTag.id)
            if (category) {
                return this.fetchGridPage(`${BASE_URL}${category.path}`)
            }
            if (firstTag.id.startsWith('model:')) {
                return this.fetchGridPage(`${BASE_URL}/model/${encodeURIComponent(firstTag.id.slice('model:'.length))}`)
            }
            if (firstTag.id.startsWith('cosplay:')) {
                return this.fetchGridPage(`${BASE_URL}/cosplay/${encodeURIComponent(firstTag.id.slice('cosplay:'.length))}`)
            }
            if (firstTag.id.startsWith('fandom:')) {
                return this.fetchGridPage(`${BASE_URL}/fandom/${encodeURIComponent(firstTag.id.slice('fandom:'.length))}`)
            }
        }

        return this.fetchGridPage(`${BASE_URL}/`)
    }

    override async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const postId = parsePostId(mangaId)
        const html = await this.get(`${BASE_URL}/post/${postId}`)
        const $ = this.cheerio.load(html)
        const config = parsePostScriptConfig(html)

        const headingTitle = $('h1').first().text().trim()
        const title = config.title || headingTitle || `Post ${postId}`
        const desc = $('div.container.mb-1').first().text().trim()

        const firstPhotoUrl = normalizeUrl(
            $('#photo-container .photo-item a[data-fancybox="gallery"]').first().attr('href')
            ?? $('#photo-container .photo-item img').first().attr('src')
            ?? '',
        )
        const cover = config.ownerId && config.albumId
            ? `${BASE_URL}/images/albums/${config.ownerId}/${config.albumId}.webp`
            : firstPhotoUrl

        const models: Tag[] = []
        const characters: Tag[] = []
        const fandoms: Tag[] = []
        const seenTagIds = new Set<string>()

        $('a[href^="/model/"]').each((_, el) => {
            const label = $(el).text().trim()
            const href = $(el).attr('href') ?? ''
            const slug = href.replace(/^\/model\//, '').trim()
            if (label && slug && !seenTagIds.has(`model:${slug}`)) {
                seenTagIds.add(`model:${slug}`)
                models.push(App.createTag({ id: `model:${slug}`, label }))
            }
        })

        $('a[href^="/cosplay/"]').each((_, el) => {
            const label = $(el).text().trim()
            const href = $(el).attr('href') ?? ''
            const slug = href.replace(/^\/cosplay\//, '').trim()
            if (label && slug && !seenTagIds.has(`cosplay:${slug}`)) {
                seenTagIds.add(`cosplay:${slug}`)
                characters.push(App.createTag({ id: `cosplay:${slug}`, label }))
            }
        })

        $('a[href^="/fandom/"]').each((_, el) => {
            const label = $(el).text().trim()
            const href = $(el).attr('href') ?? ''
            const slug = href.replace(/^\/fandom\//, '').trim()
            if (label && slug && !seenTagIds.has(`fandom:${slug}`)) {
                seenTagIds.add(`fandom:${slug}`)
                fandoms.push(App.createTag({ id: `fandom:${slug}`, label }))
            }
        })

        const tagSections: TagSection[] = []
        if (models.length > 0) {
            tagSections.push(App.createTagSection({ id: 'models', label: 'Models', tags: models }))
        }
        if (characters.length > 0) {
            tagSections.push(App.createTagSection({ id: 'characters', label: 'Characters', tags: characters }))
        }
        if (fandoms.length > 0) {
            tagSections.push(App.createTagSection({ id: 'fandoms', label: 'Fandoms', tags: fandoms }))
        }

        const authorName = models.map(model => model.label).join(', ')

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
        })
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        const postId = parsePostId(mangaId)
        const html = await this.get(`${BASE_URL}/post/${postId}`)
        const $ = this.cheerio.load(html)
        const config = parsePostScriptConfig(html)
        const title = config.title || $('h1').first().text().trim() || `Post ${postId}`
        const chapterTitle = config.totalPhotos > 0 ? `${title} (${config.totalPhotos} photos)` : title

        return [App.createChapter({
            id: postId,
            name: chapterTitle,
            chapNum: 1,
            langCode: 'en',
        })]
    }

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const postId = parsePostId(mangaId)
        const html = await this.get(`${BASE_URL}/post/${postId}`)
        const $ = this.cheerio.load(html)
        const config = parsePostScriptConfig(html)

        const pages: string[] = []
        const seenUrls = new Set<string>()
        const addPage = (rawUrl: string | undefined): void => {
            const url = normalizeUrl(rawUrl ?? '')
            if (url && !seenUrls.has(url)) {
                seenUrls.add(url)
                pages.push(url)
            }
        }

        $('#photo-container .photo-item').each((_, el) => {
            const item = $(el)
            const href = item.find('a[data-fancybox="gallery"]').first().attr('href')
            const src = item.find('img').first().attr('src')
            addPage(href || src)
        })

        let loadedPhotos = config.initialPhotos > 0 ? config.initialPhotos : pages.length
        let counter = config.counter

        while (config.albumId && config.ownerId && loadedPhotos < config.totalPhotos) {
            const remaining = config.totalPhotos - loadedPhotos
            const limit = Math.min(PHOTO_BATCH_LIMIT, remaining)
            if (limit <= 0) break

            const data = await this.postJson<LoadMorePhotosResponse>(LOAD_MORE_PHOTOS_URL, {
                album_id: config.albumId,
                owner_id: config.ownerId,
                download: config.download,
                download_id: config.downloadId,
                offset: loadedPhotos,
                limit,
                title: config.title,
                counter,
            })

            const batch = data.photos ?? []
            if (batch.length === 0) break

            for (const photo of batch) {
                if (typeof photo.counter === 'number') {
                    counter = photo.counter
                }
                if (!photo.html) continue
                const fragment = this.cheerio.load(photo.html)
                const href = fragment('a[data-fancybox="gallery"]').first().attr('href')
                const src = fragment('img').first().attr('src')
                addPage(href || src)
            }

            loadedPhotos += batch.length
            if (batch.length < limit) break
        }

        if (pages.length === 0) {
            throw new Error(`No photos found for CosplayRule34 post ${postId}`)
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId: postId,
            pages,
        })
    }

    private async fetchGridPage(url: string): Promise<PagedResults> {
        const html = await this.get(url)
        const $ = this.cheerio.load(html)
        const results: PartialSourceManga[] = []
        const seenIds = new Set<string>()

        $('.grid .grid-item').each((_, el) => {
            const item = $(el)
            const titleLink = item.find('a[href^="/post/"]').first()
            const href = titleLink.attr('href') ?? ''
            if (!href) return

            const idMatch = /\/post\/(\d+)/i.exec(href)
            const mangaId = idMatch?.[1]
            if (!mangaId || seenIds.has(mangaId)) return

            const title = titleLink.text().trim()
            if (!title) return

            const image = extractBackgroundImageUrl(item.attr('style') ?? '')
            const model = item.find('a[href^="/model/"] .badge').first().text().trim()
            const character = item.find('a[href^="/cosplay/"] .badge').first().text().trim()
            const count = item.find('.badge.bg-dark span.ms-1').first().text().trim()

            const subtitleParts = [
                model || character,
                count ? `${count} photos` : '',
            ].filter(Boolean)

            seenIds.add(mangaId)
            results.push(App.createPartialSourceManga({
                mangaId,
                title,
                image,
                subtitle: subtitleParts.join(' • ') || undefined,
            }))
        })

        const nextHref = $('a.next').first().attr('href')?.trim() ?? ''
        const metadata: SearchMetadata | undefined = nextHref ? { next: nextHref } : undefined

        return App.createPagedResults({
            results,
            metadata,
        })
    }

    private async get(url: string): Promise<string> {
        const request = App.createRequest({
            url,
            method: 'GET',
        })
        const response = await this.requestManager.schedule(request, 1)
        if (response.status >= 400) {
            throw new Error(`HTTP ${response.status} while fetching ${url}`)
        }
        return response.data ?? ''
    }

    private async postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
        const request = App.createRequest({
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(body),
        })
        const response = await this.requestManager.schedule(request, 1)
        if (response.status >= 400) {
            throw new Error(`HTTP ${response.status} while posting to ${url}`)
        }
        return JSON.parse(response.data ?? '{}') as T
    }
}
