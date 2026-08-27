import style from "../../styles/home.module.css";
import Head from "next/head";
import heroImg from "../assets/hero.png";
import Image from "next/image";
export default function Home() {
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
          <section className={style.previewInfo}>+12 post simultanêos</section>
          <section className={style.previewInfo}>+ 20 comentarios</section>
        </div>
      </main>
    </div>
  );
}
