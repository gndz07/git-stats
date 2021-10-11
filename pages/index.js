import Head from "next/head";
import containerStyles from "../styles/Container.module.css";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import RepoCard from "../components/RepoCard";
import en from "../lang/en";

export async function getStaticProps() {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `token ${process.env.API_TOKEN}`);

  const res = await fetch(
    `https://api.github.com/${process.env.REPO_TYPE}/${process.env.REPO_USERNAME}/repos`,
    { headers: myHeaders }
  );
  const repos = await res.json();

  if (!repos) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      repos,
    },
  };
}

export default function Home({ repos }) {
  const [displayedRepos, setDisplayedRepos] = useState(repos);

  const handleSearch = (e) => {
    const result = repos.filter((repo) => {
      return repo.full_name.includes(e.target.value);
    });
    setDisplayedRepos(result);
  };

  return (
    <div className={containerStyles.container}>
      <Head>
        <title>{en.title}</title>
        <meta
          name={en.title}
          content="Github repository indicator"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={containerStyles.main}>
        <h1 className={styles.title}>{en.title}</h1>

        <p className={styles.description}>{en.description}</p>

        <div className={styles.grid}>
          <h2 className={styles.subtitle}>{en.select_repo}</h2>
          <input
            className={styles.search_bar}
            placeholder={en.search}
            onChange={handleSearch}
          />
          {displayedRepos
            ? displayedRepos.map((repo, index) => <RepoCard repo={repo} key={index} />)
            : false}
        </div>
      </main>
    </div>
  );
}
