import BlogFormPage from '../new/page'

export default function EditBlogPage({ params }: { params: { id: string } }) {
    return <BlogFormPage params={params} />
}
