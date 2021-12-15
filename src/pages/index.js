import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import { search, mapImageResources } from '../lib/cloudinary';

import styles from '@styles/Home.module.scss'

export default function Home({ images }) {
  return (
    <Layout>
      <Head>
        <title>My Images</title>
        <meta name="description" content="All of my cool images." />
      </Head>

      <Container>
        <h1 className="sr-only">My Images</h1>

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
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const results = await search({
    expression: 'folder=""'
  });

  const { resources } = results;

  const images = mapImageResources(resources);

  return {
    props: {
      images
    }
  }
}