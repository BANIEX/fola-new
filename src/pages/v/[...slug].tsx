export default function V({ title, description }: { title: string, description?: string }) {
    return (
        <div className="bg-white overflow-hidden min-h-[100] flex flex-col items-center justify-center min-h-screen md:py-2">
            <main className="flex relative items-center w-full px-2 md:px-20">
                <div className="px-4 md:inline-flex flex-col flex-1 space-y-1">
                    <p className='text-6xl text-black font-bold'>{title}</p>
                    <p className='font-medium text-lg leading-1 text-gray-500'>{description}</p>
                </div>
            </main>
        </div>
    )
}
export const getServerSideProps = ({ query }) => {
    return ({ props: { title: (query.slug), description: query.d || null } })
}