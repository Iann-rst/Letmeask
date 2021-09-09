/*Criando Hook useRoom 
* Compartilhar a lógica da sala de admin e a sala de visitantes
*/

import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string,
    avatar: string,
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}
type FireBaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

export function useRoom(roomId: string){
  const {user} = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(()=>{
    //Ficar "observando" a sala
    const roomRef = database.ref(`rooms/${roomId}`);

    //"Observando as perguntas que contem na sala"
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FireBaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })

      setTitle(databaseRoom.title); //Titulo da sala
      setQuestions(parsedQuestions); //Perguntas da sala
    })

    return ()=>{
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return { questions, title}
}