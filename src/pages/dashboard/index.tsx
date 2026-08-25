import Head from "next/head";
import style from "./style.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { redirect } from "next/dist/server/api-utils";
import { TextArea } from "@/components/textArea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
export default function Dashboard() {
  return (
    <div className={style.container}>
      <Head>
        <title> Meu Painel de tarefas </title>
      </Head>
      <main className={style.main}>
        <section className={style.content}>
          <div className={style.contentForm}>
            <h1 className={style.title}> Qual Sua Tarefa ? </h1>
            <form>
              <TextArea placeholder="Escreva os detalhes de sua tarefa..." />
              <div className={style.infoCheckbox}>
                <input type="checkbox" className="checkbox" />
                <label className={style.label}> Deixar tarefa Publica </label>
              </div>
              <button className={style.button} type="submit">
                Cadastrar
              </button>
            </form>
          </div>
        </section>
        <section className={style.taskContent}>
          <h1>Minha Tarefas</h1>
          <article className={style.task}>
            <div className={style.tagContent}>
              <label className={style.tag}>PUBLICA</label>
              <button className={style.shareButton}>
                <FiShare2 size={22} color="blue" />
              </button>
            </div>
            <div className={style.taskDescription}>
              <p> Fazer uma panilha no exel com os dados dos clientes </p>
              <button className={style.buttonTrash}>
                <FaTrash size={25} color="red" />
              </button>
            </div>
          </article>
          <article className={style.task}>
            <div className={style.tagContent}>
              <label className={style.tag}>PUBLICA</label>
              <button className={style.shareButton}>
                <FiShare2 size={22} color="blue" />
              </button>
            </div>
            <div className={style.taskDescription}>
              <p> Fazer uma panilha no exel com os dados dos clientes </p>
              <button className={style.buttonTrash}>
                <FaTrash size={25} color="red" />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

// Coloco em baixo a busca dos dados vindo do servidor
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  // Protegendo a rota
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Dentro do getServerSideProps sempre tem que retorna algo
  return {
    props: {},
  };
};
