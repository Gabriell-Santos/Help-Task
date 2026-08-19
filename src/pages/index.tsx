import style from "../../styles/home.module.css";
import heroImg from "../assets/hero.png";
import Image from "next/image";
export default function Home() {
  return (
    <div className={style.container}>
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
          as tarefas do mundo coorporativo
        </h1>
      </main>
    </div>
  );
}
