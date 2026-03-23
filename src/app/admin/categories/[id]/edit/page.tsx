import CategoryFormPage from '../../new/page'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    return <CategoryFormPage params={params} />
}
