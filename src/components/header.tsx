import Link from "next/link";
import style from "./styles.module.css";
import { useSession, signOut, signIn } from "next-auth/react";
export default function Header() {
  const { data: sesssion, status } = useSession();
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

        {status === "loading" ? (
          <></>
        ) : sesssion ? (
          <button className={style.account} onClick={() => signOut()}>
            Olá {sesssion.user?.name}
          </button>
        ) : (
          <button className={style.account} onClick={() => signIn("google")}>
            Acessar
          </button>
        )}
      </div>
    </header>
  );
}
