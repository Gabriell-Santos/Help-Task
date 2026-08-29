import Head from "next/head";
import style from "./style.module.css";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { redirect } from "next/dist/server/api-utils";
import { TextArea } from "@/components/textArea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "@/service/connectionFirebase";
import {
  addDoc,
  collection,
  where,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface UserProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  task: string;
  created: Date;
  EmailUser: string;
  public: boolean;
}

export default function Dashboard({ user }: UserProps) {
  const [inputTask, setInputTask] = useState("");
  const [inputPublic, setInputPublic] = useState(false);
  const [taks, setTasks] = useState<TaskProps[]>([]);
  // Buscando tarefas ao carregar a página
  useEffect(() => {
    async function LoadingTask() {
      const taskRef = collection(db, "Tarefas");
      const q = query(
        taskRef,
        orderBy("created", "desc"),
        where("EmailUser", "==", user.email),
      );

      // Atualizando o banco sempre que uma nova tarefa é adicionada ou removida
      onSnapshot(q, (snapshot) => {
        const list = [] as TaskProps[];
        snapshot.forEach((item) => {
          list.push({
            id: item.id,
            task: item.data().task,
            created: item.data().created,
            EmailUser: item.data().EmailUser,
            public: item.data().public,
          });
        });
        setTasks(list);
      });
    }
    LoadingTask();
  }, [user.email]);

  // Função que verifca se a tarefa é publica ou não
  function handlePublicTask(event: ChangeEvent<HTMLInputElement>) {
    setInputPublic(event.target.checked);
  }

  // Função que registra a tarefa no banco

  async function HandleRegisterTask(event: React.FormEvent) {
    event.preventDefault();
    if (inputTask === "") return alert("campo tarefa em branco :)");
    // registrando tarefa
    try {
      await addDoc(collection(db, "Tarefas"), {
        task: inputTask,
        created: new Date(),
        EmailUser: user.email,
        public: inputPublic,
      });

      setInputPublic(false);
      setInputTask("");
    } catch (error) {
      console.log(error);
    }
  }

  // Funçao de copiar a url

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_PUBLIC}/task/${id}`,
    );
  }

  // Deletando Tarefa
  async function handleDeleteTask(id: string) {
    const TaskRef = doc(db, "Tarefas", id);
    await deleteDoc(TaskRef);
  }
  return (
    <div className={style.container}>
      <Head>
        <title> Meu Painel de tarefas </title>
      </Head>
      <main className={style.main}>
        <section className={style.content}>
          <div className={style.contentForm}>
            <h1 className={style.title}> Qual Sua Tarefa ? </h1>
            <form onSubmit={HandleRegisterTask}>
              <TextArea
                placeholder="Escreva os detalhes de sua tarefa..."
                value={inputTask}
                onChange={(e) => setInputTask(e.target.value)}
              />
              <div className={style.infoCheckbox}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={inputPublic}
                  onChange={handlePublicTask}
                />
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
          {taks.map((doc) => (
            <article className={style.task} key={doc.id}>
              {doc.public && (
                <div className={style.tagContent}>
                  <label className={style.tag}>PUBLICA</label>
                  <button
                    className={style.shareButton}
                    onClick={() => handleShare(doc.id)}
                  >
                    <FiShare2 size={22} color="blue" />
                  </button>
                </div>
              )}
              <div className={style.taskDescription}>
                {doc.public ? (
                  <Link href={`/task/${doc.id}`}>
                    <p> {doc.task} </p>
                  </Link>
                ) : (
                  <p> {doc.task} </p>
                )}
                <button
                  className={style.buttonTrash}
                  onClick={() => handleDeleteTask(doc.id)}
                >
                  <FaTrash size={25} color="red" />
                </button>
              </div>
            </article>
          ))}
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
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};
