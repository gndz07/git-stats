import styles from '../styles/RepoHeader.module.css'

export default function RepoHeader({ data }) {
    return (
        <div>
            <div className={styles.name_container}>
                <img className={styles.avatar} src={data?.owner?.avatar_url}/>
                <h2 className={styles.repo_name}>{data?.full_name}</h2>
            </div>
            <p className={styles.description}>{data?.description}</p>
        </div>
    )
}