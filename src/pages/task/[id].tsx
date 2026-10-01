import Head from "next/head";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "../../service/connectionFirebase";
import {
  doc,
  collection,
  where,
  query,
  getDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { TextArea } from "../../components/textArea/index";

// Interface para tipagem das props
interface TaskProps {
  item: {
    task: string;
    created: string;
    EmailUser: string;
    public: boolean;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<string>("");
  const [commentsList, setCommentsList] = useState<CommentProps[]>(
    allComments || [],
  );

  // Função para lidar com o envio de comentários
  async function handleComments(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (comments === "") return;
    if (!session?.user?.name || !session?.user?.email) return;
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: comments,
        taskId: item.taskId,
        userName: session.user.name,
        userEmail: session.user.email,
        created: new Date(),
      });

      // Atualizando a lista de comentários ao adicionar um novo comentário
      const data = {
        id: docRef.id,
        comment: comments,
        taskId: item.taskId,
        user: session.user.email,
        name: session.user.name,
      };
      setCommentsList((oldComments) => [...oldComments, data]);

      setComments("");
    } catch (error) {
      console.log(error);
    }
  }
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
        <form onSubmit={handleComments}>
          <TextArea
            placeholder="Escreva seu comentário..."
            value={comments}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setComments(event.target.value);
            }}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!session?.user}
          >
            Enviar Comentário
          </button>
        </form>
      </section>
      <section className={styles.comments}>
        <h2>Todos os Comentários</h2>
        {commentsList.length === 0 && <p>Nenhum comentário existente.</p>}
        {commentsList.map((doc) => (
          <article className={styles.comment} key={doc.id}>
            <div className={styles.headerComment}>
              <label className={styles.UserName}> {doc.name} </label>
              {doc.user === session?.user?.email && (
                <button className={styles.deleteButton}>Excluir</button>
              )}
            </div>
            <p> {doc.comment} </p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const taskRef = doc(db, "Tarefas", id);
  // Buscando todos os comentários relacionados a tarefa
  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const querySnapshot = await getDocs(q);

  let comments: CommentProps[] = [];
  querySnapshot.forEach((doc) => {
    comments.push({
      id: doc.id,
      comment: doc.data().comment,
      taskId: doc.data().taskId,
      user: doc.data().userEmail,
      name: doc.data().userName,
    });
  });

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
      allComments: comments,
    },
  };
};
