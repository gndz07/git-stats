import { useRouter } from 'next/router'

export default function RepoStatPage () {
    const router = useRouter()
    const { name } = router.query

    return (
        <div>{name}</div>
    )
}