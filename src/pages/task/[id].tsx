import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "../../service/connectionFirebase";
import { doc, collection, where, query, getDoc } from "firebase/firestore";
export default function Task() {
  return (
    <div>
      <Head>
        <title>Detalhes da Tarefa</title>
      </Head>
      <main>
        <h1>Tarefas</h1>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const taskRef = doc(db, "Tarefas", id);
  // Buscando dados do banco
  const snapshot = await getDoc(taskRef);
  // Verificando se a tarefa existe
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // verificando se a tarefa é publica
  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const NewSeconds = snapshot.data()?.created.seconds * 1000;
  const TaskData = {
    task: snapshot.data()?.task,
    created: new Date(NewSeconds).toLocaleDateString(),
    EmailUser: snapshot.data()?.EmailUser,
    public: snapshot.data()?.public,
    taskId: id,
  };
  console.log(TaskData);
  return {
    props: {},
  };
};
