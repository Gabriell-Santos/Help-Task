import Link from "next/link";
import style from "../components/styles.module.css";
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

          <Link href={"/mytask"}>
            <button className={style.myTask}>Minhas Tarefas</button>
          </Link>
        </nav>
        <button className={style.accont}> Minha Conta </button>
      </div>
    </header>
  );
}
