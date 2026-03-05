import ChapterFormPage from '../../new/page'

export default function EditChapterPage({ params }: { params: { id: string, chapterId: string } }) {
    return <ChapterFormPage params={params} />
}
