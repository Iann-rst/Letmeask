/**
 * Criação do componente Questions
 */
import {ReactNode} from 'react'
import '../styles/question.scss';
import cx from 'classnames';

//Tipagem das propriedades que o componente recebe
type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean;
}

export function Question({
  content, 
  author, 
  isAnswered = false, 
  isHighLighted=false, 
  children
}: QuestionProps){
  return(
    <div 
      className = {cx(
        'question',
        {answered: isAnswered}, 
        {highlighted: isHighLighted && !isAnswered},
        )}
    /*{`question ${isAnswered ? 'answered' : ''} ${(isHighLighted && !isAnswered) ? 'highlighted' : ''}`}*/
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}