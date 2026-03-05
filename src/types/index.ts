export interface Category {
    id: string
    name: string
    slug: string
}

export interface Story {
    id: string
    created_at: string
    title: string
    slug: string
    summary: string | null
    cover_image_url: string | null
    is_published: boolean
    category_id: string | null
    categories?: Category
}

export interface Chapter {
    id: string
    created_at: string
    story_id: string
    chapter_number: number
    title: string
    content: string
}

export interface BlogPost {
    id: string
    created_at: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    cover_image_url: string | null
    is_published: boolean
    author_name: string
}
