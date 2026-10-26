import style from "../../styles/home.module.css";
import { db } from "../service/connectionFirebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import heroImg from "../assets/hero.png";
import Image from "next/image";
import { GetStaticProps } from "next";

interface HomeProps {
  post: number;
  comment: number;
}
export default function Home({ post, comment }: HomeProps) {
  return (
    <div className={style.container}>
      <Head>
        <title>Portal Help Task</title>
      </Head>
      <main className={style.main}>
        <div className={style.logo}>
          <Image
            className={style.LogoContent}
            src={heroImg}
            alt="Logo do aplicativo"
            priority
          />
        </div>
        <h1 className={style.title}>
          Sistema feito para organizar e maximar <br />
          as tarefas da sua empresa
        </h1>
        <div className={style.info}>
          <section className={style.previewInfo}>
            +{post} post simultanêos
          </section>
          <section className={style.previewInfo}>
            +{comment} comentarios
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "Tarefas");
  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    props: {
      post: postSnapshot.size || 0,
      comment: commentSnapshot.size || 0,
    },
    revalidate: 80, // revalidate a cada 80 segundos
  };
};
