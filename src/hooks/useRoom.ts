/*Criando Hook useRoom 
* Compartilhar a lógica da sala de admin e a sala de visitantes
*/

import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type QuestionType = {
  id: string;
  author: {
    name: string,
    avatar: string,
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}
type FireBaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}>

export function useRoom(roomId: string){
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
        }
      })

      setTitle(databaseRoom.title); //Titulo da sala
      setQuestions(parsedQuestions); //Perguntas da sala
    })
  }, [roomId]);

  return { questions, title}
}