import styles from '../styles/RepoCard.module.css'
import Link from 'next/link'
import en from '../lang/en';

export default function RepoCard({ repo, key }) {
    return (
        <Link href={`/${repo.name}`} key={key}>
            <div className={styles.card}>
                <img src={repo.owner.avatar_url} className={styles.avatar} />
                <div className={styles.card_body}>
                <h3>{repo.full_name}</h3>
                <p>{repo.description}</p>
                </div>
                <p className={styles.select_text}>{en.select}</p>
            </div>
        </Link>
    )
}