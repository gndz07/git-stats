import styles from '../styles/RepoCard.module.css'
import Link from 'next/link'

export default function RepoCard({ repo }) {
    return (
        <Link href={`/${repo.name}`}>
            <div className={styles.card}>
                <img src={repo.owner.avatar_url} className={styles.avatar} />
                <div className={styles.card_body}>
                <h3>{repo.full_name}</h3>
                <p>{repo.description}</p>
                </div>
                <p className={styles.select_text}>select</p>
            </div>
        </Link>
    )
}