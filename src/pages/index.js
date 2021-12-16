import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import { search, mapImageResources, getFolders } from '../lib/cloudinary';

import styles from '@styles/Home.module.scss'

export default function Home({ images: defaultImages, nextCursor: defaultNextCursor, totalCount: defaultTotalCount, folders }) {
  const [images, setImages] = useState(defaultImages);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [totalCount, setTotalCount] = useState(defaultTotalCount);
  const [activeFolder, setActiveFolder] = useState();

  async function handleOnLoadMore(e) {
    e.preventDefault();

    const results = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        expression: `folder=""`,
        nextCursor
      })
    }).then(r => r.json());

    const { resources, next_cursor: nextPageCursor, total_count: updatedTotalCount } = results;

    const images = mapImageResources(resources);

    setImages(prev => {
      return [
        ...prev,
        ...images
      ]
    });
    setNextCursor(nextPageCursor);
    setTotalCount(updatedTotalCount);
  }

  function handleOnFolderClick(e) {
    const folderPath = e.target.dataset.folderPath;
    setActiveFolder(folderPath)
    setNextCursor(undefined);
    setImages([]);
    setTotalCount(0);
  }

  useEffect(() => {
    (async function run() {
      const results = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({
          expression: `folder="${activeFolder || ''}"`
        })
      }).then(r => r.json());

      const { resources, next_cursor: nextPageCursor, total_count: updatedTotalCount } = results;

      const images = mapImageResources(resources);

      setImages(images);
      setNextCursor(nextPageCursor);
      setTotalCount(updatedTotalCount);
    })();
  }, [activeFolder]);

  return (
    <Layout>
      <Head>
        <title>My Images</title>
        <meta name="description" content="All of my cool images." />
      </Head>

      <Container>
        <h1 className="sr-only">My Images</h1>

        <h2>Folders</h2>

        <ul className={styles.folders} onClick={handleOnFolderClick}>
          {folders.map(folder => {
            const isActive = folder.path === activeFolder;
            return (
              <li key={folder.path} data-active-folder={isActive}>
                <button data-folder-path={folder.path} >{ folder.name }</button>
              </li>
            )
          })}
        </ul>

        <h2 className={styles.header}>Images</h2>

        <ul className={styles.images}>
          {images.map(image => {
            return (
              <li key={image.id}>
                <a href={image.link} rel="noreferrer">
                  <div className={styles.imageImage}>
                    <Image width={image.width} height={image.height} src={image.image} alt="" />
                  </div>
                  <h3 className={styles.imageTitle}>
                    { image.title }
                  </h3>
                </a>
              </li>
            )
          })}
        </ul>
        {totalCount > images.length && (
          <p>
            <Button onClick={handleOnLoadMore}>Load More Results</Button>
          </p>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const results = await search({
    expression: 'folder=""'
  });

  const { resources, next_cursor: nextCursor, total_count: totalCount } = results;

  const images = mapImageResources(resources);

  const { folders } = await getFolders();

  return {
    props: {
      images,
      nextCursor,
      totalCount,
      folders
    }
  }
}