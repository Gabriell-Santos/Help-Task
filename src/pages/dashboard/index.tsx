import Head from "next/head";
import style from "./style.module.css";
export default function Dashboard() {
  return (
    <div className={style.container}>
      <Head>
        <title> Meu Painel de tarefas </title>
      </Head>
      <h1>Meu Painel </h1>
    </div>
  );
}
