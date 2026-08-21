import Link from "next/link";
import style from "./styles.module.css";
export default function Header() {
  return (
    <header className={style.container}>
      <div className={style.info}>
        <nav className={style.nav}>
          <Link href={"/"}>
            <h1 className={style.title}>
              Help
              <span className={style.span}> Task</span>
            </h1>
          </Link>

          <Link href={"/dashboard"}>
            <button className={style.myTask}>Meu Painel</button>
          </Link>
        </nav>
        <Link href={"/account"}>
          <button className={style.account}> Acessar </button>
        </Link>
      </div>
    </header>
  );
}
