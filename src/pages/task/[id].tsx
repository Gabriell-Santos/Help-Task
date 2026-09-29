import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "../../service/connectionFirebase";
import { doc, collection, where, query, getDoc } from "firebase/firestore";
import { TextArea } from "../../components/textArea/index";

// Interface para tipagem das props
interface TaskProps {
  item: {
    task: string;
    created: string;
    EmailUser: string;
    public: boolean;
  };
}
export default function Task({ item }: TaskProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da Tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>Tarefas</h1>
        <article className={styles.task}>
          <p>{item.task}</p>
        </article>
      </main>
      {/* Parte dos comentarios*/}
      <section className={styles.comments}>
        <h2>Deixar Comentário</h2>
        <form>
          <TextArea placeholder="Escreva seu comentário..." />
          <button type="submit" className={styles.submitButton}>
            Enviar Comentário
          </button>
        </form>
      </section>
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

  return {
    props: {
      item: TaskData,
    },
  };
};
