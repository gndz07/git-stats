import Head from "next/head";
import containerStyles from "../styles/Container.module.css";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import RepoCard from "../components/RepoCard";

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
        <title>Github Indicators Explorer</title>
        <meta
          name="Github Indicators Explorer"
          content="Github repository indicator"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={containerStyles.main}>
        <h1 className={styles.title}>Github Indicators Explorer</h1>

        <p className={styles.description}>
          GitHub Indicators Explorer can help you get key metrics about your
          favourite github repositories.
        </p>

        <div className={styles.grid}>
          <h2 className={styles.subtitle}>Select a repository</h2>
          <input
            className={styles.search_bar}
            placeholder="Search..."
            onChange={handleSearch}
          />
          {displayedRepos
            ? displayedRepos.map((repo) => <RepoCard repo={repo} />)
            : false}
        </div>
      </main>
    </div>
  );
}
