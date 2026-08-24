import Head from "next/head";
import style from "./style.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { redirect } from "next/dist/server/api-utils";
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
